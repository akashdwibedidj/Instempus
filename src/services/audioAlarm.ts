// Web Audio API Campus Emergency Siren Generator
let audioCtx: AudioContext | null = null;
let oscillator: OscillatorNode | null = null;
let gainNode: GainNode | null = null;
let sirenInterval: any = null;

export function playEmergencySiren() {
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (oscillator) {
      stopEmergencySiren();
    }

    oscillator = audioCtx.createOscillator();
    gainNode = audioCtx.createGain();

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(700, audioCtx.currentTime);

    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();

    // Alternate frequency to create authentic European/American emergency oscillation
    let high = false;
    sirenInterval = setInterval(() => {
      if (!audioCtx || !oscillator) return;
      high = !high;
      const freq = high ? 950 : 650;
      oscillator.frequency.setTargetAtTime(freq, audioCtx.currentTime, 0.15);
    }, 400);
  } catch (err) {
    console.error('AudioContext emergency siren could not start automatically:', err);
  }
}

export function stopEmergencySiren() {
  try {
    if (sirenInterval) {
      clearInterval(sirenInterval);
      sirenInterval = null;
    }
    if (oscillator) {
      oscillator.stop();
      oscillator.disconnect();
      oscillator = null;
    }
    if (gainNode) {
      gainNode.disconnect();
      gainNode = null;
    }
  } catch (err) {
    console.error('Error stopping emergency siren:', err);
  }
}
