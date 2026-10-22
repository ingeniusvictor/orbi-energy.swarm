import assert from "node:assert/strict";
import test from "node:test";
import { EnemyType, type Enemy } from "../../src/game/types";
import { createBlackoutArchitectDevQaBoss } from "../../src/game/blackoutArchitectDevQaBossFactory";
import { createBlackoutArchitectEngineIdentityLifecycleOwner } from "../../src/game/blackoutArchitectEngineIdentityLifecycle";
import {
  BLACKOUT_ARCHITECT_DEV_QA_CARDINAL_AUTHORITY,
  createBlackoutArchitectDevQaCardinalGeometry,
} from "../../src/game/blackoutArchitectDevQaCardinalGeometry";

const start = () => {
  const owner = createBlackoutArchitectEngineIdentityLifecycleOwner();
  assert.equal(owner.beginRun(), 1);
  const boss = createBlackoutArchitectDevQaBoss(true);
  assert.ok(boss);
  const enemies: Enemy[] = [boss];
  const guard = owner.admitInstalledBoss(boss, boss, enemies);
  assert.ok(guard);
  return { owner, boss, enemies, guard };
};

test("C1 constructs exactly four original-position engine-owned circles with independent sealed initial HP", () => {
  const { owner, boss, enemies, guard } = start();
  const result = createBlackoutArchitectDevQaCardinalGeometry(owner, guard, boss, boss, enemies, true);
  assert.ok(result);
  assert.equal(result.boss,boss);
  assert.equal(result.guard,guard);
  assert.equal(result.mode,"DEV_QA_PHYSICAL_GEOMETRY_NO_HITS");
  assert.deepEqual(result.anchors.map(a=>[a.id,a.x,a.y,a.radius,a.health,a.maxHealth]),[
    ["NORTH",800,94,13,135,135],
    ["EAST",916,200,13,135,135],
    ["SOUTH",800,306,13,135,135],
    ["WEST",684,200,13,135,135],
  ]);
  assert.equal(Object.isFrozen(result),true);
  assert.equal(Object.isFrozen(result.anchors),true);
  assert.equal(result.anchors.every(a=>Object.isSealed(a)),true);
  assert.notEqual(result.anchors[0],result.anchors[1]);
  assert.notEqual(result.anchors[0],result.anchors[2]);
  result.anchors[0].health=90; // test-only independent future durability slot; no live hit writer.
  assert.equal(result.anchors[0].health,90);
  assert.equal(result.anchors[1].health,135);
  assert.equal(boss.health,boss.maxHealth,"no core change");
  for (const key of ["collisionAuthorized","projectileConsumptionAuthorized",
     "healthMutationAuthorized","coreOrAttackAuthorized","productionRoutingAuthorized"] as const) {
    assert.equal(result[key],false,key);
  }
  assert.ok(Object.isFrozen(BLACKOUT_ARCHITECT_DEV_QA_CARDINAL_AUTHORITY));
});

test("C1 refuses absent opt-in, absent guard, spoofed boss ref or already-revoked identity", () => {
  const { owner, boss, enemies, guard } = start();
  assert.equal(createBlackoutArchitectDevQaCardinalGeometry(owner,guard,boss,boss,enemies,false),null);
  assert.equal(createBlackoutArchitectDevQaCardinalGeometry(owner,null,boss,boss,enemies,true),null);
  assert.equal(createBlackoutArchitectDevQaCardinalGeometry(null,guard,boss,boss,enemies,true),null);
  const clone={...boss};
  assert.equal(createBlackoutArchitectDevQaCardinalGeometry(owner,guard,clone,boss,enemies,true),null);
  assert.equal(owner.isCurrent(guard,boss,boss,enemies),false,"failed identity recheck revoked");
  assert.equal(createBlackoutArchitectDevQaCardinalGeometry(owner,guard,boss,boss,enemies,true),null);
});

test("C1 rejects Titan and preexisting NULL_ARCHITECT and cannot use other run's guard", () => {
  const run = start();
  const legacy: Enemy={...run.boss,type:EnemyType.BOSS_TITAN,bossChassis:"TITAN_CORE",
     architectBossIdentity:undefined,infiniteBossIdentity:"NULL_ARCHITECT"};
  assert.equal(createBlackoutArchitectDevQaCardinalGeometry(run.owner,run.guard,legacy,legacy,[legacy],true),null);
  const nextOwner=createBlackoutArchitectEngineIdentityLifecycleOwner();
  assert.equal(nextOwner.beginRun(),1);
  const fresh=createBlackoutArchitectDevQaBoss(true);
  assert.ok(fresh);
  const freshGuard=nextOwner.admitInstalledBoss(fresh,fresh,[fresh]);
  assert.ok(freshGuard);
  assert.equal(createBlackoutArchitectDevQaCardinalGeometry(run.owner,freshGuard,fresh,fresh,[fresh],true),null);
  assert.ok(createBlackoutArchitectDevQaCardinalGeometry(nextOwner,freshGuard,fresh,fresh,[fresh],true));
  assert.equal(nextOwner.invalidateRun(),null);
  assert.equal(createBlackoutArchitectDevQaCardinalGeometry(nextOwner,freshGuard,fresh,fresh,[fresh],true),null);
});

test("C1 fails closed on invalid world boundaries, NaN, fractional invalid provenance and stale run", () => {
  for (const [x,y] of [[10,200],[1590,200],[800,10],[800,950],[NaN,200],
    [Infinity,200],[-0,200],[800,-0]]) {
    const run=start();
    run.boss.x=x; run.boss.y=y;
    assert.equal(createBlackoutArchitectDevQaCardinalGeometry(run.owner,run.guard,
      run.boss,run.boss,run.enemies,true),null,`reject center (${x},${y})`);
  }
  const fresh=start();
  assert.ok(createBlackoutArchitectDevQaCardinalGeometry(fresh.owner,fresh.guard,
      fresh.boss,fresh.boss,fresh.enemies,true));
  fresh.boss.isDead=true;
  assert.equal(createBlackoutArchitectDevQaCardinalGeometry(fresh.owner,fresh.guard,
      fresh.boss,fresh.boss,fresh.enemies,true),null);
});

test("C1 cannot create a geometry from invalid enemy-list membership or moved bossRef", () => {
  const run=start();
  assert.equal(createBlackoutArchitectDevQaCardinalGeometry(run.owner,run.guard,
    run.boss,null,run.enemies,true),null);
  const another=start();
  another.enemies.push({...another.boss});
  assert.equal(createBlackoutArchitectDevQaCardinalGeometry(another.owner,another.guard,
    another.boss,another.boss,another.enemies,true),null);
});
