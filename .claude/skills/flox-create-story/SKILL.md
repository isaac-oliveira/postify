---
name: flox-create-story
description: Create one concise, approval-ready Flox delivery Story from an approved Epic map or a small-task handoff. Use after an Epic map is approved, when flox-quick-dev needs a Story, or when a user asks to draft, revise, or approve a Story; it never implements the Story.
---

# Flox Create Story

Produce the single detailed Story contract that precedes `$flox-dev-story`.
Create a proposal and wait for explicit user approval. Never implement code,
approve the Story yourself, or create a parallel Story producer.

## Contracts

- Persona selection and dispatch:
  [../flox-personas/references/contracts/persona-consumer-contract.md](../flox-personas/references/contracts/persona-consumer-contract.md).
- Story file safety and frontmatter:
  [../flox-personas/references/contracts/artifact-safety-contract.md](../flox-personas/references/contracts/artifact-safety-contract.md).
  The Story is `STORY-<id>-<slug>.md` under
  `.flox/artifacts/implementations/stories/`.
- Setup marker, `status.yaml` schema 2, and localization:
  [../flox-personas/references/contracts/status-contract.md](../flox-personas/references/contracts/status-contract.md).
- Consuming approved Architecture/UX/Design System references:
  [../flox-personas/references/contracts/reference-consumption-contract.md](../flox-personas/references/contracts/reference-consumption-contract.md).
- Response shape:
  [../flox-personas/references/contracts/output-contract.md](../flox-personas/references/contracts/output-contract.md).

## Preconditions

- Read `status.yaml` first and resolve the target by matching the Story ID in
  `work_items`, or by the exact stable `work_item_id` in an approved
  `$flox-quick-dev` handoff; then read only that item, its linked Epic/PRD,
  approved applicable references, and task-local context.
- Require a valid Setup marker; if it is absent, invalid, or
  `refresh_required`, stop and direct the person to `$flox-setup`.
- Accept one source only: a selected item in an approved (`approved` or
  `ready`) Epic map, or the approved scoped handoff from `$flox-quick-dev`. Do
  not infer a Story from a broad request or an unapproved Epic, PRD, or spec.
- The canonical template in `assets/story-template.md` is a source scaffold;
  do not infer the artifact language from it. Write the Story itself in the
  configured `file_language`, which applies to persisted `.flox/` artifacts,
  not to canonical framework files.

## Workflow

1. Validate the source: the Epic is `approved` or `ready`, its map contains
   the selected stable Story ID, and no non-terminal artifact already owns
   that ID. For a Quick Dev handoff, validate its approved scope and source
   reference.
2. Identify missing user value, goal, benefit, acceptance outcome,
   dependencies, and risks. Ask only questions whose answer could materially
   change scope, safety, behavior, or validation; record other unknowns as
   assumptions. Do not invent the User Story.
3. Resolve reference applicability per the reference consumption contract and
   record it in the Story's **References** section for all three types
   (Architecture, UX, Design System). A recommendation to use an optional
   reference is not authorization to invoke it.
4. Request task-agent selection from `$flox-personas`. A task without clear
   scope, one owner, execution mode, dependencies, and a verifiable definition
   of done remains a gap and is not dispatched.
5. Build the Story from [assets/story-template.md](assets/story-template.md),
   keeping it concise and adding only applicable information. Assign each task
   an execution mode: `parallel` or `asynchronous` only when there is no
   dependency, write conflict, shared contract, or shared validation;
   otherwise `sequential`. Set up the **Test Plan** section by mapping each
   acceptance criterion to a check with an observable expected result; leave the
   concrete steps and execution evidence for `$flox-dev-story` to finalize as the
   fixed review roteiro. Do not create separate specs, tasks, or designs here.
6. Write exactly one proposed Story under the canonical stories root
   (following the artifact safety contract). For an Epic source, add one new
   Story entry to `status.yaml`; for a Quick Dev handoff, update the existing
   entry for the same `work_item_id` and change its `kind` and `file` to the
   Story while preserving the stable ID. In both cases use `status: proposed`
   and `next_action: "approve Story"`, preserving unrelated items.
7. Present the proposed Story and request explicit approval of that exact
   version. Silence, approval of the Epic, or approval of a prior revision is
   insufficient. Do not invoke `$flox-dev-story` while approval is pending.
8. On explicit approval, mark the Story `approved` and set its `next_action`
   to `run flox-dev-story` (`$flox-dev-story` alone moves it to
   `in-progress` and later `review`). On a requested material change, revise
   and keep it `proposed`; on rejection, mark it `rejected` and do not hand it
   off.

## Boundaries

- Do not modify the Epic map, PRD, Architecture, UX, Design System, source
  code, tests, branches, or deployment state.
- Do not select, call, or permanently assign agents outside `$flox-personas`.
- Do not declare the Story complete; development, review, Pentest, Quality,
  and Release own their later transitions.

## Output

Follow the output contract. Ask the user to approve the proposed Story or
state the prerequisite that blocks it.
