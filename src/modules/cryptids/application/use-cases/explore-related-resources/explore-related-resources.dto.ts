import { z } from 'zod'

export const exploreRelatedResourcesSchema = z.object({
  cryptidId: z.coerce.number().min(1),
  relationType: z.enum(['sameClassification']),
})

export type ExploreRelatedResourcesDTO = z.infer<typeof exploreRelatedResourcesSchema>
