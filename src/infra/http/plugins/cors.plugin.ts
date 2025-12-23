import cors from '@fastify/cors'
import type { FastifyInstance } from 'fastify'

export async function setupCors(app: FastifyInstance) {
  await app.register(cors, {
    origin: true,
    credentials: false,
    methods: ['GET', 'HEAD', 'OPTIONS'],
  })
}
