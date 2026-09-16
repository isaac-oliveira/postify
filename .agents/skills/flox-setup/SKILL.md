---
name: flox-setup
description: Analyze a project, ask focused context questions, and create only the Flox context and planning artifacts the project needs. Use when a project needs an initial Flox context, a deliberate refresh, or a revalidation after a change; it is the only skill that can set the Setup marker to valid or create the Pentest, Quality, Release, and Git roadmaps.
---

# Flox Setup

Setup is the only producer of `.flox/project-context.md`, the Pentest,
Quality, Release, and Git roadmaps, the complete reference fingerprint, and a
`state = "valid"` marker. Downstream skills only consume the confirmed
snapshot. This is bounded discovery, not code implementation; use the
configured conversation and file languages.

## Workflow

Read `AGENTS.md`, `.flox/config.toml` sections `[setup]` and `[workflow]`,
`.flox/artifacts/status.yaml`,
`.flox/project-context.md`, and only relevant linked artifacts. A missing
config stops the workflow. Inventory docs, manifests, scripts, build/deploy
files, integrations, and planning files; exclude `.git/`, `node_modules/`,
generated/binary files, `.env`, and secrets. Label findings **Observed**,
**Provided**, **Assumed**, or **Open**.

Ask only questions that can change context, a roadmap decision, or the next
action. Collect explicit decisions for Pentest, Quality, Release, and Git:
strategy, base, naming, merge/finish rules, scope, checks, distribution,
versioning, environments, rollout, rollback, owners, and approvals. Never
invent a command, environment, owner, rollout, rollback, or branch operation.
The Git roadmap is user-editable outside its contract block; an invalid edit
requires `refresh_required`.

Use [references/roadmap-contract.md](references/roadmap-contract.md) for the
machine-readable roadmap contract and
[references/host-validation.md](references/host-validation.md) only for CLI
host implementation details.

Propose the minimum files, purposes, evidence, open questions, and untouched
paths before writing. Initial bootstrap creates or updates the context and four
roadmaps only when justified. A refresh (`state = "refresh_required"` or
user-requested) preserves confirmed decisions and revisits only gaps; a generic
roadmap is not approval. A valid marker requires `schema = 1`, `state = "valid"`,
an ISO date, non-empty confirmed references, and a matching
`reference_fingerprint`. Before writing any roadmap or marker, show one
complete proposal and require affirmative confirmation of every changed file
and decision.

Write approved context and roadmaps in `file_language`; keep personal
preferences in config and `.flox/artifacts/status.yaml` read-only. The context
may contain only project purpose, stack/directories, run/test/build commands,
conventions/constraints, and immediate focus. Verify
scope, no secrets or empty artifacts, preservation of unrelated files,
unchanged status, and confirmed references after writing. For a requested
refresh, report new, changed, and stale findings before proposing updates.

## Boundaries

Do not implement product code, create generic artifacts, replace confirmed
decisions, expose secrets, or change `status.yaml`. Do not create or revise
PRDs, Epics, Stories, or optional reference content; recommend their owning
skills when justified. Setup alone may create the four roadmaps, marker, and
complete fingerprint.

## Output

Report the inventory, decisions, files created or updated, files intentionally
untouched, remaining assumptions/questions, marker state, and exactly one next
action (usually `$flox-quick-dev` or `$flox-create-prd`). Use configured
language and follow the artifact output contract.

End with `## Changed files` listing every created or modified relative path.
