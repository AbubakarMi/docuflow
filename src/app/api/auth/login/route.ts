import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyPassword } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Username/Email and password are required' },
        { status: 400 }
      )
    }

    // Find user by username OR email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: email }
        ]
      },
      include: {
        business: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check if business is approved (skip for SuperAdmin)
    if (!user.isSuperAdmin && user.business && !user.business.approved) {
      return NextResponse.json(
        { error: 'Your business is pending SuperAdmin approval', pendingApproval: true },
        { status: 403 }
      )
    }

    // Check if business is active (skip for SuperAdmin)
    if (!user.isSuperAdmin && user.business && user.business.status !== 'active') {
      return NextResponse.json(
        { error: 'Business account is suspended' },
        { status: 403 }
      )
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    })

    // Set authentication cookie
    const cookieStore = cookies()
    const sessionData = JSON.stringify({
      userId: user.id,
      businessId: user.businessId,
      isSuperAdmin: user.isSuperAdmin,
      email: user.email
    })

    cookieStore.set('auth-token', sessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      isSuperAdmin: user.isSuperAdmin,
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    )
  }
}
