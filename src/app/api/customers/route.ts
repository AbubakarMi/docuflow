import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { nanoid } from 'nanoid'

// GET all customers for a business
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get('businessId')

    if (!businessId) {
      return NextResponse.json(
        { error: 'businessId is required' },
        { status: 400 }
      )
    }

    const customers = await prisma.customer.findMany({
      where: { businessId },
      include: {
        invoices: {
          select: {
            id: true,
            invoiceNumber: true,
            totalAmount: true,
            balanceDue: true,
            status: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ customers })

  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}

// CREATE new customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      businessId,
      name,
      email,
      phone,
      company,
      address,
      city,
      state,
      zipCode,
      country,
      taxId,
      creditLimit,
    } = body

    if (!businessId || !name || !email) {
      return NextResponse.json(
        { error: 'businessId, name, and email are required' },
        { status: 400 }
      )
    }

    // Generate unique customer code
    const customerCode = `CUST-${nanoid(8).toUpperCase()}`

    const customer = await prisma.customer.create({
      data: {
        businessId,
        customerCode,
        name,
        email,
        phone,
        company,
        address,
        city,
        state,
        zipCode,
        country,
        taxId,
        creditLimit: creditLimit ? parseFloat(creditLimit) : null,
      }
    })

    return NextResponse.json({
      success: true,
      customer
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    )
  }
}
