# ORBI Energy Swarm — Responsive UI Audit

## Scope

Static audit of the preserved prototype presentation/layout code. This is not a visual certification; it identifies the structural reasons the demo does not yet feel premium or fully adapted across web and Android.

## Strong foundations already present

### Stable logical canvas

The game already defines a fixed logical render surface:

- `CANVAS_WIDTH = 800`
- `CANVAS_HEIGHT = 480`
- 5:3 logical aspect ratio
- world size `1600 × 960`

Pointer conversion already maps CSS pixel coordinates back into logical canvas/world coordinates. This is valuable and should be preserved while the presentation shell evolves.

### Unified pointer path

The canvas uses Pointer Events and `touchAction: none`, providing a viable common input path for mouse, pen and touch.

### Existing mobile fallback control

A small-screen D-pad already exists. It proves mobile interaction was anticipated, but it is currently an assistive fallback rather than a complete Android interaction design.

### Existing quality/performance concepts

The runtime already contains quality presets and explicit entity/effect budgets. Responsive/mobile work can build on those foundations rather than invent a separate rendering engine.

## High-priority structural findings

### RUI-01 — Workspace column rules conflict

The main render applies Tailwind `lg:grid-cols-[auto_1fr_auto]` for a three-column workspace while `.game-workspace` in `src/index.css` separately sets:

`grid-template-columns: minmax(0, 1fr) 330px`

at the same `min-width: 1024px` breakpoint.

This creates competing layout definitions for a shell that contains left panel, battlefield and right panel. The responsive system should have one authoritative layout contract.

**Risk:** unpredictable/fragile desktop and intermediate-width composition.

### RUI-02 — HUD is a fixed single-row strip

`GameHud` uses a fixed `h-[42px]` and multiple `shrink-0` groups in a single flex row with no responsive alternate composition.

**Risk:** narrow widths force horizontal overflow, compression or illegible information.

**Target:** HUD regions/anchors with compact and mobile variants rather than a single immutable row.

### RUI-03 — Canvas wrapper couples gameplay height to page chrome

`EnergySwarmCanvas` uses:

- fixed `aspect-[5/3]`;
- `max-h-[calc(100vh-210px)]`;
- `lg:max-h-[calc(100vh-185px)]`.

This assumes a particular amount of surrounding UI. In mobile landscape, where browser chrome and touch controls consume vertical space, the battlefield can become unnecessarily constrained.

**Target:** a viewport allocation system that measures available game area rather than subtracting fixed shell heights.

### RUI-04 — Mobile shell stacks desktop panels

Left and right decks use `w-full` below `lg`, while the workspace collapses to one column. This naturally turns desktop side panels into long stacked sections around the battlefield.

**Risk:** mobile feels like a responsive website rather than a game; important controls/intel may sit far from the action.

**Target:** mobile-specific drawers, sheets or contextual overlays rather than stacked desktop decks.

### RUI-05 — Companion/logistics panels contain fixed heights

Examples include `h-[400px]`, `lg:h-[580px]` and several fixed `max-h` scroll regions.

**Risk:** inconsistent use of scarce vertical space on short landscape phones and tablets.

**Target:** available-height containers and breakpoint-specific presentation modes.

### RUI-06 — Current D-pad is not an Android control system

The small-screen D-pad consists of four standard buttons rendered below the canvas.

**Limitations:**

- not thumb-zone anchored over/around the battlefield;
- no safe-area awareness;
- no press-and-hold semantics visible from the component structure;
- no configurable opacity/size;
- no handedness option;
- competes for vertical space below the canvas.

The existing control should be treated as proof-of-concept behavior to preserve, not the final touch UX.

### RUI-07 — Boss HUD uses a desktop-centered overlay assumption

The boss overlay is `absolute top-4 left-4 right-4` with `max-w-md` and multiple stacked status elements.

**Risk:** on small landscape viewports the overlay can obscure a material portion of combat.

**Target:** compact boss presentation variant with hierarchy-based disclosure of secondary data.

### RUI-08 — Start screen is functional but not yet a premium entry scene

The start screen already has branding, tabs, localization and glass-like styling, but its composition is primarily a centered configuration card over a dark overlay.

**Target:** evolve it into a product entry scene with visual depth, motion, strong game identity and clearer primary/secondary navigation without losing fast access to Play.

### RUI-09 — External web fonts add a release dependency

`src/styles/index.css` imports Google Fonts at runtime.

**Risk:** offline/PWA/native-wrapper startup can differ depending on connectivity and font caching.

**Target:** decide during release engineering whether to self-host licensed web font assets, use robust fallbacks or retain remote loading intentionally.

## Recommended architecture before polish

### Viewport service

Create a small pure utility layer that derives:

- width/height;
- aspect ratio;
- orientation;
- devicePixelRatio;
- safe-area capability;
- layout class (`desktop-wide`, `desktop`, `tablet`, `phone-landscape`, `phone-portrait`);
- quality hints where appropriate.

Avoid fragile user-agent-only mobile detection.

### Game stage

Create one component responsible for allocating the available battlefield rectangle. The logical canvas remains stable while its CSS size and internal render resolution are controlled deliberately.

### HUD variants

Introduce explicit presentation modes such as:

- `FULL_DESKTOP`;
- `COMPACT_DESKTOP`;
- `TOUCH_LANDSCAPE`;
- `TOUCH_PORTRAIT` (only if later certified viable).

### Adaptive decks

Desktop side panels may remain persistent. Tablet/phone variants should use drawers, bottom sheets, pauses or contextual overlays depending on whether the information is required during active combat.

### Touch layer

Controls should be a dedicated overlay layer with safe-area padding and independent opacity/layout rules.

## First implementation sequence

1. Remove competing workspace grid ownership.
2. Introduce viewport classification + safe-area CSS variables.
3. Create `GameStage`/available-rectangle ownership.
4. Split HUD into layout regions with compact mode.
5. Convert side decks to adaptive desktop/mobile presentations.
6. Replace proof-of-concept D-pad presentation with touch overlay while preserving movement semantics.
7. Add viewport regression fixtures/tests where feasible.
8. Only then escalate premium motion/VFX and entry-screen redesign.

## Certification matrix

At minimum, visually certify representative viewports for:

- 1920×1080 desktop;
- 1440×900 laptop;
- 2560×1080 ultrawide;
- 1366×768 common laptop;
- tablet landscape;
- tablet portrait;
- 2400×1080-class Android landscape;
- 1080×2400-class Android portrait (menu/shell at minimum);
- compact Android landscape with browser/system UI present.

Exact physical pixels are less important than validating aspect ratio, CSS viewport and density behavior.

## Key conclusion

The current mobile/web presentation problems are primarily shell/layout architecture problems, not failures of the core game renderer. The safest path is to preserve the existing logical world and input semantics while replacing how the surrounding UI allocates, composes and prioritizes screen space.
