# First-Party Laravel Package Recommendations
## ZKTeco Attendance & HR Management System

> **Assessed against:** Laravel 12 · Inertia v2 · Vue 3 · 2,521+ employees · SQLite (dev) / MySQL (prod)

---

## Already Installed

| Package | Version | Role |
|---|---|---|
| `laravel/fortify` | v1.34 | Headless authentication (login, 2FA, password reset) |
| `laravel/wayfinder` | v0.1 | Type-safe TypeScript route generation from controllers |
| `laravel/pint` | v1.27 | PHP code style formatter (PSR-12) |
| `laravel/pail` | v1.2 | Real-time log tailing in the terminal |
| `laravel/sail` | v1.53 | Docker development environment |
| `laravel/prompts` | v0.3 | Beautiful CLI prompts for Artisan commands |
| `laravel/boost` | v2.1 | MCP server for AI-assisted development |
| `laravel/mcp` | v0.5 | Model Context Protocol server support |

---

## Recommended Additions

### 1. Laravel Scout — `laravel/scout`
**Priority: HIGH**

**What it does:** Adds full-text search to Eloquent models via a `Searchable` trait. Automatically keeps indexes in sync as records are created/updated/deleted. Ships with a built-in `database` engine (no external service needed) and supports Algolia, Meilisearch, and Typesense for advanced needs.

**Why this application needs it:**
- The Nominal Roll currently loads all 2,521 employees and filters in-memory or via simple `LIKE` queries. Scout's database engine with full-text indexes will make employee search significantly faster and more relevant.
- The same search pattern recurs across Leave Applications, Documents, Contracts, Transfers, and Resignations — Scout unifies all of these.
- When switching from SQLite (dev) to MySQL (prod), Scout's `SearchUsingFullText` attribute automatically uses MySQL's native `MATCH(...) AGAINST(...)` with relevance ranking.

**Models to make searchable:**
```php
// Employee — search by name, department, position, location, unit
// HrProfile — search by payroll ID, job grade, division
// LeaveApplication — search by employee name, leave type, status
// Contract — search by employee, contract type, status
// PerformanceReview — search by employee, cycle, status
```

**Effort to add:** Low — `composer require laravel/scout`, add `Searchable` trait and `toSearchableArray()` to models, set `SCOUT_DRIVER=database` in `.env`.

---

### 2. Laravel Reverb — `laravel/reverb`
**Priority: HIGH**

**What it does:** A first-party WebSocket server for Laravel. Powers real-time bi-directional communication using the Pusher protocol. Pairs with Laravel Echo on the frontend.

**Why this application needs it:**
- Leave approvals, performance review status changes, and appraisal submissions all currently require the employee to refresh the page to see updates. Real-time notifications would significantly improve the workflow.
- The HR department manages 2,521 employees — when a bulk appraisal is sent, managers need to be notified without polling.
- Specific use cases:
  - **Leave:** Employee submits → line manager gets a notification badge instantly.
  - **Performance:** Admin sends appraisal → employee's dashboard lights up with a task.
  - **Attendance:** Missed check-in alerts pushed to HR in real time.
  - **Transfers/Resignations:** Status change notifications for approvers.

**Frontend pairing:** `@laravel/echo-vue` (official Vue 3 composable) integrates cleanly with the existing Inertia + Vue 3 setup.

**Infrastructure note:** Reverb runs as a separate long-lived process (`php artisan reverb:start`) alongside the main app. Can be monitored via Laravel Pulse integration (see below).

**Effort to add:** Medium — `php artisan install:broadcasting`, configure Echo in `bootstrap.js`, implement broadcast events per module.

---

### 3. Laravel Horizon — `laravel/horizon`
**Priority: HIGH**

**What it does:** A dashboard and code-driven configuration for Redis-powered queues. Provides real-time monitoring of job throughput, runtime, failures, and worker balancing.

**Why this application needs it:**
- The application already has `jobs`, `failed_jobs`, and `job_batches` tables — queue infrastructure is ready but invisible. There is no way to see if email notifications (performance review reminders, leave approval emails) are processing or silently failing.
- `app/Mail/` directory exists with mailers — these are already queued operations with no monitoring.
- A bulk appraisal send (`bulkStore()`) dispatches jobs for 2,521 employees — without Horizon, there is no visibility into how many have been sent, how many failed, and how long each took.
- Horizon's `auto` balancing strategy will automatically scale workers during bulk operations (e.g., year-end appraisal sends) and scale back during quiet periods.

**Prerequisite:** Requires switching from the `database` queue driver to `redis`. Redis is already available via Sail.

**Effort to add:** Medium — `composer require laravel/horizon`, `php artisan horizon:install`, configure `config/horizon.php` with queue supervisors, switch `QUEUE_CONNECTION=redis`.

---

### 4. Laravel Pulse — `laravel/pulse`
**Priority: MEDIUM-HIGH**

**What it does:** A real-time application performance dashboard built into Laravel. Monitors slow queries, slow requests, job failures, exception rates, server CPU/memory, cache hit rates, and queue throughput — all in one built-in dashboard at `/pulse`.

**Why this application needs it:**
- With 2,521 employees and `attendance_logs` growing daily (multiple check-in/out events per employee per day = potentially 5,000–15,000 rows/day), N+1 query risks and slow endpoints will emerge over time. Pulse's **slow query recorder** will surface these automatically.
- The performance review system issues bulk database writes — Pulse's **slow job recorder** will catch any that take too long.
- The **exceptions recorder** means backend errors (like the `sort_order` migration bug found during testing) are surfaced with context rather than buried in logs.
- HR admins can see **most active users** and **slowest pages** to understand usage patterns.
- Integrates natively with Reverb to display WebSocket connection and message metrics on the same dashboard.

**Key recorders for this app:**
- `SlowQueries` — catch N+1 in Nominal Roll, performance report aggregations
- `SlowJobs` — catch stuck email/notification jobs
- `Exceptions` — catch backend errors in production
- `Servers` — monitor CPU/memory on the production server
- `Queues` — see queue backlog in real time

**Effort to add:** Low — `php artisan install:pulse`, publish config, add `<livewire:pulse />` to a dashboard view, run `php artisan pulse:check` as a daemon.

---

### 5. Laravel Telescope — `laravel/telescope`
**Priority: MEDIUM (development only)**

**What it does:** A debug assistant for the local development environment. Watches requests, exceptions, log entries, database queries, queued jobs, mail, notifications, cache, scheduled tasks, and more.

**Why this application needs it:**
- Complex multi-table queries (performance report aggregations, nominal roll with HR profiles) need query inspection during development. Telescope's **query watcher** shows every SQL query with its bindings, execution time, and the controller that triggered it.
- The **mail watcher** lets developers preview queued emails (leave approval notifications, appraisal reminders) without an SMTP server.
- The **job watcher** shows queued job payloads, attempts, and failure reasons.
- The **model watcher** tracks Eloquent events, including `HrProfileObserver` firing on updates — useful when debugging the audit log.

**Installation note:** Install with `--dev` flag (`local-only`) so it is never deployed to production. Gate access in `TelescopeServiceProvider` to `super_admin` role.

**Effort to add:** Low — `php artisan install:telescope --dev`, restrict gate to `super_admin`.

---

### 6. Laravel Pennant — `laravel/pennant`
**Priority: MEDIUM**

**What it does:** A lightweight feature flag package. Lets you enable or disable features per user, role, percentage of users, or custom logic — stored in the database.

**Why this application needs it:**
- The system has several modules in development (payroll was explicitly deferred). Pennant allows shipping the codebase with the payroll module code present but gated behind a flag, enabling it for specific users or tenants without a deployment.
- The new BSC performance template system could be soft-launched to HR admins only while employees still see the legacy flow.
- A/B testing new UI layouts (e.g., the Excel-style appraisal table vs. the card layout) per user group.
- The existing RBAC system handles **permissions**; Pennant handles **features** — the two complement each other cleanly. A feature flag can check the user's role internally.

**Example use cases:**
```php
// Gate the payroll module
Feature::define('payroll-module', fn (User $user) => $user->isSuperAdmin());

// Roll out new appraisal UI to HR only
Feature::define('excel-appraisal-table', fn (User $user) => $user->role === 'hr');
```

**Frontend integration:** Pass resolved feature flags through `HandleInertiaRequests::share()` alongside the existing permissions array.

**Effort to add:** Low — `composer require laravel/pennant`, `php artisan vendor:publish --provider="Laravel\Pennant\PennantServiceProvider"`, `php artisan migrate`.

---

### 7. Laravel Sanctum — `laravel/sanctum`
**Priority: MEDIUM**

**What it does:** Lightweight API authentication via personal access tokens. Also supports SPA cookie-based auth (which Fortify already handles for the web app).

**Why this application needs it:**
- The ZKTeco devices sync attendance data to the system. Currently this is likely a manual or script-based import. Sanctum would enable a proper REST API that ZKTeco devices (or a middleware sync script) can authenticate against using machine tokens.
- If a mobile app is planned (employees checking leave balances, viewing payslips, submitting leave requests on their phone), Sanctum is the standard Laravel solution.
- Token abilities (scopes) map naturally to the existing `Permissions` constants — a sync token could be granted only `attendance.sync`, nothing else.

**Effort to add:** Low — `composer require laravel/sanctum`, `php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"`, add `HasApiTokens` to `User` model, create API routes.

---

### 8. Laravel Dusk — `laravel/dusk`
**Priority: LOW-MEDIUM (testing)**

**What it does:** Browser automation testing using ChromeDriver. Tests the actual rendered UI in a real browser, including JavaScript interactions.

**Why this application needs it:**
- The appraisal form (`Reviews/Show.vue`) is a complex interactive table with inline radio buttons, conditional column rendering, and multi-stage workflow logic. Unit and feature tests cover the backend, but they cannot catch a broken Vue reactivity bug where the D/C/B/A/A+ rating fails to calculate the weighted score.
- The Nominal Roll's department tab, org chart navigation, and drag-and-drop (if added later) are all client-side interactions that Pest feature tests cannot reach.
- The access rights toggle page in Settings requires JavaScript-driven form submissions — Dusk can verify the toggle persists correctly across a page refresh.

**Install as dev dependency only.** Run in CI against a headless Chrome instance.

**Effort to add:** Medium — `composer require laravel/dusk --dev`, `php artisan dusk:install`, configure for CI.

---

### 9. Laravel Octane — `laravel/octane`
**Priority: LOW (future/production)**

**What it does:** Supercharges Laravel performance by serving the application via FrankenPHP or Swoole, keeping the application booted in memory between requests and eliminating per-request bootstrap overhead.

**Why this application needs it (eventually):**
- The attendance report page aggregates potentially hundreds of thousands of `attendance_logs` rows. As the dataset grows, each request re-bootstraps the entire Laravel application. Octane eliminates that overhead.
- With 2,521 employees all active during business hours, concurrent requests to the attendance dashboard will benefit from Octane's persistent worker model.

**Caveat:** Requires careful handling of static state (singletons, request-scoped bindings). The existing codebase should be audited before enabling. Not recommended until the application is in stable production use.

**Effort to add:** Medium — `composer require laravel/octane`, `php artisan octane:install`, review singletons for memory leaks between requests.

---

## Summary Table

| Package | Priority | Status | Primary Benefit |
|---|---|---|---|
| `laravel/scout` | **HIGH** | Not installed | Full-text employee/record search |
| `laravel/reverb` | **HIGH** | Not installed | Real-time notifications (leave, appraisals) |
| `laravel/horizon` | **HIGH** | Not installed | Queue monitoring & visibility for email jobs |
| `laravel/pulse` | **MEDIUM-HIGH** | Not installed | Production performance dashboard, slow query detection |
| `laravel/telescope` | **MEDIUM** | Not installed | Local development debug assistant |
| `laravel/pennant` | **MEDIUM** | Not installed | Feature flags for gradual module rollout |
| `laravel/sanctum` | **MEDIUM** | Not installed | ZKTeco device API auth / mobile app tokens |
| `laravel/dusk` | **LOW-MEDIUM** | Not installed | Browser testing for Vue/Inertia interactions |
| `laravel/octane` | **LOW** | Not installed | High-performance serving (post-production stability) |

---

## Recommended Installation Order

1. **Scout** — immediate search UX improvement, zero infrastructure change
2. **Telescope** — enable during development immediately, gates to super_admin
3. **Pennant** — low effort, unlocks safe incremental feature delivery
4. **Reverb + Echo** — implement alongside the notification system
5. **Horizon** — switch queue driver to Redis, add alongside Reverb (shared Redis)
6. **Pulse** — add after Horizon is running (shares Redis, monitors everything)
7. **Sanctum** — add when ZKTeco API integration or mobile app scope is confirmed
8. **Dusk** — add when the Vue UI stabilises and a CI pipeline is set up
9. **Octane** — add post-production when performance profiling identifies the need

---

*Generated: February 2026 · Laravel 12.51 · PHP 8.5*
