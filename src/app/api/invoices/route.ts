import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateInvoiceNumber } from '@/lib/auth'

// GET all invoices for a business
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get('businessId')
    const status = searchParams.get('status')

    if (!businessId) {
      return NextResponse.json(
        { error: 'businessId is required' },
        { status: 400 }
      )
    }

    const where: any = { businessId }
    if (status) {
      where.status = status
    }

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        customer: true,
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ invoices })

  } catch (error) {
    console.error('Error fetching invoices:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    )
  }
}

// CREATE new invoice
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      businessId,
      customerId,
      items,
      issueDate,
      dueDate,
      notes,
      terms,
      internalNotes,
      createdById,
    } = body

    if (!businessId || !customerId || !items || items.length === 0 || !createdById) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get business settings for invoice number
    const settings = await prisma.businessSettings.findUnique({
      where: { businessId }
    })

    if (!settings) {
      return NextResponse.json(
        { error: 'Business settings not found' },
        { status: 404 }
      )
    }

    // Validate stock availability for products
    const stockErrors = []
    for (const item of items) {
      if (item.productId) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId }
        })

        if (product && product.trackInventory) {
          if (product.stockQuantity < item.quantity) {
            stockErrors.push({
              product: product.name,
              available: product.stockQuantity,
              requested: item.quantity
            })
          }
        }
      }
    }

    if (stockErrors.length > 0) {
      return NextResponse.json(
        {
          error: 'Insufficient stock',
          details: stockErrors
        },
        { status: 400 }
      )
    }

    // Calculate totals
    let subtotal = 0
    let taxAmount = 0

    const processedItems = items.map((item: any) => {
      const itemSubtotal = item.quantity * item.unitPrice
      const discount = (itemSubtotal * (item.discountPercent || 0)) / 100
      const taxableAmount = itemSubtotal - discount
      const itemTax = (taxableAmount * (item.taxRate || 0)) / 100
      const amount = taxableAmount + itemTax

      subtotal += itemSubtotal
      taxAmount += itemTax

      return {
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        taxRate: item.taxRate || 0,
        discountPercent: item.discountPercent || 0,
        amount,
        productId: item.productId || null,
      }
    })

    const totalAmount = subtotal + taxAmount
    const balanceDue = totalAmount

    // Create invoice in transaction with stock deduction
    const invoice = await prisma.$transaction(async (tx) => {
      // Generate invoice number
      const invoiceNumber = generateInvoiceNumber(
        settings.invoicePrefix,
        settings.nextInvoiceNumber
      )

      // Create invoice
      const newInvoice = await tx.invoice.create({
        data: {
          businessId,
          customerId,
          invoiceNumber,
          issueDate: issueDate ? new Date(issueDate) : new Date(),
          dueDate: new Date(dueDate),
          subtotal,
          taxAmount,
          discountAmount: 0,
          totalAmount,
          paidAmount: 0,
          balanceDue,
          status: 'draft',
          notes,
          terms: terms || settings.invoiceTerms || null,
          internalNotes,
          createdById,
          items: {
            create: processedItems
          }
        },
        include: {
          customer: true,
          items: {
            include: {
              product: true
            }
          },
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

      // Update next invoice number
      await tx.businessSettings.update({
        where: { businessId },
        data: {
          nextInvoiceNumber: settings.nextInvoiceNumber + 1
        }
      })

      // Deduct stock for each product in the invoice
      for (const item of items) {
        if (item.productId) {
          const product = await tx.product.findUnique({
            where: { id: item.productId }
          })

          if (product && product.trackInventory) {
            const previousQty = product.stockQuantity
            const newQty = previousQty - item.quantity

            // Update product stock
            await tx.product.update({
              where: { id: item.productId },
              data: {
                stockQuantity: newQty
              }
            })

            // Create stock movement record
            await tx.stockMovement.create({
              data: {
                businessId,
                productId: item.productId,
                type: 'out',
                quantity: item.quantity,
                previousQty,
                newQty,
                invoiceId: newInvoice.id,
                reason: `Stock sold via invoice ${invoiceNumber}`,
                createdBy: createdById
              }
            })
          }
        }
      }

      return newInvoice
    })

    return NextResponse.json({
      success: true,
      invoice
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating invoice:', error)
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    )
  }
}
