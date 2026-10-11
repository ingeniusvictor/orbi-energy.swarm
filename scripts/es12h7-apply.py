from pathlib import Path


def read(path: str) -> str:
    return Path(path).read_text()


def write(path: str, text: str) -> None:
    Path(path).write_text(text)


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"fail-closed {label}: expected 1 marker, found {count}")
    return text.replace(old, new, 1)


def replace_between(text: str, start: str, end: str, replacement: str, label: str) -> str:
    if text.count(start) != 1:
        raise SystemExit(f"fail-closed {label}: start count={text.count(start)}")
    start_index = text.index(start)
    end_index = text.find(end, start_index + len(start))
    if end_index < 0:
        raise SystemExit(f"fail-closed {label}: end marker missing")
    return text[:start_index] + replacement + text[end_index:]


# -----------------------------------------------------------------------------
# src/game/types.ts
# -----------------------------------------------------------------------------
path = "src/game/types.ts"
text = read(path)
text = replace_once(
    text,
    '  BOSS_DEVOURER = "BOSS_DEVOURER"\n}',
    '  BOSS_DEVOURER = "BOSS_DEVOURER",\n  BOSS_TITAN = "BOSS_TITAN"\n}',
    "EnemyType BOSS_TITAN",
)
identity_block = '''export type InfiniteBossIdentity =
  | "DEVOURER_ASCENDANT"
  | "NULL_ARCHITECT"
  | "RIFT_MATRIARCH"
  | "SIEGE_CATHEDRAL";'''
text = replace_once(
    text,
    identity_block,
    identity_block
    + '''

export type BossChassisId = "DEVOURER" | "TITAN_CORE";
export type BossEncounterStage = "PRIMARY" | "RAID_ESCALATION";''',
    "boss chassis types",
)
text = replace_once(
    text,
    "  infiniteBossIdentity?: InfiniteBossIdentity;\n",
    "  infiniteBossIdentity?: InfiniteBossIdentity;\n"
    "  bossChassis?: BossChassisId;\n"
    "  bossEncounterStage?: BossEncounterStage;\n"
    "  milestoneSector?: number;\n",
    "Enemy boss runtime metadata",
)
write(path, text)


# -----------------------------------------------------------------------------
# Historical BOSS_REMATCH fixture
# -----------------------------------------------------------------------------
path = "tests/runtime-boss-rematch-gate.test.ts"
text = read(path)
text = replace_once(
    text,
    '  bossIdentity: "DEVOURER_ASCENDANT",\n',
    '  bossIdentity: "DEVOURER_ASCENDANT",\n'
    '  bossChassis: "DEVOURER",\n'
    '  bossEncounterStage: "PRIMARY",\n'
    '  raidEscalation: null,\n',
    "historical rematch fixture",
)
write(path, text)


# -----------------------------------------------------------------------------
# Canvas: distinct capital-guardian silhouette using the existing render pass
# -----------------------------------------------------------------------------
path = "src/game/EnergySwarmCanvas.tsx"
text = read(path)
titan_case = '''      case EnemyType.BOSS_TITAN: {
        const titanPulse = 0.82 + Math.sin(time * 0.004) * 0.18;
        ctx.save();
        ctx.rotate(Math.sin(time * 0.00045) * 0.05);

        ctx.shadowColor = "#67e8f9";
        ctx.shadowBlur = 22;
        ctx.fillStyle = "#071827";
        ctx.strokeStyle = "#67e8f9";
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(-enemy.size * 1.45, -enemy.size * 0.18);
        ctx.lineTo(-enemy.size * 0.72, -enemy.size * 0.62);
        ctx.lineTo(enemy.size * 0.72, -enemy.size * 0.62);
        ctx.lineTo(enemy.size * 1.45, -enemy.size * 0.18);
        ctx.lineTo(enemy.size * 1.12, enemy.size * 0.52);
        ctx.lineTo(-enemy.size * 1.12, enemy.size * 0.52);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        const ports = [
          [-1.25, 0],
          [0, -0.74],
          [1.25, 0],
          [0, 0.74],
        ] as const;
        ports.forEach(([px, py]) => {
          ctx.fillStyle = "#164e63";
          ctx.strokeStyle = "#a5f3fc";
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.arc(
            px * enemy.size,
            py * enemy.size,
            enemy.size * 0.16,
            0,
            Math.PI * 2,
          );
          ctx.fill();
          ctx.stroke();
        });

        const coreGradient = ctx.createRadialGradient(
          0,
          0,
          0,
          0,
          0,
          enemy.size * 0.46,
        );
        coreGradient.addColorStop(0, `rgba(255,255,255,${titanPulse})`);
        coreGradient.addColorStop(0.3, "rgba(103,232,249,0.95)");
        coreGradient.addColorStop(1, "rgba(8,47,73,0.15)");
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(0, 0, enemy.size * 0.46, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "rgba(165,243,252,0.72)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(
          0,
          0,
          enemy.size * 1.18,
          enemy.size * 0.72,
          0,
          0,
          Math.PI * 2,
        );
        ctx.stroke();
        ctx.restore();
        break;
      }

'''
text = replace_once(
    text,
    "      case EnemyType.BOSS_DEVOURER: {",
    titan_case + "      case EnemyType.BOSS_DEVOURER: {",
    "Titan Canvas case",
)
write(path, text)


# -----------------------------------------------------------------------------
# EnergySwarmGame: shared boss chassis path
# -----------------------------------------------------------------------------
path = "src/game/EnergySwarmGame.tsx"
text = read(path)
text = replace_once(
    text,
    "  type OrbiAffinity, type OrbiCombatRole, type OrbiEnergyId\n",
    "  type OrbiAffinity, type OrbiCombatRole, type OrbiEnergyId, type BossEncounterStage\n",
    "BossEncounterStage import",
)
family_import = '''import {
  getInfiniteBossAttackWeight,
  getInfiniteBossFamilyProfile,
} from "./infiniteBossFamily";'''
text = replace_once(
    text,
    family_import,
    family_import
    + '''
import {
  getBossChassisAttackWeight,
  getBossChassisProfile,
} from "./bossChassis";
import { resolveBossRematchDefeatAction } from "./infiniteRaidEscalation";''',
    "boss chassis imports",
)
text = replace_once(
    text,
    "  const bossRef = useRef<Enemy | null>(null);\n",
    "  const bossRef = useRef<Enemy | null>(null);\n"
    "  const activeBossRematchProfileRef = useRef<InfiniteBossRematchProfile | null>(null);\n",
    "active rematch profile ref",
)
text = replace_once(
    text,
    "  const shieldNodesRef = useRef<{ id: string; x: number; y: number; health: number; maxHealth: number; angle: number; flashTicks: number }[]>([]);",
    "  const shieldNodesRef = useRef<{ id: string; x: number; y: number; health: number; maxHealth: number; angle: number; flashTicks: number; motion: \"ORBITAL\" | \"ANCHORED\"; radiusX: number; radiusY: number; angularVelocityPerFrame: number; collisionRadius: number }[]>([]);",
    "weakpoint ref shape",
)

# Reset the active raid profile whenever the rematch gate is truly reset.
gate_reset = '''    bossRematchGateRef.current =
      createRuntimeBossRematchGateState();'''
reset_count = text.count(gate_reset)
if reset_count < 2:
    raise SystemExit(f"fail-closed gate reset count: expected >=2, found {reset_count}")
text = text.replace(
    gate_reset,
    gate_reset + "\n    activeBossRematchProfileRef.current = null;",
)

spawn_start = "  // --- SPAWN GIANT DEVOURER BOSS ---\n"
spawn_end = "  const skipBossIntro = () => {"
new_spawn = '''  // --- SPAWN SHARED BOSS CHASSIS ---
  const spawnBoss = (
    rematchProfile: InfiniteBossRematchProfile | null = null,
    stage: BossEncounterStage = "PRIMARY",
  ) => {
    enemiesRef.current = [];
    hazardZonesRef.current = [];

    const isRematch = rematchProfile !== null;
    const raidProfile =
      stage === "RAID_ESCALATION"
        ? (rematchProfile?.raidEscalation ?? null)
        : null;
    if (stage === "RAID_ESCALATION" && !raidProfile) return;

    const chassisId = raidProfile?.chassis ?? "DEVOURER";
    const chassisProfile = getBossChassisProfile(chassisId);
    const familyProfile =
      rematchProfile && stage === "PRIMARY"
        ? getInfiniteBossFamilyProfile(rematchProfile.bossIdentity)
        : null;
    bossActiveRef.current = true;

    if (isRematch && stage === "PRIMARY") {
      activeBossRematchProfileRef.current = rematchProfile;
    }

    if (!isRematch) {
      bossSessionStartTimeRef.current = Date.now();
      const currentStats = statsRef.current || stats;
      const nextStats = {
        ...currentStats,
        bossAttempts: (currentStats.bossAttempts || 0) + 1,
      };
      updateStatsAndSave(nextStats);
    }

    const healthMultiplier =
      raidProfile?.healthMultiplier ??
      rematchProfile?.healthMultiplier ??
      1;
    const health = chassisProfile.baseHealth * healthMultiplier;
    const damageMultiplier =
      raidProfile?.damageMultiplier ?? rematchProfile?.damageMultiplier;
    const attackRateMultiplier =
      raidProfile?.attackRateMultiplier ?? rematchProfile?.attackRateMultiplier;
    const rewardMultiplier =
      raidProfile?.rewardMultiplier ?? rematchProfile?.rewardMultiplier;

    const boss: Enemy = {
      id:
        stage === "RAID_ESCALATION"
          ? `quantum_titan_${rematchProfile?.sector ?? "infinite"}`
          : isRematch
            ? `${rematchProfile?.bossIdentity.toLowerCase() ?? "infinite_boss"}_${rematchProfile?.sector ?? "infinite"}`
            : "blackout_devourer_boss",
      type: chassisProfile.enemyType,
      x: WORLD_WIDTH / 2,
      y: -80,
      vx: 0,
      vy: 0,
      health,
      maxHealth: health,
      speed: 0,
      size: chassisProfile.size,
      color: familyProfile?.color ?? chassisProfile.color,
      shootCooldown: 100,
      pulseCooldown: 180,
      contactDamageCooldown: 0,
      isDead: false,
      isBoss: true,
      bossPhase: 1,
      flashTicks: 0,
      milestoneKind: isRematch ? "BOSS_REMATCH" : undefined,
      milestoneId: rematchProfile?.milestoneId,
      milestoneSector: rematchProfile?.sector,
      infiniteBossIdentity:
        stage === "PRIMARY" ? rematchProfile?.bossIdentity : undefined,
      bossChassis: chassisId,
      bossEncounterStage: stage,
      milestoneContactDamageMultiplier: damageMultiplier,
      milestoneDamageMultiplier: damageMultiplier,
      milestoneAttackRateMultiplier: attackRateMultiplier,
      milestoneRewardMultiplier: rewardMultiplier,
    };

    enemiesRef.current.push(boss);
    bossRef.current = boss;

    bossIntroTimeRef.current = chassisProfile.introDurationMs;
    setBossIntroTime(chassisProfile.introDurationMs);
    setBossHp(health);
    setBossMaxHp(health);
    setBossPhase(1);
    setBossAttackName(null);
    setBossShieldNodes(0);
    setIsCoreExposed(false);
    setBossTransitionName(null);

    bossAttackTimerRef.current = 1000;
    bossCurrentAttackRef.current = null;
    bossAttackTelegraphRef.current = 0;
    bossAttackDurationRef.current = 0;
    bossAttackAngleRef.current = 0;
    bossAttackTargetPosRef.current = {
      x: WORLD_WIDTH / 2,
      y: WORLD_HEIGHT / 2,
    };
    shieldNodesRef.current = [];
    coreExposedTimerRef.current = 0;
    phaseTransitionTimerRef.current = 0;
    bossSummonTimersRef.current = {};
    bossHunterWaveCooldownRef.current = 8000;
    bossHunterWaveTelegraphRef.current = 0;
    gravityWellPulseTimerRef.current = 0;
    shownThreatIntelsRef.current = [];

    triggerExplosion(
      particlesRef.current,
      getQualityConfig(stats.qualityPreset).maxParticles,
      ParticleType.BOSS_ENTRY,
      WORLD_WIDTH / 2,
      WORLD_HEIGHT / 2,
      chassisProfile.color,
      40,
    );

    if (isRematch && stage === "PRIMARY") {
      bossRematchGateRef.current = markRuntimeBossRematchSpawned(
        bossRematchGateRef.current,
      );
    }

    if (isRematch) {
      setWaveName(
        stage === "RAID_ESCALATION"
          ? `${chassisProfile.displayName.toUpperCase()} // RAID SECTOR ${rematchProfile?.sector ?? currentWaveRef.current}`
          : `${familyProfile?.displayName.toUpperCase() ?? "INFINITE BOSS"} // SECTOR ${rematchProfile?.sector ?? currentWaveRef.current}`,
      );
    }

    startBgm("HIGH_INTENSITY");
    playBossArrivalSound();
    postDialogue(
      "COMPANION",
      stage === "RAID_ESCALATION"
        ? "¡RAID ESCALATION! El Quantum Titan ha entrado. Destruye sus cuatro segmentos y abre el núcleo."
        : isRematch
          ? (familyProfile?.introDialogue ?? "¡RESONANCIA HOSTIL RECURRENTE!")
          : "¡ALERTA! Concentración de energía Blackout masiva en el sector central. ¡El Devorador está entrando!",
    );

    if (stage === "RAID_ESCALATION") {
      spawnBossShieldNodes(boss);
    }
  };

'''
text = replace_between(text, spawn_start, spawn_end, new_spawn, "shared boss spawn")

skip_start = "  const skipBossIntro = () => {"
skip_end = "  const spawnBossShieldNodes = (boss: Enemy) => {"
skip_new = '''  const skipBossIntro = () => {
    if (bossIntroTimeRef.current === null) return;
    bossIntroTimeRef.current = null;
    setBossIntroTime(null);
    if (bossRef.current) {
      bossRef.current.y = 150;
    }
    playHeavyImpactSound();
    const activeChassis = getBossChassisProfile(
      bossRef.current?.bossChassis ?? "DEVOURER",
    );
    postDialogue(
      "COMPANION",
      `¡ANOMALÍA ESTABILIZADA! Entrando en combate activo contra ${activeChassis.displayName}.`,
    );
  };

'''
text = replace_between(text, skip_start, skip_end, skip_new, "dynamic boss intro skip")

weakpoint_start = "  const spawnBossShieldNodes = (boss: Enemy) => {"
weakpoint_end = "  const spawnBossMinion = (type: EnemyType, x: number, y: number) => {"
weakpoint_new = '''  const spawnBossShieldNodes = (boss: Enemy) => {
    const chassis = getBossChassisProfile(boss.bossChassis ?? "DEVOURER");
    const weakpoints = chassis.weakpoints;
    shieldNodesRef.current = [];
    for (let i = 0; i < weakpoints.count; i++) {
      const angle = (i * Math.PI * 2) / weakpoints.count;
      shieldNodesRef.current.push({
        id: Math.random().toString(),
        x: boss.x + Math.cos(angle) * weakpoints.radiusX,
        y: boss.y + Math.sin(angle) * weakpoints.radiusY,
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
      chassis.id === "TITAN_CORE"
        ? "¡CUATRO SEGMENTOS DEL TITAN ACTIVOS! Destrúyelos para abrir el núcleo cuántico."
        : "¡EL DEVORADOR HA ACTIVADO ESCUDOS SEGMENTADOS! Destruye los tres nodos satélite.",
    );
  };

'''
text = replace_between(
    text,
    weakpoint_start,
    weakpoint_end,
    weakpoint_new,
    "data-driven weakpoints",
)

text = replace_once(
    text,
    "  const updateBossAI = (boss: Enemy, delta: number) => {\n    // 1. INTRO CINEMATIC TICK",
    "  const updateBossAI = (boss: Enemy, delta: number) => {\n"
    "    const chassisProfile = getBossChassisProfile(boss.bossChassis ?? \"DEVOURER\");\n\n"
    "    // 1. INTRO CINEMATIC TICK",
    "boss AI chassis profile",
)
text = replace_once(
    text,
    "bossIntroTimeRef.current) / BLACKOUT_DEVOURER_CANON.introDuration) * 230",
    "bossIntroTimeRef.current) / chassisProfile.introDurationMs) * 230",
    "intro duration chassis",
)
text = replace_once(
    text,
    'postDialogue("COMPANION", "¡ANOMALÍA ESTABILIZADA! Firma del Blackout Devourer confirmada.");',
    'postDialogue("COMPANION", `¡ANOMALÍA ESTABILIZADA! Firma de ${chassisProfile.displayName} confirmada.`);',
    "intro completion copy",
)
old_rearm = '''        if ((boss.bossPhase || 1) === 2) {
          spawnBossShieldNodes(boss);
        }'''
new_rearm = '''        const phase = boss.bossPhase || 1;
        if (
          phase === 2 ||
          (chassisProfile.id === "TITAN_CORE" && phase <= 2)
        ) {
          spawnBossShieldNodes(boss);
        }'''
text = replace_once(text, old_rearm, new_rearm, "weakpoint rearm policy")

orbit_start = "    // 4. SHIELD NODES POSITION ORBIT UPDATES\n"
orbit_end = "    // Check Phase Transitions\n"
orbit_new = '''    // 4. FIXED-COUNT BOSS WEAKPOINT POSITION UPDATES
    if (shieldNodesRef.current.length > 0) {
      shieldNodesRef.current.forEach((node) => {
        if (node.motion === "ORBITAL") {
          node.angle += node.angularVelocityPerFrame * (delta / 16.6);
        }
        node.x = boss.x + Math.cos(node.angle) * node.radiusX;
        node.y = boss.y + Math.sin(node.angle) * node.radiusY;

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
text = replace_between(text, orbit_start, orbit_end, orbit_new, "weakpoint movement")

text = replace_once(
    text,
    'setBossTransitionName("PHASE 2: COLLAPSE ENGINE");',
    'setBossTransitionName(chassisProfile.id === "TITAN_CORE" ? "PHASE 2: SEGMENT FORTRESS" : "PHASE 2: COLLAPSE ENGINE");',
    "phase2 chassis label",
)
text = replace_once(
    text,
    'setBossTransitionName("PHASE 3: SINGULARITY CROWN");',
    'setBossTransitionName(chassisProfile.id === "TITAN_CORE" ? "PHASE 3: QUANTUM CORE" : "PHASE 3: SINGULARITY CROWN");',
    "phase3 chassis label",
)

# Hunter Wave is a Devourer-only mechanic. Bound the whole fixed package.
hunter_start = "    // H3 HUNTER WAVE: bounded support ability. It pauses regular attack\n"
hunter_end = "    // 7. ACTIVE ATTACK COOLDOWNS / SELECTION\n"
if text.count(hunter_start) != 1 or text.count(hunter_end) != 1:
    raise SystemExit(
        f"fail-closed Hunter Wave markers start={text.count(hunter_start)} end={text.count(hunter_end)}"
    )
hi = text.index(hunter_start)
he = text.index(hunter_end, hi)
hunter_block = text[hi:he]
text = text[:hi] + "    if (chassisProfile.id === \"DEVOURER\") {\n" + hunter_block + "    }\n\n" + text[he:]

# The earlier ordinary summon package is also Devourer-only.
summon_start = "    // 6. SUMMON ADDS\n"
summon_end = "    // H5 boss-family specialist support reuses the existing summon timer map and hard enemy cap.\n"
if text.count(summon_start) != 1 or text.count(summon_end) != 1:
    raise SystemExit(
        f"fail-closed summon markers start={text.count(summon_start)} end={text.count(summon_end)}"
    )
si = text.index(summon_start)
se = text.index(summon_end, si)
summon_block = text[si:se]
text = text[:si] + "    if (chassisProfile.id === \"DEVOURER\") {\n" + summon_block + "    }\n\n" + text[se:]

reduce_old = '''              getInfiniteBossAttackWeight(
                boss.infiniteBossIdentity,
                a.id,
                a.weight,
              ),'''
reduce_new = '''              getBossChassisAttackWeight(
                boss.bossChassis,
                a.id,
                getInfiniteBossAttackWeight(
                  boss.infiniteBossIdentity,
                  a.id,
                  a.weight,
                ),
              ),'''
text = replace_once(text, reduce_old, reduce_new, "weighted attack total")
loop_old = '''            roll -= getInfiniteBossAttackWeight(
              boss.infiniteBossIdentity,
              possibleAttacks[i].id,
              possibleAttacks[i].weight,
            );'''
loop_new = '''            roll -= getBossChassisAttackWeight(
              boss.bossChassis,
              possibleAttacks[i].id,
              getInfiniteBossAttackWeight(
                boss.infiniteBossIdentity,
                possibleAttacks[i].id,
                possibleAttacks[i].weight,
              ),
            );'''
text = replace_once(text, loop_old, loop_new, "weighted attack roll")
old_name = '''            const activeBossName = boss.infiniteBossIdentity
              ? getInfiniteBossFamilyProfile(boss.infiniteBossIdentity).displayName
              : "Devorador";'''
new_name = '''            const activeBossName = boss.infiniteBossIdentity
              ? getInfiniteBossFamilyProfile(boss.infiniteBossIdentity).displayName
              : getBossChassisProfile(boss.bossChassis ?? "DEVOURER").displayName;'''
text = replace_once(text, old_name, new_name, "boss warning name")

text = replace_once(
    text,
    "      if (enemy.type === EnemyType.BOSS_DEVOURER) {\n        updateBossAI(enemy, delta);",
    "      if (enemy.type === EnemyType.BOSS_DEVOURER || enemy.type === EnemyType.BOSS_TITAN) {\n        updateBossAI(enemy, delta);",
    "Titan updateBossAI adoption",
)
other_boss = "if (otherEnemy.type === EnemyType.BOSS_DEVOURER) {"
if text.count(other_boss) < 1:
    raise SystemExit("fail-closed: boss splash tracker marker missing")
text = text.replace(
    other_boss,
    "if (otherEnemy.type === EnemyType.BOSS_DEVOURER || otherEnemy.type === EnemyType.BOSS_TITAN) {",
)

text = replace_once(
    text,
    "          const shieldCollisionRadius = 14 + proj.size;",
    "          const shieldCollisionRadius = node.collisionRadius + proj.size;",
    "weakpoint collision radius",
)
text = replace_once(
    text,
    '              postDialogue("COMPANION", "¡Nodo de escudo destruido! El núcleo del Devorador está más expuesto.");',
    '              const activeChassis = getBossChassisProfile(bossRef.current?.bossChassis ?? "DEVOURER");\n'
    '              postDialogue("COMPANION", activeChassis.id === "TITAN_CORE" ? "¡Segmento del Titan destruido! Continúa abriendo el núcleo." : "¡Nodo de escudo destruido! El núcleo del Devorador está más expuesto.");',
    "weakpoint destruction copy",
)
text = replace_once(
    text,
    "                coreExposedTimerRef.current = 4000; // 4.0s vulnerability window",
    '                const activeChassis = getBossChassisProfile(bossRef.current?.bossChassis ?? "DEVOURER");\n'
    "                coreExposedTimerRef.current = activeChassis.weakpoints.exposureDurationMs;",
    "core exposure duration",
)
text = replace_once(
    text,
    '                postDialogue("COMPANION", "¡TODOS LOS NODOS CAÍDOS! ¡EL NÚCLEO ESTÁ EXPUESTO! ¡FUEGO TOTAL!");',
    '                postDialogue("COMPANION", activeChassis.id === "TITAN_CORE" ? "¡TODOS LOS SEGMENTOS CAÍDOS! ¡NÚCLEO CUÁNTICO EXPUESTO!" : "¡TODOS LOS NODOS CAÍDOS! ¡EL NÚCLEO ESTÁ EXPUESTO! ¡FUEGO TOTAL!");',
    "core exposure copy",
)
boss_damage_old = '''            if (enemy.type === EnemyType.BOSS_DEVOURER) {
              if (shieldNodesRef.current.length > 0) {
                isShieldBlock = true;
                damageToApply *= 0.25; // 75% reduction
              } else if (coreExposedTimerRef.current > 0) {
                isCrit = true;
                damageToApply *= 2.0; // 2x vulnerability damage!
              }
            }'''
boss_damage_new = '''            if (
              enemy.type === EnemyType.BOSS_DEVOURER ||
              enemy.type === EnemyType.BOSS_TITAN
            ) {
              const chassis = getBossChassisProfile(
                enemy.bossChassis ?? "DEVOURER",
              );
              if (shieldNodesRef.current.length > 0) {
                isShieldBlock = true;
                damageToApply *= chassis.weakpoints.protectedDamageMultiplier;
              } else if (coreExposedTimerRef.current > 0) {
                isCrit = true;
                damageToApply *= chassis.weakpoints.exposedDamageMultiplier;
              }
            }'''
text = replace_once(text, boss_damage_old, boss_damage_new, "boss weakpoint damage profile")
contact_old = '''      const baseDamage =
        enemy.type === EnemyType.BOSS_DEVOURER
          ? 25
          : 15;
      if (enemy.type === EnemyType.BOSS_DEVOURER) {'''
contact_new = '''      const isBossChassis =
        enemy.type === EnemyType.BOSS_DEVOURER ||
        enemy.type === EnemyType.BOSS_TITAN;
      const baseDamage = isBossChassis ? 25 : 15;
      if (isBossChassis) {'''
text = replace_once(text, contact_old, contact_new, "boss contact route")

# Raid defeat sequencing: primary raid boss does not resolve the gate; Titan does.
defeat_start = '      if (boss?.milestoneKind === "BOSS_REMATCH") {'
defeat_end = "      bossSessionEndTimeRef.current = Date.now();"
if text.count(defeat_start) != 1:
    raise SystemExit(f"fail-closed rematch defeat branches={text.count(defeat_start)}")
di = text.index(defeat_start)
de = text.find(defeat_end, di)
if de < 0:
    raise SystemExit("fail-closed campaign defeat marker missing")
defeat_new = '''      if (boss?.milestoneKind === "BOSS_REMATCH") {
        const rematchProfile = activeBossRematchProfileRef.current;
        const defeatAction = resolveBossRematchDefeatAction(
          boss.bossEncounterStage,
          rematchProfile?.raidEscalation,
        );

        if (
          defeatAction === "SPAWN_RAID_ESCALATION" &&
          rematchProfile?.raidEscalation
        ) {
          bossActiveRef.current = false;
          bossRef.current = null;
          enemiesRef.current = [];
          projectilesRef.current = [];
          hazardZonesRef.current = [];
          shieldNodesRef.current = [];
          bossCurrentAttackRef.current = null;
          bossIntroTimeRef.current = null;
          setBossAttackName(null);
          setBossIntroTime(null);
          setBossTransitionName(null);
          setBossShieldNodes(0);
          setIsCoreExposed(false);
          postDialogue(
            "COMPANION",
            "¡PRIMERA FIRMA DERROTADA! La masa de raid sigue activa: Quantum Titan entrando.",
          );
          spawnBoss(rematchProfile, "RAID_ESCALATION");
          return;
        }

        bossRematchGateRef.current = markRuntimeBossRematchDefeated(
          bossRematchGateRef.current,
        );
        persistInfiniteMilestoneDefeat(boss);
        activeBossRematchProfileRef.current = null;
        bossActiveRef.current = false;
        bossRef.current = null;
        enemiesRef.current = [];
        projectilesRef.current = [];
        hazardZonesRef.current = [];
        shieldNodesRef.current = [];
        bossCurrentAttackRef.current = null;
        bossIntroTimeRef.current = null;
        setBossAttackName(null);
        setBossIntroTime(null);
        setBossTransitionName(null);
        setBossShieldNodes(0);
        setIsCoreExposed(false);

        const defeatedFamily = boss.infiniteBossIdentity
          ? getInfiniteBossFamilyProfile(boss.infiniteBossIdentity)
          : null;
        const defeatedChassis = getBossChassisProfile(
          boss.bossChassis ?? "DEVOURER",
        );
        addFloatingText(
          defeatedFamily?.defeatLabel ??
            `${defeatedChassis.displayName.toUpperCase()} CLEARED`,
          playerPosRef.current.x,
          playerPosRef.current.y - 54,
          defeatedFamily?.color ?? defeatedChassis.color,
        );
        postDialogue(
          "COMPANION",
          defeatedFamily?.defeatDialogue ??
            `¡${defeatedChassis.displayName.toUpperCase()} NEUTRALIZADO! Raid milestone estabilizado.`,
        );
        return;
      }

'''
text = text[:di] + defeat_new + text[de:]

text = replace_once(
    text,
    '                    bossLabelsMode={stats.bossLabelsMode || "FULL"}\n                    onSkipIntro={skipBossIntro}',
    '                    bossLabelsMode={stats.bossLabelsMode || "FULL"}\n'
    '                    bossChassis={bossRef.current?.bossChassis ?? "DEVOURER"}\n'
    '                    infiniteBossIdentity={bossRef.current?.infiniteBossIdentity}\n'
    '                    onSkipIntro={skipBossIntro}',
    "Boss HUD live profile props",
)
write(path, text)


# -----------------------------------------------------------------------------
# Existing adoption tests: preserve H5 contracts while recognizing chassis stage
# -----------------------------------------------------------------------------
path = "tests/infinite-boss-family-runtime.test.ts"
text = read(path)
text = replace_once(
    text,
    r'assert.match(game, /infiniteBossIdentity: rematchProfile\?\.bossIdentity/);',
    r'assert.match(game, /stage === "PRIMARY"[\s\S]*rematchProfile\?\.bossIdentity/);',
    "H5 family identity adoption regex",
)
write(path, text)

path = "tests/runtime-boss-rematch-adoption.test.ts"
text = read(path)
text = replace_once(
    text,
    '''  assert.match(
    spawn,
    /BLACKOUT_DEVOURER_CANON\.maxHealth \*[\s\S]*rematchProfile\?\.healthMultiplier/,
  );''',
    '''  assert.match(
    spawn,
    /chassisProfile\.baseHealth \* healthMultiplier/,
  );''',
    "spawn health adoption test",
)
text = replace_once(
    text,
    '''  assert.match(
    spawn,
    /infiniteBossIdentity: rematchProfile\?\.bossIdentity/,
  );''',
    '''  assert.match(
    spawn,
    /infiniteBossIdentity:[\s\S]*stage === "PRIMARY"[\s\S]*rematchProfile\?\.bossIdentity/,
  );''',
    "spawn identity adoption test",
)
text = replace_once(
    text,
    '''  assert.match(
    rematchBranch,
    /markRuntimeBossRematchDefeated/,
  );''',
    '''  assert.match(
    rematchBranch,
    /resolveBossRematchDefeatAction/,
  );
  assert.match(rematchBranch, /SPAWN_RAID_ESCALATION/);
  assert.match(
    rematchBranch,
    /spawnBoss\(rematchProfile, "RAID_ESCALATION"\)/,
  );
  assert.match(
    rematchBranch,
    /markRuntimeBossRematchDefeated/,
  );''',
    "rematch defeat adoption expectations",
)
text = replace_once(
    text,
    '''  assert.match(
    types,
    /infiniteBossIdentity\?: InfiniteBossIdentity/,
  );''',
    '''  assert.match(
    types,
    /infiniteBossIdentity\?: InfiniteBossIdentity/,
  );
  assert.match(types, /bossChassis\?: BossChassisId/);
  assert.match(types, /bossEncounterStage\?: BossEncounterStage/);''',
    "runtime metadata adoption expectations",
)
write(path, text)


# -----------------------------------------------------------------------------
# H7 source-adoption regression
# -----------------------------------------------------------------------------
Path("tests/titan-runtime-adoption.test.ts").write_text(
    '''import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const game = readFileSync(
  new URL("../src/game/EnergySwarmGame.tsx", import.meta.url),
  "utf8",
);
const canvas = readFileSync(
  new URL("../src/game/EnergySwarmCanvas.tsx", import.meta.url),
  "utf8",
);
const hud = readFileSync(
  new URL("../src/components/BossHudOverlay.tsx", import.meta.url),
  "utf8",
);

test("Titan shares the certified boss engine instead of creating a second loop", () => {
  assert.match(
    game,
    /EnemyType\.BOSS_DEVOURER \|\| enemy\.type === EnemyType\.BOSS_TITAN/,
  );
  assert.match(game, /spawnBoss\(rematchProfile, "RAID_ESCALATION"\)/);
  assert.match(game, /activeBossRematchProfileRef/);
  assert.doesNotMatch(game, /updateTitanAI/);
});

test("Titan uses fixed weakpoints and existing projectile collision budget", () => {
  assert.match(game, /node\.collisionRadius \+ proj\.size/);
  assert.match(game, /chassis\.weakpoints\.protectedDamageMultiplier/);
  assert.match(game, /chassis\.weakpoints\.exposedDamageMultiplier/);
  assert.match(game, /motion: weakpoints\.motion/);
});

test("Titan presentation is chassis-aware without a second WebGL scene", () => {
  assert.match(canvas, /case EnemyType\.BOSS_TITAN/);
  assert.match(canvas, /titanPulse/);
  assert.match(hud, /data-boss-chassis/);
  assert.match(hud, /chassis\.weakpoints\.hudLabel/);
  assert.doesNotMatch(canvas, /THREE|WebGLRenderer/);
});
'''
)

print("ES-12H7 patch applied successfully")
