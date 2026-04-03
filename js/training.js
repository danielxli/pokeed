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
}

function nextDrillQuestion() {
  if (!_drillSession || !_drillSession.active) return;

  const types = _drillSession.challengeTypes;
  const type = types[Math.floor(Math.random() * types.length)];
  const difficulty = State.settings.level;

  const ch = getChallenge(type, difficulty);
  if (!ch) {
    // fallback to math
    window._trainingChallenge = getChallenge('math', difficulty);
  } else {
    window._trainingChallenge = ch;
  }

  // Set up answer callback
  window._onTrainingAnswer = function(isCorrect) {
    if (!_drillSession || !_drillSession.active) return;
    handleDrillAnswer(isCorrect);
  };

  // Render challenge
  const area = document.getElementById('drill-challenge-area');
  area.innerHTML = renderChallengeHTML(window._trainingChallenge, 'training');
}

function handleDrillAnswer(isCorrect) {
  if (!_drillSession || !_drillSession.active) return;

  if (isCorrect) {
    _drillSession.correct++;
    _drillSession.streak++;
    if (_drillSession.streak > _drillSession.maxStreak) _drillSession.maxStreak = _drillSession.streak;

    // XP with streak bonus
    let xp = 5;
    if (_drillSession.streak >= 10) xp = 15;
    else if (_drillSession.streak >= 5) xp = 10;
    else if (_drillSession.streak >= 3) xp = 7;
    _drillSession.xpEarned += xp;

    // Attack animation
    showDrillHit(xp);
    SFX.correct();
  } else {
    _drillSession.wrong++;
    _drillSession.streak = 0;
    showDrillMiss();
    SFX.wrong();
  }

  updateDrillUI();

  // Next question after brief delay
  setTimeout(() => {
    if (_drillSession && _drillSession.active) nextDrillQuestion();
  }, isCorrect ? 400 : 600);
}

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

  // Replace in caught array
  const idx = State.caught.indexOf(oldId);
  if (idx !== -1) {
    State.caught[idx] = newId;
  }
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

  overlay.innerHTML = `
    <div class="evo-animation">
      <div class="evo-text" id="evo-text">What? ${oldPkmn.name} is evolving!</div>
      <div class="evo-sprite-area">
        <img id="evo-old-sprite" class="evo-sprite" src="${spriteUrl(oldPkmn.id)}" alt="${oldPkmn.name}">
        <img id="evo-new-sprite" class="evo-sprite evo-sprite-hidden" src="${spriteUrl(newPkmn.id)}" alt="${newPkmn.name}">
      </div>
      <div class="evo-flash" id="evo-flash"></div>
    </div>`;

  SFX.pop();

  // Phase 1: Old sprite pulses (1.5s)
  const oldSprite = document.getElementById('evo-old-sprite');
  oldSprite.classList.add('evo-pulse');

  setTimeout(() => {
    // Phase 2: Flash
    const flash = document.getElementById('evo-flash');
    flash.classList.add('evo-flash-active');
    SFX.badge();

    setTimeout(() => {
      // Phase 3: Swap sprites
      oldSprite.classList.add('evo-sprite-hidden');
      const newSprite = document.getElementById('evo-new-sprite');
      newSprite.classList.remove('evo-sprite-hidden');

      document.getElementById('evo-text').textContent =
        `${oldPkmn.name} evolved into ${newPkmn.name}!`;

      flash.classList.remove('evo-flash-active');
      launchConfetti();
      launchConfetti();

      // Phase 4: Show complete button
      setTimeout(() => {
        const btn = document.createElement('button');
        btn.className = 'btn-primary btn-xl evo-done-btn';
        btn.textContent = `🎉 ${newPkmn.name}!`;
        btn.onclick = () => {
          overlay.classList.add('hidden');
          onComplete();
        };
        overlay.querySelector('.evo-animation').appendChild(btn);
      }, 1000);
    }, 600);
  }, 1800);
}
