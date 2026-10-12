import {
  ENEMY_FORMATION_ROUTE_EXTENT,
  projectEnemyFormationRoute,
  type EnemyFormationRouteId,
  type EnemyFormationRouteMirror,
} from "./enemyFormationRoutes";
import { EnemyType } from "./types";
import type { RuntimeWaveSourceMode } from "./runtimeWaveDescriptor";

export const LIVE_ENEMY_FORMATION_GROUP_SIZE = 2;
export const LIVE_ENEMY_FORMATION_ROUTE_DURATION_MS = 5200;
export const LIVE_ENEMY_FORMATION_LEAD_IN_MS = 700;
export const LIVE_ENEMY_FORMATION_RECOVERY_MS = 1800;
export const LIVE_ENEMY_FORMATION_ASSEMBLY_GRACE_MS = 1800;
export const LIVE_ENEMY_FORMATION_SPAWN_CADENCE = 6;
export const LIVE_ENEMY_FORMATION_SPAN_X = 250;
export const LIVE_ENEMY_FORMATION_SPAN_Y = 190;
export const LIVE_ENEMY_FORMATION_WORLD_MARGIN = 20;

const ROUTE_CYCLE: readonly EnemyFormationRouteId[] = [
  "PINCER",
  "X_CROSS",
  "SERPENTINE",
];

export interface LiveEnemyFormationPolicy {
  campaignEnabled: boolean;
  infiniteEnabled: boolean;
  campaignMinWave: number;
  campaignMaxWave: number;
}

export const LIVE_ENEMY_FORMATION_POLICY: Readonly<LiveEnemyFormationPolicy> = {
  campaignEnabled: true,
  infiniteEnabled: true,
  campaignMinWave: 4,
  campaignMaxWave: 9,
};

export interface LiveEnemyFormationAssignment {
  groupId: string;
  route: EnemyFormationRouteId;
  memberIndex: number;
  memberCount: number;
  mirror: EnemyFormationRouteMirror;
  startsAtMs: number;
  durationMs: number;
  anchorX: number;
  anchorY: number;
}

interface PendingFormationMember {
  common: Omit<LiveEnemyFormationAssignment, "memberIndex">;
  nextMemberIndex: number;
  assemblyDeadlineMs: number;
}

export interface LiveEnemyFormationDirectorState {
  nextGroupOrdinal: number;
  activeUntilMs: number;
  pending: PendingFormationMember | null;
}

export interface LiveEnemyFormationSpawnRequest {
  sourceMode: RuntimeWaveSourceMode;
  waveNumber: number;
  descriptorId: string;
  milestoneActive: boolean;
  spawnOrdinal: number;
  enemyType: EnemyType;
  eligibleEnemy: boolean;
  remainingCapacity: number;
  nowMs: number;
  anchorX: number;
  anchorY: number;
  worldWidth: number;
  worldHeight: number;
  policy?: Readonly<LiveEnemyFormationPolicy>;
}

export interface LiveEnemyFormationSpawnResolution {
  state: LiveEnemyFormationDirectorState;
  assignment: LiveEnemyFormationAssignment | null;
}

export interface LiveEnemyFormationMotionInput {
  assignment: LiveEnemyFormationAssignment;
  nowMs: number;
  worldWidth: number;
  worldHeight: number;
}

export interface LiveEnemyFormationMotionProjection {
  x: number;
  y: number;
  progress: number;
  started: boolean;
  complete: boolean;
  phase: ReturnType<typeof projectEnemyFormationRoute>["phase"];
  telegraph: ReturnType<typeof projectEnemyFormationRoute>["telegraph"];
}

export const createLiveEnemyFormationDirectorState =
  (): LiveEnemyFormationDirectorState => ({
    nextGroupOrdinal: 0,
    activeUntilMs: 0,
    pending: null,
  });

export const isLiveEnemyFormationType = (enemyType: EnemyType) =>
  enemyType === EnemyType.CRAWLER || enemyType === EnemyType.SPLITTER;

const assertFinite = (value: number, label: string) => {
  if (!Number.isFinite(value)) {
    throw new RangeError(`${label} must be finite.`);
  }
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const clampAnchor = (
  value: number,
  span: number,
  worldExtent: number,
) => {
  const routeExtent = span * ENEMY_FORMATION_ROUTE_EXTENT;
  const min = LIVE_ENEMY_FORMATION_WORLD_MARGIN + routeExtent;
  const max = worldExtent - LIVE_ENEMY_FORMATION_WORLD_MARGIN - routeExtent;
  if (max < min) return worldExtent / 2;
  return clamp(value, min, max);
};

const isModeEnabled = (
  request: LiveEnemyFormationSpawnRequest,
  policy: Readonly<LiveEnemyFormationPolicy>,
) => {
  if (request.milestoneActive) return false;
  if (request.sourceMode === "INFINITE") return policy.infiniteEnabled;
  return (
    policy.campaignEnabled &&
    request.waveNumber >= policy.campaignMinWave &&
    request.waveNumber <= policy.campaignMaxWave
  );
};

const sanitizePending = (
  state: LiveEnemyFormationDirectorState,
  nowMs: number,
): LiveEnemyFormationDirectorState => {
  if (!state.pending || nowMs <= state.pending.assemblyDeadlineMs) {
    return state;
  }
  return {
    ...state,
    pending: null,
  };
};

export const requestLiveEnemyFormationSpawn = (
  state: LiveEnemyFormationDirectorState,
  request: LiveEnemyFormationSpawnRequest,
): LiveEnemyFormationSpawnResolution => {
  assertFinite(request.nowMs, "nowMs");
  assertFinite(request.anchorX, "anchorX");
  assertFinite(request.anchorY, "anchorY");
  assertFinite(request.worldWidth, "worldWidth");
  assertFinite(request.worldHeight, "worldHeight");

  if (request.nowMs < 0) throw new RangeError("nowMs must be non-negative.");
  if (!Number.isInteger(request.waveNumber) || request.waveNumber < 1) {
    throw new RangeError("waveNumber must be a positive integer.");
  }
  if (!Number.isInteger(request.spawnOrdinal) || request.spawnOrdinal < 0) {
    throw new RangeError("spawnOrdinal must be a non-negative integer.");
  }
  if (!Number.isInteger(request.remainingCapacity) || request.remainingCapacity < 1) {
    throw new RangeError("remainingCapacity must be a positive integer.");
  }
  if (request.worldWidth <= 0 || request.worldHeight <= 0) {
    throw new RangeError("World bounds must be positive.");
  }

  const policy = request.policy ?? LIVE_ENEMY_FORMATION_POLICY;
  const current = sanitizePending(state, request.nowMs);
  const eligible =
    request.eligibleEnemy &&
    isLiveEnemyFormationType(request.enemyType) &&
    isModeEnabled(request, policy);

  if (current.pending && eligible) {
    const assignment: LiveEnemyFormationAssignment = {
      ...current.pending.common,
      memberIndex: current.pending.nextMemberIndex,
    };
    return {
      state: {
        ...current,
        pending: null,
      },
      assignment,
    };
  }

  const mayStart =
    eligible &&
    request.remainingCapacity >= LIVE_ENEMY_FORMATION_GROUP_SIZE &&
    request.spawnOrdinal > 0 &&
    request.spawnOrdinal % LIVE_ENEMY_FORMATION_SPAWN_CADENCE === 0 &&
    request.nowMs >= current.activeUntilMs;

  if (!mayStart) {
    return { state: current, assignment: null };
  }

  const groupOrdinal = current.nextGroupOrdinal;
  const route = ROUTE_CYCLE[groupOrdinal % ROUTE_CYCLE.length];
  const mirror: EnemyFormationRouteMirror = groupOrdinal % 2 === 0 ? 1 : -1;
  const startsAtMs = request.nowMs + LIVE_ENEMY_FORMATION_LEAD_IN_MS;
  const common: Omit<LiveEnemyFormationAssignment, "memberIndex"> = {
    groupId: `${request.descriptorId}:formation:${groupOrdinal}`,
    route,
    memberCount: LIVE_ENEMY_FORMATION_GROUP_SIZE,
    mirror,
    startsAtMs,
    durationMs: LIVE_ENEMY_FORMATION_ROUTE_DURATION_MS,
    anchorX: clampAnchor(request.anchorX, LIVE_ENEMY_FORMATION_SPAN_X, request.worldWidth),
    anchorY: clampAnchor(request.anchorY, LIVE_ENEMY_FORMATION_SPAN_Y, request.worldHeight),
  };

  return {
    state: {
      nextGroupOrdinal: groupOrdinal + 1,
      activeUntilMs:
        startsAtMs +
        LIVE_ENEMY_FORMATION_ROUTE_DURATION_MS +
        LIVE_ENEMY_FORMATION_RECOVERY_MS,
      pending: {
        common,
        nextMemberIndex: 1,
        assemblyDeadlineMs:
          startsAtMs + LIVE_ENEMY_FORMATION_ASSEMBLY_GRACE_MS,
      },
    },
    assignment: {
      ...common,
      memberIndex: 0,
    },
  };
};

export const projectLiveEnemyFormationMotion = (
  input: LiveEnemyFormationMotionInput,
): LiveEnemyFormationMotionProjection => {
  assertFinite(input.nowMs, "nowMs");
  assertFinite(input.worldWidth, "worldWidth");
  assertFinite(input.worldHeight, "worldHeight");
  if (input.nowMs < 0) throw new RangeError("nowMs must be non-negative.");
  if (input.assignment.durationMs <= 0 || !Number.isFinite(input.assignment.durationMs)) {
    throw new RangeError("Formation duration must be finite and positive.");
  }

  const elapsedMs = input.nowMs - input.assignment.startsAtMs;
  const started = elapsedMs >= 0;
  const progress = clamp(
    started ? elapsedMs / input.assignment.durationMs : 0,
    0,
    1,
  );
  const routeProjection = projectEnemyFormationRoute({
    route: input.assignment.route,
    memberIndex: input.assignment.memberIndex,
    memberCount: input.assignment.memberCount,
    progress,
    mirror: input.assignment.mirror,
  });
  const margin = LIVE_ENEMY_FORMATION_WORLD_MARGIN;

  return {
    x: clamp(
      input.assignment.anchorX +
        routeProjection.position.x * LIVE_ENEMY_FORMATION_SPAN_X,
      margin,
      input.worldWidth - margin,
    ),
    y: clamp(
      input.assignment.anchorY +
        routeProjection.position.y * LIVE_ENEMY_FORMATION_SPAN_Y,
      margin,
      input.worldHeight - margin,
    ),
    progress,
    started,
    complete: elapsedMs >= input.assignment.durationMs,
    phase: routeProjection.phase,
    telegraph: routeProjection.telegraph,
  };
};
