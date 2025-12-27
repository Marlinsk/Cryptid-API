import type { PaginatedResult, PaginationParams } from '@shared/types/pagination'
import type { Image } from '../entities/image.entity'

export interface ListImagesFilters {
  cryptidId: number
}

export interface IImagesRepository {
  findById(id: number): Promise<Image | null>
  findByCryptidId(
    filters: ListImagesFilters,
    pagination: PaginationParams
  ): Promise<PaginatedResult<Image>>
}
