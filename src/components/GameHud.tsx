import React from "react";
import { EnergyStatus3D } from "./presentation/EnergyStatus3D";
import { Shield, Award, Users, Volume2, VolumeX, Pause, Play, Zap, Music2, Maximize2, Minimize2, Target, Package, X, Coins, Radar, Activity, ChevronsRight } from "lucide-react";
import { useGameTranslation, formatNumber } from "../i18n";
import { getCampaignObjective } from "../game/campaignGuide";
import type { ResonanceTier } from "../game/combatResonance";
import type { ScoreAttackLiveEngineStartMode } from "../game/scoreAttackLiveEngineLifecycle";
import { SCORE_ATTACK_DURATION_MS } from "../game/scoreAttackTimeboxProjection";
import { projectShieldThreat } from "../game/shieldThreatPresentation";

interface GameHudProps {
  presentationMode: ScoreAttackLiveEngineStartMode;
  score: number;
  shield: number;
  shieldMax: number;
  swarmSize: number;
  currentWave: number;
  waveName: string;
  isWaveBreak: boolean;
  waveBreakTimeLeft: number; // in seconds
  audioMuted: boolean;
  musicEnabled: boolean;
  onToggleMusic: () => void;
  isPaused: boolean;
  nanoCredits: number;
  combatChain: number;
  combatResonance: number;
  combatResonanceTier: ResonanceTier;
  combatScoreMultiplier: number;
  combatOverdriveActive: boolean;
  combatOverdriveCanActivate: boolean;
  combatOverdriveActionEnabled: boolean;
  combatOverdriveRemainingMs: number;
  combatOverdriveReentryLocked: boolean;
  combatOverdriveReentryRemainingMs: number;
  onActivateOverdrive: () => void;
  dashActive: boolean;
  dashCanActivate: boolean;
  dashCooldownRemainingMs: number;
  onActivateDash: () => void;
  onTogglePause: () => void;
  onToggleMute: () => void;
  immersive?: boolean;
  webImmersive?: boolean;
  webFullscreen?: boolean;
  webFullscreenAvailable?: boolean;
  onToggleWebFullscreen?: () => void;
  mobilePanel?: "closed" | "estado" | "tactica" | "equipo";
  onMobilePanelChange?: (panel: "closed" | "estado" | "tactica" | "equipo") => void;
}

export const GameHud: React.FC<GameHudProps> = ({
  presentationMode,
  score,
  shield,
  shieldMax,
  swarmSize,
  currentWave,
  waveName,
  isWaveBreak,
  waveBreakTimeLeft,
  audioMuted,
  musicEnabled,
  onToggleMusic,
  isPaused,
  nanoCredits,
  combatChain,
  combatResonance,
  combatResonanceTier,
  combatScoreMultiplier,
  combatOverdriveActive,
  combatOverdriveCanActivate,
  combatOverdriveActionEnabled,
  combatOverdriveRemainingMs,
  combatOverdriveReentryLocked,
  combatOverdriveReentryRemainingMs,
  onActivateOverdrive,
  dashActive,
  dashCanActivate,
  dashCooldownRemainingMs,
  onActivateDash,
  onTogglePause,
  onToggleMute,
  immersive = false,
  webImmersive = false,
  webFullscreen = false,
  webFullscreenAvailable = false,
  onToggleWebFullscreen,
  mobilePanel = "closed",
  onMobilePanelChange
}) => {
  const { language, t } = useGameTranslation();
  const scoreAttackActive = presentationMode === "SCORE_ATTACK";
  const scoreAttackDurationSeconds = SCORE_ATTACK_DURATION_MS / 1000;
  const campaignObjective = scoreAttackActive
    ? null
    : getCampaignObjective(currentWave, language);
  const activeObjective = scoreAttackActive
    ? (language === "es" ? "MAXIMIZA LA PUNTUACIÓN" : "MAXIMIZE SCORE")
    : campaignObjective;

  // One four-stage palette shared by compact HUD, immersive HUD and Status.
  const shieldThreat = projectShieldThreat(shield, shieldMax);
  const shieldPercent = shieldThreat.percent;
  const shieldFillStyle = {
    width: `${shieldPercent}%`,
    backgroundColor: shieldThreat.fill,
    boxShadow: `0 0 10px ${shieldThreat.glow}`,
  };

  // Population Milestones helper
  const getMilestoneClass = (size: number) => {
    if (size >= 100) return "text-fuchsia-400 border-fuchsia-500/50 bg-fuchsia-950/30";
    if (size >= 75) return "text-pink-400 border-pink-500/50 bg-pink-950/30";
    if (size >= 50) return "text-violet-400 border-violet-500/50 bg-violet-950/30";
    if (size >= 25) return "text-cyan-400 border-cyan-500/50 bg-cyan-950/30";
    if (size >= 10) return "text-amber-400 border-amber-500/50 bg-amber-950/30";
    return "text-slate-400 border-slate-800 bg-slate-900/40";
  };

  const getResonanceTone = () => {
    switch (combatResonanceTier) {
      case "OVERDRIVE_READY":
        return "border-amber-400/70 text-amber-300 bg-amber-950/40";
      case "SURGING":
        return "border-fuchsia-400/60 text-fuchsia-300 bg-fuchsia-950/35";
      case "HARMONIC":
        return "border-violet-400/55 text-violet-300 bg-violet-950/30";
      case "SYNCED":
        return "border-cyan-400/50 text-cyan-300 bg-cyan-950/30";
      default:
        return "border-slate-700 text-slate-400 bg-slate-900/40";
    }
  };

  const getResonanceFill = () => {
    switch (combatResonanceTier) {
      case "OVERDRIVE_READY":
        return "bg-amber-300 shadow-[0_0_8px_rgba(252,211,77,0.75)]";
      case "SURGING":
        return "bg-fuchsia-400 shadow-[0_0_7px_rgba(232,121,249,0.6)]";
      case "HARMONIC":
        return "bg-violet-400 shadow-[0_0_7px_rgba(167,139,250,0.55)]";
      default:
        return "bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.5)]";
    }
  };

  const resonanceTierLabel = combatResonanceTier.replaceAll("_", " ");
  const resonanceAriaLabel = language === "es"
    ? `Cadena ${combatChain}, resonancia ${Math.round(combatResonance)} por ciento, ${resonanceTierLabel}, multiplicador ${combatScoreMultiplier.toFixed(2)}`
    : `Chain ${combatChain}, resonance ${Math.round(combatResonance)} percent, ${resonanceTierLabel}, multiplier ${combatScoreMultiplier.toFixed(2)}`;

  const overdriveSeconds = Math.max(
    0,
    Math.ceil(
      (combatOverdriveActive
        ? combatOverdriveRemainingMs
        : combatOverdriveReentryRemainingMs) / 1000,
    ),
  );
  const overdriveStatus = combatOverdriveActive
    ? `ACTIVE ${overdriveSeconds}s`
    : combatOverdriveReentryLocked
      ? `RECHARGING ${overdriveSeconds}s`
      : combatOverdriveCanActivate
        ? "READY"
        : "CHARGE";
  // The lightning action is the existing Overdrive, NOT a dash or shield.
  // It consumes combat resonance; +20% player damage for 8s, then 4s reentry.
  const overdriveAriaLabel = language === "es"
    ? `ORBI Overdrive: ${overdriveStatus}. Aumenta el daño un 20% durante 8 segundos. Consume resonancia; espera 4 segundos para reactivar. Tecla O.`
    : `ORBI Overdrive: ${overdriveStatus}. Boosts damage by 20% for 8 seconds. Consumes resonance; 4-second reentry lock. O key.`;

  const dashSeconds = Math.max(0, Math.ceil(dashCooldownRemainingMs / 1000));
  const dashStatus = dashActive
    ? (language === "es" ? "IMPULSO" : "BOOST")
    : !dashCanActivate
      ? (language === "es" ? `RECARGA ${dashSeconds}s` : `RECHARGE ${dashSeconds}s`)
      : (language === "es" ? "LISTO" : "READY");
  const dashAriaLabel = language === "es"
    ? `Dash de propulsión: ${dashStatus}. Desplazamiento rápido sin invulnerabilidad. Tecla E, usa la dirección actual o la última.`
    : `Propulsion dash: ${dashStatus}. Fast movement without invulnerability. E key, current or last direction.`;

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
    <div className="orbi-game-hud w-full bg-slate-950/85 border border-slate-900 rounded-lg py-1 px-3.5 shadow-md backdrop-blur-md select-none text-white font-mono text-[11px] shrink-0" data-mobile-status-open={mobilePanel !== "closed"}>
      {immersive && (
        <div className="orbi-immersive-essential" data-testid="orbi-immersive-essential">
          <div className="orbi-immersive-vitals" aria-label={language === "es" ? "Estado básico de combate" : "Combat essentials"}>
            <Shield size={13} aria-hidden="true" />
            <div className="orbi-immersive-shield-bar" role="progressbar"
              aria-label={language === "es" ? "Escudo" : "Shield"}
              aria-valuemin={0} aria-valuemax={100}
              aria-valuenow={Math.round(Math.max(0, Math.min(100, shieldPercent)))}>
              <span data-shield-band={shieldThreat.band} style={shieldFillStyle} />
            </div>
            <span style={{ color: shieldThreat.text }}>{Math.round(shieldPercent)}%</span>
            <strong>{isWaveBreak ? `PREP ${waveBreakTimeLeft}s` : `W${currentWave}`}</strong>
          </div>
          <div className="orbi-immersive-actions">
            <button type="button" className="orbi-immersive-action orbi-overdrive-action"
              data-testid="orbi-overdrive-action"
              onClick={onActivateOverdrive} disabled={!combatOverdriveActionEnabled}
              aria-label={overdriveAriaLabel} title={overdriveAriaLabel}>
              <Zap size={16} aria-hidden="true" />
              <span className="orbi-overdrive-label" aria-hidden="true">OD</span>
            </button>
            <button type="button" className="orbi-immersive-action orbi-dash-action"
              data-testid="orbi-dash-action"
              onClick={onActivateDash} disabled={!dashCanActivate}
              aria-label={dashAriaLabel} title={dashAriaLabel}>
              <ChevronsRight size={18} aria-hidden="true" />
              <span aria-hidden="true">DASH</span>
            </button>
            <button type="button" className="orbi-immersive-action orbi-immersive-music"
              data-testid="orbi-immersive-music-toggle"
              onClick={onToggleMusic} aria-pressed={musicEnabled}
              aria-label={language === "es" ? (musicEnabled ? "Apagar música" : "Activar música") : (musicEnabled ? "Turn music off" : "Turn music on")}>
              {musicEnabled ? <Music2 size={17} aria-hidden="true"/> : <VolumeX size={17} aria-hidden="true"/>}
            </button>
            <button type="button" className="orbi-immersive-action"
              aria-label={isPaused ? "Reanudar" : "Pausar"}
              aria-pressed={isPaused} onClick={onTogglePause}>
              {isPaused ? <Play size={16} /> : <Pause size={16} />}
            </button>
            {webImmersive && onToggleWebFullscreen && (
              <button type="button" className="orbi-immersive-action"
                data-testid="orbi-web-fullscreen"
                aria-label={webFullscreen
                  ? (language === "es" ? "Salir de pantalla completa" : "Exit fullscreen")
                  : (language === "es" ? "Pantalla completa" : "Fullscreen")}
                title={webFullscreen ? "Salir de pantalla completa (Esc)" : "Pantalla completa"}
                aria-pressed={webFullscreen}
                disabled={!webFullscreenAvailable}
                onClick={onToggleWebFullscreen}>
                {webFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
            )}
            <button type="button" data-testid="orbi-estado-button"
              className="orbi-immersive-action orbi-immersive-estado"
              aria-expanded={mobilePanel !== "closed"}
              aria-controls="orbi-mobile-status-panel"
              onClick={() => onMobilePanelChange?.(mobilePanel === "closed" ? "estado" : "closed")}>
              {language === "es" ? "Estado" : "Status"}
            </button>
          </div>
        </div>
      )}
      {immersive && mobilePanel !== "closed" && (
        <>
          <button type="button" className="orbi-immersive-backdrop"
            aria-label={language === "es" ? "Cerrar Estado" : "Close status"}
            onClick={() => onMobilePanelChange?.("closed")} />
          <aside className="orbi-premium-pause-emblem" aria-hidden="true">
            <span className="orbi-premium-pause-disc"><Pause size={45} fill="currentColor" /></span>
            <strong>{language === "es" ? "PAUSADO" : "PAUSED"}</strong>
            <small>ORBI ENERGY SWARM</small>
          </aside>
          <div className="orbi-immersive-panel-heading" id="orbi-mobile-status-panel"
            role="dialog" aria-label={language === "es" ? "Panel de Estado" : "Status panel"}
            aria-describedby="orbi-mobile-pause-caption">
            <p id="orbi-mobile-pause-caption" className="orbi-premium-panel-paused">
              <Pause size={12} aria-hidden="true" /> {language === "es" ? "SIMULACIÓN PAUSADA" : "SIMULATION PAUSED"}
            </p>
            <div className="orbi-immersive-panel-tabs" role="group" aria-label="Paneles">
              {(["estado", "tactica", "equipo"] as const).map(panel => (
                <button key={panel} type="button" aria-pressed={mobilePanel === panel}
                  onClick={() => onMobilePanelChange?.(panel)}>
                  {panel === "estado" ? <Shield size={15} aria-hidden="true" />
                    : panel === "tactica" ? <Target size={15} aria-hidden="true" />
                    : <Package size={15} aria-hidden="true" />}
                  {panel === "estado" ? (language === "es" ? "Estado" : "Status")
                    : panel === "tactica" ? (language === "es" ? "Táctica" : "Tactics")
                    : (language === "es" ? "Equipo" : "Team")}
                </button>
              ))}
              <button type="button" aria-label={language === "es" ? "Cerrar panel" : "Close panel"}
                onClick={() => onMobilePanelChange?.("closed")}><X size={18} aria-hidden="true"/></button>
            </div>
          </div>
        </>
      )}
      <div className="orbi-hud-detail-grid" data-mobile-panel={mobilePanel}>
      {immersive && mobilePanel === "estado" && (
        <section className="orbi-premium-status" aria-label={language === "es" ? "Informe táctico de la partida" : "Live run tactical report"}>
          <div className="orbi-premium-status-kicker">
            <Activity size={15} aria-hidden="true"/>
            <span>{language === "es" ? "TELEMETRÍA DEL NÚCLEO" : "CORE TELEMETRY"}</span>
            <b>{language === "es" ? "EN TIEMPO REAL · CONGELADA" : "LIVE SNAPSHOT · FROZEN"}</b>
          </div>
          <div className="orbi-premium-status-top">
            <div className="orbi-premium-status-core">
              <EnergyStatus3D language={language}/>
              <div className="orbi-premium-status-core-label"><strong>ENERGY</strong><span>{language === "es" ? "NÚCLEO NEUTRAL" : "NEUTRAL CORE"}</span></div>
            </div>
            <div className="orbi-premium-status-shield">
              <h3><Shield size={15} aria-hidden="true"/>{t("hud.shield")}</h3>
              <strong data-shield-band={shieldThreat.band} style={{ color: shieldThreat.text }}>{Math.round(shieldPercent)}%</strong>
              <div className="orbi-premium-status-meter" role="progressbar" aria-label={t("hud.shield")}
                aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(Math.max(0,Math.min(100,shieldPercent)))}>
                <span data-shield-band={shieldThreat.band} style={shieldFillStyle}/>
              </div>
              <p>{language === "es" ? "Integridad de escudo durante esta partida" : "Shield integrity in this run"}</p>
            </div>
            <div className="orbi-premium-status-wave">
              <h3><Radar size={15} aria-hidden="true"/>{language === "es" ? "SECTOR ACTUAL" : "CURRENT SECTOR"}</h3>
              <strong>{scoreAttackActive ? "SCORE ATTACK" : `W${currentWave}`}</strong>
              <p>{getLocalizedWaveDetails()}</p>
              <div className="orbi-premium-status-objective"><b>{language === "es" ? "OBJETIVO" : "OBJECTIVE"}</b><span>{activeObjective || (language === "es" ? "Supera la oleada" : "Clear the wave")}</span></div>
            </div>
          </div>
          <div className="orbi-premium-status-counters">
            <article><Users size={22} aria-hidden="true"/><div><span>{t("hud.swarm")}</span><strong>{swarmSize}</strong><small>{language === "es" ? "ORBI ACTIVOS" : "ACTIVE ORBIS"}</small></div></article>
            <article><Award size={22} aria-hidden="true"/><div><span>{t("hud.score")}</span><strong>{formatNumber(score)}</strong></div></article>
            <article><Coins size={22} aria-hidden="true"/><div><span>{language === "es" ? "CRÉDITOS" : "CREDITS"}</span><strong>$ {formatNumber(nanoCredits)}</strong></div></article>
          </div>
          <div className="orbi-premium-status-footer">
            <h3>{language === "es" ? "INDICADORES TÁCTICOS" : "TACTICAL INDICATORS"}</h3>
            <div className="orbi-premium-status-indicators">
              <div><Activity size={16} aria-hidden="true"/><span>{language === "es" ? "RESONANCIA" : "RESONANCE"}</span><strong>{Math.round(combatResonance)}%</strong></div>
              <div><Zap size={16} aria-hidden="true"/><span>OVERDRIVE</span><strong>{overdriveStatus}</strong></div>
              <div><ChevronsRight size={16} aria-hidden="true"/><span>DASH · E</span><strong>{dashStatus}</strong></div>
              <div><Target size={16} aria-hidden="true"/><span>{language === "es" ? "CADENA" : "CHAIN"}</span><strong>{combatChain} · ×{combatScoreMultiplier.toFixed(2)}</strong></div>
              <div>{audioMuted ? <VolumeX size={16} aria-hidden="true"/> : <Volume2 size={16} aria-hidden="true"/>}
                <span>{language === "es" ? "AUDIO" : "SOUND"}</span><strong>{audioMuted ? t("hud.muted") : t("hud.unmuted")}</strong></div>
            </div>
          </div>
          <div className="orbi-ux11d-ability-deck" aria-label={language === "es" ? "Habilidades y supervivencia" : "Abilities and survival"}>
            <article>
              <div><Zap size={17} aria-hidden="true"/><strong>ORBI OVERDRIVE</strong></div>
              <p>{language === "es"
                ? "Impulso ofensivo: +20% de daño durante 8 s. Consume resonancia; bloqueo de 4 s al finalizar."
                : "Offensive surge: +20% damage for 8s. Consumes resonance; 4s reentry lock after ending."}</p>
              <span>{overdriveStatus}</span>
            </article>
            <article>
              <div><ChevronsRight size={17} aria-hidden="true"/><strong>DASH · E</strong></div>
              <p>{language === "es"
                ? "Impulso de 180 ms según dirección actual/última. Recarga de 18 s; sin inmunidad ni gasto de resonancia."
                : "180ms dash in the current/last direction. 18s cooldown; no immunity or resonance cost."}</p>
              <span>{dashStatus}</span>
            </article>
            <article>
              <div><Shield size={17} aria-hidden="true"/><strong>{language === "es" ? "DEFENSA DEL NÚCLEO" : "CORE DEFENSE"}</strong></div>
              <p>{language === "es"
                ? "La barra corresponde al escudo de ENERGY. Los círculos de Overdrive no añaden escudos."
                : "This bar measures ENERGY's shield. Overdrive circles do not add shields."}</p>
              <span>{Math.round(Math.max(0, Math.min(100, shieldPercent)))}%</span>
            </article>
          </div>
        </section>
      )}
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
            className="h-full rounded transition-all duration-150"
            data-shield-band={shieldThreat.band}
            style={shieldFillStyle}
          />
        </div>
        <span className="shrink-0 text-[10px] font-bold" style={{color:shieldThreat.text}}>{Math.round(shieldPercent)}%</span>
      </div>

      {/* 2. WAVE LEVEL / BREAK */}
      <div className="orbi-hud-wave flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 px-2 py-0.5 rounded text-xs font-bold font-mono">
        {scoreAttackActive ? (
          <span className="text-cyan-300 uppercase">
            SCORE ATTACK · {scoreAttackDurationSeconds}S TIMEBOX
          </span>
        ) : isWaveBreak ? (
          <span className="text-cyan-400 animate-pulse uppercase">
            {t("hud.preparation").substring(0, 4)}: {waveBreakTimeLeft}s
          </span>
        ) : (
          <span className="text-amber-500 uppercase">
            W{currentWave} : <span className="text-slate-300 font-medium">{getLocalizedWaveDetails()}</span>
          </span>
        )}
      </div>

      {activeObjective && (
        <div className="orbi-hud-objective flex items-center gap-2 min-w-0">
          <span className="text-[8px] uppercase tracking-[0.15em] text-cyan-400/80 font-bold shrink-0">
            {language === "es" ? "OBJETIVO" : "OBJECTIVE"}
          </span>
          <span className="text-[9px] text-slate-400 truncate">
            {activeObjective}
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

      {/* 4. SCORE, CREDITS & COMBAT RESONANCE */}
      <div className="orbi-hud-score flex items-center gap-2 font-mono flex-wrap">
        <div className="flex items-center gap-1.5">
          <Award size={11} className="text-amber-400" />
          <span className="text-slate-400 uppercase">{t("hud.score")}:</span>
          <span className="text-white font-bold">{formatNumber(score)}</span>
        </div>
        <div className="flex items-center gap-1.5 font-bold text-amber-400">
          <span>$</span>
          <span>{formatNumber(nanoCredits)}</span>
        </div>
        <div
          className={`flex items-center gap-1.5 rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase ${getResonanceTone()}`}
          aria-label={resonanceAriaLabel}
          title={resonanceAriaLabel}
        >
          <span>{language === "es" ? "CAD" : "CHAIN"} {combatChain}</span>
          <div className="h-1 w-10 overflow-hidden rounded-full bg-slate-950/80" aria-hidden="true">
            <div
              className={`h-full rounded-full transition-[width] duration-150 ${getResonanceFill()}`}
              style={{ width: `${Math.max(0, Math.min(100, combatResonance))}%` }}
            />
          </div>
          <span>{Math.round(combatResonance)}%</span>
          <span>×{combatScoreMultiplier.toFixed(2)}</span>
          {combatResonanceTier === "OVERDRIVE_READY" && (
            <span className="text-amber-200">READY</span>
          )}
        </div>
      </div>

      {/* 5. QUICK CONTROLLER BUTTONS */}
      <div className="orbi-hud-actions flex items-center gap-1">
        <button type="button" data-testid="orbi-dash-action-desktop"
          onClick={onActivateDash} disabled={!dashCanActivate}
          className="orbi-dash-action-compact"
          aria-label={dashAriaLabel} title={dashAriaLabel}
        ><ChevronsRight size={12} aria-hidden="true" /><span>{dashStatus}</span></button>
        <button
          onClick={onActivateOverdrive}
          disabled={!combatOverdriveActionEnabled}
          className={`flex items-center gap-1 rounded border px-1.5 py-1 text-[8px] font-black uppercase transition ${
            combatOverdriveActive
              ? "border-amber-400/60 bg-amber-950/40 text-amber-300"
              : combatOverdriveReentryLocked
                ? "border-slate-800 bg-slate-950/60 text-slate-600"
                : combatOverdriveCanActivate
                  ? "border-amber-400/70 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 cursor-pointer"
                  : "border-slate-850 bg-slate-950/40 text-slate-600"
          } disabled:cursor-not-allowed`}
          title={overdriveAriaLabel}
          aria-label={overdriveAriaLabel}
          aria-disabled={!combatOverdriveActionEnabled}
        >
          <Zap size={10} />
          <span>{overdriveStatus}</span>
        </button>

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
    </div>
  );
};
export default GameHud;
