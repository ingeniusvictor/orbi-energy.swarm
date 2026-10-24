import assert from "node:assert/strict";
import test from "node:test";
import {
  EVO8_SPRITE_BODY_DRAW_SIZE, EVO8_SPRITE_MAX_SOLID_RADIUS,
  EVO8_LOT1_IDS, resolveEvo8Lot1SpritePath, isEvo8Lot1SpriteCandidate,
  prewarmEvo8Lot1Sprites, disposeEvo8Lot1Sprites, drawEvo8Lot1Sprite,
  getEvo8Lot1SpriteState,
} from "../../src/game/evo8PremiumSprite";
import { OrbiType } from "../../src/game/types";

const member=(energyId:"FOTON"|"HYDRO"|"TERMO"|"GAIA",level:number,type=OrbiType.BEAM)=>
  ({energyId,level,type});

test("EV-F07 resolver: only canonical lot-one identities, compatible with Vite BASE_URL",()=>{
  assert.deepEqual(EVO8_LOT1_IDS,["FOTON","HYDRO","TERMO"]);
  assert.equal(resolveEvo8Lot1SpritePath("FOTON","/game/"),"/game/assets/orbi-evo8/runtime/gameplay/orbi_evo8_foton_gameplay.svg");
  assert.equal(resolveEvo8Lot1SpritePath("TERMO","/game"),"/game/assets/orbi-evo8/runtime/gameplay/orbi_evo8_termo_gameplay.svg");
  assert.equal(resolveEvo8Lot1SpritePath("GAIA"),null);
  assert.equal(resolveEvo8Lot1SpritePath("QUANTUM"),null);
  assert.equal(EVO8_SPRITE_BODY_DRAW_SIZE,28);
  assert.equal(EVO8_SPRITE_MAX_SOLID_RADIUS,14);
});

test("EV-F07 visuals gate only level E8 normal followers; never fusion, GAIA or other 6 levels",()=>{
  for(const id of EVO8_LOT1_IDS){
    assert.equal(isEvo8Lot1SpriteCandidate(member(id,8)),true,id);
    for(const level of [1,3,5,6,7,9])assert.equal(isEvo8Lot1SpriteCandidate(member(id,level)),false,id+level);
    assert.equal(isEvo8Lot1SpriteCandidate(member(id,8,OrbiType.SOLAR_GUARDIAN)),false);
    assert.equal(isEvo8Lot1SpriteCandidate(member(id,8,OrbiType.HYDRO_LEVIATHAN)),false);
  }
  assert.equal(isEvo8Lot1SpriteCandidate(member("GAIA",8)),false);
});

test("EV-F07 sprite cache loads just three Images, draws once per follower, and preserves fallback",()=>{
  const OriginalImage=globalThis.Image;
  const created:FakeImage[]=[];
  class FakeImage {
    decoding="";
    src="";
    naturalWidth=512;
    naturalHeight=512;
    onload:(()=>void)|null=null;
    onerror:(()=>void)|null=null;
    constructor(){created.push(this);}
  }
  const calls:string[]=[];
  const ctx={
    filter:"none",save:()=>calls.push("save"),restore:()=>calls.push("restore"),
    drawImage:(_:unknown,x:number,y:number,w:number,h:number)=>
      calls.push(["drawImage",x,y,w,h].join(":")),
  } as unknown as CanvasRenderingContext2D;
  try {
    (globalThis as unknown as {Image:unknown}).Image=FakeImage;
    disposeEvo8Lot1Sprites();
    assert.equal(drawEvo8Lot1Sprite(ctx,member("FOTON",8)),false);
    prewarmEvo8Lot1Sprites("/");
    prewarmEvo8Lot1Sprites("/");
    assert.equal(created.length,3,"no duplicate Image allocations");
    for(const id of EVO8_LOT1_IDS) assert.equal(getEvo8Lot1SpriteState(id),"loading");
    assert.equal(drawEvo8Lot1Sprite(ctx,member("HYDRO",8)),false,"fallback while loading");
    created[0]!.onload?.();
    assert.equal(getEvo8Lot1SpriteState("FOTON"),"ready");
    assert.equal(drawEvo8Lot1Sprite(ctx,member("FOTON",8),.35,5),true);
    assert.ok(calls.includes("drawImage:-14:-14:28:28"),"sprite should remain within 75%-ENERGY solid budget");
    assert.equal(drawEvo8Lot1Sprite(ctx,member("FOTON",7)),false,"E7 stays procedural");
    created[1]!.onerror?.();
    assert.equal(getEvo8Lot1SpriteState("HYDRO"),"error");
    assert.equal(drawEvo8Lot1Sprite(ctx,member("HYDRO",8)),false,"broken image must draw procedural fallback");
    const old=created[2]!.onload;
    disposeEvo8Lot1Sprites();
    old?.(); // stale image must never become READY
    assert.equal(getEvo8Lot1SpriteState("TERMO"),"idle");
  } finally {
    disposeEvo8Lot1Sprites();
    if(OriginalImage === undefined) delete (globalThis as {Image?:unknown}).Image;
    else (globalThis as {Image?:unknown}).Image=OriginalImage;
  }
});
