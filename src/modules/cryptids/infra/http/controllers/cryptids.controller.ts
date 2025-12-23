import { ApiError, ResourceNotFoundError } from '@shared/errors'
import { createDetailResponse, createListResponse, createPaginationLinks } from '@shared/types/response'
import { extractAppliedFilters } from '@shared/validators/filters.validator'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import type { GetCryptidByIdDTO, GetCryptidByIdWithQueryDTO } from '../../../application/use-cases/get-cryptid-by-id/get-cryptid-by-id.dto'
import { GetCryptidByIdUseCase } from '../../../application/use-cases/get-cryptid-by-id/get-cryptid-by-id.usecase'
import type { ListCryptidsDTO } from '../../../application/use-cases/list-cryptids/list-cryptids.dto'
import { ListCryptidsUseCase } from '../../../application/use-cases/list-cryptids/list-cryptids.usecase'
import type { SearchCryptidsDTO } from '../../../application/use-cases/search-cryptids/search-cryptids.dto'
import { SearchCryptidsUseCase } from '../../../application/use-cases/search-cryptids/search-cryptids.usecase'

export class CryptidsController {
  async list(request: FastifyRequest<{ Querystring: ListCryptidsDTO }>, reply: FastifyReply) {
    const listCryptidsUseCase = container.resolve(ListCryptidsUseCase)
    const result = await listCryptidsUseCase.execute(request.query)

    if (result.isLeft()) {
      const error = result.value
      throw new ApiError('INTERNAL_ERROR', error.message)
    }

    const { data, pagination } = result.value

    const appliedFilters = extractAppliedFilters(request.query)

    const links = createPaginationLinks('/cryptids', pagination, appliedFilters)

    const response = createListResponse(data, pagination, {
      appliedFilters: Object.keys(appliedFilters).length > 0 ? appliedFilters : undefined,
      requestId: request.id as string,
      links,
    })

    return reply.status(200).send(response)
  }

  async search(request: FastifyRequest<{ Querystring: SearchCryptidsDTO }>, reply: FastifyReply) {
    const searchCryptidsUseCase = container.resolve(SearchCryptidsUseCase)
    const result = await searchCryptidsUseCase.execute(request.query)

    if (result.isLeft()) {
      const error = result.value
      throw new ApiError('INTERNAL_ERROR', error.message)
    }

    const { data, pagination } = result.value

    const appliedFilters = extractAppliedFilters(request.query)

    const links = createPaginationLinks('/cryptids/search', pagination, appliedFilters)

    const response = createListResponse(data, pagination, {
      appliedFilters: Object.keys(appliedFilters).length > 0 ? appliedFilters : undefined,
      requestId: request.id as string,
      links,
    })

    return reply.status(200).send(response)
  }

  async findById(
    request: FastifyRequest<{
      Params: GetCryptidByIdDTO
      Querystring: Omit<GetCryptidByIdWithQueryDTO, 'id'>
    }>,
    reply: FastifyReply
  ) {
    const getCryptidByIdUseCase = container.resolve(GetCryptidByIdUseCase)
    const result = await getCryptidByIdUseCase.execute({
      ...request.params,
      ...request.query,
    })

    if (result.isLeft()) {
      const error = result.value

      if (error.message.includes('not found')) {
        throw new ResourceNotFoundError('Cryptid', request.params.id)
      }
      throw new ApiError('INTERNAL_ERROR', error.message)
    }

    const response = createDetailResponse(result.value, {
      requestId: request.id as string,
      links: {
        self: `/cryptids/${request.params.id}`,
        related: {
          images: `/cryptids/${request.params.id}/images`,
        },
      },
    })

    return reply.status(200).send(response)
  }
}
