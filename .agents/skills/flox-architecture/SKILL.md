---
name: flox-architecture
description: Produce one versioned, approvable Architecture reference for a planned change, on explicit user permission, so technical boundaries, responsibilities, and decisions stay traceable before Story and implementation. Use only when the user authorizes this optional workflow; it does not create Stories, implement code, or replace an approved reference without a new version.
---

# Flox Architecture

Produce one approved, versioned technical-limits reference. It never runs
automatically and does not create planning children or product code.

## Contracts

Apply the shared [workflow contract](../flox-personas/references/contracts/workflow-contract.md)
and [optional-reference workflow](../flox-personas/references/contracts/optional-reference-workflow.md).

This skill owns structure, code style, technical boundaries, contracts, and
responsibilities. Story creation and Dev Story consume the approved version.

## Preconditions

Require explicit permission and a planned technical decision. Do not redefine
PRD, Epic, UX, or Design System content.

## Workflow

Follow the optional-reference workflow. Use
[assets/architecture-template.md](assets/architecture-template.md) to create
`.flox/artifacts/planning/architecture/ARCH-<id>-<slug-curto>-v<version>.md`
with one to three short keywords. Record applicability, structure, style,
rules, contracts, boundaries, responsibilities, examples, facts, decisions,
assumptions, and gaps. Treat Clean Code and Design Patterns as guidance until
the person explicitly records a rule. Set `next_action: "approve Architecture"`
and request approval of the exact version.

## Boundaries

Do not implement code, create or approve Stories, or modify PRDs, Epics, UX,
Design System, roadmaps, or Setup preferences. Never make a recommendation or
preview authoritative without explicit approval.

## Output

Follow the output contract. At proposal request approval; after approval mark
the exact version approved, remove its reference item, and point to
`$flox-create-story`. End with `## Changed files` and all relative paths.
