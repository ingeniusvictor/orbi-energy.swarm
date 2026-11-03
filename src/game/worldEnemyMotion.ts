import { EnemyType, type Enemy } from "./types";

/**
 * EN-VIS-01 — Visual-only identity for the three Mundo Nuevo enemy families.
 * Attack states and hit flashes belong to the original engine: this module
 * never advances timers, creates projectiles, touches HP, or owns particles.
 * Boss bodies keep their existing authored choreography and telegraphs.
 */
export type WorldEnemyFamily = "ASTERIA" | "FERRUM" | "PYRA";

export interface WorldEnemyMotion {
  readonly family: WorldEnemyFamily;
  readonly accent: string;
  readonly bobY: number;
  readonly tilt: number;
  readonly scaleX: number;
  readonly scaleY: number;
  readonly warning: number;
  readonly hit: number;
}

const TAU = Math.PI * 2;
const clamp = (v: number, low: number, high: number) =>
  Math.min(high, Math.max(low, v));

export function worldEnemyFamily(type: EnemyType): WorldEnemyFamily | null {
  switch (type) {
    case EnemyType.RAILCUTTER:
    case EnemyType.SKY_SPECTER:
    case EnemyType.BEACON_PRISM:
    case EnemyType.ION_SAIL:
    case EnemyType.SPAN_WARDEN:
    case EnemyType.BOSS_ARCHON:
      return "ASTERIA";
    case EnemyType.SHADE_GEAR:
    case EnemyType.M9_WELDER:
    case EnemyType.FOUNDRY_CLAW:
    case EnemyType.OXIDE_MODULATOR:
    case EnemyType.FERRITE_FOREMAN:
    case EnemyType.BOSS_OMEGA:
      return "FERRUM";
    case EnemyType.EMBER_SKATER:
    case EnemyType.SLAG_SPEAR:
    case EnemyType.LAVA_DREDGER:
    case EnemyType.CINDERLING:
    case EnemyType.CALDERA_SERAPH:
    case EnemyType.BOSS_SOLFERNAX:
      return "PYRA";
    default:
      return null;
  }
}

function attackCue(enemy: Enemy): "WARNING" | "ACTIVE" | "NONE" {
  let stage: string | undefined;
  switch (enemy.type) {
    case EnemyType.RAILCUTTER: stage = enemy.railcutterAttack?.phase; break;
    case EnemyType.SKY_SPECTER: stage = enemy.skySpecterAttack?.phase; break;
    case EnemyType.BEACON_PRISM: stage = enemy.beaconPrismAttack?.phase; break;
    case EnemyType.ION_SAIL: stage = enemy.ionSailAttack?.phase; break;
    case EnemyType.SPAN_WARDEN: stage = enemy.spanWardenAttack?.phase; break;
    case EnemyType.SHADE_GEAR: stage = enemy.shadeGearAttack?.phase; break;
    case EnemyType.M9_WELDER: stage = enemy.m9WelderAttack?.phase; break;
    case EnemyType.FOUNDRY_CLAW: stage = enemy.foundryClawAttack?.phase; break;
    case EnemyType.OXIDE_MODULATOR: stage = enemy.oxideModulatorAttack?.phase; break;
    case EnemyType.FERRITE_FOREMAN: stage = enemy.ferriteForemanAttack?.stage; break;
    case EnemyType.EMBER_SKATER: stage = enemy.emberSkaterAttack?.stage; break;
    case EnemyType.SLAG_SPEAR: stage = enemy.slagSpearAttack?.stage; break;
    case EnemyType.LAVA_DREDGER: stage = enemy.lavaDredgerAttack?.stage; break;
    case EnemyType.CINDERLING: stage = enemy.cinderlingAttack?.stage; break;
    case EnemyType.CALDERA_SERAPH: stage = enemy.calderaSeraphAttack?.stage; break;
    default: return "NONE";
  }
  if (!stage) return "NONE";
  if (["WARNING", "WARN", "AIM", "MARK", "LOCK", "WINDUP", "SPARK", "ANCHOR"].includes(stage))
    return "WARNING";
  if (["DIVE", "CHARGE", "SWEEP", "STRIKE", "ROLL", "SECOND_ROLL",
    "ARC", "TETHER", "SHOCK", "HOT", "FIRE", "LEAP", "DISCHARGE"].includes(stage))
    return "ACTIVE";
  return "NONE";
}

function familyAccent(type: EnemyType, family: WorldEnemyFamily): string {
  if (type === EnemyType.BEACON_PRISM || type === EnemyType.ION_SAIL) return "#a5b4fc";
  if (type === EnemyType.OXIDE_MODULATOR) return "#bef264";
  if (type === EnemyType.CALDERA_SERAPH) return "#fda4af";
  return family === "ASTERIA" ? "#67e8f9" :
    family === "FERRUM" ? "#fbbf24" : "#fdba74";
}

/**
 * Small per-instance motion, deterministic for a timestamp. Position, velocity,
 * cooldowns and hitboxes remain completely untouched; no per-enemy state/map.
 */
export function projectWorldEnemyMotion(enemy: Enemy, time: number): WorldEnemyMotion | null {
  const family = worldEnemyFamily(enemy.type);
  if (!family || enemy.isBoss || enemy.isDead || !Number.isFinite(time) ||
      !Number.isFinite(enemy.size) || enemy.size <= 0) return null;

  // Stable visual desynchronization, even for enemies of the same type.
  const last = enemy.id.charCodeAt(enemy.id.length - 1) || 0;
  const first = enemy.id.charCodeAt(0) || 0;
  const seed = (first * 7 + last * 13 + enemy.id.length * 19) * 0.041;
  const frequency = family === "ASTERIA" ? 0.0031 :
    family === "FERRUM" ? 0.0046 : 0.0053;
  const wave = Math.sin(time * frequency + seed);
  const secondary = Math.sin(time * frequency * 0.61 + seed * 1.7);
  const cue = attackCue(enemy);
  const warning = cue === "WARNING"
    ? clamp(0.65 + 0.2 * secondary, 0.35, 0.85) : 0;
  const attacking = cue === "ACTIVE" ? 1 : 0;
  const hit = clamp(enemy.flashTicks / 4, 0, 1);
  const large = enemy.size >= 26 ? 0.6 : 1;

  const tilt = clamp(
    (family === "FERRUM" ? 0.024 : family === "ASTERIA" ? 0.047 : 0.058) *
      secondary * large + clamp(enemy.vx / 150, -1, 1) * 0.013 -
      warning * 0.035 + attacking * 0.035,
    -0.105, 0.105,
  );
  const pulse = family === "PYRA" ? 0.047 * wave :
    family === "ASTERIA" ? 0.022 * wave : 0.014 * wave;
  const bobY = (family === "ASTERIA" ? 1.45 : family === "FERRUM" ? 0.3 : 0.72) *
    wave * large;
  return {
    family, accent: familyAccent(enemy.type, family), bobY, tilt,
    scaleX: clamp(1 + pulse + attacking * 0.025 + hit * 0.045, 0.9, 1.13),
    scaleY: clamp(1 - pulse * 0.67 - warning * 0.055 - hit * 0.085, 0.85, 1.12),
    warning, hit,
  };
}

/**
 * Body-local warning and strike glints. Existing world-space attack telegraphs
 * remain the authoritative danger markers. At most two low-cost Canvas strokes.
 */
export function drawWorldEnemyMotionFeedback(
  ctx: CanvasRenderingContext2D, size: number, motion: WorldEnemyMotion,
): void {
  if (motion.warning <= 0 && motion.hit <= 0) return;
  ctx.save();
  ctx.shadowBlur = 0;
  if (motion.warning > 0) {
    ctx.strokeStyle = motion.accent;
    ctx.lineWidth = 1.8;
    ctx.globalAlpha = 0.2 + motion.warning * 0.35;
    ctx.beginPath();
    const radius = size * 1.36;
    ctx.arc(0, 0, radius, -1.18, 1.18);
    // Begin a separate subpath: do not draw a misleading cross-body chord.
    ctx.moveTo(Math.cos(Math.PI - 1.18) * radius,
      Math.sin(Math.PI - 1.18) * radius);
    ctx.arc(0, 0, radius, Math.PI - 1.18, Math.PI + 1.18);
    ctx.stroke();
  }
  if (motion.hit > 0) {
    ctx.strokeStyle = "#fff7ed";
    ctx.lineWidth = 1.4;
    ctx.globalAlpha = motion.hit * 0.48;
    ctx.beginPath();
    ctx.arc(0, 0, size * (1.12 + (1 - motion.hit) * 0.15), 0, TAU);
    ctx.stroke();
  }
  ctx.restore();
}

export interface EnemyDeathAccent {
  readonly color: string;
  readonly particles: number;
}

/** Four extra fragments at most, routed through the existing quality-capped pool. */
export function projectWorldEnemyDeathAccent(
  enemy: Pick<Enemy, "type" | "isBoss">,
): EnemyDeathAccent | null {
  const family = worldEnemyFamily(enemy.type);
  if (!family || enemy.isBoss) return null;
  return { color: familyAccent(enemy.type, family), particles: 4 };
}
