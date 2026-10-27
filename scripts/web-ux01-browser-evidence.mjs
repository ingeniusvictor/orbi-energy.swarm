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
    check(await canvas.getAttribute("data-wbe01-railcutter-scope")==="WORLD_ROUTE_ONLY",
      name+": WBE-01A did not attach to authentic Mundo Nuevo engine");
    check(Number(await canvas.getAttribute("data-wbe01-railcutter-count"))===0,
      name+": RAILCUTTER improperly spawned during protected Wave 1");
    check(await canvas.getAttribute("data-wbe01-railcutter-phase")==="NONE",
      name+": live Railcutter activated before World Route Wave 2");
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

/** FERRUM-01: real second Mundo Nuevo selection, no lab or mock enemies. */
async function runFerrumLiveCombat(name,width,height,touch){
  const context=await browser.newContext({viewport:{width,height},
    isMobile:touch,hasTouch:touch,deviceScaleFactor:touch?2:1,
    reducedMotion:"reduce",serviceWorkers:"block"});
  const page=await context.newPage();
  page.on("pageerror",e=>diagnostics.push(name+": "+String(e)));
  page.on("console",msg=>{if(msg.type()==="error")diagnostics.push(name+": "+msg.text());});
  try{
    await page.clock.install({time:new Date("2026-10-26T10:00:00Z")});
    await page.goto(url+"/",{waitUntil:"domcontentloaded",timeout:30000});
    const mobileEnter=page.getByTestId("orbi-mobile-enter");
    if(await mobileEnter.isVisible()){
      await mobileEnter.click();
      await page.getByTestId("orbi-mobile-menu-main-play").click();
      await page.getByTestId("orbi-mobile-ferrum-world").click();
    }else{
      await page.locator('[data-ferrum-world-start-cta="true"]').click();
    }
    const canvas=page.locator("#game-canvas");
    await canvas.waitFor({state:"visible",timeout:15000});
    check(await page.locator('[data-selected-game-mode="WORLD_ROUTE"]').count()===1,
      name+": FERRUM did not open the actual Mundo Nuevo run");
    check(await page.getByTestId("ux15-route-qa").count()===0,
      name+": FERRUM launched the lab instead of production combat");
    await page.clock.runFor(6800);
    await page.waitForFunction(()=>document.querySelector("#game-canvas")
      ?.dataset.ux15World==="FERRUM_MECHANICA",null,{timeout:12000});
    const world=await canvas.getAttribute("data-ux15-world");
    const scene=await canvas.getAttribute("data-ux15-scene");
    const visual=await canvas.getAttribute("data-ux15-visual");
    const distance=Number(await canvas.getAttribute("data-ux15-route-distance"));
    check(world==="FERRUM_MECHANICA",name+": wrong real world selected");
    check(visual==="ferrum-industrial-canvas",name+": ASTERIA art leaked into FERRUM");
    check(scene==="GEAR_GATE",name+": FERRUM first industrial segment missing");
    check(Number.isFinite(distance)&&distance>10,
      name+": the original simulated route clock failed in FERRUM");
    check(await canvas.getAttribute("data-ux15-live-combat")==="true",
      name+": false decorative-only FERRUM mode");
    check((await canvas.getAttribute("data-ferrum-shade-gear-count"))!==null,
      name+": Shade Gear not registered with real enemy director");
    check((await canvas.getAttribute("data-ferrum-welder-count"))!==null,
      name+": M-9 Welder not registered with real enemy director");
    check(Number(await canvas.getAttribute("data-wbe01-railcutter-count"))===0,
      name+": ASTERIA Railcutter escaped into FERRUM");
    check(Number(await canvas.getAttribute("data-wbe01-span-warden-count"))===0,
      name+": ASTERIA elite escaped into FERRUM");
    await shot(page,name+"-ferrum-world-live");
    evidence.cases.push({name,pass:true,world,scene,visual,distance,
      liveCombat:true,ferrumExclusive:true});
  }finally{await context.close();}
}


/** PYRA-03: third genuine Mundo Nuevo route; two exclusive enemies plus
 * Lava Dredger must only be visible through the actual Campaign canvas.
 */
async function runPyraLiveCombat(name,width,height,touch){
  const context=await browser.newContext({viewport:{width,height},
    isMobile:touch,hasTouch:touch,deviceScaleFactor:touch?2:1,
    reducedMotion:"reduce",serviceWorkers:"block"});
  const page=await context.newPage();
  page.on("pageerror",e=>diagnostics.push(name+": "+String(e)));
  page.on("console",msg=>{if(msg.type()==="error")diagnostics.push(name+": "+msg.text());});
  try{
    await page.clock.install({time:new Date("2026-10-27T10:00:00Z")});
    await page.goto(url+"/",{waitUntil:"domcontentloaded",timeout:30000});
    const enter=page.getByTestId("orbi-mobile-enter");
    if(await enter.isVisible()){
      await enter.click();
      await page.getByTestId("orbi-mobile-menu-main-play").click();
      await page.getByTestId("orbi-mobile-pyra-world").click();
    }else{
      await page.locator('[data-pyra-world-start-cta="true"]').click();
    }
    const canvas=page.locator("#game-canvas");
    await canvas.waitFor({state:"visible",timeout:15000});
    check(await page.locator('[data-selected-game-mode="WORLD_ROUTE"]').count()===1,
      name+": PYRA did not start the genuine Campaign world route");
    check(await page.getByTestId("ux15-route-qa").count()===0,
      name+": PYRA incorrectly opened the sandbox LAB");
    await page.clock.runFor(6800);
    await page.waitForFunction(()=>document.querySelector("#game-canvas")
      ?.dataset.ux15World==="PYRA_MAGMA_CORE",null,{timeout:12000});
    const world=await canvas.getAttribute("data-ux15-world");
    const scene=await canvas.getAttribute("data-ux15-scene");
    const visual=await canvas.getAttribute("data-ux15-visual");
    const distance=Number(await canvas.getAttribute("data-ux15-route-distance"));
    check(world==="PYRA_MAGMA_CORE",name+": selected world was not PYRA");
    check(scene==="OBSIDIAN_GATE",name+": first volcanic sector missing");
    check(visual==="pyra-magma-canvas",name+": volcanic panorama not drawn");
    check(Number.isFinite(distance)&&distance>10,
      name+": genuine Campaign route progression not advancing");
    check(await canvas.getAttribute("data-ux15-live-combat")==="true",
      name+": cosmetic PYRA screen, not native combat");
    for(const key of ["data-pyra-ember-skater-count",
      "data-pyra-slag-spear-count","data-pyra-lava-dredger-count"]){
      check(await canvas.getAttribute(key)!==null,
        name+": PYRA live enemy director readout missing "+key);
    }
    check(Number(await canvas.getAttribute("data-wbe01-railcutter-count"))===0,
      name+": ASTERIA Railcutter leaked into PYRA");
    check(await canvas.getAttribute("data-ferrum-shade-gear-count")===null,
      name+": FERRUM-only actor telemetry leaked into PYRA");
    await shot(page,name+"-pyra-real-campaign");
    evidence.cases.push({name,pass:true,world,scene,visual,distance,
      liveCombat:true,pyraExclusive:true});
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
      await page.waitForTimeout(140);
      await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",
        touchPoints:[{x:startX+45,y:touchY-35}]});
      await page.waitForTimeout(130);
      await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",
        touchPoints:[{x:startX+90,y:touchY-80}]});
      await page.waitForTimeout(650);
      await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});
      if(Number(await lab.getAttribute("data-player-local-y"))>=startY-15){
        const altX=bounds.x+bounds.width*.4,altY=bounds.y+bounds.height*.8;
        await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",
          touchPoints:[{x:altX,y:altY}]});
        await page.waitForTimeout(150);
        await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",
          touchPoints:[{x:altX+55,y:altY-65}]});
        await page.waitForTimeout(730);
        await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});
      }
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

/** C3B2 physical Dash and shared live spatial-index QA, with native mobile touch. */
async function runRouteCombatBridgeQa(name,width,height,touch){
  const context=await browser.newContext({viewport:{width,height},
    isMobile:touch,hasTouch:touch,deviceScaleFactor:touch?2:1,
    reducedMotion:"no-preference",serviceWorkers:"block"});
  const page=await context.newPage();
  page.on("pageerror",e=>diagnostics.push(name+": "+String(e)));
  page.on("console",msg=>{if(msg.type()==="error")diagnostics.push(name+": "+msg.text());});
  try{
    await page.goto(url+"/?ux15-physical-qa=1&ux15-c3b=1&ux15-c3b2=1",
      {waitUntil:"domcontentloaded",timeout:30000});
    const lab=page.getByTestId("ux15-physical-qa");
    await lab.waitFor({state:"visible",timeout:15000});
    check(await lab.getAttribute("data-qa-mode")==="PHYSICAL_ROUTE_C3B2_QA",
      name+": C3B2 must activate only with both QA flags");
    check(Number(await lab.getAttribute("data-c3b2-shield"))===100,
      name+": QA shield initial state incorrect");
    check(Number(await lab.getAttribute("data-c3b2-dash-activated-at"))===-1,
      name+": Dash should not activate automatically");
    check(await page.locator(".orbi-game-root").count()===0,
      name+": public gameplay engine leaked into bridge QA");
    await page.waitForFunction(()=>Number(document.querySelector(
      '[data-testid="ux15-physical-qa"]')?.dataset.c3b2SpatialEnemies)>=1,
      null,{timeout:touch?22000:12000});
    const startedAt=Number(await lab.getAttribute("data-c3b2-dash-activated-at"));
    check(startedAt===-1,name+": Dash activated before explicit input");
    if(touch){
      await page.getByTestId("ux15-c3b2-dash").click();
    }else{
      await page.keyboard.press("Space");
    }
    await page.waitForFunction(()=>Number(document.querySelector(
      '[data-testid="ux15-physical-qa"]')?.dataset.c3b2DashActivatedAt)>=0,
      null,{timeout:touch?9000:5000});
    check(Number(await lab.getAttribute("data-c3b2-dash-cooldown-ms"))>1000,
      name+": canonical Dash cooldown missing");
    check(Number(await lab.getAttribute("data-c3b2-spatial-enemies"))<=12,
      name+": spatial-index enemy cap bypassed");
    // Real input motion after Dash still reaches ENERGY in physical coordinates.
    const initialY=Number(await lab.getAttribute("data-player-local-y"));
    if(touch){
      // The Dash button sits below the stage on short mobile screens.
      // Bring the canvas back into view before issuing native CDP touch.
      await page.getByTestId("ux15-physical-canvas").scrollIntoViewIfNeeded();
      const bounds=await page.getByTestId("ux15-physical-canvas").boundingBox();
      check(Boolean(bounds),name+": missing touch canvas");
      const cdp=await context.newCDPSession(page);
      const x=bounds.x+bounds.width*.5,y=bounds.y+bounds.height*.7;
      await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x,y}]});
      // Allow the actual touch pointer to become captured before dragging.
      await page.waitForTimeout(160);
      await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:x+40,y:y-55}]});
      await page.waitForTimeout(160);
      await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:x+90,y:y-120}]});
      await page.waitForTimeout(650);
      await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});
      // If the first native gesture was lost under concurrent Chromium GLB
      // rendering, repeat a second REAL touch movement; do not fake telemetry
      // or weaken the exact >12-unit physical displacement assertion below.
      if(Number(await lab.getAttribute("data-player-local-y"))>=initialY-12){
        const ax=bounds.x+bounds.width*.45,ay=bounds.y+bounds.height*.75;
        await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x:ax,y:ay}]});
        await page.waitForTimeout(160);
        await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:ax+45,y:ay-75}]});
        await page.waitForTimeout(750);
        await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});
      }
      await cdp.detach();
    }else{
      await page.keyboard.down("w");
      await page.waitForTimeout(650);
      await page.keyboard.up("w");
    }
    await page.waitForFunction(y=>Number(document.querySelector(
      '[data-testid="ux15-physical-qa"]')?.dataset.playerLocalY)<y-12,
      initialY,{timeout:6000});
    await shot(page,name+"-dash-spatial-qa");
    await page.getByTestId("ux15-physical-pause").click();
    await page.waitForTimeout(450);
    const paused={
      ticks:await lab.getAttribute("data-physics-ticks"),
      dash:await lab.getAttribute("data-c3b2-dash-cooldown-ms"),
      shield:await lab.getAttribute("data-c3b2-shield"),
    };
    await page.waitForTimeout(650);
    check(paused.ticks===await lab.getAttribute("data-physics-ticks"),
      name+": physical ticks advanced during pause");
    check(paused.dash===await lab.getAttribute("data-c3b2-dash-cooldown-ms"),
      name+": Dash cooldown advanced during pause");
    check(paused.shield===await lab.getAttribute("data-c3b2-shield"),
      name+": QA shield changed during pause");
    await page.getByTestId("ux15-physical-reset").click();
    check(Number(await lab.getAttribute("data-c3b2-dash-activated-at"))===-1,
      name+": reset failed to clear Dash state");
    check(Number(await lab.getAttribute("data-c3b2-shield"))===100,
      name+": reset failed to clear QA shield");
    evidence.cases.push({
      name,pass:true,ux15c3b2:true,realDashCore:true,
      spatialIndex:true,input:touch?"native-touch":"keyboard",
    });
  }finally{await context.close();}
}

/** C3B3: canonical ORBI energy profiles in real Chromium, never main gameplay. */
async function runCanonicalOrbiRouteQa(name,width,height,touch){
  const context=await browser.newContext({viewport:{width,height},
    isMobile:touch,hasTouch:touch,deviceScaleFactor:touch?2:1,
    reducedMotion:"no-preference",serviceWorkers:"block"});
  const page=await context.newPage();
  page.on("pageerror",error=>diagnostics.push(name+": "+String(error)));
  page.on("console",msg=>{if(msg.type()==="error")diagnostics.push(name+": "+msg.text());});
  try{
    await page.goto(url+"/?ux15-physical-qa=1&ux15-c3b=1&ux15-c3b2=1&ux15-c3b3=1",
      {waitUntil:"domcontentloaded",timeout:30000});
    const lab=page.getByTestId("ux15-physical-qa");
    await lab.waitFor({state:"visible",timeout:15000});
    check(await lab.getAttribute("data-qa-mode")==="PHYSICAL_ROUTE_C3B3_QA",
      name+": wrong canonical ORBI QA flag");
    check(await page.locator(".orbi-game-root").count()===0,
      name+": normal game engine leaked into isolated ORBI QA");
    check(Number(await lab.getAttribute("data-c3b3-orbi-shots"))===0,
      name+": ORBI weapons must start without fired shots");
    await page.waitForFunction(()=>Number(document.querySelector(
      '[data-testid="ux15-physical-qa"]')?.dataset.c3b3OrbiShots)>=1,
      null,{timeout:touch?35000:22000});
    const shots=Number(await lab.getAttribute("data-c3b3-orbi-shots"));
    const targets=Number(await lab.getAttribute("data-c3b3-orbi-targets"));
    check(shots>=1&&targets>=1,name+": canonical targeting and shot not observed");
    check(Number(await lab.getAttribute("data-c3b3-orbi-echoes"))<=shots,
      name+": invalid QUANTUM echo accounting");
    check(Number(await lab.getAttribute("data-c3b-active-shots"))<=24,
      name+": ORBI projectile capacity exceeded");
    const startY=Number(await lab.getAttribute("data-player-local-y"));
    if(touch){
      await page.getByTestId("ux15-physical-canvas").scrollIntoViewIfNeeded();
      const bounds=await page.getByTestId("ux15-physical-canvas").boundingBox();
      check(Boolean(bounds),name+": no mobile canvas");
      const cdp=await context.newCDPSession(page);
      const x=bounds.x+bounds.width*.5,y=bounds.y+bounds.height*.62;
      await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x,y}]});
      await page.waitForTimeout(160);
      await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:x+40,y:y-45}]});
      await page.waitForTimeout(150);
      await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:x+95,y:y-100}]});
      await page.waitForTimeout(650);
      await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});
      // A physical movement is still compulsory: retry the actual native
      // gesture when browser GLB compositing missed the initial touch-start.
      if(Number(await lab.getAttribute("data-player-local-y"))>=startY-12){
        const ax=bounds.x+bounds.width*.45,ay=bounds.y+bounds.height*.75;
        await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x:ax,y:ay}]});
        await page.waitForTimeout(180);
        await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:ax+45,y:ay-75}]});
        await page.waitForTimeout(750);
        await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});
      }
      await cdp.detach();
    }else{
      await page.keyboard.down("w");
      await page.waitForTimeout(650);
      await page.keyboard.up("w");
    }
    await page.waitForFunction(start=>Number(document.querySelector(
      '[data-testid="ux15-physical-qa"]')?.dataset.playerLocalY)<start-12,
      startY,{timeout:8000});
    await shot(page,name+"-canonical-orbi");
    await page.getByTestId("ux15-physical-pause").click();
    await page.waitForTimeout(450);
    const paused={
      ticks:await lab.getAttribute("data-physics-ticks"),
      shots:await lab.getAttribute("data-c3b3-orbi-shots"),
      targets:await lab.getAttribute("data-c3b3-orbi-targets"),
    };
    await page.waitForTimeout(650);
    check(await lab.getAttribute("data-physics-ticks")===paused.ticks,
      name+": paused physical simulation advanced");
    check(await lab.getAttribute("data-c3b3-orbi-shots")===paused.shots,
      name+": paused ORBI fired");
    check(await lab.getAttribute("data-c3b3-orbi-targets")===paused.targets,
      name+": paused ORBI target counter advanced");
    await page.getByTestId("ux15-physical-reset").click();
    check(Number(await lab.getAttribute("data-c3b3-orbi-shots"))===0,
      name+": reset failed to clear ORBI volley count");
    check(Number(await lab.getAttribute("data-c3b3-orbi-targets"))===0,
      name+": reset failed to clear spatial target counter");
    evidence.cases.push({name,pass:true,ux15c3b3:true,
      canonicalProfiles:10,shots,targets,input:touch?"native-touch":"keyboard"});
  }finally{await context.close();}
}

/** C3B4: actual canonical impact resolution at physical game coordinates. */
async function runRouteOrbiImpactQa(name,width,height,touch){
  const context=await browser.newContext({viewport:{width,height},
    isMobile:touch,hasTouch:touch,deviceScaleFactor:touch?2:1,
    reducedMotion:"no-preference",serviceWorkers:"block"});
  const page=await context.newPage();
  page.on("pageerror",e=>diagnostics.push(name+": "+String(e)));
  page.on("console",msg=>{if(msg.type()==="error")diagnostics.push(name+": "+msg.text());});
  try{
    await page.goto(url+"/?ux15-physical-qa=1&ux15-c3b=1&ux15-c3b2=1&ux15-c3b3=1&ux15-c3b4=1",
      {waitUntil:"domcontentloaded",timeout:30000});
    const lab=page.getByTestId("ux15-physical-qa");
    await lab.waitFor({state:"visible",timeout:15000});
    check(await lab.getAttribute("data-qa-mode")==="PHYSICAL_ROUTE_C3B4_QA",
      name+": new impact QA flag not activated");
    check(await page.locator(".orbi-game-root").count()===0,
      name+": ordinary battle engine must not run in impact QA");
    check(Number(await lab.getAttribute("data-c3b4-splash-hits"))===0,
      name+": nonzero splash counter before start");
    await page.waitForFunction(()=>Number(document.querySelector(
      '[data-testid="ux15-physical-qa"]')?.dataset.c3b4Pushes)>=1,
      null,{timeout:touch?40000:30000});
    const impacts=Number(await lab.getAttribute("data-c3b-hits"));
    const pushes=Number(await lab.getAttribute("data-c3b4-pushes"));
    const splashes=Number(await lab.getAttribute("data-c3b4-splash-hits"));
    const slows=Number(await lab.getAttribute("data-c3b4-slows"));
    const pulls=Number(await lab.getAttribute("data-c3b4-magnetic-pulls"));
    check(impacts>=1&&pushes>=1,name+": canonical projectile push absent");
    check([splashes,slows,pulls].every(v=>Number.isInteger(v)&&v>=0),
      name+": invalid effects telemetry");
    check(Number(await lab.getAttribute("data-c3b-active-shots"))<=24,
      name+": canonical impact exceeded projectile cap");
    const beforeY=Number(await lab.getAttribute("data-player-local-y"));
    if(touch){
      await page.getByTestId("ux15-physical-canvas").scrollIntoViewIfNeeded();
      const bounds=await page.getByTestId("ux15-physical-canvas").boundingBox();
      check(Boolean(bounds),name+": missing touch canvas");
      const cdp=await context.newCDPSession(page);
      const x=bounds.x+bounds.width*.5,y=bounds.y+bounds.height*.63;
      await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x,y}]});
      await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:x+85,y:y-105}]});
      await page.waitForTimeout(650);
      await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});
      await cdp.detach();
    }else{
      await page.keyboard.down("w");
      await page.waitForTimeout(650);
      await page.keyboard.up("w");
    }
    await page.waitForFunction(y=>Number(document.querySelector(
      '[data-testid="ux15-physical-qa"]')?.dataset.playerLocalY)<y-12,
      beforeY,{timeout:8000});
    await shot(page,name+"-canonical-impacts");
    await page.getByTestId("ux15-physical-pause").click();
    await page.waitForTimeout(450);
    const paused={
      ticks:await lab.getAttribute("data-physics-ticks"),
      pushes:await lab.getAttribute("data-c3b4-pushes"),
      splash:await lab.getAttribute("data-c3b4-splash-hits"),
    };
    await page.waitForTimeout(650);
    check(paused.ticks===await lab.getAttribute("data-physics-ticks"),
      name+": ticks advanced while paused");
    check(paused.pushes===await lab.getAttribute("data-c3b4-pushes"),
      name+": knockback continued during pause");
    check(paused.splash===await lab.getAttribute("data-c3b4-splash-hits"),
      name+": splash hits advanced while paused");
    await page.getByTestId("ux15-physical-reset").click();
    check(Number(await lab.getAttribute("data-c3b4-pushes"))===0,
      name+": reset failed to clear push counter");
    check(Number(await lab.getAttribute("data-c3b4-magnetic-pulls"))===0,
      name+": reset failed to clear magnet counter");
    evidence.cases.push({name,pass:true,ux15c3b4:true,
      impacts,pushes,splashes,slows,pulls,
      input:touch?"native-touch":"keyboard"});
  }finally{await context.close();}
}

/** C3B5: native Overdrive timing and explicit, isolated QA charge on real Chromium. */
async function runRouteOverdriveQa(name,width,height,touch){
  const context=await browser.newContext({viewport:{width,height},
    isMobile:touch,hasTouch:touch,deviceScaleFactor:touch?2:1,
    reducedMotion:"no-preference",serviceWorkers:"block"});
  const page=await context.newPage();
  page.on("pageerror",e=>diagnostics.push(name+": "+String(e)));
  page.on("console",msg=>{if(msg.type()==="error")diagnostics.push(name+": "+msg.text());});
  try{
    await page.goto(url+"/?ux15-physical-qa=1&ux15-c3b=1&ux15-c3b2=1&ux15-c3b3=1&ux15-c3b4=1&ux15-c3b5=1",
      {waitUntil:"domcontentloaded",timeout:30000});
    const lab=page.getByTestId("ux15-physical-qa");
    await lab.waitFor({state:"visible",timeout:15000});
    check(await lab.getAttribute("data-qa-mode")==="PHYSICAL_ROUTE_C3B5_QA",
      name+": C3B5 explicit gate absent");
    check(await page.locator(".orbi-game-root").count()===0,
      name+": public gameplay engine loaded in QA");
    check(await lab.getAttribute("data-c3b5-overdrive-active")==="false",
      name+": Overdrive must begin inactive");
    check(Number(await lab.getAttribute("data-c3b5-damage-multiplier"))===1,
      name+": damage should be unbuffed initially");
    await page.getByTestId("ux15-c3b5-charge").click();
    await page.waitForFunction(()=>Number(document.querySelector(
      '[data-testid="ux15-physical-qa"]')?.dataset.c3b5DebugCharges)>=1,
      null,{timeout:touch?14000:7000});
    check(Number(await lab.getAttribute("data-c3b5-resonance"))===100,
      name+": explicit QA charge did not fill resonance to 100");
    // Click control on touchscreen, press canonical O keyboard on desktop.
    if(touch)await page.getByTestId("ux15-c3b5-overdrive").click();
    else await page.keyboard.press("o");
    await page.waitForFunction(()=>document.querySelector(
      '[data-testid="ux15-physical-qa"]')?.dataset.c3b5OverdriveActive==="true",
      null,{timeout:touch?14000:7000});
    check(Number(await lab.getAttribute("data-c3b5-activations"))===1,
      name+": activation not counted");
    check(Number(await lab.getAttribute("data-c3b5-resonance"))<100,
      name+": Overdrive did not consume readiness");
    check(Number(await lab.getAttribute("data-c3b5-damage-multiplier"))===1.2,
      name+": official 1.2 damage multiplier not applied");
    await shot(page,name+"-resonance-overdrive");
    // Make sure the visual QA supports actual movement after scrolling to
    // the mobile HUD controls, not only button activation.
    const initialY=Number(await lab.getAttribute("data-player-local-y"));
    if(touch){
      await page.getByTestId("ux15-physical-canvas").scrollIntoViewIfNeeded();
      const bounds=await page.getByTestId("ux15-physical-canvas").boundingBox();
      check(Boolean(bounds),name+": missing touch stage");
      const cdp=await context.newCDPSession(page);
      const x=bounds.x+bounds.width*.5,y=bounds.y+bounds.height*.64;
      await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x,y}]});
      // Headless Chromium can coalesce adjacent CDP start/move packets.
      // Span three render frames so React receives the initial pointer
      // capture and real native motion before the pointer is released.
      await page.waitForTimeout(110);
      await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:x+45,y:y-40}]});
      await page.waitForTimeout(120);
      await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:x+90,y:y-100}]});
      await page.waitForTimeout(650);
      await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});
      // A real native second attempt is preferable to falsely accepting a
      // zero-displacement mobile gesture if a render frame was dropped.
      if(Number(await lab.getAttribute("data-player-local-y"))>=initialY-12){
        const altX=bounds.x+bounds.width*.35,altY=bounds.y+bounds.height*.8;
        await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x:altX,y:altY}]});
        await page.waitForTimeout(160);
        await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:altX+20,y:altY-35}]});
        await page.waitForTimeout(140);
        await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:altX+45,y:altY-75}]});
        await page.waitForTimeout(750);
        await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});
      }
      await cdp.detach();
    }else{
      await page.keyboard.down("w");
      await page.waitForTimeout(550);
      await page.keyboard.up("w");
    }
    await page.waitForFunction(y=>Number(document.querySelector(
      '[data-testid="ux15-physical-qa"]')?.dataset.playerLocalY)<y-12,
      initialY,{timeout:9000});
    await page.getByTestId("ux15-physical-pause").click();
    await page.waitForTimeout(450);
    const frozen={
      ticks:await lab.getAttribute("data-physics-ticks"),
      remaining:await lab.getAttribute("data-c3b5-overdrive-remaining-ms"),
      activations:await lab.getAttribute("data-c3b5-activations"),
    };
    await page.waitForTimeout(650);
    check(frozen.ticks===await lab.getAttribute("data-physics-ticks"),
      name+": physics continued after pause");
    check(frozen.remaining===await lab.getAttribute("data-c3b5-overdrive-remaining-ms"),
      name+": Overdrive simulation timer continued while paused");
    check(frozen.activations===await lab.getAttribute("data-c3b5-activations"),
      name+": activation changed while paused");
    await page.getByTestId("ux15-physical-reset").click();
    check(Number(await lab.getAttribute("data-c3b5-debug-charges"))===0,
      name+": debug charge survived reset");
    check(Number(await lab.getAttribute("data-c3b5-activations"))===0,
      name+": Overdrive survived reset");
    check(await lab.getAttribute("data-c3b5-overdrive-active")==="false",
      name+": Overdrive remained active after reset");
    evidence.cases.push({name,pass:true,ux15c3b5:true,
      canonicalResonance:true,damageMultiplier:1.2,
      input:touch?"native-touch":"keyboard"});
  }finally{await context.close();}
}

/** C3B6 canonical finite-ray Convergence in Chromium desktop/native touch. */
async function runRouteConvergenceQa(name,width,height,touch){
  const context=await browser.newContext({viewport:{width,height},
    isMobile:touch,hasTouch:touch,deviceScaleFactor:touch?2:1,
    reducedMotion:"no-preference",serviceWorkers:"block"});
  const page=await context.newPage();
  page.on("pageerror",e=>diagnostics.push(name+": "+String(e)));
  page.on("console",msg=>{if(msg.type()==="error")diagnostics.push(name+": "+msg.text());});
  try{
    await page.goto(url+"/?ux15-physical-qa=1&ux15-c3b=1&ux15-c3b2=1&ux15-c3b3=1&ux15-c3b4=1&ux15-c3b5=1&ux15-c3b6=1",
      {waitUntil:"domcontentloaded",timeout:30000});
    const lab=page.getByTestId("ux15-physical-qa");
    await lab.waitFor({state:"visible",timeout:15000});
    check(await lab.getAttribute("data-qa-mode")==="PHYSICAL_ROUTE_C3B6_QA",
      name+": Convergence feature-gate absent");
    check(await page.locator(".orbi-game-root").count()===0,
      name+": public game leaked into isolated Convergence");
    check(Number(await lab.getAttribute("data-c3b6-activations"))===0,
      name+": Convergence activated without gesture");
    await page.getByTestId("ux15-c3b5-charge").click();
    await page.waitForFunction(()=>document.querySelector(
      '[data-testid="ux15-physical-qa"]')?.dataset.c3b6Ready==="true",
      null,{timeout:touch?15000:10000});
    if(touch)await page.getByTestId("ux15-c3b6-convergence").click();
    else await page.keyboard.press("c");
    await page.waitForFunction(()=>Number(document.querySelector(
      '[data-testid="ux15-physical-qa"]')?.dataset.c3b6Activations)===1,
      null,{timeout:touch?12000:8000});
    check(Number(await lab.getAttribute("data-c3b5-resonance"))<100,
      name+": Convergence did not consume 100 readiness");
    check(Number(await lab.getAttribute("data-c3b5-overdrive-activations"))===0,
      name+": illegal Overdrive stacking");
    await page.waitForFunction(()=>Number(document.querySelector(
      '[data-testid="ux15-physical-qa"]')?.dataset.c3b6Beams)>=1,
      null,{timeout:touch?18000:12000});
    const beams=Number(await lab.getAttribute("data-c3b6-beams"));
    const hits=Number(await lab.getAttribute("data-c3b6-hits"));
    check(beams===1,name+": expected exactly one beam");
    check(hits>=1&&hits<=6,name+": hit count outside 1-6");
    check(await lab.getAttribute("data-c3b6-used-wave")==="true",
      name+": once-per-segment not consumed");
    await shot(page,name+"-canonical-convergence");
    const initialY=Number(await lab.getAttribute("data-player-local-y"));
    if(touch){
      await page.getByTestId("ux15-physical-canvas").scrollIntoViewIfNeeded();
      const bounds=await page.getByTestId("ux15-physical-canvas").boundingBox();
      check(Boolean(bounds),name+": missing canvas");
      const cdp=await context.newCDPSession(page);
      const x=bounds.x+bounds.width*.5,y=bounds.y+bounds.height*.62;
      await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x,y}]});
      await page.waitForTimeout(110);
      await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:x+45,y:y-40}]});
      await page.waitForTimeout(120);
      await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:x+95,y:y-105}]});
      await page.waitForTimeout(650);
      await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});
      if(Number(await lab.getAttribute("data-player-local-y"))>=initialY-12){
        const altX=bounds.x+bounds.width*.35,altY=bounds.y+bounds.height*.8;
        await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x:altX,y:altY}]});
        await page.waitForTimeout(160);
        await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:altX+20,y:altY-35}]});
        await page.waitForTimeout(140);
        await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:altX+45,y:altY-75}]});
        await page.waitForTimeout(750);
        await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});
      }
      await cdp.detach();
    }else{
      await page.keyboard.down("w");
      await page.waitForTimeout(550);
      await page.keyboard.up("w");
    }
    await page.waitForFunction(y=>Number(document.querySelector(
      '[data-testid="ux15-physical-qa"]')?.dataset.playerLocalY)<y-12,
      initialY,{timeout:8000});
    await page.getByTestId("ux15-physical-pause").click();
    await page.waitForTimeout(450);
    const frozen={
      ticks:await lab.getAttribute("data-physics-ticks"),
      beams:await lab.getAttribute("data-c3b6-beams"),
      cooldown:await lab.getAttribute("data-c3b6-cooldown-ms"),
    };
    await page.waitForTimeout(650);
    check(frozen.ticks===await lab.getAttribute("data-physics-ticks"),
      name+": physics continued during pause");
    check(frozen.beams===await lab.getAttribute("data-c3b6-beams"),
      name+": beam fired during pause");
    check(frozen.cooldown===await lab.getAttribute("data-c3b6-cooldown-ms"),
      name+": Convergence clock continued during pause");
    await page.getByTestId("ux15-physical-reset").click();
    check(Number(await lab.getAttribute("data-c3b6-activations"))===0,
      name+": reset did not clear Convergence");
    check(Number(await lab.getAttribute("data-c3b6-beams"))===0,
      name+": reset did not clear beams");
    check(await lab.getAttribute("data-c3b6-channeling")==="false",
      name+": reset left channel active");
    evidence.cases.push({name,pass:true,ux15c3b6:true,beams,hits,
      input:touch?"native-touch":"keyboard"});
  }finally{await context.close();}
}

/** C3B7: genuine campaign Scout Signal descriptor and bounded physical spawns. */
async function runRouteCampaignWave1Qa(name,width,height,touch){
  const context=await browser.newContext({viewport:{width,height},
    isMobile:touch,hasTouch:touch,deviceScaleFactor:touch?2:1,
    reducedMotion:"no-preference",serviceWorkers:"block"});
  const page=await context.newPage();
  page.on("pageerror",e=>diagnostics.push(name+": "+String(e)));
  page.on("console",msg=>{if(msg.type()==="error")diagnostics.push(name+": "+msg.text());});
  try{
    await page.goto(url+"/?ux15-physical-qa=1&ux15-c3b=1&ux15-c3b2=1&ux15-c3b3=1&ux15-c3b4=1&ux15-c3b5=1&ux15-c3b6=1&ux15-c3b7=1",
      {waitUntil:"domcontentloaded",timeout:30000});
    const lab=page.getByTestId("ux15-physical-qa");
    await lab.waitFor({state:"visible",timeout:15000});
    check(await lab.getAttribute("data-qa-mode")==="PHYSICAL_ROUTE_C3B7_QA",
      name+": physical wave1 gate did not activate");
    check(await page.locator(".orbi-game-root").count()===0,
      name+": legacy real game leaked into wave1 QA");
    check(await lab.getAttribute("data-c3b7-wave-name")==="Scout Signal",
      name+": not using real wave descriptor");
    check(Number(await lab.getAttribute("data-c3b7-wave-budget"))===12,
      name+": official 12-enemy budget missing");
    check(Number(await lab.getAttribute("data-c3b7-wave-concurrent-cap"))===8,
      name+": official 8-concurrent cap missing");
    await page.waitForFunction(()=>Number(document.querySelector(
      '[data-testid="ux15-physical-qa"]')?.dataset.c3b7WaveSpawned)>=2,
      // Keep the exact >=2 real-actor requirement. Mobile Chromium with
      // SwiftShader/GLB can need more wall time under shared CI load even
      // though the simulation remains deterministic and unchanged.
      null,{timeout:touch?30000:18000});
    const spawned=Number(await lab.getAttribute("data-c3b7-wave-spawned"));
    check(spawned>=2&&spawned<=12,name+": wave1 count invalid");
    check(Number(await lab.getAttribute("data-c3b7-wave-active"))<=8,
      name+": concurrent cap violated");
    check(Number(await lab.getAttribute("data-c3b-spawned"))===0,
      name+": generic 700ms fake spawner still enabled");
    check(Number(await lab.getAttribute("data-c3b7-wave-remaining-ms"))>0,
      name+": unexpected wave1 timebox completion");
    const startY=Number(await lab.getAttribute("data-player-local-y"));
    if(touch){
      await page.getByTestId("ux15-physical-canvas").scrollIntoViewIfNeeded();
      const bounds=await page.getByTestId("ux15-physical-canvas").boundingBox();
      check(Boolean(bounds),name+": missing touch canvas");
      const cdp=await context.newCDPSession(page);
      const x=bounds.x+bounds.width*.35,y=bounds.y+bounds.height*.8;
      await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x,y}]});
      await page.waitForTimeout(160);
      await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:x+25,y:y-40}]});
      await page.waitForTimeout(140);
      await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:x+55,y:y-95}]});
      await page.waitForTimeout(700);
      await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});
      if(Number(await lab.getAttribute("data-player-local-y"))>=startY-12){
        const ax=bounds.x+bounds.width*.45,ay=bounds.y+bounds.height*.75;
        await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x:ax,y:ay}]});
        await page.waitForTimeout(160);
        await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:ax+45,y:ay-75}]});
        await page.waitForTimeout(750);
        await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});
      }
      await cdp.detach();
    }else{
      await page.keyboard.down("w");
      await page.waitForTimeout(650);
      await page.keyboard.up("w");
    }
    await page.waitForFunction(y=>Number(document.querySelector(
      '[data-testid="ux15-physical-qa"]')?.dataset.playerLocalY)<y-12,
      startY,{timeout:9000});
    await shot(page,name+"-physical-wave1");
    await page.getByTestId("ux15-physical-pause").click();
    await page.waitForTimeout(450);
    const frozen={
      ticks:await lab.getAttribute("data-physics-ticks"),
      spawned:await lab.getAttribute("data-c3b7-wave-spawned"),
      remaining:await lab.getAttribute("data-c3b7-wave-remaining-ms"),
    };
    await page.waitForTimeout(700);
    check(frozen.ticks===await lab.getAttribute("data-physics-ticks"),
      name+": wave1 physics advanced during pause");
    check(frozen.spawned===await lab.getAttribute("data-c3b7-wave-spawned"),
      name+": wave1 spawn continued during pause");
    check(frozen.remaining===await lab.getAttribute("data-c3b7-wave-remaining-ms"),
      name+": wave1 timebox advanced during pause");
    await page.getByTestId("ux15-physical-reset").click();
    check(Number(await lab.getAttribute("data-c3b7-wave-spawned"))===0,
      name+": wave1 budget did not reset");
    check(await lab.getAttribute("data-c3b7-wave-status")==="ACTIVE",
      name+": reset did not rearm wave1 QA");
    evidence.cases.push({name,pass:true,ux15c3b7:true,
      officialWave:"scout_signal",budget:12,concurrentCap:8,spawned,
      input:touch?"native-touch":"keyboard"});
  }finally{await context.close();}
}

/** C3B8: real descriptor for Parasite Drift and controlled Wave2 fast-forward. */
async function runPhysicalParasiteDriftQa(name,width,height,touch){
 const context=await browser.newContext({viewport:{width,height},
   isMobile:touch,hasTouch:touch,deviceScaleFactor:touch?2:1,
   reducedMotion:"no-preference",serviceWorkers:"block"});
 const page=await context.newPage();
 page.on("pageerror",e=>diagnostics.push(name+": "+String(e)));
 page.on("console",msg=>{if(msg.type()==="error")diagnostics.push(name+": "+msg.text());});
 try{
  await page.goto(url+"/?ux15-physical-qa=1&ux15-c3b=1&ux15-c3b2=1&ux15-c3b3=1&ux15-c3b4=1&ux15-c3b5=1&ux15-c3b6=1&ux15-c3b7=1&ux15-c3b8=1",
    {waitUntil:"domcontentloaded",timeout:30000});
  const lab=page.getByTestId("ux15-physical-qa");
  await lab.waitFor({state:"visible",timeout:15000});
  check(await lab.getAttribute("data-qa-mode")==="PHYSICAL_ROUTE_C3B8_QA",
    name+": wave2 feature gate missing");
  check(await page.locator(".orbi-game-root").count()===0,
    name+": live campaign accidentally loaded");
  check(await lab.getAttribute("data-c3b8-wave-status")==="PENDING",
    name+": premature wave2 start");
  check(Number(await lab.getAttribute("data-c3b8-wave-budget"))===18,
    name+": missing original wave2 budget");
  check(Number(await lab.getAttribute("data-c3b8-wave-concurrent-cap"))===12,
    name+": invalid wave2 concurrency");
  await page.getByTestId("ux15-c3b8-skip-wave1").click({timeout:30000});
  await page.waitForFunction(()=>Number(document.querySelector(
    '[data-testid="ux15-physical-qa"]')?.dataset.c3b8WaveSpawned)>=1,
    null,{timeout:18000});
  check(await lab.getAttribute("data-c3b8-wave-status")==="ACTIVE",
    name+": wave2 not active");
  check(Number(await lab.getAttribute("data-c3b8-wave-parasites"))>=1,
    name+": no physical PARASITE spawned");
  check(Number(await lab.getAttribute("data-c3b8-wave-active"))<=12,
    name+": concurrent cap exceeded");
  check(Number(await lab.getAttribute("data-c3b8-wave-elite-uncertified"))>=1,
    name+": uncertified elites not disclosed");
  check(Number(await lab.getAttribute("data-c3b-spawned"))===0,
    name+": legacy 700ms QA spawner still running");
  check(Number(await lab.getAttribute("data-c3b8-wave-remaining-ms"))<40000,
    name+": the second wave simulation clock did not advance");
  const preY=Number(await lab.getAttribute("data-player-local-y"));
  if(touch){
   await page.getByTestId("ux15-physical-canvas").scrollIntoViewIfNeeded();
   const bounds=await page.getByTestId("ux15-physical-canvas").boundingBox();
   check(Boolean(bounds),name+": missing native canvas");
   const cdp=await context.newCDPSession(page);
   const x=bounds.x+bounds.width*.35,y=bounds.y+bounds.height*.8;
   await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x,y}]});
   await page.waitForTimeout(160);
   await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:x+25,y:y-40}]});
   await page.waitForTimeout(140);
   await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:x+55,y:y-100}]});
   await page.waitForTimeout(700);
   await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});
   if(Number(await lab.getAttribute("data-player-local-y"))>=preY-12){
    const ax=bounds.x+bounds.width*.45,ay=bounds.y+bounds.height*.75;
    await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x:ax,y:ay}]});
    await page.waitForTimeout(150);
    await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:ax+45,y:ay-85}]});
    await page.waitForTimeout(750);
    await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});
   }
   await cdp.detach();
  }else{
   await page.keyboard.down("w");
   await page.waitForTimeout(650);
   await page.keyboard.up("w");
  }
  await page.waitForFunction(y=>Number(document.querySelector(
    '[data-testid="ux15-physical-qa"]')?.dataset.playerLocalY)<y-12,
    preY,{timeout:8000});
  await shot(page,name+"-parasite-drift");
  await page.getByTestId("ux15-physical-pause").click();
  await page.waitForTimeout(450);
  const paused={ticks:await lab.getAttribute("data-physics-ticks"),
    count:await lab.getAttribute("data-c3b8-wave-spawned"),
    time:await lab.getAttribute("data-c3b8-wave-remaining-ms")};
  await page.waitForTimeout(700);
  check(paused.ticks===await lab.getAttribute("data-physics-ticks"),
    name+": wave2 physics moved while paused");
  check(paused.count===await lab.getAttribute("data-c3b8-wave-spawned"),
    name+": enemies spawned while paused");
  check(paused.time===await lab.getAttribute("data-c3b8-wave-remaining-ms"),
    name+": timebox changed while paused");
  await page.getByTestId("ux15-physical-reset").click();
  check(Number(await lab.getAttribute("data-c3b8-wave-spawned"))===0,
    name+": reset retained Wave2 budget");
  check(await lab.getAttribute("data-c3b8-wave-status")==="PENDING",
    name+": reset did not return to Wave1");
  evidence.cases.push({name,pass:true,ux15c3b8:true,
    sourceWave:"parasite_drift",budget:18,cap:12,
    input:touch?"native-touch":"keyboard"});
 }finally{await context.close();}
}

/** C3B9: canonical random-elite stat scale under explicit isolated QA roll. */
async function runPhysicalEliteQa(name,width,height,touch){
 const context=await browser.newContext({viewport:{width,height},
   isMobile:touch,hasTouch:touch,deviceScaleFactor:touch?2:1,
   reducedMotion:"no-preference",serviceWorkers:"block"});
 const page=await context.newPage();
 page.on("pageerror",e=>diagnostics.push(name+": "+String(e)));
 page.on("console",msg=>{if(msg.type()==="error")diagnostics.push(name+": "+msg.text());});
 try{
  await page.goto(url+"/?ux15-physical-qa=1&ux15-c3b=1&ux15-c3b2=1&ux15-c3b3=1&ux15-c3b4=1&ux15-c3b5=1&ux15-c3b6=1&ux15-c3b7=1&ux15-c3b8=1&ux15-c3b9=1",
    {waitUntil:"domcontentloaded",timeout:30000});
  const lab=page.getByTestId("ux15-physical-qa");
  await lab.waitFor({state:"visible",timeout:15000});
  check(await lab.getAttribute("data-qa-mode")==="PHYSICAL_ROUTE_C3B9_QA",
    name+": random-elite QA gate missing");
  check(await page.locator(".orbi-game-root").count()===0,
    name+": live gameplay mixed into isolated elite");
  check(await lab.getAttribute("data-c3b9-wave3-name")==="Drone Lock",
    name+": canonical next-wave descriptor preflight absent");
  check(Number(await lab.getAttribute("data-c3b9-elite-rolls"))===0,
    name+": random-elite roll made before Wave2");
  await page.getByTestId("ux15-c3b8-skip-wave1").click({timeout:30000});
  await page.waitForFunction(()=>Number(document.querySelector(
    '[data-testid="ux15-physical-qa"]')?.dataset.c3b9EliteRolls)>=7,
    null,{timeout:16000});
  check(await lab.getAttribute("data-c3b8-wave-status")==="ACTIVE",
    name+": Wave2 not physically active");
  const rolls=Number(await lab.getAttribute("data-c3b9-elite-rolls"));
  const elites=Number(await lab.getAttribute("data-c3b9-elite-spawned"));
  check(rolls>=7&&rolls<=18,name+": incorrect QA elite roll cadence");
  check(elites===1,name+": expected exactly the controlled ordinal-6 elite");
  check(Number(await lab.getAttribute("data-c3b8-wave-elite-uncertified"))===0,
    name+": previous uncatalogued elite suppression still active");
  check(Number(await lab.getAttribute("data-c3b8-wave-active"))<=12,
    name+": physical simultaneous cap exceeded");
  check(Number(await lab.getAttribute("data-c3b-spawned"))===0,
    name+": generic QA fake spawn incorrectly enabled");
  const startY=Number(await lab.getAttribute("data-player-local-y"));
  if(touch){
    await page.getByTestId("ux15-physical-canvas").scrollIntoViewIfNeeded();
    const rect=await page.getByTestId("ux15-physical-canvas").boundingBox();
    check(Boolean(rect),name+": canvas missing");
    const cdp=await context.newCDPSession(page);
    const x=rect.x+rect.width*.35,y=rect.y+rect.height*.8;
    await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x,y}]});
    await page.waitForTimeout(160);
    await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:x+45,y:y-65}]});
    await page.waitForTimeout(650);
    await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});
    if(Number(await lab.getAttribute("data-player-local-y"))>=startY-12){
      const xx=rect.x+rect.width*.45,yy=rect.y+rect.height*.75;
      await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x:xx,y:yy}]});
      await page.waitForTimeout(150);
      await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:xx+45,y:yy-75}]});
      await page.waitForTimeout(750);
      await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});
    }
    await cdp.detach();
  }else{
    await page.keyboard.down("w");
    await page.waitForTimeout(650);
    await page.keyboard.up("w");
  }
  await page.waitForFunction(y=>Number(document.querySelector(
    '[data-testid="ux15-physical-qa"]')?.dataset.playerLocalY)<y-12,
    startY,{timeout:8000});
  await shot(page,name+"-wave2-elites");
  await page.getByTestId("ux15-physical-pause").click();
  await page.waitForTimeout(400);
  const frozen={ticks:await lab.getAttribute("data-physics-ticks"),
    rolls:await lab.getAttribute("data-c3b9-elite-rolls")};
  await page.waitForTimeout(550);
  check(frozen.ticks===await lab.getAttribute("data-physics-ticks"),
    name+": elite physical ticks continued during pause");
  check(frozen.rolls===await lab.getAttribute("data-c3b9-elite-rolls"),
    name+": random elite roll continued during pause");
  await page.getByTestId("ux15-physical-reset").click({timeout:10000});
  check(Number(await lab.getAttribute("data-c3b9-elite-rolls"))===0,
    name+": reset failed to clear elite counter");
  check(Number(await lab.getAttribute("data-c3b9-elite-spawned"))===0,
    name+": reset failed to clear elites");
  check(await lab.getAttribute("data-c3b8-wave-status")==="PENDING",
    name+": Wave2 did not reset to Wave1");
  evidence.cases.push({name,pass:true,ux15c3b9:true,rolls,elites,
    wave3Certified:false,input:touch?"native-touch":"keyboard"});
 }finally{await context.close();}
}


/** C3B10: read-only Drone Lock preflight must never adopt living DRONE actors. */
async function runDroneLockTrajectoryPreflight(name,width,height,touch){
 const context=await browser.newContext({viewport:{width,height},
   isMobile:touch,hasTouch:touch,deviceScaleFactor:touch?2:1,
   reducedMotion:"no-preference",serviceWorkers:"block"});
 const page=await context.newPage();
 page.on("pageerror",e=>diagnostics.push(name+": "+String(e)));
 page.on("console",msg=>{if(msg.type()==="error")diagnostics.push(name+": "+msg.text());});
 try {
  await page.goto(url+"/?ux15-physical-qa=1&ux15-c3b=1&ux15-c3b2=1&ux15-c3b3=1&ux15-c3b4=1&ux15-c3b5=1&ux15-c3b6=1&ux15-c3b7=1&ux15-c3b8=1&ux15-c3b9=1&ux15-c3b10=1",
    {waitUntil:"domcontentloaded",timeout:30000});
  const lab=page.getByTestId("ux15-physical-qa");
  await lab.waitFor({state:"visible",timeout:15000});
  check(await lab.getAttribute("data-qa-mode")==="PHYSICAL_ROUTE_C3B10_QA",
    name+": C3B10 gate not adopted");
  check(await page.locator(".orbi-game-root").count()===0,
    name+": gameplay engine loaded under isolated preflight");
  check(await lab.getAttribute("data-c3b10-drone-spawn-authorized")==="false",
    name+": live DRONE accidentally licensed");
  check(Number(await lab.getAttribute("data-c3b10-shadow-shot"))===1,
    name+": offline plasma projection not available");
  const speed=Number(await lab.getAttribute("data-c3b10-shadow-speed"));
  check(Math.abs(speed-2.2*1000/16.6)<.01,
    name+": production plasma speed projection changed");
  check(Number(await lab.getAttribute("data-c3b10-live-drone-count"))===0,
    name+": a live DRONE was spawned before Wave3 certification");
  check(await lab.getAttribute("data-c3b9-wave3-name")==="Drone Lock",
    name+": wrong authoritative descriptor");
  await page.getByTestId("ux15-c3b8-skip-wave1").click({timeout:30000});
  await page.waitForFunction(()=>Number(document.querySelector(
    '[data-testid="ux15-physical-qa"]')?.dataset.c3b9EliteRolls)>=7,
    null,{timeout:17000});
  check(Number(await lab.getAttribute("data-c3b10-live-drone-count"))===0,
    name+": Wave2 generated an uncertified DRONE");
  check(await lab.getAttribute("data-c3b8-wave-status")==="ACTIVE",
    name+": Wave2 state regressed");
  await shot(page,name+"-drone-preflight");
  await page.getByTestId("ux15-physical-reset").click({timeout:10000});
  check(Number(await lab.getAttribute("data-c3b9-elite-rolls"))===0,
    name+": reset did not clear Wave2 RNG QA");
  check(Number(await lab.getAttribute("data-c3b10-live-drone-count"))===0,
    name+": reset left a DRONE actor");
  evidence.cases.push({name,pass:true,ux15c3b10:true,
    shadowOnly:true,plasmaSpeed:speed,wave3Enabled:false,
    input:touch?"native-touch":"keyboard"});
 }finally{await context.close();}
}


/** C3B11: truly moving hostile QA projectile, one independently-owned DRONE,
 * and observed shield contact in the controlled world-coordinate lab.
 * The official third wave MUST remain gated throughout this scenario.
 */
async function runPhysicalDroneDuelQa(name,width,height,touch){
 const context=await browser.newContext({viewport:{width,height},
   isMobile:touch,hasTouch:touch,deviceScaleFactor:touch?2:1,
   reducedMotion:"no-preference",serviceWorkers:"block"});
 const page=await context.newPage();
 page.on("pageerror",e=>diagnostics.push(name+": "+String(e)));
 page.on("console",msg=>{if(msg.type()==="error")diagnostics.push(name+": "+msg.text());});
 try{
  await page.goto(url+"/?ux15-physical-qa=1&ux15-c3b=1&ux15-c3b2=1&ux15-c3b3=1&ux15-c3b4=1&ux15-c3b5=1&ux15-c3b6=1&ux15-c3b7=1&ux15-c3b8=1&ux15-c3b9=1&ux15-c3b10=1&ux15-c3b11=1",
    {waitUntil:"domcontentloaded",timeout:30000});
  const lab=page.getByTestId("ux15-physical-qa");
  await lab.waitFor({state:"visible",timeout:15000});
  check(await lab.getAttribute("data-qa-mode")==="PHYSICAL_ROUTE_C3B11_QA",
    name+": missing explicit full C3B11 flag chain");
  check(await lab.getAttribute("data-c3b11-status")==="DISARMED",
    name+": drone was armed before explicit user QA action");
  check(await lab.getAttribute("data-c3b11-wave3-active")==="false",
    name+": official Wave3 was unlocked");
  check(Number(await lab.getAttribute("data-c3b10-live-drone-count"))===0,
    name+": ordinary encounter adopted drone prematurely");
  await page.getByTestId("ux15-c3b11-arm-drone").click({timeout:60000});
  await page.waitForFunction(()=>document.querySelector(
    '[data-testid="ux15-physical-qa"]')?.getAttribute("data-c3b11-status")==="ACTIVE",
    null,{timeout:25000});
  check(await lab.getAttribute("data-c3b8-wave-status")==="GATED_WAVE3",
    name+": drone duel began before Wave2 was gated");
  await page.waitForFunction(()=>Number(document.querySelector(
    '[data-testid="ux15-physical-qa"]')?.getAttribute("data-c3b11-shots"))>=1,
    null,{timeout:30000});
  const fired=Number(await lab.getAttribute("data-c3b11-shots"));
  const shield=Number(await lab.getAttribute("data-c3b11-shield"));
  check(fired>=1,name+": physical DRONE never emitted hostile plasma");
  check(shield>=0 && shield<=100,name+": QA shield outside legal range");
  check(Number(await lab.getAttribute("data-c3b11-drone-world-x"))>0,
    name+": missing registered physical DRONE coordinate");
  check(await lab.getAttribute("data-c3b11-wave3-active")==="false",
    name+": Wave3 changed under separate duel");
  check(Number(await lab.getAttribute("data-c3b10-live-drone-count"))===0,
    name+": QA drone leaked into Wave2 spatial enemy list");
  await shot(page,name+"-physical-drone-duel");
  await page.getByTestId("ux15-physical-pause").click();
  await page.waitForTimeout(400);
  const ticks=await lab.getAttribute("data-physics-ticks");
  const shots=await lab.getAttribute("data-c3b11-shots");
  await page.waitForTimeout(600);
  check(await lab.getAttribute("data-physics-ticks")===ticks,
    name+": physical duel advanced while paused");
  check(await lab.getAttribute("data-c3b11-shots")===shots,
    name+": hostile plasma fired while paused");
  await page.getByTestId("ux15-physical-reset").click();
  check(await lab.getAttribute("data-c3b11-status")==="DISARMED",
    name+": reset retained active DRONE");
  check(Number(await lab.getAttribute("data-c3b11-shots"))===0,
    name+": reset did not clear plasma counter");
  evidence.cases.push({name,pass:true,ux15c3b11:true,
    wave3Active:false,fired,shield,input:touch?"native-touch":"keyboard"});
 }finally{await context.close();}
}


/** C3B12: opt-in visual jets follow the actual +X physics-owned FOTON,
 * strengthen only under a canonical Dash, and freeze with simulated time.
 * Screenshot the genuine GLB plus Canvas2D exhaust on desktop and mobile.
 */
async function runFotonPropulsionQa(name,width,height,touch){
 const context=await browser.newContext({viewport:{width,height},
  isMobile:touch,hasTouch:touch,deviceScaleFactor:touch?2:1,
  reducedMotion:"no-preference",serviceWorkers:"block"});
 const page=await context.newPage();
 page.on("pageerror",e=>diagnostics.push(name+": "+String(e)));
 page.on("console",msg=>{if(msg.type()==="error")diagnostics.push(name+": "+msg.text());});
 try{
  await page.goto(url+"/?ux15-physical-qa=1&ux15-c3b=1&ux15-c3b2=1&ux15-c3b3=1&ux15-c3b4=1&ux15-c3b5=1&ux15-c3b6=1&ux15-c3b7=1&ux15-c3b8=1&ux15-c3b9=1&ux15-c3b10=1&ux15-c3b11=1&ux15-c3b12=1",
    {waitUntil:"domcontentloaded",timeout:30000});
  const lab=page.getByTestId("ux15-physical-qa");
  const canvas=page.getByTestId("ux15-physical-canvas");
  await lab.waitFor({state:"visible",timeout:15000});
  check(await lab.getAttribute("data-qa-mode")==="PHYSICAL_ROUTE_C3B12_QA",
    name+": new propulsion flag failed closed");
  check(await lab.getAttribute("data-c3b12-propulsion-enabled")==="true",
    name+": thrusters are not authorized in this opt-in lab");
  await page.waitForFunction(()=>document.querySelector(
    '[data-testid="ux15-physical-canvas"]')?.dataset.c3b12Thrust==="CRUISE",
    null,{timeout:15000});
  check(await canvas.getAttribute("data-c3b12-thrust-source")==="CANONICAL_UX12",
    name+": new LAB is not using the original game RCS renderer");
  check(await lab.getAttribute("data-c3b12-canonical-source")==="src/game/energyThrusters.ts",
    name+": original propulsion source missing");
  await page.waitForFunction(()=>Number(document.querySelector(
    '[data-testid="ux15-physical-canvas"]')?.dataset.c3b12ThrustLength)>0,
    null,{timeout:20000});
  const initialLength=Number(await canvas.getAttribute("data-c3b12-thrust-length"));
  check(initialLength>0&&initialLength<24,name+": actual canonical RCS cruise reach out of range");
  // UX12 inertial RCS intentionally eases its direction toward +X
  // over several genuine physics ticks. Do not sample the very first frame
  // after the 0.035 throttle threshold; require convergence to the SAME
  // original physical orientation without lowering the strict >.8 gate.
  await page.waitForFunction(()=>Number(document.querySelector(
    '[data-testid="ux15-physical-canvas"]')?.dataset.c3b12ThrusterDirectionX)>.8,
    null,{timeout:20000});
  check(Number(await canvas.getAttribute("data-c3b12-thruster-direction-x"))>.8,
    name+": original UX12 RCS never converged toward positive physical X");
  // The actor's LOCAL x may decrease during a legitimate floating-origin
  // rebase. Certify monotonic forward physical travel in the reconstituted
  // world coordinate, without accepting any backwards player movement.
  const worldX=async()=>Number(await lab.getAttribute("data-player-local-x"))+
    Number(await lab.getAttribute("data-origin-offset-x"));
  const initialX=await worldX();
  // Published UI telemetry is sampled at 1/8 of the Canvas paint frequency;
  // under real GLB/SwiftShader load it may not refresh within 520ms of wall
  // time. Observe the SAME strict, positive world displacement instead.
  await page.waitForFunction(start=>{
    const root=document.querySelector('[data-testid="ux15-physical-qa"]');
    if(!root)return false;
    const x=Number(root.getAttribute("data-player-local-x"))+
      Number(root.getAttribute("data-origin-offset-x"));
    return Number.isFinite(x)&&x>start+1;
  },initialX,{timeout:30000});
  check(await worldX()>initialX,
    name+": FOTON did not advance with its physical thrusters");
  check(await canvas.getAttribute("data-c3b12-boost-observed")===null,
    name+": boost activated without a Dash input");
  await page.getByTestId("ux15-c3b2-dash").click({timeout:15000});
  await page.waitForFunction(()=>document.querySelector(
    '[data-testid="ux15-physical-canvas"]')?.dataset.c3b12BoostObserved==="true",
    null,{timeout:12000});
  // The latch is only set by an ACTUAL rendered Dash frame in the Canvas.
  // The 180ms plume may already have returned to cruise by the next poll.
  const boostedLength=Number(await canvas.getAttribute("data-c3b12-boost-peak-length"));
  check(boostedLength>initialLength*1.15 && boostedLength<35,
    name+": original UX12 Dash surge not observed in Canvas");
  await shot(page,name+"-cyan-propulsion-dash");
  await page.waitForFunction(()=>document.querySelector(
    '[data-testid="ux15-physical-canvas"]')?.dataset.c3b12Thrust==="CRUISE",
    null,{timeout:12000});
  const beforePausePaint=Number(await canvas.getAttribute("data-c3b12-paint-ordinal"));
  await page.getByTestId("ux15-physical-pause").click();
  await page.waitForFunction(()=>document.querySelector(
    '[data-testid="ux15-physical-canvas"]')?.dataset.c3b12RunGate==="false",
    null,{timeout:12000});
  // Under mobile SwiftShader the 1:8 React telemetry can lag actual Canvas
  // frames. Certify two AFTER-PAUSE paints using the SAME canvas-clock source.
  await page.waitForFunction(previous=>{
    const d=document.querySelector('[data-testid="ux15-physical-canvas"]')?.dataset;
    return d&&Number(d.c3b12PaintOrdinal)>=previous+2;
  },beforePausePaint,{timeout:20000});
  const frozen=await canvas.evaluate(el=>({
    clock:el.dataset.c3b12ClockMs,
    reach:el.dataset.c3b12ThrustLength,
    paint:Number(el.dataset.c3b12PaintOrdinal),
  }));
  await page.waitForFunction(previous=>{
    const d=document.querySelector('[data-testid="ux15-physical-canvas"]')?.dataset;
    return d&&Number(d.c3b12PaintOrdinal)>=previous+2;
  },frozen.paint,{timeout:20000});
  const after=await canvas.evaluate(el=>({
    clock:el.dataset.c3b12ClockMs,
    reach:el.dataset.c3b12ThrustLength,
  }));
  check(after.clock===frozen.clock,
    name+": actual Canvas simulated clock advanced during pause"+
    " ("+frozen.clock+" => "+after.clock+")");
  check(after.reach===frozen.reach,
    name+": exhaust animation ran independently of simulated clock");
  check(await lab.getAttribute("data-c3b11-wave3-active")==="false",
    name+": Wave3 was incorrectly unlocked by exhaust");
  await page.getByTestId("ux15-physical-reset").click();
  await page.waitForFunction(()=>document.querySelector(
    '[data-testid="ux15-physical-canvas"]')?.dataset.c3b12Thrust==="CRUISE",
    null,{timeout:10000});
  check(await canvas.getAttribute("data-c3b12-boost-observed")===null,
    name+": reset retained old rendered Dash evidence");
  evidence.cases.push({name,pass:true,ux15c3b12:true,
    source:"src/game/energyThrusters.ts",cruiseLength:initialLength,
    boostedLength,paused:true,
    wave3Enabled:false,input:touch?"native-touch":"keyboard"});
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
  await runFerrumLiveCombat("ferrum01-real-game-desktop-1440x900",1440,900,false);
  await runFerrumLiveCombat("ferrum01-real-game-mobile-844x390",844,390,true);
  await runPyraLiveCombat("pyra03-real-game-desktop-1440x900",1440,900,false);
  await runPyraLiveCombat("pyra03-real-game-mobile-844x390",844,390,true);
  await runPhysicalRouteQa("ux15c3a2-physical-desktop-1440x900",1440,900,false);
  await runPhysicalRouteQa("ux15c3a2-physical-mobile-844x390",844,390,true);
  await runDynamicRouteQa("ux15c3b1-dynamic-desktop-1440x900",1440,900,false);
  await runDynamicRouteQa("ux15c3b1-dynamic-mobile-844x390",844,390,true);
  await runRouteCombatBridgeQa("ux15c3b2-bridge-desktop-1440x900",1440,900,false);
  await runRouteCombatBridgeQa("ux15c3b2-bridge-mobile-844x390",844,390,true);
  await runCanonicalOrbiRouteQa("ux15c3b3-orbi-desktop-1440x900",1440,900,false);
  await runCanonicalOrbiRouteQa("ux15c3b3-orbi-mobile-844x390",844,390,true);
  await runRouteOrbiImpactQa("ux15c3b4-impact-desktop-1440x900",1440,900,false);
  await runRouteOrbiImpactQa("ux15c3b4-impact-mobile-844x390",844,390,true);
  await runRouteOverdriveQa("ux15c3b5-overdrive-desktop-1440x900",1440,900,false);
  await runRouteOverdriveQa("ux15c3b5-overdrive-mobile-844x390",844,390,true);
  await runRouteConvergenceQa("ux15c3b6-convergence-desktop-1440x900",1440,900,false);
  await runRouteConvergenceQa("ux15c3b6-convergence-mobile-844x390",844,390,true);
  await runRouteCampaignWave1Qa("ux15c3b7-wave1-desktop-1440x900",1440,900,false);
  await runRouteCampaignWave1Qa("ux15c3b7-wave1-mobile-844x390",844,390,true);
  await runPhysicalParasiteDriftQa("ux15c3b8-wave2-desktop-1440x900",1440,900,false);
  await runPhysicalParasiteDriftQa("ux15c3b8-wave2-mobile-844x390",844,390,true);
  await runPhysicalEliteQa("ux15c3b9-elite-desktop-1440x900",1440,900,false);
  await runPhysicalEliteQa("ux15c3b9-elite-mobile-844x390",844,390,true);
  await runDroneLockTrajectoryPreflight("ux15c3b10-drone-desktop-1440x900",1440,900,false);
  await runDroneLockTrajectoryPreflight("ux15c3b10-drone-mobile-844x390",844,390,true);
  await runPhysicalDroneDuelQa("ux15c3b11-duel-desktop-1440x900",1440,900,false);
  await runPhysicalDroneDuelQa("ux15c3b11-duel-mobile-844x390",844,390,true);
  await runFotonPropulsionQa("ux15c3b12-propulsion-desktop-1440x900",1440,900,false);
  await runFotonPropulsionQa("ux15c3b12-propulsion-mobile-844x390",844,390,true);
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
