# Artifact safety contract

Every skill that creates or revises a Flox artifact under `.flox/artifacts/`
follows this contract. It protects against untrusted routed values and
pre-existing symbolic links or unexpected files; it does not promise safety
against a hostile concurrent process that can write to the workspace. If
concurrent mutation is detected or reasonably expected, stop without reading,
displaying, or writing the artifact.

## Validation dependency

Apply [validation-contract.md](validation-contract.md) before reading or
writing an artifact. It owns shared sanitization, limits, safe names and
paths, containment, no-symlink checks, secret scanning, and fail-closed
rejection. This contract retains the artifact-specific bootstrap, frontmatter,
and read/write policies.

## ID and slug normalization

- Normalize the artifact ID token to uppercase ASCII alphanumerics separated
  only by single hyphens, and the slug to lowercase ASCII alphanumerics
  separated only by single hyphens, applying the shared ID and path rejection
  rules from `validation-contract.md`.
- The artifact filename is exactly `<PREFIX>-<id>-<slug>.md` beneath its
  canonical root (for example `PRD-…` under `planning/prds/`, `EPIC-…` under
  `implementations/epics/`, `STORY-…` under `implementations/stories/`,
  `SPEC-…` under `implementations/specs/`). For the optional Architecture, UX,
  and Design System references, use the compact form
  `<PREFIX>-<id>-<slug-curto>-v<version>.<extension>`:
  `ARCH-…` under `planning/architecture/`, `UX-…` under `planning/ux-designs/`,
  and `DS-…` under `planning/design-system/`. The compact slug has one to three
  short lowercase ASCII keywords, does not repeat the type already expressed by
  the prefix or directory, and keeps the stable ID in the initial
  `<PREFIX>-<id>` segment. Examples are `ARCH-001-cli-modules-v1.md`,
  `UX-001-init-flow-v1.md`, and `DS-001-module-ui-v1.md`.
- The HTML demonstration for a UX or Design System reference uses the same
  initial ID, compact slug, and version, changing only the extension:
  `UX-001-init-flow-v1.html` and `DS-001-module-ui-v1.html`. The title remains
  inside the reference and is not used to construct the filename. Existing
  artifacts are not renamed automatically; the compact form applies to new
  references.

## Root bootstrap and containment

- Bootstrap from the expected existing canonical ancestor `.flox/artifacts/`,
  applying the shared containment and no-symlink checks. `status.yaml`
  establishes that configured context. Validate `.flox` and `artifacts`
  individually as real directories. Stop if `.flox/artifacts/` is absent.
- For each missing intermediate component (for example `planning` then
  `prds`): confirm that exact component is still absent, create only it with a
  non-recursive, no-overwrite operation, then resolve and revalidate it as a
  real directory, a strict child of the canonical ancestor, and not a
  symbolic link. For an existing component, require the expected real
  directory and perform the same resolution, strict-child, type, and
  no-symlink validation. Never use unrestricted recursive directory creation.
- Only after the root validates, construct the candidate destination, resolve
  it, and prove it remains a strict child of the canonical root using the
  shared filesystem checks. Refuse the write if any component or the
  destination is a symbolic link.
- Producer order is fixed: bootstrap and revalidate the root → resolve root
  and candidate → prove strict-child containment → run the destination checks
  below.

## Reads and writes

- Treat any artifact path routed through `status.yaml` as untrusted input:
  apply `validation-contract.md` and the artifact filename rules before
  reading it, and require the frontmatter `id` to equal the ID encoded in the
  safe filename.
- Use one validated read for frontmatter parsing, secret scanning and
  sanitization, persona context, and display when the host permits it; do not
  reopen the path unnecessarily. Repeat the path, containment, type, and
  no-follow checks immediately before each write.
- For creation, require the destination to be absent and never overwrite a
  destination that appears or is otherwise unexpected. For revision, require
  the destination to remain the expected regular file and stop if it is
  absent, changed, or unexpected. Prefer no-clobber creation and
  same-directory atomic replacement when the host offers them, but do not
  require unavailable descriptor-relative or compare-and-swap APIs.
- After writing, confirm the destination path, regular-file type, and exact
  sanitized content; stop and report a validation failure without displaying
  unsafe content on mismatch.

## Frontmatter

- Serialize `title` as a double-quoted YAML scalar using JSON-compatible
  escaping; never interpolate a raw title. Apply the shared text
  sanitization rules and reject line breaks or control characters that cannot
  be represented safely.
- Require exactly one frontmatter block at the start of the file and exactly
  one occurrence of each required key. Reject duplicate keys, aliases,
  anchors, merge keys, tags, directives, alternate spellings, unknown keys,
  or multiple frontmatter blocks as ambiguous. Do not persist or hand off an
  ambiguous document.

## Context and secret safety

Before dispatching any persona or persisting/showing an artifact, apply the
shared secret-scanning rules from `validation-contract.md` to the explicit
allowlisted context or to the artifact filename, frontmatter, body, related
links, and persona contributions. The consumer must retain its domain scope
and must not expose a scan match.
