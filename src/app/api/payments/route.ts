import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generatePaymentNumber } from '@/lib/auth'

// GET all payments for a business
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get('businessId')
    const invoiceId = searchParams.get('invoiceId')

    if (!businessId) {
      return NextResponse.json(
        { error: 'businessId is required' },
        { status: 400 }
      )
    }

    const where: any = { businessId }
    if (invoiceId) {
      where.invoiceId = invoiceId
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        invoice: {
          select: {
            invoiceNumber: true,
            customer: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ payments })

  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}

// CREATE new payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      businessId,
      invoiceId,
      amount,
      paymentDate,
      paymentMethod,
      transactionId,
      checkNumber,
      notes,
    } = body

    if (!businessId || !invoiceId || !amount || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get invoice
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId }
    })

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      )
    }

    // Get payment count for this business to generate payment number
    const paymentCount = await prisma.payment.count({
      where: { businessId }
    })

    const paymentNumber = generatePaymentNumber(paymentCount + 1)
    const paymentAmount = parseFloat(amount)

    // Create payment and update invoice in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create payment
      const payment = await tx.payment.create({
        data: {
          businessId,
          invoiceId,
          paymentNumber,
          amount: paymentAmount,
          paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
          paymentMethod,
          transactionId,
          checkNumber,
          notes,
          status: 'completed',
        }
      })

      // Update invoice
      const newPaidAmount = invoice.paidAmount + paymentAmount
      const newBalanceDue = invoice.totalAmount - newPaidAmount
      const newStatus = newBalanceDue <= 0 ? 'paid' : invoice.status

      await tx.invoice.update({
        where: { id: invoiceId },
        data: {
          paidAmount: newPaidAmount,
          balanceDue: newBalanceDue,
          status: newStatus,
          paidDate: newBalanceDue <= 0 ? new Date() : null,
        }
      })

      return payment
    })

    return NextResponse.json({
      success: true,
      payment: result
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}
