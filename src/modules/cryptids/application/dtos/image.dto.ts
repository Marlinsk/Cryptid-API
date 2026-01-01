import { z } from 'zod'

export const imageSchema = z.object({
  id: z.string(),
  url: z.string(),
  size: z.string(),
  altText: z.string(),
  source: z.string(),
  license: z.string(),
})

export type ImageDTO = z.infer<typeof imageSchema>
