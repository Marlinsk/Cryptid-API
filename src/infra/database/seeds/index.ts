import { db, closeDatabase } from '../connection'
import { classifications } from '../schemas/classifications.schema'
import { cryptids } from '../schemas/cryptids.schema'
import { images } from '../schemas/images.schema'
import { classificationSeedData } from './classifications.seed'
import { cryptidSeedData } from './cryptids.seed'
import { imageSeedData } from './images.seed'

async function seedClassifications() {
  try {
    console.log('Checking classifications...')

    const existingClassifications = await db.select().from(classifications)
    const existingNames = new Set(existingClassifications.map((c) => c.name))
    
    const newClassifications = classificationSeedData.filter((c) => !existingNames.has(c.name))

    if (newClassifications.length === 0) {
      console.log(`✓ All ${classificationSeedData.length} classifications already exist`)
      return existingClassifications
    }

    const inserted = await db.insert(classifications).values(newClassifications).returning()

    console.log(
      `✓ Inserted ${inserted.length} new classification(s) (${existingClassifications.length} already existed)`,
    )
    return [...existingClassifications, ...inserted]
  } catch (error) {
    console.error('Error seeding classifications:', error)
    throw error
  }
}

async function seedCryptids() {
  try {
    console.log('Checking cryptids...')
    const existingCryptids = await db.select().from(cryptids)
    const existingNames = new Set(existingCryptids.map((c) => c.name))
    const newCryptids = cryptidSeedData.filter((c) => !existingNames.has(c.name))

    if (newCryptids.length === 0) {
      console.log(`✓ All ${cryptidSeedData.length} cryptids already exist`)
      return existingCryptids
    }

    const inserted = await db.insert(cryptids).values(newCryptids).returning()

    console.log(`✓ Inserted ${inserted.length} new cryptid(s) (${existingCryptids.length} already existed)`)
    return [...existingCryptids, ...inserted]
  } catch (error) {
    console.error('Error seeding cryptids:', error)
    throw error
  }
}

async function seedImages() {
  try {
    console.log('Checking images...')

    const existingImages = await db.select().from(images)
    const existingUrls = new Set(existingImages.map((img) => img.url))
    const newImages = imageSeedData.filter((img) => !existingUrls.has(img.url))

    if (newImages.length === 0) {
      console.log(`✓ All ${imageSeedData.length} images already exist`)
      return existingImages
    }

    const inserted = await db.insert(images).values(newImages).returning()

    console.log(`✓ Inserted ${inserted.length} new image(s) (${existingImages.length} already existed)`)
    return [...existingImages, ...inserted]
  } catch (error) {
    console.error('Error seeding images:', error)
    throw error
  }
}

async function runAllSeeds() {
  try {
    console.log('🌱 Starting database seeding...\n')

    await seedClassifications()
    console.log('')

    await seedCryptids()
    console.log('')

    await seedImages()
    console.log('')

    console.log('✓ All seeds completed successfully!')

    await closeDatabase()
    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    await closeDatabase()
    process.exit(1)
  }
}

if (require.main === module) {
  runAllSeeds()
}

export { runAllSeeds, seedClassifications, seedCryptids, seedImages }
