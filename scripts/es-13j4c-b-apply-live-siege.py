from pathlib import Path


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one match, found {count}")
    return text.replace(old, new, 1)


# --- types.ts ---
types_path = Path("src/game/types.ts")
types_source = types_path.read_text()
types_source = replace_once(
    types_source,
    'import type { LiveEnemyFormationAssignment } from "./liveEnemyFormationDirector";\n',
    'import type { LiveEnemyFormationAssignment } from "./liveEnemyFormationDirector";\n'
    'import type { SiegeVolleyTelegraphState } from "./siegeVolleyTelegraph";\n',
    "types siege import",
)
types_source = replace_once(
    types_source,
    '  enemyFormation?: LiveEnemyFormationAssignment;\n}',
    '  enemyFormation?: LiveEnemyFormationAssignment;\n'
    '  siegeVolleyTelegraph?: SiegeVolleyTelegraphState;\n}',
    "types enemy field",
)
types_path.write_text(types_source)


# --- EnergySwarmGame.tsx ---
game_path = Path("src/game/EnergySwarmGame.tsx")
game_source = game_path.read_text()
formation_import = '''import {
  createLiveEnemyFormationDirectorState,
  projectLiveEnemyFormationMotion,
  requestLiveEnemyFormationSpawn,
} from "./liveEnemyFormationDirector";
'''
game_source = replace_once(
    game_source,
    formation_import,
    formation_import + '''import {
  LIVE_SIEGE_VOLLEY_FIRE_RANGE,
  acknowledgeLiveSiegeVolleyShot,
  stepLiveSiegeVolley,
} from "./liveSiegeVolleyIntegration";
''',
    "game live siege import",
)

shoot_start = game_source.index("  const shootFromEnemy = (\n")
shoot_end = game_source.index("\n  const getEnemyScoreReward", shoot_start)
shoot_source = game_source[shoot_start:shoot_end]
shoot_source = replace_once(
    shoot_source,
    '''  const shootFromEnemy = (
    enemy: Enemy,
    hostileBudgetState: { count: number },
  ) => {''',
    '''  const shootFromEnemy = (
    enemy: Enemy,
    hostileBudgetState: { count: number },
    targetOverride?: { readonly x: number; readonly y: number },
  ): boolean => {''',
    "shoot signature",
)
shoot_source = replace_once(
    shoot_source,
    "    if (availableProjectileSlots <= 0) return;",
    "    if (availableProjectileSlots <= 0) return false;",
    "shoot budget return",
)
shoot_source = replace_once(
    shoot_source,
    '''      const dx = playerPosRef.current.x - enemy.x;
      const dy = playerPosRef.current.y - enemy.y;
      const distanceSquared = dx * dx + dy * dy;

      if (
        distanceSquared > 0 &&
        distanceSquared < 320 * 320
      ) {''',
    '''      const targetX = targetOverride?.x ?? playerPosRef.current.x;
      const targetY = targetOverride?.y ?? playerPosRef.current.y;
      const dx = targetX - enemy.x;
      const dy = targetY - enemy.y;
      const distanceSquared = dx * dx + dy * dy;

      if (
        targetOverride !== undefined ||
        (distanceSquared > 0 && distanceSquared < 320 * 320)
      ) {''',
    "shoot target override",
)
shoot_source = replace_once(
    shoot_source,
    '''        hostileBudgetState.count += projectileCount;
        playEnemyShootSound();
      }
    }
  };''',
    '''        hostileBudgetState.count += projectileCount;
        playEnemyShootSound();
        return projectileCount > 0;
      }
    }

    return false;
  };''',
    "shoot accepted result",
)
game_source = game_source[:shoot_start] + shoot_source + game_source[shoot_end:]

attack_start = game_source.index("      // Shoot & pulse attack timers\n")
attack_end = game_source.index(
    "    });\n\n    // Filter out off-screen or dead enemies",
    attack_start,
)
old_attack = game_source[attack_start:attack_end]
if old_attack.count("EnemyType.SIEGE_PRISM") != 2:
    raise SystemExit(
        "attack timer block: expected exactly two SIEGE_PRISM references before patch"
    )

new_attack = '''      // Shoot & pulse attack timers
      const enemyAttackRateStep =
        (delta / 16.6) *
        simulationCombatPressure.enemyAttackRateMultiplier *
        (enemy.evolvedAttackRateMultiplier ?? 1);

      if (
        enemy.type !== EnemyType.SIEGE_PRISM ||
        enemy.siegeVolleyTelegraph === undefined
      ) {
        enemy.shootCooldown -= enemyAttackRateStep;
      }

      if (enemy.type === EnemyType.SIEGE_PRISM) {
        const siegeTargetDx = playerPosRef.current.x - enemy.x;
        const siegeTargetDy = playerPosRef.current.y - enemy.y;
        const siegeTargetDistanceSquared =
          siegeTargetDx * siegeTargetDx +
          siegeTargetDy * siegeTargetDy;
        const siegeVolley = stepLiveSiegeVolley({
          state: enemy.siegeVolleyTelegraph,
          deltaMs: delta,
          cooldownReady: enemy.shootCooldown <= 0,
          targetX: playerPosRef.current.x,
          targetY: playerPosRef.current.y,
          targetInRange:
            siegeTargetDistanceSquared > 0 &&
            siegeTargetDistanceSquared <
              LIVE_SIEGE_VOLLEY_FIRE_RANGE *
                LIVE_SIEGE_VOLLEY_FIRE_RANGE,
        });
        enemy.siegeVolleyTelegraph = siegeVolley.state;

        if (siegeVolley.telegraphStarted) {
          playEliteChargeSound();
          addFloatingText(
            "SIEGE VOLLEY",
            enemy.x,
            enemy.y - enemy.size - 14,
            "#f472b6",
          );
        }

        const lockedTargetX = siegeVolley.state?.targetX;
        const lockedTargetY = siegeVolley.state?.targetY;
        if (
          siegeVolley.commitReady &&
          lockedTargetX !== null &&
          lockedTargetX !== undefined &&
          lockedTargetY !== null &&
          lockedTargetY !== undefined
        ) {
          const shotCommitted = shootFromEnemy(
            enemy,
            hostileProjectileBudgetState,
            { x: lockedTargetX, y: lockedTargetY },
          );
          const acknowledgement =
            acknowledgeLiveSiegeVolleyShot(
              siegeVolley.state,
              shotCommitted,
            );
          enemy.siegeVolleyTelegraph = acknowledgement.state;
          if (acknowledgement.acknowledged) {
            enemy.shootCooldown = 150 + Math.random() * 70;
          }
        }
      } else if (enemy.shootCooldown <= 0) {
        if (
          enemy.type === EnemyType.DRONE ||
          enemy.type === EnemyType.MINE_WEAVER ||
          enemy.type === EnemyType.MIRROR_WARDEN ||
          enemy.type === EnemyType.VOID_ANCHOR
        ) {
          enemy.shootCooldown =
            enemy.type === EnemyType.MINE_WEAVER ? 120 + Math.random() * 60 :
            enemy.type === EnemyType.VOID_ANCHOR ? 160 + Math.random() * 80 :
            100 + Math.random() * 70;
          shootFromEnemy(
            enemy,
            hostileProjectileBudgetState,
          );
        } else if (enemy.type === EnemyType.DISRUPTOR) {
          enemy.shootCooldown = 220 + Math.random() * 120; // reset pulse timer (3.5-5.5s)
          
          // Trigger Disruptor electromagnetic pulse (Section 3.2)
          playDisruptorPulseSound();
          disruptTimerRef.current =
            2000 *
            signatureBehavior.disruptDurationMultiplier;

          // Glowing cyan ring expansion particle effect
          triggerExplosion(
            particlesRef.current,
            getQualityConfig(stats.qualityPreset).maxParticles,
            ParticleType.BIOME_PORTAL,
            enemy.x,
            enemy.y,
            "#06b6d4",
            12
          );
          screenShakeRef.current = Math.max(screenShakeRef.current, 6.5);
          addFloatingText("DISRUPTION DETECTED", playerPosRef.current.x, playerPosRef.current.y - 20, "#22d3ee");
        } else {
          // Crawler, Splitter, and minion parts don't fire projectiles
          enemy.shootCooldown = 999999;
        }
      }
'''
game_source = game_source[:attack_start] + new_attack + game_source[attack_end:]
game_path.write_text(game_source)


# --- EnergySwarmCanvas.tsx ---
canvas_path = Path("src/game/EnergySwarmCanvas.tsx")
canvas_source = canvas_path.read_text()
canvas_source = replace_once(
    canvas_source,
    'import { getCanvasBackingStoreSize } from "./canvasResolution";\n',
    'import { getCanvasBackingStoreSize } from "./canvasResolution";\n'
    'import { projectSiegeVolleyTelegraph } from "./siegeVolleyTelegraph";\n',
    "canvas siege projection import",
)
telegraph_marker = '''    // DRAW WEAPONS CHARGING TELEGRAPHS (drawn behind the enemy body)
    if (enemy.type === EnemyType.DRONE && enemy.shootCooldown !== undefined && enemy.shootCooldown <= 35 && enemy.shootCooldown > 0) {'''
telegraph_replacement = '''    // DRAW WEAPONS CHARGING TELEGRAPHS (drawn behind the enemy body)
    const siegeVolleyProjection =
      enemy.type === EnemyType.SIEGE_PRISM &&
      enemy.siegeVolleyTelegraph
        ? projectSiegeVolleyTelegraph(
            enemy.siegeVolleyTelegraph,
          )
        : null;

    if (
      enemy.type === EnemyType.SIEGE_PRISM &&
      siegeVolleyProjection &&
      (siegeVolleyProjection.telegraphActive ||
        siegeVolleyProjection.commitReady) &&
      siegeVolleyProjection.targetX !== null &&
      siegeVolleyProjection.targetY !== null
    ) {
      const targetDx =
        siegeVolleyProjection.targetX - enemy.x;
      const targetDy =
        siegeVolleyProjection.targetY - enemy.y;
      const targetPulse =
        1 + Math.sin(time * 0.018) * 0.12;

      ctx.save();
      ctx.strokeStyle = siegeVolleyProjection.commitReady
        ? "rgba(244, 114, 182, 0.95)"
        : "rgba(244, 114, 182, 0.68)";
      ctx.lineWidth = siegeVolleyProjection.commitReady ? 2.2 : 1.5;
      ctx.setLineDash([7, 5]);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(targetDx, targetDy);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.strokeStyle = "rgba(103, 232, 249, 0.9)";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(
        targetDx,
        targetDy,
        16 * targetPulse,
        0,
        Math.PI * 2,
      );
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(targetDx - 22, targetDy);
      ctx.lineTo(targetDx + 22, targetDy);
      ctx.moveTo(targetDx, targetDy - 22);
      ctx.lineTo(targetDx, targetDy + 22);
      ctx.stroke();

      ctx.strokeStyle = "rgba(244, 114, 182, 0.95)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(
        0,
        0,
        enemy.size * 1.65,
        -Math.PI / 2,
        -Math.PI / 2 +
          Math.PI * 2 * siegeVolleyProjection.progress,
      );
      ctx.stroke();

      ctx.fillStyle = "rgba(253, 242, 248, 0.96)";
      ctx.font = "bold 7px monospace";
      ctx.textAlign = "center";
      ctx.fillText(
        "SIEGE VOLLEY",
        targetDx,
        targetDy - 28,
      );
      ctx.restore();
    } else if (enemy.type === EnemyType.DRONE && enemy.shootCooldown !== undefined && enemy.shootCooldown <= 35 && enemy.shootCooldown > 0) {'''
canvas_source = replace_once(
    canvas_source,
    telegraph_marker,
    telegraph_replacement,
    "canvas siege telegraph",
)

siege_case_anchor = '''      case EnemyType.BLACKOUT_ELITE: {
'''
siege_case = '''      case EnemyType.SIEGE_PRISM: {
        const prismRotation = time * 0.0015;
        const volleyProjection = enemy.siegeVolleyTelegraph
          ? projectSiegeVolleyTelegraph(
              enemy.siegeVolleyTelegraph,
            )
          : null;
        const chargeScale =
          volleyProjection?.telegraphActive ||
          volleyProjection?.commitReady
            ? 1.08 +
              Math.sin(time * 0.016) * 0.06
            : 1;

        ctx.save();
        ctx.rotate(prismRotation);
        ctx.scale(chargeScale, chargeScale);
        ctx.shadowColor = "#f472b6";
        ctx.shadowBlur = 14;

        ctx.fillStyle = "#3b1647";
        ctx.strokeStyle = "#f9a8d4";
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(0, -enemy.size * 1.25);
        ctx.lineTo(enemy.size * 0.9, 0);
        ctx.lineTo(0, enemy.size * 1.25);
        ctx.lineTo(-enemy.size * 0.9, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = "#67e8f9";
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(0, -enemy.size * 0.92);
        ctx.lineTo(enemy.size * 0.62, 0);
        ctx.lineTo(0, enemy.size * 0.92);
        ctx.lineTo(-enemy.size * 0.62, 0);
        ctx.closePath();
        ctx.stroke();

        ctx.fillStyle = volleyProjection?.commitReady
          ? "#ffffff"
          : "#f472b6";
        ctx.beginPath();
        ctx.arc(0, 0, enemy.size * 0.26, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        break;
      }

'''
canvas_source = replace_once(
    canvas_source,
    siege_case_anchor,
    siege_case + siege_case_anchor,
    "canvas siege body",
)
canvas_path.write_text(canvas_source)

print("J4C-B live Siege Volley patch applied successfully")
