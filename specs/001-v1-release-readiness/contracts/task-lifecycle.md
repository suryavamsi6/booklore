# Contract: Task Lifecycle

## Purpose

Define the lifecycle, visibility, and retry semantics for long-running work such as imports and metadata jobs.

## States

- `ACCEPTED`
- `RUNNING`
- `COMPLETED`
- `FAILED`
- `CANCELLED`

## Task Record Shape

```json
{
  "taskId": "task-123",
  "taskType": "REFRESH_METADATA",
  "status": "FAILED",
  "progressPercentage": 35,
  "message": "Metadata provider unavailable",
  "failureReason": "Provider timeout",
  "retryEligible": true,
  "retryCount": 1,
  "lastAttemptAt": "2026-03-24T12:00:00Z",
  "completedAt": "2026-03-24T12:05:00Z"
}
```

## Rules

- Every terminal task state must be persisted in task history.
- `retryEligible` must be explicit.
- Retrying a failed task creates a new attempt of the same logical task without duplicating resulting library data.
- WebSocket progress updates remain the primary live-update mechanism; polling is a fallback only when real-time transport is unavailable.
- Automatic background retries are out of scope for 1.0 unless explicitly added later; 1.0 requires manual recoverability and clear visibility.

## Idempotency Expectations

- Retrying import or metadata work must not create duplicate books, duplicate metadata rows, or duplicate user-facing notifications.
