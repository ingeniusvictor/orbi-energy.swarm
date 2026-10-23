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
Status: **DEPLOYED / FROZEN**
Canonical: `55a31de7ad7989e3daaead8311aa08d3927096f7`  
Issue #436 / PR #437

J8G freezes reproducible Score Attack challenge inputs before any live start/session/persistence adoption:
- recipe version `1`;
- fixed/versioned seed `orbi-score-attack-v1`;
- existing authoritative `NEUTRAL_INFINITE_RUN_CONTEXT`, exposed through a frozen copy;
- transient internal proof session only, created through existing Infinite authority and never returned/advanced/persisted/adopted live;
- deterministic compatibility with J8B fresh sector-11/wave-1 `INFINITE_SESSION` facts and J8C `TIMEBOX / 60000 ms` facts;
- exactly one positive authority: canonical run-recipe/seed-policy selection;
- no runtime/UI/persistence/archive/score/reward/economy/spawn/arena/entity/cap/FOTON/formation authority.

Exact deployment anchors:
- pre-PR SHA `96d8eff6dbdc91f5800e154a5d6309a48bed3802`, run `38927391978`, certify `117062322683` + Android `117062322404` GREEN;
- clean PR #437 head `87b9bbe63ca5d8d07016713f58ef42e1ddd86a23`;
- PR CI `38927641423` / `117063169406` GREEN; Android `38927641413` / `117063169539` GREEN;
- canonical `55a31de7ad7989e3daaead8311aa08d3927096f7`, parent `2e07ea501c36728bdc369a66dfecb64f6d8e5e01`, tree `67e0b9da68544d0f4c134e37f08d1a84df1df264`, exact diff three certified files;
- main CI `38927850983` / `117063891102` GREEN; Android `38927850891` / `117063891169` GREEN;
- Pages `38927967468`, build `117064302340` + deploy `117064549189` GREEN.

### ES-13J8H — Pure Score Attack Bootstrap Envelope Contract
Status: **DEPLOYED / FROZEN**
Canonical: `8ed798beaa688f73ab8513c0e7ecb9bd112a2824`  
Issue #440 / PR #442

J8H freezes the pure bootstrap boundary between canonical Score Attack recipe facts and a later controlled live runtime adoption:
- consumes frozen J8G `resolveScoreAttackCanonicalRunRecipe(...)` only;
- constructs one fresh Infinite session through existing `createInfiniteSession(seed, context)`;
- validates frozen J8B fresh-substrate compatibility and J8C `TIMEBOX / 60000 ms` compatibility;
- constructs runtime only through existing `createInfiniteRuntimeState(session)`;
- preserves canonical outer `modeId: SCORE_ATTACK` while nested runtime progression remains exactly `INFINITE`;
- session exists only as `runtimeProgression.session`; no duplicate live/session authority;
- repeated calls produce equivalent canonical facts but independently fresh runtime/session objects;
- exactly one positive authority: bootstrap-envelope construction;
- no React/UI, timer ticking, session advancement/end, descriptor mutation, persistence/archive, score/economy or spawn authority.

Exact deployment anchors:
- pre-PR SHA `09ce57d304018d74aa3b19d5689463c2a48910e7`, run `38929746848`, certify `117070383670` + Android `117070383889` GREEN;
- clean PR #442 head `914d6a86d4bb3f87630fdb9366cd35db6b9e83ae`;
- PR CI `38943441225` / `117116516840` GREEN; Android `38943441011` / `117116514885` GREEN;
- canonical `8ed798beaa688f73ab8513c0e7ecb9bd112a2824`, parent `0557f91982534248765f2a5f7e5a2648f99ba58a`, tree `cf3b70ab9d6e0afd06dd9c552146934b094356ca`, exact diff three certified files;
- main CI `38943657919` / `117117249622` GREEN; Android `38943658003` / `117117250045` GREEN;
- Pages `38943771427`, build `117117654170` + deploy `117117807868` GREEN.

### ES-13J8I — Pure Score Attack Runtime Descriptor Completion Overlay Contract
Status: **DEPLOYED / FROZEN**
Canonical: `9ccec58c5454e25e33cf58d2b4bf6030424f475d`  
Issue #445 / PR #446

J8I freezes the pure/fail-closed descriptor-completion bridge needed before live Score Attack adoption:
- consumes a valid frozen J8H bootstrap envelope plus its exact canonical current fresh Infinite descriptor;
- rejects absent, mismatched, mutated or already-overlaid facts;
- requires base `BUDGET_AND_CLEAR` completion;
- returns immutable projection metadata and an immutable descriptor copy;
- the only descriptor-semantic change is `completionPolicy -> TIMEBOX / 60000 ms`, reusing frozen J8C/J8H duration facts;
- preserves descriptor identity, runtime source mode, sector/wave/waveCount, display, biome, spawn, modifiers, pressure, rewards, milestone, fairness and source facts exactly;
- outer `SCORE_ATTACK` attribution remains outside `RuntimeProgressionState`;
- exactly one positive authority: descriptor-completion overlay projection;
- no cache/live integration, React/UI/start flow, timer/clock/cursor, session progression, persistence/archive, score/economy or spawn authority.

Exact deployment anchors:
- pre-PR SHA `9fb290186ad56c3c4321eb69c51c37b3c8653ac1`, run `38945640439`, certify `117123936029` + Android `117123936267` GREEN;
- clean PR #446 head `6c07e4e0119c05255f37c0752f8aa4db8f5b2b3a`;
- the initial native PR hook was delayed/missed; closing/reopening the same unchanged PR recovered the native checks without code/base/head changes;
- PR CI `38945992045` / `117125131570` GREEN; Android `38945992000` / `117125131449` GREEN;
- canonical `9ccec58c5454e25e33cf58d2b4bf6030424f475d`, parent `12efb3029cf54581c81bad5a2fc629332f7be6c4`, tree `48e3f69e1d112ddc4843df7d83515cf752a23b36`, exact diff three certified files;
- main CI `38946233419` / `117125924994` GREEN; Android `38946233414` / `117125924762` GREEN;
- Pages `38946322607`, build `117126231280` + deploy `117126371840` GREEN.

### ES-13J8J — Pure Score Attack Terminal Completion Disposition Contract
Status: **DEPLOYED / FROZEN**
Canonical: `801b09c7ab74db18a3765db4538b8d3b23588062`  
Issue #449 / PR #450

J8J freezes the pure terminal-completion decision required before live Score Attack adoption:
- consumes canonical frozen J8H bootstrap + J8I TIMEBOX overlay facts;
- rebuilds the expected J8I overlay fail-closed for the supplied envelope;
- delegates completion truth only to existing `isRuntimeWaveComplete(...)`;
- incomplete TIMEBOX snapshots fail closed;
- canonical completed `SCORE_ATTACK / INFINITE / TIMEBOX / 60000 ms` projects immutable `END_SCORE_ATTACK_ATTEMPT`;
- explicitly `advanceInfiniteRuntime: false` while preserving nested runtime discriminator `INFINITE`;
- exactly one positive authority: terminal-completion disposition projection;
- no session status/end mutation, Infinite advancement call, runtime-cache/live integration, React/UI/result transition, persistence/archive/record write, timer/clock/cursor or combat/economy/spawn authority.

Exact deployment anchors:
- pre-PR SHA `c8c64c66603bc230a67c818a05fe87c9c6f184bc`, run `38949844968`, certify `117138168359` + Android `117138168740` GREEN;
- clean PR #450 head `8d867f22a2e40f0140fd4b935b2a712b5db1d090`;
- PR CI `38950093548` / `117139004853` GREEN; Android `38950093511` / `117139004731` GREEN;
- canonical `801b09c7ab74db18a3765db4538b8d3b23588062`, parent `06b879f8a2af66f2dce4c02fa8d1bfe749e213c3`, tree `3a9bd3527833b866a43a60c5e2da3981a217cb45`, exact diff three certified files;
- main CI `38950330832` / `117139808091` GREEN; Android `38950330639` / `117139806867` GREEN;
- Pages `38950451599`, build `117140202743` + deploy `117140357609` GREEN.

### ES-13J8K — Pure Score Attack Effective Runtime Projection Bundle / Overlay-Isolation Contract
Status: **DEPLOYED / FROZEN**
Canonical: `ac943f609e427618465104f51b8f023620c8bf98`  
Issue #453 / PR #454

J8K freezes the Score Attack-specific pure runtime projection bundle before any live cache/start-flow integration:
- consumes frozen J8H and derives the exact frozen J8I effective descriptor;
- explicitly bypasses Adaptive Invasion and accepts no live follower-count input;
- checks J6 Dynamic Event and J7 Bonus Challenge adoption only as fail-closed compatibility seams, requiring null adoption and descriptor identity preservation on canonical Sector 11 / Wave 1;
- derives combat pressure, mutator effects, effective enemy budget and milestone only through existing pure projectors from the J8I descriptor;
- preserves canonical recipe/runtime comparability and keeps J8J terminal completion separate;
- exactly one positive authority: Score Attack runtime projection-bundle composition;
- no generic cache, React/UI, timer/clock/cursor, persistence/archive/record, progression/spawn/arena/entity/projectile/cap/budget/FOTON/formation mutation.

Exact deployment anchors:
- pre-PR SHA `8f5f22799af0239877da4df2fab20d26d1469082`, run `38952325860`, certify `117146510883` + Android `117146511249` GREEN;
- clean PR #454 head `083fe70f1c8d4e43dfa114f1564e55ef8e846730`;
- PR CI `38960654252` / `117174564413` GREEN; Android `38960654387` / `117174564610` GREEN;
- canonical `ac943f609e427618465104f51b8f023620c8bf98`, parent `cea92b2304797ac2af597a3416a2b23b17563154`, tree `648c34b28bb03695aa0288998b8d992638cb489a`, exact diff three certified files;
- main CI `38960883456` / `117175332888` GREEN; Android `38960883435` / `117175333148` GREEN;
- Pages `38961007520`, build `117175743388` + deploy `117175888611` GREEN.

### ES-13J8L — Pure Score Attack Runtime Activation Envelope Contract
Status: **DEPLOYED / FROZEN**
Canonical: `d41f00a1a87140dba1ddc2d04b207261df862307`  
Issue #457 / PR #458

J8L freezes the pure outer Score Attack activation carrier required before controlled live adoption:
- consumes one valid frozen J8H bootstrap envelope and its exact J8K projection bundle;
- preserves explicit outer `modeId: SCORE_ATTACK` while nested runtime remains exactly `INFINITE`;
- carries exact object identity for bootstrap envelope, runtime/session, J8K bundle and effective descriptor;
- inherits canonical Sector 11 / Wave 1, fixed seed, TIMEBOX / 60000 ms, Adaptive Invasion bypass and J6/J7 null compatibility;
- owns only activation-envelope construction/composition;
- no React/cache/start/result/HUD adoption, timer/clock/cursor, session advance/end, persistence/archive/record write or gameplay mutation authority.

Exact deployment anchors:
- initial pre-PR run `38962595762` exposed only a test-side truncation of frozen J8B `canonicalFreshStart`; product scope/repo smoke remained GREEN and Android succeeded;
- isolated corrected diagnostic `38963366915` / `117183693510` passed all six J8L tests;
- final pre-PR SHA `1c9f9e65b8307d1f73dfc6215c6f77b387cfbf0b`, run `38963464711`, certify `117184022310` + Android `117184023007` GREEN;
- clean PR #458 head `a06c71e7ca72991051e7bcc7752f0f50089e41d4`;
- PR CI `38963705565` / `117184830694` GREEN; Android `38963705688` / `117184831351` GREEN;
- canonical `d41f00a1a87140dba1ddc2d04b207261df862307`, parent `9d110a10e07da45f51c932d575f0ae3edb9606d4`, tree `20e5f9a1a48a03108d1c5ea140009d56e0b8da29`, exact diff three certified files;
- main CI `38963938606` / `117185611390` GREEN; Android `38963938646` / `117185612137` GREEN;
- Pages `38964054007`, build `117186003430` + deploy `117186140619` GREEN.

### ES-13J8M — Pure Score Attack Attempt Finalization Plan Contract
Status: **DEPLOYED / FROZEN**
Canonical: `9ec6a76bf34057881326530af9581e0eca1a0c74`  
Issue #461 / PR #462

J8M freezes pure Score Attack terminal orchestration without performing live writes or UI transitions:
- consumes exact frozen J8L activation identity plus one existing runtime completion snapshot;
- delegates terminal resolution only to J8J and returns null until canonical `END_SCORE_ATTACK_ATTEMPT`;
- derives only completed `TIMEBOX / 60000 ms` metadata;
- delegates score normalization/comparison/eligibility only to J8F;
- preserves NEW_BEST / TIED_BEST / BELOW_BEST and invalid-score fail-closed semantics;
- preserves exact activation-envelope identity;
- exactly one positive authority: attempt-finalization plan composition;
- no storage/GameStats/global-highScore/generic-run-persistence/archive/UI/timer/session/gameplay mutation authority.

Exact deployment anchors:
- pre-PR SHA `e1d0782323797f23df07b23144343a1bad6f6ed7`, run `38967353570`, certify `117197025001` + Android `117197024558` GREEN;
- clean PR #462 head `be585fcbe0db9e3070679a248b32e3e843685557`;
- PR CI `38967576188` / `117197754938` GREEN; Android `38967575955` / `117197754035` GREEN;
- canonical `9ec6a76bf34057881326530af9581e0eca1a0c74`, parent `25fed78cc7a6855a015d10538246490c914d6818`, tree `3fd28427b2997aaae3a5ea4b20bc4c1bfbd8e644`, exact diff three certified files;
- main CI `38967741204` / `117198308312` GREEN; Android `38967740979` / `117198308018` GREEN;
- Pages `38967850132`, build `117198668879` + deploy `117198801507` GREEN.

### ES-13J8N — Pure Dedicated Score Attack Stats-Commit Application Contract
Status: **DEPLOYED / FROZEN**
Canonical: `d0e9af1c3c8f94524187f7d8ee48c975e2bd9f3e`  
Issue #465 / PR #466

J8N freezes the dedicated Score Attack GameStats application boundary required before live integration:
- consumes one valid frozen J8M finalization plan plus existing GameStats;
- stale `scoreAttackBestScore` facts fail closed;
- NEW_BEST changes only `scoreAttackBestScore`;
- TIED_BEST / BELOW_BEST produce exact semantic no-ops;
- global `highScore`, generic run persistence/archive/counters, Campaign/Infinite records and every unrelated GameStats field remain isolated;
- no storage I/O, React/UI, runtime/session/timer or gameplay authority.

J8N certification caught and corrected one real no-op normalization bug before PR. Final anchors:
- initial pre-PR run `38969412380` exposed the issue before PR;
- isolated diagnostic v2 `38969724953` / `117204857053` passed all five properties after correction;
- final pre-PR SHA `71a00a5f756c9dd865932763d8e92c96536facbe`, run `38969868757`, certify `117205320392` + Android `117205320719` GREEN;
- clean PR #466 head `fdb3575add29d632ffc020cbfadee7615fae6496`;
- PR CI `38970083272` / `117206023607` GREEN; Android `38970083435` / `117206024349` GREEN;
- canonical `d0e9af1c3c8f94524187f7d8ee48c975e2bd9f3e`, parent `41da66dac942accb714899f189fce86dc24d1d79`, tree `cb8587b7a3c584a4516e0e5f49be9129e11d9d6f`, exact diff three certified files;
- main CI `38970263772` / `117206620329` GREEN; Android `38970263775` / `117206620338` GREEN;
- Pages `38970380507`, build `117207004493` + deploy `117207154206` GREEN.

### ES-13J8O — Controlled Live Score Attack Engine Lifecycle Adoption
Status: **DEPLOYED / FROZEN**
Canonical: `89d1dea159f8478c2e2ccc01f027c2e9041a4542`
Issue #469 / PR #470

J8O is the first controlled live Score Attack engine-lifecycle adoption over the frozen J8K→J8N prerequisite chain:
- Campaign remains the unchanged/default public start path; Score Attack is still not publicly selectable in J8O;
- internal `SCORE_ATTACK` start consumes only frozen J8L activation authority and installs its exact nested INFINITE runtime/session plus one scalar activation-envelope ref;
- active Score Attack runtime reads reuse frozen J8L/J8K projection facts and bypass the generic runtime projection cache/adaptive/dynamic/bonus adoption path for that attempt;
- the existing TIMEBOX timer remains the sole timer/clock and uses the frozen `60000 ms` descriptor;
- terminal completion is intercepted before generic Infinite advancement and never advances Infinite progression;
- J8M + J8N supply finalization and dedicated-record application; storage is touched only through existing `updateStatsAndSave(...)` when `scoreAttackBestScore` actually changes;
- tied/below outcomes do not write GameStats/storage and premature Score Attack game-over skips generic `applyFinalRunCommit(...)`, global highScore, archive and generic counters;
- Score Attack activation identity is cleared at reset/new-run and terminal boundaries;
- `StartScreen`, `ResultScreen` and `GameHud` remain unchanged in J8O.

Certification discovered one historical static platform expectation that required evidence-driven evolution: the runtime completion snapshot fields were preserved exactly but extracted to one shared `completionSnapshot` reused by both `isRuntimeWaveComplete(...)` and Score Attack finalization. Only `tests/runtime-completion-adoption.test.ts` widened (`+5/-1`); no frozen J8K/J8L/J8M/J8N source changed.

Exact deployment anchors:
- initial pre-PR run `38975238440`: certify `117222979343` RED only on Platform regression; Android `117222978976` GREEN;
- diagnostic run `38984992393` isolated `wave transitions tick time only through the completion policy contract` without weakening the platform command/exit semantics;
- final pre-PR SHA `01ca757d75f6c36c486277088cb90985ca4037a2`, run `38985148756`, certify `117254768498` + Android `117254768331` GREEN;
- clean PR #470 head `d2e8935cfa321d47fe4c01373823ea400548c976` after temporary certifier removal;
- PR CI `38985359191` / `117255442942` GREEN; Android `38985359228` / `117255443134` GREEN;
- canonical `89d1dea159f8478c2e2ccc01f027c2e9041a4542`, parent `7ed00b7f28f8c3dd6578932f8e77845e8618d853`, tree `3688799786e8700309e002a5ab75b4d0f7661f74`, exact final diff five files;
- main CI `38985499689` / `117255904499` GREEN; Android `38985499754` / `117255905187` GREEN with APK build/verify/upload;
- Pages/Web Beta `38985557153`, build `117256089658` + deploy `117256175826` GREEN;
- Issue #469 CLOSED / completed.

### ES-13J8P — Controlled Public Score Attack Selection & Presentation Adoption
Status: **DEPLOYED / FROZEN**
Canonical: `c29df45aebf4a0b3d58038a42b8c539234b42745`
Issue #473 / PR #474

J8P closes the first public Score Attack vertical slice over frozen J8O:
- Campaign remains the unchanged/default primary public launch path;
- StartScreen exposes Score Attack only as an explicit secondary choice and delegates live start to frozen J8O;
- one low-frequency `CAMPAIGN | SCORE_ATTACK` presentation identity exists only for UI attribution and same-mode restart continuity, outside `RuntimeProgressionState`;
- frozen J8A identity and J8C `TIMEBOX / 60000 ms` are presentation facts only; no second timer/clock/countdown authority was added;
- GameHud replaces Campaign objective vocabulary with bounded Score Attack attribution while the engine timer remains sole timing authority;
- ResultScreen uses the dedicated Score Attack record and does not present global highScore, generic Campaign rewards or generic run archive as Score Attack ownership;
- retry re-enters the frozen J8O start seam; menu exit clears presentation identity;
- J8K/J8L/J8M/J8N remain isolated from direct UI imports and all runtime/scoring/persistence authorities remain frozen.

Repository certification initially exposed three historical pre-J8P static expectations in J8A/J8C/J8O tests. Evidence showed they prohibited the exact bounded UI consumption J8P was created to introduce. Only those tests evolved: J8A permits StartScreen profile reads while runtime/persistence remain neutral; J8C permits Start/HUD/Result duration reads while forbidding UI clock APIs; J8O continues to forbid direct J8K/L/M/N UI imports and keeps the engine coordinator authoritative. No frozen `src/game/scoreAttack*.ts` source changed.

Exact deployment anchors:
- final pre-PR certification SHA `a5e635b8ad50f4e7199e7abaa90e4e6db2c62db7`, run `38997372822`, certify `117292769229` + Android `117292944816` GREEN with APK build/verify/upload;
- clean PR #474 head `ccf22fb9b908ff08442a65bf9eaf6d218ef575b8`, exact final diff 9 files;
- PR CI #560 `38997541403` / `117293282979` GREEN; Android #125 `38997541492` / `117293283152` GREEN with Build/Verify/Upload APK;
- canonical `c29df45aebf4a0b3d58038a42b8c539234b42745`, parent `120fe00a61ad7a84984871ec19ec435be23535a0`, tree `5d9637b8e1df6d565ffffd08cb840b45c102c65c`, exact final diff 9 files;
- main CI #561 `38997649166` / `117293618514` GREEN; Android #126 `38997649158` / `117293618407` GREEN with Build/Verify/Upload APK;
- Pages/Web Beta #166 `38997711279`, build `117293808563` + deploy `117293885541` GREEN;
- Issue #473 CLOSED / completed.

## J9 — Boss & Miniboss Expansion
Status: **ACTIVE PROGRAM — J9L-B2B2B2B2B DEV QA FROZEN ENGINE BOSS INSTALLED / B2B2B2B2C CARDINAL/PRESENTATION DISCOVERY ONLY**

Blackout Architect, Helios Devourer, Null Choir, Quantum Leviathan, Dyson Breaker, Swarm Sovereign and Singularity Engine remain the long-range J9 vocabulary. New boss work must use phases, destructible zones, affinity/formation pressure, battlefield manipulation and telegraphed vulnerability windows without bypassing existing caps/budgets or certified boss authorities.

### ES-13J9A — Pure Blackout Architect Battlefield-Control Profile Contract
Status: **DEPLOYED / FROZEN**
Canonical: `171a8104900be17de62d91a765aab59c626b9d21`
Issue #477 / PR #478

J9A freezes exactly one pure/fail-closed semantic boss profile:
- `BLACKOUT_ARCHITECT` / `Blackout Architect`;
- family `BATTLEFIELD_CONTROL`;
- profile mode `PROFILE_ONLY`;
- encounter role `SPATIAL_CONTROL_CAPITAL`;
- compatibility vocabulary for multiphase structure, destructible structural zones, affinity pressure, formation pressure, arena-geometry manipulation and telegraphed exposure windows;
- unsupported ids fail closed;
- exactly one positive authority: profile definition.

J9A deliberately leaves unresolved `EnemyType`, `BossChassisId`, health/scaling, phase count/thresholds, structural-zone count/health/geometry, vulnerability duration, attacks/weights/cooldowns, spawn cadence, milestone/rematch/live adoption and arena mutation implementation. It owns no timer/clock, damage, rewards/economy, persistence, HUD, entity/projectile collection, randomness, caps/budgets or FOTON/formation authority. Existing Devourer/Titan/Worm and Campaign/Infinite/Score Attack authorities remain unchanged.

Exact deployment anchors:
- final pre-PR certification SHA `472a18a517c04e2e82c93ef810448eaf34477581`, run `39043701649`, certify `117428112142` + Android `117428293682` GREEN with APK build/verify/upload;
- clean PR #478 head `efb18fb0983e86034ca0e6a59e6b726a2d3b529a`, exact final diff 3 files;
- PR CI #564 `39043937609` / `117428803297` GREEN; Android #127 `39043937582` / `117428803218` GREEN with APK build/verify/upload;
- canonical `171a8104900be17de62d91a765aab59c626b9d21`, parent `abe1ce116f3b92620afa99377008eb38382e56d1`, tree `afb16253b9c88864246b8766b9b7daabe0e485e3`, exact final diff 3 files;
- main CI #565 `39044053175` / `117429143893` GREEN; Android #128 `39044053230` / `117429144497` GREEN with APK build/verify/upload;
- Pages/Web Beta #168 `39044123765`, build `117429345859` + deploy `117429422116` GREEN;
- Issue #477 CLOSED / completed.

### ES-13J9B — Pure Blackout Architect Structural-Zone Topology Contract
Status: **DEPLOYED / FROZEN**
Canonical: `18dd628981182740905fa6e05a463c525c699e37`
Issue #481 / PR #482

J9B freezes the bounded structural prerequisite over J9A without selecting a physical chassis or live encounter:
- exactly four immutable canonical anchors: `NORTH`, `EAST`, `SOUTH`, `WEST`;
- exact four unique `{ anchorId, destroyed }` facts only;
- unknown, duplicate, missing, padded or non-boolean facts fail closed;
- core exposure remains `LOCKED` until all four anchors are destroyed and becomes `ELIGIBLE` only when all four are destroyed;
- exactly two positive authorities: structural-topology definition and pure core-exposure eligibility projection;
- no coordinates/rendering, anchor health, damage, phase/timer, chassis, attacks, spawn/runtime, HUD, economy/persistence, collection/cap/budget/FOTON/formation authority.

Exact deployment anchors:
- final pre-PR certification SHA `f26ce4869e77e287fd81ad63bbba1918c5317b66`, run `39055709331`, certify `117463126475` + Android `117463318912` GREEN with APK build/verify/upload;
- clean PR #482 head `9a9aecbd7ecc275673408f5ef4371e20accbc624`, exact final diff 3 files;
- PR CI #568 `39055907357` / `117463703000` GREEN; Android #129 `39055907372` / `117463703013` GREEN with APK build/verify/upload;
- canonical `18dd628981182740905fa6e05a463c525c699e37`, parent `f9b343ee4a8a89bd64a09ac4e291c931dd60309f`, tree `d5ef99a040022dcdd7aaffe1ece027ef5b18d5a7`, exact final diff 3 files;
- main CI #569 `39056014167` / `117464017817` GREEN; Android #130 `39056014168` / `117464017941` GREEN with APK build/verify/upload;
- Pages/Web Beta #170 `39056065279`, build `117464181336` + deploy `117464235678` GREEN;
- Issue #481 CLOSED / completed.

### ES-13J9C — Pure Blackout Architect Chassis Compatibility Contract
Status: **DEPLOYED / FROZEN**
Canonical: `370f770171993760a3e11fa0aa95bcaa4318b758`
Issue #485 / PR #486

J9C freezes one pure/fail-closed structural chassis-compatibility result without selecting or adopting a live boss:
- consumes frozen J9A identity, frozen J9B four-anchor topology and existing pure boss-chassis descriptor facts only;
- `TITAN_CORE` is the sole compatible existing candidate;
- exact compatibility requires four weakpoints, `ANCHORED` motion and angular velocity `0`;
- malformed/padded facts, unsupported ids and canonical descriptor drift fail closed;
- returns only immutable `COMPATIBILITY_ONLY` metadata;
- exactly one positive authority: chassis compatibility;
- no boss-chassis selection, `EnemyType`, health/geometry/damage, vulnerability duration, phase, attack, spawn/runtime, timer, arena, HUD, economy/persistence, collections, randomness, cap/budget, FOTON or formation authority.

Exact deployment anchors:
- final pre-PR certification SHA `35f4ff652c16cce0947ce4933ad2a53782bd3282`, run `39063229301`, certify `117485369790` + Android `117485575582` GREEN with APK build/verify/upload;
- clean PR #486 head `6cbf41303a7f3a39456e41b99aa4acda3f2d1319`, exact final diff 3 files;
- PR CI #572 `39063443167` / `117486039223` GREEN; Android #131 `39063443163` / `117486039354` GREEN with APK build/verify/upload;
- canonical `370f770171993760a3e11fa0aa95bcaa4318b758`, parent `cf745bb7b17cd2c2421d3531cf2646dd726774c3`, tree `8e6d7edae749c4ed1a02520ebeb46224e0625c51`, exact final diff 3 files;
- main CI #573 `39063581950` / `117486443399` GREEN; Android #132 `39063581938` / `117486443301` GREEN with APK build/verify/upload;
- Pages/Web Beta #172 `39063646443`, build `117486635370` + deploy `117486721807` GREEN;
- Issue #485 CLOSED / completed.

### ES-13J9D — Pure Blackout Architect Chassis Selection/Binding Contract
Status: **DEPLOYED / FROZEN**
Canonical: `4bc4d70b1d54217dcbfca1a4745042dbb8770fe6`
Issue #489 / PR #490

J9D freezes only the selected Blackout Architect chassis identity after frozen J9C compatibility:
- consumes only exact frozen J9C `COMPATIBILITY_ONLY` projection facts;
- accepts only `BLACKOUT_ARCHITECT / COMPATIBILITY_ONLY / TITAN_CORE / structuralAnchorCount=4`;
- malformed, missing, padded or tampered input fails closed;
- emits immutable minimal `SELECTION_ONLY / BINDING_ONLY` metadata for `BLACKOUT_ARCHITECT -> TITAN_CORE`;
- exactly one positive composite authority: boss-chassis selection/binding;
- no direct `bossChassis.ts` or `types.ts` read and no duplicated physical compatibility logic;
- no EnemyType, health/geometry/damage, vulnerability duration, attacks, rewards, raid configuration, spawn/runtime, timer, HUD, persistence or cap/budget authority.

Exact deployment anchors:
- final pre-PR certification SHA `4b76ecab06d9f6f4821124a691281a985be7878d`, run `39064919895`, certify `117490426242` + Android `117490630927` GREEN with APK build/verify/upload;
- clean PR #490 head `9b830a66685e23f8f5f0d6f5bf1ac1f7dd5a650c`, exact final diff 3 files;
- PR CI #576 `39065137175` / `117491073954` GREEN; Android #133 `39065137241` / `117491074272` GREEN with APK build/verify/upload;
- canonical `4bc4d70b1d54217dcbfca1a4745042dbb8770fe6`, parent `e5c64daa4f3aa84868c5411cdd767e7d0b4ce1f4`, tree `56e1a19d3f1c5b632a23589b6442c70f372e80bc`, exact final diff 3 files;
- main CI #577 `39065273273` / `117491506912` GREEN; Android #134 `39065273265` / `117491507018` GREEN with APK build/verify/upload;
- Pages/Web Beta #174 `39065343745`, build `117491719509` + deploy `117491803289` GREEN;
- Issue #489 CLOSED / completed.

### ES-13J9E — Pure Blackout Architect EnemyType Compatibility Mapping Contract
Status: **DEPLOYED / FROZEN**
Canonical: `d89ffcad59eddc5eb4639a901590274e5ab25768`
Issue #493 / PR #494

J9E consumes only the exact frozen J9D selection projection and the existing `bossChassis.ts` descriptor; it emits immutable `BLACKOUT_ARCHITECT / COMPATIBILITY_ONLY / MAPPING_ONLY / TITAN_CORE / EnemyType.BOSS_TITAN` metadata. Null, malformed, padded and tampered selection inputs fail closed, as does a drifted chassis identity/type. Its only positive authority is EnemyType compatibility mapping. It neither live-adopts Blackout Architect nor borrows the Titan 6000 ms exposure timer, HP, weakpoint mechanics, attacks, raid cadence, rewards or runtime/spawn/HUD/economy/persistence/cap/budget/FOTON/formation authority.

Exact deployment anchors:
- pre-PR SHA `a340e34d86d1995e6295fc1729418aea49840dae`, run `39081353252`, certify `117538752189` + Android `117538933446` GREEN with APK build/verify/upload;
- clean PR #494 head `116965e19f08007e8c7ac78e0099093ca7d84574`, exact three-file final diff;
- PR CI `39081527405` / `117539270541` + Android `39081527435` / `117539270757` GREEN with APK;
- canonical `d89ffcad59eddc5eb4639a901590274e5ab25768`, single parent `e08b4de612b7caf5f878b4a584fc834cb6453a3a`, tree `9f5c2d1c518a71d49ca41bf5ba81f21ac9b02b09`, signed and exact three-file diff;
- main CI `39081627653` / `117539576763`, Android `39081627698` / `117539577100`, Pages `39081689279` (build `117539767650` + deploy `117539833588`) GREEN;
- Issue #493 CLOSED / completed.

### ES-13J9F — Pure Blackout Architect Structural Target Eligibility Contract
Status: **DEPLOYED / FROZEN**
Canonical: `da8db8ed9a5a5d74553b207fc1aa855ff4c16116`
Issue #497 / PR #498

J9F strictly consumes frozen J9B's exact four unique cardinal `{ anchorId, destroyed }` facts and exact J9E compatibility mapping; it returns deeply immutable `ELIGIBILITY_ONLY` metadata: intact anchor targets `ELIGIBLE`, destroyed anchor targets `INELIGIBLE`, core `LOCKED` until all four anchors are destroyed and then `ELIGIBLE` only as resolved by J9B. Unsupported/malformed/padded/duplicated facts and tampered J9E mapping fail closed. Exactly one positive authority is structural target eligibility projection: **no hit admission, collision/damage/HP, live target selection, geometry, phase, timer/6000 ms, attacks, spawn/raid/rematch, HUD, economy, persistence or other runtime adoption**.

Exact deployment anchors verified from GitHub:
- pre-PR SHA `3e80089055fd5d42f4c346066007282ad9be7b86`, run `39086661829`, certify `117554564635` + Android `117554675015` GREEN, including APK build/verify/upload;
- clean PR #498 head `6af0adeadb0714af21b8842aba92a315b001a976`, exact three-file diff;
- PR CI `39086815890` / `117555005257` and Android `39086815857` / `117555005138` GREEN including APK build/verify/upload;
- canonical `da8db8ed9a5a5d74553b207fc1aa855ff4c16116`, single parent `136f63e7f42fde5eff758f3869f8054c47f2ce69` (DOC59), tree `e306709fba6c9c7bdfa6ffb9606f170c0e4fe28b`, exact three-file diff: `src/game/blackoutArchitectStructuralTargetEligibility.ts`, `tests/es-13j9f-blackout-architect-structural-target-eligibility.test.mjs`, `tests/gameplay/blackout-architect-structural-target-eligibility.test.ts`;
- post-main CI `39086927493` / `117555328957`, Android `39086927473` / `117555328846` GREEN including APK build/verify/upload; Pages `39086974867` build `117555468651` + deploy `117555531033` GREEN;
- Issue #497 CLOSED / completed. DOC59 Issue #495 CLOSED, PR #496 MERGED as docs-only canonical `136f63e7f42fde5eff758f3869f8054c47f2ce69`; pre `39086168540`, PR CI `39086252901`, main CI `39086335418` and Pages `39086392854` GREEN; no DOC59 Android.

### ES-13J9G — Pure Blackout Architect Structural Hit-Intent Admission Gate
Status: **DEPLOYED / FROZEN**
Canonical: `6fc04c0e841aacc07d43e8b629f7fe1723b65ae1`
Issue #501 / PR #502

J9G consumes only a strictly shaped, **deeply frozen** J9F `ELIGIBILITY_ONLY` projection and exactly one caller-supplied abstract intent, `ANCHOR` with canonical cardinal anchor ID or `CORE`. It produces a frozen `HIT_INTENT_ONLY` `ADMIT/DENY` decision for that intent: intact anchor admits, destroyed anchor denies, and core admits only when frozen J9F exposes `ELIGIBLE`. Malformed, padded, forged mutable, duplicated, out-of-order or internally contradictory inputs fail closed. Its sole positive authority is abstract hit-intent admission, not hit detection, collision, damage, health, geometry, runtime, exposure windows/timers, phase, attacks, spawn, rematch/raid, HUD, rewards, persistence, collections, budgets, randomness, FOTON, formations or mode routing.

Exact certification and canonical anchors:
- first temporary attempt `39089007811` RED: focused gameplay revealed that a forged mutable anchor eligibility could appear internally consistent; kept negative test intact and strengthened product to require deep immutability of the frozen J9F projection;
- corrected pre-PR SHA `06e9e31944e4a1767d7c711d5612c227fd6e2dae`, run `39089106206`, certify `117561803525` and Android `117561923150` GREEN with APK build/verify/upload and readiness artifact;
- clean PR #502 head `7d3adb130ff1967769388ee0697a628ef93d772d`; exact 3-file diff; exact-head CI `39089263609` / job `117562276674` and Android `39089263622` / job `117562276886` GREEN with APK build/verify/upload;
- canonical `6fc04c0e841aacc07d43e8b629f7fe1723b65ae1`, parent `ce15851d8312e987520c5e33e75b46074e6af7ef` (DOC60), tree `6db2c44501532e39d6b8d349850c5ea13d079fe0` equals clean PR head tree; exact diff only `src/game/blackoutArchitectStructuralHitIntentAdmission.ts`, `tests/es-13j9g-blackout-architect-structural-hit-intent-admission.test.mjs`, `tests/gameplay/blackout-architect-structural-hit-intent-admission.test.ts`;
- post-main CI `39089355902` / `117562567369`, Android `39089355909` / `117562566708` with verified uploaded APK, Pages `39089412757` build `117562739378` + deploy `117562800536` GREEN;
- Issue #501 CLOSED / completed. DOC60 Issue #499 CLOSED, PR #500 MERGED, canonical `ce15851d8312e987520c5e33e75b46074e6af7ef` docs-only; pre `39088425556`, PR CI `39088522101`, main CI `39088688978`, Pages `39088734648` GREEN.

### ES-13DOC61 — J9G closure and J9H discovery preservation
Status: **DEPLOYED / FROZEN (DOCS ONLY)**
Canonical: `76b9a4ec5a33418ff071319c3ad1039ae75e7f6c`; Issue #503 CLOSED / PR #504 MERGED.
- Parent `6fc04c0e841aacc07d43e8b629f7fe1723b65ae1` (J9G gameplay), tree `02820436883366fc248331f9ab1f944084a98e3b`, clean head `b99728aca4108e0bf3fc0f5dc6fcd77a6515b586`, equal tree, exact 3-document diff.
- Pre-PR temporary SHA `2067068a09089a2b82a5a86f2c23ba23409eb446`, cert run `39089662608`, job `117563506634` SUCCESS. Helper removed.
- PR CI `39089740360` / job `117563741354` SUCCESS; post-main CI `39089907076` / job `117564249426` SUCCESS; Pages `39089961006` build `117564417229`, deploy `117564490138` SUCCESS. No Android on docs-only.
- J9G gameplay canonical remains `6fc04c0e841aacc07d43e8b629f7fe1723b65ae1`. DOC61 introduced no health, damage, runtime or Titan parameter authority.

### ES-13DOC62 — DOC61 closure and J9H pure snapshot activation
Status: **DEPLOYED / FROZEN (DOCS ONLY)**
Canonical: `2516d9d02dabbec43ba497d022ee75a73fc22594`; Issue #505 CLOSED / PR #506 MERGED.
- Exact single parent `76b9a4ec5a33418ff071319c3ad1039ae75e7f6c`, tree `c6904ca8d34ab59f74791b169e80910d9d37f642` equals clean PR head `12308e30ea7735f578b9432054b5308d217360e2`; exact 3 docs.
- Temporary pre-PR SHA `989f78d6b4a60fd42b79944ce7c19aa4f9ff59b3`, run `39090580644` / job `117566271389` GREEN; helper removed.
- Exact-head PR CI `39090655327` / `117566497024`; post-main CI `39090734735` / `117566738035`; Pages `39090781676` build `117566883147` + deploy `117566944476` GREEN. No Android for docs-only.

### ES-13J9H — Pure Blackout Architect Structural Durability Snapshot Projection
Status: **DEPLOYED / FROZEN**
Canonical: `b83333557e7e7fd78d8da330670c8a63c2a9a6ca`
Issue #507 / PR #508

J9H owns exactly one positive, pure authority: validating a caller-supplied four-anchor durability snapshot and projecting immutable `SNAPSHOT_ONLY` structural destroyed-facts in canonical `NORTH/EAST/SOUTH/WEST` order for frozen J9B. Each unique record has exactly `{anchorId,currentHealth,maxHealth}`, finite `maxHealth>0`, finite `0<=currentHealth<=maxHealth`; invalid/negative-zero, missing/extra/symbol/accessor/inherited, duplicated, sparse/padded facts fail closed. Input may be permuted; `destroyed` is true iff `currentHealth===0`. The output carries no HP numbers, no core health or health defaults. Frozen J9B owns topology/core exposure, J9F target eligibility, J9G abstract hit-intent admission. Full 16-combination composition is tested; there is **no damage, health mutation, hit detection, collision, geometry, timing/6000ms, phase, attack, spawn/raid/rematch, runtime, mode, HUD, economy, persistence, collection/cap/budget/RNG, FOTON or formation authority**. `TITAN_CORE` HP 180/2400 and exposure 6000ms remain Titan-owned.

Exact delivery evidence:
- Pre-PR temporary SHA `5a75d8e1de600a3348bbb4924dbc8fcc70ad6e21`, run `39091062008`, certifier `117567727272` SUCCESS with full focused + repo/gameplay/platform/typecheck/release/evidence/build/readiness; Android `117567885945` SUCCESS, APK build/verify/upload. Temporary helper removed.
- Clean PR #508 head `c1a44bc1c94e74fb38097adfcdc21466a95dce71`, exact 3-file diff. PR CI `39091229261` / `117568224866`, Android `39091229248` / `117568224600` GREEN with uploaded verified APK.
- Canonical `b83333557e7e7fd78d8da330670c8a63c2a9a6ca`, sole parent `2516d9d02dabbec43ba497d022ee75a73fc22594` (DOC62), tree `f6aea60fb36be3b9a10192aa749860316dd26676`, equal clean PR head tree; exactly `src/game/blackoutArchitectStructuralDurabilitySnapshot.ts`, `tests/es-13j9h-blackout-architect-structural-durability-snapshot.test.mjs`, `tests/gameplay/blackout-architect-structural-durability-snapshot.test.ts`.
- Post-main CI `39091310346` / `117568484924`, Android `39091309804` / `117568483659` with verified uploaded APK; Pages `39091354072` build `117568613578` + deploy `117568665530` SUCCESS; Issue #507 CLOSED.

### ES-13DOC63 — J9H closure and J9I discovery preservation
Status: **DEPLOYED / FROZEN (DOCS ONLY)**
Canonical: `0f4c7a1ed402c055efa2ad38dff3ffc620514a69`; Issue #509 CLOSED / PR #510 MERGED.
- Parent `b83333557e7e7fd78d8da330670c8a63c2a9a6ca` (J9H gameplay), tree `000a4be2636441de46de1f0d1bbb63a56ff641f7` equals clean PR #510 head tree `54ad65448da0f12ab73bcaa1657ac7e45ea88761`; exactly three documents.
- Pre-PR temporary SHA `5f45ff4f491e4ce92bcf42233bf619a546560d68`, run `39091561946` / `117569229693` GREEN; temporary workflow removed. PR CI `39091651242` / `117569496523` GREEN. Main CI `39091717563` / `117569695079` and Pages `39091759358` build `117569821801`, deploy `117569866485` GREEN; no Android for docs-only.

### ES-13DOC64 — DOC63 closure and J9I pure arithmetic proposal activation
Status: **DEPLOYED / FROZEN (DOCS ONLY)**
Canonical: `65d7e0ad833d2b86bdbe9234eac70e31c0ea02e8`; Issue #511 CLOSED / PR #512 MERGED.
- Parent `0f4c7a1ed402c055efa2ad38dff3ffc620514a69` (DOC63), canonical tree `7841189ffd3ce84b52333f6dcfbf3f5e00631ed1` equals clean PR head `d5882b4a34998f552d800251395768c83ecbcd2a` tree; exactly three docs.
- Temporary pre-PR SHA `ddbc12aebc8e79133931b03af89c819c1ac3aa66`; run `39092266053` / `117571321469` GREEN; helper removed. PR exact-head CI `39092356128` / `117571585682` GREEN.
- Post-main CI `39092435309` / `117571814996`, Pages `39092494833` build `117571996902` + deploy `117572057128` GREEN. Docs-only, no Android.

### ES-13J9I — Pure Blackout Architect Structural Direct-Hit Durability Proposal
Status: **DEPLOYED / FROZEN**
Canonical: `d53aa9746ec784d7d5a6b1076fb1e87013b61a7c`; Issue #513 CLOSED / PR #514 MERGED.

J9I's **only** positive authority is bounded **pure arithmetic proposal** for one intact Blackout Architect cardinal anchor. It validates an exact deeply frozen J9G `HIT_INTENT_ONLY/ADMIT` anchor result, four independent strict J9H-compatible caller-supplied durability records, and caller-resolved finite positive damage with explicit **untrusted** `DIRECT_PLAYER_PROJECTILE_CLAIM` (no collision proof). Result `PROPOSAL_ONLY` is frozen with finite `appliedDamage=min(resolvedDamage,currentHealth)`, `remainingHealth`, `wouldDestroy`, `mutatesHealth:false`, `establishesCollisionProvenance:false`, `registersDefeat:false`, `awardsRewards:false`. Rejections include `CORE`, `DENY`, destroyed anchors, false health bounds, malformed shape, padded/forged mutable/admission accessor/symbol, non-finite/zero/negative damage and no-op float underflow. Tests verify four cardinal anchors, clipping to zero and no mutations. J9I cannot prove collision/causality/freshness or authorize any runtime health change, defeat, rewards, phase, core exposure, timer, attack, spawn, raid, mode routing, caps/budgets, FOTON or formations. Titan/Devourer/Worm health and Titan weakpoint 180/core 2400/6000ms exposure remain untouched.

Exact evidence:
- Temporary certifier SHA `f3a6aa132220fb2c91f6c5f58a75c7cc3a2430e2`, full pre-PR run `39092770167`, certify `117572817874` and Android `117572928390` SUCCESS with APK build/verify/upload and readiness. Temporary helper removed.
- Clean PR #514 head `5aff2b8cbfe4a188e505801816cdda55cec95775`; CI `39092918931` / `117573267638`, Android `39092919077` / `117573267962` GREEN including verified APK.
- Canonical parent `65d7e0ad833d2b86bdbe9234eac70e31c0ea02e8` (DOC64), tree `ca5ff8b2f1466fd1d5d377d18384814e251c181c` exactly equals clean PR head tree, exact three files: `src/game/blackoutArchitectStructuralDirectHitProposal.ts`, `tests/es-13j9i-blackout-architect-structural-direct-hit-proposal.test.mjs`, `tests/gameplay/blackout-architect-structural-direct-hit-proposal.test.ts`.
- Post-main CI `39093011835` / `117573542002`, Android `39093011723` / `117573541547` including APK build/verify/upload, Pages `39093070955` build `117573721312` + deploy `117573781762` all GREEN; Issue #513 CLOSED.

### ES-13DOC65 — J9I closure and J9J geometry discovery
Status: **DEPLOYED / FROZEN (DOCS ONLY)**
Canonical `3bf5c2945fe174edff4d92adf38a8ab0052cf8fd`; Issue #515 CLOSED, PR #516 MERGED; single parent `d53aa9746ec784d7d5a6b1076fb1e87013b61a7c` (J9I), tree `36856d5c625c42b15f9bf9cc2237650d8a55fab8` matches clean PR head `946a35ffbfa282f35535d76befb3b6a007202883`. Diff exactly three docs.
- Pre-PR temporary SHA `cc437239d0200b9e3af9cef1bd1f2a20bf995832`, run `39093249684` / cert job `117574256109` GREEN; temporary helper removed.
- Exact-head PR CI `39093343559` / job `117574541150` GREEN; post-main CI `39093406127` / job `117574726093` GREEN, Pages `39093447089` build `117574846926` + deploy `117574903526` GREEN. No Android for docs-only.

### ES-13DOC66 — DOC65 closure and J9J pure geometry activation
Status: **DEPLOYED / FROZEN (DOCS ONLY)**
Canonical `a493b5cca15d0961335a550b8872491d154b6a8c`; Issue #517 CLOSED, PR #518 MERGED. Sole parent `3bf5c2945fe174edff4d92adf38a8ab0052cf8fd` (DOC65), tree `fa26d9762315eca11697c8d264aaf9349a96454b` equal clean PR head `0cb4330d0022e295e373f2df98e136e899ee3952` tree; exactly three docs.
- Pre-PR temporary SHA `a4de5104801585dc7fe71695b09d133486efde43`, run `39094483806` job `117577961453` GREEN with readiness; helper removed.
- Exact-head PR CI `39094576218` / `117578234681`, post-main CI `39094639359` / `117578424554`, Pages `39094697534` build `117578592805` + deploy `117578640175` GREEN. Docs-only, no Android.

### ES-13J9J — Pure Blackout Architect External Geometric Hit-Candidate Projection
Status: **DEPLOYED / FROZEN**
Canonical: `99a22466093abbb4355355cda62c34b099b53462`; Issue #519 CLOSED / PR #520 MERGED.

J9J's **only** positive authority is a pure bounded external/caller-supplied four-cardinal anchor-circle and single projectile-probe **geometric candidate**. Accepts exactly four unique plain own-data `{anchorId,x,y,radius}` records, any order, with finite coordinates/strict positive finite radii, and one untrusted exact `{x,y,radius}` projectile probe with finite x/y and nonnegative finite radius. Rejects inherited/accessor/symbol/extra/sparse/padded/malformed data, invalid or duplicate anchor IDs, nonfinite derived coordinate deltas/distance/summed radii and multiple-anchor ambiguity. Uses strict `Math.hypot(dx,dy)<anchor.radius+probe.radius`: zero matches → frozen `candidateAnchorId:null`, one → frozen canonical `candidateAnchorId`, multiple → null fail-closed. Projection is immutable `GEOMETRIC_CANDIDATE_ONLY` with `geometryProvenanceVerified:false`, `projectileProvenanceVerified:false`, `authorizesDamage:false`, `mutatesHealth:false`. Caller geometry/probe do **not** attest engine collision, projectile lifecycle/ownership/freshness, trusted physical anchor binding or any live health change. No Titan 180/2400 HP, 6000ms, geometry/attack parameters, runtime changes, mode routing, defeat/rewards/economy/persistence, timers, caps/budgets or FOTON authority.

Certification:
- Temporary pre-PR SHA `0896ab7ab83bc303073ac297a59ef70ddc5c0e7e`, run `39094902997` certifier `117579205141` GREEN focused+repo/gameplay/platform/typecheck/release/dossier/build/readiness; Android `117579371110` GREEN debug APK build/verify/upload. Temporary helper removed.
- Clean PR #520 head `05f1dbd7439599982fada9714adc1f17bb276862`; exact-head CI `39095054636` / `117579658183` and Android `39095054642` / `117579657921` GREEN with verified uploaded APK.
- Canonical `99a22466093abbb4355355cda62c34b099b53462`, sole parent `a493b5cca15d0961335a550b8872491d154b6a8c` (DOC66), tree `6c59a066c6569b3232eea50c5c5cbd6c16b61a5e` equal clean PR head tree; exact diff only `src/game/blackoutArchitectStructuralGeometricCandidate.ts`, `tests/es-13j9j-blackout-architect-structural-geometric-candidate.test.mjs`, `tests/gameplay/blackout-architect-structural-geometric-candidate.test.ts`.
- Post-main CI `39095141448` / `117579907291`, Android `39095141463` / `117579908142` with verified uploaded APK, Pages `39095195286` build `117580068335` + deploy `117580130943` GREEN. Issue #519 CLOSED.

### ES-13DOC67 — J9J closure and J9K provenance discovery
Status: **DEPLOYED / FROZEN (DOCS ONLY)**
Canonical `26e699f43755b0c507d16a1d14bb44944ff294f2`; Issue #521 CLOSED / PR #522 MERGED.
- Single parent `99a22466093abbb4355355cda62c34b099b53462` (J9J gameplay), tree `4f4447511f112c163e719894ef31a2b273cb1fbb` equals clean PR #522 head `1ccdbcada58c98d84cbd8d608b5b29acfd26d1ad` tree; exact three docs.
- Pre-PR temporary SHA `51d748399f33bd9b95a278f7a3f1dc5ef839be9f`, run `39095377663`, cert job `117580606802` GREEN and helper removed. PR CI `39095469260` / `117580884447` GREEN.
- Post-main CI `39095538680` / `117581095387`, Pages `39095577573` build `117581209087`, deploy `117581259302` GREEN. No Android (docs-only).

### ES-13DOC68 — DOC67 closure and J9K frame-claim preflight activation
Status: **DEPLOYED / FROZEN (DOCS ONLY)**
Canonical `8a769d9b6b96fe8dbb140b7c4afb8dec331fa0a0`; Issue #523 CLOSED, PR #524 MERGED.
- Single parent `26e699f43755b0c507d16a1d14bb44944ff294f2` (DOC67), tree `eefba6e1a19e408dd4730ed384d7545e2115143e` matches clean PR #524 head `ac639b5ba26508277bc38efbd38c110fd9d91e74`, exact three docs.
- Pre-PR temporary SHA `12dfe1f601be161792165de10c9beeb199a724b5`, run `39096117944` / `117582814433` GREEN with full repo/gameplay/platform/typecheck/release/evidence/build/readiness; helper removed.
- PR exact-head CI `39096227596` / `117583134180`, post-main CI `39096302477` / `117583359337`, Pages `39096355241` build `117583524361` and deploy `117583595840` GREEN. Docs-only, no Android.

### ES-13J9K — Pure Blackout Architect Frame-Claim Consistency Preflight
Status: **DEPLOYED / FROZEN**
Canonical `5a820a1dc373a63917fdfb4c5150981a6494670a`; Issue #525 CLOSED, PR #526 MERGED.

Single positive authority: **pure caller-supplied frame/contact/J9J geometric candidate consistency**, with no live execution. J9K validates exact own-data frame `{encounterId,frameSequence,projectileId,projectileAlive,projectileFromPlayer,projectileConsumed}`, exact claimed contact `{encounterId,frameSequence,projectileId,anchorId}` and an exact frozen J9J `GEOMETRIC_CANDIDATE_ONLY` result with same cardinal anchor and all false authority flags. IDs nonblank/bounded, frame safe nonnegative integer, alive and player projectile true, consumed false; rejects malformed accessor/symbol/inherited/extra shape, mismatched encounter/frame/projectile/anchor, dead/hostile/consumed and miss. Output frozen `FRAME_CLAIM_CONSISTENCY_ONLY` with `collisionProvenanceVerified:false`, `projectileLifecycleVerified:false`, `preventsReplay:false`, `authorizesDamage:false`, `mutatesHealth:false`. Repeating a caller claim yields the same output: **there is no replay prevention or real hit authentication**. No health, core exposure, legacy shield logic, geometry ownership, actual projectile consume, encounter issuance, timer, phase, attack, spawn/raid/rematch, HUD, economy, persistence, caps/budgets, mode or FOTON/formation changes; Titan 180/2400 HP and 6000ms exposure stay Titan-owned.

Evidence:
- Temporary cert SHA `7963b2ff102cd429fd5dbe9f88b8905b5d8c18d7`, full run `39096599698` certifier `117584253978` and Android `117584398053` GREEN (focused/static/gameplay, repo/gameplay/platform/typecheck/release/evidence/build/readiness, APK build/verify/upload). Temporary helper removed.
- Clean PR #526 head `60ec3cdd6e823f0939a444826baccd24ebd6bb3c`, exact 3-file diff. PR CI `39096760296` / `117584729711`, Android `39096760300` / `117584729692` GREEN including verified uploaded APK.
- Canonical sole parent `8a769d9b6b96fe8dbb140b7c4afb8dec331fa0a0` (DOC68), tree `4ab1c9ff2831b0a040c0ce0b8727aa9b9102390a` matches clean PR head tree. Exactly `src/game/blackoutArchitectFrameClaimConsistency.ts`, `tests/es-13j9k-blackout-architect-frame-claim-consistency.test.mjs`, `tests/gameplay/blackout-architect-frame-claim-consistency.test.ts`.
- Post-main CI `39096859519` / `117585011200`, Android `39096859408` / `117585010905` SUCCESS with verified uploaded APK, Pages `39096911978` build `117585163052`, deploy `117585217690` SUCCESS; Issue #525 CLOSED.

### ES-13DOC69 — J9K closure and J9L collision discovery preservation
Status: **DEPLOYED / FROZEN (DOCS ONLY)**
Canonical `06b8faa1697b4c4de64cc0887c0ab45595b654d1`; Issue #527 CLOSED / PR #528 MERGED.
- Sole parent `5a820a1dc373a63917fdfb4c5150981a6494670a` (J9K), tree `ce20afbe75227d7ea6c69be4af309143bde663d3` equals clean PR head `3ab1b713c635f9d487ded52c5a06361ef84588c1` tree, exact three documents.
- Pre-PR temp SHA `e0fc0a9aec3297ce1745c75c3e0e3ccf3dde96f6`, run `39097137875` / `117585819320` full cert GREEN and helper removed. Exact-head PR CI `39097251425` / `117586154370` GREEN. Main CI `39097320217` / `117586345783` and Pages `39097381226` build `117586520517` / deploy `117586579214` GREEN. Docs-only, no Android.

### ES-13DOC70 — DOC69 closure and J9L-A metadata activation
Status: **DEPLOYED / FROZEN (DOCS ONLY)**
Canonical `4966968163d176fdbac6a8ec7696b767dd540172`; Issue #529 CLOSED, PR #530 MERGED.
- Parent `06b8faa1697b4c4de64cc0887c0ab45595b654d1` (DOC69), tree `af829e18ec3092c1ace0996433d472c0b3c8d910` identical clean PR head `f127b69b886c7c12f9dd247a3455ab5852863232` tree, exact three docs.
- Pre-PR temporary SHA `ceac09106f14b18a6c2d5cffbfa91100ee05aea5`, run `39162508331` / `117778578612` full repo/gameplay/platform/typecheck/release/evidence/build/readiness GREEN; helper removed.
- Exact-head PR CI `39162634082` / `117778955558` GREEN; main CI `39162746400` / `117779287258`, Pages `39162819139` build `117779504419` + deploy `117779598771` GREEN. Docs-only, no Android.

### ES-13J9L-A — Engine-Owned Run/Physics-Frame/Player-Shot Trace Metadata
Status: **DEPLOYED / FROZEN**
Canonical `61009948f55caf4260623de57a24c8cd211f0369`; Issue #531 CLOSED, PR #532 MERGED.

Engine-owned *creation trace metadata only*, not hit proof. A tiny pure `nextBlackoutArchitectCollisionTraceOrdinal` accepts only nonnegative safe integer previous ordinal below `MAX_SAFE_INTEGER`, otherwise null. `EnergySwarmGame.tsx` owns three scalar refs: monotonically incremented run epoch across startGame calls (never reset), active physics frame incremented after boss-defeat cinematic early return (thus paused/modal/hit-stop paths skip) and player-shot ordinal incremented when `makeProjectile` constructs each primary, QUANTUM echo or mitosis duplicate shot. All three remain optional *flat numeric* fields on player projectiles only; invalid/exhausted counters omit metadata without suppressing gameplay. Original `Projectile.id: Math.random().toString()` and RNG draw/order, velocity/damage/lifetime, projectile caps, enemy shots, combat resolution, FOTON, all modes and legacy boss health/rewards/exposure unchanged. No extra scan, collection/Map/Set, timer, draw or event ledger.

Evidence:
- Temporary certification SHA `58944bb79454bf2f4845b128165a712252589114`, run `39163247283`, certify `117780795839` full focused/static/gameplay, repo/gameplay/platform/typecheck/release/evidence/build/readiness GREEN, Android `117780962331` GREEN APK build/verify/upload. Temporary workflow removed.
- Clean head `4a90bfd0a4a26b5e796b1827a3cbc7d44ab5a078` and PR #532 exact-head CI `39163439415` / `117781373240`, Android `39163439431` / `117781373360` GREEN with uploaded APK.
- Canonical parent `4966968163d176fdbac6a8ec7696b767dd540172` (DOC70), tree `0df4ea4b827d9c322b5224ebf59151f25b23c0a1` equal clean PR head tree, exactly five files `src/game/blackoutArchitectCollisionTraceOrdinal.ts`, `src/game/EnergySwarmGame.tsx`, `src/game/types.ts`, `tests/es-13j9la-blackout-architect-engine-trace-adoption.test.mjs`, `tests/gameplay/blackout-architect-collision-trace-ordinal.test.ts`.
- Post-main CI `39163568406` / `117781760009`, Android `39163568403` / `117781759994` SUCCESS including uploaded verified APK, Pages `39163634896` build `117781945856` + deploy `117782021449` GREEN.

### ES-13DOC71 — J9L-A closure and J9L-B discovery preservation
Status: **DEPLOYED / FROZEN (DOCS ONLY)**
Canonical `4273a9e2e55bc8e62b7b840625a8a5b7dd3992a8`; Issue #533 CLOSED / PR #534 MERGED, sole parent `61009948f55caf4260623de57a24c8cd211f0369` (J9L-A), tree `684836b84f003a46abec1087856e3efb462219fd` equals clean PR head `4380b483468f402d5459802f54a70a1179766dcf`, exactly 3 documents. Pre-PR temp `e9631a6807f12aee13dea5a54dd29df5f17b55a9`, cert `39163917911` / `117782778493` GREEN and helper deleted; PR CI `39164053210` / `117783181571`, main CI `39164168481` / `117783518163`, Pages `39164232002` build `117783708080` + deploy `117783805312` GREEN. Docs-only, no Android.

### ES-13DOC72 — DOC71 closure and J9L-B1 observation activation
Status: **DEPLOYED / FROZEN (DOCS ONLY)**
Canonical `519d36b8bf6d302b537dfc49d2115416e9839cfe`; Issue #535 CLOSED, PR #536 MERGED, sole parent `4273a9e2e55bc8e62b7b840625a8a5b7dd3992a8`, tree `cb378d0b28a0194f1917e4c6b3935b193f997d3e` identical PR #536 clean head `4c9b349ff6b4ef46b3f50d7bcbe970708debe7a0`. Exactly three documents.
- Pre-cert helper SHA `9c84e27947d54048688950b40201d85ff046ce6c`, run `39173610477` / job `117811634678` GREEN (repo/gameplay/platform/typecheck/release/evidence/build/readiness), helper removed.
- PR exact-head CI `39173742402` / `117812027479`, main CI `39173845207` / `117812336190`, Pages `39173903250` build `117812506826`, deploy `117812578614` GREEN. Docs-only no Android.

### ES-13J9L-B1 — Passive Legacy Projectile Consume Observation
Status: **DEPLOYED / FROZEN**
Canonical `515f61038d83868ebf403b5c3c8ecea691d1b009`; Issue #537 CLOSED, PR #538 MERGED.

The existing engine now **passively observes** legacy player-projectile consumption after the two existing `proj.life=0` statements: shield-node collision has priority, or otherwise the spatial first enemy collision. A dedicated outer read-only bridge reads the actual engine J9L-A run epoch and active-physics-frame refs without violating the frozen J9L-A requirement that the `detectAndResolveCollisions` method itself never accesses those refs. A tiny helper `observeBlackoutArchitectLegacyPlayerHit` validates the actual player projectile is already consumed, its safe creation run/frame/player-shot fields match engine run/active physics frame, and neither observation field existed. On first valid observation, writes only `collisionTraceObservedLegacyHitFrame` and `collisionTraceObservedLegacyHitKind` (`LEGACY_SHIELD_NODE`/`LEGACY_ENEMY`). Invalid/foreign/stale/duplicate/exhausted states do nothing; no hit is suppressed. The **third** existing `proj.life=0` route, enemy projectile against player, remains untouched/unobserved.

The observation is **not** tamper-resistant collision proof, a trusted event ticket, an exact-once cross-encounter replay ledger, physical Blackout Architect cardinal anchor identity, new damage or health authority. It does not change any legacy hit test, shield priority, HP/score/rewards/VFX/exposure/timers, attack/spawn/rematch, mode/economy, FOTON or caps/RNG; no Titan HP or 6000ms exposure transfer, no Architect live activation.

Certification evidence:
- Two earlier RED pre-PR cert runs `39174247338` (new static test initially counted only the two player routes, omitting the enemy-projectile third) and `39174409585` (frozen J9L-A static test forbade direct counter refs inside collision resolver) were diagnosed from job logs and corrected **without changing older tests**. New static contract now guards all three routes and bridge placement.
- Final pre-PR temp SHA `a6796d124cd7c9287b1ffbf1b4acda070f05da85`, run `39174589199` certify `117814548707` full focused/repo/gameplay/platform/typecheck/release/evidence/build/readiness GREEN; Android `117814755405` GREEN including APK build/verify/upload. Helper deleted.
- Clean PR #538 head `c5a907feec2a629dd91ed81c2f9c18f7d31e4699`; PR CI `39174867512` / `117815352686`, Android `39174867388` / `117815352267` SUCCESS with verified uploaded APK.
- Canonical parent `519d36b8bf6d302b537dfc49d2115416e9839cfe` (DOC72), tree `7e92a677ce9bb64a2f33d66a9867c81c5afdcc5b` equal PR head tree, exact 5 files `src/game/EnergySwarmGame.tsx`, `src/game/blackoutArchitectLegacyHitObservation.ts`, `src/game/types.ts`, `tests/es-13j9lb1-legacy-hit-observation.test.mjs`, `tests/gameplay/blackout-architect-legacy-hit-observation.test.ts`.
- Main CI `39175004027` / `117815743703`, Android `39175004051` / `117815743784` SUCCESS with verified APK uploaded, Pages `39175055538` build `117815889155`, deploy `117815971131` SUCCESS. Issue #537 CLOSED.

### ES-13DOC73 — J9L-B1 closure and B2 discovery freeze
Status: **DEPLOYED / FROZEN (DOCS ONLY)**
Canonical `87d7b8ba4a3bac1c37e746590b0b3acb761dc027`; Issue #539 CLOSED / PR #540 MERGED, parent `515f61038d83868ebf403b5c3c8ecea691d1b009` (J9L-B1), tree `18763b08c5cee4175d0753277678f6b31f337442` equals clean PR head `e8e7a17e1a443c2f766485cd31cd5f393e445c3a`, exactly three docs. Pre-PR temp SHA `c1d4f3979292b9468ca9271913a7dfde9bba4ace` / run `39175345601` job `117816741948` GREEN with readiness; helper removed. PR CI `39178695564` job `117826659702`, post-main CI `39178772987` job `117826895339`, Pages `39178828240` build `117827053208` / deploy `117827121126` SUCCESS. No Android docs-only.

### ES-13DOC74 — DOC73 closure and B2A isolated reservation activation
Status: **DEPLOYED / FROZEN (DOCS ONLY)**
Canonical `48afb9caa73ff258cc2d7ec46acd4d0a422c41ad`; Issue #541 CLOSED / PR #542 MERGED. Parent `87d7b8ba4a3bac1c37e746590b0b3acb761dc027` (DOC73), tree `c6c3d24bcb4e8abb2991b097eaf2b07ebc76b2af` identical clean PR head `73d387cf62799d3bb4de3219e951dcc75570ce27`; exact three docs. Temp pre-cert SHA `52742bd0dd6ac15b3762c564588cf3a2483700a2`, run `39179265828` job `117828344796` GREEN with readiness; helper removed. PR CI `39179400796` / `117828734710`, main CI `39179516769` / `117829078716`, Pages `39179577197` build `117829249954` + deploy `117829329273` GREEN. No Android docs-only.

### ES-13J9L-B2A — Isolated Encounter-Scoped Player-Projectile Reservation
Status: **DEPLOYED / FROZEN**
Canonical `58ae6efcedb0a5a51af5e74d92221cd918e7d30c`; Issue #543 CLOSED / PR #544 MERGED.

A **non-live**, locally instantiated ledger creates one private `WeakSet<object>` for a caller-supplied positive safe epoch; `reserve(projectile,currentPhysicsFrame,anchorId)` validates a plain extensible `fromPlayer:true` projectile with finite positive life (not yet consumed), strictly positive safe J9L-A creation epoch matching the ledger, safe nonnegative creation/current physics frame (current >= creation), strictly positive safe shot ordinal, canonical NORTH/EAST/SOUTH/WEST anchor ID, checked own data descriptors and absence of legacy hit observation fields. It rejects malformed/accessor/proxy-like/foreign/invalid/stale/dead/hostile/legacy-observed inputs. The first reference reservation returns frozen `RESERVED_ONLY` with `collisionProvenanceVerified:false`, `projectileIdentityAuthenticated:false`, `consumesProjectile:false`, `preventsGlobalReplay:false`, `authorizesDamage:false`, `mutatesHealth:false`. Repeating **the same object reference in the same isolated ledger** fails, even for a different anchor/frame; earlier invalid attempts do not reserve. A cloned projectile or a separate ledger may reserve; no global replay/identity authentication is claimed. Source is inert; no calls from `EnergySwarmGame.tsx`, no projectile writes, geometry, collision events, projectiles consumed, health/damage/reward, RNG, boss, modes/caps/budgets/FOTON or rendering changes.

Certifications:
- Temporary SHA `949a46ece515f21e16aa332699c8966adb7b39a9`, pre-PR run `39179919614` cert `117830289149` GREEN with focused/static/gameplay/repo/gameplay/platform/typecheck/release/evidence/build/readiness, Android `117830485910` GREEN APK build/verify/upload. Temporary helper removed.
- Clean PR #544 head `2abc08c5ff6ce5c073eb01316983fd83230e802b`, CI `39180167351` / `117831030515`, Android `39180167464` / `117831030904` GREEN with uploaded APK.
- Canonical parent `48afb9caa73ff258cc2d7ec46acd4d0a422c41ad` (DOC74), tree `2b949daf3b4bd74665980ba32b5a89037193f2dd` identical clean PR head tree, exactly `src/game/blackoutArchitectEncounterShotReservation.ts`, `tests/es-13j9lb2a-encounter-shot-reservation.test.mjs`, `tests/gameplay/blackout-architect-encounter-shot-reservation.test.ts`.
- Post-main CI `39180320171` / `117831487170`, Android `39180320210` / `117831487210` GREEN including verified uploaded APK, Pages `39180394526` build `117831709684` + deploy `117831784698` GREEN. Issue #543 CLOSED.

### ES-13J9L-B2B — Actual Engine-Owned Cardinal Geometry/Collision/Consumption Adapter
Status: **DISCOVERY ONLY — NO IMPLEMENTATION OR LIVE ADOPTION AUTHORIZED**

Frozen J9L-B2A is an isolated reference-reservation helper, not a trusted physics transaction or a live runtime adapter. It does not own authentic encounter creation, four cardinal physical anchor objects/coordinates/radii/health, a verified engine-origin collision or single consuming route across existing shield/enemy collision paths; cloned references and distinct ledgers can reserve independently. J9L-B1 legacy hit marker and J9L-A metadata also do not provide these guarantees. Future discovery must independently define engine-owned Blackout Architect encounter identity and lifecycle, physical anchor generation and cardinal durability ownership, collision detection/ordering with normal enemies/legacy shields, single consuming projectile transaction and stale/replay safeguards, scoped costs and explicit balancing. Do not import J9I caller damage or Titan weakpoint HP180, core2400, radii78/46, exposed6000ms, attack weights or rewards. No B2B implementation Issue/branch/live boss/HP/damage/mode adoption authorized. Preserve Campaign/Infinite/Score Attack, all bosses, FOTON/formations, budgets/caps and manual blockers #4/#5/#202/#248.


### ES-13DOC76 — Verified collision ownership seams, narrow B2B1 authorization
Status: **DISCOVERY RECORDED / B2B1 PURE PREFLIGHT AUTHORIZED / NO LIVE CODE**. Issue #547; reference `main` `41a823275ebb8e9bc421a253a4ab9d1ce4cda740`.

Code findings: start/reset, hit-stop and cinematic frame progression in `EnergySwarmGame.tsx` own existing run/frame/shot trace. The boss factory uses legacy `Enemy` and `spawnBossShieldNodes` from chassis profiles, not four certified physical Architect anchors. The projectile sweep has one enemy spatial index and existing impact precedence **legacy shield node → indexed enemy** (player shots), with hostile projectile → player independent; no engine-origin Architect cardinal collision ticket. J9L-B2A WeakSet reserves only per-ledger object references. Preserve this truth; never claim a geometric candidate or frozen caller claim is a physical hit.

Authorized only as **isolated non-live** J9L-B2B1: pure exact-shape architect encounter/lifecycle *claim* preflight. Require own-data `bossId: BLACKOUT_ARCHITECT`, safe positive run and encounter ordinals, nonnegative safe physics frame, `chassisId: TITAN_CORE` compatibility and exactly four unique NORTH/EAST/SOUTH/WEST IDs. Return frozen `PREFLIGHT_ONLY` with every trusted provenance/live damage/consumption/replay authority false; reject accessor/symbol/inherited/duplicates/nonfinite/invalid epochs. No engine integration, geometry/radius/health defaults, timing, RNG, new boss instance, direct damage, economy or mode route. New B2B1 Issue+branch, adversarial tests, full repo/gameplay/platform/typecheck/release/dossier/build/readiness and Android gates before merge.

**Not yet authorized:** actual engine-issued Architect encounter identity, physical cardinal objects, location/radius/HP, arbitration between legacy shields/cardinals/enemies, projectile consumption and replay transaction, Architect spawn/phase/reward and any gameplay activation. Each requires independently scoped authorization/certification. Do not reuse Titan tuning or affect Devourer/Worm/FOTON, caps, Campaign/Infinite/Score Attack, manual #4/#5/#202/#248.

### ES-13DOC77 — Pure B2B1 close and real engine B2B2 hold
Status: **J9L-B2B1 DEPLOYED / FROZEN; J9L-B2B2 DISCOVERY ONLY**. Issue #551.

Issue #549 CLOSED / PR #550 MERGED. B2B1 canonical `43d7bafff03d201d1fd142e5e3fe50adbc2147c1`, parent DOC76 `11c2c9cf9dafa87d70ac2a9f803be77554b3978f`, tree `ee7a3c7cf10cc25556674251520ec7997e5b62f0` identical PR clean head `792eb0091413851f8b2851852fba30d0ef901e3c`. Exactly `src/game/blackoutArchitectEncounterClaimPreflight.ts`, `tests/es-13j9lb2b1-encounter-claim-preflight.test.mjs`, `tests/gameplay/blackout-architect-encounter-claim-preflight.test.ts`. Pre-PR initial `39372336365` RED from invalid TypeScript test-only Array subclass constructor; corrected without weakening the adversarial case. Final pre-PR `39372454468` SUCCESS all focused/repository/gameplay/platform/typecheck/release/evidence/build/readiness + verified uploaded Android APK, temporary workflow removed. Exact-head PR CI `39372616613` and Android `39372616607` SUCCESS, post-main CI `39372807337` / Android `39372807320` / Pages build+deploy `39372898326` SUCCESS. DOC76: Issue #547 CLOSED, PR #548 MERGED canonical `11c2c9cf9dafa87d70ac2a9f803be77554b3978f`, pre-cert `39371608323`, PR CI `39371746902`, post-main CI `39371860116`, Pages `39371922399` SUCCESS (docs-only).

B2B1 checks only exact untrusted caller-data `BLACKOUT_ARCHITECT`, `TITAN_CORE` compatibility, positive safe run/encounter ordinals, safe nonnegative physics frame, exactly one each NORTH/EAST/SOUTH/WEST. Rejects malformed/inherited/accessor/symbol/sparse/duplicate/throwing proxy cases and returns frozen `PREFLIGHT_ONLY` projection with engine issuance, trusted identity, lifecycle freshness, geometry, collision, consumption, replay prevention, HP/damage, boss spawn and mode routing all false. Neither engine collision nor live gameplay adoption. No import in `EnergySwarmGame.tsx`; no changes to legacy collisions, spawn, health, timing, RNG, FOTON, entity caps, modes or bosses.

Next ES-13J9L-B2B2 is **DISCOVERY ONLY, NOT CODE-AUTHORIZED**. First define a truly engine-owned Architect encounter identity and lifecycle (spawn, restart, defeat/cleanup, paused/hit-stop/cinematic stale states), actual engine-owned cardinal anchor geometry/health independent of Titan HP/radii/exposure, collision precedence vs shield nodes and spatial enemy first-hit, and exactly one consuming shot transaction without additional full entity scans. Pure B2B1 caller fields provide no authenticated physics ticket. No real Architect boss, damage, rewards, stages or mode routing until separate documentation authorization + Issue + exact-SHA cert. Preserve Devourer/Titan/Worm, Campaign/Infinite/Score Attack, FOTON, caps and manual blockers #4/#5/#202/#248.

### ES-13DOC78 — Engine encounter lifecycle discovery and dormant revocation-only activation
Status: **DOCUMENT AUTHORIZATION ONLY (until own gates pass)**. Issue #554, research Issue #553. Exact audit baseline `609a58f56d4b6ba2c0afc506fd9c974ca01dbe24`.

**Discovery:** `EnergySwarmGame.tsx:1403-1407` increments run epoch and resets frame/shot ordinals, while `:1512-1534` clears legacy boss+nodes on restart. `triggerGameOver:2076-2085` halts the loop but leaves the boss reference until reset. `spawnBoss:3039-3055` first clears legacy enemies, may return without creating a boss for invalid RAID profile; never issue an Architect ticket at function entry or use the predictable legacy `Enemy.id:3091-3097`. Only `bossRef.current = boss` at `:3129` establishes a real legacy boss reference, not Architect identity. `:3216-3249` creates legacy chassis shield nodes with their own coordinates/HP/radii, **not** four Architect cardinal physical anchors.

**Revocation vs freeze:** `gameLoop:4001-4014` pause/modal, `:4049-4055` hit-stop and `updateEnginePhysics:4362-4394` boss-cinematic early return suspend physical work, so they must **not** revoke an otherwise active future encounter solely on frame suspension. `:6320-6321` and `:6389-6390` begin boss-defeat cinematics (revoke at entry); `:4207-4213` clears projectiles during cinematic and `:4279-4358` resolves rematch/RAID/Campaign transitions (revoke before replacing boss). `:2146-2162` clears Campaign boss at Infinite handoff. Restart and `triggerGameOver` also revoke.

| Engine event | Future Architect slot | Trust / physics semantics |
|---|---|---|
| Before genuine Architect spawn; all legacy bosses | null | No Architect ticket, legacy gameplay unchanged |
| `startGame` or game-over | revoke/null | No cross-run or ended-run validity |
| Existing `spawnBoss` / boss replacement / mode handoff | revoke/null before possible replacement | Legacy ID/chassis cannot mint Architect |
| Pause/upgrade-modal/hit-stop | no revocation | Freeze; no frame advance or fresh collision |
| Boss defeat initiated (direct/splash) | revoke/null immediately | No five-second cinematic hit reuse |
| Raid escalation/rematch cleanup | revoke/null | No stale boss reference leakage |
| Future *dedicated* Architect spawn | **not implemented or authorized** | Must be minted by engine after owning real boss object, monotonic guarded ordinal and run epoch |
| Ordinal exhausted/invalid | fail closed for Architect | Never suppress legacy shooting or hits |

**Collision seam hypothesis, not implementation:** existing `detectAndResolveCollisions:5922-6063` builds one shared enemy spatial index for collision and FOTON; each player shot checks legacy `shieldNodesRef` first (`proj.life=0`) then finds first indexed enemy (`proj.life=0`), whereas `:6414-6426` handles hostile projectiles vs player separately. A future bounded four-cardinal Architect pass can only be considered after certified live identity/geometry; preserve existing shield-first and deterministic one-shot collision ordering, avoid extra O(N) enemy scans, and consume a player projectile at most once. B2B1 caller `PREFLIGHT_ONLY` and B2A per-ledger WeakSet are not collision provenance; neither authorizes damage. Never borrow Titan weakpoint health 180, core 2400, radius 78/46, exposure 6000ms, attacks or rewards.

**Narrow B2B2A code authority (only after DOC78 exact-SHA cert):** engine-private *dormant revocation-only slot*, initially and always `null` in this phase, with an isolated type/helper whose only runtime operation clears it to `null`. Add only one engine `useRef` and cold-path cleanup hooks in `startGame`, `triggerGameOver`, `spawnBoss`, Campaign→Infinite, boss-defeat initiation (both sites) and normal RAID/rematch teardown, plus adversarial/static tests that assert no positive issuance, no read/adoption from collision, no Boss/EnemyType mutations, and unchanged legacy/projectile/cap/FOTON routes. A helper must report all `ownsEngineEncounterIssuance`, real geometry, collision/consumption/replay/damage/HP/spawn/mode authorities as **false**. No additions to per-frame hot loops, no RNG/draw/array work. Pause/modal/hit-stop must not revoke. This **does not** claim an Architect instance exists; identity issuance requires separate post-B2B2A authorization tied to an actual dedicated spawn.

**After B2B2A (still DISCOVERY ONLY):** dedicated Architect spawn identity with nonreused run+encounter ordinal and physical boss object reference, four engine-owned cardinal circles/health, explicit priority arbitration and exactly-once consumption transaction, balance, spawn/routing/UI, certifications. Preserve Devourer/Titan/Worm, Campaign/Infinite/Score Attack, FOTON/formations, budgets and manual blockers #4/#5/#202/#248. B2B2A requires independent Issue/branch, tests, full pre-PR CI+Android APK, exact-head PR CI+Android, guarded squash and exact-SHA main CI+Android+Pages. No gameplay write in DOC78.

### ES-13J9L-B2B2A — Engine Dormant Architect Encounter Revocation
Status: **DEPLOYED / FROZEN (NULL-ONLY — NO ARCHITECT ENCOUNTER)**.
Issue #556 CLOSED; PR #557 SHA-guarded squash MERGED. Gameplay canonical `8bab0f3656d84ef65d24eecba4a72f96707c2341`, sole parent DOC78 `e05c2699ce32c10dad9e03ec48306ad5d559480e`, canonical tree `117e9e55d65333d4309974bb9983e4ff1621f6f7` identical clean PR head `eea2903c0ebb678a8133e2af92d65342e7e13f6f`. Four-file diff: `src/game/EnergySwarmGame.tsx` (+14 lines), `src/game/blackoutArchitectDormantEncounterRevocation.ts` (+26), `tests/es-13j9lb2b2a-dormant-revocation.test.mjs` (+68), `tests/gameplay/blackout-architect-dormant-revocation.test.ts` (+19).

Pre-PR complete run `39413745183` SUCCESS at temporary `a8d430725d7362765fa821c9a88bb178b3b8d366` with focused/static/gameplay/repo/platform/typecheck/release/evidence/build/readiness and Android APK build/verify/upload; temporary workflow removed. PR CI `39413969899` and Android `39413969768` SUCCESS on clean head. Post-main CI `39414170433`, Android `39414170280` (APK uploaded), Pages build+deploy `39414293297` SUCCESS on exact canonical.

Engine now holds `useRef<BlackoutArchitectDormantEncounterSlot>(null)` where the type permits **only null**. Exactly seven bounded cold-path `revokeBlackoutArchitectDormantEncounter()` assignments: run start, game over, existing legacy boss spawn/replacement, Campaign→Infinite handoff, both normal/splash boss defeat initiation branches and cinematic completion. No revocation on pause/modal/hit-stop (freeze only), no hot-loop allocation or extra scan, no new RNG or TypeScript Enemy/Projectile extension. Revoker cannot issue a token, create an Architect enemy, authorize hit/physical anchor/collision/consumption/replay/health/damage/spawn/routing or import Titan HP/radii/exposure. All existing Titan/Devourer/Worm, Campaign/Infinite/Score Attack, FOTON, entity caps and rewards remain frozen.

Prior DOC78 (Issue #554 CLOSED, PR #555 MERGED) canonical `e05c2699ce32c10dad9e03ec48306ad5d559480e`, docs tree `2c5826547915843e3880e7c55160f96081cb6046`, pre-cert `39412558008`, PR CI `39412750383`, main CI `39412918774`, Pages `39413041725` SUCCESS. Research #553 CLOSED. DOC79 Issue #558 is docs-only closure; its own merge/CI/Pages evidence must be recorded after gates, not assumed.

**Next J9L-B2B2B: DISCOVERY ONLY — NOT CODE-AUTHORIZED.** Genuine Architect identity requires dedicated actual engine-owned boss spawn (not a Titan alias), run epoch plus safely increasing unique encounter ordinal bound to the actual `bossRef` object, lifecycle invalidation across boss replacement/defeat/restart and independent physical cardinal geometry/durability and shot-consumption design. Do not reuse predictable legacy `Enemy.id` or B2B1 caller `PREFLIGHT_ONLY` as proof; no Architect spawn/HP/phase/attack/geometry/consume/mode/HUD/rewards authorized. Any implementation demands a new documentary authorization, distinct Issue, adversarial tests and all exact-SHA gates. Manual blockers #4/#5/#202/#248 remain OPEN.

### ES-13DOC80 — B2B2B research closed toward offline-only Architect candidate factory
Status: **DOCS-ONLY AUTHORIZATION IN CERTIFICATION**, Issue #561, research Issue #560. Baseline `main` `47f2dc69df6a4e53d02e893bf81baa28ac355476`; do not infer DOC80 merge or gates until verified.

**Source-gated distinction:** `types.ts:173-180` already declares the `NULL_ARCHITECT` Infinite rematch family; it is NOT the `BLACKOUT_ARCHITECT` expansion. `EnemyType.BOSS_TITAN` and `bossChassis:"TITAN_CORE"` are legacy compatibility facts and cannot authenticate an Architect. `Enemy` in `types.ts:182-224` has no expansion ID; `EnergySwarmGame.tsx:2395-2418,2624-2632` routes campaign and Infinite to the legacy `spawnBoss`. That factory `:3048-3140` can fail before installation on invalid RAID profile and otherwise uses predictable legacy IDs, legacy chassis health and weakpoints. `:3559-3735` derives attacks from `BLACKOUT_DEVOURER_CANON` plus legacy chassis/family weights. Activating Architect through Titan would inherit uncertified behavior. B2B2A's `BlackoutArchitectDormantEncounterSlot` remains **null only** with seven cold revocations.

**Only next isolated code authority after DOC80 itself GREEN:** J9L-B2B2B1 — `FACTORY_ONLY` offline candidate construction/identity probe. Exactly one new `src/game/blackoutArchitectOfflineEncounterFactory.ts` and two independent new static/gameplay tests. Closure-private monotonically increasing safe encounter ordinal; one frozen, freshly factory-issued `BLACKOUT_ARCHITECT` candidate per valid positive safe run epoch. `begin` invalidates a previous candidate and produces an opaque distinguishable reference, `isCurrent` compares **reference identity** within that factory, `revoke` clears without reusing/resetting ordinal, and overflow fails closed. Validate invalid/NaN/negative/-0/unsafe ordinals, spoofed copies, cross-factory objects and stale identities, repeated calls, frozen result, no side effects. This is **not** an Engine-issued encounter and must truthfully expose **all engine/live identity, spawn, physical geometry, collision, consume, replay, HP/damage, phase, mode, reward and persistence authorities as false**. Do not import into `EnergySwarmGame.tsx` or frozen contracts; do not create `Enemy`, modify `EnemyType`, choose Titan health/size/radius/attacks, add RNG/timers/per-frame scans, route modes or alter FOTON/entity caps.

**Later B2B2B2 / live Architect:** remains DISCOVERY ONLY, no code authority. A genuine engine-owned Architect instance must have a dedicated actual successful spawn, independently typed unique discriminator, run epoch and bound boss object with monotonic guarded encounter identity, removal at defeat/restart/replacement, separately specified non-Titan health/cardinal geometry/attacks/HUD and a physically authenticated single-impact collision route. Caller B2B1 preflight, B2B2A null slot and B2B2B1 offline owner are NOT proof of live provenance. Preserve Devourer/Titan/Worm, Campaign/Infinite/Score Attack, `NULL_ARCHITECT`, FOTON, caps, RNG and manual #4/#5/#202/#248. Gameplay B2B2B1 requires its own Issue, branch, static/gameplay/full cert+Android APK, exact PR-head CI/Android, guarded squash, main CI/Android/Pages, next DOC closure.

### ES-13DOC81 — Close J9L-B2B2B1 offline candidate owner
Status: **DEPLOYED / FROZEN DOCS**, Issue #565 CLOSED, PR #566 MERGED; canonical gameplay baseline `eb170a87cb7dbb35cba5d278d6f92c8fc70a901a`. No DOC81 merge assumed until its own gates complete.

**J9L-B2B2B1 is DEPLOYED / FROZEN as isolated `FACTORY_ONLY`, not a live Architect boss.** Issue #563 CLOSED, PR #564 SHA-guarded squash MERGED; gameplay canonical `eb170a87cb7dbb35cba5d278d6f92c8fc70a901a`, sole parent DOC80 `9b4aab1debf4f015bdc7bbacad2f35f3865e9128`, tree `c0223c42028a806abd58f44055dd810fb07bb241` matches clean PR head `7b3ad3e67c54f10b23c8eb3cbbc96ddbdbc931d9`. Three new files only: `src/game/blackoutArchitectOfflineEncounterFactory.ts`, `tests/es-13j9lb2b2b1-offline-candidate.test.mjs`, `tests/gameplay/blackout-architect-offline-candidate.test.ts`. Full pre-PR `39422283904` SUCCESS with focused/repo/gameplay/platform/typecheck/release/evidence/build/readiness and verified APK (temporary `2c1ba0ea5bca164135281b4c1107611adcd96d59`, helper removed). PR CI `39422534182` / Android `39422534141` SUCCESS; post-main CI `39422777208`, Android `39422777134`, Pages build/deploy `39422905213` SUCCESS on exact canonical.

A factory's closure-private counter and reference-identity check disambiguate its **own offline candidates**, reject clones/cross-factory/stale/revoked identities, fail closed on invalid input and ordinal overflow, and never reset the ordinal on revoke. All output flags deny live engine issuance, boss reference authentication, physical cardinal geometry/durability, collisions, projectile consumption, damage, phases, attack/mode, reward or persistence. This factory **must not** be represented as a trusted game encounter and is not imported by `EnergySwarmGame.tsx`. `NULL_ARCHITECT` existing Infinite family and `EnemyType.BOSS_TITAN`/TITAN_CORE remain separate legacy concepts; no actual Blackout Architect boss has been spawned.

DOC80 Issue #561 / PR #562 docs canonical `9b4aab1debf4f015bdc7bbacad2f35f3865e9128`, tree `dc1906b335576b3b48de6466ea1b644f59598ca5`, pre-cert `39421305807`, PR CI `39421506014`, post-main CI `39421675172` and Pages `39421800711` SUCCESS, research Issue #560 CLOSED.

**Next J9L-B2B2B2 — Authentic engine-only Architect spawn/identity boundary: DISCOVERY ONLY, NOT CODE AUTHORIZED.** Audit a *dedicated successful* Architect boss spawn path, new explicit identity independent of preexisting NULL_ARCHITECT and Titan/Devourer, shared `Enemy` and renderer/attack/health assumptions, safely monotonically issued actual engine run+encounter ordinal tied to installed boss object, revocation at restart/game over/defeat/replacement. No call to offline factory can mint a trusted engine encounter. A physical four-cardinal anchor set, independently selected HP/geometry, projectile arbitration/single consuming transaction, phases, attacks, HUD, modes/rewards demand further separate authorization and certification. No type/EngineSwarmGame.tsx edits under DOC81. Preserve Campaign/Infinite/Score Attack, Titan/Devourer/Worm, FOTON, budgets, RNG and manual #4/#5/#202/#248 OPEN.

### ES-13DOC82 — Discover live Architect admission boundary; authorize only offline reference attachment rehearsal
Status: **DOCUMENT AUTHORIZATION ONLY — NO B2B2B2 ENGINE CODE**. Issue #568; source research #567. Audited exact baseline `5f09ff3a1e5cd1243976e78a03b80a06c905de44` (DOC81 PR #566). DOC81 Issue #565 CLOSED; PR #566 MERGED. Main CI `39423752166` and Pages `39423843054` SUCCESS. Current gameplay remains B2B2B1 `eb170a87cb7dbb35cba5d278d6f92c8fc70a901a`, Issue #563 PR #564 certified pre-PR `39422283904`, clean PR CI/Android `39422534182`/`39422534141`, main CI/Android/Pages `39422777208`/`39422777134`/`39422905213` SUCCESS.

**Why no direct Architect spawn yet:** `EnergySwarmGame.tsx:2416-2418` routes Infinite rematch and `:2630-2632` Campaign completion into the legacy `spawnBoss`; `:3048-3066` clears enemies and may reject a missing RAID profile before installation; `:3068-3140` builds legacy health/chassis/ID-backed `Enemy` and assigns it to `enemiesRef` and `bossRef`. No true `BLACKOUT_ARCHITECT` branch or dedicated live identity exists. `types.ts:173-180` already has the unrelated Infinite `NULL_ARCHITECT` identity, and `EnemyType.BOSS_TITAN`/`TITAN_CORE` remains a mere structural compatibility marker, not the expansion. Adopting the offline B2B2B1 factory into `spawnBoss` could falsely authenticate a caller epoch and accidentally inherit Titan/Devourer health, size, weakpoints, exposure, attacks, rewards, renderer/mode logic. The live B2B2A `BlackoutArchitectDormantEncounterSlot` remains null-only, cold-revoked at `EnergySwarmGame.tsx:1409,2085,2118,3053,4291,6332,6402`; pause/modal/hit-stop `:4012-4025,4060-4066` only freeze. `:5934-6075` retains one spatial enemy index reused for FOTON and shield-first then indexed-enemy player-projectile consume. No cardinal geometry or verified Architect collision exists.

**Next B2B2B2A code authority, conditional on DOC82 exact-SHA CI+Pages GREEN:** Only add `src/game/blackoutArchitectOfflineReferenceAttachment.ts` and two focused static/gameplay tests. An isolated closure-private attachment of an **offline factory-owned current** `FACTORY_ONLY` candidate to a caller-supplied opaque object by strict reference identity and matching positive safe claimed run epoch; fail closed and revoke on invalid input, stale factory candidate, alternate reference, cross-factory/clones, epoch change or explicit revoke. A frozen `ATTACHMENT_REHEARSAL_ONLY` projection must expose every actual engine/spawn/health/geometry/collision/consume/replay/damage/mode authority false. An externally supplied object and run epoch are NOT engine provenance even when the rehearsal succeeds. Never import this helper into `EnergySwarmGame.tsx`, `types.ts`, `bossChassis.ts`, collision/renderer or live null-only slot; no runtime boss, epoch issuance, gameplay modification or O(N)/random/timer side effects. Require adversarial tests for -0, zero, floats, unsafe ordinals, NaN, Infinity, stale/replaced, clone/cross-factory, repeated attachment, throwing objects, frozen projections and retained null authority. An isolated reference rehearsal is **not** authentication and cannot promote `FACTORY_ONLY` to a live ticket.

**Later B2B2B2B genuine engine admission:** DISCOVERY ONLY / NOT AUTHORIZED. Requires independently selected Architect-specific boss entity discriminator and dedicated successful spawn path (not `NULL_ARCHITECT` or Titan), safe engine-issued encounter ordinal and actual `bossRef` ownership plus reliable rollback/revocation; separate physical 4-cardinal HP/geometry, collision ordering and exclusive projectile-consumption, boss balance/attack/phase/UI/modes/reward authorization. No TSX edits in DOC82 or B2B2B2A. Manual blockers #4/#5/#202/#248 OPEN. DOC82 itself requires isolated 3-doc branch, full pre-PR certification, clean PR CI, SHA-guarded squash and exact canonical main CI+Pages before authorizing B2B2B2A.

### ES-13DOC83 — B2B2B2A isolated reference-attachment closure
**DEPLOYED / FROZEN offline prototype; not gameplay boss admission.** Issue #570 CLOSED PR #571 MERGED, gameplay canonical `4b82f41d2344cbe98a88c95d46adca660aad930e`, parent DOC82 `1889ec8a4abf2fb9b1d96db4ffdbd65788ea98ca`, tree `9dfdcf9b6e96f7c198e70eaddabf28294316e638` equals clean PR head `61f6a50c994be86f3cb961081f6add5bce3b1d69`. Three added files (offline owner and focused static/gameplay tests), no engine/import/collision/type modifications. Pre-PR `39459524694` full test/Android APK GREEN, exact-head PR CI `39459814047` and Android `39459814187` GREEN; post-main CI `39460042782`, Android `39460042700`, Pages `39460167294` GREEN. DOC82 Issue #568 PR #569 certified docs `1889ec8a4abf2fb9b1d96db4ffdbd65788ea98ca`, pre-PR `39458376909`, PR CI `39458598896`, main CI `39458794428`, Pages `39458920658` GREEN.

Offline attachment requires B2B2B1 factory's latest identity, caller claimed valid epoch and caller supplied object reference; spoofed clone/cross-owner/invalid/replaced references cannot remain current. Successful `ATTACHMENT_REHEARSAL_ONLY` is *never* engine-issued: authentic boss identity, four physical cardinal anchors, collision/consumption, damage, health, attacks, phases, rendering, modes and rewards all false. No `BLACKOUT_ARCHITECT` live spawn. **Next B2B2B2B: DISCOVERY ONLY** of a true dedicated spawn with engine-owned epoch/ordinal bound to genuinely installed boss, independent balancing and lifecycle; any real engine code requires separate DOC84 certification. Preserve `NULL_ARCHITECT` rematch, Titan/Devourer/Worm, Campaign/Infinite/Score Attack, FOTON, RNG/caps. Human/device blockers #4/#5/#202/#248 remain OPEN.

### ES-13DOC84 — Dedicated Architect combat blueprint before live spawn
Status: **DOCS AUTHORIZATION PENDING CI/PAGES**, Issue #575 / source audit #574, baseline `609b91cf2b13ff9480d120a677868fd30ed5c3ad` DOC83 #572 PR #573 certified pre-PR `39655068469`, PR CI `39655314483`, main CI `39655530010`, Pages `39655686518` SUCCESS.

**Design proposal, not existing facts or approved balance:** B2B2B2B1 only, separate pure frozen `BLACKOUT_ARCHITECT` blueprint (no reuse of existing Titan identity or attack tables): core proposed HP1920/size58, 4 cardinal anchor HP135/radius13 and offsets N(0,-106), E(116,0), S(0,106), W(-116,0), phase gates 0.68/0.32, proposed exposed window 3700ms, independent telegraphed attack design IDs GRID_LOCK, VECTOR_TIDE, SECTOR_WALL, bounded <=8 shots. Validate world dimensions 1600x960 and preserve MAX_ENEMIES80/MAX_PROJECTILES120. Numbers are editable in future phases, never silently copied from Titan HP2400/anchors180/exposure6000. Authorizes only isolated source + static/gameplay tests; no runtime import, issuance, boss spawn, cardinal world arrays, damage or projectile consumption, collision/provenance, attack/hud/route/rewards. All live authority flags false. **Dedicated live boss B2B2B2B2** must receive separate DOC85 plus full code tests and Android/Pages gates. Manual blockers #4/#5/#202/#248 remain OPEN.

### ES-13DOC85 — Independent Architect blueprint delivered; next engine integration gated
**J9L-B2B2B2B1 DEPLOYED / FROZEN, DESIGN ONLY**. Issue #577 CLOSED PR #578 MERGED canonical `9d8bb2f9abef208e3ad76a8cf97e2218a5d5dbd7`, sole parent DOC84 `d6f4f2e5eaa4e7bb3ea5f7d5a468fc071e5f7061`, tree `f9f45aeac9783098c01b1b5f8e871f7949e7eba9` matches clean PR head `b41f79d72262c6b955e80763b2de8d333904417b`. New profile+two tests only. Pre-cert initial RED `39657984436` TS2367 test assertion, fixed without weakening; final pre-PR `39658223056` full CI/Android APK GREEN, PR CI `39658522225` and Android `39658522265` GREEN; main CI `39658756297`, Android `39658755604`, Pages `39658867703` GREEN.

**Proposed independently tunable design**, not actual gameplay balance: core HP1920 size58, four hypothetical NORTH/EAST/SOUTH/WEST HP135/radius13/offsets N(0,-106)/E(116,0)/S(0,106)/W(-116,0), phase gates 0.68/0.32, suggested exposure 3700ms, attack idea IDs GRID_LOCK/VECTOR_TIDE/SECTOR_WALL. All numbers newly proposed. Deep freeze and coordinates bounded by 1600×960; max suggested burst8 <= global MAX_PROJECTILES120. Design blueprint has all engine issuance, physical anchor geometry, hit, consume, HP/damage, AI, HUD, mode and reward authority false; never imported into runtime. DOC84 #575 PR #576 canonical `d6f4f2e5eaa4e7bb3ea5f7d5a468fc071e5f7061`, pre-PR `39656743445`, PR CI `39657005167`, main CI `39657237739`, Pages `39657364201` SUCCESS.

**Next B2B2B2B2: SOURCE DISCOVERY ONLY**: genuine independent boss type, factory, run epoch/encounter ordinal only after success installing actual `bossRef`, separate attacks/AI/render/HUD and safely bounded physical cardinals, collisions/consumption, HP and modes. Requires DOC86 authorization, new code Issue, exact CI+Android+Pages; do not inherit Titan HP2400/anchor180/exposure6000. Preserve legacy `NULL_ARCHITECT`, Campaign/Infinite/Score Attack, Devourer/Titan/Worm, FOTON/caps and blockers #4/#5/#202/#248.

### ES-13DOC86 — Cold authentic-identity architecture before any playable boss
**Issue #582 DOCS ONLY, pending exact-main gates**, baseline `377faf8f72cfb802528cf31de952d8307ec8b6d2` DOC85 Issue #579 PR #580 pre-cert `39659455214`, PR CI `39659671830`, post-main CI `39659895506`, Pages `39660059637` GREEN. Source research #581 identifies old boss spawn, AI/damage, graphics and HUD hard-coded to existing three enemy boss types.

Conditional B2B2B2B2A authorization: implement *unique* BOSS_ARCHITECT type and optional dedicated identity marker; create private engine-controlled monotonic run epoch/encounter ordinal ledger that authenticates only when a future Architect object occupies the exact engine boss ref and last enemy slot. Hook ledger begin/revoke only on cold lifecycle in EnergySwarmGame, preserve null-only B2B2A slot, freeze during pause/hitstop. **No dedicated spawn is called, no playable boss/hit/collision/AI/UI/mode activation in B2B2B2B2A**; tests simulate admission but do not prove actual live spawn. Never alias `NULL_ARCHITECT` or `TITAN_CORE` and do not copy old HP/anchors/attacks.

After separate DOC87, B2B2B2B2B may wire a genuinely installed QA-only boss and guarded identity, initially inactive in normal modes. Physical 4 anchors, hit arbitration, HP, AI, attacks and HUD need further scoped certification with Android. Preserve Campaign/Infinite/Score Attack, FOTON, MAX_ENEMIES80/MAX_PROJECTILES120 and manual #4/#5/#202/#248 OPEN.

### ES-13DOC87 — Cold engine-owned identity guard certified, no actual boss
Gameplay B2B2B2B2A Issue #584 CLOSED PR #585 SHA-guarded MERGED `f601a6bf1fc84c865b8b677917b169770d8f5828`, parent DOC86 `3fced4f29285fe2006c14ec20a8f35550b8dcb6e`, tree `a08a7a6f4114ac0e4aab4eac47ca9daea1997e5e` matches clean head `9e2c869a441bd57e421589289b2e2476cdc4b34b`. Five files only: BOSS_ARCHITECT exclusive Enemy enum, type-only dedicated identity tag, cold engine-owner lifecycle, owner module plus two adversarial tests. Original J9A prohibition preserved without weakening. Temporary pre-PR runs `39677936788` / `39678283901` RED (J9A literal and new regex respectively), both corrected; final pre-PR `39678413254` SUCCESS full suites/Android APK; clean PR CI `39678658133` + Android `39678658106` SUCCESS; post-main CI `39678889519`, Android `39678889754`, Pages `39679026821` SUCCESS. DOC86 #582 PR #583 canonical `3fced4f29285fe2006c14ec20a8f35550b8dcb6e`, pre-cert `39676260750`, PR CI `39676541420`, main CI `39676769814`, Pages `39676917499` GREEN.

The engine now has a private *capability* to issue a reference guard after a future genuinely installed Architect, plus monotonic run epoch. The current runtime never calls `admitInstalledBoss` and no entity is installed; there is no Architect physical world geometry, collider/HP mutation, AI, attack, HUD or playable mode. B2B2B2B2B **DISCOVERY ONLY**, first QA-only explicit opt-in actual boss installation then validated admission, requires independent DOC88. Keep public Campaign/Infinite/Score Attack, `NULL_ARCHITECT`, Devourer/Titan/Worm, FOTON, global enemy/projectile caps and manual #4/#5/#202/#248 unchanged/open.

### ES-13DOC88 — First guarded engine-installed Architect QA milestone
Authorization pending Issue #588 and full docs CI/Pages; baseline DOC87 `8359d7a600fbddc472e3860b110dad60efc0be84`, #586 PR #587 CI/Pages GREEN (`39679929755`/`39680054470`). NEXT B2B2B2B2B if certified: dedicated BOSS_ARCHITECT prototype factory using proposal HP1920/size58 (still untuned), DEV-only CTRL+ALT+SHIFT+F9 at an empty Campaign wave break, engine installs boss/enemies refs then calls owner admission, frozen diagnostic state, explicit exit revocation and cold tear-down. Test invalid phase/duplicate/restart/foreign reference/production gating. It is not a shipped encounter: **physics frozen**, four cardinal structures and collision/HP/AI/HUD still unimplemented. Update superseded B2B2B2B2A no-game-admission test only with stronger DEV-only and exact-one admission coverage; preserve J9A shared types barrier, seven dormant null slots, legacy bosses, FOTON, modes and caps. Future DOC89+ required for combat mechanics and QA→user release. Manual blockers #4/#5/#202/#248 OPEN.

### ES-13DOC89 — Close real DEV-only Architect reference-admission diagnostic
Status: **DOCS-ONLY CLOSURE UNDER CERTIFICATION**, Issue #592. Gameplay B2B2B2B2B Issue #590 CLOSED, PR #591 guarded squash MERGED `8468311ddb3ec77f0d7bae490347ef6c5b61a706`, sole parent DOC88 `af04f25584cb8763a63a57db228eb46c177b0bd0`, tree `d73b23662de6244fe98faf762ae514d3b58feeaa` identical clean head `08c533bdddfe7427b78f101fb564474b6e256979`. Exactly 5 files: `EnergySwarmGame.tsx` guarded QA, new `blackoutArchitectDevQaBossFactory.ts`, prior static phase assertion intentionally upgraded from no-admission to one DEV-only admission, new static and gameplay tests. No weakening J9A literal barrier, B2B2A null-only 7 revocations or B2B2B2B1 profile isolation.

First pre-cert `39691227253` failed outdated test expecting only 5 owner revokes; corrected it to require 7 (five original cold + 2 QA exit/rollback). Final full pre-PR cert `39691335146` GREEN focused/repo/gameplay/platform/typecheck/release/evidence/build/readiness plus verified uploaded APK (temp helper removed). PR CI `39691602229`, Android `39691602243`, post-main CI `39691842436`, Android `39691842359` uploaded APK, Pages build/deploy `39691961919` all SUCCESS exact SHAs. DOC88 Issue #588 CLOSED PR #589 docs canonical `af04f25584cb8763a63a57db228eb46c177b0bd0`, pre-PR `39690041017`, PR CI `39690196770`, main CI `39690359122`, Pages `39690474184` SUCCESS.

**First game-engine installed object, DEV QA only, not a playable Architect:** explicit CTRL+ALT+SHIFT+F9 in running empty between-wave Campaign session under Vite `import.meta.env.DEV` creates a unique `BOSS_ARCHITECT` Enemy based on *provisional* core HP1920/size58 design, installs same object into `enemiesRef.current` and `bossRef.current`, only THEN admits via private owner identity guard, reverses atomically on failed admission, freezes all physics/waves/projectiles/AI while QA held, displays DEV-only label; same chord or cold lifecycle revokes/removes it. `bossActiveRef` is not enabled, public build has no enabled QA hotkey, Infinite/Score Attack do not route to it. No browser/manual keyboard interaction or real-device graphics demonstration is claimed, only CI/static/gameplay tests and Android APK build. **Physical four cardinals, hits, collision arbitration, HP/damage, AI/attacks, gameplay HUD/rewards and normal player activation are still unimplemented**.

Next B2B2B2B2C requires a separate source-audited DOC90 plan to incrementally implement DEV QA dedicated presentation and cardinal *physical geometry* with verified safety; collision single-consume and boss damage/attacks must remain independently gated. Manual/device #4/#5/#202/#248 OPEN; preserve legacy NULL_ARCHITECT/Devourer/Titan/Worm, Campaign/Infinite/Score Attack, FOTON, RNG and caps.

## J10 — Expert Risk / Reward
Status: **PLANNED / DEFERRED — NOT ACTIVE**

Resonance Graze, Quantum Slip, near-miss chains and optional danger-proximity bonuses. Never mandatory for baseline survival.

## J11 — Build & Synergy Expansion
Status: **PLANNED / DEFERRED — NOT ACTIVE**

Distinct run identities around Solar, Hydro, Wind, Thermal, Magnetic and Quantum, followed by controlled hybrid synergies.

## J12 — Rare Events & Secret Encounters
Status: **PLANNED / DEFERRED — NOT ACTIVE**

Golden Rift, Ancient ORBI Signal, Blackout Armada, Unknown Energy Signature, Titan-class Intruder and hidden variants. Surprise without required progression blockers.

## J13 — Score, Rank & Mastery
Status: **PLANNED / DEFERRED — NOT ACTIVE**

C/B/A/S/S+ ranks, optional sector objectives, perfect sectors, no-damage/swarm-preservation targets, affinity efficiency, formation mastery, time/chain goals and mode-specific mastery.

## J14 — Procedural Interaction Matrix
Status: **PLANNED / DEFERRED — NOT ACTIVE**

Safely combine `enemy archetype + evolved trait + formation + biome + mutator + event` with deterministic seed reproduction, explicit compatibility rejection and global caps/budgets authoritative.

## J15 — Gameplay Integration & Long-Range Balance
Status: **PLANNED / DEFERRED — NOT ACTIVE**

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


### ES-13DOC90 — Authorize genuine DEV QA cardinal geometry (Issue #594)
**Authorization only, NOT gameplay implemented**, source-audited baseline `a3a37692cb7f13749ebaf969bb6f298f86f625cb`. Previous DOC89 #592 / PR #593 canonical remains `a3a37692cb7f13749ebaf969bb6f298f86f625cb` with main CI `39692695162`, Pages `39692816551` SUCCESS. Research parent #581 remains OPEN; no PR open at audit. 

The Vite-only F9 chord currently installs a real `EnemyType.BOSS_ARCHITECT` and privately attests the same `bossRef` object inside `enemiesRef`, but all physics freezes before collision. The original blueprint proposes four distinct cardinal anchors N(0,-106), E(116,0), S(0,106), W(-116,0) with HP135, radius13; these are **not yet real engine geometry**. Existing `shieldNodesRef` belongs to legacy Devourer/Titan/Worm and must never be reused.

**C1 implementation scope when DOC90 is certified:** add one new isolated `src/game/blackoutArchitectDevQaCardinalGeometry.ts` engine-owned state creator (four separate mutable anchors, each own x/y/radius/health/maxHealth and unique cardinal id); instantiate only after successful QA guard validation, at the actual verified `bossRef` position and within WORLD bounds, attach same boss object/guard; atomic rollback and null release in all QA teardown; render four circles/status in existing camera pass without old boss HUD; update only `src/game/EnergySwarmGame.tsx` and narrowly adjust previous DEV-QA static label assertion if needed, plus one new static and one new gameplay adversarial test. No new global collections or actor/shot scans. Four anchors must never be represented as historical `shieldNodesRef` or as certified target/hit. Preserve QA loop freeze and DEV-only gate. Every non-DEV codepath remains dormant. 

**Explicitly forbidden C1:** no projectile collision or consumption, anchor/core HP mutation, phase progression, exposure, Architect AI/attacks, rewards, normal Campaign/Infinite/Score Attack routing, new random/clock/budgets, changes to legacy bosses, FOTON or MAX_ENEMIES80/MAX_PROJECTILES120. All manual #4/#5/#202/#248 stay OPEN. The first actual QA collateral hit requires distinct DOC91 + C2 Issue/PR and exactly-once arbitration tests; subsequent core damage/gameplay and attack pattern phases are separately gated. C1 requires full repository/gameplay/platform/typecheck/release/evidence/build/readiness plus Android APK, exact PR CI+Android and main CI+Android+Pages before docs-only DOC91 closure.


### ES-13DOC91 — Close DEV-QA cardinal geometry C1 and authorize real C2 anchor-hit seam
**SOURCE-ANCHORED DOCUMENT AUTHORIZATION** Issue #598, exact baseline `e624404803eaeccc0a6ea474cc24e31da3c06e56`. C1 #596 CLOSED / PR #597 guarded squash MERGED canonical `e624404803eaeccc0a6ea474cc24e31da3c06e56` (one parent DOC90 `b2f9d3dc205a50cddaef466ed6ec295eba531bdc`, tree `294eec1b9dc7b834a434612034f70ac746bb8ff6` matches PR head `8790b8cfae70850f11e9b3925c7ec13e2d724b28`). Exactly five changed files: `src/game/EnergySwarmGame.tsx`, new `src/game/blackoutArchitectDevQaCardinalGeometry.ts`, prior QA static test, new C1 static and gameplay tests. Pre-cert `39700584148` all focused/full/repo/gameplay/platform/TypeScript/release/evidence/build/readiness and uploaded Android APK; temporary workflow removed. PR CI `39700859230`, Android `39700859219`, post-main CI `39700993896`, Android `39700993908` (uploaded APK artifact `12392413933`), Pages `39701099405` build+deploy all SUCCESS.

**Actually implemented:** only in the same authenticated, developer-opt-in Vite QA encounter, four distinct engine-owned independent *mutable initialized* cardinal health-bearing circles (NORTH/EAST/SOUTH/WEST, radius13/HP135 and blueprint offsets). The creator rejects non-Architect/Titan/NULL/spoofed references, invalid engine identity, out-of-bounds and overlap; array/outer state immutable and each HP object sealed. The game creates the four objects after actual successful private guard admission, fails closed with rollback on geometry invalidity, draws four camera-correct circles and numeric initial HP labels and nulls QA state on teardown. The QA gameLoop still returns early before `updateEnginePhysics`; there are **NO physical hits, projectile collision/consumption, any health writes from combat, anchor destruction, core HP, attacks, HUD production integration, score/reward, mode activation or manual browser/Android certification**. Never borrow Devourer/Titan/Worm `shieldNodesRef`, HP/weakpoints, or preexisting Infinite `NULL_ARCHITECT`.

**C2 authorization conditional on DOC91 exact-SHA docs CI + Pages GREEN:** new `src/game/blackoutArchitectDevQaCardinalImpact.ts` to perform actual DEV-QA-owned, guard+object+frame-authenticated bounded collision and exactly-one consumption on one of the four circles, apply finite nonnegative real damage to its own HP, destroy at zero and allow positive/negative/replay/adversarial tests. Narrow `EnergySwarmGame.tsx` wiring for a real player-projectile transaction; preserve shield-first precedence, reuse spatial enemy index, reject duplicate/stale/ref mismatch, forbid same projectile damaging boss core/other anchors/legacy enemy; no extra O(N) enemy scans. Important: current diagnostic freeze means a mere collision helper is not evidence of a playable battle. If a C2 interactive QA-only direct-shot trigger is needed to validate a real hit, scope it to the currently installed DEV boss, explicit opt-in, same real projectile and geometry refs, no wave/AI/global physics/routing, and label it clearly as controlled QA rather than gameplay. 

C2 is **NOT** authorized to add core damage/exposure, movement/projectile general stepping, phases, AI/GRID_LOCK/VECTOR_TIDE/SECTOR_WALL, HUD for production, scores/rewards, or Campaign/Infinite/Score Attack routing. Keep MAX_ENEMIES80/MAX_PROJECTILES120, RNG/FOTON, historical contracts, legacy bosses, and manual #4/#5/#202/#248 OPEN. C2 needs separate Issue, branch at exact latest `main`, full pre-PR CI+APK artifact, clean PR CI+Android, protected squash, canonical parent/tree/path verification and main CI+Android+Pages before a DOC92 closure. No C2 implementation writes under docs-only DOC91.


### ES-13DOC92 — C2 real DEV QA cardinal single-hit certification; next gated C3 core HP
**DOCS-ONLY AUTHORIZATION**, Issue #602, canonical gameplay baseline `e80454b03bfd02f3afb6f308c728a4061480a13d`. C2 implementation Issue #600 CLOSED, PR #601 SHA-guarded squash MERGED `e80454b03bfd02f3afb6f308c728a4061480a13d`; parent DOC91 `2d6e9ed610d090f2257e18615d42124c2be6563a`, canonical tree `ad7981d216ae583af7b2d1de8ef0858f3bf6a1bf` identical clean PR head `9291dfab450be5f397aa2ce90bb22171881d6dfd`. Six scoped files only: `EnergySwarmGame.tsx`, new `blackoutArchitectDevQaCardinalImpact.ts`, new focused static/gameplay tests, two narrow preexisting QA label assertions; temporary full-precert workflow removed. Pre-cert `39702806591` SUCCESS focused/full repo/gameplay/platform/TypeScript/release/evidence/build/readiness and Android debug APK verified/uploaded `12393486847`. Earlier pre-cert REDs `39702489571` invalid test regex, `39702592390` and `39702759746` J2 protected code scope/static assertion were diagnosed/corrected without relaxing historical tests. Exact-head PR CI `39703063578`, Android `39703063741`, post-main CI `39703247030`, Android `39703247133` verified artifact `12393214690`, Pages build+deploy `39703354830` all SUCCESS. DOC91 docs #598/#599 canonical `2d6e9ed610d090f2257e18615d42124c2be6563a`, CI `39701796175`, Pages `39701875274` SUCCESS.

**Real capability now in engine, DEV-only:** user explicitly opts into F9 QA on empty Campaign wave break, then clicks world-space aim; one genuine engine-held QA `Projectile` advances by bounded delta in frozen-world branch, hits at most one of the four independent cardinal circles, consumes once and applies finite bounded HP damage capped at current HP. Destroyed cardinal (zero HP) does not absorb a subsequent shot. Strict engine owner+boss ref+guard+shot ref denies clones, foreign/stale runs and malformed data. No new enemy scan or modification to legacy shield-first collision. `updateEnginePhysics`, normal AI/waves/FOTON movement, time/score/rewards/modes remain frozen. **NO certified browser interaction or device test, no core HP damage/defeat, dedicated attack AI or normal mode boss.** Manual #4/#5/#202/#248 stay OPEN.

**C3 authorized ONLY AFTER DOC92 exact-main CI+Pages GREEN:** add isolated real `blackoutArchitectDevQaCoreImpact.ts` returning one authenticated core hit only with all four real anchors health 0, same live QA `Projectile` and private `owner.isCurrent`/installed `bossRef`. C2 anchor resolution always runs first; no combined anchor+core write or double consumption. Mutate only Architect core HP (provisional initial1920, original core radius via distinct `boss.size`), finite bounded damage/health, zero clamp; no inherited Titan weakpoint/exposure/chassis. Display DEV-only core HP, anchor completion and terminal QA state; never call legacy defeat cinematic, award points or advance modes. **Critical actual owner contract:** `matchesInstalledArchitect` requires `health>0` and `isDead===false`, so terminal zero-health must trigger explicit safe QA cleanup/revocation; do not modify/relax identity guard. C3 is NOT autonomous combat nor player-movement simulation. Separate issue/branch/tests and all pre-cert/PR/main Android+Pages SHA gates. Later C4 player mobility/HUD and C5 original attack patterns need separate authority. Historical legacy `NULL_ARCHITECT`, Devourer/Titan/Worm, Campaign/Infinite/Score Attack, FOTON, RNG and caps 80/120 unchanged. No code changes in DOC92; exactly three canonical docs.


### ES-13DOC93 — C3 original Architect core QA HP certified; authorize isolated FOTON QA navigation C4
**Documentation-only phase**, Issue #606, baseline exact `457b9a25f1ae4e591238c914bfbab99f4586c0ce` from audited live GitHub. C3 Issue #604 CLOSED, PR #605 guarded squash MERGED `457b9a25f1ae4e591238c914bfbab99f4586c0ce`; sole parent DOC92 `0bf0241872c8e0b51c806125b61a09fa380630e0`. Tree `ff652e7f701e79fe03912d3c924bdc44794175a6` identical to certified PR head `215604a12d5170d68527b525c4cdc93e9dd97688`, four changed files only. Pre-PR full focused, repo/gameplay/platform, TypeScript, release/evidence/build/readiness and Android APK run `39704495125` SUCCESS; APK artifact `12393189524`; temporary workflow removed. PR CI `39704709230`, Android `39704709246` SUCCESS. Canonical post-main CI `39704842680`, Android `39704842753` (APK artifact `12395080210`), Pages `39704944804` SUCCESS.

**C3 actual capability:** Vite DEV-only, explicit QA hotkey Ctrl+Alt+Shift+F9 with verified live original `BOSS_ARCHITECT` object; C1 owns exactly four cardinal geometry/HP circles, C2 moves one real player Projectile in QA and hits/destroys circles, C3 requires all four health zero before allowing that same reference-authenticated projectile to damage original Architect core HP (initial 1,920). At zero core HP, exact QA identity is revoked, references cleared, terminal DEV-only notice appears; no legacy cinematic, scoring, rewards or mode transitions. Wave/AI/time/global physics/FOTON movement stays frozen. **Not** an autonomously playable Architect boss. No human browser/device validation; manual #4/#5/#202/#248 stay OPEN.

**Conditional C4 authorization only after DOC93 post-main CI + Pages SUCCESS:** introduce one isolated pure `src/game/blackoutArchitectDevQaFotonMovement.ts` that reads sanitized input vector and advances the real `playerPosRef.current` by existing `PLAYER_BASE_SPEED`, existing formation speed mod, bounded frame delta and diagonal normalization, with finite values and `WORLD_BOUNDS` clamping. In `src/game/EnergySwarmGame.tsx`, run it exclusively in the authenticated DEV-QA branch using existing `keysPressedRef` WASD/arrows and `touchDirectionsRef`, never advancing `updateEnginePhysics`, global frames/waves/AI/scores, or changing the normal movement block. Optionally preserve camera following only in same DEV-QA branch with bounded viewport and no outside-case effects; render real FOTON and existing QA projectile/anchors/core via existing canvas. Target is moving, manually aimable FOTON QA, not moving companions or autonomous battle. Strict tests for keyboard/touch precedence, diagonals, delta caps, bounds, invalid vectors and no other write authority. Authorized four files max: `EnergySwarmGame.tsx`, new FOTON movement module, new static and gameplay tests; prior assertion edits only if necessary. Historical J2 handler, J9A and B2B2A dormant seven hooks unchanged; Devourer/Titan/Worm/NULL_ARCHITECT, production Campaign/Infinite/Score Attack, FOTON abilities, RNG/caps 80/120/rewards/persistence untouched. C4 requires its own Issue, clean feature branch, pre-PR full + Android APK artifact, exact PR-head CI+Android, SHA-guarded squash, canonical tree/parent/diff and main CI+Android+Pages and DOC94 docs-only closure. C5 separate attack authority; C4 does not authorize GRID_LOCK, VECTOR_TIDE, SECTOR_WALL, production HUD, progression or any manual PASS.


### ES-13DOC94 — Certify live QA FOTON mobility C4; gate genuine GRID_LOCK attack C5
**Docs-only authorization**, Issue #610, audited main `cb0bd0069a9b16b1f9f187cb87c7ee3251608974`. C4 #608 CLOSED / PR #609 guarded squash canonical `cb0bd0069a9b16b1f9f187cb87c7ee3251608974` with sole parent DOC93 `fe88781d6129333f6cdfa8ea8c60dcff50c64b3a`; canonical tree `d3c9b8ffd7e76aa44daeefdc3480bd257fe63c16` exactly matches PR head `cb1b298be50d4e53cffe4fecab3b48bf7eab11bc`, four-file diff only. Full pre-cert `39706363511` SUCCESS with focused/full repo/gameplay/platform/TypeScript/release/evidence/web build/readiness/Android APK and uploaded artifact `12394629377`; temporary workflow removed. Exact-head PR CI `39706624008` and Android `39706624051` SUCCESS. Post-main CI `39706794050`, Android `39706794049` (artifact `12395590400`), Pages `39706893960` SUCCESS. DOC93 #606 / PR #607 canonical `fe88781d6129333f6cdfa8ea8c60dcff50c64b3a`, main CI `39705847585`, Pages `39705946492` GREEN.

**C4 actually implemented:** verified, installed BOSS_ARCHITECT DEV QA object with four C1 physical anchors, C2 real one-at-a-time cardinal hits and C3 four-destroyed-gated core damage, plus C4 pure bounded real `playerPosRef.current` keyboard/arrow/touch mobility with original base speed/formation factor, normalized diagonals, world clipping and QA-only camera follow/restoration. The rest of `updateEnginePhysics`, progression, FOTON abilities, enemy AI and global scoring/reward remain frozen. Not a production boss or manually browser/device-certified encounter. All manual Issues #4/#5/#202/#248 remain OPEN.

**Authorize conditional C5 only after DOC94 exact-main CI + Pages SUCCESS:** add first physical DEV QA boss attack `GRID_LOCK` with real world-space telegraph (provisional 1400ms), finite active hazard (~850ms), original recovery (6600ms), deterministic two intersecting lanes with explicit half-width and extent, *actual collision of moving QA FOTON* and exactly once per active cycle finite 20 damage to independent QA-only 100-HP hull. Render telegraph/active lane warning and QA hull/stage in existing world-space Canvas and overlay. At QA hull zero explicitly revoke/clear QA and show DEV-QA-only failure banner, never legacy normal-game loss or rewards. Preserve original unmodified `BOSS_ARCHITECT` owner guard, geometry, C2 projectile, C3 core, C4 real FOTON movement; attack activates only when actual private guard is current. No projectile creation (original GRID_LOCK budget 0), Math.random, timers, wave/score/shieldRef, mode routing or legacy bosses. Guard rejects invalid/foreign identity, stale refs, malformed/infinite coordinates/timers/damage, replay/double axis strikes and budget violations. Only permitted source files `src/game/EnergySwarmGame.tsx`, new `src/game/blackoutArchitectDevQaGridLockAttack.ts`, new static + gameplay/adversarial tests, narrow existing banner assertion change only if required. C6 VECTOR_TIDE, C7 SECTOR_WALL require future separate docs/Issue/PR and cannot be smuggled into C5. Full pre-PR CI+APK, clean exact PR CI+Android, protected squash, tree/path/parent check, main CI+Android+Pages and DOC95 later. No manual browser or actual device PASS claims.


### ES-13DOC95 — Real Architect GRID_LOCK C5 exact-SHA certification; gate first VECTOR_TIDE C6
**Documentation-only certification**, Issue #614, audited GitHub `main` gameplay SHA `98f1416c24784f90102b348c46db04bc537e699e`. C5 implementation #612 CLOSED, PR #613 guarded squash MERGED canonical `98f1416c24784f90102b348c46db04bc537e699e`, only parent DOC94 `653c6a79df8ed76b032f5875f4282e3a9ec440e9`; canonical tree `d542e02a3e2138e9326b1a0f66615d6a81779ba5` equals clean PR head `348efb2647bae21d85ee2637b826b78451b0e0fb`, four scoped files only. C5 pre-cert `39708121238` all focused/full repo/gameplay/platform, TypeScript, release/evidence/build/readiness and Android APK SUCCESS, artifact `12396091300`; temporary workflow removed before PR. Exact-head PR CI `39708371045` and Android `39708371042` SUCCESS. Post-main CI `39708654266`, Android `39708654296` (APK `12396012516`), Pages build/deploy `39708733072` SUCCESS.

**Actually in DEV QA:** BOSS_ARCHITECT already installed with 4 real distinct destructible cardinal anchors, C2 one player projectile and anchor HP, C3 four-down-gated core 1920 HP, C4 bounded movement of actual FOTON with WASD/arrows/touch and camera, now C5 engine-authenticated original independent `GRID_LOCK` cross-axis hazard. Two real world-space lanes with telegraph 1400ms, ACTIVE 850ms and recovery 6600ms, halfwidth18 and extent380; 20 HP max once per active phase (both axes share a single hit), to an independently owned 100HP QA hull. At hull zero original owner/refs revoked and DEV-only failure banner, **not** normal game-over or score. No world simulation/wave advance, no normal FOTON shield damage, legacy bosses/chassis or NULL_ARCHITECT, no autonomous production mode, no rewards/persistence, no manually observed browser/device pass. Manual #4/#5/#202/#248 remain OPEN.

**C6 conditional authorization ONLY after DOC95 exact-main CI + Pages SUCCESS:** new isolated `src/game/blackoutArchitectDevQaVectorTideAttack.ts`, first real DEV-QA-controlled `VECTOR_TIDE` implementation, using standalone original provisional attack idea (`minimumPhase 2`, telegraph 1700ms, recovery 7500ms, projectile budget 6), deterministic fixed six independent bounded moving hazard paths and positive/negative/adversarial test proof for positions, velocity, lifetime, player collision, at-most-once impact per hazard, independent QA hull bounded damage, stale run/foreign boss/guard/clones, invalid NaN/Infinity coordinates and budgets. No random or shared projectile array. **Do not silently run C5 GRID_LOCK and C6 VECTOR_TIDE simultaneously:** first implement an explicit QA-only selection/gate or mutually exclusive schedule with authenticated owner for separate exposure, avoiding assumption that original global phase 2 combat is present. Keep C5 unchanged by default, preserve player QA shot and C1/C2/C3 core state, actual C4 movement. No C7 SECTOR_WALL, production phase routing, rewards, legacy boss damage, normal `projectilesRef` changes or scoring. 

C6 requires separate Issue, exact `main` branch, narrow `EnergySwarmGame.tsx` and new standalone attack module plus static/gameplay tests (no unauthorized files), full pre-PR focused/full repo, TS, release/evidence/build/readiness + Android APK uploaded/verified; remove temp workflow; PR exact-head CI+Android; protected squash canonical parent/tree/path; post-main CI+Android+Pages; DOC96 docs-only closure. No human browser/physical device certification claims. DOC95 itself only these three canonical documents, with zero gameplay writes.


### ES-13DOC96 — Genuine isolated VECTOR_TIDE C6 QA certified; gate third SECTOR_WALL C7
**DOCS-ONLY**, Issue #618, source-audited `main` `6bfde829f6a9f1083926373d18dd30c78f274ae1`. C6 #616 CLOSED / PR #617 protected squash MERGED canonical `6bfde829f6a9f1083926373d18dd30c78f274ae1` with sole parent DOC95 `5e96b4e0540abd223488ce5193c8036ea362cf2d`. Canonical tree `1e086501994fc1702547436182d382f66ff42b9b` matches clean exact PR head `efa1bcb4c12de1ce482205d892aad9a04c0100a2` across exactly five files: `EnergySwarmGame.tsx`, new `blackoutArchitectDevQaVectorTideAttack.ts`, new C6 static/gameplay tests, and one narrow old C5 QA failure-banner test assertion. Full pre-cert `39709669362` SUCCESS (focused C5/C6/J2, full repo/gameplay/platform, TypeScript, release/evidence/build/readiness and Android APK verified/uploaded artifact `12396562871`); temporary workflow deleted before PR. PR CI `39709931727`, Android `39709931654` SUCCESS. Post-main CI `39710095366`, Android `39710095279` (uploaded Android APK artifact `12396139481`), Pages `39710198241` SUCCESS. DOC95 #614/#615 canonical `5e96b4e0540abd223488ce5193c8036ea362cf2d`, CI `39709081329`, Pages `39709183736` SUCCESS.

**Real C6 implemented in Vite DEV QA only:** the original installed BOSS_ARCHITECT and all four independently destructible C1 cardinal geometry/HP circles, C2 authenticated projectile-to-anchor hits, C3 core HP, C4 actual bounded FOTON movement and QA camera, C5 real world-space GRID_LOCK lanes, now C6 a different real six-hazard `VECTOR_TIDE` with static deterministic directional velocity, real world movement/collision/life, 1700ms telegraph, 1600ms active and 7500ms recovery. Each unique physical hazard can damage independent QA 100HP hull once per cycle (at most10HP/shot), source state/owner and six-element budget are checked; no global projectilesRef or legacy arrays, RNG/timers, normal player shield, score or rewards. Ctrl+Alt+Shift+F8 swaps C5 GRID_LOCK and C6 VECTOR_TIDE with **mutually exclusive** refs/QA stepping, no simultaneous attacks; no automatic phases or production boss/mode admission. **Not** an autonomous playable campaign boss, nor browser or physical Android manually certified. Manual blockers #4/#5/#202/#248 remain OPEN.

**Conditional C7 authority only after DOC96 main CI+Pages GREEN:** author a distinct original `SECTOR_WALL` physical DEV QA pattern (blueprint minimumPhase3, telegraph1900ms, recovery9000ms, max8 segment/budget). Model eight deterministic separate physical wall segments with world-space geometry, lifecycle, collision and bounded independent QA-hull damage. Integrate via authenticated explicit DEV attack selection with exclusive GRID_LOCK/VECTOR_TIDE/SECTOR_WALL, no concurrent pattern ticks and no fake production phase3; retain existing four-anchors/player shot/core HP/FOTON. New isolated `src/game/blackoutArchitectDevQaSectorWallAttack.ts`, narrow `EnergySwarmGame.tsx` integration, focused positive/negative/adversarial gameplay and static tests; conditional narrow old banner assertion only. Strict owner guard/real refs, out-of-bounds, invalid NaN/timer/HP, duplicate hit/replay, hazard maximum8 tests. No shared player-projectile consumption, legacy boss damage, scores/rewards/modes, FOTON abilities, new RNG/global clock or manual PASS. C7 has own Issue, exact-main branch, full pre-PR CI+Android artifact, workflow removal, PR exact head CI+Android, protected squash and canonical tree/parent/files; main CI+Android+Pages then DOC97 docs-only close. DOC96 itself modifies only the three canonical docs.


### ES-13DOC97 — Close certified physical SECTOR_WALL C7; authorize genuine attack direction C8 conditionally
**Status: C7 DEPLOYED TO MAIN (DEV QA ONLY); C8 NOT STARTED.** DOCS-ONLY Issue #622.

C7 #620 CLOSED / PR #621 guarded squash MERGED canonical `76d55d74111915ffa84c658fb4b5bd3d237a92ab`; sole parent DOC96 `0680e82e48694fa9270c48d5b9547b53ab456b44`. Canonical tree `b1a4f28ac1fa801d0409928a9a28fd840bdbd76e` exactly matches clean PR head `869be5fe61438812c9502c3cdda86e35b5f4ebb1`, five files only: `src/game/EnergySwarmGame.tsx`, new `src/game/blackoutArchitectDevQaSectorWallAttack.ts`, narrow C6 F8 assertion, new C7 static and gameplay tests. Temporary pre-cert workflow removed before PR. Full prerelease C5/C6/C7/J2, full repository, TS, release, evidence, build, readiness and APK pre-cert [39713519713](https://github.com/ingeniusvictor/orbi-energy.swarm/actions/runs/39713519713) SUCCESS at `7df50fdace63d4d6dd53fada7ec3c83d955df2ed`; APK artifact `12398656558` inspected. Exact-head PR CI `39714442913` and Android `39714442655` SUCCESS; canonical post-main CI `39714606483`, Android `39714606397` (APK artifact `12399125539` inspected), Pages `39715027315` SUCCESS.

**Actual limited C7 behavior:** authenticated Vite **DEV QA ONLY** installed distinct `BOSS_ARCHITECT`, four C1 cardinal destructible anchors, C2 real QA projectile impact, C3 four-anchor-gated core HP, C4 real keyboard/touch FOTON movement and QA camera; C5 `GRID_LOCK` two cross lanes, C6 `VECTOR_TIDE` six separate moving hazards, and now C7 `SECTOR_WALL` eight independent radial moving tangent wall segments. Sector Wall 1,900ms TELEGRAPH, 1,500ms ACTIVE, 9,000ms RECOVERY, 12 QA-hull damage at most once **per segment per cycle**, separate 100 HP QA hull, world-space Canvas telegraph/active draw, sanitized owner+guard/current reference, no malformed/stale/foreign/cloned session or replay; `Ctrl+Alt+Shift+F8` cycles exactly GRID_LOCK → VECTOR_TIDE → SECTOR_WALL → GRID_LOCK with no simultaneous refs/steps. C7 preserves older bosses, NULL_ARCHITECT, J2/J9A/B2B2A, normal FOTON/shields, historical projectiles, Campaign/Infinite/Score Attack, RNG/global caps, scores/rewards/persistence. **NOT** automatic phase director, production/live mode encounter, full integrated boss battle, or manually verified browser/Android gameplay. Manual #4/#5/#202/#248 and umbrella #581 remain OPEN.

**Next gameplay priority:** A real QA combat director should select patterns by live boss state, not merely expose another hotkey. Preserve attack timing fairness, exclusive ownership and cumulative QA hull, and keep phases deterministic. Phase thresholds 0.68 and 0.32 in `blackoutArchitectStandaloneCombatBlueprint.ts` are provisional design data, not already wired runtime phases.

**Conditional C8 authority only after DOC97 exact-main CI + Pages SUCCESS:** prioritize genuinely live and playable **DEV QA-only** Architect phase/attack director rather than further hypothetical simulations. Reuse actual installed boss identity, four real anchor health and core HP for nondecreasing phase eligibility (blueprint 0.68/0.32 thresholds are provisional, not silently production-tuned). Schedule one of the three already-physical patterns in deterministic, finite, visible non-overlapping telegraph/active/recovery windows with safe handoff and exclusive guard/current refs. Preserve one authenticated cumulative QA hull across pattern transitions (manual F8 re-instantiation currently initializes fresh attack hull; automated director must not exploit that reset), bounded damage, proper QA-only zero-hull revocation and restart state, no overlapping hazard steps. Tests must exercise actual boss/anchors/core/FOTON, thresholds, handoff, frame boundaries, loss, reference invalidation and legacy isolation. No autonomous Campaign/Infinite/Score Attack inclusion, score/reward/persistence, new RNG/global clocks or global projectile/health mutations. A separate C8 Issue, narrow feature branch, full pre-cert + inspected Android APK, exact PR CI+Android, SHA-guarded squash, canonical tree/parent/diff, post-main CI+Android+Pages, then next separate docs-only closure are mandatory.


### ES-13DOC98 — C8 authenticated, live DEV QA director deployed; conditionally activate C9 integrated playability
**C8 status: DEPLOYED / TEST-CERTIFIED DEV QA ONLY. C9: NOT IMPLEMENTED.** DOCS-ONLY Issue #626; baseline `7fc92502f4e0c798e2feb063a7760e05487e6f8f`.

C8 implementation Issue #624 CLOSED, PR #625 SHA-guarded squash MERGED canonical `7fc92502f4e0c798e2feb063a7760e05487e6f8f`; unique parent DOC97 `0c38dc4d486d4ad331d0cbc1cb4131fb0e464d08`. Canonical Git tree `0095f466ee315484c4e90117d3e061348c38745a` **equals** clean exact PR head `08a1a96e476f3aa00d175c0361b1daf73a2d0b26` across **four** files only: `src/game/EnergySwarmGame.tsx`, new `src/game/blackoutArchitectDevQaPatternDirector.ts`, `tests/es-13j9lb2b2b2b2c8-pattern-director.test.mjs` and `tests/gameplay/blackout-architect-dev-pattern-director.test.ts`. Full focused C5/C6/C7/C8/J2, full repository, TypeScript, release/evidence, web build/readiness and Android APK pre-cert [39717526668](https://github.com/ingeniusvictor/orbi-energy.swarm/actions/runs/39717526668) SUCCESS on `a7525ee1f9a44235526c2730c7f927df96e2dfa7`, inspected APK artifact `12399038449`; temporary precert YAML removed from clean PR. Exact PR-head CI [39717809798](https://github.com/ingeniusvictor/orbi-energy.swarm/actions/runs/39717809798) and Android [39717809844](https://github.com/ingeniusvictor/orbi-energy.swarm/actions/runs/39717809844) SUCCESS. Canonical exact-main CI [39717954150](https://github.com/ingeniusvictor/orbi-energy.swarm/actions/runs/39717954150), Android [39717954092](https://github.com/ingeniusvictor/orbi-energy.swarm/actions/runs/39717954092) and Pages build+deploy [39718051695](https://github.com/ingeniusvictor/orbi-energy.swarm/actions/runs/39718051695) SUCCESS. Main Android APK artifact `12399299423`: verified ZIP, 6,288,539-byte `app-debug.apk`, SHA-256 `70d846e7a137586b3484d4136044b62e2ae56b17ec9720f899bcfebf3ed65563`.

**Actual C8 DEV QA-only gameplay:** `Ctrl+Alt+Shift+F9` still installs the original real `BOSS_ARCHITECT` with four separate, destroyable cardinal anchors, authenticated QA projectile, four-anchor-gated core damage, QA FOTON movement/camera and physical C5 GRID_LOCK / C6 VECTOR_TIDE / C7 SECTOR_WALL. `Ctrl+Alt+Shift+F7` explicitly opts into the new current-guard authenticated director, which observes **actual** anchor/core health and uses provisional blueprint thresholds **68%** and **32%** to unlock phase-appropriate attack choices; no false phase transitions with anchors alive. It consumes actual physics events and changes the unique active attack state only at its real `RECOVERY → TELEGRAPH` boundary, never simultaneously, cycling deterministically through unlocked attacks. Maintains independently bounded non-increasing 100HP QA hull through automatic handoffs; blocks `F8` manual pattern switching **while director is active** to avoid an attack recreation / QA hull reset. DEV QA phase/pattern/hull Canvas status; invalid/foreign/stale refs, tampered health/cycles/geometry and corrupt events fail closed, zero-hull uses QA-only loss teardown. `F7` can turn off director; original manual `F8` mode selection remains once disabled, with its **pre-existing reset-on-new-state behavior**; global cross-mode hull persistence is NOT claimed. No automatic production encounter in Campaign/Infinite/Score Attack, inherited Titan/NULL_ARCHITECT/Devourer/Worm systems, normal player shield/projectile logic, score/reward/persistence/RNG/caps or real-device manual PASS. Parent #581 and manual #4/#5/#202/#248 must remain OPEN.

**Next gameplay direction:** prioritize readable and testable real encounter flow, never assume a compiled APK equals a manual Android playtest. Phase thresholds 68%/32% remain provisional blueprint tuning, not production difficulty balance or campaign progression. No production boss mode added.

**C9 conditional authority only after DOC98 exact-main CI + Pages GREEN:** deepen the **real QA encounter** rather than add documentation-only simulations. Add usable, accurate QA battle information based on installed authentic state: readable individual four-anchor status and core exposure/health, current director phase, selected physical threat, remaining telegraph/active/recovery time and non-increasing cumulative hull, with world-space hazard visibility, keyboard/touch help and accessible presentation without changing production UI. Add integrated positive/negative gameplay runtime tests for real projectile→anchors→core progression, three hazard handoffs, cumulative QA hull across automatic patterns, zero hull/loss, QA cleanup, invalid guards, pause/input/frame boundaries and unchanged Campaign/Infinite/Score Attack. Any change in F7-off→F8 hull reset semantics needs **explicit separate authorization** rather than an unannounced gameplay rule change; physical browser/Android observation requires human evidence and remains unclaimed. Dedicated Issue/branch, minimal code/test ownership, full pre-PR focused/repo/TS/release/evidence/build/readiness+inspected Android APK, PR exact head CI+Android, SHA-guarded protected squash, exact parent/tree/file audit, main CI+Android+Pages and later separate docs-only closure mandatory. No direct main writes or global systems rewrites.


### ES-13DOC99 — Certify live, integrated C9 Architect battle information; gate touch-operable QA C10
**Status: C9 DEPLOYED / TEST-CERTIFIED DEV QA ONLY; C10 NOT IMPLEMENTED.** DOCS-ONLY Issue #630.

C9 #628 CLOSED / PR #629 protected squash MERGED canonical `72d44d5e5560be7b6c33116d500bcff3a940db75` with **sole parent** DOC98 `98d8aeccd8845ab77d9b306e11340c8cf76bbebc`; canonical tree `a35a72793184bff2024d2351f085f4b536e5fe79` equals exact clean PR head `1481d7b108806772fafafe4db042ea9ad6b41fc2`. Four source/test changes only: `src/game/EnergySwarmGame.tsx`, new `src/game/blackoutArchitectDevQaBattleHud.ts`, new static `tests/es-13j9lb2b2b2b2c9-integrated-qa-hud.test.mjs`, new gameplay `tests/gameplay/blackout-architect-dev-integrated-hud.test.ts`; temporary full-precert YAML removed before PR. Full C5/C6/C7/C8/C9/J2 plus repo/gameplay/platform, TypeScript, release/evidence, web build/readiness and Android APK pre-cert run `39719559896` SUCCESS at `24d15b63e85a0e6b1a4f950c2bc1c991849160a0` (inspected artifact `12399938965`; ZIP OK, APK 6,288,467 bytes, SHA256 `780019281611f5c5d5b3aaf890ab04282a5d1b9ffbcba047f3ae676497c961f3`). Exact PR-head CI `39884516254`, Android `39884516256` SUCCESS. Exact-main CI `39884699918`, Android `39884700097` (artifact `12471647811`, verified 6,288,535-byte app-debug.apk SHA256 `57154f624f4f5cbdb840c9cd98798956afcedc234b23fbfbb2ac911a87d92811`), Pages `39884783733` SUCCESS.

Actual C9 remains **Vite DEV QA only**, attached to authenticated real installed `BOSS_ARCHITECT` with four distinct physical anchors (each current/maximum HP), unlocked core only when anchors all destroyed, real core HP, selected single physical C5 GRID_LOCK / C6 VECTOR_TIDE / C7 SECTOR_WALL phase and remaining timer, C8 optional director phase, current bounded QA hull, Canvas instruction panel for F7/F8/F9 and WASD/arrows/touch movement. A read-only fail-closed snapshot refuses owner/guard/boss/geometry/attack mismatch, two simultaneous attack refs, corrupt HP/timer/cycles and stale sessions; integrated tests exercise real C2 anchor projectile impacts, real C3 core hits, actual C5/C6/C7 collision events and C8 cumulative hull transitions. It does not mutate the actual gameplay state or normal player/projectile/shield/score, modes, RNG, caps, rewards or persistence. It is NOT a production Architect appearance in Campaign, Infinite, Score Attack; does not prove a user-operated browser session or physical Android gameplay. Existing manual #4/#5/#202/#248 and umbrella #581 stay OPEN. Android APK build verification is **not** a physical device or a Vite DEV QA feature test.

**C10 conditional gameplay authorization ONLY AFTER DOC99 exact-main CI+Pages SUCCESS:** prioritize actual QA touch/browser playability, **not** another combat-spec simulation. Present small explicit touch/pointer controls that reuse existing authenticated DEV-only callbacks for `Ctrl+Alt+Shift+F9` QA enter/exit, `F7` director enable/disable, and `F8` exclusive attack selection; choose an accessible, responsive non-obscuring layout and make pointer hit areas avoid unintended FOTON movement/firing. Preserve existing exact preconditions: no auto-entry in any production mode, only active safe CAMPAIGN DEV break, proper boss owner/current guard verification, F8 disabled while director active, unchanged manual F8 hull-reset semantics, single active pattern and hard fail-close for stale/foreign refs. Do not expose the DEV diagnostic actions to production bundles or assume Android release APK can run Vite DEV QA. Positive/negative tests: touch and keyboard call the same guarded transition, safe F9 admission denial in wrong states, F7/F8 restrictions, no double taps/bubbling into combat, stable responsive appearance and unaltered normal play, J2/J9A/B2B2A/legacy boss isolation. C10 needs a fresh Issue, feature branch at exact certified DOC99 main, focused+full repo/TS/release/evidence/build/readiness and inspected APK precert, no temporary workflow in clean PR, exact-head CI+Android, SHA-protected squash, canonical parent/tree/files, exact-main CI+Android+Pages, then DOC100 docs-only. No manual Android/browser PASS without actual human evidence.


### ES-13DOC100 — Guarded DEV touch gameplay C10 certified; authorize C11 real headless browser QA conditionally
**Status: C10 DEPLOYED / AUTOMATED TEST-CERTIFIED DEV QA ONLY; C11 NOT STARTED.** DOCS-ONLY Issue #634.

C10 gameplay Issue #632 CLOSED / PR #633 protected squash MERGED canonical main `8638c29f71cbccb7778d9f8f9ae961fc5f2036a3`; sole parent DOC99 `befe99d6bbb95c33b48ec94a0ea3f99d9055c5c5`. Canonical tree `a82f4402ce9d7d49579d8b7f28e35f0e7287a84c` equals exact clean PR head `1ec22d05677283f107a479c889de3c97d457b13d`; exactly four files: `src/game/EnergySwarmGame.tsx`, new `src/game/blackoutArchitectDevQaTouchAccess.ts`, new `tests/es-13j9lb2b2b2b2c10-dev-touch-controls.test.mjs`, new `tests/gameplay/blackout-architect-dev-touch-controls.test.ts`. Temporary precert workflow removed before PR. Full focused C5-C10/J2 + complete repository/gameplay/platform, TS, release/evidence, web build/readiness + Android APK temporary pre-cert `39885939044` SUCCESS on `2a42b873ab88e97852e5f7eae94ea6c7c6c583b7`; inspected APK artifact `12472089652`, 6,288,667 bytes, SHA256 `1f6a8198280551d5942a5aed47c0a5128b46d02666bba2331738fc925c2a3705`. Exact PR-head CI `39886182977` / Android `39886182926` SUCCESS. Exact post-main CI `39886355160`, Android `39886355120` (inspected artifact `12472731731`: valid ZIP/APK, 6,288,739 bytes, AndroidManifest.xml and six DEX, SHA256 `91f872a1f39f68c0327f307e183b1c3d8b6f8491829b050d3b5e26f0d47d9819`), Pages `39886461002` build+deploy SUCCESS.

**Actual bounded C10:** original Vite DEV QA only. A real accessible touch/click dock outside the Canvas firing surface provides 40px action targets for *existing guarded* F9 enter/exit, F7 C8 director enable/disable and F8 exclusive C5/C6/C7 pattern selection. Read-only fail-closed policy constrains visibility and eligibility to DEV/Campaign/safe break or authenticated QA; F8 disabled while director active, F9 can exit stale QA to clean up, pointerdown/up stopPropagation and a single click calls original engine-authenticated functions. Touch does not create a new Boss or circumvent normal mode/guard admission. Former manual F8 hull-reset semantics unchanged. No production Campaign/Infinite/Score Attack entry, no normal shield/projectile/score/reward/persistence/RNG changes. All previous four-anchor/core/FOTON/attack/director/HUD code remains. An Android APK *building* and ZIP inspection do not prove human-operated Android or a DEV QA menu in the production APK; no browser-manual PASS or real-device PASS is asserted. Parent #581 and manual #4/#5/#202/#248 remain OPEN.

**C11 conditional authorization ONLY AFTER DOC100 exact-main CI+Pages SUCCESS:** prioritize proof of an actual rendered/interacted Architect QA flow using an automated **browser** harness rather than further static-assertion accumulation. Inspect Vite app entry, test dependencies and deterministic safe CAMPAIGN break prerequisites first. In a new isolated Issue/branch, set up a limited headless browser test runner (Playwright or equivalent) in a separate DEV-only scenario; capture real viewport/screenshot evidence and exercise guarded F9 entry/exit, F7 director lock/F8 exclusivity, accessible touch dock click/pointer events at desktop and narrow touch viewport, and game status transitions where controllable. Avoid any nondeterministic fake results or bypass of original runtime admission. Assert no button interaction generates a QA shot; verify cleanup after loss/exit and production build absence of debug entry if possible. If safe QA activation cannot be achieved under real game state, preserve the failed observation and open a remediation Issue; do not claim browser interaction PASS. Maintain normal mode isolation and avoid touching normal reward/wave/global physics. C11 must have independent scoped issue/branch, focused and full repo/TS/release/evidence/web build/readiness+Android APK pre-cert, **actual browser run artifacts** inspected when available, clean exact-head PR CI+Android, SHA-guarded squash and exact-main CI/Android/Pages, then DOC101 docs-only. Automated headless browser != human/browser manual or physical Android certification.

### ES-13DOC101 — C11 actual headless Chromium certified; authorize C12 responsive QA conditionally
**C11 DEPLOYED: browser automation PASS, not manual-device or production gameplay. C12 NOT IMPLEMENTED. DOCS-ONLY Issue #638.** C11 gameplay #636 CLOSED / PR #637 SHA-guarded squash MERGED canonical main `1f89ec359f3b275290584a52943ea69471989d61` with sole parent DOC100 `53e9589a6ab8f37264c78d442a3ff9ca9d7fb61f` and tree `a07e2bb0d087cdf4d02c3c7408be31cdab71ae28` **identical** to clean PR head `94bc35b97bc80af439d2ee8b52aed3ba7e9e1000`. Exactly three final paths: `scripts/architect-c11-browser-evidence.mjs`, `src/game/EnergySwarmGame.tsx`, `tests/es-13j9lb2b2b2b2c11-browser-evidence.test.mjs`; temporary `es13-architect-c11-precert.yml` removed. Full isolated C11 pre-cert `39892165120` SUCCESS at `ad1accbae8c5bdf9eb09286020cfc8403c8f19b7` (focused C5-C11/J2, entire repo/gameplay/platform, TS, release/evidence, web build/readiness, Android debug and actual Chromium browser). Artifact `12474804062` **inspected**: ZIP valid, 13 original screenshots and evidence.json reporting three real headless Chromium PASS cases (1440x900 desktop, 390x844 touch and production diagnostic denial), zero failures and zero console errors. Android pre-cert artifact `12475815272` inspected: 6,288,667-byte APK SHA256 `e49c5ecbd553b351ca7acb34b7b22177b414ead362b6c98d4df22541eaeb710d`. Exact clean PR-head CI `39893194757` and Android `39893194756` SUCCESS. Post-main CI `39893337594`, Android `39893337604`, Pages build+deploy `39893439221` SUCCESS on the canonical SHA; inspected main artifact `12476105350` valid ZIP/APK with AndroidManifest.xml, six DEX and 6,288,739 bytes, SHA256 `e965dbb75225aea9b35801d83f88015282a90e009384f2240f960a3ebe7f0caa`.

**What was proved:** Chromium interacted with actual Campaign StartScreen, genuine 2,500 ms safe break (frozen through browser clock, not injected engine refs), authenticated original F9 enter/exit and keyboard parity, C10 touch controls, F7 director toggle, F8 exclusive real Grid→Vector→Sector→Grid refs and phase-one early VECTOR_TIDE director rejection, director F8 lock, zero canvas pointerdown leakage and production absence of DEV diagnostic. No boss owner/guard spoofing, no fake campaign progression, no rewards or mode changes. Source change supplies read-only DEV-only `data-qa-pattern`/`data-qa-director` from real refs with F8 rerender. This is automated **headless** Chrome, NOT human-operated manual browser PASS and NOT physical Android certification. The production APK cannot be claimed to expose Vite DEV QA. Parent #581 and manual #4/#5/#202/#248 remain OPEN. Genuine mobile 390x844 screenshot shows DEV status/banner and touch overlays encroaching on Canvas; responsive readability remains unverified manually.

**C12 conditional gameplay authorization ONLY AFTER DOC101 exact-main CI and Pages SUCCESS:** target narrowly the proven mobile Architect DEV QA legibility/occlusion issue, using screenshots from `12474804062` as baseline. Implement accessible compact visual treatment for the DEV-only diagnostic status and touch dock at narrow widths, coordinate existing mobile movement/formation overlays with real QA status, preserve actual boss anchors/HP, selected physical attack, timers, director, FOTON input and safety gates. Do NOT change production/normal HUD unless separately justified, nor game physics, attack collisions/hull, modes, RNG, rewards, persistence or legacy bosses. Demand authentic Chromium screen evidence at 320x700, 390x844, 428x926 and desktop, verified non-overlap, legible labels/controls, F7/F8/F9 action and no Canvas click leak; no fabricated manual PASS. New Issue/isolated branch from certified DOC101 main, focused/full tests, TS/release/evidence/build/readiness and APK pre-cert with inspected browser screenshots, clean PR no temporary workflow, exact PR-head CI+Android, SHA-guarded squash, canonical tree/parent/file audit, exact-main CI+Android+Pages, DOC102 docs-only follow-up.

### ES-13DOC102 — responsive Architect DEV QA C12 certified; conditional C13 true projectile playthrough
**C12 DEPLOYED / AUTOMATED CHROMIUM CERTIFIED DEV QA ONLY; C13 NOT IMPLEMENTED. DOCS-ONLY Issue #642.** C12 Issue #640 CLOSED, PR #641 SHA-guarded squash MERGED on canonical main `f41756eedb3b7d1a0ce5e29c2c33b7826a7ecc91`; **sole parent** DOC101 `9f9930b583f3f5e02519c0cfb63539e29d785054`; canonical tree `8b0bdb366ebdf6125b9f4a5883e878217845bfac` exactly matches clean PR head `fad696f819b4fc6abbea0278738c08617cc1a48b`. Exactly three permanent files: `src/game/EnergySwarmGame.tsx`, `scripts/architect-c11-browser-evidence.mjs`, `tests/es-13j9lb2b2b2b2c12-mobile-qa-status.test.mjs`; temporary `es13-architect-c12-precert.yml` deleted before PR. Full C5–C12/J2 tests/repository/gameplay/platform/TS/release/evidence/web build/readiness/Android + real headless Chromium pre-cert run `39894474044` SUCCESS on `d9d2a8d51142d7b44c61398616a94f782c1e3e14`. Authentic browser artifact `12475743454` independently inspected: 25 original PNG captures, five cases PASS (320x700, 390x844, 428x926 touch, desktop 1440x900, production DEV QA denial), zero failures and zero console errors, measured status/dock bounding rectangles non-overlapping with Canvas. Pre-cert APK artifact `12476301981` structurally verified. PR-head CI `39894980590` / Android `39894980630` SUCCESS. Post-main CI `39895679937`, Android `39895679917` (verified debug APK artifact `12475884453`, ZIP/APK integrity OK, AndroidManifest.xml, six DEX, 6,288,763 bytes SHA256 `4cd857c01454cdbada5673042be888c30f03a6f3c81af39996a43ac25cca1cf7`), Pages `39895771905` all SUCCESS on canonical SHA.

**Actual C12:** Vite DEV-only original Architect QA ACTIVE, FAILED and COMPLETE status moved out of the absolute Canvas overlay into compact responsive normal flow with intact status/hints and aria-live, alongside C10 authenticated F9/F7/F8 actions. On real 320/390/428px Chromium viewports, dock ends before the status and status ends before actual Canvas; content remains inside viewport. No additional engine authority, no boss/anchor/core/collision/hull changes; normal FOTON movement, shots, formation/touch interactions and production game modes remain untouched. This is automated browser evidence, NOT a manually verified browser session or physical Android test. The existing #4 responsive presentation and #5 Infinite, #202 GAIA/performance, #248 physical Android and parent Architect #581 remain OPEN.

**C13 CONDITIONALLY AUTHORIZED ONLY AFTER DOC102 exact-main CI+Pages SUCCESS:** inspect the true original QA shot creation, Canvas pointer targeting/world/camera coordinates, player movement and real HUD progression; attempt an isolated Chromium automated playable **C2/C3 projectile-to-anchor/core** encounter path through native controls. Desired independently observed real effects: targeted shots reduce individual cardinal HP, each of four anchors can be destroyed, the core remains invulnerable until all four down, then loses genuine HP and reaches QA encounter completion without rewards. Do not inject projectiles, mutate owner/guard/boss refs, add forced hits or bypass protections. If real deterministic user-action execution is impossible, record actual failure and open a narrow remediation Issue rather than a fabricated PASS. Preserve C5/C6/C7 attacks, C8 director, C9 HUD, C10 dock, C11 browser infrastructure, C12 responsive status, historical J2/J9A/B2B2A, Devourer/Titan/Worm, NULL_ARCHITECT and Campaign/Infinite/Score Attack, RNG/caps/persistence/rewards. New separate gameplay Issue/branch with focused/full tests, TypeScript/release/evidence/web+readiness, inspected Android APK, real Chrome screenshots/JSON; remove temporary workflow before clean PR; exact-head CI+Android protected squash, verified unique parent/tree/files and exact post-main CI+Android+Pages; follow with DOC103 docs-only. Parent #581 and manual #4/#5/#202/#248 must stay OPEN.

### ES-13DOC103 — C13 authentic browser QA combat PASS; authorize mobile C14 conditionally
**C13 DEPLOYED/AUTOMATED DEV QA CERTIFIED; C14 NOT STARTED. Documentation Issue #646.** C13 gameplay Issue #644 CLOSED automatically by [PR #645](https://github.com/ingeniusvictor/orbi-energy.swarm/pull/645) SHA-guarded protected squash canonical main `0eb91322b68c196eda68f7bcd513e9ba5a978626` with **sole parent DOC102** `1e6ada0a52611969bcde0c175485b2409bf237dc`. Canonical tree `541dfd59f75241d1da4d8bf63b6a708227025a5f` exactly equals clean PR head `66f511f191f68f606f2bdfb8a0ecb854d96eda52`. Final changed files exactly `src/game/EnergySwarmGame.tsx`, `scripts/architect-c13-projectile-browser.mjs`, `tests/es-13j9lb2b2b2b2c13-real-projectile-browser.test.mjs`; temporary `es13-architect-c13-precert.yml` deleted BEFORE PR. Full isolated pre-cert `39899132069` SUCCESS on `b05481a5123bfcf587918369463a00ecca65fa50`: focused C2/C3/C5–C13/J2, complete repo/gameplay/platform, TypeScript, release/evidence, web build/readiness, Android APK and **authentic Chromium native inputs**. Browser artifact `12478348345` inspected: valid ZIP/34 genuine PNG screenshots and evidence JSON: desktop real FOTON ArrowLeft movement and locked 1,920-HP core, **28 actual native pointer shots** exhausted four 135-HP anchors, **96 real original shots** exhausted core to 0, authentic QA COMPLETE and NO REWARDS; 390×844 touch viewport confirmed one real SOUTH hit. Both C13 cases PASS, 0 failures and console errors; 5 original C11/C12 browser cases PASS incl production DEV F9 refusal. Precert APK artifact `12478340644` inspected: 6,288,755 bytes, SHA256 `cf055a2b259d35adf1722109c6de20ee59c2da6b2be55638b7686932d532432a`, AndroidManifest.xml and six DEX. Clean PR exact-head CI `39900665189` Android `39900664882` SUCCESS; exact main CI `39900856205`, Android `39900856453`, Pages build/deploy `39900952922` all SUCCESS on canonical SHA. Inspected main APK artifact `12477764876`: valid ZIP and APK, 6,288,823 bytes, SHA256 `50c1e5d8f911f5738d6142e93456222cd8d4817fc81caeb10784c13d7edac1a8`, manifest and six DEX.

**Real C13 scope:** authored *only DEV QA* guarded read-only Canvas `data-architect-qa-readout` exposing current authenticated boss/anchor geometry, FOTON/camera, real HP and active singleton projectile; DEV QA pointerup suppresses accidental normal click-to-move after an authentic shot; actual successful impact refreshes DEV controls for visual observation. Browser input uses original Campaign safe intermission, legitimate F9, keyboard movement and native Canvas mouse clicks with actual world→screen camera transform, never mutated private React refs, forced collision, staged projectile, guard spoof or injected HP. An overlay `MEJOR EN HORIZONTAL` initially intercepted portrait mobile shot; corrected browser click along the same world direction into a physically reachable spot rather than removing the normal orientation tooltip. First mobile hit validated, **full mobile playthrough not yet claimed**. Actual use of headless Chromium is NOT a human manual browser PASS; compiled Android is NOT a physical device certification. Production Architect activation, Campaign/Infinite/Score Attack encounter progression, rewards and global FOTON health/shield remain unchanged. Parent #581 plus manual #4/#5/#202/#248 stay OPEN.

**C14 CONDITIONAL GOAL (not started):** improve and certify authentic portrait-mobile Architect DEV QA shot usability. Inspect native `ENTENDIDO` tutorial dismissal and its interaction with FOTON direction/formation controls; drive dismissal via actual browser touch/click, never forged state. Ensure tutorial cannot obscure the intended active Canvas hit target after legitimate dismissal, then aim with real camera data and fire from touch screen through all four independently authenticated anchors and the core; test 320×700, 390×844, 428×926 and desktop fallback, production DEV denied. If true 124-shot portrait full clear proves impractical or reveals collision/control defects, isolate a genuine gameplay/UI remediation, preserve failure artifacts and do NOT report PASS. Keep all C5–C13 patterns, QA hull, mode isolation, score/rewards, RNG, caps, historic bosses/NULL_ARCHITECT and original touch movement. C14 must begin only after DOC103 protected squash **and** exact-main CI+Pages SUCCESS; use separate Issue/branch, scoped tests, full repository/TS/release/evidence/web-readiness+Android APK and real Chromium screen/JSON pre-cert; delete temporary workflow, exact PR CI+Android, SHA-protected squash, canonical tree/parent/files, exact-main CI+Android+Pages, then DOC104 docs-only. Keep manual #4/#5/#202/#248 and #581 OPEN.

### ES-13DOC104 — C14 mobile real playthrough PASS, conditional C15 hazard interaction
**C14 AUTOMATED DEV QA CERTIFIED; C15 NOT IMPLEMENTED. DOCS-ONLY #650.** C14 gameplay Issue #648 CLOSED / PR #649 SHA-guarded squash MERGED canonical main `484c6961e1ce001c4cd39413cc667706a176eb7d`, sole parent DOC103 `3d1626fcefb38cf45bc246391798c087dd9e6318`, canonical tree `d9b4415706cae6051254a1f1b5769dc0df936d30` EXACT equals clean PR head `d2b4f53c08f9d8d6647dc5795c13df2583db06f4`. Exactly three permanent paths: `src/game/EnergySwarmGame.tsx` (DEV-only read-only pointer kind and QA teardown cleanup, no game physics changes), `scripts/architect-c13-projectile-browser.mjs` (real tap/dismissal full-clear via `ORBI_C14_REAL_TOUCH=1`), `tests/es-13j9lb2b2b2b2c14-real-mobile-touch.test.mjs` (source regression). Temporary `.github/workflows/es13-architect-c14-precert.yml` REMOVED before PR. First pre-cert `39902177809` FAIL solely aiming at WEST with test cursor 0.61 CSS pixels outside top Canvas after actual SOUTH/EAST/NORTH destruction (21 legitimate impacts). Corrected only browser aim distance to original 150 logical units after actual `Entendido` orientation dismissal; no health, projectile, FOTON, guard, damage, physics or production UI alteration. Full updated pre-cert [39903717428](https://github.com/ingeniusvictor/orbi-energy.swarm/actions/runs/39903717428) SUCCESS exact `9bc5c9d84f41abd1215f3d7273f3acf8ccb8bc4e`, focused C2/C3/C5–C14/J2, complete repo, TypeScript, release/evidence, web build/readiness, Android debug APK and genuine Chromium touchscreen.

Independent inspection of browser artifact `12480585483`: ZIP CRC GOOD, 36 authentic PNG captures, two JSON reports: actual mobile `390×844` real Playwright `touchscreen.tap` and native orientation `Entendido` tap, 28 original 20-HP cardinal hits remove all four 135-HP anchors, 96 additional original shots deplete 1,920-HP core to QA 0 HP COMPLETE with **NO REWARDS**. Actual touch provenance `lastQaPointerType="touch"` read from authenticated engine render, not a damage or guard bypass. Mobile 320×700 and 428×926 first native impact PASS; existing C11/C12 five desktop/mobile/production DEV-denial cases PASS; browser failures=[] and consoleErrors=[]. Pre-cert APK artifact `12480350401` inspected: valid outer/inner ZIP, 6,288,767 bytes SHA256 `9a531306366018ff11b3154c8e940b3e5a41fc30f8299d385c036dd19f2ba64b`, AndroidManifest.xml and 6 DEX. Clean PR exact-head CI `39904748200`, Android `39904748216` SUCCESS. Main CI `39904923047`, Android `39904923001`, Pages build+deploy `39905015888` all SUCCESS at canonical SHA. Main APK artifact `12479944609` inspected: valid ZIP/APK, 6,288,839 bytes SHA256 `29e405fb27a0becd6e3063b8513e987c338472feb4c15f18965cdd645acf6c1d`, manifest+6 DEX. **Automated headless Chromium is not human manual browser PASS and a compiled APK is not physical Android PASS.** Architect remains restricted to Vite DEV QA, not automatically live in Campaign, Infinite, Score Attack; parent #581 and manual #4/#5/#202/#248 stay OPEN.

**C15 CONDITIONALLY AUTHORIZED ONLY AFTER DOC104 protected PR and exact-main CI+Pages SUCCESS:** shift to observable *original Architect physical hazard patterns* in the integrated DEV QA encounter, not more mock-only tests. Starting from real Campaign safe break and authenticated F9, test GRID_LOCK and the C8 phase-appropriate director, plus actual telegraph/active/recovery and QA-only hull damage or native FOTON avoidance through actual keyboard/touch inputs. Higher-phase VECTOR_TIDE/SECTOR_WALL must be reached via 28 authentic anchor shots rather than fake phase/HUD/boss refs. Follow real original timing and no simultaneous pattern execution; preserve all normal health/shield, FOTON movement, formation/touch controls, C2/C3 projectiles, C5–C14 effects, J2 Overdrive, legacy bosses and RNG/caps/modes/rewards. Source/data observability may be read-only under original authenticated DEV guard, never permit state mutation, direct impact or guard spoofing. If true hazard detection or repeatability is blocked, retain failed browser screenshots and propose narrow genuine implementation issue, do not claim success. New C15 Issue and isolated branch, scoped/full tests+TS/release/evidence/web readiness, inspected Android APK, genuine browser evidence and 320/390/428 mobile where practical, remove temporary workflow before PR, exact PR-head CI+Android SHA-protected squash, sole-parent/tree/path verification, main CI+Android+Pages, DOC105 docs-only. Parent #581 and manual #4/#5/#202/#248 remain OPEN.

### ES-ANDROID-DOC01 — Android landscape UI implemented, real device verification still open
**DOCS-ONLY Issue #657.** **UX01 #653 CLOSED / PR #654 MERGED:** canonical main `c1af30342c82a77e3e2e87369b3dabae82525a51` parent DOC104 `66539427fb03bccf56deb56c385e3e7eb56b83d0`, eight files: Android native immersive MainActivity; `index.html`; `src/components/GameHud.tsx`; `src/game/EnergySwarmGame.tsx`; `src/main.tsx`; `src/styles/androidImmersive.css`; real browser evidence script and static regression test. Implemented landscape fullscreen bars, full-height stage, compact HUD, accessible Estado/Táctica/Equipo drawer, compact translucent touch controls and Escape drawer-close priority. Full pre-cert `39911519082` SUCCESS real Chromium three landscapes, desktop and portrait five PASS; PR CI `39912035845` Android `39912035865`; main CI `39912294300`, Android `39912294301`, Pages `39912373664` all SUCCESS. A 5:3 legacy Canvas was deliberately preserved until isolated UX02.

**UX02 #655 CLOSED / PR #656 MERGED:** protected exact-head squash canonical `fa114a67ebcefd0cc20f0978dba60ab8f2fe91f9` sole parent UX01 `c1af30342c82a77e3e2e87369b3dabae82525a51`, canonical tree `43e624c81257e7ef0769934d81a99ceebca70cd0` matches clean head `23aadbd739e37a5bc9f01a10afa9d1d43f001ed1`. Exactly eight permanent paths: `src/game/panoramicCanvasViewport.ts`, `src/game/EnergySwarmGame.tsx`, `src/game/EnergySwarmCanvas.tsx`, `src/styles/androidImmersive.css`, `scripts/android-ux02-panorama-browser.mjs`, `tests/gameplay/android-panoramic-playfield.test.ts`, `tests/hidpi-orientation.test.ts`, `tests/runtime-viewport-adoption.test.ts`; temporary `android-ux02-precert.yml` removed. Logical height stays 480, real camera/Canvas logical width expands according to physical landscape stage (1197/1164/1117 in tested examples), background and world projection span the lateral display without CSS stretching, crop, changes to FOTON physics, world collisions, or normal game modes. Desktop/portrait remain 800×480. DEV-only QA touch dock remains operable under immersive HUD; not visible in production.

**Certified evidence:** full pre-cert `39914633309` SUCCESS including 787 historic/full test contracts, TypeScript, release/evidence, web build/readiness, Android debug and real Chromium. Independently inspected actual browser artifact `12483888263` ZIP CRC OK, 8 PNG screenshots + evidence.json (9 files) five PASS: landscape 915×412 displays 1197×480 real world, 844×390 1164×480, 740×360 1117×480; all three original native touch shots reduced authenticated Architect SOUTH anchor health 135→115, zero failures/console errors; desktop 1440×900 and portrait 390×844 unchanged 800×480. Inspected APK artifact `12484800497` ZIP/manifest+6 DEX valid; 6,292,531 bytes SHA256 `2b26b6f5dca43723d2b312043ec5dfc00daa64f9a3d21778a23ea88bd0ed957e`. Clean PR CI `39915319936` Android `39915319951` SUCCESS. Post-main CI `39915492064`, Android `39915492086`, Pages `39915583532` SUCCESS on canonical SHA. Final APK artifact `12483819408` independently inspected valid ZIP/APK manifest+6 DEX, 6,292,631 bytes SHA256 `a391ba5a280593a2677a0a33638c821073d0a98c48294bb85321de448057646a`.

**Boundaries and next work:** automated Chromium + debug APK are NOT a manually operated physical Android test or human visual certification; manual presentation/responsive #4 and physical Android #248 must stay OPEN until human evidence. Other manual #5/#202, DEV-only Blackout Architect umbrella #581 and C15 hazard interaction Issue #652 remain OPEN and unchanged. Do not interpret UX01/UX02 as production boss progression, scoreboard/rewards or QA hazard certification. C15 proceeds independently from its already authorized roadmap, with actual physical hazard hit/avoidance, guarded PR and docs-only DOC105. UX01/UX02 require no further graphics stretching and should be validated next on a physical landscape device across 16:9 and 20:9 with safe areas, heat/performance and reachable controls.


### ES-WEB-DOC01 — Immersive panoramic web UX01 certified and deployed (2026-10-23)
**Feature:** Issue [#661](https://github.com/ingeniusvictor/orbi-energy.swarm/issues/661) CLOSED; protected squash [PR #662](https://github.com/ingeniusvictor/orbi-energy.swarm/pull/662) MERGED. Source main `189091b7e7deae6fedaa4718cbf8a4b928979318`, sole parent `60b2aba32e176fd4e2f0376b71e30044e87a8656`. Final canonical tree `a40c7ca1135e8182a16c8d455788eced2f69943a` exactly matches tested PR head `2008eb219e3059e3240abc465a11bcf48b37aca7`, precisely 11 files: `.github/workflows/web-ux01-visual.yml`, `scripts/web-ux01-browser-evidence.mjs`, `src/components/GameHud.tsx`, `src/game/EnergySwarmGame.tsx`, `src/game/immersiveBattlefieldPolicy.ts`, `src/game/viewportComposition.ts`, `src/main.tsx`, `src/styles/webImmersive.css`, `tests/android-ux01-immersive-landscape.test.mjs`, `tests/gameplay/web-immersive-viewport.test.ts`, `tests/runtime-viewport-adoption.test.ts`. Existing Android UX01/UX02 touch landscape remains unchanged; desktop/laptop *fine-pointer* landscape now receives the original immersive full-screen stage, genuine panoramic playable Canvas/camera with uniform scale, HUD 42/45 px, Estado/Táctica/Equipo drawer, and optional browser Fullscreen API control. Mouse, WASD/arrows, formations 1–6 and native pointer ownership are preserved; portrait and excluded touch desktop variants retain their legacy behavior. No gameplay physics, RNG, bosses, score, rewards or mode changes.

**Verified gates on exact tested PR head:** GitHub Actions CI `39956946565`, Android `39956946568`, production Chromium `39956946518` all SUCCESS. Independently inspected original Chromium artifact `12501849968`: intact ZIP containing **9 PNG screenshots + 1 evidence.json**, 5 PASS (desktop 1440×900, desktop 1920×1080, laptop 1366×768, mobile coarse touch 844×390, portrait coarse touch 390×844), `errors=[]`, `failures=[]`; checked dynamic Canvas bounds and scale, Estado statistics/noncollapsed grid, Táctica/Equipo, Escape close/no pause, native fullscreen button present on desktop, touch controls absent on desktop and present on mobile, no QA dock in production. The earlier browser failure was a Vite preview CLI invocation corrected before final PASS; historical Android-only assertion was migrated to explicit policy guarding while preserving actual touch behavior.

**Post-main gates exact canonical SHA `189091b7e7deae6fedaa4718cbf8a4b928979318`:** CI `39957314607`, Android `39957314696`, Chromium `39957314706`, Pages `39957451388` all SUCCESS. **Vercel:** connected project `orbi-energy-swarm` ID `prj_D6c9wfbsa7h7AlGIuTnVa0j2JbUk` from the matching GitHub repository, production deployment `dpl_8WuMQVitsJAwPNaaWQjbFZEmBsHe` exact source SHA, **READY**, stable alias https://orbi-energy-swarm-orbi4.vercel.app. Node 22.x matches repo engines, SSO applies to preview deployments. This verifies Vercel deployment status, but no independent end-user HTTP-browser test of the public alias was completed.

**Boundaries:** automated Chromium simulation is not certification on a physical Android phone or independent human visual review on all desktop devices. Leave manual issues #4, #5, #202, #248 OPEN, C15 #652 and Architect parent #581 OPEN, and keep C15 branch isolated. Follow-up standalone documentation Issue #663 / PR (this documentation-only phase); do not treat this UX delivery as release candidate certification.
