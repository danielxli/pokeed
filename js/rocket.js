// ===== TEAM ROCKET =====
// Team Rocket encounters, puzzles (pattern, sentence, timed math)
// Word search moved to Pokemon Center — rendering functions kept here for shared use

// ===== TEAM ROCKET SCENE =====
Game.goToRocket = function() {
  SFX.rocket();
  const dialogue = ROCKET_DIALOGUES[Math.floor(Math.random() * ROCKET_DIALOGUES.length)];
  const textEl = document.getElementById('rocket-dialogue-text');
  textEl.innerHTML = `<em>"${dialogue.jessie}"</em><br><br><em>"${dialogue.james}"</em>`;

  document.getElementById('rocket-intro').classList.remove('hidden');
  document.getElementById('rocket-puzzle').classList.add('hidden');
  document.getElementById('rocket-result').classList.add('hidden');

  showScene('rocket');
};

Game.startRocketPuzzle = function() {
  SFX.pop();
  document.getElementById('rocket-intro').classList.add('hidden');
  document.getElementById('rocket-result').classList.add('hidden');
  document.getElementById('rocket-puzzle').classList.remove('hidden');

  // Filter puzzle types by level (wordsearch removed — now in Pokemon Center)
  const level = State.settings.level;
  const puzzleTypes = [];
  puzzleTypes.push('pattern');     // all levels
  puzzleTypes.push('timedmath');   // all levels
  if (level >= 2) puzzleTypes.push('sentence'); // sentence from level 2+

  const type = puzzleTypes[Math.floor(Math.random() * puzzleTypes.length)];

  State.rocket.puzzle = { type, solved: false };
  document.getElementById('puzzle-timer-wrap').classList.add('hidden');

  renderRocketPuzzle(type);
};

function renderRocketPuzzle(type) {
  const content = document.getElementById('puzzle-content');
  document.getElementById('puzzle-type-label').textContent =
    type === 'pattern' ? '🔢 Pattern Recognition' :
    type === 'sentence' ? '📝 Sentence Ordering' : '⚡ Quick Math Challenge';

  content.innerHTML = '';

  if (type === 'pattern') renderPatternPuzzle(content);
  else if (type === 'sentence') renderSentencePuzzle(content);
  else if (type === 'timedmath') renderTimedMathPuzzle(content);
}

// ===== PATTERNS BY LEVEL =====
const PATTERNS_BY_LEVEL = {
  1: [
    { seq: [1, 2, 3, 4], answer: 5, choices: [5, 6, 4, 7], rule: 'Count up by 1' },
    { seq: [2, 4, 6, 8], answer: 10, choices: [10, 9, 11, 12], rule: 'Count up by 2' },
    { seq: [5, 10, 15, 20], answer: 25, choices: [25, 22, 30, 24], rule: 'Count up by 5' },
    { seq: [10, 20, 30, 40], answer: 50, choices: [50, 45, 55, 48], rule: 'Count up by 10' },
    { seq: [1, 3, 5, 7], answer: 9, choices: [9, 8, 10, 11], rule: 'Count up by 2' },
    { seq: [3, 6, 9, 12], answer: 15, choices: [15, 13, 18, 14], rule: 'Count up by 3' },
  ],
  2: [
    { seq: [2, 4, 6, 8], answer: 10, choices: [10, 9, 11, 12], rule: 'Add 2 each time' },
    { seq: [5, 10, 15, 20], answer: 25, choices: [25, 22, 30, 24], rule: 'Add 5 each time' },
    { seq: [3, 6, 9, 12], answer: 15, choices: [15, 13, 18, 14], rule: 'Add 3 each time' },
    { seq: [10, 20, 30, 40], answer: 50, choices: [50, 45, 55, 48], rule: 'Add 10 each time' },
    { seq: [100, 90, 80, 70], answer: 60, choices: [60, 65, 55, 50], rule: 'Subtract 10 each time' },
    { seq: [20, 18, 16, 14], answer: 12, choices: [12, 10, 13, 11], rule: 'Subtract 2 each time' },
    { seq: [4, 8, 12, 16], answer: 20, choices: [20, 18, 22, 24], rule: 'Add 4 each time' },
  ],
  3: [
    { seq: [2, 4, 8, 16], answer: 32, choices: [32, 30, 28, 24], rule: 'Multiply by 2 each time' },
    { seq: [1, 2, 4, 8], answer: 16, choices: [16, 12, 14, 10], rule: 'Multiply by 2 each time' },
    { seq: [100, 90, 80, 70], answer: 60, choices: [60, 65, 55, 50], rule: 'Subtract 10 each time' },
    { seq: [7, 14, 21, 28], answer: 35, choices: [35, 32, 36, 42], rule: 'Add 7 each time' },
    { seq: [50, 45, 40, 35], answer: 30, choices: [30, 25, 28, 32], rule: 'Subtract 5 each time' },
    { seq: [11, 22, 33, 44], answer: 55, choices: [55, 50, 66, 48], rule: 'Add 11 each time' },
    { seq: [1, 4, 7, 10], answer: 13, choices: [13, 12, 14, 11], rule: 'Add 3 each time' },
    { seq: [3, 9, 27, 81], answer: 243, choices: [243, 162, 108, 200], rule: 'Multiply by 3 each time' },
  ],
  4: [
    { seq: [1, 1, 2, 3, 5], answer: 8, choices: [8, 7, 6, 9], rule: 'Add the two previous numbers (Fibonacci)' },
    { seq: [2, 6, 18, 54], answer: 162, choices: [162, 108, 150, 200], rule: 'Multiply by 3 each time' },
    { seq: [1, 4, 9, 16], answer: 25, choices: [25, 20, 24, 36], rule: 'Square numbers: 1², 2², 3², 4², 5²' },
    { seq: [256, 128, 64, 32], answer: 16, choices: [16, 8, 24, 12], rule: 'Divide by 2 each time' },
    { seq: [2, 3, 5, 7], answer: 11, choices: [11, 9, 10, 13], rule: 'Prime numbers' },
    { seq: [1, 3, 6, 10], answer: 15, choices: [15, 12, 14, 16], rule: 'Triangle numbers: add 2, 3, 4, 5...' },
    { seq: [5, 10, 20, 40], answer: 80, choices: [80, 60, 50, 100], rule: 'Multiply by 2 each time' },
    { seq: [100, 81, 64, 49], answer: 36, choices: [36, 25, 40, 32], rule: 'Square numbers counting down: 10², 9², 8², 7², 6²' },
  ],
  5: [
    { seq: [1, 1, 2, 3, 5, 8], answer: 13, choices: [13, 11, 12, 14], rule: 'Fibonacci: each is sum of previous two' },
    { seq: [1, 4, 9, 16, 25], answer: 36, choices: [36, 30, 35, 49], rule: 'Perfect squares: n²' },
    { seq: [1, 8, 27, 64], answer: 125, choices: [125, 100, 81, 216], rule: 'Perfect cubes: n³' },
    { seq: [2, 3, 5, 7, 11], answer: 13, choices: [13, 12, 14, 15], rule: 'Prime numbers' },
    { seq: [1, 3, 6, 10, 15], answer: 21, choices: [21, 18, 20, 25], rule: 'Triangle numbers' },
    { seq: [2, 6, 12, 20, 30], answer: 42, choices: [42, 36, 40, 48], rule: 'n × (n+1): oblong numbers' },
    { seq: [1024, 512, 256, 128], answer: 64, choices: [64, 32, 96, 48], rule: 'Divide by 2 (powers of 2 descending)' },
    { seq: [0, 1, 1, 2, 3, 5], answer: 8, choices: [8, 7, 6, 9], rule: 'Fibonacci sequence starting at 0' },
  ],
};

function renderPatternPuzzle(content) {
  document.getElementById('puzzle-timer-wrap').classList.remove('hidden');
  State.rocket.patternScore = 0;
  State.rocket.patternTotal = 5;
  State.rocket.patternAnswered = 0;

  let timeLeft = 90;
  document.getElementById('puzzle-timer').textContent = timeLeft;
  document.getElementById('puzzle-timer').className = 'puzzle-timer';

  clearInterval(State.rocket.timerInterval);
  State.rocket.timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('puzzle-timer').textContent = timeLeft;
    if (timeLeft <= 10) document.getElementById('puzzle-timer').className = 'puzzle-timer urgent';
    if (timeLeft <= 0) {
      clearInterval(State.rocket.timerInterval);
      if (State.rocket.patternScore >= 4) {
        rocketSuccess();
      } else {
        rocketFail(`Time's up! You only got ${State.rocket.patternScore}/5 correct.`);
      }
    }
  }, 1000);

  showNextPattern(content);
}

function showNextPattern(content) {
  if (!content) content = document.getElementById('puzzle-content');
  if (State.rocket.patternAnswered >= State.rocket.patternTotal) {
    clearInterval(State.rocket.timerInterval);
    if (State.rocket.patternScore >= 4) rocketSuccess();
    else rocketFail(`You got ${State.rocket.patternScore}/5 correct. You need at least 4!`);
    return;
  }

  const level = State.settings.level;
  const patterns = PATTERNS_BY_LEVEL[level] || PATTERNS_BY_LEVEL[3];
  const pattern = patterns[Math.floor(Math.random() * patterns.length)];
  State.rocket.puzzle.pattern = pattern;

  let html = `<div class="timed-math-score">Score: ${State.rocket.patternScore}/${State.rocket.patternTotal} | Pattern ${State.rocket.patternAnswered + 1} of ${State.rocket.patternTotal}</div>`;
  html += `<div style="text-align:center;padding:10px 0;">`;
  html += `<div style="font-size:18px;font-weight:700;color:#fff;margin-bottom:14px;text-shadow:2px 2px 4px rgba(0,0,0,0.6);">What comes next?</div>`;
  html += `<div class="pattern-display">`;
  pattern.seq.forEach(n => {
    html += `<div class="pattern-item">${n}</div>`;
    html += `<div style="font-size:24px;color:#FFD600;font-weight:700;">→</div>`;
  });
  html += `<div class="pattern-item blank">?</div>`;
  html += `</div>`;
  html += `<div class="pattern-choices" style="margin-top:16px;">`;
  [...pattern.choices].sort(() => Math.random() - 0.5).forEach(c => {
    html += `<button class="btn-choice" style="font-size:24px;padding:16px 28px;" onclick="checkPatternAnswer(${c})">${c}</button>`;
  });
  html += `</div></div>`;
  content.innerHTML = html;
}

window.checkPatternAnswer = function(choice) {
  const pattern = State.rocket.puzzle.pattern;
  if (!pattern) return;
  State.rocket.puzzle.pattern = null;
  State.rocket.patternAnswered++;
  if (choice === pattern.answer) {
    SFX.correct();
    State.rocket.patternScore++;
    if (typeof onAnswerResult === 'function') onAnswerResult(true, { scene: 'rocket', challengeType: 'pattern' });
  } else {
    SFX.wrong();
    if (typeof onAnswerResult === 'function') onAnswerResult(false, { scene: 'rocket', challengeType: 'pattern' });
    notify(`The rule was: ${pattern.rule}`, 'error');
  }
  showNextPattern();
};

// ===== WORD SEARCH (shared renderer — used by Pokemon Center) =====
// Word sets by level with scaling grid size
// Word pools per level — word sets are randomly generated each time
const WS_WORD_POOLS = {
  1: { pool: ['CAT','DOG','SUN','RUN','BIG','RED','HAT','CUP','PIG','BAT','BUS','MAP','PEN','BED','HOP','SIT','MOP','FAN','JAM','WET','HOT','TOP','LOG','MUD','BUG','ANT','HEN','COW','FOX','OWL','FIN','PAW','FUR','EGG','NET','JAR','BOX','DIG','HUG','NAP','ZIP','WAX','YAK','GUM','JOG','DEN','RUG','TUB','VAN','WIG'], count: 3, gridSize: 6 },
  2: { pool: ['FIRE','RAIN','TREE','FISH','BIRD','SWIM','BOOK','PLAY','JUMP','FROG','LAKE','NEST','SEED','WAVE','ROCK','SAND','MOON','STAR','WIND','BEAR','DEER','CRAB','FERN','VINE','CAVE','HILL','BOLT','GLOW','POKE','BALL','HEAL','RING','BELL','DRUM','LEAF','BARK','POND','SURF','DIVE','SING','PUFF','CLAM','TAIL','CLAW','HORN','WING','BEAM','MIST','HAZE','GUST'], count: 3, gridSize: 6 },
  3: { pool: ['WATER','GRASS','STONE','FLAME','LIGHT','EARTH','CLOUD','STORM','TRAIN','BADGE','POWER','CATCH','OCEAN','RIVER','MOUNT','PLANT','SPEED','GHOST','FAIRY','STEEL','MOUSE','SNAKE','SHELL','BERRY','ROUTE','TOWER','QUEST','SKILL','SPARK','FROST','SLEEP','CHARM','FLARE','SWIFT','BRAVE','SHARP','TOUGH','ROUND','TOXIC','SUNNY','EMBER','SLASH','POUND','GROWL','GUARD','FOCUS','PUNCH','PULSE','RAPID','BLADE'], count: 4, gridSize: 8 },
  4: { pool: ['BATTLE','ENERGY','SHIELD','STRIKE','DRAGON','SPIRIT','MASTER','FLYING','ATTACK','DEFEND','EVOLVE','ABSORB','POISON','GROUND','NORMAL','SAFARI','TUNNEL','BRIDGE','ISLAND','CANYON','FOREST','FROZEN','ROCKET','LEADER','SWITCH','SPLASH','TACKLE','POISON','VORTEX','RIPPLE','FLURRY','QUARTZ','BREEZE','MAGNET','SHADOW','MIRROR','RESCUE','PATROL','RANGER','TRAVEL','MYTHIC','LEGEND','DIVINE','TROPHY','HARBOR','METEOR','STREAM','MEADOW','SUMMIT','TEMPLE'], count: 4, gridSize: 8 },
  5: { pool: ['POKEMON','THUNDER','PSYCHIC','TRAINER','PIKACHU','MONSTER','ELEMENT','SPECIAL','PROTECT','ANCIENT','VOLCANO','ELECTRIC','FIGHTER','BOULDER','CASCADE','RAINBOW','POKEDEX','CAPTURE','DIAMOND','CRYSTAL','MYSTERY','JOURNEY','DESTINY','COURAGE','BALANCE','RESOLVE','WILDFIRE','BLIZZARD','CURRENT','CYCLONE','GRANITE','TITANIUM','SCARLET','CRIMSON','EMERALD','SAPPHIRE','CIRCUIT','HARMONY','PHOENIX','ECLIPSE','GLACIER','TORNADO','LEAFEON','FLAREON','VAPOREO','JOLTEON','ESPEON','UMBREON','EEVEE','SNORLAX'], count: 4, gridSize: 10 },
};

// Dynamically generate a word set by picking random words from the pool
function generateWordSet(level) {
  const config = WS_WORD_POOLS[level] || WS_WORD_POOLS[3];
  const pool = [...config.pool];
  const words = [];
  const count = config.count;
  while (words.length < count && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length);
    words.push(pool.splice(idx, 1)[0]);
  }
  return { words, gridSize: config.gridSize };
}

// Legacy accessor — returns array with one dynamically generated set
const WS_WORDS_BY_LEVEL = new Proxy({}, {
  get(_, level) {
    const lvl = parseInt(level);
    if (lvl >= 1 && lvl <= 5) return [generateWordSet(lvl)];
    return [generateWordSet(3)];
  }
});

// Shared word search state — used by both rocket (legacy) and pokecenter
const WordSearchState = {
  grid: null,
  words: null,
  positions: null,
  found: [],
  dragStart: null,
  dragEnd: null,
  dragCells: [],
  gridSize: 8,
  onComplete: null, // callback when all words found
};

function renderWordSearchPuzzle(content, opts) {
  opts = opts || {};
  const level = State.settings.level;
  const wordSets = WS_WORDS_BY_LEVEL[level] || WS_WORDS_BY_LEVEL[3];
  const wordSet = wordSets[Math.floor(Math.random() * wordSets.length)];
  const SIZE = wordSet.gridSize;

  WordSearchState.words = wordSet.words;
  WordSearchState.found = [];
  WordSearchState.dragStart = null;
  WordSearchState.dragEnd = null;
  WordSearchState.dragCells = [];
  WordSearchState.gridSize = SIZE;
  WordSearchState.onComplete = opts.onComplete || null;

  const grid = Array.from({length: SIZE}, () => Array(SIZE).fill(''));

  // Place words (horizontal, vertical, diagonal)
  const dirs = [[0,1],[1,0],[1,1],[1,-1]]; // right, down, diag-down-right, diag-down-left
  function placeWord(word) {
    for (let attempt = 0; attempt < 100; attempt++) {
      const dir = dirs[Math.floor(Math.random() * dirs.length)];
      const startR = Math.floor(Math.random() * SIZE);
      const startC = Math.floor(Math.random() * SIZE);
      // Check bounds
      const endR = startR + dir[0] * (word.length - 1);
      const endC = startC + dir[1] * (word.length - 1);
      if (endR < 0 || endR >= SIZE || endC < 0 || endC >= SIZE) continue;
      let fits = true;
      for (let i = 0; i < word.length; i++) {
        const nr = startR + dir[0]*i, nc = startC + dir[1]*i;
        if (grid[nr][nc] !== '' && grid[nr][nc] !== word[i]) { fits = false; break; }
      }
      if (fits) {
        for (let i = 0; i < word.length; i++) grid[startR + dir[0]*i][startC + dir[1]*i] = word[i];
        return { r: startR, c: startC, dir };
      }
    }
    return null;
  }

  const wordPositions = {};
  const placedWords = [];
  wordSet.words.forEach(w => { const p = placeWord(w); if(p) { wordPositions[w] = p; placedWords.push(w); } });
  wordSet.words = placedWords;

  // Fill empty cells
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
    if (!grid[r][c]) grid[r][c] = letters[Math.floor(Math.random() * letters.length)];
  }

  WordSearchState.grid = grid;
  WordSearchState.positions = wordPositions;

  const cellPx = SIZE <= 6 ? 44 : SIZE <= 8 ? 38 : 32;

  let html = `<div style="text-align:center;">`;
  html += `<div style="font-size:18px;font-weight:700;color:#fff;margin-bottom:10px;text-shadow:2px 2px 4px rgba(0,0,0,0.6);">Find all ${wordSet.words.length} hidden words!</div>`;
  html += `<div class="word-search-words">`;
  wordSet.words.forEach(w => html += `<span class="ws-word" id="ws-word-${w}">${w}</span>`);
  html += `</div>`;
  html += `<div style="overflow-x:auto;"><div class="word-search-grid" id="ws-grid" style="grid-template-columns:repeat(${SIZE},${cellPx}px);touch-action:none;user-select:none;-webkit-user-select:none;">`;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      html += `<div class="ws-cell" data-r="${r}" data-c="${c}" style="width:${cellPx}px;height:${cellPx}px;font-size:${cellPx > 36 ? 18 : 14}px;">${grid[r][c]}</div>`;
    }
  }
  html += `</div></div>`;
  html += `<div style="font-size:13px;color:rgba(255,255,255,0.6);margin-top:6px;">Drag across letters to select a word</div>`;
  html += `<div id="ws-found" style="margin-top:10px;color:#FFD600;font-weight:700;font-size:18px;">Found: 0/${wordSet.words.length}</div>`;
  html += `</div>`;
  content.innerHTML = html;

  // Attach drag-to-select listeners
  setupWordSearchDrag();
}

// ===== DRAG-TO-SELECT =====
function setupWordSearchDrag() {
  const gridEl = document.getElementById('ws-grid');
  if (!gridEl) return;

  function getCellFromEvent(e) {
    const touch = e.touches ? e.touches[0] : e;
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    if (el && el.classList.contains('ws-cell')) {
      return { r: parseInt(el.dataset.r), c: parseInt(el.dataset.c), el };
    }
    return null;
  }

  function getLineCells(start, end) {
    if (!start || !end) return [];
    const dr = end.r - start.r;
    const dc = end.c - start.c;
    const len = Math.max(Math.abs(dr), Math.abs(dc));
    if (len === 0) return [{ r: start.r, c: start.c }];
    // Must be in one of 8 cardinal directions
    const stepR = dr === 0 ? 0 : dr / Math.abs(dr);
    const stepC = dc === 0 ? 0 : dc / Math.abs(dc);
    // Verify it's a valid line (straight in 8 directions)
    if (Math.abs(dr) !== Math.abs(dc) && dr !== 0 && dc !== 0) return [];
    const cells = [];
    for (let i = 0; i <= len; i++) {
      cells.push({ r: start.r + stepR * i, c: start.c + stepC * i });
    }
    return cells;
  }

  function highlightDrag(cells) {
    // Clear previous drag highlights
    gridEl.querySelectorAll('.ws-cell.dragging').forEach(el => el.classList.remove('dragging'));
    cells.forEach(({ r, c }) => {
      const cell = gridEl.querySelector(`.ws-cell[data-r="${r}"][data-c="${c}"]`);
      if (cell) cell.classList.add('dragging');
    });
  }

  function clearDragHighlight() {
    gridEl.querySelectorAll('.ws-cell.dragging').forEach(el => el.classList.remove('dragging'));
  }

  function checkDragSelection(cells) {
    if (cells.length === 0) return;
    const grid = WordSearchState.grid;
    const selectedStr = cells.map(({ r, c }) => grid[r][c]).join('');
    const reversedStr = selectedStr.split('').reverse().join('');

    for (const word of WordSearchState.words) {
      if (WordSearchState.found.includes(word)) continue;
      if (selectedStr === word || reversedStr === word) {
        SFX.correct();
        WordSearchState.found.push(word);
        cells.forEach(({ r, c }) => {
          const cell = gridEl.querySelector(`.ws-cell[data-r="${r}"][data-c="${c}"]`);
          if (cell) { cell.classList.remove('dragging'); cell.classList.add('found'); }
        });
        const wordEl = document.getElementById(`ws-word-${word}`);
        if (wordEl) wordEl.classList.add('found');
        const foundEl = document.getElementById('ws-found');
        if (foundEl) foundEl.textContent = `Found: ${WordSearchState.found.length}/${WordSearchState.words.length}`;

        if (WordSearchState.found.length === WordSearchState.words.length) {
          if (WordSearchState.onComplete) {
            setTimeout(() => WordSearchState.onComplete(), 800);
          } else {
            setTimeout(() => rocketSuccess(), 800);
          }
        }
        return;
      }
    }
    // No match — clear
    clearDragHighlight();
  }

  // Mouse events
  gridEl.addEventListener('mousedown', (e) => {
    e.preventDefault();
    const cell = getCellFromEvent(e);
    if (cell) {
      WordSearchState.dragStart = { r: cell.r, c: cell.c };
      WordSearchState.dragCells = [{ r: cell.r, c: cell.c }];
      highlightDrag(WordSearchState.dragCells);
    }
  });

  gridEl.addEventListener('mousemove', (e) => {
    if (!WordSearchState.dragStart) return;
    e.preventDefault();
    const cell = getCellFromEvent(e);
    if (cell) {
      WordSearchState.dragEnd = { r: cell.r, c: cell.c };
      const cells = getLineCells(WordSearchState.dragStart, WordSearchState.dragEnd);
      WordSearchState.dragCells = cells;
      highlightDrag(cells);
    }
  });

  gridEl.addEventListener('mouseup', (e) => {
    if (!WordSearchState.dragStart) return;
    checkDragSelection(WordSearchState.dragCells);
    clearDragHighlight();
    WordSearchState.dragStart = null;
    WordSearchState.dragEnd = null;
    WordSearchState.dragCells = [];
  });

  gridEl.addEventListener('mouseleave', () => {
    if (WordSearchState.dragStart) {
      checkDragSelection(WordSearchState.dragCells);
      clearDragHighlight();
      WordSearchState.dragStart = null;
      WordSearchState.dragEnd = null;
      WordSearchState.dragCells = [];
    }
  });

  // Touch events
  gridEl.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const cell = getCellFromEvent(e);
    if (cell) {
      WordSearchState.dragStart = { r: cell.r, c: cell.c };
      WordSearchState.dragCells = [{ r: cell.r, c: cell.c }];
      highlightDrag(WordSearchState.dragCells);
    }
  }, { passive: false });

  gridEl.addEventListener('touchmove', (e) => {
    if (!WordSearchState.dragStart) return;
    e.preventDefault();
    const cell = getCellFromEvent(e);
    if (cell) {
      WordSearchState.dragEnd = { r: cell.r, c: cell.c };
      const cells = getLineCells(WordSearchState.dragStart, WordSearchState.dragEnd);
      WordSearchState.dragCells = cells;
      highlightDrag(cells);
    }
  }, { passive: false });

  gridEl.addEventListener('touchend', (e) => {
    if (!WordSearchState.dragStart) return;
    e.preventDefault();
    checkDragSelection(WordSearchState.dragCells);
    clearDragHighlight();
    WordSearchState.dragStart = null;
    WordSearchState.dragEnd = null;
    WordSearchState.dragCells = [];
  });
}

// ===== SENTENCES BY LEVEL =====
const SENTENCES_BY_LEVEL = {
  1: [
    { words: ['I', 'see', 'you.'], answer: 'I see you.' },
    { words: ['The', 'cat', 'ran.'], answer: 'The cat ran.' },
    { words: ['I', 'am', 'big.'], answer: 'I am big.' },
    { words: ['Go', 'to', 'bed.'], answer: 'Go to bed.' },
    { words: ['It', 'is', 'fun!'], answer: 'It is fun!' },
    { words: ['I', 'can', 'run.'], answer: 'I can run.' },
  ],
  2: [
    { words: ['The', 'sun', 'is', 'hot.'], answer: 'The sun is hot.' },
    { words: ['I', 'like', 'to', 'play.'], answer: 'I like to play.' },
    { words: ['She', 'has', 'a', 'cat.'], answer: 'She has a cat.' },
    { words: ['We', 'can', 'go', 'now.'], answer: 'We can go now.' },
    { words: ['He', 'is', 'my', 'friend.'], answer: 'He is my friend.' },
    { words: ['I', 'love', 'my', 'dog.'], answer: 'I love my dog.' },
  ],
  3: [
    { words: ['The', 'cat', 'sat', 'on', 'the', 'mat.'], answer: 'The cat sat on the mat.' },
    { words: ['I', 'love', 'to', 'play', 'outside!'], answer: 'I love to play outside!' },
    { words: ['The', 'sun', 'is', 'very', 'bright.'], answer: 'The sun is very bright.' },
    { words: ['Pokémon', 'are', 'amazing', 'creatures!'], answer: 'Pokémon are amazing creatures!' },
    { words: ['I', 'want', 'to', 'catch', 'them', 'all!'], answer: 'I want to catch them all!' },
    { words: ['She', 'reads', 'books', 'every', 'day.'], answer: 'She reads books every day.' },
    { words: ['The', 'dog', 'chased', 'the', 'ball.'], answer: 'The dog chased the ball.' },
  ],
  4: [
    { words: ['My', 'favorite', 'Pokémon', 'is', 'very', 'strong', 'today.'], answer: 'My favorite Pokémon is very strong today.' },
    { words: ['The', 'trainer', 'walked', 'through', 'the', 'tall', 'grass.'], answer: 'The trainer walked through the tall grass.' },
    { words: ['We', 'need', 'to', 'stop', 'Team', 'Rocket', 'now!'], answer: 'We need to stop Team Rocket now!' },
    { words: ['She', 'caught', 'three', 'new', 'Pokémon', 'this', 'week.'], answer: 'She caught three new Pokémon this week.' },
    { words: ['The', 'gym', 'leader', 'was', 'harder', 'than', 'expected.'], answer: 'The gym leader was harder than expected.' },
    { words: ['Water', 'moves', 'are', 'super', 'effective', 'against', 'fire.'], answer: 'Water moves are super effective against fire.' },
  ],
  5: [
    { words: ['Although', 'it', 'was', 'raining,', 'the', 'trainer', 'kept', 'searching.'], answer: 'Although it was raining, the trainer kept searching.' },
    { words: ['The', 'legendary', 'Pokémon', 'is', 'extremely', 'rare', 'and', 'powerful.'], answer: 'The legendary Pokémon is extremely rare and powerful.' },
    { words: ['Before', 'you', 'challenge', 'the', 'gym,', 'heal', 'your', 'team.'], answer: 'Before you challenge the gym, heal your team.' },
    { words: ['Electric', 'types', 'have', 'an', 'advantage', 'over', 'water', 'types.'], answer: 'Electric types have an advantage over water types.' },
    { words: ['She', 'trained', 'every', 'day', 'until', 'her', 'team', 'was', 'ready.'], answer: 'She trained every day until her team was ready.' },
    { words: ['After', 'winning', 'eight', 'badges,', 'you', 'face', 'the', 'Elite', 'Four.'], answer: 'After winning eight badges, you face the Elite Four.' },
    { words: ['The', 'professor', 'discovered', 'that', 'Pokémon', 'can', 'learn', 'new', 'moves.'], answer: 'The professor discovered that Pokémon can learn new moves.' },
  ],
};

function renderSentencePuzzle(content) {
  const level = State.settings.level;
  const sentences = SENTENCES_BY_LEVEL[level] || SENTENCES_BY_LEVEL[3];
  const sent = sentences[Math.floor(Math.random() * sentences.length)];
  State.rocket.puzzle.sentence = sent;
  State.rocket.sentencePlaced = [];
  const shuffled = [...sent.words].sort(() => Math.random() - 0.5);

  let html = `<div style="text-align:center;padding:10px 0;">`;
  html += `<div style="font-size:20px;font-weight:700;color:#fff;margin-bottom:14px;text-shadow:2px 2px 4px rgba(0,0,0,0.6);">Put the words in the correct order!</div>`;
  html += `<div class="sentence-slot" id="sentence-slot">`;
  html += `<span style="color:#aaa;font-size:16px;">Click words below to add them here...</span>`;
  html += `</div>`;
  html += `<div class="sentence-words" id="sentence-words">`;
  shuffled.forEach((w, i) => {
    html += `<div class="sentence-word" id="sw-${i}" data-word="${w}" data-idx="${i}" onclick="placeSentenceWord(${i})">${w}</div>`;
  });
  html += `</div>`;
  html += `<button class="btn-primary btn-blue" style="margin-top:14px" onclick="checkSentenceOrder()">Check Sentence!</button>`;
  html += `<button class="btn-back" style="margin-left:10px;margin-top:14px" onclick="clearSentence()">Clear</button>`;
  html += `</div>`;
  content.innerHTML = html;
}

window.placeSentenceWord = function(idx) {
  SFX.click();
  const el = document.getElementById(`sw-${idx}`);
  if (!el || el.classList.contains('placed')) return;
  el.classList.add('placed');
  State.rocket.sentencePlaced.push({ word: el.dataset.word, idx });
  updateSentenceSlot();
};

window.clearSentence = function() {
  State.rocket.sentencePlaced = [];
  document.querySelectorAll('.sentence-word').forEach(el => el.classList.remove('placed','correct'));
  updateSentenceSlot();
};

function updateSentenceSlot() {
  const slot = document.getElementById('sentence-slot');
  if (!slot) return;
  if (State.rocket.sentencePlaced.length === 0) {
    slot.innerHTML = `<span style="color:#aaa;font-size:16px;">Click words below to add them here...</span>`;
    return;
  }
  slot.innerHTML = State.rocket.sentencePlaced.map((p,i) =>
    `<div class="sentence-word placed" onclick="removeSentenceWord(${i})">${p.word}</div>`
  ).join('');
}

window.removeSentenceWord = function(placedIdx) {
  SFX.click();
  const item = State.rocket.sentencePlaced[placedIdx];
  State.rocket.sentencePlaced.splice(placedIdx, 1);
  const el = document.getElementById(`sw-${item.idx}`);
  if (el) el.classList.remove('placed');
  updateSentenceSlot();
};

window.checkSentenceOrder = function() {
  const sent = State.rocket.puzzle.sentence;
  const placed = State.rocket.sentencePlaced.map(p => p.word).join(' ');
  if (placed === sent.answer) {
    SFX.correct();
    if (typeof onAnswerResult === 'function') onAnswerResult(true, { scene: 'rocket', challengeType: 'sentence' });
    document.querySelectorAll('.sentence-word.placed').forEach(el => el.classList.add('correct'));
    setTimeout(() => rocketSuccess(), 800);
  } else {
    SFX.wrong();
    if (typeof onAnswerResult === 'function') onAnswerResult(false, { scene: 'rocket', challengeType: 'sentence' });
    notify(`Not quite right! The correct order is: "${sent.answer}"`, 'error');
    clearSentence();
  }
};

// Timed math puzzle
function renderTimedMathPuzzle(content) {
  document.getElementById('puzzle-timer-wrap').classList.remove('hidden');
  State.rocket.timedScore = 0;
  State.rocket.timedTotal = 5;
  State.rocket.timedAnswered = 0;

  let timeLeft = 60;
  document.getElementById('puzzle-timer').textContent = timeLeft;
  document.getElementById('puzzle-timer').className = 'puzzle-timer';

  clearInterval(State.rocket.timerInterval);
  State.rocket.timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('puzzle-timer').textContent = timeLeft;
    if (timeLeft <= 10) document.getElementById('puzzle-timer').className = 'puzzle-timer urgent';
    if (timeLeft <= 0) {
      clearInterval(State.rocket.timerInterval);
      if (State.rocket.timedScore >= 4) {
        rocketSuccess();
      } else {
        rocketFail(`Time's up! You only got ${State.rocket.timedScore}/5 correct.`);
      }
    }
  }, 1000);

  showNextTimedMath(content);
}

function showNextTimedMath(content) {
  if (!content) content = document.getElementById('puzzle-content');
  if (State.rocket.timedAnswered >= State.rocket.timedTotal) {
    clearInterval(State.rocket.timerInterval);
    if (State.rocket.timedScore >= 4) rocketSuccess();
    else rocketFail(`You got ${State.rocket.timedScore}/5 correct. You need at least 4!`);
    return;
  }

  const ch = genMathQuestion(State.settings.level + 1);
  State.rocket.timedCurrent = ch;

  let html = `<div class="timed-math-score">Score: ${State.rocket.timedScore}/${State.rocket.timedTotal} | Question ${State.rocket.timedAnswered + 1} of ${State.rocket.timedTotal}</div>`;
  html += `<div class="timed-math-problem">`;
  html += `<div class="timed-math-q">${ch.question}</div>`;
  html += `<div class="timed-math-choices">`;
  ch.choices.forEach(c => {
    html += `<button class="btn-choice" style="font-size:22px;min-width:80px;padding:14px;" onclick="answerTimedMath(${c})">${c}</button>`;
  });
  html += `</div></div>`;
  content.innerHTML = html;
}

window.answerTimedMath = function(choice) {
  try {
    const ch = State.rocket.timedCurrent;
    if (!ch) return;
    // Prevent double-clicks by clearing current immediately
    State.rocket.timedCurrent = null;
    State.rocket.timedAnswered++;
    if (Number(choice) === Number(ch.answer)) {
      SFX.correct();
      State.rocket.timedScore++;
      if (typeof onAnswerResult === 'function') onAnswerResult(true, { scene: 'rocket', challengeType: 'timedMath' });
    } else {
      SFX.wrong();
      if (typeof onAnswerResult === 'function') onAnswerResult(false, { scene: 'rocket', challengeType: 'timedMath' });
    }
    showNextTimedMath();
  } catch(e) {
    console.error('answerTimedMath error:', e);
    showNextTimedMath();
  }
};

function rocketSuccess() {
  clearInterval(State.rocket.timerInterval);
  SFX.caught();
  launchConfetti();
  addXp(75);

  // Reward: chance to catch a rare pokemon
  const uncaught = POKEMON_DB.filter(p => !State.caught.includes(p.id));
  let rewardPokemon = null;
  if (uncaught.length > 0 && Math.random() > 0.3) {
    rewardPokemon = uncaught[Math.floor(Math.random() * uncaught.length)];
    State.caught.push(rewardPokemon.id);
    initPokemonHp(rewardPokemon.id);
    updateTrainerBar();
  }

  document.getElementById('rocket-puzzle').classList.add('hidden');
  document.getElementById('rocket-intro').classList.add('hidden');
  const result = document.getElementById('rocket-result');
  result.classList.remove('hidden');
  result.style.background = 'rgba(0,0,0,0.5)';
  result.innerHTML = `
    <div style="font-size:40px;font-weight:700;color:#FFD600;text-shadow:3px 3px 0 rgba(0,0,0,0.4);">🎉 Team Rocket Blasts Off!</div>
    <div style="font-size:60px">🚀💨⭐</div>
    <div style="font-size:18px;color:rgba(255,255,255,0.9);max-width:360px;">
      Jessie: "We're blasting off again!"<br>James: "Next time, little trainer..."
    </div>
    ${rewardPokemon ? `
      <div style="background:rgba(255,255,255,0.9);border-radius:16px;padding:16px 24px;margin-top:10px;text-align:center;">
        <div style="font-size:18px;font-weight:700;color:#1565C0;">Bonus! You rescued a Pokémon! 🎉</div>
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${rewardPokemon.id}.png"
          style="width:80px;height:80px;image-rendering:pixelated;" alt="${rewardPokemon.name}">
        <div style="font-size:20px;font-weight:700;color:#212121;">${rewardPokemon.name} added to your Pokédex!</div>
      </div>
    ` : ''}
    <button class="btn-primary btn-xl" style="margin-top:20px" onclick="Game.goToMap()">Back to Town</button>
  `;
}

function rocketFail(message) {
  clearInterval(State.rocket.timerInterval);
  SFX.wrong();
  document.getElementById('rocket-puzzle').classList.add('hidden');
  const result = document.getElementById('rocket-result');
  result.classList.remove('hidden');
  result.style.background = 'rgba(0,0,0,0.5)';
  result.innerHTML = `
    <div style="font-size:36px;font-weight:700;color:#FF6B35;text-shadow:2px 2px 4px rgba(0,0,0,0.6);">Team Rocket Escaped!</div>
    <div style="font-size:60px">😤</div>
    <div style="font-size:18px;color:rgba(255,255,255,0.9);max-width:360px;">Jessie: "Ha! We'll be back!"<br>${message}</div>
    <button class="btn-primary btn-xl" style="margin-top:20px" onclick="Game.goToRocket()">Try Again!</button>
    <button class="btn-back" style="margin-top:10px" onclick="Game.goToMap()">Back to Town</button>
  `;
}
