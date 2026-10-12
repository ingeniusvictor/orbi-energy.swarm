import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const effectsSource = fs.readFileSync(
  "src/game/combatOverdriveEffects.ts",
  "utf8",
);
const gameSource = fs.readFileSync("src/game/EnergySwarmGame.tsx", "utf8");

test("J2C-A combat expression delegates activation authority to the certified Overdrive projection", () => {
  assert.match(
    effectsSource,
    /import type \{ CombatOverdriveProjection \} from "\.\/combatOverdrive";/,
  );
  assert.match(
    effectsSource,
    /Pick<CombatOverdriveProjection, "active">/,
  );
  assert.match(
    effectsSource,
    /OVERDRIVE_PLAYER_DAMAGE_MULTIPLIER = 1\.2;/,
  );
  assert.match(
    effectsSource,
    /MAX_OVERDRIVE_PLAYER_DAMAGE_MULTIPLIER = 1\.25;/,
  );
  assert.match(
    effectsSource,
    /playerDamageMultiplier: overdrive\.active[\s\S]*OVERDRIVE_PLAYER_DAMAGE_MULTIPLIER[\s\S]*: 1,/,
  );
});

test("J2C-A owns no clock, renderer, audio, storage, randomness or entity scans", () => {
  for (const forbidden of [
    /OVERDRIVE_DURATION_MS/,
    /OVERDRIVE_REENTRY_LOCK_MS/,
    /endsAtMs/,
    /reentryAllowedAtMs/,
    /Date\./,
    /performance\./,
    /requestAnimationFrame/,
    /setTimeout/,
    /setInterval/,
    /Math\.random/,
    /from\s+["']react["']/,
    /import\s+React\b/,
    /\buse(?:State|Effect|Ref|Memo|Callback)\b/,
    /window\./,
    /document\./,
    /localStorage/,
    /AudioContext/,
    /enemiesRef/,
    /projectilesRef/,
    /swarmRef/,
    /particlesRef/,
  ]) {
    assert.doesNotMatch(effectsSource, forbidden);
  }
});

test("live adoption consumes the J2C-A projection helper without importing its tuning constants", () => {
  assert.match(
    gameSource,
    /import \{ projectCombatOverdriveEffects \} from "\.\/combatOverdriveEffects";/,
  );
  assert.match(gameSource, /projectCombatOverdriveEffects\(/);
  assert.doesNotMatch(
    gameSource,
    /\bOVERDRIVE_PLAYER_DAMAGE_MULTIPLIER\b/,
  );
  assert.doesNotMatch(
    gameSource,
    /\bMAX_OVERDRIVE_PLAYER_DAMAGE_MULTIPLIER\b/,
  );
});
