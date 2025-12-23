import { inject, injectable } from 'tsyringe'
import { type Either, left, right } from '@/shared/core/either'
import { AppError } from '@/shared/errors/app-error'
import type { Classification } from '../../../domain/entities/classification.entity'
import type { IClassificationsRepository } from '../../../domain/repositories/iclassifications.repository'
import type { ListClassificationsDTO } from './list-classifications.dto'

type Response = Either<AppError, Classification[]>

@injectable()
export class ListClassificationsUseCase {
  constructor(
    @inject('ClassificationsRepository')
    private classificationsRepository: IClassificationsRepository
  ) {}

  async execute(dto: ListClassificationsDTO): Promise<Response> {
    try {
      let result: Classification[]

      if (dto.categoryType) {
        result = await this.classificationsRepository.findByCategoryType(dto.categoryType)
      } else {
        result = await this.classificationsRepository.findAll()
      }

      return right(result)
    } catch (error) {
      return left(new AppError('Failed to list classifications'))
    }
  }
}
