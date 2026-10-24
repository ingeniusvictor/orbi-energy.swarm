import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../src/game/EnergySwarmGame.tsx", import.meta.url), "utf8");
const audio = await readFile(new URL("../src/game/audio.ts", import.meta.url), "utf8");

test("I5 follower cooldown uses initialized frame mutator projection", () => {
  const frameDeclaration = source.indexOf("const frameMutatorEffects =");
  const followerUse = source.search(/getEclipseSolarCooldownRecoveryMultiplier\(\s*frameMutatorEffects,\s*member\.affinity,/);
  const simulationDeclaration = source.indexOf("const simulationMutatorEffects =");
  assert.ok(frameDeclaration >= 0);
  assert.ok(followerUse > frameDeclaration);
  assert.ok(simulationDeclaration > followerUse);
  assert.doesNotMatch(source, /getEclipseSolarCooldownRecoveryMultiplier\(\s*simulationMutatorEffects,\s*member\.affinity,/);
});

test("I5 persisted unmuted profile does not autoplay BGM on mount", () => {
  assert.doesNotMatch(source, /setAudioMuted\(loaded\.audioMuted\);\s*setMuteState\(loaded\.audioMuted\);/);
  assert.match(source, /setAudioMuted\(loaded\.audioMuted\);[\s\S]*?setMusicEnabled\(loaded\.musicEnabled !== false\);[\s\S]*?setMuteState\(loaded\.audioMuted\);/);

  assert.doesNotMatch(audio.slice(audio.indexOf("export const setMuteState"),audio.indexOf("export const getMuteState")),/startBgm\(/);
});

test("I5 suspended loop materializes one frozen frame without advancing simulation", () => {
  assert.match(source, /const suspendedFrameRenderedRef = useRef\(false\);/);
  const pausedStart = source.indexOf("if (isPausedRef.current || isUpgradeSelectionOpenRef.current)");
  const activeStart = source.indexOf("suspendedFrameRenderedRef.current = false;", pausedStart);
  assert.ok(pausedStart >= 0 && activeStart > pausedStart);
  const pausedBlock = source.slice(pausedStart, activeStart);
  assert.match(pausedBlock, /!suspendedFrameRenderedRef\.current && canvasRef\.current/);
  assert.match(pausedBlock, /renderCanvasScene\(\);/);
  assert.match(pausedBlock, /suspendedFrameRenderedRef\.current = true;/);
  assert.doesNotMatch(pausedBlock, /updateEnginePhysics\(/);
  assert.doesNotMatch(pausedBlock, /timeElapsedRef\.current \+=/);
});
