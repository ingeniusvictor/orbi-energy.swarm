import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const json = (path) => JSON.parse(read(path));
const pkg = json('package.json');
const release = json('release/release.json');
const config = read('capacitor.config.ts');
const variables = read('android/variables.gradle');
const manifest = read('android/app/src/main/AndroidManifest.xml');
const appGradle = read('android/app/build.gradle');
const wrapper = read('android/gradle/wrapper/gradle-wrapper.properties');
const workflow = read('.github/workflows/android.yml');

test('I2 pins the stable Capacitor 8 family and local webDir authority', () => {
  for (const name of ['@capacitor/core', '@capacitor/android']) {
    assert.match(pkg.dependencies[name], /(?:\^|~)?8\./);
  }
  assert.match(pkg.devDependencies['@capacitor/cli'], /(?:\^|~)?8\./);
  assert.match(config, /appId:\s*['"]com\.orbiecosystem\.energyswarm['"]/);
  assert.match(config, /appName:\s*['"]ORBI Energy Swarm['"]/);
  assert.match(config, /webDir:\s*['"]dist['"]/);
  assert.doesNotMatch(config, /server\s*:\s*\{[\s\S]*url\s*:/);
});

test('I2 Android project targets the current certified API levels', () => {
  assert.match(variables, /minSdkVersion\s*=\s*24/);
  assert.match(variables, /compileSdkVersion\s*=\s*36/);
  assert.match(variables, /targetSdkVersion\s*=\s*36/);
  assert.match(wrapper, /gradle-8\.14\.3-all\.zip/);
  assert.match(appGradle, /applicationId\s*(?:=\s*)?['"]com\.orbiecosystem\.energyswarm['"]/);
});

test('I2 keeps phones landscape-first without disabling Android adaptive layouts', () => {
  assert.match(manifest, /android:screenOrientation=['"]sensorLandscape['"]/);
  assert.doesNotMatch(manifest, /PROPERTY_COMPAT_ALLOW_RESTRICTED_RESIZABILITY/);
});

test('I2 exposes deterministic sync/debug scripts', () => {
  assert.equal(pkg.scripts['android:sync'], 'npm run build && npx cap sync android');
  assert.equal(pkg.scripts['android:debug'], 'npm run android:sync && node scripts/android-gradle.mjs assembleDebug');
});

test('I2 CI builds an APK without repository signing credentials', () => {
  assert.match(workflow, /npm run android:debug/);
  assert.match(workflow, /app-debug\.apk/);
  assert.doesNotMatch(workflow, /keystorepass|keystorealiaspass|storePassword|keyPassword|SIGNING_KEY/);
});

test('I2 release metadata closes packaging pipeline but remains beta and non-RC', () => {
  assert.equal(release.version, '0.2.0-beta.1');
  assert.equal(release.releaseCandidateEligible, false);
  assert.equal(release.androidDistribution.strategy, 'capacitor-8');
  assert.equal(release.androidDistribution.targetSdk, 36);
  assert.equal(release.androidDistribution.signing, 'external-secrets-required-for-release');
  assert.ok(!release.pendingReleaseEngineering.includes('android-packaging-pipeline'));
  assert.deepEqual(release.pendingReleaseEngineering, ['release-candidate-certification']);
});
