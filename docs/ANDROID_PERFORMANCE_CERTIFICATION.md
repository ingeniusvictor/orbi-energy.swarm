# ES-11C — Device / Orientation × Quality Certification Matrix

This matrix is an automated certification layer for ORBI Energy Swarm. It combines viewport composition with quality-tier rendering budgets so Android/mobile certification is not split across unrelated tests.

## What is automated

Each representative viewport is projected across LOW, MEDIUM, HIGH and ULTRA.

The automated contract verifies:

- viewport class and orientation;
- STACKED / SPLIT / RAILS auxiliary deck mode;
- touch-control recommendation;
- portrait landscape advisory where applicable;
- UI DPR clamped to the global 2× ceiling;
- Canvas DPR clamped to the selected quality preset;
- backing-store dimensions derived only from the canonical 800×480 logical game viewport;
- quality particle/star/nebula/planet budgets remain the declared preset values.

## Representative cases

| Case | CSS viewport | Pointer | Raw DPR | Expected composition |
| --- | ---: | --- | ---: | --- |
| Compact Android landscape | 667×375 | coarse | 2.625 | PHONE_LANDSCAPE / STACKED |
| Modern Android landscape | 915×412 | coarse | 3.0 | TABLET_LANDSCAPE / SPLIT |
| Narrow Android portrait | 412×915 | coarse | 2.75 | PHONE_PORTRAIT / STACKED + landscape advisory |
| Tablet landscape | 1024×768 | coarse | 2.0 | TABLET_LANDSCAPE / SPLIT |
| Tablet portrait | 820×1180 | coarse | 2.0 | TABLET_PORTRAIT / SPLIT |
| Laptop 16:10 | 1440×900 | fine | 1.25 | LAPTOP / RAILS |
| Desktop 16:9 | 1920×1080 | fine | 1.0 | DESKTOP / RAILS |
| Ultrawide | 2560×1080 | fine | 1.0 | ULTRAWIDE / RAILS |

## Quality DPR contract

| Preset | Max DPR | Max particles | Max stars | Nebula | Planets |
| --- | ---: | ---: | ---: | --- | --- |
| LOW | 1.0 | 80 | 50 | off | off |
| MEDIUM | 1.5 | 250 | 150 | on | on |
| HIGH | 2.0 | 600 | 300 | on | on |
| ULTRA | 2.0 | 1200 | 600 | on | on |

The global Canvas ceiling remains 2× regardless of physical device DPR.

## What this does not certify

This matrix is not a substitute for:

- human visual certification on real devices;
- thumb occlusion / hand ergonomics;
- browser chrome behavior;
- actual thermal throttling;
- sustained battery behavior;
- OEM GPU/driver differences.

Those remain hardware-validation gates. The purpose of ES-11C is to ensure every real-device run begins from a reproducible software contract.
