import { describe, expect, it } from 'vitest'
import { CryptidMapper } from '@/modules/cryptids/application/mappers/cryptid.mapper'
import { ClassificationMapper } from '@/modules/cryptids/application/mappers/classification.mapper'
import type { Cryptid } from '@/modules/cryptids/domain/entities/cryptid.entity'
import type { Classification } from '@/modules/cryptids/domain/entities/classification.entity'

describe('Fields Parameter - Cryptid Mapper', () => {
  const mockCryptidData = {
    cryptid: {
      id: '1',
      name: 'Test Cryptid',
      aliases: ['Alias1', 'Alias2'],
      shortDescription: 'Test description',
      description: 'Full description',
      originSummary: 'Origin summary',
      physicalDescription: 'Physical desc',
      behaviorNotes: 'Behavior notes',
      manifestationConditions: ['Condition 1'],
      status: 'active',
      threatLevel: 'high',
      createdAt: new Date('2024-01-01T10:00:00Z'),
    } as unknown as Cryptid,
    classification: 'Terrestrial',
    hasImages: true,
  }

  describe('toSummary without fields parameter', () => {
    it('should return all public fields by default', () => {
      const result = CryptidMapper.toSummary(mockCryptidData)

      // Should have public fields
      expect(result).toHaveProperty('id')
      expect(result).toHaveProperty('name')
      expect(result).toHaveProperty('aliases')
      expect(result).toHaveProperty('classification')
      expect(result).toHaveProperty()
      expect(result).toHaveProperty('status')
      expect(result).toHaveProperty('threatLevel')
      expect(result).toHaveProperty('hasImages')
      expect(result).toHaveProperty('shortDescription')

      // Should NOT have private fields by default
      expect(result).not.toHaveProperty('createdAt')
    })

    it('should have correct values for public fields', () => {
      const result = CryptidMapper.toSummary(mockCryptidData)

      expect(result.id).toBe('1')
      expect(result.name).toBe('Test Cryptid')
      expect(result.aliases).toEqual(['Alias1', 'Alias2'])
      expect(result.classification).toBe('Terrestrial')
      expect(result.status).toBe('active')
      expect(result.threatLevel).toBe('high')
      expect(result.hasImages).toBe(true)
    })
  })

  describe('toSummary with fields parameter', () => {
    it('should return only createdAt when requested', () => {
      const result = CryptidMapper.toSummary(mockCryptidData, {
        fields: ['createdAt'],
      })

      expect(result).toHaveProperty('createdAt')
      expect(typeof result.createdAt).toBe('string')

      // Should only have the requested fields
      expect(Object.keys(result)).toHaveLength(1)
      expect(result).not.toHaveProperty('id')
      expect(result).not.toHaveProperty('name')
    })

    it('should return specific public fields when requested', () => {
      const result = CryptidMapper.toSummary(mockCryptidData, {
        fields: ['id', 'name', 'status'],
      })

      expect(result).toHaveProperty('id', '1')
      expect(result).toHaveProperty('name', 'Test Cryptid')
      expect(result).toHaveProperty('status', 'active')
      expect(Object.keys(result)).toHaveLength(3)

      expect(result).not.toHaveProperty('classification')
      expect(result).not.toHaveProperty('createdAt')
    })

    it('should return mix of public and private fields when requested', () => {
      const result = CryptidMapper.toSummary(mockCryptidData, {
        fields: ['id', 'name', 'createdAt'],
      })

      expect(result).toHaveProperty('id', '1')
      expect(result).toHaveProperty('name', 'Test Cryptid')
      expect(result).toHaveProperty('createdAt')
      expect(Object.keys(result)).toHaveLength(3)
    })

    it('should return only one field when requested', () => {
      const result = CryptidMapper.toSummary(mockCryptidData, {
        fields: ['name'],
      })

      expect(result).toHaveProperty('name', 'Test Cryptid')
      expect(Object.keys(result)).toHaveLength(1)
    })

    it('should handle empty fields array by returning all public fields', () => {
      const result = CryptidMapper.toSummary(mockCryptidData, {
        fields: [],
      })

      // Should return default public fields when fields array is empty
      expect(result).toHaveProperty('id')
      expect(result).toHaveProperty('name')
      expect(result).not.toHaveProperty('createdAt')
    })

    it('should format createdAt as ISO string', () => {
      const result = CryptidMapper.toSummary(mockCryptidData, {
        fields: ['id', 'createdAt'],
      })

      expect(result.createdAt).toBe('2024-01-01T10:00:00.000Z')
      expect(result.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    })

    it('should handle all public fields selection', () => {
      const result = CryptidMapper.toSummary(mockCryptidData, {
        fields: [
          'id',
          'name',
          'aliases',
          'classification',
          ,
          'status',
          'threatLevel',
          'hasImages',
          'shortDescription',
        ],
      })

      expect(Object.keys(result)).toHaveLength(11)
      expect(result).not.toHaveProperty('createdAt')
    })
  })

  describe('toDetail with fields parameter', () => {
    it('should return all public fields by default', () => {
      const result = CryptidMapper.toDetail(mockCryptidData)

      expect(result).toHaveProperty('id')
      expect(result).toHaveProperty('name')
      expect(result).toHaveProperty('description')
      expect(result).not.toHaveProperty('createdAt')
    })

    it('should return private fields when requested', () => {
      const result = CryptidMapper.toDetail(mockCryptidData, {
        fields: ['id', 'name', 'createdAt'],
      })

      expect(result).toHaveProperty('id')
      expect(result).toHaveProperty('name')
      expect(result).toHaveProperty('createdAt')
      expect(result.createdAt).toBe('2024-01-01T10:00:00.000Z')
    })
  })
})

describe('Fields Parameter - Classification Mapper', () => {
  const mockClassification: Classification = {
    id: '1',
    name: 'Test Classification',
    description: 'Test description',
    categoryType: 'physical',
    createdAt: new Date('2024-01-01T10:00:00Z'),
  } as Classification

  describe('toDTO without fields parameter', () => {
    it('should return all public fields by default', () => {
      const result = ClassificationMapper.toDTO(mockClassification)

      expect(result).toHaveProperty('id')
      expect(result).toHaveProperty('name')
      expect(result).toHaveProperty('description')
      expect(result).toHaveProperty('categoryType')

      expect(result).not.toHaveProperty('createdAt')
    })

    it('should have correct values for public fields', () => {
      const result = ClassificationMapper.toDTO(mockClassification)

      expect(result.id).toBe('1')
      expect(result.name).toBe('Test Classification')
      expect(result.description).toBe('Test description')
      expect(result.categoryType).toBe('physical')
    })
  })

  describe('toDTO with fields parameter', () => {
    it('should return only createdAt when requested', () => {
      const result = ClassificationMapper.toDTO(mockClassification, {
        fields: ['createdAt'],
      })

      expect(result).toHaveProperty('createdAt')
      expect(typeof result.createdAt).toBe('string')
      expect(Object.keys(result)).toHaveLength(1)
    })

    it('should return specific public fields when requested', () => {
      const result = ClassificationMapper.toDTO(mockClassification, {
        fields: ['id', 'name'],
      })

      expect(result).toHaveProperty('id', '1')
      expect(result).toHaveProperty('name', 'Test Classification')
      expect(Object.keys(result)).toHaveLength(2)

      expect(result).not.toHaveProperty('description')
      expect(result).not.toHaveProperty('categoryType')
      expect(result).not.toHaveProperty('createdAt')
    })

    it('should return mix of public and private fields when requested', () => {
      const result = ClassificationMapper.toDTO(mockClassification, {
        fields: ['id', 'name', 'description', 'createdAt'],
      })

      expect(result).toHaveProperty('id')
      expect(result).toHaveProperty('name')
      expect(result).toHaveProperty('description')
      expect(result).toHaveProperty('createdAt')
      expect(Object.keys(result)).toHaveLength(4)
    })

    it('should format createdAt as ISO string', () => {
      const result = ClassificationMapper.toDTO(mockClassification, {
        fields: ['createdAt'],
      })

      expect(result.createdAt).toBe('2024-01-01T10:00:00.000Z')
    })

    it('should handle empty fields array by returning all public fields', () => {
      const result = ClassificationMapper.toDTO(mockClassification, {
        fields: [],
      })

      expect(result).toHaveProperty('id')
      expect(result).toHaveProperty('name')
      expect(result).not.toHaveProperty('createdAt')
    })
  })

  describe('toDTOList with fields parameter', () => {
    const mockClassifications: Classification[] = [
      {
        id: '1',
        name: 'Classification 1',
        description: 'Description 1',
        categoryType: 'physical',
        createdAt: new Date('2024-01-01T10:00:00Z'),
      } as Classification,
      {
        id: '2',
        name: 'Classification 2',
        description: 'Description 2',
        categoryType: 'narrative',
        createdAt: new Date('2024-01-03T10:00:00Z'),
      } as Classification,
    ]

    it('should return all items with public fields by default', () => {
      const result = ClassificationMapper.toDTOList(mockClassifications)

      expect(result).toHaveLength(2)
      result.forEach(item => {
        expect(item).toHaveProperty('id')
        expect(item).toHaveProperty('name')
        expect(item).toHaveProperty('description')
        expect(item).toHaveProperty('categoryType')
        expect(item).not.toHaveProperty('createdAt')
      })
    })

    it('should return all items with requested fields', () => {
      const result = ClassificationMapper.toDTOList(mockClassifications, {
        fields: ['id', 'name', 'createdAt'],
      })

      expect(result).toHaveLength(2)
      result.forEach(item => {
        expect(item).toHaveProperty('id')
        expect(item).toHaveProperty('name')
        expect(item).toHaveProperty('createdAt')
        expect(Object.keys(item)).toHaveLength(3)
      })
    })

    it('should return all items with only private fields when requested', () => {
      const result = ClassificationMapper.toDTOList(mockClassifications, {
        fields: ['createdAt'],
      })

      expect(result).toHaveLength(2)
      result.forEach(item => {
        expect(item).toHaveProperty('createdAt')
        expect(Object.keys(item)).toHaveLength(1)
        expect(item).not.toHaveProperty('id')
        expect(item).not.toHaveProperty('name')
      })
    })
  })
})
