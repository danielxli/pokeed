# Cross-Cutting Systems Spec

Create `/home/user/workspace/pokemon-game/systems.js` — a single JS file with all cross-cutting game systems.

## Architecture Rules
- All functions are global (plain script tag, no modules)
- Systems interact with `State` object from game.js (which will be loaded before this file)
- Systems should be non-invasive — they hook into existing flows via event-like functions
- Reference existing functions: `notify()`, `SFX.*`, `launchConfetti()`, `addXp()`

## SYSTEMS TO IMPLEMENT

### 1. Dynamic Difficulty Adjustment
Track recent answer accuracy and adjust difficulty within the current level.

```js
// Add to State:
State.dda = { recent: [], adjustedDifficulty: 0 };

// DDA.recordAnswer(correct: boolean) — call after every challenge answer
// DDA.getAdjustedDifficulty() — returns -1, 0, or +1 to shift difficulty
// If last 5 answers are all correct → shift +1 (slightly harder questions)
// If last 5 answers have 3+ wrong → shift -1 (slightly easier)
// Otherwise → 0 (stay at current difficulty)
```

The adjusted difficulty is passed to generators: `effectiveDifficulty = State.settings.level + DDA.getAdjustedDifficulty()` (clamped 1-5).

### 2. Streak Bonuses
Track consecutive correct answers. At 5 correct in a row, trigger "Super Effective!" bonus.

```js
State.streak = { current: 0, best: 0 };

// Streaks.record(correct: boolean)
// If correct: increment current, check for milestones
// If wrong: reset current to 0
// At streak of 5: notify("🔥 Super Effective! 5 in a row! +25 bonus XP"), addXp(25), play special SFX
// At streak of 10: notify("⚡ UNSTOPPABLE! 10 in a row! +50 bonus XP"), addXp(50), launchConfetti()
// Update State.streak.best if current > best
```

### 3. Daily Challenge
One special challenge per day. Completing it awards a rare Pokemon encounter.

```js
State.dailyChallenge = { lastCompleted: null, completedToday: false };

// DailyChallenge.isAvailable() — true if not completed today (compare dates)
// DailyChallenge.generate() — returns a harder-than-normal challenge (difficulty +1)
// DailyChallenge.complete() — mark as done, award rare Pokemon
//   - Pick a random uncaught Pokemon, or if all caught, give 100 XP
//   - notify("🌟 Daily Challenge Complete! You found a rare [Pokemon]!")
//   - Store today's date in lastCompleted

// DailyChallenge.renderCard() — returns HTML string for a "Daily Challenge" card
//   Shows: ✨ Daily Challenge | "Complete for a rare Pokémon!" | Available/Completed status
//   This card will be shown on the map or in the Pokemon Lab
```

### 4. Pokemon Evolution Triggers
After answering X correct answers with a Pokemon as your "buddy", it evolves.

```js
State.evolution = { buddy: null, correctCount: 0 };

// EVOLUTION_CHAINS: Map of pokemon ID -> evolved form ID + required correct answers
// Only include Pokemon that actually evolve in Gen 1
// e.g., { 1: { evolvesTo: 2, required: 15 }, 2: { evolvesTo: 3, required: 30 }, ... }
// Include the major chains: Bulbasaur line, Charmander line, Squirtle line, Pikachu->Raichu,
//   Caterpie line, Weedle line, Pidgey line, Rattata->Raticate, Abra line, Machop line,
//   Geodude line, Gastly line, Eevee->Vaporeon/Jolteon/Flareon (random), Magikarp->Gyarados, Dratini line

// Evolution.setBuddy(pokemonId) — set the buddy Pokemon (from Pokedex)
// Evolution.recordCorrect() — increment count, check if evolution threshold reached
// Evolution.checkEvolution() — if ready, trigger evolution animation
//   - Show evolution screen: "What? [Pokemon] is evolving!"
//   - After 2 seconds: "Congratulations! Your [old] evolved into [new]!"
//   - Add new Pokemon to caught array if not already there
//   - Reset correctCount, update buddy to evolved form
//   - launchConfetti(), SFX.caught(), addXp(50)

// Evolution.renderBuddyCard() — returns HTML showing current buddy + progress bar
//   "Buddy: Charmander ████░░ 12/15 to evolve!"
```

### 5. Session Timer with Break Nudge
Track play time and nudge kids to take breaks after 15-20 minutes.

```js
State.sessionTimer = { startTime: null, totalMinutes: 0, breaksTaken: 0, nudgeShown: false };

// SessionTimer.start() — called when game starts (after title screen)
// SessionTimer.check() — called periodically (every scene transition)
//   - If 15+ minutes and no nudge shown: show gentle break reminder
//   - "🌟 Great job, Trainer! You've been playing for 15 minutes. Time for a quick break?"
//   - Show as an overlay with "Take a Break" and "Keep Playing" buttons
//   - "Take a Break" pauses timer, "Keep Playing" dismisses for another 15 min
//   - After break: "Welcome back, Trainer! Let's keep learning!"
// SessionTimer.getPlaytime() — returns minutes played (for display)
// SessionTimer.renderTimerUI() — returns small HTML element showing "⏱️ 12 min"
```

### 6. Collaborative Mode (Two Players)
Simple hot-seat two-player mode for activities.

```js
State.collab = { enabled: false, players: ['Player 1', 'Player 2'], currentPlayer: 0, scores: [0, 0] };

// Collab.enable(name1, name2) — enable 2-player mode
// Collab.disable() — back to single player  
// Collab.getCurrentPlayer() — returns current player name
// Collab.switchTurn() — alternate between players
// Collab.addPoint(playerIndex) — increment score
// Collab.renderScoreboard() — HTML showing both players + scores
//   "🧢 Ash: 5 ⭐  |  🧢 Misty: 3 ⭐"
// Collab.renderTurnIndicator() — "It's [Name]'s turn!"

// The collab toggle will be in Settings. When enabled, after each challenge answer,
// it switches to the other player's turn.
```

## Integration Points
These systems need to be called from game.js. Create a central hook function:

```js
// Called after every answer (correct or wrong) — hooks into all systems
function onAnswerResult(correct, context) {
  DDA.recordAnswer(correct);
  Streaks.record(correct);
  if (State.evolution.buddy) Evolution.recordCorrect();
  SessionTimer.check();
  if (State.collab.enabled) Collab.switchTurn();
}
```

Make sure all systems degrade gracefully — if State properties aren't set yet, initialize them with defaults.
