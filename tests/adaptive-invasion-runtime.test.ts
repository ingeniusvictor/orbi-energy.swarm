import assert from "node:assert/strict";
import test from "node:test";
import { MAX_ENEMIES, MAX_PROJECTILES } from "../src/game/constants.ts";
import { applyAdaptiveInvasionToDescriptor } from "../src/game/adaptiveInvasionRuntime.ts";
import { createInfiniteRuntimeWaveDescriptor } from "../src/game/runtimeWaveDescriptor.ts";
import { buildCertifiedInfiniteSectorPlan, NEUTRAL_INFINITE_RUN_CONTEXT } from "../src/game/infinitePlanBuilder.ts";
import type { InfiniteSessionState } from "../src/game/infiniteSession.ts";

const descriptorFor = (sector: number, wave = 1) => {
  const plan = buildCertifiedInfiniteSectorPlan(sector, `h4-${sector}`, NEUTRAL_INFINITE_RUN_CONTEXT);
  const session: InfiniteSessionState = {
    kind: "INFINITE_SESSION",
    sessionId: `h4:${sector}`,
    seed: `h4-${sector}`,
    status: "ACTIVE",
    currentSector: sector,
    currentWaveNumber: wave,
    sectorsCompleted: sector - 11,
    wavesCompleted: 0,
    context: { ...plan.effectiveRecipe.context },
    currentPlan: plan,
  };
  return createInfiniteRuntimeWaveDescriptor(session);
};

test("H4 leaves campaign-independent base descriptors immutable", () => {
  const base = descriptorFor(11);
  const projected = applyAdaptiveInvasionToDescriptor(base, 30);
  assert.notEqual(projected, base);
  assert.equal(base.descriptorId.includes(":h4:"), false);
});

test("larger veteran swarms trigger more runtime invasion pressure", () => {
  const base = descriptorFor(30, 2);
  const ten = applyAdaptiveInvasionToDescriptor(base, 10);
  const thirty = applyAdaptiveInvasionToDescriptor(base, 30);
  assert.ok(thirty.spawn.enemyBudget >= ten.spawn.enemyBudget);
  assert.ok(thirty.spawn.maxConcurrentEnemies >= ten.spawn.maxConcurrentEnemies);
  assert.ok(thirty.spawn.spawnIntervalFrames <= ten.spawn.spawnIntervalFrames);
});

test("runtime invasion keeps global entity and projectile ceilings absolute", () => {
  for (const sector of [11, 25, 50, 100, 500, 2500]) {
    const projected = applyAdaptiveInvasionToDescriptor(descriptorFor(sector, 3), 30);
    assert.ok(projected.spawn.maxConcurrentEnemies <= MAX_ENEMIES);
    assert.ok((projected.fairness?.projectileBudget ?? MAX_PROJECTILES) <= MAX_PROJECTILES);
    assert.ok((projected.fairness?.maxSimultaneousHardControlSources ?? 0) <= 2);
    assert.ok((projected.fairness?.minTelegraphMs ?? 0) >= 900);
  }
});

test("specialist enemies enter the composition progressively", () => {
  const early = applyAdaptiveInvasionToDescriptor(descriptorFor(11), 20);
  const late = applyAdaptiveInvasionToDescriptor(descriptorFor(60), 20);
  assert.ok(early.spawn.enemyComposition.some((enemy) => String(enemy) === "RIFT_HUNTER"));
  assert.ok(late.spawn.enemyComposition.some((enemy) => String(enemy) === "MIRROR_WARDEN"));
  assert.ok(late.spawn.enemyComposition.length >= early.spawn.enemyComposition.length);
});
