import React from "react";
import { UpgradeDefinition } from "../game/upgrades";
import { useGameTranslation } from "../i18n";

interface UpgradeSelectorProps {
  choices: UpgradeDefinition[];
  onSelect: (upgrade: UpgradeDefinition) => void;
  onReroll: () => void;
  rerollsRemaining: number;
  activeRunUpgrades: Record<string, number>;
}

export const UpgradeSelector: React.FC<UpgradeSelectorProps> = ({
  choices,
  onSelect,
  onReroll,
  rerollsRemaining,
  activeRunUpgrades
}) => {
  const { language, t } = useGameTranslation();
  const firstSelectableUpgradeId =
    choices.find(
      (upgrade) =>
        (activeRunUpgrades[upgrade.id] || 0) <
        upgrade.maxStacks,
    )?.id;


  const getCategoryStyles = (category: string) => {
    switch (category) {
      case "OFFENSE":
        return {
          bg: "bg-rose-500/10 border-rose-500/30 text-rose-400",
          glow: "shadow-[0_0_20px_rgba(244,63,94,0.15)]",
          badge: "bg-rose-500/20 text-rose-300"
        };
      case "DEFENSE":
        return {
          bg: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
          glow: "shadow-[0_0_20px_rgba(6,182,212,0.15)]",
          badge: "bg-cyan-500/20 text-cyan-300"
        };
      case "SWARM":
        return {
          bg: "bg-amber-500/10 border-amber-500/30 text-amber-400",
          glow: "shadow-[0_0_20px_rgba(245,158,11,0.15)]",
          badge: "bg-amber-500/20 text-amber-300"
        };
      case "TACTICAL":
        return {
          bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
          glow: "shadow-[0_0_20px_rgba(16,185,129,0.15)]",
          badge: "bg-emerald-500/20 text-emerald-300"
        };
      case "FUSION":
        return {
          bg: "bg-violet-500/10 border-violet-500/30 text-violet-400",
          glow: "shadow-[0_0_20px_rgba(139,92,246,0.15)]",
          badge: "bg-violet-500/20 text-violet-300"
        };
      default:
        return {
          bg: "bg-slate-500/10 border-slate-500/30 text-slate-400",
          glow: "shadow-[0_0_20px_rgba(100,116,139,0.15)]",
          badge: "bg-slate-500/20 text-slate-300"
        };
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrade-selector-title"
      aria-describedby="upgrade-selector-description"
    >
      <div className="w-full max-w-4xl space-y-6 text-center">
        {/* Header Title */}
        <div className="space-y-1.5">
          <span className="text-xs font-mono font-black tracking-[0.25em] text-amber-400 uppercase">
            ⚡ {language === "es" ? "SINCRONIZADOR DE INTERMISIÓN" : "INTERMISSION SYNCHRONIZER"} ⚡
          </span>
          <h2 id="upgrade-selector-title" className="text-2xl md:text-4xl font-black text-white tracking-tight font-sans uppercase">
            {t("upgrades.chooseTitle")}
          </h2>
          <p id="upgrade-selector-description" className="text-xs md:text-sm text-slate-400 max-w-lg mx-auto">
            {language === "es"
              ? "Selecciona una mejora táctica para potenciar a FOTON y tu enjambre. Estas modificaciones duran solo en la partida actual."
              : "Choose a tactical retrofit to enhance FOTON and your swarm for the remaining sectors. These upgrades last for this run only."}
          </p>
        </div>

        {/* Upgrade Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 pt-2">
          {choices.map((upgrade) => {
            const currentStacks = activeRunUpgrades[upgrade.id] || 0;
            const isMaxed = currentStacks >= upgrade.maxStacks;
            const styles = getCategoryStyles(upgrade.category);

            // Dynamic translation lookup with fallbacks
            const localizedName = t(`upgrades.items.${upgrade.id}.name`);
            const localizedDesc = t(`upgrades.items.${upgrade.id}.description`);
            const localizedCategory = t(`upgrades.categories.${upgrade.category}`) || upgrade.category;

            return (
              <button
                key={upgrade.id}
                disabled={isMaxed}
                autoFocus={upgrade.id === firstSelectableUpgradeId}
                onClick={() => onSelect(upgrade)}
                className={`relative group flex flex-col items-center text-center p-5 rounded-xl border text-white transition-all duration-300 ${
                  isMaxed
                    ? "bg-slate-900/30 border-slate-900/60 opacity-50 cursor-not-allowed"
                    : `bg-slate-900/50 hover:bg-slate-900/90 border-slate-800 hover:border-amber-500/60 cursor-pointer hover:scale-[1.02] ${styles.glow}`
                }`}
              >
                {/* Category Badge */}
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase mb-4 ${styles.badge}`}>
                  {localizedCategory}
                </span>

                {/* Big Visual Icon/Emoji */}
                <span className="text-4xl md:text-5xl mb-4 group-hover:animate-pulse">
                  {upgrade.icon}
                </span>

                {/* Upgrade Info */}
                <div className="space-y-1.5 flex-1 w-full">
                  <h3 className="font-bold text-base md:text-lg tracking-tight group-hover:text-amber-400 transition">
                    {localizedName}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed min-h-[48px]">
                    {localizedDesc}
                  </p>
                </div>

                {/* Stack indicator */}
                <div className="mt-5 pt-3 w-full border-t border-slate-900 flex justify-between items-center text-[10px] font-mono text-slate-500">
                  <span className="uppercase">{t("upgrades.stack")} LEVEL:</span>
                  <span className={`font-bold uppercase ${isMaxed ? "text-rose-500" : currentStacks > 0 ? "text-amber-400" : "text-slate-400"}`}>
                    {isMaxed ? t("upgrades.maxLevel") : `${currentStacks} / ${upgrade.maxStacks}`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tactical Reroll */}
        <div className="pt-4 flex flex-col items-center space-y-2">
          <button
            disabled={rerollsRemaining <= 0}
            onClick={onReroll}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border font-mono text-xs font-bold transition-all uppercase ${
              rerollsRemaining <= 0
                ? "bg-slate-900/20 border-slate-900/40 text-slate-600 cursor-not-allowed"
                : "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 hover:border-amber-500 text-amber-400 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.05)]"
            }`}
          >
            🔄 {t("upgrades.reroll")}
            <span className="bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-black">
              {rerollsRemaining} {language === "es" ? "RESTANTES" : "LEFT"}
            </span>
          </button>
          <span className="text-[10px] font-mono text-slate-500 leading-normal">
            {language === "es"
              ? "Consume 1 intento de regeneración para aleatorizar la selección de mejoras actuales."
              : "Spend 1 reroll charge to randomize the current selection options."}
          </span>
        </div>
      </div>
    </div>
  );
};
export default UpgradeSelector;
