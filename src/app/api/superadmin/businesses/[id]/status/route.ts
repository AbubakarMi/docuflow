import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'

// PATCH - Update business status (suspend/activate)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify SuperAdmin
    const cookieStore = cookies()
    const authCookie = cookieStore.get('auth-token')

    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sessionData = JSON.parse(authCookie.value)
    const user = await prisma.user.findUnique({
      where: { id: sessionData.userId }
    })

    if (!user || !user.isSuperAdmin) {
      return NextResponse.json({ error: 'Unauthorized: SuperAdmin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { status, suspensionReason } = body

    if (!status || !['active', 'suspended', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be active, suspended, or cancelled' },
        { status: 400 }
      )
    }

    // Validate suspension reason is provided when suspending
    if (status === 'suspended' && !suspensionReason) {
      return NextResponse.json(
        { error: 'Suspension reason is required when suspending a business' },
        { status: 400 }
      )
    }

    // Update business status
    const business = await prisma.business.update({
      where: { id: params.id },
      data: {
        status,
        suspensionReason: status === 'suspended' ? suspensionReason : null
      }
    })

    return NextResponse.json({
      success: true,
      message: `Business status updated to ${status}`,
      business
    })

  } catch (error) {
    console.error('Error updating business status:', error)
    return NextResponse.json(
      { error: 'Failed to update business status' },
      { status: 500 }
    )
  }
}
