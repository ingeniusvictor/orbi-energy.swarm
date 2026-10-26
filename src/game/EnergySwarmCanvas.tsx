import React from "react";
import { getEvo8WingCount } from "./orbiEvolution";
import { prewarmEvo8Lot1Sprites, disposeEvo8Lot1Sprites, drawEvo8Lot1Sprite } from "./evo8PremiumSprite";
import { prewarmPremiumEnemySprites, disposePremiumEnemySprites, drawPremiumEnemyBody } from "./premiumEnemySprites";
import { 
  OrbiMember, Enemy, Projectile, Resource, BiomeType, 
  FormationType, EnemyType, OrbiType, QualityPreset
} from "./types";
import { getCanvasBackingStoreSize } from "./canvasResolution";
import { projectLiveSiegeVolleyTelegraph } from "./liveSiegeVolleyIntegration";
import { projectLiveCommandCorePresentation } from "./liveCommandCorePresentation";
import {
  projectFlashAccessibility,
  type FlashAccessibilityProfile,
  type FlashIntensityMode,
} from "./flashAccessibility";
import { getActiveLanguage } from "../i18n";
import {
  drawFotonTacticalAvatar,
} from "./fotonTacticalRenderer";
import {
  disposeFotonGameplay3D,
  FOTON_GAMEPLAY_COMPOSITE_SIZE,
  getFotonGameplay3DFrame,
  prewarmFotonGameplay3D,
  reportFotonGameplay3DCompositionFailure,
} from "./fotonGameplay3DRenderer";

interface EnergySwarmCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  logicalWidth: number;
  logicalHeight: number;
  isPaused: boolean;
  activeBiome: BiomeType;
  activeFormation: FormationType;
  playerPos: { x: number; y: number };
  playerFlash: number; // Ticks of invuln flash
  flashIntensity: FlashIntensityMode;
  cameraOffset: { x: number; y: number };
  drawNebula: boolean;
  drawPlanets: boolean;
  maxDpr: number;
  qualityPreset: QualityPreset;
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
  logicalWidth,
  logicalHeight,
  isPaused,
  playerFlash,
  flashIntensity,
  maxDpr,
  qualityPreset,
  onPointerMove,
  onPointerDown,
  onPointerUp
}) => {
  const flashProfile =
    projectFlashAccessibility(flashIntensity);

  React.useEffect(() => {
    const syncBackingStore = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const { dpr, width, height } = getCanvasBackingStoreSize(
        logicalWidth,
        logicalHeight,
        window.devicePixelRatio,
        maxDpr,
      );

      if (canvas.width !== width) canvas.width = width;
      if (canvas.height !== height) canvas.height = height;
      canvas.dataset.logicalWidth = String(logicalWidth);
      canvas.dataset.logicalHeight = String(logicalHeight);
      canvas.dataset.pixelRatio = String(dpr);
    };

    syncBackingStore();
    window.addEventListener("resize", syncBackingStore);
    window.visualViewport?.addEventListener("resize", syncBackingStore);

    return () => {
      window.removeEventListener("resize", syncBackingStore);
      window.visualViewport?.removeEventListener("resize", syncBackingStore);
    };
  }, [canvasRef, maxDpr, logicalWidth, logicalHeight]);

  React.useEffect(() => {
    prewarmFotonGameplay3D(qualityPreset);
    prewarmEvo8Lot1Sprites(import.meta.env.BASE_URL);
    prewarmPremiumEnemySprites(import.meta.env.BASE_URL);
    return () => {
      disposePremiumEnemySprites();
      disposeEvo8Lot1Sprites();
      disposeFotonGameplay3D();
    };
  }, [qualityPreset]);

  // We perform drawing logic directly using requestAnimationFrame inside parent,
  // but let's provide a robust, responsive Canvas frame wrapper with CSS constraints.
  return (
    <div className="orbi-game-stage relative w-full bg-slate-950 border border-slate-900 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center">
      <canvas
        id="game-canvas"
        ref={canvasRef}
        width={logicalWidth}
        height={logicalHeight}
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
      {playerFlash > 0 &&
        (!flashProfile.screenOverlayFlickers ||
          playerFlash % 4 < 2) && (
          <div
            className="absolute inset-0 border-4 border-red-600/30 bg-red-600/5 pointer-events-none animate-fadeIn"
            style={{
              opacity:
                flashProfile.screenOverlayOpacity,
            }}
            data-flash-intensity={flashProfile.mode}
          />
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
  hasGoldenCore: boolean = false,
  flashProfile: FlashAccessibilityProfile =
    projectFlashAccessibility("FULL"),
  shieldRatio: number = 1,
  qualityPreset: QualityPreset = QualityPreset.HIGH,
  isPaused: boolean = false,
  threatDirection: { x: number; y: number } = { x: 0, y: 0 },
  orbiCount: number = 0,
  movementBankRadians: number = 0,
) {
  // Historical FULL mode preserves the original invincibility flicker.
  if (
    flashProfile.fotonFullFlicker &&
    playerFlash > 0 &&
    Math.floor(playerFlash / 3) % 2 === 0
  ) {
    return;
  }

  const { x, y } = playerPos;

  const damageHighlightStrength =
    playerFlash > 0
      ? flashProfile.friendlyWhiteFlashStrength *
        Math.max(
          0,
          Math.min(1, playerFlash / 60),
        )
      : 0;

  const glbFrame = getFotonGameplay3DFrame({
    nowMs: time,
    qualityPreset,
    paused: isPaused,
    threatDirectionX: threatDirection.x,
    threatDirectionY: threatDirection.y,
    orbiCount,
    shieldRatio,
    goldenCoreActive: hasGoldenCore,
  });

  if (glbFrame) {
    ctx.save();
    try {

    // The simple 2D integrity ring is intentionally replaced by the detached
    // 3D Dyson halo. The larger transparent composite keeps the GLB body at
    // its 37.5px visual footprint while giving the orbital rings room.
    const half =
      FOTON_GAMEPLAY_COMPOSITE_SIZE / 2;
    ctx.translate(x,y);
    ctx.rotate(Math.max(-.16,Math.min(.16,movementBankRadians)));
    ctx.drawImage(
      glbFrame,
      -half,
      -half,
      FOTON_GAMEPLAY_COMPOSITE_SIZE,
      FOTON_GAMEPLAY_COMPOSITE_SIZE,
    );

    if (damageHighlightStrength > 0) {
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha =
        damageHighlightStrength * 0.28;
      ctx.drawImage(
        glbFrame,
        -half,
        -half,
        FOTON_GAMEPLAY_COMPOSITE_SIZE,
        FOTON_GAMEPLAY_COMPOSITE_SIZE,
      );
    }

    ctx.restore();
    return;
    } catch (error) {
      ctx.restore();
      reportFotonGameplay3DCompositionFailure(error);
      // Continue into the already-certified 2D tactical avatar below.
    }
  }

  // Loading/failure fallback only. Golden Core keeps its historical external
  // ring here because the normal GLB path integrates the reward into the first
  // cyan Dyson rail and must never render a second standalone gameplay orbit.
  if (hasGoldenCore) {
    ctx.save();
    ctx.strokeStyle = "rgba(251, 191, 36, 0.88)";
    ctx.lineWidth = 1.8;
    ctx.shadowColor = "#f59e0b";
    ctx.shadowBlur =
      12 + Math.sin(time * 0.006) * 4;
    ctx.beginPath();
    ctx.arc(
      x,
      y,
      23 + Math.sin(time * 0.005) * 1.2,
      0,
      Math.PI * 2,
    );
    ctx.stroke();
    ctx.restore();
  }

  drawFotonTacticalAvatar(ctx, {
    x,
    y,
    time,
    pointerX: pointerPos.x,
    pointerY: pointerPos.y,
    shieldRatio,
    damageHighlightStrength,
    movementBankRadians,
  });
}

/**
 * Draws active swarm members.
 */
export function drawSwarmRoster(
  ctx: CanvasRenderingContext2D,
  swarm: OrbiMember[],
  time: number,
  flashProfile: FlashAccessibilityProfile =
    projectFlashAccessibility("FULL"),
) {
  const drawSingleMember = (member: OrbiMember, idx: number) => {
    // LOD Thresholds
    const isNear = idx < 12;
    const isMid = idx >= 12 && idx < 36;
    const isFar = idx >= 36;
    const isGaia = member.energyId === "GAIA";

    ctx.save();

    // 1. LOD FAR: Highly optimized simple circle, reduced glow, no animations, no recoil
    if (isFar) {
      ctx.fillStyle = member.color;
      ctx.shadowBlur = 2.0;
      ctx.shadowColor = member.color;
      ctx.beginPath();
      ctx.arc(member.x, member.y, Math.min(12.5, member.size), 0, Math.PI * 2);
      ctx.fill();
      if (isGaia) {
        ctx.strokeStyle = "rgba(190, 242, 100, 0.85)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(
          member.x,
          member.y,
          member.size * 1.65,
          0,
          Math.PI * 2,
        );
        ctx.stroke();
      }
      ctx.restore();
      return;
    }

    // Apply physical shooting recoil (simplified for Mid, full for Near)
    const rx = member.recoilX || 0;
    const ry = member.recoilY || 0;
    const recoilMod = isNear ? 1.0 : 0.5;
    ctx.translate(member.x + rx * recoilMod, member.y + ry * recoilMod);

    // EV-F07: one cached, transparent E8 sprite at ≤28 world units.
    // Loading/error/non-E8/fusions keep the original Canvas2D member, unchanged.
    // No new entity, collision box, attack effect or game progression mutation.
    if (drawEvo8Lot1Sprite(ctx, member, flashProfile.friendlyWhiteFlashStrength,
      member.flashTicks ?? 0)) {
      ctx.restore();
      return;
    }

    // Orbiting/pulsing size modulation
    let localPulse = isNear ? Math.sin(time * 0.005 + idx * 0.5) * 1.5 : 0;
    if (member.type === OrbiType.SOLAR_GUARDIAN) {
      localPulse *= 0.5; // Scale pulse down for Solar Guardian to maintain proportion
    }
    // ENERGY's rendered body is 37.5px across; all solid follower geometry
    // remains inside 28px (75%), even when a fusion's legacy collision size
    // is greater. Halos may extend beyond this visual silhouette.
    const r = Math.min(12.5, member.size + localPulse);

    // Apply shoot flashing. FULL preserves the historical white-body flash;
    // REDUCED keeps the member color and limits the white highlight to glow.
    const isFlashing =
      Boolean(member.flashTicks && member.flashTicks > 0);
    if (
      isFlashing &&
      flashProfile.friendlyWhiteFlashStrength >= 1
    ) {
      ctx.shadowBlur =
        member.size * (isNear ? 3.0 : 2.0);
      ctx.shadowColor = "#ffffff";
      ctx.fillStyle = "#ffffff";
    } else {
      const reducedFlashStrength = isFlashing
        ? flashProfile.friendlyWhiteFlashStrength
        : 0;
      ctx.shadowBlur =
        member.size *
        (isNear ? 2.0 : 1.0) *
        (1 + reducedFlashStrength * 0.2);
      ctx.shadowColor =
        reducedFlashStrength > 0
          ? `rgba(255,255,255,${reducedFlashStrength})`
          : member.color;
      ctx.fillStyle = member.color;
    }

    // E6/E7/E8 append exactly 2/4/6 compact energy-colored wings to the
    // existing E5 body, so no extra full-body sprite is required. All tips
    // stay within ENERGY's 75% solid-silhouette size budget.
    const wingCount = getEvo8WingCount(member.level);
    if (wingCount > 0) {
      ctx.save();
      ctx.fillStyle = member.color;
      ctx.strokeStyle = "rgba(244, 253, 255, 0.94)";
      ctx.lineWidth = 1.05;
      for (let wing = 0; wing < wingCount; wing += 1) {
        const angle = (wing / wingCount) * Math.PI * 2 - Math.PI / 2;
        const rootRadius = r * 0.67;
        const tipRadius = 14;
        const spread = wingCount === 2 ? 0.45 : wingCount === 4 ? 0.32 : 0.25;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle - spread) * rootRadius,
          Math.sin(angle - spread) * rootRadius);
        ctx.lineTo(Math.cos(angle) * tipRadius, Math.sin(angle) * tipRadius);
        ctx.lineTo(Math.cos(angle + spread) * rootRadius,
          Math.sin(angle + spread) * rootRadius);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
    }

    // Core body fill
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // GAIA synthesis identity: three cheap Canvas2D orbital planes.
    // This stays in the existing follower pass: no new WebGL scene or entity.
    if (isGaia) {
      const gaiaRotation = time * 0.0018;
      const gaiaAlpha =
        0.6 + Math.sin(time * 0.004) * 0.12;
      ctx.save();
      ctx.globalAlpha = gaiaAlpha;
      ctx.shadowBlur = isNear ? 8 : 4;
      ctx.shadowColor = member.color;
      for (let plane = 0; plane < 3; plane += 1) {
        ctx.save();
        ctx.rotate(
          gaiaRotation + (plane * Math.PI) / 3,
        );
        ctx.strokeStyle =
          plane === 1 ? "#ffffff" : member.color;
        ctx.lineWidth = isNear ? 1.15 : 0.75;
        ctx.beginPath();
        ctx.ellipse(
          0,
          0,
          r * 1.9,
          r * 0.72,
          plane * 0.42,
          0,
          Math.PI * 2,
        );
        ctx.stroke();
        ctx.restore();
      }
      ctx.restore();
    }

    // 2. LOD MID: lightweight silhouettes, but never hide an E8's six wings
    // solely because its roster index exceeds 11. E6 and E7 retain their
    // 2/4 wings; geometry remains inside the 14-unit solid-tip ceiling.
    if (isMid) {
      const midWings = getEvo8WingCount(member.level);
      if (midWings > 0) {
        ctx.save();
        ctx.shadowBlur = 0;
        ctx.fillStyle = member.color;
        ctx.strokeStyle = "rgba(242, 253, 255, 0.9)";
        ctx.lineWidth = 0.75;
        for (let wing = 0; wing < midWings; wing += 1) {
          const angle = wing * Math.PI * 2 / midWings - Math.PI / 2;
          const spread = midWings === 2 ? 0.45 : midWings === 4 ? 0.32 : 0.25;
          ctx.beginPath();
          ctx.moveTo(Math.cos(angle - spread) * r * 0.67,
            Math.sin(angle - spread) * r * 0.67);
          ctx.lineTo(Math.cos(angle) * 14, Math.sin(angle) * 14);
          ctx.lineTo(Math.cos(angle + spread) * r * 0.67,
            Math.sin(angle + spread) * r * 0.67);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
        ctx.restore();
      }
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
    if (member.energyId === "FOTON") {
      // Solar FOTON is a collectible green photovoltaic ORBI, not the
      // neutral ENERGY leader. Its panel remains identifiable at small LOD
      // without extra textures or an independent WebGL draw pass.
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(3, 42, 20, 0.94)";
      ctx.fillRect(-r * 0.59, -r * 0.43, r * 1.18, r * 0.86);
      ctx.strokeStyle = "#e4ffc4";
      ctx.lineWidth = Math.max(0.65, r * 0.10);
      ctx.strokeRect(-r * 0.59, -r * 0.43, r * 1.18, r * 0.86);
      ctx.beginPath();
      ctx.moveTo(-r * 0.2, -r * 0.43);
      ctx.lineTo(-r * 0.2, r * 0.43);
      ctx.moveTo(r * 0.2, -r * 0.43);
      ctx.lineTo(r * 0.2, r * 0.43);
      ctx.moveTo(-r * 0.59, 0);
      ctx.lineTo(r * 0.59, 0);
      ctx.stroke();
    } else {
      // Historical eyes remain unchanged on all other companion energies.
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(r * 0.4, -r * 0.3, r * 0.25, 0, Math.PI * 2);
      ctx.arc(r * 0.4, r * 0.3, r * 0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(r * 0.55, -r * 0.3, r * 0.12, 0, Math.PI * 2);
      ctx.arc(r * 0.55, r * 0.3, r * 0.12, 0, Math.PI * 2);
      ctx.fill();
    }
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
      const satelliteSolidRadius =
        member.type === OrbiType.SOLAR_GUARDIAN ? 1.25 : 2.5;
      const satelliteOrbitRadius = Math.min(r * 1.8, 14 - satelliteSolidRadius);
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(
        Math.cos(wingA) * satelliteOrbitRadius,
        Math.sin(wingA) * satelliteOrbitRadius,
        satelliteSolidRadius,
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
  // 1. Draw normal followers first.
  swarm.forEach((member, idx) => {
    const isPriorityUnit =
      member.type === OrbiType.SOLAR_GUARDIAN ||
      member.type === OrbiType.HYDRO_LEVIATHAN ||
      member.energyId === "GAIA";
    if (isPriorityUnit) return;
    drawSingleMember(member, idx);
  });

  // 2. Draw advanced fusion units and unique GAIA on top.
  swarm.forEach((member, idx) => {
    const isPriorityUnit =
      member.type === OrbiType.SOLAR_GUARDIAN ||
      member.type === OrbiType.HYDRO_LEVIATHAN ||
      member.energyId === "GAIA";
    if (!isPriorityUnit) return;
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
      const coreColor = res.color;

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
        const dx = playerPos
          ? res.x - playerPos.x
          : Number.POSITIVE_INFINITY;
        const dy = playerPos
          ? res.y - playerPos.y
          : Number.POSITIVE_INFINITY;
        const distanceSquared =
          dx * dx + dy * dy;
        const ageMs = res.spawnTime
          ? Date.now() - res.spawnTime
          : 0;
        
        const droppedVisible = ageMs < 2000;
        const closeVisible =
          distanceSquared < 120 * 120;

        if (droppedVisible || closeVisible) {
          drawLabelText = true;
          if (droppedVisible && !closeVisible) {
            if (ageMs > 1500) {
              labelOpacity =
                1.0 - (ageMs - 1500) / 500;
            }
          } else if (closeVisible) {
            const distance =
              Math.sqrt(distanceSquared);
            labelOpacity = Math.min(
              1.0,
              (120 - distance) / 40,
            );
          }
        }
      }

      if (drawLabelText && labelOpacity > 0.05) {
        const lang = getActiveLanguage();
        const identity = res.orbiEnergyId ?? affinity.toUpperCase();
        const displayLabel =
          lang === "es"
            ? identity + " SALVAJE"
            : "WILD " + identity;
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
 * Draws Crawlers, Parasites, Drones, ASTERIA exclusives, and Boss.
 */
const SPAN_WARDEN_SHOT_ANGLE=0.56;
export function drawEnemiesList(
  ctx: CanvasRenderingContext2D,
  enemies: Enemy[],
  time: number,
  playerPos: { x: number; y: number },
  flashProfile: FlashAccessibilityProfile =
    projectFlashAccessibility("FULL"),
) {
  enemies.forEach((enemy) => {
    if (enemy.isDead) return;

    ctx.save();
    ctx.translate(enemy.x, enemy.y);

    if (enemy.milestoneKind === "MINIBOSS") {
      const milestonePulse =
        2 + Math.sin(time * 0.008) * 2;
      ctx.save();
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#fbbf24";
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(
        0,
        0,
        enemy.size * 1.7 + milestonePulse,
        0,
        Math.PI * 2,
      );
      ctx.stroke();

      ctx.fillStyle = "#fde68a";
      ctx.font = "bold 7px monospace";
      ctx.textAlign = "center";
      ctx.fillText(
        "BLACKOUT WARDEN",
        0,
        -enemy.size * 1.75,
      );
      ctx.restore();
    }

    if (enemy.evolvedVariantId) {
      const evolvedPulse =
        1.5 + Math.sin(time * 0.01 + enemy.x * 0.01) * 1.5;
      ctx.save();
      ctx.strokeStyle = "#22d3ee";
      ctx.lineWidth = 1.25;
      ctx.shadowColor = "#22d3ee";
      ctx.shadowBlur = 10;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(
        0,
        0,
        enemy.size * 1.45 + evolvedPulse,
        0,
        Math.PI * 2,
      );
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(165, 243, 252, 0.92)";
      ctx.font = "bold 6px monospace";
      ctx.textAlign = "center";
      ctx.fillText(
        enemy.evolvedVariantId.replace(/_/g, " "),
        0,
        -enemy.size * 1.65,
      );
      ctx.restore();
    }

    // Apply hit flash. FULL preserves the historical full-white replacement
    // and early return. REDUCED draws only a bounded highlight so telegraphs
    // and the enemy silhouette remain visible.
    if (
      enemy.flashTicks > 0 &&
      flashProfile.enemyWhiteFlashStrength >= 1
    ) {
      ctx.shadowBlur = enemy.size * 2.5;
      ctx.shadowColor = "#ffffff";
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(0, 0, enemy.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    if (
      enemy.flashTicks > 0 &&
      flashProfile.enemyWhiteFlashStrength > 0
    ) {
      ctx.save();
      ctx.globalAlpha =
        flashProfile.enemyWhiteFlashStrength;
      ctx.shadowBlur = enemy.size * 1.2;
      ctx.shadowColor = "#ffffff";
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(
        0,
        0,
        enemy.size * 1.08,
        0,
        Math.PI * 2,
      );
      ctx.stroke();
      ctx.restore();
    }

    // DRAW WEAPONS CHARGING TELEGRAPHS (drawn behind the enemy body)
    const siegeVolleyProjection =
      enemy.type === EnemyType.SIEGE_PRISM &&
      enemy.siegeVolleyTelegraph
        ? projectLiveSiegeVolleyTelegraph(
            enemy.siegeVolleyTelegraph,
          )
        : null;

    if (
      enemy.type === EnemyType.SIEGE_PRISM &&
      siegeVolleyProjection &&
      (siegeVolleyProjection.telegraphActive ||
        siegeVolleyProjection.commitReady) &&
      siegeVolleyProjection.targetX !== null &&
      siegeVolleyProjection.targetY !== null
    ) {
      const targetDx =
        siegeVolleyProjection.targetX - enemy.x;
      const targetDy =
        siegeVolleyProjection.targetY - enemy.y;
      const targetPulse =
        1 + Math.sin(time * 0.018) * 0.12;

      ctx.save();
      ctx.strokeStyle = siegeVolleyProjection.commitReady
        ? "rgba(244, 114, 182, 0.95)"
        : "rgba(244, 114, 182, 0.68)";
      ctx.lineWidth = siegeVolleyProjection.commitReady ? 2.2 : 1.5;
      ctx.setLineDash([7, 5]);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(targetDx, targetDy);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.strokeStyle = "rgba(103, 232, 249, 0.9)";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(
        targetDx,
        targetDy,
        16 * targetPulse,
        0,
        Math.PI * 2,
      );
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(targetDx - 22, targetDy);
      ctx.lineTo(targetDx + 22, targetDy);
      ctx.moveTo(targetDx, targetDy - 22);
      ctx.lineTo(targetDx, targetDy + 22);
      ctx.stroke();

      ctx.strokeStyle = "rgba(244, 114, 182, 0.95)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(
        0,
        0,
        enemy.size * 1.65,
        -Math.PI / 2,
        -Math.PI / 2 +
          Math.PI * 2 * siegeVolleyProjection.progress,
      );
      ctx.stroke();

      ctx.fillStyle = "rgba(253, 242, 248, 0.96)";
      ctx.font = "bold 7px monospace";
      ctx.textAlign = "center";
      ctx.fillText(
        "SIEGE VOLLEY",
        targetDx,
        targetDy - 28,
      );
      ctx.restore();
    } else if(enemy.type===EnemyType.SPAN_WARDEN&&enemy.spanWardenAttack){
      const a=enemy.spanWardenAttack;
      const angle=Math.atan2(a.facingY,a.facingX);
      if(a.phase==="WINDUP"||a.phase==="STRIKE"){
        ctx.save();ctx.setLineDash(a.phase==="WINDUP"?[10,7]:[]);
        ctx.strokeStyle=a.phase==="WINDUP"?"rgba(253,230,138,.85)":"rgba(103,232,249,.75)";
        ctx.lineWidth=a.phase==="WINDUP"?2.1:3;
        ctx.shadowColor="#facc15";ctx.shadowBlur=7;
        for(const lateral of [-SPAN_WARDEN_SHOT_ANGLE,SPAN_WARDEN_SHOT_ANGLE]){
          const ray=angle+lateral;
          ctx.beginPath();ctx.moveTo(0,0);
          ctx.lineTo(Math.cos(ray)*330,Math.sin(ray)*330);ctx.stroke();
        }
        ctx.setLineDash([]);ctx.restore();
      }
      if(a.phase==="EXPOSED"){
        ctx.save();ctx.strokeStyle="#fde68a";ctx.lineWidth=2.2;
        ctx.shadowColor="#facc15";ctx.shadowBlur=10;
        ctx.beginPath();ctx.arc(0,0,enemy.size*1.5+3*Math.sin(time*.012),0,Math.PI*2);
        ctx.stroke();ctx.restore();
      }
    } else if (enemy.type === EnemyType.RAILCUTTER && enemy.railcutterAttack) {
      const {phase,directionX,directionY,remainingMs}=enemy.railcutterAttack;
      if(phase==="AIM"){
        // Player can see and leave this fixed strike lane before collision.
        ctx.save();
        const glow=.58+.22*Math.sin(time*.014);
        ctx.strokeStyle=`rgba(103,232,249,${glow.toFixed(3)})`;
        ctx.lineWidth=2.2;
        ctx.setLineDash([9,6]);
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(directionX*230,directionY*230);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.strokeStyle="#fef08a";
        ctx.lineWidth=1.7;
        ctx.beginPath();
        ctx.arc(directionX*230,directionY*230,7+(remainingMs/850)*3,
          0,Math.PI*2);
        ctx.stroke();
        ctx.restore();
      }else if(phase==="CHARGE"){
        ctx.save();
        ctx.strokeStyle="rgba(34,211,238,.7)";
        ctx.lineWidth=3.5;
        ctx.beginPath();
        ctx.moveTo(-directionX*13,-directionY*13);
        ctx.lineTo(-directionX*52,-directionY*52);
        ctx.stroke();
        ctx.restore();
      }
    } else if(enemy.type===EnemyType.SKY_SPECTER && enemy.skySpecterAttack){
      const a=enemy.skySpecterAttack;
      if(a.phase==="LOCK"){
        ctx.save();
        ctx.strokeStyle="rgba(165,180,252,.83)";
        ctx.shadowColor="#a5b4fc";
        ctx.shadowBlur=10;
        ctx.lineWidth=2;
        ctx.setLineDash([7,5]);
        ctx.beginPath();ctx.moveTo(0,0);
        ctx.lineTo(a.dirX*260,a.dirY*260);ctx.stroke();
        ctx.setLineDash([]);
        ctx.strokeStyle="#e0e7ff";
        ctx.beginPath();ctx.arc(0,0,enemy.size*1.6+
          (a.remainingMs/780)*6,0,Math.PI*2);ctx.stroke();
        ctx.restore();
      }else if(a.phase==="DIVE"){
        ctx.save();ctx.strokeStyle="rgba(196,181,253,.67)";
        ctx.lineWidth=3.4;ctx.beginPath();
        ctx.moveTo(-a.dirX*enemy.size,-a.dirY*enemy.size);
        ctx.lineTo(-a.dirX*63,-a.dirY*63);ctx.stroke();ctx.restore();
      }
    } else if(enemy.type===EnemyType.BEACON_PRISM && enemy.beaconPrismAttack){
      const a=enemy.beaconPrismAttack;
      if(a.phase==="MARK"){
        const angle=Math.atan2(a.targetY-enemy.y,a.targetX-enemy.x);
        ctx.save();
        ctx.strokeStyle="rgba(253,230,138,.68)";
        ctx.lineWidth=1.7;ctx.setLineDash([9,6]);
        for(const spread of [-.24,0,.24]){
          const theta=angle+spread;
          ctx.beginPath();ctx.moveTo(0,0);
          ctx.lineTo(Math.cos(theta)*350,Math.sin(theta)*350);
          ctx.stroke();
        }
        ctx.setLineDash([]);
        ctx.shadowColor="#fde68a";ctx.shadowBlur=8;
        ctx.strokeStyle="#fef08a";ctx.lineWidth=2;
        ctx.beginPath();ctx.arc(0,0,enemy.size*1.6+
          5*Math.sin(time*.012),0,Math.PI*2);ctx.stroke();
        ctx.restore();
      }
    } else if(enemy.type===EnemyType.ION_SAIL && enemy.ionSailAttack){
      const a=enemy.ionSailAttack;
      if(a.phase==="WARN"||a.phase==="SWEEP"){
        ctx.save();
        ctx.strokeStyle="rgba(94,234,212,.75)";
        ctx.lineWidth=a.phase==="SWEEP"?3:1.8;
        ctx.setLineDash(a.phase==="WARN"?[12,8]:[]);
        ctx.beginPath();ctx.moveTo(0,0);
        ctx.lineTo(a.dirX*240,a.dirY*240);ctx.stroke();
        ctx.restore();
      }
    } else if (enemy.type === EnemyType.DRONE && enemy.shootCooldown !== undefined && enemy.shootCooldown <= 35 && enemy.shootCooldown > 0) {
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
      case EnemyType.SPAN_WARDEN: {
        const a=enemy.spanWardenAttack;
        const s=enemy.size;
        ctx.save();ctx.rotate(Math.atan2(a?.facingY??0,a?.facingX??-1));
        ctx.shadowColor="#22d3ee";ctx.shadowBlur=14;
        // Four distinct jointed arms and bright golden armor attachments.
        for(const side of [-1,1])for(const front of [-1,1]){
          const ax=front*s*.54,ay=side*s*.53;
          ctx.strokeStyle="#94a3b8";ctx.lineWidth=4.4;
          ctx.beginPath();ctx.moveTo(ax,ay);
          ctx.lineTo(front*s*1.22,side*s*1.04);
          ctx.lineTo(front*s*1.52,side*s*.68);ctx.stroke();
          ctx.fillStyle=front===1?"#facc15":"#22d3ee";
          ctx.beginPath();ctx.arc(front*s*1.22,side*s*1.04,3,0,Math.PI*2);ctx.fill();
          ctx.strokeStyle="#67e8f9";ctx.lineWidth=2.1;
          ctx.beginPath();ctx.moveTo(front*s*1.52,side*s*.68);
          ctx.lineTo(front*s*1.7,side*s*.92);ctx.stroke();
        }
        ctx.fillStyle="#10263f";ctx.strokeStyle="#cbd5e1";ctx.lineWidth=2.4;
        ctx.beginPath();ctx.moveTo(s*1.05,0);
        ctx.lineTo(s*.59,-s*.76);ctx.lineTo(-s*.62,-s*.83);
        ctx.lineTo(-s*1.05,0);ctx.lineTo(-s*.62,s*.83);
        ctx.lineTo(s*.59,s*.76);ctx.closePath();ctx.fill();ctx.stroke();
        for(const side of [-1,1]){
          ctx.fillStyle="#1e4866";ctx.strokeStyle="#38bdf8";ctx.lineWidth=1.8;
          ctx.beginPath();ctx.moveTo(-s*.38,side*s*.19);
          ctx.lineTo(s*.58,side*s*.16);ctx.lineTo(s*.3,side*s*.53);
          ctx.lineTo(-s*.42,side*s*.48);ctx.closePath();ctx.fill();ctx.stroke();
        }
        if(a?.phase==="GUARD"||a?.phase==="WINDUP"){
          ctx.strokeStyle="#fde68a";ctx.lineWidth=6;
          ctx.shadowColor="#facc15";ctx.shadowBlur=15;
          ctx.beginPath();ctx.arc(0,0,s*1.33,-Math.PI*.38,Math.PI*.38);ctx.stroke();
          ctx.fillStyle="rgba(253,230,138,.10)";ctx.beginPath();
          ctx.moveTo(0,0);ctx.arc(0,0,s*1.35,-Math.PI*.38,Math.PI*.38);
          ctx.closePath();ctx.fill();
        }
        ctx.shadowColor=a?.phase==="EXPOSED"?"#facc15":"#22d3ee";
        ctx.shadowBlur=a?.phase==="EXPOSED"?22:11;
        ctx.fillStyle=a?.phase==="EXPOSED"?"#fef08a":"#22d3ee";
        ctx.beginPath();ctx.arc(0,0,s*.4,0,Math.PI*2);ctx.fill();
        ctx.fillStyle="#0f172a";ctx.beginPath();ctx.arc(0,0,s*.14,0,Math.PI*2);ctx.fill();
        ctx.restore();break;
      }
      case EnemyType.SKY_SPECTER: {
        const a=enemy.skySpecterAttack;
        const dive=a?.phase==="DIVE";
        const heading=dive?Math.atan2(a.dirY,a.dirX):
          Math.atan2(enemy.vy||0,enemy.vx||-1);
        const q=enemy.size;
        ctx.save();ctx.rotate(heading);
        ctx.shadowBlur=dive?17:11;ctx.shadowColor="#818cf8";
        // Translucent three-wing silhouette, unlike Railcutter's scythes.
        for(const side of [-1,1]){
          ctx.fillStyle="#818cf8";ctx.strokeStyle="#c7d2fe";ctx.lineWidth=1.5;
          ctx.beginPath();ctx.moveTo(q*.9,0);
          ctx.quadraticCurveTo(-q*.4,side*q*.7,-q*.95,side*q*1.65);
          ctx.lineTo(-q*1.15,side*q*.32);ctx.closePath();
          ctx.fill();ctx.stroke();
        }
        ctx.fillStyle="#312e81";ctx.strokeStyle="#e0e7ff";
        ctx.beginPath();ctx.moveTo(q*1.3,0);
        ctx.lineTo(-q*.65,-q*.42);ctx.lineTo(-q*.55,q*.42);
        ctx.closePath();ctx.fill();ctx.stroke();
        ctx.fillStyle=dive?"#fef08a":"#a5f3fc";
        ctx.beginPath();ctx.arc(0,0,q*.25,0,Math.PI*2);ctx.fill();
        ctx.restore();break;
      }
      case EnemyType.BEACON_PRISM: {
        const q=enemy.size;
        ctx.save();ctx.rotate(time*.0005);
        ctx.shadowColor="#facc15";ctx.shadowBlur=13;
        for(let i=0;i<3;i++){
          const a=i*2*Math.PI/3;
          ctx.strokeStyle="#fde68a";ctx.lineWidth=2.4;
          ctx.beginPath();ctx.moveTo(0,0);
          ctx.lineTo(Math.cos(a)*q*1.25,Math.sin(a)*q*1.25);
          ctx.stroke();
          ctx.fillStyle="#eab308";ctx.beginPath();
          ctx.arc(Math.cos(a)*q*1.25,Math.sin(a)*q*1.25,3,0,Math.PI*2);
          ctx.fill();
        }
        ctx.fillStyle="#172554";ctx.strokeStyle="#fde68a";ctx.lineWidth=2;
        ctx.beginPath();
        for(let k=0;k<3;k++){
          const a=-Math.PI/2+k*2*Math.PI/3;
          const x=Math.cos(a)*q,y=Math.sin(a)*q;
          if(k===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
        }
        ctx.closePath();ctx.fill();ctx.stroke();
        ctx.fillStyle=enemy.beaconPrismAttack?.phase==="MARK"?"#fef08a":"#5eead4";
        ctx.beginPath();ctx.arc(0,0,q*.31,0,Math.PI*2);ctx.fill();
        ctx.restore();break;
      }
      case EnemyType.ION_SAIL: {
        const q=enemy.size,a=enemy.ionSailAttack;
        ctx.save();
        ctx.rotate(Math.atan2(a?.dirY??0,a?.dirX??-1));
        ctx.shadowColor="#2dd4bf";ctx.shadowBlur=12;
        for(const side of [-1,1]){
          ctx.strokeStyle="#99f6e4";ctx.lineWidth=1.8;
          ctx.fillStyle="#115e59";
          ctx.beginPath();ctx.moveTo(q*.9,0);
          ctx.quadraticCurveTo(-q*.2,side*q*1.5,-q*1.35,side*q*1.15);
          ctx.lineTo(-q*.55,side*q*.22);ctx.closePath();
          ctx.fill();ctx.stroke();
          ctx.strokeStyle="#5eead4";ctx.beginPath();
          ctx.moveTo(q*.75,0);ctx.lineTo(-q*1.35,side*q*1.15);ctx.stroke();
        }
        ctx.fillStyle="#0f172a";ctx.strokeStyle="#ccfbf1";
        ctx.beginPath();ctx.moveTo(q*1.15,0);
        ctx.lineTo(-q*.4,-q*.35);ctx.lineTo(-q*.4,q*.35);ctx.closePath();
        ctx.fill();ctx.stroke();
        ctx.fillStyle=a?.phase==="SWEEP"?"#fef08a":"#5eead4";
        ctx.beginPath();ctx.arc(0,0,q*.23,0,Math.PI*2);ctx.fill();
        ctx.restore();break;
      }
      case EnemyType.RAILCUTTER: {
        const attack=enemy.railcutterAttack;
        const dirX=attack?.directionX??-1;
        const dirY=attack?.directionY??0;
        ctx.save();
        ctx.rotate(Math.atan2(dirY,dirX));
        const s=enemy.size;
        const vibrating=(attack?.phase==="CHARGE")
          ?1.08+.09*Math.sin(time*.09):1;
        ctx.scale(vibrating,vibrating);
        // Original orbital rail glider: paired cyan scythe blades and
        // armoured arrow chassis, legible against the ASTERIA panorama.
        ctx.shadowColor="#22d3ee";
        ctx.shadowBlur=13;
        ctx.fillStyle="#0c4a6e";
        ctx.strokeStyle="#a5f3fc";
        ctx.lineWidth=1.8;
        ctx.beginPath();
        ctx.moveTo(s*1.5,0);
        ctx.lineTo(s*.12,-s*.52);
        ctx.lineTo(-s*1.1,-s*.4);
        ctx.lineTo(-s*.66,0);
        ctx.lineTo(-s*1.1,s*.4);
        ctx.lineTo(s*.12,s*.52);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        for(const side of [-1,1]){
          ctx.fillStyle="#22d3ee";
          ctx.beginPath();
          ctx.moveTo(s*.8,side*s*.63);
          ctx.lineTo(-s*.18,side*s*1.24);
          ctx.lineTo(-s*1.32,side*s*.72);
          ctx.lineTo(-s*.3,side*s*.82);
          ctx.closePath();
          ctx.fill();
        }
        ctx.fillStyle=attack?.phase==="AIM"?"#fef08a":"#f8fafc";
        ctx.beginPath();
        ctx.arc(s*.32,0,s*.25,0,Math.PI*2);
        ctx.fill();
        ctx.restore();
        break;
      }
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

        // Preserve every old purple/cyan field ring and antenna, and only
        // swap the central hexagon for the graviton asset when decoded.
        if (!drawPremiumEnemyBody(ctx, enemy)) {
        // Main body hexagonal core
        ctx.fillStyle = "#0891b2";
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          ctx.lineTo(Math.cos(angle) * enemy.size, Math.sin(angle) * enemy.size);
        }
        ctx.closePath();
        ctx.fill();
        }
        break;
      }

      case EnemyType.SIEGE_PRISM: {
        const prismRotation = time * 0.0015;
        const volleyProjection = enemy.siegeVolleyTelegraph
          ? projectLiveSiegeVolleyTelegraph(
              enemy.siegeVolleyTelegraph,
            )
          : null;
        const chargeScale =
          volleyProjection?.telegraphActive ||
          volleyProjection?.commitReady
            ? 1.08 +
              Math.sin(time * 0.016) * 0.06
            : 1;

        ctx.save();
        ctx.rotate(prismRotation);
        ctx.scale(chargeScale, chargeScale);
        ctx.shadowColor = "#f472b6";
        ctx.shadowBlur = 14;

        ctx.fillStyle = "#3b1647";
        ctx.strokeStyle = "#f9a8d4";
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(0, -enemy.size * 1.25);
        ctx.lineTo(enemy.size * 0.9, 0);
        ctx.lineTo(0, enemy.size * 1.25);
        ctx.lineTo(-enemy.size * 0.9, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = "#67e8f9";
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(0, -enemy.size * 0.92);
        ctx.lineTo(enemy.size * 0.62, 0);
        ctx.lineTo(0, enemy.size * 0.92);
        ctx.lineTo(-enemy.size * 0.62, 0);
        ctx.closePath();
        ctx.stroke();

        ctx.fillStyle = volleyProjection?.commitReady
          ? "#ffffff"
          : "#f472b6";
        ctx.beginPath();
        ctx.arc(0, 0, enemy.size * 0.26, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        break;
      }

      case EnemyType.BLACKOUT_ELITE: {
        // Triangular acorazado with front protective shields and back exposed engine (Section 2.6)
        const velAngle = Math.atan2(enemy.vy || 1, enemy.vx || 0);
        ctx.rotate(velAngle + Math.PI / 2); // Face relative to travel

        // Premium art replaces the armor only. The old rear reactor,
        // charge warning cone and speed trails stay independent.
        const premiumArmored = drawPremiumEnemyBody(ctx, enemy);
        if (!premiumArmored) {
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
        }

        // Exposed rear core engine: same reactive indicator, but keep the
        // premium armor visible instead of painting a flat dot across it.
        ctx.save();
        ctx.fillStyle = premiumArmored ? "#fb923c" : "#ef4444";
        ctx.shadowColor = "#f43f5e";
        ctx.shadowBlur = premiumArmored ? 5 : 8;
        ctx.beginPath();
        if (premiumArmored) {
          ctx.ellipse(0, enemy.size * 0.82, enemy.size * 0.12,
            enemy.size * 0.22, 0, 0, Math.PI * 2);
        } else {
          ctx.arc(0, enemy.size * 0.65, enemy.size * 0.35, 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.restore();

        // UX14-A: premium armored engine now feels massive and alive.
        // Pure Canvas VFX: never changes health, armor reduction, charge
        // timers, damage or hitboxes. Deliberately omitted for legacy fallback.
        if (premiumArmored) {
          const charging = enemy.chargeTimer !== undefined && enemy.chargeTimer > 0;
          const flicker = 0.73 + Math.sin(time * 0.012 + enemy.x * 0.027) * 0.18;
          const pulse = charging ? 1.22 : 1;
          ctx.save();
          // Two asymmetric retrothrusters extend outside the image rather than
          // covering its gunmetal armor plates.
          for (const side of [-1, 1]) {
            const px = side * enemy.size * 0.52;
            const py = enemy.size * 1.03;
            const length = enemy.size * (charging ? 1.06 : 0.46) * flicker;
            const flame = ctx.createLinearGradient(px, py, px, py + length);
            flame.addColorStop(0, "rgba(255,247,203,.95)");
            flame.addColorStop(.35, charging ? "rgba(255,91,34,.9)" : "rgba(251,146,60,.77)");
            flame.addColorStop(1, "rgba(255,70,16,0)");
            ctx.fillStyle = flame;
            ctx.shadowColor = "#f97316";
            ctx.shadowBlur = charging ? 11 : 5;
            ctx.beginPath();
            ctx.moveTo(px - enemy.size * .12, py);
            ctx.lineTo(px, py + length);
            ctx.lineTo(px + enemy.size * .12, py);
            ctx.closePath();
            ctx.fill();
          }
          // Refractive armored frontal plating: an animated rim, not a new
          // defensive shield. Existing directional resistance remains unchanged.
          ctx.shadowColor = "#f59e0b";
          ctx.shadowBlur = charging ? 12 : 4;
          ctx.strokeStyle = charging ? "rgba(255,204,115,.9)" : "rgba(251,146,60,.52)";
          ctx.lineWidth = charging ? 2.4 : 1.25;
          ctx.beginPath();
          ctx.ellipse(0, -enemy.size * .15, enemy.size * 1.48,
            enemy.size * 1.60, 0, Math.PI * 1.15, Math.PI * 1.86);
          ctx.stroke();
          // Three directional plate light sources, subtle during idle.
          ctx.fillStyle = charging ? "#fff1bd" : "#ffbe72";
          ctx.shadowBlur = 6;
          for (const x of [-.83, 0, .83]) {
            ctx.beginPath();
            ctx.arc(x * enemy.size, -enemy.size * .77,
              enemy.size * (charging ? .095 : .066) * pulse, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
        break;
      }

      case EnemyType.BOSS_WORM: {
        const wormPulse = 0.9 + Math.sin(time * 0.0035) * 0.1;
        ctx.save();
        ctx.rotate(Math.sin(time * 0.0012) * 0.12);
        ctx.shadowColor = "#c084fc";
        ctx.shadowBlur = 20;
        ctx.fillStyle = "#170b2e";
        ctx.strokeStyle = "#c084fc";
        ctx.lineWidth = 2.3;
        ctx.beginPath();
        ctx.moveTo(enemy.size * 1.15, 0);
        ctx.lineTo(enemy.size * 0.22, -enemy.size * 0.8);
        ctx.lineTo(-enemy.size * 0.92, -enemy.size * 0.56);
        ctx.lineTo(-enemy.size * 1.08, 0);
        ctx.lineTo(-enemy.size * 0.92, enemy.size * 0.56);
        ctx.lineTo(enemy.size * 0.22, enemy.size * 0.8);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = `rgba(216,180,254,${wormPulse})`;
        ctx.beginPath();
        ctx.arc(enemy.size * 0.34, 0, enemy.size * 0.28, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "rgba(233,213,255,0.85)";
        ctx.lineWidth = 1.4;
        for (const side of [-1, 1]) {
          ctx.beginPath();
          ctx.moveTo(enemy.size * 0.72, side * enemy.size * 0.18);
          ctx.lineTo(enemy.size * 1.08, side * enemy.size * 0.34);
          ctx.stroke();
        }
        ctx.restore();
        break;
      }

      case EnemyType.BOSS_TITAN: {
        const titanPulse = 0.82 + Math.sin(time * 0.004) * 0.18;
        ctx.save();
        ctx.rotate(Math.sin(time * 0.00045) * 0.05);

        ctx.shadowColor = "#67e8f9";
        ctx.shadowBlur = 22;
        ctx.fillStyle = "#071827";
        ctx.strokeStyle = "#67e8f9";
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(-enemy.size * 1.45, -enemy.size * 0.18);
        ctx.lineTo(-enemy.size * 0.72, -enemy.size * 0.62);
        ctx.lineTo(enemy.size * 0.72, -enemy.size * 0.62);
        ctx.lineTo(enemy.size * 1.45, -enemy.size * 0.18);
        ctx.lineTo(enemy.size * 1.12, enemy.size * 0.52);
        ctx.lineTo(-enemy.size * 1.12, enemy.size * 0.52);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        const ports = [
          [-1.25, 0],
          [0, -0.74],
          [1.25, 0],
          [0, 0.74],
        ] as const;
        ports.forEach(([px, py]) => {
          ctx.fillStyle = "#164e63";
          ctx.strokeStyle = "#a5f3fc";
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.arc(
            px * enemy.size,
            py * enemy.size,
            enemy.size * 0.16,
            0,
            Math.PI * 2,
          );
          ctx.fill();
          ctx.stroke();
        });

        const coreGradient = ctx.createRadialGradient(
          0,
          0,
          0,
          0,
          0,
          enemy.size * 0.46,
        );
        coreGradient.addColorStop(0, `rgba(255,255,255,${titanPulse})`);
        coreGradient.addColorStop(0.3, "rgba(103,232,249,0.95)");
        coreGradient.addColorStop(1, "rgba(8,47,73,0.15)");
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(0, 0, enemy.size * 0.46, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "rgba(165,243,252,0.72)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(
          0,
          0,
          enemy.size * 1.18,
          enemy.size * 0.72,
          0,
          0,
          Math.PI * 2,
        );
        ctx.stroke();
        ctx.restore();
        break;
      }

      case EnemyType.BOSS_DEVOURER: {
        // GIANT BOSS: BLACKOUT DEVOURER
        ctx.rotate(time * 0.0008);
        
        // Swap only the Devourer chassis. Keep six original pulsating
        // satellites + animated hostile pupil (and all boss attack logic).
        const premiumDevourer = drawPremiumEnemyBody(ctx, enemy);
        if (!premiumDevourer) {
        // Main mass
        ctx.fillStyle = "#1e1b4b"; // Deep violet core
        ctx.strokeStyle = enemy.color; // Rose bright boundaries
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, enemy.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        }

        // 6 segmented orbiting dark plasma wings, same orbital logic.
        // New art gets luminous satellite ports rather than flat discs.
        ctx.fillStyle = enemy.color;
        for (let i = 0; i < 6; i++) {
          const wingAngle = (i * Math.PI) / 3 + time * 0.002;
          const wx = Math.cos(wingAngle) * (enemy.size * 1.3);
          const wy = Math.sin(wingAngle) * (enemy.size * 1.3);
          const radius = 10 + Math.sin(time * 0.005 + i) * 3;
          ctx.beginPath();
          ctx.arc(wx, wy, premiumDevourer ? radius * 0.72 : radius, 0, Math.PI * 2);
          if (premiumDevourer) {
            ctx.save();
            ctx.shadowBlur = 9;
            ctx.shadowColor = "#c084fc";
            ctx.lineWidth = 1.8;
            ctx.strokeStyle = "#d8b4fe";
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(wx, wy, radius * 0.23, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          } else {
            ctx.fill();
          }
        }

        // Central hyper giant evil glowing pupil eye: keep movement and
        // pulse, but preserve the magma reactor visible through the new art.
        if (premiumDevourer) {
          ctx.save();
          ctx.lineWidth = 1.7;
          ctx.strokeStyle = "#f0abfc";
          ctx.shadowColor = "#f43f5e";
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(0, 0, enemy.size * 0.17, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = "#fb7185";
          ctx.beginPath();
          ctx.arc(Math.sin(time * 0.003) * 3, Math.cos(time * 0.003) * 3,
            enemy.size * 0.05, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          ctx.fillStyle = "#000000";
          ctx.beginPath();
          ctx.arc(0, 0, enemy.size * 0.45, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#f43f5e";
          ctx.beginPath();
          ctx.arc(Math.sin(time * 0.003) * 3, Math.cos(time * 0.003) * 3, enemy.size * 0.25, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }
    }

    const commandCorePresentation = projectLiveCommandCorePresentation(
      enemy.enemyFormation,
      enemy.size,
    );
    if (commandCorePresentation) {
      ctx.save();
      ctx.globalAlpha = commandCorePresentation.alpha;
      ctx.strokeStyle = commandCorePresentation.strokeColor;
      ctx.fillStyle = commandCorePresentation.strokeColor;
      ctx.lineWidth = commandCorePresentation.lineWidth;
      ctx.shadowColor = commandCorePresentation.glowColor;
      ctx.shadowBlur = commandCorePresentation.glowBlur;

      ctx.beginPath();
      ctx.arc(0, 0, commandCorePresentation.ringRadius, 0, Math.PI * 2);
      ctx.stroke();

      const chevronY = commandCorePresentation.chevronOffsetY;
      const chevronHalfWidth = commandCorePresentation.chevronHalfWidth;
      const chevronHalfHeight = commandCorePresentation.chevronHeight / 2;
      ctx.beginPath();
      ctx.moveTo(-chevronHalfWidth, chevronY - chevronHalfHeight);
      ctx.lineTo(0, chevronY + chevronHalfHeight);
      ctx.lineTo(chevronHalfWidth, chevronY - chevronHalfHeight);
      ctx.stroke();
      ctx.restore();
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

export interface WormSegmentRenderNode {
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  flashTicks: number;
}

export function drawWormSegmentChain(
  ctx: CanvasRenderingContext2D,
  boss: Enemy,
  segments: readonly WormSegmentRenderNode[],
  time: number,
) {
  if (boss.bossChassis !== "WORM_SEGMENTS" || segments.length === 0) return;

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "rgba(192,132,252,0.58)";
  ctx.lineWidth = 8;
  ctx.shadowColor = "#a855f7";
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.moveTo(boss.x, boss.y);
  segments.forEach((segment) => ctx.lineTo(segment.x, segment.y));
  ctx.stroke();

  segments.forEach((segment, index) => {
    const healthRatio = Math.max(0, Math.min(1, segment.health / Math.max(1, segment.maxHealth)));
    const radius = Math.max(9, boss.size * 0.32 - index * 0.45);
    const pulse = 1 + Math.sin(time * 0.0025 + index * 0.8) * 0.04;

    ctx.fillStyle = segment.flashTicks > 0 ? "#f5f3ff" : "#2e1065";
    ctx.strokeStyle = "#d8b4fe";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(segment.x, segment.y, radius * pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = `rgba(34,211,238,${0.35 + healthRatio * 0.6})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(
      segment.x,
      segment.y,
      radius * 0.66,
      -Math.PI / 2,
      -Math.PI / 2 + Math.PI * 2 * healthRatio,
    );
    ctx.stroke();
  });
  ctx.restore();
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
    ctx.shadowBlur = proj.size * 2.2;
    ctx.shadowColor = proj.color;
    ctx.fillStyle = proj.color;
    ctx.strokeStyle = proj.color;

    if (!proj.fromPlayer) {
      ctx.beginPath();
      ctx.arc(0, 0, proj.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    ctx.rotate(Math.atan2(proj.vy, proj.vx));
    switch (proj.attackShape ?? "LANCE") {
      case "RIPPLE":
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(0, 0, proj.size, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(-proj.size * 0.55, 0, proj.size * 0.58, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case "CRESCENT":
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(0, 0, proj.size * 1.35, -0.95, 0.95);
        ctx.stroke();
        break;
      case "PLASMA":
        ctx.beginPath();
        ctx.arc(0, 0, proj.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.55;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(proj.size * 0.18, -proj.size * 0.18, proj.size * 0.42, 0, Math.PI * 2);
        ctx.fill();
        break;
      case "ARC":
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(-7, 0);
        ctx.lineTo(-3, -3);
        ctx.lineTo(0, 2.5);
        ctx.lineTo(3, -2.5);
        ctx.lineTo(8, 0);
        ctx.stroke();
        break;
      case "PARTICLE":
        ctx.lineWidth = 1.1;
        for (let i = 0; i < 3; i += 1) {
          ctx.save();
          ctx.rotate((i * Math.PI) / 3);
          ctx.beginPath();
          ctx.ellipse(0, 0, proj.size * 1.35, proj.size * 0.45, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(0, 0, proj.size * 0.32, 0, Math.PI * 2);
        ctx.fill();
        break;
      case "KINETIC":
        ctx.beginPath();
        ctx.moveTo(9, 0);
        ctx.lineTo(-5, -proj.size);
        ctx.lineTo(-2, 0);
        ctx.lineTo(-5, proj.size);
        ctx.closePath();
        ctx.fill();
        break;
      case "CELL":
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.roundRect(-6, -proj.size * 0.65, 12, proj.size * 1.3, proj.size * 0.6);
        ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.fillRect(-1.5, -proj.size * 0.45, 3, proj.size * 0.9);
        break;
      case "PHASE":
        ctx.rotate(Math.PI / 4);
        ctx.fillRect(-proj.size * 0.65, -proj.size * 0.65, proj.size * 1.3, proj.size * 1.3);
        ctx.globalAlpha = 0.35;
        ctx.strokeStyle = "#ffffff";
        ctx.strokeRect(-proj.size, -proj.size, proj.size * 2, proj.size * 2);
        break;
      case "SYNTHESIS":
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let i = 0; i < 8; i += 1) {
          const angle = (i * Math.PI) / 4;
          const radius = i % 2 === 0 ? proj.size * 1.35 : proj.size * 0.62;
          const px = Math.cos(angle) * radius;
          const py = Math.sin(angle) * radius;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, proj.size * 0.45, 0, Math.PI * 2);
        ctx.fill();
        break;
      case "LANCE":
      default:
        ctx.fillRect(-9, -proj.size * 0.45, 18, proj.size * 0.9);
        ctx.globalAlpha = 0.55;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(1, -0.6, 8, 1.2);
        break;
    }
    ctx.restore();
  });
}

export default EnergySwarmCanvas;