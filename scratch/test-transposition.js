const assert = require('assert');
const fs = require('fs');
const path = require('path');

const mapPath = path.resolve(__dirname, '../outputs/assets/audio/electric/APPROVED_SAMPLE_MAP.json');
const mapData = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
assert.strictEqual(mapData.schemaVersion, 2, "Schema version must be exactly 2");
const notes = mapData.notes;

assert.strictEqual(Object.keys(notes).length, 37, "Must have exactly 37 mappings");

const uniquePaths = new Set();
for (const [targetMidi, mapping] of Object.entries(notes)) {
  const tMidi = Number(targetMidi);
  assert.ok(tMidi >= 40 && tMidi <= 76, "Target MIDI must be in 40-76");
  assert.ok(mapping.path, "Asset path exists");
  assert.ok(Number.isFinite(mapping.sourceMidi), "Source MIDI is finite");
  uniquePaths.add(mapping.path);

  const rate = 2 ** ((tMidi - mapping.sourceMidi) / 12);
  assert.ok(Number.isFinite(rate), "Rate is finite");
  assert.ok(rate > 0, "Rate is positive");
}
assert.strictEqual(uniquePaths.size, 10, "Must have exactly 10 unique asset paths");

function checkAdjacent(midi1, midi2) {
  const m1 = notes[String(midi1)];
  const m2 = notes[String(midi2)];
  if (m1.path === m2.path) {
    const r1 = 2 ** ((midi1 - m1.sourceMidi) / 12);
    const r2 = 2 ** ((midi2 - m2.sourceMidi) / 12);
    assert.ok(Math.abs(r1 - r2) > 0.001, `Playback rates must differ for ${midi1} and ${midi2}`);
    assert.ok(Math.abs((r2 / r1) - (2 ** (1 / 12))) < 0.001, "Ratio must be a semitone");
  }
}

for (let m = 40; m < 76; m++) {
  checkAdjacent(m, m + 1);
}

// 43-46 sharing A2.ogg
const rates43to46 = new Set([43, 44, 45, 46].map(m => 2 ** ((m - notes[String(m)].sourceMidi) / 12)));
assert.strictEqual(rates43to46.size, 4, "MIDI 43-46 must have distinct rates");

console.log("All deterministic transposition tests passed.");
