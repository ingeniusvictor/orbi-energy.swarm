import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const game = readFileSync(
  new URL(
    "../src/game/EnergySwarmGame.tsx",
    import.meta.url,
  ),
  "utf8",
);

test("game imports the bounded single-particle VFX helper", () => {
  assert.ok(
    game.includes(
      "pushParticleWithinBudget,",
    ),
  );
});

test("live VFX helper uses the current quality preset particle cap", () => {
  const start = game.indexOf(
    "const pushVfxParticle =",
  );
  const end = game.indexOf(
    "// Input Arbitration Refs",
    start,
  );
  assert.ok(start >= 0);
  assert.ok(end > start);

  const helper = game.slice(start, end);
  assert.ok(
    helper.includes(
      "pushParticleWithinBudget(",
    ),
  );
  assert.ok(
    helper.includes("particlesRef.current"),
  );
  assert.ok(
    helper.includes(
      "statsRef.current?.qualityPreset",
    ),
  );
  assert.ok(
    helper.includes("stats.qualityPreset"),
  );
  assert.ok(helper.includes(".maxParticles"));
});

test("no direct gameplay particle push remains outside the shared particle system", () => {
  const directPushes =
    game.split(
      "particlesRef.current.push(",
    ).length - 1;

  assert.equal(
    directPushes,
    0,
    "all gameplay cosmetic particle appends must use bounded paths",
  );
});

test("all six historical direct boss/cinematic VFX sites now use the bounded helper", () => {
  const boundedPushes =
    game.split("pushVfxParticle({").length - 1;

  assert.equal(boundedPushes, 6);
});

test("VFX budget adoption preserves historical baseline probabilities after cadence normalization", () => {
  const expectedBaselineProbabilities = [
    "projectFrameProbability(0.1, delta)",
    "projectFrameProbability(0.4, delta)",
    "projectFrameProbability(0.3, delta)",
    "projectFrameProbability(0.20, delta)",
  ];

  for (const fragment of expectedBaselineProbabilities) {
    assert.ok(
      game.includes(fragment),
      `missing historical baseline probability: ${fragment}`,
    );
  }
});

test("existing bounded triggerExplosion paths remain in use", () => {
  assert.ok(
    game.includes("triggerExplosion("),
  );
  assert.ok(
    game.includes(
      "getQualityConfig(stats.qualityPreset).maxParticles",
    ),
  );
});
