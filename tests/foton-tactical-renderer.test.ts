import assert from "node:assert/strict";
import test from "node:test";

import {
  projectFotonTacticalPose,
} from "../src/game/fotonTacticalRenderer.ts";

test("tactical Foton lens points toward cursor without moving the avatar body", () => {
  const right = projectFotonTacticalPose(
    1000,
    10,
    20,
    100,
    20,
  );
  assert.ok(Math.abs(right.facingAngle) < 1e-9);
  assert.ok(right.lensOffsetX > 1.5);
  assert.ok(Math.abs(right.lensOffsetY) < 1e-9);

  const down = projectFotonTacticalPose(
    1000,
    10,
    20,
    10,
    100,
  );
  assert.ok(
    Math.abs(down.facingAngle - Math.PI / 2) <
      1e-9,
  );
  assert.ok(down.lensOffsetY > 1.5);
});

test("tactical Foton shell pulse stays visually subtle", () => {
  for (let time = 0; time < 20000; time += 137) {
    const pose = projectFotonTacticalPose(
      time,
      0,
      0,
      100,
      0,
    );
    assert.ok(pose.shellPulse >= 0.975);
    assert.ok(pose.shellPulse <= 1.025);
  }
});

test("scan angle advances deterministically from elapsed gameplay time", () => {
  const first = projectFotonTacticalPose(
    1000,
    0,
    0,
    1,
    0,
  );
  const second = projectFotonTacticalPose(
    2000,
    0,
    0,
    1,
    0,
  );

  assert.ok(second.scanAngle > first.scanAngle);
  assert.equal(
    second.scanAngle - first.scanAngle,
    1.8,
  );
});
