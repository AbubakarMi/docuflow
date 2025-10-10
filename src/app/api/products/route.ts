import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { nanoid } from 'nanoid'

// GET all products for a business
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

    const products = await prisma.product.findMany({
      where: { businessId },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ products })

  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// CREATE new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      businessId,
      name,
      description,
      category,
      price,
      cost,
      taxRate,
      trackInventory,
      stockQuantity,
      lowStockAlert,
      type,
    } = body

    if (!businessId || !name || price === undefined) {
      return NextResponse.json(
        { error: 'businessId, name, and price are required' },
        { status: 400 }
      )
    }

    // Generate unique SKU
    const sku = `SKU-${nanoid(8).toUpperCase()}`

    const product = await prisma.product.create({
      data: {
        businessId,
        sku,
        name,
        description,
        category,
        price: parseFloat(price),
        cost: cost ? parseFloat(cost) : null,
        taxRate: taxRate ? parseFloat(taxRate) : 0,
        trackInventory: trackInventory || false,
        stockQuantity: stockQuantity || 0,
        lowStockAlert: lowStockAlert || null,
        type: type || 'product',
      }
    })

    return NextResponse.json({
      success: true,
      product
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
