import React from "react";
import { ChevronLeft, ChevronRight, RotateCcw, X } from "lucide-react";
import {
  getPhotoFilterProfile,
  type PhotoFilterId,
} from "../game/photoMode";
import { useGameTranslation } from "../i18n";

interface PhotoModeOverlayProps {
  activeFilterId: PhotoFilterId;
  visible: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onReset: () => void;
  onExit: () => void;
}

export const PhotoModeOverlay: React.FC<PhotoModeOverlayProps> = ({
  activeFilterId,
  visible,
  onPrevious,
  onNext,
  onReset,
  onExit,
}) => {
  const { language } = useGameTranslation();
  const profile = getPhotoFilterProfile(activeFilterId);
  const interactiveTabIndex = visible ? 0 : -1;

  return (
    <div
      className={`orbi-photo-mode-controls fixed inset-x-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[70] mx-auto flex w-fit max-w-[calc(100vw-1rem)] items-center gap-2 rounded-xl border border-cyan-400/20 bg-slate-950/82 px-2.5 py-2 text-cyan-100 shadow-2xl backdrop-blur-md transition-opacity duration-150 ${
        visible ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
      role="toolbar"
      aria-label={language === "es" ? "Controles de modo foto" : "Photo mode controls"}
      aria-hidden={!visible}
      data-photo-filter={activeFilterId}
    >
      <button
        type="button"
        id="photo-filter-prev"
        tabIndex={interactiveTabIndex}
        onClick={onPrevious}
        className="flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-slate-700/80 bg-slate-900/80 text-cyan-200 hover:border-cyan-400/50 hover:bg-slate-800"
        aria-label={language === "es" ? "Filtro anterior" : "Previous filter"}
      >
        <ChevronLeft size={16} />
      </button>

      <div className="min-w-[9.5rem] px-2 text-center">
        <div className="text-[9px] font-mono uppercase tracking-[0.18em] text-slate-500">
          {language === "es" ? "MODO FOTO" : "PHOTO MODE"}
        </div>
        <div className="text-[11px] font-semibold tracking-[0.08em] text-cyan-100">
          {profile.label}
        </div>
        <div className="hidden text-[8px] font-mono uppercase tracking-[0.08em] text-slate-500 sm:block">
          ← / → · 0 {language === "es" ? "RESTABLECER" : "RESET"} · ESC / F10
        </div>
      </div>

      <button
        type="button"
        id="photo-filter-next"
        tabIndex={interactiveTabIndex}
        onClick={onNext}
        className="flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-slate-700/80 bg-slate-900/80 text-cyan-200 hover:border-cyan-400/50 hover:bg-slate-800"
        aria-label={language === "es" ? "Filtro siguiente" : "Next filter"}
      >
        <ChevronRight size={16} />
      </button>

      <button
        type="button"
        id="photo-filter-reset"
        tabIndex={interactiveTabIndex}
        onClick={onReset}
        className="flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-slate-700/80 bg-slate-900/80 text-slate-300 hover:border-amber-400/50 hover:text-amber-200"
        aria-label={language === "es" ? "Restablecer filtro" : "Reset filter"}
      >
        <RotateCcw size={15} />
      </button>

      <button
        type="button"
        id="photo-mode-exit"
        tabIndex={interactiveTabIndex}
        onClick={onExit}
        className="flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-slate-700/80 bg-slate-900/80 text-slate-300 hover:border-rose-400/50 hover:text-rose-200"
        aria-label={language === "es" ? "Salir de modo foto" : "Exit photo mode"}
      >
        <X size={16} />
      </button>
    </div>
  );
};
