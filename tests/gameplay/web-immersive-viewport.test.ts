import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { classifyViewportComposition } from "../../src/game/viewportComposition";
import { projectImmersiveBattlefieldMode } from "../../src/game/immersiveBattlefieldPolicy";
import { projectPanoramicCanvasViewport } from "../../src/game/panoramicCanvasViewport";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../../src/game/constants";

const read = (path: string) =>
  readFileSync(new URL("../../" + path, import.meta.url), "utf8");

test("WEB UX01 fine-pointer desktop and laptop landscape gets real panoramic world", () => {
  for (const [width, height] of [[1366, 768], [1440, 900], [1920, 1080], [2560, 1440]]) {
    const viewport = classifyViewportComposition({ width, height, coarsePointer: false });
    const mode = projectImmersiveBattlefieldMode(viewport);
    assert.equal(mode.immersive, true);
    assert.equal(mode.webLandscape, true);
    assert.equal(mode.touchLandscape, false);
    const view = projectPanoramicCanvasViewport({ width, height, immersive: mode.immersive });
    assert.equal(view.height, CANVAS_HEIGHT);
    assert.ok(view.width > CANVAS_WIDTH);
    assert.ok(Math.abs(view.width / view.height - width / (height - 45)) < .002,
      "projection must match actual stage without CSS stretch or side-bars");
  }
});

test("WEB UX01 preserves certified touch landscape, portrait and coarse tablet paths", () => {
  for (const [width, height] of [[915, 412], [844, 390], [740, 360]]) {
    const viewport = classifyViewportComposition({ width, height, coarsePointer: true });
    const mode = projectImmersiveBattlefieldMode(viewport);
    assert.deepEqual(mode, { touchLandscape: true, webLandscape: false, immersive: true });
  }
  for (const [width, height, coarsePointer] of [
    [390, 844, true], [800, 1200, false], [1600, 900, true],
    [799, 600, false], [1920, 300, false],
  ] as const) {
    const profile = classifyViewportComposition({ width, height, coarsePointer });
    const mode = projectImmersiveBattlefieldMode(profile);
    assert.equal(mode.immersive, false, JSON.stringify({ width, height, coarsePointer }));
    assert.deepEqual(projectPanoramicCanvasViewport({ width, height, immersive: mode.immersive }),
      { width: CANVAS_WIDTH, height: CANVAS_HEIGHT });
  }
});

test("WEB UX01 reuses Estado, camera and safe visual viewport with true pointer controls", () => {
  const game = read("src/game/EnergySwarmGame.tsx");
  const hud = read("src/components/GameHud.tsx");
  const style = read("src/styles/webImmersive.css");
  const mobileStyle = read("src/styles/androidImmersive.css");
  assert.match(game, /projectImmersiveBattlefieldMode\(viewportProfile\)/);
  assert.match(game, /immersive: immersiveLandscapeMode/);
  assert.match(game, /data-web-immersive=\{isPlaying && immersiveWebLandscape/);
  assert.match(game, /onToggleWebFullscreen=\{immersiveWebLandscape/);
  assert.match(game, /immersive=\{immersiveLandscapeMode\}/);
  assert.match(game, /onPointerDown=\{handlePointerDown\}/);
  assert.match(game, /onPointerMove=\{handlePointerMove\}/);
  assert.match(hud, /data-testid="orbi-web-fullscreen"/);
  assert.match(hud, /data-testid="orbi-estado-button"/);
  assert.match(hud, /onMobilePanelChange\?\.\("closed"\)/);
  assert.match(mobileStyle, /object-fit: contain/);
  assert.match(style, /data-web-immersive="true"/);
  assert.match(style, /\.orbi-touch-overlay, \.orbi-touch-formation-carousel/);
  assert.doesNotMatch(game, /viewportProfile\.[\s\S]{0,100}PLAYER_BASE_SPEED/);
});
