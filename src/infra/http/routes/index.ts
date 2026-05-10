import { env } from '@config/env'
import { classificationsRoutes } from '@modules/classifications/infra/http/routes/classifications.routes'
import { cryptidsRoutes } from '@modules/cryptids/infra/http/routes/cryptids.routes'
import { imagesRoutes } from '@modules/images/infra/http/routes/images.routes'
import type { FastifyInstance } from 'fastify'

export async function setupRoutes(app: FastifyInstance) {
  app.register(cryptidsRoutes, { prefix: `${env.API_PREFIX}/cryptids` })
  app.register(classificationsRoutes, { prefix: `${env.API_PREFIX}/classifications` })
  app.register(imagesRoutes, { prefix: `${env.API_PREFIX}/images` })

  app.get('/', async () => {
    return { message: 'Cryptid API is running!' }
  })

  app.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() }
  })
}
