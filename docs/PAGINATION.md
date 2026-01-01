# Pagination - Cryptids API

This document describes the implementation of the **standardized Pagination Shape** of the Cryptids API.

---

## Pagination Principles

The API pagination follows these fundamental principles:

* **Explicit** → Nothing implicit or magical, all values are clearly defined
* **Stable** → Same query returns predictable structure
* **Scalable** → Suitable for large data volumes
* **Composable** → Works together with filters, sorting, and search

**IMPORTANT**: Pagination **never changes the shape of items**, only the envelope.

---

## Pagination Type

### Offset + limit based pagination

This approach was chosen for:

* Clarity for developers
* Ease of debugging
* Compatibility with tables, grids, and playgrounds
* Predictable behavior

> **Note**: Cursor pagination may be added in the future as an alternative without breaking the current contract.

---

## Pagination Parameters (Request)

### Query Parameters

| Parameter | Type   | Required | Default | Maximum | Description                  |
| --------- | ------ | -------- | ------- | ------- | ---------------------------- |
| `page`    | number | No       | 1       | -       | Current page (starts at 1)   |
| `limit`   | number | No       | 20      | 100     | Items per page               |

### Validation Rules

* `page` must be ≥ 1
* `limit` must be between 1 and 100
* Invalid values are normalized to defaults
* Validation happens via Zod schemas

### Request Example

```bash
GET /cryptids?page=2&limit=50
GET /cryptids?classification=1&page=3&limit=20
GET /cryptids/search?query=watcher&page=1&limit=10
```

---

## Pagination Envelope (Response)

All paginated endpoints return a **standardized envelope**.

### JSON Structure

```json
{
  "data": [
    /* array of items (Summary shape) */
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 542,
    "totalPages": 28,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

---

## `pagination` Object Fields

| Field         | Type    | Description                                       |
| ------------- | ------- | ------------------------------------------------- |
| `page`        | number  | Current page                                      |
| `limit`       | number  | Items per page                                    |
| `totalItems`  | number  | Total available records (after filters)          |
| `totalPages`  | number  | Total pages = ceil(totalItems / limit)           |
| `hasNext`     | boolean | Next page exists = page < totalPages              |
| `hasPrevious` | boolean | Previous page exists = page > 1                   |

---

## Consistency Rules

These rules are **always** respected:

* `data.length ≤ limit`
* `totalPages = ceil(totalItems / limit)`
* `hasNext = page < totalPages`
* `hasPrevious = page > 1`

**No calculation is left implicit for the consumer** - all necessary values are present.

---

## Integration with Filters

Pagination always reflects the **filtered set**, never the total records in the database.

### Example

```bash
GET /cryptids?classification=cosmic&limit=10&page=2
```

**Behavior**:
1. Applies the `classification=cosmic` filter
2. Counts the total of cosmic cryptids → `totalItems`
3. Returns page 2 of the filtered results

The `totalItems` represents **only cosmic cryptids**, not all cryptids.

---

## Integration with Search

Search works the same way as filters.

### Example

```bash
GET /cryptids/search?query=shadow&page=1&limit=20
```

**Behavior**:
1. Searches for "shadow" in name, description, originSummary
2. Counts the total results found → `totalItems`
3. Returns the first page of results

---

## Sorting and Pagination

**Important**: Sorting **always happens before** pagination.

### Sorting Parameters

| Parameter | Type   | Values                                                           |
| --------- | ------ | ---------------------------------------------------------------- |
| `sortBy`  | string | `id`, `name`, `status`, `threatLevel`, `createdAt` |
| `order`   | string | `asc`, `desc`                                                    |

### Example

```bash
GET /api/v1/cryptids?sortBy=name&order=desc&page=1&limit=20
```

**Flow**:
1. Applies filters (if any)
2. **Sorts** by specified field and order
3. **Paginates** the sorted results

---

## Frontend Guidelines

### For Numeric Pagination

```typescript
const { pagination } = response;

// Use totalPages to render page buttons
for (let i = 1; i <= pagination.totalPages; i++) {
  renderPageButton(i);
}

// Navigation
const nextPage = pagination.hasNext ? pagination.page + 1 : null;
const prevPage = pagination.hasPrevious ? pagination.page - 1 : null;
```

### For Infinite Scroll

```typescript
const { data, pagination } = response;

// Add items to state
setItems([...items, ...data]);

// Check if can load more
if (pagination.hasNext) {
  loadNextPage(pagination.page + 1);
}
```

### Important Guidelines

* **Never** infer pagination from the `data` array size
* **Always** use the `hasNext` and `hasPrevious` fields for navigation
* **Always** show `totalItems` to give context to the user
* Implement loading states during page changes

---

## Playground Guidelines

To facilitate testing and exploration:

* Provide sliders or inputs for `page` and `limit`
* Display `totalItems` prominently
* Show payload preview for different configurations
* Allow testing with large `totalItems` values (simulated)

---

## Error Handling

### Validation Errors

**Case**: `page < 1`
```json
{
  "error": "Validation failed",
  "details": {
    "page": "Page must be at least 1"
  }
}
```

**Case**: `limit > 100`
```json
{
  "error": "Validation failed",
  "details": {
    "limit": "Limit cannot exceed 100"
  }
}
```

### Out of Bounds Page

**Case**: `page > totalPages`

**Option 1** (Implemented): Returns empty array with valid pagination
```json
{
  "data": [],
  "pagination": {
    "page": 99,
    "limit": 20,
    "totalItems": 50,
    "totalPages": 3,
    "hasNext": false,
    "hasPrevious": true
  }
}
```

**Option 2** (Alternative): Returns 404 error
```json
{
  "error": "Page not found",
  "message": "Requested page 99 exceeds total pages 3"
}
```

---

## Future Extensibility

The current structure allows adding without breaking existing clients:

### Cursor Pagination

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 542,
    "totalPages": 28,
    "hasNext": true,
    "hasPrevious": false,
    "cursor": "eyJpZCI6MTIzfQ==",      // New
    "nextCursor": "eyJpZCI6MTQzfQ==",  // New
    "prevCursor": null                  // New
  }
}
```

### HATEOAS Links

```json
{
  "data": [...],
  "pagination": {...},
  "links": {                            // New
    "self": "/cryptids?page=2",
    "first": "/cryptids?page=1",
    "prev": "/cryptids?page=1",
    "next": "/cryptids?page=3",
    "last": "/cryptids?page=28"
  }
}
```

---

## Shape Benefits

* ✅ Predictable and consistent contract
* ✅ Easy to cache (especially Summary shapes)
* ✅ Intuitive playground
* ✅ Clean integration with tables and grids
* ✅ Compatible with pure REST and GraphQL-like UX
* ✅ Optimized performance (only necessary data)
* ✅ Extensible without breaking changes

---

## Complete Examples

### Basic Listing

**Request**:
```bash
GET /cryptids?page=1&limit=10
```

**Response**:
```json
{
  "data": [
    {
      "id": "1",
      "name": "The Nameless Watcher",
      "aliases": ["Watcher in the Void"],
      "classification": "Cosmic Entity",
      "status": "Reported",
      "threatLevel": "High",
      "sightingsCount": 12,
      "hasImages": true,
      "shortDescription": "A silent presence observed at the edge of reality.",
    }
    // ... 9 more items
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 156,
    "totalPages": 16,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

### Listing with Filters

**Request**:
```bash
GET /api/v1/cryptids?classification=1&hasImages=true&page=2&limit=20
```

**Response**:
```json
{
  "data": [/* 20 items */],
  "pagination": {
    "page": 2,
    "limit": 20,
    "totalPages": 3,
    "hasNext": true,
    "hasPrevious": true
  }
}
```

### Search with Pagination

**Request**:
```bash
GET /cryptids/search?query=shadow&page=1&limit=10
```

**Response**:
```json
{
  "data": [/* search results */],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 8,  // Total cryptids containing "shadow"
    "totalPages": 1,
    "hasNext": false,
    "hasPrevious": false
  }
}
```

### Empty Page (end of results)

**Request**:
```bash
GET /cryptids?page=5&limit=50
```

**Response**:
```json
{
  "data": [],
  "pagination": {
    "page": 5,
    "limit": 50,
    "totalItems": 150,
    "totalPages": 3,
    "hasNext": false,
    "hasPrevious": true
  }
}
```

---

## Technical Implementation

### Constants

```typescript
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
} as const;
```

### Validation (Zod)

```typescript
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
```

### Calculation Helper

```typescript
export function calculatePaginationMetadata(params: {
  page: number;
  limit: number;
  totalItems: number;
}) {
  const { page, limit, totalItems } = params;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    page,
    limit,
    totalItems,
    totalPages,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
  };
}
```

---

## References

* [Shared Types - pagination.ts](../src/shared/types/pagination.ts)
* [Validators - pagination.validator.ts](../src/shared/validators/pagination.validator.ts)
* [Response Shapes](./RESPONSE_SHAPES.md)
