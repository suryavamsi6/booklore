# Implementation Plan: BookLore 1.0 Release Readiness

**Branch**: `001-v1-release-readiness` | **Date**: 2026-03-24 | **Spec**: [spec.md](d:\booklore\specs\001-v1-release-readiness\spec.md)
**Input**: Feature specification from `/specs/001-v1-release-readiness/spec.md`

## Summary

Ship a credible BookLore 1.0 release by improving operational safety, large-library responsiveness, background-task recoverability, sync transparency, and backup/upgrade confidence without introducing major new platform surfaces. The implementation will extend existing setup, health, task, sync, and catalog flows rather than replacing them, with the primary technical strategy being: add observable system-status surfaces, move high-volume browse/search work toward server-side pagination and filtered queries, formalize retryable task lifecycle behavior, expose sync conflict outcomes, and document/validate upgrade safety.

## Technical Context

**Language/Version**: Java 25 (backend), TypeScript with Angular 21 (frontend)  
**Primary Dependencies**: Spring Boot 4.0.3, Spring Data JPA, Lombok, MapStruct, RxJS, PrimeNG, Transloco, RxStomp  
**Storage**: MariaDB 11.4, Flyway migrations, filesystem-backed libraries/bookdrop/app data  
**Testing**: JUnit 5 + Mockito + AssertJ, Spring Boot integration tests with H2, Vitest + jsdom, ESLint  
**Target Platform**: Self-hosted Linux containers, including Raspberry Pi-class hardware; browser clients; Kobo/KOReader/OPDS-compatible sync clients  
**Project Type**: Web application with Spring Boot API/WebSocket backend and Angular SPA frontend  
**Performance Goals**: Keep 95% of catalog loads/filter changes/searches under 2 seconds for 10,000+ items; avoid duplicate HTTP requests and unnecessary repeated work; keep system-status and task-status views lightweight  
**Constraints**: Must preserve current auth modes; must follow Flyway immutability; must use Transloco for new copy; must stay releasable in small PRs against `develop`; must not regress responsiveness on low-resource hosts  
**Scale/Scope**: Broad 1.0 polish/reliability initiative touching setup/status, catalog browse/search, task orchestration, sync transparency, and backup/upgrade guidance across `booklore-api/`, `booklore-ui/`, and docs

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Resource Efficiency First**: PASS. Plan emphasizes server-side query shaping, request deduplication, reuse of existing task/WebSocket infrastructure, and bounded observability surfaces instead of polling or heavy caches.
- **Convention-Driven Backend**: PASS. Design assumes Spring service/controller changes will keep Lombok constructor injection, `@Slf4j`, `ApiError`, MapStruct, transactional services, JPQL, and Java 25 features.
- **Standalone Angular Components**: PASS. Any new UI surfaces remain under existing Angular feature/services architecture with `inject()`, RxJS state, PrimeNG, and Transloco.
- **Schema Safety (Flyway)**: PASS. Any persistence additions for status/task/sync audit use new guarded migrations only when necessary.
- **Test Discipline**: PASS. Plan includes backend integration/unit coverage plus frontend tests/lint for new stateful UI flows.
- **Branch and Release Hygiene**: PASS. Scope is explicitly partitioned into small, focused deliverables for `develop`.
- **Security by Convention**: PASS. Setup/status/admin surfaces continue to use the current auth and access-control model.

**Post-Design Re-check**: PASS. The proposed data model and contract set extend existing systems rather than creating constitution-violating patterns.

## Project Structure

### Documentation (this feature)

```text
specs/001-v1-release-readiness/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── backup-validation.md
│   ├── catalog-search.md
│   ├── sync-conflict-resolution.md
│   ├── system-status.md
│   └── task-lifecycle.md
└── tasks.md
```

### Source Code (repository root)

```text
booklore-api/
├── src/main/java/org/booklore/controller/
├── src/main/java/org/booklore/service/
├── src/main/java/org/booklore/model/entity/
├── src/main/java/org/booklore/model/dto/
├── src/main/java/org/booklore/model/websocket/
├── src/main/java/org/booklore/repository/
├── src/main/resources/db/migration/
└── src/test/java/org/booklore/

booklore-ui/
├── src/app/features/book/
├── src/app/features/dashboard/
├── src/app/features/metadata/
├── src/app/features/readers/
├── src/app/features/settings/
├── src/app/shared/services/
└── src/i18n/

docs/
example-chart/
example-docker/
example-podman/
```

**Structure Decision**: Use the existing two-service BookLore structure. Backend work centers on controllers/services/entities/repositories and WebSocket payloads inside `booklore-api/`; frontend work centers on existing feature modules/services inside `booklore-ui/`; operational guidance and upgrade flows live in `docs/` and deployment examples.

## Phase 0: Research Conclusions

- Extend existing `SetupController`, `HealthcheckController`, and `LibraryHealthService` into a richer system-status surface instead of building a new admin subsystem.
- Improve catalog performance by formalizing pagination/filter/sort contracts and moving expensive filtering/sorting out of the client when collection size grows.
- Build retryable task behavior on top of `TaskService` and `TaskHistoryService`; do not introduce a separate queueing platform for 1.0.
- Keep sync conflict policy simple and deterministic: last successful sync wins, with visible conflict reporting.
- Treat backup/upgrade confidence as validation and guidance built around existing external backup practices, not as a new full backup engine.

## Phase 1: Design Direction

### Story-to-System Mapping

- **US1 Safer Day-One Setup and Operations**
  - Backend: `SetupController`, `HealthcheckController`, `AppSettingService`, `LibraryHealthService`, possibly new status DTOs and aggregated service
  - Frontend: dashboard/settings surfaces and health subscriptions
- **US2 Faster Large-Library Browsing and Search**
  - Backend: `BookController`, `LibraryController`, `BookService`, `BookQueryService`, repository query shaping/projections
  - Frontend: `features/book/service/book.service.ts`, `library.service.ts`, sort/filter state and browse UI
- **US3 Recoverable Imports and Background Workflows**
  - Backend: `TaskService`, `TaskHistoryService`, `MetadataTaskController`, import/metadata task classes, task WebSocket payloads
  - Frontend: metadata/task state services and status UI
- **US4 Trustworthy Device and Reading Progress Sync**
  - Backend: `KoboReadingStateService`, `KoboLibrarySyncService`, KOReader/Kobo controllers, progress entities
  - Frontend: reader/progress/device status surfaces
- **US5 Backup and Upgrade Confidence**
  - Backend/docs: Flyway migration process, installation metadata, backup validation service/docs, upgrade guidance surfaces

### Delivery Strategy

Break implementation into focused PR groups:
1. System status + first-run readiness
2. Catalog/search performance contract and query reshaping
3. Task lifecycle and retry visibility
4. Sync conflict visibility and device status
5. Backup validation + upgrade guidance

## Complexity Tracking

No constitution violations identified. This plan intentionally avoids introducing a new event bus, external queue, plugin framework, or new client platform for 1.0.
