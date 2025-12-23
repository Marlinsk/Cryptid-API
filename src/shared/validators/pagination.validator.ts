import { z } from 'zod'
import { PAGINATION_DEFAULTS } from '../types/pagination'

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1, 'Page must be at least 1').default(PAGINATION_DEFAULTS.PAGE),

  limit: z.coerce
    .number()
    .int()
    .min(1, 'Limit must be at least 1')
    .max(PAGINATION_DEFAULTS.MAX_LIMIT, `Limit cannot exceed ${PAGINATION_DEFAULTS.MAX_LIMIT}`)
    .default(PAGINATION_DEFAULTS.LIMIT),
})

export type PaginationQuery = z.infer<typeof paginationQuerySchema>

export function normalizePaginationParams(params: { page?: number; limit?: number }): {
  page: number
  limit: number
} {
  const result = paginationQuerySchema.safeParse(params)

  if (!result.success) {
    return {
      page: PAGINATION_DEFAULTS.PAGE,
      limit: PAGINATION_DEFAULTS.LIMIT,
    }
  }

  return result.data
}

export function calculatePaginationMetadata(params: {
  page: number
  limit: number
  totalItems: number
}) {
  const { page, limit, totalItems } = params
  const totalPages = Math.ceil(totalItems / limit)

  return {
    page,
    limit,
    totalItems,
    totalPages,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
  }
}
