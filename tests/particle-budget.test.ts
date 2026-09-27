import assert from "node:assert/strict";
import test from "node:test";

import {
  createParticle,
  pushParticleWithinBudget,
} from "../src/game/particleSystem.ts";
import { ParticleType } from "../src/game/types.ts";

const particle = (id: number) => ({
  ...createParticle(
    ParticleType.FUSION,
    id,
    id + 1,
    0.5,
    -0.25,
    2,
    "#ffffff",
    30,
  ),
  id: `particle-${id}`,
});

test("single-particle budget accepts payload unchanged below capacity", () => {
  const particles = [particle(1)];
  const candidate = particle(2);

  const accepted = pushParticleWithinBudget(
    particles,
    3,
    candidate,
  );

  assert.equal(accepted, true);
  assert.equal(particles.length, 2);
  assert.equal(
    particles[1],
    candidate,
    "accepted particle object remains unchanged",
  );
});

test("single-particle budget drops cosmetic payload exactly at capacity", () => {
  const particles = [
    particle(1),
    particle(2),
  ];
  const candidate = particle(3);

  const accepted = pushParticleWithinBudget(
    particles,
    2,
    candidate,
  );

  assert.equal(accepted, false);
  assert.equal(particles.length, 2);
  assert.ok(
    !particles.some(
      (entry) => entry.id === candidate.id,
    ),
  );
});

test("single-particle budget sanitizes malformed or fractional caps fail-safe", () => {
  const malformed: unknown[] = [
    Number.NaN,
    Number.POSITIVE_INFINITY,
    -2,
  ];

  for (const cap of malformed) {
    const particles: ReturnType<typeof particle>[] = [];
    assert.equal(
      pushParticleWithinBudget(
        particles,
        cap as number,
        particle(1),
      ),
      false,
    );
    assert.equal(particles.length, 0);
  }

  const particles: ReturnType<typeof particle>[] = [];
  assert.equal(
    pushParticleWithinBudget(
      particles,
      1.9,
      particle(1),
    ),
    true,
  );
  assert.equal(
    pushParticleWithinBudget(
      particles,
      1.9,
      particle(2),
    ),
    false,
  );
  assert.equal(particles.length, 1);
});
