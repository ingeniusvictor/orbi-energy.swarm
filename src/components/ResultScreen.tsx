import React from "react";
import { RotateCcw, Home, Award, Users, Crosshair, Coins, Flame } from "lucide-react";
import { playClickSound } from "../game/audio";
import type { RunArchiveEntry } from "../game/types";
import { useGameTranslation, formatNumber } from "../i18n";
import RecentRunArchivePanel from "./RecentRunArchivePanel";

interface ResultScreenProps {
  victory: boolean;
  score: number;
  highScore: number;
  waveReached: number;
  maxSwarmSize: number;
  enemiesDestroyed: number;
  nanoCreditsGained: number;
  bestInfiniteSector?: number;
  bestInfiniteWave?: number;
  infiniteMinibossesDefeated?: number;
  infiniteBossRematchesDefeated?: number;
  recentRunArchive?: RunArchiveEntry[];
  onRestart: () => void;
  onExitToMenu: () => void;

  // Run Build summary fields
  activeRunUpgrades?: Record<string, number>;
  strongestAffinity?: string;
  formationMostUsed?: string;
  bestOrbiType?: string;
  bossResult?: string;
  wasRerollUsed?: boolean;

  // Boss encounter telemetry additions
  runDuration?: number;
  followersRemaining?: number;
  bossDamageDealt?: number;
  shieldNodesDestroyed?: number;
  damageTaken?: number;
  phaseReached?: number;
  firstVictoryUnlocked?: boolean;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  victory,
  score,
  highScore,
  waveReached,
  maxSwarmSize,
  enemiesDestroyed,
  nanoCreditsGained,
  bestInfiniteSector = 0,
  bestInfiniteWave = 0,
  infiniteMinibossesDefeated = 0,
  infiniteBossRematchesDefeated = 0,
  recentRunArchive = [],
  onRestart,
  onExitToMenu,
  activeRunUpgrades,
  strongestAffinity,
  formationMostUsed,
  bestOrbiType,
  bossResult,
  wasRerollUsed = false,
  runDuration = 0,
  followersRemaining = 0,
  bossDamageDealt = 0,
  shieldNodesDestroyed = 0,
  damageTaken = 0,
  phaseReached = 1,
  firstVictoryUnlocked = false
}) => {
  const { language, t } = useGameTranslation();

  // Helper to translate formation IDs
  const getFormationName = (id?: string) => {
    if (!id) return t("threatIntel.unknown");
    const found = t(`formations.${id.toUpperCase()}.name`);
    if (found && found !== `formations.${id.toUpperCase()}.name`) return found;
    return id;
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-4 bg-slate-950/95 text-white select-none backdrop-blur-md overflow-y-auto">
      {/* RESULT ANNOUNCEMENT CARD */}
      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-2xl relative space-y-4 text-center backdrop-blur-xl my-8">
        {/* GLOWING ICON HEADER */}
        <div className="space-y-1.5">
          {victory ? (
            <>
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.3)] text-emerald-400 animate-bounce">
                <Flame size={28} className="animate-pulse" />
              </div>
              <h2 className="text-xl md:text-2xl font-sans font-black tracking-tight text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.4)] uppercase">
                {language === "es" ? "CUADRÍCULA PURIFICADA" : "GRID PURIFIED"}
              </h2>
              <div className="text-[10px] font-mono text-emerald-500 font-bold uppercase tracking-wide">
                {t("results.victoryTitle")}
              </div>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(239,68,68,0.3)] text-rose-500">
                <RotateCcw size={28} />
              </div>
              <h2 className="text-xl md:text-2xl font-sans font-black tracking-tight text-rose-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.4)] uppercase">
                {language === "es" ? "NÚCLEO ENIGMA COLAPSADO" : "ENIGM-CORE CRASHED"}
              </h2>
              <div className="text-[10px] font-mono text-rose-400 tracking-wide uppercase">
                {t("results.defeatSubtitle")}
              </div>
            </>
          )}
        </div>

        {/* COSMETIC FIRST VICTORY REWARD BADGE */}
        {victory && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-center space-y-1 animate-fadeIn">
            <div className="text-emerald-400 font-bold font-sans text-xs flex justify-center items-center gap-1.5 uppercase">
              <Award size={14} className="text-amber-400 animate-pulse" />
              {t("results.cosmicBadgeTitle")} {firstVictoryUnlocked ? t("results.firstTimeVictory") : ""}
            </div>
            <p className="text-[10px] font-mono text-slate-300 leading-normal">
              {t("results.cosmicBadgeDesc")}
            </p>
          </div>
        )}

        {/* STATISTICS BOARD */}
        <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800/60 divide-y divide-slate-900">
          {/* Main Score Row */}
          <div className="pb-2 flex justify-between items-center font-mono">
            <span className="text-[11px] text-slate-400 flex items-center gap-1.5 uppercase">
              <Award size={12} className="text-amber-400" />
              {t("results.stats.score")}
            </span>
            <span className="text-base font-bold text-amber-400">{formatNumber(score)}</span>
          </div>

          {/* High Score Row */}
          <div className="py-1.5 flex justify-between items-center font-mono text-[10px]">
            <span className="text-slate-500 uppercase">{language === "es" ? "RÉCORD ANTERIOR" : "PREVIOUS RECORD"}</span>
            <span className="font-semibold text-slate-300">{formatNumber(highScore)}</span>
          </div>

          {/* Wave Reached */}
          <div className="py-1.5 flex justify-between items-center font-mono text-[10px]">
            <span className="text-slate-500 uppercase">{t("results.stats.waveReached")}</span>
            <span className="font-semibold text-pink-400 uppercase">{t("hud.wave")} {waveReached}</span>
          </div>

          {/* Swarm Size */}
          <div className="py-1.5 flex justify-between items-center font-mono text-[10px]">
            <span className="text-slate-400 flex items-center gap-1.5 uppercase">
              <Users size={11} className="text-cyan-400" />
              {t("results.stats.maxPopulation")}
            </span>
            <span className="font-semibold text-cyan-400 uppercase">{maxSwarmSize} ORBIS</span>
          </div>

          {/* Destroyed Enemies */}
          <div className="py-1.5 flex justify-between items-center font-mono text-[10px]">
            <span className="text-slate-400 flex items-center gap-1.5 uppercase">
              <Crosshair size={11} className="text-rose-400" />
              {language === "es" ? "AMENAZAS PURGADAS" : "THREATS PURGED"}
            </span>
            <span className="font-semibold text-rose-400">{formatNumber(enemiesDestroyed)}</span>
          </div>

          {/* Nano Credits gained */}
          <div className="pt-2 flex justify-between items-center font-mono text-[10px]">
            <span className="text-slate-400 flex items-center gap-1.5 uppercase">
              <Coins size={11} className="text-amber-500" />
              {language === "es" ? "CRÉDITOS OBTENIDOS" : "CREDIT EARNED"}
            </span>
            <span className="font-semibold text-amber-400">+${formatNumber(nanoCreditsGained)}</span>
          </div>
        </div>

        {/* RUN BUILD SUMMARY SECTION */}
        {activeRunUpgrades && Object.keys(activeRunUpgrades).length > 0 && (
          <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/60 text-left font-mono text-[10px] space-y-2">
            <div className="text-cyan-400 font-bold border-b border-slate-900 pb-1 flex justify-between uppercase">
              <span>🧬 {t("results.viewRunBuild")}</span>
              <span>{language === "es" ? "MEJORAS" : "STACKS"}</span>
            </div>
            <div className="grid grid-cols-1 gap-1 max-h-[85px] overflow-y-auto pr-1">
              {Object.entries(activeRunUpgrades).map(([id, stacks]) => {
                const upgradeName = t(`upgrades.items.${id}.name`);
                const emojis: Record<string, string> = {
                  solar_overcharge: "☀️",
                  hydro_regenesis: "💧",
                  wind_acceleration: "💨",
                  thermal_expansion: "🔥",
                  nuclear_density: "☢️",
                  quantum_fracture: "⚡",
                  foton_integrity: "🛡️",
                  swarm_cohesion: "🧲",
                  formation_synchronizer: "🔄",
                  core_magnetism: "🧲",
                  fusion_resonance: "🔮",
                  command_velocity: "🚀"
                };
                const emoji = emojis[id] || "⚙️";
                return (
                  <div key={id} className="flex justify-between text-slate-300">
                    <span>{emoji} {upgradeName}</span>
                    <span className="text-cyan-400 font-bold">{stacks}x</span>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-slate-900 pt-1.5 flex flex-col gap-0.5 text-slate-400 text-[9px] uppercase">
              <div className="flex justify-between">
                <span>{t("results.stats.strongestElement")}:</span>
                <span className="text-amber-400 font-bold uppercase">{strongestAffinity || "NONE"}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("results.stats.mostUsedFormation")}:</span>
                <span className="text-indigo-400 font-bold uppercase">
                  {getFormationName(formationMostUsed)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t("results.stats.bestEvolution")}:</span>
                <span className="text-purple-400 font-bold uppercase">{bestOrbiType || "STAGE 1"}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("results.stats.bossStatus")}:</span>
                <span className={`${victory ? "text-emerald-400" : "text-rose-400"} font-bold uppercase`}>
                  {bossResult
                    ? (language === "es"
                        ? (bossResult.toUpperCase().includes("DEFEATED") ? "DERROTADO" : "SOBREVIVIÓ")
                        : bossResult)
                    : (victory
                        ? (language === "es" ? "DERROTADO" : "DEFEATED")
                        : (language === "es" ? "SOBREVIVIÓ" : "SURVIVED"))}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-900/40 pt-0.5">
                <span>{t("results.stats.rerollUsed")}:</span>
                <span className={`${wasRerollUsed ? "text-amber-400" : "text-slate-500"} font-bold uppercase`}>
                  {wasRerollUsed ? (language === "es" ? "SÍ" : "YES") : (language === "es" ? "NO" : "NO")}
                </span>
              </div>
            </div>
          </div>
        )}

        <RecentRunArchivePanel
          entries={recentRunArchive}
          limit={3}
          compact
        />

        {/* BOSS SPECIFIC ENGAGEMENT STATS */}
        <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/60 text-left font-mono text-[10px] space-y-1.5">
          <div className="text-pink-400 font-bold border-b border-slate-900 pb-1 uppercase tracking-wide flex justify-between">
            <span>🛡️ {language === "es" ? "TELEMETRÍA DE COMBATE CONTRA JEFE" : "BOSS ENCOUNTER TELEMETRY"}</span>
            <span className="text-[9px] bg-pink-500/15 text-pink-400 px-1 rounded font-sans font-bold">DATA LOG</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-300 font-mono uppercase">
            <div className="flex justify-between">
              <span className="text-slate-500">{t("results.stats.timeElapsed")}:</span>
              <span className="font-bold text-slate-300">
                {runDuration ? `${(runDuration / 1000).toFixed(1)}s` : "0.0s"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{language === "es" ? "Fase Máxima" : "Max Phase"}:</span>
              <span className="font-bold text-amber-400">PHASE {phaseReached || 1}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t("results.stats.damageDealt")}:</span>
              <span className="font-bold text-rose-400">{bossDamageDealt !== undefined ? formatNumber(Math.floor(bossDamageDealt)) : 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t("results.stats.shieldNodesDestroyed")}:</span>
              <span className="font-bold text-cyan-400">{shieldNodesDestroyed || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t("results.stats.damageReceived")}:</span>
              <span className="font-bold text-red-400">{damageTaken !== undefined ? formatNumber(Math.floor(damageTaken)) : 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{language === "es" ? "Seguidores Restantes" : "Remaining Swarm"}:</span>
              <span className="font-bold text-indigo-400">{followersRemaining || 0}</span>
            </div>
          </div>
        </div>

        {/* PERSISTENCE SUMMARY */}
        <div className="bg-slate-950/55 rounded-xl p-3 border border-cyan-900/30 text-left font-mono text-[10px] space-y-2">
          <div className="text-cyan-400 font-bold uppercase tracking-wide">
            {language === "es" ? "ARCHIVO DE PROGRESO" : "PROGRESSION ARCHIVE"}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="rounded-lg border border-emerald-900/40 bg-emerald-950/15 p-2">
              <div className="text-emerald-400 font-bold uppercase mb-1">
                {language === "es" ? "SE CONSERVA" : "PERSISTENT"}
              </div>
              <p className="text-slate-400 leading-relaxed">
                {language === "es"
                  ? "Nano Credits, récords y datos descubiertos del jefe quedan guardados para futuras partidas."
                  : "Nano Credits, records and discovered boss data are saved for future runs."}
              </p>
            </div>
            <div className="rounded-lg border border-amber-900/40 bg-amber-950/10 p-2">
              <div className="text-amber-400 font-bold uppercase mb-1">
                {language === "es" ? "SE REINICIA" : "RUN-ONLY"}
              </div>
              <p className="text-slate-400 leading-relaxed">
                {language === "es"
                  ? "Las mejoras tácticas de intermisión y la build temporal se reinician al comenzar una nueva partida."
                  : "Intermission tactical upgrades and the temporary build reset when a new run begins."}
              </p>
            </div>
          </div>
        </div>

        {/* INFINITE SWARM RECORD SUMMARY */}
        {bestInfiniteSector >= 11 && (
          <div className="bg-cyan-950/10 rounded-xl p-3 border border-cyan-500/20 text-left font-mono text-[10px] space-y-2">
            <div className="flex items-center justify-between border-b border-cyan-950/60 pb-1.5">
              <span className="text-cyan-300 font-black uppercase tracking-[0.14em]">
                ∞ {language === "es" ? "ARCHIVO INFINITE SWARM" : "INFINITE SWARM ARCHIVE"}
              </span>
              <span className="text-[8px] rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-emerald-300 uppercase">
                {language === "es" ? "PERSISTENTE" : "PERSISTENT"}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="rounded-lg border border-slate-800/70 bg-slate-950/55 p-2">
                <div className="text-[8px] text-slate-500 uppercase">{language === "es" ? "MEJOR SECTOR" : "BEST SECTOR"}</div>
                <div className="text-base font-black text-cyan-300">{bestInfiniteSector}</div>
              </div>
              <div className="rounded-lg border border-slate-800/70 bg-slate-950/55 p-2">
                <div className="text-[8px] text-slate-500 uppercase">{language === "es" ? "OLEADA" : "WAVE"}</div>
                <div className="text-base font-black text-indigo-300">{bestInfiniteWave}</div>
              </div>
              <div className="rounded-lg border border-slate-800/70 bg-slate-950/55 p-2">
                <div className="text-[8px] text-slate-500 uppercase">WARDENS</div>
                <div className="text-base font-black text-amber-300">{infiniteMinibossesDefeated}</div>
              </div>
              <div className="rounded-lg border border-slate-800/70 bg-slate-950/55 p-2">
                <div className="text-[8px] text-slate-500 uppercase">REMATCHES</div>
                <div className="text-base font-black text-pink-300">{infiniteBossRematchesDefeated}</div>
              </div>
            </div>
          </div>
        )}

        {/* NOTIFY MEMENTO MESSAGE */}
        <div className="text-[10px] font-mono text-slate-500 leading-relaxed max-w-xs mx-auto">
          {victory
            ? (language === "es"
                ? "Tu sincronización fue perfecta. El núcleo oscuro ha sido purgado y las líneas de la cuadrícula volvieron a su frecuencia base."
                : "Your synchronization was perfect. The cosmic dark core has been repelled and the grid lines returned to baseline resonance.")
            : (language === "es"
                ? "El enjambre parásito penetró demasiado profundo. Las estadísticas y puntuaciones han sido guardadas en el archivo local."
                : "The parasite swarm penetrated too deep. Permanent stats and scores have been committed to local system archives.")}
        </div>

        {/* BUTTON PATHWAYS */}
        <div className="space-y-2 pt-1">
          {/* PLAY AGAIN */}
          <button
            onClick={() => {
              playClickSound();
              onRestart();
            }}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 font-semibold text-xs flex justify-center items-center gap-2 cursor-pointer transition shadow-[0_0_15px_rgba(245,158,11,0.2)] active:scale-[0.98] uppercase"
          >
            <RotateCcw size={14} />
            {t("results.playAgain")}
          </button>

          {/* MAIN MENU */}
          <button
            onClick={() => {
              playClickSound();
              onExitToMenu();
            }}
            className="w-full py-2 rounded bg-slate-800 hover:bg-slate-700 font-medium text-[11px] flex justify-center items-center gap-2 cursor-pointer transition text-slate-300 uppercase"
          >
            <Home size={12} />
            {t("results.returnToMenu")}
          </button>
        </div>
      </div>
    </div>
  );
};
export default ResultScreen;
