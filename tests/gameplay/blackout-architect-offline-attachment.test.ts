import assert from "node:assert/strict";
import test from "node:test";
import {
  createBlackoutArchitectOfflineCandidateFactory,
} from "../../src/game/blackoutArchitectOfflineEncounterFactory";
import {
  BLACKOUT_ARCHITECT_OFFLINE_REFERENCE_ATTACHMENT_AUTHORITY,
  createBlackoutArchitectOfflineReferenceAttachmentOwner,
} from "../../src/game/blackoutArchitectOfflineReferenceAttachment";

test("Only the same offline owner's current candidate and exact opaque object attach", () => {
  const factory = createBlackoutArchitectOfflineCandidateFactory();
  const owner = createBlackoutArchitectOfflineReferenceAttachmentOwner(factory);
  const candidate = factory.begin(7);
  assert.ok(candidate);
  const boss = { anyCallerSuppliedObject: true };
  const view = owner.attach(candidate, boss, 7);
  assert.ok(view);
  assert.ok(Object.isFrozen(view));
  assert.equal(view.mode, "ATTACHMENT_REHEARSAL_ONLY");
  assert.equal(view.encounterOrdinal, candidate.encounterOrdinal);
  assert.equal(owner.isAttached(candidate, boss, 7), true);
  assert.strictEqual(owner.getCurrent(), view);
  for (const [name, value] of Object.entries(view)) {
    if (typeof value === "boolean") assert.equal(value, false, name);
  }
  const capabilities = Object.entries(BLACKOUT_ARCHITECT_OFFLINE_REFERENCE_ATTACHMENT_AUTHORITY);
  assert.ok(Object.isFrozen(BLACKOUT_ARCHITECT_OFFLINE_REFERENCE_ATTACHMENT_AUTHORITY));
  assert.deepEqual(capabilities.filter(([, value]) => value === true).map(([key]) => key),
    ["ownsIsolatedReferenceAttachmentRehearsalOnly"]);
  assert.ok(capabilities.every(([key, value]) =>
    key === "ownsIsolatedReferenceAttachmentRehearsalOnly" ? value === true : value === false));
  assert.equal(owner.attach(candidate, boss, 7), null, "duplicate fails closed");
  assert.equal(owner.getCurrent(), null);
});

test("Cross factory, clones, other boss reference and stale owner revoke", () => {
  const factory = createBlackoutArchitectOfflineCandidateFactory();
  const otherFactory = createBlackoutArchitectOfflineCandidateFactory();
  const owner = createBlackoutArchitectOfflineReferenceAttachmentOwner(factory);
  const first = factory.begin(11);
  assert.ok(first);
  const boss = Object.freeze({ id: "offline-only" });
  assert.equal(owner.attach({ ...first }, boss, 11), null, "cloned record never current");
  const foreign = otherFactory.begin(11);
  assert.ok(foreign);
  assert.equal(owner.attach(foreign, boss, 11), null, "cross-factory record rejected");
  assert.ok(owner.attach(first, boss, 11));
  assert.equal(owner.isAttached(first, { ...boss }, 11), false);
  assert.equal(owner.getCurrent(), null);
  assert.ok(owner.attach(first, boss, 11));
  const replaced = factory.begin(11);
  assert.ok(replaced);
  assert.equal(owner.getCurrent(), null, "replaced owner identity invalidates attachment");
  assert.equal(owner.attach(first, boss, 11), null, "old record never admitted");
  assert.ok(owner.attach(replaced, boss, 11));
  factory.revoke();
  assert.equal(owner.isAttached(replaced, boss, 11), false);
  assert.equal(owner.getCurrent(), null);
});

test("Invalid epochs, references, accessors and throwing proxies fail closed", () => {
  const factory = createBlackoutArchitectOfflineCandidateFactory();
  const owner = createBlackoutArchitectOfflineReferenceAttachmentOwner(factory);
  const c = factory.begin(3);
  assert.ok(c);
  const boss = {};
  const wrongEpochs: unknown[] = [0, -0, -1, NaN, Infinity, -Infinity,
    2.1, Number.MAX_SAFE_INTEGER + 1, "3", null, undefined, 4];
  for (const epoch of wrongEpochs) {
    assert.equal(owner.attach(c, boss, epoch), null, String(epoch));
    assert.equal(owner.getCurrent(), null);
  }
  for (const reference of [null, 3, "boss", true, [], () => {}, undefined]) {
    assert.equal(owner.attach(c, reference, 3), null, String(reference));
  }
  const throwing = new Proxy({}, { getPrototypeOf() { throw Error("trap"); },
    getOwnPropertyDescriptor() { throw Error("trap"); } });
  assert.equal(owner.attach(throwing, boss, 3), null);
  assert.equal(owner.attach(c, new Proxy([], { getPrototypeOf() { throw Error("trap"); } }), 3), null);
  assert.ok(owner.attach(c, boss, 3));
  assert.equal(owner.isAttached(c, boss, 4), false);
  assert.equal(owner.getCurrent(), null);
  assert.ok(owner.attach(c, boss, 3));
  assert.equal(owner.revoke(), null);
  assert.equal(owner.getCurrent(), null);
  assert.equal(owner.isAttached(c, boss, 3), false);
});

test("Owner functions have no runtime provenance even for caller-created objects", () => {
  const f = createBlackoutArchitectOfflineCandidateFactory();
  const o = createBlackoutArchitectOfflineReferenceAttachmentOwner(f);
  const c = f.begin(1);
  assert.ok(c);
  const userFakeBoss = { type: "BOSS_TITAN", bossChassis: "TITAN_CORE", id: "blackout_architect" };
  const v = o.attach(c, userFakeBoss, 1);
  assert.ok(v);
  assert.equal(v.authenticatedLiveBossReference, false);
  assert.equal(v.engineEpochAuthenticated, false);
  assert.equal(v.engineEncounterIssued, false);
  assert.equal(v.physicalCardinalGeometryVerified, false);
  assert.equal(v.collisionProvenanceVerified, false);
  assert.equal(v.projectileConsumptionAuthorized, false);
  assert.equal(v.bossSpawnOrAttackAuthorized, false);
  assert.equal(v.bossHealthOrDamageAuthorized, false);
});
