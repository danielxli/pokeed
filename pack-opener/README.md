# Pack Rip! — Pokémon Card Pack Opener

A standalone, kid-friendly card-pack-opening game that lives alongside the main
Pokémon Educational Adventure. Players earn **Poké Coins** by answering math and
reading questions, spend them on real 1999-era booster packs, rip the foil open
with a finger-traced tear, reveal the cards (with holo effects), and fill a
collection binder.

It is a **separate app** from the main game — its own scenes, state, and styling
— but is **hosted at the same origin** (`/pack-opener/`) so the two can link to
each other. There is no shared runtime state.

## Running

No build step. Serve the repo root with any static server and open
`/pack-opener/`:

```bash
python3 -m http.server 8000     # then visit http://localhost:8000/pack-opener/
```

Open `/` for the main game; the main game's map has a **Card Shop** card that
links here, and this app has a 🏠 button (bottom-left) that links back to `/`.

> **Trailing slash matters.** `index.html` sets `<base href="/pack-opener/">` so
> every relative URL (CSS, JS, the Web Worker, images) resolves inside this
> folder whether or not the address has a trailing slash. Without it, visiting
> `/pack-opener` (no slash) on hosts that don't auto-redirect (e.g. Vercel)
> resolves `css/style.css` against the site root and loads the **main game's**
> stylesheet instead. If this app ever moves, update that one `<base>` value.

## Files

```
pack-opener/
├── index.html          # All scenes + modals; sets <base href="/pack-opener/">
├── css/style.css       # Dark "midnight card-shop" theme (self-contained)
├── data/cards.js       # window.CARD_SETS — 228 cards (Base/Jungle/Fossil)
├── js/
│   ├── audio.js        # Sound — synthesized Web Audio SFX (own object, not the
│   │                   #   main game's SFX): rip, tear, flip, holo, fanfare…
│   ├── packs.js        # Card sets, rarity tiers, odds modes, generatePack()
│   ├── main.js         # App flow, persistence, economy, quiz controller
│   └── quiz-worker.js  # Web Worker that reuses the main game's drill generators
└── assets/
    ├── cardback.jpg            # Official English card back
    └── pack-<set>-<art>.webp   # 9 booster packshots (3 sets × 3 cover arts)
```

### Load order (`index.html`)
`data/cards.js` → `js/audio.js` → `js/packs.js` → `js/main.js`.
`quiz-worker.js` is **not** a `<script>` — it's instantiated with `new Worker()`.

## Card data

`data/cards.js` defines `window.CARD_SETS` keyed by set id (`base1` Base Set,
`base2` Jungle, `base3` Fossil), each `{ id, name, total, cards: [...] }`. Each
card is `{ id, name, num, rarity, type, supertype, img, imgHi }`. The data was
fetched once from the [pokemontcg.io](https://pokemontcg.io) API and bundled
locally so openings never stall on a live API; only the **card images** load
from the pokemontcg.io CDN at runtime (card faces) — card backs and pack art are
local in `assets/`.

To refresh or add sets, re-run a fetch against the pokemontcg.io `/cards`
endpoint (`select=id,name,number,rarity,types,supertype,images`), sort by
`number`, default Energy cards' empty rarity to `Common`, and write
`window.CARD_SETS = {…};` to `data/cards.js`.

## Pack opening flow

`shop → (buy) → tear → reveal → summary → binder`

- **Shop** (`renderShop`) — a shelf per set, each showing its 3 cover-art packs
  on a wooden ledge with a Poké Coin price badge. Clicking a pack runs
  `buyAndOpen()`.
- **Tear** (`initTear` / `tearPolys` / `applyTear`) — a real finger-traced rip:
  the pack photo is drawn twice (body + flap) and clipped along the **path the
  pointer actually travels**, so the foil splits exactly where you drag. Release
  early and it heals shut; drag ~90% across and the flap flies off.
- **Reveal** (`showPile` / `revealCard`) — tap to flip each card. Commons pop,
  rares chime, holos get a suspense rumble + screen flash + rainbow-foil overlay
  (pointer-tilt tracked). The rare slot is always last.
- **Summary / Binder** — new cards get a NEW! badge; the binder
  (`renderBinder`) shows per-set completion, duplicates, holo highlights, and a
  tap-to-zoom hi-res view.

### Rarity & odds (`packs.js`)
`tierOf()` maps each card to `common / uncommon / rare / holo / energy`.
`generatePack(setId, mode, packsSinceHolo)` builds a pack from per-tier pools
(no dupes within a pack), reveal-ordered with the holo always last. Three odds
modes (chosen in Settings): **Lucky** (`generous`), **Luck Meter** (`pity` —
guarantees a holo every 5 packs via a visible pip meter), **Classic 1999**
(`realistic` — true 11-card packs, ~1-in-3 holo).

## Economy

Players hold **Poké Coins** (`Store.coins`). Packs cost coins
(`SET_META[setId].price` — Base 30, Jungle/Fossil 25); `buyAndOpen()` deducts or
nudges to the quiz if short. A correct quiz answer is **+1**, a wrong answer
**−1**, floored at 0 (`addCoins` clamps with `Math.max(0, …)`). New players start
with `STARTER_COINS` (30). The coin total is shown with a CSS-drawn gold coin
that ticks up/down and flips on change (`updateCoins` / `animateCount`).

## Earning coins: reused Training Grounds questions

The quiz reuses the **main game's Training Grounds drill generators verbatim** —
it does not reimplement questions. `quiz-worker.js` is a Web Worker that:

1. Stubs `Game`, `State`, `window`, `document`, `SFX` (so the game files load
   without a DOM or the rest of the game).
2. `importScripts('../../js/data.js', '../../js/training.js')` from the main
   game (same origin).
3. On each request, calls `generateMathDrill(level)` or
   `generateReadingDrill(level)` (50/50) — exactly the two generators the
   Training Grounds uses — and returns a `{ question, answer, choices }` object.

**Why a Worker:** some of the borrowed generators have unbounded
distinct-choice loops that can spin on unlucky RNG. Running them off the main
thread means a hang can't freeze the page — `Quiz.ask()` times out after 600ms,
terminates and respawns the worker, and retries (`Quiz.next` falls back to a
safe local question if all else fails). The underlying loops were also capped at
the source (see the main repo's `js/data.js` / `js/activities.js`), so hangs
shouldn't occur in practice; the Worker is the safety net.

The question **grade level (1–5)** is `Store.settings.grade`, set only in the
Settings panel (`buildGradeOpts`). `main.js`'s `QuizUI` renders the question and
grades the answer with a simple string compare (the main game's
`renderChallengeHTML`/`answerChallenge` are intentionally **not** reused — they're
too coupled to the game's State/DOM).

> **Coupling note:** the Worker depends on `js/training.js` loading with only a
> `Game` stub. If the main game adds new top-level dependencies to `training.js`,
> add matching stubs in `quiz-worker.js`.

## Persistence

All state is one `Store` object saved to `localStorage` under
`packrip.save.v1` (separate from the main game's `pokemon-edu-save`):
`{ collection: {cardId: count}, coins, packsOpened, holosPulled, sincePity,
settings: { odds, sound, grade } }`. Pre-economy saves are migrated (coins
default to the starter amount) on load.

## Styling

`css/style.css` is self-contained (dark indigo theme, gold accents, Lilita
One + Fredoka). It is **not** the main game's stylesheet and shares no class
names with it. Reduced-motion users get near-instant animations via a
`prefers-reduced-motion` block.
