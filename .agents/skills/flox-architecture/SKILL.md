---
name: flox-architecture
description: Produce one versioned, approvable Architecture reference for a planned change, on explicit user permission, so technical boundaries, responsibilities, and decisions stay traceable before Story and implementation. Use only when the user authorizes this optional workflow; it does not create Stories, implement code, or replace an approved reference without a new version.
---

# Flox Architecture

Produce a single versioned, approvable Architecture reference capturing the
technical boundaries, responsibilities, and decisions for a planned change.
This optional upstream workflow creates and approves the reference only; it
never creates Epics, Stories, specs, or product code, and never runs
automatically. The user is the final decision owner.

## Contracts

- Optional-reference workflow (permission, personas, versioning, preview,
  approval, shared boundaries):
  [../flox-personas/references/contracts/optional-reference-workflow.md](../flox-personas/references/contracts/optional-reference-workflow.md).
- Persona selection and dispatch:
  [../flox-personas/references/contracts/persona-consumer-contract.md](../flox-personas/references/contracts/persona-consumer-contract.md).
- Reference file safety and frontmatter (`id`, `title`, `version`, `status`):
  [../flox-personas/references/contracts/artifact-safety-contract.md](../flox-personas/references/contracts/artifact-safety-contract.md).
- Setup marker, `status.yaml` schema 2, and localization:
  [../flox-personas/references/contracts/status-contract.md](../flox-personas/references/contracts/status-contract.md).
- Layer precedence and downstream consumption:
  [../flox-personas/references/contracts/reference-consumption-contract.md](../flox-personas/references/contracts/reference-consumption-contract.md).
- Response shape:
  [../flox-personas/references/contracts/output-contract.md](../flox-personas/references/contracts/output-contract.md).

## Layer and scope

This skill owns the technical-limits layer only: folder and module structure,
code style, contracts and technical boundaries, responsibilities and
ownership. It never redefines UX experience or Design System component
contracts, and it must not become a competing source of truth for PRDs,
Epics, UX, or Design System. The approved reference is consumed downstream by
`$flox-create-story` and `$flox-dev-story` by version.

## Workflow

Follow the optional-reference workflow. Beyond its shared steps:

1. Confirm explicit permission and that the request is an architecture
   decision or boundary task for a planned change.
2. Build the reference from
   [assets/architecture-template.md](assets/architecture-template.md) under
   `.flox/artifacts/planning/architecture/ARCH-<id>-<slug-curto>-v<version>.md`,
   using one to three short keywords such as `ARCH-001-cli-modules-v1.md`.
   Fill applicability scope, structure, code style, requested rules, contracts
   and boundaries, responsibilities, concrete examples, and separate sections
   for facts, decisions, assumptions, and open gaps.
3. Give pragmatic Clean Code and Design Patterns guidance suited to a solo
   developer. Present examples and patterns as guidance, not rigid rules; do
   not promote an example or pattern into a mandatory rule without an explicit
   user decision recorded under decisions.
4. Update `status.yaml` with `next_action: "approve Architecture"`, then request
   explicit approval of the exact version.

## Boundaries

Beyond the shared optional-reference boundaries: do not create, approve,
split, merge, or materially rewrite a PRD, Epic, or Story; do not change UX,
Design System, roadmaps, or setup preferences; and keep the reference scoped
to technical architecture decisions.

## Output

Follow the output contract. While the proposal is pending, revise the same
version in place — never open a new version before approval. At proposal,
request explicit approval; on approval, mark that version approved, remove the
reference item from `work_items`, and point to `$flox-create-story` as the
consumer of the approved version.
