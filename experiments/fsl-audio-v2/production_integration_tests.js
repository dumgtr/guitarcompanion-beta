const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const root = process.cwd();
const enginePath = path.join(root, 'outputs/audio-engine.js');
const manifestPath = path.join(root, 'outputs/assets/audio/fsl-synth/APPROVED_SAMPLE_MAP.json');

const engineContent = fs.readFileSync(enginePath, 'utf8');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// Test 1: Production manifest and schema check
console.log("Validating FSL Synth APPROVED_SAMPLE_MAP.json...");
assert.strictEqual(manifest.schemaVersion, 1);
assert.strictEqual(manifest.instrument, "fsl-synth-short-oneshot");
assert.strictEqual(manifest.durationMs, 240);
assert.strictEqual(Object.keys(manifest.notes).length, 37);

for (let m = 40; m <= 76; m++) {
  const entry = manifest.notes[m.toString()];
  assert.notStrictEqual(entry, undefined);
  assert.strictEqual(entry.targetMidi, m);
  assert.strictEqual(entry.sourceMidi, m);
  assert.strictEqual(entry.playbackRate, 1);
  assert.ok(entry.path.startsWith("assets/audio/fsl-synth/"));

  // Verify file actually exists in outputs
  const fullPath = path.join(root, 'outputs', entry.path);
  assert.ok(fs.existsSync(fullPath), `Sample file exists: ${entry.path}`);

  const bytes = fs.readFileSync(fullPath);
  assert.strictEqual(bufToHash(bytes), entry.sha256, `SHA-256 hash match for MIDI ${m}`);
}
console.log("PASS: Manifest and asset-copy integrity verified.");

function bufToHash(buf) {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(buf).digest('hex');
}

// Sandbox VM Simulation Helpers
class MockAudioBufferSourceNode {
  constructor() {
    this.buffer = { duration: 0.240 };
    this.playbackRate = { value: 1.0, setValueAtTime: (v, t) => { this.playbackRate.value = v; } };
    this.started = false;
    this.stopped = false;
    this.onended = null;
  }
  connect(dest) {}
  disconnect() {}
  start(time) { this.started = true; }
  stop(time) {
    this.stopped = true;
    if (this.onended) this.onended();
  }
}

class MockAudioContext {
  constructor() {
    this.currentTime = 0.0;
    this.state = 'running';
    this.destination = {};
  }
  createBufferSource() { return new MockAudioBufferSourceNode(); }
  createGain() {
    return {
      gain: {
        value: 1.0,
        setValueAtTime: () => {},
        linearRampToValueAtTime: () => {},
        exponentialRampToValueAtTime: () => {}
      },
      connect: () => {},
      disconnect: () => {}
    };
  }
  createDynamicsCompressor() {
    return {
      threshold: { value: 0 },
      knee: { value: 0 },
      ratio: { value: 0 },
      attack: { value: 0 },
      release: { value: 0 },
      connect: () => {}
    };
  }
  createBiquadFilter() {
    return {
      frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
      Q: { setValueAtTime: () => {} },
      connect: () => {}
    };
  }
  createOscillator() {
    return {
      type: 'triangle',
      frequency: { setValueAtTime: () => {} },
      detune: { setValueAtTime: () => {} },
      connect: () => {},
      start: () => {},
      stop: () => {}
    };
  }
  resume() { return Promise.resolve(); }
  decodeAudioData(arr) {
    return Promise.resolve({ duration: 0.240, sampleRate: 44100 });
  }
}

function createFreshSandbox(fetchFailMode = false, missingNoteMode = false) {
  const mockCtx = new MockAudioContext();
  const defaultFetchMock = (url) => {
    if (fetchFailMode) {
      return Promise.reject(new Error("Network Failure"));
    }
    if (url.endsWith('APPROVED_SAMPLE_MAP.json')) {
      if (url.includes('electric')) {
        const notesMap = {};
        for (let m = 40; m <= 76; m++) {
          notesMap[m.toString()] = {
            path: `assets/audio/electric/samples/${m}.wav`,
            sourceMidi: (m === 62) ? 60 : m
          };
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            schemaVersion: 2,
            notes: notesMap
          })
        });
      } else {
        const notesMap = { ...manifest.notes };
        if (missingNoteMode) {
          delete notesMap["60"];
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            ...manifest,
            notes: notesMap
          })
        });
      }
    }
    return Promise.resolve({
      ok: true,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(100))
    });
  };

  const sandbox = {
    window: {
      AudioContext: function() { return mockCtx; },
      setTimeout: setTimeout,
      clearTimeout: clearTimeout
    },
    document: {},
    fetch: defaultFetchMock,
    console: console,
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    AudioContext: function() { return mockCtx; },
    webkitAudioContext: function() { return mockCtx; }
  };

  vm.createContext(sandbox);
  vm.runInContext(engineContent, sandbox);
  return sandbox;
}

async function runIntegrationTests() {
  console.log("Running comprehensive production routing and lifecycle integration tests...");

  // Test Group 2: Routing and Lifecycle in clean sandbox
  {
    const sandbox = createFreshSandbox();
    const AudioEngine = sandbox.window.AudioEngine;
    await AudioEngine.unlock();

    // Load the FSL Synth sampler
    const samplerState = await AudioEngine.prepareFslSynthSampler();
    assert.strictEqual(samplerState, "ready", "prepareFslSynthSampler completes successfully");

    // Test 2.1: FSL Synth note play routes to native-sampler
    const playRes1 = await AudioEngine.playNote({
      channel: "fsl",
      profile: "fsl-fretboard-position",
      note: "C4",
      instrument: "synth"
    });
    assert.strictEqual(playRes1, true, "playNote returns true");
    let status = AudioEngine.getStatus();
    assert.strictEqual(status.lastPlaybackBackend, "native-sampler", "FSL Synth routes to native-sampler one-shot backend");
    assert.strictEqual(status.lastPlaybackInstrument, "synth");

    // Test 2.2: Sound Lab Synth play (soundlab channel) routes to FSL Synth one-shot (uses native-sampler)
    const playRes2 = await AudioEngine.playNote({
      channel: "soundlab",
      profile: "soundlab-guide-tone",
      note: "C4",
      instrument: "synth"
    });
    assert.strictEqual(playRes2, true, "playNote returns true for Sound Lab Synth");
    status = AudioEngine.getStatus();
    assert.strictEqual(status.lastPlaybackBackend, "native-sampler", "Sound Lab Synth routes to native-sampler");

    // Test 2.2b: Normal lesson Synth play (lessons channel) does NOT route to FSL Synth one-shot (uses native-synth)
    const playRes2b = await AudioEngine.playNote({
      channel: "lessons",
      profile: "lessons-profile",
      note: "C4",
      instrument: "synth"
    });
    assert.strictEqual(playRes2b, true, "playNote returns true for native synth");
    status = AudioEngine.getStatus();
    assert.strictEqual(status.lastPlaybackBackend, "native-synth", "Normal lesson Synth continues to use native-synth oscillator path");

    // Test 2.3: Same-note retrigger creates a new one-shot without stopping previous one-shot
    status = AudioEngine.getStatus();
    assert.strictEqual(status.activeFslSynthVoiceCount, 1, "Active one-shot count is 1");
    
    await AudioEngine.playNote({
      channel: "fsl",
      profile: "fsl-fretboard-position",
      note: "C4",
      instrument: "synth"
    });
    status = AudioEngine.getStatus();
    assert.strictEqual(status.activeFslSynthVoiceCount, 2, "Second overlapping same-note trigger does not stop the first");

    // Test 2.4: Stop Channel FSL clears active FSL Synth one-shots
    AudioEngine.stopChannel("fsl");
    status = AudioEngine.getStatus();
    assert.strictEqual(status.activeFslSynthVoiceCount, 0, "stopChannel clears FSL Synth one-shots and active timeout");
  }

  // Test Group 3: Regressions and transpositions
  {
    const sandbox = createFreshSandbox();
    const AudioEngine = sandbox.window.AudioEngine;
    await AudioEngine.unlock();

    // Test 3.1: Electric Schema v2 playback and transposition
    await AudioEngine.prepareElectricSampler();
    const playResElectric = await AudioEngine.playNote({
      channel: "soundlab",
      profile: "soundlab-guide-tone",
      note: "D4", // MIDI 62 (transposition = +2 semitones relative to source MIDI 60)
      instrument: "electric"
    });
    assert.strictEqual(playResElectric, true);
    let status = AudioEngine.getStatus();
    assert.strictEqual(status.lastPlaybackBackend, "native-sampler", "Electric uses native-sampler");
    assert.strictEqual(status.lastPlaybackInstrument, "electric");
    assert.strictEqual(status.lastElectricSourceMidi, 60, "Electric maps to source MIDI 60");
    assert.ok(Math.abs(status.lastElectricPlaybackRate - (2 ** (2 / 12))) < 0.0001, "Electric correct transposition playbackRate applied");

    // Test 3.2: Nylon FSL path remains untouched (plays successfully)
    const playResNylon = await AudioEngine.playNote({
      channel: "fsl",
      profile: "fsl-fretboard-position",
      note: "C4",
      instrument: "nylon"
    });
    assert.strictEqual(playResNylon, true);
    status = AudioEngine.getStatus();
    assert.strictEqual(status.lastPlaybackInstrument, "nylon", "Nylon runs on Nylon instrument");
    assert.strictEqual(status.lastPlaybackBackend, "native-sampler", "Nylon uses native-sampler");
  }

  // Test Group 4: Fallbacks and Failovers
  {
    // Test 4.1: Missing-note FSL Synth failover (note missing from manifest)
    const sandbox = createFreshSandbox(false, true); // missingNoteMode = true
    const AudioEngine = sandbox.window.AudioEngine;
    await AudioEngine.unlock();
    await AudioEngine.prepareFslSynthSampler();

    const playResOutside = await AudioEngine.playNote({
      channel: "fsl",
      profile: "fsl-fretboard-position",
      note: "C4", 
      instrument: "synth"
    });
    assert.strictEqual(playResOutside, true, "playNote returns true for fallback note");
    let status = AudioEngine.getStatus();
    assert.strictEqual(status.lastPlaybackBackend, "native-synth", "Missing notes fail over to native oscillator Synth");
  }

  {
    // Test 4.2: Fallback when manifest fetch fails
    const sandbox = createFreshSandbox(true); // fetchFailMode = true
    const AudioEngine = sandbox.window.AudioEngine;
    await AudioEngine.unlock();
    
    const samplerState = await AudioEngine.prepareFslSynthSampler();
    assert.strictEqual(samplerState, "failed", "prepareFslSynthSampler goes to failed state on network failure");
    
    let status = AudioEngine.getStatus();
    assert.strictEqual(status.fslSynthSamplerState, "failed");

    const playResFallback = await AudioEngine.playNote({
      channel: "fsl",
      profile: "fsl-fretboard-position",
      note: "C4",
      instrument: "synth"
    });
    assert.strictEqual(playResFallback, true, "Play note succeeds even when sampler failed to load");
    status = AudioEngine.getStatus();
    assert.strictEqual(status.lastPlaybackBackend, "native-synth", "Failed sampler state causes playNote to fall back to native-synth");
  }

  console.log("All comprehensive regression and fallback tests passed successfully!");
}

runIntegrationTests().catch(err => {
  console.error("Integration test failed:", err);
  process.exit(1);
});
