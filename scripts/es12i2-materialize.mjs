import { readFileSync, writeFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const write = (path, content) => writeFileSync(path, content, 'utf8');

const packagePath = 'package.json';
const pkg = JSON.parse(read(packagePath));
pkg.scripts['android:sync'] = 'npm run build && npx cap sync android';
pkg.scripts['android:debug'] = 'npm run android:sync && node scripts/android-gradle.mjs assembleDebug';
write(packagePath, `${JSON.stringify(pkg, null, 2)}\n`);

const manifestPath = 'android/app/src/main/AndroidManifest.xml';
let manifest = read(manifestPath);
if (!manifest.includes('android:screenOrientation="sensorLandscape"')) {
  const marker = 'android:name=".MainActivity"';
  if ((manifest.match(new RegExp(marker.replace('.', '\\.'), 'g')) ?? []).length !== 1) {
    throw new Error('I2 materialization aborted: MainActivity marker not found exactly once');
  }
  manifest = manifest.replace(
    marker,
    `${marker}\n            android:screenOrientation="sensorLandscape"`,
  );
}
if (manifest.includes('PROPERTY_COMPAT_ALLOW_RESTRICTED_RESIZABILITY')) {
  throw new Error('I2 materialization aborted: restricted-resizability opt-out is forbidden');
}
write(manifestPath, manifest);

write(
  'scripts/android-gradle.mjs',
  `import { spawnSync } from 'node:child_process';\n\nconst task = process.argv[2];\nif (!task) {\n  console.error('Usage: node scripts/android-gradle.mjs <task>');\n  process.exit(2);\n}\n\nconst executable = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';\nconst result = spawnSync(executable, [task], {\n  cwd: 'android',\n  stdio: 'inherit',\n  shell: process.platform === 'win32',\n});\n\nif (result.error) throw result.error;\nprocess.exit(result.status ?? 1);\n`,
);

const releasePath = 'release/release.json';
const release = JSON.parse(read(releasePath));
release.automatedCertification.androidPackagingContracts = true;
release.androidDistribution = {
  strategy: 'capacitor-8',
  nativePackaging: 'capacitor-local-bundle',
  applicationId: 'com.orbiecosystem.energyswarm',
  minSdk: 24,
  compileSdk: 36,
  targetSdk: 36,
  pipeline: 'github-actions-debug-apk',
  signing: 'external-secrets-required-for-release',
  requirement:
    'Complete real-device thermal/battery/ergonomics validation and external signing before RC promotion.',
};
release.pendingReleaseEngineering = release.pendingReleaseEngineering.filter(
  (item) => item !== 'android-packaging-pipeline',
);
write(releasePath, `${JSON.stringify(release, null, 2)}\n`);

let changelog = read('CHANGELOG.md');
const pwaBullet = '- Canonical GitHub Pages distribution metadata plus an installable PWA shell with\n  base-safe manifest, 192/512 install icons and SHA-versioned fail-open caching.\n';
const androidBullet = '- Reproducible Capacitor 8 Android packaging foundation targeting Android 16 /\n  API 36, with local web assets and a CI-built debug APK.\n';
if (!changelog.includes(androidBullet.trim())) {
  if (!changelog.includes(pwaBullet)) {
    throw new Error('I2 materialization aborted: changelog PWA anchor missing');
  }
  changelog = changelog.replace(pwaBullet, `${pwaBullet}${androidBullet}`);
}
changelog = changelog.replace(
  '- ES-12 native Android packaging and release-candidate certification remain open.',
  '- ES-12 release-candidate certification remains open; Android signing and real-device validation are still required.',
);
write('CHANGELOG.md', changelog);

write(
  'docs/ANDROID_PACKAGING.md',
  `# ORBI Energy Swarm — Android Packaging\n\n## Certified container decision\n\nES-12I2 uses **Capacitor 8** as the native Android container. The application packages the local Vite \`dist\` output and does not define a remote runtime \`server.url\`. Web/PWA delivery remains independently available through GitHub Pages.\n\n## Stable Android identity\n\n- Application ID: \`com.orbiecosystem.energyswarm\`\n- App name: \`ORBI Energy Swarm\`\n- Minimum SDK: 24\n- Compile SDK: 36\n- Target SDK: 36\n- Phone orientation: \`sensorLandscape\`\n\nAndroid 16 large-screen adaptive behavior is intentionally not disabled. The existing responsive viewport system remains authoritative for tablets and other large screens.\n\n## Build commands\n\n- \`npm run android:sync\` — builds the local web bundle and synchronizes it into the native project.\n- \`npm run android:debug\` — performs sync and builds the debug APK through the checked-in Gradle wrapper.\n\nThe permanent Android workflow runs the same debug pipeline on pull requests and canonical \`main\` changes, then uploads \`app-debug.apk\` as a CI artifact.\n\n## Signing boundary\n\nNo keystore, upload key, signing password or Play credential is committed to the repository. I2 proves deterministic native packaging only. Release signing must be introduced through protected external secrets in a later release-candidate phase.\n\n## Runtime preservation\n\nThe Android shell does not own gameplay state and does not alter Campaign, Infinite, H4–H12 systems, FOTON GLB, entity arrays or projectile/enemy budgets. The same compiled web runtime is packaged locally inside the Capacitor container.\n`,
);

write(
  'tests/android-packaging-contract.test.mjs',
  `import assert from 'node:assert/strict';\nimport { readFileSync } from 'node:fs';\nimport test from 'node:test';\n\nconst read = (path) => readFileSync(new URL(\`../\${path}\`, import.meta.url), 'utf8');\nconst json = (path) => JSON.parse(read(path));\nconst pkg = json('package.json');\nconst release = json('release/release.json');\nconst config = read('capacitor.config.ts');\nconst variables = read('android/variables.gradle');\nconst manifest = read('android/app/src/main/AndroidManifest.xml');\nconst appGradle = read('android/app/build.gradle');\nconst wrapper = read('android/gradle/wrapper/gradle-wrapper.properties');\nconst workflow = read('.github/workflows/android.yml');\n\ntest('I2 pins the stable Capacitor 8 family and local webDir authority', () => {\n  for (const name of ['@capacitor/core', '@capacitor/android']) {\n    assert.match(pkg.dependencies[name], /(?:\\^|~)?8\\./);\n  }\n  assert.match(pkg.devDependencies['@capacitor/cli'], /(?:\\^|~)?8\\./);\n  assert.match(config, /appId:\\s*['\"]com\\.orbiecosystem\\.energyswarm['\"]/);\n  assert.match(config, /appName:\\s*['\"]ORBI Energy Swarm['\"]/);\n  assert.match(config, /webDir:\\s*['\"]dist['\"]/);\n  assert.doesNotMatch(config, /server\\s*:\\s*\\{[\\s\\S]*url\\s*:/);\n});\n\ntest('I2 Android project targets the current certified API levels', () => {\n  assert.match(variables, /minSdkVersion\\s*=\\s*24/);\n  assert.match(variables, /compileSdkVersion\\s*=\\s*36/);\n  assert.match(variables, /targetSdkVersion\\s*=\\s*36/);\n  assert.match(wrapper, /gradle-8\\.14\\.3-all\\.zip/);\n  assert.match(appGradle, /applicationId\\s*(?:=\\s*)?['\"]com\\.orbiecosystem\\.energyswarm['\"]/);\n});\n\ntest('I2 keeps phones landscape-first without disabling Android adaptive layouts', () => {\n  assert.match(manifest, /android:screenOrientation=['\"]sensorLandscape['\"]/);\n  assert.doesNotMatch(manifest, /PROPERTY_COMPAT_ALLOW_RESTRICTED_RESIZABILITY/);\n});\n\ntest('I2 exposes deterministic sync/debug scripts', () => {\n  assert.equal(pkg.scripts['android:sync'], 'npm run build && npx cap sync android');\n  assert.equal(pkg.scripts['android:debug'], 'npm run android:sync && node scripts/android-gradle.mjs assembleDebug');\n});\n\ntest('I2 CI builds an APK without repository signing credentials', () => {\n  assert.match(workflow, /npm run android:debug/);\n  assert.match(workflow, /app-debug\\.apk/);\n  assert.doesNotMatch(workflow, /keystorepass|keystorealiaspass|storePassword|keyPassword|SIGNING_KEY/);\n});\n\ntest('I2 release metadata closes packaging pipeline but remains beta and non-RC', () => {\n  assert.equal(release.version, '0.2.0-beta.1');\n  assert.equal(release.releaseCandidateEligible, false);\n  assert.equal(release.androidDistribution.strategy, 'capacitor-8');\n  assert.equal(release.androidDistribution.targetSdk, 36);\n  assert.equal(release.androidDistribution.signing, 'external-secrets-required-for-release');\n  assert.ok(!release.pendingReleaseEngineering.includes('android-packaging-pipeline'));\n  assert.deepEqual(release.pendingReleaseEngineering, ['release-candidate-certification']);\n});\n`,
);

write(
  '.github/workflows/android.yml',
  `name: ORBI Energy Swarm Android\n\non:\n  pull_request:\n    paths:\n      - 'android/**'\n      - 'capacitor.config.ts'\n      - 'package.json'\n      - 'package-lock.json'\n      - 'src/**'\n      - 'public/**'\n      - 'index.html'\n      - 'vite.config.ts'\n      - 'scripts/android-gradle.mjs'\n      - '.github/workflows/android.yml'\n  push:\n    branches:\n      - main\n    paths:\n      - 'android/**'\n      - 'capacitor.config.ts'\n      - 'package.json'\n      - 'package-lock.json'\n      - 'src/**'\n      - 'public/**'\n      - 'index.html'\n      - 'vite.config.ts'\n      - 'scripts/android-gradle.mjs'\n      - '.github/workflows/android.yml'\n  workflow_dispatch:\n\npermissions:\n  contents: read\n\njobs:\n  android-debug:\n    runs-on: ubuntu-latest\n    timeout-minutes: 30\n    env:\n      ORBI_BUILD_SHA: \\${{ github.sha }}\n    steps:\n      - name: Checkout\n        uses: actions/checkout@v4\n\n      - name: Setup Node 22\n        uses: actions/setup-node@v4\n        with:\n          node-version: 22\n          cache: npm\n\n      - name: Setup Java 21\n        uses: actions/setup-java@v4\n        with:\n          distribution: temurin\n          java-version: '21'\n          cache: gradle\n\n      - name: Setup Android SDK\n        uses: android-actions/setup-android@v3\n\n      - name: Install Android 16 SDK\n        run: yes | sdkmanager 'platforms;android-36' 'build-tools;36.0.0' >/dev/null\n\n      - name: Install dependencies\n        run: npm ci\n\n      - name: Build Android debug APK\n        run: npm run android:debug\n\n      - name: Verify APK\n        run: test -s android/app/build/outputs/apk/debug/app-debug.apk\n\n      - name: Upload debug APK\n        uses: actions/upload-artifact@v4\n        with:\n          name: orbi-energy-swarm-debug-\${{ github.sha }}\n          path: android/app/build/outputs/apk/debug/app-debug.apk\n          if-no-files-found: error\n          retention-days: 14\n`,
);

console.log('ES-12I2 Android product tree materialized');
