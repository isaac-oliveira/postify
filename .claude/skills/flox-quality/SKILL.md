---
name: flox-quality
description: Run the project-agnostic Flox Quality gate from a confirmed QUALITY-ROADMAP.md, executing only its declared criteria and checks, recording evidence, and requiring explicit user approval through flox-personas.
---

# Flox Quality

Run the quality gate only from the confirmed project roadmap and the routed
candidate. Do not infer a runner, platform, environment, or criterion.

## Contracts

Apply the shared [workflow contract](../flox-personas/references/contracts/workflow-contract.md)
and [gate-convergence-workflow](../flox-personas/references/contracts/gate-convergence-workflow.md).
Apply the shared [gate-convergence-workflow](../flox-personas/references/contracts/gate-convergence-workflow.md)
for gate mechanics.
Also apply the shared status rule: never use global `focus`, `items`,
`next_actions`, `pending_approvals`, or `flox_id` fields.

### Preconditions

Require the candidate to be routed from Code Review or Pentest with resolved
risk, and require the Setup-confirmed
`.flox/artifacts/planning/quality/QUALITY-ROADMAP.md` with a confirmed
`flox-roadmap-contract`, `roadmap_id = "quality"`, and complete criteria,
methods, scope, evidence, approval, exception, and re-execution decisions.
Otherwise return **Incomplete** to `$flox-setup`.

### Workflow

1. Read the roadmap's candidate, quality objective, scope, environment,
   mandatory criteria, methods, order, evaluator, and evidence requirements.
2. Delegate exactly one canonical `felicity-smoak` contribution
   (`Felicity Smoak`, 🧪, `tests`) through `$flox-personas`, with only item
   minimum context.
3. Consume [gate-convergence-workflow](../flox-personas/references/contracts/gate-convergence-workflow.md)
   for the `criteria` collection. The Quality roadmap supplies the frozen evaluation scope
   and declared methods. Execute only declared
   commands or manual procedures and record each criterion's result, evidence,
   date, evaluator, and blocker on the same `work_item`; preserve the exact
   `work_item_id` throughout.
4. A failed mandatory criterion blocks unless the confirmed roadmap explicitly
   authorizes an exception and its approval/evidence conditions are met. No
   automatic waiver or undeclared check is allowed; re-run affected criteria
   after a candidate, target, or roadmap change.
5. After every criterion passes or a roadmap-authorized exception is explicitly
   approved, require approval of this exact candidate. Record `approved` and
   route with one next action: the configured-language equivalent of
   `run flox-release`. Otherwise record `blocked` or **Incomplete**.

### Boundaries

Do not alter Story, PRD, Epic, Setup, roadmaps, product code, or unrelated
items; do not invent checks; and do not mark the item `done`. Quality only
updates its own convergence evidence and routed item.

## Output

Present Felicity's contribution, roadmap criteria/methods, each result and
evidence, approval, status transition, and exactly one next action. End with
`## Changed files` listing every created or modified relative path.
