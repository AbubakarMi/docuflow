import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: {
        customer: true,
        business: true,
        items: {
          include: {
            product: true
          }
        }
      }
    })

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      )
    }

    // Format data for PDF generation
    const pdfData = {
      invoiceNumber: invoice.invoiceNumber,
      invoiceDate: invoice.issueDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      dueDate: invoice.dueDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      status: invoice.status,

      // Business Info
      businessName: invoice.business.name,
      businessEmail: invoice.business.email,
      businessPhone: invoice.business.phone || undefined,
      businessAddress: invoice.business.address || undefined,
      businessCity: invoice.business.city || undefined,
      businessState: invoice.business.state || undefined,
      businessCountry: invoice.business.country || undefined,
      businessLogo: invoice.business.logo || undefined,

      // Customer Info
      customerName: invoice.customer.company || invoice.customer.name,
      customerEmail: invoice.customer.email,
      customerPhone: invoice.customer.phone || undefined,
      customerAddress: invoice.customer.address || undefined,
      customerCity: invoice.customer.city || undefined,
      customerState: invoice.customer.state || undefined,
      customerCountry: invoice.customer.country || undefined,

      // Invoice Items
      items: invoice.items.map(item => ({
        productName: item.product?.name || item.description,
        description: item.description !== item.product?.name ? item.description : undefined,
        quantity: item.quantity,
        price: parseFloat(item.unitPrice.toString()),
        amount: parseFloat(item.amount.toString())
      })),

      // Totals
      subtotal: parseFloat(invoice.subtotal.toString()),
      taxRate: invoice.taxAmount > 0 ? parseFloat(((invoice.taxAmount / invoice.subtotal) * 100).toFixed(2)) : undefined,
      taxAmount: invoice.taxAmount > 0 ? parseFloat(invoice.taxAmount.toString()) : undefined,
      discount: invoice.discountAmount > 0 ? parseFloat(invoice.discountAmount.toString()) : undefined,
      total: parseFloat(invoice.totalAmount.toString()),
      currency: invoice.business.currency,

      // Optional
      notes: invoice.notes || undefined,
      terms: invoice.terms || undefined
    }

    // Convert logo to base64 if present
    if (pdfData.businessLogo) {
      pdfData.businessLogo = await convertLogoToBase64(pdfData.businessLogo)
    }

    // Generate PDF
    const pdfBlob = getInvoicePDFBlob(pdfData)

    // Return PDF as response
    return new NextResponse(pdfBlob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Invoice-${invoice.invoiceNumber}.pdf"`
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
