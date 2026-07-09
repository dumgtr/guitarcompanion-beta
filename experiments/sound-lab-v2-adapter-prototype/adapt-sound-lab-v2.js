"use strict";

const fs = require("fs");
const path = require("path");

const fixturePath = path.resolve(__dirname, "..", "sound-lab-v2-schema-fixture", "sound-lab-v2.fixture.json");
const outputPath = path.resolve(__dirname, "sample-adapted-output.json");

function compactText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function adaptSoundLabV2ItemToChordSoundLab(item) {
  if (!item || typeof item !== "object") {
    throw new TypeError("Sound Lab V2 item must be an object.");
  }

  const theoryNote = compactText(item.theoryNote);
  const playbackNote = compactText(item.playbackNote);

  if (!theoryNote || !playbackNote) {
    throw new Error(`Sound Lab V2 item ${item.id || "(missing id)"} requires theoryNote and playbackNote.`);
  }

  return {
    id: item.id,
    type: "chord-sound-lab",
    title: item.chordLabel,
    description: item.lessonContext,
    listenFor: [item.functionText, item.learnerHint].map(compactText).filter(Boolean),
    audioEngine: {
      model: "sound-lab-v2",
      voice: "guide-tone",
      durationMs: 1200
    },
    chords: [
      {
        id: item.id,
        chord: item.chordLabel,
        degree: item.functionLabel,
        role: item.guideToneLabel,
        theoryNote,
        playbackNote,
        playbackRule: item.playbackRule,
        guideToneLabel: item.guideToneLabel,
        notes: [theoryNote],
        // Compatibility metadata only. A future production renderer branch
        // must play playbackNote directly and must not pass this value through
        // the old low-note-to-A4 audition normalization path.
        auditionNote: playbackNote
      }
    ]
  };
}

function adaptSoundLabV2Fixture(fixture) {
  const items = Array.isArray(fixture?.soundLabV2Items) ? fixture.soundLabV2Items : [];
  return {
    adapterMeta: {
      id: "sound-lab-v2-phase-b2-adapter-output",
      phase: "B2",
      status: "adapter-prototype-only",
      source: "experiments/sound-lab-v2-schema-fixture/sound-lab-v2.fixture.json",
      productionDataEdited: false,
      toneJsDependencyAdded: false,
      preservesPlaybackBaseline: "A2 -> A3",
      warning: "Do not feed playbackNote/auditionNote through the old A4 audition normalization path."
    },
    chordSoundLabs: items.map(adaptSoundLabV2ItemToChordSoundLab)
  };
}

function validateAdaptedOutput(output) {
  const labs = Array.isArray(output?.chordSoundLabs) ? output.chordSoundLabs : [];
  const errors = [];

  labs.forEach((lab) => {
    if (lab.type !== "chord-sound-lab") errors.push(`${lab.id}: type must be chord-sound-lab`);
    if (!Array.isArray(lab.chords) || lab.chords.length !== 1) errors.push(`${lab.id}: must have exactly one chord item`);

    const chord = lab.chords?.[0];
    if (!chord) return;
    if (!Array.isArray(chord.notes) || chord.notes.length !== 1) errors.push(`${lab.id}: must have exactly one theory note`);
    if (!chord.playbackNote) errors.push(`${lab.id}: missing playbackNote`);
    if (chord.theoryNote === "A2" && chord.playbackNote !== "A3") errors.push(`${lab.id}: A2 must preserve playbackNote A3`);
    if (chord.theoryNote === "A2" && chord.auditionNote === "A4") errors.push(`${lab.id}: A2 was incorrectly transformed to A4`);
  });

  const serialized = JSON.stringify(output);
  if (/"month"\s*:\s*[78]/.test(serialized) || /Month\s*[78]/i.test(serialized)) {
    errors.push("Adapter output must not reference Month 7 or Month 8.");
  }

  if (errors.length) {
    throw new Error(errors.join("\n"));
  }

  return {
    itemCount: labs.length,
    preservesA2ToA3: labs.some((lab) => {
      const chord = lab.chords?.[0];
      return chord?.theoryNote === "A2" && chord?.playbackNote === "A3";
    })
  };
}

function loadFixture() {
  return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
}

function writeSampleOutput() {
  const fixture = loadFixture();
  const adapted = adaptSoundLabV2Fixture(fixture);
  const validation = validateAdaptedOutput(adapted);
  fs.writeFileSync(outputPath, `${JSON.stringify(adapted, null, 2)}\n`, "utf8");
  return validation;
}

if (require.main === module) {
  const result = writeSampleOutput();
  console.log(`Adapted items: ${result.itemCount}`);
  console.log(`A2 -> A3 preserved: ${result.preservesA2ToA3 ? "yes" : "no"}`);
  console.log(`Output: ${outputPath}`);
}

module.exports = {
  adaptSoundLabV2ItemToChordSoundLab,
  adaptSoundLabV2Fixture,
  validateAdaptedOutput,
  writeSampleOutput
};
