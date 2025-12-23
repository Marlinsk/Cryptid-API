import { env } from '@config/env'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schemas'

const connectionString = `postgresql://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`

const client = postgres(connectionString)

export const db = drizzle(client, { schema })

export const closeDatabase = async () => {
  await client.end()
}
