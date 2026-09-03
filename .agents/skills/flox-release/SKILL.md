---
name: flox-release
description: Run the project-agnostic Flox Release gate by consuming approved upstream gates and a confirmed RELEASE-ROADMAP.md, applying only the release policy, procedure, evidence, approvals, and recovery rules declared for that project through flox-personas.
---

# Flox Release

Contract for the final release gate. The confirmed `RELEASE-ROADMAP.md` is the
sole authority for project-specific release decisions. This skill is
mechanism-agnostic: do not assume a versioning scheme, hosting service,
package manager, repository platform, branch, tag, artifact type, environment,
command, or deployment shape. If the project needs one, the roadmap must
declare it.

## Required contracts

- Require a valid Setup marker according to the `$flox-personas` contract and
  read `.flox/artifacts/status.yaml` first with `schema: 2`.
- Resolve work items in one of two modes: when a `work_item_id` is received,
  resolve exactly that item (a missing, incorrect, or duplicate ID blocks);
  when no `work_item_id` is received, resolve every eligible item — each item
  routed to Release with its upstream gates approved — and process them in a
  batch, one item fully at a time. Results, evidence, and `next_action` belong
  to each item individually; each requires its own explicit release approval,
  there is no combined approval across items, and a block on one item does not
  abort the remaining eligible items. Unrelated items must be preserved.
- Never use global `focus`, `items`, `next_actions`, `pending_approvals`, or
  `flox_id` state as the source of truth. Set exactly one `next_action` per
  transition.
- Require the file confirmed by Setup at
  `.flox/artifacts/planning/release/RELEASE-ROADMAP.md`, with a confirmed
  `flox-roadmap-contract` and `roadmap_id = "release"`. A missing, generic,
  incomplete, contradictory, or unconfirmed roadmap ends as **Incomplete** and
  directs the person to `$flox-setup`.
- Read the complete roadmap and consume only its confirmed decisions. The
  roadmap must define the applicable release objective, scope, prerequisites,
  authorized boundaries, release procedure, evidence, approvals, recovery or
  rollback approach, and re-execution rules. A confirmed not-applicable value
  is valid; an absent or unresolved decision is not.
- Require evidence of Quality `approved` on the same `work_item` and a
  resolved Pentest classification (`approved` or `pentest waived`) before
  preparing the release. Do not accept an execution that skips a required
  gate.
- Use the response shape from
  `../flox-personas/references/contracts/output-contract.md`.

## Upstream prerequisites

Before making any release decision, verify the approved upstream evidence on
the same `work_item`:

- Quality must be approved according to the confirmed Quality roadmap. This
  skill does not require a particular command, test runner, tool, or evidence
  format.
- Pentest must have an applicable, resolved classification. If the confirmed
  project context makes Pentest not applicable, consume that explicit
  classification; do not infer a waiver.
- The release candidate and its target scope must match the candidate and
  scope authorized by the Release roadmap. Do not silently substitute a
  different artifact, environment, destination, or work item.

If a prerequisite is missing or contradictory, block the item, preserve the
evidence, and route it to the owning step with exactly one corrective
`next_action`.

## Roadmap-defined release

The roadmap may describe any valid project release model, including a package,
application, service, firmware, document, model, infrastructure change, or
internal delivery. Apply the confirmed project decisions exactly:

1. Identify the candidate, release identity, destination, and target
   environment only when the roadmap declares them. If an identity or field is
   explicitly not applicable, record that decision instead of inventing one.
2. Verify every roadmap prerequisite, authorized boundary, approval, and
   evidence requirement. Do not add framework defaults or repository
   conventions.
3. Require explicit user approval for this candidate and `work_item_id` before
   any release operation. Silence, approval from another stage, or approval for
   an earlier candidate does not authorize the release.
4. Use only the roadmap's confirmed procedure and release channel. Follow its
   declared communication, observation, and completion evidence when present.
   Do not translate the procedure into a preferred platform or tool.
5. Record the exact release identity and operation evidence only if the
   roadmap requires them and the host provides observable evidence. Never
   claim that a release occurred from intention, a plan, or an approval alone.

The skill may coordinate or describe an authorized operation, but it must not
perform real publication, deployment, distribution, or repository mutation
without an explicitly authorized host capability. If that capability is
unavailable, keep the item **Incomplete** or **blocked** and name the roadmap
procedure as the next action; never mark the item `done`.

## Recovery, re-execution, and results

If the release operation fails, follow only the recovery or rollback approach
confirmed in the Release roadmap. Do not assume that recovery means reverting
a branch, creating a corrective version, restoring a previous artifact, or
publishing through a particular channel. If the roadmap declares recovery not
applicable, record that decision and follow its stated mitigation or escalation
path.

Re-run the gate after any candidate change, failed operation, changed target,
or roadmap revision when required by the roadmap. Collect new evidence and
reconfirm approval for the resulting candidate.

The result is `approved` only when the upstream gates, roadmap prerequisites,
explicit release approval, and complete evidence for the declared release
operation are present. Use `blocked` for failed checks or unresolved
prerequisites and **Incomplete** for an invalid or unavailable contract. When
the release operation is complete, record the result in the artifact first,
mark the resolved item `done`, and remove it from `work_items` according to
the status contract. Otherwise keep the item active, blocked, or incomplete
with exactly one next action.

### Parent completion roll-up

Only after an `approved` result that removes a Story from `work_items`, close
the delivered Story's planning parents by completion roll-up. This is the only
authorized write to a PRD or Epic; never edit their content or scope.

1. Resolve the Story's Epic from the item's `epic:` field.
2. Read the Epic artifact's `## Mapa de Stories` for the full set of Story IDs
   it owns. Because delivered Stories have already left `work_items`, read
   completion from the Story artifacts, not from the index.
3. If every mapped Story has a recorded terminal result (delivered, or
   explicitly `rejected`, `superseded`, or `deferred` out of scope), the Epic
   has reached end of life: record the closing result and date in the Epic
   artifact and remove the Epic from `work_items`. Never mark it `done`.
4. If the Epic closed, resolve its PRD from the Epic artifact's `**PRD:**`
   header and read the PRD's related-Epic links for the full set of Epics it
   owns. If every one of those Epics is closed, apply the same closure to the
   PRD: record the result in the PRD artifact and remove it from `work_items`.
5. The roll-up is conditional and idempotent: an incomplete map closes nothing,
   and a parent already absent from `work_items` is a no-op.

## Dispatch

Delegate any selection and dispatch to `$flox-personas`. This skill keeps no
roster, selection criteria, or local producer. Validate the closed response
and safe card read according to
`../flox-personas/references/contracts/persona-consumer-contract.md`. If the
catalog or dependency is unavailable, end as **Incomplete** and direct the
person to run `flox update` or install the complete `software-dev` module.

Record each contribution separately with decision, evidence, risks, and next
action, always limited to the received `work_item_id` and authorized context.

## Limits

Do not modify the content or scope of the Story, PRD, Epic, Setup, Release
roadmap, Git strategy, or product code. The single exception is the terminal
completion roll-up above: after an `approved` release, `$flox-release` may
record a closing note in a fully delivered Epic or PRD artifact and remove that
parent from `work_items`, never setting it to `done`. Do not perform
publication, deployment, distribution, rollback, or repository changes without
the host capability and authorization defined by the roadmap. Release must
never mark `done` without corresponding evidence.

## Output

Present each persona contribution separately, followed by the confirmed
roadmap decisions consumed, upstream gate evidence, candidate and target
scope, release operation evidence, the `work_item` transition, and exactly one
next action. Omit a field only when the roadmap explicitly marks it not
applicable. Report no next action and state that the item was removed from
`work_items` only after complete release evidence is recorded; otherwise keep
the item blocked or incomplete with the corresponding roadmap action. When the
completion roll-up closes an Epic or PRD, report each closed parent and its
removal from `work_items`.
