# CMS Adapters — SEO Flywheel Skateboard

The controller publishes changes through a CMS adapter. The adapter is selected by `CMS_MODE` in `.env`.

## Adapter Interface

Every adapter must implement:

```
interface CMSAdapter {
  fetch_content(url: string): PageContent
  update(url: string, plan: RefreshPlan): PublishResult
  create_pr(url: string, plan: RefreshPlan): PublishResult
}
```

## Stub Adapter (`CMS_MODE=stub`)

- `fetch_content`: returns empty/placeholder content
- `update`: logs the plan to `actions` table, does nothing else
- `create_pr`: logs the plan to `actions` table, does nothing else

Use for: first runs, testing, dry-runs.

## WordPress Adapter (`CMS_MODE=wordpress`)

- `fetch_content`: GET `CMS_BASE_URL/wp-json/wp/v2/pages?slug=<slug>`
- `update`: PUT to WordPress REST API with updated content
- `create_pr`: not applicable — use `todo` mode instead, creating a WordPress draft

Requires: `CMS_BASE_URL`, `CMS_TOKEN` (application password or JWT)

## Contentful Adapter (`CMS_MODE=contentful`)

- `fetch_content`: Contentful Delivery API
- `update`: Contentful Management API
- `create_pr`: create entry in draft status

Requires: `CMS_BASE_URL` (space ID), `CMS_TOKEN` (management token)

## GitHub PR Adapter (`CMS_MODE=github_pr`)

- `fetch_content`: read file from repo via GitHub API or local checkout
- `update`: commit directly to main (use with caution)
- `create_pr`: create branch, commit changes, open PR

Requires: `CMS_TOKEN` (GitHub personal access token), `CMS_BASE_URL` (repo URL)

## Adding a New Adapter

1. Create a module that implements the adapter interface
2. Register it in the controller's adapter factory (switch on `CMS_MODE`)
3. Add required env vars to `templates/env.example`
4. Test in `stub` mode first, then switch to your new adapter
