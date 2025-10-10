import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// POST - Approve or reject a business
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { businessId, superAdminId, action } = body

    if (!businessId || !superAdminId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify SuperAdmin
    const superAdmin = await prisma.user.findUnique({
      where: { id: superAdminId }
    })

    if (!superAdmin || !superAdmin.isSuperAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized: SuperAdmin access required' },
        { status: 403 }
      )
    }

    // Find business
    const business = await prisma.business.findUnique({
      where: { id: businessId }
    })

    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      )
    }

    if (action === 'approve') {
      // Approve business
      const updatedBusiness = await prisma.business.update({
        where: { id: businessId },
        data: {
          approved: true,
          approvedAt: new Date(),
          approvedBy: superAdminId
        }
      })

      return NextResponse.json({
        success: true,
        message: `Business "${business.name}" has been approved`,
        business: updatedBusiness
      })

    } else if (action === 'reject') {
      // Reject business by setting status to suspended
      const updatedBusiness = await prisma.business.update({
        where: { id: businessId },
        data: {
          status: 'suspended',
          approved: false
        }
      })

      return NextResponse.json({
        success: true,
        message: `Business "${business.name}" has been rejected`,
        business: updatedBusiness
      })

    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "approve" or "reject"' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error processing business approval:', error)
    return NextResponse.json(
      { error: 'Failed to process business approval' },
      { status: 500 }
    )
  }
}
