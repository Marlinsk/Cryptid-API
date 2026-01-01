import type { PaginatedResult } from '@shared/types/pagination'
import { inject, injectable } from 'tsyringe'
import { type Either, left, right } from '@/shared/core/either'
import { AppError } from '@/shared/errors/app-error'
import type { Image } from '../../../domain/entities/image.entity'
import type { IImagesRepository } from '../../../domain/repositories/iimages.repository'
import type { ListAllImagesDTO } from './list-all-images.dto'

type Response = Either<AppError, PaginatedResult<Image>>

@injectable()
export class ListAllImagesUseCase {
  constructor(
    @inject('ImagesRepository')
    private imagesRepository: IImagesRepository
  ) {}

  async execute(dto: ListAllImagesDTO): Promise<Response> {
    try {
      const pagination = {
        page: dto.page,
        limit: dto.limit,
      }

      const result = await this.imagesRepository.findAll(pagination)

      return right(result)
    } catch (error) {
      return left(new AppError('Failed to list images'))
    }
  }
}
