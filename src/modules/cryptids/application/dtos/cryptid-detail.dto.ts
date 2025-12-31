import { z } from 'zod'
import { cryptidSummarySchema } from './cryptid-summary.dto'
import { imageSchema } from './image.dto'

export const cryptidDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  aliases: z.array(z.string()),
  description: z.string(),
  originSummary: z.string(),
  physicalDescription: z.string().nullable().optional(),
  behaviorNotes: z.string().nullable().optional(),
  classification: z.string(),
  manifestationConditions: z.string().nullable().optional(),
  status: z.string(),
  threatLevel: z.string(),
  images: z.array(imageSchema).optional(),
  relatedCryptids: z.array(cryptidSummarySchema).optional(),
  createdAt: z.string(),
})

export type CryptidDetailDTO = z.infer<typeof cryptidDetailSchema>
