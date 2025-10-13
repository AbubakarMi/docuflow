import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET system-wide statistics
export async function GET(request: NextRequest) {
  try {
    // Get counts
    const [
      totalBusinesses,
      activeBusinesses,
      pendingBusinesses,
      totalUsers,
      totalInvoices,
      totalCustomers,
      totalProducts
    ] = await Promise.all([
      prisma.business.count(),
      prisma.business.count({ where: { status: 'active', approved: true } }),
      prisma.business.count({ where: { approved: false } }),
      prisma.user.count({ where: { isSuperAdmin: false } }),
      prisma.invoice.count(),
      prisma.customer.count(),
      prisma.product.count()
    ])

    // Get revenue stats
    const paidInvoices = await prisma.invoice.findMany({
      where: { status: 'paid' },
      select: { totalAmount: true, paidDate: true }
    })

    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0)

    // Calculate monthly growth
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const lastMonthRevenue = paidInvoices
      .filter(inv => inv.paidDate && inv.paidDate >= lastMonth && inv.paidDate < currentMonth)
      .reduce((sum, inv) => sum + inv.totalAmount, 0)

    const currentMonthRevenue = paidInvoices
      .filter(inv => inv.paidDate && inv.paidDate >= currentMonth)
      .reduce((sum, inv) => sum + inv.totalAmount, 0)

    const monthlyGrowth = lastMonthRevenue > 0
      ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : 0

    return NextResponse.json({
      success: true,
      stats: {
        totalBusinesses,
        activeBusinesses,
        pendingBusinesses,
        totalUsers,
        totalInvoices,
        totalCustomers,
        totalProducts,
        totalRevenue,
        monthlyGrowth: parseFloat(monthlyGrowth.toFixed(2))
      }
    })

  } catch (error) {
    console.error('Error fetching system stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch system statistics' },
      { status: 500 }
    )
  }
}
