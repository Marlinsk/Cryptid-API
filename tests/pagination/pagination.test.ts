import { beforeEach, describe, expect, it } from 'vitest'
import { MockCryptidsRepository } from '../helpers/mock-repository'
import { TestFactory } from '../helpers/test-factory'

describe('Pagination: Offset-based Pagination', () => {
  let repository: MockCryptidsRepository

  beforeEach(() => {
    repository = new MockCryptidsRepository()
  })

  describe('Basic Pagination', () => {
    it('should paginate results with default limit', async () => {
      const cryptids = TestFactory.createCryptids(25)
      repository.setData(cryptids)

      const result = await repository.list({ page: 1, limit: 10 })

      expect(result.data).toHaveLength(10)
      expect(result.pagination.page).toBe(1)
      expect(result.pagination.limit).toBe(10)
      expect(result.pagination.totalItems).toBe(25)
      expect(result.pagination.totalPages).toBe(3)
    })

    it('should return correct page metadata', async () => {
      const cryptids = TestFactory.createCryptids(50)
      repository.setData(cryptids)

      const result = await repository.list({ page: 2, limit: 15 })

      expect(result.pagination.page).toBe(2)
      expect(result.pagination.limit).toBe(15)
      expect(result.pagination.totalItems).toBe(50)
      expect(result.pagination.totalPages).toBe(4)
    })

    it('should calculate total pages correctly', async () => {
      const testCases = [
        { total: 10, limit: 5, expectedPages: 2 },
        { total: 11, limit: 5, expectedPages: 3 },
        { total: 15, limit: 5, expectedPages: 3 },
        { total: 7, limit: 10, expectedPages: 1 },
        { total: 100, limit: 20, expectedPages: 5 },
      ]

      for (const { total, limit, expectedPages } of testCases) {
        repository.setData(TestFactory.createCryptids(total))
        const result = await repository.list({ page: 1, limit })

        expect(result.pagination.totalPages).toBe(expectedPages)
      }
    })
  })

  describe('Page Navigation', () => {
    beforeEach(() => {
      repository.setData(TestFactory.createCryptids(50))
    })

    it('should have next on first page', async () => {
      const result = await repository.list({ page: 1, limit: 10 })

      expect(result.pagination.hasNext).toBe(true)
      expect(result.pagination.hasPrevious).toBe(false)
    })

    it('should have previous on second page', async () => {
      const result = await repository.list({ page: 2, limit: 10 })

      expect(result.pagination.hasNext).toBe(true)
      expect(result.pagination.hasPrevious).toBe(true)
    })

    it('should not have next on last page', async () => {
      const result = await repository.list({ page: 5, limit: 10 })

      expect(result.pagination.hasNext).toBe(false)
      expect(result.pagination.hasPrevious).toBe(true)
    })

    it('should have correct navigation on middle page', async () => {
      const result = await repository.list({ page: 3, limit: 10 })

      expect(result.pagination.hasNext).toBe(true)
      expect(result.pagination.hasPrevious).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty dataset', async () => {
      repository.setData([])

      const result = await repository.list({ page: 1, limit: 10 })

      expect(result.data).toHaveLength(0)
      expect(result.pagination.totalItems).toBe(0)
      expect(result.pagination.totalPages).toBe(0)
      expect(result.pagination.hasNext).toBe(false)
      expect(result.pagination.hasPrevious).toBe(false)
    })

    it('should handle single item', async () => {
      repository.setData(TestFactory.createCryptids(1))

      const result = await repository.list({ page: 1, limit: 10 })

      expect(result.data).toHaveLength(1)
      expect(result.pagination.totalItems).toBe(1)
      expect(result.pagination.totalPages).toBe(1)
      expect(result.pagination.hasNext).toBe(false)
      expect(result.pagination.hasPrevious).toBe(false)
    })

    it('should handle page beyond total pages', async () => {
      repository.setData(TestFactory.createCryptids(10))

      const result = await repository.list({ page: 100, limit: 10 })

      expect(result.data).toHaveLength(0)
      expect(result.pagination.totalItems).toBe(10)
      expect(result.pagination.totalPages).toBe(1)
    })

    it('should handle exact page boundary', async () => {
      repository.setData(TestFactory.createCryptids(20))

      const result = await repository.list({ page: 2, limit: 10 })

      expect(result.data).toHaveLength(10)
      expect(result.pagination.hasNext).toBe(false)
      expect(result.pagination.hasPrevious).toBe(true)
    })

    it('should handle partial last page', async () => {
      repository.setData(TestFactory.createCryptids(23))

      const result = await repository.list({ page: 3, limit: 10 })

      expect(result.data).toHaveLength(3)
      expect(result.pagination.hasNext).toBe(false)
      expect(result.pagination.hasPrevious).toBe(true)
    })
  })

  describe('Different Page Sizes', () => {
    beforeEach(() => {
      repository.setData(TestFactory.createCryptids(100))
    })

    it('should handle small page size', async () => {
      const result = await repository.list({ page: 1, limit: 5 })

      expect(result.data).toHaveLength(5)
      expect(result.pagination.totalPages).toBe(20)
    })

    it('should handle medium page size', async () => {
      const result = await repository.list({ page: 1, limit: 25 })

      expect(result.data).toHaveLength(25)
      expect(result.pagination.totalPages).toBe(4)
    })

    it('should handle large page size', async () => {
      const result = await repository.list({ page: 1, limit: 100 })

      expect(result.data).toHaveLength(100)
      expect(result.pagination.totalPages).toBe(1)
    })

    it('should handle page size larger than dataset', async () => {
      repository.setData(TestFactory.createCryptids(10))

      const result = await repository.list({ page: 1, limit: 50 })

      expect(result.data).toHaveLength(10)
      expect(result.pagination.totalPages).toBe(1)
      expect(result.pagination.hasNext).toBe(false)
    })
  })

  describe('Pagination with Filters', () => {
    it('should paginate filtered results', async () => {
      const cryptids = [
        ...TestFactory.createCryptids(30, { isVerified: true }),
        ...TestFactory.createCryptids(20, { isVerified: false }),
      ]
      repository.setData(cryptids)

      const result = await repository.list({
        isVerified: true,
        page: 1,
        limit: 10,
      })

      expect(result.data).toHaveLength(10)
      expect(result.pagination.totalItems).toBe(30)
      expect(result.pagination.totalPages).toBe(3)
    })

    it('should navigate through filtered results', async () => {
      const cryptids = [
        ...TestFactory.createCryptids(15, { isVerified: true }),
        ...TestFactory.createCryptids(35, { isVerified: false }),
      ]
      repository.setData(cryptids)

      const page1 = await repository.list({
        isVerified: true,
        page: 1,
        limit: 10,
      })

      const page2 = await repository.list({
        isVerified: true,
        page: 2,
        limit: 10,
      })

      expect(page1.data).toHaveLength(10)
      expect(page1.pagination.hasNext).toBe(true)

      expect(page2.data).toHaveLength(5)
      expect(page2.pagination.hasNext).toBe(false)
      expect(page2.pagination.hasPrevious).toBe(true)
    })
  })

  describe('Pagination with Search', () => {
    it('should paginate search results', async () => {
      const cryptids = [
        ...TestFactory.createCryptids(25, { name: 'Shadow Beast' }),
        ...TestFactory.createCryptids(25, { name: 'Light Being' }),
      ]
      repository.setData(cryptids)

      const result = await repository.search('shadow', { page: 1, limit: 10 })

      expect(result.data).toHaveLength(10)
      expect(result.pagination.totalItems).toBe(25)
      expect(result.pagination.totalPages).toBe(3)
    })

    it('should navigate through search results', async () => {
      const cryptids = TestFactory.createCryptids(30, { name: 'Shadow Creature' })
      repository.setData(cryptids)

      const page1 = await repository.search('shadow', { page: 1, limit: 10 })
      const page2 = await repository.search('shadow', { page: 2, limit: 10 })
      const page3 = await repository.search('shadow', { page: 3, limit: 10 })

      expect(page1.pagination.hasNext).toBe(true)
      expect(page1.pagination.hasPrevious).toBe(false)

      expect(page2.pagination.hasNext).toBe(true)
      expect(page2.pagination.hasPrevious).toBe(true)

      expect(page3.pagination.hasNext).toBe(false)
      expect(page3.pagination.hasPrevious).toBe(true)
    })
  })

  describe('Consistency', () => {
    it('should not duplicate items across pages', async () => {
      repository.setData(TestFactory.createCryptids(30))

      const page1 = await repository.list({ page: 1, limit: 10 })
      const page2 = await repository.list({ page: 2, limit: 10 })
      const page3 = await repository.list({ page: 3, limit: 10 })

      const allIds = [
        ...page1.data.map(c => c.id),
        ...page2.data.map(c => c.id),
        ...page3.data.map(c => c.id),
      ]

      const uniqueIds = new Set(allIds)
      expect(uniqueIds.size).toBe(allIds.length)
    })

    it('should return all items when traversing all pages', async () => {
      const cryptids = TestFactory.createCryptids(25)
      repository.setData(cryptids)

      const allResults = []
      for (let page = 1; page <= 3; page++) {
        const result = await repository.list({ page, limit: 10 })
        allResults.push(...result.data)
      }

      expect(allResults).toHaveLength(25)
    })
  })
})
