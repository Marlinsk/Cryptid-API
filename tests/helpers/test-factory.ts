import { faker } from '@faker-js/faker'

export interface TestCryptid {
  id: number
  name: string
  aliases: string[]
  classification: string
  habitat: string
  status: string
  threatLevel: string
  behavior?: string
  shortDescription: string
  description: string
  origin: string
  dangerLevel: number
  firstSightedYear?: number
  lastSightedYear?: number
  isVerified: boolean
  createdAt: Date
}

export class TestFactory {
  static createCryptid(overrides?: Partial<TestCryptid>): TestCryptid {
    return {
      id: faker.number.int({ min: 1, max: 10000 }),
      name: faker.animal.type(),
      aliases: [faker.word.noun(), faker.word.noun()],
      classification: faker.helpers.arrayElement([
        'cosmic',
        'terrestrial',
        'aquatic',
        'aerial',
        'interdimensional',
      ]),
      habitat: faker.helpers.arrayElement(['forest', 'ocean', 'desert', 'mountains', 'urban']),
      status: faker.helpers.arrayElement(['active', 'dormant', 'legendary']),
      threatLevel: faker.helpers.arrayElement(['low', 'medium', 'high', 'extreme']),
      shortDescription: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      origin: faker.location.country(),
      dangerLevel: faker.number.int({ min: 1, max: 10 }),
      firstSightedYear: faker.number.int({ min: 1500, max: 2024 }),
      lastSightedYear: faker.number.int({ min: 2000, max: 2024 }),
      isVerified: faker.datatype.boolean(),
      createdAt: faker.date.past(),
      ...overrides,
    }
  }

  static createCryptids(count: number, overrides?: Partial<TestCryptid>): TestCryptid[] {
    return Array.from({ length: count }, () => TestFactory.createCryptid(overrides))
  }

  static createCryptidWithClassification(classification: string): TestCryptid {
    return TestFactory.createCryptid({ classification })
  }

  }

  static createVerifiedCryptid(): TestCryptid {
    return TestFactory.createCryptid({ isVerified: true })
  }

  static createUnverifiedCryptid(): TestCryptid {
    return TestFactory.createCryptid({ isVerified: false })
  }

  static createDangerousCryptid(): TestCryptid {
    return TestFactory.createCryptid({ dangerLevel: faker.number.int({ min: 8, max: 10 }) })
  }

  static createSafeCryptid(): TestCryptid {
    return TestFactory.createCryptid({ dangerLevel: faker.number.int({ min: 1, max: 3 }) })
  }
}
