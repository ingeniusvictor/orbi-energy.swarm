# MODULE 0B.6 — BOSS QA & CERTIFICATION SUITE
**Target Version:** `v0.2.6-blackout-devourer`

To guarantee full simulation stability and elite desktop-first performance under high load (60 Orbi followers + 1200 high-density particles), the following checklist must be validated on every release.

## 1. Simulation Resource Limits
- **Max Active Particles:** Checked against quality configurations. Throttles from `80` (Low) to `1200` (Ultra).
- **Target Framerate:** `60 FPS` stable.
- **CPU Overhead:** Managed by utilizing mutable raw state references (refs) instead of high-frequency state updates.

## 2. Mandatory Integration Test Items
1. **[PASS] Telemetry Initiation:** Confirmed all metrics are zeroed on `startGame` and correctly incremented on impact.
2. **[PASS] Encounter Ingress:** Confirm current wave `10` transitions directly to the boss alert sequence once general enemies are purged.
3. **[PASS] Phase 1 Transitions:** Confirmed transition occurs correctly at `70% HP` with full mutator dialogues.
4. **[PASS] Phase 2 Transitions:** Orbiting shield nodes are successfully spawned; boss shield reduces direct incoming damage to 25%.
5. **[PASS] Core Vulnerability:** Purging all 3 nodes correctly triggers a 4.0s double damage window.
6. **[PASS] Phase 3 Transitions:** Transition occurs at `35% HP` with full mutator dialogues.
7. **[PASS] Hazard Boundaries:** Eclipse lanes and sweep angles are calculated relative to the canvas aspect ratio, not hardcoded viewport sizes.
8. **[PASS] State Cleanups on Reboot:** Pressing the `R` key or triggering Quick Reboot clears all hazard zones, boss indicators, active charge vectors, and particle queues.
9. **[PASS] Audio Coexistence:** All procedurally generated synths trigger properly and co-exist safely without cracking or building feedback loops.
10. **[PASS] Result Screen Telemetry:** Accurate breakdown of boss damage dealt, shield nodes destroyed, damage taken, and final phase reached is rendered on defeat or victory.
