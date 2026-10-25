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
async function caseDelta(w,h,dpr) {
 const name="delta30-"+w+"x"+h+"-dpr"+dpr;
 const context=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:dpr,hasTouch:w<1000,isMobile:w<1000,serviceWorkers:"block",reducedMotion:"reduce"});
 const page=await context.newPage(),errors=[];
 page.on("pageerror",e=>errors.push(String(e)));
 try {
  await page.goto(origin,{waitUntil:"domcontentloaded",timeout:40000});
  const result=await page.evaluate(async({w,h})=>{
   const {calculateSwarmOffset}=await import("/src/game/formations.ts");
   const {drawSwarmRoster}=await import("/src/game/EnergySwarmCanvas.tsx");
   const {getOrbiEnergyDefinition}=await import("/src/game/orbiEnergyCanon.ts");
   const {FormationType,OrbiType}=await import("/src/game/types.ts");
   const ids=["FOTON","HYDRO","AERO","TERMO","MAGNE","ATON","KINETRIX","H2NOVA","QUANTUM"];
   const positions=Array.from({length:30},(_,i)=>calculateSwarmOffset(FormationType.SCATTERED,i,30,0,0));
   let minDistance=Infinity;
   for(let i=0;i<30;i++)for(let j=i+1;j<30;j++)
    minDistance=Math.min(minDistance,Math.hypot(positions[i].x-positions[j].x,positions[i].y-positions[j].y));
   if(minDistance<30)throw Error("Nominal 2px E8 solid margin violated: "+minDistance);
   const canvas=document.createElement("canvas");canvas.id="delta-proof-canvas";canvas.width=w;canvas.height=h;
   Object.assign(canvas.style,{position:"fixed",inset:"0",width:w+"px",height:h+"px",zIndex:"2147483000"});
   document.body.append(canvas);
   const ctx=canvas.getContext("2d");if(!ctx)throw Error("Canvas2D unavailable");
   ctx.fillStyle="#030a1b";ctx.fillRect(0,0,w,h);
   const cx=w/2,cy=h/2;
   ctx.fillStyle="#f9ce61";ctx.beginPath();ctx.arc(cx,cy,17,0,Math.PI*2);ctx.fill();
   ctx.fillStyle="#0d1824";ctx.beginPath();ctx.arc(cx,cy,13,0,Math.PI*2);ctx.fill();
   ctx.strokeStyle="rgba(32,225,255,.22)";
   // Actual concentric triangles, with points drawn through the GAME renderer.
   for(const radius of [35,95,155]){
    ctx.beginPath();
    for(let c=0;c<3;c++){
     const a=-Math.PI/2+c*Math.PI*2/3;
     const x=cx+Math.cos(a)*radius,y=cy+Math.sin(a)*radius;
     if(c===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
    ctx.closePath();ctx.stroke();
   }
   const members=positions.map((point,index)=>{
    const id=index===29?"GAIA":ids[index%ids.length],def=getOrbiEnergyDefinition(id);
    const x=cx+point.x,y=cy+point.y;
    return {id:"delta-proof-"+index,type:OrbiType.BEAM,name:id,
    x,y,targetX:x+20,targetY:y,color:def.color,size:10.5,
    shootCooldown:40,affinity:def.affinity,combatRole:def.combatRole,energyId:id,
    attackSignature:def.attackSignature,personality:"QA",evolutionStage:4,level:8,xp:28};
   });
   drawSwarmRoster(ctx,members,0);
   ctx.font="bold "+(w<1000?10:14)+"px monospace";
   ctx.fillStyle="#ffffff";ctx.fillText("EV-F08 | DELTA CONCENTRICA · 30 E8",10,16);
   ctx.font=(w<1000?8:10)+"px monospace";ctx.fillText("PRUEBA GEOMETRICA - NO COMBATE REAL",10,31);
   ctx.fillText("Dist min centros: "+minDistance.toFixed(2)+" / requerido >=30",10,h-8);
   return {count:members.length,gaia:members.filter(x=>x.energyId==="GAIA").length,minDistance,solidTipRadius:14};
  },{w,h});
  const path=join(folder,name+".png");
  await page.locator("#delta-proof-canvas").screenshot({path});
  const bytes=(await stat(path)).size;
  if(bytes<5000)throw Error("Blank delta screenshot: "+name);
  if(errors.length)throw Error("JS page error: "+errors.join("; "));
  report.cases.push({name,w,h,dpr,mode:"30-synthetic-E8-delta",success:true,bytes,...result});
 }catch(e){report.failures.push({name,error:String(e)});report.cases.push({name,success:false});}
 finally{await context.close();}
}


/** UX13 synthetic encounter visual test: real WebP bytes through actual Canvas
 * enemy renderer and effects, NOT live wave combat or physical Android QA. */
async function casePremiumEnemies(w,h,dpr){
 const name="premium-enemies-"+w+"x"+h+"-dpr"+dpr;
 const context=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:dpr,isMobile:w<1000,hasTouch:w<1000,serviceWorkers:"block",reducedMotion:"reduce"});
 const page=await context.newPage(),errors=[];
 page.on("pageerror",e=>errors.push(String(e)));
 try {
   await page.goto(origin,{waitUntil:"domcontentloaded",timeout:40000});
   const result=await page.evaluate(async ({w,h})=>{
      const {drawEnemiesList}=await import("/src/game/EnergySwarmCanvas.tsx");
      const {EnemyType}=await import("/src/game/types.ts");
      const {projectFlashAccessibility}=await import("/src/game/flashAccessibility.ts");
      const {
        prewarmPremiumEnemySprites, getPremiumEnemySpriteState,resolvePremiumEnemySpriteUrl,
      }=await import("/src/game/premiumEnemySprites.ts");
      const types=[EnemyType.BLACKOUT_ELITE,EnemyType.DISRUPTOR,EnemyType.BOSS_DEVOURER];
      for(const id of types){
        const url=resolvePremiumEnemySpriteUrl(id);
        if(!url)throw Error("No sprite route "+id);
        const response=await fetch(url);
        if(!response.ok || !(response.headers.get("content-type")||"").includes("image/webp"))
          throw Error("WebP unavailable "+id+": "+response.status);
      }
      prewarmPremiumEnemySprites("/");
      for(let attempt=0;attempt<120;attempt++){
        if(types.every(id=>getPremiumEnemySpriteState(id)==="ready"))break;
        if(types.some(id=>getPremiumEnemySpriteState(id)==="error"))throw Error("Image decode failed");
        await new Promise(resolve=>setTimeout(resolve,30));
      }
      if(!types.every(id=>getPremiumEnemySpriteState(id)==="ready"))throw Error("WebP prewarm timed out");
      const canvas=document.createElement("canvas");canvas.id="premium-enemies-proof";canvas.width=w;canvas.height=h;
      Object.assign(canvas.style,{position:"fixed",inset:"0",zIndex:"2147483000",width:w+"px",height:h+"px"});
      document.body.append(canvas);
      const ctx=canvas.getContext("2d");
      if(!ctx)throw Error("missing canvas");
      ctx.fillStyle="#04091a";ctx.fillRect(0,0,w,h);
      ctx.fillStyle="#b4e9f5";ctx.font="bold "+(w<1000?11:19)+"px monospace";
      ctx.fillText("UX13 · TRES WEBP REALES · MISMO MOTOR DE COMBATE",9,24);
      ctx.font="bold "+(w<1000?8:12)+"px monospace";
      ctx.fillText("PREVIEW SINTÉTICA — NO ES UNA PARTIDA REAL",9,40);
      const vertical=w<h;
      const labels=["BLINDADO","DISRUPTOR DE GRAVEDAD","JEFE SWARM"];
      const positions=types.map((_,i)=>vertical
        ? {x:w/2,y:115+(h-150)*(i+.5)/3}
        : {x:w*(i+.5)/3,y:h*.58});
      const enemies=types.map((type,i)=>({
        id:"ux13-proof-"+i,type,x:positions[i].x,y:positions[i].y,
        vx:.3,vy:.8,health:i===2?750:23,maxHealth:i===2?950:45,
        size:i===2?(vertical?34:52):(vertical?17:20),speed:0,color:i===1?"#9b5ff6":"#ef4444",
        shootCooldown:i===1?35:70,pulseCooldown:0,contactDamageCooldown:0,
        flashTicks:0,isDead:false,isBoss:i===2,chargeTimer:i===0?44:0,
      }));
      const imageDraws=[];
      const drawImage=ctx.drawImage.bind(ctx);
      ctx.drawImage=(...args)=>{imageDraws.push({width:args[3],height:args[4]});drawImage(...args);};
      drawEnemiesList(ctx,enemies,1333,{x:w*.52,y:h*.6},projectFlashAccessibility("REDUCED"));
      if(imageDraws.length!==3)throw Error("Expected 3 actual premium WebP bodies, rendered "+imageDraws.length);
      ctx.save();ctx.textAlign="center";ctx.font="bold "+(w<1000?9:16)+"px monospace";
      labels.forEach((label,i)=>{ctx.fillStyle=i===1?"#d8b4fe":"#fbd38d";
        const below=positions[i].y+enemies[i].size*(i===2?1.9:2.3);
        ctx.fillText(label,positions[i].x,Math.min(h-20,below));});
      ctx.restore();
      return {count:types.length,imageDraws,labels,source:"3 decoded local WebP, Canvas2D real renderer"};
   },{w,h});
   const path=join(folder,name+".png");
   await page.locator("#premium-enemies-proof").screenshot({path});
   const bytes=(await stat(path)).size;
   if(bytes<9000)throw Error("Blank premium enemies screenshot "+name);
   if(errors.length)throw Error("JS errors "+errors.join("; "));
   report.cases.push({name,success:true,bytes,...result});
 }catch(error){report.failures.push({name,error:String(error)});report.cases.push({name,success:false});}
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
 for(const [w,h,dpr] of [[740,360,1],[844,390,1],[915,412,1],[768,346,2],[390,844,1]])await caseDelta(w,h,dpr);
 for(const [w,h,dpr] of [[1280,720,1],[844,390,2],[390,844,2]])await casePremiumEnemies(w,h,dpr);
}catch(e){report.failures.push({name:"setup",error:String(e)})}
finally{
 if(browser)await browser.close();
 if(server)server.kill("SIGTERM");
 await writeFile(join(folder,"evidence.json"),JSON.stringify(report,null,2)+"\n");
 console.log(JSON.stringify({cases:report.cases,failures:report.failures}));
 if(report.failures.length)process.exitCode=1;
}