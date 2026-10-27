/** Verify a standard npm run build does not expose PYRA's CI-only entry. */
import assert from "node:assert/strict";
import {readdirSync,readFileSync} from "node:fs";
import {join} from "node:path";

function files(path){
 return readdirSync(path,{withFileTypes:true}).flatMap(e=>{
   const full=join(path,e.name);
   return e.isDirectory()?files(full):[full];
 });
}
const assets=files("dist").filter(path=>path.endsWith(".js"));
assert.ok(assets.length>0,"empty standard Vite production bundle");
for(const path of assets){
 const src=readFileSync(path,"utf8");
 assert.equal(src.includes("pyra-e2e-boss"),false,
  "CI-only wave-ten query leaked into production asset "+path);
 assert.equal(src.includes("pyraE2eBossId"),false,
  "CI-only boss telemetry leaked into production asset "+path);
}
console.log("PYRA CI FIXTURE ISOLATION: PASS",assets.length,"JS bundles");
