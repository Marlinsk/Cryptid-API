import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { ZodError } from 'zod'
import { ApiError, type ErrorDetail, ValidationError } from './api-error'
import { ERROR_CODES } from './error-codes'

export function errorHandler(
  error: Error | FastifyError | ZodError | ApiError,
  request: FastifyRequest,
  reply: FastifyReply
): void {
  const requestId = (request.id as string) || generateRequestId()

  if (error instanceof ApiError) {
    reply.status(error.statusCode).send(error.toResponse())
    return
  }

  if (error instanceof ZodError) {
    const validationError = handleZodError(error, requestId)
    reply.status(validationError.statusCode).send(validationError.toResponse())
    return
  }

  if ('statusCode' in error && error.statusCode === 404) {
    const notFoundError = new ApiError(
      ERROR_CODES.ENDPOINT_NOT_FOUND,
      `Endpoint '${request.method} ${request.url}' not found.`,
      { requestId, statusCode: 404 }
    )
    reply.status(404).send(notFoundError.toResponse())
    return
  }

  if ('validation' in error && error.validation) {
    const validationError = handleFastifyValidationError(error as FastifyError, requestId)
    reply.status(validationError.statusCode).send(validationError.toResponse())
    return
  }

  const isProduction = process.env.NODE_ENV === 'production'

  const internalError = new ApiError(
    ERROR_CODES.INTERNAL_ERROR,
    'An unexpected error occurred. Please try again later.',
    {
      requestId,
      statusCode: 500,
      ...(isProduction
        ? {}
        : {
            details: [
              {
                issue: 'internal_error',
                message: error.message,
                field: error.stack?.split('\n')[1]?.trim() || 'unknown',
              },
            ],
          }),
    }
  )

  if (isProduction) {
    console.error('[INTERNAL_ERROR]', {
      requestId,
      errorType: error.name,
      timestamp: new Date().toISOString(),
    })
  } else {
    console.error('[INTERNAL_ERROR]', {
      requestId,
      error: error.message,
      stack: error.stack,
      url: request.url,
      method: request.method,
      headers: request.headers,
    })
  }

  reply.status(500).send(internalError.toResponse())
}

function handleZodError(error: ZodError, requestId: string): ValidationError {
  const details: ErrorDetail[] = error.issues.map(err => ({
    field: err.path.join('.'),
    issue: err.code,
    message: err.message,
    ...((err as any).expected && { expected: (err as any).expected }),
    ...((err as any).received && { received: (err as any).received }),
  }))

  return new ValidationError('One or more validation errors occurred.', details, requestId)
}

function handleFastifyValidationError(error: FastifyError, requestId: string): ValidationError {
  const details: ErrorDetail[] =
    error.validation?.map(err => ({
      field: (err.instancePath?.replace(/^\//, '') || err.params?.missingProperty || '') as string,
      issue: err.keyword || 'validation_error',
      message: err.message || 'Validation failed',
    })) || []

  return new ValidationError(error.message || 'Validation failed.', details, requestId)
}

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

export function setErrorHandler(app: any): void {
  app.setErrorHandler(errorHandler)
}
