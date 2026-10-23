import React from "react";
import { Play, Compass, Cpu, BookOpen, Settings, ArrowLeft, Shield, Globe, Gauge, Info } from "lucide-react";

export type MobileLaunchLayer = "WELCOME" | "HUB" | "DETAIL";
export type MobileLaunchTab = "MAIN" | "HOW_TO" | "CONTROLS" | "SETTINGS" | "ABOUT" | "CODEX";
export type MobileLaunchSection = "PLAY" | "HANGAR";

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
  hasInfiniteRecord: boolean;
}
export const MobileLaunchNavigation: React.FC<Props> = ({
  layer, section, tab, language, onLanguage, onEnter, onBack,
  onOpen, onPlay, onScoreAttack, hasInfiniteRecord,
}) => {
  const es = language === "es";
  const choices = [
    {icon:Play, label:es?"Modos de juego":"Game modes",tab:"MAIN",section:"PLAY"},
    {icon:Cpu,label:es?"Hangar y registro":"Hangar & records",tab:"MAIN",section:"HANGAR"},
    {icon:Compass,label:es?"Táctica":"Tactics",tab:"HOW_TO"},
    {icon:BookOpen,label:"Codex",tab:"CODEX"},
    {icon:Shield,label:es?"Controles":"Controls",tab:"CONTROLS"},
    {icon:Settings,label:es?"Ajustes":"Settings",tab:"SETTINGS"},
    {icon:Info,label:es?"Acerca de":"About",tab:"ABOUT"},
  ] as const;
  return (
    <section className="orbi-mobile-launch" data-testid="orbi-mobile-launch" data-layer={layer}
      aria-label={es?"Centro de mando ORBI":"ORBI command deck"}>
      {layer === "WELCOME" && (
        <div className="orbi-mobile-launch__welcome">
          <span className="orbi-mobile-launch__kicker">ORBI ECOSYSTEM // FOTON-01</span>
          <h1>ORBI <em>ENERGY</em> SWARM</h1>
          <p>{es?"SISTEMA TÁCTICO DE ENJAMBRE":"TACTICAL SWARM COMMAND"}</p>
          <button className="orbi-mobile-launch__primary" data-testid="orbi-mobile-enter"
            onClick={onEnter}><Play size={18} fill="currentColor" />{es?"ENTRAR":"ENTER"}</button>
          <div className="orbi-mobile-launch__languages" role="group" aria-label="Language">
            <Globe size={13} />
            <button aria-pressed={es} onClick={()=>onLanguage("es")}>ES</button>
            <button aria-pressed={!es} onClick={()=>onLanguage("en")}>EN</button>
          </div>
          <span className="orbi-mobile-launch__version">PUBLIC BETA · v0.2.0-beta.1</span>
        </div>
      )}
      {layer === "HUB" && (
        <div className="orbi-mobile-launch__hub">
          <div className="orbi-mobile-launch__heading">
            <span className="orbi-mobile-launch__kicker">ORBI // COMMAND DECK</span>
            <h2>{es?"CENTRO DE MANDO":"COMMAND CENTER"}</h2>
            <button onClick={onBack} aria-label={es?"Volver a portada":"Return to title"}><ArrowLeft size={16}/></button>
          </div>
          <div className="orbi-mobile-launch__tiles">
            {choices.map(({icon:Icon,label,tab:destination, ...rest})=>(
              <button key={label} data-testid={`orbi-mobile-menu-${destination.toLowerCase()}-${"section" in rest ? rest.section.toLowerCase() : "info"}`}
                onClick={()=>onOpen(destination, "section" in rest ? rest.section : "PLAY")}>
                <Icon size={22} aria-hidden="true"/><span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {layer === "DETAIL" && (
        <div className="orbi-mobile-launch__detail">
          <div className="orbi-mobile-launch__heading">
            <span className="orbi-mobile-launch__kicker">ORBI // {section==="PLAY"?"MISSION CONTROL":"HANGAR"}</span>
            <h2>{tab==="MAIN"?(section==="PLAY"?(es?"MODOS DE JUEGO":"GAME MODES"):(es?"HANGAR Y REGISTROS":"HANGAR & RECORDS")):choices.find(x=>x.tab===tab)?.label}</h2>
            <button onClick={onBack} data-testid="orbi-mobile-menu-back" aria-label={es?"Volver al centro de mando":"Back to command center"}><ArrowLeft size={16}/></button>
          </div>
          {tab==="MAIN"&&section==="PLAY"&&(
            <div className="orbi-mobile-launch__modes">
              <button data-testid="orbi-mobile-campaign" className="orbi-mobile-launch__mode" onClick={onPlay}>
                <Play size={26} fill="currentColor"/><strong>CAMPAIGN</strong><small>{es?"INICIAR MISIÓN":"START MISSION"}</small>
              </button>
              <button data-testid="orbi-mobile-score-attack" className="orbi-mobile-launch__mode" onClick={onScoreAttack}>
                <Gauge size={26}/><strong>SCORE ATTACK</strong><small>{es?"RETO CONTRARRELOJ":"TIMEBOX CHALLENGE"}</small>
              </button>
              <div className="orbi-mobile-launch__mode orbi-mobile-launch__mode--read-only"
                aria-label={hasInfiniteRecord?"Infinite unlocked in Campaign":"Infinite unlocks through Campaign"}>
                <Compass size={26}/><strong>INFINITE</strong><small>{hasInfiniteRecord?(es?"DESDE CAMPAIGN":"VIA CAMPAIGN"):(es?"DESBLOQUEAR EN CAMPAIGN":"UNLOCK IN CAMPAIGN")}</small>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
