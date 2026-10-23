/**
 * C11: Actual Chromium browser evidence, never a synthetic engine session.
 * Required: npm ci; npm install --no-save --package-lock=false playwright@1.56.1;
 * npx playwright install --with-deps chromium; npm run build.
 * No game-state injection, forged owner/guard, or direct DEV action invocation.
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdir, writeFile, stat } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";

const out=process.env.ORBI_C11_OUTPUT || "artifacts/es13-c11-browser";
const devPort=4178, productionPort=4179;
const rootDev=`http://127.0.0.1:${devPort}`;
const rootProduction=`http://127.0.0.1:${productionPort}`;
const evidence={mode:"ACTUAL_HEADLESS_CHROMIUM_DEV_QA", browser:"chromium", cases:[], failures:[], console:[], noHumanDeviceClaim:true};
const servers=[];
const errors=[];
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const assert=(value,message)=>{if(!value)throw new Error(message);};
const record=(name,value)=>{evidence.cases.push({name,pass:true,...value});};
const after = async (page,name)=>{
  const file=join(out,`${name}.png`);
  await page.screenshot({path:file,fullPage:false,animations:"disabled"});
  const bytes=(await stat(file)).size;
  assert(bytes>10000,`Not a real visible screenshot: ${name} (${bytes} bytes)`);
  return {file,bytes};
};
const onDiagnostics=(page,name)=>{
  page.on("pageerror",e=>errors.push({where:name,error:String(e)}));
  page.on("console",m=>{if(m.type()==="error")errors.push({where:name,error:m.text().slice(0,300)});});
};
async function startServer(commandArgs,port,name) {
  const child=spawn(process.execPath,["node_modules/vite/bin/vite.js",...commandArgs,
    "--host","127.0.0.1","--port",String(port),"--strictPort"],{
    cwd:process.cwd(),env:{...process.env,DISABLE_HMR:"true"},stdio:["ignore","pipe","pipe"],
  });
  let log="";
  for(const stream of [child.stdout,child.stderr]){
    stream.on("data",buf=>{log+=buf.toString().slice(0,1800);});
  }
  servers.push(child);
  for(let i=0;i<160;i++) {
    if(child.exitCode!==null)break;
    try {
      const response=await fetch(`http://127.0.0.1:${port}/`);
      if(response.ok)return;
    }catch{ /* expected during Vite startup */ }
    await sleep(250);
  }
  throw new Error(`${name} did not start: ${log.slice(-3000)}`);
}
const dock=page=>page.locator('[data-testid="architect-qa-touch-dock"]');
const label=page=>page.locator('[data-testid="architect-qa-touch-dock"] button');
const enter=page=>page.getByRole("button",{name:"ENTER QA Blackout Architect QA"});
const exit=page=>page.getByRole("button",{name:"EXIT QA Blackout Architect QA"});
const auto=page=>page.getByRole("button",{name:"ENABLE AUTO QA pattern director"});
const manual=page=>page.getByRole("button",{name:"DISABLE AUTO QA pattern director"});
const next=page=>page.getByRole("button",{name:"Select next QA attack pattern"});
const enabled=async (locator,message)=>assert(await locator.isEnabled(),message);
const disabled=async (locator,message)=>assert(!(await locator.isEnabled()),message);
async function freezeTime(page){
  // Browser-clock authority, not a game-state/owner mock. Only normal user UI is clicked.
  await page.clock.install({time:new Date("2026-10-22T12:00:00.000Z")});
}
async function runDevCase(browser,{name,width,height,isMobile,hasTouch}){
  const context=await browser.newContext({viewport:{width,height},isMobile,hasTouch,
    deviceScaleFactor:1,serviceWorkers:"block",reducedMotion:"reduce"});
  const page=await context.newPage();
  onDiagnostics(page,name);
  await freezeTime(page);
  await page.goto(rootDev,{waitUntil:"domcontentloaded",timeout:30000});
  await page.locator('[data-primary-start-cta="true"]').waitFor({state:"visible",timeout:30000});
  assert(await dock(page).count()===0,`${name}: dev dock leaked before game admission`);
  await after(page,`${name}-initial`);
  // Freeze browser-clock BEFORE clicking the actual START CAMPAIGN button so
  // its real 2500-ms intermission is not consumed by headless runner latency.
  await page.clock.pauseAt(new Date("2026-10-22T12:00:05.000Z"));
  await page.locator('[data-primary-start-cta="true"]').click();
  await enter(page).waitFor({state:"visible",timeout:15000});
  await enabled(enter(page),`${name}: real start did not offer authenticated-safe intermission entry`);
  await disabled(auto(page),`${name}: director must require installed original QA`);
  await disabled(next(page),`${name}: next pattern must require original QA`);
  assert((await label(page).count())===3,`${name}: expected three native touch buttons`);
  const before=await after(page,`${name}-campaign-break`);
  await enter(page).click();
  await exit(page).waitFor({state:"visible",timeout:10000});
  const diagnostic=page.getByText("DEV QA — ARCHITECT ANCHOR HITS",{exact:false});
  await diagnostic.waitFor({state:"visible",timeout:10000});
  await enabled(auto(page),`${name}: real boss/guard failed after normal click`);
  await enabled(next(page),`${name}: manual pattern selection disabled`);
  assert(await dock(page).getAttribute("data-qa-pattern")==="GRID_LOCK",
    `${name}: real original QA did not select default GRID_LOCK`);
  assert(await dock(page).getAttribute("data-qa-director")==="MANUAL",
    `${name}: original director unexpectedly enabled`);
  // Advance actual requestAnimationFrame/render, keeping world frozen in original DEV QA.
  await page.clock.runFor(80);
  const running=await after(page,`${name}-architect-qa`);

  // The control surface is outside Canvas: native pointer taps must not be
  // interpreted as player shot or movement Canvas pointerdown events.
  await page.evaluate(()=>{
    window.__orbiC11CanvasPointerDown=0;
    for(const canvas of document.querySelectorAll("canvas")){
      canvas.addEventListener("pointerdown",()=>{window.__orbiC11CanvasPointerDown++;},{capture:true});
    }
  });
  // Phase 1 admits only GRID_LOCK as an automatic director pattern;
  // enable F7 BEFORE F8 cycles into later-phase manual patterns.
  await auto(page).click();
  await manual(page).waitFor({state:"visible",timeout:10000});
  assert(await dock(page).getAttribute("data-qa-director")==="AUTO",
    `${name}: F7 did not install real director ref`);
  await disabled(next(page),`${name}: F8 was not locked by actual phase-one F7 director`);
  const directed=await after(page,`${name}-director-locked`);
  await manual(page).click();
  await auto(page).waitFor({state:"visible",timeout:10000});
  await enabled(next(page),`${name}: F8 did not unlock when director disabled`);

  // Confirm real manual F8 changes pattern. Phase-one auto must FAIL CLOSED
  // if the player intentionally selects VECTOR_TIDE before breaking anchors.
  await next(page).click();
  assert(await dock(page).getAttribute("data-qa-pattern")==="VECTOR_TIDE",
    `${name}: F8 did not transition genuine attack ref to VECTOR_TIDE`);
  await enabled(next(page),`${name}: F8 manual selection unexpectedly disabled`);
  await page.clock.runFor(40);
  const manualTide=await after(page,`${name}-manual-vector-tide`);
  await auto(page).click();
  assert(await auto(page).count()===1,
    `${name}: disallowed phase-one VECTOR_TIDE unexpectedly admitted into director`);
  await enabled(next(page),`${name}: denied director changed manual selector`);
  // SECTOR_WALL is also an upper-phase pattern; return to valid GRID_LOCK.
  await next(page).click();
  assert(await dock(page).getAttribute("data-qa-pattern")==="SECTOR_WALL",
    `${name}: authentic third physical attack wasn't selected`);
  await next(page).click();
  assert(await dock(page).getAttribute("data-qa-pattern")==="GRID_LOCK",
    `${name}: F8 did not return original GRID_LOCK`);
  await auto(page).click();
  await manual(page).waitFor({state:"visible",timeout:10000});
  await disabled(next(page),`${name}: GRID_LOCK director did not lock F8 after return`);
  await manual(page).click();
  await auto(page).waitFor({state:"visible",timeout:10000});
  const clicks=await page.evaluate(()=>window.__orbiC11CanvasPointerDown);
  assert(clicks===0,`${name}: C10 touch buttons leaked ${clicks} Canvas pointerdown events`);
  await exit(page).click();
  await enter(page).waitFor({state:"visible",timeout:10000});
  assert(await diagnostic.count()===0,`${name}: original QA didn't revoke on exit`);
  await disabled(auto(page),`${name}: director still enabled without installed QA`);
  const exited=await after(page,`${name}-qa-exited`);
  // Existing hardware shortcuts remain functional in the same safe break.
  await page.keyboard.press("Control+Alt+Shift+F9");
  await exit(page).waitFor({state:"visible",timeout:10000});
  await page.keyboard.press("Control+Alt+Shift+F9");
  await enter(page).waitFor({state:"visible",timeout:10000});
  record(name,{viewport:{width,height,isMobile,hasTouch},screenshots:[before,running,directed,manualTide,exited],
    verified:["real campaign start","real QA entry/exit","F7 director toggle","F8 director lock","read-only actual attack ref cycle","phase-one director rejects premature VECTOR_TIDE","no canvas pointer events","F9 keyboard parity"]});
  await context.close();
}
async function runProduction(browser){
  const context=await browser.newContext({viewport:{width:1280,height:800},serviceWorkers:"block"});
  const page=await context.newPage();
  onDiagnostics(page,"production");
  await freezeTime(page);
  await page.goto(rootProduction,{waitUntil:"domcontentloaded",timeout:30000});
  await page.locator('[data-primary-start-cta="true"]').waitFor({state:"visible",timeout:30000});
  await page.clock.pauseAt(new Date("2026-10-22T12:00:05.000Z"));
  await page.locator('[data-primary-start-cta="true"]').click();
  assert(await dock(page).count()===0,"C11: PRODUCTION leaked QA touch dock");
  await page.keyboard.press("Control+Alt+Shift+F9");
  assert(await dock(page).count()===0,"C11: PRODUCTION keyboard activated diagnostic");
  assert(await page.getByText("DEV QA — ARCHITECT ANCHOR HITS",{exact:false}).count()===0,
    "C11: PRODUCTION exposed Architect DEV-only status");
  await after(page,"production-controls-absent");
  record("production-denial",{verified:["no DEV QA buttons","F9 cannot admit production boss"]});
  await context.close();
}
await mkdir(out,{recursive:true});
let browser;
try{
  await startServer([],devPort,"Vite DEV");
  await startServer(["preview"],productionPort,"Vite production preview");
  browser=await chromium.launch({headless:true,args:["--disable-dev-shm-usage","--use-gl=angle","--use-angle=swiftshader"]});
  await runDevCase(browser,{name:"desktop",width:1440,height:900,isMobile:false,hasTouch:false});
  await runDevCase(browser,{name:"mobile-touch",width:390,height:844,isMobile:true,hasTouch:true});
  await runProduction(browser);
}catch(e){evidence.failures.push({error:String(e),stack:e?.stack||""});process.exitCode=1;}
finally{
  evidence.console=errors.slice(0,35);
  await writeFile(join(out,"evidence.json"),JSON.stringify(evidence,null,2)+"\n","utf8");
  if(browser)await browser.close();
  for(const child of servers) {try{child.kill("SIGTERM");}catch{}}
  process.stdout.write(JSON.stringify({cases:evidence.cases.map(x=>x.name),failures:evidence.failures,
    consoleErrors:evidence.console.length,output:out})+"\n");
}
