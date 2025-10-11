import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'

// GET - Get current user session
export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const authCookie = cookieStore.get('auth-token')

    if (!authCookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const sessionData = JSON.parse(authCookie.value)

    const user = await prisma.user.findUnique({
      where: { id: sessionData.userId },
      include: {
        business: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      userId: user.id,
      businessId: user.business?.id || null,
      businessName: user.business?.name || null,
      isSuperAdmin: user.isSuperAdmin
    })

  } catch (error) {
    console.error('Error fetching session:', error)
    return NextResponse.json(
      { error: 'Failed to fetch session' },
      { status: 500 }
    )
  }
}
