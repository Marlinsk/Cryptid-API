import { env } from '@config/env'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { calculateRetryAfter, getRateLimitConfig, isApproachingLimit, RATE_LIMIT_DEFAULTS } from '../config/rate-limit.config'
import { RateLimitExceededError, SearchRateLimitExceededError } from '../errors/api-error'

class RateLimitStore {
  private store: Map<string, { count: number; resetTime: number }> = new Map()

  increment(key: string, timeWindow: number): { count: number; resetTime: number } {
    const now = Date.now()
    const existing = this.store.get(key)

    if (!existing || existing.resetTime < now) {
      const resetTime = now + timeWindow
      this.store.set(key, { count: 1, resetTime })
      return { count: 1, resetTime }
    }

    existing.count += 1
    this.store.set(key, existing)
    return existing
  }

  get(key: string): { count: number; resetTime: number } | null {
    const now = Date.now()
    const existing = this.store.get(key)

    if (!existing || existing.resetTime < now) {
      return null
    }

    return existing
  }

  cleanup(): void {
    const now = Date.now()
    for (const [key, value] of this.store.entries()) {
      if (value.resetTime < now) {
        this.store.delete(key)
      }
    }
  }
}

class SearchViolationsStore {
  private violations: Map<string, { count: number; lastViolation: number; blockedUntil?: number }> =
    new Map()

  recordViolation(key: string): number {
    const now = Date.now()
    const existing = this.violations.get(key)

    if (!existing) {
      this.violations.set(key, { count: 1, lastViolation: now })
      return 1
    }

    if (now - existing.lastViolation > 5 * 60 * 1000) {
      this.violations.set(key, { count: 1, lastViolation: now })
      return 1
    }

    existing.count += 1
    existing.lastViolation = now
    this.violations.set(key, existing)
    return existing.count
  }

  isBlocked(key: string): boolean {
    const now = Date.now()
    const violation = this.violations.get(key)

    if (!violation || !violation.blockedUntil) {
      return false
    }

    return violation.blockedUntil > now
  }

  block(key: string, minutes: number): void {
    const now = Date.now()
    const violation = this.violations.get(key) || { count: 0, lastViolation: now }
    violation.blockedUntil = now + minutes * 60 * 1000
    this.violations.set(key, violation)
  }

  getViolationCount(key: string): number {
    return this.violations.get(key)?.count || 0
  }

  cleanup(): void {
    const now = Date.now()
    for (const [key, value] of this.violations.entries()) {
      if (now - value.lastViolation > 15 * 60 * 1000) {
        this.violations.delete(key)
      }
    }
  }
}

const rateLimitStore = new RateLimitStore()
const searchViolationsStore = new SearchViolationsStore()

setInterval(() => {
  rateLimitStore.cleanup()
  searchViolationsStore.cleanup()
}, 60 * 1000)

function generateRateLimitKey(ip: string, endpoint: string): string {
  return `${RATE_LIMIT_DEFAULTS.CACHE_PREFIX}${ip}:${endpoint}`
}

function getClientIp(request: FastifyRequest): string {
  if (!env.TRUST_PROXY) {
    return request.ip || '127.0.0.1'
  }

  const forwarded = request.headers['x-forwarded-for']
  if (forwarded) {
    const ips = typeof forwarded === 'string' ? forwarded.split(',') : forwarded
    return ips[0].trim()
  }

  const realIp = request.headers['x-real-ip']
  if (realIp && typeof realIp === 'string') {
    return realIp.trim()
  }

  return request.ip || '127.0.0.1'
}

function isWhitelistedIp(ip: string): boolean {
  return (RATE_LIMIT_DEFAULTS.WHITELIST_IPS as readonly string[]).includes(ip)
}

function addRateLimitHeaders(
  reply: FastifyReply,
  limit: number,
  remaining: number,
  resetTime: number,
  scope?: string,
  retryAfter?: number
): void {
  reply.header('X-RateLimit-Limit', limit.toString())
  reply.header('X-RateLimit-Remaining', Math.max(0, remaining).toString())
  reply.header('X-RateLimit-Reset', Math.floor(resetTime / 1000).toString())

  if (scope) {
    reply.header('X-RateLimit-Scope', scope)
  }

  if (retryAfter !== undefined) {
    reply.header('Retry-After', retryAfter.toString())
  }

  if (isApproachingLimit(remaining, limit) && remaining > 0) {
    const warningMessage =
      scope === 'search' ? 'Search rate limit nearing exhaustion' : 'Approaching rate limit'
    reply.header('X-RateLimit-Warning', warningMessage)
  }
}

export async function rateLimitMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const clientIp = getClientIp(request)

  if (isWhitelistedIp(clientIp)) {
    return
  }

  const config = getRateLimitConfig(request.url)
  const key = generateRateLimitKey(clientIp, config.scope || 'global')
  const isSearchEndpoint = config.scope === 'search'

  if (isSearchEndpoint && searchViolationsStore.isBlocked(key)) {
    const retryAfter = RATE_LIMIT_DEFAULTS.SEARCH_ABUSE_THRESHOLDS.TEMPORARY_BLOCK_MINUTES * 60
    addRateLimitHeaders(
      reply,
      config.max,
      0,
      Date.now() + retryAfter * 1000,
      config.scope,
      retryAfter
    )

    throw new SearchRateLimitExceededError(config.max, config.windowDescription, retryAfter, {
      requestId: request.id as string,
    })
  }

  const { count, resetTime } = rateLimitStore.increment(key, config.timeWindow)
  const remaining = config.max - count

  addRateLimitHeaders(reply, config.max, remaining, resetTime, config.scope)

  if (count > config.max) {
    const retryAfter = calculateRetryAfter(resetTime)
    reply.header('Retry-After', retryAfter.toString())

    if (isSearchEndpoint) {
      const violationCount = searchViolationsStore.recordViolation(key)

      if (violationCount >= RATE_LIMIT_DEFAULTS.SEARCH_ABUSE_THRESHOLDS.THIRD_VIOLATION) {
        searchViolationsStore.block(
          key,
          RATE_LIMIT_DEFAULTS.SEARCH_ABUSE_THRESHOLDS.TEMPORARY_BLOCK_MINUTES
        )
        console.warn(
          `[Rate Limit] Search temporarily blocked for IP ${clientIp} (${violationCount} violations)`
        )
      } else if (violationCount >= RATE_LIMIT_DEFAULTS.SEARCH_ABUSE_THRESHOLDS.SECOND_VIOLATION) {
        await new Promise(resolve =>
          setTimeout(resolve, RATE_LIMIT_DEFAULTS.SEARCH_ABUSE_THRESHOLDS.ARTIFICIAL_DELAY_MS)
        )
        console.warn(
          `[Rate Limit] Artificial delay applied to search for IP ${clientIp} (${violationCount} violations)`
        )
      }

      throw new SearchRateLimitExceededError(config.max, config.windowDescription, retryAfter, {
        requestId: request.id as string,
      })
    }

    throw new RateLimitExceededError(config.max, config.windowDescription, retryAfter, {
      scope: config.scope,
      requestId: request.id as string,
    })
  }
}

export async function rateLimitPlugin(app: any): Promise<void> {
  app.addHook('onRequest', rateLimitMiddleware)
}
