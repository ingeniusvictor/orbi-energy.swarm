import { TranslationSchema } from "./types";

export const en: TranslationSchema = {
  general: {
    language: "LANGUAGE",
    play: "PLAY",
    back: "BACK",
    close: "CLOSE",
    orbiTitle: "ORBI ENERGY SWARM",
    loading: "LOADING..."
  },
  hud: {
    shield: "SHIELD",
    score: "SCORE",
    swarm: "SWARM",
    wave: "WAVE",
    preparation: "PREPARATION",
    active: "ACTIVE",
    level: "LEVEL",
    rate: "RATE",
    followers: "Follower",
    follower_plural: "Followers",
    unmuted: "UNMUTED",
    muted: "MUTED"
  },
  cockpit: {
    tacticalRail: "TACTICAL RAIL",
    logisticsDeck: "LOGISTICS DECK",
    activeRoster: "ACTIVE ENERGETIC ROSTER",
    activeBuild: "ACTIVE RUN BUILD CONFIGURATION",
    tacticalRadar: "TACTICAL RADAR",
    visualEngine: "VISUAL ENGINE",
    swarmFormations: "SWARM FORMATIONS",
    audioSystem: "AUDIO SYSTEM",
    vibration: "VIBRATION",
    screenShake: "SCREEN SHAKE",
    damageFlash: "DAMAGE FLASH",
    particlesDensity: "PARTICLES DENSITY",
    fpsLimiter: "FPS LIMITER",
    hudTheme: "HUD THEME",
    radarLabels: "RADAR LABELS",
    inputMode: "INPUT MODE",
    dynamicQuality: "DYNAMIC QUALITY"
  },
  formations: {
    LINE: {
      name: "Assault Line",
      description: "+25% Shield Resistance, +Circular Shield Guard | -10% Projectile Damage",
      advantages: "Circular Shield Guard (+25%)",
      disadvantages: "Projectile Damage (-10%)",
      recommendation: "Ideal for protecting Foton's vital vectors from scattered fire."
    },
    CIRCLE: {
      name: "Collector Circle",
      description: "+30% Damage, +15% Proj Speed | Reduced Side Protection",
      advantages: "Massive Damage (+30%), Projectile Speed (+15%)",
      disadvantages: "Reduced Side Protection",
      recommendation: "Excellent for flanking armored enemies and dealing concentrated damage."
    },
    DELTA: {
      name: "Convergent Delta",
      description: "+Orbital Area Fire, +Repel Near Enemies | High Spray Dispersion",
      advantages: "Orbital Area Fire, Repel Near Enemies",
      disadvantages: "High Spray Dispersion",
      recommendation: "Perfect for repelling large swarms advancing from alternate vectors."
    },
    SHIELD: {
      name: "Protective Shield",
      description: "+35% Range, +Precision Targeting | -15% Shield Resistance",
      advantages: "Increased Range (+35%), Precision Aiming",
      disadvantages: "Shield Resistance (-15%)",
      recommendation: "Perfect for intercepting distant threats quickly."
    },
    V_SHAPE: {
      name: "V Vanguard",
      description: "Great Frontal Cover, Proj Absorption | -10% Movement Speed",
      advantages: "Great Frontal Cover, Projectile Absorption",
      disadvantages: "Movement Speed (-10%)",
      recommendation: "Best when pushing directly against heavy front fortifications or aligned waves."
    },
    SCATTERED: {
      name: "Free Dispersion",
      description: "+25% Evasion, +20% Crit Chance | Loose Follow Cohesion",
      advantages: "Evasion (+25%), Critical Strike Chance (+20%)",
      disadvantages: "Loose Follow Cohesion",
      recommendation: "Useful for dodging massive area attacks and projectile barrages."
    }
  },
  waves: {
    1: {
      name: "Scout Signal",
      subtitle: "Basic hostile reconnaissance",
      description: "Crawlers detected probing outer sectors. Defensive operations initiated.",
      tacticalAdvice: "Use Assault Line to guard Foton's vital vectors."
    },
    2: {
      name: "Parasite Drift",
      subtitle: "Hostile drift patterns",
      description: "Parasitic high-velocity vectors seeking leader. Fast collision threats.",
      tacticalAdvice: "Maintain spacing. Use Protective Shield to intercept them early."
    },
    3: {
      name: "Drone Lock",
      subtitle: "Long-range vector threat",
      description: "Targeting drones locked onto ORBI FOTON. High-density aiming lines.",
      tacticalAdvice: "Cover with V Vanguard. Reposition dynamically before lock fires."
    },
    4: {
      name: "Swarm Encirclement",
      subtitle: "Omni-directional siege",
      description: "Hostile forces advancing rapidly from alternate sectors.",
      tacticalAdvice: "Establish Assault Line or Convergent Delta to repel encirclement from corners."
    },
    5: {
      name: "Elite Breach",
      subtitle: "Heavily armored blackout unit",
      description: "Blackout Elite breaching. Front shield protects core from front attacks.",
      tacticalAdvice: "Use Collector Circle or Free Dispersion to flank its side armor."
    },
    6: {
      name: "Disruptor Storm",
      subtitle: "Electromagnetic interference active",
      description: "Disruptor units pulsing waves that scatter swarm cohesion.",
      tacticalAdvice: "Spread into Free Dispersion or use Protective Shield to absorb shocks and stay wide."
    },
    7: {
      name: "Grid Collapse",
      subtitle: "Sector integrity failing",
      description: "Unstable environment. Active hazard zones emerging on map.",
      tacticalAdvice: "Mobility is key. Change formations frequently and avoid the red blackout pools."
    },
    8: {
      name: "Titan Warning",
      subtitle: "Colossus signature detected",
      description: "Heavy assault Titans approaching. Massive kinetic explosions on collision.",
      tacticalAdvice: "Use Collector Circle to maximize damage output and take them down early."
    },
    9: {
      name: "Blackout Siege",
      subtitle: "Extinction-level blackout forces",
      description: "Multiple high-density hostile vectors combining. Critical systems pushed to their limits.",
      tacticalAdvice: "Utilize V Vanguard forward or switch dynamically to Assault Line for shield buffs."
    },
    10: {
      name: "Blackout Devourer",
      subtitle: "Singularity-class threat",
      description: "The colosal Blackout Devourer has emerged to consume your entire swarm.",
      tacticalAdvice: "Avoid its rotational sweep beams and destroy its orbital nodes to expose its core."
    }
  },
  upgrades: {
    chooseTitle: "CHOOSE ONE EVOLUTION FOR THIS RUN",
    reroll: "REROLL",
    rerollUsed: "REROLL USED",
    maxLevel: "MAX LEVEL",
    stack: "Level",
    categories: {
      OFFENSE: "OFFENSE",
      DEFENSE: "DEFENSE",
      SWARM: "SWARM",
      TACTICAL: "TACTICAL",
      FUSION: "FUSION"
    },
    items: {
      solar_overcharge: {
        name: "Solar Overcharge",
        description: "Increases Solar elemental damage by +25% and enhances projectile glow density."
      },
      hydro_regenesis: {
        name: "Hydro Regenesis",
        description: "Adds mild passive shield regeneration (+0.6/sec) and improves Hydro slowdown intensity by +20%."
      },
      wind_acceleration: {
        name: "Wind Acceleration",
        description: "Increases Wind followers' rate of fire by +20% and projectile velocity by +25%."
      },
      thermal_expansion: {
        name: "Thermal Expansion",
        description: "Increases heavy explosion splash radius by +30% and enhances fiery blast visuals."
      },
      nuclear_density: {
        name: "Nuclear Density",
        description: "Increases raw physical kinetic damage by +25% with safe hit-stop dampening."
      },
      quantum_fracture: {
        name: "Quantum Fracture",
        description: "Improves overall swarm critical strike chance by +8% up to a strict safe probability cap."
      },
      foton_integrity: {
        name: "Foton Integrity",
        description: "Increases maximum shield capacity by +30 units and instantly restores +50 shield on purchase."
      },
      swarm_cohesion: {
        name: "Swarm Cohesion",
        description: "Enhances swarm leash pull force by +30% and reduces electromagnetic disruption recovery duration by 50%."
      },
      formation_synchronizer: {
        name: "Formation Synchronizer",
        description: "Reduces the formation shifting cooldown duration by -40%."
      },
      core_magnetism: {
        name: "Core Magnetism",
        description: "Expands Foton's gravitational magnetism attraction radius for resources by +100 pixels."
      },
      fusion_resonance: {
        name: "Fusion Resonance",
        description: "Amplifies fusion energy generation speed by +25% when feeding energy cores."
      },
      command_velocity: {
        name: "Command Velocity",
        description: "Increases ORBI FOTON's manual propulsion thruster speed by +15% without tearing camera sync."
      },
      mitotic_mitosis: {
        name: "Mitotic Mitosis",
        description: "Follower projectiles have a +25% chance per stack to duplicate, doubling firepower without increasing permanent capacity."
      },
      swarm_overscale: {
        name: "Swarm Overscale",
        description: "Increases swarm cohesion and follow recovery speed by +25% per stack, preventing lag or stray followers."
      }
    },
    transitions: {
      solar_overcharge: {
        before: "+{currentLevel}% Solar DMG",
        after: "+{nextLevel}% Solar DMG"
      },
      hydro_regenesis: {
        before: "No Regen",
        after: "+{val}/s & +{slow}% slow"
      },
      wind_acceleration: {
        before: "+{currentLevel}% Fire Rate",
        after: "+{nextLevel}% Fire Rate"
      },
      thermal_expansion: {
        before: "+{currentLevel}% Area",
        after: "+{nextLevel}% Area"
      },
      nuclear_density: {
        before: "+{currentLevel}% Heavy Kinetic",
        after: "+{nextLevel}% Heavy Kinetic"
      },
      quantum_fracture: {
        before: "{currentLevel}% Crit Chance",
        after: "{nextLevel}% Crit Chance"
      },
      foton_integrity: {
        before: "+{currentLevel} Max Shield",
        after: "+{nextLevel} Max Shield"
      },
      swarm_cohesion: {
        before: "+{cohesion}% Cohesion, -{disrupt}% Disrupt",
        after: "+{cohesion}% Cohesion, -{disrupt}% Disrupt"
      },
      formation_synchronizer: {
        before: "-{currentLevel}% Cooldown",
        after: "-{nextLevel}% Cooldown"
      },
      core_magnetism: {
        before: "+{currentLevel}px Radius",
        after: "+{nextLevel}px Radius"
      },
      fusion_resonance: {
        before: "+{currentLevel}% Energy",
        after: "+{nextLevel}% Energy"
      },
      command_velocity: {
        before: "+{currentLevel}% Speed",
        after: "+{nextLevel}% Speed"
      },
      mitotic_mitosis: {
        before: "+{currentLevel}% Proj Dup",
        after: "+{nextLevel}% Proj Dup"
      },
      swarm_overscale: {
        before: "+{currentLevel}% Cohesion Speed",
        after: "+{nextLevel}% Cohesion Speed"
      }
    }
  },
  threatIntel: {
    title: "THREAT INTEL",
    subtitle: "IDENTIFIED THREAT VECTORS",
    counterLabel: "RECOMMENDED COUNTER / TACTIC:",
    threatLevel: "THREAT LEVEL",
    unknown: "UNKNOWN SYSTEM — SURVIVE LONGER TO ACQUIRE DATA",
    entries: {
      drone_beam: {
        name: "Drone Beam",
        description: "Concentrated linear laser that continuously traces the leader.",
        mechanic: "Continuous focused beam with visual line guidance.",
        counter: "Keep constant perpendicular movement. Take cover behind your followers."
      },
      disruptor_pulse: {
        name: "Disruptor Pulse",
        description: "Massive circular shockwave pushing followers far from the leader.",
        mechanic: "Radial physics expansion with disorienting feedback.",
        counter: "Take it down with fast Collector Circle focus before its pulse charge completes."
      },
      elite_charge: {
        name: "Elite Charge",
        description: "Ultra-fast frontal charge protected by an impenetrable front shield.",
        mechanic: "Linear physics charge with frontal invulnerability.",
        counter: "Use Collector Circle to flank or Free Dispersion to dodge the direct impact."
      },
      front_armor: {
        name: "Front Armor",
        description: "Passive heavy defense mitigating damage from the front.",
        mechanic: "Passive 80% impact reduction in front-facing arc.",
        counter: "Flank. Steer the swarm around the enemy using tight orbital turns."
      },
      devourer_beam: {
        name: "Devourer Beam",
        description: "Giant laser sweeping huge areas slowly around the boss.",
        mechanic: "High-frequency destructive angular rotation.",
        counter: "Circle in the same direction of the beam. Do not cross the active laser line."
      },
      gravity_well: {
        name: "Gravity Well",
        description: "A colossal field actively pulling the entire swarm toward its damaging core.",
        mechanic: "Extreme centripetal attraction force plus damage-over-time.",
        counter: "Switch to V Vanguard and boost in the opposite direction."
      },
      orbital_shards: {
        name: "Orbital Shards",
        description: "Sequential rapid firing of high-density projectiles.",
        mechanic: "Targeted projectile bursts.",
        counter: "Use Assault Line to absorb with outer defensive shield rings."
      },
      blackout_sweep: {
        name: "Blackout Sweep",
        description: "Sweep hazards appearing in giant fan shapes, blocking entire sectors.",
        mechanic: "Huge angular sweep zones.",
        counter: "Locate the marked safe sector and remain inside until sweep completes."
      },
      shield_nodes: {
        name: "Shield Nodes",
        description: "Three orbiting spheres safeguarding the Devorador, absorbing 75% of damage.",
        mechanic: "Linked symmetrical orbital barriers.",
        counter: "Concentrate fire on individual spheres. Destroying all three leaves the boss vulnerable."
      },
      singularity_pulse: {
        name: "Singularity Pulse",
        description: "Quadrative-wide massive pulse wave pushing destructive feedback.",
        mechanic: "Full screen radial expansion.",
        counter: "Charge boost directly into the blast wave with full shield to mitigate residual damage."
      },
      rotating_eclipse_lanes: {
        name: "Rotating Lanes",
        description: "Three rotating lanes sweeping the battlefield with high energy lasers.",
        mechanic: "Angular cutting lines with continuous damage over time.",
        counter: "Sychronize your steps to rotate in the free sector between active lanes."
      },
      devourer_charge: {
        name: "Devourer Charge",
        description: "Giant destructive charge directed directly at the leader.",
        mechanic: "Massive rush with giant collision box.",
        counter: "Use boost sprint button exactly when target locking cues flash red."
      }
    }
  },
  boss: {
    phases: {
      phase1: "Phase 1: Event Horizon",
      phase2: "Phase 2: Collapse Engine (Shield Nodes Active)",
      phase3: "Phase 3: Singularity Crown (Final Phase)"
    },
    states: {
      coreExposed: "CORE EXPOSED — DOUBLE DAMAGE ACTIVE!",
      shieldNodes: "SHIELD NODES ACTIVE: {count} REMAINING",
      singularityThreat: "SINGULARITY-CLASS THREAT DETECTED",
      devourerIncoming: "WARNING: DEVOURER INGRESS"
    },
    defeatSequence: {
      title: "BLACKOUT DEVOURER PURGED",
      subtitle: "CLEANSING SIGNAL FLUSH IN PROGRESS..."
    }
  },
  results: {
    victoryTitle: "BLACKOUT DEVOURER DEFEATED",
    victorySubtitle: "Nexus Sector Restored",
    defeatTitle: "THE DEVOURER ENDURES",
    defeatSubtitle: "Swarm Synchronization Terminated",
    playAgain: "PLAY AGAIN",
    restartRun: "RESTART RUN",
    returnToMenu: "RETURN TO MENU",
    viewRunBuild: "VIEW RUN BUILD",
    shareSummary: "SHARE SUMMARY",
    stats: {
      score: "Final Score",
      maxPopulation: "Maximum Population",
      strongestElement: "Dominant Element",
      mostUsedFormation: "Most Used Formation",
      bestEvolution: "Best Evolution",
      bossStatus: "Boss Status",
      rerollUsed: "Rerolls Used",
      damageDealt: "Damage Dealt to Boss",
      damageReceived: "Damage Received",
      shieldNodesDestroyed: "Shield Nodes Destroyed",
      timeElapsed: "Run Duration",
      waveReached: "Wave Reached"
    },
    cosmicBadgeTitle: "Cosmic Badge Unlocked!",
    cosmicBadgeDesc: "Certified as an ORBI FOTON CHAMPION. Golden core glow option is now active in your database!",
    firstTimeVictory: "🏆 (First Time)"
  },
  settings: {
    title: "SYSTEM SETTINGS",
    accessibility: "ACCESSIBILITY SETTINGS",
    languageLabel: "Language",
    graphicsLabel: "Graphics",
    audioLabel: "Audio",
    screenShake: "Screen Shake",
    flashIntensity: "Impact Flash",
    coreLabels: "Core Labels",
    bossAttackLabels: "Boss Attack Labels",
    leaderMarker: "Leader Marker",
    minimap: "Sector Radar",
    inputMode: "Control Mode",
    dynamicQuality: "Dynamic Quality",
    options: {
      full: "FULL",
      reduced: "REDUCED",
      off: "OFF",
      standard: "STANDARD",
      enhanced: "ENHANCED",
      important: "IMPORTANT",
      proximity: "PROXIMITY",
      hidden: "HIDDEN",
      keyboard: "KEYBOARD",
      mouseDrag: "MOUSE DRAG",
      clickToMove: "CLICK TO MOVE",
      hybrid: "HYBRID",
      on: "ON",
      low: "LOW",
      medium: "MEDIUM",
      high: "HIGH",
      ultra: "ULTRA"
    }
  },
  codex: {
    title: "VECTOR CODEX",
    subtitle: "DATA ACQUIRED FROM THE FIELD",
    statsHeader: "PERMANENT DATA TELEMETRY",
    achievementsHeader: "COSMIC HONORS",
    encounters: "ENCOUNTERS",
    victories: "WINS",
    bestTime: "BEST TIME",
    achievements: {
      first_victory: {
        name: "Cosmic Purifier",
        desc: "Defeat the Blackout Devourer for the first time."
      },
      max_followers: {
        name: "Absolute Legion",
        desc: "Reach a swarm size of 60 active followers simultaneously."
      },
      no_damage: {
        name: "Untouchable Pilot",
        desc: "Survive up to wave 5 with intact shield integrity."
      },
      speed_run: {
        name: "Warp Velocity",
        desc: "Defeat the Blackout Devourer in under 5 minutes."
      },
      fusion_master: {
        name: "Fusion Mastery",
        desc: "Summon both Solar Guardian and Hydro Leviathan in a single run."
      }
    }
  },
  startScreen: {
    tacticalSlogan: "TACTICAL AUTONOMOUS SWARM FLIGHT ENGINE",
    playTab: "PLAY",
    howToTab: "HOW TO PLAY",
    controlsTab: "CONTROLS",
    codexTab: "BOSS CODEX",
    settingsTab: "SETTINGS",
    aboutTab: "ABOUT",
    highScore: "HIGH SCORE",
    bestWave: "BEST WAVE",
    maxPopulation: "MAX POPULATION",
    totalMissions: "TOTAL MISSIONS",
    sloganDesc: "Synchronize with your tactical swarm of core energy collectors. Harvest raw nano-crystals, defend against dark parasites, and purge the grid of the catastrophic Blackout Devourer.",
    activateSync: "ACTIVAR SINCRONIZACIÓN (PLAY DEMO)",
    simulationOps: "SIMULATION OPERATIONS",
    howToStep1: "Pilot Orbi Foton: Foton (Amber Leader) automatically tracks your mouse pointer, or WASD / Arrow Keys on keyboard.",
    howToStep2: "Collect Energy Crystals: Run over Cyan crystals and Pink hexagons. Rescuing Pink Wild Orbis recruits new fighters to your shooter swarm.",
    howToStep3: "Shift Formations (1 to 6): Re-aligning your flock changes passive stats! E.g., Assault Line boosts shield values, while Collector Circle increases projectile speeds.",
    howToStep4: "Shield Integrity: Swarms automatically focus-fire incoming crawler threats. Prevent enemy collisions from leaking onto Foton's central core!",
    howToStep5: "Slay the Devourer: Progress through wave tiers, collect Nano-Credits, unlock terminal relics, and survive the giant boss at Wave 10.",
    controlKeybindings: "CONTROL KEYBINDINGS",
    keys: {
      movement: "Movement",
      followCursor: "Follow Cursor",
      formations: "Formations (Line, V-Shape, Spiral, Halo, Shield, Walkers)",
      pause: "Pause Simulation",
      mute: "Mute Audio",
      reboot: "Quick Reboot",
      mobile: "Mobile Swipes and virtual navigation buttons are fully supported!"
    },
    simulationParams: "SIMULATION PARAMETERS",
    graphicsLabel: "GRAPHICS PRESETS (DPR & PARTICLE SPEED LIMITS)",
    graphicsDesc: "Low: reduced stars & nebula for budget setups. High: max particles & beautiful parallax glow effects.",
    audioLabel: "AUDIO GENERATION (SYNTH BGM)",
    audioActive: "ACTIVE",
    audioMuted: "MUTED",
    bossWarnings: "BOSS ATTACK WARNINGS",
    bossWarningsDesc: "Accessibility label density on screen.",
    resetStats: "RESET STATISTICS",
    aboutTitle: "ABOUT THIS DEMO",
    aboutDesc1: "ORBI ENERGY SWARM is a playable prototype under development belonging to the ORBI ecosystem.",
    aboutDesc2: "This demo represents an early version of the core flight dynamics, formations, swarm progression, and energetic combat. Content, balance, graphics, and progression will continue to evolve to offer the finest cosmic experience possible.",
    aboutEngine: "System Engine: HTML5 Canvas 2D Decoupled Loop",
    aboutRenderer: "Renderer: Responsive Context Vector Projection",
    aboutAudio: "Audio Core: Procedural Web Audio Synths v2",
    aboutDev: "Developer: Víctor Marcel León Pacheco",
    codexTitle: "BLACKOUT DEVOURER DATABASE",
    codexDesc: "\"An omnipresent digital entity designed to ingest, fragment, and completely depopulate active grid sectors. It defends its core with orbiting shield relays and manipulates local gravity vectors to trap escaping drones.\"",
    encounters: "Encounters",
    victories: "Victories",
    bestTime: "Best Time",
    discoveredPhases: "DISCOVERED PHASES",
    discoveredAttacks: "DISCOVERED ATTACKS",
    counterLabel: "Counter advice:",
    phaseNames: {
      1: "PHASE 1: DEVOURER INGRESS",
      2: "PHASE 2: COLLAPSE ENGINE",
      3: "PHASE 3: SINGULARITY CROWN"
    },
    phaseDescs: {
      1: "The Devourer enters the grid center, sweeping space with its Devourer Beam and throwing Shards.",
      2: "Enters an invulnerable state protected by orbiting Shield Nodes. Weak point CORE is exposed once nodes are purged.",
      3: "Highly chaotic final state. Launches rotating eclipse lanes, gravity charges, and rapid core charges."
    }
  }
};
