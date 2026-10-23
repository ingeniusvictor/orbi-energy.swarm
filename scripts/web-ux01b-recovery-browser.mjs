/** WEB UX01B regression: actual production Chromium gameplay and recoverability,
 * including a browser with WebGL forcibly disabled before any app JS. */
import {chromium} from "playwright";
import {spawn} from "node:child_process";
import {mkdir,writeFile,stat} from "node:fs/promises";
import {join} from "node:path";

const port=4193, origin="http://127.0.0.1:"+port;
const output=process.env.ORBI_WEB_UX01B_OUTPUT || "artifacts/web-ux01b-production";
const evidence={cases:[],screenshots:[],failures:[],production:true};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let browser, server;
const check=(v,m)=>{if(!v)throw Error(m)};
async function screenshot(page,filename){
 const file=join(output,filename+".png");
 await page.screenshot({path:file,animations:"disabled",fullPage:false});
 const bytes=(await stat(file)).size;
 check(bytes>10000,filename+" screenshot blank");
 evidence.screenshots.push({filename,bytes});
}
async function boot(){
 server=spawn(process.execPath,["node_modules/vite/bin/vite.js","preview","--host",
   "127.0.0.1","--port",String(port),"--strictPort"],{stdio:["ignore","pipe","pipe"]});
 let msg="";
 for(const io of [server.stdout,server.stderr])io.on("data",data=>msg+=data.toString().slice(-1500));
 for(let i=0;i<120;i++){try{if((await fetch(origin)).ok)return;}catch{}await sleep(200);}
 throw Error("Vite production preview not ready: "+msg.slice(-1600));
}
async function run(name,width,height,denyWebgl,skewRaf=false){
 const ctx=await browser.newContext({viewport:{width,height},serviceWorkers:"block",
   reducedMotion:"reduce",deviceScaleFactor:1});
 const page=await ctx.newPage(),errors=[],consoleErrors=[],reqFailures=[];
 if(skewRaf) {
  await page.addInitScript(()=>{
   const original=window.requestAnimationFrame.bind(window);
   // Force the precise class of real browser timing regression seen in
   // live production: the first queued RAF clock is older than the
   // performance.now() origin stored at Start; later deltas stay genuine.
   window.requestAnimationFrame=cb=>original(t=>cb(t-150));
  });
 }
 page.on("pageerror",e=>errors.push(String(e)));
 page.on("console",msg=>{if(msg.type()==="error")consoleErrors.push(msg.text().slice(0,400))});
 page.on("requestfailed",req=>reqFailures.push(req.url()+" "+req.failure()));
 if(denyWebgl){
  await page.addInitScript(()=>{
   const native=HTMLCanvasElement.prototype.getContext;
   HTMLCanvasElement.prototype.getContext=function(kind,...args){
    if(["webgl","webgl2","experimental-webgl"].includes(String(kind)))return null;
    return native.call(this,kind,...args);
   };
  });
 }
 const record={name,width,height,denyWebgl,skewRaf,errors,consoleErrors,reqFailures,observed:[]};
 const state=async label=>{
  const result=await page.evaluate(()=>{
   const root=document.querySelector(".orbi-game-root");
   const h=document.querySelector(".orbi-game-hud");
   const canvas=document.querySelector("#game-canvas");
   const visible=(el)=>!!el&&el.getClientRects().length>0&&
     getComputedStyle(el).display!=="none"&&getComputedStyle(el).visibility!=="hidden";
   return {photo:root?.getAttribute("data-photo-mode"),
     immersive:root?.getAttribute("data-immersive-landscape"),
     hudVisible:visible(h),hudText:h?.innerText?.slice(0,110),
     canvasVisible:visible(canvas),
     gameButtons:document.querySelectorAll("[data-testid=orbi-estado-button]").length};
  });
  record.observed.push({label,...result});return result;
 };
 try{
  await page.goto(origin,{waitUntil:"domcontentloaded",timeout:30000});
  const start=page.locator('[data-primary-start-cta="true"]');
  await start.waitFor({state:"visible",timeout:30000});
  await start.click();
  await page.locator("#game-canvas").waitFor({state:"visible",timeout:15000});
  await sleep(700);
  const beginning=await state("starting");
  check(beginning.hudVisible&&beginning.canvasVisible,name+": game UI missing on start");
  await screenshot(page,name+"-starting");
  // Require actual W1 while allowing real Chrome rendering time to differ
  // on contended CI hosts. A frozen simulation still fails within 30 seconds.
  try {
   await page.waitForFunction(() =>
     document.querySelector(".orbi-game-hud")?.textContent?.includes("W1") === true,
     null, {timeout:30000,polling:250});
  } catch {
   const stalled=await state("w1-bounded-timeout");
   throw Error(name+": W1 never reached within 30s: "+stalled.hudText+
     "; browser errors: "+JSON.stringify(errors));
  }
  const running=await state("running");
  check(running.hudText?.includes("W1"),name+": W1 must be visible "+running.hudText);
  check(running.photo==="false",name+": photo mode appeared spontaneously");
  await page.keyboard.down("d");await sleep(550);await page.keyboard.up("d");
  await screenshot(page,name+"-real-gameplay");
  await page.keyboard.press("F10");
  await sleep(2700);
  const hidden=await state("photo-after-hint-fades");
  check(hidden.photo==="true"&&!hidden.hudVisible,name+": photo mode did not hide HUD");
  const recovery=page.locator('[data-testid="orbi-web-photo-return"]');
  check(await recovery.isVisible(),name+": inaccessible after photo toolbar faded");
  const button=await recovery.boundingBox();
  check(button&&button.width>=130&&button.height>=42,name+": photo exit hit target too small");
  await screenshot(page,name+"-photo-recovery");
  await recovery.click();
  await sleep(300);
  const paused=await state("returned-to-pause");
  check(paused.photo==="false"&&paused.hudVisible,name+": returning from photo did not show normal HUD");
  check(await page.locator("#photo-mode-exit").count()===0,name+": transient photo panel leaked");
  await page.keyboard.press("p");
  await sleep(450);
  const resumed=await state("resumed");
  check(resumed.hudVisible&&resumed.canvasVisible,name+": game could not resume");
  check(errors.length===0,name+": runtime pageerrors "+JSON.stringify(errors));
  // THREE emits its single expected WebGL-init console.error on intentional GPU denial.
  if(denyWebgl)check(consoleErrors.every(x=>/WebGL|THREE/.test(x)),
    name+": unexpected console error "+JSON.stringify(consoleErrors));
  else check(!consoleErrors.length,name+": console error "+JSON.stringify(consoleErrors));
  check(!reqFailures.length,name+": request failed "+JSON.stringify(reqFailures));
  record.pass=true;
  evidence.cases.push(record);
 }catch(e){
  record.pass=false;record.reason=String(e);
  evidence.failures.push({name,reason:String(e),stack:e?.stack?.slice(0,1500)});
  evidence.cases.push(record);
 }finally{await ctx.close();}
}
await mkdir(output,{recursive:true});
try{
 await boot();
 browser=await chromium.launch({channel:"chrome",headless:true,
   args:["--disable-dev-shm-usage","--use-gl=angle","--use-angle=swiftshader"]});
 await run("desktop-real-chrome",1728,850,false);
 await run("desktop-no-webgl-fallback",1728,850,true);
 await run("desktop-negative-raf-timestamp",1728,850,false,true);
} catch(e){evidence.failures.push({scope:"init",reason:String(e)});}
finally{
 if(browser)await browser.close();
 if(server)server.kill("SIGTERM");
 await writeFile(join(output,"evidence.json"),JSON.stringify(evidence,null,2)+"\n");
 console.log(JSON.stringify({cases:evidence.cases.map(x=>({name:x.name,pass:x.pass,observed:x.observed,
  errors:x.errors,consoleErrors:x.consoleErrors,reason:x.reason})),failures:evidence.failures}));
 if(evidence.failures.length)process.exitCode=1;
}
