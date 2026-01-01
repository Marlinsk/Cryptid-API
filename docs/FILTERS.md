# Filters & Search - Cryptids API

This document describes the **Filters and Search Contract** of the Cryptids API.

---

## Filter Principles

The API filter system follows these fundamental principles:

* **Declarative** → URL describes exactly what is requested
* **Combinable** → Filters, search, sorting, and pagination coexist harmoniously
* **Predictable** → Same parameters return same behavior
* **Semantic** → Names reflect the domain, not the implementation

**IMPORTANT**: All filters are **optional** and can be combined freely.

---

## Processing Pipeline

The application order is **fixed** and **predictable**:

1. **Search** (text search)
2. **Filters** (structured filters)
3. **Sort** (sorting)
4. **Pagination** (pagination)

Each stage reduces or organizes the result set from the previous stage.

---

## Filter Types

### 1. Search (Text Search)

Performs case-insensitive text search across multiple fields.

#### Searched Fields

* `name` - Cryptid name
* `aliases` - Alternative names
* `shortDescription` - Short description
* `originSummary` - Origin summary

#### Parameter

| Parameter | Type   | Description                                     |
| --------- | ------ | ----------------------------------------------- |
| `search`  | string | Search term (partial match, case-insensitive)  |

#### Behavior

* **Partial matching**: "shadow" finds "The Shadow Watcher"
* **Case-insensitive**: "SHADOW" = "shadow" = "Shadow"
* **OR between fields**: searches in name OR aliases OR description OR origin
* **AND with other filters**: search + structured filters

#### Examples

```bash
# Simple search
GET /cryptids?search=watcher

# Search combined with filters

# Search with pagination
GET /cryptids?search=cosmic&page=2&limit=20
```

---

### 2. Simple Filters (Equality Filters)

Filters that accept **single values** or **multi-valued** (array).

#### Available Filters

| Filter           | Type             | Description                       | Example                        |
| ---------------- | ---------------- | --------------------------------- | ------------------------------ |
| `classification` | number or array  | Classification ID or list         | `classification=1,2,3`         |
| `status`         | string or array  | Status or list of statuses        | `status=reported,verified`     |
| `threatLevel`    | string or array  | Threat level or list              | `threatLevel=high,critical`    |

#### Multi-valued Semantics

When multiple values are provided (comma-separated), the semantics is **OR** (union).

```bash
# Habitat 1 OR Habitat 2 OR Habitat 3

# Status "reported" OR "verified"
GET /cryptids?status=reported,verified
```

#### Filter Combination

When multiple **types** of filters are used, the semantics is **AND** (intersection).

```bash

# Classification 1 AND Status "reported" AND ThreatLevel "high"
GET /cryptids?classification=1&status=reported&threatLevel=high
```

#### Examples

```bash
# Single simple filter

# Single multi-valued filter
GET /cryptids?classification=1,2,3

# Multiple combined filters

# Filters + pagination
GET /cryptids?threatLevel=high,critical&page=2&limit=50
```

---

### 3. Boolean Filters

Filters that verify **presence or absence** of related data.

#### Available Filters

| Filter         | Type    | Description                         | Example              |
| -------------- | ------- | ----------------------------------- | -------------------- |
| `hasImages`    | boolean | Has associated images               | `hasImages=true`     |

#### Behavior

* `hasImages=true` → Returns only cryptids with images
* `hasImages=false` → Returns only cryptids without images
* Omit filter → Returns all (with and without images)

#### Examples

```bash
# Only cryptids with images
GET /cryptids?hasImages=true

# Combine with other filters
```

---

## Sorting (Sort)

Controls the **order** of results before pagination.

### Parameters

| Parameter | Type   | Allowed Values                                                      | Default |
| --------- | ------ | ------------------------------------------------------------------- | ------- |
| `order`   | string | `asc`, `desc`                                                       | `asc`   |

### Behavior

* Sorting happens **after** filters and **before** pagination
* Ensures consistent results between pages
* Sortable fields are **explicit** (not possible to sort by arbitrary fields)

### Examples

```bash
# Sort by name (A-Z)
GET /cryptids?sort=name&order=asc

# Sort by last sighting (most recent first)

# Combine with filters
```

---

## Complete Combination

All filters can be combined freely following the pipeline.

### Complex Example

```bash
```

**Interpretation**:
1. **Search**: Search for "shadow" in name, aliases, description, origin
2. **Filters**:
   - AND Classification 3
   - AND Status "reported" OR "verified"
   - AND Has images
   - AND ThreatLevel high OR critical
4. **Pagination**: Return page 2 with 20 items

---

## Summary Table

| Type          | Filters                                                    | Semantics          | Example                          |
| ------------- | ---------------------------------------------------------- | ------------------ | -------------------------------- |
| **Search**    | `search`                                                   | OR between fields  | `search=watcher`                 |
| **Boolean**   | `hasImages`                                | Presence/absence   | `hasImages=true`                 |
| **Sort**      | `sort`, `order`                                            | Sorting            | `sort=name&order=asc`            |
| **Pagination**| `page`, `limit`                                            | Offset+limit       | `page=2&limit=50`                |

---

## Validation

### Validation Rules

* **Search**: non-empty string (min 1 character)
* **Numeric filters**: positive integers
* **Multi-valued filters**: individual validation of each value
* **Booleans**: "true" or "false" (case-insensitive)
* **Sort**: only allowed fields (see list above)
* **Order**: only "asc" or "desc"
* **Page**: number >= 1
* **Limit**: number between 1 and 100

### Validation Errors

**Case**: Invalid filter
```json
{
  "error": "Validation failed",
  "details": {
  }
}
```

**Case**: Invalid sort field
```json
{
  "error": "Validation failed",
  "details": {
  }
}
```

---

## Usage Examples

### Common Use Cases

#### 1. Initial Exploration
```bash
# List all cryptids (paginated)
GET /cryptids?page=1&limit=20
```

#### 2. Filter by Category
```bash

```

#### 3. Text Search
```bash
# Search by term
GET /cryptids?search=watcher&page=1&limit=10
```

#### 4. Combined Filters
```bash
# Cosmic cryptids with images and high threat
GET /cryptids?classification=1&hasImages=true&threatLevel=high,critical&page=1&limit=20
```

#### 5. Custom Sorting
```bash
# Most recently reported first

# Sort by name (A-Z)
GET /cryptids?sort=name&order=asc&page=1&limit=50
```

#### 6. Search + Filters + Sorting
```bash
# Search "shadow", only with images, sort by name
GET /cryptids?search=shadow&hasImages=true&sort=name&order=asc&page=1&limit=10
```

---

## Frontend Guidelines

### Building Query Strings

```typescript
// Example: build filters dynamically
const filters = {
  search: 'watcher',
  hasImages: true,
  sort: 'name',
  order: 'asc',
  page: 1,
  limit: 20,
};

// Convert to query string
const params = new URLSearchParams();

if (filters.search) params.append('search', filters.search);
if (filters.hasImages !== undefined) params.append('hasImages', String(filters.hasImages));
if (filters.sort) params.append('sort', filters.sort);
if (filters.order) params.append('order', filters.order);
params.append('page', String(filters.page));
params.append('limit', String(filters.limit));

```

### Showing Active Filters

```typescript
// Extract applied filters from URL
const appliedFilters = [];

if (params.has('search')) appliedFilters.push({ type: 'search', value: params.get('search') });
if (params.has('hasImages')) appliedFilters.push({ type: 'hasImages', value: params.get('hasImages') });

// Render chips/tags for each active filter
appliedFilters.forEach(filter => {
  renderFilterChip(filter.type, filter.value);
});
```

### Resetting Filters

```typescript
// Clear all filters, keep only pagination
const resetFilters = () => {
  const params = new URLSearchParams();
  params.append('page', '1');
  params.append('limit', '20');

  navigate(`/cryptids?${params.toString()}`);
};
```

---

## Playground Guidelines

To facilitate testing and API exploration:

* Provide **UI for each filter type**:
  - Search: text input
  - Simple: multiple selects or tag inputs
  - Boolean: checkboxes or toggles
  - Range: sliders or numeric inputs
* **Preview** the built query string
* **Show** active filters as removable chips
* **Validate** inputs before sending (client-side validation)
* Provide **pre-configured examples** for common use cases

---

## Performance and Optimization

### Recommended Indexing

For optimal performance, the following indexes are recommended:

```sql
-- Simple filters
CREATE INDEX idx_cryptids_classification ON cryptids(classification_id);
CREATE INDEX idx_cryptids_status ON cryptids(status);
CREATE INDEX idx_cryptids_threat_level ON cryptids(threat_level);

-- Text search (consider full-text search)
CREATE INDEX idx_cryptids_name ON cryptids(name);

-- Sorting
CREATE INDEX idx_cryptids_last_reported ON cryptids(last_reported_at);
CREATE INDEX idx_cryptids_created_at ON cryptids(created_at);
```

### Caching

Queries with filters can be cached aggressively:

* Cache key: hash of complete query string
* TTL: 5-15 minutes for listings
* Invalidation: when new cryptids are created/updated

---

## Future Extensibility

The filter system was designed to be easily extensible:

### New Simple Filters

```typescript
// Add new filter in list-cryptids.dto.ts
export const listCryptidsSchema = z.object({
  // ... existing filters

  // New filter
  originCountry: z.union([z.string(), multivaluedStringSchema]).optional(),
});
```

### New Range Filters

```typescript
// Add min/max filters for other numeric fields
sightingsCountMin: z.coerce.number().int().min(0).optional(),
sightingsCountMax: z.coerce.number().int().min(0).optional(),
```

### Custom Operators

For advanced needs, operators can be added:

```bash
# Future example: NOT, NOR
```

---

## Contract Benefits

* ✅ **Predictable**: Same URL, same result
* ✅ **Discoverable**: Semantic names are self-explanatory
* ✅ **Composable**: All filters can coexist
* ✅ **Scalable**: Performance optimized with correct indexes
* ✅ **Testable**: Explicit URLs facilitate automated tests
* ✅ **Cacheable**: Stable query strings allow aggressive caching
* ✅ **Extensible**: New filters don't break existing clients

---

## References

* [Shared Validators - filters.validator.ts](../src/shared/validators/filters.validator.ts)
* [List Cryptids DTO](../src/modules/cryptids/application/use-cases/list-cryptids/list-cryptids.dto.ts)
* [Cryptids Repository](../src/modules/cryptids/domain/repositories/icryptids.repository.ts)
* [Pagination](./PAGINATION.md)
* [Response Shapes](./RESPONSE_SHAPES.md)
