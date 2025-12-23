import { env } from '@config/env'
import helmet from '@fastify/helmet'
import type { FastifyInstance } from 'fastify'

export async function setupSecurity(app: FastifyInstance) {
  const isProduction = env.NODE_ENV === 'production'

  await app.register(helmet, {
    contentSecurityPolicy: false,

    hsts: false,

    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,

    frameguard: {
      action: 'sameorigin',
    },

    noSniff: true,

    referrerPolicy: {
      policy: 'no-referrer-when-downgrade',
    },

    hidePoweredBy: true,
  })

  app.addHook('onSend', async (request, reply) => {
    if (isProduction) {
      reply.removeHeader('Server')
      reply.removeHeader('X-Powered-By')
    }

    if (reply.statusCode >= 400) {
      reply.header('Cache-Control', 'no-store, no-cache, must-revalidate')
    }

    if (reply.statusCode === 200 && request.method === 'GET') {
      reply.header('Cache-Control', 'public, max-age=300')
    }
  })
}
