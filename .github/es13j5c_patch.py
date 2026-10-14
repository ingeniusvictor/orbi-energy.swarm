from pathlib import Path

path = Path("src/game/EnergySwarmCanvas.tsx")
text = path.read_text(encoding="utf-8")

import_anchor = 'import { projectLiveSiegeVolleyTelegraph } from "./liveSiegeVolleyIntegration";\n'
import_insert = import_anchor + 'import { projectLiveCommandCorePresentation } from "./liveCommandCorePresentation";\n'
if text.count(import_anchor) != 1:
    raise RuntimeError(f"import anchor count != 1: {text.count(import_anchor)}")
if "liveCommandCorePresentation" in text:
    raise RuntimeError("J5C presentation import already present")
text = text.replace(import_anchor, import_insert, 1)

health_anchor = """    // HEALTH BAR OVERLAY (Only show if damaged)
    if (enemy.health < enemy.maxHealth) {
"""
marker_block = """    const commandCorePresentation = projectLiveCommandCorePresentation(
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

""" + health_anchor
if text.count(health_anchor) != 1:
    raise RuntimeError(f"health-bar anchor count != 1: {text.count(health_anchor)}")
text = text.replace(health_anchor, marker_block, 1)

path.write_text(text, encoding="utf-8")
print("ES-13J5C Canvas presentation patch applied.")
