import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Public endpoint to get system stats for landing page
export async function GET() {
  try {
    const [totalUsers, totalInvoices, totalBusinesses] = await Promise.all([
      prisma.user.count({ where: { isSuperAdmin: false } }),
      prisma.invoice.count(),
      prisma.business.count({ where: { approved: true, status: 'active' } })
    ])

    return NextResponse.json({
      success: true,
      stats: {
        activeUsers: totalUsers,
        documentsGenerated: totalInvoices,
        activeBusinesses: totalBusinesses,
        uptime: '99.9%',
        support: '24/7'
      }
    })
  } catch (error) {
    // Return default values if database is not available
    return NextResponse.json({
      success: true,
      stats: {
        activeUsers: 0,
        documentsGenerated: 0,
        activeBusinesses: 0,
        uptime: '99.9%',
        support: '24/7'
      }
    })
  }
}
