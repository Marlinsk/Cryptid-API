import { paginationQuerySchema } from '@shared/validators/pagination.validator'
import { z } from 'zod'

export const listClassificationsSchema = z.object({
  categoryType: z.string().min(1).optional(),
  page: paginationQuerySchema.shape.page,
  limit: paginationQuerySchema.shape.limit,
  sort: z.enum(['id', 'name', 'categoryType']).default('id'),
  order: z.enum(['asc', 'desc']).default('asc'),
})

export type ListClassificationsDTO = z.infer<typeof listClassificationsSchema>
