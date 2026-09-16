---
name: flox-create-epics
description: Create delivery Epics and an initial Story-name map from an approved PRD, without writing detailed Stories. Use after a PRD is approved and before Stories exist; it defines Epic boundaries and names Stories only, never their acceptance criteria, tasks, or implementation.
---

# Flox Create Epics

Turn an approved PRD into delivery Epics and an initial map of Story IDs and
names. `done` belongs to released delivery, not this planning step.

## Contracts

Apply the shared [workflow contract](../flox-personas/references/contracts/workflow-contract.md)
and artifact contract. Epics live under
`.flox/artifacts/implementations/epics/`.

## Preconditions

Read only linked context, PRD, and relevant planning files. Require the exact
status-approved PRD from `$flox-create-prd`, with one safe frontmatter block
and escaped title; validate its routed path before reading. If missing,
ambiguous, or unapproved, report the prerequisite and stop.

## Workflow

1. Validate PRD ID, slug, objective, constraints, risks, dependencies, and
   linked optional references.
2. Choose deterministic Epic IDs/slugs and keep reciprocal PRD/Epic links.
3. Use [assets/epic-template.md](assets/epic-template.md) to create each Epic
   with boundaries, risks, dependencies, non-scope, and an ordered map of
   actionable Story IDs/names only. Do not add Story criteria or designs.
4. Update the PRD only for related-Epic links.
5. Add each `epic` item as `proposed` with
   `next_action: "approve Epic and Story map"`. After explicit approval use
   `approved`, then `ready` with `next_action: "run flox-create-story"`.
6. Present persona contributions and request explicit approval before handoff.

## Boundaries

Do not create detailed Stories, modify PRD requirements, implement code, or
run review, Pentest, Quality, or Release. `$flox-create-story` is the next
planning step; `$flox-quick-dev` is an independent route.

## Output

Follow the output contract, show each contribution, request approval of the
Epic/map, and after approval point to `$flox-create-story`. End with
`## Changed files` and every relative path.
