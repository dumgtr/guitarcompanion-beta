(function() {
  "use strict";

  const AudioEngine = window.AudioEngine;
  const statusJson = document.getElementById("statusJson");
  const audioStateBadge = document.getElementById("audioStateBadge");
  const resultLog = document.getElementById("resultLog");
  const unlockAudioBtn = document.getElementById("unlockAudioBtn");
  const refreshStatusBtn = document.getElementById("refreshStatusBtn");
  const stopFslBtn = document.getElementById("stopFslBtn");
  const stopSoundLabBtn = document.getElementById("stopSoundLabBtn");
  const stopAllBtn = document.getElementById("stopAllBtn");
  const clearLogBtn = document.getElementById("clearLogBtn");
  const playFslA4Btn = document.getElementById("playFslA4Btn");
  const playSoundLabCSharpBtn = document.getElementById("playSoundLabCSharpBtn");
  const runIsolationBtn = document.getElementById("runIsolationBtn");
  const rapidTapBtn = document.getElementById("rapidTapBtn");
  const fslVelocity = document.getElementById("fslVelocity");
  const soundLabVelocity = document.getElementById("soundLabVelocity");
  const fslVelocityValue = document.getElementById("fslVelocityValue");
  const soundLabVelocityValue = document.getElementById("soundLabVelocityValue");

  const PROFILE_BY_CHANNEL = Object.freeze({
    fsl: "fsl-note-preview",
    soundlab: "soundlab-guide-tone"
  });

  function getEngineStatus() {
    if (!AudioEngine || typeof AudioEngine.getStatus !== "function") {
      return {
        supported: false,
        ready: false,
        contextState: "missing",
        activeChannels: [],
        activeVoiceCount: 0,
        availableProfiles: [],
        availableChannels: [],
        engine: "missing",
        lastError: "window.AudioEngine is not available."
      };
    }

    return AudioEngine.getStatus();
  }

  function updateVelocityReadouts() {
    fslVelocityValue.textContent = Number(fslVelocity.value).toFixed(2);
    soundLabVelocityValue.textContent = Number(soundLabVelocity.value).toFixed(2);
  }

  function renderStatus() {
    const status = getEngineStatus();
    statusJson.textContent = JSON.stringify(status, null, 2);

    audioStateBadge.classList.remove("state-ready", "state-failed", "state-locked");
    if (status.ready) {
      audioStateBadge.textContent = "ready";
      audioStateBadge.classList.add("state-ready");
    } else if (!status.supported || status.lastError) {
      audioStateBadge.textContent = status.supported ? "failed" : "unsupported";
      audioStateBadge.classList.add("state-failed");
    } else {
      audioStateBadge.textContent = "locked";
      audioStateBadge.classList.add("state-locked");
    }

    return status;
  }

  function appendLog(operation, returnedValue) {
    const status = renderStatus();
    const entry = document.createElement("article");
    entry.className = "log-entry";

    const returnedLabel = typeof returnedValue === "boolean"
      ? String(returnedValue)
      : JSON.stringify(returnedValue);

    entry.innerHTML = `
      <strong>${operation}</strong>
      <span>returned: <code>${returnedLabel}</code></span>
      <span>active channels: <code>${status.activeChannels.join(", ") || "none"}</code></span>
      <span>active voice count: <code>${status.activeVoiceCount}</code></span>
      <span>lastError: <code>${status.lastError || "none"}</code></span>
      <time>${new Date().toLocaleTimeString()}</time>
    `;

    resultLog.prepend(entry);
  }

  async function runOperation(operation, action) {
    try {
      const returnedValue = await action();
      appendLog(operation, returnedValue);
      return returnedValue;
    } catch (error) {
      appendLog(`${operation} threw: ${error?.message || error}`, false);
      return false;
    }
  }

  function getVelocity(channel) {
    return Number(channel === "fsl" ? fslVelocity.value : soundLabVelocity.value);
  }

  async function playChannelNote(channel, note) {
    if (!AudioEngine || typeof AudioEngine.playNote !== "function") return false;

    return AudioEngine.playNote({
      channel,
      profile: PROFILE_BY_CHANNEL[channel],
      note,
      velocity: getVelocity(channel)
    });
  }

  function wait(ms) {
    return new Promise((resolve) => {
      window.setTimeout(resolve, ms);
    });
  }

  unlockAudioBtn.addEventListener("click", () => {
    runOperation("unlock()", async () => {
      if (!AudioEngine || typeof AudioEngine.unlock !== "function") return false;
      return AudioEngine.unlock();
    });
  });

  refreshStatusBtn.addEventListener("click", () => {
    appendLog("refresh getStatus()", true);
  });

  document.querySelectorAll("[data-play]").forEach((button) => {
    button.addEventListener("click", () => {
      const channel = button.dataset.play;
      const note = button.dataset.note;
      const expected = button.dataset.expected ? `, expected ${button.dataset.expected}` : "";
      runOperation(`playNote(${channel}, ${note}${expected})`, () => playChannelNote(channel, note));
    });
  });

  stopFslBtn.addEventListener("click", () => {
    runOperation("stopChannel(fsl)", () => AudioEngine.stopChannel("fsl"));
  });

  stopSoundLabBtn.addEventListener("click", () => {
    runOperation("stopChannel(soundlab)", () => AudioEngine.stopChannel("soundlab"));
  });

  stopAllBtn.addEventListener("click", () => {
    runOperation("stopAllTonal()", () => AudioEngine.stopAllTonal());
  });

  playFslA4Btn.addEventListener("click", () => {
    runOperation("isolation: play FSL A4", () => playChannelNote("fsl", "A4"));
  });

  playSoundLabCSharpBtn.addEventListener("click", () => {
    runOperation("isolation: play Sound Lab C#4", () => playChannelNote("soundlab", "C#4"));
  });

  runIsolationBtn.addEventListener("click", () => {
    runOperation("isolation sequence", async () => {
      const fslStarted = await playChannelNote("fsl", "A4");
      const soundLabStarted = await playChannelNote("soundlab", "C#4");
      await wait(80);
      const afterBoth = getEngineStatus();
      appendLog(`isolation checkpoint: activeVoiceCount=${afterBoth.activeVoiceCount}`, afterBoth.activeVoiceCount === 2);

      const stoppedFsl = AudioEngine.stopChannel("fsl");
      await wait(80);
      const afterFslStop = getEngineStatus();
      appendLog("isolation checkpoint: Sound Lab remains after Stop FSL", afterFslStop.activeChannels.includes("soundlab"));

      const stoppedSoundLab = AudioEngine.stopChannel("soundlab");
      return fslStarted && soundLabStarted && stoppedFsl && stoppedSoundLab;
    });
  });

  rapidTapBtn.addEventListener("click", () => {
    runOperation("rapid FSL taps", async () => {
      const notes = ["C4", "E4", "A4", "C5", "A4"];
      let allStarted = true;

      for (const note of notes) {
        const started = await playChannelNote("fsl", note);
        allStarted = allStarted && started;
        await wait(75);
      }

      const status = getEngineStatus();
      appendLog("rapid checkpoint: only one FSL voice remains", status.activeChannels.length === 1 && status.activeChannels[0] === "fsl");
      return allStarted && status.activeVoiceCount === 1;
    });
  });

  clearLogBtn.addEventListener("click", () => {
    resultLog.textContent = "";
    appendLog("clear log", true);
  });

  fslVelocity.addEventListener("input", updateVelocityReadouts);
  soundLabVelocity.addEventListener("input", updateVelocityReadouts);

  window.addEventListener("pagehide", () => {
    if (AudioEngine && typeof AudioEngine.stopAllTonal === "function") {
      AudioEngine.stopAllTonal();
    }
  });

  updateVelocityReadouts();
  renderStatus();
  window.setInterval(renderStatus, 750);
})();
