# Tasks: BookLore 1.0 Release Readiness

**Input**: Design documents from `/specs/001-v1-release-readiness/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: No dedicated test-creation tasks are included because the specification did not request TDD. Validation tasks reference the quickstart scenarios and repo test commands.

**Organization**: Tasks are grouped by user story to preserve independent delivery and validation.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Introduce shared DTOs and frontend models used across multiple stories.

- [ ] T001 Create instance readiness DTO in `booklore-api/src/main/java/org/booklore/model/dto/InstanceReadinessStatus.java`
- [ ] T002 [P] Create operational health check DTO in `booklore-api/src/main/java/org/booklore/model/dto/OperationalHealthCheck.java`
- [ ] T003 [P] Create sync activity DTO in `booklore-api/src/main/java/org/booklore/model/dto/SyncActivityRecord.java`
- [ ] T004 [P] Create backup validation DTO in `booklore-api/src/main/java/org/booklore/model/dto/BackupValidationRecord.java`
- [ ] T005 [P] Create paged catalog response DTO in `booklore-api/src/main/java/org/booklore/model/dto/PagedResponse.java`
- [ ] T006 [P] Create shared frontend models in `booklore-ui/src/app/shared/models/system-status.model.ts` and `booklore-ui/src/app/shared/models/paged-response.model.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared plumbing that multiple stories depend on.

**⚠️ CRITICAL**: No user story work should start until this phase is complete.

- [ ] T007 Create aggregated status service skeleton in `booklore-api/src/main/java/org/booklore/service/system/SystemStatusService.java`
- [ ] T008 [P] Extend shared task DTO and WebSocket payload fields in `booklore-api/src/main/java/org/booklore/model/dto/TaskInfo.java`, `booklore-api/src/main/java/org/booklore/model/dto/TaskMessage.java`, and `booklore-api/src/main/java/org/booklore/model/websocket/TaskProgressPayload.java`
- [ ] T009 [P] Add shared settings shell integration points in `booklore-ui/src/app/features/settings/settings.component.ts` and `booklore-ui/src/app/features/settings/settings.component.html`
- [ ] T010 [P] Add release-readiness translation keys in `booklore-ui/src/i18n/en/shared.json`

**Checkpoint**: Shared DTOs, payloads, and settings-shell integration are ready.

---

## Phase 3: User Story 1 - Safer Day-One Setup and Operations (Priority: P1) 🎯 MVP

**Goal**: Surface first-run readiness, storage risk, and subsystem health in-product so admins can deploy safely.

**Independent Test**: Reset an instance, walk through setup, introduce a storage or health misconfiguration, and confirm the system-status UI reports actionable warnings and healthy recovery.

- [ ] T011 [US1] Implement system-status endpoint in `booklore-api/src/main/java/org/booklore/controller/SystemStatusController.java` and `booklore-api/src/main/java/org/booklore/service/system/SystemStatusService.java`
- [ ] T012 [P] [US1] Feed setup and liveness signals into readiness evaluation from `booklore-api/src/main/java/org/booklore/controller/SetupController.java`, `booklore-api/src/main/java/org/booklore/controller/HealthcheckController.java`, and `booklore-api/src/main/java/org/booklore/service/library/LibraryHealthService.java`
- [ ] T013 [P] [US1] Create settings-side status data service in `booklore-ui/src/app/features/settings/system-status/system-status.service.ts`
- [ ] T014 [US1] Create system-status UI in `booklore-ui/src/app/features/settings/system-status/system-status.component.ts`, `booklore-ui/src/app/features/settings/system-status/system-status.component.html`, and `booklore-ui/src/app/features/settings/system-status/system-status.component.scss`
- [ ] T015 [US1] Surface readiness warnings on the dashboard in `booklore-ui/src/app/features/dashboard/components/main-dashboard/main-dashboard.component.ts` and `booklore-ui/src/app/features/dashboard/components/main-dashboard/main-dashboard.component.html`
- [ ] T016 [US1] Validate setup and degraded-state scenarios from `specs/001-v1-release-readiness/quickstart.md`

**Checkpoint**: Admins can see instance readiness, degraded health, and remediation actions without external docs.

---

## Phase 4: User Story 2 - Faster Large-Library Browsing and Search (Priority: P1)

**Goal**: Keep browse, filter, and search responsive for large collections through paged server-side queries and deduplicated frontend state.

**Independent Test**: Load a representative large library, navigate the browse view, change filters and sorting repeatedly, and confirm results remain responsive without duplicate request bursts.

- [ ] T017 [US2] Implement paged and filtered book queries in `booklore-api/src/main/java/org/booklore/repository/BookRepository.java` and `booklore-api/src/main/java/org/booklore/service/book/BookQueryService.java`
- [ ] T018 [US2] Return paged catalog responses from `booklore-api/src/main/java/org/booklore/controller/BookController.java` and `booklore-api/src/main/java/org/booklore/controller/LibraryController.java`
- [ ] T019 [P] [US2] Refactor frontend catalog fetching to use paged responses in `booklore-ui/src/app/features/book/service/book.service.ts` and `booklore-ui/src/app/features/book/service/library.service.ts`
- [ ] T020 [P] [US2] Eliminate duplicate browse/filter requests in `booklore-ui/src/app/features/book/service/sort.service.ts`, `booklore-ui/src/app/features/book/components/book-browser/book-browser.component.ts`, and `booklore-ui/src/app/features/book/components/book-browser/book-filter/book-filter.component.ts`
- [ ] T021 [US2] Align catalog rendering with paged payloads in `booklore-ui/src/app/features/book/components/book-browser/book-table/book-table.component.ts` and `booklore-ui/src/app/features/book/components/book-browser/book-card/book-card.component.ts`
- [ ] T022 [US2] Validate large-library browse and search scenarios from `specs/001-v1-release-readiness/quickstart.md`

**Checkpoint**: Large-library browsing is paged, server-filtered, and does not rely on a single all-books fetch.

---

## Phase 5: User Story 3 - Recoverable Imports and Background Workflows (Priority: P2)

**Goal**: Make background task failure states visible and retryable without duplicate side effects.

**Independent Test**: Trigger an import or metadata failure, confirm the failure is visible with a clear reason, retry it from the UI, and verify no duplicate records or notifications are created.

- [ ] T023 [US3] Add retry-eligibility and failure metadata handling in `booklore-api/src/main/java/org/booklore/service/task/TaskService.java` and `booklore-api/src/main/java/org/booklore/service/task/TaskHistoryService.java`
- [ ] T024 [P] [US3] Expose task lifecycle and retry actions in `booklore-api/src/main/java/org/booklore/controller/TaskController.java` and `booklore-api/src/main/java/org/booklore/controller/MetadataTaskController.java`
- [ ] T025 [P] [US3] Update task-management data services in `booklore-ui/src/app/features/settings/task-management/task.service.ts` and `booklore-ui/src/app/features/settings/task-management/task-helper.service.ts`
- [ ] T026 [US3] Add failure visibility and retry controls in `booklore-ui/src/app/features/settings/task-management/task-management.component.ts`, `booklore-ui/src/app/features/settings/task-management/task-management.component.html`, and `booklore-ui/src/app/features/settings/task-management/task-management.component.scss`
- [ ] T027 [US3] Preserve idempotent retry behavior in `booklore-api/src/main/java/org/booklore/task/tasks/LibraryScanTask.java`, `booklore-api/src/main/java/org/booklore/task/tasks/BookdropPeriodicScanTask.java`, and `booklore-api/src/main/java/org/booklore/task/tasks/RefreshMetadataTask.java`
- [ ] T028 [US3] Validate recoverable task-failure scenarios from `specs/001-v1-release-readiness/quickstart.md`

**Checkpoint**: Task failures are visible, understandable, and safely retryable from the product.

---

## Phase 6: User Story 4 - Trustworthy Device and Reading Progress Sync (Priority: P2)

**Goal**: Make sync success, conflict resolution, and failures visible while preserving deterministic `last successful sync wins` behavior.

**Independent Test**: Generate reading-progress updates from multiple sources, confirm the chosen value follows the clarified rule, and verify the UI shows both the conflict and the kept result.

- [ ] T029 [US4] Persist and map sync conflict outcome details in `booklore-api/src/main/java/org/booklore/service/kobo/KoboReadingStateService.java`, `booklore-api/src/main/java/org/booklore/model/entity/UserBookProgressEntity.java`, and `booklore-api/src/main/java/org/booklore/model/entity/KoboReadingStateEntity.java`
- [ ] T030 [P] [US4] Expose sync status and conflict result payloads in `booklore-api/src/main/java/org/booklore/controller/KoboController.java`, `booklore-api/src/main/java/org/booklore/controller/KoreaderController.java`, and `booklore-api/src/main/java/org/booklore/controller/KoreaderUserController.java`
- [ ] T031 [P] [US4] Extend device-settings sync service state in `booklore-ui/src/app/features/settings/device-settings/component/kobo-sync-settings/kobo.service.ts`
- [ ] T032 [US4] Surface sync status, conflict visibility, and failure guidance in `booklore-ui/src/app/features/settings/device-settings/component/kobo-sync-settings/kobo-sync-settings-component.ts`, `booklore-ui/src/app/features/settings/device-settings/component/kobo-sync-settings/kobo-sync-settings-component.html`, `booklore-ui/src/app/features/settings/device-settings/component/kobo-sync-settings/kobo-sync-settings-component.scss`, and `booklore-ui/src/app/features/readers/ebook-reader/state/progress.service.ts`
- [ ] T033 [US4] Validate sync transparency scenarios from `specs/001-v1-release-readiness/quickstart.md`

**Checkpoint**: Sync behavior remains automatic, but conflict outcomes and failures are visible and understandable.

---

## Phase 7: User Story 5 - Backup and Upgrade Confidence (Priority: P3)

**Goal**: Provide backup-validation signals and upgrade guidance so admins can verify readiness before changing versions.

**Independent Test**: Produce backup artifacts, run the validation flow, restore into a clean environment, and confirm the restored instance still contains users, books, settings, and progress.

- [ ] T034 [US5] Implement backup validation aggregation in `booklore-api/src/main/java/org/booklore/service/system/BackupValidationService.java` and `booklore-api/src/main/java/org/booklore/model/dto/BackupValidationRecord.java`
- [ ] T035 [US5] Expose backup-validation and upgrade-readiness endpoints in `booklore-api/src/main/java/org/booklore/controller/SystemStatusController.java`
- [ ] T036 [P] [US5] Create backup validation UI in `booklore-ui/src/app/features/settings/backup-validation/backup-validation.component.ts`, `booklore-ui/src/app/features/settings/backup-validation/backup-validation.component.html`, and `booklore-ui/src/app/features/settings/backup-validation/backup-validation.component.scss`
- [ ] T037 [P] [US5] Document backup and upgrade workflow in `docs/upgrade-and-backup-validation.md`
- [ ] T038 [US5] Integrate backup validation entry points in `booklore-ui/src/app/features/settings/settings.component.ts` and `booklore-ui/src/app/features/settings/settings.component.html`
- [ ] T039 [US5] Validate backup and restore scenarios from `specs/001-v1-release-readiness/quickstart.md`

**Checkpoint**: Admins have a clear pre-flight backup validation flow before upgrades.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Finalize docs, localization, and end-to-end validation across all stories.

- [ ] T040 [P] Backfill release-readiness translation keys across locale files under `booklore-ui/src/i18n/`
- [ ] T041 [P] Update operator-facing release documentation in `README.md`, `docs/forward-auth-with-proxy.md`, and `example-podman/README.md`
- [ ] T042 Run backend and frontend validation commands referenced in `specs/001-v1-release-readiness/quickstart.md`
- [ ] T043 Run full quickstart scenario validation and record any follow-up changes in `specs/001-v1-release-readiness/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1: Setup**: Starts immediately.
- **Phase 2: Foundational**: Depends on Phase 1 and blocks all user stories.
- **Phase 3 (US1)** and **Phase 4 (US2)**: Both depend on Phase 2 and can proceed in parallel after foundational work is done.
- **Phase 5 (US3)**: Depends on Phase 2; benefits from US1 shell integration but remains independently testable.
- **Phase 6 (US4)**: Depends on Phase 2; can proceed independently of US3 once shared sync DTOs are in place.
- **Phase 7 (US5)**: Depends on Phase 2 and reuses `SystemStatusController` from US1 if implemented there.
- **Phase 8: Polish**: Depends on the stories you choose to ship in the 1.0 cut.

### User Story Dependencies

- **US1**: No dependency on other user stories.
- **US2**: No dependency on other user stories.
- **US3**: No hard dependency on other user stories; shares task DTO groundwork from Phase 2.
- **US4**: No hard dependency on other user stories; shares DTO groundwork from Phase 1.
- **US5**: Reuses status infrastructure from US1 when available, but its scope remains independently testable.

### Within Each User Story

- Backend contract/service changes before frontend integration.
- State/data service changes before component rendering changes.
- Validation task completes the story and serves as the independent test checkpoint.

## Parallel Opportunities

- **Setup**: T002-T006 can run in parallel after T001 begins.
- **Foundational**: T008-T010 can run in parallel after T007 is defined.
- **US1**: T012 and T013 can run in parallel after T011 starts.
- **US2**: T019 and T020 can run in parallel after T017-T018 establish the API shape.
- **US3**: T024 and T025 can run in parallel after T023 lands.
- **US4**: T030 and T031 can run in parallel after T029 defines the backend fields.
- **US5**: T036 and T037 can run in parallel after T034-T035 define the API and validation result.
- **Polish**: T040 and T041 can run in parallel before final validation.

## Parallel Example: User Story 1

```bash
# After T011 defines the endpoint shape:
T012 Extend setup and health signal sources
T013 Create frontend system-status service
```

## Parallel Example: User Story 2

```bash
# After T017-T018 define paged catalog responses:
T019 Refactor book and library services for paged responses
T020 Remove duplicate filter/sort requests in browse UI state
```

## Parallel Example: User Story 3

```bash
# After T023 adds retry metadata handling:
T024 Expose retry actions in task controllers
T025 Update task-management data services
```

## Parallel Example: User Story 4

```bash
# After T029 defines conflict outcome persistence:
T030 Expose sync/conflict payloads in sync controllers
T031 Extend Kobo sync frontend service state
```

## Parallel Example: User Story 5

```bash
# After T034-T035 define backup validation outputs:
T036 Build backup validation UI
T037 Document upgrade and backup workflow
```

## Implementation Strategy

### MVP First

1. Complete Phase 1 and Phase 2.
2. Deliver **US1** first to improve safety and operational confidence.
3. Deliver **US2** next so the 1.0 release is credible on large libraries.
4. Stop and validate before expanding to recovery/sync/backup work.

### Incremental Delivery

1. **MVP**: US1
2. **Release-critical scale improvement**: US2
3. **Operational recovery**: US3
4. **Sync trust**: US4
5. **Upgrade confidence**: US5

### Suggested 1.0 Cut Order

1. Phase 1 + Phase 2
2. US1
3. US2
4. US3
5. US4
6. US5
7. Phase 8 polish
