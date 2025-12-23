import { inject, injectable } from 'tsyringe'
import { type Either, left, right } from '@/shared/core/either'
import type { UseCase } from '@/shared/core/usecase'
import { AppError, NotFoundError } from '@/shared/errors/app-error'
import type { ICryptidsRepository } from '../../../domain/repositories/icryptids.repository'
import type { CryptidDetailDTO } from '../../dtos'
import { parseIncludeOptions } from '../../dtos/query-params.dto'
import { CryptidMapper } from '../../mappers'
import type { GetCryptidByIdWithQueryDTO } from './get-cryptid-by-id.dto'

type GetCryptidByIdResponse = Either<AppError, CryptidDetailDTO>

@injectable()
export class GetCryptidByIdUseCase
  implements UseCase<GetCryptidByIdWithQueryDTO, GetCryptidByIdResponse>
{
  constructor(
    @inject('CryptidsRepository')
    private cryptidsRepository: ICryptidsRepository
  ) {}

  async execute(data: GetCryptidByIdWithQueryDTO): Promise<GetCryptidByIdResponse> {
    try {
      const includeOptions = parseIncludeOptions(data.include)
      const result = await this.cryptidsRepository.findByIdWithRelations(data.id, includeOptions)

      if (!result) {
        return left(new NotFoundError('Cryptid not found'))
      }

      const detail = CryptidMapper.toDetail(result)

      return right(detail)
    } catch (error) {
      return left(new AppError('Failed to get cryptid'))
    }
  }
}
