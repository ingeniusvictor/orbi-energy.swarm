import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const game = readFileSync(
  new URL("../src/game/EnergySwarmGame.tsx", import.meta.url),
  "utf8",
);

const section = (
  startMarker: string,
  endMarker: string,
) => {
  const start = game.indexOf(startMarker);
  const end = game.indexOf(
    endMarker,
    start + startMarker.length,
  );
  assert.ok(start >= 0, `Missing start: ${startMarker}`);
  assert.ok(end > start, `Missing end: ${endMarker}`);
  return game.slice(start, end);
};

test("live runtime derives a clamped frame scale from delta", () => {
  assert.ok(
    game.includes(
      "const frameScale = getFrameScale(delta);",
    ),
  );
});

test("player acceleration and damping are delta-normalized", () => {
  const physics = section(
    "const updateEnginePhysics =",
    "// --- COLLECT RESOURCES SCRIPT ---",
  );

  assert.match(
    physics,
    /playerVelocityRef\.current\.x \+= moveX \* acceleration \* frameScale/,
  );
  assert.match(
    physics,
    /playerVelocityRef\.current\.y \+= moveY \* acceleration \* frameScale/,
  );
  assert.match(
    physics,
    /getFrameDamping\(0\.92, delta\)/,
  );
});

test("projectiles and particles consume frameScale instead of raw frame steps", () => {
  const physics = section(
    "const updateEnginePhysics =",
    "// --- COLLECT RESOURCES SCRIPT ---",
  );

  assert.match(
    physics,
    /proj\.x \+= proj\.vx \* frameScale/,
  );
  assert.match(
    physics,
    /proj\.y \+= proj\.vy \* frameScale/,
  );
  assert.match(
    physics,
    /p\.x \+= p\.vx \* frameScale/,
  );
  assert.match(
    physics,
    /p\.y \+= p\.vy \* frameScale/,
  );
});

test("swarm cooldown and interpolation remain delta-aware", () => {
  const physics = section(
    "const updateEnginePhysics =",
    "// --- COLLECT RESOURCES SCRIPT ---",
  );

  assert.match(
    physics,
    /member\.shootCooldown -= frameScale/,
  );
  assert.match(
    physics,
    /getFrameLerpAlpha\(/,
  );
});

test("all frame-counted flash decay paths are delta-aware", () => {
  assert.match(
    game,
    /enemy\.flashTicks = Math\.max\(0, enemy\.flashTicks - frameScale\)/,
  );
  assert.match(
    game,
    /member\.flashTicks = Math\.max\(0, member\.flashTicks - frameScale\)/,
  );
});

test("screen shake and swarm recoil damping are delta-normalized", () => {
  assert.match(
    game,
    /getFrameDamping\(0\.9, delta\)/,
  );
  assert.match(
    game,
    /getFrameDamping\(0\.65, delta\)/,
  );
});

test("only audited per-frame cosmetic probabilities use delta-aware projection", () => {
  for (const probability of [
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
    game.includes(
      "Math.random() < profile.criticalChance",
    ),
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
    "Math.random() < profile.criticalChance",
  );
  const mitosisIndex = game.indexOf(
    "Math.random() < mitosisChance",
  );

  for (const index of [
    eliteIndex,
    critIndex,
    mitosisIndex,
  ]) {
    assert.ok(index >= 0);
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
