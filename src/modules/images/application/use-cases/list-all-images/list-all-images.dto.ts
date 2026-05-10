import { z } from 'zod'

export const imageOrderableFields = ['id', 'createdAt'] as const

export const listAllImagesSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  sort: z.enum(imageOrderableFields).optional(),
  order: z.enum(['asc', 'desc']).default('asc'),
})

export type ListAllImagesDTO = z.infer<typeof listAllImagesSchema>
