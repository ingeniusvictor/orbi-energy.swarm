import {
  buildCertifiedInfiniteSectorPlan,
  NEUTRAL_INFINITE_RUN_CONTEXT,
  type CertifiedInfiniteSectorPlan,
} from "./infinitePlanBuilder";
import type {
  InfiniteRunContext,
  NormalizedInfiniteRunContext,
} from "./infiniteContextDirector";
import type { InfiniteWaveExecutionPlan } from "./infiniteExecutionPlan";

export type InfiniteSessionStatus =
  | "ACTIVE"
  | "DEFEATED"
  | "EXITED";

export interface InfiniteSessionState {
  kind: "INFINITE_SESSION";
  sessionId: string;
  seed: string;
  status: InfiniteSessionStatus;
  currentSector: number;
  currentWaveNumber: number;
  sectorsCompleted: number;
  wavesCompleted: number;
  context: NormalizedInfiniteRunContext;
  currentPlan: CertifiedInfiniteSectorPlan;
}

export interface InfiniteSessionValidation {
  valid: boolean;
  errors: string[];
}

const getSessionId = (
  seed: string,
  contextFingerprint: string,
) => `infinite-session:${seed}:${contextFingerprint}`;

export const createInfiniteSession = (
  seed = "orbi-infinite",
  context: InfiniteRunContext = NEUTRAL_INFINITE_RUN_CONTEXT,
): InfiniteSessionState => {
  const currentPlan = buildCertifiedInfiniteSectorPlan(
    11,
    seed,
    context,
  );

  return {
    kind: "INFINITE_SESSION",
    sessionId: getSessionId(
      seed,
      currentPlan.certification.contextFingerprint,
    ),
    seed,
    status: "ACTIVE",
    currentSector: 11,
    currentWaveNumber: 1,
    sectorsCompleted: 0,
    wavesCompleted: 0,
    context: { ...currentPlan.effectiveRecipe.context },
    currentPlan,
  };
};

export const getCurrentInfiniteExecutionPlan = (
  session: InfiniteSessionState,
): InfiniteWaveExecutionPlan => {
  const plan =
    session.currentPlan.executionPlans[
      session.currentWaveNumber - 1
    ];

  if (!plan) {
    throw new RangeError(
      "Infinite session wave cursor is outside the current certified plan.",
    );
  }

  return plan;
};

export const advanceInfiniteSession = (
  session: InfiniteSessionState,
  nextSectorContext: InfiniteRunContext = session.context,
): InfiniteSessionState => {
  if (session.status !== "ACTIVE") {
    throw new RangeError(
      "Only an active infinite session can advance.",
    );
  }

  const waveCount = session.currentPlan.executionPlans.length;
  if (
    session.currentWaveNumber < 1 ||
    session.currentWaveNumber > waveCount
  ) {
    throw new RangeError("Infinite session has an invalid wave cursor.");
  }

  const wavesCompleted = session.wavesCompleted + 1;

  if (session.currentWaveNumber < waveCount) {
    return {
      ...session,
      currentWaveNumber: session.currentWaveNumber + 1,
      wavesCompleted,
    };
  }

  const nextSector = session.currentSector + 1;
  const nextPlan = buildCertifiedInfiniteSectorPlan(
    nextSector,
    session.seed,
    nextSectorContext,
  );

  return {
    ...session,
    currentSector: nextSector,
    currentWaveNumber: 1,
    sectorsCompleted: session.sectorsCompleted + 1,
    wavesCompleted,
    context: { ...nextPlan.effectiveRecipe.context },
    currentPlan: nextPlan,
  };
};

export const endInfiniteSession = (
  session: InfiniteSessionState,
  status: Exclude<InfiniteSessionStatus, "ACTIVE">,
): InfiniteSessionState => {
  if (session.status !== "ACTIVE") {
    return session;
  }

  return {
    ...session,
    status,
  };
};

export const validateInfiniteSession = (
  session: InfiniteSessionState,
): InfiniteSessionValidation => {
  const errors: string[] = [];

  if (session.kind !== "INFINITE_SESSION") {
    errors.push("kind");
  }

  if (!Number.isInteger(session.currentSector) || session.currentSector < 11) {
    errors.push("currentSector");
  }

  if (session.currentPlan.sector !== session.currentSector) {
    errors.push("planSector");
  }

  if (session.currentPlan.seed !== session.seed) {
    errors.push("seed");
  }

  const waveCount = session.currentPlan.executionPlans.length;
  if (
    !Number.isInteger(session.currentWaveNumber) ||
    session.currentWaveNumber < 1 ||
    session.currentWaveNumber > waveCount
  ) {
    errors.push("currentWaveNumber");
  }

  if (
    !Number.isInteger(session.sectorsCompleted) ||
    session.sectorsCompleted < 0 ||
    session.sectorsCompleted !== session.currentSector - 11
  ) {
    errors.push("sectorsCompleted");
  }

  if (
    !Number.isInteger(session.wavesCompleted) ||
    session.wavesCompleted < 0
  ) {
    errors.push("wavesCompleted");
  }

  if (
    JSON.stringify(session.context) !==
    JSON.stringify(session.currentPlan.effectiveRecipe.context)
  ) {
    errors.push("context");
  }

  const currentExecution =
    session.currentPlan.executionPlans[
      session.currentWaveNumber - 1
    ];

  if (
    currentExecution &&
    (
      currentExecution.sector !== session.currentSector ||
      currentExecution.waveIndex !== session.currentWaveNumber ||
      currentExecution.seed !== session.seed
    )
  ) {
    errors.push("currentExecution");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
