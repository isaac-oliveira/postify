---
name: flox-code-review
description: Review the git diff of an implemented Flox Story using only the canonical STEM reviewer, passing only the diff, Story description, and acceptance criteria. Use after flox-dev-story leaves a Story in review; it produces one consolidated decision and routes one correction handoff or approval — never an automatic loop.
---

# Flox Code Review

Review one Story in `review`, record one decision, and either approve or hand
off corrections once. The review is **incremental and stateful**: each round
inspects only what changed since the last reviewed commit and reuses a persisted
ledger of prior findings, so the same requirement is never re-litigated and the
review converges instead of looping. This skill never re-runs itself
automatically.

## Contracts

- STEM card resolution and validation:
  [../flox-personas/references/contracts/persona-consumer-contract.md](../flox-personas/references/contracts/persona-consumer-contract.md).
- Setup marker, `status.yaml` schema 2, and localization:
  [../flox-personas/references/contracts/status-contract.md](../flox-personas/references/contracts/status-contract.md).

## Preconditions

1. Read `status.yaml` (schema 2; reject `schema < 2`). Continue only when a
   `work_item` with `status: review` exists and its file is present.
2. Require a valid Setup marker; if absent, invalid, or `refresh_required`, stop
   and direct the person to `$flox-setup`.

## Review ledger

Review state lives in the Story artifact under `## Code Review ledger`, read and
written on every invocation (same pattern as `## Human decision record`):

```
## Code Review ledger
review_anchor: <sha of the HEAD reviewed last round | empty on the first round>
correction_handoffs: <integer, starts at 0>
findings:
  - id: F-001
    severity: high
    location: <path:line>
    state: open        # open | fixed | accepted
    origin_round: 1
```

Finding IDs are stable and never recycled. `open` blocks; `fixed` was resolved
by a confirmed correction in the diff; `accepted` carries an explicit human risk
acceptance and never blocks again. Create the section on the first round if
absent; otherwise update it in place.

## Diff scope

Resolve the base branch from the project's Git strategy in
`.flox/artifacts/planning/git/GIT-ROADMAP.md` — use exactly the base branch it
records; never assume `main`. If the roadmap is absent or has a gap for the base
branch, stop and ask the user to update it via `$flox-setup`.

- **First round** (`review_anchor` empty): inspect `git diff <base>...HEAD` —
  the complete changeset.
- **Later rounds** (`review_anchor` set, HEAD advanced): inspect **only**
  `git diff <review_anchor>...HEAD` — just the correction. Do **not** re-scan
  `<base>...HEAD`; prior findings come from the ledger, not from re-reading the
  history.

That diff is the only inspection surface — do not read unrelated files, full
files, or history beyond it. A finding needing outside context is noted as
unverifiable and does not block. After the round, record `review_anchor = HEAD`.

## STEM-only dispatch

STEM is the sole reviewer. Use `$flox-personas` only to resolve and validate the
canonical `stem` card; do not select, mention, or dispatch any other persona.
The response must identify exactly one `stem` persona, with the configured
person as decision owner and `flox-code-review` as coordinator. If the catalog
returns zero, more than one, or any non-`stem` persona, stop as **Incomplete**
and direct the person to run `flox update` or install the complete
`software-dev` module.

Build exactly one review package and spawn exactly one fresh native STEM
subagent with only that package and the instruction to inspect only it:

```
## Diff
<the round's git diff — base...HEAD on the first round, anchor...HEAD after>

## Story description / Acceptance criteria / Test Plan
<title and User Story; the acceptance-criteria bullets; the finalized Test Plan
roteiro — enumerated checks, steps, and expected results (the fixed scope)>

## Prior open findings
<the ledger's `open` findings (id, severity, location); empty on the first round
— STEM confirms which the correction resolved>
```

Pass the prior open findings as the `handoff_findings` record permitted by the
persona-consumer-contract. Pass the Test Plan verbatim and instruct STEM to
review strictly against it plus the acceptance criteria. If the Story has no
finalized Test Plan, stop as **Incomplete** and route back to `$flox-dev-story`
— do not let STEM invent the scope. Do not include status, PRD, Epic, project
context, unrelated files, persona cards, or validation logs. If a native
subagent cannot be created, stop as **Incomplete**; never activate a fallback.

## Finding admission and convergence

Complete one exhaustive round over the round's diff before presenting anything;
no finding is reserved for a future invocation and no partial list is shown.
Scope is **fixed by the Test Plan and acceptance criteria**, so the review is
deterministic — the same diff and Test Plan yield the same findings. Every
correlated finding maps to one of: (a) a Test Plan check that fails, (b) an
acceptance criterion not met, or (c) a bug in the changed lines.

On a later round the ledger governs admission:

- Each prior `open` finding whose fix appears in the incremental diff becomes
  `fixed`.
- A **new** `block` is admissible **only** if it was introduced by the
  correction (touches changed lines in the incremental diff) or is a direct
  consequence of it.
- Findings already `fixed` or `accepted` are never reopened; do not raise
  net-new checks not derivable from the Test Plan or acceptance criteria.
  Anything outside this perimeter is **non-correlated**, deferred, and never
  blocks the current Story.

The **Test Plan and acceptance criteria are frozen** for the review's life;
corrections never change them. If a correction reveals the requirement itself is
wrong or unsatisfiable (e.g., an atomic-write guarantee a generic runtime cannot
offer against concurrent external writers), that is **not** a code-review
finding to loop on — it needs a new approved Story version via
`$flox-create-story` or `$flox-quick-dev`, never a silent rescope here.

When every Test Plan check passes and no correlated `open` block remains, the
result is **Approved** — never withhold approval to hunt for new issues.

## Consolidation and decision

Re-read every pending deferred-work item and include all correlated findings
plus every pending deferred-work item in consolidation. Classify each finding as
**correlated** (within the round's diff and directly affected files) or
**non-correlated** (outside it), keeping evidence, severity, impact/risk,
recommendation, and origin reviewer and Story. Deduplicate before presenting.
Record non-correlated items under `sprints/<sprint-id>/_backlog/deferred-work/`
(use the active sprint ID); they are never silently dropped. Update the ledger
finding states from this round.

The consolidated result is exactly one of:

- **Approved** — no correlated `block` and no accepted-risk gate needed.
- **Approved with notes** — correlated `concern` findings exist but none block.
- **Needs corrections** — one or more correlated `open` `block` findings.
- **Incomplete** — the diff or STEM contribution could not be obtained.

## Human decision

For **Approved** / **Approved with notes**, do not ask the person to choose;
proceed directly to approval and forward routing, stating the result.

For **Needs corrections**, first check the round cap. If `correction_handoffs`
is already `2`, do **not** offer the handoff options and do **not** dispatch
`$flox-dev-story`; go to the **Requirement decision gate**. Otherwise present
exactly these two options and no other:

1. **Aplicar todos** — hand off all correlated findings plus addressed
   deferred-work items to `$flox-dev-story` in one deduplicated package.
2. **Aplicar só o bloqueador** — hand off only the correlated findings to
   `$flox-dev-story` in one deduplicated package; preserve deferred records.

While a correction decision is pending, the Story stays `review`, no status item
is removed, no commit is created, and no approval is finalized.

### Requirement decision gate

Reached only after two correction handoffs still leave a correlated block: the
requirement, not the code, is likely the problem, so the skill stops and hands
the decision to the person instead of dispatching more implementation. Present
exactly these three options:

1. **Aceitar risco e aprovar** — record the affected findings as `accepted`,
   write the `## Human decision record`, then follow approval and forward
   routing.
2. **Bloquear para nova versão da Story** — set the item to `blocked` in
   `status.yaml` with the reason; the requirement must be re-approved as a new
   Story version via `$flox-create-story`/`$flox-quick-dev`. Implement nothing.
3. **Override humano explícito** — the person takes over and directs the next
   step manually.

Never dispatch implementation automatically at this gate.

## Correction handoff

For either **Needs corrections** option, send one message with the complete
deduplicated package of selected findings: severity, affected path and line,
evidence, impact/risk, recommendation, origin reviewer and Story, and the
smallest useful correction action. Do not route findings one at a time. Under
**Aplicar todos**, remove addressed deferred-work items only after
implementation confirms them; under **Aplicar só o bloqueador**, leave them
unchanged. Increment `correction_handoffs`, leave the Story in `review`, and
await a new user invocation of `$flox-code-review`; never restart the review
automatically or invoke another workflow skill.

## Approval and forward routing

Code Review is not the terminal gate: on approval it records the decision,
produces the risk assessment, commits the reviewed change, and routes the same
`work_item_id` forward — never `done`, never removed from `work_items`. Terminal
`done`, removal from `work_items`, and the release tag belong to the later gates
(Pentest when required, Quality, then `$flox-release`).

Record the decision under `## Human decision record` with `decision`,
`decision_owner`, `decided_at` (ISO date), `justification`, and one
`risk_acceptance` per relevant finding (finding ID, severity, impact, accepted
risk, acceptance scope). Then produce the **risk assessment** the Story routes on
— considering at least the change's nature and security surface — recorded in the
Story (in `file_language`) and mirrored in `status.yaml` as exactly one of:

- `pentest required` — record the criteria applied, responsible person, and
  justification.
- `pentest waived` — requires the responsible person, explicit justification,
  and residual risk; never waive silently.

Absence of any of `decision`, `decision_owner`, `decided_at`, `justification`,
the required `risk_acceptance` entries, or the risk assessment is a hard stop.
When all are present, run the required validations, inspect the diff, and create
the reviewed-change commit per the project's commit rules and message
convention, including only the approved Story, workflow artifacts, deferred-work
records, tests, and synchronized provider changes. Keep the Story in
`work_items`, set its status to `approved`, and route it with exactly one
`next_action` (in `file_language`) to `$flox-pentest` when Pentest is required
or `$flox-quality` when waived. Confirm the commit succeeded and the worktree is
clean before reporting.

## Branch, change request, and cleanup

After the approval commit, consult `GIT-ROADMAP.md` and do **only** what it
authorizes for this stage — it is the sole source for the platform and tooling,
the request type and naming, the remote, the base branch, and any template.
Never assume a provider such as GitHub or invent operations the roadmap omits.
When authorized, and only then:

1. Push the reviewed branch using exactly the naming and remote it records.
2. Open the change request against the roadmap's base branch (or update the
   existing one) and report its URL, filling the body from the roadmap's
   template when it records one, otherwise from the project's conventions.
3. Wait for the user to review, approve, and merge; do **not** merge or
   auto-approve on their behalf. Report the pending request.
4. Only after the user confirms the merge, sync the base branch and delete the
   merged feature branch exactly as the roadmap's merge/finish rules prescribe.

If the roadmap is absent or has a gap for a needed operation, stop that step and
ask the user to update it via `$flox-setup`. These steps never mark the delivery
`done` or remove it from `work_items` — the later gates own that.

## Output

Return the STEM contribution then the coordinator's consolidated response — no
raw YAML, tool traces, or anonymous lists.

- **Decision:** `Approved` | `Approved with notes` | `Needs corrections` |
  `Incomplete`. The STEM contribution keeps its own `pass` | `concern` | `block`
  as evidence, with the validated persona name and emoji.
- **Achados consolidados:** a `Severity | Location | Evidence | Impact | State`
  table, splitting **Correlated to the Story** and **Non-correlated** groups;
  write "No findings recorded." for an empty group.
- **Checks:** `<check and result>; <check and result>`.
- **Next step:** exactly one action. For `Approved` / `Approved with notes`,
  confirm the reviewed-change commit and route to the next gate (`$flox-pentest`
  when Pentest is required, otherwise `$flox-quality`) without options and
  without marking the Story `done`. For `Needs corrections`, present the two
  numbered options, or the three requirement-gate options when the round cap is
  reached. After a correction handoff, await a new user invocation of
  `$flox-code-review`.
