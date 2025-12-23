import { inject, injectable } from 'tsyringe'
import { type Either, left, right } from '@/shared/core/either'
import { AppError, NotFoundError } from '@/shared/errors/app-error'
import type { CryptidWithRelations, ICryptidsRepository } from '../../../domain/repositories/icryptids.repository'
import type { ExploreRelatedResourcesDTO } from './explore-related-resources.dto'

type Response = Either<AppError | NotFoundError, CryptidWithRelations[]>

@injectable()
export class ExploreRelatedResourcesUseCase {
  constructor(
    @inject('CryptidsRepository')
    private cryptidsRepository: ICryptidsRepository
  ) {}

  async execute(dto: ExploreRelatedResourcesDTO): Promise<Response> {
    try {
      const cryptid = await this.cryptidsRepository.findById(dto.cryptidId)

      if (!cryptid) {
        return left(new NotFoundError('Cryptid not found'))
      }

      const result = await this.cryptidsRepository.findRelated(dto.cryptidId, dto.relationType)

      return right(result)
    } catch (error) {
      return left(new AppError('Failed to explore related resources'))
    }
  }
}
