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

const audioState = {
  context: null,
  masterGain: null,
  activeNodes: [],
  enabled: true,
  volume: 0.22,
  durationMs: 350,
  waveform: "triangle"
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
  labelNote: document.getElementById("labelNote"),
  playbackNote: document.getElementById("playbackNote"),
  frequencyReadout: document.getElementById("frequencyReadout"),
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
      audioState.masterGain.gain.value = audioState.volume;
      audioState.masterGain.connect(audioState.context.destination);
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

function setAudioStatus(state, text) {
  refs.audioState.textContent = text;
  refs.audioState.className = `status-pill status-${state}`;
}

function stopActiveNodes() {
  audioState.activeNodes.forEach((node) => {
    try {
      node.oscillator.stop();
    } catch {
      // Already stopped.
    }
    try {
      node.oscillator.disconnect();
      node.noteGain.disconnect();
    } catch {
      // Already disconnected.
    }
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

  const parsed = parseScientificPitch(playback);
  const now = context.currentTime;
  const duration = audioState.durationMs / 1000;
  const oscillator = context.createOscillator();
  const noteGain = context.createGain();

  oscillator.type = audioState.waveform;
  oscillator.frequency.setValueAtTime(parsed.frequency, now);

  noteGain.gain.setValueAtTime(0.0001, now);
  noteGain.gain.linearRampToValueAtTime(audioState.volume, now + 0.012);
  noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.connect(noteGain);
  noteGain.connect(audioState.masterGain);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.04);

  const activeNode = { oscillator, noteGain };
  audioState.activeNodes.push(activeNode);
  oscillator.addEventListener("ended", () => {
    audioState.activeNodes = audioState.activeNodes.filter((node) => node !== activeNode);
    try {
      oscillator.disconnect();
      noteGain.disconnect();
    } catch {
      // Already disconnected.
    }
  });

  refs.lastPlayed.textContent = diagnostic
    ? `Last played: ${label} diagnostic (${playback})`
    : `Last played: ${label} → ${playback}`;
  updateDebug(label, playback, parsed.frequency);
}

function updateDebug(label, playback, frequency = null) {
  refs.labelNote.textContent = label;
  refs.playbackNote.textContent = playback;
  const freq = frequency ?? parseScientificPitch(playback).frequency;
  refs.frequencyReadout.textContent = `${freq.toFixed(2)} Hz`;
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

  refs.volumeReadout.textContent = `${Math.round(audioState.volume * 100)}%`;
  refs.durationReadout.textContent = `${audioState.durationMs} ms`;

  if (audioState.masterGain) {
    audioState.masterGain.gain.setTargetAtTime(audioState.volume, audioState.context.currentTime, 0.02);
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
