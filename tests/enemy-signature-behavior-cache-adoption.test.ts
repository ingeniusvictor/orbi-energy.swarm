import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const game = readFileSync(
  new URL("../src/game/EnergySwarmGame.tsx", import.meta.url),
  "utf8",
);

test("live runtime imports cache helpers instead of direct projector", () => {
  assert.match(game, /createEnemySignatureBehaviorCache/);
  assert.match(game, /getCachedEvolvedSignatureBehavior/);
  assert.doesNotMatch(
    game,
    /from "\.\/runtimeEnemySignatureBehavior"/,
  );
});

test("runtime owns one cache ref and refreshes it for a new run", () => {
  assert.match(
    game,
    /const enemySignatureBehaviorCacheRef =[\s\S]*useRef<EnemySignatureBehaviorCache>[\s\S]*createEnemySignatureBehaviorCache\(\)/,
  );

  const start = game.indexOf("const startGame =");
  const reboot = game.indexOf(
    "// --- REBOOT GAME ON LOSS ---",
    start,
  );
  assert.ok(start >= 0 && reboot > start);
  const startGame = game.slice(start, reboot);

  assert.match(
    startGame,
    /enemySignatureBehaviorCacheRef\.current =[\s\S]*createEnemySignatureBehaviorCache\(\)/,
  );
});

test("all live evolved behavior access is cache-backed", () => {
  const cacheCalls =
    game.match(/getCachedEvolvedSignatureBehavior\(/g) ?? [];

  assert.ok(cacheCalls.length >= 4);
  assert.doesNotMatch(
    game,
    /projectEvolvedSignatureBehavior\(/,
  );
});

test("cache-backed behavior remains present in AI, firing, pushback and split paths", () => {
  assert.ok(game.includes("enemiesRef.current.forEach((enemy)"));
  assert.ok(game.includes("const shootFromEnemy ="));
  assert.ok(game.includes("projectilePushbackMultiplier"));
  assert.ok(game.includes("const spawnSplitterMinions ="));
  assert.match(
    game,
    /const signatureBehavior =[\s\S]{0,220}getCachedEvolvedSignatureBehavior\(/,
  );
});

test("cache optimization does not mutate evolved spawn metadata", () => {
  assert.doesNotMatch(
    game,
    /evolvedSignature\s*=|evolvedSpecialIntensity\s*=/,
  );
});
