# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pokemon Educational Adventure — a Pokemon-themed educational game for kids (Pre-K through 5th grade) with wild encounters, gym battles, Team Rocket puzzles, a Pokedex, and 39 learning activities. Covers all 151 Gen 1 Pokemon.

## Development

**No build step.** Pure HTML/CSS/JS — open `index.html` in a browser or serve with any static file server:
```bash
python3 -m http.server 8000
# or
npx serve .
```

**No tests, no linter, no package manager.** Changes are verified by opening in a browser.

## Architecture

**Single-page DOM app.** All scenes are `<div class="scene">` elements in `index.html`, toggled via `showScene(id)`. All state lives in the global `State` object. All game actions are methods on the global `Game` object.

### Script Load Order (dependencies flow downward)

Scripts are loaded via `<script>` tags in `index.html` and **must** be in this order — each file depends on globals from previous files:

1. `js/audio.js` — `SFX` object, Web Audio API sound effects
2. `js/data.js` — `TYPE_CHART`, `MOVES_DB`, `POKEMON_DB` (151 entries), `GYMS`, question generators
3. `js/engine.js` — `State`, `Game` object, `showScene()`, `notify()`, `addXp()`, confetti
4. `js/encounter.js` — Wild encounter flow, clues, challenges, pokeball throw mini-game
5. `js/pokedex.js` — Pokedex viewer, Pokemon Lab hub, activity sessions
6. `js/battle.js` — Gym battles, turn-based combat, type effectiveness damage calc
7. `js/rocket.js` — Team Rocket puzzles (pattern, word search, sentence, timed math)
8. `js/guide.js` — Trainer's Guide renderer
9. `js/pokecenter.js` — Pokemon Center (healing, word search)
10. `js/training.js` — Training Grounds, flash drill system, `EVOLUTION_MAP`, Pokemon evolution
11. `js/settings.js` — `LEVEL_DATA` (5 difficulty levels), settings panel, game init
12. `js/activities.js` — `ACTIVITY_REGISTRY`, math/science/logic activity generators, plus kept reading activities (Story Sequence, Pokédex Speller)
13. `js/reading-activities.js` — New reading curriculum L1-L2: Sound Spotter, Rhyme Catcher, Letter Sound Safari, First Sound Match, Word Builder, Consonant Teams, Vowel Sound Sort, Blend & Read, Sight Word Flash
14. `js/reading-activities-advanced.js` — New reading curriculum L3-L5: Phonogram Match, Syllable Sort, Spelling Rules, Speed Read, Word Surgeon, Vocabulary Detective, Reading Quest L4, Root Explorer, Inference Lab, Main Idea Matcher, Vocab in Context
15. `js/systems.js` — `DDA`, `StreakTracker`, `DailyChallenge`, `Evolution`, `SessionTimer`, `Collab`

### Key Globals

- **`State`** — all game state: trainer info, caught pokemon, badges, encounter/gym/rocket state, system sub-states (dda, streak, evolution, etc.)
- **`Game`** — namespace for all scene transitions and user actions (`Game.goToMap()`, `Game.goToEncounter()`, `Game.goToGym()`, etc.)
- **`POKEMON_DB`** — array of 151 Pokemon objects (id, name, type, hp, atk, def, spd, clues, color, moves)
- **`TYPE_CHART`** — 14-type effectiveness matrix
- **`LEVEL_DATA`** — 5 difficulty levels controlling question complexity; `State.settings.level` is 1-5

### Challenge System

- `getChallenge(type, difficulty)` dispatches to generators: math, CVC, reading, spelling, comprehension
- `getAvailableChallengeTypes()` filters challenge types by current difficulty level
- `renderChallengeHTML(challenge, context)` / `answerChallenge(chosen, context)` — shared across encounters and gym battles
- Reading challenges now come from the structured reading curriculum in `reading-activities.js` and `reading-activities-advanced.js`, not the old flat pools. The old 'reading', 'spelling', 'comprehension' types are kept as dormant fallbacks.
- Based on STELLAR, Logic of English, All About Reading, DISTAR, and Orton-Gillingham/Wilson programs — systematic phonics progression from phonemic awareness through comprehension.

### External Dependencies

- **Fredoka font** via Google Fonts CDN
- **Pokemon sprites** from PokeAPI CDN: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png`
- **Pixel art assets** in `assets/` — backgrounds, gym leader & Team Rocket portraits, badge icons

### CSS

Single file `css/style.css`. Uses CSS custom properties: `--pk-red`, `--pk-blue`, `--pk-yellow`, `--pk-dark`, `--pk-white`, `--pk-card`, `--pk-shadow`, `--pk-radius`, `--pk-radius-sm`.

## Design Specs

The `docs/` folder contains design specifications (not deployed):
- `game-spec.md` — overall game design
- `architecture-context.md` — architecture notes for subagents
- `activities-spec.md` — activity design specs
- `systems-spec.md` — cross-cutting systems (DDA, streaks, evolution, etc.)
- `integration-spec.md` — integration between systems
