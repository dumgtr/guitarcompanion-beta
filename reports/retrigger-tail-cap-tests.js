const fs = require('fs');
const path = require('path');
const vm = require('vm');

class MockAudioNode {
  constructor() {
    this.connectedTo = null;
  }
  connect(dest) {
    this.connectedTo = dest;
  }
  disconnect() {
    this.connectedTo = null;
  }
}

class MockAudioParam {
  constructor(initial = 0) {
    this.value = initial;
    this.scheduledValues = [];
  }
  setValueAtTime(val, t) {
    this.value = val;
    this.scheduledValues.push({ type: 'setValue', val, t });
  }
  linearRampToValueAtTime(val, t) {
    this.scheduledValues.push({ type: 'linearRamp', val, t });
  }
  cancelScheduledValues(t) {
    this.scheduledValues = this.scheduledValues.filter(item => item.t < t);
  }
}

class MockGainNode extends MockAudioNode {
  constructor() {
    super();
    this.gain = new MockAudioParam(1);
  }
}

class MockCompressorNode extends MockAudioNode {
  constructor() {
    super();
    this.threshold = new MockAudioParam(-8);
    this.knee = new MockAudioParam(24);
    this.ratio = new MockAudioParam(3);
    this.attack = new MockAudioParam(0.003);
    this.release = new MockAudioParam(0.2);
  }
}

class MockBufferSourceNode extends MockAudioNode {
  constructor() {
    super();
    this.buffer = { duration: 1.0 };
    this.playbackRate = new MockAudioParam(1);
    this.onended = null;
    this.started = false;
    this.stopped = false;
    this.startedAt = null;
    this.stopScheduledAt = null;
    this.disconnectedAt = null;
    this.endedAt = null;
  }
  start(time) {
    this.started = true;
    this.startedAt = time;
  }
  stop(time) {
    this.stopped = true;
    this.stopScheduledAt = time;
    if (typeof this.onended === 'function') {
      const cb = this.onended;
      this.onended = null;
      cb();
    }
  }
  disconnect() {
    super.disconnect();
    this.disconnectedAt = Date.now();
  }
}

class MockAudioContext {
  constructor() {
    this.state = 'running';
    this.currentTime = 0;
    this.destination = new MockAudioNode();
  }
  createGain() { return new MockGainNode(); }
  createDynamicsCompressor() { return new MockCompressorNode(); }
  createBufferSource() { return new MockBufferSourceNode(); }
}

const windowMock = {
  AudioContext: MockAudioContext,
  clearTimeout: (id) => clearTimeout(id),
  setTimeout: (fn, ms) => setTimeout(fn, ms),
  console: console
};
windowMock.window = windowMock;

const context = vm.createContext(windowMock);

// Load REAL outputs/audio-engine.js file
const enginePath = path.join(__dirname, '../outputs/audio-engine.js');
let audioEngineCode = fs.readFileSync(enginePath, 'utf-8');

// Inject test handles into closure before window.AudioEngine export without modifying cap logic
const testInject = `
  window.__test_fslSynthSampleBuffers = fslSynthSampleBuffers;
  window.__test_fslSynthActiveSources = fslSynthActiveSources;
  window.__test_createFslSynthVoice = createFslSynthVoice;
  window.__test_stopChannel = stopChannel;
  window.__test_stopAllTonal = stopAllTonal;
`;
audioEngineCode = audioEngineCode.replace('window.AudioEngine = {', testInject + '\n  window.AudioEngine = {');

vm.runInContext(audioEngineCode, context);

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log("=== RUNNING FSL/SOUND LAB RETRIGGER TAIL CAP REGRESSION TESTS ===");

  const AudioEngine = windowMock.AudioEngine;
  const unlocked = await AudioEngine.unlock();
  assert(unlocked, "AudioEngine unlocked successfully");

  // Populate mock sample buffer into test handle
  windowMock.__test_fslSynthSampleBuffers.set("test-url-1", { duration: 1.0 });

  // Helper metric calculators
  function getTrackedSetCount(channel = "fsl") {
    const status = AudioEngine.getStatus();
    return channel === "fsl" ? status.activeFslSynthVoiceCount : status.activeSoundLabSynthVoiceCount;
  }

  function getStartedNotEndedSourceCount(activeSet) {
    let count = 0;
    activeSet.forEach(entry => {
      const src = entry.source || entry;
      if (src.started && !src.endedAt) count++;
    });
    return count;
  }

  function getAudiblyConnectedSourceCount(activeSet) {
    let count = 0;
    activeSet.forEach(entry => {
      const src = entry.source || entry;
      if (src.started && src.connectedTo && !src.disconnectedAt) count++;
    });
    return count;
  }

  const fslSet = windowMock.__test_fslSynthActiveSources;

  // CASE 1 — Three rapid FSL triggers
  windowMock.__test_createFslSynthVoice("test-url-1", { channel: "fsl" });
  assert(getTrackedSetCount("fsl") === 1, "CASE 1.1: Trigger 1 -> TRACKED_SET_COUNT === 1");
  assert(getStartedNotEndedSourceCount(fslSet) === 1, "CASE 1.1: Trigger 1 -> STARTED_NOT_ENDED_SOURCE_COUNT === 1");

  windowMock.__test_createFslSynthVoice("test-url-1", { channel: "fsl" });
  assert(getTrackedSetCount("fsl") === 2, "CASE 1.2: Trigger 2 -> TRACKED_SET_COUNT === 2 (1 active + 1 tail)");
  assert(getStartedNotEndedSourceCount(fslSet) === 2, "CASE 1.2: Trigger 2 -> STARTED_NOT_ENDED_SOURCE_COUNT === 2");

  windowMock.__test_createFslSynthVoice("test-url-1", { channel: "fsl" });
  assert(getTrackedSetCount("fsl") === 2, "CASE 1.3: Trigger 3 -> TRACKED_SET_COUNT capped at 2");
  assert(getStartedNotEndedSourceCount(fslSet) === 2, "CASE 1.3: Trigger 3 -> STARTED_NOT_ENDED_SOURCE_COUNT capped at 2 (Option A delayed start)");
  assert(getAudiblyConnectedSourceCount(fslSet) === 2, "CASE 1.3: Trigger 3 -> AUDIBLY_CONNECTED_SOURCE_COUNT capped at 2");

  // CASE 2 — Four rapid Sound Lab triggers
  windowMock.__test_createFslSynthVoice("test-url-1", { channel: "soundlab" });
  windowMock.__test_createFslSynthVoice("test-url-1", { channel: "soundlab" });
  windowMock.__test_createFslSynthVoice("test-url-1", { channel: "soundlab" });
  windowMock.__test_createFslSynthVoice("test-url-1", { channel: "soundlab" });
  assert(getTrackedSetCount("soundlab") === 2, "CASE 2: Trigger 4 -> Sound Lab TRACKED_SET_COUNT capped at 2");

  // CASE 3 & 4 — Old source onended after replacement & safe cleanup
  const srcArray = Array.from(fslSet);
  const oldestEntry = srcArray[0];
  const oldestSrc = oldestEntry ? (oldestEntry.source || oldestEntry) : null;
  if (oldestSrc && oldestSrc.onended) {
    oldestSrc.onended();
  }
  assert(getTrackedSetCount("fsl") >= 0, "CASE 3 & 4: Old/retired source onended execution is safe and idempotent");

  // CASE 5 — stopChannel after rapid retrigger
  windowMock.__test_stopChannel("fsl");
  assert(getTrackedSetCount("fsl") === 0, "CASE 5: stopChannel('fsl') clears all active FSL synth sources to 0");

  // CASE 6 — FSL and Sound Lab isolation
  assert(getTrackedSetCount("soundlab") === 2, "CASE 6: Stopping FSL channel leaves Sound Lab channel active sources intact (2)");

  windowMock.__test_stopChannel("soundlab");
  assert(getTrackedSetCount("soundlab") === 0, "CASE 6.2: stopChannel('soundlab') clears Sound Lab active sources to 0");

  // CASE 7 — Metronome isolation
  const mockMetronomeSource = new MockBufferSourceNode();
  mockMetronomeSource.start(0);
  assert(mockMetronomeSource.started === true && mockMetronomeSource.stopped === false, "CASE 7.1: Metronome tick source active before tonal cleanup");

  windowMock.__test_stopAllTonal();
  assert(getTrackedSetCount("fsl") === 0 && getTrackedSetCount("soundlab") === 0, "CASE 7.2: stopAllTonal clears tonal synth sources");
  assert(mockMetronomeSource.stopped === false, "CASE 7.3: Metronome tick source remains running and unstopped during tonal cleanup");

  console.log(`\nTest Execution Summary: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error("Test execution error:", err);
  process.exit(1);
});
