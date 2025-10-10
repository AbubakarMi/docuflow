import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    // Clear all authentication cookies
    const cookieStore = cookies()

    // Clear session cookie (if using sessions)
    cookieStore.delete('session')
    cookieStore.delete('token')
    cookieStore.delete('auth-token')

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    )
  }
}
