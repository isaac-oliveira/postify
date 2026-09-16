---
name: flox-help
description: Show which Flox skills are installed and the smallest route to use them, as a read-only catalog. Use to get oriented, list available Flox workflows, or find which skill owns a goal; it never starts a workflow, changes artifacts, or calls another skill.
---

# Flox Help

Present a read-only catalog of the skills actually installed in this project
and point the person to the smallest route for their goal.

## Output

Build the catalog from `.flox/config.toml` (which must declare `modules`,
`skills`, and `providers`), `.flox/manifest.toml`, and every configured
provider path. If any is missing, invalid, empty, or unreadable, report the
problem and direct the person to `$flox-setup`; never use a hardcoded list.
A manifest skill is available only when its `SKILL.md` exists under every
configured provider (`.agents/skills`, `.claude/skills`, or `.grok/skills`).
Read each available skill's frontmatter and report its name, purpose, use case,
`$flox-<id>` invocation/path, prerequisite, and next step.

Remain strictly read-only: do not run or hand off workflows and do not change
artifacts, configuration, or status. Map the person's goal to the shortest
installed route: setup → `$flox-setup`; product → `$flox-create-prd` then
`$flox-create-epics`; Story → `$flox-create-story`; implementation →
`$flox-dev-story` or `$flox-quick-dev`; review → `$flox-code-review`; optional
Architecture/UX/Design System only with explicit permission; bounded
discussion → `$flox-party-mode`; then installed Pentest, Quality, or Release.
Do not present planned, unavailable, or silently substituted skills.

Answer briefly in the configured language, keeping skill IDs unchanged:
**Use**, **Provide**, and **Expect**.

This skill produces no file artifacts; omit the `## Changed files` section.
