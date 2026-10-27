import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {SOLFERNAX_ANCHORED_REACTOR} from "../../src/game/pyraSolfernax";

test("PYRA-07A-2: stationary reactor cannot be displaced beyond ORBI shooting range",()=>{
  assert.equal(SOLFERNAX_ANCHORED_REACTOR,true);
  const game=readFileSync(new URL("../../src/game/EnergySwarmGame.tsx",import.meta.url),"utf8");
  const marker="const pushFactor =";
  const hit=game.indexOf(marker,game.indexOf("const projAngle ="));
  assert.ok(hit>=0,"original projectile knockback resolver must remain");
  const region=game.slice(hit,hit+520);
  assert.match(region,/enemy\.type === EnemyType\.BOSS_SOLFERNAX \? 0/);
  assert.match(region,/signatureBehavior\.projectilePushbackMultiplier/);
  assert.match(region,/enemy\.x \+= Math\.cos\(projAngle\) \* pushFactor/);
  assert.match(region,/enemy\.y \+= Math\.sin\(projAngle\) \* pushFactor/);
  assert.match(region,/relocateSpatialIndexEntry\(/);
  assert.doesNotMatch(region,/boss\.health\s*=|projectilesRef\.current\.push/);
});
