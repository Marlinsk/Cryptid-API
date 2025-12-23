import { z } from 'zod'

export const listClassificationsSchema = z.object({
  categoryType: z.enum(['physical', 'narrative', 'abstract']).optional(),
})

export type ListClassificationsDTO = z.infer<typeof listClassificationsSchema>
