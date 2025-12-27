import { z } from 'zod'

export const classificationDTOSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  categoryType: z.enum(['physical', 'narrative', 'abstract']),
})

export type ClassificationDTO = z.infer<typeof classificationDTOSchema>

export const classificationFullDTOSchema = classificationDTOSchema.extend({
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type ClassificationFullDTO = z.infer<typeof classificationFullDTOSchema>
