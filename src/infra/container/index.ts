import { container } from 'tsyringe'
import type { ICryptidsRepository } from '@/modules/cryptids/domain/repositories/icryptids.repository'
import { DrizzleCryptidsRepository } from '@/modules/cryptids/infra/repositories/drizzle-cryptids.repository'

container.registerSingleton<ICryptidsRepository>('CryptidsRepository', DrizzleCryptidsRepository)
