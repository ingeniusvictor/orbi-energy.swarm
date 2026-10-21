import assert from "node:assert/strict";
import test from "node:test";
import { EnemyType, type Enemy } from "../../src/game/types";
import {
  BLACKOUT_ARCHITECT_ENGINE_IDENTITY_GUARD_AUTHORITY as AUTH,
  createBlackoutArchitectEngineIdentityLifecycleOwner,
  nextBlackoutArchitectEngineIdentityOrdinal,
} from "../../src/game/blackoutArchitectEngineIdentityLifecycle";

const boss = (override: Partial<Enemy> = {}): Enemy => ({
  id: "synthetic-only-architect",
  type: EnemyType.BOSS_ARCHITECT,
  architectBossIdentity: "BLACKOUT_ARCHITECT",
  x: 800, y: 150, vx: 0, vy: 0,
  health: 1920, maxHealth: 1920,
  speed: 0, size: 58, color: "#60a5fa",
  shootCooldown: 0, pulseCooldown: 0,
  contactDamageCooldown: 0, isDead: false,
  isBoss: true, bossPhase: 1, flashTicks: 0,
  ...override,
});

test("Simulated installed refs pass only a private owner guard; not a live game encounter", () => {
  const owner = createBlackoutArchitectEngineIdentityLifecycleOwner();
  const e = boss();
  assert.equal(owner.admitInstalledBoss(e, e, [e]), null, "no run exists until beginRun");
  assert.equal(owner.beginRun(), 1);
  const ticket = owner.admitInstalledBoss(e, e, [e]);
  assert.ok(ticket);
  assert.equal(ticket.bossId, "BLACKOUT_ARCHITECT");
  assert.equal(ticket.guardMode, "ENGINE_IDENTITY_GUARD_ONLY");
  assert.equal(ticket.runEpoch, 1);
  assert.equal(ticket.encounterOrdinal, 1);
  assert.equal(ticket.installedReferencePreconditionSatisfied, true);
  assert.ok(Object.isFrozen(ticket));
  assert.equal(owner.isCurrent(ticket, e, e, [e]), true);
  for (const [key, value] of Object.entries(ticket)) {
    if (typeof value === "boolean" && key !== "installedReferencePreconditionSatisfied")
      assert.equal(value, false, key);
  }
  assert.equal(owner.admitInstalledBoss(e, e, [e]), null, "duplicate fails closed");
  assert.equal(owner.isCurrent(ticket, e, e, [e]), false);
  assert.equal(owner.admitInstalledBoss(e, e, [e]), null, "same object cannot replay after revoke");
});

test("A different boss, last array entry or guard identity immediately invalidates", () => {
  const o = createBlackoutArchitectEngineIdentityLifecycleOwner();
  assert.equal(o.beginRun(), 1);
  const e = boss();
  const other = boss({id:"another"});
  assert.equal(o.admitInstalledBoss(e, other, [e]), null, "mismatched bossRef");
  assert.equal(o.admitInstalledBoss(e, e, [e, other]), null, "must be last installed enemy");
  const t = o.admitInstalledBoss(e, e, [e]);
  assert.ok(t);
  assert.equal(o.isCurrent({ ...t }, e, e, [e]), false, "cloned token invalid");
  assert.equal(o.isCurrent(t, e, e, [e]), false);
  const t2 = o.admitInstalledBoss(other, other, [other]);
  assert.ok(t2);
  assert.equal(t2.encounterOrdinal, 2, "ordinal cannot be reused");
  assert.equal(o.isCurrent(t2, other, e, [other]), false, "bossRef replacement revokes");
  assert.equal(o.isCurrent(t2, other, other, [other]), false);
});

test("Only unique Architect discriminator passes, never Titan or NULL_ARCHITECT", () => {
  const o = createBlackoutArchitectEngineIdentityLifecycleOwner();
  assert.equal(o.beginRun(), 1);
  const fake: Partial<Enemy>[] = [
    {type:EnemyType.BOSS_TITAN},
    {type:EnemyType.BOSS_DEVOURER},
    {type:EnemyType.BOSS_WORM},
    {architectBossIdentity:undefined},
    {infiniteBossIdentity:"NULL_ARCHITECT"},
    {bossChassis:"TITAN_CORE"},
    {bossEncounterStage:"PRIMARY"},
    {milestoneKind:"BOSS_REMATCH"},
    {isBoss:false},
    {isDead:true},
    {health:0},
    {health:-1},
    {health:Infinity},
    {maxHealth:NaN},
    {maxHealth:0},
    {health:2000,maxHealth:1920},
  ];
  for (const change of fake) {
    const e = boss(change);
    assert.equal(o.admitInstalledBoss(e, e, [e]), null, JSON.stringify(change));
  }
  const e = boss();
  const v = o.admitInstalledBoss(e, e, [e]);
  assert.ok(v);
  e.isDead = true;
  assert.equal(o.isCurrent(v, e, e, [e]), false, "defeat invalidates immediately");
});

test("Revocation, run invalidation and new run never reuse an epoch, ordinal or boss reference", () => {
  const a = createBlackoutArchitectEngineIdentityLifecycleOwner();
  const b = createBlackoutArchitectEngineIdentityLifecycleOwner();
  assert.equal(a.beginRun(), 1);
  assert.equal(b.beginRun(), 1);
  const first = boss();
  const t1 = a.admitInstalledBoss(first, first, [first]);
  assert.ok(t1);
  assert.equal(b.isCurrent(t1, first, first, [first]), false, "foreign owner no current");
  assert.equal(a.revoke(), null);
  assert.equal(a.isCurrent(t1, first, first, [first]), false);
  assert.equal(a.admitInstalledBoss(first, first, [first]), null, "replay blocked");
  assert.equal(a.invalidateRun(), null);
  const newBoss = boss({id:"second"});
  assert.equal(a.admitInstalledBoss(newBoss, newBoss, [newBoss]), null, "stopped run");
  assert.equal(a.beginRun(), 2);
  const t2 = a.admitInstalledBoss(newBoss, newBoss, [newBoss]);
  assert.ok(t2);
  assert.equal(t2.runEpoch, 2);
  assert.equal(t2.encounterOrdinal, 2);
  assert.equal(a.isCurrent(t1, first, first, [first]), false);
});

test("Invalid refs and hostile proxies fail closed without throwing or leaking authority", () => {
  const o = createBlackoutArchitectEngineIdentityLifecycleOwner();
  o.beginRun();
  const e = boss();
  assert.equal(o.admitInstalledBoss(null, null, []), null);
  assert.equal(o.admitInstalledBoss(e, null, [e]), null);
  assert.equal(o.admitInstalledBoss(e, e, []), null);
  assert.equal(o.admitInstalledBoss(e, e, [] as Enemy[]), null);
  const broken = new Proxy(boss(), {get(){throw Error("hostile proxy");}});
  assert.equal(o.admitInstalledBoss(broken, broken, [broken]), null);
  assert.equal(o.admitInstalledBoss(e, e, new Proxy([e], {
    get(_target, _prop){throw Error("array trap");}
  })), null);
  assert.ok(o.admitInstalledBoss(e, e, [e]));
  assert.equal(o.isCurrent({}, e, e, [e]), false);
  assert.ok(Object.isFrozen(AUTH));
  assert.deepEqual(Object.entries(AUTH).filter(([,v])=>v===true).map(([k])=>k), [
    "ownsMonotonicPrivateRunEpochAuthority",
    "ownsMonotonicPrivateEncounterOrdinalAuthority",
    "ownsInstalledReferencePreconditionGuardOnly",
  ]);
  for (const [k,v] of Object.entries(AUTH)) {
    if (!k.startsWith("ownsMonotonic") && k !== "ownsInstalledReferencePreconditionGuardOnly")
      assert.equal(v,false,k);
  }
});

test("Safe private successor rejects unsafe, exhausted and attacker-controlled numeric forms", () => {
  assert.equal(nextBlackoutArchitectEngineIdentityOrdinal(0),1);
  assert.equal(nextBlackoutArchitectEngineIdentityOrdinal(1),2);
  assert.equal(nextBlackoutArchitectEngineIdentityOrdinal(Number.MAX_SAFE_INTEGER-1),Number.MAX_SAFE_INTEGER);
  for (const invalid of [-0,-1,-Infinity,Infinity,NaN,1.5,"3",null,undefined,Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER+1])
    assert.equal(nextBlackoutArchitectEngineIdentityOrdinal(invalid),null,String(invalid));
});
