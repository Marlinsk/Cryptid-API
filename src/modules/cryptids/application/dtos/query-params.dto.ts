import { z } from 'zod'

export const includeParamSchema = z
  .string()
  .transform(val => val.split(',').map(v => v.trim()))
  .pipe(z.array(z.enum(['images', 'related', 'sources', 'subClassifications'])))
  .optional()

export const fieldsParamSchema = z
  .string()
  .transform(val => val.split(',').map(v => v.trim()))
  .optional()

export const expandParamSchema = z
  .string()
  .transform(val => val.split(',').map(v => v.trim()))
  .pipe(z.array(z.enum(['images.metadata', 'related.classification'])))
  .optional()

export const cryptidDetailQuerySchema = z.object({
  include: includeParamSchema,
  fields: fieldsParamSchema,
  expand: expandParamSchema,
})

export type CryptidDetailQueryParams = z.infer<typeof cryptidDetailQuerySchema>

export type IncludeOptions = {
  images?: boolean
  related?: boolean
  sources?: boolean
  subClassifications?: boolean
}

export function parseIncludeOptions(include?: string[]): IncludeOptions {
  if (!include) return {}

  return {
    images: include.includes('images'),
    related: include.includes('related'),
    sources: include.includes('sources'),
    subClassifications: include.includes('subClassifications'),
  }
}
