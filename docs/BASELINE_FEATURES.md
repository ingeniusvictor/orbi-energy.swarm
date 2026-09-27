# Baseline Features

This document details all functional systems fully integrated and running in **ORBI ENERGY SWARM v0.1.0-prototype-recovery-baseline**.

## 1. High-Performance HTML5 Canvas Game Loop
- Fully stabilized rendering system decoupled from React's state lifecycle.
- Single master `requestAnimationFrame` driving uniform updates using `deltaTime` scaling (60 FPS objective speed baseline).
- Automatic boundary clamping preventing entities from moving out of the logical 800x600 coordinate play zone.
- Correctly mapped canvas interaction vectors regardless of client window size or aspect scaling.

## 2. Autonomous Swarm Follower Formations
- **Orbi Foton**: Amber leader displaying responsive glowing tech-orbits and directional eyeballs.
- **Organic Follower Formations**: Keys `1` to `6` or panel buttons dynamically recalibrate swarm positions:
  1. **Horizontal Sweep**: Wide flanking line behind Foton.
  2. **Orbiting Vanguard**: Circular rotating shield grid.
  3. **Delta Wedge**: Spearhead focus spear pointing forward.
  4. **Guardian Halo**: Close high-defense orbital protection ring.
  5. **Flanking Vees**: Standard V-wing dogfight vector.
  6. **Swarm Chaos**: Scattered, organic sine-wave trailing.

## 3. Weapon & Enemy AI Simulation
- **Automated Target Seeking**: Follower units automatically seek the nearest enemy within range and fire laser blasts with unique shoot audio clicks.
- **Enemy Classes**:
  - **Crawler**: Slithers toward player in trailing segmented orbits.
  - **Parasite**: Twitchy rapid leaps that latch and deal contact damage.
  - **Drone**: Retains high-distance hover while firing periodic pink energy plasma bolts at the player.

## 4. Harvestable Resources & Upgrades
- **Nano Crystals (Amber)**: Standard NC credits used to trigger permanent shop upgrades.
- **Energy Crystals (Cyan)**: Power core crystals that grant purified energy scores and drive procedural shifts.
- **Wild Orbi (Pink Hexagon Stars)**: Rescuing these recruits a new active shooting unit to the player's swarm.

## 5. Procedural Biome Environments
- **Solar Plains**: Amber grids. Doubles Nano Credit crystal yields.
- **Deep Water**: Cyan grids. Slows entities but doubles player shield regeneration.
- **Cyber Void**: Violet grids. Increases swarm weapon cycle rates.
- **Acid Swamp**: Emerald grids. Increases damage.
- **Magma Chamber**: Red grids. Higher score multipliers but faster enemy spawns.
- **Quantum Nexus**: Pink grids. High probability multipliers.

## 6. Cybernetic Glassmorphic UI & Sidebar
- **HUD Row**: Displays live Enigm-Core integrity, Active Sector, and Swarm Vector.
- **Tab Panel**:
  - **Swarm**: Active member roster and stats.
  - **Civ**: Cumulative game progression stats.
  - **Log**: Dialogues history and transmissions log.
  - **Relics**: Shop where users buy permanent upgrades (Hydrogen Deflector, Quantum Core, Fusion Resonator, Nano Catalyst, Mitosis Relic).
- **Mobile D-Pad**: Functional directional button array.
- **Interactive Companion LUX-8**: Displays real-time context-aware tactical dialogues.
