import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const gameSource = fs.readFileSync("src/game/EnergySwarmGame.tsx", "utf8");
const hudSource = fs.readFileSync("src/components/GameHud.tsx", "utf8");
const resonanceSource = fs.readFileSync("src/game/combatResonance.ts", "utf8");

const sliceBetween = (source, start, end) => {
  const startIndex = source.indexOf(start);
  assert.notEqual(startIndex, -1, `Missing start marker: ${start}`);
  const endIndex = source.indexOf(end, startIndex + start.length);
  assert.notEqual(endIndex, -1, `Missing end marker: ${end}`);
  return source.slice(startIndex, endIndex);
};

const sliceFrom = (source, start, length) => {
  const startIndex = source.indexOf(start);
  assert.notEqual(startIndex, -1, `Missing start marker: ${start}`);
  return source.slice(startIndex, startIndex + length);
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
  const damagePlayer = sliceFrom(
    gameSource,
    "const damagePlayer = (dmg: number) =>",
    3200,
  );
  const invincibilityGuard = damagePlayer.indexOf("if (invincibilityTimerRef.current > 0) return;");
  const breakIndex = damagePlayer.indexOf("applyCombatResonanceDamageBreak(");
  const shieldWrite = damagePlayer.indexOf("shieldRef.current = Math.max");

  assert.ok(invincibilityGuard >= 0, "missing invincibility guard");
  assert.ok(breakIndex > invincibilityGuard, "damage break must follow accepted-hit guard");
  assert.ok(shieldWrite > breakIndex, "damage break must occur before shield mutation");
});

test("chain expiry stays simulation-time based and resonance projection is limited to authorized publication paths", () => {
  const cadence = sliceBetween(
    gameSource,
    "if (hudCadence.shouldFlush) {",
    "if (diagnosticsActive) {",
  );
  const startGame = sliceBetween(
    gameSource,
    "const startGame =",
    "// --- REBOOT GAME ON LOSS ---",
  );
  const overdriveActivation = sliceBetween(
    gameSource,
    "const handleOverdriveActivation =",
    "// --- KEY LISTENER LISTENERS ---",
  );

  assert.match(cadence, /expireCombatChain\([\s\S]*timeElapsedRef\.current/);
  assert.match(cadence, /projectCombatResonance\(/);

  const cadenceWrites = (cadence.match(/setCombatResonanceView\(/g) ?? []).length;
  const resetWrites = (startGame.match(/setCombatResonanceView\(/g) ?? []).length;
  const activationWrites = (overdriveActivation.match(/setCombatResonanceView\(/g) ?? []).length;
  const globalWrites = (gameSource.match(/setCombatResonanceView\(/g) ?? []).length;

  assert.equal(cadenceWrites, 1, "HUD cadence owns one periodic resonance projection");
  assert.equal(resetWrites, 1, "fresh run owns one reset projection");
  assert.equal(activationWrites, 1, "accepted explicit Overdrive activation owns one immediate consumption projection");
  assert.equal(
    globalWrites,
    cadenceWrites + resetWrites + activationWrites,
    "no additional per-frame or hidden resonance React publications are allowed",
  );
});

test("new runs reset resonance and the live ref owns high-frequency state", () => {
  assert.match(gameSource, /combatResonanceRef\s*=\s*useRef\(createCombatResonanceState\(\)\)/);
  const startGame = sliceBetween(
    gameSource,
    "const startGame =",
    "// --- REBOOT GAME ON LOSS ---",
  );
  assert.match(startGame, /const resetResonanceState\s*=\s*createCombatResonanceState\(\);/);
  assert.match(startGame, /combatResonanceRef\.current\s*=\s*resetResonanceState;/);
  assert.match(startGame, /setCombatResonanceView\(\{[\s\S]*projectCombatResonance\(resetResonanceState\)/);
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

test("J1B resonance remains readiness-only while J2B delegates activation to the certified Overdrive core", () => {
  assert.match(resonanceSource, /overdriveReady:\s*boolean/);
  assert.match(resonanceSource, /overdriveReady:\s*state\.resonance\s*>=\s*MAX_RESONANCE/);
  assert.doesNotMatch(
    resonanceSource,
    /activateCombatOverdrive|OVERDRIVE_DURATION_MS|OVERDRIVE_REENTRY_LOCK_MS|setTimeout|requestAnimationFrame/,
  );
  assert.match(gameSource, /activateCombatOverdrive\(/);
  assert.match(hudSource, /onActivateOverdrive/);
});
