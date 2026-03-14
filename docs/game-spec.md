# Pokemon Educational Adventure - Game Spec

## Overview
A Pokemon-themed educational game for kids (ages 5-10). DOM-based UI with CSS animations (no Canvas needed). All game state is in-memory.

## Core Game Loop

### 1. TOWN MAP (Main Hub)
The main screen shows a stylized Pokemon town map with 4 clickable locations:
- **Tall Grass** → Pokemon Encounter (guess & catch)
- **Pokemon Gym** → Gym Battle (earn badges)
- **Team Rocket Hideout** → Fight Team Rocket
- **Pokemon Lab** → View Pokedex

Stats bar at top: Trainer name, badges earned (8 slots), caught Pokemon count, current level

### 2. POKEMON ENCOUNTER (Tall Grass)
**Flow:**
1. "A wild Pokemon appeared!" screen with animated grass
2. Show 5 clue slots (locked). First clue is always the Pokemon's TYPE
3. To unlock each clue, solve a math or reading challenge
4. After each clue, player can GUESS the Pokemon (text input with autocomplete from a list)
5. Clue 5 is always the SILHOUETTE (black shape of the Pokemon drawn via CSS/SVG)
6. Correct guess → Pokeball throw mini-game
7. Wrong guess → "That's not right! Try getting more clues!"

**The 5 Clues (in order):**
1. Type (e.g., "This Pokemon is a FIRE type!")
2. Habitat/behavior (e.g., "It lives in volcanoes and breathes fire")
3. Physical description (e.g., "It has a flame on the tip of its tail")
4. A fun fact (e.g., "When this Pokemon is angry, the flame on its tail burns brighter")
5. Silhouette (black shadow outline of the Pokemon)

**Educational Challenges to unlock clues:**
- **Math:** Addition, subtraction, multiplication (age-appropriate). Show a problem like "12 + 7 = ?" with 4 multiple choice answers
- **Reading:** Show a short sentence with a missing word. "The cat ___ on the mat." (sat, bat, ran, pet). Or "Which word rhymes with 'ball'?" (tall, run, big, cat)
- Alternate between math and reading

### 3. POKEBALL THROW (Mini-game)
After correctly guessing:
1. Pokemon appears in the center of screen
2. Pokeball at bottom of screen
3. Player drags/swipes pokeball upward toward the Pokemon (like Pokemon GO)
4. Physics: ball arcs toward Pokemon
5. If aim is good enough (within target zone), ball hits Pokemon → catch animation
6. Ball wiggles 1-2-3 times, then either:
   - CATCH! (confetti, Pokemon added to Pokedex) - ~60% chance on good throw
   - Escaped! (Pokemon breaks free) - try again
7. Player gets 3 pokeballs total. If all 3 miss/fail, Pokemon runs away

**Implementation:** Use CSS transforms and transitions for the throw animation. The "throw" is a click-and-drag gesture that determines accuracy.

### 4. POKEDEX
- Grid of all available Pokemon (show caught ones in color, uncaught as dark silhouettes)
- Click a caught Pokemon to see its stats, type, and fun facts
- Show completion percentage
- Pokemon have: name, type, HP, attack, defense, speed (for battles)

### 5. GYM BATTLES
8 gyms, each themed by type (like the original games):
- **Boulder Badge** (Rock) - Brock
- **Cascade Badge** (Water) - Misty
- **Thunder Badge** (Electric) - Lt. Surge
- **Rainbow Badge** (Grass) - Erika
- **Soul Badge** (Poison) - Koga
- **Marsh Badge** (Psychic) - Sabrina
- **Volcano Badge** (Fire) - Blaine
- **Earth Badge** (Ground) - Giovanni

**Gym Battle Flow:**
1. Choose gym → Meet gym leader (with dialogue)
2. Educational challenge rounds (3-5 rounds depending on gym)
3. Gym battles use HARDER educational challenges:
   - Spelling challenges: Unscramble letters to spell a word
   - Math: Word problems, multiplication, division
   - Reading comprehension: Read a short paragraph, answer a question
4. Each correct answer = your Pokemon attacks (animated HP bar decreases on enemy)
5. Each wrong answer = gym leader's Pokemon attacks you
6. Win all rounds → earn badge + celebration animation
7. Badges are displayed on the trainer card

### 6. TEAM ROCKET ENCOUNTERS
**"Team Rocket is stealing Pokemon! Stop them!"**

**Flow:**
1. Dramatic entrance (Jessie & James-style dialogue)
2. Educational puzzle to "hack their computer" or "unlock the cage"
3. Puzzle types:
   - **Pattern recognition:** What comes next? 2, 4, 6, 8, __
   - **Word search:** Find 5 hidden words in a grid
   - **Sentence ordering:** Put these words in the right order to make a sentence
   - **Quick math:** Solve 5 problems in 60 seconds (timed challenge)
4. Success → Free the stolen Pokemon (bonus: catch a rare Pokemon)
5. Failure → Team Rocket escapes (can retry)

## Pokemon Database (30 Pokemon)
Use Gen 1 Pokemon with recognizable silhouettes:
Bulbasaur, Charmander, Squirtle, Pikachu, Jigglypuff, Meowth, Psyduck, Growlithe, Machop, Geodude, Eevee, Snorlax, Magikarp, Gengar, Onix, Vulpix, Abra, Gastly, Dratini, Lapras, Cubone, Horsea, Staryu, Oddish, Caterpie, Pidgey, Rattata, Zubat, Diglett, Poliwag

Each Pokemon needs: name, type, hp, attack, defense, speed, 4 clues (type is auto-generated), silhouette SVG path data, color

## Visual Design
- **Bright, colorful, playful** - Pokemon anime aesthetic
- **Large text and buttons** - kid-friendly touch targets
- **Generated backgrounds:** Use the 4 background images in ./assets/
  - title-bg.png for town map
  - grass-bg.png for Pokemon encounters
  - battle-bg.png for gym battles
  - team-rocket-bg.png for Team Rocket
- **Pokemon sprites:** Use the PokeAPI sprites: https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png
  - IDs: bulbasaur=1, charmander=4, squirtle=7, pikachu=25, jigglypuff=39, meowth=52, psyduck=54, growlithe=58, machop=66, geodude=74, eevee=133, snorlax=143, magikarp=129, gengar=94, onix=95, vulpix=37, abra=63, gastly=92, dratini=147, lapras=131, cubone=104, horsea=116, staryu=120, oddish=43, caterpie=10, pidgey=16, rattata=19, zubat=41, diglett=50, poliwag=60
- **Silhouettes:** Apply CSS filter: brightness(0) to the sprite image
- **Pokeball:** Draw with CSS (red top, white bottom, black line, center button)
- **Type badges:** Colored pills (Fire=red, Water=blue, Grass=green, Electric=yellow, etc.)
- **Font:** Use a bold, rounded font like 'Nunito' or 'Fredoka' from Google Fonts

## Sound Effects (Procedural Web Audio API)
- Correct answer: ascending 3-note chime
- Wrong answer: descending buzz
- Pokeball throw: whoosh sound
- Pokeball wiggle: click-click-click
- Pokemon caught: triumphant fanfare
- Gym badge earned: longer victory jingle
- Team Rocket appear: dramatic sting
- Button clicks: soft pop

## Technical Notes
- Single index.html file with embedded CSS and JS (or split into 2-3 files max)
- All Pokemon sprites loaded from PokeAPI GitHub CDN (these are <img> elements, so they work in sandbox)
- In-memory state only (no localStorage)
- Mobile-responsive with large touch targets
- Preload sprites on start screen
