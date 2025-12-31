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
        status: 'Unconfirmed',
        threatLevel: 'Low',
        sightingsCount: 42,
        hasImages: true,
        shortDescription: 'A large, hairy humanoid creature',
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

      const validData = {
        id: '123',
        name: 'Bigfoot',
        aliases: [],
        classification: 'Terrestrial',
        status: 'Unconfirmed',
        threatLevel: 'Low',
        sightingsCount: 0,
        hasImages: false,
        shortDescription: 'A large, hairy humanoid creature',
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
        status: 'Unconfirmed',
        threatLevel: 'Low',
        sightingsCount: 42,
        hasImages: true,
        shortDescription: 'A large, hairy humanoid creature',
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
        manifestationConditions: 'Night time',
        status: 'Unconfirmed',
        threatLevel: 'Low',
        images: [],
        relatedCryptids: [],
        createdAt: '2024-01-01T00:00:00Z',
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
        status: 'Unconfirmed',
        threatLevel: 'Low',
        createdAt: '2024-01-01T00:00:00Z',
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
        status: 'Unconfirmed',
        threatLevel: 'Low',
        createdAt: '2024-01-01T00:00:00Z',
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
        classification: '2,3',
        status: 'Confirmed,Unconfirmed',
        threatLevel: 'High,Medium',
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
      }

      const result = imageSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject image data with missing required fields', () => {
      const invalidData = {
        id: '1',
        url: 'https://example.com/image.jpg',
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
        page: 1,
        limit: 20,
      }

      const result = searchCryptidsSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })
})
