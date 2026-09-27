import { TranslationSchema } from "./types";

export const es: TranslationSchema = {
  general: {
    language: "IDIOMA",
    play: "JUGAR",
    back: "VOLVER",
    close: "CERRAR",
    orbiTitle: "ORBI ENERGY SWARM",
    loading: "CARGANDO..."
  },
  hud: {
    shield: "ESCUDO",
    score: "PUNTUACIÓN",
    swarm: "ENJAMBRE",
    wave: "OLEADA",
    preparation: "PREPARACIÓN",
    active: "ACTIVO",
    level: "NIVEL",
    rate: "CADENCIA",
    followers: "Seguidor",
    follower_plural: "Seguidores",
    unmuted: "CON SONIDO",
    muted: "SILENCIADO"
  },
  cockpit: {
    tacticalRail: "PANEL TÁCTICO",
    logisticsDeck: "PLATAFORMA LOGÍSTICA",
    activeRoster: "REGISTRO ENERGÉTICO ACTIVO",
    activeBuild: "CONFIGURACIÓN ACTIVA DE LA PARTIDA",
    tacticalRadar: "RADAR TÁCTICO",
    visualEngine: "MOTOR VISUAL",
    swarmFormations: "FORMACIONES DEL ENJAMBRE",
    audioSystem: "SISTEMA DE AUDIO",
    vibration: "VIBRACIÓN",
    screenShake: "SACUDIDA DE PANTALLA",
    damageFlash: "DESTELLO POR DAÑO",
    particlesDensity: "DENSIDAD DE PARTÍCULAS",
    fpsLimiter: "LÍMITE DE FPS",
    hudTheme: "TEMA DEL HUD",
    radarLabels: "ETIQUETAS DEL RADAR",
    inputMode: "MODO DE ENTRADA",
    dynamicQuality: "CALIDAD DINÁMICA"
  },
  formations: {
    LINE: {
      name: "Línea de Asalto",
      description: "+25% de resistencia de escudo, +Protector de escudo circular | -10% de daño de proyectil",
      advantages: "Resistencia de escudo circular (+25%)",
      disadvantages: "Daño de proyectil (-10%)",
      recommendation: "Ideal para defender los vectores vitales de Foton contra ataques dispersos."
    },
    CIRCLE: {
      name: "Círculo Colector",
      description: "+30% de daño, +15% de velocidad de proyectil | Protección lateral reducida",
      advantages: "Daño masivo (+30%), Velocidad de proyectil (+15%)",
      disadvantages: "Protección lateral reducida",
      recommendation: "Excelente para flanquear enemigos blindados y hacer daño concentrado."
    },
    DELTA: {
      name: "Delta Convergente",
      description: "+Fuego de área orbital, +Repele enemigos cercanos | Alta dispersión de disparo",
      advantages: "Fuego orbital, Repeler enemigos cercanos",
      disadvantages: "Alta dispersión de disparo",
      recommendation: "Ideal para mantener a raya a enjambres numerosos que se acercan desde los lados."
    },
    SHIELD: {
      name: "Escudo Protector",
      description: "+35% de rango, +Apuntado de precisión | -15% de resistencia de escudo",
      advantages: "Rango aumentado (+35%), Apuntado preciso",
      disadvantages: "Resistencia de escudo reducida (-15%)",
      recommendation: "Perfecto para interceptar amenazas lejanas de forma rápida."
    },
    V_SHAPE: {
      name: "Vanguardia V",
      description: "Excelente cobertura frontal, absorción de proyectiles | -10% de velocidad de movimiento",
      advantages: "Gran cobertura frontal, Absorción de proyectiles",
      disadvantages: "Velocidad de movimiento reducida (-10%)",
      recommendation: "Perfecto cuando se avanza de frente contra torretas u hordas en línea."
    },
    SCATTERED: {
      name: "Dispersión Libre",
      description: "+25% de evasión, +20% de probabilidad de crítico | Cohesión de seguimiento suelta",
      advantages: "Evasión (+25%), Probabilidad de golpe crítico (+20%)",
      disadvantages: "Seguimiento suelto del líder",
      recommendation: "Útil para esquivar ataques masivos de área y tormentas de proyectiles."
    }
  },
  waves: {
    1: {
      name: "Señal Exploradora",
      subtitle: "Reconocimiento hostil básico",
      description: "Rastreadores detectados analizando los sectores exteriores. Operaciones de defensa iniciadas.",
      tacticalAdvice: "Usa Línea de Asalto para proteger los vectores vitales de Foton."
    },
    2: {
      name: "Deriva Parasitaria",
      subtitle: "Patrones de deriva hostil",
      description: "Vectores parásitos de alta velocidad que buscan al líder. Amenazas de colisión rápida.",
      tacticalAdvice: "Mantén la distancia. Usa Escudo Protector para interceptarlos temprano."
    },
    3: {
      name: "Bloqueo de Drones",
      subtitle: "Amenaza de vectores a larga distancia",
      description: "Drones de ataque apuntando a ORBI FOTON. Líneas de mira de alta densidad.",
      tacticalAdvice: "Cúbrete con Vanguardia V. Reposiciónate dinámicamente antes de que disparen."
    },
    4: {
      name: "Cerco del Enjambre",
      subtitle: "Asedio omnidireccional",
      description: "Fuerzas hostiles avanzando rápidamente desde sectores alternos.",
      tacticalAdvice: "Establece Línea de Asalto o Delta Convergente para repeler el cerco desde las esquinas."
    },
    5: {
      name: "Brecha de Élite",
      subtitle: "Unidad blackout fuertemente blindada",
      description: "Elite Blackout detectado. Su escudo frontal protege su núcleo de ataques directos.",
      tacticalAdvice: "Usa Círculo Colector o Dispersión Libre para flanquear su blindaje lateral."
    },
    6: {
      name: "Tormenta Disruptora",
      subtitle: "Interferencia electromagnética activa",
      description: "Unidades disruptoras emitiendo pulsos que dispersan la cohesión del enjambre.",
      tacticalAdvice: "Dispersa con Dispersión Libre o usa Escudo Protector para absorber choques y mantener amplitud."
    },
    7: {
      name: "Colapso de la Red",
      subtitle: "Fallo de integridad del sector",
      description: "Entorno inestable. Zonas de peligro activas emergiendo en el mapa.",
      tacticalAdvice: "La movilidad es clave. Cambia de formación frecuentemente y evita los pozos blackout."
    },
    8: {
      name: "Alerta Titán",
      subtitle: "Señal de coloso detectada",
      description: "Titanes de asalto pesados aproximándose. Explosiones masivas al colisionar.",
      tacticalAdvice: "Usa Círculo Colector para maximizar el daño y derribarlos antes de que se acerquen."
    },
    9: {
      name: "Asedio Blackout",
      subtitle: "Fuerzas blackout de nivel de extinción",
      description: "Múltiples vectores de alta densidad combinándose. Resistencia al límite.",
      tacticalAdvice: "Utiliza Vanguardia V de frente o cambia dinámicamente a Línea de Asalto para sobrevivir."
    },
    10: {
      name: "Devorador Blackout",
      subtitle: "Amenaza de clase singularidad",
      description: "El colosal Devorador Blackout ha emergido para consumir tu enjambre por completo.",
      tacticalAdvice: "Evita su rayo giratorio y destruye sus nodos orbitales para exponer su núcleo."
    }
  },
  upgrades: {
    chooseTitle: "ELIGE UNA EVOLUCIÓN PARA ESTA PARTIDA",
    reroll: "REGENERAR OPCIONES",
    rerollUsed: "REGENERACIÓN UTILIZADA",
    maxLevel: "NIVEL MÁXIMO",
    stack: "Nivel",
    categories: {
      OFFENSE: "OFENSIVA",
      DEFENSE: "DEFENSA",
      SWARM: "ENJAMBRE",
      TACTICAL: "TÁCTICA",
      FUSION: "FUSIÓN"
    },
    items: {
      solar_overcharge: {
        name: "Sobrecarga Solar",
        description: "Aumenta el daño elemental Solar en +25% y mejora la densidad de brillo de los proyectiles."
      },
      hydro_regenesis: {
        name: "Regénesis Hydro",
        description: "Añade una regeneración pasiva leve de escudo (+0.6/seg) y mejora la ralentización de Hydro en +20%."
      },
      wind_acceleration: {
        name: "Aceleración de Viento",
        description: "Aumenta la cadencia de fuego de seguidores de Viento en +20% y la velocidad de proyectil en +25%."
      },
      thermal_expansion: {
        name: "Expansión Térmica",
        description: "Aumenta el radio de explosión pesada en +30% y mejora los efectos visuales de explosiones de fuego."
      },
      nuclear_density: {
        name: "Densidad Nuclear",
        description: "Aumenta el daño físico cinético base en +25% con amortiguación segura contra impactos."
      },
      quantum_fracture: {
        name: "Fractura Cuántica",
        description: "Mejora la probabilidad de golpe crítico general del enjambre en +8% hasta un límite seguro."
      },
      foton_integrity: {
        name: "Integridad Foton",
        description: "Aumenta la capacidad máxima de escudo en +30 unidades y restaura +50 de escudo al comprar."
      },
      swarm_cohesion: {
        name: "Cohesión del Enjambre",
        description: "Mejora la fuerza de atracción del enjambre en +30% y reduce la duración de la dispersión electromagnética a la mitad."
      },
      formation_synchronizer: {
        name: "Sincronizador de Formación",
        description: "Reduce el tiempo de recarga para cambiar de formación en -40%."
      },
      core_magnetism: {
        name: "Magnetismo de Núcleo",
        description: "Expande el radio de atracción gravitacional de Foton para recursos en +100 píxeles."
      },
      fusion_resonance: {
        name: "Resonancia de Fusión",
        description: "Amplifica la velocidad de generación de energía de fusión en +25% al absorber núcleos de energía."
      },
      command_velocity: {
        name: "Velocidad de Comando",
        description: "Aumenta la velocidad de propulsión manual de ORBI FOTON en +15% sin perder sincronía de cámara."
      },
      mitotic_mitosis: {
        name: "Mitosis Mitótica",
        description: "Los proyectiles de los seguidores tienen un +25% de probabilidad por nivel de duplicarse, duplicando la potencia de fuego sin aumentar el tamaño permanente."
      },
      swarm_overscale: {
        name: "Sobrescala del Enjambre",
        description: "Mejora la cohesión del enjambre y la velocidad de recuperación de seguidores perdidos en +25% por nivel."
      }
    },
    transitions: {
      solar_overcharge: {
        before: "+{currentLevel}% Daño Solar",
        after: "+{nextLevel}% Daño Solar"
      },
      hydro_regenesis: {
        before: "Sin Regeneración",
        after: "+{val}/s y +{slow}% Ralentización"
      },
      wind_acceleration: {
        before: "+{currentLevel}% Cadencia",
        after: "+{nextLevel}% Cadencia"
      },
      thermal_expansion: {
        before: "+{currentLevel}% Área",
        after: "+{nextLevel}% Área"
      },
      nuclear_density: {
        before: "+{currentLevel}% Cinético",
        after: "+{nextLevel}% Cinético"
      },
      quantum_fracture: {
        before: "{currentLevel}% Prob. Crítico",
        after: "{nextLevel}% Prob. Crítico"
      },
      foton_integrity: {
        before: "+{currentLevel} Escudo Máx",
        after: "+{nextLevel} Escudo Máx"
      },
      swarm_cohesion: {
        before: "+{cohesion}% Cohesión, -{disrupt}% Dispersión",
        after: "+{cohesion}% Cohesión, -{disrupt}% Dispersión"
      },
      formation_synchronizer: {
        before: "-{currentLevel}% Recarga",
        after: "-{nextLevel}% Recarga"
      },
      core_magnetism: {
        before: "+{currentLevel}px Radio",
        after: "+{nextLevel}px Radio"
      },
      fusion_resonance: {
        before: "+{currentLevel}% Energía",
        after: "+{nextLevel}% Energía"
      },
      command_velocity: {
        before: "+{currentLevel}% Velocidad",
        after: "+{nextLevel}% Velocidad"
      },
      mitotic_mitosis: {
        before: "+{currentLevel}% Dup. Proy",
        after: "+{nextLevel}% Dup. Proy"
      },
      swarm_overscale: {
        before: "+{currentLevel}% Vel. Cohesión",
        after: "+{nextLevel}% Vel. Cohesión"
      }
    }
  },
  threatIntel: {
    title: "INTELIGENCIA DE AMENAZAS",
    subtitle: "VECTORES DE AMENAZA IDENTIFICADOS",
    counterLabel: "TÁCTICA RECOMENDADA / CONTRA:",
    threatLevel: "NIVEL DE AMENAZA",
    unknown: "SISTEMA DESCONOCIDO — SOBREVIVE MÁS TIEMPO PARA ADQUIRIR DATOS",
    entries: {
      drone_beam: {
        name: "Láser de Drone",
        description: "Rayo concentrado lineal que apunta al líder de forma continua.",
        mechanic: "Haz continuo enfocado con guía visual.",
        counter: "Mantén el movimiento perpendicular constante. Cúbrete detrás de los seguidores."
      },
      disruptor_pulse: {
        name: "Pulso de Disruptor",
        description: "Onda de choque circular masiva que aleja a los seguidores del líder.",
        mechanic: "Expansión radial física con desorientación.",
        counter: "Destrúyelo con Círculo Colector rápido antes del inicio de la carga del pulso."
      },
      elite_charge: {
        name: "Embestida de Élite",
        description: "Acometida frontal ultra veloz protegida por un escudo frontal impenetrable.",
        mechanic: "Carga física lineal con invulnerabilidad frontal.",
        counter: "Usa Círculo Colector para flanquear o Dispersión Libre para esquivar el impacto directo."
      },
      front_armor: {
        name: "Blindaje Frontal",
        description: "Defensa pesada pasiva que mitiga el daño desde el frente.",
        mechanic: "Reducción de impacto pasiva de 80% en arco frontal.",
        counter: "Flanquea. Dirige al enjambre alrededor del enemigo usando giros cerrados."
      },
      devourer_beam: {
        name: "Rayo del Devorador",
        description: "Haz gigante que gira lentamente barriendo grandes áreas de combate.",
        mechanic: "Rotación angular destructiva de alta frecuencia.",
        counter: "Muévete en círculo en la misma dirección del rayo. Evita cruzar el haz activo."
      },
      gravity_well: {
        name: "Pozo Gravitacional",
        description: "Un campo colosal que atrae activamente todo el enjambre hacia su núcleo dañino.",
        mechanic: "Fuerza de atracción centrípeta extrema más daño por segundo.",
        counter: "Cambia a Vanguardia V y corre con el propulsor en dirección opuesta."
      },
      orbital_shards: {
        name: "Fragmentos Orbitales",
        description: "Lanzamiento secuencial rápido de proyectiles de alta densidad.",
        mechanic: "Proyectiles dirigidos en ráfaga.",
        counter: "Usa Línea de Asalto para absorber con el anillo exterior defensivo."
      },
      blackout_sweep: {
        name: "Barrido Blackout",
        description: "Generación de peligros en forma de abanicos que bloquean sectores completos.",
        mechanic: "Haz angular restrictivo de gran tamaño.",
        counter: "Localiza la zona segura indicada y quédate dentro hasta la desactivación."
      },
      shield_nodes: {
        name: "Nodos de Escudo",
        description: "Tres esferas orbitales que protegen al Devorador, absorbiendo un 75% del daño.",
        mechanic: "Barrera orbital simétrica vinculada.",
        counter: "Concentra el fuego en las esferas individuales. Al destruirlas todas, el jefe queda vulnerable."
      },
      singularity_pulse: {
        name: "Pulso de Singularidad",
        description: "Onda destructiva masiva que se expande por todo el cuadrante de juego.",
        mechanic: "Expansión radial completa.",
        counter: "Activa el propulsor y colisiónalo con el escudo completo para mitigar el daño residual."
      },
      rotating_eclipse_lanes: {
        name: "Líneas de Eclipse",
        description: "Haz de tres carriles giratorios que cortan el campo en sectores peligrosos.",
        mechanic: "Líneas de corte angulares con daño por segundo continuo.",
        counter: "Sincroniza tus pasos para girar en el sector libre entre carriles."
      },
      devourer_charge: {
        name: "Embestida Devoradora",
        description: "Acometida destructiva gigante directa hacia el líder.",
        mechanic: "Impacto masivo con área de colisión gigante.",
        counter: "Usa el propulsor con el botón de velocidad justo cuando el indicador se ponga en rojo."
      }
    }
  },
  boss: {
    phases: {
      phase1: "Fase 1: Horizonte de Sucesos",
      phase2: "Fase 2: Motor de Colapso (Nodos de Escudo Activos)",
      phase3: "Fase 3: Corona de Singularidad (Fase Final)"
    },
    states: {
      coreExposed: "NÚCLEO EXPUESTO — ¡DAÑO DUPLICADO!",
      shieldNodes: "NODOS DE ESCUDO ACTIVOS: {count} RESTANTES",
      singularityThreat: "AMENAZA CLASE SINGULARIDAD DETECTADA",
      devourerIncoming: "ADVERTENCIA: ACERCAMIENTO DEL DEVORADOR"
    },
    defeatSequence: {
      title: "DEVORADOR BLACKOUT DESTRUIDO",
      subtitle: "PURIFICACIÓN EN CURSO..."
    }
  },
  results: {
    victoryTitle: "DEVORADOR BLACKOUT DERROTADO",
    victorySubtitle: "Sector Nexus Restaurado",
    defeatTitle: "EL DEVORADOR RESISTE",
    defeatSubtitle: "Sincronía de Enjambre Perdida",
    playAgain: "JUGAR DE NUEVO",
    restartRun: "REINICIAR PARTIDA",
    returnToMenu: "VOLVER AL MENÚ",
    viewRunBuild: "VER CONFIGURACIÓN DE LA PARTIDA",
    shareSummary: "COMPARTIR RESUMEN",
    stats: {
      score: "Puntuación Final",
      maxPopulation: "Población Máxima",
      strongestElement: "Elemento Dominante",
      mostUsedFormation: "Formación Más Usada",
      bestEvolution: "Mejor Evolución",
      bossStatus: "Estado del Jefe",
      rerollUsed: "Regeneración Utilizada",
      damageDealt: "Daño Causado al Jefe",
      damageReceived: "Daño Recibido",
      shieldNodesDestroyed: "Nodos de Escudo Destruidos",
      timeElapsed: "Duración de la Partida",
      waveReached: "Oleada Alcanzada"
    },
    cosmicBadgeTitle: "¡Insignia Cósmica Desbloqueada!",
    cosmicBadgeDesc: "¡Certificado como CAMPEÓN ORBI FOTON! El brillo del núcleo dorado ya está activo en tu base de datos.",
    firstTimeVictory: "🏆 (Primera vez)"
  },
  settings: {
    title: "AJUSTES DE SISTEMA",
    accessibility: "AJUSTES DE ACCESIBILIDAD",
    languageLabel: "Idioma",
    graphicsLabel: "Gráficos",
    audioLabel: "Sonido",
    screenShake: "Sacudida de Pantalla",
    flashIntensity: "Destello de Impacto",
    coreLabels: "Etiquetas del Núcleo",
    bossAttackLabels: "Etiquetas de Ataques de Jefe",
    leaderMarker: "Marcador de Líder",
    minimap: "Radar del Sector",
    inputMode: "Modo de Control",
    dynamicQuality: "Calidad Dinámica",
    options: {
      full: "COMPLETO",
      reduced: "REDUCIDO",
      off: "APAGADO",
      standard: "ESTÁNDAR",
      enhanced: "MEJORADO",
      important: "IMPORTANTES",
      proximity: "PROXIMIDAD",
      hidden: "OCULTO",
      keyboard: "TECLADO",
      mouseDrag: "ARRASTRE MOUSE",
      clickToMove: "CLIC PARA MOVER",
      hybrid: "HÍBRIDO",
      on: "ENCENDIDO",
      low: "BAJA",
      medium: "MEDIA",
      high: "ALTA",
      ultra: "ULTRA"
    }
  },
  codex: {
    title: "CÓDICE DE VECTORES",
    subtitle: "DATOS RECOPILADOS DEL SECTOR",
    statsHeader: "TELEMETRÍA PERMANENTE",
    achievementsHeader: "RECONOCIMIENTOS CÓSMICOS",
    encounters: "ENFRENTAMIENTOS",
    victories: "VICTORIAS",
    bestTime: "MEJOR TIEMPO",
    achievements: {
      first_victory: {
        name: "Purificador Cósmico",
        desc: "Derrota al Devorador Blackout por primera vez."
      },
      max_followers: {
        name: "Legión Absoluta",
        desc: "Alcanza un enjambre de 60 seguidores activos simultáneamente."
      },
      no_damage: {
        name: "Piloto Intocable",
        desc: "Sobrevive hasta la oleada 5 sin perder integridad de escudo."
      },
      speed_run: {
        name: "Hipervelocidad",
        desc: "Derrota al Devorador Blackout en menos de 5 minutos."
      },
      fusion_master: {
        name: "Maestro de Fusión",
        desc: "Invoca tanto al Guadián Solar como al Leviatán Hydro en una partida."
      }
    }
  },
  startScreen: {
    tacticalSlogan: "SISTEMA TÁCTICO DE VUELO DE ENJAMBRE AUTÓNOMO",
    playTab: "JUGAR",
    howToTab: "CÓMO JUGAR",
    controlsTab: "CONTROLES",
    codexTab: "CÓDICE JEFE",
    settingsTab: "AJUSTES",
    aboutTab: "ACERCA DE",
    highScore: "PUNTUACIÓN MÁXIMA",
    bestWave: "MEJOR OLEADA",
    maxPopulation: "MÁXIMA POBLACIÓN",
    totalMissions: "MISIONES TOTALES",
    sloganDesc: "Sincroniza con tu enjambre táctico de recolectores de energía. Cosecha nano-cristales, defiéndete de parásitos oscuros y purga la red del catastrófico Devorador Blackout.",
    activateSync: "ACTIVAR SINCRONIZACIÓN (INICIAR JUEGO)",
    simulationOps: "OPERACIONES DE SIMULACIÓN",
    howToStep1: "Pilota a Orbi Foton: Foton (líder ámbar) sigue automáticamente el puntero del mouse o las teclas WASD/Flechas.",
    howToStep2: "Recolecta Cristales de Energía: Pasa por encima de los cristales Cyan y hexágonos Rosas. Rescata Orbis Rosas Salvajes para reclutar nuevos seguidores a tu enjambre.",
    howToStep3: "Cambia Formaciones (1 al 6): ¡Re-alinear tu enjambre cambia tus estadísticas pasivas! Por ejemplo, Línea de Asalto mejora tu escudo, mientras que Círculo Colector aumenta la velocidad de disparo.",
    howToStep4: "Integridad del Escudo: Tus seguidores disparan automáticamente a las amenazas cercanas. ¡Evita que las colisiones dañen el núcleo central de Foton!",
    howToStep5: "Derrota al Devorador: Progresa a través de las oleadas, recolecta Nano-Créditos, desbloquea mejoras y sobrevive al jefe gigante en la Oleada 10.",
    controlKeybindings: "TECLAS DE CONTROL",
    keys: {
      movement: "Movimiento",
      followCursor: "Seguir cursor",
      formations: "Formaciones (Línea, V, Espiral, Halo, Escudo, Dispersión)",
      pause: "Pausar simulación",
      mute: "Silenciar audio",
      reboot: "Reinicio rápido",
      mobile: "¡Se admiten gestos móviles y botones táctiles virtuales de navegación!"
    },
    simulationParams: "PARÁMETROS DE SIMULACIÓN",
    graphicsLabel: "PREAJUSTES GRÁFICOS (RESOLUCIÓN Y LÍMITE DE PARTÍCULAS)",
    graphicsDesc: "Baja: estrellas y nebulosas reducidas para equipos limitados. Alta: máximas partículas y hermosos efectos de brillo de paralaje.",
    audioLabel: "GENERACIÓN DE AUDIO (SINTETIZADOR BGM)",
    audioActive: "ACTIVO",
    audioMuted: "SILENCIADO",
    bossWarnings: "ALERTAS DE ATAQUES DE JEFE",
    bossWarningsDesc: "Densidad de etiquetas de accesibilidad en pantalla.",
    resetStats: "RECOPILETAR DATOS (RESET ESTADÍSTICAS)",
    aboutTitle: "ACERCA DE ESTA DEMO",
    aboutDesc1: "ORBI ENERGY SWARM es un prototipo jugable en desarrollo perteneciente al ecosistema ORBI.",
    aboutDesc2: "Esta demo representa una versión temprana del núcleo de movimiento, formaciones, crecimiento del enjambre y combate energético. El contenido, balance, gráficos y progresión continuarán evolucionando para ofrecer la mejor experiencia cósmica posible.",
    aboutEngine: "Motor: HTML5 Canvas 2D con bucle desacoplado",
    aboutRenderer: "Renderizador: Proyección de vectores de contexto responsivo",
    aboutAudio: "Audio: Sintetizadores Web Audio procedimentales v2",
    aboutDev: "Desarrollador: Víctor Marcel León Pacheco",
    codexTitle: "BASE DE DATOS DEL DEVORADOR BLACKOUT",
    codexDesc: "\"Una entidad digital omnipresente diseñada para ingerir, fragmentar y despoblar completamente los sectores de red activos. Defiende su núcleo con nodos de escudo orbitales y manipula la gravedad local.\"",
    encounters: "Enfrentamientos",
    victories: "Victorias",
    bestTime: "Mejor Tiempo",
    discoveredPhases: "FASES DESCUBIERTAS",
    discoveredAttacks: "ATAQUES DESCUBIERTOS",
    counterLabel: "Consejo táctico:",
    phaseNames: {
      1: "FASE 1: INGRESO DEL DEVORADOR",
      2: "FASE 2: MOTOR DE COLAPSO",
      3: "FASE 3: CORONA DE SINGULARIDAD"
    },
    phaseDescs: {
      1: "El Devorador entra en el centro de la cuadrícula, barriendo el espacio con su Rayo Devorador y lanzando fragmentos.",
      2: "Entra en un estado invulnerable protegido por Nodos de Escudo orbitales. El núcleo queda expuesto una vez destruidos.",
      3: "Estado final altamente caótico. Lanza líneas de eclipse giratorias, pozos de gravedad y embestidas rápidas al núcleo."
    }
  }
};
