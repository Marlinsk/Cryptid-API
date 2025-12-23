import { beforeEach, describe, expect, it } from 'vitest'
import { MockCryptidsRepository } from '../helpers/mock-repository'
import { TestFactory } from '../helpers/test-factory'

describe('Search: Full-text Search', () => {
  let repository: MockCryptidsRepository

  beforeEach(() => {
    repository = new MockCryptidsRepository()
  })

  describe('Basic Search', () => {
    it('should_search_by_name', async () => {
      repository.setData([
        TestFactory.createCryptid({ name: 'Shadow Walker' }),
        TestFactory.createCryptid({ name: 'Light Bringer' }),
        TestFactory.createCryptid({ name: 'Night Shadow' }),
      ])

      const result = await repository.search('shadow', { page: 1, limit: 10 })

      expect(result.data).toHaveLength(2)
      expect(result.data.every(c => c.name.toLowerCase().includes('shadow'))).toBe(true)
    })

    it('should_search_by_aliases', async () => {
      repository.setData([
        TestFactory.createCryptid({ name: 'Creature A', aliases: ['Dark One', 'Night Terror'] }),
        TestFactory.createCryptid({ name: 'Creature B', aliases: ['Light Being'] }),
        TestFactory.createCryptid({ name: 'Creature C', aliases: ['Dark Shadow'] }),
      ])

      const result = await repository.search('dark', { page: 1, limit: 10 })

      expect(result.data).toHaveLength(2)
    })

    it('should_search_by_description', async () => {
      repository.setData([
        TestFactory.createCryptid({
          description: 'A mysterious shadow creature that haunts the night',
        }),
        TestFactory.createCryptid({ description: 'A bright being of pure light' }),
        TestFactory.createCryptid({ description: 'An ancient shadow from the depths' }),
      ])

      const result = await repository.search('shadow', { page: 1, limit: 10 })

      expect(result.data).toHaveLength(2)
    })

    it('should_search_by_origin', async () => {
      repository.setData([
        TestFactory.createCryptid({ origin: 'Brazil' }),
        TestFactory.createCryptid({ origin: 'United States' }),
        TestFactory.createCryptid({ origin: 'Brazil, Amazon' }),
      ])

      const result = await repository.search('brazil', { page: 1, limit: 10 })

      expect(result.data).toHaveLength(2)
    })

    it('should_be_case_insensitive', async () => {
      repository.setData([
        TestFactory.createCryptid({ name: 'SHADOW BEAST' }),
        TestFactory.createCryptid({ name: 'shadow creature' }),
        TestFactory.createCryptid({ name: 'ShadowLurker' }),
      ])

      const result = await repository.search('ShAdOw', { page: 1, limit: 10 })

      expect(result.data).toHaveLength(3)
    })

    it('should_search_across_multiple_fields', async () => {
      repository.setData([
        TestFactory.createCryptid({
          name: 'Ancient One',
          aliases: [],
          description: 'A being from the void',
          origin: 'Unknown',
        }),
        TestFactory.createCryptid({
          name: 'Shadow',
          aliases: ['Void Walker'],
          description: 'Dark entity',
          origin: 'Europe',
        }),
        TestFactory.createCryptid({
          name: 'Light Being',
          aliases: [],
          description: 'Bright creature',
          origin: 'The Void',
        }),
      ])

      const result = await repository.search('void', { page: 1, limit: 10 })

      expect(result.data).toHaveLength(3)
    })
  })

  describe('Search with Filters', () => {
    it('should_combine_search_with_classification_filter', async () => {
      repository.setData([
        TestFactory.createCryptid({ name: 'Shadow Being', classification: 'cosmic' }),
        TestFactory.createCryptid({ name: 'Shadow Creature', classification: 'terrestrial' }),
        TestFactory.createCryptid({ name: 'Dark Shadow', classification: 'cosmic' }),
      ])

      const result = await repository.search('shadow', {
        classification: ['cosmic'],
        page: 1,
        limit: 10,
      })

      expect(result.data).toHaveLength(2)
      expect(result.data.every(c => c.classification === 'cosmic')).toBe(true)
      expect(result.data.every(c => c.name.toLowerCase().includes('shadow'))).toBe(true)
    })

    it('should_combine_search_with_realm_filter', async () => {
      repository.setData([
        TestFactory.createCryptid({ name: 'Ethereal Shadow', realm: 'ethereal' }),
        TestFactory.createCryptid({ name: 'Physical Shadow', realm: 'physical' }),
        TestFactory.createCryptid({ name: 'Spectral Shadow', realm: 'spectral' }),
      ])

      const result = await repository.search('shadow', {
        realm: ['ethereal', 'spectral'],
        page: 1,
        limit: 10,
      })

      expect(result.data).toHaveLength(2)
      expect(result.data.every(c => c.realm === 'ethereal' || c.realm === 'spectral')).toBe(true)
    })

    it('should_combine_search_with_verification_filter', async () => {
      repository.setData([
        TestFactory.createCryptid({ name: 'Shadow One', isVerified: true }),
        TestFactory.createCryptid({ name: 'Shadow Two', isVerified: false }),
        TestFactory.createCryptid({ name: 'Shadow Three', isVerified: true }),
      ])

      const result = await repository.search('shadow', {
        isVerified: true,
        page: 1,
        limit: 10,
      })

      expect(result.data).toHaveLength(2)
      expect(result.data.every(c => c.isVerified === true)).toBe(true)
    })

    it('should_combine_search_with_danger_level_filter', async () => {
      repository.setData([
        TestFactory.createCryptid({ name: 'Shadow Beast', dangerLevel: 3 }),
        TestFactory.createCryptid({ name: 'Shadow Terror', dangerLevel: 9 }),
        TestFactory.createCryptid({ name: 'Shadow Fiend', dangerLevel: 10 }),
      ])

      const result = await repository.search('shadow', {
        minDangerLevel: 8,
        page: 1,
        limit: 10,
      })

      expect(result.data).toHaveLength(2)
      expect(result.data.every(c => c.dangerLevel >= 8)).toBe(true)
    })

    it('should_combine_search_with_multiple_filters', async () => {
      repository.setData([
        TestFactory.createCryptid({
          name: 'Cosmic Shadow',
          classification: 'cosmic',
          realm: 'ethereal',
          isVerified: true,
          dangerLevel: 8,
        }),
        TestFactory.createCryptid({
          name: 'Cosmic Shadow Being',
          classification: 'cosmic',
          realm: 'physical',
          isVerified: true,
          dangerLevel: 9,
        }),
        TestFactory.createCryptid({
          name: 'Terrestrial Shadow',
          classification: 'terrestrial',
          realm: 'ethereal',
          isVerified: true,
          dangerLevel: 8,
        }),
      ])

      const result = await repository.search('shadow', {
        classification: ['cosmic'],
        realm: ['ethereal'],
        isVerified: true,
        minDangerLevel: 7,
        page: 1,
        limit: 10,
      })

      expect(result.data).toHaveLength(1)
      expect(result.data[0].name).toBe('Cosmic Shadow')
    })
  })

  describe('Empty Search Results', () => {
    it('should_return_empty_when_no_matches', async () => {
      repository.setData([
        TestFactory.createCryptid({ name: 'Beast' }),
        TestFactory.createCryptid({ name: 'Creature' }),
      ])

      const result = await repository.search('dragon', { page: 1, limit: 10 })

      expect(result.data).toHaveLength(0)
      expect(result.pagination.totalItems).toBe(0)
    })

    it('should_return_empty_when_search_with_filters_no_match', async () => {
      repository.setData([
        TestFactory.createCryptid({ name: 'Shadow', classification: 'terrestrial' }),
      ])

      const result = await repository.search('shadow', {
        classification: ['cosmic'],
        page: 1,
        limit: 10,
      })

      expect(result.data).toHaveLength(0)
    })
  })

  describe('Search Edge Cases', () => {
    it('should_handle_empty_query', async () => {
      repository.setData([TestFactory.createCryptid(), TestFactory.createCryptid()])

      const result = await repository.search('', { page: 1, limit: 10 })

      expect(result.data).toHaveLength(2)
    })

    it('should_handle_whitespace_query', async () => {
      repository.setData([TestFactory.createCryptid(), TestFactory.createCryptid()])

      const result = await repository.search('   ', { page: 1, limit: 10 })

      expect(result.data).toHaveLength(2)
    })

    it('should_handle_special_characters', async () => {
      repository.setData([
        TestFactory.createCryptid({ name: 'Shadow-Walker' }),
        TestFactory.createCryptid({ name: 'Night Shadow' }),
      ])

      const result = await repository.search('shadow-', { page: 1, limit: 10 })

      expect(result.data.length).toBeGreaterThanOrEqual(1)
    })
  })
})
