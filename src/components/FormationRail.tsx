import React from "react";
import { Compass, Shield, Zap, Target, Flame, Users } from "lucide-react";
import { FormationType } from "../game/types";
import { FORMATIONS } from "../game/formations";
import { playClickSound } from "../game/audio";
import { useGameTranslation } from "../i18n";

interface FormationRailProps {
  activeFormation: FormationType;
  onChangeFormation: (type: FormationType) => void;
}

export const FormationRail: React.FC<FormationRailProps> = ({
  activeFormation,
  onChangeFormation
}) => {
  const { language, t } = useGameTranslation();

  const list = [
    { type: FormationType.LINE, icon: <Shield size={13} />, key: "1" },
    { type: FormationType.CIRCLE, icon: <Flame size={13} />, key: "2" },
    { type: FormationType.DELTA, icon: <Zap size={13} />, key: "3" },
    { type: FormationType.SHIELD, icon: <Target size={13} />, key: "4" },
    { type: FormationType.V_SHAPE, icon: <Compass size={13} />, key: "5" },
    { type: FormationType.SCATTERED, icon: <Users size={13} />, key: "6" }
  ];

  const clickItem = (type: FormationType) => {
    playClickSound();
    onChangeFormation(type);
  };

  return (
    <div className="w-full bg-slate-950/70 border border-slate-900 rounded-xl p-2.5 shadow-xl backdrop-blur-md select-none text-white flex flex-col gap-2">
      <div className="text-[10px] font-mono text-slate-500 uppercase flex items-center justify-between">
        <span>
          {language === "es"
            ? "Vectores de Enjambre Táctico (Cambiar Teclas 1-6)"
            : "Tactical Swarm Vectors (Align 1-6 Keys)"}
        </span>
        <span className="text-[9px] text-amber-500 bg-amber-500/10 px-1 py-0.2 rounded font-mono font-bold">HOTKEYS</span>
      </div>

      {/* RAILING */}
      <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {list.map((item) => {
          const cfg = FORMATIONS[item.type];
          const isActive = activeFormation === item.type;
          const localizedName = t(`formations.${item.type}.name`) || cfg.name;

          return (
            <button
              key={item.type}
              onClick={() => clickItem(item.type)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg shrink-0 font-mono text-xs font-semibold cursor-pointer border transition ${
                isActive
                  ? "bg-amber-500 text-black border-amber-400 font-bold shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                  : "bg-slate-900/60 border-slate-800 hover:bg-slate-850 text-slate-300"
              }`}
            >
              {item.icon}
              <div className="text-left">
                <div className="text-[10px] leading-tight font-bold">{localizedName}</div>
                <div className="text-[8px] opacity-70 leading-none">
                  {language === "es" ? "Tecla" : "Key"} {item.key}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default FormationRail;
