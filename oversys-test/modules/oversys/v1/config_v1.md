# Oversys Contract — WorkLedger v1

This contract defines a minimal WorkLedger ticket lifecycle.
A work item moves through states: Requested → Claimed → InProgress → Completed → Accepted.
The simulation engine validates transitions and invariants against declared scenarios.

## Contract Definition

```yaml
oversys: 1
system:
  id: work-ledger-v1

events:
  - WorkRequested
  - WorkClaimed
  - WorkStarted
  - WorkCompleted
  - WorkAccepted
  - WorkFailed
  - Tick

rules:
  transitions:
    - from: null
      event: WorkRequested
      to: Requested
    - from: Requested
      event: WorkClaimed
      to: Claimed
    - from: Claimed
      event: WorkStarted
      to: InProgress
    - from: InProgress
      event: WorkCompleted
      to: Completed
    - from: InProgress
      event: WorkFailed
      to: Failed
    - from: Completed
      event: WorkAccepted
      to: Accepted

  invariants:
    - id: only_enumerated_events
      description: Only declared event types may appear in the trace
    - id: valid_transition
      description: An event must have a matching transition rule for the current state

subscriptions:
  - id: auto_process_work
    listens_for: WorkRequested
    when:
      workType: default
    emits:
      - event: WorkClaimed
        actor: "worker:projection"
      - event: WorkStarted
        actor: "worker:projection"
      - event: WorkCompleted
        actor: "worker:projection"

scenarios:
  - id: happy_path
    description: User requests work; subscription auto-processes it to Completed
    steps:
      - emit:
          event: WorkRequested
          workId: w1
          workType: default
          actor: "user:alice"
        auto_process_subscriptions: true
    assertions:
      - assert: state_of
        workId: w1
        equals: Completed

  - id: invalid_transition
    description: Attempt to complete work directly from Requested state (should fail)
    steps:
      - emit:
          event: WorkRequested
          workId: w2
          workType: default
          actor: "user:bob"
      - emit:
          event: WorkCompleted
          workId: w2
          actor: "user:bob"
    assertions:
      - assert_fail: valid_transition
```
