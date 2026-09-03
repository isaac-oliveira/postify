# Roadmap contract block

Each roadmap file must contain exactly one machine-readable block of this
shape. The CLI validates this block; prose outside it is covered by the
full-file fingerprint stored in `reference_fingerprint`. Values are JSON.

```text
<!-- flox-roadmap-contract schema=1
version = "1.x"
roadmap_id = "pentest|quality|release|git"
decision_ids = ["<unique.stable.decision.id>", ...]
field_decisions = {
  "<field>": {"decision_id":"<id>","evidence":"<path>","value_id":"<canonical>"},
  ...
}
decision_records = [
  {
    "id": "<unique.stable.id>",
    "status": "confirmed",
    "decision": "<canonical_value>",
    "evidence": "<project-relative-path-or-confirmation>",
    "fields": ["<field>", ...],
    "content": {"<field>": "<canonical_value>", ...}
  },
  ...
]
last_reviewed_at = "YYYY-MM-DD"
status = "confirmed"
objective = "<project-specific>"
scope = "<project-specific>"
prerequisites = "<project-specific>"
environments = "<project-specific>"
authorized_boundaries = "<project-specific>"
responsible = "<project-specific>"
approvals = "<project-specific>"
procedure = "<project-specific>"
evidence = "<project-specific>"
approval_waiver_criteria = "<project-specific>"
outcomes = "approve"
blockers = "<project-specific>"
finding_treatment = "<project-specific>"
exceptions = "<project-specific>"
re_execution_criteria = "<project-specific>"
observed_facts = "<project-specific> with supporting paths"
provided_decisions = "<project-specific> confirmed by the person"
assumptions = "empty"
open_questions = "empty"
confirmation = "explicitly_confirmed"
-->
```

Every required field must be present, contain project-specific confirmed
content, and remain coherent with the surrounding prose. Placeholders, generic
defaults, and keyword-only values are rejected. `assumptions` and
`open_questions` must equal `"empty"`. `field_decisions` must map every
decision-bearing field exactly once to an owning `decision_id` and a canonical
`value_id` matching the top-level field value. Each `decision_records` entry
must cover its declared `fields` with matching `content` values.

Write all roadmap prose, headings, and action text in the configured
`file_language`; keep only field names, stable IDs, and path-based evidence
canonical (language-independent).

The Git roadmap (`git` roadmap_id) uses the same structure and records the
branch strategy, base branch, naming convention, and merge/finish rules
actually adopted by the project. Users may edit the human-readable sections
directly without invalidating the Setup marker, because edits outside the
contract block change the full-file fingerprint and trigger
`state = "refresh_required"` on the next `flox update`.
