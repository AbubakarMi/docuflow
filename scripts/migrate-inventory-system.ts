import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔧 Migrating to inventory system...\n')

  try {
    // Create StockMovement table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "stock_movements" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "businessId" TEXT NOT NULL,
        "productId" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "quantity" INTEGER NOT NULL,
        "previousQty" INTEGER NOT NULL,
        "newQty" INTEGER NOT NULL,
        "invoiceId" TEXT,
        "reason" TEXT,
        "notes" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "createdBy" TEXT,

        CONSTRAINT "stock_movements_productId_fkey"
          FOREIGN KEY ("productId") REFERENCES "products"("id")
          ON DELETE CASCADE ON UPDATE CASCADE
      );
    `)
    console.log('✅ Created stock_movements table')

    // Create indexes
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "stock_movements_businessId_idx" ON "stock_movements"("businessId");
    `)
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "stock_movements_productId_idx" ON "stock_movements"("productId");
    `)
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "stock_movements_invoiceId_idx" ON "stock_movements"("invoiceId");
    `)
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "stock_movements_createdAt_idx" ON "stock_movements"("createdAt");
    `)
    console.log('✅ Created indexes')

    // Update all existing products to track inventory by default
    await prisma.product.updateMany({
      data: {
        trackInventory: true
      }
    })
    console.log('✅ Enabled inventory tracking for all products\n')

    console.log('🎉 Migration complete!\n')
    console.log('Inventory system is now active:')
    console.log('  ✓ Stock movements are tracked')
    console.log('  ✓ Inventory deduction on invoice creation')
    console.log('  ✓ Low stock alerts enabled')
    console.log('  ✓ Stock history available\n')

  } catch (error: any) {
    if (error.message?.includes('already exists')) {
      console.log('ℹ️  Tables already exist - system is ready!')
    } else {
      throw error
    }
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
