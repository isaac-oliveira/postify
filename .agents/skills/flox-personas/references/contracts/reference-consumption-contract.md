# Reference consumption contract

Architecture (`ARCH-*`), UX (`UX-*`), and Design System (`DS-*`) references
are optional, versioned planning artifacts. This contract defines how
`$flox-create-story` and `$flox-dev-story` consume them so approved decisions
are respected without turning recommendations into obligations.

## Applicability

- When creating or executing a Story, check `status.yaml` and the planning
  directories for an **approved** Architecture, UX, or Design System
  reference whose applicability scope covers the target work item.
- Record the result in the Story's **References** section — one line per
  reference type stating applicable `yes/no`, and when applicable, the
  approved version plus exactly what is consumed:
  - Architecture: the technical boundaries it supplies.
  - UX: the flows, screens, states, responsiveness, and accessibility
    decisions that apply.
  - Design System: the components, props, variants, and states to be
    consumed.
- A Story whose References section does not resolve applicability for all
  three types is incomplete and not approvable.

## Precedence

Architecture defines technical limits; UX defines experience; Design System
defines component contracts. A consumer never redefines another layer: do not
derive component contracts from UX prose, technical limits from a Design
System, or flows from an Architecture reference.

## Gaps and blocks

- Consume only the exact approved version recorded in the Story. If an
  applicable reference is missing, superseded, or has a gap, block only the
  affected Story segment and direct the person to request the update through
  the owning skill. Never modify the reference, apply an implicit exception,
  or invent the missing content.
- During implementation, validate conformity with the consumed contracts
  (Design System components/props/variants/states; UX flows and states) as
  part of the Story validation plan. A detected divergence blocks the
  affected segment and returns to the person; the implementer never
  "corrects" a reference on their own.

## Authorization

A recommendation to use Architecture, UX, or Design System is never
permission to invoke those skills. Explain the reason, impact, expected
artifact, and consequence of declining, then wait for explicit permission. A
previous authorization never carries forward to a new reference or revision.
