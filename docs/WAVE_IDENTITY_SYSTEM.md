# ORBI ENERGY SWARM
## MODULE 0B.5 — WAVE IDENTITY SYSTEM

The Wave Identity System is designed to ensure that every combat sector has a distinctive tactical personality, visual aura, and mechanical rule set, transforming the survival flow from a generic scaling challenge into a series of memorable combat puzzles.

---

## 1. DESIGN PRINCIPLES

1. **Dominant Threat**: Every wave centers on a specific enemy type and behavior.
2. **Tactical Advice**: The Threat Intel deck displays contextual hints and recommeded formations in real-time.
3. **Active Wave Modifier**: Environmental hazards, support spawning rates, and speed surges that force adaptive gameplay.
4. **Visual Aura**: Dedicated threat warning levels (LOW to CRITICAL) color-code the sector HUD and cinematic banners.
5. **Mid-Run Transition**: Intermission phases allow tactical retrofits (temporary upgrades) to prepare for the subsequent sector.

---

## 2. THE 10 CANONICAL SECTORS

### SECTOR 01: SOLAR RECON (Wave 1)
- **Dominant Threat**: Crawlers (meandering, low damage).
- **Aura & Warning**: Deep Blue `#3b82f6` (LOW).
- **Description**: Initial orbit. Sweep low-density scouts and gather starting quantum cores.
- **Modifier**: None.
- **Recommended Formation**: LINE (Asalto frontal).
- **Tactical Advice**: Collect resources quickly to establish your initial swarm.

### SECTOR 02: KINETIC PRESSURE (Wave 2)
- **Dominant Threat**: Parasites (fast, direct chargers).
- **Aura & Warning**: Indigo `#6366f1` (MEDIUM).
- **Description**: Fast-moving kinetic parasites are closing in. Optimize lateral movement.
- **Modifier**: `MULTI_DIRECTIONAL_SPAWN` (Scouts arrive from random screen boundaries instead of standard patterns).
- **Recommended Formation**: DELTA (Vanguard directionality).
- **Tactical Advice**: Use Delta convergance to drill through concentrated charger pockets.

### SECTOR 03: ORBITAL BOMBER (Wave 3)
- **Dominant Threat**: Drones (long-range stationary snipers).
- **Aura & Warning**: Teal `#14b8a6` (MEDIUM).
- **Description**: Deep bombardment sirens. High density drone formations are anchoring.
- **Modifier**: `DRONE_TARGETING_DENSITY` (Drone shooting intervals are accelerated by 40%).
- **Recommended Formation**: CIRCLE (Radial bullet collection).
- **Tactical Advice**: Circle formation shields FOTON while expanding your projectile sweep.

### SECTOR 04: DIVISION POINT (Wave 4)
- **Dominant Threat**: Splitters (mitotic heavy tanks).
- **Aura & Warning**: Orange `#f97316` (HIGH).
- **Description**: Heavy splitting nodes detected. Avoid getting cornered by mitotic swarms.
- **Modifier**: None.
- **Recommended Formation**: V_SHAPE (Vanguard sweep).
- **Tactical Advice**: Splitters break into two smaller minions on death. Sweep them out with wide angular firing.

### SECTOR 05: BLACKOUT SHADOW (Wave 5)
- **Dominant Threat**: Blackout Elites (armored frontal shields, rear vulnerability).
- **Aura & Warning**: Rose `#f43f5e` (HIGH).
- **Description**: Frontal deflective shields are online. Coordinate flanking attacks.
- **Modifier**: `BLACKOUT_HAZARD_ZONES` (Static dark void pockets spawn on the canvas, draining shields on contact).
- **Recommended Formation**: SCATTERED (Spread out flanking).
- **Tactical Advice**: Avoid front shield blocks; flank Blackout Elites from behind for critical 1.4x damage.

### SECTOR 06: DISRUPTOR WAVE (Wave 6)
- **Dominant Threat**: Disruptors (EMP charging pulsers, area slow down).
- **Aura & Warning**: Amber `#f59e0b` (HIGH).
- **Description**: Electromagnetic disruption waves are disabling swarm cohesion. Protect the leader.
- **Modifier**: `DISRUPTION_INTENSITY` (Disruptors release periodic electromagnetic pulses that heavily decelerate FOTON).
- **Recommended Formation**: SHIELD (Tight defensive pocket).
- **Tactical Advice**: Keep the swarm close in Shield formation to block long-range static pulses.

### SECTOR 07: KINETIC STORM (Wave 7)
- **Dominant Threat**: Parasites & Splitters (Combined charge and splits).
- **Aura & Warning**: Orange `#f97316` (HIGH).
- **Description**: Extreme kinetic swarm. High speed parasites are supporting dividing splitters.
- **Modifier**: `PARASITE_SPEED_SURGE` (Parasites gain +50% movement speed).
- **Recommended Formation**: DELTA (Concentrated fire).
- **Tactical Advice**: Delta convergence clears chargers before splitters divide.

### SECTOR 08: ELITE APEX (Wave 8)
- **Dominant Threat**: Blackout Elites & Drones (Combined shield tanks and snipers).
- **Aura & Warning**: Rose `#f43f5e` (HIGH).
- **Description**: Elite defensive shields are flanked by synchronized drone bombardment arrays.
- **Modifier**: `ELITE_SUPPORT` (Every elite enemy spawned carries a defensive drone escort).
- **Recommended Formation**: SCATTERED (Flanking sweep).
- **Tactical Advice**: Scatter the swarm to flank shields while collecting double resource drops.

### SECTOR 09: ECLIPSE HORIZON (Wave 9)
- **Dominant Threat**: All Standard Enemies (crawler, parasite, drone, splitter, disruptor, elite).
- **Aura & Warning**: Violet `#8b5cf6` (HIGH).
- **Description**: Planetary shadow covers the battlefield. Complete mechanical chaos detected.
- **Modifier**: `CORE_DROP_BOOST` (Double resource drops spawned upon non-minion enemy destruction).
- **Recommended Formation**: CIRCLE (Total perimeter collection).
- **Tactical Advice**: Leverage the double resources to quickly evolutionize your remaining followers.

### SECTOR 10: BLACKOUT DEVOURER (Wave 10)
- **Dominant Threat**: Blackout Devourer (Gigantic multi-phase boss).
- **Aura & Warning**: Red `#ef4444` (CRITICAL).
- **Description**: The Blackout Devourer has entered orbit. Neutralize the dark void core!
- **Modifier**: `FINAL_SIEGE` (All remaining enemies focus on supporting the boss node).
- **Recommended Formation**: DELTA / V_SHAPE (Focused armor piercing).
- **Tactical Advice**: Concentrate your swarm in Delta formation directly on the boss's core to maximize single-target DPS.
