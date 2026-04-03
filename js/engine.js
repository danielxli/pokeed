// ===== GAME ENGINE =====
// State management, scene transitions, confetti, UI updates, XP
// ===== GAME STATE =====
const State = {
  trainerName: 'Trainer',
  level: 1,
  xp: 0,
  caught: [],         // array of pokemon IDs (active roster)
  seen: [],            // array of pokemon IDs ever caught/owned (for Pokedex)
  pokemonHp: {},       // { pokemonId: currentHp } — persistent HP tracker
  pokemonXp: {},       // { pokemonId: trainingXp } — training XP for evolution
  badges: [],          // array of gym IDs earned
  eliteFourDefeated: [], // array of Elite Four indices defeated
  currentScene: 'title',
  settings: {
    level: 3,         // default = 1st Grade / "Junior Trainer"
  },
  encounter: {
    pokemon: null,
    cluesUnlocked: 0, // 0-5 (0 = type shown, 1-5 = others unlocked)
    guessUsed: false,
    ballsLeft: 3,
    pendingChallenge: null,
    awaitingThrow: false,
  },
  gym: {
    selected: null,
    round: 0,
    enemyHp: 100,
    playerHp: 100,
    pendingChallenge: null,
  },
  rocket: {
    puzzle: null,
    timer: null,
    timerInterval: null,
    wordSearchSelected: [],
    wordSearchFound: [],
    sentencePlaced: [],
    timedScore: 0,
    timedTotal: 5,
    timedCurrent: null,
    timedAnswered: 0,
  },
  pokecenter: {
    wordSearchDone: false,
  },
};

// ===== SCENE MANAGEMENT =====
const MAJOR_SCENES = ['map', 'encounter', 'gym', 'rocket', 'pokecenter', 'lab', 'guide', 'training'];

function showScene(id) {
  const old = document.querySelector('.scene.active');
  const next = document.getElementById('scene-' + id);
  if (!next) return;

  const useMajorTransition = MAJOR_SCENES.includes(id) && old && MAJOR_SCENES.includes(State.currentScene);
  const overlay = document.getElementById('scene-transition-overlay');

  function doSwitch() {
    if (old) {
      old.classList.remove('active');
      old.classList.add('slide-out');
      setTimeout(() => old.classList.remove('slide-out'), 300);
    }
    if (id !== 'throw' && typeof cleanupThrowListeners === 'function') {
      cleanupThrowListeners();
    }
    next.classList.add('active', 'slide-in');
    setTimeout(() => next.classList.remove('slide-in'), 400);
    State.currentScene = id;
    if (typeof SessionTimer !== 'undefined') SessionTimer.check();
  }

  if (useMajorTransition && overlay) {
    overlay.classList.add('active');
    setTimeout(() => {
      doSwitch();
      setTimeout(() => overlay.classList.remove('active'), 200);
    }, 200);
  } else {
    doSwitch();
  }
}

function notify(msg, type = '') {
  const el = document.getElementById('global-notify');
  el.textContent = msg;
  el.className = 'global-notify' + (type ? ' ' + type : '');
  clearTimeout(el._timeout);
  el._timeout = setTimeout(() => el.classList.add('hidden'), 2500);
}

// ===== CONFETTI =====
let confettiParts = [];
function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const colors = ['#FFD600','#E53935','#1565C0','#4CAF50','#FF6B35','#E91E8C','#fff'];
  confettiParts = Array.from({length: 120}, () => ({
    x: Math.random() * canvas.width,
    y: -20,
    r: Math.random() * 8 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    vx: (Math.random() - 0.5) * 4,
    vy: Math.random() * 4 + 2,
    rot: Math.random() * 360,
    rotV: (Math.random() - 0.5) * 6,
    shape: Math.random() > 0.5 ? 'rect' : 'circle',
  }));
  let frames = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettiParts.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color;
      if (p.shape === 'circle') {
        ctx.beginPath(); ctx.arc(0, 0, p.r, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.fillRect(-p.r, -p.r/2, p.r * 2, p.r);
      }
      ctx.restore();
      p.x += p.vx; p.y += p.vy; p.rot += p.rotV; p.vy += 0.05;
    });
    frames++;
    if (frames < 180) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
}

// ===== UI UPDATE =====
function updateTrainerBar() {
  document.getElementById('trainer-name-display').textContent = State.trainerName;
  document.getElementById('trainer-level').textContent = State.level;
  document.getElementById('caught-count').textContent = State.seen.length;
  const caughtTag = document.getElementById('caught-tag');
  if (caughtTag) caughtTag.textContent = `${State.seen.length}/151 Caught`;
  const slots = document.querySelectorAll('.badge-slot');
  slots.forEach((s, i) => {
    if (State.badges.includes(i)) {
      s.classList.add('earned');
      s.innerHTML = `<img src="${GYMS[i].badge}" alt="${GYMS[i].name}" class="badge-img">`;
    }
  });
  saveState();
}

// Mark a Pokemon as seen in the Pokedex (idempotent)
function markSeen(pokemonId) {
  if (!State.seen.includes(pokemonId)) State.seen.push(pokemonId);
}

// Initialize HP for a newly caught Pokemon
function initPokemonHp(pokemonId) {
  if (!State.pokemonHp[pokemonId]) {
    const pkmn = POKEMON_DB.find(p => p.id === pokemonId);
    if (pkmn) State.pokemonHp[pokemonId] = pkmn.hp;
  }
}

// Get current HP for a Pokemon (returns max if not tracked)
function getPokemonHp(pokemonId) {
  const pkmn = POKEMON_DB.find(p => p.id === pokemonId);
  if (!pkmn) return 0;
  return State.pokemonHp[pokemonId] != null ? State.pokemonHp[pokemonId] : pkmn.hp;
}

function addXp(amount) {
  State.xp += amount;
  const xpNeeded = State.level * 50;
  if (State.xp >= xpNeeded) {
    State.xp -= xpNeeded;
    State.level++;
    notify(`🎉 Level Up! You are now Level ${State.level}!`, 'success');
  }
  saveState();
}

// ===== SAVE / LOAD STATE =====
const _store = (function() { try { const s = window['local'+'Storage']; s.setItem('_test', '1'); s.removeItem('_test'); return s; } catch(e) { return null; } })();
if (!_store) {
  setTimeout(() => notify('Private browsing detected — progress will not be saved.', 'error'), 1500);
}
function saveState() {
  try {
    if (!_store) return;
    const data = {
      trainerName: State.trainerName,
      level: State.level,
      xp: State.xp,
      caught: State.caught,
      seen: State.seen,
      pokemonHp: State.pokemonHp,
      pokemonXp: State.pokemonXp,
      badges: State.badges,
      eliteFourDefeated: State.eliteFourDefeated,
      settingsLevel: State.settings.level,
      evolution: State.evolution || null,
      streak: State.streak || null,
    };
    _store.setItem('pokemon-edu-save', JSON.stringify(data));
  } catch (e) {
    // storage may be full or unavailable — silently ignore
  }
}

function loadState() {
  try {
    if (!_store) return false;
    const raw = _store.getItem('pokemon-edu-save');
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (data.trainerName) State.trainerName = data.trainerName;
    if (data.level != null) State.level = data.level;
    if (data.xp != null) State.xp = data.xp;
    if (Array.isArray(data.caught)) State.caught = data.caught;
    if (Array.isArray(data.seen)) State.seen = data.seen;
    // Backfill seen from caught for saves before seen was added
    if (!State.seen.length && State.caught.length) State.seen = [...State.caught];
    if (data.pokemonHp) State.pokemonHp = data.pokemonHp;
    if (data.pokemonXp) State.pokemonXp = data.pokemonXp;
    if (Array.isArray(data.badges)) State.badges = data.badges;
    if (Array.isArray(data.eliteFourDefeated)) State.eliteFourDefeated = data.eliteFourDefeated;
    if (data.settingsLevel != null) State.settings.level = data.settingsLevel;
    if (data.evolution) State.evolution = data.evolution;
    if (data.streak) State.streak = data.streak;
    return true;
  } catch (e) {
    return false;
  }
}

// ===== TITLE SCENE =====
document.getElementById('start-btn').addEventListener('click', () => {
  const name = document.getElementById('trainer-name-input').value.trim() || 'Trainer';
  State.trainerName = name;
  SFX.caught();
  if (typeof SessionTimer !== 'undefined') SessionTimer.start();
  updateTrainerBar();
  showScene('map');
});

// ===== MAP SCENE =====
const Game = {};

Game.goToMap = function() {
  updateTrainerBar();
  showScene('map');
};
