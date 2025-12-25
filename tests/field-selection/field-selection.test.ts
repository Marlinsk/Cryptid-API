import { describe, expect, it } from 'vitest'
import { pickFields } from '@/shared/utils/field-selector'
import { ALLOWED_DETAIL_FIELDS, getInvalidFields, parseFieldsOptions } from '@/modules/cryptids/application/dtos/query-params.dto'

describe('Field Selection', () => {
  describe('pickFields utility', () => {
    it('should return full object when no fields specified', () => {
      const obj = { id: '1', name: 'Test', description: 'Test desc' }
      const result = pickFields(obj, [])

      expect(result).toEqual(obj)
    })

    it('should return only specified fields', () => {
      const obj = {
        id: '1',
        name: 'Test Cryptid',
        description: 'A mysterious creature',
        status: 'reported',
        threatLevel: 'high',
      }

      const result = pickFields(obj, ['id', 'name', 'status'])

      expect(result).toEqual({
        id: '1',
        name: 'Test Cryptid',
        status: 'reported',
      })
      expect(result).not.toHaveProperty('description')
      expect(result).not.toHaveProperty('threatLevel')
    })

    it('should ignore fields that do not exist in object', () => {
      const obj = { id: '1', name: 'Test' }
      const result = pickFields(obj, ['id', 'name', 'nonexistent'])

      expect(result).toEqual({ id: '1', name: 'Test' })
      expect(result).not.toHaveProperty('nonexistent')
    })

    it('should handle empty object', () => {
      const obj = {}
      const result = pickFields(obj, ['id', 'name'])

      expect(result).toEqual({})
    })

    it('should handle single field selection', () => {
      const obj = {
        id: '1',
        name: 'Test',
        description: 'Desc',
      }

      const result = pickFields(obj, ['id'])

      expect(result).toEqual({ id: '1' })
      expect(Object.keys(result)).toHaveLength(1)
    })
  })

  describe('parseFieldsOptions', () => {
    it('should return empty object when no fields provided', () => {
      const result = parseFieldsOptions(undefined)

      expect(result).toEqual({})
    })

    it('should return empty object when empty array provided', () => {
      const result = parseFieldsOptions([])

      expect(result).toEqual({})
    })

    it('should filter only allowed fields', () => {
      const result = parseFieldsOptions(['id', 'name', 'invalidField', 'description'])

      expect(result.fields).toEqual(['id', 'name', 'description'])
      expect(result.fields).not.toContain('invalidField')
    })

    it('should return undefined when all fields are invalid', () => {
      const result = parseFieldsOptions(['invalid1', 'invalid2', 'invalid3'])

      expect(result.fields).toBeUndefined()
    })

    it('should accept all allowed detail fields', () => {
      const allowedFields = [...ALLOWED_DETAIL_FIELDS]
      const result = parseFieldsOptions(allowedFields)

      expect(result.fields).toHaveLength(ALLOWED_DETAIL_FIELDS.length)
      expect(result.fields).toEqual(allowedFields)
    })
  })

  describe('getInvalidFields', () => {
    it('should return empty array when all fields are valid', () => {
      const result = getInvalidFields(['id', 'name', 'description'])

      expect(result).toEqual([])
    })

    it('should return invalid fields', () => {
      const result = getInvalidFields(['id', 'invalidField', 'name', 'anotherInvalid'])

      expect(result).toEqual(['invalidField', 'anotherInvalid'])
      expect(result).not.toContain('id')
      expect(result).not.toContain('name')
    })

    it('should return all fields when all are invalid', () => {
      const invalidFields = ['invalid1', 'invalid2', 'invalid3']
      const result = getInvalidFields(invalidFields)

      expect(result).toEqual(invalidFields)
    })

    it('should handle empty array', () => {
      const result = getInvalidFields([])

      expect(result).toEqual([])
    })
  })

  describe('Field selection integration', () => {
    it('should work with minimal field set', () => {
      const cryptidData = {
        id: '1',
        name: 'Shadow Watcher',
        aliases: ['Watcher', 'Shadow'],
        description: 'A mysterious entity',
        originSummary: 'Unknown origin',
        classification: 'Cosmic',
        realm: 'Extradimensional',
        habitat: 'Void',
        status: 'reported',
        threatLevel: 'high',
        createdAt: '2025-01-12T10:00:00Z',
        updatedAt: '2025-01-12T10:00:00Z',
      }

      const result = pickFields(cryptidData, ['id', 'name', 'status'])

      expect(result).toEqual({
        id: '1',
        name: 'Shadow Watcher',
        status: 'reported',
      })
      expect(Object.keys(result)).toHaveLength(3)
    })

    it('should allow selection of private timestamp fields when explicitly requested', () => {
      const cryptidData = {
        id: '1',
        name: 'Test',
        description: 'Test description',
        createdAt: '2025-01-12T10:00:00Z',
        updatedAt: '2025-01-12T11:00:00Z',
      }

      const result = pickFields(cryptidData, ['id', 'createdAt', 'updatedAt'])

      expect(result).toEqual({
        id: '1',
        createdAt: '2025-01-12T10:00:00Z',
        updatedAt: '2025-01-12T11:00:00Z',
      })
      expect(result).toHaveProperty('createdAt')
      expect(result).toHaveProperty('updatedAt')
      expect(result).not.toHaveProperty('name')
      expect(result).not.toHaveProperty('description')
    })

    it('should work with private metadata fields only', () => {
      const cryptidData = {
        id: '1',
        name: 'Test',
        createdAt: '2025-01-12T10:00:00Z',
        updatedAt: '2025-01-12T11:00:00Z',
      }

      const result = pickFields(cryptidData, ['createdAt', 'updatedAt'])

      expect(result).toEqual({
        createdAt: '2025-01-12T10:00:00Z',
        updatedAt: '2025-01-12T11:00:00Z',
      })
      expect(result).not.toHaveProperty('id')
      expect(result).not.toHaveProperty('name')
    })

    it('should preserve null values in selected fields', () => {
      const cryptidData = {
        id: '1',
        name: 'Test',
        physicalDescription: null,
        behaviorNotes: null,
        firstReportedAt: null,
      }

      const result = pickFields(cryptidData, ['id', 'physicalDescription', 'firstReportedAt'])

      expect(result).toEqual({
        id: '1',
        physicalDescription: null,
        firstReportedAt: null,
      })
      expect(result.physicalDescription).toBeNull()
      expect(result.firstReportedAt).toBeNull()
    })

    it('should handle array fields', () => {
      const cryptidData = {
        id: '1',
        name: 'Test',
        aliases: ['Alias1', 'Alias2'],
      }

      const result = pickFields(cryptidData, ['id', 'aliases'])

      expect(result).toEqual({
        id: '1',
        aliases: ['Alias1', 'Alias2'],
      })
      expect(result.aliases).toHaveLength(2)
    })
  })

  describe('ALLOWED_DETAIL_FIELDS constant', () => {
    it('should contain all expected cryptid detail fields', () => {
      const expectedFields = [
        'id',
        'name',
        'aliases',
        'description',
        'originSummary',
        'physicalDescription',
        'behaviorNotes',
        'classification',
        'realm',
        'habitat',
        'manifestationConditions',
        'firstReportedAt',
        'lastReportedAt',
        'timelineSummary',
        'status',
        'threatLevel',
        'containmentNotes',
        'images',
        'relatedCryptids',
        'createdAt',
        'updatedAt',
      ]

      expect(ALLOWED_DETAIL_FIELDS).toHaveLength(expectedFields.length)
      expectedFields.forEach(field => {
        expect(ALLOWED_DETAIL_FIELDS).toContain(field)
      })
    })

    it('should have consistent field count', () => {
      // Ensure we have 21 fields total
      expect(ALLOWED_DETAIL_FIELDS).toHaveLength(21)
    })

    it('should mark createdAt and updatedAt as private fields', () => {
      expect(ALLOWED_DETAIL_FIELDS).toContain('createdAt')
      expect(ALLOWED_DETAIL_FIELDS).toContain('updatedAt')
    })
  })

  describe('Private fields behavior', () => {
    it('should not include timestamps in default response', () => {
      const fullObject = {
        id: '1',
        name: 'Test',
        description: 'Description',
        status: 'reported',
        createdAt: '2025-01-12T10:00:00Z',
        updatedAt: '2025-01-12T11:00:00Z',
      }

      const publicFields = ['id', 'name', 'description', 'status']
      const result = pickFields(fullObject, publicFields)

      expect(result).not.toHaveProperty('createdAt')
      expect(result).not.toHaveProperty('updatedAt')
      expect(result).toHaveProperty('id')
      expect(result).toHaveProperty('name')
    })

    it('should include timestamps only when explicitly requested', () => {
      const fullObject = {
        id: '1',
        name: 'Test',
        createdAt: '2025-01-12T10:00:00Z',
        updatedAt: '2025-01-12T11:00:00Z',
      }

      const result = pickFields(fullObject, ['id', 'name', 'createdAt', 'updatedAt'])

      expect(result).toHaveProperty('createdAt', '2025-01-12T10:00:00Z')
      expect(result).toHaveProperty('updatedAt', '2025-01-12T11:00:00Z')
    })

    it('should allow requesting only private fields', () => {
      const fullObject = {
        id: '1',
        name: 'Test',
        description: 'Description',
        createdAt: '2025-01-12T10:00:00Z',
        updatedAt: '2025-01-12T11:00:00Z',
      }

      const result = pickFields(fullObject, ['createdAt', 'updatedAt'])

      expect(Object.keys(result)).toHaveLength(2)
      expect(result).toEqual({
        createdAt: '2025-01-12T10:00:00Z',
        updatedAt: '2025-01-12T11:00:00Z',
      })
    })
  })
})
