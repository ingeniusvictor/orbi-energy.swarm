import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const game = fs.readFileSync("src/game/EnergySwarmGame.tsx", "utf8");
const renderer = fs.readFileSync(
  "src/game/combatOverdrivePresentationRenderer.ts",
  "utf8",
);
const audio = fs.readFileSync("src/game/audio.ts", "utf8");
const resonanceCore = fs.readFileSync("src/game/combatResonance.ts", "utf8");
const overdriveCore = fs.readFileSync("src/game/combatOverdrive.ts", "utf8");
const effectsCore = fs.readFileSync("src/game/combatOverdriveEffects.ts", "utf8");
const presentationCore = fs.readFileSync(
  "src/game/combatOverdrivePresentation.ts",
  "utf8",
);

const sliceBetween = (source, start, end) => {
  const startIndex = source.indexOf(start);
  assert.notEqual(startIndex, -1, `Missing start marker: ${start}`);
  const endIndex = source.indexOf(end, startIndex + start.length);
  assert.notEqual(endIndex, -1, `Missing end marker: ${end}`);
  return source.slice(startIndex, endIndex);
};

const countCalls = (source, symbol) =>
  (source.match(new RegExp(`${symbol}\\(`, "g")) ?? []).length;

test("J2 live runtime consumes certified pure authorities without importing their tuning constants", () => {
  for (const symbol of [
    "projectCombatResonance",
    "activateCombatOverdrive",
    "advanceCombatOverdrive",
    "projectCombatOverdrive",
    "projectCombatOverdriveEffects",
    "projectCombatOverdrivePresentation",
  ]) {
    assert.match(game, new RegExp(`\\b${symbol}\\b`));
  }

  for (const forbiddenConstant of [
    "OVERDRIVE_DURATION_MS",
    "OVERDRIVE_REENTRY_LOCK_MS",
    "OVERDRIVE_PLAYER_DAMAGE_MULTIPLIER",
    "MAX_OVERDRIVE_PLAYER_DAMAGE_MULTIPLIER",
    "OVERDRIVE_ACTIVATION_PULSE_RATIO_WINDOW",
    "MAX_OVERDRIVE_PRESENTATION_RINGS",
  ]) {
    assert.doesNotMatch(game, new RegExp(`\\b${forbiddenConstant}\\b`));
  }
});

test("activation seam uses simulation time, consumes readiness once and owns no score/damage mutation", () => {
  const activation = sliceBetween(
    game,
    "const handleOverdriveActivation =",
    "// --- KEY LISTENER LISTENERS ---",
  );

  assert.match(activation, /const nowMs = timeElapsedRef\.current/);
  assert.match(activation, /resonanceProjection\.overdriveReady/);
  assert.match(activation, /activateCombatOverdrive\(/);
  assert.match(activation, /resolution\.consumeResonance/);
  assert.match(activation, /resonance:\s*0/);
  assert.equal(
    (activation.match(/playOverdriveActivationSound\(\);/g) ?? []).length,
    1,
  );
  assert.doesNotMatch(
    activation,
    /scoreRef\.current\s*[+*]=|damageMultiplier|fireRate|projectilesRef|Date\.now\(|performance\.now\(/,
  );
});

test("J2C bounded damage projection has one live runtime call and no score coupling", () => {
  assert.equal(countCalls(game, "projectCombatOverdriveEffects"), 1);
  assert.match(effectsCore, /playerDamageMultiplier/);
  assert.doesNotMatch(effectsCore, /score|nanoCredits|fireRate|projectileCount/i);
});

test("J2D presentation projection has one live runtime call and remains direct-draw only", () => {
  assert.equal(countCalls(game, "projectCombatOverdrivePresentation"), 1);
  assert.match(renderer, /drawCombatOverdriveFieldOverlay/);
  assert.match(renderer, /drawCombatOverdriveSwarmHalo/);
  assert.doesNotMatch(
    renderer,
    /particlesRef|enemiesRef|projectilesRef|swarmRef|requestAnimationFrame|setTimeout|setInterval|Date\.now|performance\.now/,
  );
  assert.doesNotMatch(
    presentationCore,
    /damageMultiplier|scoreMultiplier|fireRate|projectileCount/i,
  );
});

test("Overdrive stinger has exactly one gameplay invocation and remains mute-safe", () => {
  assert.equal((game.match(/playOverdriveActivationSound\(\);/g) ?? []).length, 1);
  assert.match(audio, /export const playOverdriveActivationSound/);
  const soundStart = audio.indexOf("export const playOverdriveActivationSound");
  const sound = audio.slice(soundStart);
  assert.match(sound, /const ctx = initAudio\(\)/);
  assert.match(sound, /if \(!ctx \|\| isMuted \|\| !soundEffectsEnabled\) return/);
  assert.match(sound, /beginTacticalPriority\(ctx, 0\.8\)/);
});

test("fresh-run source resets both J1 Resonance and J2 Overdrive", () => {
  const startGame = sliceBetween(game, "const startGame = () => {", "const rebootGame =");
  assert.match(startGame, /createCombatResonanceState\(\)/);
  assert.match(startGame, /combatResonanceRef\.current = resetResonanceState/);
  assert.match(startGame, /createCombatOverdriveState\(\)/);
  assert.match(startGame, /combatOverdriveRef\.current = resetOverdriveState/);
});

test("pause branch cannot advance simulation-time Overdrive authority", () => {
  const pausedBranch = sliceBetween(
    game,
    "if (isPausedRef.current || isUpgradeSelectionOpenRef.current) {",
    "let delta =",
  );
  assert.doesNotMatch(pausedBranch, /timeElapsedRef\.current\s*\+=/);
  assert.doesNotMatch(pausedBranch, /advanceCombatOverdrive\(/);
  assert.doesNotMatch(pausedBranch, /activateCombatOverdrive\(/);
});

test("pure J1/J2 modules own no browser clock, RAF, storage or entity-array authority", () => {
  for (const [name, source] of [
    ["resonance", resonanceCore],
    ["overdrive", overdriveCore],
    ["effects", effectsCore],
    ["presentation", presentationCore],
  ]) {
    assert.doesNotMatch(
      source,
      /Date\.now\(|performance\.now\(|requestAnimationFrame|setTimeout|setInterval|localStorage|sessionStorage|enemiesRef|projectilesRef|particlesRef|swarmRef/,
      `${name} core acquired forbidden runtime authority`,
    );
  }
});
