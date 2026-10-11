from pathlib import Path


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"fail-closed {label}: expected 1 match, found {count}")
    return text.replace(old, new, 1)


game_path = Path("src/game/EnergySwarmGame.tsx")
game = game_path.read_text()

# Reuse the H6 mutator projection and overlay; H9 adds only pure pressure helpers.
game = replace_once(
    game,
    '''import {
  getReducedVisibilityOverlayProfile,
  getResourceFieldProfile,
} from "./runtimeEnvironmentalFields";
import {''',
    '''import {
  getReducedVisibilityOverlayProfile,
  getResourceFieldProfile,
} from "./runtimeEnvironmentalFields";
import {
  getEclipseEnemyMovementMultiplier,
  getEclipseSolarCooldownRecoveryMultiplier,
} from "./runtimeEclipse";
import {''',
    "runtime Eclipse import",
)

# Only solar-affinity members recover their firing cooldown more slowly in Eclipse.
game = replace_once(
    game,
    '''      // Shooting logic
      member.shootCooldown -= delta / 16.6;
      if (member.shootCooldown <= 0) {''',
    '''      // Shooting logic
      member.shootCooldown -=
        (delta / 16.6) *
        getEclipseSolarCooldownRecoveryMultiplier(
          simulationMutatorEffects,
          member.affinity,
        );
      if (member.shootCooldown <= 0) {''',
    "solar cooldown pressure",
)

# PARASITE keeps its certified lunge oscillation. Eclipse scales only directional
# movement speed and does not alter the global H6 enemy speed authority.
game = replace_once(
    game,
    '''        } else if (enemy.type === EnemyType.PARASITE) {
          // Twitchy lunging behavior. Evolved signature scaling only adjusts''',
    '''        } else if (enemy.type === EnemyType.PARASITE) {
          const eclipseParasiteSpeedMultiplier =
            getEclipseEnemyMovementMultiplier(
              simulationMutatorEffects,
              enemy.type,
            );
          // Twitchy lunging behavior. Evolved signature scaling only adjusts''',
    "parasite Eclipse multiplier",
)

game = replace_once(
    game,
    '''          enemy.x += ((dx / dist) * enemy.speed + lunge) * (delta / 16.6);
          enemy.y += (dy / dist) * enemy.speed * (delta / 16.6);''',
    '''          enemy.x +=
            ((dx / dist) *
              enemy.speed *
              eclipseParasiteSpeedMultiplier +
              lunge) *
            (delta / 16.6);
          enemy.y +=
            (dy / dist) *
            enemy.speed *
            eclipseParasiteSpeedMultiplier *
            (delta / 16.6);''',
    "parasite directional movement pressure",
)

game_path.write_text(game)
