---
name: flox-create-prd
description: Guide focused product discovery and create one approved PRD for the next planning step. Use when a product idea, problem, opportunity, or change needs a concise, traceable requirements document before Epics or Stories; it creates and approves the PRD only, never Epics, Stories, specs, or code.
---

# Flox Create PRD

Turn one product request into one concise, traceable PRD and hand it to
`$flox-create-epics`.

## Contracts

Apply the shared [workflow contract](../flox-personas/references/contracts/workflow-contract.md)
and artifact contract. The destination is
`.flox/artifacts/planning/prds/PRD-<id>-<slug>.md`.

## Preconditions

Read config languages, project context, and only linked relevant documents.
Start from the person's request and separate facts, provided decisions,
assumptions, and open questions; never invent requirements.

## Workflow

1. Validate product-discovery intent and identify outcome, users, constraints,
   dependencies, risks, and missing decisions.
2. Ask only questions that can change outcome, scope, requirements, safety, or
   validation; record non-blocking unknowns as assumptions or open questions.
3. Request `$flox-personas` selection and reconcile disagreements with evidence.
4. Create one PRD with problem, users, objective, value, scope/non-scope, applicable requirements,
   success criteria, constraints, dependencies, risks, assumptions, questions,
   links, approval, and next action.
5. Add `status: proposed`, `next_action: "approve PRD"`, and one `prd` item.
   Rescan the PRD and contributions, then request approval of this exact
   version; silence or prior approval is insufficient.
6. On approval, record it, set `status: approved`, and route to
   `$flox-create-epics`. A material revision returns to `proposed` and needs
   approval again.

## Boundaries

Setup owns broad discovery. Do not create Epics, Stories, specs, or code, mark
the project done, or modify unrelated artifacts. `$flox-create-epics` is the
only downstream consumer; `$flox-quick-dev` does not replace this workflow.

## Output

Follow the output contract: show the PRD and separate persona contributions;
request approval while proposed and point to `$flox-create-epics` after
approval. End with `## Changed files` and every relative path.
