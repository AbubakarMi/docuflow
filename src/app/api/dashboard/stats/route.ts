import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserFromCookie } from '@/lib/auth-utils'

// Cache stats for 5 minutes per business
const statsCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromCookie()

    if (!user || !user.businessId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const businessId = user.businessId

    // Check cache first
    const cached = statsCache.get(businessId)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json({
        success: true,
        stats: cached.data,
        cached: true
      })
    }

    // Get current date ranges
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)
    const startOfYear = new Date(now.getFullYear(), 0, 1)

    // Fetch all invoices for the business
    const invoices = await prisma.invoice.findMany({
      where: { businessId },
      select: {
        id: true,
        totalAmount: true,
        status: true,
        createdAt: true,
        items: {
          select: {
            quantity: true,
            unitPrice: true,
            description: true,
            product: {
              select: {
                id: true,
                name: true,
                cost: true
              }
            }
          }
        }
      }
    })

    // Calculate revenue, cost, and track best-selling items
    let totalRevenue = 0
    let totalCost = 0
    let revenueThisMonth = 0
    let revenueLastMonth = 0

    const monthlyData: Record<string, { revenue: number; cost: number }> = {}
    const itemSales: Record<string, { name: string; quantity: number; revenue: number }> = {}

    for (const invoice of invoices) {
      const invoiceRevenue = Number(invoice.totalAmount)
      totalRevenue += invoiceRevenue

      // Calculate cost from invoice items and track sales
      let invoiceCost = 0
      for (const item of invoice.items) {
        const cost = item.product?.cost || 0
        invoiceCost += Number(cost) * item.quantity

        // Track item sales for best-selling items
        const itemName = item.product?.name || item.description
        const itemRevenue = Number(item.unitPrice) * item.quantity

        if (itemName) {
          if (!itemSales[itemName]) {
            itemSales[itemName] = { name: itemName, quantity: 0, revenue: 0 }
          }
          itemSales[itemName].quantity += item.quantity
          itemSales[itemName].revenue += itemRevenue
        }
      }
      totalCost += invoiceCost

      // Monthly breakdown
      const monthKey = new Date(invoice.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { revenue: 0, cost: 0 }
      }
      monthlyData[monthKey].revenue += invoiceRevenue
      monthlyData[monthKey].cost += invoiceCost

      // This month vs last month
      if (invoice.createdAt >= startOfMonth) {
        revenueThisMonth += invoiceRevenue
      } else if (invoice.createdAt >= startOfLastMonth && invoice.createdAt <= endOfLastMonth) {
        revenueLastMonth += invoiceRevenue
      }
    }

    // Calculate profit
    const totalProfit = totalRevenue - totalCost

    // Calculate growth percentages
    const revenueGrowth = revenueLastMonth > 0
      ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100
      : 0

    // Get invoice count
    const invoiceCount = invoices.length
    const invoicesThisMonth = invoices.filter(inv => inv.createdAt >= startOfMonth).length

    // Generate 12 months of data
    const last12Months = []
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthName = monthNames[date.getMonth()]
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

      const data = monthlyData[monthKey] || { revenue: 0, cost: 0 }

      last12Months.push({
        month: monthName,
        revenue: data.revenue,
        cost: data.cost,
        profit: data.revenue - data.cost
      })
    }

    const statsData = {
      totalRevenue,
      totalCost,
      totalProfit,
      invoiceCount,
      revenueGrowth: Number(revenueGrowth.toFixed(1)),
      monthlyData: last12Months
    }

    // Cache the results
    statsCache.set(businessId, {
      data: statsData,
      timestamp: Date.now()
    })

    // Clean up old cache entries
    for (const [key, value] of statsCache.entries()) {
      if (Date.now() - value.timestamp > CACHE_DURATION) {
        statsCache.delete(key)
      }
    }

    return NextResponse.json({
      success: true,
      stats: statsData
    })

  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}
