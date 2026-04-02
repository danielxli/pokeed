// ===== SETTINGS & INITIALIZATION =====
// Level selection, settings panel, game boot
// ===== SETTINGS =====
const LEVEL_DATA = [
  { level: 1, name: 'Little Trainer', ages: 'Pre-K (Ages 4-5)', icon: '🌟', desc: 'Counting, number recognition, CVC word + emoji matching' },
  { level: 2, name: 'Rookie Trainer', ages: 'Kindergarten (Ages 5-6)', icon: '⭐', desc: 'Add & subtract within 10, CVC words, simple reading' },
  { level: 3, name: 'Junior Trainer', ages: '1st Grade (Ages 6-7)', icon: '🏅', desc: 'Add & subtract within 20, reading, simple spelling' },
  { level: 4, name: 'Star Trainer', ages: '2nd-3rd Grade (Ages 7-9)', icon: '🚀', desc: 'Bigger numbers, multiplication intro, comprehension' },
  { level: 5, name: 'Master Trainer', ages: '4th-5th Grade (Ages 9-11)', icon: '👑', desc: 'Multiply, divide, harder reading comprehension' },
];

Game.openSettings = function() {
  SFX.pop();
  const overlay = document.getElementById('settings-overlay');
  overlay.classList.remove('hidden');
  renderLevelCards();
};

Game.closeSettings = function() {
  document.getElementById('settings-overlay').classList.add('hidden');
};

Game.setLevel = function(n) {
  SFX.click();
  State.settings.level = n;
  renderLevelCards();
  notify(`Level set to ${LEVEL_DATA[n-1].name}!`, 'success');
};

function renderLevelCards() {
  const container = document.getElementById('level-cards');
  if (!container) return;
  container.innerHTML = '';
  LEVEL_DATA.forEach(ld => {
    const isSelected = State.settings.level === ld.level;
    const card = document.createElement('div');
    card.className = `level-card ${isSelected ? 'selected' : ''}`;
    card.innerHTML = `
      <div class="level-card-icon">${ld.icon}</div>
      <div class="level-card-body">
        <div class="level-card-name">${ld.name}</div>
        <div class="level-card-age">${ld.ages}</div>
        <div class="level-card-desc">${ld.desc}</div>
      </div>
      <div class="level-card-check">✓</div>
    `;
    card.addEventListener('click', () => Game.setLevel(ld.level));
    container.appendChild(card);
  });
}

// Close settings on overlay background click
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('settings-overlay')) {
    Game.closeSettings();
  }
});

// ===== RESET PROGRESS =====
Game.confirmReset = function() {
  document.getElementById('reset-confirm-overlay').classList.remove('hidden');
};

Game.cancelReset = function() {
  document.getElementById('reset-confirm-overlay').classList.add('hidden');
};

Game.executeReset = function() {
  try { if (_store) _store.removeItem('pokemon-edu-save'); } catch (e) {}
  // Reset State to defaults
  State.trainerName = 'Trainer';
  State.level = 1;
  State.xp = 0;
  State.caught = [];
  State.pokemonHp = {};
  State.badges = [];
  State.eliteFourDefeated = [];
  State.settings.level = 3;
  State.streak = null;
  State.evolution = null;
  location.reload();
};

// ===== INITIALIZATION =====
(function init() {
  // Pre-connect AudioContext on first interaction
  document.body.addEventListener('touchstart', () => getAudio(), { once: true });
  document.body.addEventListener('click', () => getAudio(), { once: true });

  // Keyboard enter for title
  document.getElementById('trainer-name-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('start-btn').click();
  });

  // Keyboard enter for guess
  document.getElementById('pokemon-guess-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      if (document.getElementById('autocomplete-list').children.length > 0) {
        guessInput.value = document.getElementById('autocomplete-list').children[0].textContent;
        autocompleteList.innerHTML = '';
      } else {
        Game.submitGuess();
      }
    }
  });

  // Load saved state — if exists, skip title and go to map
  if (loadState()) {
    updateTrainerBar();
    showScene('map');
    setTimeout(() => notify(`Welcome back, ${State.trainerName}!`, 'success'), 300);
  } else {
    showScene('title');
  }
})();
