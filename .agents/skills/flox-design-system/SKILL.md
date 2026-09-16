---
name: flox-design-system
description: Produce one versioned, approvable Design System reference and a linked HTML demonstration preview for a planned Flox change, so reusable tokens, components, props/contracts, variants, states, responsiveness, and accessibility are decided before implementation. Optional workflow invoked only with explicit user permission; reuse an existing usable system instead of competing with it, and never treat the preview as final implementation or automatic adoption.
---

# Flox Design System

Produce one versioned Design System reference and bound HTML demonstration
before Story/Dev Story when the optional workflow is authorized.

## Contracts

Apply the shared [workflow contract](../flox-personas/references/contracts/workflow-contract.md)
and [optional-reference workflow](../flox-personas/references/contracts/optional-reference-workflow.md).

This skill owns only component contracts. Approved Architecture/UX decisions
constrain it; an approved version, not its preview or provider copy, is the
authority for tokens, components, props, variants, and states.

## Preconditions

Require explicit permission and a planned component-contract decision. Inspect
context, dependencies, and code for a usable existing system before proposing
new rules. Do not claim audits, research, or inventories not performed.

## Workflow

Follow the optional-reference workflow for one resolvable work item. Reuse an
existing approved system when present and record its origin, applicability,
decisions, and gaps. Otherwise use
[assets/design-system-template.md](assets/design-system-template.md) to create
`.flox/artifacts/planning/design-system/DS-<id>-<slug-curto>-v<version>.md`
and the bound demonstration `DS-<id>-<slug-curto>-v<version>.html`. Scope
tokens, components, props, variants, states, responsiveness, and accessibility;
set `next_action: "approve Design System"` and request exact-version approval.

## Boundaries

Do not implement product components, modify PRDs, Epics, Architecture, UX,
roadmaps, or Setup, approve/adopt the reference, or treat the preview as final.

## Output

Follow the output contract, including the demonstration preview, reused-system
origin, and separated observations/assumptions/gaps. At proposal request
approval; after approval mark the version approved and remove its item. End
with `## Changed files` and every relative path.
