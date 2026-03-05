# Oversys Contract — Todo App v1

This contract defines the complete behavior of a basic Todo application.
Each todo item follows a lifecycle: it is created as Active, can be edited,
marked as Completed, toggled back to Active, or Deleted. Deleted items cannot
be modified further.

The contract covers all capabilities, valid transitions, invariant rules,
and scenarios including happy paths and error cases.

## Contract Definition

```yaml
oversys: 1
system:
  id: todo-app-v1

events:
  - TodoCreated
  - TodoEdited
  - TodoCompleted
  - TodoUncompleted
  - TodoDeleted

rules:
  transitions:
    # Creation: null state -> Active
    - from: null
      event: TodoCreated
      to: Active

    # Editing: only active items can be edited
    - from: Active
      event: TodoEdited
      to: Active

    # Completing: active -> completed
    - from: Active
      event: TodoCompleted
      to: Completed

    # Uncompleting: completed -> active
    - from: Completed
      event: TodoUncompleted
      to: Active

    # Deleting: active or completed items can be deleted
    - from: Active
      event: TodoDeleted
      to: Deleted
    - from: Completed
      event: TodoDeleted
      to: Deleted

  invariants:
    - id: only_enumerated_events
      description: Only declared event types are allowed in the trace
    - id: valid_transition
      description: Every event must match a valid transition from the current state

subscriptions: []

scenarios:
  # ── Happy Paths ──────────────────────────────────────────

  - id: create_and_complete
    description: "Happy path: create a todo, then mark it completed"
    steps:
      - emit:
          event: TodoCreated
          workId: todo-1
          actor: "user:alice"
      - emit:
          event: TodoCompleted
          workId: todo-1
          actor: "user:alice"
    assertions:
      - assert: state_of
        workId: todo-1
        equals: Completed

  - id: full_lifecycle
    description: "Happy path: create, complete, uncomplete, re-complete"
    steps:
      - emit:
          event: TodoCreated
          workId: todo-2
          actor: "user:alice"
      - emit:
          event: TodoCompleted
          workId: todo-2
          actor: "user:alice"
      - emit:
          event: TodoUncompleted
          workId: todo-2
          actor: "user:alice"
      - emit:
          event: TodoCompleted
          workId: todo-2
          actor: "user:alice"
    assertions:
      - assert: state_of
        workId: todo-2
        equals: Completed

  - id: create_edit_complete
    description: "Happy path: create a todo, edit its title, then complete it"
    steps:
      - emit:
          event: TodoCreated
          workId: todo-3
          actor: "user:bob"
      - emit:
          event: TodoEdited
          workId: todo-3
          actor: "user:bob"
      - emit:
          event: TodoCompleted
          workId: todo-3
          actor: "user:bob"
    assertions:
      - assert: state_of
        workId: todo-3
        equals: Completed

  - id: delete_active_item
    description: "Happy path: create a todo and delete it while still active"
    steps:
      - emit:
          event: TodoCreated
          workId: todo-4
          actor: "user:alice"
      - emit:
          event: TodoDeleted
          workId: todo-4
          actor: "user:alice"
    assertions:
      - assert: state_of
        workId: todo-4
        equals: Deleted

  - id: delete_completed_item
    description: "Happy path: create, complete, then delete a todo"
    steps:
      - emit:
          event: TodoCreated
          workId: todo-5
          actor: "user:alice"
      - emit:
          event: TodoCompleted
          workId: todo-5
          actor: "user:alice"
      - emit:
          event: TodoDeleted
          workId: todo-5
          actor: "user:alice"
    assertions:
      - assert: state_of
        workId: todo-5
        equals: Deleted

  - id: multiple_todos
    description: "Happy path: manage two independent todos simultaneously"
    steps:
      - emit:
          event: TodoCreated
          workId: todo-a
          actor: "user:alice"
      - emit:
          event: TodoCreated
          workId: todo-b
          actor: "user:bob"
      - emit:
          event: TodoCompleted
          workId: todo-a
          actor: "user:alice"
      - emit:
          event: TodoEdited
          workId: todo-b
          actor: "user:bob"
    assertions:
      - assert: state_of
        workId: todo-a
        equals: Completed
      - assert: state_of
        workId: todo-b
        equals: Active

  # ── Error Cases ──────────────────────────────────────────

  - id: error_edit_deleted
    description: "Error: cannot edit a deleted todo"
    steps:
      - emit:
          event: TodoCreated
          workId: todo-6
          actor: "user:alice"
      - emit:
          event: TodoDeleted
          workId: todo-6
          actor: "user:alice"
      - emit:
          event: TodoEdited
          workId: todo-6
          actor: "user:alice"
    assertions:
      - assert_fail: valid_transition

  - id: error_complete_already_completed
    description: "Error: cannot complete a todo that is already completed"
    steps:
      - emit:
          event: TodoCreated
          workId: todo-7
          actor: "user:alice"
      - emit:
          event: TodoCompleted
          workId: todo-7
          actor: "user:alice"
      - emit:
          event: TodoCompleted
          workId: todo-7
          actor: "user:alice"
    assertions:
      - assert_fail: valid_transition

  - id: error_uncomplete_active
    description: "Error: cannot uncomplete a todo that is already active"
    steps:
      - emit:
          event: TodoCreated
          workId: todo-8
          actor: "user:alice"
      - emit:
          event: TodoUncompleted
          workId: todo-8
          actor: "user:alice"
    assertions:
      - assert_fail: valid_transition

  - id: error_delete_already_deleted
    description: "Error: cannot delete a todo that is already deleted"
    steps:
      - emit:
          event: TodoCreated
          workId: todo-9
          actor: "user:alice"
      - emit:
          event: TodoDeleted
          workId: todo-9
          actor: "user:alice"
      - emit:
          event: TodoDeleted
          workId: todo-9
          actor: "user:alice"
    assertions:
      - assert_fail: valid_transition

  - id: error_complete_deleted
    description: "Error: cannot complete a deleted todo"
    steps:
      - emit:
          event: TodoCreated
          workId: todo-10
          actor: "user:alice"
      - emit:
          event: TodoDeleted
          workId: todo-10
          actor: "user:alice"
      - emit:
          event: TodoCompleted
          workId: todo-10
          actor: "user:alice"
    assertions:
      - assert_fail: valid_transition

  - id: error_create_duplicate
    description: "Error: cannot create a todo with an ID that already exists (state is no longer null)"
    steps:
      - emit:
          event: TodoCreated
          workId: todo-11
          actor: "user:alice"
      - emit:
          event: TodoCreated
          workId: todo-11
          actor: "user:alice"
    assertions:
      - assert_fail: valid_transition
```
