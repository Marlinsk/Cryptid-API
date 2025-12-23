import { describe, expect, it } from 'vitest'
import { cryptidSummarySchema } from '@modules/cryptids/application/dtos/cryptid-summary.dto'
import { cryptidDetailSchema } from '@modules/cryptids/application/dtos/cryptid-detail.dto'
import { listCryptidsSchema } from '@modules/cryptids/application/use-cases/list-cryptids/list-cryptids.dto'
import { searchCryptidsSchema } from '@modules/cryptids/application/use-cases/search-cryptids/search-cryptids.dto'
import { imageSchema } from '@modules/cryptids/application/dtos/image.dto'

describe('API Contract Tests - Schema Validation', () => {
  describe('CryptidSummaryDTO Schema', () => {
    it('should validate valid cryptid summary', () => {
      const validData = {
        id: '123',
        name: 'Bigfoot',
        aliases: ['Sasquatch', 'Yeti'],
        classification: 'Terrestrial',
        realm: 'Physical',
        habitat: 'Forest',
        status: 'Unconfirmed',
        threatLevel: 'Low',
        sightingsCount: 42,
        hasImages: true,
        shortDescription: 'A large, hairy humanoid creature',
        lastReportedAt: '2024-01-15T10:30:00Z',
      }

      const result = cryptidSummarySchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject cryptid summary with missing required fields', () => {
      const invalidData = {
        id: '123',
        name: 'Bigfoot',
        // Missing required fields
      }

      const result = cryptidSummarySchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should accept null lastReportedAt', () => {
      const validData = {
        id: '123',
        name: 'Bigfoot',
        aliases: [],
        classification: 'Terrestrial',
        realm: 'Physical',
        habitat: 'Forest',
        status: 'Unconfirmed',
        threatLevel: 'Low',
        sightingsCount: 0,
        hasImages: false,
        shortDescription: 'A large, hairy humanoid creature',
        lastReportedAt: null,
      }

      const result = cryptidSummarySchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate aliases as array of strings', () => {
      const invalidData = {
        id: '123',
        name: 'Bigfoot',
        aliases: 'Sasquatch', // Should be array
        classification: 'Terrestrial',
        realm: 'Physical',
        habitat: 'Forest',
        status: 'Unconfirmed',
        threatLevel: 'Low',
        sightingsCount: 42,
        hasImages: true,
        shortDescription: 'A large, hairy humanoid creature',
        lastReportedAt: '2024-01-15T10:30:00Z',
      }

      const result = cryptidSummarySchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('CryptidDetailDTO Schema', () => {
    it('should validate complete cryptid detail', () => {
      const validData = {
        id: '123',
        name: 'Bigfoot',
        aliases: ['Sasquatch'],
        description: 'Detailed description',
        originSummary: 'First sighted in...',
        physicalDescription: 'Tall and hairy',
        behaviorNotes: 'Avoids humans',
        classification: 'Terrestrial',
        subClassifications: ['Primate-like'],
        realm: 'Physical',
        habitat: 'Forest',
        manifestationConditions: 'Night time',
        firstReportedAt: '1950-01-01T00:00:00Z',
        lastReportedAt: '2024-01-15T10:30:00Z',
        timelineSummary: 'Sighted over 70 years',
        status: 'Unconfirmed',
        threatLevel: 'Low',
        containmentNotes: 'No containment needed',
        images: [],
        relatedCryptids: [],
        sources: ['Source 1', 'Source 2'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      }

      const result = cryptidDetailSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate cryptid detail with minimal required fields', () => {
      const validData = {
        id: '123',
        name: 'Bigfoot',
        aliases: [],
        description: 'Detailed description',
        originSummary: 'First sighted in...',
        classification: 'Terrestrial',
        realm: 'Physical',
        habitat: 'Forest',
        firstReportedAt: null,
        lastReportedAt: null,
        status: 'Unconfirmed',
        threatLevel: 'Low',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      }

      const result = cryptidDetailSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should allow optional fields to be undefined', () => {
      const validData = {
        id: '123',
        name: 'Bigfoot',
        aliases: [],
        description: 'Detailed description',
        originSummary: 'First sighted in...',
        classification: 'Terrestrial',
        realm: 'Physical',
        habitat: 'Forest',
        firstReportedAt: null,
        lastReportedAt: null,
        status: 'Unconfirmed',
        threatLevel: 'Low',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
        // Optional fields not provided
      }

      const result = cryptidDetailSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe('ListCryptidsDTO Schema', () => {
    it('should validate valid list query parameters', () => {
      const validData = {
        page: 1,
        limit: 20,
        sort: 'name',
        order: 'asc',
      }

      const result = listCryptidsSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate query with single-value filters', () => {
      const validData = {
        habitat: 1,
        realm: 2,
        classification: 3,
        status: 'Confirmed',
        threatLevel: 'High',
        page: 1,
        limit: 20,
      }

      const result = listCryptidsSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate query with multi-value filters', () => {
      const validData = {
        habitat: '1,2,3',
        realm: '1,2',
        classification: '2,3',
        status: 'Confirmed,Unconfirmed',
        threatLevel: 'High,Medium',
        page: 1,
        limit: 20,
      }

      const result = listCryptidsSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate query with range filters', () => {
      const validData = {
        threatLevelMin: 3,
        threatLevelMax: 8,
        page: 1,
        limit: 20,
      }

      const result = listCryptidsSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate query with boolean filters', () => {
      const validData = {
        hasImages: 'true',
        page: 1,
        limit: 20,
      }

      const result = listCryptidsSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid threat level range', () => {
      const invalidData = {
        threatLevelMin: -1, // Invalid: below 0
        page: 1,
        limit: 20,
      }

      const result = listCryptidsSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject invalid threat level range max', () => {
      const invalidData = {
        threatLevelMax: 11, // Invalid: above 10
        page: 1,
        limit: 20,
      }

      const result = listCryptidsSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should validate search parameter', () => {
      const validData = {
        search: 'bigfoot',
        page: 1,
        limit: 20,
      }

      const result = listCryptidsSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject empty search string', () => {
      const invalidData = {
        search: '', // Invalid: must have min length 1
        page: 1,
        limit: 20,
      }

      const result = listCryptidsSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should default order to asc', () => {
      const validData = {
        page: 1,
        limit: 20,
        sort: 'name',
      }

      const result = listCryptidsSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.order).toBe('asc')
      }
    })
  })

  describe('ImageDTO Schema', () => {
    it('should validate valid image data', () => {
      const validData = {
        id: '1',
        url: 'https://example.com/image.jpg',
        altText: 'A photo of Bigfoot',
        source: 'Photographer Name',
        license: 'CC BY 4.0',
      }

      const result = imageSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject image data with missing required fields', () => {
      const invalidData = {
        id: '1',
        url: 'https://example.com/image.jpg',
        // Missing altText, source, license
      }

      const result = imageSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('SearchCryptidsDTO Schema', () => {
    it('should validate valid search query', () => {
      const validData = {
        query: 'bigfoot',
        page: 1,
        limit: 20,
      }

      const result = searchCryptidsSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject search query with empty string', () => {
      const invalidData = {
        query: '', // Invalid: min length is 1
        page: 1,
        limit: 20,
      }

      const result = searchCryptidsSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should validate search with filters', () => {
      const validData = {
        query: 'creature',
        classification: 1,
        realm: 2,
        page: 1,
        limit: 20,
      }

      const result = searchCryptidsSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })
})
