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
      address,
      city,
      state,
      zipCode,
      country,
      taxId,
      website,

      // User Info
      firstName,
      lastName,
      email,
      password,
    } = body

    // Validation
    if (!businessName || !businessEmail || !firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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
        }
      })

      // Create default business settings
      await tx.businessSettings.create({
        data: {
          businessId: business.id,
          invoicePrefix: 'INV',
          nextInvoiceNumber: 1001,
          paymentTermsDays: 30,
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
