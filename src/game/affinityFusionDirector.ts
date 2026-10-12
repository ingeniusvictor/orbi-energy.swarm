import {
  OrbiType,
  type OrbiAffinity,
  type OrbiAttackSignature,
  type OrbiCombatRole,
  type OrbiEnergyId,
  type OrbiMember,
} from "./types";

export const AFFINITY_FUSION_ENERGY_COST = 100;
export const AFFINITY_FUSION_SOURCE_COUNT = 3;

export type AffinityFusionRecipeId =
  | "BEAM_SOLAR_GUARDIAN"
  | "PULSE_HYDRO_LEVIATHAN";

export interface AffinityFusionOutputProfile {
  type: OrbiType.SOLAR_GUARDIAN | OrbiType.HYDRO_LEVIATHAN;
  name: string;
  color: string;
  size: number;
  shootCooldown: number;
  affinity: OrbiAffinity;
  combatRole: OrbiCombatRole;
  attackSignature: OrbiAttackSignature;
  personality: string;
  evolutionStage: number;
  level: number;
  xp: number;
}

export interface AffinityFusionRecipe {
  id: AffinityFusionRecipeId;
  sourceCombatRole: OrbiCombatRole;
  sourceCount: typeof AFFINITY_FUSION_SOURCE_COUNT;
  output: AffinityFusionOutputProfile;
}

export interface AffinityFusionResolution {
  recipe: AffinityFusionRecipe;
  sourceIds: readonly [string, string, string];
}

export interface AppliedAffinityFusion {
  members: OrbiMember[];
  fusedMember: OrbiMember;
  consumedMembers: readonly [OrbiMember, OrbiMember, OrbiMember];
}

const COLLECTIBLE_FUSION_SOURCE_IDS = new Set<OrbiEnergyId>([
  "HYDRO",
  "AERO",
  "TERMO",
  "MAGNE",
  "ATON",
  "KINETRIX",
  "H2NOVA",
  "QUANTUM",
]);

const FUSION_CLASS_TYPES = new Set<OrbiType>([
  OrbiType.SOLAR_GUARDIAN,
  OrbiType.HYDRO_LEVIATHAN,
]);

/**
 * Order is intentional and deterministic. The legacy runtime checked its
 * Solar compatibility path before Hydro; H12 preserves that preference while
 * replacing body-count thresholds with explicit three-source recipes.
 */
export const AFFINITY_FUSION_RECIPES: readonly AffinityFusionRecipe[] = [
  {
    id: "BEAM_SOLAR_GUARDIAN",
    sourceCombatRole: "beam",
    sourceCount: AFFINITY_FUSION_SOURCE_COUNT,
    output: {
      type: OrbiType.SOLAR_GUARDIAN,
      name: "SOLAR GUARDIAN",
      color: "#fbbf24",
      size: 7,
      shootCooldown: 25,
      affinity: "solar",
      combatRole: "beam",
      attackSignature: "FOTON_LANCE",
      personality: "PRIMAL",
      evolutionStage: 3,
      level: 5,
      xp: 0,
    },
  },
  {
    id: "PULSE_HYDRO_LEVIATHAN",
    sourceCombatRole: "pulse",
    sourceCount: AFFINITY_FUSION_SOURCE_COUNT,
    output: {
      type: OrbiType.HYDRO_LEVIATHAN,
      name: "HYDRO LEVIATHAN",
      color: "#22d3ee",
      size: 16,
      shootCooldown: 30,
      affinity: "hydro",
      combatRole: "pulse",
      attackSignature: "HYDRO_PULSE",
      personality: "MAJESTIC",
      evolutionStage: 3,
      level: 5,
      xp: 0,
    },
  },
] as const;

export const isAffinityFusionSource = (
  member: OrbiMember,
): boolean =>
  Boolean(member.energyId) &&
  COLLECTIBLE_FUSION_SOURCE_IDS.has(member.energyId as OrbiEnergyId) &&
  member.energyId !== "FOTON" &&
  member.energyId !== "GAIA" &&
  !FUSION_CLASS_TYPES.has(member.type);

const compareWeakestFusionSource = (
  left: OrbiMember,
  right: OrbiMember,
): number => {
  const levelDifference = (left.level ?? 1) - (right.level ?? 1);
  if (levelDifference !== 0) return levelDifference;

  const xpDifference = (left.xp ?? 0) - (right.xp ?? 0);
  if (xpDifference !== 0) return xpDifference;

  return left.id.localeCompare(right.id);
};

export const resolveAffinityFusion = (
  members: readonly OrbiMember[],
  fusionEnergy: number,
): AffinityFusionResolution | null => {
  if (!Number.isFinite(fusionEnergy) || fusionEnergy < AFFINITY_FUSION_ENERGY_COST) {
    return null;
  }

  for (const recipe of AFFINITY_FUSION_RECIPES) {
    const candidates = members
      .filter(
        (member) =>
          isAffinityFusionSource(member) &&
          member.combatRole === recipe.sourceCombatRole,
      )
      .sort(compareWeakestFusionSource);

    if (candidates.length < recipe.sourceCount) continue;

    return {
      recipe,
      sourceIds: [
        candidates[0].id,
        candidates[1].id,
        candidates[2].id,
      ],
    };
  }

  return null;
};

export const consumeAffinityFusionEnergy = (
  fusionEnergy: number,
): number =>
  Math.max(
    0,
    Number.isFinite(fusionEnergy)
      ? fusionEnergy - AFFINITY_FUSION_ENERGY_COST
      : 0,
  );

/**
 * Applies a previously resolved 3→1 transformation without mutating the input.
 * The caller supplies the new stable runtime id and spawn anchor; Swarm Doctrine
 * state is deliberately not touched here so historical promotion credits stay
 * monotonic and the level-5 fusion body cannot mint a new founder credit.
 */
export const applyAffinityFusion = (
  members: readonly OrbiMember[],
  resolution: AffinityFusionResolution,
  fusedMemberId: string,
  spawnPosition: { x: number; y: number },
): AppliedAffinityFusion | null => {
  if (!fusedMemberId) return null;

  const sourceIds = new Set(resolution.sourceIds);
  if (sourceIds.size !== AFFINITY_FUSION_SOURCE_COUNT) return null;

  const consumed = resolution.sourceIds.map((sourceId) =>
    members.find((member) => member.id === sourceId),
  );
  if (consumed.some((member) => member === undefined)) return null;
  const consumedMembers = consumed as [
    OrbiMember,
    OrbiMember,
    OrbiMember,
  ];
  if (
    consumedMembers.some(
      (member) =>
        !isAffinityFusionSource(member) ||
        member.combatRole !== resolution.recipe.sourceCombatRole,
    )
  ) {
    return null;
  }

  const output = resolution.recipe.output;
  const fusedMember: OrbiMember = {
    id: fusedMemberId,
    type: output.type,
    name: output.name,
    x: spawnPosition.x,
    y: spawnPosition.y,
    targetX: spawnPosition.x,
    targetY: spawnPosition.y,
    color: output.color,
    size: output.size,
    shootCooldown: output.shootCooldown,
    affinity: output.affinity,
    combatRole: output.combatRole,
    attackSignature: output.attackSignature,
    personality: output.personality,
    evolutionStage: output.evolutionStage,
    level: output.level,
    xp: output.xp,
  };

  const survivors = members.filter((member) => !sourceIds.has(member.id));

  return {
    members: [...survivors, fusedMember],
    fusedMember,
    consumedMembers,
  };
};
