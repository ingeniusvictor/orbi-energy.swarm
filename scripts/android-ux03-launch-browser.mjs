/** UX03 — authentic touch Chromium launch and Play access in Android landscape.
 * Actual screenshots before starting; production-built Vite preview, no QA mock. */
import {chromium} from "playwright";
import {spawn} from "node:child_process";
import {mkdir,writeFile,stat} from "node:fs/promises";
import {join} from "node:path";
const PORT=4197, URL="http://127.0.0.1:"+PORT;
const folder=process.env.ORBI_ANDROID_UX03_OUTPUT||"artifacts/android-ux03";
const proof={cases:[],shots:[],failures:[],realAndroidDevice:false};
const check=(v,msg)=>{if(!v)throw Error(msg)};
const sleep=t=>new Promise(done=>setTimeout(done,t));
let server,browser;
async function boot(){
 server=spawn(process.execPath,["node_modules/vite/bin/vite.js","preview","--host","127.0.0.1","--port",String(PORT),"--strictPort"],{stdio:["ignore","pipe","pipe"]});
 let logs="";
 for(const io of [server.stdout,server.stderr])io.on("data",x=>logs+=String(x).slice(-1200));
 for(let i=0;i<120;i++){try{if((await fetch(URL)).ok)return;}catch{}await sleep(200);}
 throw Error("Preview not ready "+logs.slice(-1000));
}
async function shot(page,name){
 const file=join(folder,name+".png");
 await page.screenshot({path:file,animations:"disabled",fullPage:false});
 const bytes=(await stat(file)).size;check(bytes>12000,"Screenshot empty "+name);
 proof.shots.push({name,bytes});
}
async function run(name,width,height,mobile,compact){
 const ctx=await browser.newContext({viewport:{width,height},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1,serviceWorkers:"block",reducedMotion:"reduce"});
 const page=await ctx.newPage(),errors=[];
 page.on("pageerror",e=>errors.push(String(e)));
 const data={name,width,height,compact,errors};
 try {
  await page.goto(URL,{waitUntil:"domcontentloaded",timeout:30000});
  const root=page.locator(".orbi-premium-entry");
  await root.waitFor({state:"visible",timeout:30000});
  const cta=page.locator('[data-primary-start-cta="true"]');
  await cta.waitFor({state:"attached",timeout:15000});
  if(compact){
   const metrics=await page.evaluate(()=>{
     const one=s=>document.querySelector(s)?.getBoundingClientRect();
     const deck=document.querySelector(".orbi-start-deck");
     const tabs=document.querySelector(".orbi-start-tabs");
     const root=document.querySelector(".orbi-premium-entry");
     return {viewport:{width:innerWidth,height:innerHeight},
       root:one(".orbi-premium-entry")?.toJSON(),
       deck:one(".orbi-start-deck")?.toJSON(),
       tabs:one(".orbi-start-tabs")?.toJSON(),
       button:one('[data-primary-start-cta="true"]')?.toJSON(),
       deckScrollHeight:deck?.scrollHeight,deckClientHeight:deck?.clientHeight,
       deckOverflow:getComputedStyle(deck).overflowY,
       tabsOverflow:getComputedStyle(tabs).overflowX,
       rootOverflow:getComputedStyle(root).overflowY,
       pointerCoarse:matchMedia("(pointer: coarse)").matches};
   });
   data.metrics=metrics;
   check(metrics.pointerCoarse,name+": browser did not emulate touch pointer");
   check(metrics.button&&metrics.button.height>=44,name+": play hit target too small "+JSON.stringify(metrics));
   check(metrics.button.y>=-1&&metrics.button.bottom<=height-2,name+": Play hidden below visible viewport "+JSON.stringify(metrics));
   check(metrics.deck?.height>=height*.44,name+": old 11.5rem deck cap still active "+JSON.stringify(metrics));
   check(metrics.deckOverflow==="auto"&&metrics.tabsOverflow==="auto",name+": nested deck/tabs not swipeable "+JSON.stringify(metrics));
   check(metrics.root?.height<=height+2,name+": menu exceeds Android viewport");
   await shot(page,name+"-launch-first-frame");
   // Entire navigation remains touch-operable without losing scroll to body.
   await page.locator(".orbi-start-tabs button").nth(4).tap();
   await shot(page,name+"-settings");
   await page.locator(".orbi-start-tabs button").nth(0).tap();
   const score=page.locator('[data-score-attack-start-cta="true"]');
   await score.scrollIntoViewIfNeeded({timeout:7000});
   check(await score.isVisible(),name+": Score Attack not reachable with native swipe");
   await shot(page,name+"-score-attack-reachable");
   // Return to the TOP of deck before the true mobile tap on Play.
   await page.locator(".orbi-start-deck").evaluate(el=>{el.scrollTop=0});
   await cta.tap();
  }else{
   await shot(page,name+"-desktop-or-portrait");
   await cta.click();
  }
  await page.locator("#game-canvas").waitFor({state:"visible",timeout:20000});
  const game=page.locator(".orbi-game-root");
  data.gameMode=await game.getAttribute("data-immersive-landscape");
  if(compact)check(data.gameMode==="true",name+": game should switch to immersive Android");
  check(await page.locator(".orbi-game-hud").isVisible(),name+": gameplay HUD hidden after Play");
  await shot(page,name+"-battlefield-after-play");
  check(errors.length===0,name+": page errors "+JSON.stringify(errors));
  data.pass=true;
 }catch(error){data.pass=false;data.error=String(error);proof.failures.push({name,error:String(error),stack:error?.stack?.slice(0,1800)});}
 finally{proof.cases.push(data);await ctx.close();}
}
await mkdir(folder,{recursive:true});
try{
 await boot();
 browser=await chromium.launch({channel:"chrome",headless:true,args:["--disable-dev-shm-usage","--use-gl=angle","--use-angle=swiftshader"]});
 for(const [width,height] of [[740,360],[844,390],[915,412]])await run("touch-"+width+"x"+height,width,height,true,true);
 await run("portrait-390x844",390,844,true,false);
 await run("desktop-1440x900",1440,900,false,false);
}catch(e){proof.failures.push({type:"setup",error:String(e)});}
finally{
 if(browser)await browser.close();
 if(server)server.kill("SIGTERM");
 await writeFile(join(folder,"evidence.json"),JSON.stringify(proof,null,2)+"\n");
 console.log(JSON.stringify({cases:proof.cases.map(c=>({name:c.name,pass:c.pass,metrics:c.metrics,error:c.error})),failures:proof.failures}));
 if(proof.failures.length)process.exitCode=1;
}
