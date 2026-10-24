import { ORBI_MAX_EVOLUTION_LEVEL } from "./orbiEvolution";
import { ORBI_PROTAGONIST_ID } from "./orbiEnergyCanon";

/**
 * EV-F04 staging contract. Not connected to the live H4 doctrine yet.
 * ENERGY is the leader, consumes zero slots; the 9 collectible energies
 * plus unique GAIA account for the ten founding slots.
 *
 * Founder E5 and E8 milestones each grant one permanent bonus slot.
 * No E10 prerequisite survives in EVO8. A founder lost during battle
 * does not revoke the player's earned capacity in the current run.
 */
export const EVO8_FOUNDING_SLOTS = 10 as const;
export const EVO8_ABSOLUTE_SWARM_CAP = 30 as const;
export const EVO8_VETERAN_LEVEL = 5 as const;
export const EVO8_ELITE_LEVEL = 8 as const;

export interface Evo8SwarmDoctrineState {
  founderIds: readonly string[];
  veteranFounderIds: readonly string[];
  eliteFounderIds: readonly string[];
}

export const createEvo8SwarmDoctrine = (): Evo8SwarmDoctrineState => ({
  founderIds: [], veteranFounderIds: [], eliteFounderIds: [],
});

const appendUnique = (items: readonly string[], id: string) =>
  items.includes(id) ? items : [...items,id];

/** Adds each genuine follower once, capped at ten founder credits. */
export const registerEvo8Founder = (
  current: Evo8SwarmDoctrineState, id: string, level=1,
): Evo8SwarmDoctrineState => {
  if(!id || id===ORBI_PROTAGONIST_ID || current.founderIds.includes(id) || current.founderIds.length>=EVO8_FOUNDING_SLOTS) return current;
  return promoteEvo8Founder({...current,founderIds:[...current.founderIds,id]},id,level);
};

export const promoteEvo8Founder = (
  current: Evo8SwarmDoctrineState, id: string, level: number,
): Evo8SwarmDoctrineState => {
  if(!id || id===ORBI_PROTAGONIST_ID || !current.founderIds.includes(id) || !Number.isFinite(level)) return current;
  const safeLevel=Math.max(1,Math.min(ORBI_MAX_EVOLUTION_LEVEL,Math.floor(level)));
  const veteranFounderIds=safeLevel>=EVO8_VETERAN_LEVEL?appendUnique(current.veteranFounderIds,id):current.veteranFounderIds;
  const eliteFounderIds=safeLevel>=EVO8_ELITE_LEVEL?appendUnique(current.eliteFounderIds,id):current.eliteFounderIds;
  if(veteranFounderIds===current.veteranFounderIds&&eliteFounderIds===current.eliteFounderIds)return current;
  return {...current,veteranFounderIds,eliteFounderIds};
};

export const getEvo8SwarmCapacity = (state:Evo8SwarmDoctrineState):number =>
  Math.min(EVO8_ABSOLUTE_SWARM_CAP,
    EVO8_FOUNDING_SLOTS + state.veteranFounderIds.length + state.eliteFounderIds.length);

export const projectEvo8Doctrine = (state:Evo8SwarmDoctrineState) => ({
  capacity:getEvo8SwarmCapacity(state),
  maxCapacity:EVO8_ABSOLUTE_SWARM_CAP,
  founderCount:state.founderIds.length,
  veteranCredits:state.veteranFounderIds.length,
  eliteCredits:state.eliteFounderIds.length,
  nextMilestone:state.veteranFounderIds.length<10?5:state.eliteFounderIds.length<10?8:null,
});
