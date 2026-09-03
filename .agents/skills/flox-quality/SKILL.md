---
name: flox-quality
description: Run the project-agnostic Flox Quality gate from a confirmed QUALITY-ROADMAP.md, executing only its declared criteria and checks, recording evidence, and requiring explicit user approval through flox-personas.
---

# Flox Quality

Contract for the quality gate for a candidate release. The confirmed
`QUALITY-ROADMAP.md` is the sole authority for project-specific quality
criteria, checks, evidence, exceptions, and re-execution. This skill is
mechanism-agnostic: do not assume a programming language, test runner, build
system, package manager, framework, command, environment, or evidence format.

## Required contracts

- Require a valid Setup marker according to the `$flox-personas` contract: a
  supported configuration, `state = "valid"`, an ISO date, and verified
  references.
- Read `.flox/artifacts/status.yaml` first, require `schema: 2`, and reject any
  lower schema. Resolve work items in one of two modes: when a `work_item_id`
  is received, resolve exactly that item (an incorrect, missing, or duplicate
  ID blocks before the evaluation); when no `work_item_id` is received, resolve
  every eligible item — each item routed to Quality — and evaluate them in a
  batch, one item fully at a time. In both modes each item keeps its own
  criteria evaluation, evidence, result, and explicit approval; there is no
  combined evaluation or shared approval across items, and a block on one item
  does not abort the remaining eligible items.
- Require that the item comes from Code Review or Pentest with risk resolved
  and is routed to Quality. Do not accept a direct execution that skips Review
  or a required Pentest.
- The resolved item is the source of truth for the result, evidence, and
  `next_action`. Preserve unrelated items, set exactly one `next_action`, and
  never write or consume global `focus`, `items`, `next_actions`,
  `pending_approvals`, or `flox_id` state.
- Require the file confirmed by Setup at
  `.flox/artifacts/planning/quality/QUALITY-ROADMAP.md`, with a confirmed
  `flox-roadmap-contract` and `roadmap_id = "quality"`. A missing, generic,
  incomplete, contradictory, or unconfirmed roadmap ends as **Incomplete** and
  directs the person to `$flox-setup`.
- Read the complete roadmap and consume only its confirmed decisions: candidate
  scope, quality objectives, mandatory criteria, evaluation methods,
  environments, responsible person, evidence, approvals, exceptions,
  blockers, and re-execution rules. A confirmed not-applicable value is valid;
  an absent or unresolved decision is not.
- Apply the shared gate-convergence contract from
  `../flox-personas/references/contracts/gate-convergence-contract.md`.
- Use the response shape from
  `../flox-personas/references/contracts/output-contract.md`.

## Roadmap-defined evaluation

The roadmap may define automated checks, manual scenarios, inspections,
acceptance evidence, operational observations, policy checks, or a combination
of methods. Apply the confirmed decisions exactly:

1. Identify the candidate, target scope, and required environment only when the
   Quality roadmap declares them. Do not silently substitute another state,
   environment, or work item.
2. Enumerate every mandatory criterion and its declared evaluation method
   before starting. Preserve the roadmap's order and dependencies when it
   defines them.
3. Execute only the commands or procedures explicitly confirmed by the
   roadmap. For a manual or observational criterion, collect the stated
   evidence without converting it into an assumed automated check. Do not add
   flags, checks, tools, criteria, or framework defaults.
4. Record each criterion's observable result, evidence, date, evaluator, and
   any blocker on the same `work_item`. A partial run is not an approval.
5. Apply only roadmap-confirmed exception or waiver rules. No waiver is
   automatic, and an exception does not replace the required explicit user
   approval.

A failed mandatory criterion may be marked `accepted` at the convergence cap
only when the confirmed `QUALITY-ROADMAP.md` explicitly authorizes that
exception and all of its approval and evidence conditions are satisfied. Human
approval alone does not authorize a Quality exception. Without the confirmed
roadmap exception, keep the item `blocked` or use the explicit human override;
never route it as Quality-approved.

If the roadmap does not provide enough information to evaluate a mandatory
criterion, end as **Incomplete** and route the person to `$flox-setup` instead
of guessing a command, tool, or acceptance rule.

## Gate convergence and re-execution

Apply `../flox-personas/references/contracts/gate-convergence-contract.md`
exactly for this gate. For each resolved `work_item_id`, maintain the
per-item ledger with the candidate anchor, round, `correction_handoffs`,
frozen roadmap scope, methods, and mandatory criteria. Re-execute only the
correction and directly affected mandatory criteria; do not reopen `accepted`
criteria or stable prior results. Admit a new blocking result only when a
declared mandatory criterion is still failing or is directly affected by the
correction. When `correction_handoffs = 2` and a blocking criterion remains,
stop before dispatch and present exactly: **Accept risk and approve**; **Block
for a new Story version**; or **Explicit human override**. Never auto-invoke
`$flox-dev-story`, `$flox-pentest`, or any other gate; every new invocation is
human-initiated.

## Approval and routing

After every mandatory criterion passes, or after a roadmap-authorized exception
has been explicitly approved, require explicit user approval for this quality
result and `work_item_id`. A failed mandatory criterion without that confirmed
roadmap exception cannot be treated as passed or routed as Quality-approved.
Silence, approval from another stage, or approval for another candidate does
not count. Without it, record the evidence and set exactly
`next_action: "approve Quality"` using the configured artifact language.

With complete evaluation evidence and explicit approval, record the gate as
`approved`, keep the item active, and set the configured-language equivalent of
`run flox-release` as its single `next_action`.

If any required criterion fails, the result is `blocked`: continuation is
blocked, no automatic waiver exists, and the item returns to the step
responsible for the change with a corrective `next_action`. After correction,
require a new Code Review and a fresh Quality evaluation when the roadmap
requires it.

Re-run only the correction and affected criteria under the shared
gate-convergence contract after any candidate change, failed evaluation,
changed target, or roadmap revision when required by the roadmap. Record new
evidence and a new date; do not carry forward stale results or broaden the
frozen criteria.

## QA dispatch

Always delegate selection and dispatch to `$flox-personas`. The gate requires
one contribution from the canonical `felicity-smoak` card (Felicity Smoak 🧪,
QA) as evaluator; it keeps no roster, alternative criteria, or local producer.
Validate the response and safe card read according to
`../flox-personas/references/contracts/persona-consumer-contract.md`. If the
catalog does not return exactly `felicity-smoak`, end as **Incomplete** and
direct the person to run `flox update` or install the complete `software-dev`
module.

Record the contribution with its scenario, observed result, evidence, risk,
and next action. Send only the item minimum context; never send secrets or
unauthorized files.

## Results, evidence, and limits

The operational result is `approved` only when every required criterion has a
passing result or an explicitly approved roadmap exception, complete evidence
is recorded, and the person has approved this exact candidate. Otherwise use
`blocked` or **Incomplete** for the corresponding prerequisite. Evidence must
contain the `work_item_id`, criterion or check identity, evaluation method,
date, observable result, evaluator, approver when applicable, and decision.

Quality never marks the item `done`; after approval it routes the item to
`$flox-release`.

## Output

Present Felicity's contribution separately, followed by the confirmed roadmap
criteria and methods, each evaluation result, recorded approval, status
transition, and exactly one next action. After approval, the next action is
`$flox-release`; on failure or a missing prerequisite, identify the correction
or block. Use the configured file language for persisted human-readable
values, while keeping skill IDs, status values, and schema keys canonical.

Do not alter the approved Story, PRD, Epic, Setup, Quality roadmap, or product
code. The gate may update only its own convergence ledger/evidence section as
defined by the shared contract, plus the resolved item's result and single
`next_action`. Do not mark the item `done`. On approval, record
`$flox-release` as the next action without invoking it. Any later transition
updates only the resolved item in schema 2 `status.yaml` and sets one
`next_action`.
