import React from "react";

import type { RunArchiveEntry } from "../game/types";
import { formatNumber, useGameTranslation } from "../i18n";

interface RecentRunArchivePanelProps {
  entries: readonly RunArchiveEntry[];
  limit?: number;
  compact?: boolean;
}

const formatDuration = (durationMs: number) => {
  const totalSeconds = Math.max(
    0,
    Math.floor(durationMs / 1000),
  );
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor(
    (totalSeconds % 3600) / 60,
  );
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return [
      hours,
      String(minutes).padStart(2, "0"),
      String(seconds).padStart(2, "0"),
    ].join(":");
  }

  return [
    minutes,
    String(seconds).padStart(2, "0"),
  ].join(":");
};

const humanizeId = (value: string) =>
  value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );

export const RecentRunArchivePanel: React.FC<
  RecentRunArchivePanelProps
> = ({
  entries,
  limit = 3,
  compact = false,
}) => {
  const { language, t } = useGameTranslation();
  const safeLimit = Math.max(1, Math.floor(limit));
  const visibleEntries = entries.slice(0, safeLimit);
  const archivedCount = entries.length;

  const formatCompletedAt = (value: string) => {
    const parsed = new Date(value);
    if (!Number.isFinite(parsed.getTime())) {
      return "--";
    }

    return new Intl.DateTimeFormat(
      language === "es" ? "es-CL" : "en-US",
      {
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      },
    ).format(parsed);
  };

  const getReachLabel = (entry: RunArchiveEntry) => {
    if (
      entry.infiniteSectorReached !== undefined &&
      entry.infiniteWaveReached !== undefined
    ) {
      return `∞ S${entry.infiniteSectorReached} · W${entry.infiniteWaveReached}`;
    }

    return language === "es"
      ? `CAMPAÑA · O${entry.campaignWaveReached}`
      : `CAMPAIGN · W${entry.campaignWaveReached}`;
  };

  const getUpgradeName = (id: string) => {
    const key = `upgrades.items.${id}.name`;
    const translated = t(key);
    return translated && translated !== key
      ? translated
      : humanizeId(id);
  };

  return (
    <section
      className="rounded-xl border border-indigo-500/20 bg-indigo-950/10 p-3 text-left shadow-[inset_0_0_30px_rgba(99,102,241,0.035)]"
      data-run-archive-panel="true"
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] font-black font-mono uppercase tracking-[0.16em] text-indigo-300">
            ◈ {language === "es"
              ? "REGISTRADOR DE VUELO"
              : "FLIGHT RECORDER"}
          </div>
          <div className="text-[8px] font-mono uppercase tracking-[0.12em] text-slate-500">
            {language === "es"
              ? "PARTIDAS RECIENTES"
              : "RECENT RUNS"}
          </div>
        </div>
        <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[8px] font-mono text-indigo-300">
          {archivedCount}/8
        </span>
      </div>

      {visibleEntries.length === 0 ? (
        <p
          className="rounded-lg border border-dashed border-slate-800/80 bg-slate-950/35 p-2.5 text-[9px] font-mono leading-relaxed text-slate-500"
          data-run-archive-empty="true"
        >
          {language === "es"
            ? "Completa una partida para registrar aquí su build, formación dominante y alcance."
            : "Complete a run to record its build, dominant formation and reach here."}
        </p>
      ) : (
        <div
          className="space-y-2"
          data-run-archive-list="true"
        >
          {visibleEntries.map((entry) => {
            const build = Object.entries(
              entry.temporaryBuild,
            );
            const visibleBuild = build.slice(0, 3);
            const hiddenBuildCount = Math.max(
              0,
              build.length - visibleBuild.length,
            );
            const campaignCleared =
              entry.outcome === "CAMPAIGN_CLEARED";

            return (
              <article
                key={entry.runId}
                data-run-id={entry.runId}
                className="rounded-lg border border-slate-800/70 bg-slate-950/55 p-2.5"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`rounded-full border px-1.5 py-0.5 text-[8px] font-black font-mono uppercase ${
                          campaignCleared
                            ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
                            : "border-rose-500/25 bg-rose-500/10 text-rose-300"
                        }`}
                      >
                        {campaignCleared
                          ? (language === "es"
                              ? "CAMPAÑA SUPERADA"
                              : "CAMPAIGN CLEARED")
                          : (language === "es"
                              ? "DERROTA"
                              : "DEFEAT")}
                      </span>
                      <span className="text-[8px] font-mono text-slate-600">
                        {formatCompletedAt(
                          entry.completedAt,
                        )}
                      </span>
                    </div>
                    <div className="mt-1 text-[10px] font-black font-mono text-cyan-300">
                      {getReachLabel(entry)}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[8px] font-mono uppercase text-slate-600">
                      {language === "es"
                        ? "PUNTUACIÓN"
                        : "SCORE"}
                    </div>
                    <div className="text-sm font-black font-mono text-amber-300">
                      {formatNumber(entry.score)}
                    </div>
                  </div>
                </div>

                <div
                  className={`mt-2 grid gap-1.5 font-mono ${
                    compact
                      ? "grid-cols-2"
                      : "grid-cols-2 sm:grid-cols-4"
                  }`}
                >
                  <div className="rounded bg-slate-900/55 px-1.5 py-1">
                    <div className="text-[7px] uppercase text-slate-600">
                      {language === "es"
                        ? "TIEMPO"
                        : "TIME"}
                    </div>
                    <div className="text-[9px] font-bold text-slate-300">
                      {formatDuration(entry.durationMs)}
                    </div>
                  </div>
                  <div className="rounded bg-slate-900/55 px-1.5 py-1">
                    <div className="text-[7px] uppercase text-slate-600">
                      {language === "es"
                        ? "PICO"
                        : "PEAK"}
                    </div>
                    <div className="text-[9px] font-bold text-cyan-300">
                      {entry.maxSwarmSize} ORBIS
                    </div>
                  </div>
                  <div className="rounded bg-slate-900/55 px-1.5 py-1">
                    <div className="text-[7px] uppercase text-slate-600">
                      {language === "es"
                        ? "AFINIDAD"
                        : "AFFINITY"}
                    </div>
                    <div className="truncate text-[9px] font-bold uppercase text-amber-300">
                      {entry.strongestAffinity}
                    </div>
                  </div>
                  <div className="rounded bg-slate-900/55 px-1.5 py-1">
                    <div className="text-[7px] uppercase text-slate-600">
                      {language === "es"
                        ? "FORMACIÓN"
                        : "FORMATION"}
                    </div>
                    <div className="truncate text-[9px] font-bold uppercase text-indigo-300">
                      {humanizeId(
                        entry.mostUsedFormation,
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-2 flex flex-wrap gap-1">
                  {visibleBuild.length > 0 ? (
                    visibleBuild.map(([id, stacks]) => (
                      <span
                        key={id}
                        className="max-w-full truncate rounded border border-cyan-500/15 bg-cyan-950/20 px-1.5 py-0.5 text-[8px] font-mono text-cyan-200"
                        title={getUpgradeName(id)}
                      >
                        {getUpgradeName(id)} ×{stacks}
                      </span>
                    ))
                  ) : (
                    <span className="text-[8px] font-mono italic text-slate-600">
                      {language === "es"
                        ? "Sin mejoras temporales"
                        : "No temporary upgrades"}
                    </span>
                  )}
                  {hiddenBuildCount > 0 && (
                    <span className="rounded border border-slate-700/70 bg-slate-900/60 px-1.5 py-0.5 text-[8px] font-mono text-slate-400">
                      +{hiddenBuildCount}
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default RecentRunArchivePanel;
