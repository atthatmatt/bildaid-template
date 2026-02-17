import { readFile } from "node:fs/promises";
import { parse as parseYaml } from "yaml";
import type { OversysConfig } from "./types.js";

export async function parseConfigFile(filePath: string): Promise<{ config: OversysConfig; rawYaml: string }> {
  const content = await readFile(filePath, "utf-8");
  const yamlMatch = content.match(/```yaml\s*\n([\s\S]*?)```/);
  if (!yamlMatch) {
    throw new Error(`No fenced YAML block found in ${filePath}`);
  }
  const rawYaml = yamlMatch[1]!;
  const parsed = parseYaml(rawYaml) as OversysConfig;
  validateConfig(parsed);
  return { config: parsed, rawYaml };
}

function validateConfig(c: OversysConfig): void {
  const required: (keyof OversysConfig)[] = ["oversys", "system", "events", "rules", "scenarios"];
  for (const key of required) {
    if (c[key] === undefined) {
      throw new Error(`Config missing required section: ${key}`);
    }
  }
  if (!Array.isArray(c.events) || c.events.length === 0) {
    throw new Error("Config must declare at least one event type");
  }
  if (!Array.isArray(c.rules.transitions) || c.rules.transitions.length === 0) {
    throw new Error("Config must declare at least one transition rule");
  }
  if (!Array.isArray(c.rules.invariants) || c.rules.invariants.length === 0) {
    throw new Error("Config must declare at least one invariant");
  }
  if (!Array.isArray(c.scenarios) || c.scenarios.length === 0) {
    throw new Error("Config must declare at least one scenario");
  }
  const supportedInvariants = new Set(["only_enumerated_events", "valid_transition"]);
  for (const inv of c.rules.invariants) {
    if (!supportedInvariants.has(inv.id)) {
      console.warn(`[oversys] Warning: invariant '${inv.id}' is declared but not enforced by the v1 engine`);
    }
  }
}
