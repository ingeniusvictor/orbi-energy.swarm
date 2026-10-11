import { readFileSync, writeFileSync } from "node:fs";

const replaceOnce = (path, before, after, label) => {
  const source = readFileSync(path, "utf8");
  const occurrences = source.split(before).length - 1;
  if (occurrences !== 1) {
    throw new Error(`${label}: expected exactly one match, found ${occurrences}`);
  }
  writeFileSync(path, source.replace(before, after));
};

const gamePath = "src/game/EnergySwarmGame.tsx";
const companionPath = "src/components/CompanionPanel.tsx";
const haloPath = "src/game/fotonDysonHalo.ts";
const haloTestPath = "tests/foton-dyson-halo.test.ts";

replaceOnce(
  gamePath,
  'import { projectFlashAccessibility } from "./flashAccessibility";\n',
  'import { projectFlashAccessibility } from "./flashAccessibility";\nimport { projectBossPursuit } from "./bossPursuit";\n',
  "boss pursuit import",
);

replaceOnce(
  gamePath,
  `    } else {\n      if ((boss.bossPhase || 1) === 1) {\n        const centerX = WORLD_WIDTH / 2;\n        const centerY = 160;\n        const targetX = centerX + Math.cos(timeElapsedRef.current * 0.001) * 120;\n        const targetY = centerY + Math.sin(timeElapsedRef.current * 0.0015) * 40;\n        boss.x += (targetX - boss.x) * 0.02 * (delta / 16.6);\n        boss.y += (targetY - boss.y) * 0.02 * (delta / 16.6);\n      } else if ((boss.bossPhase || 1) === 2) {\n        const centerX = WORLD_WIDTH / 2;\n        const centerY = 150;\n        const targetX = centerX + Math.sin(timeElapsedRef.current * 0.0015) * 240;\n        const targetY = centerY + Math.cos(timeElapsedRef.current * 0.001) * 35;\n        boss.x += (targetX - boss.x) * 0.04 * (delta / 16.6);\n        boss.y += (targetY - boss.y) * 0.04 * (delta / 16.6);\n      } else {\n        const tx = playerPosRef.current.x;\n        const ty = playerPosRef.current.y - 140;\n        const dx = tx - boss.x;\n        const dy = ty - boss.y;\n        const dist = Math.sqrt(dx * dx + dy * dy) || 1;\n        if (dist > 20) {\n          boss.x += (dx / dist) * 1.5 * (delta / 16.6);\n          boss.y += (dy / dist) * 1.5 * (delta / 16.6);\n        }\n      }\n    }`,
  `    } else {\n      const pursuit = projectBossPursuit({\n        bossX: boss.x,\n        bossY: boss.y,\n        playerX: playerPosRef.current.x,\n        playerY: playerPosRef.current.y,\n        phase: boss.bossPhase || 1,\n        deltaMs: delta,\n        bounds: WORLD_BOUNDS,\n        margin: 40,\n      });\n      boss.x = pursuit.x;\n      boss.y = pursuit.y;\n    }`,
  "phase-scaled boss pursuit",
);

replaceOnce(
  gamePath,
  `    const recoilDamping =\n      projectFrameDamping(0.82, delta);\n    let targetingEnemyIndex: SpatialIndex<Enemy> | null =\n      null;`,
  `    formationCooldownRef.current = Math.max(\n      0,\n      formationCooldownRef.current - delta,\n    );\n\n    const recoilDamping =\n      projectFrameDamping(0.82, delta);\n    let targetingEnemyIndex: SpatialIndex<Enemy> | null =\n      null;`,
  "formation cooldown decay",
);

replaceOnce(
  gamePath,
  '<span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">SWARM FORMATIONS</span>',
  '<span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">FORMACIONES · CLIC / TECLAS 1–6</span>',
  "formation interaction heading",
);

replaceOnce(
  gamePath,
  `                          <button\n                            key={f.type}\n                            onClick={() => triggerFormationChange(f.type)}`,
  `                          <button\n                            type="button"\n                            aria-pressed={isSel}\n                            key={f.type}\n                            onClick={() => triggerFormationChange(f.type)}`,
  "formation button semantics",
);

replaceOnce(
  gamePath,
  '<span className="text-[8.5px] uppercase tracking-wider text-slate-500 shrink-0">{f.type}</span>',
  '<span className="text-[8.5px] uppercase tracking-wider text-slate-500 shrink-0">{isSel ? "ACTIVA" : f.type}</span>',
  "formation active label",
);

replaceOnce(
  companionPath,
  'className="w-full lg:w-[330px] shrink-0 bg-slate-950/70 border border-slate-900 rounded-xl p-3 md:p-4 shadow-xl backdrop-blur-md text-white select-none flex flex-col h-[400px] lg:h-[580px]"',
  'className="w-full lg:w-[330px] shrink-0 bg-slate-950/70 border border-slate-900 rounded-xl p-3 md:p-4 shadow-xl backdrop-blur-md text-white select-none flex flex-col h-[460px] lg:h-[min(72dvh,720px)] min-h-0"',
  "companion responsive height",
);

replaceOnce(
  companionPath,
  '<div className="space-y-1.5 max-h-[300px] lg:max-h-[400px] overflow-y-auto pr-0.5">',
  '<div className="space-y-1.5 pr-0.5" data-swarm-roster-list>',
  "single swarm roster scroll surface",
);

replaceOnce(
  haloPath,
  '    tilt: [0.62, 0.86, 0.78],',
  '    tilt: [1.08, 0, 2.094],',
  "emerald atomic plane",
);
replaceOnce(
  haloPath,
  '    tilt: [-0.62, -0.86, -0.78],',
  '    tilt: [1.08, 0, 4.189],',
  "gold atomic plane",
);
replaceOnce(
  haloPath,
  '// share the same center and radius; the atom/Dyson silhouette is created only\n// by mirrored orbital planes, not by offset/concentric geometry.',
  '// share the same center and radius; the atom/Dyson silhouette is created by\n// one common polar tilt separated into three 120-degree azimuth planes, never\n// by offset/concentric geometry.',
  "halo geometry comment",
);

replaceOnce(
  haloTestPath,
  `  assert.deepEqual(cyan.tilt, [1.08, 0, 0]);\n  assert.deepEqual(emerald.tilt, [0.62, 0.86, 0.78]);\n  assert.deepEqual(gold.tilt, [-0.62, -0.86, -0.78]);\n\n  for (let index = 0; index < emerald.tilt.length; index += 1) {\n    assert.equal(emerald.tilt[index], -gold.tilt[index]);\n  }\n\n  assert.ok(Math.abs(emerald.phase - 2.094) < 0.001);\n  assert.ok(Math.abs(gold.phase - 4.189) < 0.001);`,
  `  assert.deepEqual(cyan.tilt, [1.08, 0, 0]);\n  assert.deepEqual(emerald.tilt, [1.08, 0, 2.094]);\n  assert.deepEqual(gold.tilt, [1.08, 0, 4.189]);\n\n  assert.equal(cyan.tilt[0], emerald.tilt[0]);\n  assert.equal(emerald.tilt[0], gold.tilt[0]);\n  assert.equal(cyan.tilt[1], 0);\n  assert.equal(emerald.tilt[1], 0);\n  assert.equal(gold.tilt[1], 0);\n  assert.ok(Math.abs((emerald.tilt[2] - cyan.tilt[2]) - 2.094) < 0.002);\n  assert.ok(Math.abs((gold.tilt[2] - emerald.tilt[2]) - 2.095) < 0.002);\n  assert.ok(Math.abs((Math.PI * 2 - gold.tilt[2]) - 2.094) < 0.002);\n\n  assert.ok(Math.abs(emerald.phase - 2.094) < 0.001);\n  assert.ok(Math.abs(gold.phase - 4.189) < 0.001);`,
  "Dyson triad unit test",
);

console.log("ES-12H1 guarded patch applied successfully.");
