/**
 * EV-F06 browser proof. Uses the ACTUAL canvas renderer with synthetic Orbi
 * entities, not real enemy encounters. Screenshot cases are LAYOUT ONLY.
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdir, writeFile, stat } from "node:fs/promises";
import { join } from "node:path";
const folder="artifacts/ev-f06",port=4297,origin="http://127.0.0.1:"+port;
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const report={kind:"Synthetic canvas layout proof; not an actual gameplay encounter or physical Android certification",cases:[],failures:[]};
let server,browser;
async function caseRender(w,h,dpr,mode){
 const name=mode+"-"+w+"x"+h+"-dpr"+dpr;
 const context=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:dpr,hasTouch:w<1000,isMobile:w<1000,serviceWorkers:"block",reducedMotion:"reduce"});
 const page=await context.newPage(),errors=[];
 page.on("pageerror",e=>errors.push(String(e)));
 try {
   await page.goto(origin,{waitUntil:"domcontentloaded",timeout:40000});
   const result=await page.evaluate(async ({w,h,mode})=>{
     const {drawSwarmRoster}=await import("/src/game/EnergySwarmCanvas.tsx");
     const {getOrbiEnergyDefinition}=await import("/src/game/orbiEnergyCanon.ts");
     const {getEvo8VisualStage,getEvo8WingCount}=await import("/src/game/orbiEvolution.ts");
     const {OrbiType}=await import("/src/game/types.ts");
     const allIds=["FOTON","HYDRO","AERO","TERMO","MAGNE","ATON","KINETRIX","H2NOVA","QUANTUM","GAIA"];
     const makeMember=(id,level,x,y)=>{
       const source=getOrbiEnergyDefinition(id);
       return {id:"proof_"+id+"_"+level,type:OrbiType.BEAM,
       name:id,x,y,targetX:x+20,targetY:y,
       color:source.color,size:Math.min(10.5,5+(getEvo8VisualStage(level)-1)*1.5+(level-1)*.15),
       shootCooldown:44,affinity:source.affinity,combatRole:source.combatRole,
       energyId:id,attackSignature:source.attackSignature,
       personality:"QA",evolutionStage:getEvo8VisualStage(level),level,xp:0};
     };
     document.body.style.background="#040a18";
     document.body.style.overflow="hidden";
     const c=document.createElement("canvas");
     c.id="evo8-proof-canvas";c.width=w;c.height=h;
     Object.assign(c.style,{position:"fixed",inset:"0",width:w+"px",height:h+"px",zIndex:"2147483000"});
     document.body.append(c);
     const ctx=c.getContext("2d");
     if(!ctx)throw Error("2d canvas unavailable");
     ctx.fillStyle="#030c21";ctx.fillRect(0,0,w,h);
     ctx.strokeStyle="rgba(28,195,255,.26)";
     ctx.fillStyle="#d9faff";ctx.font="bold "+(w<1000?12:17)+"px monospace";
     const levelRows=mode==="atlas"?[1,3,5,8]:mode==="hydro"?[1,2,3,4,5,6,7,8]:[8];
     const names=mode==="hydro"?["HYDRO"]:allIds;
     const columns=mode==="atlas"?4:mode==="hydro"?8:w>h?5:2;
     const rows=Math.ceil((names.length*levelRows.length)/columns);
     const head=mode==="hydro"?"HYDRO EVO8 | 8 NIVELES":mode==="atlas"?"EVO8 | 4 SILUETAS POR ENERGIA":"EVO8 | 10 ORBIS FINALES";
     ctx.fillText(head,12,23);
     ctx.font=(w<1000?8:11)+"px monospace";
     ctx.fillStyle="#a4cbe2";ctx.fillText("LAYOUT ARTIFICIAL - NO ES COMBATE REAL",12,38);
     const top=48,cellW=w/columns,cellH=(h-top)/rows;
     let rendered=0;
     for(let n=0;n<names.length;n++)for(let j=0;j<levelRows.length;j++){
       const index=n*levelRows.length+j,row=Math.floor(index/columns),column=index%columns;
       const id=names[n],level=levelRows[j],x=(column+.5)*cellW,y=top+(row+.46)*cellH;
       const member=makeMember(id,level,x,y);
       ctx.strokeStyle="rgba(85,170,210,.20)";
       ctx.strokeRect(column*cellW+3,top+row*cellH+3,cellW-6,cellH-6);
       drawSwarmRoster(ctx,[member],0);
       ctx.font="bold "+(w<1000?9:12)+"px monospace";
       ctx.fillStyle="#f1f8ff";
       ctx.textAlign="center";ctx.fillText(id+" E"+level,x,Math.min(top+(row+1)*cellH-9,y+35));
       rendered++;
       const wings=getEvo8WingCount(level);
       if((level===6&&wings!==2)||(level===7&&wings!==4)||(level===8&&wings!==6))throw Error("Wrong wings");
     }
     return {names:names.length,rendered,levels:levelRows,head};
   },{w,h,mode});
   const path=join(folder,name+".png");
   await page.locator("#evo8-proof-canvas").screenshot({path});
   const bytes=(await stat(path)).size;
   if(bytes<4000)throw Error("Blank canvas screenshot "+name);
   if(errors.length)throw Error("JS page errors "+errors.join("; "));
   report.cases.push({name,w,h,dpr,mode,success:true,bytes,...result});
 }catch(e){report.failures.push({name,error:String(e)});report.cases.push({name,success:false});}
 finally{await context.close();}
}
await mkdir(folder,{recursive:true});
try{
 server=spawn(process.execPath,["node_modules/vite/bin/vite.js","--host","127.0.0.1","--port",String(port),"--strictPort"],{stdio:"ignore"});
 let ok=false;
 for(let i=0;i<125;i++){try{if((await fetch(origin)).ok){ok=true;break}}catch{} await sleep(220)}
 if(!ok)throw Error("Vite dev server unavailable");
 browser=await chromium.launch({channel:"chrome",headless:true,args:["--disable-dev-shm-usage","--use-gl=angle","--use-angle=swiftshader"]});
 await caseRender(1440,1080,1,"atlas");
 await caseRender(1440,240,1,"hydro");
 for(const [w,h,dpr] of [[740,360,1],[844,390,1],[915,412,1],[768,346,2],[390,844,1]])await caseRender(w,h,dpr,"final");
}catch(e){report.failures.push({name:"setup",error:String(e)})}
finally{
 if(browser)await browser.close();
 if(server)server.kill("SIGTERM");
 await writeFile(join(folder,"evidence.json"),JSON.stringify(report,null,2)+"\n");
 console.log(JSON.stringify({cases:report.cases,failures:report.failures}));
 if(report.failures.length)process.exitCode=1;
}