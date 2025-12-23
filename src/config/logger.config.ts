import type { FastifyBaseLogger } from 'fastify'
import { env } from './env'

const isProduction = env.NODE_ENV === 'production'

export const loggerConfig = {
  transport: !isProduction
    ? {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
          colorize: true,
        },
      }
    : undefined,

  level: env.NODE_ENV === 'test' ? 'silent' : isProduction ? 'info' : 'debug',

  serializers: {
    req(request: any) {
      return {
        method: request.method,
        url: request.url,

        ...(isProduction
          ? {}
          : {
              headers: request.headers,
              hostname: request.hostname,
              remoteAddress: request.ip,
            }),
      }
    },
    res(reply: any) {
      return {
        statusCode: reply.statusCode,

        ...(isProduction ? {} : { headers: reply.getHeaders() }),
      }
    },
    err(err: any) {
      return {
        type: err.type,
        message: err.message,

        ...(isProduction ? {} : { stack: err.stack }),
        code: err.code,
        statusCode: err.statusCode,
      }
    },
  },

  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'req.headers["x-api-key"]',
      'req.body.password',
      'req.body.token',
      'req.body.secret',
      'res.headers["set-cookie"]',
    ],
    censor: '[REDACTED]',
  },

  disableRequestLogging: isProduction,
}

export function customRequestLogger(logger: FastifyBaseLogger, request: any, reply: any) {
  if (isProduction) {
    logger.info({
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      responseTime: reply.getResponseTime(),
    })
  } else {
    logger.info({
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      responseTime: reply.getResponseTime(),
      userAgent: request.headers['user-agent'],
      ip: request.ip,
    })
  }
}
