from pathlib import Path


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"fail-closed {label}: expected 1 match, found {count}")
    return text.replace(old, new, 1)


def replace_between(text: str, start: str, end: str, replacement: str, label: str) -> str:
    start_count = text.count(start)
    end_count = text.count(end)
    if start_count != 1 or end_count != 1:
        raise SystemExit(
            f"fail-closed {label}: start={start_count} end={end_count}"
        )
    start_index = text.index(start)
    end_index = text.index(end, start_index)
    return text[:start_index] + replacement + text[end_index:]


game_path = Path("src/game/EnergySwarmGame.tsx")
game = game_path.read_text()

# Imports: one shared boss engine, one fixed-count Worm rig.
game = replace_once(
    game,
    '''import {
  getBossChassisAttackWeight,
  getBossChassisProfile,
} from "./bossChassis";
import { resolveBossRematchDefeatAction } from "./infiniteRaidEscalation";''',
    '''import {
  getBossChassisAttackWeight,
  getBossChassisProfile,
} from "./bossChassis";
import {
  createWormSegmentChain,
  stepWormSegmentChainInPlace,
} from "./wormSegmentPhysics";
import { resolveBossRematchDefeatAction } from "./infiniteRaidEscalation";''',
    "worm physics import",
)

game = replace_once(
    game,
    '''import { 
  EnergySwarmCanvas, drawFoton, drawSwarmRoster, drawResources, 
  drawEnemiesList, drawProjectilesList 
} from "./EnergySwarmCanvas";''',
    '''import { 
  EnergySwarmCanvas, drawFoton, drawSwarmRoster, drawResources, 
  drawEnemiesList, drawProjectilesList, drawWormSegmentChain 
} from "./EnergySwarmCanvas";''',
    "worm renderer import",
)

game = replace_once(
    game,
    '  const shieldNodesRef = useRef<{ id: string; x: number; y: number; health: number; maxHealth: number; angle: number; flashTicks: number; motion: "ORBITAL" | "ANCHORED" | "SERPENTINE"; radiusX: number; radiusY: number; angularVelocityPerFrame: number; collisionRadius: number }[]>([]);',
    '  const shieldNodesRef = useRef<{ id: string; x: number; y: number; vx: number; vy: number; health: number; maxHealth: number; angle: number; flashTicks: number; motion: "ORBITAL" | "ANCHORED" | "SERPENTINE"; radiusX: number; radiusY: number; angularVelocityPerFrame: number; collisionRadius: number }[]>([]);',
    "weakpoint kinematic state",
)

# Raid boss IDs and dialogue become chassis-driven instead of Titan-hardcoded.
game = replace_once(
    game,
    '''      id:
        stage === "RAID_ESCALATION"
          ? `quantum_titan_${rematchProfile?.sector ?? "infinite"}`
          : isRematch''',
    '''      id:
        stage === "RAID_ESCALATION"
          ? `${chassisId.toLowerCase()}_${rematchProfile?.sector ?? "infinite"}`
          : isRematch''',
    "raid boss id",
)

game = replace_once(
    game,
    '''      stage === "RAID_ESCALATION"
        ? "¡RAID ESCALATION! El Quantum Titan ha entrado. Destruye sus cuatro segmentos y abre el núcleo."
        : isRematch''',
    '''      stage === "RAID_ESCALATION"
        ? `¡RAID ESCALATION! ${chassisProfile.displayName} ha entrado. Destruye ${chassisProfile.weakpoints.count} ${chassisProfile.weakpoints.hudLabel.toLowerCase()} y abre el núcleo.`
        : isRematch''',
    "raid intro dialogue",
)

# Replace the weakpoint spawner as one literal seam. Worm receives deterministic
# segment IDs/kinematics; Devourer/Titan preserve their historical geometry.
spawn_start = '  const spawnBossShieldNodes = (boss: Enemy) => {'
spawn_end = '  const spawnBossMinion = (type: EnemyType, x: number, y: number) => {'
spawn_replacement = '''  const spawnBossShieldNodes = (boss: Enemy) => {
    const chassis = getBossChassisProfile(boss.bossChassis ?? "DEVOURER");
    const weakpoints = chassis.weakpoints;
    const wormChain =
      weakpoints.motion === "SERPENTINE"
        ? createWormSegmentChain(
            weakpoints.count,
            { x: boss.x, y: boss.y },
            weakpoints.chainPhysics,
          )
        : [];

    shieldNodesRef.current = [];
    for (let i = 0; i < weakpoints.count; i++) {
      const angle = (i * Math.PI * 2) / weakpoints.count;
      const wormSegment = wormChain[i];
      shieldNodesRef.current.push({
        id: wormSegment?.id ?? Math.random().toString(),
        x: wormSegment?.x ?? boss.x + Math.cos(angle) * weakpoints.radiusX,
        y: wormSegment?.y ?? boss.y + Math.sin(angle) * weakpoints.radiusY,
        vx: wormSegment?.vx ?? 0,
        vy: wormSegment?.vy ?? 0,
        health: weakpoints.health,
        maxHealth: weakpoints.health,
        angle,
        flashTicks: 0,
        motion: weakpoints.motion,
        radiusX: weakpoints.radiusX,
        radiusY: weakpoints.radiusY,
        angularVelocityPerFrame: weakpoints.angularVelocityPerFrame,
        collisionRadius: weakpoints.collisionRadius,
      });
    }
    setBossShieldNodes(weakpoints.count);
    playEliteChargeSound();
    postDialogue(
      "COMPANION",
      chassis.id === "WORM_SEGMENTS"
        ? "¡SEIS SEGMENTOS DEL RIFT WORM ACTIVOS! Rompe la cadena de cabeza a cola."
        : chassis.id === "TITAN_CORE"
          ? "¡CUATRO SEGMENTOS DEL TITAN ACTIVOS! Destrúyelos para abrir el núcleo cuántico."
          : "¡EL DEVORADOR HA ACTIVADO ESCUDOS SEGMENTADOS! Destruye los tres nodos satélite.",
    );
  };

'''
game = replace_between(game, spawn_start, spawn_end, spawn_replacement, "shared weakpoint spawner")

# Worm segments never regenerate after destruction. Devourer/Titan re-arm exactly
# as before.
game = replace_once(
    game,
    '''        if (
          phase === 2 ||
          (chassisProfile.id === "TITAN_CORE" && phase <= 2)
        ) {
          spawnBossShieldNodes(boss);
        }''',
    '''        if (
          chassisProfile.id !== "WORM_SEGMENTS" &&
          (
            phase === 2 ||
            (chassisProfile.id === "TITAN_CORE" && phase <= 2)
          )
        ) {
          spawnBossShieldNodes(boss);
        }''',
    "worm no exposure rearm",
)

weakpoint_update_start = '    // 4. FIXED-COUNT BOSS WEAKPOINT POSITION UPDATES\n'
weakpoint_update_end = '    // Check Phase Transitions\n'
weakpoint_update = '''    // 4. FIXED-COUNT BOSS WEAKPOINT POSITION UPDATES
    if (shieldNodesRef.current.length > 0) {
      if (chassisProfile.id === "WORM_SEGMENTS") {
        stepWormSegmentChainInPlace(
          shieldNodesRef.current,
          { x: boss.x, y: boss.y },
          delta,
          chassisProfile.weakpoints.chainPhysics,
        );
      } else {
        shieldNodesRef.current.forEach((node) => {
          if (node.motion === "ORBITAL") {
            node.angle += node.angularVelocityPerFrame * (delta / 16.6);
          }
          node.x = boss.x + Math.cos(node.angle) * node.radiusX;
          node.y = boss.y + Math.sin(node.angle) * node.radiusY;
        });
      }

      shieldNodesRef.current.forEach((node) => {
        node.flashTicks = decayFrameTicks(node.flashTicks, delta);

        if (Math.random() < projectFrameProbability(0.1, delta)) {
          const px = node.x + (Math.random() - 0.5) * 8;
          const py = node.y + (Math.random() - 0.5) * 8;
          pushVfxParticle({
            id: Math.random().toString(),
            type: ParticleType.FUSION,
            x: px,
            y: py,
            vx: (boss.x - px) * 0.08,
            vy: (boss.y - py) * 0.08,
            color: chassisProfile.color,
            size: 1.5,
            alpha: 1.0,
            life: 15,
            maxLife: 15,
          });
        }
      });
    }

'''
game = replace_between(
    game,
    weakpoint_update_start,
    weakpoint_update_end,
    weakpoint_update,
    "serpentine weakpoint update",
)

# Phase labels are chassis-aware. Worm keeps surviving segments permanently;
# they are never respawned or cleared for free by phase transitions.
game = replace_once(
    game,
    '      setBossTransitionName(chassisProfile.id === "TITAN_CORE" ? "PHASE 2: SEGMENT FORTRESS" : "PHASE 2: COLLAPSE ENGINE");',
    '''      setBossTransitionName(
        chassisProfile.id === "WORM_SEGMENTS"
          ? "PHASE 2: RIFT COIL"
          : chassisProfile.id === "TITAN_CORE"
            ? "PHASE 2: SEGMENT FORTRESS"
            : "PHASE 2: COLLAPSE ENGINE",
      );''',
    "phase 2 label",
)

game = replace_once(
    game,
    '''      setBossAttackName(null);
      spawnBossShieldNodes(boss);
      return;
    }
    if ((boss.bossPhase || 1) === 2 && hpPercentage <= 0.35) {''',
    '''      setBossAttackName(null);
      if (chassisProfile.id !== "WORM_SEGMENTS") {
        spawnBossShieldNodes(boss);
      }
      return;
    }
    if ((boss.bossPhase || 1) === 2 && hpPercentage <= 0.35) {''',
    "phase 2 worm persistence",
)

game = replace_once(
    game,
    '      setBossTransitionName(chassisProfile.id === "TITAN_CORE" ? "PHASE 3: QUANTUM CORE" : "PHASE 3: SINGULARITY CROWN");',
    '''      setBossTransitionName(
        chassisProfile.id === "WORM_SEGMENTS"
          ? "PHASE 3: RIFT HEART"
          : chassisProfile.id === "TITAN_CORE"
            ? "PHASE 3: QUANTUM CORE"
            : "PHASE 3: SINGULARITY CROWN",
      );''',
    "phase 3 label",
)

game = replace_once(
    game,
    '''      setBossAttackName(null);
      shieldNodesRef.current = [];
      setBossShieldNodes(0);
      setIsCoreExposed(false);
      coreExposedTimerRef.current = 0;
      return;''',
    '''      setBossAttackName(null);
      if (chassisProfile.id !== "WORM_SEGMENTS") {
        shieldNodesRef.current = [];
        setBossShieldNodes(0);
        setIsCoreExposed(false);
        coreExposedTimerRef.current = 0;
      }
      return;''',
    "phase 3 worm persistence",
)

# Every boss chassis uses the same AI/damage/contact pipeline.
game = replace_once(
    game,
    '      if (enemy.type === EnemyType.BOSS_DEVOURER || enemy.type === EnemyType.BOSS_TITAN) {',
    '''      if (
        enemy.type === EnemyType.BOSS_DEVOURER ||
        enemy.type === EnemyType.BOSS_TITAN ||
        enemy.type === EnemyType.BOSS_WORM
      ) {''',
    "boss update dispatch",
)

game = replace_once(
    game,
    '''            if (
              enemy.type === EnemyType.BOSS_DEVOURER ||
              enemy.type === EnemyType.BOSS_TITAN
            ) {''',
    '''            if (
              enemy.type === EnemyType.BOSS_DEVOURER ||
              enemy.type === EnemyType.BOSS_TITAN ||
              enemy.type === EnemyType.BOSS_WORM
            ) {''',
    "boss direct damage",
)

game = replace_once(
    game,
    '''            if (enemy.type === EnemyType.BOSS_DEVOURER) {
              setBossHp(Math.max(0, enemy.health));''',
    '''            if (enemy.isBoss) {
              setBossHp(Math.max(0, enemy.health));''',
    "boss hp projection",
)

game = replace_once(
    game,
    '                  if (otherEnemy.type === EnemyType.BOSS_DEVOURER || otherEnemy.type === EnemyType.BOSS_TITAN) {',
    '                  if (otherEnemy.isBoss) {',
    "boss splash projection",
)

game = replace_once(
    game,
    '''      const isBossChassis =
        enemy.type === EnemyType.BOSS_DEVOURER ||
        enemy.type === EnemyType.BOSS_TITAN;''',
    '''      const isBossChassis =
        enemy.type === EnemyType.BOSS_DEVOURER ||
        enemy.type === EnemyType.BOSS_TITAN ||
        enemy.type === EnemyType.BOSS_WORM;''',
    "boss contact projection",
)

# Segment destruction reward is emitted before removal. Because Worm segments do
# not respawn, each deterministic segment ID can pay at most once per encounter.
destroy_start = '            if (node.health <= 0) {\n'
destroy_end = '              // If all nodes are destroyed, trigger core exposed vulnerability window!\n'
destroy_block = '''            if (node.health <= 0) {
              triggerExplosion(
                particlesRef.current,
                quality.maxParticles,
                ParticleType.ENEMY_DESTROYED,
                node.x,
                node.y,
                "#3b82f6",
                15,
                1.5
              );
              playHeavyImpactSound();
              const activeChassis = getBossChassisProfile(
                bossRef.current?.bossChassis ?? "DEVOURER",
              );
              const reward = activeChassis.weakpoints.destructionReward;
              if (reward) {
                scoreRef.current += reward.score;
                nanoCreditsRef.current += reward.nanoCredits;
                runNanoCreditsEarnedRef.current += reward.nanoCredits;
                setNanoCredits(nanoCreditsRef.current);
                addFloatingText(
                  `SEGMENT +${reward.score}`,
                  node.x,
                  node.y - 22,
                  activeChassis.color,
                );
              }
              shieldNodesRef.current.splice(s, 1);
              bossShieldNodesDestroyedRef.current += 1;
              setBossShieldNodes(shieldNodesRef.current.length);
              postDialogue(
                "COMPANION",
                activeChassis.id === "WORM_SEGMENTS"
                  ? "¡Segmento del Rift Worm destruido! La cadena pierde protección."
                  : activeChassis.id === "TITAN_CORE"
                    ? "¡Segmento del Titan destruido! Continúa abriendo el núcleo."
                    : "¡Nodo de escudo destruido! El núcleo del Devorador está más expuesto.",
              );
              
'''
game = replace_between(
    game,
    destroy_start,
    destroy_end,
    destroy_block,
    "weakpoint destruction reward",
)

game = replace_once(
    game,
    '''                postDialogue("COMPANION", activeChassis.id === "TITAN_CORE" ? "¡TODOS LOS SEGMENTOS CAÍDOS! ¡NÚCLEO CUÁNTICO EXPUESTO!" : "¡TODOS LOS NODOS CAÍDOS! ¡EL NÚCLEO ESTÁ EXPUESTO! ¡FUEGO TOTAL!");''',
    '''                postDialogue(
                  "COMPANION",
                  activeChassis.id === "WORM_SEGMENTS"
                    ? "¡CADENA DESTRUIDA! ¡EL CORAZÓN DEL RIFT WORM ESTÁ EXPUESTO!"
                    : activeChassis.id === "TITAN_CORE"
                      ? "¡TODOS LOS SEGMENTOS CAÍDOS! ¡NÚCLEO CUÁNTICO EXPUESTO!"
                      : "¡TODOS LOS NODOS CAÍDOS! ¡EL NÚCLEO ESTÁ EXPUESTO! ¡FUEGO TOTAL!",
                );''',
    "core exposure dialogue",
)

# The raid handoff message follows the projected chassis, not Titan text.
game = replace_once(
    game,
    '''          postDialogue(
            "COMPANION",
            "¡PRIMERA FIRMA DERROTADA! La masa de raid sigue activa: Quantum Titan entrando.",
          );
          spawnBoss(rematchProfile, "RAID_ESCALATION");''',
    '''          const raidChassis = getBossChassisProfile(
            rematchProfile.raidEscalation.chassis,
          );
          postDialogue(
            "COMPANION",
            `¡PRIMERA FIRMA DERROTADA! La masa de raid sigue activa: ${raidChassis.displayName} entrando.`,
          );
          spawnBoss(rematchProfile, "RAID_ESCALATION");''',
    "raid handoff dialogue",
)

# Draw the real fixed-count Worm chain in the existing world-space Canvas pass.
game = replace_once(
    game,
    '''    drawEnemiesList(
      ctx,
      enemiesRef.current,
      timeElapsedRef.current,
      playerPosRef.current,
      flashProfile,
    );

    // 5. Draw active Particles''',
    '''    drawEnemiesList(
      ctx,
      enemiesRef.current,
      timeElapsedRef.current,
      playerPosRef.current,
      flashProfile,
    );
    if (bossRef.current?.bossChassis === "WORM_SEGMENTS") {
      drawWormSegmentChain(
        ctx,
        bossRef.current,
        shieldNodesRef.current,
        timeElapsedRef.current,
      );
    }

    // 5. Draw active Particles''',
    "worm world render call",
)

game_path.write_text(game)


canvas_path = Path("src/game/EnergySwarmCanvas.tsx")
canvas = canvas_path.read_text()

# Add a distinct head silhouette to the existing boss switch.
canvas = replace_once(
    canvas,
    '      case EnemyType.BOSS_TITAN: {',
    '''      case EnemyType.BOSS_WORM: {
        const wormPulse = 0.9 + Math.sin(time * 0.0035) * 0.1;
        ctx.save();
        ctx.rotate(Math.sin(time * 0.0012) * 0.12);
        ctx.shadowColor = "#c084fc";
        ctx.shadowBlur = 20;
        ctx.fillStyle = "#170b2e";
        ctx.strokeStyle = "#c084fc";
        ctx.lineWidth = 2.3;
        ctx.beginPath();
        ctx.moveTo(enemy.size * 1.15, 0);
        ctx.lineTo(enemy.size * 0.22, -enemy.size * 0.8);
        ctx.lineTo(-enemy.size * 0.92, -enemy.size * 0.56);
        ctx.lineTo(-enemy.size * 1.08, 0);
        ctx.lineTo(-enemy.size * 0.92, enemy.size * 0.56);
        ctx.lineTo(enemy.size * 0.22, enemy.size * 0.8);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = `rgba(216,180,254,${wormPulse})`;
        ctx.beginPath();
        ctx.arc(enemy.size * 0.34, 0, enemy.size * 0.28, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "rgba(233,213,255,0.85)";
        ctx.lineWidth = 1.4;
        for (const side of [-1, 1]) {
          ctx.beginPath();
          ctx.moveTo(enemy.size * 0.72, side * enemy.size * 0.18);
          ctx.lineTo(enemy.size * 1.08, side * enemy.size * 0.34);
          ctx.stroke();
        }
        ctx.restore();
        break;
      }

      case EnemyType.BOSS_TITAN: {''',
    "worm boss silhouette",
)

# Render physical segment positions after the normal enemy pass. This helper has
# no WebGL dependency and performs only O(6) Canvas2D work.
projectile_marker = '''/**
 * Draws all projectiles.
 */
export function drawProjectilesList'''
worm_renderer = '''export interface WormSegmentRenderNode {
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  flashTicks: number;
}

export function drawWormSegmentChain(
  ctx: CanvasRenderingContext2D,
  boss: Enemy,
  segments: readonly WormSegmentRenderNode[],
  time: number,
) {
  if (boss.bossChassis !== "WORM_SEGMENTS" || segments.length === 0) return;

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "rgba(192,132,252,0.58)";
  ctx.lineWidth = 8;
  ctx.shadowColor = "#a855f7";
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.moveTo(boss.x, boss.y);
  segments.forEach((segment) => ctx.lineTo(segment.x, segment.y));
  ctx.stroke();

  segments.forEach((segment, index) => {
    const healthRatio = Math.max(0, Math.min(1, segment.health / Math.max(1, segment.maxHealth)));
    const radius = Math.max(9, boss.size * 0.32 - index * 0.45);
    const pulse = 1 + Math.sin(time * 0.0025 + index * 0.8) * 0.04;

    ctx.fillStyle = segment.flashTicks > 0 ? "#f5f3ff" : "#2e1065";
    ctx.strokeStyle = "#d8b4fe";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(segment.x, segment.y, radius * pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = `rgba(34,211,238,${0.35 + healthRatio * 0.6})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(
      segment.x,
      segment.y,
      radius * 0.66,
      -Math.PI / 2,
      -Math.PI / 2 + Math.PI * 2 * healthRatio,
    );
    ctx.stroke();
  });
  ctx.restore();
}

/**
 * Draws all projectiles.
 */
export function drawProjectilesList'''
canvas = replace_once(
    canvas,
    projectile_marker,
    worm_renderer,
    "worm segment renderer",
)

canvas_path.write_text(canvas)

print("ES-12H8 literal runtime patch applied")
