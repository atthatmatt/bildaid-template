# Upgrade Gates — When to Upgrade from Skateboard

Only upgrade when justified by data. Each upgrade adds complexity — make sure the skateboard is working first.

## Upgrade 1: SERP Feature-Aware Planning (add SERP API)

**Trigger:** You have 30+ target queries/week and want better intent matching.

**Adds:** For each target query, fetch top 10 SERP titles/snippets, classify intent, propose better outlines.

**Cost:** SERP API subscription, additional processing time per query.

**Skip if:** Your pages are already ranking and the current plan suggestions are improving metrics.

## Upgrade 2: Lead Magnet Detector + Builder

**Trigger:** Dashboard shows traffic growth but low conversion, OR you want linkable assets.

**Adds:** For each topic cluster, propose:
- Template pack, checklist, or calculator
- Landing page outline
- Internal link structure to funnel traffic

**Cost:** Additional content creation effort.

**Skip if:** You're still building traffic volume — focus on getting pages to page 1 first.

## Upgrade 3: Automated GSC API

**Trigger:** Manual GSC export becomes tedious (running more than 2x/week).

**Adds:**
- OAuth refresh token flow for GSC API
- Automatic daily data pull
- No manual file export needed

**Cost:** OAuth setup complexity, token refresh maintenance.

**Skip if:** You're running weekly and the manual export takes < 2 minutes.

## Upgrade 4: Data Warehouse / Cross-Property

**Trigger:** You manage 3+ sites or need historical analysis beyond 28 days.

**Adds:**
- Persistent historical GSC data store
- Cross-site opportunity analysis
- Trend detection over months

**Cost:** Database hosting, ETL pipeline, storage.

**Skip if:** Single site with straightforward content updates.

## Decision Framework

Before upgrading, ask:

1. Is the skateboard producing measurable uplift? (Check dashboard deltas)
2. What is the bottleneck? (Data quality? Plan quality? Publishing speed?)
3. Does this upgrade address the actual bottleneck?
4. Can I test the upgrade in `stub` mode first?

If you can't answer yes to all four, stay on skateboard.
