# SEO Flywheel (Skateboard) — bildaid module

This module implements a minimal automated SEO flywheel:

1. Pull performance data (Google Search Console export/API)
2. Find near-win opportunities (positions ~8–20 with impressions)
3. Generate refresh plans + internal links
4. Publish updates to CMS (or create PRs)
5. Measure deltas and repeat
6. Expose observability via a dashboard page

**Goal:** Start compounding from scratch with the least moving parts, then upgrade only when justified by data.

## Folder Layout

```
modules/seo-flywheel-skateboard/
├── README.md                          # This file
├── module.spec.md                     # North star, inputs/outputs, controller loop
├── pseudocode.md                      # Data model + controller pseudocode
├── ops/
│   ├── runbook.md                     # Modes, cadence, failure handling
│   ├── upgrade-gates.md               # When to upgrade from skateboard
│   └── security.md                    # API keys, data access, publishing safeguards
├── integration/
│   ├── website-integration.md         # Agent instructions for wiring into a website
│   ├── cms-adapters.md                # CMS adapter patterns
│   └── gsc-adapters.md                # GSC data source patterns
├── dashboard/
│   ├── dashboard.spec.md              # What the dashboard page must show
│   └── dashboard-wireframe.md         # Text wireframe
└── templates/
    ├── env.example                    # All config vars
    ├── db.schema.sql                  # SQLite schema
    ├── cron.example                   # Sample cron entries
    └── seo_controller.singlefile.py.pseudo  # Reference controller pseudocode
```

## Getting Started

1. Read `module.spec.md` to understand the flywheel loop.
2. Follow `integration/website-integration.md` to wire the module into your website repo.
3. Copy `templates/env.example` to `.env` and configure.
4. Initialize the database with `templates/db.schema.sql`.
5. Run the controller in `stub` mode first (no publishing).
6. Check the dashboard at `/seo-flywheel`.
7. When ready, switch `MODE` to `todo`, `pr`, or `publish`.

## Modes

| Mode | Behavior |
|------|----------|
| `stub` | Runs full pipeline, logs actions, but does not publish. Safe dry-run. |
| `todo` | Creates tasks/issues for human review before publishing. |
| `pr` | Opens pull requests with proposed content changes. |
| `publish` | Updates CMS directly. Use with caution. |

## Upgrade Path

See `ops/upgrade-gates.md`. Only upgrade when the skateboard proves value:
- SERP-aware planning (when you have 30+ queries/week)
- Lead magnet builder (when traffic exists but conversion is low)
- Automated GSC API (when manual export becomes tedious)
- Data warehouse (when you need cross-site or cross-property analysis)
