/** UX02 — genuine mobile Chromium widescreen playfield and native touch aim. */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdir, writeFile, stat } from "node:fs/promises";
import { join } from "node:path";

const port=4189,url="http://127.0.0.1:"+port;
const output=process.env.ORBI_ANDROID_UX02_OUTPUT || "artifacts/android-ux02";
const evidence={type:"REAL_PANORAMIC_CANVAS_AND_NATIVE_TOUCH",cases:[],screenshots:[],
  errors:[],failures:[],humanAndroidDevice:false};
const servers=[],errors=[];
const check=(ok,why)=>{if(!ok)throw Error(why);};
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function capture(page,name) {
  const path=join(output,name+".png");
  await page.screenshot({path,animations:"disabled",fullPage:false});
  const bytes=(await stat(path)).size;
  check(bytes>10000,name+": screenshot empty");
  evidence.screenshots.push({name,bytes});
}
async function boot() {
  const child=spawn(process.execPath,["node_modules/vite/bin/vite.js",
    "--host","127.0.0.1","--port",String(port),"--strictPort"],
    {stdio:["ignore","pipe","pipe"]});
  servers.push(child);
  let logs="";
  for(const io of [child.stdout,child.stderr])io.on("data",x=>logs+=x.toString().slice(0,2000));
  for(let i=0;i<130;i++){
    try{if((await fetch(url)).ok)return;}catch{}
    await sleep(250);
  }
  throw Error("Vite failed: "+logs.slice(-1500));
}
const read=async page=>{
  const value=await page.locator("#game-canvas").getAttribute("data-architect-qa-readout");
  return value?JSON.parse(value):null;
};
async function run(browser,name,width,height,mobile,touch,panorama){
  const context=await browser.newContext({viewport:{width,height},isMobile:mobile,
    hasTouch:touch,deviceScaleFactor:1,serviceWorkers:"block",reducedMotion:"reduce"});
  const page=await context.newPage();
  page.on("pageerror",e=>errors.push(name+": "+String(e)));
  page.on("console",m=>{if(m.type()==="error")errors.push(name+": "+m.text().slice(0,400));});
  try{
    await page.clock.install({time:new Date("2026-10-22T12:00:00Z")});
    await page.goto(url,{waitUntil:"domcontentloaded",timeout:30000});
    const start=page.locator('[data-primary-start-cta="true"]');
    await start.waitFor({state:"visible",timeout:30000});
    await page.clock.pauseAt(new Date("2026-10-22T12:00:05Z"));
    await start.click();
    const root=page.locator(".orbi-game-root");
    await root.waitFor({state:"visible"});
    check((await root.getAttribute("data-immersive-landscape"))===(panorama?"true":"false"),
      name+": viewport kind not isolated");
    await page.clock.runFor(80);
    const sizes=await page.evaluate(()=>{
      const canvas=document.querySelector("#game-canvas");
      const stage=document.querySelector(".orbi-game-stage");
      if(!(canvas instanceof HTMLCanvasElement)||!(stage instanceof HTMLElement))return null;
      const c=canvas.getBoundingClientRect(),s=stage.getBoundingClientRect();
      return {canvasCss:{x:c.x,y:c.y,width:c.width,height:c.height},
        stage:{x:s.x,y:s.y,width:s.width,height:s.height},
        logicalWidth:Number(canvas.dataset.logicalWidth),
        logicalHeight:Number(canvas.dataset.logicalHeight),
        backingWidth:canvas.width,backingHeight:canvas.height,
        stageAspect:s.width/s.height,canvasAspect:Number(canvas.dataset.logicalWidth)/
          Number(canvas.dataset.logicalHeight),
      };
    });
    check(sizes,name+": Canvas geometry unavailable");
    if(panorama){
      check(sizes.logicalWidth>800 && sizes.logicalHeight===480,name+": still in 5:3 canvas");
      check(sizes.canvasCss.width>=sizes.stage.width*.985,
        name+": actual canvas does not cover stage width");
      check(Math.abs(sizes.stageAspect-sizes.canvasAspect)<.025,
        name+": actual playable world still letterboxed or distorted "+JSON.stringify(sizes));
    }else check(sizes.logicalWidth===800 && sizes.logicalHeight===480,
      name+": original desktop/portrait viewport changed");
    await capture(page,name+"-actual-world");

    let physicalHit=false;
    if(panorama){
      const enter=page.getByRole("button",{name:"ENTER QA Blackout Architect QA"});
      await enter.waitFor({state:"visible",timeout:10000});
      await enter.click();
      await page.getByRole("button",{name:"EXIT QA Blackout Architect QA"}).waitFor({state:"visible"});
      await page.clock.runFor(80);
      const initial=await read(page);
      check(initial && initial.camera.width===sizes.logicalWidth,
        name+": engine camera not synchronized with real Canvas");
      await page.keyboard.down("ArrowLeft");
      await page.clock.runFor(1150);
      await page.keyboard.up("ArrowLeft");
      await page.clock.runFor(90);
      const before=await read(page);
      check(before && before.foton.x<initial.foton.x-100,name+": genuine FOTON travel failed");
      const south=before.anchors.find(a=>a.id==="SOUTH");
      check(south?.health===135,name+": original SOUTH anchor was modified");
      const dx=south.x-before.foton.x,dy=south.y-before.foton.y;
      const dist=Math.hypot(dx,dy);
      const target={x:before.foton.x+dx/dist*150/before.camera.zoom,
        y:before.foton.y+dy/dist*150/before.camera.zoom};
      const box=await page.locator("#game-canvas").boundingBox();
      check(box,name+": real Canvas absent");
      const x=box.x+(target.x-before.camera.x)*before.camera.zoom/
        before.camera.width*box.width;
      const y=box.y+(target.y-before.camera.y)*before.camera.zoom/
        before.camera.height*box.height;
      check(x>box.x+2 && x<box.x+box.width-2 && y>box.y+2 && y<box.y+box.height-2,
        name+": panoramic camera produced untouchable real aim target");
      await page.touchscreen.tap(x,y); // Native pointer: never inject damage or refs.
      let after=null;
      for(let i=0;i<21;i++){
        await page.clock.runFor(100);
        after=await read(page);
        if(after?.anchors.find(a=>a.id==="SOUTH")?.health <135)break;
      }
      check(after?.anchors.find(a=>a.id==="SOUTH")?.health===115,
        name+": real panoramic touch did not inflict genuine 20 HP anchor impact "+
        JSON.stringify({before:before.foton,after:after?.foton,anchor:south,aim:{x,y}}));
      check(after.lastQaPointerType==="touch",
        name+": original projectile did not receive native touch pointer");
      check(Math.abs(after.foton.x-before.foton.x)<1,
        name+": touch shot leaked into FOTON movement");
      physicalHit=true;
      await capture(page,name+"-native-hit");
    }
    evidence.cases.push({name,pass:true,physicalHit,viewport:{width,height},...sizes});
  }finally{await context.close();}
}
await mkdir(output,{recursive:true});
let browser;
try {
  await boot();
  browser=await chromium.launch({headless:true,args:[
    "--disable-dev-shm-usage","--use-gl=angle","--use-angle=swiftshader"]});
  await run(browser,"panorama-915x412",915,412,true,true,true);
  await run(browser,"panorama-844x390",844,390,true,true,true);
  await run(browser,"panorama-740x360",740,360,true,true,true);
  await run(browser,"desktop-1440x900",1440,900,false,false,false);
  await run(browser,"portrait-390x844",390,844,true,true,false);
}catch(e){evidence.failures.push({message:String(e),stack:e?.stack||""});process.exitCode=1;}
finally{
  evidence.errors=errors;
  await writeFile(join(output,"evidence.json"),JSON.stringify(evidence,null,2)+"\n");
  if(browser)await browser.close();
  for(const s of servers)try{s.kill("SIGTERM");}catch{}
  console.log(JSON.stringify({cases:evidence.cases.map(x=>x.name),failures:evidence.failures,
    errors:evidence.errors,output}));
}
