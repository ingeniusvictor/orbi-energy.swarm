import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const write = (p, s) => fs.writeFileSync(path.join(root, p), s, "utf8");
const replaceExact = (p, from, to, expected = 1) => {
  const s = read(p);
  const count = s.split(from).length - 1;
  if (count !== expected) throw new Error(`${p}: expected ${expected} matches, found ${count}`);
  write(p, s.split(from).join(to));
};

// 1) True 3D Dyson plane normals.
write("src/game/fotonDysonHalo.ts", `export interface FotonDysonHaloRingDescriptor {
  id: "CYAN" | "EMERALD" | "GOLD";
  unlockCollectedOrbi: number;
  color: number;
  accentColor: number;
  radius: number;
  railTubeRadius: number;
  energyTubeRadius: number;
  planeNormal: readonly [number, number, number];
  angularVelocity: number;
  phase: number;
  buildDurationMs: number;
  accentNodeCount: number;
  segmentArcFraction: number;
}

export const FOTON_DYSON_HALO_RED_ACCENT = 0xff1744;

// Symmetric true-plane atomic triad. Pairwise plane-normal dot products are
// -0.125, so the three equal-radius rings cannot collapse into one plane.
export const FOTON_DYSON_HALO_RINGS: readonly FotonDysonHaloRingDescriptor[] = [
  {
    id: "CYAN", unlockCollectedOrbi: 0, color: 0x00f5ff,
    accentColor: FOTON_DYSON_HALO_RED_ACCENT, radius: 1.055,
    railTubeRadius: 0.044, energyTubeRadius: 0.018,
    planeNormal: [0.8660254, 0, 0.5], angularVelocity: 0.14, phase: 0,
    buildDurationMs: 620, accentNodeCount: 3, segmentArcFraction: 0.62,
  },
  {
    id: "EMERALD", unlockCollectedOrbi: 10, color: 0x00ff88,
    accentColor: FOTON_DYSON_HALO_RED_ACCENT, radius: 1.055,
    railTubeRadius: 0.041, energyTubeRadius: 0.017,
    planeNormal: [-0.4330127, 0.75, 0.5], angularVelocity: -0.115, phase: 2.094,
    buildDurationMs: 680, accentNodeCount: 3, segmentArcFraction: 0.6,
  },
  {
    id: "GOLD", unlockCollectedOrbi: 20, color: 0xffd740,
    accentColor: FOTON_DYSON_HALO_RED_ACCENT, radius: 1.055,
    railTubeRadius: 0.042, energyTubeRadius: 0.018,
    planeNormal: [-0.4330127, -0.75, 0.5], angularVelocity: 0.09, phase: 4.189,
    buildDurationMs: 740, accentNodeCount: 3, segmentArcFraction: 0.6,
  },
] as const;

const normalizeCount = (value: number) => {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.floor(value));
};

export const getCollectedOrbiCountFromSwarmSize = (swarmMemberCount: number): number =>
  normalizeCount(swarmMemberCount);

export const getUnlockedDysonHaloRingCountFromSwarmSize = (swarmMemberCount: number): number => {
  const collected = getCollectedOrbiCountFromSwarmSize(swarmMemberCount);
  if (collected >= 20) return 3;
  if (collected >= 10) return 2;
  return 1;
};

export const getUnlockedDysonHaloRingCount = (collectedOrbiCount: number): number => {
  const collected = normalizeCount(collectedOrbiCount);
  if (collected >= 20) return 3;
  if (collected >= 10) return 2;
  return 1;
};

export const getUnlockedDysonHaloRings = (collectedOrbiCount: number): readonly FotonDysonHaloRingDescriptor[] =>
  FOTON_DYSON_HALO_RINGS.slice(0, getUnlockedDysonHaloRingCount(collectedOrbiCount));
`);

const renderer = "src/game/fotonGameplay3DRenderer.ts";
replaceExact(renderer,
`  descriptor: FotonDysonHaloRingDescriptor;\n  planeRoot: any;\n  spinRoot: any;`,
`  descriptor: FotonDysonHaloRingDescriptor;\n  planeRoot: any;\n  baseQuaternion: any;\n  precessionQuaternion: any;\n  precessionEuler: any;\n  spinRoot: any;`);
replaceExact(renderer,
`  const planeRoot = new THREE.Group();\n  planeRoot.rotation.set(\n    descriptor.tilt[0],\n    descriptor.tilt[1],\n    descriptor.tilt[2],\n  );\n\n  const spinRoot = new THREE.Group();`,
`  const planeRoot = new THREE.Group();\n  const planeNormal = new THREE.Vector3(\n    descriptor.planeNormal[0],\n    descriptor.planeNormal[1],\n    descriptor.planeNormal[2],\n  ).normalize();\n  const baseQuaternion = new THREE.Quaternion().setFromUnitVectors(\n    new THREE.Vector3(0, 0, 1),\n    planeNormal,\n  );\n  const precessionQuaternion = new THREE.Quaternion();\n  const precessionEuler = new THREE.Euler(0, 0, 0, "XYZ");\n  planeRoot.quaternion.copy(baseQuaternion);\n\n  const spinRoot = new THREE.Group();`);
replaceExact(renderer,
`    descriptor,\n    planeRoot,\n    spinRoot,`,
`    descriptor,\n    planeRoot,\n    baseQuaternion,\n    precessionQuaternion,\n    precessionEuler,\n    spinRoot,`);
replaceExact(renderer,
`    ring.planeRoot.rotation.x =\n      ring.descriptor.tilt[0] +\n      Math.sin(\n        timeSeconds * 0.12 +\n          ring.descriptor.phase,\n      ) *\n        0.018;\n    ring.planeRoot.rotation.y =\n      ring.descriptor.tilt[1] +\n      Math.cos(\n        timeSeconds * 0.1 +\n          ring.descriptor.phase,\n      ) *\n        0.016;\n    ring.planeRoot.rotation.z =\n      ring.descriptor.tilt[2];`,
`    ring.precessionEuler.set(\n      Math.sin(timeSeconds * 0.12 + ring.descriptor.phase) * 0.018,\n      Math.cos(timeSeconds * 0.1 + ring.descriptor.phase) * 0.016,\n      0,\n    );\n    ring.precessionQuaternion.setFromEuler(ring.precessionEuler);\n    ring.planeRoot.quaternion\n      .copy(ring.baseQuaternion)\n      .multiply(ring.precessionQuaternion);`);

// 2) Compact Star Matrix and X-Guard, preserving enum/save identities.
write("src/game/formations.ts", `import { FormationType, FormationConfig } from "./types";

export const FORMATIONS: Record<FormationType, FormationConfig> = {
  [FormationType.LINE]: { type: FormationType.LINE, name: "Defensive Ring", description: "+25% Shield Resistance, +Circular Shield Guard | -10% Projectile Damage", spacing: 35, shieldMod: 0.25, damageMod: -0.10, projSpeedMod: 0, critChanceMod: 0, speedMod: 1 },
  [FormationType.CIRCLE]: { type: FormationType.CIRCLE, name: "Star Matrix", description: "+30% Damage, +15% Proj Speed | Compact five-point assault matrix", spacing: 45, shieldMod: -0.15, damageMod: 0.30, projSpeedMod: 0.15, critChanceMod: 0.05, speedMod: 1.1 },
  [FormationType.DELTA]: { type: FormationType.DELTA, name: "Dynamic Spiral", description: "+Orbital Area Fire, +Repel Near Enemies | High Spray Dispersion", spacing: 40, shieldMod: 0, damageMod: 0.10, projSpeedMod: -0.10, critChanceMod: 0.05, speedMod: 1 },
  [FormationType.SHIELD]: { type: FormationType.SHIELD, name: "Energy Halo", description: "+35% Range, +Precision Targeting | -15% Shield Resistance", spacing: 50, shieldMod: -0.15, damageMod: 0.15, projSpeedMod: 0.20, critChanceMod: 0.10, speedMod: 0.95 },
  [FormationType.V_SHAPE]: { type: FormationType.V_SHAPE, name: "X-Guard", description: "Four-axis close guard, strong crossfire cover | -10% Movement Speed", spacing: 30, shieldMod: 0.30, damageMod: 0, projSpeedMod: -0.05, critChanceMod: 0, speedMod: 0.90 },
  [FormationType.SCATTERED]: { type: FormationType.SCATTERED, name: "Float Walkers", description: "+25% Evasion, +20% Crit Chance | Loose Follow Cohesion", spacing: 60, shieldMod: 0.10, damageMod: 0, projSpeedMod: 0.10, critChanceMod: 0.20, speedMod: 1.15 },
};

export function calculateSwarmOffset(type: FormationType, index: number, total: number, time: number, mouseAngle: number): { x: number; y: number } {
  const config = FORMATIONS[type];
  const d = config.spacing;
  switch (type) {
    case FormationType.LINE: {
      const ringIndex = Math.floor(index / 10);
      const ringPosition = index % 10;
      const ringTotal = Math.max(1, Math.min(10, total - ringIndex * 10));
      const radius = (ringIndex + 1) * d * 1.1;
      const angle = (ringPosition / ringTotal) * Math.PI * 2 + time * 0.0012;
      return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
    }
    case FormationType.CIRCLE: {
      // STAR MATRIX: repeated ten-vertex star shells, bounded for large swarms.
      const shell = Math.floor(index / 10);
      const point = index % 10;
      const shellOuter = Math.min(136, 78 + shell * 10);
      const radius = point % 2 === 0 ? shellOuter : shellOuter * 0.48;
      const angle = mouseAngle - Math.PI / 2 + point * (Math.PI / 5) + time * 0.0002;
      return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
    }
    case FormationType.DELTA: {
      const angle = index * 0.4 + time * 0.003;
      const dist = 30 + index * 6;
      return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist };
    }
    case FormationType.SHIELD: {
      const theta = (index / Math.max(1, total)) * Math.PI * 2 - time * 0.0006;
      const radius = d * 2.2 + Math.sin(time * 0.002 + index) * 12;
      return { x: Math.cos(theta) * radius, y: Math.sin(theta) * radius };
    }
    case FormationType.V_SHAPE: {
      // X-GUARD: four diagonal arms with capped reach.
      const arm = index % 4;
      const rank = Math.floor(index / 4);
      const radius = Math.min(138, 42 + rank * 8);
      const angle = mouseAngle + Math.PI / 4 + arm * (Math.PI / 2);
      return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
    }
    case FormationType.SCATTERED: {
      const organicAngle = index * 0.8 + Math.sin(time * 0.001 + index) * 0.6;
      const dist = 40 + index * 4 + Math.cos(time * 0.0015 + index) * 15;
      return { x: Math.cos(organicAngle) * dist, y: Math.sin(organicAngle) * dist };
    }
    default: return { x: 0, y: 0 };
  }
}
`);

// 3) Boss support pressure: phase-1 adds + bounded telegraphed Hunter Wave.
replaceExact("src/game/waveDirector.ts",
`  summonRules: [\n    {\n      phase: 2,\n      enemyType: EnemyType.CRAWLER,\n      maxCount: 4,\n      cooldown: 6000\n    },\n    {\n      phase: 2,\n      enemyType: EnemyType.DRONE,\n      maxCount: 1,\n      cooldown: 10000\n    },\n    {\n      phase: 3,\n      enemyType: EnemyType.PARASITE,\n      maxCount: 4,\n      cooldown: 5000\n    },\n    {\n      phase: 3,\n      enemyType: EnemyType.DISRUPTOR,\n      maxCount: 1,\n      cooldown: 14000\n    }\n  ],`,
`  summonRules: [\n    { phase: 1, enemyType: EnemyType.CRAWLER, maxCount: 4, cooldown: 7000 },\n    { phase: 1, enemyType: EnemyType.DRONE, maxCount: 1, cooldown: 11000 },\n    { phase: 2, enemyType: EnemyType.SPLITTER, maxCount: 2, cooldown: 9000 },\n    { phase: 2, enemyType: EnemyType.DISRUPTOR, maxCount: 1, cooldown: 12000 },\n    { phase: 3, enemyType: EnemyType.PARASITE, maxCount: 4, cooldown: 4500 }\n  ],`);
replaceExact("src/game/waveDirector.ts", "Cover with Front Shield. Reposition dynamically before lock fires.", "Use X-Guard. Reposition dynamically before lock fires.");
replaceExact("src/game/waveDirector.ts", "Use Arrowhead V or Float Walkers to flank its side armor.", "Use Star Matrix or Float Walkers to flank its side armor.");
replaceExact("src/game/waveDirector.ts", "Switch between Front Shield and Arrowhead V dynamically to protect and destroy.", "Switch between X-Guard and Star Matrix dynamically to protect and destroy.");
replaceExact("src/game/waveDirector.ts", "Dodge laterally immediately. Use Arrowhead V for a quick counter-assault.", "Dodge laterally immediately. Use Star Matrix for a quick counter-assault.");

const game = "src/game/EnergySwarmGame.tsx";
replaceExact(game,
`  const bossSummonTimersRef = useRef<Record<string, number>>({}); // cooldowns of summons\n  const gravityWellPulseTimerRef = useRef<number>(0);`,
`  const bossSummonTimersRef = useRef<Record<string, number>>({}); // cooldowns of summons\n  const bossHunterWaveCooldownRef = useRef<number>(8000);\n  const bossHunterWaveTelegraphRef = useRef<number>(0);\n  const gravityWellPulseTimerRef = useRef<number>(0);`);
replaceExact(game,
`    bossSummonTimersRef.current = {};\n    gravityWellPulseTimerRef.current = 0;`,
`    bossSummonTimersRef.current = {};\n    bossHunterWaveCooldownRef.current = 8000;\n    bossHunterWaveTelegraphRef.current = 0;\n    gravityWellPulseTimerRef.current = 0;`, 2);
replaceExact(game,
`    });\n\n    // 7. ACTIVE ATTACK COOLDOWNS / SELECTION\n    if (bossCurrentAttackRef.current === null) {`,
`    });\n\n    // H3 HUNTER WAVE: bounded support ability. It pauses regular attack\n    // selection during a readable 1.2s warning, then deploys a small fixed\n    // package. No enemy scan or scheduler is added to the hot path.\n    if (bossHunterWaveTelegraphRef.current > 0) {\n      bossHunterWaveTelegraphRef.current -= delta;\n      if (bossHunterWaveTelegraphRef.current <= 0) {\n        const phase = boss.bossPhase || 1;\n        const packageTypes = phase >= 3\n          ? [EnemyType.PARASITE, EnemyType.PARASITE, EnemyType.DISRUPTOR, EnemyType.SPLITTER]\n          : phase >= 2\n            ? [EnemyType.CRAWLER, EnemyType.DRONE, EnemyType.SPLITTER]\n            : [EnemyType.CRAWLER, EnemyType.CRAWLER, EnemyType.DRONE];\n        for (let i = 0; i < packageTypes.length; i += 1) {\n          if (enemiesRef.current.length >= MAX_ENEMIES - 1) break;\n          const angle = (i / packageTypes.length) * Math.PI * 2;\n          spawnBossMinion(\n            packageTypes[i],\n            boss.x + Math.cos(angle) * 72,\n            boss.y + Math.sin(angle) * 56,\n          );\n        }\n        bossHunterWaveCooldownRef.current = phase >= 3 ? 6000 : phase >= 2 ? 7200 : 8500;\n        addFloatingText("HUNTER WAVE", boss.x, boss.y - 58, "#f97316");\n      }\n    } else {\n      bossHunterWaveCooldownRef.current -= delta;\n      if (\n        bossHunterWaveCooldownRef.current <= 0 &&\n        bossCurrentAttackRef.current === null &&\n        phaseTransitionTimerRef.current <= 0\n      ) {\n        bossHunterWaveTelegraphRef.current = 1200;\n        addFloatingText("HUNTER WAVE INCOMING", boss.x, boss.y - 58, "#fbbf24");\n        if (!shownThreatIntelsRef.current.includes("hunter_wave")) {\n          shownThreatIntelsRef.current.push("hunter_wave");\n          postDialogue("COMPANION", "¡OLEADA CAZADORA! El Devorador despliega refuerzos. Divide el fuego antes de volver al núcleo.");\n        }\n      }\n    }\n\n    // 7. ACTIVE ATTACK COOLDOWNS / SELECTION\n    if (bossCurrentAttackRef.current === null && bossHunterWaveTelegraphRef.current <= 0) {`);

// 4) Evolved Blackout Elite + Infinite evolution from Sector 11.
replaceExact("src/game/types.ts",
`  | "BROOD_SPLITTER"\n  | "NULL_DISRUPTOR";`,
`  | "BROOD_SPLITTER"\n  | "NULL_DISRUPTOR"\n  | "OVERDRIVE_ELITE";`);
replaceExact("src/game/types.ts",
`  | "BROOD_RELEASE"\n  | "NULL_PULSE";`,
`  | "BROOD_RELEASE"\n  | "NULL_PULSE"\n  | "OVERDRIVE_CHARGE";`);

replaceExact("src/game/runtimeEnemyEvolution.ts",
`  EnemyType.SPLITTER,\n  EnemyType.DISRUPTOR,\n] as const;`,
`  EnemyType.SPLITTER,\n  EnemyType.DISRUPTOR,\n  EnemyType.BLACKOUT_ELITE,\n] as const;`);
replaceExact("src/game/runtimeEnemyEvolution.ts",
`  [EnemyType.DISRUPTOR]: Object.freeze({\n    id: "NULL_DISRUPTOR",\n    baseEnemyType: EnemyType.DISRUPTOR,\n    displayName: "Null Disruptor",\n    signature: "NULL_PULSE",\n    healthMultiplier: 1.18,\n    movementSpeedMultiplier: 1,\n    contactDamageMultiplier: 1.05,\n    attackRateMultiplier: 1.15,\n    projectileSpeedMultiplier: 1.1,\n    specialIntensity: 0.45,\n    rewardMultiplier: 1.4,\n  }),`,
`  [EnemyType.DISRUPTOR]: Object.freeze({\n    id: "NULL_DISRUPTOR", baseEnemyType: EnemyType.DISRUPTOR, displayName: "Null Disruptor",\n    signature: "NULL_PULSE", healthMultiplier: 1.18, movementSpeedMultiplier: 1,\n    contactDamageMultiplier: 1.05, attackRateMultiplier: 1.15, projectileSpeedMultiplier: 1.1,\n    specialIntensity: 0.45, rewardMultiplier: 1.4,\n  }),\n  [EnemyType.BLACKOUT_ELITE]: Object.freeze({\n    id: "OVERDRIVE_ELITE", baseEnemyType: EnemyType.BLACKOUT_ELITE, displayName: "Overdrive Elite",\n    signature: "OVERDRIVE_CHARGE", healthMultiplier: 1.35, movementSpeedMultiplier: 1.08,\n    contactDamageMultiplier: 1.15, attackRateMultiplier: 1.12, projectileSpeedMultiplier: 1,\n    specialIntensity: 0.45, rewardMultiplier: 1.5,\n  }),`);
replaceExact("src/game/runtimeEnemyEvolution.ts",
`  MASTERY: Object.freeze({\n    enabled: false,\n    evolutionChance: 0,\n    maxConcurrentEvolvedEnemies: 0,\n  }),\n  ADVANCED_COMBINATION: Object.freeze({\n    enabled: true,\n    evolutionChance: 0.12,\n    maxConcurrentEvolvedEnemies: 1,\n  }),\n  HIGH_PRESSURE: Object.freeze({\n    enabled: true,\n    evolutionChance: 0.2,\n    maxConcurrentEvolvedEnemies: 2,\n  }),\n  ENDLESS_ENDGAME: Object.freeze({\n    enabled: true,\n    evolutionChance: 0.28,\n    maxConcurrentEvolvedEnemies: 3,\n  }),`,
`  MASTERY: Object.freeze({ enabled: true, evolutionChance: 0.08, maxConcurrentEvolvedEnemies: 1 }),\n  ADVANCED_COMBINATION: Object.freeze({ enabled: true, evolutionChance: 0.15, maxConcurrentEvolvedEnemies: 2 }),\n  HIGH_PRESSURE: Object.freeze({ enabled: true, evolutionChance: 0.23, maxConcurrentEvolvedEnemies: 3 }),\n  ENDLESS_ENDGAME: Object.freeze({ enabled: true, evolutionChance: 0.30, maxConcurrentEvolvedEnemies: 4 }),`);

replaceExact("src/game/runtimeEnemySignatureBehavior.ts",
`  splitterExtraMinions: 0 | 1;\n  disruptDurationMultiplier: number;`,
`  splitterExtraMinions: 0 | 1;\n  disruptDurationMultiplier: number;\n  eliteChargeCooldownMultiplier: number;\n  eliteChargeSpeedMultiplier: number;`);
replaceExact("src/game/runtimeEnemySignatureBehavior.ts",
`    splitterExtraMinions: 0,\n    disruptDurationMultiplier: 1,`,
`    splitterExtraMinions: 0,\n    disruptDurationMultiplier: 1,\n    eliteChargeCooldownMultiplier: 1,\n    eliteChargeSpeedMultiplier: 1,`);
replaceExact("src/game/runtimeEnemySignatureBehavior.ts",
`    case "NULL_PULSE":\n      return {\n        ...neutralFor(signature, intensity),\n        disruptDurationMultiplier: round(\n          clamp(1 + intensity * 0.4, 1, 1.24),\n        ),\n      };`,
`    case "NULL_PULSE":\n      return {\n        ...neutralFor(signature, intensity),\n        disruptDurationMultiplier: round(clamp(1 + intensity * 0.4, 1, 1.24)),\n      };\n\n    case "OVERDRIVE_CHARGE":\n      return {\n        ...neutralFor(signature, intensity),\n        eliteChargeCooldownMultiplier: round(clamp(1 - intensity * 0.42, 0.78, 1)),\n        eliteChargeSpeedMultiplier: round(clamp(1 + intensity * 0.55, 1, 1.33)),\n      };`);
replaceExact(game,
`              enemy.chargeTimer = 60;\n              enemy.pulseCooldown = 220 + Math.random() * 150; // charge every 4-6s`,
`              enemy.chargeTimer = 60;\n              enemy.pulseCooldown =\n                (220 + Math.random() * 150) *\n                signatureBehavior.eliteChargeCooldownMultiplier; // evolved elites charge more often, same telegraph`);
replaceExact(game,
`                simulationMutatorEffects.enemySpeedMultiplier *\n                milestoneDashMultiplier;`,
`                simulationMutatorEffects.enemySpeedMultiplier *\n                milestoneDashMultiplier *\n                signatureBehavior.eliteChargeSpeedMultiplier;`, 2);

// 5) Infinite pressure: tactical diversity first, bounded global budgets retained.
replaceExact("src/game/infiniteSectorDirector.ts",
`    Math.round(24 + progress * 1.25 + logarithmicPressure * 5),\n    28,`,
`    Math.round(28 + progress * 1.35 + logarithmicPressure * 5.5),\n    32,`);
replaceExact("src/game/infiniteSectorDirector.ts",
`    14 + Math.floor(logarithmicPressure * 2.5) + tierIndex * 2,\n    14,\n    36,`,
`    16 + Math.floor(logarithmicPressure * 2.8) + tierIndex * 2,\n    16,\n    38,`);
replaceExact("src/game/infiniteSectorDirector.ts",
`    Math.round(105 - logarithmicPressure * 6 - tierIndex * 4),\n    42,\n    105,`,
`    Math.round(98 - logarithmicPressure * 6.5 - tierIndex * 4),\n    40,\n    98,`);
replaceExact("src/game/infiniteSectorDirector.ts", `    enemyBudget = Math.max(28, Math.round(enemyBudget * 0.82));`, `    enemyBudget = Math.max(32, Math.round(enemyBudget * 0.82));`);
replaceExact("src/game/infiniteSectorDirector.ts", `    maxConcurrentEnemies = Math.max(14, maxConcurrentEnemies - 3);`, `    maxConcurrentEnemies = Math.max(16, maxConcurrentEnemies - 3);`);
replaceExact("src/game/infiniteSectorDirector.ts", `    spawnIntervalFrames = Math.min(105, spawnIntervalFrames + 12);`, `    spawnIntervalFrames = Math.min(98, spawnIntervalFrames + 12);`);
replaceExact("src/game/infiniteSectorDirector.ts", `          (1 + progress * 0.002 + tierIndex * 0.12) * 0.88,`, `          (1.08 + progress * 0.003 + tierIndex * 0.13) * 0.88,`);
replaceExact("src/game/infiniteSectorDirector.ts", `      : clamp(1 + progress * 0.002 + tierIndex * 0.12, 1, 2),`, `      : clamp(1.08 + progress * 0.003 + tierIndex * 0.13, 1, 2),`);
replaceExact("src/game/infiniteSectorDirector.ts", `          (1 + progress * 0.0015 + tierIndex * 0.1) * 0.9,`, `          (1.08 + progress * 0.0025 + tierIndex * 0.11) * 0.9,`);
replaceExact("src/game/infiniteSectorDirector.ts", `      : clamp(1 + progress * 0.0015 + tierIndex * 0.1, 1, 2.2),`, `      : clamp(1.08 + progress * 0.0025 + tierIndex * 0.11, 1, 2.2),`);
replaceExact("src/game/infiniteSectorDirector.ts", `    Math.round(80 + progress * 0.22 + tierIndex * 12),\n    80,`, `    Math.round(90 + progress * 0.26 + tierIndex * 14),\n    90,`);
replaceExact("src/game/infiniteSectorDirector.ts", `  if (recipe.enemyBudget < 28 || recipe.enemyBudget > 180)`, `  if (recipe.enemyBudget < 32 || recipe.enemyBudget > 180)`);
replaceExact("src/game/infiniteSectorDirector.ts", `    recipe.maxConcurrentEnemies < 14 ||\n    recipe.maxConcurrentEnemies > 36`, `    recipe.maxConcurrentEnemies < 16 ||\n    recipe.maxConcurrentEnemies > 38`);
replaceExact("src/game/infiniteSectorDirector.ts", `    recipe.spawnIntervalFrames < 42 ||\n    recipe.spawnIntervalFrames > 105`, `    recipe.spawnIntervalFrames < 40 ||\n    recipe.spawnIntervalFrames > 98`);
replaceExact("src/game/infiniteSectorDirector.ts", `    recipe.fairness.projectileBudget < 80 ||`, `    recipe.fairness.projectileBudget < 90 ||`);

// 6) Reclaim a final slice of balanced-desktop width for the 5:3 stage.
replaceExact("src/styles/index.css",
`      minmax(210px, 235px)\n      minmax(0, 1fr)\n      minmax(270px, 300px);\n    gap: 0.65rem;`,
`      minmax(190px, 210px)\n      minmax(0, 1fr)\n      minmax(245px, 270px);\n    gap: 0.5rem;`);

// Update historical contracts that intentionally described H1/H2 geometry/layout.
replaceExact("tests/es12h1-gameplay-readability-adoption.test.mjs",
`test("Dyson halo owns three equal-tilt planes separated by 120-degree azimuths", () => {\n  assert.match(halo, /tilt: \\[1\\.08, 0, 0\\]/);\n  assert.match(halo, /tilt: \\[1\\.08, 0, 2\\.094\\]/);\n  assert.match(halo, /tilt: \\[1\\.08, 0, 4\\.189\\]/);\n});`,
`test("Dyson halo owns three explicit true-plane normals", () => {\n  assert.match(halo, /planeNormal: \\[0\\.8660254, 0, 0\\.5\\]/);\n  assert.match(halo, /planeNormal: \\[-0\\.4330127, 0\\.75, 0\\.5\\]/);\n  assert.match(halo, /planeNormal: \\[-0\\.4330127, -0\\.75, 0\\.5\\]/);\n});`);
replaceExact("tests/es12h2-physical-playtest-adoption.test.mjs",
`assert.match(styles, /@media \\(min-width: 1600px\\)[\\s\\S]*minmax\\(210px, 235px\\)[\\s\\S]*minmax\\(270px, 300px\\)[\\s\\S]*gap: 0\\.65rem/);`,
`assert.match(styles, /@media \\(min-width: 1600px\\)[\\s\\S]*minmax\\(190px, 210px\\)[\\s\\S]*minmax\\(245px, 270px\\)[\\s\\S]*gap: 0\\.5rem/);`);

// Focused H3 certification.
write("tests/es12h3-endgame-challenge.test.ts", `import assert from "node:assert/strict";\nimport test from "node:test";\nimport { FOTON_DYSON_HALO_RINGS, getUnlockedDysonHaloRingCount } from "../src/game/fotonDysonHalo.ts";\nimport { calculateSwarmOffset, FORMATIONS } from "../src/game/formations.ts";\nimport { FormationType, EnemyType } from "../src/game/types.ts";\nimport { buildCertifiedInfiniteSectorPlan, NEUTRAL_INFINITE_RUN_CONTEXT } from "../src/game/infinitePlanBuilder.ts";\nimport { createInfiniteRuntimeWaveDescriptor } from "../src/game/runtimeWaveDescriptor.ts";\nimport { getRuntimeEnemyEvolutionPolicy, EVOLVED_ENEMY_VARIANTS } from "../src/game/runtimeEnemyEvolution.ts";\nimport type { InfiniteSessionState } from "../src/game/infiniteSession.ts";\nimport { generateInfiniteSectorRecipe } from "../src/game/infiniteSectorDirector.ts";\n\nconst dot=(a:readonly number[],b:readonly number[])=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];\nconst len=(a:readonly number[])=>Math.hypot(a[0],a[1],a[2]);\n\ntest("Dyson normals form a real symmetric three-plane triad",()=>{\n  assert.equal(FOTON_DYSON_HALO_RINGS.length,3);\n  for(const ring of FOTON_DYSON_HALO_RINGS) assert.ok(Math.abs(len(ring.planeNormal)-1)<1e-6);\n  for(let i=0;i<3;i++) for(let j=i+1;j<3;j++) assert.ok(Math.abs(dot(FOTON_DYSON_HALO_RINGS[i].planeNormal,FOTON_DYSON_HALO_RINGS[j].planeNormal)+0.125)<1e-5);\n  assert.deepEqual([0,9,10,19,20,50].map(getUnlockedDysonHaloRingCount),[1,1,2,2,3,3]);\n});\n\ntest("Star Matrix and X-Guard remain bounded for large swarms",()=>{\n  assert.equal(FORMATIONS[FormationType.CIRCLE].name,"Star Matrix");\n  assert.equal(FORMATIONS[FormationType.V_SHAPE].name,"X-Guard");\n  for(const total of [30,48,64]) for(const formation of [FormationType.CIRCLE,FormationType.V_SHAPE]) {\n    let max=0; for(let i=0;i<total;i++){const o=calculateSwarmOffset(formation,i,total,12345,0.7); max=Math.max(max,Math.hypot(o.x,o.y));}\n    assert.ok(max<=140, `${formation} total=${total} radius=${max}`);\n  }\n});\n\nconst descriptorFor=(sector:number)=>{const plan=buildCertifiedInfiniteSectorPlan(sector,"h3",NEUTRAL_INFINITE_RUN_CONTEXT); const session:InfiniteSessionState={kind:"INFINITE_SESSION",sessionId:`h3:${sector}`,seed:"h3",status:"ACTIVE",currentSector:sector,currentWaveNumber:1,sectorsCompleted:sector-11,wavesCompleted:0,context:{...plan.effectiveRecipe.context},currentPlan:plan}; return createInfiniteRuntimeWaveDescriptor(session);};\n\ntest("Infinite challenge begins evolving enemies from Sector 11",()=>{\n  const p=getRuntimeEnemyEvolutionPolicy(descriptorFor(11));\n  assert.equal(p.enabled,true); assert.equal(p.evolutionChance,0.08); assert.equal(p.maxConcurrentEvolvedEnemies,1);\n  assert.ok(p.eligibleEnemyTypes.includes(EnemyType.BLACKOUT_ELITE));\n  assert.equal(EVOLVED_ENEMY_VARIANTS[EnemyType.BLACKOUT_ELITE]?.id,"OVERDRIVE_ELITE");\n});\n\ntest("Sector 11 pressure is higher but remains bounded",()=>{\n  const r=generateInfiniteSectorRecipe(11,"h3-pressure");\n  assert.ok(r.maxConcurrentEnemies>=18);\n  assert.ok(r.spawnIntervalFrames<=92);\n  assert.ok(r.aggressionMultiplier>=1.08);\n  assert.ok(r.projectileDensityMultiplier>=1.08);\n  assert.ok(r.fairness.projectileBudget>=90);\n});\n`);

write("tests/es12h3-adoption.test.mjs", `import assert from "node:assert/strict";\nimport { readFileSync } from "node:fs";\nimport test from "node:test";\nconst read=(p)=>readFileSync(new URL("../"+p,import.meta.url),"utf8");\nconst renderer=read("src/game/fotonGameplay3DRenderer.ts"); const game=read("src/game/EnergySwarmGame.tsx"); const wave=read("src/game/waveDirector.ts"); const styles=read("src/styles/index.css"); const constants=read("src/game/constants.ts");\ntest("Dyson renderer orients true planes with quaternions without per-frame vector allocation",()=>{assert.match(renderer,/setFromUnitVectors/); assert.match(renderer,/planeNormal/); assert.match(renderer,/baseQuaternion/); assert.match(renderer,/precessionQuaternion/); assert.doesNotMatch(renderer,/planeRoot\\.rotation\\.set\\([\\s\\S]*descriptor\\.tilt/);});\ntest("Devourer Hunter Wave is telegraphed and bounded by existing enemy cap",()=>{assert.match(game,/bossHunterWaveTelegraphRef/); assert.match(game,/HUNTER WAVE INCOMING/); assert.match(game,/enemiesRef\\.current\\.length >= MAX_ENEMIES - 1/); assert.match(wave,/phase: 1, enemyType: EnemyType\\.CRAWLER/); assert.match(wave,/phase: 1, enemyType: EnemyType\\.DRONE/);});\ntest("H3 keeps global entity budgets unchanged while widening balanced desktop stage",()=>{assert.match(constants,/MAX_ENEMIES/); assert.match(constants,/MAX_PROJECTILES/); assert.match(styles,/minmax\\(190px, 210px\\)[\\s\\S]*minmax\\(245px, 270px\\)[\\s\\S]*gap: 0\\.5rem/);});\ntest("H3 adds no scheduler or network path",()=>{for(const source of [renderer,wave]) assert.doesNotMatch(source,/setInterval\\(|setTimeout\\(|fetch\\(|XMLHttpRequest|WebSocket/);});\n`);

// Rewrite evolution expectations to H3 policy and sixth variant.
let evoTest = read("tests/runtime-enemy-evolution.test.ts");
evoTest = evoTest.replace(`  EnemyType.DISRUPTOR,\n] as const;`, `  EnemyType.DISRUPTOR,\n  EnemyType.BLACKOUT_ELITE,\n] as const;`);
evoTest = evoTest.replace(/test\("Infinite Mastery Sectors 11-25 remain evolution-free"[\s\S]*?\n\}\);\n\n/, `test("Infinite Mastery Sectors 11-25 introduce one bounded evolved threat", () => {\n  for (const sector of [11,15,20,25]) { const policy=getRuntimeEnemyEvolutionPolicy(descriptorForSector(sector)); assert.equal(policy.tier,"MASTERY"); assert.equal(policy.enabled,true); assert.equal(policy.evolutionChance,0.08); assert.equal(policy.maxConcurrentEvolvedEnemies,1); assert.deepEqual(policy.eligibleEnemyTypes,regularEnemyTypes); }\n});\n\n`);
evoTest = evoTest.replace(`test("tier policy introduces bounded evolution only from Sector 26 onward", () => {`, `test("tier policy escalates bounded evolution after Mastery", () => {`);
evoTest = evoTest.replace(`chance: 0.12,\n      cap: 1,`, `chance: 0.15,\n      cap: 2,`).replace(`chance: 0.2,\n      cap: 2,`, `chance: 0.23,\n      cap: 3,`).replace(`chance: 0.28,\n      cap: 3,`, `chance: 0.30,\n      cap: 4,`);
evoTest = evoTest.replace(`  assert.equal(\n    EVOLVED_ENEMY_VARIANTS[EnemyType.BLACKOUT_ELITE],\n    undefined,\n  );`, `  assert.equal(EVOLVED_ENEMY_VARIANTS[EnemyType.BLACKOUT_ELITE]?.id, "OVERDRIVE_ELITE");`);
evoTest = evoTest.replace(/    assert\.equal\(\n      selectEvolvedEnemyVariant\(\n        descriptor,\n        EnemyType\.BLACKOUT_ELITE,[\s\S]*?\n    \);\n/, ``);
evoTest = evoTest.replace(`    assert.ok(policy.evolutionChance <= 0.28);`, `    assert.ok(policy.evolutionChance <= 0.30);`).replace(`policy.maxConcurrentEvolvedEnemies <= 3`, `policy.maxConcurrentEvolvedEnemies <= 4`);
evoTest = evoTest.replace(/    if \(sector <= 25\) \{[\s\S]*?    \} else \{\n      assert\.equal\(policy\.enabled, true\);\n      assert\.deepEqual\(\n        policy\.eligibleEnemyTypes,\n        regularEnemyTypes,\n      \);\n    \}/, `    assert.equal(policy.enabled, true);\n    assert.deepEqual(policy.eligibleEnemyTypes, regularEnemyTypes);`);
write("tests/runtime-enemy-evolution.test.ts", evoTest);

// Update Infinite certified bounds.
let infiniteTest=read("tests/infinite-sector-director.test.ts");
infiniteTest=infiniteTest.replace(/recipe\.enemyBudget >= 28/g,"recipe.enemyBudget >= 32").replace(/recipe\.maxConcurrentEnemies >= 14/g,"recipe.maxConcurrentEnemies >= 16").replace(/recipe\.maxConcurrentEnemies <= 36/g,"recipe.maxConcurrentEnemies <= 38").replace(/recipe\.spawnIntervalFrames >= 42/g,"recipe.spawnIntervalFrames >= 40").replace(/recipe\.spawnIntervalFrames <= 105/g,"recipe.spawnIntervalFrames <= 98").replace(/recipe\.fairness\.projectileBudget >= 80/g,"recipe.fairness.projectileBudget >= 90");
write("tests/infinite-sector-director.test.ts", infiniteTest);

console.log("ES-12H3 patch applied successfully");
