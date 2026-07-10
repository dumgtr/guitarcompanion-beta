(function() {
  'use strict';

  let audioCtx = null;
  let masterGain = null;
  let compressor = null;
  
  // Track active voices by channel name
  const activeVoices = new Map();

  // Note frequency map (A4 = 440Hz)
  const baseFrequencies = {
    'C': 16.35, 'C#': 17.32, 'Db': 17.32, 'D': 18.35, 'D#': 19.45, 'Eb': 19.45,
    'E': 20.60, 'F': 21.83, 'F#': 23.12, 'Gb': 23.12, 'G': 24.50, 'G#': 25.96,
    'Ab': 25.96, 'A': 27.50, 'A#': 29.14, 'Bb': 29.14, 'B': 30.87
  };

  /**
   * Helper: Parse note string (e.g. "C#4", "A") and return frequency.
   * If octave is not provided, defaults to 4.
   */
  function getFrequency(noteString) {
    if (!noteString) return 0;
    const match = noteString.match(/^([A-G][#b]?)(?:(\d))?$/i);
    if (!match) return 0;
    
    let note = match[1];
    let octave = match[2] !== undefined ? parseInt(match[2], 10) : 4;
    
    // Normalize case
    note = note.charAt(0).toUpperCase() + note.slice(1).toLowerCase();
    
    let baseFreq = baseFrequencies[note];
    if (!baseFreq) return 0;
    
    // Calculate frequency based on octave (base is Octave 0)
    let freq = baseFreq * Math.pow(2, octave);
    
    // Enforce safe register bounds (C4 to C5 approximately for loud, clear mobile playback)
    // C4 = ~261Hz, C5 = ~523Hz
    // If it's too low (e.g. below ~190Hz), bump it up. If too high (above ~1000Hz), drop it.
    if (freq > 0) {
      while (freq < 190) freq *= 2;
      while (freq > 1000) freq /= 2;
    }
    
    return freq;
  }

  function initAudio() {
    if (audioCtx) return;
    
    const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextCtor) return; // Fail safely if unsupported
    
    audioCtx = new AudioContextCtor();
    
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.8; // Strict limit to prevent clipping
    
    compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.value = -12;
    compressor.knee.value = 30;
    compressor.ratio.value = 12;
    compressor.attack.value = 0.01;
    compressor.release.value = 0.25;
    
    masterGain.connect(compressor);
    compressor.connect(audioCtx.destination);
  }

  const Engine = {
    unlock() {
      initAudio();
      if (!audioCtx) return false;
      
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      
      // Play silent buffer for iOS unlock
      const buffer = audioCtx.createBuffer(1, 1, 22050);
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      source.start(0);
      
      return true;
    },
    
    isReady() {
      return audioCtx !== null && audioCtx.state === 'running';
    },

    getStatus() {
      return {
        supported: !!(window.AudioContext || window.webkitAudioContext),
        state: audioCtx ? audioCtx.state : 'uninitialized',
        activeChannels: Array.from(activeVoices.keys())
      };
    },
    
    stopChannel(channel) {
      if (activeVoices.has(channel)) {
        const voice = activeVoices.get(channel);
        try {
          const now = audioCtx.currentTime;
          // Fast fade out to avoid pop
          voice.gainNode.gain.cancelScheduledValues(now);
          voice.gainNode.gain.setValueAtTime(voice.gainNode.gain.value, now);
          voice.gainNode.gain.linearRampToValueAtTime(0.001, now + 0.05);
          
          voice.oscNodes.forEach(osc => osc.stop(now + 0.06));
          
          setTimeout(() => {
            voice.gainNode.disconnect();
          }, 100); // give time for disconnect
        } catch (e) {
          // Ignore state errors if already stopped
        }
        activeVoices.delete(channel);
      }
    },
    
    stopAllTonal() {
      // Must only affect channels registered here, NEVER touches Metronome
      Array.from(activeVoices.keys()).forEach(channel => {
        Engine.stopChannel(channel);
      });
    },

    playNote({ channel = "default", profile = "fsl-note-preview", note, velocity = 0.7 }) {
      if (!audioCtx || audioCtx.state !== 'running') return;
      if (!note) return;
      
      const freq = getFrequency(note);
      if (freq <= 0) return;

      // Stop previous note on this channel
      Engine.stopChannel(channel);

      const now = audioCtx.currentTime;
      const voiceGain = audioCtx.createGain();
      voiceGain.connect(masterGain);
      
      const osc1 = audioCtx.createOscillator();
      const oscNodes = [osc1];
      
      // Velocity capping
      const vol = Math.max(0, Math.min(1, velocity));

      if (profile === "fsl-note-preview") {
        // Fast attack, short decay, optimized for tapping
        osc1.type = 'triangle';
        
        voiceGain.gain.setValueAtTime(0, now);
        voiceGain.gain.linearRampToValueAtTime(vol, now + 0.01);
        voiceGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        
        osc1.frequency.setValueAtTime(freq, now);
        
        osc1.connect(voiceGain);
        osc1.start(now);
        osc1.stop(now + 0.35);

      } else if (profile === "soundlab-guide-tone") {
        // Longer sustain, richer tone (triangle + sine)
        osc1.type = 'triangle';
        
        const osc2 = audioCtx.createOscillator();
        osc2.type = 'sine';
        oscNodes.push(osc2);
        
        voiceGain.gain.setValueAtTime(0, now);
        voiceGain.gain.linearRampToValueAtTime(vol, now + 0.05);
        voiceGain.gain.setTargetAtTime(vol * 0.7, now + 0.1, 0.2); // sustain
        voiceGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        
        osc1.frequency.setValueAtTime(freq, now);
        osc2.frequency.setValueAtTime(freq, now); // same octave for thickness
        
        osc1.connect(voiceGain);
        osc2.connect(voiceGain);
        
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 1.25);
        osc2.stop(now + 1.25);
      } else {
        // Fallback basic
        osc1.type = 'sine';
        voiceGain.gain.setValueAtTime(0, now);
        voiceGain.gain.linearRampToValueAtTime(vol, now + 0.02);
        voiceGain.gain.linearRampToValueAtTime(0, now + 0.5);
        osc1.frequency.setValueAtTime(freq, now);
        osc1.connect(voiceGain);
        osc1.start(now);
        osc1.stop(now + 0.5);
      }

      // Register voice
      activeVoices.set(channel, {
        gainNode: voiceGain,
        oscNodes: oscNodes
      });
      
      // Cleanup automatically when done playing based on profile duration
      const duration = profile === "soundlab-guide-tone" ? 1250 : 350;
      setTimeout(() => {
        if (activeVoices.get(channel)?.gainNode === voiceGain) {
          activeVoices.delete(channel);
        }
      }, duration);
    }
  };

  window.AudioEngine = Engine;
})();
