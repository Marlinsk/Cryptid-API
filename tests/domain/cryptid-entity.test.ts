import { describe, expect, it } from 'vitest'
import { TestFactory } from '../helpers/test-factory'

describe('Domain: Cryptid Entity', () => {
  describe('Entity Properties', () => {
    it('should_have_required_properties', () => {
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

    it('should_have_timestamp_properties', () => {
      const cryptid = TestFactory.createCryptid()

      expect(cryptid).toHaveProperty('createdAt')
      expect(cryptid).toHaveProperty('updatedAt')
      expect(cryptid.createdAt).toBeInstanceOf(Date)
      expect(cryptid.updatedAt).toBeInstanceOf(Date)
    })

    it('should_have_optional_sighting_years', () => {
      const cryptid = TestFactory.createCryptid()

      if (cryptid.firstSightedYear !== undefined) {
        expect(typeof cryptid.firstSightedYear).toBe('number')
      }

      if (cryptid.lastSightedYear !== undefined) {
        expect(typeof cryptid.lastSightedYear).toBe('number')
      }
    })

    it('should_have_aliases_as_array', () => {
      const cryptid = TestFactory.createCryptid()

      expect(Array.isArray(cryptid.aliases)).toBe(true)
    })
  })

  describe('Entity Validation Rules', () => {
    it('should_have_danger_level_between_1_and_10', () => {
      const cryptid = TestFactory.createCryptid()

      expect(cryptid.dangerLevel).toBeGreaterThanOrEqual(1)
      expect(cryptid.dangerLevel).toBeLessThanOrEqual(10)
    })

    it('should_have_positive_id', () => {
      const cryptid = TestFactory.createCryptid()

      expect(cryptid.id).toBeGreaterThan(0)
    })

    it('should_have_valid_sighting_year_range', () => {
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
    it('should_create_verified_cryptid', () => {
      const cryptid = TestFactory.createVerifiedCryptid()

      expect(cryptid.isVerified).toBe(true)
    })

    it('should_create_unverified_cryptid', () => {
      const cryptid = TestFactory.createUnverifiedCryptid()

      expect(cryptid.isVerified).toBe(false)
    })

    it('should_create_dangerous_cryptid', () => {
      const cryptid = TestFactory.createDangerousCryptid()

      expect(cryptid.dangerLevel).toBeGreaterThanOrEqual(8)
    })

    it('should_create_safe_cryptid', () => {
      const cryptid = TestFactory.createSafeCryptid()

      expect(cryptid.dangerLevel).toBeLessThanOrEqual(3)
    })

    it('should_create_cryptid_with_specific_classification', () => {
      const cryptid = TestFactory.createCryptidWithClassification('aquatic')

      expect(cryptid.classification).toBe('aquatic')
    })

    it('should_create_cryptid_with_specific_realm', () => {
      const cryptid = TestFactory.createCryptidWithRealm('spectral')

      expect(cryptid.realm).toBe('spectral')
    })

    it('should_create_multiple_cryptids', () => {
      const cryptids = TestFactory.createCryptids(5)

      expect(cryptids).toHaveLength(5)
      expect(cryptids.every(c => c.id > 0)).toBe(true)
    })
  })

  describe('Classification Values', () => {
    it('should_support_cosmic_classification', () => {
      const cryptid = TestFactory.createCryptidWithClassification('cosmic')
      expect(cryptid.classification).toBe('cosmic')
    })

    it('should_support_terrestrial_classification', () => {
      const cryptid = TestFactory.createCryptidWithClassification('terrestrial')
      expect(cryptid.classification).toBe('terrestrial')
    })

    it('should_support_aquatic_classification', () => {
      const cryptid = TestFactory.createCryptidWithClassification('aquatic')
      expect(cryptid.classification).toBe('aquatic')
    })
  })

  describe('Realm Values', () => {
    it('should_support_physical_realm', () => {
      const cryptid = TestFactory.createCryptidWithRealm('physical')
      expect(cryptid.realm).toBe('physical')
    })

    it('should_support_ethereal_realm', () => {
      const cryptid = TestFactory.createCryptidWithRealm('ethereal')
      expect(cryptid.realm).toBe('ethereal')
    })

    it('should_support_spectral_realm', () => {
      const cryptid = TestFactory.createCryptidWithRealm('spectral')
      expect(cryptid.realm).toBe('spectral')
    })
  })
})
