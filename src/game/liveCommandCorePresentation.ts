import {
  resolveCommandLinkBinding,
  type CommandLinkFormationFacts,
} from "./commandLinkBinding";

export type LiveCommandCoreMarkerKind = "COMMAND_CORE_PRIORITY";

export interface LiveCommandCorePresentation {
  markerKind: LiveCommandCoreMarkerKind;
  profileId: "COMMAND_CORE";
  ringRadius: number;
  lineWidth: number;
  alpha: number;
  strokeColor: string;
  glowColor: string;
  glowBlur: number;
  chevronOffsetY: number;
  chevronHalfWidth: number;
  chevronHeight: number;
}

const MIN_RING_RADIUS = 18;
const MAX_RING_RADIUS = 42;
const MARKER_LINE_WIDTH = 2;
const MARKER_ALPHA = 0.82;
const MARKER_GLOW_BLUR = 8;
const MARKER_CHEVRON_GAP = 7;
const MARKER_CHEVRON_HALF_WIDTH = 5;
const MARKER_CHEVRON_HEIGHT = 6;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const projectLiveCommandCorePresentation = (
  formation: CommandLinkFormationFacts | null | undefined,
  enemySize: number,
): Readonly<LiveCommandCorePresentation> | null => {
  if (!formation || !Number.isFinite(enemySize) || enemySize <= 0) return null;

  const binding = resolveCommandLinkBinding(formation);
  if (!binding || binding.memberRole !== "COMMAND_CORE") return null;

  const ringRadius = clamp(enemySize * 1.55, MIN_RING_RADIUS, MAX_RING_RADIUS);

  return Object.freeze({
    markerKind: "COMMAND_CORE_PRIORITY",
    profileId: binding.profileId,
    ringRadius,
    lineWidth: MARKER_LINE_WIDTH,
    alpha: MARKER_ALPHA,
    strokeColor: "#fde047",
    glowColor: "#f59e0b",
    glowBlur: MARKER_GLOW_BLUR,
    chevronOffsetY: -(ringRadius + MARKER_CHEVRON_GAP),
    chevronHalfWidth: MARKER_CHEVRON_HALF_WIDTH,
    chevronHeight: MARKER_CHEVRON_HEIGHT,
  });
};
