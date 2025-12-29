# Testing - Cryptids API

## Test Suite Summary

Comprehensive test suite implemented for the Cryptids API with **175 unit tests passing (100% pass rate)**.

## Test Results

```
✓ Domain Tests: 20/20 passing
✓ Pagination Tests: 22/22 passing
✓ Search Rate Limit Tests: 21/21 passing
✓ Error Response Tests: 27/27 passing
✓ Search Tests: 16/16 passing
✓ Filter Tests: 22/22 passing
✓ Rate Limit Tests: 24/24 passing
✓ Contract Tests (API Schemas): 23/23 passing

Total Unit Tests: 175 passing, 0 failing

Integration Tests (require database):
- OpenAPI Compliance Tests
- HTTP Response Structure Tests
- Performance Tests (Response Time)
- Performance Tests (Load Testing)
```

## Test Infrastructure

- **Framework**: Vitest 4.0.16
- **Test Runner**: `pnpm test`
- **Coverage**: Available via `pnpm test:coverage`
- **Watch Mode**: `pnpm test:watch`
- **UI**: `pnpm test:ui`

## Test Categories Implemented

### 1. Domain Entity Tests ✅
- Entity property validation
- Required and optional fields
- Validation rules (danger levels, sighting years)
- Factory methods for test data

### 2. Filter Tests ✅
- Multivalued filters with OR semantics
- Range filters (danger level, sighting years)
- Combined filters with AND semantics across different filter types
- Edge cases (empty results, no matches)

### 3. Search Tests ✅
- Full-text search across multiple fields (name, aliases, description, origin)
- Case-insensitive search
- Search combined with filters
- Empty and edge case handling

### 4. Pagination Tests ✅
- Offset-based pagination
- Page navigation (hasNext, hasPrevious)
- Different page sizes
- Edge cases (empty dataset, beyond total pages)
- Pagination with filters and search
- Consistency (no duplicates across pages)

### 5. Error Handling Tests ✅
- ApiError base class structure
- ValidationError with field details
- ResourceNotFoundError
- RateLimitExceededError
- SearchRateLimitExceededError
- Error code coverage
- Error serialization

### 6. Rate Limiting Tests ✅
- Rate limit configuration (Public, Playground, Internal)
- Endpoint-specific limits
- Search-specific lower limits
- Progressive throttling thresholds
- Retry-After calculation
- Independent scopes

### 7. Contract Tests (API Schemas) ✅ **NEW**
- Zod schema validation for all DTOs
- CryptidSummaryDTO validation
- CryptidDetailDTO validation
- ListCryptidsDTO query parameters
- SearchCryptidsDTO validation
- ImageDTO schemas
- Required vs optional field validation
- Data type enforcement

### 8. OpenAPI Compliance Tests 🔄 (requires database)
- OpenAPI 3.x documentation structure
- Endpoint documentation completeness
- Request parameter documentation
- Response schema documentation
- Error response documentation
- API versioning compliance
- Security definitions for public API

### 9. HTTP Response Structure Tests 🔄 (requires database)
- Success response structure (200 OK)
- Error response structure (400, 404, 500)
- JSON content type enforcement
- Pagination metadata consistency
- Security headers validation
- CORS headers verification
- Cache-Control headers
- UTF-8 encoding
- Response field naming conventions (camelCase)

### 10. Performance Tests 🔄 (requires database)
- **Response Time Tests**: Individual endpoint performance benchmarks
- **Load Testing**: Sustained load, burst handling, concurrent requests
- Mixed workload scenarios
- Complex filter query performance
- Search operation performance
- Error response performance
- Memory efficiency under load
- API stability metrics

## Test Organization by Type

### Unit Tests (No External Dependencies)
These tests run independently without requiring database or external services:
- ✅ Domain Entity Tests
- ✅ Filter Tests
- ✅ Search Tests
- ✅ Pagination Tests
- ✅ Error Handling Tests
- ✅ Rate Limiting Tests
- ✅ Contract Tests (API Schemas)

**Status**: All 175 unit tests passing ✅

### Integration Tests (Require Database Connection)
These tests require a running database with seeded data:
- 🔄 OpenAPI Compliance Tests
- 🔄 HTTP Response Structure Tests
- 🔄 Performance Tests (Response Time & Load Testing)

**Status**: Tests implemented, require database setup to run

## Test Helpers

### TestFactory
Factory for creating test cryptids with various configurations:

```typescript
TestFactory.createCryptid()
TestFactory.createVerifiedCryptid()
TestFactory.createDangerousCryptid()
TestFactory.createCryptidWithClassification('cosmic')
TestFactory.createCryptids(10)
```

### MockCryptidsRepository
In-memory repository for unit testing:

```typescript
const repo = new MockCryptidsRepository();
repo.setData(cryptids);
const result = await repo.list(filters);
```

## Running Tests

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# With UI
pnpm test:ui

# With coverage
pnpm test:coverage
```

## Test Organization

```
tests/
├── contracts/           # API contract & schema validation tests (NEW)
│   ├── api-schemas.test.ts
│   └── openapi-compliance.test.ts
├── domain/              # Entity and domain logic tests
│   └── cryptid-entity.test.ts
├── errors/              # Error handling tests
│   └── error-responses.test.ts
├── filters/             # Filter application tests
│   ├── combined-filters.test.ts
│   └── single-filter.test.ts
├── pagination/          # Pagination logic tests
│   └── pagination.test.ts
├── performance/         # Performance & load tests (NEW)
│   ├── load-testing.test.ts
│   └── response-time.test.ts
├── rate-limit/          # Rate limiting tests
│   ├── rate-limit.test.ts
│   └── search-rate-limit.test.ts
├── responses/           # HTTP response structure tests (NEW)
│   └── http-response-structure.test.ts
├── search/              # Full-text search tests
│   └── search.test.ts
└── helpers/             # Test utilities (factory, mock repo)
    ├── mock-repository.ts
    └── test-factory.ts
```

## Running Different Test Suites

### Run All Unit Tests (Fast)
```bash
pnpm test tests/contracts/api-schemas.test.ts tests/domain/ tests/filters/ tests/search/ tests/pagination/ tests/errors/ tests/rate-limit/
```

### Run Integration Tests (Requires Database)
```bash
# Ensure database is running and seeded
pnpm test tests/contracts/openapi-compliance.test.ts tests/responses/ tests/performance/
```

### Run All Tests
```bash
pnpm test
```

## Next Steps

1. ✅ Contract tests for API schemas - COMPLETED
2. ✅ Performance tests implementation - COMPLETED
3. ✅ HTTP response structure tests - COMPLETED
4. 🔄 Seed database with test data
5. 🔄 Run integration tests with real database
6. 🔄 Set up CI/CD pipeline for automated testing
7. 🔄 Add E2E tests for critical user flows
8. 🔄 Increase coverage to 95%+

## Contributing

When adding new features:

1. Write tests first (TDD)
2. Follow naming convention: `should_[expected_behavior]`
3. Use TestFactory for test data
4. Use MockCryptidsRepository for unit tests
5. Ensure all tests pass before committing
