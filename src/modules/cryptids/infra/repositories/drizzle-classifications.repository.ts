import { db } from '@infra/database/connection'
import { classifications } from '@infra/database/schemas'
import { eq } from 'drizzle-orm'
import { injectable } from 'tsyringe'
import { Classification } from '../../domain/entities/classification.entity'
import type { IClassificationsRepository } from '../../domain/repositories/iclassifications.repository'

@injectable()
export class DrizzleClassificationsRepository implements IClassificationsRepository {
  async findById(id: number): Promise<Classification | null> {
    const result = await db
      .select()
      .from(classifications)
      .where(eq(classifications.id, id))
      .limit(1)

    if (!result[0]) {
      return null
    }

    return this.mapToDomain(result[0])
  }

  async findAll(): Promise<Classification[]> {
    const result = await db.select().from(classifications).orderBy(classifications.name)
    return result.map(data => this.mapToDomain(data))
  }

  async findByCategoryType(
    categoryType: 'physical' | 'narrative' | 'abstract'
  ): Promise<Classification[]> {
    const result = await db
      .select()
      .from(classifications)
      .where(eq(classifications.categoryType, categoryType))
      .orderBy(classifications.name)

    return result.map(data => this.mapToDomain(data))
  }

  private mapToDomain(data: any): Classification {
    return Classification.create(
      {
        name: data.name,
        description: data.description,
        categoryType: data.categoryType as 'physical' | 'narrative' | 'abstract',
      },
      data.id
    )
  }
}
