from pathlib import Path


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"fail-closed {label}: expected 1 match, found {count}")
    return text.replace(old, new, 1)


background_path = Path("src/game/backgroundRenderer.ts")
background = background_path.read_text()

background = replace_once(
    background,
    '''import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants";''',
    '''import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants";
import { projectCosmicWhaleEvent } from "./cosmicWhaleEvent";''',
    "Cosmic Whale renderer import",
)

background = replace_once(
    background,
    '''    drawNebula: boolean,
    drawPlanets: boolean,
    bossActive: boolean,''',
    '''    drawNebula: boolean,
    drawPlanets: boolean,
    drawCosmicWhale: boolean,
    bossActive: boolean,''',
    "Cosmic Whale render parameter",
)

background = replace_once(
    background,
    '''    // --- LAYER 3: DEEP TWINKLING STARS ---
    this.drawStars(ctx, cameraX, cameraY, time, viewportWidth, viewportHeight);

    // --- LAYER 4: CELESTIAL DISTANT PLANETS ---''',
    '''    // --- LAYER 3: PASSIVE COSMIC LEVIATHAN ---
    if (drawCosmicWhale && !bossActive) {
      this.drawCosmicWhaleLayer(ctx, time, viewportWidth, viewportHeight);
    }

    // --- LAYER 4: DEEP TWINKLING STARS ---
    this.drawStars(ctx, cameraX, cameraY, time, viewportWidth, viewportHeight);

    // --- LAYER 5: CELESTIAL DISTANT PLANETS ---''',
    "Cosmic Whale background layer",
)

background = replace_once(
    background,
    '''    // --- LAYER 5: ORBITAL DEBRIS / SATELLITES ---
    this.drawOrbitalElements(ctx, time, viewportWidth, viewportHeight);
  }

  private drawNebulas''',
    '''    // --- LAYER 6: ORBITAL DEBRIS / SATELLITES ---
    this.drawOrbitalElements(ctx, time, viewportWidth, viewportHeight);
  }

  private drawNebulas''',
    "renumber orbital background layer",
)

whale_method = r'''
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

'''
background = replace_once(
    background,
    '''  private drawStars(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number, time: number, viewportWidth: number, viewportHeight: number) {''',
    whale_method + '''  private drawStars(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number, time: number, viewportWidth: number, viewportHeight: number) {''',
    "Cosmic Whale Canvas2D method",
)

background_path.write_text(background)


game_path = Path("src/game/EnergySwarmGame.tsx")
game = game_path.read_text()
game = replace_once(
    game,
    '''      quality.drawNebula,
      quality.drawPlanets,
      bossActiveRef.current,''',
    '''      quality.drawNebula,
      quality.drawPlanets,
      quality.drawCosmicWhale &&
        runtimeProgressionRef.current.mode === "INFINITE",
      bossActiveRef.current,''',
    "Infinite-only Whale render gate",
)
game_path.write_text(game)
