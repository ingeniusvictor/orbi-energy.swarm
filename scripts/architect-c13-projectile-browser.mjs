/**
 * ES-13J9L-C13: browser-operational REAL QA shots, not a simulation.
 * Chrome launches the actual Vite game. Every shot uses the native Canvas
 * pointer events; the owner/guard, projectile, anchors, HP and camera remain
 * privately engine-owned. The read-only DEV telemetry contains actual refs.
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdir, writeFile, stat } from "node:fs/promises";
import { join } from "node:path";

const output=process.env.ORBI_C13_OUTPUT || "artifacts/es13-c13-browser";
const touchMode=process.env.ORBI_C14_REAL_TOUCH === "1";
async function nativeShot(page,x,y){
  if(touchMode) await page.touchscreen.tap(x,y);
  else await page.mouse.click(x,y);
}
const url="http://127.0.0.1:4183";
const evidence={kind:"REAL_CHROMIUM_NATIVE_QA_PROJECTILES",cases:[],failures:[],
  consoleErrors:[],screenshots:[],noInjectedDamage:true,noManualCertification:true};
const err=[],servers=[];
const assert=(condition,message)=>{if(!condition)throw Error(message);};
const sleep=ms=>new Promise(done=>setTimeout(done,ms));
const capture=async(page,name)=>{
  const path=join(output,name+".png");
  await page.screenshot({path,fullPage:false,animations:"disabled"});
  const bytes=(await stat(path)).size;
  assert(bytes>10000,"Empty screenshot "+name);
  evidence.screenshots.push({name,bytes});
};
async function server(){
  const child=spawn(process.execPath,["node_modules/vite/bin/vite.js",
    "--host","127.0.0.1","--port","4183","--strictPort"],{
      stdio:["ignore","pipe","pipe"],env:{...process.env,DISABLE_HMR:"true"}});
  servers.push(child);
  let logs="";
  for(const stream of [child.stdout,child.stderr])stream.on("data",x=>logs+=x.toString().slice(0,2000));
  for(let i=0;i<160;i++){
    if(child.exitCode!==null)break;
    try{if((await fetch(url)).ok)return;}catch{}
    await sleep(250);
  }
  throw Error("Vite DEV unavailable: "+logs.slice(-2000));
}
const read=async page=>{
  const json=await page.locator("#game-canvas").getAttribute("data-architect-qa-readout");
  return json ? JSON.parse(json) : null;
};
async function initialize(browser,name,width,height,isMobile,hasTouch) {
  const context=await browser.newContext({viewport:{width,height},isMobile,hasTouch,
    serviceWorkers:"block",deviceScaleFactor:1,reducedMotion:"reduce"});
  const page=await context.newPage();
  page.on("pageerror",e=>err.push(name+": "+String(e)));
  page.on("console",m=>{if(m.type()==="error")err.push(name+": "+m.text().slice(0,240));});
  await page.clock.install({time:new Date("2026-10-22T12:00:00.000Z")});
  await page.goto(url,{waitUntil:"domcontentloaded"});
  await page.locator('[data-primary-start-cta="true"]').waitFor({state:"visible"});
  await page.clock.pauseAt(new Date("2026-10-22T12:00:05.000Z"));
  await page.locator('[data-primary-start-cta="true"]').click();
  const enter=page.getByRole("button",{name:"ENTER QA Blackout Architect QA"});
  await enter.waitFor({state:"visible"});
  assert(await enter.isEnabled(),name+": genuine Campaign preparation gate denied");
  await enter.click();
  await page.getByRole("button",{name:"EXIT QA Blackout Architect QA"}).waitFor({state:"visible"});
  if(touchMode && isMobile){
    const orientation=page.locator(".orbi-orientation-hint");
    if(await orientation.count()){
      const dismiss=orientation.getByRole("button",{name:/Entendido|Got it/i});
      await dismiss.tap(); // Real native touch dismissal of the existing tutorial.
      assert(await orientation.count()===0,name+": tutorial didn't dismiss through native tap");
    }else if(width===390)throw Error("Expected original portrait orientation tutorial to prove dismissal");
  }
  await page.clock.runFor(100);
  assert(await read(page),name+": authenticated QA readout not rendered");
  return {page,context};
}
async function positionFoton(page){
  const initial=await read(page);assert(initial,"No original owner telemetry");
  await page.keyboard.down("ArrowLeft");
  await page.clock.runFor(1150);
  await page.keyboard.up("ArrowLeft");
  await page.clock.runFor(100);
  const moved=await read(page);
  assert(moved,"No telemetry after real keyboard movement");
  assert(moved.foton.x<initial.foton.x-100,"FOTON did not move left via keyboard");
  assert(Math.abs(moved.foton.y-initial.foton.y)<2,"Unexpected FOTON vertical displacement");
  assert(moved.foton.x < moved.boss.x-150,"FOTON not clear of Grid Lock vertical lane");
  return {initial:initial.foton,moved:moved.foton};
}
function hp(state,id) {
  return id==="CORE"?state.boss.health:state.anchors.find(a=>a.id===id)?.health;
}
async function shoot(page,id) {
  const before=await read(page);
  assert(before,"Missing real QA after prior shot");
  assert(!before.shotActive,"Original singleton QA shot still in flight before "+id);
  const obj=id==="CORE"?before.boss:before.anchors.find(a=>a.id===id);
  assert(obj,id+" real anchor missing");
  const old=hp(before,id);
  const dx=obj.x-before.foton.x,dy=obj.y-before.foton.y,distance=Math.hypot(dx,dy);
  assert(distance>35 && distance<555,"Target "+id+" not within real shot range "+distance);
  // On narrow touch displays, the existing rotate-device tutorial covers
  // the inner aiming arc. Aim farther along the SAME authentic world ray,
  // inside the visible Canvas and above that overlay; do not change the shot.
  const aimDistance=(page.viewportSize()?.width??1440)<500?250:150;
  const scale=aimDistance/before.camera.zoom;
  const wx=before.foton.x+(dx/distance)*scale;
  const wy=before.foton.y+(dy/distance)*scale;
  const camera=before.camera;
  const rect=await page.locator("#game-canvas").boundingBox();
  assert(rect,"No physical Canvas rectangle");
  const logicalX=(wx-camera.x)*camera.zoom;
  const logicalY=(wy-camera.y)*camera.zoom;
  const x=rect.x+logicalX/camera.width*rect.width;
  const y=rect.y+logicalY/camera.height*rect.height;
  assert(x>rect.x+3 && x<rect.x+rect.width-3 && y>rect.y+3 &&
    y<rect.y+rect.height-3,"Natural aim cursor outside viewport "+JSON.stringify({id,x,y,rect}));
  // Native mouse pointerdown/up on real Canvas. No evaluate() dispatch,
  // no synthetic projectile creation, no mutable engine or React access.
  await nativeShot(page,x,y);
  let after;
  for(let i=0;i<17;i++){
    await page.clock.runFor(100);
    after=await read(page);
    if(!after)throw Error("Actual QA ended unexpectedly during shot "+id);
    if(hp(after,id)<old)break;
    if(i>=2 && !after.shotActive)break;
  }
  if(touchMode)assert(after?.lastQaPointerType==="touch",
    "QA did not receive actual native touch pointerdown: "+after?.lastQaPointerType);
  assert(after && hp(after,id) < old,
    "Native Canvas shot missed "+id+" | "+JSON.stringify({old,
      afterHP:after?hp(after,id):null,shotActive:after?.shotActive,
      foton:before.foton,target:obj,camera:before.camera,cursor:{x,y}}));
  assert(Math.abs(after.foton.x-before.foton.x)<1 &&
    Math.abs(after.foton.y-before.foton.y)<1,
    "QA pointerup leaked into normal click-to-move");
  // Consume singleton shot to allow another real pointerdown.
  for(let i=0;i<3 && after.shotActive;i++){
    await page.clock.runFor(50);after=await read(page);
  }
  assert(!after.shotActive,"C2 did not consume real shot upon impact "+id);
  return {target:id,from:old,to:hp(after,id)};
}
async function run(browser,caseName,opts,full){
  const {page,context}=await initialize(browser,caseName,...opts);
  try{
    const reposition=await positionFoton(page);
    await capture(page,caseName+"-before");
    const untouched=await read(page);
    assert(untouched.boss.health===1920,"Original core initial HP mismatch");
    assert(untouched.anchors.every(a=>a.health===135),"Initial four anchor HP mismatch");
    const coreWasLocked=untouched.boss.health;
    // Fire once at the locked core using real pointer/camera input; real C3
    // must NOT consume HP before cardinal shields are eliminated.
    const target=untouched.boss,cam=untouched.camera,foton=untouched.foton;
    const ax=target.x-foton.x,ay=target.y-foton.y,len=Math.hypot(ax,ay);
    const rect=await page.locator("#game-canvas").boundingBox();
    const aimDistance=(page.viewportSize()?.width??1440)<500?250:150;
    const aimX=foton.x+ax/len*aimDistance/cam.zoom;
    const aimY=foton.y+ay/len*aimDistance/cam.zoom;
    await nativeShot(page,rect.x+(aimX-cam.x)*cam.zoom/cam.width*rect.width,
      rect.y+(aimY-cam.y)*cam.zoom/cam.height*rect.height);
    await page.clock.runFor(1500);
    const protectedBoss=await read(page);
    assert(protectedBoss?.boss.health===coreWasLocked,
      "Core damaged before destroying four authenticated anchors");
    // Wait for locked-core projectile to expire, not a fake forced disposal.
    for(let i=0;i<10 && (await read(page))?.shotActive;i++)await page.clock.runFor(100);
    assert(!(await read(page))?.shotActive,"Locked core shot did not expire naturally");

    const events=[];
    // South first, because the straight trajectory to EAST intersects SOUTH.
    const order=["SOUTH","EAST","NORTH","WEST"];
    for(const id of order){
      const initialHP=hp(await read(page),id);
      const count=full?Math.ceil(initialHP/20):1;
      for(let n=0;n<count;n++)events.push(await shoot(page,id));
      const current=await read(page);
      assert(hp(current,id)===(full?0:initialHP-20),id+" failed authentic HP progression");
      await capture(page,caseName+"-"+id.toLowerCase()+(full?"-destroyed":"-damaged"));
      if(!full)break;
    }
    let coreShots=0;
    if(full){
      const exposed=await read(page);
      assert(exposed.anchors.every(a=>a.health===0),"Four anchor shields not destroyed");
      assert(exposed.boss.health===1920,"Locked core got premature damage");
      await capture(page,caseName+"-core-exposed");
      // Core 1920/20 = 96 true native clicks. Last impact tears down
      // authenticated diagnostic and shows a separate no-reward status.
      for(let n=0;n<96;n++){
        if(n===95){
          const prior=await read(page);
          assert(prior?.boss.health===20,"Core not at final 20 HP");
          // Terminal shot cannot be observed via readout after valid teardown,
          // so aim and send genuine mouse event and then inspect status text.
          const obj=prior.boss,cam=prior.camera,foton=prior.foton;
          const rect=await page.locator("#game-canvas").boundingBox();
          const dx=obj.x-foton.x,dy=obj.y-foton.y,d=Math.hypot(dx,dy);
          const cx=foton.x+dx/d*150/cam.zoom,cy=foton.y+dy/d*150/cam.zoom;
          await nativeShot(page,rect.x+(cx-cam.x)*cam.zoom/cam.width*rect.width,
            rect.y+(cy-cam.y)*cam.zoom/cam.height*rect.height);
          // One last genuine projectile must fly the full ~350 world units.
          // Its 1600ms lifetime remains the bound; 1300ms allows actual travel.
          await page.clock.runFor(1300);
          await page.getByText("DEV QA COMPLETE — ARCHITECT CORE 0 HP",{exact:false})
            .waitFor({state:"visible",timeout:10000});
          assert(await read(page)===null,"Terminal C3 left stale active identity");
          coreShots++;
        }else{
          const hit=await shoot(page,"CORE");
          assert(hit.to===hit.from-20,"Real core hit wasn't 20");
          coreShots++;
        }
      }
      await capture(page,caseName+"-qa-complete");
    }
    evidence.cases.push({name:caseName,pass:true,viewport:{width:opts[0],height:opts[1]},
      shots:events.length,coreShots,initial:reposition,
      coreInitiallyProtected:true,realNativePointerOnly:true});
  } finally {await context.close();}
}
await mkdir(output,{recursive:true});
let browser;
try{
  await server();
  browser=await chromium.launch({headless:true,args:["--disable-dev-shm-usage",
    "--use-gl=angle","--use-angle=swiftshader"]});
  if(touchMode) {
    await run(browser,"mobile-touch-full", [390,844,true,true],true);
    await run(browser,"mobile-compact-touch", [320,700,true,true],false);
    await run(browser,"mobile-wide-touch", [428,926,true,true],false);
  } else {
    await run(browser,"desktop", [1440,900,false,false],true);
    await run(browser,"mobile-touch", [390,844,true,true],false);
  }
}catch(e){evidence.failures.push({message:String(e),stack:e?.stack??""});process.exitCode=1;}
finally{
  evidence.consoleErrors=err;
  await writeFile(join(output,"evidence.json"),JSON.stringify(evidence,null,2)+"\n");
  if(browser)await browser.close();
  for(const s of servers)try{s.kill("SIGTERM");}catch{}
  console.log(JSON.stringify({cases:evidence.cases,failures:evidence.failures,
    errors:evidence.consoleErrors,output}));
}
