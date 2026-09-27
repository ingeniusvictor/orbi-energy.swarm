import React from "react";
import { Shield, Award, Users, Volume2, VolumeX, Pause, Play } from "lucide-react";
import { useGameTranslation, formatNumber } from "../i18n";
import { getCampaignObjective } from "../game/campaignGuide";

interface GameHudProps {
  score: number;
  shield: number;
  shieldMax: number;
  swarmSize: number;
  currentWave: number;
  waveName: string;
  isWaveBreak: boolean;
  waveBreakTimeLeft: number; // in seconds
  audioMuted: boolean;
  isPaused: boolean;
  nanoCredits: number;
  onTogglePause: () => void;
  onToggleMute: () => void;
}

export const GameHud: React.FC<GameHudProps> = ({
  score,
  shield,
  shieldMax,
  swarmSize,
  currentWave,
  waveName,
  isWaveBreak,
  waveBreakTimeLeft,
  audioMuted,
  isPaused,
  nanoCredits,
  onTogglePause,
  onToggleMute
}) => {
  const { language, t } = useGameTranslation();
  const campaignObjective = getCampaignObjective(currentWave, language);

  // Shield Color Selector
  const shieldPercent = (shield / shieldMax) * 100;
  let shieldColorClass = "bg-emerald-500 shadow-[0_0_8px_#10b981]";
  let shieldTextColor = "text-emerald-400";
  if (shieldPercent < 30) {
    shieldColorClass = "bg-rose-600 shadow-[0_0_12px_#ef4444] animate-pulse";
    shieldTextColor = "text-rose-400 font-bold";
  } else if (shieldPercent < 60) {
    shieldColorClass = "bg-amber-500 shadow-[0_0_8px_#f59e0b]";
    shieldTextColor = "text-amber-400";
  }

  // Population Milestones helper
  const getMilestoneClass = (size: number) => {
    if (size >= 100) return "text-fuchsia-400 border-fuchsia-500/50 bg-fuchsia-950/30";
    if (size >= 75) return "text-pink-400 border-pink-500/50 bg-pink-950/30";
    if (size >= 50) return "text-violet-400 border-violet-500/50 bg-violet-950/30";
    if (size >= 25) return "text-cyan-400 border-cyan-500/50 bg-cyan-950/30";
    if (size >= 10) return "text-amber-400 border-amber-500/50 bg-amber-950/30";
    return "text-slate-400 border-slate-800 bg-slate-900/40";
  };

  // Localized wave details lookup helper
  const getLocalizedWaveDetails = () => {
    const waveKey = String(currentWave);
    const localizedName = t(`waves.${waveKey}.name`);
    if (localizedName && localizedName !== `waves.${waveKey}.name`) {
      return localizedName;
    }
    return waveName; // fallback
  };

  return (
    <div className="orbi-game-hud w-full bg-slate-950/85 border border-slate-900 rounded-lg py-1 px-3.5 shadow-md backdrop-blur-md select-none text-white font-mono text-[11px] shrink-0">
      {/* 1. HEALTH SHIELD BAR */}
      <div className="orbi-hud-shield flex items-center gap-2 max-w-[220px]">
        <span className="flex items-center gap-1 text-slate-400 font-bold shrink-0 uppercase">
          <Shield size={11} className="text-cyan-400" />
          {t("hud.shield")}
        </span>
        <div
          className="w-20 bg-slate-900 rounded h-1.5 overflow-hidden border border-slate-850 shrink-0"
          role="progressbar"
          aria-label={language === "es" ? "Integridad del escudo" : "Shield integrity"}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(Math.max(0, Math.min(100, shieldPercent)))}
          aria-valuetext={`${Math.round(Math.max(0, Math.min(100, shieldPercent)))}%`}
        >
          <div
            className={`h-full rounded transition-all duration-150 ${shieldColorClass}`}
            style={{ width: `${Math.max(0, Math.min(100, shieldPercent))}%` }}
          />
        </div>
        <span className={`${shieldTextColor} shrink-0 text-[10px] font-bold`}>{Math.round(shield)}%</span>
      </div>

      {/* 2. WAVE LEVEL / BREAK */}
      <div className="orbi-hud-wave flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 px-2 py-0.5 rounded text-xs font-bold font-mono">
        {isWaveBreak ? (
          <span className="text-cyan-400 animate-pulse uppercase">
            {t("hud.preparation").substring(0, 4)}: {waveBreakTimeLeft}s
          </span>
        ) : (
          <span className="text-amber-500 uppercase">
            W{currentWave} : <span className="text-slate-300 font-medium">{getLocalizedWaveDetails()}</span>
          </span>
        )}
      </div>

      {campaignObjective && (
        <div className="orbi-hud-objective flex items-center gap-2 min-w-0">
          <span className="text-[8px] uppercase tracking-[0.15em] text-cyan-400/80 font-bold shrink-0">
            {language === "es" ? "OBJETIVO" : "OBJECTIVE"}
          </span>
          <span className="text-[9px] text-slate-400 truncate">
            {campaignObjective}
          </span>
        </div>
      )}

      {/* 3. SWARM POPULATION */}
      <div className="orbi-hud-swarm flex items-center gap-2">
        <Users size={11} className="text-emerald-400" />
        <span className="text-slate-400 font-bold uppercase">{t("hud.swarm")}:</span>
        <span className={`px-1.5 py-0.1 rounded text-[10px] font-bold ${getMilestoneClass(swarmSize)}`}>
          {swarmSize}
        </span>
      </div>

      {/* 4. SCORE & CREDITS */}
      <div className="orbi-hud-score flex items-center gap-4 font-mono">
        <div className="flex items-center gap-1.5">
          <Award size={11} className="text-amber-400" />
          <span className="text-slate-400 uppercase">{t("hud.score")}:</span>
          <span className="text-white font-bold">{formatNumber(score)}</span>
        </div>
        <div className="flex items-center gap-1.5 font-bold text-amber-400">
          <span>$</span>
          <span>{formatNumber(nanoCredits)}</span>
        </div>
      </div>

      {/* 5. QUICK CONTROLLER BUTTONS */}
      <div className="orbi-hud-actions flex items-center gap-1">
        <button
          onClick={onTogglePause}
          className={`p-1.5 rounded cursor-pointer transition ${
            isPaused
              ? "bg-cyan-500 text-black font-bold"
              : "bg-slate-900 border border-slate-850 hover:bg-slate-800 text-slate-300"
          }`}
          title={isPaused ? (language === "es" ? "Reanudar" : "Resume") : (language === "es" ? "Pausar" : "Pause")}
          aria-label={isPaused ? (language === "es" ? "Reanudar simulación" : "Resume simulation") : (language === "es" ? "Pausar simulación" : "Pause simulation")}
          aria-pressed={isPaused}
        >
          {isPaused ? <Play size={10} fill="currentColor" /> : <Pause size={10} />}
        </button>

        <button
          onClick={onToggleMute}
          className={`p-1.5 rounded cursor-pointer transition ${
            audioMuted
              ? "bg-rose-950/60 border border-rose-900 text-rose-400"
              : "bg-slate-900 border border-slate-850 hover:bg-slate-800 text-slate-300"
          }`}
          title={audioMuted ? (language === "es" ? "Activar Audio" : "Unmute Audio") : (language === "es" ? "Silenciar Audio" : "Mute Audio")}
          aria-label={audioMuted ? (language === "es" ? "Activar audio" : "Unmute audio") : (language === "es" ? "Silenciar audio" : "Mute audio")}
          aria-pressed={audioMuted}
        >
          {audioMuted ? <VolumeX size={10} /> : <Volume2 size={10} />}
        </button>
      </div>
    </div>
  );
};
export default GameHud;
