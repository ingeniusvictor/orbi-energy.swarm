import {
  ASTERIA_WORLD_ID,
  createAsteriaSegment,
  type RouteCursor,
} from "./worldRouteCore";
import { ROUTE_MAX_STEP_MS } from "./worldRouteClock";

/**
 * UX15-C3A-1 — purely mathematical route-local physics coordinate contract.
 * Dormant until UX15-C3A-2 explicitly opts in. No combat/React/DOM/RNG.
 *
 * The canonical route position remains (seed, segmentOrdinal, offset).
 * NEVER project the long-running absolute route distance into an actor's x.
 */
export const ROUTE_PHYSICAL_SCHEMA_VERSION = 1 as const;
export const ROUTE_REBASE_CENTER_LOCAL_X = 800;
export const ROUTE_REBASE_THRESHOLD = 768;
export const ROUTE_REBASE_QUANTUM = 512;
export const ROUTE_PHYSICAL_MAX_SPEED = 240;
export const ROUTE_PHYSICAL_MAX_FRAME_ADVANCE =
  ROUTE_MAX_STEP_MS * ROUTE_PHYSICAL_MAX_SPEED / 1000;

export interface RouteLocalPoint {
  readonly x: number;
  readonly y: number;
}

export interface PhysicalRouteFrame {
  readonly schemaVersion: typeof ROUTE_PHYSICAL_SCHEMA_VERSION;
  /** Source of travel identity; not a global actor/world position. */
  readonly cursor: RouteCursor;
  /** Distinguishes an actor-space epoch after an atomic rebase. */
  readonly originEpoch: number;
  /** Telemetry only. Never use this number for collisions or world-space AI. */
  readonly originOffsetX: number;
  /** Route's advancing physical anchor in the CURRENT local physics frame. */
  readonly travelAnchorLocalX: number;
}

export interface PhysicalRouteAdvance {
  readonly frame: PhysicalRouteFrame;
  readonly movedX: number;
}

export interface RouteOriginShift {
  readonly deltaX: number;
  readonly nextFrame: PhysicalRouteFrame;
}

const assertFinite = (value: number, label: string): void => {
  if (!Number.isFinite(value)) throw new RangeError(`${label} must be finite`);
};

const assertValidCursor = (cursor: RouteCursor): void => {
  if (cursor.worldId !== ASTERIA_WORLD_ID ||
      !Number.isSafeInteger(cursor.segmentOrdinal) ||
      cursor.segmentOrdinal < 0 ||
      !Number.isFinite(cursor.offset) ||
      !Number.isFinite(cursor.simulatedMs) ||
      cursor.simulatedMs < 0 ||
      typeof cursor.seed !== "string" || cursor.seed.length === 0) {
    throw new RangeError("Invalid physical route cursor");
  }
  const length = createAsteriaSegment(cursor.segmentOrdinal, cursor.seed).length;
  if (cursor.offset < 0 || cursor.offset >= length)
    throw new RangeError("Physical route cursor offset outside segment");
};

const assertValidFrame = (frame: PhysicalRouteFrame): void => {
  if (frame.schemaVersion !== ROUTE_PHYSICAL_SCHEMA_VERSION ||
      !Number.isSafeInteger(frame.originEpoch) || frame.originEpoch < 0) {
    throw new RangeError("Invalid physical route origin epoch");
  }
  assertFinite(frame.originOffsetX, "originOffsetX");
  assertFinite(frame.travelAnchorLocalX, "travelAnchorLocalX");
  assertValidCursor(frame.cursor);
};

export function createPhysicalRouteFrame(
  cursor: RouteCursor,
  initialLocalAnchorX = ROUTE_REBASE_CENTER_LOCAL_X,
): PhysicalRouteFrame {
  assertValidCursor(cursor);
  assertFinite(initialLocalAnchorX, "initialLocalAnchorX");
  return {
    schemaVersion: ROUTE_PHYSICAL_SCHEMA_VERSION,
    cursor: { ...cursor },
    originEpoch: 0,
    originOffsetX: 0,
    travelAnchorLocalX: initialLocalAnchorX,
  };
}

/**
 * A bounded single-frame route advance. Consecutive cursor snapshots may
 * stay in the same segment or cross exactly one boundary. This deliberately
 * does not subtract two huge projectedRouteDistance() numbers: accuracy
 * remains independent of ordinal, including 1,000,000,000+.
 */
export function advancePhysicalRouteFrame(
  frame: PhysicalRouteFrame,
  nextCursor: RouteCursor,
): PhysicalRouteAdvance {
  assertValidFrame(frame);
  assertValidCursor(nextCursor);
  const previous = frame.cursor;
  if (previous.worldId !== nextCursor.worldId ||
      previous.seed !== nextCursor.seed ||
      nextCursor.segmentOrdinal < previous.segmentOrdinal ||
      nextCursor.segmentOrdinal > previous.segmentOrdinal + 1) {
    throw new RangeError("Physical route cursor must advance locally and preserve identity");
  }
  const deltaMs = nextCursor.simulatedMs - previous.simulatedMs;
  if (deltaMs < 0 || deltaMs > ROUTE_MAX_STEP_MS + 1e-7)
    throw new RangeError("Physical advance requires a bounded simulated frame");

  const crossed = nextCursor.segmentOrdinal === previous.segmentOrdinal + 1;
  const movedX = crossed
    ? createAsteriaSegment(previous.segmentOrdinal, previous.seed).length -
      previous.offset + nextCursor.offset
    : nextCursor.offset - previous.offset;
  const permitted = Math.min(
    ROUTE_PHYSICAL_MAX_FRAME_ADVANCE,
    deltaMs * ROUTE_PHYSICAL_MAX_SPEED / 1000,
  );
  if (!Number.isFinite(movedX) || movedX < -1e-9 ||
      movedX > permitted + 1e-7) {
    throw new RangeError("Impossible physical route movement in simulated frame");
  }
  if (movedX === 0 && nextCursor === previous) return { frame, movedX: 0 };
  const nextAnchor = frame.travelAnchorLocalX + movedX;
  assertFinite(nextAnchor, "next physical anchor");
  return {
    frame: {
      ...frame,
      cursor: { ...nextCursor },
      travelAnchorLocalX: nextAnchor,
    },
    movedX,
  };
}

/** Change of floating origin needed to keep the local play window bounded.
 * A null result leaves all actor positions and caches untouched. */
export function planRouteOriginShift(
  frame: PhysicalRouteFrame,
  observedLocalX: number,
  threshold = ROUTE_REBASE_THRESHOLD,
  quantum = ROUTE_REBASE_QUANTUM,
): number | null {
  assertValidFrame(frame);
  assertFinite(observedLocalX, "observedLocalX");
  if (!Number.isFinite(threshold) || threshold <= 0 ||
      !Number.isFinite(quantum) || quantum <= 0 || quantum > threshold) {
    throw new RangeError("Invalid floating-origin policy");
  }
  const drift = observedLocalX - ROUTE_REBASE_CENTER_LOCAL_X;
  if (Math.abs(drift) < threshold) return null;
  const multiples = Math.trunc(drift / quantum);
  // The policy requires quantum <= threshold: any threshold-crossing
  // shift must move at least one quantum and remain deterministic.
  const deltaX = multiples * quantum;
  if (!Number.isFinite(deltaX) || deltaX === 0)
    throw new RangeError("Unrepresentable floating-origin shift");
  return deltaX;
}

/**
 * Shift the route frame's origin only; the future C3A-3 owner adapter must
 * apply this SAME delta to ALL live actors, world targets, camera and cached
 * formation anchors before collisions resume. Never call in isolation
 * within a running game.
 */
export function rebasePhysicalRouteFrame(
  frame: PhysicalRouteFrame,
  deltaX: number,
): RouteOriginShift {
  assertValidFrame(frame);
  assertFinite(deltaX, "deltaX");
  if (deltaX === 0 || !Number.isSafeInteger(frame.originEpoch + 1))
    throw new RangeError("Invalid or redundant physical origin shift");
  const nextOffset = frame.originOffsetX + deltaX;
  const nextAnchor = frame.travelAnchorLocalX - deltaX;
  assertFinite(nextOffset, "origin offset after shift");
  assertFinite(nextAnchor, "anchor after shift");
  return {
    deltaX,
    nextFrame: {
      ...frame,
      originEpoch: frame.originEpoch + 1,
      originOffsetX: nextOffset,
      travelAnchorLocalX: nextAnchor,
    },
  };
}

/** Pure geometry helpers, NOT mutations of the live game actor registry. */
export function shiftRouteLocalPoint<T extends RouteLocalPoint>(
  point: T,
  deltaX: number,
): T {
  assertFinite(point.x, "point.x");
  assertFinite(point.y, "point.y");
  assertFinite(deltaX, "deltaX");
  const nextX = point.x - deltaX;
  assertFinite(nextX, "shifted point.x");
  return { ...point, x: nextX };
}

export function shiftRouteLocalPoints<T extends RouteLocalPoint>(
  points: readonly T[],
  deltaX: number,
): T[] {
  return points.map(point => shiftRouteLocalPoint(point, deltaX));
}

/** Distances used by the existing hit/collision system are local-only. */
export function localRouteDistanceSquared(
  a: RouteLocalPoint,
  b: RouteLocalPoint,
): number {
  for (const value of [a.x, a.y, b.x, b.y]) assertFinite(value, "local position");
  return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
}

/** Rebase does not translate velocities, timers, global route cursors or RNG. */
export function isSameRoutePhysicalIdentity(
  a: PhysicalRouteFrame,
  b: PhysicalRouteFrame,
): boolean {
  assertValidFrame(a);
  assertValidFrame(b);
  return a.cursor.seed === b.cursor.seed &&
    a.cursor.worldId === b.cursor.worldId &&
    a.cursor.segmentOrdinal === b.cursor.segmentOrdinal &&
    a.cursor.offset === b.cursor.offset &&
    a.cursor.simulatedMs === b.cursor.simulatedMs;
}
