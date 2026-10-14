import { EnemyType } from "./types";

export type TacticalEnemyFamilyId =
  | "WARP_AMBUSHER"
  | "ARTILLERY_CARRIER"
  | "FORMATION_BREAKER"
  | "JAMMER";

export type TacticalEnemyPressureClass =
  | "TIMING"
  | "RANGE_CONTROL"
  | "SWARM_COHESION"
  | "CONTROL_SOURCE";

export type TacticalEnemyPriorityIntent = "CONDITIONAL" | "HIGH";
export type TacticalEnemyControlPressure = "NONE" | "SOFT" | "HARD";

export type TacticalEnemyTelegraphKind =
  | "RIFT_LOCK"
  | "SIEGE_VOLLEY"
  | "REAVER_APPROACH"
  | "ANCHOR_FIELD";

export type TacticalEnemyTelegraphSeverity = "MEDIUM" | "HIGH";

export type TacticalEnemySafeIntent =
  | "DODGE_AFTER_LOCK_COMMIT"
  | "BREAK_ARTILLERY_ENVELOPE"
  | "INTERCEPT_BEFORE_COHESION_BREAK"
  | "EXIT_OR_DESTROY_CONTROL_SOURCE";

export interface TacticalEnemyAuthorityContract {
  ownsSpawnAuthority: false;
  ownsEntityCollection: false;
  ownsProjectileCollection: false;
  ownsFullArrayScan: false;
  mayMutateGlobalCaps: false;
  mayCreateSupportEntities: false;
}

export interface TacticalEnemyDecisionContract {
  pressureClass: TacticalEnemyPressureClass;
  tacticalQuestion: string;
  counterplayIntent: TacticalEnemySafeIntent;
  priorityIntent: TacticalEnemyPriorityIntent;
  controlPressure: TacticalEnemyControlPressure;
}

export interface TacticalEnemyTelegraphContract {
  required: true;
  kind: TacticalEnemyTelegraphKind;
  severity: TacticalEnemyTelegraphSeverity;
  safeIntent: TacticalEnemySafeIntent;
}

export interface TacticalEnemyFamilyProfile {
  familyId: TacticalEnemyFamilyId;
  enemyType: EnemyType;
  displayName: string;
  decision: Readonly<TacticalEnemyDecisionContract>;
  telegraph: Readonly<TacticalEnemyTelegraphContract>;
  authority: Readonly<TacticalEnemyAuthorityContract>;
}

export const TACTICAL_ENEMY_FAMILY_COUNT = 4;

export const TACTICAL_ENEMY_AUTHORITY_CONTRACT: Readonly<TacticalEnemyAuthorityContract> =
  Object.freeze({
    ownsSpawnAuthority: false,
    ownsEntityCollection: false,
    ownsProjectileCollection: false,
    ownsFullArrayScan: false,
    mayMutateGlobalCaps: false,
    mayCreateSupportEntities: false,
  });

const freezeProfile = (
  familyId: TacticalEnemyFamilyId,
  enemyType: EnemyType,
  displayName: string,
  decision: TacticalEnemyDecisionContract,
  telegraph: TacticalEnemyTelegraphContract,
): Readonly<TacticalEnemyFamilyProfile> =>
  Object.freeze({
    familyId,
    enemyType,
    displayName,
    decision: Object.freeze({ ...decision }),
    telegraph: Object.freeze({ ...telegraph }),
    authority: TACTICAL_ENEMY_AUTHORITY_CONTRACT,
  });

const WARP_AMBUSHER_PROFILE = freezeProfile(
  "WARP_AMBUSHER",
  EnemyType.RIFT_HUNTER,
  "Rift Hunter",
  {
    pressureClass: "TIMING",
    tacticalQuestion: "When do I break the lock and dodge the committed rush?",
    counterplayIntent: "DODGE_AFTER_LOCK_COMMIT",
    priorityIntent: "CONDITIONAL",
    controlPressure: "NONE",
  },
  {
    required: true,
    kind: "RIFT_LOCK",
    severity: "HIGH",
    safeIntent: "DODGE_AFTER_LOCK_COMMIT",
  },
);

const ARTILLERY_CARRIER_PROFILE = freezeProfile(
  "ARTILLERY_CARRIER",
  EnemyType.SIEGE_PRISM,
  "Siege Prism",
  {
    pressureClass: "RANGE_CONTROL",
    tacticalQuestion: "Do I close or flank before its firing envelope controls the lane?",
    counterplayIntent: "BREAK_ARTILLERY_ENVELOPE",
    priorityIntent: "HIGH",
    controlPressure: "NONE",
  },
  {
    required: true,
    kind: "SIEGE_VOLLEY",
    severity: "HIGH",
    safeIntent: "BREAK_ARTILLERY_ENVELOPE",
  },
);

const FORMATION_BREAKER_PROFILE = freezeProfile(
  "FORMATION_BREAKER",
  EnemyType.SWARM_REAVER,
  "Swarm Reaver",
  {
    pressureClass: "SWARM_COHESION",
    tacticalQuestion: "Can I intercept it before close-range disruption reaches the swarm?",
    counterplayIntent: "INTERCEPT_BEFORE_COHESION_BREAK",
    priorityIntent: "HIGH",
    controlPressure: "HARD",
  },
  {
    required: true,
    kind: "REAVER_APPROACH",
    severity: "HIGH",
    safeIntent: "INTERCEPT_BEFORE_COHESION_BREAK",
  },
);

const JAMMER_PROFILE = freezeProfile(
  "JAMMER",
  EnemyType.VOID_ANCHOR,
  "Void Anchor",
  {
    pressureClass: "CONTROL_SOURCE",
    tacticalQuestion: "Do I leave its denial radius or destroy the control source first?",
    counterplayIntent: "EXIT_OR_DESTROY_CONTROL_SOURCE",
    priorityIntent: "HIGH",
    controlPressure: "HARD",
  },
  {
    required: true,
    kind: "ANCHOR_FIELD",
    severity: "HIGH",
    safeIntent: "EXIT_OR_DESTROY_CONTROL_SOURCE",
  },
);

export const TACTICAL_ENEMY_FAMILY_PROFILES: readonly Readonly<TacticalEnemyFamilyProfile>[] =
  Object.freeze([
    WARP_AMBUSHER_PROFILE,
    ARTILLERY_CARRIER_PROFILE,
    FORMATION_BREAKER_PROFILE,
    JAMMER_PROFILE,
  ]);

export const getTacticalEnemyFamilyProfile = (
  enemyType: EnemyType,
): Readonly<TacticalEnemyFamilyProfile> | null => {
  switch (enemyType) {
    case EnemyType.RIFT_HUNTER:
      return WARP_AMBUSHER_PROFILE;
    case EnemyType.SIEGE_PRISM:
      return ARTILLERY_CARRIER_PROFILE;
    case EnemyType.SWARM_REAVER:
      return FORMATION_BREAKER_PROFILE;
    case EnemyType.VOID_ANCHOR:
      return JAMMER_PROFILE;
    default:
      return null;
  }
};

export const getTacticalEnemyFamilyProfileById = (
  familyId: TacticalEnemyFamilyId,
): Readonly<TacticalEnemyFamilyProfile> | null => {
  switch (familyId) {
    case "WARP_AMBUSHER":
      return WARP_AMBUSHER_PROFILE;
    case "ARTILLERY_CARRIER":
      return ARTILLERY_CARRIER_PROFILE;
    case "FORMATION_BREAKER":
      return FORMATION_BREAKER_PROFILE;
    case "JAMMER":
      return JAMMER_PROFILE;
    default:
      return null;
  }
};

export const isCertifiedTacticalEnemyType = (
  enemyType: EnemyType,
): boolean => getTacticalEnemyFamilyProfile(enemyType) !== null;
