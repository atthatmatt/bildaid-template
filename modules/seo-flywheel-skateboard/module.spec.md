# Module Spec — SEO Flywheel (Skateboard)

## North Star

A reliable, observable loop that repeatedly improves pages based on real search performance.

## Non-goals (for skateboard)

- "Map the whole keyword universe"
- Programmatic pages at scale
- Automated link outreach
- Complex data warehouse requirements

## Inputs

- **GSC performance rows:**
  - page, query, impressions, clicks, avg_position, date_range
- **Website/CMS content:**
  - HTML/MD body, title/meta, canonical URL

## Outputs

- **Refresh plans:** per-page improvement suggestions (title, headings, internal links, content gaps)
- **Published updates:** applied via CMS adapter (stub/todo/PR/publish)
- **Baselines + deltas:** before/after metrics per page per cycle
- **Dashboard:** observable summary at `/seo-flywheel`

## Controller Loop

The controller runs as a single sequential pipeline:

```
1. INGEST   — load GSC data (export file or API) into local DB
2. SELECT   — find near-win pages (position 8–20, impressions > threshold)
3. PLAN     — for each selected page, generate a refresh plan
4. PUBLISH  — apply the plan via configured CMS adapter
5. MEASURE  — compare current metrics to baselines, compute uplift
```

Each step logs an action row to the `actions` table with status and payload.

## Modes

| Mode | Ingest | Select | Plan | Publish | Measure |
|------|--------|--------|------|---------|---------|
| `stub` | yes | yes | yes | log only | yes |
| `todo` | yes | yes | yes | create task | yes |
| `pr` | yes | yes | yes | open PR | yes |
| `publish` | yes | yes | yes | update CMS | yes |

## Selection Criteria (defaults)

- `MIN_IMPRESSIONS`: 10 (per 28-day period)
- `POSITION_RANGE`: 8–20 (near page 1, not already ranking well)
- `MAX_PAGES_PER_RUN`: 5
- `COOLDOWN_DAYS`: 7 (skip pages updated recently)

## Plan Generation

For each selected page:

1. Fetch current page content (HTML/MD)
2. Identify top queries driving impressions to this page
3. Suggest:
   - Title/meta description improvements (include top query naturally)
   - Heading structure improvements
   - Internal link opportunities (link to/from other high-performing pages)
   - Content gap fills (queries with impressions but no content match)
4. Output structured plan as JSON (stored in `actions.payload_json`)

## Baseline + Delta Tracking

- On first encounter, record baseline metrics (clicks, impressions, position)
- On each measure cycle, compute delta from baseline
- Dashboard shows top uplifts and regressions

## Error Handling

- Each action records status: `queued | started | done | skipped | error`
- Errors are logged with message in `result_json`
- Controller continues to next page on non-fatal errors
- Fatal errors (DB unavailable, missing config) halt the run with a logged action
