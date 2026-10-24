import assert from "node:assert/strict";
import test from "node:test";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const ids=["foton","hydro","termo"];
const path=id=>"public/assets/orbi-evo8/runtime/gameplay/orbi_evo8_"+id+"_gameplay.svg";
const game=read("src/game/EnergySwarmCanvas.tsx");
const runtime=read("src/game/evo8PremiumSprite.ts");
const gallery=read("public/evo8-lot1-review.html");
const browser=read("scripts/android-ux09-premium-browser.mjs");

test("EV-F07 three genuine SVG sources: transparent, separate six wings, shared center and strong signature",()=>{
  for(const id of ids){
    const svg=read(path(id));
    assert.match(svg,/<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 512 512"/);
    assert.equal((svg.match(/class="orbi-evo8-wing"/g)||[]).length,6,"six visible wing paths for "+id);
    assert.match(svg,/class="orbi-evo8-chassis"/);
    assert.match(svg,/id="body"/);
    assert.match(svg,/id="wing"/);
    assert.doesNotMatch(svg,/<text\b|<image\b|<foreignObject\b|<rect[^>]+width="512"/i);
    assert.ok(svg.length<14000,id+": excessive vector payload");
    assert.ok(svg.includes("cx=\"256\" cy=\"256\""),"common optical anchor missing "+id);
  }
  assert.match(read(path("foton")),/orbi-evo8-solar-panel/);
  assert.match(read(path("foton")),/stroke="#98f7aa"/);
  assert.match(read(path("hydro")),/orbi-evo8-hydro-symbol/);
  assert.match(read(path("termo")),/orbi-evo8-thermal-symbol/);
  assert.notEqual(read(path("foton")),read(path("hydro")));
});

test("EV-F07 live follower renderer only replaces E8 visuals after preload, otherwise existing wings",()=>{
  assert.match(game,/prewarmEvo8Lot1Sprites\(import\.meta\.env\.BASE_URL\)/);
  assert.match(game,/disposeEvo8Lot1Sprites\(\)/);
  assert.match(game,/if \(drawEvo8Lot1Sprite\(ctx, member, flashProfile\.friendlyWhiteFlashStrength,/);
  assert.match(game,/ctx\.restore\(\);\s*return;\s*\}\s*\/\/ Orbiting\/pulsing/);
  assert.match(game,/getEvo8WingCount\(member\.level\)/);
  assert.match(runtime,/member\.level === 8/);
  assert.match(runtime,/getEvo8Lot1SpriteState/);
  assert.match(runtime,/drawImage\(entry\.image,-half,-half,size,size\)/);
  assert.doesNotMatch(runtime,/requestAnimationFrame|Math\.random|setInterval|projectile|damageMultiplier/);
});

test("EV-F07 review gallery shows actual vector sprites at real 28 px plus larger ID previews",()=>{
  assert.match(gallery,/GALERÍA DE REVISIÓN/);
  assert.match(gallery,/COMBATE · 28 PX/);
  for(const id of ids){
    assert.match(gallery,new RegExp('data-energy="'+id.toUpperCase()+'"'));
    assert.match(gallery,new RegExp('orbi_evo8_'+id+'_gameplay\\.svg'));
  }
  assert.match(gallery,/PROTOTIPOS VECTORIALES/);
  assert.match(browser,/evo8-lot1-review\.html/);
  assert.match(browser,/EVO8 lot-one gallery image failed to decode/);
  assert.match(browser,/caseReport\.lot1Art=true/);
});
