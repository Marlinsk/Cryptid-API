import { beforeEach, describe, expect, it } from 'vitest'
import { MockCryptidsRepository } from '../helpers/mock-repository'
import { TestFactory } from '../helpers/test-factory'

describe('Filters: Single Value Filters', () => {
  let repository: MockCryptidsRepository

  beforeEach(() => {
    repository = new MockCryptidsRepository()
  })

  describe('Classification Filter', () => {
    it('should filter by single classification', async () => {
      repository.setData([
        TestFactory.createCryptidWithClassification('cosmic'),
        TestFactory.createCryptidWithClassification('terrestrial'),
        TestFactory.createCryptidWithClassification('aquatic'),
      ])

      const result = await repository.list({
        classification: ['cosmic'],
        page: 1,
        limit: 10,
      })

      expect(result.data).toHaveLength(1)
      expect(result.data[0].classification).toBe('cosmic')
    })

    it('should filter by multiple classifications', async () => {
      repository.setData([
        TestFactory.createCryptidWithClassification('cosmic'),
        TestFactory.createCryptidWithClassification('terrestrial'),
        TestFactory.createCryptidWithClassification('aquatic'),
        TestFactory.createCryptidWithClassification('aerial'),
      ])

      const result = await repository.list({
        classification: ['cosmic', 'aquatic'],
        page: 1,
        limit: 10,
      })

      expect(result.data).toHaveLength(2)
      expect(
        result.data.every(c => c.classification === 'cosmic' || c.classification === 'aquatic')
      ).toBe(true)
    })
  })

  describe(' Filter', () => {
      repository.setData([
        TestFactory.createCryptidWith('ethereal'),
        TestFactory.createCryptidWith('physical'),
        TestFactory.createCryptidWith('spectral'),
      ])

      const result = await repository.list({
        page: 1,
        limit: 10,
      })

      expect(result.data).toHaveLength(1)
    })

      repository.setData([
        TestFactory.createCryptidWith('ethereal'),
        TestFactory.createCryptidWith('physical'),
        TestFactory.createCryptidWith('spectral'),
        TestFactory.createCryptidWith('dreamscape'),
      ])

      const result = await repository.list({
        page: 1,
        limit: 10,
      })

      expect(result.data).toHaveLength(2)
    })
  })

  describe('Behavior Filter', () => {
    it('should filter by single behavior', async () => {
      repository.setData([
        TestFactory.createCryptid({ behavior: 'aggressive' }),
        TestFactory.createCryptid({ behavior: 'elusive' }),
        TestFactory.createCryptid({ behavior: 'protective' }),
      ])

      const result = await repository.list({
        behavior: ['aggressive'],
        page: 1,
        limit: 10,
      })

      expect(result.data).toHaveLength(1)
      expect(result.data[0].behavior).toBe('aggressive')
    })

    it('should filter by multiple behaviors', async () => {
      repository.setData([
        TestFactory.createCryptid({ behavior: 'aggressive' }),
        TestFactory.createCryptid({ behavior: 'elusive' }),
        TestFactory.createCryptid({ behavior: 'protective' }),
        TestFactory.createCryptid({ behavior: 'curious' }),
      ])

      const result = await repository.list({
        behavior: ['elusive', 'curious'],
        page: 1,
        limit: 10,
      })

      expect(result.data).toHaveLength(2)
      expect(result.data.every(c => c.behavior === 'elusive' || c.behavior === 'curious')).toBe(
        true
      )
    })
  })

  describe('Verification Status Filter', () => {
    it('should filter verified only', async () => {
      repository.setData([
        TestFactory.createVerifiedCryptid(),
        TestFactory.createVerifiedCryptid(),
        TestFactory.createUnverifiedCryptid(),
        TestFactory.createUnverifiedCryptid(),
      ])

      const result = await repository.list({
        isVerified: true,
        page: 1,
        limit: 10,
      })

      expect(result.data).toHaveLength(2)
      expect(result.data.every(c => c.isVerified === true)).toBe(true)
    })

    it('should filter unverified only', async () => {
      repository.setData([
        TestFactory.createVerifiedCryptid(),
        TestFactory.createVerifiedCryptid(),
        TestFactory.createUnverifiedCryptid(),
        TestFactory.createUnverifiedCryptid(),
        TestFactory.createUnverifiedCryptid(),
      ])

      const result = await repository.list({
        isVerified: false,
        page: 1,
        limit: 10,
      })

      expect(result.data).toHaveLength(3)
      expect(result.data.every(c => c.isVerified === false)).toBe(true)
    })
  })

  describe('Danger Level Range Filters', () => {
    it('should filter by minimum danger level', async () => {
      repository.setData([
        TestFactory.createCryptid({ dangerLevel: 2 }),
        TestFactory.createCryptid({ dangerLevel: 5 }),
        TestFactory.createCryptid({ dangerLevel: 8 }),
        TestFactory.createCryptid({ dangerLevel: 10 }),
      ])

      const result = await repository.list({
        minDangerLevel: 7,
        page: 1,
        limit: 10,
      })

      expect(result.data).toHaveLength(2)
      expect(result.data.every(c => c.dangerLevel >= 7)).toBe(true)
    })

    it('should filter by maximum danger level', async () => {
      repository.setData([
        TestFactory.createCryptid({ dangerLevel: 2 }),
        TestFactory.createCryptid({ dangerLevel: 5 }),
        TestFactory.createCryptid({ dangerLevel: 8 }),
        TestFactory.createCryptid({ dangerLevel: 10 }),
      ])

      const result = await repository.list({
        maxDangerLevel: 5,
        page: 1,
        limit: 10,
      })

      expect(result.data).toHaveLength(2)
      expect(result.data.every(c => c.dangerLevel <= 5)).toBe(true)
    })

    it('should filter by danger level range', async () => {
      repository.setData([
        TestFactory.createCryptid({ dangerLevel: 2 }),
        TestFactory.createCryptid({ dangerLevel: 5 }),
        TestFactory.createCryptid({ dangerLevel: 7 }),
        TestFactory.createCryptid({ dangerLevel: 10 }),
      ])

      const result = await repository.list({
        minDangerLevel: 5,
        maxDangerLevel: 8,
        page: 1,
        limit: 10,
      })

      expect(result.data).toHaveLength(2)
      expect(result.data.every(c => c.dangerLevel >= 5 && c.dangerLevel <= 8)).toBe(true)
    })
  })

  describe('Sighting Year Filters', () => {
    it('should filter by first sighted after', async () => {
      repository.setData([
        TestFactory.createCryptid({ firstSightedYear: 1800 }),
        TestFactory.createCryptid({ firstSightedYear: 1900 }),
        TestFactory.createCryptid({ firstSightedYear: 2000 }),
        TestFactory.createCryptid({ firstSightedYear: 2020 }),
      ])

      const result = await repository.list({
        firstSightedAfter: 1950,
        page: 1,
        limit: 10,
      })

      expect(result.data).toHaveLength(2)
      expect(result.data.every(c => c.firstSightedYear! >= 1950)).toBe(true)
    })

    it('should filter by last sighted before', async () => {
      repository.setData([
        TestFactory.createCryptid({ lastSightedYear: 1950 }),
        TestFactory.createCryptid({ lastSightedYear: 1980 }),
        TestFactory.createCryptid({ lastSightedYear: 2000 }),
        TestFactory.createCryptid({ lastSightedYear: 2023 }),
      ])

      const result = await repository.list({
        lastSightedBefore: 2000,
        page: 1,
        limit: 10,
      })

      expect(result.data).toHaveLength(3)
      expect(result.data.every(c => c.lastSightedYear! <= 2000)).toBe(true)
    })
  })
})
