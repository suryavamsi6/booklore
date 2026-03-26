# Contract: System Status

## Purpose

Define the user-visible operational status surface for setup readiness and ongoing instance health.

## Consumers

- Admin system-status UI
- First-run readiness flow
- Potential WebSocket subscribers for live health changes

## Response Shape

```json
{
  "setupComplete": true,
  "adminProvisioned": true,
  "storageMode": "LOCAL",
  "overallStatus": "HEALTHY",
  "checks": [
    {
      "component": "DATABASE",
      "status": "HEALTHY",
      "summary": "Database reachable",
      "details": null,
      "nextAction": null,
      "updatedAt": "2026-03-24T12:00:00Z"
    }
  ],
  "warnings": [],
  "recommendedActions": [],
  "evaluatedAt": "2026-03-24T12:00:00Z"
}
```

## Rules

- `overallStatus` values: `HEALTHY`, `WARNING`, `UNHEALTHY`
- Required health components for 1.0:
  - `API`
  - `DATABASE`
  - `LIBRARY_STORAGE`
  - `BOOKDROP`
  - `TASKS`
  - `SYNC`
- Any `WARNING` or `UNHEALTHY` check must include a plain-language `nextAction`.
- Storage warnings must reflect the configured `DISK_TYPE` and observed filesystem constraints.
- The system-status contract extends current health checks; it does not replace the simple liveness healthcheck endpoint.

## Failure Semantics

- Partial subsystem failure still returns the status payload when the API is reachable.
- If the API itself is not reachable, callers fall back to existing service liveness checks.
