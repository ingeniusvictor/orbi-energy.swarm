# ORBI ENERGY SWARM: RECRUITMENT ATOMICITY QA
## Version Target: v0.2.1-swarm-identity-recovery

### 1. The Multi-Frame Processing Collision Hazard
In high-intensity gameplay states, resources and the player circle each other rapidly. When the player overlaps with a Wild Orbi, a collision trigger is registered. If the overlap persists across multiple high-frequency engine frames (e.g., during 60Hz physics ticks), or if the resource-collection animation delays deletion, the game could trigger multiple separate `addSwarmMember` calls for a single physical pickup.

This result in an unrequested population surge (e.g., gathering one Wild Orbi adding 4 swarm members).

---

### 2. Idempotent Locking Mechanism
To achieve absolute recruitment atomicity, an explicit double-lock safety protocol is implemented:

```ts
interface Resource {
  id: string;
  type: "NANO" | "ENERGY" | "ORBI";
  x: number;
  y: number;
  size: number;
  color: string;
  consumed?: boolean; // Idempotent thread-safe simulation lock
  // ... elemental data
}
```

#### Collision Resolution Flow
1. **Overlap Detected**: The distance between player position and the resource is smaller than the harvest/pull threshold.
2. **Idempotency Gate**: The game checks if `resource.consumed === true`. If already locked, the loop skips further processing.
3. **Atomic State Write**: The engine instantly updates `resource.consumed = true` on the mutable reference, locking it for all other checks in the same frame or subsequent frames.
4. **Member Addition**: `addSwarmMember()` is called exactly once.
5. **Garbage Collection**: On the next loop cycle, the resource filter removes all locked elements: `resourcesRef.current = resourcesRef.current.filter(r => !r.consumed)`.

This guarantees **"ONE WILD ORBI COLLECTED = EXACTLY ONE SWARM MEMBER RECRUITED"**.

---

### 3. QA Test Suite Specifications

#### Test 1: Atomic Recruitment Test
*   **Procedure**: Drop a single Wild Orbi on screen. Steer the player directly over it.
*   **Success Criteria**: The Swarm count increments by exactly 1. No secondary or tertiary members are added.

#### Test 2: Multi-Frame Overlap Test
*   **Procedure**: Position the player directly on top of a Wild Orbi and pause/unpause to verify overlap processing.
*   **Success Criteria**: The resource is consumed and cleared; the roster size increases by exactly 1.

#### Test 3: Element Diversity Test
*   **Procedure**: Collect 20 Wild Orbis in a row.
*   **Success Criteria**: The roster displays a diverse mixture of Solar, Hydro, Wind, Thermal, Nuclear, and Quantum units. Long streaks of a single element are absent.

#### Test 4: Roster Consistency Test
*   **Procedure**: Open the "SWARM" tab in the Companion Panel. Collect 3 Wild Orbis.
*   **Success Criteria**: The list displays exactly the names and assigned elements of the new followers. No members revert to yellow or generic BEAM types.

#### Test 5: Hydro Element Slow Effect Test
*   **Procedure**: Recruit a Hydro Orbi and shoot a regular fast enemy (Crawler/Parasite).
*   **Success Criteria**: Upon hit, the enemy's movement speed drops immediately to 45% of its normal rate and recovers after 2.5 seconds.

#### Test 6: Thermal AoE Splash Damage Test
*   **Procedure**: Shoot a Thermal Orbi's red blast into a cluster of tight enemies.
*   **Success Criteria**: Nearby enemies within 55px receive splash damage (45% power) and display small hit explosions.

#### Test 7: Nuclear Damage Scaling Test
*   **Procedure**: Fire a Nuclear violet projectile and a Solar golden projectile.
*   **Success Criteria**: The Nuclear projectile is visually larger and slower, dealing 2.2x base damage on impact.

#### Test 8: Quantum Critical Chance Test
*   **Procedure**: Monitor a Quantum Orbi firing multiple magenta projectiles.
*   **Success Criteria**: Approximately 22% of projectiles spawn larger and deal 2.5x critical damage, accompanied by particle pops.

#### Test 9: Mitosis Double-Shoot Relic Test
*   **Procedure**: Buy the Mitosis Relic and level it up to Level 2. Fire weapons.
*   **Success Criteria**: Weapon shots have a 20% chance to double-fire, spawning two projectiles side-by-side with identical colors and elemental properties.

#### Test 10: Roster Limit Integrity Test
*   **Procedure**: Recruit 100 members.
*   **Success Criteria**: The swarm population caps at exactly 100 followers; subsequent collections yield score/credits but no more roster slots.
