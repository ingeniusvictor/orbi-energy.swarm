/** UX14-A: one authoritative four-band shield projection for every HUD surface.
 * Thresholds are percentages of the actual max shield, not a fixed 100 HP.
 * 70-100 GREEN | 50-<70 CYAN | 25-<50 AMBER | 0-<25 RED.
 */
export type ShieldThreatBand = "STABLE" | "CAUTION" | "DANGER" | "CRITICAL";
export interface ShieldThreatPresentation {
  percent: number;
  band: ShieldThreatBand;
  fill: string;
  text: string;
  glow: string;
}
export function projectShieldThreat(shield: number, shieldMax: number): ShieldThreatPresentation {
  const max = Number.isFinite(shieldMax) && shieldMax > 0 ? shieldMax : 100;
  const safe = Number.isFinite(shield) ? shield : 0;
  const percent = Math.max(0, Math.min(100, (safe / max) * 100));
  if (percent >= 70) return { percent, band: "STABLE", fill: "#20d981", text: "#4ade80", glow: "#19a86a" };
  if (percent >= 50) return { percent, band: "CAUTION", fill: "#22d3ee", text: "#67e8f9", glow: "#0891b2" };
  if (percent >= 25) return { percent, band: "DANGER", fill: "#fb923c", text: "#fdba74", glow: "#f97316" };
  return { percent, band: "CRITICAL", fill: "#ef4444", text: "#fca5a5", glow: "#dc2626" };
}
