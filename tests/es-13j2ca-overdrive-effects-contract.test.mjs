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
    /React/,
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

test("J2C-A does not adopt the combat expression into live runtime yet", () => {
  assert.doesNotMatch(gameSource, /combatOverdriveEffects/);
  assert.doesNotMatch(gameSource, /OVERDRIVE_PLAYER_DAMAGE_MULTIPLIER/);
  assert.doesNotMatch(gameSource, /projectCombatOverdriveEffects/);
});
