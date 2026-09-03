---
name: flox-dev-story
description: Implement and locally validate one approved Flox Story, then hand it to code review. Use only after flox-create-story has an explicitly approved Story, or when flox-code-review, flox-pentest, or flox-quality routes an authorized correction here; it does not create, approve, review, or release a Story.
---

# Flox Dev Story

Execute the approved Story contract and leave it in `review`. Do not create or
materially rewrite Stories, select agents yourself, approve work, or begin a
new review cycle. Never mark a Story `done`; Review, Pentest, Quality, and
Release own later gates.

## Contracts

- Persona selection and dispatch:
  [../flox-personas/references/contracts/persona-consumer-contract.md](../flox-personas/references/contracts/persona-consumer-contract.md).
- Setup marker, `status.yaml` schema 2, and localization:
  [../flox-personas/references/contracts/status-contract.md](../flox-personas/references/contracts/status-contract.md).
- Consuming approved Architecture/UX/Design System references:
  [../flox-personas/references/contracts/reference-consumption-contract.md](../flox-personas/references/contracts/reference-consumption-contract.md).
- Response shape:
  [../flox-personas/references/contracts/output-contract.md](../flox-personas/references/contracts/output-contract.md).

## Preconditions

- Read `status.yaml` first, then the focused Story and only its direct
  references, task-local files, and relevant project context.
- Require the Story to be `approved`, with an explicit approval record and a
  complete Task Checklist. For a correction, require an explicit scoped handoff
  from exactly one of `$flox-code-review`, `$flox-pentest`, or `$flox-quality`,
  with the selected findings and their evidence. The handoff must identify the
  same `work_item_id` and keep the correction within that gate's findings. A
  Pentest or Quality correction may resolve a `blocked` work item when its
  Story retains the explicit approved decision; it does not create a new
  approval or silently change the Story contract.
- Require a valid Setup marker; if it is missing, invalid, or
  `refresh_required`, stop before writing code or status and direct the person
  to `$flox-setup`.
- Load exactly the approved reference versions recorded in the Story's
  **References** section before executing (per the reference consumption
  contract). A missing reference or gap blocks only the affected segment and
  returns to the user; do not invoke, modify, or invent it.
- Use the Story's approved owner assignments unless a changed plan is
  explicitly authorized; delegate any change to `$flox-personas`.

## Execution

1. Verify each task has clear scope, one approved owner, execution mode,
   dependencies, and definition of done. A missing field blocks that task; do
   not infer it or expand the Story.
2. Execute tasks sequentially by default. Run tasks in parallel or
   asynchronously only when they have no dependency, write conflict, shared
   contract, or shared validation. Give each agent only the context and
   permissions its approved task needs, and keep one writer per shared file or
   contract.
3. Follow the project's Git strategy as documented in
   `.flox/artifacts/planning/git/GIT-ROADMAP.md`. Use exactly the branching
   model, base branch, naming convention, and merge/finish rules it records.
   Validate the repository state, base branch, naming, and conflicts before
   branch operations. Do not invent Git operations the roadmap does not
   describe, do not install or initialize a branching tool, and do not create
   or change branches when a precondition or explicit authorization is
   missing. If the roadmap is absent or has a gap for the needed operation,
   block that step and ask the user to update it via `$flox-setup`.
4. Implement only the approved scope, run the Story Test Plan and relevant
   local checks (including conformity with the consumed Design System and UX
   contracts when applicable), and inspect the resulting diff. Record concise
   execution evidence without changing approved scope, acceptance criteria, or
   decisions.
5. Before leaving the Story in `review`, **finalize the `## Test Plan`** as the
   fixed review roteiro: enumerate each check mapped to an acceptance criterion,
   with concrete steps, expected result, and the execution evidence of what was
   actually built and tested. This finalized Test Plan is the exact, fixed scope
   that `$flox-code-review` passes to the STEM reviewer; do not add, remove, or
   reinterpret acceptance criteria while finalizing it.
6. If implementation reveals a contradiction, out-of-scope request, reference
   gap, task conflict, failing prerequisite, or validation failure, block only
   the affected work, retain evidence, and ask the user for the smallest
   needed decision. Do not silently revise the Story or start another skill.
7. When the approved work and checks pass and the Test Plan is finalized, set
   the Story to `review` in `work_items` with
   `next_action: "run flox-code-review"`. The Quick Dev route may invoke Code
   Review after this handoff, but Dev Story does not run or loop the review
   itself.

## Status and evidence

- Set the Story's `status` to `in-progress` only immediately before approved
  execution begins, and keep the Epic and unrelated items intact.
- Append only implementation result and validation evidence needed for
  traceability; do not alter the approved Story contract.
- On a corrective handoff from Code Review, Pentest, or Quality, return the
  corrected Story to `review` and await a user-initiated new Code Review. Never
  auto-loop correction and review.

## Boundaries

- Do not create, approve, split, merge, or materially rewrite a Story.
- Do not change PRDs, Epics, Architecture, UX, Design System, roadmaps, or
  setup preferences as a side effect of implementation.
- Do not perform Pentest, Quality, Release, or automatic remediation, and do
  not expose credentials or unrelated files to agents.

## Output

Follow the output contract, reporting executed task IDs, files changed,
validation evidence, Git workflow state, and unresolved blockers. When work is
complete, direct the user to `$flox-code-review`.
