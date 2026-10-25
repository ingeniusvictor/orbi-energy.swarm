import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, statSync } from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const canvas=read("src/game/EnergySwarmCanvas.tsx");
const assets=[
  ["armored_blackout_elite.webp","BLACKOUT_ELITE",20000,95000],
  ["gravity_disruptor.webp","DISRUPTOR",25000,100000],
  ["swarm_devourer_boss.webp","BOSS_DEVOURER",50000,170000],
];
test("UX13 contains actual compressed alpha WebP files in the repo, not remote links",()=>{
 for(const [file] of assets) {
   const buf=readFileSync(new URL("../public/assets/enemies/premium/"+file,import.meta.url));
   assert.equal(buf.toString("ascii",0,4),"RIFF");
   assert.equal(buf.toString("ascii",8,12),"WEBP");
   const [_,id,min,max]=assets.find(row=>row[0]===file);
   assert.ok(buf.length>min && buf.length<max,id+" suspicious WebP payload "+buf.length);
 }
});
test("UX13 visual-only integration retains original telegraphs, abilities, auras, bars and deterministic fallback",()=>{
 assert.match(canvas,/prewarmPremiumEnemySprites\(import\.meta\.env\.BASE_URL\)/);
 assert.match(canvas,/disposePremiumEnemySprites\(\)/);
 assert.match(canvas,/if \(!drawPremiumEnemyBody\(ctx, enemy\)\)/);
 assert.match(canvas,/case EnemyType\.BLACKOUT_ELITE/);
 assert.match(canvas,/case EnemyType\.DISRUPTOR/);
 assert.match(canvas,/case EnemyType\.BOSS_DEVOURER/);
 assert.match(canvas,/enemy\.chargeTimer > 0/);
 assert.match(canvas,/enemy\.shootCooldown <= 60/);
 assert.match(canvas,/Four extending antennas with glowing bulbtips/);
 assert.match(canvas,/6 segmented orbiting dark plasma wings/);
 assert.match(canvas,/Central hyper giant evil glowing pupil eye/);
 assert.match(canvas,/Exposed rear core engine/);
 assert.match(canvas,/projectLiveSiegeVolleyTelegraph/);
 assert.match(canvas,/projectLiveCommandCorePresentation/);
 assert.match(canvas,/if \(enemy\.health < enemy\.maxHealth\)/);
 assert.match(canvas,/flashProfile\.enemyWhiteFlashStrength/);
 assert.doesNotMatch(read("src/game/premiumEnemySprites.ts"),/EnemyType\.BOSS_TITAN|enemy\.health\s*=|damageMultiplier\s*=|gravity_well\s*:/);
});
test("UX13 real browser coverage renders three decoded WebP bodies plus original VFX",()=>{
 const browser=read("scripts/ev-f06-evo8-visual-browser.mjs");
 assert.match(browser,/casePremiumEnemies/);
 assert.match(browser,/premium-enemies/);
 assert.match(browser,/imageDraws.length!==3/);
 assert.match(browser,/gravity_disruptor\.webp/);
});
