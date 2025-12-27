# Images API Documentation

This document provides comprehensive information about the Images endpoints in the Cryptid API.

## Table of Contents

- [Overview](#overview)
- [Endpoints](#endpoints)
  - [Get Cryptid Images](#get-cryptid-images)
- [Query Parameters](#query-parameters)
- [Response Format](#response-format)
- [Examples](#examples)
- [Error Handling](#error-handling)

---

## Overview

The Images API allows you to retrieve images associated with specific cryptids. All image endpoints return paginated results with metadata about each image, including URL, alt text, source, and license information.

**Base URL**: `/api/v1/cryptids/:id/images`

---

## Endpoints

### Get Cryptid Images

Retrieve all images associated with a specific cryptid.

```
GET /api/v1/cryptids/:id/images
```

#### Path Parameters

| Parameter | Type   | Required | Description                        |
|-----------|--------|----------|------------------------------------|
| `id`      | number | Yes      | The unique identifier of the cryptid |

#### Query Parameters

| Parameter | Type   | Required | Default | Description                              |
|-----------|--------|----------|---------|------------------------------------------|
| `page`    | number | No       | 1       | Page number for pagination               |
| `limit`   | number | No       | 10      | Number of items per page (1-100)         |

#### Response Format

**Success Response (200 OK)**:

```json
{
  "data": [
    {
      "id": "1",
      "url": "https://example.com/images/cryptid-1.jpg",
      "altText": "A mysterious creature in the forest",
      "source": "Wildlife Photography Archive",
      "license": "CC BY 4.0"
    },
    {
      "id": "2",
      "url": "https://example.com/images/cryptid-2.jpg",
      "altText": "Close-up of creature footprint",
      "source": "Cryptozoology Research Institute",
      "license": "CC BY-SA 4.0"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalItems": 2,
      "totalPages": 1,
      "hasNext": false,
      "hasPrevious": false
    },
    "retrievedAt": "2025-12-27T12:00:00.000Z",
    "requestId": "req_abc123"
  },
  "links": {
    "self": "/cryptids/1/images?page=1"
  }
}
```

**Empty Result (200 OK)**:

When a cryptid has no images, the API returns an empty data array:

```json
{
  "data": [],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalItems": 0,
      "totalPages": 0,
      "hasNext": false,
      "hasPrevious": false
    },
    "retrievedAt": "2025-12-27T12:00:00.000Z",
    "requestId": "req_abc456"
  },
  "links": {
    "self": "/cryptids/1/images?page=1"
  }
}
```

#### Response Fields

##### Image Object

| Field     | Type   | Description                                      |
|-----------|--------|--------------------------------------------------|
| `id`      | string | Unique identifier for the image                  |
| `url`     | string | Direct URL to the image file                     |
| `altText` | string | Alternative text description for accessibility   |
| `source`  | string | Source or attribution of the image               |
| `license` | string | License type (e.g., CC BY 4.0, CC BY-SA 4.0)    |

##### Pagination Metadata

| Field          | Type    | Description                                    |
|----------------|---------|------------------------------------------------|
| `page`         | number  | Current page number                            |
| `limit`        | number  | Number of items per page                       |
| `totalItems`   | number  | Total number of images for this cryptid        |
| `totalPages`   | number  | Total number of pages                          |
| `hasNext`      | boolean | Whether there is a next page                   |
| `hasPrevious`  | boolean | Whether there is a previous page               |

---

## Query Parameters

### Pagination

Control the number of results and navigate through pages.

**Parameters:**
- `page` (number): Page number to retrieve (default: 1)
- `limit` (number): Number of items per page (default: 10, max: 100)

**Examples:**
```bash
# Get first page with 10 images
GET /api/v1/cryptids/1/images?page=1&limit=10

# Get second page with 20 images
GET /api/v1/cryptids/1/images?page=2&limit=20

# Get all images (up to 100)
GET /api/v1/cryptids/1/images?limit=100
```

---

## Examples

### Basic Usage

#### Get all images for a cryptid

```bash
GET /api/v1/cryptids/1/images
```

**Response:**
```json
{
  "data": [
    {
      "id": "1",
      "url": "https://cdn.example.com/bigfoot-1.jpg",
      "altText": "Bigfoot sighting in Pacific Northwest forest",
      "source": "National Cryptid Database",
      "license": "CC BY 4.0"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalItems": 1,
      "totalPages": 1,
      "hasNext": false,
      "hasPrevious": false
    },
    "retrievedAt": "2025-12-27T12:30:00.000Z",
    "requestId": "req_xyz789"
  }
}
```

### Pagination Example

#### Navigate through multiple pages of images

```bash
# Page 1
GET /api/v1/cryptids/5/images?page=1&limit=5

# Page 2
GET /api/v1/cryptids/5/images?page=2&limit=5

# Page 3
GET /api/v1/cryptids/5/images?page=3&limit=5
```

---

## Error Handling

### Common Error Responses

#### 404 Not Found - Cryptid doesn't exist

When requesting images for a non-existent cryptid:

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Cryptid with id 999 not found",
    "details": {
      "resource": "Cryptid",
      "id": 999
    }
  },
  "meta": {
    "requestId": "req_error123"
  }
}
```

#### 400 Bad Request - Invalid parameters

When providing invalid query parameters:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid query parameters",
    "details": {
      "page": "must be a positive integer",
      "limit": "must be between 1 and 100"
    }
  },
  "meta": {
    "requestId": "req_error456"
  }
}
```

---

## Integration Examples

### JavaScript/TypeScript

```typescript
interface Image {
  id: string
  url: string
  altText: string
  source: string
  license: string
}

async function getCryptidImages(cryptidId: number, page = 1, limit = 10): Promise<Image[]> {
  const response = await fetch(
    `https://api.example.com/api/v1/cryptids/${cryptidId}/images?page=${page}&limit=${limit}`
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch images: ${response.statusText}`)
  }

  const data = await response.json()
  return data.data
}

// Usage
const images = await getCryptidImages(1)
console.log(`Found ${images.length} images`)
```

### Python

```python
import requests

def get_cryptid_images(cryptid_id: int, page: int = 1, limit: int = 10) -> list:
    """Fetch images for a specific cryptid."""
    url = f"https://api.example.com/api/v1/cryptids/{cryptid_id}/images"
    params = {"page": page, "limit": limit}

    response = requests.get(url, params=params)
    response.raise_for_status()

    return response.json()["data"]

# Usage
images = get_cryptid_images(cryptid_id=1)
print(f"Found {len(images)} images")
```

### cURL

```bash
# Basic request
curl -X GET "https://api.example.com/api/v1/cryptids/1/images"

# With pagination
curl -X GET "https://api.example.com/api/v1/cryptids/1/images?page=2&limit=20"

# Pretty print JSON response
curl -X GET "https://api.example.com/api/v1/cryptids/1/images" | jq .
```

---

## Best Practices

### Performance

1. **Use appropriate page sizes**: Default limit of 10 is suitable for most cases. Only increase if you need more images.
2. **Cache responses**: Image lists don't change frequently, consider caching for better performance.

### Image Usage

1. **Respect licenses**: Always check the `license` field and comply with license terms.
2. **Provide attribution**: Use the `source` field to properly attribute images.
3. **Accessibility**: Use the `altText` field for screen readers and alt attributes.

### Pagination

1. **Check `hasNext`**: Use this field to determine if there are more pages.
2. **Don't assume page counts**: Use `totalPages` to know the exact number of pages.
3. **Handle empty results**: Check if `data` array is empty before processing.

---

## Summary

- **Endpoint**: `GET /api/v1/cryptids/:id/images`
- **Authentication**: Not required
- **Pagination**: Yes (default: page=1, limit=10, max limit=100)
- **Filters**: None
- **Response Format**: JSON with `data`, `meta`, and `links` fields
- **Rate Limit**: Standard API limits apply
- **Empty Results**: Returns 200 OK with empty `data` array

---

## Related Documentation

- [Cryptids API](./CRYPTIDS.md) - Main cryptids endpoint documentation
- [Parameters Guide](./PARAMETERS.md) - Detailed parameter documentation
- [Pagination Guide](./PAGINATION.md) - Pagination best practices
