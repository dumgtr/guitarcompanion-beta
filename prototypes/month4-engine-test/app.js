"use strict";

const capstoneVisual = {
  id: "m4-w16-overlay-synthesis-map",
  type: "chord-tone-overlay",
  title: "Month 4 Capstone Atlas: Combined Scale Geography",
  caption: "แผนที่รวม Skeleton, Meat, Major/Minor color และ b5 tension ในพื้นที่ Root A เดิม",
  config: {
    startFret: 4,
    endFret: 8,
    showNut: false
  },
  legend: [
    { type: "skeleton-root", label: "1 / Root" },
    { type: "color-third-major", label: "3 / Major color" },
    { type: "color-third-minor", label: "b3 / Minor color" },
    { type: "skeleton-fifth", label: "5 / Stable landing" },
    { type: "meat", label: "2 / 4 / 6 / b7" },
    { type: "tension", label: "b5 / Blues tension" }
  ],
  responsiveFallback: {
    threshold: 320,
    layers: [
      { id: "skeleton", title: "Skeleton Layer", roles: ["skeleton", "major-color", "minor-color"] },
      { id: "meat", title: "Meat Layer", roles: ["meat"] },
      { id: "tension", title: "Tension Layer", roles: ["tension"] }
    ]
  },
  dots: [
    { string: 6, fret: 5, label: "A", degree: "1", toneRole: "skeleton", type: "skeleton-root" },
    { string: 6, fret: 7, label: "B", degree: "2", toneRole: "meat", type: "meat" },
    { string: 6, fret: 8, label: "C", degree: "b3", toneRole: "minor-color", type: "color-third-minor" },
    { string: 5, fret: 4, label: "C#", degree: "3", toneRole: "major-color", type: "color-third-major" },
    { string: 5, fret: 5, label: "D", degree: "4", toneRole: "meat", type: "meat" },
    { string: 5, fret: 6, label: "Eb", degree: "b5", toneRole: "tension", type: "tension" },
    { string: 5, fret: 7, label: "E", degree: "5", toneRole: "skeleton", type: "skeleton-fifth" },
    { string: 4, fret: 4, label: "F#", degree: "6", toneRole: "meat", type: "meat" },
    { string: 4, fret: 5, label: "G", degree: "b7", toneRole: "meat", type: "meat" },
    { string: 4, fret: 7, label: "A", degree: "1", toneRole: "skeleton", type: "skeleton-root" },
    { string: 3, fret: 4, label: "B", degree: "2", toneRole: "meat", type: "meat" },
    { string: 3, fret: 5, label: "C", degree: "b3", toneRole: "minor-color", type: "color-third-minor" },
    { string: 3, fret: 6, label: "C#", degree: "3", toneRole: "major-color", type: "color-third-major" },
    { string: 3, fret: 7, label: "D", degree: "4", toneRole: "meat", type: "meat" },
    { string: 3, fret: 8, label: "Eb", degree: "b5", toneRole: "tension", type: "tension" },
    { string: 2, fret: 5, label: "E", degree: "5", toneRole: "skeleton", type: "skeleton-fifth" },
    { string: 2, fret: 7, label: "F#", degree: "6", toneRole: "meat", type: "meat" },
    { string: 2, fret: 8, label: "G", degree: "b7", toneRole: "meat", type: "meat" },
    { string: 1, fret: 5, label: "A", degree: "1", toneRole: "skeleton", type: "skeleton-root" },
    { string: 1, fret: 7, label: "B", degree: "2", toneRole: "meat", type: "meat" },
    { string: 1, fret: 8, label: "C", degree: "b3", toneRole: "minor-color", type: "color-third-minor" }
  ]
};

const earTrainingLab = {
  id: "m4-scale-ear-parser-test",
  type: "ear-training-lab",
  title: "A Minor Pentatonic Pitch Parser Test",
  phrases: {
    normal: ["A2", "C3", "D3", "E3", "G3", "E3", "C3", "A2"],
    up: ["A3", "C4", "D4", "E4", "G4", "E4", "C4", "A3"]
  },
  parserSamples: ["A2", "C3", "D3", "Eb3", "E3", "G3", "C#3"],
  noteDuration: 0.28
};

const techniqueDrills = [
  {
    id: "m4-w16-capstone-drill",
    type: "technique-drill",
    title: "15-Minute Capstone Phrasing Workout",
    tempo: 72,
    skill: "scale-atlas-synthesis",
    setup: [
      "ตั้ง Root A สาย 6 เฟรต 5 เป็นบ้าน",
      "อยู่ใน E-Shape region เดิมเท่านั้น",
      "เลือก phrase สั้น 3-6 โน้ต แล้วหยุดพัก"
    ],
    rules: [
      "Bar 1 ใช้ Major color",
      "Bar 2 เว้น space",
      "Bar 3 ใช้ Minor color และแตะ b5 ได้ 1 ครั้ง",
      "Bar 4 resolve ลง chord tone",
      "ห้ามเปิด Box 2-5"
    ],
    steps: [
      "ชี้ Root A, C#, C, E, Eb บนแผนที่ก่อนเล่น",
      "เล่น guided phrase ช้าๆ แล้วหยุดฟังหลังแต่ละ bar",
      "สร้าง phrase เองโดยใช้โครง Major call → Rest → Minor response + b5 → Resolve"
    ]
  }
];

const lessonBlocks = [
  { type: "technique-drill", drillRef: "m4-w16-capstone-drill" }
];

let audioCtx = null;
let masterGain = null;
let outputGain = null;
let gentleCompressor = null;
let activeNodes = [];
const activeTimers = new Set();

function createElement(tagName, className, textContent) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (textContent !== undefined) element.textContent = textContent;
  return element;
}

function parseScientificPitch(noteName) {
  const match = /^([A-Ga-g])([#b]?)(-?\d+)$/.exec(noteName.trim());
  if (!match) {
    throw new Error(`Invalid scientific pitch notation: ${noteName}`);
  }

  const [, rawLetter, accidental, rawOctave] = match;
  const letter = rawLetter.toUpperCase();
  const octave = Number(rawOctave);
  const semitoneMap = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  let midi = (octave + 1) * 12 + semitoneMap[letter];

  if (accidental === "#") midi += 1;
  if (accidental === "b") midi -= 1;

  const frequency = 440 * 2 ** ((midi - 69) / 12);
  return {
    note: noteName,
    midi,
    frequency: Number(frequency.toFixed(2))
  };
}

function renderPitchList() {
  const list = document.getElementById("pitchList");
  if (!list) return;
  list.innerHTML = "";
  earTrainingLab.parserSamples.forEach((note) => {
    const parsed = parseScientificPitch(note);
    const item = createElement("li", "", `${parsed.note}: MIDI ${parsed.midi}, ${parsed.frequency} Hz`);
    list.appendChild(item);
  });
}

function renderLegend(legend) {
  const container = createElement("div", "legend");
  legend.forEach((item) => {
    const chip = createElement("span", `tone-${item.type}`, item.label);
    container.appendChild(chip);
  });
  return container;
}

function createFretboardGrid(visual, dots) {
  const startFret = visual.config.startFret;
  const endFret = visual.config.endFret;
  const fretCount = endFret - startFret + 1;
  const stringNames = ["e", "B", "G", "D", "A", "E"];

  const wrapper = createElement("div", "fretboard-wrap fretboard-map");
  const shell = createElement("div", "fretboard-shell");
  const labels = createElement("div", "string-labels");
  const grid = createElement("div", "fretboard-grid");
  grid.style.setProperty("--fret-count", String(fretCount));

  for (let stringNumber = 1; stringNumber <= 6; stringNumber += 1) {
    const label = createElement("div", "string-label", stringNames[stringNumber - 1]);
    label.style.gridRow = String(stringNumber);
    labels.appendChild(label);

    const stringLine = createElement("div", `string-line string-line--${stringNumber}`);
    stringLine.style.gridRow = String(stringNumber);
    grid.appendChild(stringLine);
  }

  dots.forEach((dot) => {
    const dotElement = createElement("div", `fret-dot tone-${dot.type}`);
    const label = createElement("span", "", dot.label);
    const degree = createElement("small", "", dot.degree);
    label.appendChild(degree);
    dotElement.appendChild(label);
    dotElement.style.gridRow = String(dot.string);
    dotElement.style.gridColumn = String(dot.fret - startFret + 1);
    dotElement.setAttribute(
      "aria-label",
      `${dot.label}, degree ${dot.degree}, string ${dot.string}, fret ${dot.fret}`
    );
    grid.appendChild(dotElement);
  });

  shell.append(labels, grid);
  wrapper.appendChild(shell);

  const fretNumbers = createElement("div", "fret-numbers");
  fretNumbers.appendChild(createElement("div", ""));
  const fretNumberTrack = createElement("div", "fret-number-track");
  fretNumberTrack.style.setProperty("--fret-count", String(fretCount));
  for (let fret = startFret; fret <= endFret; fret += 1) {
    fretNumberTrack.appendChild(createElement("span", "", String(fret)));
  }
  fretNumbers.appendChild(fretNumberTrack);
  wrapper.appendChild(fretNumbers);

  return wrapper;
}

function renderFretboardVisual(visual, mount) {
  const card = createElement("article", "fretboard-card responsive-fretboard");
  card.appendChild(createElement("h3", "", visual.title));
  card.appendChild(createElement("p", "fretboard-caption", visual.caption));
  card.appendChild(
    createElement(
      "p",
      "orientation-note",
      "Orientation Rule v2: สาย 1 / High e อยู่ด้านบน และสาย 6 / Low E อยู่ด้านล่าง เหมือน TAB"
    )
  );
  card.appendChild(renderLegend(visual.legend));

  const unified = createElement("div", "unified-fretboard");
  unified.appendChild(createFretboardGrid(visual, visual.dots));
  card.appendChild(unified);

  const fallback = createElement("div", "layered-fallback");
  fallback.appendChild(
    createElement(
      "p",
      "fallback-note",
      "หน้าจอแคบกว่า 320px: ระบบแตกแผนที่แน่นๆ เป็นชั้นย่อย เพื่อไม่ให้ผู้เรียนต้องอ่านทุกอย่างพร้อมกัน"
    )
  );

  visual.responsiveFallback.layers.forEach((layer) => {
    const layerDots = visual.dots.filter((dot) => layer.roles.includes(dot.toneRole));
    const layerCard = createElement("article", "layer-card");
    layerCard.appendChild(createElement("h4", "", layer.title));
    layerCard.appendChild(createFretboardGrid(visual, layerDots));
    fallback.appendChild(layerCard);
  });

  card.appendChild(fallback);
  mount.innerHTML = "";
  mount.appendChild(card);
  observeFretboardFallback(card, visual.responsiveFallback.threshold);
}

function observeFretboardFallback(card, threshold) {
  const update = (width) => {
    card.classList.toggle("is-fallback", width < threshold);
  };

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => update(entry.contentRect.width));
    });
    observer.observe(card);
  } else {
    const onResize = () => update(card.getBoundingClientRect().width);
    window.addEventListener("resize", onResize);
    onResize();
  }
}

function renderTechniqueDrill(block, mount) {
  const drill = techniqueDrills.find((item) => item.id === block.drillRef);
  mount.innerHTML = "";

  if (!drill) {
    mount.appendChild(createElement("p", "fallback-note", `ไม่พบ technique drill: ${block.drillRef}`));
    return;
  }

  const card = createElement("article", "block-technique-drill");
  card.appendChild(createElement("div", "block-label", "Technique Drill"));
  card.appendChild(createElement("h3", "", drill.title));

  const meta = createElement("div", "drill-meta");
  meta.appendChild(createElement("span", "status-chip", `${drill.tempo} BPM`));
  meta.appendChild(createElement("span", "status-chip", drill.skill));
  card.appendChild(meta);

  card.appendChild(createElement("p", "", "Setup"));
  const setupList = createElement("ul", "");
  drill.setup.forEach((item) => setupList.appendChild(createElement("li", "", item)));
  card.appendChild(setupList);

  card.appendChild(createElement("p", "", "Rules"));
  const ruleList = createElement("ul", "");
  drill.rules.forEach((item) => ruleList.appendChild(createElement("li", "", item)));
  card.appendChild(ruleList);

  card.appendChild(createElement("p", "", "Steps"));
  const stepList = createElement("ol", "");
  drill.steps.forEach((item) => stepList.appendChild(createElement("li", "", item)));
  card.appendChild(stepList);

  mount.appendChild(card);
}


function getMasterVolume() {
  const slider = document.getElementById("outputVolume");
  const value = slider ? Number(slider.value) : 0.9;
  return Number.isFinite(value) ? Math.min(1.2, Math.max(0.1, value)) : 0.9;
}

function getRegisterMode() {
  return document.querySelector('input[name="auditionRegister"]:checked')?.value || "normal";
}

function isCompressorEnabled() {
  return Boolean(document.getElementById("useCompressor")?.checked);
}

function getOutputGainValue() {
  return 1.25;
}

function shiftNoteOctave(noteString, octaveShift) {
  if (!octaveShift) return noteString;
  return noteString.replace(/(-?\d+)$/, (octave) => String(Number(octave) + octaveShift));
}

function withSelectedRegister(noteString) {
  return shiftNoteOctave(noteString, getRegisterMode() === "up" ? 1 : 0);
}

function getAudioStatusDetails() {
  const state = audioCtx ? audioCtx.state : "not initialized";
  const volume = Math.round(getMasterVolume() * 100);
  const register = getRegisterMode() === "up" ? "+1 octave" : "normal";
  const compressor = isCompressorEnabled() ? "on" : "off";
  return `state: ${state} | volume: ${volume}% | register: ${register} | compressor: ${compressor} | outputGain: ${getOutputGainValue()}`;
}

function setAudioStatus(message) {
  const status = document.getElementById("audioStatus");
  if (!status) return;
  status.textContent = `${message} | ${getAudioStatusDetails()}`;
}

function updateVolumeReadout() {
  const volume = getMasterVolume();
  const readout = document.getElementById("volumeReadout");
  if (readout) readout.textContent = `${Math.round(volume * 100)}%`;

  if (audioCtx && masterGain) {
    masterGain.gain.setTargetAtTime(volume, audioCtx.currentTime, 0.01);
  }
}

function configureCompressor() {
  if (!gentleCompressor) return;
  gentleCompressor.threshold.value = -6;
  gentleCompressor.knee.value = 24;
  gentleCompressor.ratio.value = 3;
  gentleCompressor.attack.value = 0.003;
  gentleCompressor.release.value = 0.2;
}

function connectOutputChain() {
  if (!audioCtx || !masterGain || !outputGain) return;

  try {
    masterGain.disconnect();
  } catch (error) {
    // It may not be connected yet.
  }
  try {
    gentleCompressor?.disconnect();
  } catch (error) {
    // It may not be connected yet.
  }
  try {
    outputGain.disconnect();
  } catch (error) {
    // It may not be connected yet.
  }

  outputGain.gain.setValueAtTime(getOutputGainValue(), audioCtx.currentTime);

  if (isCompressorEnabled() && gentleCompressor) {
    configureCompressor();
    masterGain.connect(gentleCompressor);
    gentleCompressor.connect(outputGain);
  } else {
    masterGain.connect(outputGain);
  }

  outputGain.connect(audioCtx.destination);
}

async function ensureAudioContext() {
  let didCreateContext = false;

  if (!audioCtx) {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) {
      throw new Error("This browser does not support Web Audio API.");
    }

    audioCtx = new AudioCtor();
    masterGain = audioCtx.createGain();
    outputGain = audioCtx.createGain();
    gentleCompressor = audioCtx.createDynamicsCompressor();
    masterGain.gain.setValueAtTime(getMasterVolume(), audioCtx.currentTime);
    connectOutputChain();
    didCreateContext = true;
  }

  if (audioCtx.state === "suspended") {
    await audioCtx.resume();
  }

  updateVolumeReadout();
  if (didCreateContext) connectOutputChain();
  return audioCtx;
}

function stopAllSounds(message = "Stopped.") {
  activeTimers.forEach((timeoutId) => clearTimeout(timeoutId));
  activeTimers.clear();

  activeNodes.forEach((node) => {
    try {
      node.osc1.stop();
    } catch (error) {
      // Oscillator may already be stopped.
    }

    try {
      node.osc2.stop();
    } catch (error) {
      // Oscillator may already be stopped.
    }

    try {
      node.filter.disconnect();
      node.envelopeGain.disconnect();
    } catch (error) {
      // Nodes may already be disconnected.
    }
  });
  activeNodes = [];
  setAudioStatus(message);
}

async function playPluckedString(noteString, timeOffset = 0, duration = 1.2) {
  const context = await ensureAudioContext();
  const { frequency } = parseScientificPitch(noteString);
  const startTime = context.currentTime + timeOffset;
  const osc1 = context.createOscillator();
  const osc2 = context.createOscillator();
  const filter = context.createBiquadFilter();
  const envelopeGain = context.createGain();

  osc1.type = "triangle";
  osc2.type = "sine";
  osc1.frequency.setValueAtTime(frequency, startTime);
  osc2.frequency.setValueAtTime(frequency, startTime);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(3500, startTime);
  filter.frequency.exponentialRampToValueAtTime(700, startTime + duration);

  envelopeGain.gain.setValueAtTime(0, startTime);
  envelopeGain.gain.linearRampToValueAtTime(0.9, startTime + 0.015);
  envelopeGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(envelopeGain);
  envelopeGain.connect(masterGain);

  osc1.start(startTime);
  osc2.start(startTime);
  osc1.stop(startTime + duration + 0.04);
  osc2.stop(startTime + duration + 0.04);

  const activeNode = { osc1, osc2, filter, envelopeGain };
  activeNodes.push(activeNode);

  const cleanup = () => {
    activeNodes = activeNodes.filter((node) => node !== activeNode);
    try {
      filter.disconnect();
      envelopeGain.disconnect();
    } catch (error) {
      // Nodes may already be disconnected by stopAllSounds().
    }
  };

  osc2.addEventListener("ended", cleanup, { once: true });
}

async function playTestBeep(baseNote = "A2") {
  try {
    const note = withSelectedRegister(baseNote);
    await playPluckedString(note, 0, 1);
    setAudioStatus(`Playing: ${note}`);
  } catch (error) {
    console.error("Test beep failed", error);
    setAudioStatus(`Audio error: ${error.message}`);
  }
}

async function playMinorPhrase() {
  try {
    const basePhrase = ["A2", "C3", "D3", "Eb3", "E3", "G3", "A3"];
    const phrase = basePhrase.map(withSelectedRegister);

    phrase.forEach((note, index) => {
      void playPluckedString(note, index * 0.35, 0.75).catch((error) => {
        console.error("Phrase note failed", error);
        setAudioStatus(`Audio error: ${error.message}`);
      });

      const statusTimer = window.setTimeout(() => {
        activeTimers.delete(statusTimer);
        setAudioStatus(`Playing: ${note}`);
      }, index * 350);
      activeTimers.add(statusTimer);
    });

    const doneTimer = window.setTimeout(() => {
      activeTimers.delete(doneTimer);
      setAudioStatus("Phrase complete.");
    }, phrase.length * 350 + 520);
    activeTimers.add(doneTimer);

    setAudioStatus(`Playing phrase: ${phrase.join(" -> ")}`);
  } catch (error) {
    console.error("Phrase playback failed", error);
    setAudioStatus(`Audio error: ${error.message}`);
  }
}

function cleanupAudioForPageExit() {
  stopAllSounds("Stopped: page hidden/unloaded.");
}

function bootSandbox() {
  renderPitchList();
  updateVolumeReadout();
  setAudioStatus("Ready. Press Test beep or Play Phrase.");

  const fretboardMount = document.getElementById("fretboardMount");
  if (fretboardMount) renderFretboardVisual(capstoneVisual, fretboardMount);

  const drillMount = document.getElementById("drillMount");
  if (drillMount) renderTechniqueDrill(lessonBlocks[0], drillMount);

  document.getElementById("outputVolume")?.addEventListener("input", () => {
    updateVolumeReadout();
    setAudioStatus("Volume updated.");
  });

  document.querySelectorAll('input[name="auditionRegister"]').forEach((input) => {
    input.addEventListener("change", () => {
      setAudioStatus("Register updated.");
    });
  });

  document.getElementById("useCompressor")?.addEventListener("change", () => {
    connectOutputChain();
    setAudioStatus("Compressor routing updated.");
  });

  document.getElementById("testBeep")?.addEventListener("click", async () => {
    stopAllSounds("Preparing test beep A2...");
    await playTestBeep("A2");
  });

  document.getElementById("testBeepA4")?.addEventListener("click", async () => {
    stopAllSounds("Preparing test beep A4...");
    await playTestBeep("A4");
  });

  document.getElementById("playMinorPhrase")?.addEventListener("click", async () => {
    stopAllSounds("Preparing phrase...");
    await playMinorPhrase();
  });

  document.getElementById("stopAudio")?.addEventListener("click", () => {
    stopAllSounds("Stopped.");
  });

  window.addEventListener("pagehide", cleanupAudioForPageExit);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      cleanupAudioForPageExit();
    }
  });
}

document.addEventListener("DOMContentLoaded", bootSandbox);
