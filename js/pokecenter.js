// ===== POKEMON CENTER =====
// Heal Pokemon after gym battles + Word Search mini-game activity
// ===== POKEMON CENTER =====
Game.goToPokeCenter = function() {
  SFX.pop();
  renderPokeCenter();
  showScene('pokecenter');
};

function renderPokeCenter() {
  const container = document.getElementById('pokecenter-scroll');
  if (!container) return;

  const caughtPokemon = State.caught.map(id => POKEMON_DB.find(p => p.id === id)).filter(Boolean);
  const hasCaught = caughtPokemon.length > 0;

  // Count hurt/fainted Pokemon
  const hurtCount = caughtPokemon.filter(p => {
    const cur = getPokemonHp(p.id);
    return cur < p.hp;
  }).length;

  let html = '';

  // Nurse Joy greeting
  const nurseMsg = !hasCaught
    ? "Welcome to the Pokémon Center! Come back once you've caught some Pokémon."
    : hurtCount === 0
    ? "All your Pokémon are in perfect health! Great job, Trainer!"
    : hurtCount === 1
    ? "Oh! One of your Pokémon needs some rest. I'll take care of it!"
    : `I see ${hurtCount} of your Pokémon need healing. Let me fix them right up!`;

  const nurseSub = !hasCaught
    ? "Explore the Tall Grass to find and catch wild Pokémon!"
    : hurtCount === 0
    ? "Come back after gym battles if your Pokémon need healing."
    : "Complete a Word Search puzzle to heal your Pokémon!";

  // Heal button: launches word search, then heals on completion
  const healBtnLabel = hurtCount === 0 ? 'All Healthy!' : '🔍 Heal Pokémon (Word Search)';

  html += `
  <div class="pokecenter-nurse">
    <div class="pokecenter-nurse-icon">👩‍⚕️</div>
    <div class="pokecenter-nurse-msg">${nurseMsg}</div>
    <div class="pokecenter-nurse-sub">${nurseSub}</div>
    ${hasCaught ? `
      <button class="pokecenter-heal-btn" id="heal-all-btn" onclick="startHealWordSearch()" ${hurtCount === 0 ? 'disabled' : ''}>
        <span class="heal-icon">${hurtCount === 0 ? '💖' : '🩺'}</span>
        ${healBtnLabel}
      </button>
    ` : ''}
  </div>`;

  // Standalone Word Search - always available for fun/XP
  html += `
  <div class="pokecenter-activities">
    <div class="pokecenter-party-title">
      <span>🎮</span> Waiting Room Activities
    </div>
    <div class="pokecenter-activity-grid">
      <button class="pokecenter-activity-card" onclick="openPokeCenterWordSearch()">
        <div class="pokecenter-activity-icon">🔍</div>
        <div class="pokecenter-activity-name">Word Search</div>
        <div class="pokecenter-activity-desc">Find hidden words for fun & XP!</div>
        <div class="pokecenter-activity-level">Level ${State.settings.level} difficulty</div>
      </button>
    </div>
  </div>`;

  // Pokemon list
  if (hasCaught) {
    html += `
    <div class="pokecenter-party">
      <div class="pokecenter-party-title">
        <span>🎒</span> Your Pokémon <span style="font-size:12px;font-weight:500;color:#888;">(${caughtPokemon.length} caught)</span>
      </div>
      <div class="pokecenter-pokemon-list" id="pokecenter-list">
        ${caughtPokemon.map(p => renderPokemonCard(p)).join('')}
      </div>
    </div>`;
  } else {
    html += `
    <div class="pokecenter-empty">
      <div class="pokecenter-empty-icon">🎒</div>
      <div class="pokecenter-empty-msg">
        No Pokémon yet! Visit the <strong>Tall Grass</strong> to catch your first Pokémon.
      </div>
    </div>`;
  }

  container.innerHTML = html;
}

function renderPokemonCard(pkmn) {
  const maxHp = pkmn.hp;
  const currentHp = getPokemonHp(pkmn.id);
  const hpPct = Math.max(0, Math.round((currentHp / maxHp) * 100));
  const isHurt = currentHp < maxHp;
  const isFainted = currentHp <= 0;
  const hpColor = isFainted ? '#E53935' : hpPct > 50 ? '#4CAF50' : hpPct > 20 ? '#FFC107' : '#E53935';
  const statusClass = isFainted ? 'hurt' : isHurt ? 'hurt' : 'healthy';
  const statusLabel = isFainted ? '💀 Fainted' : isHurt ? '🩹 Hurt' : '💚 Healthy';

  return `
  <div class="pokecenter-pokemon-card ${statusClass}" data-pokemon-id="${pkmn.id}">
    <img class="pokecenter-pokemon-sprite" 
         src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pkmn.id}.png" 
         alt="${pkmn.name}"
         style="${isFainted ? 'filter:grayscale(1) opacity(0.5);' : ''}">
    <div class="pokecenter-pokemon-info">
      <div class="pokecenter-pokemon-name">${pkmn.name}</div>
      <span class="pokecenter-pokemon-type" style="background:${getTypeColor(pkmn.type)}">${pkmn.type}</span>
    </div>
    <div>
      <div class="pokecenter-hp-bar-wrap">
        <div class="pokecenter-hp-bar" style="width:${hpPct}%;background:${hpColor};"></div>
      </div>
      <div class="pokecenter-hp-text">${currentHp} / ${maxHp} HP &nbsp;${statusLabel}</div>
    </div>
  </div>`;
}

// ===== HEAL FLOW: Heal button → Word Search → Auto-heal =====
window.startHealWordSearch = function() {
  SFX.pop();
  const overlay = document.getElementById('pokecenter-ws-overlay');
  if (!overlay) return;
  overlay.classList.remove('hidden');

  const content = document.getElementById('pokecenter-ws-content');
  renderWordSearchPuzzle(content, {
    onComplete: function() {
      SFX.caught();
      launchConfetti();
      addXp(50);
      notify('🔍 Word Search complete! Healing your Pokémon...', 'success');
      setTimeout(() => {
        closePokeCenterWordSearch();
        // Auto-heal all Pokemon
        State.caught.forEach(id => {
          const pkmn = POKEMON_DB.find(p => p.id === id);
          if (pkmn) State.pokemonHp[id] = pkmn.hp;
        });
        SFX.correct();
        renderPokeCenter();
        notify('💖 All your Pokémon are fully healed!', 'success');
      }, 1200);
    }
  });
};

// ===== STANDALONE WORD SEARCH (just for fun/XP) =====
window.openPokeCenterWordSearch = function() {
  SFX.pop();
  const overlay = document.getElementById('pokecenter-ws-overlay');
  if (!overlay) return;
  overlay.classList.remove('hidden');

  const content = document.getElementById('pokecenter-ws-content');
  renderWordSearchPuzzle(content, {
    onComplete: function() {
      SFX.caught();
      launchConfetti();
      addXp(50);
      notify('🔍 Word Search complete! +50 XP!', 'success');
      setTimeout(() => {
        closePokeCenterWordSearch();
      }, 1200);
    }
  });
};

// Remove old healAllPokemon (no longer used directly)
window.healAllPokemon = function() {};

window.closePokeCenterWordSearch = function() {
  const overlay = document.getElementById('pokecenter-ws-overlay');
  if (overlay) overlay.classList.add('hidden');
};
