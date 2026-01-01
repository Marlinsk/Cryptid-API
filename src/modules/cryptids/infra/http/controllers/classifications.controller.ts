import { ApiError } from '@shared/errors'
import { createListResponse, createPaginationLinks } from '@shared/types/response'
import { extractAppliedFilters } from '@shared/validators/filters.validator'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import type { ListClassificationsDTO } from '../../../application/use-cases/list-classifications/list-classifications.dto'
import { ListClassificationsUseCase } from '../../../application/use-cases/list-classifications/list-classifications.usecase'

export class ClassificationsController {
  async list(request: FastifyRequest<{ Querystring: ListClassificationsDTO }>, reply: FastifyReply) {
    const listClassificationsUseCase = container.resolve(ListClassificationsUseCase)
    const result = await listClassificationsUseCase.execute(request.query)

    if (result.isLeft()) {
      const error = result.value
      throw new ApiError('INTERNAL_ERROR', error.message)
    }

    const { data, pagination } = result.value

    const appliedFilters = extractAppliedFilters(request.query)

    const links = createPaginationLinks('/cryptids/classifications', pagination, appliedFilters)

    const response = createListResponse(data, pagination, {
      appliedFilters: Object.keys(appliedFilters).length > 0 ? appliedFilters : undefined,
      requestId: request.id as string,
      links,
    })

    return reply.status(200).send(response)
  }
}
