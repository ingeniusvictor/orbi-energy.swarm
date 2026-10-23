import assert from "node:assert/strict";
import test from "node:test";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../../src/game/constants";
import { projectPanoramicCanvasViewport } from "../../src/game/panoramicCanvasViewport";

test("UX02 desktop, portrait and invalid viewport remain exact legacy 800x480", () => {
  for (const input of [
    { width: 1440, height: 900, immersive: false },
    { width: 390, height: 844, immersive: false },
    { width: NaN, height: 390, immersive: true },
    { width: 844, height: 0, immersive: true },
  ]) assert.deepEqual(projectPanoramicCanvasViewport(input), {
    width: CANVAS_WIDTH, height: CANVAS_HEIGHT,
  });
});

test("UX02 true mobile landscape draws wider WORLD, without reducing FOTON height", () => {
  const options = [
    { width: 915, height: 368, immersive: true },
    { width: 844, height: 345, immersive: true },
    { width: 740, height: 315, immersive: true },
  ];
  for (const input of options) {
    const view = projectPanoramicCanvasViewport(input);
    const stageHeight = input.height - (input.height <= 390 ? 42 : 45);
    assert.equal(view.height, CANVAS_HEIGHT);
    assert.ok(view.width > CANVAS_WIDTH, `not panoramic: ${view.width}`);
    assert.ok(Math.abs((view.width / view.height) - input.width / stageHeight) < .003,
      "world viewport aspect must match real stage, not CSS stretch");
  }
});

test("UX02 native pointer world projection preserves camera midpoint and uniform scale", () => {
  const w = projectPanoramicCanvasViewport({width: 915, height: 368, immersive:true});
  const cssWidth = 915, cssHeight = 368 - 42, zoom = .93;
  const camera = {x:110,y:72};
  const pointer = {x:cssWidth *.75,y:cssHeight *.65};
  const world = {
    x: camera.x + pointer.x * w.width / cssWidth / zoom,
    y: camera.y + pointer.y * w.height / cssHeight / zoom,
  };
  assert.ok(Number.isFinite(world.x) && Number.isFinite(world.y));
  const ratioX=w.width / cssWidth, ratioY=w.height / cssHeight;
  assert.ok(Math.abs(ratioX-ratioY)<.005, "nonuniform mobile projection");
  assert.ok(world.x>camera.x+w.width/2/zoom);
});
