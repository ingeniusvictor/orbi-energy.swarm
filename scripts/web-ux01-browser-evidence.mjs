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
  screenshots: [], glbStatuses: [], failures: [], errors: [], physicalAndroidDevice: false };
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
    isMobile:coarse,hasTouch:coarse,deviceScaleFactor:coarse?2:1,
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
      const swarm=await premium.locator(".orbi-premium-status-counters article").first().boundingBox();
      check(swarm && swarm.width>20,name+": Estado stats collapsed");
      check(await premium.locator(".orbi-premium-status-counters article").count()===3,
        name+": Estado must display live swarm, score and credits");
      const energyPreview=premium.getByTestId("orbi-ux11d-energy-preview");
      check(await energyPreview.isVisible(),name+": ENERGY 3D status module absent");
      check(await premium.locator(".orbi-ux11d-ability-deck article").count()===4,
        name+": Estado combat ability cards missing");
      check((await premium.locator(".orbi-ux11d-ability-deck").innerText()).includes("OVERDRIVE"),
        name+": Overdrive details missing");
      check((await premium.locator(".orbi-ux11d-ability-deck").innerText()).includes("CONVERGEN"),
        name+": Convergence details missing");
      check((await energyPreview.getAttribute("aria-label")).includes("ENERGY"),
        name+": hero identity is not ENERGY");
      await page.waitForFunction(() => {
        const el=document.querySelector('[data-testid="orbi-ux11d-energy-preview"]');
        return el && ["READY","FALLBACK"].includes(el.getAttribute("data-3d-status"));
      },{timeout:10000});
      const status=await energyPreview.getAttribute("data-3d-status");
      const hasHeroCanvas=(await energyPreview.locator(".orbi-ux11d-webgl-canvas").count())>0;
      const glbFallbackReason=await energyPreview.getAttribute("data-fallback-reason");
      evidence.glbStatuses.push({name,status,hasHeroCanvas,glbFallbackReason});
      // A browser with WebGL must render a real GLB rather than silently
      // accepting the flat fallback.
      check(status==="READY" || (!hasHeroCanvas && glbFallbackReason==="webgl-unavailable"),
        name+": canonical GLB failed despite WebGL canvas: "+glbFallbackReason);
      if(status==="READY"){
        check(await energyPreview.getAttribute("data-model-source")==="canonical-glb",
          name+": authentic gameplay GLB not mounted in Estado");
        check((await energyPreview.locator(".orbi-ux11d-preview-marker").innerText()).includes("ENERGY"),
          name+": real GLB identity marker missing");
        const canvas=energyPreview.locator(".orbi-ux11d-webgl-canvas");
        check(await canvas.isVisible(),name+": WebGL hero canvas missing");
        const size=await canvas.boundingBox();
        check(size && size.width>=55 && size.height>=70,name+": 3D viewport collapsed");
        // Validate actual browser context-loss downgrade with the CSS preview.
        await canvas.evaluate(el=>el.dispatchEvent(new Event("webglcontextlost",{bubbles:true,cancelable:true})));
        await page.waitForFunction(()=>
          document.querySelector('[data-testid="orbi-ux11d-energy-preview"]')?.getAttribute("data-3d-status")==="FALLBACK");
        check(await energyPreview.locator(".orbi-ux11d-fallback").isVisible(),
          name+": WebGL context loss did not expose CSS hero");
      } else {
        check(await energyPreview.locator(".orbi-ux11d-fallback").isVisible(),
          name+": missing WebGL still suppresses hero");
      }
      check(await premium.locator(".orbi-ux11d-ability-deck").isVisible(),
        name+": status interaction lost after WebGL check");
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
      // UX11-E: exercise the real Dash action against the production engine.
      const dash=page.getByTestId(webImmersive?"orbi-dash-action":"orbi-touch-dash");
      check(await dash.isVisible(),name+": active Dash control absent");
      if (!webImmersive) {
        check(!await page.getByTestId("orbi-dash-action").isVisible(),name+": duplicate top Dash button still visible");
        check(!await page.getByTestId("orbi-overdrive-action").isVisible(),name+": duplicate top Overdrive button still visible");
        const overdrive=page.getByTestId("orbi-touch-overdrive");
        check(await overdrive.isVisible(),name+": right thumb Overdrive absent");
        const overdriveRect=await overdrive.boundingBox();
        const dashRect=await dash.boundingBox();
        const convergence=page.getByTestId("orbi-touch-convergence");
        check(await convergence.isVisible(),name+": dedicated mobile Q action absent");
        check(!await page.getByTestId("orbi-convergence-action").isVisible(),
          name+": duplicate top Q action visible over thumb dock");
        const qRect=await convergence.boundingBox();
        check(overdriveRect && dashRect && qRect &&
          overdriveRect.x+overdriveRect.width<=dashRect.x-2 &&
          Math.max(overdriveRect.y+overdriveRect.height,dashRect.y+dashRect.height)<=qRect.y-2 &&
          qRect.width>=44 && qRect.height>=44,
          name+": UX14-B three independent touch skills overlap or are too small");
        check(!await convergence.isEnabled(),name+": Convergence illegally ready without 8 ORBIs and resonance");
      }
      check(await dash.isEnabled(),name+": Dash not initially ready");
      if (webImmersive) {
        const convergence=page.getByTestId("orbi-convergence-action");
        check(await convergence.isVisible(),name+": desktop Q action absent");
        check(!await convergence.isEnabled(),name+": Q illegally enabled without resonance");
        await page.keyboard.press("Q");
        check(!await convergence.isEnabled(),name+": Q bypassed admission requirements");
      }
      if(webImmersive) {
        await page.keyboard.press("E");
      } else {
        const touchDash=page.getByTestId("orbi-touch-dash");
        check(await touchDash.isVisible(),name+": right-thumb Dash button absent");
        const thumbBounds=await touchDash.boundingBox();
        check(thumbBounds && thumbBounds.width>=44 && thumbBounds.height>=44,
          name+": Dash thumb hit target too small");
        const formationDock=await page.locator(".orbi-touch-formation-carousel").boundingBox();
        check(thumbBounds && formationDock && thumbBounds.y+thumbBounds.height+4<=formationDock.y,
          name+": Dash thumb overlaps formation buttons");
        // UX12 true multi-pointer proof: thumb #1 keeps steering while
        // independent thumb #2 triggers Dash without releasing the joystick.
        const joystick=page.getByTestId("orbi-analog-joystick");
        const joyBounds=await joystick.boundingBox();
        check(joyBounds,name+": analog joystick not available for two-finger test");
        const jx=joyBounds.x+joyBounds.width*.7, jy=joyBounds.y+joyBounds.height*.5;
        const bx=thumbBounds.x+thumbBounds.width/2, by=thumbBounds.y+thumbBounds.height/2;
        const cdp=await page.context().newCDPSession(page);
        await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x:jx,y:jy,id:1}]});
        check(await joystick.getAttribute("data-engaged")==="true",name+": joystick did not capture first finger");
        await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x:jx,y:jy,id:1},{x:bx,y:by,id:2}]});
        check(await joystick.getAttribute("data-engaged")==="true",name+": second finger on Dash released joystick");
        check(!await touchDash.isEnabled(),name+": Dash not activated while steering");
        // CDP touchEnd touchPoints specifies the REMOVED contact, not the survivors.
        await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[{x:bx,y:by,id:2}]});
        check(await joystick.getAttribute("data-engaged")==="true",name+": releasing Dash finger disengaged steering finger");
        await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[{x:jx,y:jy,id:1}]});
        check(await joystick.getAttribute("data-engaged")==="false",name+": releasing joystick finger did not stop steering");
        await cdp.detach();
      }
      await page.clock.runFor(50);
      check(!await dash.isEnabled(),name+": dash did not enter cooldown");
      await page.clock.runFor(200);
      check(!await dash.isEnabled(),name+": Dash cooldown bypassed");
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
    "--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"]});
  await run("desktop-1440x900",1440,900,false,true,true);
  await run("desktop-1920x1080",1920,1080,false,true,true);
  await run("laptop-1366x768",1366,768,false,true,true);
  await run("mobile-touch-844x390",844,390,true,true,false);
  await run("portrait-touch-390x844",390,844,true,false,false);
  check(evidence.glbStatuses.some(entry=>entry.status==="READY"),
    "No real GLB rendered in any Chromium viewport; fallback is not UX14-C acceptance");
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
