import React, { useState } from "react";
import { Play, Cpu, Volume2, VolumeX, Globe } from "lucide-react";
import { GameStats, QualityPreset } from "../game/types";
import { playClickSound } from "../game/audio";
import { useGameTranslation, formatNumber } from "../i18n";
import PremiumBackdrop from "./presentation/PremiumBackdrop";

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

  const clickTab = (tab: "MAIN" | "HOW_TO" | "CONTROLS" | "SETTINGS" | "ABOUT" | "CODEX") => {
    playClickSound();
    setActiveTab(tab);
  };

  return (
    <div className="orbi-premium-entry absolute inset-0 z-50 flex flex-col items-center justify-center p-4 text-white select-none overflow-y-auto">
      <PremiumBackdrop />
      {/* GLOWING HEADER */}
      <div className="relative z-10 text-center mb-5">
        <div className="flex justify-center items-center gap-2 mb-1">
          <span className="orbi-premium-eyebrow px-2.5 py-1 text-[10px] md:text-xs font-mono rounded-full bg-cyan-400/8 text-cyan-200 border border-cyan-300/20 tracking-[0.12em]">
            WEB DEMO v0.2.6b-bilingual-localization
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
      <div className="relative z-10 flex items-center gap-2 mb-4 bg-slate-950/55 px-3 py-1.5 rounded-full border border-cyan-200/10 backdrop-blur-xl shadow-[0_10px_36px_rgba(0,0,0,0.28)]">
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
      <div className="orbi-premium-panel relative z-10 w-full max-w-xl rounded-2xl p-5 md:p-6 backdrop-blur-2xl">
        {/* NAV BAR */}
        <div className="flex flex-wrap gap-1.5 md:gap-2 mb-5 border-b border-slate-800 pb-3 justify-center">
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
          <div className="space-y-5 animate-fadeIn">
            {/* PROGRESS OVERVIEW */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800/80">
                <div className="text-slate-400 text-[10px] font-mono">{t("startScreen.highScore")}</div>
                <div className="text-lg md:text-xl font-bold font-mono text-cyan-400">{formatNumber(stats.highScore)}</div>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800/80">
                <div className="text-slate-400 text-[10px] font-mono">{t("startScreen.bestWave")}</div>
                <div className="text-lg md:text-xl font-bold font-mono text-pink-400">{t("hud.wave")} {stats.bestWave}</div>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800/80">
                <div className="text-slate-400 text-[10px] font-mono">{t("startScreen.maxPopulation")}</div>
                <div className="text-lg md:text-xl font-bold font-mono text-amber-400">{stats.bestSwarmSize} ORBIS</div>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800/80">
                <div className="text-slate-400 text-[10px] font-mono">{t("startScreen.totalMissions")}</div>
                <div className="text-lg md:text-xl font-bold font-mono text-slate-300">{stats.totalRuns}</div>
              </div>
            </div>

            {/* PREPARATION MEMENTO */}
            <div className="bg-slate-950/30 p-3 rounded border border-slate-800/40 text-center text-xs text-slate-400 leading-relaxed">
              {t("startScreen.sloganDesc")}
            </div>

            {/* START BUTTON */}
            <button
              onClick={() => {
                playClickSound();
                onStartGame();
              }}
              className="orbi-premium-cta w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 hover:from-amber-400 hover:via-yellow-300 hover:to-amber-300 text-slate-950 font-black tracking-[0.12em] text-sm flex justify-center items-center gap-2 cursor-pointer transition duration-300 active:scale-[0.98]"
            >
              <Play size={16} fill="white" />
              {t("startScreen.activateSync")}
            </button>
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
              <div className="grid grid-cols-3 gap-2">
                {(["LOW", "MEDIUM", "HIGH"] as QualityPreset[]).map((preset) => (
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
