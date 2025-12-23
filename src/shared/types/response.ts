import type { PaginationEnvelope } from './pagination'

export interface ResponseMeta {
  pagination?: PaginationEnvelope
  appliedFilters?: Record<string, any>
  retrievedAt?: string
  version?: string
  requestId?: string
}

export interface ResponseLinks {
  self?: string
  next?: string
  prev?: string
  first?: string
  last?: string
  related?: Record<string, string>
}

export interface ApiResponse<T> {
  data: T
  meta?: ResponseMeta
  links?: ResponseLinks
}

export interface ListResponse<T> extends ApiResponse<T[]> {
  meta: ResponseMeta & {
    pagination: PaginationEnvelope
  }
}

export interface DetailResponse<T> extends ApiResponse<T> {
  meta?: ResponseMeta
}

export function createListResponse<T>(
  data: T[],
  pagination: PaginationEnvelope,
  options?: {
    appliedFilters?: Record<string, any>
    requestId?: string
    links?: ResponseLinks
  }
): ListResponse<T> {
  return {
    data,
    meta: {
      pagination,
      ...(options?.appliedFilters && { appliedFilters: options.appliedFilters }),
      retrievedAt: new Date().toISOString(),
      ...(options?.requestId && { requestId: options.requestId }),
    },
    ...(options?.links && { links: options.links }),
  }
}

export function createDetailResponse<T>(
  data: T,
  options?: {
    requestId?: string
    links?: ResponseLinks
  }
): DetailResponse<T> {
  return {
    data,
    meta: {
      retrievedAt: new Date().toISOString(),
      ...(options?.requestId && { requestId: options.requestId }),
    },
    ...(options?.links && { links: options.links }),
  }
}

export function createPaginationLinks(
  baseUrl: string,
  pagination: PaginationEnvelope,
  filters?: Record<string, any>
): ResponseLinks {
  const { page, totalPages } = pagination

  const filtersQuery = filters
    ? Object.entries(filters)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            return `${key}=${value.join(',')}`
          }
          return `${key}=${value}`
        })
        .join('&')
    : ''

  const buildUrl = (targetPage: number): string => {
    const params = new URLSearchParams()
    params.set('page', targetPage.toString())
    if (filtersQuery) {
      filtersQuery.split('&').forEach(param => {
        const [key, value] = param.split('=')
        params.set(key, value)
      })
    }
    return `${baseUrl}?${params.toString()}`
  }

  const links: ResponseLinks = {
    self: buildUrl(page),
  }

  if (page > 1) {
    links.prev = buildUrl(page - 1)
    links.first = buildUrl(1)
  }

  if (page < totalPages) {
    links.next = buildUrl(page + 1)
    links.last = buildUrl(totalPages)
  }

  return links
}
