import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const write = (relativePath, content) => fs.writeFileSync(path.join(root, relativePath), content, "utf8");

const countExact = (source, needle) => {
  let count = 0;
  let start = 0;
  while (true) {
    const index = source.indexOf(needle, start);
    if (index < 0) return count;
    count += 1;
    start = index + needle.length;
  }
};

const replaceExact = (relativePath, from, to, expected = 1) => {
  const source = read(relativePath);
  const count = countExact(source, from);
  if (count !== expected) {
    throw new Error(`${relativePath}: expected ${expected} exact matches, found ${count}`);
  }
  write(relativePath, source.split(from).join(to));
};

const replaceRegex = (relativePath, regex, replacer, expected = 1) => {
  const source = read(relativePath);
  const matches = [...source.matchAll(regex)];
  if (matches.length !== expected) {
    throw new Error(`${relativePath}: expected ${expected} regex matches, found ${matches.length} for ${regex}`);
  }
  write(relativePath, source.replace(regex, replacer));
};

const gamePath = "src/game/EnergySwarmGame.tsx";

replaceExact(
  gamePath,
  '  const keysPressedRef = useRef<Record<string, boolean>>({});\n\n  // Entity Lists',
  '  const keysPressedRef = useRef<Record<string, boolean>>({});\n  const activeFormationRef = useRef<FormationType>(FormationType.LINE);\n\n  // Entity Lists',
);

replaceExact(
  gamePath,
  '  const runMaxSwarmSizeRef = useRef<number>(1);\n  const runCommitLedgerRef = useRef<RunCommitLedger>(createRunCommitLedger());',
  '  const runMaxSwarmSizeRef = useRef<number>(1);\n  const runOrbiAcquiredRef = useRef<number>(0);\n  const runCommitLedgerRef = useRef<RunCommitLedger>(createRunCommitLedger());',
);

replaceExact(
  gamePath,
  '    runMaxSwarmSizeRef.current = 1;\n    reactUpdateAccumulatorMsRef.current = 0;',
  '    runMaxSwarmSizeRef.current = 1;\n    runOrbiAcquiredRef.current = 0;\n    reactUpdateAccumulatorMsRef.current = 0;',
);

replaceExact(
  gamePath,
  '    setActiveFormation(nextForm);\n    playClickSound();',
  '    activeFormationRef.current = nextForm;\n    setActiveFormation(nextForm);\n    playClickSound();',
);

replaceExact(
  gamePath,
  '    setActiveBiome(BiomeType.SOLAR_PLAINS);\n    setActiveFormation(FormationType.LINE);',
  '    setActiveBiome(BiomeType.SOLAR_PLAINS);\n    activeFormationRef.current = FormationType.LINE;\n    setActiveFormation(FormationType.LINE);',
);

replaceExact(
  gamePath,
  '    formationUseCountsRef.current[activeFormation] =\n      (formationUseCountsRef.current[activeFormation] ?? 0) +\n      delta;',
  '    const runtimeFormation = activeFormationRef.current;\n    formationUseCountsRef.current[runtimeFormation] =\n      (formationUseCountsRef.current[runtimeFormation] ?? 0) +\n      delta;',
);

replaceExact(gamePath, 'FORMATIONS[activeFormation]', 'FORMATIONS[activeFormationRef.current]', 3);
replaceRegex(gamePath, /activeFormation === FormationType\./g, 'activeFormationRef.current === FormationType.', 4);
replaceExact(
  gamePath,
  '      const offsets = calculateSwarmOffset(\n        activeFormation,',
  '      const offsets = calculateSwarmOffset(\n        activeFormationRef.current,',
);

replaceRegex(
  gamePath,
  /swarmRef\.current\.push\(([^)\n]+)\);\n(\s*)updateRunMaxSwarmSize\(\);/g,
  (_match, member, indent) =>
    `swarmRef.current.push(${member});\n${indent}runOrbiAcquiredRef.current += 1;\n${indent}updateRunMaxSwarmSize();`,
  4,
);

replaceExact(
  gamePath,
  '      fotonThreatDirectionRef.current,\n      swarmRef.current.length,\n    );',
  '      fotonThreatDirectionRef.current,\n      runOrbiAcquiredRef.current,\n    );',
);

replaceExact(
  "src/game/fotonDysonHalo.ts",
  `/**\n * Gameplay currently supplies the live swarm member count. The first member\n * is granted automatically at run start and is not a collected Orbi, so halo\n * progression must subtract that initial companion before applying 10-Orbi\n * construction thresholds.\n */\nexport const getCollectedOrbiCountFromSwarmSize = (\n  swarmMemberCount: number,\n): number => Math.max(0, normalizeCount(swarmMemberCount) - 1);`,
  `/**\n * swarmRef stores recruited followers only; Foton itself is not an element in\n * that array. Therefore no phantom starting companion may be subtracted.\n * Runtime Dyson progression now uses a separate monotonic acquired-Orbi count,\n * while this helper remains as a truthful follower-count conversion.\n */\nexport const getCollectedOrbiCountFromSwarmSize = (\n  swarmMemberCount: number,\n): number => normalizeCount(swarmMemberCount);`,
);

replaceExact(
  "src/game/fotonGameplay3DRenderer.ts",
  "  getUnlockedDysonHaloRingCountFromSwarmSize,\n",
  "  getUnlockedDysonHaloRingCount,\n",
);
replaceExact(
  "src/game/fotonGameplay3DRenderer.ts",
  "  // Legacy name kept at the Canvas boundary. The current caller supplies the\n  // live swarm-member count, including the free initial companion.\n",
  "  // Legacy field name kept at the Canvas boundary. The current caller supplies\n  // the monotonic per-run count of acquired Orbis, not the live follower count.\n",
);
replaceExact(
  "src/game/fotonGameplay3DRenderer.ts",
  "    getUnlockedDysonHaloRingCountFromSwarmSize(\n      active.orbiCount,\n    );",
  "    getUnlockedDysonHaloRingCount(\n      active.orbiCount,\n    );",
);

replaceExact(
  "src/components/CompanionPanel.tsx",
  'h-[460px] lg:h-[min(72dvh,720px)] min-h-0',
  'h-[460px] lg:h-[min(82dvh,820px)] min-h-0',
);

replaceExact(
  "src/styles/index.css",
  `  .orbi-game-workspace {\n    grid-template-columns:\n      minmax(230px, 260px)\n      minmax(0, 1fr)\n      minmax(300px, 330px);\n  }`,
  `  .orbi-game-workspace {\n    grid-template-columns:\n      minmax(210px, 235px)\n      minmax(0, 1fr)\n      minmax(270px, 300px);\n    gap: 0.65rem;\n  }`,
);

write("src/game/bossPursuit.ts", String.raw`export interface BossPursuitBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface BossPursuitInput {
  bossX: number;
  bossY: number;
  playerX: number;
  playerY: number;
  phase: number;
  deltaMs: number;
  bounds: BossPursuitBounds;
  margin?: number;
}

export interface BossPursuitProjection {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speedPerFrame: number;
  standoffDistance: number;
}

export const BOSS_PURSUIT_PROFILES = {
  1: { speedPerFrame: 1.8, standoffDistance: 160, deadZone: 16, catchupDistance: 420, catchupMultiplier: 1.25 },
  2: { speedPerFrame: 2.5, standoffDistance: 115, deadZone: 14, catchupDistance: 360, catchupMultiplier: 1.3 },
  3: { speedPerFrame: 3.3, standoffDistance: 75, deadZone: 12, catchupDistance: 300, catchupMultiplier: 1.35 },
} as const;

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const getProfile = (phase: number) => {
  if (phase >= 3) return BOSS_PURSUIT_PROFILES[3];
  if (phase === 2) return BOSS_PURSUIT_PROFILES[2];
  return BOSS_PURSUIT_PROFILES[1];
};

/**
 * Constant-time pursuit for the Blackout Devourer.
 * Outside dedicated charge movement, the boss closes toward Foton from any
 * direction until it reaches a phase-scaled radial standoff. Long-range
 * catch-up prevents stationary firing while bounded delta preserves telegraphs.
 */
export const projectBossPursuit = (
  input: BossPursuitInput,
): BossPursuitProjection => {
  const profile = getProfile(input.phase);
  const safeDelta = Number.isFinite(input.deltaMs)
    ? clamp(input.deltaMs, 0, 50)
    : 0;
  const margin = Math.max(0, input.margin ?? 40);
  const minX = input.bounds.minX + margin;
  const maxX = input.bounds.maxX - margin;
  const minY = input.bounds.minY + margin;
  const maxY = input.bounds.maxY - margin;

  const playerX = clamp(input.playerX, minX, maxX);
  const playerY = clamp(input.playerY, minY, maxY);
  const toPlayerX = playerX - input.bossX;
  const toPlayerY = playerY - input.bossY;
  const playerDistance = Math.hypot(toPlayerX, toPlayerY);

  if (playerDistance === 0 || playerDistance <= profile.standoffDistance || safeDelta === 0) {
    const x = clamp(input.bossX, minX, maxX);
    const y = clamp(input.bossY, minY, maxY);
    return { x, y, targetX: x, targetY: y, speedPerFrame: profile.speedPerFrame, standoffDistance: profile.standoffDistance };
  }

  const inversePlayerDistance = 1 / playerDistance;
  const directionX = toPlayerX * inversePlayerDistance;
  const directionY = toPlayerY * inversePlayerDistance;
  const closeDistance = playerDistance - profile.standoffDistance;
  const targetX = clamp(input.bossX + directionX * closeDistance, minX, maxX);
  const targetY = clamp(input.bossY + directionY * closeDistance, minY, maxY);
  const dx = targetX - input.bossX;
  const dy = targetY - input.bossY;
  const distance = Math.hypot(dx, dy);

  if (distance <= profile.deadZone || distance === 0) {
    return {
      x: clamp(input.bossX, minX, maxX),
      y: clamp(input.bossY, minY, maxY),
      targetX,
      targetY,
      speedPerFrame: profile.speedPerFrame,
      standoffDistance: profile.standoffDistance,
    };
  }

  const frameScale = safeDelta / 16.6;
  const catchupMultiplier = playerDistance >= profile.catchupDistance ? profile.catchupMultiplier : 1;
  const travel = Math.min(
    Math.max(0, distance - profile.deadZone),
    profile.speedPerFrame * catchupMultiplier * frameScale,
  );
  const inverseDistance = 1 / distance;

  return {
    x: clamp(input.bossX + dx * inverseDistance * travel, minX, maxX),
    y: clamp(input.bossY + dy * inverseDistance * travel, minY, maxY),
    targetX,
    targetY,
    speedPerFrame: profile.speedPerFrame,
    standoffDistance: profile.standoffDistance,
  };
};
`);

write("tests/boss-pursuit.test.ts", String.raw`import assert from "node:assert/strict";
import test from "node:test";

import { BOSS_PURSUIT_PROFILES, projectBossPursuit } from "../src/game/bossPursuit.ts";

const bounds = { minX: 8, minY: 8, maxX: 1592, maxY: 952 };

test("Devourer pursuit pressure increases by phase while radial standoff shrinks", () => {
  assert.ok(BOSS_PURSUIT_PROFILES[1].speedPerFrame < BOSS_PURSUIT_PROFILES[2].speedPerFrame);
  assert.ok(BOSS_PURSUIT_PROFILES[2].speedPerFrame < BOSS_PURSUIT_PROFILES[3].speedPerFrame);
  assert.ok(BOSS_PURSUIT_PROFILES[1].standoffDistance > BOSS_PURSUIT_PROFILES[2].standoffDistance);
  assert.ok(BOSS_PURSUIT_PROFILES[2].standoffDistance > BOSS_PURSUIT_PROFILES[3].standoffDistance);
  assert.ok(BOSS_PURSUIT_PROFILES[1].speedPerFrame >= 1.8);
  assert.ok(BOSS_PURSUIT_PROFILES[3].standoffDistance <= 75);
});

test("all phases pursue the player in both axes from long range", () => {
  for (const phase of [1, 2, 3]) {
    const projected = projectBossPursuit({ bossX: 300, bossY: 220, playerX: 900, playerY: 700, phase, deltaMs: 16.6, bounds });
    assert.ok(projected.x > 300, "phase " + phase + " should move toward player x");
    assert.ok(projected.y > 220, "phase " + phase + " should move toward player y");
  }
});

test("long-range catch-up visibly exceeds the base phase step", () => {
  const phase = 3;
  const projected = projectBossPursuit({ bossX: 200, bossY: 200, playerX: 1400, playerY: 800, phase, deltaMs: 16.6, bounds });
  const travel = Math.hypot(projected.x - 200, projected.y - 200);
  assert.ok(travel > BOSS_PURSUIT_PROFILES[phase].speedPerFrame);
});

test("pursuit is frame-delta bounded and cannot teleport", () => {
  const phase = 3;
  const projected = projectBossPursuit({ bossX: 200, bossY: 200, playerX: 1400, playerY: 800, phase, deltaMs: 500, bounds });
  const travel = Math.hypot(projected.x - 200, projected.y - 200);
  const profile = BOSS_PURSUIT_PROFILES[phase];
  const maxTravel = profile.speedPerFrame * profile.catchupMultiplier * (50 / 16.6);
  assert.ok(travel <= maxTravel + 1e-9);
});

test("pursuit respects world margin at every phase", () => {
  for (const phase of [1, 2, 3]) {
    const projected = projectBossPursuit({ bossX: 1590, bossY: 950, playerX: 5000, playerY: 5000, phase, deltaMs: 16.6, bounds, margin: 40 });
    assert.ok(projected.x >= 48 && projected.x <= 1552);
    assert.ok(projected.y >= 48 && projected.y <= 912);
    assert.ok(projected.targetX >= 48 && projected.targetX <= 1552);
    assert.ok(projected.targetY >= 48 && projected.targetY <= 912);
  }
});

test("pursuit holds position once the phase radial standoff is reached", () => {
  const projected = projectBossPursuit({ bossX: 740, bossY: 600, playerX: 800, playerY: 600, phase: 2, deltaMs: 16.6, bounds });
  assert.equal(projected.x, 740);
  assert.equal(projected.y, 600);
});
`);

replaceExact(
  "tests/foton-dyson-halo.test.ts",
  `test("live swarm size subtracts the free starting companion before ring thresholds", () => {\n  assert.equal(getCollectedOrbiCountFromSwarmSize(0), 0);\n  assert.equal(getCollectedOrbiCountFromSwarmSize(1), 0);\n  assert.equal(getCollectedOrbiCountFromSwarmSize(10), 9);\n  assert.equal(getCollectedOrbiCountFromSwarmSize(11), 10);\n  assert.equal(getCollectedOrbiCountFromSwarmSize(21), 20);\n\n  assert.equal(getUnlockedDysonHaloRingCountFromSwarmSize(1), 1);\n  assert.equal(getUnlockedDysonHaloRingCountFromSwarmSize(10), 1);\n  assert.equal(getUnlockedDysonHaloRingCountFromSwarmSize(11), 2);\n  assert.equal(getUnlockedDysonHaloRingCountFromSwarmSize(20), 2);\n  assert.equal(getUnlockedDysonHaloRingCountFromSwarmSize(21), 3);\n});`,
  `test("swarm-size helper never subtracts a phantom starting companion", () => {\n  assert.equal(getCollectedOrbiCountFromSwarmSize(0), 0);\n  assert.equal(getCollectedOrbiCountFromSwarmSize(1), 1);\n  assert.equal(getCollectedOrbiCountFromSwarmSize(9), 9);\n  assert.equal(getCollectedOrbiCountFromSwarmSize(10), 10);\n  assert.equal(getCollectedOrbiCountFromSwarmSize(20), 20);\n\n  assert.equal(getUnlockedDysonHaloRingCountFromSwarmSize(1), 1);\n  assert.equal(getUnlockedDysonHaloRingCountFromSwarmSize(9), 1);\n  assert.equal(getUnlockedDysonHaloRingCountFromSwarmSize(10), 2);\n  assert.equal(getUnlockedDysonHaloRingCountFromSwarmSize(19), 2);\n  assert.equal(getUnlockedDysonHaloRingCountFromSwarmSize(20), 3);\n});`,
);

replaceRegex(
  "tests/foton-dyson-halo-adoption.test.mjs",
  /test\("live swarm size is corrected to true collected Orbi before unlocking extra rings", \(\) => \{[\s\S]*?\n\}\);/g,
  String.raw`test("cumulative acquired Orbis drive monotonic ring progression", () => {
  assert.match(game, /const runOrbiAcquiredRef = useRef<number>\(0\)/);
  assert.equal((game.match(/runOrbiAcquiredRef\.current \+= 1/g) ?? []).length, 4);
  assert.match(game, /drawFoton\([\s\S]*fotonThreatDirectionRef\.current,[\s\S]*runOrbiAcquiredRef\.current/);
  assert.match(canvas, /orbiCount,/);
  assert.match(runtime, /request\.orbiCount \?\? 0/);
  assert.match(runtime, /getUnlockedDysonHaloRingCount\([\s\S]*active\.orbiCount/);
  assert.doesNotMatch(halo, /normalizeCount\(swarmMemberCount\) - 1/);
});`,
);

write("tests/es12h2-physical-playtest-adoption.test.mjs", String.raw`import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const game = read("src/game/EnergySwarmGame.tsx");
const halo = read("src/game/fotonDysonHalo.ts");
const pursuit = read("src/game/bossPursuit.ts");
const companion = read("src/components/CompanionPanel.tsx");
const styles = read("src/styles/index.css");
const constants = read("src/game/constants.ts");

test("runtime formation source of truth cannot go stale behind React UI state", () => {
  assert.match(game, /const activeFormationRef = useRef<FormationType>\(FormationType\.LINE\)/);
  assert.match(game, /activeFormationRef\.current = nextForm;[\s\S]{0,80}setActiveFormation\(nextForm\)/);
  assert.match(game, /activeFormationRef\.current = FormationType\.LINE;[\s\S]{0,80}setActiveFormation\(FormationType\.LINE\)/);
  assert.match(game, /const runtimeFormation = activeFormationRef\.current/);
  assert.match(game, /calculateSwarmOffset\(\s*activeFormationRef\.current,/);
  assert.doesNotMatch(game, /FORMATIONS\[activeFormation\]/);
  assert.doesNotMatch(game, /calculateSwarmOffset\(\s*activeFormation,/);
});

test("Dyson progression uses monotonic run acquisition instead of live follower attrition", () => {
  assert.match(game, /const runOrbiAcquiredRef = useRef<number>\(0\)/);
  assert.match(game, /runOrbiAcquiredRef\.current = 0/);
  assert.equal((game.match(/runOrbiAcquiredRef\.current \+= 1/g) ?? []).length, 4);
  assert.match(game, /fotonThreatDirectionRef\.current,\s*runOrbiAcquiredRef\.current,\s*\);/);
  assert.doesNotMatch(halo, /normalizeCount\(swarmMemberCount\) - 1/);
});

test("Devourer pursuit remains O(1) while applying materially stronger phase pressure", () => {
  assert.doesNotMatch(pursuit, /for\s*\(|\.map\(|\.filter\(|\.forEach\(/);
  assert.match(pursuit, /speedPerFrame: 1\.8/);
  assert.match(pursuit, /speedPerFrame: 3\.3/);
  assert.match(pursuit, /standoffDistance: 75/);
  assert.match(pursuit, /catchupMultiplier: 1\.35/);
});

test("desktop cockpit allocates more height to roster and more width to battlefield", () => {
  assert.match(companion, /lg:h-\[min\(82dvh,820px\)\]/);
  assert.match(styles, /@media \(min-width: 1600px\)[\s\S]*minmax\(210px, 235px\)[\s\S]*minmax\(270px, 300px\)[\s\S]*gap: 0\.65rem/);
});

test("physical-playtest correction preserves logical 800x480 canvas and performance budgets", () => {
  assert.match(constants, /CANVAS_WIDTH\s*=\s*800/);
  assert.match(constants, /CANVAS_HEIGHT\s*=\s*480/);
  assert.match(styles, /\.orbi-game-stage\s*\{[\s\S]*aspect-ratio:\s*5\s*\/\s*3/);
  assert.match(constants, /MAX_ENEMIES/);
  assert.match(constants, /MAX_PROJECTILES/);
});
`);

console.log("ES-12H2 guarded patch applied successfully.");
