import type { Cryptid } from '@/modules/cryptids/domain/entities/cryptid.entity'
import type { Image } from '@/modules/cryptids/domain/entities/image.entity'
import { pickFields } from '@/shared/utils/field-selector'
import type { CryptidDetailDTO, CryptidSummaryDTO } from '../dtos'
import { ImageMapper } from './image.mapper'

export interface CryptidWithRelations {
  cryptid: Cryptid
  classification: string
  hasImages?: boolean
  images?: Image[]
  relatedCryptids?: Array<CryptidWithRelations>
}

export interface MapperOptions {
  fields?: string[]
}

export class CryptidMapper {
  static toSummary(data: CryptidWithRelations, options?: MapperOptions): Partial<CryptidSummaryDTO> {
    const { cryptid, classification, hasImages = false } = data

    const summary: CryptidSummaryDTO = {
      id: cryptid.id,
      name: cryptid.name,
      aliases: cryptid.aliases,
      classification,
      status: cryptid.status,
      threatLevel: cryptid.threatLevel,
      hasImages,
      shortDescription: cryptid.shortDescription,
      createdAt: cryptid.createdAt.toISOString(),
    }

    if (options?.fields && options.fields.length > 0) {
      return pickFields(summary, options.fields)
    }

    return summary
  }

  static toDetail(
    data: CryptidWithRelations,
    options?: MapperOptions
  ): Partial<CryptidDetailDTO> {
    const {
      cryptid,
      classification,
      images,
      relatedCryptids,
    } = data

    const detail: CryptidDetailDTO = {
      id: cryptid.id,
      name: cryptid.name,
      aliases: cryptid.aliases,
      description: cryptid.description,
      originSummary: cryptid.originSummary,
      physicalDescription: cryptid.physicalDescription,
      behaviorNotes: cryptid.behaviorNotes,
      classification,
      manifestationConditions: cryptid.manifestationConditions,
      status: cryptid.status,
      threatLevel: cryptid.threatLevel,
      images: images?.map(ImageMapper.toDTO),
      relatedCryptids: relatedCryptids?.map(rc => CryptidMapper.toSummary(rc)) as CryptidSummaryDTO[],
      createdAt: cryptid.createdAt.toISOString(),
    }

    if (options?.fields && options.fields.length > 0) {
      return pickFields(detail, options.fields)
    }

    return detail
  }
}
