const SHARP_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLAT_NOTES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const STRING_BASES = [4, 11, 7, 2, 9, 4]; // E, B, G, D, A, E

const STATE = {
  key: 'A',
  overlay: 'minor-pentatonic',
  position: '0-12',
  selectedNoteName: null,
  focusInterval: 'all', // 'all', '0', '3', etc.
  challenge: '',
  challengeFound: [] // array of `${stringIdx}-${fret}`
};

const OVERLAYS = {
  'notes': [0, 2, 4, 5, 7, 9, 11],
  'intervals': [0, 2, 4, 5, 7, 9, 11],
  'triad': [0, 4, 7],
  'guide-tones': [4, 10],
  'minor-pentatonic': [0, 3, 5, 7, 10],
  'major-pentatonic': [0, 2, 4, 7, 9]
};

const INTERVAL_ROLES_TH = {
  '0': 'บ้าน จุดพัก จุดเริ่มและจุดจบของ phrase',
  '2': 'Passing tone / Color tone',
  '3': 'สี minor / blues sadness',
  '4': 'สี major / bright resolution',
  '5': 'โครงคอร์ดที่มั่นคง (Power)',
  '7': 'Passing tone / Color tone',
  '9': 'Passing tone / Color tone',
  '10': 'blues / dominant tension',
  '11': 'Major 7th tension'
};

function init() {
  document.getElementById('key-select').addEventListener('change', (e) => {
    STATE.key = e.target.value;
    resetSelection();
    render();
  });
  document.getElementById('overlay-select').addEventListener('change', (e) => {
    STATE.overlay = e.target.value;
    resetSelection();
    render();
  });
  document.getElementById('position-select').addEventListener('change', (e) => {
    STATE.position = e.target.value;
    render();
  });

  // Focus chips
  document.querySelectorAll('.focus-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      document.querySelectorAll('.focus-chip').forEach(c => c.classList.remove('active'));
      e.target.classList.add('active');
      STATE.focusInterval = e.target.dataset.interval;
      render();
    });
  });

  // Challenge
  document.getElementById('challenge-select').addEventListener('change', (e) => {
    STATE.challenge = e.target.value;
    STATE.challengeFound = [];
    resetSelection();
    updateChallengeFeedback();
    render();
  });
  document.getElementById('challenge-reset-btn').addEventListener('click', () => {
    STATE.challengeFound = [];
    resetSelection();
    updateChallengeFeedback();
    render();
  });

  render();
}

function resetSelection() {
  STATE.selectedNoteName = null;
  renderInspectorEmpty();
}

function getNoteName(index) {
  const isFlatKey = ['F', 'Bb', 'Eb'].includes(STATE.key);
  const notes = isFlatKey ? FLAT_NOTES : SHARP_NOTES;
  return notes[index % 12];
}

function getRootIndex() {
  const isFlatKey = ['F', 'Bb', 'Eb'].includes(STATE.key);
  const notes = isFlatKey ? FLAT_NOTES : SHARP_NOTES;
  return notes.indexOf(STATE.key);
}

function getIntervalClass(interval) {
  switch(interval) {
    case 0: return 'root';
    case 4: return 'major-3';
    case 3: return 'minor-3';
    case 7: return 'fifth';
    case 10: return 'flat-7';
    case 2:
    case 5:
    case 9: return 'pentatonic';
    default: return '';
  }
}

function getIntervalName(interval) {
  const map = {
    0: '1 (Root)', 1: 'b2', 2: '2', 3: 'b3', 4: '3', 5: '4', 6: 'b5',
    7: '5', 8: '#5', 9: '6', 10: 'b7', 11: '7'
  };
  return map[interval];
}

function updateComparePanel() {
  const rootIdx = getRootIndex();
  const b3Name = getNoteName((rootIdx + 3) % 12);
  const major3Name = getNoteName((rootIdx + 4) % 12);

  const content = document.getElementById('compare-content');
  content.innerHTML = `
    <div class="compare-item">
      <div class="compare-note minor">${b3Name}</div>
      <div class="compare-label">b3 (Minor)</div>
    </div>
    <div class="compare-item">
      <div class="compare-note major">${major3Name}</div>
      <div class="compare-label">3 (Major)</div>
    </div>
  `;
}

function updateChallengeFeedback() {
  const fb = document.getElementById('challenge-feedback');
  if (!STATE.challenge) {
    fb.className = 'challenge-feedback';
    fb.textContent = 'เลือกบททดสอบเพื่อเริ่ม';
    return;
  }

  // Count how many of this interval exist in current viewport
  const rootIdx = getRootIndex();
  let totalTargets = 0;

  let startFret = STATE.position === '5-9' ? 5 : 0;
  let endFret = STATE.position === '0-4' ? 4 : (STATE.position === '5-9' ? 9 : 12);

  for (let s = 0; s < 6; s++) {
    for (let f = startFret; f <= endFret; f++) {
      const noteIdx = (STRING_BASES[s] + f) % 12;
      const interval = (noteIdx - rootIdx + 12) % 12;
      if (interval.toString() === STATE.challenge) totalTargets++;
    }
  }

  const found = STATE.challengeFound.length;
  if (found >= totalTargets && totalTargets > 0) {
    fb.className = 'challenge-feedback feedback-correct';
    fb.textContent = `ยอดเยี่ยม! หาครบทั้งหมด ${totalTargets} ตัวแล้ว`;
  } else {
    fb.className = 'challenge-feedback';
    fb.textContent = `พบแล้ว ${found} / ${totalTargets}`;
  }
}

function handleNoteClick(e, noteData, domNode) {
  if (STATE.challenge) {
    handleChallengeClick(noteData, domNode);
    return;
  }

  STATE.selectedNoteName = noteData.noteName;
  updateInspector(noteData);
  render(); // re-render to highlight family
}

function handleChallengeClick(noteData, domNode) {
  const isCorrect = noteData.interval.toString() === STATE.challenge;
  const id = `${noteData.stringIdx}-${noteData.fret}`;

  if (isCorrect) {
    if (!STATE.challengeFound.includes(id)) {
      STATE.challengeFound.push(id);
      domNode.classList.add('anim-correct');
      setTimeout(() => domNode.classList.remove('anim-correct'), 300);
      updateChallengeFeedback();
      render();
    }
  } else {
    domNode.classList.add('anim-wrong');
    setTimeout(() => domNode.classList.remove('anim-wrong'), 300);
  }
}

function renderInspectorEmpty() {
  const content = document.getElementById('inspector-content');
  content.innerHTML = 'จิ้มที่โน้ตบนคอกีตาร์เพื่อดูรายละเอียด';
  content.className = 'inspector-empty';
}

function updateInspector(noteData) {
  const content = document.getElementById('inspector-content');
  content.className = 'inspector-data';

  const roleTh = INTERVAL_ROLES_TH[noteData.interval] || 'Passing tone';

  content.innerHTML = `
    <div class="ins-row">
      <span class="ins-label">Note:</span>
      <span class="ins-val">${noteData.noteName}</span>
    </div>
    <div class="ins-row">
      <span class="ins-label">Position:</span>
      <span class="ins-val">สาย ${noteData.stringNum} เฟร็ต ${noteData.fret}</span>
    </div>
    <div class="ins-row">
      <span class="ins-label">Interval:</span>
      <span class="ins-val">${getIntervalName(noteData.interval)}</span>
    </div>
    <div class="ins-desc">
      ${roleTh}
    </div>
  `;
}

function render() {
  const fretboard = document.getElementById('fretboard');
  const markers = document.getElementById('fret-markers');
  const rootIdx = getRootIndex();
  const activeIntervals = OVERLAYS[STATE.overlay] || [];

  let startFret = 0;
  let endFret = 12;
  if (STATE.position === '0-4') endFret = 4;
  if (STATE.position === '5-9') {
    startFret = 5;
    endFret = 9;
  }

  fretboard.innerHTML = '';
  markers.innerHTML = '';

  fretboard.className = STATE.focusInterval !== 'all' ? 'fretboard focus-mode' : 'fretboard';

  // Render strings
  STRING_BASES.forEach((base, stringIdx) => {
    const stringRow = document.createElement('div');
    stringRow.className = 'string-row';
    const stringNum = stringIdx + 1;

    for (let fret = startFret; fret <= endFret; fret++) {
      const fretCell = document.createElement('div');
      fretCell.className = `fret-cell fret-${fret}`;

      const noteIdx = (base + fret) % 12;
      const interval = (noteIdx - rootIdx + 12) % 12;
      const isActive = activeIntervals.includes(interval);

      const noteName = getNoteName(noteIdx);
      const intervalClass = getIntervalClass(interval);

      // Node creation
      const noteNode = document.createElement('button');
      noteNode.className = `note-node ${intervalClass}`;
      noteNode.dataset.active = isActive;

      // A11y
      noteNode.setAttribute('role', 'button');
      noteNode.setAttribute('aria-label', `String ${stringNum} fret ${fret} note ${noteName} interval ${getIntervalName(interval)}`);

      // Focus Mode
      if (STATE.focusInterval !== 'all') {
        noteNode.dataset.focus = (interval.toString() === STATE.focusInterval);
      }

      // Challenge Mode
      if (STATE.challenge) {
        const id = `${stringIdx}-${fret}`;
        if (STATE.challengeFound.includes(id)) {
          noteNode.dataset.active = "true";
          noteNode.classList.add('is-selected'); // mark found
        } else {
          noteNode.dataset.active = "false"; // hide others to make them find it
        }
      }

      // Selected Note / Family Effect
      if (!STATE.challenge && STATE.selectedNoteName) {
        if (noteName === STATE.selectedNoteName) {
          noteNode.classList.add('is-family');
        }
      }

      noteNode.textContent = STATE.overlay === 'intervals' ? getIntervalName(interval) : noteName;

      const noteData = { noteName, stringIdx, stringNum, fret, interval };
      noteNode.addEventListener('click', (e) => {
        // Clear old selection styling
        document.querySelectorAll('.note-node').forEach(n => n.classList.remove('is-selected'));
        if (!STATE.challenge) {
          noteNode.classList.add('is-selected');
        }
        handleNoteClick(e, noteData, noteNode);
      });

      fretCell.appendChild(noteNode);

      // Inlays
      if (stringIdx === 2 && [3, 5, 7, 9, 12].includes(fret)) {
        const inlay = document.createElement('div');
        inlay.className = 'inlay-dot';
        fretCell.appendChild(inlay);
      }

      stringRow.appendChild(fretCell);
    }
    fretboard.appendChild(stringRow);
  });

  // Render markers
  for (let fret = startFret; fret <= endFret; fret++) {
    const marker = document.createElement('div');
    marker.className = `fret-marker-cell fret-${fret}`;
    marker.textContent = fret === 0 ? 'Nut' : fret;
    markers.appendChild(marker);
  }

  // Update UI components
  updateComparePanel();
  if (!STATE.challenge) updateChallengeFeedback();
}

document.addEventListener('DOMContentLoaded', init);
