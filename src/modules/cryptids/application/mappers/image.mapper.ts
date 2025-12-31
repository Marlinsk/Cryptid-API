import type { Image } from '@/modules/cryptids/domain/entities/image.entity'
import type { ImageDTO } from '../dtos'

export class ImageMapper {
  static toDTO(image: Image): ImageDTO {
    return {
      id: image.id,
      url: image.url,
      size: image.size,
      altText: image.altText,
      source: image.source,
      license: image.license,
    }
  }
}
