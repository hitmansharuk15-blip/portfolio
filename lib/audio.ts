// lib/audio.ts

// Create ONE global AudioContext for the whole site
let audioCtx: AudioContext | null = null;

export const playTick = (isMuted: boolean) => {
  if (isMuted) return;
  if (typeof window === "undefined") return;

  try {
    // Initialize the context only once
    if (!audioCtx) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioCtx = new AudioContext();
    }

    // Browsers suspend the context until a user gesture (click) occurs.
    // This line forces it to wake up.
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    // The "Tick" sound
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.05);

    // Volume (slightly louder now so you can definitely hear it)
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
  } catch (e) {
    console.warn("Audio playback failed:", e);
  }
};