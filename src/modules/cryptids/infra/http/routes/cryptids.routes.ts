import type { FastifyInstance } from 'fastify'
import { getCryptidByIdSchema } from '../../../application/use-cases/get-cryptid-by-id/get-cryptid-by-id.dto'
import { listCryptidsSchema } from '../../../application/use-cases/list-cryptids/list-cryptids.dto'
import { searchCryptidsSchema } from '../../../application/use-cases/search-cryptids/search-cryptids.dto'
import { listImagesByCryptidSchema } from '../../../application/use-cases/list-images-by-cryptid/list-images-by-cryptid.dto'
import { CryptidsController } from '../controllers/cryptids.controller'
import { z } from 'zod'

export async function cryptidsRoutes(app: FastifyInstance) {
  const controller = new CryptidsController()

  app.get(
    '/',
    {
      schema: {
        querystring: listCryptidsSchema,
      },
    },
    controller.list.bind(controller)
  )

  app.get(
    '/search',
    {
      schema: {
        querystring: searchCryptidsSchema,
      },
    },
    controller.search.bind(controller)
  )

  app.get(
    '/:id',
    {
      schema: {
        params: getCryptidByIdSchema,
      },
    },
    controller.findById.bind(controller)
  )

  app.get(
    '/:id/images',
    {
      schema: {
        params: z.object({
          id: z.coerce.number().int().positive(),
        }),
        querystring: listImagesByCryptidSchema.omit({ cryptidId: true }),
      },
    },
    controller.listImages.bind(controller)
  )
}
