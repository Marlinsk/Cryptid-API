import { z } from 'zod'

const IMPLICIT_FIELDS = ['id'] as const

export const ALLOWED_DETAIL_FIELDS = [
  'name',
  'aliases',
  'description',
  'originSummary',
  'physicalDescription',
  'behaviorNotes',
  'classification',
  'manifestationConditions',
  'status',
  'threatLevel',
  'images',
  'relatedCryptids',
  'createdAt',
] as const

export type AllowedDetailField = (typeof ALLOWED_DETAIL_FIELDS)[number]

export const PUBLIC_DETAIL_FIELDS = ALLOWED_DETAIL_FIELDS

export const PRIVATE_DETAIL_FIELDS = [] as const

export const includeParamSchema = z
  .union([
    z.array(z.enum(['images', 'related'])),
    z.string().min(1)
  ])
  .transform(val => {
    if (val === undefined) return undefined
    if (Array.isArray(val)) return val
    if (typeof val === 'string') {
      // Try to parse as JSON array first (e.g., '["images","related"]')
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

      // Parse comma-separated values (e.g., "images,related")
      return val.split(',').map(v => v.trim()).filter(v => v.length > 0)
    }
    return [val]
  })
  .optional()

export const fieldsParamSchema = z
  .union([
    z.array(z.string().min(1)),
    z.string().min(1)
  ])
  .transform(val => {
    if (val === undefined) return undefined
    if (Array.isArray(val)) return val
    if (typeof val === 'string') {
      // Try to parse as JSON array first (e.g., '["id","name","status"]')
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

      // Parse comma-separated values (e.g., "id,name,status")
      return val.split(',').map(v => v.trim()).filter(v => v.length > 0)
    }
    return [val]
  })
  .optional()

export const expandParamSchema = z
  .union([
    z.array(z.enum(['images.metadata', 'related.classification'])),
    z.string().min(1)
  ])
  .transform(val => {
    if (val === undefined) return undefined
    if (Array.isArray(val)) return val
    if (typeof val === 'string') {
      // Try to parse as JSON array first (e.g., '["images.metadata"]')
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

      // Parse comma-separated values (e.g., "images.metadata,related.classification")
      return val.split(',').map(v => v.trim()).filter(v => v.length > 0)
    }
    return [val]
  })
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
    field =>
      !ALLOWED_DETAIL_FIELDS.includes(field as AllowedDetailField) &&
      !IMPLICIT_FIELDS.includes(field as (typeof IMPLICIT_FIELDS)[number])
  )
}
