import fs from "node:fs";

const read = (path) => fs.readFileSync(path, "utf8");
const write = (path, content) => fs.writeFileSync(path, content, "utf8");
const replaceOnce = (source, before, after, label) => {
  const first = source.indexOf(before);
  if (first < 0) throw new Error(`H5 patch missing: ${label}`);
  if (source.indexOf(before, first + before.length) >= 0) {
    throw new Error(`H5 patch ambiguous: ${label}`);
  }
  return source.slice(0, first) + after + source.slice(first + before.length);
};

const bossFamilyModule = `import { EnemyType, type InfiniteBossIdentity } from "./types";

export type InfiniteBossFamilyProfile = {
  identity: InfiniteBossIdentity;
  displayName: string;
  subtitle: string;
  color: string;
  supportEnemyType: EnemyType;
  supportMaxCount: number;
  supportCooldownMs: number;
  introDialogue: string;
  defeatLabel: string;
  defeatDialogue: string;
  attackWeights: Readonly<Record<string, number>>;
};

const FAMILY_ROTATION: readonly InfiniteBossIdentity[] = [
  "DEVOURER_ASCENDANT",
  "NULL_ARCHITECT",
  "RIFT_MATRIARCH",
  "SIEGE_CATHEDRAL",
] as const;

const PROFILES: Readonly<Record<InfiniteBossIdentity, InfiniteBossFamilyProfile>> = {
  DEVOURER_ASCENDANT: {
    identity: "DEVOURER_ASCENDANT",
    displayName: "Blackout Devourer Ascendant",
    subtitle: "Predator-Class Recurrence",
    color: "#ec4899",
    supportEnemyType: EnemyType.RIFT_HUNTER,
    supportMaxCount: 2,
    supportCooldownMs: 9000,
    introDialogue: "¡RECURRENCIA ASCENDENTE! El Blackout Devourer vuelve con cazadores de grieta.",
    defeatLabel: "DEVOURER ASCENDANT PURGED",
    defeatDialogue: "RECURRENCIA ASCENDENTE SELLADA. Reanudando Infinite Swarm.",
    attackWeights: {
      rotating_eclipse_lanes: 1.45,
      devourer_charge: 1.35,
      singularity_pulse: 1.2,
    },
  },
  NULL_ARCHITECT: {
    identity: "NULL_ARCHITECT",
    displayName: "Null Architect",
    subtitle: "Spatial-Control Intelligence",
    color: "#22d3ee",
    supportEnemyType: EnemyType.VOID_ANCHOR,
    supportMaxCount: 2,
    supportCooldownMs: 8500,
    introDialogue: "¡ARQUITECTURA NULA DETECTADA! El espacio de combate está siendo reescrito por anclas de vacío.",
    defeatLabel: "NULL ARCHITECT COLLAPSED",
    defeatDialogue: "MALLA NULA COLAPSADA. El espacio táctico vuelve a responder.",
    attackWeights: {
      gravity_well: 2.2,
      blackout_sweep: 1.85,
      singularity_pulse: 1.55,
      devourer_beam: 0.65,
      devourer_charge: 0.35,
    },
  },
  RIFT_MATRIARCH: {
    identity: "RIFT_MATRIARCH",
    displayName: "Rift Matriarch",
    subtitle: "Predictive Hunter Nexus",
    color: "#fb923c",
    supportEnemyType: EnemyType.RIFT_HUNTER,
    supportMaxCount: 3,
    supportCooldownMs: 6500,
    introDialogue: "¡MATRIZ DE CAZA ABIERTA! La Rift Matriarch está encadenando vectores predictivos.",
    defeatLabel: "RIFT MATRIARCH PURGED",
    defeatDialogue: "NEXO DE GRIETA CERRADO. Los vectores de caza se disipan.",
    attackWeights: {
      devourer_charge: 2.35,
      rotating_eclipse_lanes: 1.7,
      orbital_shards: 1.25,
      gravity_well: 0.55,
    },
  },
  SIEGE_CATHEDRAL: {
    identity: "SIEGE_CATHEDRAL",
    displayName: "Siege Cathedral",
    subtitle: "Artillery Geometry Engine",
    color: "#f472b6",
    supportEnemyType: EnemyType.SIEGE_PRISM,
    supportMaxCount: 2,
    supportCooldownMs: 8000,
    introDialogue: "¡CATEDRAL DE ASEDIO EN LÍNEA! Lee los corredores seguros antes del bombardeo geométrico.",
    defeatLabel: "SIEGE CATHEDRAL SILENCED",
    defeatDialogue: "ARTILLERÍA GEOMÉTRICA SILENCIADA. Corredores de escape restaurados.",
    attackWeights: {
      devourer_beam: 2.15,
      orbital_shards: 1.9,
      blackout_sweep: 1.8,
      rotating_eclipse_lanes: 1.5,
      devourer_charge: 0.3,
    },
  },
};

export const selectInfiniteBossIdentity = (
  sector: number,
): InfiniteBossIdentity => {
  const ordinal = Math.max(0, Math.floor(Math.max(25, sector) / 25) - 1);
  return FAMILY_ROTATION[ordinal % FAMILY_ROTATION.length];
};

export const getInfiniteBossFamilyProfile = (
  identity: InfiniteBossIdentity,
): InfiniteBossFamilyProfile => PROFILES[identity];

export const getInfiniteBossAttackWeight = (
  identity: InfiniteBossIdentity | undefined,
  attackId: string,
  baseWeight: number,
): number => {
  if (!identity) return baseWeight;
  const override = PROFILES[identity].attackWeights[attackId];
  return override === undefined ? baseWeight : Math.max(0.05, override);
};
`;
write("src/game/infiniteBossFamily.ts", bossFamilyModule);

let types = read("src/game/types.ts");
types = replaceOnce(
  types,
  `export interface Enemy {\n`,
  `export type InfiniteBossIdentity =\n  | "DEVOURER_ASCENDANT"\n  | "NULL_ARCHITECT"\n  | "RIFT_MATRIARCH"\n  | "SIEGE_CATHEDRAL";\n\nexport interface Enemy {\n`,
  "types boss identity",
);
types = replaceOnce(
  types,
  `  milestoneId?: string;\n`,
  `  milestoneId?: string;\n  infiniteBossIdentity?: InfiniteBossIdentity;\n`,
  "enemy boss identity metadata",
);
write("src/game/types.ts", types);

let milestone = read("src/game/runtimeMilestoneEncounter.ts");
milestone = replaceOnce(
  milestone,
  `import type { RuntimeWaveDescriptor } from "./runtimeWaveDescriptor";\n`,
  `import type { RuntimeWaveDescriptor } from "./runtimeWaveDescriptor";\nimport { selectInfiniteBossIdentity } from "./infiniteBossFamily";\nimport type { InfiniteBossIdentity } from "./types";\n`,
  "milestone boss family imports",
);
milestone = replaceOnce(
  milestone,
  `      enemyType: EnemyType.BOSS_DEVOURER;\n      healthMultiplier: number;\n`,
  `      enemyType: EnemyType.BOSS_DEVOURER;\n      bossIdentity: InfiniteBossIdentity;\n      healthMultiplier: number;\n`,
  "milestone boss identity type",
);
milestone = replaceOnce(
  milestone,
  `      enemyType: EnemyType.BOSS_DEVOURER,\n      healthMultiplier: round(\n`,
  `      enemyType: EnemyType.BOSS_DEVOURER,\n      bossIdentity: selectInfiniteBossIdentity(descriptor.sector),\n      healthMultiplier: round(\n`,
  "milestone boss identity projection",
);
write("src/game/runtimeMilestoneEncounter.ts", milestone);

let game = read("src/game/EnergySwarmGame.tsx");
game = replaceOnce(
  game,
  `import type { InfiniteMilestoneEncounterProfile } from "./runtimeMilestoneEncounter";\n`,
  `import type { InfiniteMilestoneEncounterProfile } from "./runtimeMilestoneEncounter";\nimport {\n  getInfiniteBossAttackWeight,\n  getInfiniteBossFamilyProfile,\n} from "./infiniteBossFamily";\n`,
  "game boss family imports",
);

game = replaceOnce(
  game,
  `        if (rematchRequest.telegraphStarted) {\n          setWaveName(\n            "BOSS REMATCH INBOUND // BLACKOUT DEVOURER",\n          );\n          playBossChargeSound();\n          postDialogue(\n            "SYSTEM",\n            \`MILESTONE REMATCH LOCKED: \${bossRematchProfile.milestoneId}. Devourer recurrence inbound.\`,\n          );\n          addFloatingText(\n            "⚠ DEVOURER REMATCH INBOUND",\n            playerPosRef.current.x,\n            playerPosRef.current.y - 60,\n            "#ec4899",\n          );\n        }\n`,
  `        if (rematchRequest.telegraphStarted) {\n          const familyProfile = getInfiniteBossFamilyProfile(\n            bossRematchProfile.bossIdentity,\n          );\n          setWaveName(\n            \`BOSS MILESTONE INBOUND // \${familyProfile.displayName.toUpperCase()}\`,\n          );\n          playBossChargeSound();\n          postDialogue(\n            "SYSTEM",\n            \`MILESTONE BOSS LOCKED: \${bossRematchProfile.milestoneId}. \${familyProfile.displayName} inbound.\`,\n          );\n          addFloatingText(\n            \`⚠ \${familyProfile.displayName.toUpperCase()} INBOUND\`,\n            playerPosRef.current.x,\n            playerPosRef.current.y - 60,\n            familyProfile.color,\n          );\n        }\n`,
  "dynamic boss milestone warning",
);

game = replaceOnce(
  game,
  `    const isRematch = rematchProfile !== null;\n    bossActiveRef.current = true;\n`,
  `    const isRematch = rematchProfile !== null;\n    const familyProfile = rematchProfile\n      ? getInfiniteBossFamilyProfile(rematchProfile.bossIdentity)\n      : null;\n    bossActiveRef.current = true;\n`,
  "spawn boss family profile",
);
game = replaceOnce(
  game,
  `      id: isRematch\n        ? \`blackout_devourer_rematch_\${rematchProfile?.sector ?? "infinite"}\`\n        : "blackout_devourer_boss",\n`,
  `      id: isRematch\n        ? \`\${rematchProfile?.bossIdentity.toLowerCase() ?? "infinite_boss"}_\${rematchProfile?.sector ?? "infinite"}\`\n        : "blackout_devourer_boss",\n`,
  "boss instance id",
);
game = replaceOnce(
  game,
  `      color: "#ec4899", // Magenta/violet cyber boss\n`,
  `      color: familyProfile?.color ?? "#ec4899", // Infinite variants preserve shared chassis with identity color.\n`,
  "boss identity color",
);
game = replaceOnce(
  game,
  `      milestoneId: rematchProfile?.milestoneId,\n`,
  `      milestoneId: rematchProfile?.milestoneId,\n      infiniteBossIdentity: rematchProfile?.bossIdentity,\n`,
  "boss identity metadata",
);
game = replaceOnce(
  game,
  `      setWaveName(\n        \`DEVOURER REMATCH // SECTOR \${rematchProfile?.sector ?? currentWaveRef.current}\`,\n      );\n`,
  `      setWaveName(\n        \`\${familyProfile?.displayName.toUpperCase() ?? "INFINITE BOSS"} // SECTOR \${rematchProfile?.sector ?? currentWaveRef.current}\`,\n      );\n`,
  "boss identity wave name",
);
game = replaceOnce(
  game,
  `      isRematch\n        ? "¡RESONANCIA HOSTIL RECURRENTE! El Blackout Devourer ha regresado como rematch infinito."\n        : "¡ALERTA! Concentración de energía Blackout masiva en el sector central. ¡El Devorador está entrando!",\n`,
  `      isRematch\n        ? (familyProfile?.introDialogue ?? "¡RESONANCIA HOSTIL RECURRENTE!")\n        : "¡ALERTA! Concentración de energía Blackout masiva en el sector central. ¡El Devorador está entrando!",\n`,
  "boss identity intro dialogue",
);

game = replaceOnce(
  game,
  `    else if (type === EnemyType.DISRUPTOR) { hp = 40; speed = 0.7; size = 14; color = "#06b6d4"; }\n`,
  `    else if (type === EnemyType.DISRUPTOR) { hp = 40; speed = 0.7; size = 14; color = "#06b6d4"; }\n    else if (type === EnemyType.RIFT_HUNTER) { hp = 34; speed = 1.55; size = 10; color = "#fb923c"; }\n    else if (type === EnemyType.VOID_ANCHOR) { hp = 65; speed = 0.35; size = 16; color = "#22d3ee"; }\n    else if (type === EnemyType.SIEGE_PRISM) { hp = 52; speed = 0.42; size = 14; color = "#f472b6"; }\n`,
  "boss specialist minion stats",
);

const summonAnchor = `    BLACKOUT_DEVOURER_CANON.summonRules.forEach((rule) => {`;
const summonStart = game.indexOf(summonAnchor);
if (summonStart < 0) throw new Error("H5 patch missing: canonical summon loop");
const selectionAnchor = `    // 7. ATTACK SELECTION`;
const selectionStart = game.indexOf(selectionAnchor, summonStart);
if (selectionStart < 0) throw new Error("H5 patch missing: attack selection marker");
const specialistSummon = `    // H5 boss-family specialist support reuses the existing summon timer map and hard enemy cap.\n    if (boss.infiniteBossIdentity) {\n      const family = getInfiniteBossFamilyProfile(boss.infiniteBossIdentity);\n      const timerKey = \`H5_\${family.identity}\`;\n      const currentTimer = bossSummonTimersRef.current[timerKey];\n      if (currentTimer === undefined) {\n        bossSummonTimersRef.current[timerKey] = family.supportCooldownMs;\n      } else {\n        bossSummonTimersRef.current[timerKey] -= delta;\n        if (bossSummonTimersRef.current[timerKey] <= 0) {\n          bossSummonTimersRef.current[timerKey] = family.supportCooldownMs;\n          const activeSupport = countMinionsOfType(\n            enemiesRef.current,\n            family.supportEnemyType,\n          );\n          if (\n            activeSupport < family.supportMaxCount &&\n            enemiesRef.current.length < MAX_ENEMIES\n          ) {\n            const angle = Math.random() * Math.PI * 2;\n            spawnBossMinion(\n              family.supportEnemyType,\n              boss.x + Math.cos(angle) * 120,\n              boss.y + Math.sin(angle) * 120,\n            );\n            addFloatingText(\n              \`\${family.displayName.toUpperCase()} // SUPPORT VECTOR\`,\n              boss.x,\n              boss.y - 58,\n              family.color,\n            );\n          }\n        }\n      }\n    }\n\n`;
game = game.slice(0, selectionStart) + specialistSummon + game.slice(selectionStart);

game = replaceOnce(
  game,
  `          const totalWeight = possibleAttacks.reduce((sum, a) => sum + a.weight, 0);\n          let roll = Math.random() * totalWeight;\n          let chosen = possibleAttacks[0];\n          for (let i = 0; i < possibleAttacks.length; i++) {\n            roll -= possibleAttacks[i].weight;\n`,
  `          const totalWeight = possibleAttacks.reduce(\n            (sum, a) =>\n              sum +\n              getInfiniteBossAttackWeight(\n                boss.infiniteBossIdentity,\n                a.id,\n                a.weight,\n              ),\n            0,\n          );\n          let roll = Math.random() * totalWeight;\n          let chosen = possibleAttacks[0];\n          for (let i = 0; i < possibleAttacks.length; i++) {\n            roll -= getInfiniteBossAttackWeight(\n              boss.infiniteBossIdentity,\n              possibleAttacks[i].id,\n              possibleAttacks[i].weight,\n            );\n`,
  "boss family attack weighting",
);
game = replaceOnce(
  game,
  `            postDialogue("COMPANION", \`¡CUIDADO! Devorador iniciando \${chosen.displayName.toUpperCase()}. \${chosen.description} Moverse de inmediato.\`);\n`,
  `            const activeBossName = boss.infiniteBossIdentity\n              ? getInfiniteBossFamilyProfile(boss.infiniteBossIdentity).displayName\n              : "Devorador";\n            postDialogue("COMPANION", \`¡CUIDADO! \${activeBossName} iniciando \${chosen.displayName.toUpperCase()}. \${chosen.description} Moverse de inmediato.\`);\n`,
  "boss family threat dialogue",
);
game = replaceOnce(
  game,
  `        setWaveName("DEVOURER REMATCH PURGED");\n        playVictorySound();\n        postDialogue(\n          "SYSTEM",\n          "RECURRENCIA DEVOURER SELLADA. Reanudando Infinite Swarm.",\n        );\n`,
  `        const defeatedFamily = boss.infiniteBossIdentity\n          ? getInfiniteBossFamilyProfile(boss.infiniteBossIdentity)\n          : null;\n        setWaveName(\n          defeatedFamily?.defeatLabel ?? "INFINITE BOSS PURGED",\n        );\n        playVictorySound();\n        postDialogue(\n          "SYSTEM",\n          defeatedFamily?.defeatDialogue ??\n            "AMENAZA MILESTONE SELLADA. Reanudando Infinite Swarm.",\n        );\n`,
  "boss family defeat presentation",
);
write("src/game/EnergySwarmGame.tsx", game);

let milestoneTest = read("tests/runtime-milestone-encounter.test.ts");
milestoneTest = replaceOnce(
  milestoneTest,
  `  assert.equal(\n    profile.enemyType,\n    EnemyType.BOSS_DEVOURER,\n  );\n`,
  `  assert.equal(\n    profile.enemyType,\n    EnemyType.BOSS_DEVOURER,\n  );\n  assert.equal(profile.bossIdentity, "DEVOURER_ASCENDANT");\n`,
  "sector25 boss identity assertion",
);
write("tests/runtime-milestone-encounter.test.ts", milestoneTest);

let adoption = read("tests/runtime-boss-rematch-adoption.test.ts");
adoption = replaceOnce(
  adoption,
  `test("eligible rematch gets an explicit warning then spawns through the existing boss engine", () => {`,
  `test("eligible Infinite boss gets an identity-driven warning then spawns through the existing boss engine", () => {`,
  "adoption test title",
);
adoption = replaceOnce(
  adoption,
  `  assert.match(\n    transitions,\n    /BOSS REMATCH INBOUND \\/\\/ BLACKOUT DEVOURER/,\n  );\n  assert.match(\n    transitions,\n    /DEVOURER REMATCH INBOUND/,\n  );\n`,
  `  assert.match(\n    transitions,\n    /getInfiniteBossFamilyProfile/,\n  );\n  assert.match(\n    transitions,\n    /BOSS MILESTONE INBOUND/,\n  );\n`,
  "dynamic boss warning assertions",
);
adoption = replaceOnce(
  adoption,
  `  assert.match(\n    spawn,\n    /milestoneKind: isRematch \\? "BOSS_REMATCH" : undefined/,\n  );\n`,
  `  assert.match(\n    spawn,\n    /milestoneKind: isRematch \\? "BOSS_REMATCH" : undefined/,\n  );\n  assert.match(\n    spawn,\n    /infiniteBossIdentity: rematchProfile\\?\\.bossIdentity/,\n  );\n`,
  "boss identity adoption assertion",
);
adoption = replaceOnce(
  adoption,
  `  assert.match(\n    rematchBranch,\n    /DEVOURER REMATCH PURGED/,\n  );\n`,
  `  assert.match(\n    rematchBranch,\n    /defeatedFamily\\?\\.defeatLabel/,\n  );\n`,
  "dynamic boss defeat assertion",
);
adoption = replaceOnce(
  adoption,
  `  assert.match(\n    types,\n    /milestoneRewardMultiplier\\?: number/,\n  );\n`,
  `  assert.match(\n    types,\n    /milestoneRewardMultiplier\\?: number/,\n  );\n  assert.match(\n    types,\n    /infiniteBossIdentity\\?: InfiniteBossIdentity/,\n  );\n`,
  "boss identity type assertion",
);
write("tests/runtime-boss-rematch-adoption.test.ts", adoption);

const familyTest = `import assert from "node:assert/strict";
import test from "node:test";

import {
  getInfiniteBossAttackWeight,
  getInfiniteBossFamilyProfile,
  selectInfiniteBossIdentity,
} from "../src/game/infiniteBossFamily.ts";
import { EnemyType } from "../src/game/types.ts";

test("Infinite boss family rotates deterministically every 25 sectors", () => {
  assert.equal(selectInfiniteBossIdentity(25), "DEVOURER_ASCENDANT");
  assert.equal(selectInfiniteBossIdentity(50), "NULL_ARCHITECT");
  assert.equal(selectInfiniteBossIdentity(75), "RIFT_MATRIARCH");
  assert.equal(selectInfiniteBossIdentity(100), "SIEGE_CATHEDRAL");
  assert.equal(selectInfiniteBossIdentity(125), "DEVOURER_ASCENDANT");
  assert.equal(selectInfiniteBossIdentity(150), "NULL_ARCHITECT");
});

test("boss profiles use bounded H4 specialist support", () => {
  const nullArchitect = getInfiniteBossFamilyProfile("NULL_ARCHITECT");
  const matriarch = getInfiniteBossFamilyProfile("RIFT_MATRIARCH");
  const cathedral = getInfiniteBossFamilyProfile("SIEGE_CATHEDRAL");

  assert.equal(nullArchitect.supportEnemyType, EnemyType.VOID_ANCHOR);
  assert.ok(nullArchitect.supportMaxCount <= 3);
  assert.ok(nullArchitect.supportCooldownMs >= 6000);

  assert.equal(matriarch.supportEnemyType, EnemyType.RIFT_HUNTER);
  assert.ok(matriarch.supportMaxCount <= 3);

  assert.equal(cathedral.supportEnemyType, EnemyType.SIEGE_PRISM);
  assert.ok(cathedral.supportMaxCount <= 3);
});

test("boss attack identity changes weighting without producing zero-weight attacks", () => {
  assert.ok(
    getInfiniteBossAttackWeight("NULL_ARCHITECT", "gravity_well", 1) > 1,
  );
  assert.ok(
    getInfiniteBossAttackWeight("RIFT_MATRIARCH", "devourer_charge", 1) > 1,
  );
  assert.ok(
    getInfiniteBossAttackWeight("SIEGE_CATHEDRAL", "devourer_beam", 1) > 1,
  );
  assert.ok(
    getInfiniteBossAttackWeight("NULL_ARCHITECT", "devourer_charge", 1) > 0,
  );
  assert.equal(
    getInfiniteBossAttackWeight(undefined, "gravity_well", 1.25),
    1.25,
  );
});
`;
write("tests/infinite-boss-family.test.ts", familyTest);

const runtimeAdoptionTest = `import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const game = readFileSync(
  new URL("../src/game/EnergySwarmGame.tsx", import.meta.url),
  "utf8",
);

test("Infinite boss family is adopted without changing the campaign spawn path", () => {
  assert.match(game, /getInfiniteBossFamilyProfile/);
  assert.match(game, /infiniteBossIdentity: rematchProfile\\?\\.bossIdentity/);
  assert.match(game, /descriptor\\.completionPolicy\\.type === "BOSS_DEFEAT"[\\s\\S]*spawnBoss\\(\\)/);
});

test("family specialist support stays behind existing MAX_ENEMIES and shared summon timers", () => {
  assert.match(game, /bossSummonTimersRef\\.current\\[timerKey\\]/);
  assert.match(game, /activeSupport < family\\.supportMaxCount/);
  assert.match(game, /enemiesRef\\.current\\.length < MAX_ENEMIES/);
  assert.match(game, /spawnBossMinion\\([\\s\\S]*family\\.supportEnemyType/);
});

test("Infinite boss identity weights the shared attack selector rather than replacing telegraph timing", () => {
  assert.match(game, /getInfiniteBossAttackWeight\\([\\s\\S]*boss\\.infiniteBossIdentity/);
  assert.match(game, /bossAttackTelegraphRef\\.current = chosen\\.telegraphDuration/);
  assert.doesNotMatch(game, /bossAttackTelegraphRef\\.current = chosen\\.telegraphDuration \\*/);
});

test("Infinite milestone presentation no longer hardcodes Devourer for every rematch", () => {
  const transitionStart = game.indexOf("const handleWaveTransitions");
  const transitionEnd = game.indexOf("// --- SPAWN REGULAR ENEMY ---", transitionStart);
  const transitions = game.slice(transitionStart, transitionEnd);
  assert.doesNotMatch(transitions, /BOSS REMATCH INBOUND \\/\\/ BLACKOUT DEVOURER/);
  assert.doesNotMatch(transitions, /DEVOURER REMATCH INBOUND/);
  assert.match(transitions, /familyProfile\\.displayName/);
});
`;
write("tests/infinite-boss-family-runtime.test.ts", runtimeAdoptionTest);

console.log("ES-12H5 guarded patch applied");
