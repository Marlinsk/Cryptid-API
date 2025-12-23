import { beforeEach, describe, expect, it } from 'vitest'
import { MockCryptidsRepository } from '../helpers/mock-repository'
import { TestFactory } from '../helpers/test-factory'

describe('Filters: Single Value Filters', () => {
  let repository: MockCryptidsRepository

  beforeEach(() => {
    repository = new MockCryptidsRepository()
  })

  describe('Classification Filter', () => {
    it('should_filter_by_single_classification', async () => {
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

    it('should_filter_by_multiple_classifications', async () => {
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

  describe('Realm Filter', () => {
    it('should_filter_by_single_realm', async () => {
      repository.setData([
        TestFactory.createCryptidWithRealm('ethereal'),
        TestFactory.createCryptidWithRealm('physical'),
        TestFactory.createCryptidWithRealm('spectral'),
      ])

      const result = await repository.list({
        realm: ['ethereal'],
        page: 1,
        limit: 10,
      })

      expect(result.data).toHaveLength(1)
      expect(result.data[0].realm).toBe('ethereal')
    })

    it('should_filter_by_multiple_realms', async () => {
      repository.setData([
        TestFactory.createCryptidWithRealm('ethereal'),
        TestFactory.createCryptidWithRealm('physical'),
        TestFactory.createCryptidWithRealm('spectral'),
        TestFactory.createCryptidWithRealm('dreamscape'),
      ])

      const result = await repository.list({
        realm: ['ethereal', 'spectral'],
        page: 1,
        limit: 10,
      })

      expect(result.data).toHaveLength(2)
      expect(result.data.every(c => c.realm === 'ethereal' || c.realm === 'spectral')).toBe(true)
    })
  })

  describe('Behavior Filter', () => {
    it('should_filter_by_single_behavior', async () => {
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

    it('should_filter_by_multiple_behaviors', async () => {
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
    it('should_filter_verified_only', async () => {
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

    it('should_filter_unverified_only', async () => {
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
    it('should_filter_by_minimum_danger_level', async () => {
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

    it('should_filter_by_maximum_danger_level', async () => {
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

    it('should_filter_by_danger_level_range', async () => {
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
    it('should_filter_by_first_sighted_after', async () => {
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

    it('should_filter_by_last_sighted_before', async () => {
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
