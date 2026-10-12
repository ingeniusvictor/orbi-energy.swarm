# Roadmap Status Legend

Use these labels consistently in roadmap and ledger records:

- `PLANNED` — accepted future scope; implementation has not started.
- `ACTIVE` — issue/branch work is in progress.
- `DIAGNOSTIC` — investigation only; no fix is assumed valid yet.
- `CERTIFYING` — implementation exists but full required gates are not complete.
- `MERGED` — merged to `main`, but exact-SHA post-merge deployment evidence may still be incomplete.
- `DEPLOYED` — exact-SHA main CI and required deployment evidence are GREEN.
- `FROZEN` — deployed phase treated as stable historical baseline; changes require a scoped corrective issue.
- `DEFERRED` — deliberately postponed; not a failure.
- `BLOCKED` — cannot advance until an explicit blocker is resolved.

Never use `DEPLOYED`, `FROZEN`, or `COMPLETED` based only on chat history or a PR merge.