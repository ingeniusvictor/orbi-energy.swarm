export type SupportedLanguage = "es" | "en";

export interface TranslationSchema {
  general: {
    language: string;
    play: string;
    back: string;
    close: string;
    orbiTitle: string;
    loading: string;
  };
  hud: {
    shield: string;
    score: string;
    swarm: string;
    wave: string;
    preparation: string;
    active: string;
    level: string;
    rate: string;
    followers: string;
    follower_plural: string;
    unmuted: string;
    muted: string;
  };
  cockpit: {
    tacticalRail: string;
    logisticsDeck: string;
    activeRoster: string;
    activeBuild: string;
    tacticalRadar: string;
    visualEngine: string;
    swarmFormations: string;
    audioSystem: string;
    vibration: string;
    screenShake: string;
    damageFlash: string;
    particlesDensity: string;
    fpsLimiter: string;
    hudTheme: string;
    radarLabels: string;
    inputMode: string;
    dynamicQuality: string;
  };
  formations: {
    [key: string]: {
      name: string;
      description: string;
      advantages: string;
      disadvantages: string;
      recommendation: string;
    };
  };
  waves: {
    [key: string]: {
      name: string;
      subtitle: string;
      description: string;
      tacticalAdvice: string;
    };
  };
  upgrades: {
    chooseTitle: string;
    reroll: string;
    rerollUsed: string;
    maxLevel: string;
    stack: string;
    categories: {
      OFFENSE: string;
      DEFENSE: string;
      SWARM: string;
      TACTICAL: string;
      FUSION: string;
    };
    items: {
      [key: string]: {
        name: string;
        description: string;
      };
    };
    transitions: {
      [key: string]: {
        before: string;
        after: string;
      };
    };
  };
  threatIntel: {
    title: string;
    subtitle: string;
    counterLabel: string;
    threatLevel: string;
    unknown: string;
    entries: {
      [key: string]: {
        name: string;
        description: string;
        mechanic: string;
        counter: string;
      };
    };
  };
  boss: {
    phases: {
      phase1: string;
      phase2: string;
      phase3: string;
    };
    states: {
      coreExposed: string;
      shieldNodes: string;
      singularityThreat: string;
      devourerIncoming: string;
    };
    defeatSequence: {
      title: string;
      subtitle: string;
    };
  };
  results: {
    victoryTitle: string;
    victorySubtitle: string;
    defeatTitle: string;
    defeatSubtitle: string;
    playAgain: string;
    restartRun: string;
    returnToMenu: string;
    viewRunBuild: string;
    shareSummary: string;
    stats: {
      score: string;
      maxPopulation: string;
      strongestElement: string;
      mostUsedFormation: string;
      bestEvolution: string;
      bossStatus: string;
      rerollUsed: string;
      damageDealt: string;
      damageReceived: string;
      shieldNodesDestroyed: string;
      timeElapsed: string;
      waveReached: string;
    };
    cosmicBadgeTitle: string;
    cosmicBadgeDesc: string;
    firstTimeVictory: string;
  };
  settings: {
    title: string;
    accessibility: string;
    languageLabel: string;
    graphicsLabel: string;
    audioLabel: string;
    screenShake: string;
    flashIntensity: string;
    coreLabels: string;
    bossAttackLabels: string;
    leaderMarker: string;
    minimap: string;
    inputMode: string;
    dynamicQuality: string;
    options: {
      full: string;
      reduced: string;
      off: string;
      standard: string;
      enhanced: string;
      important: string;
      proximity: string;
      hidden: string;
      keyboard: string;
      mouseDrag: string;
      clickToMove: string;
      hybrid: string;
      on: string;
      low: string;
      medium: string;
      high: string;
      ultra: string;
    };
  };
  codex: {
    title: string;
    subtitle: string;
    statsHeader: string;
    achievementsHeader: string;
    encounters: string;
    victories: string;
    bestTime: string;
    achievements: {
      first_victory: { name: string; desc: string };
      max_followers: { name: string; desc: string };
      no_damage: { name: string; desc: string };
      speed_run: { name: string; desc: string };
      fusion_master: { name: string; desc: string };
    };
  };
  startScreen: {
    tacticalSlogan: string;
    playTab: string;
    howToTab: string;
    controlsTab: string;
    codexTab: string;
    settingsTab: string;
    aboutTab: string;
    highScore: string;
    bestWave: string;
    maxPopulation: string;
    totalMissions: string;
    sloganDesc: string;
    activateSync: string;
    simulationOps: string;
    howToStep1: string;
    howToStep2: string;
    howToStep3: string;
    howToStep4: string;
    howToStep5: string;
    controlKeybindings: string;
    keys: {
      movement: string;
      followCursor: string;
      formations: string;
      pause: string;
      mute: string;
      reboot: string;
      mobile: string;
    };
    simulationParams: string;
    graphicsLabel: string;
    graphicsDesc: string;
    audioLabel: string;
    audioActive: string;
    audioMuted: string;
    bossWarnings: string;
    bossWarningsDesc: string;
    resetStats: string;
    aboutTitle: string;
    aboutDesc1: string;
    aboutDesc2: string;
    aboutEngine: string;
    aboutRenderer: string;
    aboutAudio: string;
    aboutDev: string;
    codexTitle: string;
    codexDesc: string;
    encounters: string;
    victories: string;
    bestTime: string;
    discoveredPhases: string;
    discoveredAttacks: string;
    counterLabel: string;
    phaseNames: {
      1: string;
      2: string;
      3: string;
    };
    phaseDescs: {
      1: string;
      2: string;
      3: string;
    };
  };
}
