# Oversys — Minimal Contract Runner

Oversys reads an Oversys config from a Markdown file (with an embedded YAML block), simulates declared scenarios against a deterministic state machine, validates invariant rules, and writes an immutable run report Markdown file.

## File Layout

```
modules/oversys/
├── README.md
├── package.json
├── tsconfig.json
├── src/
│   ├── cli.ts          # Entry point
│   ├── types.ts        # Type definitions
│   ├── parseConfig.ts  # Markdown/YAML parser
│   ├── simulate.ts     # Scenario simulation engine
│   └── report.ts       # Run report writer
├── v1/
│   ├── config_v1.md    # Contract config (Markdown + embedded YAML)
│   └── runs/           # Immutable run reports
└── dist/               # Compiled output (gitignored)
```

## Usage

Build:

```bash
cd modules/oversys
npm install
npm run build
```

Run against a config:

```bash
npm run oversys -- run v1/config_v1.md
```

Or directly:

```bash
node dist/cli.js run v1/config_v1.md
```

## Round-Trip Harness

From the repo root:

```bash
npm run oversys:rt
```

This wipes `oversys-test/`, copies the module, builds it, and runs the CLI inside the copy to verify Oversys works in a fresh repo instance.
