const fs = require('node:fs');

const replaceOnce = (path, before, after) => {
  let source = fs.readFileSync(path, 'utf8');
  const first = source.indexOf(before);
  if (first < 0) throw new Error(`${path}: expected legacy reward-routing assertion not found`);
  if (source.indexOf(before, first + before.length) >= 0) {
    throw new Error(`${path}: legacy reward-routing assertion is not unique`);
  }
  source = source.slice(0, first) + after + source.slice(first + before.length);
  fs.writeFileSync(path, source);
};

replaceOnce(
  'tests/runtime-enemy-evolution-adoption.test.ts',
  [
    '  const uses =',
    '    collisions.match(/getEnemyScoreReward\\(/g) ?? [];',
    '  assert.equal(',
    '    uses.length,',
    '    2,',
    '    "direct and splash kills must share evolved-aware rewards",',
    '  );',
  ].join('\n'),
  [
    '  const defeatHelper = section(',
    '    game,',
    '    "const registerCombatDefeat =",',
    '    "// --- DETECT SINGLE-IMPACT COLLISION SWEEPS ---",',
    '  );',
    '  assert.match(',
    '    defeatHelper,',
    '    /baseScore:\\s*getEnemyScoreReward\\(enemy\\)/,',
    '  );',
    '  assert.match(',
    '    collisions,',
    '    /registerCombatDefeat\\(otherEnemy, proj\\.affinity\\);/,',
    '  );',
    '  assert.match(',
    '    collisions,',
    '    /registerCombatDefeat\\(enemy, proj\\.affinity\\);/,',
    '  );',
    '  assert.equal(',
    '    (collisions.match(/getEnemyScoreReward\\(/g) ?? []).length,',
    '    0,',
    '    "direct and splash kills must route through the single evolved-aware reward authority",',
    '  );',
  ].join('\n'),
);

replaceOnce(
  'tests/runtime-miniboss-adoption.test.ts',
  [
    '  const rewardCalls =',
    '    collisions.match(/getEnemyScoreReward\\(/g) ?? [];',
    '  assert.equal(',
    '    rewardCalls.length,',
    '    2,',
    '    "both direct and splash kill paths must use milestone-aware score rewards",',
    '  );',
  ].join('\n'),
  [
    '  const defeatHelper = section(',
    '    game,',
    '    "const registerCombatDefeat =",',
    '    "// --- DETECT SINGLE-IMPACT COLLISION SWEEPS ---",',
    '  );',
    '  assert.match(',
    '    defeatHelper,',
    '    /baseScore:\\s*getEnemyScoreReward\\(enemy\\)/,',
    '  );',
    '  assert.match(',
    '    collisions,',
    '    /registerCombatDefeat\\(otherEnemy, proj\\.affinity\\);/,',
    '  );',
    '  assert.match(',
    '    collisions,',
    '    /registerCombatDefeat\\(enemy, proj\\.affinity\\);/,',
    '  );',
    '  assert.equal(',
    '    (collisions.match(/getEnemyScoreReward\\(/g) ?? []).length,',
    '    0,',
    '    "direct and splash kills must route through the single milestone-aware reward authority",',
    '  );',
  ].join('\n'),
);
