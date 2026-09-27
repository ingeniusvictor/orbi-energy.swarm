import {
  advanceInfiniteSession,
  validateInfiniteSession,
  type InfiniteSessionState,
} from "./infiniteSession";
import {
  createCampaignRuntimeWaveDescriptor,
  createInfiniteRuntimeWaveDescriptor,
  type RuntimeWaveDescriptor,
} from "./runtimeWaveDescriptor";

export type RuntimeProgressionState =
  | {
      mode: "CAMPAIGN";
      campaignSector: number;
    }
  | {
      mode: "INFINITE";
      session: InfiniteSessionState;
    };

export const createCampaignRuntimeState = (
  campaignSector = 1,
): RuntimeProgressionState => {
  if (
    !Number.isInteger(campaignSector) ||
    campaignSector < 1 ||
    campaignSector > 10
  ) {
    throw new RangeError(
      "Campaign runtime state is limited to handcrafted Sectors 1–10.",
    );
  }

  return {
    mode: "CAMPAIGN",
    campaignSector,
  };
};

export const createInfiniteRuntimeState = (
  session: InfiniteSessionState,
): RuntimeProgressionState => {
  const validation = validateInfiniteSession(session);
  if (!validation.valid || session.status !== "ACTIVE") {
    throw new RangeError(
      `Infinite runtime state requires a valid active session: ${validation.errors.join(", ")}`,
    );
  }

  return {
    mode: "INFINITE",
    session,
  };
};

export const resolveRuntimeWaveDescriptor = (
  state: RuntimeProgressionState,
): RuntimeWaveDescriptor => {
  if (state.mode === "CAMPAIGN") {
    return createCampaignRuntimeWaveDescriptor(state.campaignSector);
  }

  return createInfiniteRuntimeWaveDescriptor(state.session);
};

export const getRuntimeSector = (
  state: RuntimeProgressionState,
) =>
  state.mode === "CAMPAIGN"
    ? state.campaignSector
    : state.session.currentSector;

export const getRuntimeWaveNumber = (
  state: RuntimeProgressionState,
) =>
  state.mode === "CAMPAIGN"
    ? state.campaignSector
    : state.session.currentWaveNumber;

export const advanceInfiniteRuntimeState = (
  state: RuntimeProgressionState,
): RuntimeProgressionState => {
  if (state.mode !== "INFINITE") {
    throw new RangeError(
      "Only INFINITE runtime state can advance through infinite waves.",
    );
  }

  return createInfiniteRuntimeState(
    advanceInfiniteSession(state.session),
  );
};
