import { z } from 'zod'

export const cryptidSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  aliases: z.array(z.string()),
  classification: z.string(),
  status: z.string(),
  threatLevel: z.string(),
  hasImages: z.boolean(),
  shortDescription: z.string(),
  createdAt: z.string(),
})

export type CryptidSummaryDTO = z.infer<typeof cryptidSummarySchema>
