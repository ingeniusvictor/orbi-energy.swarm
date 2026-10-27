/**
 * PYRA-07B — six original landmark silhouettes for real Mundo Nuevo scenery.
 *
 * No Enemy, Projectile, collision, reward, game timer, random generator or
 * DOM dependencies. Travel distance is the existing world-route parallax
 * clock; the composition is deterministic and safe with reduced motion.
 */
import {type PyraSceneId} from "./pyraWorld";

export const PYRA_LANDMARK_IDENTITIES = {
  OBSIDIAN_GATE: "FRACTURED_OBSIDIAN_ARCH",
  EMBER_ESCARPMENT: "EMBER_TERRACE_FALLS",
  LAVA_CAUSEWAY: "MOLTEN_VIADUCT",
  PRESSURE_FISSURE: "PRESSURE_CHIMNEYS",
  MAGMA_SANCTUM: "MAGMA_SANCTUARY",
  CORE_CALDERA: "SOLFERNAX_CALDERA",
} as const satisfies Record<PyraSceneId,string>;

type V=readonly [number,number];
const polygon=(ctx:CanvasRenderingContext2D,points:readonly V[],
 fill:string,edge?:string):void=>{
  ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);
  for(let n=1;n<points.length;n++)ctx.lineTo(points[n][0],points[n][1]);
  ctx.closePath();ctx.fillStyle=fill;ctx.fill();
  if(edge){ctx.strokeStyle=edge;ctx.lineWidth=2;ctx.stroke();}
};
const strip=(ctx:CanvasRenderingContext2D,points:readonly V[],
 edge:string,width=2):void=>{
  ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);
  for(let n=1;n<points.length;n++)ctx.lineTo(points[n][0],points[n][1]);
  ctx.strokeStyle=edge;ctx.lineWidth=width;ctx.stroke();
};
const glow=(ctx:CanvasRenderingContext2D,x:number,y:number,r:number,
 fill:string):void=>{
  ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);
  ctx.fillStyle=fill;ctx.fill();
};
const hash=(n:number):number=>
  Math.imul((n|0)^0x6a09e667,1597334677)>>>0;
const wrap=(n:number,period:number):number=>((n%period)+period)%period;

// Every silhouette stays behind ENERGY and the native combat renderer.
// Geometry is authored in local space, ending at the basalt horizon (y=352).
function drawLandmark(ctx:CanvasRenderingContext2D,scene:PyraSceneId,
 variant:number):void{
  switch(scene){
    case "OBSIDIAN_GATE": {
      // Two fractured obelisks and a gigantic incomplete basalt portal.
      for(const side of [-1,1]){
        ctx.save();ctx.scale(side,1);
        polygon(ctx,[[92,0],[92,-138],[116,-181],[144,-160],[153,0]],
          "#1c1929","#78534c");
        polygon(ctx,[[90,-139],[106,-185],[125,-201],[128,-146]],
          "#34243c","#f97316");
        strip(ctx,[[108,-155],[118,-126],[105,-99],[121,-72]],
          "rgba(251,146,60,.72)",3);
        ctx.restore();
      }
      polygon(ctx,[[-108,-167],[-72,-207],[-25,-217],[0,-203],
        [26,-215],[73,-205],[109,-164],[85,-147],[53,-178],
        [14,-189],[-31,-186],[-83,-147]],"#242032","#d97756");
      glow(ctx,0,-170,19,"rgba(249,115,22,.28)");
      glow(ctx,0,-170,5,"#ffda7e");
      break;
    }
    case "EMBER_ESCARPMENT": {
      // Staggered slag terraces. The descending strips are background embers.
      polygon(ctx,[[-195,0],[-195,-102],[-128,-132],[-82,-102],
        [-82,-65],[-7,-85],[53,-58],[53,0]],"#38212b");
      polygon(ctx,[[12,0],[12,-119],[70,-119],[70,-171],
        [147,-177],[194,-151],[194,0]],"#2b1c28","#b45338");
      strip(ctx,[[-195,-101],[-130,-131],[-81,-102]],"#fb923c",4);
      strip(ctx,[[70,-171],[147,-177],[194,-151]],"#fdba74",3);
      for(const x of [-150,-111,-46,84,137]){
        const start=x<0?-113:-172;
        strip(ctx,[[x,start],[x+5,start+28],[x-3,start+53]],
          "rgba(253,186,116,.78)",5);
        strip(ctx,[[x+10,start+8],[x+12,start+44]],
          "rgba(249,115,22,.53)",2);
      }
      glow(ctx,90,-190,4,"#fef08a");
      break;
    }
    case "LAVA_CAUSEWAY": {
      // Suspended viaduct with triangular weight-bearing trusses.
      for(const x of [-151,131]){
        polygon(ctx,[[x-18,0],[x-22,-139],[x+17,-153],[x+25,0]],
          "#221d2d","#9a563e");
        strip(ctx,[[x-21,-138],[x+17,-152]],"#fdba74",3);
      }
      polygon(ctx,[[-189,-128],[-143,-142],[-85,-137],[-35,-147],
        [38,-144],[91,-132],[181,-141],[190,-118],[-189,-107]],
        "#30232d","#f97316");
      for(let i=-3;i<=3;i++){
        const x=i*48;
        strip(ctx,[[x,-123],[x+24,-61],[x+48,-123]],
          "rgba(251,146,60,.63)",2);
      }
      polygon(ctx,[[-181,-21],[-117,-42],[-65,-26],[-4,-55],
        [69,-23],[118,-53],[186,-25],[186,0],[-181,0]],
        "rgba(234,88,12,.34)");
      break;
    }
    case "PRESSURE_FISSURE": {
      // Three forged stacks with ringed pressure caps and hot exhaust.
      for(let i=-1;i<=1;i++){
        const x=i*116,y=-130-(variant%3)*8-(i===0?32:0);
        polygon(ctx,[[x-28,0],[x-25,y+22],[x-34,y+10],
          [x+35,y+10],[x+26,y+22],[x+29,0]],"#29202f","#824536");
        polygon(ctx,[[x-40,y+12],[x-45,y-2],[x+42,y-2],
          [x+37,y+12]],"#472635","#fb923c");
        glow(ctx,x,y-2,8,"#fdba74");
        for(let j=0;j<3;j++){
          const rise=j*23;
          glow(ctx,x+(j%2===0?-8:9),y-32-rise,12-j*2,
            "rgba(251,146,60,.18)");
        }
      }
      strip(ctx,[[-186,-31],[-109,-13],[-41,-38],[29,-13],
        [105,-36],[190,-18]],"rgba(254,215,170,.57)",3);
      break;
    }
    case "MAGMA_SANCTUM": {
      // Ancient thermomechanical colonnade and crystalline heart.
      polygon(ctx,[[-185,0],[-184,-38],[-153,-49],[159,-49],
        [186,-39],[186,0]],"#251f30","#d27b4e");
      for(const x of [-137,-69,68,138]){
        polygon(ctx,[[x-18,-43],[x-15,-154],[x,-170],
          [x+17,-155],[x+21,-43]],"#302234","#7c564b");
        glow(ctx,x,-152,4,"#ffcc88");
      }
      polygon(ctx,[[-166,-160],[0,-218],[168,-160],[149,-139],
        [0,-194],[-147,-140]],"#34243b","#e38d4a");
      polygon(ctx,[[0,-177],[32,-119],[0,-76],[-33,-119]],
        "#a3412b","#fef08a");
      glow(ctx,0,-121,10,"#ffefaf");
      for(const side of [-1,1]){
        strip(ctx,[[0,-76],[side*52,-59],[side*103,-66]],
          "rgba(251,146,60,.68)",2);
      }
      break;
    }
    case "CORE_CALDERA": {
      // A huge, broken reactor halo, separate from actual boss hitboxes.
      // It is background scenery, not a second Solfernax actor.
      const cy=-120;
      ctx.strokeStyle="rgba(251,146,60,.32)";ctx.lineWidth=19;
      ctx.beginPath();ctx.arc(0,cy,94,.20,Math.PI*1.38);ctx.stroke();
      ctx.beginPath();ctx.arc(0,cy,94,Math.PI*1.55,Math.PI*1.91);ctx.stroke();
      ctx.strokeStyle="#fb923c";ctx.lineWidth=5;
      ctx.beginPath();ctx.arc(0,cy,80,.18,Math.PI*1.39);ctx.stroke();
      ctx.beginPath();ctx.arc(0,cy,80,Math.PI*1.54,Math.PI*1.9);ctx.stroke();
      glow(ctx,0,cy,51,"rgba(194,65,12,.49)");
      glow(ctx,0,cy,31,"rgba(249,115,22,.75)");
      glow(ctx,0,cy,8,"#fef08a");
      polygon(ctx,[[-193,0],[-162,-108],[-109,-70],[-103,0]],
        "#281d2b","#b45338");
      polygon(ctx,[[106,0],[116,-81],[166,-127],[193,0]],
        "#281d2b","#b45338");
      strip(ctx,[[-163,-107],[-132,-58],[-119,0]],"#fb923c",3);
      strip(ctx,[[167,-125],[136,-67],[121,0]],"#fb923c",3);
      break;
    }
  }
}

/** Draws scenery only; positions are computed from the real route distance.
 * Camera, HP, collisions, enemy/projectile caps and pauses remain untouched.
 */
export function drawPyraSceneLandmarks(ctx:CanvasRenderingContext2D,
 scene:PyraSceneId,distance:number,width:number):void{
  if(!Number.isFinite(distance)||distance<0||!Number.isFinite(width)||
     width<800||width>2400||!(scene in PYRA_LANDMARK_IDENTITIES))
    throw new RangeError("Invalid PYRA landmark drawing arguments");
  const period=580,drift=distance*.20;
  const offset=wrap(drift,period),baseCell=Math.floor(drift/period);
  for(let cell=-1;cell<=Math.ceil(width/period)+1;cell++){
    const absoluteCell=baseCell+cell;
    const x=cell*period-offset+period*.5;
    const seed=hash(absoluteCell+3_927);
    const scale=.78+(seed%18)/100;
    ctx.save();
    ctx.translate(x,352);
    ctx.scale(scale,scale);
    drawLandmark(ctx,scene,seed%7);
    ctx.restore();
  }
  // A bounded trail of distant drifting embers, not projectiles or hazards.
  ctx.save();
  for(let i=0;i<Math.ceil(width/85)+3;i++){
    const n=hash(i+baseCell*53+1_221);
    const x=wrap(i*85+distance*.11+(n%57),width+70)-35;
    const y=56+(n%215);
    ctx.globalAlpha=.13+(n%26)/100;
    glow(ctx,x,y,1+(n%3),"#ffca83");
  }
  ctx.restore();
}
