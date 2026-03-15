// =============================================================================
// READING-ACTIVITIES-ADVANCED.JS — Advanced Reading Curriculum (Levels 3-5)
// Based on STELLAR, Logic of English, All About Reading, DISTAR, OG/Wilson
// Loaded after reading-activities.js — uses shuffleArray, randItem, randItems
// =============================================================================

// ---------------------------------------------------------------------------
// DATA POOLS
// ---------------------------------------------------------------------------

const PHONOGRAM_BANK = [
  { phonogram: 'EE', words: ['tree', 'feet', 'seed', 'deep', 'keen', 'beef', 'reef', 'peek'], distractors: ['treat', 'boat', 'rain'] },
  { phonogram: 'EA', words: ['beat', 'read', 'team', 'leaf', 'heat', 'meat', 'bean', 'seal'], distractors: ['feet', 'boat', 'coil'] },
  { phonogram: 'OA', words: ['boat', 'coat', 'goat', 'road', 'toad', 'soap', 'load', 'foam'], distractors: ['boot', 'rain', 'seed'] },
  { phonogram: 'AI', words: ['rain', 'tail', 'mail', 'paid', 'wait', 'sail', 'bait', 'gain'], distractors: ['boat', 'feet', 'coin'] },
  { phonogram: 'AY', words: ['day', 'play', 'stay', 'gray', 'tray', 'clay', 'pray', 'spray'], distractors: ['rain', 'boat', 'tree'] },
  { phonogram: 'OW', words: ['bow', 'cow', 'how', 'now', 'plow', 'town', 'down', 'brown'], distractors: ['boat', 'rain', 'feet'] },
  { phonogram: 'OU', words: ['out', 'loud', 'cloud', 'house', 'mouse', 'found', 'round', 'sound'], distractors: ['cow', 'boat', 'rain'] },
  { phonogram: 'OO', words: ['moon', 'food', 'cool', 'pool', 'roof', 'room', 'boot', 'spoon'], distractors: ['boat', 'coin', 'rain'] },
  { phonogram: 'AR', words: ['car', 'star', 'farm', 'park', 'dark', 'bark', 'hard', 'card'], distractors: ['her', 'bird', 'corn'] },
  { phonogram: 'OR', words: ['for', 'corn', 'fork', 'horn', 'torn', 'worn', 'cord', 'fort'], distractors: ['car', 'bird', 'fern'] },
  { phonogram: 'ER', words: ['her', 'fern', 'verb', 'term', 'herd', 'perch', 'clerk', 'stern'], distractors: ['car', 'corn', 'bird'] },
  { phonogram: 'IR', words: ['bird', 'girl', 'dirt', 'firm', 'stir', 'first', 'third', 'shirt'], distractors: ['car', 'corn', 'fern'] },
  { phonogram: 'IGH', words: ['high', 'light', 'night', 'right', 'sight', 'fight', 'might', 'tight'], distractors: ['kite', 'rain', 'tree'] },
  { phonogram: 'KN', words: ['knee', 'knit', 'knob', 'knot', 'know', 'knew', 'knife', 'knock'], distractors: ['nice', 'nest', 'name'] },
  { phonogram: 'WR', words: ['wrap', 'write', 'wrong', 'wren', 'wrist', 'wrote', 'wreck', 'wreath'], distractors: ['rain', 'rope', 'ring'] },
  { phonogram: 'SH', words: ['ship', 'shop', 'shed', 'shell', 'shark', 'sheep', 'shout', 'shine'], distractors: ['chip', 'that', 'when'] },
  { phonogram: 'TH', words: ['this', 'that', 'them', 'thin', 'thick', 'think', 'three', 'thumb'], distractors: ['ship', 'chip', 'when'] },
  { phonogram: 'CH', words: ['chip', 'chop', 'chat', 'chin', 'chest', 'check', 'chain', 'chair'], distractors: ['ship', 'that', 'when'] },
  { phonogram: 'OI', words: ['oil', 'coin', 'boil', 'coil', 'foil', 'join', 'moist', 'point'], distractors: ['cow', 'boat', 'rain'] },
  { phonogram: 'OY', words: ['boy', 'toy', 'joy', 'enjoy', 'royal', 'loyal', 'annoy', 'destroy'], distractors: ['coin', 'rain', 'boat'] },
];

const SYLLABLE_TYPE_WORDS = {
  'Closed': ['cat', 'bed', 'fish', 'jump', 'lunch', 'stamp', 'pocket', 'rabbit', 'basket', 'helmet', 'sunset', 'insect', 'dentist', 'napkin', 'pumpkin', 'cactus', 'fossil', 'magnet', 'kitten', 'mitten'],
  'Open': ['he', 'she', 'me', 'we', 'go', 'no', 'so', 'hi', 'baby', 'lady', 'pony', 'tiny', 'lazy', 'cozy', 'music', 'robot', 'tiger', 'spider', 'pilot', 'silent'],
  'Silent E': ['cake', 'bike', 'home', 'cute', 'lake', 'pine', 'rope', 'tube', 'flame', 'globe', 'smile', 'stone', 'whale', 'brave', 'grape', 'snake', 'prize', 'trade', 'skate', 'plane'],
  'R-Controlled': ['car', 'bird', 'corn', 'fern', 'turn', 'barn', 'dirt', 'fork', 'herb', 'surf', 'shark', 'skirt', 'storm', 'nurse', 'chart', 'pearl', 'sword', 'court', 'purse', 'worth'],
  'Vowel Team': ['rain', 'boat', 'feet', 'seed', 'moon', 'tail', 'road', 'cream', 'beach', 'float', 'snail', 'toast', 'fruit', 'braid', 'clean', 'coach', 'dream', 'feast', 'groan', 'stool'],
  'Consonant-LE': ['table', 'apple', 'little', 'middle', 'bottle', 'puddle', 'candle', 'gentle', 'puzzle', 'bubble', 'castle', 'circle', 'jungle', 'marble', 'noodle', 'simple', 'single', 'turtle', 'uncle', 'wobble'],
};

const SPELLING_RULES = [
  { rule: 'Silent E makes the vowel say its name', words: ['cake', 'bike', 'home', 'cute', 'lake', 'pine', 'rope', 'tube'], wrongRules: ['Double the consonant', 'Drop the E before -ing'] },
  { rule: 'CK comes after a short vowel', words: ['back', 'deck', 'kick', 'lock', 'duck', 'pack', 'pick', 'rock'], wrongRules: ['Silent E makes the vowel say its name', 'I before E except after C'] },
  { rule: 'When two vowels go walking, the first one does the talking', words: ['rain', 'boat', 'team', 'road', 'tail', 'beat', 'goat', 'sail'], wrongRules: ['Silent E makes the vowel say its name', 'CK comes after a short vowel'] },
  { rule: 'Q always needs U', words: ['queen', 'quiz', 'quick', 'quiet', 'quilt', 'quest', 'quote', 'squid'], wrongRules: ['Silent E makes the vowel say its name', 'I before E except after C'] },
  { rule: 'I before E except after C', words: ['piece', 'field', 'chief', 'brief', 'thief', 'shield', 'yield', 'shriek'], wrongRules: ['Q always needs U', 'Silent E makes the vowel say its name'] },
  { rule: 'Double the consonant to keep the vowel short', words: ['rabbit', 'kitten', 'mitten', 'butter', 'dinner', 'hammer', 'ladder', 'puppet'], wrongRules: ['Silent E makes the vowel say its name', 'CK comes after a short vowel'] },
  { rule: '-TCH comes after a short vowel', words: ['match', 'catch', 'watch', 'fetch', 'ditch', 'notch', 'hutch', 'sketch'], wrongRules: ['CK comes after a short vowel', 'Double the consonant'] },
  { rule: 'F, L, S are often doubled at the end of short words', words: ['off', 'puff', 'huff', 'bell', 'hill', 'doll', 'miss', 'boss'], wrongRules: ['Double the consonant to keep the vowel short', 'CK comes after a short vowel'] },
  { rule: 'K before I and E, C before A O U', words: ['kite', 'king', 'keep', 'key', 'kind', 'kitten', 'keen', 'kid'], wrongRules: ['CK comes after a short vowel', 'Q always needs U'] },
  { rule: 'GH is silent after a vowel', words: ['light', 'night', 'right', 'sight', 'fight', 'might', 'tight', 'high'], wrongRules: ['Silent E makes the vowel say its name', 'KN drops the K'] },
];

const SPEED_READ_WORDS = [
  { word: 'cake', emoji: '🎂', meaning: 'a sweet treat' },
  { word: 'bike', emoji: '🚲', meaning: 'ride on two wheels' },
  { word: 'rain', emoji: '🌧️', meaning: 'water from the sky' },
  { word: 'boat', emoji: '⛵', meaning: 'floats on water' },
  { word: 'tree', emoji: '🌳', meaning: 'tall with leaves' },
  { word: 'fish', emoji: '🐟', meaning: 'lives in water' },
  { word: 'moon', emoji: '🌙', meaning: 'shines at night' },
  { word: 'star', emoji: '⭐', meaning: 'twinkles in the sky' },
  { word: 'bird', emoji: '🐦', meaning: 'flies and sings' },
  { word: 'frog', emoji: '🐸', meaning: 'hops and ribbits' },
  { word: 'drum', emoji: '🥁', meaning: 'bang to make music' },
  { word: 'sheep', emoji: '🐑', meaning: 'gives us wool' },
  { word: 'snake', emoji: '🐍', meaning: 'slithers on the ground' },
  { word: 'clock', emoji: '🕐', meaning: 'tells the time' },
  { word: 'train', emoji: '🚂', meaning: 'rides on tracks' },
  { word: 'chair', emoji: '🪑', meaning: 'you sit on this' },
  { word: 'bread', emoji: '🍞', meaning: 'baked from flour' },
  { word: 'stone', emoji: '🪨', meaning: 'hard like a rock' },
  { word: 'flame', emoji: '🔥', meaning: 'part of a fire' },
  { word: 'cloud', emoji: '☁️', meaning: 'floats in the sky' },
  { word: 'shell', emoji: '🐚', meaning: 'found at the beach' },
  { word: 'teeth', emoji: '🦷', meaning: 'used for chewing' },
  { word: 'crown', emoji: '👑', meaning: 'worn by a king' },
  { word: 'plant', emoji: '🌱', meaning: 'grows in soil' },
  { word: 'snail', emoji: '🐌', meaning: 'moves very slowly' },
  { word: 'grape', emoji: '🍇', meaning: 'small round fruit' },
  { word: 'whale', emoji: '🐋', meaning: 'largest sea animal' },
  { word: 'slide', emoji: '🛝', meaning: 'play on at the park' },
  { word: 'house', emoji: '🏠', meaning: 'where you live' },
  { word: 'truck', emoji: '🚛', meaning: 'big vehicle for hauling' },
  { word: 'mouse', emoji: '🐭', meaning: 'small and squeaks' },
  { word: 'light', emoji: '💡', meaning: 'makes things bright' },
  { word: 'goat', emoji: '🐐', meaning: 'says baa on a farm' },
  { word: 'lamp', emoji: '🪔', meaning: 'gives off light' },
  { word: 'nest', emoji: '🪺', meaning: 'where birds lay eggs' },
  { word: 'bell', emoji: '🔔', meaning: 'rings and dings' },
  { word: 'fork', emoji: '🍴', meaning: 'used for eating' },
  { word: 'corn', emoji: '🌽', meaning: 'yellow veggie on a cob' },
  { word: 'bear', emoji: '🐻', meaning: 'big furry animal' },
  { word: 'leaf', emoji: '🍃', meaning: 'grows on a tree' },
];

const AFFIX_WORDS = [
  // Prefixes
  { word: 'unhappy', parts: ['un', 'happy'], affix: 'un-', affixType: 'prefix', meaning: 'not happy' },
  { word: 'redo', parts: ['re', 'do'], affix: 're-', affixType: 'prefix', meaning: 'do again' },
  { word: 'preview', parts: ['pre', 'view'], affix: 'pre-', affixType: 'prefix', meaning: 'before viewing' },
  { word: 'disagree', parts: ['dis', 'agree'], affix: 'dis-', affixType: 'prefix', meaning: 'not agree' },
  { word: 'miscount', parts: ['mis', 'count'], affix: 'mis-', affixType: 'prefix', meaning: 'count wrongly' },
  { word: 'unfair', parts: ['un', 'fair'], affix: 'un-', affixType: 'prefix', meaning: 'not fair' },
  { word: 'rewrite', parts: ['re', 'write'], affix: 're-', affixType: 'prefix', meaning: 'write again' },
  { word: 'unpack', parts: ['un', 'pack'], affix: 'un-', affixType: 'prefix', meaning: 'remove from packing' },
  { word: 'replay', parts: ['re', 'play'], affix: 're-', affixType: 'prefix', meaning: 'play again' },
  { word: 'dislike', parts: ['dis', 'like'], affix: 'dis-', affixType: 'prefix', meaning: 'not like' },
  { word: 'unlock', parts: ['un', 'lock'], affix: 'un-', affixType: 'prefix', meaning: 'open a lock' },
  { word: 'remake', parts: ['re', 'make'], affix: 're-', affixType: 'prefix', meaning: 'make again' },
  { word: 'unsafe', parts: ['un', 'safe'], affix: 'un-', affixType: 'prefix', meaning: 'not safe' },
  { word: 'misread', parts: ['mis', 'read'], affix: 'mis-', affixType: 'prefix', meaning: 'read wrongly' },
  { word: 'preschool', parts: ['pre', 'school'], affix: 'pre-', affixType: 'prefix', meaning: 'before school' },
  // Suffixes
  { word: 'careful', parts: ['care', 'ful'], affix: '-ful', affixType: 'suffix', meaning: 'full of care' },
  { word: 'hopeless', parts: ['hope', 'less'], affix: '-less', affixType: 'suffix', meaning: 'without hope' },
  { word: 'kindness', parts: ['kind', 'ness'], affix: '-ness', affixType: 'suffix', meaning: 'being kind' },
  { word: 'jumping', parts: ['jump', 'ing'], affix: '-ing', affixType: 'suffix', meaning: 'in the act of jumping' },
  { word: 'played', parts: ['play', 'ed'], affix: '-ed', affixType: 'suffix', meaning: 'past tense of play' },
  { word: 'teacher', parts: ['teach', 'er'], affix: '-er', affixType: 'suffix', meaning: 'one who teaches' },
  { word: 'helpful', parts: ['help', 'ful'], affix: '-ful', affixType: 'suffix', meaning: 'full of help' },
  { word: 'fearless', parts: ['fear', 'less'], affix: '-less', affixType: 'suffix', meaning: 'without fear' },
  { word: 'sadness', parts: ['sad', 'ness'], affix: '-ness', affixType: 'suffix', meaning: 'being sad' },
  { word: 'running', parts: ['run', 'ning'], affix: '-ing', affixType: 'suffix', meaning: 'in the act of running' },
  { word: 'walked', parts: ['walk', 'ed'], affix: '-ed', affixType: 'suffix', meaning: 'past tense of walk' },
  { word: 'swimmer', parts: ['swim', 'mer'], affix: '-er', affixType: 'suffix', meaning: 'one who swims' },
  { word: 'thankful', parts: ['thank', 'ful'], affix: '-ful', affixType: 'suffix', meaning: 'full of thanks' },
  { word: 'homeless', parts: ['home', 'less'], affix: '-less', affixType: 'suffix', meaning: 'without a home' },
  { word: 'darkness', parts: ['dark', 'ness'], affix: '-ness', affixType: 'suffix', meaning: 'being dark' },
  { word: 'painting', parts: ['paint', 'ing'], affix: '-ing', affixType: 'suffix', meaning: 'in the act of painting' },
  { word: 'opened', parts: ['open', 'ed'], affix: '-ed', affixType: 'suffix', meaning: 'past tense of open' },
  { word: 'singer', parts: ['sing', 'er'], affix: '-er', affixType: 'suffix', meaning: 'one who sings' },
  { word: 'powerful', parts: ['power', 'ful'], affix: '-ful', affixType: 'suffix', meaning: 'full of power' },
  { word: 'careless', parts: ['care', 'less'], affix: '-less', affixType: 'suffix', meaning: 'without care' },
];

const VOCAB_SENTENCES = [
  { sentence: 'The enormous Snorlax blocked the entire path.', target: 'enormous', answer: 'very big', choices: ['very big', 'very small', 'very fast', 'very quiet'] },
  { sentence: 'Pikachu felt exhausted after the long battle.', target: 'exhausted', answer: 'very tired', choices: ['very tired', 'very happy', 'very angry', 'very hungry'] },
  { sentence: 'The mysterious cave was hidden behind a waterfall.', target: 'mysterious', answer: 'strange and unknown', choices: ['strange and unknown', 'bright and sunny', 'small and cozy', 'loud and busy'] },
  { sentence: 'Charizard soared gracefully above the clouds.', target: 'gracefully', answer: 'smoothly and beautifully', choices: ['smoothly and beautifully', 'slowly and sadly', 'loudly and angrily', 'quickly and clumsily'] },
  { sentence: 'The trainer was determined to win the badge.', target: 'determined', answer: 'strongly decided', choices: ['strongly decided', 'very confused', 'slightly bored', 'quite nervous'] },
  { sentence: 'Bulbasaur absorbed sunlight through its bulb.', target: 'absorbed', answer: 'soaked up', choices: ['soaked up', 'threw out', 'looked at', 'ran from'] },
  { sentence: 'The fierce Gyarados roared and thrashed in the water.', target: 'fierce', answer: 'wild and aggressive', choices: ['wild and aggressive', 'calm and gentle', 'small and shy', 'slow and lazy'] },
  { sentence: 'Ash was astonished when his Pokemon evolved unexpectedly.', target: 'astonished', answer: 'very surprised', choices: ['very surprised', 'very angry', 'very bored', 'very sleepy'] },
  { sentence: 'The ancient fossil was buried deep underground.', target: 'ancient', answer: 'very old', choices: ['very old', 'very new', 'very shiny', 'very heavy'] },
  { sentence: 'Mewtwo has incredible psychic abilities.', target: 'incredible', answer: 'amazing', choices: ['amazing', 'terrible', 'ordinary', 'invisible'] },
  { sentence: 'The cautious trainer checked the map before entering the cave.', target: 'cautious', answer: 'careful', choices: ['careful', 'careless', 'excited', 'confused'] },
  { sentence: 'Eevee is a versatile Pokemon that can evolve many ways.', target: 'versatile', answer: 'able to do many things', choices: ['able to do many things', 'able to fly high', 'able to swim fast', 'able to hide well'] },
  { sentence: 'The abandoned power plant was dark and spooky.', target: 'abandoned', answer: 'left empty and unused', choices: ['left empty and unused', 'newly built', 'brightly lit', 'full of people'] },
  { sentence: 'Squirtle sprinted swiftly to dodge the attack.', target: 'swiftly', answer: 'very quickly', choices: ['very quickly', 'very slowly', 'very loudly', 'very carefully'] },
  { sentence: 'The rare Pokemon was elusive and hard to find.', target: 'elusive', answer: 'difficult to catch', choices: ['difficult to catch', 'easy to see', 'very friendly', 'extremely large'] },
  { sentence: 'Nurse Joy tended to the injured Pokemon with great compassion.', target: 'compassion', answer: 'kindness and care', choices: ['kindness and care', 'speed and skill', 'fear and worry', 'anger and frustration'] },
  { sentence: 'The persistent trainer kept trying despite many losses.', target: 'persistent', answer: 'never giving up', choices: ['never giving up', 'always losing', 'very lazy', 'easily scared'] },
  { sentence: 'Gengar lurked in the shadows, completely concealed.', target: 'concealed', answer: 'hidden from view', choices: ['hidden from view', 'standing in light', 'making noise', 'running fast'] },
  { sentence: 'The tranquil lake reflected the mountains like a mirror.', target: 'tranquil', answer: 'calm and peaceful', choices: ['calm and peaceful', 'rough and stormy', 'dirty and muddy', 'frozen and cold'] },
  { sentence: 'Machamp demonstrated tremendous strength in the battle.', target: 'tremendous', answer: 'extremely great', choices: ['extremely great', 'very small', 'quite ordinary', 'somewhat weak'] },
  { sentence: 'The peculiar Pokemon had never been seen before.', target: 'peculiar', answer: 'strange and unusual', choices: ['strange and unusual', 'common and boring', 'friendly and warm', 'small and round'] },
  { sentence: 'Professor Oak is a renowned Pokemon researcher.', target: 'renowned', answer: 'famous and respected', choices: ['famous and respected', 'unknown and new', 'strict and mean', 'young and learning'] },
  { sentence: 'The agile Scyther dodged every attack with ease.', target: 'agile', answer: 'quick and nimble', choices: ['quick and nimble', 'slow and heavy', 'large and strong', 'small and weak'] },
  { sentence: 'Pikachu reluctantly got into the Poke Ball.', target: 'reluctantly', answer: 'not wanting to', choices: ['not wanting to', 'happily', 'quickly', 'loudly'] },
  { sentence: 'The abundant berries grew on every bush in the forest.', target: 'abundant', answer: 'plentiful', choices: ['plentiful', 'rare', 'poisonous', 'tiny'] },
  { sentence: 'Ash felt jubilant after winning his eighth badge.', target: 'jubilant', answer: 'extremely joyful', choices: ['extremely joyful', 'slightly sad', 'very nervous', 'quite angry'] },
  { sentence: 'The fragile Pokemon egg needed careful handling.', target: 'fragile', answer: 'easily broken', choices: ['easily broken', 'very strong', 'extremely heavy', 'always moving'] },
  { sentence: 'Brock is a reliable friend who always helps in trouble.', target: 'reliable', answer: 'dependable and trustworthy', choices: ['dependable and trustworthy', 'unreliable and forgetful', 'funny and silly', 'quiet and shy'] },
  { sentence: 'The formidable Champion awaited challengers at the top.', target: 'formidable', answer: 'powerful and intimidating', choices: ['powerful and intimidating', 'weak and scared', 'friendly and kind', 'small and cute'] },
  { sentence: 'Ditto can mimic any Pokemon it sees perfectly.', target: 'mimic', answer: 'copy or imitate', choices: ['copy or imitate', 'attack or fight', 'run or hide', 'eat or sleep'] },
];

const L4_PASSAGES = [
  {
    title: 'Pikachu and the Storm',
    passage: 'One dark evening, a terrible storm swept through Pallet Town. Thunder boomed and lightning flashed across the sky. Pikachu was not scared at all. In fact, Pikachu loved storms! The lightning made Pikachu feel stronger. Pikachu ran outside and absorbed the electricity from the lightning bolts. By the time the storm ended, Pikachu was glowing with extra energy.',
    question: 'Why was Pikachu not afraid of the storm?',
    answer: 'The lightning made Pikachu feel stronger',
    others: ['Pikachu was sleeping through it', 'Ash was protecting Pikachu', 'The storm was very small']
  },
  {
    title: 'The Berry Farmer',
    passage: 'Old Mr. Ranger lived at the edge of the forest. Every morning, he planted and watered different types of berries. Oran Berries were blue and helped Pokemon recover health. Sitrus Berries were yellow and even more powerful. The rarest berry he grew was the Lum Berry, which could cure any status problem. Pokemon from all around visited his garden to eat.',
    question: 'What color are Oran Berries?',
    answer: 'blue',
    others: ['yellow', 'red', 'green']
  },
  {
    title: 'Gym Leader Misty',
    passage: 'Misty is the Gym Leader of Cerulean City. She specializes in Water-type Pokemon. Her strongest Pokemon is Starmie, which can spin rapidly and shoot water beams. To earn the Cascade Badge, trainers must defeat Misty in battle. Many trainers bring Grass or Electric-type Pokemon because those types are strong against Water types.',
    question: 'What types are strong against Misty\'s team?',
    answer: 'Grass and Electric',
    others: ['Fire and Rock', 'Water and Ice', 'Normal and Fighting']
  },
  {
    title: 'The Pokemon Daycare',
    passage: 'The Pokemon Daycare is a special place where trainers can leave their Pokemon to be cared for. The kind old couple who runs it feeds and exercises each Pokemon every day. Pokemon left at the daycare slowly gain experience and grow stronger over time. Some trainers even leave two Pokemon together, and sometimes they find a Pokemon Egg waiting for them!',
    question: 'What sometimes happens when two Pokemon are left together?',
    answer: 'A Pokemon Egg appears',
    others: ['They evolve together', 'They learn new moves', 'They run away']
  },
  {
    title: 'Magikarp\'s Secret',
    passage: 'Most trainers think Magikarp is completely useless. It can only splash around and flop on the ground. But experienced trainers know a secret: with enough patience and training, Magikarp evolves into Gyarados, one of the most powerful Water and Flying type Pokemon in the world. The key is to never give up, even when things seem hopeless.',
    question: 'What is the main lesson of this passage?',
    answer: 'Never give up, even when things seem hopeless',
    others: ['Magikarp is the best Pokemon', 'Water types are the strongest', 'Fishing is easy and fun']
  },
  {
    title: 'The Poke Mart',
    passage: 'Every town has a Poke Mart where trainers buy supplies. Poke Balls cost 200 Pokedollars each. Potions cost 300 Pokedollars and heal 20 HP. Super Potions are more expensive at 700 Pokedollars, but they heal 50 HP. Smart trainers save up for Super Potions because they get more healing for their money.',
    question: 'How much HP does a regular Potion heal?',
    answer: '20 HP',
    others: ['50 HP', '100 HP', '200 HP']
  },
  {
    title: 'Safari Zone',
    passage: 'The Safari Zone is a special park where rare Pokemon live. Instead of battling, trainers throw Safari Balls to catch Pokemon. Each visit costs 500 Pokedollars and gives the trainer 30 Safari Balls. Trainers can also throw bait to make Pokemon easier to catch, or rocks to make them stay still. But be careful with rocks — they can also scare Pokemon away!',
    question: 'What might happen if you throw rocks at Pokemon?',
    answer: 'They might run away',
    others: ['They evolve immediately', 'They become friendly', 'They fall asleep']
  },
  {
    title: 'Chansey\'s Eggs',
    passage: 'Chansey is known for carrying an egg in its pouch. This egg is very nutritious and can help sick Pokemon feel better. Chansey is incredibly kind and will share its egg with anyone who is hurt or unwell. That is why Chansey is the perfect helper for Nurse Joy at the Pokemon Center. Every Pokemon Center has at least one Chansey working alongside the nurse.',
    question: 'Why is Chansey a good helper at the Pokemon Center?',
    answer: 'Because it is kind and its eggs help sick Pokemon',
    others: ['Because it can fight well', 'Because it is very fast', 'Because it knows many moves']
  },
  {
    title: 'The SS Anne',
    passage: 'The SS Anne is a luxury cruise ship that docks in Vermilion City once a year. Trainers need a special ticket to board. Inside, there are many trainers to battle and items to find. The captain of the ship gets seasick, which is funny because he is a boat captain! If you help him by rubbing his back, he gives you the move HM01 Cut as a thank you.',
    question: 'What is unusual about the captain?',
    answer: 'He gets seasick even though he is a boat captain',
    others: ['He does not like Pokemon', 'He has never been on a ship', 'He gives away free Pokemon']
  },
  {
    title: 'Pokemon Types',
    passage: 'Every Pokemon has at least one type, and some have two types. The type determines what moves are strong or weak against it. For example, Water beats Fire, but Fire beats Grass, and Grass beats Water. This is called the type triangle. Understanding types is one of the most important skills for any trainer.',
    question: 'What beats Grass type?',
    answer: 'Fire',
    others: ['Water', 'Electric', 'Normal']
  },
];

const ROOT_WORDS = [
  { root: 'aqua', meaning: 'water', words: ['aquarium', 'aquatic', 'aqueduct'], distractors: ['airplane', 'automatic', 'adventure'] },
  { root: 'bio', meaning: 'life', words: ['biology', 'biography', 'biome'], distractors: ['bicycle', 'billion', 'bistro'] },
  { root: 'geo', meaning: 'earth', words: ['geography', 'geology', 'geometry'], distractors: ['generous', 'general', 'genius'] },
  { root: 'tele', meaning: 'far', words: ['telephone', 'television', 'telescope'], distractors: ['temple', 'tender', 'terrible'] },
  { root: 'port', meaning: 'carry', words: ['transport', 'portable', 'import'], distractors: ['portion', 'portrait', 'pottery'] },
  { root: 'rupt', meaning: 'break', words: ['erupt', 'interrupt', 'disrupt'], distractors: ['runway', 'rumble', 'rustic'] },
  { root: 'dict', meaning: 'say/speak', words: ['predict', 'dictionary', 'dictate'], distractors: ['different', 'difficult', 'discover'] },
  { root: 'struct', meaning: 'build', words: ['construct', 'structure', 'instruct'], distractors: ['struggle', 'stubborn', 'student'] },
  { root: 'vis/vid', meaning: 'see', words: ['visible', 'vision', 'video'], distractors: ['visit', 'village', 'vitamin'] },
  { root: 'aud', meaning: 'hear', words: ['audience', 'audio', 'auditorium'], distractors: ['autumn', 'author', 'August'] },
  { root: 'scrib/script', meaning: 'write', words: ['describe', 'manuscript', 'subscribe'], distractors: ['scramble', 'scratch', 'scooter'] },
  { root: 'cred', meaning: 'believe', words: ['credit', 'incredible', 'credential'], distractors: ['creature', 'creative', 'cricket'] },
  { root: 'duc/duct', meaning: 'lead', words: ['conduct', 'educate', 'produce'], distractors: ['during', 'dusty', 'durable'] },
  { root: 'graph', meaning: 'write/draw', words: ['paragraph', 'photograph', 'autograph'], distractors: ['grapefruit', 'grasshopper', 'grateful'] },
  { root: 'phon', meaning: 'sound', words: ['phonics', 'microphone', 'symphony'], distractors: ['phantom', 'pharmacy', 'physical'] },
  { root: 'therm', meaning: 'heat', words: ['thermometer', 'thermal', 'thermos'], distractors: ['therapy', 'therefore', 'thirteen'] },
  { root: 'chron', meaning: 'time', words: ['chronological', 'chronicle', 'chronic'], distractors: ['chocolate', 'champion', 'charming'] },
  { root: 'auto', meaning: 'self', words: ['automatic', 'automobile', 'autopilot'], distractors: ['autumn', 'authentic', 'authority'] },
  { root: 'micro', meaning: 'small', words: ['microscope', 'microphone', 'microchip'], distractors: ['migrate', 'million', 'mineral'] },
  { root: 'multi', meaning: 'many', words: ['multiply', 'multicolor', 'multimedia'], distractors: ['muscle', 'museum', 'mystery'] },
];

const INFERENCE_PASSAGES = [
  {
    passage: 'Ash looked out the window and frowned. The sky was dark gray and water was streaming down the glass. He put on his raincoat and grabbed an umbrella before heading to the Pokemon Gym.',
    question: 'What was the weather like?',
    answer: 'It was raining',
    others: ['It was sunny', 'It was snowing', 'It was windy but dry']
  },
  {
    passage: 'Pikachu\'s cheeks were sparking wildly. Its fur stood on end and its eyes narrowed as it stared at the Team Rocket balloon floating above. A low growl rumbled in its throat.',
    question: 'How was Pikachu feeling?',
    answer: 'Angry and ready to fight',
    others: ['Happy and excited', 'Tired and sleepy', 'Confused and lost']
  },
  {
    passage: 'After the battle, Charizard could barely stand. Its flame tail was much smaller than usual, barely a flicker. Ash quickly reached into his bag for the medicine.',
    question: 'What can you tell about Charizard\'s condition?',
    answer: 'It was very weak and needed healing',
    others: ['It was ready for another battle', 'It had just evolved', 'It was pretending to be hurt']
  },
  {
    passage: 'Misty clutched the fishing rod tightly, staring at the bobber. Suddenly, the bobber plunged beneath the surface and the rod bent almost in half. "This must be something huge!" she shouted.',
    question: 'What can you infer about what Misty caught?',
    answer: 'A very large Pokemon was on the line',
    others: ['She caught a tiny Magikarp', 'Her rod was broken', 'Nothing bit the hook']
  },
  {
    passage: 'The old man sat alone on the bench, feeding breadcrumbs to the Pidgey. He smiled as they ate, but his eyes looked sad. A faded photo of a young trainer and a Pidgeot was tucked in his coat pocket.',
    question: 'Why might the old man be sad?',
    answer: 'He probably misses a Pokemon or trainer from his past',
    others: ['He does not like Pidgey', 'He is hungry', 'He is lost in a new city']
  },
  {
    passage: 'Brock looked at the recipe book, then at the pile of berries. He carefully measured each ingredient and stirred the pot. All the Pokemon gathered around, sniffing the air with wide eyes.',
    question: 'Why did the Pokemon gather around?',
    answer: 'The food smelled delicious and they were hungry',
    others: ['They were scared of Brock', 'They wanted to read the book', 'They were cold and wanted warmth']
  },
  {
    passage: 'The cave was pitch black. Ash could hear water dripping somewhere far away. Every few seconds, he heard a soft fluttering sound above his head, and tiny red eyes blinked in the darkness.',
    question: 'What Pokemon was probably in the cave?',
    answer: 'Zubat, because they live in dark caves and fly',
    others: ['Pikachu, because of the glowing eyes', 'Magikarp, because of the water', 'Geodude, because caves have rocks']
  },
  {
    passage: 'Jessie and James whispered to each other behind a bush, drawing a diagram on a napkin. Meowth held a net and a cage. They all kept glancing toward the clearing where Pikachu was playing.',
    question: 'What were Team Rocket planning to do?',
    answer: 'Capture Pikachu',
    others: ['Have a picnic', 'Draw pictures of nature', 'Set up a Pokemon Center']
  },
  {
    passage: 'The trainer opened her Pokedex and it beeped loudly. "No data available," it said. She had never seen a Pokemon like this before — it was pink, tiny, and floated in the air with a playful expression.',
    question: 'What Pokemon did the trainer probably see?',
    answer: 'Mew, because it is rare, pink, and floats',
    others: ['Jigglypuff, because it is common', 'Clefairy, because it walks', 'Ditto, because it transforms']
  },
  {
    passage: 'Professor Oak\'s lab was in chaos. Papers were scattered everywhere, equipment was knocked over, and muddy footprints led from the window to the shelf where the Poke Balls used to be.',
    question: 'What probably happened at the lab?',
    answer: 'Someone broke in and stole the Poke Balls',
    others: ['Professor Oak was cleaning', 'A party was happening', 'The Pokemon were exercising']
  },
  {
    passage: 'Every time Jigglypuff picked up its microphone, the crowd started backing away nervously. Some people put cotton in their ears, and others ducked behind benches. Jigglypuff looked confused by their reaction.',
    question: 'Why were people backing away?',
    answer: 'They knew Jigglypuff\'s song would make them fall asleep',
    others: ['They didn\'t like music', 'The microphone was broken', 'They were playing a game']
  },
  {
    passage: 'The young trainer stared at the three Poke Balls on the table. One was marked with a flame symbol, one with a water droplet, and one with a leaf. She thought about it for a long time. Finally, she reached for the one with the leaf.',
    question: 'Which starter Pokemon did the trainer choose?',
    answer: 'Bulbasaur (the Grass type)',
    others: ['Charmander (the Fire type)', 'Squirtle (the Water type)', 'Pikachu (the Electric type)']
  },
];

const MAIN_IDEA_PASSAGES = [
  {
    passage: 'Pokemon types are very important in battles. Water beats Fire, Fire beats Grass, and Grass beats Water. Electric moves are strong against Water and Flying types. Knowing type matchups helps trainers choose the right Pokemon for each battle.',
    question: 'What is the main idea?',
    answer: 'Understanding type matchups is key to winning battles',
    others: ['Water is the best type', 'All Pokemon are the same in battle', 'Fire types always lose']
  },
  {
    passage: 'Nurse Joy works hard every day at the Pokemon Center. She heals injured Pokemon, gives them medicine, and makes sure they rest. Without Nurse Joy, trainers would have a very difficult time keeping their Pokemon healthy during their journey.',
    question: 'What is the main idea?',
    answer: 'Nurse Joy plays a vital role in keeping Pokemon healthy',
    others: ['Nurse Joy likes to rest', 'Pokemon never get hurt', 'Medicine is expensive']
  },
  {
    passage: 'Evolution is one of the most amazing things about Pokemon. When a Pokemon evolves, it changes form and usually becomes stronger. Some Pokemon evolve by gaining experience in battle, while others need special stones or items. A few Pokemon even evolve through friendship with their trainer!',
    question: 'What is the main idea?',
    answer: 'Pokemon can evolve in different ways to become stronger',
    others: ['All Pokemon evolve at level 20', 'Evolution makes Pokemon weaker', 'Only Fire types can evolve']
  },
  {
    passage: 'The Safari Zone is home to Pokemon you cannot find anywhere else. Trainers pay an entrance fee and receive special Safari Balls. Instead of battling wild Pokemon, trainers must use bait and rocks to improve their chances of catching them. It requires a completely different strategy than normal Pokemon catching.',
    question: 'What is the main idea?',
    answer: 'The Safari Zone requires different catching strategies than normal',
    others: ['The Safari Zone is free to enter', 'You battle Pokemon in the Safari Zone', 'Safari Balls work the same as Poke Balls']
  },
  {
    passage: 'Breeding Pokemon at the daycare can produce eggs with special moves that the baby Pokemon wouldn\'t normally learn. This is called egg moves. Experienced trainers carefully choose which Pokemon to breed together to create the strongest possible team. It takes a lot of planning and knowledge.',
    question: 'What is the main idea?',
    answer: 'Strategic Pokemon breeding creates stronger teams',
    others: ['All Pokemon eggs are the same', 'Breeding is simple and quick', 'Daycare Pokemon always run away']
  },
  {
    passage: 'Ash learned an important lesson during his first gym battle. He sent Pikachu against Brock\'s Onix, but Electric moves had no effect on Ground-type Pokemon. After losing badly, Ash studied type matchups and came back with a new strategy. He learned that preparation is just as important as battling skill.',
    question: 'What is the main idea?',
    answer: 'Preparation and knowledge are as important as battling skill',
    others: ['Pikachu can beat any Pokemon', 'Electric beats Rock', 'Ash never lost a battle']
  },
  {
    passage: 'The Pokemon League tournament is the ultimate test for any trainer. To qualify, trainers must collect eight gym badges from different cities. Then they must win several rounds of battles against other qualified trainers. Only the best of the best can become the Pokemon Champion.',
    question: 'What is the main idea?',
    answer: 'Becoming Pokemon Champion requires great skill and effort',
    others: ['Anyone can easily become Champion', 'You only need one badge', 'The tournament is just for fun']
  },
  {
    passage: 'Team Rocket may seem like bumbling villains, but they actually have a large criminal organization. They steal Pokemon, conduct illegal experiments, and try to control legendary Pokemon for profit. Their leader Giovanni is a powerful trainer who also runs the Viridian City Gym in secret.',
    question: 'What is the main idea?',
    answer: 'Team Rocket is a serious criminal organization despite appearing foolish',
    others: ['Team Rocket always succeeds', 'Giovanni is a good person', 'Team Rocket only wants friends']
  },
];

const ADVANCED_VOCAB = [
  { sentence: 'The Pokemon\'s nocturnal habits meant it was only active after dark.', target: 'nocturnal', answer: 'active at night', choices: ['active at night', 'active in daytime', 'always sleeping', 'always hungry'] },
  { sentence: 'The symbiotic relationship between Slowpoke and Shellder benefits both Pokemon.', target: 'symbiotic', answer: 'helping each other', choices: ['helping each other', 'fighting each other', 'ignoring each other', 'competing with each other'] },
  { sentence: 'Mewtwo\'s origin was shrouded in controversy because it was artificially created.', target: 'controversy', answer: 'disagreement and debate', choices: ['disagreement and debate', 'happiness and celebration', 'silence and peace', 'confusion and sleep'] },
  { sentence: 'The Pokemon demonstrated remarkable resilience, recovering quickly from its injuries.', target: 'resilience', answer: 'ability to bounce back', choices: ['ability to bounce back', 'ability to fly', 'tendency to sleep', 'desire to eat'] },
  { sentence: 'The habitat of Diglett was predominantly underground tunnels.', target: 'predominantly', answer: 'mostly or mainly', choices: ['mostly or mainly', 'never or rarely', 'sometimes or occasionally', 'loudly or noisily'] },
  { sentence: 'Professor Oak hypothesized that Pokemon evolved to adapt to their environments.', target: 'hypothesized', answer: 'suggested a theory', choices: ['suggested a theory', 'proved with evidence', 'denied completely', 'forgot about'] },
  { sentence: 'The volatile Electrode could explode without warning.', target: 'volatile', answer: 'unstable and unpredictable', choices: ['unstable and unpredictable', 'calm and steady', 'slow and gentle', 'friendly and warm'] },
  { sentence: 'Ditto possesses the unique capability to replicate any Pokemon it sees.', target: 'replicate', answer: 'make an exact copy', choices: ['make an exact copy', 'run away from', 'eat quickly', 'forget completely'] },
  { sentence: 'The indigenous Pokemon of the island had never been seen on the mainland.', target: 'indigenous', answer: 'native to that place', choices: ['native to that place', 'visiting from far away', 'recently arrived', 'very old'] },
  { sentence: 'The trainer\'s strategy was meticulous, planning every move three turns ahead.', target: 'meticulous', answer: 'extremely careful and detailed', choices: ['extremely careful and detailed', 'random and careless', 'fast and sloppy', 'lazy and simple'] },
  { sentence: 'Lapras was once hunted to near extinction before conservation efforts saved it.', target: 'extinction', answer: 'dying out completely', choices: ['dying out completely', 'becoming very strong', 'learning new moves', 'moving to a new area'] },
  { sentence: 'The unprecedented discovery of a new Pokemon type shocked researchers worldwide.', target: 'unprecedented', answer: 'never happened before', choices: ['never happened before', 'very common', 'expected and planned', 'boring and ordinary'] },
];


// ---------------------------------------------------------------------------
// LEVEL 3 — 1st Grade Activities
// ---------------------------------------------------------------------------

/**
 * Logic of English phonogram identification.
 * Shows a word with its phonogram blanked out — student picks the right
 * letter combo to complete the word.
 */
function genPhonogramMatch(difficulty) {
  var entry = randItem(PHONOGRAM_BANK);
  var word = randItem(entry.words);
  var phonogramLower = entry.phonogram.toLowerCase();

  // Find where the phonogram sits in the word and blank it out
  var idx = word.toLowerCase().indexOf(phonogramLower);
  var blanked = word.substring(0, idx) + '___' + word.substring(idx + phonogramLower.length);

  // Build a set of all known words for collision checking
  var allWords = {};
  PHONOGRAM_BANK.forEach(function (e) {
    e.words.forEach(function (w) { allWords[w.toLowerCase()] = true; });
  });

  // Build distractor phonograms, excluding any that would form a real word
  var prefix = word.substring(0, idx).toLowerCase();
  var suffix = word.substring(idx + phonogramLower.length).toLowerCase();
  var otherPhonograms = PHONOGRAM_BANK
    .filter(function (e) {
      if (e.phonogram === entry.phonogram) return false;
      // Reject if inserting this phonogram creates a known word
      var formed = prefix + e.phonogram.toLowerCase() + suffix;
      return !allWords[formed];
    })
    .map(function (e) { return e.phonogram; });
  var distractors = randItems(otherPhonograms, 3);

  var choices = shuffleArray([entry.phonogram].concat(distractors));

  return {
    type: 'phonogramMatch',
    question: blanked,
    answer: entry.phonogram,
    word: word,
    choices: choices,
    hint: 'Fill in the missing letters!'
  };
}

/**
 * Wilson/OG syllable type identification.
 * Show a word, student picks which syllable type it is.
 */
function genSyllableSort(difficulty) {
  const allTypes = Object.keys(SYLLABLE_TYPE_WORDS);
  // At difficulty 3, only use first 3 types; at 4+, use all 6
  const availableTypes = difficulty >= 4
    ? allTypes
    : ['Closed', 'Open', 'Silent E'];

  const correctType = randItem(availableTypes);
  const word = randItem(SYLLABLE_TYPE_WORDS[correctType]);

  // Build choices: correct type + other types (3 or 4 total depending on difficulty)
  const wrongTypes = availableTypes.filter(t => t !== correctType);
  const numChoices = difficulty >= 4 ? 4 : 3;
  const selectedWrong = randItems(shuffleArray(wrongTypes), numChoices - 1);
  const choices = shuffleArray([correctType, ...selectedWrong]);

  return {
    type: 'syllableSort',
    question: word,
    answer: correctType,
    choices: choices,
    hint: 'What type of syllable is this?'
  };
}

/**
 * Logic of English spelling rules quiz.
 * Show a word, ask which spelling rule applies.
 */
function genSpellingRulesQuiz(difficulty) {
  const entry = randItem(SPELLING_RULES);
  const word = randItem(entry.words);

  // Collect the entry's wrong rules
  const wrongFromEntry = entry.wrongRules.slice();

  // Find one more random wrong rule from other entries
  const otherRules = SPELLING_RULES
    .filter(e => e.rule !== entry.rule)
    .map(e => e.rule);
  const extraWrong = randItem(
    otherRules.filter(r => !wrongFromEntry.includes(r))
  );

  const distractors = [...wrongFromEntry];
  if (extraWrong) distractors.push(extraWrong);

  // Take up to 3 distractors for 4 total choices
  const selectedDistractors = randItems(shuffleArray(distractors), 3);
  const choices = shuffleArray([entry.rule, ...selectedDistractors]);

  return {
    type: 'spellingRulesQuiz',
    question: word,
    answer: entry.rule,
    choices: choices,
    hint: 'Why is this word spelled this way?'
  };
}

/**
 * Fluency timed word reading.
 * Show a decodable word, student picks the matching emoji.
 */
function genSpeedRead(difficulty) {
  const entry = randItem(SPEED_READ_WORDS);

  // Pick 3 distractor emojis from other entries
  const otherEntries = SPEED_READ_WORDS.filter(e => e.word !== entry.word);
  const distractorEntries = randItems(shuffleArray(otherEntries), 3);
  const distractorEmojis = distractorEntries.map(e => e.emoji);

  const choices = shuffleArray([entry.emoji, ...distractorEmojis]);

  return {
    type: 'speedRead',
    question: entry.word,
    answer: entry.emoji,
    choices: choices,
    word: entry.word,
    hint: 'Read the word and pick the picture!'
  };
}


// ---------------------------------------------------------------------------
// LEVEL 4 — 2nd-3rd Grade Activities
// ---------------------------------------------------------------------------

/**
 * Prefix/suffix identification.
 * Show a word with an affix, student identifies which affix it contains.
 */
function genWordSurgeon(difficulty) {
  const entry = randItem(AFFIX_WORDS);

  // Collect all unique affixes from pool for distractors
  const allAffixes = [...new Set(AFFIX_WORDS.map(e => e.affix))];
  const wrongAffixes = allAffixes.filter(a => a !== entry.affix);
  const selectedWrong = randItems(shuffleArray(wrongAffixes), 3);
  const choices = shuffleArray([entry.affix, ...selectedWrong]);

  return {
    type: 'wordSurgeon',
    question: entry.word,
    answer: entry.affix,
    choices: choices,
    parts: entry.parts,
    affixType: entry.affixType,
    meaning: entry.meaning,
    hint: 'Find the part added to the root word!'
  };
}

/**
 * Context clues vocabulary (Pokemon-themed).
 * Show a sentence with a target word, student picks the meaning.
 */
function genVocabularyDetective(difficulty) {
  const entry = randItem(VOCAB_SENTENCES);
  const choices = shuffleArray([...entry.choices]);

  return {
    type: 'vocabularyDetective',
    question: entry.sentence,
    answer: entry.answer,
    choices: choices,
    target: entry.target,
    hint: 'Use the sentence to figure out the meaning!'
  };
}

/**
 * Level 4 reading passage comprehension (literal).
 * Read a passage, answer a comprehension question.
 */
function genPassageQuestL4(difficulty) {
  const entry = randItem(L4_PASSAGES);
  const choices = shuffleArray([entry.answer, ...entry.others]);

  return {
    type: 'readingPassage',
    title: entry.title,
    passage: entry.passage,
    question: entry.question,
    answer: entry.answer,
    choices: choices,
    hint: 'Read the passage carefully!'
  };
}


// ---------------------------------------------------------------------------
// LEVEL 5 — 4th-5th Grade Activities
// ---------------------------------------------------------------------------

/**
 * Latin/Greek root identification.
 * Show a root with its meaning, student picks a word that uses it.
 */
function genRootWordExplorer(difficulty) {
  const entry = randItem(ROOT_WORDS);
  const correctWord = randItem(entry.words);

  // Build distractors: from the entry's own distractors + other roots' distractors
  const otherEntries = ROOT_WORDS.filter(e => e.root !== entry.root);
  const allDistractorPool = [
    ...entry.distractors,
    ...otherEntries.flatMap(e => e.distractors)
  ];
  // Remove duplicates and pick 3
  const uniqueDistractors = [...new Set(allDistractorPool)];
  const selectedDistractors = randItems(shuffleArray(uniqueDistractors), 3);
  const choices = shuffleArray([correctWord, ...selectedDistractors]);

  return {
    type: 'rootWordExplorer',
    question: entry.root,
    answer: correctWord,
    choices: choices,
    rootMeaning: entry.meaning,
    hint: 'This root means "' + entry.meaning + '". Which word uses it?'
  };
}

/**
 * Inference-based comprehension.
 * Read a passage, answer a question that requires inference.
 */
function genInferenceLab(difficulty) {
  const entry = randItem(INFERENCE_PASSAGES);
  const choices = shuffleArray([entry.answer, ...entry.others]);

  return {
    type: 'inferenceLab',
    passage: entry.passage,
    question: entry.question,
    answer: entry.answer,
    choices: choices,
    hint: 'Think about what the passage suggests, not just what it says!'
  };
}

/**
 * Main idea identification.
 * Read a passage, pick the best main idea.
 */
function genMainIdeaMatcher(difficulty) {
  const entry = randItem(MAIN_IDEA_PASSAGES);
  const choices = shuffleArray([entry.answer, ...entry.others]);

  return {
    type: 'mainIdeaMatcher',
    passage: entry.passage,
    question: entry.question,
    answer: entry.answer,
    choices: choices,
    hint: 'What is this passage mostly about?'
  };
}

/**
 * Advanced vocabulary from context.
 * Same format as vocabularyDetective but with harder vocabulary.
 */
function genVocabInContext(difficulty) {
  const entry = randItem(ADVANCED_VOCAB);
  const choices = shuffleArray([...entry.choices]);

  return {
    type: 'vocabInContext',
    question: entry.sentence,
    answer: entry.answer,
    choices: choices,
    target: entry.target,
    hint: 'Use clues in the sentence to figure out the meaning!'
  };
}

// =============================================================================
// REGISTER L3-L5 READING ACTIVITIES
// =============================================================================
if (typeof ACTIVITY_REGISTRY !== 'undefined') {
  Object.assign(ACTIVITY_REGISTRY, {
    // L3 — 1st Grade
    phonogramMatch:      { name: 'Phonogram Match',      icon: '🔠', levels: [3],       skill: 'phonics',        generator: genPhonogramMatch },
    syllableSort:        { name: 'Syllable Sort',        icon: '📐', levels: [3, 4],    skill: 'reading',        generator: genSyllableSort },
    spellingRulesQuiz:   { name: 'Spelling Rules',       icon: '📏', levels: [3, 4],    skill: 'spelling',       generator: genSpellingRulesQuiz },
    speedRead:           { name: 'Speed Read',           icon: '⏱️', levels: [3],       skill: 'reading',        generator: genSpeedRead },
    // L4 — 2nd-3rd Grade
    wordSurgeon:         { name: 'Word Surgeon',         icon: '🔬', levels: [4],       skill: 'reading',        generator: genWordSurgeon },
    vocabularyDetective: { name: 'Vocabulary Detective',  icon: '🔍', levels: [4],       skill: 'reading',        generator: genVocabularyDetective },
    passageQuestL4:      { name: 'Reading Quest',        icon: '📚', levels: [4],       skill: 'comprehension',  generator: genPassageQuestL4 },
    // L5 — 4th-5th Grade
    rootWordExplorer:    { name: 'Root Explorer',        icon: '🌳', levels: [5],       skill: 'reading',        generator: genRootWordExplorer },
    inferenceLab:        { name: 'Inference Lab',        icon: '🧠', levels: [5],       skill: 'comprehension',  generator: genInferenceLab },
    mainIdeaMatcher:     { name: 'Main Idea Matcher',    icon: '🎯', levels: [5],       skill: 'comprehension',  generator: genMainIdeaMatcher },
    vocabInContext:      { name: 'Vocab in Context',     icon: '📖', levels: [5],       skill: 'reading',        generator: genVocabInContext },
  });
}
