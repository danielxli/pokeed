# Architecture Context for Subagents

## Existing Architecture
- Single-page DOM app with scene transitions, all state in-memory (`State` object)
- Pokemon sprites from PokeAPI CDN: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png`
- 151 Gen 1 Pokemon in `POKEMON_DB` (each has: id, name, type, hp, atk, def, spd, clue2-4, color, moves array)
- 63 moves in `MOVES_DB`, 14-type TYPE_CHART
- 8 Gyms in `GYMS` array with leader portraits
- 5 difficulty levels in `LEVEL_DATA`
- Challenge types: math (`genMathQuestion`), cvc (`genCvcChallenge`), reading (`READING_QUESTIONS`), spelling (`SPELLING_WORDS`), comprehension (`READING_COMP_PASSAGES`)
- `getChallenge(type, difficulty)` dispatches to generators
- `getAvailableChallengeTypes()` filters by `State.settings.level`
- Font: Fredoka, Web Audio API for SFX via `SFX` object
- CSS vars: --pk-red, --pk-blue, --pk-yellow, --pk-dark, --pk-white, --pk-card, --pk-shadow, --pk-radius, --pk-radius-sm
- State.settings.level is 1-5 (Pre-K through 4th-5th Grade)

## Key Functions
- `showScene(id)` - switch scenes
- `notify(msg, type)` - show notification
- `addXp(amount)` - add XP with level-up check
- `SFX.correct()`, `SFX.wrong()`, `SFX.pop()`, `SFX.click()` etc.
- `launchConfetti()` - celebration effect
- `getTypeColor(type)` - returns hex color for type
- `getEffectiveness(attackType, defenderType)` - type chart lookup
- `renderChallengeHTML(challenge, context)` - renders challenge for encounters
- `answerChallenge(chosen, context)` - handles answer in encounter/gym
- `Game.goToMap()`, `Game.goToEncounter()`, `Game.goToGym()`, `Game.goToRocket()`, `Game.goToPokedex()`, `Game.goToGuide()`

## State Object
```js
State = {
  trainerName, level, xp, caught: [], badges: [],
  currentScene, settings: { level: 3 },
  encounter: { pokemon, cluesUnlocked, guessUsed, ballsLeft, pendingChallenge },
  gym: { selected, round, enemyHp, playerHp, pendingChallenge, ... },
  rocket: { puzzle, timer, timerInterval, wordSearchSelected, wordSearchFound, sentencePlaced, timedScore, timedTotal, timedCurrent, timedAnswered }
}
```

## Files
- `/home/user/workspace/pokemon-game/index.html` - Main HTML
- `/home/user/workspace/pokemon-game/style.css` - CSS (1397 lines)
- `/home/user/workspace/pokemon-game/game.js` - Game logic (3317 lines)
