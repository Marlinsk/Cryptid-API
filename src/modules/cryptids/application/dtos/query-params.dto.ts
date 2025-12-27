import { z } from 'zod'

export const ALLOWED_DETAIL_FIELDS = [
  'id',
  'name',
  'aliases',
  'description',
  'originSummary',
  'physicalDescription',
  'behaviorNotes',
  'classification',
  'realm',
  'habitat',
  'manifestationConditions',
  'firstReportedAt',
  'lastReportedAt',
  'timelineSummary',
  'status',
  'threatLevel',
  'containmentNotes',
  'images',
  'relatedCryptids',
  'createdAt', // Private field - only returned when explicitly requested
  'updatedAt', // Private field - only returned when explicitly requested
] as const

export type AllowedDetailField = (typeof ALLOWED_DETAIL_FIELDS)[number]

export const PUBLIC_DETAIL_FIELDS = ALLOWED_DETAIL_FIELDS.filter(
  field => field !== 'createdAt' && field !== 'updatedAt'
)

export const PRIVATE_DETAIL_FIELDS = ['createdAt', 'updatedAt'] as const

export const includeParamSchema = z
  .string()
  .transform(val => val.split(',').map(v => v.trim()))
  .pipe(z.array(z.enum(['images', 'related'])))
  .optional()

export const fieldsParamSchema = z
  .string()
  .transform(val => val.split(',').map(v => v.trim()))
  .pipe(z.array(z.string().min(1)))
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
}

export function parseIncludeOptions(include?: string[]): IncludeOptions {
  if (!include) return {}

  return {
    images: include.includes('images'),
    related: include.includes('related'),
  }
}

export interface FieldSelectionOptions {
  fields?: string[]
}

export function parseFieldsOptions(fields?: string[]): FieldSelectionOptions {
  if (!fields || fields.length === 0) {
    return {}
  }

  const validFields = fields.filter(field =>
    ALLOWED_DETAIL_FIELDS.includes(field as AllowedDetailField)
  )

  return {
    fields: validFields.length > 0 ? validFields : undefined,
  }
}

export function getInvalidFields(requestedFields: string[]): string[] {
  return requestedFields.filter(
    field => !ALLOWED_DETAIL_FIELDS.includes(field as AllowedDetailField)
  )
}
