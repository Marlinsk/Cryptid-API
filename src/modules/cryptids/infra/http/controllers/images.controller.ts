import { ApiError } from '@shared/errors'
import { createListResponse, createPaginationLinks } from '@shared/types/response'
import { extractAppliedFilters } from '@shared/validators/filters.validator'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import type { ListAllImagesDTO } from '../../../application/use-cases/list-all-images/list-all-images.dto'
import { ListAllImagesUseCase } from '../../../application/use-cases/list-all-images/list-all-images.usecase'
import { ImageMapper } from '../../../application/mappers/image.mapper'

export class ImagesController {
  async listAll(request: FastifyRequest<{ Querystring: ListAllImagesDTO }>, reply: FastifyReply) {
    const listAllImagesUseCase = container.resolve(ListAllImagesUseCase)
    const result = await listAllImagesUseCase.execute(request.query)

    if (result.isLeft()) {
      const error = result.value
      throw new ApiError('INTERNAL_ERROR', error.message)
    }

    const { data, pagination } = result.value

    const imageDTOs = data.map(image => ImageMapper.toDTO(image))

    const appliedFilters = extractAppliedFilters(request.query)

    const links = createPaginationLinks('/images', pagination, appliedFilters)

    const response = createListResponse(imageDTOs, pagination, {
      appliedFilters: Object.keys(appliedFilters).length > 0 ? appliedFilters : undefined,
      requestId: request.id as string,
      links,
    })

    return reply.status(200).send(response)
  }
}
