# Pokemon Educational Adventure

A Pokemon-themed educational game for kids featuring wild encounters, gym battles, Team Rocket puzzles, a Pokedex, and a Trainer's Guide. All 151 Gen 1 Pokemon included.

## Project Structure

```
pokemon-game/
├── index.html              # Single-page app entry point
├── css/
│   └── style.css           # All styles (organized by section)
├── js/
│   ├── audio.js            # Web Audio API sound effects
│   ├── data.js             # Pokemon DB (151), moves, type chart, gyms, questions
│   ├── engine.js           # Game state, scene management, XP, confetti, UI
│   ├── encounter.js        # Wild encounters, clues, challenges, letter tiles, pokeball throw
│   ├── pokedex.js          # Pokedex viewer, Pokemon Lab hub, activity sessions
│   ├── battle.js           # Gym battles, turn-based combat, type effectiveness
│   ├── rocket.js           # Team Rocket puzzles (pattern, word search, sentence, timed math)
│   ├── guide.js            # Trainer's Guide (in-game help and reference)
│   ├── settings.js         # Level selection, settings panel, initialization
│   ├── activities.js       # 26 educational activity generators + ACTIVITY_REGISTRY
│   └── systems.js          # Cross-cutting: DDA, streaks, daily challenge, evolution, timer, collab
├── assets/                 # Pixel art backgrounds, gym leader & Team Rocket portraits
│   ├── title-bg.png
│   ├── grass-bg.png
│   ├── battle-bg.png
│   ├── team-rocket-bg.png
│   ├── loc-*.png           # Map location cards
│   ├── leader-*.png        # 8 gym leader portraits
│   └── rocket-*.png        # Team Rocket portraits
└── docs/                   # Design specs and architecture notes (not deployed)
    ├── game-spec.md
    ├── architecture-context.md
    ├── activities-spec.md
    ├── systems-spec.md
    └── integration-spec.md
```

## Script Load Order

Scripts must load in this order (each depends on globals from previous):

1. **audio.js** — `SFX` object, `getAudio()`, `playTone()`
2. **data.js** — `TYPE_CHART`, `MOVES_DB`, `POKEMON_DB`, `GYMS`, questions/words
3. **engine.js** — `State`, `Game` object, `showScene()`, `notify()`, `addXp()`
4. **encounter.js** — `Game.goToEncounter()`, clue/challenge rendering, pokeball throw
5. **pokedex.js** — `Game.goToPokedex()`, `Game.goToLab()`, activity sessions
6. **battle.js** — `Game.goToGym()`, battle system, damage calc
7. **rocket.js** — `Game.goToRocket()`, puzzle types
8. **guide.js** — `Game.goToGuide()`, guide renderer
9. **settings.js** — `Game.openSettings()`, `LEVEL_DATA`, init
10. **activities.js** — `ACTIVITY_REGISTRY`, 26 generator functions
11. **systems.js** — `DDA`, `StreakTracker`, `DailyChallenge`, `Evolution`, `SessionTimer`, `Collab`

## Key Architecture

- **Single-page DOM app** — all scenes are `<div class="scene">` toggled via `showScene(id)`
- **Global state** — `State` object holds current scene, encounter data, caught pokemon, gym progress
- **`Game` namespace** — all scene transitions and actions are methods on the global `Game` object
- **151 Pokemon** — full Gen 1 database with types, stats, moves, and clues
- **14 types + effectiveness chart** — real Pokemon type matchups for gym battles
- **5 difficulty levels** — Pre-K through 4th grade, controlling question complexity
- **Sprites** — loaded from PokeAPI CDN, rendered with `image-rendering: pixelated`
- **No build step** — pure HTML/CSS/JS, deploy by copying files to any static host

## External Dependencies

- [Fredoka](https://fonts.google.com/specimen/Fredoka) font (Google Fonts)
- [PokeAPI Sprites](https://github.com/PokeAPI/sprites) (CDN for Pokemon images)
