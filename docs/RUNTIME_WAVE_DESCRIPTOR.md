# ES-07G — Unified Runtime Wave Descriptor Bridge

ES-07G introduces a common read-only descriptor for handcrafted campaign waves
and certified infinite execution plans.

It does not modify the live game loop.

## Why a bridge is required

The recovered runtime currently calls `getWaveConfig()` from several places:
wave starts, spawning, drops, threat intel and transitions.

Infinite waves cannot safely masquerade as `WaveConfig` because their lifecycle
is different.

## Explicit completion policies

The bridge preserves three distinct policies:

- Campaign Sectors 1–9: `TIMEBOX`;
- Campaign Sector 10: `BOSS_DEFEAT`;
- Infinite waves: `BUDGET_AND_CLEAR`.

This prevents accidental reuse of the campaign timer for infinite encounters.

## Campaign equivalence

`createCampaignRuntimeWaveDescriptor()` preserves the relevant handcrafted
WaveConfig data:

- name and display name;
- subtitle / description / tactical advice;
- warning level / accent color;
- recommended formation;
- duration policy;
- spawn budget / cadence / concurrency / composition;
- elite chance;
- environmental modifier;
- legacy difficulty multiplier;
- resource multiplier;
- boss milestone identity.

Inputs outside campaign 1–10 are rejected rather than inheriting
`getWaveConfig()`'s historical clamp.

## Infinite equivalence

`createInfiniteRuntimeWaveDescriptor()` maps the active
`InfiniteWaveExecutionPlan` without altering:

- spawn configuration;
- active mutators;
- pressure values;
- rewards;
- milestone;
- fairness envelope;
- source recipe/wave/seed diagnostics.

## Certification

- Campaign descriptors are checked against all handcrafted Sectors 1–10.
- Infinite descriptors are checked while a pure session advances from Sector
  11 through Sector 1000.

No React, Canvas, persistence or boss-AI integration occurs in this phase.
