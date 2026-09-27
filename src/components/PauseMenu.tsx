import React, { useState } from "react";
import { Play, RotateCcw, Volume2, VolumeX, Keyboard, LogOut, Settings, Globe } from "lucide-react";
import { playClickSound } from "../game/audio";
import { useGameTranslation } from "../i18n";

interface PauseMenuProps {
  onResume: () => void;
  onRestart: () => void;
  onExitToMenu: () => void;
  audioMuted: boolean;
  onToggleMute: () => void;
  screenShakeMode: "FULL" | "REDUCED" | "OFF";
  onSetScreenShakeMode: (mode: "FULL" | "REDUCED" | "OFF") => void;
  flashIntensity: "FULL" | "REDUCED";
  onSetFlashIntensity: (intensity: "FULL" | "REDUCED") => void;
  coreLabelsMode: "FULL" | "PROXIMITY" | "MINIMAL";
  onSetCoreLabelsMode: (mode: "FULL" | "PROXIMITY" | "MINIMAL") => void;
}

export const PauseMenu: React.FC<PauseMenuProps> = ({
  onResume,
  onRestart,
  onExitToMenu,
  audioMuted,
  onToggleMute,
  screenShakeMode,
  onSetScreenShakeMode,
  flashIntensity,
  onSetFlashIntensity,
  coreLabelsMode,
  onSetCoreLabelsMode
}) => {
  const { language, setLanguage, t } = useGameTranslation();
  const [showConfirmRestart, setShowConfirmRestart] = useState(false);
  const [showKeys, setShowKeys] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const clickRestart = () => {
    playClickSound();
    setShowConfirmRestart(true);
  };

  const confirmRestart = () => {
    playClickSound();
    onRestart();
  };

  const cancelRestart = () => {
    playClickSound();
    setShowConfirmRestart(false);
  };

  return (
    <div
      className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 text-white animate-fadeIn"
      id="pause-menu-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pause-menu-title"
      aria-describedby="pause-menu-state"
    >
      <div className="w-full max-w-sm bg-slate-900/95 border border-slate-800 rounded-xl p-6 shadow-2xl relative space-y-5 animate-scaleUp" id="pause-menu-container">
        {/* HEADER */}
        <div className="text-center">
          <h2 id="pause-menu-title" className="text-xl font-bold font-sans tracking-wide text-amber-500">
            ORBI ENERGY SWARM
          </h2>
          <p id="pause-menu-state" className="text-[10px] font-mono text-slate-500 tracking-widest mt-0.5 uppercase">
            {language === "es" ? "SIMULACIÓN PAUSADA" : "SIMULATION PAUSED"}
          </p>
        </div>

        {/* CONTENT SWITCHER */}
        {!showConfirmRestart && !showKeys && !showSettings ? (
          <div className="space-y-2.5">
            {/* 1. RESUME */}
            <button
              id="resume-btn"
              autoFocus
              onClick={() => {
                playClickSound();
                onResume();
              }}
              className="w-full py-2.5 rounded bg-amber-500 text-black font-semibold hover:bg-amber-400 transition flex items-center justify-center gap-2 text-xs uppercase"
            >
              <Play size={13} fill="black" />
              {language === "es" ? "REANUDAR SIMULACIÓN" : "RESUME SIMULATION"}
            </button>

            {/* 2. RESTART */}
            <button
              id="restart-btn"
              onClick={clickRestart}
              className="w-full py-2.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition flex items-center justify-center gap-2 text-xs uppercase"
            >
              <RotateCcw size={13} />
              {t("results.restartRun")}
            </button>

            {/* 3. SETTINGS */}
            <button
              id="settings-btn"
              onClick={() => {
                playClickSound();
                setShowSettings(true);
              }}
              className="w-full py-2.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition flex items-center justify-center gap-2 text-xs uppercase"
            >
              <Settings size={13} />
              {language === "es" ? "AJUSTES DE VIDEO Y EFECTOS" : "VIDEO & EFFECT SETTINGS"}
            </button>

            {/* 4. KEY BINDINGS CONTROLS */}
            <button
              id="controls-btn"
              onClick={() => {
                playClickSound();
                setShowKeys(true);
              }}
              className="w-full py-2.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition flex items-center justify-center gap-2 text-xs uppercase"
            >
              <Keyboard size={13} />
              {language === "es" ? "VER CONTROLES" : "VIEW CONTROLS"}
            </button>

            {/* 5. TOGGLE AUDIO */}
            <button
              id="audio-toggle-btn"
              onClick={() => {
                playClickSound();
                onToggleMute();
              }}
              className={`w-full py-2.5 rounded border transition flex items-center justify-center gap-2 text-xs uppercase ${
                audioMuted
                  ? "bg-rose-950/30 border-rose-900/60 text-rose-400 hover:bg-rose-950/50"
                  : "bg-cyan-950/30 border-cyan-900/60 text-cyan-400 hover:bg-cyan-950/50"
              }`}
            >
              {audioMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
              {audioMuted ? t("hud.muted") : t("hud.unmuted")}
            </button>

            {/* QUICK LANGUAGE SELECTOR */}
            <div className="flex justify-center items-center gap-2 py-1.5 bg-slate-950/40 rounded border border-slate-800/60">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{t("general.language")}:</span>
              <button
                onClick={() => { playClickSound(); setLanguage("es"); }}
                className={`px-2 py-0.5 text-[9px] font-mono rounded transition ${
                  language === "es" ? "bg-amber-500 text-black font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                ESPAÑOL
              </button>
              <span className="text-slate-800">|</span>
              <button
                onClick={() => { playClickSound(); setLanguage("en"); }}
                className={`px-2 py-0.5 text-[9px] font-mono rounded transition ${
                  language === "en" ? "bg-amber-500 text-black font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                ENGLISH
              </button>
            </div>

            {/* 6. RETURN TO MENU */}
            <button
              id="exit-btn"
              onClick={() => {
                playClickSound();
                if (confirm(language === "es" ? "¿Volver al menú de inicio? La simulación activa se descartará." : "Return to start menu? Active simulation will be discarded.")) {
                  onExitToMenu();
                }
              }}
              className="w-full py-2.5 rounded bg-transparent hover:bg-slate-850 text-slate-400 text-xs transition flex items-center justify-center gap-2 uppercase"
            >
              <LogOut size={13} />
              {t("results.returnToMenu")}
            </button>
          </div>
        ) : null}

        {/* RESTART CONFIRMATION FLOW */}
        {showConfirmRestart && (
          <div className="space-y-4 animate-fadeIn text-center" id="confirm-restart-section">
            <div className="text-xs text-slate-300 leading-relaxed">
              <span className="text-amber-500 font-bold block mb-1 uppercase">
                {language === "es" ? "¿REINICIAR ESTA SIMULACIÓN?" : "RESTART THIS SIMULATION?"}
              </span>
              {language === "es"
                ? "Todo el progreso, Orbis reclutados y multiplicadores de la partida actual se perderán definitivamente."
                : "All progress, recruited Orbis and multipliers from this active run will be permanently lost."}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="confirm-restart-yes"
                onClick={confirmRestart}
                className="py-2 rounded bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold animate-pulse uppercase"
              >
                {language === "es" ? "SÍ, REINICIAR" : "YES, RESTART"}
              </button>
              <button
                id="confirm-restart-no"
                autoFocus
                onClick={cancelRestart}
                className="py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs uppercase"
              >
                {language === "es" ? "CANCELAR" : "CANCEL"}
              </button>
            </div>
          </div>
        )}

        {/* SETTINGS DRAWER */}
        {showSettings && (
          <div className="space-y-4 animate-fadeIn" id="settings-section">
            <div className="text-xs font-mono text-slate-300 space-y-4 max-h-[300px] overflow-y-auto pr-1">
              <div className="text-amber-400 font-bold border-b border-slate-800 pb-1 text-center uppercase">
                {language === "es" ? "AJUSTES DE VIDEO Y EFECTOS" : "VIDEO & EFFECT SETTINGS"}
              </div>

              {/* EXPLICIT LANGUAGE SELECTOR WITHIN SETTINGS */}
              <div className="space-y-1.5 pb-1 border-b border-slate-850/60">
                <label className="text-[10px] text-slate-400 block tracking-wider flex items-center gap-1">
                  <Globe size={11} className="text-amber-400" /> {t("settings.languageLabel").toUpperCase()}
                </label>
                <div className="grid grid-cols-2 gap-1">
                  <button
                    onClick={() => {
                      playClickSound();
                      setLanguage("es");
                    }}
                    className={`py-1 text-[10px] rounded transition border ${
                      language === "es"
                        ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold"
                        : "bg-slate-850 border-slate-800 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    ESPAÑOL
                  </button>
                  <button
                    onClick={() => {
                      playClickSound();
                      setLanguage("en");
                    }}
                    className={`py-1 text-[10px] rounded transition border ${
                      language === "en"
                        ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold"
                        : "bg-slate-850 border-slate-800 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    ENGLISH
                  </button>
                </div>
              </div>
              
              {/* SCREEN SHAKE */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 block tracking-wider uppercase">{t("settings.screenShake")}</label>
                <div className="grid grid-cols-3 gap-1">
                  {(["FULL", "REDUCED", "OFF"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => {
                        playClickSound();
                        onSetScreenShakeMode(mode);
                      }}
                      className={`py-1 text-[10px] rounded transition border ${
                        screenShakeMode === mode
                          ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold"
                          : "bg-slate-850 border-slate-800 text-slate-400 hover:bg-slate-800"
                      }`}
                    >
                      {mode === "FULL" ? "FULL (100%)" : mode === "REDUCED" ? (language === "es" ? "REDUCIDO" : "REDUCED") : (language === "es" ? "APAGADO" : "OFF")}
                    </button>
                  ))}
                </div>
              </div>

              {/* FLASH INTENSITY */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 block tracking-wider uppercase">{t("settings.flashIntensity")}</label>
                <div className="grid grid-cols-2 gap-1">
                  {(["FULL", "REDUCED"] as const).map((intensity) => (
                    <button
                      key={intensity}
                      onClick={() => {
                        playClickSound();
                        onSetFlashIntensity(intensity);
                      }}
                      className={`py-1 text-[10px] rounded transition border ${
                        flashIntensity === intensity
                          ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold"
                          : "bg-slate-850 border-slate-800 text-slate-400 hover:bg-slate-800"
                      }`}
                    >
                      {intensity === "FULL" ? "NORMAL (100%)" : (language === "es" ? "SUAVE (20%)" : "SOFT (20%)")}
                    </button>
                  ))}
                </div>
              </div>

              {/* CORE LABELS */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 block tracking-wider uppercase">{t("settings.coreLabels")}</label>
                <div className="grid grid-cols-3 gap-1">
                  {(["FULL", "PROXIMITY", "MINIMAL"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => {
                        playClickSound();
                        onSetCoreLabelsMode(mode);
                      }}
                      className={`py-1 text-[10px] rounded transition border ${
                        coreLabelsMode === mode
                          ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold"
                          : "bg-slate-850 border-slate-800 text-slate-400 hover:bg-slate-800"
                      }`}
                    >
                      {mode === "FULL" ? (language === "es" ? "SIEMPRE" : "ALWAYS") : mode === "PROXIMITY" ? (language === "es" ? "PROXIMIDAD" : "PROXIMITY") : (language === "es" ? "OCULTO" : "HIDDEN")}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              id="back-from-settings"
              autoFocus
              onClick={() => {
                playClickSound();
                setShowSettings(false);
              }}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded font-mono border border-slate-700/60 uppercase"
            >
              &larr; {language === "es" ? "VOLVER AL MENÚ DE PAUSA" : "BACK TO PAUSE MENU"}
            </button>
          </div>
        )}

        {/* KEYS / KEYBINDINGS DRAWER */}
        {showKeys && (
          <div className="space-y-4 animate-fadeIn" id="controls-section">
            <div className="text-xs font-mono text-slate-300 space-y-2 max-h-[220px] overflow-y-auto">
              <div className="text-amber-400 font-bold border-b border-slate-800 pb-1 text-center uppercase">
                {t("startScreen.controlKeybindings")}
              </div>
              <div className="flex justify-between py-1 border-b border-slate-850">
                <span>WASD / Arrows</span>
                <span className="text-white">{t("startScreen.keys.movement")}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-850">
                <span>Keys 1 - 6</span>
                <span className="text-white">{language === "es" ? "Cambiar Formación" : "Change Formation"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-850">
                <span>Key P / Escape</span>
                <span className="text-white">{language === "es" ? "Pausar / Reanudar" : "Pause / Resume"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-850">
                <span>Key M</span>
                <span className="text-white">{t("startScreen.keys.mute")}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-850">
                <span>Key R</span>
                <span className="text-white">{language === "es" ? "Reiniciar Partida" : "Quick Reboot"}</span>
              </div>
            </div>
            <button
              id="back-from-controls"
              autoFocus
              onClick={() => {
                playClickSound();
                setShowKeys(false);
              }}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded font-mono border border-slate-700/60 uppercase"
            >
              &larr; {language === "es" ? "VOLVER AL MENÚ DE PAUSA" : "BACK TO PAUSE MENU"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PauseMenu;
