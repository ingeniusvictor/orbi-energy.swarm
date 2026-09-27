# ORBI ENERGY SWARM
## MODULE 0B.5 — WAVE & UPGRADE QA PROTOCOL

This QA document details the 15 specific functional tests designed to verify that the Wave Identity, Mid-Run Upgrade Selection, and Threat Intel display systems function in complete visual and computational alignment.

---

## TEST SUITE 1: WAVE MOVEMENT & SPATIAL INTEGRITY
*Verify that the expanded world map and boundary limits behave seamlessly with the new wave modifier states.*

### Test 1.1: World Boundary Retention
- **Steps**: Start a new game. Navigate FOTON to the absolute edges of the 1600x960 expanded arena (Top-Left, Top-Right, Bottom-Left, Bottom-Right).
- **Expected Outcome**: FOTON and the swarm followers are cleanly clamped at `x: [16, 1584]` and `y: [16, 944]`. No follower detaches or gets lost beyond the camera boundary.

### Test 1.2: Multi-Directional Spawn Coverage (`MULTI_DIRECTIONAL_SPAWN`)
- **Steps**: Progress to Sector 02 (Wave 2). Observe enemy spawn alerts on the radar.
- **Expected Outcome**: Enemies emerge from all four physical screen margins (top, bottom, left, right) rather than clustering at a single coordinate line, validating boundary-aware spawn calculations.

### Test 1.3: Environmental Hazard Clearance (`BLACKOUT_HAZARD_ZONES`)
- **Steps**: Enter Sector 05 (Wave 5). Observe the visual hazard zone markers (semi-transparent purple danger areas). Wait for Sector 05 to complete and transition into intermission.
- **Expected Outcome**: The active hazard zones are completely purged from the battlefield array immediately upon wave completion, leaving a clean arena for the upgrade selection.

---

## TEST SUITE 2: RECOGNIZABLE WAVE CONSTRAINTS
*Verify that the 10 canonical waves execute their specific mechanical restrictions.*

### Test 2.1: Drone Targeting Density Accelerated Rate
- **Steps**: Enter Sector 03 (Wave 3). Stand near a Drone enemy.
- **Expected Outcome**: Drones fire plasma bolts 40% faster than in Sector 01 or 02, aligning with `DRONE_TARGETING_DENSITY` constraints.

### Test 2.2: Parasite Speed Surge
- **Steps**: Enter Sector 07 (Wave 7). Observe the Parasite movement speed.
- **Expected Outcome**: Parasites move with an aggressive +50% speed multiplier, sprinting towards FOTON.

### Test 2.3: Elite Support Escorts
- **Steps**: Progress to Sector 08 (Wave 8). Watch a Blackout Elite enemy spawn.
- **Expected Outcome**: A defensive sniper Drone escort is spawned simultaneously adjacent to the elite, verifying synchronized elite spawning.

### Test 2.4: Double Drops Modifier (`CORE_DROP_BOOST`)
- **Steps**: Progress to Sector 09 (Wave 9). Destroy a non-minion enemy.
- **Expected Outcome**: Double resource cores drop on the coordinate location.

---

## TEST SUITE 3: MID-RUN RETROFIT SYNCHRONIZATION
*Verify that temporary upgrades apply correct mathematical modifiers and visual effects.*

### Test 3.1: Speed Multiplier Integration (`quantum_stabilization`)
- **Steps**: Select the `quantum_stabilization` upgrade during intermission. Navigate FOTON.
- **Expected Outcome**: Movement speed increases cleanly by +15% per stack, and the change is immediately felt in keyboard and mouse controls.

### Test 3.2: Max Shield Grid Deflection (`foton_integrity`)
- **Steps**: Select the `foton_integrity` upgrade. Observe the main in-game HUD bar.
- **Expected Outcome**: Maximum deflector shield expands by +30 per stack, and is rendered on the HUD bar.

### Test 3.3: Active Swarm Capacity Expansion (`swarm_overscale`)
- **Steps**: Select `swarm_overscale`. Collect energy to recruit followers.
- **Expected Outcome**: The maximum capacity increases by +6 per stack (e.g., from 24 to 30), and the HUD correctly displays the updated maximum boundary.

### Test 3.4: Formation Shift Cooldowns (`formation_synchronizer`)
- **Steps**: Select `formation_synchronizer` during intermission. Shift formations repeatedly in-game.
- **Expected Outcome**: Cooldown is reduced by 30% per stack, enabling rapid tactical adjustments.

---

## TEST SUITE 4: HUD & REAL-TIME THREAT INTEL
*Verify that the Cockpit's three-column layout synchronizes data and alerts instantly.*

### Test 4.1: Cinematic Sector Banner Displays
- **Steps**: Trigger a wave transition. Watch the center screen banner overlay.
- **Expected Outcome**: A stylish cinematic banner appears for 1.5s–2.5s showing the sector number, name, subtitle, threat warnings with color-coding, active modifier tag, and recommended formation. Backdrop-blur is cleanly rendered.

### Test 4.2: Real-time Run Build Tracker
- **Steps**: Open the left column (Tactical Rail) during gameplay.
- **Expected Outcome**: A designated "ACTIVE RUN BUILD" card displays all selected mid-run upgrades and their current stacks.

### Test 4.3: Real-time Sector Threat Intelligence
- **Steps**: Check the bottom card of the left column (Tactical Rail) during combat.
- **Expected Outcome**: "THREAT INTEL" displays the current sector's metadata, warning level badges, modifiers, and recommendations.

### Test 4.4: Summary Build Record
- **Steps**: Achieve victory or trigger game over. Check the Result Screen panel.
- **Expected Outcome**: A beautifully styled "RUN BUILD SUMMARY" lists the final selected upgrades, strongest affinity, most used formation, and boss result. No file paths or development lines are visible.
