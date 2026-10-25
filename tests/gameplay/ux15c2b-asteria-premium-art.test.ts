import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";

const get = (path: string) => new URL("../../" + path, import.meta.url);
const text = (path: string) => readFileSync(get(path), "utf8");

const art = text("src/game/asteriaPremiumArtwork.ts");
const renderer = text("src/game/worldRoutePreviewRenderer.ts");
const engine = text("src/game/EnergySwarmGame.tsx");

const scenes = ["arrival","orbital","relay","breach"] as const;

test("UX15-C2B: all four approved optimized WebP images really exist in shipped public assets",()=>{
  let total=0;
  for(const scene of scenes){
    const path=`public/assets/worlds/asteria/asteria-${scene}.webp`;
    const bytes=readFileSync(get(path));
    assert.equal(bytes.toString("ascii",0,4),"RIFF",path);
    assert.equal(bytes.toString("ascii",8,12),"WEBP",path);
    assert.ok(bytes.length>80_000&&bytes.length<220_000,path);
    const actual=statSync(fileURLToPath(get(path))).size;
    assert.equal(actual,bytes.length);
    total+=actual;
  }
  assert.ok(total<600_000,`four panoramas cost ${total} B, budget <600KB`);
});

test("UX15-C2B: route mapping reuses the four original artwork concepts across six ASTERIA segments",()=>{
  assert.match(art,/ARRIVAL_GATE: "arrival"/);
  assert.match(art,/ORBITAL_RAILS: "orbital"/);
  assert.match(art,/CANYON_SKY: "orbital"/);
  assert.match(art,/RELAY_SPAN: "relay"/);
  assert.match(art,/SIGNAL_BREACH: "breach"/);
  assert.match(art,/TRANSIT_VISTA: "arrival"/);
  assert.match(art,/assets\/worlds\/asteria/);
  assert.match(art,/import\.meta\.env\?\.BASE_URL/);
});

test("UX15-C2B: assets decoded only in opted-in route with bounded reusable cache and graceful fallback",()=>{
  assert.match(art,/MAX_CACHED_SCENES = 4/);
  assert.match(art,/new Image\(\)/);
  assert.match(art,/image\.onload =/);
  assert.match(art,/image\.onerror =/);
  assert.match(art,/image\.naturalWidth > 0/);
  assert.match(art,/cache\.size > MAX_CACHED_SCENES/);
  assert.match(art,/TRANSITION_START = 0\.73/);
  assert.match(art,/prefetchAsteriaArtwork\(cursor\)/);
  assert.match(art,/if \(!current\) return false/);
  assert.match(renderer,/const premiumReady = paintAsteriaPremiumArtwork\(ctx, cursor, W, H\)/);
  assert.match(renderer,/if \(!premiumReady\) \{/);
  assert.match(renderer,/return premiumReady/);
  assert.match(engine,/if \(worldRouteRunActiveRef\.current\) \{[\s\S]*?prefetchAsteriaArtwork/);
  assert.match(engine,/const asteriaCombatVisualActive = worldRouteRunActiveRef\.current/);
  assert.match(engine,/canvas\.dataset\.ux15Art = premiumArtReady \? "premium" : "fallback"/);
  assert.match(engine,/delete canvas\.dataset\.ux15Art/);
});

test("UX15-C2B: premium pictures never affect enemies, colliders, loot or movement",()=>{
  assert.doesNotMatch(art,/spawnEnemy|enemyRef|loot|damageEnemy|WORLD_WIDTH|physicsRef|MAX_ENEMIES/);
  assert.doesNotMatch(art,/THREE|WebGLRenderer|performance\.now|Date\.now|Math\.random/);
  assert.match(art,/ctx\.drawImage\(image/);
  assert.match(art,/Math\.max\(width \/ image\.naturalWidth, height \/ image\.naturalHeight\)/);
  assert.match(art,/const next = nextKey !== currentKey \? sceneReady\(nextKey\) : null/);
  assert.match(art,/ctx\.fillRect\(0, 0, width, height\)/);
});
