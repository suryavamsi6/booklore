# Research: BookLore 1.0 Release Readiness

## Decision 1: System status extends existing setup and health flows

- Decision: Build 1.0 operational readiness on top of the existing `SetupController`, `HealthcheckController`, `LibraryHealthService`, and app settings infrastructure, with a new aggregated system-status surface rather than a separate admin subsystem.
- Rationale: The repo already has setup status, basic healthcheck, library accessibility checks, app settings storage, and WebSocket health broadcasts. Extending those surfaces keeps the implementation aligned with the constitution’s preference for reuse and low overhead.
- Alternatives considered:
  - Build a separate admin observability subsystem: rejected because it duplicates existing health and setup capabilities.
  - Use only docs for setup guidance: rejected because the spec requires in-product visibility and next actions.

## Decision 2: Large-library performance should be solved by server-side query shaping first

- Decision: Prioritize pagination, filter/sort contract formalization, focused DTO/query shaping, and frontend request deduplication before considering caching.
- Rationale: Current catalog flows already use REST services and Angular state management, but exploration showed all-books fetch and client-side sort/filter patterns that do not scale well to 10,000+ items. The constitution explicitly requires fixing access shape before adding caches.
- Alternatives considered:
  - Add broad caching to existing all-books endpoints: rejected because it preserves over-fetching and risks stale per-user state.
  - Keep client-side filtering and only tune Angular rendering: rejected because the main cost is request/data shape, not just DOM work.

## Decision 3: Task recoverability should build on `TaskService` and `TaskHistoryService`

- Decision: Model retryability, task-state visibility, and manual recovery through the existing task registry/history system, with explicit retry semantics and UI exposure.
- Rationale: The backend already persists task history, tracks status/progress, and broadcasts task progress. Reusing that infrastructure keeps the operational model simple for a single-instance self-hosted deployment.
- Alternatives considered:
  - Introduce a new external work queue: rejected because it increases operational complexity and is disproportionate for 1.0.
  - Leave retry behavior implicit and manual-only without contract changes: rejected because the spec requires diagnosable and recoverable failures.

## Decision 4: Sync conflict handling remains deterministic and low-friction

- Decision: Resolve reading-progress conflicts by keeping the most recently successful sync result and expose the conflict outcome to users/admins.
- Rationale: This matches the explicit clarification in the spec and keeps sync behavior deterministic, explainable, and low-friction for 1.0.
- Alternatives considered:
  - Highest-progress-wins: rejected because it can override intentional regressions or restarts of a book.
  - Manual conflict resolution: rejected because it adds too much friction to normal sync flows.
  - Source-priority rules: rejected because they are harder to explain across browser, Kobo, and KOReader.

## Decision 5: Backup and upgrade confidence should be validation and guidance, not a new backup engine

- Decision: Treat backup/upgrade work as pre-flight validation, operational status, and admin guidance around external backups (database dump, volume snapshot, PVC snapshot), rather than building a fully managed in-app backup system.
- Rationale: The codebase already relies on Flyway migrations, filesystem-backed libraries, and deployment-specific storage. An in-app backup engine would be high-risk and broad for a 1.0 release.
- Alternatives considered:
  - Build one-click full backup/restore in the application: rejected as too broad and operationally risky for this release.
  - Rely purely on docs with no validation surface: rejected because the spec requires confidence and validation before upgrade.

## Decision 6: Contracts should be documented explicitly for 1.0-critical interfaces

- Decision: Create contract docs for system status, catalog search, task lifecycle, sync conflict resolution, and backup validation.
- Rationale: These are the cross-cutting interfaces most likely to affect multiple stories and teams during implementation. Making them explicit reduces ambiguity before task generation.
- Alternatives considered:
  - Skip contracts because the product is internal: rejected because BookLore exposes external REST/UI/WebSocket behavior to end users and self-hosting admins.
  - Write only tasks with no contracts: rejected because planning would remain ambiguous on key request/response and state semantics.
