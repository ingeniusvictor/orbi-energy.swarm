import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const game = readFileSync(
  new URL("../src/game/EnergySwarmGame.tsx", import.meta.url),
  "utf8",
);
const pursuit = readFileSync(
  new URL("../src/game/bossPursuit.ts", import.meta.url),
  "utf8",
);
const companion = readFileSync(
  new URL("../src/components/CompanionPanel.tsx", import.meta.url),
  "utf8",
);
const halo = readFileSync(
  new URL("../src/game/fotonDysonHalo.ts", import.meta.url),
  "utf8",
);

test("all Devourer phases use the bounded pursuit projection outside charge", () => {
  assert.match(game, /import \{ projectBossPursuit \} from "\.\/bossPursuit"/);
  assert.match(game, /const pursuit = projectBossPursuit\(\{/);
  assert.match(game, /phase: boss\.bossPhase \|\| 1/);
  assert.doesNotMatch(game, /const centerY = 160;/);
  assert.doesNotMatch(game, /const centerY = 150;/);
  assert.doesNotMatch(pursuit, /for\s*\(|\.filter\(|\.map\(|\.forEach\(/);
});

test("formation cooldown decays on the existing frame delta instead of locking forever", () => {
  assert.match(
    game,
    /formationCooldownRef\.current = Math\.max\(\s*0,\s*formationCooldownRef\.current - delta,?\s*\)/,
  );
  assert.doesNotMatch(game, /setTimeout\([^)]*formationCooldownRef/);
});

test("desktop formation controls explicitly advertise and expose interactivity", () => {
  assert.match(game, /FORMACIONES · CLIC \/ TECLAS 1–6/);
  assert.match(game, /type="button"[\s\S]{0,180}?aria-pressed=\{isSel\}/);
  assert.match(game, /onClick=\{\(\) => triggerFormationChange\(f\.type\)\}/);
  assert.match(game, /\{isSel \? "ACTIVA" : f\.type\}/);
});

test("swarm roster uses one scroll surface and a taller responsive cockpit panel", () => {
  assert.match(companion, /lg:h-\[min\(72dvh,720px\)\]/);
  assert.match(companion, /data-swarm-roster-list/);
  assert.doesNotMatch(
    companion,
    /space-y-1\.5 max-h-\[300px\] lg:max-h-\[400px\] overflow-y-auto pr-0\.5/,
  );
});

test("Dyson halo owns three equal-tilt planes separated by 120-degree azimuths", () => {
  assert.match(halo, /tilt: \[1\.08, 0, 0\]/);
  assert.match(halo, /tilt: \[1\.08, 0, 2\.094\]/);
  assert.match(halo, /tilt: \[1\.08, 0, 4\.189\]/);
});
