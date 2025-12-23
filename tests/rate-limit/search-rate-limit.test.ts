import { describe, expect, it } from 'vitest'
import { ENDPOINT_RATE_LIMITS, RATE_LIMIT_DEFAULTS } from '@/shared/config/rate-limit.config'
import { SearchRateLimitExceededError } from '@/shared/errors/api-error'

describe('Rate Limit: Search-Specific', () => {
  describe('Search Rate Limit Configuration', () => {
    it('should have search specific scope', () => {
      expect(ENDPOINT_RATE_LIMITS.search.scope).toBe('search')
      expect(ENDPOINT_RATE_LIMITS.searchPlayground.scope).toBe('search')
    })

    it('should have independent limit from global', () => {
      const searchLimit = ENDPOINT_RATE_LIMITS.search.max
      const globalLimit = RATE_LIMIT_DEFAULTS.DEFAULT_PLAN.max

      expect(searchLimit).not.toBe(globalLimit)
      expect(searchLimit).toBe(30)
      expect(globalLimit).toBe(60)
    })

    it('should have playground limit half of public', () => {
      const publicSearchLimit = ENDPOINT_RATE_LIMITS.search.max
      const playgroundSearchLimit = ENDPOINT_RATE_LIMITS.searchPlayground.max

      expect(playgroundSearchLimit).toBe(publicSearchLimit / 2)
      expect(playgroundSearchLimit).toBe(15)
    })
  })

  describe('Progressive Throttling Thresholds', () => {
    it('should define violation thresholds', () => {
      const thresholds = RATE_LIMIT_DEFAULTS.SEARCH_ABUSE_THRESHOLDS

      expect(thresholds.FIRST_VIOLATION).toBe(1)
      expect(thresholds.SECOND_VIOLATION).toBe(2)
      expect(thresholds.THIRD_VIOLATION).toBe(3)
    })

    it('should define artificial delay', () => {
      const delay = RATE_LIMIT_DEFAULTS.SEARCH_ABUSE_THRESHOLDS.ARTIFICIAL_DELAY_MS

      expect(delay).toBe(500)
      expect(delay).toBeGreaterThan(0)
      expect(delay).toBeLessThan(1000)
    })

    it('should define temporary block duration', () => {
      const blockMinutes = RATE_LIMIT_DEFAULTS.SEARCH_ABUSE_THRESHOLDS.TEMPORARY_BLOCK_MINUTES

      expect(blockMinutes).toBe(10)
      expect(blockMinutes).toBeGreaterThan(0)
    })
  })

  describe('SearchRateLimitExceededError', () => {
    it('should have search specific code', () => {
      const error = new SearchRateLimitExceededError(30, '60s', 25)

      const response = error.toResponse()
      expect(response.error.code).toBe('SEARCH_RATE_LIMIT_EXCEEDED')
    })

    it('should always include search scope', () => {
      const error = new SearchRateLimitExceededError(30, '60s', 25)

      const response = error.toResponse()
      if (response.error.details && !Array.isArray(response.error.details)) {
        expect('scope' in response.error.details && response.error.details.scope).toBe('search')
      }
    })

    it('should include rate limit details', () => {
      const error = new SearchRateLimitExceededError(30, '60s', 25)

      const response = error.toResponse()
      if (response.error.details && !Array.isArray(response.error.details)) {
        expect('limit' in response.error.details && response.error.details.limit).toBe(30)
        expect('window' in response.error.details && response.error.details.window).toBe('60s')
        expect('retryAfter' in response.error.details && response.error.details.retryAfter).toBe(25)
      }
    })

    it('should have descriptive message', () => {
      const error = new SearchRateLimitExceededError(30, '60s', 25)

      expect(error.message).toContain('Search')
      expect(error.message).toContain('rate limit')
    })

    it('should expose retry after for headers', () => {
      const error = new SearchRateLimitExceededError(30, '60s', 45)

      expect(error.retryAfter).toBe(45)
    })
  })

  describe('Independent Scope Behavior', () => {
    it('should not affect global rate limit', () => {
      const searchLimit = ENDPOINT_RATE_LIMITS.search.max
      const globalLimit = RATE_LIMIT_DEFAULTS.DEFAULT_PLAN.max

      expect(searchLimit).toBe(30)
      expect(globalLimit).toBe(60)
    })

    it('should track search separately', () => {
      const searchScope = ENDPOINT_RATE_LIMITS.search.scope
      const listScope = ENDPOINT_RATE_LIMITS.list.scope

      expect(searchScope).toBe('search')
      expect(listScope).toBe('endpoint')
      expect(searchScope).not.toBe(listScope)
    })
  })

  describe('Abuse Prevention', () => {
    it('should escalate penalties progressively', () => {
      const thresholds = RATE_LIMIT_DEFAULTS.SEARCH_ABUSE_THRESHOLDS

      // First violation: simple 429
      expect(thresholds.FIRST_VIOLATION).toBe(1)

      // Second violation: 429 + delay
      expect(thresholds.SECOND_VIOLATION).toBe(2)
      expect(thresholds.ARTIFICIAL_DELAY_MS).toBeGreaterThan(0)

      // Third violation: temporary block
      expect(thresholds.THIRD_VIOLATION).toBe(3)
      expect(thresholds.TEMPORARY_BLOCK_MINUTES).toBeGreaterThan(0)
    })

    it('should have temporary block in minutes', () => {
      const blockMinutes = RATE_LIMIT_DEFAULTS.SEARCH_ABUSE_THRESHOLDS.TEMPORARY_BLOCK_MINUTES
      const blockSeconds = blockMinutes * 60

      expect(blockSeconds).toBe(600) // 10 minutes = 600 seconds
    })
  })

  describe('Rate Limit Comparison', () => {
    it('should be more restrictive than global', () => {
      const searchMax = ENDPOINT_RATE_LIMITS.search.max
      const globalMax = RATE_LIMIT_DEFAULTS.DEFAULT_PLAN.max

      expect(searchMax).toBeLessThan(globalMax)
    })

    it('should be more restrictive than list', () => {
      const searchMax = ENDPOINT_RATE_LIMITS.search.max
      const listMax = ENDPOINT_RATE_LIMITS.list.max

      expect(searchMax).toBeLessThan(listMax)
    })

    it('should be more restrictive than detail', () => {
      const searchMax = ENDPOINT_RATE_LIMITS.search.max
      const detailMax = ENDPOINT_RATE_LIMITS.detail.max

      expect(searchMax).toBeLessThan(detailMax)
    })

    it('should be comparable to images', () => {
      const searchMax = ENDPOINT_RATE_LIMITS.search.max
      const imagesMax = ENDPOINT_RATE_LIMITS.images.max

      // Both are restrictive endpoints
      expect(searchMax).toBeGreaterThan(imagesMax)
      expect(searchMax).toBeLessThan(imagesMax * 2)
    })
  })

  describe('Time Window Consistency', () => {
    it('should use same time window as global', () => {
      const searchWindow = ENDPOINT_RATE_LIMITS.search.timeWindow
      const globalWindow = RATE_LIMIT_DEFAULTS.DEFAULT_PLAN.timeWindow

      expect(searchWindow).toBe(globalWindow)
      expect(searchWindow).toBe(60 * 1000) // 1 minute
    })

    it('should have consistent window description', () => {
      const searchDesc = ENDPOINT_RATE_LIMITS.search.windowDescription
      const globalDesc = RATE_LIMIT_DEFAULTS.DEFAULT_PLAN.windowDescription

      expect(searchDesc).toBe(globalDesc)
      expect(searchDesc).toBe('60s')
    })
  })
})
