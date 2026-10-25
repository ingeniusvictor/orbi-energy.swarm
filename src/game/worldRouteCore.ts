/**
 * UX15-B — deterministic, side-effect-free route geometry.
 * No combat state, enemy RNG, loot, WebGL, legacy coordinates or React dependency.
 * Segment ordinals + local offsets avoid storing unbounded physical X coordinates.
 */
export const ASTERIA_WORLD_ID = "ASTERIA_ORBITAL" as const;
export const ROUTE_SCHEMA_VERSION = 1 as const;
export const ROUTE_SECTION_BASE_UNITS = 50;
export const ROUTE_VISIBLE_Y_MIN = 30;
export const ROUTE_VISIBLE_Y_MAX = 450;

export const ASTERIA_SECTION_DEFS = [
  { id: "ARRIVAL_GATE", labelEs: "Puerta de ASTERIA", labelEn: "ASTERIA Arrival", weight: 8, accent: "#7dd3fc" },
  { id: "ORBITAL_RAILS", labelEs: "Raíles orbitales", labelEn: "Orbital Rails", weight: 17, accent: "#54c9f0" },
  { id: "CANYON_SKY", labelEs: "Cañón celeste", labelEn: "Sky Canyon", weight: 20, accent: "#a3bff4" },
  { id: "RELAY_SPAN", labelEs: "Puente de relés", labelEn: "Relay Span", weight: 22, accent: "#30e0cf" },
  { id: "SIGNAL_BREACH", labelEs: "Brecha Blackout", labelEn: "Blackout Breach", weight: 20, accent: "#ff997b" },
  { id: "TRANSIT_VISTA", labelEs: "Mirador de tránsito", labelEn: "Transit Vista", weight: 13, accent: "#d5a8ff" },
] as const;

export type AsteriaSectionId = typeof ASTERIA_SECTION_DEFS[number]["id"];
export type RouteWorldId = typeof ASTERIA_WORLD_ID;
export type RoutePresentationMode = "ARENA_LEGACY" | "ROUTE_QA_PREVIEW";

export interface RouteSegmentDescriptor {
  readonly schemaVersion: typeof ROUTE_SCHEMA_VERSION;
  readonly worldId: RouteWorldId;
  readonly ordinal: number;
  readonly id: string;
  readonly kind: AsteriaSectionId;
  readonly length: number;
  readonly accent: string;
  readonly labelEs: string;
  readonly labelEn: string;
  readonly decorationVariant: number;
  readonly safeEnvelope: { readonly minY: number; readonly maxY: number };
  readonly collisionEnabled: false;
  readonly combatEncounterEnabled: false;
}

export interface RouteCursor {
  readonly worldId: RouteWorldId;
  readonly seed: string;
  readonly segmentOrdinal: number;
  readonly offset: number; // [0, current segment length)
  readonly simulatedMs: number;
}

export interface RouteVisibleSegment {
  readonly segment: RouteSegmentDescriptor;
  readonly startRelative: number; // world units from cursor, not absolute X
  readonly endRelative: number;
}

const isOrdinal = (value: number) =>
  Number.isSafeInteger(value) && value >= 0;

export const stableRouteHash = (value: string): number => {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

/** One purely visual template, repeatable by ordinal and isolated from game RNG. */
export function createAsteriaSegment(ordinal: number, seed: string): RouteSegmentDescriptor {
  if (!isOrdinal(ordinal) || typeof seed !== "string" || seed.length === 0) {
    throw new RangeError("Invalid route ordinal or seed");
  }
  const template = ASTERIA_SECTION_DEFS[ordinal % ASTERIA_SECTION_DEFS.length];
  const cycle = Math.floor(ordinal / ASTERIA_SECTION_DEFS.length);
  const decorationVariant = stableRouteHash(
    `${ROUTE_SCHEMA_VERSION}:${seed}:${ordinal}:${template.id}`,
  ) % 4;
  return {
    schemaVersion: ROUTE_SCHEMA_VERSION,
    worldId: ASTERIA_WORLD_ID,
    ordinal,
    id: `asteria:${cycle}:${template.id}`,
    kind: template.id,
    length: template.weight * ROUTE_SECTION_BASE_UNITS,
    accent: template.accent,
    labelEs: template.labelEs,
    labelEn: template.labelEn,
    decorationVariant,
    safeEnvelope: { minY: ROUTE_VISIBLE_Y_MIN, maxY: ROUTE_VISIBLE_Y_MAX },
    collisionEnabled: false,
    combatEncounterEnabled: false,
  };
}

export function validateRouteSegment(segment: RouteSegmentDescriptor): boolean {
  if (!isOrdinal(segment.ordinal) || segment.worldId !== ASTERIA_WORLD_ID ||
      segment.schemaVersion !== ROUTE_SCHEMA_VERSION) return false;
  const template = ASTERIA_SECTION_DEFS[segment.ordinal % ASTERIA_SECTION_DEFS.length];
  return segment.kind === template.id && segment.length === template.weight * ROUTE_SECTION_BASE_UNITS &&
    Number.isFinite(segment.safeEnvelope.minY) && Number.isFinite(segment.safeEnvelope.maxY) &&
    segment.safeEnvelope.maxY - segment.safeEnvelope.minY >= 390 &&
    !segment.collisionEnabled && !segment.combatEncounterEnabled;
}

export function createRouteCursor(seed = "asteria-route-01"): RouteCursor {
  if (typeof seed !== "string" || !seed.length) throw new RangeError("Route seed required");
  return { worldId: ASTERIA_WORLD_ID, seed, segmentOrdinal: 0, offset: 0, simulatedMs: 0 };
}

export function getRouteWindow(cursor: RouteCursor, behind = 1, ahead = 2): RouteVisibleSegment[] {
  if (!isOrdinal(cursor.segmentOrdinal) ||
      !Number.isInteger(behind) || !Number.isInteger(ahead) ||
      behind < 0 || ahead < 0 || behind > 2 || ahead > 3 ||
      !Number.isFinite(cursor.offset)) throw new RangeError("Invalid route window");
  const current = createAsteriaSegment(cursor.segmentOrdinal, cursor.seed);
  if (cursor.offset < 0 || cursor.offset >= current.length) throw new RangeError("Invalid route cursor offset");
  const result: RouteVisibleSegment[] = [];
  let start = -cursor.offset;
  for (let ordinal = cursor.segmentOrdinal - 1; ordinal >= Math.max(0, cursor.segmentOrdinal - behind); ordinal--) {
    const segment = createAsteriaSegment(ordinal, cursor.seed);
    start -= segment.length;
    result.unshift({ segment, startRelative: start, endRelative: start + segment.length });
  }
  start = -cursor.offset;
  for (let step = 0; step <= ahead; step++) {
    const ordinal = cursor.segmentOrdinal + step;
    if (!Number.isSafeInteger(ordinal)) break;
    const segment = createAsteriaSegment(ordinal, cursor.seed);
    result.push({ segment, startRelative: start, endRelative: start + segment.length });
    start += segment.length;
  }
  return result;
}

/** Display only: calculated on demand; NEVER feed absolute position to physics. */
export function projectRouteDistance(cursor: RouteCursor): number {
  const count = ASTERIA_SECTION_DEFS.length;
  const wholeCycle = ASTERIA_SECTION_DEFS.reduce((total, template) =>
    total + template.weight * ROUTE_SECTION_BASE_UNITS, 0);
  const cycle = Math.floor(cursor.segmentOrdinal / count);
  const partial = ASTERIA_SECTION_DEFS.slice(0, cursor.segmentOrdinal % count)
    .reduce((total, template) => total + template.weight * ROUTE_SECTION_BASE_UNITS, 0);
  return cycle * wholeCycle + partial + cursor.offset;
}
