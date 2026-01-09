import { paginationQuerySchema } from '@shared/validators/pagination.validator'
import { z } from 'zod'

const fieldsParamSchema = z
  .union([
    z.array(z.string().min(1)),
    z.string().min(1)
  ])
  .transform(val => {
    if (val === undefined) return undefined
    if (Array.isArray(val)) return val
    if (typeof val === 'string') {
      // Try to parse as JSON array first (e.g., '["id","name"]')
      if (val.startsWith('[') && val.endsWith(']')) {
        try {
          const parsed = JSON.parse(val)

          if (Array.isArray(parsed)) {
            return parsed.filter(v => typeof v === 'string' && v.length > 0)
          }
        } catch {
          // If JSON parse fails, continue to comma-separated parsing
        }
      }

      // Parse comma-separated values (e.g., "id,name")
      return val.split(',').map(v => v.trim()).filter(v => v.length > 0)
    }
    return [val]
  })
  .optional()

export const listClassificationsSchema = z.object({
  categoryType: z.string().min(1).optional(),
  page: paginationQuerySchema.shape.page,
  limit: paginationQuerySchema.shape.limit,
  sort: z.enum(['id', 'name', 'categoryType']).default('id'),
  order: z.enum(['asc', 'desc']).default('asc'),
  fields: fieldsParamSchema,
})

export type ListClassificationsDTO = z.infer<typeof listClassificationsSchema>
