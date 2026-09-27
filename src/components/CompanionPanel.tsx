import React, { useState, useRef, useEffect } from "react";
import { Users, Database, BookOpen, Sparkles, Coins, Lock, Check } from "lucide-react";
import { GameStats, OrbiMember, DialogueMessage } from "../game/types";
import { UPGRADES } from "../game/constants";
import { playClickSound } from "../game/audio";
import { useGameTranslation, formatNumber } from "../i18n";

interface CompanionPanelProps {
  stats: GameStats;
  swarm: OrbiMember[];
  dialogueLog: DialogueMessage[];
  upgradesLevel: Record<string, number>;
  nanoCredits: number;
  onBuyUpgrade: (upgradeId: string) => void;
}

export const CompanionPanel: React.FC<CompanionPanelProps> = ({
  stats,
  swarm,
  dialogueLog,
  upgradesLevel,
  nanoCredits,
  onBuyUpgrade
}) => {
  const { language, t } = useGameTranslation();
  const [activeTab, setActiveTab] = useState<"SWARM" | "CIV" | "LOG" | "RELICS">("SWARM");
  const logContainerRef = useRef<HTMLDivElement>(null);

  const coreLevel = upgradesLevel?.quantum_core || 0;
  const capacityLimit = coreLevel >= 3 ? 60 : (coreLevel === 2 ? 48 : (coreLevel === 1 ? 36 : 24));

  const clickTab = (tab: "SWARM" | "CIV" | "LOG" | "RELICS") => {
    playClickSound();
    setActiveTab(tab);
  };

  // Scroll to bottom of log when dialogue updates
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [dialogueLog, activeTab]);

  return (
    <div className="w-full lg:w-[330px] shrink-0 bg-slate-950/70 border border-slate-900 rounded-xl p-3 md:p-4 shadow-xl backdrop-blur-md text-white select-none flex flex-col h-[400px] lg:h-[580px]">
      
      {/* TABS SELECTOR */}
      <div className="flex bg-slate-900/60 p-1 rounded-lg gap-1 border border-slate-850 mb-3 text-xs uppercase">
        <button
          onClick={() => clickTab("SWARM")}
          className={`flex-1 py-1.5 rounded flex justify-center items-center gap-1.5 transition ${
            activeTab === "SWARM" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold" : "text-slate-400 hover:text-white"
          }`}
        >
          <Users size={12} />
          {t("hud.swarm")}
        </button>
        <button
          onClick={() => clickTab("CIV")}
          className={`flex-1 py-1.5 rounded flex justify-center items-center gap-1.5 transition ${
            activeTab === "CIV" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold" : "text-slate-400 hover:text-white"
          }`}
        >
          <Database size={12} />
          {language === "es" ? "CÓDICE" : "CIV"}
        </button>
        <button
          onClick={() => clickTab("LOG")}
          className={`flex-1 py-1.5 rounded flex justify-center items-center gap-1.5 transition ${
            activeTab === "LOG" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold" : "text-slate-400 hover:text-white"
          }`}
        >
          <BookOpen size={12} />
          {language === "es" ? "REGISTRO" : "LOG"}
        </button>
        <button
          onClick={() => clickTab("RELICS")}
          className={`flex-1 py-1.5 rounded flex justify-center items-center gap-1.5 transition relative ${
            activeTab === "RELICS" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold" : "text-slate-400 hover:text-white"
          }`}
        >
          <Sparkles size={12} />
          {language === "es" ? "RELIQUIAS" : "RELICS"}
          {nanoCredits >= 15 && <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />}
        </button>
      </div>

      {/* TAB CONTENT CARDS */}
      <div className="flex-1 overflow-y-auto pr-1">

        {/* 1. SWARM ROSTER LIST */}
        {activeTab === "SWARM" && (
          <div className="space-y-3 animate-fadeIn">
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 border-b border-slate-900 pb-1.5 uppercase">
              <span>{t("cockpit.activeRoster")}</span>
              <span>{swarm.length} / {capacityLimit} {t("hud.follower_plural")}</span>
            </div>

            {upgradesLevel && upgradesLevel.mitosis_relic > 0 && (
              <div className="bg-fuchsia-950/20 border border-fuchsia-500/20 text-fuchsia-400 p-2 rounded text-[8.5px] font-mono flex justify-between items-center animate-pulse">
                <span>⚡ {language === "es" ? `SISTEMA DE MITOSIS ACTIVO (NV ${upgradesLevel.mitosis_relic})` : `MITOSIS SYSTEM ACTIVE (LV ${upgradesLevel.mitosis_relic})`}</span>
                <span>+{upgradesLevel.mitosis_relic * 10}% DUP CHANCE</span>
              </div>
            )}

            {swarm.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500 font-mono italic">
                {language === "es"
                  ? "No hay recolectores Orbi adicionales activos. ¡Recluta Orbis salvajes!"
                  : "No supplementary Orbi collectors active. Gather Wild Orbis!"}
              </div>
            ) : (
              <div className="space-y-1.5 max-h-[300px] lg:max-h-[400px] overflow-y-auto pr-0.5">
                {swarm.map((member, idx) => {
                  const affinityColors: Record<string, string> = {
                    solar: "text-amber-400 border-amber-500/30 bg-amber-500/10",
                    hydro: "text-sky-400 border-sky-500/30 bg-sky-500/10",
                    wind: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
                    thermal: "text-red-400 border-red-500/30 bg-red-500/10",
                    nuclear: "text-violet-400 border-violet-500/30 bg-violet-500/10",
                    quantum: "text-pink-400 border-pink-500/30 bg-pink-500/10"
                  };
                  const affColor = affinityColors[member.affinity] || "text-slate-400 border-slate-500/30 bg-slate-500/10";
                  return (
                    <div key={member.id} className="bg-slate-900/40 border border-slate-850/60 p-2 rounded flex justify-between items-center hover:bg-slate-900/70 transition">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full inline-block animate-pulse shadow-[0_0_8px_currentColor]"
                          style={{ backgroundColor: member.color, color: member.color }}
                        />
                        <div>
                          <div className="text-xs font-bold font-mono text-white flex items-center gap-1">
                            <span>{member.name}</span>
                            <span className="text-[8px] text-slate-500">#{idx + 1}</span>
                            <span className="text-[7.5px] font-mono px-1 border border-slate-800 rounded bg-slate-950/40 text-slate-400">
                              {member.personality}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`text-[7.5px] font-bold font-mono uppercase px-1 py-0.1 border rounded ${affColor}`}>
                              {member.affinity}
                            </span>
                            <span className="text-[8px] font-mono text-slate-400 uppercase">
                              {member.combatRole?.toUpperCase() || "BEAM"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-[9px] font-mono text-right text-slate-400 flex flex-col justify-center shrink-0">
                        <div className="text-white font-bold text-[9.5px]">LV {member.level || 1}</div>
                        <div className="text-[8px] text-slate-500">Rate: {(1.0 / (member.shootCooldown || 120) * 60).toFixed(1)}/s</div>
                        <div className="text-[7px] text-cyan-400 font-bold uppercase tracking-wider">ACTIVE</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 2. CIV / PERMANENT ACHIEVEMENT ARCHIVES */}
        {activeTab === "CIV" && (
          <div className="space-y-3 animate-fadeIn">
            <div className="text-[10px] font-mono text-slate-400 border-b border-slate-900 pb-1.5 uppercase">
              {language === "es" ? "TRANSMISIONES DE LA CIVILIZACIÓN ACUMULADAS" : "CUMULATIVE CIVILIZATION TRANSMISSIONS"}
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs uppercase font-mono">
              <div className="bg-slate-900/50 p-2 rounded border border-slate-850/40">
                <div className="text-[9px] text-slate-500">{t("startScreen.totalMissions")}</div>
                <div className="font-bold text-white mt-0.5">{stats.totalRuns}</div>
              </div>
              <div className="bg-slate-900/50 p-2 rounded border border-slate-850/40">
                <div className="text-[9px] text-slate-500">{language === "es" ? "PLANETAS PURGADOS" : "PURIFIED GRIDS"}</div>
                <div className="font-bold text-emerald-400 mt-0.5">{stats.totalVictories}</div>
              </div>
              <div className="bg-slate-900/50 p-2 rounded border border-slate-850/40">
                <div className="text-[9px] text-slate-500">{language === "es" ? "AMENAZAS ELIMINADAS" : "THREATS ELIMINATED"}</div>
                <div className="font-bold text-rose-400 mt-0.5">{formatNumber(stats.totalEnemiesDestroyed)}</div>
              </div>
              <div className="bg-slate-900/50 p-2 rounded border border-slate-850/40">
                <div className="text-[9px] text-slate-500">{language === "es" ? "RECURSOS COSECHADOS" : "RESOURCES HARVESTED"}</div>
                <div className="font-bold text-cyan-400 mt-0.5">{formatNumber(stats.totalResourcesCollected)}</div>
              </div>
              <div className="bg-slate-900/50 p-2 rounded border border-slate-850/40 col-span-2">
                <div className="text-[9px] text-slate-500">{language === "es" ? "RECORD MÁXIMO ENERGÍA PURIFICADA" : "PURIFIED ENERGY HIGH-SCORE"}</div>
                <div className="font-bold text-amber-400 mt-0.5 text-sm">{formatNumber(stats.highScore)} CE</div>
              </div>
            </div>

            {/* ACHIEVEMENTS / MEMORIES CHIPS */}
            <div className="space-y-1.5 pt-2 font-mono">
              <div className="text-[10px] text-slate-400 uppercase">{language === "es" ? "RECONOCIMIENTOS CÓSMICOS" : "PURIFICATION RECORDS"}</div>
              <div className="space-y-1 text-[11px]">
                <div className="bg-slate-900/30 p-2 rounded flex justify-between items-center border border-slate-850/40">
                  <span className="text-slate-300">{t("codex.achievements.first_victory.name")}</span>
                  {stats.bossDefeated ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1 text-[10px] uppercase">
                      <Check size={11} /> {language === "es" ? "COMPLETO" : "COMPLETED"}
                    </span>
                  ) : (
                    <span className="text-slate-500 flex items-center gap-1 text-[10px] uppercase">
                      <Lock size={10} /> {language === "es" ? "INCOMPLETO" : "INCOMPLETE"}
                    </span>
                  )}
                </div>
                <div className="bg-slate-900/30 p-2 rounded flex justify-between items-center border border-slate-850/40">
                  <span className="text-slate-300">{t("codex.achievements.max_followers.name")}</span>
                  {stats.bestSwarmSize >= 50 ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1 text-[10px] uppercase">
                      <Check size={11} /> {language === "es" ? "COMPLETO" : "COMPLETED"}
                    </span>
                  ) : (
                    <span className="text-slate-500 flex items-center gap-1 text-[10px] uppercase">
                      <Lock size={10} /> {stats.bestSwarmSize}/50
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* THREATS INTEL LOG SECTION */}
            <div className="space-y-2 pt-3 border-t border-slate-900 font-mono">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider flex justify-between">
                <span>{t("threatIntel.title")}</span>
                <span className="text-cyan-400 font-bold">
                  {((stats.discoveredThreats || []).filter(id => ["drone", "disruptor", "blackout_elite", "boss_devourer"].includes(id.toLowerCase())).length)} / 4 {language === "es" ? "ANALIZADAS" : "ANALYZED"}
                </span>
              </div>
              
              <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-0.5">
                {[
                  {
                    id: "drone",
                    name: language === "es" ? "Drone de Asalto (V-Wing)" : "Assault Drone (V-Wing)",
                    xp: "+15 XP",
                    weakness: language === "es" ? "Baja salud. Concentrar enjambre en Delta/Círculo." : "Low health. Focus swarm fire in Delta/Circle.",
                    intel: language === "es" ? "Línea de mira violeta intermitente." : "Flashing violet targeting lock-on line."
                  },
                  {
                    id: "disruptor",
                    name: language === "es" ? "Emisor Disruptor EMP" : "EMP Disruptor Emitter",
                    xp: "+30 XP",
                    weakness: language === "es" ? "Velocidad lenta. Atacar a distancia en Línea." : "Slow speed. Attack from distance in Assault Line.",
                    intel: language === "es" ? "Anillo cian expandiéndose." : "Expanding blue energy warning ring."
                  },
                  {
                    id: "blackout_elite",
                    name: language === "es" ? "Acorazado Blackout Elite" : "Blackout Elite Dreadnought",
                    xp: "+60 XP",
                    weakness: language === "es" ? "Motor trasero expuesto. Esquivar embestida y golpear detrás." : "Exposed rear engine. Dodge charge and hit from behind.",
                    intel: language === "es" ? "Línea de colisión roja y cono." : "Intense red collision path and tracking cone."
                  },
                  {
                    id: "boss_devourer",
                    name: language === "es" ? "Devorador Blackout (Jefe)" : "Blackout Devourer (Boss)",
                    xp: "+1000 XP",
                    weakness: language === "es" ? "Ocular central. Usar formación Escudo." : "Central core eye. Use Protective Shield formation.",
                    intel: language === "es" ? "Segmentos oscilantes con destellos rosa." : "Rotating hazard sweeps and pink particle charges."
                  }
                ].map((threat) => {
                  const isDiscovered = (stats.discoveredThreats || []).some(id => id.toLowerCase() === threat.id.toLowerCase());

                  if (!isDiscovered) {
                    return (
                      <div key={threat.id} className="bg-slate-950/40 border border-dashed border-slate-900 p-2 rounded text-[10px] font-mono text-slate-600 flex justify-between items-center">
                        <span>{language === "es" ? "[ REGISTRO ENCRIPTADO: AMENAZA DESCONOCIDA ]" : "[ ENCRYPTED RECORD: UNKNOWN THREAT ]"}</span>
                        <Lock size={10} />
                      </div>
                    );
                  }

                  return (
                    <div key={threat.id} className="bg-slate-900/60 border border-cyan-950/30 p-2 rounded text-[10.5px] font-mono space-y-1 hover:bg-slate-900/80 transition text-slate-300 animate-fadeIn">
                      <div className="flex justify-between items-center border-b border-slate-950/40 pb-0.5">
                        <span className="text-cyan-400 font-bold">{threat.name}</span>
                        <span className="text-rose-400 font-semibold text-[9px]">{threat.xp}</span>
                      </div>
                      <p className="text-[9.5px] text-slate-400 leading-normal">
                        <strong className="text-slate-300">{language === "es" ? "Debilidad:" : "Weakness:"}</strong> {threat.weakness}
                      </p>
                      <p className="text-[9.5px] text-slate-400 leading-normal">
                        <strong className="text-slate-300">Telegraph:</strong> {threat.intel}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 3. LOG: COMPANION DIALOGUE */}
        {activeTab === "LOG" && (
          <div className="flex flex-col h-full animate-fadeIn font-mono">
            <div className="text-[10px] text-slate-400 border-b border-slate-900 pb-1.5 mb-1.5 flex justify-between uppercase">
              <span>{language === "es" ? "FRECUENCIA DEL ACOMPAÑANTE LUX-8" : "LUX-8 COMPANION FREQUENCY"}</span>
              <span className="text-emerald-400 animate-pulse font-bold flex items-center gap-1 text-[9px]">● {language === "es" ? "CONECTADO" : "CONNECTED"}</span>
            </div>

            {/* LOG TEXTBOX PANEL */}
            <div
              ref={logContainerRef}
              className="flex-1 bg-slate-950/60 rounded p-2 border border-slate-900 overflow-y-auto space-y-2.5 max-h-[280px] lg:max-h-[350px] text-[11px]"
              role="log"
              aria-live="polite"
              aria-relevant="additions text"
              aria-label={language === "es" ? "Registro de comunicaciones LUX-8" : "LUX-8 communications log"}
            >
              {dialogueLog.map((log) => {
                let senderClass = "text-amber-400 font-bold";
                let bubbleClass = "bg-slate-900/30 text-slate-200 border border-slate-850/40";
                
                if (log.sender === "COMPANION") {
                  senderClass = "text-cyan-400 font-bold";
                  bubbleClass = "bg-cyan-950/10 text-cyan-100 border border-cyan-950/30";
                } else if (log.sender === "SYSTEM") {
                  senderClass = "text-rose-400 font-semibold";
                  bubbleClass = "bg-rose-950/5 text-rose-300 border border-rose-950/20";
                }

                // Translate system logs if possible
                let displayLogText = log.text;
                if (log.sender === "SYSTEM") {
                  if (displayLogText.includes("Wave") && displayLogText.includes("Complete")) {
                    const waveNum = displayLogText.replace(/^\D+/g, "").split(" ")[0];
                    displayLogText = language === "es" ? `OLEADA ${waveNum} COMPLETADA` : `WAVE ${waveNum} COMPLETED`;
                  } else if (displayLogText.includes("Sector Purification Successful")) {
                    displayLogText = language === "es" ? "PURIFICACIÓN DE SECTOR EXITOSA" : "Sector Purification Successful";
                  } else if (displayLogText.includes("Critical Shield Failure")) {
                    displayLogText = language === "es" ? "FALLA CRÍTICA DE ESCUDOS" : "Critical Shield Failure";
                  }
                } else if (log.sender === "COMPANION") {
                  // LUX-8 companion phrases can remain dynamic, but we can localize common start signals
                  if (displayLogText.includes("Entering Sector")) {
                    const sector = displayLogText.split(" ").pop();
                    displayLogText = language === "es" ? `Ingresando al Sector ${sector}...` : `Entering Sector ${sector}...`;
                  }
                }

                return (
                  <div key={log.id} className={`p-2 rounded ${bubbleClass} space-y-0.5`}>
                    <div className="flex justify-between items-center text-[9px] border-b border-slate-900/40 pb-0.5">
                      <span className={senderClass}>{log.sender === "COMPANION" ? "LUX-8 COMPANION" : log.sender}</span>
                      <span className="text-slate-500">{log.timestamp}</span>
                    </div>
                    <p className="leading-relaxed text-[10.5px] break-words">{displayLogText}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. RELICS / UPGRADE TECH MARKET */}
        {activeTab === "RELICS" && (
          <div className="space-y-3 animate-fadeIn font-mono">
            <div className="flex justify-between items-center text-[10px] text-slate-400 border-b border-slate-900 pb-1.5 uppercase">
              <span>{language === "es" ? "TIENDA CIBERNÉTICA DE MEJORAS" : "UPGRADE CYBERNETIC SHOP"}</span>
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Coins size={11} /> {language === "es" ? "NANO CRÉDITOS" : "NANO CREDITS"}: ${nanoCredits}
              </span>
            </div>

            <div className="space-y-2.5 max-h-[300px] lg:max-h-[380px] overflow-y-auto pr-0.5">
              {UPGRADES.map((upgrade) => {
                const currentLevel = upgradesLevel[upgrade.id] || 0;
                const costMultiplier = 1 + currentLevel * 0.5; // Upgrades cost +50% per level
                const actualCost = Math.round(upgrade.cost * costMultiplier);
                const canAfford = nanoCredits >= actualCost;

                // Cybernetic Shop Localizations Map
                const localizedUpgradeName = {
                  quantum_core: language === "es" ? "Límite del Núcleo" : "Quantum Core Capacity",
                  mitosis_relic: language === "es" ? "Reliquia de Mitosis" : "Mitosis Relic",
                  nanobot_assembler: language === "es" ? "Ensamblador de Escudo" : "Nanobot Shield Assembler",
                  singularity_engine: language === "es" ? "Extractor de Atracción" : "Singularity Gravity Engine",
                }[upgrade.id] || upgrade.name;

                const localizedUpgradeDesc = {
                  quantum_core: language === "es" ? "Expande el límite de enjambre activo a 36, 48 o 60 seguidores." : "Increases maximum follower limit to 36, 48, or 60 active Orbis.",
                  mitosis_relic: language === "es" ? "Los disparos del enjambre obtienen un +10% de probabilidad acumulada de duplicarse." : "Follower projectiles gain a cumulative +10% duplication rate.",
                  nanobot_assembler: language === "es" ? "Añade una regeneración pasiva constante de +0.2 de escudo por segundo." : "Passively recovers +0.2 shield units per second.",
                  singularity_engine: language === "es" ? "Duplica el radio de atracción magnética de Foton para recolectar." : "Doubles the raw magnetism collection range for crystals.",
                }[upgrade.id] || upgrade.desc;

                return (
                  <div
                    key={upgrade.id}
                    className="bg-slate-900/50 p-2.5 rounded border border-slate-850/60 space-y-1.5 hover:border-slate-800 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-semibold font-mono text-white flex items-center gap-1.5 uppercase">
                          <span>{localizedUpgradeName}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-amber-400 font-bold">
                            LV {currentLevel}
                          </span>
                        </h4>
                        <p className="text-[10px] text-slate-400 font-mono leading-relaxed mt-0.5">
                          {localizedUpgradeDesc}
                        </p>
                      </div>

                      {/* Buy Action */}
                      <button
                        onClick={() => {
                          if (canAfford) {
                            playClickSound();
                            onBuyUpgrade(upgrade.id);
                          }
                        }}
                        disabled={!canAfford}
                        className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition flex items-center gap-1 shrink-0 ${
                          canAfford
                            ? "bg-amber-500 text-black hover:bg-amber-400 cursor-pointer shadow-md"
                            : "bg-slate-800 text-slate-500 border border-slate-850 cursor-not-allowed"
                        }`}
                      >
                        <Coins size={10} />
                        ${actualCost}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
export default CompanionPanel;
