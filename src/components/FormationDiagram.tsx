import React from "react";
import { calculateSwarmOffset } from "../game/formations";
import { FormationType } from "../game/types";

/**
 * UX11-B: diagrams are composed from the live tactical geometry; ENERGY is
 * the neutral golden center and the small colored points are generic followers.
 * This is an illustration, not a claim that each color has a fixed slot.
 */
export const TACTICAL_FORMATION_IDS: FormationType[] = [
  FormationType.LINE,
  FormationType.CIRCLE,
  FormationType.DELTA,
  FormationType.SHIELD,
  FormationType.V_SHAPE,
  FormationType.SCATTERED,
];

type Locale = "es" | "en";

const FORMATION_BRIEFS: Record<FormationType, {
  es: { name: string; shape: string; effect: string; tradeoff: string };
  en: { name: string; shape: string; effect: string; tradeoff: string };
}> = {
  [FormationType.LINE]: {
    es: { name: "Línea de Asalto", shape: "Anillos orbitales defensivos", effect: "25% menos daño recibido", tradeoff: "Prioriza la supervivencia" },
    en: { name: "Assault Line", shape: "Defensive orbital rings", effect: "25% less incoming damage", tradeoff: "Prioritizes survival" },
  },
  [FormationType.CIRCLE]: {
    es: { name: "Círculo Colector", shape: "Matriz estelar de cinco puntas", effect: "Proyectiles 15% más rápidos", tradeoff: "15% más daño recibido" },
    en: { name: "Collector Circle", shape: "Five-point star matrix", effect: "15% faster projectiles", tradeoff: "15% more incoming damage" },
  },
  [FormationType.DELTA]: {
    es: { name: "Delta Convergente", shape: "Espiral orbital dinámica", effect: "Cobertura de posiciones en espiral", tradeoff: "Proyectiles 10% más lentos" },
    en: { name: "Convergent Delta", shape: "Dynamic orbital spiral", effect: "Spiral position coverage", tradeoff: "10% slower projectiles" },
  },
  [FormationType.SHIELD]: {
    es: { name: "Escudo Protector", shape: "Halo de interceptación exterior", effect: "Proyectiles 20% más rápidos", tradeoff: "15% más daño recibido" },
    en: { name: "Protective Shield", shape: "Outer interception halo", effect: "20% faster projectiles", tradeoff: "15% more incoming damage" },
  },
  [FormationType.V_SHAPE]: {
    es: { name: "Guardia Cruzada", shape: "Cuatro brazos diagonales en X", effect: "30% menos daño recibido", tradeoff: "Movimiento 10% más lento" },
    en: { name: "Cross Guard", shape: "Four diagonal X-shaped arms", effect: "30% less incoming damage", tradeoff: "10% slower movement" },
  },
  [FormationType.SCATTERED]: {
    es: { name: "Delta Concéntrica", shape: "Triángulos anidados: 3 / 9 / 18", effect: "10% menos daño recibido; +15% movilidad", tradeoff: "Requiere espacio cerca de los bordes" },
    en: { name: "Concentric Delta", shape: "Nested triangles: 3 / 9 / 18", effect: "10% less incoming damage; +15% movement", tradeoff: "Needs room near map edges" },
  },
};

export function getFormationBrief(type: FormationType, language: Locale) {
  return FORMATION_BRIEFS[type][language];
}

export const FormationDiagram = React.memo(function FormationDiagram({
  type, language,
}: { type: FormationType; language: Locale }) {
  const count = type === FormationType.SCATTERED ? 30 :
    type === FormationType.V_SHAPE || type === FormationType.DELTA ? 16 : 10;
  const positions = Array.from({ length: count }, (_, index) =>
    calculateSwarmOffset(type, index, count, 0, 0),
  );
  const name = getFormationBrief(type, language).name;
  return (
    <svg className="orbi-ux11b-diagram" viewBox="0 0 180 124"
      role="img" aria-label={language === "es" ? "Esquema táctico: " + name : "Tactical diagram: " + name}>
      <circle cx="90" cy="62" r="52" fill="none" stroke="#67e8f9" strokeOpacity=".14" strokeDasharray="3 7" />
      <circle cx="90" cy="62" r="32" fill="none" stroke="#67e8f9" strokeOpacity=".10" />
      <path d="M90 4V120 M17 62H163" stroke="#4bb6cb" strokeOpacity=".12" strokeWidth="1" />
      {positions.map((point, index) => {
        const x = 90 + point.x * .36;
        const y = 62 + point.y * .36;
        const color = ["#72e9fc", "#42e8be", "#ac99ff", "#f4c86f"][index % 4];
        return (
          <g key={index}>
            <line x1="90" y1="62" x2={x} y2={y} stroke={color} strokeOpacity=".14" />
            <circle cx={x} cy={y} r="5.3" fill={color} fillOpacity=".12" />
            <circle cx={x} cy={y} r="2.7" fill={color} stroke="#e8faff" strokeOpacity=".5" strokeWidth=".5" />
          </g>
        );
      })}
      <circle cx="90" cy="62" r="10" fill="#f5bf57" fillOpacity=".14" stroke="#ffd881" strokeWidth="1.6" />
      <path d="M90 55 L97 62 L90 69 L83 62 Z" fill="#ffdb84" stroke="#fff4cf" strokeWidth=".9" />
      <circle cx="90" cy="62" r="2.2" fill="#ffffff" />
    </svg>
  );
});
