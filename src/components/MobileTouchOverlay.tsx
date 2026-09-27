import React from "react";

type TouchDirection = "UP" | "DOWN" | "LEFT" | "RIGHT";

interface MobileTouchOverlayProps {
  onMove: (direction: TouchDirection) => void;
}

const controlLabel: Record<TouchDirection, string> = {
  UP: "Move up",
  DOWN: "Move down",
  LEFT: "Move left",
  RIGHT: "Move right",
};

export const MobileTouchOverlay: React.FC<MobileTouchOverlayProps> = ({ onMove }) => {
  const triggerMove = (
    event: React.PointerEvent<HTMLButtonElement>,
    direction: TouchDirection,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    onMove(direction);
  };

  const triggerKeyboardMove = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    direction: TouchDirection,
  ) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onMove(direction);
  };

  const button = (direction: TouchDirection, glyph: string, className: string) => (
    <button
      type="button"
      className={`orbi-touch-button ${className}`}
      aria-label={controlLabel[direction]}
      onPointerDown={(event) => triggerMove(event, direction)}
      onKeyDown={(event) => triggerKeyboardMove(event, direction)}
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
