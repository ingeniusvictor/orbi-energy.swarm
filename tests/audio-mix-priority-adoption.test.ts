import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path: string) =>
  readFileSync(
    new URL(`../${path}`, import.meta.url),
    "utf8",
  );

const audio = read("src/game/audio.ts");
const game = read("src/game/EnergySwarmGame.tsx");

const section = (
  source: string,
  start: string,
  end: string,
) => {
  const a = source.indexOf(start);
  const b = source.indexOf(
    end,
    a + start.length,
  );
  assert.ok(a >= 0, `Missing start: ${start}`);
  assert.ok(b > a, `Missing end: ${end}`);
  return source.slice(a, b);
};

test("audio engine owns an extend-only tactical priority window", () => {
  assert.ok(
    audio.includes("let tacticalPriorityUntil = 0;"),
  );
  assert.ok(
    audio.includes(
      "ctx.currentTime < tacticalPriorityUntil",
    ),
  );
  assert.ok(
    audio.includes(
      "extendTacticalPriorityWindow(",
    ),
  );
});

test("shared createGain applies lane-aware mix without changing decay timing", () => {
  const helper = section(
    audio,
    "function createGain(",
    "// 1. Player/Swarm Shoot Sound",
  );

  assert.ok(
    helper.includes(
      'lane: AudioMixLane = "STANDARD"',
    ),
  );
  assert.ok(
    helper.includes(
      "laneGain(ctx, startVal, lane)",
    ),
  );
  assert.ok(
    helper.includes(
      "ctx.currentTime + duration",
    ),
  );
});

test("BGM computes historical base volume then applies BGM lane mix", () => {
  const bgm = section(
    audio,
    "export const startBgm",
    "// --- BOSS SPECIAL PROCEDURAL AUDIO LAYERS",
  );

  assert.ok(
    bgm.includes(
      'intensity === "BOSS"\n        ? 0.04',
    ),
  );
  assert.ok(
    bgm.includes(
      'intensity === "HIGH_INTENSITY"\n          ? 0.03',
    ),
  );
  assert.ok(bgm.includes(": 0.05;"));
  assert.ok(
    bgm.includes(
      'laneGain(\n      ctx,\n      baseVolume,\n      "BGM"',
    ),
  );
});

test("all dedicated boss cues open tactical priority before emitting audio", () => {
  const specs = [
    ["playBossArrivalSound", "playBossPhaseTransitionSound"],
    ["playBossPhaseTransitionSound", "playBossChargeSound"],
    ["playBossChargeSound", "playBossShardsSound"],
    ["playBossShardsSound", "playBossPulseSound"],
  ] as const;

  for (const [start, end] of specs) {
    const cue = section(
      audio,
      `export const ${start}`,
      `export const ${end}`,
    );
    assert.ok(
      cue.includes("beginTacticalPriority("),
      `${start} must open a priority window`,
    );
  }

  const pulse = audio.slice(
    audio.indexOf(
      "export const playBossPulseSound",
    ),
  );
  assert.ok(
    pulse.includes("beginTacticalPriority("),
  );
});

test("boss helper gains stay on the TACTICAL lane", () => {
  const arrival = section(
    audio,
    "export const playBossArrivalSound",
    "export const playBossPhaseTransitionSound",
  );
  const phase = section(
    audio,
    "export const playBossPhaseTransitionSound",
    "export const playBossChargeSound",
  );
  const shards = section(
    audio,
    "export const playBossShardsSound",
    "export const playBossPulseSound",
  );
  const pulse = audio.slice(
    audio.indexOf(
      "export const playBossPulseSound",
    ),
  );

  for (const cue of [
    arrival,
    phase,
    shards,
    pulse,
  ]) {
    assert.ok(cue.includes('"TACTICAL"'));
  }
});

test("shared disruptor cues support tactical priority without changing ordinary default", () => {
  const charge = section(
    audio,
    "export const playDisruptorChargeSound",
    "// 15. Disruptor Pulse Sound",
  );
  const pulse = section(
    audio,
    "export const playDisruptorPulseSound",
    "// 16. Elite Charge Sound",
  );

  for (const cue of [charge, pulse]) {
    assert.ok(
      cue.includes("tacticalPriority = false"),
    );
    assert.ok(
      cue.includes(
        'tacticalPriority ? "TACTICAL" : "STANDARD"',
      ),
    );
    assert.ok(
      cue.includes("beginTacticalPriority("),
    );
  }
});

test("boss dispatch explicitly promotes shared disruptor cues while ordinary calls remain standard", () => {
  assert.ok(
    game.includes(
      'chosen.id === "gravity_well") playDisruptorChargeSound(true)',
    ),
  );
  assert.ok(
    game.includes(
      'chosen.id === "blackout_sweep") playDisruptorPulseSound(true)',
    ),
  );
  assert.ok(
    game.includes(
      'chosen.id === "rotating_eclipse_lanes") playDisruptorPulseSound(true)',
    ),
  );

  assert.ok(
    game.includes("playDisruptorChargeSound();"),
  );
  assert.ok(
    game.includes("playDisruptorPulseSound();"),
  );
});

test("audio priority adoption does not alter boss timing constants or attack state", () => {
  const dispatchStart = game.indexOf(
    'if (chosen.id === "devourer_beam")',
  );
  assert.ok(dispatchStart >= 0);
  const dispatch = game.slice(
    dispatchStart,
    dispatchStart + 1800,
  );

  assert.ok(!dispatch.includes("bossAttackTelegraphRef.current ="));
  assert.ok(!dispatch.includes("bossAttackDurationRef.current ="));
  assert.ok(!dispatch.includes("damage:"));
});
