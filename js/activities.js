// =============================================================================
// ACTIVITIES.JS — 26 Activity Generators for Pokemon Learning Game
// Loaded after game.js (TYPE_CHART and POKEMON_DB are available globally)
// =============================================================================

// ---------------------------------------------------------------------------
// UTILITY HELPERS
// ---------------------------------------------------------------------------

/** Fisher-Yates shuffle — returns a new shuffled array */
function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Pick a random element from an array */
function randItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Pick N unique random elements from an array */
function randItems(arr, n) {
  return shuffleArray(arr).slice(0, n);
}

/** Generate wrong number answers near a correct value (stays positive, no duplicates) */
function wrongNumbers(correct, count, range) {
  const wrongs = new Set();
  let attempts = 0;
  while (wrongs.size < count && attempts < 200) {
    attempts++;
    const offset = Math.floor(Math.random() * range * 2) - range;
    const candidate = correct + offset;
    if (candidate !== correct && candidate >= 0) wrongs.add(candidate);
  }
  // Fallback: sequential
  let fill = correct + 1;
  while (wrongs.size < count) {
    if (fill !== correct) wrongs.add(fill);
    fill++;
  }
  return Array.from(wrongs).slice(0, count);
}

/** Build a 4-choice array with correct answer included, shuffled */
function buildChoices(correct, distractors) {
  const all = [String(correct), ...distractors.slice(0, 3).map(String)];
  return shuffleArray(all);
}

// =============================================================================
// SECTION 1 — PRE-K ACTIVITIES (Level 1)
// =============================================================================

// ---------------------------------------------------------------------------
// 1. genSoundSafari — Phoneme matching
// ---------------------------------------------------------------------------
function genSoundSafari(difficulty) {
  difficulty = difficulty || 1;
  const soundItems = [
    // B sounds
    { sound: 'b', emoji: '🐝', word: 'bee', others: ['🐢', '🐟', '🦊'] },
    { sound: 'b', emoji: '🐻', word: 'bear', others: ['🦆', '🐸', '🌺'] },
    { sound: 'b', emoji: '🦋', word: 'butterfly', others: ['🐢', '🐟', '🦊'] },
    { sound: 'b', emoji: '🐦', word: 'bird', others: ['🐸', '🐱', '🦊'] },
    { sound: 'b', emoji: '🔔', word: 'bell', others: ['🐢', '🌸', '🐟'] },
    // C sounds
    { sound: 'c', emoji: '🐱', word: 'cat', others: ['🐸', '🐝', '🦋'] },
    { sound: 'c', emoji: '🐄', word: 'cow', others: ['🐟', '🐦', '🌸'] },
    { sound: 'c', emoji: '🧁', word: 'cupcake', others: ['🐸', '🐝', '🦊'] },
    { sound: 'c', emoji: '🌽', word: 'corn', others: ['🐢', '🐟', '🐦'] },
    { sound: 'c', emoji: '🏰', word: 'castle', others: ['🐸', '🐝', '🦋'] },
    // D sounds
    { sound: 'd', emoji: '🐬', word: 'dolphin', others: ['🐱', '🐻', '🦊'] },
    { sound: 'd', emoji: '🦆', word: 'duck', others: ['🐝', '🐟', '🐢'] },
    { sound: 'd', emoji: '🐕', word: 'dog', others: ['🐱', '🐸', '🦋'] },
    { sound: 'd', emoji: '🥁', word: 'drum', others: ['🐝', '🐢', '🌸'] },
    { sound: 'd', emoji: '🦌', word: 'deer', others: ['🐟', '🐱', '🐸'] },
    // F sounds
    { sound: 'f', emoji: '🐟', word: 'fish', others: ['🐱', '🐻', '🦆'] },
    { sound: 'f', emoji: '🦊', word: 'fox', others: ['🐱', '🐝', '🐢'] },
    { sound: 'f', emoji: '🐸', word: 'frog', others: ['🐱', '🐻', '🐢'] },
    { sound: 'f', emoji: '🌺', word: 'flower', others: ['🐝', '🐢', '🦆'] },
    { sound: 'f', emoji: '🪶', word: 'feather', others: ['🐱', '🐻', '🐟'] },
    // G sounds
    { sound: 'g', emoji: '🦒', word: 'giraffe', others: ['🐱', '🐟', '🐦'] },
    { sound: 'g', emoji: '🐐', word: 'goat', others: ['🐝', '🐢', '🦊'] },
    { sound: 'g', emoji: '🦍', word: 'gorilla', others: ['🐟', '🐱', '🦆'] },
    { sound: 'g', emoji: '🍇', word: 'grapes', others: ['🐝', '🐢', '🌸'] },
    { sound: 'g', emoji: '🎸', word: 'guitar', others: ['🐸', '🐟', '🦋'] },
    // H sounds
    { sound: 'h', emoji: '🐎', word: 'horse', others: ['🐟', '🐸', '🐝'] },
    { sound: 'h', emoji: '🦔', word: 'hedgehog', others: ['🐱', '🦆', '🐢'] },
    { sound: 'h', emoji: '🏠', word: 'house', others: ['🐟', '🐸', '🐝'] },
    { sound: 'h', emoji: '💓', word: 'heart', others: ['🐱', '🦊', '🐢'] },
    { sound: 'h', emoji: '🎩', word: 'hat', others: ['🐸', '🐟', '🦆'] },
    // J sounds
    { sound: 'j', emoji: '🧃', word: 'juice', others: ['🐱', '🐟', '🐢'] },
    { sound: 'j', emoji: '🃏', word: 'joker', others: ['🐝', '🐸', '🦊'] },
    // K sounds
    { sound: 'k', emoji: '🪁', word: 'kite', others: ['🐸', '🐟', '🐢'] },
    { sound: 'k', emoji: '👑', word: 'king', others: ['🐱', '🐝', '🦆'] },
    // L sounds
    { sound: 'l', emoji: '🦁', word: 'lion', others: ['🐸', '🐱', '🦊'] },
    { sound: 'l', emoji: '🍋', word: 'lemon', others: ['🐝', '🐢', '🐟'] },
    { sound: 'l', emoji: '🐞', word: 'ladybug', others: ['🐱', '🦆', '🐸'] },
    // M sounds
    { sound: 'm', emoji: '🐵', word: 'monkey', others: ['🐱', '🐸', '🐟'] },
    { sound: 'm', emoji: '🌙', word: 'moon', others: ['🐝', '🐢', '🦊'] },
    { sound: 'm', emoji: '🍄', word: 'mushroom', others: ['🐸', '🐟', '🦆'] },
    // N sounds
    { sound: 'n', emoji: '🥜', word: 'nut', others: ['🐱', '🐸', '🐟'] },
    { sound: 'n', emoji: '📰', word: 'newspaper', others: ['🐝', '🐢', '🦊'] },
    // P sounds
    { sound: 'p', emoji: '🐧', word: 'penguin', others: ['🐸', '🐻', '🦊'] },
    { sound: 'p', emoji: '🐼', word: 'panda', others: ['🐟', '🐝', '🦆'] },
    { sound: 'p', emoji: '🐷', word: 'pig', others: ['🐱', '🐸', '🐢'] },
    { sound: 'p', emoji: '🍕', word: 'pizza', others: ['🐝', '🦊', '🦆'] },
    { sound: 'p', emoji: '🎹', word: 'piano', others: ['🐟', '🐱', '🐢'] },
    // R sounds
    { sound: 'r', emoji: '🐇', word: 'rabbit', others: ['🐱', '🐸', '🐟'] },
    { sound: 'r', emoji: '🌈', word: 'rainbow', others: ['🐝', '🐢', '🦆'] },
    { sound: 'r', emoji: '🚀', word: 'rocket', others: ['🐸', '🐱', '🦊'] },
    // S sounds
    { sound: 's', emoji: '⭐', word: 'star', others: ['🐱', '🐻', '🦆'] },
    { sound: 's', emoji: '🐍', word: 'snake', others: ['🐸', '🦊', '🐝'] },
    { sound: 's', emoji: '☀️', word: 'sun', others: ['🐟', '🐱', '🐢'] },
    { sound: 's', emoji: '🐌', word: 'snail', others: ['🐝', '🦆', '🐸'] },
    { sound: 's', emoji: '🕷️', word: 'spider', others: ['🐱', '🐢', '🦊'] },
    // T sounds
    { sound: 't', emoji: '🐯', word: 'tiger', others: ['🐸', '🐟', '🐝'] },
    { sound: 't', emoji: '🐢', word: 'turtle', others: ['🐱', '🦆', '🐻'] },
    { sound: 't', emoji: '🌳', word: 'tree', others: ['🐟', '🐝', '🐸'] },
    { sound: 't', emoji: '🚂', word: 'train', others: ['🐱', '🦊', '🐢'] },
    { sound: 't', emoji: '🦃', word: 'turkey', others: ['🐸', '🐟', '🐝'] },
    // W sounds
    { sound: 'w', emoji: '🐋', word: 'whale', others: ['🐱', '🐸', '🐢'] },
    { sound: 'w', emoji: '🐺', word: 'wolf', others: ['🐟', '🐝', '🦆'] },
    { sound: 'w', emoji: '🪱', word: 'worm', others: ['🐱', '🐸', '🦊'] },
    // Z sounds
    { sound: 'z', emoji: '🦓', word: 'zebra', others: ['🐱', '🐸', '🐟'] },
    { sound: 'z', emoji: '⚡', word: 'zap', others: ['🐝', '🐢', '🦆'] },
    // Additional sounds
    { sound: 'n', emoji: '🥷', word: 'ninja', others: ['🐱', '🐸', '🐟'] },
    { sound: 'j', emoji: '🧩', word: 'jigsaw', others: ['🐝', '🐢', '🦊'] },
    { sound: 'k', emoji: '🦘', word: 'kangaroo', others: ['🐸', '🐟', '🐱'] },
    { sound: 'l', emoji: '🪷', word: 'lotus', others: ['🐝', '🐢', '🐟'] },
    { sound: 'm', emoji: '🧲', word: 'magnet', others: ['🐸', '🦊', '🐦'] },
    { sound: 'r', emoji: '🤖', word: 'robot', others: ['🐱', '🐸', '🐢'] },
    { sound: 's', emoji: '🧦', word: 'sock', others: ['🐝', '🦆', '🐟'] },
    { sound: 't', emoji: '🧸', word: 'teddy', others: ['🐸', '🐟', '🦊'] },
    { sound: 'w', emoji: '🧙', word: 'wizard', others: ['🐱', '🐝', '🐢'] },
    { sound: 'b', emoji: '🎈', word: 'balloon', others: ['🐸', '🐟', '🦊'] },
  ];

  // Ending sounds for level 2+
  const endingSoundItems = [
    { sound: 't', emoji: '🐱', word: 'cat', others: ['🐝', '🐟', '🦊'] },
    { sound: 't', emoji: '🦇', word: 'bat', others: ['🐸', '🌺', '🐢'] },
    { sound: 'g', emoji: '🐕', word: 'dog', others: ['🐱', '🐸', '🐟'] },
    { sound: 'g', emoji: '🐸', word: 'frog', others: ['🐱', '🐝', '🦊'] },
    { sound: 'n', emoji: '☀️', word: 'sun', others: ['🐱', '🐸', '🐝'] },
    { sound: 'n', emoji: '🌙', word: 'moon', others: ['🐟', '🦊', '🐢'] },
    { sound: 'k', emoji: '🦆', word: 'duck', others: ['🐸', '🐝', '🌺'] },
    { sound: 'l', emoji: '🔔', word: 'bell', others: ['🐟', '🐱', '🦊'] },
    { sound: 'l', emoji: '🐌', word: 'snail', others: ['🐝', '🐢', '🐸'] },
    { sound: 'sh', emoji: '🐟', word: 'fish', others: ['🐱', '🐝', '🐢'] },
    { sound: 'd', emoji: '🛏️', word: 'bed', others: ['🐸', '🦊', '🐟'] },
    { sound: 'p', emoji: '🗺️', word: 'map', others: ['🐱', '🐸', '🦆'] },
    // Additional ending sounds
    { sound: 't', emoji: '🐈', word: 'pet', others: ['🐸', '🦊', '🐝'] },
    { sound: 't', emoji: '🥜', word: 'nut', others: ['🐱', '🐟', '🦆'] },
    { sound: 't', emoji: '🎩', word: 'hat', others: ['🐸', '🐝', '🐢'] },
    { sound: 'g', emoji: '🐛', word: 'bug', others: ['🐱', '🐟', '🦊'] },
    { sound: 'g', emoji: '🪵', word: 'log', others: ['🐝', '🐸', '🐢'] },
    { sound: 'n', emoji: '🏃', word: 'run', others: ['🐱', '🐟', '🦆'] },
    { sound: 'n', emoji: '🧑', word: 'man', others: ['🐸', '🐝', '🐢'] },
    { sound: 'n', emoji: '🍉', word: 'melon', others: ['🐱', '🦊', '🐟'] },
    { sound: 'k', emoji: '📖', word: 'book', others: ['🐸', '🐝', '🦆'] },
    { sound: 'k', emoji: '🏞️', word: 'lake', others: ['🐱', '🐢', '🐟'] },
    { sound: 'l', emoji: '⚽', word: 'ball', others: ['🐸', '🐝', '🦊'] },
    { sound: 'l', emoji: '🦉', word: 'owl', others: ['🐱', '🐟', '🐢'] },
    { sound: 'sh', emoji: '🧹', word: 'brush', others: ['🐸', '🐝', '🦆'] },
    { sound: 'sh', emoji: '💰', word: 'cash', others: ['🐱', '🦊', '🐢'] },
    { sound: 'd', emoji: '☁️', word: 'cloud', others: ['🐸', '🐟', '🐝'] },
    { sound: 'd', emoji: '🍞', word: 'bread', others: ['🐱', '🐢', '🦆'] },
    { sound: 'p', emoji: '🧢', word: 'cap', others: ['🐸', '🐟', '🦊'] },
    { sound: 'p', emoji: '🔝', word: 'top', others: ['🐱', '🐝', '🐢'] },
    { sound: 'm', emoji: '🥁', word: 'drum', others: ['🐸', '🐟', '🦆'] },
    { sound: 'm', emoji: '🏊', word: 'swim', others: ['🐱', '🐢', '🦊'] },
    { sound: 'r', emoji: '⭐', word: 'star', others: ['🐸', '🐝', '🐟'] },
    { sound: 'r', emoji: '🐻', word: 'bear', others: ['🐱', '🦆', '🐢'] },
    { sound: 'b', emoji: '🧊', word: 'cube', others: ['🐸', '🐟', '🐝'] },
    { sound: 'b', emoji: '🌐', word: 'globe', others: ['🐱', '🐢', '🦊'] },
    { sound: 'f', emoji: '🍃', word: 'leaf', others: ['🐸', '🐝', '🦆'] },
    { sound: 'f', emoji: '🤧', word: 'scarf', others: ['🐱', '🐟', '🐢'] },
    { sound: 'ng', emoji: '🎵', word: 'song', others: ['🐸', '🐝', '🦊'] },
    { sound: 'ng', emoji: '👑', word: 'king', others: ['🐱', '🐟', '🦆'] },
  ];

  const useEndingSound = difficulty >= 2 && Math.random() < 0.3;

  if (useEndingSound) {
    const eItem = randItem(endingSoundItems);
    const eOptions = shuffleArray([eItem.emoji, ...eItem.others]);
    return {
      type: 'soundSafari',
      question: `Which picture ENDS with the /${eItem.sound}/ sound?`,
      answer: eItem.emoji,
      choices: eOptions,
      hint: 'Think of the LAST sound you hear in each word!',
      sound: eItem.sound,
      correctWord: eItem.word,
    };
  }

  const item = randItem(soundItems);
  const allOptions = shuffleArray([item.emoji, ...item.others]);

  return {
    type: 'soundSafari',
    question: `Which picture starts with the /${item.sound}/ sound?`,
    answer: item.emoji,
    choices: allOptions,
    hint: `Think of the first sound you hear in each word!`,
    sound: item.sound,
    correctWord: item.word,
  };
}

// ---------------------------------------------------------------------------
// 2. genCountingCatch — Count Pokemon
// ---------------------------------------------------------------------------
function genCountingCatch(difficulty) {
  difficulty = difficulty || 1;

  const pokemonEmoji = ['🐱', '🐸', '🦊', '⚡', '💧', '🔥', '🌿', '✨', '🎯', '💎'];

  // Number ranges by difficulty
  const ranges = {
    1: [1, 5],
    2: [1, 10],
    3: [1, 15],
    4: [5, 20],
    5: [10, 30],
  };
  const [min, max] = ranges[difficulty] || [1, 5];
  const count = min + Math.floor(Math.random() * (max - min + 1));

  const emoji = randItem(pokemonEmoji);
  const display = Array(count).fill(emoji).join(' ');

  const wrongNums = wrongNumbers(count, 3, Math.max(2, Math.floor((max - min) / 3)));
  const choices = buildChoices(count, wrongNums.map(String));

  return {
    type: 'countingCatch',
    question: 'How many do you see?',
    answer: String(count),
    choices,
    hint: 'Count each one carefully!',
    emoji,
    display,
    count,
  };
}

// ---------------------------------------------------------------------------
// 5. genPatternPath — Complete a repeating pattern
// ---------------------------------------------------------------------------
function genPatternPath(difficulty) {
  difficulty = difficulty || 1;

  // Pattern templates organized by complexity
  const patterns2 = [
    { seq: ['🔴','🔵','🔴','🔵'], next: '🔴', label: 'red-blue' },
    { seq: ['⭐','🌙','⭐','🌙'], next: '⭐', label: 'star-moon' },
    { seq: ['🔥','💧','🔥','💧'], next: '🔥', label: 'fire-water' },
    { seq: ['🌿','⚡','🌿','⚡'], next: '🌿', label: 'grass-electric' },
    { seq: ['🐱','🐸','🐱','🐸'], next: '🐱', label: 'cat-frog' },
    { seq: ['🎈','🎵','🎈','🎵'], next: '🎈', label: 'balloon-music' },
    { seq: ['🍎','🍊','🍎','🍊'], next: '🍎', label: 'apple-orange' },
    { seq: ['🌸','🌻','🌸','🌻'], next: '🌸', label: 'cherry-sunflower' },
    { seq: ['🐝','🦋','🐝','🦋'], next: '🐝', label: 'bee-butterfly' },
    { seq: ['🎃','👻','🎃','👻'], next: '🎃', label: 'pumpkin-ghost' },
    { seq: ['🐟','🐬','🐟','🐬'], next: '🐟', label: 'fish-dolphin' },
    { seq: ['🌞','🌧️','🌞','🌧️'], next: '🌞', label: 'sun-rain' },
    { seq: ['🎀','🎁','🎀','🎁'], next: '🎀', label: 'bow-gift' },
    { seq: ['🐢','🐇','🐢','🐇'], next: '🐢', label: 'turtle-rabbit' },
    { seq: ['🍌','🍇','🍌','🍇'], next: '🍌', label: 'banana-grape' },
    { seq: ['🦁','🐘','🦁','🐘'], next: '🦁', label: 'lion-elephant' },
    { seq: ['🎂','🍰','🎂','🍰'], next: '🎂', label: 'cake-slice' },
  ];

  const patterns3 = [
    { seq: ['🔴','🔵','🟢','🔴','🔵'], next: '🟢', label: 'red-blue-green' },
    { seq: ['🔥','💧','🌿','🔥','💧'], next: '🌿', label: 'fire-water-grass' },
    { seq: ['⭐','🌙','☀️','⭐','🌙'], next: '☀️', label: 'star-moon-sun' },
    { seq: ['🐱','🐶','🐸','🐱','🐶'], next: '🐸', label: 'cat-dog-frog' },
    { seq: ['🎯','💎','🎪','🎯','💎'], next: '🎪', label: 'target-gem-tent' },
    { seq: ['🍎','🍊','🍋','🍎','🍊'], next: '🍋', label: 'apple-orange-lemon' },
    { seq: ['🐝','🦋','🐞','🐝','🦋'], next: '🐞', label: 'bee-butterfly-ladybug' },
    { seq: ['🔴','🟡','🔵','🔴','🟡'], next: '🔵', label: 'red-yellow-blue' },
    { seq: ['🌸','🌺','🌻','🌸','🌺'], next: '🌻', label: 'blossom-hibiscus-sunflower' },
    { seq: ['🐟','🐬','🐋','🐟','🐬'], next: '🐋', label: 'fish-dolphin-whale' },
    { seq: ['🍕','🍔','🌭','🍕','🍔'], next: '🌭', label: 'pizza-burger-hotdog' },
    { seq: ['✈️','🚗','🚂','✈️','🚗'], next: '🚂', label: 'plane-car-train' },
    { seq: ['🎈','🎁','🎉','🎈','🎁'], next: '🎉', label: 'balloon-gift-party' },
    { seq: ['🦊','🐺','🐻','🦊','🐺'], next: '🐻', label: 'fox-wolf-bear' },
    { seq: ['🍓','🫐','🍒','🍓','🫐'], next: '🍒', label: 'strawberry-blueberry-cherry' },
    { seq: ['🌹','🌷','🌻','🌹','🌷'], next: '🌻', label: 'rose-tulip-sunflower' },
    { seq: ['🐔','🐷','🐮','🐔','🐷'], next: '🐮', label: 'chicken-pig-cow' },
  ];

  const patternsAB2 = [
    { seq: ['🔴','🔴','🔵','🔴','🔴'], next: '🔵', label: 'AAB' },
    { seq: ['⭐','🌙','🌙','⭐','🌙'], next: '🌙', label: 'ABB' },
    { seq: ['🔥','🔥','💧','🔥','🔥'], next: '💧', label: 'AAB fire' },
    { seq: ['🌿','⚡','⚡','🌿','⚡'], next: '⚡', label: 'ABB grass' },
    { seq: ['🐱','🐱','🐸','🐱','🐱'], next: '🐸', label: 'AAB cat' },
    { seq: ['🎈','🎵','🎵','🎈','🎵'], next: '🎵', label: 'ABB balloon' },
    { seq: ['🍎','🍎','🍊','🍎','🍎'], next: '🍊', label: 'AAB apple' },
    { seq: ['💧','🔥','🔥','💧','🔥'], next: '🔥', label: 'ABB water' },
    { seq: ['🐟','🐟','🐬','🐟','🐟'], next: '🐬', label: 'AAB fish' },
    { seq: ['🌙','⭐','⭐','🌙','⭐'], next: '⭐', label: 'ABB moon' },
    { seq: ['🐝','🐝','🦋','🐝','🐝'], next: '🦋', label: 'AAB bee' },
    { seq: ['🌸','🌺','🌺','🌸','🌺'], next: '🌺', label: 'ABB flower' },
    { seq: ['🎈','🎈','🎵','🎈','🎈'], next: '🎵', label: 'AAB party' },
    { seq: ['🍕','🍔','🍔','🍕','🍔'], next: '🍔', label: 'ABB food' },
    { seq: ['🐢','🐢','🐇','🐢','🐢'], next: '🐇', label: 'AAB race' },
  ];

  let pool;
  if (difficulty <= 1) pool = patterns2;
  else if (difficulty <= 2) pool = [...patterns2, ...patterns3];
  else if (difficulty <= 3) pool = [...patterns3, ...patternsAB2];
  else pool = [...patterns3, ...patternsAB2];

  const item = randItem(pool);
  const display = item.seq.join(' ') + ' ?';

  // Build wrong choices: other emoji that appear in the sequence
  const allEmoji = [...new Set(item.seq)];
  const wrongEmoji = allEmoji.filter(e => e !== item.next);
  // Add extra wrong choices if needed
  const extras = ['🟡','🟠','🟣','⬛','⬜'];
  while (wrongEmoji.length < 3) {
    wrongEmoji.push(randItem(extras));
  }
  const choices = shuffleArray([item.next, ...wrongEmoji.slice(0, 3)]);

  const patternItems = display.split(' ').concat(['?']);
  return {
    type: 'patternPath',
    question: `What comes next in the pattern?\n${display}`,
    answer: item.next,
    choices,
    hint: 'Look at the pattern carefully — what repeats?',
    pattern: item.seq,
    display,
    patternItems,
  };
}

// =============================================================================
// SECTION 2 — KINDERGARTEN ACTIVITIES (Level 2)
// =============================================================================

// ---------------------------------------------------------------------------
// 6. genBlendAMon — Syllable blending
// ---------------------------------------------------------------------------
function genBlendAMon() {
  const syllableItems = [
    { syllables: 'Pi-ka-chu',     answer: 'Pikachu',     others: ['Bulbasaur', 'Squirtle', 'Jigglypuff'] },
    { syllables: 'Char-i-zard',   answer: 'Charizard',   others: ['Blastoise', 'Mewtwo', 'Gengar'] },
    { syllables: 'Bul-ba-saur',   answer: 'Bulbasaur',   others: ['Pikachu', 'Squirtle', 'Charmander'] },
    { syllables: 'Squi-rtle',     answer: 'Squirtle',    others: ['Pikachu', 'Bulbasaur', 'Eevee'] },
    { syllables: 'Me-owth',       answer: 'Meowth',      others: ['Pikachu', 'Gengar', 'Psyduck'] },
    { syllables: 'Jig-gly-puff',  answer: 'Jigglypuff',  others: ['Pikachu', 'Mewtwo', 'Clefairy'] },
    { syllables: 'Gen-gar',       answer: 'Gengar',       others: ['Pikachu', 'Psyduck', 'Snorlax'] },
    { syllables: 'Ee-vee',        answer: 'Eevee',        others: ['Pikachu', 'Meowth', 'Abra'] },
    { syllables: 'Sno-rlax',      answer: 'Snorlax',      others: ['Pikachu', 'Lapras', 'Dragonite'] },
    { syllables: 'Psy-duck',      answer: 'Psyduck',      others: ['Pikachu', 'Gengar', 'Meowth'] },
    { syllables: 'A-bra',         answer: 'Abra',          others: ['Pikachu', 'Meowth', 'Ditto'] },
    { syllables: 'Dra-go-nite',   answer: 'Dragonite',    others: ['Charizard', 'Blastoise', 'Venusaur'] },
    { syllables: 'Lap-ras',       answer: 'Lapras',        others: ['Pikachu', 'Snorlax', 'Clefairy'] },
    { syllables: 'Cle-fai-ry',    answer: 'Clefairy',      others: ['Pikachu', 'Jigglypuff', 'Eevee'] },
    { syllables: 'Ma-chop',       answer: 'Machop',        others: ['Pikachu', 'Geodude', 'Slowpoke'] },
    // Expanded entries
    { syllables: 'Char-man-der',  answer: 'Charmander',   others: ['Charizard', 'Squirtle', 'Bulbasaur'] },
    { syllables: 'Char-me-le-on', answer: 'Charmeleon',   others: ['Charmander', 'Charizard', 'Venusaur'] },
    { syllables: 'I-vy-saur',     answer: 'Ivysaur',      others: ['Bulbasaur', 'Venusaur', 'Pikachu'] },
    { syllables: 'Ve-nu-saur',    answer: 'Venusaur',     others: ['Bulbasaur', 'Ivysaur', 'Charizard'] },
    { syllables: 'War-tor-tle',   answer: 'Wartortle',    others: ['Squirtle', 'Blastoise', 'Pikachu'] },
    { syllables: 'Bla-stoise',    answer: 'Blastoise',    others: ['Squirtle', 'Wartortle', 'Charizard'] },
    { syllables: 'Cat-er-pie',    answer: 'Caterpie',     others: ['Butterfree', 'Weedle', 'Pikachu'] },
    { syllables: 'But-ter-free',  answer: 'Butterfree',   others: ['Caterpie', 'Metapod', 'Beedrill'] },
    { syllables: 'Pid-ge-ot',     answer: 'Pidgeot',      others: ['Pidgey', 'Fearow', 'Spearow'] },
    { syllables: 'Vul-pix',       answer: 'Vulpix',       others: ['Ninetales', 'Growlithe', 'Arcanine'] },
    { syllables: 'Nine-tales',    answer: 'Ninetales',    others: ['Vulpix', 'Arcanine', 'Growlithe'] },
    { syllables: 'Wig-gly-tuff',  answer: 'Wigglytuff',   others: ['Jigglypuff', 'Clefable', 'Chansey'] },
    { syllables: 'Gol-duck',      answer: 'Golduck',       others: ['Psyduck', 'Poliwag', 'Slowbro'] },
    { syllables: 'Ar-ca-nine',    answer: 'Arcanine',      others: ['Growlithe', 'Ninetales', 'Charizard'] },
    { syllables: 'Po-li-wag',     answer: 'Poliwag',       others: ['Poliwhirl', 'Poliwrath', 'Psyduck'] },
    { syllables: 'Ka-da-bra',     answer: 'Kadabra',       others: ['Abra', 'Alakazam', 'Hypno'] },
    { syllables: 'A-la-ka-zam',   answer: 'Alakazam',      others: ['Abra', 'Kadabra', 'Mewtwo'] },
    { syllables: 'Ge-o-dude',     answer: 'Geodude',       others: ['Graveler', 'Golem', 'Onix'] },
    { syllables: 'Slow-poke',     answer: 'Slowpoke',      others: ['Slowbro', 'Psyduck', 'Golduck'] },
    { syllables: 'Mag-ne-mite',   answer: 'Magnemite',     others: ['Magneton', 'Voltorb', 'Electrode'] },
    { syllables: 'Dug-tri-o',     answer: 'Dugtrio',       others: ['Diglett', 'Geodude', 'Onix'] },
    { syllables: 'Gast-ly',       answer: 'Gastly',        others: ['Haunter', 'Gengar', 'Misdreavus'] },
    { syllables: 'Haun-ter',      answer: 'Haunter',       others: ['Gastly', 'Gengar', 'Hypno'] },
    { syllables: 'Vol-torb',      answer: 'Voltorb',       others: ['Electrode', 'Magnemite', 'Pikachu'] },
    { syllables: 'E-lec-trode',   answer: 'Electrode',     others: ['Voltorb', 'Magneton', 'Jolteon'] },
    { syllables: 'Gy-a-ra-dos',   answer: 'Gyarados',      others: ['Magikarp', 'Lapras', 'Dragonite'] },
    { syllables: 'Ma-gi-karp',    answer: 'Magikarp',      others: ['Gyarados', 'Goldeen', 'Seaking'] },
    { syllables: 'Dit-to',        answer: 'Ditto',          others: ['Eevee', 'Porygon', 'Mewtwo'] },
    { syllables: 'Va-po-re-on',   answer: 'Vaporeon',      others: ['Jolteon', 'Flareon', 'Eevee'] },
    { syllables: 'Jol-te-on',     answer: 'Jolteon',       others: ['Vaporeon', 'Flareon', 'Eevee'] },
    { syllables: 'Fla-re-on',     answer: 'Flareon',       others: ['Vaporeon', 'Jolteon', 'Eevee'] },
    { syllables: 'Po-ry-gon',     answer: 'Porygon',       others: ['Ditto', 'Voltorb', 'Electrode'] },
    { syllables: 'Ka-bu-to',      answer: 'Kabuto',        others: ['Kabutops', 'Omanyte', 'Omastar'] },
    { syllables: 'Mew-two',       answer: 'Mewtwo',        others: ['Mew', 'Alakazam', 'Gengar'] },
    { syllables: 'O-ma-nyte',     answer: 'Omanyte',       others: ['Omastar', 'Kabuto', 'Kabutops'] },
    { syllables: 'Ae-ro-dac-tyl', answer: 'Aerodactyl',    others: ['Dragonite', 'Charizard', 'Kabutops'] },
    { syllables: 'Grow-li-the',   answer: 'Growlithe',     others: ['Arcanine', 'Vulpix', 'Flareon'] },
    { syllables: 'Tang-e-la',     answer: 'Tangela',       others: ['Bulbasaur', 'Bellsprout', 'Weepinbell'] },
    { syllables: 'Chan-sey',      answer: 'Chansey',       others: ['Clefairy', 'Jigglypuff', 'Wigglytuff'] },
  ];

  const item = randItem(syllableItems);
  const choices = shuffleArray([item.answer, ...item.others]);

  return {
    type: 'blendAMon',
    question: `Put these sounds together to make a Pokemon name:\n"${item.syllables}"`,
    answer: item.answer,
    choices,
    hint: 'Say the sounds quickly together!',
    syllables: item.syllables,
  };
}

// ---------------------------------------------------------------------------
// 7. genRhymeBattle — Rhyming words
// ---------------------------------------------------------------------------
function genRhymeBattle() {
  const rhymeItems = [
    { target: 'ball',   answer: 'hall',    others: ['fish', 'tree', 'jump'],       hint: 'It sounds like "b-all"' },
    { target: 'cat',    answer: 'hat',     others: ['dog', 'tree', 'run'],          hint: 'Rhymes with flat' },
    { target: 'fire',   answer: 'higher',  others: ['water', 'grass', 'electric'],  hint: 'Think what Charizard soars' },
    { target: 'blue',   answer: 'true',    others: ['red', 'green', 'orange'],      hint: 'Squirtle is this color too' },
    { target: 'star',   answer: 'far',     others: ['moon', 'sun', 'cloud'],        hint: 'Stars shine from very ___' },
    { target: 'rain',   answer: 'train',   others: ['snow', 'sun', 'cloud'],        hint: 'Something you ride on tracks' },
    { target: 'night',  answer: 'bright',  others: ['day', 'sleep', 'dark'],        hint: 'Gengar glows at ___' },
    { target: 'lake',   answer: 'cake',    others: ['river', 'pond', 'ocean'],      hint: 'Something sweet to eat' },
    { target: 'pink',   answer: 'drink',   others: ['blue', 'purple', 'red'],       hint: 'Jigglypuff is ___ and you ___' },
    { target: 'fly',    answer: 'sky',     others: ['swim', 'run', 'jump'],         hint: 'Where Pidgeot lives' },
    { target: 'stone',  answer: 'bone',    others: ['rock', 'pebble', 'sand'],      hint: 'Cubone carries one' },
    { target: 'green',  answer: 'seen',    others: ['blue', 'red', 'yellow'],       hint: 'Bulbasaur is this color, haven\'t you ___?' },
    { target: 'jump',   answer: 'pump',    others: ['run', 'swim', 'fly'],          hint: 'Like a water ___' },
    { target: 'play',   answer: 'day',     others: ['night', 'work', 'sleep'],      hint: 'A Pokemon trainer\'s best ___' },
    { target: 'bite',   answer: 'fight',   others: ['scratch', 'lick', 'tackle'],   hint: 'In a battle you might ___' },
    // Expanded entries
    { target: 'log',    answer: 'fog',     others: ['cat', 'sun', 'tree'],          hint: 'A misty morning has ___' },
    { target: 'bed',    answer: 'red',     others: ['blue', 'run', 'hat'],          hint: 'Charizard is this color' },
    { target: 'sing',   answer: 'ring',    others: ['dance', 'swim', 'fly'],        hint: 'Something round on your finger' },
    { target: 'cold',   answer: 'bold',    others: ['warm', 'soft', 'wet'],         hint: 'Brave trainers are ___' },
    { target: 'hop',    answer: 'stop',    others: ['run', 'swim', 'fly'],          hint: 'What a red light means' },
    { target: 'bug',    answer: 'hug',     others: ['fish', 'bird', 'rock'],        hint: 'What friends give each other' },
    { target: 'tail',   answer: 'mail',    others: ['head', 'wing', 'claw'],        hint: 'Letters come in the ___' },
    { target: 'well',   answer: 'bell',    others: ['hole', 'hill', 'wall'],        hint: 'It goes ding-dong' },
    { target: 'round',  answer: 'sound',   others: ['square', 'flat', 'tall'],      hint: 'Music makes a ___' },
    { target: 'pet',    answer: 'wet',     others: ['dry', 'hot', 'big'],           hint: 'What happens in the rain' },
    { target: 'light',  answer: 'kite',    others: ['dark', 'heavy', 'slow'],       hint: 'Flies high in the wind' },
    { target: 'mouse',  answer: 'house',   others: ['cat', 'bird', 'fish'],         hint: 'Where you live' },
    { target: 'cave',   answer: 'brave',   others: ['dark', 'deep', 'cold'],        hint: 'What you need to explore one' },
    { target: 'dream',  answer: 'team',    others: ['sleep', 'wish', 'hope'],       hint: 'A group working together' },
    { target: 'boat',   answer: 'coat',    others: ['ship', 'sail', 'wave'],        hint: 'Something you wear when cold' },
    { target: 'hill',   answer: 'still',   others: ['mountain', 'valley', 'cliff'], hint: 'Not moving at all' },
    { target: 'deep',   answer: 'sleep',   others: ['wide', 'tall', 'long'],        hint: 'What Snorlax loves to do' },
    { target: 'moon',   answer: 'soon',    others: ['star', 'sun', 'cloud'],        hint: 'It means in a little while' },
    { target: 'game',   answer: 'name',    others: ['play', 'win', 'fun'],          hint: 'What people call you' },
    { target: 'tree',   answer: 'free',    others: ['leaf', 'bark', 'root'],        hint: 'Not trapped or caged' },
    { target: 'power',  answer: 'tower',   others: ['energy', 'force', 'speed'],    hint: 'A tall building' },
    { target: 'wing',   answer: 'king',    others: ['feather', 'fly', 'bird'],      hint: 'A ruler of a kingdom' },
    { target: 'cool',   answer: 'pool',    others: ['cold', 'warm', 'hot'],         hint: 'Swim in a ___' },
    { target: 'way',    answer: 'say',     others: ['path', 'road', 'trail'],       hint: 'To speak is to ___' },
    { target: 'dish',   answer: 'wish',    others: ['plate', 'bowl', 'cup'],        hint: 'Jirachi grants a ___' },
    { target: 'dark',   answer: 'park',    others: ['night', 'shadow', 'black'],    hint: 'A place with trees and grass' },
    { target: 'gold',   answer: 'told',    others: ['silver', 'shiny', 'bright'],   hint: 'Past tense of tell' },
    { target: 'heat',   answer: 'beat',    others: ['warm', 'fire', 'burn'],        hint: 'The rhythm of a drum' },
    { target: 'rope',   answer: 'hope',    others: ['string', 'chain', 'wire'],     hint: 'To wish for something good' },
    { target: 'horn',   answer: 'corn',    others: ['bone', 'claw', 'tooth'],       hint: 'A yellow vegetable' },
    { target: 'rest',   answer: 'best',    others: ['sleep', 'nap', 'calm'],        hint: 'The very ___' },
  ];

  const item = randItem(rhymeItems);
  const choices = shuffleArray([item.answer, ...item.others]);

  return {
    type: 'rhymeBattle',
    question: `Which word rhymes with "${item.target}"?`,
    answer: item.answer,
    choices,
    hint: item.hint,
    target: item.target,
  };
}

// ---------------------------------------------------------------------------
// 8. genPokedexSpeller — Spell Pokemon-related words
// ---------------------------------------------------------------------------
function genPokedexSpeller(difficulty) {
  difficulty = difficulty || 2;

  // Words organized by length/difficulty
  const words1 = [
    { word: 'bat', emoji: '🦇', hint: 'A flying creature like Zubat' },
    { word: 'bug', emoji: '🐛', hint: 'Caterpie is this type' },
    { word: 'egg', emoji: '🥚', hint: 'Pokemon hatch from these' },
    { word: 'gym', emoji: '🏋️', hint: 'Where you earn badges' },
    { word: 'dig', emoji: '⛏️', hint: 'Diglett loves to do this' },
    { word: 'run', emoji: '🏃', hint: 'Arcanine is known for this' },
    { word: 'red', emoji: '🔴', hint: 'Color of Charizard\'s fire' },
    { word: 'sky', emoji: '☁️', hint: 'Pidgeot soars through the ___' },
    { word: 'fly', emoji: '🦅', hint: 'What Pidgey learns to do' },
    { word: 'zap', emoji: '⚡', hint: 'Pikachu loves to ___ things' },
    { word: 'win', emoji: '🏆', hint: 'What you do in a battle' },
    { word: 'map', emoji: '🗺️', hint: 'Helps you find new places' },
    { word: 'fin', emoji: '🦈', hint: 'Fish Pokemon have these' },
    { word: 'hot', emoji: '🌡️', hint: 'Fire-type Pokemon are very ___' },
    { word: 'ice', emoji: '🧊', hint: 'Articuno is made of ___' },
    { word: 'mud', emoji: '💩', hint: 'Ground-types play in ___' },
    { word: 'log', emoji: '🪵', hint: 'A piece of a tree trunk' },
    { word: 'den', emoji: '🏕️', hint: 'A hiding spot for Pokemon' },
    { word: 'web', emoji: '🕸️', hint: 'Spinarak makes a ___' },
    { word: 'paw', emoji: '🐾', hint: 'A Pokemon\'s foot' },
    { word: 'fur', emoji: '🐾', hint: 'Eevee has soft ___' },
    { word: 'gem', emoji: '💎', hint: 'Sableye loves to eat these' },
    { word: 'orb', emoji: '🔮', hint: 'A round glowing sphere' },
  ];
  const words2 = [
    { word: 'fire', emoji: '🔥', hint: 'Charmander\'s tail flame type' },
    { word: 'ball', emoji: '⚾', hint: 'Poke___ to catch Pokemon' },
    { word: 'rain', emoji: '🌧️', hint: 'Water type weather' },
    { word: 'leaf', emoji: '🍃', hint: 'Used by Grass-type Pokemon' },
    { word: 'cave', emoji: '🕳️', hint: 'Where Zubat live' },
    { word: 'heal', emoji: '💊', hint: 'Potions do this' },
    { word: 'jump', emoji: '⬆️', hint: 'Scyther can do this high' },
    { word: 'wave', emoji: '🌊', hint: 'Lapras surfs on the ___' },
    { word: 'claw', emoji: '🦀', hint: 'Krabby has big ___s' },
    { word: 'rock', emoji: '🪨', hint: 'Geodude is this type' },
    { word: 'wing', emoji: '🦅', hint: 'Flying Pokemon have these' },
    { word: 'tail', emoji: '🐒', hint: 'Most Pokemon have one' },
    { word: 'fang', emoji: '🦷', hint: 'Arbok has sharp ___s' },
    { word: 'beam', emoji: '✨', hint: 'A powerful light attack' },
    { word: 'nest', emoji: '🪺', hint: 'Where bird Pokemon lay eggs' },
    { word: 'lake', emoji: '💧', hint: 'Where Water Pokemon swim' },
    { word: 'sand', emoji: '🏖️', hint: 'Sandshrew digs through ___' },
    { word: 'vine', emoji: '🌱', hint: 'Bulbasaur uses ___ Whip' },
    { word: 'horn', emoji: '🦏', hint: 'Nidoran has a sharp ___' },
    { word: 'dust', emoji: '💨', hint: 'Sand Attack makes a cloud of ___' },
    { word: 'mist', emoji: '🌫️', hint: 'A move that raises evasion' },
    { word: 'trap', emoji: '🪤', hint: 'Team Rocket sets one for Pikachu' },
    { word: 'herb', emoji: '🌿', hint: 'Revival ___ heals fainted Pokemon' },
  ];
  const words3 = [
    { word: 'battle', emoji: '⚔️', hint: 'When two Pokemon fight' },
    { word: 'forest', emoji: '🌲', hint: 'Grass-types live here' },
    { word: 'evolve', emoji: '✨', hint: 'What Charmander does to become Charmeleon' },
    { word: 'trainer', emoji: '👤', hint: 'The person who guides Pokemon' },
    { word: 'poison', emoji: '☠️', hint: 'Grimer\'s type' },
    { word: 'flying', emoji: '🦅', hint: 'Pidgeot\'s type' },
    { word: 'status', emoji: '📋', hint: 'Sleep and burn are ___ effects' },
    { word: 'attack', emoji: '💥', hint: 'A move used in battle' },
    { word: 'defend', emoji: '🛡️', hint: 'Protect yourself from damage' },
    { word: 'energy', emoji: '⚡', hint: 'Pokemon use this to fight' },
    { word: 'island', emoji: '🏝️', hint: 'Cinnabar is an ___' },
    { word: 'tunnel', emoji: '🚇', hint: 'Diglett digs long ___s' },
    { word: 'rocket', emoji: '🚀', hint: 'Team ___ are the villains' },
    { word: 'freeze', emoji: '🥶', hint: 'Ice Beam can ___ opponents' },
    { word: 'shadow', emoji: '👥', hint: 'Gengar hides in ___s' },
    { word: 'ground', emoji: '🌍', hint: 'Diglett is this type' },
    { word: 'center', emoji: '🏥', hint: 'Pokemon ___ is where you heal' },
    { word: 'health', emoji: '❤️', hint: 'HP stands for hit points or ___' },
    { word: 'shield', emoji: '🛡️', hint: 'Protects from attacks' },
    { word: 'normal', emoji: '⚪', hint: 'Eevee and Snorlax are this type' },
    { word: 'dragon', emoji: '🐉', hint: 'Dragonite is this powerful type' },
    { word: 'escape', emoji: '🏃', hint: 'Use an ___ Rope to leave a cave' },
    { word: 'spirit', emoji: '👻', hint: 'Ghost Pokemon are full of ___' },
  ];
  const words4 = [
    { word: 'electric', emoji: '⚡', hint: 'Pikachu\'s type' },
    { word: 'legendary', emoji: '🌟', hint: 'Very rare and special Pokemon' },
    { word: 'evolution', emoji: '🔄', hint: 'How Pokemon transform and grow' },
    { word: 'champion', emoji: '🏆', hint: 'The best trainer in the region' },
    { word: 'pokedex', emoji: '📱', hint: 'The device that records Pokemon data' },
    { word: 'professor', emoji: '👨‍🔬', hint: 'Professor Oak gives starters' },
    { word: 'adventure', emoji: '🗺️', hint: 'What every Pokemon journey is' },
    { word: 'weakness', emoji: '📉', hint: 'Every type has one' },
    { word: 'psychic', emoji: '🔮', hint: 'Alakazam and Mewtwo\'s type' },
    { word: 'strategy', emoji: '🧠', hint: 'A smart plan for battle' },
    { word: 'powerful', emoji: '💪', hint: 'Mewtwo is very ___' },
    { word: 'training', emoji: '🏋️', hint: 'How Pokemon get stronger' },
    { word: 'catching', emoji: '🎯', hint: 'Throwing Poke Balls to capture Pokemon' },
    { word: 'swimming', emoji: '🏊', hint: 'What Lapras does across the ocean' },
    { word: 'sleeping', emoji: '😴', hint: 'What Snorlax does all day' },
    { word: 'research', emoji: '🔬', hint: 'What Professor Oak does' },
    { word: 'strength', emoji: '💪', hint: 'An HM move to push boulders' },
    { word: 'surfing', emoji: '🏄', hint: 'Riding a Pokemon across water' },
    { word: 'fighting', emoji: '🥊', hint: 'Machop is this type' },
    { word: 'medicine', emoji: '💊', hint: 'Potions are a type of ___' },
    { word: 'treasure', emoji: '💰', hint: 'Hidden items are like buried ___' },
    { word: 'movement', emoji: '🏃', hint: 'Speed determines how fast your ___' },
    { word: 'darkness', emoji: '🌑', hint: 'Dark-type moves harness ___' },
  ];

  let pool;
  if (difficulty <= 2) pool = words1;
  else if (difficulty <= 3) pool = [...words1, ...words2];
  else if (difficulty <= 4) pool = [...words2, ...words3];
  else pool = [...words3, ...words4];

  const item = randItem(pool);
  const word = item.word;
  const letters = shuffleArray(word.split(''));

  // Generate wrong spellings (anagrams or near-misses)
  const wrongWords = [];
  for (let i = 0; i < 5 && wrongWords.length < 3; i++) {
    const w = word.split('');
    const a = Math.floor(Math.random() * w.length);
    let b = Math.floor(Math.random() * w.length);
    while (b === a) b = Math.floor(Math.random() * w.length);
    [w[a], w[b]] = [w[b], w[a]];
    const candidate = w.join('');
    if (candidate !== word && !wrongWords.includes(candidate)) wrongWords.push(candidate);
  }
  // Fallback wrongs
  const fallbackWrongs = [word + 'e', word.slice(0, -1) + 'a', word[0] + word.slice(2)];
  for (const fw of fallbackWrongs) {
    if (wrongWords.length >= 3) break;
    if (fw !== word && !wrongWords.includes(fw)) wrongWords.push(fw);
  }

  const choices = shuffleArray([word, ...wrongWords.slice(0, 3)]);

  return {
    type: 'pokedexSpeller',
    question: `${item.emoji} Spell the word shown by this picture:`,
    answer: word,
    choices,
    hint: item.hint,
    emoji: item.emoji,
    letters,
    word,
  };
}

// ---------------------------------------------------------------------------
// 9. genNumberLineRace — Number between two values
// ---------------------------------------------------------------------------
function genNumberLineRace(difficulty) {
  difficulty = difficulty || 2;

  const ranges = {
    1: [1, 10],
    2: [1, 10],
    3: [1, 20],
    4: [1, 50],
    5: [10, 100],
  };
  const [min, max] = ranges[difficulty] || [1, 10];

  // Pick two numbers with at least one between them
  let a, b, answer;
  let attempts = 0;
  do {
    a = min + Math.floor(Math.random() * (max - min - 1));
    b = a + 2 + Math.floor(Math.random() * 3);
    if (b > max) b = max;
    answer = a + Math.floor((b - a) / 2);
    attempts++;
  } while (b - a < 2 && attempts < 50);
  if (b - a < 2) { a = 3; b = 7; answer = 5; }

  const wrongNums = wrongNumbers(answer, 3, 3);
  const choices = buildChoices(answer, wrongNums.map(String));

  return {
    type: 'numberLineRace',
    question: `On Pikachu's Number Line Race, which number comes between ${a} and ${b}?`,
    answer: String(answer),
    choices,
    hint: `Count up from ${a} one step at a time!`,
    low: a,
    high: b,
  };
}

// ---------------------------------------------------------------------------
// 10. genMoreOrLess — Compare quantities
// ---------------------------------------------------------------------------
function genMoreOrLess(difficulty) {
  difficulty = difficulty || 1;

  const groupEmoji = ['⭐', '🔥', '💧', '🌿', '⚡', '💎', '✨', '🎯', '🐱', '🍎', '🫐', '🍓'];

  const ranges = {
    1: [1, 5],
    2: [1, 10],
    3: [2, 15],
    4: [5, 20],
    5: [5, 30],
  };
  const [min, max] = ranges[difficulty] || [1, 5];

  let a, b;
  do {
    a = min + Math.floor(Math.random() * (max - min));
    b = min + Math.floor(Math.random() * (max - min));
  } while (a === b);

  const emojiA = randItem(groupEmoji);
  let emojiB;
  do { emojiB = randItem(groupEmoji); } while (emojiB === emojiA);

  const correctAnswer = a > b ? 'A' : 'B';

  return {
    type: 'moreOrLess',
    question: 'Which group has MORE?',
    answer: correctAnswer,
    choices: ['A', 'B'],
    hint: 'Count each group and compare!',
    countA: a,
    countB: b,
    emojiA,
    emojiB,
  };
}

// =============================================================================
// SECTION 3 — 1ST GRADE ACTIVITIES (Level 3)
// =============================================================================

// ---------------------------------------------------------------------------
// 11. genPotionMixer — Addition/subtraction word problems
// ---------------------------------------------------------------------------
function genPotionMixer(difficulty) {
  difficulty = difficulty || 3;

  const templates = [
    // Addition templates
    (a, b) => ({
      question: `Professor Oak has ${a} Potions. He finds ${b} more in his bag. How many Potions does he have now?`,
      answer: a + b,
      op: '+',
    }),
    (a, b) => ({
      question: `Ash caught ${a} Pokemon today and ${b} Pokemon yesterday. How many Pokemon did he catch in total?`,
      answer: a + b,
      op: '+',
    }),
    (a, b) => ({
      question: `Misty has ${a} Water-type Pokemon. Brock has ${b}. How many Water-type Pokemon do they have together?`,
      answer: a + b,
      op: '+',
    }),
    (a, b) => ({
      question: `There are ${a} Pokemon in the tall grass and ${b} more at the lake. How many Pokemon are there altogether?`,
      answer: a + b,
      op: '+',
    }),
    (a, b) => ({
      question: `Pikachu collected ${a} berries in the morning and ${b} in the afternoon. How many berries in total?`,
      answer: a + b,
      op: '+',
    }),
    (a, b) => ({
      question: `The Poke Mart sold ${a} Poke Balls on Monday and ${b} on Tuesday. How many did they sell altogether?`,
      answer: a + b,
      op: '+',
    }),
    (a, b) => ({
      question: `Team Rocket has ${a} Pokemon and they steal ${b} more. How many do they have now?`,
      answer: a + b,
      op: '+',
    }),
    (a, b) => ({
      question: `Bulbasaur found ${a} apples and Squirtle found ${b}. How many apples did they find together?`,
      answer: a + b,
      op: '+',
    }),
    (a, b) => ({
      question: `Brock baked ${a} cookies for his Pokemon and ${b} for Ash's Pokemon. How many cookies did he bake?`,
      answer: a + b,
      op: '+',
    }),
    (a, b) => ({
      question: `There are ${a} trainers at the gym and ${b} more arrive. How many trainers are there now?`,
      answer: a + b,
      op: '+',
    }),
    // Additional addition templates
    (a, b) => ({
      question: `Eevee collected ${a} shiny stones and found ${b} more hidden in the grass. How many stones does Eevee have?`,
      answer: a + b,
      op: '+',
    }),
    (a, b) => ({
      question: `Brock has ${a} Rock-type Pokemon and catches ${b} more. How many Rock-type Pokemon does he have now?`,
      answer: a + b,
      op: '+',
    }),
    (a, b) => ({
      question: `There are ${a} Pidgey in a tree and ${b} more fly in. How many Pidgey are in the tree?`,
      answer: a + b,
      op: '+',
    }),
    (a, b) => ({
      question: `Nurse Joy healed ${a} Pokemon in the morning and ${b} in the afternoon. How many did she heal today?`,
      answer: a + b,
      op: '+',
    }),
    (a, b) => ({
      question: `Meowth found ${a} coins on Monday and ${b} coins on Wednesday. How many coins did Meowth find?`,
      answer: a + b,
      op: '+',
    }),
    (a, b) => ({
      question: `Snorlax ate ${a} apples and then ate ${b} more. How many apples did Snorlax eat altogether?`,
      answer: a + b,
      op: '+',
    }),
    (a, b) => ({
      question: `Lapras carried ${a} trainers across the lake and then ${b} more. How many trainers did Lapras carry?`,
      answer: a + b,
      op: '+',
    }),
    (a, b) => ({
      question: `Professor Elm discovered ${a} new Pokemon and his assistant found ${b} more. How many new Pokemon were discovered?`,
      answer: a + b,
      op: '+',
    }),
    (a, b) => ({
      question: `Jigglypuff sang to ${a} Pokemon and then sang to ${b} more. How many Pokemon heard the song?`,
      answer: a + b,
      op: '+',
    }),
    (a, b) => ({
      question: `Chansey gave ${a} eggs to Nurse Joy and ${b} eggs to Brock. How many eggs did Chansey give away?`,
      answer: a + b,
      op: '+',
    }),
    (a, b) => ({
      question: `There are ${a} Water Pokemon in the river and ${b} in the pond. How many Water Pokemon are there total?`,
      answer: a + b,
      op: '+',
    }),
    (a, b) => ({
      question: `Dragonite delivered ${a} letters in the morning and ${b} in the evening. How many letters in all?`,
      answer: a + b,
      op: '+',
    }),
    (a, b) => ({
      question: `Magikarp splashed ${a} times, rested, then splashed ${b} more times. How many splashes total?`,
      answer: a + b,
      op: '+',
    }),
    (a, b) => ({
      question: `The Safari Zone has ${a} Tauros and ${b} Kangaskhan. How many Pokemon is that altogether?`,
      answer: a + b,
      op: '+',
    }),
    (a, b) => ({
      question: `Squirtle Squad has ${a} members and ${b} new Squirtle join. How many are in the squad now?`,
      answer: a + b,
      op: '+',
    }),
    // Subtraction templates
    (a, b) => ({
      question: `Nurse Joy had ${a + b} Potions. She used ${b} to heal Pokemon. How many Potions are left?`,
      answer: a,
      op: '-',
    }),
    (a, b) => ({
      question: `Pikachu had ${a + b} berries. He ate ${b} of them. How many berries does Pikachu have left?`,
      answer: a,
      op: '-',
    }),
    (a, b) => ({
      question: `The Pokedex had ${a + b} Pokemon listed. ${b} were already caught. How many are still uncaught?`,
      answer: a,
      op: '-',
    }),
    (a, b) => ({
      question: `A trainer started with ${a + b} Poke Balls and threw ${b}. How many Poke Balls remain?`,
      answer: a,
      op: '-',
    }),
    (a, b) => ({
      question: `Snorlax had ${a + b} pieces of fruit. He ate ${b} for breakfast. How many are left?`,
      answer: a,
      op: '-',
    }),
    (a, b) => ({
      question: `Ash had ${a + b} badges but ${b} were broken. How many good badges does he have?`,
      answer: a,
      op: '-',
    }),
    (a, b) => ({
      question: `The Pokemon Center had ${a + b} beds. ${b} are occupied. How many beds are empty?`,
      answer: a,
      op: '-',
    }),
    (a, b) => ({
      question: `Misty caught ${a + b} Water Pokemon. She traded ${b} away. How many does she still have?`,
      answer: a,
      op: '-',
    }),
    (a, b) => ({
      question: `There were ${a + b} Caterpie on the tree. ${b} evolved into Metapod. How many Caterpie are left?`,
      answer: a,
      op: '-',
    }),
    (a, b) => ({
      question: `Professor Oak had ${a + b} research notes. He filed ${b} of them. How many are still on his desk?`,
      answer: a,
      op: '-',
    }),
    // Additional subtraction templates
    (a, b) => ({
      question: `Eevee had ${a + b} berries but shared ${b} with friends. How many berries does Eevee have left?`,
      answer: a,
      op: '-',
    }),
    (a, b) => ({
      question: `There were ${a + b} Magikarp in the lake. ${b} evolved into Gyarados. How many Magikarp remain?`,
      answer: a,
      op: '-',
    }),
    (a, b) => ({
      question: `Brock cooked ${a + b} rice balls. The Pokemon ate ${b} of them. How many are left?`,
      answer: a,
      op: '-',
    }),
    (a, b) => ({
      question: `The daycare had ${a + b} eggs. ${b} of them hatched. How many eggs are still unhatched?`,
      answer: a,
      op: '-',
    }),
    (a, b) => ({
      question: `Meowth collected ${a + b} coins. He lost ${b} coins running away. How many coins does Meowth still have?`,
      answer: a,
      op: '-',
    }),
    (a, b) => ({
      question: `There were ${a + b} Zubat in the cave. ${b} flew outside. How many Zubat are still in the cave?`,
      answer: a,
      op: '-',
    }),
    (a, b) => ({
      question: `Dragonite carried ${a + b} letters. It delivered ${b} of them. How many letters are left to deliver?`,
      answer: a,
      op: '-',
    }),
    (a, b) => ({
      question: `The Safari Zone had ${a + b} rare Pokemon. ${b} were caught by trainers. How many rare Pokemon are left?`,
      answer: a,
      op: '-',
    }),
    (a, b) => ({
      question: `Lapras was carrying ${a + b} passengers. ${b} got off at the island. How many passengers are still riding?`,
      answer: a,
      op: '-',
    }),
    (a, b) => ({
      question: `Jigglypuff had ${a + b} songs to sing. It already sang ${b} of them. How many songs are left?`,
      answer: a,
      op: '-',
    }),
    (a, b) => ({
      question: `Professor Elm had ${a + b} Poke Balls. He gave ${b} to new trainers. How many does he have left?`,
      answer: a,
      op: '-',
    }),
    (a, b) => ({
      question: `Chansey was carrying ${a + b} eggs. ${b} were given to the nursery. How many eggs does Chansey still carry?`,
      answer: a,
      op: '-',
    }),
    (a, b) => ({
      question: `There were ${a + b} trainers in the tournament. ${b} lost their matches. How many trainers are still competing?`,
      answer: a,
      op: '-',
    }),
    (a, b) => ({
      question: `Squirtle had ${a + b} water balloons. It threw ${b} at Team Rocket. How many water balloons are left?`,
      answer: a,
      op: '-',
    }),
    (a, b) => ({
      question: `The Poke Mart stocked ${a + b} Revives. Trainers bought ${b} of them. How many Revives are still in stock?`,
      answer: a,
      op: '-',
    }),
  ];

  // Number ranges by difficulty
  const numRanges = {
    1: [1, 5],
    2: [1, 10],
    3: [1, 15],
    4: [5, 20],
    5: [10, 50],
  };
  const [lo, hi] = numRanges[difficulty] || [1, 15];

  const template = randItem(templates);
  const a = lo + Math.floor(Math.random() * (hi - lo));
  const b = lo + Math.floor(Math.random() * (Math.max(1, hi - lo - a)));
  const result = template(a, b);

  const wrongNums = wrongNumbers(result.answer, 3, Math.max(2, Math.floor((hi - lo) / 2)));
  const choices = buildChoices(result.answer, wrongNums.map(String));

  return {
    type: 'potionMixer',
    question: result.question,
    answer: String(result.answer),
    choices,
    hint: result.op === '+' ? 'Add the two numbers together!' : 'Subtract to find what\'s left!',
    operation: result.op,
  };
}

// ---------------------------------------------------------------------------
// 12. genSightWordScramble — Unscramble common sight words
// ---------------------------------------------------------------------------
function genSightWordScramble(difficulty) {
  difficulty = difficulty || 3;

  const words1 = ['the', 'and', 'was', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'one', 'our', 'out', 'has', 'his', 'how', 'its', 'let', 'may', 'new', 'old', 'own', 'say', 'she', 'too', 'use', 'way', 'who', 'did', 'get', 'got', 'had', 'him', 'put', 'ran', 'see', 'set', 'two', 'why'];
  const words2 = ['that', 'with', 'have', 'this', 'they', 'from', 'word', 'what', 'said', 'each', 'which', 'when', 'your', 'also', 'back', 'been', 'call', 'came', 'come', 'does', 'down', 'find', 'give', 'good', 'help', 'here', 'just', 'know', 'like', 'long', 'look', 'make', 'many', 'more', 'most', 'much', 'must', 'name', 'need', 'next'];
  const words3 = ['there', 'their', 'about', 'would', 'other', 'could', 'write', 'first', 'water', 'found', 'great', 'house', 'large', 'learn', 'never', 'place', 'plant', 'point', 'right', 'small', 'sound', 'spell', 'still', 'study', 'thing', 'think', 'three', 'under', 'where', 'world', 'young', 'after', 'again', 'began', 'being', 'below', 'every', 'group', 'night', 'paper'];
  const words4 = ['because', 'between', 'another', 'through', 'without', 'thought', 'strange', 'problem', 'special', 'against', 'already', 'animals', 'answers', 'believe', 'brought', 'changed', 'country', 'example', 'finally', 'follows', 'himself', 'however', 'instead', 'learned', 'morning', 'nothing', 'picture', 'quickly', 'reading', 'several'];

  let pool;
  if (difficulty <= 2) pool = words1;
  else if (difficulty <= 3) pool = [...words1, ...words2];
  else if (difficulty <= 4) pool = [...words2, ...words3];
  else pool = [...words3, ...words4];

  // Deduplicate
  pool = [...new Set(pool)];

  const word = randItem(pool);

  // Scramble letters (ensure it's different from original)
  let scrambled;
  let attempts = 0;
  do {
    scrambled = shuffleArray(word.split('')).join('');
    attempts++;
  } while (scrambled === word && attempts < 20);
  if (scrambled === word) {
    // Force a swap
    const arr = word.split('');
    if (arr.length >= 2) { [arr[0], arr[arr.length - 1]] = [arr[arr.length - 1], arr[0]]; }
    scrambled = arr.join('');
  }

  // Generate wrong words (other words from the pool)
  const wrongWords = randItems(pool.filter(w => w !== word), 3);
  // Pad if pool too small
  const fallback = ['jump', 'play', 'stop', 'look', 'walk'];
  while (wrongWords.length < 3) wrongWords.push(randItem(fallback));

  const choices = shuffleArray([word, ...wrongWords.slice(0, 3)]);

  return {
    type: 'sightWordScramble',
    question: `Unscramble this word: "${scrambled.toUpperCase()}"`,
    answer: word,
    choices,
    hint: `The word has ${word.length} letters.`,
    scrambled,
    word,
  };
}

// ---------------------------------------------------------------------------
// 13. genStorySequence — Order story events
// ---------------------------------------------------------------------------
function genStorySequence() {
  const stories = [
    {
      title: 'Pikachu\'s Morning',
      events: [
        'Pikachu woke up and stretched.',
        'Pikachu ate breakfast with Ash.',
        'They headed to the Pokemon Gym.',
        'Pikachu defeated the Gym Leader!',
      ],
      question: 'What did Pikachu do FIRST?',
      answer: 'Pikachu woke up and stretched.',
    },
    {
      title: 'Catching Charmander',
      events: [
        'Ash spotted a Charmander in the wild.',
        'Ash threw a Poke Ball at Charmander.',
        'The ball wiggled three times.',
        'Ash added Charmander to his team!',
      ],
      question: 'What happened right BEFORE Ash threw the ball?',
      answer: 'Ash spotted a Charmander in the wild.',
    },
    {
      title: 'Bulbasaur Evolves',
      events: [
        'Bulbasaur trained very hard every day.',
        'A bright light surrounded Bulbasaur.',
        'Bulbasaur changed shape and grew bigger.',
        'Ivysaur stood proud after the evolution!',
      ],
      question: 'What happened AFTER the bright light?',
      answer: 'Bulbasaur changed shape and grew bigger.',
    },
    {
      title: 'The Potion Shop',
      events: [
        'Ash counted the coins in his pocket.',
        'Ash walked into the Poke Mart.',
        'Ash bought three Potions.',
        'Ash healed his tired Pokemon.',
      ],
      question: 'What did Ash do LAST?',
      answer: 'Ash healed his tired Pokemon.',
    },
    {
      title: 'Squirtle\'s Swim',
      events: [
        'Squirtle jumped into the sparkling lake.',
        'Squirtle swam after a fast Magikarp.',
        'Squirtle practiced Water Gun three times.',
        'Squirtle returned to shore, tired but happy.',
      ],
      question: 'What did Squirtle do SECOND?',
      answer: 'Squirtle swam after a fast Magikarp.',
    },
    {
      title: 'Gengar\'s Trick',
      events: [
        'Gengar hid in the shadows of the cave.',
        'A trainer walked into the dark cave.',
        'Gengar leapt out and scared the trainer!',
        'The trainer laughed and offered a berry.',
      ],
      question: 'What happened AFTER Gengar scared the trainer?',
      answer: 'The trainer laughed and offered a berry.',
    },
    {
      title: 'Professor Oak\'s Discovery',
      events: [
        'Professor Oak opened his research notebook.',
        'He observed a new Pokemon in the field.',
        'He carefully wrote down all his notes.',
        'He added it to the Pokedex database.',
      ],
      question: 'What did Professor Oak do FIRST?',
      answer: 'Professor Oak opened his research notebook.',
    },
    // Expanded stories
    {
      title: 'Eevee\'s Big Day',
      events: [
        'Eevee found a shiny stone on the ground.',
        'Eevee touched the stone and began to glow.',
        'A bright flash of light filled the room.',
        'Eevee had evolved into Vaporeon!',
      ],
      question: 'What happened right BEFORE Eevee began to glow?',
      answer: 'Eevee found a shiny stone on the ground.',
    },
    {
      title: 'Team Rocket\'s Plan',
      events: [
        'Jessie and James put on disguises.',
        'They set a trap near the Pokemon Center.',
        'Pikachu walked right into the trap!',
        'Ash and friends rescued Pikachu just in time.',
      ],
      question: 'What did Jessie and James do FIRST?',
      answer: 'Jessie and James put on disguises.',
    },
    {
      title: 'Snorlax Wakes Up',
      events: [
        'Snorlax was sleeping in the middle of the road.',
        'Ash played a melody on the Poke Flute.',
        'Snorlax slowly opened its eyes.',
        'Snorlax stood up and looked for food.',
      ],
      question: 'What did Ash use to wake Snorlax?',
      answer: 'Ash played a melody on the Poke Flute.',
    },
    {
      title: 'The Fishing Trip',
      events: [
        'Misty packed her fishing rod and bait.',
        'She cast her line into the calm lake.',
        'Something big tugged on the hook!',
        'Misty pulled out a splashing Magikarp.',
      ],
      question: 'What happened LAST?',
      answer: 'Misty pulled out a splashing Magikarp.',
    },
    {
      title: 'Brock\'s Cooking',
      events: [
        'Brock gathered berries from the bushes.',
        'He chopped the berries into small pieces.',
        'He mixed everything in a big pot.',
        'All the Pokemon enjoyed the delicious stew.',
      ],
      question: 'What did Brock do SECOND?',
      answer: 'He chopped the berries into small pieces.',
    },
    {
      title: 'Caterpie\'s Dream',
      events: [
        'Caterpie stared up at the beautiful Butterfree.',
        'Caterpie trained hard every single day.',
        'Caterpie evolved into a still Metapod.',
        'Metapod finally became a graceful Butterfree!',
      ],
      question: 'What happened AFTER Caterpie trained hard?',
      answer: 'Caterpie evolved into a still Metapod.',
    },
    {
      title: 'The Storm at Sea',
      events: [
        'Dark clouds gathered over the ocean.',
        'Huge waves rocked the small boat.',
        'Lapras appeared and calmed the waters.',
        'Everyone rode safely to shore on Lapras.',
      ],
      question: 'What happened BEFORE the waves rocked the boat?',
      answer: 'Dark clouds gathered over the ocean.',
    },
    {
      title: 'Lost in the Cave',
      events: [
        'Ash and Pikachu entered the dark cave.',
        'They heard strange echoes all around them.',
        'Pikachu used Flash to light up the cave.',
        'They found the exit and stepped into sunlight.',
      ],
      question: 'What did Pikachu do to help in the cave?',
      answer: 'Pikachu used Flash to light up the cave.',
    },
    {
      title: 'The Badge Ceremony',
      events: [
        'Ash challenged the Gym Leader to a battle.',
        'Pikachu battled bravely and won the fight.',
        'The Gym Leader handed Ash a shiny badge.',
        'Ash pinned the new badge inside his jacket.',
      ],
      question: 'What happened AFTER Pikachu won the fight?',
      answer: 'The Gym Leader handed Ash a shiny badge.',
    },
    {
      title: 'Magikarp\'s Surprise',
      events: [
        'Everyone laughed at the weak Magikarp.',
        'Magikarp kept splashing in the lake every day.',
        'One day Magikarp began to glow and grow.',
        'A powerful Gyarados burst out of the water!',
      ],
      question: 'What did Magikarp do every day before evolving?',
      answer: 'Magikarp kept splashing in the lake every day.',
    },
    {
      title: 'The Pokemon Race',
      events: [
        'Trainers lined up their Pokemon at the start.',
        'The referee blew the whistle to begin.',
        'Rapidash sprinted ahead of everyone.',
        'Rapidash crossed the finish line first!',
      ],
      question: 'What happened FIRST?',
      answer: 'Trainers lined up their Pokemon at the start.',
    },
    {
      title: 'Nurse Joy\'s Busy Night',
      events: [
        'Many injured Pokemon arrived at the center.',
        'Nurse Joy and Chansey worked through the night.',
        'They gave each Pokemon medicine and rest.',
        'By morning, every Pokemon was healthy again.',
      ],
      question: 'What happened LAST?',
      answer: 'By morning, every Pokemon was healthy again.',
    },
    {
      title: 'Jigglypuff\'s Concert',
      events: [
        'Jigglypuff set up a stage in the park.',
        'A big crowd of Pokemon and trainers gathered.',
        'Jigglypuff began to sing its beautiful song.',
        'Everyone fell asleep before the song ended!',
      ],
      question: 'What happened AFTER Jigglypuff began to sing?',
      answer: 'Everyone fell asleep before the song ended!',
    },
    // Additional stories
    {
      title: 'Meowth Learns to Talk',
      events: [
        'Meowth watched humans speak from a rooftop.',
        'He practiced saying words every single night.',
        'Meowth finally spoke his very first sentence.',
        'The other Pokemon were amazed at his talent!',
      ],
      question: 'What did Meowth do FIRST?',
      answer: 'Meowth watched humans speak from a rooftop.',
    },
    {
      title: 'The Egg Hatches',
      events: [
        'Ash found a mysterious egg on the road.',
        'He kept it warm in his backpack for days.',
        'The egg began to crack and glow brightly.',
        'A tiny Togepi popped out and smiled!',
      ],
      question: 'What happened right BEFORE the egg cracked?',
      answer: 'He kept it warm in his backpack for days.',
    },
    {
      title: 'Diglett\'s Tunnel',
      events: [
        'Diglett started digging a new tunnel underground.',
        'It dug past roots, rocks, and buried items.',
        'The tunnel reached all the way to the next town.',
        'Trainers used Diglett\'s tunnel as a shortcut!',
      ],
      question: 'What happened LAST?',
      answer: 'Trainers used Diglett\'s tunnel as a shortcut!',
    },
    {
      title: 'Psyduck\'s Headache',
      events: [
        'Psyduck started to get a terrible headache.',
        'The headache grew stronger and stronger.',
        'Psyduck unleashed a powerful Psychic blast!',
        'The headache went away and Psyduck felt better.',
      ],
      question: 'What happened AFTER the Psychic blast?',
      answer: 'The headache went away and Psyduck felt better.',
    },
    {
      title: 'Building a Treehouse',
      events: [
        'Ash and friends found a big, strong tree.',
        'They gathered wood and nails from the town.',
        'They built a cozy treehouse in the branches.',
        'All their Pokemon played together inside it!',
      ],
      question: 'What did they do SECOND?',
      answer: 'They gathered wood and nails from the town.',
    },
    {
      title: 'Growlithe to the Rescue',
      events: [
        'A small Oddish got stuck on a high ledge.',
        'Officer Jenny called her Growlithe for help.',
        'Growlithe climbed up and carefully carried Oddish.',
        'Oddish was safely returned to the garden below.',
      ],
      question: 'What happened FIRST?',
      answer: 'A small Oddish got stuck on a high ledge.',
    },
    {
      title: 'Pikachu\'s Ketchup',
      events: [
        'Pikachu found a bottle of ketchup on the table.',
        'Pikachu hugged the bottle tightly with both paws.',
        'Ash tried to take the ketchup back for lunch.',
        'Pikachu refused to let go and ran away with it!',
      ],
      question: 'What did Ash try to do?',
      answer: 'Ash tried to take the ketchup back for lunch.',
    },
    {
      title: 'Abra\'s Escape',
      events: [
        'A trainer spotted a sleeping Abra in the grass.',
        'The trainer quietly crept closer and closer.',
        'The trainer threw a Poke Ball with great aim.',
        'Abra teleported away at the very last second!',
      ],
      question: 'What happened LAST?',
      answer: 'Abra teleported away at the very last second!',
    },
    {
      title: 'The Berry Garden',
      events: [
        'Ash planted berry seeds in a patch of soil.',
        'He watered them every morning without fail.',
        'The berry bushes grew tall and full of fruit.',
        'All the Pokemon feasted on the ripe berries.',
      ],
      question: 'What did Ash do right AFTER planting seeds?',
      answer: 'He watered them every morning without fail.',
    },
    {
      title: 'Ditto\'s Trick',
      events: [
        'Ditto transformed into a copy of Pikachu.',
        'Everyone thought there were two Pikachus.',
        'The real Pikachu used Thunderbolt to prove itself.',
        'Ditto turned back to its normal pink form.',
      ],
      question: 'What happened AFTER everyone was confused?',
      answer: 'The real Pikachu used Thunderbolt to prove itself.',
    },
    {
      title: 'Vulpix\'s Grooming',
      events: [
        'Brock brushed Vulpix\'s beautiful six tails.',
        'He tied a small ribbon on each tail.',
        'Vulpix looked at itself in the mirror proudly.',
        'Vulpix pranced around showing off to everyone.',
      ],
      question: 'What did Brock do FIRST?',
      answer: 'Brock brushed Vulpix\'s beautiful six tails.',
    },
    {
      title: 'The Pokeflute Player',
      events: [
        'An old man sat down on a hill with his flute.',
        'He played a gentle melody across the valley.',
        'Wild Pokemon gathered around to listen peacefully.',
        'When the song ended, the Pokemon danced with joy.',
      ],
      question: 'What happened BEFORE the Pokemon gathered?',
      answer: 'He played a gentle melody across the valley.',
    },
    {
      title: 'Arcanine\'s Race',
      events: [
        'Arcanine lined up at the starting line.',
        'The whistle blew and Arcanine sprinted forward.',
        'Arcanine ran so fast it was just a blur.',
        'Arcanine won first place and got a gold medal!',
      ],
      question: 'What happened SECOND?',
      answer: 'The whistle blew and Arcanine sprinted forward.',
    },
    {
      title: 'The Lost Clefairy',
      events: [
        'A little Clefairy wandered away from Mt. Moon.',
        'It got lost in the big, unfamiliar forest.',
        'Ash found Clefairy and offered it some food.',
        'Ash guided Clefairy safely back to Mt. Moon.',
      ],
      question: 'What happened LAST?',
      answer: 'Ash guided Clefairy safely back to Mt. Moon.',
    },
    {
      title: 'Slowpoke\'s Fishing',
      events: [
        'Slowpoke sat by the river and dipped its tail in.',
        'It waited very patiently for hours and hours.',
        'A Shellder finally bit onto Slowpoke\'s tail.',
        'Slowpoke evolved into Slowbro right before everyone!',
      ],
      question: 'What happened AFTER Shellder bit the tail?',
      answer: 'Slowpoke evolved into Slowbro right before everyone!',
    },
    {
      title: 'Chansey\'s Hospital',
      events: [
        'Chansey prepared medicine for the sick Pokemon.',
        'It carefully measured each dose into small cups.',
        'Chansey delivered the medicine to every room.',
        'All the patients started feeling better by evening.',
      ],
      question: 'What did Chansey do FIRST?',
      answer: 'Chansey prepared medicine for the sick Pokemon.',
    },
    {
      title: 'The Surfing Lesson',
      events: [
        'Ash asked Lapras to teach him how to surf.',
        'Lapras swam to calm, shallow water near shore.',
        'Ash stood on Lapras\'s back and tried to balance.',
        'After many tries, Ash could finally ride the waves!',
      ],
      question: 'What happened BEFORE Ash tried to balance?',
      answer: 'Lapras swam to calm, shallow water near shore.',
    },
    {
      title: 'Cubone\'s Courage',
      events: [
        'Cubone was afraid of the thunderstorm outside.',
        'Ash sat beside Cubone and told it brave stories.',
        'Cubone slowly stopped shaking and stood up tall.',
        'Cubone faced the storm and was no longer scared!',
      ],
      question: 'What did Ash do to help Cubone?',
      answer: 'Ash sat beside Cubone and told it brave stories.',
    },
    {
      title: 'The Trading Card',
      events: [
        'Ash found a rare holographic Charizard card.',
        'His friend offered to trade three cards for it.',
        'Ash thought about it very carefully all day.',
        'Ash decided to keep his special card forever.',
      ],
      question: 'What happened LAST?',
      answer: 'Ash decided to keep his special card forever.',
    },
    {
      title: 'Onix\'s Bath',
      events: [
        'Brock took his Onix to the river for a bath.',
        'He scrubbed each of Onix\'s rocky segments.',
        'Onix splashed happily in the cool water.',
        'Onix sparkled and looked brand new afterward!',
      ],
      question: 'What did Brock do SECOND?',
      answer: 'He scrubbed each of Onix\'s rocky segments.',
    },
    {
      title: 'The Berry Hunt',
      events: [
        'Misty and her Pokemon went into the forest.',
        'They searched under bushes and behind trees.',
        'Togepi found a huge pile of Oran Berries!',
        'Everyone shared the berries for a tasty snack.',
      ],
      question: 'What did Togepi find?',
      answer: 'Togepi found a huge pile of Oran Berries!',
    },
    {
      title: 'Haunter\'s Prank',
      events: [
        'Haunter floated invisibly through the Pokemon Center.',
        'It made funny faces behind Nurse Joy\'s back.',
        'All the Pokemon burst out laughing at Haunter.',
        'Even Nurse Joy laughed when she turned around!',
      ],
      question: 'What happened FIRST?',
      answer: 'Haunter floated invisibly through the Pokemon Center.',
    },
    {
      title: 'The Mountain Climb',
      events: [
        'Ash and Pikachu set out to climb Mt. Silver.',
        'They climbed higher and higher through the snow.',
        'At the top, they saw the most amazing sunrise.',
        'They high-fived and celebrated reaching the peak!',
      ],
      question: 'What did they see at the top?',
      answer: 'At the top, they saw the most amazing sunrise.',
    },
    {
      title: 'Rapidash\'s Flame',
      events: [
        'Rapidash\'s flame started flickering in the cold.',
        'Ash quickly built a warm shelter from branches.',
        'He gave Rapidash warm berries and a blanket.',
        'Rapidash\'s flame blazed brightly again with energy!',
      ],
      question: 'What happened AFTER Ash gave berries and a blanket?',
      answer: 'Rapidash\'s flame blazed brightly again with energy!',
    },
    {
      title: 'The Pokedex Upgrade',
      events: [
        'Professor Oak called Ash on the video phone.',
        'He told Ash to bring the Pokedex to the lab.',
        'Professor Oak installed a brand new software update.',
        'The Pokedex could now identify even more Pokemon!',
      ],
      question: 'What did Professor Oak do at the lab?',
      answer: 'Professor Oak installed a brand new software update.',
    },
    {
      title: 'Weedle\'s Journey',
      events: [
        'A tiny Weedle fell from its tree in the wind.',
        'It slowly inched along the ground toward home.',
        'A kind Butterfree spotted Weedle and flew down.',
        'Butterfree carried Weedle safely back to the tree.',
      ],
      question: 'What happened LAST?',
      answer: 'Butterfree carried Weedle safely back to the tree.',
    },
    {
      title: 'Machop\'s Training',
      events: [
        'Machop woke up early to start its workout.',
        'It lifted heavy boulders to build its strength.',
        'Machop practiced its karate chops on a log.',
        'By sunset, Machop was stronger than ever before!',
      ],
      question: 'What did Machop do FIRST?',
      answer: 'Machop woke up early to start its workout.',
    },
    {
      title: 'Staryu at the Beach',
      events: [
        'Misty released Staryu to play at the beach.',
        'Staryu spun through the waves like a frisbee.',
        'It found a beautiful pearl at the ocean floor.',
        'Staryu brought the pearl back to show Misty.',
      ],
      question: 'What did Staryu find?',
      answer: 'It found a beautiful pearl at the ocean floor.',
    },
    {
      title: 'The Power Outage',
      events: [
        'A storm knocked out power at the Pokemon Center.',
        'All the healing machines stopped working.',
        'Pikachu used its electricity to power the machines.',
        'Nurse Joy was able to heal all the Pokemon again!',
      ],
      question: 'What happened AFTER the machines stopped?',
      answer: 'Pikachu used its electricity to power the machines.',
    },
    {
      title: 'Butterfree\'s Goodbye',
      events: [
        'Ash raised Butterfree from a tiny Caterpie.',
        'A group of wild Butterfree flew overhead one day.',
        'Ash\'s Butterfree wanted to join them on their journey.',
        'Ash said goodbye with tears and let Butterfree go.',
      ],
      question: 'What happened LAST?',
      answer: 'Ash said goodbye with tears and let Butterfree go.',
    },
  ];

  const story = randItem(stories);
  const wrongChoices = story.events.filter(e => e !== story.answer);
  const choices = shuffleArray([story.answer, ...randItems(wrongChoices, 3)]);

  return {
    type: 'storySequence',
    question: `${story.title}\n\n${story.events.map((e, i) => `${i + 1}. ${e}`).join('\n')}\n\n${story.question}`,
    answer: story.answer,
    choices,
    hint: 'Read each event and think about the order!',
    title: story.title,
    events: story.events,
  };
}

// ---------------------------------------------------------------------------
// 14. genCoinCounter — Add coin values
// ---------------------------------------------------------------------------
function genCoinCounter(difficulty) {
  difficulty = difficulty || 3;

  // Coin values: penny=1, nickel=5, dime=10, quarter=25, dollar=100
  const coinSets = {
    1: [ // pennies only
      { coins: [1, 1, 1], total: 3, display: '🪙🪙🪙 (1¢ each)' },
      { coins: [1, 1, 1, 1], total: 4, display: '🪙🪙🪙🪙 (1¢ each)' },
      { coins: [1, 1, 1, 1, 1], total: 5, display: '🪙🪙🪙🪙🪙 (1¢ each)' },
      { coins: [1, 1], total: 2, display: '🪙🪙 (1¢ each)' },
      { coins: [1, 1, 1, 1, 1, 1], total: 6, display: '🪙🪙🪙🪙🪙🪙 (1¢ each)' },
      { coins: [1, 1, 1, 1, 1, 1, 1], total: 7, display: '🪙🪙🪙🪙🪙🪙🪙 (1¢ each)' },
      { coins: [1, 1, 1, 1, 1, 1, 1, 1], total: 8, display: '🪙🪙🪙🪙🪙🪙🪙🪙 (1¢ each)' },
      { coins: [1, 1, 1, 1, 1, 1, 1, 1, 1], total: 9, display: '🪙🪙🪙🪙🪙🪙🪙🪙🪙 (1¢ each)' },
      { coins: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], total: 10, display: '🪙🪙🪙🪙🪙🪙🪙🪙🪙🪙 (1¢ each)' },
      { coins: [1], total: 1, display: '🪙 (1¢)' },
    ],
    2: [ // pennies + nickels
      { coins: [5, 1, 1], total: 7, display: '1 nickel (5¢) + 2 pennies (1¢ each)' },
      { coins: [5, 5, 1], total: 11, display: '2 nickels (5¢ each) + 1 penny (1¢)' },
      { coins: [5, 1, 1, 1], total: 8, display: '1 nickel (5¢) + 3 pennies (1¢ each)' },
      { coins: [5, 5], total: 10, display: '2 nickels (5¢ each)' },
      { coins: [5, 5, 5], total: 15, display: '3 nickels (5¢ each)' },
      { coins: [5, 1, 1, 1, 1], total: 9, display: '1 nickel (5¢) + 4 pennies (1¢ each)' },
      { coins: [5, 5, 1, 1], total: 12, display: '2 nickels (5¢ each) + 2 pennies (1¢ each)' },
      { coins: [5, 5, 1, 1, 1], total: 13, display: '2 nickels (5¢ each) + 3 pennies (1¢ each)' },
      { coins: [5, 5, 5, 1], total: 16, display: '3 nickels (5¢ each) + 1 penny (1¢)' },
      { coins: [5, 5, 5, 1, 1], total: 17, display: '3 nickels (5¢ each) + 2 pennies (1¢ each)' },
    ],
    3: [ // pennies + nickels + dimes
      { coins: [10, 5, 1], total: 16, display: '1 dime (10¢) + 1 nickel (5¢) + 1 penny (1¢)' },
      { coins: [10, 10, 5], total: 25, display: '2 dimes (10¢ each) + 1 nickel (5¢)' },
      { coins: [10, 5, 5, 1], total: 21, display: '1 dime (10¢) + 2 nickels (5¢) + 1 penny (1¢)' },
      { coins: [10, 1, 1, 1, 1], total: 14, display: '1 dime (10¢) + 4 pennies (1¢ each)' },
      { coins: [10, 10], total: 20, display: '2 dimes (10¢ each)' },
      { coins: [10, 10, 1], total: 21, display: '2 dimes (10¢ each) + 1 penny (1¢)' },
      { coins: [10, 5, 1, 1], total: 17, display: '1 dime (10¢) + 1 nickel (5¢) + 2 pennies (1¢ each)' },
      { coins: [10, 10, 5, 1], total: 26, display: '2 dimes (10¢ each) + 1 nickel (5¢) + 1 penny (1¢)' },
      { coins: [10, 10, 10], total: 30, display: '3 dimes (10¢ each)' },
      { coins: [10, 5, 5], total: 20, display: '1 dime (10¢) + 2 nickels (5¢ each)' },
      { coins: [10, 10, 10, 5], total: 35, display: '3 dimes (10¢ each) + 1 nickel (5¢)' },
      { coins: [10, 10, 5, 5], total: 30, display: '2 dimes (10¢ each) + 2 nickels (5¢ each)' },
    ],
    4: [ // all coins
      { coins: [25, 10, 5, 1], total: 41, display: '1 quarter (25¢) + 1 dime (10¢) + 1 nickel (5¢) + 1 penny (1¢)' },
      { coins: [25, 25, 10], total: 60, display: '2 quarters (25¢ each) + 1 dime (10¢)' },
      { coins: [25, 10, 10, 5], total: 50, display: '1 quarter (25¢) + 2 dimes (10¢) + 1 nickel (5¢)' },
      { coins: [25, 5, 5, 1, 1], total: 37, display: '1 quarter (25¢) + 2 nickels (5¢) + 2 pennies (1¢)' },
      { coins: [25, 25], total: 50, display: '2 quarters (25¢ each)' },
      { coins: [25, 10, 5], total: 40, display: '1 quarter (25¢) + 1 dime (10¢) + 1 nickel (5¢)' },
      { coins: [25, 10, 1, 1, 1], total: 38, display: '1 quarter (25¢) + 1 dime (10¢) + 3 pennies (1¢ each)' },
      { coins: [25, 25, 5], total: 55, display: '2 quarters (25¢ each) + 1 nickel (5¢)' },
      { coins: [25, 25, 10, 5], total: 65, display: '2 quarters (25¢ each) + 1 dime (10¢) + 1 nickel (5¢)' },
      { coins: [25, 25, 25], total: 75, display: '3 quarters (25¢ each)' },
      { coins: [25, 10, 10, 1], total: 46, display: '1 quarter (25¢) + 2 dimes (10¢ each) + 1 penny (1¢)' },
      { coins: [25, 25, 10, 10], total: 70, display: '2 quarters (25¢ each) + 2 dimes (10¢ each)' },
    ],
    5: [ // dollars too
      { coins: [100, 25, 10], total: 135, display: '1 dollar ($1.00) + 1 quarter (25¢) + 1 dime (10¢)' },
      { coins: [100, 25, 25], total: 150, display: '1 dollar ($1.00) + 2 quarters (25¢ each)' },
      { coins: [100, 50, 25, 10], total: 185, display: '1 dollar ($1.00) + 1 half-dollar (50¢) + 1 quarter (25¢) + 1 dime (10¢)' },
      { coins: [100, 25, 10, 10], total: 145, display: '1 dollar ($1.00) + 1 quarter (25¢) + 2 dimes (10¢ each)' },
      { coins: [100, 25, 25, 10], total: 160, display: '1 dollar ($1.00) + 2 quarters (25¢ each) + 1 dime (10¢)' },
      { coins: [100, 50, 25], total: 175, display: '1 dollar ($1.00) + 1 half-dollar (50¢) + 1 quarter (25¢)' },
      { coins: [100, 100], total: 200, display: '2 dollars ($1.00 each)' },
      { coins: [100, 25, 10, 5, 1], total: 141, display: '1 dollar ($1.00) + 1 quarter (25¢) + 1 dime (10¢) + 1 nickel (5¢) + 1 penny (1¢)' },
      { coins: [100, 50], total: 150, display: '1 dollar ($1.00) + 1 half-dollar (50¢)' },
      { coins: [100, 100, 25], total: 225, display: '2 dollars ($1.00 each) + 1 quarter (25¢)' },
    ],
  };

  const pool = coinSets[Math.min(difficulty, 5)] || coinSets[3];
  const item = randItem(pool);
  const totalCents = item.total;
  const displayStr = totalCents >= 100
    ? `$${(totalCents / 100).toFixed(2)}`
    : `${totalCents}¢`;

  const wrongNums = wrongNumbers(totalCents, 3, 10);
  const wrongChoices = wrongNums.map(n => n >= 100 ? `$${(n / 100).toFixed(2)}` : `${n}¢`);
  const choices = shuffleArray([displayStr, ...wrongChoices]);

  return {
    type: 'coinCounter',
    question: `Ash wants to buy a Potion! How much money does he have?\n${item.display}`,
    answer: displayStr,
    choices,
    hint: 'Add up the value of each coin!',
    coins: item.coins.map(v => {const n={1:'Penny',5:'Nickel',10:'Dime',25:'Quarter',50:'Half Dollar',100:'Dollar'};return{val:v,name:n[v]||v+'¢'};}),
    totalCents,
  };
}

// ---------------------------------------------------------------------------
// 15. genMissingNumber — Fill in the blank in a sequence
// ---------------------------------------------------------------------------
function genMissingNumber(difficulty) {
  difficulty = difficulty || 3;

  // Sequence types by difficulty
  const seqTypes = [];

  if (difficulty <= 2) {
    // Simple counting by 1
    seqTypes.push(() => {
      const start = 1 + Math.floor(Math.random() * 8);
      const seq = [start, start + 1, null, start + 3];
      return { seq, answer: start + 2, step: 1 };
    });
  }
  if (difficulty <= 3) {
    // Count by 2
    seqTypes.push(() => {
      const start = 2 * (1 + Math.floor(Math.random() * 5));
      const seq = [start, start + 2, null, start + 6];
      return { seq, answer: start + 4, step: 2 };
    });
    // Count by 1 with middle blank
    seqTypes.push(() => {
      const start = Math.floor(Math.random() * 15) + 1;
      const seq = [start, null, start + 2, start + 3];
      return { seq, answer: start + 1, step: 1 };
    });
  }
  if (difficulty <= 4) {
    // Count by 5
    seqTypes.push(() => {
      const start = 5 * (Math.floor(Math.random() * 5) + 1);
      const seq = [start, start + 5, null, start + 15];
      return { seq, answer: start + 10, step: 5 };
    });
    // Count by 10
    seqTypes.push(() => {
      const start = 10 * (Math.floor(Math.random() * 4) + 1);
      const seq = [start, start + 10, null, start + 30];
      return { seq, answer: start + 20, step: 10 };
    });
  }
  if (difficulty <= 5) {
    // Count by 3
    seqTypes.push(() => {
      const start = 3 * (Math.floor(Math.random() * 5) + 1);
      const seq = [start, null, start + 6, start + 9];
      return { seq, answer: start + 3, step: 3 };
    });
    // Descending
    seqTypes.push(() => {
      const start = 20 + Math.floor(Math.random() * 30);
      const seq = [start, start - 4, null, start - 12];
      return { seq, answer: start - 8, step: -4 };
    });
  }

  if (seqTypes.length === 0) {
    // Safe fallback
    seqTypes.push(() => ({ seq: [2, 4, null, 8], answer: 6, step: 2 }));
  }

  const fn = randItem(seqTypes);
  const result = fn();
  const displaySeq = result.seq.map(n => n === null ? '___' : String(n)).join(', ');

  const wrongNums = wrongNumbers(result.answer, 3, Math.abs(result.step) * 2 + 1);
  const choices = buildChoices(result.answer, wrongNums.map(String));

  return {
    type: 'missingNumber',
    question: `Professor Oak's Pokemon sequence is missing a number!\n${displaySeq}\nWhat number fills the blank?`,
    answer: String(result.answer),
    choices,
    hint: `Each number changes by ${result.step > 0 ? '+' : ''}${result.step}`,
    sequence: result.seq,
    blankIndex: result.seq.indexOf(null),
    step: result.step,
  };
}

// =============================================================================
// SECTION 4 — 2ND-3RD GRADE ACTIVITIES (Level 4)
// =============================================================================

// ---------------------------------------------------------------------------
// 16. genTypeAdvantageQuiz — Pokemon type matchups
// ---------------------------------------------------------------------------
function genTypeAdvantageQuiz() {
  // Uses TYPE_CHART from game.js
  // Build a list of super-effective (2x) matchup facts
  const allTypes = ['Fire', 'Water', 'Grass', 'Electric', 'Normal', 'Rock', 'Ground', 'Ghost', 'Psychic', 'Dragon', 'Bug', 'Flying', 'Fighting', 'Poison'];

  const superEffective = [];
  for (const atk of allTypes) {
    if (!TYPE_CHART[atk]) continue;
    for (const def of allTypes) {
      if (TYPE_CHART[atk][def] === 2) {
        superEffective.push({ attack: atk, defender: def });
      }
    }
  }

  const notVeryEffective = [];
  for (const atk of allTypes) {
    if (!TYPE_CHART[atk]) continue;
    for (const def of allTypes) {
      if (TYPE_CHART[atk][def] === 0.5) {
        notVeryEffective.push({ attack: atk, defender: def });
      }
    }
  }

  const noEffect = [];
  for (const atk of allTypes) {
    if (!TYPE_CHART[atk]) continue;
    for (const def of allTypes) {
      if (TYPE_CHART[atk][def] === 0) {
        noEffect.push({ attack: atk, defender: def });
      }
    }
  }

  // Random question type
  const qType = randItem(['superEffective', 'notVeryEffective', 'noEffect', 'whatBeats', 'multiplier']);

  if (qType === 'superEffective' && superEffective.length > 0) {
    const pair = randItem(superEffective);
    const wrongTypes = allTypes.filter(t => TYPE_CHART[pair.attack][t] !== 2 && t !== pair.defender);
    const choices = shuffleArray([pair.defender, ...randItems(wrongTypes, 3)]);
    return {
      type: 'typeAdvantageQuiz',
      question: `${pair.attack}-type moves are SUPER EFFECTIVE against which type?`,
      answer: pair.defender,
      choices,
      hint: `${pair.attack} does 2× damage to this type!`,
      attackType: pair.attack,
      defenderType: pair.defender,
    };
  }

  if (qType === 'notVeryEffective' && notVeryEffective.length > 0) {
    const pair = randItem(notVeryEffective);
    const wrongTypes = allTypes.filter(t => TYPE_CHART[pair.attack][t] !== 0.5 && t !== pair.defender);
    const choices = shuffleArray([pair.defender, ...randItems(wrongTypes, 3)]);
    return {
      type: 'typeAdvantageQuiz',
      question: `${pair.attack}-type moves are NOT VERY EFFECTIVE against which type?`,
      answer: pair.defender,
      choices,
      hint: `${pair.attack} only does 0.5× damage to this type.`,
      attackType: pair.attack,
      defenderType: pair.defender,
    };
  }

  if (qType === 'noEffect' && noEffect.length > 0) {
    const pair = randItem(noEffect);
    const wrongTypes = allTypes.filter(t => TYPE_CHART[pair.attack][t] !== 0 && t !== pair.defender);
    const choices = shuffleArray([pair.defender, ...randItems(wrongTypes, 3)]);
    return {
      type: 'typeAdvantageQuiz',
      question: `${pair.attack}-type moves have NO EFFECT on which type?`,
      answer: pair.defender,
      choices,
      hint: `0× damage — completely immune!`,
      attackType: pair.attack,
      defenderType: pair.defender,
    };
  }

  if (qType === 'whatBeats') {
    const defType = randItem(allTypes);
    const beaters = allTypes.filter(t => TYPE_CHART[t] && TYPE_CHART[t][defType] === 2);
    if (beaters.length > 0) {
      const answer = randItem(beaters);
      const wrongTypes = allTypes.filter(t => !(TYPE_CHART[t] && TYPE_CHART[t][defType] === 2));
      const choices = shuffleArray([answer, ...randItems(wrongTypes, 3)]);
      return {
        type: 'typeAdvantageQuiz',
        question: `Which type is SUPER EFFECTIVE against ${defType}-type Pokemon?`,
        answer,
        choices,
        hint: `Think about what naturally overcomes ${defType.toLowerCase()}!`,
        defenderType: defType,
      };
    }
  }

  // Multiplier question (fallback / qType === 'multiplier')
  const pair = randItem(superEffective);
  const multiplier = '2×';
  const wrongMultipliers = ['0.5×', '1×', '0×'];
  const choices = shuffleArray([multiplier, ...wrongMultipliers]);
  return {
    type: 'typeAdvantageQuiz',
    question: `${pair.attack} is super effective against ${pair.defender}. What is the damage multiplier?`,
    answer: multiplier,
    choices,
    hint: 'Super effective = double damage!',
    attackType: pair.attack,
    defenderType: pair.defender,
  };
}

// ---------------------------------------------------------------------------
// 18. genMultiplicationPowerup — Multiplication facts
// ---------------------------------------------------------------------------
function genMultiplicationPowerup(difficulty) {
  difficulty = difficulty || 4;

  // Multiplication tables available by difficulty
  const tableRanges = {
    1: [1, 2],
    2: [2, 3],
    3: [2, 5],
    4: [2, 9],
    5: [3, 12],
  };
  const [minTable, maxTable] = tableRanges[difficulty] || [2, 9];

  const a = minTable + Math.floor(Math.random() * (maxTable - minTable + 1));
  const b = 1 + Math.floor(Math.random() * 10);
  const product = a * b;

  // Pokemon power-level theme
  const pokemons = ['Pikachu', 'Charizard', 'Blastoise', 'Venusaur', 'Gengar', 'Mewtwo', 'Dragonite', 'Snorlax'];
  const pokemon = randItem(pokemons);

  // Fill-in-the-blank variant at difficulty 4+
  if (difficulty >= 4 && Math.random() < 0.3) {
    const missingFirst = Math.random() < 0.5;
    const missingVal = missingFirst ? a : b;
    const shownVal = missingFirst ? b : a;
    const qText = missingFirst
      ? `${pokemon}'s Power Level: ? × ${shownVal} = ${product}`
      : `${pokemon}'s Power Level: ${shownVal} × ? = ${product}`;
    const mWrong = wrongNumbers(missingVal, 3, Math.max(3, missingVal));
    const mChoices = buildChoices(missingVal, mWrong.map(String));
    return {
      type: 'multiPowerup',
      question: qText,
      answer: String(missingVal),
      choices: mChoices,
      hint: `What times ${shownVal} equals ${product}?`,
      a, b, product, pokemon,
    };
  }

  const wrongNums = wrongNumbers(product, 3, Math.max(3, a + b));
  const choices = buildChoices(product, wrongNums.map(String));

  return {
    type: 'multiPowerup',
    question: `${pokemon}'s Power Level formula: ${a} × ${b} = ?`,
    answer: String(product),
    choices,
    hint: `Add ${a} together ${b} times!`,
    a,
    b,
    product,
    pokemon,
  };
}

// ---------------------------------------------------------------------------
// 19. genTimesTable — Focused times table drill
// ---------------------------------------------------------------------------
function genTimesTable(difficulty) {
  difficulty = difficulty || 2;

  // Which tables to drill per difficulty level
  const tablesForLevel = {
    2: [2, 5, 10],
    3: [2, 3, 4, 5, 10],
    4: [2, 3, 4, 5, 6, 7, 8, 9],
    5: [3, 4, 6, 7, 8, 9, 11, 12],
  };
  const tables = tablesForLevel[difficulty] || tablesForLevel[3];
  const table = randItem(tables);

  // Pick which multiplier (1-12)
  const maxMult = difficulty <= 2 ? 10 : 12;
  const mult = 1 + Math.floor(Math.random() * maxMult);
  const product = table * mult;

  // Randomly pick a question format
  const formats = ['forward'];
  if (difficulty >= 3) formats.push('reverse', 'missing');
  const format = randItem(formats);

  if (format === 'reverse') {
    // "What is __ ÷ table?" (division as inverse of times table)
    const qText = `${product} ÷ ${table} = ?`;
    const answer = mult;
    const wrongs = wrongNumbers(answer, 3, Math.max(3, Math.ceil(answer / 2)));
    return {
      type: 'timesTable',
      question: qText,
      answer: String(answer),
      choices: buildChoices(answer, wrongs.map(String)),
      hint: `Think: ${table} × ? = ${product}`,
      table, mult, product,
    };
  }

  if (format === 'missing') {
    // "? × mult = product" or "table × ? = product"
    const missingFirst = Math.random() < 0.5;
    const missing = missingFirst ? table : mult;
    const shown = missingFirst ? mult : table;
    const qText = missingFirst
      ? `? × ${shown} = ${product}`
      : `${shown} × ? = ${product}`;
    const wrongs = wrongNumbers(missing, 3, Math.max(3, Math.ceil(missing / 2)));
    return {
      type: 'timesTable',
      question: qText,
      answer: String(missing),
      choices: buildChoices(missing, wrongs.map(String)),
      hint: `What times ${shown} equals ${product}?`,
      table, mult, product,
    };
  }

  // Default: forward "table × mult = ?"
  const qText = `${table} × ${mult} = ?`;
  const wrongs = wrongNumbers(product, 3, Math.max(3, table + mult));
  return {
    type: 'timesTable',
    question: qText,
    answer: String(product),
    choices: buildChoices(product, wrongs.map(String)),
    hint: `Add ${table} together ${mult} times!`,
    table, mult, product,
  };
}

// ---------------------------------------------------------------------------
// 20. genReadingPassageQuiz — Reading comprehension with passage
// ---------------------------------------------------------------------------
function genReadingPassageQuiz(difficulty) {
  difficulty = difficulty || 4;

  const passages = [
    {
      title: 'The Flame That Never Goes Out',
      text: 'Charmander is a small, orange lizard Pokemon. It has a flame burning on the tip of its tail. This flame is very important — it shows how healthy and happy Charmander is. When Charmander is excited, the flame burns brightly. When it is sad or weak, the flame flickers. Trainers must keep their Charmander healthy so the flame never goes out.',
      question: 'What does the flame on Charmander\'s tail show?',
      answer: 'How healthy and happy Charmander is',
      others: ['How hot the weather is', 'How fast Charmander can run', 'What Charmander ate for breakfast'],
      level: 3,
    },
    {
      title: 'Pikachu\'s Electric Power',
      text: 'Pikachu stores electricity in its cheeks. The small red circles on its face are actually electric sacs. When Pikachu meets someone it likes, it may give them a small zap as a greeting! Pikachu releases electricity to defend itself from enemies. Wild Pikachu live in forests and sometimes cause forest fires by accident when releasing electricity.',
      question: 'Why does Pikachu sometimes cause forest fires?',
      answer: 'It releases electricity by accident',
      others: ['It breathes fire', 'It runs too fast and creates friction', 'It drops lit berries'],
      level: 3,
    },
    {
      title: 'The Sleeping Giant',
      text: 'Snorlax is one of the heaviest Pokemon. It can weigh over 1,000 pounds! Snorlax spends most of its day sleeping. It must eat at least 900 pounds of food every day to stay full. Snorlax is not aggressive and will ignore most things around it. However, once it falls asleep on a road, it is nearly impossible to move — only a special melody from a Poke Flute can wake it up.',
      question: 'What is the ONLY thing that can wake a sleeping Snorlax on a road?',
      answer: 'A special melody from a Poke Flute',
      others: ['A loud thunderstorm', 'Splashing it with water', 'Offering it food'],
      level: 4,
    },
    {
      title: 'How Pokemon Evolve',
      text: 'Evolution is one of the most exciting things in the Pokemon world. When a Pokemon gains enough experience in battle, it may evolve into a stronger form. Most Pokemon evolve at a specific level. For example, Charmander evolves into Charmeleon at level 16, and Charmeleon evolves into Charizard at level 36. Some Pokemon evolve using special items, like an Eevee that evolves into Vaporeon when given a Water Stone. Legendary Pokemon do not evolve.',
      question: 'At what level does Charmeleon evolve into Charizard?',
      answer: 'Level 36',
      others: ['Level 16', 'Level 20', 'Level 50'],
      level: 4,
    },
    {
      title: 'The Mysterious Mewtwo',
      text: 'Mewtwo is one of the most powerful Pokemon in existence. It was created by scientists who used the DNA of the ancient Pokemon Mew. Mewtwo has incredibly strong psychic powers and can read minds. Unlike most Pokemon, Mewtwo does not naturally live in the wild — it was created in a laboratory. Because of its traumatic past, Mewtwo is often angry and distrustful of humans, though some trainers have earned its respect over time.',
      question: 'Why is Mewtwo often angry and distrustful?',
      answer: 'Because of its traumatic past being created in a lab',
      others: ['Because it lost many battles', 'Because it is always hungry', 'Because it dislikes loud sounds'],
      level: 5,
    },
    {
      title: 'Eevee\'s Many Forms',
      text: 'Eevee is unique among Pokemon because it can evolve into many different forms. This is because Eevee has an unstable genetic code that is sensitive to its environment. If Eevee is given a Thunder Stone, it becomes Jolteon, an Electric-type. A Water Stone turns it into Vaporeon, a Water-type. A Fire Stone creates Flareon, a Fire-type. Eevee\'s ability to adapt to so many environments makes it one of the most scientifically fascinating Pokemon.',
      question: 'What makes Eevee able to evolve into so many forms?',
      answer: 'It has an unstable genetic code sensitive to its environment',
      others: ['It eats many different types of berries', 'It absorbs weather conditions', 'It trains differently depending on its trainer'],
      level: 5,
    },
    {
      title: 'The Water Cycle and Vaporeon',
      text: 'Vaporeon is a Water-type Pokemon with an amazing ability. Its body is made of molecules similar to water, allowing it to melt into water and become invisible. Vaporeon can predict rain by sensing changes in the air. Scientists study Vaporeon to better understand how water moves through the environment. When a Vaporeon is near a lake or river, the water level sometimes rises because Vaporeon releases moisture from its body.',
      question: 'What special ability helps Vaporeon predict rain?',
      answer: 'It can sense changes in the air',
      others: ['It reads cloud patterns', 'It listens to thunder', 'It watches fish swim deeper'],
      level: 4,
    },
    // Expanded passages
    {
      title: 'Magikarp\'s Hidden Strength',
      text: 'Magikarp is often called the weakest Pokemon. All it can do is splash around helplessly. Many trainers laugh at it and refuse to catch it. But there is a secret — if a trainer is patient enough to keep training Magikarp, something incredible happens. At level 20, Magikarp evolves into Gyarados, one of the most powerful and feared Pokemon in the world! This teaches an important lesson: never judge someone by how they appear.',
      question: 'What level does Magikarp need to reach to evolve?',
      answer: 'Level 20',
      others: ['Level 10', 'Level 30', 'Level 50'],
      level: 3,
    },
    {
      title: 'The Pokemon Center',
      text: 'Every town in the Pokemon world has a Pokemon Center. These centers are run by Nurse Joy and her helper Chansey. Trainers can bring their injured or tired Pokemon to be healed for free. The healing machine uses special technology to restore a Pokemon\'s health in just a few seconds. Pokemon Centers also have computers where trainers can store extra Pokemon. Without Pokemon Centers, training would be much more dangerous.',
      question: 'Who helps Nurse Joy run the Pokemon Center?',
      answer: 'Chansey',
      others: ['Pikachu', 'Professor Oak', 'Brock'],
      level: 3,
    },
    {
      title: 'Fossils Come to Life',
      text: 'In the Pokemon world, ancient Pokemon can be brought back to life using fossils. Scientists at the Cinnabar Island laboratory have developed technology to extract DNA from fossils and recreate these extinct creatures. The Helix Fossil contains the DNA of Omanyte, a Water and Rock-type Pokemon. The Dome Fossil contains Kabuto, another ancient Pokemon. The rarest fossil is the Old Amber, which holds the DNA of the mighty Aerodactyl, a prehistoric flying Pokemon.',
      question: 'Which Pokemon comes from the Old Amber fossil?',
      answer: 'Aerodactyl',
      others: ['Omanyte', 'Kabuto', 'Kabutops'],
      level: 4,
    },
    {
      title: 'The Electric Rodent',
      text: 'Pikachu belongs to a family of electric rodent Pokemon. Before it became Pikachu, it was a tiny Pichu. Pichu is a baby Pokemon that generates small sparks of electricity. When a Pichu becomes close friends with its trainer, it evolves into Pikachu. Pikachu can then evolve into Raichu if it touches a Thunder Stone, though many Pikachu prefer to stay as they are. Ash\'s Pikachu famously refused to evolve into Raichu because it wanted to prove it could be strong in its current form.',
      question: 'How does Pichu evolve into Pikachu?',
      answer: 'By becoming close friends with its trainer',
      others: ['By reaching level 16', 'By touching a Thunder Stone', 'By winning a battle'],
      level: 4,
    },
    {
      title: 'The Legendary Birds',
      text: 'There are three legendary bird Pokemon in the Kanto region. Articuno is an Ice and Flying-type that lives in freezing mountain caves. Zapdos is an Electric and Flying-type found during powerful thunderstorms. Moltres is a Fire and Flying-type that migrates to warm, tropical places. According to legend, if all three birds begin fighting, only Lugia — the guardian of the seas — can calm them down. Catching even one of these birds is considered nearly impossible.',
      question: 'Which legendary Pokemon can calm the three birds when they fight?',
      answer: 'Lugia',
      others: ['Mewtwo', 'Ho-Oh', 'Mew'],
      level: 5,
    },
    {
      title: 'The Ghost Tower',
      text: 'Lavender Town is known for its eerie Pokemon Tower, a resting place for Pokemon that have passed away. Trainers visit the tower to pay their respects. The tower is home to many Ghost-type Pokemon, including Gastly, Haunter, and Gengar. These ghosts enjoy scaring visitors but are rarely dangerous. The top floor of the tower is said to be haunted by the spirit of a Marowak that was trying to protect its baby Cubone from Team Rocket. Only a special device called the Silph Scope can reveal the true identity of the ghosts.',
      question: 'What device reveals the true identity of the ghosts in Pokemon Tower?',
      answer: 'The Silph Scope',
      others: ['A Poke Flute', 'A Master Ball', 'The Pokedex'],
      level: 5,
    },
    {
      title: 'Ditto the Copycat',
      text: 'Ditto is one of the most unusual Pokemon. It is a small, pink blob that can transform into an exact copy of any other Pokemon it sees. When Ditto transforms, it copies the other Pokemon\'s appearance, moves, and abilities. However, if Ditto tries to transform from memory instead of looking directly at its target, it often makes mistakes and the copy comes out wrong. Scientists believe Ditto\'s cells are able to rearrange themselves to match any structure.',
      question: 'What happens when Ditto transforms from memory?',
      answer: 'It often makes mistakes and the copy is wrong',
      others: ['It becomes even stronger', 'It stays in its pink form', 'It evolves into a new Pokemon'],
      level: 4,
    },
    {
      title: 'Bulbasaur and Photosynthesis',
      text: 'Bulbasaur is one of the three starter Pokemon in the Kanto region. The large bulb on its back contains a plant seed that was planted at birth. As Bulbasaur grows, the plant on its back grows too. Bulbasaur absorbs sunlight through its bulb, much like real plants perform photosynthesis. This sunlight gives Bulbasaur energy and helps it use powerful moves like Solar Beam. When Bulbasaur evolves into Ivysaur, the bulb begins to bloom into a beautiful flower.',
      question: 'How does Bulbasaur get energy from its bulb?',
      answer: 'It absorbs sunlight, like photosynthesis',
      others: ['It eats special berries through it', 'It stores water in it', 'It breathes through it'],
      level: 3,
    },
    {
      title: 'The Safari Zone Adventure',
      text: 'The Safari Zone is a special nature reserve where trainers can catch rare Pokemon that cannot be found anywhere else. Instead of using their own Pokemon to battle, trainers are given Safari Balls and bait. They can throw bait to attract wild Pokemon or rocks to make them easier to catch. Each visit to the Safari Zone has a time limit of 500 steps. Some of the rarest Pokemon found here include Kangaskhan, Tauros, and Chansey. The Safari Zone was created to protect endangered Pokemon species.',
      question: 'Why was the Safari Zone created?',
      answer: 'To protect endangered Pokemon species',
      others: ['To train strong Pokemon', 'To sell rare Pokemon', 'To test new Poke Balls'],
      level: 4,
    },
    {
      title: 'Slowpoke\'s Unusual Brain',
      text: 'Slowpoke is one of the most curious Pokemon. It moves incredibly slowly and often forgets what it was doing. Scientists have discovered that Slowpoke\'s brain takes a very long time to process information. If you step on Slowpoke\'s tail, it might not feel the pain until five seconds later! Despite being slow, Slowpoke has an unusual talent — its yawns are said to attract rare Pokemon. When a Shellder bites Slowpoke\'s tail, the chemicals cause Slowpoke to evolve into Slowbro, and they become permanently connected.',
      question: 'What causes Slowpoke to evolve into Slowbro?',
      answer: 'A Shellder bites its tail',
      others: ['It reaches level 37', 'It uses a Water Stone', 'It learns a special move'],
      level: 5,
    },
    {
      title: 'The Power Plant Mystery',
      text: 'Located near Cerulean City, the abandoned Power Plant is one of the most dangerous places in Kanto. Electric-type Pokemon are drawn to the residual energy inside the building. Voltorb and Electrode disguise themselves as Poke Balls on the floor, exploding when trainers touch them. Magnemite float through the corridors in swarms. Deep inside the plant, behind heavy locked doors, lives the legendary Zapdos. The power plant stopped working years ago when Zapdos arrived and overloaded all the generators with its immense electrical power.',
      question: 'Why did the Power Plant stop working?',
      answer: 'Zapdos overloaded the generators with electricity',
      others: ['A fire destroyed the machinery', 'The workers abandoned it', 'Team Rocket stole the power'],
      level: 5,
    },
    // Additional passages to reach 50
    {
      title: 'Growlithe the Loyal Guard',
      text: 'Growlithe is a Fire-type puppy Pokemon known for its loyalty. It will protect its trainer from any danger. Growlithe has an amazing sense of smell — it can remember any scent forever. Police officers in the Pokemon world often use Growlithe to help track down criminals.',
      question: 'What makes Growlithe useful for police work?',
      answer: 'Its amazing sense of smell that remembers scents forever',
      others: ['Its ability to fly', 'Its loud bark', 'Its sharp claws'],
      level: 3,
    },
    {
      title: 'The Busy Beedrill',
      text: 'Beedrill is a Bug and Poison-type Pokemon with large stingers on its front arms and tail. Beedrill live in groups and build nests in forests. They are very protective of their territory. If you disturb a Beedrill nest, the whole swarm will chase you away.',
      question: 'What happens if you disturb a Beedrill nest?',
      answer: 'The whole swarm will chase you away',
      others: ['One Beedrill comes to look', 'They fly to a new nest', 'They hide inside the nest'],
      level: 3,
    },
    {
      title: 'Jigglypuff the Singer',
      text: 'Jigglypuff is a round, pink Pokemon that loves to sing. Its lullaby puts everyone to sleep! When Jigglypuff sees that its audience has fallen asleep, it gets very angry and uses a marker to draw funny faces on the sleeping listeners.',
      question: 'Why does Jigglypuff get angry after singing?',
      answer: 'Because everyone falls asleep during its song',
      others: ['Because it forgets the words', 'Because nobody claps', 'Because its voice gets tired'],
      level: 3,
    },
    {
      title: 'Cubone\'s Sad Story',
      text: 'Cubone is known as the Lonely Pokemon. It wears the skull of its mother on its head. At night, Cubone sometimes cries, and the skull rattles with a sad, hollow sound. Despite its sadness, Cubone is brave and uses a bone as a weapon with great accuracy.',
      question: 'What does Cubone wear on its head?',
      answer: 'The skull of its mother',
      others: ['A metal helmet', 'A wooden mask', 'A round rock'],
      level: 3,
    },
    {
      title: 'How Poke Balls Work',
      text: 'Poke Balls are the tools trainers use to catch Pokemon. When a Poke Ball hits a wild Pokemon, it is converted into energy and pulled inside. The ball shakes as the Pokemon tries to break free. Weakening a Pokemon in battle first makes it much easier to catch.',
      question: 'What makes it easier to catch a wild Pokemon?',
      answer: 'Weakening it in battle first',
      others: ['Using a louder voice', 'Throwing the ball harder', 'Waiting until nighttime'],
      level: 3,
    },
    {
      title: 'The Pokedex Encyclopedia',
      text: 'The Pokedex is an electronic device given to trainers by a Pokemon professor. It records data about every Pokemon a trainer encounters. Professor Oak created the first Pokedex and gave it to young trainers. Completing it by catching every Pokemon is the ultimate achievement.',
      question: 'Who created the first Pokedex?',
      answer: 'Professor Oak',
      others: ['Nurse Joy', 'Ash Ketchum', 'Team Rocket'],
      level: 3,
    },
    {
      title: 'Vulpix and Its Tails',
      text: 'Vulpix is a Fire-type fox Pokemon. When born, it has only one white tail. As it grows, the tail splits into more tails until it has six. When given a Fire Stone, Vulpix evolves into Ninetales with nine long tails.',
      question: 'How many tails does a fully grown Vulpix have?',
      answer: 'Six tails',
      others: ['Nine tails', 'Three tails', 'One tail'],
      level: 3,
    },
    {
      title: 'Abra the Teleporter',
      text: 'Abra is a Psychic-type Pokemon that sleeps for 18 hours a day. Even while sleeping, it can sense danger and teleport away instantly. This makes Abra extremely difficult to catch. Trainers must throw a Poke Ball before Abra wakes up and disappears.',
      question: 'How many hours a day does Abra sleep?',
      answer: '18 hours',
      others: ['12 hours', '8 hours', '24 hours'],
      level: 3,
    },
    {
      title: 'Geodude Loves Rocks',
      text: 'Geodude looks like a rock with arms. It lives on mountain trails and blends in with regular rocks. Hikers sometimes accidentally step on it, which makes it very angry! Geodude feeds by eating soil and rocks to grow harder.',
      question: 'Why is Geodude hard to spot on mountain trails?',
      answer: 'Because it blends in with regular rocks',
      others: ['Because it is invisible', 'Because it moves very fast', 'Because it only comes out at night'],
      level: 3,
    },
    {
      title: 'The Pewter City Gym',
      text: 'Pewter City Gym is the first gym most trainers visit in Kanto. Brock specializes in Rock-type Pokemon. Water and Grass moves work best against Rock-types. Trainers who chose Charmander struggle here because Fire moves are not effective against rocks.',
      question: 'Why do trainers with Charmander struggle at Pewter City Gym?',
      answer: 'Because Fire-type moves are not effective against Rock-types',
      others: ['Because Charmander is too small', 'Because Brock has six Pokemon', 'Because the gym is dark inside'],
      level: 3,
    },
    {
      title: 'Squirtle Squad',
      text: 'The Squirtle Squad was a group of wild Squirtle who wore cool sunglasses. They were abandoned by their trainers and became troublemakers. When a forest fire broke out, they used their water attacks to put out the flames and became the town\'s firefighting team.',
      question: 'What did the Squirtle Squad do to help the town?',
      answer: 'They used their water attacks to put out a forest fire',
      others: ['They caught all the wild Pokemon', 'They built a new Pokemon Center', 'They chased away Team Rocket'],
      level: 3,
    },
    {
      title: 'The Berry Garden',
      text: 'Berries are an important resource in the Pokemon world. Trainers plant berry seeds and water them regularly. Different berries have different effects — Oran Berries restore health, while Cheri Berries cure paralysis. Some berries are rare and only grow in certain climates.',
      question: 'What effect does an Oran Berry have?',
      answer: 'It restores health',
      others: ['It cures poison', 'It makes Pokemon faster', 'It cures paralysis'],
      level: 3,
    },
    {
      title: 'Alakazam the Genius',
      text: 'Alakazam is one of the smartest Pokemon with an IQ of over 5,000. It uses powerful psychic energy to move objects without touching them. Despite its intelligence, its body is very weak because all its energy goes to its brain. It must use psychic powers even to hold up its own head.',
      question: 'Why is Alakazam\'s body weak?',
      answer: 'Because all its energy goes to its brain',
      others: ['Because it never exercises', 'Because it does not eat enough', 'Because it is very old'],
      level: 4,
    },
    {
      title: 'The Pokemon League Challenge',
      text: 'To compete in the Pokemon League, a trainer must earn eight Gym Badges. After collecting them all, the trainer challenges the Elite Four — four of the strongest trainers. If a trainer defeats all four, they face the Champion. The path there is called Victory Road.',
      question: 'How many Gym Badges must a trainer earn to enter the Pokemon League?',
      answer: 'Eight',
      others: ['Six', 'Ten', 'Twelve'],
      level: 4,
    },
    {
      title: 'Chansey the Healer',
      text: 'Chansey carries a nutritious egg in its pouch that can heal sick Pokemon. It works alongside Nurse Joy in Pokemon Centers. Chansey can sense when someone is feeling sad or unwell and rushes to help. Wild Chansey are very rare and hard to catch.',
      question: 'What special item does Chansey carry in its pouch?',
      answer: 'A nutritious egg that can heal others',
      others: ['A Poke Ball for emergencies', 'A lucky charm', 'Medicine from the store'],
      level: 4,
    },
    {
      title: 'The Mystery of Unown',
      text: 'Unown are strange Pokemon shaped like letters of the alphabet — 26 forms in total. They are found on walls of ancient ruins. Researchers believe Unown can create alternate dimensions when many gather together. Each is weak alone, but their combined psychic power is said to be unlimited.',
      question: 'How many different forms of Unown exist?',
      answer: '26, one for each letter of the alphabet',
      others: ['10, one for each number', '50, one for each state', '100, all different shapes'],
      level: 4,
    },
    {
      title: 'Type Advantages Explained',
      text: 'In Pokemon battles, type advantages matter greatly. Water beats Fire, Fire beats Grass, and Grass beats Water — like rock-paper-scissors. A smart trainer learns all the matchups. Using a Water move against Rock deals double damage. Understanding types separates good trainers from great ones.',
      question: 'What real-world game is the type advantage system compared to?',
      answer: 'Rock-paper-scissors',
      others: ['Chess', 'Tic-tac-toe', 'Card games'],
      level: 4,
    },
    {
      title: 'Gengar the Shadow Pokemon',
      text: 'Gengar is a Ghost and Poison-type that hides in shadows. It can reduce a room\'s temperature by ten degrees just by being present. Gengar enjoys frightening people by mimicking their shadow. Despite being scary, it is popular among experienced trainers for its speed and power.',
      question: 'What happens to a room\'s temperature when Gengar is nearby?',
      answer: 'It drops by about ten degrees',
      others: ['It gets warmer', 'Nothing changes', 'It starts raining inside'],
      level: 4,
    },
    {
      title: 'Gyarados and Anger',
      text: 'Gyarados is known for its terrible temper. Scientists believe cells in its body rearranged during evolution, changing its brain and making it violent. Despite evolving from weak Magikarp, Gyarados is one of the most feared Pokemon. Ancient villages built shrines to calm it.',
      question: 'What do scientists believe caused Gyarados to become violent?',
      answer: 'Its brain cells rearranged during evolution',
      others: ['It was always angry as Magikarp', 'Trainers treated it badly', 'It ate poisonous fish'],
      level: 4,
    },
    {
      title: 'Lapras the Ferry Pokemon',
      text: 'Lapras is a gentle Water and Ice-type that carries people across the ocean. It can understand human speech. Sadly, it was hunted nearly to extinction because it never fought back. Conservation efforts have helped Lapras populations recover.',
      question: 'Why was Lapras nearly hunted to extinction?',
      answer: 'Because its gentle nature meant it never fought back',
      others: ['Because it was too slow to escape', 'Because it lived in shallow water', 'Because hunters wanted its shell'],
      level: 4,
    },
    {
      title: 'How Pokemon Eggs Hatch',
      text: 'Pokemon eggs need warmth and care to hatch. A trainer must carry the egg and walk many steps. Pokemon with the Flame Body ability, like Magmar, keep eggs warm and help them hatch faster. The first thing a baby Pokemon sees often becomes its closest companion.',
      question: 'How does a Pokemon with Flame Body help eggs?',
      answer: 'It keeps eggs warm so they hatch faster',
      others: ['It teaches the baby its first move', 'It protects the egg from enemies', 'It cracks the shell open'],
      level: 4,
    },
    {
      title: 'The Legendary Mew',
      text: 'Mew is believed to be the ancestor of all Pokemon. Its DNA contains the genetic code of every species. Mew is incredibly rare — some scientists doubt it exists. It can learn every move, making it the most versatile Pokemon ever. Mew appears only to the pure of heart.',
      question: 'Why can Mew learn every move in existence?',
      answer: 'Because its DNA contains the genetic code of every Pokemon species',
      others: ['Because it is the oldest Pokemon', 'Because it trained for thousands of years', 'Because a scientist taught it'],
      level: 5,
    },
    {
      title: 'Fossil Restoration Science',
      text: 'Restoring Pokemon from fossils requires advanced genetic technology. Scientists extract DNA fragments and fill in missing pieces using living Pokemon data. Restored Pokemon may behave differently from ancestors because environments have changed dramatically over millions of years.',
      question: 'Why might restored fossil Pokemon behave differently from their ancestors?',
      answer: 'Because their environment has changed dramatically',
      others: ['Because the DNA is from a different Pokemon', 'Because they are always confused', 'Because scientists train them differently'],
      level: 5,
    },
    {
      title: 'Porygon the Digital Pokemon',
      text: 'Porygon was entirely created by Silph Company using computer code. It can exist inside digital spaces like computers and the internet. Because it is made of code, Porygon can copy itself and travel through electronic networks to explore cyberspace.',
      question: 'Why can Porygon exist inside computers?',
      answer: 'Because it is made of computer programming code',
      others: ['Because it is very small', 'Because it can turn invisible', 'Because it eats electricity'],
      level: 5,
    },
    {
      title: 'The Mysterious Ditto Problem',
      text: 'Scientists noticed Ditto and Mew share the same weight, same pink color, and both learn Transform. Ditto are most commonly found near the lab where Mewtwo was created. This led researchers to theorize Ditto might be failed attempts to clone Mew.',
      question: 'What theory do scientists have about Ditto?',
      answer: 'That Ditto might be failed attempts to clone Mew',
      others: ['That Ditto is a baby Mewtwo', 'That Ditto came from outer space', 'That Ditto is actually a Ghost-type'],
      level: 5,
    },
    {
      title: 'Poliwag and the Spiral',
      text: 'Poliwag has a spiral pattern on its belly that is actually its internal organs showing through thin, transparent skin. In real life, this was inspired by real tadpoles whose intestines are visible through their skin. The spiral direction differs depending on where Poliwag was born.',
      question: 'What is the spiral on Poliwag\'s belly?',
      answer: 'Its internal organs visible through thin, transparent skin',
      others: ['A birthmark', 'A tattoo from its parents', 'A special shield'],
      level: 5,
    },
    {
      title: 'Nidoran Family Differences',
      text: 'Nidoran is one of the few Pokemon where males and females look completely different. Females are blue with small barbs; males are purple with larger ears. They evolve into different Pokemon. In nature, this is called sexual dimorphism.',
      question: 'What is the scientific term for when males and females of the same species look different?',
      answer: 'Sexual dimorphism',
      others: ['Evolution', 'Metamorphosis', 'Adaptation'],
      level: 5,
    },
    {
      title: 'Migration of Butterfree',
      text: 'Every year, groups of Butterfree fly across the ocean to find mates, similar to how real monarch butterflies travel thousands of miles. Trainers who raised Butterfree from Caterpie sometimes release them to join the migration.',
      question: 'What real-world insect has a migration similar to Butterfree?',
      answer: 'Monarch butterflies',
      others: ['Honeybees', 'Fireflies', 'Dragonflies'],
      level: 5,
    },
    {
      title: 'Clefairy and the Moon',
      text: 'Clefairy are mysterious fairy Pokemon living deep inside Mt. Moon. They come out on full moon nights to dance in a circle. They are believed to have arrived from outer space inside a meteorite. The Moon Stone allows Clefairy to evolve into Clefable.',
      question: 'Where are Clefairy believed to have originally come from?',
      answer: 'Outer space, arriving inside a meteorite',
      others: ['The bottom of the ocean', 'A magical forest', 'A laboratory experiment'],
      level: 5,
    },
    {
      title: 'Team Rocket\'s Secret',
      text: 'Team Rocket is an organization that uses Pokemon for power and profit. Their leader Giovanni is secretly the Viridian City Gym Leader. The most famous members — Jessie, James, and their talking Meowth — rarely succeed and often blast off into the sky after being defeated.',
      question: 'What is Team Rocket\'s leader secretly also known as?',
      answer: 'The Viridian City Gym Leader',
      others: ['A Pokemon Professor', 'The Champion of Kanto', 'A Nurse Joy'],
      level: 5,
    },
    {
      title: 'The Pokemon Daycare System',
      text: 'At the Pokemon Daycare, trainers leave Pokemon to be raised by caregivers. Pokemon gain experience over time without battling. Sometimes two compatible Pokemon produce a mysterious egg. The Daycare charges based on how many levels a Pokemon gains.',
      question: 'What sometimes happens when two compatible Pokemon are left at the Daycare?',
      answer: 'The workers find a mysterious egg',
      others: ['The Pokemon evolve immediately', 'The Pokemon learn new moves', 'The Pokemon run away together'],
      level: 5,
    },
    {
      title: 'Arcanine the Legendary Runner',
      text: 'Arcanine is a majestic Fire-type that can run 6,200 miles in a single day. In ancient times, statues of Arcanine guarded important buildings. Despite being called the "Legendary Pokemon," it is not actually classified as a legendary. It evolves from Growlithe with a Fire Stone.',
      question: 'How far can Arcanine run in a single day?',
      answer: '6,200 miles',
      others: ['1,000 miles', '500 miles', '10,000 miles'],
      level: 5,
    },
  ];

  // Filter by approximate level
  const levelPool = passages.filter(p => Math.abs(p.level - difficulty) <= 1);
  const item = randItem(levelPool.length > 0 ? levelPool : passages);
  const choices = shuffleArray([item.answer, ...item.others]);

  return {
    type: 'readingPassage',
    question: item.question,
    answer: item.answer,
    choices,
    hint: 'Re-read the passage carefully for the answer!',
    passage: item.text,
    title: item.title,
  };
}

// =============================================================================
// SECTION 5 — 4TH-5TH GRADE ACTIVITIES (Level 5)
// =============================================================================

// ---------------------------------------------------------------------------
// 21. genBreederFractions — Fraction word problems
// ---------------------------------------------------------------------------
function genBreederFractions(difficulty) {
  difficulty = difficulty || 5;

  const fractionProblems = [
    // 1/4 of N
    () => {
      const total = randItem([8, 12, 16, 20, 24, 28, 32, 36, 40]);
      const answer = total / 4;
      return {
        question: `Nurse Joy has ${total} Poke Eggs in the hatchery. 1/4 of them are about to hatch. How many eggs are hatching?`,
        answer,
        hint: 'Divide by 4 to find 1/4.',
      };
    },
    // 1/2 of N
    () => {
      const total = randItem([10, 14, 18, 22, 26, 30, 40, 50]);
      const answer = total / 2;
      return {
        question: `Breeder Susie has ${total} Eevee eggs. Half of them will become Vaporeon. How many Vaporeon eggs are there?`,
        answer,
        hint: 'Divide by 2 to find half.',
      };
    },
    // 1/3 of N
    () => {
      const total = randItem([9, 12, 15, 18, 21, 24, 30, 33]);
      const answer = total / 3;
      return {
        question: `The Day-Care Center has ${total} Pokemon. 1/3 are Water-types. How many Water-types are there?`,
        answer,
        hint: 'Divide by 3 to find 1/3.',
      };
    },
    // 3/4 of N
    () => {
      const total = randItem([8, 12, 16, 20, 24]);
      const answer = (total * 3) / 4;
      return {
        question: `There are ${total} Pikachu in Viridian Forest. 3/4 of them know Thunderbolt. How many Pikachu know Thunderbolt?`,
        answer,
        hint: 'Find 1/4 first, then multiply by 3.',
      };
    },
    // 2/3 of N
    () => {
      const total = randItem([9, 12, 15, 18, 21]);
      const answer = Math.round((total * 2) / 3);
      return {
        question: `Professor Oak is studying ${total} Bulbasaur. 2/3 have evolved. How many have evolved?`,
        answer,
        hint: 'Find 1/3 first, then multiply by 2.',
      };
    },
    // Fraction of a dollar (difficulty 5 only)
    () => {
      const choices_data = [
        { frac: '1/4', total: 100, answer: 25, item: 'Potion', currency: 'cents' },
        { frac: '1/2', total: 200, answer: 100, item: 'Super Potion', currency: 'coins' },
        { frac: '3/4', total: 80, answer: 60, item: 'Poke Ball', currency: 'coins' },
      ];
      const c = randItem(choices_data);
      return {
        question: `A ${c.item} costs ${c.total} ${c.currency}. Ash has ${c.frac} of the cost. How many ${c.currency} does Ash have?`,
        answer: c.answer,
        hint: `Find ${c.frac} of ${c.total}.`,
      };
    },
    // Additional fraction templates to reach ~20
    // 1/5 of N
    () => {
      const total = randItem([10, 15, 20, 25, 30, 35, 40, 45, 50]);
      const answer = total / 5;
      return {
        question: `Professor Elm has ${total} Togepi eggs. 1/5 of them hatched overnight. How many Togepi hatched?`,
        answer,
        hint: 'Divide by 5 to find 1/5.',
      };
    },
    // 2/5 of N
    () => {
      const total = randItem([10, 15, 20, 25, 30]);
      const answer = (total * 2) / 5;
      return {
        question: `A Pokemon ranch has ${total} Ponyta. 2/5 of them are Shiny. How many Shiny Ponyta are there?`,
        answer,
        hint: 'Find 1/5 first, then multiply by 2.',
      };
    },
    // 3/5 of N
    () => {
      const total = randItem([10, 15, 20, 25, 30]);
      const answer = (total * 3) / 5;
      return {
        question: `There are ${total} Pidgey in the flock. 3/5 of them flew south for winter. How many flew south?`,
        answer,
        hint: 'Find 1/5 first, then multiply by 3.',
      };
    },
    // 1/6 of N
    () => {
      const total = randItem([6, 12, 18, 24, 30, 36, 42]);
      const answer = total / 6;
      return {
        question: `The Pokemon shelter has ${total} Meowth. 1/6 of them were adopted today. How many Meowth were adopted?`,
        answer,
        hint: 'Divide by 6 to find 1/6.',
      };
    },
    // 5/6 of N
    () => {
      const total = randItem([6, 12, 18, 24, 30]);
      const answer = (total * 5) / 6;
      return {
        question: `Brock baked ${total} Pokemon treats. 5/6 of them were eaten by hungry Pokemon. How many treats were eaten?`,
        answer,
        hint: 'Find 1/6 first, then multiply by 5.',
      };
    },
    // 1/8 of N
    () => {
      const total = randItem([8, 16, 24, 32, 40, 48]);
      const answer = total / 8;
      return {
        question: `The Poke Mart received ${total} Poke Balls in a shipment. 1/8 of them are Premier Balls. How many are Premier Balls?`,
        answer,
        hint: 'Divide by 8 to find 1/8.',
      };
    },
    // 3/8 of N
    () => {
      const total = randItem([8, 16, 24, 32, 40]);
      const answer = (total * 3) / 8;
      return {
        question: `A trainer caught ${total} Pokemon this week. 3/8 of them are Water-types. How many Water-types did the trainer catch?`,
        answer,
        hint: 'Find 1/8 first, then multiply by 3.',
      };
    },
    // 1/10 of N
    () => {
      const total = randItem([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
      const answer = total / 10;
      return {
        question: `There are ${total} trainers at the Pokemon Tournament. 1/10 of them have a Legendary Pokemon. How many trainers have a Legendary?`,
        answer,
        hint: 'Divide by 10 to find 1/10.',
      };
    },
    // 7/10 of N
    () => {
      const total = randItem([10, 20, 30, 40, 50]);
      const answer = (total * 7) / 10;
      return {
        question: `Nurse Joy treated ${total} Pokemon today. 7/10 of them had minor injuries. How many had minor injuries?`,
        answer,
        hint: 'Find 1/10 first, then multiply by 7.',
      };
    },
    // Comparing fractions
    () => {
      const total = randItem([12, 24, 36, 48]);
      const halfVal = total / 2;
      const thirdVal = total / 3;
      const answer = halfVal - thirdVal;
      return {
        question: `Ash has ${total} berries. He gives 1/2 to Pikachu and 1/3 to Bulbasaur. How many MORE berries does Pikachu get than Bulbasaur?`,
        answer,
        hint: `Find 1/2 of ${total} and 1/3 of ${total}, then subtract.`,
      };
    },
    // Adding fractions scenario
    () => {
      const total = randItem([12, 20, 24, 30, 36]);
      const quarter = total / 4;
      const half = total / 2;
      const answer = quarter + half;
      return {
        question: `Misty has ${total} Poke Balls. She uses 1/4 of them in the morning and 1/2 in the afternoon. How many did she use in total?`,
        answer,
        hint: `Add 1/4 of ${total} and 1/2 of ${total} together.`,
      };
    },
    // Remaining after fraction
    () => {
      const total = randItem([10, 15, 20, 25, 30]);
      const used = (total * 2) / 5;
      const answer = total - used;
      return {
        question: `A Breeder had ${total} Pokemon eggs. 2/5 of them hatched. How many eggs are still waiting to hatch?`,
        answer,
        hint: `Find 2/5 of ${total}, then subtract from ${total}.`,
      };
    },
    // Double fraction step
    () => {
      const total = randItem([8, 12, 16, 20, 24]);
      const answer = (total * 3) / 4;
      return {
        question: `Team Rocket stole ${total} rare candies. The police recovered 3/4 of them. How many candies were recovered?`,
        answer,
        hint: 'Find 1/4 first, then multiply by 3.',
      };
    },
    // Fraction of money
    () => {
      const choices_data = [
        { frac: '1/5', total: 500, answer: 100, item: 'Bicycle', currency: 'coins' },
        { frac: '2/5', total: 250, answer: 100, item: 'TM Move', currency: 'coins' },
        { frac: '3/10', total: 100, answer: 30, item: 'Antidote', currency: 'cents' },
        { frac: '1/8', total: 400, answer: 50, item: 'Full Heal', currency: 'coins' },
      ];
      const c = randItem(choices_data);
      return {
        question: `A ${c.item} costs ${c.total} ${c.currency}. Misty has saved ${c.frac} of the cost. How many ${c.currency} has she saved?`,
        answer: c.answer,
        hint: `Find ${c.frac} of ${c.total}.`,
      };
    },
  ];

  const fn = randItem(fractionProblems);
  const result = fn();

  const wrongNums = wrongNumbers(result.answer, 3, Math.max(3, Math.floor(result.answer / 2)));
  const choices = buildChoices(result.answer, wrongNums.map(String));

  return {
    type: 'breederFractions',
    question: result.question,
    answer: String(result.answer),
    choices,
    hint: result.hint,
  };
}

// ---------------------------------------------------------------------------
// 22. genGeographyExplorer — Pokemon world geography facts
// ---------------------------------------------------------------------------
function genGeographyExplorer() {
  const geoItems = [
    {
      question: 'Which real-world country inspired the Kanto region?',
      answer: 'Japan',
      others: ['United States', 'France', 'Australia'],
      hint: 'Pokemon was created in Japan!',
    },
    {
      question: 'Which US state inspired the Unova region in Pokemon Black and White?',
      answer: 'New York',
      others: ['California', 'Texas', 'Florida'],
      hint: 'Think of the largest city on the US East Coast.',
    },
    {
      question: 'Which European country inspired the Kalos region in Pokemon X and Y?',
      answer: 'France',
      others: ['Germany', 'Italy', 'Spain'],
      hint: 'Think of the Eiffel Tower!',
    },
    {
      question: 'Which real-world region of Japan inspired the Pokemon Kanto region?',
      answer: 'Kanto, Japan',
      others: ['Tokyo, Japan', 'Osaka, Japan', 'Kyoto, Japan'],
      hint: 'The region shares its name with the game!',
    },
    {
      question: 'Which ocean surrounds most of the island routes in the Kanto region?',
      answer: 'Pacific Ocean',
      others: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean'],
      hint: 'Japan is in the Pacific.',
    },
    {
      question: 'The Pokemon "Kangaskhan" is based on an animal from which continent?',
      answer: 'Australia',
      others: ['Africa', 'South America', 'Asia'],
      hint: 'It is named after a famous marsupial!',
    },
    {
      question: 'Lugia is said to live deep in the ocean. What type of real habitat is this?',
      answer: 'Marine/Ocean habitat',
      others: ['Desert habitat', 'Tundra habitat', 'Rainforest habitat'],
      hint: 'Lugia is the "Diving Pokemon."',
    },
    {
      question: 'Which Pokemon game region is inspired by Hawaii?',
      answer: 'Alola (Sun and Moon)',
      others: ['Kalos (X and Y)', 'Hoenn (Ruby and Sapphire)', 'Galar (Sword and Shield)'],
      hint: 'Think tropical islands!',
    },
    {
      question: 'Which UK country inspired the Galar region in Sword and Shield?',
      answer: 'Great Britain',
      others: ['Ireland', 'Netherlands', 'Germany'],
      hint: 'Think Big Ben and tea!',
    },
    {
      question: 'Pallet Town, the starting town in Kanto, is named after what kind of object?',
      answer: 'An artist\'s color palette',
      others: ['A wooden shipping pallet', 'A type of sword', 'A metal tool'],
      hint: 'All Kanto towns are named after colors or shades!',
    },
    {
      question: 'What body of water separates Cinnabar Island from the Kanto mainland?',
      answer: 'The ocean',
      others: ['A river', 'A lake', 'A canal'],
      hint: 'It\'s an island — look at the map!',
    },
    {
      question: 'Which region in Pokemon games is known for its deserts and ancient ruins?',
      answer: 'Hoenn',
      others: ['Kanto', 'Johto', 'Unova'],
      hint: 'Ruby and Sapphire feature the Desert Ruins.',
    },
    // Expanded entries
    {
      question: 'How many continents are there in the real world?',
      answer: '7',
      others: ['5', '6', '8'],
      hint: 'Count them all — one of them is very cold!',
    },
    {
      question: 'Which real-world ocean is the largest?',
      answer: 'Pacific Ocean',
      others: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean'],
      hint: 'Lapras would need a very long time to cross it!',
    },
    {
      question: 'What is the longest river in the world?',
      answer: 'The Nile River',
      others: ['The Amazon River', 'The Mississippi River', 'The Yangtze River'],
      hint: 'It flows through Egypt in Africa.',
    },
    {
      question: 'Which is the largest desert in the world?',
      answer: 'The Sahara Desert',
      others: ['The Gobi Desert', 'The Arabian Desert', 'The Kalahari Desert'],
      hint: 'It\'s in northern Africa — Sandshrew would love it!',
    },
    {
      question: 'Mt. Everest is the tallest mountain on Earth. On which continent is it located?',
      answer: 'Asia',
      others: ['Europe', 'South America', 'North America'],
      hint: 'It\'s between Nepal and Tibet.',
    },
    {
      question: 'What is the capital city of Japan, where Pokemon was created?',
      answer: 'Tokyo',
      others: ['Osaka', 'Kyoto', 'Yokohama'],
      hint: 'It\'s the largest city in Japan.',
    },
    {
      question: 'Hoenn region has volcanoes. Where do real volcanoes often form?',
      answer: 'Along tectonic plate boundaries',
      others: ['In the middle of flat plains', 'Only on islands', 'Near the North Pole'],
      hint: 'The Ring of Fire is a famous volcanic zone.',
    },
    {
      question: 'Which direction does the sun rise?',
      answer: 'East',
      others: ['West', 'North', 'South'],
      hint: 'Ho-Oh is said to fly toward the rising sun!',
    },
    {
      question: 'A compass rose shows directions. What are the four cardinal directions?',
      answer: 'North, South, East, West',
      others: ['Up, Down, Left, Right', 'North, South, Northeast, Southwest', 'Forward, Backward, Left, Right'],
      hint: 'Trainers use these to navigate the map!',
    },
    {
      question: 'Which type of biome has the most rainfall?',
      answer: 'Tropical rainforest',
      others: ['Desert', 'Tundra', 'Grassland'],
      hint: 'Grass-type Pokemon would thrive here!',
    },
    {
      question: 'Which Pokemon region is inspired by the Spanish Iberian Peninsula?',
      answer: 'Paldea (Scarlet and Violet)',
      others: ['Kalos (X and Y)', 'Galar (Sword and Shield)', 'Unova (Black and White)'],
      hint: 'Think of Spain and Portugal!',
    },
    {
      question: 'Islands are surrounded by water on all sides. What do we call a piece of land surrounded by water on three sides?',
      answer: 'A peninsula',
      others: ['An island', 'A continent', 'An isthmus'],
      hint: 'Florida and Italy are shaped like this!',
    },
    {
      question: 'What imaginary line divides the Earth into Northern and Southern hemispheres?',
      answer: 'The Equator',
      others: ['The Prime Meridian', 'The Tropic of Cancer', 'The International Date Line'],
      hint: 'It runs around the middle of the globe.',
    },
    {
      question: 'What is the smallest continent?',
      answer: 'Australia',
      others: ['Europe', 'Antarctica', 'South America'],
      hint: 'Kangaskhan was inspired by animals from here!',
    },
    // Additional geography entries to reach 50
    {
      question: 'What is the largest country in the world by area?',
      answer: 'Russia',
      others: ['Canada', 'China', 'United States'],
      hint: 'It spans two continents — Europe and Asia!',
    },
    {
      question: 'Which mountain range runs along the west coast of South America?',
      answer: 'The Andes',
      others: ['The Rockies', 'The Himalayas', 'The Alps'],
      hint: 'It\'s the longest continental mountain range — Golem would love climbing it!',
    },
    {
      question: 'What is the name of the imaginary line at 0 degrees longitude?',
      answer: 'The Prime Meridian',
      others: ['The Equator', 'The Tropic of Capricorn', 'The International Date Line'],
      hint: 'It passes through Greenwich, England.',
    },
    {
      question: 'Which ocean lies between Africa and Australia?',
      answer: 'Indian Ocean',
      others: ['Pacific Ocean', 'Atlantic Ocean', 'Southern Ocean'],
      hint: 'Lapras would swim through it traveling from Kenya to Perth!',
    },
    {
      question: 'The Johto region is inspired by which part of Japan?',
      answer: 'The Kansai region (western Japan)',
      others: ['Hokkaido (northern Japan)', 'Okinawa (southern Japan)', 'Tokyo (eastern Japan)'],
      hint: 'It includes cities inspired by Osaka and Kyoto!',
    },
    {
      question: 'What type of landform is an island?',
      answer: 'Land completely surrounded by water',
      others: ['Land connected to a continent', 'A mountain above the clouds', 'A valley between two rivers'],
      hint: 'Cinnabar Island is one in the Pokemon world!',
    },
    {
      question: 'Which continent has the most countries?',
      answer: 'Africa',
      others: ['Asia', 'Europe', 'South America'],
      hint: 'It has over 50 countries!',
    },
    {
      question: 'What is the largest ocean on Earth?',
      answer: 'Pacific Ocean',
      others: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean'],
      hint: 'A Wailord could swim for months and still not cross it!',
    },
    {
      question: 'What natural feature separates Europe from Asia?',
      answer: 'The Ural Mountains',
      others: ['The Nile River', 'The Great Wall', 'The Sahara Desert'],
      hint: 'It is a mountain range in Russia.',
    },
    {
      question: 'Which country has the largest population in the world?',
      answer: 'India',
      others: ['China', 'United States', 'Indonesia'],
      hint: 'This South Asian country passed China in population recently!',
    },
    {
      question: 'In the Pokemon world, Sinnoh is inspired by which Japanese island?',
      answer: 'Hokkaido',
      others: ['Honshu', 'Kyushu', 'Shikoku'],
      hint: 'It is the northernmost main island of Japan, known for snow!',
    },
    {
      question: 'What is a delta in geography?',
      answer: 'A landform where a river meets the sea, depositing sediment',
      others: ['A type of mountain', 'A deep ocean trench', 'A frozen lake'],
      hint: 'The Nile Delta in Egypt is a famous one — Totodile might live there!',
    },
    {
      question: 'What are the lines that run east-west on a globe called?',
      answer: 'Lines of latitude',
      others: ['Lines of longitude', 'Meridians', 'Time zones'],
      hint: 'The Equator is the most famous one, at 0 degrees!',
    },
    {
      question: 'Which is the driest continent on Earth?',
      answer: 'Antarctica',
      others: ['Africa', 'Australia', 'Asia'],
      hint: 'Even though it is covered in ice, it gets very little new precipitation!',
    },
    {
      question: 'What is the tallest waterfall in the world?',
      answer: 'Angel Falls in Venezuela',
      others: ['Niagara Falls in the USA', 'Victoria Falls in Africa', 'Iguazu Falls in Brazil'],
      hint: 'Gyarados would have quite a splash going over this one!',
    },
    {
      question: 'A plateau is a type of landform. What shape does it have?',
      answer: 'A flat, elevated area like a table top',
      others: ['A pointed peak', 'A deep valley', 'A round hill'],
      hint: 'Think of a mountain with a flat top!',
    },
    {
      question: 'Which Pokemon region is inspired by the Kyushu area of Japan?',
      answer: 'Hoenn (Ruby and Sapphire)',
      others: ['Kanto (Red and Blue)', 'Johto (Gold and Silver)', 'Sinnoh (Diamond and Pearl)'],
      hint: 'This region is known for its tropical climate and lots of water routes!',
    },
    {
      question: 'What is the Ring of Fire?',
      answer: 'A horseshoe-shaped zone of volcanoes and earthquakes around the Pacific Ocean',
      others: ['A circle of fire in a desert', 'A legendary Pokemon formation', 'A meteor impact site'],
      hint: 'Many volcanoes and earthquakes happen here — Groudon territory!',
    },
    {
      question: 'What is an archipelago?',
      answer: 'A chain or group of islands',
      others: ['A single large island', 'A type of mountain', 'A deep ocean trench'],
      hint: 'The Alola region is one — a chain of tropical islands!',
    },
  ];

  const item = randItem(geoItems);
  const choices = shuffleArray([item.answer, ...item.others]);

  return {
    type: 'geographyExplorer',
    question: item.question,
    answer: item.answer,
    choices,
    hint: item.hint,
  };
}

// ---------------------------------------------------------------------------
// 24. genScienceLab — Science questions with Pokemon theme
// ---------------------------------------------------------------------------
function genScienceLab() {
  const scienceItems = [
    // States of matter
    { question: 'What state of matter is water at 0°C (freezing point)?', answer: 'Solid (ice)', others: ['Liquid', 'Gas', 'Plasma'], hint: 'Like Jynx\'s icy world!' },
    { question: 'What state of matter is Vaporeon\'s watery form?', answer: 'Liquid', others: ['Solid', 'Gas', 'Plasma'], hint: 'It flows and takes the shape of its container.' },
    { question: 'Charizard breathes fire, which is a very hot ___?', answer: 'Gas', others: ['Liquid', 'Solid', 'Plasma'], hint: 'Flames are hot expanding gases!' },
    { question: 'What state of matter is a Poke Ball when it is closed?', answer: 'Solid', others: ['Liquid', 'Gas', 'Plasma'], hint: 'It keeps its shape and cannot be poured.' },
    { question: 'When water boils and becomes steam, what state of matter is it in?', answer: 'Gas', others: ['Solid', 'Liquid', 'Plasma'], hint: 'Steam rises up like Koffing floats!' },
    { question: 'An ice cube melting is changing from what state to what state?', answer: 'Solid to liquid', others: ['Liquid to gas', 'Gas to solid', 'Gas to liquid'], hint: 'The ice becomes water!' },
    // Life science
    { question: 'What process do Grass-type Pokemon use to absorb energy from sunlight?', answer: 'Photosynthesis', others: ['Respiration', 'Digestion', 'Osmosis'], hint: 'Like Bulbasaur soaking up sunlight through its bulb!' },
    { question: 'What do caterpillar Pokemon like Caterpie use their STRING SHOT for?', answer: 'Building a cocoon', others: ['Catching prey', 'Building a nest', 'Storing food'], hint: 'It\'s the first step to evolving into Butterfree!' },
    { question: 'Magnemite has MAGNETS on the side of its body. What force do magnets create?', answer: 'Magnetic force', others: ['Gravity', 'Friction', 'Electric current'], hint: 'It\'s right in the name!' },
    { question: 'What type of energy does Pikachu store in its cheeks?', answer: 'Electrical energy', others: ['Heat energy', 'Light energy', 'Chemical energy'], hint: 'Pikachu is the Electric Mouse Pokemon!' },
    { question: 'What is the process of a caterpillar changing into a butterfly called?', answer: 'Metamorphosis', others: ['Photosynthesis', 'Hibernation', 'Migration'], hint: 'Caterpie becomes Metapod becomes Butterfree!' },
    { question: 'All living things are made of tiny building blocks called ___?', answer: 'Cells', others: ['Atoms', 'Molecules', 'Pixels'], hint: 'Scientists use microscopes to see them.' },
    { question: 'What gas do humans and Pokemon breathe in to survive?', answer: 'Oxygen', others: ['Carbon dioxide', 'Nitrogen', 'Helium'], hint: 'Plants produce this gas!' },
    { question: 'What gas do plants and Grass-type Pokemon absorb from the air?', answer: 'Carbon dioxide', others: ['Oxygen', 'Nitrogen', 'Helium'], hint: 'CO2 — plants use it with sunlight to make food.' },
    { question: 'What body system pumps blood through your body?', answer: 'Circulatory system', others: ['Nervous system', 'Digestive system', 'Skeletal system'], hint: 'Your heart is the pump!' },
    // Earth science
    { question: 'Geodude is a Rock-type Pokemon. What category of Earth material is rock?', answer: 'Mineral / Inorganic solid', others: ['Organic matter', 'Liquid', 'Gas'], hint: 'Rocks are made of minerals.' },
    { question: 'Onix tunnels through the earth. Which layer of Earth is closest to the surface?', answer: 'Crust', others: ['Mantle', 'Outer core', 'Inner core'], hint: 'We live on the Earth\'s ___.' },
    { question: 'What causes the weather pattern that leads to rain in the Pokemon world (and real life)?', answer: 'Water vapor condensing in clouds', others: ['Wind pushing water upward', 'Oceans boiling in summer', 'Pokemon using Rain Dance'], hint: 'The water cycle: evaporation → clouds → precipitation.' },
    { question: 'Groudon can expand landmasses. What do we call the shifting of Earth\'s land masses?', answer: 'Plate tectonics', others: ['Erosion', 'Weathering', 'Photosynthesis'], hint: 'Large plates of the Earth\'s crust move slowly over millions of years.' },
    { question: 'What type of rock is formed when lava from a volcano cools down?', answer: 'Igneous rock', others: ['Sedimentary rock', 'Metamorphic rock', 'Limestone'], hint: 'Magmar lives near volcanoes where this rock forms!' },
    { question: 'What is the water cycle?', answer: 'The continuous movement of water through evaporation, condensation, and precipitation', others: ['Water flowing downhill only', 'Clouds forming once and disappearing', 'Rain falling only over oceans'], hint: 'Vaporeon demonstrates evaporation perfectly!' },
    { question: 'What causes the seasons to change on Earth?', answer: 'The tilt of Earth\'s axis as it orbits the Sun', others: ['The distance from Earth to the Sun', 'Clouds blocking sunlight', 'The moon\'s gravity'], hint: 'Earth is tilted at 23.5 degrees!' },
    { question: 'What natural event is measured by the Richter scale?', answer: 'Earthquakes', others: ['Hurricanes', 'Tornadoes', 'Volcanic eruptions'], hint: 'Dugtrio might cause small ones when it digs!' },
    // Physical science
    { question: 'When Golem uses ROLLOUT and gets faster and faster, what is increasing?', answer: 'Speed / Velocity', others: ['Weight', 'Color', 'Temperature'], hint: 'Each turn Rollout goes faster — that\'s acceleration!' },
    { question: 'Snorlax has a huge mass. On Earth, what is the force pulling Snorlax downward?', answer: 'Gravity', others: ['Friction', 'Magnetism', 'Air pressure'], hint: 'It\'s what keeps everything on the ground!' },
    { question: 'Arcanine is incredibly fast. What unit do we use to measure speed?', answer: 'Miles per hour (mph) or km/h', others: ['Pounds', 'Degrees Celsius', 'Cubic meters'], hint: 'Speed = distance ÷ time.' },
    { question: 'When Pikachu uses Thunderbolt, it converts electrical energy into ___ and ___?', answer: 'Light and heat', others: ['Sound and color', 'Wind and water', 'Gravity and motion'], hint: 'Lightning flashes bright and feels hot!' },
    { question: 'What is the force that slows down a rolling Poke Ball on the ground?', answer: 'Friction', others: ['Gravity', 'Magnetism', 'Inertia'], hint: 'It happens when two surfaces rub together.' },
    { question: 'When Jigglypuff sings, the sound travels through the air as ___?', answer: 'Sound waves', others: ['Light rays', 'Water droplets', 'Electric signals'], hint: 'Sound is a type of wave that vibrates air molecules.' },
    { question: 'What happens to water when it is heated to 100°C at sea level?', answer: 'It boils and turns to steam', others: ['It freezes solid', 'It stays the same', 'It turns into ice'], hint: 'That\'s the boiling point!' },
    { question: 'A rainbow appears after rain. What splits white light into colors?', answer: 'A prism (or water droplets acting like prisms)', others: ['Wind', 'Temperature changes', 'Magnets'], hint: 'Ho-Oh trailing a rainbow is like light passing through water!' },
    { question: 'Which travels faster — light or sound?', answer: 'Light', others: ['Sound', 'They travel at the same speed', 'It depends on the weather'], hint: 'You see lightning before you hear thunder!' },
    { question: 'What force keeps the Moon orbiting Earth and Earth orbiting the Sun?', answer: 'Gravity', others: ['Magnetism', 'Friction', 'Wind'], hint: 'It\'s the same force that pulls Snorlax to the ground!' },
    // Biology / animal science
    { question: 'Butterfree is an insect Pokemon. How many legs do real insects have?', answer: '6 legs', others: ['4 legs', '8 legs', '10 legs'], hint: 'Spiders have 8, but insects have fewer!' },
    { question: 'What do we call animals that eat only plants?', answer: 'Herbivores', others: ['Carnivores', 'Omnivores', 'Decomposers'], hint: 'Bulbasaur absorbs sunlight like a plant but eats like a herbivore!' },
    { question: 'What do we call animals that eat both plants and meat?', answer: 'Omnivores', others: ['Herbivores', 'Carnivores', 'Parasites'], hint: 'Humans are this type!' },
    { question: 'Fish Pokemon like Magikarp breathe using what organ?', answer: 'Gills', others: ['Lungs', 'Skin', 'Nose'], hint: 'It extracts oxygen from water.' },
    { question: 'Ekans and Arbok are snake Pokemon. What class of animals are real snakes?', answer: 'Reptiles', others: ['Mammals', 'Amphibians', 'Fish'], hint: 'They are cold-blooded and have scales.' },
    { question: 'What is the closest star to Earth?', answer: 'The Sun', others: ['The Moon', 'Polaris (North Star)', 'Alpha Centauri'], hint: 'It gives us light and warmth every day!' },
    { question: 'How many planets are in our solar system?', answer: '8', others: ['7', '9', '10'], hint: 'Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune!' },
    // Additional science entries to reach 50
    { question: 'What is the main gas that makes up Earth\'s atmosphere?', answer: 'Nitrogen', others: ['Oxygen', 'Carbon dioxide', 'Helium'], hint: 'It makes up about 78% of the air — even Koffing breathes it!' },
    { question: 'What organ in the human body is responsible for thinking?', answer: 'The brain', others: ['The heart', 'The lungs', 'The stomach'], hint: 'Alakazam\'s is incredibly powerful!' },
    { question: 'What is the process by which plants make their own food using sunlight?', answer: 'Photosynthesis', others: ['Respiration', 'Fermentation', 'Condensation'], hint: 'Bulbasaur does this through the bulb on its back!' },
    { question: 'What type of animal lays eggs and has feathers?', answer: 'Birds', others: ['Mammals', 'Reptiles', 'Amphibians'], hint: 'Pidgey and Spearow are examples in the Pokemon world!' },
    { question: 'What is the hardest natural substance on Earth?', answer: 'Diamond', others: ['Gold', 'Iron', 'Quartz'], hint: 'Sableye loves to eat gemstones, and this is the toughest one!' },
  ];

  const item = randItem(scienceItems);
  const choices = shuffleArray([item.answer, ...item.others]);

  return {
    type: 'scienceLab',
    question: item.question,
    answer: item.answer,
    choices,
    hint: item.hint,
  };
}

// ---------------------------------------------------------------------------
// 26. genCodeBreaker — Caesar cipher / number-to-letter decode
// ---------------------------------------------------------------------------
function genCodeBreaker(difficulty) {
  difficulty = difficulty || 5;

  // A=1, B=2 ... Z=26 encoding
  function encode(word) {
    return word.toUpperCase().split('').map(c => {
      const code = c.charCodeAt(0) - 64;
      return code > 0 && code <= 26 ? code : c;
    }).join(' ');
  }

  // Word pools by difficulty (shorter = easier)
  const words1 = ['CAT', 'DOG', 'BUG', 'RAT', 'APE', 'BAT', 'FIN', 'GUM', 'HOP', 'JAM', 'LOG', 'MUD', 'NET', 'PIG', 'RUN', 'EGG', 'FLY', 'MAP', 'ORB', 'DIG', 'GYM', 'OAK', 'ZAP', 'BOW', 'CUB'];
  const words2 = ['FIRE', 'BALL', 'LEAF', 'CAVE', 'POND', 'ROCK', 'WING', 'CLAW', 'FANG', 'NEST', 'VINE', 'DUST', 'WAVE', 'BOLT', 'ROAR', 'TAIL', 'HEAL', 'SEED', 'MIST', 'DARK', 'SWIM', 'FROG', 'HORN', 'GLOW', 'BEAK'];
  const words3 = ['PICHU', 'FLAME', 'WATER', 'GRASS', 'NIGHT', 'STORM', 'BADGE', 'TOWER', 'DREAM', 'GHOST', 'POWER', 'STONE', 'TRAIL', 'BEACH', 'CLOUD', 'MARSH', 'POTION', 'ARENA', 'RIVAL', 'FLARE', 'STEEL', 'FAIRY', 'ULTRA', 'SURGE', 'MISTY'];
  const words4 = ['PIKACHU', 'MEOWTH', 'GENGAR', 'LAPRAS', 'VULPIX', 'MEWTWO', 'ABRA', 'DITTO', 'EEVEE', 'CUBONE', 'HYPNO', 'ONIX', 'SEEL', 'DODUO', 'KABUTO', 'JOLTEON', 'GASTLY', 'PONYTA', 'KRABBY', 'PIDGEY', 'SCYTHER', 'MAGMAR', 'STARYU', 'HORSEA', 'ODDISH'];
  const words5 = ['CHARIZARD', 'BLASTOISE', 'VENUSAUR', 'DRAGONITE', 'SNORLAX', 'ALAKAZAM', 'ARCANINE', 'ELECTRODE', 'GYARADOS', 'MAGNEMITE', 'BUTTERFREE', 'NINETALES', 'RAPIDASH', 'TENTACOOL', 'SANDSLASH', 'EXEGGUTOR', 'KANGASKHAN', 'VILEPLUME', 'POLIWRATH', 'PRIMEAPE', 'TENTACRUEL', 'VICTREEBEL', 'GROWLITHE', 'CLOYSTER', 'HITMONLEE'];

  let pool;
  if (difficulty <= 1) pool = words1;
  else if (difficulty <= 2) pool = [...words1, ...words2];
  else if (difficulty <= 3) pool = [...words2, ...words3];
  else if (difficulty <= 4) pool = [...words3, ...words4];
  else pool = [...words4, ...words5];

  const word = randItem(pool);
  const coded = encode(word);

  // Use alternate cipher for harder difficulties (Caesar shift)
  let questionText, hint;
  if (difficulty <= 3) {
    questionText = `Decode this secret Pokemon message!\nKey: A=1, B=2, C=3 ... Z=26\nMessage: ${coded}\nWhat Pokemon (or word) is this?`;
    hint = 'Match each number to its letter: 1=A, 2=B, 3=C...';
  } else {
    // Caesar shift cipher (shift by 3 for difficulty 4-5)
    const shift = 3;
    const cipherText = word.split('').map(c => {
      const code = c.charCodeAt(0) - 65;
      const shifted = (code + shift) % 26;
      return String.fromCharCode(shifted + 65);
    }).join('');

    questionText = `Decode this Caesar cipher (shift back by ${shift})!\nCipher text: ${cipherText}\nWhat is the original word?`;
    hint = `Each letter was shifted forward by ${shift}. Shift it back!`;
  }

  // Generate wrong Pokemon names as distractors
  const allWrongWords = [
    ...words1, ...words2, ...words3, ...words4, ...words5,
  ].filter(w => w !== word);
  const wrongWords = randItems(allWrongWords, 3);
  const choices = shuffleArray([word, ...wrongWords]);

  return {
    type: 'codeBreaker',
    question: questionText,
    answer: word,
    choices,
    hint,
    coded,
    word,
    difficulty,
  };
}

// =============================================================================
// SINGAPORE MATH ACTIVITIES
// =============================================================================

/**
 * Number Bond — whole splits into two parts, find the missing part
 * Levels 1-2: bonds to 10, Level 3: bonds to 20, Levels 4-5: bonds to 100
 */
function genNumberBond(difficulty) {
  let whole, partA;
  if (difficulty <= 2) {
    whole = Math.floor(Math.random() * 9) + 2; // 2-10
    partA = Math.floor(Math.random() * (whole - 1)) + 1;
  } else if (difficulty === 3) {
    whole = Math.floor(Math.random() * 11) + 10; // 10-20
    partA = Math.floor(Math.random() * (whole - 1)) + 1;
  } else {
    const tens = [20, 30, 40, 50, 60, 70, 80, 90, 100];
    whole = tens[Math.floor(Math.random() * tens.length)];
    partA = Math.floor(Math.random() * (whole - 1)) + 1;
    // Keep partA as a round number sometimes for higher levels
    if (Math.random() < 0.5) partA = Math.round(partA / 10) * 10 || 10;
  }
  const partB = whole - partA;
  // Randomly decide which part is missing
  const missingA = Math.random() < 0.5;
  const answer = missingA ? partA : partB;
  const shownPart = missingA ? partB : partA;

  // Generate wrong choices
  const wrongs = new Set();
  while (wrongs.size < 3) {
    const off = Math.floor(Math.random() * 5) + 1;
    const w = answer + (Math.random() < 0.5 ? off : -off);
    if (w > 0 && w !== answer && w < whole) wrongs.add(w);
  }
  // Fill if needed
  let fill = 1;
  while (wrongs.size < 3) { if (fill !== answer && fill > 0) wrongs.add(fill); fill++; }

  const choices = shuffleArray([answer, ...Array.from(wrongs).slice(0, 3)]);

  return {
    type: 'numberBond',
    question: `What completes this number bond?`,
    answer,
    choices,
    whole,
    partA: missingA ? null : partA,
    partB: missingA ? partB : null,
    difficulty,
  };
}

/**
 * Make 10 (or Make 100) — number complement / "what adds to 10?"
 * Levels 1-2: complements to 10, Level 3: complements to 20,
 * Levels 4-5: complements to 100
 */
function genMakeTen(difficulty) {
  let target, shown, answer;

  if (difficulty <= 2) {
    // Simple: "I have 3, how many more to make 10?"
    target = 10;
    shown = Math.floor(Math.random() * 9) + 1; // 1-9
    answer = target - shown;
  } else if (difficulty === 3) {
    // Complements to 20
    target = 20;
    shown = Math.floor(Math.random() * 19) + 1; // 1-19
    answer = target - shown;
  } else {
    // Complements to 100 (use friendly numbers)
    target = 100;
    const options = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95];
    shown = options[Math.floor(Math.random() * options.length)];
    answer = target - shown;
  }

  const wrongs = new Set();
  while (wrongs.size < 3) {
    const off = Math.floor(Math.random() * 5) + 1;
    const w = answer + (Math.random() < 0.5 ? off : -off);
    if (w > 0 && w !== answer && w < target) wrongs.add(w);
  }
  let fill = 1;
  while (wrongs.size < 3) { if (fill !== answer && fill > 0 && fill < target) wrongs.add(fill); fill++; }

  const choices = shuffleArray([answer, ...Array.from(wrongs).slice(0, 3)]);

  return {
    type: 'makeTen',
    question: `I have ${shown}. How many more to make ${target}?`,
    answer,
    choices,
    numA: shown,
    numB: answer,
    toTen: answer,
    remainder: 0,
    total: target,
    target,
    difficulty,
  };
}

/**
 * Bar Model — visual bar-model word problems
 * Levels 1-3: part-whole, Level 4: comparison, Level 5: two-step
 */
function genBarModel(difficulty) {
  const pokemonNames = ['Pikachu', 'Charmander', 'Bulbasaur', 'Squirtle', 'Eevee', 'Jigglypuff', 'Meowth', 'Psyduck', 'Snorlax', 'Gengar'];
  const name1 = pokemonNames[Math.floor(Math.random() * pokemonNames.length)];
  let name2 = pokemonNames[Math.floor(Math.random() * pokemonNames.length)];
  while (name2 === name1) name2 = pokemonNames[Math.floor(Math.random() * pokemonNames.length)];

  const items = ['berries', 'Poké Balls', 'stickers', 'candies', 'coins', 'apples'];
  const item = items[Math.floor(Math.random() * items.length)];

  let answer, question, barParts, barTotal, barLabel;

  if (difficulty <= 3) {
    // Part-whole: A has X, B has Y, how many total? (or total given, find one part)
    const maxNum = difficulty === 1 ? 10 : difficulty === 2 ? 20 : 50;
    const partA = Math.floor(Math.random() * (maxNum / 2)) + 1;
    const partB = Math.floor(Math.random() * (maxNum / 2)) + 1;
    const total = partA + partB;

    if (Math.random() < 0.5) {
      // Find total
      question = `${name1} has ${partA} ${item}. ${name2} has ${partB} ${item}. How many ${item} altogether?`;
      answer = total;
      barParts = [{ label: name1, value: partA, color: '#4A90D9' }, { label: name2, value: partB, color: '#FF6B35' }];
      barTotal = null; // unknown
      barLabel = `? ${item} total`;
    } else {
      // Find missing part
      question = `There are ${total} ${item} in all. ${name1} has ${partA}. How many does ${name2} have?`;
      answer = partB;
      barParts = [{ label: name1, value: partA, color: '#4A90D9' }, { label: '?', value: partB, color: '#FFB74D' }];
      barTotal = total;
      barLabel = `${total} ${item} total`;
    }
  } else if (difficulty === 4) {
    // Comparison
    const smaller = Math.floor(Math.random() * 30) + 10;
    const diff = Math.floor(Math.random() * 20) + 5;
    const larger = smaller + diff;

    question = `${name1} has ${larger} ${item}. ${name2} has ${smaller} ${item}. How many more does ${name1} have?`;
    answer = diff;
    barParts = [{ label: name1, value: larger, color: '#4A90D9' }, { label: name2, value: smaller, color: '#FF6B35' }];
    barTotal = null;
    barLabel = `Difference: ?`;
  } else {
    // Two-step
    const a = Math.floor(Math.random() * 30) + 10;
    const b = Math.floor(Math.random() * 20) + 10;
    const c = Math.floor(Math.random() * 15) + 5;

    question = `${name1} had ${a} ${item}. ${name2} gave ${name1} ${b} more. Then ${name1} used ${c}. How many does ${name1} have now?`;
    answer = a + b - c;
    barParts = [{ label: 'Start', value: a, color: '#4A90D9' }, { label: '+' + b, value: b, color: '#4CAF50' }, { label: '−' + c, value: c, color: '#E53935' }];
    barTotal = null;
    barLabel = `Result: ?`;
  }

  const wrongs = new Set();
  while (wrongs.size < 3) {
    const off = Math.floor(Math.random() * 8) + 1;
    const w = answer + (Math.random() < 0.5 ? off : -off);
    if (w > 0 && w !== answer) wrongs.add(w);
  }
  let fill = answer + 1;
  while (wrongs.size < 3) { if (fill !== answer) wrongs.add(fill); fill++; }

  const choices = shuffleArray([answer, ...Array.from(wrongs).slice(0, 3)]);

  return {
    type: 'barModel',
    question,
    answer,
    choices,
    barParts,
    barTotal,
    barLabel,
    difficulty,
  };
}

/**
 * Place Value — identify digit values in numbers
 * Levels 1-2: tens/ones, Level 3: hundreds, Level 4: thousands, Level 5: expanded form
 */
function genPlaceValue(difficulty) {
  if (difficulty <= 2) {
    const num = Math.floor(Math.random() * 90) + 10; // 10-99
    const tens = Math.floor(num / 10);
    const ones = num % 10;
    const askTens = Math.random() < 0.5;
    const answer = askTens ? tens : ones;
    const place = askTens ? 'tens' : 'ones';
    const question = `What digit is in the ${place} place of ${num}?`;

    const wrongs = new Set();
    wrongs.add(askTens ? ones : tens);
    while (wrongs.size < 3) {
      const w = Math.floor(Math.random() * 10);
      if (w !== answer) wrongs.add(w);
    }
    const choices = shuffleArray([answer, ...Array.from(wrongs).slice(0, 3)]);

    return {
      type: 'placeValue',
      question,
      answer,
      choices,
      number: num,
      place,
      digits: [{ place: 'tens', value: tens }, { place: 'ones', value: ones }],
      difficulty,
    };
  } else if (difficulty === 3) {
    const num = Math.floor(Math.random() * 900) + 100; // 100-999
    const h = Math.floor(num / 100);
    const t = Math.floor((num % 100) / 10);
    const o = num % 10;
    const places = ['hundreds', 'tens', 'ones'];
    const vals = [h, t, o];
    const pi = Math.floor(Math.random() * 3);
    const answer = vals[pi];
    const place = places[pi];
    const question = `What digit is in the ${place} place of ${num}?`;

    const wrongs = new Set();
    vals.forEach(v => { if (v !== answer) wrongs.add(v); });
    while (wrongs.size < 3) {
      const w = Math.floor(Math.random() * 10);
      if (w !== answer) wrongs.add(w);
    }
    const choices = shuffleArray([answer, ...Array.from(wrongs).slice(0, 3)]);

    return {
      type: 'placeValue',
      question,
      answer,
      choices,
      number: num,
      place,
      digits: [{ place: 'hundreds', value: h }, { place: 'tens', value: t }, { place: 'ones', value: o }],
      difficulty,
    };
  } else if (difficulty === 4) {
    const num = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
    const th = Math.floor(num / 1000);
    const h = Math.floor((num % 1000) / 100);
    const t = Math.floor((num % 100) / 10);
    const o = num % 10;
    const places = ['thousands', 'hundreds', 'tens', 'ones'];
    const vals = [th, h, t, o];
    const pi = Math.floor(Math.random() * 4);
    const answer = vals[pi];
    const place = places[pi];
    const question = `What digit is in the ${place} place of ${num.toLocaleString()}?`;

    const wrongs = new Set();
    vals.forEach(v => { if (v !== answer) wrongs.add(v); });
    while (wrongs.size < 3) {
      const w = Math.floor(Math.random() * 10);
      if (w !== answer) wrongs.add(w);
    }
    const choices = shuffleArray([answer, ...Array.from(wrongs).slice(0, 3)]);

    return {
      type: 'placeValue',
      question,
      answer,
      choices,
      number: num,
      place,
      digits: [{ place: 'thousands', value: th }, { place: 'hundreds', value: h }, { place: 'tens', value: t }, { place: 'ones', value: o }],
      difficulty,
    };
  } else {
    // Level 5: expanded form
    const num = Math.floor(Math.random() * 9000) + 1000;
    const th = Math.floor(num / 1000) * 1000;
    const h = Math.floor((num % 1000) / 100) * 100;
    const t = Math.floor((num % 100) / 10) * 10;
    const o = num % 10;
    const correctExpanded = `${th} + ${h} + ${t} + ${o}`;

    // Generate wrong expanded forms
    const wrongs = [];
    // Swap two place values
    wrongs.push(`${h} + ${th} + ${t} + ${o}`);
    // Wrong thousands
    const wrongTh = ((Math.floor(num / 1000) % 9) + 1) * 1000;
    wrongs.push(`${wrongTh} + ${h} + ${t} + ${o}`);
    // Off by one in hundreds
    const wrongH = ((Math.floor((num % 1000) / 100) + 1) % 10) * 100;
    wrongs.push(`${th} + ${wrongH} + ${t} + ${o}`);

    const choices = shuffleArray([correctExpanded, ...wrongs.slice(0, 3)]);

    return {
      type: 'placeValue',
      question: `What is the expanded form of ${num.toLocaleString()}?`,
      answer: correctExpanded,
      choices,
      number: num,
      place: 'expanded',
      digits: [{ place: 'thousands', value: Math.floor(num / 1000) }, { place: 'hundreds', value: Math.floor((num % 1000) / 100) }, { place: 'tens', value: Math.floor((num % 100) / 10) }, { place: 'ones', value: num % 10 }],
      difficulty,
    };
  }
}

// =============================================================================
// ACTIVITY REGISTRY
// =============================================================================

const ACTIVITY_REGISTRY = {
  // === MATH ACTIVITIES ===
  countingCatch:     { name: 'Counting Catch',      icon: '🔢', levels: [1, 2, 3],    skill: 'math',      generator: genCountingCatch },
  patternPath:       { name: 'Pattern Path',        icon: '🧩', levels: [1, 2, 3],    skill: 'math',      generator: genPatternPath },
  numberLineRace:    { name: 'Number Line Race',    icon: '📏', levels: [2, 3],       skill: 'math',      generator: genNumberLineRace },
  moreOrLess:        { name: 'More or Less',        icon: '⚖️', levels: [1, 2],       skill: 'math',      generator: genMoreOrLess },
  potionMixer:       { name: 'Potion Mixer',        icon: '🧪', levels: [3, 4],       skill: 'math',      generator: genPotionMixer },
  coinCounter:       { name: 'Coin Counter',        icon: '🪙', levels: [3, 4, 5],    skill: 'math',      generator: genCoinCounter },
  missingNumber:     { name: 'Missing Number',      icon: '❓', levels: [2, 3, 4],    skill: 'math',      generator: genMissingNumber },
  multiPowerup:      { name: 'Multiply Power-Up',   icon: '💪', levels: [4, 5],       skill: 'math',      generator: genMultiplicationPowerup },
  timesTable:        { name: 'Times Tables',        icon: '✖️', levels: [2, 3, 4, 5], skill: 'math',      generator: genTimesTable },
  breederFractions:  { name: 'Breeder Fractions',   icon: '🥚', levels: [5],          skill: 'math',      generator: genBreederFractions },
  numberBond:        { name: 'Number Bond',         icon: '🔗', levels: [1, 2, 3, 4, 5], skill: 'math',  generator: genNumberBond },
  makeTen:           { name: 'Make 10',             icon: '🎯', levels: [2, 3, 4, 5],    skill: 'math',  generator: genMakeTen },
  barModel:          { name: 'Bar Model',           icon: '📊', levels: [1, 2, 3, 4, 5], skill: 'math',  generator: genBarModel },
  placeValue:        { name: 'Place Value',         icon: '🔢', levels: [1, 2, 3, 4, 5], skill: 'math',  generator: genPlaceValue },

  // === SCIENCE / LOGIC / STRATEGY ===
  typeAdvantageQuiz: { name: 'Type Advantage Quiz', icon: '⚔️', levels: [4, 5],       skill: 'strategy',  generator: genTypeAdvantageQuiz },
  geographyExplorer: { name: 'Geography Explorer',  icon: '🗺️', levels: [5],          skill: 'science',   generator: genGeographyExplorer },
  scienceLab:        { name: 'Science Lab',         icon: '🔬', levels: [4, 5],       skill: 'science',   generator: genScienceLab },
  codeBreaker:       { name: 'Code Breaker',        icon: '🔐', levels: [5],          skill: 'logic',     generator: genCodeBreaker },

  // === KEPT READING ACTIVITIES (generators defined in this file) ===
  storySequence:       { name: 'Story Sequence',       icon: '📖', levels: [3, 4],       skill: 'reading',        generator: genStorySequence },
  pokedexSpeller:      { name: 'Pokédex Speller',      icon: '✏️', levels: [3, 4],       skill: 'spelling',       generator: genPokedexSpeller },
};

// New reading curriculum activities are registered in reading-activities.js and reading-activities-advanced.js
// after those files load (they call Object.assign(ACTIVITY_REGISTRY, {...}))
