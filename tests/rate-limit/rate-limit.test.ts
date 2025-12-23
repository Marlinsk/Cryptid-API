import { describe, expect, it } from 'vitest'
import { calculateRetryAfter, ENDPOINT_RATE_LIMITS, getRateLimitConfig, isApproachingLimit, RATE_LIMIT_PLANS } from '@/shared/config/rate-limit.config'

describe('Rate Limit: Configuration', () => {
  describe('Rate Limit Plans', () => {
    it('should_define_public_plan', () => {
      expect(RATE_LIMIT_PLANS.PUBLIC).toBeDefined()
      expect(RATE_LIMIT_PLANS.PUBLIC.max).toBe(60)
      expect(RATE_LIMIT_PLANS.PUBLIC.timeWindow).toBe(60 * 1000)
      expect(RATE_LIMIT_PLANS.PUBLIC.windowDescription).toBe('60s')
    })

    it('should_define_playground_plan', () => {
      expect(RATE_LIMIT_PLANS.PLAYGROUND).toBeDefined()
      expect(RATE_LIMIT_PLANS.PLAYGROUND.max).toBe(30)
      expect(RATE_LIMIT_PLANS.PLAYGROUND.timeWindow).toBe(60 * 1000)
    })

    it('should_define_internal_plan', () => {
      expect(RATE_LIMIT_PLANS.INTERNAL).toBeDefined()
      expect(RATE_LIMIT_PLANS.INTERNAL.max).toBe(10000)
    })
  })

  describe('Endpoint-Specific Limits', () => {
    it('should_have_list_endpoint_config', () => {
      expect(ENDPOINT_RATE_LIMITS.list).toBeDefined()
      expect(ENDPOINT_RATE_LIMITS.list.max).toBe(60)
      expect(ENDPOINT_RATE_LIMITS.list.scope).toBe('endpoint')
    })

    it('should_have_detail_endpoint_config', () => {
      expect(ENDPOINT_RATE_LIMITS.detail).toBeDefined()
      expect(ENDPOINT_RATE_LIMITS.detail.max).toBe(120)
      expect(ENDPOINT_RATE_LIMITS.detail.scope).toBe('endpoint')
    })

    it('should_have_search_endpoint_config', () => {
      expect(ENDPOINT_RATE_LIMITS.search).toBeDefined()
      expect(ENDPOINT_RATE_LIMITS.search.max).toBe(30)
      expect(ENDPOINT_RATE_LIMITS.search.scope).toBe('search')
    })

    it('should_have_search_playground_config', () => {
      expect(ENDPOINT_RATE_LIMITS.searchPlayground).toBeDefined()
      expect(ENDPOINT_RATE_LIMITS.searchPlayground.max).toBe(15)
      expect(ENDPOINT_RATE_LIMITS.searchPlayground.scope).toBe('search')
    })

    it('should_have_images_endpoint_config', () => {
      expect(ENDPOINT_RATE_LIMITS.images).toBeDefined()
      expect(ENDPOINT_RATE_LIMITS.images.max).toBe(20)
      expect(ENDPOINT_RATE_LIMITS.images.scope).toBe('media')
    })
  })

  describe('Search Has Lower Limits', () => {
    it('should_have_lower_limit_than_list', () => {
      expect(ENDPOINT_RATE_LIMITS.search.max).toBeLessThan(ENDPOINT_RATE_LIMITS.list.max)
    })

    it('should_have_lower_limit_than_detail', () => {
      expect(ENDPOINT_RATE_LIMITS.search.max).toBeLessThan(ENDPOINT_RATE_LIMITS.detail.max)
    })

    it('should_have_playground_limit_lower_than_public', () => {
      expect(ENDPOINT_RATE_LIMITS.searchPlayground.max).toBeLessThan(
        ENDPOINT_RATE_LIMITS.search.max
      )
    })
  })

  describe('Get Rate Limit Config', () => {
    it('should_return_search_config_for_search_endpoint', () => {
      const config = getRateLimitConfig('/cryptids/search?query=shadow')

      expect(config.scope).toBe('search')
      expect(config.max).toBe(30)
    })

    it('should_return_images_config_for_images_endpoint', () => {
      const config = getRateLimitConfig('/cryptids/123/images')

      expect(config.scope).toBe('media')
      expect(config.max).toBe(20)
    })

    it('should_return_detail_config_for_detail_endpoint', () => {
      const config = getRateLimitConfig('/cryptids/123')

      expect(config.scope).toBe('endpoint')
      expect(config.max).toBe(120)
    })

    it('should_return_list_config_for_list_endpoint', () => {
      const config = getRateLimitConfig('/cryptids?page=1')

      expect(config.scope).toBe('endpoint')
      expect(config.max).toBe(60)
    })

    it('should_return_default_for_unknown_endpoint', () => {
      const config = getRateLimitConfig('/unknown')

      expect(config).toBeDefined()
      expect(config.max).toBe(60)
    })
  })

  describe('Calculate Retry After', () => {
    it('should_calculate_seconds_until_reset', () => {
      const now = Date.now()
      const resetTime = now + 30000

      const retryAfter = calculateRetryAfter(resetTime)

      expect(retryAfter).toBeGreaterThanOrEqual(29)
      expect(retryAfter).toBeLessThanOrEqual(31)
    })

    it('should_return_0_for_past_reset_time', () => {
      const pastTime = Date.now() - 1000

      const retryAfter = calculateRetryAfter(pastTime)

      expect(retryAfter).toBeLessThanOrEqual(0)
    })

    it('should_round_up_to_nearest_second', () => {
      const now = Date.now()
      const resetTime = now + 1500

      const retryAfter = calculateRetryAfter(resetTime)

      expect(retryAfter).toBe(2)
    })
  })

  describe('Is Approaching Limit', () => {
    it('should_detect_when_approaching_limit_at_80_percent', () => {
      const limit = 100
      const remaining = 20

      expect(isApproachingLimit(remaining, limit)).toBe(true)
    })

    it('should_not_trigger_before_threshold', () => {
      const limit = 100
      const remaining = 21

      expect(isApproachingLimit(remaining, limit)).toBe(false)
    })

    it('should_trigger_at_exact_threshold', () => {
      const limit = 100
      const remaining = 20

      expect(isApproachingLimit(remaining, limit)).toBe(true)
    })

    it('should_trigger_when_almost_exhausted', () => {
      const limit = 100
      const remaining = 1

      expect(isApproachingLimit(remaining, limit)).toBe(true)
    })

    it('should_not_trigger_when_fully_available', () => {
      const limit = 100
      const remaining = 100

      expect(isApproachingLimit(remaining, limit)).toBe(false)
    })
  })
})
