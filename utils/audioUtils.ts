let audioCtx: AudioContext | null = null;
let oscillator: OscillatorNode | null = null;
let gainNode: GainNode | null = null;

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
};

export const startAlarmSound = () => {
  initAudio();
  if (!audioCtx) return;

  // Stop any existing sound
  stopAlarmSound();

  oscillator = audioCtx.createOscillator();
  gainNode = audioCtx.createGain();

  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
  
  // Create a pulsing effect
  oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
  oscillator.frequency.setValueAtTime(880, audioCtx.currentTime + 0.5);
  oscillator.frequency.setTargetAtTime(440, audioCtx.currentTime + 1.0, 0.1);

  // Envelope
  gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.1);
  gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
  gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.6);
  gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.0);

  // Loop the pulsing
  // In a real sophisticated app we might use an AudioBuffer, 
  // but for a simple synthesized beep, we can re-trigger or use an LFO. 
  // For simplicity here, we'll just set a simple continuous beep-beep pattern.
  
  // Let's redo simple continuous beep
  oscillator.disconnect();
  oscillator = audioCtx.createOscillator();
  gainNode = audioCtx.createGain();
  
  oscillator.type = 'sine';
  oscillator.frequency.value = 880;
  
  // LFO for volume to make it beep
  const lfo = audioCtx.createOscillator();
  lfo.type = 'square';
  lfo.frequency.value = 2; // 2 beeps per second
  
  const lfoGain = audioCtx.createGain();
  lfoGain.gain.value = 2000;
  
  lfo.connect(gainNode.gain);
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  oscillator.start();
  lfo.start();
  
  // Store lfo to stop it later (attaching to oscillator object for convenience here is hacky, so we keep track of main source)
  (oscillator as any).stopLfo = () => lfo.stop();
};

export const stopAlarmSound = () => {
  if (oscillator) {
    try {
      oscillator.stop();
      if ((oscillator as any).stopLfo) {
        (oscillator as any).stopLfo();
      }
      oscillator.disconnect();
    } catch (e) {
      // Ignore if already stopped
    }
    oscillator = null;
  }
};
