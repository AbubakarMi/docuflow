import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'

// PATCH - Mark notification(s) as read
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
    const { notificationId, markAll } = body

    if (markAll) {
      // Mark all notifications as read for this user
      if (user.isSuperAdmin) {
        await prisma.notification.updateMany({
          where: {
            OR: [
              { userId: null },
              { userId: user.id }
            ],
            isRead: false
          },
          data: { isRead: true }
        })
      } else {
        await prisma.notification.updateMany({
          where: {
            OR: [
              { userId: user.id },
              { businessId: user.businessId, userId: null }
            ],
            isRead: false
          },
          data: { isRead: true }
        })
      }
    } else if (notificationId) {
      // Mark single notification as read
      await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true }
      })
    } else {
      return NextResponse.json(
        { error: 'Either notificationId or markAll must be provided' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Notifications marked as read'
    })

  } catch (error) {
    console.error('Error marking notifications as read:', error)
    return NextResponse.json(
      { error: 'Failed to mark notifications as read' },
      { status: 500 }
    )
  }
}
