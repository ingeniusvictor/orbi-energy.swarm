import React, { useCallback, useEffect, useRef, useState } from "react";
import type { AnalogVector } from "../game/analogJoystick";
import { ChevronsRight, Zap } from "lucide-react";
import { useGameTranslation } from "../i18n";
import { projectAnalogJoystick, NEUTRAL_ANALOG_VECTOR } from "../game/analogJoystick";

interface MobileTouchOverlayProps {
  onVectorChange: (vector: AnalogVector) => void;
  onDash: () => void;
  onOverdrive: () => void;
  overdriveReady: boolean;
  overdriveActive: boolean;
  overdriveRemainingMs: number;
  dashActive: boolean;
  dashReady: boolean;
  dashCooldownRemainingMs: number;
  disabled?: boolean;
}

export const MobileTouchOverlay: React.FC<MobileTouchOverlayProps> = ({
  onVectorChange, onDash, onOverdrive, overdriveReady, overdriveActive, overdriveRemainingMs, dashActive, dashReady, dashCooldownRemainingMs, disabled = false,
}) => {
  const { language } = useGameTranslation();
  const dashStatus = dashActive ? (language === "es" ? "IMPULSO" : "BOOST")
    : dashReady ? (language === "es" ? "LISTO" : "READY")
    : `${Math.ceil(dashCooldownRemainingMs / 1000)}s`;
  const overdriveStatus = overdriveActive ? (language === "es" ? "ACTIVO" : "ACTIVE")
    : overdriveReady ? (language === "es" ? "LISTO" : "READY")
    : overdriveRemainingMs > 0 ? `${Math.ceil(overdriveRemainingMs / 1000)}s` : (language === "es" ? "CARGANDO" : "CHARGING");
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
      {/* UX12: independent touch pointer IDs on joystick and abilities. */}
      <div className="orbi-touch-abilities" data-testid="orbi-touch-abilities" role="group"
        aria-label={language === "es" ? "Habilidades de combate" : "Combat abilities"}>
        <button type="button" className="orbi-touch-skill orbi-touch-overdrive"
          data-testid="orbi-touch-overdrive" data-ready={overdriveReady ? "true" : "false"}
          data-active={overdriveActive ? "true" : "false"} disabled={disabled || !overdriveReady}
          onPointerDown={event => {
            event.stopPropagation();
            if (event.pointerType !== "mouse") {
              event.preventDefault();
              if (!disabled && overdriveReady) onOverdrive();
            }
          }}
          onClick={event => {
            event.stopPropagation();
            if (event.detail === 0 || (event.nativeEvent as PointerEvent).pointerType === "mouse") onOverdrive();
          }}
          aria-label={language === "es" ? `Activar Overdrive. ${overdriveStatus}` : `Activate Overdrive. ${overdriveStatus}`}>
          <Zap size={25} aria-hidden="true"/>
          <strong>OD</strong><span>{overdriveStatus}</span>
        </button>
        <button type="button" className="orbi-touch-skill orbi-touch-dash"
          data-testid="orbi-touch-dash"
          data-active={dashActive ? "true" : "false"} disabled={disabled || !dashReady}
          onPointerDown={event => {
            event.stopPropagation();
            if (event.pointerType !== "mouse") {
              event.preventDefault();
              if (!disabled && dashReady) onDash();
            }
          }}
          onClick={event => {
            event.stopPropagation();
            if (event.detail === 0 || (event.nativeEvent as PointerEvent).pointerType === "mouse") onDash();
          }}
          aria-label={language === "es" ? `Activar Dash de propulsión. ${dashStatus}` : `Activate propulsion Dash. ${dashStatus}`}>
          <ChevronsRight size={25} aria-hidden="true" />
          <strong>DASH</strong><span>{dashStatus}</span>
        </button>
      </div>
    </div>
  );
};
export default MobileTouchOverlay;
