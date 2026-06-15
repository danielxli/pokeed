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
7. `js/rocket.js` — Team Rocket puzzles (pattern, word search, sentence, math)
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

## Pack Opener (`pack-opener/`)

A **separate app** (own scenes, state, styling) hosted at the same origin under
`/pack-opener/`. A card-pack-opening game: earn Poké Coins by answering quiz
questions, buy 1999-era booster packs, finger-tear them open, reveal cards, fill
a binder. It does **not** share runtime state with the main game. See
`pack-opener/README.md` for full detail. Key points when touching it:

- **Entry points:** the main map links to it via a "Card Shop" card
  (`a.loc-cards` → `/pack-opener/` in root `index.html`); the pack-opener links
  back via a 🏠 button. Uses absolute `/pack-opener/` paths.
- **Trailing-slash safety:** `pack-opener/index.html` sets
  `<base href="/pack-opener/">` so relative URLs resolve inside the folder even
  at `/pack-opener` (no slash). Without it, the deploy loads the main game's CSS.
- **Question reuse:** the coin quiz reuses the Training Grounds generators
  (`generateMathDrill` / `generateReadingDrill` from `js/training.js`) **verbatim**
  via a Web Worker (`pack-opener/js/quiz-worker.js`) that `importScripts` the main
  game's `js/data.js` + `js/training.js` with stubbed `Game`/`State`/`window`/
  `document`/`SFX`. The Worker isolates the page from any generator hang (600ms
  timeout → respawn). It deliberately does NOT reuse `renderChallengeHTML` /
  `answerChallenge` (too coupled).
- **Persistence:** own `localStorage` key `packrip.save.v1` (not `pokemon-edu-save`).

## Question generators: avoid infinite loops

Several challenge generators build distractors with `while (set.size < N) { …random… }`.
If the valid pool is smaller than N (e.g. `genMathQuestion` when the answer is 0,
`numberBond` with a tiny "whole"), these loops **never terminate** and freeze the
page. When adding/editing a distractor loop, cap it (`for (let g=0; cond && g<60; g++)`)
and provide a sequential fallback. Fixed instances live in `js/data.js`
(`genMathQuestion`) and `js/activities.js` (`numberBond`, `makeTen`, `barModel`,
`moreOrLess`, the spelling swap).

## Word/question pools

Reading activities are picture-matching, so words live as `{ word, emoji, level }`
in pools such as `WORD_PICTURE_POOL` (`js/training.js`, feeds Training Grounds **and**
the pack-opener quiz), `CVC_WORDS` (`js/data.js`), and per-activity banks in
`js/reading-activities*.js`. Adding picturable words means curating word+emoji
pairs; non-picturable sight words (Dolch/Fry) belong in text-only flash
activities, not the picture pools.

## Design Specs

The `docs/` folder contains design specifications (not deployed):
- `game-spec.md` — overall game design
- `architecture-context.md` — architecture notes for subagents
- `activities-spec.md` — activity design specs
- `systems-spec.md` — cross-cutting systems (DDA, streaks, evolution, etc.)
- `integration-spec.md` — integration between systems
