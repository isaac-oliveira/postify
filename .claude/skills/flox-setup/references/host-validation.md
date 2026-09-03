# Host-side validation internals

This document belongs to the CLI host implementation (`tools/lib/config.mjs`),
not to the AI skill runtime. It records the host-level contracts so the
implementation stays auditable without polluting the model instructions.

## Fingerprint and atomic write

The Setup marker persists a `reference_fingerprint` array that covers every
referenced file's device/inode identity and SHA-256 hash of its complete
visible bytes, plus the device/inode of each ancestor directory from the
`.flox` root through each reference. The fingerprint covers prose outside the
structured roadmap block so contradictory content cannot survive a re-emission.

Configuration writes use the per-configuration lock, no-follow checks, and
target-identity checks. On Darwin, the implementation commits to the already-
open target descriptor under the lock and syncs before release; this closes
the post-validation exchange window. A writer with a stale Setup state fails
closed rather than overwriting a concurrently confirmed decision.

For idempotent runs, the implementation serializes reads and writes with the
per-configuration lock, validates each canonical relative path and every
existing component as a non-symlink before reading or writing, and opens each
referenced file with no-follow semantics, keeping every descriptor open
through reading, hashing, and contract validation.

On Darwin, `openat`/`renameat` equivalents are approximated by snapshotting
the visible directory and target identity before opening, rechecking both
immediately before writing, and verifying again after commit. Existing-target
Darwin updates are in-place (truncate then writeFile and sync): they are
descriptor-pinned but can be partially written if the process is interrupted
between operations. New-target paths are not atomic replacements. The
executable tests cover reference-tree exchange, in-place mutation during a
pinned read, post-validation mutation, and both existing/new target
boundaries, and verify that the replacement directory is not modified.

## Roadmap contract block validation

The CLI validator only inspects the structured `<!-- flox-roadmap-contract …
-->` block; it does not parse arbitrary prose. The block must appear exactly
once, declare major-version `1`, `status = "confirmed"`, non-empty
project-specific `field_decisions` and `decision_records`, `assumptions =
"empty"`, and `open_questions = "empty"`. Placeholder, sample, keyword-only,
near-miss, and contradictory values are rejected in every decision-bearing
field. Prose outside the block is covered by the full-file fingerprint.

## Test harness note

The repository test harness may emulate the host-side producer to exercise
creation, explicit confirmation, idempotent re-execution, and authorized
revision; it is a contract fixture, not an AI runtime and not a capability of
`flox init` or `flox update`. The CLI host validates and persists this
boundary, configuration, and provider files; it does not run `$flox-setup`,
ask the person's questions, generate or revise a roadmap, or invent decisions.
