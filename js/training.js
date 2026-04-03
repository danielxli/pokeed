// ===== TRAINING GROUNDS =====
// Flash drill training to evolve Pokemon
// Battle Training: rapid-fire math/reading drills to earn Training XP

// ===== EVOLUTION DATA =====
const EVOLUTION_MAP = {
  // Bulbasaur line
  1: { into: 2, xp: 100 }, 2: { into: 3, xp: 200 },
  // Charmander line
  4: { into: 5, xp: 100 }, 5: { into: 6, xp: 200 },
  // Squirtle line
  7: { into: 8, xp: 100 }, 8: { into: 9, xp: 200 },
  // Caterpie line
  10: { into: 11, xp: 50 }, 11: { into: 12, xp: 100 },
  // Weedle line
  13: { into: 14, xp: 50 }, 14: { into: 15, xp: 100 },
  // Pidgey line
  16: { into: 17, xp: 100 }, 17: { into: 18, xp: 200 },
  // Rattata → Raticate
  19: { into: 20, xp: 100 },
  // Spearow → Fearow
  21: { into: 22, xp: 100 },
  // Ekans → Arbok
  23: { into: 24, xp: 100 },
  // Pikachu → Raichu
  25: { into: 26, xp: 150 },
  // Sandshrew → Sandslash
  27: { into: 28, xp: 150 },
  // Nidoran♀ line
  29: { into: 30, xp: 100 }, 30: { into: 31, xp: 200 },
  // Nidoran♂ line
  32: { into: 33, xp: 100 }, 33: { into: 34, xp: 200 },
  // Clefairy → Clefable
  35: { into: 36, xp: 150 },
  // Vulpix → Ninetales
  37: { into: 38, xp: 150 },
  // Jigglypuff → Wigglytuff
  39: { into: 40, xp: 150 },
  // Zubat → Golbat
  41: { into: 42, xp: 100 },
  // Oddish line
  43: { into: 44, xp: 100 }, 44: { into: 45, xp: 200 },
  // Paras → Parasect
  46: { into: 47, xp: 100 },
  // Venonat → Venomoth
  48: { into: 49, xp: 100 },
  // Diglett → Dugtrio
  50: { into: 51, xp: 100 },
  // Meowth → Persian
  52: { into: 53, xp: 100 },
  // Psyduck → Golduck
  54: { into: 55, xp: 150 },
  // Mankey → Primeape
  56: { into: 57, xp: 100 },
  // Growlithe → Arcanine
  58: { into: 59, xp: 150 },
  // Poliwag line
  60: { into: 61, xp: 100 }, 61: { into: 62, xp: 200 },
  // Abra line
  63: { into: 64, xp: 100 }, 64: { into: 65, xp: 200 },
  // Machop line
  66: { into: 67, xp: 100 }, 67: { into: 68, xp: 200 },
  // Bellsprout line
  69: { into: 70, xp: 100 }, 70: { into: 71, xp: 200 },
  // Tentacool → Tentacruel
  72: { into: 73, xp: 150 },
  // Geodude line
  74: { into: 75, xp: 100 }, 75: { into: 76, xp: 200 },
  // Ponyta → Rapidash
  77: { into: 78, xp: 150 },
  // Slowpoke → Slowbro
  79: { into: 80, xp: 150 },
  // Magnemite → Magneton
  81: { into: 82, xp: 150 },
  // Doduo → Dodrio
  84: { into: 85, xp: 150 },
  // Seel → Dewgong
  86: { into: 87, xp: 150 },
  // Grimer → Muk
  88: { into: 89, xp: 150 },
  // Shellder → Cloyster
  90: { into: 91, xp: 150 },
  // Gastly line
  92: { into: 93, xp: 100 }, 93: { into: 94, xp: 200 },
  // Drowzee → Hypno
  96: { into: 97, xp: 150 },
  // Krabby → Kingler
  98: { into: 99, xp: 150 },
  // Voltorb → Electrode
  100: { into: 101, xp: 150 },
  // Exeggcute → Exeggutor
  102: { into: 103, xp: 150 },
  // Cubone → Marowak
  104: { into: 105, xp: 150 },
  // Koffing → Weezing
  109: { into: 110, xp: 150 },
  // Rhyhorn → Rhydon
  111: { into: 112, xp: 150 },
  // Horsea → Seadra
  116: { into: 117, xp: 150 },
  // Goldeen → Seaking
  118: { into: 119, xp: 150 },
  // Staryu → Starmie
  120: { into: 121, xp: 150 },
  // Magikarp → Gyarados
  129: { into: 130, xp: 200 },
  // Eevee → random Eeveelution
  133: { into: [134, 135, 136], xp: 150 },
  // Omanyte → Omastar
  138: { into: 139, xp: 150 },
  // Kabuto → Kabutops
  140: { into: 141, xp: 150 },
  // Dratini line
  147: { into: 148, xp: 150 }, 148: { into: 149, xp: 300 },
};

const DRILL_DURATION = 60; // seconds

// ===== TRAINING SESSION STATE =====
let _drillSession = null;
window._trainingChallenge = null;
window._onTrainingAnswer = null;

// ===== HELPERS =====
function getEvolutionInfo(pokemonId) {
  const evo = EVOLUTION_MAP[pokemonId];
  if (!evo) return null;
  const xpNeeded = evo.xp;
  const currentXp = State.pokemonXp[pokemonId] || 0;
  let evolvedId = evo.into;
  if (Array.isArray(evolvedId)) evolvedId = evolvedId[0]; // preview first option
  const evolvedPkmn = POKEMON_DB.find(p => p.id === evolvedId);
  return { xpNeeded, currentXp, evolvedId, evolvedName: evolvedPkmn ? evolvedPkmn.name : '???', isArray: Array.isArray(evo.into) };
}

function spriteUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

// ===== SCENE =====
Game.goToTraining = function() {
  SFX.pop();
  renderTrainingGrounds();
  showScene('training');
};

function renderTrainingGrounds() {
  const container = document.getElementById('training-scroll');
  if (!container) return;

  const caughtPokemon = State.caught.map(id => POKEMON_DB.find(p => p.id === id)).filter(Boolean);

  if (caughtPokemon.length === 0) {
    container.innerHTML = `
      <div class="training-empty">
        <div style="font-size:64px;margin-bottom:12px;">🏋️</div>
        <div style="font-size:18px;font-weight:700;margin-bottom:8px;">No Pokémon to Train!</div>
        <div style="color:#888;">Catch some Pokémon in the Tall Grass first, then come back to train them!</div>
      </div>`;
    return;
  }

  let html = `
    <div class="training-intro">
      <div class="training-intro-text">Train your Pokémon with rapid-fire drills to earn Training XP and evolve them!</div>
    </div>
    <div class="training-pokemon-grid">`;

  caughtPokemon.forEach(pkmn => {
    const evo = getEvolutionInfo(pkmn.id);
    const currentXp = State.pokemonXp[pkmn.id] || 0;

    let evoHtml;
    if (evo) {
      const pct = Math.min(100, Math.round((evo.currentXp / evo.xpNeeded) * 100));
      const evoNames = evo.isArray
        ? EVOLUTION_MAP[pkmn.id].into.map(id => POKEMON_DB.find(p => p.id === id)).filter(Boolean).map(p => p.name).join(' / ')
        : evo.evolvedName;
      evoHtml = `
        <div class="training-evo-info">
          <div class="training-evo-arrow">→ ${evoNames}</div>
          <div class="training-xp-bar-wrap">
            <div class="training-xp-bar" style="width:${pct}%"></div>
          </div>
          <div class="training-xp-text">${currentXp} / ${evo.xpNeeded} XP</div>
        </div>`;
    } else {
      evoHtml = `<div class="training-evo-info"><div class="training-max-badge">⭐ Max Evolution</div></div>`;
    }

    html += `
      <div class="training-pokemon-card" onclick="openDrillPicker(${pkmn.id})">
        <img class="training-pokemon-sprite" src="${spriteUrl(pkmn.id)}" alt="${pkmn.name}">
        <div class="training-pokemon-name">${pkmn.name}</div>
        <span class="training-type-badge" style="background:${getTypeColor(pkmn.type)}">${pkmn.type}</span>
        ${evoHtml}
        <button class="training-train-btn" onclick="event.stopPropagation(); openDrillPicker(${pkmn.id})">🏋️ Train</button>
      </div>`;
  });

  html += '</div>';
  container.innerHTML = html;
}

// ===== DRILL TYPE PICKER =====
window.openDrillPicker = function(pokemonId) {
  SFX.pop();
  const pkmn = POKEMON_DB.find(p => p.id === pokemonId);
  if (!pkmn) return;

  const overlay = document.getElementById('drill-picker-overlay');
  overlay.classList.remove('hidden');
  overlay.innerHTML = `
    <div class="drill-picker-card">
      <img src="${spriteUrl(pokemonId)}" alt="${pkmn.name}" style="width:80px;height:80px;image-rendering:pixelated;">
      <div style="font-size:20px;font-weight:700;margin:8px 0;">Train ${pkmn.name}</div>
      <div style="color:#888;font-size:14px;margin-bottom:16px;">Choose your training type!</div>
      <div class="drill-picker-buttons">
        <button class="drill-picker-btn drill-picker-math" onclick="startDrill(${pokemonId}, 'math')">
          <span style="font-size:32px;">⚔️</span>
          <span style="font-weight:700;">Math Training</span>
          <span style="font-size:12px;color:#888;">Numbers, operations & more</span>
        </button>
        <button class="drill-picker-btn drill-picker-reading" onclick="startDrill(${pokemonId}, 'reading')">
          <span style="font-size:32px;">📖</span>
          <span style="font-weight:700;">Reading Training</span>
          <span style="font-size:12px;color:#888;">Words, sounds & spelling</span>
        </button>
      </div>
      <button class="drill-picker-cancel" onclick="closeDrillPicker()">Cancel</button>
    </div>`;
};

window.closeDrillPicker = function() {
  document.getElementById('drill-picker-overlay').classList.add('hidden');
};

// ===== FLASH DRILL =====
window.startDrill = function(pokemonId, drillType) {
  closeDrillPicker();
  SFX.click();

  const pkmn = POKEMON_DB.find(p => p.id === pokemonId);
  if (!pkmn) return;

  // Get challenge types for this drill
  const types = drillType === 'math' ? getMathChallengeTypes() : getReadingChallengeTypes();
  if (types.length === 0) {
    notify('No challenges available for this level!', 'error');
    return;
  }

  _drillSession = {
    pokemonId,
    pokemonName: pkmn.name,
    drillType,
    challengeTypes: types,
    correct: 0,
    wrong: 0,
    streak: 0,
    maxStreak: 0,
    xpEarned: 0,
    timeLeft: DRILL_DURATION,
    active: true,
    timer: null,
  };

  // Show drill overlay
  const overlay = document.getElementById('training-drill-overlay');
  overlay.classList.remove('hidden');

  // Set pokemon sprite
  document.getElementById('drill-pokemon-sprite').src = spriteUrl(pokemonId);

  // Set up evolution progress bar
  const evo = getEvolutionInfo(pokemonId);
  const evoBar = document.getElementById('drill-evo-bar');
  if (evo) {
    evoBar.classList.remove('hidden');
    const evolvedNames = Array.isArray(EVOLUTION_MAP[pokemonId].into)
      ? EVOLUTION_MAP[pokemonId].into.map(id => POKEMON_DB.find(p => p.id === id)).filter(Boolean).map(p => p.name).join('/')
      : evo.evolvedName;
    document.getElementById('drill-evo-name').textContent = '→ ' + evolvedNames;
  } else {
    evoBar.classList.add('hidden');
  }

  // Reset UI
  updateDrillUI();

  // Countdown 3-2-1
  const challengeArea = document.getElementById('drill-challenge-area');
  challengeArea.innerHTML = '<div class="drill-countdown" id="drill-countdown">3</div>';
  const countdownEl = document.getElementById('drill-countdown');

  let count = 3;
  const countInterval = setInterval(() => {
    count--;
    if (count > 0) {
      countdownEl.textContent = count;
      SFX.pop();
    } else {
      clearInterval(countInterval);
      countdownEl.textContent = 'GO!';
      SFX.click();
      setTimeout(() => {
        startDrillTimer();
        nextDrillQuestion();
      }, 300);
    }
  }, 600);
};

function startDrillTimer() {
  _drillSession.timer = setInterval(() => {
    _drillSession.timeLeft--;
    updateDrillUI();
    if (_drillSession.timeLeft <= 0) {
      endDrill();
    }
  }, 1000);
}

function updateDrillUI() {
  if (!_drillSession) return;
  const pct = (_drillSession.timeLeft / DRILL_DURATION) * 100;
  const fill = document.getElementById('drill-timer-fill');
  if (fill) {
    fill.style.width = pct + '%';
    fill.style.background = pct > 30 ? '#4CAF50' : pct > 10 ? '#FFC107' : '#E53935';
  }
  const timerText = document.getElementById('drill-timer-text');
  if (timerText) timerText.textContent = _drillSession.timeLeft + 's';
  const score = document.getElementById('drill-score');
  if (score) score.textContent = 'Score: ' + _drillSession.correct;
  const combo = document.getElementById('drill-combo');
  if (combo) {
    combo.textContent = _drillSession.streak > 0 ? '\uD83D\uDD25 ' + _drillSession.streak : '';
    combo.className = 'drill-combo' + (_drillSession.streak >= 5 ? ' on-fire' : '');
  }

  // Evolution progress bar
  const evo = getEvolutionInfo(_drillSession.pokemonId);
  if (evo) {
    const baseXp = evo.currentXp;
    const earned = _drillSession.xpEarned;
    const needed = evo.xpNeeded;
    const basePct = Math.min(100, Math.round((baseXp / needed) * 100));
    const earnedPct = Math.min(100 - basePct, Math.round((earned / needed) * 100));
    const baseEl = document.getElementById('drill-evo-fill-base');
    const earnedEl = document.getElementById('drill-evo-fill-earned');
    const textEl = document.getElementById('drill-evo-xp-text');
    if (baseEl) baseEl.style.width = basePct + '%';
    if (earnedEl) { earnedEl.style.left = basePct + '%'; earnedEl.style.width = earnedPct + '%'; }
    if (textEl) textEl.textContent = (baseXp + earned) + ' / ' + needed + ' XP';
  }
}

// ===== WORD-PICTURE POOL =====
const WORD_PICTURE_POOL = [
  // Level 1-2: Simple CVC / common words
  { word: 'cat', emoji: '🐱', level: 1 }, { word: 'dog', emoji: '🐕', level: 1 },
  { word: 'fish', emoji: '🐟', level: 1 }, { word: 'bird', emoji: '🐦', level: 1 },
  { word: 'sun', emoji: '☀️', level: 1 }, { word: 'moon', emoji: '🌙', level: 1 },
  { word: 'rain', emoji: '🌧️', level: 1 }, { word: 'car', emoji: '🚗', level: 1 },
  { word: 'bus', emoji: '🚌', level: 1 }, { word: 'hat', emoji: '🎩', level: 1 },
  { word: 'cup', emoji: '☕', level: 1 }, { word: 'book', emoji: '📖', level: 1 },
  { word: 'ball', emoji: '⚽', level: 1 }, { word: 'pig', emoji: '🐷', level: 1 },
  { word: 'cow', emoji: '🐄', level: 1 }, { word: 'duck', emoji: '🐤', level: 1 },
  { word: 'bee', emoji: '🐝', level: 1 }, { word: 'bug', emoji: '🐛', level: 1 },
  { word: 'ant', emoji: '🐜', level: 1 }, { word: 'egg', emoji: '🥚', level: 1 },
  { word: 'bed', emoji: '🛏️', level: 1 }, { word: 'key', emoji: '🔑', level: 1 },
  { word: 'bell', emoji: '🔔', level: 1 }, { word: 'fire', emoji: '🔥', level: 1 },
  { word: 'eye', emoji: '👁️', level: 1 }, { word: 'ear', emoji: '👂', level: 1 },
  { word: 'nose', emoji: '👃', level: 1 }, { word: 'hand', emoji: '✋', level: 1 },
  { word: 'pen', emoji: '🖊️', level: 1 }, { word: 'map', emoji: '🗺️', level: 1 },
  { word: 'bat', emoji: '🦇', level: 1 },
  { word: 'nut', emoji: '🥜', level: 1 }, { word: 'leg', emoji: '🦵', level: 1 },
  { word: 'van', emoji: '🚐', level: 1 },
  { word: 'gem', emoji: '💎', level: 1 }, { word: 'pie', emoji: '🥧', level: 1 },
  { word: 'net', emoji: '🥅', level: 1 }, { word: 'log', emoji: '🪵', level: 1 },
  // Level 2: CVCE, CCVC, simple blends
  { word: 'star', emoji: '⭐', level: 2 }, { word: 'tree', emoji: '🌳', level: 2 },
  { word: 'frog', emoji: '🐸', level: 2 }, { word: 'bear', emoji: '🐻', level: 2 },
  { word: 'crab', emoji: '🦀', level: 2 }, { word: 'drum', emoji: '🥁', level: 2 },
  { word: 'flag', emoji: '🚩', level: 2 }, { word: 'plug', emoji: '🔌', level: 2 },
  { word: 'sled', emoji: '🛷', level: 2 }, { word: 'swim', emoji: '🏊', level: 2 },
  { word: 'cake', emoji: '🍰', level: 2 }, { word: 'bone', emoji: '🦴', level: 2 },
  { word: 'wave', emoji: '🌊', level: 2 }, { word: 'rose', emoji: '🌹', level: 2 },
  { word: 'boat', emoji: '⛵', level: 2 }, { word: 'goat', emoji: '🐐', level: 2 },
  { word: 'fox', emoji: '🦊', level: 2 }, { word: 'box', emoji: '📦', level: 2 },
  { word: 'mice', emoji: '🐭', level: 2 }, { word: 'kite', emoji: '🪁', level: 2 },
  { word: 'sock', emoji: '🧦', level: 2 },
  { word: 'corn', emoji: '🌽', level: 2 }, { word: 'door', emoji: '🚪', level: 2 },
  { word: 'baby', emoji: '👶', level: 2 }, { word: 'snow', emoji: '❄️', level: 2 },
  { word: 'rock', emoji: '🪨', level: 2 }, { word: 'milk', emoji: '🥛', level: 2 },
  { word: 'ring', emoji: '💍', level: 2 }, { word: 'hen', emoji: '🐔', level: 2 },
  { word: 'web', emoji: '🕸️', level: 2 },
  { word: 'grape', emoji: '🍇', level: 2 },
  { word: 'slide', emoji: '🛝', level: 2 }, { word: 'globe', emoji: '🌍', level: 2 },
  { word: 'clip', emoji: '📎', level: 2 },
  { word: 'snail', emoji: '🐌', level: 2 }, { word: 'broom', emoji: '🧹', level: 2 },
  { word: 'spoon', emoji: '🥄', level: 2 }, { word: 'truck', emoji: '🚛', level: 2 },
  { word: 'swan', emoji: '🦢', level: 2 }, { word: 'clam', emoji: '🐚', level: 2 },
  { word: 'bride', emoji: '👰', level: 2 },
  { word: 'skate', emoji: '⛸️', level: 2 },
  // Moved from level 2 → level 3 (blends/digraphs)
  { word: 'apple', emoji: '🍎', level: 3 }, { word: 'house', emoji: '🏠', level: 3 },
  { word: 'horse', emoji: '🐴', level: 3 }, { word: 'sheep', emoji: '🐑', level: 3 },
  { word: 'flower', emoji: '🌸', level: 3 }, { word: 'heart', emoji: '❤️', level: 3 },
  { word: 'clock', emoji: '🕐', level: 3 },
  { word: 'cloud', emoji: '☁️', level: 3 },
  { word: 'train', emoji: '🚂', level: 3 }, { word: 'plane', emoji: '✈️', level: 3 },
  { word: 'bike', emoji: '🚲', level: 3 }, { word: 'king', emoji: '👑', level: 3 },
  { word: 'leaf', emoji: '🍃', level: 3 },
  // Level 3-5: Harder words
  { word: 'rainbow', emoji: '🌈', level: 3 },
  { word: 'mountain', emoji: '⛰️', level: 3 }, { word: 'castle', emoji: '🏰', level: 3 },
  { word: 'rocket', emoji: '🚀', level: 3 }, { word: 'robot', emoji: '🤖', level: 3 },
  { word: 'ghost', emoji: '👻', level: 3 }, { word: 'dragon', emoji: '🐉', level: 3 },
  { word: 'whale', emoji: '🐋', level: 3 },
  { word: 'shark', emoji: '🦈', level: 3 }, { word: 'octopus', emoji: '🐙', level: 3 },
  { word: 'butterfly', emoji: '🦋', level: 3 }, { word: 'turtle', emoji: '🐢', level: 3 },
  { word: 'spider', emoji: '🕷️', level: 3 }, { word: 'elephant', emoji: '🐘', level: 4 },
  { word: 'lion', emoji: '🦁', level: 3 }, { word: 'monkey', emoji: '🐒', level: 3 },
  { word: 'eagle', emoji: '🦅', level: 3 },
  { word: 'owl', emoji: '🦉', level: 3 },
  { word: 'bridge', emoji: '🌉', level: 3 }, { word: 'candle', emoji: '🕯️', level: 3 },
  { word: 'cherry', emoji: '🍒', level: 3 }, { word: 'pizza', emoji: '🍕', level: 3 },
  { word: 'cookie', emoji: '🍪', level: 3 },
  { word: 'basket', emoji: '🧺', level: 3 }, { word: 'hammer', emoji: '🔨', level: 3 },
  { word: 'ladder', emoji: '🪜', level: 3 },
  { word: 'anchor', emoji: '⚓', level: 3 }, { word: 'trophy', emoji: '🏆', level: 3 },
  { word: 'magnet', emoji: '🧲', level: 3 }, { word: 'carrot', emoji: '🥕', level: 3 },
  { word: 'lemon', emoji: '🍋', level: 3 }, { word: 'mitten', emoji: '🧤', level: 3 },
  { word: 'window', emoji: '🪟', level: 3 },
  { word: 'unicorn', emoji: '🦄', level: 4 }, { word: 'tornado', emoji: '🌪️', level: 4 },
  { word: 'island', emoji: '🏝️', level: 4 }, { word: 'desert', emoji: '🏜️', level: 4 },
  { word: 'snake', emoji: '🐍', level: 4 },
  { word: 'parrot', emoji: '🦜', level: 4 }, { word: 'tiger', emoji: '🐅', level: 4 },
  { word: 'compass', emoji: '🧭', level: 4 },
  { word: 'dolphin', emoji: '🐬', level: 4 }, { word: 'feather', emoji: '🪶', level: 4 },
  { word: 'trumpet', emoji: '🎺', level: 4 },
  { word: 'penguin', emoji: '🐧', level: 4 }, { word: 'lantern', emoji: '🏮', level: 4 },
  { word: 'pretzel', emoji: '🥨', level: 4 },
  { word: 'volcano', emoji: '🌋', level: 4 },
  { word: 'mushroom', emoji: '🍄', level: 4 },
  { word: 'scissors', emoji: '✂️', level: 4 }, { word: 'sandwich', emoji: '🥪', level: 4 },
  { word: 'calendar', emoji: '📅', level: 4 },
  { word: 'dinosaur', emoji: '🦕', level: 4 }, { word: 'goldfish', emoji: '🐠', level: 4 },
  // Level 5: Multi-syllable / advanced
  { word: 'telescope', emoji: '🔭', level: 5 }, { word: 'microscope', emoji: '🔬', level: 5 },
  { word: 'satellite', emoji: '🛰️', level: 5 }, { word: 'ambulance', emoji: '🚑', level: 5 },
  { word: 'helicopter', emoji: '🚁', level: 5 }, { word: 'pineapple', emoji: '🍍', level: 5 },
  { word: 'crocodile', emoji: '🐊', level: 5 }, { word: 'scorpion', emoji: '🦂', level: 5 },
  { word: 'flamingo', emoji: '🦩', level: 5 }, { word: 'gorilla', emoji: '🦍', level: 5 },
  { word: 'rhinoceros', emoji: '🦏', level: 5 }, { word: 'kangaroo', emoji: '🦘', level: 5 },
  { word: 'accordion', emoji: '🪗', level: 5 }, { word: 'broccoli', emoji: '🥦', level: 5 },
  { word: 'parachute', emoji: '🪂', level: 5 },
  { word: 'strawberry', emoji: '🍓', level: 5 }, { word: 'watermelon', emoji: '🍉', level: 5 },
  { word: 'thermometer', emoji: '🌡️', level: 5 },
];

// ===== MATH DRILL GENERATOR =====
function generateMathDrill(level) {
  const ops = [];
  let a, b, answer, question;

  if (level <= 2) {
    ops.push('+', '-');
    const max = level === 1 ? 10 : 20;
    const op = ops[Math.floor(Math.random() * ops.length)];
    if (op === '+') {
      a = Math.floor(Math.random() * max) + 1;
      b = Math.floor(Math.random() * (max - a)) + 1;
      answer = a + b;
    } else {
      a = Math.floor(Math.random() * max) + 2;
      b = Math.floor(Math.random() * (a - 1)) + 1;
      answer = a - b;
    }
    question = `${a} ${op} ${b}`;
  } else if (level === 3) {
    const r = Math.random();
    if (r < 0.3) {
      a = Math.floor(Math.random() * 40) + 5;
      b = Math.floor(Math.random() * 30) + 1;
      answer = a + b; question = `${a} + ${b}`;
    } else if (r < 0.6) {
      a = Math.floor(Math.random() * 40) + 10;
      b = Math.floor(Math.random() * a) + 1;
      answer = a - b; question = `${a} − ${b}`;
    } else {
      a = Math.floor(Math.random() * 5) + 2;
      b = Math.floor(Math.random() * 5) + 2;
      answer = a * b; question = `${a} × ${b}`;
    }
  } else if (level === 4) {
    const r = Math.random();
    if (r < 0.4) {
      a = Math.floor(Math.random() * 10) + 2;
      b = Math.floor(Math.random() * 10) + 2;
      answer = a * b; question = `${a} × ${b}`;
    } else if (r < 0.7) {
      b = Math.floor(Math.random() * 8) + 2;
      answer = Math.floor(Math.random() * 10) + 1;
      a = b * answer;
      question = `${a} ÷ ${b}`;
    } else {
      a = Math.floor(Math.random() * 50) + 10;
      b = Math.floor(Math.random() * 30) + 5;
      const op = Math.random() < 0.5 ? '+' : '-';
      if (op === '-' && b > a) { const t = a; a = b; b = t; }
      answer = op === '+' ? a + b : a - b;
      question = `${a} ${op === '-' ? '−' : '+'} ${b}`;
    }
  } else {
    const r = Math.random();
    if (r < 0.35) {
      a = Math.floor(Math.random() * 12) + 2;
      b = Math.floor(Math.random() * 12) + 2;
      answer = a * b; question = `${a} × ${b}`;
    } else if (r < 0.65) {
      b = Math.floor(Math.random() * 10) + 2;
      answer = Math.floor(Math.random() * 12) + 1;
      a = b * answer;
      question = `${a} ÷ ${b}`;
    } else {
      a = Math.floor(Math.random() * 80) + 20;
      b = Math.floor(Math.random() * 50) + 10;
      const op = Math.random() < 0.5 ? '+' : '-';
      if (op === '-' && b > a) { const t = a; a = b; b = t; }
      answer = op === '+' ? a + b : a - b;
      question = `${a} ${op === '-' ? '−' : '+'} ${b}`;
    }
  }

  // Generate distractors close to the answer
  const distractors = new Set();
  while (distractors.size < 3) {
    const offset = Math.floor(Math.random() * 5) + 1;
    const d = Math.random() < 0.5 ? answer + offset : answer - offset;
    if (d !== answer && d >= 0) distractors.add(d);
  }

  const choices = [...distractors, answer].sort(() => Math.random() - 0.5);
  return { question, answer: String(answer), choices: choices.map(String), type: 'math' };
}

// ===== READING DRILL GENERATOR =====
function generateReadingDrill(level) {
  // Filter words appropriate for level (include easier words too)
  const pool = WORD_PICTURE_POOL.filter(w => w.level <= level);
  const target = pool[Math.floor(Math.random() * pool.length)];

  // Pick 3 distractor emojis (different from target)
  const others = pool.filter(w => w.emoji !== target.emoji);
  const distractors = [];
  const used = new Set([target.emoji]);
  while (distractors.length < 3 && others.length > 0) {
    const idx = Math.floor(Math.random() * others.length);
    const pick = others[idx];
    if (!used.has(pick.emoji)) {
      distractors.push(pick.emoji);
      used.add(pick.emoji);
    }
    others.splice(idx, 1);
  }

  const choices = [target.emoji, ...distractors].sort(() => Math.random() - 0.5);
  return { question: target.word, answer: target.emoji, choices, type: 'reading' };
}

// ===== DRILL QUESTION RENDERING =====
function nextDrillQuestion() {
  if (!_drillSession || !_drillSession.active) return;

  const level = State.settings.level;
  const q = _drillSession.drillType === 'math'
    ? generateMathDrill(level)
    : generateReadingDrill(level);

  _drillSession.currentQuestion = q;

  const area = document.getElementById('drill-challenge-area');
  if (q.type === 'math') {
    area.innerHTML = `
      <div class="drill-question-math">${q.question} = ?</div>
      <div class="drill-choices">
        ${q.choices.map(c => `<button class="drill-choice-btn" onclick="drillAnswer('${c}')">${c}</button>`).join('')}
      </div>`;
  } else {
    area.innerHTML = `
      <div class="drill-question-word">${q.question}</div>
      <div class="drill-choices drill-choices-emoji">
        ${q.choices.map(c => `<button class="drill-choice-btn drill-choice-emoji" onclick="drillAnswer('${c}')">${c}</button>`).join('')}
      </div>`;
  }
}

// ===== DRILL ANSWER HANDLER =====
window.drillAnswer = function(chosen) {
  if (!_drillSession || !_drillSession.active) return;

  const q = _drillSession.currentQuestion;
  if (!q) return;

  const isCorrect = chosen === q.answer;

  // Highlight buttons
  const btns = document.querySelectorAll('#drill-challenge-area .drill-choice-btn');
  btns.forEach(b => {
    b.disabled = true;
    b.style.pointerEvents = 'none';
    if (b.textContent === q.answer) b.classList.add('drill-btn-correct');
    else if (b.textContent === chosen && !isCorrect) b.classList.add('drill-btn-wrong');
  });

  if (isCorrect) {
    _drillSession.correct++;
    _drillSession.streak++;
    if (_drillSession.streak > _drillSession.maxStreak) _drillSession.maxStreak = _drillSession.streak;

    let xp = 5;
    if (_drillSession.streak >= 10) xp = 15;
    else if (_drillSession.streak >= 5) xp = 10;
    else if (_drillSession.streak >= 3) xp = 7;
    _drillSession.xpEarned += xp;

    showDrillHit(xp);
    SFX.correct();
  } else {
    _drillSession.wrong++;
    _drillSession.streak = 0;
    showDrillMiss();
    SFX.wrong();
  }

  updateDrillUI();

  setTimeout(() => {
    if (_drillSession && _drillSession.active) nextDrillQuestion();
  }, isCorrect ? 250 : 400);
};

function showDrillHit(xp) {
  const sprite = document.getElementById('drill-pokemon-sprite');
  if (sprite) {
    sprite.classList.add('drill-attack');
    setTimeout(() => sprite.classList.remove('drill-attack'), 300);
  }

  // Damage number + hit sprite
  const dummy = document.getElementById('drill-dummy');
  if (dummy) {
    dummy.classList.add('drill-dummy-hit');
    dummy.src = 'assets/training-dummy-hit.webp';
    setTimeout(() => {
      dummy.classList.remove('drill-dummy-hit');
      dummy.src = 'assets/training-dummy.webp';
    }, 300);
  }

  // Floating XP number
  const battleArea = document.getElementById('drill-battle-area');
  const floater = document.createElement('div');
  floater.className = 'drill-xp-float';
  floater.textContent = '+' + xp + ' XP';
  battleArea.appendChild(floater);
  setTimeout(() => floater.remove(), 800);
}

function showDrillMiss() {
  const dummy = document.getElementById('drill-dummy');
  if (dummy) {
    const missEl = document.createElement('div');
    missEl.className = 'drill-miss-float';
    missEl.textContent = 'MISS';
    dummy.parentElement.appendChild(missEl);
    setTimeout(() => missEl.remove(), 600);
  }
}

// ===== END DRILL =====
function endDrill() {
  if (!_drillSession) return;
  _drillSession.active = false;
  clearInterval(_drillSession.timer);

  const pokemonId = _drillSession.pokemonId;
  const xpEarned = _drillSession.xpEarned;

  // Award Training XP to Pokemon
  if (!State.pokemonXp[pokemonId]) State.pokemonXp[pokemonId] = 0;
  State.pokemonXp[pokemonId] += xpEarned;

  // Award trainer XP too
  addXp(Math.round(xpEarned / 2));
  saveState();

  SFX.caught();

  // Show results
  const evo = getEvolutionInfo(pokemonId);
  const canEvolve = evo && State.pokemonXp[pokemonId] >= evo.xpNeeded;

  const area = document.getElementById('drill-challenge-area');
  area.innerHTML = `
    <div class="drill-results">
      <div class="drill-results-title">⏱️ Time's Up!</div>
      <div class="drill-results-pokemon">
        <img src="${spriteUrl(pokemonId)}" alt="" style="width:64px;height:64px;image-rendering:pixelated;">
        <div style="font-size:18px;font-weight:700;">${_drillSession.pokemonName}</div>
      </div>
      <div class="drill-results-stats">
        <div class="drill-stat"><span class="drill-stat-num">${_drillSession.correct}</span><span class="drill-stat-label">Correct</span></div>
        <div class="drill-stat"><span class="drill-stat-num">${_drillSession.wrong}</span><span class="drill-stat-label">Wrong</span></div>
        <div class="drill-stat"><span class="drill-stat-num">${_drillSession.maxStreak}</span><span class="drill-stat-label">Best Streak</span></div>
        <div class="drill-stat"><span class="drill-stat-num">+${xpEarned}</span><span class="drill-stat-label">XP Earned</span></div>
      </div>
      ${evo ? `<div class="drill-results-xp">
        <div style="font-size:14px;margin-bottom:6px;">${_drillSession.pokemonName} Training XP: ${State.pokemonXp[pokemonId]} / ${evo.xpNeeded}</div>
        <div class="training-xp-bar-wrap" style="height:12px;">
          <div class="training-xp-bar" style="width:${Math.min(100, Math.round((State.pokemonXp[pokemonId] / evo.xpNeeded) * 100))}%"></div>
        </div>
      </div>` : ''}
      <button class="btn-primary btn-xl" style="margin-top:16px;" onclick="finishDrill()">
        ${canEvolve ? '✨ Continue' : '👍 Done'}
      </button>
    </div>`;
}

window.finishDrill = function() {
  const pokemonId = _drillSession ? _drillSession.pokemonId : null;
  closeDrill();

  if (pokemonId) {
    checkAndTriggerEvolution(pokemonId);
  }
};

function closeDrill() {
  if (_drillSession && _drillSession.timer) clearInterval(_drillSession.timer);
  _drillSession = null;
  window._trainingChallenge = null;
  window._onTrainingAnswer = null;
  document.getElementById('training-drill-overlay').classList.add('hidden');
}

// ===== EVOLUTION =====
function checkAndTriggerEvolution(pokemonId) {
  const evo = EVOLUTION_MAP[pokemonId];
  if (!evo) { renderTrainingGrounds(); return; }

  const currentXp = State.pokemonXp[pokemonId] || 0;
  if (currentXp < evo.xp) { renderTrainingGrounds(); return; }

  // Determine evolved form
  let evolvedId;
  if (Array.isArray(evo.into)) {
    // Random Eeveelution
    evolvedId = evo.into[Math.floor(Math.random() * evo.into.length)];
  } else {
    evolvedId = evo.into;
  }

  const oldPkmn = POKEMON_DB.find(p => p.id === pokemonId);
  const newPkmn = POKEMON_DB.find(p => p.id === evolvedId);
  if (!oldPkmn || !newPkmn) { renderTrainingGrounds(); return; }

  // Show evolution animation
  showEvolutionAnimation(oldPkmn, newPkmn, () => {
    // Perform the evolution
    evolve(pokemonId, evolvedId);
    renderTrainingGrounds();
  });
}

function evolve(oldId, newId) {
  // Carry over excess XP
  const evo = EVOLUTION_MAP[oldId];
  const excess = Math.max(0, (State.pokemonXp[oldId] || 0) - evo.xp);

  // Replace in caught array (active roster)
  const idx = State.caught.indexOf(oldId);
  if (idx !== -1) {
    State.caught[idx] = newId;
  }
  // Mark evolved form as seen in Pokedex (old form already there from catch)
  markSeen(newId);
  // Remove duplicate if new form already caught
  const dupes = State.caught.filter(id => id === newId);
  if (dupes.length > 1) {
    // Remove the second occurrence
    const lastIdx = State.caught.lastIndexOf(newId);
    State.caught.splice(lastIdx, 1);
  }

  // Transfer XP
  delete State.pokemonXp[oldId];
  if (!State.pokemonXp[newId]) State.pokemonXp[newId] = 0;
  State.pokemonXp[newId] += excess;

  // Transfer HP — fully heal on evolution
  const newPkmn = POKEMON_DB.find(p => p.id === newId);
  if (newPkmn) State.pokemonHp[newId] = newPkmn.hp;
  delete State.pokemonHp[oldId];

  saveState();
  updateTrainerBar();
}

function showEvolutionAnimation(oldPkmn, newPkmn, onComplete) {
  const overlay = document.getElementById('evolution-overlay');
  overlay.classList.remove('hidden');

  // Stat comparison for later
  const statUp = (stat) => newPkmn[stat] - oldPkmn[stat];

  overlay.innerHTML = `
    <div class="evo-animation" id="evo-animation">
      <div class="evo-particles" id="evo-particles"></div>
      <div class="evo-text" id="evo-text">What?</div>
      <div class="evo-sprite-container" id="evo-sprite-container">
        <div class="evo-glow" id="evo-glow"></div>
        <img id="evo-old-sprite" class="evo-sprite evo-sprite-active" src="${spriteUrl(oldPkmn.id)}" alt="${oldPkmn.name}">
        <img id="evo-new-sprite" class="evo-sprite evo-sprite-hidden" src="${spriteUrl(newPkmn.id)}" alt="${newPkmn.name}">
      </div>
      <div class="evo-name-tag" id="evo-name-tag">${oldPkmn.name}</div>
      <div class="evo-stats-reveal hidden" id="evo-stats-reveal">
        <div class="evo-stat-row"><span>HP</span><span class="evo-stat-val">${oldPkmn.hp} → ${newPkmn.hp} <span class="evo-stat-up">+${statUp('hp')}</span></span></div>
        <div class="evo-stat-row"><span>ATK</span><span class="evo-stat-val">${oldPkmn.atk} → ${newPkmn.atk} <span class="evo-stat-up">+${statUp('atk')}</span></span></div>
        <div class="evo-stat-row"><span>DEF</span><span class="evo-stat-val">${oldPkmn.def} → ${newPkmn.def} <span class="evo-stat-up">+${statUp('def')}</span></span></div>
        <div class="evo-stat-row"><span>SPD</span><span class="evo-stat-val">${oldPkmn.spd} → ${newPkmn.spd} <span class="evo-stat-up">+${statUp('spd')}</span></span></div>
      </div>
      <div class="evo-flash" id="evo-flash"></div>
    </div>`;

  // Spawn floating particles
  const particleContainer = document.getElementById('evo-particles');
  function spawnParticles() {
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'evo-particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDelay = Math.random() * 2 + 's';
      p.style.animationDuration = (1.5 + Math.random() * 2) + 's';
      particleContainer.appendChild(p);
    }
  }

  // Phase 1: "What?" text, then name (0.8s)
  SFX.pop();
  setTimeout(() => {
    document.getElementById('evo-text').textContent = `${oldPkmn.name} is evolving!`;
    document.getElementById('evo-text').classList.add('evo-text-glow');
    spawnParticles();

    // Phase 2: Sprite starts pulsing, glow intensifies (1.5s)
    const oldSprite = document.getElementById('evo-old-sprite');
    const glow = document.getElementById('evo-glow');
    oldSprite.classList.add('evo-pulse');
    glow.classList.add('evo-glow-active');

    setTimeout(() => {
      // Phase 3: Rapid flicker between old and new (1s)
      oldSprite.classList.remove('evo-pulse');
      oldSprite.classList.add('evo-flicker');
      const newSprite = document.getElementById('evo-new-sprite');
      newSprite.classList.remove('evo-sprite-hidden');
      newSprite.classList.add('evo-flicker-alt');

      setTimeout(() => {
        // Phase 4: Big flash + swap
        const flash = document.getElementById('evo-flash');
        flash.classList.add('evo-flash-active');
        SFX.badge();

        setTimeout(() => {
          // Reveal new Pokemon
          oldSprite.classList.add('evo-sprite-hidden');
          oldSprite.classList.remove('evo-flicker');
          newSprite.classList.remove('evo-flicker-alt');
          newSprite.classList.add('evo-sprite-active', 'evo-new-reveal');
          flash.classList.remove('evo-flash-active');
          glow.classList.add('evo-glow-gold');

          document.getElementById('evo-text').textContent = `${oldPkmn.name} evolved into`;
          document.getElementById('evo-name-tag').textContent = newPkmn.name + '!';
          document.getElementById('evo-name-tag').classList.add('evo-name-reveal');

          launchConfetti();
          launchConfetti();

          // Phase 5: Show stats after a beat
          setTimeout(() => {
            document.getElementById('evo-stats-reveal').classList.remove('hidden');
            document.getElementById('evo-stats-reveal').classList.add('evo-stats-animate');

            // Phase 6: Done button
            setTimeout(() => {
              const btn = document.createElement('button');
              btn.className = 'btn-primary btn-xl evo-done-btn';
              btn.innerHTML = `<span style="font-size:24px;">✨</span> Amazing!`;
              btn.onclick = () => {
                overlay.classList.add('hidden');
                onComplete();
              };
              document.getElementById('evo-animation').appendChild(btn);
            }, 800);
          }, 600);
        }, 500);
      }, 1000);
    }, 1500);
  }, 800);
}
