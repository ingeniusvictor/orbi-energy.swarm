import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
const read=(p:string)=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("FOTON photovoltaic follower owns a small green solar-panel face, ENERGY leader remains isolated",()=>{
 const s=read("src/game/EnergySwarmCanvas.tsx");
 const start=s.indexOf('if (member.energyId === "FOTON")');
 const end=s.indexOf('    ctx.restore();',start);
 assert.ok(start>=0&&end>start);
 const body=s.slice(start,end);
 assert.match(body,/ctx\.fillRect/);
 assert.match(body,/ctx\.strokeRect/);
 assert.match(body,/ctx\.moveTo/);
 assert.match(body,/member\.energyId === "FOTON"/);
 assert.match(body,/Historical eyes remain unchanged/);
 const canon=read("src/game/orbiEnergyCanon.ts");
 assert.match(canon,/ORBI_PROTAGONIST_ID = "ENERGY"/);
 assert.match(canon,/id: "FOTON"[\s\S]{0,360}collectibleFollower: true/);
});
