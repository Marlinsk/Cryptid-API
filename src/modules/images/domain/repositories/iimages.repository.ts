import type { PaginatedResult, PaginationParams, SortParams } from '@shared/types/pagination'
import type { Image } from '../entities/image.entity'

export interface ListImagesFilters {
  cryptidId: number
}

export interface IImagesRepository {
  findById(id: string): Promise<Image | null>
  findByCryptidId(filters: ListImagesFilters, pagination: PaginationParams, sort: SortParams): Promise<PaginatedResult<Image>>
  findAll(pagination: PaginationParams, sort: SortParams): Promise<PaginatedResult<Image>>
}
