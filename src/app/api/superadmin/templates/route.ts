import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

// GET - List all templates
export async function GET(request: NextRequest) {
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

    // Fetch all templates
    const templates = await prisma.template.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      templates
    })

  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}

// POST - Upload new template
export async function POST(request: NextRequest) {
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

    const formData = await request.formData()
    const file = formData.get('file') as File
    const name = formData.get('name') as string
    const description = formData.get('description') as string

    if (!file || !name) {
      return NextResponse.json(
        { error: 'File and name are required' },
        { status: 400 }
      )
    }

    // Get file extension
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    const allowedTypes = ['html', 'pdf', 'docx', 'doc']

    if (!fileExtension || !allowedTypes.includes(fileExtension)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: html, pdf, docx' },
        { status: 400 }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'templates')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (err) {
      // Directory might already exist
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const filePath = path.join(uploadsDir, fileName)

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Create template record
    const template = await prisma.template.create({
      data: {
        name,
        description: description || null,
        fileUrl: `/uploads/templates/${fileName}`,
        fileType: fileExtension,
        fileName: file.name,
        fileSize: file.size,
        isVisible: true,
        createdBy: user.id
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Template uploaded successfully',
      template
    })

  } catch (error) {
    console.error('Error uploading template:', error)
    return NextResponse.json(
      { error: 'Failed to upload template' },
      { status: 500 }
    )
  }
}
