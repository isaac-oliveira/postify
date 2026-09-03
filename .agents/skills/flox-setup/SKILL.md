---
name: flox-setup
description: Analyze a project, ask focused context questions, and create only the Flox context and planning artifacts the project needs. Use when a project needs an initial Flox context, a deliberate refresh, or a revalidation after a change; it is the only skill that can set the Setup marker to valid or create the Pentest, Quality, Release, and Git roadmaps.
---

# Flox Setup

Guided discovery and artifact creation for a new or refreshed Flox project
context. This skill is the only producer allowed to create or revise the
Pentest, Quality, Release, and Git roadmaps and to set the Setup marker to
`valid`. Downstream skills may read those roadmaps but must not create a
substitute, fill a missing section, or revise a confirmed decision.

This is not a code implementation workflow. Keep the analysis factual,
progressive, and bounded, and use the conversation and file languages in
`.flox/config.toml`.

## References

- [references/roadmap-contract.md](references/roadmap-contract.md) — the
  machine-readable block each roadmap must contain and the rules the CLI
  validator applies (read before drafting or revising any roadmap).
- [references/host-validation.md](references/host-validation.md) — host-side
  atomicity, fingerprint, and Darwin internals (for implementers of the CLI
  host, not for the model runtime).

## Bootstrap and refresh contract

Read `[setup]` and `[workflow]` in `.flox/config.toml`. A valid marker has
`schema = 1`, `state = "valid"`, an ISO `last_validated_at` date, non-empty
`references` pointing to confirmed roadmaps, and a matching
`reference_fingerprint`.

**Initial bootstrap** — collect the four roadmap decision sets below, ask
whether the project's Git strategy and confirm it, then propose all four
roadmaps for explicit approval before writing any. Write `state = "valid"` only
after every roadmap is explicitly confirmed.

**Refresh (`state = "refresh_required"` or user-requested)** — preserve
approved roadmap decisions and reconfirm only the gaps or invalidated sections.
Re-ask Git strategy only when the Git roadmap is absent, incompatible, or
explicitly opened for review. A generic roadmap is not approved: keep the
marker `refresh_required` and collect the missing decisions before proposing a
replacement.

Before writing any roadmap or the marker, show one proposal containing the
observed facts, provided decisions, assumptions, open questions, exact target
paths, and fields that will change. Require affirmative confirmation of the
complete proposal; silence, ambiguous answers, or confirmation of only one
roadmap is not approval.

## Workflow

### 1. Read the routing context

In this order when present:

1. `AGENTS.md` and applicable project rules.
2. `.flox/config.toml` — project name, languages, Setup marker, Git strategy.
3. `.flox/artifacts/status.yaml` (read-only).
4. `.flox/project-context.md`.
5. Only the existing artifacts linked by the status index or relevant to the
   setup question.

If `.flox/config.toml` is missing, explain that and stop; do not invent
personal or project preferences.

### 2. Build a shallow project inventory

Read root-level documentation, manifests, lockfiles, build config, scripts,
CI/deployment files, API boundaries, databases, integrations, and any existing
planning documentation. Cite the path supporting each observation. Exclude
`.git/`, `node_modules/`, generated directories, binary files, `.env` files,
and secrets.

Organize findings as **Observed** (file-backed), **Provided** (person-supplied),
**Assumed** (needs confirmation), or **Open** (missing or contradictory).

### 3. Ask focused questions

Present a short diagnostic, then ask only questions whose answers can change
the project context, a roadmap decision, or the next development action. Adapt
to the inventory. Typical areas: product purpose, target users, priority,
platforms, constraints, unclear architecture, UX priorities, commands not
documented in the repository.

### 4. Collect roadmap decisions

Before creating or revising any roadmap, ask focused, material questions and
wait for answers:

- **Pentest** — in-scope assets and environments, authorized testing
  boundaries, and responsible person.
- **Quality** — mandatory acceptance and quality criteria, commands or checks
  that must run, and non-functional requirements.
- **Release** — distribution channel, versioning policy, target environments,
  rollout, rollback, communication plan, and responsible person.
- **Git** — branch strategy (e.g., trunk-based, feature-branch, or the
  project's own approach), base branch, branch naming convention, and
  merge/finish rules. This roadmap is **user-editable**: the person may revise
  the human-readable sections directly; edits outside the contract block
  trigger `state = "refresh_required"` on the next `flox update`. Never
  install a branching tool or invent Git operations not recorded here.

Draft each roadmap from observed project facts only. Label every missing detail
as **Open** and every tentative interpretation as **Assumed**; ask for
corrections before confirmation. Never invent a procedure, command,
environment, owner, rollout, or rollback from a framework default.

Follow [references/roadmap-contract.md](references/roadmap-contract.md) for
the exact block format and validation rules.

### 5. Propose the minimum artifact set

Show a plan with the files to create or update, their purpose, the evidence
and decisions they will contain, unresolved questions, and files to leave
untouched.

Select artifacts:

- Always create or update `.flox/project-context.md` when enough verified
  context exists.
- Create `.flox/artifacts/planning/briefs/` entries when a durable purpose
  summary is needed.
- Create `.flox/artifacts/planning/architecture/` when the system has
  meaningful components, integrations, or technical decisions; recommend
  `$flox-architecture` for the detailed reference.
- Create `.flox/artifacts/planning/ux-designs/` when UI flows or UX decisions
  need a durable record; recommend `$flox-ux-designer` for the detailed
  reference.
- When product requirements need a traceable document, check that
  `../flox-create-prd/SKILL.md` exists relative to this skill's provider
  skills directory. If available, recommend `$flox-create-prd`. If not (core-
  only installation), do not create, approximate, or approve a PRD; explain
  that the focused PRD workflow belongs to Flox Software Studio and direct the
  person to run `flox init --reconfigure` to install that module (or `flox
  update` if already selected), then retry `$flox-create-prd`.
- Do not create an artifact when evidence and answers do not justify it.

### 6. Write approved files

`.flox/project-context.md` may contain only: what the project does, the
current stack and important directories, how to run/test/build it, relevant
conventions and constraints, and the immediate development focus. Keep personal
preferences in `.flox/config.toml`.

Roadmaps go under `.flox/artifacts/planning/`:
- `pentest/PENTEST-ROADMAP.md`
- `quality/QUALITY-ROADMAP.md`
- `release/RELEASE-ROADMAP.md`
- `git/GIT-ROADMAP.md`

Write roadmap prose, headings, and action text in the configured `file_language`;
keep only field names, IDs, and path-based evidence canonical.

After writing confirmed roadmaps, update `.flox/config.toml` with the valid
marker and the four roadmap paths in `references`. Never write `state = "valid"`
until all required references are verified. Keep `status.yaml` read-only
throughout; never write to it.

### 7. Verify and report

After writing, verify: every generated file was in the approved plan; the
project context contains no personal preferences or secrets; no empty artifact
was created; existing non-Flox files were preserved; `status.yaml` is
unchanged; the Setup marker is valid only when references are verified and each
roadmap has explicitly confirmed project decisions.

Finish with:
1. A concise inventory summary.
2. Files created or updated.
3. Files intentionally left untouched.
4. Remaining assumptions or questions.
5. The recommended next action (usually `$flox-quick-dev` for a scoped change
   or `$flox-create-prd` when a PRD is needed).

## Reanalysis

When the person requests a refresh, compare the current project against the
existing `.flox/project-context.md` and relevant planning files. Report new,
changed, and stale findings before proposing updates. Preserve prior decisions
unless the person confirms they are obsolete. Continue to treat `status.yaml`
as read-only.

## Boundaries

- `$flox-setup` is the only producer of the Setup marker, the Git roadmap, and
  the Pentest, Quality, and Release roadmaps.
- Do not modify product source code, tests, user configuration outside `.flox/`,
  or unrelated documentation.
- Do not silently replace an existing context or planning artifact.
- Do not create empty or generic planning documents merely to fill directories.
- Do not expose or copy secrets into the generated context or artifacts.
