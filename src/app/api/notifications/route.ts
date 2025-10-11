import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'

// GET - Get notifications for current user
export async function GET(request: NextRequest) {
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

    let notifications

    if (user.isSuperAdmin) {
      // SuperAdmin gets notifications with userId = null (system-wide)
      notifications = await prisma.notification.findMany({
        where: {
          OR: [
            { userId: null },
            { userId: user.id }
          ]
        },
        orderBy: { createdAt: 'desc' },
        take: 50
      })
    } else {
      // Regular user gets notifications for their user ID and business
      notifications = await prisma.notification.findMany({
        where: {
          OR: [
            { userId: user.id },
            { businessId: user.businessId, userId: null }
          ]
        },
        orderBy: { createdAt: 'desc' },
        take: 50
      })
    }

    const unreadCount = notifications.filter(n => !n.isRead).length

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount
    })

  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

// POST - Create notification (internal use or for SuperAdmin)
export async function POST(request: NextRequest) {
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
    const { title, message, type, userId, businessId, actionUrl } = body

    if (!title || !message || !type) {
      return NextResponse.json(
        { error: 'Title, message, and type are required' },
        { status: 400 }
      )
    }

    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        type,
        userId: userId || null,
        businessId: businessId || null,
        actionUrl: actionUrl || null
      }
    })

    return NextResponse.json({
      success: true,
      notification
    })

  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    )
  }
}
