import { paginationQuerySchema } from '@shared/validators/pagination.validator'
import { z } from 'zod'

const fieldsParamSchema = z
  .string()
  .transform(val => val.split(',').map(v => v.trim()))
  .pipe(z.array(z.string().min(1)))
  .optional()

export const listClassificationsSchema = z.object({
  categoryType: z.enum(['physical', 'narrative', 'abstract']).optional(),
  page: paginationQuerySchema.shape.page,
  limit: paginationQuerySchema.shape.limit,
  sort: z.enum(['id', 'name', 'categoryType']).default('id'),
  order: z.enum(['asc', 'desc']).default('asc'),
  fields: fieldsParamSchema,
})

export type ListClassificationsDTO = z.infer<typeof listClassificationsSchema>
