---
name: flox-dev-story
description: Implement and locally validate one approved Flox Story, then hand it to code review. Use only after flox-create-story has an explicitly approved Story, or when flox-code-review, flox-pentest, or flox-quality routes an authorized correction here; it does not create, approve, review, or release a Story.
---

# Flox Dev Story

Execute one approved Story and leave it in `review`. Do not create, approve,
materially rewrite, or mark a Story `done`; Review, Pentest, Quality, and
Release own later gates.

## Contracts

Apply the shared [workflow contract](../flox-personas/references/contracts/workflow-contract.md)
and [reference-consumption contract](../flox-personas/references/contracts/reference-consumption-contract.md).

## Preconditions

Require `status: approved`, an explicit approval record, a complete Task
Checklist, and the validated routed snapshot. A correction additionally needs
one scoped handoff from exactly one of `$flox-code-review`, `$flox-pentest`, or
`$flox-quality`, with the same `work_item_id`, selected findings, and evidence;
it may resolve a `blocked` work item without changing the approved Story.
Load exactly the approved Architecture/UX/Design System versions recorded in
References; a missing or gapped reference blocks only its segment. Use the
approved owner assignments and do not change them locally.

## Workflow

1. Verify every task has clear scope, one owner, execution mode, dependencies,
   and definition of done. A missing field blocks that task.
2. Execute sequentially unless tasks have no dependency, write conflict,
   shared contract, or shared validation. Keep one writer per shared file.
3. Follow `.flox/artifacts/planning/git/GIT-ROADMAP.md` exactly: validate the
   base branch, naming, state, and conflicts before branch operations; create
   no unrecorded operation and stop for a roadmap gap. Set the item to
   `in-progress` only immediately before approved execution; after a transition,
   item change, mutation, or required security recheck, start the fresh read
   required by the shared contract.
4. Implement only approved scope. Run the Story Test Plan and relevant local
   structure, refs/assets, output, status, approval, `node --check`, and
   `git diff --check` validations. Inspect the diff and record concise evidence.
5. Finalize `## Test Plan` as the fixed review roteiro: enumerate each check
   mapped to an AC with steps, expected result, and actual execution evidence.
   Do not add, remove, or reinterpret acceptance criteria.
6. On contradiction, out-of-scope request, reference gap, conflict, failed
   prerequisite, or validation failure, block only the affected work with
   evidence and ask for the smallest decision; do not silently rescope.
7. When approved work and checks pass, set this item to `review` with exactly
   `next_action: "run flox-code-review"`.

On a corrective handoff from Code Review, Pentest, or Quality, return the
corrected Story to `review` and await a new user-initiated Code Review; never
auto-loop it or invoke later gates.

## Boundaries

Do not modify PRDs, Epics, references, roadmaps, Setup, unrelated work items,
or unrelated files. Do not perform Review, Pentest, Quality, Release, or
automatic remediation. Preserve the approved Story contract and never expose
secrets or unrelated content.

## Output

Report executed task IDs, changed files, validation evidence, Git workflow
state, and blockers. Direct the person to `$flox-code-review`. End with
`## Changed files` listing created or modified relative paths.
