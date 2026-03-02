# Website Integration — Agent Instructions (Replit-friendly)

## Goal

Add:
1. A server route/page that renders the dashboard
2. A way to run the controller on a schedule
3. Safe config via `.env`
4. A place to store SQLite

## Step-by-step (agent)

### 1. Identify Website Framework

Detect which framework the website uses:
- Next.js / Astro / Express / Django / Flask / etc.

### 2. Implement Dashboard Endpoint

- Route: `GET /seo-flywheel`
- Reads from SQLite at `SEO_DB_PATH`
- Renders HTML table/cards with metrics (see `dashboard/dashboard.spec.md`)
- Protect the route (basic auth, API key, or session check)

### 3. Add Controller Runner

- CLI command: `npm run seo:daily` (or equivalent for your framework)
- Reads config from `.env`
- Runs the controller pipeline: ingest → select → plan → publish → measure
- Logs output to stdout and to the `actions` table

### 4. Add Measure Runner

- CLI command: `npm run seo:weekly`
- Compares current GSC metrics to baselines
- Logs uplift deltas to `actions` table

### 5. Configure Environment

- Copy `templates/env.example` to `.env`
- Set `SITE_BASE_URL`, `SEO_DB_PATH`, `MODE`
- For GSC: choose `GSC_MODE` (start with `export_file`)
- For CMS: choose `CMS_MODE` (start with `stub`)

### 6. Initialize Database

- Run `templates/db.schema.sql` against the SQLite database at `SEO_DB_PATH`
- Or: have the controller auto-create tables on first run

### 7. Wire Cron / Scheduler

- See `templates/cron.example` for sample cron entries
- On Replit: use the workflow system or a scheduled task
- Daily: run `seo:daily`
- Weekly: run `seo:weekly`

## Agent Checklist (drop-in prompt)

```
You are integrating the bildaid module `seo-flywheel-skateboard` into this website repo.

Deliverables:
1) Create `/seo-flywheel` dashboard page that reads metrics from SQLite at `SEO_DB_PATH`.
2) Create a protected route `/api/seo-flywheel/run` (or equivalent) that triggers the
   daily controller job in `MODE=stub` by default.
3) Add scripts:
   - `seo:daily` runs daily controller
   - `seo:weekly` runs weekly measure
4) Add `.env` support using `templates/env.example`.
5) Implement the smallest working GSC adapter:
   - If `GSC_MODE=export_file`: read JSONL from `GSC_EXPORT_PATH`
   - If file missing: create a dashboard TODO "Export GSC data"
6) Implement a stub CMS adapter (log what would be published).
7) Dashboard must show: last run, 7-day summary, top uplift, action log.
8) Initialize SQLite from `templates/db.schema.sql` on first run.

Constraints:
- Use existing framework and dependencies — do not add new frameworks.
- Use SQLite only — no external databases for skateboard.
- All secrets via `.env` — never hardcode.
- Start in `MODE=stub` — no publishing until user changes mode.
```
