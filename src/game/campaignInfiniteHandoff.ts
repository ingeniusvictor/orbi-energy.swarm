import type { GameStats } from "./types";
import {
  applyCampaignVictoryCheckpoint,
  type CampaignVictoryCheckpointInput,
  type RunCommitLedger,
  type RunCommitTransition,
} from "./runPersistence";
import {
  createInfiniteSession,
  validateInfiniteSession,
  type InfiniteSessionState,
} from "./infiniteSession";
import {
  createInfiniteRuntimeWaveDescriptor,
  infiniteDescriptorMatchesSession,
  type RuntimeWaveDescriptor,
} from "./runtimeWaveDescriptor";
import {
  NEUTRAL_INFINITE_RUN_CONTEXT,
  type InfiniteRunContext,
} from "./infiniteContextDirector";

export interface CampaignInfiniteHandoff {
  checkpoint: RunCommitTransition;
  session: InfiniteSessionState;
  descriptor: RuntimeWaveDescriptor;
}

export const beginInfiniteAfterCampaignVictory = (
  fresh: GameStats,
  victoryInput: CampaignVictoryCheckpointInput,
  ledger: RunCommitLedger,
  seed = "orbi-infinite",
  context: InfiniteRunContext = NEUTRAL_INFINITE_RUN_CONTEXT,
): CampaignInfiniteHandoff => {
  const checkpoint = applyCampaignVictoryCheckpoint(
    fresh,
    victoryInput,
    ledger,
  );

  const session = createInfiniteSession(seed, context);
  const descriptor = createInfiniteRuntimeWaveDescriptor(session);

  const validation = validateInfiniteSession(session);
  if (!validation.valid) {
    throw new RangeError(
      `Infinite handoff produced an invalid session: ${validation.errors.join(", ")}`,
    );
  }

  if (!infiniteDescriptorMatchesSession(descriptor, session)) {
    throw new RangeError(
      "Infinite handoff descriptor does not match the created session.",
    );
  }

  return {
    checkpoint,
    session,
    descriptor,
  };
};
