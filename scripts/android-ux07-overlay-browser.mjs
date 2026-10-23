/** UX07: real Chrome mobile visual checks against the production build.
 * Synthetic intel/upgrade nodes check geometry only, not combat spawning.
 * Real W1 announcement is observed without bypassing any gameplay event. */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdir, writeFile, stat } from "node:fs/promises";
import { join } from "node:path";
const port=4198,origin="http://127.0.0.1:"+port,folder="artifacts/android-ux07";
const report={cases:[],screenshots:[],failures:[],physicalAndroid:false};
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const ensure=(ok,message)=>{if(!ok)throw Error(message)};
let server,browser;
async function screenshot(page,name){
 const path=join(folder,name+".png");
 await page.screenshot({path,animations:"disabled",fullPage:false});
 const bytes=(await stat(path)).size;
 ensure(bytes>12000,"Empty screenshot "+name);
 report.screenshots.push({name,bytes});
}
async function metrics(page,selector){
 return page.locator(selector).evaluate(el=>{
  const b=el.getBoundingClientRect(),s=getComputedStyle(el);
  return {x:b.x,y:b.y,width:b.width,height:b.height,bottom:b.bottom,
   pointerEvents:s.pointerEvents,overflowY:s.overflowY,scrollHeight:el.scrollHeight};
 });
}
async function run(width,height,mobile,deviceScaleFactor=1){
 const name=(mobile?"touch-":"desktop-")+width+"x"+height+"-dpr"+deviceScaleFactor;
 const context=await browser.newContext({viewport:{width,height},
  isMobile:mobile,hasTouch:mobile,deviceScaleFactor,serviceWorkers:"block",reducedMotion:"reduce"});
 const page=await context.newPage(),errors=[],evidence={name,width,height,mobile};
 page.on("pageerror",e=>errors.push(String(e)));
 try {
  await page.goto(origin,{waitUntil:"domcontentloaded",timeout:30000});
  const enter=page.getByTestId("orbi-mobile-enter");
  if(mobile && await enter.isVisible()){
   await enter.tap();
   await page.getByTestId("orbi-mobile-menu-main-play").tap();
   await page.getByTestId("orbi-mobile-campaign").tap();
  } else {
   await page.locator('[data-primary-start-cta="true"]').click();
  }
  await page.locator("#game-canvas").waitFor({state:"visible",timeout:20000});
  evidence.immersive=await page.locator(".orbi-game-root").getAttribute("data-immersive-landscape");
  evidence.web=await page.locator(".orbi-game-root").getAttribute("data-web-immersive");
  await screenshot(page,name+"-battlefield");
  if(mobile){
   ensure(evidence.immersive==="true"&&evidence.web==="false",
    name+": wrong immersive touch gate "+JSON.stringify(evidence));
   // The real first wave, never a fabricated gameplay trigger.
   await page.locator(".orbi-wave-intro-card").waitFor({state:"visible",timeout:45000});
   evidence.banner=await metrics(page,".orbi-wave-intro-card");
   evidence.bannerText=await page.locator(".orbi-wave-intro-card").innerText();
   ensure(evidence.banner.width<=421&&evidence.banner.height<=61,
    name+": oversized sector banner "+JSON.stringify(evidence.banner));
   ensure(evidence.banner.bottom<height*.55,name+": banner blocks center");
   ensure((await metrics(page,".orbi-wave-intro")).pointerEvents==="none",
    name+": notification intercepts input");
   ensure(evidence.bannerText.includes("SECTOR"),name+": lost sector label");
   evidence.sectorLabel=await metrics(page,".orbi-wave-intro-card > span");
   ensure(evidence.sectorLabel.y>=evidence.banner.y &&
      evidence.sectorLabel.bottom<=evidence.banner.bottom,
      name+": sector label clipped by banner "+JSON.stringify(evidence.sectorLabel));
   await screenshot(page,name+"-real-wave-banner");
   await page.locator(".orbi-wave-intro").waitFor({state:"hidden",timeout:12000});
   // Layout fixtures mount only the same CSS classes, outside normal game state.
   // Real gameplay is never paused/reset or altered to obtain these measurements.
   await page.evaluate(()=>{
    const root=document.querySelector(".orbi-game-root");
    const intel=document.createElement("div");
    intel.id="ux07-intel-fixture";
    intel.className="orbi-threat-intel-overlay fixed inset-0 flex items-center justify-center p-4 z-50";
    intel.innerHTML='<div class="orbi-threat-intel-dialog bg-slate-900 border border-cyan-500/40 rounded-xl p-5 max-w-md w-full shadow-2xl relative space-y-4 font-mono text-white text-xs"><div class="orbi-threat-intel-heading flex items-center gap-2 border-b border-cyan-950/60 pb-3"><h3>DRONE DE ASALTO</h3></div><div class="orbi-threat-intel-details space-y-3.5 leading-relaxed text-[11px]"><div>DESCRIPCIÓN OPERATIVA '+('Ficha operativa con datos de ataque. '.repeat(15))+'</div><div>TELÉGRAFO '+('Esquiva el proyectil enemigo. '.repeat(15))+'</div><div>RECOMENDACIÓN '+('Usa formación defensiva. '.repeat(15))+'</div></div><button class="orbi-threat-intel-continue w-full bg-cyan-500 py-2.5 rounded" type="button">ENTENDIDO - REANUDAR</button></div>';
    root.append(intel);
   });
   evidence.intel=await metrics(page,"#ux07-intel-fixture .orbi-threat-intel-dialog");
   evidence.details=await metrics(page,"#ux07-intel-fixture .orbi-threat-intel-details");
   evidence.continueButton=await metrics(page,"#ux07-intel-fixture .orbi-threat-intel-continue");
   ensure(evidence.intel.height<=Math.min(height*.58,310)+2,name+": intel too tall");
   ensure(evidence.intel.y>=0&&evidence.intel.bottom<=height+2,name+": intel clipped");
   ensure(evidence.details.overflowY==="auto",name+": intel details not scrollable");
   ensure(evidence.continueButton.height>=43,name+": continue target too small");
   await screenshot(page,name+"-intel-layout-fixture");
   await page.locator("#ux07-intel-fixture").evaluate(el=>el.remove());
  }else{
   // Desktop uses the original full-information presentation.
   await page.locator(".orbi-wave-intro-card").waitFor({state:"visible",timeout:45000});
   evidence.banner=await metrics(page,".orbi-wave-intro-card");
   ensure(evidence.web==="true",name+": desktop panoramic mode not enabled");
   ensure(evidence.banner.width>420||evidence.banner.height>77,
    name+": desktop cinematic alert was accidentally reduced");
  }
  ensure(errors.length===0,name+": JavaScript page errors "+errors.join("; "));
  evidence.pass=true;
 } catch(error){
  evidence.pass=false;evidence.error=String(error);
  report.failures.push({name,error:String(error)});
 }finally{report.cases.push(evidence);await context.close();}
}
await mkdir(folder,{recursive:true});
try{
 server=spawn(process.execPath,["node_modules/vite/bin/vite.js","preview",
  "--host","127.0.0.1","--port",String(port),"--strictPort"],{stdio:"ignore"});
 let ready=false;
 for(let i=0;i<100;i++){try{if((await fetch(origin)).ok){ready=true;break;}}catch{}await pause(200);}
 ensure(ready,"Vite production preview unavailable");
 browser=await chromium.launch({channel:"chrome",headless:true,
  args:["--disable-dev-shm-usage","--use-gl=angle","--use-angle=swiftshader"]});
 for(const [w,h] of [[740,360],[844,390],[915,412]])await run(w,h,true);
 // Physical screenshots around 1536x691 are commonly DPR2: 768x346 CSS.
 // Emulate CSS viewport separately from real output pixel resolution.
 await run(768,346,true,2);
 await run(1440,900,false);
}catch(error){report.failures.push({name:"setup",error:String(error)});}
finally{
 if(browser)await browser.close();
 if(server)server.kill("SIGTERM");
 await writeFile(join(folder,"evidence.json"),JSON.stringify(report,null,2)+"\n");
 console.log(JSON.stringify({cases:report.cases.map(x=>({name:x.name,pass:x.pass,banner:x.banner,
  intel:x.intel,error:x.error})),failures:report.failures}));
 if(report.failures.length)process.exitCode=1;
}
