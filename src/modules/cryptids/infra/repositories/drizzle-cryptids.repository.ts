import { db } from '@infra/database/connection'
import { classifications, cryptids, habitats, images, realms } from '@infra/database/schemas'
import type { PaginatedResult, PaginationParams, SortParams } from '@shared/types/pagination'
import { and, count, eq, exists, inArray, like, or, sql } from 'drizzle-orm'
import { injectable } from 'tsyringe'
import { Cryptid } from '../../domain/entities/cryptid.entity'
import { Image } from '../../domain/entities/image.entity'
import type { CryptidWithRelations, ICryptidsRepository, IncludeRelations, ListCryptidsFilters } from '../../domain/repositories/icryptids.repository'

@injectable()
export class DrizzleCryptidsRepository implements ICryptidsRepository {
  private sanitizeSearchQuery(query: string): string {
    return query.replace(/[%_\\]/g, '\\$&')
  }

  async findById(id: number): Promise<Cryptid | null> {
    const result = await db.select().from(cryptids).where(eq(cryptids.id, id)).limit(1)

    if (!result[0]) {
      return null
    }

    return this.mapToDomain(result[0])
  }

  async findByIdWithRelations(id: number, include?: IncludeRelations) {
    const result = await db
      .select({
        cryptid: cryptids,
        classification: classifications.name,
        realm: realms.name,
        habitat: habitats.name,
      })
      .from(cryptids)
      .innerJoin(classifications, eq(cryptids.classificationId, classifications.id))
      .innerJoin(realms, eq(cryptids.realmId, realms.id))
      .innerJoin(habitats, eq(cryptids.habitatId, habitats.id))
      .where(eq(cryptids.id, id))
      .limit(1)

    if (!result[0]) {
      return null
    }

    const { cryptid: cryptidData, classification, realm, habitat } = result[0]
    const cryptid = this.mapToDomain(cryptidData)

    const response: any = {
      cryptid,
      classification,
      realm,
      habitat,
    }

    if (include?.images) {
      const imagesData = await db.select().from(images).where(eq(images.cryptidId, id))

      response.images = imagesData.map(this.mapImageToDomain)
    }

    if (include?.related) {
      const relatedData = await db
        .select({
          cryptid: cryptids,
          classification: classifications.name,
          realm: realms.name,
          habitat: habitats.name,
        })
        .from(cryptids)
        .innerJoin(classifications, eq(cryptids.classificationId, classifications.id))
        .innerJoin(realms, eq(cryptids.realmId, realms.id))
        .innerJoin(habitats, eq(cryptids.habitatId, habitats.id))
        .where(
          and(
            or(
              eq(cryptids.realmId, cryptidData.realmId),
              eq(cryptids.classificationId, cryptidData.classificationId)
            ),
            sql`${cryptids.id} != ${id}`
          )
        )
        .limit(5)

      const relatedWithCounts = await Promise.all(
        relatedData.map(async item => ({
          cryptid: this.mapToDomain(item.cryptid),
          classification: item.classification,
          realm: item.realm,
          habitat: item.habitat,
          hasImages: await this.hasImages(item.cryptid.id),
        }))
      )

      response.relatedCryptids = relatedWithCounts
    }

    if (include?.subClassifications) {
      response.subClassifications = []
    }

    if (include?.sources) {
      response.sources = []
    }

    return response
  }

  async hasImages(cryptidId: number): Promise<boolean> {
    const result = await db
      .select({ id: images.id })
      .from(images)
      .where(eq(images.cryptidId, cryptidId))
      .limit(1)

    return result.length > 0
  }

  async findAll(): Promise<Cryptid[]> {
    const result = await db.select().from(cryptids)
    return result.map(data => this.mapToDomain(data))
  }

  async findWithFilters(
    filters: ListCryptidsFilters,
    pagination: PaginationParams,
    sort: SortParams
  ): Promise<PaginatedResult<CryptidWithRelations>> {
    const conditions = this.buildWhereConditions(filters)
    const offset = (pagination.page - 1) * pagination.limit

    const [data, totalResult] = await Promise.all([
      db
        .select({
          cryptid: cryptids,
          classification: classifications.name,
          realm: realms.name,
          habitat: habitats.name,
        })
        .from(cryptids)
        .innerJoin(classifications, eq(cryptids.classificationId, classifications.id))
        .innerJoin(realms, eq(cryptids.realmId, realms.id))
        .innerJoin(habitats, eq(cryptids.habitatId, habitats.id))
        .where(and(...conditions))
        .limit(pagination.limit)
        .offset(offset)
        .orderBy(this.buildOrderBy(sort)),
      db
        .select({ count: count() })
        .from(cryptids)
        .where(and(...conditions)),
    ])

    const totalItems = totalResult[0]?.count || 0
    const totalPages = Math.ceil(totalItems / pagination.limit)

    const dataWithRelations = await Promise.all(
      data.map(async item => ({
        cryptid: this.mapToDomain(item.cryptid),
        classification: item.classification,
        realm: item.realm,
        habitat: item.habitat,
        hasImages: await this.hasImages(item.cryptid.id),
      }))
    )

    return {
      data: dataWithRelations,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        totalItems,
        totalPages,
        hasNext: pagination.page < totalPages,
        hasPrevious: pagination.page > 1,
      },
    }
  }

  async search(
    query: string,
    filters: Partial<ListCryptidsFilters>,
    pagination: PaginationParams
  ): Promise<PaginatedResult<CryptidWithRelations>> {
    const sanitizedQuery = this.sanitizeSearchQuery(query)

    const searchCondition = or(
      like(cryptids.name, `%${sanitizedQuery}%`),
      like(cryptids.description, `%${sanitizedQuery}%`),
      like(cryptids.originSummary, `%${sanitizedQuery}%`)
    )

    const conditions = this.buildWhereConditions(filters)
    conditions.push(searchCondition)

    const offset = (pagination.page - 1) * pagination.limit

    const [data, totalResult] = await Promise.all([
      db
        .select({
          cryptid: cryptids,
          classification: classifications.name,
          realm: realms.name,
          habitat: habitats.name,
        })
        .from(cryptids)
        .innerJoin(classifications, eq(cryptids.classificationId, classifications.id))
        .innerJoin(realms, eq(cryptids.realmId, realms.id))
        .innerJoin(habitats, eq(cryptids.habitatId, habitats.id))
        .where(and(...conditions))
        .limit(pagination.limit)
        .offset(offset),
      db
        .select({ count: count() })
        .from(cryptids)
        .where(and(...conditions)),
    ])

    const totalItems = totalResult[0]?.count || 0
    const totalPages = Math.ceil(totalItems / pagination.limit)

    const dataWithRelations = await Promise.all(
      data.map(async item => ({
        cryptid: this.mapToDomain(item.cryptid),
        classification: item.classification,
        realm: item.realm,
        habitat: item.habitat,
        hasImages: await this.hasImages(item.cryptid.id),
      }))
    )

    return {
      data: dataWithRelations,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        totalItems,
        totalPages,
        hasNext: pagination.page < totalPages,
        hasPrevious: pagination.page > 1,
      },
    }
  }

  async findRelated(
    cryptidId: number,
    relationType: 'similarHabitat' | 'sameRealm' | 'sameClassification'
  ): Promise<CryptidWithRelations[]> {
    const baseCryptid = await this.findById(cryptidId)
    if (!baseCryptid) return []

    let condition
    switch (relationType) {
      case 'similarHabitat':
        condition = eq(cryptids.habitatId, baseCryptid.habitatId)
        break
      case 'sameRealm':
        condition = eq(cryptids.realmId, baseCryptid.realmId)
        break
      case 'sameClassification':
        condition = eq(cryptids.classificationId, baseCryptid.classificationId)
        break
    }

    const result = await db
      .select({
        cryptid: cryptids,
        classification: classifications.name,
        realm: realms.name,
        habitat: habitats.name,
      })
      .from(cryptids)
      .innerJoin(classifications, eq(cryptids.classificationId, classifications.id))
      .innerJoin(realms, eq(cryptids.realmId, realms.id))
      .innerJoin(habitats, eq(cryptids.habitatId, habitats.id))
      .where(and(condition, sql`${cryptids.id} != ${cryptidId}`))
      .limit(10)

    return Promise.all(
      result.map(async item => ({
        cryptid: this.mapToDomain(item.cryptid),
        classification: item.classification,
        realm: item.realm,
        habitat: item.habitat,
        hasImages: await this.hasImages(item.cryptid.id),
      }))
    )
  }

  private buildWhereConditions(filters: Partial<ListCryptidsFilters>) {
    const conditions: any[] = []

    if (filters.habitat) {
      conditions.push(
        Array.isArray(filters.habitat)
          ? inArray(cryptids.habitatId, filters.habitat)
          : eq(cryptids.habitatId, filters.habitat)
      )
    }

    if (filters.realm) {
      conditions.push(
        Array.isArray(filters.realm)
          ? inArray(cryptids.realmId, filters.realm)
          : eq(cryptids.realmId, filters.realm)
      )
    }

    if (filters.classification) {
      conditions.push(
        Array.isArray(filters.classification)
          ? inArray(cryptids.classificationId, filters.classification)
          : eq(cryptids.classificationId, filters.classification)
      )
    }

    if (filters.status) {
      conditions.push(
        Array.isArray(filters.status)
          ? inArray(cryptids.status, filters.status)
          : eq(cryptids.status, filters.status)
      )
    }

    if (filters.threatLevel) {
      conditions.push(
        Array.isArray(filters.threatLevel)
          ? inArray(cryptids.threatLevel, filters.threatLevel)
          : eq(cryptids.threatLevel, filters.threatLevel)
      )
    }

    if (filters.hasImages !== undefined) {
      if (filters.hasImages) {
        conditions.push(exists(db.select().from(images).where(eq(images.cryptidId, cryptids.id))))
      }
    }

    if (filters.search) {
      const sanitizedSearch = this.sanitizeSearchQuery(filters.search)
      const searchCondition = or(
        like(cryptids.name, `%${sanitizedSearch}%`),
        like(cryptids.shortDescription, `%${sanitizedSearch}%`),
        like(cryptids.originSummary, `%${sanitizedSearch}%`)
      )
      conditions.push(searchCondition)
    }

    return conditions.length > 0 ? conditions : [sql`1=1`]
  }

  private buildOrderBy(sort: SortParams) {
    const column = sort.sort || 'id'
    const direction = sort.order || 'asc'

    const columnMap: Record<string, any> = {
      id: cryptids.id,
      name: cryptids.name,
      status: cryptids.status,
      threatLevel: cryptids.threatLevel,
      firstReportedAt: cryptids.firstReportedAt,
      lastReportedAt: cryptids.lastReportedAt,
      createdAt: cryptids.createdAt,
      updatedAt: cryptids.updatedAt,
    }

    const selectedColumn = columnMap[column] || cryptids.id
    return direction === 'desc' ? sql`${selectedColumn} DESC` : sql`${selectedColumn} ASC`
  }

  private mapToDomain(data: any): Cryptid {
    return Cryptid.create(
      {
        name: data.name,
        aliases: data.aliases || [],
        description: data.description,
        shortDescription: data.shortDescription || data.description.substring(0, 200),
        originSummary: data.originSummary,
        physicalDescription: data.physicalDescription || null,
        behaviorNotes: data.behaviorNotes || null,
        manifestationConditions: data.manifestationConditions || null,
        timelineSummary: data.timelineSummary || null,
        containmentNotes: data.containmentNotes || null,
        classificationId: data.classificationId,
        realmId: data.realmId,
        habitatId: data.habitatId,
        status: data.status,
        threatLevel: data.threatLevel,
        firstReportedAt: data.firstReportedAt,
        lastReportedAt: data.lastReportedAt,
      },
      data.id
    )
  }

  private mapImageToDomain(data: any): Image {
    return Image.create(
      {
        cryptidId: data.cryptidId,
        url: data.url,
        altText: data.altText,
        source: data.source,
        license: data.license,
      },
      data.id
    )
  }
}
