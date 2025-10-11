import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import { sendApprovalEmail } from '@/lib/email'

// POST - Approve or reject a business
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { businessId, action } = body

    if (!businessId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get SuperAdmin from auth cookie
    const cookieStore = cookies()
    const authCookie = cookieStore.get('auth-token')

    if (!authCookie) {
      return NextResponse.json(
        { error: 'Unauthorized: Not logged in' },
        { status: 401 }
      )
    }

    let sessionData
    try {
      sessionData = JSON.parse(authCookie.value)
    } catch {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid session' },
        { status: 401 }
      )
    }

    // Verify SuperAdmin
    const superAdmin = await prisma.user.findUnique({
      where: { id: sessionData.userId }
    })

    if (!superAdmin || !superAdmin.isSuperAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized: SuperAdmin access required' },
        { status: 403 }
      )
    }

    // Find business with admin users
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      include: {
        users: {
          where: {
            role: 'admin'
          }
        }
      }
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
          approvedBy: superAdmin.id
        }
      })

      // Send approval email to business admin and business email if provided
      try {
        const adminUser = business.users[0]
        if (adminUser) {
          // Send to business admin email
          await sendApprovalEmail(
            adminUser.email,
            business.name,
            `${adminUser.firstName} ${adminUser.lastName}`
          )

          // Also send to business email if it's different from admin email
          if (business.email && business.email !== adminUser.email) {
            await sendApprovalEmail(
              business.email,
              business.name,
              `${adminUser.firstName} ${adminUser.lastName}`
            )
          }
        }
      } catch (emailError) {
        console.error('Failed to send approval email:', emailError)
        // Don't fail the approval if email fails
      }

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
