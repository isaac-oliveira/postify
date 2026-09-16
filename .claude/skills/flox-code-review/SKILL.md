---
name: flox-code-review
description: Review the git diff of an implemented Flox Story using only the canonical STEM reviewer, passing only the diff, Story description, and acceptance criteria. Use after flox-dev-story leaves a Story in review; it produces one consolidated decision and routes one correction handoff or approval — never an automatic loop.
---

# Flox Code Review

Review one Story in `review`, record one decision, and either approve or hand
off corrections once. Review is incremental and stateful; it never loops.

## Contracts

Apply the shared [workflow contract](../flox-personas/references/contracts/workflow-contract.md),
[persona-consumer contract](../flox-personas/references/contracts/persona-consumer-contract.md),
and gate-safe artifact rules.

## Preconditions

At a new session start, read schema-2 `status.yaml` and continue only when the
exact `work_item_id` is `review` and its file exists. On a handoff, consume the
validated snapshot. A missing or invalid item is **Incomplete**.

## Review ledger

Persist this section in the Story and read it on every invocation:

```yaml
## Code Review ledger
review_anchor: <sha of the last reviewed HEAD | empty on first round>
correction_handoffs: <integer, starts at 0>
findings:
  - id: F-001
    severity: high
    location: <path:line>
    state: open | fixed | accepted
    origin_round: 1
```

Finding IDs are stable. `open` blocks, `fixed` means confirmed in the
incremental diff, and `accepted` requires explicit human risk acceptance;
fixed and accepted findings are terminal and never reopened.

### Review workflow

### Diff scope

Resolve the base branch only from `GIT-ROADMAP.md`. On the first round inspect
`git diff <base>...HEAD`; after an anchor inspect only
`git diff <review_anchor>...HEAD`. Do **not** re-scan the base changeset on a
later round. The diff is the only inspection surface; do not read unrelated
files or history.

### STEM-only dispatch

Use `$flox-personas` only for exactly one canonical `stem` card: STEM, 🧬,
`correction and regression review`. The configured person is decision owner and
`flox-code-review` is coordinator. If native dispatch is unavailable, return
**Incomplete**; never activate a fallback.

Send STEM one package containing only:

```text
## Diff
<the round's git diff>

## Story description / Acceptance criteria / Test Plan
<title, User Story, acceptance criteria, and finalized Test Plan>

## Prior open findings
<open ledger findings, or empty on the first round>
```

The Test Plan is frozen; STEM reviews strictly against it and the acceptance
criteria. Do not send status, PRD, Epic, project context, logs, unrelated
files, or persona cards.

### Finding admission and convergence

Admit a correlated finding only when a Test Plan check fails, an AC is unmet,
or the changed lines contain a bug. On later rounds, each fixed open finding
must be confirmed from the correction; a new block is admissible only when
introduced by the correction or its direct consequence. Findings already fixed
or accepted are never reopened. A broken requirement needs a new approved Story version,
not a review loop.

### Consolidation and decision

Read pending deferred-work items, classify findings as correlated or
non-correlated, preserve evidence/severity/risk/origin, deduplicate, and record
non-correlated work under the active sprint's deferred-work path. The decision
is **Approved**, **Approved with notes**, **Needs corrections**, or
**Incomplete**. Approval requires no correlated open block; a concern may yield
Approved with notes.

### Human decision

For approval, proceed directly to the approval record. For corrections, if
`correction_handoffs` is already `2`, do **not** offer a handoff and use the
Requirement decision gate. Never dispatch implementation automatically at this gate.
Otherwise present exactly:

1. **Aplicar todos** — hand off all correlated findings and addressed deferred
   work to `$flox-dev-story`.
2. **Aplicar só o bloqueador** — hand off only correlated findings and preserve
   deferred records.

At the requirement gate present exactly:

1. **Aceitar risco e aprovar** — mark findings `accepted`, record the human
   decision, and route forward.
2. **Bloquear para nova versão da Story** — set the item `blocked` with reason;
   re-approve a new Story version through `$flox-create-story` or
   `$flox-quick-dev`.
3. **Override humano explícito** — let the person direct the next step.

Do not change status or create a commit while a correction choice is pending.

### Approval and forward routing

On approval, record the human decision with owner, ISO date, justification, and
risk acceptance where relevant. Record a risk assessment as exactly
`pentest required` or `pentest waived`, with responsible person, justification,
and residual risk; mirror it in `status.yaml`. Revalidate, inspect the diff,
and commit only the approved Story, workflow/deferred artifacts, tests, and
provider sync using the roadmap's commit rules. Keep the Story in
`work_items`, set `status: approved`, and route exactly one next action to
`$flox-pentest` when required or `$flox-quality` when waived.

After the approval commit, perform only the Git roadmap's authorized branch,
change-request, push, and cleanup operations. Wait for the person's approval
and merge; do not merge or auto-approve. Do not mark `done`.

### Boundaries

Do not alter the approved Story, its ACs/Test Plan, PRD, Epic, Setup, roadmaps,
product code, or unrelated files. Do not run Pentest, Quality, Release, or an
automatic correction. Keep one stable `work_item_id` and one review decision.

## Output

Return the STEM contribution, consolidated correlated and non-correlated
findings table, checks, decision, commit/forward route, and exactly one next
step. After corrections, await a new `$flox-code-review`; after approval,
confirm the commit and route to the required next gate. End with
`## Changed files` listing created or modified relative paths.
