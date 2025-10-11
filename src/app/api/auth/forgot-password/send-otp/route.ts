import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendPasswordResetOTP } from '@/lib/email'

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, emailType } = body

    if (!email || !emailType) {
      return NextResponse.json(
        { error: 'Email and email type are required' },
        { status: 400 }
      )
    }

    let user = null

    if (emailType === 'admin') {
      // Find user by admin email
      user = await prisma.user.findUnique({
        where: { email }
      })
    } else if (emailType === 'business') {
      // Find business by business email, then get admin user
      const business = await prisma.business.findFirst({
        where: { email },
        include: {
          users: {
            where: { role: 'admin' },
            take: 1
          }
        }
      })

      if (business && business.users.length > 0) {
        user = business.users[0]
      }
    }

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        success: true,
        message: 'If the email exists, an OTP has been sent'
      })
    }

    // Generate OTP
    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store OTP in database
    await prisma.passwordReset.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        otp,
        expiresAt
      },
      update: {
        otp,
        expiresAt,
        verified: false
      }
    })

    // Send OTP via email - send to the provided email (either admin or business)
    try {
      await sendPasswordResetOTP(
        email,
        otp,
        `${user.firstName} ${user.lastName}`
      )
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError)
      return NextResponse.json(
        { error: 'Failed to send OTP email' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent to your email'
    })

  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    )
  }
}
