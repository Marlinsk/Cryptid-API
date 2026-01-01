import type { TestCryptid } from './test-factory'

export interface PaginationMeta {
  page: number
  limit: number
  totalItems: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

export interface PaginatedResult<T> {
  data: T[]
  pagination: PaginationMeta
}

export interface ListFilters {
  classification?: string[]
  behavior?: string[]
  isVerified?: boolean
  minDangerLevel?: number
  maxDangerLevel?: number
  firstSightedAfter?: number
  lastSightedBefore?: number
  page: number
  limit: number
}

export class MockCryptidsRepository {
  private cryptids: TestCryptid[] = []

  constructor(initialData: TestCryptid[] = []) {
    this.cryptids = initialData
  }

  async findById(id: number): Promise<TestCryptid | null> {
    return this.cryptids.find(c => c.id === id) || null
  }

  async list(filters: ListFilters): Promise<PaginatedResult<TestCryptid>> {
    let filtered = [...this.cryptids]

    if (filters.classification && filters.classification.length > 0) {
      filtered = filtered.filter(c => filters.classification!.includes(c.classification))
    }

    }

    if (filters.behavior && filters.behavior.length > 0) {
      filtered = filtered.filter(c => {
        const behaviorValue = c.behavior || c.threatLevel
        return filters.behavior!.includes(behaviorValue)
      })
    }

    if (filters.isVerified !== undefined) {
      filtered = filtered.filter(c => c.isVerified === filters.isVerified)
    }

    if (filters.minDangerLevel !== undefined) {
      filtered = filtered.filter(c => c.dangerLevel >= filters.minDangerLevel!)
    }

    if (filters.maxDangerLevel !== undefined) {
      filtered = filtered.filter(c => c.dangerLevel <= filters.maxDangerLevel!)
    }

    if (filters.firstSightedAfter !== undefined) {
      filtered = filtered.filter(
        c => c.firstSightedYear && c.firstSightedYear >= filters.firstSightedAfter!
      )
    }

    if (filters.lastSightedBefore !== undefined) {
      filtered = filtered.filter(
        c => c.lastSightedYear && c.lastSightedYear <= filters.lastSightedBefore!
      )
    }

    const total = filtered.length
    const page = filters.page || 1
    const limit = filters.limit || 10
    const totalPages = Math.ceil(total / limit)
    const offset = (page - 1) * limit

    const data = filtered.slice(offset, offset + limit)

    return {
      data,
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    }
  }

  async search(query: string, filters: ListFilters): Promise<PaginatedResult<TestCryptid>> {
    let filtered = [...this.cryptids]

    if (query && query.trim()) {
      const lowerQuery = query.toLowerCase().trim()
      filtered = filtered.filter(
        c =>
          c.name.toLowerCase().includes(lowerQuery) ||
          c.aliases.some(alias => alias.toLowerCase().includes(lowerQuery)) ||
          c.description.toLowerCase().includes(lowerQuery) ||
          c.origin.toLowerCase().includes(lowerQuery)
      )
    }

    if (filters.classification && filters.classification.length > 0) {
      filtered = filtered.filter(c => filters.classification!.includes(c.classification))
    }

    }

    if (filters.isVerified !== undefined) {
      filtered = filtered.filter(c => c.isVerified === filters.isVerified)
    }

    if (filters.minDangerLevel !== undefined) {
      filtered = filtered.filter(c => c.dangerLevel >= filters.minDangerLevel!)
    }

    if (filters.maxDangerLevel !== undefined) {
      filtered = filtered.filter(c => c.dangerLevel <= filters.maxDangerLevel!)
    }

    const total = filtered.length
    const page = filters.page || 1
    const limit = filters.limit || 10
    const totalPages = Math.ceil(total / limit)
    const offset = (page - 1) * limit

    const data = filtered.slice(offset, offset + limit)

    return {
      data,
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    }
  }

  setData(data: TestCryptid[]): void {
    this.cryptids = data
  }

  clear(): void {
    this.cryptids = []
  }

  add(cryptid: TestCryptid): void {
    this.cryptids.push(cryptid)
  }

  getAll(): TestCryptid[] {
    return [...this.cryptids]
  }
}
