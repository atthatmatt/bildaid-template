# Runbook — SEO Flywheel Skateboard

## Modes

| Mode | Behavior |
|------|----------|
| `stub` | Runs full pipeline except publishing. Safe dry-run. |
| `todo` | Creates tasks for user review before publishing. |
| `pr` | Opens PRs with proposed changes. |
| `publish` | Updates CMS directly. |

## Daily Cadence (recommended)

- Run controller daily (off-peak hours)
- Process `MAX_PAGES_PER_RUN` = 3–10 pages
- Cooldown per page: 7 days (default)

## Weekly Cadence

- Run measure job weekly to compute uplift deltas
- Review dashboard for regressions or errors

## First Run

1. Set `MODE=stub` in `.env`
2. Provide GSC data (export file or configure API)
3. Run `seo:daily` script
4. Check dashboard at `/seo-flywheel`
5. Review action log — verify opportunities look correct
6. When confident, switch to `MODE=todo` or `MODE=pr`

## Failure Handling

- If GSC adapter fails: controller logs error action, creates dashboard TODO "Export GSC data manually"
- If CMS adapter fails: controller logs error, skips page, continues to next
- If DB is unavailable: controller halts immediately with fatal error logged to stderr
- If plan generation fails: controller logs error for that page, continues

## Monitoring

- Check dashboard daily for:
  - Last run timestamp (stale = problem)
  - Error count in last 7 days
  - Pages skipped vs processed ratio
- Alert if no successful run in 48 hours

## Manual Overrides

- To force-process a page past cooldown: delete its `cooldown_until` value in the `pages` table
- To re-baseline a page: delete its row from `baselines` table
- To skip a page permanently: set `cooldown_until` far in the future

## Rollback

- All actions are logged with payloads — review `actions` table for what was changed
- In `pr` mode: close/revert the PR
- In `publish` mode: use CMS revision history to revert
- In `stub`/`todo` mode: nothing to roll back
