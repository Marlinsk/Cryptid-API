import type { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { ZodError } from 'zod'
import { AppError } from '@/shared/errors/app-error'

export async function setupErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    if (error instanceof ZodError) {
      return reply.status(422).send({
        error: 'Validation failed',
        issues: error.issues.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      })
    }

    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        error: error.message,
      })
    }

    app.log.error({
      err: error,
      requestId: request.id,
      url: request.url,
      method: request.method,
    }, 'Unhandled error occurred')

    return reply.status(500).send({
      error: 'Internal server error',
    })
  })
}
