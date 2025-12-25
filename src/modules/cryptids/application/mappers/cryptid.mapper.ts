import type { Cryptid } from '@/modules/cryptids/domain/entities/cryptid.entity'
import type { Image } from '@/modules/cryptids/domain/entities/image.entity'
import { pickFields } from '@/shared/utils/field-selector'
import type { CryptidDetailDTO, CryptidSummaryDTO } from '../dtos'
import { ImageMapper } from './image.mapper'

export interface CryptidWithRelations {
  cryptid: Cryptid
  classification: string
  realm: string
  habitat: string
  hasImages?: boolean
  images?: Image[]
  relatedCryptids?: Array<CryptidWithRelations>
}

export interface MapperOptions {
  fields?: string[]
}

export class CryptidMapper {
  static toSummary(data: CryptidWithRelations): CryptidSummaryDTO {
    const { cryptid, classification, realm, habitat, hasImages = false } = data

    return {
      id: cryptid.id,
      name: cryptid.name,
      aliases: cryptid.aliases,
      classification,
      realm,
      habitat,
      status: cryptid.status,
      threatLevel: cryptid.threatLevel,
      hasImages,
      shortDescription: cryptid.shortDescription,
      lastReportedAt: cryptid.lastReportedAt?.toISOString() || null,
    }
  }

  static toDetail(
    data: CryptidWithRelations,
    options?: MapperOptions
  ): Partial<CryptidDetailDTO> {
    const {
      cryptid,
      classification,
      realm,
      habitat,
      images,
      relatedCryptids,
    } = data

    // Base detail object without private fields
    const baseDetail: Omit<CryptidDetailDTO, 'createdAt' | 'updatedAt'> = {
      id: cryptid.id,
      name: cryptid.name,
      aliases: cryptid.aliases,
      description: cryptid.description,
      originSummary: cryptid.originSummary,
      physicalDescription: cryptid.physicalDescription,
      behaviorNotes: cryptid.behaviorNotes,
      classification,
      realm,
      habitat,
      manifestationConditions: cryptid.manifestationConditions,
      firstReportedAt: cryptid.firstReportedAt?.toISOString() || null,
      lastReportedAt: cryptid.lastReportedAt?.toISOString() || null,
      timelineSummary: cryptid.timelineSummary,
      status: cryptid.status,
      threatLevel: cryptid.threatLevel,
      containmentNotes: cryptid.containmentNotes,
      images: images?.map(ImageMapper.toDTO),
      relatedCryptids: relatedCryptids?.map(CryptidMapper.toSummary),
    }

    // Full detail with private fields (only used when explicitly requested)
    const fullDetail: CryptidDetailDTO = {
      ...baseDetail,
      createdAt: cryptid.createdAt.toISOString(),
      updatedAt: cryptid.updatedAt.toISOString(),
    }

    // Apply field selection if specified
    if (options?.fields && options.fields.length > 0) {
      return pickFields(fullDetail, options.fields)
    }

    // Return without private fields by default
    return baseDetail
  }
}
