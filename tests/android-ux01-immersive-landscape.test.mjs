import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = path => readFileSync(new URL(path, import.meta.url), "utf8");
const game=read("../src/game/EnergySwarmGame.tsx");
const hud=read("../src/components/GameHud.tsx");
const styles=read("../src/styles/androidImmersive.css");
const activity=read("../android/app/src/main/java/com/orbiecosystem/energyswarm/MainActivity.java");
const manifest=read("../android/app/src/main/AndroidManifest.xml");
const entry=read("../src/main.tsx");
const html=read("../index.html");

test("ANDROID UX01 remains touch-scoped while WEB UX01 adds isolated fine-pointer landscape",()=>{
  const policy=read("../src/game/immersiveBattlefieldPolicy.ts");
  assert.match(policy,/profile\.orientation === "LANDSCAPE" &&\s*profile\.touchControlsRecommended/);
  assert.match(policy,/!profile\.coarsePointer && profile\.width >= 800/);
  assert.match(game,/projectImmersiveBattlefieldMode\(viewportProfile\)/);
  assert.match(game,/data-immersive-landscape=\{isPlaying && immersiveLandscapeMode/);
  assert.match(game,/data-mobile-panel=\{isPlaying && immersiveLandscapeMode \? mobilePanel : "closed"\}/);
  assert.match(styles,/\[data-immersive-landscape="true"\]/);
  assert.match(styles,/\.orbi-game-root:not\(\[data-immersive-landscape="true"\]\) \.orbi-hud-detail-grid/);
  assert.match(entry,/import '\.\/styles\/androidImmersive\.css'/);
});

test("ANDROID UX01 retains complete HUD and both original functional decks under Estado",()=>{
  assert.match(hud,/data-testid="orbi-estado-button"/);
  assert.match(hud,/aria-expanded=\{mobilePanel !== "closed"\}/);
  assert.match(hud,/onMobilePanelChange\?\.\("closed"\)/);
  assert.match(hud,/onClick=\{onActivateOverdrive\}/);
  assert.match(hud,/onClick=\{onTogglePause\}/);
  for(const name of ["estado","tactica","equipo"])assert.ok(hud.includes('"'+name+'"'));
  assert.match(hud,/orbi-hud-detail-grid/);
  assert.match(game,/setIsLeftPanelCollapsed\(false\)/);
  assert.match(game,/setIsRightPanelCollapsed\(false\)/);
  assert.match(game,/<CompanionPanel/);
  assert.match(game,/activeRunUpgrades/);
  assert.match(game,/currentThreatDescriptor/);
});

test("ANDROID UX01 battlefield fills screen without distorting/cropping world or changing pointers",()=>{
  assert.match(styles,/height: 100dvh/);
  assert.match(styles,/grid-template-areas: "battlefield" !important/);
  assert.match(styles,/height: 100% !important/);
  assert.match(styles,/object-fit: contain/);
  assert.doesNotMatch(styles,/object-fit: cover/);
  assert.match(game,/<EnergySwarmCanvas/);
  assert.match(game,/onPointerDown=\{handlePointerDown\}/);
  assert.match(game,/onPointerUp=\{handlePointerUp\}/);
  assert.match(game,/<MobileTouchOverlay onVectorChange=\{setMobileAnalogVector\}/);
  assert.match(game,/<MobileFormationCarousel/);
});

test("ANDROID UX01 keeps operable translucent controls and clear pressed/focus states",()=>{
  assert.match(styles,/opacity: \.42/);
  assert.match(styles,/:focus-within/);
  assert.match(styles,/:active/);
  assert.match(styles,/min-width: 42px/);
  assert.match(styles,/height: 42px/);
  assert.match(styles,/safe-area-inset-left/);
  assert.match(styles,/safe-area-inset-right/);
  assert.match(styles,/orbi-boss-hud/);
});

test("ANDROID UX01 native orientation + immersive bars with user swipe escape",()=>{
  assert.match(manifest,/android:screenOrientation="sensorLandscape"/);
  assert.match(activity,/extends BridgeActivity/);
  assert.match(activity,/onWindowFocusChanged\(boolean hasFocus\)/);
  assert.match(activity,/WindowInsets\.Type\.statusBars\(\) \| WindowInsets\.Type\.navigationBars\(\)/);
  assert.match(activity,/BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE/);
  assert.match(activity,/SYSTEM_UI_FLAG_IMMERSIVE_STICKY/);
  assert.match(activity,/LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES/);
  assert.match(html,/viewport-fit=cover/);
});
