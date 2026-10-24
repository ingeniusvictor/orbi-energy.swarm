import React, { useState } from "react";
import { BookOpen, ChevronRight, Globe, LockKeyhole } from "lucide-react";
import type { MobileLaunchLayer, MobileLaunchSection, MobileLaunchTab } from "./MobileLaunchNavigation";

/**
 * UX09B — use the actual user-approved 1672x941 cinematic artwork instead of
 * a low-fidelity vector reinterpretation. The semantic hit areas are live
 * native controls over baked illustration typography, never an image map.
 * The original responsive live UI remains available in portrait.
 */
interface Props {
  layer: MobileLaunchLayer;
  section: MobileLaunchSection;
  tab: MobileLaunchTab;
  language: "es" | "en";
  onLanguage: (language: "es" | "en") => void;
  onEnter: () => void;
  onBack: () => void;
  onOpen: (tab: MobileLaunchTab, section?: MobileLaunchSection) => void;
  onPlay: () => void;
  onScoreAttack: () => void;
  nanoCredits?: number;
  purifiedEnergy?: number;
  hasInfiniteRecord: boolean;
}
type HotspotProps = {
  className?: string; style: React.CSSProperties; label: string; onClick: () => void;
  testId?: string; current?: boolean; disabled?: boolean;
};
const Hotspot = ({ className, style, label, onClick, testId, current, disabled }: HotspotProps) => (
  <button type="button" data-testid={testId} className={`orbi-ux09b-hotspot ${className ?? ""}`}
    style={style} onClick={onClick} disabled={disabled}
    aria-label={label} aria-current={current ? "true" : undefined}>
    <span className="orbi-ux09b-sr">{label}</span>
  </button>
);
const zone = (left: number, top: number, width: number, height: number): React.CSSProperties =>
  ({ left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%` });
const hubHotspots: { labelES: string; labelEN: string; tab: MobileLaunchTab; section: MobileLaunchSection; style: React.CSSProperties; testId: string }[] = [
  {labelES:"Modos de juego",labelEN:"Game modes",tab:"MAIN",section:"PLAY",style:zone(2.8,31.9,23.6,29.5),testId:"orbi-mobile-menu-main-play"},
  {labelES:"Hangar y registro",labelEN:"Hangar and records",tab:"MAIN",section:"HANGAR",style:zone(27.0,31.9,23.0,29.5),testId:"orbi-mobile-menu-main-hangar"},
  {labelES:"Táctica y formaciones",labelEN:"Tactics and formations",tab:"HOW_TO",section:"PLAY",style:zone(50.2,31.9,22.8,29.5),testId:"orbi-mobile-menu-how_to-info"},
  {labelES:"Codex",labelEN:"Codex",tab:"CODEX",section:"PLAY",style:zone(73.4,31.9,23.8,29.5),testId:"orbi-mobile-menu-codex-info"},
  {labelES:"Controles",labelEN:"Controls",tab:"CONTROLS",section:"PLAY",style:zone(9.0,62.7,28.1,25.6),testId:"orbi-mobile-menu-controls-info"},
  {labelES:"Ajustes",labelEN:"Settings",tab:"SETTINGS",section:"PLAY",style:zone(37.6,62.7,25.2,25.6),testId:"orbi-mobile-menu-settings-info"},
  {labelES:"Acerca de",labelEN:"About",tab:"ABOUT",section:"PLAY",style:zone(63.2,62.7,27.4,25.6),testId:"orbi-mobile-menu-about-info"}
];
const modes = [
  {id:"CAMPAIGN",nameES:"Campaña",nameEN:"Campaign",start:zone(23.2,81,22.8,7.8),sidebar:zone(1.5,35.2,19.2,8.7)},
  {id:"SCORE_ATTACK",nameES:"Score Attack",nameEN:"Score Attack",start:zone(50.2,81,21.1,7.8),sidebar:zone(2.5,45.5,18.0,8.2)},
  {id:"INFINITE",nameES:"Infinite (bloqueado)",nameEN:"Infinite (locked)",start:zone(74.1,81,21.9,7.8),sidebar:zone(2.5,55.3,18.0,8.2)}
] as const;
export const PremiumArtNavigation: React.FC<Props> = ({
  layer, section, tab, language, onLanguage, onEnter, onBack, onOpen,
  onPlay, onScoreAttack, nanoCredits = 0, purifiedEnergy = 0,
  hasInfiniteRecord,
}) => {
  const es = language === "es";
  const [selectedMode,setSelectedMode] = useState("CAMPAIGN");
  const showModes = layer === "DETAIL" && tab === "MAIN" && section === "PLAY";
  const showTactics = layer === "DETAIL" && tab === "HOW_TO" && section === "PLAY";
  const artName = layer === "WELCOME" ? "welcome" : layer === "HUB" ? "command" : showModes ? "modes" : "formations";
  const artwork = `${import.meta.env.BASE_URL}ux09/premium/${artName}.webp`;
  const background = `url("${artwork}")`;
  return (
    <section className="orbi-mobile-launch orbi-ux09 orbi-ux09b"
      data-testid="orbi-mobile-launch" data-layer={layer} data-premium-art={artName}
      aria-label={es ? "Universo ORBI — navegación premium" : "ORBI Universe — premium navigation"}
      style={{ "--orbi-ux09-photo": background } as React.CSSProperties}>
      <div className="orbi-ux09-scene" aria-hidden="true" />
      <div className="orbi-ux09b-artboard" data-testid="orbi-ux09b-artboard">
        <img className="orbi-ux09b-illustration" src={artwork}
          alt={es ? "Escena cinematográfica original del universo ORBI" : "Original ORBI Universe cinematic scene"}
          draggable={false} fetchPriority={layer==="WELCOME" ? "high" : "auto"}/>
        {layer==="WELCOME" && (
          <div className="orbi-ux09-identity orbi-ux09b-welcome">
            <Hotspot label={es ? "Entrar al Centro de Mando" : "Enter Command Center"}
              testId="orbi-mobile-enter" onClick={onEnter} style={zone(48.0,57.4,28.3,10.5)}/>
            <div className="orbi-mobile-launch__languages" role="group" aria-label={es ? "Idioma" : "Language"}>
              <Globe size={13} aria-hidden="true" />
              <button aria-label="Español" aria-pressed={es} onClick={()=>onLanguage("es")}>ES</button>
              <button aria-label="English" aria-pressed={!es} onClick={()=>onLanguage("en")}>EN</button>
            </div>
          </div>
        )}
        {layer==="HUB" && (
          <div className="orbi-mobile-launch__hub orbi-ux09-hub orbi-ux09b-hub">
            <div className="orbi-ux09b-resource-live" aria-label={es ? "Recursos reales" : "Live resources"}>
              <span>{nanoCredits.toLocaleString(language)}</span><span>{purifiedEnergy.toLocaleString(language)}</span>
            </div>
            <div className="orbi-mobile-launch__tiles orbi-ux09-command-grid">
              {hubHotspots.map(item=>(
                <Hotspot key={item.testId} className="orbi-ux09-tile" testId={item.testId}
                  label={es ? item.labelES : item.labelEN} style={item.style}
                  onClick={()=>onOpen(item.tab,item.section)}/>
              ))}
            </div>
            <Hotspot className="orbi-ux09b-hub-back" style={zone(93.1,22.2,5.1,8.7)}
              label={es ? "Volver a la portada" : "Back to title"} onClick={onBack}/>
          </div>
        )}
        {showModes && (
          <div className="orbi-mobile-launch__detail orbi-ux09-detail orbi-ux09b-modes">
            <Hotspot className="orbi-ux09b-return" testId="orbi-mobile-menu-back"
              label={es ? "Volver al Centro de Mando" : "Back to Command Center"}
              style={zone(91.6,2.8,6.4,7.6)} onClick={onBack}/>
            <nav className="orbi-ux09b-sidebar" aria-label={es ? "Modos disponibles" : "Game modes"}>
              {modes.map(item=><Hotspot key={item.id} className="orbi-ux09-mode-nav"
                current={selectedMode===item.id} label={es?item.nameES:item.nameEN}
                style={item.sidebar} onClick={()=>setSelectedMode(item.id)}/>)}
            </nav>
            <div className="orbi-mobile-launch__modes orbi-ux09-mode-grid">
              {modes.map(item=>(
                <article key={item.id} className="orbi-ux09-mode-card" data-locked={item.id==="INFINITE"}
                  aria-label={es?item.nameES:item.nameEN}>
                  {item.id==="INFINITE" ? (
                    <div data-testid="orbi-mobile-infinite-locked" className="orbi-ux09b-locked"
                      aria-disabled="true" role="note"
                      aria-label={es ? "Infinite bloqueado hasta campaña" : "Infinite locked until campaign"}
                      style={item.start}><LockKeyhole size={15} aria-hidden="true"/>
                      <span className="orbi-ux09b-sr">{hasInfiniteRecord ? "Requiere habilitación de campaña" : "Infinite no disponible"}</span>
                    </div>
                  ) : (
                    <Hotspot testId={item.id==="CAMPAIGN"?"orbi-mobile-campaign":"orbi-mobile-score-attack"}
                      className="orbi-ux09-mode-action" label={es ? `Iniciar ${item.nameES}` : `Start ${item.nameEN}`}
                      style={item.start} onClick={item.id==="CAMPAIGN"?onPlay:onScoreAttack}/>
                  )}
                </article>
              ))}
            </div>
          </div>
        )}
        {showTactics && (
          <div className="orbi-mobile-launch__detail orbi-ux09-detail orbi-ux09b-tactics">
            <Hotspot testId="orbi-mobile-menu-back" label={es ? "Volver al Centro de Mando" : "Back to Command Center"}
              style={zone(92.5,2.1,6.0,8.3)} onClick={onBack}/>
            <button type="button" className="orbi-ux09b-manual" data-testid="orbi-ux09b-formation-manual"
              onClick={()=>onOpen("HOW_TO","HANGAR")}>
              <BookOpen size={16}/>{es ? "Manual táctico" : "Tactics manual"}<ChevronRight size={15}/>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
