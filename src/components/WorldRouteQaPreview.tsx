import React, { useEffect, useRef, useState } from "react";
import {
  createAsteriaSegment, createRouteCursor, projectRouteDistance,
  type RouteCursor,
} from "../game/worldRouteCore";
import { stepRouteClock, ROUTE_QA_SPEED_UNITS_PER_SECOND } from "../game/worldRouteClock";
import {
  stepRoutePreviewPlayer, type RoutePreviewPlayer,
} from "../game/worldRouteCamera";
import { drawWorldRouteQaScene } from "../game/worldRoutePreviewRenderer";
import "../styles/ux15RouteQa.css";

/**
 * An isolated opt-in QA laboratory, NOT the live EnergySwarmGame.
 * No enemy/progression/spawn references; opening it cannot mutate the campaign.
 */
export default function WorldRouteQaPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logicalWidthRef = useRef(800);
  const cursorRef = useRef<RouteCursor>(createRouteCursor());
  const playerRef = useRef<RoutePreviewPlayer>({ manualX: 0, y: 240 });
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const runningRef = useRef(true);
  const pressedRef = useRef(new Set<string>());
  const [running, setRunning] = useState(true);
  const [locale, setLocale] = useState<"es" | "en">("es");
  const [telemetry, setTelemetry] = useState({ ordinal: 0, distance: 0, simulatedMs: 0, playerX: 0, playerY: 240 });
  const [reduced, setReduced] = useState(false);

  const repaint = () => {
    const ctx = canvasRef.current?.getContext("2d", { alpha: false });
    if (ctx) drawWorldRouteQaScene(ctx, cursorRef.current, playerRef.current, logicalWidthRef.current);
    const cursor = cursorRef.current;
    setTelemetry({
      ordinal: cursor.segmentOrdinal,
      distance: projectRouteDistance(cursor),
      simulatedMs: cursor.simulatedMs,
      playerX: playerRef.current.manualX, playerY: playerRef.current.y,
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
    const onResize = () => {
      // Expand the logical WORLD width with screen aspect ratio; preserve the
      // same 480-unit vertical scale and equal X/Y unit sizes on all devices.
      const compact = window.matchMedia("(orientation: landscape) and (max-height: 440px)").matches;
      const availableWidth = Math.min(1020, Math.max(320, window.innerWidth - (compact ? 12 : 24)));
      const maxHeight = compact ? window.innerHeight * .56 :
        Math.min(window.innerHeight * .64, 640);
      const stageHeight = Math.min(maxHeight, availableWidth * 480 / 800);
      const logicalWidth = Math.min(2400, Math.max(800,
        Math.round(480 * availableWidth / Math.max(1, stageHeight))));
      logicalWidthRef.current = logicalWidth;
      canvas.dataset.logicalWidth = String(logicalWidth);
      canvas.dataset.logicalHeight = "480";
      canvas.width = Math.round(logicalWidth * dpr);
      canvas.height = Math.round(480 * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawWorldRouteQaScene(ctx, cursorRef.current, playerRef.current, logicalWidth);
    };
    onResize();
    let frame = 0;
    let last = 0;
    let lastPaint = 0;
    let paintCounter = 0;
    let disposed = false;
    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(prefersReduce);

    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (["arrowleft","arrowright","arrowup","arrowdown","w","a","s","d"].includes(key)) {
        e.preventDefault();pressedRef.current.add(key);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => pressedRef.current.delete(e.key.toLowerCase());
    const blur = () => { pressedRef.current.clear();pointerRef.current = null; };
    // Visibility resumption starts with zero simulated delta, not one artificial
    // 50ms advancement after Chrome has suspended requestAnimationFrame.
    const onVisibility = () => { last = 0; if (document.hidden) blur(); };
    const tick = (now: number) => {
      if (disposed) return;
      frame = requestAnimationFrame(tick);
      const dt = last ? Math.min(50, Math.max(0, now - last)) : 0;
      last = now;
      const gates = {
        playing: !prefersReduce,
        paused: !runningRef.current,
        hidden: document.hidden,
        modalOpen: false,
        upgradeOpen: false,
        hitstop: false,
      };
      const active = gates.playing && !gates.paused && !gates.hidden;
      cursorRef.current = stepRouteClock(
        cursorRef.current, dt, ROUTE_QA_SPEED_UNITS_PER_SECOND, gates,
      );
      let x = 0, y = 0;
      if (pressedRef.current.has("arrowleft") || pressedRef.current.has("a")) x--;
      if (pressedRef.current.has("arrowright") || pressedRef.current.has("d")) x++;
      if (pressedRef.current.has("arrowup") || pressedRef.current.has("w")) y--;
      if (pressedRef.current.has("arrowdown") || pressedRef.current.has("s")) y++;
      const pointer = pointerRef.current;
      if (pointer) {
        x += pointer.x;y += pointer.y;
      }
      playerRef.current = stepRoutePreviewPlayer(
        playerRef.current, { x, y }, dt, { width: logicalWidthRef.current, height: 480 }, active,
      );
      if (now - lastPaint >= 1000 / 30) {
        lastPaint = now;
        drawWorldRouteQaScene(ctx, cursorRef.current, playerRef.current, logicalWidthRef.current);
        if (++paintCounter % 9 === 0) {
          const cursor = cursorRef.current;
          setTelemetry({ ordinal: cursor.segmentOrdinal,
            distance: projectRouteDistance(cursor), simulatedMs: cursor.simulatedMs,
            playerX: playerRef.current.manualX, playerY: playerRef.current.y });
        }
      }
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", blur);
    document.addEventListener("visibilitychange", onVisibility);
    canvas.addEventListener("pointercancel", blur);
    drawWorldRouteQaScene(ctx, cursorRef.current, playerRef.current, logicalWidthRef.current);
    frame = requestAnimationFrame(tick);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", blur);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("pointercancel", blur);
      pressedRef.current.clear();
      pointerRef.current = null;
    };
  }, []);

  const current = createAsteriaSegment(telemetry.ordinal, cursorRef.current.seed);
  const goReset = () => {
    cursorRef.current = createRouteCursor();
    playerRef.current = { manualX: 0, y: 240 };
    repaint();
  };
  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointerRef.current = { x: 0, y: 0 };
    (e.currentTarget as HTMLCanvasElement).dataset.pointerStartX = String(e.clientX);
    (e.currentTarget as HTMLCanvasElement).dataset.pointerStartY = String(e.clientY);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    const sx = Number(e.currentTarget.dataset.pointerStartX);
    const sy = Number(e.currentTarget.dataset.pointerStartY);
    const dx = e.clientX - sx, dy = e.clientY - sy;
    pointerRef.current = { x: Math.max(-1,Math.min(1,dx / 55)),
      y: Math.max(-1,Math.min(1,dy / 55)) };
  };
  const onPointerUp = () => {pointerRef.current = null;};
  return (
    <main className="ux15-route-qa" data-testid="ux15-route-qa"
      data-route-mode="ROUTE_QA_PREVIEW" data-segment-ordinal={telemetry.ordinal}
      data-route-distance={Math.floor(telemetry.distance)}
      data-player-manual-x={telemetry.playerX.toFixed(2)} data-player-y={telemetry.playerY.toFixed(2)}>
      <header className="ux15-route-qa__header">
        <div>
          <span className="ux15-route-qa__eyebrow">ORBI ENERGY SWARM · UX15-B</span>
          <h1>{locale === "es" ? "LABORATORIO DE RUTAS" : "ROUTE LABORATORY"}</h1>
          <p>{locale === "es"
            ? "ASTERIA · prueba técnica 2.5D. No es una partida ni el arte definitivo."
            : "ASTERIA · 2.5D technical preview. No gameplay or final artwork."}</p>
        </div>
        <div className="ux15-route-qa__actions">
          <button type="button" onClick={() => setLocale(locale === "es" ? "en" : "es")}>
            {locale === "es" ? "EN" : "ES"}
          </button>
          <a href={import.meta.env.BASE_URL}>{locale === "es" ? "Volver al juego" : "Return to game"}</a>
        </div>
      </header>
      <div className="ux15-route-qa__viewport">
        <canvas ref={canvasRef} width={800} height={480}
          data-testid="ux15-route-canvas" role="img"
          aria-label={locale === "es" ? "Vista técnica ASTERIA de ruta en movimiento, sin combate" :
            "Technical ASTERIA route preview, no combat"}
          onPointerDown={onPointerDown} onPointerMove={onPointerMove}
          onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
        />
        <div className="ux15-route-qa__flag">QA ONLY · NO GAMEPLAY</div>
      </div>
      <section className="ux15-route-qa__telemetry" aria-label="Route telemetry">
        <div><span>{locale === "es" ? "Tramo" : "Section"}</span><strong>{current.labelEs && (locale === "es" ? current.labelEs : current.labelEn)}</strong></div>
        <div><span>{locale === "es" ? "Distancia simulada" : "Simulated distance"}</span><strong>{Math.floor(telemetry.distance).toLocaleString(locale)} u</strong></div>
        <div><span>{locale === "es" ? "Segmento" : "Segment"}</span><strong>{telemetry.ordinal + 1}</strong></div>
        <div><span>{locale === "es" ? "Estado" : "State"}</span><strong>{reduced ? "REDUCED MOTION" : running ? "TRAVERSING" : "PAUSED"}</strong></div>
      </section>
      <div className="ux15-route-qa__footer">
        <p>{locale === "es"
          ? "WASD / flechas o deslizar el dedo para mover la marca ENERGY. Sin enemigos, físicas ni recompensas."
          : "WASD / arrows or drag on touch to steer the ENERGY marker. No enemies, physics or rewards."}</p>
        <div className="ux15-route-qa__actions">
          <button type="button" data-testid="ux15-route-pause" onClick={() => {
            runningRef.current = !runningRef.current;
            setRunning(runningRef.current);
          }}>{running ? (locale === "es" ? "Pausar" : "Pause") : (locale === "es" ? "Reanudar" : "Resume")}</button>
          <button type="button" data-testid="ux15-route-reset" onClick={goReset}>
            {locale === "es" ? "Reiniciar ruta" : "Reset route"}
          </button>
        </div>
      </div>
    </main>
  );
}
