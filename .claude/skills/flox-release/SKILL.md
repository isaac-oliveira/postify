---
name: flox-release
description: Run the project-agnostic Flox Release gate by consuming approved upstream gates and a confirmed RELEASE-ROADMAP.md, applying only the release policy, procedure, evidence, approvals, and recovery rules declared for that project through flox-personas.
---

# Flox Release

Run the final gate only from the confirmed Release roadmap and approved
upstream evidence. It is the only skill that may close delivery.

## Contracts

Apply the shared [workflow contract](../flox-personas/references/contracts/workflow-contract.md)
and [gate-convergence-workflow](../flox-personas/references/contracts/gate-convergence-workflow.md).
Apply the shared [gate-convergence-workflow](../flox-personas/references/contracts/gate-convergence-workflow.md)
for gate mechanics.
Consume [gate-convergence-workflow](../flox-personas/references/contracts/gate-convergence-workflow.md)
for the applicable Release ledger collection.
The shared gate supplies the applicable Release ledger collection and the
common convergence rules; this skill retains recovery, result, and completion roll-up rules.
Also apply the status rule: do not use global `focus`, `items`, `next_actions`,
`pending_approvals`, or `flox_id` fields.

## Preconditions

Resolve one exact `work_item_id`, or batch every eligible routed item one at a
time while preserving unrelated items. Require the Setup-confirmed
`.flox/artifacts/planning/release/RELEASE-ROADMAP.md` with a confirmed
`flox-roadmap-contract`, `roadmap_id = "release"`, complete candidate/scope,
prerequisite, procedure, evidence, approval, recovery, and re-execution
decisions. Require Quality `approved` and a resolved Pentest classification
(`approved` or `pentest waived`) on the same item. Missing or contradictory
evidence is **Incomplete** and returns to its owner or `$flox-setup`.

## Boundaries

### Roadmap procedure

Use only the roadmap's candidate, release identity, destination, environment,
authorized boundaries, approval, procedure, communication, observation, and
recovery rules. Require explicit approval for this exact item before any
operation. Do not assume a platform, version, tag, branch, channel, rollback,
or publication capability; without an authorized host operation stay
**Incomplete** or **blocked** and never claim release.

### Convergence and roll-up

Consume the shared Release ledger. On failure follow only the roadmap's
recovery and re-execution rules. After an approved operation, record evidence
first, mark the item `done`, then evaluate parents from one validated schema 2 `work_items` snapshot
using explicit `epic`/`prd` genealogy.

For each candidate, resolve its `epic` link to exactly one `kind: epic` item, read only that
Epic's explicit Story map, and resolve every member by exact ID. The rule is simple: never scan artifact directories or infer a relationship from a filename. A complete map closes only the resolved Epic. The operation must remove only that Epic plus the mapped terminal Story entries. Retain those child entries when the map is not yet
complete. If eligible, resolve the Epic's `prd` link to exactly one `kind: prd` item
and consume its explicit Epic map; close it only when all mapped Epics
are terminal. Parent roll-up is idempotent and never repairs links from paths.

| Map state | Result |
|---|---|
| Complete and every child terminal | Close only the resolved parent and its mapped terminal children. |
| Any child nonterminal | Keep the parent active with one wait action. |
| Missing map member or incomplete map | Keep the parent active with one map-completion action. |
| Duplicate or conflicting mapping | Keep the parent active with one genealogy-resolution action. |
| Unrelated `work_items` entry | Preserve it unchanged. |

None of these outcomes changes the roadmap's approval, gate, rollback, recovery, publication, or re-execution rules. Keep one next action whenever
the item remains active or blocked; only Release marks `done`.

### Persona dispatch

Delegate selection through `$flox-personas`, validate the returned cards, and
record each contribution separately with decision, evidence, risks, and next
action. Send only the item's authorized context.

## Output

Present contributions, roadmap decisions, upstream evidence, candidate/scope,
release evidence, status transition, and exactly one next action. Report no
next action only after complete release evidence and removal from
`work_items`; otherwise identify the roadmap correction. End with
`## Changed files` listing every created or modified relative path.
