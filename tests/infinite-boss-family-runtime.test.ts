import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const game = readFileSync(
  new URL("../src/game/EnergySwarmGame.tsx", import.meta.url),
  "utf8",
);

test("Infinite boss family is adopted without changing the campaign spawn path", () => {
  assert.match(game, /getInfiniteBossFamilyProfile/);
  assert.match(game, /infiniteBossIdentity: rematchProfile\?\.bossIdentity/);
  assert.match(game, /descriptor\.completionPolicy\.type === "BOSS_DEFEAT"[\s\S]*spawnBoss\(\)/);
});

test("family specialist support stays behind existing MAX_ENEMIES and shared summon timers", () => {
  assert.match(game, /bossSummonTimersRef\.current\[timerKey\]/);
  assert.match(game, /activeSupport < family\.supportMaxCount/);
  assert.match(game, /enemiesRef\.current\.length < MAX_ENEMIES/);
  assert.match(game, /spawnBossMinion\([\s\S]*family\.supportEnemyType/);
});

test("Infinite boss identity weights the shared attack selector rather than replacing telegraph timing", () => {
  assert.match(game, /getInfiniteBossAttackWeight\([\s\S]*boss\.infiniteBossIdentity/);
  assert.match(game, /bossAttackTelegraphRef\.current = chosen\.telegraphDuration/);
  assert.doesNotMatch(game, /bossAttackTelegraphRef\.current = chosen\.telegraphDuration \*/);
});

test("Infinite milestone presentation no longer hardcodes Devourer for every rematch", () => {
  const transitionStart = game.indexOf("const handleWaveTransitions");
  const transitionEnd = game.indexOf("// --- SPAWN REGULAR ENEMY ---", transitionStart);
  const transitions = game.slice(transitionStart, transitionEnd);
  assert.doesNotMatch(transitions, /BOSS REMATCH INBOUND \/\/ BLACKOUT DEVOURER/);
  assert.doesNotMatch(transitions, /DEVOURER REMATCH INBOUND/);
  assert.match(transitions, /familyProfile\.displayName/);
});
