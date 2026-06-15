/* App flow: shop → tear → reveal → summary, plus binder + settings. */

// ---------- persistence ----------

const SAVE_KEY = 'packrip.save.v1';

const STARTER_COINS = 30;   // enough to open one pack right away, then earn more
const QUIZ_REWARD = 1;      // coins gained per correct answer
const QUIZ_PENALTY = 1;     // coins lost per wrong answer (floored at 0)

const Store = {
  collection: {},   // cardId -> count
  coins: STARTER_COINS,
  packsOpened: 0,
  holosPulled: 0,
  sincePity: 0,     // packs opened since last holo (for pity mode)
  settings: { odds: 'generous', sound: true, grade: 2 }
};

function saveStore() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(Store)); } catch (e) { /* private mode etc. */ }
}

function loadStore() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    Object.assign(Store, data);
    Store.settings = Object.assign({ odds: 'generous', sound: true, grade: 2 }, data.settings);
    if (typeof Store.coins !== 'number') Store.coins = STARTER_COINS; // migrate pre-economy saves
  } catch (e) { /* corrupted save — start fresh */ }
}

// ---------- helpers ----------

const $ = sel => document.querySelector(sel);

function showScene(id) {
  document.querySelectorAll('.scene').forEach(s => s.classList.toggle('active', s.id === id));
  window.scrollTo(0, 0);
}

function uniqueOwned(setId) {
  return CARD_SETS[setId].cards.filter(c => Store.collection[c.id]).length;
}

function totalUniqueOwned() {
  return SET_ORDER.reduce((n, s) => n + uniqueOwned(s), 0);
}

function refreshTopbar() {
  $('#binder-count').textContent = totalUniqueOwned();
  updateCoins(false);
}

// ---------- economy ----------

// Update the coin counters; animate=true ticks the number up/down and flips the coin.
function updateCoins(animate) {
  ['#topbar-coins', '#quiz-coins'].forEach(sel => {
    const el = $(sel);
    if (!el) return;
    if (animate) animateCount(el, Store.coins);
    else el.textContent = Store.coins;
  });
  if (animate) {
    document.querySelectorAll('#btn-coins .coin, .quiz-coin-total .coin').forEach(c => {
      c.classList.remove('flip'); void c.offsetWidth; c.classList.add('flip');
    });
  }
}

function animateCount(el, to) {
  const from = parseInt(el.textContent, 10) || 0;
  if (from === to) { el.textContent = to; return; }
  const dur = 450, t0 = performance.now();
  const step = now => {
    const k = Math.min(1, (now - t0) / dur);
    const eased = 1 - Math.pow(1 - k, 2);
    el.textContent = Math.round(from + (to - from) * eased);
    if (k < 1) requestAnimationFrame(step);
    else el.textContent = to;
  };
  requestAnimationFrame(step);
}

// Add (or remove, with negative n) coins. Never drops below 0.
function addCoins(n) {
  Store.coins = Math.max(0, Store.coins + n);
  saveStore();
  updateCoins(true);
}

function spendCoins(n) {
  if (Store.coins < n) return false;
  Store.coins -= n;
  saveStore();
  updateCoins(true);
  return true;
}

let _toastTimer = null;
function pkToast(msg) {
  const t = $('#pk-toast');
  t.textContent = msg;
  t.classList.remove('hidden', 'go');
  void t.offsetWidth;
  t.classList.add('go');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.add('hidden'), 2600);
}

// floating "+1" / "−1" coin change near an element
function coinFloat(el, text, kind) {
  const r = el.getBoundingClientRect();
  const f = document.createElement('div');
  f.className = 'coin-float ' + (kind || 'good');
  f.textContent = text;
  f.style.left = (r.left + r.width / 2) + 'px';
  f.style.top = (r.top) + 'px';
  $('#fx-layer').appendChild(f);
  f.addEventListener('animationend', () => f.remove());
}

// Buy a pack with coins, then open it. Nudges to the quiz if short.
function buyAndOpen(setId, art) {
  const price = PACK_PRICE(setId);
  if (Store.coins < price) {
    Sound.rip(0.2);
    pkToast(`That pack costs ${price} coins. You need ${price - Store.coins} more — earn them with a quiz!`);
    const earn = $('#btn-earn');
    earn.classList.remove('nudge'); void earn.offsetWidth; earn.classList.add('nudge');
    return;
  }
  spendCoins(price);
  startOpening(setId, art);
}

// ---------- FX ----------

const FX_COLORS = ['#ffcc00', '#ff5a5f', '#4fc3f7', '#7be36b', '#ff9ff3', '#fff'];

function confetti(n = 36, originY = 0.35) {
  const layer = $('#fx-layer');
  for (let i = 0; i < n; i++) {
    const p = document.createElement('div');
    p.className = 'confetti';
    p.style.left = (10 + Math.random() * 80) + 'vw';
    p.style.top = (originY * 100 + (Math.random() * 10 - 5)) + 'vh';
    p.style.background = FX_COLORS[Math.floor(Math.random() * FX_COLORS.length)];
    p.style.setProperty('--dx', (Math.random() * 60 - 30) + 'vw');
    p.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
    p.style.animationDelay = (Math.random() * 0.15) + 's';
    p.style.animationDuration = (1 + Math.random() * 0.8) + 's';
    layer.appendChild(p);
    p.addEventListener('animationend', () => p.remove());
  }
}

function foilBits(x, y, n = 4) {
  const layer = $('#fx-layer');
  for (let i = 0; i < n; i++) {
    const p = document.createElement('div');
    p.className = 'foilbit';
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    p.style.setProperty('--dx', (Math.random() * 80 - 40) + 'px');
    p.style.setProperty('--dy', (30 + Math.random() * 80) + 'px');
    layer.appendChild(p);
    p.addEventListener('animationend', () => p.remove());
  }
}

function screenFlash() {
  const f = $('#fx-flash');
  f.classList.remove('go');
  void f.offsetWidth;
  f.classList.add('go');
}

function holoSplash() {
  const h = $('#holo-splash');
  h.classList.remove('hidden', 'go');
  void h.offsetWidth;
  h.classList.add('go');
  setTimeout(() => h.classList.add('hidden'), 1400);
}

// ---------- card element ----------

function tierClass(card) { return 'tier-' + tierOf(card); }

function makeCardEl(card, { faceUp = false } = {}) {
  const el = document.createElement('div');
  el.className = `card3d ${tierClass(card)}`;
  el.innerHTML = `
    <div class="flipper${faceUp ? ' flipped' : ''}">
      <div class="face back"><img class="cardback-img" src="assets/cardback.jpg" alt="" draggable="false"></div>
      <div class="face front">
        <img src="${card.img}" alt="${card.name}" draggable="false" loading="eager">
        <div class="holo-fx"></div>
      </div>
    </div>`;
  return el;
}

// Pointer-tilt + holo-shine tracking on a card element
function enableTilt(el) {
  const flipper = el.querySelector('.flipper');
  const move = e => {
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;   // 0..1
    const py = (e.clientY - r.top) / r.height;
    flipper.style.setProperty('--rx', ((py - 0.5) * -16) + 'deg');
    flipper.style.setProperty('--ry', ((px - 0.5) * 16) + 'deg');
    flipper.style.setProperty('--mx', (px * 100) + '%');
    flipper.style.setProperty('--my', (py * 100) + '%');
  };
  const reset = () => {
    flipper.style.setProperty('--rx', '0deg');
    flipper.style.setProperty('--ry', '0deg');
  };
  el.addEventListener('pointermove', move);
  el.addEventListener('pointerleave', reset);
  el.addEventListener('pointerup', reset);
}

// ---------- shop ----------

function renderShop() {
  const shelf = $('#pack-shelf');
  shelf.innerHTML = '';
  let packIndex = 0;
  for (const setId of SET_ORDER) {
    const set = CARD_SETS[setId];
    const owned = uniqueOwned(setId);
    const row = document.createElement('div');
    row.className = 'shelf-row';
    row.innerHTML = `
      <div class="shelf-head">
        <span class="shelf-name">${set.name}</span>
        <span class="shelf-prog">${owned}/${set.total}</span>
      </div>
      <div class="shelf-packs"></div>
      <div class="shelf-ledge" aria-hidden="true"></div>`;
    const packsWrap = row.querySelector('.shelf-packs');
    for (const artKey of SET_META[setId].packArts) {
      const art = PACK_ART_URL(setId, artKey);
      const btn = document.createElement('button');
      btn.className = 'pack';
      btn.style.animationDelay = (packIndex++ * 0.05) + 's';
      btn.innerHTML = `
        <div class="pack-foil">
          <img src="${art}" alt="${set.name} ${artKey} booster pack" draggable="false">
          <div class="pack-shine" style="-webkit-mask-image:url('${art}');mask-image:url('${art}')"></div>
        </div>
        <div class="pack-price"><span class="coin tiny" aria-hidden="true"></span>${PACK_PRICE(setId)}</div>`;
      btn.addEventListener('click', () => { Sound.tap(); buyAndOpen(setId, art); });
      packsWrap.appendChild(btn);
    }
    shelf.appendChild(row);
  }

  // pity meter
  const pity = Store.settings.odds === 'pity';
  $('#pity-wrap').classList.toggle('hidden', !pity);
  if (pity) {
    const pips = $('#pity-pips');
    pips.innerHTML = '';
    const need = ODDS_MODES.pity.pityAt;
    for (let i = 0; i < need; i++) {
      const pip = document.createElement('span');
      pip.className = 'pip' + (i < Store.sincePity ? ' lit' : '');
      pips.appendChild(pip);
    }
  }

  const stats = $('#shop-stats');
  stats.textContent = Store.packsOpened
    ? `${Store.packsOpened} packs ripped · ${Store.holosPulled} holos pulled`
    : '';
  refreshTopbar();
}

// ---------- opening flow ----------

const Open = {
  setId: null,
  art: null,         // packshot image url for this opening
  pack: null,        // {cards, hasHolo, pityTriggered}
  idx: 0,
  revealed: [],      // {card, isNew}
  busy: false
};

// Default tear height (% of pack) used to seed/heal; the live rip follows the finger.
const TEAR_Y = 11;
// thickness of the silvery torn-foil ribbon, in % of pack height
const EDGE_H = 1.4;

/*
 * Build the four clip-paths for a tear whose line is the finger's traced
 * path. `pts` is the recorded path ([{x, y}] in %, x increasing); `frontX`
 * is the tear front (the finger's current x).
 *   body     — the pack that stays (everything below the path, plus the
 *              still-sealed part to the right of the front)
 *   flap     — the strip above the path, left of the front, that peels off
 *   edgeFlap — silvery ribbon on the underside of the flap
 *   edgeBody — silvery ribbon along the body's torn top
 */
function tearPolys(pts, frontX) {
  const fx = frontX.toFixed(2);
  const s = arr => arr.map(p => `${p[0].toFixed(2)}% ${p[1].toFixed(2)}%`).join(', ');
  const fwd = pts.map(p => [p.x, p.y]);
  const rev = [...fwd].reverse();
  const revUp = rev.map(p => [p[0], p[1] - EDGE_H]);
  const revDn = rev.map(p => [p[0], p[1] + EDGE_H]);
  return {
    flap: `polygon(0% 0%, ${fx}% 0%, ${s(rev)})`,
    body: `polygon(${s(fwd)}, ${fx}% 0%, 100% 0%, 100% 100%, 0% 100%)`,
    edgeFlap: `polygon(${s(fwd)}, ${s(revUp)})`,
    edgeBody: `polygon(${s(fwd)}, ${s(revDn)})`
  };
}

// Push the current tear state to the DOM.
function applyTear(bp, pts, frontX, frontY) {
  const p = tearPolys(pts, frontX);
  bp.querySelector('.bp-body-img').style.clipPath = p.body;
  bp.querySelector('.bp-tear-img').style.clipPath = p.flap;
  bp.querySelector('.bp-flap-edge').style.clipPath = p.edgeFlap;
  bp.querySelector('.bp-torn-edge').style.clipPath = p.edgeBody;
  bp.querySelector('.bp-shine').style.clipPath = p.body;
  bp.querySelector('.bp-flap').style.transformOrigin = `${frontX}% ${frontY}%`;
  const spark = bp.querySelector('.bp-spark');
  spark.style.left = frontX + '%';
  spark.style.top = frontY + '%';
  bp.style.setProperty('--tear', (frontX / 100).toFixed(3));
}

// Reset to a sealed, untorn pack.
function resetTear(bp) {
  const none = 'polygon(0 0, 0 0, 0 0)';
  bp.querySelector('.bp-body-img').style.clipPath = 'none';
  bp.querySelector('.bp-shine').style.clipPath = 'none';
  bp.querySelector('.bp-tear-img').style.clipPath = none;
  bp.querySelector('.bp-flap-edge').style.clipPath = none;
  bp.querySelector('.bp-torn-edge').style.clipPath = none;
  const spark = bp.querySelector('.bp-spark');
  spark.style.left = ''; spark.style.top = '';
  bp.style.setProperty('--tear', 0);
}

// Released before finishing: animate the rip closing back up.
function healTear(bp, pts) {
  if (pts.length < 2) { resetTear(bp); return; }
  const start = pts[pts.length - 1].x;
  const t0 = performance.now();
  const dur = 260;
  const step = now => {
    const k = Math.min(1, (now - t0) / dur);
    const front = start * (1 - k);
    const sub = pts.filter(p => p.x <= front);
    if (!sub.length) sub.push({ x: 0, y: pts[0].y });
    applyTear(bp, sub, front, sub[sub.length - 1].y);
    if (k < 1) requestAnimationFrame(step);
    else resetTear(bp);
  };
  requestAnimationFrame(step);
}

function startOpening(setId, art) {
  Open.setId = setId;
  Open.art = art || randomPackArt(setId);
  Open.pack = generatePack(setId, Store.settings.odds, Store.sincePity);
  Open.idx = 0;
  Open.revealed = [];
  Open.busy = false;

  // preload card faces while the kid is busy tearing
  Open.pack.cards.forEach(c => { const im = new Image(); im.src = c.img; });

  const bp = $('#big-pack');
  bp.querySelector('.bp-body-img').src = Open.art;
  bp.querySelector('.bp-tear-img').src = Open.art;

  // shine is masked to the pack silhouette (clip is set per-frame to the body)
  const shine = bp.querySelector('.bp-shine');
  shine.style.webkitMaskImage = `url('${Open.art}')`;
  shine.style.maskImage = `url('${Open.art}')`;

  resetTear(bp);
  $('#big-pack-wrap').classList.remove('hidden', 'torn');
  bp.classList.remove('strip-off', 'snap');
  $('#card-stage').classList.add('hidden');
  $('#summary').classList.add('hidden');
  $('#tear-hint').classList.remove('hidden');

  showScene('scene-open');
}

// --- tear interaction ---

function initTear() {
  const bp = $('#big-pack');
  let dragging = false, done = false, rect = null, maxX = 0, lastRip = 0;
  let pts = [];

  // keep the rip in the upper band so the pack always has a body to hold cards
  const clampY = y => Math.max(5, Math.min(24, y));
  const pctX = e => (e.clientX - rect.left) / rect.width * 100;
  const pctY = e => (e.clientY - rect.top) / rect.height * 100;

  bp.addEventListener('pointerdown', e => {
    if (!$('#card-stage').classList.contains('hidden')) return;
    if (bp.classList.contains('strip-off')) return;
    dragging = true;
    done = false;
    bp.classList.remove('snap');
    rect = bp.getBoundingClientRect();
    const x = pctX(e), y = clampY(pctY(e));
    pts = [{ x: 0, y }];                       // always anchor the rip at the left edge
    if (x > 2) pts.push({ x: Math.min(x, 99), y });
    maxX = Math.max(0, Math.min(x, 99));
    lastRip = maxX;
    bp.setPointerCapture(e.pointerId);
    Sound.init(); Sound.resume();
    applyTear(bp, pts, maxX, y);
  });

  bp.addEventListener('pointermove', e => {
    if (!dragging || done) return;
    const x = pctX(e), y = clampY(pctY(e));
    if (x > maxX + 1.4) {                       // only advance rightward — keeps the path clean
      maxX = Math.min(x, 99);
      pts.push({ x: maxX, y });
      applyTear(bp, pts, maxX, y);
      if (maxX - lastRip > 4) {
        Sound.rip(maxX / 100);
        foilBits(rect.left + rect.width * maxX / 100, rect.top + rect.height * y / 100, 3);
        lastRip = maxX;
      }
    }
    if (maxX >= 90) { done = true; dragging = false; finishTear(pts); }
  });

  const stop = () => {
    if (done || !dragging) return;
    dragging = false;
    healTear(bp, pts);                          // didn't make it across — the rip closes back up
    pts = []; maxX = 0;
  };
  bp.addEventListener('pointerup', stop);
  bp.addEventListener('pointercancel', stop);
  bp.addEventListener('lostpointercapture', stop);
}

function finishTear(pts) {
  const bp = $('#big-pack');
  const lastY = pts.length ? pts[pts.length - 1].y : TEAR_Y;
  pts.push({ x: 100, y: lastY });               // auto-rip the last sliver so the whole strip frees
  applyTear(bp, pts, 100, lastY);
  Sound.tear();
  bp.classList.add('strip-off');
  $('#tear-hint').classList.add('hidden');
  const r = bp.getBoundingClientRect();
  foilBits(r.left + r.width / 2, r.top + r.height * (lastY / 100), 14);
  confetti(20, 0.25);

  setTimeout(() => {
    $('#big-pack-wrap').classList.add('torn');
    setTimeout(showPile, 450);
  }, 350);
}

// --- reveal ---

function showPile() {
  $('#big-pack-wrap').classList.add('hidden');
  const stage = $('#card-stage');
  stage.classList.remove('hidden');
  const pile = $('#card-pile');
  pile.innerHTML = '';

  Open.pack.cards.forEach((card, i) => {
    const el = makeCardEl(card);
    el.style.zIndex = Open.pack.cards.length - i;
    el.classList.add('in-pile');
    if (i === 0) el.classList.add('top');
    else if (i === 1) el.classList.add('under1');
    else if (i === 2) el.classList.add('under2');
    el.dataset.idx = i;
    pile.appendChild(el);
  });

  updateRevealCount();
  $('#reveal-hint').textContent = 'Tap the card!';
  pile.onclick = onPileTap;
}

function updateRevealCount() {
  $('#reveal-count').textContent = `${Open.idx} / ${Open.pack.cards.length}`;
}

function onPileTap() {
  if (Open.busy) return;
  const pile = $('#card-pile');
  const el = pile.querySelector('.card3d.top');
  if (!el) return;
  const card = Open.pack.cards[+el.dataset.idx];
  const flipped = el.querySelector('.flipper').classList.contains('flipped');
  if (!flipped) revealCard(el, card);
  else dismissCard(el, card);
}

function revealCard(el, card) {
  Open.busy = true;
  const tier = tierOf(card);
  const flipper = el.querySelector('.flipper');

  const doFlip = () => {
    Sound.flip();
    flipper.classList.add('flipped');
    const isNew = !Store.collection[card.id];
    Store.collection[card.id] = (Store.collection[card.id] || 0) + 1;
    Open.revealed.push({ card, isNew });
    Open.idx++;
    updateRevealCount();
    saveStore();
    refreshTopbar();

    setTimeout(() => {
      if (isNew) {
        const b = document.createElement('div');
        b.className = 'new-badge';
        b.textContent = 'NEW!';
        el.appendChild(b);
      }
      if (tier === 'holo') {
        Sound.holo(); screenFlash(); holoSplash(); confetti(50, 0.3);
      } else if (tier === 'rare') {
        Sound.rare(); confetti(18, 0.35);
      } else {
        Sound.pop();
      }
      enableTilt(el);
      $('#reveal-hint').textContent = 'Tap again for the next one!';
      Open.busy = false;
    }, tier === 'holo' ? 500 : 380);
  };

  if (tier === 'holo') {
    // suspense: rumble + rainbow glow leak before the flip
    Sound.suspense();
    el.classList.add('suspense');
    $('#reveal-hint').textContent = '…whoa…';
    setTimeout(() => { el.classList.remove('suspense'); doFlip(); }, 950);
  } else {
    doFlip();
  }
}

function dismissCard(el, card) {
  Open.busy = true;
  Sound.flip();
  el.classList.remove('top');
  el.classList.add('fly-out');
  el.style.setProperty('--fly-x', (Math.random() < 0.5 ? -1 : 1) * (60 + Math.random() * 40) + 'vw');
  el.style.setProperty('--fly-r', (Math.random() * 50 - 25) + 'deg');

  const pile = $('#card-pile');
  const rest = [...pile.querySelectorAll('.card3d:not(.fly-out)')];
  rest.forEach((c, i) => {
    c.classList.remove('top', 'under1', 'under2');
    if (i === 0) c.classList.add('top');
    else if (i === 1) c.classList.add('under1');
    else if (i === 2) c.classList.add('under2');
  });

  setTimeout(() => el.remove(), 600);

  if (rest.length === 0) {
    setTimeout(finishPack, 550);
  } else {
    $('#reveal-hint').textContent = 'Tap the card!';
    Open.busy = false;
  }
}

function finishPack() {
  Store.packsOpened++;
  if (Open.pack.hasHolo) { Store.holosPulled++; Store.sincePity = 0; }
  else Store.sincePity++;
  saveStore();

  Sound.fanfare();
  confetti(40, 0.2);

  const grid = $('#summary-grid');
  grid.innerHTML = '';
  let newCount = 0;
  Open.revealed.forEach(({ card, isNew }, i) => {
    if (isNew) newCount++;
    const d = document.createElement('div');
    d.className = `sum-card ${tierClass(card)}` + (isNew ? ' is-new' : '');
    d.style.animationDelay = (i * 0.07) + 's';
    d.innerHTML = `<img src="${card.img}" alt="${card.name}" draggable="false">` +
      (isNew ? '<span class="sum-new">NEW!</span>' : '');
    d.addEventListener('click', () => openZoom(card));
    grid.appendChild(d);
  });

  const bits = [`${newCount} new card${newCount === 1 ? '' : 's'} for your binder!`];
  if (Open.pack.hasHolo) bits.push('You pulled a HOLO! ✨');
  if (Open.pack.pityTriggered) bits.push('Your Luck Meter paid off! ⚡');
  $('#summary-stats').textContent = bits.join(' ');
  $('#summary-title').textContent = Open.pack.hasHolo ? 'AMAZING PULLS!' : 'You got…';

  $('#card-stage').classList.add('hidden');
  $('#summary').classList.remove('hidden');
  Open.busy = false;
}

// ---------- binder ----------

let binderSet = 'base1';

function renderBinder() {
  const tabs = $('#binder-tabs');
  tabs.innerHTML = '';
  for (const setId of SET_ORDER) {
    const b = document.createElement('button');
    b.className = 'binder-tab' + (setId === binderSet ? ' active' : '');
    b.textContent = CARD_SETS[setId].name;
    b.addEventListener('click', () => { Sound.tap(); binderSet = setId; renderBinder(); });
    tabs.appendChild(b);
  }

  const set = CARD_SETS[binderSet];
  const owned = uniqueOwned(binderSet);
  $('#binder-bar-fill').style.width = (owned / set.total * 100) + '%';
  $('#binder-bar-label').textContent = `${owned} / ${set.total} collected`;

  const grid = $('#binder-grid');
  grid.innerHTML = '';
  for (const card of set.cards) {
    const count = Store.collection[card.id] || 0;
    const d = document.createElement('div');
    d.className = 'binder-slot' + (count ? ' owned' : '') +
      (tierOf(card) === 'holo' ? ' holo' : '');
    d.innerHTML = `
      <img src="${card.img}" alt="${count ? card.name : '???'}" loading="lazy" draggable="false">
      <span class="slot-num">${card.num}</span>
      ${count > 1 ? `<span class="slot-count">×${count}</span>` : ''}`;
    if (count) d.addEventListener('click', () => { Sound.tap(); openZoom(card); });
    grid.appendChild(d);
  }
}

// ---------- zoom modal ----------

function openZoom(card) {
  const modal = $('#modal-card');
  $('#zoom-img').src = card.imgHi || card.img;
  const zc = $('#zoom-card');
  zc.className = `card3d zoomed ${tierClass(card)}`;
  const count = Store.collection[card.id] || 0;
  $('#zoom-info').innerHTML =
    `<b>${card.name}</b> · ${CARD_SETS[cardSetOf(card)].name} #${card.num}` +
    `<br>${card.rarity}${count ? ` · You have ×${count}` : ''}`;
  modal.classList.remove('hidden');
  enableTilt(zc);
}

function cardSetOf(card) {
  return card.id.split('-')[0];
}

// ---------- settings ----------

function openSettings() {
  document.querySelectorAll('input[name="odds"]').forEach(r => {
    r.checked = r.value === Store.settings.odds;
  });
  $('#opt-sound').checked = Store.settings.sound;
  buildGradeOpts();
  resetArmed = false;
  $('#btn-reset').textContent = '🗑️ Reset collection';
  $('#btn-reset').classList.remove('armed');
  $('#modal-settings').classList.remove('hidden');
}

// grade picker shared between the settings panel and the quiz scene
function buildGradeOpts() {
  const wrap = $('#grade-opts');
  if (!wrap) return;
  wrap.innerHTML = '';
  GRADES.forEach((g, i) => {
    const b = document.createElement('button');
    b.className = 'grade-opt' + ((Store.settings.grade || 2) === i + 1 ? ' active' : '');
    b.innerHTML = `<b>${g.short}</b><small>${g.name}</small>`;
    b.addEventListener('click', () => {
      Store.settings.grade = i + 1;
      QuizUI.grade = i + 1;
      QuizUI.nextBuf = null;
      saveStore();
      buildGradeOpts();
      Sound.tap();
    });
    wrap.appendChild(b);
  });
}

let resetArmed = false;

function initSettings() {
  document.querySelectorAll('input[name="odds"]').forEach(r => {
    r.addEventListener('change', () => {
      Store.settings.odds = r.value;
      saveStore();
      Sound.tap();
    });
  });
  $('#opt-sound').addEventListener('change', e => {
    Store.settings.sound = e.target.checked;
    Sound.enabled = e.target.checked;
    saveStore();
    if (e.target.checked) Sound.tap();
  });
  $('#btn-reset').addEventListener('click', () => {
    if (!resetArmed) {
      resetArmed = true;
      $('#btn-reset').textContent = '⚠️ Really delete everything? Tap again';
      $('#btn-reset').classList.add('armed');
      return;
    }
    Store.collection = {};
    Store.packsOpened = 0;
    Store.holosPulled = 0;
    Store.sincePity = 0;
    saveStore();
    resetArmed = false;
    $('#btn-reset').textContent = '✅ Collection reset';
    $('#btn-reset').classList.remove('armed');
    renderShop();
  });
  $('#btn-settings-close').addEventListener('click', () => {
    $('#modal-settings').classList.add('hidden');
    Sound.tap();
    renderShop();
  });
}

// ---------- quiz: earn coins by answering math/reading questions ----------

const GRADES = [
  { short: 'Pre-K', name: 'Pre-K' },
  { short: 'K',     name: 'Kindergarten' },
  { short: '1st',   name: '1st Grade' },
  { short: '2–3',   name: '2nd–3rd Grade' },
  { short: '4–5',   name: '4th–5th Grade' }
];

// Generates questions in a Web Worker so a hanging generator can't freeze the page.
const Quiz = {
  worker: null, seq: 0, pending: null,
  ensure() {
    if (this.worker) return;
    try { this.worker = new Worker('js/quiz-worker.js'); }
    catch (e) { this.worker = null; return; }
    this.worker.onmessage = ev => {
      const p = this.pending;
      if (!p || ev.data.id !== p.id) return;
      clearTimeout(p.timer);
      this.pending = null;
      p.resolve(ev.data);
    };
    this.worker.onerror = () => {}; // timeout path handles failures
  },
  ask(grade) {
    return new Promise(resolve => {
      this.ensure();
      if (!this.worker) { resolve({ ok: false }); return; }
      const id = ++this.seq;
      const timer = setTimeout(() => {       // worker stuck in a generator loop — kill & respawn
        try { this.worker.terminate(); } catch (e) {}
        this.worker = null; this.pending = null;
        resolve({ ok: false, hung: true });
      }, 600);
      this.pending = { id, timer, resolve };
      this.worker.postMessage({ id, grade });
    });
  },
  async next(grade) {
    for (let attempt = 0; attempt < 10; attempt++) {
      const res = await this.ask(grade);
      if (res && res.ok && res.challenge) return res.challenge;
    }
    return localQuestion(grade); // generators unavailable — never leave the kid stuck
  }
};

// Safe, hang-proof fallback question if the worker can't deliver.
function localQuestion(grade) {
  const max = grade <= 1 ? 5 : grade <= 2 ? 9 : grade <= 3 ? 12 : 20;
  const a = 1 + Math.floor(Math.random() * max);
  const b = 1 + Math.floor(Math.random() * max);
  const answer = a + b;
  const set = new Set([answer]);
  while (set.size < 4) {
    const w = answer + (Math.floor(Math.random() * 7) - 3);
    if (w > 0 && w !== answer) set.add(w);
  }
  return { type: 'math', question: `${a} + ${b} = ?`, answer, choices: [...set].sort(() => Math.random() - 0.5) };
}

const PRAISE = ['Nice! 🌟', 'You got it! 🎉', 'Great job! 💪', 'Awesome! ⚡', 'Correct! ✅', 'Smart! 🧠'];

const QuizUI = {
  grade: 2, current: null, busy: false, nextBuf: null, earned: 0,

  async open() {
    this.grade = Store.settings.grade || 2;
    this.earned = 0;
    $('#quiz-earned').textContent = '';
    updateCoins(false);
    showScene('scene-quiz');
    this.nextBuf = null;
    await this.serve();
  },

  async serve() {
    this.busy = true;
    $('#quiz-feedback').textContent = '';
    $('#quiz-choices').innerHTML = '';
    $('#quiz-q').textContent = '…';
    $('#quiz-passage').classList.add('hidden');
    let ch = this.nextBuf; this.nextBuf = null;
    if (!ch) ch = await Quiz.next(this.grade);
    // ignore a stale result if the user already left the quiz
    if (!$('#scene-quiz').classList.contains('active')) return;
    this.current = ch;
    renderQuestion(ch);
    this.busy = false;
    this.prefetch();
  },

  async prefetch() {
    const g = this.grade;
    if (!this.nextBuf) {
      const ch = await Quiz.next(g);
      if (g === this.grade) this.nextBuf = ch; // drop if grade changed meanwhile
    }
  },

  answer(choice, btn) {
    if (this.busy) return;
    this.busy = true;
    const correct = String(choice) === String(this.current.answer);
    const buttons = [...$('#quiz-choices').querySelectorAll('button')];
    buttons.forEach(b => { b.disabled = true; });

    if (correct) {
      btn.classList.add('correct');
      Sound.rare();
      addCoins(QUIZ_REWARD);
      this.earned += QUIZ_REWARD;
      $('#quiz-earned').textContent = `${this.earned >= 0 ? '+' : ''}${this.earned} this round`;
      coinFloat(btn, `+${QUIZ_REWARD}`, 'good');
      $('#quiz-feedback').textContent = PRAISE[Math.floor(Math.random() * PRAISE.length)];
      $('#quiz-feedback').className = 'quiz-feedback good';
      setTimeout(() => this.serve(), 800);
    } else {
      btn.classList.add('wrong');
      Sound.rip(0.3);
      const lost = Math.min(QUIZ_PENALTY, Store.coins); // can't go below 0
      addCoins(-QUIZ_PENALTY);
      this.earned -= lost;
      $('#quiz-earned').textContent = `${this.earned >= 0 ? '+' : ''}${this.earned} this round`;
      if (lost > 0) coinFloat(btn, `−${lost}`, 'bad');
      buttons.forEach(b => { if (String(b.dataset.val) === String(this.current.answer)) b.classList.add('correct'); });
      $('#quiz-feedback').textContent = `The answer is ${this.current.answer}`;
      $('#quiz-feedback').className = 'quiz-feedback bad';
      setTimeout(() => this.serve(), 1500);
    }
  }
};

function renderQuestion(ch) {
  const pass = $('#quiz-passage');
  if (ch.passage) { pass.textContent = ch.passage; pass.classList.remove('hidden'); }
  else pass.classList.add('hidden');

  const q = $('#quiz-q');
  q.innerHTML = '';
  const main = document.createElement('div');
  main.textContent = ch.question;
  q.appendChild(main);
  if (ch.hint) {
    const h = document.createElement('small');
    h.className = 'quiz-hint';
    h.textContent = ch.hint;
    q.appendChild(h);
  }

  const wrap = $('#quiz-choices');
  wrap.innerHTML = '';
  // emoji-only choices (CVC) get bigger buttons
  const emojiMode = ch.choices.every(c => typeof c === 'string' && /\p{Emoji}/u.test(c) && c.length <= 3);
  ch.choices.forEach(c => {
    const b = document.createElement('button');
    b.className = 'quiz-choice' + (emojiMode ? ' emoji' : '');
    b.dataset.val = c;
    b.textContent = c;
    b.addEventListener('click', () => QuizUI.answer(c, b));
    wrap.appendChild(b);
  });
}

function openQuiz() { Sound.tap(); QuizUI.open(); }

// ---------- boot ----------

function init() {
  loadStore();
  Sound.enabled = Store.settings.sound;

  renderShop();
  initTear();
  initSettings();
  Quiz.ensure(); // warm up the question worker so the first quiz question is instant

  $('#btn-binder').addEventListener('click', () => { Sound.tap(); renderBinder(); showScene('scene-binder'); });
  $('#btn-binder-back').addEventListener('click', () => { Sound.tap(); renderShop(); showScene('scene-shop'); });
  $('#btn-settings').addEventListener('click', () => { Sound.tap(); openSettings(); });
  $('#btn-open-back').addEventListener('click', () => { Sound.tap(); renderShop(); showScene('scene-shop'); });

  $('#btn-earn').addEventListener('click', openQuiz);
  $('#btn-coins').addEventListener('click', openQuiz);
  $('#btn-quiz-back').addEventListener('click', () => { Sound.tap(); renderShop(); showScene('scene-shop'); });

  $('#btn-again').addEventListener('click', () => buyAndOpen(Open.setId, Open.art));
  $('#btn-to-binder').addEventListener('click', () => { Sound.tap(); binderSet = Open.setId; renderBinder(); showScene('scene-binder'); });
  $('#btn-to-shop').addEventListener('click', () => { Sound.tap(); renderShop(); showScene('scene-shop'); });

  $('#btn-zoom-close').addEventListener('click', () => { Sound.tap(); $('#modal-card').classList.add('hidden'); });
  document.querySelectorAll('.modal-backdrop').forEach(b =>
    b.addEventListener('click', e => e.target.closest('.modal').classList.add('hidden')));

  // unlock audio on first interaction (mobile autoplay policy)
  document.addEventListener('pointerdown', () => { Sound.init(); Sound.resume(); }, { once: true });
}

init();
