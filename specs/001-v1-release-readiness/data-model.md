# Data Model: BookLore 1.0 Release Readiness

## 1. Instance Readiness Status

Represents whether a fresh or existing installation is operationally ready for normal use.

### Fields
- `installationId`: stable installation identifier
- `setupComplete`: boolean
- `adminProvisioned`: boolean
- `storageMode`: enum (`LOCAL`, `NETWORK`)
- `storageRiskLevel`: enum (`NONE`, `WARNING`, `BLOCKING`)
- `databaseReachable`: boolean
- `backgroundProcessingHealthy`: boolean
- `librariesHealthy`: boolean
- `activeWarnings`: list of warning codes/messages
- `recommendedActions`: ordered list of next-step actions
- `evaluatedAt`: timestamp

### Relationships
- Aggregates data from installation, app settings, health checks, and library health.
- Feeds the system-status UI and first-run readiness flow.

### Validation Rules
- `setupComplete` cannot be true unless `adminProvisioned` is true.
- `storageRiskLevel` must reflect the selected `storageMode` and detected filesystem constraints.
- `recommendedActions` must be empty when no blocking or warning condition exists.

### State Transitions
- `UNINITIALIZED` → `SETUP_INCOMPLETE`
- `SETUP_INCOMPLETE` → `READY_WITH_WARNINGS`
- `READY_WITH_WARNINGS` → `READY`
- Any state → `DEGRADED` when health checks fail

## 2. Operational Health Check

Represents a user-visible health summary for core subsystems.

### Fields
- `component`: enum (`API`, `DATABASE`, `LIBRARY_STORAGE`, `BOOKDROP`, `TASKS`, `SYNC`)
- `status`: enum (`HEALTHY`, `WARNING`, `UNHEALTHY`)
- `summary`: short human-readable description
- `details`: optional longer explanation
- `nextAction`: optional remediation guidance
- `updatedAt`: timestamp

### Relationships
- One instance readiness status contains many operational health checks.
- Health checks may be broadcast via WebSocket or fetched by REST.

### Validation Rules
- `summary` must be human-readable and non-empty.
- `nextAction` is required when `status` is `WARNING` or `UNHEALTHY`.

## 3. Background Task Record

Represents a trackable unit of work for import, metadata, or cleanup operations.

### Fields
- `taskId`: unique string identifier
- `taskType`: enum / task name
- `status`: enum (`ACCEPTED`, `RUNNING`, `COMPLETED`, `FAILED`, `CANCELLED`)
- `progressPercentage`: integer 0-100
- `message`: current status message
- `failureReason`: optional error summary
- `retryEligible`: boolean
- `retryCount`: integer
- `lastAttemptAt`: timestamp
- `completedAt`: optional timestamp
- `requestedByUserId`: user identifier
- `options`: structured task options payload

### Relationships
- Linked to imports, metadata fetches, or cleanup operations.
- Broadcast to frontend task/status views.

### Validation Rules
- `retryCount` increments only on explicit retry.
- `retryEligible` is false for non-recoverable failures or completed tasks.
- `completedAt` is required for terminal states.

### State Transitions
- `ACCEPTED` → `RUNNING`
- `RUNNING` → `COMPLETED`
- `RUNNING` → `FAILED`
- `RUNNING` → `CANCELLED`
- `FAILED` → `ACCEPTED` on retry (new attempt of same logical task)

## 4. Sync Activity Record

Represents a reading-progress or device sync event.

### Fields
- `source`: enum (`WEB_READER`, `KOBO`, `KOREADER`, `OPDS_CLIENT`, `HARDCOVER`)
- `userId`: user identifier
- `bookId`: book identifier
- `deviceId`: optional device/client identifier
- `resultingProgress`: normalized reading progress value
- `syncOutcome`: enum (`SUCCESS`, `FAILED`, `CONFLICT_RESOLVED`)
- `conflictDetected`: boolean
- `conflictResolutionRule`: enum (`LAST_SUCCESSFUL_SYNC_WINS`)
- `keptValueSummary`: optional description of selected value
- `failureReason`: optional message
- `syncedAt`: timestamp

### Relationships
- Associated with canonical user/book progress state and device-specific reading state.
- Feeds device status and sync history UI.

### Validation Rules
- `keptValueSummary` is required when `conflictDetected` is true.
- `failureReason` is required when `syncOutcome` is `FAILED`.
- `conflictResolutionRule` must always be `LAST_SUCCESSFUL_SYNC_WINS` for 1.0.

### State Transitions
- `PENDING` (implicit transport phase) → `SUCCESS`
- `PENDING` → `FAILED`
- `PENDING` → `CONFLICT_RESOLVED`

## 5. Backup Validation Record

Represents evidence that an admin has a plausible backup before upgrade.

### Fields
- `validatedAt`: timestamp
- `backupType`: enum (`DATABASE_DUMP`, `VOLUME_SNAPSHOT`, `PVC_SNAPSHOT`, `MANUAL_FILE_COPY`)
- `databaseBackupPresent`: boolean
- `appDataBackupPresent`: boolean
- `libraryDataBackupPresent`: boolean
- `bookdropBackupPresent`: boolean
- `bookCountSnapshot`: integer
- `userCountSnapshot`: integer
- `latestSyncTimestamp`: optional timestamp
- `validationStatus`: enum (`VALID`, `INCOMPLETE`, `STALE`, `UNKNOWN`)
- `notes`: optional human-readable notes

### Relationships
- Used by upgrade guidance and pre-flight validation.
- Derived from current instance state and admin-supplied backup evidence.

### Validation Rules
- `validationStatus = VALID` requires database backup plus required configuration/app data backup.
- `bookCountSnapshot` and `userCountSnapshot` must be non-negative.
- `notes` should explain why validation is not `VALID`.

### State Transitions
- `UNKNOWN` → `INCOMPLETE`
- `INCOMPLETE` → `VALID`
- `VALID` → `STALE` when age threshold or state drift is exceeded

## Existing Domain Entities Touched

The 1.0 release readiness feature is expected to extend or aggregate these existing entities rather than replacing them:

- `AppSettingEntity`
- `UserBookProgressEntity`
- `UserBookFileProgressEntity`
- `KoboReadingStateEntity`
- `KoreaderUserEntity`
- task history persistence entities and task status enums
- library entities and health payloads

## Persistence Notes

- Not every model above requires a new table. Several are candidate DTOs or aggregated read models built from existing entities and service state.
- Any new persistence required for auditability or validation must use new Flyway migrations only.
