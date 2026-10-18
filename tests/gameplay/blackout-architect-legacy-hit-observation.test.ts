import assert from "node:assert/strict";
import test from "node:test";
import type { Projectile } from "../../src/game/types";
import {
  BLACKOUT_ARCHITECT_LEGACY_HIT_OBSERVATION_AUTHORITY_CONTRACT,
  observeBlackoutArchitectLegacyPlayerHit,
} from "../../src/game/blackoutArchitectLegacyHitObservation";

const shot = (): Projectile => ({
  id: "original-unchanged-id", x: 10, y: 5, vx: 0, vy: 0,
  damage: 7, color: "#fff", size: 3, fromPlayer: true, life: 0, maxLife: 200,
  collisionTraceRunEpoch: 3, collisionTracePhysicsFrame: 10,
  collisionTraceProjectileOrdinal: 5,
});

test("J9L-B1 marks exactly one actual consumed player shot for either legacy hit kind", () => {
  for (const kind of ["LEGACY_SHIELD_NODE", "LEGACY_ENEMY"] as const) {
    const projectile=shot(), originalId=projectile.id, originalDamage=projectile.damage;
    assert.equal(observeBlackoutArchitectLegacyPlayerHit(projectile,3,11,kind),true);
    assert.equal(projectile.collisionTraceObservedLegacyHitFrame,11);
    assert.equal(projectile.collisionTraceObservedLegacyHitKind,kind);
    assert.equal(projectile.id,originalId);
    assert.equal(projectile.damage,originalDamage);
    assert.equal(projectile.life,0);
    assert.equal(observeBlackoutArchitectLegacyPlayerHit(projectile,3,12,kind),false);
    assert.equal(observeBlackoutArchitectLegacyPlayerHit(projectile,3,12,kind==="LEGACY_ENEMY"?"LEGACY_SHIELD_NODE":"LEGACY_ENEMY"),false);
    assert.equal(projectile.collisionTraceObservedLegacyHitFrame,11);
    assert.equal(projectile.collisionTraceObservedLegacyHitKind,kind);
  }
});

test("J9L-B1 malformed/untraced/stale/exhausted projectiles always leave state unchanged", () => {
  const cases: [Partial<Projectile>,number|null,number|null,string][] = [
    [{life:1},3,11,"LEGACY_ENEMY"],
    [{life:NaN},3,11,"LEGACY_ENEMY"],
    [{life:-Infinity},3,11,"LEGACY_ENEMY"],
    [{fromPlayer:false},3,11,"LEGACY_ENEMY"],
    [{collisionTraceRunEpoch:undefined},3,11,"LEGACY_ENEMY"],
    [{collisionTraceRunEpoch:2},3,11,"LEGACY_ENEMY"],
    [{collisionTraceRunEpoch:-1},3,11,"LEGACY_ENEMY"],
    [{collisionTraceRunEpoch:3},null,11,"LEGACY_ENEMY"],
    [{collisionTraceRunEpoch:3},0,11,"LEGACY_ENEMY"],
    [{collisionTraceRunEpoch:3},Number.MAX_SAFE_INTEGER+1,11,"LEGACY_ENEMY"],
    [{collisionTracePhysicsFrame:undefined},3,11,"LEGACY_ENEMY"],
    [{collisionTracePhysicsFrame:12},3,11,"LEGACY_ENEMY"],
    [{collisionTracePhysicsFrame:-1},3,11,"LEGACY_ENEMY"],
    [{collisionTraceProjectileOrdinal:undefined},3,11,"LEGACY_ENEMY"],
    [{collisionTraceProjectileOrdinal:0},3,11,"LEGACY_ENEMY"],
    [{collisionTraceProjectileOrdinal:NaN},3,11,"LEGACY_ENEMY"],
    [{},3,null,"LEGACY_ENEMY"],
    [{},3,-1,"LEGACY_ENEMY"],
    [{},3,Number.MAX_SAFE_INTEGER+1,"LEGACY_ENEMY"],
    [{},3,11,"CORE"],
    [{collisionTraceObservedLegacyHitFrame:undefined},3,11,"LEGACY_ENEMY"],
    [{collisionTraceObservedLegacyHitKind:undefined},3,11,"LEGACY_ENEMY"],
  ];
  for(const [change,run,frame,kind] of cases){
    const projectile={...shot(),...change};
    const before={...projectile};
    assert.equal(observeBlackoutArchitectLegacyPlayerHit(projectile,run,frame,kind as "LEGACY_ENEMY"),false,JSON.stringify(change));
    assert.deepEqual(projectile,before,JSON.stringify(change));
  }
});

test("J9L-B1 rejects non-extensible or inherited projectile object and remains observation-only", () => {
  const frozen=Object.freeze(shot());
  assert.equal(observeBlackoutArchitectLegacyPlayerHit(frozen,3,11,"LEGACY_ENEMY"),false);
  const inherited=Object.create(shot()) as Projectile;
  assert.equal(observeBlackoutArchitectLegacyPlayerHit(inherited,3,11,"LEGACY_ENEMY"),false);
  const c=BLACKOUT_ARCHITECT_LEGACY_HIT_OBSERVATION_AUTHORITY_CONTRACT;
  assert.equal(Object.isFrozen(c),true);
  assert.deepEqual(Object.entries(c).filter(([,v])=>v).map(([k])=>k),["ownsPassiveLegacyPlayerHitObservationAuthority"]);
});
