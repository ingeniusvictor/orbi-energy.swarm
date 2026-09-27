import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FORMATIONS } from "../game/formations";
import {
  cycleFormation,
  type FormationCycleDirection,
} from "../game/formationCycle";
import { FormationType } from "../game/types";
import { useGameTranslation } from "../i18n";

interface MobileFormationCarouselProps {
  activeFormation: FormationType;
  onChangeFormation: (formation: FormationType) => void;
  disabled?: boolean;
}

export const MobileFormationCarousel: React.FC<MobileFormationCarouselProps> = ({
  activeFormation,
  onChangeFormation,
  disabled = false,
}) => {
  const { language, t } = useGameTranslation();
  const fallbackName = FORMATIONS[activeFormation].name;
  const localizedName =
    t(`formations.${activeFormation}.name`) || fallbackName;

  const change = (
    event: React.MouseEvent<HTMLButtonElement>,
    direction: FormationCycleDirection,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (disabled) return;
    onChangeFormation(cycleFormation(activeFormation, direction));
  };

  return (
    <div
      className="orbi-touch-formation-carousel"
      data-mobile-formation-carousel
      aria-label={
        language === "es"
          ? "Selector rápido de formación"
          : "Quick formation selector"
      }
    >
      <button
        type="button"
        className="orbi-touch-formation-button"
        aria-label={
          language === "es" ? "Formación anterior" : "Previous formation"
        }
        disabled={disabled}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => change(event, -1)}
      >
        <ChevronLeft size={18} aria-hidden="true" />
      </button>

      <div className="orbi-touch-formation-current" aria-live="polite">
        <span>{language === "es" ? "FORMACIÓN" : "FORMATION"}</span>
        <strong>{localizedName}</strong>
      </div>

      <button
        type="button"
        className="orbi-touch-formation-button"
        aria-label={
          language === "es" ? "Siguiente formación" : "Next formation"
        }
        disabled={disabled}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => change(event, 1)}
      >
        <ChevronRight size={18} aria-hidden="true" />
      </button>
    </div>
  );
};

export default MobileFormationCarousel;
