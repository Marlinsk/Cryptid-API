import type { Cryptid } from '@/modules/cryptids/domain/entities/cryptid.entity'
import type { Image } from '@/modules/cryptids/domain/entities/image.entity'
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
  subClassifications?: string[]
  sources?: string[]
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

  static toDetail(data: CryptidWithRelations): CryptidDetailDTO {
    const {
      cryptid,
      classification,
      realm,
      habitat,
      images,
      relatedCryptids,
      subClassifications,
      sources,
    } = data

    return {
      id: cryptid.id,
      name: cryptid.name,
      aliases: cryptid.aliases,
      description: cryptid.description,
      originSummary: cryptid.originSummary,
      physicalDescription: cryptid.physicalDescription,
      behaviorNotes: cryptid.behaviorNotes,
      classification,
      subClassifications,
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
      sources,
      createdAt: cryptid.createdAt.toISOString(),
      updatedAt: cryptid.updatedAt.toISOString(),
    }
  }
}
