# Integration Spec — Pokemon Game New Features

## Overview
Integrate activities.js and systems.js into the existing Pokemon game. This requires changes to:
1. game.js — hook new activities into challenge system, add Pokemon Lab hub, hook systems
2. index.html — add new scenes, script tags
3. style.css — add styles for new components

## Files to Read First
- `/home/user/workspace/pokemon-game/game.js` (3317 lines — the main game)
- `/home/user/workspace/pokemon-game/index.html` (326 lines)
- `/home/user/workspace/pokemon-game/style.css` (1397 lines)
- `/home/user/workspace/pokemon-game/activities.js` (1675 lines — new activities, just read first/last 100 lines)
- `/home/user/workspace/pokemon-game/systems.js` (696 lines — new systems, just read first/last 100 lines)

## CHANGES NEEDED

### 1. index.html Changes
Add script tags BEFORE game.js closing (activities.js and systems.js must load AFTER game.js since they reference State, TYPE_CHART etc.):
```html
<script src="game.js"></script>
<script src="activities.js"></script>
<script src="systems.js"></script>
```

Wait — actually activities.js has a `shuffleArray` function, and systems.js references State which is in game.js. So game.js must load first, then activities.js, then systems.js.

BUT there's a problem — game.js has an IIFE at the end that runs on load (the init function at line 3291). We need the init to happen AFTER all scripts load. 

SOLUTION: Instead of separate script tags, we should keep the script loading order but make sure the init IIFE in game.js doesn't prevent the other scripts from being useful. Actually, looking at it, the init IIFE just sets up event listeners and shows the title screen — it doesn't call any of the new functions. So the load order game.js → activities.js → systems.js should work fine.

Add new scenes to HTML:

#### Pokemon Lab Hub Scene (after pokedex scene)
```html
<!-- POKEMON LAB HUB -->
<div id="scene-lab" class="scene">
  <div class="lab-bg"></div>
  <div class="lab-content">
    <div class="scene-header">
      <button class="btn-back" onclick="Game.goToMap()">← Back</button>
      <h2 class="scene-title">🔬 Pokémon Lab</h2>
    </div>
    <div class="lab-tabs" id="lab-tabs"></div>
    <div class="lab-activities" id="lab-activities"></div>
    <div id="lab-activity-area" class="lab-activity-area hidden"></div>
  </div>
</div>
```

#### Activity Play Scene (for standalone activities)
```html
<!-- STANDALONE ACTIVITY -->
<div id="scene-activity" class="scene">
  <div class="activity-bg"></div>
  <div class="activity-content">
    <div class="scene-header">
      <button class="btn-back" onclick="Game.exitActivity()">← Back</button>
      <h2 class="scene-title" id="activity-scene-title">Activity</h2>
      <div class="activity-score" id="activity-score"></div>
    </div>
    <div id="activity-play-area" class="activity-play-area"></div>
    <div id="activity-feedback" class="activity-feedback hidden"></div>
  </div>
</div>
```

### 2. game.js Changes

#### A. Update the map — change Pokemon Lab from Pokedex to Lab Hub
In index.html, the "Pokémon Lab" button currently calls `Game.goToPokedex()`. Change it:
- Keep the existing Pokedex button, but update the Pokemon Lab card to go to `Game.goToLab()`
- The Lab Hub will have tabs: "Pokédex", "Activities", "Daily Challenge", "Buddy"
- The Activities tab shows all available activities for the current level

#### B. Add Game.goToLab() function in game.js
```js
Game.goToLab = function() {
  SFX.pop();
  renderLabHub();
  showScene('lab');
};
```

#### C. Add renderLabHub() that shows:
- Tab bar: Pokédex | Activities | Daily | Buddy
- Pokédex tab: same grid as current pokedex
- Activities tab: grid of activity cards filtered by current level (using ACTIVITY_REGISTRY)
- Daily tab: DailyChallenge.renderCard()
- Buddy tab: Evolution.renderBuddyCard() + buddy picker

#### D. Add Game.startLabActivity(activityKey) 
- Gets generator from ACTIVITY_REGISTRY[activityKey]
- Generates a challenge
- Shows it in scene-activity with proper rendering
- Tracks score (correct/total for the session)

#### E. Add Game.exitActivity()
- Returns to lab hub

#### F. Update getChallenge() to include new activity types
The existing getChallenge dispatches on type. Add new types:
```js
// In getChallenge, add at the top:
if (ACTIVITY_REGISTRY[type]) {
  return ACTIVITY_REGISTRY[type].generator(difficulty);
}
```

#### G. Update getAvailableChallengeTypes() to include new activities
Filter ACTIVITY_REGISTRY by current level and randomly include some new types:
```js
function getAvailableChallengeTypes() {
  const lvl = State.settings.level;
  // Keep existing base types
  let types = [];
  if (lvl <= 1) types = ['math', 'cvc'];
  else if (lvl <= 2) types = ['math', 'cvc', 'reading'];
  else if (lvl <= 3) types = ['math', 'reading', 'spelling'];
  else if (lvl <= 4) types = ['math', 'reading', 'spelling', 'comprehension'];
  else types = ['math', 'reading', 'spelling', 'comprehension'];
  
  // Add new activities that are available at this level
  Object.entries(ACTIVITY_REGISTRY).forEach(([key, info]) => {
    if (info.levels.includes(lvl)) {
      types.push(key);
    }
  });
  return types;
}
```

#### H. Update renderChallengeHTML() to handle new activity types
Add cases for the new types. Most new activities use standard multiple-choice, but some need special rendering:
- `creativeWriting` → text input
- `estimationStation` → number input with tolerance
- `storySequence` → ordered list display
- `codeBreaker` → shows coded message + hint
- `shapeSorting` → shows CSS shapes as choices
- `countingCatch` → shows emoji cluster + number choices
- Standard activities → question + 4 choice buttons (same as existing)

#### I. Update answerChallenge() to handle new types
Most work the same (compare chosen to answer). Special cases:
- `creativeWriting`: accept if input.length >= 10
- `estimationStation`: accept if within tolerance
- Others: exact string match (existing logic)

#### J. Hook onAnswerResult() into existing answer flows
After each challenge answer (in answerChallenge for encounters, in gym battle answer):
```js
if (typeof onAnswerResult === 'function') onAnswerResult(isCorrect, context);
```

#### K. Start session timer after title screen
In the start button handler (line 1534):
```js
if (typeof SessionTimer !== 'undefined') SessionTimer.start();
```

#### L. Add SessionTimer.check() to showScene()
```js
function showScene(id) {
  // ...existing code...
  if (typeof SessionTimer !== 'undefined') SessionTimer.check();
}
```

### 3. style.css Changes

Add styles for:

#### Lab Hub
```css
.lab-bg { same pattern as other bg scenes }
.lab-content { max-width: 900px; margin: 0 auto; padding: 16px; }
.lab-tabs { display: flex; gap: 4px; margin-bottom: 16px; overflow-x: auto; }
.lab-tab { padding: 10px 18px; border-radius: var(--pk-radius-sm); font-weight: 600; font-size: 14px; border: none; background: var(--pk-card); cursor: pointer; white-space: nowrap; }
.lab-tab.active { background: var(--pk-blue); color: white; }
.lab-activities { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; }
.lab-activity-card { background: var(--pk-card); border-radius: var(--pk-radius); padding: 16px; text-align: center; cursor: pointer; border: 2px solid transparent; transition: all 0.2s; }
.lab-activity-card:hover { border-color: var(--pk-blue); transform: translateY(-2px); box-shadow: var(--pk-shadow); }
.lab-activity-card .card-icon { font-size: 32px; margin-bottom: 8px; }
.lab-activity-card .card-name { font-weight: 600; font-size: 14px; color: var(--pk-dark); }
.lab-activity-card .card-skill { font-size: 12px; color: #888; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
```

#### Activity Scene
```css
.activity-bg { same pattern }
.activity-content { max-width: 700px; margin: 0 auto; padding: 16px; }
.activity-play-area { background: var(--pk-card); border-radius: var(--pk-radius); padding: 24px; min-height: 300px; }
.activity-score { background: var(--pk-yellow); color: var(--pk-dark); padding: 4px 12px; border-radius: 20px; font-weight: 600; font-size: 14px; }
.activity-feedback { padding: 16px; border-radius: var(--pk-radius); text-align: center; font-weight: 600; margin-top: 12px; }
.activity-feedback.correct { background: #E8F5E9; color: #2E7D32; }
.activity-feedback.wrong { background: #FFEBEE; color: #C62828; }
```

#### Buddy Card
```css
.buddy-card { background: var(--pk-card); border-radius: var(--pk-radius); padding: 20px; display: flex; align-items: center; gap: 16px; }
.buddy-sprite { width: 80px; height: 80px; image-rendering: pixelated; }
.buddy-progress { flex: 1; }
.buddy-progress-bar { height: 12px; background: #eee; border-radius: 6px; overflow: hidden; margin-top: 8px; }
.buddy-progress-fill { height: 100%; background: linear-gradient(90deg, var(--pk-blue), var(--pk-yellow)); border-radius: 6px; transition: width 0.3s; }
```

#### Daily Challenge Card
```css
.daily-card { background: linear-gradient(135deg, #FFD600, #FF9100); border-radius: var(--pk-radius); padding: 20px; text-align: center; color: var(--pk-dark); }
.daily-card.completed { opacity: 0.7; background: linear-gradient(135deg, #E0E0E0, #BDBDBD); }
.daily-card h3 { margin: 0 0 8px; }
```

#### Streak indicator
```css
.streak-indicator { position: fixed; top: 60px; right: 16px; background: linear-gradient(135deg, #FF6B35, #E53935); color: white; padding: 6px 14px; border-radius: 20px; font-weight: 700; font-size: 14px; z-index: 100; animation: streakPulse 0.3s ease; }
@keyframes streakPulse { 0% { transform: scale(1.3); } 100% { transform: scale(1); } }
```

#### Session timer
```css
.session-timer-ui { font-size: 12px; color: #888; }
.break-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.break-panel { background: white; border-radius: var(--pk-radius); padding: 32px; text-align: center; max-width: 360px; }
```

#### Collab scoreboard
```css
.collab-scoreboard { display: flex; justify-content: center; gap: 24px; padding: 10px; background: var(--pk-card); border-radius: var(--pk-radius-sm); margin-bottom: 12px; }
.collab-player { font-weight: 600; }
.collab-player.active { color: var(--pk-blue); }
.collab-turn { text-align: center; padding: 8px; font-weight: 600; color: var(--pk-blue); font-size: 16px; }
```
