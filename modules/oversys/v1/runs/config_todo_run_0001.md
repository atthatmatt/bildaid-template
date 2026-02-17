# Oversys Run Report

| Field | Value |
|-------|-------|
| Config | v1/config_todo.md |
| Config Hash | `b9495ed19c4771f9…` |
| Runner Version | 0.1.0 |
| Timestamp | 2026-02-17T05:31:24.039Z |
| Result | **PASS** |

## Scenario Summary

| Scenario | Result | Details |
|----------|--------|---------|
| create_and_complete | PASS | OK |
| full_lifecycle | PASS | OK |
| create_edit_complete | PASS | OK |
| delete_active_item | PASS | OK |
| delete_completed_item | PASS | OK |
| multiple_todos | PASS | OK |
| error_edit_deleted | PASS | Expected fail: valid_transition |
| error_complete_already_completed | PASS | Expected fail: valid_transition |
| error_uncomplete_active | PASS | Expected fail: valid_transition |
| error_delete_already_deleted | PASS | Expected fail: valid_transition |
| error_complete_deleted | PASS | Expected fail: valid_transition |
| error_create_duplicate | PASS | Expected fail: valid_transition |

## Scenario: create_and_complete

> Happy path: create a todo, then mark it completed

| # | Tick | Event | WorkId | Actor | Before | After | Source | Error |
|---|------|-------|--------|-------|--------|-------|--------|-------|
| 1 | 0 | TodoCreated | todo-1 | user:alice | — | Active | user |  |
| 2 | 0 | TodoCompleted | todo-1 | user:alice | Active | Completed | user |  |

**Final states:**
- todo-1: Completed

## Scenario: full_lifecycle

> Happy path: create, complete, uncomplete, re-complete

| # | Tick | Event | WorkId | Actor | Before | After | Source | Error |
|---|------|-------|--------|-------|--------|-------|--------|-------|
| 1 | 0 | TodoCreated | todo-2 | user:alice | — | Active | user |  |
| 2 | 0 | TodoCompleted | todo-2 | user:alice | Active | Completed | user |  |
| 3 | 0 | TodoUncompleted | todo-2 | user:alice | Completed | Active | user |  |
| 4 | 0 | TodoCompleted | todo-2 | user:alice | Active | Completed | user |  |

**Final states:**
- todo-2: Completed

## Scenario: create_edit_complete

> Happy path: create a todo, edit its title, then complete it

| # | Tick | Event | WorkId | Actor | Before | After | Source | Error |
|---|------|-------|--------|-------|--------|-------|--------|-------|
| 1 | 0 | TodoCreated | todo-3 | user:bob | — | Active | user |  |
| 2 | 0 | TodoEdited | todo-3 | user:bob | Active | Active | user |  |
| 3 | 0 | TodoCompleted | todo-3 | user:bob | Active | Completed | user |  |

**Final states:**
- todo-3: Completed

## Scenario: delete_active_item

> Happy path: create a todo and delete it while still active

| # | Tick | Event | WorkId | Actor | Before | After | Source | Error |
|---|------|-------|--------|-------|--------|-------|--------|-------|
| 1 | 0 | TodoCreated | todo-4 | user:alice | — | Active | user |  |
| 2 | 0 | TodoDeleted | todo-4 | user:alice | Active | Deleted | user |  |

**Final states:**
- todo-4: Deleted

## Scenario: delete_completed_item

> Happy path: create, complete, then delete a todo

| # | Tick | Event | WorkId | Actor | Before | After | Source | Error |
|---|------|-------|--------|-------|--------|-------|--------|-------|
| 1 | 0 | TodoCreated | todo-5 | user:alice | — | Active | user |  |
| 2 | 0 | TodoCompleted | todo-5 | user:alice | Active | Completed | user |  |
| 3 | 0 | TodoDeleted | todo-5 | user:alice | Completed | Deleted | user |  |

**Final states:**
- todo-5: Deleted

## Scenario: multiple_todos

> Happy path: manage two independent todos simultaneously

| # | Tick | Event | WorkId | Actor | Before | After | Source | Error |
|---|------|-------|--------|-------|--------|-------|--------|-------|
| 1 | 0 | TodoCreated | todo-a | user:alice | — | Active | user |  |
| 2 | 0 | TodoCreated | todo-b | user:bob | — | Active | user |  |
| 3 | 0 | TodoCompleted | todo-a | user:alice | Active | Completed | user |  |
| 4 | 0 | TodoEdited | todo-b | user:bob | Active | Active | user |  |

**Final states:**
- todo-a: Completed
- todo-b: Active

## Scenario: error_edit_deleted

> Error: cannot edit a deleted todo

| # | Tick | Event | WorkId | Actor | Before | After | Source | Error |
|---|------|-------|--------|-------|--------|-------|--------|-------|
| 1 | 0 | TodoCreated | todo-6 | user:alice | — | Active | user |  |
| 2 | 0 | TodoDeleted | todo-6 | user:alice | Active | Deleted | user |  |
| 3 | 0 | TodoEdited | todo-6 | user:alice | Deleted | — | user | valid_transition |

**Final states:**
- todo-6: Deleted

## Scenario: error_complete_already_completed

> Error: cannot complete a todo that is already completed

| # | Tick | Event | WorkId | Actor | Before | After | Source | Error |
|---|------|-------|--------|-------|--------|-------|--------|-------|
| 1 | 0 | TodoCreated | todo-7 | user:alice | — | Active | user |  |
| 2 | 0 | TodoCompleted | todo-7 | user:alice | Active | Completed | user |  |
| 3 | 0 | TodoCompleted | todo-7 | user:alice | Completed | — | user | valid_transition |

**Final states:**
- todo-7: Completed

## Scenario: error_uncomplete_active

> Error: cannot uncomplete a todo that is already active

| # | Tick | Event | WorkId | Actor | Before | After | Source | Error |
|---|------|-------|--------|-------|--------|-------|--------|-------|
| 1 | 0 | TodoCreated | todo-8 | user:alice | — | Active | user |  |
| 2 | 0 | TodoUncompleted | todo-8 | user:alice | Active | — | user | valid_transition |

**Final states:**
- todo-8: Active

## Scenario: error_delete_already_deleted

> Error: cannot delete a todo that is already deleted

| # | Tick | Event | WorkId | Actor | Before | After | Source | Error |
|---|------|-------|--------|-------|--------|-------|--------|-------|
| 1 | 0 | TodoCreated | todo-9 | user:alice | — | Active | user |  |
| 2 | 0 | TodoDeleted | todo-9 | user:alice | Active | Deleted | user |  |
| 3 | 0 | TodoDeleted | todo-9 | user:alice | Deleted | — | user | valid_transition |

**Final states:**
- todo-9: Deleted

## Scenario: error_complete_deleted

> Error: cannot complete a deleted todo

| # | Tick | Event | WorkId | Actor | Before | After | Source | Error |
|---|------|-------|--------|-------|--------|-------|--------|-------|
| 1 | 0 | TodoCreated | todo-10 | user:alice | — | Active | user |  |
| 2 | 0 | TodoDeleted | todo-10 | user:alice | Active | Deleted | user |  |
| 3 | 0 | TodoCompleted | todo-10 | user:alice | Deleted | — | user | valid_transition |

**Final states:**
- todo-10: Deleted

## Scenario: error_create_duplicate

> Error: cannot create a todo with an ID that already exists (state is no longer null)

| # | Tick | Event | WorkId | Actor | Before | After | Source | Error |
|---|------|-------|--------|-------|--------|-------|--------|-------|
| 1 | 0 | TodoCreated | todo-11 | user:alice | — | Active | user |  |
| 2 | 0 | TodoCreated | todo-11 | user:alice | Active | — | user | valid_transition |

**Final states:**
- todo-11: Active
