# Oversys Run Report

| Field | Value |
|-------|-------|
| Config | v1/config_v1.md |
| Config Hash | `6b287373da90c2ef…` |
| Runner Version | 0.1.0 |
| Timestamp | 2026-02-17T01:09:34.381Z |
| Result | **PASS** |

## Scenario Summary

| Scenario | Result | Details |
|----------|--------|---------|
| happy_path | PASS | OK |
| invalid_transition | PASS | Expected fail: valid_transition |

## Scenario: happy_path

> User requests work; subscription auto-processes it to Completed

| # | Tick | Event | WorkId | Actor | Before | After | Source | Error |
|---|------|-------|--------|-------|--------|-------|--------|-------|
| 1 | 0 | WorkRequested | w1 | user:alice | — | Requested | user |  |
| 2 | 0 | WorkClaimed | w1 | worker:projection | Requested | Claimed | subscription |  |
| 3 | 0 | WorkStarted | w1 | worker:projection | Claimed | InProgress | subscription |  |
| 4 | 0 | WorkCompleted | w1 | worker:projection | InProgress | Completed | subscription |  |

**Final states:**
- w1: Completed

## Scenario: invalid_transition

> Attempt to complete work directly from Requested state (should fail)

| # | Tick | Event | WorkId | Actor | Before | After | Source | Error |
|---|------|-------|--------|-------|--------|-------|--------|-------|
| 1 | 0 | WorkRequested | w2 | user:bob | — | Requested | user |  |
| 2 | 0 | WorkCompleted | w2 | user:bob | Requested | — | user | valid_transition |

**Final states:**
- w2: Requested
