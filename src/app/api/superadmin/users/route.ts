import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET all users across all businesses
export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      where: {
        isSuperAdmin: false // Exclude SuperAdmin from listing
      },
      include: {
        business: {
          select: {
            id: true,
            name: true,
            email: true,
            status: true,
            approved: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      users
    })

  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
