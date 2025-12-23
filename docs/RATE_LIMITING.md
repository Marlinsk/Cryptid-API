# Rate Limiting & Throttling - Cryptids API

This document describes the **Rate Limiting and Throttling system** of the Cryptids API.

---

## Rate Limiting Objectives

The rate limiting system aims to:

* **Protect infrastructure** → Prevent overload and ensure availability
* **Prevent abuse** → Avoid aggressive scraping and malicious use
* **Ensure fairness** → Resources shared equitably among consumers
* **Protect costly resources** → Limit search, aggregations, and image processing
* **Provide clear feedback** → Client knows when and how to try again

---

## Limiting Model

### Limit Type

The Cryptids API uses **sliding window rate limiting** with scope by:

* **Client IP** (default)
* **API key** (when applicable - future)
* **Endpoint group** (different limits per resource type)

### Time Window

All windows are **60 seconds (1 minute)** by default.

---

## Default Limits

### Global Limit

Applied to all endpoints, regardless of type.

| Plan             | Requests | Window     | Description                    |
| ---------------- | -------- | ---------- | ------------------------------ |
| Public (default) | 60       | per minute | Default plan for public use    |
| Playground       | 30       | per minute | Plan for testing and playgrounds |
| Internal / Admin | 10000    | per minute | No-limit plan (internal use)   |

---

### Limits by Endpoint

Different endpoints have different limits based on computational cost.

| Endpoint Group            | Limit   | Window | Description                          |
| ------------------------- | ------- | ------ | ------------------------------------ |
| Listing (`/cryptids`)     | 60/min  | 60s    | List cryptids with filters           |
| Detail (`/cryptids/:id`)  | 120/min | 60s    | Cryptid details (less costly)        |
| Search (`/search`)        | 30/min  | 60s    | Text search (more costly)            |
| Images (`/images`)        | 20/min  | 60s    | Media resources (bandwidth)          |

**Note**: The **most restrictive** limit is applied when multiple scopes overlap.

---

## Rate Limit Headers

**All responses** (success and error) include rate limit headers.

| Header                  | Type   | Description                                  | Example      |
| ----------------------- | ------ | -------------------------------------------- | ------------ |
| `X-RateLimit-Limit`     | number | Maximum window limit                         | `60`         |
| `X-RateLimit-Remaining` | number | Remaining requests in current window         | `42`         |
| `X-RateLimit-Reset`     | number | UNIX timestamp when counter resets           | `1736701200` |
| `Retry-After`           | number | Seconds until can make new request (429)     | `18`         |

### Success Headers Example

```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 42
X-RateLimit-Reset: 1736701200
Content-Type: application/json

{
  "data": [...]
}
```

### Limit Exceeded Headers Example

```http
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1736701200
Retry-After: 18
Content-Type: application/json

{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please retry after the specified interval.",
    "details": {
      "limit": 60,
      "window": "60s",
      "retryAfter": 18
    },
    "requestId": "req_abc123",
    "timestamp": "2025-01-12T14:33:21Z"
  }
}
```

---

## Response When Limit Exceeded (429)

### HTTP Status

```
429 Too Many Requests
```

### Error Response Body

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please retry after the specified interval.",
    "details": {
      "limit": 60,
      "window": "60s",
      "retryAfter": 18,
      "scope": "search"
    },
    "requestId": "req_91afc2",
    "timestamp": "2025-01-12T14:33:21Z"
  }
}
```

### Error Details Fields

| Field        | Type   | Description                              |
| ------------ | ------ | ---------------------------------------- |
| `limit`      | number | Maximum request limit                    |
| `window`     | string | Time window description                  |
| `retryAfter` | number | Seconds until can try again              |
| `scope`      | string | Applied rate limit scope (optional)      |

---

## Rate Limit by Scope

### Available Scopes

| Scope      | Description                            | Example                    |
| ---------- | -------------------------------------- | -------------------------- |
| `global`   | All API requests                       | General 60/min limit       |
| `endpoint` | By endpoint group                      | /cryptids vs /cryptids/:id |
| `search`   | Search endpoints (more costly)         | /cryptids/search           |
| `media`    | Heavy content (images, downloads)      | /cryptids/:id/images       |

### Example Scope in Error

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please retry after the specified interval.",
    "details": {
      "limit": 30,
      "window": "60s",
      "retryAfter": 25,
      "scope": "search"
    },
    "requestId": "req_xyz789",
    "timestamp": "2025-01-12T14:35:10Z"
  }
}
```

---

## Soft Throttle (Warning)

When the client approaches the limit (>80% of limit consumed), a warning header is sent.

### Warning Header

```http
X-RateLimit-Warning: Approaching rate limit
```

### Response Example with Warning

```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 8
X-RateLimit-Reset: 1736701200
X-RateLimit-Warning: Approaching rate limit
Content-Type: application/json
```

**Recommendation**: Clients should slow down requests when receiving this header.

---

## IP Whitelist

Some IPs can be **whitelisted** and don't suffer rate limiting:

* `127.0.0.1` (localhost)
* `::1` (localhost IPv6)
* Configured internal IPs

**Note**: Whitelisting is configured on the server and is not publicly available.

---

## Practical Examples

### 1. Normal Request (Within Limit)

**Request:**
```bash
GET /cryptids?page=1&limit=20
```

**Response (200):**
```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 42
X-RateLimit-Reset: 1736701200

{
  "data": [...],
  "meta": {...},
  "links": {...}
}
```

---

### 2. Request Near Limit (Warning)

**Request:**
```bash
GET /cryptids?page=2&limit=20
```

**Response (200 with Warning):**
```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 8
X-RateLimit-Reset: 1736701200
X-RateLimit-Warning: Approaching rate limit

{
  "data": [...],
  "meta": {...},
  "links": {...}
}
```

---

### 3. Request Exceeding Limit

**Request:**
```bash
GET /cryptids/search?query=shadow
```

**Response (429):**
```http
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1736701225
Retry-After: 25

{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please retry after the specified interval.",
    "details": {
      "limit": 30,
      "window": "60s",
      "retryAfter": 25,
      "scope": "search"
    },
    "requestId": "req_abc123",
    "timestamp": "2025-01-12T14:33:21Z"
  }
}
```

---

## Best Practices for Clients

### 1. Respect Rate Limit Headers

```typescript
// Check headers before making next request
const remaining = parseInt(response.headers['x-ratelimit-remaining']);
const limit = parseInt(response.headers['x-ratelimit-limit']);

if (remaining < limit * 0.2) {
  console.warn('Approaching rate limit. Slowing down...');
  await delay(1000); // Wait 1 second
}
```

### 2. Implement Retry with Backoff

```typescript
async function fetchWithRetry(url: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);

      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('retry-after') || '60');
        console.log(`Rate limited. Retrying after ${retryAfter}s...`);
        await delay(retryAfter * 1000);
        continue;
      }

      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await delay(Math.pow(2, i) * 1000); // Exponential backoff
    }
  }
}
```

### 3. Local Cache

```typescript
// Cache responses to avoid unnecessary requests
const cache = new Map();

async function getCryptid(id: string) {
  if (cache.has(id)) {
    return cache.get(id);
  }

  const response = await fetch(`/cryptids/${id}`);
  const data = await response.json();

  cache.set(id, data);
  return data;
}
```

### 4. Batch Requests

```typescript
// Instead of multiple requests, use filters
// ❌ Bad: 10 separate requests
for (const id of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
  await fetch(`/cryptids/${id}`);
}

// ✅ Good: 1 request with pagination
await fetch('/cryptids?page=1&limit=10');
```

### 5. Avoid Aggressive Polling

```typescript
// ❌ Bad: polling every second
setInterval(() => fetch('/cryptids'), 1000);

// ✅ Good: polling every 30-60 seconds
setInterval(() => fetch('/cryptids'), 30000);

// ✅ Better: use WebSockets or Server-Sent Events (when available)
```

---

## Monitoring and Observability

### Rate Limit Event Logging

When a client exceeds the limit, the event is logged:

```json
{
  "event": "rate_limit_exceeded",
  "clientIp": "192.168.1.100",
  "endpoint": "/cryptids/search",
  "limit": 30,
  "window": "60s",
  "requestId": "req_abc123",
  "timestamp": "2025-01-12T14:33:21Z"
}
```

### Metrics

Useful metrics for monitoring:

* **429s rate** → Percentage of blocked requests
* **Unique blocked clients** → Number of unique IPs that exceeded limit
* **Most limited endpoints** → Which endpoints have most 429s
* **Retry success rate** → Percentage of clients that return after 429

### Alerts

Create alerts for:

```typescript
// Alert if 429 rate is too high
if (rate429 > 10%) {
  alert('High rate limit rejection rate - may need to increase limits');
}

// Alert if many clients are being blocked
if (uniqueBlockedIps > 100) {
  alert('Many unique IPs being rate limited - possible attack or misconfigured clients');
}
```

---

## Evolution and Extensibility

### Future Improvements

The rate limiting system was designed to support:

#### 1. API Keys

```typescript
// Rate limit based on API key instead of IP
const apiKey = request.headers['x-api-key'];
const key = generateRateLimitKey(apiKey, endpoint);
```

#### 2. Custom Plans

```typescript
// Different limits per plan
const plans = {
  free: { max: 30, window: '60s' },
  basic: { max: 100, window: '60s' },
  pro: { max: 1000, window: '60s' },
};
```

#### 3. Burst Control

```typescript
// Allow temporary traffic spikes
{
  max: 60,
  timeWindow: 60000,
  allowBurst: true,
  burstMax: 100, // Allow up to 100 requests in burst
}
```

#### 4. RFC 9333 Headers

```http
RateLimit-Limit: 60
RateLimit-Remaining: 42
RateLimit-Reset: 18
```

#### 5. Redis Backend

```typescript
// Replace in-memory store with Redis
import Redis from 'ioredis';
const redis = new Redis();

class RedisRateLimitStore {
  async increment(key: string, timeWindow: number) {
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, Math.ceil(timeWindow / 1000));
    }
    return count;
  }
}
```

---

## Tool Compatibility

### Postman / Insomnia

Rate limit headers are automatically displayed:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 42
X-RateLimit-Reset: 1736701200
```

### cURL

```bash
# View rate limit headers
curl -I https://api.cryptids.com/cryptids

# Output:
# X-RateLimit-Limit: 60
# X-RateLimit-Remaining: 42
# X-RateLimit-Reset: 1736701200
```

### SDKs

SDKs can use headers to implement automatic retry:

```typescript
// SDK example
class CryptidsClient {
  async request(url: string) {
    const response = await fetch(url);

    if (response.status === 429) {
      const retryAfter = response.headers.get('retry-after');
      await this.sleep(parseInt(retryAfter) * 1000);
      return this.request(url); // Retry
    }

    return response;
  }
}
```

---

## Troubleshooting

### Problem: Receiving 429 very frequently

**Possible causes:**

1. **Too aggressive polling** → Increase interval between requests
2. **Multiple client instances** → Share cache between instances
3. **Unnecessary requests** → Implement local cache
4. **Too frequent search** → Use debounce on search inputs

**Solution:**

```typescript
// Implement debounce for search
import { debounce } from 'lodash';

const debouncedSearch = debounce(async (query) => {
  await fetch(`/cryptids/search?query=${query}`);
}, 300); // Wait 300ms after last keystroke
```

---

### Problem: X-RateLimit-Remaining always 0

**Possible causes:**

1. **Shared IP** → Multiple users behind same NAT
2. **Proxy/CDN** → Check X-Forwarded-For header
3. **Stale cache** → Wait for window reset

**Solution:**

```bash
# Check which IP the server is seeing
curl https://api.cryptids.com/cryptids -v 2>&1 | grep X-RateLimit

# Wait for reset
# X-RateLimit-Reset: 1736701200
# Current time: 1736701180
# Wait: 20 seconds
```

---

### Problem: Missing rate limit headers

**Possible causes:**

1. **Proxy removing headers** → Check proxy configuration
2. **CORS** → Headers may be blocked by CORS policy
3. **Whitelisted IP** → Headers may not be added for whitelist

**Solution:**

```javascript
// Check if headers are accessible
fetch('/cryptids')
  .then(response => {
    console.log('Rate Limit:', response.headers.get('x-ratelimit-limit'));
    console.log('Remaining:', response.headers.get('x-ratelimit-remaining'));
  });
```

---

## References

* [Rate Limit Configuration](../src/shared/config/rate-limit.config.ts)
* [Rate Limit Middleware](../src/shared/middlewares/rate-limit.middleware.ts)
* [Rate Limit Error](../src/shared/errors/api-error.ts#RateLimitExceededError)
* [ERROR_HANDLING.md](./ERROR_HANDLING.md)

---

## Executive Summary

✅ **Clear and documented limits** - Clients know exactly what to expect
✅ **Headers always present** - Real-time feedback on limit
✅ **Stable error code** - `RATE_LIMIT_EXCEEDED` is public contract
✅ **Retry-After header** - Client knows exactly when to try again
✅ **Specific scopes** - Different limits for different resources
✅ **Soft warnings** - Client is warned before reaching limit
✅ **Extensible** - Supports API keys, custom plans, and burst control
✅ **Observable** - Metrics and logs for monitoring

Rate limiting is implemented following all API contract principles!
