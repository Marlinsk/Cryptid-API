import { env } from '@config/env'
import { classificationsRoutes } from '@modules/cryptids/infra/http/routes/classifications.routes'
import { cryptidsRoutes } from '@modules/cryptids/infra/http/routes/cryptids.routes'
import { imagesRoutes } from '@modules/cryptids/infra/http/routes/images.routes'
import type { FastifyInstance } from 'fastify'

export async function setupRoutes(app: FastifyInstance) {
  app.register(cryptidsRoutes, { prefix: `${env.API_PREFIX}/cryptids` })
  app.register(classificationsRoutes, { prefix: `${env.API_PREFIX}/cryptids/classifications` })
  app.register(imagesRoutes, { prefix: `${env.API_PREFIX}/cryptids/images` })

  app.get('/', async () => {
    return { message: 'Cryptid API is running!' }
  })

  app.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() }
  })
}
