(function() {
  "use strict";

  const CHANNELS = Object.freeze(["fsl", "soundlab"]);
  const PROFILES = Object.freeze(["fsl-note-preview", "soundlab-guide-tone"]);
  const PROFILE_RANGES = Object.freeze({
    "fsl-note-preview": { min: 60, max: 72 },
    "soundlab-guide-tone": { min: 57, max: 72 }
  });
  const PROFILE_DEFAULTS = Object.freeze({
    "fsl-note-preview": {
      duration: 0.34,
      attack: 0.012,
      peak: 0.62,
      type: "triangle"
    },
    "soundlab-guide-tone": {
      duration: 1.15,
      attack: 0.02,
      peak: 0.58,
      type: "triangle"
    }
  });
  const NOTE_OFFSETS = Object.freeze({
    C: 0,
    "C#": 1,
    Db: 1,
    D: 2,
    "D#": 3,
    Eb: 3,
    E: 4,
    F: 5,
    "F#": 6,
    Gb: 6,
    G: 7,
    "G#": 8,
    Ab: 8,
    A: 9,
    "A#": 10,
    Bb: 10,
    B: 11
  });

  let audioCtx = null;
  let masterGain = null;
  let compressor = null;
  let channelGains = null;
  let lastError = null;

  const activeVoices = new Map();

  function getAudioContextCtor() {
    return window.AudioContext || window.webkitAudioContext || null;
  }

  function setLastError(message) {
    lastError = message || null;
    if (message) console.warn(`[AudioEngine] ${message}`);
  }

  function isSupportedChannel(channel) {
    return CHANNELS.includes(channel);
  }

  function isSupportedProfile(profile) {
    return PROFILES.includes(profile);
  }

  function clampVelocity(value) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return 0.7;
    return Math.min(1, Math.max(0, parsed));
  }

  function parseScientificPitch(note) {
    const match = String(note || "").trim().match(/^([A-G](?:#|b)?)(\d)$/);
    if (!match) return null;

    const noteName = match[1];
    const octave = Number(match[2]);
    const semitone = NOTE_OFFSETS[noteName];
    if (semitone === undefined) return null;

    const midi = (octave + 1) * 12 + semitone;
    const frequency = 440 * (2 ** ((midi - 69) / 12));
    return { noteName, octave, midi, frequency };
  }

  function isPitchInProfileRange(parsedPitch, profile) {
    const range = PROFILE_RANGES[profile];
    return Boolean(range && parsedPitch.midi >= range.min && parsedPitch.midi <= range.max);
  }

  function createAudioGraph() {
    if (!audioCtx || masterGain) return;

    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.78, audioCtx.currentTime);

    compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.value = -8;
    compressor.knee.value = 24;
    compressor.ratio.value = 3;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.2;

    channelGains = {
      fsl: audioCtx.createGain(),
      soundlab: audioCtx.createGain()
    };
    channelGains.fsl.gain.setValueAtTime(1, audioCtx.currentTime);
    channelGains.soundlab.gain.setValueAtTime(1, audioCtx.currentTime);

    channelGains.fsl.connect(masterGain);
    channelGains.soundlab.connect(masterGain);
    masterGain.connect(compressor);
    compressor.connect(audioCtx.destination);
  }

  async function unlock() {
    const AudioContextCtor = getAudioContextCtor();
    if (!AudioContextCtor) {
      setLastError("Web Audio API is not supported.");
      return false;
    }

    try {
      if (!audioCtx) {
        audioCtx = new AudioContextCtor();
      }

      createAudioGraph();

      if (audioCtx.state === "suspended") {
        await audioCtx.resume();
      }

      if (audioCtx.state === "running") {
        lastError = null;
        return true;
      }

      setLastError(`AudioContext is ${audioCtx.state}.`);
      return false;
    } catch (error) {
      setLastError(error?.message || "Audio unlock failed.");
      return false;
    }
  }

  function isReady() {
    return Boolean(audioCtx && audioCtx.state === "running");
  }

  function cleanupVoice(voice) {
    if (!voice) return false;

    if (voice.timerId) {
      window.clearTimeout(voice.timerId);
      voice.timerId = null;
    }

    (voice.sources || []).forEach((source) => {
      try { source.stop(); } catch {}
    });

    (voice.nodes || []).forEach((node) => {
      try { node.disconnect(); } catch {}
    });

    return true;
  }

  function stopChannel(channel) {
    if (!isSupportedChannel(channel)) {
      setLastError(`Invalid channel: ${channel}`);
      return false;
    }

    const voice = activeVoices.get(channel);
    if (!voice) return false;

    cleanupVoice(voice);
    if (activeVoices.get(channel) === voice) {
      activeVoices.delete(channel);
    }
    return true;
  }

  function stopAllTonal() {
    let stopped = false;
    CHANNELS.forEach((channel) => {
      stopped = stopChannel(channel) || stopped;
    });
    return stopped;
  }

  function createVoice(channel, profile, parsedPitch, velocity) {
    const settings = PROFILE_DEFAULTS[profile];
    const now = audioCtx.currentTime;
    const endTime = now + settings.duration;
    const sources = [];
    const nodes = [];
    const peakGain = Math.max(settings.peak * velocity, 0.0001);

    const envelopeGain = audioCtx.createGain();
    nodes.push(envelopeGain);

    envelopeGain.gain.setValueAtTime(0.0001, now);
    envelopeGain.gain.exponentialRampToValueAtTime(peakGain, now + settings.attack);

    if (profile === "fsl-note-preview") {
      envelopeGain.gain.exponentialRampToValueAtTime(0.0001, endTime);

      const osc = audioCtx.createOscillator();
      osc.type = settings.type;
      osc.frequency.setValueAtTime(parsedPitch.frequency, now);
      osc.connect(envelopeGain);
      sources.push(osc);
      nodes.push(osc);
    } else {
      const filter = audioCtx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(6500, now);
      filter.frequency.exponentialRampToValueAtTime(2800, now + 0.28);
      filter.Q.setValueAtTime(0.7, now);
      nodes.push(filter);

      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const osc1Gain = audioCtx.createGain();
      const osc2Gain = audioCtx.createGain();
      osc1.type = "triangle";
      osc2.type = "sine";
      osc1.frequency.setValueAtTime(parsedPitch.frequency, now);
      osc2.frequency.setValueAtTime(parsedPitch.frequency, now);
      osc2.detune.setValueAtTime(-3, now);
      osc1Gain.gain.setValueAtTime(0.86, now);
      osc2Gain.gain.setValueAtTime(0.24, now);

      const sustain = Math.max(peakGain * 0.68, 0.0001);
      envelopeGain.gain.exponentialRampToValueAtTime(sustain, now + 0.16);
      envelopeGain.gain.setValueAtTime(sustain, Math.max(now + 0.18, endTime - 0.12));
      envelopeGain.gain.exponentialRampToValueAtTime(0.0001, endTime);

      osc1.connect(osc1Gain);
      osc2.connect(osc2Gain);
      osc1Gain.connect(filter);
      osc2Gain.connect(filter);
      filter.connect(envelopeGain);

      sources.push(osc1, osc2);
      nodes.push(osc1, osc2, osc1Gain, osc2Gain);
    }

    envelopeGain.connect(channelGains[channel]);

    sources.forEach((source) => source.start(now));
    sources.forEach((source) => source.stop(endTime + 0.04));

    const voice = {
      channel,
      profile,
      sources,
      nodes,
      timerId: null
    };

    voice.timerId = window.setTimeout(() => {
      if (activeVoices.get(channel) !== voice) return;
      cleanupVoice(voice);
      activeVoices.delete(channel);
    }, Math.ceil((settings.duration + 0.08) * 1000));

    return voice;
  }

  async function playNote(options = {}) {
    try {
      const { channel, profile, note } = options;

      if (!isSupportedChannel(channel)) {
        setLastError(`Invalid channel: ${channel}`);
        return false;
      }

      if (!isSupportedProfile(profile)) {
        setLastError(`Invalid profile: ${profile}`);
        return false;
      }

      const parsedPitch = parseScientificPitch(note);
      if (!parsedPitch) {
        setLastError(`Invalid scientific pitch: ${note}`);
        return false;
      }

      if (!isPitchInProfileRange(parsedPitch, profile)) {
        setLastError(`Pitch ${note} is outside ${profile} range.`);
        return false;
      }

      if (!isReady()) {
        const didUnlock = await unlock();
        if (!didUnlock) return false;
      }

      stopChannel(channel);
      const voice = createVoice(channel, profile, parsedPitch, clampVelocity(options.velocity));
      activeVoices.set(channel, voice);
      lastError = null;
      return true;
    } catch (error) {
      setLastError(error?.message || "playNote failed.");
      return false;
    }
  }

  function getStatus() {
    const supported = Boolean(getAudioContextCtor());
    const contextState = audioCtx ? audioCtx.state : "uninitialized";

    return {
      supported,
      ready: isReady(),
      contextState,
      activeChannels: Array.from(activeVoices.keys()),
      activeVoiceCount: activeVoices.size,
      availableProfiles: Array.from(PROFILES),
      availableChannels: Array.from(CHANNELS),
      engine: "native",
      lastError
    };
  }

  window.AudioEngine = {
    unlock,
    isReady,
    playNote,
    stopChannel,
    stopAllTonal,
    getStatus
  };
})();
