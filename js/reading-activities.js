// =============================================================================
// READING-ACTIVITIES.JS — New Structured Reading Curriculum
// Based on STELLAR, Logic of English, All About Reading, DISTAR, OG/Wilson
// Loaded after activities.js — uses shuffleArray, randItem, randItems, buildChoices
// =============================================================================

// ---------------------------------------------------------------------------
// DATA POOLS
// ---------------------------------------------------------------------------

const SOUND_SPOTTER_WORDS = [
  { word: 'cat', sounds: '/k/ /a/ /t/', emoji: '🐱' },
  { word: 'bat', sounds: '/b/ /a/ /t/', emoji: '🦇' },
  { word: 'hat', sounds: '/h/ /a/ /t/', emoji: '🎩' },
  { word: 'bag', sounds: '/b/ /a/ /g/', emoji: '🎒' },
  { word: 'fan', sounds: '/f/ /a/ /n/', emoji: '🌀' },
  { word: 'map', sounds: '/m/ /a/ /p/', emoji: '🗺️' },
  { word: 'jam', sounds: '/j/ /a/ /m/', emoji: '🫙' },
  { word: 'van', sounds: '/v/ /a/ /n/', emoji: '🚐' },
  { word: 'cap', sounds: '/k/ /a/ /p/', emoji: '🧢' },
  { word: 'tap', sounds: '/t/ /a/ /p/', emoji: '🚰' },
  { word: 'bed', sounds: '/b/ /e/ /d/', emoji: '🛏️' },
  { word: 'pen', sounds: '/p/ /e/ /n/', emoji: '🖊️' },
  { word: 'web', sounds: '/w/ /e/ /b/', emoji: '🕸️' },
  { word: 'hen', sounds: '/h/ /e/ /n/', emoji: '🐔' },
  { word: 'net', sounds: '/n/ /e/ /t/', emoji: '🥅' },
  { word: 'jet', sounds: '/j/ /e/ /t/', emoji: '✈️' },
  { word: 'leg', sounds: '/l/ /e/ /g/', emoji: '🦵' },
  { word: 'red', sounds: '/r/ /e/ /d/', emoji: '🔴' },
  { word: 'pig', sounds: '/p/ /i/ /g/', emoji: '🐷' },
  { word: 'lip', sounds: '/l/ /i/ /p/', emoji: '👄' },
  { word: 'fin', sounds: '/f/ /i/ /n/', emoji: '🦈' },
  { word: 'pin', sounds: '/p/ /i/ /n/', emoji: '📌' },
  { word: 'zip', sounds: '/z/ /i/ /p/', emoji: '🤐' },
  { word: 'dig', sounds: '/d/ /i/ /g/', emoji: '⛏️' },
  { word: 'hit', sounds: '/h/ /i/ /t/', emoji: '💥' },
  { word: 'dog', sounds: '/d/ /o/ /g/', emoji: '🐶' },
  { word: 'log', sounds: '/l/ /o/ /g/', emoji: '🪵' },
  { word: 'box', sounds: '/b/ /o/ /ks/', emoji: '📦' },
  { word: 'mop', sounds: '/m/ /o/ /p/', emoji: '🧹' },
  { word: 'pot', sounds: '/p/ /o/ /t/', emoji: '🍯' },
  { word: 'fox', sounds: '/f/ /o/ /ks/', emoji: '🦊' },
  { word: 'hop', sounds: '/h/ /o/ /p/', emoji: '🐰' },
  { word: 'sun', sounds: '/s/ /u/ /n/', emoji: '☀️' },
  { word: 'cup', sounds: '/k/ /u/ /p/', emoji: '🥤' },
  { word: 'bug', sounds: '/b/ /u/ /g/', emoji: '🐛' },
  { word: 'rug', sounds: '/r/ /u/ /g/', emoji: '🧶' },
  { word: 'bus', sounds: '/b/ /u/ /s/', emoji: '🚌' },
  { word: 'tub', sounds: '/t/ /u/ /b/', emoji: '🛁' },
  { word: 'hug', sounds: '/h/ /u/ /g/', emoji: '🤗' },
  { word: 'gum', sounds: '/g/ /u/ /m/', emoji: '🫧' },
  { word: 'jug', sounds: '/j/ /u/ /g/', emoji: '🫗' },
  { word: 'mud', sounds: '/m/ /u/ /d/', emoji: '🟤' },
];

const RHYME_FAMILIES = [
  { family: '-at', words: ['cat', 'bat', 'hat', 'mat', 'rat', 'sat', 'fat', 'pat', 'flat'] },
  { family: '-an', words: ['can', 'fan', 'man', 'pan', 'ran', 'van', 'tan', 'ban', 'plan'] },
  { family: '-ag', words: ['bag', 'tag', 'rag', 'flag', 'wag', 'drag', 'nag'] },
  { family: '-ap', words: ['cap', 'map', 'tap', 'nap', 'lap', 'gap', 'clap', 'snap', 'trap'] },
  { family: '-ig', words: ['big', 'dig', 'fig', 'pig', 'wig', 'jig', 'twig'] },
  { family: '-in', words: ['bin', 'fin', 'pin', 'win', 'tin', 'thin', 'grin', 'spin'] },
  { family: '-ip', words: ['dip', 'hip', 'lip', 'rip', 'sip', 'tip', 'zip', 'chip', 'drip', 'flip', 'grip', 'ship', 'skip', 'slip', 'trip', 'whip'] },
  { family: '-it', words: ['bit', 'fit', 'hit', 'kit', 'lit', 'pit', 'sit', 'wit', 'knit', 'spit', 'split'] },
  { family: '-og', words: ['dog', 'fog', 'hog', 'jog', 'log', 'frog', 'blog'] },
  { family: '-op', words: ['cop', 'hop', 'mop', 'pop', 'top', 'chop', 'crop', 'drop', 'flop', 'shop', 'stop'] },
  { family: '-ot', words: ['cot', 'dot', 'got', 'hot', 'lot', 'not', 'pot', 'rot', 'knot', 'shot', 'spot'] },
  { family: '-ug', words: ['bug', 'dug', 'hug', 'jug', 'mug', 'rug', 'tug', 'drug', 'plug', 'slug', 'snug'] },
  { family: '-un', words: ['bun', 'fun', 'gun', 'nun', 'pun', 'run', 'sun', 'spun', 'stun'] },
  { family: '-ut', words: ['but', 'cut', 'gut', 'hut', 'nut', 'put', 'rut', 'shut', 'strut'] },
  { family: '-ed', words: ['bed', 'fed', 'led', 'red', 'wed', 'shed', 'sled', 'bred', 'shred', 'spread'] },
  { family: '-en', words: ['den', 'hen', 'men', 'pen', 'ten', 'then', 'when', 'wren'] },
];

const LETTER_SOUND_ITEMS = {
  a: [{ emoji: '🍎', word: 'apple' }, { emoji: '🐜', word: 'ant' }, { emoji: '🐊', word: 'alligator' }],
  b: [{ emoji: '🐝', word: 'bee' }, { emoji: '🐻', word: 'bear' }, { emoji: '🦋', word: 'butterfly' }],
  c: [{ emoji: '🐱', word: 'cat' }, { emoji: '🐄', word: 'cow' }, { emoji: '🧁', word: 'cupcake' }],
  d: [{ emoji: '🐬', word: 'dolphin' }, { emoji: '🦆', word: 'duck' }, { emoji: '🐕', word: 'dog' }],
  e: [{ emoji: '🥚', word: 'egg' }, { emoji: '🐘', word: 'elephant' }, { emoji: '👁️', word: 'eye' }],
  f: [{ emoji: '🐟', word: 'fish' }, { emoji: '🦊', word: 'fox' }, { emoji: '🐸', word: 'frog' }],
  g: [{ emoji: '🦒', word: 'giraffe' }, { emoji: '🐐', word: 'goat' }, { emoji: '🍇', word: 'grapes' }],
  h: [{ emoji: '🐎', word: 'horse' }, { emoji: '🏠', word: 'house' }, { emoji: '🎩', word: 'hat' }],
  i: [{ emoji: '🧊', word: 'ice' }, { emoji: '🍦', word: 'ice cream' }, { emoji: '🦎', word: 'iguana' }],
  j: [{ emoji: '🧃', word: 'juice' }, { emoji: '🃏', word: 'joker' }, { emoji: '🧩', word: 'jigsaw' }],
  k: [{ emoji: '🪁', word: 'kite' }, { emoji: '👑', word: 'king' }, { emoji: '🦘', word: 'kangaroo' }],
  l: [{ emoji: '🦁', word: 'lion' }, { emoji: '🍋', word: 'lemon' }, { emoji: '🐞', word: 'ladybug' }],
  m: [{ emoji: '🐵', word: 'monkey' }, { emoji: '🌙', word: 'moon' }, { emoji: '🍄', word: 'mushroom' }],
  n: [{ emoji: '🥜', word: 'nut' }, { emoji: '📰', word: 'newspaper' }, { emoji: '🥷', word: 'ninja' }],
  o: [{ emoji: '🐙', word: 'octopus' }, { emoji: '🍊', word: 'orange' }, { emoji: '🦉', word: 'owl' }],
  p: [{ emoji: '🐧', word: 'penguin' }, { emoji: '🐼', word: 'panda' }, { emoji: '🍕', word: 'pizza' }],
  q: [{ emoji: '👸', word: 'queen' }, { emoji: '❓', word: 'question' }, { emoji: '🦆', word: 'quack' }],
  r: [{ emoji: '🐇', word: 'rabbit' }, { emoji: '🌈', word: 'rainbow' }, { emoji: '🚀', word: 'rocket' }],
  s: [{ emoji: '⭐', word: 'star' }, { emoji: '🐍', word: 'snake' }, { emoji: '☀️', word: 'sun' }],
  t: [{ emoji: '🐯', word: 'tiger' }, { emoji: '🐢', word: 'turtle' }, { emoji: '🌳', word: 'tree' }],
  u: [{ emoji: '☂️', word: 'umbrella' }, { emoji: '🦄', word: 'unicorn' }, { emoji: '⬆️', word: 'up' }],
  v: [{ emoji: '🏐', word: 'volleyball' }, { emoji: '🎻', word: 'violin' }, { emoji: '🌋', word: 'volcano' }],
  w: [{ emoji: '🐋', word: 'whale' }, { emoji: '🐺', word: 'wolf' }, { emoji: '🪱', word: 'worm' }],
  x: [{ emoji: '🎸', word: 'xylophone' }, { emoji: '❌', word: 'x-ray' }, { emoji: '🧰', word: 'x-box' }],
  y: [{ emoji: '🧶', word: 'yarn' }, { emoji: '💛', word: 'yellow' }, { emoji: '🪀', word: 'yo-yo' }],
  z: [{ emoji: '🦓', word: 'zebra' }, { emoji: '⚡', word: 'zap' }, { emoji: '🧟', word: 'zombie' }],
};

const DIGRAPH_WORDS = {
  'SH': ['ship', 'shop', 'shed', 'shin', 'shut', 'shell', 'shelf', 'shark', 'sheep', 'shout'],
  'TH': ['this', 'that', 'them', 'then', 'thin', 'thick', 'think', 'three', 'throw', 'thumb'],
  'CH': ['chip', 'chop', 'chat', 'chin', 'chest', 'check', 'chess', 'chain', 'chair', 'chase'],
  'CK': ['back', 'deck', 'kick', 'lock', 'duck', 'pack', 'pick', 'rock', 'sick', 'tack'],
  'WH': ['when', 'what', 'whip', 'whiz', 'whale', 'wheat', 'wheel', 'where', 'white', 'while'],
};

const CCVC_WORDS = [
  { word: 'stop', emoji: '🛑' }, { word: 'frog', emoji: '🐸' }, { word: 'crab', emoji: '🦀' },
  { word: 'drum', emoji: '🥁' }, { word: 'flag', emoji: '🏁' }, { word: 'grab', emoji: '🤏' },
  { word: 'grip', emoji: '✊' }, { word: 'plan', emoji: '📋' }, { word: 'plum', emoji: '🫐' },
  { word: 'plug', emoji: '🔌' }, { word: 'slim', emoji: '🧍' }, { word: 'snap', emoji: '🫰' },
  { word: 'spin', emoji: '🔄' }, { word: 'spot', emoji: '⭕' }, { word: 'step', emoji: '👣' },
  { word: 'swim', emoji: '🏊' }, { word: 'trap', emoji: '🪤' }, { word: 'trip', emoji: '🧳' },
  { word: 'twig', emoji: '🌿' }, { word: 'brim', emoji: '🎩' },
];

const SIGHT_WORDS_L2 = [
  'a', 'and', 'away', 'big', 'blue', 'can', 'come', 'down', 'find', 'for',
  'funny', 'go', 'help', 'here', 'I', 'in', 'is', 'it', 'jump', 'little',
  'look', 'make', 'me', 'my', 'not', 'one', 'play', 'red', 'run', 'said',
  'see', 'the', 'three', 'to', 'two', 'up', 'we', 'where', 'yellow', 'you',
  'all', 'am', 'are', 'at', 'ate', 'be', 'black', 'brown', 'but', 'came',
  'did', 'do', 'eat', 'four', 'get', 'good', 'have', 'he', 'into', 'like',
  'must', 'new', 'no', 'now', 'on', 'our', 'out', 'please', 'pretty', 'ran',
  'ride', 'saw', 'say', 'she', 'so', 'soon', 'that', 'there', 'they', 'this',
  'too', 'under', 'want', 'was', 'well', 'went', 'what', 'white', 'who', 'will',
  'with', 'yes',
];

// ---------------------------------------------------------------------------
// HELPER: Collect all letter-sound items into a flat array for easy sampling
// ---------------------------------------------------------------------------
const ALL_LETTER_SOUND_FLAT = [];
Object.keys(LETTER_SOUND_ITEMS).forEach(function (letter) {
  LETTER_SOUND_ITEMS[letter].forEach(function (item) {
    ALL_LETTER_SOUND_FLAT.push({ letter: letter, emoji: item.emoji, word: item.word });
  });
});

// =============================================================================
// LEVEL 1 — PRE-K ACTIVITIES
// =============================================================================

// ---------------------------------------------------------------------------
// 1. genSoundSpotter — DISTAR "say it fast" blending
// ---------------------------------------------------------------------------
function genSoundSpotter(difficulty) {
  difficulty = difficulty || 1;

  var target = randItem(SOUND_SPOTTER_WORDS);

  // Collect all emojis that represent the same word (could appear in multiple pools)
  var correctEmojis = [target.emoji];
  SOUND_SPOTTER_WORDS.forEach(function (w) {
    if (w.word === target.word && correctEmojis.indexOf(w.emoji) === -1) correctEmojis.push(w.emoji);
  });
  ALL_LETTER_SOUND_FLAT.forEach(function (item) {
    if (item.word === target.word && correctEmojis.indexOf(item.emoji) === -1) correctEmojis.push(item.emoji);
  });

  // Build 3 distractors from a large emoji pool, excluding anything that could be correct
  var otherEmojis = [];
  SOUND_SPOTTER_WORDS.forEach(function (w) {
    if (correctEmojis.indexOf(w.emoji) === -1 && otherEmojis.indexOf(w.emoji) === -1) {
      otherEmojis.push(w.emoji);
    }
  });
  ALL_LETTER_SOUND_FLAT.forEach(function (item) {
    if (correctEmojis.indexOf(item.emoji) === -1 && otherEmojis.indexOf(item.emoji) === -1) {
      otherEmojis.push(item.emoji);
    }
  });
  var distractors = randItems(otherEmojis, 3);

  return {
    type: 'soundSpotter',
    question: target.sounds,
    answer: target.emoji,
    choices: shuffleArray([target.emoji].concat(distractors)),
    word: target.word,
    hint: 'Blend the sounds together!',
  };
}

// ---------------------------------------------------------------------------
// 2. genRhymeCatcher — Rhyme family matching
// ---------------------------------------------------------------------------
function genRhymeCatcher(difficulty) {
  difficulty = difficulty || 1;

  // Pick a random family
  var family = randItem(RHYME_FAMILIES);

  // Pick 2 distinct words from the family: one as target, one as correct answer
  var pair = randItems(family.words, 2);
  var target = pair[0];
  var answer = pair[1];

  // Pick 3 distractor words from OTHER families
  var otherFamilies = RHYME_FAMILIES.filter(function (f) {
    return f.family !== family.family;
  });
  var distractorWords = [];
  var usedFamilies = shuffleArray(otherFamilies).slice(0, 3);
  for (var i = 0; i < usedFamilies.length; i++) {
    distractorWords.push(randItem(usedFamilies[i].words));
  }

  return {
    type: 'rhymeCatcher',
    question: 'Which word rhymes with "' + target + '"?',
    answer: answer,
    choices: shuffleArray([answer].concat(distractorWords)),
    hint: 'They end with the same sound!',
    target: target,
  };
}

// ---------------------------------------------------------------------------
// 3. genLetterSoundSafari — Letter-sound matching
// ---------------------------------------------------------------------------
function genLetterSoundSafari(difficulty) {
  difficulty = difficulty || 1;

  // Pick a random letter
  var letters = Object.keys(LETTER_SOUND_ITEMS);
  var letter = randItem(letters);

  // Pick one correct item from that letter
  var correctItem = randItem(LETTER_SOUND_ITEMS[letter]);

  // Collect all emojis that are valid for the target letter (so we never use them as distractors)
  var correctEmojis = LETTER_SOUND_ITEMS[letter].map(function (item) { return item.emoji; });
  // Also check SOUND_SPOTTER_WORDS for words starting with this letter
  SOUND_SPOTTER_WORDS.forEach(function (w) {
    if (w.word.charAt(0) === letter && correctEmojis.indexOf(w.emoji) === -1) {
      correctEmojis.push(w.emoji);
    }
  });

  // Pick 3 distractor emojis from a wide pool, excluding any that could be correct
  var otherItems = ALL_LETTER_SOUND_FLAT.filter(function (item) {
    return correctEmojis.indexOf(item.emoji) === -1;
  });
  var distractors = randItems(otherItems, 3).map(function (item) {
    return item.emoji;
  });

  return {
    type: 'letterSoundSafari',
    question: letter.toUpperCase(),
    answer: correctItem.emoji,
    choices: shuffleArray([correctItem.emoji].concat(distractors)),
    word: correctItem.word,
    hint: 'What starts with this letter sound?',
  };
}

// ---------------------------------------------------------------------------
// 4. genFirstSoundMatch — Same/different initial sound
// ---------------------------------------------------------------------------
function genFirstSoundMatch(difficulty) {
  difficulty = difficulty || 1;

  var letters = Object.keys(LETTER_SOUND_ITEMS);
  var sameSound = Math.random() < 0.5;

  var answer, wordA, wordB, emojiA, emojiB;

  if (sameSound) {
    // Pick a letter with at least 2 items (all have 3, so always fine)
    var letter = randItem(letters);
    var items = randItems(LETTER_SOUND_ITEMS[letter], 2);
    wordA = items[0].word;
    wordB = items[1].word;
    emojiA = items[0].emoji;
    emojiB = items[1].emoji;
    answer = 'Yes';
  } else {
    // Pick two different letters
    var twoLetters = randItems(letters, 2);
    var itemA = randItem(LETTER_SOUND_ITEMS[twoLetters[0]]);
    var itemB = randItem(LETTER_SOUND_ITEMS[twoLetters[1]]);
    wordA = itemA.word;
    wordB = itemB.word;
    emojiA = itemA.emoji;
    emojiB = itemB.emoji;
    answer = 'No';
  }

  return {
    type: 'firstSoundMatch',
    question: 'Do these words start with the same sound?',
    answer: answer,
    choices: ['Yes', 'No'],
    wordA: wordA,
    wordB: wordB,
    emojiA: emojiA,
    emojiB: emojiB,
  };
}

// =============================================================================
// LEVEL 2 — K ACTIVITIES
// =============================================================================

// ---------------------------------------------------------------------------
// 5. genWordBuilder — Tile-spell CVC words
// ---------------------------------------------------------------------------
function genWordBuilder(difficulty) {
  difficulty = difficulty || 1;

  var target = randItem(SOUND_SPOTTER_WORDS);
  var word = target.word;
  var upperLetters = word.toUpperCase().split('');

  return {
    type: 'wordBuilder',
    word: word,
    answer: word.toUpperCase(),
    emoji: target.emoji,
    letters: shuffleArray(upperLetters),
    choices: [],  // uses tile-spell mechanic, not choice buttons
    hint: 'Tap the letters to spell the word!',
  };
}

// ---------------------------------------------------------------------------
// 6. genBlendAndRead — DISTAR blending (letters -> word)
// ---------------------------------------------------------------------------
function genBlendAndRead(difficulty) {
  difficulty = difficulty || 1;

  // Build the full pool: CVC words always, CCVC at difficulty 3+
  var pool = SOUND_SPOTTER_WORDS.map(function (w) {
    return { word: w.word, emoji: w.emoji };
  });

  if (difficulty >= 3) {
    pool = pool.concat(CCVC_WORDS);
  }

  var target = randItem(pool);

  // Build 3 wrong word choices from the same pool
  var otherWords = pool
    .filter(function (w) { return w.word !== target.word; })
    .map(function (w) { return w.word; });
  var distractors = randItems(otherWords, 3);

  return {
    type: 'blendAndRead',
    question: target.word,
    answer: target.word,
    choices: shuffleArray([target.word].concat(distractors)),
    letters: target.word.split(''),
    emoji: target.emoji,
    hint: 'Blend the sounds together!',
  };
}

// =============================================================================
// REGISTER L1-L2 READING ACTIVITIES
// =============================================================================
if (typeof ACTIVITY_REGISTRY !== 'undefined') {
  Object.assign(ACTIVITY_REGISTRY, {
    // L1 — Pre-K
    soundSpotter:        { name: 'Sound Spotter',        icon: '🔊', levels: [1],    skill: 'phonics',  generator: genSoundSpotter },
    rhymeCatcher:        { name: 'Rhyme Catcher',        icon: '🎵', levels: [1],    skill: 'phonics',  generator: genRhymeCatcher },
    letterSoundSafari:   { name: 'Letter Sound Safari',  icon: '🔤', levels: [1],    skill: 'phonics',  generator: genLetterSoundSafari },
    firstSoundMatch:     { name: 'First Sound Match',    icon: '👂', levels: [1],    skill: 'phonics',  generator: genFirstSoundMatch },
    // L2 — K
    wordBuilder:         { name: 'Word Builder',         icon: '🧱', levels: [2],    skill: 'phonics',  generator: genWordBuilder },
    blendAndRead:        { name: 'Blend & Read',         icon: '🔗', levels: [2],    skill: 'phonics',  generator: genBlendAndRead },
  });
}
