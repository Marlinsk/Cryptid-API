import { z } from 'zod'

export const multivaluedStringSchema = z
  .string()
  .transform(val =>
    val
      .split(',')
      .map(v => v.trim())
      .filter(v => v.length > 0)
  )
  .pipe(z.array(z.string().min(1)))

export const multivaluedNumberSchema = z.string().transform(val =>
  val
    .split(',')
    .map(v => Number(v.trim()))
    .filter(v => !isNaN(v) && v > 0)
)

export const booleanFilterSchema = z.coerce.boolean()

export const orderableFields = [
  'id',
  'name',
  'status',
  'threatLevel',
  'firstReportedAt',
  'lastReportedAt',
  'createdAt',
  'updatedAt',
] as const

export type OrderableField = (typeof orderableFields)[number]

export const sortSchema = z.object({
  sort: z.enum(orderableFields).optional(),
  order: z.enum(['asc', 'desc']).default('asc'),
})

export function parseMultivaluedFilter<T>(
  value: string | undefined,
  transform?: (v: string) => T
): T[] | undefined {
  if (!value) return undefined

  const values = value
    .split(',')
    .map(v => v.trim())
    .filter(v => v.length > 0)

  if (values.length === 0) return undefined

  if (transform) {
    return values.map(transform)
  }

  return values as any
}

export interface AppliedFilters {
  [key: string]: any
}

export function extractAppliedFilters(params: Record<string, any>): AppliedFilters {
  const applied: AppliedFilters = {}

  const filterFields = [
    'search',
    'habitat',
    'realm',
    'classification',
    'status',
    'threatLevel',
    'hasImages',
    'threatLevelMin',
    'threatLevelMax',
  ]

  for (const field of filterFields) {
    if (params[field] !== undefined && params[field] !== null && params[field] !== '') {
      applied[field] = params[field]
    }
  }

  return applied
}
