// ===== GYM BATTLES & ELITE FOUR =====
// Damage formula, gym scene, turn-based battle system
// ===== BATTLE DAMAGE FORMULA =====
function calcDamage(attacker, move, defender, attackerLevel) {
  // Gen 1 didn't split Sp.Atk/Sp.Def, so use atk for physical, spd as proxy for special
  const atk = move.isSpecial ? attacker.spd : attacker.atk;
  const def = move.isSpecial ? defender.spd : defender.def;
  const level = attackerLevel || 5;
  let base = ((2 * level / 5 + 2) * move.power * (atk / def)) / 50 + 2;
  const effectiveness = getEffectiveness(move.type, defender.type);
  base *= effectiveness;
  // Random variance 0.85 - 1.0
  base *= (0.85 + Math.random() * 0.15);
  return { damage: Math.max(1, Math.round(base)), effectiveness };
}

function effectivenessMessage(mult) {
  if (mult === 0)   return "It had no effect...";
  if (mult >= 2)    return "It's super effective!";
  if (mult <= 0.5)  return "It's not very effective...";
  return "";
}

// ===== GYM SCENE =====
Game.goToGym = function() {
  SFX.pop();
  document.getElementById('gym-select').classList.remove('hidden');
  document.getElementById('gym-pokemon-picker').classList.add('hidden');
  document.getElementById('gym-battle').classList.add('hidden');
  document.getElementById('gym-result').classList.add('hidden');
  // Update title if Elite Four is unlocked
  const sceneTitle = document.getElementById('gym-scene-title');
  if (sceneTitle) {
    sceneTitle.textContent = State.badges.length >= 8 ? '🏆 Gym & Elite Four' : '🏆 Pokémon Gym';
  }
  renderGymList();
  showScene('gym');
};

Game.cancelPicker = function() {
  SFX.pop();
  document.getElementById('gym-pokemon-picker').classList.add('hidden');
  document.getElementById('gym-select').classList.remove('hidden');
};

function renderGymList() {
  const list = document.getElementById('gym-list');
  list.innerHTML = '';
  GYMS.forEach((gym, i) => {
    const earned = State.badges.includes(i);
    const locked = i > 0 && !State.badges.includes(i - 1);
    const card = document.createElement('div');
    card.className = `gym-card ${earned ? 'completed' : ''} ${locked ? 'locked' : ''}`;
    card.style.borderColor = earned ? '#FFD600' : gym.color;
    card.innerHTML = `
      <img class="gym-leader-portrait" src="${gym.img}" alt="${gym.leader}" style="border-color:${gym.color}">
      <div class="gym-leader-name">${gym.leader}</div>
      <div class="gym-type-badge" style="background:${gym.color}">${gym.icon} ${gym.type}</div>
      ${earned ? `<div class="gym-earned-row">
        <img class="gym-badge-icon" src="${gym.badge}" alt="${gym.name}">
        <span class="gym-earned-label">Badge Earned!</span>
      </div>` : `<div class="gym-status" style="color:${locked ? '#999' : gym.color}">
        ${locked ? '🔒 Complete Previous Gym' : '⚔️ Challenge!'}
      </div>`}
    `;
    if (!locked && !earned) {
      card.addEventListener('click', () => startGymBattle(i));
    } else if (earned) {
      card.addEventListener('click', () => notify(`You already have the ${gym.name}!`, 'success'));
    }
    list.appendChild(card);
  });

  // ===== ELITE FOUR SECTION =====
  const allBadges = State.badges.length >= 8;

  if (allBadges) {
    // Section header
    const header = document.createElement('div');
    header.className = 'elite-four-header';
    header.innerHTML = `
      <div class="elite-four-divider"></div>
      <div class="elite-four-title">The Elite Four</div>
      <div class="elite-four-subtitle">The ultimate challenge awaits!</div>
    `;
    list.appendChild(header);

    ELITE_FOUR.forEach((member, i) => {
      const defeated = State.eliteFourDefeated.includes(i);
      const locked = i > 0 && !State.eliteFourDefeated.includes(i - 1);
      const isFinalBoss = member.title === 'Grand Master';
      const isChampion = member.title === 'Champion' || isFinalBoss;
      const card = document.createElement('div');
      const cardClass = isFinalBoss ? 'grand-master-card' : isChampion ? 'champion-card' : '';
      card.className = `gym-card elite-four-card ${cardClass} ${defeated ? 'completed' : ''} ${locked ? 'locked' : ''}`;
      card.style.borderColor = defeated ? '#FFD600' : member.color;

      card.innerHTML = `
        <div class="elite-four-icon" style="background:${member.color}">${member.icon}</div>
        <div class="gym-leader-name">${member.name}</div>
        <div class="elite-four-title-badge">${member.title}</div>
        <div class="gym-type-badge" style="background:${member.color}">${member.icon} ${member.type}</div>
        ${defeated ? `<div class="gym-earned-row">
          <span style="font-size:28px;">${isFinalBoss ? '🔥' : isChampion ? '👑' : '🏆'}</span>
          <span class="gym-earned-label">${isFinalBoss ? 'Grand Master Defeated!' : isChampion ? 'Champion Defeated!' : 'Defeated!'}</span>
        </div>` : `<div class="gym-status" style="color:${locked ? '#999' : member.color}">
          ${locked ? '🔒 Defeat Previous Challenger' : '⚔️ Challenge!'}
        </div>`}
      `;
      if (!locked && !defeated) {
        card.addEventListener('click', () => startEliteFourBattle(i));
      } else if (defeated) {
        card.addEventListener('click', () => notify(`You already defeated ${member.name}!`, 'success'));
      }
      list.appendChild(card);
    });
  } else {
    // Teaser when not all badges earned
    const teaser = document.createElement('div');
    teaser.className = 'elite-four-teaser';
    teaser.innerHTML = `
      <div class="elite-four-divider"></div>
      <div class="elite-four-teaser-text">
        🔒 Earn all 8 badges to challenge the <strong>Elite Four</strong>!
        <div style="font-size:13px;opacity:0.7;margin-top:4px;">${State.badges.length}/8 badges earned</div>
      </div>
    `;
    list.appendChild(teaser);
  }
}

function startGymBattle(gymIdx) {
  SFX.pop();
  const gym = GYMS[gymIdx];
  // Store opponent info for the picker and battle
  State.gym.opponent = gym;
  State.gym.isEliteFour = false;
  State.gym.selected = gymIdx;
  showPokemonPicker();
}

function startEliteFourBattle(eliteIdx) {
  SFX.pop();
  const member = ELITE_FOUR[eliteIdx];
  State.gym.opponent = member;
  State.gym.isEliteFour = true;
  State.gym.selected = eliteIdx;
  showPokemonPicker();
}

function showPokemonPicker() {
  const opp = State.gym.opponent;
  document.getElementById('gym-select').classList.add('hidden');
  document.getElementById('gym-battle').classList.add('hidden');
  document.getElementById('gym-result').classList.add('hidden');
  document.getElementById('gym-pokemon-picker').classList.remove('hidden');

  const oppName = opp.leader || opp.name;
  document.getElementById('picker-title').textContent = `Battle vs ${oppName}`;
  document.getElementById('picker-subtitle').textContent = State.gym.isEliteFour
    ? `Choose a Pokémon to battle ${opp.title} ${oppName}!`
    : `Choose a Pokémon to fight the ${opp.type} Gym!`;

  const grid = document.getElementById('picker-grid');
  grid.innerHTML = '';

  if (State.caught.length === 0) {
    grid.innerHTML = '<div class="picker-empty">You haven\'t caught any Pokémon yet!<br>Go explore and catch some first! 🎒</div>';
    return;
  }

  State.caught.forEach(pokemonId => {
    const pkmn = POKEMON_DB.find(p => p.id === pokemonId);
    if (!pkmn) return;
    const currentHp = getPokemonHp(pkmn.id);
    const maxHp = pkmn.hp;
    const hpPct = Math.round((currentHp / maxHp) * 100);
    const isFainted = currentHp <= 0;
    const hpColor = hpPct > 50 ? '#4CAF50' : hpPct > 20 ? '#FFC107' : '#E53935';
    const card = document.createElement('button');
    card.className = 'picker-card' + (isFainted ? ' picker-card-fainted' : '');
    if (isFainted) card.disabled = true;
    card.innerHTML = `
      <img class="picker-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pkmn.id}.png" alt="${pkmn.name}" style="${isFainted ? 'filter:grayscale(1) opacity(0.5);' : ''}">
      <div class="picker-name">${pkmn.name}${isFainted ? ' <span style="color:#E53935;font-size:11px;">(Fainted)</span>' : ''}</div>
      <span class="picker-type-badge" style="background:${getTypeColor(pkmn.type)}">${pkmn.type}</span>
      <div class="picker-stats">
        HP <span style="color:${isFainted ? '#E53935' : hpColor}">${currentHp}</span>/${maxHp} · ATK ${pkmn.atk} · DEF ${pkmn.def}
      </div>
      ${!isFainted ? `<div style="width:100%;height:4px;background:#e0e0e0;border-radius:2px;margin-top:4px;"><div style="width:${hpPct}%;height:100%;background:${hpColor};border-radius:2px;"></div></div>` : ''}
    `;
    if (!isFainted) card.addEventListener('click', () => selectPokemonAndBattle(pkmn));
    grid.appendChild(card);
  });
}

function selectPokemonAndBattle(pkmn) {
  SFX.pop();
  const opp = State.gym.opponent;
  const enemyPkmn = POKEMON_DB.find(p => p.id === opp.spriteId) || POKEMON_DB[0];

  // Calculate max HP from base stats (scaled)
  const playerMaxHp = Math.max(20, pkmn.hp);
  // Elite Four Pokemon get an HP multiplier
  const hpMult = opp.hpMult || 1;
  const enemyMaxHp = Math.max(20, Math.round(enemyPkmn.hp * hpMult));

  // Use persistent HP (current HP from Pokemon Center system)
  const currentHp = getPokemonHp(pkmn.id);
  const playerStartHp = Math.min(currentHp, playerMaxHp);

  // Enemy level scales with difficulty
  const enemyLevel = opp.difficulty * 5;
  const playerLevel = Math.max(State.level * 3 + 5, 5);

  const oppName = opp.leader || opp.name;

  State.gym = {
    selected: State.gym.selected,
    opponent: opp,
    isEliteFour: State.gym.isEliteFour,
    chosenPokemon: pkmn,
    enemyPokemon: enemyPkmn,
    playerMaxHp,
    enemyMaxHp,
    playerHp: playerStartHp,
    enemyHp: enemyMaxHp,
    playerLevel,
    enemyLevel,
    pendingChallenge: null,
    pendingMove: null,
    battleLocked: false,
  };

  document.getElementById('gym-pokemon-picker').classList.add('hidden');
  document.getElementById('gym-result').classList.add('hidden');
  document.getElementById('gym-battle').classList.remove('hidden');

  // Set up names and sprites
  document.getElementById('gym-leader-name').textContent = `${oppName}'s ${enemyPkmn.name}`;
  document.getElementById('gym-enemy-pokemon-name').textContent = enemyPkmn.name;
  document.getElementById('gym-leader-sprite').src =
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${opp.spriteId}.png`;
  // Show portrait in battle (gym leaders have img, Elite Four use Pokemon sprite)
  const leaderPortrait = document.getElementById('gym-leader-portrait-battle');
  if (leaderPortrait) {
    if (opp.img) {
      leaderPortrait.src = opp.img;
      leaderPortrait.alt = oppName;
      leaderPortrait.style.display = '';
    } else {
      // Elite Four: hide portrait (they don't have custom art)
      leaderPortrait.style.display = 'none';
    }
  }
  document.getElementById('player-pokemon-name').textContent = pkmn.name;
  document.getElementById('player-pokemon-sprite').src =
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pkmn.id}.png`;

  // HP bars and values
  updateBattleHpBars();

  // Battle intro message then show moves
  const introMsg = State.gym.isEliteFour
    ? `${oppName}: "${opp.quote}"`
    : `${oppName}: "I am the ${opp.type} Gym Leader! Let's battle, ${pkmn.name}!"`;

  battleTypewriter(introMsg, () => {
    setTimeout(() => showMoveGrid(), 600);
  });
}

// ===== TURN-BASED BATTLE SYSTEM =====

function updateBattleHpBars() {
  const s = State.gym;
  const enemyPct = Math.max(0, (s.enemyHp / s.enemyMaxHp) * 100);
  const playerPct = Math.max(0, (s.playerHp / s.playerMaxHp) * 100);

  const enemyBar = document.getElementById('enemy-hp-bar');
  const playerBar = document.getElementById('player-hp-bar');
  if (enemyBar) {
    enemyBar.style.width = enemyPct + '%';
    enemyBar.style.background = enemyPct <= 20 ? '#FF6B35' : enemyPct <= 50 ? '#FFD600' : '#E53935';
  }
  if (playerBar) {
    playerBar.style.width = playerPct + '%';
    playerBar.style.background = playerPct <= 20 ? '#FF6B35' : playerPct <= 50 ? '#F57F17' : '#4CAF50';
  }

  const enemyHpText = document.getElementById('enemy-hp-text');
  const playerHpText = document.getElementById('player-hp-text');
  if (enemyHpText) enemyHpText.textContent = `${Math.max(0, s.enemyHp)} / ${s.enemyMaxHp}`;
  if (playerHpText) playerHpText.textContent = `${Math.max(0, s.playerHp)} / ${s.playerMaxHp}`;
}

let _battleTypewriterTimeout = null;
let _battleTypewriterSkip = null;
function battleTypewriter(text, callback) {
  const box = document.getElementById('battle-message-box');
  if (!box) { if (callback) callback(); return; }
  clearTimeout(_battleTypewriterTimeout);
  // Remove previous skip listener if any
  if (_battleTypewriterSkip) { box.removeEventListener('click', _battleTypewriterSkip); _battleTypewriterSkip = null; }
  box.textContent = '';
  box.style.cursor = 'pointer';
  let i = 0;
  let done = false;
  function finish() {
    if (done) return;
    done = true;
    clearTimeout(_battleTypewriterTimeout);
    box.textContent = text;
    box.style.cursor = '';
    if (_battleTypewriterSkip) { box.removeEventListener('click', _battleTypewriterSkip); _battleTypewriterSkip = null; }
    if (callback) _battleTypewriterTimeout = setTimeout(callback, 200);
  }
  _battleTypewriterSkip = finish;
  box.addEventListener('click', _battleTypewriterSkip);
  function type() {
    if (done) return;
    if (i < text.length) {
      box.textContent += text[i++];
      _battleTypewriterTimeout = setTimeout(type, 22);
    } else {
      finish();
    }
  }
  type();
}

function showMoveGrid() {
  const s = State.gym;
  if (s.battleLocked) return;
  const pkmn = s.chosenPokemon;
  const movesArea = document.getElementById('battle-moves-area');
  const challengeArea = document.getElementById('battle-challenge-area');
  if (!movesArea) return;

  challengeArea.classList.add('hidden');
  movesArea.classList.remove('hidden');
  movesArea.innerHTML = '';

  const movegrid = document.createElement('div');
  movegrid.className = 'move-grid';

  const moveKeys = pkmn.moves || ['Tackle','Tackle','Tackle','Tackle'];
  moveKeys.forEach(key => {
    const move = MOVES_DB[key];
    if (!move) return;
    const btn = document.createElement('button');
    btn.className = `move-btn move-type-${move.type.toLowerCase()}`;
    btn.innerHTML = `<span class="move-name">${move.name}</span><span class="move-power">PWR ${move.power}</span><span class="move-type-tag">${move.type}</span>`;
    btn.addEventListener('click', () => playerSelectMove(key));
    movegrid.appendChild(btn);
  });
  movesArea.appendChild(movegrid);
}

function playerSelectMove(moveKey) {
  const s = State.gym;
  if (s.battleLocked) return;
  s.battleLocked = true;
  s.pendingMove = moveKey;

  SFX.click();

  // Hide move grid, show challenge
  document.getElementById('battle-moves-area').classList.add('hidden');
  const challengeArea = document.getElementById('battle-challenge-area');
  challengeArea.classList.remove('hidden');

  const move = MOVES_DB[moveKey];
  const opp = s.opponent;
  const gymDifficultyBoost = Math.floor(opp.difficulty / 3);
  const effectiveDifficulty = Math.min(State.settings.level + gymDifficultyBoost, 5);

  // Battles use reading/literacy challenges
  const challengeType = pickChallengeType('reading');
  const challenge = getChallenge(challengeType, effectiveDifficulty);
  s.pendingChallenge = challenge;

  battleTypewriter(`${s.chosenPokemon.name} wants to use ${move.name}! Answer to attack!`, () => {
    challengeArea.innerHTML = renderBattleChallengeHTML(challenge);
    // On mobile, scroll the challenge into view
    if (window.innerWidth <= 600) {
      setTimeout(() => challengeArea.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    }
  });
}

function renderBattleChallengeHTML(ch) {
  // Delegate to the main renderChallengeHTML which handles all activity types
  return renderChallengeHTML(ch, 'gym');
}

function resolveGymAnswer(isCorrect) {
  const s = State.gym;
  const opp = s.opponent;
  const move = MOVES_DB[s.pendingMove];
  const playerPkmn = s.chosenPokemon;
  const enemyPkmn = s.enemyPokemon;

  if (typeof onAnswerResult === 'function') onAnswerResult(isCorrect, { scene: 'gym', challengeType: s.pendingChallenge && s.pendingChallenge.type });

  // Clear challenge area
  document.getElementById('battle-challenge-area').classList.add('hidden');
  document.getElementById('battle-challenge-area').innerHTML = '';

  if (isCorrect) {
    SFX.correct();
    addXp(10);
    // Calculate damage
    const { damage, effectiveness } = calcDamage(playerPkmn, move, enemyPkmn, s.playerLevel);
    const actualDamage = Math.round(damage * 1.0);
    s.enemyHp = Math.max(0, s.enemyHp - actualDamage);

    // Play appropriate SFX
    if (effectiveness >= 2) SFX.superEffective();
    else if (effectiveness <= 0.5 && effectiveness > 0) SFX.notEffective();
    else SFX.attack();

    // Animate: player sprite bounces, enemy flashes
    animateAttack('player-pokemon-sprite', 'gym-leader-sprite', actualDamage, 'enemy');

    const effMsg = effectivenessMessage(effectiveness);
    const msg = `${playerPkmn.name} used ${move.name}! ${effMsg ? effMsg + ' ' : ''}(-${actualDamage} HP)`;

    updateBattleHpBars();
    battleTypewriter(msg, () => {
      if (s.enemyHp <= 0) {
        setTimeout(() => battleVictory(), 1000);
      } else {
        setTimeout(() => enemyTurn(), 1000);
      }
    });
  } else {
    SFX.wrong();
    // Weak hit: 30% damage
    const { damage, effectiveness } = calcDamage(playerPkmn, move, enemyPkmn, s.playerLevel);
    const actualDamage = Math.max(1, Math.round(damage * 0.3));
    s.enemyHp = Math.max(0, s.enemyHp - actualDamage);

    SFX.notEffective();
    animateAttack('player-pokemon-sprite', 'gym-leader-sprite', actualDamage, 'enemy');
    updateBattleHpBars();

    battleTypewriter(`Wrong answer! ${playerPkmn.name}'s attack was weak! (-${actualDamage} HP)`, () => {
      if (s.enemyHp <= 0) {
        setTimeout(() => battleVictory(), 1000);
      } else {
        setTimeout(() => enemyTurn(), 1000);
      }
    });
  }
}

function enemyTurn() {
  const s = State.gym;
  const enemyPkmn = s.enemyPokemon;
  const playerPkmn = s.chosenPokemon;

  // Pick a random move
  const moveKeys = enemyPkmn.moves || ['Tackle','Tackle','Tackle','Tackle'];
  const moveKey = moveKeys[Math.floor(Math.random() * moveKeys.length)];
  const move = MOVES_DB[moveKey];
  if (!move) { showMoveGrid(); s.battleLocked = false; return; }

  const { damage, effectiveness } = calcDamage(enemyPkmn, move, playerPkmn, s.enemyLevel);
  s.playerHp = Math.max(0, s.playerHp - damage);

  SFX.enemyAttack();
  animateAttack('gym-leader-sprite', 'player-pokemon-sprite', damage, 'player');
  updateBattleHpBars();

  const effMsg = effectivenessMessage(effectiveness);
  const msg = `${enemyPkmn.name} used ${move.name}! ${effMsg ? effMsg + ' ' : ''}(-${damage} HP)`;

  battleTypewriter(msg, () => {
    if (s.playerHp <= 0) {
      setTimeout(() => battleDefeat(), 1000);
    } else {
      // Player's turn again
      s.battleLocked = false;
      setTimeout(() => showMoveGrid(), 600);
    }
  });
}

function animateAttack(attackerSpriteId, defenderSpriteId, damage, side) {
  const attacker = document.getElementById(attackerSpriteId);
  const defender = document.getElementById(defenderSpriteId);
  if (attacker) {
    attacker.classList.add('battle-sprite-attack');
    setTimeout(() => attacker.classList.remove('battle-sprite-attack'), 400);
  }
  if (defender) {
    setTimeout(() => {
      defender.classList.add('battle-sprite-hit');
      showDamageNumber(defender, damage);
      setTimeout(() => defender.classList.remove('battle-sprite-hit'), 600);
    }, 200);
  }
}

function showDamageNumber(targetEl, damage) {
  const rect = targetEl.getBoundingClientRect();
  const numEl = document.createElement('div');
  numEl.className = 'damage-number';
  numEl.textContent = `-${damage}`;
  numEl.style.left = (rect.left + rect.width / 2 - 20) + 'px';
  numEl.style.top = (rect.top + 10) + 'px';
  document.body.appendChild(numEl);
  setTimeout(() => numEl.remove(), 900);
}

// ===== VICTORY / DEFEAT (handles both gyms and Elite Four) =====

function battleVictory() {
  if (State.gym.isEliteFour) {
    eliteFourVictory();
  } else {
    gymVictory();
  }
}

function battleDefeat() {
  if (State.gym.isEliteFour) {
    eliteFourDefeat();
  } else {
    gymDefeat();
  }
}

function gymVictory() {
  SFX.badge();
  const gym = State.gym.opponent;
  if (!State.badges.includes(State.gym.selected)) {
    State.badges.push(State.gym.selected);
    addXp(100);
  }
  // Save remaining HP to persistent state
  const chosenId = State.gym.chosenPokemon.id;
  State.pokemonHp[chosenId] = Math.max(1, State.gym.playerHp);
  updateTrainerBar();

  // Play faint animation on enemy, victory bounce on player
  const enemySprite = document.getElementById('gym-leader-sprite');
  const playerSprite = document.getElementById('player-pokemon-sprite');
  if (enemySprite) enemySprite.classList.add('sprite-faint');
  if (playerSprite) playerSprite.classList.add('sprite-victory');

  battleTypewriter(`${gym.leader}'s ${State.gym.enemyPokemon.name} fainted!`, () => {
    setTimeout(() => {
      launchConfetti();
      document.getElementById('gym-battle').classList.add('hidden');
      if (enemySprite) enemySprite.classList.remove('sprite-faint');
      if (playerSprite) playerSprite.classList.remove('sprite-victory');
      const result = document.getElementById('gym-result');
      result.classList.remove('hidden');
      result.style.background = 'rgba(0,0,0,0.5)';
      // Check if this badge unlocks new rarity tiers
      let unlockMsg = '';
      const badgeCount = State.badges.length;
      if (badgeCount === 2) unlockMsg = '🌟 New Pokémon unlocked! Uncommon Pokémon now appear in the wild!';
      else if (badgeCount === 4) unlockMsg = '🔥 New Pokémon unlocked! Rare Pokémon now appear in the wild!';
      else if (badgeCount === 6) unlockMsg = '⚡ New Pokémon unlocked! Legendary Pokémon now appear in the wild!';
      else if (badgeCount === 8) unlockMsg = '🏆 All badges earned! The Elite Four awaits you!';

      result.innerHTML = `
        <div class="result-title">⭐ Victory! ⭐</div>
        <img class="result-leader-portrait" src="${gym.img}" alt="${gym.leader}">
        <div class="result-badge"><img src="${gym.badge}" alt="${gym.name}" style="width:80px;height:80px;image-rendering:pixelated;"></div>
        <div class="result-desc">You earned the <strong>${gym.name}</strong>!</div>
        <div style="color:rgba(255,255,255,0.8);font-size:16px;">${gym.leader}: "You are truly skilled! Take this badge!"</div>
        ${unlockMsg ? `<div style="margin-top:14px;padding:12px 18px;background:rgba(255,215,0,0.2);border:2px solid #FFD700;border-radius:12px;color:#FFD700;font-size:17px;font-weight:700;text-align:center;">${unlockMsg}</div>` : ''}
        <button class="btn-primary btn-xl" style="margin-top:20px" onclick="Game.goToGym()">Back to Gyms</button>
      `;
    }, 1000);
  });
}

function gymDefeat() {
  SFX.wrong();
  // Pokemon fainted — set HP to 0
  const chosenId = State.gym.chosenPokemon.id;
  State.pokemonHp[chosenId] = 0;
  const gym = State.gym.opponent;

  // Play faint animation on player's Pokemon
  const playerSprite = document.getElementById('player-pokemon-sprite');
  if (playerSprite) playerSprite.classList.add('sprite-faint');

  battleTypewriter(`${State.gym.chosenPokemon.name} fainted!`, () => {
    setTimeout(() => {
      document.getElementById('gym-battle').classList.add('hidden');
      if (playerSprite) playerSprite.classList.remove('sprite-faint');
      const result = document.getElementById('gym-result');
      result.classList.remove('hidden');
      result.style.background = 'rgba(0,0,0,0.5)';
      result.innerHTML = `
        <div class="result-title">💔 Defeated!</div>
        <img class="result-leader-portrait" src="${gym.img}" alt="${gym.leader}">
        <div style="font-size:40px">😔</div>
        <div class="result-desc">${gym.leader}: "Train more and come back when you're ready!"</div>
        <div style="color:rgba(255,255,255,0.7);font-size:14px;margin-top:8px;">🏥 Visit the Pokémon Center to heal your Pokémon!</div>
        <div style="display:flex;gap:12px;margin-top:16px;justify-content:center;flex-wrap:wrap;">
          <button class="btn-primary btn-xl" onclick="Game.goToPokeCenter()">🏥 Pokémon Center</button>
          <button class="btn-primary btn-xl" style="background:linear-gradient(135deg,#455A64,#37474F);" onclick="Game.goToGym()">Try Again</button>
        </div>
      `;
    }, 1000);
  });
}

// ===== ELITE FOUR VICTORY / DEFEAT =====

function eliteFourVictory() {
  SFX.badge();
  const member = State.gym.opponent;
  const memberIdx = State.gym.selected;
  const isFinalBoss = member.title === 'Grand Master';
      const isChampion = member.title === 'Champion' || isFinalBoss;

  if (!State.eliteFourDefeated.includes(memberIdx)) {
    State.eliteFourDefeated.push(memberIdx);
    addXp(isFinalBoss ? 1000 : isChampion ? 500 : 200);
  }
  // Save remaining HP to persistent state
  const chosenId = State.gym.chosenPokemon.id;
  State.pokemonHp[chosenId] = Math.max(1, State.gym.playerHp);
  saveState();

  // Play faint animation on enemy, victory bounce on player
  const enemySprite = document.getElementById('gym-leader-sprite');
  const playerSprite = document.getElementById('player-pokemon-sprite');
  if (enemySprite) enemySprite.classList.add('sprite-faint');
  if (playerSprite) playerSprite.classList.add('sprite-victory');

  battleTypewriter(`${member.name}'s ${State.gym.enemyPokemon.name} fainted!`, () => {
    setTimeout(() => {
      launchConfetti();
      if (isChampion) launchConfetti(); // Double confetti for champion!
      document.getElementById('gym-battle').classList.add('hidden');
      if (enemySprite) enemySprite.classList.remove('sprite-faint');
      if (playerSprite) playerSprite.classList.remove('sprite-victory');
      const result = document.getElementById('gym-result');
      result.classList.remove('hidden');
      result.style.background = 'rgba(0,0,0,0.5)';

      const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${member.spriteId}.png`;

      if (isFinalBoss) {
        // Ash / Grand Master victory — ultimate celebration
        result.innerHTML = `
          <div class="result-title champion-victory-title">🔥 GRAND MASTER! 🔥</div>
          <div class="champion-crown">🏆</div>
          <div class="result-desc" style="font-size:22px;color:#FFD700;">You defeated <strong>Ash</strong> and became the <strong>Grand Pokémon Master</strong>!</div>
          <div style="color:rgba(255,255,255,0.8);font-size:16px;margin-top:8px;">Ash: "Wow... you really are the very best! I'm proud of you!"</div>
          <div style="margin-top:14px;padding:12px 18px;background:rgba(255,68,0,0.2);border:2px solid #FF4500;border-radius:12px;color:#FFD700;font-size:17px;font-weight:700;text-align:center;">
            🎉 Congratulations, Grand Master ${State.trainerName}! You completed the ultimate challenge! 🎉
          </div>
          <button class="btn-primary btn-xl" style="margin-top:20px;background:linear-gradient(135deg,#FF4500,#FFD700);" onclick="Game.goToGym()">Back to Gyms</button>
        `;
      } else if (isChampion) {
        // Blue / Champion victory screen
        result.innerHTML = `
          <div class="result-title champion-victory-title">👑 CHAMPION! 👑</div>
          <div class="champion-crown">🏆</div>
          <div class="result-desc" style="font-size:22px;color:#FFD700;">You defeated ${member.name} and became the <strong>Pokémon Champion</strong>!</div>
          <div style="color:rgba(255,255,255,0.8);font-size:16px;margin-top:8px;">${member.name}: "Incredible... you truly are the greatest trainer!"</div>
          <div style="margin-top:14px;padding:12px 18px;background:rgba(255,215,0,0.2);border:2px solid #FFD700;border-radius:12px;color:#FFD700;font-size:17px;font-weight:700;text-align:center;">
            🎉 Congratulations, Champion ${State.trainerName}! 🎉
          </div>
          <button class="btn-primary btn-xl" style="margin-top:20px;background:linear-gradient(135deg,#DAA520,#FFD700);" onclick="Game.goToGym()">Continue</button>
        `;
      } else {
        // Regular Elite Four victory
        const nextMember = ELITE_FOUR[memberIdx + 1];
        const nextMsg = nextMember
          ? `Next challenger: <strong>${nextMember.title} ${nextMember.name}</strong>!`
          : '';
        result.innerHTML = `
          <div class="result-title">🏆 Victory! 🏆</div>
          <div style="font-size:64px;margin:8px 0;">${member.icon}</div>
          <div class="result-desc">You defeated <strong>${member.title} ${member.name}</strong>!</div>
          <div style="color:rgba(255,255,255,0.8);font-size:16px;">${member.name}: "You are stronger than I expected!"</div>
          ${nextMsg ? `<div style="margin-top:14px;padding:12px 18px;background:rgba(255,215,0,0.2);border:2px solid #FFD700;border-radius:12px;color:#FFD700;font-size:17px;font-weight:700;text-align:center;">${nextMsg}</div>` : ''}
          <button class="btn-primary btn-xl" style="margin-top:20px" onclick="Game.goToGym()">Continue</button>
        `;
      }
    }, 1000);
  });
}

function eliteFourDefeat() {
  SFX.wrong();
  // Pokemon fainted — set HP to 0
  const chosenId = State.gym.chosenPokemon.id;
  State.pokemonHp[chosenId] = 0;
  const member = State.gym.opponent;

  // Play faint animation on player's Pokemon
  const playerSprite = document.getElementById('player-pokemon-sprite');
  if (playerSprite) playerSprite.classList.add('sprite-faint');

  battleTypewriter(`${State.gym.chosenPokemon.name} fainted!`, () => {
    setTimeout(() => {
      document.getElementById('gym-battle').classList.add('hidden');
      if (playerSprite) playerSprite.classList.remove('sprite-faint');
      const result = document.getElementById('gym-result');
      result.classList.remove('hidden');
      result.style.background = 'rgba(0,0,0,0.5)';
      result.innerHTML = `
        <div class="result-title">💔 Defeated!</div>
        <div style="font-size:64px;margin:8px 0;">${member.icon}</div>
        <div style="font-size:40px">😔</div>
        <div class="result-desc">${member.name}: "You'll need to train harder to beat the ${member.title}!"</div>
        <div style="color:rgba(255,255,255,0.7);font-size:14px;margin-top:8px;">🏥 Visit the Pokémon Center to heal your Pokémon!</div>
        <div style="display:flex;gap:12px;margin-top:16px;justify-content:center;flex-wrap:wrap;">
          <button class="btn-primary btn-xl" onclick="Game.goToPokeCenter()">🏥 Pokémon Center</button>
          <button class="btn-primary btn-xl" style="background:linear-gradient(135deg,#455A64,#37474F);" onclick="Game.goToGym()">Try Again</button>
        </div>
      `;
    }, 1000);
  });
}
