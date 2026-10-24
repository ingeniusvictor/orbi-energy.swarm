import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { QualityPreset } from "../src/game/types";
import { EnergyStatus3D, getEnergy3DPolicy, makeEnergy3DGroup } from "../src/components/EnergyStatus3D";

test("UX11-D respects graphical quality with zero GPU when LOW",()=>{
  assert.deepEqual(getEnergy3DPolicy(QualityPreset.LOW),{enabled:false,fps:0,pixelRatioCap:1,detail:12});
  assert.equal(getEnergy3DPolicy(QualityPreset.MEDIUM).fps,20);
  assert.equal(getEnergy3DPolicy(QualityPreset.HIGH).fps,24);
  assert.equal(getEnergy3DPolicy(QualityPreset.ULTRA).fps,30);
  assert.ok(getEnergy3DPolicy(QualityPreset.ULTRA).pixelRatioCap<=1.5);
});
test("UX11-D builds a real golden Three geometry, eyes and face without Dyson geometry",()=>{
  const group=makeEnergy3DGroup(24);
  assert.ok(group.isGroup);
  const childMeshes=group.children.filter((child:any)=>child.isMesh);
  assert.ok(childMeshes.length>=8);
  const exteriorRings=childMeshes.filter((mesh:any)=>mesh.geometry.type==="TorusGeometry" &&
    mesh.geometry.parameters?.arc===Math.PI*2);
  assert.equal(exteriorRings.length,0);
  assert.ok(childMeshes.some((m:any)=>m.material.color.getHexString()==="d49a40"));
});
test("UX11-D server render preserves accessible CSS fallback without GPU and identifies ENERGY",()=>{
  for(const lang of ["es","en"] as const){
    const html=renderToStaticMarkup(createElement(EnergyStatus3D,{language:lang,qualityPreset:QualityPreset.LOW}));
    assert.match(html,/data-energy-id="ENERGY"/);
    assert.match(html,/data-energy-3d-status="LOADING"/);
    assert.match(html,/orbi-ux11d-energy-fallback/);
    assert.doesNotMatch(html,/FOTON/);
  }
});
