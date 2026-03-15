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
          • Solve a ${tag('Math','math')} challenge to unlock each clue<br>
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
          • Choose attack moves — each requires a ${tag('Reading','reading')} or ${tag('Phonics','phonics')} challenge<br>
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
          • ${tag('Pattern Blitz','pattern')} — Solve 5 number patterns before time runs out (90 sec, need 4/5)!<br>
          • ${tag('Sentence Ordering','sentence')} — Drag words into the correct order to form a sentence<br>
          • ${tag('Quick Math','timedmath')} — Solve 5 math problems before time runs out (60 sec, need 4/5)!
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
        <div class="guide-activity-desc">22 structured activities based on the Science of Reading: phonemic awareness → phonics → fluency → vocabulary → comprehension.</div>
        <div class="guide-activity-detail">
          • Activities progress through 5 levels from Pre-K to 4th–5th Grade<br>
          • Each level targets age-appropriate literacy skills<br>
          • See the <strong>Learning Activities</strong> section below for full details
        </div>
      </div>

      <div class="guide-activity" style="border-color:#7B1FA2">
        <div class="guide-activity-title">${tag('Spelling','spelling')} Spelling Challenges</div>
        <div class="guide-activity-desc">Spelling practice is embedded within Pokédex Speller, Spelling Rules Quiz, and Word Builder activities.</div>
        <div class="guide-activity-detail">
          • <strong>Word Builder (K):</strong> Tap letter tiles to spell CVC words from a picture<br>
          • <strong>Spelling Rules (1st, 2nd–3rd):</strong> Learn why words are spelled the way they are<br>
          • <strong>Pokédex Speller (1st, 2nd–3rd):</strong> Unscramble Pokémon-world words
        </div>
      </div>

      <div class="guide-activity" style="border-color:#00897B">
        <div class="guide-activity-title">${tag('Comprehension','comprehension')} Reading Comprehension</div>
        <div class="guide-activity-desc">Level-specific comprehension passages and inference questions.</div>
        <div class="guide-activity-detail">
          • <strong>Reading Quest (2nd–3rd):</strong> 10 level-specific comprehension passages<br>
          • <strong>Inference Lab (4th–5th):</strong> Answer questions requiring inference from 12 passages<br>
          • <strong>Main Idea Matcher (4th–5th):</strong> Identify the best main idea from 8 passages
        </div>
      </div>

    </div>
  </div>`;

  // ===== SECTION 2b: LEARNING ACTIVITIES =====
  html += `
  <div class="guide-section collapsed">
    <div class="guide-section-header" style="background:linear-gradient(135deg,#2E7D32,#388E3C)" onclick="toggleGuideSection(this)">
      📚 Learning Activities
      <span class="guide-chevron">▲</span>
    </div>
    <div class="guide-section-body">

      <div style="font-size:14px;color:#555;margin-bottom:12px;line-height:1.5;">
        39 activities are available in the <strong>Pokémon Lab → Activities</strong> tab! Activities are filtered to your current level. Here's what's available:
      </div>

      <div style="font-weight:700;font-size:13px;color:#888;text-transform:uppercase;letter-spacing:1px;margin:16px 0 8px;">Level 1 · Little Trainer (Pre-K)</div>

      <div class="guide-activity" style="border-color:#E91E63">
        <div class="guide-activity-title">🔊 Sound Spotter</div>
        <div class="guide-activity-desc">Hear segmented sounds (/k/ /a/ /t/) and pick the matching picture. DISTAR "say it fast" method.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> Pre-K &nbsp; ${tag('Phonics','phonics')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E91E63">
        <div class="guide-activity-title">🎵 Rhyme Catcher</div>
        <div class="guide-activity-desc">Pick which word rhymes with the target from rhyme families (-at, -an, -ig, etc).</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> Pre-K &nbsp; ${tag('Phonics','phonics')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E91E63">
        <div class="guide-activity-title">🔤 Letter Sound Safari</div>
        <div class="guide-activity-desc">See a letter, pick which picture starts with that sound. All 26 letters.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> Pre-K &nbsp; ${tag('Phonics','phonics')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E91E63">
        <div class="guide-activity-title">👂 First Sound Match</div>
        <div class="guide-activity-desc">Do two words start with the same sound? Yes or No.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> Pre-K &nbsp; ${tag('Phonics','phonics')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">🔢 Counting Catch</div>
        <div class="guide-activity-desc">Count an emoji cluster and pick the right number — great for building number sense!</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> Pre-K through 1st Grade &nbsp; ${tag('Math','math')}</div>
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

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">🔗 Number Bond</div>
        <div class="guide-activity-desc">Find the missing part! Given a whole and one part, figure out the other part.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> All levels &nbsp; ${tag('Math','math')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">📊 Bar Model</div>
        <div class="guide-activity-desc">Use bar model diagrams to solve word problems — a visual approach to addition and subtraction.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> All levels &nbsp; ${tag('Math','math')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">🔢 Place Value</div>
        <div class="guide-activity-desc">What digit is in the tens place? Identify place values from ones to thousands.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> All levels &nbsp; ${tag('Math','math')}</div>
      </div>

      <div style="font-weight:700;font-size:13px;color:#888;text-transform:uppercase;letter-spacing:1px;margin:16px 0 8px;">Level 2 · Rookie Trainer (Kindergarten)</div>

      <div class="guide-activity" style="border-color:#E91E63">
        <div class="guide-activity-title">🧱 Word Builder</div>
        <div class="guide-activity-desc">See a picture, tap letter tiles to spell the CVC word.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> Kindergarten &nbsp; ${tag('Phonics','phonics')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E91E63">
        <div class="guide-activity-title">🤝 Consonant Teams</div>
        <div class="guide-activity-desc">Identify which digraph (SH, TH, CH, CK, WH) a word uses.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> Kindergarten &nbsp; ${tag('Phonics','phonics')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E91E63">
        <div class="guide-activity-title">🗂️ Vowel Sound Sort</div>
        <div class="guide-activity-desc">Hear a CVC word, identify its vowel sound (A, E, I, O, U).</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> Kindergarten &nbsp; ${tag('Phonics','phonics')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E91E63">
        <div class="guide-activity-title">🔗 Blend &amp; Read</div>
        <div class="guide-activity-desc">See individual letters appear, blend them into a word. CVC + CCVC blends.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> Kindergarten &nbsp; ${tag('Phonics','phonics')}</div>
      </div>

      <div class="guide-activity" style="border-color:#1565C0">
        <div class="guide-activity-title">⚡ Sight Word Flash</div>
        <div class="guide-activity-desc">Dolch sight word recognition from 92 words.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> Kindergarten &nbsp; ${tag('Reading','reading')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">🔢 Counting Catch</div>
        <div class="guide-activity-desc">Count an emoji cluster and pick the right number — great for building number sense!</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> Pre-K through 1st Grade &nbsp; ${tag('Math','math')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">🧩 Pattern Path</div>
        <div class="guide-activity-desc">What comes next? Finish AB, ABC, or AABB emoji patterns.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> Pre-K through 1st Grade &nbsp; ${tag('Math','math')}</div>
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

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">🎯 Make 10</div>
        <div class="guide-activity-desc">How many more to make 10 (or 20, or 100)? Builds mental math fluency with complements.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> Kindergarten through 4th–5th Grade &nbsp; ${tag('Math','math')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">🔗 Number Bond</div>
        <div class="guide-activity-desc">Find the missing part! Given a whole and one part, figure out the other part.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> All levels &nbsp; ${tag('Math','math')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">📊 Bar Model</div>
        <div class="guide-activity-desc">Use bar model diagrams to solve word problems — a visual approach to addition and subtraction.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> All levels &nbsp; ${tag('Math','math')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">🔢 Place Value</div>
        <div class="guide-activity-desc">What digit is in the tens place? Identify place values from ones to thousands.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> All levels &nbsp; ${tag('Math','math')}</div>
      </div>

      <div style="font-weight:700;font-size:13px;color:#888;text-transform:uppercase;letter-spacing:1px;margin:16px 0 8px;">Level 3 · Junior Trainer (1st Grade)</div>

      <div class="guide-activity" style="border-color:#E91E63">
        <div class="guide-activity-title">🔠 Phonogram Match</div>
        <div class="guide-activity-desc">See a phonogram (EA, OA, AI, etc), pick which word uses it. 20 phonograms.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 1st Grade &nbsp; ${tag('Phonics','phonics')}</div>
      </div>

      <div class="guide-activity" style="border-color:#1565C0">
        <div class="guide-activity-title">📐 Syllable Sort</div>
        <div class="guide-activity-desc">Identify syllable types: Closed, Open, Silent E (L3), plus R-Controlled, Vowel Team, Consonant-LE (L4).</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 1st Grade, 2nd–3rd Grade &nbsp; ${tag('Reading','reading')}</div>
      </div>

      <div class="guide-activity" style="border-color:#7B1FA2">
        <div class="guide-activity-title">📏 Spelling Rules</div>
        <div class="guide-activity-desc">Why is this word spelled this way? Logic of English rules.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 1st Grade, 2nd–3rd Grade &nbsp; ${tag('Spelling','spelling')}</div>
      </div>

      <div class="guide-activity" style="border-color:#1565C0">
        <div class="guide-activity-title">⏱️ Speed Read</div>
        <div class="guide-activity-desc">Read a word quickly, pick the matching picture. Fluency building.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 1st Grade &nbsp; ${tag('Reading','reading')}</div>
      </div>

      <div class="guide-activity" style="border-color:#1565C0">
        <div class="guide-activity-title">📖 Story Sequence</div>
        <div class="guide-activity-desc">Read three short story panels and tap them in the correct order to tell the story.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 1st Grade, 2nd–3rd Grade &nbsp; ${tag('Reading','reading')}</div>
      </div>

      <div class="guide-activity" style="border-color:#7B1FA2">
        <div class="guide-activity-title">✏️ Pokédex Speller</div>
        <div class="guide-activity-desc">Unscramble the letters to spell a Pokémon-world word using the given hint.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 1st Grade, 2nd–3rd Grade &nbsp; ${tag('Spelling','spelling')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">🔢 Counting Catch</div>
        <div class="guide-activity-desc">Count an emoji cluster and pick the right number — great for building number sense!</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> Pre-K through 1st Grade &nbsp; ${tag('Math','math')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">🧩 Pattern Path</div>
        <div class="guide-activity-desc">What comes next? Finish AB, ABC, or AABB emoji patterns.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> Pre-K through 1st Grade &nbsp; ${tag('Math','math')}</div>
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

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">🧪 Potion Mixer</div>
        <div class="guide-activity-desc">Solve fraction and division word problems to mix the right Pokémon potions.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 1st–2nd Grade &nbsp; ${tag('Math','math')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">🪙 Coin Counter</div>
        <div class="guide-activity-desc">Count coins and find the matching total — covers penny, nickel, dime, and quarter.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 1st Grade through 4th Grade &nbsp; ${tag('Math','math')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">🎯 Make 10</div>
        <div class="guide-activity-desc">How many more to make 10 (or 20, or 100)? Builds mental math fluency with complements.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> Kindergarten through 4th–5th Grade &nbsp; ${tag('Math','math')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">🔗 Number Bond</div>
        <div class="guide-activity-desc">Find the missing part! Given a whole and one part, figure out the other part.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> All levels &nbsp; ${tag('Math','math')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">📊 Bar Model</div>
        <div class="guide-activity-desc">Use bar model diagrams to solve word problems — a visual approach to addition and subtraction.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> All levels &nbsp; ${tag('Math','math')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">🔢 Place Value</div>
        <div class="guide-activity-desc">What digit is in the tens place? Identify place values from ones to thousands.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> All levels &nbsp; ${tag('Math','math')}</div>
      </div>

      <div style="font-weight:700;font-size:13px;color:#888;text-transform:uppercase;letter-spacing:1px;margin:16px 0 8px;">Level 4 · Star Trainer (2nd–3rd Grade)</div>

      <div class="guide-activity" style="border-color:#1565C0">
        <div class="guide-activity-title">📐 Syllable Sort</div>
        <div class="guide-activity-desc">Identify syllable types: Closed, Open, Silent E, R-Controlled, Vowel Team, Consonant-LE.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 1st Grade, 2nd–3rd Grade &nbsp; ${tag('Reading','reading')}</div>
      </div>

      <div class="guide-activity" style="border-color:#7B1FA2">
        <div class="guide-activity-title">📏 Spelling Rules</div>
        <div class="guide-activity-desc">Why is this word spelled this way? Logic of English rules.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 1st Grade, 2nd–3rd Grade &nbsp; ${tag('Spelling','spelling')}</div>
      </div>

      <div class="guide-activity" style="border-color:#1565C0">
        <div class="guide-activity-title">📖 Story Sequence</div>
        <div class="guide-activity-desc">Read three short story panels and tap them in the correct order to tell the story.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 1st Grade, 2nd–3rd Grade &nbsp; ${tag('Reading','reading')}</div>
      </div>

      <div class="guide-activity" style="border-color:#7B1FA2">
        <div class="guide-activity-title">✏️ Pokédex Speller</div>
        <div class="guide-activity-desc">Unscramble the letters to spell a Pokémon-world word using the given hint.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 1st Grade, 2nd–3rd Grade &nbsp; ${tag('Spelling','spelling')}</div>
      </div>

      <div class="guide-activity" style="border-color:#1565C0">
        <div class="guide-activity-title">🔬 Word Surgeon</div>
        <div class="guide-activity-desc">Identify prefixes (un-, re-, dis-, mis-, pre-) and suffixes (-ful, -less, -ness, -ing, -ed, -er) in words.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 2nd–3rd Grade &nbsp; ${tag('Reading','reading')}</div>
      </div>

      <div class="guide-activity" style="border-color:#1565C0">
        <div class="guide-activity-title">🔍 Vocabulary Detective</div>
        <div class="guide-activity-desc">Read a sentence with a bolded word, pick its meaning from context. 30 Pokémon-themed sentences.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 2nd–3rd Grade &nbsp; ${tag('Reading','reading')}</div>
      </div>

      <div class="guide-activity" style="border-color:#00897B">
        <div class="guide-activity-title">📚 Reading Quest</div>
        <div class="guide-activity-desc">Level-specific comprehension passages (2nd–3rd grade reading level). 10 passages.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 2nd–3rd Grade &nbsp; ${tag('Comprehension','comprehension')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">❓ Missing Number</div>
        <div class="guide-activity-desc">Fill in the blank in a sequence: 3, 5, ?, 9. Covers skip-counting and sequences.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> Kindergarten through 2nd Grade &nbsp; ${tag('Math','math')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">🧪 Potion Mixer</div>
        <div class="guide-activity-desc">Solve fraction and division word problems to mix the right Pokémon potions.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 1st–2nd Grade &nbsp; ${tag('Math','math')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">🪙 Coin Counter</div>
        <div class="guide-activity-desc">Count coins and find the matching total — covers penny, nickel, dime, and quarter.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 1st Grade through 4th Grade &nbsp; ${tag('Math','math')}</div>
      </div>

      <div class="guide-activity" style="border-color:#FF6B35">
        <div class="guide-activity-title">⚔️ Type Advantage Quiz</div>
        <div class="guide-activity-desc">Which type is super effective? Tests deep knowledge of all Pokémon type matchups.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 2nd–3rd Grade, 4th–5th Grade &nbsp; ${tag('Strategy','strategy')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">💪 Multiply Power-Up</div>
        <div class="guide-activity-desc">Power up your Pokémon by solving multiplication challenges — tables up to 12!</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 2nd–3rd Grade, 4th–5th Grade &nbsp; ${tag('Math','math')}</div>
      </div>

      <div class="guide-activity" style="border-color:#00897B">
        <div class="guide-activity-title">🔬 Science Lab</div>
        <div class="guide-activity-desc">Answer real-world science questions — animals, plants, weather, and the solar system.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 2nd–3rd Grade, 4th–5th Grade &nbsp; ${tag('Science','science')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">🎯 Make 10</div>
        <div class="guide-activity-desc">How many more to make 10 (or 20, or 100)? Builds mental math fluency with complements.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> Kindergarten through 4th–5th Grade &nbsp; ${tag('Math','math')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">🔗 Number Bond</div>
        <div class="guide-activity-desc">Find the missing part! Given a whole and one part, figure out the other part.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> All levels &nbsp; ${tag('Math','math')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">📊 Bar Model</div>
        <div class="guide-activity-desc">Use bar model diagrams to solve word problems — a visual approach to addition and subtraction.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> All levels &nbsp; ${tag('Math','math')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">🔢 Place Value</div>
        <div class="guide-activity-desc">What digit is in the tens place? Identify place values from ones to thousands.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> All levels &nbsp; ${tag('Math','math')}</div>
      </div>

      <div style="font-weight:700;font-size:13px;color:#888;text-transform:uppercase;letter-spacing:1px;margin:16px 0 8px;">Level 5 · Master Trainer (4th–5th Grade)</div>

      <div class="guide-activity" style="border-color:#1565C0">
        <div class="guide-activity-title">🌳 Root Explorer</div>
        <div class="guide-activity-desc">Learn Latin/Greek roots (aqua=water, bio=life, etc), pick which word uses the root. 20 roots.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 4th–5th Grade &nbsp; ${tag('Reading','reading')}</div>
      </div>

      <div class="guide-activity" style="border-color:#00897B">
        <div class="guide-activity-title">🧠 Inference Lab</div>
        <div class="guide-activity-desc">Read a passage, answer a question that requires inference (not directly stated). 12 passages.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 4th–5th Grade &nbsp; ${tag('Comprehension','comprehension')}</div>
      </div>

      <div class="guide-activity" style="border-color:#00897B">
        <div class="guide-activity-title">🎯 Main Idea Matcher</div>
        <div class="guide-activity-desc">Read a passage, pick the best main idea. 8 passages.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 4th–5th Grade &nbsp; ${tag('Comprehension','comprehension')}</div>
      </div>

      <div class="guide-activity" style="border-color:#1565C0">
        <div class="guide-activity-title">📖 Vocab in Context</div>
        <div class="guide-activity-desc">Advanced vocabulary from context clues. Words like "nocturnal", "symbiotic", "resilience". 12 sentences.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 4th–5th Grade &nbsp; ${tag('Reading','reading')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">🪙 Coin Counter</div>
        <div class="guide-activity-desc">Count coins and find the matching total — covers penny, nickel, dime, and quarter.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 1st Grade through 4th Grade &nbsp; ${tag('Math','math')}</div>
      </div>

      <div class="guide-activity" style="border-color:#FF6B35">
        <div class="guide-activity-title">⚔️ Type Advantage Quiz</div>
        <div class="guide-activity-desc">Which type is super effective? Tests deep knowledge of all Pokémon type matchups.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 2nd–3rd Grade, 4th–5th Grade &nbsp; ${tag('Strategy','strategy')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">💪 Multiply Power-Up</div>
        <div class="guide-activity-desc">Power up your Pokémon by solving multiplication challenges — tables up to 12!</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 2nd–3rd Grade, 4th–5th Grade &nbsp; ${tag('Math','math')}</div>
      </div>

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

      <div class="guide-activity" style="border-color:#00897B">
        <div class="guide-activity-title">🔬 Science Lab</div>
        <div class="guide-activity-desc">Answer real-world science questions — animals, plants, weather, and the solar system.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 2nd–3rd Grade, 4th–5th Grade &nbsp; ${tag('Science','science')}</div>
      </div>

      <div class="guide-activity" style="border-color:#3F51B5">
        <div class="guide-activity-title">🔐 Code Breaker</div>
        <div class="guide-activity-desc">Decode a secret message using a simple cipher and choose the correct hidden word.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> 4th–5th Grade &nbsp; ${tag('Logic','logic')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">🎯 Make 10</div>
        <div class="guide-activity-desc">How many more to make 10 (or 20, or 100)? Builds mental math fluency with complements.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> Kindergarten through 4th–5th Grade &nbsp; ${tag('Math','math')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">🔗 Number Bond</div>
        <div class="guide-activity-desc">Find the missing part! Given a whole and one part, figure out the other part.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> All levels &nbsp; ${tag('Math','math')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">📊 Bar Model</div>
        <div class="guide-activity-desc">Use bar model diagrams to solve word problems — a visual approach to addition and subtraction.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> All levels &nbsp; ${tag('Math','math')}</div>
      </div>

      <div class="guide-activity" style="border-color:#E53935">
        <div class="guide-activity-title">🔢 Place Value</div>
        <div class="guide-activity-desc">What digit is in the tens place? Identify place values from ones to thousands.</div>
        <div class="guide-activity-detail"><strong>Levels:</strong> All levels &nbsp; ${tag('Math','math')}</div>
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
              ${tag('Counting','math')} ${tag('Number Comparison','math')} ${tag('Phonics','phonics')}<br>
              <em style="font-size:11px;color:#888;">+ Sound Spotter, Rhyme Catcher, Letter Sound Safari, First Sound Match, Counting Catch, Pattern Path, More or Less, Number Bond, Bar Model, Place Value</em>
            </td>
          </tr>
          <tr>
            <td class="guide-level-icon">⭐</td>
            <td><strong>Rookie Trainer</strong></td>
            <td>Kindergarten<br>(Ages 5–6)</td>
            <td>
              ${tag('Add/Sub ≤10','math')} ${tag('Phonics','phonics')} ${tag('Reading','reading')}<br>
              <em style="font-size:11px;color:#888;">+ Word Builder, Consonant Teams, Vowel Sound Sort, Blend &amp; Read, Sight Word Flash, Counting Catch, Pattern Path, Number Line Race, Missing Number, Make 10, Number Bond, Bar Model, Place Value</em>
            </td>
          </tr>
          <tr>
            <td class="guide-level-icon">🏅</td>
            <td><strong>Junior Trainer</strong></td>
            <td>1st Grade<br>(Ages 6–7)</td>
            <td>
              ${tag('Add/Sub ≤20','math')} ${tag('Phonics','phonics')} ${tag('Reading','reading')} ${tag('Spelling','spelling')}<br>
              <em style="font-size:11px;color:#888;">+ Phonogram Match, Syllable Sort, Spelling Rules, Speed Read, Story Sequence, Pokédex Speller, Counting Catch, Pattern Path, Number Line Race, Missing Number, Potion Mixer, Coin Counter, Make 10, Number Bond, Bar Model, Place Value</em>
            </td>
          </tr>
          <tr>
            <td class="guide-level-icon">🚀</td>
            <td><strong>Star Trainer</strong></td>
            <td>2nd–3rd Grade<br>(Ages 7–9)</td>
            <td>
              ${tag('Multiply Intro','math')} ${tag('Reading','reading')} ${tag('Spelling','spelling')} ${tag('Comprehension','comprehension')}<br>
              <em style="font-size:11px;color:#888;">+ Syllable Sort, Spelling Rules, Story Sequence, Pokédex Speller, Word Surgeon, Vocabulary Detective, Reading Quest, Missing Number, Potion Mixer, Coin Counter, Type Advantage Quiz, Multiply Power-Up, Science Lab, Make 10, Number Bond, Bar Model, Place Value</em>
            </td>
          </tr>
          <tr>
            <td class="guide-level-icon">👑</td>
            <td><strong>Master Trainer</strong></td>
            <td>4th–5th Grade<br>(Ages 9–11)</td>
            <td>
              ${tag('Multiply/Divide','math')} ${tag('Big Numbers','math')} ${tag('Reading','reading')} ${tag('Comprehension','comprehension')}<br>
              <em style="font-size:11px;color:#888;">+ Root Explorer, Inference Lab, Main Idea Matcher, Vocab in Context, Coin Counter, Type Advantage Quiz, Multiply Power-Up, Breeder Fractions, Geography Explorer, Science Lab, Code Breaker, Make 10, Number Bond, Bar Model, Place Value</em>
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

