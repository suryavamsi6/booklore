# Contract: Sync Conflict Resolution

## Purpose

Define how BookLore resolves reading-progress conflicts across browser, Kobo, KOReader, and other supported sync sources for 1.0.

## Rule

`LAST_SUCCESSFUL_SYNC_WINS`

When multiple sources update the same book within a short period, the system keeps the most recently successful sync result automatically.

## Conflict Result Shape

```json
{
  "bookId": 42,
  "userId": 7,
  "source": "KOBO",
  "syncOutcome": "CONFLICT_RESOLVED",
  "conflictDetected": true,
  "conflictResolutionRule": "LAST_SUCCESSFUL_SYNC_WINS",
  "keptValueSummary": "KOBO progress at 74% kept over web reader progress at 68%",
  "syncedAt": "2026-03-24T12:00:00Z"
}
```

## Rules

- Conflict resolution is automatic for 1.0.
- The user/admin must be able to see that a conflict occurred and which value was kept.
- Manual conflict-resolution UI is out of scope for 1.0.
- Source-specific priority rules are out of scope for 1.0.
- Failure cases must remain visible with a recommended next action where possible.
