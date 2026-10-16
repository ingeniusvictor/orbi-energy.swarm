from pathlib import Path

TYPES = Path("src/game/types.ts")
STORAGE = Path("src/game/storage.ts")
TEST = Path("tests/gameplay/storage.test.ts")


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one marker, found {count}")
    return text.replace(old, new, 1)


types = TYPES.read_text()
types = replace_once(
    types,
    'export interface GameStats {\n  highScore: number;\n',
    'export interface GameStats {\n  highScore: number;\n  scoreAttackBestScore: number;\n',
    "GameStats score attack field",
)
TYPES.write_text(types)

storage = STORAGE.read_text()
storage = replace_once(
    storage,
    'export const DEFAULT_STATS: GameStats = {\n  highScore: 0,\n',
    'export const DEFAULT_STATS: GameStats = {\n  highScore: 0,\n  scoreAttackBestScore: 0,\n',
    "DEFAULT_STATS score attack default",
)
storage = replace_once(
    storage,
    'const safeRecordInteger = (value: unknown) =>\n  typeof value === "number" && Number.isFinite(value)\n    ? Math.max(0, Math.floor(value))\n    : 0;\n\n',
    'const safeRecordInteger = (value: unknown) =>\n  typeof value === "number" && Number.isFinite(value)\n    ? Math.max(0, Math.floor(value))\n    : 0;\n\nconst safeScoreAttackRecordInteger = (value: unknown) =>\n  typeof value === "number" && Number.isFinite(value) && value >= 0\n    ? Math.min(Number.MAX_SAFE_INTEGER, Math.floor(value))\n    : 0;\n\n',
    "score attack storage sanitizer",
)
storage = replace_once(
    storage,
    '      flashIntensity: normalizeFlashIntensityMode(parsed.flashIntensity),\n      bestInfiniteSector: safeRecordInteger(parsed.bestInfiniteSector),\n',
    '      flashIntensity: normalizeFlashIntensityMode(parsed.flashIntensity),\n      scoreAttackBestScore: safeScoreAttackRecordInteger(parsed.scoreAttackBestScore),\n      bestInfiniteSector: safeRecordInteger(parsed.bestInfiniteSector),\n',
    "score attack load sanitization",
)
STORAGE.write_text(storage)

test = TEST.read_text()
test = replace_once(
    test,
    '  assert.equal(stats.highScore, 0);\n  assert.equal(stats.bestWave, 1);\n',
    '  assert.equal(stats.highScore, 0);\n  assert.equal(stats.scoreAttackBestScore, 0);\n  assert.equal(stats.bestWave, 1);\n',
    "default storage assertion",
)
anchor = '''test("flash intensity storage accepts canonical modes and fails malformed values to REDUCED", () => {\n'''
new_test = '''test("score attack best score storage is bounded and independent from global high score", () => {\n  const storage = installStorage();\n\n  storage.setItem(STORAGE_KEY, JSON.stringify({\n    highScore: 77,\n    scoreAttackBestScore: 1234.9,\n  }));\n  let stats = loadGameStats();\n  assert.equal(stats.highScore, 77);\n  assert.equal(stats.scoreAttackBestScore, 1234);\n\n  storage.setItem(STORAGE_KEY, JSON.stringify({\n    highScore: 88,\n    scoreAttackBestScore: Number.MAX_SAFE_INTEGER + 4096,\n  }));\n  stats = loadGameStats();\n  assert.equal(stats.highScore, 88);\n  assert.equal(stats.scoreAttackBestScore, Number.MAX_SAFE_INTEGER);\n\n  for (const malformed of [-1, "9001", null]) {\n    storage.setItem(STORAGE_KEY, JSON.stringify({\n      highScore: 99,\n      scoreAttackBestScore: malformed,\n    }));\n    stats = loadGameStats();\n    assert.equal(stats.highScore, 99);\n    assert.equal(stats.scoreAttackBestScore, 0);\n  }\n});\n\n'''
test = replace_once(test, anchor, new_test + anchor, "score attack storage test insertion")
test = replace_once(
    test,
    '  const next = { ...DEFAULT_STATS, highScore: 9001, totalNanoCredits: 77 };\n',
    '  const next = {\n    ...DEFAULT_STATS,\n    highScore: 9001,\n    scoreAttackBestScore: 321,\n    totalNanoCredits: 77,\n  };\n',
    "save round-trip fixture",
)
test = replace_once(
    test,
    '  const reset = resetGameStats();\n  assert.equal(reset.highScore, 0);\n',
    '  const saved = loadGameStats();\n  assert.equal(saved.highScore, 9001);\n  assert.equal(saved.scoreAttackBestScore, 321);\n\n  const reset = resetGameStats();\n  assert.equal(reset.highScore, 0);\n  assert.equal(reset.scoreAttackBestScore, 0);\n',
    "save/reset score attack assertions",
)
TEST.write_text(test)

# Fail closed if the intended contract is not visibly present after patching.
assert 'scoreAttackBestScore: number;' in TYPES.read_text()
assert 'scoreAttackBestScore: 0,' in STORAGE.read_text()
assert 'Number.MAX_SAFE_INTEGER' in STORAGE.read_text()
assert 'orbi_energy_swarm_stats_v2' in STORAGE.read_text()
assert 'orbi_energy_swarm_stats_v3' not in STORAGE.read_text()
