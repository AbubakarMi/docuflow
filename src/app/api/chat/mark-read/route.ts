import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'

// PATCH - Mark messages as read
export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const authCookie = cookieStore.get('auth-token')

    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sessionData = JSON.parse(authCookie.value)
    const user = await prisma.user.findUnique({
      where: { id: sessionData.userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { businessId } = body

    if (user.isSuperAdmin) {
      // SuperAdmin marks business messages as read
      await prisma.chatMessage.updateMany({
        where: {
          businessId,
          isRead: false,
          sender: { isSuperAdmin: false }
        },
        data: { isRead: true }
      })
    } else {
      // Business user marks SuperAdmin messages as read
      if (!user.businessId) {
        return NextResponse.json({ error: 'No business associated' }, { status: 403 })
      }

      await prisma.chatMessage.updateMany({
        where: {
          businessId: user.businessId,
          isRead: false,
          sender: { isSuperAdmin: true }
        },
        data: { isRead: true }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Messages marked as read'
    })

  } catch (error) {
    console.error('Error marking messages as read:', error)
    return NextResponse.json(
      { error: 'Failed to mark messages as read' },
      { status: 500 }
    )
  }
}
