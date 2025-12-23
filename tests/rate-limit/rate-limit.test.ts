import { describe, expect, it } from 'vitest'
import { calculateRetryAfter, ENDPOINT_RATE_LIMITS, getRateLimitConfig, isApproachingLimit, RATE_LIMIT_PLANS } from '@/shared/config/rate-limit.config'

describe('Rate Limit: Configuration', () => {
  describe('Rate Limit Plans', () => {
    it('should define public plan', () => {
      expect(RATE_LIMIT_PLANS.PUBLIC).toBeDefined()
      expect(RATE_LIMIT_PLANS.PUBLIC.max).toBe(60)
      expect(RATE_LIMIT_PLANS.PUBLIC.timeWindow).toBe(60 * 1000)
      expect(RATE_LIMIT_PLANS.PUBLIC.windowDescription).toBe('60s')
    })

    it('should define playground plan', () => {
      expect(RATE_LIMIT_PLANS.PLAYGROUND).toBeDefined()
      expect(RATE_LIMIT_PLANS.PLAYGROUND.max).toBe(30)
      expect(RATE_LIMIT_PLANS.PLAYGROUND.timeWindow).toBe(60 * 1000)
    })

    it('should define internal plan', () => {
      expect(RATE_LIMIT_PLANS.INTERNAL).toBeDefined()
      expect(RATE_LIMIT_PLANS.INTERNAL.max).toBe(10000)
    })
  })

  describe('Endpoint-Specific Limits', () => {
    it('should have list endpoint config', () => {
      expect(ENDPOINT_RATE_LIMITS.list).toBeDefined()
      expect(ENDPOINT_RATE_LIMITS.list.max).toBe(60)
      expect(ENDPOINT_RATE_LIMITS.list.scope).toBe('endpoint')
    })

    it('should have detail endpoint config', () => {
      expect(ENDPOINT_RATE_LIMITS.detail).toBeDefined()
      expect(ENDPOINT_RATE_LIMITS.detail.max).toBe(120)
      expect(ENDPOINT_RATE_LIMITS.detail.scope).toBe('endpoint')
    })

    it('should have search endpoint config', () => {
      expect(ENDPOINT_RATE_LIMITS.search).toBeDefined()
      expect(ENDPOINT_RATE_LIMITS.search.max).toBe(30)
      expect(ENDPOINT_RATE_LIMITS.search.scope).toBe('search')
    })

    it('should have search playground config', () => {
      expect(ENDPOINT_RATE_LIMITS.searchPlayground).toBeDefined()
      expect(ENDPOINT_RATE_LIMITS.searchPlayground.max).toBe(15)
      expect(ENDPOINT_RATE_LIMITS.searchPlayground.scope).toBe('search')
    })

    it('should have images endpoint config', () => {
      expect(ENDPOINT_RATE_LIMITS.images).toBeDefined()
      expect(ENDPOINT_RATE_LIMITS.images.max).toBe(20)
      expect(ENDPOINT_RATE_LIMITS.images.scope).toBe('media')
    })
  })

  describe('Search Has Lower Limits', () => {
    it('should have lower limit than list', () => {
      expect(ENDPOINT_RATE_LIMITS.search.max).toBeLessThan(ENDPOINT_RATE_LIMITS.list.max)
    })

    it('should_have_lower_limit_than_detail', () => {
      expect(ENDPOINT_RATE_LIMITS.search.max).toBeLessThan(ENDPOINT_RATE_LIMITS.detail.max)
    })

    it('should have playground limit lower than public', () => {
      expect(ENDPOINT_RATE_LIMITS.searchPlayground.max).toBeLessThan(
        ENDPOINT_RATE_LIMITS.search.max
      )
    })
  })

  describe('Get Rate Limit Config', () => {
    it('should return search config for search endpoint', () => {
      const config = getRateLimitConfig('/cryptids/search?query=shadow')

      expect(config.scope).toBe('search')
      expect(config.max).toBe(30)
    })

    it('should return images config for images endpoint', () => {
      const config = getRateLimitConfig('/cryptids/123/images')

      expect(config.scope).toBe('media')
      expect(config.max).toBe(20)
    })

    it('should return detail config for detail endpoint', () => {
      const config = getRateLimitConfig('/cryptids/123')

      expect(config.scope).toBe('endpoint')
      expect(config.max).toBe(120)
    })

    it('should return list config for list endpoint', () => {
      const config = getRateLimitConfig('/cryptids?page=1')

      expect(config.scope).toBe('endpoint')
      expect(config.max).toBe(60)
    })

    it('should return default for unknown endpoint', () => {
      const config = getRateLimitConfig('/unknown')

      expect(config).toBeDefined()
      expect(config.max).toBe(60)
    })
  })

  describe('Calculate Retry After', () => {
    it('should calculate seconds until reset', () => {
      const now = Date.now()
      const resetTime = now + 30000

      const retryAfter = calculateRetryAfter(resetTime)

      expect(retryAfter).toBeGreaterThanOrEqual(29)
      expect(retryAfter).toBeLessThanOrEqual(31)
    })

    it('should return 0 for past reset time', () => {
      const pastTime = Date.now() - 1000

      const retryAfter = calculateRetryAfter(pastTime)

      expect(retryAfter).toBeLessThanOrEqual(0)
    })

    it('should round up to nearest second', () => {
      const now = Date.now()
      const resetTime = now + 1500

      const retryAfter = calculateRetryAfter(resetTime)

      expect(retryAfter).toBe(2)
    })
  })

  describe('Is Approaching Limit', () => {
    it('should detect when approaching limit at 80 percent', () => {
      const limit = 100
      const remaining = 20

      expect(isApproachingLimit(remaining, limit)).toBe(true)
    })

    it('should not trigger before threshold', () => {
      const limit = 100
      const remaining = 21

      expect(isApproachingLimit(remaining, limit)).toBe(false)
    })

    it('should trigger at exact threshold', () => {
      const limit = 100
      const remaining = 20

      expect(isApproachingLimit(remaining, limit)).toBe(true)
    })

    it('should trigger when almost exhausted', () => {
      const limit = 100
      const remaining = 1

      expect(isApproachingLimit(remaining, limit)).toBe(true)
    })

    it('should not trigger when fully available', () => {
      const limit = 100
      const remaining = 100

      expect(isApproachingLimit(remaining, limit)).toBe(false)
    })
  })
})
