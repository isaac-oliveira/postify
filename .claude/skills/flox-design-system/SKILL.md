---
name: flox-design-system
description: Produce one versioned, approvable Design System reference and a linked HTML demonstration preview for a planned Flox change, so reusable tokens, components, props/contracts, variants, states, responsiveness, and accessibility are decided before implementation. Optional workflow invoked only with explicit user permission; reuse an existing usable system instead of competing with it, and never treat the preview as final implementation or automatic adoption.
---

# Flox Design System

Produce the single versioned Design System reference (plus an HTML
demonstration preview) that optional Flox planning may consume before
`$flox-create-story` and `$flox-dev-story`. Create a proposal and wait for
explicit user approval. Never implement product components, approve or adopt
the reference, run another workflow skill, or create a parallel producer.

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

This skill owns the component-contract layer only. When Architecture is
applicable, respect its technical boundaries; when UX is applicable, align
components to its flows, screens, and states instead of redefining the
experience. The approved reference is the only authoritative source for its
tokens, components, props, and variants — a preview, an imported rule, or a
provider copy never becomes authority without a valid version and explicit
approval. Do not assert design audits, usability testing, brand research, or
component inventories that were not performed.

## Existing-system reuse

Before proposing any new rule, identify whether the project already has a
usable Design System, component library, token set, or theme by inspecting the
relevant context, dependencies, and code. If a usable system exists, reuse and
consume its approved tokens, components, props, variants, and states instead
of inventing parallel ones; do not create a competing Design System without an
explicit user decision recorded under decisions. Record the origin,
applicability, decisions, and remaining gaps of any reused system.

## Workflow

Follow the optional-reference workflow. Beyond its shared steps:

1. Confirm explicit permission and a resolvable target work item.
2. Identify or reuse an existing usable system, then scope the applicable
   tokens, components, props/contracts, variants, states, responsive behavior,
   and accessibility boundaries.
3. Build the reference from
   [assets/design-system-template.md](assets/design-system-template.md) under
   `.flox/artifacts/planning/design-system/DS-<id>-<slug-curto>-v<version>.md`,
   using one to three short keywords such as `DS-001-module-ui-v1.md`, and
   produce `DS-<id>-<slug-curto>-v<version>.html` as the linked HTML
   demonstration preview bound to the exact version.
4. Update `status.yaml` with `next_action: "approve Design System"`, then
   request explicit approval of the exact version.

## Boundaries

Beyond the shared optional-reference boundaries: do not create or modify PRDs,
Epics, Architecture, UX, roadmaps, or Setup preferences; do not approve or
adopt the reference on the user's behalf; and do not declare the work
complete.

## Output

Follow the output contract, including the linked HTML preview marked as a
demonstration, the reused-system origin, and the separated
observations/assumptions/gaps. While the proposal is pending, revise the same
version in place — never open a new version before approval. Ask the user to
approve the proposed version or state the prerequisite that blocks it; on
approval, mark that version approved and remove the reference item from
`work_items`.
