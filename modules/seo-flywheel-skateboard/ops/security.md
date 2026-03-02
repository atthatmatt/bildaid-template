# Security — SEO Flywheel Skateboard

## API Keys and Secrets

- All secrets are stored in environment variables (`.env` file), never in code or committed files
- GSC API credentials (client ID, client secret, refresh token) are only needed in `GSC_MODE=api`
- CMS tokens are only needed when `MODE` is `pr` or `publish`
- In `stub` and `todo` modes, no external write credentials are required

## Data Access

- GSC data is stored in a local SQLite database at `SEO_DB_PATH`
- The database contains search performance data (queries, impressions, clicks, positions) — treat as confidential
- Do not expose the SQLite file via public routes
- The dashboard endpoint should be protected (authentication or IP restriction in production)

## Publishing Safeguards

| Mode | Risk | Safeguard |
|------|------|-----------|
| `stub` | None | No external writes |
| `todo` | Low | Human reviews each task before acting |
| `pr` | Medium | Human reviews and merges each PR |
| `publish` | High | Automatic CMS updates — use only when confident |

## Recommendations

- Start with `MODE=stub` and review outputs before enabling publishing
- Use `MODE=pr` in production so changes are reviewable before going live
- Rotate CMS tokens regularly
- Keep the dashboard behind authentication in production
- Back up the SQLite database before major config changes
- Do not log full API responses containing sensitive data — log summaries only
