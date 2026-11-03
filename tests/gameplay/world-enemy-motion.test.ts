import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { EnemyType, type Enemy } from "../../src/game/types";
import {
  worldEnemyFamily, projectWorldEnemyMotion,
  projectWorldEnemyDeathAccent, drawWorldEnemyMotionFeedback,
} from "../../src/game/worldEnemyMotion";

const makeEnemy = (type: EnemyType, fields: Partial<Enemy> = {}): Enemy =>
  ({id:"enemy-271",type,size:16,vx:10,vy:0,flashTicks:0,
    isBoss:false,isDead:false,...fields} as Enemy);

test("EN-VIS-01: original enemies retain distinct ASTERIA, FERRUM, PYRA families",()=>{
  const families: Record<string,EnemyType[]> = {
    ASTERIA:[EnemyType.RAILCUTTER,EnemyType.SKY_SPECTER,EnemyType.BEACON_PRISM,
      EnemyType.ION_SAIL,EnemyType.SPAN_WARDEN,EnemyType.BOSS_ARCHON],
    FERRUM:[EnemyType.SHADE_GEAR,EnemyType.M9_WELDER,EnemyType.FOUNDRY_CLAW,
      EnemyType.OXIDE_MODULATOR,EnemyType.FERRITE_FOREMAN,EnemyType.BOSS_OMEGA],
    PYRA:[EnemyType.EMBER_SKATER,EnemyType.SLAG_SPEAR,EnemyType.LAVA_DREDGER,
      EnemyType.CINDERLING,EnemyType.CALDERA_SERAPH,EnemyType.BOSS_SOLFERNAX],
  };
  for(const [family,types] of Object.entries(families))
    for(const type of types) assert.equal(worldEnemyFamily(type),family,type);
  for(const type of [EnemyType.CRAWLER,EnemyType.DRONE,EnemyType.BOSS_TITAN])
    assert.equal(worldEnemyFamily(type),null);
});

test("EN-VIS-01: movement is bounded, per-instance, stateless and does not touch hitboxes",()=>{
  for(const type of [EnemyType.ION_SAIL,EnemyType.SHADE_GEAR,EnemyType.CINDERLING]){
    const enemy=makeEnemy(type),before={...enemy};
    const a=projectWorldEnemyMotion(enemy,1200);
    const b=projectWorldEnemyMotion(makeEnemy(type,{id:"enemy-272"}),1200);
    assert.ok(a && b);
    assert.notEqual(a!.bobY,b!.bobY);
    assert.ok(Math.abs(a!.tilt)<=.105);
    assert.ok(a!.scaleX>=.9 && a!.scaleX<=1.13);
    assert.ok(a!.scaleY>=.85 && a!.scaleY<=1.12);
    assert.ok(Math.abs(a!.bobY)<=1.45);
    assert.deepEqual(enemy,before);
  }
  assert.equal(projectWorldEnemyMotion(makeEnemy(EnemyType.BOSS_SOLFERNAX,{isBoss:true}),0),null);
  assert.equal(projectWorldEnemyMotion(makeEnemy(EnemyType.CRAWLER),0),null);
  assert.equal(projectWorldEnemyMotion(makeEnemy(EnemyType.EMBER_SKATER,{isDead:true}),0),null);
  assert.equal(projectWorldEnemyMotion(makeEnemy(EnemyType.EMBER_SKATER),NaN),null);
});

test("EN-VIS-01: warnings use native attack state, not fabricated cooldowns",()=>{
  const a=projectWorldEnemyMotion(makeEnemy(EnemyType.RAILCUTTER,
    {railcutterAttack:{phase:"AIM"} as Enemy["railcutterAttack"]}),1200);
  const f=projectWorldEnemyMotion(makeEnemy(EnemyType.M9_WELDER,
    {m9WelderAttack:{phase:"WARN"} as Enemy["m9WelderAttack"]}),1200);
  const p=projectWorldEnemyMotion(makeEnemy(EnemyType.CINDERLING,
    {cinderlingAttack:{stage:"MARK"} as Enemy["cinderlingAttack"]}),1200);
  const idle=projectWorldEnemyMotion(makeEnemy(EnemyType.CINDERLING),1200);
  assert.ok(a && a.warning>.35);
  assert.ok(f && f.warning>.35);
  assert.ok(p && p.warning>.35);
  assert.equal(idle?.warning,0);
  assert.ok(projectWorldEnemyMotion(makeEnemy(EnemyType.SHADE_GEAR,
    {shadeGearAttack:{phase:"ROLL"} as Enemy["shadeGearAttack"]}),1200)!.tilt<=.105);
});

test("EN-VIS-01: hit response is visible but caps scale and never hides silhouettes",()=>{
  const a=projectWorldEnemyMotion(makeEnemy(EnemyType.SLAG_SPEAR,{flashTicks:4}),840);
  assert.equal(a?.hit,1);
  assert.ok(a!.scaleY<1);
  const strokes: number[]=[];
  const ctx={save(){},restore(){},beginPath(){},arc(){},
    stroke(){strokes.push(1)},shadowBlur:0,lineWidth:1,globalAlpha:1,strokeStyle:""
  } as unknown as CanvasRenderingContext2D;
  drawWorldEnemyMotionFeedback(ctx,16,a!);
  assert.equal(strokes.length,1);
  drawWorldEnemyMotionFeedback(ctx,16,
    projectWorldEnemyMotion(makeEnemy(EnemyType.SLAG_SPEAR),840)!);
  assert.equal(strokes.length,1);
});

test("EN-VIS-01: death accent is capped, original boss cinematics are untouched",()=>{
  for(const type of [EnemyType.SKY_SPECTER,EnemyType.FERRITE_FOREMAN,EnemyType.CALDERA_SERAPH]){
    const accent=projectWorldEnemyDeathAccent(makeEnemy(type));
    assert.equal(accent?.particles,4);
    assert.match(accent?.color??"",/^#[\da-f]{6}$/i);
  }
  assert.equal(projectWorldEnemyDeathAccent(makeEnemy(EnemyType.BOSS_OMEGA,{isBoss:true})),null);
  assert.equal(projectWorldEnemyDeathAccent(makeEnemy(EnemyType.CRAWLER)),null);
});

test("EN-VIS-01: draw integration preserves attack telegraphs, hitflash, and health bars",()=>{
  const canvas=readFileSync(new URL("../../src/game/EnergySwarmCanvas.tsx",import.meta.url),"utf8");
  const engine=readFileSync(new URL("../../src/game/EnergySwarmGame.tsx",import.meta.url),"utf8");
  assert.match(canvas,/projectWorldEnemyMotion\(enemy, time\)/);
  assert.match(canvas,/drawWorldEnemyMotionFeedback\(ctx, enemy\.size, worldMotion\)/);
  assert.match(canvas,/ctx\.scale\(worldMotion\.scaleX, worldMotion\.scaleY\)/);
  assert.match(canvas,/if \(enemy\.health < enemy\.maxHealth\)/);
  assert.match(engine,/projectWorldEnemyDeathAccent\(enemy\)/);
  assert.match(engine,/projectWorldEnemyDeathAccent\(otherEnemy\)/);
  assert.match(engine,/quality\.maxParticles/);
  assert.doesNotMatch(canvas,/enemy\.health\s*=/);
});
