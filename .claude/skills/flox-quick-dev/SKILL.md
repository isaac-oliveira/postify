---
name: flox-quick-dev
description: Handle a small, well-scoped development task through a coherence check, a spec approval, and a separate Story approval, then delegate implementation. Use for a focused change that does not need full PRD/Epic planning; it delegates Story creation, implementation, and review to the owning skills instead of doing them inline.
---

# Flox Quick Dev

Use the reduced route for one small, coherent task. It owns neither Stories,
implementation, review, nor release; it delegates each to its owning skill.

## Contracts

Apply the shared [workflow contract](../flox-personas/references/contracts/workflow-contract.md)
and artifact contract. Use one stable `work_item_id` and preserve unrelated
items at every handoff.

## Preconditions

At session start require schema-2 `status.yaml`, valid Setup, and only the
linked/task-local context. If the index is schema 1 or older, stop and direct
the person to `flox update`, then `$flox-setup`; never migrate it here.

## Workflow

1. Check the request's outcome, alignment, scope, risks, dependencies,
   contradictions, and missing decisions. Ask only material questions and
   label suggestions required or optional. Stop for a blocker.
2. Create one spec at
   `.flox/artifacts/implementations/specs/SPEC-<id>-<slug>.md` from
   [assets/spec-template.md](assets/spec-template.md), covering objective,
   context, scope/non-scope, approach, acceptance criteria, risks, and checks.
   Add it as `proposed` with `next_action: "approve Spec"`.
3. Show the complete spec and require its explicit approval. On approval mark
   it `approved` and route to `$flox-create-story`; revise or reject without
   delegating when requested.
4. After Story approval, hand only the approved Story contract to
   `$flox-dev-story` for the same ID. Do not implement directly.
5. When implementation reaches `review`, invoke `$flox-code-review` exactly
   once. Its corrections return through `$flox-dev-story`; do not loop.

The two approvals are mandatory: spec, then Story. Review approval continues
through Pentest when required or Quality, then Release; only Release closes.

## Boundaries

Do not create or approve a Story, implement code, review, change global status
fields, or skip an approval. Do not create parallel state or modify unrelated
items. `$flox-quick-dev` does not replace PRD/Epic planning for broader work.

## Output

Report the spec and Story handoffs, each status transition, and exactly one
next action at the current gate. End with `## Changed files` listing every
created or modified relative path.
