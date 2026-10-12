import fs from "node:fs";

const path = "src/game/EnergySwarmGame.tsx";
let source = fs.readFileSync(path, "utf8");

const replaceExactlyOnce = (from, to, label) => {
  const first = source.indexOf(from);
  const last = source.lastIndexOf(from);
  if (first < 0 || first !== last) {
    throw new Error(`${label}: expected exactly one source anchor`);
  }
  source = source.replace(from, to);
};

replaceExactlyOnce(
  [
    'import {',
    '  activateCombatOverdrive,',
    '  advanceCombatOverdrive,',
    '  createCombatOverdriveState,',
    '  projectCombatOverdrive,',
    '} from "./combatOverdrive";',
  ].join("\n"),
  [
    'import {',
    '  activateCombatOverdrive,',
    '  advanceCombatOverdrive,',
    '  createCombatOverdriveState,',
    '  projectCombatOverdrive,',
    '} from "./combatOverdrive";',
    'import { projectCombatOverdriveEffects } from "./combatOverdriveEffects";',
  ].join("\n"),
  "Overdrive import",
);

replaceExactlyOnce(
  [
    '    const primaryDamage =',
    '      baseDamage *',
    '      profile.damageMultiplier *',
    '      (gaiaScale?.damageMultiplier ?? 1) *',
    '      (critical ? profile.criticalDamageMultiplier : 1);',
    '',
    '    const makeProjectile = (',
  ].join("\n"),
  [
    '    const primaryDamage =',
    '      baseDamage *',
    '      profile.damageMultiplier *',
    '      (gaiaScale?.damageMultiplier ?? 1) *',
    '      (critical ? profile.criticalDamageMultiplier : 1);',
    '    const overdriveEffects = projectCombatOverdriveEffects({',
    '      active: combatOverdriveRef.current.active,',
    '    });',
    '    const overdriveAdjustedDamage =',
    '      primaryDamage * overdriveEffects.playerDamageMultiplier;',
    '',
    '    const makeProjectile = (',
  ].join("\n"),
  "primary damage seam",
);

replaceExactlyOnce(
  "      damage: primaryDamage * damageMultiplier,",
  "      damage: overdriveAdjustedDamage * damageMultiplier,",
  "projectile damage assignment",
);

fs.writeFileSync(path, source);
