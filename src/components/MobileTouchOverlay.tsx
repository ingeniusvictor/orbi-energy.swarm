import React from "react";
import type { TouchDirection } from "../game/touchControls";

interface MobileTouchOverlayProps {
  onDirectionChange: (direction: TouchDirection, pressed: boolean) => void;
}

const controlLabel: Record<TouchDirection, string> = {
  UP: "Move up",
  DOWN: "Move down",
  LEFT: "Move left",
  RIGHT: "Move right",
};

export const MobileTouchOverlay: React.FC<MobileTouchOverlayProps> = ({
  onDirectionChange,
}) => {
  const beginPointerDirection = (
    event: React.PointerEvent<HTMLButtonElement>,
    direction: TouchDirection,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    onDirectionChange(direction, true);
  };

  const endPointerDirection = (
    event: React.PointerEvent<HTMLButtonElement>,
    direction: TouchDirection,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    onDirectionChange(direction, false);
  };

  const handleKeyboardDirection = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    direction: TouchDirection,
    pressed: boolean,
  ) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    if (event.repeat && pressed) return;
    onDirectionChange(direction, pressed);
  };

  const button = (direction: TouchDirection, glyph: string, className: string) => (
    <button
      type="button"
      className={`orbi-touch-button ${className}`}
      aria-label={controlLabel[direction]}
      data-touch-direction={direction}
      onPointerDown={(event) => beginPointerDirection(event, direction)}
      onPointerUp={(event) => endPointerDirection(event, direction)}
      onPointerCancel={(event) => endPointerDirection(event, direction)}
      onLostPointerCapture={(event) => endPointerDirection(event, direction)}
      onKeyDown={(event) => handleKeyboardDirection(event, direction, true)}
      onKeyUp={(event) => handleKeyboardDirection(event, direction, false)}
      onContextMenu={(event) => event.preventDefault()}
    >
      <span aria-hidden="true">{glyph}</span>
    </button>
  );

  return (
    <div className="orbi-touch-overlay" data-mobile-touch-overlay>
      <div className="orbi-touch-pad" role="group" aria-label="Movement controls">
        {button("UP", "↑", "orbi-touch-button--up")}
        {button("LEFT", "←", "orbi-touch-button--left")}
        <div className="orbi-touch-core" aria-hidden="true">
          <span />
        </div>
        {button("RIGHT", "→", "orbi-touch-button--right")}
        {button("DOWN", "↓", "orbi-touch-button--down")}
      </div>
    </div>
  );
};

export default MobileTouchOverlay;
