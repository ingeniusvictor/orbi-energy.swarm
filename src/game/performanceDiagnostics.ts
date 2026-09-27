import type { QualityPreset } from "./types";
import type { FrameHealthStatus } from "./frameHealthMonitor";

export interface PerformanceDiagnosticsSample {
  frameMs: number;
  loopCpuMs: number;
  physicsMs: number;
  renderMs: number;
  enemies: number;
  projectiles: number;
  particles: number;
  swarm: number;
  qualityPreset: QualityPreset;
  frameHealthStatus?: FrameHealthStatus;
}

export interface PerformanceDiagnosticsSnapshot {
  fps: number;
  averageFrameMs: number;
  averageCpuMs: number;
  averagePhysicsMs: number;
  averageRenderMs: number;
  averageOverheadMs: number;
  peakCpuMs: number;
  physicsShare: number;
  renderShare: number;
  enemies: number;
  projectiles: number;
  particles: number;
  swarm: number;
  qualityPreset: QualityPreset;
  frameHealthStatus?: FrameHealthStatus;
}

export interface PerformanceDiagnosticsState {
  elapsedMs: number;
  frames: number;
  frameMsTotal: number;
  cpuMsTotal: number;
  physicsMsTotal: number;
  renderMsTotal: number;
  peakCpuMs: number;
  latest?: Omit<
    PerformanceDiagnosticsSample,
    "frameMs" | "loopCpuMs" | "physicsMs" | "renderMs"
  >;
}

export const PERFORMANCE_DIAGNOSTICS_WINDOW_MS = 500;

export const createPerformanceDiagnosticsState =
  (): PerformanceDiagnosticsState => ({
    elapsedMs: 0,
    frames: 0,
    frameMsTotal: 0,
    cpuMsTotal: 0,
    physicsMsTotal: 0,
    renderMsTotal: 0,
    peakCpuMs: 0,
  });

const finiteNonNegative = (value: number) =>
  Number.isFinite(value) ? Math.max(0, value) : 0;

export const stepPerformanceDiagnostics = (
  state: PerformanceDiagnosticsState,
  sample: PerformanceDiagnosticsSample,
): {
  state: PerformanceDiagnosticsState;
  snapshot?: PerformanceDiagnosticsSnapshot;
} => {
  const frameMs = finiteNonNegative(sample.frameMs);
  const loopCpuMs = finiteNonNegative(sample.loopCpuMs);
  const physicsMs = Math.min(
    loopCpuMs,
    finiteNonNegative(sample.physicsMs),
  );
  const renderMs = Math.min(
    Math.max(0, loopCpuMs - physicsMs),
    finiteNonNegative(sample.renderMs),
  );

  if (frameMs <= 0) {
    return { state };
  }

  const next: PerformanceDiagnosticsState = {
    elapsedMs: state.elapsedMs + frameMs,
    frames: state.frames + 1,
    frameMsTotal: state.frameMsTotal + frameMs,
    cpuMsTotal: state.cpuMsTotal + loopCpuMs,
    physicsMsTotal: state.physicsMsTotal + physicsMs,
    renderMsTotal: state.renderMsTotal + renderMs,
    peakCpuMs: Math.max(state.peakCpuMs, loopCpuMs),
    latest: {
      enemies: Math.max(0, Math.floor(sample.enemies)),
      projectiles: Math.max(0, Math.floor(sample.projectiles)),
      particles: Math.max(0, Math.floor(sample.particles)),
      swarm: Math.max(0, Math.floor(sample.swarm)),
      qualityPreset: sample.qualityPreset,
      ...(sample.frameHealthStatus
        ? { frameHealthStatus: sample.frameHealthStatus }
        : {}),
    },
  };

  if (
    next.elapsedMs < PERFORMANCE_DIAGNOSTICS_WINDOW_MS ||
    next.frames <= 0 ||
    !next.latest
  ) {
    return { state: next };
  }

  const averageFrameMs =
    next.frameMsTotal / next.frames;
  const averageCpuMs = next.cpuMsTotal / next.frames;
  const averagePhysicsMs =
    next.physicsMsTotal / next.frames;
  const averageRenderMs =
    next.renderMsTotal / next.frames;
  const averageOverheadMs = Math.max(
    0,
    averageCpuMs -
      averagePhysicsMs -
      averageRenderMs,
  );
  const cpuDenominator = Math.max(
    0.0001,
    averageCpuMs,
  );

  const snapshot: PerformanceDiagnosticsSnapshot = {
    fps:
      averageFrameMs > 0
        ? 1000 / averageFrameMs
        : 0,
    averageFrameMs,
    averageCpuMs,
    averagePhysicsMs,
    averageRenderMs,
    averageOverheadMs,
    peakCpuMs: next.peakCpuMs,
    physicsShare:
      averagePhysicsMs / cpuDenominator,
    renderShare:
      averageRenderMs / cpuDenominator,
    enemies: next.latest.enemies,
    projectiles: next.latest.projectiles,
    particles: next.latest.particles,
    swarm: next.latest.swarm,
    qualityPreset: next.latest.qualityPreset,
    ...(next.latest.frameHealthStatus
      ? {
          frameHealthStatus:
            next.latest.frameHealthStatus,
        }
      : {}),
  };

  return {
    snapshot,
    state: createPerformanceDiagnosticsState(),
  };
};
