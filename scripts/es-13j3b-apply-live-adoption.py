from pathlib import Path


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly 1 match, found {count}")
    return text.replace(old, new, 1)


types_path = Path("src/game/types.ts")
types = types_path.read_text()
types = replace_once(
    types,
    'export enum BiomeType {',
    'import type { LiveEnemyFormationAssignment } from "./liveEnemyFormationDirector";\n\nexport enum BiomeType {',
    "types import",
)
types = replace_once(
    types,
    '  evolvedRewardMultiplier?: number;\n  evolvedSpecialIntensity?: number;\n}',
    '  evolvedRewardMultiplier?: number;\n  evolvedSpecialIntensity?: number;\n  enemyFormation?: LiveEnemyFormationAssignment;\n}',
    "Enemy formation metadata",
)
types_path.write_text(types)

game_path = Path("src/game/EnergySwarmGame.tsx")
game = game_path.read_text()
game = replace_once(
    game,
    'import { projectCombatOverdrivePresentation } from "./combatOverdrivePresentation";\n',
    'import { projectCombatOverdrivePresentation } from "./combatOverdrivePresentation";\nimport {\n  createLiveEnemyFormationDirectorState,\n  projectLiveEnemyFormationMotion,\n  requestLiveEnemyFormationSpawn,\n} from "./liveEnemyFormationDirector";\n',
    "live formation import",
)
game = replace_once(
    game,
    '  const waveActiveRef = useRef(false);\n  const waveBudgetSpawnedRef = useRef(0);\n  const waveTimeRemainingRef = useRef(0);\n  const spawnTimerRef = useRef(0);\n  const waveBreakTimerRef = useRef(0);',
    '  const waveActiveRef = useRef(false);\n  const waveBudgetSpawnedRef = useRef(0);\n  const waveTimeRemainingRef = useRef(0);\n  const spawnTimerRef = useRef(0);\n  const waveBreakTimerRef = useRef(0);\n  const enemyFormationDirectorRef = useRef(\n    createLiveEnemyFormationDirectorState(),\n  );',
    "formation director ref",
)
game = replace_once(
    game,
    '        waveBudgetSpawnedRef.current = 0;\n        setIsWaveBreak(false);',
    '        waveBudgetSpawnedRef.current = 0;\n        enemyFormationDirectorRef.current =\n          createLiveEnemyFormationDirectorState();\n        setIsWaveBreak(false);',
    "wave reset",
)
game = replace_once(
    game,
    '    if (isElite) {\n      health *= 1.8;\n      size *= 1.4;\n      color = "#f43f5e";\n    }\n\n    if (\n      !spawningMiniboss &&',
    '''    if (isElite) {
      health *= 1.8;
      size *= 1.4;
      color = "#f43f5e";
    }

    const formationResolution =
      requestLiveEnemyFormationSpawn(
        enemyFormationDirectorRef.current,
        {
          sourceMode: descriptor.sourceMode,
          waveNumber: descriptor.waveNumber,
          descriptorId: descriptor.descriptorId,
          milestoneActive: descriptor.milestone !== null,
          spawnOrdinal: waveBudgetSpawnedRef.current,
          enemyType: type,
          eligibleEnemy:
            !spawningMiniboss &&
            !evolvedProfile &&
            !isElite,
          remainingCapacity:
            Math.min(
              MAX_ENEMIES,
              descriptor.spawn.maxConcurrentEnemies,
            ) - enemiesRef.current.length,
          nowMs: timeElapsedRef.current,
          anchorX: playerPosRef.current.x,
          anchorY: playerPosRef.current.y,
          worldWidth: WORLD_WIDTH,
          worldHeight: WORLD_HEIGHT,
        },
      );
    enemyFormationDirectorRef.current =
      formationResolution.state;
    const enemyFormation =
      formationResolution.assignment;

    if (enemyFormation) {
      const initialFormationMotion =
        projectLiveEnemyFormationMotion({
          assignment: enemyFormation,
          nowMs: timeElapsedRef.current,
          worldWidth: WORLD_WIDTH,
          worldHeight: WORLD_HEIGHT,
        });
      ex = initialFormationMotion.x;
      ey = initialFormationMotion.y;
    }

    if (
      !spawningMiniboss &&''',
    "spawn adoption",
)
game = replace_once(
    game,
    '      isDead: false,\n      isBoss: false,\n      flashTicks: 0,',
    '      isDead: false,\n      isBoss: false,\n      enemyFormation: enemyFormation ?? undefined,\n      flashTicks: 0,',
    "spawn metadata",
)
game = replace_once(
    game,
    '''        } else {
          // Direct slither for Crawler, Splitter, and minion parts
          enemy.x += (dx / dist) * enemy.speed * (delta / 16.6);
          enemy.y += (dy / dist) * enemy.speed * (delta / 16.6);
        }
      }
''',
    '''        } else {
          // J3B: certified enemy formation routing replaces the existing
          // direct-slither movement only for opted-in Crawler/Splitter members.
          // Hydro slow cancels formation ownership so status control remains
          // effective instead of becoming an accidental formation immunity.
          if (isSlowed && enemy.enemyFormation) {
            enemy.enemyFormation = undefined;
          }
          const formationMotion = enemy.enemyFormation
            ? projectLiveEnemyFormationMotion({
                assignment: enemy.enemyFormation,
                nowMs: timeElapsedRef.current,
                worldWidth: WORLD_WIDTH,
                worldHeight: WORLD_HEIGHT,
              })
            : null;

          if (formationMotion && !formationMotion.complete) {
            enemy.x = formationMotion.x;
            enemy.y = formationMotion.y;
          } else {
            if (formationMotion?.complete) {
              enemy.enemyFormation = undefined;
            }
            // Legacy direct slither for non-formation Crawler/Splitter/minions.
            enemy.x += (dx / dist) * enemy.speed * (delta / 16.6);
            enemy.y += (dy / dist) * enemy.speed * (delta / 16.6);
          }
        }
      }
''',
    "movement adoption",
)
game_path.write_text(game)
