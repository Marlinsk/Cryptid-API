# Images API Documentation

This document provides comprehensive information about the Images endpoints in the Cryptid API.

## Table of Contents

- [Overview](#overview)
- [Endpoints](#endpoints)
- [List All Images](#list-all-images)
- [Get Cryptid Images](#get-cryptid-images)
- [Query Parameters](#query-parameters)
- [Response Format](#response-format)
- [Examples](#examples)
- [Error Handling](#error-handling)

---

## Overview

The Images API provides two main endpoints:
- **List All Images**: `/api/v1/cryptids/images` - Get all images in the database
- **Get Cryptid Images**: `/api/v1/cryptids/:id/images` - Get images for a specific cryptid

---

## Endpoints

### List All Images

Retrieve all images from the database (not filtered by cryptid).

```
GET /api/v1/cryptids/images
```

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
      "id": "01936f3e-82a1-7890-b2c3-d4e5f6a7b8c9",
      "cryptidId": 1,
      "url": "https://example.com/images/cryptid-1.jpg",
      "size": "2:3",
      "altText": "A mysterious creature in the forest",
      "source": "Wildlife Photography Archive",
      "license": "CC BY-NC 4.0"
    },
    {
      "id": "01936f3e-82a1-7890-b2c3-d4e5f6a7b8ca",
      "cryptidId": 2,
      "url": "https://example.com/images/cryptid-2.jpg",
      "size": "2:3",
      "altText": "Close-up of creature footprint",
      "source": "Cryptozoology Research Institute",
      "license": "CC BY-NC 4.0"
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
    "retrievedAt": "2025-12-31T12:00:00.000Z"
  },
  "links": {
    "self": "/api/v1/cryptids/images?page=1&limit=10",
    "first": "/api/v1/cryptids/images?page=1&limit=10",
    "last": "/api/v1/cryptids/images?page=1&limit=10"
  }
}
```

---

### Get Cryptid Images

Retrieve all images associated with a specific cryptid.

```
GET /api/v1/cryptids/:id/images
```

#### Path Parameters

| Parameter | Type   | Required | Description                                       |
|-----------|--------|----------|---------------------------------------------------|
| `id`      | number | Yes      | The unique identifier of the cryptid (positive integer) |

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
      "id": "01936f3e-82a1-7890-b2c3-d4e5f6a7b8c9",
      "url": "https://example.com/images/cryptid-1.jpg",
      "size": "2:3",
      "altText": "A mysterious creature in the forest",
      "source": "Wildlife Photography Archive",
      "license": "CC BY-NC 4.0"
    },
    {
      "id": "01936f3e-82a1-7890-b2c3-d4e5f6a7b8ca",
      "url": "https://example.com/images/cryptid-2.jpg",
      "size": "2:3",
      "altText": "Close-up of creature footprint",
      "source": "Cryptozoology Research Institute",
      "license": "CC BY-NC 4.0"
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
    "retrievedAt": "2025-12-31T12:00:00.000Z"
  },
  "links": {
    "self": "/api/v1/cryptids/1/images?page=1&limit=10",
    "first": "/api/v1/cryptids/1/images?page=1&limit=10",
    "last": "/api/v1/cryptids/1/images?page=1&limit=10"
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
    "retrievedAt": "2025-12-31T12:00:00.000Z"
  },
  "links": {
    "self": "/api/v1/cryptids/1/images?page=1&limit=10",
    "first": "/api/v1/cryptids/1/images?page=1&limit=10",
    "last": "/api/v1/cryptids/1/images?page=1&limit=10"
  }
}
```

#### Response Fields

##### Image Object

| Field     | Type   | Description                                      |
|-----------|--------|--------------------------------------------------|
| `id`      | string | Unique identifier for the image (UUIDv7)         |
| `url`     | string | Direct URL to the image file                     |
| `size`    | string | Image aspect ratio (e.g., "2:3", "16:9")         |
| `altText` | string | Alternative text description for accessibility   |
| `source`  | string | Source or attribution of the image               |
| `license` | string | License information for the image                |

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

#### List all images in the database

```bash
GET /api/v1/cryptids/images
```

**Response:**
```json
{
  "data": [
    {
      "id": "01936f3e-82a1-7890-b2c3-d4e5f6a7b8cb",
      "cryptidId": 1,
      "url": "https://cdn.example.com/bigfoot-1.jpg",
      "size": "2:3",
      "altText": "Bigfoot sighting in Pacific Northwest forest",
      "source": "National Cryptid Database",
      "license": "CC BY-NC 4.0"
    },
    {
      "id": "01936f3e-82a1-7890-b2c3-d4e5f6a7b8cc",
      "cryptidId": 3,
      "url": "https://cdn.example.com/nessie-1.jpg",
      "size": "16:9",
      "altText": "Loch Ness Monster surface disturbance",
      "source": "Scottish Folklore Archive",
      "license": "CC BY-NC 4.0"
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
    "retrievedAt": "2025-12-31T12:30:00.000Z"
  }
}
```

#### Get all images for a cryptid

```bash
GET /api/v1/cryptids/1/images
```

**Response:**
```json
{
  "data": [
    {
      "id": "01936f3e-82a1-7890-b2c3-d4e5f6a7b8cb",
      "url": "https://cdn.example.com/bigfoot-1.jpg",
      "size": "2:3",
      "altText": "Bigfoot sighting in Pacific Northwest forest",
      "source": "National Cryptid Database",
      "license": "CC BY-NC 4.0"
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
    "retrievedAt": "2025-12-31T12:30:00.000Z"
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
  }
}
```

---

## Integration Examples

### JavaScript/TypeScript

```typescript
interface Image {
  id: string
  cryptidId?: number
  url: string
  size: string
  altText: string
  source: string
  license: string
}

// List all images
async function getAllImages(page = 1, limit = 10): Promise<Image[]> {
  const response = await fetch(
    `https://api.example.com/api/v1/cryptids/images?page=${page}&limit=${limit}`
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch images: ${response.statusText}`)
  }

  const data = await response.json()
  return data.data
}

// Get images for a specific cryptid
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
const allImages = await getAllImages()
console.log(`Found ${allImages.length} total images`)

const cryptidImages = await getCryptidImages(1)
console.log(`Found ${cryptidImages.length} images for cryptid 1`)
```

### Python

```python
import requests

def get_all_images(page: int = 1, limit: int = 10) -> list:
    """Fetch all images from the database."""
    url = "https://api.example.com/api/v1/cryptids/images"
    params = {"page": page, "limit": limit}

    response = requests.get(url, params=params)
    response.raise_for_status()

    return response.json()["data"]

def get_cryptid_images(cryptid_id: int, page: int = 1, limit: int = 10) -> list:
    """Fetch images for a specific cryptid."""
    url = f"https://api.example.com/api/v1/cryptids/{cryptid_id}/images"
    params = {"page": page, "limit": limit}

    response = requests.get(url, params=params)
    response.raise_for_status()

    return response.json()["data"]

# Usage
all_images = get_all_images()
print(f"Found {len(all_images)} total images")

cryptid_images = get_cryptid_images(cryptid_id=1)
print(f"Found {len(cryptid_images)} images for cryptid 1")
```

### cURL

```bash
# List all images
curl -X GET "https://api.example.com/api/v1/cryptids/images"

# List all images with pagination
curl -X GET "https://api.example.com/api/v1/cryptids/images?page=2&limit=20"

# Get images for a specific cryptid
curl -X GET "https://api.example.com/api/v1/cryptids/1/images"

# With pagination
curl -X GET "https://api.example.com/api/v1/cryptids/1/images?page=2&limit=20"

# Pretty print JSON response
curl -X GET "https://api.example.com/api/v1/cryptids/images" | jq .
```

---

## Best Practices

### Performance

1. **Use appropriate page sizes**: Default limit of 10 is suitable for most cases. Only increase if you need more images.
2. **Cache responses**: Image lists don't change frequently, consider caching for better performance.

### Image Usage

1. **Respect licenses**: Check the `license` field before using images. Most images use CC BY-NC 4.0.
2. **Provide attribution**: Use the `source` field to properly attribute images.
3. **Accessibility**: Use the `altText` field for screen readers and alt attributes.
4. **Aspect ratios**: Use the `size` field to maintain proper image display ratios.

### Pagination

1. **Check `hasNext`**: Use this field to determine if there are more pages.
2. **Don't assume page counts**: Use `totalPages` to know the exact number of pages.
3. **Handle empty results**: Check if `data` array is empty before processing.

---

## Summary

### List All Images Endpoint
- **Endpoint**: `GET /api/v1/cryptids/images`
- **Authentication**: Not required
- **Pagination**: Yes (default: page=1, limit=10, max limit=100)
- **Filters**: None (returns all images from all cryptids)
- **Response Format**: JSON with `data`, `meta`, and `links` fields
- **Image ID Format**: UUIDv7
- **Sorting**: Images are ordered by creation date (oldest first)
- **Rate Limit**: Standard API limits apply
- **Empty Results**: Returns 200 OK with empty `data` array
- **Error Handling**: Returns 400 for invalid parameters

### Get Cryptid Images Endpoint
- **Endpoint**: `GET /api/v1/cryptids/:id/images`
- **Authentication**: Not required
- **Pagination**: Yes (default: page=1, limit=10, max limit=100)
- **Filters**: None (only by cryptid ID via path parameter)
- **Response Format**: JSON with `data`, `meta`, and `links` fields
- **Image ID Format**: UUIDv7
- **Sorting**: Images are ordered by creation date (oldest first)
- **Rate Limit**: Standard API limits apply
- **Empty Results**: Returns 200 OK with empty `data` array
- **Error Handling**: Returns 404 if cryptid doesn't exist, 400 for invalid parameters

---

## Related Documentation

- [Cryptids API](./CRYPTIDS.md) - Main cryptids endpoint documentation
- [Parameters Guide](./PARAMETERS.md) - Detailed parameter documentation
- [Pagination Guide](./PAGINATION.md) - Pagination best practices
