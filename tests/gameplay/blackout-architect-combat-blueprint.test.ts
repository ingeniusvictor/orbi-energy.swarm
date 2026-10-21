import assert from "node:assert/strict";
import test from "node:test";
import {
  BLACKOUT_ARCHITECT_STANDALONE_BLUEPRINT_AUTHORITY as AUTH,
  BLACKOUT_ARCHITECT_STANDALONE_COMBAT_BLUEPRINT as B,
  projectBlackoutArchitectHypotheticalAnchors,
} from "../../src/game/blackoutArchitectStandaloneCombatBlueprint";

test("Architect blueprint has unique original design, deep immutability and bounded suggestions", () => {
  assert.equal(B.bossId, "BLACKOUT_ARCHITECT");
  assert.equal(B.blueprintMode, "BLUEPRINT_ONLY");
  assert.equal(B.balanceStatus, "PROVISIONAL_UNTUNED");
  assert.equal(B.core.proposedMaxHealth, 1920);
  assert.equal(B.core.proposedVisualSize, 58);
  assert.equal(B.core.proposedExposureDurationMs, 3700);
  assert.ok(![2400,1500].includes(B.core.proposedMaxHealth));
  assert.ok(B.core.proposedExposureDurationMs !== 6000);
  assert.equal(B.anchors.length, 4);
  assert.deepEqual(B.anchors.map(x=>x.id),["NORTH","EAST","SOUTH","WEST"]);
  assert.equal(new Set(B.anchors.map(x=>x.id)).size,4);
  assert.deepEqual(B.anchors.map(x=>[x.offsetX,x.offsetY]),[[0,-106],[116,0],[0,106],[-116,0]]);
  assert.ok(B.anchors.every(x => x.proposedHealth === 135 && x.proposedCollisionRadius === 13));
  assert.deepEqual(B.phaseThresholds.map(p=>p.enterPhase),[2,3]);
  assert.deepEqual(B.phaseThresholds.map(p=>p.atOrBelowCoreHealthFraction),[0.68,0.32]);
  assert.deepEqual(B.attackIdeas.map(a=>a.id),["GRID_LOCK","VECTOR_TIDE","SECTOR_WALL"]);
  assert.ok(B.attackIdeas.every(x=>x.proposedTelegraphMs >= 1200 &&
    x.proposedProjectileBudget >= 0 && x.proposedProjectileBudget <= 8 &&
    x.proposedProjectileBudget <= B.globalLimitsObserved.maxProjectiles));
  assert.equal(B.globalLimitsObserved.maxEnemies,80);
  assert.equal(B.globalLimitsObserved.maxProjectiles,120);
  assert.equal(B.globalLimitsObserved.worldWidth,1600);
  assert.equal(B.globalLimitsObserved.worldHeight,960);
  assert.ok(Object.isFrozen(B) && Object.isFrozen(B.anchors) &&
    Object.isFrozen(B.phaseThresholds) && Object.isFrozen(B.attackIdeas));
  for(const nested of [B.core,...B.anchors,...B.phaseThresholds,...B.attackIdeas,
    B.globalLimitsObserved]) assert.ok(Object.isFrozen(nested));
  assert.ok(Object.isFrozen(AUTH));
  assert.deepEqual(Object.entries(AUTH).filter(([,v])=>v===true).map(([k])=>k),
    ["ownsProvisionalDesignBlueprintOnly"]);
  assert.ok(Object.entries(AUTH).every(([k,v])=> k==="ownsProvisionalDesignBlueprintOnly" ? v===true : v===false));
});

test("Proposed centers are deterministic, cardinal, frozen, and never physical collision authority", () => {
  const center = {x:800,y:480};
  const first = projectBlackoutArchitectHypotheticalAnchors(center);
  const second = projectBlackoutArchitectHypotheticalAnchors(center);
  assert.ok(first && second);
  assert.deepEqual(first,second);
  assert.ok(Object.isFrozen(first) && Object.isFrozen(first.anchorCenters));
  assert.deepEqual(first.anchorCenters.map(x=>[x.id,x.x,x.y]), [
    ["NORTH",800,374],["EAST",916,480],["SOUTH",800,586],["WEST",684,480]
  ]);
  assert.ok(first.anchorCenters.every(x=>Object.isFrozen(x)));
  assert.equal(first.projectionMode, "HYPOTHETICAL_COORDINATES_ONLY");
  for(const value of [first.authenticPhysicalGeometry,first.collisionAuthorized,
    first.damageAuthorized,first.projectileConsumptionAuthorized,first.liveBossIssued])
    assert.equal(value,false);
  assert.deepEqual(center,{x:800,y:480});
});

test("Fail closed on invalid, accessor, inherited, symbol, proxy and out-of-world projections", () => {
  const invalid: unknown[] = [null, undefined,1,"800",[],{}, {x:800}, {y:480},
    {x:0,y:0},{x:1600,y:960},{x:800,y:0},{x:800,y:960},
    {x:0,y:480},{x:1600,y:480},{x:NaN,y:480},{x:Infinity,y:480},
    {x:-Infinity,y:480},{x:-0,y:480},{x:800,y:-0},{x:800,y:NaN},
    {x:800,y:Infinity},{x:"800",y:480},{x:800,y:"480"},
    {x:800,y:480,extra:true}, Object.assign(Object.create({x:800}),{y:480}),
    new Proxy({}, {getPrototypeOf(){throw Error("proxy trap");}}),
    new Proxy({x:800,y:480},{ownKeys(){throw Error("proxy ownKeys");}}),
    Object.defineProperty({x:800},"y",{get(){throw Error("accessor");}}),
    Object.assign({x:800,y:480},{[Symbol("extra")]:true})
  ];
  for(const value of invalid) assert.equal(projectBlackoutArchitectHypotheticalAnchors(value),null);
  const nullProto = Object.assign(Object.create(null), {x:800,y:480});
  assert.ok(projectBlackoutArchitectHypotheticalAnchors(nullProto));
  assert.ok(projectBlackoutArchitectHypotheticalAnchors({x:129,y:120}));
  assert.equal(projectBlackoutArchitectHypotheticalAnchors({x:128,y:120}),null);
  assert.ok(projectBlackoutArchitectHypotheticalAnchors({x:1471,y:840}));
  assert.equal(projectBlackoutArchitectHypotheticalAnchors({x:1472,y:840}),null);
});
