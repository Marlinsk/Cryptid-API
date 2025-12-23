import { paginationQuerySchema } from '@shared/validators/pagination.validator'
import { z } from 'zod'

export const searchCryptidsSchema = z.object({
  query: z
    .string()
    .min(2, 'Search query must be at least 2 characters')
    .max(100, 'Search query cannot exceed 100 characters')
    .trim(),
  classification: z.coerce.number().int().positive().optional(),
  realm: z.coerce.number().int().positive().optional(),
  page: paginationQuerySchema.shape.page,
  limit: paginationQuerySchema.shape.limit,
})

export type SearchCryptidsDTO = z.infer<typeof searchCryptidsSchema>
