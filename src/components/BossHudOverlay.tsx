import React from "react";
import { BLACKOUT_DEVOURER_CANON } from "../game/waveDirector";
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
  onSkipIntro: () => void;
}

const isImportantBossAttack = (attackName: string) => {
  const normalized = attackName.toLowerCase();
  return ["devourer_charge", "singularity_pulse", "rotating_eclipse_lanes"].some(
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
  onSkipIntro,
}) => {
  const { language } = useGameTranslation();
  const healthRatio = bossMaxHp > 0 ? bossHp / bossMaxHp : 0;
  const bossAttackId = resolveBossAttackId(
    bossAttackName,
    BLACKOUT_DEVOURER_CANON.attacks,
  );
  const counterHint = getBossCounterHint(bossAttackId, language);
  const healthPercent = Math.max(0, Math.min(100, Math.round(healthRatio * 100)));
  const showAttack =
    Boolean(bossAttackName) &&
    bossLabelsMode !== "OFF" &&
    (bossLabelsMode === "FULL" ||
      (bossAttackName ? isImportantBossAttack(bossAttackName) : false));

  return (
    <div
      className="orbi-boss-hud pointer-events-none"
      role="status"
      aria-label={`${BLACKOUT_DEVOURER_CANON.displayName}, phase ${bossPhase}, ${healthPercent}% integrity`}
    >
      <div className="orbi-boss-heading">
        <span className="orbi-boss-kicker">⚠ MAJOR COLLAPSE DETECTED</span>
        <div className="orbi-boss-title-row">
          <h2 className="orbi-boss-title">{BLACKOUT_DEVOURER_CANON.displayName}</h2>
          <span className="orbi-boss-phase">PHASE {bossPhase}</span>
        </div>
        <p className="orbi-boss-subtitle">{BLACKOUT_DEVOURER_CANON.subtitle}</p>
      </div>

      <div className="orbi-boss-health" aria-label={`Boss integrity ${healthPercent}%`}>
        <div className="orbi-boss-health-segment">
          <div
            className="orbi-boss-health-fill orbi-boss-health-fill--phase1"
            style={{
              width: `${Math.max(0, Math.min(100, (healthRatio - 0.7) / 0.3 * 100))}%`,
            }}
          />
        </div>
        <div className="orbi-boss-health-divider" />
        <div className="orbi-boss-health-segment">
          <div
            className="orbi-boss-health-fill orbi-boss-health-fill--phase2"
            style={{
              width: `${Math.max(0, Math.min(100, (healthRatio - 0.35) / 0.35 * 100))}%`,
            }}
          />
        </div>
        <div className="orbi-boss-health-divider" />
        <div className="orbi-boss-health-segment">
          <div
            className="orbi-boss-health-fill orbi-boss-health-fill--phase3"
            style={{
              width: `${Math.max(0, Math.min(100, healthRatio / 0.35 * 100))}%`,
            }}
          />
        </div>
      </div>

      <div className="orbi-boss-integrity">
        <span className="orbi-boss-integrity-label">
          INTEGRITY: {Math.ceil(bossHp)} / {bossMaxHp}
        </span>
        <strong>{healthPercent}%</strong>
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
            <span>🛡 SHIELD NODES</span>
            <strong>{bossShieldNodes}</strong>
          </div>
        )}

        {isCoreExposed && (
          <div className="orbi-boss-alert orbi-boss-alert--critical">
            ⚠ CORE EXPOSED · DOUBLE DAMAGE
          </div>
        )}
      </div>
    </div>
  );
};

export default BossHudOverlay;
