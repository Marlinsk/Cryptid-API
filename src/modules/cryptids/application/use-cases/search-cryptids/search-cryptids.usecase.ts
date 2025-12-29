import type { PaginatedResult } from '@shared/types/pagination'
import { inject, injectable } from 'tsyringe'
import { type Either, left, right } from '@/shared/core/either'
import { AppError } from '@/shared/errors/app-error'
import type { ICryptidsRepository } from '../../../domain/repositories/icryptids.repository'
import type { CryptidSummaryDTO } from '../../dtos'
import { CryptidMapper } from '../../mappers'
import type { SearchCryptidsDTO } from './search-cryptids.dto'

type Response = Either<AppError, PaginatedResult<CryptidSummaryDTO>>

@injectable()
export class SearchCryptidsUseCase {
  constructor(
    @inject('CryptidsRepository')
    private cryptidsRepository: ICryptidsRepository
  ) {}

  async execute(dto: SearchCryptidsDTO): Promise<Response> {
    try {
      const filters = {
        classification: dto.classification,
        
      }

      const pagination = {
        page: dto.page,
        limit: dto.limit,
      }

      const result = await this.cryptidsRepository.search(dto.query, filters, pagination)

      const summaries = result.data.map(item => CryptidMapper.toSummary(item))

      return right({
        data: summaries,
        pagination: result.pagination,
      })
    } catch (error) {
      return left(new AppError('Failed to search cryptids'))
    }
  }
}
