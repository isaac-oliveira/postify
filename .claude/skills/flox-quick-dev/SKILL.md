---
name: flox-quick-dev
description: Handle a small, well-scoped development task through a coherence check, a spec approval, and a separate Story approval, then delegate implementation. Use for a focused change that does not need full PRD/Epic planning; it delegates Story creation, implementation, and review to the owning skills instead of doing them inline.
---

# Flox Quick Dev

The reduced route for a small, well-scoped task. Validate that the request
makes sense in context, then use two explicit approval gates — specification
first, implementation Story second — and delegate. This skill does not replace
Epic or PRD planning, and it does not create, implement, review, or approve
the Story itself.

## Contracts

- Persona selection and dispatch:
  [../flox-personas/references/contracts/persona-consumer-contract.md](../flox-personas/references/contracts/persona-consumer-contract.md).
- Spec file safety and frontmatter:
  [../flox-personas/references/contracts/artifact-safety-contract.md](../flox-personas/references/contracts/artifact-safety-contract.md).
- Setup marker, `status.yaml` schema 2 enforcement, and localization:
  [../flox-personas/references/contracts/status-contract.md](../flox-personas/references/contracts/status-contract.md).

## Artifact layout

```text
.flox/artifacts/
├── status.yaml                         # the only status index
├── planning/{briefs,architecture,ux-designs,design-system,prds,git}/
└── implementations/
    ├── epics/
    ├── specs/                          # specs awaiting approval
    ├── stories/                        # Story proposals and approved contracts
    └── sprints/<sprint-id>/
        └── _backlog/deferred-work/
```

## Preconditions

- Read `status.yaml` first and require schema 2. If it is schema 1 or older,
  stop before writing and direct the person to run `flox update`, then
  `$flox-setup`, before retrying; do not migrate a live index as a side effect
  of Quick Dev. Use the active `work_item` for first context and inspect other
  items only when the request refers to them.
- Read `.flox/project-context.md` if it exists, then only the documents linked
  by the status index and relevant to the request.
- Require a valid Setup marker; if it is absent, invalid, or
  `refresh_required`, stop and direct the person to `$flox-setup`.

## Workflow

1. Validate the request before drafting: identify the desired outcome and why
   it matters, check alignment with the active epic/sprint/story and project
   rules, and identify missing context, contradictions, dependencies, risks,
   and scope. Ask only questions whose answer could materially change the
   outcome, scope, implementation, or safety; state assumptions for
   non-blocking unknowns; and always present useful suggestions marked as
   required or optional. If a blocking question or contradiction remains, stop
   and resolve it before creating a spec.
2. Create a spec from
   [assets/spec-template.md](assets/spec-template.md) at
   `.flox/artifacts/implementations/specs/SPEC-<id>-<slug>.md` with the
   objective, context, assumptions, questions, suggestions, scope, out-of-
   scope items, implementation approach, acceptance criteria, risks, and
   validation plan. Add it to `work_items` with `status: proposed` and
   `next_action: "approve Spec"`.
3. Show the complete spec and require the first explicit approval. Do not
   create a Story, delegate implementation, or modify source code, tests, or
   unrelated files while this approval is pending. If the spec is rejected or
   changed, mark it `rejected` or revise it and request approval again. After
   approval, mark the spec work item `approved` and set its `next_action` to
   `run flox-create-story` before handing it off.
4. After spec approval, delegate Story creation to `$flox-create-story` for the
   same `work_item_id`, passing the approved scope, decisions, and acceptance
   criteria. Do not create, rewrite, or approve the Story directly.
5. When `$flox-create-story` has an explicitly approved Story, hand off only
   the approved Story contract to `$flox-dev-story` for the same
   `work_item_id`. Do not implement code or start a proposed Story yourself.
   The first spec approval does not authorize implementation.
6. After implementation reaches `review`, invoke `$flox-code-review` exactly
   once for that `work_item_id`. `$flox-code-review` owns the review decision
   and any routing of corrections back to `$flox-dev-story`; do not loop it.
   Review approval does not close the item: it triggers a risk assessment and
   routes the same `work_item_id` forward to `$flox-pentest` (when required) or
   `$flox-quality`, and the delivery is only `done` after `$flox-release`.

## Corrective review cycle

When `$flox-code-review` routes findings back through this route, preserve the
reviewer's evidence and acceptance impact and let `$flox-dev-story` implement
the smallest correction, returning the Story to `review` for an independent
re-review. Do not mark the Story `done`; a reviewed Story advances through
Pentest (when required), Quality, and Release, and only `$flox-release` marks
the delivery `done`.

## Boundaries

- Every handoff resolves the same `work_item_id`, preserves unrelated active
  items, and sets exactly one `next_action`. This skill never writes or treats
  global `focus`, `items`, `next_actions`, `pending_approvals`, or `flow_id`
  as a source of truth.
- The two approvals are mandatory: spec approval, then Story approval. A spec
  is a proposal; the Story is the implementation contract; never implement
  directly from a spec.
- Persona selection is delegated to `$flox-personas`; keep no roster or
  selection rules here. Follow existing project conventions and keep changes
  focused.
