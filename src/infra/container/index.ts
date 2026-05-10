import { container } from 'tsyringe'
import type { IClassificationsRepository } from '@modules/classifications/domain/repositories/iclassifications.repository'
import type { ICryptidsRepository } from '@/modules/cryptids/domain/repositories/icryptids.repository'
import type { IImagesRepository } from '@modules/images/domain/repositories/iimages.repository'
import { DrizzleClassificationsRepository } from '@modules/classifications/infra/repositories/drizzle-classifications.repository'
import { DrizzleCryptidsRepository } from '@/modules/cryptids/infra/repositories/drizzle-cryptids.repository'
import { DrizzleImagesRepository } from '@modules/images/infra/repositories/drizzle-images.repository'

container.registerSingleton<ICryptidsRepository>('CryptidsRepository', DrizzleCryptidsRepository)
container.registerSingleton<IClassificationsRepository>('ClassificationsRepository', DrizzleClassificationsRepository)
container.registerSingleton<IImagesRepository>('ImagesRepository', DrizzleImagesRepository)
