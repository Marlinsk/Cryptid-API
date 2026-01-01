# Error Handling - Cryptids API

This document describes the **Error and Response Pattern** of the Cryptids API.

---

## Response Pattern Principles

All API responses follow these principles:

* **Predictable shape** → Clients don't need to infer structure
* **Clear separation between data and metadata** → `data` vs `meta`
* **Always structured errors** → Standardized format
* **No silent errors** → All errors are reported
* **Compatible with HTTP semantics** → Appropriate status codes

---

## Success Response

### 1. Collection Response

Used in endpoints that return collections/lists of resources.

#### Structure

```json
{
  "data": [],
  "meta": {
    "pagination": {},
    "appliedFilters": {},
    "retrievedAt": "2025-01-12T14:33:21Z",
    "requestId": "req_abc123"
  },
  "links": {
    "self": "/cryptids?page=1",
    "next": "/cryptids?page=2",
    "prev": null,
    "first": "/cryptids?page=1",
    "last": "/cryptids?page=10"
  }
}
```

#### Fields

| Field   | Type   | Required | Description                                |
| ------- | ------ | -------- | ------------------------------------------ |
| `data`  | array  | Yes      | Array of items (Summary shape)             |
| `meta`  | object | Yes      | Metadata (pagination, filters, timestamps) |
| `links` | object | No       | HATEOAS links for navigation               |

#### Meta Object (List)

| Field            | Type   | Required | Description                              |
| ---------------- | ------ | -------- | ---------------------------------------- |
| `pagination`     | object | Yes      | Pagination information (see PAGINATION.md) |
| `appliedFilters` | object | No       | Filters applied to query                 |
| `retrievedAt`    | string | Yes      | ISO 8601 timestamp                       |
| `requestId`      | string | No       | Unique request ID                        |

#### Complete Example

```json
{
  "data": [
    {
      "id": "1",
      "name": "The Nameless Watcher",
      "classification": "Cosmic Entity",
      "status": "Reported",
      "threatLevel": "High",
      "sightingsCount": 12,
      "hasImages": true
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalItems": 156,
      "totalPages": 8,
      "hasNext": true,
      "hasPrevious": false
    },
    "appliedFilters": {
      "hasImages": true
    },
    "retrievedAt": "2025-01-12T14:33:21Z",
    "requestId": "req_1736694801_xk92f1"
  },
  "links": {
  }
}
```

---

### 2. Single Item Response (Detail)

Used in endpoints that return a single resource.

#### Structure

```json
{
  "data": {},
  "meta": {
    "retrievedAt": "2025-01-12T14:33:21Z",
    "requestId": "req_abc123"
  },
  "links": {
    "self": "/cryptids/1",
    "related": {
      "images": "/cryptids/1/images"
    }
  }
}
```

#### Fields

| Field   | Type   | Required | Description                          |
| ------- | ------ | -------- | ------------------------------------ |
| `data`  | object | Yes      | Resource object (Detail shape)       |
| `meta`  | object | Yes      | Metadata (timestamps, requestId)     |
| `links` | object | No       | HATEOAS links to related resources   |

#### Meta Object (Detail)

| Field         | Type   | Required | Description          |
| ------------- | ------ | -------- | -------------------- |
| `retrievedAt` | string | Yes      | ISO 8601 timestamp   |
| `requestId`   | string | No       | Unique request ID    |

#### Complete Example

```json
{
  "data": {
    "id": "1",
    "name": "The Nameless Watcher",
    "aliases": ["Watcher in the Void", "Silent Observer"],
    "description": "A cosmic entity observed at the edge of reality...",
    "classification": "Cosmic Entity",
    "status": "Reported",
    "threatLevel": "High",
    "images": []
  },
  "meta": {
    "retrievedAt": "2025-01-12T14:33:21Z",
    "requestId": "req_1736694801_xk92f1"
  },
  "links": {
    "self": "/cryptids/1",
    "related": {
      "images": "/cryptids/1/images"
    }
  }
}
```

---

## Error Response

### General Structure

**All errors** follow this standardized format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": [],
    "requestId": "req_abc123",
    "timestamp": "2025-01-12T14:33:21Z"
  }
}
```

### Error Object Fields

| Field       | Type   | Required | Description                                |
| ----------- | ------ | -------- | ------------------------------------------ |
| `code`      | string | Yes      | Stable error code (public contract)        |
| `message`   | string | Yes      | Descriptive message for humans             |
| `details`   | array  | No       | List of specific errors (validation, etc.) |
| `requestId` | string | Yes      | Unique ID for tracking                     |
| `timestamp` | string | Yes      | ISO 8601 error timestamp                   |

### Error Details

Used when there are multiple issues (e.g., validation of multiple fields).

```json
"details": [
  {
    "field": "classification",
    "issue": "invalid_value",
    "expected": ["cosmic", "ancient", "spectral"],
    "received": "alien",
    "message": "Invalid classification value"
  }
]
```

#### Error Detail Fields

| Field      | Type   | Required | Description                          |
| ---------- | ------ | -------- | ------------------------------------ |
| `field`    | string | No       | Field related to the error           |
| `issue`    | string | Yes      | Specific type of problem             |
| `expected` | any    | No       | Expected value or format             |
| `received` | any    | No       | Received value                       |
| `message`  | string | No       | Additional error-specific message    |

---

## Standardized Error Codes

### Validation Errors (400 Bad Request)

Errors related to input validation.

| Code                     | Situation                              | Example                                    |
| ------------------------ | -------------------------------------- | ------------------------------------------ |
| `INVALID_QUERY`          | Malformed or invalid query string      | Parameters with incorrect format           |
| `INVALID_SORT`           | Invalid sort field                     | `sort=invalid_field`                       |
| `INVALID_PAGINATION`     | Incorrect pagination parameters        | `page=0` or `limit=1000`                   |
| `INVALID_BODY`           | Invalid request body                   | Malformed JSON or missing fields           |
| `MISSING_REQUIRED_FIELD` | Required field missing                 | `query` required in `/search`              |
| `INVALID_FORMAT`         | Incorrect data format                  | Date in non-ISO format                     |

#### Example: Invalid Filter

```json
{
  "error": {
    "code": "INVALID_FILTER",
    "message": "One or more filters are invalid.",
    "details": [
      {
        "issue": "invalid_type",
        "expected": "number or comma-separated numbers",
        "received": "abc"
      }
    ],
    "requestId": "req_1736694801_xk92f1",
    "timestamp": "2025-01-12T14:33:21Z"
  }
}
```

---

### Resource Errors (404 Not Found)

Errors related to resources not found.

| Code                 | Situation          | Example                              |
| -------------------- | ------------------ | ------------------------------------ |
| `RESOURCE_NOT_FOUND` | Resource not found | `GET /cryptids/999` (non-existent ID)|
| `ENDPOINT_NOT_FOUND` | Endpoint not found | `GET /invalid-route`                 |

#### Example: Resource Not Found

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Cryptid with id '999' was not found.",
    "requestId": "req_1736694801_xk92f1",
    "timestamp": "2025-01-12T14:33:21Z"
  }
}
```

---

### Business Logic Errors (422 Unprocessable Entity)

Errors related to business rules.

| Code                    | Situation                                  | Example                              |
| ----------------------- | ------------------------------------------ | ------------------------------------ |
| `UNSUPPORTED_OPERATION` | Invalid parameter combination              | Unsupported operation in this context|
| `INVALID_STATE`         | Resource state incompatible with operation | Attempt to delete protected resource |
| `CONFLICT`              | Conflict with existing state               | Create resource that already exists  |

---

### Authentication/Authorization Errors (401/403)

Errors related to authentication and authorization.

| Code            | HTTP | Situation                  | Example                        |
| --------------- | ---- | -------------------------- | ------------------------------ |
| `UNAUTHORIZED`  | 401  | Token missing or invalid   | Missing `Authorization` header |
| `INVALID_TOKEN` | 401  | Malformed token            | Invalid JWT                    |
| `EXPIRED_TOKEN` | 401  | Expired token              | JWT beyond validity time       |
| `FORBIDDEN`     | 403  | No permission for resource | Access denied by missing role  |

---

### Server Errors (500 Internal Server Error)

Internal server errors.

| Code                 | Situation                  | Example                          |
| -------------------- | -------------------------- | -------------------------------- |
| `INTERNAL_ERROR`     | Unexpected error           | Unhandled exception              |
| `DEPENDENCY_FAILURE` | External service failure   | Database timeout, API down       |
| `DATABASE_ERROR`     | Database-specific error    | Query failed                     |

#### Example: Internal Error

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred. Please try again later.",
    "requestId": "req_1736694801_xk92f1",
    "timestamp": "2025-01-12T14:33:21Z"
  }
}
```

**Important**: Stack traces are **never** exposed to the client. Internal errors are logged on the server for debugging.

---

## HTTP Status → Error Code Mapping

| HTTP Status | Error Codes                                                                 |
| ----------- | --------------------------------------------------------------------------- |
| 400         | `INVALID_QUERY`, `INVALID_FILTER`, `INVALID_SORT`, `INVALID_PAGINATION`, `INVALID_BODY`, `MISSING_REQUIRED_FIELD`, `INVALID_FORMAT` |
| 401         | `UNAUTHORIZED`, `INVALID_TOKEN`, `EXPIRED_TOKEN`                            |
| 403         | `FORBIDDEN`                                                                 |
| 404         | `RESOURCE_NOT_FOUND`, `ENDPOINT_NOT_FOUND`                                  |
| 422         | `UNSUPPORTED_OPERATION`, `INVALID_STATE`, `CONFLICT`                        |
| 500         | `INTERNAL_ERROR`, `DEPENDENCY_FAILURE`, `DATABASE_ERROR`                    |

---

## Practical Examples

### 1. Validation Error (Multiple Fields)

**Request:**
```bash
GET /cryptids?page=0&limit=1000&sort=invalid_field
```

**Response (400):**
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
      },
      {
        "field": "sort",
        "issue": "invalid_enum_value",
        "received": "invalid_field"
      }
    ],
    "requestId": "req_1736694801_xk92f1",
    "timestamp": "2025-01-12T14:33:21Z"
  }
}
```

---

### 2. Invalid Filter Error

**Request:**
```bash
GET /cryptids?threatLevel=ultra-mega-high
```

**Response (400):**
```json
{
  "error": {
    "code": "INVALID_FILTER",
    "message": "Invalid value for filter 'threatLevel'.",
    "details": [
      {
        "field": "threatLevel",
        "issue": "invalid_value",
        "expected": ["low", "medium", "high", "critical"],
        "received": "ultra-mega-high"
      }
    ],
    "requestId": "req_1736694801_abc123",
    "timestamp": "2025-01-12T14:35:10Z"
  }
}
```

---

### 3. Resource Not Found

**Request:**
```bash
GET /cryptids/999999
```

**Response (404):**
```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Cryptid with id '999999' was not found.",
    "requestId": "req_1736694801_def456",
    "timestamp": "2025-01-12T14:36:42Z"
  }
}
```

---

### 4. Endpoint Not Found

**Request:**
```bash
GET /invalid-route
```

**Response (404):**
```json
{
  "error": {
    "code": "ENDPOINT_NOT_FOUND",
    "message": "Endpoint 'GET /invalid-route' not found.",
    "requestId": "req_1736694801_ghi789",
    "timestamp": "2025-01-12T14:37:18Z"
  }
}
```

---

### 5. Internal Server Error

**Request:**
```bash
GET /cryptids
```

**Response (500):**
```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred. Please try again later.",
    "requestId": "req_1736694801_jkl012",
    "timestamp": "2025-01-12T14:38:55Z"
  }
}
```

**Note**: The `requestId` can be used by the user to report the problem to support.

---

## Best Practices

### For the API

* ✅ **Always return appropriate HTTP status**
* ✅ **Never return 200 with error**
* ✅ **Never expose stack traces or internal details**
* ✅ **Use stable error codes** (don't change without versioning)
* ✅ **Include requestId in all errors** (traceability)
* ✅ **Clear and actionable messages** ("What went wrong" + "How to fix")
* ✅ **Log 5xx errors on server** (with full stack trace)
* ❌ **Never return generic messages** ("Something went wrong")
* ❌ **Never depend on client language** (messages always in English)

### For Clients/Frontend

* ✅ **Always check error code** (not just HTTP status)
* ✅ **Use `error.details` for form validation** (highlight fields)
* ✅ **Display `error.message` to user** (it's human-readable)
* ✅ **Save `requestId` to report issues** (include in support tickets)
* ✅ **Implement retry for 5xx errors** (with exponential backoff)
* ✅ **Treat 4xx as user errors** (don't auto-retry)

---

## Frontend and SDK Compatibility

This pattern facilitates:

### 1. Error Message Rendering

```typescript
// Display main message
toast.error(response.error.message);

// Highlight invalid fields
response.error.details?.forEach(detail => {
  if (detail.field) {
    highlightField(detail.field, detail.message);
  }
});
```

### 2. Correlated Logging

```typescript
// Include requestId in logs for correlation
console.error(`[${response.error.requestId}] ${response.error.code}: ${response.error.message}`);
```

### 3. Automatic Retry

```typescript
// Retry only for 5xx errors
if (response.error.code === 'INTERNAL_ERROR' || response.error.code === 'DEPENDENCY_FAILURE') {
  retryWithBackoff(request);
} else {
  // Show error to user
  displayError(response.error.message);
}
```

### 4. Form Validation

```typescript
// Map details to form fields
const fieldErrors = response.error.details?.reduce((acc, detail) => {
  if (detail.field) {
    acc[detail.field] = detail.message || detail.issue;
  }
  return acc;
}, {});

setErrors(fieldErrors);
```

---

## Production Observability

### Request ID

All errors include `requestId` for tracking:

* Frontend can display to user: "An error occurred. ID: req_abc123"
* Server logs include the same `requestId`
* Correlation between client and server

### Monitoring/Alerting

Create alerts based on `error.code`:

```typescript
// Example: alert when many INVALID_FILTER
if (errorRate('INVALID_FILTER') > threshold) {
  alert('High rate of invalid filter errors - check API docs or client implementation');
}

// Example: critical alert for INTERNAL_ERROR
if (errorRate('INTERNAL_ERROR') > threshold) {
  alert('CRITICAL: High rate of internal errors - investigate immediately');
}
```

### Analytics

Track most common error codes:

```sql
SELECT
  error_code,
  COUNT(*) as occurrences,
  COUNT(DISTINCT user_id) as affected_users
FROM error_logs
WHERE timestamp > NOW() - INTERVAL '24 hours'
GROUP BY error_code
ORDER BY occurrences DESC;
```

---

## Technical Implementation

### Error Handler Middleware

Location: `src/shared/errors/error-handler.ts`

The global error handler converts all errors to standardized format:

* `ApiError` → Returns standardized structure
* `ZodError` → Converts to `ValidationError`
* `FastifyError` (404) → Converts to `ENDPOINT_NOT_FOUND`
* Unexpected errors → `INTERNAL_ERROR` (stack trace only in logs)

### Error Classes

Location: `src/shared/errors/api-error.ts`

Specialized classes for each error type:

* `ApiError` - Base class for all errors
* `ValidationError` - Validation errors
* `ResourceNotFoundError` - Resources not found
* `InvalidFilterError` - Invalid filters
* `InvalidSortError` - Invalid sort fields
* `InvalidPaginationError` - Invalid pagination

### Error Codes

Location: `src/shared/errors/error-codes.ts`

Exported constants for all error codes.

---

## Pattern Benefits

* ✅ **Consistency** - All errors follow the same format
* ✅ **Predictability** - Clients know what to expect
* ✅ **Debuggability** - requestId allows error tracking
* ✅ **Semantic clarity** - Codes describe exactly the problem
* ✅ **Extensibility** - New codes can be added without breaking changes
* ✅ **Testability** - Easy to test different error scenarios
* ✅ **Documentability** - Clear public contracts

---

## References

* [Error Types](../src/shared/errors/api-error.ts)
* [Error Codes](../src/shared/errors/error-codes.ts)
* [Error Handler](../src/shared/errors/error-handler.ts)
* [Response Types](../src/shared/types/response.ts)
* [PAGINATION.md](./PAGINATION.md)
* [FILTERS.md](./FILTERS.md)
