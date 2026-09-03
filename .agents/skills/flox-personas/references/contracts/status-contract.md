# Status and Setup contract

`.flox/artifacts/status.yaml` is the compact routing index for active work —
not a narrative document and not a report. Read it first in every workflow
skill, follow its links instead of scanning artifact directories, and update
it at every state transition.

`work_item_id` is the stable delivery identity passed between workflow skills.
Artifact filenames and `kind` may change as a work item moves from a spec or
planning artifact to its implementation Story, but every handoff must resolve
exactly the same ID and preserve unrelated items.

## Setup marker precondition

Before creating or changing any spec, Story, artifact, source file, test, or
status entry, require a valid versioned Setup marker in `.flox/config.toml`:
supported schema, `state = "valid"`, an ISO validation date, and non-empty
verified references. If the marker is absent, invalid, incompatible, or
`refresh_required`, stop without writing and direct the person to
`$flox-setup`.

## Schema 2

```yaml
schema: 2
project_status: active
work_items:
  - id: STORY-<id>
    kind: story
    status: in-progress
    file: implementations/stories/STORY-<id>-<slug>.md
    next_action: "run flox-code-review"
    epic: EPIC-<id>
blocked: []
updated_at: <yyyy-mm-dd>
```

- `work_items` is the single list of active items. Required fields per entry:
  `id`, `kind`, `status`, `file` (relative to `.flox/artifacts/`). Optional:
  `next_action`, `epic`, `owner`, `evidence`. While a reference item is still
  `proposed` and awaiting approval, carry its pending `next_action`.
- An optional reference (Architecture, UX, or Design System) is **removed from
  `work_items` on approval** by its producing skill, because an approved
  reference is inert: it has no pending action and downstream skills resolve it
  by version from its planning directory. Traceability then lives in the
  reference artifact and its links, not in the index — the same principle as the
  completion roll-up of planning parents. Do not keep an approved reference in
  `work_items`.
- Status values: `proposed`, `approved`, `ready`, `in-progress`, `review`,
  `done`, `blocked`, `deferred`, `rejected`, `superseded`. Remove terminal
  `done` items from the index after recording the result in their artifact.
  `done` means the delivery has been released or completed by the owning
  gate, never that a planning step finished.
- Planning parents (`prd`, `epic`) never receive `done`; that status is
  reserved for the released delivery. They reach end of life by **completion
  roll-up** driven by the delivery gate: once every child is delivered or
  otherwise terminal, `$flox-release` records the closing result in the
  parent's own artifact and **removes the parent from `work_items`**.
  Traceability then lives only in the bidirectional artifact links (the Epic's
  `**PRD:**` header and `## Mapa de Stories`, the PRD's related-Epic links),
  not in the index. The roll-up is idempotent: it neither recreates nor
  re-deletes an already-removed parent.
- `blocked` entries reference only `work_item_id`, `reason`, and `evidence`;
  they do not duplicate `status` or `next_action`.
- The fields `focus`, `items`, `next_actions`, and `pending_approvals` were
  removed in schema 2 and must not be written or treated as a source of
  truth.
- Reject any snapshot with `schema < 2` as obsolete, reject schema
  downgrades, and reject duplicate IDs in `work_items`. Resolve each item by
  its ID; reject ambiguous associations where the same ID appears more than
  once. If concurrent mutation is detected or reasonably expected, stop
  without writing.
- Preserve unrelated active items on every update; a skill touches only the
  work items it owns.

## Gate ownership and routing

Use this sequence for a delivery work item unless a documented prerequisite
blocks it:

| Stage | Owner | Successful next action |
|---|---|---|
| PRD / Epic / Story planning | owning planning skill | next approved planning handoff |
| Implementation | `$flox-dev-story` | `run flox-code-review` |
| Code Review | `$flox-code-review` | `$flox-pentest` when risk requires it, otherwise `$flox-quality` |
| Pentest | `$flox-pentest` | `run flox-quality` |
| Quality | `$flox-quality` | `run flox-release` |
| Release | `$flox-release` | terminal `done` only with complete rollout evidence |

The optional Architecture, UX, and Design System workflows produce approved
versioned references before Story creation or implementation; Party Mode never
changes this routing. A failed prerequisite, finding, or check sets the
resolved item to `blocked`, records evidence, and names one corrective
`next_action`. Code Review is not terminal, and no earlier stage may mark the
delivery `done`. The terminal closure of a `prd` or `epic` is not a planning
handoff: it is a completion roll-up performed by `$flox-release` when the
parent's last child is delivered, which removes the parent from `work_items`
without ever setting it to `done`.

A gate skill (`$flox-pentest`, `$flox-quality`, `$flox-release`) may be invoked
either for a specific `work_item_id` or, without an ID, over every eligible
work item — those whose `next_action` routes them to that gate. Batch
invocation resolves each eligible item independently, one item fully at a time,
with its own evidence and its own explicit approval; there is no combined
approval, and a block on one item never aborts the others. Handoffs between
skills still carry a single stable `work_item_id`.

## Idempotent migration (schema 1 → 2)

This compatibility migration is a preflight concern of the owning host or
maintenance flow. Normal workflow skills consume schema 2 and must stop before
writing when they receive schema 1 or older; they must not silently migrate a
live index as a side effect of another workflow.

1. Set `schema: 2`.
2. Rename `items` to `work_items`.
3. Merge `next_actions[id=X].action` into `work_items[id=X].next_action`.
4. Remove `focus`, `next_actions`, and `pending_approvals`.

A second pass over an already-migrated file produces an identical result. An
association in `next_actions` or `pending_approvals` with no matching
`work_item` is rejected as ambiguous and blocks migration until the person
identifies it.

## Localization

Keep schema keys, IDs, paths, version tokens, and status enum values
canonical. Write human-readable persisted values — `work_items[].next_action`,
approval decisions, and handoff text — in the configured `file_language`,
keeping skill IDs unchanged inside translated text. For example, with
`file_language = "pt-BR"`, persist the configured-language equivalents of
`approve Story` and `run flox-dev-story`, rather than hard-coding English.
