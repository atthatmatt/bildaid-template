#!/usr/bin/env node
import { resolve, dirname, basename } from "node:path";
import { readFile } from "node:fs/promises";
import { parseConfigFile } from "./parseConfig.js";
import { runScenarios } from "./simulate.js";
import { computeHash, writeRunReport } from "./report.js";
import type { RunReport } from "./types.js";

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2 || args[0] !== "run") {
    console.error("Usage: oversys run <path-to-config.md>");
    process.exit(1);
  }

  const configPath = resolve(process.cwd(), args[1]!);
  console.log(`[oversys] Reading config: ${configPath}`);

  const { config, rawYaml } = await parseConfigFile(configPath);
  console.log(`[oversys] System: ${config.system.id} | ${config.scenarios.length} scenario(s)`);

  const results = runScenarios(config);

  const pkgPath = new URL("../package.json", import.meta.url);
  const pkg = JSON.parse(await readFile(pkgPath, "utf-8")) as { version: string };

  const report: RunReport = {
    configPath: args[1]!,
    configHash: computeHash(rawYaml),
    runnerVersion: pkg.version,
    timestamp: new Date().toISOString(),
    scenarios: results,
  };

  const configBase = basename(configPath, ".md");
  const runsDir = resolve(dirname(configPath), "runs");
  const reportPath = await writeRunReport(report, configBase, runsDir);

  const allPass = results.every((r) => r.pass);
  for (const r of results) {
    const icon = r.pass ? "✓" : "✗";
    console.log(`  ${icon} ${r.id}: ${r.pass ? "PASS" : "FAIL"}${r.failureReason ? ` — ${r.failureReason}` : ""}`);
  }

  console.log(`\n[oversys] Report written: ${reportPath}`);
  console.log(`[oversys] Overall: ${allPass ? "PASS" : "FAIL"}`);
  process.exit(allPass ? 0 : 1);
}

main().catch((e: unknown) => {
  console.error("[oversys] Fatal:", e instanceof Error ? e.message : e);
  process.exit(1);
});
