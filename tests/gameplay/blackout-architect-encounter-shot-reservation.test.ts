import assert from "node:assert/strict";
import test from "node:test";
import {
  BLACKOUT_ARCHITECT_SHOT_RESERVATION_AUTHORITY_CONTRACT,
  createBlackoutArchitectEncounterShotReservation,
} from "../../src/game/blackoutArchitectEncounterShotReservation";

const player=()=>({
  id:"not-an-authenticated-id",
  fromPlayer:true,life:250,
  collisionTraceRunEpoch:3,
  collisionTracePhysicsFrame:12,
  collisionTraceProjectileOrdinal:7,
  x:10,y:20,damage:9,
});

test("J9L-B2A one per-reference reservation across cardinal IDs and later frames",()=>{
  for(const anchorId of ["NORTH","EAST","SOUTH","WEST"] as const){
    const ledger=createBlackoutArchitectEncounterShotReservation(3);
    assert.ok(ledger);
    assert.ok(Object.isFrozen(ledger));
    const p=player(),before=structuredClone(p);
    const result=ledger.reserve(p,12,anchorId);
    assert.deepEqual(result,{
      bossId:"BLACKOUT_ARCHITECT",
      reservationMode:"RESERVED_ONLY",
      runEpoch:3,
      frameSequence:12,
      projectileOrdinal:7,
      anchorId,
      collisionProvenanceVerified:false,
      projectileIdentityAuthenticated:false,
      consumesProjectile:false,
      preventsGlobalReplay:false,
      authorizesDamage:false,
      mutatesHealth:false,
    });
    assert.ok(Object.isFrozen(result));
    assert.deepEqual(p,before);
    assert.equal(ledger.reserve(p,12,"EAST"),null);
    assert.equal(ledger.reserve(p,25,"WEST"),null);
    assert.deepEqual(p,before);
  }
});

test("J9L-B2A rejects bad epoch or invalid projectile without reserving it",()=>{
  for(const invalid of [null,undefined,"3",true,0,-0,-1,0.25,NaN,Infinity,Number.MAX_SAFE_INTEGER+1])
    assert.equal(createBlackoutArchitectEncounterShotReservation(invalid),null);
  const ledger=createBlackoutArchitectEncounterShotReservation(3);
  assert.ok(ledger);
  for(const bad of [
    null,{},[],true,5,"x",
    {...player(),fromPlayer:false},
    {...player(),life:0},{...player(),life:-1},{...player(),life:NaN},{...player(),life:Infinity},
    {...player(),collisionTraceRunEpoch:2},
    {...player(),collisionTraceRunEpoch:0},
    {...player(),collisionTraceRunEpoch:NaN},
    {...player(),collisionTracePhysicsFrame:-1},
    {...player(),collisionTracePhysicsFrame:-0},
    {...player(),collisionTracePhysicsFrame:NaN},
    {...player(),collisionTracePhysicsFrame:1.5},
    {...player(),collisionTracePhysicsFrame:Number.MAX_SAFE_INTEGER+1},
    {...player(),collisionTraceProjectileOrdinal:0},
    {...player(),collisionTraceProjectileOrdinal:Infinity},
    {...player(),collisionTraceProjectileOrdinal:"7"},
    {...player(),collisionTraceObservedLegacyHitFrame:12},
    {...player(),collisionTraceObservedLegacyHitKind:"LEGACY_ENEMY"},
    Object.freeze(player()),Object.seal(player()),
    Object.create(player()),
  ]) assert.equal(ledger.reserve(bad,12,"NORTH"),null);
  const p=player();
  for(const badFrame of [null,undefined,NaN,-1,-0,Infinity,11,12.4,Number.MAX_SAFE_INTEGER+1])
    assert.equal(ledger.reserve(p,badFrame,"NORTH"),null);
  for(const badAnchor of [null,undefined,0,"CORE","north","NORTHEAST"])
    assert.equal(ledger.reserve(p,12,badAnchor),null);
  assert.ok(ledger.reserve(p,12,"NORTH")); // failed attempts did not reserve
});

test("J9L-B2A own data descriptors prevent accessor execution and forged shape",()=>{
  const ledger=createBlackoutArchitectEncounterShotReservation(3);
  assert.ok(ledger);
  let getterCalls=0;
  for(const field of ["fromPlayer","life","collisionTraceRunEpoch","collisionTracePhysicsFrame","collisionTraceProjectileOrdinal"]){
    const p=player();
    Object.defineProperty(p,field,{get:()=>{getterCalls++;return 3;},enumerable:true});
    assert.equal(ledger.reserve(p,12,"NORTH"),null);
  }
  assert.equal(getterCalls,0);
  const proxy=new Proxy(player(),{getPrototypeOf:()=>{throw Error("invalid proxy");}});
  assert.equal(ledger.reserve(proxy,12,"NORTH"),null);
});

test("J9L-B2A explicitly does NOT guarantee global identity or cross-ledger replay prevention",()=>{
  const first=createBlackoutArchitectEncounterShotReservation(3);
  const second=createBlackoutArchitectEncounterShotReservation(3);
  assert.ok(first);assert.ok(second);
  const original=player(),cloned={...original};
  assert.ok(first.reserve(original,12,"NORTH"));
  assert.ok(first.reserve(cloned,12,"NORTH")); // reference not authenticated
  assert.ok(second.reserve(original,13,"NORTH")); // ledger is independent
  const wrongRun=createBlackoutArchitectEncounterShotReservation(4);
  assert.ok(wrongRun);
  assert.equal(wrongRun.reserve(original,13,"NORTH"),null);
});

test("J9L-B2A only grants isolated reservation authority and no damage",()=>{
  const a=BLACKOUT_ARCHITECT_SHOT_RESERVATION_AUTHORITY_CONTRACT;
  assert.ok(Object.isFrozen(a));
  assert.deepEqual(Object.entries(a).filter(([,v])=>v).map(([key])=>key),[
    "ownsIsolatedReferenceReservationAuthority",
  ]);
});
