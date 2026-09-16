# Workflow baseline contract

Shared source for the session, scope, and contract-routing rules used by Flox
Software Studio workflow skills. A consuming skill keeps only its stage
contract after applying this baseline.

## Applicability

This contract applies to the software-dev workflow skills that read or update
the delivery index. `flox-help` and `flox-setup` are core exceptions because
they are respectively read-only and the producer of the Setup marker.
`flox-personas` owns this contract and its persona catalog. `flox-party-mode`
is conversation-only and consumes only the persona-safety and output portions.

## Session preconditions

- At a new session start, apply `status-contract.md` first: read
  `.flox/artifacts/status.yaml`, require schema 2, resolve the exact stable
  `work_item_id`, preserve unrelated items, and require a valid Setup marker.
  If any check fails, stop and direct the person to `$flox-setup`.
- Read `.flox/project-context.md` when present, then only the routed artifact,
  approved references, and task-local context needed for the stage. A handoff
  carries the same snapshot and `work_item_id`.
- When updating the index, change only the resolved item and set one
  human-readable `next_action`; `status-contract.md` owns its schema, IDs,
  paths, and status enums.

## Session snapshot protocol

A workflow session has one initial trust-boundary read. Its in-memory snapshot
contains the schema-2 routing entry, exact artifact paths and IDs,
approval/status decisions, Setup-confirmed references and fingerprint, and the
sanitized task-local context needed by the stage. It is never a persistent
cache.

- Pass the same snapshot and `work_item_id` through handoffs. Reuse validated
  status, roadmaps, and references; do not reread or recalculate the Setup
  fingerprint.
- Start a new read only when the requested item changes, a status transition or
  other effect has occurred, the snapshot is absent/invalid, a concurrent
  mutation is observed, or no-follow, containment, secret-scan, and stable-read
  rules require a fresh boundary confirmation.
- A mutation, replacement, missing reference, or mismatch outside the snapshot
  fails closed and directs the person to `$flox-setup`; never reuse an obsolete
  snapshot.
- Only `$flox-setup` performs complete reference identity/content fingerprint
  validation and restores `state = "valid"`; downstream consumers require its
  confirmed snapshot and never produce a replacement.

## Shared boundaries

- Stay within the declared stage and approved scope. A downstream skill is
  recorded as `next_action` only; it is not invoked automatically.
- Preserve approved upstream artifacts, Setup decisions, roadmaps, unrelated
  work items, and unrelated user files unless the owning contract grants a
  narrow update.
- Do not expose secrets or unrelated repository content to personas; stop
  closed when context cannot be scoped and sanitized.
- Do not mark a delivery `done`; only `$flox-release` owns terminal closure.

## Contract index

Read the contract relevant to the current stage before acting:

- Persona selection, card reads, and dispatch:
  [persona-consumer-contract.md](persona-consumer-contract.md).
- Artifact lifecycle and frontmatter:
  [artifact-safety-contract.md](artifact-safety-contract.md).
- Setup marker, status, routing, and localization:
  [status-contract.md](status-contract.md).
- Approved optional-reference consumption:
  [reference-consumption-contract.md](reference-consumption-contract.md).
- Gate convergence and per-item ledgers:
  [gate-convergence-workflow.md](gate-convergence-workflow.md).
- Response sections and file reporting:
  [output-contract.md](output-contract.md).

## Boilerplate inventory

| Common block | Consumers | Exceptions | Canonical source |
| --- | --- | --- | --- |
| Session, Setup, and status routing | 12 workflow consumers | `flox-help`, `flox-setup`, `flox-personas`, and conversation-only `flox-party-mode` | This contract plus `status-contract.md` |
| Scope and preservation boundaries | The same consumers | Stage-specific and conversation-only boundaries remain local | This contract |
| Shared contract references | The same consumers | Catalog and core skills keep their own applicable references | This contract |

The inventory records exceptions so consolidation cannot erase an owner
boundary or fail-closed invariant. Security, artifact, persona, gate, and
output details remain in their canonical contracts.
