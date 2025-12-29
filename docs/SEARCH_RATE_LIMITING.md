# Search Rate Limiting Policy - Cryptids API

This document describes the **Search-specific Rate Limiting**, a separate and explicit contract for the most costly endpoint of the API.

---

## Why Does Search Have Its Own Rate Limit?

The search endpoint (`/cryptids/search` or `/cryptids?search=`) executes higher computational cost operations:

* **Full-text search** across multiple fields (name, aliases, description, origin)
* **Ranking and relevance** of results
* **Potentially costly deep pagination**

For this reason, the search rate limit is **more restrictive** than listing or detail endpoints.

---

## Search-Specific Limits

### Public (Default)

| Plan   | Limit           | Window         |
| ------ | --------------- | -------------- |
| Public | **30 requests** | **60 seconds** |

### Playground / Interactive Documentation

| Plan       | Limit           | Window         |
| ---------- | --------------- | -------------- |
| Playground | **15 requests** | **60 seconds** |

**Reason**: Lower limits prevent automated abuse via public documentation.

---

## Independent Scope

The search rate limit is **independent** of the global limit.

### Examples

| Scenario                                    | Result                                     |
| ------------------------------------------- | ------------------------------------------ |
| Client makes 50 requests /cryptids          | ✅ Within global limit (60/min)            |
| Client makes 35 requests /cryptids/search   | ❌ Exceeds search limit (30/min)           |
| Client makes 25 /cryptids + 25 /search      | ✅ Both within limits                      |

**Important**: A client can be within the global limit but blocked only on search.

---

## Specific Headers

All search responses include specific headers:

### Standard Headers + X-RateLimit-Scope

| Header                  | Value for Search | Description                            |
| ----------------------- | ---------------- | -------------------------------------- |
| `X-RateLimit-Scope`     | `search`         | Indicates it's search rate limit       |
| `X-RateLimit-Limit`     | `30`             | Maximum search limit                   |
| `X-RateLimit-Remaining` | `4`              | Remaining search requests              |
| `X-RateLimit-Reset`     | `1736701200`     | UNIX timestamp of reset                |
| `Retry-After`           | `27`             | Seconds until can search again (429)   |

### Example Successful Response

```http
HTTP/1.1 200 OK
X-RateLimit-Scope: search
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 4
X-RateLimit-Reset: 1736701200
Content-Type: application/json

{
  "data": [...],
  "meta": {...},
  "links": {...}
}
```

---

## Response When Limit Exceeded (429)

### HTTP Status

```
429 Too Many Requests
```

### Specific Error Code

```json
{
  "error": {
    "code": "SEARCH_RATE_LIMIT_EXCEEDED",
    "message": "Search rate limit exceeded. Please reduce request frequency.",
    "details": {
      "scope": "search",
      "limit": 30,
      "window": "60s",
      "retryAfter": 27
    },
    "requestId": "req_4a8f91",
    "timestamp": "2025-01-12T14:33:21Z"
  }
}
```

### 429 Headers

```http
HTTP/1.1 429 Too Many Requests
X-RateLimit-Scope: search
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1736701227
Retry-After: 27
```

**Important differences**:

* Error code: `SEARCH_RATE_LIMIT_EXCEEDED` (vs. `RATE_LIMIT_EXCEEDED`)
* Scope always present: `"scope": "search"`
* Allows specific handling in SDKs and dashboards

---

## Soft Throttling (Warning)

When the client exceeds **80% of the search limit** (24/30 requests):

```http
X-RateLimit-Warning: Search rate limit nearing exhaustion
```

### Example

```http
HTTP/1.1 200 OK
X-RateLimit-Scope: search
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 5
X-RateLimit-Reset: 1736701200
X-RateLimit-Warning: Search rate limit nearing exhaustion
```

**Recommendation**: Clients should slow down search requests when receiving this warning.

---

## Progressive Throttling (Abuse Prevention)

After multiple consecutive search rate limit violations, the system applies progressive penalties:

| Attempt      | Action                                                 | Duration    |
| ------------ | ------------------------------------------------------ | ----------- |
| 1st violation | Simple HTTP 429                                       | -           |
| 2nd violation | HTTP 429 + artificial 500ms delay                     | -           |
| 3rd violation | Temporary search block (other endpoints OK)           | 10 minutes  |

### Detailed Behavior

#### 1st Violation

```http
HTTP/1.1 429 Too Many Requests
X-RateLimit-Scope: search
Retry-After: 18

{
  "error": {
    "code": "SEARCH_RATE_LIMIT_EXCEEDED",
    "message": "Search rate limit exceeded. Please reduce request frequency.",
    ...
  }
}
```

#### 2nd Violation (Artificial Delay)

* Response identical to previous one
* **But**: server waits 500ms before responding
* Client perceives increased latency
* Logs record: `[Rate Limit] Artificial delay applied to search for IP 192.168.1.100 (2 violations)`

#### 3rd Violation (Temporary Block)

```http
HTTP/1.1 429 Too Many Requests
X-RateLimit-Scope: search
Retry-After: 600

{
  "error": {
    "code": "SEARCH_RATE_LIMIT_EXCEEDED",
    "message": "Search rate limit exceeded. Please reduce request frequency.",
    "details": {
      "scope": "search",
      "limit": 30,
      "window": "60s",
      "retryAfter": 600
    },
    ...
  }
}
```

* Search blocked for **10 minutes** (600 seconds)
* Other endpoints continue working normally
* Logs record: `[Rate Limit] Search temporarily blocked for IP 192.168.1.100 (3 violations)`

### Violation Reset

Violations are automatically reset after **5 minutes** without new violations.

---

## Best Practices for Clients

### 1. Debounce Search Inputs

```typescript
import { debounce } from 'lodash';

// Wait 300ms after last keystroke before searching
const debouncedSearch = debounce(async (query: string) => {
  const response = await fetch(`/cryptids/search?query=${query}`);
  // ...
}, 300);

// In search input
searchInput.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});
```

### 2. Cache Results

```typescript
const searchCache = new Map<string, any>();

async function searchCryptids(query: string) {
  // Check local cache first
  if (searchCache.has(query)) {
    return searchCache.get(query);
  }

  const response = await fetch(`/cryptids/search?query=${query}`);
  const data = await response.json();

  // Cache for 5 minutes
  searchCache.set(query, data);
  setTimeout(() => searchCache.delete(query), 5 * 60 * 1000);

  return data;
}
```

### 3. Monitor Headers

```typescript
async function searchWithMonitoring(query: string) {
  const response = await fetch(`/cryptids/search?query=${query}`);

  const remaining = parseInt(response.headers.get('x-ratelimit-remaining') || '0');
  const limit = parseInt(response.headers.get('x-ratelimit-limit') || '30');
  const warning = response.headers.get('x-ratelimit-warning');

  if (warning) {
    console.warn('⚠️  Approaching search rate limit. Slowing down...');
    // Increase debounce or show warning to user
  }

  if (remaining < limit * 0.2) {
    console.warn(`Only ${remaining} search requests remaining`);
  }

  return response.json();
}
```

### 4. Avoid Deep Pagination

```typescript
// ❌ Bad: paginating far beyond first page
for (let page = 1; page <= 50; page++) {
  await fetch(`/cryptids/search?query=shadow&page=${page}`);
}

// ✅ Good: limit pagination or use more specific filters
const MAX_PAGES = 10;
for (let page = 1; page <= MAX_PAGES; page++) {
  await fetch(`/cryptids/search?query=shadow&page=${page}`);
}
```

### 5. Prefer Structured Filters

```typescript
// ❌ Bad: using search for everything
await fetch('/cryptids/search?query=cosmic');

// ✅ Good: use structured filters when possible
await fetch('/cryptids?classification=1'); // If "cosmic" = classification 1
```

---

## What Constitutes Search Abuse

Behaviors identified as abuse:

1. **Continuous automated requests** without debounce
2. **Minimal query changes** on each request (e.g., "a", "ab", "abc")
3. **Repeated deep pagination** (page > 10 multiple times)
4. **Dataset enumeration attempts** via search (e.g., "a*", "b*", "c*")
5. **Aggressive polling** of search (< 1 second between requests)

---

## Playground Integration

For playgrounds and interactive documentation:

### UI Recommendations

```html
<!-- Remaining requests counter -->
<div class="search-rate-limit">
  <span>Search: <strong id="remaining">15</strong> / 15 requests remaining</span>
  <span id="reset-timer"></span>
</div>

<!-- Disable when limit exhausted -->
<button id="searchBtn" disabled>
  Search (wait <span id="countdown">27</span>s)
</button>
```

### JavaScript Example

```javascript
let remaining = 15;
let resetTime = null;

async function executeSearch(query) {
  const response = await fetch(`/cryptids/search?query=${query}`);

  // Update counters
  remaining = parseInt(response.headers.get('x-ratelimit-remaining'));
  resetTime = parseInt(response.headers.get('x-ratelimit-reset')) * 1000;

  document.getElementById('remaining').textContent = remaining;

  if (remaining === 0) {
    // Disable button and show countdown
    const searchBtn = document.getElementById('searchBtn');
    searchBtn.disabled = true;

    startCountdown(resetTime);
  }

  return response.json();
}

function startCountdown(resetTime) {
  const interval = setInterval(() => {
    const now = Date.now();
    const secondsRemaining = Math.ceil((resetTime - now) / 1000);

    if (secondsRemaining <= 0) {
      clearInterval(interval);
      document.getElementById('searchBtn').disabled = false;
      remaining = 15; // Reset local counter
      document.getElementById('remaining').textContent = remaining;
    } else {
      document.getElementById('countdown').textContent = secondsRemaining;
    }
  }, 1000);
}
```

---

## Monitoring and Metrics

### Important Metrics

* **Search rate limit hit rate** - % of search requests that hit 429
* **Search violations per IP** - Violation distribution
* **Temporary blocks** - Number of temporary blocks applied
* **Average search latency** - Average latency (including artificial delays)

### Suggested Alerts

```typescript
// Alert if many IPs are being blocked
if (temporaryBlocksLast24h > 100) {
  alert('High number of search temporary blocks - investigate abuse patterns');
}

// Alert if 429 rate in search > 20%
if (searchRateLimitHitRate > 0.20) {
  alert('High search rate limit rejection rate - may need to increase limits or improve client behavior');
}
```

---

## Troubleshooting

### Problem: Constantly receiving SEARCH_RATE_LIMIT_EXCEEDED

**Possible causes**:

1. Insufficient debounce in search input
2. Multiple parallel search requests
3. Aggressive result pagination
4. Local cache disabled

**Solution**:

```typescript
// Implement debounce of at least 300ms
const debouncedSearch = debounce(searchFunction, 300);

// Avoid multiple simultaneous searches
let searchInProgress = false;
async function search(query) {
  if (searchInProgress) return;

  searchInProgress = true;
  try {
    await fetch(`/cryptids/search?query=${query}`);
  } finally {
    searchInProgress = false;
  }
}
```

---

### Problem: Temporary search block (3rd violation)

**Cause**: Multiple consecutive rate limit violations.

**Solution**:

1. Wait out the 10-minute block
2. Review debounce/throttling logic
3. Check for loops or aggressive polling
4. Implement local cache

---

### Problem: Missing X-RateLimit-Scope headers

**Possible causes**:

1. Endpoint is not search (scope not applied)
2. Proxy removing custom headers
3. CORS blocking header access

**Solution**:

```javascript
// Check if headers are accessible
if (request.url.includes('search')) {
  console.log('Scope:', response.headers.get('x-ratelimit-scope')); // "search"
}

// CORS: expose custom headers
app.register(cors, {
  exposedHeaders: ['X-RateLimit-Scope', 'X-RateLimit-Limit', 'X-RateLimit-Remaining']
});
```

---

## Comparison: Search vs. Global Rate Limit

| Aspect                 | Global Rate Limit    | Search Rate Limit             |
| ---------------------- | -------------------- | ----------------------------- |
| Limit (Public)         | 60/min               | 30/min                        |
| Limit (Playground)     | 30/min               | 15/min                        |
| Scope                  | global               | search                        |
| Error Code             | RATE_LIMIT_EXCEEDED  | SEARCH_RATE_LIMIT_EXCEEDED    |
| Header Scope           | -                    | `X-RateLimit-Scope: search`   |
| Progressive Throttling | ❌ No                | ✅ Yes (3 levels)             |
| Temporary Block        | ❌ No                | ✅ Yes (10 min after 3 violations) |
| Independent            | -                    | ✅ Yes                        |

---

## Executive Summary

✅ **More restrictive limits** - Search is more costly (30/min vs. 60/min)
✅ **Independent scope** - Search doesn't affect other endpoints
✅ **Specific error code** - `SEARCH_RATE_LIMIT_EXCEEDED`
✅ **Headers always present** - `X-RateLimit-Scope: search`
✅ **Progressive throttling** - 3 penalty levels
✅ **Temporary blocking** - 10min block after abuse
✅ **Soft warnings** - Alert when reaching 80% of limit
✅ **Observable** - Specific metrics and logs

Search rate limiting protects infrastructure without affecting other API endpoints!

---

## References

* [Rate Limit Configuration](../src/shared/config/rate-limit.config.ts)
* [Rate Limit Middleware](../src/shared/middlewares/rate-limit.middleware.ts)
* [Search Rate Limit Error](../src/shared/errors/api-error.ts#SearchRateLimitExceededError)
* [RATE_LIMITING.md](./RATE_LIMITING.md)
* [FILTERS.md](./FILTERS.md)
