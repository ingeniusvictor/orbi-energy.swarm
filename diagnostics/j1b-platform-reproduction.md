# ES-13J1B platform reproduction

baseline: 622a75805a2228546737a5cf65a8e3b20f7f9c7d
historical branch: feat/es-13j1b-live-combat-resonance
historical head: 11bd8c54ce88283549169b5fe903c27194b2b075
platform exit: 1

## Working-tree files before tests
src/components/GameHud.tsx
src/game/EnergySwarmGame.tsx

## npm run test:platform
```text

> orbi-energy-swarm@0.2.0-beta.1 test:platform
> tsx --test tests/*.test.ts

TAP version 13
# Subtest: H4 leaves campaign-independent base descriptors immutable
ok 1 - H4 leaves campaign-independent base descriptors immutable
  ---
  duration_ms: 4.810154
  type: 'test'
  ...
# Subtest: larger veteran swarms trigger more runtime invasion pressure
ok 2 - larger veteran swarms trigger more runtime invasion pressure
  ---
  duration_ms: 1.018976
  type: 'test'
  ...
# Subtest: runtime invasion keeps global entity and projectile ceilings absolute
ok 3 - runtime invasion keeps global entity and projectile ceilings absolute
  ---
  duration_ms: 2.978203
  type: 'test'
  ...
# Subtest: specialist enemies enter the composition progressively
ok 4 - specialist enemies enter the composition progressively
  ---
  duration_ms: 2.177401
  type: 'test'
  ...
# Subtest: new hostile roles unlock progressively rather than all at once
ok 5 - new hostile roles unlock progressively rather than all at once
  ---
  duration_ms: 1.373894
  type: 'test'
  ...
# Subtest: every severe hostile mechanic has a readable telegraph and bounded active cap
ok 6 - every severe hostile mechanic has a readable telegraph and bounded active cap
  ---
  duration_ms: 0.144936
  type: 'test'
  ...
# Subtest: survival events never exceed two hard-control sources
ok 7 - survival events never exceed two hard-control sources
  ---
  duration_ms: 0.14135
  type: 'test'
  ...
# Subtest: event selection is deterministic for a sector/wave seed
ok 8 - event selection is deterministic for a sector/wave seed
  ---
  duration_ms: 0.159758
  type: 'test'
  ...
# Subtest: adaptive pressure reacts to both sector and swarm power
ok 9 - adaptive pressure reacts to both sector and swarm power
  ---
  duration_ms: 0.413326
  type: 'test'
  ...
# Subtest: deep Infinite pressure stays bounded and cannot create runaway multipliers
ok 10 - deep Infinite pressure stays bounded and cannot create runaway multipliers
  ---
  duration_ms: 0.432785
  type: 'test'
  ...
# Subtest: H12 requires the full bounded fusion-energy activation cost
ok 11 - H12 requires the full bounded fusion-energy activation cost
  ---
  duration_ms: 0.980289
  type: 'test'
  ...
# Subtest: H12 never fabricates a fusion at 100 energy without a valid recipe
ok 12 - H12 never fabricates a fusion at 100 energy without a valid recipe
  ---
  duration_ms: 8.486992
  type: 'test'
  ...
# Subtest: three collectible beam-role followers resolve to the existing Solar Guardian body
ok 13 - three collectible beam-role followers resolve to the existing Solar Guardian body
  ---
  duration_ms: 0.979207
  type: 'test'
  ...
# Subtest: three pulse-role followers resolve to the existing Hydro Leviathan body
ok 14 - three pulse-role followers resolve to the existing Hydro Leviathan body
  ---
  duration_ms: 0.252786
  type: 'test'
  ...
# Subtest: source selection preserves stronger veterans and is stable across input order
ok 15 - source selection preserves stronger veterans and is stable across input order
  ---
  duration_ms: 0.211294
  type: 'test'
  ...
# Subtest: FOTON, GAIA, fusion-class bodies and identity-less followers can never be fusion sources
ok 16 - FOTON, GAIA, fusion-class bodies and identity-less followers can never be fusion sources
  ---
  duration_ms: 0.186477
  type: 'test'
  ...
# Subtest: when beam and pulse recipes are both eligible the certified recipe order is deterministic
ok 17 - when beam and pulse recipes are both eligible the certified recipe order is deterministic
  ---
  duration_ms: 0.15468
  type: 'test'
  ...
# Subtest: applyAffinityFusion performs an exact non-mutating 3-to-1 transformation
ok 18 - applyAffinityFusion performs an exact non-mutating 3-to-1 transformation
  ---
  duration_ms: 0.568656
  type: 'test'
  ...
# Subtest: applyAffinityFusion fails closed when a previously resolved source is stale
ok 19 - applyAffinityFusion fails closed when a previously resolved source is stale
  ---
  duration_ms: 0.319586
  type: 'test'
  ...
# Subtest: fusion-energy consumption is bounded and only removes one certified activation cost
ok 20 - fusion-energy consumption is bounded and only removes one certified activation cost
  ---
  duration_ms: 0.520786
  type: 'test'
  ...
# Subtest: H12 source consumption never revokes already-earned Swarm Doctrine capacity
ok 21 - H12 source consumption never revokes already-earned Swarm Doctrine capacity
  ---
  duration_ms: 12.605332
  type: 'test'
  ...
# Subtest: the level-5 fusion body is deliberately absent from doctrine until later legitimate progression
ok 22 - the level-5 fusion body is deliberately absent from doctrine until later legitimate progression
  ---
  duration_ms: 0.379765
  type: 'test'
  ...
# Subtest: H12 runtime adopts the pure Affinity Fusion Director
ok 23 - H12 runtime adopts the pure Affinity Fusion Director
  ---
  duration_ms: 5.409371
  type: 'test'
  ...
# Subtest: H12 removes the legacy body-count/default fusion authority
ok 24 - H12 removes the legacy body-count/default fusion authority
  ---
  duration_ms: 1.04797
  type: 'test'
  ...
# Subtest: fusion energy remains bounded activation state and is consumed only after successful application
ok 25 - fusion energy remains bounded activation state and is consumed only after successful application
  ---
  duration_ms: 0.276782
  type: 'test'
  ...
# Subtest: a ready meter is re-evaluated after both energy pickup and compatible recruitment
ok 26 - a ready meter is re-evaluated after both energy pickup and compatible recruitment
  ---
  duration_ms: 0.357402
  type: 'test'
  ...
# Subtest: fusion creation cannot mint a new founder or level-5 doctrine credit
ok 27 - fusion creation cannot mint a new founder or level-5 doctrine credit
  ---
  duration_ms: 0.20835
  type: 'test'
  ...
# Subtest: H12 source authority is canonical metadata, never visual color
ok 28 - H12 source authority is canonical metadata, never visual color
  ---
  duration_ms: 0.217684
  type: 'test'
  ...
# Subtest: GAIA synthesis remains an independent acquisition-driven path
ok 29 - GAIA synthesis remains an independent acquisition-driven path
  ---
  duration_ms: 0.254859
  type: 'test'
  ...
# Subtest: H12 adds no second entity array or projectile budget bypass
ok 30 - H12 adds no second entity array or projectile budget bypass
  ---
  duration_ms: 0.186838
  type: 'test'
  ...
# Subtest: certification matrix covers eight representative device/orientation classes
ok 31 - certification matrix covers eight representative device/orientation classes
  ---
  duration_ms: 1.466423
  type: 'test'
  ...
# Subtest: certification matrix crosses every device with every quality preset
ok 32 - certification matrix crosses every device with every quality preset
  ---
  duration_ms: 1.073277
  type: 'test'
  ...
# Subtest: every representative viewport resolves to its expected composition contract
ok 33 - every representative viewport resolves to its expected composition contract
  ---
  duration_ms: 0.221139
  type: 'test'
  ...
# Subtest: UI DPR never exceeds the global 2x composition ceiling
ok 34 - UI DPR never exceeds the global 2x composition ceiling
  ---
  duration_ms: 0.271845
  type: 'test'
  ...
# Subtest: canvas DPR never exceeds either the selected preset cap or global 2x cap
ok 35 - canvas DPR never exceeds either the selected preset cap or global 2x cap
  ---
  duration_ms: 0.232266
  type: 'test'
  ...
# Subtest: backing store always derives from canonical 800x480 logical space
ok 36 - backing store always derives from canonical 800x480 logical space
  ---
  duration_ms: 0.325314
  type: 'test'
  ...
# Subtest: LOW remains one-DPR even on high-density Android displays
ok 37 - LOW remains one-DPR even on high-density Android displays
  ---
  duration_ms: 0.155742
  type: 'test'
  ...
# Subtest: MEDIUM caps high-DPR Android backing store at 1.5x
ok 38 - MEDIUM caps high-DPR Android backing store at 1.5x
  ---
  duration_ms: 0.179918
  type: 'test'
  ...
# Subtest: HIGH and ULTRA share the 2x DPR ceiling but retain distinct VFX budgets
ok 39 - HIGH and ULTRA share the 2x DPR ceiling but retain distinct VFX budgets
  ---
  duration_ms: 0.266316
  type: 'test'
  ...
# Subtest: projected quality flags exactly mirror canonical quality config
ok 40 - projected quality flags exactly mirror canonical quality config
  ---
  duration_ms: 0.547225
  type: 'test'
  ...
# Subtest: only narrow coarse-pointer phone portrait requests landscape advisory
ok 41 - only narrow coarse-pointer phone portrait requests landscape advisory
  ---
  duration_ms: 0.197313
  type: 'test'
  ...
# Subtest: live game imports stable in-place compaction helper
ok 42 - live game imports stable in-place compaction helper
  ---
  duration_ms: 0.80003
  type: 'test'
  ...
# Subtest: floating text cleanup avoids per-frame filter allocation
ok 43 - floating text cleanup avoids per-frame filter allocation
  ---
  duration_ms: 1.320045
  type: 'test'
  ...
# Subtest: normal enemy cleanup compacts in place with the same dead and world-bound predicates
ok 44 - normal enemy cleanup compacts in place with the same dead and world-bound predicates
  ---
  duration_ms: 3.520369
  type: 'test'
  ...
# Subtest: projectile cleanup compacts in place with identical life and bounds semantics
ok 45 - projectile cleanup compacts in place with identical life and bounds semantics
  ---
  duration_ms: 1.764617
  type: 'test'
  ...
# Subtest: particle cleanup is allocation-free in both normal and cinematic paths
ok 46 - particle cleanup is allocation-free in both normal and cinematic paths
  ---
  duration_ms: 1.55159
  type: 'test'
  ...
# Subtest: boss defeat enemy cleanup also preserves the live array identity
ok 47 - boss defeat enemy cleanup also preserves the live array identity
  ---
  duration_ms: 1.365812
  type: 'test'
  ...
# Subtest: compaction preserves array identity and stable order
ok 48 - compaction preserves array identity and stable order
  ---
  duration_ms: 1.527684
  type: 'test'
  ...
# Subtest: compaction preserves surviving object identities
ok 49 - compaction preserves surviving object identities
  ---
  duration_ms: 0.153518
  type: 'test'
  ...
# Subtest: compaction can retain all entries without reallocating
ok 50 - compaction can retain all entries without reallocating
  ---
  duration_ms: 0.147449
  type: 'test'
  ...
# Subtest: compaction can clear an array in place
ok 51 - compaction can clear an array in place
  ---
  duration_ms: 0.12049
  type: 'test'
  ...
# Subtest: predicate receives original stable read indexes
ok 52 - predicate receives original stable read indexes
  ---
  duration_ms: 0.238485
  type: 'test'
  ...
# Subtest: idle audio mix preserves historical gain on every lane
ok 53 - idle audio mix preserves historical gain on every lane
  ---
  duration_ms: 1.031775
  type: 'test'
  ...
# Subtest: tactical mix ducks only BGM and standard SFX
ok 54 - tactical mix ducks only BGM and standard SFX
  ---
  duration_ms: 0.145337
  type: 'test'
  ...
# Subtest: audio mix contract never boosts a lane above historical gain
ok 55 - audio mix contract never boosts a lane above historical gain
  ---
  duration_ms: 0.204915
  type: 'test'
  ...
# Subtest: overlapping tactical windows extend but never shorten priority
ok 56 - overlapping tactical windows extend but never shorten priority
  ---
  duration_ms: 0.159338
  type: 'test'
  ...
# Subtest: priority window projection sanitizes malformed timing inputs
ok 57 - priority window projection sanitizes malformed timing inputs
  ---
  duration_ms: 0.109994
  type: 'test'
  ...
# Subtest: audio engine owns an extend-only tactical priority window
ok 58 - audio engine owns an extend-only tactical priority window
  ---
  duration_ms: 0.868693
  type: 'test'
  ...
# Subtest: shared createGain applies lane-aware mix without changing decay timing
ok 59 - shared createGain applies lane-aware mix without changing decay timing
  ---
  duration_ms: 0.131836
  type: 'test'
  ...
# Subtest: BGM computes historical base volume then applies BGM lane mix
ok 60 - BGM computes historical base volume then applies BGM lane mix
  ---
  duration_ms: 0.111606
  type: 'test'
  ...
# Subtest: all dedicated boss cues open tactical priority before emitting audio
ok 61 - all dedicated boss cues open tactical priority before emitting audio
  ---
  duration_ms: 0.167229
  type: 'test'
  ...
# Subtest: boss helper gains stay on the TACTICAL lane
ok 62 - boss helper gains stay on the TACTICAL lane
  ---
  duration_ms: 0.249671
  type: 'test'
  ...
# Subtest: shared disruptor cues support tactical priority without changing ordinary default
ok 63 - shared disruptor cues support tactical priority without changing ordinary default
  ---
  duration_ms: 0.239207
  type: 'test'
  ...
# Subtest: boss dispatch explicitly promotes shared disruptor cues while ordinary calls remain standard
ok 64 - boss dispatch explicitly promotes shared disruptor cues while ordinary calls remain standard
  ---
  duration_ms: 0.321128
  type: 'test'
  ...
# Subtest: audio priority adoption does not alter boss timing constants or attack state
ok 65 - audio priority adoption does not alter boss timing constants or attack state
  ---
  duration_ms: 0.175932
  type: 'test'
  ...
# Subtest: Devourer chassis preserves historical weakpoint contract
ok 66 - Devourer chassis preserves historical weakpoint contract
  ---
  duration_ms: 0.737668
  type: 'test'
  ...
# Subtest: Titan Core is a fixed four-segment capital chassis
ok 67 - Titan Core is a fixed four-segment capital chassis
  ---
  duration_ms: 0.243081
  type: 'test'
  ...
# Subtest: Worm is a fixed six-segment serpentine chassis with bounded rewards
ok 68 - Worm is a fixed six-segment serpentine chassis with bounded rewards
  ---
  duration_ms: 0.179878
  type: 'test'
  ...
# Subtest: boss chassis attack doctrines stay bounded without disabling attacks
ok 69 - boss chassis attack doctrines stay bounded without disabling attacks
  ---
  duration_ms: 0.182932
  type: 'test'
  ...
# Subtest: all canonical Devourer attacks resolve localized counterplay hints
ok 70 - all canonical Devourer attacks resolve localized counterplay hints
  ---
  duration_ms: 1.083623
  type: 'test'
  ...
# Subtest: attack resolution supports canonical IDs and rejects unknown labels
ok 71 - attack resolution supports canonical IDs and rejects unknown labels
  ---
  duration_ms: 0.137455
  type: 'test'
  ...
# Subtest: boss HUD keeps counter hints behind existing label visibility
ok 72 - boss HUD keeps counter hints behind existing label visibility
  ---
  duration_ms: 0.371263
  type: 'test'
  ...
# Subtest: Devourer pursuit pressure increases by phase while radial standoff shrinks
ok 73 - Devourer pursuit pressure increases by phase while radial standoff shrinks
  ---
  duration_ms: 0.837747
  type: 'test'
  ...
# Subtest: all phases pursue the player in both axes from long range
ok 74 - all phases pursue the player in both axes from long range
  ---
  duration_ms: 0.319596
  type: 'test'
  ...
# Subtest: long-range catch-up visibly exceeds the base phase step
ok 75 - long-range catch-up visibly exceeds the base phase step
  ---
  duration_ms: 0.134109
  type: 'test'
  ...
# Subtest: pursuit is frame-delta bounded and cannot teleport
ok 76 - pursuit is frame-delta bounded and cannot teleport
  ---
  duration_ms: 0.122192
  type: 'test'
  ...
# Subtest: pursuit respects world margin at every phase
ok 77 - pursuit respects world margin at every phase
  ---
  duration_ms: 0.244694
  type: 'test'
  ...
# Subtest: pursuit holds position once the phase radial standoff is reached
ok 78 - pursuit holds position once the phase radial standoff is reached
  ---
  duration_ms: 0.133959
  type: 'test'
  ...
# Subtest: campaign handoff checkpoints victory but leaves final telemetry uncommitted
ok 79 - campaign handoff checkpoints victory but leaves final telemetry uncommitted
  ---
  duration_ms: 4.302464
  type: 'test'
  ...
# Subtest: campaign handoff creates an active Sector 11 Wave 1 infinite session
ok 80 - campaign handoff creates an active Sector 11 Wave 1 infinite session
  ---
  duration_ms: 0.650287
  type: 'test'
  ...
# Subtest: campaign handoff exposes a matching infinite runtime descriptor
ok 81 - campaign handoff exposes a matching infinite runtime descriptor
  ---
  duration_ms: 0.830005
  type: 'test'
  ...
# Subtest: handoff is deterministic for the same seed and context
ok 82 - handoff is deterministic for the same seed and context
  ---
  duration_ms: 1.946908
  type: 'test'
  ...
# Subtest: reusing the returned ledger never double-counts campaign victory
ok 83 - reusing the returned ledger never double-counts campaign victory
  ---
  duration_ms: 2.184952
  type: 'test'
  ...
# Subtest: campaign guide preserves the six-stage learning arc through Sector 10
ok 84 - campaign guide preserves the six-stage learning arc through Sector 10
  ---
  duration_ms: 1.972836
  type: 'test'
  ...
# Subtest: campaign guide exposes bilingual contextual objectives
ok 85 - campaign guide exposes bilingual contextual objectives
  ---
  duration_ms: 0.424933
  type: 'test'
  ...
# Subtest: start screen surfaces the campaign arc without changing launch semantics
ok 86 - start screen surfaces the campaign arc without changing launch semantics
  ---
  duration_ms: 0.525543
  type: 'test'
  ...
# Subtest: HUD reads objectives from the canonical campaign guide
ok 87 - HUD reads objectives from the canonical campaign guide
  ---
  duration_ms: 0.380346
  type: 'test'
  ...
# Subtest: campaign guide remains presentation-only
ok 88 - campaign guide remains presentation-only
  ---
  duration_ms: 0.373886
  type: 'test'
  ...
# Subtest: player-facing campaign arc does not promise unimplemented endless mode
ok 89 - player-facing campaign arc does not promise unimplemented endless mode
  ---
  duration_ms: 0.346345
  type: 'test'
  ...
# Subtest: campaign runtime reaches the unified certified descriptor router through the projection cache
ok 90 - campaign runtime reaches the unified certified descriptor router through the projection cache
  ---
  duration_ms: 1.59886
  type: 'test'
  ...
# Subtest: regular enemy spawning no longer reads WaveConfig directly
ok 91 - regular enemy spawning no longer reads WaveConfig directly
  ---
  duration_ms: 0.250132
  type: 'test'
  ...
# Subtest: wave spawn cadence and budget are descriptor-backed
ok 92 - wave spawn cadence and budget are descriptor-backed
  ---
  duration_ms: 0.179146
  type: 'test'
  ...
# Subtest: campaign wave activation uses descriptor metadata and boss policy
ok 93 - campaign wave activation uses descriptor metadata and boss policy
  ---
  duration_ms: 0.16804
  type: 'test'
  ...
# Subtest: CORE_DROP_BOOST reads the runtime descriptor in both kill paths
ok 94 - CORE_DROP_BOOST reads the runtime descriptor in both kill paths
  ---
  duration_ms: 0.184304
  type: 'test'
  ...
# Subtest: Cosmic Whale quality gate is disabled only on LOW
ok 95 - Cosmic Whale quality gate is disabled only on LOW
  ---
  duration_ms: 0.842364
  type: 'test'
  ...
# Subtest: runtime enables Whale only for Infinite quality-eligible presentation
ok 96 - runtime enables Whale only for Infinite quality-eligible presentation
  ---
  duration_ms: 0.423229
  type: 'test'
  ...
# Subtest: Whale stays a passive background projection with no gameplay entity or scheduler
ok 97 - Whale stays a passive background projection with no gameplay entity or scheduler
  ---
  duration_ms: 0.673122
  type: 'test'
  ...
# Subtest: Whale renderer is bounded Canvas2D presentation
ok 98 - Whale renderer is bounded Canvas2D presentation
  ---
  duration_ms: 0.201791
  type: 'test'
  ...
# Subtest: Cosmic Whale stays absent when disabled or outside its passage window
ok 99 - Cosmic Whale stays absent when disabled or outside its passage window
  ---
  duration_ms: 1.007179
  type: 'test'
  ...
# Subtest: passage starts and ends fully faded with the whale outside the viewport
ok 100 - passage starts and ends fully faded with the whale outside the viewport
  ---
  duration_ms: 0.331072
  type: 'test'
  ...
# Subtest: active projection is finite, bounded and deterministic
ok 101 - active projection is finite, bounded and deterministic
  ---
  duration_ms: 0.847001
  type: 'test'
  ...
# Subtest: different cycles vary the visual passage without consuming random state
ok 102 - different cycles vary the visual passage without consuming random state
  ---
  duration_ms: 3.135257
  type: 'test'
  ...
# Subtest: long-run projection never emits NaN or Infinity
ok 103 - long-run projection never emits NaN or Infinity
  ---
  duration_ms: 0.520354
  type: 'test'
  ...
# Subtest: invalid projection inputs fail neutral
ok 104 - invalid projection inputs fail neutral
  ---
  duration_ms: 0.165286
  type: 'test'
  ...
# Subtest: game imports the bounded single-particle VFX helper
ok 105 - game imports the bounded single-particle VFX helper
  ---
  duration_ms: 0.899569
  type: 'test'
  ...
# Subtest: live VFX helper uses the current quality preset particle cap
ok 106 - live VFX helper uses the current quality preset particle cap
  ---
  duration_ms: 0.1545
  type: 'test'
  ...
# Subtest: no direct gameplay particle push remains outside the shared particle system
ok 107 - no direct gameplay particle push remains outside the shared particle system
  ---
  duration_ms: 0.242111
  type: 'test'
  ...
# Subtest: all six historical direct boss/cinematic VFX sites now use the bounded helper
ok 108 - all six historical direct boss/cinematic VFX sites now use the bounded helper
  ---
  duration_ms: 0.20823
  type: 'test'
  ...
# Subtest: VFX budget adoption preserves historical baseline probabilities after cadence normalization
ok 109 - VFX budget adoption preserves historical baseline probabilities after cadence normalization
  ---
  duration_ms: 0.321719
  type: 'test'
  ...
# Subtest: existing bounded triggerExplosion paths remain in use
ok 110 - existing bounded triggerExplosion paths remain in use
  ---
  duration_ms: 0.131576
  type: 'test'
  ...
# Subtest: runtime adopts the pure Eclipse helpers at the existing hot-path seams
ok 111 - runtime adopts the pure Eclipse helpers at the existing hot-path seams
  ---
  duration_ms: 1.077894
  type: 'test'
  ...
# Subtest: Eclipse extends H6 instead of creating a parallel event scheduler or renderer
ok 112 - Eclipse extends H6 instead of creating a parallel event scheduler or renderer
  ---
  duration_ms: 0.634093
  type: 'test'
  ...
# Subtest: Eclipse pressure stays affinity/type scoped instead of mutating global speed authority
ok 113 - Eclipse pressure stays affinity/type scoped instead of mutating global speed authority
  ---
  duration_ms: 0.190934
  type: 'test'
  ...
# Subtest: living standard count preserves !dead && !boss semantics
ok 114 - living standard count preserves !dead && !boss semantics
  ---
  duration_ms: 0.798358
  type: 'test'
  ...
# Subtest: active evolved count preserves living non-boss evolved semantics
ok 115 - active evolved count preserves living non-boss evolved semantics
  ---
  duration_ms: 0.146207
  type: 'test'
  ...
# Subtest: minion count preserves enemy type and isMinion predicate
ok 116 - minion count preserves enemy type and isMinion predicate
  ---
  duration_ms: 0.144365
  type: 'test'
  ...
# Subtest: living count preserves !dead semantics including bosses
ok 117 - living count preserves !dead semantics including bosses
  ---
  duration_ms: 0.185066
  type: 'test'
  ...
# Subtest: count helpers do not mutate source arrays or enemies
ok 118 - count helpers do not mutate source arrays or enemies
  ---
  duration_ms: 0.852328
  type: 'test'
  ...
# Subtest: same enemy identity projects signature behavior only once
ok 119 - same enemy identity projects signature behavior only once
  ---
  duration_ms: 1.789324
  type: 'test'
  ...
# Subtest: different enemy identities remain independently cached
ok 120 - different enemy identities remain independently cached
  ---
  duration_ms: 0.275029
  type: 'test'
  ...
# Subtest: neutral enemies retain the exact certified neutral projection
ok 121 - neutral enemies retain the exact certified neutral projection
  ---
  duration_ms: 0.251334
  type: 'test'
  ...
# Subtest: all evolved signatures retain certified behavior through the cache
ok 122 - all evolved signatures retain certified behavior through the cache
  ---
  duration_ms: 0.325575
  type: 'test'
  ...
# Subtest: live runtime has no direct signature projector calls in hot gameplay paths
ok 123 - live runtime has no direct signature projector calls in hot gameplay paths
  ---
  duration_ms: 2.312923
  type: 'test'
  ...
# Subtest: evolved signature and intensity are assigned at spawn and never mutated later
ok 124 - evolved signature and intensity are assigned at spawn and never mutated later
  ---
  duration_ms: 1.612731
  type: 'test'
  ...
# Subtest: Dyson normals form a real symmetric three-plane triad
ok 125 - Dyson normals form a real symmetric three-plane triad
  ---
  duration_ms: 1.787781
  type: 'test'
  ...
# Subtest: Star Matrix and X-Guard remain bounded for large swarms
ok 126 - Star Matrix and X-Guard remain bounded for large swarms
  ---
  duration_ms: 0.777788
  type: 'test'
  ...
# Subtest: Infinite challenge begins evolving enemies from Sector 11
ok 127 - Infinite challenge begins evolving enemies from Sector 11
  ---
  duration_ms: 2.834399
  type: 'test'
  ...
# Subtest: Sector 11 pressure is higher but remains bounded
ok 128 - Sector 11 pressure is higher but remains bounded
  ---
  duration_ms: 0.243783
  type: 'test'
  ...
# Subtest: storage normalizes persisted flashIntensity through the accessibility contract
ok 129 - storage normalizes persisted flashIntensity through the accessibility contract
  ---
  duration_ms: 0.905548
  type: 'test'
  ...
# Subtest: Canvas wrapper projects flash mode and removes repeated overlay flicker in REDUCED
ok 130 - Canvas wrapper projects flash mode and removes repeated overlay flicker in REDUCED
  ---
  duration_ms: 0.160689
  type: 'test'
  ...
# Subtest: FOTON disappearance flicker remains exclusive to the projected FULL behavior
ok 131 - FOTON disappearance flicker remains exclusive to the projected FULL behavior
  ---
  duration_ms: 0.125396
  type: 'test'
  ...
# Subtest: friendly shoot flash preserves FULL white fill and REDUCED member color
ok 132 - friendly shoot flash preserves FULL white fill and REDUCED member color
  ---
  duration_ms: 0.157093
  type: 'test'
  ...
# Subtest: enemy FULL flash retains historical white replacement and early return
ok 133 - enemy FULL flash retains historical white replacement and early return
  ---
  duration_ms: 0.145246
  type: 'test'
  ...
# Subtest: enemy REDUCED flash is a bounded highlight and does not early-return
ok 134 - enemy REDUCED flash is a bounded highlight and does not early-return
  ---
  duration_ms: 0.145737
  type: 'test'
  ...
# Subtest: game render loop projects one flash profile and passes it to enemies, swarm and FOTON
ok 135 - game render loop projects one flash profile and passes it to enemies, swarm and FOTON
  ---
  duration_ms: 0.3157
  type: 'test'
  ...
# Subtest: React Canvas receives the persisted flash setting
ok 136 - React Canvas receives the persisted flash setting
  ---
  duration_ms: 0.216502
  type: 'test'
  ...
# Subtest: flash accessibility adoption never conditions gameplay telegraphs
ok 137 - flash accessibility adoption never conditions gameplay telegraphs
  ---
  duration_ms: 0.305725
  type: 'test'
  ...
# Subtest: FULL preserves the historical flash profile
ok 138 - FULL preserves the historical flash profile
  ---
  duration_ms: 1.365242
  type: 'test'
  ...
# Subtest: REDUCED bounds all high-intensity flash axes
ok 139 - REDUCED bounds all high-intensity flash axes
  ---
  duration_ms: 0.196362
  type: 'test'
  ...
# Subtest: malformed flash settings fail safe to REDUCED
ok 140 - malformed flash settings fail safe to REDUCED
  ---
  duration_ms: 0.139698
  type: 'test'
  ...
# Subtest: touch carousel preserves all six canonical formation identities
ok 141 - touch carousel preserves all six canonical formation identities
  ---
  duration_ms: 1.481715
  type: 'test'
  ...
# Subtest: formation cycling wraps in both directions
ok 142 - formation cycling wraps in both directions
  ---
  duration_ms: 0.134491
  type: 'test'
  ...
# Subtest: mobile formation controls reuse the canonical formation-change path
ok 143 - mobile formation controls reuse the canonical formation-change path
  ---
  duration_ms: 1.856373
  type: 'test'
  ...
# Subtest: right-thumb carousel is safe-area aware and coarse-pointer scoped
ok 144 - right-thumb carousel is safe-area aware and coarse-pointer scoped
  ---
  duration_ms: 0.673182
  type: 'test'
  ...
# Subtest: portrait orientation guidance clears the formation control footprint
ok 145 - portrait orientation guidance clears the formation control footprint
  ---
  duration_ms: 0.403811
  type: 'test'
  ...
# Subtest: LOW keeps the CSS-only command core and avoids a WebGL runtime
ok 146 - LOW keeps the CSS-only command core and avoids a WebGL runtime
  ---
  duration_ms: 0.932628
  type: 'test'
  ...
# Subtest: menu 3D cadence and DPR remain bounded by quality tier
ok 147 - menu 3D cadence and DPR remain bounded by quality tier
  ---
  duration_ms: 0.666942
  type: 'test'
  ...
# Subtest: Foton renderer is lazy-mounted only through the MAIN start tab
ok 148 - Foton renderer is lazy-mounted only through the MAIN start tab
  ---
  duration_ms: 0.172537
  type: 'test'
  ...
# Subtest: Foton GLB is a real binary glTF asset with expected audit scale
ok 149 - Foton GLB is a real binary glTF asset with expected audit scale
  ---
  duration_ms: 1.432663
  type: 'test'
  ...
# Subtest: Three.js dependency is reproducibly locked
ok 150 - Three.js dependency is reproducibly locked
  ---
  duration_ms: 0.121271
  type: 'test'
  ...
# Subtest: GLB URL respects the active Vite hosting base path
ok 151 - GLB URL respects the active Vite hosting base path
  ---
  duration_ms: 0.083714
  type: 'test'
  ...
# Subtest: menu renderer pauses useful work while hidden and honors reduced motion
ok 152 - menu renderer pauses useful work while hidden and honors reduced motion
  ---
  duration_ms: 0.204735
  type: 'test'
  ...
# Subtest: renderer resources are disposed when the MAIN hero unmounts
ok 153 - renderer resources are disposed when the MAIN hero unmounts
  ---
  duration_ms: 0.130995
  type: 'test'
  ...
# Subtest: pointer parallax remains bounded and cosmetic
ok 154 - pointer parallax remains bounded and cosmetic
  ---
  duration_ms: 0.331793
  type: 'test'
  ...
# Subtest: EnergySwarmGame stays decoupled from Three.js and the menu hero
ok 155 - EnergySwarmGame stays decoupled from Three.js and the menu hero
  ---
  duration_ms: 0.532473
  type: 'test'
  ...
# Subtest: CSS command core remains a complete fallback beneath READY WebGL
ok 156 - CSS command core remains a complete fallback beneath READY WebGL
  ---
  duration_ms: 0.138206
  type: 'test'
  ...
# Subtest: true collected-Orbi progression unlocks one ring for 0-9
ok 157 - true collected-Orbi progression unlocks one ring for 0-9
  ---
  duration_ms: 0.929774
  type: 'test'
  ...
# Subtest: true collected-Orbi progression unlocks cyan plus emerald for 10-19
ok 158 - true collected-Orbi progression unlocks cyan plus emerald for 10-19
  ---
  duration_ms: 0.164815
  type: 'test'
  ...
# Subtest: true collected-Orbi progression caps at three rings from 20 onward
ok 159 - true collected-Orbi progression caps at three rings from 20 onward
  ---
  duration_ms: 0.114471
  type: 'test'
  ...
# Subtest: swarm-size helper never subtracts a phantom starting companion
ok 160 - swarm-size helper never subtracts a phantom starting companion
  ---
  duration_ms: 0.117795
  type: 'test'
  ...
# Subtest: invalid or negative counts fail safe to the base cyan ring
ok 161 - invalid or negative counts fail safe to the base cyan ring
  ---
  duration_ms: 0.103744
  type: 'test'
  ...
# Subtest: ring palette is bright neon cyan emerald and gold with red tactical accents
ok 162 - ring palette is bright neon cyan emerald and gold with red tactical accents
  ---
  duration_ms: 0.6989
  type: 'test'
  ...
# Subtest: rings share one exact Dyson-sphere radius and form a symmetric atomic triad
ok 163 - rings share one exact Dyson-sphere radius and form a symmetric atomic triad
  ---
  duration_ms: 0.366155
  type: 'test'
  ...
# Subtest: rings keep distinct slow orbital velocities
ok 164 - rings keep distinct slow orbital velocities
  ---
  duration_ms: 0.173658
  type: 'test'
  ...
# Subtest: every ring owns a mechanical rail, brighter energy conduit and segmented language
ok 165 - every ring owns a mechanical rail, brighter energy conduit and segmented language
  ---
  duration_ms: 0.332666
  type: 'test'
  ...
# Subtest: unlocked ring helper returns no more than the canonical three descriptors
ok 166 - unlocked ring helper returns no more than the canonical three descriptors
  ---
  duration_ms: 0.529408
  type: 'test'
  ...
# Subtest: gameplay GLB keeps bounded quality-tier cadence
ok 167 - gameplay GLB keeps bounded quality-tier cadence
  ---
  duration_ms: 1.360696
  type: 'test'
  ...
# Subtest: gameplay GLB body target stays exactly 25 percent smaller while halo composite adds transparent orbital room
ok 168 - gameplay GLB body target stays exactly 25 percent smaller while halo composite adds transparent orbital room
  ---
  duration_ms: 0.176313
  type: 'test'
  ...
# Subtest: all quality tiers keep GLB enabled
ok 169 - all quality tiers keep GLB enabled
  ---
  duration_ms: 0.132247
  type: 'test'
  ...
# Subtest: integrity state maps high shield to HEALTHY cyan
ok 170 - integrity state maps high shield to HEALTHY cyan
  ---
  duration_ms: 0.874461
  type: 'test'
  ...
# Subtest: integrity state maps medium shield to PRESSURED amber
ok 171 - integrity state maps medium shield to PRESSURED amber
  ---
  duration_ms: 0.177664
  type: 'test'
  ...
# Subtest: integrity state maps low shield to CRITICAL rose
ok 172 - integrity state maps low shield to CRITICAL rose
  ---
  duration_ms: 0.160208
  type: 'test'
  ...
# Subtest: non-finite shield input fails closed as critical zero integrity
ok 173 - non-finite shield input fails closed as critical zero integrity
  ---
  duration_ms: 0.132468
  type: 'test'
  ...
# Subtest: tactical Foton lens points toward cursor without moving the avatar body
ok 174 - tactical Foton lens points toward cursor without moving the avatar body
  ---
  duration_ms: 0.876244
  type: 'test'
  ...
# Subtest: tactical Foton shell pulse stays visually subtle
ok 175 - tactical Foton shell pulse stays visually subtle
  ---
  duration_ms: 0.270383
  type: 'test'
  ...
# Subtest: scan angle advances deterministically from elapsed gameplay time
ok 176 - scan angle advances deterministically from elapsed gameplay time
  ---
  duration_ms: 0.150234
  type: 'test'
  ...
# Subtest: threat tracking cadence stays low frequency
ok 177 - threat tracking cadence stays low frequency
  ---
  duration_ms: 0.976764
  type: 'test'
  ...
# Subtest: active boss ref has visual gaze priority over nearer regular enemies
ok 178 - active boss ref has visual gaze priority over nearer regular enemies
  ---
  duration_ms: 0.455408
  type: 'test'
  ...
# Subtest: nearest living enemy is selected from the spatial index inside bounded range
ok 179 - nearest living enemy is selected from the spatial index inside bounded range
  ---
  duration_ms: 0.438933
  type: 'test'
  ...
# Subtest: current target object is retained across small distance changes
ok 180 - current target object is retained across small distance changes
  ---
  duration_ms: 0.24164
  type: 'test'
  ...
# Subtest: current target is replaced when another indexed threat is clearly closer
ok 181 - current target is replaced when another indexed threat is clearly closer
  ---
  duration_ms: 0.269591
  type: 'test'
  ...
# Subtest: threats outside range do not control Foton gaze
ok 182 - threats outside range do not control Foton gaze
  ---
  duration_ms: 0.191505
  type: 'test'
  ...
# Subtest: projected gaze direction is normalized
ok 183 - projected gaze direction is normalized
  ---
  duration_ms: 0.285825
  type: 'test'
  ...
# Subtest: no threat produces a neutral gaze request
ok 184 - no threat produces a neutral gaze request
  ---
  duration_ms: 0.116654
  type: 'test'
  ...
# Subtest: live game imports frame health monitor primitives
ok 185 - live game imports frame health monitor primitives
  ---
  duration_ms: 1.026257
  type: 'test'
  ...
# Subtest: every new run starts with fresh frame health state
ok 186 - every new run starts with fresh frame health state
  ---
  duration_ms: 0.230353
  type: 'test'
  ...
# Subtest: pause and upgrade modal gaps do not contaminate sustained samples
ok 187 - pause and upgrade modal gaps do not contaminate sustained samples
  ---
  duration_ms: 0.249051
  type: 'test'
  ...
# Subtest: monitor observes the same post-clamp active delta used by the frame
ok 188 - monitor observes the same post-clamp active delta used by the frame
  ---
  duration_ms: 0.254639
  type: 'test'
  ...
# Subtest: monitor uses the authoritative current quality preset
ok 189 - monitor uses the authoritative current quality preset
  ---
  duration_ms: 0.195941
  type: 'test'
  ...
# Subtest: sustained recommendation is advisory and deduplicated
ok 190 - sustained recommendation is advisory and deduplicated
  ---
  duration_ms: 0.322029
  type: 'test'
  ...
# Subtest: live monitor never changes or persists the user's quality preset
ok 191 - live monitor never changes or persists the user's quality preset
  ---
  duration_ms: 0.292385
  type: 'test'
  ...
# Subtest: lifecycle clock discontinuities clear in-progress samples
ok 192 - lifecycle clock discontinuities clear in-progress samples
  ---
  duration_ms: 0.156623
  type: 'test'
  ...
# Subtest: monitor does not claim device temperature or thermal state
ok 193 - monitor does not claim device temperature or thermal state
  ---
  duration_ms: 0.701154
  type: 'test'
  ...
# Subtest: 60 Hz-like cadence is healthy
ok 194 - 60 Hz-like cadence is healthy
  ---
  duration_ms: 7.18298
  type: 'test'
  ...
# Subtest: 90 and 120 Hz cadences remain healthy
ok 195 - 90 and 120 Hz cadences remain healthy
  ---
  duration_ms: 5.10969
  type: 'test'
  ...
# Subtest: moderate sustained slow frames classify as pressured
ok 196 - moderate sustained slow frames classify as pressured
  ---
  duration_ms: 0.240378
  type: 'test'
  ...
# Subtest: heavy frame loss classifies as critical
ok 197 - heavy frame loss classifies as critical
  ---
  duration_ms: 0.182672
  type: 'test'
  ...
# Subtest: one degraded window does not recommend a downgrade
ok 198 - one degraded window does not recommend a downgrade
  ---
  duration_ms: 0.688094
  type: 'test'
  ...
# Subtest: two consecutive degraded windows recommend exactly one lower tier
ok 199 - two consecutive degraded windows recommend exactly one lower tier
  ---
  duration_ms: 0.581215
  type: 'test'
  ...
# Subtest: healthy recovery resets the consecutive pressure counter
ok 200 - healthy recovery resets the consecutive pressure counter
  ---
  duration_ms: 1.439743
  type: 'test'
  ...
# Subtest: quality recommendation steps down one tier and never below LOW
ok 201 - quality recommendation steps down one tier and never below LOW
  ---
  duration_ms: 0.599252
  type: 'test'
  ...
# Subtest: LOW pressure remains advisory without a lower preset
ok 202 - LOW pressure remains advisory without a lower preset
  ---
  duration_ms: 1.587603
  type: 'test'
  ...
# Subtest: invalid deltas fail closed without mutating state
ok 203 - invalid deltas fail closed without mutating state
  ---
  duration_ms: 0.680243
  type: 'test'
  ...
# Subtest: monitor clamps pathological active deltas to its safe sample ceiling
ok 204 - monitor clamps pathological active deltas to its safe sample ceiling
  ---
  duration_ms: 0.16131
  type: 'test'
  ...
# Subtest: reset clears sampling and sustained-pressure continuity
ok 205 - reset clears sampling and sustained-pressure continuity
  ---
  duration_ms: 0.39643
  type: 'test'
  ...
# Subtest: GAIA synthesis requires the eight followers around permanent FOTON
ok 206 - GAIA synthesis requires the eight followers around permanent FOTON
  ---
  duration_ms: 1.539972
  type: 'test'
  ...
# Subtest: duplicate energy does not advance distinct GAIA progress
ok 207 - duplicate energy does not advance distinct GAIA progress
  ---
  duration_ms: 0.315239
  type: 'test'
  ...
# Subtest: one complete prerequisite set creates one GAIA level and resets cycle mask
ok 208 - one complete prerequisite set creates one GAIA level and resets cycle mask
  ---
  duration_ms: 0.225145
  type: 'test'
  ...
# Subtest: each later full set levels the same GAIA progression again
ok 209 - each later full set levels the same GAIA progression again
  ---
  duration_ms: 0.213698
  type: 'test'
  ...
# Subtest: FOTON and GAIA themselves are not follower prerequisites
ok 210 - FOTON and GAIA themselves are not follower prerequisites
  ---
  duration_ms: 0.125547
  type: 'test'
  ...
# Subtest: GAIA combat evolution is meaningful but hard bounded
ok 211 - GAIA combat evolution is meaningful but hard bounded
  ---
  duration_ms: 0.284383
  type: 'test'
  ...
# Subtest: out-of-order acquisition with duplicates completes exactly once per eight unique energies
ok 212 - out-of-order acquisition with duplicates completes exactly once per eight unique energies
  ---
  duration_ms: 0.221259
  type: 'test'
  ...
# Subtest: partial second cycle preserves GAIA level until all distinct energies return
ok 213 - partial second cycle preserves GAIA level until all distinct energies return
  ---
  duration_ms: 0.166898
  type: 'test'
  ...
# Subtest: GAIA synthesis is independent of swarm occupancy and does not mutate previous state
ok 214 - GAIA synthesis is independent of swarm occupancy and does not mutate previous state
  ---
  duration_ms: 0.382149
  type: 'test'
  ...
# Subtest: GAIA progression resets cleanly for a new run
ok 215 - GAIA progression resets cleanly for a new run
  ---
  duration_ms: 0.452694
  type: 'test'
  ...
# Subtest: GAIA combat caps hold across a long progression sequence
ok 216 - GAIA combat caps hold across a long progression sequence
  ---
  duration_ms: 2.69398
  type: 'test'
  ...
# Subtest: GAIA progress helper reports unique energy bits in bounded state
ok 217 - GAIA progress helper reports unique energy bits in bounded state
  ---
  duration_ms: 0.125938
  type: 'test'
  ...
# Subtest: canvas DPR normalization preserves quality without unbounded pixel cost
ok 218 - canvas DPR normalization preserves quality without unbounded pixel cost
  ---
  duration_ms: 0.856504
  type: 'test'
  ...
# Subtest: backing store scales independently from the logical 800x480 game space
ok 219 - backing store scales independently from the logical 800x480 game space
  ---
  duration_ms: 0.679922
  type: 'test'
  ...
# Subtest: render loop resets context transform from physical pixels to logical coordinates
ok 220 - render loop resets context transform from physical pixels to logical coordinates
  ---
  duration_ms: 3.613238
  type: 'test'
  ...
# Subtest: canvas component synchronizes backing store on viewport changes
ok 221 - canvas component synchronizes backing store on viewport changes
  ---
  duration_ms: 0.249922
  type: 'test'
  ...
# Subtest: portrait guidance is advisory, dismissible and coarse-pointer scoped
ok 222 - portrait guidance is advisory, dismissible and coarse-pointer scoped
  ---
  duration_ms: 4.977398
  type: 'test'
  ...
# Subtest: Infinite boss family is adopted without changing the campaign spawn path
ok 223 - Infinite boss family is adopted without changing the campaign spawn path
  ---
  duration_ms: 1.966938
  type: 'test'
  ...
# Subtest: family specialist support stays behind existing MAX_ENEMIES and shared summon timers
ok 224 - family specialist support stays behind existing MAX_ENEMIES and shared summon timers
  ---
  duration_ms: 0.717828
  type: 'test'
  ...
# Subtest: Infinite boss identity weights the shared attack selector rather than replacing telegraph timing
ok 225 - Infinite boss identity weights the shared attack selector rather than replacing telegraph timing
  ---
  duration_ms: 0.760732
  type: 'test'
  ...
# Subtest: Infinite milestone presentation no longer hardcodes Devourer for every rematch
ok 226 - Infinite milestone presentation no longer hardcodes Devourer for every rematch
  ---
  duration_ms: 0.170584
  type: 'test'
  ...
# Subtest: Infinite boss family rotates deterministically every 25 sectors
ok 227 - Infinite boss family rotates deterministically every 25 sectors
  ---
  duration_ms: 0.637629
  type: 'test'
  ...
# Subtest: boss profiles use bounded H4 specialist support
ok 228 - boss profiles use bounded H4 specialist support
  ---
  duration_ms: 0.199547
  type: 'test'
  ...
# Subtest: boss attack identity changes weighting without producing zero-weight attacks
ok 229 - boss attack identity changes weighting without producing zero-weight attacks
  ---
  duration_ms: 0.116043
  type: 'test'
  ...
# Subtest: neutral context produces zero pressure delta
ok 230 - neutral context produces zero pressure delta
  ---
  duration_ms: 1.283851
  type: 'test'
  ...
# Subtest: context modulation is bounded to plus or minus eight percent
ok 231 - context modulation is bounded to plus or minus eight percent
  ---
  duration_ms: 0.222982
  type: 'test'
  ...
# Subtest: signals are normalized and non-finite values are rejected
ok 232 - signals are normalized and non-finite values are rejected
  ---
  duration_ms: 1.028621
  type: 'test'
  ...
# Subtest: same baseline and context produce identical contextual recipes
ok 233 - same baseline and context produce identical contextual recipes
  ---
  duration_ms: 1.415297
  type: 'test'
  ...
# Subtest: context transformation does not mutate the baseline recipe
ok 234 - context transformation does not mutate the baseline recipe
  ---
  duration_ms: 0.486795
  type: 'test'
  ...
# Subtest: strong context increases selected pressure while struggling context reduces it
ok 235 - strong context increases selected pressure while struggling context reduces it
  ---
  duration_ms: 0.492163
  type: 'test'
  ...
# Subtest: fairness, composition, mutators and milestones are never altered by context
ok 236 - fairness, composition, mutators and milestones are never altered by context
  ---
  duration_ms: 0.377222
  type: 'test'
  ...
# Subtest: representative contexts remain valid through Sector 1000
ok 237 - representative contexts remain valid through Sector 1000
  ---
  duration_ms: 73.343562
  type: 'test'
  ...
# Subtest: execution plan preserves source identity and deterministic traceability
ok 238 - execution plan preserves source identity and deterministic traceability
  ---
  duration_ms: 2.605768
  type: 'test'
  ...
# Subtest: execution plan does not alias mutable source arrays
ok 239 - execution plan does not alias mutable source arrays
  ---
  duration_ms: 0.420335
  type: 'test'
  ...
# Subtest: execution plans remain traceable and valid for Sectors 11–1000
ok 240 - execution plans remain traceable and valid for Sectors 11–1000
  ---
  duration_ms: 79.979458
  type: 'test'
  ...
# Subtest: execution adapter rejects a wave from another sector
ok 241 - execution adapter rejects a wave from another sector
  ---
  duration_ms: 0.519783
  type: 'test'
  ...
# Subtest: validator catches broken traceability and spawn mapping
ok 242 - validator catches broken traceability and spawn mapping
  ---
  duration_ms: 0.226107
  type: 'test'
  ...
# Subtest: recovery sectors resolve to RECOVERY_CLEAR with zero active mutators
ok 243 - recovery sectors resolve to RECOVERY_CLEAR with zero active mutators
  ---
  duration_ms: 1.272304
  type: 'test'
  ...
# Subtest: Advanced+ sectors always contain environmental pressure
ok 244 - Advanced+ sectors always contain environmental pressure
  ---
  duration_ms: 0.535107
  type: 'test'
  ...
# Subtest: selection never stacks more than one severe environmental hazard
ok 245 - selection never stacks more than one severe environmental hazard
  ---
  duration_ms: 0.22818
  type: 'test'
  ...
# Subtest: severe compound-punishment conflicts are rejected symmetrically
ok 246 - severe compound-punishment conflicts are rejected symmetrically
  ---
  duration_ms: 0.143383
  type: 'test'
  ...
# Subtest: environmental identities map Reduced Visibility to ECLIPSE without duplicating runtime effects
ok 247 - environmental identities map Reduced Visibility to ECLIPSE without duplicating runtime effects
  ---
  duration_ms: 0.118086
  type: 'test'
  ...
# Subtest: same directed inputs produce identical output
ok 248 - same directed inputs produce identical output
  ---
  duration_ms: 0.208521
  type: 'test'
  ...
# Subtest: Advanced+ environmental fallback is selected before conflict filtering
ok 249 - Advanced+ environmental fallback is selected before conflict filtering
  ---
  duration_ms: 0.213497
  type: 'test'
  ...
# Subtest: builder returns one fully certified inspectable sector plan
ok 250 - builder returns one fully certified inspectable sector plan
  ---
  duration_ms: 3.868308
  type: 'test'
  ...
# Subtest: same sector, seed and context produce identical certified plans
ok 251 - same sector, seed and context produce identical certified plans
  ---
  duration_ms: 1.224522
  type: 'test'
  ...
# Subtest: context changes effective plan identity without changing baseline identity
ok 252 - context changes effective plan identity without changing baseline identity
  ---
  duration_ms: 0.627483
  type: 'test'
  ...
# Subtest: execution plans remain traceable to effective wave and sector recipes
ok 253 - execution plans remain traceable to effective wave and sector recipes
  ---
  duration_ms: 0.41621
  type: 'test'
  ...
# Subtest: builder rejects invalid sector and context input
ok 254 - builder rejects invalid sector and context input
  ---
  duration_ms: 0.496379
  type: 'test'
  ...
# Subtest: full certified pipeline succeeds for Sectors 11–1000 under representative contexts
ok 255 - full certified pipeline succeeds for Sectors 11–1000 under representative contexts
  ---
  duration_ms: 183.60086
  type: 'test'
  ...
# Subtest: default profile exposes neutral Infinite Swarm records
ok 256 - default profile exposes neutral Infinite Swarm records
  ---
  duration_ms: 0.92708
  type: 'test'
  ...
# Subtest: infinite reach rejects campaign, zero, negative and non-finite coordinates
ok 257 - infinite reach rejects campaign, zero, negative and non-finite coordinates
  ---
  duration_ms: 0.986208
  type: 'test'
  ...
# Subtest: infinite reach advances lexicographically by sector then wave
ok 258 - infinite reach advances lexicographically by sector then wave
  ---
  duration_ms: 0.200028
  type: 'test'
  ...
# Subtest: final run commit records Infinite reach without changing campaign victory counters
ok 259 - final run commit records Infinite reach without changing campaign victory counters
  ---
  duration_ms: 0.415929
  type: 'test'
  ...
# Subtest: campaign checkpoint never invents Infinite reach
ok 260 - campaign checkpoint never invents Infinite reach
  ---
  duration_ms: 0.401017
  type: 'test'
  ...
# Subtest: milestone records increment the correct counter exactly once per event id
ok 261 - milestone records increment the correct counter exactly once per event id
  ---
  duration_ms: 0.230062
  type: 'test'
  ...
# Subtest: blank milestone ids fail closed without counting
ok 262 - blank milestone ids fail closed without counting
  ---
  duration_ms: 0.149373
  type: 'test'
  ...
# Subtest: Titan raid escalation preserves the H7 200-sector cadence
ok 263 - Titan raid escalation preserves the H7 200-sector cadence
  ---
  duration_ms: 0.906829
  type: 'test'
  ...
# Subtest: Worm raids begin at 300 and alternate between Titan milestones
ok 264 - Worm raids begin at 300 and alternate between Titan milestones
  ---
  duration_ms: 0.237674
  type: 'test'
  ...
# Subtest: Titan and Worm raid schedules remain mutually exclusive through Sector 5000
ok 265 - Titan and Worm raid schedules remain mutually exclusive through Sector 5000
  ---
  duration_ms: 1.546011
  type: 'test'
  ...
# Subtest: general raid authority returns exactly the expected deep-endgame chassis
ok 266 - general raid authority returns exactly the expected deep-endgame chassis
  ---
  duration_ms: 0.364122
  type: 'test'
  ...
# Subtest: Titan raid profile remains bounded and honors fairness telegraph
ok 267 - Titan raid profile remains bounded and honors fairness telegraph
  ---
  duration_ms: 0.262071
  type: 'test'
  ...
# Subtest: Worm raid profile remains bounded and honors fairness telegraph
ok 268 - Worm raid profile remains bounded and honors fairness telegraph
  ---
  duration_ms: 0.164825
  type: 'test'
  ...
# Subtest: raid defeat sequencing resolves only after the escalation stage
ok 269 - raid defeat sequencing resolves only after the escalation stage
  ---
  duration_ms: 0.22836
  type: 'test'
  ...
# Subtest: storage defaults include all explicit Infinite Swarm records
ok 270 - storage defaults include all explicit Infinite Swarm records
  ---
  duration_ms: 0.813291
  type: 'test'
  ...
# Subtest: loaded Infinite records are normalized through safeRecordInteger
ok 271 - loaded Infinite records are normalized through safeRecordInteger
  ---
  duration_ms: 0.178385
  type: 'test'
  ...
# Subtest: start screen preserves legacy campaign bestWave while adding a distinct Infinite archive
ok 272 - start screen preserves legacy campaign bestWave while adding a distinct Infinite archive
  ---
  duration_ms: 0.995141
  type: 'test'
  ...
# Subtest: Infinite archive stays visibly locked before Sector 11
ok 273 - Infinite archive stays visibly locked before Sector 11
  ---
  duration_ms: 0.186398
  type: 'test'
  ...
# Subtest: start screen exposes persistent Warden and Devourer-rematch counters
ok 274 - start screen exposes persistent Warden and Devourer-rematch counters
  ---
  duration_ms: 0.162311
  type: 'test'
  ...
# Subtest: ResultScreen accepts explicit Infinite persistent record props
ok 275 - ResultScreen accepts explicit Infinite persistent record props
  ---
  duration_ms: 0.142823
  type: 'test'
  ...
# Subtest: ResultScreen only renders Infinite archive after Infinite Swarm has been reached
ok 276 - ResultScreen only renders Infinite archive after Infinite Swarm has been reached
  ---
  duration_ms: 0.153859
  type: 'test'
  ...
# Subtest: EnergySwarmGame passes current persistent record state into ResultScreen
ok 277 - EnergySwarmGame passes current persistent record state into ResultScreen
  ---
  duration_ms: 0.276542
  type: 'test'
  ...
# Subtest: recovery sectors preserve zero environmental mutators through waves and execution
ok 278 - recovery sectors preserve zero environmental mutators through waves and execution
  ---
  duration_ms: 4.041515
  type: 'test'
  ...
# Subtest: infinite progression tiers begin at Sector 11
ok 279 - infinite progression tiers begin at Sector 11
  ---
  duration_ms: 1.614793
  type: 'test'
  ...
# Subtest: same sector and seed produce an identical recipe
ok 280 - same sector and seed produce an identical recipe
  ---
  duration_ms: 1.650997
  type: 'test'
  ...
# Subtest: recipe identity changes when the seed changes
ok 281 - recipe identity changes when the seed changes
  ---
  duration_ms: 0.264123
  type: 'test'
  ...
# Subtest: milestone and recovery sectors follow the canonical cadence
ok 282 - milestone and recovery sectors follow the canonical cadence
  ---
  duration_ms: 0.57093
  type: 'test'
  ...
# Subtest: Sectors 11–1000 always stay inside certified recipe bounds
ok 283 - Sectors 11–1000 always stay inside certified recipe bounds
  ---
  duration_ms: 33.670975
  type: 'test'
  ...
# Subtest: recovery sectors reduce pressure and clear mutators after 25-sector milestones
ok 284 - recovery sectors reduce pressure and clear mutators after 25-sector milestones
  ---
  duration_ms: 0.220138
  type: 'test'
  ...
# Subtest: validator reports illegal recipes without mutating them
ok 285 - validator reports illegal recipes without mutating them
  ---
  duration_ms: 0.269221
  type: 'test'
  ...
# Subtest: validator rejects mutators on a recovery sector
ok 286 - validator rejects mutators on a recovery sector
  ---
  duration_ms: 0.198285
  type: 'test'
  ...
# Subtest: infinite session starts at Sector 11 wave 1 with a certified plan
ok 287 - infinite session starts at Sector 11 wave 1 with a certified plan
  ---
  duration_ms: 5.716388
  type: 'test'
  ...
# Subtest: advancing within a sector preserves the current certified plan
ok 288 - advancing within a sector preserves the current certified plan
  ---
  duration_ms: 0.553193
  type: 'test'
  ...
# Subtest: clearing the final wave advances exactly one sector and rebuilds from new context
ok 289 - clearing the final wave advances exactly one sector and rebuilds from new context
  ---
  duration_ms: 1.077303
  type: 'test'
  ...
# Subtest: same seed and context produce the same session sequence
ok 290 - same seed and context produce the same session sequence
  ---
  duration_ms: 13.409678
  type: 'test'
  ...
# Subtest: ended sessions cannot advance
ok 291 - ended sessions cannot advance
  ---
  duration_ms: 0.637219
  type: 'test'
  ...
# Subtest: session progression remains valid from Sector 11 through Sector 1000
ok 292 - session progression remains valid from Sector 11 through Sector 1000
  ---
  duration_ms: 156.873325
  type: 'test'
  ...
# Subtest: validation rejects a corrupted wave cursor
ok 293 - validation rejects a corrupted wave cursor
  ---
  duration_ms: 0.233358
  type: 'test'
  ...
# Subtest: wave expansion is deterministic for a certified sector recipe
ok 294 - wave expansion is deterministic for a certified sector recipe
  ---
  duration_ms: 6.250983
  type: 'test'
  ...
# Subtest: wave budgets conserve the exact sector enemy budget
ok 295 - wave budgets conserve the exact sector enemy budget
  ---
  duration_ms: 1.269849
  type: 'test'
  ...
# Subtest: pressure ramps through a sector and final wave reaches sector pressure
ok 296 - pressure ramps through a sector and final wave reaches sector pressure
  ---
  duration_ms: 0.357332
  type: 'test'
  ...
# Subtest: milestones appear only on the final wave
ok 297 - milestones appear only on the final wave
  ---
  duration_ms: 0.490319
  type: 'test'
  ...
# Subtest: ordinary wave composition never injects the canonical boss enemy
ok 298 - ordinary wave composition never injects the canonical boss enemy
  ---
  duration_ms: 48.877197
  type: 'test'
  ...
# Subtest: complete wave plans remain valid from Sector 11 through 1000
ok 299 - complete wave plans remain valid from Sector 11 through 1000
  ---
  duration_ms: 27.608962
  type: 'test'
  ...
# Subtest: validator rejects budget leakage and premature milestones
ok 300 - validator rejects budget leakage and premature milestones
  ---
  duration_ms: 0.365474
  type: 'test'
  ...
# Subtest: generic keyboard focus contract covers premium entry and live game shell
ok 301 - generic keyboard focus contract covers premium entry and live game shell
  ---
  duration_ms: 1.133316
  type: 'test'
  ...
# Subtest: focus ring uses visible outline plus dark separation ring
ok 302 - focus ring uses visible outline plus dark separation ring
  ---
  duration_ms: 0.169672
  type: 'test'
  ...
# Subtest: higher contrast preference strengthens the focus indicator
ok 303 - higher contrast preference strengthens the focus indicator
  ---
  duration_ms: 0.160069
  type: 'test'
  ...
# Subtest: ES-10B never suppresses focus outlines
ok 304 - ES-10B never suppresses focus outlines
  ---
  duration_ms: 0.256652
  type: 'test'
  ...
# Subtest: generic focus contract precedes component-specific touch and orientation rules
ok 305 - generic focus contract precedes component-specific touch and orientation rules
  ---
  duration_ms: 0.18109
  type: 'test'
  ...
# Subtest: primary shell surfaces contain native keyboard-focusable controls
ok 306 - primary shell surfaces contain native keyboard-focusable controls
  ---
  duration_ms: 0.312896
  type: 'test'
  ...
# Subtest: focus styling is presentation-only
ok 307 - focus styling is presentation-only
  ---
  duration_ms: 0.323442
  type: 'test'
  ...
# Subtest: EnergySwarmGame adopts the certified run persistence transitions
ok 308 - EnergySwarmGame adopts the certified run persistence transitions
  ---
  duration_ms: 1.00067
  type: 'test'
  ...
# Subtest: new runs reset the in-memory persistence ledger
ok 309 - new runs reset the in-memory persistence ledger
  ---
  duration_ms: 0.148031
  type: 'test'
  ...
# Subtest: legacy commitStats no longer directly increments persistent counters
ok 310 - legacy commitStats no longer directly increments persistent counters
  ---
  duration_ms: 0.313666
  type: 'test'
  ...
# Subtest: campaign checkpoint and final run commit remain separate transitions
ok 311 - campaign checkpoint and final run commit remain separate transitions
  ---
  duration_ms: 0.269842
  type: 'test'
  ...
# Subtest: final run termination still commits telemetry exactly once
ok 312 - final run termination still commits telemetry exactly once
  ---
  duration_ms: 0.149082
  type: 'test'
  ...
# Subtest: campaign victory handoff does not execute the final run commit
ok 313 - campaign victory handoff does not execute the final run commit
  ---
  duration_ms: 0.152838
  type: 'test'
  ...
# Subtest: active runs auto-pause only on focus-loss/background signals
ok 314 - active runs auto-pause only on focus-loss/background signals
  ---
  duration_ms: 0.965467
  type: 'test'
  ...
# Subtest: lifecycle never stacks pause over already suspended states
ok 315 - lifecycle never stacks pause over already suspended states
  ---
  duration_ms: 0.151636
  type: 'test'
  ...
# Subtest: every lifecycle boundary resets the frame clock
ok 316 - every lifecycle boundary resets the frame clock
  ---
  duration_ms: 0.151356
  type: 'test'
  ...
# Subtest: runtime uses synchronous pause state inside requestAnimationFrame
ok 317 - runtime uses synchronous pause state inside requestAnimationFrame
  ---
  duration_ms: 1.892087
  type: 'test'
  ...
# Subtest: focus, visibility and orientation lifecycle listeners are explicit
ok 318 - focus, visibility and orientation lifecycle listeners are explicit
  ---
  duration_ms: 1.382878
  type: 'test'
  ...
# Subtest: Devourer cinematic continues into Infinite Swarm instead of ResultScreen
ok 319 - Devourer cinematic continues into Infinite Swarm instead of ResultScreen
  ---
  duration_ms: 1.141529
  type: 'test'
  ...
# Subtest: live handoff checkpoints campaign victory without final telemetry commit
ok 320 - live handoff checkpoints campaign victory without final telemetry commit
  ---
  duration_ms: 0.184685
  type: 'test'
  ...
# Subtest: live handoff enters certified Sector 11 runtime while preserving the active run
ok 321 - live handoff enters certified Sector 11 runtime while preserving the active run
  ---
  duration_ms: 0.182361
  type: 'test'
  ...
# Subtest: infinite wave completion advances the infinite session, not campaign sector math
ok 322 - infinite wave completion advances the infinite session, not campaign sector math
  ---
  duration_ms: 0.225816
  type: 'test'
  ...
# Subtest: handcrafted campaign advancement remains isolated in the campaign branch
ok 323 - handcrafted campaign advancement remains isolated in the campaign branch
  ---
  duration_ms: 0.258074
  type: 'test'
  ...
# Subtest: Threat Intel is descriptor-backed for Sector 11+ and campaign WaveConfig is not rendered directly
ok 324 - Threat Intel is descriptor-backed for Sector 11+ and campaign WaveConfig is not rendered directly
  ---
  duration_ms: 0.841552
  type: 'test'
  ...
# Subtest: later infinite defeat still reports the Devourer as defeated
ok 325 - later infinite defeat still reports the Devourer as defeated
  ---
  duration_ms: 0.307508
  type: 'test'
  ...
# Subtest: new runs still reset both persistence and runtime back to campaign Sector 1
ok 326 - new runs still reset both persistence and runtime back to campaign Sector 1
  ---
  duration_ms: 0.171385
  type: 'test'
  ...
# Subtest: EnergySwarmGame imports both Infinite persistence transitions
ok 327 - EnergySwarmGame imports both Infinite persistence transitions
  ---
  duration_ms: 0.900307
  type: 'test'
  ...
# Subtest: live reach persistence reads the freshest save and updates React plus local storage
ok 328 - live reach persistence reads the freshest save and updates React plus local storage
  ---
  duration_ms: 0.244309
  type: 'test'
  ...
# Subtest: milestone persistence reuses RunCommitLedger for idempotent event counting
ok 329 - milestone persistence reuses RunCommitLedger for idempotent event counting
  ---
  duration_ms: 0.310534
  type: 'test'
  ...
# Subtest: campaign-to-infinite handoff persists Sector 11 Wave 1 immediately
ok 330 - campaign-to-infinite handoff persists Sector 11 Wave 1 immediately
  ---
  duration_ms: 0.196077
  type: 'test'
  ...
# Subtest: every Infinite runtime advancement persists the new sector and wave
ok 331 - every Infinite runtime advancement persists the new sector and wave
  ---
  duration_ms: 0.221811
  type: 'test'
  ...
# Subtest: final run commit includes Infinite reach only when runtime mode is INFINITE
ok 332 - final run commit includes Infinite reach only when runtime mode is INFINITE
  ---
  duration_ms: 0.297912
  type: 'test'
  ...
# Subtest: Blackout Warden death records milestone in both direct and splash kill paths
ok 333 - Blackout Warden death records milestone in both direct and splash kill paths
  ---
  duration_ms: 0.258644
  type: 'test'
  ...
# Subtest: Devourer rematch persists after the rematch gate reaches DEFEATED and before boss cleanup
ok 334 - Devourer rematch persists after the rematch gate reaches DEFEATED and before boss cleanup
  ---
  duration_ms: 0.154967
  type: 'test'
  ...
# Subtest: campaign boss defeat does not call milestone persistence
ok 335 - campaign boss defeat does not call milestone persistence
  ---
  duration_ms: 0.277406
  type: 'test'
  ...
# Subtest: all ten canonical energy signatures have one bounded attack profile
ok 336 - all ten canonical energy signatures have one bounded attack profile
  ---
  duration_ms: 0.949141
  type: 'test'
  ...
# Subtest: signature behaviors are genuinely distinct rather than recolored lasers
ok 337 - signature behaviors are genuinely distinct rather than recolored lasers
  ---
  duration_ms: 0.161628
  type: 'test'
  ...
# Subtest: legacy affinity fallbacks map into canonical signatures
ok 338 - legacy affinity fallbacks map into canonical signatures
  ---
  duration_ms: 0.155126
  type: 'test'
  ...
# Subtest: ORBI canon contains nine base energies plus fusion-only GAIA
ok 339 - ORBI canon contains nine base energies plus fusion-only GAIA
  ---
  duration_ms: 1.869814
  type: 'test'
  ...
# Subtest: FOTON is player-core only and the eight other base energies are collectible followers
ok 340 - FOTON is player-core only and the eight other base energies are collectible followers
  ---
  duration_ms: 0.228934
  type: 'test'
  ...
# Subtest: every canonical energy owns unique identity metadata and attack signature
ok 341 - every canonical energy owns unique identity metadata and attack signature
  ---
  duration_ms: 0.269864
  type: 'test'
  ...
# Subtest: one shuffled recruitment cycle contains every collectible energy exactly once
ok 342 - one shuffled recruitment cycle contains every collectible energy exactly once
  ---
  duration_ms: 0.319469
  type: 'test'
  ...
# Subtest: single-particle budget accepts payload unchanged below capacity
ok 343 - single-particle budget accepts payload unchanged below capacity
  ---
  duration_ms: 2.221057
  type: 'test'
  ...
# Subtest: single-particle budget drops cosmetic payload exactly at capacity
ok 344 - single-particle budget drops cosmetic payload exactly at capacity
  ---
  duration_ms: 1.354528
  type: 'test'
  ...
# Subtest: single-particle budget sanitizes malformed or fractional caps fail-safe
ok 345 - single-particle budget sanitizes malformed or fractional caps fail-safe
  ---
  duration_ms: 0.278278
  type: 'test'
  ...
# Subtest: diagnostics window remains silent before 500ms
ok 346 - diagnostics window remains silent before 500ms
  ---
  duration_ms: 1.23906
  type: 'test'
  ...
# Subtest: diagnostics emits a bounded 0.5s aggregate snapshot
ok 347 - diagnostics emits a bounded 0.5s aggregate snapshot
  ---
  duration_ms: 0.450394
  type: 'test'
  ...
# Subtest: snapshot resets its aggregation window after emission
ok 348 - snapshot resets its aggregation window after emission
  ---
  duration_ms: 0.822583
  type: 'test'
  ...
# Subtest: CPU phase timing is clamped to total loop work
ok 349 - CPU phase timing is clamped to total loop work
  ---
  duration_ms: 0.341196
  type: 'test'
  ...
# Subtest: latest entity counts and health status win within a window
ok 350 - latest entity counts and health status win within a window
  ---
  duration_ms: 0.384762
  type: 'test'
  ...
# Subtest: invalid zero frame samples fail closed
ok 351 - invalid zero frame samples fail closed
  ---
  duration_ms: 0.164543
  type: 'test'
  ...
# Subtest: latest GAIA telemetry wins within the diagnostics window
ok 352 - latest GAIA telemetry wins within the diagnostics window
  ---
  duration_ms: 0.393767
  type: 'test'
  ...
# Subtest: analyzer validates complete comparable baseline, L1 and L2+ captures
ok 353 - analyzer validates complete comparable baseline, L1 and L2+ captures
  ---
  duration_ms: 12.113062
  type: 'test'
  ...
# Subtest: analyzer flags environment mismatch without pretending captures are comparable
ok 354 - analyzer flags environment mismatch without pretending captures are comparable
  ---
  duration_ms: 2.03963
  type: 'test'
  ...
# Subtest: new GAIA critical health observations route evidence to INVESTIGATE
ok 355 - new GAIA critical health observations route evidence to INVESTIGATE
  ---
  duration_ms: 2.159692
  type: 'test'
  ...
# Subtest: partial or short captures are invalid for certification analysis
ok 356 - partial or short captures are invalid for certification analysis
  ---
  duration_ms: 1.561033
  type: 'test'
  ...
# Subtest: scenario identity rejects GAIA telemetry in baseline evidence
ok 357 - scenario identity rejects GAIA telemetry in baseline evidence
  ---
  duration_ms: 0.685478
  type: 'test'
  ...
# Subtest: parser rejects malformed evidence before metric analysis
ok 358 - parser rejects malformed evidence before metric analysis
  ---
  duration_ms: 0.209691
  type: 'test'
  ...
# Subtest: canonical build provenance accepts Git SHA and non-local product version
ok 359 - canonical build provenance accepts Git SHA and non-local product version
  ---
  duration_ms: 0.992907
  type: 'test'
  ...
# Subtest: Node/test fallback is explicitly local and cannot masquerade as canonical
ok 360 - Node/test fallback is explicitly local and cannot masquerade as canonical
  ---
  duration_ms: 0.186841
  type: 'test'
  ...
# Subtest: three captures from the same deployed build are provenance-comparable
ok 361 - three captures from the same deployed build are provenance-comparable
  ---
  duration_ms: 0.859357
  type: 'test'
  ...
# Subtest: build SHA mismatch prevents certification comparability
ok 362 - build SHA mismatch prevents certification comparability
  ---
  duration_ms: 0.333864
  type: 'test'
  ...
# Subtest: product version mismatch prevents certification comparability
ok 363 - product version mismatch prevents certification comparability
  ---
  duration_ms: 0.240703
  type: 'test'
  ...
# Subtest: missing or local provenance is invalid certification evidence
ok 364 - missing or local provenance is invalid certification evidence
  ---
  duration_ms: 0.234653
  type: 'test'
  ...
# Subtest: structurally invalid evidence outranks a simultaneous provenance mismatch
ok 365 - structurally invalid evidence outranks a simultaneous provenance mismatch
  ---
  duration_ms: 0.669741
  type: 'test'
  ...
# Subtest: evidence recorder starts empty and only records while active
ok 366 - evidence recorder starts empty and only records while active
  ---
  duration_ms: 0.858445
  type: 'test'
  ...
# Subtest: first post-F4 diagnostics snapshot is discarded to align the 15 s evidence interval
ok 367 - first post-F4 diagnostics snapshot is discarded to align the 15 s evidence interval
  ---
  duration_ms: 0.149197
  type: 'test'
  ...
# Subtest: evidence recorder becomes READY at exactly 30 retained snapshots and never grows beyond the cap
ok 368 - evidence recorder becomes READY at exactly 30 retained snapshots and never grows beyond the cap
  ---
  duration_ms: 0.317415
  type: 'test'
  ...
# Subtest: partial and complete captures are labeled without fabricating duration
ok 369 - partial and complete captures are labeled without fabricating duration
  ---
  duration_ms: 0.583523
  type: 'test'
  ...
# Subtest: evidence serialization retains GAIA and entity-pressure fields
ok 370 - evidence serialization retains GAIA and entity-pressure fields
  ---
  duration_ms: 0.403023
  type: 'test'
  ...
# Subtest: quality presets enforce declared DPR ceilings
ok 371 - quality presets enforce declared DPR ceilings
  ---
  duration_ms: 1.575197
  type: 'test'
  ...
# Subtest: backing store obeys both preset and global DPR caps
ok 372 - backing store obeys both preset and global DPR caps
  ---
  duration_ms: 0.754527
  type: 'test'
  ...
# Subtest: all four renderer budgets remain explicit and ordered
ok 373 - all four renderer budgets remain explicit and ordered
  ---
  duration_ms: 0.21546
  type: 'test'
  ...
# Subtest: runtime wires preset budgets to canvas and starfield
ok 374 - runtime wires preset budgets to canvas and starfield
  ---
  duration_ms: 1.800835
  type: 'test'
  ...
# Subtest: photo filter canon is stable, unique and bounded
ok 375 - photo filter canon is stable, unique and bounded
  ---
  duration_ms: 1.249667
  type: 'test'
  ...
# Subtest: every photo filter profile resolves by its canonical id
ok 376 - every photo filter profile resolves by its canonical id
  ---
  duration_ms: 0.19223
  type: 'test'
  ...
# Subtest: photo filter cycling is deterministic and wraps both directions
ok 377 - photo filter cycling is deterministic and wraps both directions
  ---
  duration_ms: 0.155096
  type: 'test'
  ...
# Subtest: PauseMenu exposes an explicit Photo Mode action
ok 378 - PauseMenu exposes an explicit Photo Mode action
  ---
  duration_ms: 1.086411
  type: 'test'
  ...
# Subtest: Photo Mode is independent state layered on top of pause
ok 379 - Photo Mode is independent state layered on top of pause
  ---
  duration_ms: 3.829776
  type: 'test'
  ...
# Subtest: F10 enters Photo Mode and F10/Escape returns to pause without resuming
ok 380 - F10 enters Photo Mode and F10/Escape returns to pause without resuming
  ---
  duration_ms: 4.501931
  type: 'test'
  ...
# Subtest: normal pause menu is hidden while clean Photo Mode is active
ok 381 - normal pause menu is hidden while clean Photo Mode is active
  ---
  duration_ms: 0.29773
  type: 'test'
  ...
# Subtest: Photo Mode hint self-hides and leaves the frame clean
ok 382 - Photo Mode hint self-hides and leaves the frame clean
  ---
  duration_ms: 1.892589
  type: 'test'
  ...
# Subtest: clean Photo Mode hides DOM chrome but not the battlefield canvas
ok 383 - clean Photo Mode hides DOM chrome but not the battlefield canvas
  ---
  duration_ms: 0.460315
  type: 'test'
  ...
# Subtest: root exposes photo mode state to presentation CSS
ok 384 - root exposes photo mode state to presentation CSS
  ---
  duration_ms: 0.230288
  type: 'test'
  ...
# Subtest: new runs and game-over clear stale Photo Mode state
ok 385 - new runs and game-over clear stale Photo Mode state
  ---
  duration_ms: 0.224058
  type: 'test'
  ...
# Subtest: lifecycle policy never resumes an already paused/photo state on focus changes
ok 386 - lifecycle policy never resumes an already paused/photo state on focus changes
  ---
  duration_ms: 0.382848
  type: 'test'
  ...
# Subtest: clean Photo Mode does not change gameplay or persistence data
ok 387 - clean Photo Mode does not change gameplay or persistence data
  ---
  duration_ms: 0.567477
  type: 'test'
  ...
# Subtest: H11 exposes deterministic cinematic filter state only to presentation
ok 388 - H11 exposes deterministic cinematic filter state only to presentation
  ---
  duration_ms: 0.265942
  type: 'test'
  ...
# Subtest: H11 keyboard controls cycle or reset filters without resuming gameplay
ok 389 - H11 keyboard controls cycle or reset filters without resuming gameplay
  ---
  duration_ms: 8.718422
  type: 'test'
  ...
# Subtest: H11 removes only the paused presentation veil while Photo Mode remains paused
ok 390 - H11 removes only the paused presentation veil while Photo Mode remains paused
  ---
  duration_ms: 2.703073
  type: 'test'
  ...
# Subtest: H11 filter CSS targets only the existing game stage
ok 391 - H11 filter CSS targets only the existing game stage
  ---
  duration_ms: 0.336659
  type: 'test'
  ...
# Subtest: H11 photo controls are touch and keyboard accessible and can self-hide
ok 392 - H11 photo controls are touch and keyboard accessible and can self-hide
  ---
  duration_ms: 2.021875
  type: 'test'
  ...
# Subtest: ordered spatial contact set matches legacy full scan across dense queries
ok 393 - ordered spatial contact set matches legacy full scan across dense queries
  ---
  duration_ms: 4.758279
  type: 'test'
  ...
# Subtest: multi-collision query preserves strict edge semantics
ok 394 - multi-collision query preserves strict edge semantics
  ---
  duration_ms: 0.325743
  type: 'test'
  ...
# Subtest: multi-collision query returns original array order, not bucket traversal order
ok 395 - multi-collision query returns original array order, not bucket traversal order
  ---
  duration_ms: 0.203538
  type: 'test'
  ...
# Subtest: spatial contact candidate checks remain local in a large spread battlefield
ok 396 - spatial contact candidate checks remain local in a large spread battlefield
  ---
  duration_ms: 0.917406
  type: 'test'
  ...
# Subtest: invalid multi-collision queries fail closed
ok 397 - invalid multi-collision queries fail closed
  ---
  duration_ms: 0.229467
  type: 'test'
  ...
# Subtest: live player contact uses the spatial index rather than a full enemy sweep
ok 398 - live player contact uses the spatial index rather than a full enemy sweep
  ---
  duration_ms: 1.864687
  type: 'test'
  ...
# Subtest: hostile projectile to player collision uses squared distance
ok 399 - hostile projectile to player collision uses squared distance
  ---
  duration_ms: 1.437862
  type: 'test'
  ...
# Subtest: boss shield-node projectile collision uses squared distance
ok 400 - boss shield-node projectile collision uses squared distance
  ---
  duration_ms: 1.253143
  type: 'test'
  ...
# Subtest: start shell uses wide premium launch composition
ok 401 - start shell uses wide premium launch composition
  ---
  duration_ms: 1.156277
  type: 'test'
  ...
# Subtest: launch control renders before dense record/hero content on narrow viewports
ok 402 - launch control renders before dense record/hero content on narrow viewports
  ---
  duration_ms: 3.327537
  type: 'test'
  ...
# Subtest: primary start CTA is explicit and placed inside launch control
ok 403 - primary start CTA is explicit and placed inside launch control
  ---
  duration_ms: 0.174423
  type: 'test'
  ...
# Subtest: Enter remains a documented keyboard fallback rather than primary-only launch path
ok 404 - Enter remains a documented keyboard fallback rather than primary-only launch path
  ---
  duration_ms: 1.065771
  type: 'test'
  ...
# Subtest: launch deck has a visible scroll affordance for genuinely short viewports
ok 405 - launch deck has a visible scroll affordance for genuinely short viewports
  ---
  duration_ms: 0.429579
  type: 'test'
  ...
# Subtest: new launch hero reserves a stable stage for future 3D Foton integration
ok 406 - new launch hero reserves a stable stage for future 3D Foton integration
  ---
  duration_ms: 0.149697
  type: 'test'
  ...
# Subtest: persistent progression surfaces remain available
ok 407 - persistent progression surfaces remain available
  ---
  duration_ms: 0.19191
  type: 'test'
  ...
# Subtest: visible product version matches canonical beta metadata
ok 408 - visible product version matches canonical beta metadata
  ---
  duration_ms: 0.725376
  type: 'test'
  ...
# Subtest: I1 runtime registers the worker after load and fails open
ok 409 - I1 runtime registers the worker after load and fails open
  ---
  duration_ms: 0.985979
  type: 'test'
  ...
# Subtest: I1 service-worker cache is build-versioned and self-cleans
ok 410 - I1 service-worker cache is build-versioned and self-cleans
  ---
  duration_ms: 0.191069
  type: 'test'
  ...
# Subtest: I1 navigation is network-first with bounded static fallback
ok 411 - I1 navigation is network-first with bounded static fallback
  ---
  duration_ms: 0.249828
  type: 'test'
  ...
# Subtest: I1 does not introduce gameplay or entity authority into PWA delivery
ok 412 - I1 does not introduce gameplay or entity authority into PWA delivery
  ---
  duration_ms: 0.189116
  type: 'test'
  ...
# Subtest: live game imports the persisted run archive entry contract
ok 413 - live game imports the persisted run archive entry contract
  ---
  duration_ms: 1.066642
  type: 'test'
  ...
# Subtest: run peak swarm telemetry is explicit and reset for every new run
ok 414 - run peak swarm telemetry is explicit and reset for every new run
  ---
  duration_ms: 0.335136
  type: 'test'
  ...
# Subtest: peak swarm helper is non-recursive and samples Foton plus followers
ok 415 - peak swarm helper is non-recursive and samples Foton plus followers
  ---
  duration_ms: 0.175495
  type: 'test'
  ...
# Subtest: ordinary recruits and the canonical affinity fusion path update the peak immediately
ok 416 - ordinary recruits and the canonical affinity fusion path update the peak immediately
  ---
  duration_ms: 0.33739
  type: 'test'
  ...
# Subtest: normal simulation accumulates actual dwell time for the active runtime formation
ok 417 - normal simulation accumulates actual dwell time for the active runtime formation
  ---
  duration_ms: 0.682601
  type: 'test'
  ...
# Subtest: most-used formation reads the accumulated duration ledger
ok 418 - most-used formation reads the accumulated duration ledger
  ---
  duration_ms: 0.261645
  type: 'test'
  ...
# Subtest: dominant affinity telemetry covers all six playable affinities
ok 419 - dominant affinity telemetry covers all six playable affinities
  ---
  duration_ms: 0.271951
  type: 'test'
  ...
# Subtest: campaign checkpoint and final persistence both use the true run peak
ok 420 - campaign checkpoint and final persistence both use the true run peak
  ---
  duration_ms: 0.219832
  type: 'test'
  ...
# Subtest: final archive uses the same stable run identity as campaign-to-Infinite handoff
ok 421 - final archive uses the same stable run identity as campaign-to-Infinite handoff
  ---
  duration_ms: 0.336969
  type: 'test'
  ...
# Subtest: final archive completion timestamp and duration come from the run end boundary
ok 422 - final archive completion timestamp and duration come from the run end boundary
  ---
  duration_ms: 0.571824
  type: 'test'
  ...
# Subtest: a run that cleared campaign remains CAMPAIGN_CLEARED even if it later ends in Infinite
ok 423 - a run that cleared campaign remains CAMPAIGN_CLEARED even if it later ends in Infinite
  ---
  duration_ms: 0.206953
  type: 'test'
  ...
# Subtest: archive campaign reach stays bounded to the handcrafted campaign
ok 424 - archive campaign reach stays bounded to the handcrafted campaign
  ---
  duration_ms: 0.168104
  type: 'test'
  ...
# Subtest: Infinite coordinates are attached only from an active Infinite runtime
ok 425 - Infinite coordinates are attached only from an active Infinite runtime
  ---
  duration_ms: 0.277069
  type: 'test'
  ...
# Subtest: final archive captures build, affinity, formation and corrected peak telemetry
ok 426 - final archive captures build, affinity, formation and corrected peak telemetry
  ---
  duration_ms: 0.232031
  type: 'test'
  ...
# Subtest: campaign-to-Infinite handoff remains checkpoint-only and archive-neutral
ok 427 - campaign-to-Infinite handoff remains checkpoint-only and archive-neutral
  ---
  duration_ms: 0.195996
  type: 'test'
  ...
# Subtest: ResultScreen now reports the true run peak instead of the last sampled swarm state
ok 428 - ResultScreen now reports the true run peak instead of the last sampled swarm state
  ---
  duration_ms: 0.260464
  type: 'test'
  ...
# Subtest: Flight Recorder consumes the persisted RunArchiveEntry contract read-only
ok 429 - Flight Recorder consumes the persisted RunArchiveEntry contract read-only
  ---
  duration_ms: 1.18508
  type: 'test'
  ...
# Subtest: Flight Recorder renders only a bounded recent subset
ok 430 - Flight Recorder renders only a bounded recent subset
  ---
  duration_ms: 0.219441
  type: 'test'
  ...
# Subtest: Flight Recorder exposes a non-blocking bilingual empty state
ok 431 - Flight Recorder exposes a non-blocking bilingual empty state
  ---
  duration_ms: 0.162015
  type: 'test'
  ...
# Subtest: Flight Recorder distinguishes campaign clear from defeat
ok 432 - Flight Recorder distinguishes campaign clear from defeat
  ---
  duration_ms: 0.161254
  type: 'test'
  ...
# Subtest: Flight Recorder prefers Infinite reach when the archived run reached Infinite
ok 433 - Flight Recorder prefers Infinite reach when the archived run reached Infinite
  ---
  duration_ms: 0.226902
  type: 'test'
  ...
# Subtest: Flight Recorder exposes score duration peak affinity formation and build
ok 434 - Flight Recorder exposes score duration peak affinity formation and build
  ---
  duration_ms: 0.214865
  type: 'test'
  ...
# Subtest: temporary build preview is limited to three chips with overflow count
ok 435 - temporary build preview is limited to three chips with overflow count
  ---
  duration_ms: 0.217018
  type: 'test'
  ...
# Subtest: archive rows retain stable run identity in the DOM
ok 436 - archive rows retain stable run identity in the DOM
  ---
  duration_ms: 0.131589
  type: 'test'
  ...
# Subtest: StartScreen MAIN surfaces the three newest persisted runs
ok 437 - StartScreen MAIN surfaces the three newest persisted runs
  ---
  duration_ms: 0.388957
  type: 'test'
  ...
# Subtest: ResultScreen accepts the archive as an optional compatibility prop
ok 438 - ResultScreen accepts the archive as an optional compatibility prop
  ---
  duration_ms: 0.597914
  type: 'test'
  ...
# Subtest: EnergySwarmGame passes the canonical persisted archive into ResultScreen
ok 439 - EnergySwarmGame passes the canonical persisted archive into ResultScreen
  ---
  duration_ms: 0.177859
  type: 'test'
  ...
# Subtest: Flight Recorder is presentation-only and does not mutate gameplay or archive data
ok 440 - Flight Recorder is presentation-only and does not mutate gameplay or archive data
  ---
  duration_ms: 0.170268
  type: 'test'
  ...
# Subtest: default profile exposes an empty recent run archive
ok 441 - default profile exposes an empty recent run archive
  ---
  duration_ms: 1.506346
  type: 'test'
  ...
# Subtest: final run commit archives one normalized completed run
ok 442 - final run commit archives one normalized completed run
  ---
  duration_ms: 1.728451
  type: 'test'
  ...
# Subtest: campaign checkpoint never archives a still-running session
ok 443 - campaign checkpoint never archives a still-running session
  ---
  duration_ms: 0.364892
  type: 'test'
  ...
# Subtest: same ledger cannot append the same run twice
ok 444 - same ledger cannot append the same run twice
  ---
  duration_ms: 0.270279
  type: 'test'
  ...
# Subtest: duplicate runId stays idempotent even with a fresh ledger
ok 445 - duplicate runId stays idempotent even with a fresh ledger
  ---
  duration_ms: 0.465834
  type: 'test'
  ...
# Subtest: archive stays bounded to the eight most recent unique runs
ok 446 - archive stays bounded to the eight most recent unique runs
  ---
  duration_ms: 0.84064
  type: 'test'
  ...
# Subtest: storage sanitizer drops invalid entries and normalizes unsafe fields
ok 447 - storage sanitizer drops invalid entries and normalizes unsafe fields
  ---
  duration_ms: 0.37722
  type: 'test'
  ...
# Subtest: storage sanitizer deduplicates by newest persisted occurrence
ok 448 - storage sanitizer deduplicates by newest persisted occurrence
  ---
  duration_ms: 0.191169
  type: 'test'
  ...
# Subtest: malformed final archive payload fails closed without consuming archive gate
ok 449 - malformed final archive payload fails closed without consuming archive gate
  ---
  duration_ms: 0.33091
  type: 'test'
  ...
# Subtest: archive write leaves existing campaign and Infinite counters semantically intact
ok 450 - archive write leaves existing campaign and Infinite counters semantically intact
  ---
  duration_ms: 0.493646
  type: 'test'
  ...
# Subtest: existing premium and boss reduced-motion foundations remain present
ok 451 - existing premium and boss reduced-motion foundations remain present
  ---
  duration_ms: 1.719999
  type: 'test'
  ...
# Subtest: shell utility animations become static under reduced motion
ok 452 - shell utility animations become static under reduced motion
  ---
  duration_ms: 0.140923
  type: 'test'
  ...
# Subtest: the covered UI actually uses Tailwind animation utilities
ok 453 - the covered UI actually uses Tailwind animation utilities
  ---
  duration_ms: 0.803234
  type: 'test'
  ...
# Subtest: utility and custom UI transitions become effectively immediate
ok 454 - utility and custom UI transitions become effectively immediate
  ---
  duration_ms: 0.154283
  type: 'test'
  ...
# Subtest: reduced-motion contract keeps state visibility rather than hiding controls
ok 455 - reduced-motion contract keeps state visibility rather than hiding controls
  ---
  duration_ms: 0.217819
  type: 'test'
  ...
# Subtest: ES-10A does not target Canvas or alter game-world simulation
ok 456 - ES-10A does not target Canvas or alter game-world simulation
  ---
  duration_ms: 0.156857
  type: 'test'
  ...
# Subtest: reduced motion also disables smooth scrolling for focus navigation
ok 457 - reduced motion also disables smooth scrolling for focus navigation
  ---
  duration_ms: 0.1982
  type: 'test'
  ...
# Subtest: spatial thermal splash target set and order match legacy full scan
ok 458 - spatial thermal splash target set and order match legacy full scan
  ---
  duration_ms: 18.622239
  type: 'test'
  ...
# Subtest: thermal splash keeps strict radius semantics
ok 459 - thermal splash keeps strict radius semantics
  ---
  duration_ms: 0.234714
  type: 'test'
  ...
# Subtest: a minion inserted after splash query is not retroactively part of that same snapshot
ok 460 - a minion inserted after splash query is not retroactively part of that same snapshot
  ---
  duration_ms: 0.369708
  type: 'test'
  ...
# Subtest: live enemy firing counts hostile projectiles once before the enemy pass
ok 461 - live enemy firing counts hostile projectiles once before the enemy pass
  ---
  duration_ms: 1.736153
  type: 'test'
  ...
# Subtest: shootFromEnemy no longer filters the projectile array per Drone and updates local count after emission
ok 462 - shootFromEnemy no longer filters the projectile array per Drone and updates local count after emission
  ---
  duration_ms: 1.565936
  type: 'test'
  ...
# Subtest: live profile-driven splash uses indexed candidates in original enemy order without sqrt
ok 463 - live profile-driven splash uses indexed candidates in original enemy order without sqrt
  ---
  duration_ms: 1.401127
  type: 'test'
  ...
# Subtest: result screen distinguishes persistent progression from run-only build state
ok 464 - result screen distinguishes persistent progression from run-only build state
  ---
  duration_ms: 1.177113
  type: 'test'
  ...
# Subtest: persistence summary names saved credits, records and boss data
ok 465 - persistence summary names saved credits, records and boss data
  ---
  duration_ms: 0.184879
  type: 'test'
  ...
# Subtest: run-only summary makes tactical upgrade reset explicit
ok 466 - run-only summary makes tactical upgrade reset explicit
  ---
  duration_ms: 0.154323
  type: 'test'
  ...
# Subtest: run Nano Credits use a dedicated earned counter
ok 467 - run Nano Credits use a dedicated earned counter
  ---
  duration_ms: 0.879799
  type: 'test'
  ...
# Subtest: actual NANO awards increment both balance and earned telemetry
ok 468 - actual NANO awards increment both balance and earned telemetry
  ---
  duration_ms: 0.455869
  type: 'test'
  ...
# Subtest: result screen receives the real earned amount instead of score-derived fiction
ok 469 - result screen receives the real earned amount instead of score-derived fiction
  ---
  duration_ms: 0.45005
  type: 'test'
  ...
# Subtest: campaign victory checkpoint counts the run and victory exactly once
ok 470 - campaign victory checkpoint counts the run and victory exactly once
  ---
  duration_ms: 1.156037
  type: 'test'
  ...
# Subtest: campaign checkpoint persists boss records and current permanent balance
ok 471 - campaign checkpoint persists boss records and current permanent balance
  ---
  duration_ms: 0.747339
  type: 'test'
  ...
# Subtest: campaign checkpoint deliberately does not accumulate run telemetry
ok 472 - campaign checkpoint deliberately does not accumulate run telemetry
  ---
  duration_ms: 0.200202
  type: 'test'
  ...
# Subtest: reapplying a campaign checkpoint with its ledger is count-idempotent
ok 473 - reapplying a campaign checkpoint with its ledger is count-idempotent
  ---
  duration_ms: 0.273283
  type: 'test'
  ...
# Subtest: final run commit after campaign checkpoint adds telemetry once without recounting run or victory
ok 474 - final run commit after campaign checkpoint adds telemetry once without recounting run or victory
  ---
  duration_ms: 0.41691
  type: 'test'
  ...
# Subtest: reapplying final commit with its ledger never duplicates telemetry
ok 475 - reapplying final commit with its ledger never duplicates telemetry
  ---
  duration_ms: 0.212241
  type: 'test'
  ...
# Subtest: pre-boss defeat still counts one run and one telemetry commit without victory
ok 476 - pre-boss defeat still counts one run and one telemetry commit without victory
  ---
  duration_ms: 0.234905
  type: 'test'
  ...
# Subtest: untouched profile preferences and discovery fields survive both transitions
ok 477 - untouched profile preferences and discovery fields survive both transitions
  ---
  duration_ms: 0.242636
  type: 'test'
  ...
# Subtest: run counters use dedicated refs instead of mutating persistent stats
ok 478 - run counters use dedicated refs instead of mutating persistent stats
  ---
  duration_ms: 1.063737
  type: 'test'
  ...
# Subtest: new runs reset telemetry refs explicitly
ok 479 - new runs reset telemetry refs explicitly
  ---
  duration_ms: 0.163056
  type: 'test'
  ...
# Subtest: persistent totals accumulate from run-local counters exactly once
ok 480 - persistent totals accumulate from run-local counters exactly once
  ---
  duration_ms: 0.273203
  type: 'test'
  ...
# Subtest: result screen reads the completed run counter
ok 481 - result screen reads the completed run counter
  ---
  duration_ms: 0.139491
  type: 'test'
  ...
# Subtest: live runtime imports and owns the Devourer rematch gate
ok 482 - live runtime imports and owns the Devourer rematch gate
  ---
  duration_ms: 1.056336
  type: 'test'
  ...
# Subtest: new runs and campaign handoff reset rematch gate state
ok 483 - new runs and campaign handoff reset rematch gate state
  ---
  duration_ms: 0.357309
  type: 'test'
  ...
# Subtest: wave completion is blocked until a BOSS_REMATCH gate is resolved
ok 484 - wave completion is blocked until a BOSS_REMATCH gate is resolved
  ---
  duration_ms: 0.367986
  type: 'test'
  ...
# Subtest: eligible Infinite boss gets an identity-driven warning then spawns through the existing boss engine
ok 485 - eligible Infinite boss gets an identity-driven warning then spawns through the existing boss engine
  ---
  duration_ms: 0.170598
  type: 'test'
  ...
# Subtest: campaign boss activation still calls the unscaled spawn path
ok 486 - campaign boss activation still calls the unscaled spawn path
  ---
  duration_ms: 0.271099
  type: 'test'
  ...
# Subtest: rematch boss owns isolated scaled metadata while campaign attempts stay behind !isRematch
ok 487 - rematch boss owns isolated scaled metadata while campaign attempts stay behind !isRematch
  ---
  duration_ms: 0.453315
  type: 'test'
  ...
# Subtest: rematch attack-rate scaling changes cooldown frequency without shortening telegraphs
ok 488 - rematch attack-rate scaling changes cooldown frequency without shortening telegraphs
  ---
  duration_ms: 0.378542
  type: 'test'
  ...
# Subtest: rematch boss damage scales through the shared boss-damage path but campaign hit telemetry is isolated
ok 489 - rematch boss damage scales through the shared boss-damage path but campaign hit telemetry is isolated
  ---
  duration_ms: 0.340635
  type: 'test'
  ...
# Subtest: campaign boss damage/phase telemetry ignores rematch instances
ok 490 - campaign boss damage/phase telemetry ignores rematch instances
  ---
  duration_ms: 1.878067
  type: 'test'
  ...
# Subtest: rematch defeat resolves the gate and resumes Infinite Swarm without campaign checkpoint handoff
ok 491 - rematch defeat resolves the gate and resumes Infinite Swarm without campaign checkpoint handoff
  ---
  duration_ms: 0.499595
  type: 'test'
  ...
# Subtest: campaign boss defeat still owns the original campaign-to-infinite handoff
ok 492 - campaign boss defeat still owns the original campaign-to-infinite handoff
  ---
  duration_ms: 0.191289
  type: 'test'
  ...
# Subtest: rematch enemy metadata is explicitly represented in Enemy
ok 493 - rematch enemy metadata is explicitly represented in Enemy
  ---
  duration_ms: 0.168084
  type: 'test'
  ...
# Subtest: non-rematch profiles fail closed to IDLE
ok 494 - non-rematch profiles fail closed to IDLE
  ---
  duration_ms: 1.528549
  type: 'test'
  ...
# Subtest: descriptor changes reset the rematch lifecycle
ok 495 - descriptor changes reset the rematch lifecycle
  ---
  duration_ms: 0.206693
  type: 'test'
  ...
# Subtest: rematch eligibility requires full budget and a clean regular field
ok 496 - rematch eligibility requires full budget and a clean regular field
  ---
  duration_ms: 0.170147
  type: 'test'
  ...
# Subtest: eligible rematch starts exactly one telegraph
ok 497 - eligible rematch starts exactly one telegraph
  ---
  duration_ms: 0.211429
  type: 'test'
  ...
# Subtest: telegraph advances deterministically to READY
ok 498 - telegraph advances deterministically to READY
  ---
  duration_ms: 0.289197
  type: 'test'
  ...
# Subtest: READY may spawn exactly once and SPAWNED never re-requests
ok 499 - READY may spawn exactly once and SPAWNED never re-requests
  ---
  duration_ms: 0.197989
  type: 'test'
  ...
# Subtest: defeat is explicit, idempotent and resolves the milestone
ok 500 - defeat is explicit, idempotent and resolves the milestone
  ---
  duration_ms: 0.187423
  type: 'test'
  ...
# Subtest: ordinary waves are always resolved from the rematch perspective
ok 501 - ordinary waves are always resolved from the rematch perspective
  ---
  duration_ms: 0.134693
  type: 'test'
  ...
# Subtest: game imports the refresh-rate cadence contract
ok 502 - game imports the refresh-rate cadence contract
  ---
  duration_ms: 0.948112
  type: 'test'
  ...
# Subtest: React HUD sync is elapsed-time based instead of every ten rendered frames
ok 503 - React HUD sync is elapsed-time based instead of every ten rendered frames
  ---
  duration_ms: 0.413265
  type: 'test'
  ...
# Subtest: all frame-counted flash decay paths are delta-aware
ok 504 - all frame-counted flash decay paths are delta-aware
  ---
  duration_ms: 0.483731
  type: 'test'
  ...
# Subtest: screen shake and swarm recoil damping are delta-normalized
ok 505 - screen shake and swarm recoil damping are delta-normalized
  ---
  duration_ms: 0.372433
  type: 'test'
  ...
# Subtest: only audited per-frame cosmetic probabilities use delta-aware projection
ok 506 - only audited per-frame cosmetic probabilities use delta-aware projection
  ---
  duration_ms: 0.419563
  type: 'test'
  ...
# Subtest: gameplay probability rolls remain raw and semantically unchanged
ok 507 - gameplay probability rolls remain raw and semantically unchanged
  ---
  duration_ms: 0.426564
  type: 'test'
  ...
# Subtest: large-delta safety clamp remains intact
ok 508 - large-delta safety clamp remains intact
  ---
  duration_ms: 0.143077
  type: 'test'
  ...
# Subtest: historical 60 Hz baseline maps to exactly one frame unit
ok 509 - historical 60 Hz baseline maps to exactly one frame unit
  ---
  duration_ms: 0.897906
  type: 'test'
  ...
# Subtest: 90 and 120 Hz frame units scale by elapsed time
ok 510 - 90 and 120 Hz frame units scale by elapsed time
  ---
  duration_ms: 0.20525
  type: 'test'
  ...
# Subtest: frame tick decay preserves real-time duration across 60/90/120 Hz
ok 511 - frame tick decay preserves real-time duration across 60/90/120 Hz
  ---
  duration_ms: 0.162124
  type: 'test'
  ...
# Subtest: delta-aware damping preserves the 60 Hz multiplier over equal real time
ok 512 - delta-aware damping preserves the 60 Hz multiplier over equal real time
  ---
  duration_ms: 0.155155
  type: 'test'
  ...
# Subtest: delta-aware probability preserves the historical event probability over equal real time
ok 513 - delta-aware probability preserves the historical event probability over equal real time
  ---
  duration_ms: 0.181264
  type: 'test'
  ...
# Subtest: HUD cadence flushes at the same real-time interval at 60/90/120 Hz
ok 514 - HUD cadence flushes at the same real-time interval at 60/90/120 Hz
  ---
  duration_ms: 0.267675
  type: 'test'
  ...
# Subtest: cadence helpers fail safe for malformed inputs
ok 515 - cadence helpers fail safe for malformed inputs
  ---
  duration_ms: 0.194273
  type: 'test'
  ...
# Subtest: EnergySwarmGame consumes certified mutator projection and effective budget through the runtime bundle
ok 516 - EnergySwarmGame consumes certified mutator projection and effective budget through the runtime bundle
  ---
  duration_ms: 0.987632
  type: 'test'
  ...
# Subtest: DOUBLE_THREAT completion and spawning share one effective enemy budget
ok 517 - DOUBLE_THREAT completion and spawning share one effective enemy budget
  ---
  duration_ms: 0.606947
  type: 'test'
  ...
# Subtest: ACCELERATED_ENEMIES multiplies regular spawn speed and elite dash speed
ok 518 - ACCELERATED_ENEMIES multiplies regular spawn speed and elite dash speed
  ---
  duration_ms: 0.428387
  type: 'test'
  ...
# Subtest: REGENERATIVE_ENEMIES heals only living non-boss enemies and caps at maxHealth
ok 519 - REGENERATIVE_ENEMIES heals only living non-boss enemies and caps at maxHealth
  ---
  duration_ms: 3.97102
  type: 'test'
  ...
# Subtest: FRAGILE_SWARM amplifies regular projectile/contact damage but not the Devourer path
ok 520 - FRAGILE_SWARM amplifies regular projectile/contact damage but not the Devourer path
  ---
  duration_ms: 0.335547
  type: 'test'
  ...
# Subtest: FORMATION_DISRUPTION only reduces cohesion while a wave is active
ok 521 - FORMATION_DISRUPTION only reduces cohesion while a wave is active
  ---
  duration_ms: 5.941737
  type: 'test'
  ...
# Subtest: ELITE_BURST adds a bounded elite chance bonus
ok 522 - ELITE_BURST adds a bounded elite chance bonus
  ---
  duration_ms: 0.305622
  type: 'test'
  ...
# Subtest: split minions inherit accelerated movement only in Infinite Swarm
ok 523 - split minions inherit accelerated movement only in Infinite Swarm
  ---
  duration_ms: 0.303388
  type: 'test'
  ...
# Subtest: campaign boss spawn remains outside mutator scaling
ok 524 - campaign boss spawn remains outside mutator scaling
  ---
  duration_ms: 0.473335
  type: 'test'
  ...
# Subtest: live runtime consumes the certified combat-pressure projection through the runtime bundle
ok 525 - live runtime consumes the certified combat-pressure projection through the runtime bundle
  ---
  duration_ms: 1.984688
  type: 'test'
  ...
# Subtest: regular enemy spawn adopts projected health and movement without direct pressure math
ok 526 - regular enemy spawn adopts projected health and movement without direct pressure math
  ---
  duration_ms: 0.358972
  type: 'test'
  ...
# Subtest: spawn safety adopts fairness without weakening the legacy 150-unit floor
ok 527 - spawn safety adopts fairness without weakening the legacy 150-unit floor
  ---
  duration_ms: 0.353223
  type: 'test'
  ...
# Subtest: hostile projectile creation obeys the projected fairness budget
ok 528 - hostile projectile creation obeys the projected fairness budget
  ---
  duration_ms: 0.262787
  type: 'test'
  ...
# Subtest: non-boss contact damage uses projected pressure while Devourer damage remains untouched
ok 529 - non-boss contact damage uses projected pressure while Devourer damage remains untouched
  ---
  duration_ms: 0.290439
  type: 'test'
  ...
# Subtest: split minions scale only after the runtime enters Infinite Swarm
ok 530 - split minions scale only after the runtime enters Infinite Swarm
  ---
  duration_ms: 0.237168
  type: 'test'
  ...
# Subtest: enemy attack timer consumes projected attack-rate pressure
ok 531 - enemy attack timer consumes projected attack-rate pressure
  ---
  duration_ms: 0.300284
  type: 'test'
  ...
# Subtest: Nano pickup value adopts infinite reward pressure while retaining the existing biome multiplier
ok 532 - Nano pickup value adopts infinite reward pressure while retaining the existing biome multiplier
  ---
  duration_ms: 0.210989
  type: 'test'
  ...
# Subtest: boss runtime is excluded from the new pressure-scaling paths
ok 533 - boss runtime is excluded from the new pressure-scaling paths
  ---
  duration_ms: 0.361717
  type: 'test'
  ...
# Subtest: campaign projection preserves the legacy health curve and leaves all new combat axes neutral
ok 534 - campaign projection preserves the legacy health curve and leaves all new combat axes neutral
  ---
  duration_ms: 1.279103
  type: 'test'
  ...
# Subtest: infinite projection maps certified pressure and reward axes directly
ok 535 - infinite projection maps certified pressure and reward axes directly
  ---
  duration_ms: 2.5015
  type: 'test'
  ...
# Subtest: infinite pressure projection remains finite and bounded through Sector 1000
ok 536 - infinite pressure projection remains finite and bounded through Sector 1000
  ---
  duration_ms: 120.867008
  type: 'test'
  ...
# Subtest: EnergySwarmGame imports the certified runtime completion evaluator
ok 537 - EnergySwarmGame imports the certified runtime completion evaluator
  ---
  duration_ms: 0.849133
  type: 'test'
  ...
# Subtest: wave transitions tick time only through the completion policy contract
ok 538 - wave transitions tick time only through the completion policy contract
  ---
  duration_ms: 0.488879
  type: 'test'
  ...
# Subtest: runtime completion snapshot excludes dead enemies and the campaign boss
ok 539 - runtime completion snapshot excludes dead enemies and the campaign boss
  ---
  duration_ms: 0.232491
  type: 'test'
  ...
# Subtest: WaveConfig presentation lookup is guarded to campaign mode
ok 540 - WaveConfig presentation lookup is guarded to campaign mode
  ---
  duration_ms: 0.255676
  type: 'test'
  ...
# Subtest: Devourer victory now hands off after the existing cinematic
ok 541 - Devourer victory now hands off after the existing cinematic
  ---
  duration_ms: 0.162355
  type: 'test'
  ...
# Subtest: campaign TIMEBOX completion preserves timer semantics
ok 542 - campaign TIMEBOX completion preserves timer semantics
  ---
  duration_ms: 1.05184
  type: 'test'
  ...
# Subtest: campaign boss completion depends only on boss defeat
ok 543 - campaign boss completion depends only on boss defeat
  ---
  duration_ms: 0.208646
  type: 'test'
  ...
# Subtest: infinite BUDGET_AND_CLEAR waits for full budget and a cleared arena
ok 544 - infinite BUDGET_AND_CLEAR waits for full budget and a cleared arena
  ---
  duration_ms: 2.769864
  type: 'test'
  ...
# Subtest: budget completion normalizes malformed negative and non-finite counters safely
ok 545 - budget completion normalizes malformed negative and non-finite counters safely
  ---
  duration_ms: 0.521348
  type: 'test'
  ...
# Subtest: game root exposes auxiliary deck mode from the certified runtime profile
ok 546 - game root exposes auxiliary deck mode from the certified runtime profile
  ---
  duration_ms: 1.036486
  type: 'test'
  ...
# Subtest: STACKED profile keeps battlefield primary and decks full-width below it
ok 547 - STACKED profile keeps battlefield primary and decks full-width below it
  ---
  duration_ms: 1.428167
  type: 'test'
  ...
# Subtest: SPLIT profile reserves a full-width battlefield row with two secondary decks
ok 548 - SPLIT profile reserves a full-width battlefield row with two secondary decks
  ---
  duration_ms: 0.698646
  type: 'test'
  ...
# Subtest: RAILS profile preserves left-battlefield-right desktop composition and collapsed rails
ok 549 - RAILS profile preserves left-battlefield-right desktop composition and collapsed rails
  ---
  duration_ms: 2.033192
  type: 'test'
  ...
# Subtest: short-landscape profile bounds auxiliary content independently of deck mode
ok 550 - short-landscape profile bounds auxiliary content independently of deck mode
  ---
  duration_ms: 0.512254
  type: 'test'
  ...
# Subtest: media-query fallbacks remain present for no-JS progressive enhancement
ok 551 - media-query fallbacks remain present for no-JS progressive enhancement
  ---
  duration_ms: 0.510261
  type: 'test'
  ...
# Subtest: Eclipse activates only for Infinite Reduced Visibility and reuses H6 visibility
ok 552 - Eclipse activates only for Infinite Reduced Visibility and reuses H6 visibility
  ---
  duration_ms: 4.874554
  type: 'test'
  ...
# Subtest: Campaign remains neutral even when descriptor modifiers mimic Reduced Visibility
ok 553 - Campaign remains neutral even when descriptor modifiers mimic Reduced Visibility
  ---
  duration_ms: 0.29808
  type: 'test'
  ...
# Subtest: Eclipse dampens only solar-affinity cooldown recovery
ok 554 - Eclipse dampens only solar-affinity cooldown recovery
  ---
  duration_ms: 0.830986
  type: 'test'
  ...
# Subtest: Eclipse accelerates only PARASITE movement
ok 555 - Eclipse accelerates only PARASITE movement
  ---
  duration_ms: 0.604744
  type: 'test'
  ...
# Subtest: Eclipse helpers fail neutral outside the event
ok 556 - Eclipse helpers fail neutral outside the event
  ---
  duration_ms: 0.361707
  type: 'test'
  ...
# Subtest: EnergySwarmGame adopts the certified electrical-storm scheduler
ok 557 - EnergySwarmGame adopts the certified electrical-storm scheduler
  ---
  duration_ms: 1.114233
  type: 'test'
  ...
# Subtest: new runs reset electrical storm state
ok 558 - new runs reset electrical storm state
  ---
  duration_ms: 0.274565
  type: 'test'
  ...
# Subtest: storm scheduler is enabled only for active non-boss Infinite waves
ok 559 - storm scheduler is enabled only for active non-boss Infinite waves
  ---
  duration_ms: 0.502359
  type: 'test'
  ...
# Subtest: telegraph captures target feedback before any strike
ok 560 - telegraph captures target feedback before any strike
  ---
  duration_ms: 0.249106
  type: 'test'
  ...
# Subtest: storm damage requires player to remain inside the locked visible radius
ok 561 - storm damage requires player to remain inside the locked visible radius
  ---
  duration_ms: 0.675781
  type: 'test'
  ...
# Subtest: storm strike reuses existing visual/audio feedback instead of bypassing the engine
ok 562 - storm strike reuses existing visual/audio feedback instead of bypassing the engine
  ---
  duration_ms: 0.196337
  type: 'test'
  ...
# Subtest: electrical telegraph renders above reduced-visibility fog and before tactical radar
ok 563 - electrical telegraph renders above reduced-visibility fog and before tactical radar
  ---
  duration_ms: 0.340294
  type: 'test'
  ...
# Subtest: campaign Devourer spawn remains outside storm scheduling
ok 564 - campaign Devourer spawn remains outside storm scheduling
  ---
  duration_ms: 0.184018
  type: 'test'
  ...
# Subtest: storm config is absent for neutral effects
ok 565 - storm config is absent for neutral effects
  ---
  duration_ms: 0.85328
  type: 'test'
  ...
# Subtest: storm config honors fairness telegraph floor and bounded damage cadence
ok 566 - storm config honors fairness telegraph floor and bounded damage cadence
  ---
  duration_ms: 0.254976
  type: 'test'
  ...
# Subtest: storm begins with grace cooldown instead of instant telegraph or damage
ok 567 - storm begins with grace cooldown instead of instant telegraph or damage
  ---
  duration_ms: 0.234334
  type: 'test'
  ...
# Subtest: telegraph locks target before impact
ok 568 - telegraph locks target before impact
  ---
  duration_ms: 0.832417
  type: 'test'
  ...
# Subtest: strike returns to cooldown and increments serial once
ok 569 - strike returns to cooldown and increments serial once
  ---
  duration_ms: 0.170378
  type: 'test'
  ...
# Subtest: removing storm config resets scheduler immediately
ok 570 - removing storm config resets scheduler immediately
  ---
  duration_ms: 0.14568
  type: 'test'
  ...
# Subtest: live runtime imports the certified evolved-enemy resolver
ok 571 - live runtime imports the certified evolved-enemy resolver
  ---
  duration_ms: 1.064388
  type: 'test'
  ...
# Subtest: spawn resolves evolution from descriptor type wave ordinal and living evolved count
ok 572 - spawn resolves evolution from descriptor type wave ordinal and living evolved count
  ---
  duration_ms: 0.621199
  type: 'test'
  ...
# Subtest: milestone minibosses fail closed before evolved selection
ok 573 - milestone minibosses fail closed before evolved selection
  ---
  duration_ms: 0.397741
  type: 'test'
  ...
# Subtest: existing pressure and mutator scaling are established before evolved stat multipliers
ok 574 - existing pressure and mutator scaling are established before evolved stat multipliers
  ---
  duration_ms: 0.19185
  type: 'test'
  ...
# Subtest: evolved enemies cannot stack the random elite multiplier
ok 575 - evolved enemies cannot stack the random elite multiplier
  ---
  duration_ms: 0.250779
  type: 'test'
  ...
# Subtest: evolved instance metadata carries only bounded profile outputs
ok 576 - evolved instance metadata carries only bounded profile outputs
  ---
  duration_ms: 0.281115
  type: 'test'
  ...
# Subtest: per-enemy evolved attack rate multiplies the existing runtime pressure timer
ok 577 - per-enemy evolved attack rate multiplies the existing runtime pressure timer
  ---
  duration_ms: 0.35072
  type: 'test'
  ...
# Subtest: enemy projectile speed adopts per-instance evolution without changing boss defaults
ok 578 - enemy projectile speed adopts per-instance evolution without changing boss defaults
  ---
  duration_ms: 0.365121
  type: 'test'
  ...
# Subtest: contact damage combines pressure mutator milestone and evolved instance multipliers
ok 579 - contact damage combines pressure mutator milestone and evolved instance multipliers
  ---
  duration_ms: 0.478513
  type: 'test'
  ...
# Subtest: score reward composes milestone and evolved multipliers in one helper
not ok 580 - score reward composes milestone and evolved multipliers in one helper
  ---
  duration_ms: 2.944278
  type: 'test'
  location: '/home/runner/work/orbi-energy.swarm/orbi-energy.swarm/tests/runtime-enemy-evolution-adoption.test.ts:1:4960'
  failureType: 'testCodeFailure'
  error: |-
    direct and splash kills must share evolved-aware rewards
    
    0 !== 2
    
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected: 2
  actual: 0
  operator: 'strictEqual'
  stack: |-
    TestContext.<anonymous> (/home/runner/work/orbi-energy.swarm/orbi-energy.swarm/tests/runtime-enemy-evolution-adoption.test.ts:249:10)
    Test.runInAsyncScope (node:async_hooks:214:14)
    Test.run (node:internal/test_runner/test:1047:25)
    Test.processPendingSubtests (node:internal/test_runner/test:744:18)
    Test.postRun (node:internal/test_runner/test:1173:19)
    Test.run (node:internal/test_runner/test:1101:12)
    async Test.processPendingSubtests (node:internal/test_runner/test:744:7)
  ...
# Subtest: split minions remain ordinary and never resolve evolved variants
ok 581 - split minions remain ordinary and never resolve evolved variants
  ---
  duration_ms: 0.294375
  type: 'test'
  ...
# Subtest: campaign and Devourer spawn paths contain no direct evolved override
ok 582 - campaign and Devourer spawn paths contain no direct evolved override
  ---
  duration_ms: 0.29113
  type: 'test'
  ...
# Subtest: Canvas renders a bounded identity marker only for evolved instances
ok 583 - Canvas renders a bounded identity marker only for evolved instances
  ---
  duration_ms: 0.149386
  type: 'test'
  ...
# Subtest: live signature adoption remains contract-driven without duplicated signature IDs
ok 584 - live signature adoption remains contract-driven without duplicated signature IDs
  ---
  duration_ms: 0.235136
  type: 'test'
  ...
# Subtest: campaign descriptors never enable evolved enemies
ok 585 - campaign descriptors never enable evolved enemies
  ---
  duration_ms: 2.121064
  type: 'test'
  ...
# Subtest: Infinite Mastery Sectors 11-25 introduce one bounded evolved threat
ok 586 - Infinite Mastery Sectors 11-25 introduce one bounded evolved threat
  ---
  duration_ms: 3.788554
  type: 'test'
  ...
# Subtest: tier policy escalates bounded evolution after Mastery
ok 587 - tier policy escalates bounded evolution after Mastery
  ---
  duration_ms: 0.890506
  type: 'test'
  ...
# Subtest: variant identities are explicit and exclude milestone/boss enemy classes
ok 588 - variant identities are explicit and exclude milestone/boss enemy classes
  ---
  duration_ms: 2.38298
  type: 'test'
  ...
# Subtest: selection is deterministic from descriptor seed identity enemy type and spawn ordinal
ok 589 - selection is deterministic from descriptor seed identity enemy type and spawn ordinal
  ---
  duration_ms: 4.344073
  type: 'test'
  ...
# Subtest: malformed spawn ordinals and active-evolved counts fail closed
ok 590 - malformed spawn ordinals and active-evolved counts fail closed
  ---
  duration_ms: 0.54921
  type: 'test'
  ...
# Subtest: concurrency budget blocks otherwise eligible evolved spawns
ok 591 - concurrency budget blocks otherwise eligible evolved spawns
  ---
  duration_ms: 0.486434
  type: 'test'
  ...
# Subtest: evolved profiles remain finite and conservatively bounded
ok 592 - evolved profiles remain finite and conservatively bounded
  ---
  duration_ms: 0.339263
  type: 'test'
  ...
# Subtest: evolution policy stays finite bounded and tier-correct through Sector 1000
ok 593 - evolution policy stays finite bounded and tier-correct through Sector 1000
  ---
  duration_ms: 120.827783
  type: 'test'
  ...
# Subtest: live runtime consumes the certified signature behavior cache
ok 594 - live runtime consumes the certified signature behavior cache
  ---
  duration_ms: 1.967322
  type: 'test'
  ...
# Subtest: enemy simulation resolves cached signature behavior from enemy identity
ok 595 - enemy simulation resolves cached signature behavior from enemy identity
  ---
  duration_ms: 0.483601
  type: 'test'
  ...
# Subtest: PHASE_LUNGE scales only the existing parasite oscillation axes
ok 596 - PHASE_LUNGE scales only the existing parasite oscillation axes
  ---
  duration_ms: 0.237028
  type: 'test'
  ...
# Subtest: NULL_PULSE extends only the existing disruption duration
ok 597 - NULL_PULSE extends only the existing disruption duration
  ---
  duration_ms: 0.358612
  type: 'test'
  ...
# Subtest: LANCE_VOLLEY is constrained by both global and hostile projectile budgets
ok 598 - LANCE_VOLLEY is constrained by both global and hostile projectile budgets
  ---
  duration_ms: 0.428878
  type: 'test'
  ...
# Subtest: LANCE_VOLLEY uses bounded spread without increasing per-projectile damage
ok 599 - LANCE_VOLLEY uses bounded spread without increasing per-projectile damage
  ---
  duration_ms: 2.730435
  type: 'test'
  ...
# Subtest: Devourer still shares the shooter helper but receives neutral signature behavior
ok 600 - Devourer still shares the shooter helper but receives neutral signature behavior
  ---
  duration_ms: 0.407065
  type: 'test'
  ...
# Subtest: ARMORED_MOMENTUM only scales projectile pushback after damage is applied
ok 601 - ARMORED_MOMENTUM only scales projectile pushback after damage is applied
  ---
  duration_ms: 0.409018
  type: 'test'
  ...
# Subtest: both direct and thermal-splash Splitter deaths use one signature-aware spawn helper
ok 602 - both direct and thermal-splash Splitter deaths use one signature-aware spawn helper
  ---
  duration_ms: 0.409268
  type: 'test'
  ...
# Subtest: BROOD_RELEASE extra minion is gated by descriptor and global enemy concurrency
ok 603 - BROOD_RELEASE extra minion is gated by descriptor and global enemy concurrency
  ---
  duration_ms: 0.699557
  type: 'test'
  ...
# Subtest: split minions remain ordinary crawlers without inherited evolved metadata
ok 604 - split minions remain ordinary crawlers without inherited evolved metadata
  ---
  duration_ms: 0.252672
  type: 'test'
  ...
# Subtest: live signatures add no new persistent state or campaign branch
ok 605 - live signatures add no new persistent state or campaign branch
  ---
  duration_ms: 0.492274
  type: 'test'
  ...
# Subtest: null unknown and malformed signature inputs fail neutral
ok 606 - null unknown and malformed signature inputs fail neutral
  ---
  duration_ms: 1.765227
  type: 'test'
  ...
# Subtest: ARMORED_MOMENTUM only reduces projectile pushback
ok 607 - ARMORED_MOMENTUM only reduces projectile pushback
  ---
  duration_ms: 0.282156
  type: 'test'
  ...
# Subtest: PHASE_LUNGE boosts only bounded parasite lunge axes
ok 608 - PHASE_LUNGE boosts only bounded parasite lunge axes
  ---
  duration_ms: 0.27154
  type: 'test'
  ...
# Subtest: LANCE_VOLLEY permits one extra projectile with narrow bounded spread
ok 609 - LANCE_VOLLEY permits one extra projectile with narrow bounded spread
  ---
  duration_ms: 0.186291
  type: 'test'
  ...
# Subtest: BROOD_RELEASE permits at most one extra split minion
ok 610 - BROOD_RELEASE permits at most one extra split minion
  ---
  duration_ms: 0.149235
  type: 'test'
  ...
# Subtest: NULL_PULSE extends disruption duration without exposing damage scaling
ok 611 - NULL_PULSE extends disruption duration without exposing damage scaling
  ---
  duration_ms: 0.205109
  type: 'test'
  ...
# Subtest: all signature axes remain bounded across malformed and oversized intensities
ok 612 - all signature axes remain bounded across malformed and oversized intensities
  ---
  duration_ms: 0.563251
  type: 'test'
  ...
# Subtest: zero intensity always neutralizes a recognized signature
ok 613 - zero intensity always neutralizes a recognized signature
  ---
  duration_ms: 0.276869
  type: 'test'
  ...
# Subtest: neutral visibility emits no battlefield overlay
ok 614 - neutral visibility emits no battlefield overlay
  ---
  duration_ms: 0.82746
  type: 'test'
  ...
# Subtest: reduced visibility preserves a bounded safe center
ok 615 - reduced visibility preserves a bounded safe center
  ---
  duration_ms: 0.196297
  type: 'test'
  ...
# Subtest: neutral resource field preserves legacy attraction and zero drift
ok 616 - neutral resource field preserves legacy attraction and zero drift
  ---
  duration_ms: 0.220243
  type: 'test'
  ...
# Subtest: resource field behavior is deterministic for the same time and resource
ok 617 - resource field behavior is deterministic for the same time and resource
  ---
  duration_ms: 0.676693
  type: 'test'
  ...
# Subtest: unstable attraction remains collectible and magnetic drift remains bounded
ok 618 - unstable attraction remains collectible and magnetic drift remains bounded
  ---
  duration_ms: 2.322378
  type: 'test'
  ...
# Subtest: different resource ids dephase field motion without randomness
ok 619 - different resource ids dephase field motion without randomness
  ---
  duration_ms: 0.20507
  type: 'test'
  ...
# Subtest: EnergySwarmGame imports certified environmental-field helpers
ok 620 - EnergySwarmGame imports certified environmental-field helpers
  ---
  duration_ms: 0.815182
  type: 'test'
  ...
# Subtest: MAGNETIC_DRIFT moves only active Infinite Swarm resources and clamps them to world bounds
ok 621 - MAGNETIC_DRIFT moves only active Infinite Swarm resources and clamps them to world bounds
  ---
  duration_ms: 0.387555
  type: 'test'
  ...
# Subtest: UNSTABLE_RESOURCE_FIELDS modulates attraction but never reward value or pickup distance
ok 622 - UNSTABLE_RESOURCE_FIELDS modulates attraction but never reward value or pickup distance
  ---
  duration_ms: 0.249277
  type: 'test'
  ...
# Subtest: resource attraction avoids divide-by-zero under environmental fields
ok 623 - resource attraction avoids divide-by-zero under environmental fields
  ---
  duration_ms: 0.207103
  type: 'test'
  ...
# Subtest: REDUCED_VISIBILITY overlays only the battlefield during an active Infinite wave
ok 624 - REDUCED_VISIBILITY overlays only the battlefield during an active Infinite wave
  ---
  duration_ms: 0.249948
  type: 'test'
  ...
# Subtest: tactical minimap is rendered after reduced-visibility overlay and stays readable
ok 625 - tactical minimap is rendered after reduced-visibility overlay and stays readable
  ---
  duration_ms: 0.239943
  type: 'test'
  ...
# Subtest: campaign and Devourer rendering paths do not get explicit environmental overrides
ok 626 - campaign and Devourer rendering paths do not get explicit environmental overrides
  ---
  duration_ms: 0.241735
  type: 'test'
  ...
# Subtest: runtime viewport class remains exposed as the HUD composition authority
ok 627 - runtime viewport class remains exposed as the HUD composition authority
  ---
  duration_ms: 0.953551
  type: 'test'
  ...
# Subtest: campaign objective has an explicit named HUD region
ok 628 - campaign objective has an explicit named HUD region
  ---
  duration_ms: 0.288456
  type: 'test'
  ...
# Subtest: phone runtime profiles use a compact four-row HUD with explicit objective placement
ok 629 - phone runtime profiles use a compact four-row HUD with explicit objective placement
  ---
  duration_ms: 0.562209
  type: 'test'
  ...
# Subtest: tablet runtime profiles reserve an objective row without displacing action controls
ok 630 - tablet runtime profiles reserve an objective row without displacing action controls
  ---
  duration_ms: 0.62181
  type: 'test'
  ...
# Subtest: laptop desktop and ultrawide runtime profiles preserve the five-column primary HUD row
ok 631 - laptop desktop and ultrawide runtime profiles preserve the five-column primary HUD row
  ---
  duration_ms: 0.466325
  type: 'test'
  ...
# Subtest: HUD layouts collapse the objective track when no campaign objective is rendered
ok 632 - HUD layouts collapse the objective track when no campaign objective is rendered
  ---
  duration_ms: 0.440746
  type: 'test'
  ...
# Subtest: media-query HUD fallbacks remain available for progressive enhancement
ok 633 - media-query HUD fallbacks remain available for progressive enhancement
  ---
  duration_ms: 0.401797
  type: 'test'
  ...
# Subtest: campaign and ordinary infinite waves project no milestone encounter
ok 634 - campaign and ordinary infinite waves project no milestone encounter
  ---
  duration_ms: 4.272945
  type: 'test'
  ...
# Subtest: milestone metadata fails closed when attached to a non-final wave
ok 635 - milestone metadata fails closed when attached to a non-final wave
  ---
  duration_ms: 0.543972
  type: 'test'
  ...
# Subtest: Sector 15 final wave projects a budget-compatible Blackout Elite miniboss
ok 636 - Sector 15 final wave projects a budget-compatible Blackout Elite miniboss
  ---
  duration_ms: 1.994143
  type: 'test'
  ...
# Subtest: Sector 25 final wave projects an isolated Devourer rematch phase
ok 637 - Sector 25 final wave projects an isolated Devourer rematch phase
  ---
  duration_ms: 3.843847
  type: 'test'
  ...
# Subtest: milestone encounter scaling remains finite and bounded through Sector 1000
ok 638 - milestone encounter scaling remains finite and bounded through Sector 1000
  ---
  duration_ms: 207.418952
  type: 'test'
  ...
# Subtest: live runtime consumes cached milestone projection and deterministic miniboss gate
ok 639 - live runtime consumes cached milestone projection and deterministic miniboss gate
  ---
  duration_ms: 1.245592
  type: 'test'
  ...
# Subtest: new runs reset the miniboss gate
ok 640 - new runs reset the miniboss gate
  ---
  duration_ms: 0.3379
  type: 'test'
  ...
# Subtest: only MINIBOSS milestone profiles reserve the final effective budget slot
ok 641 - only MINIBOSS milestone profiles reserve the final effective budget slot
  ---
  duration_ms: 0.318191
  type: 'test'
  ...
# Subtest: final slot starts one telegraph and cannot increment budget before champion readiness
ok 642 - final slot starts one telegraph and cannot increment budget before champion readiness
  ---
  duration_ms: 0.387215
  type: 'test'
  ...
# Subtest: champion owns the final slot as a BLACKOUT_ELITE non-boss
ok 643 - champion owns the final slot as a BLACKOUT_ELITE non-boss
  ---
  duration_ms: 0.360935
  type: 'test'
  ...
# Subtest: existing pressure and mutators apply before bounded milestone stat multipliers
ok 644 - existing pressure and mutators apply before bounded milestone stat multipliers
  ---
  duration_ms: 0.259812
  type: 'test'
  ...
# Subtest: milestone champion never stacks random elite or ELITE_SUPPORT spawning
ok 645 - milestone champion never stacks random elite or ELITE_SUPPORT spawning
  ---
  duration_ms: 0.417911
  type: 'test'
  ...
# Subtest: miniboss movement multiplier also applies to Blackout Elite dash
ok 646 - miniboss movement multiplier also applies to Blackout Elite dash
  ---
  duration_ms: 0.409809
  type: 'test'
  ...
# Subtest: miniboss contact damage and reward multipliers are isolated enemy metadata
not ok 647 - miniboss contact damage and reward multipliers are isolated enemy metadata
  ---
  duration_ms: 5.451936
  type: 'test'
  location: '/home/runner/work/orbi-energy.swarm/orbi-energy.swarm/tests/runtime-miniboss-adoption.test.ts:1:4272'
  failureType: 'testCodeFailure'
  error: |-
    both direct and splash kill paths must use milestone-aware score rewards
    
    0 !== 2
    
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected: 2
  actual: 0
  operator: 'strictEqual'
  stack: |-
    TestContext.<anonymous> (/home/runner/work/orbi-energy.swarm/orbi-energy.swarm/tests/runtime-miniboss-adoption.test.ts:229:10)
    Test.runInAsyncScope (node:async_hooks:214:14)
    Test.run (node:internal/test_runner/test:1047:25)
    Test.processPendingSubtests (node:internal/test_runner/test:744:18)
    Test.postRun (node:internal/test_runner/test:1173:19)
    Test.run (node:internal/test_runner/test:1101:12)
    async Test.processPendingSubtests (node:internal/test_runner/test:744:7)
  ...
# Subtest: BUDGET_AND_CLEAR still sees the champion because milestone enemies remain non-boss
ok 648 - BUDGET_AND_CLEAR still sees the champion because milestone enemies remain non-boss
  ---
  duration_ms: 0.631344
  type: 'test'
  ...
# Subtest: miniboss gate synchronizes and advances from the active runtime descriptor each frame
ok 649 - miniboss gate synchronizes and advances from the active runtime descriptor each frame
  ---
  duration_ms: 0.383119
  type: 'test'
  ...
# Subtest: Blackout Warden receives a persistent Canvas aura and label
ok 650 - Blackout Warden receives a persistent Canvas aura and label
  ---
  duration_ms: 0.252862
  type: 'test'
  ...
# Subtest: pre-spawn milestone warning renders above battlefield effects before radar
ok 651 - pre-spawn milestone warning renders above battlefield effects before radar
  ---
  duration_ms: 0.228335
  type: 'test'
  ...
# Subtest: campaign Devourer runtime remains isolated from miniboss metadata
ok 652 - campaign Devourer runtime remains isolated from miniboss metadata
  ---
  duration_ms: 0.240603
  type: 'test'
  ...
# Subtest: non-miniboss synchronization resets the gate
ok 653 - non-miniboss synchronization resets the gate
  ---
  duration_ms: 4.280007
  type: 'test'
  ...
# Subtest: new miniboss descriptor starts in IDLE state
ok 654 - new miniboss descriptor starts in IDLE state
  ---
  duration_ms: 0.149145
  type: 'test'
  ...
# Subtest: first spawn request starts exactly one telegraph
ok 655 - first spawn request starts exactly one telegraph
  ---
  duration_ms: 0.222186
  type: 'test'
  ...
# Subtest: telegraph becomes ready only after its certified duration
ok 656 - telegraph becomes ready only after its certified duration
  ---
  duration_ms: 0.232001
  type: 'test'
  ...
# Subtest: spawned gate cannot emit a second miniboss
ok 657 - spawned gate cannot emit a second miniboss
  ---
  duration_ms: 0.144098
  type: 'test'
  ...
# Subtest: changing descriptor resets a previously spawned gate
ok 658 - changing descriptor resets a previously spawned gate
  ---
  duration_ms: 0.100992
  type: 'test'
  ...
# Subtest: campaign descriptors always project a neutral mutator profile
ok 659 - campaign descriptors always project a neutral mutator profile
  ---
  duration_ms: 1.930697
  type: 'test'
  ...
# Subtest: each combat mutator maps to one explicit bounded effect
ok 660 - each combat mutator maps to one explicit bounded effect
  ---
  duration_ms: 3.859301
  type: 'test'
  ...
# Subtest: environmental mutators have explicit deferred effect parameters
ok 661 - environmental mutators have explicit deferred effect parameters
  ---
  duration_ms: 1.259863
  type: 'test'
  ...
# Subtest: combined mutators remain finite and within certified caps
ok 662 - combined mutators remain finite and within certified caps
  ---
  duration_ms: 1.319033
  type: 'test'
  ...
# Subtest: unknown modifier strings fail neutral instead of becoming implicit mutators
ok 663 - unknown modifier strings fail neutral instead of becoming implicit mutators
  ---
  duration_ms: 0.321336
  type: 'test'
  ...
# Subtest: generated Infinite Swarm profiles remain bounded through Sector 1000
ok 664 - generated Infinite Swarm profiles remain bounded through Sector 1000
  ---
  duration_ms: 196.508108
  type: 'test'
  ...
# Subtest: mutator-adjusted enemy budget preserves campaign and scales DOUBLE_THREAT consistently
ok 665 - mutator-adjusted enemy budget preserves campaign and scales DOUBLE_THREAT consistently
  ---
  duration_ms: 0.332542
  type: 'test'
  ...
# Subtest: DOUBLE_THREAT effective enemy budget is hard-capped for runtime safety
ok 666 - DOUBLE_THREAT effective enemy budget is hard-capped for runtime safety
  ---
  duration_ms: 1.316378
  type: 'test'
  ...
# Subtest: campaign runtime router preserves handcrafted descriptor contracts
ok 667 - campaign runtime router preserves handcrafted descriptor contracts
  ---
  duration_ms: 2.621761
  type: 'test'
  ...
# Subtest: campaign runtime router rejects Sector 11 and invalid sectors
ok 668 - campaign runtime router rejects Sector 11 and invalid sectors
  ---
  duration_ms: 0.462088
  type: 'test'
  ...
# Subtest: infinite runtime router resolves Sector 11 without campaign fallback
ok 669 - infinite runtime router resolves Sector 11 without campaign fallback
  ---
  duration_ms: 2.887924
  type: 'test'
  ...
# Subtest: infinite runtime advancement crosses waves and sectors deterministically
ok 670 - infinite runtime advancement crosses waves and sectors deterministically
  ---
  duration_ms: 1.266834
  type: 'test'
  ...
# Subtest: campaign state cannot use infinite advancement
ok 671 - campaign state cannot use infinite advancement
  ---
  duration_ms: 0.161153
  type: 'test'
  ...
# Subtest: ended infinite sessions fail closed at router adoption
ok 672 - ended infinite sessions fail closed at router adoption
  ---
  duration_ms: 0.468888
  type: 'test'
  ...
# Subtest: live runtime imports and owns one runtime projection bundle cache
ok 673 - live runtime imports and owns one runtime projection bundle cache
  ---
  duration_ms: 2.341618
  type: 'test'
  ...
# Subtest: current descriptor pressure and mutator helpers all route through one cached bundle
ok 674 - current descriptor pressure and mutator helpers all route through one cached bundle
  ---
  duration_ms: 0.266723
  type: 'test'
  ...
# Subtest: new run eagerly replaces the projection cache
ok 675 - new run eagerly replaces the projection cache
  ---
  duration_ms: 0.215516
  type: 'test'
  ...
# Subtest: wave transitions reuse cached enemy budget and milestone projection
ok 676 - wave transitions reuse cached enemy budget and milestone projection
  ---
  duration_ms: 0.262406
  type: 'test'
  ...
# Subtest: spawn path consumes one projection bundle instead of recomputing derived objects
ok 677 - spawn path consumes one projection bundle instead of recomputing derived objects
  ---
  duration_ms: 0.2317
  type: 'test'
  ...
# Subtest: simulation refetches projection after wave transitions may replace runtime state
ok 678 - simulation refetches projection after wave transitions may replace runtime state
  ---
  duration_ms: 0.478963
  type: 'test'
  ...
# Subtest: render visibility and storm paths reuse cached projections
ok 679 - render visibility and storm paths reuse cached projections
  ---
  duration_ms: 0.428427
  type: 'test'
  ...
# Subtest: live game contains no direct derived projection calls after cache adoption
ok 680 - live game contains no direct derived projection calls after cache adoption
  ---
  duration_ms: 0.459855
  type: 'test'
  ...
# Subtest: first cache access exactly matches all canonical projection authorities
ok 681 - first cache access exactly matches all canonical projection authorities
  ---
  duration_ms: 2.471023
  type: 'test'
  ...
# Subtest: repeated access for one runtime state returns the same bundle identity
ok 682 - repeated access for one runtime state returns the same bundle identity
  ---
  duration_ms: 0.243638
  type: 'test'
  ...
# Subtest: new runtime state identity creates a fresh bundle even for equivalent sector data
ok 683 - new runtime state identity creates a fresh bundle even for equivalent sector data
  ---
  duration_ms: 0.28429
  type: 'test'
  ...
# Subtest: different campaign sectors never alias cached projections
ok 684 - different campaign sectors never alias cached projections
  ---
  duration_ms: 0.210858
  type: 'test'
  ...
# Subtest: fresh cache recomputes equivalent bundle from the same immutable runtime state
ok 685 - fresh cache recomputes equivalent bundle from the same immutable runtime state
  ---
  duration_ms: 0.433685
  type: 'test'
  ...
# Subtest: campaign bundle preserves null Infinite milestone semantics
ok 686 - campaign bundle preserves null Infinite milestone semantics
  ---
  duration_ms: 0.183647
  type: 'test'
  ...
# Subtest: EnergySwarmGame resolves runtime descriptors through the cached unified router
ok 687 - EnergySwarmGame resolves runtime descriptors through the cached unified router
  ---
  duration_ms: 0.958899
  type: 'test'
  ...
# Subtest: new runs reset runtime progression to campaign Sector 1
ok 688 - new runs reset runtime progression to campaign Sector 1
  ---
  duration_ms: 0.146462
  type: 'test'
  ...
# Subtest: campaign wave advancement keeps the runtime router synchronized
ok 689 - campaign wave advancement keeps the runtime router synchronized
  ---
  duration_ms: 1.230348
  type: 'test'
  ...
# Subtest: Devourer victory switches the live router into infinite runtime
ok 690 - Devourer victory switches the live router into infinite runtime
  ---
  duration_ms: 0.339452
  type: 'test'
  ...
# Subtest: campaign-only WaveConfig presentation lookup remains inside the campaign loop
ok 691 - campaign-only WaveConfig presentation lookup remains inside the campaign loop
  ---
  duration_ms: 0.147473
  type: 'test'
  ...
# Subtest: viewport hook resolves exclusively through the certified composition classifier
ok 692 - viewport hook resolves exclusively through the certified composition classifier
  ---
  duration_ms: 1.207555
  type: 'test'
  ...
# Subtest: viewport hook reacts to browser, visual viewport, orientation and pointer changes
ok 693 - viewport hook reacts to browser, visual viewport, orientation and pointer changes
  ---
  duration_ms: 0.335967
  type: 'test'
  ...
# Subtest: game root exposes the runtime composition as semantic data attributes
ok 694 - game root exposes the runtime composition as semantic data attributes
  ---
  duration_ms: 1.805748
  type: 'test'
  ...
# Subtest: portrait advisory is explicitly gated by the runtime profile
ok 695 - portrait advisory is explicitly gated by the runtime profile
  ---
  duration_ms: 1.566507
  type: 'test'
  ...
# Subtest: runtime touch intent augments rather than replaces CSS fallbacks
ok 696 - runtime touch intent augments rather than replaces CSS fallbacks
  ---
  duration_ms: 0.842843
  type: 'test'
  ...
# Subtest: runtime profile adoption does not alter logical canvas or movement physics
ok 697 - runtime profile adoption does not alter logical canvas or movement physics
  ---
  duration_ms: 1.540117
  type: 'test'
  ...
# Subtest: campaign descriptors reproduce handcrafted WaveConfig values for Sectors 1–10
ok 698 - campaign descriptors reproduce handcrafted WaveConfig values for Sectors 1–10
  ---
  duration_ms: 2.006492
  type: 'test'
  ...
# Subtest: campaign completion policies preserve timebox vs boss-defeat semantics
ok 699 - campaign completion policies preserve timebox vs boss-defeat semantics
  ---
  duration_ms: 0.36404
  type: 'test'
  ...
# Subtest: campaign descriptor rejects values outside the handcrafted 1–10 range
ok 700 - campaign descriptor rejects values outside the handcrafted 1–10 range
  ---
  duration_ms: 0.617303
  type: 'test'
  ...
# Subtest: infinite descriptor maps the current session execution plan exactly
ok 701 - infinite descriptor maps the current session execution plan exactly
  ---
  duration_ms: 3.079072
  type: 'test'
  ...
# Subtest: infinite descriptors remain equivalent while session advances through Sector 1000
ok 702 - infinite descriptors remain equivalent while session advances through Sector 1000
  ---
  duration_ms: 161.076927
  type: 'test'
  ...
# Subtest: campaign and infinite descriptors remain source-distinct
ok 703 - campaign and infinite descriptors remain source-distinct
  ---
  duration_ms: 0.380144
  type: 'test'
  ...
# Subtest: HUD exposes shield integrity as progress without turning the whole HUD into a live region
ok 704 - HUD exposes shield integrity as progress without turning the whole HUD into a live region
  ---
  duration_ms: 1.009716
  type: 'test'
  ...
# Subtest: HUD pause and mute controls expose action labels plus pressed state
ok 705 - HUD pause and mute controls expose action labels plus pressed state
  ---
  duration_ms: 0.228836
  type: 'test'
  ...
# Subtest: boss HUD uses a named region and a dedicated integrity progressbar
ok 706 - boss HUD uses a named region and a dedicated integrity progressbar
  ---
  duration_ms: 0.16549
  type: 'test'
  ...
# Subtest: boss tactical announcements are isolated from continuously changing HP
ok 707 - boss tactical announcements are isolated from continuously changing HP
  ---
  duration_ms: 0.197849
  type: 'test'
  ...
# Subtest: LUX-8 communication history is a polite append-oriented log
ok 708 - LUX-8 communication history is a polite append-oriented log
  ---
  duration_ms: 0.127382
  type: 'test'
  ...
# Subtest: pause overlay is a labelled modal dialog with deterministic focus targets
ok 709 - pause overlay is a labelled modal dialog with deterministic focus targets
  ---
  duration_ms: 0.242686
  type: 'test'
  ...
# Subtest: intermission selector is a labelled modal dialog with fail-safe focus initialization
ok 710 - intermission selector is a labelled modal dialog with fail-safe focus initialization
  ---
  duration_ms: 0.140412
  type: 'test'
  ...
# Subtest: result overlay is a labelled modal dialog and starts keyboard focus on play-again
ok 711 - result overlay is a labelled modal dialog and starts keyboard focus on play-again
  ---
  duration_ms: 0.132981
  type: 'test'
  ...
# Subtest: Threat Intel is a labelled modal dialog with description and resume focus
ok 712 - Threat Intel is a labelled modal dialog with description and resume focus
  ---
  duration_ms: 0.294455
  type: 'test'
  ...
# Subtest: semantic accessibility slice does not add gameplay-loop hooks to presentation components
ok 713 - semantic accessibility slice does not add gameplay-loop hooks to presentation components
  ---
  duration_ms: 0.54951
  type: 'test'
  ...
# Subtest: public querySpatialIndex remains compatible and ordered by bucket traversal
ok 714 - public querySpatialIndex remains compatible and ordered by bucket traversal
  ---
  duration_ms: 1.914703
  type: 'test'
  ...
# Subtest: nearest direct traversal preserves distance and original-order tie-break
ok 715 - nearest direct traversal preserves distance and original-order tie-break
  ---
  duration_ms: 0.39685
  type: 'test'
  ...
# Subtest: first collision direct traversal preserves lowest original order
ok 716 - first collision direct traversal preserves lowest original order
  ---
  duration_ms: 0.301866
  type: 'test'
  ...
# Subtest: multi collision direct traversal sorts final matches by original order
ok 717 - multi collision direct traversal sorts final matches by original order
  ---
  duration_ms: 0.410029
  type: 'test'
  ...
# Subtest: include predicates do not change candidateChecks semantics
ok 718 - include predicates do not change candidateChecks semantics
  ---
  duration_ms: 0.277159
  type: 'test'
  ...
# Subtest: hot nearest and collision helpers no longer allocate through querySpatialIndex
ok 719 - hot nearest and collision helpers no longer allocate through querySpatialIndex
  ---
  duration_ms: 0.562429
  type: 'test'
  ...
# Subtest: public querySpatialIndex implementation remains present
ok 720 - public querySpatialIndex implementation remains present
  ---
  duration_ms: 0.207904
  type: 'test'
  ...
# Subtest: spatial nearest target matches legacy full scan across deterministic layouts
ok 721 - spatial nearest target matches legacy full scan across deterministic layouts
  ---
  duration_ms: 7.04923
  type: 'test'
  ...
# Subtest: equal-distance ties preserve original enemy-array order
ok 722 - equal-distance ties preserve original enemy-array order
  ---
  duration_ms: 0.21206
  type: 'test'
  ...
# Subtest: dead enemies remain ineligible
ok 723 - dead enemies remain ineligible
  ---
  duration_ms: 0.169796
  type: 'test'
  ...
# Subtest: legacy strict weapon range excludes a target exactly on the boundary
ok 724 - legacy strict weapon range excludes a target exactly on the boundary
  ---
  duration_ms: 0.166762
  type: 'test'
  ...
# Subtest: cell boundaries do not lose valid targets
ok 725 - cell boundaries do not lose valid targets
  ---
  duration_ms: 0.151669
  type: 'test'
  ...
# Subtest: spatial query reduces candidate checks on dispersed max-density populations
ok 726 - spatial query reduces candidate checks on dispersed max-density populations
  ---
  duration_ms: 1.853981
  type: 'test'
  ...
# Subtest: invalid range fails closed
ok 727 - invalid range fails closed
  ---
  duration_ms: 0.261485
  type: 'test'
  ...
# Subtest: live swarm targeting uses one lazy spatial index and no full enemy scan
ok 728 - live swarm targeting uses one lazy spatial index and no full enemy scan
  ---
  duration_ms: 2.002976
  type: 'test'
  ...
# Subtest: spatial first-hit lookup matches legacy array-order collision semantics
ok 729 - spatial first-hit lookup matches legacy array-order collision semantics
  ---
  duration_ms: 11.973159
  type: 'test'
  ...
# Subtest: first colliding array entry wins even when a later target is closer
ok 730 - first colliding array entry wins even when a later target is closer
  ---
  duration_ms: 0.316127
  type: 'test'
  ...
# Subtest: collision radius stays strict at the exact boundary
ok 731 - collision radius stays strict at the exact boundary
  ---
  duration_ms: 0.154063
  type: 'test'
  ...
# Subtest: dead targets remain ineligible
ok 732 - dead targets remain ineligible
  ---
  duration_ms: 0.128955
  type: 'test'
  ...
# Subtest: relocation moves an indexed enemy immediately after pushback
ok 733 - relocation moves an indexed enemy immediately after pushback
  ---
  duration_ms: 0.247284
  type: 'test'
  ...
# Subtest: new Splitter minions can be inserted for later projectiles in the same sweep
ok 734 - new Splitter minions can be inserted for later projectiles in the same sweep
  ---
  duration_ms: 0.138009
  type: 'test'
  ...
# Subtest: dispersed max-density collision query checks only local candidates
ok 735 - dispersed max-density collision query checks only local candidates
  ---
  duration_ms: 0.447857
  type: 'test'
  ...
# Subtest: live collision sweep builds one index and removes the O(P×E) loop
ok 736 - live collision sweep builds one index and removes the O(P×E) loop
  ---
  duration_ms: 4.887664
  type: 'test'
  ...
# Subtest: shield nodes retain priority over spatial enemy collision
ok 737 - shield nodes retain priority over spatial enemy collision
  ---
  duration_ms: 1.598215
  type: 'test'
  ...
# Subtest: live direct-hit pushback relocates the indexed target before later projectiles
ok 738 - live direct-hit pushback relocates the indexed target before later projectiles
  ---
  duration_ms: 1.56165
  type: 'test'
  ...
# Subtest: Splitter spawn inserts the new enemy into the active collision index
ok 739 - Splitter spawn inserts the new enemy into the active collision index
  ---
  duration_ms: 1.190639
  type: 'test'
  ...
# Subtest: spawn safety uses the exact squared radius without sqrt
ok 740 - spawn safety uses the exact squared radius without sqrt
  ---
  duration_ms: 1.193624
  type: 'test'
  ...
# Subtest: Devourer beam keeps the exact 25-unit hit radius as a squared comparison
ok 741 - Devourer beam keeps the exact 25-unit hit radius as a squared comparison
  ---
  duration_ms: 0.259101
  type: 'test'
  ...
# Subtest: electrical storm keeps its exact configured strike radius with distance squared
ok 742 - electrical storm keeps its exact configured strike radius with distance squared
  ---
  duration_ms: 0.370861
  type: 'test'
  ...
# Subtest: enemy shooter tests the exact 320-unit range without normalizing distance
ok 743 - enemy shooter tests the exact 320-unit range without normalizing distance
  ---
  duration_ms: 0.239001
  type: 'test'
  ...
# Subtest: resource attraction defers sqrt until the exact pull radius has passed
ok 744 - resource attraction defers sqrt until the exact pull radius has passed
  ---
  duration_ms: 0.360785
  type: 'test'
  ...
# Subtest: resource cleanup reuses the live array instead of allocating with filter
ok 745 - resource cleanup reuses the live array instead of allocating with filter
  ---
  duration_ms: 0.437351
  type: 'test'
  ...
# Subtest: compact tactical radar uses one squared radius for allies enemies and resources
ok 746 - compact tactical radar uses one squared radius for allies enemies and resources
  ---
  duration_ms: 0.413735
  type: 'test'
  ...
# Subtest: pointer drag and click thresholds keep their exact 8px and 10px boundaries
ok 747 - pointer drag and click thresholds keep their exact 8px and 10px boundaries
  ---
  duration_ms: 0.235526
  type: 'test'
  ...
# Subtest: resource label renderer avoids sqrt for far pickups but preserves exact proximity opacity
ok 748 - resource label renderer avoids sqrt for far pickups but preserves exact proximity opacity
  ---
  duration_ms: 0.64866
  type: 'test'
  ...
# Subtest: movement normalization square roots remain present in live simulation
ok 749 - movement normalization square roots remain present in live simulation
  ---
  duration_ms: 0.513987
  type: 'test'
  ...
# Subtest: Phase I starts at exactly ten follower slots
ok 750 - Phase I starts at exactly ten follower slots
  ---
  duration_ms: 0.99299
  type: 'test'
  ...
# Subtest: each distinct Founding-Ten level-5 promotion grants one slot through 20
ok 751 - each distinct Founding-Ten level-5 promotion grants one slot through 20
  ---
  duration_ms: 0.200913
  type: 'test'
  ...
# Subtest: non-founder level-5 members cannot accelerate Phase II
ok 752 - non-founder level-5 members cannot accelerate Phase II
  ---
  duration_ms: 0.174884
  type: 'test'
  ...
# Subtest: Phase III requires ten level-10 promotions for slot 21 and nineteen for slot 30
ok 753 - Phase III requires ten level-10 promotions for slot 21 and nineteen for slot 30
  ---
  duration_ms: 0.176517
  type: 'test'
  ...
# Subtest: promotion credit is monotonic and duplicate reports never create extra slots
ok 754 - promotion credit is monotonic and duplicate reports never create extra slots
  ---
  duration_ms: 0.136807
  type: 'test'
  ...
# Subtest: absolute cap can never exceed thirty
ok 755 - absolute cap can never exceed thirty
  ---
  duration_ms: 0.298922
  type: 'test'
  ...
# Subtest: all raid chassis share the certified boss engine instead of creating parallel loops
ok 756 - all raid chassis share the certified boss engine instead of creating parallel loops
  ---
  duration_ms: 1.207113
  type: 'test'
  ...
# Subtest: Titan uses fixed weakpoints and existing projectile collision budget
ok 757 - Titan uses fixed weakpoints and existing projectile collision budget
  ---
  duration_ms: 0.276348
  type: 'test'
  ...
# Subtest: Titan presentation is chassis-aware without a second WebGL scene
ok 758 - Titan presentation is chassis-aware without a second WebGL scene
  ---
  duration_ms: 0.233764
  type: 'test'
  ...
# Subtest: ordinary H5 boss milestones remain Devourer-only before deep raids
ok 759 - ordinary H5 boss milestones remain Devourer-only before deep raids
  ---
  duration_ms: 53.963508
  type: 'test'
  ...
# Subtest: Sector 200 preserves the H5 primary and appends a Titan raid escalation
ok 760 - Sector 200 preserves the H5 primary and appends a Titan raid escalation
  ---
  duration_ms: 30.301781
  type: 'test'
  ...
# Subtest: Sector 300 preserves the H5 primary and appends a Worm raid escalation
ok 761 - Sector 300 preserves the H5 primary and appends a Worm raid escalation
  ---
  duration_ms: 23.487576
  type: 'test'
  ...
# Subtest: deep raid cadence alternates deterministically through Sector 1000
ok 762 - deep raid cadence alternates deterministically through Sector 1000
  ---
  duration_ms: 456.751041
  type: 'test'
  ...
# Subtest: touch direction state starts neutral
ok 763 - touch direction state starts neutral
  ---
  duration_ms: 1.414718
  type: 'test'
  ...
# Subtest: multi-touch directions compose into cardinal and diagonal vectors
ok 764 - multi-touch directions compose into cardinal and diagonal vectors
  ---
  duration_ms: 0.164769
  type: 'test'
  ...
# Subtest: opposite held directions cancel deterministically
ok 765 - opposite held directions cancel deterministically
  ---
  duration_ms: 0.175816
  type: 'test'
  ...
# Subtest: touch overlay uses pointer capture and explicit press/release signals
ok 766 - touch overlay uses pointer capture and explicit press/release signals
  ---
  duration_ms: 0.412613
  type: 'test'
  ...
# Subtest: touch movement is delta-driven inside the canonical movement pipeline
ok 767 - touch movement is delta-driven inside the canonical movement pipeline
  ---
  duration_ms: 1.798798
  type: 'test'
  ...
# Subtest: lifecycle cleanup releases all held touch directions
ok 768 - lifecycle cleanup releases all held touch directions
  ---
  duration_ms: 1.38988
  type: 'test'
  ...
# Subtest: 1920x1080 resolves as expanded desktop rails
ok 769 - 1920x1080 resolves as expanded desktop rails
  ---
  duration_ms: 1.303729
  type: 'test'
  ...
# Subtest: 1440x900 and 1366x768 resolve as laptop composition
ok 770 - 1440x900 and 1366x768 resolve as laptop composition
  ---
  duration_ms: 0.280924
  type: 'test'
  ...
# Subtest: 2560x1080 resolves as ultrawide and preserves expanded shell intent
ok 771 - 2560x1080 resolves as ultrawide and preserves expanded shell intent
  ---
  duration_ms: 0.209176
  type: 'test'
  ...
# Subtest: tablet landscape and portrait use split auxiliary decks
ok 772 - tablet landscape and portrait use split auxiliary decks
  ---
  duration_ms: 0.155595
  type: 'test'
  ...
# Subtest: Android landscape uses phone composition and touch controls
ok 773 - Android landscape uses phone composition and touch controls
  ---
  duration_ms: 0.15863
  type: 'test'
  ...
# Subtest: narrow Android portrait recommends landscape advisory
ok 774 - narrow Android portrait recommends landscape advisory
  ---
  duration_ms: 0.19883
  type: 'test'
  ...
# Subtest: compact Android landscape below 720px remains PHONE_LANDSCAPE
ok 775 - compact Android landscape below 720px remains PHONE_LANDSCAPE
  ---
  duration_ms: 0.210467
  type: 'test'
  ...
# Subtest: portrait advisory stays off for fine pointers and wider tablet portraits
ok 776 - portrait advisory stays off for fine pointers and wider tablet portraits
  ---
  duration_ms: 0.159371
  type: 'test'
  ...
# Subtest: invalid dimensions fail safe to the logical game viewport
ok 777 - invalid dimensions fail safe to the logical game viewport
  ---
  duration_ms: 0.309908
  type: 'test'
  ...
# Subtest: viewport thresholds align with certified CSS breakpoints
ok 778 - viewport thresholds align with certified CSS breakpoints
  ---
  duration_ms: 0.532004
  type: 'test'
  ...
# Subtest: Worm shares the certified boss loop and keeps segments outside Enemy[]
ok 779 - Worm shares the certified boss loop and keeps segments outside Enemy[]
  ---
  duration_ms: 1.272943
  type: 'test'
  ...
# Subtest: Worm segment destruction is bounded, rewarded once, and never regenerated
ok 780 - Worm segment destruction is bounded, rewarded once, and never regenerated
  ---
  duration_ms: 0.288906
  type: 'test'
  ...
# Subtest: Worm presentation stays inside existing Canvas2D and chassis-aware HUD
ok 781 - Worm presentation stays inside existing Canvas2D and chassis-aware HUD
  ---
  duration_ms: 0.2321
  type: 'test'
  ...
# Subtest: Worm chain creation is fixed-count and starts at deterministic spacing
ok 782 - Worm chain creation is fixed-count and starts at deterministic spacing
  ---
  duration_ms: 1.611975
  type: 'test'
  ...
# Subtest: Worm physics is deterministic and velocity remains bounded
ok 783 - Worm physics is deterministic and velocity remains bounded
  ---
  duration_ms: 0.743313
  type: 'test'
  ...
# Subtest: allocation-free step preserves array and segment object identity
ok 784 - allocation-free step preserves array and segment object identity
  ---
  duration_ms: 0.252121
  type: 'test'
  ...
# Subtest: Worm chain converges toward bounded spacing behind a moving head
ok 785 - Worm chain converges toward bounded spacing behind a moving head
  ---
  duration_ms: 6.273899
  type: 'test'
  ...
# Subtest: substepping keeps 60Hz and 120Hz integration close
ok 786 - substepping keeps 60Hz and 120Hz integration close
  ---
  duration_ms: 5.050611
  type: 'test'
  ...
# Subtest: destroyed segments are removed once and survivors reconnect deterministically
ok 787 - destroyed segments are removed once and survivors reconnect deterministically
  ---
  duration_ms: 4.748904
  type: 'test'
  ...
1..787
# tests 787
# suites 0
# pass 785
# fail 2
# cancelled 0
# skipped 0
# todo 0
# duration_ms 12860.675911
```
