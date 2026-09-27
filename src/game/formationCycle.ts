import { FormationType } from "./types";

export const FORMATION_CYCLE_ORDER: readonly FormationType[] = [
  FormationType.LINE,
  FormationType.CIRCLE,
  FormationType.DELTA,
  FormationType.SHIELD,
  FormationType.V_SHAPE,
  FormationType.SCATTERED,
];

export type FormationCycleDirection = -1 | 1;

export const cycleFormation = (
  current: FormationType,
  direction: FormationCycleDirection,
): FormationType => {
  const currentIndex = FORMATION_CYCLE_ORDER.indexOf(current);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const nextIndex =
    (safeIndex + direction + FORMATION_CYCLE_ORDER.length) %
    FORMATION_CYCLE_ORDER.length;
  return FORMATION_CYCLE_ORDER[nextIndex];
};
