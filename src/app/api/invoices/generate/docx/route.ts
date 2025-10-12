import { NextRequest, NextResponse } from 'next/server'
import { generateInvoiceDOCX } from '@/lib/invoice-docx'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { invoiceData } = body

    if (!invoiceData) {
      return NextResponse.json({ error: 'Invoice data is required' }, { status: 400 })
    }

    // Generate DOCX
    const buffer = await generateInvoiceDOCX(invoiceData)

    // Return DOCX as response
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="Invoice-${invoiceData.invoiceNumber || 'draft'}.docx"`
      }
    })

  } catch (error) {
    console.error('Error generating DOCX:', error)
    return NextResponse.json(
      { error: 'Failed to generate DOCX' },
      { status: 500 }
    )
  }
}
