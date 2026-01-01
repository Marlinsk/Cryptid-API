import type { FastifyInstance } from 'fastify'
import { errorHandler } from '@/shared/errors/error-handler'

export async function setupErrorHandler(app: FastifyInstance) {
  app.setErrorHandler(errorHandler)
}
