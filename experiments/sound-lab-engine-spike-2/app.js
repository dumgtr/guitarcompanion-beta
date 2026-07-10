document.addEventListener("DOMContentLoaded", () => {
  const chordSelect = document.getElementById("chordSelect");
  const engineSelect = document.getElementById("engineSelect");
  const volumeTrim = document.getElementById("volumeTrim");
  const playBtn = document.getElementById("playBtn");
  const audioStatus = document.getElementById("audioStatus");

  const displayChord = document.getElementById("displayChord");
  const displayGuideTone = document.getElementById("displayGuideTone");
  const displayDesc = document.getElementById("displayDesc");

  const dbgChord = document.getElementById("dbgChord");
  const dbgTone = document.getElementById("dbgTone");
  const dbgFreq = document.getElementById("dbgFreq");
  const dbgEngine = document.getElementById("dbgEngine");

  const chordData = {
    "A7": { guideTone: "C#", freq: 277.18, desc: "3rd of A7, gives dominant major color" },
    "Am7": { guideTone: "C", freq: 261.63, desc: "b3rd of Am7, gives minor sadness" },
    "D7": { guideTone: "F#", freq: 369.99, desc: "3rd of D7, gives bright dominant color" },
    "E7": { guideTone: "G#", freq: 415.30, desc: "3rd of E7, gives bright dominant color" },
    "Cmaj7": { guideTone: "B", freq: 493.88, desc: "7th of Cmaj7, gives major 7th tension" }
  };

  let audioCtx = null;
  let toneSynth = null;
  let audioUnlocked = false;
  let activeVoice = null;

  function updateDisplay() {
    const chord = chordSelect.value;
    const data = chordData[chord];
    
    displayChord.textContent = chord;
    displayGuideTone.textContent = data.guideTone;
    displayDesc.textContent = `${data.guideTone} = ${data.desc}`;
    
    dbgChord.textContent = chord;
    dbgTone.textContent = data.guideTone;
    dbgFreq.textContent = `${data.freq} Hz`;
    dbgEngine.textContent = engineSelect.value;
  }

  async function unlockAudio() {
    audioStatus.textContent = "Unlocking Audio...";
    audioStatus.className = "status-badge";

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!audioCtx && AudioContext) {
      audioCtx = new AudioContext();
    }

    try {
      if (audioCtx && audioCtx.state === "suspended") {
        await audioCtx.resume();
      }

      if (window.Tone) {
        await Tone.start();
      }

      if (window.Tone && !toneSynth) {
        toneSynth = new Tone.PluckSynth().toDestination();
      }
    } catch (error) {
      console.error("Audio unlock failed", error);
      audioUnlocked = false;
      audioStatus.textContent = "Audio Failed";
      audioStatus.className = "status-badge status-failed";
      return false;
    }

    const nativeReady = Boolean(audioCtx && audioCtx.state === "running");
    const toneReady = Boolean(window.Tone && toneSynth);
    if (nativeReady || toneReady) {
      audioUnlocked = true;
      audioStatus.textContent = "Audio Ready";
      audioStatus.className = "status-badge status-ready";
      return true;
    }

    audioUnlocked = false;
    audioStatus.textContent = "Audio Locked";
    audioStatus.className = "status-badge";
    return false;
  }

  function stopActiveVoice() {
    if (!activeVoice) return;

    if (activeVoice.timer) {
      clearTimeout(activeVoice.timer);
    }

    if (activeVoice.stop) {
      try { activeVoice.stop(); } catch {}
    }

    (activeVoice.sources || []).forEach((source) => {
      try { source.stop(); } catch {}
    });

    (activeVoice.nodes || []).forEach((node) => {
      try { node.disconnect(); } catch {}
    });

    activeVoice = null;
  }

  function trackNativeVoice(sources, nodes, cleanupSource) {
    const voice = { sources, nodes };
    activeVoice = voice;

    cleanupSource.addEventListener("ended", () => {
      if (activeVoice !== voice) return;
      nodes.forEach((node) => {
        try { node.disconnect(); } catch {}
      });
      activeVoice = null;
    }, { once: true });
  }

  function trackToneVoice(durationMs = 900) {
    const voice = {
      stop() {
        if (!toneSynth) return;
        try {
          if (typeof toneSynth.triggerRelease === "function") {
            toneSynth.triggerRelease();
          }
        } catch {}
      },
      timer: window.setTimeout(() => {
        if (activeVoice === voice) activeVoice = null;
      }, durationMs)
    };
    activeVoice = voice;
  }

  function ensureToneSynth() {
    if (window.Tone && !toneSynth) {
      toneSynth = new Tone.PluckSynth().toDestination();
    }
  }

  function playNativeSimple(freq, volume) {
    if (!audioCtx) return;
    if (audioCtx.state !== "running") return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.value = freq;
    
    const vol = volume / 100;
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + 0.1);
    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.0);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 1.1);
    trackNativeVoice([osc], [osc, gain], osc);
  }

  function playNativePlucked(freq, volume) {
    if (!audioCtx) return;
    if (audioCtx.state !== "running") return;

    const osc = audioCtx.createOscillator();
    const filter = audioCtx.createBiquadFilter();
    const gain = audioCtx.createGain();
    const compressor = audioCtx.createDynamicsCompressor();
    
    osc.type = 'triangle';
    osc.frequency.value = freq;
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 3, audioCtx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(freq, audioCtx.currentTime + 0.5);

    const vol = volume / 100;
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(compressor);
    compressor.connect(audioCtx.destination);

    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 1.6);
    trackNativeVoice([osc], [osc, filter, gain, compressor], osc);
  }

  function playToneJs(freq, volume) {
    ensureToneSynth();
    if (toneSynth) {
      const vol = (volume / 100) * 20 - 20; // Convert 0-100 to roughly -20 to 0 dB
      toneSynth.volume.value = vol === -20 ? -Infinity : vol;
      try {
        if (typeof toneSynth.triggerRelease === "function") {
          toneSynth.triggerRelease();
        }
      } catch {}
      toneSynth.triggerAttackRelease(freq, "8n");
      trackToneVoice(900);
    } else {
      console.warn("Tone.js not loaded, falling back to Native Plucked");
      playNativePlucked(freq, volume);
    }
  }

  function playDiagnosticLow(freq, volume) {
    // Halve the frequency to simulate a lower register
    playNativePlucked(freq / 2, volume);
  }

  playBtn.addEventListener("click", async () => {
    const ready = await unlockAudio();
    if (!ready) return;
    stopActiveVoice();
    
    const chord = chordSelect.value;
    const engine = engineSelect.value;
    const vol = parseInt(volumeTrim.value, 10);
    const data = chordData[chord];

    updateDisplay();

    switch (engine) {
      case "native-simple":
        playNativeSimple(data.freq, vol);
        break;
      case "native-plucked":
        playNativePlucked(data.freq, vol);
        break;
      case "tonejs-pluck":
        playToneJs(data.freq, vol);
        break;
      case "diagnostic-low":
        playDiagnosticLow(data.freq, vol);
        break;
    }
  });

  chordSelect.addEventListener("change", updateDisplay);
  engineSelect.addEventListener("change", updateDisplay);
  
  updateDisplay();
});
