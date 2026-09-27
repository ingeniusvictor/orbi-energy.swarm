# ORBI Energy Swarm — Viewport Certification Matrix

## Purpose

This document is the explicit layout contract for the responsive web/Android shell after ES-03A through ES-04D.

It distinguishes **structural certification** (encoded layout behavior protected by automated tests) from **visual certification** (human/browser review of a rendered build). Structural certification is required before visual QA.

The logical game world remains **800 × 480 (5:3)** for every viewport. CSS size, physical canvas backing resolution, surrounding UI composition and touch surfaces adapt independently.

## Representative viewport classes

| Representative viewport | Layout class | Battlefield priority | HUD / decks | Touch / orientation |
| --- | --- | --- | --- | --- |
| 1920×1080 | desktop 16:9 | central primary surface | persistent 3-column command layout; full HUD | desktop pointer/keyboard |
| 1440×900 | laptop 16:10 | central primary surface | compact 3-column deck widths; bounded deck height | desktop pointer/keyboard |
| 1366×768 | common short laptop | central primary surface | compact columns; auxiliary decks scroll internally; reduced HUD height | desktop pointer/keyboard |
| 2560×1080 | ultrawide | centered 5:3 battlefield capped at 1460 CSS px | extra width goes to breathing room/decks, not unlimited battlefield height | desktop pointer/keyboard |
| tablet landscape | tablet | battlefield spans first row | tactical + logistics share second row | coarse-pointer overlay available |
| tablet portrait | tablet portrait | battlefield remains first | secondary decks below with bounded scroll | touch overlay; no forced rotation |
| Android landscape | touch landscape | battlefield first and dominant | compact HUD/boss HUD; safe areas | thumb overlay over stage |
| Android portrait | touch portrait | battlefield first; shell remains usable | secondary UI below/scrollable | advisory bilingual landscape hint |
| compact Android landscape | short touch landscape | battlefield receives vertical budget first | compact boss telemetry; tight deck budget | compact thumb overlay + safe areas |

## Desktop 16:9 — 1920×1080

Expected composition:

- three-column tactical / battlefield / logistics command layout;
- center remains the visually dominant region;
- HUD is a single desktop row;
- boss HUD may use its richer desktop presentation;
- canvas backing store may scale up to 2× DPR while all simulation/input coordinates remain 800×480 logical units.

## Laptop 16:10 — 1440×900

Expected composition:

- three columns remain viable;
- side rails use narrower laptop widths than large desktop;
- center retains the majority of useful width;
- no fixed viewport-height subtraction controls the game stage;
- side content may scroll internally instead of extending the page excessively.

## Common laptop — 1366×768

This is treated as a short desktop, not a scaled-down 1920×1080 screen.

Expected composition:

- compact tactical/logistics widths;
- auxiliary deck content is vertically bounded;
- HUD minimum height reduces slightly;
- root aligns toward the top so the battlefield does not lose space to vertical centering.

## Ultrawide — 2560×1080 and wider

Ultrawide is intentionally **not** implemented as “make the game canvas infinitely wider.”

Expected composition:

- shell budget expands to 2200 CSS px;
- tactical/logistics decks gain modest width;
- battlefield is centered and capped at 1460 CSS px;
- 5:3 gameplay therefore remains readable and does not grow into an unnecessarily tall surface;
- excess horizontal space becomes breathing room rather than distorted gameplay composition.

## Tablet landscape

Expected composition:

1. battlefield across the top row;
2. tactical rail and logistics deck sharing the lower row;
3. touch overlay available on coarse-pointer devices;
4. auxiliary content bounded and independently scrollable.

## Tablet portrait

Expected composition:

1. battlefield first;
2. tactical rail second;
3. logistics deck third;
4. no forced orientation lock;
5. bounded deck scrolling prevents the page from becoming an uncontrolled desktop-panel stack.

## Android landscape

This remains the preferred premium gameplay orientation.

Expected composition:

- safe-area-aware root and touch surfaces;
- 48px thumb-zone controls, compacting on very short landscape screens;
- boss HP/phase/critical warnings remain visible while secondary boss copy is demoted;
- browser/system UI may reduce height without changing logical coordinates.

## Android portrait

Portrait remains supported for shell/menu and viable gameplay where screen dimensions permit it.

Expected behavior:

- game is not blocked;
- a dismissible bilingual recommendation suggests landscape on narrow coarse-pointer portrait devices;
- gameplay state is not reset by orientation changes;
- no user-agent-specific orientation assumptions are required.

## Density contract

The CSS dimensions above are independent from physical pixel density.

- DPR <= 1 → backing store remains 800×480.
- DPR 1–2 → backing store scales proportionally.
- DPR > 2 → backing store caps at 2× (1600×960).
- the render transform maps physical pixels back to logical 800×480 coordinates every frame.

This prevents high-density Android displays from looking unnecessarily soft while bounding pixel/memory cost.

## Structural certification status

Protected by automated repository/platform tests:

- logical 800×480 world remains stable;
- mobile/tablet/desktop workspace ordering;
- safe-area usage;
- reflowing HUD;
- touch overlay;
- small-screen boss HUD;
- HiDPI backing-store scaling;
- portrait orientation guidance;
- laptop compact media class;
- large desktop class;
- ultrawide class and battlefield cap.

## Visual QA status

The repository does not currently document a canonical deployed preview URL. Therefore this phase does **not** claim screenshot-level visual certification from an external browser.

The structural contracts above are the prerequisite for that browser QA. A deployed preview can later be checked against this matrix without redefining responsive behavior.
