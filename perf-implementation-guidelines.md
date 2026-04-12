# Performance Optimization Implementation Guidelines

## Objective
Implement the performance improvements identified in the code review, verify them locally, commit the work in logical slices, push the branch to `origin`, and open a pull request targeting `develop`.

## Git Target
- Base branch: `origin/develop`
- Working branch: `perf/book-browser-and-api-optimizations`
- Push remote: `origin`
- PR base: `develop`

## Important Context
- Do not use the current branch `fix/master-pipeline-ui-build` for this work.
- Start from a fresh branch cut from `origin/develop`.
- Preserve existing compatibility for non-browser consumers where possible.
- Migrate browser filters and facets server-side so pagination remains correct.
- Prefer the smallest correct changes, but complete the work end-to-end.

## Branch Setup
Run these commands from `D:\booklore`:

```powershell
git fetch origin
git switch develop
git pull --ff-only origin develop
git switch -c perf/book-browser-and-api-optimizations
```

## Primary Workstreams

### 1. Server-Backed Browser Query Layer
Add a dedicated backend contract for the Angular book browser.

Implement:
- `POST /api/v1/books/query`
- `POST /api/v1/books/facets`

Support these scopes:
- all books
- library
- shelf
- unshelved
- magic shelf

Support these inputs:
- `page`
- `size`
- primary sort
- active filters
- filter mode
- search text
- scope identifier such as `libraryId`, `shelfId`, or `magicShelfId`

Return:
- paged books
- total count
- current page metadata
- facet counts derived from the current scope and active filters

Implementation guidance:
- Reuse existing paged catalog support where possible.
- Add missing paged support for shelf, unshelved, and magic shelf routes.
- Stop relying on heavy full-catalog fetches for browser screens.
- Prefer lighter list-screen query shapes instead of loading large full entity graphs.
- If query performance needs database help, add Flyway migrations for indexes.

### 2. Angular Book Browser Migration
Replace the current full-catalog browser flow with paged state.

Current issue:
- `booklore-ui/src/app/features/book/service/book.service.ts` hydrates the browser from unbounded `GET /api/v1/books`.
- The browser then filters and sorts in memory.

Target state:
- A dedicated paged browser service/store drives screen state.
- Route params and query params define scope, page, sort, search, and filters.
- The browser fetches only the current page.
- Facets come from the backend instead of repeated client-side recomputation.

Update these browser scopes:
- all books
- library books
- shelf books
- unshelved books
- magic shelf books

Implementation guidance:
- Keep selection, route reuse, and scroll restoration working.
- Do not depend on global full-catalog state for list screens anymore.
- Preserve behavior correctness before chasing secondary cleanup.

### 3. Frontend Render Hot-Path Cleanup
Reduce Angular change-detection and template overhead in the browser UI.

Focus files include:
- `booklore-ui/src/app/features/book/components/book-browser/book-browser.component.ts`
- `booklore-ui/src/app/features/book/components/book-browser/book-table/book-table.component.ts`
- related browser card and table templates

Do this:
- Convert hot browser components to `ChangeDetectionStrategy.OnPush` where safe.
- Remove repeated template computations.
- Replace per-cell and per-card template methods with precomputed row/card view models.
- Remove `books.indexOf(book)` and similar repeated list scans from templates.
- Remove `.bind(this)` usage from templates or event setup.
- Fix the leaking resize listener in `BookTableComponent`.
- Reduce or eliminate direct DOM mutation for virtual scroller sizing.

### 4. Deduplicate User Hydration And Trim Startup Cost
Reduce repeated `/me` requests and unnecessary startup work.

Do this:
- Centralize current-user loading in `UserService`.
- Make startup and reader flows use cached/shared user state.
- Remove duplicate `getMyself()` calls during normal navigation.
- Lazy-load `BookBrowserComponent` and `MainDashboardComponent`.
- If feasible without destabilizing the app, move chart setup closer to the screens that need it.

### 5. Backend Heavy-Path Optimizations
Address confirmed backend hotspots.

Komga:
- Replace in-memory book pagination with repository-backed pagination.

Recommendations:
- Reduce request-path full-catalog similarity work.
- Narrow candidate sets or move heavy recomputation to cached/background paths.

Websocket targeting:
- Replace full user DTO loading with a lighter recipient lookup.

Readers:
- Reduce repeated PDF and EPUB heavy work.
- Reuse metadata caches.
- Prefer leaner response shapes where possible.

### 6. Background Scanning And Monitoring Cleanup
Reduce avoidable filesystem traversal and polling overhead.

Do this:
- Collapse duplicate `Files.walk(...)` passes.
- Reuse folder-analysis results instead of rewalking the same folder.
- Reduce duplicate bookdrop rescans.
- Review library health polling and avoid unnecessary repeated checks when safe.

## Testing Requirements

### Backend
Run from `D:\booklore\booklore-api`:

```powershell
.\gradlew.bat test --no-daemon --parallel --build-cache
```

Add or update focused tests for:
- browser query and facet services
- paged controller behavior
- shelf paging
- unshelved paging
- magic shelf paging
- Komga pagination
- recommendation behavior
- websocket recipient resolution
- PDF reader behavior
- EPUB reader behavior
- monitoring and bookdrop flows

### Frontend
Run from `D:\booklore\booklore-ui`:

```powershell
npm ci
npm audit --audit-level=high
npm ls --depth=0
npx ng test
npx ng build
```

Add or update focused tests for:
- paged browser state/service logic
- route and query-param state synchronization
- server-backed facet handling
- user caching logic
- extracted row/card view-model behavior

### Manual Smoke Testing
Verify these flows after automated tests pass:
- all books
- library books
- shelf books
- magic shelf books
- unshelved books
- dashboard
- stats pages
- PDF reader
- EPUB reader
- Komga books listing
- recommendations
- selection behavior
- route reuse and scroll restoration

## Acceptance Criteria
- The browser no longer loads the entire catalog on first load.
- Browser filters and facets are server-backed and correct for all scopes.
- Grid and table rendering avoid repeated hot-path template work.
- `/api/v1/users/me` is not redundantly fetched during normal navigation.
- Komga book listing scales with page size instead of total catalog size.
- PDF and EPUB repeated heavy reads are reduced.
- Monitoring and bookdrop scanning avoid unnecessary repeated tree walks.
- Backend tests pass locally.
- Frontend tests pass locally.
- Frontend build passes locally.

## Commit Guidance
Use logical commits. Recommended sequence:

1. `feat(api): add paged browser query and facet endpoints`
2. `perf(ui): move book browser to paged state and remove render hot paths`
3. `perf(ui): dedupe user hydration and lazy-load heavy routes`
4. `perf(api): optimize komga, readers, recommendations, and monitoring`
5. `test: cover paged browser and performance-sensitive flows`

If the actual implementation groups differ, keep commit messages aligned to the completed logical slices.

## Push And PR Workflow
After implementation and local verification, run from `D:\booklore`:

```powershell
git status
git add .
git commit -m "feat(api): add paged browser query and facet endpoints"
git commit -m "perf(ui): move book browser to paged state and remove render hot paths"
git commit -m "perf(ui): dedupe user hydration and lazy-load heavy routes"
git commit -m "perf(api): optimize komga, readers, recommendations, and monitoring"
git commit -m "test: cover paged browser and performance-sensitive flows"
git push -u origin perf/book-browser-and-api-optimizations
gh pr create --base develop --head perf/book-browser-and-api-optimizations --title "perf: move book browser to paged queries and optimize heavy paths"
```

Do not push directly to `develop`.

## PR Summary Template
Use this structure when creating the PR body:

```md
## Summary
- move the Angular book browser from full-catalog loading to server-backed paged queries and facets
- reduce frontend render hot-path work and duplicate user hydration
- optimize heavy backend paths including Komga pagination, recommendations, readers, and monitoring

## Testing
- backend: `.\gradlew.bat test --no-daemon --parallel --build-cache`
- frontend: `npm ci`
- frontend: `npm audit --audit-level=high`
- frontend: `npm ls --depth=0`
- frontend: `npx ng test`
- frontend: `npx ng build`
- manual smoke tests across browser scopes, readers, dashboard, stats, and Komga flows
```

## Notes For The Implementing Agent
- Build context before editing; do not guess architecture details.
- Prefer minimal correct changes over broad rewrites.
- Do not revert unrelated user changes in the worktree.
- Use the repo's existing patterns unless a clear performance fix requires a change in approach.
- Keep compatibility endpoints intact unless there is a specific reason to remove them.
- If one PR becomes too risky, finish the highest-value safe slice first and surface the split recommendation explicitly.
