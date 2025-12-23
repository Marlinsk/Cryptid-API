export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginationEnvelope {
  page: number
  limit: number
  totalItems: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

export interface PaginatedResult<T> {
  data: T[]
  pagination: PaginationEnvelope
}

export interface SortParams {
  sort?: string
  order?: 'asc' | 'desc'
}

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
} as const
