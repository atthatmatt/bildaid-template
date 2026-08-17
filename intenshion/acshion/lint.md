# Simon Lint For Acshions

Lint is Simon's deterministic gatekeeping layer for acshion documents.

Lint should be a calculator, not a correlator. It enforces the minimum structure needed for acshions to be parsed, understood, composed, and refined. Interpretation and judgment belong in review, not lint.

Recommended command split:

```text
nosh lint    # calculator-only; fast, deterministic, CI-friendly
nosh review  # correlator-assisted; suggestions, not pass/fail
```

## Lint Contract

Lint checks structure. It should not decide whether an acshion is wise, useful, tasteful, or sufficiently atomic in a deep semantic sense.

## Required Errors

### Missing Required Sections

An acshion must include:

- `Name`
- `Use`
- `Do`
- `Get`

Empty required sections are errors.

### Name Uniqueness

`Name` must be unique within the acshion registry.

Ordinary version numbers should not be encoded into `Name`.

### Detail Key Grounding

Every top-level `Detail` key must appear in `Use`, `Do`, or `Get`, or must be explicitly declared in `Aliases`.

This keeps `Detail` from becoming an ungrounded junk drawer.

### Link Validation

For each `Link` line:

- referenced acshion names must exist or be marked TODO
- referenced nouns or targets must exist in this acshion's `Use`, `Do`, or `Get`
- the line must follow an allowed pattern

Allowed patterns:

```text
expand <target>: <acshion> > <acshion>
provide <noun>: <acshion>
achieve <get_noun>: <acshion> + <acshion>
```

### Required Cashe Patch For Runs

An acshion-run record must explain what changed in the cashe.

Minimum fields:

- `Bind`
- `Observed`
- `Evidence`
- `CasheDelta`
- `PolishyDelta`

If `CasheDelta` is empty, it was not a meaningful run.

## Warnings

Warnings should not block by default. They identify likely objecshions.

### Vague Gets

Warn on pure evaluation terms:

- `good`
- `done`
- `ready`
- `better`
- `improved`

The fix is usually a stronger get handle, a `Checks` section, or a domain-specific detail entry.

### Hidden Tool Requirements

Warn when `Do` strongly implies a tool that is absent from `Use`.

Example:

```text
Use: bread, mayonnaise
Do: spread mayonnaise evenly
```

Likely objection: `spread` implies a spreading tool.

### Procedure Leakage In Detail

Warn when `Detail` appears to contain steps:

- numbered lists
- repeated `then`
- repeated `next`
- imperative verbs that should probably be in `Do`

### Suspicious Link Cycles

Warn on cycles in `Link`, especially cycles involving `expand`.

Some cycles may be valid in a larger graph, but they should be reviewed.

## Correlator Review

Correlator review may:

- suggest better state handles
- suggest likely splits or adapter acshions
- infer candidate links from noun overlap
- propose minimal detail to resolve an objecshion
- identify when `Do` hides an important interface

Review produces suggestions. Lint produces pass/fail.

## Source Recovery

Recovered from local ChatGPT source history:

- `696ab165-9760-8325-9937-f060cfbd9474` - Acshion format & lint
