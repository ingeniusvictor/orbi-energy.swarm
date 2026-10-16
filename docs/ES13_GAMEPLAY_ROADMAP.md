# ES-13 — Arcade Evolution & Dynamic Warfront

Status: ACTIVE PROGRAM  
Repository: `ingeniusvictor/orbi-energy.swarm`

## Purpose
Turn the stable technical foundation into a deeper, more replayable arcade combat game. Proven fixed-shooter principles are reinterpreted through ORBI systems: Energy Swarm, affinities, formations, FOTON, GAIA, Dyson Halo, Blackout, Campaign and Infinite.

Authoritative continuity lives in GitHub + `PROJECT_CONTINUITY.md` + `IMPLEMENTATION_LEDGER.md`, not chat history.

## Core design rules
1. Preserve ORBI identity; never copy protected characters/art/assets.
2. Add decisions, not merely HP/damage.
3. Reward mastery through chain, resonance, affinity, formation, routing and risk/reward.
4. Preserve accessibility for new players.
5. Keep Campaign/Infinite isolation where intended.
6. Prefer patterns/state/objectives/behavior over uncontrolled entity growth.
7. Preserve global caps/budgets unless a dedicated issue proves a change is needed.
8. No silent tuning changes.
9. Every gameplay phase follows Issue → Branch → gates → PR → PR CI/Android GREEN → squash merge → exact-SHA main CI/Android/Pages GREEN.
10. A phase is not administratively closed until continuity + ledger + roadmap are current.

---

## J1 — Combat Chain & Energy Resonance
Status: **DEPLOYED / FROZEN PROGRAM**

- J1A — Combat Chain & Resonance Core — `feb263957b52839d35a7cb1249762c223ba22595` — Issue #251 / PR #252.
- J1B — Live Resonance Adoption & HUD — `91564e365d0a2220e4db2999e38372809ec397f3` — Issue #253 / PR #257.

J1 established the earned combat-chain/Resonance loop, affinity diversity, bounded score projection, damage break and live HUD/runtime adoption.

---

## J2 — ORBI Overdrive
Status: **DEPLOYED / FROZEN PROGRAM**

- J2A — Pure State Contract — `6adfb7cc4785c5238c78821e6e67fdac3c0f4eb7` — Issue #260 / PR #261.
- J2B — Live Activation & HUD — `466242e91fa927bc4d996d09efdbb87f8f572d44` — Issue #264 / PR #267.
- J2C-A — Pure Bounded Combat Expression — `eca68cce510cf506053fd6d9121b501db7cd1f64` — Issue #271 / PR #272.
- J2C-B — Live Bounded Damage Adoption — `7e15ee1e79ee9ae8903891a66b0b1031b0600bca` — Issue #276 / PR #278.
- J2D-A — Pure Presentation Profile — `39f9b33c9a229c7c8d991aecd81ea695510c82a0` — Issue #281 / PR #282.
- J2D-B — Live Reactive Presentation — `9743890d98b33d365cbc18a048015f3815b144e5` — Issue #286 / PR #287.
- J2E — Integration Certification — `bf0e6a858e3c96091c002ea623b29eb5c260c6ea` — Issue #290 / PR #291.

J2E certified one-shot readiness consumption, exact 8 s active + 4 s re-entry lock, bounded damage/presentation, pause safety, reset and deterministic long-sequence integration.

---

## J3 — Advanced Enemy Formation Director
Status: **DEPLOYED / FROZEN PROGRAM**

Architecture boundary: `src/game/formations.ts` and `formationCycle.ts` are the player/FOTON swarm formation authority. J3 remains an enemy-routing authority.

- J3A — Pure Enemy Formation Route Contract — `3c5ece8d8e59bc38de468b4d0d9644953fa6a8be` — Issue #294 / PR #295.
- J3B — Live Enemy Formation Director Adoption — `0fcf08dc59558619da61e1120eef2e957465f9a1` — Issue #298 / PR #299.
- J3C-A — Pure Advanced Route Vocabulary — `0fd337e3a0efe96fd52d5f5686e3f110e1b361d8` — Issue #302 / PR #303.
- J3C-B — Controlled Live Advanced Adoption — `5c345672b5365dbcc983403f73da62555489a98f` — Issue #306 / PR #307.
- J3D — Telegraph/Fairness/Integration Certification — `7273d447bbdcb084499fb121122aac6d34928d41` — Issue #310 / PR #311.

Certified live route sizes remain PINCER 2, X_CROSS 2, SERPENTINE 2, WEDGE 3, ORBIT 3, SPIRAL 2. Existing spawn opportunities/current capacity remain authoritative; simulation time owns route progress; player/FOTON formation ownership stays separate.

J3C-C convoy/leader-follower, fake retreat, portal ambush, encirclement and staggered-artillery patterns remain **DEFERRED / NOT CURRENTLY JUSTIFIED**. They are not cancelled, but require a future dedicated issue proving distinct tactical value and bounded extra state.

---

## J4 — Tactical Enemy Families
Status: **DEPLOYED / FROZEN CURRENT JUSTIFIED SCOPE**

Goal: add enemies whose behavior creates a new tactical decision. J4 must not become a catalog of HP/damage reskins or uncontrolled density.

Candidate long-range vocabulary remains: Shield Phalanx, Reflector Drone, Jammer, Mine Layer, Artillery Carrier, Warp Ambusher, Swarm Leech, Energy Vampire, Formation Breaker, Commander, Repair Drone, Stealth Hunter, Siege Fortress, Parasite Queen and Mirror Drone.

### J4A — Pure Tactical Enemy Family Contract
Status: **DEPLOYED / FROZEN**
Canonical: `0c3f5c668926130f7ac8044cff8b619302949225`  
Issue #314 / PR #315

Architecture discovery showed that the repo already contained six advanced `EnemyType` values with runtime behavior seams but absent from normal Campaign/Infinite enemy composition. J4A therefore reused the existing catalog instead of adding a parallel type system.

Certified first-family mapping:
- `RIFT_HUNTER` → `WARP_AMBUSHER` — timing pressure / `RIFT_LOCK` / dodge after commit;
- `SIEGE_PRISM` → `ARTILLERY_CARRIER` — range control / `SIEGE_VOLLEY` / break artillery envelope;
- `SWARM_REAVER` → `FORMATION_BREAKER` — swarm cohesion pressure / `REAVER_APPROACH` / intercept before disruption;
- `VOID_ANCHOR` → `JAMMER` — control-source pressure / `ANCHOR_FIELD` / exit or destroy source.

J4A properties:
- exactly four immutable 1:1 family ↔ existing type profiles;
- deterministic lookup and fail-closed unsupported types;
- explicit tactical question, telegraph, counterplay, priority and control-pressure metadata;
- shared zero-authority contract: no spawn authority, entity/projectile collections, full-array scans, cap mutation or support-entity creation;
- no live spawn/progression adoption;
- no `EnergySwarmGame.tsx`, `types.ts`, Campaign/Infinite descriptor, stat tuning, cap/budget, J1/J2/GAIA/FOTON GLB or player/FOTON formation change.

`MINE_WEAVER` and `MIRROR_WARDEN` remain intentionally **DEFERRED** from the tactical-family contract because the current runtime does not yet implement the mine/mirror semantics their names promise.

Exact deployment anchors:
- pre-PR head `8bbce75c6bbd6e1fbcb7205ed7bcb80d9121f767`, run `38488019246` / job `115606272019` GREEN;
- final PR head `55a8abe0de9063b3d937ffca2f52ec9ec283309f`;
- PR CI `38488256442` / job `115607044338` GREEN;
- PR Android `38488256429` / job `115607044509` GREEN;
- canonical `0c3f5c668926130f7ac8044cff8b619302949225`;
- main CI `38488402612` / job `115607525382` GREEN;
- main Android `38488402647` / job `115607525424` GREEN;
- Pages `38488489012` build + deploy GREEN.

### J4B — Narrow Live Warp Ambusher Adoption
Status: **DEPLOYED / FROZEN**
Canonical: `1023cee74d1c32a379bf542551397ae134f43573`  
Issue #318 / PR #319

J4B activated exactly one J4A family: `RIFT_HUNTER` → `WARP_AMBUSHER`.

Certified live policy:
- Campaign disabled;
- Infinite minimum sector 26;
- milestone and recovery sectors excluded;
- sparse `(sector - 10) % 4 === 0` sector cadence;
- final wave only;
- exactly one deterministic replacement of an existing spawn-budget ordinal;
- first reachable live sector 34;
- tactical spawn excluded from generic random-elite overlay;
- no density, cap, budget, timer, collection or second-director increase;
- evolved-enemy and J3 formation authorities remain isolated;
- existing `RIFT LOCK` gives the pre-commit cue/counterplay.

Exact deployment anchors:
- pre-PR head `d758c4a38575002b6a59242f2894fc4e8e235fb0`, run `38489976346` / job `115612611028` GREEN;
- final PR head `5a29b7af53b9f62b017c54cde7ed87e00c04216b`;
- PR CI `38490183094` / job `115613270626` GREEN;
- PR Android `38490183041` / job `115613270479` GREEN;
- canonical `1023cee74d1c32a379bf542551397ae134f43573`;
- main CI `38490426895` / job `115614058362` GREEN;
- main Android `38490426903` / job `115614058464` GREEN;
- Pages `38490505690`, build `115614310963` + deploy `115614421521` GREEN.

### J4C-A — Pure Siege Volley Telegraph Contract
Status: **DEPLOYED / FROZEN**
Canonical: `4cb5fb320c4bed4fa884ede312c4f3c323cdc5c6`  
Issue #322 / PR #323

J4C-A created the pure fairness contract required by `ARTILLERY_CARRIER / SIEGE_PRISM` before any additional live adoption:
- 700 ms simulation-time telegraph;
- target locked at telegraph start;
- `IDLE → TELEGRAPH → COMMIT` state machine;
- exact one-shot COMMIT edge with explicit acknowledgement;
- `SIEGE_VOLLEY` + `BREAK_ARTILLERY_ENVELOPE` projection metadata;
- invalid input fail-closed;
- zero live runtime authority.

No runtime/renderer/progression/cap or `SIEGE_CATHEDRAL` composition changes occurred in J4C-A.

Exact deployment anchors:
- pre-PR head `d4963c8d435996adf39e6df582ba7c15540d3ab9`, run `38492253039` / job `115619974269` GREEN;
- final PR head `1724dc4fd199e7be50f1110c7606d54bbe2b1543`;
- PR CI `38492465605` / job `115620646548` GREEN;
- PR Android `38492465573` / job `115620646615` GREEN;
- canonical `4cb5fb320c4bed4fa884ede312c4f3c323cdc5c6`;
- main CI `38492584499` / job `115621028391` GREEN;
- main Android `38492584516` / job `115621028451` GREEN;
- Pages `38492658345`, build `115621262106` + deploy `115621344438` GREEN.

### J4C-B — Live Siege Volley Telegraph Integration
Status: **DEPLOYED / FROZEN**
Canonical: `2e16ff9a577128ffb06211b612116553928c8cda`
Issue #326 / delivery PR #327 + exact-scope remediation PR #328

Certified live policy:
- all currently existing `SIEGE_PRISM`, including `SIEGE_CATHEDRAL` support, use the 700 ms target-lock telegraph;
- target remains fixed; COMMIT remains latched under projectile budget rejection; ACK/reset occurs only after successful projectile creation;
- existing three-projectile volley, speed `4.0`, spread `0.12`, cooldown `150 + Math.random() * 70`, caps/budgets and boss-support policy remain unchanged;
- no second collection/director, family-only full-array scan or Campaign/Infinite progression expansion;
- J4C-A `siegeVolleyTelegraph.ts` remains unchanged.

PR #327 initially contained one extra historical certification-file adaptation. Fail-closed PR #328 restored it to pre-J4C-B state. Final `19beb0abf2b17d391834cb6336419ed4ead6819c...2e16ff9a577128ffb06211b612116553928c8cda` diff is exactly the six approved J4C-B files.

Exact final anchors:
- remediation pre-PR `b5a768e919b9a75fb71a1a627bc521f74661a13b`, run `38506960989` / `115666560063` GREEN;
- PR #328 final head `bba0fa7a94cd45084c55149f80714dd1155a5baa`;
- PR CI `38507157523` / `115667172988` GREEN; Android `38507157492` / `115667172667` GREEN;
- canonical `2e16ff9a577128ffb06211b612116553928c8cda`, parent `8dec7945338e0152e83536605b18da63879818fe`, tree `8435b068908d82225b5442c8865578c46fedc243`;
- main CI `38507278577` / `115667552196` GREEN; Android `38507278528` / `115667552109` GREEN;
- Pages `38507354839`, build `115667791913` + deploy `115667881614` GREEN.

### J4C-C — Controlled Normal-Progression Siege Adoption
Status: **DEPLOYED / FROZEN**
Canonical: `1131c06db406ca0170d5dad33ecb7f4610a06b96`
Issue #331 / PR #332

Certified live policy:
- Campaign disabled;
- Infinite HIGH_PRESSURE minimum sector 51;
- deterministic SIEGE cadence `(sector - 52) % 8 === 0`;
- milestone/recovery excluded; final wave only; milestone descriptor null;
- exactly one existing spawn-budget ordinal replaced at `Math.floor(enemyBudget / 2)`;
- no density increase;
- first reachable normal SIEGE sectors 52, 68, 84, 92, 108, 116, 124, 132...;
- J4B RIFT cadence remains exact and disjoint;
- J4C-B 700 ms target-lock/COMMIT/ACK behavior remains exact;
- projectile count 3, speed 4.0, spread 0.12 and cooldown `150 + Math.random() * 70` unchanged;
- `SIEGE_CATHEDRAL` support remains SIEGE_PRISM, max count 2, cooldown 8000 ms;
- caps/budgets/entity arrays, evolution and J3 formation isolation remain authoritative;
- no new EnemyType, collection, director, full-array family scan, independent timer or RNG authority.

Exact deployment anchors:
- pre-PR `c6dc7dc48dd8028dd6de1f6f9fae79a2d20b6301`, run `38556345439` / job `115826341912` GREEN including scope guard + Android APK;
- final PR #332 head `e80a54c9823939862beba6a620e4ed363535b61e`;
- PR CI `38556750449` / `115827692257` GREEN; Android `38556750462` / `115827691810` GREEN;
- canonical `1131c06db406ca0170d5dad33ecb7f4610a06b96`, parent `72c4359af106d6f955e9932c6c72a836b2922ab8`, tree `ff27ceedc5460d98fefe373850d1fe20e3272098`;
- main CI `38556901537` / `115828194301` GREEN; Android `38556901696` / `115828194800` GREEN;
- Pages `38557000846`, build `115828516452` + deploy `115828677107` GREEN.

`FORMATION_BREAKER` and `JAMMER` remain **DEFERRED / NOT CURRENTLY JUSTIFIED** pending independent hard-control spacing/recovery proof. `MINE_WEAVER` / `MIRROR_WARDEN` remain deferred until genuine mine/mirror mechanics exist. No J4D slice is invented merely to keep sequence. J3C-C remains deferred, not cancelled.

### J4 design gate
Every proposed family must answer:

**“What new decision does this force the player to make?”**

Reject or redesign a family if its only answer is “shoot it longer,” “avoid more bullets,” or “deal with more enemies.”

---

## J5 — Priority Targets & Chain-Reaction Combat
Status: **ACTIVE PROGRAM**

Goal: Command Cores, linked formations, destructible priority nodes, tactical chain reactions and formation collapse after key-target destruction. Reward tactical solutions without bypassing caps.

### J5A — Pure Priority-Target Contract
Status: **DEPLOYED / FROZEN**
Canonical: `df60f62565a1d3cdf6058d2e1a4049f5870f27b7`
Issue #335 / PR #336

Certified contract:
- exactly one immutable semantic profile: `COMMAND_CORE` / `Command Core`;
- tactical decision `FOCUS_CORE_TO_BREAK_LINK`, priority `HIGH`;
- objective `BREAK_COMMAND_LINK`;
- deterministic defeat signal `COMMAND_LINK_BROKEN`;
- `SIGNAL_ONLY` effect mode;
- unsupported profile IDs fail closed;
- no damage, linked-target kill, score, reward or formation mutation;
- zero spawn/entity/projectile collection, damage, defeat, score, reward, formation, clock, RNG, full-array scan, cap-mutation or entity-creation authority;
- no new `EnemyType`, runtime field or live adoption.

Exact deployment anchors:
- pre-PR `257cfb8dd7a21a046cf87c2c2af9b501e462f3ad`, run `38559123546` / job `115835528447` GREEN including scope guard + Android APK;
- final PR #336 head `72ea40a2935df0d3bbf7b4db45be5a8647380524`;
- PR CI `38559564286` / `115836993908` GREEN; Android `38559564155` / `115836993731` GREEN;
- canonical `df60f62565a1d3cdf6058d2e1a4049f5870f27b7`, parent `907bce8c494a5c7b9a4965e09dca677d919560f4`, tree `8296313607b688bef5412fcb046341e609852ce4`;
- main CI `38559826229` / `115837852423` GREEN; Android `38559826354` / `115837852853` GREEN;
- Pages `38559959364`, build `115838294773` + deploy `115838455401` GREEN.

### J5B — Pure Command-Link Binding Contract
Status: **DEPLOYED / FROZEN**
Canonical: `f868058889b24fecbd97f968e932890248ca2b33`
Issue #339 / PR #340

Certified contract:
- supported bounded J3 group sizes exactly 2 and 3;
- deterministic core index 0 from existing J3 member order;
- member 0 = semantic `COMMAND_CORE`; remaining valid members = `LINKED_MEMBER`;
- J5A identity referenced type-only;
- binding mode `BINDING_ONLY`;
- linked metadata `[1]` or `[1,2]` only;
- invalid group ids/counts/indices fail closed;
- no new EnemyType/Enemy field/live adoption;
- no J3/J5A mutation, damage/defeat/score/reward, collection/scan, clock/RNG or cap authority.

Exact deployment anchors:
- pre-PR `66b6e6276d6229f74476a541c220e203a0f3dc8b`, run `38568941468` / job `115868727522` GREEN including scope guard + Android APK;
- final PR #340 head `7d59c94bd7fb79ec9b577d47712ebba751488efb`;
- PR CI `38569355540` / `115870150075` GREEN; Android `38569355236` / `115870147877` GREEN;
- canonical `f868058889b24fecbd97f968e932890248ca2b33`, parent `efe68202b4046c7f4b2df3cae951908b9e012d3b`, tree `336ef4e31a59aea1890154f9b853b84e1409711a`;
- main CI `38569599501` / `115870991101` GREEN; Android `38569599482` / `115870990530` GREEN;
- Pages `38569726643`, build `115871441654` + deploy `115871606433` GREEN.

### J5C — Live Command-Core Priority Presentation
Status: **DEPLOYED / FROZEN**
Canonical: `55d824d2b9cfaf6bb8cd97a032866b1fbcfa92fb`
Issue #343 / PR #344

Certified behavior:
- current active J5B binding is derived on demand from `enemy.enemyFormation` inside the existing Canvas enemy pass;
- only current valid `COMMAND_CORE` gets one bounded static ring + top chevron;
- linked/invalid/no-formation members receive no marker;
- J3 lifecycle clearing automatically removes the marker;
- no text, cross-entity linked line, second enemy scan or collection;
- no new EnemyType/Enemy field/runtime state;
- no spawn/progression, damage, defeat, score, reward, timer/RNG or chain-reaction authority;
- existing enemy body/telegraphs remain before the marker and damaged health bar remains after it.

Exact deployment anchors:
- pre-PR `8b493a1e09c03620df9f5d2785fd8e16d062a062`, run `38573138443` / job `115883247207` GREEN including scope guard + Android APK;
- final PR #344 head `36f4895119d5642624135d5a6af072236faf76d2`;
- PR CI `38573643779` / `115884993730` GREEN; Android `38573643737` / `115884991853` GREEN;
- canonical `55d824d2b9cfaf6bb8cd97a032866b1fbcfa92fb`, parent `8a1e17b87cdd8508453814454175ef7f0b95c6ce`, tree `442611df6707d609c73637da48ef70096feb902d`;
- main CI `38573884299` / `115885813621` GREEN; Android `38573884191` / `115885814664` GREEN;
- Pages `38574014576`, build `115886257262` + deploy `115886451208` GREEN.

### J5D — Pure Command-Link Break Resolution Contract
Status: **DEPLOYED / FROZEN**
Canonical: `99410123a8f20d15a88cd20ada34523ce4497006`
Issue #347 / PR #348

Certified behavior:
- composes J5A `COMMAND_LINK_BROKEN` with current J5B binding;
- only valid current `COMMAND_CORE` resolves;
- size-2 linked indices `[1]`; size-3 linked indices `[1,2]`;
- immutable intent `DETACH_LINKED_MEMBERS`, effect mode `INTENT_ONLY`;
- linked/invalid facts fail closed;
- no live enemy ids, lookup, scan, collection, entity/formation mutation, damage/kill, score/reward/economy, timing/RNG or cap/budget authority;
- J3/J5A/J5B/J5C remain unchanged.

Exact deployment anchors:
- pre-PR `68d5c269f62415605c6265a1acef572f92438fa0`, run `38612549835` / job `116019315964` GREEN including scope guard + Android APK;
- final PR #348 head `8739313a605ccf33ddfdf69ae5e73d04f26f5957`;
- PR CI `38613042191` / `116020992856` GREEN; Android `38613042036` / `116020992132` GREEN;
- canonical `99410123a8f20d15a88cd20ada34523ce4497006`, parent `025bc875a4b3a9dc5d1e690591b6ae0f5af6a6ec`, tree `1240e692acb4622389748c9328b5b88e8563560b`;
- main CI `38613516322` / `116022626176` GREEN; Android `38613516479` / `116022628100` GREEN;
- Pages `38613648878`, build `116023067863` + deploy `116023290302` GREEN.

### J5E — Controlled Live Command-Link Detach Application
Status: **DEPLOYED / FROZEN**
Canonical: `6aa63e9643a2521738b3b6afebfb0856f48bd3fd`
Issue #351 / PR #352

Certified live behavior:
- a valid current `COMMAND_CORE` defeat is observed only through existing centralized `registerCombatDefeat(...)`;
- exactly one pending bounded break intent is retained; no queue, map, set or group/entity index exists;
- the intent is captured before the existing enemy logic traversal and applied only inside that traversal;
- only living linked members with the same `groupId` and a bounded J5D linked-member index detach;
- detach mutates only formation ownership via `enemy.enemyFormation = undefined`, after which existing legacy movement remains authoritative;
- captured intent is consumed by identity guard without erasing a newer intent;
- pending intent resets with all J3 director reset boundaries;
- no second enemy scan/collection, Enemy/EnemyType field, damage/kill, score/reward/economy, spawn/progression, clock/RNG, cap/budget or entity create/remove authority;
- J3 formation authority and frozen J5A–J5D semantics remain unchanged.

Exact deployment anchors:
- pre-PR `868ff46c057ec589a0984a8b24fdd824a63bd903`, run `38680675400` / job `116244260573` GREEN including exact scope + Android APK;
- final PR #352 head `92fcb5930029ca42cc8fb191458397c4610b2f7e`;
- PR CI `38680965872` / `116245194669` GREEN; Android `38680965875` / `116245194752` GREEN;
- canonical `6aa63e9643a2521738b3b6afebfb0856f48bd3fd`, parent `b317faa1cb3403fe11baaa71e6c072b8a97a3062`, tree `b7b65424cbfe1b574a632364e8cf028b1da155fa`;
- main CI `38681102491` / `116245629498` GREEN; Android `38681102495` / `116245629757` GREEN;
- Pages `38681179362`, build `116245865182` + deploy `116245989502` GREEN.

### J5F-A — Pure Optional Command-Link Disruption Pulse Contract
Status: **DEPLOYED / FROZEN**
Canonical: `90f3fc82271654e6d7a7076474ae46efd02775e4`
Issue #355 / PR #356

Certified contract:
- consumes frozen J5D `CommandLinkBreakResolution` as a type-only prerequisite;
- explicit source freshness is caller-supplied as `CURRENT` / `STALE`, and `STALE` fails closed;
- valid projections use `COMMAND_LINK_DISRUPTION_PULSE`, `PULSE_LINKED_MEMBERS`, `PROPOSAL_ONLY`, target role `LINKED_MEMBER`;
- bounded target member indices remain exactly `[1]` or `[1,2]`;
- current-formation and living-target requirements are metadata only;
- explicit zero-effect facts keep damage, kills, score, rewards, projectiles and formation mutation false;
- no runtime/entity lookup, scan, collection, clock/RNG, cap/budget or mutation authority;
- no live adoption and no collision with existing combat-resonance chain semantics.

Exact deployment anchors:
- pre-PR `074d8f38a24eab6eb3a5adf448cd7fbdee8d57f8`, run `38683045891` / job `116251639676` GREEN including exact scope + Android APK build/verify/upload;
- final PR #356 head `d5afcd198efbefa16eeb4659650db3f0ab7eebc8`;
- PR CI `38683347951` / `116252576394` GREEN; Android `38683348067` / `116252576749` GREEN;
- canonical `90f3fc82271654e6d7a7076474ae46efd02775e4`, parent `a94883c1532ba14e9c81b0a16e923a730aa1275d`, tree `e0226f6da7fb90b54a612b5e42716437b19ca171`;
- main CI `38683470982` / `116252958810` GREEN; Android `38683471108` / `116252959290` GREEN;
- Pages `38683544584`, build `116253182791` + deploy `116253277337` GREEN.

### J5F-B — Pure Current Command-Link Pulse Target Eligibility Contract
Status: **DEPLOYED / FROZEN**
Canonical: `9812592dd77a0dd4e6364d57857f4c9065757d49`
Issue #359 / PR #360

Certified behavior:
- composes frozen J5F-A proposal semantics with current J5B binding for exactly one caller-supplied candidate;
- requires `COMMAND_LINK_DISRUPTION_PULSE` / `PULSE_LINKED_MEMBERS` / `PROPOSAL_ONLY` / `LINKED_MEMBER` semantics and all J5F-A zero-effect flags;
- requires valid current J5B `LINKED_MEMBER`, same `groupId`, explicit `isLiving === true`, and exact bounded target shape `[1]` for size 2 or `[1,2]` for size 3;
- output is immutable `ELIGIBLE_ONLY` metadata;
- no live IDs, lookup/scan/collection, health mutation, damage/kill/defeat, score/reward, projectile/formation mutation, clock/RNG, cap/budget or entity create/remove authority;
- no `EnergySwarmGame.tsx` adoption and no disruption pulse is live.

Exact deployment anchors:
- pre-PR `66472e7939ec4230b1d8fba8ba520417254523ed`, run `38685113993` / job `116258071836` GREEN including exact scope + Android APK;
- final PR #360 head `e286127a0fc4d78d05a1f37e2427296376d5819e`;
- PR CI `38685413567` / `116259016390` GREEN; Android `38685413708` / `116259016971` GREEN;
- canonical `9812592dd77a0dd4e6364d57857f4c9065757d49`, parent `78737695d82f6bcdf76c1bc68e6c849c457711c0`, tree `e248768164f391adec3d71955f6b065fa1b4b787`;
- main CI `38685585231` / `116259545039` GREEN; Android `38685585286` / `116259545298` GREEN;
- Pages `38685655054`, build `116259769899` + deploy `116259848508` GREEN.

### J5F-C — Pure Non-Lethal Command-Link Pulse Damage Safety Envelope
Status: **DEPLOYED / FROZEN**
Canonical: `53ff3b1fa0da58ea9bb7259162a98f3dac17df77`
Issue #363 / PR #364

Certified behavior:
- consumes one already-eligible current linked target plus caller-supplied `currentHealth`, `maxHealth` and `proposedDamage`;
- requires finite `currentHealth >= 1`, finite `maxHealth >= 1`, `currentHealth <= maxHealth`, finite `proposedDamage > 0`;
- preserves an exact 1 HP non-lethal floor and clamps overkill rather than killing;
- `0 < currentHealth < 1` fails closed rather than inventing healing;
- does not choose or tune proposed damage;
- output is immutable `NON_LETHAL_PROJECTION_ONLY` metadata;
- no live health mutation, defeat, score/reward/drop, milestone/boss, scan/lookup/collection, timing/RNG, cap/budget or entity authority;
- J5F-A/J5F-B/J5B and live runtime remain frozen.

Exact deployment anchors:
- pre-PR `345d84493e10d2b2e6308811206e3597755d6b5a`, run `38686699512` / job `116263082196` GREEN including exact scope + Android APK;
- final PR #364 head `e131110e5d586660b755dada17be0d011faee682`;
- PR CI `38686990002` / `116264005879` GREEN; Android `38686989965` / `116264005932` GREEN;
- canonical `53ff3b1fa0da58ea9bb7259162a98f3dac17df77`, parent `7a24f7a747a2d2eb2fb79b4eb4a249ded67a8193`, tree `a6067fdfdc5847fa7b6c0f73894bfa889fec24e4`;
- main CI `38687143378` / `116264489750` GREEN; Android `38687143454` / `116264489903` GREEN;
- Pages `38687226083`, build `116264740311` + deploy `116264855735` GREEN.

### J5F-D — Pure Effective Trigger-Damage Source Projection
Status: **DEPLOYED / FROZEN**
Canonical: `113865079ac4581c90356c3c218a28f8f88b6ef7`
Issue #367 / PR #368

Certified behavior:
- source kind is exactly `DIRECT_HIT` or `SPLASH_HIT`;
- caller supplies already-resolved hit damage plus source health immediately before that hit;
- `effectiveTriggerDamage = min(resolvedSourceDamage, sourceHealthBeforeHit)`;
- `proposedPulseDamage` exactly equals that bounded scalar;
- overkill cannot transfer into pulse magnitude;
- output is immutable `EFFECTIVE_TRIGGER_DAMAGE_ONLY` metadata;
- no multiplier/percentage/radius/cadence/timer/RNG;
- no live IDs, lookup/scan/collection, health mutation, defeat/score/reward/drop, projectile/spawn, formation, cap/budget or entity authority;
- J5F-A/B/C and live runtime remain unchanged.

Exact deployment anchors:
- pre-PR `aa8fe452636ef1857d1664aba3968896a0316731`, run `38721123148` / job `116375646962` GREEN including exact scope + Android APK;
- final PR #368 head `407a647ec511f8a6fb1a44ee13bd3eac9069db0b`;
- PR CI `38721504340` / `116376911142` GREEN; Android `38721504506` / `116376911875` GREEN;
- canonical `113865079ac4581c90356c3c218a28f8f88b6ef7`, parent `bc75751362e0dc8ed79c7b4688aa355ff9ae9648`, tree `c63c7aa7634f2d8ee8555f11da1648a8a83d2af8`;
- main CI `38721717159` / `116377625580` GREEN; Android `38721717129` / `116377625451` GREEN;
- Pages `38721821467`, build `116377981983` + deploy `116378114444` GREEN.

### J5F-E — Controlled Live Command-Link Disruption Pulse Application
Status: **DEPLOYED / FROZEN**
Canonical: `9554358005d6d092341f4f65d8b986090307f8b5`
Issue #371 / PR #372

Certified live behavior:
- composes frozen J5F-A/B/C/D through one bounded live adapter;
- direct/splash paths capture local pre-hit source health before the existing damage subtraction;
- only the exact lethal hit against a valid current Command Core may raise one scalar pending pulse;
- current linked-member eligibility and non-lethal health projection are consumed inside the already-existing enemy traversal and before J5E detach;
- linked mutation is limited to the frozen J5F-C `resultingHealth` with exact 1 HP floor;
- linked targets never receive `isDead` from the pulse and never generate pulse defeat, score, reward, drop or persistence attribution;
- pending pulse is consumed with identity guard and reset at the same three J3/J5E lifecycle boundaries;
- no second scan/index/collection, Enemy field, new projectile, timer/RNG, spawn/progression, cap/budget, presentation or audio authority.

Exact deployment anchors:
- DOC28 baseline `022741e5c500dea2947241d4bb8c6cb8d004772c`;
- pre-PR `098726ad50eb74686fd186703d73a46e79eda340`, run `38729351008` / job `116402995881` GREEN including exact scope + Android APK;
- final PR #372 head `98761ecaaaa0e873d8a0468d92ed0c70ce45cf57`;
- PR CI `38729931559` / `116404920626` GREEN; Android `38729931466` / `116404919622` GREEN;
- canonical `9554358005d6d092341f4f65d8b986090307f8b5`, parent `022741e5c500dea2947241d4bb8c6cb8d004772c`, tree `7cdc717088f0b4543564d0db404d444fcb2ac8d2`;
- main CI `38730136916` / `116405605392` GREEN; Android `38730137080` / `116405605024` GREEN;
- Pages `38730253083`, build `116405984608` + deploy `116406188447` GREEN.

## J6 — Dynamic Mid-Sector Events
Status: ACTIVE PROGRAM / CONTRACT-FIRST

### J6A — Pure Dynamic Mid-Sector Event Opportunity Contract
Status: **DEPLOYED / FROZEN**
Canonical: `69ac8a1a83d2f6bbe6a989a3a819fac438e854c1`
Issue #375 / PR #376

Certified behavior:
- Infinite-only and bounded to certified wave counts 3–7;
- Campaign, recovery sectors, milestone waves, first/final waves and malformed facts fail closed;
- exactly one interior opportunity wave is selected deterministically per valid sector identity from existing `seed + recipeId + sector + waveCount` facts;
- output is immutable `DYNAMIC_MID_SECTOR_EVENT_OPPORTUNITY` / `OPPORTUNITY_ONLY` metadata;
- no event identity/profile, live effect, environmental/mutator mutation, spawn/progression, entity/projectile collection, combat/economy, entity lookup/scan, timer/RNG or cap/budget authority;
- existing Infinite and environmental authorities remain unchanged.

Exact deployment anchors:
- DOC29 baseline `0dca89678698be0557f0500590f27c9f53ab1548`;
- pre-PR `8dd38514738e0873364851bea472413b44b5539c`, run `38741496798` / job `116444066588` GREEN including exact scope + Android APK;
- final PR #376 head `38a8e76c147ca682143e44f2cd57dca0d0bc54af`;
- PR CI `38780778121` / `116580097952` GREEN; Android `38780778404` / `116580099652` GREEN;
- canonical `69ac8a1a83d2f6bbe6a989a3a819fac438e854c1`, parent `0dca89678698be0557f0500590f27c9f53ab1548`, tree `d3aac694e27af9c4fddcbce7c07d6766c84f1146`;
- main CI `38781077090` / `116581119711` GREEN; Android `38781076913` / `116581119364` GREEN;
- Pages `38781193209`, build `116581519042` + deploy `116581668287` GREEN.

### J6B-A — Pure Dynamic Mid-Sector Event Identity Vocabulary Contract
Status: **DEPLOYED / FROZEN**
Canonical: `204566693978adabba7e66995c88ae2f85818f8b`
Issue #379 / PR #380

Certified behavior:
- exactly five immutable identities: `SOLAR_STORM`, `QUANTUM_RIFT`, `BLACKOUT_SURGE`, `CRYSTAL_RUSH`, `DYSON_ECLIPSE`;
- exact deterministic lookup by supported ID; padded/empty/lowercase/deferred/unsupported values fail closed;
- every profile is `ENVIRONMENTAL_IDENTITY` / `IDENTITY_ONLY`;
- no opportunity selection, event selection, mutator/effect mapping or live execution;
- no import/adoption by J6A, Infinite directors, mutator/environment runtime files or `EnergySwarmGame.tsx`;
- no spawn/progression, collection, combat/economy, environment, entity lookup/scan, timing/RNG, cap/budget or entity authority.

Exact deployment anchors:
- DOC30 baseline `26554f20648f0a27c2c510c055cbec81c43416c7`;
- pre-PR `cd2abd12e20082382611bf08cac2d3d89f693adc`, run `38782799375` / job `116587050168` GREEN including exact scope + Android APK;
- final PR #380 head `2aae2803d302bea80c3f0b0748bda10c6fcaffcd`;
- PR CI `38783326052` / `116588875589` GREEN; Android `38783326187` / `116588876111` GREEN;
- canonical `204566693978adabba7e66995c88ae2f85818f8b`, parent `26554f20648f0a27c2c510c055cbec81c43416c7`, tree `3f6d2359ca87ec31853fbbfccc6bb1ffb6fb68ba`;
- main CI `38783605087` / `116589825599` GREEN; Android `38783604964` / `116589827934` GREEN;
- Pages `38783697902`, build `116590143603` + deploy `116590341097` GREEN.

### J6B-B — Pure Deterministic Dynamic Event Identity Selection Contract
Status: **DEPLOYED / FROZEN**
Canonical: `dcd39a173da7635bf85db6844dc86aeca6c1f38c`
Issue #383 / PR #384

Certified behavior:
- consumes only valid current J6A `DYNAMIC_MID_SECTOR_EVENT_OPPORTUNITY` / `OPPORTUNITY_ONLY` / `INFINITE` metadata;
- validates exact bounded interior-wave consistency, lowercase 8-hex `identityFingerprint`, canonical opportunity ID and all J6A zero-authority flags;
- deterministically selects exactly one frozen J6B-A ID via `parseInt(identityFingerprint, 16) % 5`;
- emits immutable `DYNAMIC_MID_SECTOR_EVENT_SELECTION` / `SELECTION_ONLY` metadata carrying source opportunity identity + selected event identity;
- malformed, padded, forged, unsupported or tampered input fails closed;
- owns semantic event selection only;
- no new RNG/clock/seed authority, mutator/effect mapping, live execution, environment mutation, spawn/progression, collection, combat/economy, lookup/scan, cap/budget or entity create/remove/mutate authority;
- no `EnergySwarmGame.tsx`, Infinite-director or environmental-runtime adoption.

Exact deployment anchors:
- DOC31 baseline `6cadd1db296d5249ae236121088307f480685fe0`;
- pre-PR `2a82945747f6bd3b855a2a7b84c5db9d084fed38`, run `38808432120` / job `116675222019` GREEN including exact scope + Android APK;
- final PR #384 head `acc98dccff52812b12e23bd26fb7b21e9889d06b`;
- PR CI `38808893011` / `116676780125` GREEN; Android `38808893023` / `116676778988` GREEN;
- canonical `dcd39a173da7635bf85db6844dc86aeca6c1f38c`, parent `6cadd1db296d5249ae236121088307f480685fe0`, tree `531fad95ced691ad24a0c2391fe9d30954f51e01`;
- main CI `38809192748` / `116677795292` GREEN; Android `38809192821` / `116677795333` GREEN;
- Pages `38809290030`, build `116678137605` + deploy `116678316176` GREEN.

### J6B-C — Pure Dynamic Event Effect-Mapping Compatibility Contract
Status: **DEPLOYED / FROZEN**
Canonical: `1ad68edc1fd15ffa15e1cf6aa139d3d97a547623`  
Issue #387 / PR #388

J6B-C freezes compatibility metadata only between the deterministic J6B-B selection and existing Infinite mutator semantics:
- `SOLAR_STORM` → `ELECTRICAL_STORM`;
- `QUANTUM_RIFT` → `MAGNETIC_DRIFT`;
- `BLACKOUT_SURGE` → `REDUCED_VISIBILITY`;
- `CRYSTAL_RUSH` → `UNSTABLE_RESOURCE_FIELDS`;
- `DYSON_ECLIPSE` → explicit `UNMAPPED` / fail-closed.

Certified boundaries:
- valid current J6B-B `SELECTION_ONLY` input only;
- immutable `COMPATIBILITY_ONLY` result;
- no live effect application or environment/runtime mutation;
- no duplicated effect magnitudes or clamps;
- no `EnergySwarmGame.tsx`, spawn/progression, collection, combat/economy, entity lookup/scan, timer/RNG/seed/recipe, cap/budget or entity create/remove/mutate authority;
- existing `runtimeMutatorEffects.ts`, `runtimeEnvironmentalFields.ts` and Infinite recipe/director remain authoritative.

Exact deployment anchors:
- pre-PR `b4ab4fa7afa46061d92eec42befd9bdc023cbbb1`, run `38811558582` / job `116685777412` GREEN including Android APK;
- final PR head `b19e97adfead5dd5734f8bc19614af29ec474e37`;
- PR CI `38811968442` / `116687154525` GREEN; Android `38811968545` / `116687155789` GREEN;
- canonical `1ad68edc1fd15ffa15e1cf6aa139d3d97a547623`, parent `007f1c6744300d47d9e1f43f9cb943e74d70379d`, tree `4fad16370a449e88810a5a4742ba2e9d1c969f17`;
- main CI `38814014351` / `116694041805` GREEN; Android `38814014266` / `116694040113` GREEN;
- Pages `38814144837`, build `116694455490` + deploy `116694621071` GREEN.

### J6B-D — Controlled Live Dynamic Event Adoption
Status: **DEPLOYED / FROZEN**
Canonical: `247d976b6e2cc634cbc5158cdff46ac42b51c5fc`  
Issue #391 / PR #392

J6B-D adopts the frozen J6A → J6B-B → J6B-C chain through one immutable `CURRENT_WAVE_ONLY` descriptor overlay in the existing runtime projection cache.

Certified boundaries:
- Campaign unchanged;
- single live seam in `runtimeProjectionBundleCache.ts`; `EnergySwarmGame.tsx` unchanged;
- mapped events add at most one already-existing Infinite mutator, deduplicated;
- existing runtime mutator/environment magnitudes, clamps and electrical-storm telegraph remain authoritative;
- `DYSON_ECLIPSE` remains `UNMAPPED` / fail-closed with no descriptor change;
- lifecycle expires naturally when `RuntimeProgressionState` advances;
- no new timer/RNG/seed/clock, recipe/session mutation, collection/scan, spawn/progression, combat/economy, cap/budget, FOTON or formation authority.

Exact deployment anchors:
- pre-PR `559c44d3e7aea58e79cce5a0b30d1d28571f8959`, run `38817464641` / job `116705630774` GREEN including Android APK;
- final PR head `479241ee9604b017ac4d062e80ebe353878aab46`;
- PR CI `38817902374` / `116707069836` GREEN; Android `38817902279` / `116707067282` GREEN;
- canonical `247d976b6e2cc634cbc5158cdff46ac42b51c5fc`, parent `34168aa3ed192d72ef7100103691dff8cca7e1c9`, tree `eb0890fa715fa29dfb4c124b0508bb9cdb0adfc3`;
- main CI `38818106840` / `116707736739` GREEN; Android `38818106804` / `116707736723` GREEN;
- Pages `38818209120`, build `116708074756` + deploy `116708178250` GREEN.

## J7 — Bonus Challenge Rounds
Status: **DEPLOYED / FROZEN — FIRST CERTIFIED VERTICAL SLICE**

20–40 s rhythm breakers remain the long-range design vocabulary: precision, rescue, collection, evasive corridors, pursuit, affinity puzzles, obstacle navigation, timed survival and survival without firing.

### J7A — Pure Timed Survival Bonus Challenge Profile Contract
Status: **DEPLOYED / FROZEN**
Canonical: `8a5244e770c360d13b8218599ba3f49bbaa03b46`  
Issue #395 / PR #396

J7A selected the smallest justified first challenge without live adoption:
- `TIMED_SURVIVAL` / `Timed Survival`;
- family `RHYTHM_BREAKER`;
- mode `PROFILE_ONLY`;
- objective `SURVIVE_UNTIL_TIME_EXPIRES`;
- compatibility intent `TIMEBOX`;
- duration window only `20000..40000 ms`;
- no exact duration, opportunity/cadence, source-mode, timer/pause, spawn/arena, score/reward/economy, HUD or runtime mutation authority.

Existing runtime `TIMEBOX` completion and pause-safe game-loop timing remain separate authorities; J7A does not import into live runtime code. Other candidate challenge types remain uncontracted.

Exact deployment anchors:
- pre-PR `0bb6786bf20f1a3f8a8c24d8f4ec423199658f7c`, run `38849277024`, certify job `116806658248` + Android `116806889571` GREEN;
- final PR #396 head `67d6bbff8f303b51a7f84e8e18d02eb2021c4b8f`;
- PR CI `38849513155` / `116807380556` GREEN; Android `38849513130` / `116807380273` GREEN;
- canonical `8a5244e770c360d13b8218599ba3f49bbaa03b46`, parent `b858b14a2682fd5855eda5093fc6b13ec3a5653c`, tree `3bcbbf230fa83cd44dc4d23cb4339ef077fd37cd`;
- main CI `38849701016` / `116807960929` GREEN; Android `38849700878` / `116807960547` GREEN;
- Pages `38849771214`, build `116808178956` + deploy `116808274531` GREEN.

### J7B — Pure Bonus Challenge Opportunity/Cadence Contract
Status: **DEPLOYED / FROZEN**
Canonical: `93af4e999af5e3b3afed7f684706536bdfaedd89`  
Issue #399 / PR #400

Certified J7B opportunity policy:
- Infinite only;
- sector >= 33 and cadence `(sector - 33) % 10 === 0`;
- waveCount `4..7`;
- uses an existing interior slot only: wave 2 unless frozen J6 owns wave 2, then wave 3;
- no inserted wave, no copied J6 hash/RNG;
- first/final, milestone and recovery fail closed;
- challenge remains J7A `TIMED_SURVIVAL`;
- `OPPORTUNITY_ONLY` with no live execution, exact duration, descriptor mutation, timer/clock/pause, spawn/arena, progression, combat/economy, HUD, RNG/hash, scans/indexes, caps/budgets, entities/projectiles, FOTON or formation authority.

Exact deployment anchors:
- pre-PR `7757b9c780f5af4cf17f3ededc50363b1adab4ae`, run `38851031270`, certify `116812048577` + Android `116812367521` GREEN;
- final PR #400 head `0265df56ef6ebda8a887926ac810087af1432336`;
- PR CI `38851299136` / `116812860905` GREEN; Android `38851299196` / `116812860926` GREEN;
- canonical `93af4e999af5e3b3afed7f684706536bdfaedd89`, parent `bd4c5c7061337aec3c857f548e086516bbea04e0`, tree `75698c115814e371173ad3e16adc6dff6e6dba22`;
- main CI `38851462985` / `116813368003` GREEN; Android `38851462903` / `116813367709` GREEN;
- Pages `38851545491`, build `116813624422` + deploy `116813744666` GREEN.

### J7C — Pure Timed Survival Duration & TIMEBOX Projection Contract
Status: **DEPLOYED / FROZEN**
Canonical: `1ad86de5155a3e6e73630e5244f7ce7ec107f4af`  
Issue #404 / PR #405

Certified J7C contract:
- exact duration `30000 ms`;
- exact midpoint of J7A `20000..40000 ms` and below minimum normal Campaign TIMEBOX `35000 ms`;
- consumes J7A profile + J7B opportunity authority;
- immutable `PROJECTION_ONLY` TIMEBOX metadata `{ type: "TIMEBOX", durationMs: 30000 }`;
- noneligible facts fail closed;
- no live descriptor/timer/clock/pause/spawn/arena/progression/combat/economy/HUD/RNG/hash/collection/scan/cap/entity/FOTON/formation authority.

Exact deployment anchors:
- pre-PR `7716741ea46d4926672ac13a88e89b1b7ef2fc30`, run `38862130838`, certify `116846577888` + Android `116846578106` GREEN;
- final PR #405 head `e553330a434b138bb6dae304a0bffedf442403d3`;
- PR CI `38862303820` / `116847134910` GREEN; Android `38862303706` / `116847134685` GREEN;
- canonical `1ad86de5155a3e6e73630e5244f7ce7ec107f4af`, parent `af998aa40c1f767727bbe2c999b4c7b3bc872a3c`, tree `5025f401e8562cff5097a0592b9c5345ec96f366`;
- main CI `38862461080` / `116847645968` GREEN; Android `38862461028` / `116847645716` GREEN;
- Pages `38862526063`, build `116847854661` + deploy `116847951677` GREEN.

### J7D — Controlled Live Timed Survival Adoption
Status: **DEPLOYED / FROZEN**
Canonical: `9440b31b0c8dca2da0cfe92a5f02cbf7065e6d67`  
Issue #408 / PR #409

Certified J7D live policy:
- Infinite-only current-wave adoption; Campaign unchanged;
- consumes frozen J7A/J7B/J7C instead of copying profile/cadence/duration logic;
- one immutable descriptor overlay after adaptive + J6 and before downstream pressure/mutator/budget/milestone projections;
- selected descriptor must still be `BUDGET_AND_CLEAR`, otherwise fail closed;
- overlays only `TIMEBOX 30000` completion plus bounded Timed Survival wave-announcement attribution;
- spawn, pressure, modifiers, rewards, milestone, fairness, biome and source remain unchanged;
- existing runtime timer/pause/completion lifecycle remains authoritative;
- no `EnergySwarmGame.tsx` change, inserted wave, recipe/session mutation, second clock/timer/ref/director, RNG/hash, collections/scans/indexes, spawn/combat/economy, cap/budget, entity/projectile, FOTON or formation authority.

Exact deployment anchors:
- initial diagnostic run `38863999290` exposed only a static test assertion mismatch (`cursor.remainingTimeMs` vs frozen `snapshot.remainingTimeMs`); Android `116852516295` GREEN;
- assertion-only repair `35707b94e33658143d535b3c3aef84010f97ba94`;
- final pre-PR `6edcd8350beb2206755bf98518e301849cd99cea`, run `38900414518`, certify `116970988704` + Android `116970988120` GREEN;
- final PR #409 head `8e4b0c17cf4db232f11e4cd3c34bbcde83358aff`;
- PR CI `38900636271` / `116971729124` GREEN; Android `38900635979` / `116971728007` GREEN;
- canonical `9440b31b0c8dca2da0cfe92a5f02cbf7065e6d67`, parent `84d259c2a0f5f0284db5f67742a052e6c3003f62`, tree `e7d54e341de9d4995f13c62f6a7a2f41922798e9`;
- main CI `38900847691` / `116972435417` GREEN; Android `38900847145` / `116972433572` GREEN;
- Pages `38900976181`, build `116972852085` + deploy `116973051764` GREEN.

J7A→J7D completes the first fully certified end-to-end Bonus Challenge vertical slice: `TIMED_SURVIVAL`. Precision, rescue, collection, evasive corridors, pursuit, affinity puzzles, obstacle navigation and survival without firing remain future vocabulary, not cancelled and not implicitly implemented.

## J8 — Additional Game Modes
Status: **ACTIVE PROGRAM**

Candidate vocabulary remains Score Attack, Boss Rush, Survival/Last Light, Swarm Trials, Anomaly Runs, Daily Seed, Elite Hunt, Endless Crisis and Perfect Sector. Reuse one certified engine/core; avoid mode-specific forks.

### J8A — Pure Score Attack Mode Profile Contract
Status: **DEPLOYED / FROZEN**
Canonical: `4a78c942a3ebdb509f67185d6799b0724ac27238`  
Issue #412 / PR #413

J8A selects Score Attack as the smallest justified first Additional Game Mode contract without live adoption:
- `SCORE_ATTACK` / `Score Attack`;
- family `ARCADE_SCORE_CHASE`;
- mode `PROFILE_ONLY`;
- objective `MAXIMIZE_EXISTING_RUN_SCORE`;
- completion compatibility `TIMEBOX`;
- score-source compatibility `EXISTING_RUN_SCORE`;
- only semantic profile-definition authority is owned;
- exact duration, progression substrate, runtime discriminator, start flow, persistence/high-score/archive, result presentation, seed/replay, score formula, rewards/economy and live adoption remain unresolved.

Exact deployment anchors:
- pre-PR `69fea866809cba4764414df2a5e4f7bfcc97e895`, run `38902639119`, certify `116978369434` + Android `116978369920` GREEN;
- final PR #413 head `979640051e9568c2b710d68ec77690db69b5a68b`;
- PR CI `38902906173` / `116979264896` GREEN; Android `38902906158` / `116979264759` GREEN;
- canonical `4a78c942a3ebdb509f67185d6799b0724ac27238`, parent `0b7e61820d139327046f02adbef604f65f1909ff`, tree `feabb1b5b8beb2923ebd30f0c646a46ab73e990a`;
- main CI final `38903099548` / `116979916188` GREEN; Android final `38903099249` / `116979914940` GREEN;
- Pages `38903209694`, build `116980287001` + deploy `116980431323` GREEN.

### ES-13J8B — Pure Score Attack Execution-Substrate / Lifecycle Compatibility Contract
Status: **DEPLOYED / FROZEN**
Canonical: `d6277d4162c23f9b3edbbd69ccac8424b90d99ee`  
Issue #416 / PR #417

J8B freezes compatibility with the existing execution core without live adoption:
- frozen J8A `SCORE_ATTACK` identity is consumed;
- mode `COMPATIBILITY_ONLY`;
- execution substrate `INFINITE_SESSION`;
- runtime progression compatibility remains existing `INFINITE`;
- canonical fresh facts sector 11 / wave 1 / zero completed sectors+waves / ACTIVE;
- Campaign victory checkpoint is not required by this compatibility contract;
- existing Infinite advancement + descriptor/runtime projection pipeline remain authoritative;
- Score Attack remains outside `RuntimeProgressionState`; no third discriminator;
- no session construction/seed/advance/live adoption;
- only execution-substrate compatibility authority is positive.

Exact deployment anchors:
- pre-PR `e0de848e31b25e5cec7617f5b040ca09be8370a6`, run `38907084776`, certify `116993249057` + Android `116993248957` GREEN;
- final PR #417 head `7df7351b9f07830e5f5a808037c6b98e924ed002`;
- PR CI `38907309802` / `116994022888` GREEN; Android `38907309276` / `116994021442` GREEN;
- canonical `d6277d4162c23f9b3edbbd69ccac8424b90d99ee`, parent `b283a61b26a8491888ff251d3ee55006b5872806`, tree `b214a876b3c5f5945b52adc524965de86da930cb`;
- main CI `38907541228` / `116994816999` GREEN; Android `38907541135` / `116994817103` GREEN;
- Pages `38907624340`, build `116995103030` + deploy `116995284394` GREEN.

### ES-13J8C — Pure Score Attack Exact Duration / TIMEBOX Projection Contract
Status: **DEPLOYED / FROZEN**
Canonical: `78dfd39af5172499e7d82b8a62385a8e49f0e403`  
Issue #420 / PR #421

J8C freezes the pure completion metadata needed before records or live adoption:
- frozen J8A `SCORE_ATTACK` + J8B fresh `INFINITE_SESSION` compatibility are consumed;
- mode `PROJECTION_ONLY`;
- exact duration `60000 ms`;
- immutable TIMEBOX completion metadata at `60000 ms`;
- `60000 ms` reuses existing normal Campaign wave-9 duration and stays separate from J7 Timed Survival `30000 ms`;
- unsupported/incompatible/advanced/inactive facts fail closed;
- exactly duration projection + completion metadata projection are positive authorities;
- no live descriptor/session/timer/UI/storage adoption.

Exact deployment anchors:
- pre-PR `2a92e4b2ef851a3b96d3d8b2111916572ef4f3d2`, run `38909886244`, certify `117002752149` + Android `117002752623` GREEN;
- final PR #421 head `cefbffebbc0e6f67e70632acf3e1b008ccd16fa4`;
- PR CI `38910134577` / `117003581935` GREEN; Android `38910134565` / `117003581574` GREEN;
- canonical `78dfd39af5172499e7d82b8a62385a8e49f0e403`, parent `51e383f95d6725184616866a46f65fe09d115dd6`, tree `19e808817722d7dafd020c35ea1083a3f52e1d2f`;
- main CI `38910510957` / `117004857754` GREEN; Android `38910510842` / `117004856738` GREEN;
- Pages `38910628638`, build `117005259913` + deploy `117005436887` GREEN.

### ES-13J8D — Pure Dedicated Score Attack Record Projection Contract
Status: **DEPLOYED / FROZEN**
Canonical: `de37f4a818b05b09c136617b71cf3620bf4e1e83`  
Issue #424 / PR #425

J8D freezes the record semantics required before storage or live-write adoption:
- canonical `SCORE_ATTACK` only;
- `SCORE_ATTACK_BEST_SCORE` / `RECORD_PROJECTION_ONLY`;
- finite non-negative existing/candidate values only;
- floor + `Number.MAX_SAFE_INTEGER` clamp;
- projected best = maximum normalized value;
- deterministic `NEW_BEST | TIED_BEST | BELOW_BEST`;
- J8A identity + J8C `60000 ms` duration consumed as compatibility facts;
- exactly one positive authority: dedicated record projection;
- no GameStats/global-highScore, storage/persistence/archive, UI or live runtime adoption.

Exact deployment anchors:
- pre-PR `2c282fab13079039bc1302ba6918e53765100197`, run `38912394130`, certify `117011204544` + Android `117011204314` GREEN;
- final PR #425 head `5e91f121cb5f2f66dc6f3dcf5bbd928592103a46`;
- PR CI `38914825464` / `117019490041` GREEN; Android `38914825953` / `117019492058` GREEN;
- canonical `de37f4a818b05b09c136617b71cf3620bf4e1e83`, parent `2e4eb93a06e303c42cd8c97a133a176860eb2e38`, tree `4bb5318cff768ec4cd5390be0d76daf3b1013b26`;
- main CI `38915074594` / `117020337717` GREEN; Android `38915074301` / `117020336281` GREEN;
- Pages `38915180390`, build `117020692263` + deploy `117020841804` GREEN.

### ES-13J8E — Dedicated Score Attack Storage-Schema Adoption
Status: **DEPLOYED / FROZEN**
Canonical: `5260ffc4e63061646b180d4da419d5d7b794db68`  
Issue #428 / PR #429

J8E reserves the dedicated Score Attack record in the existing persistence schema without making Score Attack live:
- `GameStats.scoreAttackBestScore: number` is required and defaults to `0`;
- the existing `orbi_energy_swarm_stats_v2` key and save/reset path remain authoritative;
- load sanitization is finite, non-negative, floored and capped at `Number.MAX_SAFE_INTEGER`; malformed/negative values fail closed to `0`;
- global `highScore` remains independent;
- `scoreAttackRecordProjection.ts` and `runPersistence.ts` remain unchanged;
- no run-completion record write, archive change, live session/runtime/timer/UI adoption or Campaign/Infinite behavior change was introduced.

Exact closure evidence:
- initial certifier `38919090012` correctly went RED on one historical pre-J8E J8D test; Android `117034051271` still passed with APK;
- evidence-driven test-only transition was documented on #428 without modifying J8D implementation or `runPersistence.ts`;
- final pre-PR SHA `7298d284e3c78801a14cef2416240732417186f1`, run `38919470032`, certify `117035335947` + Android `117035335482` GREEN;
- clean PR head `4cc7c247b91429b1cccbefeebaba690e156c89d1`;
- PR CI `38919716924` / `117036177752` GREEN; Android `38919717107` / `117036177762` GREEN;
- canonical `5260ffc4e63061646b180d4da419d5d7b794db68`, parent `7da459c56ab27d7891cf859db9c1065347cd2736`, tree `6094ca2b366463179233fb63383d355c03839d4b`, exact diff four certified source/test files;
- main CI `38919920231` / `117036889398` GREEN; Android `38919920210` / `117036889938` GREEN;
- Pages `38920010388`, build `117037206191` + deploy `117037367882` GREEN.

### ES-13J8F — Pure Score Attack Record-Commit Eligibility Contract
Status: **DEPLOYED / FROZEN**
Canonical: `1ce459780fb543afec8b8bb1828ce946fe6cbcc3`  
Issue #432 / PR #433

J8F freezes the pure/fail-closed decision boundary between frozen Score Attack record semantics and a later controlled write:
- canonical `SCORE_ATTACK` only;
- explicit completed `TIMEBOX / 60000 ms` facts only;
- normalization/comparison delegates to frozen J8D `resolveScoreAttackRecordProjection(...)`;
- only `NEW_BEST` projects `eligibleToAdvanceRecord: true`;
- `TIED_BEST` / `BELOW_BEST` remain valid but ineligible;
- invalid identity/completion/score facts fail closed;
- exactly one positive authority: record-commit eligibility;
- no storage/GameStats/global-highScore mutation, `runPersistence`, live session/runtime/timer/UI/archive/reward/economy/spawn authority.

Exact deployment anchors:
- pre-PR SHA `e45e6f8a5d9af5a4d718f9e4fb900dca19a084ba`, run `38925005305`, certify `117054181592` + Android `117054181176` GREEN;
- clean PR #433 head `2338b66ab82c144ac7dcc00eca81eaf5ebbbe766`;
- PR CI `38925256442` / `117055034726` GREEN; Android `38925257401` / `117055039833` GREEN;
- canonical `1ce459780fb543afec8b8bb1828ce946fe6cbcc3`, parent `2d26c391e056a433893f9d7ca2b6681c5952a181`, tree `59954890fee59e1158dc9bb9779bdd9fbf6c82cf`, exact diff three certified files;
- main CI `38925493205` / `117055846575` GREEN; Android `38925492978` / `117055847442` GREEN;
- Pages `38925614881`, build `117056259248` + deploy `117056409385` GREEN.

### ES-13J8G — Pure Score Attack Canonical Run Recipe / Seed Policy Contract
Status: **NEXT CONTRACT TARGET AFTER DOC44 CLOSURE**

Discovery after J8F shows that live Score Attack adoption remains premature because the existing Infinite substrate is deterministic from seed + run context while J8A/J8B/J8C all explicitly leave `selectsSeedPolicy: false`. `createInfiniteSession(seed, context)` and the certified Infinite plan builder already provide the construction authorities; J8G must freeze only the Score Attack recipe inputs needed for reproducible/comparable attempts.

J8G must select a fixed/versioned deterministic Score Attack seed policy, reuse the existing neutral Infinite run context, and prove compatibility with J8B's fresh sector-11/wave-1 substrate and J8C's frozen `60000 ms` TIMEBOX semantics. The implementation may freeze the exact seed literal after code-level discovery.

J8G must remain pure recipe/projection policy only: no StartScreen/ResultScreen/HUD, no live session lifecycle, no timer/clock/pause, no runtime discriminator or descriptor mutation, no persistence/write/archive, no score-formula/reward/economy changes, no spawn/arena/entity/projectile/cap/budget/FOTON/formation authority.

## J9 — Boss & Miniboss Expansion
Status: PLANNED

Blackout Architect, Helios Devourer, Null Choir, Quantum Leviathan, Dyson Breaker, Swarm Sovereign and Singularity Engine. Use phases, destructible zones, affinity/formation pressure, battlefield manipulation and telegraphed vulnerability windows.

## J10 — Expert Risk / Reward
Status: PLANNED

Resonance Graze, Quantum Slip, near-miss chains and optional danger-proximity bonuses. Never mandatory for baseline survival.

## J11 — Build & Synergy Expansion
Status: PLANNED

Distinct run identities around Solar, Hydro, Wind, Thermal, Magnetic and Quantum, followed by controlled hybrid synergies.

## J12 — Rare Events & Secret Encounters
Status: PLANNED

Golden Rift, Ancient ORBI Signal, Blackout Armada, Unknown Energy Signature, Titan-class Intruder and hidden variants. Surprise without required progression blockers.

## J13 — Score, Rank & Mastery
Status: PLANNED

C/B/A/S/S+ ranks, optional sector objectives, perfect sectors, no-damage/swarm-preservation targets, affinity efficiency, formation mastery, time/chain goals and mode-specific mastery.

## J14 — Procedural Interaction Matrix
Status: PLANNED

Safely combine `enemy archetype + evolved trait + formation + biome + mutator + event` with deterministic seed reproduction, explicit compatibility rejection and global caps/budgets authoritative.

## J15 — Gameplay Integration & Long-Range Balance
Status: PLANNED

Long runs across difficulty bands, telegraph/spawn/recovery fairness, score/resonance/Overdrive economy, boss/event/mode interactions, desktop+Android performance, readability/pacing/replayability and deterministic failure evidence.

Only after ES-13 stabilizes should the full RC manual campaign be repeated.

---

## ES-14 — Living Warfront
Status: FUTURE PROGRAM / NOT YET COMMITTED

Potential: new biomes/sectors, thematic arcs, contracts/missions, codex/discovery, deeper persistent mastery, mode unlocks, daily/weekly challenges, secure leaderboards when justified and an evolving warfront between runs.

## Manual RC strategy
Manual blockers remain open: #4 visual/responsive, #5 Infinite play-feel, #202 GAIA physical runtime, #248 Android real-device. Full final evidence remains deferred while ES-13 changes gameplay. CI must never fabricate human/device PASS.

## Recovery discipline
Read `PROJECT_CONTINUITY.md`, `IMPLEMENTATION_LEDGER.md`, this roadmap, `TRACEABILITY_POLICY.md`, `ES13_PHASE_CHECKLIST.md` and referenced active Issues/PRs; then verify live `main` before writing anything.
