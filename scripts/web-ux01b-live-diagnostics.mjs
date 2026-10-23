/** Diagnostic-only real-time Chromium of deployed Vercel production.
 * Intentional wall clock: previous UX01 tests froze browser time before first full wave.
 * Does not edit simulation, enemy health, score or data in page. */
import {chromium} from "playwright";
import {mkdir,writeFile,stat} from "node:fs/promises";
import {join} from "node:path";

const live = "https://orbi-energy-swarm-orbi4.vercel.app/?utm_source=chatgpt.com";
const output = process.env.ORBI_LIVE_DIAG_OUTPUT || "artifacts/web-ux01b";
const report = {live,caseResults:[],errors:[],failures:[],realTime:true};
const sleep = ms=>new Promise(r=>setTimeout(r,ms));
let browser;
async function snapshot(page,label,result) {
  const state=await page.evaluate(()=>{
    const root=document.querySelector(".orbi-game-root");
    const canvas=document.querySelector("#game-canvas");
    const hud=document.querySelector(".orbi-game-hud");
    const visible=el=>el instanceof Element && !!el.getClientRects().length &&
      getComputedStyle(el).display!=="none" && getComputedStyle(el).visibility!=="hidden";
    let fingerprint=null;
    if(canvas instanceof HTMLCanvasElement){
      try{
        const ctx=canvas.getContext("2d",{willReadFrequently:true});
        const w=canvas.width,h=canvas.height;
        if(ctx&&w&&h){
          const pixels=ctx.getImageData(Math.floor(w*.4),Math.floor(h*.4),
            Math.max(1,Math.floor(w*.2)),Math.max(1,Math.floor(h*.2))).data;
          let cyan=0, nonblack=0, hash=2166136261;
          for(let i=0;i<pixels.length;i+=4){const r=pixels[i],g=pixels[i+1],b=pixels[i+2];
            if(b>80&&g>r*1.25&&b>r*1.3)cyan++;
            if(r+g+b>100)nonblack++;
            hash=Math.imul(hash ^ r,16777619);hash=Math.imul(hash ^ g,16777619);
            hash=Math.imul(hash ^ b,16777619);}
          fingerprint={cyan,nonblack,hash:hash>>>0};
        }
      }catch(e){fingerprint={error:String(e)}}
    }
    return {rootPresent:!!root,appClasses:root?.getAttribute("class"),
      attrs:root?Object.fromEntries([...root.attributes].filter(a=>a.name.startsWith("data-")).map(a=>[a.name,a.value])):null,
      title:document.title,visible:document.visibilityState,focused:document.hasFocus(),
      playing:!!canvas,HUD:visible(hud),hudText:hud?.textContent?.slice(0,220),
      stageVisible:visible(canvas),fingerprint,
      pauseHeading:document.body.innerText.match(/PAUSAD[AO]|PAUSE|REANUDAR|RESUME/i)?.[0]??null,
      clickable:document.querySelectorAll("button").length,
      screen:{w:innerWidth,h:innerHeight},rafCount:window.__orbiRafCount??null};
  });
  await page.screenshot({path:join(output,label+".png"),fullPage:false,animations:"disabled"});
  result.states.push({label,...state});
}
async function scenario(name,serviceWorkers) {
  const context=await browser.newContext({viewport:{width:1728,height:850},
    deviceScaleFactor:1,serviceWorkers,hasTouch:false,reducedMotion:"no-preference"});
  const page=await context.newPage(), info={name,states:[],errors:[],requests:[]};
  page.on("pageerror",e=>info.errors.push({type:"pageerror",error:String(e),stack:e.stack?.slice(0,1500)}));
  page.on("console",m=>{if(m.type()==="error")info.errors.push({type:"console",message:m.text().slice(0,700)})});
  page.on("requestfailed",r=>info.requests.push({url:r.url(),failed:r.failure()}));
  await page.addInitScript(()=>{window.__orbiRafCount=0;
    const original=window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame=fn=>original(t=>{window.__orbiRafCount++;fn(t)});
  });
  try {
    const response=await page.goto(live,{waitUntil:"domcontentloaded",timeout:40000});
    info.navigation={status:response?.status(),url:page.url()};
    const start=page.locator('[data-primary-start-cta="true"]');
    await start.waitFor({state:"visible",timeout:30000});
    await start.click();
    await page.locator("#game-canvas").waitFor({state:"visible",timeout:15000});
    await sleep(700);
    await snapshot(page,name+"-start",info);
    await sleep(5000);
    await snapshot(page,name+"-5s",info);
    await page.keyboard.down("d");
    await sleep(1000);
    await page.keyboard.up("d");
    await sleep(3000);
    await snapshot(page,name+"-9s-after-key",info);
    const first=info.states[0],last=info.states.at(-1);
    const failures=[];
    if(!last.rootPresent||!last.HUD||!last.stageVisible)failures.push("visible root / HUD / stage missing after 9s");
    if(last.attrs?.["data-photo-mode"]!=="false")failures.push("unexpected photo-mode");
    if(last.hudText===first.hudText)failures.push("HUD has not advanced over 9s");
    if(last.rafCount<=first.rafCount+10)failures.push("game/browser animation callbacks stopped");
    if(info.errors.length)failures.push("browser errors "+JSON.stringify(info.errors).slice(0,350));
    info.failures=failures;
    report.caseResults.push(info);
    if(failures.length) report.failures.push({scenario:name,failures});
  }catch(e){report.failures.push({scenario:name,error:String(e)});info.errors.push({type:"fatal",error:String(e)});report.caseResults.push(info)}
  finally{await context.close()}
}
await mkdir(output,{recursive:true});
try{
 browser=await chromium.launch({headless:true,args:["--disable-dev-shm-usage","--use-gl=angle","--use-angle=swiftshader"]});
 await scenario("live-sw-blocked","block");
 await scenario("live-sw-active","allow");
}catch(e){report.failures.push({type:"launch",error:String(e)});}
finally{
 if(browser)await browser.close();
 await writeFile(join(output,"live-diagnostics.json"),JSON.stringify(report,null,2)+"\n");
 console.log(JSON.stringify({cases:report.caseResults.map(x=>({name:x.name,states:x.states,errors:x.errors,
  failures:x.failures,navigation:x.navigation})),failures:report.failures}));
 if(report.failures.length)process.exitCode=1;
}
