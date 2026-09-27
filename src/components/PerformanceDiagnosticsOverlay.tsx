import React from "react";

import type { PerformanceDiagnosticsSnapshot } from "../game/performanceDiagnostics";

interface PerformanceDiagnosticsOverlayProps {
  snapshot: PerformanceDiagnosticsSnapshot | null;
}

const metric = (value: number, digits = 1) =>
  Number.isFinite(value) ? value.toFixed(digits) : "--";

export const PerformanceDiagnosticsOverlay: React.FC<
  PerformanceDiagnosticsOverlayProps
> = ({ snapshot }) => {
  return (
    <aside
      className="pointer-events-none absolute right-2 top-2 z-[80] w-[190px] rounded-lg border border-cyan-400/30 bg-slate-950/90 p-2.5 font-mono shadow-[0_0_28px_rgba(34,211,238,0.12)] backdrop-blur"
      aria-label="Performance diagnostics"
      data-performance-diagnostics="true"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-[9px] font-black uppercase tracking-[0.14em] text-cyan-300">
          CPU DIAGNOSTICS
        </span>
        <span className="rounded border border-cyan-500/20 bg-cyan-500/10 px-1.5 py-0.5 text-[7px] uppercase text-cyan-200">
          F3
        </span>
      </div>

      {!snapshot ? (
        <div className="text-[8px] leading-relaxed text-slate-500">
          Collecting 0.5 s sample…
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-1 text-[8px]">
            <div className="rounded bg-slate-900/70 p-1.5">
              <div className="text-slate-500">FPS</div>
              <div className="text-[11px] font-black text-emerald-300">
                {metric(snapshot.fps)}
              </div>
            </div>
            <div className="rounded bg-slate-900/70 p-1.5">
              <div className="text-slate-500">FRAME</div>
              <div className="text-[11px] font-black text-slate-200">
                {metric(snapshot.averageFrameMs)} ms
              </div>
            </div>
          </div>

          <div className="mt-1.5 space-y-1 text-[8px]">
            <div className="flex justify-between">
              <span className="text-slate-500">CPU WORK</span>
              <span className="text-amber-300">
                {metric(snapshot.averageCpuMs)} ms
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">PHYSICS</span>
              <span className="text-cyan-300">
                {metric(snapshot.averagePhysicsMs)} ms ·{" "}
                {metric(snapshot.physicsShare * 100, 0)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">RENDER</span>
              <span className="text-violet-300">
                {metric(snapshot.averageRenderMs)} ms ·{" "}
                {metric(snapshot.renderShare * 100, 0)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">OVERHEAD</span>
              <span className="text-slate-300">
                {metric(snapshot.averageOverheadMs)} ms
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">PEAK CPU</span>
              <span className="text-rose-300">
                {metric(snapshot.peakCpuMs)} ms
              </span>
            </div>
          </div>

          <div className="my-2 h-px bg-slate-800" />

          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[8px]">
            <span className="text-slate-500">ENEMIES</span>
            <span className="text-right text-rose-300">
              {snapshot.enemies}
            </span>
            <span className="text-slate-500">PROJECTILES</span>
            <span className="text-right text-amber-300">
              {snapshot.projectiles}
            </span>
            <span className="text-slate-500">PARTICLES</span>
            <span className="text-right text-violet-300">
              {snapshot.particles}
            </span>
            <span className="text-slate-500">SWARM</span>
            <span className="text-right text-cyan-300">
              {snapshot.swarm}
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between border-t border-slate-800 pt-1.5 text-[7px] uppercase">
            <span className="text-slate-500">
              {snapshot.qualityPreset}
            </span>
            <span
              className={
                snapshot.frameHealthStatus === "CRITICAL"
                  ? "text-rose-300"
                  : snapshot.frameHealthStatus === "PRESSURED"
                    ? "text-amber-300"
                    : "text-emerald-300"
              }
            >
              {snapshot.frameHealthStatus ?? "SAMPLING"}
            </span>
          </div>
        </>
      )}
    </aside>
  );
};

export default PerformanceDiagnosticsOverlay;
