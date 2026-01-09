import { booleanFilterSchema, orderableFields } from '@shared/validators/filters.validator'
import { paginationQuerySchema } from '@shared/validators/pagination.validator'
import { z } from 'zod'

const fieldsParamSchema = z
  .string()
  .transform(val => val.split(',').map(v => v.trim()))
  .pipe(z.array(z.string().min(1)))
  .optional()

const arrayOrSingleNumberSchema = z
  .union([
    z.array(z.coerce.number().int().positive()),
    z.coerce.number().int().positive(),
    z.string()
  ])
  .transform(val => {
    if (val === undefined) {
      return undefined
    }
    
    if (Array.isArray(val)) {
      return val
    }
    
    if (typeof val === 'string') {
      if (val.startsWith('[') && val.endsWith(']')) {
        const parsed = JSON.parse(val)
        
        if (Array.isArray(parsed)) {
          return parsed.map(v => Number(v)).filter(v => !isNaN(v) && v > 0)
        }
      }
      
      return val.split(',').map(v => Number(v.trim())).filter(v => !isNaN(v) && v > 0)
    }
    return [val]
  })
  .optional()

const arrayOrSingleStringSchema = z
  .union([
    z.array(z.string().min(1)),
    z.string().min(1)
  ])
  .transform(val => {
    if (val === undefined) return undefined
    if (Array.isArray(val)) return val
    if (typeof val === 'string') {
      if (val.startsWith('[') && val.endsWith(']')) {
        const parsed = JSON.parse(val)
        
        if (Array.isArray(parsed)) {
          return parsed.filter(v => typeof v === 'string' && v.length > 0)
        }
      }
      
      if (val.includes(',')) {
        return val.split(',').map(v => v.trim()).filter(v => v.length > 0)
      }
    }
    return [val]
  })
  .optional()

export const listCryptidsSchema = z.object({
  search: z.string().min(1).optional(),
  classification: arrayOrSingleNumberSchema,
  status: arrayOrSingleStringSchema,
  threatLevel: arrayOrSingleStringSchema,
  hasImages: booleanFilterSchema.optional(),
  page: paginationQuerySchema.shape.page,
  limit: paginationQuerySchema.shape.limit,
  sort: z.enum(orderableFields).optional(),
  order: z.enum(['asc', 'desc']).default('asc'),
  fields: fieldsParamSchema,
})

export type ListCryptidsDTO = z.infer<typeof listCryptidsSchema>
