import { type Either, left, right } from '@/shared/core/either'
import { AppError } from '@/shared/errors/app-error'
import type { PaginatedResult } from '@/shared/types/pagination'
import { inject, injectable } from 'tsyringe'
import type { ClassificationDTO } from '../../dtos'
import { ClassificationMapper } from '../../mappers/classification.mapper'
import type { IClassificationsRepository } from '../../../domain/repositories/iclassifications.repository'
import type { ListClassificationsDTO } from './list-classifications.dto'

type Response = Either<AppError, PaginatedResult<Partial<ClassificationDTO> & { createdAt?: string; updatedAt?: string }>>

@injectable()
export class ListClassificationsUseCase {
  constructor(
    @inject('ClassificationsRepository')
    private classificationsRepository: IClassificationsRepository
  ) {}

  async execute(dto: ListClassificationsDTO): Promise<Response> {
    try {
      let allClassifications = dto.categoryType
        ? await this.classificationsRepository.findByCategoryType(dto.categoryType)
        : await this.classificationsRepository.findAll()

      const sortField = dto.sort || 'id'
      allClassifications = allClassifications.sort((a, b) => {
        let aValue: any
        let bValue: any

        if (sortField === 'id') {
          aValue = parseInt(a.id)
          bValue = parseInt(b.id)
        } else if (sortField === 'name') {
          aValue = a.name
          bValue = b.name
        } else if (sortField === 'categoryType') {
          aValue = a.categoryType
          bValue = b.categoryType
        } else {
          aValue = parseInt(a.id)
          bValue = parseInt(b.id)
        }

        if (aValue < bValue) return dto.order === 'asc' ? -1 : 1
        if (aValue > bValue) return dto.order === 'asc' ? 1 : -1
        return 0
      })

      const page = dto.page ?? 1
      const limit = dto.limit ?? 20
      const totalItems = allClassifications.length
      const totalPages = Math.ceil(totalItems / limit)
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit

      const paginatedClassifications = allClassifications.slice(startIndex, endIndex)
      const mapperOptions = dto.fields ? { fields: dto.fields } : undefined
      const data = ClassificationMapper.toDTOList(paginatedClassifications, mapperOptions)

      return right({
        data,
        pagination: {
          page,
          limit,
          totalItems,
          totalPages,
          hasNext: page < totalPages,
          hasPrevious: page > 1,
        },
      })
    } catch (error) {
      return left(new AppError('Failed to list classifications'))
    }
  }
}
