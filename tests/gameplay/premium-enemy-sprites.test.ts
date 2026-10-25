import assert from "node:assert/strict";
import test from "node:test";
import { EnemyType } from "../../src/game/types";
import {
  disposePremiumEnemySprites, drawPremiumEnemyBody,
  getPremiumEnemySpriteState, isPremiumEnemyKind,
  prewarmPremiumEnemySprites, resolvePremiumEnemySpriteUrl,
} from "../../src/game/premiumEnemySprites";

const affected = [EnemyType.BLACKOUT_ELITE, EnemyType.DISRUPTOR, EnemyType.BOSS_DEVOURER] as const;

test("UX13 only THREE canonical enemy identities gain a sprite; no boss family remapping", () => {
  for(const id of affected){
    assert.equal(isPremiumEnemyKind(id),true);
    assert.match(resolvePremiumEnemySpriteUrl(id,"/base/")??"",/^\/base\/assets\/enemies\/premium\/.*\.webp$/);
  }
  for(const id of [EnemyType.CRAWLER,EnemyType.DRONE,EnemyType.VOID_ANCHOR,
    EnemyType.BOSS_TITAN,EnemyType.BOSS_WORM,EnemyType.BOSS_ARCHITECT]){
    assert.equal(isPremiumEnemyKind(id),false,id);
    assert.equal(resolvePremiumEnemySpriteUrl(id),null,id);
  }
});

test("UX13 image cache is one-shot; loading/error states fall back; stale events cannot revive",()=>{
  const original=globalThis.Image;
  class MockImage{
    naturalWidth=384;
    naturalHeight=384;
    decoding="";
    src="";
    onload:(()=>void)|null=null;
    onerror:(()=>void)|null=null;
    static created:MockImage[]=[];
    constructor(){MockImage.created.push(this);}
  }
  const draws:Array<[number,number,number,number]>=[];
  const ctx={
    shadowBlur:12,
    save(){},
    restore(){},
    drawImage(_:unknown,x:number,y:number,w:number,h:number){draws.push([x,y,w,h]);},
  } as unknown as CanvasRenderingContext2D;
  const member=(type:EnemyType,size=15)=>({type,size});
  try{
    (globalThis as unknown as {Image:unknown}).Image=MockImage;
    disposePremiumEnemySprites();
    assert.equal(drawPremiumEnemyBody(ctx,member(EnemyType.BLACKOUT_ELITE)),false);
    prewarmPremiumEnemySprites("/game/");
    prewarmPremiumEnemySprites("/game/");
    assert.equal(MockImage.created.length,3);
    assert.match(MockImage.created[0]!.src,/armored_blackout_elite\.webp$/);
    assert.equal(getPremiumEnemySpriteState(EnemyType.BLACKOUT_ELITE),"loading");
    assert.equal(drawPremiumEnemyBody(ctx,member(EnemyType.BLACKOUT_ELITE)),false);
    MockImage.created[0]!.onload?.();
    assert.equal(getPremiumEnemySpriteState(EnemyType.BLACKOUT_ELITE),"ready");
    assert.equal(drawPremiumEnemyBody(ctx,member(EnemyType.BLACKOUT_ELITE,15)),true);
    assert.deepEqual(draws[0],[-22.5,-22.5,45,45]);
    MockImage.created[1]!.onerror?.();
    assert.equal(drawPremiumEnemyBody(ctx,member(EnemyType.DISRUPTOR)),false);
    assert.equal(getPremiumEnemySpriteState(EnemyType.DISRUPTOR),"error");
    const stale=MockImage.created[2]!.onload;
    disposePremiumEnemySprites();
    stale?.();
    assert.equal(getPremiumEnemySpriteState(EnemyType.BOSS_DEVOURER),"idle");
  }finally{
    disposePremiumEnemySprites();
    if(original===undefined)delete (globalThis as {Image?:unknown}).Image;
    else (globalThis as unknown as {Image:unknown}).Image=original;
  }
});
