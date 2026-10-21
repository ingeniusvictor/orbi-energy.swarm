import { EnemyType, type Enemy } from "./types";
import { BLACKOUT_ARCHITECT_STANDALONE_COMBAT_BLUEPRINT as PROPOSAL } from "./blackoutArchitectStandaloneCombatBlueprint";

/**
 * B2B2B2B2B: an UNBALANCED, diagnostic-only Enemy constructor.
 * Caller consent alone is not authority: only the Vite DEV hotkey gate may
 * place this object in actual game refs. Production must never use it.
 */
export const BLACKOUT_ARCHITECT_DEV_QA_FACTORY_AUTHORITY = Object.freeze({
  ownsDevOnlyProvisionalEntityConstruction: true,
  ownsGameplayAutomaticSpawnAuthority: false,
  ownsProductionOrModeRoutingAuthority: false,
  ownsAuthenticatedEngineIdentityAuthority: false,
  ownsPhysicalCardinalGeometryAuthority: false,
  ownsCollisionOrHitAuthority: false,
  ownsProjectileConsumptionAuthority: false,
  ownsBossHealthOrDamageMutationAuthority: false,
  ownsAIOrAttackExecutionAuthority: false,
  ownsHudOrRewardsAuthority: false,
  ownsRandomnessOrTimerAuthority: false,
  ownsGlobalBudgetMutationAuthority: false,
} as const);

export const createBlackoutArchitectDevQaBoss = (requested: boolean): Enemy | null => {
  if (requested !== true ||
      PROPOSAL.bossId !== "BLACKOUT_ARCHITECT" ||
      PROPOSAL.blueprintMode !== "BLUEPRINT_ONLY" ||
      PROPOSAL.balanceStatus !== "PROVISIONAL_UNTUNED") return null;

  const maxHealth = PROPOSAL.core.proposedMaxHealth;
  const size = PROPOSAL.core.proposedVisualSize;
  if (!Number.isFinite(maxHealth) || maxHealth <= 0 ||
      !Number.isFinite(size) || size <= 0) return null;

  // No legacy BossChassis, raid stage or InfiniteBossIdentity: dedicated tag.
  return {
    id: "blackout_architect_dev_qa_reference_only",
    type: EnemyType.BOSS_ARCHITECT,
    architectBossIdentity: PROPOSAL.bossId,
    x: PROPOSAL.globalLimitsObserved.worldWidth / 2,
    y: 200,
    vx: 0,
    vy: 0,
    health: maxHealth,
    maxHealth,
    speed: 0,
    size,
    color: "#22d3ee",
    shootCooldown: 0,
    pulseCooldown: 0,
    contactDamageCooldown: 0,
    isDead: false,
    isBoss: true,
    bossPhase: 1,
    flashTicks: 0,
  };
};
