import { beforeEach, describe, expect, it } from 'vitest'
import { MockCryptidsRepository } from '../helpers/mock-repository'
import { TestFactory } from '../helpers/test-factory'

describe('Filters: Combined Filters', () => {
  let repository: MockCryptidsRepository

  beforeEach(() => {
    repository = new MockCryptidsRepository()
  })

    repository.setData([
    ])

    const result = await repository.list({
      classification: ['cosmic'],
      page: 1,
      limit: 10,
    })

    expect(result.data).toHaveLength(1)
    expect(result.data[0].classification).toBe('cosmic')
  })

    repository.setData([
    ])

    const result = await repository.list({
      classification: ['cosmic', 'terrestrial'],
      page: 1,
      limit: 10,
    })

    expect(result.data).toHaveLength(2)
    expect(
      result.data.every(
        c =>
          (c.classification === 'cosmic' || c.classification === 'terrestrial') &&
      )
    ).toBe(true)
  })

    repository.setData([
      TestFactory.createCryptid({
        classification: 'cosmic',
        behavior: 'elusive',
      }),
      TestFactory.createCryptid({
        classification: 'cosmic',
        behavior: 'aggressive',
      }),
      TestFactory.createCryptid({
        classification: 'terrestrial',
        behavior: 'elusive',
      }),
    ])

    const result = await repository.list({
      classification: ['cosmic'],
      behavior: ['elusive'],
      page: 1,
      limit: 10,
    })

    expect(result.data).toHaveLength(1)
    expect(result.data[0].classification).toBe('cosmic')
    expect(result.data[0].behavior).toBe('elusive')
  })

  it('should apply classification and verification filters', async () => {
    repository.setData([
      TestFactory.createCryptid({ classification: 'cosmic', isVerified: true }),
      TestFactory.createCryptid({ classification: 'cosmic', isVerified: false }),
      TestFactory.createCryptid({ classification: 'terrestrial', isVerified: true }),
    ])

    const result = await repository.list({
      classification: ['cosmic'],
      isVerified: true,
      page: 1,
      limit: 10,
    })

    expect(result.data).toHaveLength(1)
    expect(result.data[0].classification).toBe('cosmic')
    expect(result.data[0].isVerified).toBe(true)
  })

  it('should apply classification and danger level filters', async () => {
    repository.setData([
      TestFactory.createCryptid({ classification: 'cosmic', dangerLevel: 2 }),
      TestFactory.createCryptid({ classification: 'cosmic', dangerLevel: 8 }),
      TestFactory.createCryptid({ classification: 'terrestrial', dangerLevel: 9 }),
    ])

    const result = await repository.list({
      classification: ['cosmic'],
      minDangerLevel: 5,
      page: 1,
      limit: 10,
    })

    expect(result.data).toHaveLength(1)
    expect(result.data[0].classification).toBe('cosmic')
    expect(result.data[0].dangerLevel).toBeGreaterThanOrEqual(5)
  })

  it('should apply all available filters', async () => {
    repository.setData([
      TestFactory.createCryptid({
        classification: 'cosmic',
        behavior: 'elusive',
        isVerified: true,
        dangerLevel: 7,
        firstSightedYear: 1950,
        lastSightedYear: 2020,
      }),
      TestFactory.createCryptid({
        classification: 'cosmic',
        behavior: 'elusive',
        isVerified: true,
        dangerLevel: 3,
        firstSightedYear: 1950,
        lastSightedYear: 2020,
      }),
      TestFactory.createCryptid({
        classification: 'terrestrial',
        behavior: 'aggressive',
        isVerified: false,
        dangerLevel: 9,
        firstSightedYear: 1800,
        lastSightedYear: 1900,
      }),
    ])

    const result = await repository.list({
      classification: ['cosmic'],
      behavior: ['elusive'],
      isVerified: true,
      minDangerLevel: 5,
      maxDangerLevel: 10,
      firstSightedAfter: 1900,
      lastSightedBefore: 2024,
      page: 1,
      limit: 10,
    })

    expect(result.data).toHaveLength(1)
    const cryptid = result.data[0]
    expect(cryptid.classification).toBe('cosmic')
    expect(cryptid.behavior).toBe('elusive')
    expect(cryptid.isVerified).toBe(true)
    expect(cryptid.dangerLevel).toBeGreaterThanOrEqual(5)
    expect(cryptid.dangerLevel).toBeLessThanOrEqual(10)
    expect(cryptid.firstSightedYear).toBeGreaterThanOrEqual(1900)
    expect(cryptid.lastSightedYear).toBeLessThanOrEqual(2024)
  })

  it('should return empty when no matches', async () => {
    repository.setData([
      TestFactory.createCryptid({ classification: 'cosmic' }),
      TestFactory.createCryptid({ classification: 'terrestrial' }),
    ])

    const result = await repository.list({
      classification: ['aquatic'],
      page: 1,
      limit: 10,
    })

    expect(result.data).toHaveLength(0)
    expect(result.pagination.totalItems).toBe(0)
  })

  it('should support or semantics within same filter', async () => {
    repository.setData([
      TestFactory.createCryptid({ classification: 'cosmic' }),
      TestFactory.createCryptid({ classification: 'terrestrial' }),
      TestFactory.createCryptid({ classification: 'aquatic' }),
    ])

    const result = await repository.list({
      classification: ['cosmic', 'aquatic'],
      page: 1,
      limit: 10,
    })

    expect(result.data).toHaveLength(2)
    expect(result.data.some(c => c.classification === 'cosmic')).toBe(true)
    expect(result.data.some(c => c.classification === 'aquatic')).toBe(true)
    expect(result.data.some(c => c.classification === 'terrestrial')).toBe(false)
  })

  it('should support and semantics across different filters', async () => {
    repository.setData([
      TestFactory.createCryptid({ classification: 'cosmic', isVerified: true }),
      TestFactory.createCryptid({ classification: 'cosmic', isVerified: false }),
      TestFactory.createCryptid({ classification: 'terrestrial', isVerified: true }),
    ])

    const result = await repository.list({
      classification: ['cosmic'],
      isVerified: true,
      page: 1,
      limit: 10,
    })

    expect(result.data).toHaveLength(1)
    expect(result.data[0].classification).toBe('cosmic')
    expect(result.data[0].isVerified).toBe(true)
  })
})
