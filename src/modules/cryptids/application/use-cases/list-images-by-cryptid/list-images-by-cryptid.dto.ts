import { z } from 'zod'

export const listImagesByCryptidSchema = z.object({
  cryptidId: z.coerce.number().min(1),
  license: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
})

export type ListImagesByCryptidDTO = z.infer<typeof listImagesByCryptidSchema>
