# Query Parameters - Cryptids API

This document provides a comprehensive reference for all query parameters accepted by the Cryptids API endpoints.

---

## Overview

The Cryptids API uses query parameters to control:

* **Filtering** - Narrow down results based on specific criteria
* **Search** - Full-text search across cryptid data
* **Sorting** - Control the order of results
* **Pagination** - Navigate through result pages
* **Inclusion** - Control which related data is included

**All parameters are optional** unless specified otherwise.

---

## Parameter Categories

### 1. Pagination Parameters

Control how results are paginated and displayed.

| Parameter | Type   | Default | Min | Max | Description                               |
| --------- | ------ | ------- | --- | --- | ----------------------------------------- |
| `page`    | number | 1       | 1   | -   | Current page number                       |
| `limit`   | number | 20      | 1   | 100 | Number of items per page                  |

#### Examples

```bash
# Get first page with default limit (20)
GET /api/v1/cryptids?page=1

# Get second page with 50 items
GET /api/v1/cryptids?page=2&limit=50

# Maximum limit
GET /api/v1/cryptids?limit=100
```

#### Validation

* `page` must be a positive integer (≥ 1)
* `limit` must be between 1 and 100
* Invalid values are normalized to defaults

See [PAGINATION.md](./PAGINATION.md) for detailed information.

---

### 2. Search Parameters

Perform full-text search across cryptid fields.

| Parameter | Type   | Min Length | Description                                    |
| --------- | ------ | ---------- | ---------------------------------------------- |
| `search`  | string | 1          | Search term for full-text search              |

#### Search Behavior

* **Case-insensitive**: "SHADOW" = "shadow" = "Shadow"
* **Partial matching**: "watch" matches "The Watcher"
* **Multi-field**: Searches across name, aliases, description, and origin summary
* **OR semantics**: Matches any of the searched fields

#### Examples

```bash
# Simple search
GET /api/v1/cryptids?search=watcher

# Search with pagination
GET /api/v1/cryptids?search=cosmic&page=1&limit=10

# Search combined with filters
GET /api/v1/cryptids?search=shadow&realm=1&hasImages=true
```

See [FILTERS.md](./FILTERS.md) and [SEARCH_RATE_LIMITING.md](./SEARCH_RATE_LIMITING.md) for more information.

---

### 3. Filter Parameters

#### 3.1 Simple Filters (Equality)

Filter by exact matches or multiple values (OR semantics).

| Parameter        | Type            | Multiple Values | Description                              |
| ---------------- | --------------- | --------------- | ---------------------------------------- |
| `habitat`        | number          | Yes             | Filter by habitat ID(s)                  |
| `realm`          | number          | Yes             | Filter by realm ID(s)                    |
| `classification` | number          | Yes             | Filter by classification ID(s)           |
| `status`         | string          | Yes             | Filter by status value(s)                |
| `threatLevel`    | string          | Yes             | Filter by threat level(s)                |

#### Multi-value Syntax

Use comma-separated values for OR semantics:

```bash
# Habitat 1 OR 2 OR 3
GET /api/v1/cryptids?habitat=1,2,3

# Status "reported" OR "verified"
GET /api/v1/cryptids?status=reported,verified

# ThreatLevel "high" OR "critical"
GET /api/v1/cryptids?threatLevel=high,critical
```

#### Allowed Values

**Status values**:
- `reported` - Reported sightings
- `verified` - Verified cryptids
- `debunked` - Debunked reports
- `legendary` - Legendary creatures

**Threat Level values**:
- `low` - Low threat
- `medium` - Medium threat
- `high` - High threat
- `critical` - Critical threat

#### Examples

```bash
# Single filter
GET /api/v1/cryptids?realm=1

# Multiple filters (AND semantics)
GET /api/v1/cryptids?realm=1&status=verified&threatLevel=high

# Multi-valued filter
GET /api/v1/cryptids?classification=1,2,3

# Complex combination
GET /api/v1/cryptids?realm=1,2&habitat=3,4&status=reported,verified
```

---

#### 3.2 Boolean Filters

Filter by presence or absence of related data.

| Parameter   | Type    | Default | Description                          |
| ----------- | ------- | ------- | ------------------------------------ |
| `hasImages` | boolean | -       | Filter by presence of images         |

#### Behavior

* `hasImages=true` - Returns only cryptids with images
* `hasImages=false` - Returns only cryptids without images
* Parameter omitted - Returns all cryptids (with and without images)

#### Examples

```bash
# Only cryptids with images
GET /api/v1/cryptids?hasImages=true

# Only cryptids without images
GET /api/v1/cryptids?hasImages=false

# Combined with other filters
GET /api/v1/cryptids?realm=1&hasImages=true&status=verified
```

---

### 4. Sorting Parameters

Control the order of results before pagination.

| Parameter | Type   | Default | Allowed Values                                                                              |
| --------- | ------ | ------- | ------------------------------------------------------------------------------------------- |
| `sort`    | string | `id`    | `id`, `name`, `status`, `threatLevel`, `firstReportedAt`, `lastReportedAt`, `createdAt`, `updatedAt` |
| `order`   | string | `asc`   | `asc`, `desc`                                                                               |

#### Behavior

* Sorting happens **after filtering** and **before pagination**
* Ensures consistent results across pages
* Only explicit fields can be used for sorting

#### Examples

```bash
# Sort by name (A-Z)
GET /api/v1/cryptids?sort=name&order=asc

# Sort by name (Z-A)
GET /api/v1/cryptids?sort=name&order=desc

# Sort by last reported date (most recent first)
GET /api/v1/cryptids?sort=lastReportedAt&order=desc

# Sort by threat level (highest first)
GET /api/v1/cryptids?sort=threatLevel&order=desc

# Combined with filters
GET /api/v1/cryptids?realm=1&sort=name&order=asc&page=1
```

---

### 5. Relationship Parameters

Control which related data is included in detail responses.

#### 5.1 Include Parameter (✅ Implemented)

| Parameter | Type   | Allowed Values             | Endpoint                |
| --------- | ------ | -------------------------- | ----------------------- |
| `include` | string | `images`, `related`        | `/api/v1/cryptids/:id`  |

##### Behavior

* Multiple values can be comma-separated
* Only applies to detail endpoints (single cryptid)
* Controls which relations are loaded and included
* Reduces payload size by only fetching requested data

##### Examples

```bash
# Include images
GET /api/v1/cryptids/1?include=images

# Include multiple relations (all available)
GET /api/v1/cryptids/1?include=images,related
```

---

#### 5.2 Fields Parameter (✅ Implemented)

| Parameter | Type   | Description                              | Endpoint                |
| --------- | ------ | ---------------------------------------- | ----------------------- |
| `fields`  | string | Comma-separated list of fields to return | `/api/v1/cryptids/:id`  |

##### Behavior

* Allows sparse fieldsets (return only requested fields)
* Reduces bandwidth for large objects
* Useful for mobile/low-bandwidth clients
* Only valid field names are accepted (invalid fields are filtered out)
* Returns error if all requested fields are invalid

##### Allowed Fields

**Public fields** (returned by default):
- `id`, `name`, `aliases`, `description`, `originSummary`
- `physicalDescription`, `behaviorNotes`, `classification`
- `realm`, `habitat`, `manifestationConditions`
- `firstReportedAt`, `lastReportedAt`, `timelineSummary`
- `status`, `threatLevel`, `containmentNotes`
- `images`, `relatedCryptids`

**Private fields** (only returned when explicitly requested):
- `createdAt`, `updatedAt`

> **Note**: Private fields are internal metadata that are not included in responses by default. You must explicitly request them using the `fields` parameter if needed.

##### Examples

```bash
# Return only specific public fields
GET /api/v1/cryptids/1?fields=id,name,description,status

# Minimal response
GET /api/v1/cryptids/1?fields=id,name

# Request private timestamp fields explicitly
GET /api/v1/cryptids/1?fields=id,name,createdAt,updatedAt

# Private metadata only
GET /api/v1/cryptids/1?fields=createdAt,updatedAt

# Combining with include parameter
GET /api/v1/cryptids/1?include=images&fields=id,name,images,status
```

##### Validation

Invalid fields are filtered out automatically:

```bash
# Request with invalid field
GET /api/v1/cryptids/1?fields=id,name,invalidField

# Response will only include: id, name (invalidField is ignored)
```

If all requested fields are invalid, returns validation error:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid fields: invalidField1, invalidField2",
    "statusCode": 422
  }
}
```

---

#### 5.3 Expand Parameter (🚧 Planned)

| Parameter | Type   | Allowed Values                                   | Endpoint                | Status          |
| --------- | ------ | ------------------------------------------------ | ----------------------- | --------------- |
| `expand`  | string | `images.metadata`, `related.classification`      | `/api/v1/cryptids/:id`  | Not Implemented |

##### Planned Behavior

* Controls depth of nested resource expansion
* Allows fetching metadata for related resources
* Prevents N+1 query problems

##### Planned Examples

```bash
# Expand image metadata
GET /api/v1/cryptids/1?include=images&expand=images.metadata

# Expand related cryptid classifications
GET /api/v1/cryptids/1?include=related&expand=related.classification
```

**Note**: This feature is defined in the schema but not yet implemented. See [RESPONSE_SHAPES.md](./RESPONSE_SHAPES.md) for implementation status.

---

See [RESPONSE_SHAPES.md](./RESPONSE_SHAPES.md) for more information about response structures and planned features.

---

## Parameter Combination

### Processing Pipeline

Parameters are processed in this order:

1. **Search** - Full-text search across fields
2. **Filters** - Apply structured filters
3. **Sort** - Order results
4. **Pagination** - Select page subset

### Combination Rules

* **Within filter type** (multi-valued): **OR** semantics
  - `habitat=1,2,3` → Habitat 1 OR 2 OR 3
* **Between filter types**: **AND** semantics
  - `realm=1&status=verified` → Realm 1 AND Status verified
* **Search + Filters**: **AND** semantics
  - `search=shadow&realm=1` → Contains "shadow" AND Realm 1

### Complex Example

```bash
GET /api/v1/cryptids?search=shadow&realm=1,2&classification=3&status=reported,verified&hasImages=true&sort=lastReportedAt&order=desc&page=2&limit=20
```

**Interpretation**:

1. Search for "shadow" in name, aliases, description, origin
2. Filter:
   - Realm 1 OR Realm 2
   - AND Classification 3
   - AND Status "reported" OR "verified"
   - AND Has images
3. Sort by `lastReportedAt` descending
4. Return page 2 with 20 items per page

---

## Parameter Validation

### Validation Rules

| Parameter Type | Validation                                    |
| -------------- | --------------------------------------------- |
| **Numbers**    | Must be valid integers                        |
| **Booleans**   | Must be "true" or "false" (case-insensitive)  |
| **Enums**      | Must match allowed values exactly             |
| **Strings**    | Must meet minimum length requirements         |
| **Range**      | Must be within specified min/max bounds       |

### Validation Errors

When validation fails, the API returns a `400 Bad Request` with details:

```json
{
  "error": {
    "code": "INVALID_QUERY",
    "message": "One or more validation errors occurred.",
    "details": [
      {
        "field": "page",
        "issue": "too_small",
        "expected": "minimum: 1",
        "received": 0
      },
      {
        "field": "limit",
        "issue": "too_big",
        "expected": "maximum: 100",
        "received": 1000
      }
    ],
    "requestId": "req_123456",
    "timestamp": "2025-01-12T14:33:21Z"
  }
}
```

See [ERROR_HANDLING.md](./ERROR_HANDLING.md) for complete error documentation.

---

## Common Use Cases

### 1. Basic Listing

```bash
# Default listing (first page, 20 items, sorted by id)
GET /api/v1/cryptids

# Custom page size
GET /api/v1/cryptids?limit=50
```

### 2. Filtered Listing

```bash
# By single criterion
GET /api/v1/cryptids?realm=1

# By multiple criteria
GET /api/v1/cryptids?realm=1&status=verified&hasImages=true

# Multi-valued filter
GET /api/v1/cryptids?classification=1,2,3
```

### 3. Search

```bash
# Simple search
GET /api/v1/cryptids?search=watcher

# Search with filters
GET /api/v1/cryptids?search=cosmic&realm=1&hasImages=true

# Search with pagination
GET /api/v1/cryptids?search=shadow&page=1&limit=10
```

### 4. Sorted Results

```bash
# Alphabetical
GET /api/v1/cryptids?sort=name&order=asc

# Most recent sightings
GET /api/v1/cryptids?sort=lastReportedAt&order=desc

# Highest threat first
GET /api/v1/cryptids?sort=threatLevel&order=desc
```

### 5. Detailed View

```bash
# Basic details
GET /api/v1/cryptids/1

# With images
GET /api/v1/cryptids/1?include=images

# With all relations
GET /api/v1/cryptids/1?include=images,related,sources
```

---

## Best Practices

### For API Consumers

1. **Use pagination**: Always use `page` and `limit` for large datasets
2. **Be specific**: Use filters instead of searching when possible
3. **Cache results**: Cache responses to reduce API calls
4. **Validate locally**: Validate parameters before sending requests
5. **Handle errors**: Check for validation errors and handle appropriately
6. **Respect rate limits**: Monitor rate limit headers and adjust frequency

### Parameter Construction

```typescript
// TypeScript example for list endpoint
interface CryptidListQueryParams {
  search?: string;
  realm?: number | number[];
  classification?: number | number[];
  status?: string | string[];
  threatLevel?: string | string[];
  hasImages?: boolean;
  sort?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// TypeScript example for detail endpoint
interface CryptidDetailQueryParams {
  include?: ('images' | 'related')[];
  fields?: string[];  // ✅ Implemented
  // expand?: string[];     // Planned - not implemented yet
}

function buildListQueryString(params: CryptidListQueryParams): string {
  const urlParams = new URLSearchParams();

  // Add each parameter if defined
  if (params.search) urlParams.append('search', params.search);
  if (params.realm) urlParams.append('realm', Array.isArray(params.realm) ? params.realm.join(',') : String(params.realm));
  if (params.classification) urlParams.append('classification', Array.isArray(params.classification) ? params.classification.join(',') : String(params.classification));
  if (params.status) urlParams.append('status', Array.isArray(params.status) ? params.status.join(',') : params.status);
  if (params.threatLevel) urlParams.append('threatLevel', Array.isArray(params.threatLevel) ? params.threatLevel.join(',') : params.threatLevel);
  if (params.hasImages !== undefined) urlParams.append('hasImages', String(params.hasImages));
  if (params.sort) urlParams.append('sort', params.sort);
  if (params.order) urlParams.append('order', params.order);
  if (params.page) urlParams.append('page', String(params.page));
  if (params.limit) urlParams.append('limit', String(params.limit));

  return urlParams.toString();
}

function buildDetailQueryString(params: CryptidDetailQueryParams): string {
  const urlParams = new URLSearchParams();

  if (params.include && params.include.length > 0) {
    urlParams.append('include', params.include.join(','));
  }

  if (params.fields && params.fields.length > 0) {
    urlParams.append('fields', params.fields.join(','));
  }

  return urlParams.toString();
}

// Usage examples
const listQuery = buildListQueryString({
  search: 'shadow',
  realm: [1, 2],
  hasImages: true,
  page: 1,
  limit: 20
});
// Result: search=shadow&realm=1,2&hasImages=true&page=1&limit=20

const detailQuery = buildDetailQueryString({
  include: ['images', 'related']
});
// Result: include=images,related

const detailQueryWithFields = buildDetailQueryString({
  include: ['images'],
  fields: ['id', 'name', 'description', 'status', 'images']
});
// Result: include=images&fields=id,name,description,status,images
```

---

## Summary Table

| Category          | Parameters                                                        | Purpose                          | Status      |
| ----------------- | ----------------------------------------------------------------- | -------------------------------- | ----------- |
| **Pagination**    | `page`, `limit`                                                   | Control result pages             | ✅ Implemented |
| **Search**        | `search`                                                          | Full-text search                 | ✅ Implemented |
| **Filters**       | `habitat`, `realm`, `classification`, `status`, `threatLevel`, `hasImages` | Filter results | ✅ Implemented |
| **Sorting**       | `sort`, `order`                                                   | Order results                    | ✅ Implemented |
| **Relationships** | `include` (✅), `fields` (✅), `expand` (🚧)                      | Control included data & fields   | Partial     |

---

## Related Documentation

* [FILTERS.md](./FILTERS.md) - Detailed filter documentation
* [PAGINATION.md](./PAGINATION.md) - Pagination implementation
* [RESPONSE_SHAPES.md](./RESPONSE_SHAPES.md) - Response structures
* [SEARCH_RATE_LIMITING.md](./SEARCH_RATE_LIMITING.md) - Search rate limits
* [RATE_LIMITING.md](./RATE_LIMITING.md) - General rate limiting
* [ERROR_HANDLING.md](./ERROR_HANDLING.md) - Error responses

---

## Quick Reference

```bash
# Full example with all parameter types
GET /api/v1/cryptids?
  search=shadow&              # Full-text search
  realm=1,2&                  # Multi-valued filter (OR)
  classification=3&           # Single filter
  status=reported,verified&   # Multi-valued filter (OR)
  hasImages=true&             # Boolean filter
  threatLevel=high,critical&  # Multi-valued filter (OR)
  sort=lastReportedAt&        # Sort field
  order=desc&                 # Sort order
  page=2&                     # Page number
  limit=20                    # Page size
```

This produces results that are:
1. Searched for "shadow"
2. Filtered by realm 1 OR 2
3. AND classification 3
4. AND status reported OR verified
5. AND have images
6. AND threat level high OR critical
7. Sorted by last reported date (newest first)
8. Page 2 with 20 items
