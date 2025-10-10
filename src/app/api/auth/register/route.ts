import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      // Business Info
      businessName,
      businessEmail,
      businessPhone,
      industry,
      businessType,
      website,
      description,

      // Address
      address,
      city,
      state,
      zipCode,
      country,

      // Tax & Legal
      taxId,
      registrationNumber,

      // User Info
      firstName,
      lastName,
      email,
      password,

      // Settings
      currency,
      timezone,
      fiscalYearEnd,
    } = body

    // Validation
    if (!businessName || !businessEmail || !firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Password validation
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Check if business email already exists
    const existingBusiness = await prisma.business.findUnique({
      where: { email: businessEmail }
    })

    if (existingBusiness) {
      return NextResponse.json(
        { error: 'Business email already registered' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create business with user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create business
      const business = await tx.business.create({
        data: {
          name: businessName,
          email: businessEmail,
          phone: businessPhone,
          address,
          city,
          state,
          zipCode,
          country: country || 'USA',
          taxId,
          website,
          currency: currency || 'USD',
          timezone: timezone || 'UTC',
        }
      })

      // Generate invoice prefix from business name
      const invoicePrefix = businessName
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 3) || 'INV'

      // Create default business settings
      await tx.businessSettings.create({
        data: {
          businessId: business.id,
          invoicePrefix,
          nextInvoiceNumber: 1001,
          paymentTermsDays: 30,
          invoiceTerms: 'Payment is due within 30 days from the invoice date. Late payments may be subject to additional fees.',
          invoiceNotes: 'Thank you for your business!',
        }
      })

      // Create admin user for this business
      const user = await tx.user.create({
        data: {
          businessId: business.id,
          email,
          password: hashedPassword,
          firstName,
          lastName,
          role: 'admin', // First user is always admin
        }
      })

      return { business, user }
    })

    return NextResponse.json({
      success: true,
      message: 'Business registered successfully',
      data: {
        businessId: result.business.id,
        businessName: result.business.name,
        userId: result.user.id,
        userEmail: result.user.email,
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to register business' },
      { status: 500 }
    )
  }
}
