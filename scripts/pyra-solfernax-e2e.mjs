/** PYRA-07A-1: real Campaign boss in Chromium, no LAB.
 * The fixture is built with mode pyra-e2e and is NEVER deployed.
 * Scope: real spawn/intro and first attack cycle; not victory certification.
 */
import {chromium} from "playwright";
import assert from "node:assert/strict";
import {spawn} from "node:child_process";
import {mkdir,stat,writeFile} from "node:fs/promises";
import {join} from "node:path";

const port=4199,url="http://127.0.0.1:"+port;
const output=process.env.ORBI_PYRA_E2E_OUTPUT||"artifacts/pyra-solfernax-e2e";
const evidence={kind:"PYRA_07A_NATIVE_CHROMIUM",mode:"pyra-e2e",
  scope:"actual Campaign wave-ten boss, introduction and first attack cycle",
  cases:[],failures:[],errors:[],productionPublished:false};
let server,browser;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function startServer(){
 server=spawn(process.execPath,["node_modules/vite/bin/vite.js","preview",
   "--host","127.0.0.1","--port",String(port),"--strictPort"],
   {stdio:["ignore","pipe","pipe"]});
 let logs="";
 for(const stream of [server.stdout,server.stderr])
   stream.on("data",b=>{logs=(logs+String(b)).slice(-1800);});
 for(let i=0;i<150;i++){
   try{if((await fetch(url)).ok)return;}catch{}
   await sleep(200);
 }
 throw Error("Vite pyra-e2e startup failed: "+logs);
}
async function run(name,width,height,touch){
 const context=await browser.newContext({viewport:{width,height},
   isMobile:touch,hasTouch:touch,deviceScaleFactor:touch?2:1,
   reducedMotion:"reduce",serviceWorkers:"block"});
 const page=await context.newPage();
 page.on("pageerror",e=>evidence.errors.push(name+": "+String(e)));
 page.on("console",m=>{
   if(m.type()==="error")evidence.errors.push(name+": "+m.text());
 });
 try{
   await page.clock.install({time:new Date("2026-10-27T10:00:00Z")});
   await page.goto(url+"/?pyra-e2e-boss=1",
     {waitUntil:"domcontentloaded",timeout:30000});
   const enter=page.getByTestId("orbi-mobile-enter");
   if(await enter.isVisible()){
     await enter.click();
     await page.getByTestId("orbi-mobile-menu-main-play").click();
     await page.getByTestId("orbi-mobile-pyra-world").click();
   }else{
     await page.locator('[data-pyra-world-start-cta="true"]').click();
   }
   const canvas=page.locator("#game-canvas");
   await canvas.waitFor({state:"visible",timeout:18000});
   assert.equal(await page.locator('[data-selected-game-mode="WORLD_ROUTE"]').count(),1,
     name+": fixture not using real Campaign");
   assert.equal(await page.getByTestId("ux15-route-qa").count(),0,
     name+": LAB must never start");
   let encounter=false,intro=false,fullHealth=false;
   const stages=new Set(),snapshots=[];
   let last=null;
   for(let i=0;i<145;i++){
     await page.clock.runFor(200);
     const sample=await canvas.evaluate(el=>{
       const d=el.dataset;
       return {world:d.ux15World,live:d.ux15LiveCombat,
         bossId:d.pyraE2eBossId,stage:d.pyraE2eBossStage,
         phase:Number(d.pyraE2eBossPhase),hp:Number(d.pyraE2eBossHealth),
         maxHp:Number(d.pyraE2eBossMaxHealth),intro:d.pyraE2eBossIntro,
         mode:d.pyraE2eRuntimeMode,wave:Number(d.pyraE2eWave),
         cinematic:d.pyraE2eCinematic};
     });
     last=sample;
     assert.equal(sample.world,"PYRA_MAGMA_CORE",name+": wrong world");
     assert.equal(sample.live,"true",name+": fake combat screen");
     assert.equal(sample.mode,"CAMPAIGN",name+": wrong progression mode");
     assert.equal(sample.wave,10,name+": not canonical boss wave");
     if(sample.bossId==="world:pyra:solfernax:v1"){
       encounter=true;
       intro ||= sample.intro==="true";
       fullHealth ||= sample.maxHp===2200 && sample.hp===2200;
       if(sample.intro!=="true"&&sample.stage!=="NONE")stages.add(sample.stage);
       if(i%5===0||!snapshots.some(x=>x.stage===sample.stage))
         snapshots.push({tick:i,...sample});
       if(["PREPARE","WARNING","ACTIVE","EXPOSED","RECOVER"]
         .every(s=>stages.has(s)))break;
     }
   }
   assert.ok(encounter,name+": native Solfernax never spawned");
   assert.ok(intro,name+": native intro not observed");
   assert.ok(fullHealth,name+": 2200 HP from native chassis not observed");
   for(const stage of ["PREPARE","WARNING","ACTIVE","EXPOSED","RECOVER"])
     assert.ok(stages.has(stage),name+": missing native stage "+stage);
   const screenshot=join(output,name+".png");
   await page.screenshot({path:screenshot,animations:"disabled"});
   assert.ok((await stat(screenshot)).size>10000,name+": screenshot missing");
   evidence.cases.push({name,pass:true,source:"Campaign bossRef",
     intro,fullHealth,stages:[...stages],snapshots,screenshot,
     remaining:"phases II/III, damage, kill, unique reward, Infinite handoff"});
 }finally{await context.close();}
}
await mkdir(output,{recursive:true});
try{
 await startServer();
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
 await writeFile(join(output,"evidence.json"),JSON.stringify(evidence,null,2)+"\n");
 console.log(JSON.stringify({cases:evidence.cases.map(c=>({
   name:c.name,stages:c.stages})),failures:evidence.failures,
   errors:evidence.errors,output}));
}
