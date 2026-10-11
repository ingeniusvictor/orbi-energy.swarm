import { readFileSync, writeFileSync } from "node:fs";

const replaceExpected = (path, from, to, expected = 1) => {
  const source = readFileSync(path, "utf8");
  const count = source.split(from).length - 1;
  if (count !== expected) {
    throw new Error(`${path}: expected ${expected} matches, got ${count}:\n${from}`);
  }
  writeFileSync(path, source.split(from).join(to));
};
const appendOnce = (path, marker, content) => {
  const source = readFileSync(path, "utf8");
  if (!source.includes(marker)) {
    writeFileSync(path, source.trimEnd() + "\n\n" + content.trim() + "\n");
  }
};

replaceExpected(
  "src/game/gaiaEvolution.ts",
  `const countBits = (value: number) => {\n  let count = 0;\n  let remaining = value >>> 0;\n  while (remaining !== 0) {\n    count += remaining & 1;\n    remaining >>>= 1;\n  }\n  return count;\n};\n\nexport const createGaiaEvolutionState`,
  `const countBits = (value: number) => {\n  let count = 0;\n  let remaining = value >>> 0;\n  while (remaining !== 0) {\n    count += remaining & 1;\n    remaining >>>= 1;\n  }\n  return count;\n};\n\nexport const getGaiaProgressCount = (\n  state: GaiaEvolutionState,\n) => countBits(state.cycleMask);\n\nexport const createGaiaEvolutionState`,
);

replaceExpected(
  "src/game/performanceDiagnostics.ts",
  `  swarm: number;\n  qualityPreset: QualityPreset;`,
  `  swarm: number;\n  gaiaActive: boolean;\n  gaiaLevel: number;\n  gaiaCompletedCycles: number;\n  gaiaProgress: number;\n  gaiaRequired: number;\n  qualityPreset: QualityPreset;`,
  2,
);
replaceExpected(
  "src/game/performanceDiagnostics.ts",
  `      swarm: Math.max(0, Math.floor(sample.swarm)),\n      qualityPreset: sample.qualityPreset,`,
  `      swarm: Math.max(0, Math.floor(sample.swarm)),\n      gaiaActive: Boolean(sample.gaiaActive),\n      gaiaLevel: Math.max(0, Math.floor(sample.gaiaLevel)),\n      gaiaCompletedCycles: Math.max(0, Math.floor(sample.gaiaCompletedCycles)),\n      gaiaProgress: Math.max(0, Math.floor(sample.gaiaProgress)),\n      gaiaRequired: Math.max(1, Math.floor(sample.gaiaRequired)),\n      qualityPreset: sample.qualityPreset,`,
);
replaceExpected(
  "src/game/performanceDiagnostics.ts",
  `    swarm: next.latest.swarm,\n    qualityPreset: next.latest.qualityPreset,`,
  `    swarm: next.latest.swarm,\n    gaiaActive: next.latest.gaiaActive,\n    gaiaLevel: next.latest.gaiaLevel,\n    gaiaCompletedCycles: next.latest.gaiaCompletedCycles,\n    gaiaProgress: next.latest.gaiaProgress,\n    gaiaRequired: next.latest.gaiaRequired,\n    qualityPreset: next.latest.qualityPreset,`,
);

replaceExpected(
  "src/game/EnergySwarmGame.tsx",
  `import {\n  createGaiaEvolutionState,\n  getGaiaCombatScale,\n  registerGaiaEnergy,\n} from "./gaiaEvolution";`,
  `import {\n  GAIA_REQUIRED_ENERGY_COUNT,\n  createGaiaEvolutionState,\n  getGaiaCombatScale,\n  getGaiaProgressCount,\n  registerGaiaEnergy,\n} from "./gaiaEvolution";`,
);
replaceExpected(
  "src/game/EnergySwarmGame.tsx",
  `          swarm: swarmRef.current.length + 1,\n          qualityPreset:`,
  `          swarm: swarmRef.current.length + 1,\n          gaiaActive: gaiaMemberRef.current !== null,\n          gaiaLevel: gaiaEvolutionRef.current.gaiaLevel,\n          gaiaCompletedCycles:\n            gaiaEvolutionRef.current.completedCycles,\n          gaiaProgress: getGaiaProgressCount(\n            gaiaEvolutionRef.current,\n          ),\n          gaiaRequired: GAIA_REQUIRED_ENERGY_COUNT,\n          qualityPreset:`,
);

replaceExpected(
  "src/components/PerformanceDiagnosticsOverlay.tsx",
  `          </div>\n\n          <div className="mt-2 flex items-center justify-between border-t border-slate-800 pt-1.5 text-[7px] uppercase">`,
  `          </div>\n\n          <div\n            className="mt-2 rounded border border-lime-400/20 bg-lime-400/5 p-1.5 text-[8px]"\n            data-gaia-diagnostics="true"\n          >\n            <div className="flex items-center justify-between gap-2">\n              <span className="font-black tracking-[0.12em] text-lime-300">GAIA</span>\n              <span className={snapshot.gaiaActive ? "text-lime-200" : "text-slate-500"}>\n                {snapshot.gaiaActive ? \`ACTIVE · L\${snapshot.gaiaLevel}\` : "DORMANT"}\n              </span>\n            </div>\n            <div className="mt-1 flex justify-between">\n              <span className="text-slate-500">SYNC</span>\n              <span className="text-lime-200">\n                {snapshot.gaiaProgress}/{snapshot.gaiaRequired}\n              </span>\n            </div>\n            <div className="flex justify-between">\n              <span className="text-slate-500">CYCLES</span>\n              <span className="text-slate-300">{snapshot.gaiaCompletedCycles}</span>\n            </div>\n          </div>\n\n          <div className="mt-2 flex items-center justify-between border-t border-slate-800 pt-1.5 text-[7px] uppercase">`,
);

replaceExpected(
  "tests/performance-diagnostics.test.ts",
  `  swarm: 18,\n  qualityPreset: QualityPreset.HIGH,`,
  `  swarm: 18,\n  gaiaActive: true,\n  gaiaLevel: 3,\n  gaiaCompletedCycles: 3,\n  gaiaProgress: 5,\n  gaiaRequired: 8,\n  qualityPreset: QualityPreset.HIGH,`,
);
replaceExpected(
  "tests/performance-diagnostics.test.ts",
  `  assert.equal(snapshot.swarm, 18);\n  assert.equal(snapshot.qualityPreset, QualityPreset.HIGH);`,
  `  assert.equal(snapshot.swarm, 18);\n  assert.equal(snapshot.gaiaActive, true);\n  assert.equal(snapshot.gaiaLevel, 3);\n  assert.equal(snapshot.gaiaCompletedCycles, 3);\n  assert.equal(snapshot.gaiaProgress, 5);\n  assert.equal(snapshot.gaiaRequired, 8);\n  assert.equal(snapshot.qualityPreset, QualityPreset.HIGH);`,
);
appendOnce(
  "tests/performance-diagnostics.test.ts",
  "latest GAIA telemetry wins",
  `test("latest GAIA telemetry wins within the diagnostics window", () => {\n  let state = createPerformanceDiagnosticsState();\n  let snapshot;\n  for (let index = 0; index < 40; index += 1) {\n    const next = stepPerformanceDiagnostics(state, sample({\n      gaiaActive: index >= 20,\n      gaiaLevel: index >= 20 ? 2 : 0,\n      gaiaCompletedCycles: index >= 20 ? 2 : 0,\n      gaiaProgress: index % 8,\n      gaiaRequired: 8,\n    }));\n    state = next.state;\n    if (next.snapshot) { snapshot = next.snapshot; break; }\n  }\n  assert.ok(snapshot);\n  assert.equal(snapshot.gaiaActive, true);\n  assert.equal(snapshot.gaiaLevel, 2);\n  assert.equal(snapshot.gaiaCompletedCycles, 2);\n  assert.equal(snapshot.gaiaRequired, 8);\n  assert.ok(snapshot.gaiaProgress >= 0 && snapshot.gaiaProgress < 8);\n});`,
);

replaceExpected(
  "tests/performance-diagnostics-adoption.test.mjs",
  `    "swarmRef.current.length + 1",\n    "qualityPreset",`,
  `    "swarmRef.current.length + 1",\n    "gaiaMemberRef.current !== null",\n    "gaiaEvolutionRef.current.gaiaLevel",\n    "gaiaEvolutionRef.current.completedCycles",\n    "getGaiaProgressCount(",\n    "GAIA_REQUIRED_ENERGY_COUNT",\n    "qualityPreset",`,
);
replaceExpected(
  "tests/performance-diagnostics-adoption.test.mjs",
  `    "SWARM",\n  ]) {`,
  `    "SWARM",\n    "GAIA",\n    "SYNC",\n    "CYCLES",\n  ]) {`,
);
appendOnce(
  "tests/performance-diagnostics-adoption.test.mjs",
  "GAIA telemetry is O(1)",
  `test("GAIA telemetry is O(1) and does not scan the swarm", () => {\n  const loop = section(\n    "const gameLoop =",\n    "// --- BOSS DEFEAT CINEMATIC SEQUENCE ENGINE",\n  );\n  const start = loop.indexOf("if (diagnosticsActive) {");\n  const end = loop.indexOf("requestAnimationFrame(gameLoop)", start);\n  assert.ok(start >= 0 && end > start);\n  const diagnostics = loop.slice(start, end);\n  assert.match(diagnostics, /gaiaMemberRef\\.current !== null/);\n  assert.match(diagnostics, /gaiaEvolutionRef\\.current\\.gaiaLevel/);\n  assert.doesNotMatch(diagnostics, /swarmRef\\.current\\.(?:find|filter|reduce|some)\\(/);\n});`,
);

replaceExpected(
  "tests/gaia-evolution.test.ts",
  `  getGaiaCombatScale,\n  registerGaiaEnergy,`,
  `  getGaiaCombatScale,\n  getGaiaProgressCount,\n  registerGaiaEnergy,`,
);
appendOnce(
  "tests/gaia-evolution.test.ts",
  "GAIA progress helper reports",
  `test("GAIA progress helper reports unique energy bits in bounded state", () => {\n  let state = createGaiaEvolutionState();\n  assert.equal(getGaiaProgressCount(state), 0);\n  state = registerGaiaEnergy(state, "HYDRO").state;\n  state = registerGaiaEnergy(state, "AERO").state;\n  state = registerGaiaEnergy(state, "HYDRO").state;\n  assert.equal(getGaiaProgressCount(state), 2);\n});`,
);

console.log("ES-12G1 GAIA telemetry patch applied");
