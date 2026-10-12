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

test("J2B adopts the certified J2A state helpers without duplicating timing", () => {
  for (const symbol of [
    "activateCombatOverdrive",
    "advanceCombatOverdrive",
    "createCombatOverdriveState",
    "projectCombatOverdrive",
  ]) {
    assert.match(gameSource, new RegExp(`\\b${symbol}\\b`));
  }
  assert.match(
    gameSource,
    /combatOverdriveRef\s*=\s*useRef\(createCombatOverdriveState\(\)\)/,
  );

  const activation = sliceBetween(
    gameSource,
    "const handleOverdriveActivation =",
    "// --- KEY LISTENER LISTENERS ---",
  );
  const cadence = sliceBetween(
    gameSource,
    "if (hudCadence.shouldFlush) {",
    "if (diagnosticsActive) {",
  );
  const liveAdoption = `${activation}\n${cadence}\n${hudSource}`;
  assert.doesNotMatch(
    liveAdoption,
    /OVERDRIVE_DURATION_MS|OVERDRIVE_REENTRY_LOCK_MS|\b8_?000\b|\b4_?000\b/,
  );
});

test("J2B activation is explicit, guarded, simulation-time based and consumes resonance once", () => {
  const activation = sliceBetween(
    gameSource,
    "const handleOverdriveActivation =",
    "// --- KEY LISTENER LISTENERS ---",
  );
  for (const guard of [
    /!isPlaying/,
    /isGameOver/,
    /isPausedRef\.current/,
    /isPhotoMode/,
    /isUpgradeSelectionOpenRef\.current/,
  ]) {
    assert.match(activation, guard);
  }
  assert.match(activation, /const nowMs = timeElapsedRef\.current/);
  assert.match(activation, /resonanceProjection\.overdriveReady/);
  assert.match(activation, /preActivationProjection\.canActivate/);
  assert.match(activation, /activateCombatOverdrive\(/);
  assert.match(activation, /resolution\.consumeResonance/);
  assert.match(
    activation,
    /\.\.\.combatResonanceRef\.current,\s*resonance:\s*0/s,
  );
  assert.doesNotMatch(
    activation,
    /chain:\s*0|bestChain:\s*0|affinityTrail:\s*\[\]/,
  );
  // J2D-B authorizes exactly one presentation-only activation stinger after
  // successful explicit activation. Preserve every original J2B prohibition
  // for the remainder of the handler.
  assert.equal(
    (activation.match(/playOverdriveActivationSound\(\);/g) ?? []).length,
    1,
  );
  const activationWithoutJ2dbStinger = activation.replace(
    "playOverdriveActivationSound();",
    "",
  );
  assert.doesNotMatch(
    activationWithoutJ2dbStinger,
    /startBgm|playEnemy|play.*Sound|projectilesRef|damageMultiplier|fireRate|scoreRef\.current\s*[+*]=/i,
  );
});

test("J2B exposes only explicit O/HUD activation and low-frequency simulation-time projection", () => {
  assert.match(
    gameSource,
    /if \(key === "O"\) \{[\s\S]*?handleOverdriveActivation\(\);[\s\S]*?return;/,
  );
  assert.match(gameSource, /onActivateOverdrive=\{handleOverdriveActivation\}/);

  const cadence = sliceBetween(
    gameSource,
    "if (hudCadence.shouldFlush) {",
    "if (diagnosticsActive) {",
  );
  assert.match(
    cadence,
    /advanceCombatOverdrive\([\s\S]*?timeElapsedRef\.current/,
  );
  assert.match(
    cadence,
    /projectCombatOverdrive\([\s\S]*?timeElapsedRef\.current/,
  );
  assert.match(cadence, /setCombatOverdriveView\(liveOverdriveProjection\)/);
});

test("J2B resets Overdrive with a fresh run", () => {
  const startGame = sliceBetween(
    gameSource,
    "const startGame = () => {",
    "const rebootGame =",
  );
  assert.match(
    startGame,
    /const resetOverdriveState = createCombatOverdriveState\(\)/,
  );
  assert.match(startGame, /combatOverdriveRef\.current = resetOverdriveState/);
  assert.match(startGame, /setCombatOverdriveView\(/);
});

test("J2B HUD exposes READY, ACTIVE and RECHARGING with a disabled guarded action", () => {
  for (const prop of [
    "combatOverdriveActive",
    "combatOverdriveCanActivate",
    "combatOverdriveActionEnabled",
    "combatOverdriveRemainingMs",
    "combatOverdriveReentryLocked",
    "combatOverdriveReentryRemainingMs",
    "onActivateOverdrive",
  ]) {
    assert.match(hudSource, new RegExp(`\\b${prop}\\b`));
  }
  assert.match(hudSource, /ACTIVE/);
  assert.match(hudSource, /RECHARGING/);
  assert.match(hudSource, /READY/);
  assert.match(hudSource, /disabled=\{!combatOverdriveActionEnabled\}/);
  assert.match(hudSource, /aria-label=\{overdriveAriaLabel\}/);
});
