# Multi-Tenant Request Handling Guide

This document explains how the DocuFlow system handles multiple concurrent requests from different tenants (businesses).

## Overview

DocuFlow is a multi-tenant SaaS application where each business operates in isolation. The system is designed to handle concurrent requests from multiple businesses efficiently and securely.

## Key Components

### 1. Database Connection Pooling

**Location**: `src/lib/db.ts`

The Prisma client is configured with connection pooling to handle multiple concurrent requests:

```typescript
DATABASE_URL="postgresql://...?connection_limit=20&pool_timeout=20"
```

**Settings**:
- `connection_limit=20`: Maximum 20 concurrent database connections
- `pool_timeout=20`: Wait up to 20 seconds for available connection

### 2. Transaction Isolation

**Function**: `withTransaction()`

Ensures data consistency when multiple tenants perform operations simultaneously:

```typescript
import { withTransaction } from '@/lib/db'

await withTransaction(async (tx) => {
  // All operations here are atomic and isolated
  await tx.invoice.create({ ... })
  await tx.product.update({ ... })
})
```

**Features**:
- `maxWait: 5000ms` - Wait up to 5 seconds for transaction lock
- `timeout: 10000ms` - Transaction timeout after 10 seconds
- `isolationLevel: ReadCommitted` - Prevents dirty reads

### 3. Automatic Retry Logic

**Function**: `withRetry()`

Automatically retries failed operations due to deadlocks or connection issues:

```typescript
import { withRetry } from '@/lib/db'

const result = await withRetry(async () => {
  return await prisma.invoice.findMany({ where: { businessId } })
})
```

**Retry Strategy**:
- Maximum 3 retry attempts
- Exponential backoff (100ms, 200ms, 400ms)
- Only retries on transaction conflicts or lock timeouts

### 4. Business-Scoped Queries

**Function**: `getBusinessScopedClient()`

Automatically scopes all queries to a specific business:

```typescript
import { getBusinessScopedClient } from '@/lib/db'

const client = getBusinessScopedClient(businessId)

// Automatically adds businessId filter
const invoices = await client.invoice.findMany()
const items = await client.inventoryItem.findMany()
```

**Benefits**:
- Prevents accidental cross-tenant data access
- Reduces boilerplate code
- Enforces tenant isolation at the data layer

### 5. Rate Limiting

**Location**: `src/lib/rate-limit.ts`

Prevents any single tenant from overwhelming the system:

```typescript
import { checkRateLimit } from '@/lib/rate-limit'

const result = checkRateLimit(businessId, {
  maxRequests: 100,  // 100 requests
  windowMs: 60000    // per minute
})

if (!result.success) {
  return Response('Rate limit exceeded', { status: 429 })
}
```

**Features**:
- Per-tenant rate limiting
- Automatic cleanup of expired entries
- Returns remaining quota and reset time

### 6. API Middleware

**Location**: `src/lib/api-middleware.ts`

Unified middleware for auth, rate limiting, and business isolation:

```typescript
import { withApiMiddleware } from '@/lib/api-middleware'

export const GET = withApiMiddleware(
  async (req, context) => {
    // context.businessId is automatically populated
    // Rate limiting is automatically applied
    // Business isolation is enforced

    const invoices = await prisma.invoice.findMany({
      where: { businessId: context.businessId }
    })

    return NextResponse.json({ invoices })
  },
  {
    requireAuth: true,
    requireBusinessId: true,
    rateLimit: { maxRequests: 100, windowMs: 60000 }
  }
)
```

## Usage Examples

### Example 1: Creating an Invoice (with Transaction)

```typescript
import { withTransaction } from '@/lib/db'
import { notifyBusiness } from '@/lib/notifications'

export async function POST(req: NextRequest) {
  const { businessId, customerId, items } = await req.json()

  const invoice = await withTransaction(async (tx) => {
    // Create invoice
    const invoice = await tx.invoice.create({
      data: { businessId, customerId, ... }
    })

    // Deduct stock
    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stockQuantity: { decrement: item.quantity } }
      })
    }

    return invoice
  })

  // Send notification (outside transaction)
  await notifyBusiness(businessId, {
    title: 'Invoice Created',
    message: `Invoice #${invoice.invoiceNumber} created`,
    type: 'success'
  })

  return NextResponse.json({ invoice })
}
```

### Example 2: Querying with Retry Logic

```typescript
import { withRetry } from '@/lib/db'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  const businessId = req.nextUrl.searchParams.get('businessId')

  const invoices = await withRetry(async () => {
    return await prisma.invoice.findMany({
      where: { businessId },
      include: { customer: true, items: true }
    })
  })

  return NextResponse.json({ invoices })
}
```

### Example 3: Using Business-Scoped Client

```typescript
import { getBusinessScopedClient } from '@/lib/db'

export async function GET(req: NextRequest) {
  const businessId = 'business-123'
  const client = getBusinessScopedClient(businessId)

  // All queries automatically filtered by businessId
  const [invoices, items, users] = await Promise.all([
    client.invoice.findMany(),
    client.inventoryItem.findMany(),
    client.user.findMany()
  ])

  return NextResponse.json({ invoices, items, users })
}
```

### Example 4: Complete API Route with Middleware

```typescript
import { withApiMiddleware, validateBusinessAccess } from '@/lib/api-middleware'
import { withRetry } from '@/lib/db'
import { prisma } from '@/lib/db'

export const GET = withApiMiddleware(
  async (req, context) => {
    // Validate business access
    const requestedBusinessId = req.nextUrl.searchParams.get('businessId')
    const accessError = validateBusinessAccess(requestedBusinessId!, context)
    if (accessError) return accessError

    // Query with automatic retry
    const invoices = await withRetry(async () => {
      return await prisma.invoice.findMany({
        where: { businessId: requestedBusinessId! }
      })
    })

    return NextResponse.json({ invoices })
  },
  {
    requireAuth: true,
    requireBusinessId: true,
    rateLimit: { maxRequests: 100, windowMs: 60000 }
  }
)
```

## Security Features

### 1. Business Isolation

Every query includes `businessId` filter to prevent cross-tenant data access:

```typescript
// ✅ CORRECT
const invoices = await prisma.invoice.findMany({
  where: { businessId: userBusinessId }
})

// ❌ WRONG - Missing businessId filter
const invoices = await prisma.invoice.findMany()
```

### 2. Access Validation

```typescript
import { ensureBusinessIsolation } from '@/lib/api-middleware'

// Regular users can only access their own business
if (!ensureBusinessIsolation(requestedBusinessId, userBusinessId, isSuperAdmin)) {
  return NextResponse.json({ error: 'Access denied' }, { status: 403 })
}
```

### 3. SuperAdmin Override

SuperAdmins can access any business data:

```typescript
if (context.isSuperAdmin) {
  // Can query any businessId
} else {
  // Must match user's businessId
}
```

## Performance Optimization

### 1. Database Indexes

Ensure all multi-tenant queries have proper indexes:

```prisma
model Invoice {
  id         String @id @default(cuid())
  businessId String

  @@index([businessId])  // Critical for multi-tenant performance
}
```

### 2. Parallel Queries

Use `Promise.all()` for independent queries:

```typescript
const [invoices, customers, products] = await Promise.all([
  prisma.invoice.findMany({ where: { businessId } }),
  prisma.customer.findMany({ where: { businessId } }),
  prisma.product.findMany({ where: { businessId } })
])
```

### 3. Connection Pool Monitoring

Monitor connection pool usage in production:

```typescript
// Check active connections
const metrics = await prisma.$metrics.json()
console.log('Active connections:', metrics.counters)
```

## Troubleshooting

### Issue: "Too many connections"

**Solution**: Increase connection pool size in DATABASE_URL:
```
?connection_limit=50&pool_timeout=30
```

### Issue: Transaction deadlocks

**Solution**: Use `withRetry()` wrapper to automatically retry:
```typescript
await withRetry(async () => {
  await prisma.$transaction([...])
})
```

### Issue: Rate limit false positives

**Solution**: Adjust rate limit config per route:
```typescript
rateLimit: { maxRequests: 500, windowMs: 60000 }
```

## Production Recommendations

1. **Use Redis for Rate Limiting**: Replace in-memory store with Redis for distributed systems
2. **Enable Query Logging**: Monitor slow queries affecting multiple tenants
3. **Set up Alerts**: Alert on high connection pool usage or rate limit violations
4. **Connection Pool Sizing**: Start with `connection_limit = (number of CPU cores × 2) + 1`
5. **Regular Monitoring**: Track per-tenant database query performance

## Summary

DocuFlow handles multi-tenant concurrent requests through:

- ✅ Connection pooling (20 concurrent connections)
- ✅ Transaction isolation (ReadCommitted level)
- ✅ Automatic retry logic (3 attempts with backoff)
- ✅ Rate limiting (100 req/min per tenant)
- ✅ Business-scoped queries (automatic filtering)
- ✅ Secure middleware (auth + isolation)

These features ensure that multiple businesses can use the system simultaneously without:
- Data leakage between tenants
- Performance degradation
- Resource exhaustion
- Race conditions or conflicts
