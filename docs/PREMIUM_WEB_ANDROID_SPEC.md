# ORBI Energy Swarm — Premium Web & Android Experience Specification

## Objective

Transform the existing playable prototype into a visually cohesive premium experience on web and Android without weakening gameplay clarity or responsiveness.

“Responsive” means adaptive composition, interaction and readability — not merely scaling the current canvas smaller.

## Experience architecture

The product should evolve toward four separable presentation layers.

### Game World

Canvas-rendered gameplay: swarm, enemies, projectiles, resources, particles, biome and camera.

### HUD

Health, energy, sector, score, resources, boss information, upgrades and transient gameplay feedback.

### Shell UI

Start screen, mode select, pause, settings, progression, codex, upgrade selection, result/victory and recovery flows.

### Presentation Layer

Premium visual identity: animated backgrounds, scene transitions, glow/energy language, loading states, branding, environmental depth and polished motion.

The layers may share state, but layout and rendering responsibilities should become explicit enough that each can adapt independently.

## Premium visual direction

Target identity:

- premium sci-fi;
- intelligent energy swarm;
- dark high-contrast environments;
- cyan/teal/blue energy language with restrained complementary accents;
- holographic/glass control surfaces used sparingly;
- strong typography hierarchy;
- elegant motion and transitions;
- readable combat first, spectacle second.

Avoid generic dashboard styling, excessive glass effects, unreadable glow, decorative animation that masks threats, and mobile layouts that simply shrink desktop controls.

## Web quality bar

### First impression

The opening state should feel intentional before the player presses Play:

- branded animated entry/background;
- strong ORBI Energy Swarm title treatment;
- clear primary action;
- coherent mode/configuration access;
- fast transition into gameplay;
- no raw browser-demo feeling.

### Supported layout classes

The responsive system must explicitly handle at least:

- desktop 16:9;
- laptop 16:10;
- ultrawide desktop;
- tablet landscape;
- tablet portrait where gameplay remains viable;
- Android landscape;
- Android portrait where gameplay remains viable;
- narrow/small phones.

If a layout class cannot preserve good gameplay, the product should present a deliberate orientation recommendation rather than silently degrade.

## Logical game viewport

Gameplay should use a stable logical coordinate system decoupled from CSS pixel dimensions. Rendering should account for:

- viewport aspect ratio;
- devicePixelRatio;
- available safe area;
- browser UI intrusion;
- canvas CSS size versus internal resolution;
- quality/performance tier.

Do not anchor gameplay-critical UI with unexplained fixed pixel positions tied to one development resolution.

## HUD behavior

HUD should use anchors and layout regions, not scattered absolute coordinates.

Candidate regions:

- top-left: player/swarm survivability;
- top-center: sector/wave/boss state;
- top-right: score/resources/session state;
- bottom/edge regions: touch controls and context actions;
- central overlays: upgrades, pause, results only when gameplay is suspended or visually protected.

Exact placement remains subject to gameplay review, but the system must support breakpoint-specific composition.

## Android interaction contract

Android must account for:

- touch-first interaction;
- comfortable touch target sizes;
- thumbs and hand occlusion;
- notches/camera cutouts;
- Android navigation/gesture areas;
- orientation changes;
- paused/resumed app lifecycle;
- loss/regain of focus;
- high-density screens;
- 60/90/120 Hz displays;
- thermal/performance constraints;
- accidental browser gestures when running as web/PWA.

Landscape is expected to be the premium primary gameplay orientation unless later playtesting proves portrait equally strong.

## Visual polish budget

Premium does not mean unlimited effects. Establish a performance-safe effects budget for:

- particles;
- trails;
- bloom-like approximations;
- screen shake;
- hit flash;
- background motion;
- boss telegraphs;
- UI motion.

Low and mid mobile tiers must retain excellent clarity even if effect density is reduced.

## Acceptance principles

A screen is not certified because it technically fits. It is certified when:

- important information is immediately readable;
- no critical controls overlap or clip;
- gameplay remains visible around thumbs on touch devices;
- orientation changes do not corrupt state;
- text remains legible without browser zoom;
- the composition looks designed for that viewport;
- performance remains inside the selected quality budget.

## Future implementation gates

1. Inventory all current layout assumptions and fixed coordinates.
2. Introduce viewport/device classification utilities.
3. Establish safe-area-aware shell container.
4. Separate HUD layout responsibility from world rendering.
5. Implement responsive shell before visual effects escalation.
6. Certify desktop/laptop/tablet/mobile breakpoint matrix.
7. Add Android lifecycle and touch-specific regression coverage.
8. Perform premium visual pass only after responsive structure is stable.
