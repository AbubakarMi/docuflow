import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

// POST - SuperAdmin creates a new business
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      businessName,
      businessEmail,
      businessPhone,
      businessAddress,
      businessCity,
      businessState,
      businessCountry,
      firstName,
      lastName,
      email,
      password,
    } = body

    // Validate required fields
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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create business and admin user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create business (auto-approved since created by SuperAdmin)
      const business = await tx.business.create({
        data: {
          name: businessName,
          email: businessEmail,
          phone: businessPhone,
          address: businessAddress,
          city: businessCity,
          state: businessState,
          country: businessCountry,
          plan: 'business',
          status: 'active',
          approved: true, // Auto-approved
          approvedAt: new Date(),
          approvedBy: 'superadmin' // You can pass actual SuperAdmin ID if available
        }
      })

      // Create admin user
      const user = await tx.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          role: 'admin',
          businessId: business.id,
          status: 'active'
        }
      })

      return { business, user }
    })

    return NextResponse.json({
      success: true,
      message: 'Business created successfully',
      data: {
        businessId: result.business.id,
        businessName: result.business.name,
        userId: result.user.id,
        userEmail: result.user.email
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating business:', error)
    return NextResponse.json(
      { error: 'Failed to create business' },
      { status: 500 }
    )
  }
}
