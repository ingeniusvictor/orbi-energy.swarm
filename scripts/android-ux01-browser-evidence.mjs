/** ANDROID UX01 actual horizontal Chromium composition evidence.
 * Tests responsive mobile views with native touch, not a physical Android phone.
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdir, writeFile, stat } from "node:fs/promises";
import { join } from "node:path";

const output=process.env.ORBI_ANDROID_UX_OUTPUT || "artifacts/android-ux01";
const port=4187,url="http://127.0.0.1:"+port;
const proof={type:"REAL_MOBILE_CHROMIUM_LANDSCAPE_COMPOSITION",cases:[],screenshots:[],errors:[],failures:[],realAndroidDevice:false};
const servers=[];const diagnostics=[];
const check=(v,m)=>{if(!v)throw Error(m);};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function shot(page,name){
  const file=join(output,name+".png");
  await page.screenshot({path:file,animations:"disabled",fullPage:false});
  const bytes=(await stat(file)).size;
  check(bytes>10000,name+": empty screenshot");
  proof.screenshots.push({name,bytes});
}
async function boot(){
  const p=spawn(process.execPath,["node_modules/vite/bin/vite.js","--host","127.0.0.1",
    "--port",String(port),"--strictPort"],{stdio:["ignore","pipe","pipe"]});
  let logs="";
  for(const io of [p.stdout,p.stderr])io.on("data",x=>logs+=x.toString().slice(0,1000));
  servers.push(p);
  for(let i=0;i<120;i++){try{if((await fetch(url)).ok)return;}catch{}await sleep(250);}
  throw Error("Vite startup failed "+logs.slice(-1800));
}
async function run(browser,name,width,height,mobile,touch,immersive){
  const context=await browser.newContext({viewport:{width,height},isMobile:mobile,hasTouch:touch,
    deviceScaleFactor:1,serviceWorkers:"block",reducedMotion:"reduce"});
  const page=await context.newPage();
  page.on("pageerror",e=>diagnostics.push(name+": "+String(e)));
  page.on("console",m=>{if(m.type()==="error")diagnostics.push(name+": "+m.text().slice(0,350));});
  try {
    await page.clock.install({time:new Date("2026-10-22T12:00:00Z")});
    await page.goto(url,{waitUntil:"domcontentloaded",timeout:30000});
    await page.locator('[data-primary-start-cta="true"]').waitFor({state:"visible",timeout:30000});
    await page.clock.pauseAt(new Date("2026-10-22T12:00:05Z"));
    await page.locator('[data-primary-start-cta="true"]').click();
    const root=page.locator(".orbi-game-root");
    await root.waitFor({state:"visible"});
    const mode=await root.getAttribute("data-immersive-landscape");
    check(mode===(immersive?"true":"false"),name+": immersive flag wrong: "+mode);
    const stage=page.locator(".orbi-game-stage");
    await stage.waitFor({state:"visible"});
    await page.clock.runFor(50);
    const rect=await stage.boundingBox();
    check(rect,name+": stage missing");
    if(immersive){
      // Mobile Chromium emulates browser chrome; measure the game's ACTUAL
      // visual viewport rather than the nominal device screen resolution.
      // Native Android immersive mode hides system bars separately.
      const rootBox=await root.boundingBox();
      const hudBox=await page.locator(".orbi-game-hud").boundingBox();
      check(rootBox && hudBox,name+": root/HUD rectangles missing");
      const usable=rootBox.height-hudBox.height;
      check(rect.height>=usable*.95,name+": stage uses only "+rect.height+" of "+usable+" actual visible game height");
      check(rect.width>=rootBox.width*.96,name+": stage does not span available landscape width");
      const hud=page.locator(".orbi-game-hud");
      check((await hud.boundingBox()).height<=48,name+": persistent HUD too tall");
      check(await page.locator(".orbi-tactical-rail").isHidden(),name+": tactical rail takes gameplay space");
      check(await page.locator(".orbi-logistics-deck").isHidden(),name+": logistics rail takes gameplay space");
      const pad=page.locator(".orbi-touch-pad");
      const alpha=await pad.evaluate(el=>parseFloat(getComputedStyle(el).opacity));
      check(alpha<=.55,name+": idle controls too opaque "+alpha);
      const dir=page.locator('[data-touch-direction="LEFT"]');
      const widthButton=await dir.evaluate(el=>el.getBoundingClientRect().width);
      check(widthButton>=40,name+": movement control touch target too small");
      await shot(page,name+"-battlefield");

      const state=page.getByTestId("orbi-estado-button");
      await state.click();
      await page.locator(".orbi-hud-detail-grid").waitFor({state:"visible"});
      check(await page.locator(".orbi-hud-swarm").isVisible(),name+": swarm stats missing from Estado");
      check(await page.locator(".orbi-hud-score").isVisible(),name+": score stats missing");
      await shot(page,name+"-estado");
      await page.locator(".orbi-immersive-panel-tabs").getByRole("button",{name:/Táctica|Tactics/}).click();
      check(await page.locator(".orbi-tactical-rail").isVisible(),name+": tactical menu inaccessible");
      await shot(page,name+"-tactica");
      await page.locator(".orbi-immersive-panel-tabs").getByRole("button",{name:/Equipo|Team/}).click();
      check(await page.locator(".orbi-logistics-deck").isVisible(),name+": logistics menu inaccessible");
      await shot(page,name+"-equipo");
      await page.keyboard.press("Escape");
      check(await page.locator(".orbi-immersive-panel-tabs").count()===0,name+": Escape failed to close Estado");
      check(await page.locator(".orbi-tactical-rail").isHidden(),name+": menus did not return to hidden");
    }else {
      check(await page.getByTestId("orbi-estado-button").count()===0,name+": desktop/portrait received mobile cockpit");
      await shot(page,name+"-unchanged");
    }
    proof.cases.push({name,pass:true,viewport:{width,height},immersive,
      stage:{width:rect.width,height:rect.height},verified:immersive?
        ["stage extent","compact HUD","Estado data","Táctica","Equipo","transparent controls","Escape"] :
        ["legacy composition retained"]});
  }finally{await context.close();}
}
await mkdir(output,{recursive:true});let browser;
try{
  await boot();
  browser=await chromium.launch({headless:true,args:["--disable-dev-shm-usage","--use-gl=angle",
    "--use-angle=swiftshader"]});
  await run(browser,"landscape-915x412",915,412,true,true,true);
  await run(browser,"landscape-844x390",844,390,true,true,true);
  await run(browser,"landscape-740x360",740,360,true,true,true);
  await run(browser,"desktop-1440x900",1440,900,false,false,false);
  await run(browser,"portrait-390x844",390,844,true,true,false);
}catch(e){proof.failures.push({message:String(e),stack:e?.stack||""});process.exitCode=1;}
finally{
  proof.errors=diagnostics;
  await writeFile(join(output,"evidence.json"),JSON.stringify(proof,null,2)+"\n");
  if(browser)await browser.close();
  for(const p of servers)try{p.kill("SIGTERM");}catch{}
  console.log(JSON.stringify({cases:proof.cases.map(x=>x.name),failures:proof.failures,
    errors:proof.errors,output}));
}
