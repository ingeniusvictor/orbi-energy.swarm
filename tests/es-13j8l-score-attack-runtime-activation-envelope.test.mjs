import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  "src/game/scoreAttackRuntimeActivationEnvelope.ts",
  "utf8",
);
const bootstrapSource = readFileSync(
  "src/game/scoreAttackBootstrapEnvelope.ts",
  "utf8",
);
const bundleSource = readFileSync(
  "src/game/scoreAttackRuntimeProjectionBundle.ts",
  "utf8",
);
const terminalSource = readFileSync(
  "src/game/scoreAttackTerminalCompletionDisposition.ts",
  "utf8",
);
const gameSource = readFileSync("src/game/EnergySwarmGame.tsx", "utf8");


test("J8L composes frozen J8H and J8K directly without reconstructing runtime/session authorities", () => {
  assert.match(source, /resolveScoreAttackBootstrapEnvelope\(modeId\)/);
  assert.match(
    source,
    /resolveScoreAttackRuntimeProjectionBundle\(bootstrapEnvelope\)/,
  );
  assert.match(
    source,
    /const runtimeProgression = bootstrapEnvelope\.runtimeProgression/,
  );
  assert.match(
    source,
    /const runtimeSession = runtimeProgression\.session/,
  );
  assert.match(
    source,
    /const effectiveDescriptor = runtimeProjectionBundle\.descriptor/,
  );

  assert.doesNotMatch(source, /createInfiniteSession|createInfiniteRuntimeState/);
  assert.match(bootstrapSource, /createInfiniteSession/);
  assert.match(bootstrapSource, /createInfiniteRuntimeState/);
});

test("J8L preserves SCORE_ATTACK outside RuntimeProgressionState and carries exact TIMEBOX activation facts", () => {
  assert.match(source, /modeId:\s*"SCORE_ATTACK"/);
  assert.match(source, /sourceRuntimeMode:\s*"INFINITE"/);
  assert.match(source, /SCORE_ATTACK_DURATION_MS/);
  assert.match(source, /type:\s*"TIMEBOX" as const/);
  assert.match(source, /preservesCanonicalModeIdentityOutsideRuntimeDiscriminator:\s*true/);
  assert.match(source, /addsRuntimeProgressionDiscriminator:\s*false/);

  assert.match(bundleSource, /adaptiveInvasionBypassed:\s*true/);
  assert.match(bundleSource, /usesLiveFollowerCount:\s*false/);
  assert.match(bundleSource, /dynamicEventAdoption:\s*null/);
  assert.match(bundleSource, /bonusChallengeAdoption:\s*null/);
});

test("J8L remains pure and disconnected from live cache/UI/terminal/persistence seams", () => {
  const forbiddenImports = [
    "./runtimeProjectionBundleCache",
    "./scoreAttackTerminalCompletionDisposition",
    "./runPersistence",
    "./storage",
    "../components/StartScreen",
    "../components/ResultScreen",
    "../components/GameHud",
    "./EnergySwarmGame",
  ];

  for (const modulePath of forbiddenImports) {
    assert.equal(
      source.includes(`from \"${modulePath}\"`),
      false,
      `J8L must not import ${modulePath}`,
    );
  }

  assert.doesNotMatch(
    source,
    /localStorage|sessionStorage|Date\.now|performance\.now|Math\.random/,
  );
  assert.match(source, /writesRuntimeProjectionCache:\s*false/);
  assert.match(source, /adoptsLiveRuntime:\s*false/);
  assert.match(source, /writesReactStateOrRefs:\s*false/);
  assert.match(source, /startsOrTicksTimer:\s*false/);
  assert.match(source, /executesTerminalDisposition:\s*false/);

  assert.equal(
    gameSource.includes("scoreAttackRuntimeActivationEnvelope"),
    false,
    "EnergySwarmGame must not import J8L yet",
  );
  assert.equal(
    terminalSource.includes("scoreAttackRuntimeActivationEnvelope"),
    false,
    "J8J must remain separate from J8L",
  );
});

test("J8L authority contract has activation-envelope construction as its only positive authority", () => {
  const positiveMatches = [
    ...source.matchAll(/\b(owns[A-Za-z]+|may[A-Za-z]+):\s*true/g),
  ].map((match) => match[1]);

  assert.deepEqual([...new Set(positiveMatches)], [
    "ownsRuntimeActivationEnvelopeConstructionAuthority",
  ]);
});
