import { readFileSync, writeFileSync, unlinkSync } from "node:fs";

const gamePath = "src/game/EnergySwarmGame.tsx";
const canvasPath = "src/game/EnergySwarmCanvas.tsx";
let game = readFileSync(gamePath, "utf8");
let canvas = readFileSync(canvasPath, "utf8");

const replaceOnce = (source, label, from, to) => {
  const index = source.indexOf(from);
  if (index < 0) throw new Error(`ES-12F8 anchor missing: ${label}`);
  if (source.indexOf(from, index + from.length) >= 0) {
    throw new Error(`ES-12F8 anchor duplicated: ${label}`);
  }
  return source.slice(0, index) + to + source.slice(index + from.length);
};

const replaceBetween = (source, label, startMarker, endMarker, replacement) => {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  if (start < 0 || end < 0 || end <= start) {
    throw new Error(`ES-12F8 range missing: ${label}`);
  }
  return source.slice(0, start) + replacement + source.slice(end);
};

game = replaceOnce(
  game,
  "attack profile import",
  `import {\n  createShuffledCollectibleEnergyCycle,\n  getCollectibleEnergyDefinition,\n  getOrbiEnergyByAffinity,\n} from "./orbiEnergyCanon";`,
  `import {\n  createShuffledCollectibleEnergyCycle,\n  getCollectibleEnergyDefinition,\n  getOrbiEnergyByAffinity,\n} from "./orbiEnergyCanon";\nimport {\n  getFallbackAttackSignatureForAffinity,\n  getOrbiAttackProfile,\n} from "./orbiAttackProfiles";`,
);

const newShootBlock = `  // --- SHOOT TRIGGER FROM SWARM FOLLOWER ---\n  const shootFromSwarm = (\n    member: OrbiMember,\n    enemyIndex: SpatialIndex<Enemy>,\n  ) => {\n    if (projectilesRef.current.length >= MAX_PROJECTILES) return;\n\n    const maxRange =\n      300 +\n      (activeFormation === FormationType.SHIELD\n        ? 100\n        : 0);\n    const nearest = findNearestSpatialItem(\n      enemyIndex,\n      member.x,\n      member.y,\n      maxRange,\n      (enemy) => !enemy.isDead,\n    );\n\n    if (!nearest.item) return;\n\n    const target = nearest.item;\n    const dx = target.x - member.x;\n    const dy = target.y - member.y;\n    const dist = Math.max(0.001, Math.sqrt(nearest.distanceSquared));\n    const aff = member.affinity || "solar";\n    const signature =\n      member.attackSignature ??\n      getFallbackAttackSignatureForAffinity(aff);\n    const profile = getOrbiAttackProfile(signature);\n\n    const formationSpeed =\n      1 + FORMATIONS[activeFormation].projSpeedMod;\n    const baseSpeed =\n      4.5 * formationSpeed * profile.speedMultiplier;\n    const baseAngle = Math.atan2(dy, dx);\n    const isCriticalShot =\n      profile.criticalChance > 0 &&\n      Math.random() < profile.criticalChance;\n    const baseDamage =\n      4 +\n      (activeFormation === FormationType.CIRCLE ? 1.5 : 0);\n    const damage =\n      baseDamage *\n      profile.damageMultiplier *\n      (isCriticalShot\n        ? profile.criticalDamageMultiplier\n        : 1);\n\n    const makeProjectile = (\n      angle: number,\n      damageMultiplier = 1,\n      speedMultiplier = 1,\n      sizeMultiplier = 1,\n      echo = false,\n    ): Projectile => ({\n      id: Math.random().toString(),\n      x: member.x,\n      y: member.y,\n      vx: Math.cos(angle) * baseSpeed * speedMultiplier,\n      vy: Math.sin(angle) * baseSpeed * speedMultiplier,\n      damage: damage * damageMultiplier,\n      color: member.color,\n      size: profile.projectileSize * sizeMultiplier,\n      fromPlayer: true,\n      life: profile.lifetimeMs,\n      maxLife: profile.lifetimeMs,\n      affinity: aff,\n      energyId: member.energyId ?? profile.energyId,\n      attackSignature: signature,\n      attackShape: profile.shape,\n      rotation: angle,\n      pushMultiplier: profile.pushMultiplier,\n      slowDurationMs: profile.slowDurationMs,\n      splashRadius: profile.splashRadius,\n      splashDamageMultiplier: profile.splashDamageMultiplier,\n      magneticPullRadius: profile.magneticPullRadius,\n      magneticPullStrength: profile.magneticPullStrength,\n      supportShieldRestore: profile.supportShieldRestore,\n      isCriticalShot: echo ? false : isCriticalShot,\n    });\n\n    projectilesRef.current.push(makeProjectile(baseAngle));\n\n    // QUANTUM emits two weaker phase echoes at a tiny angular offset. The hard\n    // global projectile budget remains authoritative, so this never fans out\n    // without bound.\n    if (profile.echoAngleRadians > 0) {\n      for (const direction of [-1, 1]) {\n        if (projectilesRef.current.length >= MAX_PROJECTILES) break;\n        projectilesRef.current.push(\n          makeProjectile(\n            baseAngle + profile.echoAngleRadians * direction,\n            profile.echoDamageMultiplier,\n            0.96,\n            0.82,\n            true,\n          ),\n        );\n      }\n    }\n\n    // H2NOVA converts part of each firing cycle into a very small integrity\n    // return. Updating the ref only avoids adding React render pressure.\n    if (profile.supportShieldRestore > 0) {\n      const currentShieldMax =\n        SHIELD_MAX +\n        (upgradesLevel.hydrogen_deflector || 0) * 15 +\n        (activeRunUpgradesRef.current.foton_integrity || 0) * 30;\n      shieldRef.current = Math.min(\n        currentShieldMax,\n        shieldRef.current + profile.supportShieldRestore,\n      );\n    }\n\n    member.shootCooldown =\n      profile.cooldownFrames *\n      (activeFormation === FormationType.CIRCLE ? 0.78 : 1);\n\n    playShootSound();\n\n    const recoilForce =\n      Math.min(2.3, 1.0 + profile.speedMultiplier * 0.35);\n    member.recoilX = -(dx / dist) * recoilForce;\n    member.recoilY = -(dy / dist) * recoilForce;\n    member.flashTicks = 3;\n\n    // Existing mitosis relic remains a single bounded duplicate of the primary\n    // attack and carries the same signature/shape identity.\n    const mitosisChance =\n      0.1 * (upgradesLevel.mitosis_relic || 0) +\n      0.25 *\n        (activeRunUpgradesRef.current.mitotic_mitosis || 0);\n    if (\n      projectilesRef.current.length < MAX_PROJECTILES &&\n      mitosisChance > 0 &&\n      Math.random() < mitosisChance\n    ) {\n      const duplicate = makeProjectile(\n        baseAngle + 0.025,\n        0.92,\n        0.95,\n        0.92,\n        true,\n      );\n      duplicate.x += 4;\n      duplicate.y += 4;\n      projectilesRef.current.push(duplicate);\n    }\n  };\n\n`;

game = replaceBetween(
  game,
  "shootFromSwarm",
  "  // --- SHOOT TRIGGER FROM SWARM FOLLOWER ---",
  "  // --- SHOOT AI TRIGGER FROM ENEMY DRONE ---",
  newShootBlock,
);

game = replaceOnce(
  game,
  "critical state",
  `            let damageToApply = proj.damage;\n            let isCrit = false;\n            let isShieldBlock = false;`,
  `            let damageToApply = proj.damage;\n            let isCrit = Boolean(proj.isCriticalShot);\n            let isShieldBlock = false;`,
);

game = replaceOnce(
  game,
  "push multiplier",
  `            const pushFactor =\n              basePushFactor *\n              signatureBehavior.projectilePushbackMultiplier;`,
  `            const pushFactor =\n              basePushFactor *\n              signatureBehavior.projectilePushbackMultiplier *\n              (proj.pushMultiplier ?? 1);`,
);

game = replaceOnce(
  game,
  "hydro slow",
  `            // 1. Hydro Slow status effect application (Section 14)\n            if (proj.affinity === "hydro") {\n              enemy.slowTimer = 2500; // Slow speed for 2.5 seconds\n            }`,
  `            // HYDRO and future synthesis profiles carry their own bounded\n            // slow duration rather than sharing a color/affinity special case.\n            if ((proj.slowDurationMs ?? 0) > 0) {\n              enemy.slowTimer = Math.max(\n                enemy.slowTimer ?? 0,\n                proj.slowDurationMs ?? 0,\n              );\n            }\n\n            // MAGNE groups local enemies toward the impact point using the same\n            // collision spatial index already built for this frame.\n            if (\n              (proj.magneticPullRadius ?? 0) > 0 &&\n              (proj.magneticPullStrength ?? 0) > 0\n            ) {\n              const magneticEntries = findAllCollidingSpatialItems(\n                enemyCollisionIndex,\n                proj.x,\n                proj.y,\n                proj.magneticPullRadius ?? 0,\n                (otherEnemy) => !otherEnemy.isDead,\n              ).entries;\n              magneticEntries.forEach(({ item: otherEnemy, order }) => {\n                if (otherEnemy === enemy || otherEnemy.isBoss) return;\n                const pullX = proj.x - otherEnemy.x;\n                const pullY = proj.y - otherEnemy.y;\n                const pullDistance = Math.sqrt(pullX * pullX + pullY * pullY) || 1;\n                const pullStrength = proj.magneticPullStrength ?? 0;\n                otherEnemy.x += (pullX / pullDistance) * pullStrength;\n                otherEnemy.y += (pullY / pullDistance) * pullStrength;\n                relocateSpatialIndexEntry(\n                  enemyCollisionIndex,\n                  order,\n                  otherEnemy.x,\n                  otherEnemy.y,\n                  otherEnemy.size,\n                );\n              });\n            }`,
);

game = replaceOnce(
  game,
  "generic splash gate",
  `            // 2. Thermal Splash Area Damage application (Section 14)\n            if (proj.affinity === "thermal") {\n              const splashRadius = 55;\n              const splashDamage = damageToApply * 0.45; // 45% of primary bullet damage`,
  `            // TERMO, ATON and future GAIA profiles use the same bounded\n            // spatial splash traversal with distinct radii and strengths.\n            if ((proj.splashRadius ?? 0) > 0) {\n              const splashRadius = proj.splashRadius ?? 0;\n              const splashDamage =\n                damageToApply * (proj.splashDamageMultiplier ?? 0);`,
);

// The first matching hardcoded thermal splash color after the generic splash
// marker is now sourced from the projectile signature color.
const splashMarker = game.indexOf("// TERMO, ATON and future GAIA profiles");
const splashColor = game.indexOf('                    "#ef4444",', splashMarker);
if (splashMarker < 0 || splashColor < 0) {
  throw new Error("ES-12F8 splash feedback color anchor missing");
}
game =
  game.slice(0, splashColor) +
  "                    proj.color," +
  game.slice(splashColor + '                    "#ef4444",'.length);

// Canvas: canonical wild cores already carry exact registry color. Add missing
// magnetic/kinetic/hydrogen forms and label by canonical energy id.
canvas = replaceOnce(
  canvas,
  "wild core color",
  `      const affinity = res.orbiAffinity || "solar";\n      let coreColor = "#f59e0b";\n      if (affinity === "solar") coreColor = "#f59e0b";\n      else if (affinity === "hydro") coreColor = "#0ea5e9";\n      else if (affinity === "wind") coreColor = "#10b981";\n      else if (affinity === "thermal") coreColor = "#ef4444";\n      else if (affinity === "nuclear") coreColor = "#8b5cf6";\n      else if (affinity === "quantum") coreColor = "#ec4899";`,
  `      const affinity = res.orbiAffinity || "solar";\n      const coreColor = res.color;`,
);

canvas = replaceOnce(
  canvas,
  "wild magnetic kinetic hydrogen shapes",
  `      } else if (affinity === "nuclear") {`,
  `      } else if (affinity === "magnetic") {\n        // MAGNE: magnetic dipole with opposing poles and field line.\n        ctx.strokeStyle = coreColor;\n        ctx.lineWidth = 2;\n        ctx.beginPath();\n        ctx.arc(0, 0, sizeWithPulse * 0.9, -Math.PI * 0.75, Math.PI * 0.75);\n        ctx.stroke();\n        ctx.fillStyle = "#ffffff";\n        ctx.fillRect(-sizeWithPulse * 0.85, -2, sizeWithPulse * 0.38, 4);\n        ctx.fillRect(sizeWithPulse * 0.47, -2, sizeWithPulse * 0.38, 4);\n\n      } else if (affinity === "kinetic") {\n        // KINETRIX: forward chevrons communicate stored motion.\n        ctx.strokeStyle = coreColor;\n        ctx.lineWidth = 2.2;\n        for (let i = -1; i <= 1; i++) {\n          const offset = i * sizeWithPulse * 0.45;\n          ctx.beginPath();\n          ctx.moveTo(-sizeWithPulse * 0.8 + offset, -sizeWithPulse * 0.55);\n          ctx.lineTo(offset, 0);\n          ctx.lineTo(-sizeWithPulse * 0.8 + offset, sizeWithPulse * 0.55);\n          ctx.stroke();\n        }\n\n      } else if (affinity === "hydrogen") {\n        // H2NOVA: twin hydrogen cells linked by a bright bridge.\n        ctx.strokeStyle = coreColor;\n        ctx.fillStyle = coreColor;\n        ctx.lineWidth = 1.5;\n        ctx.beginPath();\n        ctx.arc(-sizeWithPulse * 0.42, 0, sizeWithPulse * 0.42, 0, Math.PI * 2);\n        ctx.arc(sizeWithPulse * 0.42, 0, sizeWithPulse * 0.42, 0, Math.PI * 2);\n        ctx.stroke();\n        ctx.fillStyle = "#ffffff";\n        ctx.fillRect(-sizeWithPulse * 0.28, -1, sizeWithPulse * 0.56, 2);\n\n      } else if (affinity === "nuclear") {`,
);

canvas = replaceOnce(
  canvas,
  "wild label identity",
  `        const displayLabel = lang === "es" ? \`${"${affinity.toUpperCase()}