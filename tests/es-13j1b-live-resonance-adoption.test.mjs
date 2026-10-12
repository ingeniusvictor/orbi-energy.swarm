import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const gameSource = fs.readFileSync("src/game/EnergySwarmGame.tsx", "utf8");
const hudSource = fs.readFileSync("src/components/GameHud.tsx", "utf8");

const sliceBetween = (source, start, end) => {
  const startIndex = source.indexOf(start);
  assert.notEqual(startIndex, -1, `Missing start marker: ${start}`);
  const endIndex = source.indexOf(end, startIndex + start.length);
  assert.notEqual(endIndex, -1, `Missing end marker: ${end}`);
  return source.slice(startIndex, endIndex);
};

test("J1B imports and uses the J1A core rather than duplicating resonance arithmetic", () => {
  for (const symbol of [
    "applyCombatResonanceDamageBreak",
    "createCombatResonanceState",
    "expireCombatChain",
    "projectCombatResonance",
    "registerCombatResonanceDefeat",
  ]) {
    assert.match(gameSource, new RegExp(`\\b${symbol}\\b`));
  }

  assert.doesNotMatch(gameSource, /COMBAT_CHAIN_WINDOW_MS\s*=\s*2200/);
  assert.doesNotMatch(gameSource, /DAMAGE_BREAK_RESONANCE_PENALTY\s*=\s*35/);
});

test("both live player defeat paths route score through registerCombatDefeat with projectile affinity", () => {
  assert.match(gameSource, /registerCombatDefeat\(otherEnemy, proj\.affinity\);/);
  assert.match(gameSource, /registerCombatDefeat\(enemy, proj\.affinity\);/);
  assert.doesNotMatch(gameSource, /scoreRef\.current\s*\+=\s*scoreReward/);

  const helper = sliceBetween(
    gameSource,
    "const registerCombatDefeat =",
    "// --- DETECT SINGLE-IMPACT COLLISION SWEEPS ---",
  );
  assert.match(helper, /registerCombatResonanceDefeat\(/);
  assert.match(helper, /occurredAtMs:\s*timeElapsedRef\.current/);
  assert.match(helper, /baseScore:\s*getEnemyScoreReward\(enemy\)/);
  assert.match(helper, /affinity,/);
  assert.match(helper, /isBoss:\s*enemy\.isBoss/);
  assert.match(helper, /scoreRef\.current\s*\+=\s*resolution\.awardedScore/);
});

test("accepted player damage breaks resonance only after the invincibility guard", () => {
  const damagePlayer = sliceBetween(
    gameSource,
    "const damagePlayer = (dmg: number) =>",
    "// --- ENTITY UPDATE PHYSICS ---",
  );
  const invincibilityGuard = damagePlayer.indexOf("if (invincibilityTimerRef.current > 0) return;");
  const breakIndex = damagePlayer.indexOf("applyCombatResonanceDamageBreak(");
  const shieldWrite = damagePlayer.indexOf("shieldRef.current = Math.max");

  assert.ok(invincibilityGuard >= 0);
  assert.ok(breakIndex > invincibilityGuard);
  assert.ok(shieldWrite > breakIndex);
});

test("chain expiry is simulation-time based and flushed only on the existing HUD cadence", () => {
  const cadence = sliceBetween(
    gameSource,
    "if (hudCadence.shouldFlush) {",
    "if (diagnosticsActive) {",
  );
  assert.match(cadence, /expireCombatChain\([\s\S]*timeElapsedRef\.current/);
  assert.match(cadence, /projectCombatResonance\(/);
  assert.match(cadence, /setCombatResonanceView\(/);
  assert.equal((gameSource.match(/setCombatResonanceView\(/g) ?? []).length, 2);
});

test("new runs reset resonance and the live ref owns high-frequency state", () => {
  assert.match(gameSource, /combatResonanceRef\s*=\s*useRef\(createCombatResonanceState\(\)\)/);
  const startGame = sliceBetween(gameSource, "const startGame =", "const resetGame =");
  assert.match(startGame, /combatResonanceRef\.current\s*=\s*createCombatResonanceState\(\)/);
  assert.match(startGame, /setCombatResonanceView\(/);
});

test("GameHud receives a compact low-frequency resonance projection", () => {
  for (const prop of [
    "combatChain={combatResonanceView.chain}",
    "combatResonance={combatResonanceView.resonance}",
    "combatResonanceTier={combatResonanceView.tier}",
    "combatScoreMultiplier={combatResonanceView.scoreMultiplier}",
  ]) {
    assert.ok(gameSource.includes(prop), `Missing GameHud prop: ${prop}`);
  }

  assert.match(hudSource, /combatResonanceTier:\s*ResonanceTier/);
  assert.match(hudSource, /aria-label=\{resonanceAriaLabel\}/);
  assert.match(hudSource, /combatScoreMultiplier\.toFixed\(2\)/);
  assert.match(hudSource, /OVERDRIVE_READY/);
});

test("J1B does not activate Overdrive yet", () => {
  assert.doesNotMatch(gameSource, /activateOverdrive|startOverdrive|overdriveTimerRef/i);
  assert.doesNotMatch(hudSource, /onActivateOverdrive|activateOverdrive/i);
});
