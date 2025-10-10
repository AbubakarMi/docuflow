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
      businessAddress,
      businessCity,
      businessState,
      businessCountry,
      businessWebsite,
      taxId,

      // User Info
      firstName,
      lastName,
      username,
      email,
      phone,
      password,
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

    // Check if user email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User email already registered' },
        { status: 400 }
      )
    }

    // Check if username already exists (if provided)
    if (username) {
      const existingUsername = await prisma.user.findUnique({
        where: { username }
      })

      if (existingUsername) {
        return NextResponse.json(
          { error: 'Username already taken' },
          { status: 400 }
        )
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create business with user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create business (pending approval)
      const business = await tx.business.create({
        data: {
          name: businessName,
          email: businessEmail,
          phone: businessPhone,
          address: businessAddress,
          city: businessCity,
          state: businessState,
          country: businessCountry || 'USA',
          taxId,
          website: businessWebsite,
          plan: 'business',
          currency: 'USD',
          timezone: 'UTC',
          approved: false, // Requires SuperAdmin approval
          status: 'active'
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
          username: username || null,
          password: hashedPassword,
          firstName,
          lastName,
          phone,
          role: 'admin', // First user is always admin
          status: 'active'
        }
      })

      return { business, user }
    })

    return NextResponse.json({
      success: true,
      message: 'Business registered successfully! Please wait for SuperAdmin approval.',
      pendingApproval: true,
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
      { error: 'Failed to register business. Please try again.' },
      { status: 500 }
    )
  }
}
