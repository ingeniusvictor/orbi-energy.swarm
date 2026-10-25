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
        // UX14-C: capture the actual mounted GLB after model loading, before
        // forcing WebGL loss (the older Estado shot precedes async loading).
        await shot(page,name+"-energy-real-glb");
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
// UX15-B isolated production-bundle acceptance: this preview is not gameplay.
async function runRouteQa(name,width,height,touch){
  const context=await browser.newContext({viewport:{width,height},isMobile:touch,
    hasTouch:touch,deviceScaleFactor:touch?2:1,
    reducedMotion:"no-preference",serviceWorkers:"block"});
  const page=await context.newPage();
  page.on("pageerror",e=>diagnostics.push(name+": "+String(e)));
  page.on("console",msg=>{if(msg.type()==="error")diagnostics.push(name+": "+msg.text());});
  try{
    await page.goto(url+"/?ux15-route-qa=1",{waitUntil:"domcontentloaded",timeout:30000});
    const lab=page.getByTestId("ux15-route-qa");
    await lab.waitFor({state:"visible",timeout:15000});
    check(await lab.getAttribute("data-route-mode")==="ROUTE_QA_PREVIEW",
      name+": incorrect QA route mode");
    check(await page.getByTestId("ux15-route-canvas").isVisible(),
      name+": route Canvas2D preview hidden");
    const routeCanvasMetrics=await page.getByTestId("ux15-route-canvas").evaluate(el=>{
      const r=el.getBoundingClientRect();
      return {logicalWidth:Number(el.dataset.logicalWidth),logicalHeight:Number(el.dataset.logicalHeight),
        ratio:r.width/r.height,cssWidth:r.width,cssHeight:r.height};
    });
    check(routeCanvasMetrics.logicalHeight===480&&routeCanvasMetrics.logicalWidth>=800,
      name+": logical route viewport malformed "+JSON.stringify(routeCanvasMetrics));
    check(Math.abs(routeCanvasMetrics.ratio-routeCanvasMetrics.logicalWidth/480)<.035,
      name+": horizontal route viewport geometry stretched "+JSON.stringify(routeCanvasMetrics));
    if(touch) check(routeCanvasMetrics.logicalWidth>800&&routeCanvasMetrics.cssWidth>width*.85,
      name+": mobile route not truly panoramic "+JSON.stringify(routeCanvasMetrics));
    check((await page.locator(".orbi-game-root").count())===0,
      name+": QA preview mounted production combat game");
    await page.waitForFunction(()=>Number(document.querySelector(
      '[data-testid="ux15-route-qa"]')?.getAttribute("data-route-distance"))>2,
      {timeout:8000});
    const advanced=Number(await lab.getAttribute("data-route-distance"));
    check(advanced>2,name+": simulation clock not traversing");

    // Verify real 2D manual movement without changing the scenery ownership.
    await page.keyboard.down("d");
    await page.waitForTimeout(450);
    await page.keyboard.up("d");
    await page.waitForFunction(()=>Number(document.querySelector(
      '[data-testid="ux15-route-qa"]')?.getAttribute("data-player-manual-x"))>5,
      {timeout:4000});
    check(Number(await lab.getAttribute("data-player-manual-x"))>5,
      name+": ENERGY QA marker failed to move freely in X");
    await shot(page,name+"-asteria-route-traversal");

    await page.getByTestId("ux15-route-pause").click();
    await page.waitForTimeout(420);
    const paused=Number(await lab.getAttribute("data-route-distance"));
    await page.waitForTimeout(300);
    check(Number(await lab.getAttribute("data-route-distance"))===paused,
      name+": route progressed after pause");
    await page.getByTestId("ux15-route-reset").click();
    check(Number(await lab.getAttribute("data-route-distance"))===0,
      name+": reset did not return to segment zero");
    evidence.cases.push({name,pass:true,routePreview:true,advancedUnits:advanced});
  }finally{await context.close();}
}

/** UX15-C1: genuine production-bundle combat, NOT the isolated route lab. */
async function runAsteriaCombat(name,width,height,touch){
  const context=await browser.newContext({viewport:{width,height},
    isMobile:touch,hasTouch:touch,deviceScaleFactor:touch?2:1,
    reducedMotion:"reduce",serviceWorkers:"block"});
  const page=await context.newPage();
  page.on("pageerror",e=>diagnostics.push(name+": "+String(e)));
  page.on("console",msg=>{if(msg.type()==="error")diagnostics.push(name+": "+msg.text());});
  try{
    await page.clock.install({time:new Date("2026-10-25T10:00:00Z")});
    await page.goto(url+"/",{waitUntil:"domcontentloaded",timeout:30000});
    const mobileEnter=page.getByTestId("orbi-mobile-enter");
    if(await mobileEnter.isVisible()){
      await mobileEnter.click();
      await page.getByTestId("orbi-mobile-menu-main-play").click();
      await page.getByTestId("orbi-mobile-world-route").click();
    } else {
      const route=page.locator('[data-world-route-start-cta="true"]');
      await route.waitFor({state:"visible",timeout:30000});
      await route.click();
    }
    const canvas=page.locator("#game-canvas");
    check(await page.locator('[data-selected-game-mode="WORLD_ROUTE"]').count()===1,
      name+": World Traversal selection did not become the active run mode");
    check(await canvas.isVisible(),name+": real gameplay Canvas missing");
    check((await page.getByTestId("ux15-route-qa").count())===0,
      name+": isolated route laboratory impersonated a game");
    await page.clock.runFor(6200);
    await page.waitForFunction(()=>Number(document.querySelector(
      '#game-canvas')?.dataset.ux15RouteDistance)>10,{timeout:5000});
    const begin=Number(await canvas.getAttribute("data-ux15-route-distance"));
    check(await canvas.getAttribute("data-ux15-world")==="ASTERIA_ORBITAL",
      name+": opt-in live battle did not render ASTERIA");
    check(await canvas.getAttribute("data-ux15-live-combat")==="true",
      name+": only preview background rendered, no live combat contract");
    check(begin>10,name+": route is not scrolling within real combat");
    // UX15-C2B acceptance: not enough to show fallback/old geometric blocks.
    // Verify that the approved real WebP panorama decoded and painted inside
    // actual combat in BOTH desktop and touch-landscape Chromium.
    await page.waitForFunction(()=>document.querySelector("#game-canvas")
      ?.dataset.ux15Visual==="premium-webp",null,{timeout:12000});
    check(await canvas.getAttribute("data-ux15-visual")==="premium-webp",
      name+": approved premium ASTERIA assets did not render");
    check(await canvas.getAttribute("data-ux15-scene")==="ARRIVAL_GATE",
      name+": incorrect premium opening scene");
    check(await page.locator(".orbi-game-root").isVisible(),
      name+": real EnergySwarmGame root missing");
    await shot(page,name+"-asteria-live-combat");

    const estado=page.getByTestId("orbi-estado-button");
    await estado.click();
    await page.clock.runFor(500);
    const paused=Number(await canvas.getAttribute("data-ux15-route-distance"));
    await page.clock.runFor(800);
    check(Number(await canvas.getAttribute("data-ux15-route-distance"))===paused,
      name+": world continues while Estado opens and pauses combat");
    check(await page.getByTestId("orbi-ux11d-energy-preview").isVisible(),
      name+": authentic ENERGY status module missing in ASTERIA mode");

    evidence.cases.push({name,pass:true,ux15c1:true,ux15c2b:true,
      premiumWorld:true,liveCombat:true,scrollDistance:begin,pausedDistance:paused});
  }finally{await context.close();}
}

/** UX15-C3A-2: isolated PHYSICAL player/camera, not the legacy gameplay.
 * Ground acceptance in real simulation-owned player, camera and origin epoch.
 */
async function runPhysicalRouteQa(name,width,height,touch){
  const context=await browser.newContext({viewport:{width,height},
    isMobile:touch,hasTouch:touch,deviceScaleFactor:touch?2:1,
    reducedMotion:"no-preference",serviceWorkers:"block"});
  const page=await context.newPage();
  page.on("pageerror",e=>diagnostics.push(name+": "+String(e)));
  page.on("console",msg=>{if(msg.type()==="error")diagnostics.push(name+": "+msg.text());});
  try {
    await page.goto(url+"/?ux15-physical-qa=1",
      {waitUntil:"domcontentloaded",timeout:30000});
    const lab=page.getByTestId("ux15-physical-qa");
    await lab.waitFor({state:"visible",timeout:15000});
    check(await lab.getAttribute("data-qa-mode")==="PHYSICAL_ROUTE_ISOLATED",
      name+": incorrect isolated physics QA mode");
    check(await page.getByTestId("ux15-physical-canvas").isVisible(),
      name+": real physical QA Canvas missing");
    check((await page.locator(".orbi-game-root").count())===0,
      name+": production campaign instantiated by QA entry");
    check((await page.getByTestId("ux15-route-qa").count())===0,
      name+": legacy 2.5D fake marker instantiated instead of physical QA");
    await page.waitForFunction(()=>Number(document.querySelector(
      '[data-testid="ux15-physical-qa"]')?.dataset.physicsTicks)>15,
      null,{timeout:8000});
    const firstX=Number(await lab.getAttribute("data-player-local-x"));
    const firstCamera=Number(await lab.getAttribute("data-camera-local-x"));
    const firstOrbi=Number(await lab.getAttribute("data-orbi-local-x"));
    const firstEnemy=Number(await lab.getAttribute("data-enemy-local-x"));
    const firstShot=Number(await lab.getAttribute("data-shot-local-x"));
    const firstResource=Number(await lab.getAttribute("data-resource-local-x"));
    await page.waitForTimeout(900);
    await page.waitForFunction((x)=>Number(document.querySelector(
      '[data-testid="ux15-physical-qa"]')?.dataset.playerLocalX)>x+17,
      firstX,{timeout:4000});
    const progressedX=Number(await lab.getAttribute("data-player-local-x"));
    const progressedCamera=Number(await lab.getAttribute("data-camera-local-x"));
    const distance=Number(await lab.getAttribute("data-route-distance"));
    check(progressedX>firstX+17,name+": ENERGY did not auto-travel in physical local X");
    check(progressedCamera>firstCamera+12,name+": physical camera failed to follow ENERGY");
    check(Number(await lab.getAttribute("data-orbi-local-x"))>firstOrbi+17,
      name+": real ORBI formation did not follow ENERGY physically");
    check(Math.abs(Number(await lab.getAttribute("data-enemy-local-x"))-firstEnemy)<0.01,
      name+": static enemy moved without a floating-origin transaction");
    check(Math.abs(Number(await lab.getAttribute("data-shot-local-x"))-firstShot)<0.01,
      name+": static projectile moved without a floating-origin transaction");
    check(Math.abs(Number(await lab.getAttribute("data-resource-local-x"))-firstResource)<0.01,
      name+": static pickup moved without a floating-origin transaction");
    check(distance>20,name+": route cursor did not travel");
    const startY=Number(await lab.getAttribute("data-player-local-y"));

    if(touch){
      const bounds=await page.getByTestId("ux15-physical-canvas").boundingBox();
      check(Boolean(bounds),name+": canvas lacks touch dimensions");
      const cdp=await context.newCDPSession(page);
      const startX=bounds.x+bounds.width*.60;
      const touchY=bounds.y+bounds.height*.57;
      await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",
        touchPoints:[{x:startX,y:touchY}]});
      await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",
        touchPoints:[{x:startX+90,y:touchY-80}]});
      await page.waitForTimeout(520);
      await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});
      await cdp.detach();
    }else{
      await page.keyboard.down("w");
      await page.waitForTimeout(520);
      await page.keyboard.up("w");
    }
    await page.waitForFunction((y)=>Number(document.querySelector(
      '[data-testid="ux15-physical-qa"]')?.dataset.playerLocalY)<y-15,
      startY,{timeout:4000});
    await shot(page,name+"-real-physical-traversal");

    // Pausing freezes EVERY simulated owner, not merely the panorama.
    await page.getByTestId("ux15-physical-pause").click();
    await page.waitForTimeout(430);
    const beforePause={
      x:await lab.getAttribute("data-player-local-x"),
      cam:await lab.getAttribute("data-camera-local-x"),
      route:await lab.getAttribute("data-route-distance"),
      ticks:await lab.getAttribute("data-physics-ticks"),
    };
    await page.waitForTimeout(470);
    check(await lab.getAttribute("data-player-local-x")===beforePause.x,
      name+": physical ENERGY continues while paused");
    check(await lab.getAttribute("data-camera-local-x")===beforePause.cam,
      name+": physical camera continues while paused");
    check(await lab.getAttribute("data-route-distance")===beforePause.route,
      name+": route distance continues while paused");
    check(await lab.getAttribute("data-physics-ticks")===beforePause.ticks,
      name+": physical ticks continue while paused");

    await page.getByTestId("ux15-physical-pause").click();
    if(!touch){
      // Force a real rebase, and verify the logical route still advances while
      // the PHYSICAL local player is recentered.
      await page.keyboard.down("d");
      await page.waitForFunction(()=>Number(document.querySelector(
        '[data-testid="ux15-physical-qa"]')?.dataset.originEpoch)>=1,
        null,{timeout:9000});
      await page.keyboard.up("d");
      check(Number(await lab.getAttribute("data-rebase-count"))>=1,
        name+": physical floating origin did not rebase");
      const offset=Number(await lab.getAttribute("data-origin-offset-x"));
      check(offset>=512,name+": physical origin offset missing");
      check(Math.abs(Number(await lab.getAttribute("data-enemy-local-x"))+
        offset-firstEnemy)<0.01,name+": enemy not translated with origin");
      check(Math.abs(Number(await lab.getAttribute("data-shot-local-x"))+
        offset-firstShot)<0.01,name+": projectile not translated with origin");
      check(Math.abs(Number(await lab.getAttribute("data-resource-local-x"))+
        offset-firstResource)<0.01,name+": resource not translated with origin");
    }
    await page.getByTestId("ux15-physical-reset").click();
    check(Number(await lab.getAttribute("data-route-distance"))===0,
      name+": QA reset did not clear real route cursor");
    check(Number(await lab.getAttribute("data-origin-epoch"))===0,
      name+": QA reset did not clear origin epoch");
    check(Number(await lab.getAttribute("data-player-local-x"))===800,
      name+": QA reset did not restore physical ENERGY position");
    evidence.cases.push({name,pass:true,ux15c3a2:true,
      truePhysicalTravel:true,movedX:progressedX-firstX,
      movedCamera:progressedCamera-firstCamera,routeDistance:distance,
      input:touch?"native-touch":"keyboard"});
  }finally{await context.close();}
}

/** UX15-C3B-1: dynamic physical route window and projectile hits, isolated QA. */
async function runDynamicRouteQa(name,width,height,touch){
  const context=await browser.newContext({viewport:{width,height},
    isMobile:touch,hasTouch:touch,deviceScaleFactor:touch?2:1,
    reducedMotion:"no-preference",serviceWorkers:"block"});
  const page=await context.newPage();
  page.on("pageerror",e=>diagnostics.push(name+": "+String(e)));
  page.on("console",msg=>{if(msg.type()==="error")diagnostics.push(name+": "+msg.text());});
  try{
    await page.goto(url+"/?ux15-physical-qa=1&ux15-c3b=1",
      {waitUntil:"domcontentloaded",timeout:30000});
    const lab=page.getByTestId("ux15-physical-qa");
    await lab.waitFor({state:"visible",timeout:15000});
    check(await lab.getAttribute("data-qa-mode")==="PHYSICAL_ROUTE_C3B1_QA",
      name+": dynamic physical route flag failed");
    check(await page.locator(".orbi-game-root").count()===0,
      name+": legacy gameplay should not start in dynamic QA");
    // The mobile GLB compositor may reduce simulated-tick throughput.
    // Verify observable physical progress instead of demanding three spawn
    // cycles in an arbitrary short wall-clock interval on software GPU.
    const requiredSpawns=touch?1:3;
    await page.waitForFunction((required)=>Number(document.querySelector(
      '[data-testid="ux15-physical-qa"]')?.dataset.c3bSpawned)>=required,
      requiredSpawns,{timeout:touch?22000:10000});
    const spawnCount=Number(await lab.getAttribute("data-c3b-spawned"));
    check(spawnCount>=requiredSpawns,name+": no physical-camera-relative spawning");
    check(Number(await lab.getAttribute("data-physics-ticks"))>12,
      name+": spawn counter advanced without physical ticks");
    await page.waitForFunction(()=>Number(document.querySelector(
      '[data-testid="ux15-physical-qa"]')?.dataset.c3bHits)>=1,
      null,{timeout:touch?30000:14000});
    const hitCount=Number(await lab.getAttribute("data-c3b-hits"));
    check(hitCount>=1,name+": physical swept projectile collision not observed");
    check(Number(await lab.getAttribute("data-c3b-active-enemies"))<=12,
      name+": enemy cap exceeded");
    check(Number(await lab.getAttribute("data-c3b-active-shots"))<=24,
      name+": shot cap exceeded");
    const startY=Number(await lab.getAttribute("data-player-local-y"));
    if(touch){
      const bounds=await page.getByTestId("ux15-physical-canvas").boundingBox();
      check(Boolean(bounds),name+": missing touch canvas");
      const cdp=await context.newCDPSession(page);
      const x=bounds.x+bounds.width*.5,y=bounds.y+bounds.height*.6;
      await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x,y}]});
      await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:x+90,y:y-95}]});
      await page.waitForTimeout(550);
      await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});
      await cdp.detach();
    }else{
      await page.keyboard.down("w");
      await page.waitForTimeout(550);
      await page.keyboard.up("w");
    }
    await page.waitForFunction(y=>Number(document.querySelector(
      '[data-testid="ux15-physical-qa"]')?.dataset.playerLocalY)<y-15,
      startY,{timeout:4000});
    await shot(page,name+"-dynamic-route-encounter");
    await page.getByTestId("ux15-physical-pause").click();
    await page.waitForTimeout(450);
    const before={spawned:await lab.getAttribute("data-c3b-spawned"),
      hits:await lab.getAttribute("data-c3b-hits"),
      ticks:await lab.getAttribute("data-physics-ticks")};
    await page.waitForTimeout(550);
    check(before.spawned===await lab.getAttribute("data-c3b-spawned"),
      name+": spawns continued during pause");
    check(before.hits===await lab.getAttribute("data-c3b-hits"),
      name+": hits continued during pause");
    check(before.ticks===await lab.getAttribute("data-physics-ticks"),
      name+": simulation continued during pause");
    await page.getByTestId("ux15-physical-pause").click();
    await page.getByTestId("ux15-physical-reset").click();
    check(Number(await lab.getAttribute("data-c3b-spawned"))===0,
      name+": reset did not zero spawn count");
    check(Number(await lab.getAttribute("data-c3b-hits"))===0,
      name+": reset did not zero QA hits");
    evidence.cases.push({name,pass:true,ux15c3b1:true,
      physicalViewportSpawning:true,projectileHits:hitCount,
      spawns:spawnCount,input:touch?"native-touch":"keyboard"});
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
  await runRouteQa("ux15b-route-desktop-1440x900",1440,900,false);
  await runRouteQa("ux15b-route-mobile-844x390",844,390,true);
  await runAsteriaCombat("ux15c1-real-game-desktop-1440x900",1440,900,false);
  await runAsteriaCombat("ux15c1-real-game-mobile-844x390",844,390,true);
  await runPhysicalRouteQa("ux15c3a2-physical-desktop-1440x900",1440,900,false);
  await runPhysicalRouteQa("ux15c3a2-physical-mobile-844x390",844,390,true);
  await runDynamicRouteQa("ux15c3b1-dynamic-desktop-1440x900",1440,900,false);
  await runDynamicRouteQa("ux15c3b1-dynamic-mobile-844x390",844,390,true);
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
