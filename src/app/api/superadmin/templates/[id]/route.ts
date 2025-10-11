import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import { unlink } from 'fs/promises'
import path from 'path'

// PATCH - Toggle template visibility
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
    const { isVisible } = body

    if (typeof isVisible !== 'boolean') {
      return NextResponse.json(
        { error: 'isVisible must be a boolean' },
        { status: 400 }
      )
    }

    // Update template visibility
    const template = await prisma.template.update({
      where: { id: params.id },
      data: { isVisible }
    })

    return NextResponse.json({
      success: true,
      message: `Template ${isVisible ? 'shown' : 'hidden'} successfully`,
      template
    })

  } catch (error) {
    console.error('Error updating template:', error)
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    )
  }
}

// DELETE - Delete template
export async function DELETE(
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

    // Get template
    const template = await prisma.template.findUnique({
      where: { id: params.id }
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Delete file from filesystem
    try {
      const filePath = path.join(process.cwd(), 'public', template.fileUrl)
      await unlink(filePath)
    } catch (fileError) {
      console.error('Error deleting file:', fileError)
      // Continue with database deletion even if file deletion fails
    }

    // Delete template from database
    await prisma.template.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Template deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting template:', error)
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    )
  }
}
