import type { PaginatedResult } from '@shared/types/pagination'
import { inject, injectable } from 'tsyringe'
import { type Either, left, right } from '@/shared/core/either'
import { AppError } from '@/shared/errors/app-error'
import type { ICryptidsRepository, ListCryptidsFilters } from '../../../domain/repositories/icryptids.repository'
import type { CryptidSummaryDTO } from '../../dtos'
import { CryptidMapper } from '../../mappers'
import type { ListCryptidsDTO } from './list-cryptids.dto'

const DETAIL_ONLY_FIELDS = new Set([
  'description',
  'originSummary',
  'physicalDescription',
  'behaviorNotes',
  'manifestationConditions',
  'images',
  'relatedCryptids',
])

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

      const requestedFields = dto.fields ?? []
      const needsDetailFields = requestedFields.some(f => DETAIL_ONLY_FIELDS.has(f))

      if (!needsDetailFields) {
        const mapperOptions = requestedFields.length > 0 ? { fields: requestedFields } : undefined
        const summaries = result.data.map(item => CryptidMapper.toSummary(item, mapperOptions))
        return right({ data: summaries, pagination: result.pagination })
      }

      const needsImages = requestedFields.includes('images')
      const needsRelated = requestedFields.includes('relatedCryptids')

      const cryptidIds = result.data.map(item => Number(item.cryptid.id))

      const [imagesMap, relatedMap] = await Promise.all([
        needsImages
          ? this.cryptidsRepository.findImagesForCryptids(cryptidIds)
          : Promise.resolve(new Map()),
        needsRelated
          ? this.cryptidsRepository.findRelatedBatch(
              result.data.map(item => ({
                cryptidId: Number(item.cryptid.id),
                classificationId: item.cryptid.classificationId,
              }))
            )
          : Promise.resolve(new Map()),
      ])

      const items = result.data.map(item =>
        CryptidMapper.toListItem(
          {
            ...item,
            images: imagesMap.get(item.cryptid.id),
            relatedCryptids: relatedMap.get(item.cryptid.id),
          },
          { fields: requestedFields },
        )
      )

      return right({ data: items, pagination: result.pagination })
    } catch (error) {
      return left(new AppError('Failed to list cryptids'))
    }
  }
}
