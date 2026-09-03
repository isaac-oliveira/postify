# Output contract

Workflow skills that dispatch personas and produce or advance an artifact
close their response with these sections, in this order. Omit a section only
when it does not apply to the skill (for example, a skill that produces no
persona contributions). Gate skills use the same shape even when the artifact
is the existing `work_item` rather than a new planning document.

## Persona contributions

Show each selected contribution separately and identifiably, with the full
persona name, emoji, role, decision, evidence, risks, and next action. Label
any locally applied card as `sequential fallback`. Never return raw YAML,
tool traces, or an anonymous list.

## Artifact

Link the artifact, state its status (and version, when the artifact is
versioned), and show the complete document or the complete proposed changes
for a revision.

## Status

State the `status.yaml` transition, the current decision owner, and exactly
one next action. For a terminal completion, state that there is no further
workflow action and that the completed item was removed from `work_items`.
Do not claim release or completion the skill does not own.

## Next step

State exactly one actionable next step. At proposal, request explicit
approval of the exact artifact; after approval, point to the single
downstream consumer. For a terminal completion, state that no further action
is pending instead of inventing a persisted `next_action`.
