import { ERROR_CODE_TO_HTTP_STATUS, type ErrorCode } from './error-codes'

export interface ErrorDetail {
  field?: string
  issue: string
  expected?: any
  received?: any
  message?: string
}

export interface RateLimitDetails {
  limit: number
  window: string
  retryAfter: number
  scope?: string
}

export interface ResourceNotFoundDetails {
  resourceType: string
  resourceId: string | number
}

export interface ErrorResponse {
  error: {
    code: ErrorCode
    message: string
    details?: ErrorDetail[] | RateLimitDetails | ResourceNotFoundDetails
    requestId: string
    timestamp?: string
  }
}

export class ApiError extends Error {
  public readonly code: ErrorCode
  public readonly statusCode: number
  public readonly details?: ErrorDetail[]
  public readonly requestId: string
  public readonly timestamp: string

  constructor(
    code: ErrorCode,
    message: string,
    options?: {
      details?: ErrorDetail[]
      requestId?: string
      statusCode?: number
    }
  ) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.statusCode = options?.statusCode || ERROR_CODE_TO_HTTP_STATUS[code]
    this.details = options?.details
    this.requestId = options?.requestId || this.generateRequestId()
    this.timestamp = new Date().toISOString()

    Error.captureStackTrace(this, this.constructor)
  }

  toResponse(): ErrorResponse {
    return {
      error: {
        code: this.code,
        message: this.message,
        ...(this.details && this.details.length > 0 && { details: this.details }),
        requestId: this.requestId,
        timestamp: this.timestamp,
      },
    }
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, details?: ErrorDetail[], requestId?: string) {
    super('INVALID_QUERY', message, { details, requestId, statusCode: 422 })
    this.name = 'ValidationError'
  }
}

export class ResourceNotFoundError extends ApiError {
  constructor(resourceType: string, resourceId: string | number, options?: { requestId?: string }) {
    super('RESOURCE_NOT_FOUND', `${resourceType} with id '${resourceId}' was not found.`, {
      requestId: options?.requestId,
      details: [
        {
          issue: 'resource_not_found',
          message: `${resourceType} with id '${resourceId}' does not exist`,
        },
      ],
    })
    this.name = 'ResourceNotFoundError'
  }

  toResponse(): ErrorResponse {
    const baseResponse = super.toResponse()
    const resourceMatch = this.message.match(/^(\w+) with id '([^']+)'/)

    if (resourceMatch) {
      return {
        ...baseResponse,
        error: {
          ...baseResponse.error,
          details: {
            resourceType: resourceMatch[1],
            resourceId: isNaN(Number(resourceMatch[2]))
              ? resourceMatch[2]
              : Number(resourceMatch[2]),
          },
        },
      }
    }

    return baseResponse
  }
}

export class InvalidFilterError extends ApiError {
  constructor(message: string, details?: ErrorDetail[], requestId?: string) {
    super('INVALID_FILTER', message, { details, requestId })
    this.name = 'InvalidFilterError'
  }
}

export class InvalidSortError extends ApiError {
  constructor(field: string, allowedFields: string[], requestId?: string) {
    super(
      'INVALID_SORT',
      `Invalid sort field '${field}'. Allowed fields: ${allowedFields.join(', ')}.`,
      {
        details: [
          {
            field: 'sort',
            issue: 'invalid_field',
            expected: allowedFields,
            received: field,
          },
        ],
        requestId,
      }
    )
    this.name = 'InvalidSortError'
  }
}

export class InvalidPaginationError extends ApiError {
  constructor(message: string, details?: ErrorDetail[], requestId?: string) {
    super('INVALID_PAGINATION', message, { details, requestId })
    this.name = 'InvalidPaginationError'
  }
}

export class RateLimitExceededError extends ApiError {
  public readonly limit: number
  public readonly window: string
  public readonly retryAfter: number
  public readonly scope?: string

  constructor(
    limit: number,
    window: string,
    retryAfter: number,
    options?: {
      scope?: string
      requestId?: string
    }
  ) {
    super(
      'RATE_LIMIT_EXCEEDED',
      'Rate limit exceeded. Please retry after the specified interval.',
      {
        details: [
          {
            issue: 'rate_limit_exceeded',
            message: `Limit: ${limit} requests per ${window}. Retry after ${retryAfter} seconds.`,
          },
        ],
        requestId: options?.requestId,
        statusCode: 429,
      }
    )
    this.name = 'RateLimitExceededError'
    this.limit = limit
    this.window = window
    this.retryAfter = retryAfter
    this.scope = options?.scope
  }

  toResponse(): ErrorResponse {
    return {
      error: {
        code: this.code,
        message: this.message,
        details: {
          limit: this.limit,
          window: this.window,
          retryAfter: this.retryAfter,
          ...(this.scope && { scope: this.scope }),
        },
        requestId: this.requestId,
        timestamp: this.timestamp,
      },
    }
  }
}

export class SearchRateLimitExceededError extends RateLimitExceededError {
  constructor(
    limit: number,
    window: string,
    retryAfter: number,
    options?: {
      requestId?: string
    }
  ) {
    super(limit, window, retryAfter, {
      scope: 'search',
      requestId: options?.requestId,
    })
    ;(this as any).code = 'SEARCH_RATE_LIMIT_EXCEEDED'
    this.message = 'Search rate limit exceeded. Please reduce request frequency.'
    this.name = 'SearchRateLimitExceededError'
  }
}
