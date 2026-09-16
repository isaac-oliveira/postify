---
name: flox-create-story
description: Create one concise, approval-ready Flox delivery Story from an approved Epic map or a small-task handoff. Use after an Epic map is approved, when flox-quick-dev needs a Story, or when a user asks to draft, revise, or approve a Story; it never implements the Story.
---

# Flox Create Story

Produce the one detailed Story contract that precedes `$flox-dev-story`.
Create a proposal and wait for explicit user approval.

## Contracts

Apply the shared [workflow contract](../flox-personas/references/contracts/workflow-contract.md),
artifact contract, and [reference-consumption contract](../flox-personas/references/contracts/reference-consumption-contract.md).

## Preconditions

Resolve one exact Story ID from `work_items`, an approved Epic map, or an
approved `$flox-quick-dev` handoff. Read only that item, linked parents,
approved references, and task-local context. Never infer a Story from an
unapproved source. Use the template only as a scaffold; write the artifact in
configured `file_language`.

## Workflow

1. Validate the approved/ready Epic map or Quick Dev scope and uniqueness of
   the Story ID.
2. Identify value, outcome, dependencies, risks, and material gaps without
   inventing the User Story. Resolve Architecture/UX/DS applicability for all
   three types and record exact approved versions; recommendation is not
   authorization.
3. Request `$flox-personas` task owners. Every task needs scope, one owner,
   execution mode, dependencies, and definition of done.
4. Use [assets/story-template.md](assets/story-template.md). Keep tasks
   sequential unless there is no dependency, write conflict, shared contract,
   or shared validation. Map each AC to a Test Plan check; Dev Story adds
   concrete steps and evidence.
5. Write one `proposed` Story and its index entry with
   `next_action: "approve Story"`. Request approval of that exact version.
   On approval set `approved` and `next_action: "run flox-dev-story"`; a
   material revision returns to `proposed`, and rejection stops handoff.

## Boundaries

Do not modify the Epic map, PRD, references, source, tests, branches, or
deployment; do not select personas outside `$flox-personas`; and do not
implement or declare completion.

## Output

Follow the output contract. Present the complete Story and contributions;
request approval while proposed and point to `$flox-dev-story` after approval.
End with `## Changed files` and every relative path.
