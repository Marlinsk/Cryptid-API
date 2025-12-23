import type { FastifyInstance } from 'fastify'

export interface RequestLogData {
  requestId: string
  method: string
  url: string
  path: string
  queryString: string
  headers: {
    userAgent?: string
    host?: string
    origin?: string
    referer?: string
  }
  ip: string
  timestamp: string
}

export interface ResponseLogData extends RequestLogData {
  statusCode: number
  responseTime: number
  contentLength?: number
}

export async function setupRequestLogger(app: FastifyInstance) {
  app.addHook('onRequest', async request => {
    ;(request as any).startTime = Date.now()

    request.log.info(
      {
        requestId: request.id,
        method: request.method,
        url: request.url,
        path: request.routeOptions.url || request.url,
        query: request.query,
        ip: request.ip,
        userAgent: request.headers['user-agent'],
        host: request.headers.host,
        origin: request.headers.origin,
        referer: request.headers.referer,
      },
      `Incoming request: ${request.method} ${request.url}`
    )
  })

  app.addHook('onResponse', async (request, reply) => {
    const startTime = (request as any).startTime || Date.now()
    const responseTime = Date.now() - startTime
    const statusCode = reply.statusCode

    const logLevel = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info'

    const logData = {
      requestId: request.id,
      method: request.method,
      url: request.url,
      path: request.routeOptions.url || request.url,
      statusCode,
      responseTime: `${responseTime}ms`,
      ip: request.ip,
      userAgent: request.headers['user-agent'],
    }

    request.log[logLevel](
      logData,
      `Response sent: ${request.method} ${request.url} - ${statusCode} (${responseTime}ms)`
    )
  })

  app.addHook('onError', async (request, _reply, error) => {
    request.log.error(
      {
        requestId: request.id,
        method: request.method,
        url: request.url,
        error: {
          name: error.name,
          message: error.message,
          code: (error as any).code,
          statusCode: (error as any).statusCode,
          stack: error.stack,
        },
        ip: request.ip,
      },
      `Error processing request: ${request.method} ${request.url}`
    )
  })

  app.log.info('Request logger plugin initialized')
}
