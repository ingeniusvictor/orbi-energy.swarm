/** PYRA-07A-2. No extra boss; a native ORBI roster damages real Solfernax.
 * CI-only Vite mode. Browser uses genuine Mundo Nuevo/Canvas and wave-ten
 * descriptor; screenshots/JSON are retained whether the assertion passes.
 */
import {chromium} from "playwright";
import assert from "node:assert/strict";
import {spawn} from "node:child_process";
import {mkdir,stat,writeFile} from "node:fs/promises";
import {join} from "node:path";

const port=4200,host="http://127.0.0.1:"+port;
const out=process.env.ORBI_PYRA_VICTORY_OUTPUT??"artifacts/pyra-solfernax-victory";
const evidence={kind:"PYRA_07A_2_NATIVE_VICTORY",scope:"real ORBI shots, real Solfernax, campaign-to-infinite checkpoint",
  cases:[],errors:[],failures:[],notProduction:true};
const pause=ms=>new Promise(r=>setTimeout(r,ms));
let server,browser;
async function serve(){
  server=spawn(process.execPath,["node_modules/vite/bin/vite.js","preview",
    "--host","127.0.0.1","--port",String(port),"--strictPort"],
    {stdio:["ignore","pipe","pipe"]});
  let logs="";
  for(const pipe of [server.stdout,server.stderr])
    pipe.on("data",b=>{logs=(logs+String(b)).slice(-1600)});
  for(let n=0;n<150;n++){
    try{if((await fetch(host)).ok)return;}catch{}
    await pause(200);
  }
  throw Error("Vite pyra-e2e failed to start: "+logs);
}
async function run(name,width,height,mobile){
 const context=await browser.newContext({viewport:{width,height},
   isMobile:mobile,hasTouch:mobile,deviceScaleFactor:mobile?2:1,
   reducedMotion:"reduce",serviceWorkers:"block"});
 const page=await context.newPage();
 page.on("pageerror",e=>evidence.errors.push(name+": "+String(e)));
 page.on("console",m=>{if(m.type()==="error")evidence.errors.push(name+": "+m.text())});
 const phases=new Set(),stageByPhase={1:new Set(),2:new Set(),3:new Set()};
 let sawIntro=false,sawFullHealth=false,sawDeath=false,sawCinematic=false;
 let first=null,final=null,maximumDamage=0,maximumShots=0,minimumHp=2200;
 let initialVictoryCount=null,maxVictoryCount=0;
 let stalledSamples=0,lastShots=0;
 const snapshots=[];
 try{
   await page.clock.install({time:new Date("2026-10-27T10:00:00Z")});
   await page.goto(host+"/?pyra-e2e-boss=1&pyra-e2e-victory=1",
     {waitUntil:"domcontentloaded",timeout:30000});
   const start=page.getByTestId("orbi-mobile-enter");
   if(await start.isVisible()){
     await start.click();
     await page.getByTestId("orbi-mobile-menu-main-play").click();
     await page.getByTestId("orbi-mobile-pyra-world").click();
   }else{
     await page.locator('[data-pyra-world-start-cta="true"]').click();
   }
   const canvas=page.locator("#game-canvas");
   await canvas.waitFor({state:"visible",timeout:15000});
   assert.equal(await page.locator('[data-selected-game-mode="WORLD_ROUTE"]').count(),1);
   assert.equal(await page.getByTestId("ux15-route-qa").count(),0,
     "a LAB route is not the real Campaign");
   for(let tick=0;tick<520;tick++){
     await page.clock.runFor(500);
     const v=await canvas.evaluate(el=>{
       const d=el.dataset;
       return {world:d.ux15World,live:d.ux15LiveCombat,
         id:d.pyraE2eBossId,stage:d.pyraE2eBossStage,
         phase:Number(d.pyraE2eBossPhase),hp:Number(d.pyraE2eBossHealth),
         maxHp:Number(d.pyraE2eBossMaxHealth),intro:d.pyraE2eBossIntro,
         mode:d.pyraE2eRuntimeMode,wave:Number(d.pyraE2eWave),
         cinematic:d.pyraE2eCinematic,swarm:Number(d.pyraE2eSwarmSize),
         shield:Number(d.pyraE2eShield),shots:Number(d.pyraE2eShots),
         damage:Number(d.pyraE2eDamageDealt),
         defeats:Number(d.pyraE2eDefeats),
         victory:d.pyraE2eVictoryCommitted,
         victoryCount:Number(d.pyraE2eVictoryCount),
         bossX:Number(d.pyraE2eBossX),bossY:Number(d.pyraE2eBossY),
         playerX:Number(d.pyraE2ePlayerX),playerY:Number(d.pyraE2ePlayerY),
         nearestFollower:Number(d.pyraE2eNearestFollower),
         minCooldown:Number(d.pyraE2eMinCooldown),
         bossInEnemies:d.pyraE2eBossInEnemies,waveActive:d.pyraE2eWaveActive};
     });
     if(!first)first=v;
     final=v;
     assert.equal(v.world,"PYRA_MAGMA_CORE",name+": wrong world");
     assert.equal(v.live,"true",name+": fake combat");
     assert.ok(v.swarm>=1 && v.swarm<=30,name+": roster outside normal cap");
     assert.ok(v.shield>=0,name+": invalid shield");
     if(initialVictoryCount===null)initialVictoryCount=v.victoryCount;
     maxVictoryCount=Math.max(maxVictoryCount,v.victoryCount);
     maximumDamage=Math.max(maximumDamage,v.damage);
     maximumShots=Math.max(maximumShots,v.shots);
     if(tick>18 && v.shots===lastShots && v.mode==="CAMPAIGN" &&
       v.hp>1540) stalledSamples++;
     else stalledSamples=0;
     lastShots=v.shots;
     if(v.id==="world:pyra:solfernax:v1"){
       sawIntro ||= v.intro==="true";
       sawFullHealth ||= v.maxHp===2200 && v.hp===2200;
       minimumHp=Math.min(minimumHp,v.hp);
       if(v.hp<=0)sawDeath=true;
       if(!sawDeath&&v.phase>=1&&v.phase<=3){
         phases.add(v.phase);
         if(v.stage!=="NONE")stageByPhase[v.phase].add(v.stage);
       }
       // Native damage may legitimately overshoot zero on the fatal hit.
       // hp < 0 is the evidence of real projectile defeat, not an engine bug.
       // Never truncate or modify boss HP in the E2E fixture.
     }
     sawCinematic ||= v.cinematic==="true";
     if(tick%4===0||v.mode==="INFINITE"||sawCinematic&&tick%2===0)
       snapshots.push({tick,...v});
     if(v.mode==="INFINITE"&&v.victory==="true"){
       // Check idempotence across 2 more real seconds.
       await page.clock.runFor(2000);
       final=await canvas.evaluate(el=>({
         mode:el.dataset.pyraE2eRuntimeMode,
         victory:el.dataset.pyraE2eVictoryCommitted,
         count:Number(el.dataset.pyraE2eVictoryCount),
         defeats:Number(el.dataset.pyraE2eDefeats)
       }));
       break;
     }
     // Fail fast if targeting has stalled, retaining diagnostic snapshots.
     if(stalledSamples>=20||v.shield===0 && tick>20)break;
   }
   const screenshot=join(out,name+".png");
   await page.screenshot({path:screenshot,animations:"disabled"});
   assert.ok((await stat(screenshot)).size>10000);
   const trace={name,pass:false,initial:first,final,
     phases:[...phases],stages:Object.fromEntries(
       Object.entries(stageByPhase).map(([k,v])=>[k,[...v]])),
     intro:sawIntro,initialFullHp:sawFullHealth,death:sawDeath,
     cinematic:sawCinematic,minimumHp,maximumDamage,maximumShots,
     initialVictoryCount,maxVictoryCount,snapshots,screenshot};
   evidence.cases.push(trace);
   assert.ok(sawFullHealth&&sawIntro,name+": did not observe native boss at full 2200 HP with intro");
   assert.ok(first.swarm>=8,name+": standard recruitment did not prepare roster");
   assert.ok(maximumShots>0,name+": native ORBI shots missing");
   assert.ok(maximumDamage>0&&minimumHp<1540,
     name+": no meaningful real projectile damage / phase-II threshold");
   for(const phase of [1,2,3]){
     assert.ok(phases.has(phase),name+": boss health did not reach phase "+phase);
     assert.ok(stageByPhase[phase].has("WARNING")||stageByPhase[phase].has("ACTIVE"),
       name+": native phase "+phase+" had no attack warning/active");
   }
   assert.ok(sawDeath,name+": no Solfernax defeat through actual projectiles");
   assert.ok(sawCinematic,name+": canonical death cinematic not observed");
   assert.equal(final.mode,"INFINITE",name+": campaign did not handoff to Infinite");
   assert.equal(final.victory,"true",name+": campaign ledger did not checkpoint");
   assert.equal(final.defeats,1,name+": boss death counted more than once");
   assert.equal(final.count,initialVictoryCount+1,name+": victory not committed once");
   trace.pass=true;
 }finally{await context.close();}
}
await mkdir(out,{recursive:true});
try{
 await serve();
 browser=await chromium.launch({headless:true,args:[
   "--disable-dev-shm-usage","--use-gl=angle",
   "--use-angle=swiftshader","--enable-unsafe-swiftshader"]});
 await run("desktop-1440x900",1440,900,false);
 await run("mobile-844x390",844,390,true);
}catch(error){
 evidence.failures.push({message:String(error),stack:error?.stack??""});
 process.exitCode=1;
}finally{
 if(browser)await browser.close();
 if(server)server.kill("SIGTERM");
 if(evidence.errors.length)process.exitCode=1;
 await writeFile(join(out,"victory-evidence.json"),JSON.stringify(evidence,null,2)+"\n");
 console.log(JSON.stringify({cases:evidence.cases.map(c=>({
   name:c.name,pass:c.pass,phases:c.phases,death:c.death,
   damage:c.maximumDamage,shots:c.maximumShots,final:c.final})),
   failures:evidence.failures,errors:evidence.errors}));
}
