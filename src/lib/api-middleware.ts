import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, RateLimitConfig } from './rate-limit'
import { getUserFromCookie } from './auth-utils'

/**
 * API middleware for multi-tenant request handling
 */

export interface ApiMiddlewareConfig {
  rateLimit?: RateLimitConfig
  requireAuth?: boolean
  requireBusinessId?: boolean
}

export interface ApiContext {
  userId?: string
  businessId?: string
  isSuperAdmin?: boolean
  email?: string
}

/**
 * Wrap API route handler with middleware for auth, rate limiting, and multi-tenant isolation
 */
export function withApiMiddleware(
  handler: (req: NextRequest, context: ApiContext) => Promise<NextResponse>,
  config: ApiMiddlewareConfig = {}
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      // 1. Authentication check
      let context: ApiContext = {}

      if (config.requireAuth !== false) {
        const user = await getUserFromCookie()

        if (!user) {
          return NextResponse.json(
            { error: 'Authentication required' },
            { status: 401 }
          )
        }

        context = {
          userId: user.id,
          businessId: user.businessId || undefined,
          isSuperAdmin: user.role === 'superadmin',
          email: user.email
        }

        // Check if businessId is required
        if (config.requireBusinessId && !context.businessId && !context.isSuperAdmin) {
          return NextResponse.json(
            { error: 'Business context required' },
            { status: 403 }
          )
        }
      }

      // 2. Rate limiting per tenant
      if (config.rateLimit) {
        const identifier = context.businessId || context.userId || req.ip || 'anonymous'
        const rateLimitResult = checkRateLimit(identifier, config.rateLimit)

        if (!rateLimitResult.success) {
          return NextResponse.json(
            {
              error: 'Rate limit exceeded',
              limit: rateLimitResult.limit,
              reset: rateLimitResult.reset
            },
            {
              status: 429,
              headers: {
                'X-RateLimit-Limit': rateLimitResult.limit.toString(),
                'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                'X-RateLimit-Reset': rateLimitResult.reset.toString(),
                'Retry-After': Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString()
              }
            }
          )
        }
      }

      // 3. Execute handler
      const response = await handler(req, context)

      // 4. Add rate limit headers to successful responses
      if (config.rateLimit && context.businessId) {
        const identifier = context.businessId || context.userId || req.ip || 'anonymous'
        const rateLimitResult = checkRateLimit(identifier, config.rateLimit)

        response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString())
        response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
        response.headers.set('X-RateLimit-Reset', rateLimitResult.reset.toString())
      }

      return response
    } catch (error: any) {
      console.error('API middleware error:', error)

      return NextResponse.json(
        { error: 'Internal server error', message: error.message },
        { status: 500 }
      )
    }
  }
}

/**
 * Helper to ensure business isolation - prevents cross-tenant data access
 */
export function ensureBusinessIsolation(
  requestedBusinessId: string,
  userBusinessId: string | undefined,
  isSuperAdmin: boolean
): boolean {
  // SuperAdmin can access any business
  if (isSuperAdmin) {
    return true
  }

  // Regular users can only access their own business
  return requestedBusinessId === userBusinessId
}

/**
 * Helper to validate business access
 */
export function validateBusinessAccess(
  requestedBusinessId: string,
  context: ApiContext
): NextResponse | null {
  if (!ensureBusinessIsolation(requestedBusinessId, context.businessId, context.isSuperAdmin || false)) {
    return NextResponse.json(
      { error: 'Access denied: Cannot access resources from other businesses' },
      { status: 403 }
    )
  }
  return null
}
