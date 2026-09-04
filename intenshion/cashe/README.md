# Cashe

A cashe is an active coordination structure that organizes work intended to reduce target objecshions below their action thresholds.

A cashe does not need to eliminate all polishy violation, and it does not always need to "close" in a final-project sense. The practical goal is to change the modeled situation enough that the relevant objecshions no longer justify continued action under current polishy.

## Purpose

Cashes sit between objecshions and acshions.

```text
Observashion -> Objecshion -> Cashe -> Acshion
```

- Objecshions justify why action may be needed.
- Cashes coordinate the work context.
- Acshions are reusable moves attempted inside or for the cashe.

## Cashe Patch Invariant

Every acshion-run must produce a meaningful cashe patch.

This is true even when the run fails. Failure can still:

- add evidence
- collapse uncertainty
- reveal constraints
- disqualify a path
- reduce or increase objecshion pressure
- change what the next acshion should be

If an acshion-run changes nothing in the cashe, it was not a meaningful run or the cashe schema is missing a place to record what was learned.

## Minimum Cashe Contents

```text
Name: <cashe id or title>
Status: seed | active | waiting | blocked | contained | superseded

Target-Objecshions:
  - <objecshion id>

Current-State:
  <summary of what is known now>

Threshold:
  <what condition would make continued action unnecessary?>

Constraints:
  - <limits, permissions, risks, costs, timing>

Candidate-Acshions:
  - <acshion id>

Runs:
  - <acshion-run id or summary>

Decisions:
  - <date, rationale, resulting state>
```

## Source Recovery

Recovered from local ChatGPT source history:

- `69728602-60f4-832b-b8f5-4e9beaa30f58` - Acshions and Cashe Dynamics
