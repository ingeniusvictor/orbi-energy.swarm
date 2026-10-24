import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { EnergyCodex, EnergyCodexArtwork } from "../src/components/EnergyCodex";
import { ORBI_ENERGY_CANON, ORBI_COLLECTIBLE_ENERGY_IDS, ORBI_GAIA_REQUIRED_FOLLOWER_IDS, ORBI_PROTAGONIST_ID } from "../src/game/orbiEnergyCanon";
import { getOrbiAttackProfile } from "../src/game/orbiAttackProfiles";
import { acquisitionsForLevel, getEvo8VisualStage, getEvo8WingCount } from "../src/game/orbiEvolution";
import { getGaiaLevelForCompletedCycles } from "../src/game/gaiaEvolution";

test("UX11-C ten canonical energy records exclude neutral protagonist ENERGY",()=>{
  assert.equal(ORBI_PROTAGONIST_ID,"ENERGY");
  assert.equal(ORBI_ENERGY_CANON.length,10);
  assert.equal(new Set(ORBI_ENERGY_CANON.map(e=>e.id)).size,10);
  assert.equal(ORBI_COLLECTIBLE_ENERGY_IDS.length,9);
  assert.equal(ORBI_GAIA_REQUIRED_FOLLOWER_IDS.length,9);
  const gaia=ORBI_ENERGY_CANON.find(e=>e.id==="GAIA")!;
  assert.equal(gaia.collectibleFollower,false);
  assert.equal(gaia.gaiaPrerequisite,false);
  assert.ok(ORBI_GAIA_REQUIRED_FOLLOWER_IDS.includes("FOTON"));
  assert.equal(getGaiaLevelForCompletedCycles(29),8);
});
test("UX11-C generated artwork uses independent solar FOTON and full GAIA synthesis",()=>{
  const foton=ORBI_ENERGY_CANON.find(e=>e.id==="FOTON")!;
  assert.equal(foton.color,"#7cff56");
  const fotonArt=renderToStaticMarkup(createElement(EnergyCodexArtwork,{id:"FOTON",color:foton.color,level:1,language:"es"}));
  assert.match(fotonArt,/PANEL SOLAR VERDE/);
  assert.match(fotonArt,/<rect/);
  assert.doesNotMatch(fotonArt,/golden neutral|dorado|ENERGY/);
  const gaia=ORBI_ENERGY_CANON.find(e=>e.id==="GAIA")!;
  const gaiaArt=renderToStaticMarkup(createElement(EnergyCodexArtwork,{id:"GAIA",color:gaia.color,level:8,language:"en"}));
  assert.match(gaiaArt,/SYNTHESIS \/ IX/);
  assert.match(gaiaArt,/GAIA/);
});
test("UX11-C attack profiles and EVO8 levels bind directly to the live contracts",()=>{
  for(const definition of ORBI_ENERGY_CANON) {
    const profile=getOrbiAttackProfile(definition.attackSignature);
    assert.equal(profile.energyId,definition.id);
    assert.ok(profile.cooldownFrames>0);
    assert.ok(profile.damageMultiplier>0);
  }
  assert.equal(acquisitionsForLevel(8),29);
  assert.equal(getEvo8VisualStage(1),1);
  assert.equal(getEvo8VisualStage(3),2);
  assert.equal(getEvo8VisualStage(5),3);
  assert.equal(getEvo8VisualStage(8),4);
  assert.equal(getEvo8WingCount(8),6);
  const html=renderToStaticMarkup(createElement(EnergyCodex,{language:"en",onOpenLegacy:()=>{}}));
  assert.match(html,/ENERGY ≠ FOTON/);
  assert.match(html,/green solar ORBI/);
  assert.match(html,/role="group"/);
});
