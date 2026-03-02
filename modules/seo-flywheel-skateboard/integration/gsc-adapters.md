# GSC Adapters — SEO Flywheel Skateboard

The controller ingests Google Search Console data through a GSC adapter. The adapter is selected by `GSC_MODE` in `.env`.

## Adapter Interface

```
interface GSCAdapter {
  fetch(config): GSCRow[]
}

interface GSCRow {
  page: string
  query: string
  impressions: number
  clicks: number
  position: number
  date_range: string
}
```

## Export File Adapter (`GSC_MODE=export_file`)

**This is the skateboard default.** No API credentials needed.

- Reads a JSONL file from `GSC_EXPORT_PATH`
- Each line is a JSON object with: `page`, `query`, `impressions`, `clicks`, `position`
- `date_range` is set from `DATE_RANGE_LABEL` in config

### How to export from GSC manually

1. Go to Google Search Console → Performance
2. Set date range to "Last 28 days"
3. Click "Export" → download as CSV or use the bulk export
4. Convert to JSONL format (one JSON object per row)
5. Save to `GSC_EXPORT_PATH` (default: `./data/gsc_last_28_days.jsonl`)

### If the file is missing

The controller will:
1. Log an error action
2. Create a dashboard TODO: "Export last 28 days performance from GSC, save as JSONL at `GSC_EXPORT_PATH`"
3. Skip the rest of the pipeline for this run

## API Adapter (`GSC_MODE=api`)

**Upgrade from export file when manual export becomes tedious.**

- Uses Google Search Console API (Search Analytics)
- Requires OAuth2 credentials: `GSC_CLIENT_ID`, `GSC_CLIENT_SECRET`, `GSC_REFRESH_TOKEN`
- Queries: `GSC_SITE_URL` property for last 28 days of performance data
- Automatically pages through results

### Setup

1. Create a Google Cloud project
2. Enable Search Console API
3. Create OAuth2 credentials (desktop or web app)
4. Obtain a refresh token via the OAuth consent flow
5. Set credentials in `.env`

## Warehouse Adapter (`GSC_MODE=warehouse`)

**Upgrade only when managing 3+ sites or needing historical data beyond 28 days.**

- Reads from BigQuery (or similar) where GSC data is exported via Google's bulk export feature
- Requires: `GSC_WAREHOUSE_PROJECT`, `GSC_WAREHOUSE_DATASET`
- Not needed for skateboard — listed here for upgrade planning only
