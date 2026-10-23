/** DEV-only touch-access presentation policy; actions still invoke original guarded callbacks. */
export interface ArchitectDevQaTouchAccessInput {
  readonly explicitDev: boolean;
  readonly isPlaying: boolean;
  readonly inCampaign: boolean;
  readonly isWaveBreak: boolean;
  readonly isPaused: boolean;
  readonly isGameOver: boolean;
  readonly isPhotoMode: boolean;
  readonly isUpgradeSelectionOpen: boolean;
  readonly normalEncounterBusy: boolean;
  readonly qaActive: boolean;
  readonly guardCurrent: boolean;
  readonly directorActive: boolean;
}

export interface ArchitectDevQaTouchAccess {
  readonly mode: "DEV_QA_TOUCH_ACCESS_PRESENTATION";
  readonly qaToggleEnabled: boolean;
  readonly directorToggleEnabled: boolean;
  readonly patternNextEnabled: boolean;
  readonly qaToggleLabel: "ENTER QA" | "EXIT QA";
  readonly directorToggleLabel: "ENABLE AUTO" | "DISABLE AUTO";
  readonly patternNextLabel: "NEXT PATTERN";
}

export const BLACKOUT_ARCHITECT_DEV_QA_TOUCH_AUTHORITY = Object.freeze({
  ownsDevOnlyTouchPresentation: true,
  ownsReadOnlyActionEligibility: true,
  ownsNormalCombatActions: false,
  ownsBossAdmissionOrGuard: false,
  ownsAttackOrHullMutation: false,
  ownsCampaignInfiniteScoreAttack: false,
  ownsAndroidReleaseDiagnostic: false,
  ownsRewardsPersistenceOrRng: false,
} as const);

export const projectBlackoutArchitectDevQaTouchAccess = (
  input: Readonly<ArchitectDevQaTouchAccessInput> | null,
): Readonly<ArchitectDevQaTouchAccess> | null => {
  if (!input || typeof input !== "object") return null;
  const flags = [
    input.explicitDev, input.isPlaying, input.inCampaign,
    input.isWaveBreak, input.isPaused, input.isGameOver,
    input.isPhotoMode, input.isUpgradeSelectionOpen,
    input.normalEncounterBusy, input.qaActive,
    input.guardCurrent, input.directorActive,
  ];
  if (!flags.every(v => typeof v === "boolean") ||
      !input.explicitDev || !input.isPlaying || !input.inCampaign ||
      (input.directorActive && !input.qaActive)) return null;

  const safe = !input.isPaused && !input.isGameOver &&
    !input.isPhotoMode && !input.isUpgradeSelectionOpen;
  const canEnter = safe && input.isWaveBreak &&
    !input.normalEncounterBusy && !input.qaActive;
  const authenticatedQa = input.qaActive && input.guardCurrent && safe;
  return Object.freeze({
    mode: "DEV_QA_TOUCH_ACCESS_PRESENTATION" as const,
    // Exit remains possible to safely revoke stale QA state.
    qaToggleEnabled: input.qaActive || canEnter,
    directorToggleEnabled: authenticatedQa,
    patternNextEnabled: authenticatedQa && !input.directorActive,
    qaToggleLabel: input.qaActive ? "EXIT QA" as const : "ENTER QA" as const,
    directorToggleLabel: input.directorActive ? "DISABLE AUTO" as const :
      "ENABLE AUTO" as const,
    patternNextLabel: "NEXT PATTERN" as const,
  });
};
