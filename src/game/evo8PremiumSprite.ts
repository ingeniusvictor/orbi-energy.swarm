import type { OrbiEnergyId, OrbiMember } from "./types";

/**
 * EV-F07 — opt-in visual-only Lote 1 E8 sprites.
 * Legacy E1-E7, GAIA and fusion classes still use the original Canvas2D pass.
 * Sources are currently review SVGs, not the approved transparent PNG/WebP masters.
 * No collision, AI, scoring, capacity, level or shoot-cadence ownership here.
 */
export const EVO8_LOT1_IDS = ["FOTON", "HYDRO", "TERMO"] as const;
export type Evo8Lot1EnergyId = typeof EVO8_LOT1_IDS[number];
export const EVO8_SPRITE_BODY_DRAW_SIZE = 28 as const;
export const EVO8_SPRITE_MAX_SOLID_RADIUS = EVO8_SPRITE_BODY_DRAW_SIZE / 2;
export const EVO8_SPRITE_SOURCE_SIZE = 512 as const;

const SPRITE_PATHS: Record<Evo8Lot1EnergyId, string> = {
  FOTON:"assets/orbi-evo8/runtime/gameplay/orbi_evo8_foton_gameplay.svg",
  HYDRO:"assets/orbi-evo8/runtime/gameplay/orbi_evo8_hydro_gameplay.svg",
  TERMO:"assets/orbi-evo8/runtime/gameplay/orbi_evo8_termo_gameplay.svg",
};

export const resolveEvo8Lot1SpritePath = (
  id: OrbiEnergyId | undefined,
  baseUrl = "/",
): string | null => {
  if (id !== "FOTON" && id !== "HYDRO" && id !== "TERMO") return null;
  const base = baseUrl.endsWith("/") ? baseUrl : baseUrl + "/";
  return base + SPRITE_PATHS[id];
};

export const isEvo8Lot1SpriteCandidate = (
  member: Pick<OrbiMember,"energyId"|"level"|"type">,
): boolean => {
  // E8 is the only replaceable visual stage; fusion units have a separate
  // fusionRank from EVO level and must retain their custom graphics.
  const path = resolveEvo8Lot1SpritePath(member.energyId);
  return Boolean(path) && member.level === 8 &&
    member.type !== "SOLAR_GUARDIAN" && member.type !== "HYDRO_LEVIATHAN";
};

type SpriteStatus = "idle" | "loading" | "ready" | "error";
type SpriteEntry = { status:SpriteStatus; image:HTMLImageElement | null };
const entries:Record<Evo8Lot1EnergyId,SpriteEntry> = {
  FOTON:{status:"idle",image:null},
  HYDRO:{status:"idle",image:null},
  TERMO:{status:"idle",image:null},
};

/** Lazy one-shot preload; never allocates textures or Image objects per frame. */
export const prewarmEvo8Lot1Sprites = (baseUrl = "/"):void => {
  if(typeof Image === "undefined") return;
  for(const id of EVO8_LOT1_IDS){
    const entry=entries[id];
    if(entry.status!=="idle") continue;
    const source=resolveEvo8Lot1SpritePath(id,baseUrl);
    if(!source) continue;
    const image=new Image();
    image.decoding="async";
    entry.image=image;
    entry.status="loading";
    image.onload=()=>{
      if(entry.image!==image)return;
      entry.status=image.naturalWidth>0 && image.naturalHeight>0?"ready":"error";
    };
    image.onerror=()=>{
      if(entry.image!==image)return;
      entry.status="error";
    };
    image.src=source;
  }
};

export const getEvo8Lot1SpriteState = (id:Evo8Lot1EnergyId):SpriteStatus =>
  entries[id].status;

/** Call once at Canvas unmount; stale onload events cannot resurrect an image. */
export const disposeEvo8Lot1Sprites = ():void => {
  for(const id of EVO8_LOT1_IDS){
    const entry=entries[id];
    if(entry.image){
      entry.image.onload=null;
      entry.image.onerror=null;
    }
    entry.image=null;
    entry.status="idle";
  }
};

/** Returns true only when an E8 image was genuinely painted.
 * Otherwise caller must run the historical full Canvas2D fallback. */
export const drawEvo8Lot1Sprite = (
  ctx:CanvasRenderingContext2D,
  member:Pick<OrbiMember,"energyId"|"level"|"type">,
  friendlyWhiteFlashStrength=0,
  flashTicks=0,
):boolean => {
  if(!isEvo8Lot1SpriteCandidate(member))return false;
  const id=member.energyId as Evo8Lot1EnergyId;
  const entry=entries[id];
  if(entry.status!=="ready"||!entry.image)return false;
  const size=EVO8_SPRITE_BODY_DRAW_SIZE;
  const half=size/2;
  ctx.save();
  if(flashTicks>0){
    const factor=Math.max(0,Math.min(1,friendlyWhiteFlashStrength));
    if(factor>=1) ctx.filter="brightness(1.9)";
    else if(factor>0)ctx.filter="brightness("+(1+factor*.35)+")";
  }
  ctx.drawImage(entry.image,-half,-half,size,size);
  ctx.restore();
  return true;
};
