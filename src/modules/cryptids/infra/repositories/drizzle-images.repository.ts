import { db } from '@infra/database/connection'
import { images } from '@infra/database/schemas'
import type { PaginatedResult, PaginationParams } from '@shared/types/pagination'
import { and, count, eq } from 'drizzle-orm'
import { injectable } from 'tsyringe'
import { Image } from '../../domain/entities/image.entity'
import type { IImagesRepository, ListImagesFilters } from '../../domain/repositories/iimages.repository'

@injectable()
export class DrizzleImagesRepository implements IImagesRepository {
  async findById(id: string): Promise<Image | null> {
    const result = await db.select().from(images).where(eq(images.id, id)).limit(1)

    if (!result[0]) {
      return null
    }

    return this.mapToDomain(result[0])
  }

  async findByCryptidId(
    filters: ListImagesFilters,
    pagination: PaginationParams
  ): Promise<PaginatedResult<Image>> {
    const conditions: any[] = [eq(images.cryptidId, filters.cryptidId)]

    const offset = (pagination.page - 1) * pagination.limit

    const [data, totalResult] = await Promise.all([
      db
        .select()
        .from(images)
        .where(and(...conditions))
        .limit(pagination.limit)
        .offset(offset)
        .orderBy(images.createdAt),
      db
        .select({ count: count() })
        .from(images)
        .where(and(...conditions)),
    ])

    const total = totalResult[0]?.count || 0
    const totalPages = Math.ceil(total / pagination.limit)

    return {
      data: data.map(item => this.mapToDomain(item)),
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        totalItems: total,
        totalPages,
        hasNext: pagination.page < totalPages,
        hasPrevious: pagination.page > 1,
      },
    }
  }

  private mapToDomain(data: any): Image {
    return Image.create(
      {
        cryptidId: data.cryptidId,
        url: data.url,
        size: data.imageSize,
        altText: data.altText,
        source: data.source,
        license: data.license,
      },
      data.id
    )
  }
}
