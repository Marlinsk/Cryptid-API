import { describe, expect, it } from 'vitest'
import { TestFactory } from '../helpers/test-factory'

describe('Domain: Cryptid Entity', () => {
  describe('Entity Properties', () => {
    it('should have required properties', () => {
      const cryptid = TestFactory.createCryptid()

      expect(cryptid).toHaveProperty('id')
      expect(cryptid).toHaveProperty('name')
      expect(cryptid).toHaveProperty('classification')
      expect(cryptid).toHaveProperty('realm')
      expect(cryptid).toHaveProperty('habitat')
      expect(cryptid).toHaveProperty('status')
      expect(cryptid).toHaveProperty('threatLevel')
      expect(cryptid).toHaveProperty('origin')
      expect(cryptid).toHaveProperty('description')
      expect(cryptid).toHaveProperty('dangerLevel')
      expect(cryptid).toHaveProperty('isVerified')
    })

    it('should have timestamp properties', () => {
      const cryptid = TestFactory.createCryptid()

      expect(cryptid).toHaveProperty('createdAt')
      expect(cryptid).toHaveProperty('updatedAt')
      expect(cryptid.createdAt).toBeInstanceOf(Date)
      expect(cryptid.updatedAt).toBeInstanceOf(Date)
    })

    it('should have optional sighting years', () => {
      const cryptid = TestFactory.createCryptid()

      if (cryptid.firstSightedYear !== undefined) {
        expect(typeof cryptid.firstSightedYear).toBe('number')
      }

      if (cryptid.lastSightedYear !== undefined) {
        expect(typeof cryptid.lastSightedYear).toBe('number')
      }
    })

    it('should have aliases as array', () => {
      const cryptid = TestFactory.createCryptid()

      expect(Array.isArray(cryptid.aliases)).toBe(true)
    })
  })

  describe('Entity Validation Rules', () => {
    it('should have danger level between 1 and 10', () => {
      const cryptid = TestFactory.createCryptid()

      expect(cryptid.dangerLevel).toBeGreaterThanOrEqual(1)
      expect(cryptid.dangerLevel).toBeLessThanOrEqual(10)
    })

    it('should have positive id', () => {
      const cryptid = TestFactory.createCryptid()

      expect(cryptid.id).toBeGreaterThan(0)
    })

    it('should have valid sighting year range', () => {
      const cryptid = TestFactory.createCryptid({
        firstSightedYear: 1800,
        lastSightedYear: 2020,
      })

      if (cryptid.firstSightedYear && cryptid.lastSightedYear) {
        expect(cryptid.lastSightedYear).toBeGreaterThanOrEqual(cryptid.firstSightedYear)
      }
    })
  })

  describe('Entity Factory Methods', () => {
    it('should create verified cryptid', () => {
      const cryptid = TestFactory.createVerifiedCryptid()

      expect(cryptid.isVerified).toBe(true)
    })

    it('should create unverified cryptid', () => {
      const cryptid = TestFactory.createUnverifiedCryptid()

      expect(cryptid.isVerified).toBe(false)
    })

    it('should create dangerous cryptid', () => {
      const cryptid = TestFactory.createDangerousCryptid()

      expect(cryptid.dangerLevel).toBeGreaterThanOrEqual(8)
    })

    it('should create safe cryptid', () => {
      const cryptid = TestFactory.createSafeCryptid()

      expect(cryptid.dangerLevel).toBeLessThanOrEqual(3)
    })

    it('should create cryptid with specific classification', () => {
      const cryptid = TestFactory.createCryptidWithClassification('aquatic')

      expect(cryptid.classification).toBe('aquatic')
    })

    it('should create cryptid with specific realm', () => {
      const cryptid = TestFactory.createCryptidWithRealm('spectral')

      expect(cryptid.realm).toBe('spectral')
    })

    it('should create multiple cryptids', () => {
      const cryptids = TestFactory.createCryptids(5)

      expect(cryptids).toHaveLength(5)
      expect(cryptids.every(c => c.id > 0)).toBe(true)
    })
  })

  describe('Classification Values', () => {
    it('should support cosmic classification', () => {
      const cryptid = TestFactory.createCryptidWithClassification('cosmic')
      expect(cryptid.classification).toBe('cosmic')
    })

    it('should support terrestrial classification', () => {
      const cryptid = TestFactory.createCryptidWithClassification('terrestrial')
      expect(cryptid.classification).toBe('terrestrial')
    })

    it('should support aquatic classification', () => {
      const cryptid = TestFactory.createCryptidWithClassification('aquatic')
      expect(cryptid.classification).toBe('aquatic')
    })
  })

  describe('Realm Values', () => {
    it('should support physical realm', () => {
      const cryptid = TestFactory.createCryptidWithRealm('physical')
      expect(cryptid.realm).toBe('physical')
    })

    it('should support ethereal realm', () => {
      const cryptid = TestFactory.createCryptidWithRealm('ethereal')
      expect(cryptid.realm).toBe('ethereal')
    })

    it('should support spectral realm', () => {
      const cryptid = TestFactory.createCryptidWithRealm('spectral')
      expect(cryptid.realm).toBe('spectral')
    })
  })
})
