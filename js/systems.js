// =============================================================================
// systems.js — Cross-Cutting Game Systems
// Loaded after game.js. All symbols are global (no modules).
// Depends on: State, POKEMON_DB, notify(), SFX, launchConfetti(), addXp()
// =============================================================================

// ---------------------------------------------------------------------------
// DEFENSIVE STATE INIT
// Each system checks and initialises its slice of State only if missing.
// ---------------------------------------------------------------------------
(function initSystemsState() {
  if (!State.dda) {
    State.dda = { recent: [], adjustedDifficulty: 0 };
  }
  if (!State.streak) {
    State.streak = { current: 0, best: 0 };
  }
  if (!State.dailyChallenge) {
    State.dailyChallenge = { lastCompleted: null, completedToday: false };
  }
  if (!State.evolution) {
    State.evolution = { buddy: null, correctCount: 0 };
  }
  if (!State.sessionTimer) {
    State.sessionTimer = {
      startTime: null,
      totalMinutes: 0,
      breaksTaken: 0,
      nudgeShown: false,
    };
  }
  if (!State.collab) {
    State.collab = {
      enabled: false,
      players: ['Player 1', 'Player 2'],
      currentPlayer: 0,
      scores: [0, 0],
    };
  }
})();

// =============================================================================
// 1. DYNAMIC DIFFICULTY ADJUSTMENT (DDA)
// =============================================================================
const DDA = (function () {
  const WINDOW = 5; // number of recent answers to consider
  const HIGH_THRESHOLD = 5; // all correct → harder
  const LOW_THRESHOLD = 3;  // 3+ wrong   → easier

  function recordAnswer(correct) {
    if (!State.dda) State.dda = { recent: [], adjustedDifficulty: 0 };
    State.dda.recent.push(correct ? 1 : 0);
    if (State.dda.recent.length > WINDOW) {
      State.dda.recent.shift();
    }
    State.dda.adjustedDifficulty = _calculate();
  }

  function getAdjustedDifficulty() {
    if (!State.dda) return 0;
    return State.dda.adjustedDifficulty;
  }

  function _calculate() {
    const recent = (State.dda && State.dda.recent) || [];
    if (recent.length < WINDOW) return 0; // not enough data yet
    const correct = recent.reduce((s, v) => s + v, 0);
    const wrong = WINDOW - correct;
    if (correct === HIGH_THRESHOLD) return 1;   // all 5 correct → +1
    if (wrong >= LOW_THRESHOLD) return -1;       // 3+ wrong → -1
    return 0;
  }

  /**
   * Returns the effective difficulty (1–5) combining player setting + DDA offset.
   */
  function getEffectiveDifficulty() {
    const base = (State.settings && State.settings.level) || 3;
    return Math.min(Math.max(base + getAdjustedDifficulty(), 1), 5);
  }

  return { recordAnswer, getAdjustedDifficulty, getEffectiveDifficulty };
})();

// =============================================================================
// 2. STREAK BONUSES
// =============================================================================
const Streaks = (function () {
  const MILESTONE_5  = 5;
  const MILESTONE_10 = 10;

  function record(correct) {
    if (!State.streak) State.streak = { current: 0, best: 0 };

    if (correct) {
      State.streak.current += 1;
      if (State.streak.current > State.streak.best) {
        State.streak.best = State.streak.current;
      }
      _checkMilestones(State.streak.current);
    } else {
      State.streak.current = 0;
    }
  }

  function _checkMilestones(streak) {
    if (streak === MILESTONE_10) {
      notify('⚡ UNSTOPPABLE! 10 in a row! +50 bonus XP', 'success');
      addXp(50);
      launchConfetti();
      if (SFX.superEffective) SFX.superEffective();
    } else if (streak === MILESTONE_5) {
      notify('🔥 Super Effective! 5 in a row! +25 bonus XP', 'success');
      addXp(25);
      if (SFX.superEffective) SFX.superEffective();
    }
  }

  function getCurrent() {
    return (State.streak && State.streak.current) || 0;
  }

  function getBest() {
    return (State.streak && State.streak.best) || 0;
  }

  return { record, getCurrent, getBest };
})();

// =============================================================================
// 3. DAILY CHALLENGE
// =============================================================================
const DailyChallenge = (function () {

  function _todayString() {
    return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  }

  function _loadFromStorage() {
    // In-memory only — daily challenge resets each session
    if (State.dailyChallenge.lastCompleted) {
      State.dailyChallenge.completedToday = (State.dailyChallenge.lastCompleted === _todayString());
    }
  }

  function _saveToStorage(dateStr) {
    // In-memory persistence
    State.dailyChallenge.lastCompleted = dateStr;
    State.dailyChallenge.completedToday = true;
  }

  // Call once on startup to sync persisted state
  _loadFromStorage();

  function isAvailable() {
    if (!State.dailyChallenge) return true;
    _loadFromStorage();
    return !State.dailyChallenge.completedToday;
  }

  /**
   * Returns a challenge descriptor for external challenge generators.
   * Passes difficulty +1 above current setting (clamped to 5).
   */
  function generate() {
    const baseDifficulty = (State.settings && State.settings.level) || 3;
    const difficulty = Math.min(baseDifficulty + 1, 5);
    return { type: 'daily', difficulty };
  }

  function complete() {
    if (!State.dailyChallenge) {
      State.dailyChallenge = { lastCompleted: null, completedToday: false };
    }
    const today = _todayString();
    State.dailyChallenge.lastCompleted = today;
    State.dailyChallenge.completedToday = true;
    _saveToStorage(today);

    // Award a rare Pokémon or XP
    const uncaught = POKEMON_DB.filter(p => !State.caught.includes(p.id));
    if (uncaught.length > 0) {
      const rare = uncaught[Math.floor(Math.random() * uncaught.length)];
      State.caught.push(rare.id);
      markSeen(rare.id);
      initPokemonHp(rare.id);
      launchConfetti();
      SFX.caught();
      notify(`🌟 Daily Challenge Complete! You found a rare ${rare.name}!`, 'success');
    } else {
      addXp(100);
      notify('🌟 Daily Challenge Complete! You caught every Pokémon — +100 XP!', 'success');
    }
  }

  function renderCard() {
    const available = isAvailable();
    const statusLabel = available
      ? '<span class="dc-status dc-available">✅ Available</span>'
      : '<span class="dc-status dc-done">✔ Completed</span>';
    const btnHtml = available
      ? '<button class="dc-btn" onclick="DailyChallenge.complete()">Start Challenge</button>'
      : '';
    return `
      <div class="daily-challenge-card${available ? '' : ' dc-completed'}">
        <div class="dc-header">
          <span class="dc-icon">✨</span>
          <span class="dc-title">Daily Challenge</span>
          ${statusLabel}
        </div>
        <div class="dc-body">Complete for a rare Pokémon!</div>
        ${btnHtml}
      </div>`;
  }

  return { isAvailable, generate, complete, renderCard };
})();

// =============================================================================
// 4. POKEMON EVOLUTION TRIGGERS
// =============================================================================

/**
 * EVOLUTION_CHAINS — Gen 1 complete map.
 * Key: pokémon ID. Value: { evolvesTo: number | number[], required: number }
 * For Eevee the evolvesTo is an array; one is chosen at random.
 * required = cumulative correct answers with that buddy to evolve.
 */
const EVOLUTION_CHAINS = {
  // Bulbasaur line
  1:  { evolvesTo: 2,         required: 15 },
  2:  { evolvesTo: 3,         required: 30 },
  // Charmander line
  4:  { evolvesTo: 5,         required: 15 },
  5:  { evolvesTo: 6,         required: 30 },
  // Squirtle line
  7:  { evolvesTo: 8,         required: 15 },
  8:  { evolvesTo: 9,         required: 30 },
  // Caterpie line
  10: { evolvesTo: 11,        required: 15 },
  11: { evolvesTo: 12,        required: 30 },
  // Weedle line
  13: { evolvesTo: 14,        required: 15 },
  14: { evolvesTo: 15,        required: 30 },
  // Pidgey line
  16: { evolvesTo: 17,        required: 15 },
  17: { evolvesTo: 18,        required: 30 },
  // Rattata line
  19: { evolvesTo: 20,        required: 15 },
  // Spearow line
  21: { evolvesTo: 22,        required: 15 },
  // Ekans line
  23: { evolvesTo: 24,        required: 15 },
  // Pikachu line
  25: { evolvesTo: 26,        required: 15 },
  // Sandshrew line
  27: { evolvesTo: 28,        required: 15 },
  // Nidoran♀ line
  29: { evolvesTo: 30,        required: 15 },
  30: { evolvesTo: 31,        required: 30 },
  // Nidoran♂ line
  32: { evolvesTo: 33,        required: 15 },
  33: { evolvesTo: 34,        required: 30 },
  // Clefairy line
  35: { evolvesTo: 36,        required: 15 },
  // Vulpix line
  37: { evolvesTo: 38,        required: 15 },
  // Jigglypuff line
  39: { evolvesTo: 40,        required: 15 },
  // Zubat line
  41: { evolvesTo: 42,        required: 15 },
  // Oddish line
  43: { evolvesTo: 44,        required: 15 },
  44: { evolvesTo: 45,        required: 30 },
  // Paras line
  46: { evolvesTo: 47,        required: 15 },
  // Venonat line
  48: { evolvesTo: 49,        required: 15 },
  // Diglett line
  50: { evolvesTo: 51,        required: 15 },
  // Meowth line
  52: { evolvesTo: 53,        required: 15 },
  // Psyduck line
  54: { evolvesTo: 55,        required: 15 },
  // Mankey line
  56: { evolvesTo: 57,        required: 15 },
  // Growlithe line
  58: { evolvesTo: 59,        required: 15 },
  // Poliwag line
  60: { evolvesTo: 61,        required: 15 },
  61: { evolvesTo: 62,        required: 30 },
  // Abra line
  63: { evolvesTo: 64,        required: 15 },
  64: { evolvesTo: 65,        required: 30 },
  // Machop line
  66: { evolvesTo: 67,        required: 15 },
  67: { evolvesTo: 68,        required: 30 },
  // Bellsprout line
  69: { evolvesTo: 70,        required: 15 },
  70: { evolvesTo: 71,        required: 30 },
  // Tentacool line
  72: { evolvesTo: 73,        required: 15 },
  // Geodude line
  74: { evolvesTo: 75,        required: 15 },
  75: { evolvesTo: 76,        required: 30 },
  // Ponyta line
  77: { evolvesTo: 78,        required: 15 },
  // Slowpoke line
  79: { evolvesTo: 80,        required: 15 },
  // Magnemite line
  81: { evolvesTo: 82,        required: 15 },
  // Doduo line
  84: { evolvesTo: 85,        required: 15 },
  // Seel line
  86: { evolvesTo: 87,        required: 15 },
  // Grimer line
  88: { evolvesTo: 89,        required: 15 },
  // Shellder line
  90: { evolvesTo: 91,        required: 15 },
  // Gastly line
  92: { evolvesTo: 93,        required: 15 },
  93: { evolvesTo: 94,        required: 30 },
  // Drowzee line
  96: { evolvesTo: 97,        required: 15 },
  // Krabby line
  98: { evolvesTo: 99,        required: 15 },
  // Voltorb line
  100: { evolvesTo: 101,      required: 15 },
  // Exeggcute line
  102: { evolvesTo: 103,      required: 15 },
  // Cubone line
  104: { evolvesTo: 105,      required: 15 },
  // Koffing line
  109: { evolvesTo: 110,      required: 15 },
  // Rhyhorn line
  111: { evolvesTo: 112,      required: 15 },
  // Horsea line
  116: { evolvesTo: 117,      required: 15 },
  // Goldeen line
  118: { evolvesTo: 119,      required: 15 },
  // Staryu line
  120: { evolvesTo: 121,      required: 15 },
  // Magikarp line
  129: { evolvesTo: 130,      required: 15 },
  // Eevee — random branch
  133: { evolvesTo: [134, 135, 136], required: 15 },
  // Omanyte line
  138: { evolvesTo: 139,      required: 15 },
  // Kabuto line
  140: { evolvesTo: 141,      required: 15 },
  // Dratini line
  147: { evolvesTo: 148,      required: 15 },
  148: { evolvesTo: 149,      required: 30 },
};

const Evolution = (function () {
  function _pokemonName(id) {
    const p = POKEMON_DB.find(pk => pk.id === id);
    return p ? p.name : `Pokémon #${id}`;
  }

  function setBuddy(pokemonId) {
    if (!State.evolution) State.evolution = { buddy: null, correctCount: 0 };
    State.evolution.buddy = pokemonId;
    State.evolution.correctCount = 0;
  }

  function recordCorrect() {
    if (!State.evolution || !State.evolution.buddy) return;
    const chain = EVOLUTION_CHAINS[State.evolution.buddy];
    if (!chain) return; // buddy has no evolution
    State.evolution.correctCount += 1;
    checkEvolution();
  }

  function checkEvolution() {
    if (!State.evolution || !State.evolution.buddy) return;
    const buddyId = State.evolution.buddy;
    const chain = EVOLUTION_CHAINS[buddyId];
    if (!chain) return;
    if (State.evolution.correctCount < chain.required) return;

    // Determine evolved form (handle Eevee branch)
    let evolvedId;
    if (Array.isArray(chain.evolvesTo)) {
      evolvedId = chain.evolvesTo[Math.floor(Math.random() * chain.evolvesTo.length)];
    } else {
      evolvedId = chain.evolvesTo;
    }

    const oldName = _pokemonName(buddyId);
    const newName = _pokemonName(evolvedId);

    // Show evolution overlay
    _showEvolutionScreen(oldName, newName, evolvedId, buddyId);
  }

  function _showEvolutionScreen(oldName, newName, evolvedId, oldId) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'evolution-overlay';
    overlay.style.cssText = [
      'position:fixed', 'inset:0', 'background:rgba(0,0,0,0.85)',
      'display:flex', 'flex-direction:column', 'align-items:center',
      'justify-content:center', 'z-index:9000',
      'color:#fff', 'font-family:inherit', 'text-align:center',
      'padding:24px', 'animation:fadeIn 0.4s ease',
    ].join(';');

    overlay.innerHTML = `
      <div class="evo-stage1" style="font-size:1.8rem;font-weight:700;margin-bottom:1rem;">
        ✨ What? <strong>${oldName}</strong> is evolving!
      </div>
      <div class="evo-spinner" style="font-size:4rem;animation:spin 0.6s linear infinite;">⚙️</div>
    `;
    document.body.appendChild(overlay);

    // After 2 seconds reveal the evolved form
    setTimeout(function () {
      overlay.innerHTML = `
        <div style="font-size:2rem;font-weight:700;margin-bottom:0.75rem;">
          🎉 Congratulations!
        </div>
        <div style="font-size:1.5rem;margin-bottom:1.5rem;">
          Your <strong>${oldName}</strong> evolved into <strong>${newName}</strong>!
        </div>
        <div style="font-size:3.5rem;margin-bottom:1.5rem;">🌟</div>
        <button
          style="padding:0.6rem 1.8rem;font-size:1rem;border-radius:999px;border:none;
                 background:#FFD700;color:#333;font-weight:700;cursor:pointer;"
          onclick="document.getElementById('evolution-overlay').remove()">
          Awesome!
        </button>
      `;

      // Add evolved Pokémon to caught list
      if (!State.caught.includes(evolvedId)) {
        State.caught.push(evolvedId);
        markSeen(evolvedId);
        initPokemonHp(evolvedId);
      }

      // Update buddy to evolved form and reset counter
      State.evolution.buddy = evolvedId;
      State.evolution.correctCount = 0;

      launchConfetti();
      SFX.caught();
      addXp(50);
    }, 2000);
  }

  function renderBuddyCard() {
    if (!State.evolution) return '<div class="buddy-card">No buddy selected.</div>';
    const buddyId = State.evolution.buddy;
    if (!buddyId) {
      return `<div class="buddy-card">
        <em>No buddy set. Pick a Pokémon from your Pokédex!</em>
      </div>`;
    }

    const chain = EVOLUTION_CHAINS[buddyId];
    const buddyName = _pokemonName(buddyId);

    if (!chain) {
      return `<div class="buddy-card">
        <strong>Buddy:</strong> ${buddyName} — fully evolved!
      </div>`;
    }

    const count = State.evolution.correctCount || 0;
    const required = chain.required;
    const pct = Math.min(count / required, 1);
    const filledBlocks = Math.round(pct * 10);
    const bar = '█'.repeat(filledBlocks) + '░'.repeat(10 - filledBlocks);

    return `<div class="buddy-card">
      <strong>Buddy:</strong> ${buddyName}
      <div class="buddy-progress" style="font-family:monospace;margin-top:4px;">
        ${bar} ${count}/${required} to evolve!
      </div>
    </div>`;
  }

  return { setBuddy, recordCorrect, checkEvolution, renderBuddyCard };
})();

// =============================================================================
// 5. SESSION TIMER WITH BREAK NUDGE
// =============================================================================
const SessionTimer = (function () {
  const NUDGE_INTERVAL_MINUTES = 15;
  let _intervalId = null;

  function start() {
    if (!State.sessionTimer) {
      State.sessionTimer = {
        startTime: null,
        totalMinutes: 0,
        breaksTaken: 0,
        nudgeShown: false,
      };
    }
    State.sessionTimer.startTime = Date.now();
    State.sessionTimer.nudgeShown = false;

    // Check every 60 seconds automatically
    if (_intervalId) clearInterval(_intervalId);
    _intervalId = setInterval(check, 60 * 1000);
  }

  function check() {
    if (!State.sessionTimer || !State.sessionTimer.startTime) return;
    const elapsed = _elapsedMinutes();
    State.sessionTimer.totalMinutes = elapsed;

    if (elapsed >= NUDGE_INTERVAL_MINUTES && !State.sessionTimer.nudgeShown) {
      State.sessionTimer.nudgeShown = true;
      _showBreakOverlay(elapsed);
    }
  }

  function _elapsedMinutes() {
    if (!State.sessionTimer || !State.sessionTimer.startTime) return 0;
    return Math.floor((Date.now() - State.sessionTimer.startTime) / 60000);
  }

  function _showBreakOverlay(minutes) {
    // Avoid duplicate overlays
    if (document.getElementById('break-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'break-overlay';
    overlay.style.cssText = [
      'position:fixed', 'inset:0', 'background:rgba(0,0,0,0.75)',
      'display:flex', 'flex-direction:column', 'align-items:center',
      'justify-content:center', 'z-index:8000',
      'color:#fff', 'font-family:inherit', 'text-align:center',
      'padding:32px',
    ].join(';');

    overlay.innerHTML = `
      <div style="background:#1a1a2e;border-radius:16px;padding:2rem 2.5rem;max-width:380px;
                  box-shadow:0 8px 32px rgba(0,0,0,0.5);">
        <div style="font-size:3rem;margin-bottom:0.75rem;">🌟</div>
        <div style="font-size:1.4rem;font-weight:700;margin-bottom:0.75rem;">
          Great job, Trainer!
        </div>
        <div style="font-size:1rem;margin-bottom:1.5rem;opacity:0.9;">
          You've been playing for ${minutes} minutes.<br>Time for a quick break?
        </div>
        <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">
          <button id="break-btn-take"
            style="padding:0.6rem 1.4rem;border-radius:999px;border:none;
                   background:#4CAF50;color:#fff;font-weight:700;cursor:pointer;font-size:0.95rem;">
            Take a Break
          </button>
          <button id="break-btn-keep"
            style="padding:0.6rem 1.4rem;border-radius:999px;border:none;
                   background:#FF9800;color:#fff;font-weight:700;cursor:pointer;font-size:0.95rem;">
            Keep Playing
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById('break-btn-take').addEventListener('click', function () {
      _takeBreak(overlay);
    });
    document.getElementById('break-btn-keep').addEventListener('click', function () {
      _keepPlaying(overlay);
    });
  }

  function _takeBreak(overlay) {
    State.sessionTimer.breaksTaken += 1;
    // Pause the timer
    if (_intervalId) { clearInterval(_intervalId); _intervalId = null; }
    State.sessionTimer.startTime = null;

    overlay.querySelector('div').innerHTML = `
      <div style="font-size:3rem;margin-bottom:0.75rem;">😴</div>
      <div style="font-size:1.4rem;font-weight:700;margin-bottom:0.75rem;">Enjoy your break!</div>
      <div style="font-size:0.95rem;margin-bottom:1.5rem;opacity:0.9;">
        See you soon, Trainer!
      </div>
      <button id="break-btn-return"
        style="padding:0.6rem 1.6rem;border-radius:999px;border:none;
               background:#2196F3;color:#fff;font-weight:700;cursor:pointer;font-size:0.95rem;">
        I'm Back!
      </button>
    `;
    document.getElementById('break-btn-return').addEventListener('click', function () {
      overlay.remove();
      notify("Welcome back, Trainer! Let's keep learning!", 'success');
      start(); // restart timer
    });
  }

  function _keepPlaying(overlay) {
    overlay.remove();
    // Reset the nudge so it fires again in another 15 minutes
    State.sessionTimer.nudgeShown = false;
    State.sessionTimer.startTime = Date.now(); // reset clock for next interval
  }

  function getPlaytime() {
    return _elapsedMinutes();
  }

  function renderTimerUI() {
    const mins = _elapsedMinutes();
    return `<span class="session-timer-ui" title="Session time">⏱️ ${mins} min</span>`;
  }

  return { start, check, getPlaytime, renderTimerUI };
})();

// =============================================================================
// 6. COLLABORATIVE MODE
// =============================================================================
const Collab = (function () {
  function enable(name1, name2) {
    if (!State.collab) {
      State.collab = {
        enabled: false,
        players: ['Player 1', 'Player 2'],
        currentPlayer: 0,
        scores: [0, 0],
      };
    }
    State.collab.enabled = true;
    State.collab.players = [name1 || 'Player 1', name2 || 'Player 2'];
    State.collab.currentPlayer = 0;
    State.collab.scores = [0, 0];
    notify(`👥 Co-op mode: ${State.collab.players[0]} vs ${State.collab.players[1]}!`, 'info');
  }

  function disable() {
    if (State.collab) State.collab.enabled = false;
  }

  function getCurrentPlayer() {
    if (!State.collab) return 'Player 1';
    return State.collab.players[State.collab.currentPlayer] || 'Player 1';
  }

  function switchTurn() {
    if (!State.collab || !State.collab.enabled) return;
    State.collab.currentPlayer = State.collab.currentPlayer === 0 ? 1 : 0;
  }

  function addPoint(playerIndex) {
    if (!State.collab) return;
    if (playerIndex !== 0 && playerIndex !== 1) return;
    State.collab.scores[playerIndex] = (State.collab.scores[playerIndex] || 0) + 1;
  }

  function renderScoreboard() {
    if (!State.collab) return '';
    const [n1, n2] = State.collab.players;
    const [s1, s2] = State.collab.scores;
    return `<div class="collab-scoreboard">
      <span class="collab-p1">🧢 ${n1}: ${s1} ⭐</span>
      <span class="collab-sep"> &nbsp;|&nbsp; </span>
      <span class="collab-p2">🧢 ${n2}: ${s2} ⭐</span>
    </div>`;
  }

  function renderTurnIndicator() {
    if (!State.collab || !State.collab.enabled) return '';
    const name = getCurrentPlayer();
    return `<div class="collab-turn">It's <strong>${name}</strong>'s turn!</div>`;
  }

  return { enable, disable, getCurrentPlayer, switchTurn, addPoint, renderScoreboard, renderTurnIndicator };
})();

// =============================================================================
// CENTRAL HOOK: onAnswerResult()
// Call this after every answer (correct or wrong) from game.js.
// context (optional) — extra info such as { scene, challengeType }
// =============================================================================
function onAnswerResult(correct, context) {
  DDA.recordAnswer(correct);
  Streaks.record(correct);
  if (State.evolution && State.evolution.buddy && correct) {
    Evolution.recordCorrect();
  }
  SessionTimer.check();
  if (State.collab && State.collab.enabled) {
    Collab.switchTurn();
  }
}
