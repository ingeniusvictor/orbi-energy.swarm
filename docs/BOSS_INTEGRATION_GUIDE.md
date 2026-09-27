# MODULE 0B.6 — BLACKOUT DEVOURER BOSS INTEGRATION GUIDE
**Target Version:** `v0.2.6-blackout-devourer`

This document details the high-fidelity integration of the **Blackout Devourer** boss enemy within the central HTML5 Canvas 2D decoupled game loop of Orbi Energy Swarm.

## 1. Boss Architecture & State Management
To prevent React re-render overhead at high framerates (60 FPS with up to 60 followers), the complete boss telemetry and physics states are managed utilizing high-frequency mutable React refs:
- `bossActiveRef.current`: A boolean flag signaling if the boss encounter is active.
- `bossRef.current`: A reference to the physical `Enemy` object in the active physics sweep list.
- `bossCurrentAttackRef.current`: Stores the ID of the current active attack (e.g., `devourer_charge`, `singularity_pulse`).
- `bossAttackTimerRef.current`: Active ticks or duration remaining for the current attack/telegraph cycle.
- `shieldNodesRef.current`: Sub-array representing active orbiting defensive shield modules.

## 2. Combat Phases
The encounter is segmented into three distinct mechanical behaviors:
1. **Phase 1: Devourer Ingress (100% to 70% HP)**
   - Sweeps the workspace utilizing linear rotations (`Devourer Beam`) and radial projectiles (`Orbital Shards`).
2. **Phase 2: Collapse Engine (70% to 35% HP)**
   - Gains a 75% defense reduction shield protected by 3 orbiting **Shield Nodes**.
   - Purging all 3 nodes triggers a 4.0s core exposure window where the boss takes double damage.
3. **Phase 3: Singularity Crown (35% to 0% HP)**
   - Highly chaotic finale. Triggers rotating hazards, massive gravity wells, and targeted high-velocity charges.

## 3. Decoupled Frame Processing
The boss logic is processed during the regular update step inside `updateEnginePhysics`:
- When the current wave is `10` and no enemies remain, `spawnBoss` is called.
- Each frame, if `bossActiveRef.current` is true, the active attack timers, orbital calculations for shield nodes, and hazards are updated.
- Standard engine operations (collision, particle generation, player hits) are fully integrated.
