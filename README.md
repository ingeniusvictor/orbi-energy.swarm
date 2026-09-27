# ORBI ENERGY SWARM (v0.1.0-prototype-recovery-baseline)

A standalone hardened React, TypeScript, and HTML5 Canvas game. This release represents a frozen visual and technical baseline recovered from the ORBI Life game ecosystem.

## Core Objective
Pilot the **Orbi Foton** leader, synchronize with an autonomous tactical swarm of energy collectors, and harvest crystallized energy fragments while repelling hostile parasites and drones across six procedurally shifting cybernetic biomes.

## Architecture
- **Framework**: React 19 + TypeScript + Tailwind CSS (v4)
- **Engine**: Single unified `requestAnimationFrame` game loop with `deltaTime` physics.
- **Rendering**: HTML5 Canvas for high-frequency objects; React coordinates low-frequency HUD overlays and sidebar dashboards.
- **Audio**: Custom synthesized procedural Web Audio API manager.
- **State**: Safe local storage saving for high-scores, progression credits, active mementos, and audio settings.

## Getting Started
```bash
# Install dependencies
npm install

# Run the dev server
npm run dev

# Run Typecheck and Linter checks
npm run typecheck

# Build for production
npm run build
```

## Controls
- **Movement**: Mouse, touch swipe, or keyboard `WASD` / `Arrow Keys`
- **Formations**: Keys `1` to `6`
- **Pause/Unpause**: Key `P` or `Escape`
- **Mute/Unmute**: Key `M`
- **Reboot Game**: Key `R` (on GameOver screen)
- **Mobile controls**: Virtual D-Pad buttons located on the screen
