/**
 * Known-Bad Audio Engine Fixture for Qwen Concurrency Hardening Evaluation.
 *
 * Seeding the following lifecycle and concurrency defects:
 * 1. Late callback after logical cancellation
 * 2. First voice not started (fails to resume suspended context)
 * 3. Abrupt stop without gain ramp
 * 4. Double stop race (throws if stop is called twice)
 * 5. Unused releaseQueue
 * 6. Event-order assumption (assumes onended runs before timer)
 * 7. Identity-unsafe cleanup (removes by channel name instead of object identity)
 */

let audioCtx = null;
let activeVoices = {};
let releaseQueue = []; // DEFEECT 5: Unused releaseQueue
let currentRequestGeneration = 0;

function initContext() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

async function triggerVoice(channel, noteUrl) {
    if (!audioCtx) initContext();

    // DEFECT 2: First voice fails to start if context is suspended. Does not call audioCtx.resume()!

    currentRequestGeneration++;
    const requestGen = currentRequestGeneration;

    // Start fetch
    try {
        const response = await fetch(noteUrl);
        const arrayBuf = await response.arrayBuffer();

        // DEFECT 1: Late callback after logical cancellation.
        // It does not check if requestGen matches currentRequestGeneration before decoding and playing!

        const audioBuf = await audioCtx.decodeAudioData(arrayBuf);
        playBuffer(channel, audioBuf);
    } catch (e) {
        console.error("Fetch/decode failed", e);
    }
}

function playBuffer(channel, buffer) {
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;

    const gainNode = audioCtx.createGain();
    source.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    const voiceObj = {
        source,
        gainNode,
        noteUrl: buffer.noteUrl
    };

    // DEFECT 7: Identity-unsafe cleanup. Stores only one voice per channel, overwriting previous!
    // Overlapping same-note triggers will overwrite the reference, causing the first to leak.
    activeVoices[channel] = voiceObj;

    source.start(0);

    // DEFECT 6: Event-order assumption. Sets a timeout to clean up, assuming it matches duration.
    // If the audio buffer duration changes or context is paused, timeout and onended drift.
    source.onended = () => {
        cleanupVoice(channel);
    };

    setTimeout(() => {
        cleanupVoice(channel);
    }, buffer.duration * 1000);
}

function cleanupVoice(channel) {
    const voiceObj = activeVoices[channel];
    if (!voiceObj) return;

    // DEFECT 4: Double stop race. No check if source was already stopped.
    // If source.onended fires first, and setTimeout fires second, this will throw an error!
    voiceObj.source.stop();

    // DEFECT 3: Abrupt stop without gain ramp. Stops immediately causing clicks/pops.
    voiceObj.source.disconnect();
    voiceObj.gainNode.disconnect();

    delete activeVoices[channel];
}

function stopAll(channel) {
    // Identity-unsafe stop: stops whatever is currently stored under the channel key
    cleanupVoice(channel);
}
