// ===== POKEDEX & POKEMON LAB =====
// Pokedex viewer, Pokemon Lab hub, activity sessions
// ===== POKEDEX SCENE =====
Game.goToPokedex = function() {
  SFX.pop();
  const grid = document.getElementById('pokedex-grid');
  grid.innerHTML = '';
  document.getElementById('completion-badge').textContent = `${State.caught.length}/151`;

  POKEMON_DB.forEach((p, idx) => {
    const isCaught = State.caught.includes(p.id);
    const entry = document.createElement('div');
    entry.className = `pokedex-entry ${isCaught ? 'caught' : ''}`;
    entry.innerHTML = `
      <img class="dex-sprite ${isCaught ? '' : 'silhouette'}"
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png"
        alt="${isCaught ? p.name : '???'}">
      <div class="dex-name">${isCaught ? p.name : '???'}</div>
      <div class="dex-number">#${String(idx+1).padStart(3,'0')}</div>
    `;
    if (isCaught) {
      entry.addEventListener('click', () => openPokedexModal(p));
    }
    grid.appendChild(entry);
  });

  showScene('pokedex');
};

Game.closePokedexModal = function() {
  document.getElementById('pokedex-modal').classList.add('hidden');
};

// ===== POKEMON LAB HUB =====
Game.goToLab = function() {
  SFX.pop();
  renderLabHub();
  showScene('lab');
};

let _labActiveTab = 'pokedex';

function renderLabHub(tab) {
  if (tab) _labActiveTab = tab;
  const tabs = [
    { key: 'pokedex', label: '\ud83d\udcd6 Pok\u00e9dex' },
    { key: 'activities', label: '\ud83c\udfaf Activities' },
    { key: 'daily', label: '\ud83d\udcc5 Daily' },
    { key: 'buddy', label: '\ud83d\udc65 Buddy' },
  ];

  const tabContainer = document.getElementById('lab-tabs');
  if (!tabContainer) return;
  tabContainer.innerHTML = '';
  tabs.forEach(t => {
    const btn = document.createElement('button');
    btn.className = 'lab-tab' + (_labActiveTab === t.key ? ' active' : '');
    btn.textContent = t.label;
    btn.addEventListener('click', () => renderLabHub(t.key));
    tabContainer.appendChild(btn);
  });

  const area = document.getElementById('lab-activities');
  if (!area) return;
  area.innerHTML = '';

  if (_labActiveTab === 'pokedex') {
    // Render pokedex grid inline in the lab
    const countBadge = `<div style="font-size:13px;color:#888;margin-bottom:10px;">Caught: ${State.caught.length} / 151</div>`;
    area.innerHTML = countBadge;
    const grid = document.createElement('div');
    grid.className = 'pokedex-grid';
    POKEMON_DB.forEach((p, idx) => {
      const isCaught = State.caught.includes(p.id);
      const entry = document.createElement('div');
      entry.className = `pokedex-entry ${isCaught ? 'caught' : ''}`;
      entry.innerHTML = `
        <img class="dex-sprite ${isCaught ? '' : 'silhouette'}"
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png"
          alt="${isCaught ? p.name : '???'}">
        <div class="dex-name">${isCaught ? p.name : '???'}</div>
        <div class="dex-number">#${String(idx + 1).padStart(3, '0')}</div>
      `;
      if (isCaught) {
        entry.addEventListener('click', () => openPokedexModal(p));
      }
      grid.appendChild(entry);
    });
    area.appendChild(grid);

  } else if (_labActiveTab === 'activities') {
    const lvl = State.settings.level;
    if (typeof ACTIVITY_REGISTRY !== 'undefined') {
      const available = Object.entries(ACTIVITY_REGISTRY).filter(([, info]) => info.levels.includes(lvl));
      if (available.length === 0) {
        area.innerHTML = '<div style="text-align:center;color:#888;padding:20px;">No activities available for your level yet!</div>';
      } else {
        available.forEach(([key, info]) => {
          const card = document.createElement('div');
          card.className = 'lab-activity-card';
          card.innerHTML = `
            <div class="card-icon">${info.icon}</div>
            <div class="card-name">${info.name}</div>
            <div class="card-skill">${info.skill}</div>
          `;
          card.addEventListener('click', () => Game.startLabActivity(key));
          area.appendChild(card);
        });
      }
    } else {
      area.innerHTML = '<div style="text-align:center;color:#888;padding:20px;">Activities loading...</div>';
    }

  } else if (_labActiveTab === 'daily') {
    if (typeof DailyChallenge !== 'undefined') {
      area.innerHTML = DailyChallenge.renderCard();
    } else {
      area.innerHTML = '<div class="daily-card"><h3>\ud83c\udf1f Daily Challenge</h3><div>Come back each day for a special challenge!</div></div>';
    }

  } else if (_labActiveTab === 'buddy') {
    if (typeof Evolution !== 'undefined') {
      area.innerHTML = Evolution.renderBuddyCard();
      // Buddy picker — show caught pokemon to set as buddy
      if (State.caught.length > 0) {
        const pickerTitle = document.createElement('div');
        pickerTitle.style.cssText = 'font-weight:600;font-size:14px;margin-top:16px;margin-bottom:8px;';
        pickerTitle.textContent = 'Choose a Buddy:';
        area.appendChild(pickerTitle);
        const pickerGrid = document.createElement('div');
        pickerGrid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:8px;';
        State.caught.forEach(pokemonId => {
          const pkmn = POKEMON_DB.find(p => p.id === pokemonId);
          if (!pkmn) return;
          const btn = document.createElement('button');
          const isActive = State.evolution && State.evolution.buddy === pokemonId;
          btn.className = 'pokedex-entry caught' + (isActive ? ' selected' : '');
          btn.style.cssText = 'cursor:pointer;border:2px solid ' + (isActive ? 'var(--pk-blue,#1565C0)' : 'transparent') + ';';
          btn.innerHTML = `<img class="dex-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pkmn.id}.png" alt="${pkmn.name}"><div class="dex-name">${pkmn.name}</div>`;
          btn.addEventListener('click', () => {
            Evolution.setBuddy(pokemonId);
            notify(`${pkmn.name} is now your buddy! \ud83d\udc95`, 'success');
            renderLabHub('buddy');
          });
          pickerGrid.appendChild(btn);
        });
        area.appendChild(pickerGrid);
      }
    } else {
      area.innerHTML = '<div class="buddy-card">Buddy system loading...</div>';
    }
  }
}

// Activity session state
let _activitySession = {
  key: null,
  correct: 0,
  total: 0,
  currentChallenge: null,
};

Game.startLabActivity = function(activityKey) {
  if (typeof ACTIVITY_REGISTRY === 'undefined' || !ACTIVITY_REGISTRY[activityKey]) {
    notify('Activity not found!', 'error');
    return;
  }
  SFX.pop();
  _activitySession = { key: activityKey, correct: 0, total: 0, currentChallenge: null };
  const info = ACTIVITY_REGISTRY[activityKey];
  const titleEl = document.getElementById('activity-scene-title');
  if (titleEl) titleEl.textContent = info.icon + ' ' + info.name;
  _renderNextActivityChallenge();
  showScene('activity');
};

function _renderNextActivityChallenge() {
  const key = _activitySession.key;
  if (!key || typeof ACTIVITY_REGISTRY === 'undefined') return;
  const info = ACTIVITY_REGISTRY[key];
  const difficulty = (State.settings && State.settings.level) || 3;
  const challenge = info.generator(difficulty);
  _activitySession.currentChallenge = challenge;

  const playArea = document.getElementById('activity-play-area');
  if (playArea) playArea.innerHTML = renderChallengeHTML(challenge, 'activity');
  const feedback = document.getElementById('activity-feedback');
  if (feedback) { feedback.className = 'activity-feedback hidden'; feedback.textContent = ''; }
  _updateActivityScore();
}

function _updateActivityScore() {
  const scoreEl = document.getElementById('activity-score');
  if (scoreEl) scoreEl.textContent = `${_activitySession.correct} / ${_activitySession.total}`;
}

Game.submitActivityAnswer = function(answer) {
  const ch = _activitySession.currentChallenge;
  if (!ch) return;
  const isCorrect = String(answer).toLowerCase().trim() === String(ch.answer).toLowerCase().trim();
  _activitySession.total++;
  if (isCorrect) { _activitySession.correct++; SFX.correct(); addXp(10); } else { SFX.wrong(); }
  if (typeof onAnswerResult === 'function') onAnswerResult(isCorrect, { scene: 'activity', challengeType: ch.type });
  const feedback = document.getElementById('activity-feedback');
  if (feedback) {
    feedback.textContent = isCorrect ? '\u2705 Correct! Well done!' : '\u274c Not quite! The answer was: ' + ch.answer;
    feedback.className = 'activity-feedback ' + (isCorrect ? 'correct' : 'wrong');
  }
  _updateActivityScore();
  setTimeout(() => _renderNextActivityChallenge(), 1800);
};

Game.exitActivity = function() {
  SFX.pop();
  renderLabHub('activities');
  showScene('lab');
};

function openPokedexModal(p) {
  SFX.pop();
  const content = document.getElementById('pokedex-modal-content');
  const typeColor = getTypeColor(p.type);
  content.innerHTML = `
    <img class="pokedex-detail-sprite"
      src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png"
      alt="${p.name}">
    <div class="pokedex-detail-name">${p.name}</div>
    <div class="pokedex-detail-types">
      <span class="type-badge type-${p.type.toLowerCase()}">${p.type}</span>
    </div>
    <div class="stat-row">
      <span class="stat-label">HP</span>
      <div class="stat-bar"><div class="stat-fill stat-hp" style="width:${Math.min(p.hp/160*100,100)}%"></div></div>
      <span class="stat-value">${p.hp}</span>
    </div>
    <div class="stat-row">
      <span class="stat-label">Attack</span>
      <div class="stat-bar"><div class="stat-fill stat-atk" style="width:${Math.min(p.atk/120*100,100)}%"></div></div>
      <span class="stat-value">${p.atk}</span>
    </div>
    <div class="stat-row">
      <span class="stat-label">Defense</span>
      <div class="stat-bar"><div class="stat-fill stat-def" style="width:${Math.min(p.def/170*100,100)}%"></div></div>
      <span class="stat-value">${p.def}</span>
    </div>
    <div class="stat-row">
      <span class="stat-label">Speed</span>
      <div class="stat-bar"><div class="stat-fill stat-spd" style="width:${Math.min(p.spd/110*100,100)}%"></div></div>
      <span class="stat-value">${p.spd}</span>
    </div>
    <div class="pokedex-fun-fact">💡 ${p.clue4}</div>
  `;
  document.getElementById('pokedex-modal').classList.remove('hidden');
}

function getTypeColor(type) {
  const map = { Fire:'#FF6B35', Water:'#4A90D9', Grass:'#4CAF50', Electric:'#F5C518',
    Psychic:'#E91E8C', Rock:'#9E8A6A', Ground:'#C8A876', Poison:'#9C59B3',
    Normal:'#A8A878', Ghost:'#705898', Dragon:'#6040C0', Ice:'#98D8D8',
    Bug:'#A8B820', Flying:'#A890F0', Fighting:'#C03028' };
  return map[type] || '#888';
}

