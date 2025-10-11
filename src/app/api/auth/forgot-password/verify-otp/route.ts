import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, otp } = body

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or OTP' },
        { status: 400 }
      )
    }

    // Find password reset record
    const passwordReset = await prisma.passwordReset.findUnique({
      where: { userId: user.id }
    })

    if (!passwordReset) {
      return NextResponse.json(
        { error: 'No OTP request found' },
        { status: 400 }
      )
    }

    // Check if OTP matches
    if (passwordReset.otp !== otp) {
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 400 }
      )
    }

    // Check if OTP is expired
    if (new Date() > passwordReset.expiresAt) {
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Mark OTP as verified
    await prisma.passwordReset.update({
      where: { userId: user.id },
      data: { verified: true }
    })

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully'
    })

  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    )
  }
}
