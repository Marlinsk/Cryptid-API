import type { Classification } from '../entities/classification.entity'

export interface IClassificationsRepository {
  findById(id: number): Promise<Classification | null>
  findAll(): Promise<Classification[]>
  findByCategoryType(categoryType: 'physical' | 'narrative' | 'abstract'): Promise<Classification[]>
}
