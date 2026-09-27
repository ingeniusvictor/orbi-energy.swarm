# ORBI Energy Swarm — Product Vision

## Origin

ORBI Energy Swarm began as an experimental game inspired by the mechanics, sensations and challenge loops its creator enjoyed in childhood games, then progressively reinterpreted with modern ideas, accessibility and AI-assisted iterative development.

The playable prototype was built by prioritizing gameplay mechanics first. Presentation, responsive layout and full Android adaptation were intentionally left for a later stage. The current ten canonical sectors are therefore not the intended ceiling of the game; they are the handcrafted opening progression that teaches and validates the core systems.

## Product statement

**Preserve the prototype's gameplay DNA, modernize the experience, professionalize the presentation, and expand its depth without turning it into a different game.**

ORBI Energy Swarm should ultimately feel like a polished premium sci-fi indie game that happens to run beautifully in a browser and also feels native on Android.

## Core pillars

### 1. Swarm fantasy first

The player must always feel that they are commanding, protecting, growing and evolving a living energy swarm. Formation changes, recruitment, target response, movement and combat cadence are part of the game's identity and must not be casually rewritten during architecture work.

### 2. Immediate playability

The game should remain easy to understand at first contact. Complexity is allowed to grow deeply, but the opening experience must remain approachable and responsive.

### 3. Challenge through systems, not inflated numbers

Late-game difficulty must come primarily from combinations: enemy composition, aggression, speed, patterns, hazards, mutators, formation pressure and decision trade-offs. Scaling health and damage can support difficulty but must never become the entire difficulty model.

### 4. Premium presentation

Opening the web version should produce a strong first impression. The game must not look like a prototype canvas embedded in a page. Menus, loading states, transitions, HUD, overlays, world presentation and results screens must share a coherent premium identity.

### 5. Web and Android are first-class targets

Desktop web is not a development-only build and Android is not a shrunk web view. Both are product surfaces with their own interaction, readability, performance and ergonomics requirements.

### 6. Infinite mastery

The first ten sectors form a handcrafted campaign foundation. Sector 11 and beyond become an endless mastery mode where procedural difficulty grows indefinitely while remaining fair, legible and mechanically interesting.

## Intended player journey

1. **First launch:** premium cinematic-feeling entry with a clear path to play.
2. **Sectors 1–10:** learn the swarm, formations, recruitment, resources, upgrades, enemy language and boss play.
3. **Sector 10 climax:** Blackout Devourer functions as the first major mastery check, not the final end of the product.
4. **Sector 11+:** Infinite Swarm opens and progressively combines systems in increasingly demanding ways.
5. **Long-term play:** chase higher sectors, better runs, unlocks, records, builds and mastery.

## Product quality bar

The final product should make a new player think:

> “This looks like a real premium sci-fi game — and it is running in my browser.”

On Android, the goal is equally strict:

> “This feels designed for my phone, not ported to it.”

## Preservation principles

Before changing a gameplay system:

- identify the current player-visible behavior;
- add or document a regression check when practical;
- preserve the original baseline tag permanently;
- prefer incremental extraction over wholesale rewrite;
- distinguish a bug from an intentional quirk before removing it;
- document any deliberate gameplay-feel change.

## Non-goals during recovery

Until repository/runtime certification is GREEN, do not:

- redesign combat balance;
- replace the game loop wholesale;
- rewrite swarm movement from scratch;
- add monetization;
- add cloud AI features merely because the prototype originated in AI-assisted tooling;
- optimize for one screen size at the expense of the others.
