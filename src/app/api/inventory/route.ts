import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET inventory with stock levels
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get('businessId')
    const lowStock = searchParams.get('lowStock') === 'true'

    if (!businessId) {
      return NextResponse.json(
        { error: 'businessId is required' },
        { status: 400 }
      )
    }

    const where: any = {
      businessId,
      trackInventory: true
    }

    // Filter for low stock items
    if (lowStock) {
      const products = await prisma.product.findMany({
        where: {
          ...where,
          status: 'active'
        },
        orderBy: {
          stockQuantity: 'asc'
        }
      })

      const lowStockItems = products.filter(p =>
        p.lowStockAlert && p.stockQuantity <= p.lowStockAlert
      )

      return NextResponse.json({ products: lowStockItems })
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({ products })

  } catch (error) {
    console.error('Error fetching inventory:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    )
  }
}

// POST - Add stock (upload/restock)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      businessId,
      productId,
      quantity,
      reason,
      notes,
      createdBy
    } = body

    if (!businessId || !productId || !quantity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (quantity <= 0) {
      return NextResponse.json(
        { error: 'Quantity must be positive' },
        { status: 400 }
      )
    }

    const result = await prisma.$transaction(async (tx) => {
      // Get current product
      const product = await tx.product.findUnique({
        where: { id: productId }
      })

      if (!product) {
        throw new Error('Product not found')
      }

      if (product.businessId !== businessId) {
        throw new Error('Unauthorized')
      }

      const previousQty = product.stockQuantity
      const newQty = previousQty + quantity

      // Update stock
      const updatedProduct = await tx.product.update({
        where: { id: productId },
        data: {
          stockQuantity: newQty,
          trackInventory: true // Enable tracking when stock is added
        }
      })

      // Record movement
      await tx.stockMovement.create({
        data: {
          businessId,
          productId,
          type: 'in',
          quantity,
          previousQty,
          newQty,
          reason: reason || 'Stock added',
          notes,
          createdBy
        }
      })

      return updatedProduct
    })

    return NextResponse.json({
      success: true,
      product: result
    })

  } catch (error: any) {
    console.error('Error adding stock:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to add stock' },
      { status: 500 }
    )
  }
}

// PUT - Adjust stock (correction)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      businessId,
      productId,
      newQuantity,
      reason,
      notes,
      createdBy
    } = body

    if (!businessId || !productId || newQuantity === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (newQuantity < 0) {
      return NextResponse.json(
        { error: 'Quantity cannot be negative' },
        { status: 400 }
      )
    }

    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId }
      })

      if (!product || product.businessId !== businessId) {
        throw new Error('Product not found')
      }

      const previousQty = product.stockQuantity
      const quantityChange = newQuantity - previousQty

      // Update stock
      const updatedProduct = await tx.product.update({
        where: { id: productId },
        data: {
          stockQuantity: newQuantity
        }
      })

      // Record adjustment
      await tx.stockMovement.create({
        data: {
          businessId,
          productId,
          type: 'adjustment',
          quantity: Math.abs(quantityChange),
          previousQty,
          newQty: newQuantity,
          reason: reason || 'Stock adjustment',
          notes,
          createdBy
        }
      })

      return updatedProduct
    })

    return NextResponse.json({
      success: true,
      product: result
    })

  } catch (error: any) {
    console.error('Error adjusting stock:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to adjust stock' },
      { status: 500 }
    )
  }
}
