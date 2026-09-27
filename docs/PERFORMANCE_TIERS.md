# ES-05D — Performance Tier Budgets

ORBI Energy Swarm exposes four user-controlled renderer tiers. The selected tier is authoritative; there is no automatic device downgrade in ES-05D.

| Preset | Particles | Stars | Nebula | Planets | Max DPR |
| --- | ---: | ---: | --- | --- | ---: |
| LOW | 80 | 50 | Off | Off | 1.0× |
| MEDIUM | 250 | 150 | On | On | 1.5× |
| HIGH | 600 | 300 | On | On | 2.0× |
| ULTRA | 1200 | 600 | On | On | 2.0× |

## Enforcement

- particle emitters already honor `maxParticles`;
- background star density is synchronized through `backgroundRenderer.resizeStars(maxStars)` whenever the active preset changes;
- canvas backing-store DPR is capped by the selected preset's `maxDPR`;
- the global canvas DPR hard ceiling remains 2× even if the browser/device reports a higher value;
- logical gameplay coordinates remain 800×480 regardless of backing-store density;
- nebula and planet layers remain controlled by the preset's existing booleans.

## Product rule

Performance tiers affect rendering cost only. They do not change combat, collision, spawning, timing, progression, rewards, AI or difficulty.
