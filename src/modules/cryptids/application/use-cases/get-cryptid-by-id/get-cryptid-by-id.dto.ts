import { z } from 'zod'
import { cryptidDetailQuerySchema } from '../../dtos/query-params.dto'

export const getCryptidByIdSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export const getCryptidByIdWithQuerySchema = getCryptidByIdSchema.merge(cryptidDetailQuerySchema)
export type GetCryptidByIdDTO = z.infer<typeof getCryptidByIdSchema>
export type GetCryptidByIdWithQueryDTO = z.infer<typeof getCryptidByIdWithQuerySchema>
