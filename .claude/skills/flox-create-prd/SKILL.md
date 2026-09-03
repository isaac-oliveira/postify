---
name: flox-create-prd
description: Guide focused product discovery and create one approved PRD for the next planning step. Use when a product idea, problem, opportunity, or change needs a concise, traceable requirements document before Epics or Stories; it creates and approves the PRD only, never Epics, Stories, specs, or code.
---

# Flox Create PRD

Turn a product request into one concise, traceable PRD. This is an upstream
planning workflow: it produces and approves a PRD and then hands off to
`$flox-create-epics`. It does not create Epics, Stories, implementation specs,
or product code, and the user is the final decision owner.

## Contracts

- Persona selection and dispatch:
  [../flox-personas/references/contracts/persona-consumer-contract.md](../flox-personas/references/contracts/persona-consumer-contract.md).
- PRD file safety, secret scanning, and frontmatter:
  [../flox-personas/references/contracts/artifact-safety-contract.md](../flox-personas/references/contracts/artifact-safety-contract.md).
  The PRD is `PRD-<id>-<slug>.md` under `.flox/artifacts/planning/prds/` with
  frontmatter keys `id`, `title`, and `status`.
- Setup marker, `status.yaml` schema 2, and localization:
  [../flox-personas/references/contracts/status-contract.md](../flox-personas/references/contracts/status-contract.md).
- Response shape:
  [../flox-personas/references/contracts/output-contract.md](../flox-personas/references/contracts/output-contract.md).

## Preconditions

- Read `status.yaml` first and use its active items to route the work,
  preserving unrelated items. Read `.flox/config.toml` for the languages and
  `.flox/project-context.md` plus only the linked brief, architecture, UX, and
  product documents.
- Require a valid Setup marker (per the status contract); if it is absent,
  invalid, or `refresh_required`, stop and direct the person to `$flox-setup`.
- Start from the person's product request. Separate observed facts,
  user-provided decisions, assumptions, and open questions; do not invent
  requirements to fill gaps.

## Workflow

1. Validate that the request is a product discovery or requirements task.
   Identify the desired outcome, users, constraints, dependencies, risks, and
   missing decisions.
2. Ask only questions whose answers could change the product outcome, scope,
   requirements, safety, or validation — in particular the problem or
   opportunity, target users and use context, desired outcome and value
   hypothesis, scope and non-scope, applicable functional and non-functional
   requirements, success criteria, constraints, dependencies, risks,
   assumptions, and open questions. Record non-blocking unknowns as
   assumptions or open questions.
3. Request persona selection from `$flox-personas`, apply the returned
   reviews, and resolve material disagreements with evidence.
4. Following the artifact safety contract, create one PRD with this header:

   ```yaml
   ---
   id: PRD-<id>
   title: "<JSON-escaped title>"
   status: proposed
   ---
   ```

5. Include the problem or opportunity, target users and context, objective,
   value hypothesis, scope, non-scope, functional and non-functional
   requirements when applicable, success criteria, constraints, dependencies,
   risks, assumptions, open questions, related links, approval decision, and
   next action.
6. Update `status.yaml`: add one `prd` work item with `status: proposed` and
   `next_action: "approve PRD"`, preserving unrelated items.
7. Sanitize and rescan the complete PRD and the separate persona
   contributions, then ask the user directly for explicit approval of this
   exact PRD. Silence, partial feedback, or approval of an earlier draft does
   not count. Do not create an Epic, Story, or implementation while approval
   is pending.
8. After explicit approval, set `status: approved`, record the approval
   decision, and set the item next action to `run flox-create-epics`.
   Revalidate containment, symlinks, sanitization, and unambiguous frontmatter
   before writing or handing off.
9. For a revision, preserve the approved requirements, explain the material
   change, return the PRD to `status: proposed`, and require approval again.

## Boundaries

- `$flox-setup` owns broad project discovery; this skill owns the focused
  product requirements workflow.
- `$flox-create-epics` consumes the approved PRD and must not create it.
- `$flox-quick-dev` implements approved Stories through its own gates and does
  not replace product discovery.
- Do not mark the project `done`, create Epics or Stories, or implement code.

## Output

Follow the output contract. At proposal, request explicit approval; after
approval, point to `$flox-create-epics` as the single next action.
