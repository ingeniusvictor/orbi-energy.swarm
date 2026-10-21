import { EnemyType, type Enemy } from "./types";

/**
 * B2B2B2B2A — cold engine-private identity guard.
 * Constructed only in the mounted game engine (and independently in tests).
 * NO Architect is installed and NO admission is called by gameplay yet.
 * A synthetic unit test passing the same references is NOT proof of live spawn.
 */
export interface BlackoutArchitectEngineIdentityGuard {
  readonly bossId: "BLACKOUT_ARCHITECT";
  readonly guardMode: "ENGINE_IDENTITY_GUARD_ONLY";
  readonly runEpoch: number;
  readonly encounterOrdinal: number;
  readonly installedReferencePreconditionSatisfied: true;
  readonly actualGameplayEncounterCertified: false;
  readonly physicalCardinalGeometryCertified: false;
  readonly collisionOrHitCertified: false;
  readonly projectileConsumptionAuthorized: false;
  readonly bossHpOrDamageMutationAuthorized: false;
  readonly bossAIOrAttackAuthorized: false;
  readonly gameplayBossSpawnAuthorized: false;
  readonly renderingOrHudAuthorized: false;
  readonly modeRoutingOrRewardsAuthorized: false;
}

export interface BlackoutArchitectEngineIdentityLifecycleOwner {
  readonly beginRun: () => number | null;
  readonly revoke: () => null;
  readonly invalidateRun: () => null;
  readonly admitInstalledBoss: (
    candidate: Enemy | null,
    installedBoss: Enemy | null,
    enemies: readonly Enemy[],
  ) => Readonly<BlackoutArchitectEngineIdentityGuard> | null;
  readonly isCurrent: (
    guard: unknown,
    candidate: Enemy | null,
    installedBoss: Enemy | null,
    enemies: readonly Enemy[],
  ) => boolean;
}

export const BLACKOUT_ARCHITECT_ENGINE_IDENTITY_GUARD_AUTHORITY = Object.freeze({
  ownsMonotonicPrivateRunEpochAuthority: true,
  ownsMonotonicPrivateEncounterOrdinalAuthority: true,
  ownsInstalledReferencePreconditionGuardOnly: true,
  ownsAutomaticBossSpawnAuthority: false,
  ownsLiveEncounterCertificationAuthority: false,
  ownsPhysicalCardinalGeometryAuthority: false,
  ownsAnchorDurabilityAuthority: false,
  ownsCollisionOrHitProvenanceAuthority: false,
  ownsProjectileConsumptionAuthority: false,
  ownsGlobalReplayProvenanceAuthority: false,
  ownsBossHealthOrDamageAuthority: false,
  ownsBossAIOrAttackExecutionAuthority: false,
  ownsBossPhaseOrExposureTimerAuthority: false,
  ownsRendererOrHudAuthority: false,
  ownsRuntimeOrModeRoutingAuthority: false,
  ownsRewardsOrPersistenceAuthority: false,
  ownsEntityOrProjectileCollectionAuthority: false,
  ownsRandomnessOrClockAuthority: false,
  ownsFotonOrFormationAuthority: false,
  ownsCapOrBudgetAuthority: false,
} as const);

/** Bounded, fail-closed successor; never reset the owner's counters on revoke. */
export const nextBlackoutArchitectEngineIdentityOrdinal = (previous: unknown): number | null =>
  typeof previous === "number" &&
  Number.isSafeInteger(previous) &&
  previous >= 0 &&
  !Object.is(previous, -0) &&
  previous < Number.MAX_SAFE_INTEGER
    ? previous + 1
    : null;

const matchesInstalledArchitect = (
  candidate: Enemy | null,
  installedBoss: Enemy | null,
  enemies: readonly Enemy[],
): candidate is Enemy => {
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate) ||
      candidate !== installedBoss || !Array.isArray(enemies) ||
      enemies.length < 1 || enemies[enemies.length - 1] !== candidate) return false;
  return candidate.type === EnemyType.BOSS_ARCHITECT &&
    candidate.architectBossIdentity === "BLACKOUT_ARCHITECT" &&
    candidate.isBoss === true &&
    candidate.isDead === false &&
    typeof candidate.health === "number" && Number.isFinite(candidate.health) && candidate.health > 0 &&
    typeof candidate.maxHealth === "number" && Number.isFinite(candidate.maxHealth) &&
    candidate.maxHealth > 0 && candidate.health <= candidate.maxHealth &&
    candidate.bossChassis === undefined &&
    candidate.infiniteBossIdentity === undefined &&
    candidate.milestoneKind === undefined &&
    candidate.bossEncounterStage === undefined;
};

/**
 * Strictly private per-game-engine instance: caller cannot set the run epoch or
 * ordinal. True live provenance requires a future dedicated game spawn to
 * invoke admitInstalledBoss AFTER physical installation, which is NOT done here.
 */
export const createBlackoutArchitectEngineIdentityLifecycleOwner =
  (): Readonly<BlackoutArchitectEngineIdentityLifecycleOwner> => {
    let epoch = 0;
    let ordinal = 0;
    let activeRun = false;
    let currentBoss: Enemy | null = null;
    let currentGuard: Readonly<BlackoutArchitectEngineIdentityGuard> | null = null;
    const alreadyAdmitted = new WeakSet<Enemy>();

    const revoke = (): null => {
      currentGuard = null;
      currentBoss = null;
      return null;
    };

    const invalidateRun = (): null => {
      revoke();
      activeRun = false;
      return null;
    };

    const beginRun = (): number | null => {
      invalidateRun();
      const next = nextBlackoutArchitectEngineIdentityOrdinal(epoch);
      if (next === null) return null;
      epoch = next;
      activeRun = true;
      return epoch;
    };

    const admitInstalledBoss = (
      candidate: Enemy | null,
      installedBoss: Enemy | null,
      enemies: readonly Enemy[],
    ): Readonly<BlackoutArchitectEngineIdentityGuard> | null => {
      if (currentGuard !== null) return revoke();
      try {
        if (!activeRun || !matchesInstalledArchitect(candidate, installedBoss, enemies) ||
            alreadyAdmitted.has(candidate)) return revoke();
        const next = nextBlackoutArchitectEngineIdentityOrdinal(ordinal);
        if (next === null) return revoke();
        ordinal = next;
        currentBoss = candidate;
        alreadyAdmitted.add(candidate);
        currentGuard = Object.freeze({
          bossId: "BLACKOUT_ARCHITECT",
          guardMode: "ENGINE_IDENTITY_GUARD_ONLY",
          runEpoch: epoch,
          encounterOrdinal: ordinal,
          installedReferencePreconditionSatisfied: true,
          actualGameplayEncounterCertified: false,
          physicalCardinalGeometryCertified: false,
          collisionOrHitCertified: false,
          projectileConsumptionAuthorized: false,
          bossHpOrDamageMutationAuthorized: false,
          bossAIOrAttackAuthorized: false,
          gameplayBossSpawnAuthorized: false,
          renderingOrHudAuthorized: false,
          modeRoutingOrRewardsAuthorized: false,
        });
        return currentGuard;
      } catch {
        return revoke();
      }
    };

    const isCurrent = (
      guard: unknown,
      candidate: Enemy | null,
      installedBoss: Enemy | null,
      enemies: readonly Enemy[],
    ): boolean => {
      if (!activeRun || currentGuard === null) return false;
      try {
        if (guard !== currentGuard || candidate !== currentBoss ||
            !matchesInstalledArchitect(candidate, installedBoss, enemies)) {
          revoke();
          return false;
        }
        return true;
      } catch {
        revoke();
        return false;
      }
    };

    return Object.freeze({ beginRun, revoke, invalidateRun, admitInstalledBoss, isCurrent });
  };
