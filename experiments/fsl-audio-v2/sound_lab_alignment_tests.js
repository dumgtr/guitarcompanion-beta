const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const root = process.cwd();
const enginePath = path.join(root, 'outputs/audio-engine.js');
const manifestPath = path.join(root, 'outputs/assets/audio/fsl-synth/APPROVED_SAMPLE_MAP.json');

const engineContent = fs.readFileSync(enginePath, 'utf8');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

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

let fetchCount = 0;

function createFreshSandbox(fetchFailMode = false, missingNoteMode = false) {
  fetchCount = 0;
  const mockCtx = new MockAudioContext();
  const defaultFetchMock = (url) => {
    fetchCount++;
    if (fetchFailMode) {
      return Promise.reject(new Error("Network Failure"));
    }
    if (url.endsWith('APPROVED_SAMPLE_MAP.json')) {
      if (url.includes('electric')) {
        const notesMap = {};
        for (let m = 40; m <= 76; m++) {
          notesMap[m.toString()] = {
            path: `assets/audio/electric/samples/${m}.wav`,
            sourceMidi: m
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

async function runTests() {
  console.log("Running Sound Lab Synth Alignment deterministic tests...");

  // 1. Clean Sandbox
  const sandbox = createFreshSandbox();
  const AudioEngine = sandbox.window.AudioEngine;
  await AudioEngine.unlock();

  // 2. Prepare FSL Synth sampler (should load and set ready)
  const fslState = await AudioEngine.prepareFslSynthSampler();
  assert.strictEqual(fslState, "ready");
  assert.strictEqual(fetchCount, 38, "Fetched manifest + 37 WAV files");

  // 3. FSL Synth note play routes to approved sampler
  const playFsl = await AudioEngine.playNote({
    channel: "fsl",
    profile: "fsl-fretboard-position",
    note: "C4",
    instrument: "synth"
  });
  assert.strictEqual(playFsl, true);
  let status = AudioEngine.getStatus();
  assert.strictEqual(status.lastPlaybackBackend, "native-sampler");
  assert.strictEqual(status.lastPlaybackInstrument, "synth");
  assert.strictEqual(status.activeFslSynthVoiceCount, 1);
  assert.strictEqual(status.activeSoundLabSynthVoiceCount, 0);

  // 4. Sound Lab Synth note play routes to the SAME approved sampler
  const playSl = await AudioEngine.playNote({
    channel: "soundlab",
    profile: "soundlab-guide-tone",
    note: "C4",
    instrument: "synth"
  });
  assert.strictEqual(playSl, true);
  status = AudioEngine.getStatus();
  assert.strictEqual(status.lastPlaybackBackend, "native-sampler");
  assert.strictEqual(status.lastPlaybackInstrument, "synth");
  assert.strictEqual(status.activeFslSynthVoiceCount, 1);
  assert.strictEqual(status.activeSoundLabSynthVoiceCount, 1, "Sound Lab Synth tracks its active voice independently");

  // 5. Shared cache: verify fetchCount did NOT increase (no redundant downloading)
  assert.strictEqual(fetchCount, 38, "No additional fetches for Sound Lab");

  // 6. Same-note retrigger remains natural overlap
  await AudioEngine.playNote({
    channel: "soundlab",
    profile: "soundlab-guide-tone",
    note: "C4",
    instrument: "synth"
  });
  status = AudioEngine.getStatus();
  assert.strictEqual(status.activeSoundLabSynthVoiceCount, 2, "Same-note retrigger overlaps naturally");

  // 7. Channel isolation on stop: stopping Sound Lab does not stop FSL
  AudioEngine.stopChannel("soundlab");
  status = AudioEngine.getStatus();
  assert.strictEqual(status.activeSoundLabSynthVoiceCount, 0, "Sound Lab active voices cleared");
  assert.strictEqual(status.activeFslSynthVoiceCount, 1, "FSL active voice preserved");

  // 8. Channel isolation on stop: stopping FSL does not stop Sound Lab (first play a new SL note)
  await AudioEngine.playNote({
    channel: "soundlab",
    profile: "soundlab-guide-tone",
    note: "C4",
    instrument: "synth"
  });
  AudioEngine.stopChannel("fsl");
  status = AudioEngine.getStatus();
  assert.strictEqual(status.activeFslSynthVoiceCount, 0, "FSL active voices cleared");
  assert.strictEqual(status.activeSoundLabSynthVoiceCount, 1, "Sound Lab active voice preserved");

  // 9. Normal lesson Synth remains native Synth
  const playNormal = await AudioEngine.playNote({
    channel: "lessons",
    profile: "lessons-profile", // different profile
    note: "C4",
    instrument: "synth"
  });
  assert.strictEqual(playNormal, true);
  status = AudioEngine.getStatus();
  assert.strictEqual(status.lastPlaybackBackend, "native-synth", "Normal lesson Synth remains native");

  // 10. Fallbacks: Sound Lab fallback when preparation fails
  const failSandbox = createFreshSandbox(true); // fetch fails
  const AudioEngineFail = failSandbox.window.AudioEngine;
  await AudioEngineFail.unlock();
  const failState = await AudioEngineFail.prepareFslSynthSampler();
  assert.strictEqual(failState, "failed");

  const playSlFallback = await AudioEngineFail.playNote({
    channel: "soundlab",
    profile: "soundlab-guide-tone",
    note: "C4",
    instrument: "synth"
  });
  assert.strictEqual(playSlFallback, true);
  status = AudioEngineFail.getStatus();
  assert.strictEqual(status.lastPlaybackBackend, "native-synth", "Sound Lab fallback to native-synth works");

  // 11. Fallbacks: FSL fallback remains unchanged (uses native synth)
  const playFslFallback = await AudioEngineFail.playNote({
    channel: "fsl",
    profile: "fsl-fretboard-position",
    note: "C4",
    instrument: "synth"
  });
  assert.strictEqual(playFslFallback, true);
  status = AudioEngineFail.getStatus();
  assert.strictEqual(status.lastPlaybackBackend, "native-synth", "FSL fallback to native-synth works");

  // 12. Nylon remains unchanged
  const nylonSandbox = createFreshSandbox();
  const AudioEngineNylon = nylonSandbox.window.AudioEngine;
  await AudioEngineNylon.unlock();
  await AudioEngineNylon.prepareSoundLabSampler();
  const playNylon = await AudioEngineNylon.playNote({
    channel: "soundlab",
    profile: "soundlab-guide-tone",
    note: "E4",
    instrument: "nylon"
  });
  assert.strictEqual(playNylon, true);
  status = AudioEngineNylon.getStatus();
  assert.strictEqual(status.lastPlaybackInstrument, "nylon");
  assert.strictEqual(status.lastPlaybackBackend, "native-sampler");

  // 13. Electric remains unchanged
  await AudioEngineNylon.prepareElectricSampler();
  const playElectric = await AudioEngineNylon.playNote({
    channel: "soundlab",
    profile: "soundlab-guide-tone",
    note: "E4",
    instrument: "electric"
  });
  assert.strictEqual(playElectric, true);
  status = AudioEngineNylon.getStatus();
  assert.strictEqual(status.lastPlaybackInstrument, "electric");
  assert.strictEqual(status.lastPlaybackBackend, "native-sampler");

  console.log("All Sound Lab Synth Alignment deterministic tests PASSED successfully!");
}

runTests().catch(err => {
  console.error("Test failure:", err);
  process.exit(1);
});
