import fs from "node:fs";

const read = (path) => fs.readFileSync(path, "utf8");
const write = (path, value) => fs.writeFileSync(path, value, "utf8");

const replaceExact = (path, from, to, expected = 1) => {
  const source = read(path);
  const count = source.split(from).length - 1;
  if (count !== expected) {
    throw new Error(`${path}: expected ${expected} exact matches, found ${count}\nANCHOR:\n${from.slice(0, 260)}`);
  }
  write(path, source.split(from).join(to));
};

const replaceFirstRegex = (path, pattern, replacer) => {
  const source = read(path);
  const match = source.match(pattern);
  if (!match) throw new Error(`${path}: regex anchor not found: ${pattern}`);
  write(path, source.replace(pattern, replacer));
};

// 1) Canonical global limits and enemy vocabulary.
replaceExact(
  "src/game/constants.ts",
  "export const MAX_SWARM_MEMBERS = 100;",
  "export const MAX_SWARM_MEMBERS = 30;",
);
replaceExact(
  "src/game/constants.ts",
  "Swarm capacity +12 per level (36/48/60 Max) & +10% follow speed",
  "Command propulsion +10% and improved follower response per level; swarm capacity is earned through veterancy (10→20→30)",
);
replaceExact(
  "src/game/types.ts",
  `  BLACKOUT_ELITE = "BLACKOUT_ELITE",\n  BOSS_DEVOURER = "BOSS_DEVOURER"`,
  `  BLACKOUT_ELITE = "BLACKOUT_ELITE",\n  RIFT_HUNTER = "RIFT_HUNTER",\n  SIEGE_PRISM = "SIEGE_PRISM",\n  SWARM_REAVER = "SWARM_REAVER",\n  VOID_ANCHOR = "VOID_ANCHOR",\n  MINE_WEAVER = "MINE_WEAVER",\n  MIRROR_WARDEN = "MIRROR_WARDEN",\n  BOSS_DEVOURER = "BOSS_DEVOURER"`,
);

// 2) Apply H4 only when the live game supplies a follower count. Existing
// deterministic descriptor tests that omit it keep the historical descriptor.
replaceExact(
  "src/game/runtimeProjectionBundleCache.ts",
  `import type { RuntimeWaveDescriptor } from "./runtimeWaveDescriptor";`,
  `import type { RuntimeWaveDescriptor } from "./runtimeWaveDescriptor";\nimport { applyAdaptiveInvasionToDescriptor } from "./adaptiveInvasionRuntime";`,
);
replaceExact(
  "src/game/runtimeProjectionBundleCache.ts",
  `export const getCachedRuntimeProjectionBundle = (\n  cache: RuntimeProjectionBundleCache,\n  state: RuntimeProgressionState,\n): RuntimeProjectionBundle => {`,
  `export const getCachedRuntimeProjectionBundle = (\n  cache: RuntimeProjectionBundleCache,\n  state: RuntimeProgressionState,\n  liveFollowerCount?: number,\n): RuntimeProjectionBundle => {`,
);
replaceExact(
  "src/game/runtimeProjectionBundleCache.ts",
  `  const descriptor = resolveRuntimeWaveDescriptor(state);\n  const bundle: RuntimeProjectionBundle = {`,
  `  const baseDescriptor = resolveRuntimeWaveDescriptor(state);\n  const descriptor =\n    typeof liveFollowerCount === "number"\n      ? applyAdaptiveInvasionToDescriptor(baseDescriptor, liveFollowerCount)\n      : baseDescriptor;\n  const bundle: RuntimeProjectionBundle = {`,
);

const game = "src/game/EnergySwarmGame.tsx";

// 3) Doctrine imports and run state.
replaceExact(
  game,
  `} from "./gaiaEvolution";\nimport {\n  PERFORMANCE_EVIDENCE_TARGET_SAMPLES,`,
  `} from "./gaiaEvolution";\nimport {\n  createSwarmDoctrineState,\n  getSwarmDoctrineCapacity,\n  registerSwarmDoctrineLevel,\n  registerSwarmDoctrineMember,\n} from "./swarmDoctrine";\nimport {\n  PERFORMANCE_EVIDENCE_TARGET_SAMPLES,`,
);
replaceExact(
  game,
  `  const gaiaEvolutionRef = useRef(createGaiaEvolutionState());\n  const gaiaMemberRef = useRef<OrbiMember | null>(null);`,
  `  const gaiaEvolutionRef = useRef(createGaiaEvolutionState());\n  const gaiaMemberRef = useRef<OrbiMember | null>(null);\n  const swarmDoctrineRef = useRef(createSwarmDoctrineState());`,
);
replaceExact(
  game,
  `    gaiaEvolutionRef.current = createGaiaEvolutionState();\n    gaiaMemberRef.current = null;`,
  `    gaiaEvolutionRef.current = createGaiaEvolutionState();\n    gaiaMemberRef.current = null;\n    swarmDoctrineRef.current = createSwarmDoctrineState();`,
  1,
);

// Some builds contain the fresh-run reset twice. Patch a second occurrence if present.
{
  const source = read(game);
  const from = `    gaiaEvolutionRef.current = createGaiaEvolutionState();\n    gaiaMemberRef.current = null;`;
  if (source.includes(from)) {
    write(game, source.replace(from, `${from}\n    swarmDoctrineRef.current = createSwarmDoctrineState();`));
  }
}

// Runtime descriptors become swarm-aware once per progression state/wave.
replaceExact(
  game,
  `  const getCurrentRuntimeProjection = () =>\n    getCachedRuntimeProjectionBundle(\n      runtimeProjectionBundleCacheRef.current,\n      runtimeProgressionRef.current,\n    );`,
  `  const getCurrentRuntimeProjection = () =>\n    getCachedRuntimeProjectionBundle(\n      runtimeProjectionBundleCacheRef.current,\n      runtimeProgressionRef.current,\n      swarmRef.current.length,\n    );`,
);
replaceExact(
  game,
  `            getCachedRuntimeProjectionBundle(\n              runtimeProjectionBundleCacheRef.current,\n              nextRuntime,\n            ).descriptor;`,
  `            getCachedRuntimeProjectionBundle(\n              runtimeProjectionBundleCacheRef.current,\n              nextRuntime,\n              swarmRef.current.length,\n            ).descriptor;`,
);

// 4) Replace legacy Quantum Core capacity with earned doctrine slots.
replaceExact(
  game,
  `    const coreLevel = upgradesLevel.quantum_core || 0;\n    const capacityLimit = coreLevel >= 3 ? 60 : (coreLevel === 2 ? 48 : (coreLevel === 1 ? 36 : 24));\n\n    // GAIA is unique and does not consume a normal follower slot.\n    const regularSwarmCount = swarmRef.current.reduce(\n      (count, member) =>\n        count + (member.energyId === "GAIA" ? 0 : 1),\n      0,\n    );`,
  `    // H4 doctrine: every autonomous follower consumes a slot. Until GAIA\n    // awakens, one slot remains reserved so synthesis can never create an\n    // eleventh follower behind the capacity gate.\n    const doctrineCapacity = getSwarmDoctrineCapacity(swarmDoctrineRef.current);\n    const capacityLimit = Math.max(\n      0,\n      doctrineCapacity - (gaiaMemberRef.current ? 0 : 1),\n    );\n    const regularSwarmCount = swarmRef.current.length;`,
);
replaceExact(
  game,
  `    // Check capacity limit: evolve/consolidate an existing Orbi of the same affinity if full! (Section 1)`,
  `    // Capacity lock converts additional cores into veteran progression rather\n    // than raw bodies. This is the main H4 anti-snowball rule.`,
);

// When consolidation levels a member, promotion credit can unlock one slot.
replaceExact(
  game,
  `        const newLevel = Math.floor(newXp / 4) + 1;\n        targetOrbi.level = newLevel;`,
  `        const newLevel = Math.floor(newXp / 4) + 1;\n        targetOrbi.level = newLevel;\n        const doctrineCapacityBefore = getSwarmDoctrineCapacity(\n          swarmDoctrineRef.current,\n        );\n        swarmDoctrineRef.current = registerSwarmDoctrineLevel(\n          swarmDoctrineRef.current,\n          targetOrbi.id,\n          newLevel,\n        );\n        const doctrineCapacityAfter = getSwarmDoctrineCapacity(\n          swarmDoctrineRef.current,\n        );\n        if (doctrineCapacityAfter > doctrineCapacityBefore) {\n          postDialogue(\n            "SYSTEM",\n            `DOCTRINA DE ENJAMBRE: veterano L${newLevel} habilita slot ${doctrineCapacityAfter}/30.`,\n          );\n        }`,
);

// New normal member joins the doctrine ledger.
replaceExact(
  game,
  `    swarmRef.current.push(member);\n    runOrbiAcquiredRef.current += 1;`,
  `    swarmRef.current.push(member);\n    swarmDoctrineRef.current = registerSwarmDoctrineMember(\n      swarmDoctrineRef.current,\n      member.id,\n      member.level,\n    );\n    runOrbiAcquiredRef.current += 1;`,
  1,
);

// GAIA is no longer capacity-free. The reserved slot normally guarantees this
// branch; the guard keeps corrupted/legacy runs from violating 30.
replaceExact(
  game,
  `    if (\n      !existingGaia ||\n      !swarmRef.current.includes(existingGaia)\n    ) {\n      isNewGaia = true;`,
  `    if (\n      !existingGaia ||\n      !swarmRef.current.includes(existingGaia)\n    ) {\n      if (\n        swarmRef.current.length >=\n        getSwarmDoctrineCapacity(swarmDoctrineRef.current)\n      ) {\n        postDialogue(\n          "SYSTEM",\n          "GAIA LISTA, PERO SIN SLOT: eleva un Orbi veterano para completar la síntesis física.",\n        );\n        return;\n      }\n      isNewGaia = true;`,
);
replaceExact(
  game,
  `      gaiaMemberRef.current = gaiaMember;\n      swarmRef.current.push(gaiaMember);\n      runOrbiAcquiredRef.current += 1;`,
  `      gaiaMemberRef.current = gaiaMember;\n      swarmRef.current.push(gaiaMember);\n      swarmDoctrineRef.current = registerSwarmDoctrineMember(\n        swarmDoctrineRef.current,\n        gaiaMember.id,\n        gaiaMember.level,\n      );\n      runOrbiAcquiredRef.current += 1;`,
  1,
);
replaceExact(
  game,
  `      gaiaMember = existingGaia;\n      gaiaMember.level = update.state.gaiaLevel;`,
  `      gaiaMember = existingGaia;\n      gaiaMember.level = update.state.gaiaLevel;\n      swarmDoctrineRef.current = registerSwarmDoctrineLevel(\n        swarmDoctrineRef.current,\n        gaiaMember.id,\n        gaiaMember.level,\n      );`,
  1,
);

// Fusion-class followers consume slots too and cannot burn the fusion charge
// while recruitment is locked.
replaceExact(
  game,
  `  const triggerFusion = (fusionType: "SOLAR" | "HYDRO") => {\n    // Requires exact energy consumption\n    fusionEnergyRef.current = 0;`,
  `  const triggerFusion = (fusionType: "SOLAR" | "HYDRO") => {\n    const fusionCapacity = Math.max(\n      0,\n      getSwarmDoctrineCapacity(swarmDoctrineRef.current) -\n        (gaiaMemberRef.current ? 0 : 1),\n    );\n    if (swarmRef.current.length >= fusionCapacity) {\n      postDialogue(\n        "SYSTEM",\n        "FUSIÓN RETENIDA: no hay slot de enjambre. Promueve veteranos para ampliar la formación.",\n      );\n      return;\n    }\n\n    // Requires exact energy consumption only after capacity admission.\n    fusionEnergyRef.current = 0;`,
);
replaceExact(
  game,
  `      swarmRef.current.push(g);\n      runOrbiAcquiredRef.current += 1;`,
  `      swarmRef.current.push(g);\n      swarmDoctrineRef.current = registerSwarmDoctrineMember(\n        swarmDoctrineRef.current,\n        g.id,\n        g.level,\n      );\n      runOrbiAcquiredRef.current += 1;`,
  1,
);
replaceExact(
  game,
  `      swarmRef.current.push(l);\n      runOrbiAcquiredRef.current += 1;`,
  `      swarmRef.current.push(l);\n      swarmDoctrineRef.current = registerSwarmDoctrineMember(\n        swarmDoctrineRef.current,\n        l.id,\n        l.level,\n      );\n      runOrbiAcquiredRef.current += 1;`,
  1,
);

// 5) Give all six H4 specialist types concrete spawn identities.
replaceExact(
  game,
  `    } else if (type === EnemyType.DRONE) {\n      health = 20 * healthMultiplier;\n      speed = 0.7 * biomeCfg.enemySpeedMultiplier * movementSpeedMultiplier;\n      size = 11;\n      color = "#a855f7"; // purple drone\n    } else if (type === EnemyType.SPLITTER) {`,
  `    } else if (type === EnemyType.DRONE) {\n      health = 20 * healthMultiplier;\n      speed = 0.7 * biomeCfg.enemySpeedMultiplier * movementSpeedMultiplier;\n      size = 11;\n      color = "#a855f7"; // purple drone\n    } else if (type === EnemyType.RIFT_HUNTER) {\n      health = 34 * healthMultiplier;\n      speed = 1.55 * biomeCfg.enemySpeedMultiplier * movementSpeedMultiplier;\n      size = 10;\n      color = "#fb923c";\n    } else if (type === EnemyType.SIEGE_PRISM) {\n      health = 52 * healthMultiplier;\n      speed = 0.42 * biomeCfg.enemySpeedMultiplier * movementSpeedMultiplier;\n      size = 14;\n      color = "#f472b6";\n    } else if (type === EnemyType.SWARM_REAVER) {\n      health = 38 * healthMultiplier;\n      speed = 1.45 * biomeCfg.enemySpeedMultiplier * movementSpeedMultiplier;\n      size = 11;\n      color = "#f97316";\n    } else if (type === EnemyType.VOID_ANCHOR) {\n      health = 65 * healthMultiplier;\n      speed = 0.35 * biomeCfg.enemySpeedMultiplier * movementSpeedMultiplier;\n      size = 16;\n      color = "#22d3ee";\n    } else if (type === EnemyType.MINE_WEAVER) {\n      health = 42 * healthMultiplier;\n      speed = 0.65 * biomeCfg.enemySpeedMultiplier * movementSpeedMultiplier;\n      size = 12;\n      color = "#eab308";\n    } else if (type === EnemyType.MIRROR_WARDEN) {\n      health = 58 * healthMultiplier;\n      speed = 0.75 * biomeCfg.enemySpeedMultiplier * movementSpeedMultiplier;\n      size = 15;\n      color = "#e0f2fe";\n    } else if (type === EnemyType.SPLITTER) {`,
);

// Movement: insert specialist O(1) behaviors before the historical Drone path.
replaceExact(
  game,
  `        if (enemy.type === EnemyType.DRONE) {\n          // Maintain high distance, strafing left and right`,
  `        if (enemy.type === EnemyType.RIFT_HUNTER) {\n          enemy.pulseCooldown -= delta / 16.6;\n          if ((enemy.chargeTimer ?? 0) > 0) {\n            enemy.chargeTimer = Math.max(0, (enemy.chargeTimer ?? 0) - delta);\n            enemy.x += enemy.vx * (delta / 16.6);\n            enemy.y += enemy.vy * (delta / 16.6);\n          } else if (enemy.pulseCooldown <= 0) {\n            const dashScale = enemy.speed * 4.8;\n            enemy.vx = (dx / dist) * dashScale;\n            enemy.vy = (dy / dist) * dashScale;\n            enemy.chargeTimer = 420;\n            enemy.pulseCooldown = 150 + Math.random() * 70;\n            addFloatingText("RIFT LOCK", enemy.x, enemy.y - 20, "#fb923c");\n          } else {\n            enemy.x += (dx / dist) * enemy.speed * 1.15 * (delta / 16.6);\n            enemy.y += (dy / dist) * enemy.speed * 1.15 * (delta / 16.6);\n          }\n        } else if (enemy.type === EnemyType.SIEGE_PRISM) {\n          if (dist > 330) {\n            enemy.x += (dx / dist) * enemy.speed * (delta / 16.6);\n            enemy.y += (dy / dist) * enemy.speed * (delta / 16.6);\n          } else if (dist < 250) {\n            enemy.x -= (dx / dist) * enemy.speed * (delta / 16.6);\n            enemy.y -= (dy / dist) * enemy.speed * (delta / 16.6);\n          }\n          enemy.x += Math.cos(timeElapsedRef.current * 0.0018 + enemy.y) * 0.35;\n        } else if (enemy.type === EnemyType.SWARM_REAVER) {\n          enemy.x += (dx / dist) * enemy.speed * 1.65 * (delta / 16.6);\n          enemy.y += (dy / dist) * enemy.speed * 1.65 * (delta / 16.6);\n          if (dist < 105) {\n            disruptTimerRef.current = Math.max(disruptTimerRef.current, 520);\n          }\n        } else if (enemy.type === EnemyType.VOID_ANCHOR) {\n          if (dist > 190) {\n            enemy.x += (dx / dist) * enemy.speed * (delta / 16.6);\n            enemy.y += (dy / dist) * enemy.speed * (delta / 16.6);\n          }\n          if (dist < 175) {\n            disruptTimerRef.current = Math.max(disruptTimerRef.current, 280);\n          }\n        } else if (enemy.type === EnemyType.MINE_WEAVER) {\n          const tangentX = -dy / dist;\n          const tangentY = dx / dist;\n          const radial = dist > 220 ? 0.55 : dist < 160 ? -0.55 : 0;\n          enemy.x += ((dx / dist) * radial + tangentX * 0.8) * enemy.speed * (delta / 16.6);\n          enemy.y += ((dy / dist) * radial + tangentY * 0.8) * enemy.speed * (delta / 16.6);\n        } else if (enemy.type === EnemyType.MIRROR_WARDEN) {\n          const tangentX = -dy / dist;\n          const tangentY = dx / dist;\n          const radial = dist > 210 ? 0.7 : dist < 135 ? -0.7 : 0;\n          enemy.x += ((dx / dist) * radial + tangentX * 0.65) * enemy.speed * (delta / 16.6);\n          enemy.y += ((dy / dist) * radial + tangentY * 0.65) * enemy.speed * (delta / 16.6);\n        } else if (enemy.type === EnemyType.DRONE) {\n          // Maintain high distance, strafing left and right`,
);

// Specialist ranged units reuse the certified hostile projectile budget. Their
// cadence differs, but they never bypass shootFromEnemy.
replaceFirstRegex(
  game,
  /if \(enemy\.shootCooldown <= 0\) \{\n\s*if \(enemy\.type === EnemyType\.DRONE\) \{\n\s*enemy\.shootCooldown = 110 \+ Math\.random\(\) \* 80;/,
  (match) => match.replace(
    `if (enemy.type === EnemyType.DRONE) {\n          enemy.shootCooldown = 110 + Math.random() * 80;`,
    `if (\n          enemy.type === EnemyType.DRONE ||\n          enemy.type === EnemyType.SIEGE_PRISM ||\n          enemy.type === EnemyType.MINE_WEAVER ||\n          enemy.type === EnemyType.MIRROR_WARDEN ||\n          enemy.type === EnemyType.VOID_ANCHOR\n        ) {\n          enemy.shootCooldown =\n            enemy.type === EnemyType.SIEGE_PRISM ? 150 + Math.random() * 70 :\n            enemy.type === EnemyType.MINE_WEAVER ? 120 + Math.random() * 60 :\n            enemy.type === EnemyType.VOID_ANCHOR ? 160 + Math.random() * 80 :\n            100 + Math.random() * 70;`,
  ),
);

// shootFromEnemy accepts specialist ranged roles and gives artillery/traps a
// bounded pattern using the same projectile slots.
replaceExact(
  game,
  `    if (enemy.type === EnemyType.DRONE || enemy.type === EnemyType.BOSS_DEVOURER) {`,
  `    if (\n      enemy.type === EnemyType.DRONE ||\n      enemy.type === EnemyType.BOSS_DEVOURER ||\n      enemy.type === EnemyType.SIEGE_PRISM ||\n      enemy.type === EnemyType.MINE_WEAVER ||\n      enemy.type === EnemyType.MIRROR_WARDEN ||\n      enemy.type === EnemyType.VOID_ANCHOR\n    ) {`,
  1,
);
replaceExact(
  game,
  `        const projectileSpeed =\n          2.2 *\n          (enemy.evolvedProjectileSpeedMultiplier ??\n            1);\n        const projectileCount = Math.min(\n          signatureBehavior.droneVolleyProjectileCount,\n          availableProjectileSlots,\n        );\n        const baseAngle = Math.atan2(dy, dx);\n        const spread =\n          signatureBehavior.droneVolleySpreadRadians;`,
  `        const projectileSpeed =\n          (enemy.type === EnemyType.SIEGE_PRISM ? 4.0 :\n            enemy.type === EnemyType.MINE_WEAVER ? 1.35 :\n            enemy.type === EnemyType.VOID_ANCHOR ? 1.8 :\n            enemy.type === EnemyType.MIRROR_WARDEN ? 2.7 : 2.2) *\n          (enemy.evolvedProjectileSpeedMultiplier ?? 1);\n        const requestedProjectileCount =\n          enemy.type === EnemyType.SIEGE_PRISM ? 3 :\n          enemy.type === EnemyType.MINE_WEAVER ? 2 :\n          signatureBehavior.droneVolleyProjectileCount;\n        const projectileCount = Math.min(\n          requestedProjectileCount,\n          availableProjectileSlots,\n        );\n        const baseAngle = Math.atan2(dy, dx);\n        const spread =\n          enemy.type === EnemyType.SIEGE_PRISM ? 0.12 :\n          enemy.type === EnemyType.MINE_WEAVER ? 0.38 :\n          enemy.type === EnemyType.MIRROR_WARDEN ? 0.18 :\n          signatureBehavior.droneVolleySpreadRadians;`,
  1,
);

console.log("ES-12H4 runtime patch applied successfully");
