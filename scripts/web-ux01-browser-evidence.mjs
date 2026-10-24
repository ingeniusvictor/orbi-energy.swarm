/** WEB UX01 — real Chromium evidence for native desktop panorama and panels.
 * No mock Canvas snapshots. QA diagnostics are not enabled by this script. */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdir, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";

const port = 4192;
const url = "http://127.0.0.1:" + port;
const output = process.env.ORBI_WEB_UX01_OUTPUT || "artifacts/web-ux01";
const evidence = { type: "REAL_WEB_IMMERSIVE_CHROMIUM", cases: [],
  screenshots: [], failures: [], errors: [], physicalAndroidDevice: false };
const diagnostics = [];
const check = (value, description) => { if (!value) throw Error(description); };
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
let server, browser;

async function startServer() {
  server = spawn(process.execPath, ["node_modules/vite/bin/vite.js", "preview", "--host",
    "127.0.0.1", "--port", String(port), "--strictPort"],
    { stdio: ["ignore", "pipe", "pipe"] });
  let logs = "";
  for (const s of [server.stdout,server.stderr]) s.on("data", x => logs += x.toString().slice(-1200));
  for(let i=0;i<120;i++) {try{if((await fetch(url)).ok)return;}catch{} await sleep(250);}
  throw Error("Vite startup: " + logs.slice(-1400));
}
async function shot(page,name) {
  const path=join(output,name+".png");
  await page.screenshot({path,animations:"disabled",fullPage:false});
  const bytes=(await stat(path)).size;
  check(bytes>10000,name+": missing screenshot");
  evidence.screenshots.push({name,bytes});
}
async function run(name,width,height,coarse,immersive,webImmersive) {
  const context=await browser.newContext({viewport:{width,height},
    isMobile:coarse,hasTouch:coarse,deviceScaleFactor:1,
    reducedMotion:"reduce",serviceWorkers:"block"});
  const page=await context.newPage();
  page.on("pageerror",e=>diagnostics.push(name+": "+String(e)));
  page.on("console",msg=>{if(msg.type()==="error")diagnostics.push(name+": "+msg.text());});
  try {
    await page.clock.install({time:new Date("2026-10-22T12:00:00Z")});
    await page.goto(url,{waitUntil:"domcontentloaded",timeout:30000});
    await page.clock.pauseAt(new Date("2026-10-22T12:00:05Z"));
    const entry=page.getByTestId("orbi-mobile-enter");
    if(await entry.isVisible()) {
      await entry.waitFor({state:"visible",timeout:30000});
      await entry.click();
      await page.getByTestId("orbi-mobile-menu-main-play").click();
      await page.getByTestId("orbi-mobile-campaign").click();
    }else{
      const start=page.locator('[data-primary-start-cta="true"]');
      await start.waitFor({state:"visible",timeout:30000});
      await start.click();
    }
    // The evidence runs against the production Vite bundle (not DEV QA).
    check((await page.locator('[data-testid="architect-qa-touch-dock"]').count())===0,
      name+": developer QA controls leaked into production");
    const root=page.locator(".orbi-game-root");
    check((await root.getAttribute("data-immersive-landscape"))===String(immersive),
      name+": unexpected immersive mode");
    check((await root.getAttribute("data-web-immersive"))===String(webImmersive),
      name+": unexpected desktop mode");
    await page.clock.runFor(120);
    const geometry=await page.evaluate(()=>{
      const root=document.querySelector(".orbi-game-root");
      const canvas=document.querySelector("#game-canvas");
      const stage=document.querySelector(".orbi-game-stage");
      const hud=document.querySelector(".orbi-game-hud");
      if(!(root instanceof HTMLElement)||!(canvas instanceof HTMLCanvasElement)||
         !(stage instanceof HTMLElement)||!(hud instanceof HTMLElement))return null;
      const c=canvas.getBoundingClientRect(),s=stage.getBoundingClientRect(),h=hud.getBoundingClientRect();
      return {root:{width:root.getBoundingClientRect().width,height:root.getBoundingClientRect().height},
        stage:{x:s.x,y:s.y,width:s.width,height:s.height},
        canvas:{x:c.x,y:c.y,width:c.width,height:c.height},
        hud:{height:h.height},logicalWidth:Number(canvas.dataset.logicalWidth),
        logicalHeight:Number(canvas.dataset.logicalHeight),
        actualRatio:c.width/c.height,logicalRatio:Number(canvas.dataset.logicalWidth)/Number(canvas.dataset.logicalHeight)};
    });
    check(geometry,name+": missing game Canvas");
    if(immersive) {
      check(geometry.stage.width>=geometry.root.width*.985,
        name+": battlefield stage not fullscreen "+JSON.stringify(geometry));
      check(geometry.stage.height>=geometry.root.height-geometry.hud.height-3,
        name+": battlefield stage short "+JSON.stringify(geometry));
      check(geometry.hud.height<=48,name+": HUD too tall");
      check(geometry.logicalWidth>800 && geometry.logicalHeight===480,
        name+": panoramic world is absent "+JSON.stringify(geometry));
      check(geometry.canvas.width>=geometry.stage.width*.985,
        name+": game Canvas remains letterboxed");
      check(Math.abs(geometry.actualRatio-geometry.logicalRatio)<.025,
        name+": Canvas stretched/cropped "+JSON.stringify(geometry));
      check(await page.locator('[data-testid="orbi-immersive-essential"]').isVisible(),
        name+": compact HUD hidden");
      check(!await page.locator(".orbi-tactical-rail").isVisible(),name+": old tactical rail visible");
      check(!await page.locator(".orbi-logistics-deck").isVisible(),name+": old logistics rail visible");
      await shot(page,name+"-battlefield");
      const estado=page.locator('[data-testid="orbi-estado-button"]');
      await estado.click();
      check(await page.locator(".orbi-hud-detail-grid").isVisible(),name+": Estado grid hidden");
      // UX10 moves the detailed counters into a native premium panel. The
      // compact HUD rows are intentionally hidden while this drawer is open.
      const premium=page.locator(".orbi-premium-status");
      check(await premium.isVisible(),name+": premium Estado not rendered");
      const energy3d=page.locator('[data-testid="orbi-ux11d-energy-3d"]');
      await energy3d.waitFor({state:"visible",timeout:12000});
      check(await energy3d.isVisible(),name+": 3D ENERGY status identity missing");
      check(await energy3d.getAttribute("data-energy-id")==="ENERGY",
        name+": wrong 3D ENERGY status identity");
      await page.waitForFunction(() => {
        const stage=document.querySelector('[data-testid="orbi-ux11d-energy-3d"]');
        return stage && ["READY","FALLBACK"].includes(stage.getAttribute("data-energy-3d-status"));
      },null,{timeout:12000});
      const energy3dStatus=await energy3d.getAttribute("data-energy-3d-status");
      if(energy3dStatus==="READY"){
        check(await energy3d.locator("canvas.orbi-ux11d-energy-canvas").count()===1,
          name+": WebGL ENERGY canvas not mounted");
      }else{
        check(await energy3d.locator(".orbi-ux11d-energy-fallback").isVisible(),
          name+": WebGL-off CSS ENERGY fallback absent");
      }

      const swarm=await premium.locator(".orbi-premium-status-counters article").first().boundingBox();
      check(swarm && swarm.width>20,name+": Estado stats collapsed");
      check(await premium.locator(".orbi-premium-status-counters article").count()===3,
        name+": Estado must display live swarm, score and credits");
      check(await page.locator('.orbi-immersive-action[aria-label="Reanudar"]').count()===1,
        name+": Estado drawer did not actually pause simulation");
      const estadoBounds=await page.locator(".orbi-hud-detail-grid").boundingBox();
      check(estadoBounds && estadoBounds.width>200 && estadoBounds.height>80,name+": Estado bounds invalid");
      await shot(page,name+"-estado");
      await page.getByRole("button",{name:/^Táctica$|^Tactics$/}).click();
      check(await page.locator(".orbi-tactical-rail").isVisible(),name+": Tactica panel not visible");
      const tacticalBounds=await page.locator(".orbi-tactical-rail").boundingBox();
      check(tacticalBounds && Math.abs(tacticalBounds.x-estadoBounds.x)<3 &&
        Math.abs(tacticalBounds.y-estadoBounds.y)<3 &&
        Math.abs(tacticalBounds.width-estadoBounds.width)<3 &&
        Math.abs(tacticalBounds.height-estadoBounds.height)<3,
        name+": Tactica diverges from Estado frame");
      check(await page.locator(".orbi-tactical-premium-formation-grid button").count()===6,
        name+": six canonical tactical formations not present");
      const tacticalCards=await page.locator(".orbi-tactical-premium-formation-grid button").evaluateAll(els=>
        els.map(el=>({width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height})));
      check(tacticalCards.every(c=>c.width>=145 && c.height>=75),
        name+": tactical live formation cards compressed "+JSON.stringify(tacticalCards));
      check(await page.locator(".orbi-tactical-premium-formation-grid svg[role='img']").count()===6,
        name+": real geometric illustrations missing from battle tactics");
      await shot(page,name+"-tactica");
      await page.getByRole("button",{name:/^Equipo$|^Team$/}).click();
      check(await page.locator(".orbi-logistics-deck").isVisible(),name+": Equipo panel not visible");
      const equipmentBounds=await page.locator(".orbi-logistics-deck").boundingBox();
      check(equipmentBounds && Math.abs(equipmentBounds.x-estadoBounds.x)<3 &&
        Math.abs(equipmentBounds.y-estadoBounds.y)<3 &&
        Math.abs(equipmentBounds.width-estadoBounds.width)<3 &&
        Math.abs(equipmentBounds.height-estadoBounds.height)<3,
        name+": Equipo diverges from Estado frame");
      check(await page.locator(".orbi-companion-tabs button").count()===4,
        name+": equipment navigation lost a tab");
      await shot(page,name+"-equipo");
      await page.keyboard.press("Escape");
      await page.clock.runFor(100);
      check(!await page.locator(".orbi-immersive-panel-heading").isVisible(),
        name+": Escape did not close drawer");
      check((await page.locator('.orbi-immersive-action[aria-label="Pausar"]').count())===1 ||
            (await page.locator('.orbi-immersive-action[aria-label="Pause"]').count())===1,
        name+": Escape inadvertently paused gameplay");
      if(webImmersive) {
        check(await page.locator('[data-testid="orbi-web-fullscreen"]').isVisible(),
          name+": native browser fullscreen action inaccessible");
        check(!await page.locator(".orbi-touch-overlay").isVisible(),
          name+": mobile D-pad leaked into keyboard experience");
      }else{
        check(await page.locator(".orbi-touch-overlay").isVisible(),
          name+": touch D-pad hidden on mobile");
      }
    }else{
      check(geometry.logicalWidth===800 && geometry.logicalHeight===480,
        name+": legacy portrait regression "+JSON.stringify(geometry));
      await shot(page,name+"-portrait");
    }
    evidence.cases.push({name,pass:true,geometry});
  }finally{await context.close();}
}
await mkdir(output,{recursive:true});
try {
  await startServer();
  browser=await chromium.launch({headless:true,args:["--disable-dev-shm-usage",
    "--use-gl=angle","--use-angle=swiftshader"]});
  await run("desktop-1440x900",1440,900,false,true,true);
  await run("desktop-1920x1080",1920,1080,false,true,true);
  await run("laptop-1366x768",1366,768,false,true,true);
  await run("mobile-touch-844x390",844,390,true,true,false);
  await run("portrait-touch-390x844",390,844,true,false,false);
}catch(error){evidence.failures.push({message:String(error),stack:error?.stack||""});process.exitCode=1;}
finally{
  evidence.errors=diagnostics;
  if(browser)await browser.close();
  if(server)server.kill("SIGTERM");
  if(diagnostics.length)process.exitCode=1;
  await writeFile(join(output,"evidence.json"),JSON.stringify(evidence,null,2)+"\n");
  console.log(JSON.stringify({cases:evidence.cases.map(x=>x.name),failures:evidence.failures,
    errors:evidence.errors,output}));
}
