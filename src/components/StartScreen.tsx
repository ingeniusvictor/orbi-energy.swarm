import React, { useState } from "react";
import { Play, Cpu, Volume2, VolumeX, Globe } from "lucide-react";
import { GameStats, QualityPreset } from "../game/types";
import { playClickSound } from "../game/audio";
import { useGameTranslation, formatNumber } from "../i18n";
import PremiumBackdrop from "./presentation/PremiumBackdrop";
import CampaignArc from "./CampaignArc";
import RecentRunArchivePanel from "./RecentRunArchivePanel";

const LazyFoton3DHero = React.lazy(
  () => import("./presentation/Foton3DHero"),
);

interface StartScreenProps {
  stats: GameStats;
  onStartGame: () => void;
  onResetStats: () => void;
  onChangePreset: (preset: QualityPreset) => void;
  onToggleMute: () => void;
  onToggleBossLabelsMode?: (mode: "FULL" | "IMPORTANT" | "OFF") => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  stats,
  onStartGame,
  onResetStats,
  onChangePreset,
  onToggleMute,
  onToggleBossLabelsMode
}) => {
  const { language, setLanguage, t } = useGameTranslation();
  const [activeTab, setActiveTab] = useState<"MAIN" | "HOW_TO" | "CONTROLS" | "SETTINGS" | "ABOUT" | "CODEX">("MAIN");
  const hasInfiniteRecord = stats.bestInfiniteSector >= 11;

  const clickTab = (tab: "MAIN" | "HOW_TO" | "CONTROLS" | "SETTINGS" | "ABOUT" | "CODEX") => {
    playClickSound();
    setActiveTab(tab);
  };

  return (
    <div className="orbi-premium-entry absolute inset-0 z-50 flex flex-col items-center justify-start xl:justify-center p-4 md:p-6 text-white select-none overflow-y-auto">
      <PremiumBackdrop />
      {/* GLOWING HEADER */}
      <div className="orbi-start-header relative z-10 text-center mb-5">
        <div className="flex justify-center items-center gap-2 mb-1">
          <span className="orbi-premium-eyebrow px-2.5 py-1 text-[10px] md:text-xs font-mono rounded-full bg-cyan-400/8 text-cyan-200 border border-cyan-300/20 tracking-[0.12em]">
            PUBLIC BETA v0.2.0-beta.1
          </span>
          <span className="text-xs font-mono text-slate-400">© 2026 ORBI ECOSYSTEM</span>
        </div>
        <h1 className="orbi-premium-title text-4xl sm:text-5xl md:text-6xl font-black leading-[0.92] mt-3">
          ORBI ENERGY SWARM
        </h1>
        <p className="text-slate-300/80 text-[10px] md:text-xs font-mono mt-3 uppercase tracking-[0.22em]">
          {t("startScreen.tacticalSlogan")}
        </p>
      </div>

      {/* QUICK FLOATING LANGUAGE CHANGER */}
      <div className="orbi-start-language relative z-10 flex items-center gap-2 mb-4 bg-slate-950/55 px-3 py-1.5 rounded-full border border-cyan-200/10 backdrop-blur-xl shadow-[0_10px_36px_rgba(0,0,0,0.28)]">
        <Globe size={11} className="text-amber-400" />
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{t("general.language")}:</span>
        <button
          onClick={() => { playClickSound(); setLanguage("es"); }}
          className={`px-2 py-0.5 text-[10px] font-mono rounded-full transition ${
            language === "es"
              ? "bg-amber-500 text-black font-bold"
              : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
          }`}
        >
          ESPAÑOL
        </button>
        <span className="text-slate-700">|</span>
        <button
          onClick={() => { playClickSound(); setLanguage("en"); }}
          className={`px-2 py-0.5 text-[10px] font-mono rounded-full transition ${
            language === "en"
              ? "bg-amber-500 text-black font-bold"
              : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
          }`}
        >
          ENGLISH
        </button>
      </div>

      {/* CORE GLASS CARD PANEL */}
      <div className="orbi-premium-panel orbi-start-deck relative z-10 w-full max-w-[1500px] overflow-y-auto rounded-2xl p-4 md:p-5 xl:p-6 backdrop-blur-2xl">
        {/* NAV BAR */}
        <div className="orbi-start-tabs sticky top-0 z-30 -mx-1 mb-4 flex flex-wrap gap-1.5 md:gap-2 border-b border-slate-800/80 bg-slate-950/90 px-1 pb-3 pt-1 justify-center backdrop-blur-xl">
          <button
            onClick={() => clickTab("MAIN")}
            className={`px-3 py-1.5 rounded text-xs font-mono font-semibold transition ${
              activeTab === "MAIN" ? "bg-amber-500/20 text-amber-400 border border-amber-500/40" : "hover:bg-slate-800 text-slate-400"
            }`}
          >
            {t("startScreen.playTab")}
          </button>
          <button
            onClick={() => clickTab("HOW_TO")}
            className={`px-3 py-1.5 rounded text-xs font-mono font-semibold transition ${
              activeTab === "HOW_TO" ? "bg-amber-500/20 text-amber-400 border border-amber-500/40" : "hover:bg-slate-800 text-slate-400"
            }`}
          >
            {t("startScreen.howToTab")}
          </button>
          <button
            onClick={() => clickTab("CONTROLS")}
            className={`px-3 py-1.5 rounded text-xs font-mono font-semibold transition ${
              activeTab === "CONTROLS" ? "bg-amber-500/20 text-amber-400 border border-amber-500/40" : "hover:bg-slate-800 text-slate-400"
            }`}
          >
            {t("startScreen.controlsTab")}
          </button>
          <button
            onClick={() => clickTab("CODEX")}
            className={`px-3 py-1.5 rounded text-xs font-mono font-semibold transition ${
              activeTab === "CODEX" ? "bg-amber-500/20 text-amber-400 border border-amber-500/40" : "hover:bg-slate-800 text-slate-400"
            }`}
          >
            {t("startScreen.codexTab")}
          </button>
          <button
            onClick={() => clickTab("SETTINGS")}
            className={`px-3 py-1.5 rounded text-xs font-mono font-semibold transition ${
              activeTab === "SETTINGS" ? "bg-amber-500/20 text-amber-400 border border-amber-500/40" : "hover:bg-slate-800 text-slate-400"
            }`}
          >
            {t("startScreen.settingsTab")}
          </button>
          <button
            onClick={() => clickTab("ABOUT")}
            className={`px-3 py-1.5 rounded text-xs font-mono font-semibold transition ${
              activeTab === "ABOUT" ? "bg-amber-500/20 text-amber-400 border border-amber-500/40" : "hover:bg-slate-800 text-slate-400"
            }`}
          >
            {t("startScreen.aboutTab")}
          </button>
        </div>

        {/* TAB 1: MAIN LAUNCH & STATS */}
        {activeTab === "MAIN" && (
          <div className="orbi-start-main-grid grid gap-4 xl:grid-cols-[0.9fr_1.25fr_0.95fr] animate-fadeIn">
            {/* LEFT — PILOT / CAMPAIGN RECORD */}
            <section className="orbi-start-record order-2 xl:order-1 space-y-3 rounded-2xl border border-cyan-500/15 bg-slate-950/45 p-4 shadow-[inset_0_0_45px_rgba(34,211,238,0.035)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] font-black font-mono uppercase tracking-[0.18em] text-cyan-300">
                    {language === "es" ? "REGISTRO DEL PILOTO" : "PILOT RECORD"}
                  </div>
                  <div className="text-[9px] font-mono uppercase tracking-[0.12em] text-slate-500">
                    {language === "es" ? "TELEMETRÍA PERSISTENTE" : "PERSISTENT TELEMETRY"}
                  </div>
                </div>
                <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 py-1 text-[9px] font-mono text-cyan-300">
                  BETA
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="rounded-lg border border-slate-800/80 bg-slate-950/65 p-2.5">
                  <div className="text-[9px] font-mono uppercase text-slate-500">{t("startScreen.highScore")}</div>
                  <div className="text-xl font-black font-mono text-cyan-300">{formatNumber(stats.highScore)}</div>
                </div>
                <div className="rounded-lg border border-slate-800/80 bg-slate-950/65 p-2.5">
                  <div className="text-[9px] font-mono uppercase text-slate-500">{t("startScreen.bestWave")}</div>
                  <div className="text-xl font-black font-mono text-pink-300">{t("hud.wave")} {stats.bestWave}</div>
                </div>
                <div className="rounded-lg border border-slate-800/80 bg-slate-950/65 p-2.5">
                  <div className="text-[9px] font-mono uppercase text-slate-500">{t("startScreen.maxPopulation")}</div>
                  <div className="text-lg font-black font-mono text-amber-300">{stats.bestSwarmSize} ORBIS</div>
                </div>
                <div className="rounded-lg border border-slate-800/80 bg-slate-950/65 p-2.5">
                  <div className="text-[9px] font-mono uppercase text-slate-500">{t("startScreen.totalMissions")}</div>
                  <div className="text-lg font-black font-mono text-slate-200">{stats.totalRuns}</div>
                </div>
              </div>

              <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/10 p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[10px] font-black font-mono tracking-[0.16em] text-cyan-300 uppercase">
                      ∞ INFINITE SWARM
                    </div>
                    <div className="text-[8px] font-mono text-slate-500 uppercase">
                      {language === "es" ? "ARCHIVO DE MAESTRÍA" : "MASTERY ARCHIVE"}
                    </div>
                  </div>
                  <span className={`rounded-full border px-2 py-1 text-[8px] font-mono ${
                    hasInfiniteRecord
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      : "border-slate-700 bg-slate-900/70 text-slate-500"
                  }`}>
                    {hasInfiniteRecord
                      ? (language === "es" ? "SINCRONIZADO" : "SYNCED")
                      : (language === "es" ? "BLOQUEADO" : "LOCKED")}
                  </span>
                </div>

                {hasInfiniteRecord ? (
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="rounded-lg bg-slate-950/55 p-2">
                      <div className="text-[8px] text-slate-500 font-mono uppercase">{language === "es" ? "MEJOR SECTOR" : "BEST SECTOR"}</div>
                      <div className="text-base font-black font-mono text-cyan-300">{stats.bestInfiniteSector}</div>
                    </div>
                    <div className="rounded-lg bg-slate-950/55 p-2">
                      <div className="text-[8px] text-slate-500 font-mono uppercase">{language === "es" ? "OLEADA" : "WAVE"}</div>
                      <div className="text-base font-black font-mono text-indigo-300">{stats.bestInfiniteWave}</div>
                    </div>
                    <div className="rounded-lg bg-slate-950/55 p-2">
                      <div className="text-[8px] text-slate-500 font-mono uppercase">WARDENS</div>
                      <div className="text-base font-black font-mono text-amber-300">{stats.infiniteMinibossesDefeated}</div>
                    </div>
                    <div className="rounded-lg bg-slate-950/55 p-2">
                      <div className="text-[8px] text-slate-500 font-mono uppercase">REMATCHES</div>
                      <div className="text-base font-black font-mono text-pink-300">{stats.infiniteBossRematchesDefeated}</div>
                    </div>
                  </div>
                ) : (
                  <p className="text-[9px] font-mono text-slate-500 leading-relaxed">
                    {language === "es"
                      ? "Derrota al Blackout Devourer y abre el Sector 11 para activar la progresión infinita."
                      : "Defeat the Blackout Devourer and open Sector 11 to activate Infinite progression."}
                  </p>
                )}
              </div>

              <RecentRunArchivePanel
                entries={stats.recentRunArchive}
                limit={3}
                compact
              />
            </section>

            {/* CENTER — HERO / WORLD PITCH */}
            <section className="orbi-start-hero order-3 xl:order-2 overflow-hidden rounded-2xl border border-indigo-500/20 bg-[radial-gradient(circle_at_50%_35%,rgba(34,211,238,0.09),transparent_34%),radial-gradient(circle_at_50%_70%,rgba(139,92,246,0.08),transparent_36%),rgba(2,6,23,0.55)] p-4 md:p-5">
              <div className="orbi-start-hero-stage relative min-h-[360px] md:min-h-[420px] overflow-hidden rounded-xl border border-cyan-500/10 bg-slate-950/55">
                <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(34,211,238,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.04)_1px,transparent_1px)] [background-size:32px_32px]" />
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  data-foton-css-fallback="true"
                >
                  <div className="orbi-start-core relative h-56 w-56 md:h-64 md:w-64">
                    <div className="absolute inset-0 rounded-full border border-cyan-400/20 shadow-[0_0_80px_rgba(34,211,238,0.12)]" />
                    <div className="absolute inset-5 rounded-full border border-indigo-400/20 [transform:rotateX(68deg)]" />
                    <div className="absolute inset-10 rounded-full border border-violet-400/20 [transform:rotateY(68deg)]" />
                    <div className="absolute inset-[27%] rounded-full bg-[radial-gradient(circle_at_35%_30%,#fef3c7_0%,#f59e0b_15%,#22d3ee_40%,#0f172a_70%)] shadow-[0_0_60px_rgba(34,211,238,0.42),0_0_120px_rgba(139,92,246,0.18)]" />
                    <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_24px_white]" />
                  </div>
                </div>

                {stats.qualityPreset !== QualityPreset.LOW && (
                  <React.Suspense fallback={null}>
                    <LazyFoton3DHero
                      qualityPreset={stats.qualityPreset}
                    />
                  </React.Suspense>
                )}

                <div className="absolute left-4 top-4 z-20 rounded-full border border-cyan-500/20 bg-slate-950/75 px-3 py-1 text-[9px] font-mono uppercase tracking-[0.16em] text-cyan-300">
                  FOTON // COMMAND CORE
                </div>
                <div className="absolute right-4 top-4 z-20 rounded-full border border-indigo-500/20 bg-slate-950/75 px-3 py-1 text-[8px] font-mono uppercase tracking-[0.14em] text-indigo-300">
                  {stats.qualityPreset === QualityPreset.LOW
                    ? "CSS CORE // LOW"
                    : `3D CORE // ${stats.qualityPreset}`}
                </div>
                <div className="absolute bottom-4 left-4 right-4 z-20 rounded-xl border border-slate-800/70 bg-slate-950/80 p-3 backdrop-blur-md">
                  <div className="text-[9px] font-mono uppercase tracking-[0.16em] text-amber-300">
                    {language === "es" ? "SISTEMA TÁCTICO AUTÓNOMO" : "AUTONOMOUS TACTICAL SYSTEM"}
                  </div>
                  <p className="mt-1 text-[10px] leading-relaxed text-slate-400">
                    {language === "es"
                      ? "Coordina tu enjambre, adapta formaciones y sobrevive a una red hostil que evoluciona contigo."
                      : "Coordinate your swarm, adapt formations and survive a hostile network that evolves with you."}
                  </p>
                </div>
              </div>

              <div className="orbi-start-campaign mt-4">
                <CampaignArc language={language} />
              </div>
            </section>

            {/* RIGHT — ALWAYS-REACHABLE LAUNCH CONTROL */}
            <aside className="orbi-start-launch order-1 xl:order-3 xl:sticky xl:top-14 self-start rounded-2xl border border-amber-500/25 bg-[linear-gradient(180deg,rgba(120,53,15,0.12),rgba(2,6,23,0.72))] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.32),inset_0_0_40px_rgba(245,158,11,0.04)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] font-black font-mono uppercase tracking-[0.18em] text-amber-300">
                    {language === "es" ? "CONTROL DE LANZAMIENTO" : "LAUNCH CONTROL"}
                  </div>
                  <div className="text-[8px] font-mono uppercase tracking-[0.12em] text-slate-500">
                    ORBI // FOTON-01
                  </div>
                </div>
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.9)]" />
              </div>

              <div className="mt-4 rounded-xl border border-slate-800/70 bg-slate-950/60 p-3">
                <div className="grid grid-cols-2 gap-2 text-[9px] font-mono">
                  <div>
                    <div className="uppercase text-slate-600">{language === "es" ? "MODO" : "MODE"}</div>
                    <div className="font-bold text-cyan-300">{hasInfiniteRecord ? "CAMPAIGN / ∞" : "CAMPAIGN"}</div>
                  </div>
                  <div>
                    <div className="uppercase text-slate-600">{language === "es" ? "CALIDAD" : "QUALITY"}</div>
                    <div className="font-bold text-indigo-300">{stats.qualityPreset}</div>
                  </div>
                  <div>
                    <div className="uppercase text-slate-600">{language === "es" ? "MEJOR OLEADA" : "BEST WAVE"}</div>
                    <div className="font-bold text-pink-300">{stats.bestWave}</div>
                  </div>
                  <div>
                    <div className="uppercase text-slate-600">{language === "es" ? "RUNS" : "RUNS"}</div>
                    <div className="font-bold text-slate-200">{stats.totalRuns}</div>
                  </div>
                </div>
              </div>

              <button
                data-primary-start-cta="true"
                onClick={() => {
                  playClickSound();
                  onStartGame();
                }}
                className="orbi-premium-cta mt-4 w-full rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 px-4 py-4 text-sm font-black tracking-[0.14em] text-slate-950 shadow-[0_12px_45px_rgba(245,158,11,0.22)] transition duration-300 hover:from-amber-400 hover:via-yellow-300 hover:to-amber-300 active:scale-[0.98]"
              >
                <span className="flex items-center justify-center gap-2">
                  <Play size={17} fill="currentColor" />
                  {t("startScreen.activateSync")}
                </span>
              </button>

              <div className="mt-2 flex items-center justify-center gap-2 text-[8px] font-mono uppercase tracking-[0.12em] text-slate-600">
                <span>ENTER</span>
                <span>•</span>
                <span>{language === "es" ? "ATAJO DE TECLADO" : "KEYBOARD SHORTCUT"}</span>
              </div>

              <div className="mt-4 rounded-xl border border-cyan-500/10 bg-cyan-950/10 p-3 text-[10px] leading-relaxed text-slate-400">
                {t("startScreen.sloganDesc")}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={() => clickTab("CONTROLS")}
                  className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-[9px] font-mono uppercase text-slate-300 transition hover:border-cyan-500/30 hover:text-cyan-300"
                >
                  {t("startScreen.controlsTab")}
                </button>
                <button
                  onClick={() => clickTab("SETTINGS")}
                  className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-[9px] font-mono uppercase text-slate-300 transition hover:border-indigo-500/30 hover:text-indigo-300"
                >
                  {t("startScreen.settingsTab")}
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* TAB 2: HOW TO PLAY */}
        {activeTab === "HOW_TO" && (
          <div className="space-y-4 text-slate-300 text-xs leading-relaxed animate-fadeIn">
            <h3 className="font-mono text-sm text-amber-400 border-b border-slate-800 pb-1">{t("startScreen.simulationOps")}</h3>
            <ol className="list-decimal list-inside space-y-2.5">
              <li>
                {t("startScreen.howToStep1")}
              </li>
              <li>
                {t("startScreen.howToStep2")}
              </li>
              <li>
                {t("startScreen.howToStep3")}
              </li>
              <li>
                {t("startScreen.howToStep4")}
              </li>
              <li>
                {t("startScreen.howToStep5")}
              </li>
            </ol>
            <div className="pt-2">
              <button onClick={() => clickTab("MAIN")} className="px-3 py-1.5 bg-slate-800 rounded font-mono hover:bg-slate-700 text-slate-200">
                &larr; {t("general.back")}
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: CONTROLS MAP */}
        {activeTab === "CONTROLS" && (
          <div className="space-y-4 text-xs font-mono text-slate-300 animate-fadeIn">
            <h3 className="text-sm text-amber-400 border-b border-slate-800 pb-1">{t("startScreen.controlKeybindings")}</h3>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-slate-950/50 p-2 rounded flex justify-between border border-slate-800/40">
                <span className="text-slate-400">WASD / ARROWS</span>
                <span className="text-amber-400 font-bold">{t("startScreen.keys.movement")}</span>
              </div>
              <div className="bg-slate-950/50 p-2 rounded flex justify-between border border-slate-800/40">
                <span className="text-slate-400">Mouse pointer</span>
                <span className="text-amber-400 font-bold">{t("startScreen.keys.followCursor")}</span>
              </div>
              <div className="bg-slate-950/50 p-2 rounded flex justify-between border border-slate-800/40 col-span-2">
                <span className="text-slate-400">Keys 1 - 6</span>
                <span className="text-cyan-400 font-bold">{t("startScreen.keys.formations")}</span>
              </div>
              <div className="bg-slate-950/50 p-2 rounded flex justify-between border border-slate-800/40">
                <span className="text-slate-400">P / Escape</span>
                <span className="text-pink-400 font-bold">{t("startScreen.keys.pause")}</span>
              </div>
              <div className="bg-slate-950/50 p-2 rounded flex justify-between border border-slate-800/40">
                <span className="text-slate-400">M Key</span>
                <span className="text-cyan-400 font-bold">{t("startScreen.keys.mute")}</span>
              </div>
              <div className="bg-slate-950/50 p-2 rounded flex justify-between border border-slate-800/40">
                <span className="text-slate-400">R Key</span>
                <span className="text-rose-400 font-bold">{t("results.restartRun")}</span>
              </div>
              <div className="bg-slate-950/50 p-2 rounded flex justify-between border border-slate-800/40 col-span-2">
                <span className="text-slate-400">Touch Device / D-Pad</span>
                <span className="text-white">{t("startScreen.keys.mobile")}</span>
              </div>
            </div>
            <div className="pt-2">
              <button onClick={() => clickTab("MAIN")} className="px-3 py-1.5 bg-slate-800 rounded hover:bg-slate-700 text-slate-200">
                &larr; {t("general.back")}
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: SETTINGS */}
        {activeTab === "SETTINGS" && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="font-mono text-sm text-amber-400 border-b border-slate-800 pb-1">{t("startScreen.simulationParams")}</h3>
            
            {/* EXPLICIT LANGUAGE SELECTOR WITHIN SETTINGS */}
            <div className="space-y-2 pb-2 border-b border-slate-800/60">
              <label className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                <Globe size={12} className="text-amber-400" /> {t("settings.languageLabel").toUpperCase()}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    playClickSound();
                    setLanguage("es");
                  }}
                  className={`py-1.5 rounded font-mono text-xs transition border ${
                    language === "es"
                      ? "bg-amber-500 text-black border-amber-500 font-bold"
                      : "bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800"
                  }`}
                >
                  ESPAÑOL
                </button>
                <button
                  onClick={() => {
                    playClickSound();
                    setLanguage("en");
                  }}
                  className={`py-1.5 rounded font-mono text-xs transition border ${
                    language === "en"
                      ? "bg-amber-500 text-black border-amber-500 font-bold"
                      : "bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800"
                  }`}
                >
                  ENGLISH
                </button>
              </div>
            </div>

            {/* QUALITY PRESETS */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 flex items-center gap-1.5 uppercase">
                <Cpu size={12} /> {t("startScreen.graphicsLabel")}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {([QualityPreset.LOW, QualityPreset.MEDIUM, QualityPreset.HIGH, QualityPreset.ULTRA]).map((preset) => (
                  <button
                    key={preset}
                    onClick={() => {
                      playClickSound();
                      onChangePreset(preset);
                    }}
                    className={`py-2 rounded font-mono text-xs font-semibold transition ${
                      stats.qualityPreset === preset
                        ? "bg-amber-500 text-black shadow-md font-bold"
                        : "bg-slate-850 hover:bg-slate-800 text-slate-300"
                    }`}
                  >
                    {t(`settings.options.${preset.toLowerCase()}` as any) || preset}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 font-mono italic leading-normal">
                {t("startScreen.graphicsDesc")}
              </p>
            </div>

            {/* MUTE CONTROL */}
            <div className="flex justify-between items-center py-2 border-y border-slate-800/60">
              <span className="text-xs font-mono text-slate-300 flex items-center gap-1.5 uppercase">
                {stats.audioMuted ? <VolumeX size={14} className="text-rose-400" /> : <Volume2 size={14} className="text-cyan-400" />}
                {t("startScreen.audioLabel")}
              </span>
              <button
                onClick={onToggleMute}
                className={`px-3 py-1 text-xs font-mono rounded ${
                  stats.audioMuted ? "bg-rose-500/20 text-rose-400 border border-rose-500/40" : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                }`}
              >
                {stats.audioMuted ? t("startScreen.audioMuted") : t("startScreen.audioActive")}
              </button>
            </div>

            {/* BOSS LABELS MODE ACCESSIBILITY ACCENT */}
            <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
              <span className="text-xs font-mono text-slate-300 flex flex-col">
                <span className="uppercase">{t("settings.bossAttackLabels")}</span>
                <span className="text-[10px] text-slate-500 italic font-sans">{t("startScreen.bossWarningsDesc")}</span>
              </span>
              <div className="flex gap-1">
                {(["FULL", "IMPORTANT", "OFF"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      playClickSound();
                      onToggleBossLabelsMode?.(mode);
                    }}
                    className={`px-2 py-1 text-[10px] font-mono rounded transition ${
                      (stats.bossLabelsMode || "FULL") === mode
                        ? "bg-amber-500 text-black font-bold border border-amber-500"
                        : "bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-800"
                    }`}
                  >
                    {t(`settings.options.${mode.toLowerCase()}` as any) || mode}
                  </button>
                ))}
              </div>
            </div>

            {/* HARD RESET */}
            <div className="pt-2 flex justify-between items-center">
              <button
                onClick={() => {
                  if (confirm(language === "es" ? "¿Restablecer estadísticas permanentes y récords?" : "Reset permanent high scores and statistics?")) {
                    onResetStats();
                  }
                }}
                className="px-3 py-1.5 bg-red-950 text-red-400 border border-red-900 hover:bg-red-900 rounded font-mono text-[10px] uppercase"
              >
                {t("startScreen.resetStats")}
              </button>
              <button onClick={() => clickTab("MAIN")} className="px-3 py-1.5 bg-slate-800 rounded font-mono hover:bg-slate-700 text-slate-200 text-xs">
                &larr; {t("general.back")}
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: ABOUT */}
        {activeTab === "ABOUT" && (
          <div className="space-y-4 text-xs leading-relaxed text-slate-300 animate-fadeIn">
            <h3 className="font-mono text-sm text-amber-400 border-b border-slate-800 pb-1 uppercase">{t("startScreen.aboutTitle")}</h3>
            <p>
              {t("startScreen.aboutDesc1")}
            </p>
            <p>
              {t("startScreen.aboutDesc2")}
            </p>
            <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800/80 font-mono text-[10px] text-slate-400 space-y-1">
              <div>{t("startScreen.aboutEngine")}</div>
              <div>{t("startScreen.aboutRenderer")}</div>
              <div>{t("startScreen.aboutAudio")}</div>
              <div>{t("startScreen.aboutDev")}</div>
            </div>
            <div className="pt-2">
              <button onClick={() => clickTab("MAIN")} className="px-3 py-1.5 bg-slate-800 rounded font-mono hover:bg-slate-700 text-slate-200">
                &larr; {t("general.back")}
              </button>
            </div>
          </div>
        )}

        {/* TAB 6: CODEX */}
        {activeTab === "CODEX" && (
          <div className="space-y-4 text-xs font-mono text-slate-300 animate-fadeIn overflow-y-auto max-h-[350px] pr-1">
            <h3 className="text-sm text-amber-400 border-b border-slate-800 pb-1 uppercase tracking-wider">
              {t("startScreen.codexTitle")}
            </h3>
            
            {/* Intel summary */}
            <div className="bg-slate-950/70 p-3 rounded border border-slate-800/80 space-y-2">
              <div className="flex justify-between text-[11px] border-b border-slate-900 pb-1 uppercase">
                <span className="text-slate-400">{t("settings.options.important")}:</span>
                <span className="text-rose-400 font-bold">BLACKOUT DEVOURER</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed italic">
                {t("startScreen.codexDesc")}
              </p>
            </div>

            {/* Combat Records */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-950/50 p-2 rounded text-center border border-slate-850">
                <div className="text-slate-500 text-[8px] uppercase font-bold text-slate-400">{t("startScreen.encounters")}</div>
                <div className="text-sm font-bold text-slate-300">{stats.bossAttempts || 0}</div>
              </div>
              <div className="bg-slate-950/50 p-2 rounded text-center border border-slate-850">
                <div className="text-slate-500 text-[8px] uppercase font-bold text-slate-400">{t("startScreen.victories")}</div>
                <div className="text-sm font-bold text-emerald-400">{stats.bossVictories || 0}</div>
              </div>
              <div className="bg-slate-950/50 p-2 rounded text-center border border-slate-850">
                <div className="text-slate-500 text-[8px] uppercase font-bold text-slate-400">{t("startScreen.bestTime")}</div>
                <div className="text-sm font-bold text-amber-400">
                  {stats.fastestBossVictory && stats.fastestBossVictory < 999999
                    ? `${(stats.fastestBossVictory / 1000).toFixed(1)}s`
                    : "N/A"}
                </div>
              </div>
            </div>

            {/* Phases Discovered */}
            <div className="space-y-2">
              <div className="text-[10px] text-slate-400 uppercase tracking-wide border-b border-slate-900 pb-0.5 font-bold">
                {t("startScreen.discoveredPhases")}
              </div>
              <div className="space-y-1.5">
                {[1, 2, 3].map((phaseNum) => {
                  const hasDiscovered = (stats.bossCodexSeenPhases || [1]).includes(phaseNum);
                  const phaseName = t(`startScreen.phaseNames.${phaseNum}` as any);
                  const phaseDesc = t(`startScreen.phaseDescs.${phaseNum}` as any);
                  return (
                    <div key={phaseNum} className="bg-slate-950/40 p-2 rounded border border-slate-900/60 flex flex-col gap-0.5">
                      <div className="flex justify-between text-[10px]">
                        <span className={hasDiscovered ? "text-cyan-400 font-bold" : "text-slate-600 font-semibold"}>
                          {hasDiscovered ? phaseName : `PHASE ${phaseNum}: [${language === "es" ? "DESCONOCIDO" : "UNKNOWN"}]`}
                        </span>
                        <span className={`text-[8px] px-1 rounded uppercase font-bold ${hasDiscovered ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-900 text-slate-600"}`}>
                          {hasDiscovered ? (language === "es" ? "Descubierto" : "Discovered") : (language === "es" ? "Bloqueado" : "Locked")}
                        </span>
                      </div>
                      {hasDiscovered && (
                        <p className="text-[9px] text-slate-400 italic font-mono leading-normal mt-0.5">
                          {phaseDesc}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Attacks Seen */}
            <div className="space-y-2 font-mono">
              <div className="text-[10px] text-slate-400 uppercase tracking-wide border-b border-slate-900 pb-0.5 font-bold">
                {t("startScreen.discoveredAttacks")}
              </div>
              <div className="space-y-1.5">
                {[
                  { id: "devourer_beam", key: "devourer_beam" },
                  { id: "gravity_well", key: "gravity_well" },
                  { id: "orbital_shards", key: "orbital_shards" },
                  { id: "blackout_sweep", key: "blackout_sweep" },
                  { id: "singularity_pulse", key: "singularity_pulse" },
                  { id: "rotating_eclipse_lanes", key: "rotating_eclipse_lanes" },
                  { id: "devourer_charge", key: "devourer_charge" }
                ].map((atk) => {
                  const hasDiscovered = (stats.bossCodexSeenAttacks || []).includes(atk.id);
                  const atkName = t(`threatIntel.entries.${atk.key}.name`);
                  const counterAdvice = t(`threatIntel.entries.${atk.key}.counter`);
                  return (
                    <div key={atk.id} className="bg-slate-950/40 p-2 rounded border border-slate-900/60 flex flex-col gap-0.5">
                      <div className="flex justify-between text-[10px]">
                        <span className={hasDiscovered ? "text-rose-400 font-bold" : "text-slate-600 font-semibold"}>
                          {hasDiscovered ? atkName : `[${language === "es" ? "ATAQUE DESCONOCIDO" : "UNKNOWN ATTACK"}]`}
                        </span>
                        <span className={`text-[8px] px-1 rounded uppercase font-bold ${hasDiscovered ? "bg-red-500/10 text-red-400" : "bg-slate-900 text-slate-600"}`}>
                          {hasDiscovered ? (language === "es" ? "Encontrado" : "Encountered") : (language === "es" ? "No descubierto" : "Undiscovered")}
                        </span>
                      </div>
                      {hasDiscovered && (
                        <p className="text-[9px] text-slate-400 leading-normal mt-0.5">
                          <strong className="text-cyan-400 font-bold uppercase">{t("startScreen.counterLabel")}</strong> {counterAdvice}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <button onClick={() => clickTab("MAIN")} className="px-3 py-1.5 bg-slate-800 rounded font-mono hover:bg-slate-700 text-slate-200 text-xs">
                &larr; {t("general.back")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default StartScreen;
