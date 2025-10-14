import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// During build time, DATABASE_URL might not be available
// We create a conditional client that won't fail during build
const createPrismaClient = () => {
  // If DATABASE_URL is not set (e.g., during build), return a mock client
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL not found - using build-time mock Prisma client')
    return new PrismaClient({
      datasources: {
        db: {
          url: 'postgresql://localhost:5432/placeholder?schema=public'
        }
      }
    })
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    // Connection pool settings for multi-tenant concurrent requests
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

/**
 * Execute a database operation with automatic retries for concurrent access
 * Useful for high-concurrency multi-tenant scenarios
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 100
): Promise<T> {
  let lastError: Error | undefined

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation()
    } catch (error: any) {
      lastError = error

      // Retry on deadlock or lock timeout errors
      if (
        error.code === 'P2034' || // Transaction conflict
        error.code === 'P2024' || // Timed out fetching connection
        error.message?.includes('deadlock') ||
        error.message?.includes('lock')
      ) {
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
        continue
      }

      // Don't retry on other errors
      throw error
    }
  }

  throw lastError || new Error('Operation failed after retries')
}

/**
 * Execute operations in a transaction with automatic isolation
 * Ensures data consistency in multi-tenant environment
 */
export async function withTransaction<T>(
  callback: (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'>) => Promise<T>
): Promise<T> {
  return await prisma.$transaction(callback, {
    maxWait: 5000, // 5 seconds max wait time
    timeout: 10000, // 10 seconds timeout
    isolationLevel: 'ReadCommitted' // Prevent dirty reads
  })
}

/**
 * Get business-scoped prisma instance for multi-tenant queries
 * This ensures queries are automatically scoped to the business
 */
export function getBusinessScopedClient(businessId: string) {
  return {
    invoice: {
      findMany: (args?: any) =>
        prisma.invoice.findMany({ ...args, where: { ...args?.where, businessId } }),
      findUnique: (args: any) =>
        prisma.invoice.findUnique({ ...args, where: { ...args.where, businessId } }),
      create: (args: any) =>
        prisma.invoice.create({ ...args, data: { ...args.data, businessId } }),
      update: (args: any) =>
        prisma.invoice.update({ ...args, where: { ...args.where, businessId } }),
      delete: (args: any) =>
        prisma.invoice.delete({ ...args, where: { ...args.where, businessId } }),
    },
    inventoryItem: {
      findMany: (args?: any) =>
        prisma.inventoryItem.findMany({ ...args, where: { ...args?.where, businessId } }),
      findUnique: (args: any) =>
        prisma.inventoryItem.findUnique({ ...args, where: { ...args.where, businessId } }),
      create: (args: any) =>
        prisma.inventoryItem.create({ ...args, data: { ...args.data, businessId } }),
      update: (args: any) =>
        prisma.inventoryItem.update({ ...args, where: { ...args.where, businessId } }),
      delete: (args: any) =>
        prisma.inventoryItem.delete({ ...args, where: { ...args.where, businessId } }),
    },
    user: {
      findMany: (args?: any) =>
        prisma.user.findMany({ ...args, where: { ...args?.where, businessId } }),
      findUnique: (args: any) =>
        prisma.user.findUnique({ ...args, where: { ...args.where, businessId } }),
      update: (args: any) =>
        prisma.user.update({ ...args, where: { ...args.where, businessId } }),
    }
  }
}

export default prisma
