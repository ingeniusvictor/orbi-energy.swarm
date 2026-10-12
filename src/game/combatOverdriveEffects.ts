/**
 * Pure ES-13J2C-A ORBI Overdrive combat-expression projection.
 *
 * J2A/J2B remain the sole activation and timing authority. This module receives
 * only the already-certified Overdrive active signal and projects bounded combat
 * effects. It deliberately owns no clocks, React state, rendering, audio,
 * storage, random numbers, entity arrays or simulation scans.
 */
import type { CombatOverdriveProjection } from "./combatOverdrive";

export const OVERDRIVE_PLAYER_DAMAGE_MULTIPLIER = 1.2;
export const MAX_OVERDRIVE_PLAYER_DAMAGE_MULTIPLIER = 1.25;

export interface CombatOverdriveEffectsProjection {
  active: boolean;
  playerDamageMultiplier: number;
}

export const projectCombatOverdriveEffects = (
  overdrive: Pick<CombatOverdriveProjection, "active">,
): CombatOverdriveEffectsProjection => ({
  active: overdrive.active,
  playerDamageMultiplier: overdrive.active
    ? OVERDRIVE_PLAYER_DAMAGE_MULTIPLIER
    : 1,
});
