(function() {
  "use strict";

  const CHANNELS = Object.freeze(["fsl", "soundlab"]);
  const PROFILES = Object.freeze(["fsl-fretboard-position", "soundlab-guide-tone"]);
  const PROFILE_RANGES = Object.freeze({
    "fsl-fretboard-position": { min: 40, max: 76 },
    "soundlab-guide-tone": { min: 48, max: 76 }
  });
  const PROFILE_DEFAULTS = Object.freeze({
    "fsl-fretboard-position": {
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
  const SOUNDLAB_SAMPLER_STATES = Object.freeze(["idle", "loading", "ready", "partial", "failed"]);
  const INSTRUMENT_IDS = Object.freeze(["synth", "nylon", "electric", "none"]);
  const INSTRUMENT_AVAILABILITY = Object.freeze({
    synth: Object.freeze({ available: true, reason: null }),
    nylon: Object.freeze({ available: true, reason: null }),
    electric: Object.freeze({ available: true, reason: null }),
    none: Object.freeze({ available: false, reason: "not-requested" })
  });
  const APPROVED_SOUNDLAB_SAMPLES = Object.freeze([
    { note: "A3", midi: 57, url: "assets/audio/nylon-guitar/A3.ogg" },
    { note: "C#4", midi: 61, url: "assets/audio/nylon-guitar/Cs4.ogg" },
    { note: "E4", midi: 64, url: "assets/audio/nylon-guitar/E4.ogg" },
    { note: "G#4", midi: 68, url: "assets/audio/nylon-guitar/Gs4.ogg" },
    { note: "A4", midi: 69, url: "assets/audio/nylon-guitar/A4.ogg" },
    { note: "C#5", midi: 73, url: "assets/audio/nylon-guitar/Cs5.ogg" },
    { note: "E5", midi: 76, url: "assets/audio/nylon-guitar/E5.ogg" }
  ]);

  // Nylon sample attribution:
  // Original sample author: quartertone
  // Source family: classical guitar multisample pack
  // Intermediary preparation: tonejs-instruments / Nicholaus P. Brosowsky
  // License: Creative Commons Attribution 3.0

  let audioCtx = null;
  let masterGain = null;
  let electricGain = null;
  let compressor = null;
  let channelGains = null;
  let lastError = null;
  let soundLabSamplerState = "idle";
  let loadedSampleCount = 0;
  let failedSampleCount = 0;
  let selectedInstrument = "synth";
  let requestedInstrument = "none";
  let lastPlaybackBackend = "none";
  let lastPlaybackInstrument = "none";
  let lastRequestedNote = null;
  let lastResolvedSample = null;
  let lastElectricSourceMidi = null;
  let lastElectricPlaybackRate = null;
  let lastFallbackReason = null;
  let soundLabSamplerLoadPromise = null;
  let electricSamplerState = "idle";
  let loadedElectricSampleCount = 0;
  let failedElectricSampleCount = 0;
  let electricSamplerLoadPromise = null;
  let approvedElectricMap = null;

  let fslSynthSamplerState = "idle";
  let loadedFslSynthSampleCount = 0;
  let failedFslSynthSampleCount = 0;
  let fslSynthSamplerLoadPromise = null;
  let approvedFslSynthMap = null;

  const activeVoices = new Map();
  const channelRequestGenerations = new Map(CHANNELS.map((channel) => [channel, 0]));
  const soundLabSampleBuffers = new Map();
  const soundLabFailedSamples = new Set();
  const electricSampleBuffers = new Map();
  const electricFailedSamples = new Set();
  const fslSynthSampleBuffers = new Map();
  const fslSynthFailedSamples = new Set();
  const fslSynthActiveSources = new Set();

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

  function normalizeInstrument(instrument, allowNone = false) {
    const normalized = String(instrument || "").trim().toLowerCase();
    if (normalized === "none" && allowNone) return "none";
    return INSTRUMENT_IDS.includes(normalized) && normalized !== "none" ? normalized : "synth";
  }

  function getInstrumentAvailability(instrument) {
    if (instrument === undefined) {
      return Object.fromEntries(INSTRUMENT_IDS.map((id) => [id, { ...INSTRUMENT_AVAILABILITY[id] }]));
    }
    const normalized = normalizeInstrument(instrument, true);
    return { ...INSTRUMENT_AVAILABILITY[normalized] };
  }

  function setSelectedInstrument(instrument) {
    const normalized = normalizeInstrument(instrument);
    if (normalized !== selectedInstrument) {
      stopAllTonal();
      selectedInstrument = normalized;
    }
    return selectedInstrument;
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

    electricGain = audioCtx.createGain();
    electricGain.gain.value = 0.25;
    electricGain.connect(compressor);

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

  function releaseChannel(channel, isPlaybackTrigger = false) {
    if (channel === "fsl" && !isPlaybackTrigger) {
      fslSynthActiveSources.forEach((src) => {
        try { src.stop(); } catch {}
        try { src.disconnect(); } catch {}
      });
      fslSynthActiveSources.clear();
    }
    const voice = activeVoices.get(channel);
    if (!voice) return false;

    cleanupVoice(voice);
    if (activeVoices.get(channel) === voice) {
      activeVoices.delete(channel);
    }
    return true;
  }

  function stopChannel(channel) {
    if (!isSupportedChannel(channel)) {
      setLastError(`Invalid channel: ${channel}`);
      return false;
    }

    channelRequestGenerations.set(channel, (channelRequestGenerations.get(channel) || 0) + 1);
    return releaseChannel(channel);
  }

  function stopAllTonal() {
    let stopped = false;
    CHANNELS.forEach((channel) => {
      stopped = stopChannel(channel) || stopped;
    });
    return stopped;
  }

  function createVoice(channel, profile, parsedPitch, velocity, playback = {}) {
    const settings = PROFILE_DEFAULTS[profile];
    const timeOffset = Math.max(0, Number(playback.timeOffset) || 0);
    const requestedDuration = Number(playback.duration);
    const duration = Number.isFinite(requestedDuration) && requestedDuration > 0
      ? requestedDuration
      : settings.duration;
    const now = audioCtx.currentTime + timeOffset;
    const endTime = now + duration;
    const sources = [];
    const nodes = [];
    const peakGain = Math.max(settings.peak * velocity, 0.0001);

    const envelopeGain = audioCtx.createGain();
    nodes.push(envelopeGain);

    envelopeGain.gain.setValueAtTime(0.0001, now);
    envelopeGain.gain.exponentialRampToValueAtTime(peakGain, now + settings.attack);

    if (profile === "fsl-fretboard-position") {
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

    return {
      channel,
      profile,
      sources,
      nodes,
      timerId: null,
      endTime
    };
  }

  function activateVoiceGroup(channel, voices) {
    const group = {
      channel,
      profile: voices[0]?.profile || null,
      sources: voices.flatMap((voice) => voice.sources || []),
      nodes: voices.flatMap((voice) => voice.nodes || []),
      timerId: null
    };
    const latestEndTime = Math.max(audioCtx.currentTime, ...voices.map((voice) => voice.endTime || audioCtx.currentTime));
    group.timerId = window.setTimeout(() => {
      if (activeVoices.get(channel) !== group) return;
      cleanupVoice(group);
      activeVoices.delete(channel);
    }, Math.ceil(Math.max(0, latestEndTime - audioCtx.currentTime + 0.08) * 1000));
    activeVoices.set(channel, group);
    return group;
  }

  async function playInstrumentNotes(options = {}) {
    const channel = options.channel;
    const profile = options.profile;
    const requestGeneration = (channelRequestGenerations.get(channel) || 0) + 1;

    try {
      if (!isSupportedChannel(channel)) {
        setLastError(`Invalid channel: ${channel}`);
        return { played: false, requestGeneration: 0, reason: "invalid-channel" };
      }

      channelRequestGenerations.set(channel, requestGeneration);
      releaseChannel(channel, true);

      if (!isSupportedProfile(profile)) {
        setLastError(`Invalid profile: ${profile}`);
        return { played: false, requestGeneration, reason: "invalid-profile" };
      }

      const noteValues = (Array.isArray(options.notes) ? options.notes : [options.note])
        .map((note) => String(note || "").trim())
        .filter(Boolean);
      requestedInstrument = normalizeInstrument(options.instrument ?? selectedInstrument);
      lastRequestedNote = noteValues.length === 1 ? noteValues[0] : noteValues.join(" → ") || null;
      lastResolvedSample = null;
      lastFallbackReason = null;

      if (!noteValues.length) {
        setLastError("No note was provided.");
        return { played: false, requestGeneration, reason: "invalid-note" };
      }

      const parsedPitches = noteValues.map(parseScientificPitch);
      const invalidIndex = parsedPitches.findIndex((parsedPitch) => !parsedPitch);
      if (invalidIndex >= 0) {
        setLastError(`Invalid scientific pitch: ${noteValues[invalidIndex]}`);
        return { played: false, requestGeneration, reason: "invalid-note" };
      }

      const outOfRangeIndex = parsedPitches.findIndex((parsedPitch) => !isPitchInProfileRange(parsedPitch, profile));
      if (outOfRangeIndex >= 0) {
        setLastError(`Pitch ${noteValues[outOfRangeIndex]} is outside ${profile} range.`);
        return { played: false, requestGeneration, reason: "out-of-range" };
      }

      const availability = getInstrumentAvailability(requestedInstrument);
      if (!availability.available) {
        lastFallbackReason = availability.reason;
        if (requestedInstrument !== "electric") {
          return { played: false, requestGeneration, reason: "instrument-unavailable" };
        }
      }

      if (requestedInstrument === "electric" && availability.available) {
        const samplerState = await prepareElectricSampler();
        if (samplerState === "failed") {
          lastFallbackReason = "electric-sampler-unavailable";
        }
      }

      if (!isReady()) {
        const didUnlock = await unlock();
        if (!didUnlock) return { played: false, requestGeneration, reason: "audio-unavailable" };
      }

      if (requestGeneration !== channelRequestGenerations.get(channel)) {
        return { played: false, requestGeneration, reason: "superseded" };
      }

      if (requestedInstrument === "nylon") {
        await prepareSoundLabSampler();
        if (requestGeneration !== channelRequestGenerations.get(channel)) {
          return { played: false, requestGeneration, reason: "superseded" };
        }
      }

      if (channel === "fsl" && requestedInstrument === "synth") {
        await prepareFslSynthSampler();
        if (requestGeneration !== channelRequestGenerations.get(channel)) {
          return { played: false, requestGeneration, reason: "superseded" };
        }
      }

      let usedNylon = false;
      let usedElectric = false;
      let usedFslSynth = false;
      let usedSynth = false;
      const voices = parsedPitches.map((parsedPitch, index) => {
        const timeOffset = Number(options.timeOffsets?.[index] ?? options.timeOffset ?? 0);
        const duration = Number(options.durations?.[index] ?? options.duration);
        const velocity = clampVelocity(options.velocities?.[index] ?? options.velocity);

        if (requestedInstrument === "nylon") {
          const resolvedSample = resolveNearestApprovedSample(parsedPitch);
          lastResolvedSample = resolvedSample?.note || null;
          if (
            resolvedSample
            && (soundLabSamplerState === "ready" || soundLabSamplerState === "partial")
            && soundLabSampleBuffers.has(resolvedSample.note)
          ) {
            try {
              const sampleVoice = createSampleVoice(parsedPitch, velocity, resolvedSample, {
                channel,
                profile,
                timeOffset,
                duration
              });
              usedNylon = true;
              return sampleVoice;
            } catch {
              lastFallbackReason = "sample-playback-failed";
            }
          } else {
            lastFallbackReason = soundLabFailedSamples.has(resolvedSample?.note)
              ? "resolved-sample-failed"
              : "sampler-unavailable";
          }
        }

        if (requestedInstrument === "electric") {
          const mapping = parsedPitch.midi >= 40 && parsedPitch.midi <= 76
            ? approvedElectricMap?.notes?.[parsedPitch.midi.toString()]
            : null;
          const sampleUrl = mapping ? mapping.path : null;
          lastResolvedSample = sampleUrl || null;
          if (
            sampleUrl
            && (electricSamplerState === "ready" || electricSamplerState === "partial")
            && electricSampleBuffers.has(sampleUrl)
          ) {
            try {
              const playbackRate = 2 ** ((parsedPitch.midi - mapping.sourceMidi) / 12);
              lastElectricSourceMidi = mapping.sourceMidi;
              lastElectricPlaybackRate = playbackRate;
              const sampleVoice = createElectricSampleVoice(sampleUrl, {
                channel,
                profile,
                timeOffset,
                duration,
                playbackRate
              });
              usedElectric = true;
              return sampleVoice;
            } catch {
              lastFallbackReason = "electric-sample-playback-failed";
            }
          } else if (!lastFallbackReason) {
            lastFallbackReason = electricFailedSamples.has(sampleUrl)
              ? "electric-sample-failed"
              : "electric-note-unavailable";
          }
        }
        if (channel === "fsl" && requestedInstrument === "synth") {
          const mapping = parsedPitch.midi >= 40 && parsedPitch.midi <= 76
            ? approvedFslSynthMap?.notes?.[parsedPitch.midi.toString()]
            : null;
          const sampleUrl = mapping ? mapping.path : null;
          lastResolvedSample = sampleUrl || null;
          if (
            sampleUrl
            && (fslSynthSamplerState === "ready" || fslSynthSamplerState === "partial")
            && fslSynthSampleBuffers.has(sampleUrl)
          ) {
            try {
              const sampleVoice = createFslSynthVoice(sampleUrl, {
                timeOffset,
                duration
              });
              usedFslSynth = true;
              return sampleVoice;
            } catch {
              lastFallbackReason = "fsl-synth-sample-playback-failed";
            }
          } else if (!lastFallbackReason) {
            lastFallbackReason = fslSynthFailedSamples.has(sampleUrl)
              ? "fsl-synth-sample-failed"
              : "fsl-synth-sampler-unavailable";
          }
        }

        usedSynth = true;
        return createVoice(channel, profile, parsedPitch, velocity, { timeOffset, duration });
      });

      if (requestGeneration !== channelRequestGenerations.get(channel)) {
        voices.forEach(cleanupVoice);
        return { played: false, requestGeneration, reason: "superseded" };
      }

      activateVoiceGroup(channel, voices);
      lastPlaybackInstrument = usedElectric && !usedSynth && !usedFslSynth
        ? "electric"
        : usedNylon && !usedSynth && !usedFslSynth
          ? "nylon"
          : "synth";
      lastPlaybackBackend = (lastPlaybackInstrument === "synth" && !usedFslSynth) ? "native-synth" : "native-sampler";
      lastError = null;
      return {
        played: true,
        requestGeneration,
        backend: lastPlaybackBackend,
        instrument: lastPlaybackInstrument,
        resolvedSample: lastResolvedSample,
        fallbackReason: lastFallbackReason,
        note: noteValues[0],
        notes: noteValues.slice()
      };
    } catch (error) {
      setLastError(error?.message || "playNote failed.");
      return { played: false, requestGeneration, reason: "playback-failed" };
    }
  }

  async function playNote(options = {}) {
    const result = await playInstrumentNotes(options);
    return result.played === true;
  }

  async function loadApprovedSoundLabSample(sample) {
    try {
      const response = await fetch(sample.url, { cache: "force-cache" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const encodedAudio = await response.arrayBuffer();
      const decodedAudio = await audioCtx.decodeAudioData(encodedAudio.slice(0));
      soundLabSampleBuffers.set(sample.note, decodedAudio);
      loadedSampleCount = soundLabSampleBuffers.size;
    } catch (error) {
      soundLabFailedSamples.add(sample.note);
      failedSampleCount = soundLabFailedSamples.size;
      console.warn(`[AudioEngine] Nylon sample ${sample.note} failed to load.`, error);
    }
  }

  function updateSoundLabSamplerState() {
    loadedSampleCount = soundLabSampleBuffers.size;
    failedSampleCount = soundLabFailedSamples.size;
    soundLabSamplerState = loadedSampleCount === APPROVED_SOUNDLAB_SAMPLES.length
      ? "ready"
      : loadedSampleCount > 0
        ? "partial"
        : "failed";
    return soundLabSamplerState;
  }

  async function prepareSoundLabSampler() {
    if (soundLabSamplerState === "ready" || soundLabSamplerState === "partial" || soundLabSamplerState === "failed") {
      return soundLabSamplerState;
    }
    if (soundLabSamplerLoadPromise) return soundLabSamplerLoadPromise;

    const didUnlock = isReady() || await unlock();
    if (!didUnlock) {
      soundLabSamplerState = "failed";
      lastFallbackReason = "audio-unavailable";
      return soundLabSamplerState;
    }

    soundLabSamplerState = "loading";
    loadedSampleCount = 0;
    failedSampleCount = 0;
    soundLabSampleBuffers.clear();
    soundLabFailedSamples.clear();

    soundLabSamplerLoadPromise = Promise.all(
      APPROVED_SOUNDLAB_SAMPLES.map(loadApprovedSoundLabSample)
    ).then(updateSoundLabSamplerState).finally(() => {
      soundLabSamplerLoadPromise = null;
    });

    return soundLabSamplerLoadPromise;
  }

  async function prepareElectricSampler() {
    if (electricSamplerState === "ready" || electricSamplerState === "partial" || electricSamplerState === "failed") {
      return electricSamplerState;
    }
    if (electricSamplerLoadPromise) return electricSamplerLoadPromise;

    const didUnlock = isReady() || await unlock();
    if (!didUnlock) {
      electricSamplerState = "failed";
      lastFallbackReason = "audio-unavailable";
      return electricSamplerState;
    }

    electricSamplerState = "loading";
    loadedElectricSampleCount = 0;
    failedElectricSampleCount = 0;
    approvedElectricMap = null;
    electricSampleBuffers.clear();
    electricFailedSamples.clear();

    electricSamplerLoadPromise = (async () => {
      try {
        const mapResponse = await fetch(
          "assets/audio/electric/APPROVED_SAMPLE_MAP.json",
          { cache: "force-cache" }
        );
        if (!mapResponse.ok) throw new Error(`HTTP ${mapResponse.status}`);

        approvedElectricMap = await mapResponse.json();

        if (!approvedElectricMap || approvedElectricMap.schemaVersion !== 2) {
          throw new Error("Unsupported Electric sample-map schema");
        }
        if (!approvedElectricMap.notes || typeof approvedElectricMap.notes !== "object" || Array.isArray(approvedElectricMap.notes)) {
          throw new Error("Invalid notes object in schema");
        }

        const noteKeys = Object.keys(approvedElectricMap.notes);
        if (noteKeys.length !== 37) {
          throw new Error("Schema must contain exactly 37 entries");
        }

        for (let m = 40; m <= 76; m++) {
          const mapping = approvedElectricMap.notes[m.toString()];
          if (!mapping || typeof mapping !== "object" || Array.isArray(mapping)) {
            throw new Error(`Missing or invalid mapping for MIDI ${m}`);
          }
          if (typeof mapping.path !== "string" || mapping.path.trim() === "") {
            throw new Error(`Invalid path for MIDI ${m}`);
          }
          if (!mapping.path.startsWith("assets/audio/electric/")) {
            throw new Error(`Path ${mapping.path} outside assets/audio/electric/ for MIDI ${m}`);
          }
          if (!Number.isInteger(mapping.sourceMidi) || mapping.sourceMidi < 0 || mapping.sourceMidi > 127) {
            throw new Error(`Invalid sourceMidi for MIDI ${m}`);
          }
          const rate = 2 ** ((m - mapping.sourceMidi) / 12);
          if (!Number.isFinite(rate) || rate <= 0) {
            throw new Error(`Invalid calculated playback rate for MIDI ${m}`);
          }
        }

        const uniqueUrls = Array.from(new Set(Object.values(approvedElectricMap.notes).map(m => m.path)));
        await Promise.all(uniqueUrls.map(async (url) => {
          try {
            const response = await fetch(url, { cache: "force-cache" });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const encodedAudio = await response.arrayBuffer();
            const decodedAudio = await audioCtx.decodeAudioData(encodedAudio.slice(0));
            electricSampleBuffers.set(url, decodedAudio);
          } catch (error) {
            electricFailedSamples.add(url);
            console.warn(`[AudioEngine] Electric sample ${url} failed to load.`, error);
          }
        }));

        loadedElectricSampleCount = electricSampleBuffers.size;
        failedElectricSampleCount = electricFailedSamples.size;
        electricSamplerState = uniqueUrls.length > 0 && loadedElectricSampleCount === uniqueUrls.length
          ? "ready"
          : loadedElectricSampleCount > 0
            ? "partial"
            : "failed";
      } catch (error) {
        electricSamplerState = "failed";
        console.warn("[AudioEngine] Electric sample map failed to load.", error);
      }

      return electricSamplerState;
    })().finally(() => {
      electricSamplerLoadPromise = null;
    });

    return electricSamplerLoadPromise;
  }

  async function prepareFslSynthSampler() {
    if (fslSynthSamplerState === "ready" || fslSynthSamplerState === "partial" || fslSynthSamplerState === "failed") {
      return fslSynthSamplerState;
    }
    if (fslSynthSamplerLoadPromise) return fslSynthSamplerLoadPromise;

    const didUnlock = isReady() || await unlock();
    if (!didUnlock) {
      fslSynthSamplerState = "failed";
      lastFallbackReason = "audio-unavailable";
      return fslSynthSamplerState;
    }

    fslSynthSamplerState = "loading";
    loadedFslSynthSampleCount = 0;
    failedFslSynthSampleCount = 0;
    approvedFslSynthMap = null;
    fslSynthSampleBuffers.clear();
    fslSynthFailedSamples.clear();

    fslSynthSamplerLoadPromise = (async () => {
      try {
        const mapResponse = await fetch(
          "assets/audio/fsl-synth/APPROVED_SAMPLE_MAP.json",
          { cache: "force-cache" }
        );
        if (!mapResponse.ok) throw new Error(`HTTP ${mapResponse.status}`);

        approvedFslSynthMap = await mapResponse.json();

        if (!approvedFslSynthMap || approvedFslSynthMap.schemaVersion !== 1) {
          throw new Error("Unsupported FSL Synth sample-map schema version");
        }
        if (approvedFslSynthMap.instrument !== "fsl-synth-short-oneshot") {
          throw new Error("Invalid FSL Synth instrument type");
        }
        if (!approvedFslSynthMap.notes || typeof approvedFslSynthMap.notes !== "object" || Array.isArray(approvedFslSynthMap.notes)) {
          throw new Error("Invalid notes object in FSL Synth schema");
        }

        const noteKeys = Object.keys(approvedFslSynthMap.notes);
        if (noteKeys.length !== 37) {
          throw new Error("FSL Synth map must contain exactly 37 entries");
        }

        for (let m = 40; m <= 76; m++) {
          const mapping = approvedFslSynthMap.notes[m.toString()];
          if (!mapping || typeof mapping !== "object" || Array.isArray(mapping)) {
            throw new Error(`Missing or invalid mapping for FSL Synth MIDI ${m}`);
          }
          if (typeof mapping.path !== "string" || mapping.path.trim() === "") {
            throw new Error(`Invalid path for FSL Synth MIDI ${m}`);
          }
          if (!mapping.path.startsWith("assets/audio/fsl-synth/")) {
            throw new Error(`Path ${mapping.path} outside assets/audio/fsl-synth/ for MIDI ${m}`);
          }
          if (mapping.targetMidi !== m || mapping.sourceMidi !== m) {
            throw new Error(`MIDI mismatch: targetMidi/sourceMidi must equal ${m}`);
          }
          if (mapping.playbackRate !== 1) {
            throw new Error(`playbackRate must equal 1 for MIDI ${m}`);
          }
        }

        const uniqueUrls = Array.from(new Set(Object.values(approvedFslSynthMap.notes).map(m => m.path)));
        await Promise.all(uniqueUrls.map(async (url) => {
          try {
             const response = await fetch(url, { cache: "force-cache" });
             if (!response.ok) throw new Error(`HTTP ${response.status}`);
             const encodedAudio = await response.arrayBuffer();
             const decodedAudio = await audioCtx.decodeAudioData(encodedAudio.slice(0));
             fslSynthSampleBuffers.set(url, decodedAudio);
          } catch (error) {
             fslSynthFailedSamples.add(url);
             console.warn(`[AudioEngine] FSL Synth sample ${url} failed to load.`, error);
          }
        }));

        loadedFslSynthSampleCount = fslSynthSampleBuffers.size;
        failedFslSynthSampleCount = fslSynthFailedSamples.size;
        fslSynthSamplerState = uniqueUrls.length > 0 && loadedFslSynthSampleCount === uniqueUrls.length
          ? "ready"
          : loadedFslSynthSampleCount > 0
            ? "partial"
            : "failed";
      } catch (error) {
        fslSynthSamplerState = "failed";
        console.warn("[AudioEngine] FSL Synth sample map failed to load.", error);
      }

      return fslSynthSamplerState;
    })().finally(() => {
      fslSynthSamplerLoadPromise = null;
    });

    return fslSynthSamplerLoadPromise;
  }

  function createFslSynthVoice(sampleUrl, playback = {}) {
    const buffer = fslSynthSampleBuffers.get(sampleUrl);
    if (!buffer) throw new Error(`FSL Synth sample ${sampleUrl} is unavailable.`);

    const timeOffset = Math.max(0, Number(playback.timeOffset) || 0);
    const now = audioCtx.currentTime + timeOffset;
    const source = audioCtx.createBufferSource();

    source.buffer = buffer;
    source.playbackRate.setValueAtTime(1.0, now);
    source.connect(channelGains.fsl);
    source.start(now);

    fslSynthActiveSources.add(source);
    source.onended = () => {
      fslSynthActiveSources.delete(source);
    };

    return {
      channel: "fsl",
      profile: "fsl-fretboard-position",
      sources: [], // leave empty so cleanupVoice does not stop it during transition overlaps!
      nodes: [],
      timerId: null,
      endTime: now + buffer.duration
    };
  }

  function resolveNearestApprovedSample(parsedPitch) {
    return APPROVED_SOUNDLAB_SAMPLES.reduce((nearest, sample) => {
      if (!nearest) return sample;
      return Math.abs(sample.midi - parsedPitch.midi) < Math.abs(nearest.midi - parsedPitch.midi)
        ? sample
        : nearest;
    }, null);
  }

  function createSampleVoice(parsedPitch, velocity, sample, playback = {}) {
    const buffer = soundLabSampleBuffers.get(sample.note);
    if (!buffer) throw new Error(`Nylon sample ${sample.note} is unavailable.`);

    const channel = isSupportedChannel(playback.channel) ? playback.channel : "soundlab";
    const profile = isSupportedProfile(playback.profile) ? playback.profile : "soundlab-guide-tone";
    const timeOffset = Math.max(0, Number(playback.timeOffset) || 0);
    const now = audioCtx.currentTime + timeOffset;
    const source = audioCtx.createBufferSource();
    const voiceGain = audioCtx.createGain();
    const playbackRate = 2 ** ((parsedPitch.midi - sample.midi) / 12);
    const naturalDuration = buffer.duration / playbackRate;
    const requestedDuration = Number(playback.duration);
    const duration = Number.isFinite(requestedDuration) && requestedDuration > 0
      ? Math.min(requestedDuration, naturalDuration)
      : naturalDuration;

    source.buffer = buffer;
    source.playbackRate.setValueAtTime(playbackRate, now);
    voiceGain.gain.setValueAtTime(Math.max(velocity, 0.0001), now);
    voiceGain.gain.setValueAtTime(Math.max(velocity, 0.0001), Math.max(now, now + duration - 0.04));
    voiceGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    source.connect(voiceGain);
    voiceGain.connect(channelGains[channel]);
    source.start(now);
    source.stop(now + duration + 0.02);

    return {
      channel,
      profile,
      sources: [source],
      nodes: [source, voiceGain],
      timerId: null,
      endTime: now + duration
    };
  }

  function createElectricSampleVoice(sampleUrl, playback = {}) {
    const buffer = electricSampleBuffers.get(sampleUrl);
    if (!buffer) throw new Error(`Electric sample ${sampleUrl} is unavailable.`);

    const channel = isSupportedChannel(playback.channel) ? playback.channel : "soundlab";
    const profile = isSupportedProfile(playback.profile) ? playback.profile : "soundlab-guide-tone";
    const timeOffset = Math.max(0, Number(playback.timeOffset) || 0);
    const now = audioCtx.currentTime + timeOffset;
    const source = audioCtx.createBufferSource();
    const requestedDuration = Number(playback.duration);
    const duration = Number.isFinite(requestedDuration) && requestedDuration > 0
      ? Math.min(requestedDuration, buffer.duration)
      : buffer.duration;

    source.buffer = buffer;
    const rate = Number.isFinite(playback.playbackRate) ? playback.playbackRate : 1.0;
    source.playbackRate.setValueAtTime(rate, now);
    source.connect(electricGain);
    source.start(now);
    source.stop(now + duration + 0.02);

    return {
      channel,
      profile,
      sources: [source],
      nodes: [source],
      timerId: null,
      endTime: now + duration
    };
  }

  async function playSoundLabGuideNote(options = {}) {
    return playInstrumentNotes({
      ...options,
      channel: "soundlab",
      profile: "soundlab-guide-tone"
    });
  }

  function stopSoundLab() {
    const stopped = stopChannel("soundlab");
    return { stopped, requestGeneration: channelRequestGenerations.get("soundlab") || 0 };
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
      samplerState: SOUNDLAB_SAMPLER_STATES.includes(soundLabSamplerState)
        ? soundLabSamplerState
        : "failed",
      approvedSampleCount: APPROVED_SOUNDLAB_SAMPLES.length,
      loadedSampleCount,
      failedSampleCount,
      electricSamplerState,
      loadedElectricSampleCount,
      failedElectricSampleCount,
      fslSynthSamplerState,
      loadedFslSynthSampleCount,
      failedFslSynthSampleCount,
      selectedInstrument,
      requestedInstrument,
      lastPlaybackBackend,
      lastPlaybackInstrument,
      lastRequestedNote,
      lastResolvedSample,
      lastElectricSourceMidi,
      lastElectricPlaybackRate,
      lastFallbackReason,
      instrumentAvailability: getInstrumentAvailability(),
      activeSoundLabVoiceCount: activeVoices.has("soundlab") ? 1 : 0,
      activeFslSynthVoiceCount: fslSynthActiveSources.size,
      lastError
    };
  }

  window.AudioEngine = {
    unlock,
    isReady,
    getInstrumentAvailability,
    setSelectedInstrument,
    playNote,
    prepareSoundLabSampler,
    prepareElectricSampler,
    prepareFslSynthSampler,
    playSoundLabGuideNote,
    stopSoundLab,
    stopChannel,
    stopAllTonal,
    getStatus
  };
})();
