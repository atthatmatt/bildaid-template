# BildAid Template

## Overview
A vanilla TypeScript + Vite application using Jazz for local-first sync. Users can create and manage "Holds" in a collaborative list, synced via Jazz's cloud infrastructure.

## Project Architecture
- **Framework**: Vite + TypeScript (no UI framework, vanilla DOM)
- **Sync**: Jazz (`jazz-tools`) for local-first collaborative data
- **Build**: `npm run build` outputs to `dist/`
- **Dev server**: Vite on port 5000

### Key Files
- `index.html` - Entry HTML
- `src/main.ts` - App logic and DOM rendering
- `src/jazz.ts` - Jazz initialization
- `src/domain/schema.ts` - Data schema (Hold, HoldList)
- `src/style.css` - Global styles
- `vite.config.ts` - Vite config (port 5000, all hosts allowed)

## Recent Changes
- 2026-02-16: Initial Replit setup. Added `vite.config.ts` for port 5000 and host configuration. Configured static deployment.
