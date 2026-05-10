import type { FastifyInstance } from 'fastify'
import { listAllImagesSchema } from '../../../application/use-cases/list-all-images/list-all-images.dto'
import { ImagesController } from '../controllers/images.controller'

export async function imagesRoutes(app: FastifyInstance) {
  const controller = new ImagesController()

  app.get(
    '/',
    {
      schema: {
        querystring: listAllImagesSchema,
      },
    },
    controller.listAll.bind(controller)
  )
}
