# Contract: Catalog Search and Browse

## Purpose

Define the browse/search API semantics needed to support large libraries efficiently.

## Request Parameters

- `page`: 0-based page number
- `size`: page size, capped by backend limits
- `sort`: whitelisted sort key and direction
- `query`: free-text search term
- `libraryId`: optional library scope
- `shelfId`: optional shelf scope
- `authorId`: optional author scope
- `seriesId`: optional series scope
- additional filter parameters only if explicitly whitelisted

## Response Shape

```json
{
  "items": [],
  "page": 0,
  "size": 25,
  "totalItems": 0,
  "totalPages": 0,
  "sort": "updatedAt,desc",
  "appliedFilters": {
    "query": "dune"
  }
}
```

## Rules

- Server-side pagination is mandatory for large-library views.
- Sort keys must be whitelisted and documented.
- Filters must compose predictably with text search.
- Responses should contain only fields required by the target view; avoid full-detail payloads for collection listings.
- Frontend state transitions for the same effective query must not trigger duplicate requests.

## Performance Baseline

- For representative 10,000+ item libraries, 95% of catalog loads, filter changes, and searches should complete within 2 seconds on supported self-hosted hardware.
