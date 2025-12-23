import 'reflect-metadata'
import '@infra/container'
import { env } from '@config/env'
import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { setupCors } from './plugins/cors.plugin'
import { setupErrorHandler } from './plugins/error-handler.plugin'
import { setupRequestLogger } from './plugins/logger.plugin'
import { setupSecurity } from './plugins/security.plugin'
import { setupRoutes } from './routes'

export async function buildApp() {
  const isProduction = env.NODE_ENV === 'production'

  const app = fastify({
    logger: isProduction
      ? {
          level: 'info',
          redact: {
            paths: ['req.headers.authorization', 'req.headers.cookie'],
            censor: '[REDACTED]',
          },
        }
      : {
          level: 'debug',
          transport: {
            target: 'pino-pretty',
            options: {
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
              colorize: true,
            },
          },
        },

    disableRequestLogging: isProduction,

    trustProxy: env.TRUST_PROXY,

    requestTimeout: 30000,

    requestIdHeader: 'x-request-id',
    requestIdLogLabel: 'reqId',
    genReqId: () => `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
  }).withTypeProvider<ZodTypeProvider>()

  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  await setupSecurity(app)
  await setupCors(app)
  await setupRequestLogger(app)
  await setupErrorHandler(app)
  await setupRoutes(app)

  return app
}
