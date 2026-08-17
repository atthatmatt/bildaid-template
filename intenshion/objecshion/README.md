# Objecshion

An objecshion is a signal record that says inaction may no longer be acceptable under current polishy.

Objecshions are how Intenshion avoids hyperactivity. The system does not open work just because something could be improved. It opens or updates work when an objecshion is coherent enough, justified enough, and above threshold.

Objecshions can represent objections, invitations, corrections, or questions. The artifact stays the same; `Type` carries the social shape.

## Purpose

Objecshions separate concern from work.

- The objecshion is the signal: what seems wrong, missing, risky, or worth changing.
- The cashe is the work record: the active coordination context that tries to reduce one or more objecshions below threshold.
- The acshion is a reusable move that may advance the cashe.

This supports many-to-many relationships:

- many objecshions can merge into one cashe
- one objecshion can split into many cashes
- one cashe can use many acshions
- one acshion can serve many objecshions across time

## File Format v0

One file represents one objecshion.

```text
Name: <plain english sentence> [#optional-suffix]
Type: objection | invitation | correction | question
Status: seed | drafting | contested | accepted | rejected | withdrawn | merged | split
Created: <YYYY-MM-DD>
Updated: <YYYY-MM-DD>
By: <who raised it: user | agent | system>

About:
  Target: <record, artifact, decision, plan, action, or condition being challenged>
  Scope: <one-line boundary: what is in/out>

Now:
  State: <current state as understood>

Want:
  State: <desired state or change request>

Because:
  Grounds: <why this matters in plain language>
  Policy:
    - <polishy id, quote, or "policy needed">
  Stakes:
    - <what breaks, who cares, or cost of not changing>

Evidence:
  - <links, observations, repro steps, screenshots, quotes, metrics>
  - <unknown is allowed>

Proposed:
  Draft:
    <optional inline draft content>
  Options:
    - <option A>
    - <option B>
  Non-Goals:
    - <explicitly not doing>

Links:
  Canon:
    - <policy.md#anchor>
    - <case-precedent-id>
  Artifacts:
    - <path/to/doc>
    - <url>
  Related-Objecshions:
    - <objecshion id>
  Cashes:
    - <cashe id>
  Acshions:
    - <acshion id>

Conversation:
  Thread:
    - <timestamp> <speaker>: <message summary, not full transcript>
  Open-Questions:
    - <what Simon still needs to decide>
  Decisions:
    - <accepted/rejected/merged/split notes with date and rationale>
```

## Types

`Type` makes objecshions usable in normal work without forcing every signal to feel adversarial.

- `objection`: current momentum may be wrong or unsafe
- `invitation`: improvement may be justified
- `correction`: a record appears incorrect
- `question`: clarification is needed before action can be justified

Friendly UI labels can render these differently, but the underlying object remains stable.

## Enrichment Gates

Simon should move an objecshion toward one of three outcomes:

1. spawn or update a cashe
2. merge or split with related objecshions
3. withdraw, reject, or park

Before opening new work, Simon checks three gates.

### Gate A: Is It About Something?

Minimum fields:

- `About.Target`
- `About.Scope`

If this gate fails, ask one narrow question about the target or boundary.

### Gate B: Is There A Clear Delta?

Minimum fields:

- `Now.State`
- `Want.State`

The delta can be vague at first, but it must be present.

### Gate C: Is There Justification?

Minimum fields:

- `Because.Grounds`
- a policy link, policy quote, or explicit `policy needed`
- some notion of stakes

If this gate fails, do not spawn a cashe yet.

## Hypoactivity Principle

Objecshions should bias the system toward dismissal before new work.

Default resolution preference:

1. clarify an existing record
2. link to an existing polishy, precedent, or cashe
3. merge duplicates
4. split scope if one signal is overloaded
5. spawn new work only when justified

No cashe should exist without justification.

## Lifecycle Acshions

The system can manage objecshions through ordinary house acshions.

```text
Name: open-objecshion
Use: seed_text, target_artifact
Do: create objecshion file with Status: seed
Get: objecshion
```

```text
Name: update-objecshion
Use: objecshion, delta
Do: apply edit, append conversation summary, update timestamp
Get: updated_objecshion
```

```text
Name: merge-objecshions
Use: objecshion_a, objecshion_b, merge_rationale
Do: produce merged objecshion; mark originals merged and link forward
Get: merged_objecshion
```

```text
Name: split-objecshion
Use: objecshion, split_criteria
Do: create smaller objecshions; mark original split
Get: split_objecshions
```

```text
Name: accept-objecshion
Use: objecshion, threshold_justification, policy_mapping
Do: create or update cashe; link objecshion and cashe both ways; mark accepted
Get: linked_cashe, updated_objecshion
```

```text
Name: withdraw-objecshion
Use: objecshion, reason
Do: set withdrawn status and record rationale
Get: closed_objecshion
```

## Source Recovery

Recovered from local ChatGPT source history:

- `696bfc0c-1b70-8326-bfc7-9004b05079c8` - objecshion document spec
