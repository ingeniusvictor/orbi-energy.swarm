import {
  ASTERIA_SECTION_DEFS,
  type AsteriaSectionId,
  type RouteCursor,
  createAsteriaSegment,
  projectRouteDistance,
} from "./worldRouteCore";

/**
 * UX15-C2B. These are the four APPROVED, source-generated ASTERIA panoramas.
 * All four assets are in /public, converted to ~544 KB total WebP.
 * One Canvas2D battle context; never create an extra WebGL context.
 *
 * Important: panoramic illustrations are scene layers only. Their scenic
 * cliffs/bridges are NOT new colliders and do not change enemy/loot spawning.
 */
export const ASTERIA_PREMIUM_ART = {
  arrival: "asteria-arrival.webp",
  orbital: "asteria-orbital.webp",
  relay: "asteria-relay.webp",
  breach: "asteria-breach.webp",
} as const;

export type AsteriaArtKey = keyof typeof ASTERIA_PREMIUM_ART;
export type AsteriaArtStatus = "unloaded" | "loading" | "ready" | "failed";

const SEGMENT_TO_ART: Record<AsteriaSectionId, AsteriaArtKey> = {
  ARRIVAL_GATE: "arrival",
  ORBITAL_RAILS: "orbital",
  CANYON_SKY: "orbital",
  RELAY_SPAN: "relay",
  SIGNAL_BREACH: "breach",
  TRANSIT_VISTA: "arrival",
};

const baseUrl = (import.meta.env?.BASE_URL ?? "/").replace(/\/?$/, "/");
const ART_ROOT = `${baseUrl}assets/worlds/asteria/`;
const MAX_CACHED_SCENES = 4;
const TRANSITION_START = 0.73;
const cache = new Map<AsteriaArtKey, {
  status: AsteriaArtStatus;
  image: HTMLImageElement | null;
  lastNeeded: number;
}>();
let requestOrdinal = 0;

export function asteriaArtForSection(kind: AsteriaSectionId): AsteriaArtKey {
  return SEGMENT_TO_ART[kind];
}

export function getAsteriaArtUrl(key: AsteriaArtKey): string {
  return `${ART_ROOT}${ASTERIA_PREMIUM_ART[key]}`;
}

const sceneReady = (key: AsteriaArtKey): HTMLImageElement | null => {
  const entry = cache.get(key);
  if (!entry || entry.status !== "ready" ||
      !entry.image || !entry.image.complete ||
      entry.image.naturalWidth === 0) return null;
  entry.lastNeeded = ++requestOrdinal;
  return entry.image;
};

const queueScene = (key: AsteriaArtKey): void => {
  const present = cache.get(key);
  if (present) {
    present.lastNeeded = ++requestOrdinal;
    return;
  }
  if (typeof Image === "undefined") return; // Node deterministic tests.
  const image = new Image();
  image.decoding = "async";
  const record: {status:AsteriaArtStatus;image:HTMLImageElement|null;lastNeeded:number} =
    { status: "loading", image, lastNeeded: ++requestOrdinal };
  cache.set(key, record);
  image.onload = () => {
    if (cache.get(key) !== record) return;
    record.status = image.naturalWidth > 0 ? "ready" : "failed";
  };
  image.onerror = () => {
    if (cache.get(key) !== record) return;
    record.status = "failed";
    record.image = null;
  };
  image.src = getAsteriaArtUrl(key);
};

/**
 * At most four panoramas decoded, irrespective of route distance/sector.
 * Network requests occur only on segment approach, never in inner draw calls.
 * Reuse the browser HTTP cache on subsequent world cycles.
 */
export function prefetchAsteriaArtwork(cursor: RouteCursor): void {
  const current = createAsteriaSegment(cursor.segmentOrdinal, cursor.seed);
  const nextOrdinal = Math.min(Number.MAX_SAFE_INTEGER,
    cursor.segmentOrdinal + 1);
  const next = createAsteriaSegment(nextOrdinal, cursor.seed);
  const requested = [
    asteriaArtForSection(current.kind),
    asteriaArtForSection(next.kind),
  ];
  requested.forEach(queueScene);
  // Four approved images maximum, regardless of gameplay length.
  if (cache.size > MAX_CACHED_SCENES) {
    const entries = [...cache].sort((a,b)=>a[1].lastNeeded-b[1].lastNeeded);
    for (const [key] of entries.slice(0,cache.size - MAX_CACHED_SCENES)) {
      const record = cache.get(key);
      if (record?.image) { record.image.onload = null; record.image.onerror = null; }
      cache.delete(key);
    }
  }
}

export function asteriaArtworkStatus(cursor: RouteCursor): AsteriaArtStatus {
  const section = createAsteriaSegment(cursor.segmentOrdinal, cursor.seed);
  return cache.get(asteriaArtForSection(section.kind))?.status ?? "unloaded";
}

const ease = (x: number) => {
  const clamped = Math.max(0, Math.min(1, x));
  return clamped * clamped * (3 - 2 * clamped);
};

/**
 * Draw the full image without anisotropic stretching. Pan safely within its
 * crop, using monotonically advancing route distance (not wall time).
 * A blurred cut below the route acts as a subtle second parallax stratum.
 */
function paintPanorama(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
  travel: number,
  opacity: number,
  depth: number,
): void {
  if (opacity <= 0) return;
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight) * 1.075;
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  const overhangX = Math.max(0, drawWidth - width);
  const overhangY = Math.max(0, drawHeight - height);
  // Smooth oscillation avoids impossible jumps at a tile wrap.
  const pan = .5 + Math.sin(travel * .0010 * depth - 1.2) * .35;
  const offsetX = -overhangX * pan;
  const offsetY = -overhangY * .44;
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);

  // The illustrated foreground is on the same asset, but slides a few units
  // faster than the horizon, giving modest 2.5D depth without a second canvas.
  const horizon = height * .82;
  const stripHeight = height - horizon;
  if (stripHeight > 0 && overhangX > 20) {
    ctx.beginPath();
    ctx.rect(0, horizon, width, stripHeight);
    ctx.clip();
    const shift = Math.sin(travel * .0024 * depth) * Math.min(18, overhangX * .08);
    ctx.globalAlpha = opacity * .65;
    ctx.drawImage(image, offsetX - shift, offsetY, drawWidth, drawHeight);
  }
  ctx.restore();
}

export function paintAsteriaPremiumArtwork(
  ctx: CanvasRenderingContext2D,
  cursor: RouteCursor,
  width: number,
  height = 480,
): boolean {
  if (width < 800 || !Number.isFinite(width) ||
      !Number.isFinite(height) || height <= 0) return false;

  prefetchAsteriaArtwork(cursor);
  const currentSegment = createAsteriaSegment(cursor.segmentOrdinal, cursor.seed);
  const currentKey = asteriaArtForSection(currentSegment.kind);
  const current = sceneReady(currentKey);
  if (!current) return false; // Legacy procedural fallback until decoded.

  const travel = projectRouteDistance(cursor);
  const progress = cursor.offset / currentSegment.length;
  const nextOrdinal = cursor.segmentOrdinal + 1;
  const nextKind = Number.isSafeInteger(nextOrdinal)
    ? createAsteriaSegment(nextOrdinal, cursor.seed).kind : currentSegment.kind;
  const nextKey = asteriaArtForSection(nextKind);
  const next = nextKey !== currentKey ? sceneReady(nextKey) : null;
  const mix = next ? ease((progress - TRANSITION_START) /
    (1 - TRANSITION_START)) : 0;

  ctx.save();
  ctx.clearRect(0, 0, width, height);
  paintPanorama(ctx, current, width, height, travel, 1, 1);
  if (next && mix > 0) paintPanorama(ctx, next, width, height, travel, mix, .85);

  // Combat legibility: knock down brightness where bullets/shields are drawn
  // while preserving vivid scenery and recognizable landmarks.
  const veil = ctx.createLinearGradient(0, 0, 0, height);
  veil.addColorStop(0, "rgba(3,9,25,.22)");
  veil.addColorStop(.34, "rgba(4,10,26,.27)");
  veil.addColorStop(.72, "rgba(3,9,22,.32)");
  veil.addColorStop(1, "rgba(2,6,19,.40)");
  ctx.fillStyle = veil;
  ctx.fillRect(0, 0, width, height);

  // Tiny energy drift gives horizontal speed cues even when the crop is
  // stationary on unusually wide screens; particles are non-interactive.
  ctx.lineWidth = 1;
  for (let i = 0; i < 9; i++) {
    const x = ((i * 181 - travel * (.46 + i * .07)) % (width + 80) +
      width + 80) % (width + 80) - 40;
    const y = height * (.22 + (i % 7) * .085);
    ctx.strokeStyle = i % 2 ? "rgba(112,223,246,.20)" : "rgba(242,189,118,.15)";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 8 + i % 6, y);
    ctx.stroke();
  }
  ctx.restore();
  return true;
}

/** Frees retained HTML image references when leaving the app entirely. */
export function releaseAsteriaArtwork(): void {
  for (const record of cache.values()) {
    if (record.image) { record.image.onload = null; record.image.onerror = null; }
  }
  cache.clear();
}
