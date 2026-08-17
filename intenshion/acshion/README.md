# Acshion

An acshion is a reusable, structured-prose template for a cashe-modifying attempt.

It is not a control-flow node, a state-machine state, or a deterministic procedure. It can participate in those systems after it is instantiated, but in Intenshion it lives upstream of concrete execution tools.

Core shape:

```text
Use > Do > Get
```

An acshion describes one conversion step at the level of detail needed for an experienced doer or correlator to act. It is allowed to start vague. It is refined only when an objecshion shows that more detail, a split, or an adapter is needed.

## Purpose

Acshions occupy the middle ground between:

- a one-off note: "remember this"
- a deterministic pipeline: "run this exact automation"

They are useful when real work is too messy for process management but stable enough to be captured as reusable case-management knowledge.

## Core Principles

1. **Structured prose, not data.** An acshion is a document. It may be parsed later, but it should remain readable as plain text.
2. **Expert-compact body.** The core body is maintained at a level that works for someone experienced with the activity.
3. **Progressive specificity.** Detail is added under objecshion pressure, not from a desire to make the document complete in advance.
4. **Interfaces are sacred.** `Use` and `Get` are state interfaces between acshions. Intermediate states may stay inside `Do` until they become important interfaces.
5. **Normalization is optional.** Duplication is allowed. Local usefulness beats global elegance until an objecshion justifies refactoring.
6. **Correlator-native.** Acshions assume a correlator can interpret, expand, and adapt structured prose. Calculator execution is optional and downstream.

Short policy phrase:

```text
Big Do is allowed. Splits are earned. Interfaces are sacred.
```

## Required Sections

### Name

A stable unique identifier for the acshion.

Do not encode ordinary revisions into the name. Use Canon history, `Rev`, or another metadata layer for revision tracking.

Temporary disambiguators are acceptable before a name stabilizes:

```text
Name: make-sandwich-simple@tmp-3f2
```

### Use

Input nouns, entrance conditions, tools, resources, or states.

`Use` is not inventory management. It identifies what must be available or true enough for the acshion to apply.

### Do

The behavior or conversion.

`Do` may be declarative or imperative:

```text
Do: turn the draft brief into a manifestation-ready spec
```

or:

```text
Do:
Review the draft brief.
Extract unresolved constraints.
Rewrite the spec so the target builder can implement it.
```

A large `Do` is allowed if its internal states are not important interfaces yet.

### Get

Output nouns, exit states, artifacts, or recognizable outcomes.

Gets should be state handles. Avoid pure evaluation words such as `good`, `done`, or `ready` unless paired with checks or domain-specific detail.

## Optional Sections

### Frame

Interpretation context: scope, intent, constraints, style, exclusions, and what counts as good enough.

Examples:

```text
Frame:
Quick and easy. No toasting. Minimal cleanup.
```

```text
Frame:
This acshion emits a design spec, not the final artifact.
Non-goals: implementation, procurement, manufacturing.
```

Frame is where the acshion can reject irrelevant improvement pressure without adding steps.

### Detail

Glossary-like clarifications keyed to tokens used in `Use`, `Do`, or `Get`.

Rule: every top-level key in `Detail` must appear in the acshion body (`Use`, `Do`, or `Get`) or be a declared alias.

Detail may include:

- noun disambiguation: models, locations, configurations
- verb nuance: what `spread_evenly` means
- recognition criteria for gets
- substitutes or acceptable variants
- references to media, examples, specs, or files

Detail must not introduce new steps. New steps belong in `Do` or in a linked sub-acshion.

### Checks

Verification criteria for gets, especially when the get is intangible or experience-based.

Example:

```text
Get:
dough_conditioned

Checks:
dough_conditioned:
- poke indentation springs back slowly
- windowpane stretches thin without tearing
```

For vibe/design work, `Checks` can contain proxy evidence rather than numeric metrics.

### Link

Optional explicit relationships to other acshions. Link lets a stable island congeal without requiring a global graph.

Allowed forms:

```text
Link:
expand Do: design-marketing-site > build-marketing-site
provide brand: update-brand
provide domain: buy-domain
achieve marketing_site_live: connect-email-capture + publish-site + verify-tracking
```

Constraints:

- referenced acshion names must exist or be marked TODO
- referenced nouns/targets must exist in this acshion's `Use`, `Do`, or `Get`
- Link points to acshions; it does not introduce raw steps directly

### Aliases

Optional mapping to prevent synonym drift.

```text
Aliases:
butter_knife: [knife, spreader]
deli_meat: [meat]
```

### Notes

Risks, gotchas, safety notes, provenance, or comments that do not belong in the execution body.

## Example

```text
Name: make-sandwich-simple
Rev: 2

Frame:
Quick and easy. No toasting. Minimal cleanup.

Use:
bread, cheese, deli_meat, mayonnaise, butter_knife

Do:
Spread mayonnaise evenly on one slice of bread.
Layer cheese and deli_meat.
Close with second slice.

Get:
sandwich

Detail:
bread: sliced white bread
cheese: sliced singles
deli_meat: sliced thin
butter_knife: wide and dull
spread_evenly: thin layer to edges, no clumps
```

## Acshion vs Acshion-Run

An acshion is a template. An acshion-run is an instance that touches reality.

Every acshion-run must advance the cashe, even when it fails. Failure still advances the cashe when it records evidence, constraints, disqualified paths, changed confidence, or a reason the plan should change.

Minimum acshion-run record:

```text
Bind: what template slots were concretized
Observed: what happened
Evidence: links, logs, screenshots, commits, transcripts, artifacts
CasheDelta: what changed in the cashe model
PolishyDelta: how relevant objecshion pressure changed
```

Definition:

```text
Acshions are templates for cashe-modifying attempts. When executed, an acshion must produce a cashe patch and thereby change the polishy evaluation of one or more objecshions.
```

## When To Split

Do not split because the acshion looks big. Split only when an objecshion shows that an intermediate state has become an interface.

Common split triggers:

- interface ambiguity blocks reuse
- a plan wants a more specific get than the acshion produces
- an optional branch becomes common
- handoff or pause routinely happens mid-Do
- repeated execution failures require a named intermediate state

Adapters are preferred when they preserve useful existing acshions:

```text
Name: sandwich-melt
Use: sandwich, toaster_oven
Do: melt sandwich in toaster oven
Get: melted_sandwich
```

## Related Docs

- [Simon lint](lint.md)
- [Multi-Resolution Acshion Index](multi-resolution-index.md)

## Source Recovery

Recovered from local ChatGPT source history, primarily:

- `696ab165-9760-8325-9937-f060cfbd9474` - Acshion format & lint
- `69728602-60f4-832b-b8f5-4e9beaa30f58` - Acshions and Cashe Dynamics
