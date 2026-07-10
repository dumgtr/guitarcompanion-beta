const noteItems = [
  { label: "A", interval: "Root", scale: "minor + major", playback: "A4" },
  { label: "C", interval: "b3", scale: "minor color", playback: "C5" },
  { label: "C#", interval: "3", scale: "major color", playback: "C#5" },
  { label: "D", interval: "4", scale: "minor pentatonic", playback: "D5" },
  { label: "E", interval: "5", scale: "minor + major", playback: "E5" },
  { label: "G", interval: "b7", scale: "minor pentatonic", playback: "G4" }
];

const noteOffsets = {
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
};

const lowRegisterPlayback = {
  A: "A2",
  C: "C3",
  "C#": "C#3",
  D: "D3",
  E: "E3",
  G: "G2"
};

const engineLabels = {
  clean: "Clean Oscillator",
  boosted: "Boosted Oscillator",
  plucked: "Sound Lab Plucked",
  "diagnostic-low": "Diagnostic Low Register"
};

const audioState = {
  context: null,
  masterGain: null,
  outputGain: null,
  boostedCompressor: null,
  pluckedCompressor: null,
  activeNodes: [],
  enabled: true,
  volume: 0.45,
  durationMs: 350,
  waveform: "triangle",
  engine: "plucked",
  outputTrim: 1.15,
  lastNote: null
};

const refs = {
  enableSound: document.getElementById("enableSound"),
  soundToggle: document.getElementById("soundToggle"),
  audioState: document.getElementById("audioState"),
  lastPlayed: document.getElementById("lastPlayed"),
  noteGrid: document.getElementById("noteGrid"),
  volumeControl: document.getElementById("volumeControl"),
  volumeReadout: document.getElementById("volumeReadout"),
  durationControl: document.getElementById("durationControl"),
  durationReadout: document.getElementById("durationReadout"),
  waveformSelect: document.getElementById("waveformSelect"),
  engineSelect: document.getElementById("engineSelect"),
  outputTrimControl: document.getElementById("outputTrimControl"),
  outputTrimReadout: document.getElementById("outputTrimReadout"),
  replayLastNote: document.getElementById("replayLastNote"),
  loudnessNote: document.getElementById("loudnessNote"),
  labelNote: document.getElementById("labelNote"),
  playbackNote: document.getElementById("playbackNote"),
  frequencyReadout: document.getElementById("frequencyReadout"),
  engineReadout: document.getElementById("engineReadout"),
  lowRegisterTest: document.getElementById("lowRegisterTest")
};

function parseScientificPitch(noteString) {
  const match = String(noteString).trim().match(/^([A-G](?:#|b)?)(-?\d)$/);
  if (!match) throw new Error(`Invalid note string: ${noteString}`);
  const [, noteName, octaveText] = match;
  const semitone = noteOffsets[noteName];
  if (semitone === undefined) throw new Error(`Unsupported note name: ${noteName}`);
  const octave = Number(octaveText);
  const midi = (octave + 1) * 12 + semitone;
  const frequency = 440 * (2 ** ((midi - 69) / 12));
  return { noteName, octave, midi, frequency };
}

async function ensureAudio() {
  if (!audioState.enabled) return null;
  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextCtor) {
    setAudioStatus("failed", "Audio: failed");
    return null;
  }

  try {
    if (!audioState.context) {
      audioState.context = new AudioContextCtor();
      audioState.masterGain = audioState.context.createGain();
      audioState.outputGain = audioState.context.createGain();
      audioState.boostedCompressor = audioState.context.createDynamicsCompressor();
      audioState.pluckedCompressor = audioState.context.createDynamicsCompressor();

      audioState.masterGain.gain.value = 1.0;
      audioState.outputGain.gain.value = audioState.outputTrim;
      configureCompressor(audioState.boostedCompressor, {
        threshold: -10,
        knee: 20,
        ratio: 2.6,
        attack: 0.004,
        release: 0.18
      });
      configureCompressor(audioState.pluckedCompressor, {
        threshold: -8,
        knee: 24,
        ratio: 3,
        attack: 0.003,
        release: 0.2
      });
      audioState.masterGain.connect(audioState.outputGain);
      audioState.outputGain.connect(audioState.context.destination);
    }

    if (audioState.context.state === "suspended") {
      await audioState.context.resume();
    }

    if (audioState.context.state !== "running") {
      setAudioStatus("locked", `Audio: ${audioState.context.state}`);
      return null;
    }

    setAudioStatus("ready", "Audio: ready");
    return audioState.context;
  } catch (error) {
    console.error("Audio unlock failed", error);
    setAudioStatus("failed", "Audio: failed");
    return null;
  }
}

function configureCompressor(compressor, settings) {
  if (!compressor) return;
  compressor.threshold.value = settings.threshold;
  compressor.knee.value = settings.knee;
  compressor.ratio.value = settings.ratio;
  compressor.attack.value = settings.attack;
  compressor.release.value = settings.release;
}

function setAudioStatus(state, text) {
  refs.audioState.textContent = text;
  refs.audioState.className = `status-pill status-${state}`;
}

function stopActiveNodes() {
  audioState.activeNodes.forEach((node) => {
    (node.sources || []).forEach((source) => {
      try { source.stop(); } catch {}
    });
    (node.nodes || []).forEach((audioNode) => {
      try { audioNode.disconnect(); } catch {}
    });
  });
  audioState.activeNodes = [];
}

async function playNote({ label, playback, diagnostic = false }) {
  if (!audioState.enabled) {
    refs.lastPlayed.textContent = "Last played: muted";
    updateDebug(label, playback);
    return;
  }

  const context = await ensureAudio();
  if (!context) {
    updateDebug(label, playback);
    return;
  }

  stopActiveNodes();

  const engine = diagnostic ? "diagnostic-low" : audioState.engine;
  const playbackNote = getPlaybackForEngine(label, playback, engine);
  const parsed = parseScientificPitch(playbackNote);
  const duration = audioState.durationMs / 1000;

  if (engine === "boosted") {
    playBoostedOscillator(context, parsed.frequency, duration);
  } else if (engine === "plucked") {
    playSoundLabPlucked(context, parsed.frequency, duration);
  } else {
    playCleanOscillator(context, parsed.frequency, duration);
  }

  refs.lastPlayed.textContent = diagnostic
    ? `Last played: ${label} diagnostic (${playbackNote})`
    : `Last played: ${label} → ${playbackNote}`;
  audioState.lastNote = { label, playback, diagnostic: engine === "diagnostic-low" };
  updateDebug(label, playbackNote, parsed.frequency, engine);
}

function getPlaybackForEngine(label, playback, engine) {
  if (engine === "diagnostic-low") return lowRegisterPlayback[label] || playback;
  return playback;
}

function trackActiveNode(activeNode, endSource) {
  audioState.activeNodes.push(activeNode);
  endSource.addEventListener("ended", () => {
    audioState.activeNodes = audioState.activeNodes.filter((node) => node !== activeNode);
    (activeNode.nodes || []).forEach((audioNode) => {
      try { audioNode.disconnect(); } catch {}
    });
  }, { once: true });
}

function playCleanOscillator(context, frequency, duration) {
  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const noteGain = context.createGain();

  oscillator.type = audioState.waveform;
  oscillator.frequency.setValueAtTime(frequency, now);

  noteGain.gain.setValueAtTime(0.0001, now);
  noteGain.gain.linearRampToValueAtTime(audioState.volume, now + 0.012);
  noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.connect(noteGain);
  noteGain.connect(audioState.masterGain);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.04);

  trackActiveNode({ sources: [oscillator], nodes: [oscillator, noteGain] }, oscillator);
}

function playBoostedOscillator(context, frequency, duration) {
  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const filter = context.createBiquadFilter();
  const noteGain = context.createGain();

  oscillator.type = audioState.waveform;
  oscillator.frequency.setValueAtTime(frequency, now);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(7200, now);
  filter.Q.setValueAtTime(0.65, now);

  const peak = Math.min(audioState.volume * 1.35, 0.86);
  noteGain.gain.setValueAtTime(0.0001, now);
  noteGain.gain.linearRampToValueAtTime(peak, now + 0.01);
  noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.connect(filter);
  filter.connect(noteGain);
  noteGain.connect(audioState.boostedCompressor);
  audioState.boostedCompressor.connect(audioState.outputGain);

  oscillator.start(now);
  oscillator.stop(now + duration + 0.04);

  trackActiveNode({
    sources: [oscillator],
    nodes: [oscillator, filter, noteGain, audioState.boostedCompressor]
  }, oscillator);
}

function playSoundLabPlucked(context, frequency, duration) {
  const now = context.currentTime;
  const endTime = now + duration;
  const osc1 = context.createOscillator();
  const osc2 = context.createOscillator();
  const osc3 = context.createOscillator();
  const osc1Gain = context.createGain();
  const osc2Gain = context.createGain();
  const osc3Gain = context.createGain();
  const filter = context.createBiquadFilter();
  const envelopeGain = context.createGain();

  osc1.type = "triangle";
  osc2.type = "sine";
  osc3.type = "sine";
  osc1.frequency.setValueAtTime(frequency, now);
  osc2.frequency.setValueAtTime(frequency, now);
  osc3.frequency.setValueAtTime(frequency * 2, now);
  osc2.detune.setValueAtTime(-3, now);

  osc1Gain.gain.setValueAtTime(0.82, now);
  osc2Gain.gain.setValueAtTime(0.24, now);
  osc3Gain.gain.setValueAtTime(0.12, now);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(6500, now);
  filter.frequency.exponentialRampToValueAtTime(2800, now + 0.28);
  filter.Q.setValueAtTime(0.7, now);

  const peak = Math.min(Math.max(audioState.volume * 1.55, 0.48), 0.98);
  const sustain = peak * 0.68;
  envelopeGain.gain.setValueAtTime(0.0001, now);
  envelopeGain.gain.exponentialRampToValueAtTime(peak, now + 0.018);
  envelopeGain.gain.exponentialRampToValueAtTime(sustain, now + 0.16);
  envelopeGain.gain.setValueAtTime(sustain, Math.max(now + 0.18, endTime - 0.12));
  envelopeGain.gain.exponentialRampToValueAtTime(0.0001, endTime);

  osc1.connect(osc1Gain);
  osc2.connect(osc2Gain);
  osc3.connect(osc3Gain);
  osc1Gain.connect(filter);
  osc2Gain.connect(filter);
  osc3Gain.connect(filter);
  filter.connect(envelopeGain);
  envelopeGain.connect(audioState.pluckedCompressor);
  audioState.pluckedCompressor.connect(audioState.outputGain);

  osc1.start(now);
  osc2.start(now);
  osc3.start(now);
  osc1.stop(endTime + 0.06);
  osc2.stop(endTime + 0.06);
  osc3.stop(endTime + 0.06);

  trackActiveNode({
    sources: [osc1, osc2, osc3],
    nodes: [osc1, osc2, osc3, osc1Gain, osc2Gain, osc3Gain, filter, envelopeGain, audioState.pluckedCompressor]
  }, osc1);
}

function updateDebug(label, playback, frequency = null, engine = audioState.engine) {
  refs.labelNote.textContent = label;
  refs.playbackNote.textContent = playback;
  const freq = frequency ?? parseScientificPitch(playback).frequency;
  refs.frequencyReadout.textContent = `${freq.toFixed(2)} Hz`;
  refs.engineReadout.textContent = engineLabels[engine] || engine;
}

function renderNoteGrid() {
  refs.noteGrid.innerHTML = "";
  noteItems.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "note-button";
    button.innerHTML = `
      <span class="note-name">${item.label}</span>
      <span class="note-role">${item.interval}</span>
      <span class="note-scale">${item.scale}</span>
    `;
    button.addEventListener("click", () => playNote(item));
    refs.noteGrid.appendChild(button);
  });
}

function syncControls() {
  audioState.enabled = refs.soundToggle.checked;
  audioState.volume = Number(refs.volumeControl.value);
  audioState.durationMs = Number(refs.durationControl.value);
  audioState.waveform = refs.waveformSelect.value;
  audioState.engine = refs.engineSelect.value;
  audioState.outputTrim = Number(refs.outputTrimControl.value);

  refs.volumeReadout.textContent = `${Math.round(audioState.volume * 100)}%`;
  refs.durationReadout.textContent = `${audioState.durationMs} ms`;
  refs.outputTrimReadout.textContent = `${audioState.outputTrim.toFixed(2)}x`;
  refs.engineReadout.textContent = engineLabels[audioState.engine] || audioState.engine;
  refs.loudnessNote.textContent = audioState.engine === "diagnostic-low"
    ? "Diagnostic Low Register uses the actual low octave. Do not use this as the learner-facing default without mobile speaker QA."
    : "If this engine is too quiet on mobile, reject it for production.";

  if (audioState.outputGain) {
    audioState.outputGain.gain.setTargetAtTime(audioState.outputTrim, audioState.context.currentTime, 0.02);
  }

  if (!audioState.enabled) {
    stopActiveNodes();
    refs.lastPlayed.textContent = "Last played: muted";
  }
}

refs.enableSound.addEventListener("click", async () => {
  syncControls();
  await ensureAudio();
});

refs.soundToggle.addEventListener("change", syncControls);
refs.volumeControl.addEventListener("input", syncControls);
refs.durationControl.addEventListener("input", syncControls);
refs.waveformSelect.addEventListener("change", syncControls);
refs.engineSelect.addEventListener("change", syncControls);
refs.outputTrimControl.addEventListener("input", syncControls);
refs.replayLastNote.addEventListener("click", () => {
  if (!audioState.lastNote) {
    refs.lastPlayed.textContent = "Last played: choose a note first";
    return;
  }
  playNote(audioState.lastNote);
});
refs.lowRegisterTest.addEventListener("click", () => playNote({
  label: "A",
  playback: "A2",
  diagnostic: true
}));

window.addEventListener("pagehide", stopActiveNodes);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") stopActiveNodes();
});

renderNoteGrid();
syncControls();
updateDebug("A", "A4", 440);
