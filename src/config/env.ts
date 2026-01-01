import { config } from 'dotenv'
import { z } from 'zod'

config()

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('0.0.0.0'),

  // Database connection string (required)
  DATABASE_URL: z.string(),

  API_PREFIX: z.string().default('/api/v1'),

  TRUST_PROXY: z
    .enum(['true', 'false'])
    .default('false')
    .transform(val => val === 'true'),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('Invalid environment variables', _env.error.format())
  throw new Error('Invalid environment variables')
}

export const env = _env.data
