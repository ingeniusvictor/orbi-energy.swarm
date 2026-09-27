# MODULE 0B.6 — BLACKOUT DEVOURER COMBAT BALANCE
**Target Version:** `v0.2.6-blackout-devourer`

To ensure a challenging but fair final encounter, all boss parameters, damage rates, and vulnerability windows have been explicitly calibrated.

## 1. Core Health & Armor Profiles
- **Base Max Health:** `8500 HP`
- **Armor Multipliers:**
  - **Phase 1:** Normal damage profile (`1.0x`).
  - **Phase 2 (Shield Nodes Active):** Reduced damage profile (`0.25x`).
  - **Phase 2 (Core Exposed):** Vulnerable damage profile (`2.00x`).
  - **Phase 3:** Normal damage profile (`1.0x`).

## 2. Shield Nodes Calibration
- **Node Count:** `3`
- **Health per Node:** `1400 HP`
- **Orbit Speed:** `0.024 rad/frame`
- **Orbit Radius:** `90px` from the boss core.

## 3. Attack Damage & Telegraph Tuning
The following table highlights the exact timings and damage variables for each attack:

| Attack ID | Telegraph (ms) | Duration (ms) | Base Damage | Mechanic |
| :--- | :--- | :--- | :--- | :--- |
| `devourer_beam` | 1500 | 3500 | 1.6 / tick | Linear rotational sweep |
| `gravity_well` | 1200 | 4500 | 0.8 / tick | Core pull force + high-density gravity |
| `orbital_shards` | 1000 | 3000 | 12.0 / hit | Aimed rapid physical projectile |
| `blackout_sweep` | 1800 | 4000 | 1.0 / tick | Radial safe sector sweep |
| `singularity_pulse` | 1400 | 1500 | 15.0 / wave | Outward propagating radial blast wave |
| `rotating_eclipse_lanes` | 2000 | 5000 | 1.2 / tick | Three rotating hazard zones |
| `devourer_charge` | 1200 | 1000 | 25.0 / hit | High-speed dash to player coordinates |

## 4. Balancing Safety Margins
1. No arbitrary hidden scaling factors are used. All attributes are explicit and deterministic.
2. Players are provided with visual cue indicators on the canvas before any heavy strike is performed.
3. Player invincibility frames (flickers) prevent immediate multi-hit combos from depleting the entire shield in one frame.
