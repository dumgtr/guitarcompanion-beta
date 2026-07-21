const assert = require('assert');

const FSL_OPEN_STRING_MIDI = Object.freeze([64, 59, 55, 50, 45, 40]);

function fslMidiToScientificPitch(midi) {
  const oct = Math.floor(midi / 12) - 1;
  const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  return notes[midi % 12] + oct;
}

function testMapping(stringIndex, fret, expectedMidi, expectedPitch) {
  const midi = FSL_OPEN_STRING_MIDI[stringIndex] + fret;
  const pitch = fslMidiToScientificPitch(midi);
  console.log(`String ${stringIndex + 1} fret ${fret} -> MIDI ${midi} -> ${pitch}`);
  assert.strictEqual(midi, expectedMidi, `Expected MIDI ${expectedMidi} but got ${midi}`);
  assert.strictEqual(pitch, expectedPitch, `Expected pitch ${expectedPitch} but got ${pitch}`);
}

testMapping(0, 0, 64, "E4");
testMapping(0, 12, 76, "E5");
testMapping(1, 0, 59, "B3");
testMapping(2, 0, 55, "G3");
testMapping(3, 0, 50, "D3");
testMapping(4, 0, 45, "A2");
testMapping(5, 0, 40, "E2");
testMapping(5, 12, 52, "E3");

function testOctave(stringIndex, fret, expectedPitch) {
  const midi = FSL_OPEN_STRING_MIDI[stringIndex] + fret;
  const pitch = fslMidiToScientificPitch(midi);
  console.log(`String ${stringIndex + 1} fret ${fret} -> ${pitch}`);
  assert.strictEqual(pitch, expectedPitch);
}

testOctave(5, 5, "A2");
testOctave(3, 7, "A3");
testOctave(1, 10, "A4");

function testUnison(s1, f1, s2, f2, expectedPitch) {
  const m1 = FSL_OPEN_STRING_MIDI[s1] + f1;
  const m2 = FSL_OPEN_STRING_MIDI[s2] + f2;
  const p1 = fslMidiToScientificPitch(m1);
  const p2 = fslMidiToScientificPitch(m2);
  console.log(`String ${s1 + 1} fret ${f1} (${p1}) === String ${s2 + 1} fret ${f2} (${p2})`);
  assert.strictEqual(m1, m2);
  assert.strictEqual(p1, p2);
  assert.strictEqual(p1, expectedPitch);
}

testUnison(0, 0, 1, 5, "E4");
console.log("All FSL physical pitch mapping tests passed.");
