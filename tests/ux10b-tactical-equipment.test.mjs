import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
const read = file => readFileSync(new URL("../"+file,import.meta.url),"utf8");
const game = read("src/game/EnergySwarmGame.tsx");
const companion = read("src/components/CompanionPanel.tsx");
const styles = read("src/styles/ux10PremiumOverlays.css");
const chromium = read("scripts/web-ux01-browser-evidence.mjs");

test("UX10-B team displays EVO8 gameplay capacity, not obsolete 24/36/48/60 upgrades",()=>{
 assert.match(game,/doctrineCapacity=\{getSwarmDoctrineCapacity\(swarmDoctrineRef.current\)\}/);
 assert.match(companion,/doctrineCapacity: number/);
 assert.match(companion,/const capacityLimit = doctrineCapacity/);
 assert.doesNotMatch(companion,/coreLevel\s*>=\s*3\s*\?\s*60/);
 assert.match(companion,/\{swarm.length\} \/ \{capacityLimit\}/);
 assert.match(game,/getSwarmDoctrineCapacity as|Evo8SwarmCapacity as getSwarmDoctrineCapacity/);
});

test("UX10-B six tactical formations retain functional buttons and canonical language",()=>{
 for(const [id,spanish,english] of [
  ["LINE","Línea de Asalto","Assault Line"],
  ["CIRCLE","Círculo Colector","Collector Circle"],
  ["DELTA","Delta Convergente","Convergent Delta"],
  ["SHIELD","Escudo Protector","Protective Shield"],
  ["V_SHAPE","Guardia Cruzada","Cross Guard"],
  ["SCATTERED","Delta Concéntrica","Concentric Delta"]]){
   assert.ok(game.includes("FormationType."+id),id);
   assert.ok(game.includes(spanish),spanish);
   assert.ok(game.includes(english),english);
 }
 assert.match(game,/onClick=\{\(\) => triggerFormationChange\(f.type\)\}/);
 assert.match(game,/aria-pressed=\{isSel\}/);
 assert.match(game,/onClick=\{changeMinimapMode\(m\)\}/);
 assert.match(game,/onClick=\{\(\) => changeQualityPreset\(q\)\}/);
});

test("UX10-B equipment preserves existing tabs, controls and live follower roster",()=>{
 for(const t of ["SWARM","CIV","LOG","RELICS"]) assert.ok(companion.includes('"'+t+'"'),t);
 assert.match(companion,/onClick=\{\(\) => clickTab\("SWARM"\)\}/);
 assert.match(companion,/data-swarm-roster-list/);
 assert.match(companion,/\{swarm.map\(\(member, idx\) =>/);
 assert.match(companion,/onBuyUpgrade\(/);
 assert.match(styles,/orbi-companion-panel/);
 assert.match(styles,/orbi-companion-tabs/);
 assert.match(styles,/orbi-companion-body/);
});

test("UX10-B browser measures symmetric Estado/Tactica/Equipo and captures each",()=>{
 assert.match(chromium,/const estadoBounds=/);
 assert.match(chromium,/const tacticalBounds=/);
 assert.match(chromium,/const equipmentBounds=/);
 assert.match(chromium,/Tactica diverges from Estado frame/);
 assert.match(chromium,/Equipo diverges from Estado frame/);
 assert.match(chromium,/shot\(page,name\+"-tactica"\)/);
 assert.match(chromium,/shot\(page,name\+"-equipo"\)/);
 assert.match(styles,/grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
});
