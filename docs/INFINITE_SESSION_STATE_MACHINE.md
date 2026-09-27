# ES-07F — Infinite Session State Machine

ES-07F adds pure sequencing around the certified infinite planning pipeline.

It still does not connect Sector 11+ to the live game component.

## Session lifecycle

A session:

- starts at Sector 11 / Wave 1;
- carries one seed;
- carries the normalized context used for the current sector;
- holds one `CertifiedInfiniteSectorPlan`;
- advances wave by wave;
- advances exactly one sector after the current final wave;
- rebuilds the next sector with the supplied next-sector context;
- has no artificial maximum sector;
- terminates only through an explicit defeat or exit state.

## Context boundary

Context changes do not rebuild a sector already in progress.

`nextSectorContext` is only consumed when the current sector's final wave is
cleared. This prevents dynamic difficulty from changing an encounter after the
player has already entered it.

## Runtime-neutral API

- `createInfiniteSession()`
- `getCurrentInfiniteExecutionPlan()`
- `advanceInfiniteSession()`
- `endInfiniteSession()`
- `validateInfiniteSession()`

All operations are pure with respect to the input session: advancing returns a
new state instead of mutating the previous object.

## Certification

Automated tests walk the state machine from Sector 11 through Sector 1000 and
validate the session cursor and current execution plan throughout the sequence.
