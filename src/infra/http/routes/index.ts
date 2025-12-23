import { env } from '@config/env'
import { cryptidsRoutes } from '@modules/cryptids/infra/http/routes/cryptids.routes'
import type { FastifyInstance } from 'fastify'

export async function setupRoutes(app: FastifyInstance) {
  app.register(cryptidsRoutes, { prefix: `${env.API_PREFIX}/cryptids` })

  app.get('/', async () => {
    return { message: 'Cryptid API is running!' }
  })

  app.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() }
  })
}
