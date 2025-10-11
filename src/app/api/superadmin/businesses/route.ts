import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET all businesses with stats
export async function GET(request: NextRequest) {
  try {
    const businesses = await prisma.business.findMany({
      include: {
        users: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            status: true
          }
        },
        _count: {
          select: {
            users: true,
            invoices: true,
            customers: true,
            products: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate total revenue for each business
    const businessesWithStats = await Promise.all(
      businesses.map(async (business) => {
        const invoices = await prisma.invoice.findMany({
          where: { businessId: business.id, status: 'paid' },
          select: { totalAmount: true }
        })

        const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0)

        return {
          ...business,
          stats: {
            users: business._count.users,
            invoices: business._count.invoices,
            customers: business._count.customers,
            products: business._count.products,
            revenue: totalRevenue
          }
        }
      })
    )

    return NextResponse.json({
      success: true,
      businesses: businessesWithStats
    })

  } catch (error) {
    console.error('Error fetching businesses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch businesses' },
      { status: 500 }
    )
  }
}
