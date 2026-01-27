export interface RateLimitConfig {
  interval: number // Time window in milliseconds
  uniqueTokenPerInterval: number // Max requests per interval
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

/**
 * Simple in-memory rate limiter
 * Prevents abuse by limiting requests per IP/identifier
 */
export class RateLimiter {
  private cache: Map<string, number[]>
  private interval: number
  private uniqueTokenPerInterval: number
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor(config: RateLimitConfig) {
    this.interval = config.interval
    this.uniqueTokenPerInterval = config.uniqueTokenPerInterval
    this.cache = new Map()
    
    // Cleanup expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 60 * 1000)
  }

  /**
   * Remove expired entries from cache
   */
  private cleanup(): void {
    const now = Date.now()
    for (const [key, timestamps] of this.cache.entries()) {
      const validTokens = timestamps.filter(
        (timestamp: number) => now - timestamp < this.interval
      )
      if (validTokens.length === 0) {
        this.cache.delete(key)
      } else {
        this.cache.set(key, validTokens)
      }
    }
  }

  /**
   * Check if request is allowed
   * @param identifier - Unique identifier (IP, user ID, etc.)
   * @returns Rate limit result
   */
  check(identifier: string): RateLimitResult {
    const now = Date.now()
    const tokenCount = this.cache.get(identifier) || []
    
    // Filter out expired tokens
    const validTokens = tokenCount.filter(
      (timestamp: number) => now - timestamp < this.interval
    )

    const isAllowed = validTokens.length < this.uniqueTokenPerInterval

    if (isAllowed) {
      validTokens.push(now)
      this.cache.set(identifier, validTokens)
    }

    const reset = validTokens.length > 0
      ? validTokens[0] + this.interval
      : now + this.interval

    return {
      success: isAllowed,
      limit: this.uniqueTokenPerInterval,
      remaining: Math.max(0, this.uniqueTokenPerInterval - validTokens.length),
      reset,
    }
  }

  /**
   * Reset rate limit for identifier
   */
  reset(identifier: string): void {
    this.cache.delete(identifier)
  }

  /**
   * Destroy the rate limiter and cleanup
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
    this.cache.clear()
  }
}

// Predefined rate limiters for different use cases
export const rateLimiters = {
  // Strict: 5 requests per minute
  strict: new RateLimiter({
    interval: 60 * 1000,
    uniqueTokenPerInterval: 5,
  }),
  
  // Standard: 10 requests per minute
  standard: new RateLimiter({
    interval: 60 * 1000,
    uniqueTokenPerInterval: 10,
  }),
  
  // Relaxed: 30 requests per minute
  relaxed: new RateLimiter({
    interval: 60 * 1000,
    uniqueTokenPerInterval: 30,
  }),
  
  // Auth: 3 attempts per 15 minutes
  auth: new RateLimiter({
    interval: 15 * 60 * 1000,
    uniqueTokenPerInterval: 3,
  }),
  
  // Chat: 20 messages per minute
  chat: new RateLimiter({
    interval: 60 * 1000,
    uniqueTokenPerInterval: 20,
  }),
}

/**
 * Get client identifier from request
 * Uses IP address or fallback to user agent
 */
export function getClientIdentifier(request: Request): string {
  // Try to get real IP from headers (for proxies/load balancers)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0] || realIp || 'unknown'
  
  // Combine with user agent for better uniqueness
  const userAgent = request.headers.get('user-agent') || 'unknown'
  
  return `${ip}-${userAgent.slice(0, 50)}`
}

/**
 * Middleware helper for Next.js API routes
 */
export async function withRateLimit(
  request: Request,
  limiter: RateLimiter = rateLimiters.standard
): Promise<RateLimitResult> {
  const identifier = getClientIdentifier(request)
  return limiter.check(identifier)
}
