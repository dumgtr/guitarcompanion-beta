"use strict";

const fretboardMock = {
  id: "m3-engine-open-cmaj7-overlay",
  type: "chord-tone-overlay",
  title: "Open Cmaj7: Chord Tone Overlay",
  caption: "ทดสอบ fret: 0 ด้วย open strings และแยกสี Root / 3rd / 5th / 7th สำหรับ Month 3.",
  config: {
    startFret: 1,
    endFret: 5,
    showNut: true
  },
  legend: [
    { tone: "root", label: "Root / 1" },
    { tone: "third", label: "3rd / สีของคอร์ด" },
    { tone: "fifth", label: "5th / เสียงพยุง" },
    { tone: "seventh", label: "7th / สีเพิ่ม" }
  ],
  dots: [
    { string: 5, fret: 3, label: "C", degree: "1", tone: "root" },
    { string: 4, fret: 2, label: "E", degree: "3", tone: "third" },
    { string: 3, fret: 0, label: "G", degree: "5", tone: "fifth" },
    { string: 2, fret: 0, label: "B", degree: "7", tone: "seventh" },
    { string: 1, fret: 0, label: "E", degree: "3", tone: "third" }
  ]
};

const progressionMock = {
  id: "m3-engine-cfgc-loop",
  type: "progression-lab",
  title: "C -> F -> G -> C Progression Lab",
  bpm: 70,
  beatsPerChord: 4,
  chords: [
    { name: "C", role: "Home", notes: ["C4", "E4", "G4"], targetNext: "A" },
    { name: "F", role: "Away", notes: ["F3", "A3", "C4"], targetNext: "B" },
    { name: "G", role: "Pull", notes: ["G3", "B3", "D4"], targetNext: "E" },
    { name: "C", role: "Home", notes: ["C4", "E4", "G4"], targetNext: null }
  ]
};

const noteFrequencies = {
  C3: 130.81,
  D3: 146.83,
  E3: 164.81,
  F3: 174.61,
  G3: 196.0,
  A3: 220.0,
  B3: 246.94,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88
};

let audioContext = null;
let masterGain = null;
let progressionTimer = null;
let progressionIndex = 0;
let isProgressionRunning = false;
const activeOscillators = new Set();

function createElement(tagName, className, textContent) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (textContent) element.textContent = textContent;
  return element;
}

function renderFretboardVisual(visual, mount) {
  const startFret = Math.max(1, visual.config.startFret || 1);
  const endFret = visual.config.endFret || 5;
  const fretCount = endFret - startFret + 1;
  const stringNames = ["e", "B", "G", "D", "A", "E"];

  const card = createElement("article", "fretboard-card");
  card.appendChild(createElement("h3", "", visual.title));
  card.appendChild(createElement("p", "fretboard-caption", visual.caption));
  card.appendChild(
    createElement(
      "p",
      "orientation-note",
      "TAB-style orientation: สาย 1 / High e อยู่ด้านบน และสาย 6 / Low E อยู่ด้านล่าง"
    )
  );

  const shell = createElement("div", "fretboard-shell");
  const labels = createElement("div", "string-labels");
  const openLane = createElement("div", "open-string-lane");
  const grid = createElement("div", "fretboard-grid");
  grid.style.setProperty("--fret-count", String(fretCount));

  for (let stringNumber = 1; stringNumber <= 6; stringNumber += 1) {
    const label = createElement("div", "string-label", stringNames[stringNumber - 1]);
    label.style.gridRow = String(stringNumber);
    labels.appendChild(label);

    const openLine = createElement("div", `string-line string-line--${stringNumber}`);
    openLine.style.gridRow = String(stringNumber);
    openLane.appendChild(openLine);

    const gridLine = createElement("div", `string-line string-line--${stringNumber}`);
    gridLine.style.gridRow = String(stringNumber);
    grid.appendChild(gridLine);
  }

  visual.dots.forEach((dot) => {
    const dotElement = createElement("div", `fret-dot tone-${dot.tone}`);
    const label = createElement("span", "", dot.label);
    const degree = createElement("small", "", dot.degree);
    label.appendChild(degree);
    dotElement.appendChild(label);
    dotElement.setAttribute("aria-label", `${dot.label}, degree ${dot.degree}, string ${dot.string}, fret ${dot.fret}`);
    dotElement.style.gridRow = String(dot.string);

    if (dot.fret === 0) {
      dotElement.classList.add("open-dot");
      dotElement.style.gridColumn = "1";
      openLane.appendChild(dotElement);
      return;
    }

    dotElement.style.gridColumn = String(dot.fret - startFret + 1);
    grid.appendChild(dotElement);
  });

  shell.append(labels, openLane, grid);
  card.appendChild(shell);

  const fretNumbers = createElement("div", "fret-numbers");
  fretNumbers.appendChild(createElement("div", "", ""));
  fretNumbers.appendChild(createElement("div", "string-label", "0"));
  const numberGrid = createElement("div", "fret-number-grid");
  numberGrid.style.setProperty("--fret-count", String(fretCount));
  for (let fret = startFret; fret <= endFret; fret += 1) {
    numberGrid.appendChild(createElement("span", "", String(fret)));
  }
  fretNumbers.appendChild(numberGrid);
  card.appendChild(fretNumbers);

  const legend = createElement("div", "legend");
  visual.legend.forEach((item) => {
    const legendItem = createElement("span", "legend-item");
    legendItem.appendChild(createElement("span", `legend-swatch tone-${item.tone}`));
    legendItem.appendChild(createElement("span", "", item.label));
    legend.appendChild(legendItem);
  });
  card.appendChild(legend);

  mount.replaceChildren(card);
}

function ensureAudioContext() {
  if (!audioContext) {
    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContextConstructor();

    const compressor = audioContext.createDynamicsCompressor();
    compressor.threshold.value = -24;
    compressor.knee.value = 24;
    compressor.ratio.value = 4;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.18;

    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.18;
    masterGain.connect(compressor);
    compressor.connect(audioContext.destination);
  }

  return audioContext;
}

function playChord(noteNames, durationSeconds = 2.7) {
  const context = ensureAudioContext();
  const now = context.currentTime;
  const chordGain = context.createGain();
  chordGain.gain.setValueAtTime(0.0001, now);
  chordGain.gain.exponentialRampToValueAtTime(0.9, now + 0.025);
  chordGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSeconds);
  chordGain.connect(masterGain);

  noteNames.forEach((noteName, index) => {
    const oscillator = context.createOscillator();
    oscillator.type = "triangle";
    oscillator.frequency.value = noteFrequencies[noteName];
    oscillator.detune.value = (index - 1) * 2.5;
    oscillator.connect(chordGain);
    oscillator.start(now);
    oscillator.stop(now + durationSeconds + 0.05);
    activeOscillators.add(oscillator);
    oscillator.addEventListener("ended", () => activeOscillators.delete(oscillator));
  });

  window.setTimeout(() => chordGain.disconnect(), (durationSeconds + 0.2) * 1000);
}

function stopActiveAudio() {
  activeOscillators.forEach((oscillator) => {
    try {
      oscillator.stop();
    } catch {
      // Oscillator may already be stopped by the envelope.
    }
  });
  activeOscillators.clear();
}

function setActiveProgressionStep(index) {
  document.querySelectorAll(".progression-step").forEach((step, stepIndex) => {
    step.classList.toggle("is-active", stepIndex === index);
  });
}

async function startProgressionLoop(data) {
  const context = ensureAudioContext();
  await context.resume();
  isProgressionRunning = true;
  progressionIndex = 0;

  const stepDurationSeconds = (60 / data.bpm) * data.beatsPerChord;

  const playStep = () => {
    if (!isProgressionRunning) return;
    const chord = data.chords[progressionIndex];
    setActiveProgressionStep(progressionIndex);
    playChord(chord.notes, stepDurationSeconds * 0.82);
    progressionIndex = (progressionIndex + 1) % data.chords.length;
    progressionTimer = window.setTimeout(playStep, stepDurationSeconds * 1000);
  };

  playStep();
}

function stopProgressionLoop(statusElement) {
  isProgressionRunning = false;
  window.clearTimeout(progressionTimer);
  stopActiveAudio();
  setActiveProgressionStep(-1);
  if (statusElement) statusElement.textContent = "Stopped. กด Start เพื่อทดสอบ loop อีกครั้ง";
}

function renderProgressionLab(data, mount) {
  const lab = createElement("article", "progression-lab");
  lab.appendChild(createElement("h3", "", data.title));
  lab.appendChild(
    createElement(
      "p",
      "progression-status",
      `Tempo ${data.bpm} BPM, ${data.beatsPerChord} beats per chord. Audio starts only after pressing Start.`
    )
  );

  const timeline = createElement("div", "progression-timeline");
  data.chords.forEach((chord, index) => {
    const step = createElement("div", "progression-step");
    step.dataset.index = String(index);
    const chordName = createElement("strong", "", chord.name);
    const role = createElement("span", "", chord.targetNext ? `${chord.role} -> target ${chord.targetNext}` : chord.role);
    step.append(chordName, role);
    timeline.appendChild(step);
  });
  lab.appendChild(timeline);

  const status = createElement("p", "progression-status", "Ready. กด Start เพื่อเริ่ม C -> F -> G -> C loop.");
  const controls = createElement("div", "progression-controls");
  const startButton = createElement("button", "control-button primary", "Start loop");
  startButton.type = "button";
  const stopButton = createElement("button", "control-button", "Stop");
  stopButton.type = "button";

  startButton.addEventListener("click", async () => {
    stopProgressionLoop();
    status.textContent = "Playing C -> F -> G -> C at 70 BPM";
    await startProgressionLoop(data);
  });

  stopButton.addEventListener("click", () => stopProgressionLoop(status));

  controls.append(startButton, stopButton);
  lab.append(controls, status);
  mount.replaceChildren(lab);
}

document.addEventListener("DOMContentLoaded", () => {
  renderFretboardVisual(fretboardMock, document.getElementById("fretboardMount"));
  renderProgressionLab(progressionMock, document.getElementById("progressionLabMount"));
});
