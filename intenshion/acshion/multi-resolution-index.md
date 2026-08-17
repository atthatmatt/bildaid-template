# Multi-Resolution Acshion Index

The Multi-Resolution Acshion Index is a planner-friendly discovery index for acshions.

Earlier notes called this the "fractal index." The better term is multi-resolution because the same acshion is indexed at multiple granularities and queried at different zoom levels.

## Purpose

The index supports two axes:

- **Horizontal discovery:** find composable neighbors by matching `Get` from one acshion to `Use` in another.
- **Vertical discovery:** find general, specific, or sibling variants of essentially the same acshion.

Example:

```text
make-sandwich.Get = sandwich
eat-lunch.Use = sandwich
```

This is a horizontal match.

```text
make-grilled-cheese
```

is a more specific vertical variant of:

```text
make-sandwich
```

## Core Idea

Every acshion produces multiple index slices:

- whole acshion
- `Use` list
- `Get` list
- `Do` text
- each individual `Use` token
- each individual `Get` token
- optional frame/detail/category slices

The index uses a hybrid deterministic pipeline:

- symbolic index for exact normalized token matching
- vector index for fuzzy matching and variant discovery

The deterministic part is the process: same corpus, same normalization, same embedding model version, same thresholds, same ranking rules.

## Canonicalization

Before indexing, calculate stable canonical forms.

### Token Normalization

For each `Use` and `Get` token:

- lowercase
- trim whitespace
- normalize punctuation
- convert spaces to underscores if using handles
- optionally strip temporary revision suffixes for similarity

Example:

```text
Marketing Site Live -> marketing_site_live
```

### Slice Text Normalization

Build stable slice strings:

```text
slice_use_all: Use: bread, cheese, deli_meat
slice_get_all: Get: sandwich
slice_do: Do: spread mayo evenly
slice_acshion_all: Name: ... | Use: ... | Do: ... | Get: ... | Frame: ... | Detail keys: ...
```

## Symbolic Records

Exact indexes are the deterministic backbone.

```text
use_token_index[canon_token] -> acshion_ids
get_token_index[canon_token] -> acshion_ids
```

These support guaranteed horizontal matches.

## Vector Slice Records

Suggested embedding records:

```text
A:acshion_all
A:use_all
A:get_all
A:do_only
A:use_token:<token>
A:get_token:<token>
```

Metadata:

```text
acshion_id
slice_type
tokens_use[]
tokens_get[]
embedding_model_version
```

## Horizontal Discovery

Goal: from acshion `A`, find acshion `B` where `A.Get` satisfies `B.Use`.

### Exact Match

For each `g` in `A.get_tokens`:

```text
candidates = use_token_index[g]
```

Rank by:

1. exact token match count
2. fewer missing inputs
3. optional semantic score

### Fuzzy Fallback

If exact matching yields too few candidates:

1. embed each produced token as `token: <g>`
2. search nearby `use_token` slices
3. filter by threshold
4. rank below exact matches

Fuzzy matching should suggest, not silently assert, interface compatibility.

## Vertical Discovery

Goal: find acshions that are the same idea at a different specificity level.

Use semantic similarity first, then deterministic specificity heuristics.

A candidate is likely more specific when:

- it has equal or greater `Use` constraints
- it has more detail
- its `Get` is subtype-like relative to the source `Get`
- its `Frame` narrows scope

A candidate is likely more general when the opposite is true.

No global ontology is required to start. Objections can later promote stable subtype relations into explicit records.

## Planning Workflow

Given a starting acshion:

1. horizontal step: propose next acshions that consume its gets
2. vertical step: propose substitutions for the current acshion
3. present choices as continue-plan or swap-step options
4. if the chosen path fails, raise an objecshion
5. resolve by adding a missing token, adapter acshion, detail, or link

## Minimum Stored Data

```text
id
use_tokens[]
get_tokens[]
slice_texts{slice_type -> text}
embeddings{slice_type -> vector}
use_token -> [ids]
get_token -> [ids]
```

## Source Recovery

Recovered from local ChatGPT source history:

- `696ab165-9760-8325-9937-f060cfbd9474` - Acshion format & lint, messages 23-32
