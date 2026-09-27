import assert from "node:assert/strict";
import test from "node:test";

import {
  campaignDescriptorMatchesWaveConfig,
  createCampaignRuntimeWaveDescriptor,
  createInfiniteRuntimeWaveDescriptor,
  infiniteDescriptorMatchesSession,
} from "../src/game/runtimeWaveDescriptor.ts";
import {
  advanceInfiniteSession,
  createInfiniteSession,
} from "../src/game/infiniteSession.ts";
import {
  BOSS_WAVE_NUMBER,
  getWaveConfig,
} from "../src/game/waveDirector.ts";

test("campaign descriptors reproduce handcrafted WaveConfig values for Sectors 1–10", () => {
  for (let wave = 1; wave <= BOSS_WAVE_NUMBER; wave += 1) {
    const cfg = getWaveConfig(wave);
    const descriptor = createCampaignRuntimeWaveDescriptor(wave);

    assert.equal(
      campaignDescriptorMatchesWaveConfig(descriptor, cfg),
      true,
      `Campaign wave ${wave} descriptor drifted from WaveConfig`,
    );
    assert.notEqual(
      descriptor.spawn.enemyComposition,
      cfg.enemyComposition,
    );
  }
});

test("campaign completion policies preserve timebox vs boss-defeat semantics", () => {
  for (let wave = 1; wave < BOSS_WAVE_NUMBER; wave += 1) {
    const descriptor = createCampaignRuntimeWaveDescriptor(wave);
    assert.equal(descriptor.completionPolicy.type, "TIMEBOX");
    if (descriptor.completionPolicy.type === "TIMEBOX") {
      assert.equal(
        descriptor.completionPolicy.durationMs,
        getWaveConfig(wave).duration,
      );
    }
  }

  assert.equal(
    createCampaignRuntimeWaveDescriptor(BOSS_WAVE_NUMBER)
      .completionPolicy.type,
    "BOSS_DEFEAT",
  );
});

test("campaign descriptor rejects values outside the handcrafted 1–10 range", () => {
  assert.throws(
    () => createCampaignRuntimeWaveDescriptor(0),
    RangeError,
  );
  assert.throws(
    () => createCampaignRuntimeWaveDescriptor(11),
    RangeError,
  );
  assert.throws(
    () => createCampaignRuntimeWaveDescriptor(1.5),
    RangeError,
  );
});

test("infinite descriptor maps the current session execution plan exactly", () => {
  const session = createInfiniteSession("descriptor-cert");
  const descriptor = createInfiniteRuntimeWaveDescriptor(session);

  assert.equal(
    infiniteDescriptorMatchesSession(descriptor, session),
    true,
  );
  assert.equal(descriptor.sourceMode, "INFINITE");
  assert.equal(
    descriptor.completionPolicy.type,
    "BUDGET_AND_CLEAR",
  );
  assert.equal(descriptor.sector, 11);
  assert.equal(descriptor.waveNumber, 1);
});

test("infinite descriptors remain equivalent while session advances through Sector 1000", () => {
  let session = createInfiniteSession("descriptor-range-cert");

  while (session.currentSector < 1000) {
    const descriptor =
      createInfiniteRuntimeWaveDescriptor(session);

    assert.equal(
      infiniteDescriptorMatchesSession(descriptor, session),
      true,
      `Descriptor mismatch at Sector ${session.currentSector} Wave ${session.currentWaveNumber}`,
    );
    assert.equal(
      descriptor.completionPolicy.type,
      "BUDGET_AND_CLEAR",
    );

    session = advanceInfiniteSession(session);
  }

  const finalDescriptor =
    createInfiniteRuntimeWaveDescriptor(session);
  assert.equal(
    infiniteDescriptorMatchesSession(finalDescriptor, session),
    true,
  );
});

test("campaign and infinite descriptors remain source-distinct", () => {
  const campaign = createCampaignRuntimeWaveDescriptor(1);
  const infinite = createInfiniteRuntimeWaveDescriptor(
    createInfiniteSession("source-distinction"),
  );

  assert.equal(campaign.sourceMode, "CAMPAIGN");
  assert.equal(campaign.source.recipeId, null);
  assert.ok(campaign.source.campaignWaveId);

  assert.equal(infinite.sourceMode, "INFINITE");
  assert.equal(infinite.source.campaignWaveId, null);
  assert.ok(infinite.source.recipeId);
  assert.ok(infinite.source.waveId);
});
