import type { PaginatedResult } from '@shared/types/pagination'
import { inject, injectable } from 'tsyringe'
import { type Either, left, right } from '@/shared/core/either'
import { AppError } from '@/shared/errors/app-error'
import type { ICryptidsRepository, ListCryptidsFilters } from '../../../domain/repositories/icryptids.repository'
import type { CryptidSummaryDTO } from '../../dtos'
import { CryptidMapper } from '../../mappers'
import type { ListCryptidsDTO } from './list-cryptids.dto'

type Response = Either<AppError, PaginatedResult<Partial<CryptidSummaryDTO> & { createdAt?: string }>>

@injectable()
export class ListCryptidsUseCase {
  constructor(
    @inject('CryptidsRepository')
    private cryptidsRepository: ICryptidsRepository
  ) {}

  async execute(dto: ListCryptidsDTO): Promise<Response> {
    try {
      const filters: ListCryptidsFilters = {
        habitat: dto.habitat,
        
        classification: dto.classification,
        status: dto.status,
        threatLevel: dto.threatLevel,
        hasImages: dto.hasImages,
        search: dto.search,
      }

      const pagination = {
        page: dto.page,
        limit: dto.limit,
      }

      const sort = {
        sort: dto.sort,
        order: dto.order,
      }

      const result = await this.cryptidsRepository.findWithFilters(filters, pagination, sort)

      const mapperOptions = dto.fields ? { fields: dto.fields } : undefined
      const summaries = result.data.map(item => CryptidMapper.toSummary(item, mapperOptions))

      return right({
        data: summaries,
        pagination: result.pagination,
      })
    } catch (error) {
      return left(new AppError('Failed to list cryptids'))
    }
  }
}
