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

interface SimState {
  workItems: Map<string, WorkItem>;
  trace: TraceEntry[];
  nowTick: number;
}

function runScenario(config: OversysConfig, scenario: ScenarioDef): ScenarioResult {
  const state: SimState = {
    workItems: new Map(),
    trace: [],
    nowTick: 0,
  };
  let failureReason: string | undefined;
  let failedInvariant: string | undefined;

  for (const step of scenario.steps) {
    if (step.emit.event === "Tick" && step.emit.t !== undefined) {
      state.nowTick = step.emit.t;
    }

    const result = applyEmit(config, state, step.emit, "user");
    if (!result.ok) {
      failureReason = result.error;
      failedInvariant = result.invariantId;
      break;
    }

    if (step.auto_process_subscriptions) {
      const subResult = processSubscriptionsToQuiescence(config, state, step.emit.workId, step.emit);
      if (!subResult.ok) {
        failureReason = subResult.error;
        failedInvariant = subResult.invariantId;
        break;
      }
    }
  }

  const finalStates: Record<string, string | null> = {};
  for (const [id, item] of state.workItems) {
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
    trace: state.trace,
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
  state: SimState,
  emit: ScenarioStep["emit"],
  source: "user" | "subscription"
): ApplyResult {
  if (!config.events.includes(emit.event)) {
    const entry: TraceEntry = {
      tick: state.nowTick,
      event: emit.event,
      workId: emit.workId,
      actor: emit.actor,
      stateBefore: state.workItems.get(emit.workId)?.status ?? null,
      stateAfter: null,
      source,
      error: "only_enumerated_events",
    };
    state.trace.push(entry);
    return { ok: false, error: `Event '${emit.event}' is not enumerated`, invariantId: "only_enumerated_events" };
  }

  if (emit.event === "Tick") {
    const entry: TraceEntry = {
      tick: state.nowTick,
      event: emit.event,
      workId: emit.workId,
      actor: emit.actor,
      stateBefore: null,
      stateAfter: null,
      source,
    };
    state.trace.push(entry);
    return { ok: true };
  }

  const currentStatus = state.workItems.get(emit.workId)?.status ?? null;
  const rule = config.rules.transitions.find(
    (t) => t.from === currentStatus && t.event === emit.event
  );

  if (!rule) {
    const entry: TraceEntry = {
      tick: state.nowTick,
      event: emit.event,
      workId: emit.workId,
      actor: emit.actor,
      stateBefore: currentStatus,
      stateAfter: null,
      source,
      error: "valid_transition",
    };
    state.trace.push(entry);
    return {
      ok: false,
      error: `No transition for event '${emit.event}' from state '${currentStatus}'`,
      invariantId: "valid_transition",
    };
  }

  const entry: TraceEntry = {
    tick: state.nowTick,
    event: emit.event,
    workId: emit.workId,
    actor: emit.actor,
    stateBefore: currentStatus,
    stateAfter: rule.to,
    source,
  };
  state.trace.push(entry);

  if (!state.workItems.has(emit.workId)) {
    state.workItems.set(emit.workId, { status: null });
  }
  state.workItems.get(emit.workId)!.status = rule.to;

  return { ok: true };
}

interface QueueItem {
  traceEntry: TraceEntry;
  payload: Record<string, unknown>;
}

function processSubscriptionsToQuiescence(
  config: OversysConfig,
  state: SimState,
  _workId: string,
  triggerEvent: ScenarioStep["emit"]
): ApplyResult {
  const subs = config.subscriptions ?? [];
  if (subs.length === 0) return { ok: true };

  const maxEvents = 200;
  const queue: QueueItem[] = [{
    traceEntry: state.trace[state.trace.length - 1]!,
    payload: triggerEvent as unknown as Record<string, unknown>,
  }];

  while (queue.length > 0) {
    if (state.trace.length > maxEvents) {
      return { ok: false, error: "Subscription processing exceeded max events (possible loop)" };
    }

    const current = queue.shift()!;

    for (const sub of subs) {
      if (current.traceEntry.event !== sub.listens_for) continue;

      if (sub.when) {
        let matches = true;
        for (const [key, value] of Object.entries(sub.when)) {
          if (current.payload[key] !== value) {
            matches = false;
            break;
          }
        }
        if (!matches) continue;
      }

      for (const emitDef of sub.emits) {
        const emitPayload = { event: emitDef.event, workId: current.traceEntry.workId, actor: emitDef.actor };
        const result = applyEmit(config, state, emitPayload, "subscription");
        if (!result.ok) return result;
        queue.push({
          traceEntry: state.trace[state.trace.length - 1]!,
          payload: emitPayload as unknown as Record<string, unknown>,
        });
      }
    }
  }

  return { ok: true };
}
