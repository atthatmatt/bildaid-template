import type {
  OversysConfig,
  ScenarioDef,
  ScenarioResult,
  ScenarioStep,
  TraceEntry,
  WorkItem,
} from "./types.js";

export function runScenarios(config: OversysConfig): ScenarioResult[] {
  return config.scenarios.map((s) => runScenario(config, s));
}

function runScenario(config: OversysConfig, scenario: ScenarioDef): ScenarioResult {
  const workItems = new Map<string, WorkItem>();
  const trace: TraceEntry[] = [];
  let nowTick = 0;
  let failureReason: string | undefined;
  let failedInvariant: string | undefined;

  for (const step of scenario.steps) {
    const result = applyEmit(config, workItems, trace, nowTick, step.emit, "user");
    if (!result.ok) {
      failureReason = result.error;
      failedInvariant = result.invariantId;
      break;
    }

    if (step.auto_process_subscriptions) {
      const subResult = processSubscriptions(config, workItems, trace, nowTick, step.emit.workId, step.emit);
      if (!subResult.ok) {
        failureReason = subResult.error;
        failedInvariant = subResult.invariantId;
        break;
      }
    }
  }

  const finalStates: Record<string, string | null> = {};
  for (const [id, item] of workItems) {
    finalStates[id] = item.status;
  }

  const expectFail = scenario.assertions.find((a) => a.assert_fail);
  let pass: boolean;

  if (expectFail) {
    pass = failedInvariant === expectFail.assert_fail;
    if (!pass && !failureReason) {
      failureReason = `Expected invariant failure '${expectFail.assert_fail}' but scenario passed without failure`;
    }
  } else if (failureReason) {
    pass = false;
  } else {
    pass = true;
    for (const assertion of scenario.assertions) {
      if (assertion.assert === "state_of" && assertion.workId && assertion.equals) {
        const actual = finalStates[assertion.workId];
        if (actual !== assertion.equals) {
          pass = false;
          failureReason = `Expected ${assertion.workId} state '${assertion.equals}', got '${actual}'`;
          break;
        }
      }
    }
  }

  return {
    id: scenario.id,
    description: scenario.description,
    pass,
    trace,
    finalStates,
    failureReason: pass ? undefined : failureReason,
    expectedFailInvariant: expectFail?.assert_fail,
  };
}

interface ApplyResult {
  ok: boolean;
  error?: string;
  invariantId?: string;
}

function applyEmit(
  config: OversysConfig,
  workItems: Map<string, WorkItem>,
  trace: TraceEntry[],
  nowTick: number,
  emit: ScenarioStep["emit"],
  source: "user" | "subscription"
): ApplyResult {
  if (!config.events.includes(emit.event)) {
    const entry: TraceEntry = {
      tick: nowTick,
      event: emit.event,
      workId: emit.workId,
      actor: emit.actor,
      stateBefore: workItems.get(emit.workId)?.status ?? null,
      stateAfter: null,
      source,
      error: "only_enumerated_events",
    };
    trace.push(entry);
    return { ok: false, error: `Event '${emit.event}' is not enumerated`, invariantId: "only_enumerated_events" };
  }

  const currentStatus = workItems.get(emit.workId)?.status ?? null;
  const rule = config.rules.transitions.find(
    (t) => t.from === currentStatus && t.event === emit.event
  );

  if (!rule) {
    const entry: TraceEntry = {
      tick: nowTick,
      event: emit.event,
      workId: emit.workId,
      actor: emit.actor,
      stateBefore: currentStatus,
      stateAfter: null,
      source,
      error: "valid_transition",
    };
    trace.push(entry);
    return {
      ok: false,
      error: `No transition for event '${emit.event}' from state '${currentStatus}'`,
      invariantId: "valid_transition",
    };
  }

  const entry: TraceEntry = {
    tick: nowTick,
    event: emit.event,
    workId: emit.workId,
    actor: emit.actor,
    stateBefore: currentStatus,
    stateAfter: rule.to,
    source,
  };
  trace.push(entry);

  if (!workItems.has(emit.workId)) {
    workItems.set(emit.workId, { status: null });
  }
  workItems.get(emit.workId)!.status = rule.to;

  return { ok: true };
}

function processSubscriptions(
  config: OversysConfig,
  workItems: Map<string, WorkItem>,
  trace: TraceEntry[],
  nowTick: number,
  workId: string,
  triggerEvent?: ScenarioStep["emit"]
): ApplyResult {
  const subs = config.subscriptions ?? [];
  const maxIterations = 50;
  let iterations = 0;

  for (const sub of subs) {
    const lastEvent = trace[trace.length - 1];
    if (!lastEvent || lastEvent.event !== sub.listens_for) continue;

    if (sub.when && triggerEvent) {
      let matches = true;
      for (const [key, value] of Object.entries(sub.when)) {
        const emitVal = (triggerEvent as Record<string, unknown>)[key];
        if (emitVal !== value) {
          matches = false;
          break;
        }
      }
      if (!matches) continue;
    }

    for (const emitDef of sub.emits) {
      if (iterations++ >= maxIterations) {
        return { ok: false, error: "Subscription processing exceeded max iterations" };
      }
      const result = applyEmit(
        config,
        workItems,
        trace,
        nowTick,
        { event: emitDef.event, workId, actor: emitDef.actor },
        "subscription"
      );
      if (!result.ok) return result;
    }
  }

  return { ok: true };
}
