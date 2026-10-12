const fs = require("node:fs");

const gamePath = "src/game/EnergySwarmGame.tsx";
const audioPath = "src/game/audio.ts";
const rendererPath = "src/game/combatOverdrivePresentationRenderer.ts";
const testPath = "tests/es-13j2db-live-overdrive-presentation-adoption.test.mjs";

const replaceOnce = (source, before, after, label) => {
  const first = source.indexOf(before);
  if (first < 0) throw new Error(`Missing patch target: ${label}`);
  if (source.indexOf(before, first + before.length) >= 0) {
    throw new Error(`Ambiguous patch target: ${label}`);
  }
  return source.slice(0, first) + after + source.slice(first + before.length);
};

let game = fs.readFileSync(gamePath, "utf8");
let audio = fs.readFileSync(audioPath, "utf8");

if (!game.includes('projectCombatOverdrivePresentation')) {
  game = replaceOnce(
    game,
    'import { projectCombatOverdriveEffects } from "./combatOverdriveEffects";\n',
    'import { projectCombatOverdriveEffects } from "./combatOverdriveEffects";\nimport { projectCombatOverdrivePresentation } from "./combatOverdrivePresentation";\nimport {\n  drawCombatOverdriveFieldOverlay,\n  drawCombatOverdriveSwarmHalo,\n} from "./combatOverdrivePresentationRenderer";\n',
    "J2D-B presentation imports",
  );
}

if (!game.includes('playOverdriveActivationSound')) {
  game = replaceOnce(
    game,
    '  playBossShardsSound, playBossPulseSound\n} from "./audio";',
    '  playBossShardsSound, playBossPulseSound, playOverdriveActivationSound\n} from "./audio";',
    "J2D-B audio import",
  );
}

if (!game.includes('playOverdriveActivationSound();')) {
  game = replaceOnce(
    game,
    '    if (!resolution.activated || !resolution.consumeResonance) {\n      return false;\n    }\n\n    combatResonanceRef.current = {',
    '    if (!resolution.activated || !resolution.consumeResonance) {\n      return false;\n    }\n\n    // Successful explicit activation is already a user gesture (keyboard/HUD).\n    playOverdriveActivationSound();\n\n    combatResonanceRef.current = {',
    "J2D-B activation stinger",
  );
}

if (!game.includes('const liveOverdrivePresentation =')) {
  game = replaceOnce(
    game,
    '    // Apply camera transformation context and screen shake translation\n',
    '    const liveOverdriveRenderProjection = projectCombatOverdrive(\n      combatOverdriveRef.current,\n      timeElapsedRef.current,\n      projectCombatResonance(combatResonanceRef.current).overdriveReady,\n    );\n    const liveOverdrivePresentation = projectCombatOverdrivePresentation({\n      active: liveOverdriveRenderProjection.active,\n      remainingRatio: liveOverdriveRenderProjection.remainingRatio,\n      qualityPreset: statsRef.current?.qualityPreset ?? stats.qualityPreset,\n    });\n    drawCombatOverdriveFieldOverlay(\n      ctx,\n      liveOverdrivePresentation,\n      cameraStateRef.current.viewportWidth,\n      cameraStateRef.current.viewportHeight,\n    );\n\n    // Apply camera transformation context and screen shake translation\n',
    "J2D-B screen-space projection",
  );
}

if (!game.includes('drawCombatOverdriveSwarmHalo(')) {
  game = replaceOnce(
    game,
    '    // 6. Draw swarm shooters\n',
    '    // J2D-B: bounded collective Overdrive field, drawn directly with no particles.\n    drawCombatOverdriveSwarmHalo(\n      ctx,\n      liveOverdrivePresentation,\n      playerPosRef.current,\n    );\n\n    // 6. Draw swarm shooters\n',
    "J2D-B world-space halo",
  );
}

if (!audio.includes('export const playOverdriveActivationSound')) {
  audio += `\n\n// ES-13J2D-B: bounded tactical Overdrive activation stinger.\n// Called only after a successful explicit activation gesture; never on mount.\nexport const playOverdriveActivationSound = () => {\n  const ctx = initAudio();\n  if (!ctx || isMuted) return;\n\n  beginTacticalPriority(ctx, 0.8);\n  const now = ctx.currentTime;\n  const frequencies = [220, 440, 880] as const;\n\n  frequencies.forEach((frequency, index) => {\n    const osc = ctx.createOscillator();\n    const gain = ctx.createGain();\n    const startAt = now + index * 0.055;\n    const stopAt = startAt + 0.32;\n\n    osc.type = index === 2 ? \"sine\" : \"triangle\";\n    osc.frequency.setValueAtTime(frequency, startAt);\n    osc.frequency.exponentialRampToValueAtTime(\n      frequency * 1.35,\n      stopAt,\n    );\n\n    gain.gain.setValueAtTime(0.0001, startAt);\n    gain.gain.linearRampToValueAtTime(\n      laneGain(ctx, index === 2 ? 0.11 : 0.085, \"TACTICAL\"),\n      startAt + 0.025,\n    );\n    gain.gain.exponentialRampToValueAtTime(0.0001, stopAt);\n\n    osc.connect(gain);\n    gain.connect(ctx.destination);\n    osc.start(startAt);\n    osc.stop(stopAt);\n  });\n};\n`;
}

const renderer = `import type { CombatOverdrivePresentationProjection } from \"./combatOverdrivePresentation\";\n\ninterface RenderPoint {\n  x: number;\n  y: number;\n}\n\n/**\n * Direct Canvas2D adoption for the certified J2D-A presentation projection.\n * Owns no clocks, entity arrays, particles, React state or gameplay tuning.\n */\nexport const drawCombatOverdriveFieldOverlay = (\n  ctx: CanvasRenderingContext2D,\n  projection: CombatOverdrivePresentationProjection,\n  viewportWidth: number,\n  viewportHeight: number,\n) => {\n  if (!projection.active || projection.overlayAlpha <= 0) return;\n\n  ctx.save();\n  ctx.globalAlpha = projection.overlayAlpha;\n  ctx.fillStyle = \"#155e75\";\n  ctx.fillRect(0, 0, viewportWidth, viewportHeight);\n  ctx.restore();\n};\n\nexport const drawCombatOverdriveSwarmHalo = (\n  ctx: CanvasRenderingContext2D,\n  projection: CombatOverdrivePresentationProjection,\n  center: RenderPoint,\n) => {\n  if (!projection.active || projection.swarmHaloAlpha <= 0) return;\n\n  const pulse = projection.activationPulse;\n  const baseRadius = 28 + pulse * 10;\n\n  ctx.save();\n  ctx.globalCompositeOperation = \"lighter\";\n  ctx.globalAlpha = projection.swarmHaloAlpha * (0.35 + pulse * 0.2);\n  ctx.fillStyle = \"#0891b2\";\n  ctx.beginPath();\n  ctx.arc(center.x, center.y, baseRadius, 0, Math.PI * 2);\n  ctx.fill();\n\n  ctx.lineWidth = 1.25 + pulse;\n  for (let index = 0; index < projection.ringCount; index += 1) {\n    ctx.globalAlpha =\n      projection.swarmHaloAlpha * Math.max(0.22, 0.82 - index * 0.18);\n    ctx.strokeStyle = index % 2 === 0 ? \"#67e8f9\" : \"#fbbf24\";\n    ctx.beginPath();\n    ctx.arc(\n      center.x,\n      center.y,\n      baseRadius + 12 + index * 14,\n      0,\n      Math.PI * 2,\n    );\n    ctx.stroke();\n  }\n  ctx.restore();\n};\n`;

const test = `import assert from \"node:assert/strict\";\nimport fs from \"node:fs\";\nimport test from \"node:test\";\n\nconst game = fs.readFileSync(\"src/game/EnergySwarmGame.tsx\", \"utf8\");\nconst audio = fs.readFileSync(\"src/game/audio.ts\", \"utf8\");\nconst renderer = fs.readFileSync(\"src/game/combatOverdrivePresentationRenderer.ts\", \"utf8\");\n\nconst sliceBetween = (source, start, end) => {\n  const startIndex = source.indexOf(start);\n  assert.notEqual(startIndex, -1, \`Missing start marker: \${start}\`);\n  const endIndex = source.indexOf(end, startIndex + start.length);\n  assert.notEqual(endIndex, -1, \`Missing end marker: \${end}\`);\n  return source.slice(startIndex, endIndex);\n};\n\ntest(\"J2D-B runtime consumes the certified presentation projection without tuning imports\", () => {\n  assert.match(game, /projectCombatOverdrivePresentation/);\n  assert.match(game, /drawCombatOverdriveFieldOverlay/);\n  assert.match(game, /drawCombatOverdriveSwarmHalo/);\n  assert.doesNotMatch(game, /OVERDRIVE_ACTIVATION_PULSE_RATIO_WINDOW/);\n  assert.doesNotMatch(game, /MAX_OVERDRIVE_PRESENTATION_RINGS/);\n});\n\ntest(\"live presentation derives from authoritative Overdrive state and simulation time\", () => {\n  const renderSlice = sliceBetween(\n    game,\n    \"const renderCanvasScene =\",\n    \"// --- TOUCH AND COORDINATE POINTER MAPS ---\",\n  );\n  assert.match(renderSlice, /projectCombatOverdrive\\(\\s*combatOverdriveRef\\.current,\\s*timeElapsedRef\\.current,/s);\n  assert.match(renderSlice, /remainingRatio:\\s*liveOverdriveRenderProjection\\.remainingRatio/);\n  assert.match(renderSlice, /qualityPreset:\\s*statsRef\\.current\\?\\.qualityPreset \\?\\? stats\\.qualityPreset/);\n  assert.doesNotMatch(renderSlice, /Date\\.now\\(|setTimeout\\(|setInterval\\(/);\n});\n\ntest(\"presentation renderer is direct bounded Canvas2D with no entity or particle arrays\", () => {\n  assert.match(renderer, /projection\\.ringCount/);\n  assert.match(renderer, /fillRect\\(/);\n  assert.match(renderer, /ctx\\.arc\\(/);\n  assert.doesNotMatch(renderer, /particles|enemies|projectiles|swarmRef|requestAnimationFrame|setTimeout|setInterval|Date\\.now|performance\\.now/);\n});\n\ntest(\"Overdrive stinger is called only after a successful explicit activation\", () => {\n  const handler = sliceBetween(\n    game,\n    \"const handleOverdriveActivation =\",\n    \"// --- KEY LISTENER LISTENERS ---\",\n  );\n  const successGuard = handler.indexOf(\"if (!resolution.activated || !resolution.consumeResonance)\");\n  const stinger = handler.indexOf(\"playOverdriveActivationSound();\");\n  assert.ok(successGuard >= 0);\n  assert.ok(stinger > successGuard);\n  assert.equal((game.match(/playOverdriveActivationSound\\(\\);/g) ?? []).length, 1);\n});\n\ntest(\"Overdrive audio is mute-safe and owns no mount-time autoplay path\", () => {\n  const sound = sliceBetween(\n    audio,\n    \"export const playOverdriveActivationSound\",\n    \"};\",\n  );\n  assert.match(sound, /const ctx = initAudio\\(\\)/);\n  assert.match(sound, /if \\(!ctx \\|\\| isMuted\\) return/);\n  assert.match(sound, /beginTacticalPriority\\(ctx, 0\\.8\\)/);\n  const mountSlice = sliceBetween(game, \"useEffect(() => {\", \"}, []);\");\n  assert.doesNotMatch(mountSlice, /playOverdriveActivationSound/);\n});\n`;

fs.writeFileSync(gamePath, game);
fs.writeFileSync(audioPath, audio);
fs.writeFileSync(rendererPath, renderer);
fs.writeFileSync(testPath, test);
console.log("J2D-B materialization complete");
