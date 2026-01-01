import type { FastifyInstance } from 'fastify'
import { listClassificationsSchema } from '../../../application/use-cases/list-classifications/list-classifications.dto'
import { ClassificationsController } from '../controllers/classifications.controller'

export async function classificationsRoutes(app: FastifyInstance) {
  const controller = new ClassificationsController()

  app.get(
    '/',
    {
      schema: {
        querystring: listClassificationsSchema,
      },
    },
    controller.list.bind(controller)
  )
}
