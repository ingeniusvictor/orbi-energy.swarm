# Technical Fixes & Hardening Report

This document records the engineering fixes implemented to stabilize the ORBI ENERGY SWARM visual prototype into a fully performant, robust standalone application.

## 1. Single-Loop Unified Engine (`requestAnimationFrame`)
- **Issue**: The original baseline was prone to multiplying run loops upon React rendering triggers or state changes.
- **Fix**: Designed a single stable `requestAnimationFrame` mounted within a unified React `useEffect` cycle. All positions, physics states, key states, and particle frames reside within persistent `useRef` buffers. React state modifications are throttled to 10-frame intervals and applied only for low-frequency HUD displays.

## 2. Reusable Web Audio procedural Synthesizer
- **Issue**: Standard audio implementations create new instances of `AudioContext` on every action, triggering browser overhead crashes.
- **Fix**: Programmed a lazy-initialized singleton `AudioContext` that remains suspended until the user executes their first core connection trigger. The class is recycled, supports global mute-state checks, and disposes correctly upon component unmount.

## 3. Double Collision Prevention & Damage Control
- **Issue**: High-frequency collision bounds checking caused multiple projectile hits to apply to the same entity on consecutive frames, triggering duplicated scoring, immediate player deaths, or immortal entities.
- **Fix**: 
  - Enemies and player projectiles are marked with explicit flags (`isDead` or lifetime expire triggers) immediately upon detecting the initial contact. Dead entities are instantly ignored in subsequent collision sweeps.
  - Added an invincibility frame cooldown (`playerRef.current.invincibilityTimer`) of 1000ms to the player, visually indicated by high-contrast flashing.

## 4. Entity Cap Constraints
- **Issue**: Continuous spawning of bullets, explosion sparks, or enemies threatened browser memory leaks.
- **Fix**: Defined strict caps (`MAX_SWARM_MEMBERS`, `MAX_ENEMIES`, `MAX_PROJECTILES`, `MAX_PARTICLES`, `MAX_RESOURCES`). Spawning mechanisms reject new instances if boundaries are exceeded, keeping operations clean and smooth.

## 5. Input Hardening
- **Issue**: Arrow keys triggered browser page scrolls, and key stuck bugs occurred when tabs lost focus.
- **Fix**:
  - Implemented `e.preventDefault()` on gaming-specific keys (Arrows, Space).
  - Attached listeners to `blur` and `visibilitychange` to automatically flush all active pressed key buffers.
