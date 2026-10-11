import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const frameHealth = readFileSync(
  new URL("../src/game/frameHealthMonitor.ts", import.meta.url),
  "utf8",
);
const overlay = readFileSync(
  new URL("../src/components/PerformanceDiagnosticsOverlay.tsx", import.meta.url),
  "utf8",
);
const protocol = readFileSync(
  new URL("../docs/GAIA_RUNTIME_CERTIFICATION.md", import.meta.url),
  "utf8",
);

const numericConstant = (name) => {
  const match = frameHealth.match(
    new RegExp(`export const ${name} = ([0-9.]+);`),
  );
  assert.ok(match, `missing frame-health constant ${name}`);
  return Number(match[1]);
};

test("GAIA certification protocol mirrors canonical frame-health thresholds", () => {
  const windowMs = numericConstant("FRAME_HEALTH_WINDOW_MS");
  const slowMs = numericConstant("FRAME_HEALTH_SLOW_FRAME_MS");
  const criticalMs = numericConstant("FRAME_HEALTH_CRITICAL_FRAME_MS");
  const pressuredWindows = numericConstant(
    "FRAME_HEALTH_REQUIRED_PRESSURE_WINDOWS",
  );

  assert.match(protocol, new RegExp(`\\*\\*${windowMs} ms \\(5 s\\)\\*\\*`));
  assert.match(protocol, new RegExp(`\\*\\*${slowMs} ms\\*\\*`));
  assert.match(protocol, new RegExp(`\\*\\*${criticalMs} ms\\*\\*`));
  assert.match(
    protocol,
    new RegExp(`\\*\\*${pressuredWindows} consecutive pressured windows\\*\\*`),
  );

  for (const status of ["HEALTHY", "PRESSURED", "CRITICAL"]) {
    assert.match(frameHealth, new RegExp(`"${status}"`));
    assert.match(protocol, new RegExp(`\\*\\*${status}\\*\\*`));
  }
});

test("manual evidence protocol tracks every current F3 performance label", () => {
  const labels = [
    "FPS",
    "FRAME",
    "CPU WORK",
    "PHYSICS",
    "RENDER",
    "OVERHEAD",
    "PEAK CPU",
    "ENEMIES",
    "PROJECTILES",
    "PARTICLES",
    "SWARM",
  ];

  for (const label of labels) {
    assert.ok(overlay.includes(label), `F3 overlay missing ${label}`);
    assert.ok(protocol.includes(`\`${label}\``), `protocol missing ${label}`);
  }
});

test("manual evidence protocol tracks the ES-12G1 GAIA F3 surface", () => {
  for (const label of ["GAIA", "SYNC", "CYCLES"]) {
    assert.ok(overlay.includes(label), `F3 overlay missing ${label}`);
    assert.ok(protocol.includes(`\`${label}\``), `protocol missing ${label}`);
  }

  assert.ok(protocol.includes("ACTIVE · L1"));
  assert.ok(protocol.includes("DORMANT"));
  assert.ok(protocol.includes("15 s"));
  assert.ok(protocol.includes("Do not close #202"));
});

test("protocol distinguishes loop timing from operating-system CPU percentage", () => {
  assert.match(
    protocol,
    /CPU WORK.*game-loop work measured in milliseconds[\s\S]*not.*operating-system CPU utilization/i,
  );
});
