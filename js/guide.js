// ===== TRAINER'S GUIDE =====
// In-game help and educational reference guide
// ===== TRAINER'S GUIDE =====
Game.goToGuide = function() {
  SFX.pop();
  renderGuide();
  showScene('guide');
};

function renderGuide() {
  const container = document.getElementById('guide-scroll');
  if (!container) return;

  const skillColors = {
    math: '#E53935',
    reading: '#1565C0',
    spelling: '#7B1FA2',
    cvc: '#F57C00',
    comprehension: '#00897B',
    pattern: '#5C6BC0',
    wordsearch: '#00ACC1',
    sentence: '#8E24AA',
    timedmath: '#D32F2F',
    battle: '#C62828',
    catching: '#2E7D32',
    phonics: '#E91E63',
    science: '#00897B',
    strategy: '#FF6B35',
    writing: '#6A1B9A',
    logic: '#3F51B5',
  };

  function tag(name, key) {
    return `<span class="guide-skill-tag" style="background:${skillColors[key] || '#757575'}">${name}</span>`;
  }

  let html = '';

  // ===== SECTION 1: GAME ACTIVITIES =====
  html += `
  <div class="guide-section open">
    <div class="guide-section-header" style="background:linear-gradient(135deg,#1565C0,#0D47A1)" onclick="toggleGuideSection(this)">
      🎮 Game Activities
      <span class="guide-chevron">▲</span>
    </div>
    <div class="guide-section-body">

      <div class="guide-activity" style="border-color:#4CAF50">
        <div class="guide-activity-title">🌿 Tall Grass — Wild Pokémon Encounters</div>
        <div class="guide-activity-desc">
          Explore the tall grass to discover wild Pokémon! You'll get 5 clues to guess who it is, but each clue is locked behind an educational challenge.
        </div>
        <div class="guide-activity-detail">
          <strong>How it works:</strong><br>
          • Clue 1 reveals the Pokémon's type, Clue 5 reveals its silhouette<br>
          • Solve a ${tag('Math','math')} ${tag('Reading','reading')} ${tag('CVC Words','cvc')} or ${tag('Spelling','spelling')} challenge to unlock each clue<br>
          • Guess the Pokémon's name at any time<br>
          • Once guessed, throw Pokéballs to catch it (3 tries, Pokémon GO style!)<br>
          • Caught Pokémon go in your Pokédex and can be used in gym battles
        </div>
      </div>

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">🏆 Pokémon Gym — Gym Leader Battles</div>
        <div class="guide-activity-desc">
          Challenge 8 gym leaders in turn-based battles with real type advantages! Each attack requires solving a challenge.
        </div>
        <div class="guide-activity-detail">
          <strong>How it works:</strong><br>
          • Pick a Pokémon from your collection to battle with<br>
          • Choose attack moves — each requires a ${tag('Math','math')} ${tag('Reading','reading')} or ${tag('Comprehension','comprehension')} challenge<br>
          • Correct answers deal damage; wrong answers let the gym leader attack you<br>
          • Type advantages matter (Fire > Grass > Water > Fire, etc.)<br>
          • Gym difficulty increases — later gyms boost question difficulty above your level<br>
          • Beat all 8 gyms to earn every badge!<br><br>
          <strong>Gym Leaders:</strong> Brock (Rock) → Misty (Water) → Lt. Surge (Electric) → Erika (Grass) → Koga (Poison) → Sabrina (Psychic) → Blaine (Fire) → Giovanni (Ground)
        </div>
      </div>

      <div class="guide-activity" style="border-color:#7B2D8E">
        <div class="guide-activity-title">🚀 Team Rocket Hideout — Puzzle Challenges</div>
        <div class="guide-activity-desc">
          Stop Jessie & James by solving one of four random puzzle types!
        </div>
        <div class="guide-activity-detail">
          <strong>Puzzle types:</strong><br>
          • ${tag('Pattern Recognition','pattern')} — Find the next number in a sequence (e.g. 2, 4, 6, 8, ?)<br>
          • ${tag('Word Search','wordsearch')} — Find hidden Pokémon-themed words in a letter grid<br>
          • ${tag('Sentence Ordering','sentence')} — Drag words into the correct order to form a sentence<br>
          • ${tag('Quick Math','timedmath')} — Solve as many math problems as you can before time runs out!
        </div>
      </div>

      <div class="guide-activity" style="border-color:#1565C0">
        <div class="guide-activity-title">📖 Pokémon Lab — Pokédex</div>
        <div class="guide-activity-desc">
          View all 151 original Pokémon! Caught Pokémon show their sprite, stats, type, and fun facts. Uncaught ones appear as silhouettes.
        </div>
      </div>

      <div class="guide-activity" style="border-color:#E91E63">
        <div class="guide-activity-title">🏥 Pokémon Center — Heal Your Team</div>
        <div class="guide-activity-desc">
          Your Pokémon get hurt during gym battles. Visit the Pokémon Center to heal them back to full health!
        </div>
        <div class="guide-activity-detail">
          <strong>How it works:</strong><br>
          • After gym battles, your Pokémon's HP carries over — they remember their injuries<br>
          • Fainted Pokémon (0 HP) can't be chosen for gym battles until healed<br>
          • Nurse Joy heals all your Pokémon at once with one button press<br>
          • Healing is free and instant — visit as often as you need!
        </div>
      </div>

    </div>
  </div>`;

  // ===== SECTION 2: EDUCATIONAL CHALLENGES =====
  html += `
  <div class="guide-section collapsed">
    <div class="guide-section-header" style="background:linear-gradient(135deg,#E53935,#C62828)" onclick="toggleGuideSection(this)">
      🎓 Educational Challenges
      <span class="guide-chevron">▲</span>
    </div>
    <div class="guide-section-body">

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">${tag('Math','math')} Math Challenges</div>
        <div class="guide-activity-desc">Multiple-choice math problems that scale with difficulty level.</div>
        <div class="guide-activity-detail">
          <strong>By level:</strong><br>
          • <strong>Pre-K:</strong> Counting objects (“How many ⭐?”) and number comparison (“Which is bigger?”)<br>
          • <strong>Kindergarten:</strong> Addition & subtraction within 10<br>
          • <strong>1st Grade:</strong> Addition & subtraction within 20<br>
          • <strong>2nd–3rd Grade:</strong> Add, subtract, and multiply with numbers up to 12<br>
          • <strong>4th–5th Grade:</strong> Multiplication, division, and larger number operations
        </div>
      </div>

      <div class="guide-activity" style="border-color:#F57C00">
        <div class="guide-activity-title">${tag('CVC Words','cvc')} CVC Word + Emoji Matching</div>
        <div class="guide-activity-desc">Read a 3-letter CVC word (like "cat" or "dog") and tap the matching emoji picture.</div>
        <div class="guide-activity-detail">
          <strong>Details:</strong><br>
          • 40 CVC words across all 5 vowel families (a, e, i, o, u)<br>
          • Great for early readers learning to sound out words<br>
          • Available at Pre-K and Kindergarten levels
        </div>
      </div>

      <div class="guide-activity" style="border-color:#1565C0">
        <div class="guide-activity-title">${tag('Reading','reading')} Reading Challenges</div>
        <div class="guide-activity-desc">Fill-in-the-blank, rhyming, opposites, and vocabulary questions.</div>
        <div class="guide-activity-detail">
          • "The ___ sat on the mat" (fill in the blank)<br>
          • "Which word rhymes with 'ball'?"<br>
          • "Which word is the OPPOSITE of 'big'?"<br>
          • Available from Kindergarten and up
        </div>
      </div>

      <div class="guide-activity" style="border-color:#7B1FA2">
        <div class="guide-activity-title">${tag('Spelling','spelling')} Spelling Challenges</div>
        <div class="guide-activity-desc">Unscramble letters to spell Pokémon-themed words, with hints.</div>
        <div class="guide-activity-detail">
          • Words like FIRE, WATER, GRASS, MAGIC, POWER, STORM<br>
          • Each word has a hint: "It is very hot and burns!"<br>
          • Type the unscrambled word to answer<br>
          • Available from 1st Grade and up
        </div>
      </div>

      <div class="guide-activity" style="border-color:#00897B">
        <div class="guide-activity-title">${tag('Comprehension','comprehension')} Reading Comprehension</div>
        <div class="guide-activity-desc">Read a short Pokémon-themed passage and answer a question about it.</div>
        <div class="guide-activity-detail">
          • Passages about Pikachu, Gym badges, Snorlax, Magikarp & more<br>
          • Tests understanding, not just word recognition<br>
          • Available from 2nd–3rd Grade and up
        </div>
      </div>

    </div>
  </div>`;

  // ===== SECTION 2b: NEW ACTIVITIES =====
  html += `
  <div class="guide-section collapsed">
    <div class="guide-section-header" style="background:linear-gradient(135deg,#2E7D32,#388E3C)" onclick="toggleGuideSection(this)">
      🆕 New Activities
      <span class="guide-chevron">▲</span>
    </div>
    <div class="guide-section-body">

      <div style="font-size:14px;color:#555;margin-bottom:12px;line-height:1.5;">
        26 new activities are available in the <strong>Pokémon Lab → Activities</strong> tab! Activities are filtered to your current level. Here's what's available at each level:
      </div>

      <div style="font-weight:700;font-size:13px;color:#888;text-transform:uppercase;letter-spacing:1px;margin:16px 0 8px;">Level 1–2 · Little &amp; Rookie Trainer (Pre-K / Kindergarten)</div>

      <div class="guide-activity" style="border-color:#E91E63">
        <div class="guide-activity-title">🔊 Sound Safari</div>
        <div class="guide-activity-desc">Match pictures to their beginning sounds! "Which starts with /b/?"</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> Pre-K, Kindergarten &nbsp; ${tag('Phonics','phonics')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">🔢 Counting Catch</div>
        <div class="guide-activity-desc">Count an emoji cluster and pick the right number — great for building number sense!</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> Pre-K through 1st Grade &nbsp; ${tag('Math','math')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">🔷 Shape Sorting Lab</div>
        <div class="guide-activity-desc">Name the shape shown or pick the matching shape from a set of big emoji choices.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> Pre-K, Kindergarten &nbsp; ${tag('Math','math')}</div>
      </div>

      <div class="guide-activity" style="border-color:#1565C0">
        <div class="guide-activity-title">🎨 Color Match</div>
        <div class="guide-activity-desc">Read a color word and match it to the correct swatch — builds sight word + color vocabulary.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> Pre-K, Kindergarten &nbsp; ${tag('Reading','reading')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">🧩 Pattern Path</div>
        <div class="guide-activity-desc">What comes next? Finish AB, ABC, or AABB emoji patterns.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> Pre-K through 1st Grade &nbsp; ${tag('Math','math')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">⚖️ More or Less</div>
        <div class="guide-activity-desc">Compare two numbers and decide which is more or less — builds number comparison skills.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> Pre-K, Kindergarten &nbsp; ${tag('Math','math')}</div>
      </div>

      <div style="font-weight:700;font-size:13px;color:#888;text-transform:uppercase;letter-spacing:1px;margin:16px 0 8px;">Level 2–3 · Kindergarten / 1st Grade</div>

      <div class="guide-activity" style="border-color:#E91E63">
        <div class="guide-activity-title">🗣️ Blend-a-Mon</div>
        <div class="guide-activity-desc">Blend consonant sounds together and tap the matching picture. "Sl + eep = ?"</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> Kindergarten, 1st Grade &nbsp; ${tag('Phonics','phonics')}</div>
      </div>

      <div class="guide-activity" style="border-color:#1565C0">
        <div class="guide-activity-title">🎵 Rhyme Battle</div>
        <div class="guide-activity-desc">Which word rhymes with the given word? Pick the rhyming pair from four options.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> Kindergarten, 1st Grade &nbsp; ${tag('Reading','reading')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">📏 Number Line Race</div>
        <div class="guide-activity-desc">Where does this number go on the number line? Builds number-line intuition.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> Kindergarten, 1st Grade &nbsp; ${tag('Math','math')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">❓ Missing Number</div>
        <div class="guide-activity-desc">Fill in the blank in a sequence: 3, 5, ?, 9. Covers skip-counting and sequences.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> Kindergarten through 2nd Grade &nbsp; ${tag('Math','math')}</div>
      </div>

      <div style="font-weight:700;font-size:13px;color:#888;text-transform:uppercase;letter-spacing:1px;margin:16px 0 8px;">Level 3–4 · 1st / 2nd–3rd Grade</div>

      <div class="guide-activity" style="border-color:#7B1FA2">
        <div class="guide-activity-title">✏️ Pokédex Speller</div>
        <div class="guide-activity-desc">Unscramble the letters to spell a Pokémon-world word using the given hint.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 1st through 2nd–3rd Grade &nbsp; ${tag('Spelling','spelling')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">🧪 Potion Mixer</div>
        <div class="guide-activity-desc">Solve fraction and division word problems to mix the right Pokémon potions.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 1st–2nd Grade &nbsp; ${tag('Math','math')}</div>
      </div>

      <div class="guide-activity" style="border-color:#1565C0">
        <div class="guide-activity-title">🔤 Sight Word Scramble</div>
        <div class="guide-activity-desc">Unscramble a jumbled sight word — rapid-fire reading practice.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 1st–2nd Grade &nbsp; ${tag('Reading','reading')}</div>
      </div>

      <div class="guide-activity" style="border-color:#1565C0">
        <div class="guide-activity-title">📖 Story Sequence</div>
        <div class="guide-activity-desc">Read three short story panels and tap them in the correct order to tell the story.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 1st–2nd Grade &nbsp; ${tag('Reading','reading')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">🪙 Coin Counter</div>
        <div class="guide-activity-desc">Count coins and find the matching total — covers penny, nickel, dime, and quarter.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 1st Grade through 4th Grade &nbsp; ${tag('Math','math')}</div>
      </div>

      <div style="font-weight:700;font-size:13px;color:#888;text-transform:uppercase;letter-spacing:1px;margin:16px 0 8px;">Level 4–5 · 2nd–3rd / 4th–5th Grade</div>

      <div class="guide-activity" style="border-color:#FF6B35">
        <div class="guide-activity-title">⚔️ Type Advantage Quiz</div>
        <div class="guide-activity-desc">Which type is super effective? Tests deep knowledge of all Pokémon type matchups.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 2nd–3rd Grade, 4th–5th Grade &nbsp; ${tag('Strategy','strategy')}</div>
      </div>

      <div class="guide-activity" style="border-color:#00897B">
        <div class="guide-activity-title">🌍 Habitat Match</div>
        <div class="guide-activity-desc">Match a Pokémon to its natural habitat — forest, ocean, cave, volcano, and more!</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 2nd–3rd Grade, 4th–5th Grade &nbsp; ${tag('Science','science')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">💪 Multiply Power-Up</div>
        <div class="guide-activity-desc">Power up your Pokémon by solving multiplication challenges — tables up to 12!</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 2nd–3rd Grade, 4th–5th Grade &nbsp; ${tag('Math','math')}</div>
      </div>

      <div class="guide-activity" style="border-color:#1565C0">
        <div class="guide-activity-title">📚 Reading Quest</div>
        <div class="guide-activity-desc">Read a multi-sentence Pokémon passage then answer a comprehension question.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 2nd–3rd Grade, 4th–5th Grade &nbsp; ${tag('Reading','reading')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">🎯 Estimation Station</div>
        <div class="guide-activity-desc">Enter your best estimate! Correct if you're within a generous tolerance range.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 2nd–3rd Grade, 4th–5th Grade &nbsp; ${tag('Math','math')}</div>
      </div>

      <div class="guide-activity" style="border-color:#00897B">
        <div class="guide-activity-title">🔬 Science Lab</div>
        <div class="guide-activity-desc">Answer real-world science questions — animals, plants, weather, and the solar system.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 2nd–3rd Grade, 4th–5th Grade &nbsp; ${tag('Science','science')}</div>
      </div>

      <div style="font-weight:700;font-size:13px;color:#888;text-transform:uppercase;letter-spacing:1px;margin:16px 0 8px;">Level 5 · Master Trainer (4th–5th Grade only)</div>

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">🥚 Breeder Fractions</div>
        <div class="guide-activity-desc">A Pokémon egg hatch challenge using fractions — simplify, compare, and add fractions.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 4th–5th Grade &nbsp; ${tag('Math','math')}</div>
      </div>

      <div class="guide-activity" style="border-color:#00897B">
        <div class="guide-activity-title">🗺️ Geography Explorer</div>
        <div class="guide-activity-desc">Identify countries, continents, and capitals — geography through the lens of a Pokémon journey!</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 4th–5th Grade &nbsp; ${tag('Science','science')}</div>
      </div>

      <div class="guide-activity" style="border-color:#FF6B35">
        <div class="guide-activity-title">🧠 Battle Strategy</div>
        <div class="guide-activity-desc">Logic puzzles framed as battle decisions — choose the optimal move from multi-step reasoning.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 4th–5th Grade &nbsp; ${tag('Strategy','strategy')}</div>
      </div>

      <div class="guide-activity" style="border-color:#6A1B9A">
        <div class="guide-activity-title">✍️ Creative Writing</div>
        <div class="guide-activity-desc">Write at least a sentence about a Pokémon prompt — open-ended, no wrong answers!</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 4th–5th Grade &nbsp; ${tag('Writing','writing')}</div>
      </div>

      <div class="guide-activity" style="border-color:#3F51B5">
        <div class="guide-activity-title">🔐 Code Breaker</div>
        <div class="guide-activity-desc">Decode a secret message using a simple cipher and choose the correct hidden word.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 4th–5th Grade &nbsp; ${tag('Logic','logic')}</div>
      </div>

    </div>
  </div>`;

  // ===== SECTION 2c: SPECIAL FEATURES =====
  html += `
  <div class="guide-section collapsed">
    <div class="guide-section-header" style="background:linear-gradient(135deg,#FF6B35,#E64A19)" onclick="toggleGuideSection(this)">
      🌟 Special Features
      <span class="guide-chevron">▲</span>
    </div>
    <div class="guide-section-body">

      <div class="guide-activity" style="border-color:#1565C0">
        <div class="guide-activity-title">🎚️ Dynamic Difficulty</div>
        <div class="guide-activity-desc">The game adjusts to your skill! Get 5 in a row right and questions get slightly harder. Struggling? They get easier automatically.</div>
        <div class="guide-activity-detail">This system works silently in the background — no interruptions, just questions that always feel <em>just right</em>.</div>
      </div>

      <div class="guide-activity" style="border-color:#FF6B35">
        <div class="guide-activity-title">🔥 Streak Bonuses</div>
        <div class="guide-activity-desc">Get 5 correct in a row for a <strong>Super Effective!</strong> bonus XP. Get 10 in a row for an <strong>Unstoppable!!</strong> bonus!</div>
        <div class="guide-activity-detail">Watch for the streak badge in the top-right corner of the screen — it pulses to celebrate your streak!</div>
      </div>

      <div class="guide-activity" style="border-color:#FFD600">
        <div class="guide-activity-title">📅 Daily Challenge</div>
        <div class="guide-activity-desc">Complete one special challenge each day for a rare Pokémon encounter!</div>
        <div class="guide-activity-detail">Find the Daily Challenge in <strong>Pokémon Lab → Daily</strong>. One new challenge resets every day at midnight.</div>
      </div>

      <div class="guide-activity" style="border-color:#4CAF50">
        <div class="guide-activity-title">💫 Pokémon Buddy &amp; Evolution</div>
        <div class="guide-activity-desc">Set a buddy Pokémon and answer questions to make it evolve — just like in the real games!</div>
        <div class="guide-activity-detail">Pick any caught Pokémon as your buddy in <strong>Pokémon Lab → Buddy</strong>. Every correct answer anywhere earns evolution progress. Watch the XP bar fill up!</div>
      </div>

      <div class="guide-activity" style="border-color:#00897B">
        <div class="guide-activity-title">⏱️ Session Timer &amp; Break Reminders</div>
        <div class="guide-activity-desc">After 15 minutes, you'll get a friendly break reminder. Taking breaks helps you learn better!</div>
        <div class="guide-activity-detail">A small timer in the corner shows your session time. When 15 minutes is up, a gentle prompt appears — keep playing or take a break, the choice is yours.</div>
      </div>

      <div class="guide-activity" style="border-color:#7B1FA2">
        <div class="guide-activity-title">👥 Two-Player Mode</div>
        <div class="guide-activity-desc">Enable in ⚙️ Settings to play with a friend! Take turns answering questions.</div>
        <div class="guide-activity-detail">Both players share the same screen and alternate turns. Each correct answer scores a point for the active player — great for friendly competition or parent-child teamwork!</div>
      </div>

    </div>
  </div>`;


  // ===== SECTION 3: DIFFICULTY LEVELS =====
  html += `
  <div class="guide-section collapsed">
    <div class="guide-section-header" style="background:linear-gradient(135deg,#F57F17,#F9A825)" onclick="toggleGuideSection(this)">
      ⭐ Difficulty Levels
      <span class="guide-chevron">▲</span>
    </div>
    <div class="guide-section-body">
      <div style="font-size:14px;color:#555;margin-bottom:12px;line-height:1.5;">
        Change your level anytime using the ⚙️ Settings gear on the map screen. Higher levels unlock harder questions and more challenge types.
      </div>
      <table class="guide-level-table">
        <thead>
          <tr>
            <th></th>
            <th>Level</th>
            <th>Ages</th>
            <th>Skills Practiced</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="guide-level-icon">🌟</td>
            <td><strong>Little Trainer</strong></td>
            <td>Pre-K<br>(Ages 4–5)</td>
            <td>
              ${tag('Counting','math')} ${tag('Number Comparison','math')} ${tag('CVC Words','cvc')}<br>
              <em style="font-size:11px;color:#888;">+ New: Sound Safari, Counting Catch, Shape Sorting, Color Match, Pattern Path, More or Less</em>
            </td>
          </tr>
          <tr>
            <td class="guide-level-icon">⭐</td>
            <td><strong>Rookie Trainer</strong></td>
            <td>Kindergarten<br>(Ages 5–6)</td>
            <td>
              ${tag('Add/Sub ≤10','math')} ${tag('CVC Words','cvc')} ${tag('Reading','reading')}<br>
              <em style="font-size:11px;color:#888;">+ New: Sound Safari, Counting Catch, Shape Sorting, Color Match, Pattern Path, More or Less, Blend-a-Mon, Rhyme Battle, Number Line Race, Missing Number</em>
            </td>
          </tr>
          <tr>
            <td class="guide-level-icon">🏅</td>
            <td><strong>Junior Trainer</strong></td>
            <td>1st Grade<br>(Ages 6–7)</td>
            <td>
              ${tag('Add/Sub ≤20','math')} ${tag('Reading','reading')} ${tag('Spelling','spelling')}<br>
              <em style="font-size:11px;color:#888;">+ New: Counting Catch, Pattern Path, Blend-a-Mon, Rhyme Battle, Pokédex Speller, Number Line Race, Missing Number, Potion Mixer, Sight Word Scramble, Story Sequence, Coin Counter</em>
            </td>
          </tr>
          <tr>
            <td class="guide-level-icon">🚀</td>
            <td><strong>Star Trainer</strong></td>
            <td>2nd–3rd Grade<br>(Ages 7–9)</td>
            <td>
              ${tag('Multiply Intro','math')} ${tag('Reading','reading')} ${tag('Spelling','spelling')} ${tag('Comprehension','comprehension')}<br>
              <em style="font-size:11px;color:#888;">+ New: Pokédex Speller, Missing Number, Potion Mixer, Sight Word Scramble, Story Sequence, Coin Counter, Type Advantage Quiz, Habitat Match, Multiply Power-Up, Reading Quest, Estimation Station, Science Lab</em>
            </td>
          </tr>
          <tr>
            <td class="guide-level-icon">👑</td>
            <td><strong>Master Trainer</strong></td>
            <td>4th–5th Grade<br>(Ages 9–11)</td>
            <td>
              ${tag('Multiply/Divide','math')} ${tag('Big Numbers','math')} ${tag('Reading','reading')} ${tag('Spelling','spelling')} ${tag('Comprehension','comprehension')}<br>
              <em style="font-size:11px;color:#888;">+ New: Coin Counter, Type Advantage Quiz, Habitat Match, Multiply Power-Up, Reading Quest, Estimation Station, Science Lab, Breeder Fractions, Geography Explorer, Battle Strategy, Creative Writing, Code Breaker</em>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>`;

  // ===== SECTION 4: TYPE CHART =====
  html += `
  <div class="guide-section collapsed">
    <div class="guide-section-header" style="background:linear-gradient(135deg,#6A1B9A,#4A148C)" onclick="toggleGuideSection(this)">
      ⚔️ Type Strengths & Weaknesses
      <span class="guide-chevron">▲</span>
    </div>
    <div class="guide-section-body">
      <div style="font-size:14px;color:#555;margin-bottom:12px;line-height:1.5;">
        In gym battles, choosing moves that are strong against the enemy Pokémon's type deals more damage! Here are the key matchups:
      </div>
      <div class="guide-activity" style="border-color:#E53935;padding:10px;">
        <div style="font-size:14px;line-height:2;">
          🔥 <strong>Fire</strong> beats Grass, Bug • Weak to Water, Rock, Ground<br>
          💧 <strong>Water</strong> beats Fire, Rock, Ground • Weak to Grass, Electric<br>
          🌿 <strong>Grass</strong> beats Water, Rock, Ground • Weak to Fire, Bug, Flying, Poison<br>
          ⚡ <strong>Electric</strong> beats Water, Flying • Weak to Ground<br>
          🪨 <strong>Rock</strong> beats Fire, Bug, Flying • Weak to Water, Grass, Fighting, Ground<br>
          🌍 <strong>Ground</strong> beats Fire, Electric, Rock, Poison • Weak to Water, Grass<br>
          🥊 <strong>Fighting</strong> beats Normal, Rock • Weak to Psychic, Flying<br>
          🔮 <strong>Psychic</strong> beats Fighting, Poison • Weak to Bug, Ghost<br>
          👻 <strong>Ghost</strong> beats Psychic, Ghost • Immune to Normal, Fighting<br>
          🐛 <strong>Bug</strong> beats Grass, Psychic • Weak to Fire, Rock, Flying<br>
          💜 <strong>Poison</strong> beats Grass • Weak to Ground, Psychic<br>
          🐲 <strong>Dragon</strong> beats Dragon • Resists Fire, Water, Grass, Electric<br>
          🪶 <strong>Flying</strong> beats Grass, Bug, Fighting • Weak to Electric, Rock<br>
          ⬜ <strong>Normal</strong> • No strengths • Weak to Fighting • Immune to Ghost
        </div>
      </div>
    </div>
  </div>`;

  container.innerHTML = html;
}

window.toggleGuideSection = function(header) {
  const section = header.parentElement;
  section.classList.toggle('collapsed');
  section.classList.toggle('open');
};

