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

test("game imports the refresh-rate cadence contract", () => {
  for (const symbol of [
    "decayFrameTicks",
    "projectFrameDamping",
    "projectFrameProbability",
    "stepCadenceAccumulator",
  ]) {
    assert.ok(
      game.includes(symbol),
      `missing cadence symbol ${symbol}`,
    );
  }
});

test("React HUD sync is elapsed-time based instead of every ten rendered frames", () => {
  assert.ok(
    game.includes(
      "const reactUpdateAccumulatorMsRef = useRef(0);",
    ),
  );
  assert.ok(
    game.includes(
      "const hudCadence = stepCadenceAccumulator(",
    ),
  );
  assert.ok(
    game.includes(
      "reactUpdateAccumulatorMsRef.current =\n      hudCadence.nextAccumulatorMs;",
    ),
  );
  assert.ok(
    game.includes("if (hudCadence.shouldFlush)"),
  );
  assert.ok(
    game.includes(
      "reactUpdateAccumulatorMsRef.current = 0;",
    ),
  );

  assert.ok(
    !game.includes("reactUpdateTimerRef"),
  );
  assert.ok(
    !game.includes(
      "reactUpdateTimerRef.current += 1",
    ),
  );
});

test("all frame-counted flash decay paths are delta-aware", () => {
  const decayUses =
    game.split("decayFrameTicks(").length - 1;
  assert.equal(
    decayUses,
    5,
    "player cinematic, player invulnerability, shield nodes, swarm and enemies should share refresh-neutral decay",
  );

  assert.ok(!game.includes("flashTicks--;"));
  assert.ok(
    !game.includes(
      "playerFlashRef.current - 1",
    ),
  );
});

test("screen shake and swarm recoil damping are delta-normalized", () => {
  assert.ok(
    game.includes(
      "projectFrameDamping(0.9, delta)",
    ),
  );
  assert.ok(
    game.includes(
      "projectFrameDamping(0.82, delta)",
    ),
  );
  assert.ok(
    !game.includes(
      "screenShakeRef.current *= 0.9",
    ),
  );

  const dampingIndex = game.indexOf(
    "const recoilDamping =",
  );
  const swarmLoopIndex = game.indexOf(
    "swarmRef.current.forEach((member, idx)",
  );
  assert.ok(dampingIndex >= 0);
  assert.ok(
    dampingIndex < swarmLoopIndex,
    "recoil damping should be computed once before iterating swarm members",
  );
});

test("only audited per-frame cosmetic probabilities use delta-aware projection", () => {
  const projectedCount =
    game.split(
      "projectFrameProbability(",
    ).length - 1;
  assert.equal(projectedCount, 8);

  for (const probability of [
    "0.15",
    "0.1",
    "0.4",
    "0.3",
    "0.25",
    "0.20",
  ]) {
    assert.ok(
      game.includes(
        `projectFrameProbability(${probability}, delta)`,
      ),
      `missing projected cosmetic probability ${probability}`,
    );
  }
});

test("gameplay probability rolls remain raw and semantically unchanged", () => {
  assert.ok(
    game.includes(
      "Math.random() < effectiveEliteChance",
    ),
  );
  assert.ok(
    game.includes("Math.random() < 0.22"),
  );
  assert.ok(
    game.includes(
      "Math.random() < mitosisChance",
    ),
  );

  const eliteIndex = game.indexOf(
    "Math.random() < effectiveEliteChance",
  );
  const critIndex = game.indexOf(
    "Math.random() < 0.22",
  );
  const mitosisIndex = game.indexOf(
    "Math.random() < mitosisChance",
  );

  for (const index of [
    eliteIndex,
    critIndex,
    mitosisIndex,
  ]) {
    const around = game.slice(
      Math.max(0, index - 120),
      index + 180,
    );
    assert.ok(
      !around.includes(
        "projectFrameProbability",
      ),
    );
  }
});

test("large-delta safety clamp remains intact", () => {
  assert.ok(
    game.includes(
      "if (delta > 100) delta = 16.6;",
    ),
  );
});
