import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  getBossCounterHint,
  resolveBossAttackId,
} from "../src/game/bossTelegraphGuide.ts";
import { BLACKOUT_DEVOURER_CANON } from "../src/game/waveDirector.ts";

test("all canonical Devourer attacks resolve localized counterplay hints", () => {
  for (const attack of BLACKOUT_DEVOURER_CANON.attacks) {
    assert.equal(
      resolveBossAttackId(attack.displayName, BLACKOUT_DEVOURER_CANON.attacks),
      attack.id,
    );
    assert.ok(getBossCounterHint(attack.id, "es"));
    assert.ok(getBossCounterHint(attack.id, "en"));
  }
});

test("attack resolution supports canonical IDs and rejects unknown labels", () => {
  assert.equal(
    resolveBossAttackId("devourer_charge", BLACKOUT_DEVOURER_CANON.attacks),
    "devourer_charge",
  );
  assert.equal(
    resolveBossAttackId("Unknown Cataclysm", BLACKOUT_DEVOURER_CANON.attacks),
    null,
  );
  assert.equal(getBossCounterHint("unknown_attack", "en"), null);
});

test("boss HUD keeps counter hints behind existing label visibility", () => {
  const hud = readFileSync(
    new URL("../src/components/BossHudOverlay.tsx", import.meta.url),
    "utf8",
  );

  assert.match(hud, /showAttack && bossAttackName/);
  assert.match(hud, /getBossCounterHint/);
  assert.match(hud, /orbi-boss-counter-hint/);
  assert.match(hud, /bossLabelsMode !== "OFF"/);
});
