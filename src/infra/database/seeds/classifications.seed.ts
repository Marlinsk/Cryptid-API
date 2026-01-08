import { db } from '../connection'
import { classifications } from '../schemas/classifications.schema'

export const classificationSeedData: Array<typeof classifications.$inferInsert> = [
  {
    "id": 1,
    "name": "Extraterrestrial-Associated Entity",
    "description": "Entities or cryptids whose reported characteristics, behaviors, or contextual evidence suggest a possible extraterrestrial origin or influence. This classification encompasses beings frequently associated with UFO sightings, alleged non-human intelligence, advanced technology, or environments inconsistent with known terrestrial biology. The category remains interpretative and does not assert confirmed extraterrestrial origin.",
    "categoryType": "origin"
  },
  {
    "id": 2,
    "name": "Aquatic Cryptid",
    "description": "Cryptids primarily associated with oceans, lakes, or other large bodies of water, often reported through sightings, sonar anomalies, or folklore.",
    "categoryType": "environment"
  },
  {
    "id": 3,
    "name": "Prehistoric Survivor",
    "description": "Entities believed to resemble or originate from prehistoric species, theorized to have survived extinction or exist in isolated or unexplored environments.",
    "categoryType": "origin"
  },
  {
    "id": 4,
    "name": "Hominid Cryptid",
    "description": "Bipedal, humanoid cryptids commonly associated with forests and remote wilderness areas.",
    "categoryType": "taxonomy"
  },
  {
    "id": 5,
    "name": "Folkloric Entity",
    "description": "Cryptids rooted primarily in regional folklore, oral traditions, and cultural mythology, often associated with symbolic or cautionary narratives.",
    "categoryType": "folklore"
  },
  {
    "id": 6,
    "name": "Modern Paranormal",
    "description": "Cryptids emerging from contemporary reports, urban legends, and modern eyewitness accounts, frequently linked to unexplained phenomena.",
    "categoryType": "paranormal"
  },
  {
    "id": 7,
    "name": "Mountain Humanoid",
    "description": "Bipedal humanoid cryptids associated with remote mountainous or alpine regions, often described as elusive and adapted to extreme climates.",
    "categoryType": "humanoid"
  },
  {
    "id": 8,
    "name": "Winged Humanoid",
    "description": "Humanoid cryptids that exhibit anatomical traits associated with flight, such as wings or aerial locomotion, often blending mammalian or anthropoid features with avian or chiropteran characteristics.",
    "categoryType": "hybrid"
  },
  {
    "id": 9,
    "name": "Gargoyle-like Entity",
    "description": "Cryptids characterized by gargoyle-inspired features, often described as winged, stone-like or reptilian humanoids associated with architecture, nocturnal activity, and territorial behavior.",
    "categoryType": "architectural"
  },
  {
    "id": 10,
    "name": "Historical Man-eating Cryptid",
    "description": "Cryptids rooted in historical accounts of unexplained predatory attacks on humans, blending documented events with folklore and mystery.",
    "categoryType": "historical"
  },
  {
    "id": 11,
    "name": "Unidentified Terrestrial Fauna",
    "description": "Cryptids classified as large, land-based biological entities reported outside known zoological records or geographic distributions, often resembling known animal families but lacking scientific verification.",
    "categoryType": "terrestrial"
  },
  {
    "id": 12,
    "name": "Shapeshifting Humanoid Entity",
    "description": "Cryptids described as humanoid entities capable of transforming their physical form, often into animals or hybrid shapes, commonly associated with ritual practices, cultural narratives, and anomalous behavioral patterns.",
    "categoryType": "humanoid"
  },
  {
    "id": 13,
    "name": "Anomalous Humanoid Entity",
    "description": "Cryptids described as humanoid entities with abnormal or non-standard physical characteristics, often reported through brief sightings and lacking clear biological classification.",
    "categoryType": "humanoid"
  },
  {
    "id": 14,
    "name": "Spiritual or Possession Entity",
    "description": "Cryptids or entities associated with spiritual influence, possession, curses, or transformations, often rooted in cultural belief systems and described as transcending purely biological explanations.",
    "categoryType": "metaphysical"
  }
]

export async function seedClassifications() {
  try {
    console.log('Starting classifications seed...')

    const inserted = await db.insert(classifications).values(classificationSeedData).onConflictDoNothing().returning()

    console.log(`✓ Successfully inserted ${inserted.length} classifications`)
    return inserted
  } catch (error) {
    console.error('Error seeding classifications:', error)
    throw error
  }
}

// Run seed if called directly
if (require.main === module) {
  seedClassifications()
    .then(() => {
      console.log('Classifications seed completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Classifications seed failed:', error)
      process.exit(1)
    })
}
