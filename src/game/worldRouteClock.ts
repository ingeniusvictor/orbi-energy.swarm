import {
  createAsteriaSegment,
  type RouteCursor,
} from "./worldRouteCore";

/**
 * UX15-B simulated route clock.
 * All gates (pause, modal, hidden-tab, upgrade, hitstop) must be true to advance.
 * Bounded 50ms substep resists tab resume jumps; the caller owns accumulated sim dt.
 */
export const ROUTE_QA_SPEED_UNITS_PER_SECOND = 52;
export const ROUTE_MAX_STEP_MS = 50;

export interface RouteRunGates {
  playing: boolean;
  paused: boolean;
  hidden: boolean;
  modalOpen: boolean;
  upgradeOpen: boolean;
  hitstop: boolean;
}

export const canAdvanceRoute = (gate: RouteRunGates): boolean =>
  gate.playing && !gate.paused && !gate.hidden && !gate.modalOpen &&
  !gate.upgradeOpen && !gate.hitstop;

export function stepRouteClock(
  cursor: RouteCursor,
  deltaMs: number,
  speedUnitsPerSecond: number,
  gates: RouteRunGates,
): RouteCursor {
  if (!canAdvanceRoute(gates)) return cursor;
  if (!Number.isFinite(deltaMs) || deltaMs < 0 ||
      !Number.isFinite(speedUnitsPerSecond) ||
      speedUnitsPerSecond < 0 || speedUnitsPerSecond > 240) {
    throw new RangeError("Invalid simulated delta or route speed");
  }
  const dt = Math.min(deltaMs, ROUTE_MAX_STEP_MS);
  if (dt === 0) return cursor;
  let nextOrdinal = cursor.segmentOrdinal;
  let offset = cursor.offset + dt * speedUnitsPerSecond / 1000;
  let current = createAsteriaSegment(nextOrdinal, cursor.seed);
  if (cursor.offset < 0 || cursor.offset >= current.length)
    throw new RangeError("Route cursor outside its segment");
  while (offset >= current.length) {
    offset -= current.length;
    nextOrdinal++;
    if (!Number.isSafeInteger(nextOrdinal)) throw new RangeError("Route ordinal overflow");
    current = createAsteriaSegment(nextOrdinal, cursor.seed);
  }
  return {
    ...cursor,
    segmentOrdinal: nextOrdinal,
    offset,
    simulatedMs: cursor.simulatedMs + dt,
  };
}
