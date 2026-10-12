import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const game = fs.readFileSync("src/game/EnergySwarmGame.tsx", "utf8");
const audio = fs.readFileSync("src/game/audio.ts", "utf8");
const renderer = fs.readFileSync("src/game/combatOverdrivePresentationRenderer.ts", "utf8");

const sliceBetween = (source, start, end) => {
  const startIndex = source.indexOf(start);
  assert.notEqual(startIndex, -1, `Missing start marker: ${start}`);
  const endIndex = source.indexOf(end, startIndex + start.length);
  assert.notEqual(endIndex, -1, `Missing end marker: ${end}`);
  return source.slice(startIndex, endIndex);
};

test("J2D-B runtime consumes the certified presentation projection without tuning imports", () => {
  assert.match(game, /projectCombatOverdrivePresentation/);
  assert.match(game, /drawCombatOverdriveFieldOverlay/);
  assert.match(game, /drawCombatOverdriveSwarmHalo/);
  assert.doesNotMatch(game, /OVERDRIVE_ACTIVATION_PULSE_RATIO_WINDOW/);
  assert.doesNotMatch(game, /MAX_OVERDRIVE_PRESENTATION_RINGS/);
});

test("live presentation derives from authoritative Overdrive state and simulation time", () => {
  const renderSlice = sliceBetween(
    game,
    "const renderCanvasScene =",
    "// --- TOUCH AND COORDINATE POINTER MAPS ---",
  );
  assert.match(renderSlice, /projectCombatOverdrive\(\s*combatOverdriveRef\.current,\s*timeElapsedRef\.current,/s);
  assert.match(renderSlice, /remainingRatio:\s*liveOverdriveRenderProjection\.remainingRatio/);
  assert.match(renderSlice, /qualityPreset:\s*statsRef\.current\?\.qualityPreset \?\? stats\.qualityPreset/);
  assert.doesNotMatch(renderSlice, /Date\.now\(|setTimeout\(|setInterval\(/);
});

test("presentation renderer is direct bounded Canvas2D with no entity or particle APIs", () => {
  assert.match(renderer, /projection\.ringCount/);
  assert.match(renderer, /fillRect\(/);
  assert.match(renderer, /ctx\.arc\(/);
  assert.doesNotMatch(
    renderer,
    /particlesRef|triggerExplosion|pushParticleWithinBudget|enemiesRef|projectilesRef|swarmRef|requestAnimationFrame|setTimeout|setInterval|Date\.now|performance\.now/,
  );
});

test("Overdrive stinger is called only after a successful explicit activation", () => {
  const handler = sliceBetween(
    game,
    "const handleOverdriveActivation =",
    "// --- KEY LISTENER LISTENERS ---",
  );
  const successGuard = handler.indexOf("if (!resolution.activated || !resolution.consumeResonance)");
  const stinger = handler.indexOf("playOverdriveActivationSound();");
  assert.ok(successGuard >= 0);
  assert.ok(stinger > successGuard);
  assert.equal((game.match(/playOverdriveActivationSound\(\);/g) ?? []).length, 1);
});

test("Overdrive audio is mute-safe and has no activation call outside the explicit handler", () => {
  const soundStart = audio.indexOf("export const playOverdriveActivationSound");
  assert.notEqual(soundStart, -1);
  const sound = audio.slice(soundStart);
  assert.match(sound, /const ctx = initAudio\(\)/);
  assert.match(sound, /if \(!ctx \|\| isMuted\) return/);
  assert.match(sound, /beginTacticalPriority\(ctx, 0\.8\)/);

  const handler = sliceBetween(
    game,
    "const handleOverdriveActivation =",
    "// --- KEY LISTENER LISTENERS ---",
  );
  const gameWithoutActivationHandler = game.replace(handler, "");
  assert.doesNotMatch(
    gameWithoutActivationHandler,
    /playOverdriveActivationSound\(\);/,
  );
});
