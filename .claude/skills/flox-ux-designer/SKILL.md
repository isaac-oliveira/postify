---
name: flox-ux-designer
description: Produce one versioned, approvable UX reference and a linked HTML demonstration preview for a planned Flox change, so flows, screens, states, actions, responsiveness, and accessibility are decided before implementation. Optional workflow invoked only with explicit user permission; the preview is never final implementation or automatic approval.
---

# Flox UX Designer

Produce the single versioned UX reference (plus an HTML demonstration preview)
that optional Flox planning may consume before `$flox-create-story` and
`$flox-dev-story`. Create a proposal and wait for explicit user approval. Never
implement product code, approve the reference, run another workflow skill, or
create a parallel UX producer.

## Contracts

- Optional-reference workflow (permission, personas, versioning, preview,
  approval, shared boundaries):
  [../flox-personas/references/contracts/optional-reference-workflow.md](../flox-personas/references/contracts/optional-reference-workflow.md).
- Persona selection and dispatch:
  [../flox-personas/references/contracts/persona-consumer-contract.md](../flox-personas/references/contracts/persona-consumer-contract.md).
- Reference file safety and frontmatter:
  [../flox-personas/references/contracts/artifact-safety-contract.md](../flox-personas/references/contracts/artifact-safety-contract.md).
- Setup marker, `status.yaml` schema 2, and localization:
  [../flox-personas/references/contracts/status-contract.md](../flox-personas/references/contracts/status-contract.md).
- Layer precedence and downstream consumption:
  [../flox-personas/references/contracts/reference-consumption-contract.md](../flox-personas/references/contracts/reference-consumption-contract.md).
- Response shape:
  [../flox-personas/references/contracts/output-contract.md](../flox-personas/references/contracts/output-contract.md).

## Layer and scope

This skill owns the experience layer only. When Architecture is applicable,
respect the technical boundaries it supplies; when a Design System is
applicable, consume its approved components, props, variants, and states
instead of inventing new ones. Never redefine technical limits or component
contracts. Do not assert user research, usability testing, analytics, or
interviews that were not performed — record any such absence as a gap or
assumption.

## Workflow

Follow the optional-reference workflow. Beyond its shared steps:

1. Confirm explicit permission and a resolvable target work item.
2. Identify the applicable flows, screens, states, actions, responsive
   behavior, and accessibility boundaries.
3. Build the reference from
   [assets/ux-reference-template.md](assets/ux-reference-template.md) under
   `.flox/artifacts/planning/ux-designs/UX-<id>-<slug-curto>-v<version>.md`,
   using one to three short keywords such as `UX-001-init-flow-v1.md`, and
   produce `UX-<id>-<slug-curto>-v<version>.html` as the linked HTML
   demonstration preview bound to the exact version.
4. Update `status.yaml` with `next_action: "approve UX reference"`, then
   request explicit approval of the exact version.

## Boundaries

Beyond the shared optional-reference boundaries: do not create or modify PRDs,
Epics, Architecture, Design System, roadmaps, or Setup preferences, and do not
declare the work complete.

## Output

Follow the output contract, including the linked HTML preview marked as a
demonstration and the separated observations/assumptions/gaps. While the
proposal is pending, revise the same version in place — never open a new
version before approval. Ask the user to approve the proposed version or state
the prerequisite that blocks it; on approval, mark that version approved and
remove the reference item from `work_items`.
