export interface OversysConfig {
  oversys: number;
  system: { id: string };
  events: string[];
  rules: {
    transitions: TransitionRule[];
    invariants: InvariantDef[];
  };
  subscriptions?: SubscriptionDef[];
  scenarios: ScenarioDef[];
}

export interface TransitionRule {
  from: string | null;
  event: string;
  to: string;
}

export interface InvariantDef {
  id: string;
  description: string;
}

export interface SubscriptionDef {
  id: string;
  listens_for: string;
  when?: Record<string, string>;
  emits: { event: string; actor: string }[];
}

export interface ScenarioDef {
  id: string;
  description: string;
  steps: ScenarioStep[];
  assertions: Assertion[];
}

export interface ScenarioStep {
  emit: {
    event: string;
    workId: string;
    workType?: string;
    actor: string;
    t?: number;
  };
  auto_process_subscriptions?: boolean;
}

export interface Assertion {
  assert?: string;
  assert_fail?: string;
  workId?: string;
  equals?: string;
}

export interface TraceEntry {
  tick: number;
  event: string;
  workId: string;
  actor: string;
  stateBefore: string | null;
  stateAfter: string | null;
  source: "user" | "subscription";
  error?: string;
}

export interface WorkItem {
  status: string | null;
}

export interface ScenarioResult {
  id: string;
  description: string;
  pass: boolean;
  trace: TraceEntry[];
  finalStates: Record<string, string | null>;
  failureReason?: string;
  expectedFailInvariant?: string;
}

export interface RunReport {
  configPath: string;
  configHash: string;
  runnerVersion: string;
  timestamp: string;
  scenarios: ScenarioResult[];
}
