---
name: flox-party-mode
description: Facilitate an optional, explicitly authorized party-mode session where relevant personas explore one bounded decision and present separate contributions plus a single recommendation to the human decision owner. Use only when the person asks to convene party mode for a specific decision; it never gates the workflow, approves artifacts, or changes status.
---

# Flox Party Mode

Facilitate an optional discussion that convenes relevant personas around one
bounded decision. Party Mode is supportive facilitation, not a gate: it never
runs automatically, never becomes a mandatory step, and never changes the main
workflow sequence. Its entire output stays in the conversation — it does not
implement code, approve artifacts, write to `status.yaml`, or create any
persistent parallel source of state.

## Contracts

- Persona selection and dispatch follow
  [../flox-personas/references/contracts/persona-consumer-contract.md](../flox-personas/references/contracts/persona-consumer-contract.md).
- Response shape follows
  [../flox-personas/references/contracts/output-contract.md](../flox-personas/references/contracts/output-contract.md),
  omitting artifact and status sections because Party Mode is conversation-only.

## Preconditions

- **Explicit authorization.** Convene only after the person explicitly
  requests or authorizes Party Mode for the current decision. Authorization is
  opt-in per use, renewed each time, and never inherited from a previous
  session or an unrelated approval. If it is absent or ambiguous, ask before
  starting.
- **One bounded decision.** Require a single delimited decision before
  convening anyone. Capture, in the configured `file_language`, the decision
  statement, its scope, the options under consideration, and the risk/impact
  and outcome that matter. If the decision is missing, unbounded, or actually
  several decisions, stop and ask the person to narrow it to one bounded
  question. Do not expand scope, invent options, or turn the discussion into a
  source of requirements.

## Workflow

1. Confirm authorization and the bounded decision.
2. Request persona selection from `$flox-personas` with the sanitized
   objective, scope, risk/impact, decision needed, and minimum context.
3. Present each persona's contribution separately, labeled before any
   consolidation, using the shared contribution shape and the card's voice.
   When personas disagree, preserve both positions with their evidence; do not
   resolve the disagreement with an automatic decision.
4. Add one concise recommendation addressed to the decision owner. Record who
   coordinates and who decides, and make clear the human decision remains the
   configured decision owner's responsibility and that the convocation only
   supports it. Never present the recommendation as an approval or resolved
   outcome.

## Boundaries

- Do not create, modify, split, merge, or approve any PRD, Epic, Story,
  Architecture, UX, or Design System artifact.
- Do not implement product code, run tests as a gate, or perform Dev Story,
  Review, Pentest, Quality, or Release work.
- Do not change `status.yaml` or create any other persistent index; the
  session leaves no artifact and no parallel source of state.

## Output

Return the bounded decision, the labeled persona contributions, and the
coordinator's single recommendation to the decision owner, stating who
coordinates and who decides. Do not return raw YAML, tool traces, or an
anonymous list, and do not imply the session changed any artifact or status.
