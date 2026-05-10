import type { Image } from '../../domain/entities/image.entity'
import type { ImageDTO } from '../dtos/image.dto'

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
