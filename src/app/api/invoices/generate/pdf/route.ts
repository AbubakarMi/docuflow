import { NextRequest, NextResponse } from 'next/server'
import { getInvoicePDFBlob } from '@/lib/invoice-pdf'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { invoiceData } = body

    if (!invoiceData) {
      return NextResponse.json({ error: 'Invoice data is required' }, { status: 400 })
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
