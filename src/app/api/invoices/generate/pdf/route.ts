import { NextRequest, NextResponse } from 'next/server'
import { getInvoicePDFBlob } from '@/lib/invoice-pdf'
import { readFile } from 'fs/promises'
import { join } from 'path'

async function convertLogoToBase64(logoPath: string): Promise<string | undefined> {
  try {
    if (!logoPath) return undefined

    // If it's already a data URL, return it
    if (logoPath.startsWith('data:')) {
      return logoPath
    }

    // Convert relative path to absolute
    const absolutePath = join(process.cwd(), 'public', logoPath)

    // Read the file
    const fileBuffer = await readFile(absolutePath)

    // Determine the mime type based on file extension
    const extension = logoPath.split('.').pop()?.toLowerCase()
    const mimeTypes: Record<string, string> = {
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'svg': 'image/svg+xml',
      'webp': 'image/webp'
    }
    const mimeType = mimeTypes[extension || 'png'] || 'image/png'

    // Convert to base64
    const base64 = fileBuffer.toString('base64')
    return `data:${mimeType};base64,${base64}`
  } catch (error) {
    console.error('Error converting logo to base64:', error)
    return undefined
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { invoiceData } = body

    if (!invoiceData) {
      return NextResponse.json({ error: 'Invoice data is required' }, { status: 400 })
    }

    // Convert logo to base64 if present
    if (invoiceData.businessLogo) {
      invoiceData.businessLogo = await convertLogoToBase64(invoiceData.businessLogo)
    }

    // Generate PDF
    const pdfBlob = getInvoicePDFBlob(invoiceData)

    // Return PDF as response
    return new NextResponse(pdfBlob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Invoice-${invoiceData.invoiceNumber || 'draft'}.pdf"`
      }
    })

  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}
