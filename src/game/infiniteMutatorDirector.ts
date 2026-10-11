import { BiomeType } from "./types";
import type {
  InfiniteMutator,
  InfiniteProgressionTier,
} from "./infiniteSectorDirector";

export type EnvironmentalMutatorIdentity =
  | "RECOVERY_CLEAR"
  | "ECLIPSE"
  | "ELECTRICAL_STORM"
  | "MAGNETIC_DRIFT"
  | "UNSTABLE_RESOURCE_FIELDS"
  | "COMBAT_PRESSURE";

export interface DirectedMutatorSelectionInput {
  tier: InfiniteProgressionTier;
  biome: BiomeType;
  recoverySector: boolean;
  targetCount: number;
  orderedCandidates: readonly InfiniteMutator[];
}

const ENVIRONMENTAL_MUTATORS = new Set<InfiniteMutator>([
  "ELECTRICAL_STORM",
  "REDUCED_VISIBILITY",
  "MAGNETIC_DRIFT",
  "UNSTABLE_RESOURCE_FIELDS",
]);

const SEVERE_ENVIRONMENTAL_MUTATORS = new Set<InfiniteMutator>([
  "ELECTRICAL_STORM",
  "REDUCED_VISIBILITY",
]);

const CONFLICTS: Readonly<
  Partial<Record<InfiniteMutator, readonly InfiniteMutator[]>>
> = {
  ELECTRICAL_STORM: ["REDUCED_VISIBILITY", "FRAGILE_SWARM"],
  REDUCED_VISIBILITY: ["ELECTRICAL_STORM", "FORMATION_DISRUPTION"],
  FRAGILE_SWARM: ["ELECTRICAL_STORM"],
  FORMATION_DISRUPTION: ["REDUCED_VISIBILITY"],
};

const BIOME_ENVIRONMENTAL_PREFERENCE: Readonly<
  Record<BiomeType, readonly InfiniteMutator[]>
> = {
  [BiomeType.SOLAR_PLAINS]: ["REDUCED_VISIBILITY", "MAGNETIC_DRIFT"],
  [BiomeType.DEEP_WATER]: ["MAGNETIC_DRIFT", "UNSTABLE_RESOURCE_FIELDS"],
  [BiomeType.CYBER_VOID]: ["ELECTRICAL_STORM", "REDUCED_VISIBILITY"],
  [BiomeType.ACID_SWAMP]: ["UNSTABLE_RESOURCE_FIELDS", "REDUCED_VISIBILITY"],
  [BiomeType.MAGMA_CHAMBER]: ["REDUCED_VISIBILITY", "ELECTRICAL_STORM"],
  [BiomeType.QUANTUM_NEXUS]: ["MAGNETIC_DRIFT", "ELECTRICAL_STORM"],
};

const clampTargetCount = (targetCount: number, candidateCount: number) =>
  Math.min(candidateCount, Math.max(0, Math.floor(targetCount)));

const conflictsWithSelection = (
  candidate: InfiniteMutator,
  selected: readonly InfiniteMutator[],
) => {
  const directConflicts = CONFLICTS[candidate] ?? [];
  if (selected.some((active) => directConflicts.includes(active))) {
    return true;
  }

  return selected.some((active) =>
    (CONFLICTS[active] ?? []).includes(candidate),
  );
};

const canAddMutator = (
  candidate: InfiniteMutator,
  selected: readonly InfiniteMutator[],
) => {
  if (selected.includes(candidate)) return false;
  if (conflictsWithSelection(candidate, selected)) return false;

  if (
    SEVERE_ENVIRONMENTAL_MUTATORS.has(candidate) &&
    selected.some((active) => SEVERE_ENVIRONMENTAL_MUTATORS.has(active))
  ) {
    return false;
  }

  return true;
};

const firstBiomePreference = (
  biome: BiomeType,
  candidates: readonly InfiniteMutator[],
) => {
  const preferences = BIOME_ENVIRONMENTAL_PREFERENCE[biome];
  return preferences.find((mutator) => candidates.includes(mutator)) ?? null;
};

export const directInfiniteMutatorSelection = ({
  tier,
  biome,
  recoverySector,
  targetCount,
  orderedCandidates,
}: DirectedMutatorSelectionInput): InfiniteMutator[] => {
  if (recoverySector) return [];

  const candidates = [...new Set(orderedCandidates)];
  const target = clampTargetCount(targetCount, candidates.length);
  if (target === 0) return [];

  const selected: InfiniteMutator[] = [];

  if (tier !== "MASTERY") {
    const preferred = firstBiomePreference(biome, candidates);
    if (preferred) selected.push(preferred);
  }

  for (const candidate of candidates) {
    if (selected.length >= target) break;
    if (!canAddMutator(candidate, selected)) continue;
    selected.push(candidate);
  }

  if (tier !== "MASTERY" && !selected.some((mutator) => ENVIRONMENTAL_MUTATORS.has(mutator))) {
    const fallbackEnvironmental = candidates.find((mutator) =>
      ENVIRONMENTAL_MUTATORS.has(mutator),
    );
    if (fallbackEnvironmental) {
      selected.splice(Math.max(0, selected.length - 1), 1, fallbackEnvironmental);
    }
  }

  return selected.slice(0, target);
};

export const getEnvironmentalMutatorIdentity = (
  mutators: readonly InfiniteMutator[],
  recoverySector = false,
): EnvironmentalMutatorIdentity => {
  if (recoverySector) return "RECOVERY_CLEAR";
  if (mutators.includes("ELECTRICAL_STORM")) return "ELECTRICAL_STORM";
  if (mutators.includes("REDUCED_VISIBILITY")) return "ECLIPSE";
  if (mutators.includes("MAGNETIC_DRIFT")) return "MAGNETIC_DRIFT";
  if (mutators.includes("UNSTABLE_RESOURCE_FIELDS")) {
    return "UNSTABLE_RESOURCE_FIELDS";
  }
  return "COMBAT_PRESSURE";
};

export const countSevereEnvironmentalMutators = (
  mutators: readonly InfiniteMutator[],
) => mutators.filter((mutator) => SEVERE_ENVIRONMENTAL_MUTATORS.has(mutator)).length;

export const hasEnvironmentalMutator = (
  mutators: readonly InfiniteMutator[],
) => mutators.some((mutator) => ENVIRONMENTAL_MUTATORS.has(mutator));
