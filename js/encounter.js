// ===== ENCOUNTER SCENE =====
// Wild Pokemon encounters, clues, challenges, letter tiles, guessing, pokeball throw

// ===== RARITY HELPER =====
// Gen 1 evolved Pokemon IDs — evolutions are at least uncommon
const EVOLVED_IDS = new Set([
  // Starters mid
  2, 5, 8,
  // Starters final
  3, 6, 9,
  // Caterpie line
  12,
  // Weedle line
  15,
  // Pidgey line
  17, 18,
  // Rattata
  20,
  // Spearow
  22,
  // Ekans
  24,
  // Pikachu → Raichu
  26,
  // Sandshrew
  28,
  // Nidoran lines
  30, 31, 33, 34,
  // Clefairy
  36,
  // Vulpix
  38,
  // Jigglypuff
  40,
  // Zubat
  42,
  // Oddish line
  44, 45,
  // Paras
  47,
  // Venonat
  49,
  // Diglett
  51,
  // Meowth
  53,
  // Psyduck
  55,
  // Mankey
  57,
  // Growlithe
  59,
  // Poliwag line
  61, 62,
  // Abra line
  64, 65,
  // Machop line
  67, 68,
  // Bellsprout line
  70, 71,
  // Tentacool
  73,
  // Geodude line
  75, 76,
  // Ponyta
  78,
  // Slowpoke
  80,
  // Magnemite
  82,
  // Doduo
  85,
  // Seel
  87,
  // Grimer
  89,
  // Shellder
  91,
  // Gastly line
  93, 94,
  // Drowzee
  97,
  // Krabby
  99,
  // Voltorb
  101,
  // Exeggcute
  103,
  // Cubone
  105,
  // Koffing
  110,
  // Rhyhorn
  112,
  // Horsea
  117,
  // Goldeen
  119,
  // Staryu
  121,
  // Magikarp
  130,
  // Eevee evos
  134, 135, 136,
  // Omanyte
  139,
  // Kabuto
  141,
  // Dragonair, Dragonite
  148, 149,
]);

function getPokemonRarity(pokemon) {
  const total = pokemon.hp + pokemon.atk + pokemon.def + pokemon.spd;
  if (total >= 390) return 'legendary';
  if (total >= 340) return 'rare';
  if (total >= 250) return 'uncommon';
  // Evolved Pokemon are at least uncommon
  if (EVOLVED_IDS.has(pokemon.id)) return 'uncommon';
  return 'common';
}

const RARITY_WEIGHTS = { common: 70, uncommon: 20, rare: 8, legendary: 2 };
const RARITY_CATCH_CHANCE = { common: 0.75, uncommon: 0.55, rare: 0.35, legendary: 0.20 };
const RARITY_LABELS = {
  common:    'Easy Catch! 🟢',
  uncommon:  'Moderate Catch 🟡',
  rare:      'Tough Catch! 🟠',
  legendary: 'Ultra Rare! 🔴',
};

// ===== BADGE-GATED RARITY UNLOCKS =====
// Badges unlock progressively rarer Pokemon
// 0 badges: common only | 2+: uncommon | 4+: rare | 6+: legendary
function getUnlockedRarities() {
  const badges = State.badges.length;
  const rarities = ['common'];
  if (badges >= 2) rarities.push('uncommon');
  if (badges >= 4) rarities.push('rare');
  if (badges >= 6) rarities.push('legendary');
  return rarities;
}

function weightedRandomPick(pool) {
  // Group pool by rarity
  const buckets = { common: [], uncommon: [], rare: [], legendary: [] };
  pool.forEach(p => buckets[getPokemonRarity(p)].push(p));

  // Build weighted entries only for non-empty buckets
  const entries = [];
  let totalWeight = 0;
  for (const [rarity, list] of Object.entries(buckets)) {
    if (list.length > 0) {
      entries.push({ rarity, list, weight: RARITY_WEIGHTS[rarity] });
      totalWeight += RARITY_WEIGHTS[rarity];
    }
  }

  // Pick a rarity tier
  let roll = Math.random() * totalWeight;
  let chosen = entries[0];
  for (const entry of entries) {
    roll -= entry.weight;
    if (roll <= 0) { chosen = entry; break; }
  }

  // Pick random pokemon within that tier
  return chosen.list[Math.floor(Math.random() * chosen.list.length)];
}

// ===== ENCOUNTER SCENE =====
Game.goToEncounter = function() {
  SFX.pop();
  // Pick a random uncaught pokemon, filtered by unlocked rarities and weighted
  const unlockedRarities = getUnlockedRarities();
  const rarityFiltered = POKEMON_DB.filter(p => unlockedRarities.includes(getPokemonRarity(p)));
  const uncaught = rarityFiltered.filter(p => !State.caught.includes(p.id));
  const pool = uncaught.length > 0 ? uncaught : rarityFiltered;
  const pokemon = weightedRandomPick(pool);

  State.encounter = {
    pokemon,
    cluesUnlocked: 1, // type is always shown
    guessUsed: false,
    ballsLeft: 3,
    pendingChallenge: null,
    challengeTarget: null,
  };

  // Set sprite — hidden until clue 5 (silhouette) is unlocked
  const sprite = document.getElementById('encounter-pokemon-sprite');
  sprite.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
  sprite.className = 'encounter-sprite hidden-pokemon';

  document.getElementById('encounter-title').textContent = 'A wild Pokémon appeared!';
  document.getElementById('encounter-result').className = 'encounter-result hidden';
  document.getElementById('pokemon-guess-input').value = '';
  document.getElementById('pokemon-guess-input').disabled = false;
  document.getElementById('guess-btn').disabled = false;
  document.getElementById('autocomplete-list').innerHTML = '';
  document.getElementById('clue-challenge-area').classList.add('hidden');

  renderClues();
  renderPokeballs();
  showScene('encounter');
};

function renderClues() {
  const enc = State.encounter;
  const pokemon = enc.pokemon;
  const container = document.getElementById('clues-container');
  container.innerHTML = '';

  const clueData = [
    { label: 'Type', content: `This Pokémon is a <strong>${pokemon.type} type!</strong>`, always: true },
    { label: 'Habitat', content: pokemon.clue2 },
    { label: 'Appearance', content: pokemon.clue3 },
    { label: 'Fun Fact', content: pokemon.clue4 },
    { label: 'Silhouette', content: 'silhouette', isSilhouette: true },
  ];

  clueData.forEach((clue, i) => {
    const div = document.createElement('div');
    const clueNum = i + 1;

    if (clueNum <= enc.cluesUnlocked) {
      div.className = `clue-item unlocked ${i === 0 ? 'clue-type' : ''}`;
      if (clue.isSilhouette) {
        div.innerHTML = `<span class="clue-number">Clue 5:</span> The Silhouette has been revealed above!`;
      } else {
        div.innerHTML = `<span class="clue-number">Clue ${clueNum}:</span> ${clue.content}`;
      }
    } else {
      div.className = 'clue-item locked';
      div.innerHTML = `<span class="clue-lock-icon">🔒</span> <span>Clue ${clueNum}: Solve a challenge to unlock!</span>`;
      div.addEventListener('click', () => startClueChallenge(clueNum));
    }
    container.appendChild(div);
  });

  // Update sprite visibility based on clues unlocked
  const sprite = document.getElementById('encounter-pokemon-sprite');
  const mystery = document.getElementById('pokemon-mystery');
  if (enc.cluesUnlocked >= 5) {
    // Clue 5 unlocked: show silhouette (black shadow)
    sprite.className = 'encounter-sprite silhouette';
    if (mystery) mystery.classList.add('hidden');
  } else {
    // Not enough clues: keep sprite hidden, show "?"
    sprite.className = 'encounter-sprite hidden-pokemon';
    if (mystery) mystery.classList.remove('hidden');
  }
}

function renderPokeballs() {
  const display = document.getElementById('pokeballs-display');
  display.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    const pb = document.createElement('div');
    pb.className = 'pokeball-small' + (i >= State.encounter.ballsLeft ? ' used' : '');
    pb.innerHTML = `<div class="pokeball-top"></div><div class="pokeball-bottom"></div><div class="pokeball-line"></div><div class="pokeball-button"></div>`;
    display.appendChild(pb);
  }
}

// ===== CHALLENGE TYPE SELECTION BY LEVEL =====
// Math skills for catching, reading/literacy skills for battling
const MATH_SKILLS = ['math', 'counting', 'number'];
const READING_SKILLS = ['reading', 'phonics', 'spelling', 'comprehension'];

function getMathChallengeTypes() {
  const lvl = State.settings.level;
  const types = ['math'];
  if (typeof ACTIVITY_REGISTRY !== 'undefined') {
    Object.entries(ACTIVITY_REGISTRY).forEach(([key, info]) => {
      if (info.levels.includes(lvl) && MATH_SKILLS.includes(info.skill)) {
        types.push(key);
      }
    });
  }
  return types;
}

function getReadingChallengeTypes() {
  const lvl = State.settings.level;
  const types = [];
  // CVC stays as a core challenge type for L1-2
  if (lvl <= 2) types.push('cvc');

  // All reading/phonics/spelling/comprehension activities come from the registry now
  if (typeof ACTIVITY_REGISTRY !== 'undefined') {
    Object.entries(ACTIVITY_REGISTRY).forEach(([key, info]) => {
      if (info.levels.includes(lvl) && (READING_SKILLS.includes(info.skill) || info.skill === 'science' || info.skill === 'logic' || info.skill === 'strategy')) {
        types.push(key);
      }
    });
  }
  return types;
}

function getAvailableChallengeTypes() {
  return [...getMathChallengeTypes(), ...getReadingChallengeTypes()];
}

function pickChallengeType(mode) {
  const types = mode === 'reading' ? getReadingChallengeTypes() : getMathChallengeTypes();
  return types[Math.floor(Math.random() * types.length)];
}

function startClueChallenge(clueNum) {
  if (State.encounter.cluesUnlocked >= clueNum) return;
  if (State.encounter.cluesUnlocked < clueNum - 1) {
    notify('Unlock the previous clue first!', 'error');
    return;
  }
  SFX.pop();
  State.encounter.pendingChallenge = clueNum;

  // Encounters use math challenges
  const challengeType = pickChallengeType('math');
  const challenge = getChallenge(challengeType, State.settings.level);
  State.encounter.currentChallenge = challenge;

  const area = document.getElementById('clue-challenge-area');
  area.classList.remove('hidden');
  area.innerHTML = renderChallengeHTML(challenge, 'clue');

  // On mobile, scroll the challenge into view so it's not below the fold
  if (window.innerWidth <= 600) {
    setTimeout(() => area.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
  }
}

// ===== LETTER TILE HELPERS =====
const TILE_COLORS = ['tile-red','tile-blue','tile-green','tile-yellow','tile-purple','tile-orange','tile-teal','tile-pink'];
function tileColor(i) { return TILE_COLORS[i % TILE_COLORS.length]; }

/** Render a word as display-only letter tiles (e.g. CVC word, coded message) */
function renderWordTiles(word, opts = {}) {
  const big = opts.big ? ' tile-display' : '';
  return `<div class="letter-tiles">${word.split('').map((ch, i) =>
    `<div class="letter-tile ${tileColor(i)}${big}">${ch}</div>`
  ).join('')}</div>`;
}

/** Render tap-to-spell: empty answer slots + scrambled clickable letter bank.
 *  Wires up global _tileSpell state for the tap-to-unscramble interaction. */
function renderTileSpell(scrambled, answerLen, context, hint) {
  // Store state globally so onclick handlers can access it
  window._tileSpell = { placed: [], answer: '', scrambled: scrambled.split(''), context };
  let html = '';
  // Answer slots
  html += `<div class="letter-slots" id="tile-slots">`;
  for (let i = 0; i < answerLen; i++) {
    html += `<div class="letter-slot" id="tile-slot-${i}"></div>`;
  }
  html += `</div>`;
  if (hint) html += `<div style="font-size:13px;color:#666;margin-bottom:10px;">${hint}</div>`;
  // Letter bank
  html += `<div class="letter-tiles" id="tile-bank">`;
  scrambled.split('').forEach((ch, i) => {
    html += `<div class="letter-tile ${tileColor(i)} tile-btn" id="tile-letter-${i}" onclick="tileTap(${i})">${ch}</div>`;
  });
  html += `</div>`;
  // Controls
  html += `<div class="tiles-controls">`;
  html += `<button onclick="tileUndo()">↩ Undo</button>`;
  html += `<button onclick="tileClear()">✕ Clear</button>`;
  html += `<button class="btn-primary" style="border:none;color:#fff;" onclick="tileSubmit()">✓ Submit</button>`;
  html += `</div>`;
  return html;
}

/** Called when a letter tile in the bank is tapped */
window.tileTap = function(idx) {
  const s = window._tileSpell;
  if (!s || s.placed.length >= document.querySelectorAll('.letter-slot').length) return;
  SFX.pop();
  // Mark tile as used
  const tile = document.getElementById('tile-letter-' + idx);
  if (tile) tile.classList.add('tile-used');
  // Place in next empty slot
  const slotIdx = s.placed.length;
  const slot = document.getElementById('tile-slot-' + slotIdx);
  if (slot) {
    slot.textContent = s.scrambled[idx];
    slot.classList.add('filled');
  }
  s.placed.push({ idx, letter: s.scrambled[idx] });
};

/** Undo last placed letter */
window.tileUndo = function() {
  const s = window._tileSpell;
  if (!s || s.placed.length === 0) return;
  SFX.click();
  const last = s.placed.pop();
  // Clear the slot
  const slot = document.getElementById('tile-slot-' + s.placed.length);
  if (slot) { slot.textContent = ''; slot.classList.remove('filled'); }
  // Un-use the bank tile
  const tile = document.getElementById('tile-letter-' + last.idx);
  if (tile) tile.classList.remove('tile-used');
};

/** Clear all placed letters */
window.tileClear = function() {
  const s = window._tileSpell;
  if (!s) return;
  SFX.click();
  while (s.placed.length > 0) {
    const last = s.placed.pop();
    const slot = document.getElementById('tile-slot-' + s.placed.length);
    if (slot) { slot.textContent = ''; slot.classList.remove('filled'); }
    const tile = document.getElementById('tile-letter-' + last.idx);
    if (tile) tile.classList.remove('tile-used');
  }
};

/** Submit the spelled word */
window.tileSubmit = function() {
  const s = window._tileSpell;
  if (!s) return;
  const spelled = s.placed.map(p => p.letter).join('');
  if (spelled.length === 0) { notify('Tap the letters first!', 'error'); return; }
  answerChallenge(spelled.toUpperCase(), s.context);
};

function renderChallengeHTML(ch, context) {
  // Build a friendly title label
  const typeLabels = {
    math: '\u2795 Math', reading: '\ud83d\udcda Reading', spelling: '\ud83d\udd24 Spelling',
    cvc: '\ud83d\udcd6 Read the Word', comprehension: '\ud83d\udcd6 Reading',
    soundSafari: '\ud83d\udd0a Sound Safari', countingCatch: '\ud83d\udd22 Counting Catch',
    patternPath: '\ud83e\udde9 Pattern Path', blendAMon: '\ud83d\udde3\ufe0f Blend-a-Mon',
    rhymeBattle: '\ud83c\udfb5 Rhyme Battle', pokedexSpeller: '\u270f\ufe0f Pok\u00e9dex Speller',
    numberLineRace: '\ud83d\udccf Number Line', moreOrLess: '\u2696\ufe0f More or Less',
    potionMixer: '\ud83e\uddea Potion Mixer', sightWordScramble: '\ud83d\udd24 Sight Word',
    storySequence: '\ud83d\udcd6 Story Sequence', coinCounter: '\ud83e\ude99 Coin Counter',
    missingNumber: '\u2753 Missing Number', typeAdvantageQuiz: '\u2694\ufe0f Type Quiz',
    multiPowerup: '\ud83d\udcaa Multiply',
    readingPassage: '\ud83d\udcda Reading Quest',
    breederFractions: '\ud83e\udd5a Fractions', geographyExplorer: '\ud83d\uddfa\ufe0f Geography',
    scienceLab: '\ud83d\udd2c Science Lab',
    codeBreaker: '\ud83d\udd10 Code Breaker',
    numberBond: '🔗 Number Bond', makeTen: '🎯 Make 10', barModel: '📊 Bar Model', placeValue: '🔢 Place Value',
    // New reading curriculum
    soundSpotter: '🔊 Sound Spotter', rhymeCatcher: '🎵 Rhyme Catcher',
    letterSoundSafari: '🔤 Letter Sounds', firstSoundMatch: '👂 First Sound Match',
    wordBuilder: '🧱 Word Builder', blendAndRead: '🔗 Blend & Read',
    phonogramMatch: '🔠 Phonogram Match',
    spellingRulesQuiz: '📏 Spelling Rules', speedRead: '⏱️ Speed Read',
    wordSurgeon: '🔬 Word Surgeon', vocabularyDetective: '🔍 Vocabulary',
    passageQuestL4: '📚 Reading Quest',
    rootWordExplorer: '🌳 Root Explorer', inferenceLab: '🧠 Inference Lab',
    mainIdeaMatcher: '🎯 Main Idea', vocabInContext: '📖 Vocab in Context',
  };
  const typeLabel = typeLabels[ch.type] || '\ud83d\udcd6 Challenge';
  const contextPrefix = context === 'clue' ? '\ud83d\udd12 Unlock Clue - ' : context === 'activity' ? '' : '\u2694\ufe0f Battle - ';
  let html = `<div class="challenge-title">${contextPrefix}${typeLabel}!</div>`;

  if (ch.type === 'cvc') {
    html += renderWordTiles(ch.word, { big: true });
    html += `<div class="cvc-emoji-grid">`;
    ch.choices.forEach(emoji => {
      html += `<button class="cvc-emoji-btn" onclick="answerChallenge('${emoji}', '${context}')">${emoji}</button>`;
    });
    html += `</div>`;
  } else if (ch.type === 'comprehension') {
    html += `<div style="font-size:14px;color:#555;margin-bottom:10px;line-height:1.5;text-align:left;padding:10px;background:#f9f9f9;border-radius:8px;">${ch.passage}</div>`;
    html += `<div class="challenge-question">${ch.question}</div>`;
    html += `<div class="challenge-choices">`;
    ch.choices.forEach(c => {
      html += `<button class="btn-choice" onclick="answerChallenge('${c.replace(/'/g,"\\'")}', '${context}')">${c}</button>`;
    });
    html += `</div>`;
  } else if (ch.type === 'spelling') {
    // Extract scrambled letters from question (format: "Unscramble: XXXXX")
    const scrambled = ch.question.replace('Unscramble: ', '');
    html += `<div style="font-size:15px;font-weight:600;color:var(--pk-blue);margin-bottom:8px;">Tap the letters in the right order!</div>`;
    html += renderTileSpell(scrambled, ch.answer.length, context, ch.hint);
  } else if (ch.type === 'codeBreaker') {
    if (ch.hint) html += `<div style="font-size:13px;color:#888;margin-bottom:6px;font-style:italic;">${ch.hint}</div>`;
    // Show coded numbers as tiles
    const codedText = ch.coded || ch.question;
    const codeNums = codedText.match(/\d+/g);
    if (codeNums) {
      html += `<div class="letter-tiles" style="margin-bottom:14px;">`;
      codeNums.forEach((n, i) => {
        html += `<div class="letter-tile ${tileColor(i)}" style="width:auto;padding:0 12px;font-family:monospace;font-size:22px;">${n}</div>`;
      });
      html += `</div>`;
    } else {
      html += `<div class="challenge-question" style="font-family:monospace;letter-spacing:2px;">${codedText}</div>`;
    }
    html += `<div class="challenge-choices">`;
    (ch.choices || []).forEach(c => {
      const val = typeof c === 'number' ? c : `'${String(c).replace(/'/g,"\\'")}'`;
      html += `<button class="btn-choice" onclick="answerChallenge(${val}, '${context}')">${c}</button>`;
    });
    html += `</div>`;
  } else if (ch.type === 'countingCatch') {
    const emoji = ch.emoji || '⭐';
    const count = parseInt(ch.answer, 10) || 0;
    html += `<div class="challenge-question" style="font-size:16px;margin-bottom:8px;">How many do you see?</div>`;
    html += `<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:4px;font-size:28px;text-align:center;margin-bottom:14px;">`;
    for (let i = 0; i < count; i++) html += `<div>${emoji}</div>`;
    html += `</div>`;
    html += `<div class="challenge-choices">`;
    (ch.choices || []).forEach(c => {
      const val = typeof c === 'number' ? c : `'${String(c).replace(/'/g,"\\'")}'`;
      html += `<button class="btn-choice" onclick="answerChallenge(${val}, '${context}')">${c}</button>`;
    });
    html += `</div>`;
  } else if (ch.type === 'blendAMon') {
    // Show syllables as big colorful tiles
    const syllables = (ch.syllables || '').split('-');
    html += `<div style="font-size:14px;font-weight:600;color:var(--pk-purple,#7B1FA2);margin-bottom:8px;">Put these sounds together!</div>`;
    html += `<div class="letter-tiles">`;
    syllables.forEach((syl, i) => {
      html += `<div class="letter-tile tile-display ${tileColor(i)}" style="width:auto;padding:0 16px;font-size:28px;">${syl}</div>`;
    });
    html += `</div>`;
    if (ch.hint) html += `<div style="font-size:13px;color:#666;margin-bottom:8px;">${ch.hint}</div>`;
    html += `<div class="challenge-choices">`;
    (ch.choices || []).forEach(c => {
      const val = `'${String(c).replace(/'/g,"\\'")}'`;
      html += `<button class="btn-choice" style="font-size:17px;" onclick="answerChallenge(${val}, '${context}')">${c}</button>`;
    });
    html += `</div>`;
  } else if (ch.type === 'sightWordScramble') {
    // Show scrambled letters as tiles, then word choices below
    const scrambledWord = ch.scrambled || ch.question.replace(/.*"(.+)".*/, '$1');
    html += `<div style="font-size:14px;font-weight:600;color:var(--pk-blue);margin-bottom:8px;">Which word do these letters spell?</div>`;
    html += renderWordTiles(scrambledWord.toUpperCase());
    if (ch.hint) html += `<div style="font-size:13px;color:#666;margin-bottom:8px;">${ch.hint}</div>`;
    html += `<div class="challenge-choices">`;
    (ch.choices || []).forEach(c => {
      const val = `'${String(c).replace(/'/g,"\\'")}'`;
      html += `<button class="btn-choice" style="font-size:17px;text-transform:capitalize;" onclick="answerChallenge(${val}, '${context}')">${c}</button>`;
    });
    html += `</div>`;
  } else if (ch.type === 'pokedexSpeller') {
    // Show emoji + tap-to-spell tiles
    html += `<div style="font-size:48px;text-align:center;margin-bottom:8px;">${ch.emoji || ''}</div>`;
    html += `<div style="font-size:14px;font-weight:600;color:var(--pk-blue);margin-bottom:8px;">Tap the letters to spell it!</div>`;
    if (ch.letters && ch.word) {
      html += renderTileSpell(ch.letters.join('').toUpperCase(), ch.word.length, context, ch.hint);
    } else {
      html += `<div class="challenge-choices">`;
      (ch.choices || []).forEach(c => {
        const val = `'${String(c).replace(/'/g,"\\'")}'`;
        html += `<button class="btn-choice" onclick="answerChallenge(${val}, '${context}')">${c}</button>`;
      });
      html += `</div>`;
    }
  } else if (ch.type === 'storySequence') {
    html += `<div class="challenge-question">${ch.question}</div>`;
    if (ch.hint) html += `<div style="font-size:13px;color:#666;margin-bottom:8px;">${ch.hint}</div>`;
    html += `<div class="challenge-choices">`;
    (ch.choices || []).forEach(c => {
      const val = `'${String(c).replace(/'/g,"\\'")}'`;
      html += `<button class="btn-choice" style="text-align:left;font-size:14px;padding:12px 16px;line-height:1.4;border-radius:10px;" onclick="answerChallenge(${val}, '${context}')">${c}</button>`;
    });
    html += `</div>`;
  } else if (ch.type === 'moreOrLess') {
    const mlA = ch.countA || 1, mlB = ch.countB || 1;
    const mlEA = ch.emojiA || '⭐', mlEB = ch.emojiB || '💎';
    html += `<div class="challenge-question">Which group has MORE?</div>`;
    html += `<div style="display:flex;gap:10px;margin-bottom:16px;">`;
    html += `<div style="flex:1;background:#e3f2fd;border-radius:12px;padding:10px;text-align:center;">`;
    html += `<div style="font-weight:700;color:#1565c0;margin-bottom:6px;font-size:15px;">Group A</div>`;
    html += `<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:3px;font-size:22px;">`;
    for (let i = 0; i < mlA; i++) html += `<div>${mlEA}</div>`;
    html += `</div></div>`;
    html += `<div style="flex:1;background:#fce4ec;border-radius:12px;padding:10px;text-align:center;">`;
    html += `<div style="font-weight:700;color:#c62828;margin-bottom:6px;font-size:15px;">Group B</div>`;
    html += `<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:3px;font-size:22px;">`;
    for (let i = 0; i < mlB; i++) html += `<div>${mlEB}</div>`;
    html += `</div></div></div>`;
    html += `<div style="display:flex;gap:12px;">`;
    html += `<button class="btn-choice" data-val="A" style="flex:1;font-size:18px;font-weight:700;padding:14px;background:#e3f2fd;border:2px solid #1565c0;color:#1565c0;" onclick="answerChallenge('A', '${context}')">⬅️ Group A</button>`;
    html += `<button class="btn-choice" data-val="B" style="flex:1;font-size:18px;font-weight:700;padding:14px;background:#fce4ec;border:2px solid #c62828;color:#c62828;" onclick="answerChallenge('B', '${context}')">Group B ➡️</button>`;
    html += `</div>`;
  } else if (ch.type === 'readingPassage') {
    html += `<div style="font-weight:600;font-size:15px;color:var(--pk-blue,#1565c0);margin-bottom:6px;">${ch.title || 'Reading Passage'}</div>`;
    if (ch.passage) {
      html += `<div style="font-size:13px;color:#444;margin-bottom:12px;line-height:1.6;text-align:left;padding:12px;background:#f9f9f9;border-radius:8px;border-left:4px solid var(--pk-blue,#1565c0);max-height:160px;overflow-y:auto;">${ch.passage}</div>`;
    }
    html += `<div class="challenge-question">${ch.question}</div>`;
    html += `<div class="challenge-choices">`;
    (ch.choices || []).forEach(c => {
      const val = `'${String(c).replace(/'/g,"\\'")}'`;
      html += `<button class="btn-choice" style="text-align:left;font-size:13px;line-height:1.4;" onclick="answerChallenge(${val}, '${context}')">${c}</button>`;
    });
    html += `</div>`;
  } else if (ch.type === 'numberLineRace') {
    html += `<div class="challenge-question">Which number goes between ${ch.low} and ${ch.high}?</div>`;
    html += `<div style="display:flex;align-items:center;justify-content:center;margin:14px 0 16px;">`;
    html += `<div style="background:#1565c0;color:white;padding:10px 16px;border-radius:12px 0 0 12px;font-size:24px;font-weight:700;min-width:36px;text-align:center;">${ch.low}</div>`;
    html += `<div style="flex:0 0 40px;height:4px;background:#1565c0;"></div>`;
    html += `<div style="background:#fff3e0;border:3px solid #ff9800;padding:10px 16px;border-radius:12px;font-size:24px;font-weight:700;color:#e65100;min-width:36px;text-align:center;">?</div>`;
    html += `<div style="flex:0 0 40px;height:4px;background:#1565c0;"></div>`;
    html += `<div style="background:#1565c0;color:white;padding:10px 16px;border-radius:0 12px 12px 0;font-size:24px;font-weight:700;min-width:36px;text-align:center;">${ch.high}</div>`;
    html += `</div>`;
    html += `<div class="challenge-choices">`;
    (ch.choices || []).forEach(c => {
      const val = typeof c === 'number' ? c : `'${String(c).replace(/'/g,"\\'")}'`;
      html += `<button class="btn-choice" onclick="answerChallenge(${val}, '${context}')">${c}</button>`;
    });
    html += `</div>`;
  } else if (ch.type === 'coinCounter') {
    const coinStyles = {
      'Penny':  {bg:'linear-gradient(135deg,#d4845a,#a0522d)',sz:48,border:'#8d6e63'},
      'Nickel': {bg:'linear-gradient(135deg,#bdbdbd,#9e9e9e)',sz:52,border:'#757575'},
      'Dime':   {bg:'linear-gradient(135deg,#e0e0e0,#bdbdbd)',sz:44,border:'#9e9e9e'},
      'Quarter':{bg:'linear-gradient(135deg,#cfd8dc,#90a4ae)',sz:58,border:'#78909c'},
      'Half Dollar':{bg:'linear-gradient(135deg,#cfd8dc,#78909c)',sz:62,border:'#607d8b'},
      'Dollar': {bg:'linear-gradient(135deg,#ffd54f,#ffb300)',sz:60,border:'#f9a825'},
    };
    html += `<div class="challenge-question">How much money does Ash have?</div>`;
    html += `<div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin:10px 0 16px;padding:14px;background:#fffde7;border-radius:12px;">`;
    if (ch.coins && Array.isArray(ch.coins)) {
      ch.coins.forEach(coin => {
        const cs = coinStyles[coin.name] || {bg:'linear-gradient(135deg,#ffd54f,#ffb300)',sz:50,border:'#f9a825'};
        html += `<div style="width:${cs.sz}px;height:${cs.sz}px;border-radius:50%;background:${cs.bg};display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 2px 4px rgba(0,0,0,0.2);border:2px solid ${cs.border};">`;
        html += `<div style="font-size:12px;font-weight:700;color:#4e342e;">${coin.val}¢</div>`;
        html += `<div style="font-size:9px;color:#5d4037;margin-top:-1px;">${coin.name}</div>`;
        html += `</div>`;
      });
    }
    html += `</div>`;
    html += `<div class="challenge-choices">`;
    (ch.choices || []).forEach(c => {
      const val = typeof c === 'number' ? c : `'${String(c).replace(/'/g,"\\'")}'`;
      html += `<button class="btn-choice" onclick="answerChallenge(${val}, '${context}')">${c}</button>`;
    });
    html += `</div>`;
  } else if (ch.type === 'patternPath') {
    html += `<div style="font-size:14px;font-weight:600;color:var(--pk-purple,#7B1FA2);margin-bottom:10px;">What comes next in the pattern?</div>`;
    html += `<div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-bottom:16px;padding:12px;background:rgba(0,0,0,0.04);border-radius:12px;">`;
    const pItems = ch.patternItems || (ch.question.indexOf('\n') >= 0 ? ch.question.split('\n')[1].split(' ') : []);
    pItems.forEach(item => {
      if (item === '?') {
        html += `<div style="width:48px;height:48px;display:flex;align-items:center;justify-content:center;font-size:22px;background:#fff3e0;border-radius:10px;border:2px dashed #ff9800;color:#e65100;font-weight:700;">?</div>`;
      } else {
        html += `<div style="width:48px;height:48px;display:flex;align-items:center;justify-content:center;font-size:28px;background:white;border-radius:10px;box-shadow:0 1px 3px rgba(0,0,0,0.1);">${item}</div>`;
      }
    });
    html += `</div>`;
    html += `<div class="challenge-choices">`;
    (ch.choices || []).forEach(c => {
      const val = `'${String(c).replace(/'/g,"\\'")}'`;
      html += `<button class="btn-choice" style="font-size:24px;padding:10px 18px;" onclick="answerChallenge(${val}, '${context}')">${c}</button>`;
    });
    html += `</div>`;
  } else if (ch.type === 'missingNumber') {
    html += `<div style="font-size:14px;font-weight:600;color:var(--pk-blue,#1565c0);margin-bottom:10px;">Find the missing number!</div>`;
    html += `<div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-bottom:16px;padding:12px;">`;
    if (ch.sequence && ch.blankIndex != null) {
      ch.sequence.forEach((val, idx) => {
        if (idx === ch.blankIndex || val === null) {
          html += `<div style="width:52px;height:52px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;background:#fff3e0;border-radius:12px;border:2px dashed #ff9800;color:#e65100;">?</div>`;
        } else {
          html += `<div style="width:52px;height:52px;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;background:white;border-radius:12px;box-shadow:0 2px 6px rgba(0,0,0,0.1);color:#1565c0;">${val}</div>`;
        }
        if (idx < ch.sequence.length - 1) {
          html += `<div style="display:flex;align-items:center;color:#bbb;font-size:14px;">→</div>`;
        }
      });
    } else {
      html += `<div class="challenge-question">${ch.question}</div>`;
    }
    html += `</div>`;
    html += `<div class="challenge-choices">`;
    (ch.choices || []).forEach(c => {
      const val = typeof c === 'number' ? c : `'${String(c).replace(/'/g,"\\'")}'`;
      html += `<button class="btn-choice" onclick="answerChallenge(${val}, '${context}')">${c}</button>`;
    });
    html += `</div>`;
  } else if (ch.type === 'numberBond') {
    // Number bond diagram: circle on top (whole) connected to two circles below (parts)
    const whole = ch.whole;
    const pA = ch.partA;
    const pB = ch.partB;
    html += `<div style="display:flex;flex-direction:column;align-items:center;margin-bottom:16px;">`;
    // Whole circle
    html += `<div style="width:64px;height:64px;border-radius:50%;background:#1565c0;color:white;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700;box-shadow:0 2px 8px rgba(21,101,194,0.3);">${whole}</div>`;
    // Connecting lines (using a simple V shape)
    html += `<div style="display:flex;align-items:flex-start;justify-content:center;margin:4px 0;">`;
    html += `<div style="width:40px;height:24px;border-right:3px solid #1565c0;transform:skewX(30deg);"></div>`;
    html += `<div style="width:40px;height:24px;border-left:3px solid #1565c0;transform:skewX(-30deg);"></div>`;
    html += `</div>`;
    // Part circles
    html += `<div style="display:flex;gap:40px;">`;
    html += `<div style="width:56px;height:56px;border-radius:50%;background:${pA != null ? '#4CAF50' : '#fff3e0'};color:${pA != null ? 'white' : '#e65100'};display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;border:${pA != null ? 'none' : '3px dashed #ff9800'};box-shadow:0 2px 6px rgba(0,0,0,0.15);">${pA != null ? pA : '?'}</div>`;
    html += `<div style="width:56px;height:56px;border-radius:50%;background:${pB != null ? '#FF6B35' : '#fff3e0'};color:${pB != null ? 'white' : '#e65100'};display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;border:${pB != null ? 'none' : '3px dashed #ff9800'};box-shadow:0 2px 6px rgba(0,0,0,0.15);">${pB != null ? pB : '?'}</div>`;
    html += `</div></div>`;
    html += `<div class="challenge-question">What number completes the bond?</div>`;
    html += `<div class="challenge-choices">`;
    (ch.choices || []).forEach(c => {
      const val = typeof c === 'number' ? c : `'${String(c).replace(/'/g,"\\'")}'`;
      html += `<button class="btn-choice" onclick="answerChallenge(${val}, '${context}')">${c}</button>`;
    });
    html += `</div>`;

  } else if (ch.type === 'makeTen') {
    const target = ch.target || 10;
    const shown = ch.numA;
    // Visual: show filled dots + empty dots to make target
    html += `<div style="text-align:center;margin-bottom:14px;">`;
    html += `<div style="font-size:15px;font-weight:600;color:#1565c0;margin-bottom:10px;">How many more to make ${target}?</div>`;
    // Show a ten-frame (or hundred-frame) visual for small targets
    if (target <= 20) {
      const cols = target <= 10 ? 5 : 10;
      html += `<div style="display:inline-grid;grid-template-columns:repeat(${cols},1fr);gap:4px;padding:12px;background:#f5f5f5;border-radius:12px;margin-bottom:10px;">`;
      for (let i = 1; i <= target; i++) {
        const filled = i <= shown;
        html += `<div style="width:28px;height:28px;border-radius:50%;background:${filled ? '#1565c0' : '#e0e0e0'};border:2px solid ${filled ? '#0d47a1' : '#bbb'};display:flex;align-items:center;justify-content:center;font-size:11px;color:${filled ? 'white' : '#999'};">${filled ? i : ''}</div>`;
      }
      html += `</div>`;
    } else {
      // For 100: show a progress bar instead of dots
      const pct = Math.round((shown / target) * 100);
      html += `<div style="padding:12px;background:#f5f5f5;border-radius:12px;margin-bottom:10px;">`;
      html += `<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">`;
      html += `<div style="font-size:22px;font-weight:700;color:#1565c0;">${shown}</div>`;
      html += `<div style="flex:1;height:24px;background:#e0e0e0;border-radius:12px;overflow:hidden;">`;
      html += `<div style="width:${pct}%;height:100%;background:linear-gradient(90deg,#1565c0,#42a5f5);border-radius:12px;"></div>`;
      html += `</div>`;
      html += `<div style="font-size:22px;font-weight:700;color:#888;">${target}</div>`;
      html += `</div>`;
      html += `<div style="font-size:12px;color:#888;">${shown} out of ${target} — how many more?</div>`;
      html += `</div>`;
    }
    html += `</div>`;
    html += `<div class="challenge-choices">`;
    (ch.choices || []).forEach(c => {
      const val = typeof c === 'number' ? c : `'${String(c).replace(/'/g,"\\'")}'`;
      html += `<button class="btn-choice" onclick="answerChallenge(${val}, '${context}')">${c}</button>`;
    });
    html += `</div>`;

  } else if (ch.type === 'barModel') {
    html += `<div class="challenge-question" style="font-size:14px;line-height:1.5;margin-bottom:12px;">${ch.question}</div>`;
    // Render bar model visual
    const parts = ch.barParts || [];
    const maxVal = Math.max(...parts.map(p => p.value), ch.barTotal || 0);
    html += `<div style="margin-bottom:16px;padding:12px;background:#f5f5f5;border-radius:12px;">`;
    if (ch.barTotal) {
      html += `<div style="font-size:12px;color:#666;text-align:center;margin-bottom:6px;">${ch.barLabel || ''}</div>`;
      html += `<div style="height:36px;background:#e0e0e0;border-radius:8px;margin-bottom:8px;display:flex;align-items:center;justify-content:center;font-weight:700;color:#555;border:2px solid #bbb;">${ch.barTotal}</div>`;
    }
    html += `<div style="display:flex;gap:2px;margin-bottom:4px;">`;
    parts.forEach(p => {
      const pct = Math.max((p.value / maxVal) * 100, 15);
      const isUnknown = p.label === '?';
      html += `<div style="flex:${p.value};height:36px;background:${isUnknown ? 'repeating-linear-gradient(45deg,#fff3e0,#fff3e0 5px,#ffe0b2 5px,#ffe0b2 10px)' : p.color || '#4A90D9'};border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;color:${isUnknown ? '#e65100' : 'white'};border:${isUnknown ? '2px dashed #ff9800' : 'none'};min-width:40px;">${p.label}${!isUnknown ? ': ' + p.value : ''}</div>`;
    });
    html += `</div>`;
    if (!ch.barTotal && ch.barLabel) {
      html += `<div style="font-size:12px;color:#888;text-align:center;margin-top:6px;">${ch.barLabel}</div>`;
    }
    html += `</div>`;
    html += `<div class="challenge-choices">`;
    (ch.choices || []).forEach(c => {
      const val = typeof c === 'number' ? c : `'${String(c).replace(/'/g,"\\'")}'`;
      html += `<button class="btn-choice" onclick="answerChallenge(${val}, '${context}')">${c}</button>`;
    });
    html += `</div>`;

  } else if (ch.type === 'placeValue') {
    const digits = ch.digits || [];
    const num = ch.number;
    // Show the number large, then digit boxes all styled the same (no answer giveaway)
    html += `<div style="text-align:center;margin-bottom:16px;">`;
    html += `<div style="font-size:36px;font-weight:700;color:#1565c0;margin-bottom:10px;">${ch.place === 'expanded' ? num.toLocaleString() : num.toLocaleString()}</div>`;
    html += `<div style="display:inline-flex;gap:4px;margin-bottom:8px;">`;
    digits.forEach((d, i) => {
      html += `<div style="width:48px;height:56px;display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:10px;background:#f5f5f5;color:#333;border:2px solid #e0e0e0;">`;
      html += `<div style="font-size:24px;font-weight:700;">${d.value}</div>`;
      html += `<div style="font-size:9px;text-transform:uppercase;color:#888;">${d.place}</div>`;
      html += `</div>`;
    });
    html += `</div></div>`;
    html += `<div class="challenge-question">${ch.question}</div>`;
    html += `<div class="challenge-choices">`;
    (ch.choices || []).forEach(c => {
      const val = typeof c === 'number' ? c : `'${String(c).replace(/'/g,"\\'")}'`;
      html += `<button class="btn-choice" onclick="answerChallenge(${val}, '${context}')">${c}</button>`;
    });
    html += `</div>`;

  // === NEW READING CURRICULUM RENDERERS ===

  } else if (ch.type === 'soundSpotter') {
    // Show segmented sounds, pick the matching emoji
    html += `<div style="font-size:14px;font-weight:600;color:var(--pk-purple,#7B1FA2);margin-bottom:8px;">Blend these sounds together!</div>`;
    const sounds = ch.question.split(' ');
    html += `<div class="letter-tiles" style="margin-bottom:14px;">`;
    sounds.forEach((s, i) => {
      html += `<div class="letter-tile tile-display ${tileColor(i)}" style="width:auto;padding:0 14px;font-size:24px;font-style:italic;">${s}</div>`;
    });
    html += `</div>`;
    html += `<div class="cvc-emoji-grid">`;
    ch.choices.forEach(emoji => {
      html += `<button class="cvc-emoji-btn" onclick="answerChallenge('${emoji}', '${context}')">${emoji}</button>`;
    });
    html += `</div>`;

  } else if (ch.type === 'rhymeCatcher' || ch.type === 'rhymeBattle') {
    html += `<div class="challenge-question">${ch.question}</div>`;
    if (ch.hint) html += `<div style="font-size:13px;color:#666;margin-bottom:8px;">${ch.hint}</div>`;
    html += `<div class="challenge-choices">`;
    (ch.choices || []).forEach(c => {
      html += `<button class="btn-choice" style="font-size:17px;" onclick="answerChallenge('${c.replace(/'/g,"\\'")}', '${context}')">${c}</button>`;
    });
    html += `</div>`;

  } else if (ch.type === 'letterSoundSafari' || ch.type === 'soundSafari') {
    html += `<div style="font-size:14px;font-weight:600;color:var(--pk-blue,#1565C0);margin-bottom:8px;">${ch.hint || 'What starts with this sound?'}</div>`;
    html += `<div style="font-size:72px;text-align:center;margin-bottom:14px;font-weight:700;color:var(--pk-blue,#1565C0);">${ch.question}</div>`;
    html += `<div class="cvc-emoji-grid">`;
    ch.choices.forEach(emoji => {
      html += `<button class="cvc-emoji-btn" onclick="answerChallenge('${emoji}', '${context}')">${emoji}</button>`;
    });
    html += `</div>`;

  } else if (ch.type === 'firstSoundMatch') {
    html += `<div style="font-size:14px;font-weight:600;color:var(--pk-purple,#7B1FA2);margin-bottom:12px;">Do these words start with the same sound?</div>`;
    html += `<div style="display:flex;gap:20px;justify-content:center;margin-bottom:16px;">`;
    html += `<div style="text-align:center;"><div style="font-size:48px;">${ch.emojiA || ''}</div><div style="font-size:18px;font-weight:600;margin-top:4px;">${ch.wordA}</div></div>`;
    html += `<div style="text-align:center;"><div style="font-size:48px;">${ch.emojiB || ''}</div><div style="font-size:18px;font-weight:600;margin-top:4px;">${ch.wordB}</div></div>`;
    html += `</div>`;
    html += `<div style="display:flex;gap:12px;justify-content:center;">`;
    html += `<button class="btn-choice" style="flex:1;max-width:140px;font-size:20px;font-weight:700;padding:14px;background:#e8f5e9;border:2px solid #4CAF50;color:#2E7D32;" onclick="answerChallenge('Yes', '${context}')">✅ Yes</button>`;
    html += `<button class="btn-choice" style="flex:1;max-width:140px;font-size:20px;font-weight:700;padding:14px;background:#ffebee;border:2px solid #f44336;color:#c62828;" onclick="answerChallenge('No', '${context}')">❌ No</button>`;
    html += `</div>`;

  } else if (ch.type === 'wordBuilder') {
    // Show emoji + tap-to-spell tiles (same rendering as pokedexSpeller)
    html += `<div style="font-size:48px;text-align:center;margin-bottom:8px;">${ch.emoji || ''}</div>`;
    html += `<div style="font-size:14px;font-weight:600;color:var(--pk-blue);margin-bottom:8px;">Tap the letters to spell the word!</div>`;
    if (ch.letters && ch.word) {
      html += renderTileSpell(ch.letters.join('').toUpperCase(), ch.word.length, context, ch.hint);
    }

  } else if (ch.type === 'blendAndRead') {
    html += `<div style="font-size:14px;font-weight:600;color:var(--pk-blue,#1565C0);margin-bottom:8px;">Blend the letters to read the word!</div>`;
    const letters = ch.letters || ch.question.split('');
    html += `<div class="letter-tiles" style="margin-bottom:14px;">`;
    letters.forEach((l, i) => {
      html += `<div class="letter-tile tile-display ${tileColor(i)}" style="font-size:28px;">${l.toUpperCase()}</div>`;
    });
    html += `</div>`;
    if (ch.emoji) html += `<div style="font-size:36px;text-align:center;margin-bottom:10px;">${ch.emoji}</div>`;
    html += `<div class="challenge-choices">`;
    (ch.choices || []).forEach(c => {
      html += `<button class="btn-choice" style="font-size:17px;" onclick="answerChallenge('${c.replace(/'/g,"\\'")}', '${context}')">${c}</button>`;
    });
    html += `</div>`;

  } else if (ch.type === 'phonogramMatch') {
    html += `<div style="font-size:14px;font-weight:600;color:var(--pk-purple,#7B1FA2);margin-bottom:8px;">${ch.hint || 'Fill in the missing letters!'}</div>`;
    // Show blanked word with the gap highlighted
    const parts = ch.question.split('___');
    html += `<div style="font-size:36px;font-weight:700;text-align:center;margin-bottom:16px;padding:14px;background:#f5f5f5;border-radius:12px;">`;
    html += `${parts[0]}<span style="display:inline-block;min-width:50px;border-bottom:4px solid var(--pk-blue,#1565C0);margin:0 2px;color:var(--pk-blue,#1565C0);">&nbsp;?&nbsp;</span>${parts[1] || ''}</div>`;
    html += `<div class="challenge-choices">`;
    (ch.choices || []).forEach(c => {
      html += `<button class="btn-choice" style="font-size:20px;font-weight:700;letter-spacing:2px;" onclick="answerChallenge('${c.replace(/'/g,"\\'")}', '${context}')">${c}</button>`;
    });
    html += `</div>`;

  } else if (ch.type === 'spellingRulesQuiz') {
    html += `<div style="font-size:14px;font-weight:600;color:var(--pk-purple,#7B1FA2);margin-bottom:8px;">Why is this word spelled this way?</div>`;
    html += `<div style="font-size:36px;font-weight:700;text-align:center;color:#333;margin-bottom:16px;padding:14px;background:#f5f5f5;border-radius:12px;">${ch.question}</div>`;
    html += `<div class="challenge-choices">`;
    (ch.choices || []).forEach(c => {
      html += `<button class="btn-choice" style="font-size:13px;text-align:left;line-height:1.4;padding:12px;" onclick="answerChallenge('${c.replace(/'/g,"\\'")}', '${context}')">${c}</button>`;
    });
    html += `</div>`;

  } else if (ch.type === 'speedRead') {
    html += `<div style="font-size:14px;font-weight:600;color:var(--pk-blue,#1565C0);margin-bottom:8px;">Read the word and pick the picture!</div>`;
    html += `<div style="font-size:42px;font-weight:700;text-align:center;color:#333;margin-bottom:16px;padding:16px;background:#f5f5f5;border-radius:12px;">${ch.word || ch.question}</div>`;
    html += `<div class="cvc-emoji-grid">`;
    ch.choices.forEach(emoji => {
      html += `<button class="cvc-emoji-btn" onclick="answerChallenge('${emoji}', '${context}')">${emoji}</button>`;
    });
    html += `</div>`;

  } else if (ch.type === 'wordSurgeon') {
    html += `<div style="font-size:14px;font-weight:600;color:var(--pk-purple,#7B1FA2);margin-bottom:8px;">Find the ${ch.affixType || 'affix'} in this word!</div>`;
    // Render word with parts highlighted
    if (ch.parts && ch.parts.length >= 2) {
      html += `<div style="display:flex;gap:2px;justify-content:center;margin-bottom:12px;">`;
      ch.parts.forEach((part, i) => {
        const isAffix = (ch.affixType === 'prefix' && i === 0) || (ch.affixType === 'suffix' && i === ch.parts.length - 1);
        html += `<div style="padding:10px 16px;font-size:22px;font-weight:700;border-radius:8px;background:${isAffix ? '#fff3e0' : '#e3f2fd'};color:${isAffix ? '#e65100' : '#1565c0'};border:2px ${isAffix ? 'dashed #ff9800' : 'solid #90caf9'};">${part}</div>`;
      });
      html += `</div>`;
    } else {
      html += `<div style="font-size:28px;font-weight:700;text-align:center;margin-bottom:12px;">${ch.question}</div>`;
    }
    if (ch.meaning) html += `<div style="font-size:13px;color:#666;margin-bottom:10px;font-style:italic;">Meaning: ${ch.meaning}</div>`;
    html += `<div class="challenge-choices">`;
    (ch.choices || []).forEach(c => {
      html += `<button class="btn-choice" style="font-size:18px;font-weight:600;" onclick="answerChallenge('${c.replace(/'/g,"\\'")}', '${context}')">${c}</button>`;
    });
    html += `</div>`;

  } else if (ch.type === 'vocabularyDetective' || ch.type === 'vocabInContext') {
    // Show sentence with target word bolded
    const sentence = ch.question.replace(new RegExp('\\b' + (ch.target || '') + '\\b', 'i'), `<strong style="color:var(--pk-blue,#1565C0);text-decoration:underline;">$&</strong>`);
    html += `<div style="font-size:14px;color:#444;line-height:1.6;text-align:left;padding:12px;background:#f9f9f9;border-radius:8px;margin-bottom:12px;border-left:4px solid var(--pk-blue,#1565c0);">${sentence}</div>`;
    html += `<div style="font-size:14px;font-weight:600;margin-bottom:8px;">What does "<em>${ch.target || ''}</em>" mean?</div>`;
    html += `<div class="challenge-choices">`;
    (ch.choices || []).forEach(c => {
      html += `<button class="btn-choice" style="font-size:13px;text-align:left;line-height:1.4;" onclick="answerChallenge('${c.replace(/'/g,"\\'")}', '${context}')">${c}</button>`;
    });
    html += `</div>`;

  } else if (ch.type === 'passageQuestL4') {
    // Same rendering as readingPassage
    html += `<div style="font-weight:600;font-size:15px;color:var(--pk-blue,#1565c0);margin-bottom:6px;">${ch.title || 'Reading Passage'}</div>`;
    if (ch.passage) {
      html += `<div style="font-size:13px;color:#444;margin-bottom:12px;line-height:1.6;text-align:left;padding:12px;background:#f9f9f9;border-radius:8px;border-left:4px solid var(--pk-blue,#1565c0);max-height:160px;overflow-y:auto;">${ch.passage}</div>`;
    }
    html += `<div class="challenge-question">${ch.question}</div>`;
    html += `<div class="challenge-choices">`;
    (ch.choices || []).forEach(c => {
      html += `<button class="btn-choice" style="text-align:left;font-size:13px;line-height:1.4;" onclick="answerChallenge('${c.replace(/'/g,"\\'")}', '${context}')">${c}</button>`;
    });
    html += `</div>`;

  } else if (ch.type === 'rootWordExplorer') {
    html += `<div style="font-size:14px;font-weight:600;color:var(--pk-purple,#7B1FA2);margin-bottom:8px;">Which word uses this root?</div>`;
    html += `<div style="text-align:center;margin-bottom:14px;padding:14px;background:#f3e5f5;border-radius:12px;">`;
    html += `<div style="font-size:36px;font-weight:700;color:#7B1FA2;">${ch.question}</div>`;
    html += `<div style="font-size:14px;color:#666;margin-top:4px;">= "${ch.rootMeaning || ''}"</div>`;
    html += `</div>`;
    html += `<div class="challenge-choices">`;
    (ch.choices || []).forEach(c => {
      html += `<button class="btn-choice" style="font-size:15px;" onclick="answerChallenge('${c.replace(/'/g,"\\'")}', '${context}')">${c}</button>`;
    });
    html += `</div>`;

  } else if (ch.type === 'inferenceLab') {
    html += `<div style="font-size:14px;font-weight:600;color:var(--pk-blue,#1565C0);margin-bottom:6px;">🧠 Read and infer!</div>`;
    html += `<div style="font-size:13px;color:#444;margin-bottom:12px;line-height:1.6;text-align:left;padding:12px;background:#f9f9f9;border-radius:8px;border-left:4px solid #7B1FA2;max-height:160px;overflow-y:auto;">${ch.passage}</div>`;
    html += `<div class="challenge-question">${ch.question}</div>`;
    html += `<div class="challenge-choices">`;
    (ch.choices || []).forEach(c => {
      html += `<button class="btn-choice" style="text-align:left;font-size:13px;line-height:1.4;" onclick="answerChallenge('${c.replace(/'/g,"\\'")}', '${context}')">${c}</button>`;
    });
    html += `</div>`;

  } else if (ch.type === 'mainIdeaMatcher') {
    html += `<div style="font-size:14px;font-weight:600;color:var(--pk-blue,#1565C0);margin-bottom:6px;">What is this passage mostly about?</div>`;
    html += `<div style="font-size:13px;color:#444;margin-bottom:12px;line-height:1.6;text-align:left;padding:12px;background:#f9f9f9;border-radius:8px;border-left:4px solid #4CAF50;max-height:160px;overflow-y:auto;">${ch.passage}</div>`;
    html += `<div class="challenge-question">${ch.question}</div>`;
    html += `<div class="challenge-choices">`;
    (ch.choices || []).forEach(c => {
      html += `<button class="btn-choice" style="text-align:left;font-size:13px;line-height:1.4;" onclick="answerChallenge('${c.replace(/'/g,"\\'")}', '${context}')">${c}</button>`;
    });
    html += `</div>`;

  } else {
    if (ch.hint) html += `<div style="font-size:14px;color:#666;margin-bottom:6px;">${ch.hint}</div>`;
    html += `<div class="challenge-question">${ch.question}</div>`;
    html += `<div class="challenge-choices">`;
    (ch.choices || []).forEach(c => {
      const val = typeof c === 'number' ? c : `'${String(c).replace(/'/g,"\\'")}'`;
      html += `<button class="btn-choice" onclick="answerChallenge(${val}, '${context}')">${c}</button>`;
    });
    html += `</div>`;
  }
  return html;
}

window.answerChallenge = function(chosen, context) {
  const ch = context === 'clue' ? State.encounter.currentChallenge
    : context === 'activity' ? _activitySession.currentChallenge
    : State.gym.pendingChallenge;
  if (!ch) return;

  // Determine correctness based on challenge type
  let isCorrect;
  isCorrect = String(chosen) === String(ch.answer) || String(chosen).toLowerCase() === String(ch.answer).toLowerCase();

  // Highlight buttons - support both .btn-choice and .cvc-emoji-btn
  const container = context === 'clue' ? 'clue-challenge-area'
    : context === 'activity' ? 'activity-play-area'
    : 'battle-challenge-area';
  const containerEl = document.getElementById(container);
  const hasEmojiBtn = containerEl && containerEl.querySelector('.cvc-emoji-btn');
  const btnSelector = hasEmojiBtn ? '.cvc-emoji-btn' : '.btn-choice';
  const btns = document.querySelectorAll(`#${container} ${btnSelector}`);
  btns.forEach(b => {
    b.disabled = true;
    b.style.pointerEvents = 'none';
    const btnVal = b.dataset.val || b.textContent.trim();
    const ansText = String(ch.answer).trim();
    const chosenText = String(chosen).trim();
    if (btnVal === ansText) b.classList.add('correct');
    else if (btnVal === chosenText) b.classList.add('wrong');
  });

  setTimeout(() => {
    if (typeof onAnswerResult === 'function') onAnswerResult(isCorrect, { scene: context, challengeType: ch.type });
    if (context === 'clue') {
      if (isCorrect) {
        SFX.correct();
        State.encounter.cluesUnlocked = State.encounter.pendingChallenge;
        document.getElementById('clue-challenge-area').classList.add('hidden');
        addXp(10);
        renderClues(); // this handles sprite visibility
        notify('Correct! Clue unlocked! \ud83c\udf89', 'success');
      } else {
        SFX.wrong();
        State.encounter.ballsLeft--;
        renderPokeballs();
        if (State.encounter.ballsLeft <= 0) {
          document.getElementById('clue-challenge-area').classList.add('hidden');
          notify(`${State.encounter.pokemon.name} ran away! You're out of Poké Balls!`, 'error');
          setTimeout(() => Game.goToMap(), 2500);
          return;
        }
        notify(`Not quite! Lost a Poké Ball! (${State.encounter.ballsLeft} left)`, 'error');
        startClueChallenge(State.encounter.pendingChallenge);
      }
    } else if (context === 'activity') {
      // Handled via Game.submitActivityAnswer — this path is for choice buttons
      if (isCorrect) { SFX.correct(); addXp(10); } else { SFX.wrong(); }
      _activitySession.total++;
      if (isCorrect) _activitySession.correct++;
      const feedback = document.getElementById('activity-feedback');
      if (feedback) {
        feedback.textContent = isCorrect ? '\u2705 Correct! Well done!' : '\u274c Not quite! The answer was: ' + ch.answer;
        feedback.className = 'activity-feedback ' + (isCorrect ? 'correct' : 'wrong');
      }
      _updateActivityScore();
      setTimeout(() => _renderNextActivityChallenge(), 1500);
    } else {
      resolveGymAnswer(isCorrect);
    }
  }, 800);
};

window.checkSpelling = function(context) {
  const input = document.getElementById('spelling-input');
  const val = input ? input.value.trim().toUpperCase() : '';
  answerChallenge(val, context);
};

// ===== GUESS POKEMON =====
const guessInput = document.getElementById('pokemon-guess-input');
const autocompleteList = document.getElementById('autocomplete-list');

guessInput.addEventListener('input', function() {
  const val = this.value.trim().toLowerCase();
  autocompleteList.innerHTML = '';
  if (!val) return;
  const matches = POKEMON_DB.filter(p => p.name.toLowerCase().startsWith(val)).slice(0, 5);
  matches.forEach(p => {
    const item = document.createElement('div');
    item.className = 'autocomplete-item';
    item.textContent = p.name;
    item.addEventListener('click', () => {
      guessInput.value = p.name;
      autocompleteList.innerHTML = '';
    });
    autocompleteList.appendChild(item);
  });
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.guess-input-wrap')) autocompleteList.innerHTML = '';
});

Game.submitGuess = function() {
  SFX.click();
  const guess = guessInput.value.trim().toLowerCase();
  const pokemon = State.encounter.pokemon;
  const result = document.getElementById('encounter-result');

  if (!guess) { notify('Type a Pokémon name first!'); return; }
  if (State.encounter.cluesUnlocked < 1) { notify('Unlock at least one clue first!'); return; }

  if (guess === pokemon.name.toLowerCase()) {
    SFX.correct();
    const rarity = getPokemonRarity(pokemon);
    result.innerHTML = `✅ That's right! It's ${pokemon.name}! <span class="catch-difficulty catch-${rarity}">${RARITY_LABELS[rarity]}</span>`;
    result.className = 'encounter-result correct';
    document.getElementById('encounter-pokemon-sprite').className = 'encounter-sprite revealed';
    const mystery = document.getElementById('pokemon-mystery');
    if (mystery) mystery.classList.add('hidden');
    document.getElementById('encounter-title').textContent = `It's ${pokemon.name}!`;
    document.getElementById('guess-btn').disabled = true;
    guessInput.disabled = true;
    addXp(20);

    // Start pokeball throw
    setTimeout(() => startPokeBallThrow(pokemon), 1200);
  } else {
    SFX.wrong();
    State.encounter.ballsLeft--;
    renderPokeballs();
    result.classList.remove('hidden');
    if (State.encounter.ballsLeft <= 0) {
      result.textContent = `${pokemon.name} ran away! You're out of Poké Balls!`;
      result.className = 'encounter-result wrong';
      guessInput.disabled = true;
      document.getElementById('guess-btn').disabled = true;
      setTimeout(() => Game.goToMap(), 2500);
      return;
    }
    result.textContent = `❌ Wrong guess! Lost a Poké Ball! (${State.encounter.ballsLeft} left)`;
    result.className = 'encounter-result wrong';
    guessInput.value = '';
    guessInput.classList.add('shake');
    setTimeout(() => guessInput.classList.remove('shake'), 500);
  }
};

// ===== POKEBALL THROW =====
function startPokeBallThrow(pokemon) {
  State.encounter.awaitingThrow = true;
  // ballsLeft carries over from encounter phase (penalties for wrong answers)

  const throwSprite = document.getElementById('throw-pokemon-sprite');
  throwSprite.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
  throwSprite.style.visibility = 'visible';
  document.getElementById('throw-status').textContent = `Catch ${pokemon.name}!`;
  document.getElementById('throw-balls-left').innerHTML = '';
  updateThrowBallsDisplay();
  showScene('throw');
  setupThrowMiniGame(pokemon);
}

function updateThrowBallsDisplay() {
  const el = document.getElementById('throw-balls-left');
  el.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    const pb = document.createElement('div');
    pb.className = 'pokeball-small' + (i >= State.encounter.ballsLeft ? ' used' : '');
    pb.innerHTML = `<div class="pokeball-top"></div><div class="pokeball-bottom"></div><div class="pokeball-line"></div><div class="pokeball-button"></div>`;
    el.appendChild(pb);
  }
}

// Store throw mini-game listeners for cleanup
let _throwListeners = null;

function cleanupThrowListeners() {
  if (_throwListeners) {
    _throwListeners.ball.removeEventListener('mousedown', _throwListeners.onStart);
    _throwListeners.ball.removeEventListener('touchstart', _throwListeners.onStart);
    document.removeEventListener('mousemove', _throwListeners.onMove);
    document.removeEventListener('touchmove', _throwListeners.onMove);
    document.removeEventListener('mouseup', _throwListeners.onEnd);
    document.removeEventListener('touchend', _throwListeners.onEnd);
    _throwListeners = null;
  }
}

function setupThrowMiniGame(pokemon) {
  cleanupThrowListeners();
  const ball = document.getElementById('pokeball-draggable');
  const container = document.querySelector('.throw-content');
  let isDragging = false;
  let startX, startY, currentX, currentY;
  let ballInitialX, ballInitialY;
  let thrown = false;

  function resetBall() {
    ball.style.transition = 'none';
    ball.style.transform = '';
    ball.style.left = '';
    ball.style.top = '';
    ball.style.position = 'relative';
    thrown = false;
  }
  resetBall();

  function getPos(e) {
    const t = e.touches ? e.touches[0] : e;
    return { x: t.clientX, y: t.clientY };
  }

  function onStart(e) {
    if (thrown || State.encounter.ballsLeft <= 0) return;
    e.preventDefault();
    getAudio(); // ensure audio context
    isDragging = true;
    const pos = getPos(e);
    const rect = ball.getBoundingClientRect();
    startX = pos.x;
    startY = pos.y;
    ballInitialX = rect.left + rect.width / 2;
    ballInitialY = rect.top + rect.height / 2;
    ball.style.position = 'fixed';
    ball.style.left = (ballInitialX - 32) + 'px';
    ball.style.top = (ballInitialY - 32) + 'px';
  }

  function onMove(e) {
    if (!isDragging || thrown) return;
    e.preventDefault();
    const pos = getPos(e);
    currentX = pos.x;
    currentY = pos.y;
    ball.style.left = (currentX - 32) + 'px';
    ball.style.top = (currentY - 32) + 'px';
  }

  function onEnd(e) {
    if (!isDragging || thrown) return;
    isDragging = false;
    const pos = e.changedTouches ? e.changedTouches[0] : e;
    const dx = (currentX || pos.clientX) - startX;
    const dy = (currentY || pos.clientY) - startY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dy > -30 || dist < 30) {
      // Not a real throw
      resetBall();
      return;
    }

    thrown = true;
    SFX.whoosh();

    // Determine target (pokemon sprite center)
    const pokemonEl = document.getElementById('throw-pokemon-sprite');
    const pRect = pokemonEl.getBoundingClientRect();
    const targetX = pRect.left + pRect.width / 2;
    const targetY = pRect.top + pRect.height / 2;

    // Random accuracy factor
    const accuracy = Math.random() * 0.4 + 0.6;
    const finalX = targetX + (Math.random() - 0.5) * 80;
    const finalY = targetY + (Math.random() - 0.5) * 60;

    ball.style.transition = 'left 0.45s cubic-bezier(0.16,1,0.3,1), top 0.45s ease-in';
    ball.style.left = (finalX - 32) + 'px';
    ball.style.top = (finalY - 32) + 'px';

    const isHit = Math.abs(finalX - targetX) < 80 && Math.abs(finalY - targetY) < 60;
    State.encounter.ballsLeft--;

    setTimeout(() => {
      if (isHit) {
        // Ball hit the pokemon
        ball.style.transition = 'none';
        ball.style.left = (targetX - 32) + 'px';
        ball.style.top = (targetY - 32) + 'px';
        document.getElementById('throw-pokemon-sprite').style.visibility = 'hidden';

        // Wiggle animation
        SFX.wiggle();
        document.getElementById('throw-status').textContent = '...';
        ball.classList.add('wiggle');
        setTimeout(() => ball.classList.remove('wiggle'), 500);

        setTimeout(() => {
          const rarity = getPokemonRarity(pokemon);
          const catchChance = RARITY_CATCH_CHANCE[rarity] + (State.level * 0.03);
          const caught = Math.random() < catchChance;

          if (caught) {
            SFX.caught();
            launchConfetti();
            document.getElementById('throw-status').textContent = `🎉 Gotcha! ${pokemon.name} was caught!`;
            if (!State.caught.includes(pokemon.id)) {
              State.caught.push(pokemon.id);
              initPokemonHp(pokemon.id);
              addXp(50);
            }
            updateTrainerBar();
            setTimeout(() => {
              notify(`${pokemon.name} added to your Pokédex! 📖`, 'success');
              Game.goToMap();
            }, 2500);
          } else {
            document.getElementById('throw-pokemon-sprite').style.visibility = 'visible';
            ball.classList.add('shake');
            setTimeout(() => ball.classList.remove('shake'), 500);
            document.getElementById('throw-status').textContent = `${pokemon.name} broke free!`;

            if (State.encounter.ballsLeft <= 0) {
              setTimeout(() => {
                document.getElementById('throw-status').textContent = `${pokemon.name} ran away! Try again!`;
                setTimeout(() => Game.goToMap(), 2000);
              }, 800);
            } else {
              updateThrowBallsDisplay();
              setTimeout(() => {
                resetBall();
                setupThrowMiniGame(pokemon);
              }, 1200);
            }
          }
        }, 900);
      } else {
        // Missed
        document.getElementById('throw-status').textContent = `Missed! ${State.encounter.ballsLeft} left`;
        if (State.encounter.ballsLeft <= 0) {
          setTimeout(() => {
            document.getElementById('throw-status').textContent = `${pokemon.name} ran away!`;
            setTimeout(() => Game.goToMap(), 2000);
          }, 600);
        } else {
          updateThrowBallsDisplay();
          setTimeout(() => {
            resetBall();
            setupThrowMiniGame(pokemon);
          }, 1000);
        }
      }
    }, 500);
  }

  ball.addEventListener('mousedown', onStart);
  ball.addEventListener('touchstart', onStart, { passive: false });
  document.addEventListener('mousemove', onMove);
  document.addEventListener('touchmove', onMove, { passive: false });
  document.addEventListener('mouseup', onEnd);
  document.addEventListener('touchend', onEnd);

  _throwListeners = { ball, onStart, onMove, onEnd };
}

