---
name: flox-help
description: Show which Flox skills are installed and the smallest route to use them, as a read-only catalog. Use to get oriented, list available Flox workflows, or find which skill owns a goal; it never starts a workflow, changes artifacts, or calls another skill.
---

# Flox Help

Present a read-only catalog of the skills actually installed in this project
and point the person to the smallest route for their goal.

## Read-only limit

`flox-help` is strictly read-only. Do not start, run, or hand off to any
workflow or other skill; do not create, edit, move, or delete any artifact,
configuration, or status; and read only the files needed to build the catalog
and answer. If the person asks to configure the project, run a workflow, or
change an artifact, name the installed skill that owns that action (for
example `$flox-setup` for context and configuration) and stop.

## Validate before answering

Report any problem instead of guessing:

1. `.flox/config.toml` — must exist and declare the selected `modules`,
   `skills`, and `providers`. If missing or unreadable, say so and direct the
   person to `$flox-setup`.
2. `.flox/manifest.toml` — the generated source of truth for installed skills.
   If it is missing, invalid, or lists no skills, say the catalog cannot be
   built, explain what is missing, and direct the person to re-run the
   installer or `$flox-setup`; do not fall back to a hardcoded skill list.
3. Every configured provider-visible skill directory — each skill named in the
   manifest must resolve under each configured provider's directory
   (`.agents/skills/<id>/`, `.claude/skills/<id>/`, or `.grok/skills/<id>/`).
   Flag a manifest entry missing from any configured provider as unavailable
   rather than presenting it as fully usable.

Only skills that appear in the manifest AND resolve in every configured
provider directory are presented as installed and available.

## Build the catalog

Read each installed skill's own `SKILL.md` frontmatter and present exactly
these fields per skill, without inventing capabilities, invocation syntax, or
behavior:

- **Name** — the skill's human-readable name and stable ID.
- **What it does** — one simple sentence.
- **When to use** — the situation that calls for it.
- **Invocation / path** — how to invoke it (`$flox-<id>`) and its provider
  path.
- **Prerequisite** — the relevant precondition (a valid Setup marker, an
  approved upstream artifact), when one applies.
- **Next step** — the expected next action after it runs.

Never present a planned, uninstalled, or unavailable skill as if it were
available.

## Recognize intent and suggest the smallest route

Map a stated goal to the smallest applicable route using only installed
skills, and link the relevant artifacts or paths:

- **Plan the product** → `$flox-create-prd`, then `$flox-create-epics`.
- **Set up or refresh project context** → `$flox-setup`.
- **Create a Story** → `$flox-create-story` from an approved Epic map.
- **Develop / implement** → `$flox-dev-story` from an approved Story, or
  `$flox-quick-dev` for a small, well-scoped task.
- **Review code** → `$flox-code-review`.
- **Decide architecture, UX, or Design System** → request explicit permission,
  then use the corresponding optional reference skill.
- **Explore one bounded decision with personas** → `$flox-party-mode`, only
  when explicitly authorized.
- **Security test** → the Pentest skill, when installed.
- **Validate quality** → the Quality skill, when installed.
- **Release** → the Release skill, when installed.
- **Ask questions / get oriented** → stay in `$flox-help`.

Always prefer the shortest route that reaches the goal; do not chain skills the
person did not ask for. When a skill is not installed, say so explicitly, point
to the closest installed alternative when one exists, and otherwise direct the
person to update the installation or run `$flox-setup`. Do not silently
substitute a different skill.

## Output

Keep the answer short and actionable, in the person's configured language
(skill IDs unchanged):

1. **Use:** the installed skill (or route) and how to invoke it.
2. **Provide:** the context or inputs it needs and the prerequisite to satisfy.
3. **Expect:** the result and the next step.
