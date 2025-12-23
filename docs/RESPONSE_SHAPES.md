# Response Shapes - Cryptids API

This document describes the implementation of **Summary** and **Detail** shapes separation in the Cryptids API.

## Principles

The API works with **explicit representation levels**:

- **Summary** → exploration, listings, grids, previews
- **Detail** → deep reading, dedicated pages, storytelling

No endpoint mixes both by default.

---

## Endpoints and Shapes

### 1. `GET /cryptids` - List with Summary Shape

**Shape used**: `CryptidSummaryDTO`

**Returned fields**:
```json
{
  "id": "string",
  "name": "string",
  "aliases": ["string"],
  "classification": "string",
  "realm": "string",
  "habitat": "string",
  "status": "string",
  "threatLevel": "string",
  "sightingsCount": 0,
  "hasImages": false,
  "shortDescription": "string",
  "lastReportedAt": "ISO 8601 string | null"
}
```

**Query Parameters**:
- `page`: page number (default: 1)
- `limit`: items per page (default: 10, max: 100)
- `habitat`: filter by habitat ID
- `realm`: filter by realm ID
- `classification`: filter by classification ID
- `status`: filter by status
- `threatLevel`: filter by threat level
- `hasImages`: filter by presence of images (boolean)
- `hasSightings`: filter by presence of sightings (boolean)
- `sortBy`: field for sorting (`id`, `name`, `status`, `threatLevel`, `createdAt`, `updatedAt`)
- `order`: order (`asc` or `desc`)

**Response**:
```json
{
  "data": [/* array of CryptidSummaryDTO */],
  "metadata": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### 2. `GET /cryptids/search` - Search with Summary Shape

**Shape used**: `CryptidSummaryDTO`

**Query Parameters**:
- `query`: search term (required)
- `page`: page number (default: 1)
- `limit`: items per page (default: 10, max: 100)
- `classification`: filter by classification ID
- `realm`: filter by realm ID

Searches in fields: `name`, `description`, `originSummary`

**Response**: Same structure as listing endpoint

---

### 3. `GET /cryptids/:id` - Details with Detail Shape

**Shape used**: `CryptidDetailDTO`

**Returned fields**:
```json
{
  "id": "string",
  "name": "string",
  "aliases": ["string"],
  "description": "string",
  "originSummary": "string",
  "physicalDescription": "string | null",
  "behaviorNotes": "string | null",
  "classification": "string",
  "subClassifications": ["string"] (optional),
  "realm": "string",
  "habitat": "string",
  "manifestationConditions": "string | null",
  "firstReportedAt": "ISO 8601 string | null",
  "lastReportedAt": "ISO 8601 string | null",
  "timelineSummary": "string | null",
  "status": "string",
  "threatLevel": "string",
  "containmentNotes": "string | null",
  "images": [/* array of ImageDTO */] (optional),
  "relatedCryptids": [/* array of CryptidSummaryDTO */] (optional),
  "sources": ["string"] (optional),
  "createdAt": "ISO 8601 string",
  "updatedAt": "ISO 8601 string"
}
```

**Query Parameters** (inclusion control):

- `include`: defines which relations to include (comma-separated)
  - `images` - includes images
  - `related` - includes related cryptids
  - `sources` - includes sources
  - `subClassifications` - includes subclassifications

  Example: `?include=images,related`

- `fields`: defines which fields to return (comma-separated)
  - Example: `?fields=id,name,description,status`
  - **NOTE**: Not yet implemented

- `expand`: controls depth of nested resources
  - `images.metadata` - expands image metadata
  - Example: `?expand=images.metadata`
  - **NOTE**: Not yet implemented

---

## Auxiliary Shapes

### ImageDTO

```json
{
  "id": "string",
  "url": "string",
  "altText": "string",
  "source": "string",
  "license": "string"
}
```

---

## Code Structure

### DTOs (Data Transfer Objects)
Location: `src/modules/cryptids/application/dtos/`

- `cryptid-summary.dto.ts` - Summary shape
- `cryptid-detail.dto.ts` - Detail shape
- `image.dto.ts` - Image
- `query-params.dto.ts` - Query parameters for shape control

### Mappers
Location: `src/modules/cryptids/application/mappers/`

- `CryptidMapper.toSummary()` - Converts entity to Summary
- `CryptidMapper.toDetail()` - Converts entity to Detail
- `ImageMapper.toDTO()` - Converts image to DTO

### Repository
Location: `src/modules/cryptids/infra/repositories/drizzle-cryptids.repository.ts`

**New methods**:
- `findByIdWithRelations()` - Fetches cryptid with optional relations
- `hasImages()` - Checks if cryptid has images

**Updated methods**:
- `findWithFilters()` - Returns `CryptidWithRelations[]`
- `search()` - Returns `CryptidWithRelations[]`
- `findRelated()` - Returns `CryptidWithRelations[]`

---

## Database

### New fields added to `cryptids` table:

- `short_description` - Short description (1-2 lines)
- `physical_description` - Detailed physical description
- `behavior_notes` - Behavior notes
- `manifestation_conditions` - Manifestation conditions
- `timeline_summary` - Timeline summary
- `containment_notes` - Containment notes

**IMPORTANT**: Run migrations after implementation to add these fields.

---

## Benefits

1. **Predictable performance**: Listing endpoints don't load unnecessary data
2. **Clear DX**: Developers know exactly what to expect from each endpoint
3. **Decoupled frontend**: Components can work with specific shapes
4. **Simple playground**: Easy to test and visualize different data levels
5. **Efficient cache**: Summary shapes are ideal for long-duration caching

---

## TODOs / Next Steps

- [ ] Implement field selection (`fields` parameter)
- [ ] Implement expand logic (`expand` parameter)
- [ ] Create migrations for new database fields
- [ ] Implement subclassifications and sources
- [ ] Add unit tests for mappers
- [ ] Add integration tests for new endpoints
- [ ] Document usage examples in README

---

## Usage Examples

### List all cryptids (Summary)
```bash
GET /cryptids?page=1&limit=10&realm=1&threatLevel=High
```

### Search cryptids (Summary)
```bash
GET /cryptids/search?query=watcher&classification=1
```

### Get detailed cryptid without relations
```bash
GET /cryptids/1
```

### Get cryptid with images
```bash
GET /cryptids/1?include=images
```

### Get cryptid with all related data
```bash
GET /cryptids/1?include=images,related,sources,subClassifications
```
