const SHARP_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLAT_NOTES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// Base note index for each string (String 1 to 6)
// E, B, G, D, A, E
const STRING_BASES = [4, 11, 7, 2, 9, 4];

const STATE = {
  key: 'A',
  overlay: 'minor-pentatonic',
  position: '0-12'
};

const OVERLAYS = {
  'notes': [0, 2, 4, 5, 7, 9, 11], // Diatonic Major
  'intervals': [0, 2, 4, 5, 7, 9, 11],
  'triad': [0, 4, 7], // Major triad
  'guide-tones': [4, 10], // 3, b7
  'minor-pentatonic': [0, 3, 5, 7, 10],
  'major-pentatonic': [0, 2, 4, 7, 9]
};

function init() {
  document.getElementById('key-select').addEventListener('change', (e) => {
    STATE.key = e.target.value;
    render();
  });
  document.getElementById('overlay-select').addEventListener('change', (e) => {
    STATE.overlay = e.target.value;
    render();
  });
  document.getElementById('position-select').addEventListener('change', (e) => {
    STATE.position = e.target.value;
    render();
  });

  render();
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

  // Render strings
  STRING_BASES.forEach((base, stringIdx) => {
    const stringRow = document.createElement('div');
    stringRow.className = 'string-row';

    for (let fret = startFret; fret <= endFret; fret++) {
      const fretCell = document.createElement('div');
      fretCell.className = `fret-cell fret-${fret}`;

      const noteIdx = (base + fret) % 12;
      const interval = (noteIdx - rootIdx + 12) % 12;
      const isActive = activeIntervals.includes(interval);

      const noteName = getNoteName(noteIdx);
      const intervalClass = getIntervalClass(interval);

      const noteNode = document.createElement('div');
      noteNode.className = `note-node ${intervalClass}`;
      noteNode.dataset.active = isActive;
      noteNode.textContent = STATE.overlay === 'intervals' ? getIntervalName(interval) : noteName;

      fretCell.appendChild(noteNode);

      // Inlays (only on 3rd string for vertical centering)
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

  // Update status
  const overlayLabel = document.getElementById('overlay-select').options[document.getElementById('overlay-select').selectedIndex].text;
  const positionLabel = document.getElementById('position-select').options[document.getElementById('position-select').selectedIndex].text;
  document.getElementById('debug-status').textContent = `Key: ${STATE.key} | Overlay: ${overlayLabel} | Pos: ${positionLabel} (Frets ${startFret}-${endFret})`;
}

function getIntervalName(interval) {
  const map = {
    0: '1', 1: 'b2', 2: '2', 3: 'b3', 4: '3', 5: '4', 6: 'b5',
    7: '5', 8: '#5', 9: '6', 10: 'b7', 11: '7'
  };
  return map[interval];
}

document.addEventListener('DOMContentLoaded', init);
