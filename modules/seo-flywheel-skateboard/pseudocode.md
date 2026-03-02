# Pseudocode — SEO Flywheel Skateboard

## Data Model (SQLite)

```sql
TABLE pages(
  url PRIMARY KEY,
  last_seen_at,
  last_published_at,
  content_hash,
  cooldown_until
)

TABLE gsc(
  page, query, impressions, clicks, position, date_range,
  PRIMARY KEY(page, query, date_range)
)

TABLE actions(
  id PRIMARY KEY AUTOINCREMENT,
  created_at,
  type,           -- ingest | select | plan | publish | measure
  page_url,
  status,         -- queued | started | done | skipped | error
  payload_json,
  result_json
)

TABLE baselines(
  page_url PRIMARY KEY,
  baseline_clicks,
  baseline_impressions,
  baseline_position,
  recorded_at
)
```

## Controller Pseudocode

```
function run_daily(config):
  db = open_db(config.SEO_DB_PATH)
  date_range = config.DATE_RANGE_LABEL or "last_28_days"

  # 1. INGEST
  log_action(db, "ingest", status="started")
  rows = gsc_adapter.fetch(config)
  for row in rows:
    upsert gsc(page=row.page, query=row.query, ..., date_range=date_range)
    upsert pages(url=row.page, last_seen_at=now())
  log_action(db, "ingest", status="done", result={rows_loaded: len(rows)})

  # 2. SELECT
  log_action(db, "select", status="started")
  candidates = SELECT page, SUM(impressions) as imp, AVG(position) as pos
               FROM gsc
               WHERE date_range = date_range
               GROUP BY page
               HAVING imp >= MIN_IMPRESSIONS
                  AND pos BETWEEN POSITION_MIN AND POSITION_MAX
               ORDER BY imp DESC

  # Filter cooldowns
  selected = []
  for c in candidates:
    page = get_page(db, c.page)
    if page.cooldown_until and page.cooldown_until > now():
      log_action(db, "select", page_url=c.page, status="skipped", result="cooldown")
      continue
    selected.append(c)
    if len(selected) >= MAX_PAGES_PER_RUN:
      break

  log_action(db, "select", status="done", result={found: len(selected)})

  # 3. PLAN
  for page_info in selected:
    log_action(db, "plan", page_url=page_info.page, status="started")
    content = cms_adapter.fetch_content(page_info.page)
    queries = get_top_queries(db, page_info.page, date_range)
    plan = generate_plan(content, queries, all_pages=get_all_pages(db))
    log_action(db, "plan", page_url=page_info.page, status="done", payload=plan)

    # 4. PUBLISH
    log_action(db, "publish", page_url=page_info.page, status="started")
    if config.MODE == "stub":
      log_action(db, "publish", page_url=page_info.page, status="skipped", result="stub mode")
    elif config.MODE == "todo":
      create_todo(plan)
      log_action(db, "publish", page_url=page_info.page, status="done", result="todo created")
    elif config.MODE == "pr":
      cms_adapter.create_pr(page_info.page, plan)
      log_action(db, "publish", page_url=page_info.page, status="done", result="PR opened")
    elif config.MODE == "publish":
      cms_adapter.update(page_info.page, plan)
      log_action(db, "publish", page_url=page_info.page, status="done", result="published")

    update pages SET cooldown_until = now() + COOLDOWN_DAYS WHERE url = page_info.page

  # 5. RECORD BASELINES (first time only)
  for page_info in selected:
    if not exists baseline for page_info.page:
      insert baselines(
        page_url=page_info.page,
        baseline_clicks=page_info.clicks,
        baseline_impressions=page_info.imp,
        baseline_position=page_info.pos,
        recorded_at=now()
      )


function run_weekly_measure(config):
  db = open_db(config.SEO_DB_PATH)
  date_range = config.DATE_RANGE_LABEL or "last_28_days"

  for baseline in get_all_baselines(db):
    current = get_current_metrics(db, baseline.page_url, date_range)
    if not current:
      continue
    delta = {
      clicks: current.clicks - baseline.baseline_clicks,
      impressions: current.impressions - baseline.baseline_impressions,
      position: baseline.baseline_position - current.position  # lower is better
    }
    log_action(db, "measure", page_url=baseline.page_url, status="done",
               payload=baseline, result=delta)


function generate_plan(content, queries, all_pages):
  top_query = queries[0].query
  plan = {
    suggestions: [],
    internal_links: []
  }

  # Title check
  if top_query not in content.title.lower():
    plan.suggestions.append({
      type: "title",
      current: content.title,
      proposed: insert_query_naturally(content.title, top_query)
    })

  # Internal link opportunities
  for other_page in all_pages:
    if other_page.url != content.url:
      if has_topical_overlap(content, other_page):
        plan.internal_links.append({
          from: content.url,
          to: other_page.url,
          anchor_suggestion: derive_anchor(other_page)
        })

  return plan
```

## Dashboard Pseudocode

```
function render_dashboard(db):
  last_run = get_latest_action(db)
  summary_7d = count_actions_by_type_and_status(db, since=7_days_ago)

  top_uplift = SELECT b.page_url,
                      b.baseline_clicks, current.clicks,
                      b.baseline_impressions, current.impressions,
                      b.baseline_position, current.position
               FROM baselines b
               JOIN (latest gsc metrics) current ON b.page_url = current.page
               ORDER BY (current.clicks - b.baseline_clicks) DESC
               LIMIT 10

  recent_actions = SELECT * FROM actions ORDER BY created_at DESC LIMIT 20

  render_html({
    last_run,
    summary_7d,
    top_uplift,
    recent_actions
  })
```
