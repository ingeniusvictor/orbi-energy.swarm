import assert from "node:assert/strict";
import test from "node:test";

import {
  EVOLVED_ENEMY_VARIANTS,
} from "../src/game/runtimeEnemyEvolution.ts";
import {
  NEUTRAL_EVOLVED_SIGNATURE_BEHAVIOR,
  projectEvolvedSignatureBehavior,
} from "../src/game/runtimeEnemySignatureBehavior.ts";
import {
  EnemyType,
  type EvolvedEnemySignature,
} from "../src/game/types.ts";

test("null unknown and malformed signature inputs fail neutral", () => {
  assert.deepEqual(
    projectEvolvedSignatureBehavior(null, 0.5),
    {
      ...NEUTRAL_EVOLVED_SIGNATURE_BEHAVIOR,
      signature: null,
      intensity: 0.5,
    },
  );

  assert.deepEqual(
    projectEvolvedSignatureBehavior(
      "UNKNOWN_SIGNATURE" as EvolvedEnemySignature,
      0.5,
    ),
    NEUTRAL_EVOLVED_SIGNATURE_BEHAVIOR,
  );

  for (const malformed of [
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
    -1,
  ]) {
    assert.deepEqual(
      projectEvolvedSignatureBehavior(
        "PHASE_LUNGE",
        malformed,
      ),
      {
        ...NEUTRAL_EVOLVED_SIGNATURE_BEHAVIOR,
        signature: "PHASE_LUNGE",
        intensity: 0,
      },
    );
  }
});

test("ARMORED_MOMENTUM only reduces projectile pushback", () => {
  const variant =
    EVOLVED_ENEMY_VARIANTS[EnemyType.CRAWLER];
  assert.ok(variant);

  const behavior = projectEvolvedSignatureBehavior(
    variant.signature,
    variant.specialIntensity,
  );

  assert.equal(
    behavior.signature,
    "ARMORED_MOMENTUM",
  );
  assert.ok(
    behavior.projectilePushbackMultiplier < 1,
  );
  assert.ok(
    behavior.projectilePushbackMultiplier >= 0.55,
  );
  assert.equal(
    behavior.parasiteLungeAmplitudeMultiplier,
    1,
  );
  assert.equal(
    behavior.droneVolleyProjectileCount,
    1,
  );
  assert.equal(behavior.splitterExtraMinions, 0);
  assert.equal(behavior.disruptDurationMultiplier, 1);
});

test("PHASE_LUNGE boosts only bounded parasite lunge axes", () => {
  const variant =
    EVOLVED_ENEMY_VARIANTS[EnemyType.PARASITE];
  assert.ok(variant);

  const behavior = projectEvolvedSignatureBehavior(
    variant.signature,
    variant.specialIntensity,
  );

  assert.equal(behavior.signature, "PHASE_LUNGE");
  assert.ok(
    behavior.parasiteLungeAmplitudeMultiplier > 1,
  );
  assert.ok(
    behavior.parasiteLungeAmplitudeMultiplier <= 1.42,
  );
  assert.ok(
    behavior.parasiteLungeFrequencyMultiplier > 1,
  );
  assert.ok(
    behavior.parasiteLungeFrequencyMultiplier <= 1.21,
  );
  assert.equal(
    behavior.projectilePushbackMultiplier,
    1,
  );
  assert.equal(
    behavior.droneVolleyProjectileCount,
    1,
  );
  assert.equal(behavior.splitterExtraMinions, 0);
  assert.equal(behavior.disruptDurationMultiplier, 1);
});

test("LANCE_VOLLEY permits one extra projectile with narrow bounded spread", () => {
  const variant =
    EVOLVED_ENEMY_VARIANTS[EnemyType.DRONE];
  assert.ok(variant);

  const behavior = projectEvolvedSignatureBehavior(
    variant.signature,
    variant.specialIntensity,
  );

  assert.equal(behavior.signature, "LANCE_VOLLEY");
  assert.equal(
    behavior.droneVolleyProjectileCount,
    2,
  );
  assert.ok(
    behavior.droneVolleySpreadRadians >= 0.04,
  );
  assert.ok(
    behavior.droneVolleySpreadRadians <= 0.09,
  );
  assert.equal(
    behavior.projectilePushbackMultiplier,
    1,
  );
  assert.equal(
    behavior.parasiteLungeAmplitudeMultiplier,
    1,
  );
  assert.equal(behavior.splitterExtraMinions, 0);
  assert.equal(behavior.disruptDurationMultiplier, 1);
});

test("BROOD_RELEASE permits at most one extra split minion", () => {
  const variant =
    EVOLVED_ENEMY_VARIANTS[EnemyType.SPLITTER];
  assert.ok(variant);

  const behavior = projectEvolvedSignatureBehavior(
    variant.signature,
    variant.specialIntensity,
  );

  assert.equal(behavior.signature, "BROOD_RELEASE");
  assert.equal(behavior.splitterExtraMinions, 1);
  assert.equal(
    behavior.droneVolleyProjectileCount,
    1,
  );
  assert.equal(
    behavior.projectilePushbackMultiplier,
    1,
  );
  assert.equal(
    behavior.parasiteLungeAmplitudeMultiplier,
    1,
  );
  assert.equal(behavior.disruptDurationMultiplier, 1);
});

test("NULL_PULSE extends disruption duration without exposing damage scaling", () => {
  const variant =
    EVOLVED_ENEMY_VARIANTS[EnemyType.DISRUPTOR];
  assert.ok(variant);

  const behavior = projectEvolvedSignatureBehavior(
    variant.signature,
    variant.specialIntensity,
  );

  assert.equal(behavior.signature, "NULL_PULSE");
  assert.ok(behavior.disruptDurationMultiplier > 1);
  assert.ok(
    behavior.disruptDurationMultiplier <= 1.24,
  );

  const keys = Object.keys(behavior);
  assert.equal(
    keys.some((key) =>
      key.toLowerCase().includes("damage"),
    ),
    false,
  );
});

test("all signature axes remain bounded across malformed and oversized intensities", () => {
  const signatures: EvolvedEnemySignature[] = [
    "ARMORED_MOMENTUM",
    "PHASE_LUNGE",
    "LANCE_VOLLEY",
    "BROOD_RELEASE",
    "NULL_PULSE",
  ];
  const intensities = [
    -10,
    -1,
    0,
    0.1,
    0.3,
    0.6,
    1,
    10,
    Number.NaN,
    Number.POSITIVE_INFINITY,
  ];

  for (const signature of signatures) {
    for (const intensity of intensities) {
      const behavior =
        projectEvolvedSignatureBehavior(
          signature,
          intensity,
        );

      assert.ok(behavior.intensity >= 0);
      assert.ok(behavior.intensity <= 0.6);
      assert.ok(
        behavior.projectilePushbackMultiplier >=
          0.55,
      );
      assert.ok(
        behavior.projectilePushbackMultiplier <= 1,
      );
      assert.ok(
        behavior.parasiteLungeAmplitudeMultiplier >=
          1,
      );
      assert.ok(
        behavior.parasiteLungeAmplitudeMultiplier <=
          1.42,
      );
      assert.ok(
        behavior.parasiteLungeFrequencyMultiplier >=
          1,
      );
      assert.ok(
        behavior.parasiteLungeFrequencyMultiplier <=
          1.21,
      );
      assert.ok(
        behavior.droneVolleyProjectileCount === 1 ||
          behavior.droneVolleyProjectileCount === 2,
      );
      assert.ok(
        behavior.droneVolleySpreadRadians >= 0,
      );
      assert.ok(
        behavior.droneVolleySpreadRadians <= 0.09,
      );
      assert.ok(
        behavior.splitterExtraMinions === 0 ||
          behavior.splitterExtraMinions === 1,
      );
      assert.ok(
        behavior.disruptDurationMultiplier >= 1,
      );
      assert.ok(
        behavior.disruptDurationMultiplier <= 1.24,
      );
    }
  }
});

test("zero intensity always neutralizes a recognized signature", () => {
  const signatures: EvolvedEnemySignature[] = [
    "ARMORED_MOMENTUM",
    "PHASE_LUNGE",
    "LANCE_VOLLEY",
    "BROOD_RELEASE",
    "NULL_PULSE",
  ];

  for (const signature of signatures) {
    assert.deepEqual(
      projectEvolvedSignatureBehavior(
        signature,
        0,
      ),
      {
        ...NEUTRAL_EVOLVED_SIGNATURE_BEHAVIOR,
        signature,
        intensity: 0,
      },
    );
  }
});
