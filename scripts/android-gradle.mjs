import { spawnSync } from 'node:child_process';

const task = process.argv[2];
if (!task) {
  console.error('Usage: node scripts/android-gradle.mjs <task>');
  process.exit(2);
}

const executable = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
const result = spawnSync(executable, [task], {
  cwd: 'android',
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (result.error) throw result.error;
process.exit(result.status ?? 1);
