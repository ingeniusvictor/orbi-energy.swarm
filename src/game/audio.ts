// Procedural Audio Engine for ORBI ENERGY SWARM
// Generates deep synth waves and retro sound effects on the fly using Web Audio API

let audioCtx: AudioContext | null = null;
let isMuted = false;
let currentBgmNode: OscillatorNode | null = null;
let bgmTimer: NodeJS.Timeout | null = null;
let bgmSequenceActive = false;

// Safe init function that resumes context upon user gesture
export const initAudio = (): AudioContext | null => {
  if (isMuted) return null;
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn("Web Audio API is not supported in this environment:", e);
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
};

export const setMuteState = (muted: boolean) => {
  isMuted = muted;
  localStorage.setItem("orbi_audio_muted", String(muted));
  
  if (muted) {
    if (audioCtx) {
      audioCtx.suspend();
    }
    stopBgm();
  } else {
    if (audioCtx) {
      audioCtx.resume();
    }
    startBgm("EXPLORATION");
  }
};

export const getMuteState = (): boolean => {
  return isMuted;
};

// --- SYNTH PROCEDURAL SOUND GENERATORS ---

function createGain(ctx: AudioContext, duration: number, startVal = 0.1): GainNode {
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(startVal, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  return gain;
}

// 1. Player/Swarm Shoot Sound
export const playShootSound = () => {
  const ctx = initAudio();
  if (!ctx || isMuted) return;

  const osc = ctx.createOscillator();
  const gain = createGain(ctx, 0.15, 0.08);

  osc.type = "sine";
  osc.frequency.setValueAtTime(800, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.15);
};

// 2. Enemy Shoot Sound
export const playEnemyShootSound = () => {
  const ctx = initAudio();
  if (!ctx || isMuted) return;

  const osc = ctx.createOscillator();
  const gain = createGain(ctx, 0.25, 0.04);

  osc.type = "triangle";
  osc.frequency.setValueAtTime(300, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.25);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.25);
};

// 3. Player Took Damage
export const playDamageSound = () => {
  const ctx = initAudio();
  if (!ctx || isMuted) return;

  const osc = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = createGain(ctx, 0.4, 0.25);

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(120, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(40, ctx.currentTime + 0.4);

  osc2.type = "sine";
  osc2.frequency.setValueAtTime(115, ctx.currentTime);
  osc2.frequency.linearRampToValueAtTime(35, ctx.currentTime + 0.4);

  osc.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc2.start();
  osc.stop(ctx.currentTime + 0.4);
  osc2.stop(ctx.currentTime + 0.4);
};

// 4. Enemy Exploded
export const playEnemyExplodeSound = (isElite = false) => {
  const ctx = initAudio();
  if (!ctx || isMuted) return;

  const duration = isElite ? 0.6 : 0.35;
  const gainValue = isElite ? 0.2 : 0.1;

  // Synthesize noise using buffer
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  // Filter to make it rumbling
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(isElite ? 200 : 400, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + duration);

  const gain = createGain(ctx, duration, gainValue);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start();
  noise.stop(ctx.currentTime + duration);
};

// 5. Recruit New Swarm Orbi
export const playRecruitSound = () => {
  const ctx = initAudio();
  if (!ctx || isMuted) return;

  const now = ctx.currentTime;
  const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5

  notes.forEach((note, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = "triangle";
    osc.frequency.setValueAtTime(note, now + index * 0.08);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.08, now + index * 0.08 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.08 + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + index * 0.08);
    osc.stop(now + index * 0.08 + 0.3);
  });
};

// 6. Gather Crystal / Energy Sound
export const playCrystalSound = (isEnergy = false) => {
  const ctx = initAudio();
  if (!ctx || isMuted) return;

  const osc = ctx.createOscillator();
  const gain = createGain(ctx, 0.2, 0.08);

  osc.type = "sine";
  const startFreq = isEnergy ? 1200 : 900;
  const endFreq = isEnergy ? 1800 : 1300;

  osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + 0.2);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.2);
};

// 7. Biome Portal Warp Shift
export const playBiomeChangeSound = () => {
  const ctx = initAudio();
  if (!ctx || isMuted) return;

  const now = ctx.currentTime;
  const duration = 0.8;
  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = createGain(ctx, duration, 0.15);

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(60, now);
  osc.frequency.exponentialRampToValueAtTime(600, now + duration);

  filter.type = "bandpass";
  filter.frequency.setValueAtTime(100, now);
  filter.frequency.exponentialRampToValueAtTime(1200, now + duration);
  filter.Q.value = 5;

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(now + duration);
};

// 8. General Click
export const playClickSound = () => {
  const ctx = initAudio();
  if (!ctx || isMuted) return;

  const osc = ctx.createOscillator();
  const gain = createGain(ctx, 0.05, 0.1);

  osc.type = "sine";
  osc.frequency.setValueAtTime(1000, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.05);
};

// 9. Pause Sound
export const playPauseSound = () => {
  const ctx = initAudio();
  if (!ctx || isMuted) return;

  const osc = ctx.createOscillator();
  const gain = createGain(ctx, 0.3, 0.1);

  osc.type = "triangle";
  osc.frequency.setValueAtTime(400, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.3);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.3);
};

// 10. Unpause Sound
export const playUnpauseSound = () => {
  const ctx = initAudio();
  if (!ctx || isMuted) return;

  const osc = ctx.createOscillator();
  const gain = createGain(ctx, 0.3, 0.1);

  osc.type = "triangle";
  osc.frequency.setValueAtTime(200, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.3);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.3);
};

// 11. Game Over Fanfare
export const playGameOverSound = () => {
  const ctx = initAudio();
  if (!ctx || isMuted) return;

  stopBgm();
  const now = ctx.currentTime;
  const sequence = [220, 207.65, 196, 164.81]; // A3, G#3, G3, E3

  sequence.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(freq, now + index * 0.25);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12, now + index * 0.25 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.25 + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + index * 0.25);
    osc.stop(now + index * 0.25 + 0.6);
  });
};

// 12. Victory Fanfare
export const playVictorySound = () => {
  const ctx = initAudio();
  if (!ctx || isMuted) return;

  stopBgm();
  const now = ctx.currentTime;
  const sequence = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C major scale up to C6

  sequence.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now + index * 0.1);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.1, now + index * 0.1 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.1 + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + index * 0.1);
    osc.stop(now + index * 0.1 + 0.5);
  });
};

// 13. Drone Charge Sound
export const playDroneChargeSound = () => {
  const ctx = initAudio();
  if (!ctx || isMuted) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(300, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.5);

  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.5);
};

// 14. Disruptor Charge Sound
export const playDisruptorChargeSound = () => {
  const ctx = initAudio();
  if (!ctx || isMuted) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(100, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 1.0);

  // High cut filter to make it rumble
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(400, ctx.currentTime);

  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.8);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.0);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 1.0);
};

// 15. Disruptor Pulse Sound
export const playDisruptorPulseSound = () => {
  const ctx = initAudio();
  if (!ctx || isMuted) return;

  const osc = ctx.createOscillator();
  const gain = createGain(ctx, 0.4, 0.15);

  osc.type = "triangle";
  osc.frequency.setValueAtTime(400, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.4);

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 300;

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.4);
};

// 16. Elite Charge Sound
export const playEliteChargeSound = () => {
  const ctx = initAudio();
  if (!ctx || isMuted) return;

  const osc = ctx.createOscillator();
  const gain = createGain(ctx, 0.3, 0.12);

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(80, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.3);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.3);
};

// 17. Shield Deflect Metal Clink Sound
export const playShieldDeflectSound = () => {
  const ctx = initAudio();
  if (!ctx || isMuted) return;

  const osc = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = createGain(ctx, 0.08, 0.18);

  osc.type = "triangle";
  osc.frequency.setValueAtTime(2200, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 0.08);

  osc2.type = "sine";
  osc2.frequency.setValueAtTime(3100, ctx.currentTime);
  osc2.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 0.08);

  osc.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc2.start();
  osc.stop(ctx.currentTime + 0.08);
  osc2.stop(ctx.currentTime + 0.08);
};

// 18. Heavy Impact Sound
export const playHeavyImpactSound = () => {
  const ctx = initAudio();
  if (!ctx || isMuted) return;

  const osc = ctx.createOscillator();
  const gain = createGain(ctx, 0.3, 0.22);

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(150, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.3);

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 250;

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.3);
};

// 19. Critical Hit Crisp Sound
export const playCriticalHitSound = () => {
  const ctx = initAudio();
  if (!ctx || isMuted) return;

  const osc = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = createGain(ctx, 0.12, 0.12);

  osc.type = "sine";
  osc.frequency.setValueAtTime(1600, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.12);

  osc2.type = "sine";
  osc2.frequency.setValueAtTime(2200, ctx.currentTime);
  osc2.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.12);

  osc.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc2.start();
  osc.stop(ctx.currentTime + 0.12);
  osc2.stop(ctx.currentTime + 0.12);
};


// --- BACKGROUND BGM SEQUENCER ---

export const stopBgm = () => {
  bgmSequenceActive = false;
  if (bgmTimer) {
    clearInterval(bgmTimer);
    bgmTimer = null;
  }
  if (currentBgmNode) {
    try {
      currentBgmNode.stop();
    } catch (e) {}
    currentBgmNode = null;
  }
};

export const startBgm = (intensity: "EXPLORATION" | "HIGH_INTENSITY" | "BOSS") => {
  const ctx = initAudio();
  if (!ctx || isMuted) return;

  stopBgm();
  bgmSequenceActive = true;

  let tempo = 150; // ms per step
  let notes: number[] = [];

  if (intensity === "EXPLORATION") {
    // Soft deep minor pentatonic bassline
    notes = [110, 130.81, 146.83, 164.81, 196.00]; // A2, C3, D3, E3, G3
    tempo = 320;
  } else if (intensity === "HIGH_INTENSITY") {
    // Fast intense sci-fi arpeggio
    notes = [146.83, 174.61, 196.00, 220.00, 261.63, 293.66]; // D3, F3, G3, A3, C4, D4
    tempo = 180;
  } else {
    // Dark Boss progression
    notes = [87.31, 98.00, 103.83, 110.00, 123.47]; // F2, G2, Ab2, A2, B2
    tempo = 200;
  }

  let index = 0;

  const playStep = () => {
    if (!bgmSequenceActive || isMuted) return;
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();

    const note = notes[index % notes.length];
    
    osc.type = intensity === "BOSS" ? "sawtooth" : "triangle";
    osc.frequency.setValueAtTime(note, now);

    // Apply quick frequency slide for techno filter feel
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(intensity === "BOSS" ? 400 : 800, now);
    filter.frequency.exponentialRampToValueAtTime(100, now + tempo / 1000);

    const volume = intensity === "BOSS" ? 0.04 : intensity === "HIGH_INTENSITY" ? 0.03 : 0.05;
    gainNode.gain.setValueAtTime(volume, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + (tempo / 1000) * 0.95);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + tempo / 1000);

    index++;
  };

  playStep();
  bgmTimer = setInterval(playStep, tempo);
};

// --- BOSS SPECIAL PROCEDURAL AUDIO LAYERS (PART 2/2) ---

// 20. Boss Arrival Alarm Cue
export const playBossArrivalSound = () => {
  const ctx = initAudio();
  if (!ctx || isMuted) return;

  const now = ctx.currentTime;
  const duration = 1.5;

  const subOsc = ctx.createOscillator();
  const subGain = ctx.createGain();
  subOsc.type = "sawtooth";
  subOsc.frequency.setValueAtTime(55, now); // deep low A1
  subOsc.frequency.linearRampToValueAtTime(30, now + duration);

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(150, now);

  subGain.gain.setValueAtTime(0, now);
  subGain.gain.linearRampToValueAtTime(0.25, now + 0.1);
  subGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  subOsc.connect(filter);
  filter.connect(subGain);
  subGain.connect(ctx.destination);
  subOsc.start(now);
  subOsc.stop(now + duration);

  // High Pitch Beep Alarm Overlay
  [0, 0.4, 0.8].forEach((delay) => {
    const alarmOsc = ctx.createOscillator();
    const alarmGain = createGain(ctx, 0.25, 0.1);
    alarmOsc.type = "sine";
    alarmOsc.frequency.setValueAtTime(987.77, now + delay); // B5 alarm tone
    alarmOsc.connect(alarmGain);
    alarmGain.connect(ctx.destination);
    alarmOsc.start(now + delay);
    alarmOsc.stop(now + delay + 0.25);
  });
};

// 21. Boss Phase Transition Screech
export const playBossPhaseTransitionSound = () => {
  const ctx = initAudio();
  if (!ctx || isMuted) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = createGain(ctx, 0.8, 0.15);

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(80, now);
  osc.frequency.exponentialRampToValueAtTime(1600, now + 0.5);
  osc.frequency.linearRampToValueAtTime(100, now + 0.8);

  filter.type = "peaking";
  filter.frequency.setValueAtTime(100, now);
  filter.frequency.exponentialRampToValueAtTime(4000, now + 0.5);
  filter.Q.value = 10;

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.8);
};

// 22. Boss Charge Target Lock Sweeper
export const playBossChargeSound = () => {
  const ctx = initAudio();
  if (!ctx || isMuted) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(180, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.4);

  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.4);
};

// 23. Boss Shard Burst Noise Sound
export const playBossShardsSound = () => {
  const ctx = initAudio();
  if (!ctx || isMuted) return;

  const osc = ctx.createOscillator();
  const gain = createGain(ctx, 0.2, 0.08);

  osc.type = "triangle";
  osc.frequency.setValueAtTime(700, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.2);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.2);
};

// 24. Boss Singularity Pulse Resonance Sound
export const playBossPulseSound = () => {
  const ctx = initAudio();
  if (!ctx || isMuted) return;

  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = createGain(ctx, 0.6, 0.2);

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(120, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.6);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(800, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.6);
  filter.Q.value = 15;

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.6);
};
