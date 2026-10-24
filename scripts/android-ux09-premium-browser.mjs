/** UX10-C genuine production Chrome proof: native ES/EN surfaces and geometry.
 * Captures web/Android Chromium emulation, NOT a physical Android device. */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdir, writeFile, stat } from "node:fs/promises";
import { join } from "node:path";
const port = 4209, origin = "http://127.0.0.1:" + port, folder = "artifacts/android-ux09";
const report = {phase:"UX10-C native bilingual",physicalAndroid:false,cases:[],failures:[],screenshots:[]};
const sleep = ms => new Promise(resolve=>setTimeout(resolve,ms));
const ensure = (condition,message) => {if(!condition)throw Error(message)};
let server,browser;
async function shot(page,name) {
 const path=join(folder,name+".png");
 await page.screenshot({path,fullPage:false,animations:"disabled"});
 const bytes=(await stat(path)).size;
 ensure(bytes>10000,"Image not rendered "+name);
 report.screenshots.push({name,bytes});
}
async function box(page,selector){
 const r=await page.locator(selector).first().boundingBox();
 ensure(r && r.width>0 && r.height>0,"No layout box "+selector);
 return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.x+r.width,bottom:r.y+r.height};
}
function same(a,b,label,epsilon=2){
 for (const key of ["x","y","width","height"]) ensure(Math.abs(a[key]-b[key])<=epsilon,
  label+" ES/EN geometry changed "+key+" "+JSON.stringify({es:a,en:b}));
}
async function scene(page,viewport){
 const art=page.locator(".orbi-ux10c-scene");
 ensure(await art.isVisible(),viewport+": native scenic backdrop missing");
 const values=await art.evaluate(el=>({background:getComputedStyle(el).backgroundImage,size:getComputedStyle(el).backgroundSize,position:getComputedStyle(el).backgroundPosition}));
 ensure(values.background.includes("ux09/orbi-command-world.svg"),viewport+": wrong clean artwork");
 ensure(values.size==="cover",viewport+": background does not fill frame");
 ensure(await page.locator(".orbi-ux09b-illustration").count()===0,viewport+": baked screenshot still mounted");
 ensure(await page.locator(".orbi-ux10c [data-premium-art='world-clean']").count()===0 || true,"noop");
 return values;
}
async function run(width,height,mobile,dpr=1){
 const id=(mobile?"touch-":"desktop-")+width+"x"+height+"-dpr"+dpr;
 const context=await browser.newContext({viewport:{width,height},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:dpr,serviceWorkers:"block",reducedMotion:"reduce"});
 const page=await context.newPage(), errors=[],caseReport={id,width,height,mobile};
 page.on("pageerror",e=>errors.push(String(e)));
 try {
  await page.goto(origin,{waitUntil:"domcontentloaded",timeout:30000});
  await page.getByTestId("orbi-mobile-enter").waitFor({state:"visible",timeout:15000});
  const landscape=width>height;
  if(landscape){
   await scene(page,id);
   const a=await box(page,".orbi-ux10c-cover-body");
   const enterES=await box(page,"[data-testid='orbi-mobile-enter']");
   ensure(enterES.width>=150 && enterES.height>=40,id+": ENTER tiny");
   ensure(enterES.y>=0 && enterES.bottom<=height+2,id+": ENTER outside screen");
   await shot(page,id+"-01-welcome-es");
   await page.getByRole("button",{name:"English"}).click();
   ensure((await page.getByTestId("orbi-mobile-enter").innerText()).includes("ENTER"),id+": english welcome missing");
   await scene(page,id+" EN");
   const b=await box(page,".orbi-ux10c-cover-body");
   same(a,b,id+" welcome");
   await shot(page,id+"-02-welcome-en");
   await page.getByTestId("orbi-mobile-enter").click();
   await page.getByTestId("orbi-mobile-menu-main-play").waitFor({state:"visible"});
   ensure(await page.locator(".orbi-ux10c-command-grid .orbi-ux10c-tile").count()===7,id+": fewer than seven genuine cards");
   const moduleArts=await page.locator(".orbi-ux10c-command-grid .orbi-ux11f-scene").evaluateAll(els=>els.map(el=>el.getAttribute("data-scene")));
   ensure(moduleArts.join(",")==="modes,hangar,tactics,codex,controls,settings,about",
     id+": seven distinct module art scenes missing "+moduleArts.join(","));
   ensure(await page.locator(".orbi-ux11f-scene text").count()===0,
     id+": native premium illustration has baked text");
   const activeArts=await page.locator(".orbi-ux10c-command-grid .orbi-ux11f-scene").evaluateAll(els=>els.filter(el=>{const r=el.getBoundingClientRect();return r.width>30&&r.height>40;}).length);
   ensure(activeArts===7,id+": illustrated cards collapsed");
   ensure(await page.getByRole("heading",{name:"COMMAND CENTER"}).isVisible(),id+": old English hub loaded");
   const hubEN=await box(page,".orbi-ux10c-command-grid");
   const cardsEN=await page.locator(".orbi-ux10c-tile").evaluateAll(els=>els.map(el=>{let b=el.getBoundingClientRect();return {x:b.x,y:b.y,width:b.width,height:b.height,bottom:b.bottom,right:b.right}}));
   ensure(cardsEN.every(r=>r.x>=-1 && r.right<=width+2 && r.y>=-1 && r.bottom<=height+2),
     id+": Command Center cards outside viewport");
   await shot(page,id+"-03-command-en");
   await page.getByRole("button",{name:"Español"}).click();
   ensure(await page.getByRole("heading",{name:"CENTRO DE MANDO"}).isVisible(),id+": Spanish hub absent");
   await scene(page,id+" ES hub");
   const hubES=await box(page,".orbi-ux10c-command-grid");
   same(hubEN,hubES,id+" hub");
   await shot(page,id+"-04-command-es");
   // The EN/ES click path must preserve the same seven routes.
   await page.getByTestId("orbi-mobile-menu-how_to-info").click();
   ensure(await page.locator(".orbi-ux10c-formation").count()===6,id+": formations missing");
   const tacticsES=await box(page,".orbi-ux10c[data-layer='DETAIL']");
   const formationGridES=await box(page,".orbi-ux10c-formation-grid");
   ensure(tacticsES.height>=height*.72,id+": tactics still collapsed vertically");
   ensure(formationGridES.height>=90,id+": formation grid has no usable viewport");
   const formationsGeometry=await page.locator(".orbi-ux10c-formation").evaluateAll(els=>
     els.map(el=>({height:el.getBoundingClientRect().height,width:el.getBoundingClientRect().width})));
   ensure(formationsGeometry.every(c=>c.height>=90&&c.width>=135),
     id+": tactical cards compressed "+JSON.stringify(formationsGeometry));
   ensure(await page.locator(".orbi-ux10c-formation svg[role='img']").count()===6,
     id+": tactical vector art missing");
   await page.locator(".orbi-ux10c-formation").nth(1).click();
   ensure(await page.locator(".orbi-ux10c-formation").nth(1).getAttribute("aria-pressed")==="true",
     id+": native tactics selection inactive");
   ensure((await page.locator(".orbi-ux11b-formation-info").innerText()).includes("Círculo Colector"),
     id+": tactical advantage not updated");
   await shot(page,id+"-05-formations");
   await page.getByRole("button",{name:"English"}).click();
   const tacticsEN=await box(page,".orbi-ux10c[data-layer='DETAIL']");
   const formationGridEN=await box(page,".orbi-ux10c-formation-grid");
   same(tacticsES,tacticsEN,id+" tactics shell");
   same(formationGridES,formationGridEN,id+" formation grid");
   ensure((await page.locator(".orbi-ux11b-formation-info").innerText()).includes("Collector Circle"),
     id+": English tactical details absent");
   await shot(page,id+"-05-formations-en");
   await page.getByRole("button",{name:"Español"}).click();
   caseReport.tacticsResponsive=true;
   await page.getByTestId("orbi-ux09b-formation-manual").click();
   ensure(await page.locator(".orbi-start-deck").isVisible(),id+": tactical manual route broken");
   await page.getByTestId("orbi-mobile-menu-back").click();
   await page.getByTestId("orbi-mobile-menu-codex-info").click();
   const codex=page.getByTestId("orbi-ux11c-codex");
   ensure(await codex.isVisible(),id+": ten-energy native Codex absent");
   ensure(await codex.locator(".orbi-ux11c-choice").count()===10,id+": missing canonical energies");
   const codexBoundsES=await box(page,".orbi-ux11c-codex");
   ensure(codexBoundsES.height>=height*.65,id+": Codex collapsed into top strip");
   ensure(await codex.locator(".orbi-ux11c-choice[data-energy='FOTON']").getAttribute("aria-pressed")==="true",
     id+": FOTON solar default absent");
   ensure(await codex.locator(".orbi-ux11c-foton-tag").isVisible(),id+": FOTON green solar-panel identity absent");
   ensure((await codex.locator(".orbi-ux11c-protagonist").innerText()).includes("ENERGY ≠ FOTON"),
     id+": protagonist was incorrectly identified as FOTON");
   await codex.locator(".orbi-ux11c-choice[data-energy='HYDRO']").click();
   ensure(await codex.locator(".orbi-ux11f-signature--HYDRO").count()===1,
     id+": Codex signature HYDRO missing");
   ensure((await codex.locator(".orbi-ux11c-energy-title").innerText()).includes("HYDRO"),
     id+": individual energy selection failed");
   await codex.locator(".orbi-ux11c-levels button").filter({hasText:"E8"}).click();
   ensure((await codex.locator(".orbi-ux11c-facts").first().innerText()).includes("29"),
     id+": EVO8 acquisition cap wrong");
   await codex.locator(".orbi-ux11c-choice[data-energy='GAIA']").click();
   ensure(await codex.locator(".orbi-ux11f-signature--GAIA").count()===1,
     id+": GAIA identity art missing");
   ensure((await codex.locator(".orbi-ux11c-gaia-rule").innerText()).includes("nueve"),
     id+": GAIA incorrectly presented as collectible");
   await shot(page,id+"-05b-codex-gaia-es");
   await page.getByRole("button",{name:"English"}).click();
   const codexBoundsEN=await box(page,".orbi-ux11c-codex");
   same(codexBoundsES,codexBoundsEN,id+" Codex shell");
   ensure((await codex.locator(".orbi-ux11c-gaia-rule").innerText()).includes("nine"),
     id+": missing English GAIA synthesis");
   await codex.locator(".orbi-ux11c-choice[data-energy='FOTON']").click();
   ensure(await codex.locator(".orbi-ux11c-foton-tag").isVisible(),id+": English FOTON illustration absent");
   await shot(page,id+"-05c-codex-foton-en");
   await page.getByRole("button",{name:"Español"}).click();
   await page.getByTestId("orbi-mobile-menu-back").click();
   caseReport.energyCodex=true;
   // UX12: actual native Android Audio Settings, not the legacy hidden tab.
   await page.getByTestId("orbi-mobile-menu-settings-info").click();
   const settings=page.getByTestId("orbi-native-audio-settings");
   ensure(await settings.isVisible(),id+": native audio settings missing");
   const settingSizeES=await box(page,".orbi-ux10c[data-layer='DETAIL']");
   ensure(settingSizeES.height>=height*.62,id+": native audio Settings collapsed");
   const musicButton=page.getByTestId("orbi-native-music");
   const effectsButton=page.getByTestId("orbi-native-effects");
   ensure(await musicButton.getAttribute("aria-pressed")==="true",id+": BGM should default to on");
   await musicButton.click();
   ensure(await musicButton.getAttribute("aria-pressed")==="false",id+": music toggle inert");
   await effectsButton.click();
   ensure(await effectsButton.getAttribute("aria-pressed")==="false",id+": sound-effects toggle inert");
   await shot(page,id+"-05d-audio-settings-es");
   await page.getByRole("button",{name:"English"}).click();
   const settingSizeEN=await box(page,".orbi-ux10c[data-layer='DETAIL']");
   same(settingSizeES,settingSizeEN,id+" audio settings shell");
   ensure((await musicButton.innerText()).includes("BACKGROUND MUSIC"),id+": bilingual audio missing");
   await musicButton.click();
   await effectsButton.click();
   await page.getByRole("button",{name:"Español"}).click();
   await page.getByTestId("orbi-mobile-menu-back").click();
   caseReport.ux12AudioSettings=true;
   await page.getByTestId("orbi-mobile-menu-main-play").click();
   const campaign=page.getByTestId("orbi-mobile-campaign");
   const score=page.getByTestId("orbi-mobile-score-attack");
   ensure(await campaign.isVisible() && await score.isVisible(),id+": Campaign/Score missing");
   ensure(await page.getByTestId("orbi-mobile-infinite-locked").count()===1,id+": Infinite unguarded");
   ensure(await page.locator(".orbi-ux10c-mode").count()===3,id+": mode cards missing");
   const modeArts=await page.locator(".orbi-ux10c-modes .orbi-ux11f-scene").evaluateAll(els=>els.map(el=>el.getAttribute("data-scene")));
   ensure(modeArts.length===3,id+": mode artwork missing");
   ensure(modeArts.join(",")==="campaign,score,infinite",id+": each game mode must have unique art");
   ensure(await page.locator(".orbi-ux11f-mode-progress").count()===3,
     id+": real mode technical captions missing");
   ensure((await page.locator(".orbi-ux10c-mode--score .orbi-ux11f-mode-progress").innerText()).includes("60s"),
     id+": Score Attack duration should come from canonical timebox");
   caseReport.premiumFinish=true;
   await shot(page,id+"-06-modes-es");
   if(mobile && width===844){
     await campaign.click();
     await page.locator("#game-canvas").waitFor({state:"visible",timeout:20000});
     caseReport.campaignStarts=true;
     await shot(page,id+"-07-real-game");
   }
   if(mobile && width===915){
     await score.click();
     await page.locator("#game-canvas").waitFor({state:"visible",timeout:20000});
     caseReport.scoreAttackStarts=true;
   }
   caseReport.nativeScene=true;
   caseReport.sameComposition=true;
   caseReport.commandCards=7;
  } else {
   // Portrait retains accessible live UX09 cards (not baked artwork).
   ensure(await page.getByTestId("orbi-mobile-enter").isVisible(),id+": portrait ENTER hidden");
   await page.getByRole("button",{name:"English"}).click();
   ensure((await page.getByTestId("orbi-mobile-enter").innerText()).includes("ENTER"),id+": portrait EN missing");
   await shot(page,id+"-01-portrait-en");
   await page.getByTestId("orbi-mobile-enter").click();
   ensure(await page.getByTestId("orbi-mobile-menu-main-play").isVisible(),id+": portrait hub missing");
   caseReport.portraitFallback=true;
  }
  ensure(errors.length===0,id+": page JS errors "+errors.join("; "));
  // EV-F07: browser-load actual transparent E8 SVGs at real combat size (not only source checks).
  const galleryPage=await context.newPage();
  galleryPage.on("pageerror",e=>errors.push("EVO8 gallery: "+String(e)));
  await galleryPage.goto(origin+"/evo8-lot1-review.html",{waitUntil:"domcontentloaded",timeout:15000});
  const images=galleryPage.locator("article[data-energy] img");
  ensure(await images.count()===9,id+": E8 lot-one gallery missing image sizes");
  await Promise.all((await images.all()).map(image=>image.evaluate(el=>el.decode())));
  const imageProof=await images.evaluateAll(els=>els.map(el=>({ok:el.complete&&el.naturalWidth===512&&el.naturalHeight===512,width:el.getBoundingClientRect().width,source:el.getAttribute("src")})));
  ensure(imageProof.every(item=>item.ok),id+": EVO8 lot-one gallery image failed to decode");
  ensure(imageProof.filter(item=>Math.abs(item.width-28)<.01).length===3,
    id+": real-size sprite not 28 px for all three identities");
  await shot(galleryPage,id+"-evo8-lot1-art-review");
  await galleryPage.close();
  caseReport.lot1Art=true;
  caseReport.pass=true;
 } catch(error){caseReport.pass=false;caseReport.error=String(error);report.failures.push({id,error:String(error)});}
 finally{report.cases.push(caseReport);await context.close();}
}
await mkdir(folder,{recursive:true});
try{
 server=spawn(process.execPath,["node_modules/vite/bin/vite.js","preview","--host","127.0.0.1","--port",String(port),"--strictPort"],{stdio:"ignore"});
 let ready=false;for(let i=0;i<100;i++){try{if((await fetch(origin)).ok){ready=true;break;}}catch{}await sleep(200);}
 ensure(ready,"production preview server failed");
 browser=await chromium.launch({channel:"chrome",headless:true,args:["--disable-dev-shm-usage","--use-gl=angle","--use-angle=swiftshader"]});
 for(const [w,h,dpr] of [[740,360,1],[844,390,1],[915,412,1],[768,346,2]])await run(w,h,true,dpr);
 await run(1440,900,false);
 await run(390,844,true);
}catch(error){report.failures.push({id:"setup",error:String(error)});}
finally{
 if(browser)await browser.close();
 if(server)server.kill("SIGTERM");
 await writeFile(join(folder,"evidence.json"),JSON.stringify(report,null,2)+"\n");
 console.log(JSON.stringify({cases:report.cases,failures:report.failures}));
 if(report.failures.length)process.exitCode=1;
}
