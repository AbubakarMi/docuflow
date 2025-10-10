import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

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
        },
        payments: true
      }
    })

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      )
    }

    // Return data for client-side PDF generation
    return NextResponse.json({
      invoice: {
        invoiceNumber: invoice.invoiceNumber,
        issueDate: invoice.issueDate.toISOString().split('T')[0],
        dueDate: invoice.dueDate.toISOString().split('T')[0],
        status: invoice.status
      },
      business: {
        name: invoice.business.name,
        email: invoice.business.email,
        phone: invoice.business.phone || undefined,
        address: invoice.business.address || undefined,
        city: invoice.business.city || undefined,
        state: invoice.business.state || undefined,
        zipCode: invoice.business.zipCode || undefined,
        logo: invoice.business.logo || undefined
      },
      customer: {
        name: invoice.customer.name,
        email: invoice.customer.email,
        company: invoice.customer.company || undefined,
        address: invoice.customer.address || undefined,
        city: invoice.customer.city || undefined,
        state: invoice.customer.state || undefined,
        zipCode: invoice.customer.zipCode || undefined
      },
      items: invoice.items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        taxRate: item.taxRate,
        discountPercent: item.discountPercent,
        amount: item.amount
      })),
      totals: {
        subtotal: invoice.subtotal,
        taxAmount: invoice.taxAmount,
        discountAmount: invoice.discountAmount,
        totalAmount: invoice.totalAmount,
        paidAmount: invoice.paidAmount,
        balanceDue: invoice.balanceDue
      },
      notes: invoice.notes || undefined,
      terms: invoice.terms || undefined
    })

  } catch (error) {
    console.error('Error generating PDF data:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF data' },
      { status: 500 }
    )
  }
}
