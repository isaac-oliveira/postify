---
name: flox-create-epics
description: Create delivery Epics and an initial Story-name map from an approved PRD, without writing detailed Stories. Use after a PRD is approved and before Stories exist; it defines Epic boundaries and names Stories only, never their acceptance criteria, tasks, or implementation.
---

# Flox Create Epics

Turn an approved PRD into one or more delivery Epics and an initial map of
Story IDs and names. This is an upstream planning step; it does not create
detailed Stories or implement product changes. `done` means the delivery was
released by `flox-release`, never that this planning step finished.

## Contracts

- Persona selection and dispatch:
  [../flox-personas/references/contracts/persona-consumer-contract.md](../flox-personas/references/contracts/persona-consumer-contract.md).
- Consuming the PRD path and writing the Epic file safely (untrusted routed
  path, containment, no-follow, no-clobber, frontmatter):
  [../flox-personas/references/contracts/artifact-safety-contract.md](../flox-personas/references/contracts/artifact-safety-contract.md).
  The Epic is `EPIC-<id>-<slug>.md` under
  `.flox/artifacts/implementations/epics/`.
- Setup marker, `status.yaml` schema 2, and localization:
  [../flox-personas/references/contracts/status-contract.md](../flox-personas/references/contracts/status-contract.md).
- Response shape:
  [../flox-personas/references/contracts/output-contract.md](../flox-personas/references/contracts/output-contract.md).

## Preconditions

- Read `status.yaml` first and inspect only the linked context, PRD, and
  relevant planning files. Read `.flox/project-context.md` when it exists.
- Require a valid Setup marker; if it is absent, invalid, or
  `refresh_required`, stop and direct the person to `$flox-setup`.
- Require an existing PRD with an explicit `status: approved` header produced
  by `$flox-create-prd` (exactly one frontmatter block, one of each required
  key, a safely escaped `title`). Treat the PRD path from `status.yaml` as
  untrusted and validate it per the artifact safety contract before reading.
  If the PRD is missing, ambiguous, or not approved, stop with the exact
  missing prerequisite and the action needed to provide it. Do not create or
  approve a PRD here.

## Workflow

1. Validate the approved PRD header and identify its stable ID, slug,
   objective, constraints, risks, dependencies, and any linked architecture
   or UX.
2. Propose a deterministic Epic ID and slug. A PRD may own many Epics, and an
   Epic may contain many Stories. Keep each relationship explicit in both
   artifacts: the Epic links to its PRD, and the PRD lists the Epic.
3. Draft the Epic from [assets/epic-template.md](assets/epic-template.md)
   under `.flox/artifacts/implementations/epics/`. Include the linked PRD,
   objective, boundaries, risks, dependencies, non-scope, and a short ordered
   Story map of only Story IDs and actionable Story names.
4. Make Story names specific enough to guide the next skill — a verb, expected
   result, and an explicit limit when useful. Do not add acceptance criteria,
   implementation tasks, technical designs, or detailed Story sections.
5. Update the PRD only to add or revise its related-Epic links, preserving its
   approved requirements.
6. Record the Epic in `status.yaml` as one `epic` work item with
   `status: proposed` and `next_action: "approve Epic and Story map"`.
   After explicit user approval, set it to `status: approved`; on handoff, set
   it to `status: ready` with `next_action: "run flox-create-story"`.
   Keep the Epic focused and never use `done` here.
7. Present each persona contribution separately, then request the user's
   explicit approval. Do not hand off an unapproved Epic or map.

## Boundaries

- Do not create files under `implementations/stories/`, write detailed
  Stories, edit PRDs beyond reciprocal Epic links, or run development, code
  review, pentest, QA, or release.
- The next planning step is `$flox-create-story`, followed by
  `$flox-dev-story` for implementation. `$flox-quick-dev` is a separate route
  for an independently small task and does not replace the Epic-to-Story
  handoff.

## Output

Follow the output contract. Request the user's approval of the Epic and Story
map, or after approval point to `$flox-create-story` as the single next
action.
