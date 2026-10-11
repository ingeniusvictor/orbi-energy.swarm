export type H4HostileArchetypeId =
  | "RIFT_HUNTER"
  | "SIEGE_PRISM"
  | "SWARM_REAVER"
  | "VOID_ANCHOR"
  | "MINE_WEAVER"
  | "MIRROR_WARDEN";

export type H4SurvivalEventId =
  | "INVASION_SURGE"
  | "BLACKOUT_HUNT"
  | "CROSSFIRE_PROTOCOL"
  | "MINEFIELD_DRIFT"
  | "PREDATOR_LOCK"
  | "LAST_STAND"
  | "RECOVERY_WINDOW";

export interface H4HostileArchetypeProfile {
  id: H4HostileArchetypeId;
  displayName: string;
  unlockSector: number;
  minimumTelegraphMs: number;
  activeCap: number;
  projectileCost: number;
  antiIdle: boolean;
  priorityTarget: boolean;
  role:
    | "INTERCEPTOR"
    | "ARTILLERY"
    | "SWARM_CONTROL"
    | "AREA_DENIAL"
    | "TRAP_LAYER"
    | "DIRECTIONAL_DEFENSE";
}

export interface H4SurvivalEventProfile {
  id: H4SurvivalEventId;
  displayName: string;
  minimumSector: number;
  durationMs: number;
  telegraphMs: number;
  concurrentEnemyBonus: number;
  spawnIntervalMultiplier: number;
  projectileDensityMultiplier: number;
  hardControlSources: number;
  recovery: boolean;
}

export interface AdaptiveInvasionProjection {
  sector: number;
  wave: number;
  swarmSize: number;
  pressureRank: number;
  concurrentEnemyBonus: number;
  spawnIntervalMultiplier: number;
  attackRateMultiplier: number;
  projectileDensityMultiplier: number;
  unlockedArchetypes: readonly H4HostileArchetypeId[];
  event: H4SurvivalEventProfile | null;
}

export const H4_HOSTILE_ARCHETYPES: Readonly<
  Record<H4HostileArchetypeId, H4HostileArchetypeProfile>
> = Object.freeze({
  RIFT_HUNTER: Object.freeze({
    id: "RIFT_HUNTER",
    displayName: "Rift Hunter",
    unlockSector: 11,
    minimumTelegraphMs: 850,
    activeCap: 6,
    projectileCost: 0,
    antiIdle: true,
    priorityTarget: true,
    role: "INTERCEPTOR",
  }),
  SIEGE_PRISM: Object.freeze({
    id: "SIEGE_PRISM",
    displayName: "Siege Prism",
    unlockSector: 16,
    minimumTelegraphMs: 1100,
    activeCap: 4,
    projectileCost: 3,
    antiIdle: true,
    priorityTarget: true,
    role: "ARTILLERY",
  }),
  SWARM_REAVER: Object.freeze({
    id: "SWARM_REAVER",
    displayName: "Swarm Reaver",
    unlockSector: 21,
    minimumTelegraphMs: 900,
    activeCap: 4,
    projectileCost: 0,
    antiIdle: false,
    priorityTarget: true,
    role: "SWARM_CONTROL",
  }),
  VOID_ANCHOR: Object.freeze({
    id: "VOID_ANCHOR",
    displayName: "Void Anchor",
    unlockSector: 31,
    minimumTelegraphMs: 1200,
    activeCap: 3,
    projectileCost: 2,
    antiIdle: true,
    priorityTarget: true,
    role: "AREA_DENIAL",
  }),
  MINE_WEAVER: Object.freeze({
    id: "MINE_WEAVER",
    displayName: "Mine Weaver",
    unlockSector: 41,
    minimumTelegraphMs: 950,
    activeCap: 3,
    projectileCost: 4,
    antiIdle: true,
    priorityTarget: false,
    role: "TRAP_LAYER",
  }),
  MIRROR_WARDEN: Object.freeze({
    id: "MIRROR_WARDEN",
    displayName: "Mirror Warden",
    unlockSector: 51,
    minimumTelegraphMs: 1000,
    activeCap: 3,
    projectileCost: 1,
    antiIdle: false,
    priorityTarget: true,
    role: "DIRECTIONAL_DEFENSE",
  }),
});

export const H4_SURVIVAL_EVENTS: Readonly<
  Record<H4SurvivalEventId, H4SurvivalEventProfile>
> = Object.freeze({
  INVASION_SURGE: Object.freeze({
    id: "INVASION_SURGE",
    displayName: "Invasion Surge",
    minimumSector: 11,
    durationMs: 18000,
    telegraphMs: 1600,
    concurrentEnemyBonus: 8,
    spawnIntervalMultiplier: 0.72,
    projectileDensityMultiplier: 1.08,
    hardControlSources: 0,
    recovery: false,
  }),
  BLACKOUT_HUNT: Object.freeze({
    id: "BLACKOUT_HUNT",
    displayName: "Blackout Hunt",
    minimumSector: 16,
    durationMs: 16000,
    telegraphMs: 1800,
    concurrentEnemyBonus: 5,
    spawnIntervalMultiplier: 0.8,
    projectileDensityMultiplier: 1.1,
    hardControlSources: 1,
    recovery: false,
  }),
  CROSSFIRE_PROTOCOL: Object.freeze({
    id: "CROSSFIRE_PROTOCOL",
    displayName: "Crossfire Protocol",
    minimumSector: 21,
    durationMs: 15000,
    telegraphMs: 2000,
    concurrentEnemyBonus: 4,
    spawnIntervalMultiplier: 0.86,
    projectileDensityMultiplier: 1.22,
    hardControlSources: 1,
    recovery: false,
  }),
  MINEFIELD_DRIFT: Object.freeze({
    id: "MINEFIELD_DRIFT",
    displayName: "Minefield Drift",
    minimumSector: 31,
    durationMs: 17000,
    telegraphMs: 1900,
    concurrentEnemyBonus: 3,
    spawnIntervalMultiplier: 0.9,
    projectileDensityMultiplier: 1.16,
    hardControlSources: 1,
    recovery: false,
  }),
  PREDATOR_LOCK: Object.freeze({
    id: "PREDATOR_LOCK",
    displayName: "Predator Lock",
    minimumSector: 41,
    durationMs: 14000,
    telegraphMs: 1500,
    concurrentEnemyBonus: 6,
    spawnIntervalMultiplier: 0.78,
    projectileDensityMultiplier: 1.12,
    hardControlSources: 0,
    recovery: false,
  }),
  LAST_STAND: Object.freeze({
    id: "LAST_STAND",
    displayName: "Last Stand",
    minimumSector: 51,
    durationMs: 22000,
    telegraphMs: 2400,
    concurrentEnemyBonus: 10,
    spawnIntervalMultiplier: 0.68,
    projectileDensityMultiplier: 1.25,
    hardControlSources: 2,
    recovery: false,
  }),
  RECOVERY_WINDOW: Object.freeze({
    id: "RECOVERY_WINDOW",
    displayName: "Recovery Window",
    minimumSector: 11,
    durationMs: 12000,
    telegraphMs: 900,
    concurrentEnemyBonus: -6,
    spawnIntervalMultiplier: 1.32,
    projectileDensityMultiplier: 0.82,
    hardControlSources: 0,
    recovery: true,
  }),
});

const hash = (value: string) => {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
};

export const getUnlockedH4Archetypes = (
  sector: number,
): H4HostileArchetypeId[] =>
  (Object.values(H4_HOSTILE_ARCHETYPES) as H4HostileArchetypeProfile[])
    .filter((profile) => sector >= profile.unlockSector)
    .map((profile) => profile.id);

/**
 * One event at most is projected for a wave. Every fourth wave after a severe
 * event becomes a recovery window, preventing procedural overlap from turning
 * into unreadable damage. The selection is seeded and contains no runtime IO.
 */
export const selectH4SurvivalEvent = (
  sector: number,
  wave: number,
  seed = "orbi-h4",
): H4SurvivalEventProfile | null => {
  if (sector < 11 || wave < 1) return null;

  if ((sector + wave) % 5 === 0) {
    return H4_SURVIVAL_EVENTS.RECOVERY_WINDOW;
  }

  if ((sector + wave) % 2 !== 0) return null;

  const candidates = (Object.values(H4_SURVIVAL_EVENTS) as H4SurvivalEventProfile[])
    .filter((profile) => !profile.recovery && sector >= profile.minimumSector);
  if (candidates.length === 0) return null;

  return candidates[hash(`${seed}:${sector}:${wave}`) % candidates.length] ?? null;
};

export const projectAdaptiveInvasion = (
  sector: number,
  wave: number,
  swarmSize: number,
  seed = "orbi-h4",
): AdaptiveInvasionProjection => {
  const safeSector = Math.max(11, Math.floor(sector));
  const safeWave = Math.max(1, Math.floor(wave));
  const safeSwarm = Math.max(0, Math.min(30, Math.floor(swarmSize)));
  const sectorPressure = Math.log2(Math.max(2, safeSector - 8));
  const swarmPressure = Math.max(0, safeSwarm - 10) / 20;
  const pressureRank = Math.max(
    1,
    Math.min(10, Math.floor(sectorPressure + safeWave * 0.3 + swarmPressure * 3)),
  );
  const event = selectH4SurvivalEvent(safeSector, safeWave, seed);
  const recovery = Boolean(event?.recovery);

  const baseConcurrentBonus = Math.min(
    18,
    Math.floor((safeSector - 10) / 8) + Math.floor(swarmPressure * 8),
  );
  const concurrentEnemyBonus = Math.max(
    recovery ? -8 : 0,
    baseConcurrentBonus + (event?.concurrentEnemyBonus ?? 0),
  );

  const baseSpawnIntervalMultiplier = Math.max(
    0.58,
    0.96 - Math.min(0.28, (safeSector - 11) * 0.0022) - swarmPressure * 0.1,
  );
  const spawnIntervalMultiplier = Math.min(
    1.4,
    Math.max(0.5, baseSpawnIntervalMultiplier * (event?.spawnIntervalMultiplier ?? 1)),
  );

  const attackRateMultiplier = Math.min(
    1.85,
    (recovery ? 0.9 : 1) *
      (1 + Math.min(0.45, (safeSector - 11) * 0.003) + swarmPressure * 0.22),
  );
  const projectileDensityMultiplier = Math.min(
    1.65,
    Math.max(
      0.75,
      (1 + Math.min(0.32, (safeSector - 11) * 0.0025) + swarmPressure * 0.14) *
        (event?.projectileDensityMultiplier ?? 1),
    ),
  );

  return {
    sector: safeSector,
    wave: safeWave,
    swarmSize: safeSwarm,
    pressureRank,
    concurrentEnemyBonus,
    spawnIntervalMultiplier,
    attackRateMultiplier,
    projectileDensityMultiplier,
    unlockedArchetypes: getUnlockedH4Archetypes(safeSector),
    event,
  };
};
