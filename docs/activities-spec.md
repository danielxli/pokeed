# New Activities Spec

Create `/home/user/workspace/pokemon-game/activities.js` — a single JS file with all new activity generators.

## Architecture Rules
- Each generator returns an object with: `{ type: string, question: string, answer: string, choices: string[], hint?: string, ... }`
- Activities used as encounter/gym challenges return the standard challenge format (question + answer + choices)
- Activities used as standalone mini-games return a richer object with HTML rendering
- All functions should be global (no modules — this is a plain script tag)
- Use Pokemon-themed content wherever possible
- Each generator takes `difficulty` param (1-5 mapping to Pre-K through 4th-5th)

## ACTIVITY GENERATORS TO IMPLEMENT

### Pre-K (Level 1) Activities
1. **genSoundSafari()** — Phoneme matching: "Which picture starts with the /b/ sound?" Show 4 emoji/image options. Use beginning sounds (b, c, d, f, g, h, etc.)
2. **genCountingCatch(difficulty)** — Show N Pokemon sprites (or emoji), ask "How many Pokemon?" with 4 number choices. Pre-K = 1-5, scales up.
3. **genShapeSorting()** — Show a shape (circle, square, triangle, star, heart, diamond) and ask to pick the matching one from 4 options. Use CSS-drawn shapes in the HTML.
4. **genColorMatch()** — "What color is [Pokemon type]?" e.g., "Fire types are usually..." with color word choices (red, blue, green, yellow).
5. **genPatternPath(difficulty)** — Show a pattern (🔴🔵🔴🔵?) and ask what comes next. Pre-K = 2-item patterns, scales up.

### Kindergarten (Level 2) Activities
6. **genBlendAMon()** — Syllable blending: "Put these sounds together: Pik-a-chu = ?" with 4 Pokemon name choices. Use real Pokemon names broken into syllables.
7. **genRhymeBattle()** — "Which word rhymes with 'ball'?" with 4 choices. Pokemon-themed where possible.
8. **genPokedexSpeller(difficulty)** — Spell simple words: show a picture/emoji, provide letter bank, spell the word. K = 3-letter words, scales up.
9. **genNumberLineRace(difficulty)** — "Which number comes between 3 and 5?" with choices. K = 1-10, scales up.
10. **genMoreOrLess(difficulty)** — "Which Pokemon has MORE? 🌟🌟🌟 or 🌟🌟🌟🌟🌟?" Compare quantities.

### 1st Grade (Level 3) Activities  
11. **genPotionMixer(difficulty)** — Word problems: "Professor Oak has 5 potions. He uses 2. How many left?" Multiple choice.
12. **genSightWordScramble(difficulty)** — Common sight words scrambled. "Unscramble: hte = ?" Answer: "the". Include hint.
13. **genStorySequence()** — Show 3-4 story panels (text descriptions) out of order. Pick the correct first/next event. Pokemon-themed mini-stories.
14. **genCoinCounter(difficulty)** — Show coin images/values, ask total. 1st = pennies+nickels, scales up to quarters/dollars.
15. **genMissingNumber(difficulty)** — "2, 4, __, 8" — fill in the missing number. Simple sequences.

### 2nd-3rd Grade (Level 4) Activities
16. **genTypeAdvantageQuiz()** — "Fire is super effective against ___?" with type choices. Uses real TYPE_CHART data.
17. **genHabitatMatch()** — "Which Pokemon would live in the ocean?" Match Pokemon to habitats (ocean, forest, cave, sky, city).
18. **genMultiplicationPowerup(difficulty)** — Multiplication facts: "6 × 7 = ?" with 4 choices. Themed as "Power Level" calculation.
19. **genReadingPassageQuiz(difficulty)** — Longer Pokemon-themed passage + 1 comprehension question. More complex than existing comprehension.
20. **genEstimationStation(difficulty)** — "About how many Zubat are in the cave?" Show a cluster, estimate the count. Within 20% = correct.

### 4th-5th Grade (Level 5) Activities
21. **genBreederFractions(difficulty)** — "1/4 of 24 Pikachu = ?" Fraction word problems with Pokemon context.
22. **genGeographyExplorer()** — "Which real-world region inspired the Kanto region?" (Answer: Kanto, Japan). Pokemon geography facts.
23. **genBattleStrategy(difficulty)** — Multi-step: "Your Charizard (Fire) faces Blastoise (Water). Water is super effective, dealing 2× damage. If Hydro Pump does 40 base damage, how much will it deal?" Combines type knowledge + math.
24. **genScienceLab()** — "Which state of matter is water at 0°C?" Simple science questions themed around Pokemon evolution/elements.
25. **genCreativeWriting()** — "Write a short adventure: Your [Pokemon] found a [item] in [location]. What happened next?" Open prompt with a "submit" button (auto-accepts any input 10+ chars).
26. **genCodeBreaker(difficulty)** — Caesar cipher / substitution puzzle: decode a Pokemon message. e.g., A=1, B=2... decode "16 9 11 1 3 8 21" = PIKACHU

## IMPORTANT: Also export a registry:

```js
const ACTIVITY_REGISTRY = {
  soundSafari:      { name: 'Sound Safari',       icon: '🔊', levels: [1,2],    skill: 'phonics',  generator: genSoundSafari },
  countingCatch:    { name: 'Counting Catch',     icon: '🔢', levels: [1,2,3],  skill: 'math',     generator: genCountingCatch },
  shapeSorting:     { name: 'Shape Sorting Lab',  icon: '🔷', levels: [1,2],    skill: 'math',     generator: genShapeSorting },
  colorMatch:       { name: 'Color Match',        icon: '🎨', levels: [1,2],    skill: 'reading',  generator: genColorMatch },
  patternPath:      { name: 'Pattern Path',       icon: '🧩', levels: [1,2,3],  skill: 'math',     generator: genPatternPath },
  blendAMon:        { name: 'Blend-a-Mon',        icon: '🗣️', levels: [2,3],    skill: 'phonics',  generator: genBlendAMon },
  rhymeBattle:      { name: 'Rhyme Battle',       icon: '🎵', levels: [2,3],    skill: 'reading',  generator: genRhymeBattle },
  pokedexSpeller:   { name: 'Pokédex Speller',    icon: '✏️', levels: [2,3,4],  skill: 'spelling', generator: genPokedexSpeller },
  numberLineRace:   { name: 'Number Line Race',   icon: '📏', levels: [2,3],    skill: 'math',     generator: genNumberLineRace },
  moreOrLess:       { name: 'More or Less',       icon: '⚖️', levels: [1,2],    skill: 'math',     generator: genMoreOrLess },
  potionMixer:      { name: 'Potion Mixer',       icon: '🧪', levels: [3,4],    skill: 'math',     generator: genPotionMixer },
  sightWordScramble:{ name: 'Sight Word Scramble',icon: '🔤', levels: [3,4],    skill: 'reading',  generator: genSightWordScramble },
  storySequence:    { name: 'Story Sequence',     icon: '📖', levels: [3,4],    skill: 'reading',  generator: genStorySequence },
  coinCounter:      { name: 'Coin Counter',       icon: '🪙', levels: [3,4,5],  skill: 'math',     generator: genCoinCounter },
  missingNumber:    { name: 'Missing Number',     icon: '❓', levels: [2,3,4],  skill: 'math',     generator: genMissingNumber },
  typeAdvantageQuiz:{ name: 'Type Advantage Quiz', icon:'⚔️', levels: [4,5],    skill: 'strategy', generator: genTypeAdvantageQuiz },
  habitatMatch:     { name: 'Habitat Match',      icon: '🌍', levels: [4,5],    skill: 'science',  generator: genHabitatMatch },
  multiPowerup:     { name: 'Multiply Power-Up',  icon: '💪', levels: [4,5],    skill: 'math',     generator: genMultiplicationPowerup },
  readingPassage:   { name: 'Reading Quest',      icon: '📚', levels: [4,5],    skill: 'reading',  generator: genReadingPassageQuiz },
  estimationStation:{ name: 'Estimation Station', icon: '🎯', levels: [4,5],    skill: 'math',     generator: genEstimationStation },
  breederFractions: { name: 'Breeder Fractions',  icon: '🥚', levels: [5],      skill: 'math',     generator: genBreederFractions },
  geographyExplorer:{ name: 'Geography Explorer', icon: '🗺️', levels: [5],      skill: 'science',  generator: genGeographyExplorer },
  battleStrategy:   { name: 'Battle Strategy',    icon: '🧠', levels: [5],      skill: 'strategy', generator: genBattleStrategy },
  scienceLab:       { name: 'Science Lab',        icon: '🔬', levels: [4,5],    skill: 'science',  generator: genScienceLab },
  creativeWriting:  { name: 'Creative Writing',   icon: '✍️', levels: [5],      skill: 'writing',  generator: genCreativeWriting },
  codeBreaker:      { name: 'Code Breaker',       icon: '🔐', levels: [5],      skill: 'logic',    generator: genCodeBreaker },
};
```

Each generator MUST return an object that at minimum has:
- `type`: string matching the key in ACTIVITY_REGISTRY
- `question`: the prompt text
- `answer`: the correct answer (string)
- `choices`: array of 4 strings (for multiple choice) — shuffle order
- Optional: `hint`, `passage`, `items` (for drag activities), `inputType` ('text' for free-form answers)

For creative writing, use `inputType: 'text'` and set answer to null (auto-accept 10+ chars).
For estimation, store `answer` as a number and `tolerance` as a percentage (0.2 = within 20%).

Keep all content arrays INSIDE each generator (don't create huge top-level constants). 
Each content pool should have at least 10-15 items so it doesn't feel repetitive.

The file should be well-organized with clear section headers.
