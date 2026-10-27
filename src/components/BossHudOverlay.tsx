import React from "react";
import { BLACKOUT_DEVOURER_CANON } from "../game/waveDirector";
import {ARCHON_ATTACK_NAMES} from "../game/asteriaThresholdArchon";
import {OMEGA_ATTACK_NAMES} from "../game/ferrumOmegaFoundry";
import {SOLFERNAX_ATTACK_NAMES} from "../game/pyraSolfernax";
import { getBossChassisProfile } from "../game/bossChassis";
import { getInfiniteBossFamilyProfile } from "../game/infiniteBossFamily";
import type {
  BossChassisId,
  InfiniteBossIdentity,
} from "../game/types";
import { getBossCounterHint, resolveBossAttackId } from "../game/bossTelegraphGuide";
import { useGameTranslation } from "../i18n";

type BossLabelsMode = "FULL" | "IMPORTANT" | "OFF";

interface BossHudOverlayProps {
  bossPhase: number;
  bossHp: number;
  bossMaxHp: number;
  bossIntroTime: number | null;
  bossTransitionName: string | null;
  bossAttackName: string | null;
  bossShieldNodes: number;
  isCoreExposed: boolean;
  bossLabelsMode: BossLabelsMode;
  bossChassis?: BossChassisId;
  infiniteBossIdentity?: InfiniteBossIdentity;
  onSkipIntro: () => void;
}

const isImportantBossAttack = (attackName: string) => {
  const normalized = attackName.toLowerCase();
  return ["devourer_charge", "singularity_pulse", "rotating_eclipse_lanes",
    "telescopic", "beacon", "overload", "piston", "assembly", "conveyor",
    "molten", "thermal", "collapse"].some(
    (id) =>
      normalized.includes(id.replace(/_/g, " ")) ||
      normalized.includes("carga") ||
      normalized.includes("eclipse") ||
      normalized.includes("pulso") ||
      normalized.includes("singularidad") ||
      normalized.includes("charge") ||
      normalized.includes("pulse") ||
      normalized.includes("lane"),
  );
};

export const BossHudOverlay: React.FC<BossHudOverlayProps> = ({
  bossPhase,
  bossHp,
  bossMaxHp,
  bossIntroTime,
  bossTransitionName,
  bossAttackName,
  bossShieldNodes,
  isCoreExposed,
  bossLabelsMode,
  bossChassis = "DEVOURER",
  infiniteBossIdentity,
  onSkipIntro,
}) => {
  const { language } = useGameTranslation();
  const chassis = getBossChassisProfile(bossChassis);
  const family =
    bossChassis === "DEVOURER" && infiniteBossIdentity
      ? getInfiniteBossFamilyProfile(infiniteBossIdentity)
      : null;
  const displayName = family?.displayName ?? chassis.displayName;
  const subtitle = family?.subtitle ?? chassis.subtitle;
  const healthRatio = bossMaxHp > 0 ? bossHp / bossMaxHp : 0;
  const bossAttackId = resolveBossAttackId(
    bossAttackName,
    BLACKOUT_DEVOURER_CANON.attacks,
  );
  const archonHint=bossChassis==="ASTERIA_ARCHON" && bossAttackName
    ?bossAttackName===ARCHON_ATTACK_NAMES[1]
      ?(language==="es"?"Sal de la línea antes del barrido telescópico.":"Leave the marked line before the telescopic sweep.")
      :bossAttackName===ARCHON_ATTACK_NAMES[2]
        ?(language==="es"?"Muévete entre las tres líneas: los corredores cian son seguros.":"Move between the three lines: cyan corridors remain safe.")
        :bossAttackName===ARCHON_ATTACK_NAMES[3]
          ?(language==="es"?"Cruza la onda anular; vuelve al núcleo cuando se abra.":"Cross the ring wave, then strike the exposed core.")
          :null:null;
  const omegaHint=bossChassis==="FERRUM_OMEGA" && bossAttackName
    ?bossAttackName===OMEGA_ATTACK_NAMES[1]
      ?(language==="es"?"Sal de las dos trayectorias diagonales de los pistones.":"Leave both diagonal piston lanes.")
      :bossAttackName===OMEGA_ATTACK_NAMES[2]
        ?(language==="es"?"Destruye los engranajes: máximo cuatro simultáneos.":"Destroy assembled gears: at most four at once.")
        :bossAttackName===OMEGA_ATTACK_NAMES[3]
          ?(language==="es"?"Permanece entre las cintas y ataca el reactor abierto.":"Stay between belts and attack the open reactor.")
          :null:null;
  const pyraHint=bossChassis==="PYRA_SOLFERNAX" && bossAttackName
    ?bossAttackName===SOLFERNAX_ATTACK_NAMES[1]
      ?(language==="es"?"Esquiva entre los tres respiraderos; evita sus radios marcados.":
        "Move between the three vent rays and leave their marked paths.")
      :bossAttackName===SOLFERNAX_ATTACK_NAMES[2]
        ?(language==="es"?"Cruza por el carril central; las dos compuertas laterales se alternan.":
          "Use the central corridor while the side gates alternate.")
        :bossAttackName===SOLFERNAX_ATTACK_NAMES[3]
          ?(language==="es"?"Evita los dos arcos que colapsan; el anillo NO se cierra por completo.":
            "Dodge the two collapsing arcs; the ring never closes completely.")
          :null:null;
  const counterHint = pyraHint ?? omegaHint ?? archonHint ?? getBossCounterHint(bossAttackId, language);
  const healthPercent = Math.max(0, Math.min(100, Math.round(healthRatio * 100)));
  const showAttack =
    Boolean(bossAttackName) &&
    bossLabelsMode !== "OFF" &&
    (bossLabelsMode === "FULL" ||
      (bossAttackName ? isImportantBossAttack(bossAttackName) : false));

  return (
    <div
      className="orbi-boss-hud pointer-events-none"
      role="region"
      aria-labelledby="orbi-boss-title"
      data-boss-chassis={bossChassis}
    >
      <div className="orbi-boss-heading">
        <span className="orbi-boss-kicker">
          {bossChassis === "PYRA_SOLFERNAX"
            ? "⚠ PYRA // MAGMA CORE REACTOR"
            : bossChassis === "ASTERIA_ARCHON"
            ? "⚠ ASTERIA // ORBITAL THRESHOLD"
            : bossChassis === "FERRUM_OMEGA"
              ? "⚠ FERRUM // INDUSTRIAL REACTOR"
              : bossChassis === "DEVOURER" ? "⚠ MAJOR COLLAPSE DETECTED" : "⚠ RAID ESCALATION DETECTED"}
        </span>
        <div className="orbi-boss-title-row">
          <h2 id="orbi-boss-title" className="orbi-boss-title">{displayName}</h2>
          <span className="orbi-boss-phase">PHASE {bossPhase}</span>
        </div>
        <p className="orbi-boss-subtitle">{subtitle}</p>
      </div>

      <div
        className="orbi-boss-health"
        role="progressbar"
        aria-label={language === "es" ? "Integridad del jefe" : "Boss integrity"}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={healthPercent}
        aria-valuetext={`${healthPercent}%`}
      >
        <div className="orbi-boss-health-segment">
          <div
            className="orbi-boss-health-fill orbi-boss-health-fill--phase1"
            style={{ width: `${Math.max(0, Math.min(100, (healthRatio - 0.7) / 0.3 * 100))}%` }}
          />
        </div>
        <div className="orbi-boss-health-divider" />
        <div className="orbi-boss-health-segment">
          <div
            className="orbi-boss-health-fill orbi-boss-health-fill--phase2"
            style={{ width: `${Math.max(0, Math.min(100, (healthRatio - 0.35) / 0.35 * 100))}%` }}
          />
        </div>
        <div className="orbi-boss-health-divider" />
        <div className="orbi-boss-health-segment">
          <div
            className="orbi-boss-health-fill orbi-boss-health-fill--phase3"
            style={{ width: `${Math.max(0, Math.min(100, healthRatio / 0.35 * 100))}%` }}
          />
        </div>
      </div>

      <div className="orbi-boss-integrity">
        <span className="orbi-boss-integrity-label">
          INTEGRITY: {Math.ceil(bossHp)} / {bossMaxHp}
        </span>
        <strong>{healthPercent}%</strong>
      </div>

      <div className="sr-only" role="status" aria-live="assertive" aria-atomic="true">
        {bossTransitionName
          ? `${language === "es" ? "Mutación" : "Mutation"}: ${bossTransitionName}`
          : showAttack && bossAttackName
            ? `${language === "es" ? "Ataque" : "Attack"}: ${bossAttackName}${counterHint ? `. ${language === "es" ? "Respuesta" : "Counter"}: ${counterHint}` : ""}`
            : isCoreExposed
              ? (language === "es" ? "Núcleo expuesto. Daño aumentado." : "Core exposed. Increased damage.")
              : `${language === "es" ? "Fase" : "Phase"} ${bossPhase}`}
      </div>

      <div className="orbi-boss-alerts">
        {bossIntroTime !== null && (
          <div className="orbi-boss-alert orbi-boss-alert--intro pointer-events-auto">
            <span className="orbi-boss-alert-label">Threat approach</span>
            <button type="button" onClick={onSkipIntro}>
              <span className="orbi-boss-desktop-hint">[SPACE] </span>SKIP INTRO
            </button>
          </div>
        )}

        {bossTransitionName !== null && (
          <div className="orbi-boss-alert orbi-boss-alert--transition">
            <span className="orbi-boss-alert-label">MUTATION</span>
            <strong>{bossTransitionName}</strong>
          </div>
        )}

        {showAttack && bossAttackName && (
          <div className="orbi-boss-alert orbi-boss-alert--attack">
            <span className="orbi-boss-alert-pulse" aria-hidden="true" />
            <div className="orbi-boss-attack-copy">
              <span>ATTACK: {bossAttackName}</span>
              {counterHint && (
                <span className="orbi-boss-counter-hint">
                  {language === "es" ? "RESPUESTA" : "COUNTER"}: {counterHint}
                </span>
              )}
            </div>
          </div>
        )}

        {bossShieldNodes > 0 && (
          <div className="orbi-boss-alert orbi-boss-alert--shield">
            <span>🛡 {chassis.weakpoints.hudLabel}</span>
            <strong>{bossShieldNodes}</strong>
          </div>
        )}

        {isCoreExposed && (
          <div className="orbi-boss-alert orbi-boss-alert--critical">
            ⚠ CORE EXPOSED · INCREASED DAMAGE
          </div>
        )}
      </div>
    </div>
  );
};

export default BossHudOverlay;
