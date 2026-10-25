import {
  ASTERIA_WORLD_ID,
  ASTERIA_SECTION_DEFS,
  type AsteriaSectionId,
  type RouteCursor,
  createAsteriaSegment,
  projectRouteDistance,
} from "./worldRouteCore";

/**
 * UX15-C2B — approved original ASTERIA art, 4 optimized 1440x480 WebP
 * panoramas (~544KB combined). A single, lazily created Canvas2D image cache
 * is shared by all world segments. No extra WebGL renderer or combat objects.
 *
 * This is an art/route-background upgrade, NOT infinite-world physics.
 */
export const ASTERIA_PREMIUM_ASSET_MAP: Record<AsteriaSectionId, string> = {
  ARRIVAL_GATE: "asteria-arrival.webp",
  ORBITAL_RAILS: "asteria-orbital.webp",
  CANYON_SKY: "asteria-orbital.webp",
  RELAY_SPAN: "asteria-relay.webp",
  SIGNAL_BREACH: "asteria-breach.webp",
  TRANSIT_VISTA: "asteria-arrival.webp",
};

export const ASTERIA_PREMIUM_ASSET_COUNT = 4;
export const ASTERIA_PREMIUM_FADE_UNITS = 150;

type AssetStatus = "loading" | "ready" | "failed";
type ImageAsset = { image: HTMLImageElement; status: AssetStatus };
const cache = new Map<string, ImageAsset>();

const assetUri = (file: string): string =>
  `${import.meta.env.BASE_URL}assets/worlds/asteria/${file}`;

export function getAsteriaPremiumScene(ordinal: number): {
  kind: AsteriaSectionId;
  file: string;
} {
  if (!Number.isSafeInteger(ordinal) || ordinal < 0) {
    throw new RangeError("Invalid ASTERIA segment ordinal");
  }
  const kind = ASTERIA_SECTION_DEFS[ordinal % ASTERIA_SECTION_DEFS.length].id;
  return { kind, file: ASTERIA_PREMIUM_ASSET_MAP[kind] };
}

function requestAsset(file: string): ImageAsset | null {
  if (typeof Image === "undefined") return null;
  const existing = cache.get(file);
  if (existing) return existing;

  const image = new Image();
  const result: ImageAsset = { image, status: "loading" };
  cache.set(file, result);
  image.onload = () => {
    result.status = image.naturalWidth > 0 && image.naturalHeight > 0
      ? "ready" : "failed";
  };
  image.onerror = () => { result.status = "failed"; };
  image.decoding = "async";
  image.src = assetUri(file);
  return result;
}

export function preloadAsteriaPremiumWorld(): void {
  // Preloading occurs ONLY after selecting World Traversal. The first
  // segment and its successor are enough for immediate play.
  requestAsset(ASTERIA_PREMIUM_ASSET_MAP.ARRIVAL_GATE);
  requestAsset(ASTERIA_PREMIUM_ASSET_MAP.ORBITAL_RAILS);
}

export function getAsteriaPremiumAssetStatus(
  file: string,
): AssetStatus | "unrequested" {
  return cache.get(file)?.status ?? "unrequested";
}

/**
 * Draws a full-height background at uniform scale, preserving equal world
 * units in X and Y. Wide panoramas crop horizontally when W < 1440 and
 * use uniform cover scaling when W > 1440; never stretch a 3:1 image.
 */
function paintPanorama(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  logicalWidth: number,
  travel: number,
): void {
  const logicalHeight = 480;
  const naturalWidth = image.naturalWidth;
  const naturalHeight = image.naturalHeight;
  const scale = Math.max(logicalWidth / naturalWidth, logicalHeight / naturalHeight);
  const width = naturalWidth * scale;
  const height = naturalHeight * scale;
  const maxPan = Math.max(0, width - logicalWidth);
  const path = maxPan > 0 ? (travel * 0.12) % (2 * maxPan) : 0;
  const x = maxPan > 0 ? -(path <= maxPan ? path : 2 * maxPan - path) : 0;
  // Keep central original route visible by centering any vertical crop.
  const y = -(height - logicalHeight) * 0.5;
  ctx.drawImage(image, x, y, width, height);
}

/**
 * Returns true only when a real imported WebP was rendered. False means
 * caller must run the verified UX15-B Canvas2D geometry fallback.
 *
 * Fade is based entirely on the frozen route clock, never Date.now/RAF.
 */
export function drawAsteriaPremiumWorld(
  ctx: CanvasRenderingContext2D,
  cursor: RouteCursor,
  logicalWidth: number,
): boolean {
  if (cursor.worldId !== ASTERIA_WORLD_ID || !Number.isFinite(logicalWidth) ||
      logicalWidth < 800 || logicalWidth > 2400) return false;

  const current = createAsteriaSegment(cursor.segmentOrdinal, cursor.seed);
  const scene = getAsteriaPremiumScene(cursor.segmentOrdinal);
  const currentAsset = requestAsset(scene.file);
  if (!currentAsset || currentAsset.status !== "ready") return false;

  const nextScene = getAsteriaPremiumScene(cursor.segmentOrdinal + 1);
  const nextAsset = requestAsset(nextScene.file);
  const fadeStart = Math.max(0, current.length - ASTERIA_PREMIUM_FADE_UNITS);
  const fade = Math.max(0, Math.min(1,
    (cursor.offset - fadeStart) / (current.length - fadeStart)));

  // Stay on an already-loaded panorama until the next one is ready; never
  // flash black or draw a half-decoded texture during a sector transition.
  ctx.save();
  const distance = projectRouteDistance(cursor);
  paintPanorama(ctx, currentAsset.image, logicalWidth, distance);
  if (fade > 0 && nextScene.file !== scene.file && nextAsset?.status === "ready") {
    ctx.globalAlpha = fade;
    paintPanorama(ctx, nextAsset.image, logicalWidth, distance);
    ctx.globalAlpha = 1;
  }

  // A subtle combat readability grade: do not obscure energy identity,
  // attacks, telegraphs, drops or the player with opaque foreground.
  ctx.fillStyle = "rgba(2, 12, 31, 0.23)";
  ctx.fillRect(0, 0, logicalWidth, 480);
  const centerClear = ctx.createLinearGradient(0, 100, 0, 420);
  centerClear.addColorStop(0, "rgba(2, 11, 25, 0.07)");
  centerClear.addColorStop(0.5, "rgba(2, 10, 25, 0.20)");
  centerClear.addColorStop(1, "rgba(2, 11, 25, 0.07)");
  ctx.fillStyle = centerClear;
  ctx.fillRect(0, 100, logicalWidth, 320);
  ctx.restore();
  return true;
}
