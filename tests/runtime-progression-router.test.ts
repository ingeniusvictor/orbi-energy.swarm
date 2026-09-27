import assert from "node:assert/strict";
import test from "node:test";

import { createInfiniteSession } from "../src/game/infiniteSession.ts";
import {
  advanceInfiniteRuntimeState,
  createCampaignRuntimeState,
  createInfiniteRuntimeState,
  getRuntimeSector,
  getRuntimeWaveNumber,
  resolveRuntimeWaveDescriptor,
} from "../src/game/runtimeProgressionRouter.ts";
import {
  createCampaignRuntimeWaveDescriptor,
  infiniteDescriptorMatchesSession,
} from "../src/game/runtimeWaveDescriptor.ts";

test("campaign runtime router preserves handcrafted descriptor contracts", () => {
  for (let sector = 1; sector <= 10; sector += 1) {
    const state = createCampaignRuntimeState(sector);
    assert.deepEqual(
      resolveRuntimeWaveDescriptor(state),
      createCampaignRuntimeWaveDescriptor(sector),
    );
    assert.equal(getRuntimeSector(state), sector);
    assert.equal(getRuntimeWaveNumber(state), sector);
  }
});

test("campaign runtime router rejects Sector 11 and invalid sectors", () => {
  assert.throws(() => createCampaignRuntimeState(0), RangeError);
  assert.throws(() => createCampaignRuntimeState(11), RangeError);
  assert.throws(() => createCampaignRuntimeState(1.5), RangeError);
});

test("infinite runtime router resolves Sector 11 without campaign fallback", () => {
  const session = createInfiniteSession("router-seed");
  const state = createInfiniteRuntimeState(session);
  const descriptor = resolveRuntimeWaveDescriptor(state);

  assert.equal(state.mode, "INFINITE");
  assert.equal(getRuntimeSector(state), 11);
  assert.equal(getRuntimeWaveNumber(state), 1);
  assert.equal(descriptor.sourceMode, "INFINITE");
  assert.equal(descriptor.sector, 11);
  assert.equal(
    infiniteDescriptorMatchesSession(descriptor, session),
    true,
  );
});

test("infinite runtime advancement crosses waves and sectors deterministically", () => {
  let state = createInfiniteRuntimeState(
    createInfiniteSession("router-advance-seed"),
  );

  const initialSession =
    state.mode === "INFINITE" ? state.session : null;
  assert.ok(initialSession);
  const waveCount = initialSession.currentPlan.executionPlans.length;

  for (let i = 0; i < waveCount; i += 1) {
    state = advanceInfiniteRuntimeState(state);
  }

  assert.equal(state.mode, "INFINITE");
  if (state.mode !== "INFINITE") return;

  assert.equal(state.session.currentSector, 12);
  assert.equal(state.session.currentWaveNumber, 1);
  assert.equal(state.session.sectorsCompleted, 1);
  assert.equal(state.session.wavesCompleted, waveCount);
});

test("campaign state cannot use infinite advancement", () => {
  assert.throws(
    () => advanceInfiniteRuntimeState(createCampaignRuntimeState(10)),
    RangeError,
  );
});

test("ended infinite sessions fail closed at router adoption", () => {
  const session = createInfiniteSession("ended-session");
  const ended = { ...session, status: "DEFEATED" as const };

  assert.throws(
    () => createInfiniteRuntimeState(ended),
    RangeError,
  );
});
