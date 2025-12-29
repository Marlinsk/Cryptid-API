import type { PaginatedResult, PaginationParams, SortParams } from '@shared/types/pagination'
import type { Cryptid } from '../entities/cryptid.entity'
import type { Image } from '../entities/image.entity'

export interface ListCryptidsFilters {
  search?: string
  classification?: number | number[]
  status?: string | string[]
  threatLevel?: string | string[]
  hasImages?: boolean
}

export interface CryptidWithRelations {
  cryptid: Cryptid
  classification: string
  hasImages: boolean
}

export interface IncludeRelations {
  images?: boolean
  related?: boolean
  sources?: boolean
  subClassifications?: boolean
}

export interface ICryptidsRepository {
  findById(id: number): Promise<Cryptid | null>
  findByIdWithRelations(
    id: number,
    include?: IncludeRelations
  ): Promise<{
    cryptid: Cryptid
    classification: string
    images?: Image[]
    relatedCryptids?: CryptidWithRelations[]
    subClassifications?: string[]
    sources?: string[]
  } | null>
  findAll(): Promise<Cryptid[]>
  findWithFilters(
    filters: ListCryptidsFilters,
    pagination: PaginationParams,
    sort: SortParams
  ): Promise<PaginatedResult<CryptidWithRelations>>
  search(
    query: string,
    filters: Partial<ListCryptidsFilters>,
    pagination: PaginationParams
  ): Promise<PaginatedResult<CryptidWithRelations>>
  findRelated(
    cryptidId: number,
    relationType: 'sameClassification'
  ): Promise<CryptidWithRelations[]>
  hasImages(cryptidId: number): Promise<boolean>
}
