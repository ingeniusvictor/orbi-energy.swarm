export const ENEMY_FORMATION_ROUTE_MAX_MEMBERS = 8;
export const ENEMY_FORMATION_ROUTE_EXTENT = 1.25;
export const ENEMY_FORMATION_ENTRY_END = 0.2;
export const ENEMY_FORMATION_PRESSURE_END = 0.8;

export type EnemyFormationRouteId =
  | "PINCER"
  | "X_CROSS"
  | "SERPENTINE"
  | "WEDGE"
  | "ORBIT"
  | "SPIRAL";

export type EnemyFormationRoutePhase =
  | "ENTRY"
  | "PRESSURE"
  | "EXIT"
  | "COMPLETE";

export type EnemyFormationRouteMirror = -1 | 1;

export type EnemyFormationMemberRole =
  | "PINCER_LEFT"
  | "PINCER_RIGHT"
  | "CROSS_A"
  | "CROSS_B"
  | "SERPENTINE_LEAD"
  | "SERPENTINE_TRAIL"
  | "WEDGE_POINT"
  | "WEDGE_LEFT"
  | "WEDGE_RIGHT"
  | "ORBIT_LEAD"
  | "ORBIT_RING"
  | "SPIRAL_LEAD"
  | "SPIRAL_TRAIL";

export type EnemyFormationTelegraphKind =
  | "FLANK_CONVERGENCE"
  | "DIAGONAL_CROSS"
  | "WAVE_CORRIDOR"
  | "WEDGE_ADVANCE"
  | "ROTATING_RING"
  | "SPIRAL_COMPRESSION";

export type EnemyFormationTelegraphSeverity = "MEDIUM" | "HIGH";

export type EnemyFormationSafeIntent =
  | "ESCAPE_FLANK_BEFORE_CLOSURE"
  | "TIME_CENTER_GAP"
  | "TRACK_MOVING_GAP"
  | "CHOOSE_WEDGE_FLANK"
  | "CHOOSE_RING_SIDE"
  | "TIME_SPIRAL_GAP";

export interface EnemyFormationRouteInput {
  route: EnemyFormationRouteId;
  memberIndex: number;
  memberCount: number;
  progress: number;
  mirror: EnemyFormationRouteMirror;
}

export interface EnemyFormationRouteProjection {
  route: EnemyFormationRouteId;
  phase: EnemyFormationRoutePhase;
  memberIndex: number;
  memberCount: number;
  role: EnemyFormationMemberRole;
  progress: number;
  complete: boolean;
  position: {
    x: number;
    y: number;
  };
  telegraph: {
    required: true;
    kind: EnemyFormationTelegraphKind;
    severity: EnemyFormationTelegraphSeverity;
    laneCount: 1 | 2;
    safeIntent: EnemyFormationSafeIntent;
  };
}

const ROUTE_IDS: readonly EnemyFormationRouteId[] = [
  "PINCER",
  "X_CROSS",
  "SERPENTINE",
  "WEDGE",
  "ORBIT",
  "SPIRAL",
];

const round = (value: number, digits = 6) => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

const boundCoordinate = (value: number) =>
  round(
    Math.min(
      ENEMY_FORMATION_ROUTE_EXTENT,
      Math.max(-ENEMY_FORMATION_ROUTE_EXTENT, value),
    ),
  );

const assertInput = (input: EnemyFormationRouteInput) => {
  if (!ROUTE_IDS.includes(input.route)) {
    throw new RangeError("Unknown enemy formation route.");
  }

  if (
    !Number.isInteger(input.memberCount) ||
    input.memberCount < 1 ||
    input.memberCount > ENEMY_FORMATION_ROUTE_MAX_MEMBERS
  ) {
    throw new RangeError(
      `Enemy formation memberCount must be an integer from 1 to ${ENEMY_FORMATION_ROUTE_MAX_MEMBERS}.`,
    );
  }

  if (
    (
      input.route === "PINCER" ||
      input.route === "X_CROSS" ||
      input.route === "SPIRAL"
    ) &&
    input.memberCount < 2
  ) {
    throw new RangeError(`${input.route} requires at least two member slots.`);
  }

  if (
    (input.route === "WEDGE" || input.route === "ORBIT") &&
    input.memberCount < 3
  ) {
    throw new RangeError(`${input.route} requires at least three member slots.`);
  }

  if (
    !Number.isInteger(input.memberIndex) ||
    input.memberIndex < 0 ||
    input.memberIndex >= input.memberCount
  ) {
    throw new RangeError(
      "Enemy formation memberIndex must address an existing member slot.",
    );
  }

  if (
    !Number.isFinite(input.progress) ||
    input.progress < 0 ||
    input.progress > 1
  ) {
    throw new RangeError("Enemy formation progress must be finite from 0 to 1.");
  }

  if (input.mirror !== -1 && input.mirror !== 1) {
    throw new RangeError("Enemy formation mirror must be -1 or 1.");
  }
};

const projectPhase = (progress: number): EnemyFormationRoutePhase => {
  if (progress === 1) return "COMPLETE";
  if (progress < ENEMY_FORMATION_ENTRY_END) return "ENTRY";
  if (progress < ENEMY_FORMATION_PRESSURE_END) return "PRESSURE";
  return "EXIT";
};

const centeredRank = (rank: number, total: number) =>
  total <= 1 ? 0 : rank / (total - 1) - 0.5;

const projectPincer = (
  input: EnemyFormationRouteInput,
): Pick<EnemyFormationRouteProjection, "role" | "position" | "telegraph"> => {
  const pairRank = Math.floor(input.memberIndex / 2);
  const pairCount = Math.ceil(input.memberCount / 2);
  const rank = centeredRank(pairRank, pairCount);
  const baseSide = input.memberIndex % 2 === 0 ? -1 : 1;
  const side = baseSide * input.mirror;
  const convergence = Math.sin(Math.PI * input.progress);

  const x =
    side *
    (1.12 - 0.84 * convergence + Math.abs(rank) * 0.08);
  const y = -1.15 + 2.3 * input.progress + rank * 0.12;

  return {
    role: side < 0 ? "PINCER_LEFT" : "PINCER_RIGHT",
    position: {
      x: boundCoordinate(x),
      y: boundCoordinate(y),
    },
    telegraph: {
      required: true,
      kind: "FLANK_CONVERGENCE",
      severity: "HIGH",
      laneCount: 2,
      safeIntent: "ESCAPE_FLANK_BEFORE_CLOSURE",
    },
  };
};

const projectXCross = (
  input: EnemyFormationRouteInput,
): Pick<EnemyFormationRouteProjection, "role" | "position" | "telegraph"> => {
  const pairRank = Math.floor(input.memberIndex / 2);
  const pairCount = Math.ceil(input.memberCount / 2);
  const rank = centeredRank(pairRank, pairCount);
  const baseSide = input.memberIndex % 2 === 0 ? -1 : 1;
  const side = baseSide * input.mirror;
  const laneOffset = rank * 0.12;

  const x = side * (1.14 - 2.28 * input.progress) + laneOffset;
  const y = -1.14 + 2.28 * input.progress + laneOffset;

  return {
    role: side < 0 ? "CROSS_A" : "CROSS_B",
    position: {
      x: boundCoordinate(x),
      y: boundCoordinate(y),
    },
    telegraph: {
      required: true,
      kind: "DIAGONAL_CROSS",
      severity: "HIGH",
      laneCount: 2,
      safeIntent: "TIME_CENTER_GAP",
    },
  };
};

const projectSerpentine = (
  input: EnemyFormationRouteInput,
): Pick<EnemyFormationRouteProjection, "role" | "position" | "telegraph"> => {
  const slot = centeredRank(input.memberIndex, input.memberCount);
  const memberPhase =
    (input.memberIndex / Math.max(1, input.memberCount)) * Math.PI * 2;
  const wave =
    Math.sin(input.progress * Math.PI * 2 + memberPhase) * 0.52;
  const x = input.mirror * (wave + slot * 0.3);
  const y = -1.15 + 2.3 * input.progress;

  return {
    role:
      input.memberIndex === 0
        ? "SERPENTINE_LEAD"
        : "SERPENTINE_TRAIL",
    position: {
      x: boundCoordinate(x),
      y: boundCoordinate(y),
    },
    telegraph: {
      required: true,
      kind: "WAVE_CORRIDOR",
      severity: "MEDIUM",
      laneCount: 1,
      safeIntent: "TRACK_MOVING_GAP",
    },
  };
};

const projectWedge = (
  input: EnemyFormationRouteInput,
): Pick<EnemyFormationRouteProjection, "role" | "position" | "telegraph"> => {
  const forwardY = -1.15 + 2.3 * input.progress;
  const pressureSpread = Math.sin(Math.PI * input.progress) * 0.18;

  if (input.memberIndex === 0) {
    return {
      role: "WEDGE_POINT",
      position: {
        x: 0,
        y: boundCoordinate(forwardY + 0.16),
      },
      telegraph: {
        required: true,
        kind: "WEDGE_ADVANCE",
        severity: "HIGH",
        laneCount: 2,
        safeIntent: "CHOOSE_WEDGE_FLANK",
      },
    };
  }

  const wingIndex = input.memberIndex - 1;
  const pairRank = Math.floor(wingIndex / 2);
  const baseSide = wingIndex % 2 === 0 ? -1 : 1;
  const side = baseSide * input.mirror;
  const x = side * (0.32 + pairRank * 0.22 + pressureSpread);
  const y = forwardY - (pairRank + 1) * 0.16;

  return {
    role: side < 0 ? "WEDGE_LEFT" : "WEDGE_RIGHT",
    position: {
      x: boundCoordinate(x),
      y: boundCoordinate(y),
    },
    telegraph: {
      required: true,
      kind: "WEDGE_ADVANCE",
      severity: "HIGH",
      laneCount: 2,
      safeIntent: "CHOOSE_WEDGE_FLANK",
    },
  };
};

const projectOrbit = (
  input: EnemyFormationRouteInput,
): Pick<EnemyFormationRouteProjection, "role" | "position" | "telegraph"> => {
  const slotAngle =
    (input.memberIndex / input.memberCount) * Math.PI * 2;
  const rotation = input.progress * Math.PI * 1.5;
  const angle = slotAngle + rotation;
  const radius = 0.58 + Math.sin(Math.PI * input.progress) * 0.08;
  const centerDrift = Math.sin(input.progress * Math.PI * 2) * 0.1;
  const centerY = -0.82 + 1.64 * input.progress;
  const x = input.mirror * (centerDrift + Math.cos(angle) * radius);
  const y = centerY + Math.sin(angle) * radius * 0.62;

  return {
    role: input.memberIndex === 0 ? "ORBIT_LEAD" : "ORBIT_RING",
    position: {
      x: boundCoordinate(x),
      y: boundCoordinate(y),
    },
    telegraph: {
      required: true,
      kind: "ROTATING_RING",
      severity: "HIGH",
      laneCount: 2,
      safeIntent: "CHOOSE_RING_SIDE",
    },
  };
};

const projectSpiral = (
  input: EnemyFormationRouteInput,
): Pick<EnemyFormationRouteProjection, "role" | "position" | "telegraph"> => {
  const memberPhase =
    (input.memberIndex / input.memberCount) * Math.PI * 2;
  const angle = memberPhase + input.progress * Math.PI * 2.5;
  const radius = 0.92 - Math.sin(Math.PI * input.progress) * 0.58;
  const centerY = -0.72 + 1.44 * input.progress;
  const x = input.mirror * Math.cos(angle) * radius;
  const y = centerY + Math.sin(angle) * radius * 0.42;

  return {
    role: input.memberIndex === 0 ? "SPIRAL_LEAD" : "SPIRAL_TRAIL",
    position: {
      x: boundCoordinate(x),
      y: boundCoordinate(y),
    },
    telegraph: {
      required: true,
      kind: "SPIRAL_COMPRESSION",
      severity: "HIGH",
      laneCount: 1,
      safeIntent: "TIME_SPIRAL_GAP",
    },
  };
};

export const projectEnemyFormationRoute = (
  input: EnemyFormationRouteInput,
): EnemyFormationRouteProjection => {
  assertInput(input);

  let routeProjection: Pick<
    EnemyFormationRouteProjection,
    "role" | "position" | "telegraph"
  >;

  switch (input.route) {
    case "PINCER":
      routeProjection = projectPincer(input);
      break;
    case "X_CROSS":
      routeProjection = projectXCross(input);
      break;
    case "SERPENTINE":
      routeProjection = projectSerpentine(input);
      break;
    case "WEDGE":
      routeProjection = projectWedge(input);
      break;
    case "ORBIT":
      routeProjection = projectOrbit(input);
      break;
    case "SPIRAL":
      routeProjection = projectSpiral(input);
      break;
    default:
      throw new RangeError("Unknown enemy formation route.");
  }

  return {
    route: input.route,
    phase: projectPhase(input.progress),
    memberIndex: input.memberIndex,
    memberCount: input.memberCount,
    role: routeProjection.role,
    progress: input.progress,
    complete: input.progress === 1,
    position: routeProjection.position,
    telegraph: routeProjection.telegraph,
  };
};
