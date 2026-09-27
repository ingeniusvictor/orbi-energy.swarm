import assert from "node:assert/strict";
import test from "node:test";

import type { RuntimeCombatPressureProjection } from "../src/game/runtimeCombatPressure.ts";
import {
  createElectricalStormRuntimeState,
  getElectricalStormConfig,
  stepElectricalStormRuntime,
} from "../src/game/runtimeElectricalStorm.ts";
import type { RuntimeMutatorEffectProfile } from "../src/game/runtimeMutatorEffects.ts";

const pressure: RuntimeCombatPressureProjection = {
  sourceMode: "INFINITE",
  enemyHealthMultiplier: 1,
  enemyMovementSpeedMultiplier: 1,
  contactDamageMultiplier: 1,
  enemyAttackRateMultiplier: 1,
  resourceValueMultiplier: 1,
  projectileBudget: 100,
  spawnSafetyRadius: 150,
  hazardIntensity: 0.6,
  minTelegraphMs: 1400,
};

const effects: RuntimeMutatorEffectProfile = {
  sourceMode: "INFINITE",
  activeMutators: ["ELECTRICAL_STORM"],
  enemySpeedMultiplier: 1,
  enemyRegenFractionPerSecond: 0,
  incomingDamageMultiplier: 1,
  formationCohesionMultiplier: 1,
  eliteChanceBonus: 0,
  enemyBudgetMultiplier: 1,
  electricalStormIntensity: 1,
  visibilityScale: 1,
  magneticDriftStrength: 0,
  resourceFieldInstability: 0,
};

test("storm config is absent for neutral effects", () => {
  assert.equal(
    getElectricalStormConfig(
      {
        ...effects,
        electricalStormIntensity: 0,
      },
      pressure,
    ),
    null,
  );
});

test("storm config honors fairness telegraph floor and bounded damage cadence", () => {
  const config =
    getElectricalStormConfig(effects, pressure);

  assert.ok(config);
  assert.ok(config.telegraphMs >= 1400);
  assert.ok(config.telegraphMs >= 1200);
  assert.ok(config.intervalMs >= 4800);
  assert.ok(config.intervalMs <= 7000);
  assert.ok(config.strikeRadius >= 78);
  assert.ok(config.strikeRadius <= 92);
  assert.ok(config.baseDamage >= 7);
  assert.ok(config.baseDamage <= 12);
});

test("storm begins with grace cooldown instead of instant telegraph or damage", () => {
  const config =
    getElectricalStormConfig(effects, pressure)!;
  const step = stepElectricalStormRuntime(
    createElectricalStormRuntimeState(),
    99999,
    config,
    { x: 100, y: 200 },
  );

  assert.equal(step.state.phase, "COOLDOWN");
  assert.equal(
    step.state.remainingMs,
    config.initialDelayMs,
  );
  assert.equal(step.telegraphStarted, false);
  assert.equal(step.strikeTriggered, false);
});

test("telegraph locks target before impact", () => {
  const config =
    getElectricalStormConfig(effects, pressure)!;
  const cooldown = {
    phase: "COOLDOWN" as const,
    remainingMs: 1,
    targetX: null,
    targetY: null,
    strikeSerial: 0,
  };

  const telegraph = stepElectricalStormRuntime(
    cooldown,
    2,
    config,
    { x: 120, y: 240 },
  );

  assert.equal(telegraph.telegraphStarted, true);
  assert.equal(telegraph.state.phase, "TELEGRAPH");
  assert.equal(telegraph.state.targetX, 120);
  assert.equal(telegraph.state.targetY, 240);

  const strike = stepElectricalStormRuntime(
    {
      ...telegraph.state,
      remainingMs: 1,
    },
    2,
    config,
    { x: 700, y: 700 },
  );

  assert.equal(strike.strikeTriggered, true);
  assert.deepEqual(
    strike.strikeTarget,
    { x: 120, y: 240 },
  );
});

test("strike returns to cooldown and increments serial once", () => {
  const config =
    getElectricalStormConfig(effects, pressure)!;
  const strike = stepElectricalStormRuntime(
    {
      phase: "TELEGRAPH",
      remainingMs: 1,
      targetX: 10,
      targetY: 20,
      strikeSerial: 4,
    },
    1000,
    config,
    { x: 30, y: 40 },
  );

  assert.equal(strike.strikeTriggered, true);
  assert.equal(strike.state.phase, "COOLDOWN");
  assert.equal(
    strike.state.remainingMs,
    config.intervalMs,
  );
  assert.equal(strike.state.strikeSerial, 5);
});

test("removing storm config resets scheduler immediately", () => {
  const step = stepElectricalStormRuntime(
    {
      phase: "TELEGRAPH",
      remainingMs: 500,
      targetX: 10,
      targetY: 20,
      strikeSerial: 2,
    },
    16,
    null,
    { x: 10, y: 20 },
  );

  assert.deepEqual(
    step.state,
    createElectricalStormRuntimeState(),
  );
  assert.equal(step.strikeTriggered, false);
  assert.equal(step.telegraphStarted, false);
});
