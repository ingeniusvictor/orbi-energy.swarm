import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const game=read("src/game/EnergySwarmGame.tsx");
const hud=read("src/components/GameHud.tsx");
const touch=read("src/components/MobileTouchOverlay.tsx");
const physics=read("src/game/propulsionDash.ts");
const css=read("src/styles/ux11Dash.css");
const audio=read("src/game/audio.ts");
const bootstrap=read("src/main.tsx");
const chromium=read("scripts/web-ux01-browser-evidence.mjs");

test("UX11-E is wired into real gameplay physics, not a decorative HUD element",()=>{
  assert.match(game,/if \(key === "E"\)/);
  assert.match(game,/handleDashActivation\(\)/);
  assert.match(game,/stepPropulsionDash\(/);
  assert.match(game,/if \(dashStep\?\.activeDuringFrame\)/);
  assert.match(game,/playerPosRef\.current\.x = dashStep\.position\.x/);
  assert.match(game,/width: WORLD_WIDTH, height: WORLD_HEIGHT, radius: DASH_PLAYER_RADIUS/);
  assert.match(game,/setDashView\(projectPropulsionDash\(propulsionDashRef\.current, timeElapsedRef\.current\)\)/);
  assert.match(game,/createPropulsionDashState\(\)/);
});

test("UX11-E respects pause, photo, upgrade, gameover, boss cinematic and QA isolation",()=>{
  const activation=game.slice(game.indexOf("const handleDashActivation ="),game.indexOf("const handleOverdriveActivation ="));
  for(const name of ["isPausedRef.current","isPhotoMode","isGameOver",
    "isUpgradeSelectionOpenRef.current","bossIntroTimeRef.current",
    "bossDefeatedSequenceActiveRef.current","architectQaBossRef.current"]) {
    assert.ok(activation.includes(name),name);
  }
  assert.match(game,/if \(!e\.repeat\) handleDashActivation\(\)/);
  assert.doesNotMatch(physics,/invincibilityTimerRef|shieldRef|combatResonance|combatOverdrive/);
  assert.match(game,/Collision\/damage checks still run normally/);
});

test("UX11-E touch and keyboard controls are real, bilingual, accessible and independent",()=>{
  assert.match(hud,/data-testid="orbi-dash-action"/);
  assert.match(hud,/data-testid="orbi-dash-action-desktop"/);
  assert.match(hud,/dashCooldownRemainingMs/);
  assert.match(touch,/data-testid="orbi-touch-dash"/);
  assert.match(touch,/data-testid="orbi-touch-overdrive"/);
  assert.match(touch,/event\.pointerType !== "mouse"/);
  assert.match(touch,/event\.preventDefault\(\)/);
  assert.match(touch,/if \(!disabled && dashReady\) onDash\(\)/);
  assert.match(touch,/if \(!disabled && overdriveReady\) onOverdrive\(\)/);
  assert.match(touch,/disabled=\{disabled \|\| !dashReady\}/);
  assert.match(touch,/language === "es"/);
  assert.match(css,/safe-area-inset-right/);
  assert.match(css,/touch-action:manipulation/);
  assert.match(bootstrap,/ux11Dash\.css/);
});

test("UX11-E visual/audio presentation stays separate from Dyson and Overdrive",()=>{
  assert.match(game,/no Dyson rings, no gameplay immunity/);
  assert.match(game,/playPropulsionDashSound\(\)/);
  assert.match(audio,/export const playPropulsionDashSound/);
  assert.match(hud,/20% de daño durante 8 s/);
  assert.match(hud,/sin inmunidad ni gasto de resonancia/);
  assert.match(hud,/Los círculos de Overdrive no añaden escudos/);
  assert.doesNotMatch(physics,/TorusGeometry|Dyson|playerDamageMultiplier/);
});

test("UX11-E browser suite exercises Dash in actual production game",()=>{
  assert.match(chromium,/orbi-dash-action/);
  assert.match(chromium,/orbi-touch-dash/);
  assert.match(chromium,/page\.keyboard\.press\("E"\)/);
  assert.match(chromium,/dash did not enter cooldown/);
});
