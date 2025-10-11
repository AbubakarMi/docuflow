import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'

// GET - Get chat messages for a business
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

    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get('businessId')

    let messages

    if (user.isSuperAdmin) {
      // SuperAdmin can see all messages or filter by business
      if (businessId) {
        messages = await prisma.chatMessage.findMany({
          where: { businessId },
          include: {
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                isSuperAdmin: true
              }
            },
            business: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: { createdAt: 'asc' },
          take: 100
        })
      } else {
        // Get latest message from each business
        const businesses = await prisma.business.findMany({
          where: { approved: true },
          select: { id: true, name: true }
        })

        const businessesWithMessages = await Promise.all(
          businesses.map(async (business) => {
            const lastMessage = await prisma.chatMessage.findFirst({
              where: { businessId: business.id },
              include: {
                sender: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    isSuperAdmin: true
                  }
                }
              },
              orderBy: { createdAt: 'desc' }
            })

            const unreadCount = await prisma.chatMessage.count({
              where: {
                businessId: business.id,
                isRead: false,
                sender: { isSuperAdmin: false }
              }
            })

            return {
              business,
              lastMessage,
              unreadCount
            }
          })
        )

        return NextResponse.json({
          success: true,
          conversations: businessesWithMessages.filter(b => b.lastMessage)
        })
      }
    } else {
      // Regular user can only see their business messages
      if (!user.businessId) {
        return NextResponse.json({ error: 'No business associated' }, { status: 403 })
      }

      messages = await prisma.chatMessage.findMany({
        where: { businessId: user.businessId },
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              isSuperAdmin: true
            }
          }
        },
        orderBy: { createdAt: 'asc' },
        take: 100
      })
    }

    return NextResponse.json({
      success: true,
      messages
    })

  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

// POST - Send a message
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
    const { message, businessId } = body

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Determine business ID
    let targetBusinessId = businessId

    if (!user.isSuperAdmin) {
      // Regular users can only send to their own business
      if (!user.businessId) {
        return NextResponse.json({ error: 'No business associated' }, { status: 403 })
      }
      targetBusinessId = user.businessId
    } else {
      // SuperAdmin must specify business
      if (!businessId) {
        return NextResponse.json({ error: 'Business ID required' }, { status: 400 })
      }
    }

    // Create message
    const chatMessage = await prisma.chatMessage.create({
      data: {
        businessId: targetBusinessId,
        senderId: user.id,
        message: message.trim(),
        isRead: false
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            isSuperAdmin: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: chatMessage
    })

  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
