import React from "react";
import { ArrowLeft } from "lucide-react";
import { useGameTranslation } from "../i18n";

/** WEB UX01B: photo mode hides the whole battle HUD, so always leave an
 * accessible way back after its temporary filter controls fade out.
 * This is only mounted in fine-pointer web immersive gameplay. */
export const WebPhotoReturn: React.FC<{onExit: () => void}> = ({onExit}) => {
  const {language} = useGameTranslation();
  return (
    <button type="button" className="orbi-web-photo-return"
      data-testid="orbi-web-photo-return"
      aria-label={language === "es" ? "Salir del modo foto y volver a pausa" : "Exit photo mode and return to pause"}
      aria-keyshortcuts="Escape F10"
      onPointerDown={e => e.stopPropagation()}
      onClick={e => {e.stopPropagation(); onExit();}}>
      <ArrowLeft size={16} aria-hidden="true"/>
      <span>{language === "es" ? "SALIR DEL MODO FOTO" : "EXIT PHOTO MODE"}</span>
      <kbd>ESC</kbd>
    </button>
  );
};
