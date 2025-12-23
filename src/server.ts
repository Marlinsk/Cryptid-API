import { env } from '@config/env'
import { buildApp } from '@infra/http/app'

async function start() {
  try {
    const app = await buildApp()

    await app.listen({
      port: env.PORT,
      host: env.HOST,
    })

    app.log.info(`Server is running on http://${env.HOST}:${env.PORT}`)
  } catch (error) {
    console.error('Error starting server:', error)
    process.exit(1)
  }
}

start()
