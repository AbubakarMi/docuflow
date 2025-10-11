/**
 * Rate limiting for multi-tenant API requests
 * Prevents any single tenant from overwhelming the system
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, RateLimitEntry>()

// Cleanup old entries every 60 seconds
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key)
    }
  }
}, 60000)

export interface RateLimitConfig {
  maxRequests: number // Maximum requests allowed
  windowMs: number // Time window in milliseconds
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

/**
 * Check if a request is within rate limits for a given identifier
 * @param identifier - Unique identifier (e.g., businessId, userId, IP)
 * @param config - Rate limit configuration
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = { maxRequests: 100, windowMs: 60000 } // Default: 100 req/min
): RateLimitResult {
  const now = Date.now()
  const entry = rateLimitStore.get(identifier)

  if (!entry || entry.resetAt < now) {
    // Create new entry
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + config.windowMs
    })

    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - 1,
      reset: now + config.windowMs
    }
  }

  // Increment existing entry
  entry.count++

  if (entry.count > config.maxRequests) {
    return {
      success: false,
      limit: config.maxRequests,
      remaining: 0,
      reset: entry.resetAt
    }
  }

  return {
    success: true,
    limit: config.maxRequests,
    remaining: config.maxRequests - entry.count,
    reset: entry.resetAt
  }
}

/**
 * Reset rate limit for a specific identifier
 */
export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier)
}

/**
 * Get current rate limit status without incrementing
 */
export function getRateLimitStatus(identifier: string): RateLimitResult | null {
  const entry = rateLimitStore.get(identifier)
  const now = Date.now()

  if (!entry || entry.resetAt < now) {
    return null
  }

  return {
    success: entry.count <= 100,
    limit: 100,
    remaining: Math.max(0, 100 - entry.count),
    reset: entry.resetAt
  }
}
