# Validation contract

This is the single canonical validation baseline shared by
`persona-consumer-contract.md` and `artifact-safety-contract.md`. It owns
sanitization, validation, limits, safe names and paths, secret scanning, and
fail-closed rejection. Each consumer retains only the policy for its own
selection, card reading, or artifact lifecycle.

## Ownership and order

- Apply this contract before persona selection, persona dispatch, routed reads,
  or artifact persistence. The caller validates the input and the consumer
  revalidates the same value; a value changed after validation is invalid.
- Validate the complete closed shape before any field enters a prompt or an
  effect. Reject malformed, ambiguous, unexpected, or partially validated
  input; never add a permissive fallback or silently repair an unsafe value.
- A consumer may add a domain-specific constraint, but must not repeat a
  shared rule as a competing definition. Domain policies explain where the
  shared checks are applied.

## Sanitized values and serialized structures

- A bounded text value is a string that is non-empty after Unicode whitespace
  trimming, contains at most 2,000 Unicode scalar values, and contains no
  control characters, including NUL, CR, LF, DEL, or invisible format
  controls.
- A duplicate-key rejecting parser must reject duplicate serialized keys
  before an object exists. For a closed object, reject missing keys, extra or
  unknown keys, aliases, altered fields, wrong value types, and ambiguous
  structure before selection, dispatch, reading, or persistence.
- Task-local context records are bounded to 4,000 Unicode scalar values per
  value. They must use only the consumer's explicit allowlist, contain no raw
  file contents, and contain no empty, duplicate, or unknown records.
- Preserve the declared limits during normalization and validation. Do not
  truncate, decode into a more permissive form, or reinterpret a rejected
  value as safe.

## IDs, path values, containment, and symlinks

- A lowercase ASCII token uses `^[a-z0-9]+(?:-[a-z0-9]+)*$`; reject empty
  values, leading or trailing hyphens, repeated hyphens, dot segments,
  control characters, slashes, and backslashes. Persona IDs use this token;
  artifact IDs and slugs may define their explicit case-sensitive alphabets
  while retaining these unsafe-component rejection rules.
- A project-relative path must contain no `..` segment, leading slash,
  backslash, glob, percent-encoded separator, or control character. It must
  be limited to files explicitly in the current task scope.
- Before using a filesystem path, inspect every existing component with
  no-follow metadata. Require expected real directories and regular files,
  reject every symbolic link, resolve the candidate, and prove strict-child
  containment under the validated root. Missing components may be created only
  under the owning consumer's explicit bootstrap policy.
- An unexpected type, missing required path, failed containment check, or
  symlink is a validation failure. Do not read, display, dispatch, or write
  after that failure.

## Secret scanning and fail-closed handling

- Scan the allowlisted filename and contents for sensitive paths and secret
  patterns before dispatch or persistence, without printing matches. Reject
  `.env` files, credentials, private keys, tokens, secrets, and unrelated
  repository content.
- Apply the same scan to related links, frontmatter, bodies, and persona
  contributions when they are part of an artifact. Redact only when the
  surrounding meaning remains accurate; otherwise stop and request sanitized
  input. Never copy a matching value into an artifact, status index, response,
  log, or error message.

## Equivalence matrix

The matrix records the extraction from the two consumer contracts. The
validation rules in the middle column are defined here once; the last two
columns identify the policy that remains in each consumer.

| Rule | Observed source(s) and canonical destination | Persona-specific policy | Artifact-specific policy | Preserved invariant |
| --- | --- | --- | --- | --- |
| Text sanitization and limits | `persona-consumer-contract.md` Closed selection request/response; `artifact-safety-contract.md` Frontmatter and Context safety → Sanitized values | Validate the closed request and response fields | Validate title and artifact text before persistence | Non-empty values, Unicode limits, and control-character rejection |
| Closed serialized input | `persona-consumer-contract.md` Closed selection request/response; `artifact-safety-contract.md` Frontmatter → Serialized structures | Exact request/response keys and response shape | Exactly one unambiguous frontmatter block and required keys | Duplicate, unknown, alias, and ambiguous input is rejected before effects |
| Safe identifiers and path values | `persona-consumer-contract.md` request context/card ID; `artifact-safety-contract.md` ID and slug normalization → IDs and path values | Lowercase persona IDs, task-scope paths, and `<id>.md` basename | Uppercase artifact IDs, lowercase slugs, and canonical filenames | Unsafe separators, dot segments, controls, and malformed tokens never pass |
| Containment and no symlink | `persona-consumer-contract.md` Safe card resolution; `artifact-safety-contract.md` Root bootstrap and containment → filesystem checks | Provider persona root and card are strict-child, real, and non-symbolic | `.flox/artifacts/` and artifact destinations are strict-child, real, and non-symbolic | No path escape or symlink traversal is allowed |
| Secret scanning | `persona-consumer-contract.md` request context; `artifact-safety-contract.md` Context and secret safety → Secret scanning | Sanitize allowlisted context before selection or dispatch | Sanitize artifact filename, content, links, and contributions | Sensitive values are rejected or safely redacted and never disclosed |
| Fail-closed rejection | Both consumer contracts' validation and rejection statements → Ownership and order | Stop before selection or card dispatch | Stop before artifact read or persistence | No bypass, permissive fallback, or unsafe repair is introduced |

## Consumer boundary

The shared contract does not select personas, define the response roster,
choose card-read primitives, parse artifact frontmatter, bootstrap artifact
directories, or decide artifact replacement semantics. Those remain explicit in
the consuming contracts after they invoke this validation baseline.
