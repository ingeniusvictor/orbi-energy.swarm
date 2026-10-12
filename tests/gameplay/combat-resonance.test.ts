import assert from "node:assert/strict";
import test from "node:test";

import {
  COMBAT_CHAIN_WINDOW_MS,
  DAMAGE_BREAK_RESONANCE_PENALTY,
  MAX_COMBAT_CHAIN,
  MAX_RESONANCE,
  applyCombatResonanceDamageBreak,
  createCombatResonanceState,
  expireCombatChain,
  projectCombatResonance,
  registerCombatResonanceDefeat,
} from "../../src/game/combatResonance.ts";

test("combat resonance starts empty and bounded", () => {
  const state = createCombatResonanceState();
  assert.deepEqual(state, {
    chain: 0,
    bestChain: 0,
    resonance: 0,
    lastDefeatAtMs: null,
    affinityTrail: [],
    diversityMilestone: 0,
  });
  assert.deepEqual(projectCombatResonance(state), {
    tier: "QUIET",
    chainMultiplier: 1,
    resonanceBonus: 0,
    scoreMultiplier: 1,
    overdriveReady: false,
  });
});

test("defeats inside the chain window continue the chain while late defeats restart it", () => {
  let state = createCombatResonanceState();
  state = registerCombatResonanceDefeat(state, {
    occurredAtMs: 1000,
    baseScore: 100,
    affinity: "solar",
  }).state;
  state = registerCombatResonanceDefeat(state, {
    occurredAtMs: 1000 + COMBAT_CHAIN_WINDOW_MS,
    baseScore: 100,
    affinity: "hydro",
  }).state;
  assert.equal(state.chain, 2);

  state = registerCombatResonanceDefeat(state, {
    occurredAtMs: 1000 + COMBAT_CHAIN_WINDOW_MS * 2 + 1,
    baseScore: 100,
    affinity: "wind",
  }).state;
  assert.equal(state.chain, 1);
  assert.equal(state.bestChain, 2);
  assert.equal(state.diversityMilestone, 0);
});

test("mixed affinities build resonance faster than repeating one affinity", () => {
  let repeated = createCombatResonanceState();
  let mixed = createCombatResonanceState();
  const affinities = ["solar", "hydro", "wind", "thermal"] as const;

  for (let index = 0; index < 4; index += 1) {
    repeated = registerCombatResonanceDefeat(repeated, {
      occurredAtMs: index * 500,
      baseScore: 100,
      affinity: "solar",
    }).state;
    mixed = registerCombatResonanceDefeat(mixed, {
      occurredAtMs: index * 500,
      baseScore: 100,
      affinity: affinities[index],
    }).state;
  }

  assert.ok(mixed.resonance > repeated.resonance);
  assert.equal(mixed.diversityMilestone, 4);
});

test("three- and four-affinity diversity bonuses trigger only once per uninterrupted chain", () => {
  let state = createCombatResonanceState();
  const first = registerCombatResonanceDefeat(state, {
    occurredAtMs: 0,
    baseScore: 100,
    affinity: "solar",
  });
  state = first.state;
  const second = registerCombatResonanceDefeat(state, {
    occurredAtMs: 400,
    baseScore: 100,
    affinity: "hydro",
  });
  state = second.state;
  const third = registerCombatResonanceDefeat(state, {
    occurredAtMs: 800,
    baseScore: 100,
    affinity: "wind",
  });
  state = third.state;
  const fourth = registerCombatResonanceDefeat(state, {
    occurredAtMs: 1200,
    baseScore: 100,
    affinity: "thermal",
  });
  state = fourth.state;
  const fifth = registerCombatResonanceDefeat(state, {
    occurredAtMs: 1600,
    baseScore: 100,
    affinity: "magnetic",
  });

  assert.equal(third.diversityMilestoneReached, 3);
  assert.equal(fourth.diversityMilestoneReached, 4);
  assert.equal(fifth.diversityMilestoneReached, 0);
  assert.equal(fifth.state.diversityMilestone, 4);
});

test("boss and elite defeats add bounded resonance weight", () => {
  const base = createCombatResonanceState();
  const normal = registerCombatResonanceDefeat(base, {
    occurredAtMs: 0,
    baseScore: 100,
    affinity: "solar",
  });
  const elite = registerCombatResonanceDefeat(base, {
    occurredAtMs: 0,
    baseScore: 100,
    affinity: "solar",
    isElite: true,
  });
  const boss = registerCombatResonanceDefeat(base, {
    occurredAtMs: 0,
    baseScore: 100,
    affinity: "solar",
    isBoss: true,
  });

  assert.ok(elite.resonanceGain > normal.resonanceGain);
  assert.ok(boss.resonanceGain > elite.resonanceGain);
  assert.ok(boss.state.resonance <= MAX_RESONANCE);
});

test("score projection escalates with mastery but never exceeds 2x", () => {
  let state = createCombatResonanceState();
  let lastAward = 0;

  for (let index = 0; index < 80; index += 1) {
    const result = registerCombatResonanceDefeat(state, {
      occurredAtMs: index * 100,
      baseScore: 100,
      affinity: index % 2 === 0 ? "solar" : "hydro",
      isBoss: index % 20 === 0,
    });
    state = result.state;
    lastAward = result.awardedScore;
    assert.ok(result.projection.scoreMultiplier <= 2);
  }

  assert.equal(state.resonance, MAX_RESONANCE);
  assert.equal(projectCombatResonance(state).overdriveReady, true);
  assert.ok(lastAward <= 200);
});

test("damage breaks the active chain and preserves only bounded resonance momentum", () => {
  let state = createCombatResonanceState();
  for (let index = 0; index < 10; index += 1) {
    state = registerCombatResonanceDefeat(state, {
      occurredAtMs: index * 100,
      baseScore: 100,
      affinity: index % 2 === 0 ? "solar" : "hydro",
    }).state;
  }

  const before = state.resonance;
  const broken = applyCombatResonanceDamageBreak(state);
  assert.equal(broken.chain, 0);
  assert.equal(broken.lastDefeatAtMs, null);
  assert.deepEqual(broken.affinityTrail, []);
  assert.equal(broken.diversityMilestone, 0);
  assert.equal(
    broken.resonance,
    Math.max(0, before - DAMAGE_BREAK_RESONANCE_PENALTY),
  );
  assert.equal(broken.bestChain, state.bestChain);
});

test("explicit expiry clears chain sequencing without erasing earned resonance", () => {
  let state = registerCombatResonanceDefeat(createCombatResonanceState(), {
    occurredAtMs: 100,
    baseScore: 100,
    affinity: "quantum",
  }).state;
  const resonance = state.resonance;

  state = expireCombatChain(state, 100 + COMBAT_CHAIN_WINDOW_MS + 1);
  assert.equal(state.chain, 0);
  assert.equal(state.resonance, resonance);
  assert.equal(state.lastDefeatAtMs, null);
});

test("chain and resonance remain capped under extreme input", () => {
  let state = createCombatResonanceState();
  for (let index = 0; index < 1400; index += 1) {
    state = registerCombatResonanceDefeat(state, {
      occurredAtMs: index,
      baseScore: 1,
      affinity: "gaia",
      isBoss: true,
      isElite: true,
    }).state;
  }

  assert.equal(state.chain, MAX_COMBAT_CHAIN);
  assert.equal(state.resonance, MAX_RESONANCE);
});

test("invalid time and score inputs fail closed", () => {
  const state = createCombatResonanceState();
  assert.throws(() =>
    registerCombatResonanceDefeat(state, {
      occurredAtMs: Number.NaN,
      baseScore: 100,
    }),
  );
  assert.throws(() =>
    registerCombatResonanceDefeat(state, {
      occurredAtMs: 0,
      baseScore: -1,
    }),
  );
  assert.throws(() => expireCombatChain(state, -1));
});
