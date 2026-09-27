import React from "react";
import { 
  OrbiMember, Enemy, Projectile, Resource, BiomeType, 
  FormationType, EnemyType, OrbiType
} from "./types";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants";
import { getCanvasBackingStoreSize } from "./canvasResolution";
import { getActiveLanguage } from "../i18n";

interface EnergySwarmCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isPaused: boolean;
  activeBiome: BiomeType;
  activeFormation: FormationType;
  playerPos: { x: number; y: number };
  playerFlash: number; // Ticks of invuln flash
  cameraOffset: { x: number; y: number };
  drawNebula: boolean;
  drawPlanets: boolean;
  maxDpr: number;
  screenShake: number;
  swarm: OrbiMember[];
  enemies: Enemy[];
  projectiles: Projectile[];
  resources: Resource[];
  particles: any[];
  bossActive: boolean;
  onPointerMove: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  onPointerDown: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  onPointerUp: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  time: number;
}

export const EnergySwarmCanvas: React.FC<EnergySwarmCanvasProps> = ({
  canvasRef,
  isPaused,
  playerFlash,
  maxDpr,
  onPointerMove,
  onPointerDown,
  onPointerUp
}) => {
  React.useEffect(() => {
    const syncBackingStore = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const { dpr, width, height } = getCanvasBackingStoreSize(
        CANVAS_WIDTH,
        CANVAS_HEIGHT,
        window.devicePixelRatio,
        maxDpr,
      );

      if (canvas.width !== width) canvas.width = width;
      if (canvas.height !== height) canvas.height = height;
      canvas.dataset.logicalWidth = String(CANVAS_WIDTH);
      canvas.dataset.logicalHeight = String(CANVAS_HEIGHT);
      canvas.dataset.pixelRatio = String(dpr);
    };

    syncBackingStore();
    window.addEventListener("resize", syncBackingStore);
    window.visualViewport?.addEventListener("resize", syncBackingStore);

    return () => {
      window.removeEventListener("resize", syncBackingStore);
      window.visualViewport?.removeEventListener("resize", syncBackingStore);
    };
  }, [canvasRef, maxDpr]);

  // We perform drawing logic directly using requestAnimationFrame inside parent,
  // but let's provide a robust, responsive Canvas frame wrapper with CSS constraints.
  return (
    <div className="orbi-game-stage relative w-full bg-slate-950 border border-slate-900 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center">
      <canvas
        id="game-canvas"
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onPointerMove={onPointerMove}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        className="w-full h-full object-contain cursor-none select-none touch-none"
        style={{
          touchAction: "none",
          overscrollBehavior: "contain"
        }}
      />

      {/* Screen flash on hit overlay */}
      {playerFlash > 0 && playerFlash % 4 < 2 && (
        <div className="absolute inset-0 border-4 border-red-600/30 bg-red-600/5 pointer-events-none animate-fadeIn" />
      )}

      {/* PAUSED GAME OVERLAY PORTAL */}
      {isPaused && (
        <div className="absolute inset-0 bg-slate-950/20 pointer-events-none" />
      )}
    </div>
  );
};

// --- CORE EXPORTED DRAWING HELPERS ---

/**
 * Draws Orbi Foton leader (Amber core + orbiting satellite orbitals + eyeball direction).
 */
export function drawFoton(
  ctx: CanvasRenderingContext2D,
  playerPos: { x: number; y: number },
  playerFlash: number,
  time: number,
  pointerPos: { x: number; y: number },
  hasGoldenCore: boolean = false
) {
  // Invincibility flicker
  if (playerFlash > 0 && Math.floor(playerFlash / 3) % 2 === 0) return;

  const { x, y } = playerPos;

  if (hasGoldenCore) {
    // Elegant pulsing golden crown ring around Orbi Foton
    ctx.save();
    ctx.strokeStyle = "rgba(251, 191, 36, 0.85)";
    ctx.lineWidth = 1.8;
    ctx.shadowColor = "#f59e0b";
    ctx.shadowBlur = 12 + Math.sin(time * 0.006) * 4;
    ctx.beginPath();
    ctx.arc(x, y, 18 + Math.sin(time * 0.005) * 1.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  ctx.save();
  ctx.translate(x, y);

  // 1. Draw central core glow
  const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, 16);
  glow.addColorStop(0, "#ffffff");
  glow.addColorStop(0.3, "#f59e0b"); // Amber core
  glow.addColorStop(0.8, "rgba(245, 158, 11, 0.2)");
  glow.addColorStop(1, "rgba(245, 158, 11, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, 16, 0, Math.PI * 2);
  ctx.fill();

  // 2. Draw outer orbital rings
  ctx.strokeStyle = "rgba(245, 158, 11, 0.4)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 0, 24, 0, Math.PI * 2);
  ctx.stroke();

  // Rotating satellite node
  const satAngle = time * 0.003;
  ctx.fillStyle = "#fbbf24";
  ctx.beginPath();
  ctx.arc(Math.cos(satAngle) * 24, Math.sin(satAngle) * 24, 3, 0, Math.PI * 2);
  ctx.fill();

  // 3. Draw cybernetic directional pupil eyeball pointing towards cursor
  const dx = pointerPos.x - x;
  const dy = pointerPos.y - y;
  const angle = Math.atan2(dy, dx);

  ctx.rotate(angle);
  
  // White eye backdrop
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(5, 0, 4, 0, Math.PI * 2);
  ctx.fill();

  // Cyan pupil
  ctx.fillStyle = "#06b6d4";
  ctx.beginPath();
  ctx.arc(6.5, 0, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Draws active swarm members.
 */
export function drawSwarmRoster(
  ctx: CanvasRenderingContext2D,
  swarm: OrbiMember[],
  time: number
) {
  const drawSingleMember = (member: OrbiMember, idx: number) => {
    // LOD Thresholds
    const isNear = idx < 12;
    const isMid = idx >= 12 && idx < 36;
    const isFar = idx >= 36;

    ctx.save();

    // 1. LOD FAR: Highly optimized simple circle, reduced glow, no animations, no recoil
    if (isFar) {
      ctx.fillStyle = member.color;
      ctx.shadowBlur = 2.0;
      ctx.shadowColor = member.color;
      ctx.beginPath();
      ctx.arc(member.x, member.y, member.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    // Apply physical shooting recoil (simplified for Mid, full for Near)
    const rx = member.recoilX || 0;
    const ry = member.recoilY || 0;
    const recoilMod = isNear ? 1.0 : 0.5;
    ctx.translate(member.x + rx * recoilMod, member.y + ry * recoilMod);

    // Orbiting/pulsing size modulation
    let localPulse = isNear ? Math.sin(time * 0.005 + idx * 0.5) * 1.5 : 0;
    if (member.type === OrbiType.SOLAR_GUARDIAN) {
      localPulse *= 0.5; // Scale pulse down for Solar Guardian to maintain proportion
    }
    const r = member.size + localPulse;

    // Apply shoot flashing
    const isFlashing = member.flashTicks && member.flashTicks > 0;
    if (isFlashing) {
      ctx.shadowBlur = member.size * (isNear ? 3.0 : 2.0);
      ctx.shadowColor = "#ffffff";
      ctx.fillStyle = "#ffffff";
    } else {
      ctx.shadowBlur = member.size * (isNear ? 2.0 : 1.0);
      ctx.shadowColor = member.color;
      ctx.fillStyle = member.color;
    }

    // Core body fill
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // 2. LOD MID: Moderate detail, simple halos, no eyes, no complex insignias
    if (isMid) {
      if (member.evolutionStage && member.evolutionStage > 1) {
        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, r * 1.4, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
      return;
    }

    // 3. LOD NEAR: Full details (eyes, halos, double halos, insignias, level text)
    // Draw cybernetic details: eyes facing movement target
    const dx = member.targetX - member.x;
    const dy = member.targetY - member.y;
    const distSq = dx * dx + dy * dy;
    const angle = distSq > 1 ? Math.atan2(dy, dx) : 0;

    ctx.save();
    ctx.rotate(angle);
    // Eye whites
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(r * 0.4, -r * 0.3, r * 0.25, 0, Math.PI * 2);
    ctx.arc(r * 0.4, r * 0.3, r * 0.25, 0, Math.PI * 2);
    ctx.fill();
    // Pupils
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.arc(r * 0.55, -r * 0.3, r * 0.12, 0, Math.PI * 2);
    ctx.arc(r * 0.55, r * 0.3, r * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Double orbiting wings for Fusion Units
    if (member.type === OrbiType.SOLAR_GUARDIAN || member.type === OrbiType.HYDRO_LEVIATHAN) {
      ctx.shadowBlur = member.type === OrbiType.SOLAR_GUARDIAN ? 5 : 10;
      ctx.strokeStyle = member.color;
      ctx.lineWidth = member.type === OrbiType.SOLAR_GUARDIAN ? 0.75 : 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.8, 0, Math.PI * 2);
      ctx.stroke();

      const wingA = time * 0.005 + idx;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(
        Math.cos(wingA) * r * 1.8,
        Math.sin(wingA) * r * 1.8,
        member.type === OrbiType.SOLAR_GUARDIAN ? 1.25 : 2.5,
        0,
        Math.PI * 2
      );
      ctx.fill();
    } else {
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.5, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Evolution stage visual layers
    const stage = member.evolutionStage || 1;
    if (stage === 2) {
      // FOTON: Simple halo
      ctx.strokeStyle = member.color;
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.4, 0, Math.PI * 2);
      ctx.stroke();
    } else if (stage === 3) {
      // GUARDIAN: Outer ring + insignia/badge
      ctx.strokeStyle = member.color;
      ctx.lineWidth = member.type === OrbiType.SOLAR_GUARDIAN ? 0.6 : 1.2;
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.55, 0, Math.PI * 2);
      ctx.stroke();

      // Outer dashed rings
      ctx.save();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.setLineDash([2, 4]);
      ctx.lineWidth = member.type === OrbiType.SOLAR_GUARDIAN ? 0.4 : 0.8;
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Diamond insignia inside
      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
      ctx.lineWidth = member.type === OrbiType.SOLAR_GUARDIAN ? 0.5 : 1;
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.55);
      ctx.lineTo(r * 0.45, 0);
      ctx.lineTo(0, r * 0.55);
      ctx.lineTo(-r * 0.45, 0);
      ctx.closePath();
      ctx.stroke();
    } else if (stage === 4) {
      // PRIME: Double halo + glowing star mark
      ctx.strokeStyle = member.color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.6, 0, Math.PI * 2);
      ctx.stroke();

      ctx.save();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.9, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Plus shaped star distinctive mark
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.7);
      ctx.lineTo(0, r * 0.7);
      ctx.moveTo(-r * 0.7, 0);
      ctx.lineTo(r * 0.7, 0);
      ctx.stroke();
    }

    // Draw level label overlay
    if (member.level && member.level > 1) {
      const lang = getActiveLanguage();
      const levelPrefix = lang === "es" ? "N" : "L";
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.font = "bold 6px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`${levelPrefix}${member.level}`, 0, r + 7.5);
    }

    ctx.restore();
  };

  // Double-sweep layout rendering for perfect layer stack
  // 1. Draw normal followers first
  swarm.forEach((member, idx) => {
    if (member.type === OrbiType.SOLAR_GUARDIAN || member.type === OrbiType.HYDRO_LEVIATHAN) return;
    drawSingleMember(member, idx);
  });

  // 2. Draw Advanced Fusion Units (Solar Guardian / Hydro Leviathan) on top of normal followers
  swarm.forEach((member, idx) => {
    if (member.type !== OrbiType.SOLAR_GUARDIAN && member.type !== OrbiType.HYDRO_LEVIATHAN) return;
    drawSingleMember(member, idx);
  });
}

/**
 * Draws harvestable resources (Nano Crystals, Purified Crystals, Wild Orbis).
 */
export function drawResources(
  ctx: CanvasRenderingContext2D,
  resources: Resource[],
  time: number,
  playerPos?: { x: number; y: number },
  coreLabelsMode?: "FULL" | "PROXIMITY" | "MINIMAL"
) {
  resources.forEach((res) => {
    ctx.save();
    ctx.translate(res.x, res.y);

    // Sinusoidal floating animation
    const bounce = Math.sin(time * 0.006 + res.x) * 2;
    ctx.translate(0, bounce);

    ctx.shadowBlur = res.size * 1.2;
    ctx.shadowColor = res.color;
    ctx.fillStyle = res.color;

    ctx.beginPath();
    if (res.type === "NANO") {
      // Diamond shaped amber nano credits
      ctx.moveTo(0, -res.size);
      ctx.lineTo(res.size * 0.7, 0);
      ctx.lineTo(0, res.size);
      ctx.lineTo(-res.size * 0.7, 0);
      ctx.closePath();
      ctx.fill();
    } else if (res.type === "ENERGY") {
      // Hexagon cyan energy purification crystal
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const px = Math.cos(angle) * res.size;
        const py = Math.sin(angle) * res.size;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    } else if (res.type === "ORBI") {
      const affinity = res.orbiAffinity || "solar";
      let coreColor = "#f59e0b";
      if (affinity === "solar") coreColor = "#f59e0b";
      else if (affinity === "hydro") coreColor = "#0ea5e9";
      else if (affinity === "wind") coreColor = "#10b981";
      else if (affinity === "thermal") coreColor = "#ef4444";
      else if (affinity === "nuclear") coreColor = "#8b5cf6";
      else if (affinity === "quantum") coreColor = "#ec4899";

      // Wild Orbi elemental visual effects (Section 9)
      const pulseFactor = 1 + Math.sin(time * 0.01) * 0.18;
      const sizeWithPulse = res.size * pulseFactor;

      // 1. Amplified elemental shadow glow
      ctx.shadowBlur = res.size * 2.5;
      ctx.shadowColor = coreColor;
      ctx.fillStyle = coreColor;
      ctx.strokeStyle = coreColor;

      // 2. Rotating outer orbital halo / "Wild" indicator ring
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, res.size * 1.5, 0, Math.PI * 2);
      ctx.stroke();

      // Rotating satellite node on indicator ring
      const satAngle = time * 0.004;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(Math.cos(satAngle) * res.size * 1.5, Math.sin(satAngle) * res.size * 1.5, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // 3. Draw distinctive elemental shapes
      ctx.fillStyle = coreColor;
      ctx.strokeStyle = coreColor;
      ctx.lineWidth = 1.5;

      if (affinity === "solar") {
        // Solar Core: Golden sun with rotating spires (12-pointed sunburst)
        ctx.beginPath();
        const numSpires = 12;
        const rot = time * 0.001;
        for (let i = 0; i < numSpires * 2; i++) {
          const angle = (i * Math.PI) / numSpires + rot;
          const radius = i % 2 === 0 ? sizeWithPulse : sizeWithPulse * 0.55;
          const px = Math.cos(angle) * radius;
          const py = Math.sin(angle) * radius;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        
        // Sun inner core
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(0, 0, sizeWithPulse * 0.3, 0, Math.PI * 2);
        ctx.fill();

      } else if (affinity === "hydro") {
        // Hydro Core: Liquid droplet / bubble shape
        ctx.beginPath();
        ctx.arc(0, 0, sizeWithPulse * 0.9, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = coreColor;
        ctx.beginPath();
        // Teardrop shape pointing upwards
        ctx.moveTo(0, -sizeWithPulse);
        ctx.quadraticCurveTo(sizeWithPulse * 0.7, -sizeWithPulse * 0.2, sizeWithPulse * 0.6, sizeWithPulse * 0.4);
        ctx.arc(0, sizeWithPulse * 0.4, sizeWithPulse * 0.6, 0, Math.PI, false);
        ctx.quadraticCurveTo(-sizeWithPulse * 0.7, -sizeWithPulse * 0.2, 0, -sizeWithPulse);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(-sizeWithPulse * 0.15, 0, sizeWithPulse * 0.2, 0, Math.PI * 2);
        ctx.fill();

      } else if (affinity === "wind") {
        // Wind Core: Pinwheel cyclone (3 rotating curved blades)
        const rot = time * 0.006;
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
          const angle = (i * Math.PI * 2) / 3 + rot;
          const endAngle = angle + Math.PI / 1.5;
          ctx.arc(0, 0, sizeWithPulse, angle, endAngle, false);
          ctx.lineTo(0, 0);
        }
        ctx.closePath();
        ctx.fill();

        // White core nucleus
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(0, 0, sizeWithPulse * 0.35, 0, Math.PI * 2);
        ctx.fill();

      } else if (affinity === "thermal") {
        // Thermal Core: Fire flame shape
        ctx.beginPath();
        ctx.moveTo(0, -sizeWithPulse * 1.2);
        ctx.quadraticCurveTo(sizeWithPulse * 0.8, -sizeWithPulse * 0.2, sizeWithPulse * 0.7, sizeWithPulse * 0.7);
        ctx.lineTo(-sizeWithPulse * 0.7, sizeWithPulse * 0.7);
        ctx.quadraticCurveTo(-sizeWithPulse * 0.8, -sizeWithPulse * 0.2, 0, -sizeWithPulse * 1.2);
        ctx.closePath();
        ctx.fill();

        // Inner fire core
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.moveTo(0, -sizeWithPulse * 0.5);
        ctx.lineTo(sizeWithPulse * 0.35, sizeWithPulse * 0.45);
        ctx.lineTo(-sizeWithPulse * 0.35, sizeWithPulse * 0.45);
        ctx.closePath();
        ctx.fill();

      } else if (affinity === "nuclear") {
        // Nuclear Core: Atom model with crossing orbital loops
        const rot = time * 0.002;
        ctx.strokeStyle = coreColor;
        ctx.lineWidth = 1.5;

        for (let i = 0; i < 3; i++) {
          ctx.save();
          ctx.rotate((i * Math.PI) / 3 + rot);
          ctx.beginPath();
          ctx.scale(1.2, 0.4);
          ctx.arc(0, 0, sizeWithPulse, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        // Heavy center nucleus
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(0, 0, sizeWithPulse * 0.4, 0, Math.PI * 2);
        ctx.fill();

      } else if (affinity === "quantum") {
        // Quantum Core: Concentric rotating squares
        const rot = time * 0.003;
        ctx.save();
        ctx.rotate(rot);
        ctx.beginPath();
        ctx.rect(-sizeWithPulse * 0.7, -sizeWithPulse * 0.7, sizeWithPulse * 1.4, sizeWithPulse * 1.4);
        ctx.closePath();
        ctx.fill();

        ctx.rotate(Math.PI / 4);
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.beginPath();
        ctx.rect(-sizeWithPulse * 0.5, -sizeWithPulse * 0.5, sizeWithPulse, sizeWithPulse);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = coreColor;
        ctx.beginPath();
        ctx.arc(0, 0, sizeWithPulse * 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 4. Enhanced text indicator depending on coreLabelsMode
      const labelsMode = coreLabelsMode || "PROXIMITY";
      let drawLabelText = false;
      let labelOpacity = 1.0;

      if (labelsMode === "FULL") {
        drawLabelText = true;
      } else if (labelsMode === "PROXIMITY") {
        const dist = playerPos ? Math.sqrt((res.x - playerPos.x) ** 2 + (res.y - playerPos.y) ** 2) : 999;
        const ageMs = res.spawnTime ? (Date.now() - res.spawnTime) : 0;
        
        const droppedVisible = ageMs < 2000;
        const closeVisible = dist < 120;

        if (droppedVisible || closeVisible) {
          drawLabelText = true;
          if (droppedVisible && !closeVisible) {
            if (ageMs > 1500) {
              labelOpacity = 1.0 - (ageMs - 1500) / 500;
            }
          } else if (closeVisible) {
            labelOpacity = Math.min(1.0, (120 - dist) / 40);
          }
        }
      }

      if (drawLabelText && labelOpacity > 0.05) {
        const lang = getActiveLanguage();
        const displayLabel = lang === "es" ? `${affinity.toUpperCase()} SALVAJE` : `WILD ${affinity.toUpperCase()}`;
        ctx.fillStyle = `rgba(255, 255, 255, ${labelOpacity * 0.95})`;
        ctx.font = "bold 7px monospace";
        ctx.textAlign = "center";
        ctx.fillText(displayLabel, 0, -res.size * 2.2);
      }
    }

    ctx.restore();
  });
}

/**
 * Draws Crawlers, Parasites, Drones, and Boss.
 */
export function drawEnemiesList(
  ctx: CanvasRenderingContext2D,
  enemies: Enemy[],
  time: number,
  playerPos: { x: number; y: number }
) {
  enemies.forEach((enemy) => {
    if (enemy.isDead) return;

    ctx.save();
    ctx.translate(enemy.x, enemy.y);

    // Apply white hit flashing (for high intensity impact frames)
    if (enemy.flashTicks > 0) {
      ctx.shadowBlur = enemy.size * 2.5;
      ctx.shadowColor = "#ffffff";
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(0, 0, enemy.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    // DRAW WEAPONS CHARGING TELEGRAPHS (drawn behind the enemy body)
    if (enemy.type === EnemyType.DRONE && enemy.shootCooldown !== undefined && enemy.shootCooldown <= 35 && enemy.shootCooldown > 0) {
      // Fine target line to Foton leader (Section 3.1)
      ctx.save();
      const pdx = playerPos.x - enemy.x;
      const pdy = playerPos.y - enemy.y;
      ctx.strokeStyle = "rgba(168, 85, 247, 0.45)"; // Soft violet telegraph
      ctx.lineWidth = 1.0;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(pdx, pdy);
      ctx.stroke();
      ctx.restore();
    } else if (enemy.type === EnemyType.DISRUPTOR && enemy.shootCooldown !== undefined && enemy.shootCooldown <= 60 && enemy.shootCooldown > 0) {
      // Expanding circle area of effect (Section 3.2)
      ctx.save();
      ctx.strokeStyle = "rgba(6, 182, 212, 0.5)"; // cyan warning ring
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 120, 0, Math.PI * 2); // 120px disrupt radius
      ctx.stroke();

      // Pulsing indicator zone
      ctx.fillStyle = `rgba(6, 182, 212, ${0.05 + Math.sin(time * 0.015) * 0.03})`;
      ctx.beginPath();
      ctx.arc(0, 0, 120, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (enemy.type === EnemyType.BLACKOUT_ELITE && enemy.chargeTimer !== undefined && enemy.chargeTimer > 0) {
      ctx.save();
      // Face towards Player Foton
      const faceAngle = Math.atan2(enemy.vy || (playerPos.y - enemy.y), enemy.vx || (playerPos.x - enemy.x));
      
      if (enemy.chargeTimer > 24) {
        // Paused/Wind-up telegraph phase (Section 3.3)
        ctx.strokeStyle = "rgba(239, 68, 68, 0.65)"; // Intense red indicator
        ctx.lineWidth = 2.0;
        ctx.setLineDash([6, 3]);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(faceAngle) * 200, Math.sin(faceAngle) * 200);
        ctx.stroke();

        ctx.fillStyle = "rgba(239, 68, 68, 0.06)";
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, 200, faceAngle - 0.22, faceAngle + 0.22);
        ctx.closePath();
        ctx.fill();
      } else {
        // Active rapid dash phase: draw red speed trail lines
        ctx.strokeStyle = "rgba(239, 68, 68, 0.5)";
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(-enemy.vx * 1.5, -enemy.vy * 1.5);
        ctx.lineTo(-enemy.vx * 3.5, -enemy.vy * 3.5);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Set normal enemy shadows & glow
    ctx.shadowBlur = enemy.size * 1.4;
    ctx.shadowColor = enemy.color;
    ctx.fillStyle = enemy.color;

    switch (enemy.type) {
      case EnemyType.CRAWLER: {
        // Hexagonal heavy body with metallic borders and blackout eyes (Section 2.1)
        const pulse = Math.sin(time * 0.008) * 1.2;
        const currentSize = enemy.size + pulse;

        // Metallic outer hexagon border
        ctx.fillStyle = "#9ca3af"; // Metallic gray
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          ctx.lineTo(Math.cos(angle) * (currentSize * 1.15), Math.sin(angle) * (currentSize * 1.15));
        }
        ctx.closePath();
        ctx.fill();

        // Dark slate core mass
        ctx.fillStyle = "#374151"; // gris oscuro
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          ctx.lineTo(Math.cos(angle) * currentSize, Math.sin(angle) * currentSize);
        }
        ctx.closePath();
        ctx.fill();

        // Armor plate studs
        ctx.fillStyle = "#111827";
        for (let i = 0; i < 6; i += 2) {
          const angle = (i * Math.PI) / 3;
          ctx.beginPath();
          ctx.arc(Math.cos(angle) * currentSize * 0.75, Math.sin(angle) * currentSize * 0.75, currentSize * 0.25, 0, Math.PI * 2);
          ctx.fill();
        }

        // Two glowing red eyes (ojo blackout)
        ctx.fillStyle = "#f43f5e"; // rojo apagado
        ctx.beginPath();
        ctx.arc(-currentSize * 0.3, -currentSize * 0.22, 2.5, 0, Math.PI * 2);
        ctx.arc(currentSize * 0.3, -currentSize * 0.22, 2.5, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case EnemyType.PARASITE: {
        // Spiked pointed parasite with twitchy leg structures (Section 2.2)
        const twitch = Math.sin(time * 0.045) * 1.8;
        const currentSize = enemy.size + twitch;

        // Glowing shadow
        ctx.shadowBlur = currentSize * 1.8;
        ctx.shadowColor = "#f43f5e"; // glow rosado

        // Leg extensions
        ctx.strokeStyle = "#4a044e"; // magenta oscuro
        ctx.lineWidth = 2.5;
        for (let i = 0; i < 6; i++) {
          const legAngle = (i * Math.PI) / 3 + Math.sin(time * 0.08 + i) * 0.45;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(legAngle) * (currentSize * 1.45), Math.sin(legAngle) * (currentSize * 1.45));
          ctx.stroke();
        }

        // Central pointed body shape (star-pointed)
        ctx.fillStyle = "#030712"; // negro
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * Math.PI * 2) / 5 + time * 0.02;
          const px = Math.cos(angle) * currentSize;
          const py = Math.sin(angle) * currentSize;
          const innerX = Math.cos(angle + Math.PI / 5) * (currentSize * 0.45);
          const innerY = Math.sin(angle + Math.PI / 5) * (currentSize * 0.45);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
          ctx.lineTo(innerX, innerY);
        }
        ctx.closePath();
        ctx.fill();

        // Glowing core
        ctx.fillStyle = "#ec4899"; // glow rosado
        ctx.beginPath();
        ctx.arc(0, 0, currentSize * 0.35, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case EnemyType.DRONE: {
        // Angular drone with V-shaped wing stabilizers and lateral side indicators (Section 2.3)
        const velAngle = Math.atan2(enemy.vy, enemy.vx) + Math.PI / 2;
        ctx.rotate(velAngle);

        const chargePulse = (enemy.shootCooldown !== undefined && enemy.shootCooldown <= 35 && enemy.shootCooldown > 0)
          ? (35 - enemy.shootCooldown) * 0.18
          : 0;

        // Dark stabilizers/wings (azul oscuro / negro)
        ctx.fillStyle = "#020617";
        ctx.beginPath();
        ctx.moveTo(0, -enemy.size * 1.1);
        ctx.lineTo(enemy.size * 1.5, enemy.size * 1.1);
        ctx.lineTo(0, enemy.size * 0.45);
        ctx.lineTo(-enemy.size * 1.5, enemy.size * 1.1);
        ctx.closePath();
        ctx.fill();

        // Main angular body shield (violeta)
        ctx.fillStyle = "#6d28d9";
        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -enemy.size * 1.25);
        ctx.lineTo(enemy.size * 0.85, enemy.size * 0.65);
        ctx.lineTo(-enemy.size * 0.85, enemy.size * 0.65);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Lateral indicator bulb lights
        ctx.fillStyle = "#06b6d4";
        ctx.beginPath();
        ctx.arc(enemy.size * 0.75, enemy.size * 0.35, 2.0, 0, Math.PI * 2);
        ctx.arc(-enemy.size * 0.75, enemy.size * 0.35, 2.0, 0, Math.PI * 2);
        ctx.fill();

        // Violet central glowing core (increases as weapon charges)
        ctx.fillStyle = "#d8b4fe";
        ctx.shadowColor = "#c084fc";
        ctx.shadowBlur = 6 + chargePulse * 3;
        ctx.beginPath();
        ctx.arc(0, 0, enemy.size * (0.35 + chargePulse * 0.1), 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case EnemyType.SPLITTER: {
        // Dual loded bacteria structure with dividing orange light lines (Section 2.4)
        ctx.fillStyle = "#991b1b"; // rojo oscuro
        ctx.beginPath();
        ctx.arc(-enemy.size * 0.45, 0, enemy.size * 0.75, 0, Math.PI * 2);
        ctx.arc(enemy.size * 0.45, 0, enemy.size * 0.75, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ea580c"; // naranja corrupto
        ctx.beginPath();
        ctx.arc(-enemy.size * 0.45, 0, enemy.size * 0.35, 0, Math.PI * 2);
        ctx.arc(enemy.size * 0.45, 0, enemy.size * 0.35, 0, Math.PI * 2);
        ctx.fill();

        // Split center brilliant line
        ctx.strokeStyle = "#f97316"; // glowing bright orange line
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(0, -enemy.size);
        ctx.lineTo(0, enemy.size);
        ctx.stroke();
        break;
      }

      case EnemyType.DISRUPTOR: {
        // Concentric antenna disruptor core (Section 2.5)
        const rot = time * 0.0035;
        ctx.rotate(rot);

        // Cyan/Purple rings
        ctx.strokeStyle = "#0891b2"; // cian corrupto
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, enemy.size * 1.35, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = "#701a75"; // púrpura
        ctx.beginPath();
        ctx.arc(0, 0, enemy.size * 1.75, 0, Math.PI * 2);
        ctx.stroke();

        // Four extending antennas with glowing bulbtips
        ctx.strokeStyle = "#06b6d4";
        ctx.lineWidth = 1.8;
        for (let i = 0; i < 4; i++) {
          const antAngle = (i * Math.PI) / 2;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(antAngle) * (enemy.size * 2.15), Math.sin(antAngle) * (enemy.size * 2.15));
          ctx.stroke();

          ctx.fillStyle = "#a855f7";
          ctx.beginPath();
          ctx.arc(Math.cos(antAngle) * (enemy.size * 2.15), Math.sin(antAngle) * (enemy.size * 2.15), 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Main body hexagonal core
        ctx.fillStyle = "#0891b2";
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          ctx.lineTo(Math.cos(angle) * enemy.size, Math.sin(angle) * enemy.size);
        }
        ctx.closePath();
        ctx.fill();
        break;
      }

      case EnemyType.BLACKOUT_ELITE: {
        // Triangular acorazado with front protective shields and back exposed engine (Section 2.6)
        const velAngle = Math.atan2(enemy.vy || 1, enemy.vx || 0);
        ctx.rotate(velAngle + Math.PI / 2); // Face relative to travel

        // Main body armor triangular profile
        ctx.fillStyle = "#030712"; // negro
        ctx.strokeStyle = "#8b5cf6"; // borde violeta
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(0, -enemy.size * 1.25); // Tip
        ctx.lineTo(enemy.size, enemy.size);
        ctx.lineTo(-enemy.size, enemy.size);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Front shield plates
        ctx.fillStyle = "#374151"; // heavy steel plates
        ctx.beginPath();
        ctx.moveTo(0, -enemy.size * 1.25);
        ctx.lineTo(enemy.size * 1.2, -enemy.size * 0.2);
        ctx.lineTo(enemy.size * 0.7, enemy.size * 0.25);
        ctx.lineTo(0, -enemy.size * 0.5);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(0, -enemy.size * 1.25);
        ctx.lineTo(-enemy.size * 1.2, -enemy.size * 0.2);
        ctx.lineTo(-enemy.size * 0.7, enemy.size * 0.25);
        ctx.lineTo(0, -enemy.size * 0.5);
        ctx.closePath();
        ctx.fill();

        // Exposed rear core engine
        ctx.fillStyle = "#ef4444"; // rojo intenso
        ctx.shadowColor = "#f43f5e";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(0, enemy.size * 0.65, enemy.size * 0.35, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case EnemyType.BOSS_DEVOURER: {
        // GIANT BOSS: BLACKOUT DEVOURER
        ctx.rotate(time * 0.0008);
        
        // Main mass
        ctx.fillStyle = "#1e1b4b"; // Deep violet core
        ctx.strokeStyle = enemy.color; // Rose bright boundaries
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, enemy.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // 6 segmented orbiting dark plasma wings
        ctx.fillStyle = enemy.color;
        for (let i = 0; i < 6; i++) {
          const wingAngle = (i * Math.PI) / 3 + time * 0.002;
          const wx = Math.cos(wingAngle) * (enemy.size * 1.3);
          const wy = Math.sin(wingAngle) * (enemy.size * 1.3);
          ctx.beginPath();
          ctx.arc(wx, wy, 10 + Math.sin(time * 0.005 + i) * 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Central hyper giant evil glowing pupil eye
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(0, 0, enemy.size * 0.45, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#f43f5e"; // bright rose pupil
        ctx.beginPath();
        ctx.arc(Math.sin(time * 0.003) * 3, Math.cos(time * 0.003) * 3, enemy.size * 0.25, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
    }

    // HEALTH BAR OVERLAY (Only show if damaged)
    if (enemy.health < enemy.maxHealth) {
      const barW = enemy.size * 1.8;
      const barH = 3;
      const pct = Math.max(0, enemy.health / enemy.maxHealth);
      
      ctx.save();
      ctx.translate(0, -enemy.size - 8);
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(-barW / 2, 0, barW, barH);
      
      ctx.fillStyle = enemy.isBoss ? "#f43f5e" : "#ef4444";
      ctx.fillRect(-barW / 2, 0, barW * pct, barH);
      ctx.restore();
    }

    ctx.restore();
  });
}

/**
 * Draws all projectiles.
 */
export function drawProjectilesList(
  ctx: CanvasRenderingContext2D,
  projectiles: Projectile[]
) {
  projectiles.forEach((proj) => {
    ctx.save();
    ctx.translate(proj.x, proj.y);

    ctx.shadowBlur = proj.size * 1.5;
    ctx.shadowColor = proj.color;
    ctx.fillStyle = proj.color;

    if (proj.fromPlayer) {
      // Elegant thin laser lines oriented in travel vector direction
      const angle = Math.atan2(proj.vy, proj.vx);
      ctx.rotate(angle);
      ctx.fillRect(-8, -1, 16, proj.size);
    } else {
      // Enemy plasma sphere circles
      ctx.beginPath();
      ctx.arc(0, 0, proj.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  });
}
export default EnergySwarmCanvas;
