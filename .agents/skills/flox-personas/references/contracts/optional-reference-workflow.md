# Optional reference workflow

`$flox-architecture`, `$flox-ux-designer`, and `$flox-design-system` produce
versioned, approvable planning references. They share this workflow; each
skill adds only its own document shape, layer, and particularities.

## Explicit permission

These workflows are optional and never run automatically. Invoke one only
after explicit user permission for the exact current request. A previous
authorization never carries forward, and a recommendation to use the workflow
is not permission to run it. Without permission or a resolvable target, stop
and ask; do not infer scope from a broad request.

## Shared flow

1. Follow `status-contract.md`: read `status.yaml` first, resolve the target
   work item, and require a valid Setup marker before any write.
2. Delegate persona selection to `$flox-personas` per
   `persona-consumer-contract.md`.
3. Scope the reference: identify the decisions needed, constraints, risks,
   and missing information. Ask only questions whose answer could materially
   change scope, contracts, accessibility, or validation. Record other
   unknowns as assumptions or gaps — never invent research, audits,
   inventories, or decisions that were not actually performed or made.
4. Build the reference from the skill's canonical template under its
   canonical planning directory, following `artifact-safety-contract.md`.
   Give it a stable version token and an explicit applicability scope, and
   separate observations, decisions, assumptions, and gaps.
5. When the skill produces an HTML demonstration preview, bind it to the
   exact reference version, label it explicitly as a demonstration, cover the
   relevant states and responsive widths, and make accessibility limits
   visible. The preview is never product implementation, never automatic
   approval or adoption, and unvalidated HTML, props, or URLs from it never
   become product code. While the reference is still `proposed`, regenerate the
   preview in place under the same version; produce a new versioned preview only
   together with a new version created after approval (see the versioning
   section).
6. Update `status.yaml` compactly with the proposed reference and its next
   action, then present the proposal and request explicit approval of that
   exact version. Silence, approval of an Epic, or approval of a prior
   version is insufficient. Do not invoke `$flox-create-story` or
   `$flox-dev-story` while approval is pending.
7. While the version is still `proposed` (not yet approved), incorporate every
   revision — including material changes raised during proposal feedback — by
   editing that same proposed version in place: same `id`, same `-v<version>`,
   same `.md` and `.html` files. Never create a new version for a reference
   that has not been approved. On explicit approval, mark that exact version
   `approved` in the reference artifact so only it is available for later
   consumption, and remove the reference work item from `work_items`: an
   approved reference is inert, so traceability lives in the artifact and its
   links (as with the completion roll-up of planning parents), and downstream
   skills resolve it by version from its planning directory. Only after an
   approved version exists does a further material change create a **new**
   version with the proposal status, an explicit reference to the superseded
   version, and a new approval.

## Versioning and authority

- While a reference version is still `proposed`, editing it in place is
  expected: revise the same version freely until it is approved, without ever
  bumping the version. The prohibition on materially replacing a reference in
  place applies only once the version is **approved**. After approval, a
  material change — anything a consumer could rely on — requires a new version,
  an explicit reference to the superseded version, and a new approval.
  Non-material clarifications may keep the version and must state that no
  decision changed.
- Only one approved version per reference is available for consumption by
  `$flox-create-story` and `$flox-dev-story`, which consume it by version and
  never create, approve, or adopt it.
- Respect the layer precedence in `reference-consumption-contract.md`; a
  reference never becomes a competing source of truth for another layer or
  for PRDs and Epics.

## Shared boundaries

- Do not implement product code or components, tests, branches, or
  deployment state.
- Do not create or modify PRDs, Epics, other reference types, roadmaps, Setup
  preferences, or `status.yaml` beyond the single proposed/approved reference
  record.
- Do not run downstream skills, approve on the user's behalf, or declare the
  work complete; later gates own their transitions.
