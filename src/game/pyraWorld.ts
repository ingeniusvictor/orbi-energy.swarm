/** PYRA-01 — magma-world parallax background on the authentic combat canvas.
 * Pure scenery: no collisions, contact hazards, actor spawning or timers.
 */
export const PYRA_SECTIONS=[
  "OBSIDIAN_GATE","EMBER_ESCARPMENT","LAVA_CAUSEWAY",
  "PRESSURE_FISSURE","MAGMA_SANCTUM","CORE_CALDERA",
] as const;
export function pyraSceneAt(ordinal:number):typeof PYRA_SECTIONS[number]{
  if(!Number.isSafeInteger(ordinal)||ordinal<0)
    throw new RangeError("Invalid PYRA ordinal");
  return PYRA_SECTIONS[ordinal%PYRA_SECTIONS.length];
}
const wrap=(x:number,w:number)=>((x%w)+w)%w;
const hash=(n:number)=>Math.imul((n|0)^0x3c6ef372,2246822519)>>>0;
export function drawPyraWorld(ctx:CanvasRenderingContext2D,
  distance:number,width:number,ordinal:number):void{
  if(![distance,width,ordinal].every(Number.isFinite)||distance<0||
    width<800||width>2400||!Number.isSafeInteger(ordinal)||ordinal<0)
    throw new RangeError("Invalid PYRA backdrop");
  const H=480;
  ctx.save();ctx.clearRect(0,0,width,H);
  const sky=ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,"#100b1d");sky.addColorStop(.5,"#39202b");
  sky.addColorStop(.81,"#86351b");sky.addColorStop(1,"#e85b17");
  ctx.fillStyle=sky;ctx.fillRect(0,0,width,H);
  const farCell=210,farShift=wrap(distance*.12,farCell);
  const farStart=Math.floor(distance*.12/farCell);
  for(let i=-2;i<=Math.ceil(width/farCell)+2;i++){
    const seed=hash(farStart+i+137),x=i*farCell-farShift,h=70+seed%95;
    ctx.fillStyle="#312031";ctx.beginPath();
    ctx.moveTo(x-55,333);ctx.lineTo(x+farCell*.48,333-h);
    ctx.lineTo(x+farCell+65,333);ctx.closePath();ctx.fill();
    ctx.strokeStyle="rgba(251,146,60,.16)";ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(x+farCell*.48,333-h);
    ctx.lineTo(x+farCell*.38,333-h*.53);ctx.stroke();
  }
  // Vertical basalt spires mark the middle distance without blocking actors.
  const spireWidth=147,shift=wrap(distance*.29,spireWidth);
  const start=Math.floor(distance*.29/spireWidth);
  for(let i=-2;i<=Math.ceil(width/spireWidth)+2;i++){
    const n=hash(start+i+43),x=i*spireWidth-shift;
    const h=92+n%135,tip=x+42+n%28;
    ctx.fillStyle=n%3===0?"#302332":"#211b2b";
    ctx.beginPath();ctx.moveTo(x,368);ctx.lineTo(tip,368-h);
    ctx.lineTo(x+94,368);ctx.closePath();ctx.fill();
    ctx.strokeStyle="rgba(248,113,27,.34)";ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(tip,368-h);ctx.lineTo(x+56,355);ctx.stroke();
  }
  // Moving rivulets of magma are background-only visual bands.
  ctx.fillStyle="#231d25";ctx.fillRect(0,372,width,108);
  const lava=ctx.createLinearGradient(0,380,0,470);
  lava.addColorStop(0,"#7c2d12");lava.addColorStop(.6,"#ea580c");
  lava.addColorStop(1,"#fbbf24");
  ctx.fillStyle=lava;ctx.fillRect(0,416,width,64);
  const lavaShift=wrap(distance*.63,118);
  ctx.strokeStyle="rgba(254,240,138,.76)";ctx.lineWidth=4;
  for(let x=-140-lavaShift;x<width+150;x+=118){
    ctx.beginPath();ctx.moveTo(x,442);ctx.lineTo(x+42,434);
    ctx.lineTo(x+79,450);ctx.lineTo(x+116,441);ctx.stroke();
  }
  // Basalt stepping ridge. ENERGY movement/collision stays unchanged.
  ctx.fillStyle="#27212a";ctx.fillRect(0,371,width,44);
  ctx.strokeStyle="#fdba74";ctx.lineWidth=2.3;
  ctx.beginPath();ctx.moveTo(0,374);ctx.lineTo(width,374);ctx.stroke();
  const slab=wrap(distance*.75,91);
  ctx.strokeStyle="rgba(251,146,60,.5)";ctx.lineWidth=2;
  for(let x=-91-slab;x<width+91;x+=91){
    ctx.beginPath();ctx.moveTo(x,377);ctx.lineTo(x+35,411);ctx.stroke();
  }
  ctx.restore();
}
