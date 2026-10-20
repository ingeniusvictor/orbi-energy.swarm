import assert from "node:assert/strict";
import test from "node:test";
import {
  BLACKOUT_ARCHITECT_DORMANT_REVOCATION_AUTHORITY_CONTRACT,
  revokeBlackoutArchitectDormantEncounter,
  type BlackoutArchitectDormantEncounterSlot,
} from "../../src/game/blackoutArchitectDormantEncounterRevocation";

test("B2B2A null-only slot revokes deterministically, without issuing identity", () => {
  const initial: BlackoutArchitectDormantEncounterSlot = null;
  assert.equal(revokeBlackoutArchitectDormantEncounter(), initial);
  assert.equal(revokeBlackoutArchitectDormantEncounter(), null);
  const contract = BLACKOUT_ARCHITECT_DORMANT_REVOCATION_AUTHORITY_CONTRACT;
  assert.ok(Object.isFrozen(contract));
  const entries = Object.entries(contract);
  assert.equal(entries.filter(([,value]) => value === true).length,1);
  assert.equal(contract.ownsDormantEncounterRevocationOnly,true);
  assert.ok(entries.every(([key,value])=>key==="ownsDormantEncounterRevocationOnly" ? value===true : value===false));
});
