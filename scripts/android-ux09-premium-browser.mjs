/** UX09 proof: actual Chromium render of the production build (not device certification). */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdir, writeFile, stat } from "node:fs/promises";
import { join } from "node:path";
const port=4209, origin="http://127.0.0.1:"+port, folder="artifacts/android-ux09";
const report={mainReference:"7 approved UX09 user screenshots; vector reinterpretation",physicalAndroid:false,cases:[],failures:[],screenshots:[]};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const ensure=(condition,message)=>{if(!condition) throw Error(message)};
let server,browser;
async function snap(page,name) {
 const path=join(folder,name+".png");
 await page.screenshot({path,fullPage:false,animations:"disabled"});
 const bytes=(await stat(path)).size;
 ensure(bytes>10000,"Screenshot not rendered: "+name);
 report.screenshots.push({name,bytes});
}
async function rect(page,sel){return page.locator(sel).first().evaluate(el=>{const b=el.getBoundingClientRect();return {x:b.x,y:b.y,width:b.width,height:b.height,bottom:b.bottom,right:b.right}});}
async function run(width,height,mobile,dpr=1){
 const id=(mobile?"touch-":"desktop-")+width+"x"+height+"-dpr"+dpr;
 const ctx=await browser.newContext({viewport:{width,height},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:dpr,serviceWorkers:"block",reducedMotion:"reduce"});
 const page=await ctx.newPage(),errors=[],caseReport={id,width,height,mobile};
 page.on("pageerror",e=>errors.push(String(e)));
 try {
  await page.goto(origin,{waitUntil:"domcontentloaded",timeout:30000});
  await page.getByTestId("orbi-mobile-enter").waitFor({state:"visible"});
  ensure(await page.locator(".orbi-ux09-scene").isVisible(),id+": scene absent");
  const img=await page.locator(".orbi-ux09-scene").evaluate(el=>getComputedStyle(el).backgroundImage);
  ensure(img.includes("orbi-command-world.svg"),id+": missing backdrop");
  caseReport.welcome=await rect(page,".orbi-ux09-identity");
  caseReport.enter=await rect(page,"[data-testid='orbi-mobile-enter']");
  ensure(caseReport.enter.width>=180&&caseReport.enter.height>=40,id+": start button too small");
  ensure(caseReport.enter.y>=0&&caseReport.enter.bottom<=height+2,id+": enter clipped");
  await snap(page,id+"-01-welcome");
  await page.getByTestId("orbi-mobile-enter").click();
  await page.getByTestId("orbi-mobile-menu-main-play").waitFor({state:"visible"});
  ensure(await page.locator(".orbi-ux09-command-grid .orbi-ux09-tile").count()===7,id+": missing command tile");
  caseReport.tiles=await page.locator(".orbi-ux09-command-grid .orbi-ux09-tile").count();
  await snap(page,id+"-02-hub");
  await page.getByTestId("orbi-mobile-menu-main-play").click();
  await page.getByTestId("orbi-mobile-campaign").waitFor({state:"visible"});
  ensure(await page.getByTestId("orbi-mobile-score-attack").isVisible(),id+": Score Attack hidden");
  ensure(await page.getByTestId("orbi-mobile-infinite-locked").count()===1,id+": Infinite incorrectly unlocked");
  caseReport.modeCards=await page.locator(".orbi-ux09-mode-card").count();
  ensure(caseReport.modeCards===3,id+": mode count not three");
  await snap(page,id+"-03-modes");
  await page.getByTestId("orbi-mobile-menu-back").click();
  await page.getByTestId("orbi-mobile-menu-codex-info").click();
  ensure(await page.locator(".orbi-premium-entry").getAttribute("data-mobile-tab")==="CODEX",id+": codex route");
  await snap(page,id+"-04-codex");
  await page.getByTestId("orbi-mobile-menu-back").click();
  await page.getByTestId("orbi-mobile-menu-main-play").click();
  if(mobile&&width===844) {
    await page.getByTestId("orbi-mobile-campaign").click();
    await page.locator("#game-canvas").waitFor({state:"visible",timeout:20000});
    caseReport.campaignStarts=true;
    await snap(page,id+"-05-real-game");
  }
  if(mobile&&width===915){
    await page.getByTestId("orbi-mobile-score-attack").click();
    await page.locator("#game-canvas").waitFor({state:"visible",timeout:20000});
    caseReport.scoreAttackStarts=true;
  }
  ensure(errors.length===0,id+": JS errors "+errors.join("; "));
  caseReport.pass=true;
 } catch(e){caseReport.pass=false;caseReport.error=String(e);report.failures.push({id,error:String(e)})}
 finally {report.cases.push(caseReport);await ctx.close();}
}
await mkdir(folder,{recursive:true});
try{
 server=spawn(process.execPath,["node_modules/vite/bin/vite.js","preview","--host","127.0.0.1","--port",String(port),"--strictPort"],{stdio:"ignore"});
 let ready=false;
 for(let i=0;i<100;i++){try{if((await fetch(origin)).ok){ready=true;break}}catch{}await sleep(200)}
 ensure(ready,"Production Vite preview not ready");
 browser=await chromium.launch({channel:"chrome",headless:true,args:["--disable-dev-shm-usage","--use-gl=angle","--use-angle=swiftshader"]});
 for(const [w,h,dpr] of [[740,360,1],[844,390,1],[915,412,1],[768,346,2]])await run(w,h,true,dpr);
 await run(1440,900,false);
 await run(390,844,true);
}catch(e){report.failures.push({id:"setup",error:String(e)})}
finally {
 if(browser)await browser.close();
 if(server)server.kill("SIGTERM");
 await writeFile(join(folder,"evidence.json"),JSON.stringify(report,null,2)+"\n");
 console.log(JSON.stringify({cases:report.cases,failures:report.failures}));
 if(report.failures.length)process.exitCode=1;
}