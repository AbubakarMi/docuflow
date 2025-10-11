import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET pending businesses for approval
export async function GET(request: NextRequest) {
  try {
    const pendingBusinesses = await prisma.business.findMany({
      where: {
        approved: false,
        status: 'active'
      },
      include: {
        users: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      businesses: pendingBusinesses
    })

  } catch (error) {
    console.error('Error fetching pending businesses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pending businesses' },
      { status: 500 }
    )
  }
}
