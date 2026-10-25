import { EnemyType, type Enemy } from "./types";

/**
 * UX13 experimental enemy skins: replace body art only.
 * Damage, attacks, gravity pulse, boss abilities, spawn rate, telegraphs,
 * formation auras, hit flashes and health bars remain owned by the engine.
 */
export const PREMIUM_ENEMY_IMAGE_FILES = {
  [EnemyType.BLACKOUT_ELITE]: "assets/enemies/premium/armored_blackout_elite.webp",
  [EnemyType.DISRUPTOR]: "assets/enemies/premium/gravity_disruptor.webp",
  [EnemyType.BOSS_DEVOURER]: "assets/enemies/premium/swarm_devourer_boss.webp",
} as const;

export type PremiumEnemyKind = keyof typeof PREMIUM_ENEMY_IMAGE_FILES;

type ImageState = "idle" | "loading" | "ready" | "error";
type ImageRecord = { image: HTMLImageElement | null; state: ImageState };
const cache: Record<PremiumEnemyKind, ImageRecord> = {
  [EnemyType.BLACKOUT_ELITE]: { image: null, state: "idle" },
  [EnemyType.DISRUPTOR]: { image: null, state: "idle" },
  [EnemyType.BOSS_DEVOURER]: { image: null, state: "idle" },
};
const kinds = [
  EnemyType.BLACKOUT_ELITE, EnemyType.DISRUPTOR, EnemyType.BOSS_DEVOURER,
] as const;

export function isPremiumEnemyKind(type: EnemyType): type is PremiumEnemyKind {
  return type === EnemyType.BLACKOUT_ELITE ||
    type === EnemyType.DISRUPTOR ||
    type === EnemyType.BOSS_DEVOURER;
}

export function resolvePremiumEnemySpriteUrl(type: EnemyType, baseUrl = "/"): string | null {
  if (!isPremiumEnemyKind(type)) return null;
  const base = baseUrl.endsWith("/") ? baseUrl : baseUrl + "/";
  return base + PREMIUM_ENEMY_IMAGE_FILES[type];
}

/** Preload exactly once per kind, with no Image allocations in the frame loop. */
export function prewarmPremiumEnemySprites(baseUrl = "/"): void {
  if (typeof Image === "undefined") return;
  for (const type of kinds) {
    const entry = cache[type];
    if (entry.state !== "idle") continue;
    const src = resolvePremiumEnemySpriteUrl(type, baseUrl);
    if (!src) continue;
    const image = new Image();
    image.decoding = "async";
    entry.state = "loading";
    entry.image = image;
    image.onload = () => {
      if (entry.image !== image) return;
      entry.state = image.naturalWidth > 0 && image.naturalHeight > 0
        ? "ready" : "error";
    };
    image.onerror = () => {
      if (entry.image !== image) return;
      entry.state = "error";
    };
    image.src = src;
  }
}

/** Returns true iff an image was actually drawn; false allows legacy geometry. */
export function drawPremiumEnemyBody(
  ctx: CanvasRenderingContext2D,
  enemy: Pick<Enemy, "type" | "size">,
): boolean {
  if (!isPremiumEnemyKind(enemy.type)) return false;
  const entry = cache[enemy.type];
  if (entry.state !== "ready" || !entry.image) return false;
  // Keep rendered size proportional to legacy forms. No hitbox changes.
  const multiplier = enemy.type === EnemyType.BLACKOUT_ELITE ? 3 :
    enemy.type === EnemyType.DISRUPTOR ? 2.6 : 2.75;
  const drawSize = enemy.size * multiplier;
  ctx.save();
  // Isometric images have transparent corners. The engine owns auras separately.
  ctx.shadowBlur = 0;
  ctx.drawImage(entry.image, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
  ctx.restore();
  return true;
}

export function getPremiumEnemySpriteState(type: PremiumEnemyKind): ImageState {
  return cache[type].state;
}

/** Reject callbacks from stale Image instances on unmount or renderer reset. */
export function disposePremiumEnemySprites(): void {
  for (const type of kinds) {
    const entry = cache[type];
    if (entry.image) {
      entry.image.onload = null;
      entry.image.onerror = null;
    }
    entry.image = null;
    entry.state = "idle";
  }
}
