# QA Verification Checklist

Use these steps to verify the stability and baseline compliance of ORBI ENERGY SWARM.

## 1. Compile & Type Checks
- [ ] Run `npm run lint` or `tsc --noEmit`. No TypeScript compilation errors or unresolved imports.
- [ ] Run `npm run build` to verify the production bundle outputs to the `/dist` folder.

## 2. Gameplay & Single Loop Check
- [ ] Launch the application and click "ACTIVAR SINCRONIZACIÓN".
- [ ] Inspect memory usage. Ensure it remains steady and doesn't climb indefinitely (no leaks).
- [ ] Verify Foton follows the cursor smoothly, and keyboard keys (WASD/Arrows) move Foton.

## 3. Formations & Input Checks
- [ ] Press Keys `1` to `6` sequentially. Swarm members must realign to respective layouts:
  - `1`: Horizontal Line
  - `2`: Orbiting Circle
  - `3`: Delta Wedge
  - `4`: Protective Ring
  - `5`: Trailing Vees
  - `6`: Loose Scattered Floating
- [ ] Ensure HUD active pattern text updates to match the selection.
- [ ] Verify arrow keys do not scroll the webpage when playing inside an iframe.

## 4. Audio Systems
- [ ] Verify audio clicks and chimes occur when shooting, gathering crystals, taking damage, or recruiting.
- [ ] Click the Mute button. Sounds must instantly mute. Unmuting restores previous sound outputs.
- [ ] Verify tab change (focus loss) silences active audio sweeps.

## 5. Collision Checks
- [ ] When a follower shoots an enemy, the projectile must disappear on the first contact frame.
- [ ] Verify enemies die after taking sufficient damage.
- [ ] Ensure player does not take contact damage continuously on consecutive frames (should flash red and gain 1 second invincibility).

## 6. Pause & UI Checks
- [ ] Press `P` or `Esc` or click the Pause button. Ensure all movement, projectiles, and enemy spawns freeze.
- [ ] Tab across Swarm, Civ, Log, and Relics panels. Verify correct contents.
- [ ] Gather Nano Credits, purchase a Relic under the Relic tab, and verify stats (e.g. Shield Regen or Pull Radius) adapt accordingly.
