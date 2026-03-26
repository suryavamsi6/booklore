<!--
  Sync Impact Report
  Version change: N/A → 1.0.0 (initial adoption)
  Added sections:
    - Core Principles (7 principles)
    - Technology Stack
    - Development Workflow
    - Governance
  Templates requiring updates:
    - .specify/templates/plan-template.md — ✅ no updates needed (Constitution Check section is generic)
    - .specify/templates/spec-template.md — ✅ no updates needed
    - .specify/templates/tasks-template.md — ✅ no updates needed
  Follow-up TODOs: none
-->

# BookLore Constitution

## Core Principles

### I. Resource Efficiency First

When multiple correct implementations exist, prefer the one that reduces
steady-state CPU and memory usage without regressing latency, throughput,
or UI responsiveness. All changes MUST:

- Remove duplicate work, repeated serialization, unnecessary polling, and
  over-fetching before introducing caches or new abstractions.
- Prefer pagination, projections, focused DTOs, and explicit fetch
  strategies over loading large entity graphs.
- Fix Hibernate N+1 patterns at the repository/service level before
  reaching for Caffeine. Cache only clearly hot, repeat-read data with
  straightforward invalidation.
- Prefer streaming/chunked processing and bounded buffers for file
  import, metadata extraction, and reader flows.
- In Angular, share RxJS streams to avoid duplicate subscriptions and
  repeated API calls for the same screen state. Never perform expensive
  sorting/filtering/transformation in template execution paths.

**Rationale**: BookLore runs on user-owned hardware (including Raspberry
Pi). Every wasted cycle or byte directly degrades the user experience.

### II. Convention-Driven Backend

All backend Java code MUST follow these non-negotiable patterns:

- Constructor injection via Lombok `@AllArgsConstructor`. Never
  `@Autowired`.
- Logging via Lombok `@Slf4j`. Never manual `LoggerFactory`.
- Errors via `ApiError` enum — `ApiError.X.createException(...)`. No raw
  exceptions in service/controller code.
- Authorization via `@PreAuthorize("@securityUtil.isAdmin()")` or
  `@CheckBookAccess`. Never `@Secured` or `@RolesAllowed`.
- Service methods annotated `@Transactional`; add `readOnly = true` for
  read-only operations.
- Entity↔DTO mapping via MapStruct mappers. Never manual inline mapping.
- Spring Data JPA + JPQL for queries. Native SQL only when justified and
  discussed first.
- Use Java 25 features: records, sealed classes, pattern matching, text
  blocks. Always use imports (no fully-qualified inline names).

**Rationale**: Uniform conventions eliminate entire categories of code
review friction and prevent inconsistent error surfaces.

### III. Standalone Angular Components

All frontend code MUST follow these non-negotiable patterns:

- Standalone components only — no NgModules.
- Dependency injection via `inject()` function, not constructor
  injection.
- State via RxJS `BehaviorSubject` / `Observable`. No NgRx or other
  state libraries.
- Styling via SCSS, using PrimeNG components + PrimeIcons. Component-
  scoped styles in the component file; globals in `src/styles.scss`.
- Component selectors use `app-` prefix (kebab-case); directive
  selectors use `app` attribute prefix (camelCase).
- All API calls go through `HttpClient` services in `shared/services/`.
  JWT is injected by interceptor — never add auth headers manually.
- All user-visible strings via Transloco. No hardcoded strings.
- `@typescript-eslint/no-explicit-any` is an error. Always type
  properly.

**Rationale**: Consistency across 55+ controllers and their
corresponding UI components is maintained only through strict, testable
conventions.

### IV. Schema Safety (Flyway Migrations)

Database schema changes MUST follow these rules:

- Never modify an existing migration file. Always create a new
  `V<N+1>__Description.sql`.
- Guard all DDL statements: `CREATE TABLE IF NOT EXISTS`,
  `ADD COLUMN IF NOT EXISTS`, etc.
- Migration files live in
  `booklore-api/src/main/resources/db/migration/`.

**Rationale**: Users self-host with real data. A broken migration can
destroy a library that took years to build. There is no rollback in
production for end users.

### V. Test Discipline

- Backend: JUnit 5 + Mockito + AssertJ. Unit tests use
  `@ExtendWith(MockitoExtension.class)`. Integration tests use
  `@SpringBootTest` with H2.
- Frontend: Vitest + jsdom. Test files are `*.spec.ts` co-located with
  source.
- All CI checks MUST pass before merge: backend tests, frontend tests +
  lint, Flyway migration validation.

**Rationale**: The project ships as a single Docker image to
self-hosters. There is no staged rollout — every merge to `master`
becomes a release. Tests are the only safety net.

### VI. Branch and Release Hygiene

- All work MUST branch from `develop`, not `master`. Use prefixes:
  `feat/`, `fix/`, `refactor/`, `docs/`.
- PRs MUST be small and focused (target < ~1000 changed lines).
- `master` is the release branch. Merging to `master` triggers
  automatic semantic versioning and Docker image publishing.
- PRs MUST include screenshots or video for any UI changes.

**Rationale**: Semantic versioning is fully automated from PR labels.
Discipline in branching and PR scope ensures each release is
predictable and auditable.

### VII. Security by Convention

- Use the existing auth model (Local JWT, OIDC, or Remote/Header auth)
  for all new endpoints. Never bypass the security filter chain.
- Validate at system boundaries (user input, external APIs) only. Trust
  internal code and framework guarantees.
- Never expose raw stack traces or internal error details to API
  consumers. The `ApiError` enum provides safe, controlled error
  responses.
- Follow OWASP Top 10 guidance: no injection vulnerabilities, no broken
  access control, no cryptographic failures.

**Rationale**: BookLore is network-exposed by design (web UI, OPDS,
device sync). Every endpoint is an attack surface.

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Backend | Spring Boot | 4.0.3 |
| Language | Java | 25 |
| Frontend | Angular | 21 |
| Database | MariaDB | 11.4 |
| Build (BE) | Gradle | 9.3.1 |
| Build (FE) | npm / Node | 24 |
| Container | Docker (multi-arch) | linux/amd64 + linux/arm64 |
| Registry | GHCR | ghcr.io/suryavamsi6/booklore |
| Migrations | Flyway | — |
| Testing (BE) | JUnit 5 + Mockito + AssertJ | — |
| Testing (FE) | Vitest + jsdom | — |
| i18n | Transloco | — |
| UI Library | PrimeNG + PrimeIcons | — |
| WebSocket | STOMP via RxStomp | — |
| Mapping | MapStruct | — |

## Development Workflow

1. **Issue first, PR second.** Every PR MUST be linked to an approved
   issue. PRs without a linked issue will be closed.
2. **Branch from `develop`.** Use conventional prefixes (`feat/`,
   `fix/`, `refactor/`, `docs/`).
3. **Run the full stack locally** (backend + frontend + database) and
   verify changes work before opening a PR.
4. **All CI gates MUST pass**: backend tests, frontend tests + lint,
   Flyway migration check.
5. **Include visual proof** (screenshots or screen recording) for any
   UI changes.
6. **Merge to `master`** triggers automatic semantic versioning (via PR
   labels: `bump:major`, `bump:minor`, `bump:patch`) and Docker image
   publishing to GHCR.
7. **Dev stack**: `docker compose -f dev.docker-compose.yml up` provides
   Frontend :4200, Backend :6060, MariaDB :3366, debug :5005.

## Governance

This constitution supersedes all ad-hoc practices. All PRs and code
reviews MUST verify compliance with these principles.

**Amendment procedure:**
1. Open an issue describing the proposed change and its rationale.
2. Update this document via PR to `develop`.
3. Increment the version using semantic versioning:
   - MAJOR: Principle removal or backward-incompatible redefinition.
   - MINOR: New principle or materially expanded guidance.
   - PATCH: Clarifications, wording fixes, non-semantic refinements.
4. Update `LAST_AMENDED_DATE` to the date the amendment merges.

**Compliance review:** Any PR that introduces a new pattern not covered
by these principles MUST document the deviation and justification in the
PR description. Unjustified deviations are grounds for closing the PR.

Refer to `.github/copilot-instructions.md` for runtime development
guidance and detailed convention examples.

**Version**: 1.0.0 | **Ratified**: 2026-03-24 | **Last Amended**: 2026-03-24
