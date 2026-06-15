/*
 * Question generator, sandboxed in a Web Worker.
 *
 * Loads the MAIN game's Training Grounds and reuses its two drill generators
 * verbatim — generateMathDrill() and generateReadingDrill() — so the coins
 * quiz asks exactly the math and reading problems the Training Grounds does,
 * and nothing else.
 *
 * It runs OFF the main thread on purpose: if a borrowed generator ever spins
 * (some have unbounded distinct-choice loops), the page just times out the
 * request and respawns the worker instead of freezing.
 */

// Minimal stubs so training.js loads without a DOM / the rest of the game.
self.State = { settings: { level: 3 } };
self.Game = {};
self.window = self;
self.document = {
  addEventListener() {}, removeEventListener() {},
  getElementById() { return null; }, querySelector() { return null; }, querySelectorAll() { return []; },
  createElement() { return { style: {}, classList: { add() {}, remove() {}, toggle() {} }, appendChild() {}, addEventListener() {} }; }
};
self.SFX = new Proxy({}, { get: () => () => {} });

let LOADED = false;
try {
  importScripts('../../js/data.js', '../../js/training.js');
  LOADED = typeof generateMathDrill === 'function' && typeof generateReadingDrill === 'function';
} catch (e) {
  LOADED = false;
}

self.onmessage = e => {
  const { id, grade } = e.data;
  if (!LOADED) { postMessage({ id, ok: false }); return; }
  const lvl = Math.min(Math.max(grade || 2, 1), 5);
  let ch;
  try {
    ch = Math.random() < 0.5 ? generateMathDrill(lvl) : generateReadingDrill(lvl);
  } catch (err) {
    postMessage({ id, ok: false }); return;
  }
  if (ch && Array.isArray(ch.choices) && ch.choices.length >= 2 &&
      (typeof ch.answer === 'string' || typeof ch.answer === 'number')) {
    postMessage({ id, ok: true, challenge: ch, qtype: ch.type });
  } else {
    postMessage({ id, ok: false });
  }
};
