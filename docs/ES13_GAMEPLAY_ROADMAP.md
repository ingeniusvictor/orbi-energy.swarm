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
Status: **NEXT ACTIVE ENGINEERING SLICE AFTER DOC28 CLOSURE**

Post-J5F-D discovery proves a bounded live application through existing seams only:
- direct and splash paths already own their final resolved hit scalar before health mutation;
- each path can capture only local pre-hit source health and project J5F-D only when that same hit proves lethal;
- `registerCombatDefeat(...)` already centralizes direct+splash defeat and resolves the full current J5D break resolution;
- J5E already carries one pending break through the existing enemy logic pass;
- J5F-B can validate each current linked member inside that same pass;
- J5F-C can project exact non-lethal `resultingHealth` from current `health/maxHealth` plus J5F-D proposed pulse damage;
- pulse application can occur before J5E detaches formation ownership, with no second scan or entity index.

Required direction:
- one new pure live-adapter helper composing frozen J5F-A/B/C/D; frozen contracts remain unchanged;
- one scalar pending pulse object/ref only, never a queue/map/set/index;
- capture pre-hit source health immediately before existing direct/splash health subtraction;
- only a defeat caused by that exact hit may pass J5F-D source metadata into centralized defeat routing;
- J5E detach remains independent if pulse source is absent/invalid;
- capture pending pulse before the existing enemy pass and apply only inside that pass, before J5E clears `enemyFormation`;
- matching current living linked members receive only J5F-C `resultingHealth`; exact 1 HP floor remains authoritative;
- never set linked `isDead`, never register pulse defeat, never award score/reward/drop/persistence and never trigger boss/milestone defeat;
- size-3 may pulse both bounded linked members during the same pass, then consume the captured pulse once with identity guard;
- reset pending pulse at the same run/wave/boss J3 lifecycle boundaries;
- no new Enemy/EnemyType field, scan/collection/lookup, projectile, multiplier/percentage/radius/cadence, timer/RNG, spawn/progression, cap/budget, visual or audio authority.

## J6 — Dynamic Mid-Sector Events
Status: PLANNED

Solar Storm, Quantum Rift, Blackout Surge, Crystal Rush, Dyson Eclipse, Swarm Distress Call, Convoy Defense, Void Hunt, Elite Incursion, Mirror Swarm, Meteor/Debris Field and Singularity Event.

## J7 — Bonus Challenge Rounds
Status: PLANNED

20–40 s rhythm breakers: precision, rescue, collection, evasive corridors, pursuit, affinity puzzles, obstacle navigation, timed survival and survival without firing.

## J8 — Additional Game Modes
Status: PLANNED

Score Attack, Boss Rush, Survival/Last Light, Swarm Trials, Anomaly Runs, Daily Seed, Elite Hunt, Endless Crisis and Perfect Sector. Reuse one certified engine/core; avoid mode-specific forks.

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
