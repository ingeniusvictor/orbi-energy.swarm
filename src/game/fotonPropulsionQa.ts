/**
 * UX15-C3B-12: Canvas2D-only visual thrusters for the isolated ASTERIA lab.
 * Pure simulation-clock animation: no particles, new physics owners, RNG,
 * wall clock or extra WebGL context. Drawn BEHIND the genuine FOTON GLB.
 */
export type FotonPropulsionQaMode = "CRUISE" | "DASH";
export interface FotonPropulsionQaProjection {
  readonly mode: FotonPropulsionQaMode;
  readonly length: number;
  readonly innerLength: number;
  readonly alpha: number;
  readonly streaks: number;
  readonly animated: boolean;
}
export const FOTON_PROPULSION_CRUISE_LENGTH = 31;
export const FOTON_PROPULSION_DASH_LENGTH = 69;
export const FOTON_PROPULSION_ENGINE_X = -14;
export const FOTON_PROPULSION_ENGINE_Y = 8;

export function projectFotonPropulsionQa(
  simulatedMs:number,
  dashActive:boolean,
  reducedMotion=false,
):FotonPropulsionQaProjection {
  if(!Number.isFinite(simulatedMs)||simulatedMs<0)
    throw new RangeError("FOTON thruster requires simulation-clock time");
  const base=dashActive?FOTON_PROPULSION_DASH_LENGTH:FOTON_PROPULSION_CRUISE_LENGTH;
  // Pause freezes simulatedMs. Reduced-motion uses a fixed, softer flame.
  const pulse=reducedMotion?1:.94+.06*Math.sin(simulatedMs*.016);
  const length=base*pulse;
  return {
    mode:dashActive?"DASH":"CRUISE",
    length,
    innerLength:length*(dashActive ? .77 : .64),
    alpha:reducedMotion ? .52 : dashActive ? .94 : .78,
    streaks:reducedMotion?0:dashActive?3:0,
    animated:!reducedMotion,
  };
}

/**
 * Geometry remains in the SAME world-local player coordinate frame as
 * drawFoton, so physical camera transformations and atomic origin rebases
 * are automatically shared. Exhaust points to -X during forward travel.
 */
export function drawFotonPropulsionQa(
  ctx:CanvasRenderingContext2D,
  at:{readonly x:number; readonly y:number},
  projection:FotonPropulsionQaProjection,
):void {
  if(!Number.isFinite(at.x)||!Number.isFinite(at.y)||
      !Number.isFinite(projection.length)||projection.length<=0)
    throw new RangeError("Invalid physical thruster projection");
  ctx.save();
  ctx.translate(at.x,at.y);
  ctx.globalAlpha=projection.alpha;
  for(const side of [-1,1]){
    const y=side*FOTON_PROPULSION_ENGINE_Y;
    const tip=FOTON_PROPULSION_ENGINE_X-projection.length;
    // Soft outer blue flame, narrowing to the tail at -X.
    ctx.save();
    ctx.shadowColor="#22d3ee";
    ctx.shadowBlur=projection.mode==="DASH"?19:11;
    const outer=ctx.createLinearGradient(FOTON_PROPULSION_ENGINE_X,y,tip,y);
    outer.addColorStop(0,"rgba(229,255,255,.95)");
    outer.addColorStop(.22,"rgba(45,212,247,.88)");
    outer.addColorStop(.65,"rgba(12,114,237,.52)");
    outer.addColorStop(1,"rgba(22,78,180,0)");
    ctx.fillStyle=outer;
    ctx.beginPath();
    ctx.moveTo(FOTON_PROPULSION_ENGINE_X,y-4.7);
    ctx.quadraticCurveTo(tip+projection.length*.44,y-9,tip,y);
    ctx.quadraticCurveTo(tip+projection.length*.44,y+9,FOTON_PROPULSION_ENGINE_X,y+4.7);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    const coreTip=FOTON_PROPULSION_ENGINE_X-projection.innerLength;
    const core=ctx.createLinearGradient(FOTON_PROPULSION_ENGINE_X,y,coreTip,y);
    core.addColorStop(0,"rgba(255,255,255,.97)");
    core.addColorStop(.4,"rgba(110,248,255,.85)");
    core.addColorStop(1,"rgba(73,211,255,0)");
    ctx.fillStyle=core;
    ctx.beginPath();
    ctx.moveTo(FOTON_PROPULSION_ENGINE_X,y-2.2);
    ctx.quadraticCurveTo(coreTip+projection.innerLength*.4,y-4.2,coreTip,y);
    ctx.quadraticCurveTo(coreTip+projection.innerLength*.4,y+4.2,FOTON_PROPULSION_ENGINE_X,y+2.2);
    ctx.closePath();
    ctx.fill();
  }
  // Lightweight boost streaks only while real canonical Dash is active.
  if(projection.streaks>0){
    ctx.save();
    ctx.strokeStyle="rgba(114,242,255,.56)";
    ctx.lineWidth=1.6;
    for(let i=0;i<projection.streaks;i++){
      const spread=(i-1)*12;
      ctx.beginPath();
      ctx.moveTo(-27-i*8,spread);
      ctx.lineTo(-26-projection.length*(.67+.09*i),spread);
      ctx.stroke();
    }
    ctx.restore();
  }
  ctx.restore();
}
