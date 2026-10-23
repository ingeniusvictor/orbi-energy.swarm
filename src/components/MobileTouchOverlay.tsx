import React, { useCallback, useEffect, useRef, useState } from "react";
import type { AnalogVector } from "../game/analogJoystick";
import { projectAnalogJoystick, NEUTRAL_ANALOG_VECTOR } from "../game/analogJoystick";

interface MobileTouchOverlayProps {
  onVectorChange: (vector: AnalogVector) => void;
  disabled?: boolean;
}

export const MobileTouchOverlay: React.FC<MobileTouchOverlayProps> = ({
  onVectorChange, disabled = false,
}) => {
  const activePointer = useRef<number | null>(null);
  const latestCallback = useRef(onVectorChange);
  const [vector, setVector] = useState<AnalogVector>({ x: 0, y: 0 });
  const [engaged, setEngaged] = useState(false);
  latestCallback.current = onVectorChange;

  const release = useCallback(() => {
    activePointer.current = null;
    setEngaged(false);
    setVector({ x: 0, y: 0 });
    latestCallback.current(NEUTRAL_ANALOG_VECTOR);
  }, []);

  useEffect(() => { if (disabled) release(); }, [disabled, release]);
  useEffect(() => {
    window.addEventListener("blur", release);
    return () => { window.removeEventListener("blur", release); release(); };
  }, [release]);

  const update = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const next = projectAnalogJoystick(
      event.clientX - (rect.left + rect.width / 2),
      event.clientY - (rect.top + rect.height / 2),
      Math.min(rect.width, rect.height) * 0.34,
    );
    setVector(next);
    latestCallback.current(next);
  };
  const begin = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || activePointer.current !== null) return;
    event.preventDefault(); event.stopPropagation();
    activePointer.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    setEngaged(true); update(event);
  };
  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerId !== activePointer.current) return;
    event.preventDefault(); event.stopPropagation(); update(event);
  };
  const finish = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerId !== activePointer.current) return;
    event.preventDefault(); event.stopPropagation(); release();
  };
  return (
    <div className="orbi-touch-overlay" data-mobile-touch-overlay>
      <div className="orbi-analog-joystick"
        data-testid="orbi-analog-joystick"
        data-engaged={engaged ? "true" : "false"}
        data-disabled={disabled ? "true" : "false"}
        role="group" aria-label="Joystick analógico de movimiento 360 grados"
        onPointerDown={begin} onPointerMove={move}
        onPointerUp={finish} onPointerCancel={finish} onLostPointerCapture={finish}
        onContextMenu={event => event.preventDefault()}>
        <div className="orbi-analog-joystick__rings" aria-hidden="true" />
        <div className="orbi-analog-joystick__thumb" aria-hidden="true"
          style={{ transform: `translate(calc(-50% + ${vector.x * 40}px), calc(-50% + ${vector.y * 40}px))` }}>
          <span />
        </div>
      </div>
    </div>
  );
};
export default MobileTouchOverlay;
