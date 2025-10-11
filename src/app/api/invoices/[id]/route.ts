import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET single invoice
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
        payments: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
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

    return NextResponse.json({ invoice })

  } catch (error) {
    console.error('Error fetching invoice:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invoice' },
      { status: 500 }
    )
  }
}

// UPDATE invoice
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status, paidDate, notes, terms, internalNotes } = body

    const updateData: any = {}

    if (status) updateData.status = status
    if (paidDate) updateData.paidDate = new Date(paidDate)
    if (notes !== undefined) updateData.notes = notes
    if (terms !== undefined) updateData.terms = terms
    if (internalNotes !== undefined) updateData.internalNotes = internalNotes

    const invoice = await prisma.invoice.update({
      where: { id: params.id },
      data: updateData,
      include: {
        customer: true,
        items: true,
        payments: true
      }
    })

    return NextResponse.json({
      success: true,
      invoice
    })

  } catch (error) {
    console.error('Error updating invoice:', error)
    return NextResponse.json(
      { error: 'Failed to update invoice' },
      { status: 500 }
    )
  }
}

// DELETE invoice
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.invoice.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Invoice deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting invoice:', error)
    return NextResponse.json(
      { error: 'Failed to delete invoice' },
      { status: 500 }
    )
  }
}
