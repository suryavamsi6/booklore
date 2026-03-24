# BookLore – Copilot Instructions

BookLore is a self-hosted digital library platform (books, comics, audiobooks) with multi-user support, built-in readers, metadata enrichment, and e-reader device sync (Kobo, KOReader).

When multiple correct implementations are possible, prefer the one that reduces steady-state CPU and memory usage **without** regressing latency, throughput, or UI responsiveness.

---

## Architecture

**Two main services:**

- **`booklore-api/`** – Spring Boot 4.0.3 (Java 25) REST API + WebSocket server
- **`booklore-ui/`** – Angular 21 SPA, served from the same Docker container

The backend serves the compiled Angular app as static files. In development they run separately (ports 6060 and 4200).

**Request flow:** Angular → HttpClient interceptors (JWT injection) → Spring REST controllers → Services → JPA repositories → MariaDB. Real-time updates flow via STOMP WebSocket (`/ws`).

**Key backend packages** (`src/main/java/org/booklore/`):
- `controller/` – REST endpoints (55+ controllers)
- `service/` – Business logic, organized by domain (`book/`, `metadata/`, `user/`, etc.)
- `model/entity/` – JPA entities (use `*Entity` suffix)
- `model/dto/` – API DTOs (no suffix; e.g., `BookEntity` → `Book`)
- `mapper/` – MapStruct entity↔DTO mappers
- `exception/` – `ApiError` enum drives all error responses
- `task/` + `crons/` – Async tasks and scheduled jobs
- `config/` – Spring Security, WebSocket, cache, CORS config

---

## Build & Test Commands

### Backend (Gradle, run from `booklore-api/`)

```bash
./gradlew bootRun                                        # Dev server on :6060
./gradlew test                                           # All tests
./gradlew test --tests "org.booklore.service.book.BookServiceTest"          # Single class
./gradlew test --tests "org.booklore.service.book.BookServiceTest.myMethod" # Single method
./gradlew build -x test                                  # Build JAR without tests
./gradlew clean build                                    # Full build + tests
```

### Frontend (npm, run from `booklore-ui/`)

```bash
npm run dev           # Dev server on :4200 (proxy to API at :6060)
npm test              # Vitest (watch mode)
npm run test -- --run # Vitest single run (CI mode)
npm run test -- --run --reporter=verbose --testPathPattern="book.service" # Single spec
npm run build         # Production build → dist/booklore/
npm run lint          # ESLint check
```

### Full dev stack (Docker)

```bash
docker compose -f dev.docker-compose.yml up   # Frontend :4200, Backend :6060, MariaDB :3366, debug :5005
```

---

## Key Conventions

### Resource Efficiency

- Favor changes that remove duplicate work, repeated serialization/deserialization, unnecessary polling, over-fetching, or short-lived object churn rather than trading CPU for memory or vice versa.
- Backend read paths should stay lean: prefer pagination, projections, focused DTOs, and explicit fetch strategies over loading large entity graphs or whole collections that the response does not need.
- Watch for Hibernate N+1 query patterns before adding caches. Fix inefficient access patterns at the repository/service level first; use Caffeine only for clearly hot, repeat-read data with straightforward invalidation.
- Reuse existing async, task, cron, and WebSocket infrastructure. Do not introduce high-frequency polling loops or extra background jobs when the same behavior can be event-driven.
- For file import, metadata extraction, and reader flows, prefer streaming/chunked processing and bounded buffers over loading large files or archives fully into memory.
- In Angular, avoid duplicate subscriptions and repeated API calls for the same screen state. Share RxJS streams when appropriate, and avoid expensive sorting/filtering/transformation work in template execution paths.
- Be conservative with per-request allocations in hot paths and with large in-memory caches of per-user or one-off data. Optimize data access shape first, then cache only when measurements justify it.

### Backend

- **Dependency injection:** Always constructor injection via Lombok `@AllArgsConstructor`. Never `@Autowired`.
- **Logging:** Always `@Slf4j` from Lombok. Never instantiate `LoggerFactory` manually.
- **Error handling:** Use the `ApiError` enum — `ApiError.SOME_ERROR.createException(...)`. No raw exceptions.
- **Authorization:** Use `@PreAuthorize("@securityUtil.isAdmin()")` for admin checks; use `@CheckBookAccess` for book-level multi-user access control. Never use `@Secured` or `@RolesAllowed`.
- **Transactions:** Annotate service methods with `@Transactional`; add `readOnly = true` for read-only operations.
- **Mapping:** Use MapStruct mappers, never map manually inline.
- **Queries:** Spring Data JPA + JPQL. Avoid native SQL unless necessary (discuss first).
- **Java style:** Use Java 25 features — records, sealed classes, pattern matching, text blocks. Always use imports (no inline fully-qualified names).

### Database Migrations (Flyway)

Migrations live in `booklore-api/src/main/resources/db/migration/`, named `V<N>__Description.sql`.

- **Never modify an existing migration.** Always create a new `V<N+1>__...sql` file.
- Guard DDL statements: `CREATE TABLE IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`, etc.
- Current highest migration: `V129__Add_sort_order_to_author_mapping.sql`.

### Frontend

- **Standalone components only** — no NgModules.
- **Inject with `inject()`** function, not constructor injection.
- **State:** RxJS `BehaviorSubject` / `Observable` — no NgRx or other state libraries.
- **Styling:** SCSS only. PrimeNG components + PrimeIcons. Component-scoped styles in the component file; globals in `src/styles.scss`.
- **Selectors:** Components use `app-` prefix (kebab-case); directives use `app` attribute prefix (camelCase).
- **HTTP:** All API calls go through `HttpClient` services in `shared/services/`. JWT is injected by an interceptor — don't add auth headers manually.
- **WebSocket:** Use `RxStompService` (`shared/websocket/`) for real-time subscriptions.
- **i18n:** Use Transloco (`translocoService` / `transloco` pipe). Don't hardcode user-visible strings.
- **ESLint rule:** `@typescript-eslint/no-explicit-any` is an error — always type things properly.

### Testing

- **Backend:** JUnit 5 + Mockito + AssertJ. Unit tests use `@ExtendWith(MockitoExtension.class)`. Integration tests use `@SpringBootTest` with H2 in-memory DB.
- **Frontend:** Vitest + jsdom. Test files are `*.spec.ts` co-located with source.

---

## Auth Model

Three supported auth modes (configured via environment variables):
1. **Local** – Username/password stored in DB, JWT issued by BookLore.
2. **OIDC** – OAuth2/OIDC provider (e.g., Authentik, Keycloak). Configured via `OIDC_*` env vars.
3. **Remote/Header auth** – Reverse proxy passes user identity via headers (`REMOTE_AUTH_ENABLED=true`).

JWT tokens are stored in browser `localStorage` (`access_token`, `refresh_token`). The Angular HTTP interceptor attaches them as `Bearer` tokens.

---

## Configuration

Backend config is in `booklore-api/src/main/resources/application.yaml`. Key environment variable overrides:

| Variable | Default | Purpose |
|---|---|---|
| `DATABASE_URL` | `jdbc:mariadb://mariadb:3306/booklore` | DB connection |
| `DATABASE_USERNAME` / `DATABASE_PASSWORD` | — | DB credentials |
| `BOOKLORE_PORT` | `6060` | HTTP port |
| `ALLOWED_ORIGINS` | `*` | CORS origins |
| `DISK_TYPE` | `LOCAL` | `NETWORK` disables local file ops |
| `REMOTE_AUTH_ENABLED` | `false` | Header-based auth for reverse proxies |

Data directories inside the container: `/app/data` (config), `/books` (library), `/bookdrop` (auto-import).

---

## Contribution Rules (from CONTRIBUTING.md)

- **Branch from `develop`**, not `master`. Use prefixes: `feat/`, `fix/`, `refactor/`, `docs/`.
- **Open a GitHub issue and get approval before starting** non-trivial work.
- PRs should be small and focused (target < ~1000 changed lines).
- All CI checks must pass: backend tests, frontend tests + lint, Flyway migration check.
- Include screenshots or video for any UI changes.
- `master` is the release branch — merging triggers automatic semantic versioning and Docker image publishing.
