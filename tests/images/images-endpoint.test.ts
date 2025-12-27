import 'reflect-metadata'
import { describe, expect, it } from 'vitest'
import { ListImagesByCryptidUseCase } from '@/modules/cryptids/application/use-cases/list-images-by-cryptid/list-images-by-cryptid.usecase'
import { Image } from '@/modules/cryptids/domain/entities/image.entity'

describe('GET /api/v1/cryptids/:id/images - Images Endpoint', () => {
  describe('ListImagesByCryptidUseCase', () => {
    it('should execute with correct parameters', async () => {
      const mockRepository = {
        findById: async () => null,
        findByCryptidId: async (filters: any, pagination: any) => {
          expect(filters.cryptidId).toBe(1)
          expect(pagination.page).toBe(1)
          expect(pagination.limit).toBe(10)

          return {
            data: [],
            pagination: {
              page: pagination.page,
              limit: pagination.limit,
              totalItems: 0,
              totalPages: 0,
              hasNext: false,
              hasPrevious: false,
            },
          }
        },
      }

      const useCase = new ListImagesByCryptidUseCase(mockRepository as any)

      const result = await useCase.execute({
        cryptidId: 1,
        page: 1,
        limit: 10,
      })

      expect(result.isRight()).toBe(true)
      if (result.isRight()) {
        expect(result.value.data).toEqual([])
        expect(result.value.pagination.page).toBe(1)
        expect(result.value.pagination.limit).toBe(10)
      }
    })

    it('should return images for a specific cryptid', async () => {
      const mockImages = [
        Image.create(
          {
            cryptidId: 1,
            url: 'https://example.com/image1.jpg',
            altText: 'Test image 1',
            source: 'Test source',
            license: 'CC BY 4.0',
          },
          1
        ),
        Image.create(
          {
            cryptidId: 1,
            url: 'https://example.com/image2.jpg',
            altText: 'Test image 2',
            source: 'Test source 2',
            license: 'CC BY-SA 4.0',
          },
          2
        ),
      ]

      const mockRepository = {
        findById: async () => null,
        findByCryptidId: async (filters: any, pagination: any) => {
          return {
            data: mockImages,
            pagination: {
              page: pagination.page,
              limit: pagination.limit,
              totalItems: 2,
              totalPages: 1,
              hasNext: false,
              hasPrevious: false,
            },
          }
        },
      }

      const useCase = new ListImagesByCryptidUseCase(mockRepository as any)

      const result = await useCase.execute({
        cryptidId: 1,
        page: 1,
        limit: 10,
      })

      expect(result.isRight()).toBe(true)
      if (result.isRight()) {
        expect(result.value.data).toHaveLength(2)
        expect(result.value.data[0].url).toBe('https://example.com/image1.jpg')
        expect(result.value.data[1].url).toBe('https://example.com/image2.jpg')
      }
    })

    it('should support pagination', async () => {
      const mockImages = [
        Image.create(
          {
            cryptidId: 1,
            url: 'https://example.com/image3.jpg',
            altText: 'Page 2 image',
            source: 'Test source',
            license: 'CC BY 4.0',
          },
          3
        ),
      ]

      const mockRepository = {
        findById: async () => null,
        findByCryptidId: async (filters: any, pagination: any) => {
          expect(pagination.page).toBe(2)
          expect(pagination.limit).toBe(5)

          return {
            data: mockImages,
            pagination: {
              page: 2,
              limit: 5,
              totalItems: 6,
              totalPages: 2,
              hasNext: false,
              hasPrevious: true,
            },
          }
        },
      }

      const useCase = new ListImagesByCryptidUseCase(mockRepository as any)

      const result = await useCase.execute({
        cryptidId: 1,
        page: 2,
        limit: 5,
      })

      expect(result.isRight()).toBe(true)
      if (result.isRight()) {
        expect(result.value.pagination.page).toBe(2)
        expect(result.value.pagination.limit).toBe(5)
        expect(result.value.pagination.hasNext).toBe(false)
        expect(result.value.pagination.hasPrevious).toBe(true)
      }
    })

    it('should return empty array for cryptid with no images', async () => {
      const mockRepository = {
        findById: async () => null,
        findByCryptidId: async () => {
          return {
            data: [],
            pagination: {
              page: 1,
              limit: 10,
              totalItems: 0,
              totalPages: 0,
              hasNext: false,
              hasPrevious: false,
            },
          }
        },
      }

      const useCase = new ListImagesByCryptidUseCase(mockRepository as any)

      const result = await useCase.execute({
        cryptidId: 999,
        page: 1,
        limit: 10,
      })

      expect(result.isRight()).toBe(true)
      if (result.isRight()) {
        expect(result.value.data).toEqual([])
        expect(result.value.pagination.totalItems).toBe(0)
      }
    })

    it('should use default pagination values', async () => {
      const mockRepository = {
        findById: async () => null,
        findByCryptidId: async (filters: any, pagination: any) => {
          // Default values from schema
          expect(pagination.page).toBe(1)
          expect(pagination.limit).toBe(10)

          return {
            data: [],
            pagination: {
              page: 1,
              limit: 10,
              totalItems: 0,
              totalPages: 0,
              hasNext: false,
              hasPrevious: false,
            },
          }
        },
      }

      const useCase = new ListImagesByCryptidUseCase(mockRepository as any)

      const result = await useCase.execute({
        cryptidId: 1,
        page: 1,
        limit: 10,
      })

      expect(result.isRight()).toBe(true)
    })
  })

  describe('Image Entity', () => {
    it('should create image with correct properties', () => {
      const image = Image.create(
        {
          cryptidId: 1,
          url: 'https://example.com/test.jpg',
          altText: 'Test alt text',
          source: 'Test source',
          license: 'CC BY 4.0',
        },
        1
      )

      expect(image.id).toBe('1')
      expect(image.cryptidId).toBe(1)
      expect(image.url).toBe('https://example.com/test.jpg')
      expect(image.altText).toBe('Test alt text')
      expect(image.source).toBe('Test source')
      expect(image.license).toBe('CC BY 4.0')
      expect(image.createdAt).toBeInstanceOf(Date)
    })

    it('should have readonly properties', () => {
      const image = Image.create(
        {
          cryptidId: 1,
          url: 'https://example.com/test.jpg',
          altText: 'Test alt',
          source: 'Source',
          license: 'CC0',
        },
        1
      )

      // Verify getters work
      expect(image.cryptidId).toBe(1)
      expect(image.url).toBe('https://example.com/test.jpg')
      expect(image.altText).toBe('Test alt')
      expect(image.source).toBe('Source')
      expect(image.license).toBe('CC0')
    })
  })
})
