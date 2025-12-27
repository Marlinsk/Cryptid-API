import type { Classification } from '@/modules/cryptids/domain/entities/classification.entity'
import { pickFields } from '@/shared/utils/field-selector'
import type { ClassificationDTO } from '../dtos'

export interface MapperOptions {
  fields?: string[]
}

export class ClassificationMapper {
  static toDTO(classification: Classification, options?: MapperOptions): Partial<ClassificationDTO> & { createdAt?: string; updatedAt?: string } {
    const baseDTO: ClassificationDTO = {
      id: classification.id,
      name: classification.name,
      description: classification.description,
      categoryType: classification.categoryType,
    }

    const fullDTO = {
      ...baseDTO,
      createdAt: classification.createdAt.toISOString(),
      updatedAt: classification.updatedAt.toISOString(),
    }

    if (options?.fields && options.fields.length > 0) {
      return pickFields(fullDTO, options.fields)
    }

    return baseDTO
  }

  static toDTOList(classifications: Classification[], options?: MapperOptions): (Partial<ClassificationDTO> & { createdAt?: string; updatedAt?: string })[] {
    return classifications.map(c => this.toDTO(c, options))
  }
}
