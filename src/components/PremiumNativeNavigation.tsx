import React, { useState } from "react";
import { FormationDiagram, getFormationBrief, TACTICAL_FORMATION_IDS } from "./FormationDiagram";
import { FormationType } from "../game/types";
import {
  ArrowLeft, Atom, BookOpen, ChevronRight, Compass, Cpu, Gamepad2,
  Globe, Info, LockKeyhole, Play, Settings, Shield, Sparkles, Zap,
  Gauge, Orbit, Radio, Target, Move,
} from "lucide-react";
import type { MobileLaunchLayer, MobileLaunchSection, MobileLaunchTab } from "./MobileLaunchNavigation";

/**
 * UX10-C. Fully composited cinematic launch: the background has NO baked
 * labels or buttons. All identity, translations, counters and actions are
 * accessible HTML. The same geometry is used for ES/EN.
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

const pages = [
  { key: "modes", Icon: Gamepad2, tab: "MAIN", section: "PLAY", es: "Modos de juego", en: "Game modes", esSub: "Campaña y desafíos", enSub: "Campaign and challenges", id: "orbi-mobile-menu-main-play" },
  { key: "hangar", Icon: Cpu, tab: "MAIN", section: "HANGAR", es: "Hangar y registro", en: "Hangar & records", esSub: "Piloto y progreso", enSub: "Pilot and progress", id: "orbi-mobile-menu-main-hangar" },
  { key: "tactics", Icon: Compass, tab: "HOW_TO", section: "PLAY", es: "Táctica", en: "Tactics", esSub: "Seis formaciones EVO8", enSub: "Six EVO8 formations", id: "orbi-mobile-menu-how_to-info" },
  { key: "codex", Icon: BookOpen, tab: "CODEX", section: "PLAY", es: "Códice", en: "Codex", esSub: "Las energías ORBI", enSub: "The ORBI energies", id: "orbi-mobile-menu-codex-info" },
  { key: "controls", Icon: Shield, tab: "CONTROLS", section: "PLAY", es: "Controles", en: "Controls", esSub: "Domina tu enjambre", enSub: "Master your swarm", id: "orbi-mobile-menu-controls-info" },
  { key: "settings", Icon: Settings, tab: "SETTINGS", section: "PLAY", es: "Ajustes", en: "Settings", esSub: "Audio y rendimiento", enSub: "Audio and performance", id: "orbi-mobile-menu-settings-info" },
  { key: "about", Icon: Info, tab: "ABOUT", section: "PLAY", es: "Acerca de", en: "About", esSub: "Universo ORBI", enSub: "The ORBI universe", id: "orbi-mobile-menu-about-info" },
] as const;

const formations = [
  { key: "01", Icon: Target, es: "Línea de Asalto", en: "Assault Line", descEs: "Presión frontal", descEn: "Forward pressure" },
  { key: "02", Icon: Orbit, es: "Círculo Colector", en: "Collector Circle", descEs: "Protección orbital", descEn: "Orbital protection" },
  { key: "03", Icon: Zap, es: "Delta Convergente", en: "Convergent Delta", descEs: "Ataque enfocado", descEn: "Focused attack" },
  { key: "04", Icon: Shield, es: "Escudo Protector", en: "Protective Shield", descEs: "Defensa del núcleo", descEn: "Core defense" },
  { key: "05", Icon: Move, es: "Guardia Cruzada", en: "Cross Guard", descEs: "Cobertura táctica", descEn: "Tactical coverage" },
  { key: "06", Icon: Sparkles, es: "Delta Concéntrica", en: "Concentric Delta", descEs: "3 / 9 / 18 posiciones", descEn: "3 / 9 / 18 positions" },
] as const;

const modes = [
  { key: "campaign", Icon: Sparkles, es: "CAMPAÑA", en: "CAMPAIGN", descEs: "Explora sectores, recluta energías y protege a ENERGY de Blackout.", descEn: "Explore sectors, recruit energies and protect ENERGY against Blackout.", testId: "orbi-mobile-campaign", lock: false },
  { key: "score", Icon: Gauge, es: "SCORE ATTACK", en: "SCORE ATTACK", descEs: "Desafío contrarreloj: consigue la mejor puntuación.", descEn: "Race the clock and set a new high score.", testId: "orbi-mobile-score-attack", lock: false },
  { key: "infinite", Icon: LockKeyhole, es: "INFINITE", en: "INFINITE", descEs: "Modo de progresión condicionado a la campaña.", descEn: "Progression mode linked to the campaign.", testId: "orbi-mobile-infinite-locked", lock: true },
] as const;

export const PremiumNativeNavigation: React.FC<Props> = ({
  layer, section, tab, language, onLanguage, onEnter, onBack, onOpen,
  onPlay, onScoreAttack, nanoCredits = 0, purifiedEnergy = 0, hasInfiniteRecord,
}) => {
  const es = language === "es";
  const [selectedMode, setSelectedMode] = useState("campaign");
  const [selectedFormation, setSelectedFormation] = useState<FormationType>(FormationType.LINE);
  const cleanArt = "url('" + import.meta.env.BASE_URL + "ux09/orbi-command-world.svg')";
  // Crop ONLY the text-free left illustrated region of the approved cinematic WebP.
  // All interactive copy and controls stay native and identical in ES/EN.
  const cinematicPortrait = "url('" + import.meta.env.BASE_URL + "ux09/premium/welcome.webp')";
  const current = pages.find(item => item.tab === tab && item.section === section);
  const nativeBackgroundStyle = { "--ux10c-clean-art": cleanArt, "--ux10c-hero-art": cinematicPortrait, "--orbi-ux09-world": cleanArt } as React.CSSProperties;
  const langPicker = (
    <div className="orbi-ux10c-language" role="group" aria-label={es ? "Idioma" : "Language"}>
      <Globe size={14} aria-hidden="true" />
      <button type="button" aria-label="Español" aria-pressed={es} onClick={() => onLanguage("es")}>ES</button>
      <button type="button" aria-label="English" aria-pressed={!es} onClick={() => onLanguage("en")}>EN</button>
    </div>
  );
  const isModes = layer === "DETAIL" && tab === "MAIN" && section === "PLAY";
  const isTactics = layer === "DETAIL" && tab === "HOW_TO" && section === "PLAY";
  const isInfo = layer === "DETAIL" && !isModes && !isTactics;
  return (
    <section
      className="orbi-mobile-launch orbi-ux09 orbi-ux10c"
      data-testid="orbi-mobile-launch" data-layer={layer}
      data-premium-art="world-clean" data-ui-composition="native"
      aria-label={es ? "Centro de Mando ORBI" : "ORBI Command Center"}
      style={nativeBackgroundStyle}
    >
      <div className="orbi-ux09-scene orbi-ux10c-scene" aria-hidden="true" />
      <div className="orbi-ux10c-scanline" aria-hidden="true" />
      {layer === "WELCOME" && (
        <div className="orbi-ux10c-cover">
          <div className="orbi-ux10c-edition"><span className="orbi-ux10c-edition-led" /> ORBI ECOSYSTEM <span>//</span> ENERGY-01</div>
          <div className="orbi-ux10c-cover-body">
            <div className="orbi-ux10c-eyebrow"><span className="orbi-ux10c-eyebrow-line"/> SYSTEM // 2026 <span className="orbi-ux10c-eyebrow-line"/></div>
            <h1>ORBI <em>ENERGY</em><span>SWARM</span></h1>
            <p className="orbi-ux10c-subtitle">{es ? "SISTEMA TÁCTICO DE ENJAMBRE" : "TACTICAL SWARM COMMAND SYSTEM"}</p>
            <div className="orbi-ux10c-launch-action">
              <button className="orbi-ux10c-enter" data-testid="orbi-mobile-enter" type="button" onClick={onEnter}>
                <Play size={22} fill="currentColor" aria-hidden="true" /> {es ? "ENTRAR" : "ENTER"} <ChevronRight size={20} aria-hidden="true"/>
              </button>
            </div>
            {langPicker}
            <span className="orbi-ux10c-beta">PUBLIC BETA · v0.2.0-beta.1 <span>—</span> © 2026 ORBI ECOSYSTEM</span>
          </div>
          <div className="orbi-ux10c-coordinate" aria-hidden="true">ORBI / SWARM PROTOCOL · 01</div>
        </div>
      )}
      {layer === "HUB" && (
        <div className="orbi-ux10c-hub">
          <header className="orbi-ux10c-header">
            <div className="orbi-ux10c-hub-brand">
              <img src={import.meta.env.BASE_URL + "ux09/orbi-launcher.svg"} alt="" aria-hidden="true" />
              <div className="orbi-ux10c-brand-copy">
                <span className="orbi-ux10c-overline">ORBI ECOSYSTEM // ENERGY-01</span>
                <strong>ORBI <em>ENERGY SWARM</em></strong>
                <h2>{es ? "CENTRO DE MANDO" : "COMMAND CENTER"}</h2>
              </div>
            </div>
            <div className="orbi-ux10c-header-actions">
              <div className="orbi-ux10c-resource" title={es ? "Nanocréditos acumulados" : "Accumulated nano credits"}><Zap size={16} aria-hidden="true"/><span>{nanoCredits.toLocaleString(language)}</span><small>NC</small></div>
              <div className="orbi-ux10c-resource" title={es ? "Energía purificada" : "Purified energy"}><Atom size={16} aria-hidden="true"/><span>{purifiedEnergy.toLocaleString(language)}</span><small>PE</small></div>
              {langPicker}
              <button className="orbi-ux10c-back" type="button" aria-label={es ? "Volver a portada" : "Back to title"} onClick={onBack}><ArrowLeft size={20}/></button>
            </div>
          </header>
          <div className="orbi-mobile-launch__tiles orbi-ux09-command-grid orbi-ux10c-command-grid">
            {pages.map((item, i) => (
              <button type="button" key={item.key}
                data-testid={item.id}
                className={"orbi-ux09-tile orbi-ux10c-tile orbi-ux10c-tile--" + item.key}
                onClick={() => onOpen(item.tab, item.section)}>
                <div className="orbi-ux10c-tile-picture" aria-hidden="true">
                  <item.Icon size={38} strokeWidth={1.3}/>
                  <span className="orbi-ux10c-tile-rune">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="orbi-ux10c-tile-copy">
                  <span className="orbi-ux10c-tile-index">{String(i + 1).padStart(2, "0")} / 07 <ChevronRight size={13}/></span>
                  <strong>{es ? item.es : item.en}</strong>
                  <small>{es ? item.esSub : item.enSub}</small>
                </div>
              </button>
            ))}
          </div>
          <footer className="orbi-ux10c-footnote"><span className="orbi-ux10c-edition-led"/> ORBI SYSTEMS ONLINE <span>© ORBI ECOSYSTEM · 2026</span></footer>
        </div>
      )}
      {layer === "DETAIL" && (
        <div className={"orbi-ux10c-detail" + (isInfo ? " orbi-ux10c-detail--info" : "")}>
          <header className="orbi-ux10c-detail-header">
            <div><span className="orbi-ux10c-overline">ORBI // {section === "HANGAR" ? "HANGAR" : "MISSION CONTROL"}</span>
              <h2>{isModes ? (es ? "MODOS DE JUEGO" : "GAME MODES") :
                isTactics ? (es ? "TÁCTICA Y FORMACIONES" : "TACTICS & FORMATIONS") :
                  (es ? current?.es : current?.en) || (es ? "CENTRO DE MANDO" : "COMMAND CENTER")}</h2>
            </div>
            <div className="orbi-ux10c-header-actions">
              {langPicker}
              <button type="button" className="orbi-ux10c-back" data-testid="orbi-mobile-menu-back" aria-label={es ? "Volver al Centro de Mando" : "Back to Command Center"} onClick={onBack}><ArrowLeft size={21}/></button>
            </div>
          </header>
          {isModes && (
            <div className="orbi-ux10c-modes">
              {modes.map(mode => (
                <article key={mode.key} className={"orbi-ux09-mode-card orbi-ux10c-mode orbi-ux10c-mode--" + mode.key}
                  data-selected={selectedMode === mode.key} data-locked={mode.lock}>
                  <div className="orbi-ux10c-mode-art" aria-hidden="true"><mode.Icon size={44} strokeWidth={1.35} /></div>
                  <div className="orbi-ux10c-mode-body">
                    <span className="orbi-ux10c-overline">{mode.key.toUpperCase()}</span>
                    <h3>{es ? mode.es : mode.en}</h3>
                    <p>{es ? mode.descEs : mode.descEn}</p>
                    {mode.lock ? (
                      <div className="orbi-ux10c-mode-locked" data-testid="orbi-mobile-infinite-locked" aria-disabled="true"><LockKeyhole size={15}/>{hasInfiniteRecord ? (es ? "DESDE CAMPAÑA" : "FROM CAMPAIGN") : (es ? "BLOQUEADO" : "LOCKED")}</div>
                    ) : (
                      <button type="button" data-testid={mode.testId} className="orbi-ux10c-mode-start"
                        onClick={mode.key === "campaign" ? onPlay : onScoreAttack}
                        onFocus={() => setSelectedMode(mode.key)}><Play size={15} fill="currentColor" />{es ? "INICIAR" : "START"}<ChevronRight size={16}/></button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
          {isTactics && (
            <div className="orbi-ux10c-tactics">
              <p className="orbi-ux11b-tactics-intro">
                {es ? "Selecciona una formación para consultar su geometría y sus ventajas reales. Durante la partida: teclas 1–6 o selector táctil."
                    : "Select a formation to inspect its geometry and verified benefits. In battle: keys 1–6 or the touch selector."}
              </p>
              <div className="orbi-ux10c-formation-grid" role="group"
                aria-label={es ? "Seis formaciones tácticas" : "Six tactical formations"}>
                {formations.map((f, index) => {
                  const type = TACTICAL_FORMATION_IDS[index];
                  const brief = getFormationBrief(type, language);
                  return (
                    <button type="button" className="orbi-ux10c-formation"
                      key={f.key} data-formation={type} aria-pressed={selectedFormation === type}
                      onClick={() => setSelectedFormation(type)}>
                      <div className="orbi-ux11b-card-art"><FormationDiagram type={type} language={language} /></div>
                      <div className="orbi-ux11b-card-copy">
                        <span>{f.key} / 06</span>
                        <strong>{es ? f.es : f.en}</strong>
                        <small>{brief.shape}</small>
                        <em>{brief.effect}</em>
                      </div>
                    </button>
                  );
                })}
              </div>
              <aside className="orbi-ux11b-formation-info" aria-live="polite">
                <strong>{getFormationBrief(selectedFormation, language).name}</strong>
                <span>{getFormationBrief(selectedFormation, language).effect}</span>
                <small>{getFormationBrief(selectedFormation, language).tradeoff}</small>
              </aside>
              <button type="button" className="orbi-ux10c-manual" data-testid="orbi-ux09b-formation-manual"
                onClick={() => onOpen("HOW_TO", "HANGAR")}><Radio size={17}/>{es ? "ABRIR MANUAL TÁCTICO" : "OPEN TACTICAL MANUAL"}<ChevronRight size={17}/></button>
            </div>
          )}
          {isInfo && (
            <p className="orbi-ux10c-info-hint">{es ? "DATOS Y CONFIGURACIÓN DEL PILOTO" : "PILOT DATA & CONFIGURATION"}</p>
          )}
        </div>
      )}
    </section>
  );
};
export default PremiumNativeNavigation;
