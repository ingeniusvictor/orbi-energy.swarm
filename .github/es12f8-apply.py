from pathlib import Path

GAME = Path("src/game/EnergySwarmGame.tsx")
CANVAS = Path("src/game/EnergySwarmCanvas.tsx")

game = GAME.read_text(encoding="utf-8")
canvas = CANVAS.read_text(encoding="utf-8")


def replace_once(source: str, label: str, old: str, new: str) -> str:
    count = source.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected one anchor, found {count}")
    return source.replace(old, new, 1)


def replace_between(source: str, label: str, start_marker: str, end_marker: str, replacement: str) -> str:
    start = source.find(start_marker)
    end = source.find(end_marker, start + len(start_marker))
    if start < 0 or end < 0 or end <= start:
        raise RuntimeError(f"{label}: range not found")
    return source[:start] + replacement + source[end:]


canon_import = '''import {
  createShuffledCollectibleEnergyCycle,
  getCollectibleEnergyDefinition,
  getOrbiEnergyByAffinity,
} from "./orbiEnergyCanon";'''
attack_import = canon_import + '''
import {
  getFallbackAttackSignatureForAffinity,
  getOrbiAttackProfile,
} from "./orbiAttackProfiles";'''
game = replace_once(game, "attack profile import", canon_import, attack_import)

shoot_block = '''  // --- SHOOT TRIGGER FROM SWARM FOLLOWER ---
  const shootFromSwarm = (
    member: OrbiMember,
    enemyIndex: SpatialIndex<Enemy>,
  ) => {
    if (projectilesRef.current.length >= MAX_PROJECTILES) return;

    const maxRange =
      300 +
      (activeFormation === FormationType.SHIELD ? 100 : 0);
    const nearest = findNearestSpatialItem(
      enemyIndex,
      member.x,
      member.y,
      maxRange,
      (enemy) => !enemy.isDead,
    );
    if (!nearest.item) return;

    const target = nearest.item;
    const dx = target.x - member.x;
    const dy = target.y - member.y;
    const dist = Math.max(0.001, Math.sqrt(nearest.distanceSquared));
    const affinity = member.affinity || "solar";
    const signature =
      member.attackSignature ??
      getFallbackAttackSignatureForAffinity(affinity);
    const profile = getOrbiAttackProfile(signature);
    const formationSpeed =
      1 + FORMATIONS[activeFormation].projSpeedMod;
    const baseSpeed =
      4.5 * formationSpeed * profile.speedMultiplier;
    const baseAngle = Math.atan2(dy, dx);
    const critical =
      profile.criticalChance > 0 &&
      Math.random() < profile.criticalChance;
    const baseDamage =
      4 +
      (activeFormation === FormationType.CIRCLE ? 1.5 : 0);
    const primaryDamage =
      baseDamage *
      profile.damageMultiplier *
      (critical ? profile.criticalDamageMultiplier : 1);

    const makeProjectile = (
      angle: number,
      damageMultiplier = 1,
      speedMultiplier = 1,
      sizeMultiplier = 1,
      echo = false,
    ): Projectile => ({
      id: Math.random().toString(),
      x: member.x,
      y: member.y,
      vx: Math.cos(angle) * baseSpeed * speedMultiplier,
      vy: Math.sin(angle) * baseSpeed * speedMultiplier,
      damage: primaryDamage * damageMultiplier,
      color: member.color,
      size: profile.projectileSize * sizeMultiplier,
      fromPlayer: true,
      life: profile.lifetimeMs,
      maxLife: profile.lifetimeMs,
      affinity,
      energyId: member.energyId ?? profile.energyId,
      attackSignature: signature,
      attackShape: profile.shape,
      rotation: angle,
      pushMultiplier: profile.pushMultiplier,
      slowDurationMs: profile.slowDurationMs,
      splashRadius: profile.splashRadius,
      splashDamageMultiplier: profile.splashDamageMultiplier,
      magneticPullRadius: profile.magneticPullRadius,
      magneticPullStrength: profile.magneticPullStrength,
      supportShieldRestore: profile.supportShieldRestore,
      isCriticalShot: echo ? false : critical,
    });

    projectilesRef.current.push(makeProjectile(baseAngle));

    // QUANTUM phase echoes are bounded by the existing global projectile cap.
    if (profile.echoAngleRadians > 0) {
      for (const direction of [-1, 1]) {
        if (projectilesRef.current.length >= MAX_PROJECTILES) break;
        projectilesRef.current.push(
          makeProjectile(
            baseAngle + profile.echoAngleRadians * direction,
            profile.echoDamageMultiplier,
            0.96,
            0.82,
            true,
          ),
        );
      }
    }

    // H2NOVA turns a small portion of each firing cycle into shield support.
    if (profile.supportShieldRestore > 0) {
      const shieldMax =
        SHIELD_MAX +
        (upgradesLevel.hydrogen_deflector || 0) * 15 +
        (activeRunUpgradesRef.current.foton_integrity || 0) * 30;
      shieldRef.current = Math.min(
        shieldMax,
        shieldRef.current + profile.supportShieldRestore,
      );
    }

    member.shootCooldown =
      profile.cooldownFrames *
      (activeFormation === FormationType.CIRCLE ? 0.78 : 1);
    playShootSound();

    const recoilForce =
      Math.min(2.3, 1 + profile.speedMultiplier * 0.35);
    member.recoilX = -(dx / dist) * recoilForce;
    member.recoilY = -(dy / dist) * recoilForce;
    member.flashTicks = 3;

    const mitosisChance =
      0.1 * (upgradesLevel.mitosis_relic || 0) +
      0.25 * (activeRunUpgradesRef.current.mitotic_mitosis || 0);
    if (
      projectilesRef.current.length < MAX_PROJECTILES &&
      mitosisChance > 0 &&
      Math.random() < mitosisChance
    ) {
      const duplicate = makeProjectile(
        baseAngle + 0.025,
        0.92,
        0.95,
        0.92,
        true,
      );
      duplicate.x += 4;
      duplicate.y += 4;
      projectilesRef.current.push(duplicate);
    }
  };

'''
game = replace_between(
    game,
    "shootFromSwarm",
    "  // --- SHOOT TRIGGER FROM SWARM FOLLOWER ---",
    "  // --- SHOOT AI TRIGGER FROM ENEMY DRONE ---",
    shoot_block,
)

game = replace_once(
    game,
    "critical metadata",
    "            let damageToApply = proj.damage;\n            let isCrit = false;\n            let isShieldBlock = false;",
    "            let damageToApply = proj.damage;\n            let isCrit = Boolean(proj.isCriticalShot);\n            let isShieldBlock = false;",
)

game = replace_once(
    game,
    "profile push multiplier",
    "            const pushFactor =\n              basePushFactor *\n              signatureBehavior.projectilePushbackMultiplier;",
    "            const pushFactor =\n              basePushFactor *\n              signatureBehavior.projectilePushbackMultiplier *\n              (proj.pushMultiplier ?? 1);",
)

old_status = '''            // 1. Hydro Slow status effect application (Section 14)
            if (proj.affinity === "hydro") {
              enemy.slowTimer = 2500; // Slow speed for 2.5 seconds
            }

            // 2. Thermal Splash Area Damage application (Section 14)
            if (proj.affinity === "thermal") {
              const splashRadius = 55;
              const splashDamage = damageToApply * 0.45; // 45% of primary bullet damage'''
new_status = '''            // Signature-driven control effects. These reuse the collision
            // spatial index already built for this frame; no full enemy scan.
            if ((proj.slowDurationMs ?? 0) > 0) {
              enemy.slowTimer = Math.max(
                enemy.slowTimer ?? 0,
                proj.slowDurationMs ?? 0,
              );
            }

            if (
              (proj.magneticPullRadius ?? 0) > 0 &&
              (proj.magneticPullStrength ?? 0) > 0
            ) {
              const magneticEntries = findAllCollidingSpatialItems(
                enemyCollisionIndex,
                proj.x,
                proj.y,
                proj.magneticPullRadius ?? 0,
                (otherEnemy) => !otherEnemy.isDead,
              ).entries;
              magneticEntries.forEach(({ item: otherEnemy, order }) => {
                if (otherEnemy === enemy || otherEnemy.isBoss) return;
                const pullX = proj.x - otherEnemy.x;
                const pullY = proj.y - otherEnemy.y;
                const pullDistance =
                  Math.sqrt(pullX * pullX + pullY * pullY) || 1;
                const pullStrength = proj.magneticPullStrength ?? 0;
                otherEnemy.x += (pullX / pullDistance) * pullStrength;
                otherEnemy.y += (pullY / pullDistance) * pullStrength;
                relocateSpatialIndexEntry(
                  enemyCollisionIndex,
                  order,
                  otherEnemy.x,
                  otherEnemy.y,
                  otherEnemy.size,
                );
              });
            }

            // TERMO, ATON and future GAIA synthesis attacks share one bounded
            // spatial splash traversal but carry different profile radii/power.
            if ((proj.splashRadius ?? 0) > 0) {
              const splashRadius = proj.splashRadius ?? 0;
              const splashDamage =
                damageToApply * (proj.splashDamageMultiplier ?? 0);'''
game = replace_once(game, "signature status and splash", old_status, new_status)

# Wild Orbi cores use their canonical registry color rather than a legacy six-color switch.
old_core_color = '''      const affinity = res.orbiAffinity || "solar";
      let coreColor = "#f59e0b";
      if (affinity === "solar") coreColor = "#f59e0b";
      else if (affinity === "hydro") coreColor = "#0ea5e9";
      else if (affinity === "wind") coreColor = "#10b981";
      else if (affinity === "thermal") coreColor = "#ef4444";
      else if (affinity === "nuclear") coreColor = "#8b5cf6";
      else if (affinity === "quantum") coreColor = "#ec4899";'''
canvas = replace_once(
    canvas,
    "canonical wild core color",
    old_core_color,
    '''      const affinity = res.orbiAffinity || "solar";
      const coreColor = res.color;''',
)

old_label = '        const displayLabel = lang === "es" ? `${affinity.toUpperCase()} SALVAJE` : `WILD ${affinity.toUpperCase()}`;'
new_label = '''        const identity = res.orbiEnergyId ?? affinity.toUpperCase();
        const displayLabel =
          lang === "es"
            ? identity + " SALVAJE"
            : "WILD " + identity;'''
canvas = replace_once(canvas, "canonical wild label", old_label, new_label)

projectile_renderer = '''export function drawProjectilesList(
  ctx: CanvasRenderingContext2D,
  projectiles: Projectile[]
) {
  projectiles.forEach((proj) => {
    ctx.save();
    ctx.translate(proj.x, proj.y);
    ctx.shadowBlur = proj.size * 2.2;
    ctx.shadowColor = proj.color;
    ctx.fillStyle = proj.color;
    ctx.strokeStyle = proj.color;

    if (!proj.fromPlayer) {
      ctx.beginPath();
      ctx.arc(0, 0, proj.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    ctx.rotate(Math.atan2(proj.vy, proj.vx));
    switch (proj.attackShape ?? "LANCE") {
      case "RIPPLE":
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(0, 0, proj.size, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(-proj.size * 0.55, 0, proj.size * 0.58, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case "CRESCENT":
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(0, 0, proj.size * 1.35, -0.95, 0.95);
        ctx.stroke();
        break;
      case "PLASMA":
        ctx.beginPath();
        ctx.arc(0, 0, proj.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.55;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(proj.size * 0.18, -proj.size * 0.18, proj.size * 0.42, 0, Math.PI * 2);
        ctx.fill();
        break;
      case "ARC":
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(-7, 0);
        ctx.lineTo(-3, -3);
        ctx.lineTo(0, 2.5);
        ctx.lineTo(3, -2.5);
        ctx.lineTo(8, 0);
        ctx.stroke();
        break;
      case "PARTICLE":
        ctx.lineWidth = 1.1;
        for (let i = 0; i < 3; i += 1) {
          ctx.save();
          ctx.rotate((i * Math.PI) / 3);
          ctx.beginPath();
          ctx.ellipse(0, 0, proj.size * 1.35, proj.size * 0.45, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(0, 0, proj.size * 0.32, 0, Math.PI * 2);
        ctx.fill();
        break;
      case "KINETIC":
        ctx.beginPath();
        ctx.moveTo(9, 0);
        ctx.lineTo(-5, -proj.size);
        ctx.lineTo(-2, 0);
        ctx.lineTo(-5, proj.size);
        ctx.closePath();
        ctx.fill();
        break;
      case "CELL":
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.roundRect(-6, -proj.size * 0.65, 12, proj.size * 1.3, proj.size * 0.6);
        ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.fillRect(-1.5, -proj.size * 0.45, 3, proj.size * 0.9);
        break;
      case "PHASE":
        ctx.rotate(Math.PI / 4);
        ctx.fillRect(-proj.size * 0.65, -proj.size * 0.65, proj.size * 1.3, proj.size * 1.3);
        ctx.globalAlpha = 0.35;
        ctx.strokeStyle = "#ffffff";
        ctx.strokeRect(-proj.size, -proj.size, proj.size * 2, proj.size * 2);
        break;
      case "SYNTHESIS":
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let i = 0; i < 8; i += 1) {
          const angle = (i * Math.PI) / 4;
          const radius = i % 2 === 0 ? proj.size * 1.35 : proj.size * 0.62;
          const px = Math.cos(angle) * radius;
          const py = Math.sin(angle) * radius;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, proj.size * 0.45, 0, Math.PI * 2);
        ctx.fill();
        break;
      case "LANCE":
      default:
        ctx.fillRect(-9, -proj.size * 0.45, 18, proj.size * 0.9);
        ctx.globalAlpha = 0.55;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(1, -0.6, 8, 1.2);
        break;
    }
    ctx.restore();
  });
}

'''
canvas = replace_between(
    canvas,
    "projectile renderer",
    "export function drawProjectilesList(",
    "export default EnergySwarmCanvas;",
    projectile_renderer,
)

GAME.write_text(game, encoding="utf-8")
CANVAS.write_text(canvas, encoding="utf-8")

for temporary in [
    Path(".github/es12f8-patch.mjs"),
    Path(".github/workflows/es12f8-patch.yml"),
    Path(".github/es12f8-apply.py"),
    Path(".github/workflows/es12f8-apply.yml"),
]:
    if temporary.exists():
        temporary.unlink()
