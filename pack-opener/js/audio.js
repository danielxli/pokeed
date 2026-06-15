/* Synthesized sound effects — no audio assets needed. */
const Sound = {
  ctx: null,
  enabled: true,
  _noiseBuf: null,

  init() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) { this.enabled = false; return; }
    this.ctx = new AC();
    const len = this.ctx.sampleRate * 1.5;
    this._noiseBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = this._noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  },

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  },

  _ok() {
    if (!this.enabled) return false;
    this.init();
    this.resume();
    return !!this.ctx;
  },

  _noise({ dur = 0.1, freq = 1500, q = 1, gain = 0.3, type = 'bandpass', sweep = 0 }) {
    const t = this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    src.buffer = this._noiseBuf;
    src.loop = true;
    const f = this.ctx.createBiquadFilter();
    f.type = type;
    f.frequency.setValueAtTime(freq, t);
    if (sweep) f.frequency.exponentialRampToValueAtTime(Math.max(60, freq + sweep), t + dur);
    f.Q.value = q;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f).connect(g).connect(this.ctx.destination);
    src.start(t);
    src.stop(t + dur + 0.05);
  },

  _tone({ freq = 440, dur = 0.2, gain = 0.18, type = 'triangle', delay = 0, slide = 0 }) {
    const t = this.ctx.currentTime + delay;
    const o = this.ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(this.ctx.destination);
    o.start(t);
    o.stop(t + dur + 0.05);
  },

  tap() { if (this._ok()) this._tone({ freq: 700, dur: 0.07, gain: 0.1, type: 'sine' }); },

  // Crackly foil rip — strength 0..1 scales loudness/brightness as the drag moves
  rip(strength = 0.5) {
    if (!this._ok()) return;
    this._noise({ dur: 0.06, freq: 1200 + strength * 2200 + Math.random() * 600, q: 2, gain: 0.10 + strength * 0.18 });
  },

  // The big final tear
  tear() {
    if (!this._ok()) return;
    this._noise({ dur: 0.35, freq: 2600, sweep: -2100, q: 1.4, gain: 0.4 });
    this._noise({ dur: 0.22, freq: 800, q: 1, gain: 0.22, type: 'highpass' });
  },

  flip() {
    if (!this._ok()) return;
    this._noise({ dur: 0.14, freq: 900, sweep: 2400, q: 3, gain: 0.12 });
  },

  pop() {
    if (!this._ok()) return;
    this._tone({ freq: 520, dur: 0.1, gain: 0.14, type: 'square', slide: 240 });
  },

  rare() {
    if (!this._ok()) return;
    [659, 830, 988].forEach((f, i) => this._tone({ freq: f, dur: 0.22, gain: 0.14, delay: i * 0.07 }));
  },

  holo() {
    if (!this._ok()) return;
    [523, 659, 784, 1047, 1319].forEach((f, i) =>
      this._tone({ freq: f, dur: 0.45, gain: 0.16, delay: i * 0.09 }));
    this._noise({ dur: 0.9, freq: 6000, q: 0.8, gain: 0.06, type: 'highpass' });
  },

  suspense() {
    if (!this._ok()) return;
    this._tone({ freq: 180, dur: 0.7, gain: 0.1, type: 'sawtooth', slide: 160 });
    this._noise({ dur: 0.7, freq: 4000, q: 0.7, gain: 0.04, type: 'highpass' });
  },

  fanfare() {
    if (!this._ok()) return;
    [523, 659, 784, 1047].forEach((f, i) => this._tone({ freq: f, dur: 0.3, gain: 0.13, delay: i * 0.11 }));
    this._tone({ freq: 1568, dur: 0.55, gain: 0.12, delay: 0.44 });
  }
};
