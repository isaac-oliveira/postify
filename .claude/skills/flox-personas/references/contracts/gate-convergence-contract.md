# Gate convergence contract

Shared contract for `$flox-pentest` and `$flox-quality`. It prevents a gate
from widening its confirmed scope or returning to an unbounded correction loop.
The contract is per `work_item_id`; it does not add state to `status.yaml`.

## Ownership and authority

- The confirmed gate roadmap remains the sole authority for scope, methods,
  mandatory criteria, evidence, exceptions, and re-execution.
- Each gate owns one ledger section in the resolved Story artifact. It may
  append or update only that section and the result, evidence, and single
  `next_action` of the same `work_item_id` in `status.yaml`.
- The ledger must not alter the approved Story, acceptance criteria, Test Plan,
  roadmap, schema 2, or any other work item. A malformed, missing, ambiguous,
  or cross-item ledger is **Incomplete**; never reset it to start over.

## Per-work-item ledger

Create the gate's ledger on its first invocation for the item and update it in
place on every later invocation. The section must contain:

```text
## <Pentest or Quality> convergence ledger
gate: <pentest or quality>
candidate_anchor: <current candidate identity>
anchor_history:
  - round: 1
    anchor: <candidate identity>
round: <positive integer, starts at 1>
correction_handoffs: <integer, starts at 0, never reset for this item and gate>
frozen_scope:
  roadmap_id: <confirmed roadmap ID>
  roadmap_version: <confirmed roadmap version>
  methods: [<stable confirmed method or check IDs>]
  surfaces_or_criteria: [<stable confirmed surface or mandatory criterion IDs>]
findings:
  - id: <stable finding ID>
    state: open | fixed | accepted
    origin_round: <round>
criteria:
  - id: <stable mandatory criterion ID>
    state: pending | passed | failed | accepted
    origin_round: <round>
```

Use only the applicable `findings` or `criteria` collection for the gate, but
keep stable IDs and prior states. `open` findings and `failed` mandatory
criteria block. A finding marked `fixed` or `accepted` is terminal and is never
reopened or assigned a new ID. An `accepted` criterion is terminal under its
approved exception or human decision. A `passed` criterion may be evaluated
again only when the correction directly affects it; preserve the prior result
and change it to `failed` only when the new evidence shows that direct failure.

The first invocation sets `candidate_anchor`, `round: 1`,
`correction_handoffs: 0`, and freezes the exact confirmed roadmap version,
methods, and authorized surfaces or mandatory criteria. A later invocation for
the same item and gate must use the next round and append the new anchor to
`anchor_history`; it must not recreate the ledger or reset the handoff count.
If the roadmap version, frozen scope, or gate identity no longer matches, stop
as **Incomplete** and request a new confirmed decision instead of silently
expanding or replacing the ledger.

## Incremental re-execution and admission

- Re-execute only the correction and the frozen surfaces or criteria directly
  affected by that correction, subject to the roadmap's confirmed
  re-execution rule. Do not invent checks, methods, criteria, or attack
  surfaces.
- Admit a new blocking finding only when the correction introduces it or it is
  a direct consequence of the correction. Admit a new blocking quality result
  only for a frozen mandatory criterion that is still failing or directly
  affected by the correction.
- Do not reopen `fixed`, `accepted`, or otherwise stable prior entries. A
  non-correlated observation cannot block this item or trigger a new automatic
  handoff.
- Record the evaluated entry, evidence, round, and reason for correlation. A
  block without a direct-causation or still-failing-mandatory-criterion record
  is invalid and must not be routed.

## Correction cap and human decision

Complete the current round before presenting a result. When a blocking finding
or criterion remains and `correction_handoffs < 2`, record one corrective
handoff, increment `correction_handoffs`, and set one corrective `next_action`.
This is a recorded handoff only: never invoke `$flox-dev-story`, another gate,
or any other skill automatically.

When `correction_handoffs = 2` and a blocking finding or criterion remains,
stop before any dispatch and present exactly these three choices:

1. **Accept risk and approve** — record the affected IDs, severity or failed
   criterion, impact, accepted risk, frozen scope, evidence, approver, and date;
   mark the affected entries `accepted` and route only after explicit approval.
   For Quality, a failed mandatory criterion may be marked `accepted` and
   routed as Quality-approved only when the confirmed `QUALITY-ROADMAP.md`
   explicitly authorizes that exception and all of its approval and evidence
   conditions are satisfied. Without that roadmap-authorized exception, do not
   mark the criterion `accepted` or route the item as Quality-approved; keep it
   blocked or use choice 3.
2. **Block for a new Story version** — record the reason, evidence, and one
   corrective `next_action`; keep the item blocked and implement nothing.
3. **Explicit human override** — record the decision owner, scope,
   justification, evidence, and one `next_action`; do not dispatch anything
   automatically.

No other choice, waiver, retry, gate, or implementation dispatch is offered at
this cap. An approval or override is valid only for the same
`work_item_id` and candidate anchor. A new invocation is always human-initiated.
