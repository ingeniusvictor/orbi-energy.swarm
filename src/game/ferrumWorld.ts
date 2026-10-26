/** FERRUM 02 — production world identity and lightweight industrial panorama.
 * Purely visual, behind the AUTHENTIC ENERGY/ORBI combat canvas.
 * The existing live route clock and physical camera are reused unchanged.
 */
export const FERRUM_WORLD_ID="FERRUM_MECHANICA" as const;
export const ASTERIA_WORLD_CHOICE="ASTERIA_ORBITAL" as const;
export type PlayableWorld=typeof FERRUM_WORLD_ID|typeof ASTERIA_WORLD_CHOICE;
export const FERRUM_SECTIONS=["GEAR_GATE","COPPER_AVENUE","FORGE_DISTRICT",
  "SKY_CRANES","ASSEMBLY_SPAN","REACTOR_VISTA"] as const;
export function ferrumSceneAt(ordinal:number):typeof FERRUM_SECTIONS[number]{
  if(!Number.isSafeInteger(ordinal)||ordinal<0)throw new RangeError("Invalid FERRUM ordinal");
  return FERRUM_SECTIONS[ordinal%FERRUM_SECTIONS.length];
}
export const isAsteria=(route:boolean,world:PlayableWorld)=>
  route&&world===ASTERIA_WORLD_CHOICE;
export const isFerrum=(route:boolean,world:PlayableWorld)=>
  route&&world===FERRUM_WORLD_ID;
const wrap=(n:number,width:number)=>((n%width)+width)%width;
const hash=(v:number)=>Math.imul(v^0x5f3759df,2654435761)>>>0;
/** Backdrop-only Canvas2D at logical 480 height, sized to panoramic viewport.
 * No collision boxes, bullets, boss entities, WebGL, remote textures or timers.
 */
export function drawFerrumWorld(
 ctx:CanvasRenderingContext2D,travel:number,width:number,segmentOrdinal:number,
):void{
  if(![travel,width,segmentOrdinal].every(Number.isFinite)||
    travel<0||width<800||width>2400||
    !Number.isSafeInteger(segmentOrdinal)||segmentOrdinal<0)
    throw new RangeError("Invalid FERRUM backdrop");
  const h=480;
  ctx.save();
  ctx.clearRect(0,0,width,h);
  const sky=ctx.createLinearGradient(0,0,0,h);
  sky.addColorStop(0,"#060c19");
  sky.addColorStop(.53,"#271f30");
  sky.addColorStop(1,"#503021");
  ctx.fillStyle=sky;ctx.fillRect(0,0,width,h);
  // Distant fixed-width gear city silhouettes, deterministic across frames.
  const unit=96;
  const slow=travel*.11;
  const shift=wrap(slow,unit);
  const first=Math.floor(slow/unit);
  for(let i=-2;i<=Math.ceil(width/unit)+2;i++){
    const index=first+i;
    const seed=hash(index+100);
    const x=i*unit-shift;
    const height=95+(seed%140);
    ctx.fillStyle=index%3===0?"#202233":"#172433";
    ctx.fillRect(x,320-height,unit-6,height+100);
    ctx.fillStyle="#fbbf24";
    ctx.globalAlpha=.13;
    for(let y=320-height+18;y<320;y+=27)
      for(let k=11;k<unit-9;k+=26)
        if((hash(seed+y+k)%4)!==0)ctx.fillRect(x+k,y,6,9);
    ctx.globalAlpha=1;
  }
  // Distant industrial cranes and suspended catwalks travel slightly faster.
  const midShift=wrap(travel*.29,290);
  const firstCrane=Math.floor(travel*.29/290);
  for(let i=-1;i<Math.ceil(width/290)+2;i++){
    const x=i*290-midShift;
    const id=hash(firstCrane+i);
    const mastHeight=175+id%45;
    ctx.strokeStyle="rgba(194,123,70,.48)";ctx.lineWidth=6;
    ctx.beginPath();ctx.moveTo(x+76,337);ctx.lineTo(x+76,337-mastHeight);
    ctx.lineTo(x+230,337-mastHeight);ctx.stroke();
    ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(x+135,337-mastHeight);
    ctx.lineTo(x+135,337-mastHeight+68);ctx.stroke();
    ctx.strokeStyle="rgba(251,191,36,.38)";
    ctx.strokeRect(x+56,337-mastHeight-12,40,19);
  }
  // Rotating industrial gear silhouettes are scenery, not hitboxes.
  const gearShift=wrap(travel*.41,345),gearBase=Math.floor(travel*.41/345);
  for(let i=-1;i<Math.ceil(width/345)+2;i++){
    const x=gearShift===0?i*345:(i*345-gearShift);
    const r=34+hash(i+gearBase+900)%17,cy=328;
    ctx.save();ctx.translate(x+80,cy);
    ctx.rotate(travel*.00028*(i%2===0?1:-1));
    ctx.fillStyle="#241e23";ctx.strokeStyle="rgba(245,158,11,.42)";
    ctx.lineWidth=4;ctx.beginPath();
    for(let t=0;t<24;t++){
      const angle=t*Math.PI/12,rad=t%3===0?r+9:r;
      if(t===0)ctx.moveTo(rad*Math.cos(angle),rad*Math.sin(angle));
      else ctx.lineTo(rad*Math.cos(angle),rad*Math.sin(angle));
    }
    ctx.closePath();ctx.fill();ctx.stroke();
    ctx.strokeStyle="rgba(250,204,21,.3)";
    ctx.beginPath();ctx.arc(0,0,r*.46,0,Math.PI*2);ctx.stroke();
    ctx.restore();
  }
  // The route remains wide open to ENERGY and all 30 ORBI.
  ctx.fillStyle="rgba(31,34,45,.76)";ctx.fillRect(0,371,width,109);
  ctx.strokeStyle="#a16207";ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(0,373);ctx.lineTo(width,373);ctx.stroke();
  ctx.strokeStyle="rgba(251,191,36,.45)";ctx.lineWidth=2;
  const d=wrap(travel*.7,92);
  for(let x=-92-d;x<width+92;x+=92){
    ctx.beginPath();ctx.moveTo(x,390);ctx.lineTo(x+40,390);ctx.stroke();
  }
  ctx.globalAlpha=.18;
  const haze=ctx.createLinearGradient(0,210,0,430);
  haze.addColorStop(0,"rgba(249,115,22,0)");
  haze.addColorStop(1,"rgba(251,146,60,.62)");
  ctx.fillStyle=haze;ctx.fillRect(0,210,width,220);
  ctx.restore();
}
