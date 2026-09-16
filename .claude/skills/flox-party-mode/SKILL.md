---
name: flox-party-mode
description: Facilitate an optional, explicitly authorized party-mode session where relevant personas explore one bounded decision and present separate contributions plus a single recommendation to the human decision owner. Use only when the person asks to convene party mode for a specific decision; it never gates the workflow, approves artifacts, or changes status.
---

# Flox Party Mode

Facilitate one bounded, optional discussion. It stays in conversation and is
not a gate, workflow step, or parallel source of state.

## Contracts

Apply the persona-safety and output portions of the shared
[workflow contract](../flox-personas/references/contracts/workflow-contract.md);
this conversation-only skill is exempt from Setup/status routing and writes.

## Preconditions

Require explicit per-use authorization and one bounded decision. If either is
missing, ambiguous, or actually several decisions, stop and ask for it. Keep
the decision statement, scope, options, risk/impact, and desired outcome in
configured `file_language`; do not expand scope or invent requirements.

## Workflow

1. Confirm authorization and the decision.
2. Request `$flox-personas` with sanitized objective, scope, risk/impact,
   decision, and minimum context.
3. Present each contribution separately before consolidation and preserve
   disagreements with their evidence.
4. Give one concise recommendation to the configured decision owner, naming
   coordinator and decision owner; never present it as approval.

## Boundaries

Do not create or approve artifacts, implement code, run gates, change
`status.yaml`, or create persistent state. Party Mode is optional facilitation,
not a gate or a workflow step.

## Output

Return the bounded decision, labeled contributions, and one recommendation with
coordinator and decision owner. Do not return raw YAML or imply an artifact or
status change. Omit `## Changed files`.
