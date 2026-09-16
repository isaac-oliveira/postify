# Status and Setup contract

`.flox/artifacts/status.yaml` is the compact routing index for active work, not
a narrative report. At a new workflow session, read it first, follow its links
instead of scanning artifact directories, and update it at each transition. A
same-session handoff uses the validated snapshot and reopens the index only
when the shared session protocol requires a fresh boundary.

`work_item_id` is the stable delivery identity passed between workflow skills.
Filenames and `kind` may change as it moves from planning to an implementation
Story, but every handoff resolves the same ID and preserves unrelated items.

Schema 2 stores the additive genealogy in `work_items`: an Epic points to its
PRD through `prd`, and a Story points to its Epic through `epic`. This list is
the only status and genealogy index. Resolve one snapshot by exact ID and kind;
never create a parallel genealogy section, scan directories, infer filenames,
or repair a missing link from an artifact map.

## Setup marker precondition

Before creating or changing any spec, Story, artifact, source file, test, or
status entry, require a valid versioned Setup marker in `.flox/config.toml`:
supported schema, `state = "valid"`, an ISO validation date, and non-empty
verified references. If the marker is absent, invalid, incompatible, or
`refresh_required`, stop without writing and direct the person to
`$flox-setup`.

## Schema 2 index

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

- `work_items` is the single list of active items. Each entry requires `id`,
  `kind`, `status`, and `file` relative to `.flox/artifacts/`; optional fields
  are `next_action`, `epic`, `prd`, `owner`, `evidence`, and `pentest`. A
  proposed reference carries its pending `next_action` until approval.
- `epic` is the immediate parent of a Story; `prd` is the immediate parent of
  an Epic. A PRD is a root. Each link resolves to exactly one work item of the
  expected kind; missing or ambiguous links block consumers that require it.
- An approved Architecture, UX, or Design System reference is inert and is
  removed from `work_items` by its producer; consumers resolve it by version
  from its planning directory. Traceability stays in the reference and its
  links, not in the index.
- Status values are `proposed`, `approved`, `ready`, `in-progress`, `review`,
  `done`, `blocked`, `deferred`, `rejected`, and `superseded`. `done` means a
  delivery was released or completed by its owning gate; remove it after
  recording the result. Planning parents never become `done`: Release records
  their completion roll-up in the parent artifact and removes the parent plus
  mapped terminal children, preserving unrelated items. The roll-up is
  idempotent and waits when its explicit map is incomplete.
- `blocked` entries reference only `work_item_id`, `reason`, and `evidence`;
  they do not duplicate `status` or `next_action`.
- The fields `focus`, `items`, `next_actions`, and `pending_approvals` were
  removed in schema 2 and must not be written or treated as a source of
  truth.
- Reject `schema < 2`, schema downgrades, duplicate IDs, and ambiguous
  associations. If concurrent mutation is detected or reasonably expected,
  stop without writing.
- Preserve unrelated active items on every update; a skill touches only the
  work items it owns.

## Genealogy and enrichment

- The additive model stores only immediate links in existing entries:
  `EPIC-*` → `PRD-*` through `prd`, and `STORY-*` → `EPIC-*` through `epic`.
- The canonical shape is:

  ```yaml
  - id: EPIC-<id>
    kind: epic
    prd: PRD-<id>
  - id: STORY-<id>
    kind: story
    epic: EPIC-<id>
  ```

  The remaining fields of each entry follow the `work_items` contract above.
- The index is the sole normative source for PRD/Epic/Story relationships;
  artifact maps remain evidence, never a source for reconstructing parents.
- A root PRD may omit a parent. Otherwise a missing parent blocks the consumer
  that needs it with one corrective `next_action`; never guess or repair it.
- The skill that creates or promotes an item sets its link; later skills may not
  alter an existing link.
- The owning migration may enrich schema 2 from an explicit approved mapping,
  preserving unrelated bytes and entries, rejecting conflicting links, and
  making a second pass a no-op.
- The status writer accepts only a closed array of `{source, field, target}`:
  `field` is `prd` for an Epic and `epic` for a Story. Resolve all IDs in the
  same snapshot and require target kind `prd` or `epic` accordingly. Reject
  missing IDs, wrong kinds, duplicate source/field pairs, or conflicting
  targets before writing; an identical existing link is a no-op.
- Enrichment changes only the owning entry: no reverse index, `blocked` change,
  unrelated rewrite, or path-derived mapping. Complete validation before the
  locked atomic write.

## Gate ownership and routing

Unless a documented prerequisite blocks it, use this sequence:

| Stage | Owner | Successful next action |
|---|---|---|
| PRD / Epic / Story planning | owning planning skill | next approved planning handoff |
| Implementation | `$flox-dev-story` | `run flox-code-review` |
| Code Review | `$flox-code-review` | `$flox-pentest` when risk requires it, otherwise `$flox-quality` |
| Pentest | `$flox-pentest` | `run flox-quality` |
| Quality | `$flox-quality` | `run flox-release` |
| Release | `$flox-release` | terminal `done` only with complete rollout evidence |

Optional reference workflows precede Story creation or implementation; Party
Mode never changes routing. A failed prerequisite, finding, or check blocks the
item with evidence and one corrective `next_action`. Code Review is not
terminal and no earlier stage marks a delivery `done`; Release owns parent
completion roll-up.

A gate may receive one `work_item_id` or, without an ID, process every eligible
item whose `next_action` routes to it. Batch processing is one item at a time:
each item keeps its own evidence and explicit approval, there is no combined
approval, a block does not abort other items, and handoffs keep one stable ID.

## Idempotent migration (schema 1 → 2)

This compatibility migration belongs to the owning host or maintenance flow.
Normal workflow skills consume schema 2 and stop before writing on schema 1 or
older; they never migrate a live index as a side effect.

1. Set `schema: 2`.
2. Rename `items` to `work_items`.
3. Merge `next_actions[id=X].action` into `work_items[id=X].next_action`.
4. Remove `focus`, `next_actions`, and `pending_approvals`.

A second migration pass is byte-identical. An association in `next_actions` or
`pending_approvals` without a matching item is ambiguous and blocks migration
until identified. Genealogy enrichment follows the same idempotence rule and
may add only the approved link to its owner; unresolved mappings block only the
consumer that requires them.

## Localization

Keep schema keys, IDs, paths, version tokens, and status enums canonical. Write
human-readable `next_action`, approval, and handoff values in configured
`file_language`, while keeping skill IDs unchanged (for example, translate
`approve Story` and `run flox-dev-story` to the configured language).
