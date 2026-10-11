import assert from "node:assert/strict";
import test from "node:test";
import {
  SWARM_ABSOLUTE_CAP,
  canRecruitSwarmMember,
  createSwarmDoctrineState,
  getSwarmDoctrineCapacity,
  projectSwarmDoctrine,
  registerSwarmDoctrineLevel,
  registerSwarmDoctrineMember,
} from "../src/game/swarmDoctrine.ts";

const seedFounders = () => {
  let state = createSwarmDoctrineState();
  for (let index = 1; index <= 10; index += 1) {
    state = registerSwarmDoctrineMember(state, `founder-${index}`, 1);
  }
  return state;
};

test("Phase I starts at exactly ten follower slots", () => {
  const state = seedFounders();
  assert.equal(getSwarmDoctrineCapacity(state), 10);
  assert.equal(canRecruitSwarmMember(state, 9), true);
  assert.equal(canRecruitSwarmMember(state, 10), false);
  assert.equal(projectSwarmDoctrine(state).phase, "FOUNDING");
});

test("each distinct Founding-Ten level-5 promotion grants one slot through 20", () => {
  let state = seedFounders();
  for (let index = 1; index <= 10; index += 1) {
    state = registerSwarmDoctrineLevel(state, `founder-${index}`, 5);
    assert.equal(getSwarmDoctrineCapacity(state), 10 + index);
  }
  assert.equal(getSwarmDoctrineCapacity(state), 20);
});

test("non-founder level-5 members cannot accelerate Phase II", () => {
  let state = seedFounders();
  state = registerSwarmDoctrineLevel(state, "late-member", 99);
  assert.equal(getSwarmDoctrineCapacity(state), 10);
});

test("Phase III requires ten level-10 promotions for slot 21 and nineteen for slot 30", () => {
  let state = seedFounders();
  for (let index = 1; index <= 10; index += 1) {
    state = registerSwarmDoctrineLevel(state, `founder-${index}`, 5);
  }
  assert.equal(getSwarmDoctrineCapacity(state), 20);

  for (let index = 1; index <= 9; index += 1) {
    state = registerSwarmDoctrineLevel(state, `veteran-${index}`, 10);
  }
  assert.equal(getSwarmDoctrineCapacity(state), 20);

  state = registerSwarmDoctrineLevel(state, "veteran-10", 10);
  assert.equal(getSwarmDoctrineCapacity(state), 21);

  for (let index = 11; index <= 19; index += 1) {
    state = registerSwarmDoctrineLevel(state, `veteran-${index}`, 10);
  }
  assert.equal(getSwarmDoctrineCapacity(state), 30);
  assert.equal(projectSwarmDoctrine(state).nextUnlockLevel, null);
});

test("promotion credit is monotonic and duplicate reports never create extra slots", () => {
  let state = seedFounders();
  state = registerSwarmDoctrineLevel(state, "founder-1", 5);
  state = registerSwarmDoctrineLevel(state, "founder-1", 5);
  state = registerSwarmDoctrineLevel(state, "founder-1", 12);
  state = registerSwarmDoctrineLevel(state, "founder-1", 20);
  assert.equal(state.founderLevel5Ids.length, 1);
  assert.equal(state.level10Ids.length, 1);
  assert.equal(getSwarmDoctrineCapacity(state), 11);
});

test("absolute cap can never exceed thirty", () => {
  let state = seedFounders();
  for (let index = 1; index <= 10; index += 1) {
    state = registerSwarmDoctrineLevel(state, `founder-${index}`, 5);
  }
  for (let index = 1; index <= 100; index += 1) {
    state = registerSwarmDoctrineLevel(state, `elite-${index}`, 10);
  }
  assert.equal(getSwarmDoctrineCapacity(state), SWARM_ABSOLUTE_CAP);
  assert.equal(canRecruitSwarmMember(state, 30), false);
  assert.equal(canRecruitSwarmMember(state, 29), true);
});
