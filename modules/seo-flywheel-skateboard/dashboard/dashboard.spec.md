# Dashboard Spec — /seo-flywheel

## Purpose

Make the flywheel observable so you can trust it and decide when to upgrade.

## Must Show (skateboard)

### Last Run Status
- Timestamp of most recent controller run
- Duration (if tracked)
- Overall status: success / partial / error

### Run Summary (last 7 days)
- Opportunities found (select actions)
- Pages planned
- Pages published
- Pages skipped (cooldown / no change)
- Errors

### Top Uplift (weekly)
- Page URL
- Baseline clicks → current clicks
- Baseline impressions → current impressions
- Baseline position → current position
- Delta (improvement or regression)
- Limit: top 10 by click improvement

### Action Log (recent)
- Last 20 actions
- Columns: timestamp, type, page URL, status, summary
- Color-code: green (done), yellow (skipped), red (error)

## Nice-to-Have (later)

- Sparkline charts for metrics over time
- Filter by page or action type
- Export action log as CSV
- Notification preferences (email on error)

## Technical Requirements

- Reads from SQLite at `SEO_DB_PATH`
- Server-rendered HTML (no SPA framework required)
- Protected route (basic auth, session, or API key)
- Responsive layout (works on mobile for quick checks)
- Auto-refresh: optional, every 60 seconds
