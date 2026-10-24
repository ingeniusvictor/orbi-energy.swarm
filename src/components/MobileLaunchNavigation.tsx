import React, { useState } from "react";
import { PremiumArtNavigation } from "./PremiumArtNavigation";
import {
  ArrowLeft, Atom, BookOpen, ChevronRight, Compass, Cpu, Gauge,
  Gamepad2, Globe, Info, LockKeyhole, Play, Settings, Shield,
  Sparkles, Zap,
} from "lucide-react";

/** UX09: keep UX06's three launch layers and callback ownership intact. */
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
  nanoCredits?: number;
  purifiedEnergy?: number;
}

export const MobileLaunchNavigation: React.FC<Props> = ({
  layer, section, tab, language, onLanguage, onEnter, onBack,
  onOpen, onPlay, onScoreAttack, hasInfiniteRecord,
  nanoCredits = 0, purifiedEnergy = 0,
}) => {
  const es = language === "es";
  // Vite BASE_URL keeps the same visual assets working on Pages subpaths.
  const fallbackArt = layer==="WELCOME" ? "welcome" : layer==="HUB" ? "command" : (section==="PLAY" && tab==="MAIN") ? "modes" : "formations";
  const worldImage = `url("${import.meta.env.BASE_URL}ux09/premium/${fallbackArt}.webp")`;
  const [selectedMode, setSelectedMode] = useState<"CAMPAIGN" | "SCORE_ATTACK" | "INFINITE">("CAMPAIGN");
  const [landscape, setLandscape] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(orientation: landscape)").matches
  );
  React.useEffect(() => {
    const media = window.matchMedia("(orientation: landscape)");
    const update = () => setLandscape(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  // Premium screenshots carry the approved 2026 visual identity. In portrait
  // preserve the fully editable, localized and scrollable legacy UX09 layout.
  const artLayer = landscape && (layer==="WELCOME" || layer==="HUB" ||
    (layer==="DETAIL" && section==="PLAY" && (tab==="MAIN" || tab==="HOW_TO")));

  const choices = [
    { icon: Gamepad2, label: es ? "Modos de juego" : "Game modes", description: es ? "Campaña, desafío infinito y más" : "Campaign, survival and more", tab: "MAIN" as const, section: "PLAY" as const, art: "modes" },
    { icon: Cpu, label: es ? "Hangar y registro" : "Hangar & records", description: es ? "Gestiona y registra tu progreso" : "Manage and record progress", tab: "MAIN" as const, section: "HANGAR" as const, art: "hangar" },
    { icon: Compass, label: es ? "Táctica" : "Tactics", description: es ? "Formaciones y estrategias" : "Formations and strategies", tab: "HOW_TO" as const, art: "tactics" },
    { icon: BookOpen, label: "Codex", description: es ? "Energías y universo ORBI" : "Energy and ORBI lore", tab: "CODEX" as const, art: "codex" },
    { icon: Shield, label: es ? "Controles" : "Controls", description: es ? "Movimiento y sensibilidad" : "Movement and sensitivity", tab: "CONTROLS" as const, art: "controls" },
    { icon: Settings, label: es ? "Ajustes" : "Settings", description: es ? "Gráficos, sonido e idioma" : "Graphics, sound and language", tab: "SETTINGS" as const, art: "settings" },
    { icon: Info, label: es ? "Acerca de" : "About", description: es ? "Información y créditos" : "Information and credits", tab: "ABOUT" as const, art: "about" },
  ];
  const modes = [
    {
      id: "CAMPAIGN" as const, name: es ? "CAMPAÑA" : "CAMPAIGN", subtitle: es ? "INICIAR MISIÓN" : "START MISSION",
      description: es ? "Explora los mundos de ORBI, captura energías, evoluciona tus orbes y enfréntate a Blackout." : "Explore ORBI worlds, capture energy, evolve companions and face Blackout.",
      Icon: Sparkles, action: onPlay, locked: false, accent: "gold",
    },
    {
      id: "SCORE_ATTACK" as const, name: "SCORE ATTACK", subtitle: es ? "RETO CONTRARRELOJ" : "TIME ATTACK",
      description: es ? "Pon a prueba tus habilidades y consigue la mayor puntuación en el menor tiempo posible." : "Race the clock and earn your highest possible score.",
      Icon: Gauge, action: onScoreAttack, locked: false, accent: "cyan",
    },
    {
      id: "INFINITE" as const, name: "INFINITE", subtitle: es ? "DESBLOQUEAR EN CAMPAÑA" : "UNLOCK THROUGH CAMPAIGN",
      description: es ? "Sobrevive a oleadas interminables de enemigos y alcanza nuevas fronteras de puntuación." : "Survive endless enemy waves and reach new scoring frontiers.",
      Icon: LockKeyhole, action: undefined, locked: true, accent: "violet",
    },
  ];
  if (artLayer) return (
    <PremiumArtNavigation layer={layer} section={section} tab={tab} language={language}
      onLanguage={onLanguage} onEnter={onEnter} onBack={onBack} onOpen={onOpen}
      onPlay={onPlay} onScoreAttack={onScoreAttack} hasInfiniteRecord={hasInfiniteRecord}
      nanoCredits={nanoCredits} purifiedEnergy={purifiedEnergy}/>
  );
  return (
    <section className="orbi-mobile-launch orbi-ux09" style={{ "--orbi-ux09-world": worldImage } as React.CSSProperties} data-testid="orbi-mobile-launch" data-layer={layer}
      aria-label={es ? "Centro de mando ORBI" : "ORBI command deck"}>
      <div className="orbi-ux09-scene" aria-hidden="true" />
      {layer === "WELCOME" && (
        <div className="orbi-mobile-launch__welcome orbi-ux09-welcome">
          <div className="orbi-ux09-identity">
            <span className="orbi-mobile-launch__kicker">ORBI ECOSYSTEM // FOTON-01</span>
            <h1>ORBI <em>ENERGY</em> SWARM</h1>
            <p>{es ? "SISTEMA TÁCTICO DE ENJAMBRE" : "TACTICAL SWARM COMMAND SYSTEM"}</p>
            <button className="orbi-mobile-launch__primary" data-testid="orbi-mobile-enter"
              onClick={onEnter}><Play size={22} fill="currentColor" />{es ? "ENTRAR" : "ENTER"}</button>
            <div className="orbi-mobile-launch__languages" role="group" aria-label={es ? "Idioma" : "Language"}>
              <Globe size={17} aria-hidden="true" />
              <button aria-label="Español" aria-pressed={es} onClick={() => onLanguage("es")}>ES</button>
              <button aria-label="English" aria-pressed={!es} onClick={() => onLanguage("en")}>EN</button>
            </div>
            <span className="orbi-mobile-launch__version">PUBLIC BETA · v0.2.0-beta.1</span>
          </div>
        </div>
      )}
      {layer === "HUB" && (
        <div className="orbi-mobile-launch__hub orbi-ux09-hub">
          <header className="orbi-ux09-hub-header">
            <div className="orbi-ux09-brand">
              <img src={`${import.meta.env.BASE_URL}ux09/orbi-launcher.svg`} alt="" aria-hidden="true" />
              <div><b>ORBI <em>ENERGY SWARM</em></b><span>ORBI // COMMAND DECK</span><h2>{es ? "CENTRO DE MANDO" : "COMMAND CENTER"}</h2></div>
            </div>
            <div className="orbi-ux09-metrics" aria-label={es ? "Recursos registrados" : "Saved resources"}>
              <span title={es ? "Nanocréditos obtenidos" : "Earned nano credits"}><Zap size={14} aria-hidden="true"/>{nanoCredits.toLocaleString(language)}</span>
              <span title={es ? "Energía purificada" : "Purified energy"}><Atom size={14} aria-hidden="true"/>{purifiedEnergy.toLocaleString(language)}</span>
              <button onClick={onBack} aria-label={es ? "Volver a portada" : "Return to title"}><ArrowLeft size={22}/></button>
            </div>
          </header>
          <div className="orbi-mobile-launch__tiles orbi-ux09-command-grid">
            {choices.map(({icon:Icon, label, description, tab:destination, art, ...rest}, idx) => (
              <button key={art} className={`orbi-ux09-tile orbi-ux09-tile--${art}`}
                data-testid={`orbi-mobile-menu-${destination.toLowerCase()}-${"section" in rest ? rest.section?.toLowerCase() : "info"}`}
                onClick={() => onOpen(destination, "section" in rest ? rest.section : "PLAY")}>
                <div className="orbi-ux09-tile-art" aria-hidden="true"><Icon className="orbi-ux09-tile-hero-icon" size={52}/></div>
                <div className="orbi-ux09-tile-caption"><span className="orbi-ux09-tile-icon"><Icon size={20}/></span>
                  <div><strong>{String(idx + 1).padStart(2, "0")} &nbsp; {label}</strong><small>{description}</small></div>
                  <ChevronRight size={17}/></div>
              </button>
            ))}
          </div>
        </div>
      )}
      {layer === "DETAIL" && (
        <div className="orbi-mobile-launch__detail orbi-ux09-detail">
          <div className="orbi-mobile-launch__heading orbi-ux09-detail-heading">
            <span className="orbi-mobile-launch__kicker">ORBI // {section === "PLAY" ? "MISSION CONTROL" : "HANGAR"}</span>
            <h2>{tab === "MAIN" ? (section === "PLAY" ? (es ? "MODOS DE JUEGO" : "GAME MODES") : (es ? "HANGAR Y REGISTROS" : "HANGAR & RECORDS")) : choices.find(x => x.tab === tab)?.label}</h2>
            <button onClick={onBack} data-testid="orbi-mobile-menu-back" aria-label={es ? "Volver al centro de mando" : "Back to command center"}><ArrowLeft size={24}/></button>
          </div>
          {tab === "MAIN" && section === "PLAY" && (
            <div className="orbi-ux09-modes-layout">
              <nav className="orbi-ux09-mode-sidebar" aria-label={es ? "Seleccionar modo" : "Select mode"}>
                {modes.map(mode => <button key={mode.id} className={`orbi-ux09-mode-nav orbi-ux09-mode-nav--${mode.accent}`}
                    aria-current={selectedMode === mode.id ? "true" : undefined} onClick={() => setSelectedMode(mode.id)}>
                  <mode.Icon size={22}/><span>{mode.name}</span>{mode.locked ? <LockKeyhole size={14}/> : <ChevronRight size={18}/>}
                </button>)}
              </nav>
              <div className="orbi-mobile-launch__modes orbi-ux09-mode-grid">
                {modes.map(mode => <article key={mode.id} className={`orbi-ux09-mode-card orbi-ux09-mode-card--${mode.accent}`}
                  data-selected={selectedMode === mode.id} data-locked={mode.locked}>
                    <div className="orbi-ux09-mode-art" aria-hidden="true"><mode.Icon size={56}/></div>
                    <div className="orbi-ux09-mode-text"><div className="orbi-ux09-mode-title">
                      {mode.locked ? <LockKeyhole size={22}/> : <mode.Icon size={22}/>}
                      <div><h3>{mode.name}</h3><strong>{mode.subtitle}</strong></div>
                    </div>
                      <p>{mode.description}</p>
                      {mode.locked ? (
                        <div className="orbi-ux09-mode-action orbi-ux09-mode-action--locked"
                          data-testid="orbi-mobile-infinite-locked" aria-disabled="true">
                          <LockKeyhole size={18}/>{hasInfiniteRecord ? (es ? "DESDE CAMPAÑA" : "FROM CAMPAIGN") : (es ? "BLOQUEADO" : "LOCKED")}
                        </div>
                      ) : (
                        <button data-testid={mode.id === "CAMPAIGN" ? "orbi-mobile-campaign" : "orbi-mobile-score-attack"}
                          className="orbi-ux09-mode-action" onClick={mode.action}>
                          {es ? "INICIAR" : "START"} <ChevronRight size={18}/>
                        </button>
                      )}
                    </div>
                  </article>)}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
