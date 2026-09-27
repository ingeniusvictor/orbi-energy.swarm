# ORBI ENERGY SWARM: SWARM IDENTITY RECOVERY
## Version Target: v0.2.1-swarm-identity-recovery

### 1. Executive Summary
This document outlines the technical design, system changes, and architectural specifications implemented in the Swarm Identity Recovery update. The focus of this patch is the restoration of swarm visual diversity, structured element affinities, specific combat roles, and fair procedural recruitment mechanics across all game biomes.

---

### 2. Elemental Affinities and Combat Roles
Each supplementary swarm member (`OrbiMember`) now maintains two distinct classifications: an **Elemental Affinity** and a **Combat Role**. This ensures visual variety and tactical range, breaking the previous behavior where all newly recruited members defaulted to a single color and role based on the starting biome.

#### Swarm Identity Matrix
| Elemental Affinity | Hex Color (Primary) | Glow Color | Combat Role | Projectile Behavior |
| :--- | :--- | :--- | :--- | :--- |
| **Solar** | `#f59e0b` | `#fbbf24` | `beam` | Straight golden projectile with high velocity. |
| **Hydro** | `#0ea5e9` | `#38bdf8` | `support` / `shield` | Slower blue pulses that apply a `slowTimer` (speed reduced to 45% for 2.5s). |
| **Wind** | `#10b981` | `#34d399` | `rapid` | High velocity emerald micro-projectiles. |
| **Thermal** | `#ef4444` | `#f87171` | `pulse` | Heavy red blast that inflicts area-of-effect splash damage (45% splash damage within 55px). |
| **Nuclear** | `#8b5cf6` | `#c084fc` | `shield` / `arc` | Slower, dense violet spheres dealing 2.2x damage. |
| **Quantum** | `#ec4899` | `#f472b6` | `arc` / `support` | Magenta beam with a 22% chance of a 2.5x critical strike. |

---

### 3. Fair Random Distribution: Shuffle Bag Implementation
To prevent long streaks of identical elemental spawns (e.g., several consecutive Solar spawns), a balanced **Shuffle Bag** generator has been introduced.

#### Algorithm Mechanics
1. **Bag Population**: Upon depletion or startup, an array of 100 elements is populated matching the exact target probability distribution:
   - **Solar**: 17%
   - **Hydro**: 17%
   - **Wind**: 17%
   - **Thermal**: 17%
   - **Nuclear**: 16%
   - **Quantum**: 16%
2. **Fisher-Yates Shuffle**: The array is thoroughly randomized using the Fisher-Yates shuffle algorithm.
3. **Extraction**: Spawning procedures draw from the bag sequentially. Once empty, the bag is re-filled and re-shuffled automatically.

This ensures a perfect long-term distribution without sacrificing the thrilling unpredictability of short-term runs.

---

### 4. Wild Orbi Pre-Collection Visual Communication
Wild Orbi resource nodes are now pre-initialized with their designated affinity and combat role at the moment of spawning:
- **Visual Glow**: Pickups emit light matching their exact element color instead of a generic pink halo.
- **Pulsing Animation**: The node has a central glowing nucleus pulsing dynamically over time.
- **Floating and Rotation**: The central 8-pointed star rotates and floats gracefully on a sinusoidal wave.
- **Tactical Signalling**: An orbiting satellite node and subtle "WILD" indicator denote collectability.

---

### 5. Swarm Identity Persistence
Once collected, a member retains their custom assigned personality, elemental affinity, color, combat role, and level. Upgrading formation matrices or changing biomes modifies coordinates, defense, damage, or fire rates, but **never overwrites** individual element identities or colors.
