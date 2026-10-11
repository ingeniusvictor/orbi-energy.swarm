export const SWARM_PHASE_ONE_CAP = 10;
export const SWARM_PHASE_TWO_CAP = 20;
export const SWARM_ABSOLUTE_CAP = 30;
export const SWARM_PHASE_TWO_LEVEL = 5;
export const SWARM_PHASE_THREE_LEVEL = 10;
export const SWARM_PHASE_THREE_FIRST_PROMOTIONS = 10;

export type SwarmDoctrinePhase = "FOUNDING" | "VETERAN" | "ELITE";

export interface SwarmDoctrineState {
  founderIds: readonly string[];
  founderLevel5Ids: readonly string[];
  level10Ids: readonly string[];
}

export interface SwarmDoctrineProjection {
  phase: SwarmDoctrinePhase;
  capacity: number;
  hardCap: number;
  founderCount: number;
  founderLevel5Count: number;
  level10Count: number;
  nextUnlockLevel: 5 | 10 | null;
  nextUnlockRequiredCount: number | null;
}

const appendUnique = (source: readonly string[], id: string) =>
  source.includes(id) ? source : [...source, id];

export const createSwarmDoctrineState = (): SwarmDoctrineState => ({
  founderIds: [],
  founderLevel5Ids: [],
  level10Ids: [],
});

/**
 * Registers a follower once. FOTON is the command body and is deliberately
 * outside this follower-slot system. GAIA and fusion-class followers use the
 * same slot rules as every other follower.
 */
export const registerSwarmDoctrineMember = (
  current: SwarmDoctrineState,
  memberId: string,
  level = 1,
): SwarmDoctrineState => {
  if (!memberId) return current;

  const founderIds =
    current.founderIds.includes(memberId) ||
    current.founderIds.length >= SWARM_PHASE_ONE_CAP
      ? current.founderIds
      : [...current.founderIds, memberId];

  return registerSwarmDoctrineLevel(
    {
      ...current,
      founderIds,
    },
    memberId,
    level,
  );
};

/**
 * Promotion credits are monotonic for the current run. A follower dying later
 * never removes a slot that the player already earned through veterancy.
 */
export const registerSwarmDoctrineLevel = (
  current: SwarmDoctrineState,
  memberId: string,
  level: number,
): SwarmDoctrineState => {
  if (!memberId || !Number.isFinite(level)) return current;

  const founderLevel5Ids =
    level >= SWARM_PHASE_TWO_LEVEL && current.founderIds.includes(memberId)
      ? appendUnique(current.founderLevel5Ids, memberId)
      : current.founderLevel5Ids;

  const level10Ids =
    level >= SWARM_PHASE_THREE_LEVEL
      ? appendUnique(current.level10Ids, memberId)
      : current.level10Ids;

  if (
    founderLevel5Ids === current.founderLevel5Ids &&
    level10Ids === current.level10Ids
  ) {
    return current;
  }

  return {
    ...current,
    founderLevel5Ids,
    level10Ids,
  };
};

export const getSwarmDoctrineCapacity = (
  state: SwarmDoctrineState,
): number => {
  const veteranCapacity = Math.min(
    SWARM_PHASE_TWO_CAP,
    SWARM_PHASE_ONE_CAP + state.founderLevel5Ids.length,
  );

  if (veteranCapacity < SWARM_PHASE_TWO_CAP) {
    return veteranCapacity;
  }

  const elitePromotions = state.level10Ids.length;
  if (elitePromotions < SWARM_PHASE_THREE_FIRST_PROMOTIONS) {
    return SWARM_PHASE_TWO_CAP;
  }

  return Math.min(
    SWARM_ABSOLUTE_CAP,
    SWARM_PHASE_TWO_CAP +
      (elitePromotions - SWARM_PHASE_THREE_FIRST_PROMOTIONS + 1),
  );
};

export const projectSwarmDoctrine = (
  state: SwarmDoctrineState,
): SwarmDoctrineProjection => {
  const capacity = getSwarmDoctrineCapacity(state);
  const founderLevel5Count = state.founderLevel5Ids.length;
  const level10Count = state.level10Ids.length;

  if (capacity < SWARM_PHASE_TWO_CAP) {
    return {
      phase: capacity === SWARM_PHASE_ONE_CAP ? "FOUNDING" : "VETERAN",
      capacity,
      hardCap: SWARM_ABSOLUTE_CAP,
      founderCount: state.founderIds.length,
      founderLevel5Count,
      level10Count,
      nextUnlockLevel: 5,
      nextUnlockRequiredCount: Math.min(
        SWARM_PHASE_ONE_CAP,
        founderLevel5Count + 1,
      ),
    };
  }

  if (capacity < SWARM_ABSOLUTE_CAP) {
    const nextRequired = Math.max(
      SWARM_PHASE_THREE_FIRST_PROMOTIONS,
      level10Count + 1,
    );
    return {
      phase: capacity === SWARM_PHASE_TWO_CAP ? "VETERAN" : "ELITE",
      capacity,
      hardCap: SWARM_ABSOLUTE_CAP,
      founderCount: state.founderIds.length,
      founderLevel5Count,
      level10Count,
      nextUnlockLevel: 10,
      nextUnlockRequiredCount: Math.min(19, nextRequired),
    };
  }

  return {
    phase: "ELITE",
    capacity,
    hardCap: SWARM_ABSOLUTE_CAP,
    founderCount: state.founderIds.length,
    founderLevel5Count,
    level10Count,
    nextUnlockLevel: null,
    nextUnlockRequiredCount: null,
  };
};

export const canRecruitSwarmMember = (
  state: SwarmDoctrineState,
  liveFollowerCount: number,
) =>
  liveFollowerCount < getSwarmDoctrineCapacity(state) &&
  liveFollowerCount < SWARM_ABSOLUTE_CAP;
