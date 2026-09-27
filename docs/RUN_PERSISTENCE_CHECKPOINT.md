# ES-07I — Campaign Victory Checkpoint & Run Commit Ledger

Sector 10 victory is no longer conceptually the same event as the end of a run
once Sector 11+ can continue.

ES-07I defines the persistence semantics before runtime wiring.

## In-memory ledger

`RunCommitLedger` tracks three one-shot responsibilities:

- `runCountCommitted`
- `campaignVictoryCommitted`
- `telemetryCommitted`

The ledger is intentionally run-local and does not change the persisted
`GameStats` schema.

## Campaign victory checkpoint

When the Blackout Devourer is defeated, the checkpoint may persist:

- the run count, once;
- campaign victory, once;
- boss victory, once;
- boss/codex records;
- Nano Credit balance;
- score / progression / swarm maxima;
- current game memories.

It deliberately does **not** add the run's enemy/resource telemetry.

## Final run commit

When the run really ends, the final commit:

- counts the run only if it was not already counted;
- adds enemy/resource telemetry exactly once;
- updates Nano balance and record maxima;
- never increments campaign/boss victory counters.

This supports both:

1. defeat before Sector 10 -> one final run commit;
2. Devourer victory -> checkpoint -> infinite continuation -> one final
   telemetry commit later.

## Idempotency

Both transitions accept and return the ledger. Reapplying a transition with its
returned ledger may refresh monotonic records or current balances, but cannot
recount the run, victory, boss victory or telemetry.
