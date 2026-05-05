import type { Classification } from '../../domain/entities/classification.entity'
import type { ClassificationFullDTO } from '../dtos/classification.dto'

export class ClassificationMapper {
  static toDTO(classification: Classification): ClassificationFullDTO {
    return {
      id: classification.id,
      name: classification.name,
      description: classification.description,
      categoryType: classification.categoryType,
      createdAt: classification.createdAt.toISOString(),
    }
  }

  static toDTOList(classifications: Classification[]): ClassificationFullDTO[] {
    return classifications.map(c => this.toDTO(c))
  }
}
