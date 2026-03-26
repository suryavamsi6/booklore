# Quickstart: BookLore 1.0 Release Readiness

## Purpose

Validate the planned 1.0 release improvements against the existing BookLore development environment.

## Prerequisites

- Docker / Docker Compose available
- Java and Node toolchains compatible with the repo
- MariaDB provided by the dev compose stack
- A representative test library, ideally including a larger dataset for browse/search validation

## Start the dev stack

From the repository root:

```bash
docker compose -f dev.docker-compose.yml up
```

Expected services:
- Frontend: `http://localhost:4200`
- Backend: `http://localhost:6060`
- MariaDB: `localhost:3366`
- Debug: `localhost:5005`

## Backend validation commands

From `booklore-api/`:

```bash
./gradlew test
./gradlew build -x test
```

For focused work during implementation:

```bash
./gradlew test --tests "org.booklore.service.book.BookServiceTest"
./gradlew test --tests "org.booklore.service.kobo.KoboReadingStateServiceTest"
```

## Frontend validation commands

From `booklore-ui/`:

```bash
npm run lint
npm run test -- --run
npm run build
```

## Scenario Validation

### 1. First-run readiness and system status

1. Start with a fresh environment or reset state.
2. Open the application and verify setup status is surfaced.
3. Intentionally misconfigure a known setting (for example, storage mode/path expectations) and verify a warning appears with a next action.
4. Restore a healthy configuration and confirm status becomes healthy again.

### 2. Large-library browse and search

1. Load a representative large library.
2. Open the primary browse view.
3. Apply common filters and sort changes repeatedly.
4. Run title/author/series searches.
5. Confirm the UI remains responsive and duplicate requests are not emitted for the same state transitions.

### 3. Background task recoverability

1. Trigger an import or metadata task.
2. Force a recoverable failure (for example, dependency outage or invalid path input in a controlled environment).
3. Verify the failed task is visible with human-readable status.
4. Retry it and confirm it does not create duplicate content or duplicate notifications.

### 4. Sync transparency

1. Connect a supported sync client (Kobo / KOReader / supported reader workflow).
2. Generate reading-progress changes from two sources close together.
3. Confirm the chosen result follows `last successful sync wins`.
4. Confirm the conflict is visible to the user/admin.

### 5. Backup and upgrade confidence

1. Produce the documented backup artifacts for database and app data.
2. Run the backup validation flow.
3. Restore into a clean environment.
4. Confirm users, settings, books, and reading progress remain available.

## Exit Criteria

The plan is considered validated when:
- Backend tests pass
- Frontend lint, tests, and build pass
- All five scenario groups can be executed with clear expected outcomes
- No story requires a constitution exception to proceed
