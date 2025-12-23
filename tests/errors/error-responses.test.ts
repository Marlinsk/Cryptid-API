import { describe, expect, it } from 'vitest'
import { ApiError, RateLimitExceededError, ResourceNotFoundError, SearchRateLimitExceededError, ValidationError } from '@/shared/errors/api-error'
import { ERROR_CODES } from '@/shared/errors/error-codes'

describe('Errors: Error Response Shapes', () => {
  describe('ApiError', () => {
    it('should create api error with standard shape', () => {
      const error = new ApiError('INTERNAL_ERROR', 'Something went wrong')
      const response = error.toResponse()

      expect(response.error).toHaveProperty('code')
      expect(response.error).toHaveProperty('message')
      expect(response.error).toHaveProperty('timestamp')
      expect(response.error.code).toBe('INTERNAL_ERROR')
      expect(response.error.message).toBe('Something went wrong')
    })

    it('should include request id when provided', () => {
      const error = new ApiError('INTERNAL_ERROR', 'Error message', {
        requestId: 'req_12345',
      })
      const response = error.toResponse()

      expect(response.error.requestId).toBe('req_12345')
    })

    it('should include details when provided', () => {
      const error = new ApiError('INTERNAL_ERROR', 'Error message', {
        details: [{ field: 'name', issue: 'required' }],
      })
      const response = error.toResponse()

      expect(response.error.details).toBeDefined()
      expect(Array.isArray(response.error.details)).toBe(true)
    })

    it('should have valid timestamp format', () => {
      const error = new ApiError('INTERNAL_ERROR', 'Error message')
      const response = error.toResponse()

      expect(response.error.timestamp).toBeDefined()
      if (response.error.timestamp) {
        expect(() => new Date(response.error.timestamp as string)).not.toThrow()
      }
    })
  })

  describe('ValidationError', () => {
    it('should create validation error with field details', () => {
      const validationErrors = [
        { field: 'name', issue: 'required', message: 'Name is required' },
        { field: 'age', issue: 'invalid_type', message: 'Age must be a number' },
      ]

      const error = new ValidationError('INVALID_QUERY', validationErrors)
      const response = error.toResponse()

      expect(response.error.code).toBe('INVALID_QUERY')
      if (response.error.details && Array.isArray(response.error.details)) {
        expect(response.error.details).toHaveLength(2)
        expect(response.error.details[0].field).toBe('name')
        expect(response.error.details[1].field).toBe('age')
      }
    })

    it('should have validation error code', () => {
      const error = new ValidationError('INVALID_FILTER', [])
      const response = error.toResponse()

      expect(ERROR_CODES[response.error.code as keyof typeof ERROR_CODES]).toBeDefined()
    })

    it('should return 422 status code', () => {
      const error = new ValidationError('INVALID_QUERY', [])

      expect(error.statusCode).toBe(422)
    })
  })

  describe('ResourceNotFoundError', () => {
    it('should create not found error with resource info', () => {
      const error = new ResourceNotFoundError('Cryptid', 123)
      const response = error.toResponse()

      expect(response.error.code).toBe('RESOURCE_NOT_FOUND')
      expect(response.error.message).toContain('Cryptid')
      expect(response.error.message).toContain('123')
    })

    it('should return 404 status code', () => {
      const error = new ResourceNotFoundError('Cryptid', 1)

      expect(error.statusCode).toBe(404)
    })

    it('should include resource details', () => {
      const error = new ResourceNotFoundError('Cryptid', 456, {
        requestId: 'req_789',
      })
      const response = error.toResponse()

      expect(response.error.details).toBeDefined()
      if (response.error.details && !Array.isArray(response.error.details)) {
        expect('resourceType' in response.error.details && response.error.details.resourceType).toBe('Cryptid')
        expect('resourceId' in response.error.details && response.error.details.resourceId).toBe(456)
      }
    })
  })

  describe('RateLimitExceededError', () => {
    it('should create rate limit error with retry info', () => {
      const error = new RateLimitExceededError(60, '60s', 30)
      const response = error.toResponse()

      expect(response.error.code).toBe('RATE_LIMIT_EXCEEDED')
      if (response.error.details && !Array.isArray(response.error.details)) {
        expect('limit' in response.error.details && response.error.details.limit).toBe(60)
        expect('window' in response.error.details && response.error.details.window).toBe('60s')
        expect('retryAfter' in response.error.details && response.error.details.retryAfter).toBe(30)
      }
    })

    it('should return 429 status code', () => {
      const error = new RateLimitExceededError(60, '60s', 30)

      expect(error.statusCode).toBe(429)
    })

    it('should include scope when provided', () => {
      const error = new RateLimitExceededError(60, '60s', 30, {
        scope: 'search',
      })
      const response = error.toResponse()

      if (response.error.details && !Array.isArray(response.error.details)) {
        expect('scope' in response.error.details && response.error.details.scope).toBe('search')
      }
    })

    it('should expose retry after property', () => {
      const error = new RateLimitExceededError(60, '60s', 45)

      expect(error.retryAfter).toBe(45)
      expect(error.limit).toBe(60)
      expect(error.window).toBe('60s')
    })
  })

  describe('SearchRateLimitExceededError', () => {
    it('should create search rate limit error', () => {
      const error = new SearchRateLimitExceededError(30, '60s', 25)
      const response = error.toResponse()

      expect(response.error.code).toBe('SEARCH_RATE_LIMIT_EXCEEDED')
      expect(response.error.message).toContain('Search rate limit')
    })

    it('should always have search scope', () => {
      const error = new SearchRateLimitExceededError(30, '60s', 25)
      const response = error.toResponse()

      if (response.error.details && !Array.isArray(response.error.details)) {
        expect('scope' in response.error.details && response.error.details.scope).toBe('search')
      }
    })

    it('should return 429 status code', () => {
      const error = new SearchRateLimitExceededError(30, '60s', 25)

      expect(error.statusCode).toBe(429)
    })

    it('should have different message from generic rate limit', () => {
      const genericError = new RateLimitExceededError(60, '60s', 30)
      const searchError = new SearchRateLimitExceededError(30, '60s', 30)

      expect(searchError.message).not.toBe(genericError.message)
      expect(searchError.message).toContain('Search')
    })
  })

  describe('Error Code Coverage', () => {
    it('should have error code for validation errors', () => {
      const codes = [
        'INVALID_QUERY',
        'INVALID_FILTER',
        'INVALID_SORT',
        'INVALID_PAGINATION',
        'INVALID_FIELD_SELECTION',
      ]

      for (const code of codes) {
        expect(ERROR_CODES[code as keyof typeof ERROR_CODES]).toBe(code)
      }
    })

    it('should have error code for resource errors', () => {
      const codes = ['RESOURCE_NOT_FOUND']

      for (const code of codes) {
        expect(ERROR_CODES[code as keyof typeof ERROR_CODES]).toBe(code)
      }
    })

    it('should have error code for rate limit errors', () => {
      const codes = ['RATE_LIMIT_EXCEEDED', 'SEARCH_RATE_LIMIT_EXCEEDED']

      for (const code of codes) {
        expect(ERROR_CODES[code as keyof typeof ERROR_CODES]).toBe(code)
      }
    })

    it('should have error code for server errors', () => {
      const codes = ['INTERNAL_ERROR', 'SERVICE_UNAVAILABLE']

      for (const code of codes) {
        expect(ERROR_CODES[code as keyof typeof ERROR_CODES]).toBe(code)
      }
    })
  })

  describe('Error Inheritance', () => {
    it('should extend from error', () => {
      const error = new ApiError('INTERNAL_ERROR', 'Test error')

      expect(error).toBeInstanceOf(Error)
      expect(error.name).toBe('ApiError')
    })

    it('should extend from api error', () => {
      const validationError = new ValidationError('INVALID_QUERY', [])
      const notFoundError = new ResourceNotFoundError('Cryptid', 1)
      const rateLimitError = new RateLimitExceededError(60, '60s', 30)

      expect(validationError).toBeInstanceOf(ApiError)
      expect(notFoundError).toBeInstanceOf(ApiError)
      expect(rateLimitError).toBeInstanceOf(ApiError)
    })

    it('should maintain stack trace', () => {
      const error = new ApiError('INTERNAL_ERROR', 'Test error')

      expect(error.stack).toBeDefined()
      expect(typeof error.stack).toBe('string')
    })
  })

  describe('Error Serialization', () => {
    it('should serialize to json', () => {
      const error = new ApiError('INTERNAL_ERROR', 'Test error')
      const response = error.toResponse()

      expect(() => JSON.stringify(response)).not.toThrow()
    })

    it('should produce consistent json structure', () => {
      const error = new ValidationError('INVALID_QUERY', [
        { field: 'name', issue: 'required', message: 'Name is required' },
      ])
      const response = error.toResponse()
      const json = JSON.parse(JSON.stringify(response))

      expect(json).toHaveProperty('error')
      expect(json.error).toHaveProperty('code')
      expect(json.error).toHaveProperty('message')
      expect(json.error).toHaveProperty('timestamp')
      expect(json.error).toHaveProperty('details')
    })
  })
})
