// ===== AUDIO & SOUND EFFECTS =====
// Web Audio API for game sounds
// ===================================================
// POKEMON EDUCATIONAL ADVENTURE - game.js
// ===================================================

// ===== WEB AUDIO =====
let audioCtx = null;
function getAudio() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
  }
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function playTone(freq, dur, type = 'sine', vol = 0.3, delay = 0) {
  const ctx = getAudio(); if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type; osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, ctx.currentTime + delay);
  gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + delay + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + dur);
  osc.connect(gain); gain.connect(ctx.destination);
  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + dur + 0.05);
}

const SFX = {
  correct() {
    playTone(523, 0.12, 'sine', 0.3, 0);
    playTone(659, 0.12, 'sine', 0.3, 0.12);
    playTone(784, 0.25, 'sine', 0.3, 0.24);
  },
  wrong() {
    playTone(200, 0.1, 'sawtooth', 0.25, 0);
    playTone(150, 0.2, 'sawtooth', 0.25, 0.1);
  },
  click() { playTone(440, 0.06, 'sine', 0.15); },
  whoosh() {
    const ctx = getAudio(); if (!ctx) return;
    const noise = ctx.createOscillator();
    const gain = ctx.createGain();
    noise.type = 'sawtooth';
    noise.frequency.setValueAtTime(400, ctx.currentTime);
    noise.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    noise.connect(gain); gain.connect(ctx.destination);
    noise.start(); noise.stop(ctx.currentTime + 0.4);
  },
  wiggle() {
    playTone(330, 0.08, 'square', 0.2, 0);
    playTone(330, 0.08, 'square', 0.2, 0.15);
    playTone(330, 0.08, 'square', 0.2, 0.30);
  },
  caught() {
    [523,587,659,698,784,880,988,1047].forEach((f,i) => playTone(f, 0.15, 'sine', 0.3, i*0.12));
  },
  badge() {
    [523,659,784,1047,784,659,523,659,784,1047].forEach((f,i) => playTone(f, 0.15, 'triangle', 0.28, i*0.1));
  },
  rocket() {
    playTone(110, 0.15, 'sawtooth', 0.3, 0);
    playTone(147, 0.15, 'sawtooth', 0.3, 0.15);
    playTone(220, 0.3, 'sawtooth', 0.3, 0.3);
  },
  pop() { playTone(600, 0.08, 'sine', 0.2); },
  attack() {
    playTone(220, 0.04, 'square', 0.3, 0);
    playTone(180, 0.08, 'sawtooth', 0.35, 0.04);
    playTone(120, 0.1, 'sawtooth', 0.25, 0.1);
  },
  superEffective() {
    playTone(440, 0.06, 'square', 0.35, 0);
    playTone(554, 0.06, 'square', 0.35, 0.07);
    playTone(659, 0.15, 'square', 0.35, 0.14);
    playTone(880, 0.18, 'sine', 0.3, 0.22);
  },
  notEffective() {
    playTone(180, 0.06, 'triangle', 0.2, 0);
    playTone(150, 0.12, 'triangle', 0.18, 0.08);
  },
  enemyAttack() {
    playTone(110, 0.05, 'sawtooth', 0.3, 0);
    playTone(90, 0.1, 'sawtooth', 0.28, 0.06);
    playTone(70, 0.12, 'sawtooth', 0.22, 0.14);
  }
};

