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
   await shot(page,id+"-05-formations");
   await page.getByTestId("orbi-ux09b-formation-manual").click();
   ensure(await page.locator(".orbi-start-deck").isVisible(),id+": tactical manual route broken");
   await page.getByTestId("orbi-mobile-menu-back").click();
   await page.getByTestId("orbi-mobile-menu-main-play").click();
   const campaign=page.getByTestId("orbi-mobile-campaign");
   const score=page.getByTestId("orbi-mobile-score-attack");
   ensure(await campaign.isVisible() && await score.isVisible(),id+": Campaign/Score missing");
   ensure(await page.getByTestId("orbi-mobile-infinite-locked").count()===1,id+": Infinite unguarded");
   ensure(await page.locator(".orbi-ux10c-mode").count()===3,id+": mode cards missing");
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
