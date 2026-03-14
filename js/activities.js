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
    question: 'How many Pokémon do you see?',
    answer: String(count),
    choices,
    hint: 'Count each one carefully!',
    emoji,
    display,
    count,
  };
}

// ---------------------------------------------------------------------------
// 3. genShapeSorting — Match shapes
// ---------------------------------------------------------------------------
function genShapeSorting() {
  const shapes = [
    { name: 'circle',    emoji: '⭕', others: ['square', 'triangle', 'star'],     color: '#FF6B6B' },
    { name: 'square',    emoji: '🟦', others: ['circle',  'triangle', 'heart'],   color: '#4ECDC4' },
    { name: 'triangle',  emoji: '🔺', others: ['circle',  'square',   'diamond'], color: '#FFE66D' },
    { name: 'star',      emoji: '⭐', others: ['circle',  'square',   'heart'],   color: '#A8E6CF' },
    { name: 'heart',     emoji: '❤️', others: ['square', 'triangle', 'diamond'],  color: '#FF8B94' },
    { name: 'diamond',   emoji: '💎', others: ['circle',  'heart',    'star'],    color: '#9B59B6' },
    { name: 'oval',      emoji: '🥚', others: ['square',  'triangle', 'star'],    color: '#F7DC6F' },
    { name: 'rectangle', emoji: '📱', others: ['circle',  'heart',    'diamond'], color: '#82E0AA' },
    { name: 'crescent',  emoji: '🌙', others: ['circle',  'square',   'triangle'],color: '#F4D03F' },
    { name: 'cross',     emoji: '✝️', others: ['circle',  'star',     'diamond'], color: '#AED6F1' },
    { name: 'hexagon',   emoji: '⬡',  others: ['circle',  'square',   'triangle'],color: '#D2B4DE' },
    { name: 'arrow',     emoji: '➡️', others: ['circle',  'square',   'heart'],   color: '#A3E4D7' },
    { name: 'pentagon',  emoji: '⬠',  others: ['circle',  'square',   'triangle'],color: '#FADBD8' },
    { name: 'octagon',   emoji: '🛑', others: ['circle',  'square',   'heart'],   color: '#E74C3C' },
    { name: 'ring',      emoji: '💍', others: ['diamond',  'star',    'heart'],   color: '#F9E79F' },
    { name: 'sphere',    emoji: '🔮', others: ['square', 'triangle',  'diamond'], color: '#BB8FCE' },
    { name: 'cube',      emoji: '🎲', others: ['circle',  'triangle', 'heart'],   color: '#85C1E9' },
    { name: 'cone',      emoji: '🍦', others: ['circle',  'square',   'diamond'], color: '#F5CBA7' },
    { name: 'cylinder',  emoji: '🧴', others: ['circle',  'triangle', 'star'],    color: '#AEB6BF' },
    { name: 'spiral',    emoji: '🌀', others: ['circle',  'square',   'triangle'],color: '#76D7C4' },
  ];

  const emojiMap = {
    circle: '⭕', square: '🟦', triangle: '🔺', star: '⭐',
    heart: '❤️', diamond: '💎', oval: '🥚', rectangle: '📱',
    crescent: '🌙', cross: '✝️', hexagon: '⬡', arrow: '➡️',
    pentagon: '⬠', octagon: '🛑', ring: '💍', sphere: '🔮',
    cube: '🎲', cone: '🍦', cylinder: '🧴', spiral: '🌀',
  };

  const item = randItem(shapes);
  const wrongEmojis = item.others.map(s => emojiMap[s] || s);
  const choices = shuffleArray([item.emoji, ...wrongEmojis]);

  return {
    type: 'shapeSorting',
    question: `Which shape is a ${item.name}?`,
    answer: item.emoji,
    choices,
    hint: `A ${item.name} looks like ${item.emoji}`,
    shapeName: item.name,
    shapeColor: item.color,
  };
}

// ---------------------------------------------------------------------------
// 4. genColorMatch — Pokemon type color association
// ---------------------------------------------------------------------------
function genColorMatch() {
  const colorItems = [
    { prompt: 'Fire-type Pokemon are usually...', answer: 'red', others: ['blue', 'green', 'purple'], example: 'Charizard' },
    { prompt: 'Water-type Pokemon are usually...', answer: 'blue', others: ['red', 'yellow', 'brown'], example: 'Squirtle' },
    { prompt: 'Grass-type Pokemon are usually...', answer: 'green', others: ['red', 'blue', 'orange'], example: 'Bulbasaur' },
    { prompt: 'Electric-type Pokemon are usually...', answer: 'yellow', others: ['blue', 'green', 'red'], example: 'Pikachu' },
    { prompt: 'Ghost-type Pokemon are usually...', answer: 'purple', others: ['red', 'blue', 'green'], example: 'Gastly' },
    { prompt: 'Rock-type Pokemon are usually...', answer: 'brown', others: ['blue', 'green', 'yellow'], example: 'Geodude' },
    { prompt: 'Ice-type Pokemon are usually...', answer: 'white', others: ['red', 'green', 'yellow'], example: 'Jynx' },
    { prompt: 'Poison-type Pokemon are usually...', answer: 'purple', others: ['red', 'blue', 'green'], example: 'Grimer' },
    { prompt: 'Psychic-type Pokemon are usually...', answer: 'pink', others: ['blue', 'green', 'brown'], example: 'Jigglypuff' },
    { prompt: 'Normal-type Pokemon are usually...', answer: 'tan', others: ['red', 'blue', 'green'], example: 'Eevee' },
    { prompt: 'Bug-type Pokemon are usually...', answer: 'green', others: ['red', 'blue', 'purple'], example: 'Caterpie' },
    { prompt: 'Flying-type Pokemon are usually...', answer: 'blue', others: ['red', 'green', 'brown'], example: 'Pidgey' },
    { prompt: 'Ground-type Pokemon are usually...', answer: 'brown', others: ['blue', 'green', 'yellow'], example: 'Diglett' },
    { prompt: 'Fighting-type Pokemon are usually...', answer: 'red', others: ['blue', 'green', 'yellow'], example: 'Machop' },
    { prompt: 'Dragon-type Pokemon are usually...', answer: 'blue', others: ['red', 'green', 'pink'], example: 'Dratini' },
    // Additional color association questions
    { prompt: 'What color is Pikachu?', answer: 'yellow', others: ['red', 'blue', 'green'], example: 'Pikachu' },
    { prompt: 'What color is Charmander?', answer: 'orange', others: ['blue', 'green', 'purple'], example: 'Charmander' },
    { prompt: 'What color is Squirtle\'s shell?', answer: 'brown', others: ['blue', 'red', 'green'], example: 'Squirtle' },
    { prompt: 'What color is Bulbasaur?', answer: 'green', others: ['red', 'yellow', 'purple'], example: 'Bulbasaur' },
    { prompt: 'What color is Jigglypuff?', answer: 'pink', others: ['blue', 'yellow', 'green'], example: 'Jigglypuff' },
    { prompt: 'What color is Gengar?', answer: 'purple', others: ['red', 'blue', 'green'], example: 'Gengar' },
    { prompt: 'What color is Snorlax?', answer: 'blue', others: ['red', 'green', 'yellow'], example: 'Snorlax' },
    { prompt: 'What color is Meowth\'s coin?', answer: 'gold', others: ['silver', 'brown', 'red'], example: 'Meowth' },
    { prompt: 'What color are Charizard\'s wings?', answer: 'blue', others: ['red', 'orange', 'green'], example: 'Charizard' },
    { prompt: 'What color is Psyduck?', answer: 'yellow', others: ['blue', 'red', 'green'], example: 'Psyduck' },
    { prompt: 'What color is a Poke Ball (top half)?', answer: 'red', others: ['blue', 'green', 'yellow'], example: 'Poke Ball' },
    { prompt: 'What color is the Master Ball?', answer: 'purple', others: ['red', 'blue', 'green'], example: 'Master Ball' },
    { prompt: 'What color are most Grass-type moves?', answer: 'green', others: ['red', 'blue', 'yellow'], example: 'Vine Whip' },
    { prompt: 'What color is Dratini?', answer: 'blue', others: ['red', 'green', 'yellow'], example: 'Dratini' },
    { prompt: 'What color is Vulpix?', answer: 'orange', others: ['blue', 'green', 'purple'], example: 'Vulpix' },
  ];

  const item = randItem(colorItems);
  const choices = shuffleArray([item.answer, ...item.others]);

  const _swatchHex = {
    'red':'#FF0000','blue':'#0000FF','green':'#008000','yellow':'#FFD700',
    'orange':'#FF8C00','purple':'#800080','pink':'#FF69B4','brown':'#8B4513',
    'gray':'#808080','white':'#FFFFFF','black':'#000000',
  };
  const swatchMap = {};
  choices.forEach(opt => { swatchMap[opt] = _swatchHex[opt] || '#888'; });

  return {
    type: 'colorMatch',
    question: item.prompt,
    answer: item.answer,
    choices,
    hint: `Think about ${item.example}!`,
    example: item.example,
    swatchMap,
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
// 17. genHabitatMatch — Match Pokemon to habitats
// ---------------------------------------------------------------------------
function genHabitatMatch() {
  const habitatItems = [
    { pokemon: 'Squirtle',    habitat: 'ocean',   others: ['cave', 'forest', 'city'],     hint: 'Water-type Pokemon love the ocean!' },
    { pokemon: 'Lapras',      habitat: 'ocean',   others: ['sky', 'forest', 'cave'],      hint: 'Lapras swims through deep water.' },
    { pokemon: 'Tentacool',   habitat: 'ocean',   others: ['cave', 'city', 'forest'],     hint: 'It floats on the open sea.' },
    { pokemon: 'Bulbasaur',   habitat: 'forest',  others: ['ocean', 'cave', 'city'],      hint: 'Grass-types love leafy forests!' },
    { pokemon: 'Caterpie',    habitat: 'forest',  others: ['ocean', 'sky', 'city'],       hint: 'Bug Pokemon live among leaves.' },
    { pokemon: 'Pidgeot',     habitat: 'sky',     others: ['ocean', 'cave', 'forest'],    hint: 'Flying-types soar through the air.' },
    { pokemon: 'Charizard',   habitat: 'sky',     others: ['ocean', 'cave', 'city'],      hint: 'Charizard has large wings!' },
    { pokemon: 'Zubat',       habitat: 'cave',    others: ['ocean', 'forest', 'sky'],     hint: 'It avoids sunlight completely.' },
    { pokemon: 'Geodude',     habitat: 'cave',    others: ['ocean', 'forest', 'city'],    hint: 'Rock-types live in rocky caves.' },
    { pokemon: 'Onix',        habitat: 'cave',    others: ['ocean', 'sky', 'city'],       hint: 'Onix tunnels through the earth.' },
    { pokemon: 'Magnemite',   habitat: 'city',    others: ['ocean', 'forest', 'cave'],    hint: 'Electric-types are drawn to power plants.' },
    { pokemon: 'Voltorb',     habitat: 'city',    others: ['ocean', 'forest', 'sky'],     hint: 'Found in power plants!' },
    { pokemon: 'Jolteon',     habitat: 'city',    others: ['ocean', 'cave', 'forest'],    hint: 'Electric Pokemon love urban areas.' },
    { pokemon: 'Snorlax',     habitat: 'forest',  others: ['ocean', 'sky', 'city'],       hint: 'Snorlax naps on a forest path.' },
    { pokemon: 'Psyduck',     habitat: 'ocean',   others: ['sky', 'cave', 'city'],        hint: 'Psyduck is always found near water.' },
    // Expanded entries
    { pokemon: 'Goldeen',     habitat: 'ocean',   others: ['forest', 'cave', 'city'],     hint: 'Goldeen is the goldfish Pokemon!' },
    { pokemon: 'Staryu',      habitat: 'ocean',   others: ['forest', 'sky', 'cave'],      hint: 'Staryu lives along the coastline.' },
    { pokemon: 'Magikarp',    habitat: 'ocean',   others: ['cave', 'city', 'sky'],        hint: 'This fish splashes in rivers and seas.' },
    { pokemon: 'Shellder',    habitat: 'ocean',   others: ['forest', 'cave', 'city'],     hint: 'A clam Pokemon found on the seabed.' },
    { pokemon: 'Horsea',      habitat: 'ocean',   others: ['forest', 'sky', 'city'],      hint: 'A tiny seahorse that lives underwater.' },
    { pokemon: 'Oddish',      habitat: 'forest',  others: ['ocean', 'cave', 'city'],      hint: 'It buries itself in forest soil.' },
    { pokemon: 'Paras',       habitat: 'forest',  others: ['ocean', 'sky', 'city'],       hint: 'A bug Pokemon that lives among mushrooms.' },
    { pokemon: 'Bellsprout',  habitat: 'forest',  others: ['ocean', 'cave', 'city'],      hint: 'A plant Pokemon rooted in the forest.' },
    { pokemon: 'Tangela',     habitat: 'forest',  others: ['ocean', 'cave', 'sky'],       hint: 'Covered in vines that grow in forests.' },
    { pokemon: 'Pinsir',      habitat: 'forest',  others: ['ocean', 'cave', 'city'],      hint: 'A large bug found in dense forests.' },
    { pokemon: 'Fearow',      habitat: 'sky',     others: ['ocean', 'cave', 'forest'],    hint: 'A large bird that flies for miles.' },
    { pokemon: 'Butterfree',  habitat: 'sky',     others: ['ocean', 'cave', 'city'],      hint: 'A butterfly that floats on the breeze.' },
    { pokemon: 'Aerodactyl',  habitat: 'sky',     others: ['ocean', 'forest', 'city'],    hint: 'A prehistoric flying Pokemon.' },
    { pokemon: 'Dragonite',   habitat: 'sky',     others: ['ocean', 'cave', 'city'],      hint: 'A dragon that soars above the clouds.' },
    { pokemon: 'Clefairy',    habitat: 'cave',    others: ['ocean', 'forest', 'city'],    hint: 'Found deep inside Mt. Moon.' },
    { pokemon: 'Diglett',     habitat: 'cave',    others: ['ocean', 'sky', 'forest'],     hint: 'A mole that tunnels underground.' },
    { pokemon: 'Grimer',      habitat: 'city',    others: ['ocean', 'forest', 'cave'],    hint: 'Found in city sewers and factories.' },
    { pokemon: 'Porygon',     habitat: 'city',    others: ['ocean', 'forest', 'cave'],    hint: 'A digital Pokemon made by scientists.' },
    { pokemon: 'Mr. Mime',    habitat: 'city',    others: ['ocean', 'forest', 'cave'],    hint: 'Often found near towns and cities.' },
    { pokemon: 'Machop',      habitat: 'cave',    others: ['ocean', 'sky', 'city'],       hint: 'Trains among heavy boulders in caves.' },
  ];

  const habitatEmoji = { ocean: '🌊 Ocean', forest: '🌲 Forest', cave: '⛰️ Cave', city: '🏙️ City', sky: '☁️ Sky' };
  const item = randItem(habitatItems);
  const answerLabel = habitatEmoji[item.habitat] || item.habitat;
  const choiceLabels = shuffleArray([
    answerLabel,
    ...item.others.map(h => habitatEmoji[h] || h)
  ]);

  return {
    type: 'habitatMatch',
    question: `Where would you most likely find ${item.pokemon} in the wild?`,
    answer: answerLabel,
    choices: choiceLabels,
    hint: item.hint,
    pokemon: item.pokemon,
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
// 19. genReadingPassageQuiz — Reading comprehension with passage
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

// ---------------------------------------------------------------------------
// 20. genEstimationStation — Estimate a quantity within 20%
// ---------------------------------------------------------------------------
function genEstimationStation(difficulty) {
  difficulty = difficulty || 4;

  const scenarios = [
    { template: (n) => `About how many Zubat are in this cave cluster?\n${'🦇'.repeat(Math.min(n, 30))}${n > 30 ? '...' : ''}`, min: 10, max: 50, label: 'Zubat' },
    { template: (n) => `Approximately how many berries are on this bush?\n${'🍓'.repeat(Math.min(n, 25))}${n > 25 ? '...' : ''}`, min: 8, max: 40, label: 'berries' },
    { template: (n) => `About how many Poke Balls are in this pile?\n${'⚾'.repeat(Math.min(n, 20))}${n > 20 ? '...' : ''}`, min: 5, max: 30, label: 'Poke Balls' },
    { template: (n) => `Roughly how many Magikarp are in the pond?\n${'🐟'.repeat(Math.min(n, 20))}${n > 20 ? '...' : ''}`, min: 10, max: 60, label: 'Magikarp' },
    { template: (n) => `About how many coins did Ash find?\n${'🪙'.repeat(Math.min(n, 25))}${n > 25 ? '...' : ''}`, min: 15, max: 80, label: 'coins' },
    { template: (n) => `How many stars can you see in the night sky?\n${'⭐'.repeat(Math.min(n, 30))}${n > 30 ? '...' : ''}`, min: 10, max: 50, label: 'stars' },
    { template: (n) => `About how many Caterpie are on this tree?\n${'🐛'.repeat(Math.min(n, 25))}${n > 25 ? '...' : ''}`, min: 8, max: 40, label: 'Caterpie' },
    { template: (n) => `Roughly how many apples fell from the tree?\n${'🍎'.repeat(Math.min(n, 25))}${n > 25 ? '...' : ''}`, min: 5, max: 35, label: 'apples' },
    { template: (n) => `About how many footprints are on this trail?\n${'🐾'.repeat(Math.min(n, 25))}${n > 25 ? '...' : ''}`, min: 10, max: 50, label: 'footprints' },
    { template: (n) => `How many Voltorb are in the Power Plant?\n${'⚡'.repeat(Math.min(n, 20))}${n > 20 ? '...' : ''}`, min: 8, max: 45, label: 'Voltorb' },
  ];

  const ranges = {
    1: [5, 15],
    2: [10, 25],
    3: [15, 40],
    4: [20, 60],
    5: [30, 100],
  };
  const [lo, hi] = ranges[difficulty] || [20, 60];
  const scenario = randItem(scenarios);
  const actual = lo + Math.floor(Math.random() * (Math.min(hi, scenario.max) - Math.max(lo, scenario.min) + 1));

  // Generate choices all within reasonable range
  const tolerance = 0.2;
  const goodRange = Math.ceil(actual * tolerance);
  const wrongNums = wrongNumbers(actual, 3, Math.max(goodRange + 5, 10));
  const choices = buildChoices(actual, wrongNums.map(String));

  return {
    type: 'estimationStation',
    question: scenario.template(actual),
    answer: actual,
    choices,
    hint: `Your guess just needs to be within 20% of the real answer!`,
    tolerance,
    actual,
    label: scenario.label,
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
// 23. genBattleStrategy — Multi-step battle math with type effectiveness
// ---------------------------------------------------------------------------
function genBattleStrategy(difficulty) {
  difficulty = difficulty || 5;

  // Use POKEMON_DB and TYPE_CHART from game.js
  const allTypes = ['Fire', 'Water', 'Grass', 'Electric', 'Normal', 'Rock', 'Ground', 'Ghost', 'Psychic', 'Dragon', 'Bug', 'Flying', 'Fighting', 'Poison'];

  // Pick an attacking Pokemon and defender with a known type interaction
  const superEffectivePairs = [];
  for (const atkType of allTypes) {
    if (!TYPE_CHART[atkType]) continue;
    for (const defType of allTypes) {
      if (TYPE_CHART[atkType][defType] === 2) {
        superEffectivePairs.push({ atkType, defType, multiplier: 2 });
      }
    }
  }

  const pair = randItem(superEffectivePairs);

  // Find Pokemon from POKEMON_DB with matching types
  const attackers = POKEMON_DB ? POKEMON_DB.filter(p => p.type === pair.atkType) : [];
  const defenders = POKEMON_DB ? POKEMON_DB.filter(p => p.type === pair.defType) : [];

  const attacker = attackers.length > 0 ? randItem(attackers) : { name: pair.atkType + ' Pokemon', type: pair.atkType };
  const defender = defenders.length > 0 ? randItem(defenders) : { name: pair.defType + ' Pokemon', type: pair.defType };

  // Base damage values by difficulty
  const baseDamageOptions = {
    1: [10, 15, 20],
    2: [20, 25, 30],
    3: [30, 35, 40],
    4: [40, 45, 50, 55, 60],
    5: [50, 60, 70, 80, 90, 100],
  };
  const baseDamage = randItem(baseDamageOptions[difficulty] || [40]);
  const finalDamage = baseDamage * pair.multiplier;

  // Question type variety
  const qTemplates = [
    {
      question: `Your ${attacker.name} (${pair.atkType}) uses a move against ${defender.name} (${pair.defType}).\n${pair.atkType} is SUPER EFFECTIVE against ${pair.defType} (2× damage).\nIf the base damage is ${baseDamage}, how much damage does it deal?`,
      answer: finalDamage,
    },
    {
      question: `In a battle, ${attacker.name}'s ${pair.atkType}-type move has base power ${baseDamage}.\nIt hits ${defender.name} which is ${pair.defType}-type — that's super effective (2×)!\nWhat is the final damage?`,
      answer: finalDamage,
    },
    {
      question: `${attacker.name} uses a ${pair.atkType}-type attack on ${defender.name} (${pair.defType}-type).\nType advantage: 2× multiplier. Base damage = ${baseDamage}.\nCalculate the total damage dealt.`,
      answer: finalDamage,
    },
  ];

  const qTemplate = randItem(qTemplates);
  const wrongNums = wrongNumbers(qTemplate.answer, 3, Math.max(10, baseDamage));
  const choices = buildChoices(qTemplate.answer, wrongNums.map(String));

  return {
    type: 'battleStrategy',
    question: qTemplate.question,
    answer: String(qTemplate.answer),
    choices,
    hint: `Multiply ${baseDamage} × 2 for super effective!`,
    baseDamage,
    multiplier: pair.multiplier,
    finalDamage: qTemplate.answer,
    attackerType: pair.atkType,
    defenderType: pair.defType,
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
// 25. genCreativeWriting — Open-ended prompt (auto-accept 10+ chars)
// ---------------------------------------------------------------------------
function genCreativeWriting() {
  const pokemonNames = [
    'Pikachu', 'Charizard', 'Squirtle', 'Bulbasaur', 'Eevee',
    'Gengar', 'Snorlax', 'Meowth', 'Psyduck', 'Jigglypuff',
    'Abra', 'Machop', 'Geodude', 'Slowpoke', 'Magikarp',
    'Dragonite', 'Lapras', 'Ditto', 'Charmander', 'Clefairy',
    'Vulpix', 'Growlithe', 'Poliwag', 'Kadabra', 'Haunter',
    'Cubone', 'Chansey', 'Scyther', 'Magmar', 'Pinsir',
  ];

  const items = [
    'a glowing Poke Ball', 'a mysterious Potion', 'a hidden TM disk',
    'a rare fossil', 'a colorful ribbon', 'a golden coin',
    'a Pokedex entry for an unknown Pokemon', 'a sealed message in a bottle',
    'an old map', 'a shiny stone', 'a mysterious egg',
    'a key with strange markings', 'a glowing crystal',
    'a diary belonging to an ancient trainer', 'a badge from a forgotten Gym',
    'a feather that sparkles in the light', 'a Poke Ball that won\'t open',
    'a treasure chest half-buried in sand', 'a photograph of an unknown Pokemon',
    'a recipe for a special Pokemon treat', 'a compass that spins on its own',
    'an invitation to a secret tournament', 'a device that plays a strange melody',
    'a jar filled with rainbow-colored dust', 'a letter addressed to Professor Oak',
  ];

  const locations = [
    'a dark cave', 'Viridian Forest', 'the top of Mt. Moon',
    'a secret beach', 'the Pokemon Tower', 'an abandoned Gym',
    'a mysterious island', 'the middle of the ocean',
    'a snowy mountain peak', 'an old lighthouse',
    'a hidden valley', 'the bottom of a deep lake',
    'a field of flowers', 'an ancient ruin covered in vines',
    'a bustling city market', 'a quiet village at sunset',
    'a floating cloud island', 'a volcano crater',
    'a frozen waterfall', 'a bamboo forest',
    'a dusty library', 'the roof of a very tall tower',
    'a river that flows backward', 'a garden that glows at night',
    'a tunnel that echoes with strange sounds',
  ];

  const pokemon = randItem(pokemonNames);
  const item = randItem(items);
  const location = randItem(locations);

  return {
    type: 'creativeWriting',
    question: `Write a short adventure:\nYour ${pokemon} found ${item} in ${location}.\nWhat happened next? (Write at least 1 sentence!)`,
    answer: null,
    choices: [],
    inputType: 'text',
    minLength: 10,
    hint: 'Use your imagination — there are no wrong answers!',
    pokemon,
    item,
    location,
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
  const words1 = ['CAT', 'DOG', 'BUG', 'RAT', 'APE', 'BAT', 'FIN', 'GUM', 'HOP', 'JAM', 'LOG', 'MUD', 'NET', 'PIG', 'RUN'];
  const words2 = ['FIRE', 'BALL', 'LEAF', 'CAVE', 'POND', 'ROCK', 'WING', 'CLAW', 'FANG', 'NEST', 'VINE', 'DUST', 'WAVE', 'BOLT', 'ROAR'];
  const words3 = ['PICHU', 'FLAME', 'WATER', 'GRASS', 'NIGHT', 'STORM', 'BADGE', 'TOWER', 'DREAM', 'GHOST', 'POWER', 'STONE', 'TRAIL', 'BEACH', 'CLOUD'];
  const words4 = ['PIKACHU', 'MEOWTH', 'GENGAR', 'LAPRAS', 'VULPIX', 'MEWTWO', 'ABRA', 'DITTO', 'EEVEE', 'CUBONE', 'HYPNO', 'ONIX', 'SEEL', 'DODUO', 'KABUTO'];
  const words5 = ['CHARIZARD', 'BLASTOISE', 'VENUSAUR', 'DRAGONITE', 'SNORLAX', 'ALAKAZAM', 'ARCANINE', 'ELECTRODE', 'GYARADOS', 'MAGNEMITE', 'BUTTERFREE', 'NINETALES', 'RAPIDASH', 'TENTACOOL', 'SANDSLASH'];

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
// ACTIVITY REGISTRY
// =============================================================================

const ACTIVITY_REGISTRY = {
  soundSafari:       { name: 'Sound Safari',        icon: '🔊', levels: [1, 2],       skill: 'phonics',   generator: genSoundSafari },
  countingCatch:     { name: 'Counting Catch',      icon: '🔢', levels: [1, 2, 3],    skill: 'math',      generator: genCountingCatch },
  shapeSorting:      { name: 'Shape Sorting Lab',   icon: '🔷', levels: [1, 2],       skill: 'math',      generator: genShapeSorting },
  colorMatch:        { name: 'Color Match',         icon: '🎨', levels: [1, 2],       skill: 'reading',   generator: genColorMatch },
  patternPath:       { name: 'Pattern Path',        icon: '🧩', levels: [1, 2, 3],    skill: 'math',      generator: genPatternPath },
  blendAMon:         { name: 'Blend-a-Mon',         icon: '🗣️', levels: [2, 3],       skill: 'phonics',   generator: genBlendAMon },
  rhymeBattle:       { name: 'Rhyme Battle',        icon: '🎵', levels: [2, 3],       skill: 'reading',   generator: genRhymeBattle },
  pokedexSpeller:    { name: 'Pokédex Speller',     icon: '✏️', levels: [2, 3, 4],    skill: 'spelling',  generator: genPokedexSpeller },
  numberLineRace:    { name: 'Number Line Race',    icon: '📏', levels: [2, 3],       skill: 'math',      generator: genNumberLineRace },
  moreOrLess:        { name: 'More or Less',        icon: '⚖️', levels: [1, 2],       skill: 'math',      generator: genMoreOrLess },
  potionMixer:       { name: 'Potion Mixer',        icon: '🧪', levels: [3, 4],       skill: 'math',      generator: genPotionMixer },
  sightWordScramble: { name: 'Sight Word Scramble', icon: '🔤', levels: [3, 4],       skill: 'reading',   generator: genSightWordScramble },
  storySequence:     { name: 'Story Sequence',      icon: '📖', levels: [3, 4],       skill: 'reading',   generator: genStorySequence },
  coinCounter:       { name: 'Coin Counter',        icon: '🪙', levels: [3, 4, 5],    skill: 'math',      generator: genCoinCounter },
  missingNumber:     { name: 'Missing Number',      icon: '❓', levels: [2, 3, 4],    skill: 'math',      generator: genMissingNumber },
  typeAdvantageQuiz: { name: 'Type Advantage Quiz', icon: '⚔️', levels: [4, 5],       skill: 'strategy',  generator: genTypeAdvantageQuiz },
  habitatMatch:      { name: 'Habitat Match',       icon: '🌍', levels: [4, 5],       skill: 'science',   generator: genHabitatMatch },
  multiPowerup:      { name: 'Multiply Power-Up',   icon: '💪', levels: [4, 5],       skill: 'math',      generator: genMultiplicationPowerup },
  readingPassage:    { name: 'Reading Quest',       icon: '📚', levels: [4, 5],       skill: 'reading',   generator: genReadingPassageQuiz },
  estimationStation: { name: 'Estimation Station',  icon: '🎯', levels: [4, 5],       skill: 'math',      generator: genEstimationStation },
  breederFractions:  { name: 'Breeder Fractions',   icon: '🥚', levels: [5],          skill: 'math',      generator: genBreederFractions },
  geographyExplorer: { name: 'Geography Explorer',  icon: '🗺️', levels: [5],          skill: 'science',   generator: genGeographyExplorer },
  battleStrategy:    { name: 'Battle Strategy',     icon: '🧠', levels: [5],          skill: 'strategy',  generator: genBattleStrategy },
  scienceLab:        { name: 'Science Lab',         icon: '🔬', levels: [4, 5],       skill: 'science',   generator: genScienceLab },
  creativeWriting:   { name: 'Creative Writing',    icon: '✍️', levels: [5],          skill: 'writing',   generator: genCreativeWriting },
  codeBreaker:       { name: 'Code Breaker',        icon: '🔐', levels: [5],          skill: 'logic',     generator: genCodeBreaker },
};
