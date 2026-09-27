export type BossHintLanguage = "es" | "en";

const BOSS_COUNTER_HINTS: Record<
  string,
  Record<BossHintLanguage, string>
> = {
  devourer_beam: {
    es: "Muévete perpendicular al barrido y evita seguir su eje.",
    en: "Move perpendicular to the sweep and leave its firing axis.",
  },
  gravity_well: {
    es: "Sal del campo marcado antes del colapso y recompón la formación.",
    en: "Escape the marked field before collapse, then rebuild formation.",
  },
  orbital_shards: {
    es: "Mantén movilidad lateral y usa defensa si el espacio se cierra.",
    en: "Keep lateral movement and use defense when space gets tight.",
  },
  blackout_sweep: {
    es: "Busca el carril seguro y entra antes de que cierre el barrido.",
    en: "Find the safe lane and enter it before the sweep closes.",
  },
  singularity_pulse: {
    es: "Abre distancia del núcleo antes de la descarga concéntrica.",
    en: "Create distance from the core before the concentric discharge.",
  },
  rotating_eclipse_lanes: {
    es: "Lee la rotación y avanza con el carril seguro, no contra él.",
    en: "Read the rotation and travel with the safe lane, not against it.",
  },
  devourer_charge: {
    es: "Esquiva lateralmente cuando fije el vector de carga.",
    en: "Dodge laterally once the charge vector locks.",
  },
};

export const resolveBossAttackId = (
  attackName: string | null | undefined,
  attacks: readonly { id: string; displayName: string }[],
) => {
  if (!attackName) return null;
  const normalized = attackName.trim().toLowerCase();

  return (
    attacks.find(
      (attack) =>
        attack.id.toLowerCase() === normalized ||
        attack.displayName.trim().toLowerCase() === normalized,
    )?.id ?? null
  );
};

export const getBossCounterHint = (
  attackId: string | null | undefined,
  language: BossHintLanguage,
) => {
  if (!attackId) return null;
  return BOSS_COUNTER_HINTS[attackId]?.[language] ?? null;
};
