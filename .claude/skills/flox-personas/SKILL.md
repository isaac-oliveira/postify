---
name: flox-personas
description: Load focused, provider-agnostic persona cards for Flox planning, party-mode, implementation, QA, security, and code review. Use whenever a Flox workflow needs to select or dispatch a reviewer, planner, implementer, or specialist role; it owns the persona roster and selection so no other skill keeps one.
---

# Flox Personas

Provide the smallest provider-agnostic set of functional roles justified by a
sanitized request. This catalog does not run workflows, approve artifacts, or
change status.

## Contracts

Apply [persona-consumer-contract.md](references/contracts/persona-consumer-contract.md)
and its [validation contract](references/contracts/validation-contract.md) for
closed request/response shapes, safe IDs and paths, secret scanning,
descriptor-safe cards, and dispatch.

## Boundaries

The complete roster is the identity table below; the card basename is the
stable ID and display fields are not aliases (`gilfoyle` is not an ID). Select only the smallest set
justified by the request, never a substitute after rejection, and do not send
secrets or unrelated context. The decision owner is always the configured
person with `role: decision owner`.

| ID | Display name | Emoji | Role | Card |
| --- | --- | --- | --- | --- |
| `jared-dunn` | Jared Dunn | 📋 | planning and scope | `references/personas/jared-dunn.md` |
| `bertram-gilfoyle` | Gilfoyle | 🏗️ | architecture | `references/personas/bertram-gilfoyle.md` |
| `dinesh-chugtai` | Dinesh Chugtai | 💻 | implementation | `references/personas/dinesh-chugtai.md` |
| `stem` | STEM | 🧬 | correction and regression review | `references/personas/stem.md` |
| `felicity-smoak` | Felicity Smoak | 🧪 | tests | `references/personas/felicity-smoak.md` |
| `elliot-alderson` | Elliot Alderson | 🛡️ | security | `references/personas/elliot-alderson.md` |
| `maeve-millay` | Maeve Millay | 🎭 | UX | `references/personas/maeve-millay.md` |

Resolve every selected card through the contract's containment, no-symlink,
and race-safe read rules. Read each once, keep voice limited to tone, and
record contributions separately with decision, evidence, risks, and next
action. If the catalog, dependency, card, or safe runtime is unavailable,
stop closed and direct the person to `flox update` or a complete module.

## Output

Return only the closed selection response: selected IDs with canonical names,
emojis, roles, and justifications; coordinator; and configured decision owner.
This skill produces no file artifacts; omit `## Changed files`.
