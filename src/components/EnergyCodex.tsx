import React, { useState } from "react";
import { Atom, ChevronLeft, ChevronRight, Droplets, Flame, Leaf, Magnet, Orbit, Sun, Waves, Wind, Zap, Shield, Sparkles, PanelsTopLeft } from "lucide-react";
import { ORBI_ENERGY_CANON, ORBI_GAIA_REQUIRED_FOLLOWER_IDS, ORBI_PROTAGONIST_ID } from "../game/orbiEnergyCanon";
import { getOrbiAttackProfile } from "../game/orbiAttackProfiles";
import { acquisitionsForLevel, getEvo8VisualStage, getEvo8WingCount, ORBI_MAX_EVOLUTION_LEVEL } from "../game/orbiEvolution";
import { getGaiaLevelForCompletedCycles } from "../game/gaiaEvolution";
import type { OrbiCombatRole, OrbiEnergyId } from "../game/types";

type Locale = "es" | "en";
const COPY: Record<OrbiEnergyId, {enEnergy:string;enLore:string;esAttack:string;enAttack:string}> = {
  FOTON:{enEnergy:"Photovoltaic energy",enLore:"Independent green solar-panel ORBI, attacking with a focused light lance.",esAttack:"Lanza fotovoltaica",enAttack:"Photovoltaic lance"},
  HYDRO:{enEnergy:"Hydroelectric energy",enLore:"Water pulses slow hostile targets and control the flow of combat.",esAttack:"Pulso hidráulico",enAttack:"Hydro pulse"},
  AERO:{enEnergy:"Wind energy",enLore:"Fast crescent attacks with powerful aerodynamic push.",esAttack:"Creciente eólico",enAttack:"Wind crescent"},
  TERMO:{enEnergy:"Thermal energy",enLore:"Concentrated plasma creates additional area damage.",esAttack:"Explosión térmica",enAttack:"Thermal burst"},
  MAGNE:{enEnergy:"Electromagnetic energy",enLore:"Magnetic arcs attract and group nearby targets.",esAttack:"Arco magnético",enAttack:"Magnetic arc"},
  ATON:{enEnergy:"Atomic energy",enLore:"Heavy particle attacks add splash damage around the point of impact.",esAttack:"Partícula atómica",enAttack:"Atomic particle"},
  KINETRIX:{enEnergy:"Kinetic energy",enLore:"Quick kinetic lances push opponents with critical-hit potential.",esAttack:"Lanza cinética",enAttack:"Kinetic lance"},
  H2NOVA:{enEnergy:"Green hydrogen",enLore:"Support cells restore shield strength.",esAttack:"Celda de hidrógeno",enAttack:"Hydrogen cell"},
  QUANTUM:{enEnergy:"Quantum energy",enLore:"Quantum-phase projectiles can produce a secondary echo and critical hits.",esAttack:"Fase cuántica",enAttack:"Quantum phase"},
  GAIA:{enEnergy:"Nine-energy synthesis",enLore:"Unique synthesis of nine affinities, combining offensive effects with shield support.",esAttack:"Síntesis GAIA",enAttack:"GAIA synthesis"},
};
const ROLES: Record<OrbiCombatRole,{es:string;en:string}> = {
  beam:{es:"Lanza / haz",en:"Beam / lance"},
  rapid:{es:"Ataque rápido",en:"Rapid attack"},
  pulse:{es:"Pulso",en:"Pulse"},
  arc:{es:"Arco de control",en:"Control arc"},
  shield:{es:"Defensa",en:"Defense"},
  support:{es:"Soporte",en:"Support"},
};
const ICONS = {
  FOTON:PanelsTopLeft,HYDRO:Droplets,AERO:Wind,TERMO:Flame,MAGNE:Magnet,
  ATON:Atom,KINETRIX:Zap,H2NOVA:Waves,QUANTUM:Orbit,GAIA:Leaf,
} as const;

/** Codex illustration, not the actual in-game sprite. FOTON stays solar green,
 * and ENERGY is never rendered as one of the ten collectible-energy identities. */
export const EnergyCodexArtwork = React.memo(function EnergyCodexArtwork({
  id,color,level,language,
}: {id:OrbiEnergyId;color:string;level:number;language:Locale}) {
  const Icon=ICONS[id];
  const stage=getEvo8VisualStage(level);
  const wingCount=getEvo8WingCount(level);
  return (
    <div className="orbi-ux11c-art" style={{"--codex-art":color} as React.CSSProperties}>
      <svg viewBox="0 0 340 248" className="orbi-ux11c-sigil" role="img"
        aria-label={id+" · "+(language==="es"?"ilustración conceptual":"concept illustration")+" · E"+level}>
        <circle cx="170" cy="116" r="115" fill={color} fillOpacity=".06"/>
        <circle cx="170" cy="116" r="100" stroke={color} strokeOpacity=".45" strokeDasharray="3 9" fill="none"/>
        {Array.from({length:stage},(_,i)=><circle key={i} cx="170" cy="116" r={54+i*13} stroke={color} strokeOpacity=".23" fill="none"/>)}
        {Array.from({length:wingCount},(_,i)=>{
          const side=i%2===0?-1:1;
          const y=80+Math.floor(i/2)*35;
          return <path key={i} d={"M"+(170+side*52)+" "+(y+17)+" L"+(170+side*83)+" "+(y-16)+" L"+(170+side*100)+" "+(y+5)+" Z"} fill={color} fillOpacity=".38" stroke={color}/>;
        })}
        {id==="GAIA"&&ORBI_GAIA_REQUIRED_FOLLOWER_IDS.map((energy,i)=>{
          const a=i*Math.PI*2/9-Math.PI/2;
          const x=170+Math.cos(a)*100,y=116+Math.sin(a)*100;
          const c=ORBI_ENERGY_CANON.find(e=>e.id===energy)?.color||color;
          return <circle key={energy} cx={x} cy={y} r="5" fill={c} stroke="#f4fbff" strokeWidth=".8"/>;
        })}
        <circle cx="170" cy="116" r={stage===4?61:55} fill="#081729" stroke={color} strokeWidth="4"/>
        <circle cx="170" cy="116" r="45" fill={color} fillOpacity=".13" stroke="#d2f8ff" strokeOpacity=".3"/>
        {id==="FOTON"&&<g stroke="#a6ff80" strokeWidth="2" fill="#134523">
          <rect x="135" y="86" width="70" height="54" rx="3" strokeWidth="3"/>
          <path d="M157 86V140M180 86V140M135 103H205M135 121H205" stroke="#66ed97"/>
          <circle cx="170" cy="71" r="8" fill="#e3ff9e"/>
          <path d="M170 56V60M157 62L161 66M183 62L179 66" fill="none"/>
        </g>}
        <text x="170" y="228" fill={color} textAnchor="middle" fontSize="12" fontWeight="900" letterSpacing="4">{id==="GAIA"?"SYNTHESIS / IX":"EVO8 / "+String(level).padStart(2,"0")}</text>
      </svg>
      {id!=="FOTON"&&<div className="orbi-ux11c-icon" aria-hidden="true"><Icon size={56} strokeWidth={1.6}/></div>}
      {id==="FOTON"&&<span className="orbi-ux11c-foton-tag">{language==="es"?"PANEL SOLAR VERDE":"GREEN SOLAR PANEL"}</span>}
    </div>
  );
});

export const EnergyCodex:React.FC<{language:Locale;onOpenLegacy:()=>void}> = ({language,onOpenLegacy}) => {
  const es=language==="es";
  const [selectedId,setSelectedId]=useState<OrbiEnergyId>("FOTON");
  const [level,setLevel]=useState(1);
  const energy=ORBI_ENERGY_CANON.find(e=>e.id===selectedId)!;
  const profile=getOrbiAttackProfile(energy.attackSignature);
  const copy=COPY[selectedId];
  const isGaia=selectedId==="GAIA";
  const select=(id:OrbiEnergyId)=>{setSelectedId(id);setLevel(1);};
  return (
    <section className="orbi-ux11c-codex" data-testid="orbi-ux11c-codex"
      style={{"--codex-accent":energy.color} as React.CSSProperties}
      aria-label={es?"Códice de las diez energías ORBI":"Codex of the ten ORBI energies"}>
      <aside className="orbi-ux11c-roster">
        <div className="orbi-ux11c-section-title"><Sparkles size={15} aria-hidden="true"/>{es?"ARCHIVO DE ENERGÍAS":"ENERGY ARCHIVE"} <small>10 / 10</small></div>
        <div className="orbi-ux11c-roster-list" role="group" aria-label={es?"Elegir energía":"Select energy"}>
          {ORBI_ENERGY_CANON.map(item=>{
            const Icon=ICONS[item.id];
            return <button type="button" className="orbi-ux11c-choice" key={item.id}
              data-energy={item.id} aria-pressed={selectedId===item.id} onClick={()=>select(item.id)}
              style={{"--roster-accent":item.color} as React.CSSProperties}>
              <Icon size={21} aria-hidden="true"/>
              <span><strong>{item.displayName}</strong><small>{es?item.energyLabel:COPY[item.id].enEnergy}</small></span>
              {item.id==="GAIA"&&<em>IX</em>}
            </button>;
          })}
        </div>
      </aside>
      <article className="orbi-ux11c-details" aria-live="polite">
        <header className="orbi-ux11c-energy-title">
          <div><small>{isGaia?(es?"SÍNTESIS ÚNICA":"UNIQUE SYNTHESIS"):(es?"ORBI COLECCIONABLE":"COLLECTIBLE ORBI")}</small>
            <h3>{energy.displayName}</h3><p>{es?energy.energyLabel:copy.enEnergy}</p></div>
          <strong>E{level} / E8</strong>
        </header>
        <div className="orbi-ux11c-hero">
          <EnergyCodexArtwork id={energy.id} color={energy.color} level={level} language={language}/>
          <div className="orbi-ux11c-identity">
            <span>{es?"IDENTIDAD Y FUNCIÓN":"IDENTITY & PURPOSE"}</span>
            <p>{es?energy.loreRole:copy.enLore}</p>
            <div><small>{es?"ROL":"ROLE"}</small><b>{ROLES[energy.combatRole][language]}</b></div>
            <div><small>{es?"ATAQUE":"ATTACK"}</small><b>{es?copy.esAttack:copy.enAttack}</b></div>
            <div><small>{es?"FIRMA":"SIGNATURE"}</small><code>{energy.attackSignature}</code></div>
            {isGaia&&<p className="orbi-ux11c-gaia-rule"><Shield size={13} aria-hidden="true"/>
              {es?"GAIA requiere las nueve energías base distintas: no es un seguidor coleccionable ordinario.":
                "GAIA requires all nine different base energies: not an ordinary collectible follower."}
            </p>}
          </div>
        </div>
        <div className="orbi-ux11c-metrics">
          <div className="orbi-ux11c-evo">
            <div className="orbi-ux11c-section-title">{es?"EVOLUCIÓN EVO8":"EVO8 EVOLUTION"}
              <small>{es?"VISTA PREVIA":"PREVIEW ONLY"}</small></div>
            <div className="orbi-ux11c-levels" role="group" aria-label={es?"Nivel EVO8 ilustrado":"Illustrated EVO8 level"}>
              <button type="button" aria-label={es?"Nivel anterior":"Previous level"} disabled={level===1}
                onClick={()=>setLevel(v=>Math.max(1,v-1))}><ChevronLeft size={15}/></button>
              {Array.from({length:ORBI_MAX_EVOLUTION_LEVEL},(_,i)=><button type="button" key={i+1}
                aria-pressed={level===i+1} onClick={()=>setLevel(i+1)}>E{i+1}</button>)}
              <button type="button" aria-label={es?"Siguiente nivel":"Next level"} disabled={level===8}
                onClick={()=>setLevel(v=>Math.min(8,v+1))}><ChevronRight size={15}/></button>
            </div>
            <div className="orbi-ux11c-facts">
              <span>{es?"APARIENCIA":"APPEARANCE"} <b>{getEvo8VisualStage(level)}/4</b></span>
              <span>{es?"ALAS":"EXTRA WINGS"} <b>+{getEvo8WingCount(level)}</b></span>
              <span>{isGaia?(es?"CICLOS COMPLETOS":"FULL CYCLES"):(es?"ADQUISICIONES":"ACQUISITIONS")} <b>{acquisitionsForLevel(level)}</b></span>
            </div>
            {isGaia&&<p className="orbi-ux11c-note">{es?"Un ciclo reúne nueve energías. E1 nace en el primero; E8 exige 29 ciclos completos.":
                "One cycle collects nine energies. E1 forms in the first, E8 requires 29 complete cycles."}
                {getGaiaLevelForCompletedCycles(acquisitionsForLevel(level))===level?" ✓":""}</p>}
          </div>
          <div className="orbi-ux11c-attack">
            <div className="orbi-ux11c-section-title">{es?"ATAQUE BASE":"BASE ATTACK"}</div>
            <div className="orbi-ux11c-facts">
              <span>{es?"DAÑO":"DAMAGE"} <b>×{profile.damageMultiplier.toFixed(2)}</b></span>
              <span>{es?"VEL. PROYECTIL":"PROJECTILE SPEED"} <b>×{profile.speedMultiplier.toFixed(2)}</b></span>
              <span>{es?"ENFRIAMIENTO":"COOLDOWN"} <b>{profile.cooldownFrames}f</b></span>
              <span>{es?"FORMA":"SHAPE"} <b>{profile.shape}</b></span>
            </div>
            <p className="orbi-ux11c-note">{es?"Parámetros base del motor. El selector de nivel es ilustrativo y no modifica el guardado ni el combate.":
                "Actual engine base parameters. Level previews do not modify combat or saved progress."}</p>
          </div>
        </div>
        <footer className="orbi-ux11c-protagonist"><Sun size={13} aria-hidden="true"/><b>{ORBI_PROTAGONIST_ID} ≠ FOTON</b>
          {es?"ENERGY es el protagonista neutral dorado; FOTON es el ORBI solar verde, independiente.":
            "ENERGY is the golden neutral protagonist; FOTON is an independent green solar ORBI."}
          <button type="button" className="orbi-ux11c-legacy" onClick={onOpenLegacy}>{es?"ARCHIVO BLACKOUT":"BLACKOUT ARCHIVE"}</button>
        </footer>
      </article>
    </section>
  );
};
