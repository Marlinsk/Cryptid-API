import { env } from '@config/env'
import { drizzle } from 'drizzle-orm/postgres-js'
import type { FastifyBaseLogger } from 'fastify'
import postgres from 'postgres'
import * as schema from './schemas'

const connectionString = `postgresql://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`

const client = postgres(connectionString, {
  prepare: false,
  onnotice: () => {},
  connection: {
    application_name: 'cryptid-api',
  },
  connect_timeout: 10,
  ssl: env.NODE_ENV === 'production' ? 'require' : false,
})

export const db = drizzle(client, { schema })

export const testDatabaseConnection = async (logger?: FastifyBaseLogger) => {
  try {
    await client`SELECT 1 as connection_test`
    if (logger) {
      logger.info('Database connection established')
    } else {
      console.log('Database connection established')
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    if (logger) {
      logger.error('Database connection failed: ' + errorMessage)
    } else {
      console.error('Database connection failed:', errorMessage)
    }
    throw error
  }
}

export const closeDatabase = async () => {
  await client.end()
}
