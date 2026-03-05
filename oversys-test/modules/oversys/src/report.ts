import { createHash } from "node:crypto";
import { readdir, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import type { RunReport } from "./types.js";

export function computeHash(content: string): string {
  return createHash("sha256").update(content).digest("hex");
}

export async function writeRunReport(
  report: RunReport,
  configBaseName: string,
  runsDir: string
): Promise<string> {
  await mkdir(runsDir, { recursive: true });

  const existing = await readdir(runsDir).catch(() => []);
  const pattern = new RegExp(`^${configBaseName}_run_(\\d+)\\.md$`);
  let maxNum = 0;
  for (const f of existing) {
    const m = f.match(pattern);
    if (m) {
      const n = parseInt(m[1]!, 10);
      if (n > maxNum) maxNum = n;
    }
  }
  const nextNum = String(maxNum + 1).padStart(4, "0");
  const fileName = `${configBaseName}_run_${nextNum}.md`;
  const filePath = join(runsDir, fileName);

  const md = renderReport(report);
  await writeFile(filePath, md, "utf-8");
  return filePath;
}

function renderReport(report: RunReport): string {
  const allPass = report.scenarios.every((s) => s.pass);
  const lines: string[] = [];

  lines.push(`# Oversys Run Report`);
  lines.push("");
  lines.push(`| Field | Value |`);
  lines.push(`|-------|-------|`);
  lines.push(`| Config | ${report.configPath} |`);
  lines.push(`| Config Hash | \`${report.configHash.slice(0, 16)}…\` |`);
  lines.push(`| Runner Version | ${report.runnerVersion} |`);
  lines.push(`| Timestamp | ${report.timestamp} |`);
  lines.push(`| Result | ${allPass ? "**PASS**" : "**FAIL**"} |`);
  lines.push("");

  lines.push(`## Scenario Summary`);
  lines.push("");
  lines.push(`| Scenario | Result | Details |`);
  lines.push(`|----------|--------|---------|`);
  for (const s of report.scenarios) {
    const result = s.pass ? "PASS" : "FAIL";
    const details = s.failureReason ?? (s.expectedFailInvariant ? `Expected fail: ${s.expectedFailInvariant}` : "OK");
    lines.push(`| ${s.id} | ${result} | ${details} |`);
  }
  lines.push("");

  for (const s of report.scenarios) {
    lines.push(`## Scenario: ${s.id}`);
    lines.push("");
    lines.push(`> ${s.description}`);
    lines.push("");
    lines.push(`| # | Tick | Event | WorkId | Actor | Before | After | Source | Error |`);
    lines.push(`|---|------|-------|--------|-------|--------|-------|--------|-------|`);
    s.trace.forEach((t, i) => {
      lines.push(
        `| ${i + 1} | ${t.tick} | ${t.event} | ${t.workId} | ${t.actor} | ${t.stateBefore ?? "—"} | ${t.stateAfter ?? "—"} | ${t.source} | ${t.error ?? ""} |`
      );
    });
    lines.push("");

    if (Object.keys(s.finalStates).length > 0) {
      lines.push(`**Final states:**`);
      for (const [id, state] of Object.entries(s.finalStates)) {
        lines.push(`- ${id}: ${state}`);
      }
      lines.push("");
    }
  }

  return lines.join("\n");
}
