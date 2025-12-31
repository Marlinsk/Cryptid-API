# Classifications API

This document provides comprehensive documentation for the Classifications endpoints.

---

## Overview

Classifications categorize cryptids by different types of characteristics. The API supports three category types:

- **Physical** - Biological and physical classifications (e.g., Humanoid, Cryptid, Beast)
- **Narrative** - Story and cultural role classifications (e.g., Trickster, Guardian, Harbinger)
- **Abstract** - Conceptual classifications (e.g., Paradox, Observer, Thought-Form)

---

## Endpoints

### List Classifications

Retrieve a list of all classifications or filter by category type.

```
GET /api/v1/cryptids/classifications
```

#### Query Parameters

| Parameter      | Type   | Required | Description                                      | Allowed Values                         |
|---------------|--------|----------|--------------------------------------------------|----------------------------------------|
| `categoryType` | string | No       | Filter classifications by category type          | `physical`, `narrative`, `abstract`    |
| `page`        | number | No       | Page number for pagination                       | Positive integer (default: 1)          |
| `limit`       | number | No       | Number of items per page                         | 1-100 (default: 20)                    |
| `sort`        | string | No       | Field to sort by                                 | `id`, `name`, `categoryType` (default: `id`) |
| `order`       | string | No       | Sort order                                       | `asc`, `desc` (default: `asc`)         |
| `fields`      | string | No       | Comma-separated list of fields to return         | Any valid classification field         |

#### Examples

```bash
# Get all classifications (paginated)
GET /api/v1/cryptids/classifications

# Get only physical classifications
GET /api/v1/cryptids/classifications?categoryType=physical

# Get only narrative classifications
GET /api/v1/cryptids/classifications?categoryType=narrative

# Get only abstract classifications
GET /api/v1/cryptids/classifications?categoryType=abstract

# Pagination examples
GET /api/v1/cryptids/classifications?page=2&limit=10

# Sorting examples
GET /api/v1/cryptids/classifications?sort=name&order=desc
GET /api/v1/cryptids/classifications?sort=categoryType&order=asc

# Field selection examples
GET /api/v1/cryptids/classifications?fields=id,name
GET /api/v1/cryptids/classifications?fields=id,name,createdAt

# Combined parameters
GET /api/v1/cryptids/classifications?categoryType=physical&page=1&limit=5&sort=name&fields=id,name,description
```

#### Response Format

**Default Response (without fields parameter)**:

```json
{
  "data": [
    {
      "id": "1",
      "name": "Humanoid",
      "description": "Entities that exhibit primarily human-like physical characteristics, including bipedal locomotion, opposable digits, and recognizable facial features, though these may be exaggerated or distorted.",
      "categoryType": "physical"
    },
    {
      "id": "2",
      "name": "Beast",
      "description": "Creatures that resemble known or unknown animals, possessing primarily non-human physical traits such as quadrupedal movement, fur, scales, or other animalistic features.",
      "categoryType": "physical"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 12,
    "totalPages": 1,
    "hasNext": false,
    "hasPrevious": false
  },
  "meta": {
    "retrievedAt": "2025-01-15T14:30:45.123Z",
    "requestId": "req_abc123"
  }
}
```


**Response with fields parameter** (e.g., `?fields=id,name,createdAt`):

```json
{
  "data": [
    {
      "id": "1",
      "name": "Humanoid",
      "createdAt": "2025-01-15T10:00:00.000Z",
    },
    {
      "id": "2",
      "name": "Beast",
      "createdAt": "2025-01-15T10:00:00.000Z",
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 12,
    "totalPages": 1,
    "hasNext": false,
    "hasPrevious": false
  },
  "meta": {
    "retrievedAt": "2025-01-15T14:30:45.123Z",
    "requestId": "req_abc123"
  }
}
```

#### Response Fields

##### Public Fields (returned by default)

| Field          | Type   | Description                                         |
|---------------|--------|-----------------------------------------------------|
| `id`          | string | Unique identifier for the classification            |
| `name`        | string | Name of the classification                          |
| `description` | string | Detailed description of the classification          |
| `categoryType`| string | Category type (`physical`, `narrative`, `abstract`) |

##### Private Fields (only returned when explicitly requested via `fields` parameter)

| Field          | Type   | Description                                         |
|---------------|--------|-----------------------------------------------------|
| `createdAt`   | string | ISO 8601 timestamp when created                     |

##### Pagination Metadata

| Field          | Type    | Description                                         |
|---------------|---------|-----------------------------------------------------|
| `page`        | number  | Current page number                                 |
| `limit`       | number  | Number of items per page                            |
| `totalItems`  | number  | Total number of items across all pages              |
| `totalPages`  | number  | Total number of pages                               |
| `hasNext`     | boolean | Whether there is a next page                        |
| `hasPrevious` | boolean | Whether there is a previous page                    |

---

## Field Selection

The `fields` parameter allows you to control which fields are returned in the response. This is useful for:
- Reducing payload size by requesting only needed fields
- Accessing private fields (`createdAt`) when needed
- Optimizing bandwidth for mobile or low-bandwidth connections

### Usage

```bash
# Get only id and name
GET /api/v1/cryptids/classifications?fields=id,name

# Get specific fields including private ones
GET /api/v1/cryptids/classifications?fields=id,name,description,createdAt

# Get only private fields
GET /api/v1/cryptids/classifications?fields=createdAt
```

### Examples

**Request only id and name:**
```bash
GET /api/v1/cryptids/classifications?fields=id,name
```

**Response:**
```json
{
  "data": [
    {
      "id": "1",
      "name": "Humanoid"
    },
    {
      "id": "2",
      "name": "Beast"
    }
  ],
  "pagination": { ... }
}
```

**Request with private fields:**
```bash
GET /api/v1/cryptids/classifications?fields=id,name,createdAt
```

**Response:**
```json
{
  "data": [
    {
      "id": "1",
      "name": "Humanoid",
      "createdAt": "2025-01-15T10:00:00.000Z",
    }
  ],
  "pagination": { ... }
}
```

### Available Fields

- **Public fields** (returned by default): `id`, `name`, `description`, `categoryType`
- **Private fields** (only returned when explicitly requested): `createdAt`

### Notes

- Field names are case-sensitive
- Invalid field names are silently ignored
- Spaces after commas are automatically trimmed (e.g., `fields=id, name` works)
- Empty `fields` parameter returns default public fields

---

## Pagination

All classification endpoints return paginated results.

### Pagination Parameters

| Parameter | Type   | Default | Description                    |
|-----------|--------|---------|--------------------------------|
| `page`    | number | 1       | Page number to retrieve        |
| `limit`   | number | 20      | Number of items per page (1-100) |

### Pagination Response

Every response includes pagination metadata:

```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 12,
    "totalPages": 1,
    "hasNext": false,
    "hasPrevious": false
  }
}
```

### Navigation

Use the pagination metadata to navigate through results:

```bash
# First page
GET /api/v1/cryptids/classifications?page=1&limit=5

# Next page
GET /api/v1/cryptids/classifications?page=2&limit=5

# Last page (calculated from totalPages)
GET /api/v1/cryptids/classifications?page=3&limit=5
```

---

## Sorting

Control the order of results using `sort` and `order` parameters.

### Sort Parameters

| Parameter | Type   | Default | Description                    |
|-----------|--------|---------|--------------------------------|
| `sort`    | string | `id`    | Field to sort by               |
| `order`   | string | `asc`   | Sort order (`asc` or `desc`)   |

### Available Sort Fields

- `id` - Sort by classification ID (numeric)
- `name` - Sort by classification name (alphabetic)
- `categoryType` - Sort by category type (alphabetic)

### Examples

```bash
# Sort by name ascending (A-Z)
GET /api/v1/cryptids/classifications?sort=name&order=asc

# Sort by name descending (Z-A)
GET /api/v1/cryptids/classifications?sort=name&order=desc

# Sort by category type
GET /api/v1/cryptids/classifications?sort=categoryType&order=asc

# Default sorting (by id, ascending)
GET /api/v1/cryptids/classifications
```

---

## Category Types

### Physical Classifications

Classifications based on physical and biological characteristics.

**Examples:**
- **Humanoid** - Human-like entities with bipedal locomotion
- **Beast** - Animal-like creatures with non-human traits
- **Cryptid** - Unconfirmed biological entities
- **Elemental** - Entities composed of or controlling natural elements
- **Hybrid** - Creatures combining features of multiple species

### Narrative Classifications

Classifications based on the role the entity plays in stories and cultural contexts.

**Examples:**
- **Trickster** - Entities known for deception and mischief
- **Guardian** - Protective entities watching over specific locations or people
- **Harbinger** - Entities that signal upcoming events or changes
- **Omen** - Creatures whose appearance predicts specific outcomes
- **Spirit** - Non-corporeal or otherworldly entities

### Abstract Classifications

Classifications based on conceptual or metaphysical characteristics.

**Examples:**
- **Paradox** - Entities that defy logical consistency
- **Observer** - Entities primarily defined by their act of watching
- **Thought-Form** - Entities created or sustained by belief
- **Anomaly** - Phenomena that cannot be easily categorized
- **Manifestation** - Physical expressions of non-physical concepts

---

## Usage with Cryptids

Classifications can be used to filter cryptids in the main `/api/v1/cryptids` endpoint:

```bash
# Get all cryptids with a specific classification
GET /api/v1/cryptids?classification=1

# Get cryptids with multiple classifications (OR semantics)
GET /api/v1/cryptids?classification=1,2,3

# Combine classification filter with other filters
```

See [PARAMETERS.md](./PARAMETERS.md) for complete parameter documentation.

---

## Response Patterns

### Success Response (200 OK)

```json
{
  "data": [
    {
      "id": "1",
      "name": "Humanoid",
      "description": "Entities that exhibit primarily human-like physical characteristics...",
      "categoryType": "physical",
      "createdAt": "2025-01-15T10:00:00.000Z",
    }
  ],
  "meta": {
    "retrievedAt": "2025-01-15T14:30:45.123Z",
    "requestId": "req_abc123",
    "appliedFilters": {
      "categoryType": "physical"
    }
  }
}
```

**When filters are applied**, the `meta.appliedFilters` object shows which filters were used.

### Validation Error (400 Bad Request)

```json
{
  "error": {
    "code": "INVALID_QUERY",
    "message": "One or more validation errors occurred.",
    "details": [
      {
        "field": "categoryType",
        "issue": "invalid_enum_value",
        "expected": "physical, narrative, or abstract",
        "received": "invalid_type"
      }
    ],
    "requestId": "req_abc123",
    "timestamp": "2025-01-15T14:30:45.123Z"
  }
}
```

### Internal Error (500 Internal Server Error)

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Failed to list classifications",
    "requestId": "req_abc123",
    "timestamp": "2025-01-15T14:30:45.123Z"
  }
}
```

See [ERROR_HANDLING.md](./ERROR_HANDLING.md) for complete error documentation.

---

## Validation Rules

### categoryType Parameter

- **Type**: String enum
- **Required**: No (optional parameter)
- **Allowed Values**: `physical`, `narrative`, `abstract`
- **Case Sensitive**: Yes
- **Default**: None (returns all classifications when omitted)

#### Valid Examples

```bash
GET /api/v1/cryptids/classifications                          # ✅ Valid - all classifications
GET /api/v1/cryptids/classifications?categoryType=physical    # ✅ Valid
GET /api/v1/cryptids/classifications?categoryType=narrative   # ✅ Valid
GET /api/v1/cryptids/classifications?categoryType=abstract    # ✅ Valid
```

#### Invalid Examples

```bash
GET /api/v1/cryptids/classifications?categoryType=Physical    # ❌ Invalid - wrong case
GET /api/v1/cryptids/classifications?categoryType=biological  # ❌ Invalid - not an allowed value
GET /api/v1/cryptids/classifications?categoryType=123         # ❌ Invalid - must be string
```

---

## Use Cases

### 1. Get All Classifications

Retrieve the complete list of all available classifications.

```bash
GET /api/v1/cryptids/classifications
```

**Use when:**
- Building dropdown/select menus
- Displaying classification options to users
- Syncing local classification data

### 2. Get Classifications by Category

Filter classifications by their category type.

```bash
# Get only physical classifications
GET /api/v1/cryptids/classifications?categoryType=physical

# Get only narrative classifications
GET /api/v1/cryptids/classifications?categoryType=narrative

# Get only abstract classifications
GET /api/v1/cryptids/classifications?categoryType=abstract
```

**Use when:**
- Building category-specific UI sections
- Filtering options based on user selection
- Analyzing classifications by category

### 3. Integration with Cryptid Filtering

Use classification IDs to filter cryptids.

```bash
# Step 1: Get all humanoid classifications
GET /api/v1/cryptids/classifications?categoryType=physical

# Step 2: Find "Humanoid" classification (id: 1)
# Step 3: Filter cryptids by that classification
GET /api/v1/cryptids?classification=1
```

**Use when:**
- Building multi-step filtering workflows
- Creating classification-based navigation
- Implementing advanced search features

---

## Best Practices

### For API Consumers

1. **Cache classification data**: Classifications rarely change, cache them locally
2. **Use IDs for filtering**: Always use classification IDs when filtering cryptids
3. **Handle all category types**: Support all three category types in your UI
4. **Validate before sending**: Check categoryType values before making requests
5. **Display descriptions**: Show classification descriptions to help users understand categories

### Example Implementation

```typescript
// TypeScript interface
interface Classification {
  id: string;
  name: string;
  description: string;
  categoryType: 'physical' | 'narrative' | 'abstract';
  createdAt: string;
}

// Query parameter type
interface ListClassificationsParams {
  categoryType?: 'physical' | 'narrative' | 'abstract';
}

// Fetch all classifications
async function getAllClassifications(): Promise<Classification[]> {
  const response = await fetch('/api/v1/cryptids/classifications');
  const data = await response.json();
  return data.data;
}

// Fetch classifications by category
async function getClassificationsByCategory(
  categoryType: 'physical' | 'narrative' | 'abstract'
): Promise<Classification[]> {
  const response = await fetch(
    `/api/v1/cryptids/classifications?categoryType=${categoryType}`
  );
  const data = await response.json();
  return data.data;
}

// Group classifications by category
function groupByCategory(
  classifications: Classification[]
): Record<string, Classification[]> {
  return classifications.reduce((acc, classification) => {
    const category = classification.categoryType;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(classification);
    return acc;
  }, {} as Record<string, Classification[]>);
}

// Usage example
const allClassifications = await getAllClassifications();
const grouped = groupByCategory(allClassifications);

console.log('Physical:', grouped.physical);
console.log('Narrative:', grouped.narrative);
console.log('Abstract:', grouped.abstract);
```

---

## Response Metadata

All successful responses include metadata:

| Field             | Type   | Description                                    |
|------------------|--------|------------------------------------------------|
| `retrievedAt`    | string | ISO 8601 timestamp when data was retrieved     |
| `requestId`      | string | Unique identifier for the request (optional)   |
| `appliedFilters` | object | Filters applied to the query (optional)        |

**Note**: The `appliedFilters` field only appears when filters are actually used.

---

## Rate Limiting

Classifications endpoint follows the same rate limiting as other API endpoints.

See [RATE_LIMITING.md](./RATE_LIMITING.md) for details.

---

## Related Documentation

- [PARAMETERS.md](./PARAMETERS.md) - Using classifications to filter cryptids
- [FILTERS.md](./FILTERS.md) - Detailed filter documentation
- [ERROR_HANDLING.md](./ERROR_HANDLING.md) - Error responses
- [RESPONSE_SHAPES.md](./RESPONSE_SHAPES.md) - Response structures

---

## Quick Reference

```bash
# All classifications
GET /api/v1/cryptids/classifications

# Filter by category type
GET /api/v1/cryptids/classifications?categoryType={physical|narrative|abstract}

# Use with cryptids endpoint
GET /api/v1/cryptids?classification={classificationId}
GET /api/v1/cryptids?classification={id1},{id2},{id3}  # Multiple (OR)
```

---

## Summary

- **Endpoint**: `GET /api/v1/cryptids/classifications`
- **Authentication**: Not required
- **Pagination**: Yes (default: page=1, limit=20)
- **Filters**: `categoryType` (optional)
- **Sorting**: `sort` and `order` parameters (default: sort by `id` ascending)
- **Field Selection**: `fields` parameter for custom field selection
- **Rate Limit**: Standard API limits apply
- **Response Format**: JSON with `data`, `pagination`, and `meta` fields
