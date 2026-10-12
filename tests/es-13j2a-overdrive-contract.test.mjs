import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const source = fs.readFileSync("src/game/combatOverdrive.ts", "utf8");
const liveGame = fs.readFileSync("src/game/EnergySwarmGame.tsx", "utf8");

test("J2A Overdrive core stays pure and platform-independent", () => {
  for (const forbidden of [
    /from ["']react["']/i,
    /window\./,
    /document\./,
    /localStorage/,
    /sessionStorage/,
    /requestAnimationFrame/,
    /performance\./,
    /Date\./,
    /Date\(/,
    /Math\.random/,
    /AudioContext/,
    /setTimeout/,
    /setInterval/,
  ]) {
    assert.doesNotMatch(source, forbidden);
  }
});

test("J2A owns only bounded state timing and never combat/entity budgets", () => {
  assert.match(source, /OVERDRIVE_DURATION_MS\s*=\s*8_000/);
  assert.match(source, /OVERDRIVE_REENTRY_LOCK_MS\s*=\s*4_000/);
  assert.doesNotMatch(source, /MAX_ENEMIES|MAX_PROJECTILES|enemiesRef|projectilesRef|swarmRef/);
  assert.doesNotMatch(source, /damage|fireRate|projectileSpeed|spawn/i);
});

test("J2A exposes a one-shot readiness-consumption contract without mutating J1A", () => {
  assert.match(source, /overdriveReady:\s*boolean/);
  assert.match(source, /consumeResonance:\s*boolean/);
  assert.match(source, /consumeResonance:\s*true/);
  assert.match(source, /consumeResonance:\s*false/);
  assert.doesNotMatch(source, /combatResonance|MAX_RESONANCE|resonance\s*=/);
});

test("J2B adopts J2A through the certified pure helpers without duplicating timing constants", () => {
  for (const symbol of [
    "activateCombatOverdrive",
    "advanceCombatOverdrive",
    "createCombatOverdriveState",
    "projectCombatOverdrive",
  ]) {
    assert.match(liveGame, new RegExp(`\\b${symbol}\\b`));
  }
  assert.match(liveGame, /from\s+["']\.\/combatOverdrive["']/);
  assert.doesNotMatch(
    liveGame,
    /\bOVERDRIVE_DURATION_MS\b|\bOVERDRIVE_REENTRY_LOCK_MS\b/,
  );
});
