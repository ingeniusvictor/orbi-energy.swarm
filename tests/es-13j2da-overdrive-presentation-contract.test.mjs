import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const source = fs.readFileSync(
  "src/game/combatOverdrivePresentation.ts",
  "utf8",
);

test("J2D-A presentation contract stays pure and dependency-light", () => {
  assert.match(source, /projectCombatOverdrivePresentation/);
  assert.match(source, /remainingRatio/);
  assert.match(source, /QualityPreset/);

  for (const forbidden of [
    /\bDate\b/,
    /\bperformance\b/,
    /requestAnimationFrame/,
    /setTimeout|setInterval/,
    /from\s+["']react["']/i,
    /\buse(?:State|Effect|Ref|Memo|Callback)\b/,
    /\.\/audio/,
    /localStorage|sessionStorage/,
    /Math\.random/,
    /canvas|getContext|CanvasRenderingContext2D/,
    /particlesRef|projectilesRef|enemiesRef|swarmRef|resourcesRef/,
    /triggerExplosion|pushVfxParticle|pushParticleWithinBudget/,
  ]) {
    assert.doesNotMatch(source, forbidden);
  }
});

test("J2D-A does not duplicate frozen Overdrive gameplay timing or damage tuning", () => {
  assert.doesNotMatch(
    source,
    /OVERDRIVE_DURATION_MS|OVERDRIVE_REENTRY_LOCK_MS|\b8_?000\b|\b4_?000\b/,
  );
  assert.doesNotMatch(
    source,
    /OVERDRIVE_PLAYER_DAMAGE_MULTIPLIER|MAX_OVERDRIVE_PLAYER_DAMAGE_MULTIPLIER|\b1\.2\b|\b1\.25\b/,
  );
  assert.doesNotMatch(source, /\.\/combatOverdriveEffects/);
});

test("J2D-A presentation remains direct-draw bounded and creates no entity budget", () => {
  assert.match(
    source,
    /MAX_OVERDRIVE_PRESENTATION_RINGS\s*=\s*3/,
  );
  assert.match(
    source,
    /OVERDRIVE_ACTIVATION_PULSE_RATIO_WINDOW\s*=\s*0\.06/,
  );
  assert.doesNotMatch(
    source,
    /MAX_ENEMIES|MAX_PROJECTILES|maxParticles|new\s+Array|\.push\(/,
  );
});
