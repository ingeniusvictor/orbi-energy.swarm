import assert from "node:assert/strict";
import test from "node:test";

import {
  ORBI_ATTACK_PROFILES,
  getFallbackAttackSignatureForAffinity,
  getOrbiAttackProfile,
} from "../src/game/orbiAttackProfiles.ts";

const signatures = Object.keys(ORBI_ATTACK_PROFILES);

test("all ten canonical energy signatures have one bounded attack profile", () => {
  assert.equal(signatures.length, 10);
  assert.equal(new Set(signatures).size, 10);
  assert.equal(
    new Set(Object.values(ORBI_ATTACK_PROFILES).map((profile) => profile.shape)).size,
    10,
  );
  for (const profile of Object.values(ORBI_ATTACK_PROFILES)) {
    assert.ok(profile.projectileSize > 0 && profile.projectileSize <= 5.6);
    assert.ok(profile.cooldownFrames >= 40 && profile.cooldownFrames <= 82);
    assert.ok(profile.lifetimeMs >= 1000 && profile.lifetimeMs <= 1800);
  }
});

test("signature behaviors are genuinely distinct rather than recolored lasers", () => {
  assert.ok(getOrbiAttackProfile("HYDRO_PULSE").slowDurationMs > 0);
  assert.ok(getOrbiAttackProfile("AERO_CRESCENT").pushMultiplier > 2);
  assert.ok(getOrbiAttackProfile("TERMO_BURST").splashRadius > 50);
  assert.ok(getOrbiAttackProfile("MAGNE_ARC").magneticPullRadius > 0);
  assert.ok(getOrbiAttackProfile("ATON_PARTICLE").damageMultiplier > 2);
  assert.ok(getOrbiAttackProfile("KINETRIX_LANCE").criticalChance > 0);
  assert.ok(getOrbiAttackProfile("H2NOVA_CELL").supportShieldRestore > 0);
  assert.ok(getOrbiAttackProfile("QUANTUM_PHASE").echoAngleRadians > 0);
  assert.equal(getOrbiAttackProfile("FOTON_LANCE").shape, "LANCE");
  assert.equal(getOrbiAttackProfile("GAIA_SYNTHESIS").shape, "SYNTHESIS");
});

test("legacy affinity fallbacks map into canonical signatures", () => {
  assert.equal(getFallbackAttackSignatureForAffinity("solar"), "FOTON_LANCE");
  assert.equal(getFallbackAttackSignatureForAffinity("hydro"), "HYDRO_PULSE");
  assert.equal(getFallbackAttackSignatureForAffinity("wind"), "AERO_CRESCENT");
  assert.equal(getFallbackAttackSignatureForAffinity("thermal"), "TERMO_BURST");
  assert.equal(getFallbackAttackSignatureForAffinity("magnetic"), "MAGNE_ARC");
  assert.equal(getFallbackAttackSignatureForAffinity("nuclear"), "ATON_PARTICLE");
  assert.equal(getFallbackAttackSignatureForAffinity("kinetic"), "KINETRIX_LANCE");
  assert.equal(getFallbackAttackSignatureForAffinity("hydrogen"), "H2NOVA_CELL");
  assert.equal(getFallbackAttackSignatureForAffinity("quantum"), "QUANTUM_PHASE");
  assert.equal(getFallbackAttackSignatureForAffinity("gaia"), "GAIA_SYNTHESIS");
});
