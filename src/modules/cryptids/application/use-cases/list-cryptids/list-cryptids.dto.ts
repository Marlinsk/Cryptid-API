import { booleanFilterSchema, multivaluedNumberSchema, multivaluedStringSchema, orderableFields } from '@shared/validators/filters.validator'
import { paginationQuerySchema } from '@shared/validators/pagination.validator'
import { z } from 'zod'

const fieldsParamSchema = z
  .string()
  .transform(val => val.split(',').map(v => v.trim()))
  .pipe(z.array(z.string().min(1)))
  .optional()

export const listCryptidsSchema = z.object({
  search: z.string().min(1).optional(),
  habitat: z.union([z.coerce.number().int().positive(), multivaluedNumberSchema]).optional(),
  classification: z.union([z.coerce.number().int().positive(), multivaluedNumberSchema]).optional(),
  status: z.union([z.string().min(1), multivaluedStringSchema]).optional(),
  threatLevel: z.union([z.string().min(1), multivaluedStringSchema]).optional(),
  hasImages: booleanFilterSchema.optional(),
  page: paginationQuerySchema.shape.page,
  limit: paginationQuerySchema.shape.limit,
  sort: z.enum(orderableFields).optional(),
  order: z.enum(['asc', 'desc']).default('asc'),
  fields: fieldsParamSchema,
})

export type ListCryptidsDTO = z.infer<typeof listCryptidsSchema>
