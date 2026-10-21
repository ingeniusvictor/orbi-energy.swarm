import assert from "node:assert/strict";
import test from "node:test";
import { EnemyType, type Enemy } from "../../src/game/types";
import { BLACKOUT_ARCHITECT_STANDALONE_COMBAT_BLUEPRINT as DESIGN } from "../../src/game/blackoutArchitectStandaloneCombatBlueprint";
import {
  BLACKOUT_ARCHITECT_DEV_QA_FACTORY_AUTHORITY as AUTH,
  createBlackoutArchitectDevQaBoss,
} from "../../src/game/blackoutArchitectDevQaBossFactory";
import { createBlackoutArchitectEngineIdentityLifecycleOwner } from "../../src/game/blackoutArchitectEngineIdentityLifecycle";

test("QA factory refuses absent explicit request; accepts only original untuned Architect blueprint", () => {
  assert.equal(createBlackoutArchitectDevQaBoss(false), null);
  const first = createBlackoutArchitectDevQaBoss(true);
  const second = createBlackoutArchitectDevQaBoss(true);
  assert.ok(first && second);
  assert.notEqual(first,second,"new object reference for each QA request");
  assert.equal(first.type,EnemyType.BOSS_ARCHITECT);
  assert.equal(first.architectBossIdentity,"BLACKOUT_ARCHITECT");
  assert.equal(first.isBoss,true);
  assert.equal(first.isDead,false);
  assert.equal(first.bossChassis,undefined);
  assert.equal(first.infiniteBossIdentity,undefined);
  assert.equal(first.bossEncounterStage,undefined);
  assert.equal(first.maxHealth,DESIGN.core.proposedMaxHealth);
  assert.equal(first.health,DESIGN.core.proposedMaxHealth);
  assert.equal(first.size,DESIGN.core.proposedVisualSize);
  assert.equal(first.x,800);
  assert.equal(first.y,200);
  assert.equal(first.vx,0);
  assert.equal(first.vy,0);
  assert.equal(first.shootCooldown,0);
  assert.ok(Object.isFrozen(AUTH));
  assert.deepEqual(Object.entries(AUTH).filter(([,v])=>v===true).map(([k])=>k),[
    "ownsDevOnlyProvisionalEntityConstruction",
  ]);
  assert.ok(Object.entries(AUTH).every(([k,v])=>k==="ownsDevOnlyProvisionalEntityConstruction"?v===true:v===false));
});

test("Install then attest the exact same game refs, never a caller-supplied boss ID or epoch", () => {
  const owner=createBlackoutArchitectEngineIdentityLifecycleOwner();
  const created=createBlackoutArchitectDevQaBoss(true);
  assert.ok(created);
  assert.equal(owner.admitInstalledBoss(created,created,[created]),null,"run must begin first");
  assert.equal(owner.beginRun(),1);
  let bossRef: Enemy|null=null;
  const enemies: Enemy[]=[];
  assert.equal(owner.admitInstalledBoss(created,bossRef,enemies),null,"no installed object");
  enemies.push(created);
  assert.equal(owner.admitInstalledBoss(created,bossRef,enemies),null,"boss ref must match");
  bossRef=created;
  const ticket=owner.admitInstalledBoss(created,bossRef,enemies);
  assert.ok(ticket);
  assert.equal(ticket.guardMode,"ENGINE_IDENTITY_GUARD_ONLY");
  assert.equal(ticket.actualGameplayEncounterCertified,false);
  assert.equal(ticket.physicalCardinalGeometryCertified,false);
  assert.equal(ticket.collisionOrHitCertified,false);
  assert.equal(ticket.bossHpOrDamageMutationAuthorized,false);
  assert.equal(owner.isCurrent(ticket,created,bossRef,enemies),true);
  assert.equal(owner.revoke(),null);
  bossRef=null;
  assert.equal(enemies.pop(),created);
  assert.equal(enemies.length,0);
  assert.equal(owner.isCurrent(ticket,created,bossRef,enemies),false,"torn down refs stale");
});

test("DEV QA does not turn a Titan, clone, invalid object or stale run into Architect", () => {
  const owner=createBlackoutArchitectEngineIdentityLifecycleOwner();
  assert.equal(owner.beginRun(),1);
  const architect=createBlackoutArchitectDevQaBoss(true);
  assert.ok(architect);
  const titan={...architect,type:EnemyType.BOSS_TITAN,bossChassis:"TITAN_CORE" as const};
  assert.equal(owner.admitInstalledBoss(titan,titan,[titan]),null);
  const clone={...architect};
  assert.equal(owner.admitInstalledBoss(architect,clone,[architect]),null);
  const ticket=owner.admitInstalledBoss(architect,architect,[architect]);
  assert.ok(ticket);
  assert.equal(owner.isCurrent(ticket,architect,clone,[architect]),false);
  assert.equal(owner.beginRun(),2);
  const fresh=createBlackoutArchitectDevQaBoss(true);
  assert.ok(fresh);
  const next=owner.admitInstalledBoss(fresh,fresh,[fresh]);
  assert.ok(next);
  assert.equal(next.runEpoch,2);
  assert.equal(next.encounterOrdinal,2);
  assert.equal(owner.isCurrent(ticket,architect,architect,[architect]),false);
});
