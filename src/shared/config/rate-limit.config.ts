export type RateLimitScope = 'global' | 'endpoint' | 'search' | 'media'

export interface RateLimitConfig {
  max: number
  timeWindow: number
  windowDescription: string
  scope?: RateLimitScope
  allowBurst?: boolean
  burstMax?: number
}

export const RATE_LIMIT_PLANS = {
  PUBLIC: {
    max: 60,
    timeWindow: 60 * 1000,
    windowDescription: '60s',
    scope: 'global' as RateLimitScope,
  },
  PLAYGROUND: {
    max: 30,
    timeWindow: 60 * 1000,
    windowDescription: '60s',
    scope: 'global' as RateLimitScope,
  },
  INTERNAL: {
    max: 10000,
    timeWindow: 60 * 1000,
    windowDescription: '60s',
    scope: 'global' as RateLimitScope,
  },
} as const

export const ENDPOINT_RATE_LIMITS: Record<string, RateLimitConfig> = {
  list: {
    max: 60,
    timeWindow: 60 * 1000,
    windowDescription: '60s',
    scope: 'endpoint',
  },
  detail: {
    max: 120,
    timeWindow: 60 * 1000,
    windowDescription: '60s',
    scope: 'endpoint',
  },
  search: {
    max: 30,
    timeWindow: 60 * 1000,
    windowDescription: '60s',
    scope: 'search',
  },
  searchPlayground: {
    max: 15,
    timeWindow: 60 * 1000,
    windowDescription: '60s',
    scope: 'search',
  },
  images: {
    max: 20,
    timeWindow: 60 * 1000,
    windowDescription: '60s',
    scope: 'media',
  },
}

export const RATE_LIMIT_DEFAULTS = {
  DEFAULT_PLAN: RATE_LIMIT_PLANS.PUBLIC,
  WARNING_THRESHOLD: 0.8,
  CACHE_PREFIX: 'ratelimit:',
  CACHE_TTL: 120 * 1000,
  WHITELIST_IPS: ['127.0.0.1', '::1'],
  SEARCH_ABUSE_THRESHOLDS: {
    FIRST_VIOLATION: 1,
    SECOND_VIOLATION: 2,
    THIRD_VIOLATION: 3,
    ARTIFICIAL_DELAY_MS: 500,
    TEMPORARY_BLOCK_MINUTES: 10,
  },
} as const

export function getRateLimitConfig(endpoint: string): RateLimitConfig {
  if (endpoint.includes('/search')) {
    return ENDPOINT_RATE_LIMITS.search
  }

  if (endpoint.includes('/images')) {
    return ENDPOINT_RATE_LIMITS.images
  }

  if (endpoint.match(/\/cryptids\/\d+$/)) {
    return ENDPOINT_RATE_LIMITS.detail
  }

  if (endpoint.includes('/cryptids')) {
    return ENDPOINT_RATE_LIMITS.list
  }

  return RATE_LIMIT_DEFAULTS.DEFAULT_PLAN
}

export function calculateRetryAfter(resetTime: number): number {
  const now = Date.now()
  const diff = resetTime - now
  return Math.ceil(diff / 1000)
}

export function isApproachingLimit(remaining: number, limit: number): boolean {
  const consumed = limit - remaining
  const consumedRatio = consumed / limit
  return consumedRatio >= RATE_LIMIT_DEFAULTS.WARNING_THRESHOLD
}
