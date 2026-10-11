import { BiomeType, BiomeConfig } from "./types";
import { getBiomeConfig } from "./biomes";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants";
import { projectCosmicWhaleEvent } from "./cosmicWhaleEvent";

interface Star {
  x: number;
  y: number;
  size: number;
  speedFactor: number;
  twinklePhase: number;
  twinkleSpeed: number;
}

interface SpacePlanet {
  x: number;
  y: number;
  size: number;
  color: string;
  hasRing: boolean;
  ringColor?: string;
  shadowAngle: number;
  parallaxFactor: number;
}

export class BackgroundRenderer {
  private stars: Star[] = [];
  private planets: SpacePlanet[] = [];
  private debrisAngle = 0;
  private gridPulseTime = 0;

  constructor() {
    this.generateStars(200);
    this.generatePlanets();
  }

  private generateStars(count: number) {
    this.stars = [];
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * CANVAS_WIDTH,
        y: Math.random() * CANVAS_HEIGHT,
        size: 0.5 + Math.random() * 1.8,
        speedFactor: 0.05 + Math.random() * 0.15,
        twinklePhase: Math.random() * Math.PI,
        twinkleSpeed: 0.01 + Math.random() * 0.03
      });
    }
  }

  private generatePlanets() {
    this.planets = [
      {
        x: CANVAS_WIDTH * 0.25,
        y: CANVAS_HEIGHT * 0.28,
        size: 42,
        color: "#1e3a8a", // Oceanic
        hasRing: false,
        shadowAngle: Math.PI / 4,
        parallaxFactor: 0.12
      },
      {
        x: CANVAS_WIDTH * 0.8,
        y: CANVAS_HEIGHT * 0.2,
        size: 58,
        color: "#d97706", // Gaseous core
        hasRing: true,
        ringColor: "rgba(217, 119, 6, 0.4)",
        shadowAngle: Math.PI / 3,
        parallaxFactor: 0.08
      },
      {
        x: CANVAS_WIDTH * 0.55,
        y: CANVAS_HEIGHT * 0.7,
        size: 15,
        color: "#475569", // Metallic moon
        hasRing: false,
        shadowAngle: Math.PI / 6,
        parallaxFactor: 0.15
      }
    ];
  }

  /**
   * Rescales star count based on active quality preset.
   */
  public resizeStars(maxStars: number) {
    if (this.stars.length !== maxStars) {
      this.generateStars(maxStars);
    }
  }

  /**
   * Renders the complete multi-layer space scene.
   */
  public render(
    ctx: CanvasRenderingContext2D,
    time: number,
    biome: BiomeType,
    cameraX: number,
    cameraY: number,
    cameraZoom: number,
    drawNebula: boolean,
    drawPlanets: boolean,
    drawCosmicWhale: boolean,
    bossActive: boolean,
    viewportWidth: number = CANVAS_WIDTH,
    viewportHeight: number = CANVAS_HEIGHT
  ) {
    const config = getBiomeConfig(biome);

    // --- BASE FLAT BACKGROUND ---
    ctx.fillStyle = config.bgColor;
    ctx.fillRect(0, 0, viewportWidth, viewportHeight);

    // --- LAYER 1: THE ACTIVE GRID ---
    this.drawGrid(ctx, cameraX, cameraY, cameraZoom, config, bossActive, viewportWidth, viewportHeight);

    // --- LAYER 2: MILKY WAY & NEBULA FIELDS ---
    if (drawNebula) {
      this.drawNebulas(ctx, time, config, viewportWidth, viewportHeight);
    }

    // --- LAYER 3: PASSIVE COSMIC LEVIATHAN ---
    if (drawCosmicWhale && !bossActive) {
      this.drawCosmicWhaleLayer(ctx, time, viewportWidth, viewportHeight);
    }

    // --- LAYER 4: DEEP TWINKLING STARS ---
    this.drawStars(ctx, cameraX, cameraY, time, viewportWidth, viewportHeight);

    // --- LAYER 5: CELESTIAL DISTANT PLANETS ---
    if (drawPlanets) {
      this.drawPlanetsLayer(ctx, cameraX, cameraY, cameraZoom, biome, viewportWidth, viewportHeight);
    }

    // --- LAYER 6: ORBITAL DEBRIS / SATELLITES ---
    this.drawOrbitalElements(ctx, time, viewportWidth, viewportHeight);
  }

  private drawNebulas(ctx: CanvasRenderingContext2D, time: number, config: BiomeConfig, viewportWidth: number, viewportHeight: number) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";

    const colors = config.nebulaColors;
    
    // Draw Milky Way Dust Band (Diagonal soft band)
    const dustGrad = ctx.createLinearGradient(0, 0, viewportWidth, viewportHeight);
    dustGrad.addColorStop(0, "rgba(76, 29, 149, 0.0)");
    dustGrad.addColorStop(0.35, "rgba(139, 92, 246, 0.03)");
    dustGrad.addColorStop(0.5, "rgba(236, 72, 153, 0.05)");
    dustGrad.addColorStop(0.65, "rgba(6, 182, 212, 0.03)");
    dustGrad.addColorStop(1, "rgba(76, 29, 149, 0.0)");
    ctx.fillStyle = dustGrad;
    ctx.fillRect(0, 0, viewportWidth, viewportHeight);

    // Dynamic Blob 1
    const x1 = viewportWidth * 0.3 + Math.sin(time * 0.0003) * 60;
    const y1 = viewportHeight * 0.4 + Math.cos(time * 0.0002) * 40;
    const g1 = ctx.createRadialGradient(x1, y1, 10, x1, y1, 260);
    g1.addColorStop(0, colors[0] + "1a"); // 10% opacity
    g1.addColorStop(0.5, colors[1] + "08"); // 3% opacity
    g1.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g1;
    ctx.beginPath();
    ctx.arc(x1, y1, 260, 0, Math.PI * 2);
    ctx.fill();

    // Dynamic Blob 2
    const x2 = viewportWidth * 0.7 + Math.cos(time * 0.0002) * 50;
    const y2 = viewportHeight * 0.6 + Math.sin(time * 0.0003) * 50;
    const g2 = ctx.createRadialGradient(x2, y2, 20, x2, y2, 220);
    g2.addColorStop(0, colors[1] + "1c");
    g2.addColorStop(0.6, colors[2] + "06");
    g2.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g2;
    ctx.beginPath();
    ctx.arc(x2, y2, 220, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }


  private drawCosmicWhaleLayer(
    ctx: CanvasRenderingContext2D,
    time: number,
    viewportWidth: number,
    viewportHeight: number,
  ) {
    const whale = projectCosmicWhaleEvent({
      timeMs: time,
      viewportWidth,
      viewportHeight,
      enabled: true,
    });
    if (!whale) return;

    const width = whale.bodyWidth;
    const height = whale.bodyHeight;
    const tailWave = Math.sin(whale.tailPhase) * height * 0.14;

    ctx.save();
    ctx.translate(whale.x, whale.y);
    ctx.rotate(whale.tilt);
    ctx.scale(whale.direction, 1);
    ctx.globalAlpha = whale.alpha;

    const glow = ctx.createRadialGradient(
      0,
      0,
      height * 0.25,
      0,
      0,
      width * 0.72,
    );
    glow.addColorStop(0, "rgba(103, 232, 249, 0.16)");
    glow.addColorStop(0.55, "rgba(129, 140, 248, 0.07)");
    glow.addColorStop(1, "rgba(15, 23, 42, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.ellipse(0, 0, width * 0.72, height * 1.15, 0, 0, Math.PI * 2);
    ctx.fill();

    const bodyGradient = ctx.createLinearGradient(
      -width * 0.5,
      -height * 0.2,
      width * 0.5,
      height * 0.2,
    );
    bodyGradient.addColorStop(0, "rgba(30, 41, 59, 0.92)");
    bodyGradient.addColorStop(0.48, "rgba(67, 56, 202, 0.72)");
    bodyGradient.addColorStop(1, "rgba(14, 116, 144, 0.78)");
    ctx.fillStyle = bodyGradient;
    ctx.beginPath();
    ctx.moveTo(-width * 0.47, 0);
    ctx.bezierCurveTo(
      -width * 0.34,
      -height * 0.48,
      width * 0.12,
      -height * 0.55,
      width * 0.46,
      -height * 0.08,
    );
    ctx.bezierCurveTo(
      width * 0.56,
      height * 0.02,
      width * 0.46,
      height * 0.26,
      width * 0.28,
      height * 0.3,
    );
    ctx.bezierCurveTo(
      width * 0.02,
      height * 0.42,
      -width * 0.34,
      height * 0.28,
      -width * 0.47,
      0,
    );
    ctx.fill();

    ctx.fillStyle = "rgba(56, 189, 248, 0.26)";
    ctx.beginPath();
    ctx.moveTo(width * 0.05, height * 0.18);
    ctx.bezierCurveTo(
      width * 0.02,
      height * 0.58,
      -width * 0.16,
      height * 0.7,
      -width * 0.2,
      height * 0.28,
    );
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(59, 130, 246, 0.62)";
    ctx.beginPath();
    ctx.moveTo(-width * 0.45, 0);
    ctx.bezierCurveTo(
      -width * 0.62,
      -height * 0.18 + tailWave,
      -width * 0.69,
      -height * 0.52 + tailWave,
      -width * 0.76,
      -height * 0.36 + tailWave,
    );
    ctx.bezierCurveTo(
      -width * 0.66,
      -height * 0.05,
      -width * 0.6,
      height * 0.02,
      -width * 0.45,
      0,
    );
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-width * 0.45, 0);
    ctx.bezierCurveTo(
      -width * 0.62,
      height * 0.16 - tailWave,
      -width * 0.71,
      height * 0.5 - tailWave,
      -width * 0.78,
      height * 0.33 - tailWave,
    );
    ctx.bezierCurveTo(
      -width * 0.66,
      height * 0.03,
      -width * 0.59,
      -height * 0.02,
      -width * 0.45,
      0,
    );
    ctx.fill();

    ctx.strokeStyle = "rgba(165, 243, 252, 0.34)";
    ctx.lineWidth = Math.max(1, whale.scale * 1.2);
    ctx.beginPath();
    ctx.moveTo(-width * 0.25, -height * 0.16);
    ctx.bezierCurveTo(
      -width * 0.04,
      -height * 0.3,
      width * 0.2,
      -height * 0.24,
      width * 0.38,
      -height * 0.1,
    );
    ctx.stroke();

    ctx.fillStyle = "rgba(207, 250, 254, 0.78)";
    ctx.beginPath();
    ctx.arc(width * 0.34, -height * 0.07, Math.max(1.2, whale.scale * 1.8), 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  private drawStars(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number, time: number, viewportWidth: number, viewportHeight: number) {
    ctx.save();
    this.stars.forEach((star) => {
      // Parallax shifts relative to camera movement, wrapped around the viewport size
      let sx = (star.x - cameraX * star.speedFactor) % viewportWidth;
      let sy = (star.y - cameraY * star.speedFactor) % viewportHeight;
      if (sx < 0) sx += viewportWidth;
      if (sy < 0) sy += viewportHeight;

      // Twinkling alpha modulation
      const twinkle = Math.sin(star.twinklePhase + time * star.twinkleSpeed);
      const alpha = 0.25 + (twinkle + 1) * 0.35;

      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fillRect(sx, sy, star.size, star.size);
    });
    ctx.restore();
  }

  private drawPlanetsLayer(
    ctx: CanvasRenderingContext2D,
    cameraX: number,
    cameraY: number,
    _cameraZoom: number,
    biome: BiomeType,
    _viewportWidth: number,
    _viewportHeight: number
  ) {
    ctx.save();
    
    this.planets.forEach((planet, idx) => {
      // Parallax shifts relative to camera movement
      const px = planet.x - cameraX * planet.parallaxFactor;
      const py = planet.y - cameraY * planet.parallaxFactor;

      let pColor = planet.color;
      let pRing = planet.ringColor;
      
      if (biome === BiomeType.SOLAR_PLAINS) {
        if (idx === 1) pColor = "#ea580c"; // golden sun-like planet
      } else if (biome === BiomeType.DEEP_WATER) {
        if (idx === 0) pColor = "#0284c7"; // deep ocean planet
      } else if (biome === BiomeType.ACID_SWAMP) {
        pColor = "#b91c1c"; // igneous magma body
      } else if (biome === BiomeType.QUANTUM_NEXUS) {
        pColor = "#c026d3"; // quantum magenta void planet
      }

      // 1. Atmosphere / Glow (Slightly larger than the planet)
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      const atmGlow = ctx.createRadialGradient(px, py, planet.size * 0.9, px, py, planet.size * 1.3);
      atmGlow.addColorStop(0, pColor + "4d"); // 30% opacity
      atmGlow.addColorStop(0.5, pColor + "1a"); // 10% opacity
      atmGlow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = atmGlow;
      ctx.beginPath();
      ctx.arc(px, py, planet.size * 1.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 2. Draw Rings first if behind planet
      if (planet.hasRing && pRing) {
        ctx.strokeStyle = pRing;
        ctx.lineWidth = planet.size * 0.15;
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(-Math.PI / 6);
        ctx.scale(2.2, 0.45);
        ctx.beginPath();
        ctx.arc(0, 0, planet.size, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 3. Draw planet sphere with procedural bands & directional shading
      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, planet.size, 0, Math.PI * 2);
      ctx.clip(); // Clip everything to the planet sphere bounds (prevents thick borders!)

      // Base color fill
      ctx.fillStyle = pColor;
      ctx.fill();

      // Draw planetary bands (textures)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = planet.size * 0.08;
      for (let i = -2; i <= 2; i++) {
        const bandY = py + i * (planet.size * 0.3) + Math.sin(idx * 2.5) * 6;
        ctx.beginPath();
        ctx.moveTo(px - planet.size, bandY);
        ctx.bezierCurveTo(px - planet.size * 0.5, bandY + 4, px + planet.size * 0.5, bandY - 4, px + planet.size, bandY);
        ctx.stroke();
      }

      // Shading: day/night terminator with radial gradient
      // Offset from center to represent directional lighting from top-left
      const shadowGrad = ctx.createRadialGradient(
        px - planet.size * 0.35,
        py - planet.size * 0.35,
        planet.size * 0.25,
        px,
        py,
        planet.size * 1.1
      );
      shadowGrad.addColorStop(0, "rgba(255, 255, 255, 0.12)"); // subtle highlight
      shadowGrad.addColorStop(0.5, "rgba(0, 0, 0, 0)");
      shadowGrad.addColorStop(0.9, "rgba(0, 0, 0, 0.8)"); // deep shadow
      shadowGrad.addColorStop(1, "rgba(0, 0, 0, 0.98)");

      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.arc(px, py, planet.size + 1, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore(); // end planet sphere clipping

      // 4. Draw ring front-side overlap over planet
      if (planet.hasRing && pRing) {
        ctx.strokeStyle = pRing;
        ctx.lineWidth = planet.size * 0.15;
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(-Math.PI / 6);
        ctx.scale(2.2, 0.45);
        ctx.beginPath();
        // Draw front-half of ring only (angles 0 to PI)
        ctx.arc(0, 0, planet.size, 0, Math.PI);
        ctx.stroke();
        ctx.restore();
      }
    });

    ctx.restore();
  }

  private drawOrbitalElements(ctx: CanvasRenderingContext2D, time: number, viewportWidth: number, viewportHeight: number) {
    ctx.save();
    this.debrisAngle += 0.001;

    // Draw a single slow orbiting technical space portal or satellite ring in background
    const rx = viewportWidth * 0.5 + Math.cos(time * 0.0001) * 80;
    const ry = viewportHeight * 0.45 + Math.sin(time * 0.0001) * 40;

    ctx.translate(rx, ry);
    ctx.rotate(this.debrisAngle);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, 110, 0, Math.PI * 2);
    ctx.stroke();

    // Satellite point node
    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    ctx.beginPath();
    ctx.arc(110, 0, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  private drawGrid(
    ctx: CanvasRenderingContext2D,
    cameraX: number,
    cameraY: number,
    cameraZoom: number,
    config: BiomeConfig,
    bossActive: boolean,
    _viewportWidth: number,
    _viewportHeight: number
  ) {
    ctx.save();
    
    // Subtly pulsate grid color lines - made highly subtle for deep space cinematic feel
    this.gridPulseTime += 0.02;
    const baseAlpha = bossActive ? 0.08 : 0.03;
    const pulse = baseAlpha + Math.sin(this.gridPulseTime) * 0.01;
    ctx.strokeStyle = config.gridColor.replace(/[\d.]+\)$/, `${pulse})`);
    ctx.lineWidth = 0.5 * cameraZoom;

    const gridSize = 64; // larger grid cells for expanded world

    // We apply camera zoom and translation to draw grid lines in world coordinates
    ctx.scale(cameraZoom, cameraZoom);
    ctx.translate(-cameraX, -cameraY);

    // Draw world boundaries
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, 1600, 960); // WORLD BOUNDARY (1600 x 960)

    // Restore line style for normal grid lines
    ctx.strokeStyle = config.gridColor.replace(/[\d.]+\)$/, `${pulse})`);
    ctx.lineWidth = 0.5;

    // Draw grid lines inside world boundaries
    for (let x = 0; x <= 1600; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 960);
      ctx.stroke();
    }
    for (let y = 0; y <= 960; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1600, y);
      ctx.stroke();
    }

    ctx.restore();
  }
}
export const backgroundRenderer = new BackgroundRenderer();
