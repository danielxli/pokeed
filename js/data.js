// ===== GAME DATA =====
// Type chart, moves, Pokemon DB, gyms, questions, CVC words
// ===== TYPE EFFECTIVENESS CHART =====
// typeChart[attackType][defenderType] = multiplier
const TYPE_CHART = {
  Fire:     { Fire:0.5, Water:0.5, Grass:2,   Electric:1,   Normal:1,   Rock:0.5, Ground:0.5, Ghost:1,   Psychic:1,   Dragon:0.5, Bug:2,   Flying:1,   Fighting:1,   Poison:1   },
  Water:    { Fire:2,   Water:0.5, Grass:0.5, Electric:1,   Normal:1,   Rock:2,   Ground:2,   Ghost:1,   Psychic:1,   Dragon:0.5, Bug:1,   Flying:1,   Fighting:1,   Poison:1   },
  Grass:    { Fire:0.5, Water:2,   Grass:0.5, Electric:1,   Normal:1,   Rock:2,   Ground:2,   Ghost:1,   Psychic:1,   Dragon:0.5, Bug:0.5, Flying:0.5, Fighting:1,   Poison:0.5 },
  Electric: { Fire:1,   Water:2,   Grass:0.5, Electric:0.5, Normal:1,   Rock:1,   Ground:0,   Ghost:1,   Psychic:1,   Dragon:0.5, Bug:1,   Flying:2,   Fighting:1,   Poison:1   },
  Normal:   { Fire:1,   Water:1,   Grass:1,   Electric:1,   Normal:1,   Rock:0.5, Ground:1,   Ghost:0,   Psychic:1,   Dragon:1,   Bug:1,   Flying:1,   Fighting:1,   Poison:1   },
  Rock:     { Fire:2,   Water:0.5, Grass:0.5, Electric:1,   Normal:1,   Rock:1,   Ground:0.5, Ghost:1,   Psychic:1,   Dragon:1,   Bug:2,   Flying:2,   Fighting:0.5, Poison:1   },
  Ground:   { Fire:2,   Water:1,   Grass:0.5, Electric:2,   Normal:1,   Rock:2,   Ground:1,   Ghost:1,   Psychic:1,   Dragon:1,   Bug:0.5, Flying:0,   Fighting:1,   Poison:2   },
  Ghost:    { Fire:1,   Water:1,   Grass:1,   Electric:1,   Normal:0,   Rock:1,   Ground:1,   Ghost:2,   Psychic:2,   Dragon:1,   Bug:1,   Flying:1,   Fighting:0,   Poison:1   },
  Psychic:  { Fire:1,   Water:1,   Grass:1,   Electric:1,   Normal:1,   Rock:1,   Ground:1,   Ghost:1,   Psychic:0.5, Dragon:1,   Bug:0.5, Flying:1,   Fighting:2,   Poison:2   },
  Dragon:   { Fire:1,   Water:1,   Grass:1,   Electric:1,   Normal:1,   Rock:1,   Ground:1,   Ghost:1,   Psychic:1,   Dragon:2,   Bug:1,   Flying:1,   Fighting:1,   Poison:1   },
  Bug:      { Fire:0.5, Water:1,   Grass:2,   Electric:1,   Normal:1,   Rock:1,   Ground:1,   Ghost:0.5, Psychic:2,   Dragon:1,   Bug:1,   Flying:0.5, Fighting:0.5, Poison:0.5 },
  Flying:   { Fire:1,   Water:1,   Grass:2,   Electric:0.5, Normal:1,   Rock:0.5, Ground:1,   Ghost:1,   Psychic:1,   Dragon:1,   Bug:2,   Flying:1,   Fighting:2,   Poison:1   },
  Fighting: { Fire:1,   Water:1,   Grass:1,   Electric:1,   Normal:2,   Rock:2,   Ground:1,   Ghost:0,   Psychic:0.5, Dragon:1,   Bug:0.5, Flying:0.5, Fighting:1,   Poison:1   },
  Poison:   { Fire:1,   Water:1,   Grass:2,   Electric:1,   Normal:1,   Rock:0.5, Ground:0.5, Ghost:0.5, Psychic:1,   Dragon:1,   Bug:1,   Flying:1,   Fighting:1,   Poison:0.5 },
};

function getEffectiveness(attackType, defenderType) {
  if (!TYPE_CHART[attackType]) return 1;
  const mult = TYPE_CHART[attackType][defenderType];
  return mult !== undefined ? mult : 1;
}

// ===== MOVES DATABASE =====
const MOVES_DB = {
  // Fire
  Ember:        { name: 'Ember',        type: 'Fire',     power: 40,  accuracy: 100, isSpecial: true  },
  Flamethrower: { name: 'Flamethrower', type: 'Fire',     power: 90,  accuracy: 100, isSpecial: true  },
  FireSpin:     { name: 'Fire Spin',    type: 'Fire',     power: 35,  accuracy: 85,  isSpecial: true  },
  // Water
  WaterGun:     { name: 'Water Gun',    type: 'Water',    power: 40,  accuracy: 100, isSpecial: true  },
  Surf:         { name: 'Surf',         type: 'Water',    power: 90,  accuracy: 100, isSpecial: true  },
  Bubble:       { name: 'Bubble',       type: 'Water',    power: 40,  accuracy: 100, isSpecial: true  },
  // Grass
  VineWhip:     { name: 'Vine Whip',    type: 'Grass',    power: 45,  accuracy: 100, isSpecial: false },
  RazorLeaf:    { name: 'Razor Leaf',   type: 'Grass',    power: 55,  accuracy: 95,  isSpecial: false },
  SolarBeam:    { name: 'Solar Beam',   type: 'Grass',    power: 120, accuracy: 100, isSpecial: true  },
  // Electric
  ThunderShock: { name: 'ThunderShock', type: 'Electric', power: 40,  accuracy: 100, isSpecial: true  },
  Thunderbolt:  { name: 'Thunderbolt',  type: 'Electric', power: 90,  accuracy: 100, isSpecial: true  },
  Thunder:      { name: 'Thunder',      type: 'Electric', power: 110, accuracy: 70,  isSpecial: true  },
  // Normal
  Tackle:       { name: 'Tackle',       type: 'Normal',   power: 40,  accuracy: 100, isSpecial: false },
  Slam:         { name: 'Slam',         type: 'Normal',   power: 80,  accuracy: 75,  isSpecial: false },
  HyperBeam:    { name: 'Hyper Beam',   type: 'Normal',   power: 150, accuracy: 90,  isSpecial: true  },
  Scratch:      { name: 'Scratch',      type: 'Normal',   power: 40,  accuracy: 100, isSpecial: false },
  BodySlam:     { name: 'Body Slam',    type: 'Normal',   power: 85,  accuracy: 100, isSpecial: false },
  // Rock
  RockThrow:    { name: 'Rock Throw',   type: 'Rock',     power: 50,  accuracy: 90,  isSpecial: false },
  RockSlide:    { name: 'Rock Slide',   type: 'Rock',     power: 75,  accuracy: 90,  isSpecial: false },
  // Ground
  Dig:          { name: 'Dig',          type: 'Ground',   power: 80,  accuracy: 100, isSpecial: false },
  Earthquake:   { name: 'Earthquake',   type: 'Ground',   power: 100, accuracy: 100, isSpecial: false },
  // Fighting
  KarateChop:   { name: 'Karate Chop', type: 'Fighting',  power: 50,  accuracy: 100, isSpecial: false },
  Submission:   { name: 'Submission',   type: 'Fighting', power: 80,  accuracy: 80,  isSpecial: false },
  // Psychic
  Confusion:    { name: 'Confusion',    type: 'Psychic',  power: 50,  accuracy: 100, isSpecial: true  },
  PsychicMove:  { name: 'Psychic',      type: 'Psychic',  power: 90,  accuracy: 100, isSpecial: true  },
  // Ghost
  Lick:         { name: 'Lick',         type: 'Ghost',    power: 30,  accuracy: 100, isSpecial: false },
  ShadowBall:   { name: 'Shadow Ball',  type: 'Ghost',    power: 80,  accuracy: 100, isSpecial: true  },
  // Bug
  BugBite:      { name: 'Bug Bite',     type: 'Bug',      power: 60,  accuracy: 100, isSpecial: false },
  XScissor:     { name: 'X-Scissor',    type: 'Bug',      power: 80,  accuracy: 100, isSpecial: false },
  StringShot:   { name: 'String Shot',  type: 'Bug',      power: 15,  accuracy: 95,  isSpecial: false },
  // Flying
  Gust:         { name: 'Gust',         type: 'Flying',   power: 40,  accuracy: 100, isSpecial: true  },
  WingAttack:   { name: 'Wing Attack',  type: 'Flying',   power: 60,  accuracy: 100, isSpecial: false },
  Fly:          { name: 'Fly',          type: 'Flying',   power: 90,  accuracy: 95,  isSpecial: false },
  // Dragon
  DragonRage:   { name: 'Dragon Rage',  type: 'Dragon',   power: 40,  accuracy: 100, isSpecial: true  },
  DragonClaw:   { name: 'Dragon Claw',  type: 'Dragon',   power: 80,  accuracy: 100, isSpecial: false },
  // Poison
  Sludge:       { name: 'Sludge',       type: 'Poison',   power: 65,  accuracy: 100, isSpecial: true  },
  PoisonSting:  { name: 'Poison Sting', type: 'Poison',   power: 15,  accuracy: 100, isSpecial: false },
  // Ice
  IceBeam:      { name: 'Ice Beam',     type: 'Ice',      power: 90,  accuracy: 100, isSpecial: true  },
  Blizzard:     { name: 'Blizzard',     type: 'Ice',      power: 110, accuracy: 70,  isSpecial: true  },
  IcePunch:     { name: 'Ice Punch',    type: 'Ice',      power: 75,  accuracy: 100, isSpecial: false },
  AuroraBeam:   { name: 'Aurora Beam', type: 'Ice',      power: 65,  accuracy: 100, isSpecial: true  },
  // Normal (extra)
  Bite:         { name: 'Bite',         type: 'Normal',   power: 60,  accuracy: 100, isSpecial: false },
  Headbutt:     { name: 'Headbutt',     type: 'Normal',   power: 70,  accuracy: 100, isSpecial: false },
  MegaPunch:    { name: 'Mega Punch',   type: 'Normal',   power: 80,  accuracy: 85,  isSpecial: false },
  QuickAttack:  { name: 'Quick Attack', type: 'Normal',   power: 40,  accuracy: 100, isSpecial: false },
  SelfDestruct: { name: 'Self-Destruct',type: 'Normal',   power: 200, accuracy: 100, isSpecial: false },
  Explosion:    { name: 'Explosion',    type: 'Normal',   power: 250, accuracy: 100, isSpecial: false },
  TriAttack:    { name: 'Tri Attack',   type: 'Normal',   power: 80,  accuracy: 100, isSpecial: true  },
  Wrap:         { name: 'Wrap',         type: 'Normal',   power: 15,  accuracy: 90,  isSpecial: false },
  // Poison (extra)
  SludgeBomb:   { name: 'Sludge Bomb', type: 'Poison',   power: 90,  accuracy: 100, isSpecial: true  },
  Acid:         { name: 'Acid',         type: 'Poison',   power: 40,  accuracy: 100, isSpecial: true  },
  // Bug (extra)
  PinMissile:   { name: 'Pin Missile',  type: 'Bug',      power: 50,  accuracy: 95,  isSpecial: false },
  // Flying (extra)
  Peck:         { name: 'Peck',         type: 'Flying',   power: 35,  accuracy: 100, isSpecial: false },
  DrillPeck:    { name: 'Drill Peck',   type: 'Flying',   power: 80,  accuracy: 100, isSpecial: false },
  // Fighting (extra)
  SeismicToss:  { name: 'Seismic Toss', type: 'Fighting', power: 60,  accuracy: 100, isSpecial: false },
  // Grass (extra)
  MegaDrain:    { name: 'Mega Drain',   type: 'Grass',    power: 40,  accuracy: 100, isSpecial: true  },
  PetalDance:   { name: 'Petal Dance',  type: 'Grass',    power: 120, accuracy: 100, isSpecial: true  },
  // Water (extra)
  Hydropump:    { name: 'Hydro Pump',   type: 'Water',    power: 110, accuracy: 80,  isSpecial: true  },
  // Fire (extra)
  FireBlast:    { name: 'Fire Blast',   type: 'Fire',     power: 110, accuracy: 85,  isSpecial: true  },
  // Psychic (extra)
  Amnesia:      { name: 'Amnesia',      type: 'Psychic',  power: 30,  accuracy: 100, isSpecial: true  },
  DreamEater:   { name: 'Dream Eater',  type: 'Psychic',  power: 100, accuracy: 100, isSpecial: true  },
  // Ghost (extra)
  NightShade:   { name: 'Night Shade',  type: 'Ghost',    power: 50,  accuracy: 100, isSpecial: true  },
  // Ground (extra)
  Bonemerang:   { name: 'Bonemerang',   type: 'Ground',   power: 50,  accuracy: 90,  isSpecial: false },
};

// ===== POKEMON DATABASE =====
const POKEMON_DB = [
  { id: 1, name: 'Bulbasaur', type: 'Grass', hp: 45, atk: 49, def: 49, spd: 45,
    clue2: 'It loves to grow in forests and meadows, soaking up sunlight.',
    clue3: 'It has a large green bulb on its back that grows over time.',
    clue4: 'When its bulb blooms, it means the Pokémon is fully grown!',
    color: '#78C850',
    moves: ['VineWhip','RazorLeaf','Tackle','SolarBeam'] },
  { id: 2, name: 'Ivysaur', type: 'Grass', hp: 60, atk: 62, def: 63, spd: 60,
    clue2: 'It is found in grassy meadows and sunny forests where it soaks up energy.',
    clue3: 'It looks like its pre-evolution but the bulb on its back has opened into a big pink flower bud.',
    clue4: 'When the bud on its back starts smelling sweet, it means this Pokémon is about to evolve!',
    color: '#78C850',
    moves: ['VineWhip','RazorLeaf','PoisonSting','SolarBeam'] },
  { id: 3, name: 'Venusaur', type: 'Grass', hp: 80, atk: 82, def: 83, spd: 80,
    clue2: 'It is found in lush tropical forests where it absorbs sunlight through its flower.',
    clue3: 'It is a large green frog-like Pokémon with a huge colorful flower blooming on its back.',
    clue4: 'This Pokémon\'s flower releases a sweet scent that attracts other Pokémon from far away!',
    color: '#78C850',
    moves: ['SolarBeam','RazorLeaf','PetalDance','PoisonSting'] },
  { id: 4, name: 'Charmander', type: 'Fire', hp: 39, atk: 52, def: 43, spd: 65,
    clue2: 'It lives near volcanic mountains and loves warm places.',
    clue3: 'It has an orange body and a flame burning brightly on its tail.',
    clue4: 'If the flame on its tail ever goes out, the Pokémon will faint!',
    color: '#F08030',
    moves: ['Ember','Scratch','FireSpin','Flamethrower'] },
  { id: 5, name: 'Charmeleon', type: 'Fire', hp: 58, atk: 64, def: 58, spd: 80,
    clue2: 'It lives in hot rocky mountains where it trains to get stronger.',
    clue3: 'It is a red lizard Pokémon with a bigger flame on its tail and a claw on the back of its head.',
    clue4: 'This Pokémon has a fiery temper and will slash anything nearby with its sharp claws!',
    color: '#F08030',
    moves: ['Ember','Scratch','Flamethrower','FireBlast'] },
  { id: 6, name: 'Charizard', type: 'Fire', hp: 78, atk: 84, def: 78, spd: 100,
    clue2: 'It flies high in the sky near mountains looking for powerful opponents to battle.',
    clue3: 'It is a large orange dragon-like Pokémon with orange wings and a blazing tail.',
    clue4: 'This Pokémon\'s fire burns so hot it can melt almost anything, even solid rock!',
    color: '#F08030',
    moves: ['Flamethrower','FireBlast','Fly','HyperBeam'] },
  { id: 7, name: 'Squirtle', type: 'Water', hp: 44, atk: 48, def: 65, spd: 43,
    clue2: 'It lives near ponds and rivers, always staying close to water.',
    clue3: 'It has a blue body and a hard brown shell on its back.',
    clue4: 'This Pokémon shoots water from its mouth powerful enough to wash away mud!',
    color: '#6890F0',
    moves: ['Bubble','WaterGun','Tackle','Surf'] },
  { id: 8, name: 'Wartortle', type: 'Water', hp: 59, atk: 63, def: 80, spd: 58,
    clue2: 'It is found near rivers and lakes, where it paddles around with its fluffy tail.',
    clue3: 'It looks like a bigger version of its pre-evolution, with fluffy white ears and a bushy blue tail.',
    clue4: 'This Pokémon\'s tail gets fluffier and darker as it gets older — a very old one has a dark tail!',
    color: '#6890F0',
    moves: ['WaterGun','Surf','Bubble','Tackle'] },
  { id: 9, name: 'Blastoise', type: 'Water', hp: 79, atk: 83, def: 100, spd: 78,
    clue2: 'It is found near large bodies of water and is an incredibly strong swimmer.',
    clue3: 'It is a huge blue turtle Pokémon with two big water cannons sticking out of its shell.',
    clue4: 'This Pokémon can blast water from its cannons at over 50 mph — strong enough to punch through steel!',
    color: '#6890F0',
    moves: ['Surf','Hydropump','WaterGun','HyperBeam'] },
  { id: 10, name: 'Caterpie', type: 'Bug', hp: 45, atk: 30, def: 35, spd: 45,
    clue2: 'It is found in forests and spends all day eating green leaves.',
    clue3: 'It is a tiny green caterpillar with a red antenna and a yellow underside.',
    clue4: 'This Pokémon can shed its skin many times as it grows, and will become a butterfly!',
    color: '#A8B820',
    moves: ['StringShot','Tackle','BugBite','StringShot'] },
  { id: 11, name: 'Metapod', type: 'Bug', hp: 50, atk: 20, def: 55, spd: 30,
    clue2: 'It is found hanging from tree branches in forests, completely still.',
    clue3: 'It looks like a hard green shell shaped like a cocoon hanging from a branch.',
    clue4: 'This Pokémon can\'t even move — it just sits very still inside its hard shell waiting to evolve!',
    color: '#A8B820',
    moves: ['Tackle','StringShot','BugBite','Tackle'] },
  { id: 12, name: 'Butterfree', type: 'Bug', hp: 60, atk: 45, def: 50, spd: 70,
    clue2: 'It is found in sunny meadows and forests, fluttering from flower to flower.',
    clue3: 'It is a large white butterfly Pokémon with big compound eyes and purple wings.',
    clue4: 'This Pokémon can scatter sleep-inducing powder from its wings to make enemies sleepy!',
    color: '#A8B820',
    moves: ['BugBite','Gust','XScissor','PoisonSting'] },
  { id: 13, name: 'Weedle', type: 'Bug', hp: 40, atk: 35, def: 30, spd: 50,
    clue2: 'It is found in forests munching on leaves all day long.',
    clue3: 'It is a tiny yellow caterpillar with a big red nose and a sharp poison stinger on its head.',
    clue4: 'This Pokémon uses the stinger on its head to inject poison into anyone who bothers it!',
    color: '#A8B820',
    moves: ['PoisonSting','StringShot','BugBite','Tackle'] },
  { id: 14, name: 'Kakuna', type: 'Bug', hp: 45, atk: 25, def: 50, spd: 35,
    clue2: 'It is found hanging from trees in forests, pretending to be part of the tree.',
    clue3: 'It looks like a yellowish hard shell shaped like a hexagon, hanging very still.',
    clue4: 'This Pokémon can\'t do much but wait inside its hard shell — it\'s getting ready to evolve!',
    color: '#A8B820',
    moves: ['Tackle','PoisonSting','StringShot','Tackle'] },
  { id: 15, name: 'Beedrill', type: 'Bug', hp: 65, atk: 90, def: 40, spd: 75,
    clue2: 'It is found in forests and meadows in large swarms that protect their territory.',
    clue3: 'It is a large yellow bee Pokémon with two big stingers on its front legs and a tail stinger.',
    clue4: 'If you find this Pokémon\'s nest, run away fast — the whole swarm will attack at once!',
    color: '#A8B820',
    moves: ['PoisonSting','XScissor','PinMissile','BugBite'] },
  { id: 16, name: 'Pidgey', type: 'Flying', hp: 40, atk: 45, def: 40, spd: 56,
    clue2: 'It is found in forests, fields, and backyards everywhere.',
    clue3: 'It is a small brown bird Pokémon with cream feathers and a small pink beak.',
    clue4: 'This Pokémon is very docile and dislikes fighting, but will kick up sand to blind its enemies!',
    color: '#A890F0',
    moves: ['Gust','Tackle','WingAttack','Fly'] },
  { id: 17, name: 'Pidgeotto', type: 'Flying', hp: 63, atk: 60, def: 55, spd: 71,
    clue2: 'It is found in wide open forests and claims a large territory that it patrols.',
    clue3: 'It is a bigger bird Pokémon with a red and yellow feather crest and pink striped tail.',
    clue4: 'This Pokémon patrols a huge area to protect its nest and returns home every single day!',
    color: '#A890F0',
    moves: ['Gust','WingAttack','Fly','Tackle'] },
  { id: 18, name: 'Pidgeot', type: 'Flying', hp: 83, atk: 80, def: 75, spd: 101,
    clue2: 'It is found swooping over forests and fields in search of prey.',
    clue3: 'It is a large majestic bird Pokémon with a long golden feather crest and streamlined wings.',
    clue4: 'This Pokémon can fly at nearly twice the speed of sound when it dives down to catch prey!',
    color: '#A890F0',
    moves: ['Fly','WingAttack','Gust','HyperBeam'] },
  { id: 19, name: 'Rattata', type: 'Normal', hp: 30, atk: 56, def: 35, spd: 72,
    clue2: 'It is found in fields, forests, and near human buildings everywhere.',
    clue3: 'It is a small purple rat Pokémon with large front teeth and a long curled tail.',
    clue4: 'This Pokémon\'s front teeth never stop growing so it must constantly gnaw on things!',
    color: '#A8A878',
    moves: ['Tackle','Scratch','QuickAttack','Bite'] },
  { id: 20, name: 'Raticate', type: 'Normal', hp: 55, atk: 81, def: 60, spd: 97,
    clue2: 'It is found in fields and forests where it runs incredibly fast on its hind legs.',
    clue3: 'It is a larger brown rat Pokémon with huge sharp fangs and white whiskers.',
    clue4: 'This Pokémon\'s massive fangs can gnaw through anything — even iron bars can\'t stop them!',
    color: '#A8A878',
    moves: ['Bite','QuickAttack','HyperBeam','Tackle'] },
  { id: 21, name: 'Spearow', type: 'Flying', hp: 40, atk: 60, def: 30, spd: 70,
    clue2: 'It is found in open fields and grasslands, often in large flocks.',
    clue3: 'It is a small brown bird Pokémon with a big round head and a stubby red beak.',
    clue4: 'This Pokémon has very noisy cry that it uses to warn its flock of danger from far away!',
    color: '#A890F0',
    moves: ['Peck','Gust','Tackle','WingAttack'] },
  { id: 22, name: 'Fearow', type: 'Flying', hp: 65, atk: 90, def: 65, spd: 100,
    clue2: 'It is found swooping over vast plains and hunting in wide open spaces.',
    clue3: 'It is a large brown bird with a long pointed beak and wide brown wings.',
    clue4: 'This Pokémon can fly for an entire day without resting its wings once!',
    color: '#A890F0',
    moves: ['DrillPeck','Peck','Fly','HyperBeam'] },
  { id: 23, name: 'Ekans', type: 'Poison', hp: 35, atk: 60, def: 44, spd: 55,
    clue2: 'It is found in grassy plains and dry areas, slithering through the tall grass.',
    clue3: 'It is a purple snake Pokémon with yellow rings along its body and a yellow rattle.',
    clue4: 'This Pokémon can unhinge its jaw to swallow Pokémon eggs whole in one gulp!',
    color: '#A040A0',
    moves: ['PoisonSting','Wrap','Bite','Sludge'] },
  { id: 24, name: 'Arbok', type: 'Poison', hp: 60, atk: 85, def: 69, spd: 80,
    clue2: 'It is found in jungles and caves and is feared throughout the region.',
    clue3: 'It is a large purple cobra with a terrifying face pattern on its expanded hood.',
    clue4: 'The scary face pattern on this Pokémon\'s hood is different for each one, and there are six known patterns!',
    color: '#A040A0',
    moves: ['PoisonSting','Sludge','Bite','SludgeBomb'] },
  { id: 25, name: 'Pikachu', type: 'Electric', hp: 35, atk: 55, def: 40, spd: 90,
    clue2: 'It is found in forests and often lives with others of the same kind.',
    clue3: 'It has a yellow body with red cheeks and a lightning bolt-shaped tail.',
    clue4: 'This Pokémon stores electricity in its cheek pouches and can zap enemies with them!',
    color: '#F8D030',
    moves: ['ThunderShock','QuickAttack','Thunderbolt','Thunder'] },
  { id: 26, name: 'Raichu', type: 'Electric', hp: 60, atk: 90, def: 55, spd: 110,
    clue2: 'It is found in forests and fields, using its long tail to discharge electricity into the ground.',
    clue3: 'It is an orange mouse Pokémon with a long tail that has a lightning bolt shape at the end.',
    clue4: 'This Pokémon can build up so much electricity that touching it gives you a 10,000-volt shock!',
    color: '#F8D030',
    moves: ['ThunderShock','Thunderbolt','Thunder','QuickAttack'] },
  { id: 27, name: 'Sandshrew', type: 'Ground', hp: 50, atk: 75, def: 85, spd: 40,
    clue2: 'It is found in dry deserts and arid areas where it digs burrows to sleep in.',
    clue3: 'It is a small yellowish armadillo-like Pokémon that can curl into a tight ball.',
    clue4: 'When this Pokémon senses danger, it rolls into a spiky ball to protect its soft belly!',
    color: '#E0C068',
    moves: ['Scratch','Dig','Earthquake','Tackle'] },
  { id: 28, name: 'Sandslash', type: 'Ground', hp: 75, atk: 100, def: 110, spd: 65,
    clue2: 'It is found in sandy deserts and dry grasslands, leaving claw marks wherever it goes.',
    clue3: 'It is a bigger brown Pokémon covered in sharp spines on its back and has huge curved claws.',
    clue4: 'This Pokémon can curl into a spiked ball and roll into enemies at high speed!',
    color: '#E0C068',
    moves: ['Scratch','Earthquake','Dig','RockSlide'] },
  { id: 29, name: 'Nidoran-F', type: 'Poison', hp: 55, atk: 47, def: 52, spd: 41,
    clue2: 'It is found in open plains and grasslands, grazing and keeping its babies safe.',
    clue3: 'It is a small blue Pokémon that looks like a rabbit with whiskers and small spines on its back.',
    clue4: 'Even though it looks gentle, this Pokémon has poison in its tiny spines that can make you very sick!',
    color: '#A040A0',
    moves: ['PoisonSting','Tackle','Scratch','Sludge'] },
  { id: 30, name: 'Nidorina', type: 'Poison', hp: 70, atk: 62, def: 67, spd: 56,
    clue2: 'It is found in grasslands and safe meadows where it raises its young.',
    clue3: 'It is a medium-sized blue Pokémon with pointed ears and harder spines on its back.',
    clue4: 'This Pokémon is very protective of its babies and becomes extremely fierce if they are threatened!',
    color: '#A040A0',
    moves: ['PoisonSting','Bite','Sludge','Tackle'] },
  { id: 31, name: 'Nidoqueen', type: 'Poison', hp: 90, atk: 92, def: 87, spd: 76,
    clue2: 'It is found in rugged terrain and deserts where it protects its underground nest.',
    clue3: 'It is a large blue dinosaur-like Pokémon covered in hard scales and sharp spines.',
    clue4: 'This Pokémon\'s body is covered in hard scales that are like armor — almost nothing can hurt it!',
    color: '#A040A0',
    moves: ['Earthquake','SludgeBomb','Tackle','BodySlam'] },
  { id: 32, name: 'Nidoran-M', type: 'Poison', hp: 46, atk: 57, def: 40, spd: 50,
    clue2: 'It is found in open plains, always alert and ready to charge at threats.',
    clue3: 'It is a small purple Pokémon that looks like a rabbit with a big pointed horn on its head.',
    clue4: 'This Pokémon\'s larger horn has more poison than a female\'s — even a tiny scratch can hurt!',
    color: '#A040A0',
    moves: ['PoisonSting','Tackle','Scratch','Sludge'] },
  { id: 33, name: 'Nidorino', type: 'Poison', hp: 61, atk: 72, def: 57, spd: 65,
    clue2: 'It is found in grasslands and savannas roaming aggressively.',
    clue3: 'It is a medium-sized purple Pokémon with a large poisonous horn and strong legs.',
    clue4: 'This Pokémon loves to battle and will charge headfirst at any challenger it meets!',
    color: '#A040A0',
    moves: ['PoisonSting','Bite','Sludge','Tackle'] },
  { id: 34, name: 'Nidoking', type: 'Poison', hp: 81, atk: 102, def: 77, spd: 85,
    clue2: 'It is found in harsh rocky terrain and dominates its territory like a king.',
    clue3: 'It is a large purple dinosaur Pokémon with a long spiked tail and a powerful horn.',
    clue4: 'This Pokémon can swing its huge thick tail to topple whole towers — it\'s incredibly strong!',
    color: '#A040A0',
    moves: ['Earthquake','SludgeBomb','MegaPunch','HyperBeam'] },
  { id: 35, name: 'Clefairy', type: 'Normal', hp: 70, atk: 45, def: 48, spd: 35,
    clue2: 'It is found on mountains under the moonlight, dancing on clear nights.',
    clue3: 'It is a small pink round Pokémon with little wings, pointed ears, and a cute curled tail.',
    clue4: 'On nights with a full moon, this Pokémon gather together and dance in a big group!',
    color: '#A8A878',
    moves: ['Tackle','MegaPunch','BodySlam','Tackle'] },
  { id: 36, name: 'Clefable', type: 'Normal', hp: 95, atk: 70, def: 73, spd: 60,
    clue2: 'It is found in mountains and has very sharp hearing to sense even the tiniest sound.',
    clue3: 'It is a taller pink Pokémon with big pointy ears, small fairy wings, and a long curled tail.',
    clue4: 'This Pokémon can hear sounds from far over a mile away with its amazing ears!',
    color: '#A8A878',
    moves: ['BodySlam','MegaPunch','HyperBeam','Tackle'] },
  { id: 37, name: 'Vulpix', type: 'Fire', hp: 38, atk: 41, def: 40, spd: 65,
    clue2: 'It is found on grassy hillsides and is known for being elegant.',
    clue3: 'It is a small orange fox Pokémon with curly red tails and a curled hair tuft.',
    clue4: 'This Pokémon has six beautiful tails that grew from one tail as it got older!',
    color: '#F08030',
    moves: ['Ember','Tackle','FireSpin','Flamethrower'] },
  { id: 38, name: 'Ninetales', type: 'Fire', hp: 73, atk: 76, def: 75, spd: 100,
    clue2: 'It is found deep in majestic forests and is believed to be a mystical creature.',
    clue3: 'It is a beautiful golden fox Pokémon with nine long, flowing white tails.',
    clue4: 'This Pokémon is said to live for 1,000 years and holds a grudge forever against anyone who grabs its tails!',
    color: '#F08030',
    moves: ['Flamethrower','FireBlast','Ember','HyperBeam'] },
  { id: 39, name: 'Jigglypuff', type: 'Normal', hp: 115, atk: 45, def: 20, spd: 20,
    clue2: 'It is found in meadows and loves to sing to everyone it meets.',
    clue3: 'It is a round, pink Pokémon with big blue eyes and tiny arms.',
    clue4: 'When this Pokémon sings its lullaby, everyone nearby falls asleep!',
    color: '#A8A878',
    moves: ['Tackle','BodySlam','Slam','HyperBeam'] },
  { id: 40, name: 'Wigglytuff', type: 'Normal', hp: 140, atk: 70, def: 45, spd: 45,
    clue2: 'It is found in warm meadows and attracts Pokémon with its beautiful fur.',
    clue3: 'It is a large fluffy pink Pokémon with huge blue eyes and a curled bit of hair on top.',
    clue4: 'This Pokémon\'s super stretchy body can puff up to an enormous size when it takes a deep breath!',
    color: '#A8A878',
    moves: ['BodySlam','HyperBeam','Slam','Tackle'] },
  { id: 41, name: 'Zubat', type: 'Flying', hp: 40, atk: 45, def: 35, spd: 55,
    clue2: 'It is found in dark caves and only comes out at night.',
    clue3: 'It is a small blue bat Pokémon with big fangs, no eyes, and large purple wings.',
    clue4: 'This Pokémon has no eyes at all but uses ultrasonic waves to navigate in the dark!',
    color: '#A890F0',
    moves: ['Gust','WingAttack','Bite','PoisonSting'] },
  { id: 42, name: 'Golbat', type: 'Flying', hp: 75, atk: 80, def: 70, spd: 90,
    clue2: 'It is found in dark caves and hunts in the night skies draining blood from victims.',
    clue3: 'It is a large blue bat Pokémon with a gigantic mouth, four fangs, and beady red eyes.',
    clue4: 'This Pokémon can drink a pint of blood in under a minute and sometimes drinks so much it can\'t fly!',
    color: '#A890F0',
    moves: ['Gust','WingAttack','Bite','SludgeBomb'] },
  { id: 43, name: 'Oddish', type: 'Grass', hp: 45, atk: 50, def: 55, spd: 30,
    clue2: 'It is found in grassy fields and spends most of the day buried in the ground.',
    clue3: 'It is a small round blue Pokémon with big red eyes and a bunch of leaves on top.',
    clue4: 'This Pokémon wanders around at night scattering its seeds, then buries itself before sunrise!',
    color: '#78C850',
    moves: ['VineWhip','PoisonSting','RazorLeaf','Acid'] },
  { id: 44, name: 'Gloom', type: 'Grass', hp: 60, atk: 65, def: 70, spd: 40,
    clue2: 'It is found in grasslands and damp forests, dripping with a horrible smelling liquid.',
    clue3: 'It is a blue Pokémon with a large flower on its head that always droops and drips slime.',
    clue4: 'This Pokémon\'s flower smells absolutely terrible — it uses the awful stench to drive away enemies!',
    color: '#78C850',
    moves: ['VineWhip','Acid','SolarBeam','PoisonSting'] },
  { id: 45, name: 'Vileplume', type: 'Grass', hp: 75, atk: 80, def: 85, spd: 50,
    clue2: 'It is found in tropical forests where its massive flower petals release clouds of pollen.',
    clue3: 'It is a blue Pokémon with tiny legs and an enormous red flower with white spots on its head.',
    clue4: 'This Pokémon has the largest flower petals of any Pokémon, and its pollen causes terrible sneezing!',
    color: '#78C850',
    moves: ['PetalDance','SolarBeam','Acid','MegaDrain'] },
  { id: 46, name: 'Paras', type: 'Bug', hp: 35, atk: 70, def: 55, spd: 25,
    clue2: 'It is found in damp forests and underground caves near tree roots.',
    clue3: 'It is a small orange crab-like Pokémon with mushrooms growing on its back.',
    clue4: 'The mushrooms on this Pokémon\'s back are actually controlling it — the mushrooms are the real boss!',
    color: '#A8B820',
    moves: ['BugBite','Scratch','XScissor','SolarBeam'] },
  { id: 47, name: 'Parasect', type: 'Bug', hp: 60, atk: 95, def: 80, spd: 30,
    clue2: 'It is found in dark damp forests where it creates giant mushroom patches.',
    clue3: 'It is a bigger orange crab Pokémon with a massive mushroom that has completely taken over its head.',
    clue4: 'This Pokémon\'s body is completely controlled by the giant mushroom — it\'s basically a zombie bug!',
    color: '#A8B820',
    moves: ['BugBite','XScissor','MegaDrain','PoisonSting'] },
  { id: 48, name: 'Venonat', type: 'Bug', hp: 60, atk: 55, def: 50, spd: 45,
    clue2: 'It is found in dark forests and comes out at night, drawn to bright lights.',
    clue3: 'It is a round purple furry Pokémon with huge red compound eyes and small fangs.',
    clue4: 'This Pokémon\'s huge eyes work like radar to see in complete darkness!',
    color: '#A8B820',
    moves: ['BugBite','PoisonSting','Tackle','Confusion'] },
  { id: 49, name: 'Venomoth', type: 'Bug', hp: 70, atk: 65, def: 60, spd: 90,
    clue2: 'It is found in forests at night, fluttering around lights and spreading powder.',
    clue3: 'It is a large grey moth Pokémon with big purple-spotted wings and compound eyes.',
    clue4: 'This Pokémon scatters poisonous scales from its wings that cause numbness on contact!',
    color: '#A8B820',
    moves: ['BugBite','PoisonSting','Gust','XScissor'] },
  { id: 50, name: 'Diglett', type: 'Ground', hp: 10, atk: 55, def: 25, spd: 95,
    clue2: 'It is found in underground tunnels and loose soil, always digging.',
    clue3: 'It is a tiny brown Pokémon with a pink nose that is almost always underground.',
    clue4: 'This Pokémon lives underground and nobody has ever seen what the bottom of its body looks like!',
    color: '#E0C068',
    moves: ['Dig','Tackle','Earthquake','Scratch'] },
  { id: 51, name: 'Dugtrio', type: 'Ground', hp: 35, atk: 100, def: 50, spd: 120,
    clue2: 'It is found in dry areas and deserts where it causes earthquakes by tunneling deep underground.',
    clue3: 'It looks like three little moles side by side sticking out of the ground.',
    clue4: 'This Pokémon can dig down over 60 miles underground, causing earthquakes on the surface!',
    color: '#E0C068',
    moves: ['Dig','Earthquake','Scratch','Tackle'] },
  { id: 52, name: 'Meowth', type: 'Normal', hp: 40, atk: 45, def: 35, spd: 90,
    clue2: 'It is often found near human towns and loves shiny objects.',
    clue3: 'It looks like a small cream cat with a golden coin on its forehead.',
    clue4: 'This Pokémon walks around at night looking for coins to collect for its hoard!',
    color: '#A8A878',
    moves: ['Scratch','Tackle','QuickAttack','Bite'] },
  { id: 53, name: 'Persian', type: 'Normal', hp: 65, atk: 70, def: 60, spd: 115,
    clue2: 'It is found near wealthy human towns, known for being elegant and graceful.',
    clue3: 'It is a sleek cream-colored cat Pokémon with a red jewel on its forehead and fierce eyes.',
    clue4: 'This Pokémon may look graceful but it has a very foul temper and will scratch without warning!',
    color: '#A8A878',
    moves: ['Scratch','QuickAttack','Bite','HyperBeam'] },
  { id: 54, name: 'Psyduck', type: 'Water', hp: 50, atk: 52, def: 48, spd: 55,
    clue2: 'It is always found near rivers and lakes, holding its aching head.',
    clue3: 'It is a yellow duck-like Pokémon that always looks confused and frustrated.',
    clue4: 'This Pokémon gets terrible headaches, and when the pain peaks it suddenly gains psychic powers!',
    color: '#6890F0',
    moves: ['WaterGun','Confusion','Scratch','Surf'] },
  { id: 55, name: 'Golduck', type: 'Water', hp: 80, atk: 82, def: 78, spd: 85,
    clue2: 'It is found in rivers and lakes, gracefully gliding through the water faster than any human.',
    clue3: 'It is a sleek blue duck Pokémon with a red gem on its forehead and webbed hands.',
    clue4: 'This Pokémon is an incredibly fast swimmer — it uses its webbed hands and feet like flippers!',
    color: '#6890F0',
    moves: ['Surf','WaterGun','Confusion','Hydropump'] },
  { id: 56, name: 'Mankey', type: 'Fighting', hp: 40, atk: 80, def: 35, spd: 70,
    clue2: 'It is found in mountain forests where it lives in groups and gets into lots of fights.',
    clue3: 'It is a small white monkey Pokémon with a pig snout, big nostrils, and an angry face.',
    clue4: 'This Pokémon gets angry over nothing and once it starts, it keeps raging for a very long time!',
    color: '#C03028',
    moves: ['KarateChop','Scratch','Tackle','Submission'] },
  { id: 57, name: 'Primeape', type: 'Fighting', hp: 65, atk: 105, def: 60, spd: 95,
    clue2: 'It is found in mountain jungles and cannot be calmed once it starts fighting.',
    clue3: 'It is a larger angry-looking Pokémon with a round white face and metal bands on its limbs.',
    clue4: 'This Pokémon never stops being angry — it will chase its enemies for days without giving up!',
    color: '#C03028',
    moves: ['KarateChop','Submission','HyperBeam','Tackle'] },
  { id: 58, name: 'Growlithe', type: 'Fire', hp: 55, atk: 70, def: 45, spd: 60,
    clue2: 'It is loyal like a dog and stays close to protect its trainer.',
    clue3: 'It looks like a small orange puppy with black stripes.',
    clue4: 'This Pokémon is so loyal that it will bark and bite to keep enemies away from its trainer!',
    color: '#F08030',
    moves: ['Ember','Tackle','Flamethrower','Bite'] },
  { id: 59, name: 'Arcanine', type: 'Fire', hp: 90, atk: 110, def: 80, spd: 95,
    clue2: 'It is found in hot grasslands running across vast distances at incredible speed.',
    clue3: 'It is a large magnificent dog Pokémon with orange and cream fur and a flowing mane.',
    clue4: 'This Pokémon can run over 6,000 miles in a single day — it\'s called the legendary Pokémon!',
    color: '#F08030',
    moves: ['Flamethrower','FireBlast','Bite','HyperBeam'] },
  { id: 60, name: 'Poliwag', type: 'Water', hp: 40, atk: 50, def: 40, spd: 90,
    clue2: 'It is found in freshwater ponds and lakes, always swimming around.',
    clue3: 'It is a round blue Pokémon with a swirly pattern on its belly and a curly tail.',
    clue4: 'The spiral on this Pokémon\'s belly is actually its internal organs showing through thin skin!',
    color: '#6890F0',
    moves: ['WaterGun','Bubble','Surf','BodySlam'] },
  { id: 61, name: 'Poliwhirl', type: 'Water', hp: 65, atk: 65, def: 65, spd: 90,
    clue2: 'It is found in rivers and lakes and is often seen wrestling near the water.',
    clue3: 'It is a blue tadpole Pokémon with arms, a swirly belly and big white eyes.',
    clue4: 'This Pokémon\'s swirling belly pattern can mesmerize enemies that stare at it too long!',
    color: '#6890F0',
    moves: ['WaterGun','Surf','BodySlam','Bubble'] },
  { id: 62, name: 'Poliwrath', type: 'Water', hp: 90, atk: 95, def: 95, spd: 70,
    clue2: 'It is found in large oceans and lakes where it swims vast distances with ease.',
    clue3: 'It is a big blue muscular Pokémon with a swirly belly pattern and huge strong arms.',
    clue4: 'This Pokémon has such powerful arm muscles that it can swim through any ocean current!',
    color: '#6890F0',
    moves: ['Surf','KarateChop','Submission','HyperBeam'] },
  { id: 63, name: 'Abra', type: 'Psychic', hp: 25, atk: 20, def: 15, spd: 90,
    clue2: 'It is found in cities and towns and always seems to be asleep.',
    clue3: 'It is a yellow humanoid Pokémon that always has its eyes shut and holds a spoon.',
    clue4: 'This Pokémon sleeps 18 hours a day because using its psychic powers drains all its energy!',
    color: '#F85888',
    moves: ['Confusion','Tackle','PsychicMove','Headbutt'] },
  { id: 64, name: 'Kadabra', type: 'Psychic', hp: 40, atk: 35, def: 30, spd: 105,
    clue2: 'It is found near cities and broadcasts strange signals that disrupt electronic devices.',
    clue3: 'It is a tall yellow Pokémon with a big drooping mustache and holds a bent spoon.',
    clue4: 'This Pokémon emits so much psychic power that it makes TV sets go haywire and compasses spin!',
    color: '#F85888',
    moves: ['Confusion','PsychicMove','Amnesia','Tackle'] },
  { id: 65, name: 'Alakazam', type: 'Psychic', hp: 55, atk: 50, def: 45, spd: 120,
    clue2: 'It is said to exist where great human wisdom is found, studying and thinking always.',
    clue3: 'It is a tall yellow Pokémon with a large mustache, sharp star on its forehead, and holds two spoons.',
    clue4: 'This Pokémon\'s brain never stops growing — it can recall every single event in its entire life!',
    color: '#F85888',
    moves: ['PsychicMove','Confusion','Amnesia','HyperBeam'] },
  { id: 66, name: 'Machop', type: 'Fighting', hp: 70, atk: 80, def: 50, spd: 35,
    clue2: 'It is found in mountains where it trains by lifting heavy rocks.',
    clue3: 'It is a small blue Pokémon with big muscles and three ridges on its head.',
    clue4: 'This Pokémon trains all day by carrying and throwing boulders to build its strength!',
    color: '#C03028',
    moves: ['KarateChop','Tackle','Submission','BodySlam'] },
  { id: 67, name: 'Machoke', type: 'Fighting', hp: 80, atk: 100, def: 70, spd: 45,
    clue2: 'It is found in mountains and cities where it helps people with heavy lifting jobs.',
    clue3: 'It is a large blue muscular Pokémon that wears a power-saving belt around its waist.',
    clue4: 'This Pokémon is so strong that it has to wear a special belt to hold back its incredible power!',
    color: '#C03028',
    moves: ['KarateChop','Submission','BodySlam','SeismicToss'] },
  { id: 68, name: 'Machamp', type: 'Fighting', hp: 90, atk: 130, def: 80, spd: 55,
    clue2: 'It is found near mountains and loves to challenge anyone to a test of strength.',
    clue3: 'It is a massive blue Pokémon with four huge arms and belt around its waist.',
    clue4: 'This Pokémon can punch 1,000 times in two seconds using all four of its arms at once!',
    color: '#C03028',
    moves: ['Submission','KarateChop','SeismicToss','HyperBeam'] },
  { id: 69, name: 'Bellsprout', type: 'Grass', hp: 50, atk: 75, def: 35, spd: 40,
    clue2: 'It is found in warm humid jungles and meadows where it roots into the ground.',
    clue3: 'It is a tiny yellow plant Pokémon with a round head, two leaves for arms, and a vine body.',
    clue4: 'This Pokémon\'s skinny body is so flexible it can bend in any direction to dodge attacks!',
    color: '#78C850',
    moves: ['VineWhip','PoisonSting','RazorLeaf','Acid'] },
  { id: 70, name: 'Weepinbell', type: 'Grass', hp: 65, atk: 90, def: 50, spd: 55,
    clue2: 'It is found in tropical forests and jungles, dangling from tree branches.',
    clue3: 'It is a round yellow bell-shaped Pokémon with a hooked top, big mouth, and two leaf arms.',
    clue4: 'This Pokémon sprays acid powerful enough to dissolve anything it catches in its mouth!',
    color: '#78C850',
    moves: ['VineWhip','Acid','RazorLeaf','PoisonSting'] },
  { id: 71, name: 'Victreebel', type: 'Grass', hp: 80, atk: 105, def: 65, spd: 70,
    clue2: 'It is found deep in tropical jungles luring prey into its huge mouth with a sweet scent.',
    clue3: 'It is a large yellow pitcher plant Pokémon with a huge gaping mouth and a vine whip.',
    clue4: 'This Pokémon lures in prey with a sweet smell then dissolves them in its stomach acid!',
    color: '#78C850',
    moves: ['SolarBeam','Acid','RazorLeaf','PetalDance'] },
  { id: 72, name: 'Tentacool', type: 'Water', hp: 40, atk: 40, def: 35, spd: 70,
    clue2: 'It is found in warm shallow ocean waters near beaches and coral reefs.',
    clue3: 'It is a transparent blue jellyfish Pokémon with two red spheres on top and long tentacles.',
    clue4: 'This Pokémon\'s body is 99% water — if you take it out of the sea it shrivels up almost instantly!',
    color: '#6890F0',
    moves: ['WaterGun','PoisonSting','Acid','Bubble'] },
  { id: 73, name: 'Tentacruel', type: 'Water', hp: 80, atk: 70, def: 65, spd: 100,
    clue2: 'It is found in deep open oceans where it hunts with its many long tentacles.',
    clue3: 'It is a large blue jellyfish Pokémon with 80 tentacles that glow red at the tips.',
    clue4: 'This Pokémon has up to 80 tentacles and can expand them all at once to trap prey!',
    color: '#6890F0',
    moves: ['Surf','PoisonSting','SludgeBomb','Hydropump'] },
  { id: 74, name: 'Geodude', type: 'Rock', hp: 40, atk: 80, def: 100, spd: 20,
    clue2: 'It is found on rocky mountain paths and blends in perfectly with boulders.',
    clue3: 'It looks like a round grey rock with two arms and a face.',
    clue4: 'This Pokémon is often mistaken for a plain rock by hikers who accidentally step on them!',
    color: '#B8A038',
    moves: ['RockThrow','Tackle','RockSlide','Earthquake'] },
  { id: 75, name: 'Graveler', type: 'Rock', hp: 55, atk: 95, def: 115, spd: 35,
    clue2: 'It is found on steep mountain slopes and loves to roll down them at high speed.',
    clue3: 'It is a large round boulder Pokémon with four stubby arms and a craggy face.',
    clue4: 'This Pokémon rolls down mountain slopes to travel and crushes everything in its path!',
    color: '#B8A038',
    moves: ['RockThrow','RockSlide','Earthquake','Tackle'] },
  { id: 76, name: 'Golem', type: 'Rock', hp: 80, atk: 120, def: 130, spd: 45,
    clue2: 'It is found on rocky mountains where it sheds its outer shell every year.',
    clue3: 'It is a huge round boulder Pokémon with a hard rocky shell and short strong legs.',
    clue4: 'Every year this Pokémon sheds its old shell — the empty shells left behind become hollow boulders!',
    color: '#B8A038',
    moves: ['Earthquake','RockSlide','RockThrow','SelfDestruct'] },
  { id: 77, name: 'Ponyta', type: 'Fire', hp: 50, atk: 85, def: 55, spd: 90,
    clue2: 'It is found in meadows and open fields where it runs and leaps at incredible speed.',
    clue3: 'It is a white horse Pokémon with a blazing orange and yellow mane and tail made of fire.',
    clue4: 'This Pokémon\'s hooves are ten times harder than diamond and can trample anything flat!',
    color: '#F08030',
    moves: ['Ember','Tackle','FireSpin','Flamethrower'] },
  { id: 78, name: 'Rapidash', type: 'Fire', hp: 65, atk: 100, def: 70, spd: 105,
    clue2: 'It is found racing across open plains and plateaus, running faster than anything.',
    clue3: 'It is a sleek white horse Pokémon with a blazing full-body fire mane and spiraling horn.',
    clue4: 'This Pokémon can gallop at 150 mph and loves to race anything it sees just for the fun of it!',
    color: '#F08030',
    moves: ['Flamethrower','FireBlast','Ember','HyperBeam'] },
  { id: 79, name: 'Slowpoke', type: 'Water', hp: 90, atk: 65, def: 65, spd: 15,
    clue2: 'It is found lazily dozing by rivers and lakes, dangling its tail in the water.',
    clue3: 'It is a large pink hippopotamus-like Pokémon that always has a blank expression.',
    clue4: 'This Pokémon is so incredibly slow that it takes 5 seconds for it to feel pain after being hurt!',
    color: '#6890F0',
    moves: ['WaterGun','Tackle','Confusion','Surf'] },
  { id: 80, name: 'Slowbro', type: 'Water', hp: 95, atk: 75, def: 110, spd: 30,
    clue2: 'It is found on shorelines where it wanders slowly with a shell Pokémon clamped on its tail.',
    clue3: 'It is a large pink Pokémon with a shell creature permanently attached to its tail like a bracelet.',
    clue4: 'A shell creature bit this Pokémon\'s tail and can\'t let go — somehow this made it smarter!',
    color: '#6890F0',
    moves: ['Surf','Confusion','WaterGun','PsychicMove'] },
  { id: 81, name: 'Magnemite', type: 'Electric', hp: 25, atk: 35, def: 70, spd: 45,
    clue2: 'It is found near power plants and electrical facilities, floating in the air.',
    clue3: 'It is a tiny grey sphere with a single eye, two horseshoe magnets on its sides and screws.',
    clue4: 'This Pokémon floats using anti-gravity generated by its magnets and absorbs electricity to survive!',
    color: '#F8D030',
    moves: ['ThunderShock','Thunderbolt','Tackle','Thunder'] },
  { id: 82, name: 'Magneton', type: 'Electric', hp: 50, atk: 60, def: 95, spd: 70,
    clue2: 'It is found near power plants where it causes electrical interference.',
    clue3: 'It looks like three magnet creatures joined together in a triangle pattern.',
    clue4: 'When three of its pre-evolutions merge together, the resulting magnetic field is three times stronger!',
    color: '#F8D030',
    moves: ['Thunderbolt','Thunder','ThunderShock','HyperBeam'] },
  { id: 83, name: 'Farfetch\'d', type: 'Flying', hp: 52, atk: 65, def: 55, spd: 60,
    clue2: 'It is found near ponds and rivers, always carrying a stick wherever it goes.',
    clue3: 'It is a brown duck Pokémon with a V-shaped mark on its face and always carries a green leek stalk.',
    clue4: 'This Pokémon would rather fight for its leek stalk than for anything else in the world!',
    color: '#A890F0',
    moves: ['Peck','WingAttack','Gust','Fly'] },
  { id: 84, name: 'Doduo', type: 'Flying', hp: 35, atk: 85, def: 45, spd: 75,
    clue2: 'It is found in flat open grasslands where it runs rather than flies.',
    clue3: 'It looks like a brown Pokémon with two long necks each topped with a small round head.',
    clue4: 'This Pokémon\'s two heads think independently — they take turns sleeping so one is always alert!',
    color: '#A890F0',
    moves: ['Peck','Tackle','DrillPeck','Headbutt'] },
  { id: 85, name: 'Dodrio', type: 'Flying', hp: 60, atk: 110, def: 70, spd: 110,
    clue2: 'It is found in wide open plains, running faster than any bird can fly.',
    clue3: 'It is a large brown bird Pokémon with three separate long necks and three heads.',
    clue4: 'This Pokémon\'s three heads each have different feelings — one is always happy, sad, and angry!',
    color: '#A890F0',
    moves: ['DrillPeck','Peck','HyperBeam','Tackle'] },
  { id: 86, name: 'Seel', type: 'Water', hp: 65, atk: 45, def: 55, spd: 45,
    clue2: 'It is found in frigid arctic seas and loves swimming in icy cold water.',
    clue3: 'It is a white seal-like Pokémon with a round head, big round eyes, and a horn on its forehead.',
    clue4: 'This Pokémon loves swimming in freezing cold water and actually feels more energetic the colder it gets!',
    color: '#6890F0',
    moves: ['WaterGun','Bubble','IceBeam','Headbutt'] },
  { id: 87, name: 'Dewgong', type: 'Water', hp: 90, atk: 70, def: 80, spd: 70,
    clue2: 'It is found swimming gracefully in icy cold seas and often sleeps on ice floes.',
    clue3: 'It is a large beautiful white seal-like Pokémon with a long pointed horn and flippers.',
    clue4: 'This Pokémon can swim all night in the coldest ocean waters without getting tired at all!',
    color: '#6890F0',
    moves: ['Surf','IceBeam','AuroraBeam','Headbutt'] },
  { id: 88, name: 'Grimer', type: 'Poison', hp: 80, atk: 80, def: 50, spd: 25,
    clue2: 'It is found in gutters and sewers, thriving in the most disgusting environments.',
    clue3: 'It is a large purple blob of sludge with two round eyes and a wide grinning mouth.',
    clue4: 'This Pokémon is made entirely of toxic sludge that kills every plant it touches!',
    color: '#A040A0',
    moves: ['PoisonSting','Sludge','Acid','SludgeBomb'] },
  { id: 89, name: 'Muk', type: 'Poison', hp: 105, atk: 105, def: 75, spd: 50,
    clue2: 'It is found in industrial areas and polluted rivers, spreading toxic waste.',
    clue3: 'It is a huge purple sludge Pokémon with a gaping wide mouth and dripping slime everywhere.',
    clue4: 'Just touching this Pokémon causes terrible illness — the slime it drips is incredibly toxic!',
    color: '#A040A0',
    moves: ['Sludge','SludgeBomb','Acid','HyperBeam'] },
  { id: 90, name: 'Shellder', type: 'Water', hp: 30, atk: 65, def: 100, spd: 40,
    clue2: 'It is found in ocean waters hiding in rocky tide pools along the shore.',
    clue3: 'It looks like a purple scallop shell with a big pink tongue sticking out and two eyes.',
    clue4: 'This Pokémon can squirt water up to 65 feet away using the muscle inside its shell!',
    color: '#6890F0',
    moves: ['WaterGun','Bubble','IceBeam','Tackle'] },
  { id: 91, name: 'Cloyster', type: 'Water', hp: 50, atk: 95, def: 180, spd: 70,
    clue2: 'It is found in cold ocean waters where its thick shell makes it almost indestructible.',
    clue3: 'It is a dark grey spiky shell Pokémon with a pearl inside it and a ghostly white face.',
    clue4: 'This Pokémon\'s shell is so hard that even a bomb blast can\'t crack it open — nothing gets through!',
    color: '#6890F0',
    moves: ['Surf','IceBeam','Blizzard','WaterGun'] },
  { id: 92, name: 'Gastly', type: 'Ghost', hp: 30, atk: 35, def: 30, spd: 80,
    clue2: 'It floats around haunted places and old buildings searching for mischief.',
    clue3: 'It is a purple round shape made entirely of poisonous gas with a creepy grin.',
    clue4: 'This Pokémon surrounds itself with poisonous gas that can make people faint instantly!',
    color: '#705898',
    moves: ['Lick','NightShade','ShadowBall','Sludge'] },
  { id: 93, name: 'Haunter', type: 'Ghost', hp: 45, atk: 50, def: 45, spd: 95,
    clue2: 'It lurks in the darkest corners and moves through walls in old abandoned buildings.',
    clue3: 'It is a disembodied purple head with spike-like fingers, a long curling tongue, and glowing eyes.',
    clue4: 'This Pokémon licks you with its ghostly tongue to steal your life energy away!',
    color: '#705898',
    moves: ['Lick','ShadowBall','NightShade','DreamEater'] },
  { id: 94, name: 'Gengar', type: 'Ghost', hp: 60, atk: 65, def: 60, spd: 110,
    clue2: 'It is found in dark shadows and old buildings at night.',
    clue3: 'It is a round purple Pokémon with a wicked grin, spiky back, and red glowing eyes.',
    clue4: 'This Pokémon hides in shadows and lowers the temperature of a room when it appears!',
    color: '#705898',
    moves: ['ShadowBall','DreamEater','Lick','NightShade'] },
  { id: 95, name: 'Onix', type: 'Rock', hp: 35, atk: 45, def: 160, spd: 70,
    clue2: 'It tunnels through the ground under mountains creating paths underground.',
    clue3: 'It looks like a long chain of giant grey boulders with a horn on its head.',
    clue4: 'This Pokémon can burrow through the earth at 50 mph and causes tremors as it moves!',
    color: '#B8A038',
    moves: ['RockThrow','RockSlide','Earthquake','Tackle'] },
  { id: 96, name: 'Drowzee', type: 'Psychic', hp: 60, atk: 48, def: 45, spd: 42,
    clue2: 'It is found in cities and towns, sneaking up on sleeping people.',
    clue3: 'It is a large yellow tapir-like Pokémon with a long striped snout and hunched posture.',
    clue4: 'This Pokémon puts people to sleep with hypnosis then eats their dreams for dinner!',
    color: '#F85888',
    moves: ['Confusion','PsychicMove','Headbutt','Tackle'] },
  { id: 97, name: 'Hypno', type: 'Psychic', hp: 85, atk: 73, def: 70, spd: 67,
    clue2: 'It is found near human towns, swinging its pendulum to hypnotize anyone passing by.',
    clue3: 'It is a tall yellow Pokémon with a long striped snout, and always swings a pendulum.',
    clue4: 'This Pokémon swings its pendulum to hypnotize enemies and then eats their pleasant dreams!',
    color: '#F85888',
    moves: ['PsychicMove','Confusion','DreamEater','HyperBeam'] },
  { id: 98, name: 'Krabby', type: 'Water', hp: 30, atk: 105, def: 90, spd: 50,
    clue2: 'It is found on rocky beaches and sandy sea shores, hiding in burrows in the sand.',
    clue3: 'It is a small red crab Pokémon with one oversized claw and one tiny one.',
    clue4: 'This Pokémon\'s large claw is so powerful that even one good pinch can crush a tree branch!',
    color: '#6890F0',
    moves: ['WaterGun','Bubble','Tackle','Surf'] },
  { id: 99, name: 'Kingler', type: 'Water', hp: 55, atk: 130, def: 115, spd: 75,
    clue2: 'It is found in ocean shallows and beaches where its giant claw dominates everything.',
    clue3: 'It is a big red crab Pokémon with one enormous heavy claw that is half its body size.',
    clue4: 'This Pokémon\'s huge claw is so heavy that it drags its body sideways when it walks!',
    color: '#6890F0',
    moves: ['WaterGun','Surf','Tackle','HyperBeam'] },
  { id: 100, name: 'Voltorb', type: 'Electric', hp: 40, atk: 30, def: 50, spd: 100,
    clue2: 'It is found near power plants and frequently found rolling around electrical facilities.',
    clue3: 'It looks exactly like a Poké Ball — a perfect white sphere with a red top — but with eyes.',
    clue4: 'This Pokémon was first found in a factory that made Poké Balls and nobody knows how it got there!',
    color: '#F8D030',
    moves: ['ThunderShock','Thunderbolt','Tackle','SelfDestruct'] },
  { id: 101, name: 'Electrode', type: 'Electric', hp: 60, atk: 50, def: 70, spd: 140,
    clue2: 'It is found in power plants where it absorbs so much electricity it explodes sometimes.',
    clue3: 'It looks like a Poké Ball upside down — white on the bottom and red on top — with glowing eyes.',
    clue4: 'This Pokémon is one of the fastest Pokémon ever — and it explodes to go even faster!',
    color: '#F8D030',
    moves: ['ThunderShock','Thunderbolt','Thunder','Explosion'] },
  { id: 102, name: 'Exeggcute', type: 'Grass', hp: 60, atk: 40, def: 80, spd: 40,
    clue2: 'It is found in lush tropical forests, rolling around in groups on the forest floor.',
    clue3: 'It looks like a cluster of six eggs huddled together with faces and some cracked shells.',
    clue4: 'This Pokémon may look like eggs but they are actually plant seeds that share one brain!',
    color: '#78C850',
    moves: ['Tackle','SolarBeam','Confusion','MegaDrain'] },
  { id: 103, name: 'Exeggutor', type: 'Grass', hp: 95, atk: 95, def: 85, spd: 55,
    clue2: 'It is found in tropical jungles and grows taller every time its heads multiply.',
    clue3: 'It is a tall palm tree Pokémon with three or more different egg-shaped heads on top.',
    clue4: 'Each of this Pokémon\'s heads has a different personality and they sometimes argue with each other!',
    color: '#78C850',
    moves: ['SolarBeam','PsychicMove','Confusion','PetalDance'] },
  { id: 104, name: 'Cubone', type: 'Ground', hp: 50, atk: 50, def: 95, spd: 35,
    clue2: 'It lives in caves and dry deserts, always alone and lonely.',
    clue3: 'It is a small brown Pokémon that always wears the skull of its mother on its head.',
    clue4: 'This Pokémon wears its mother\'s skull on its head and cries every night missing her!',
    color: '#E0C068',
    moves: ['Dig','Tackle','Earthquake','Bonemerang'] },
  { id: 105, name: 'Marowak', type: 'Ground', hp: 60, atk: 80, def: 110, spd: 45,
    clue2: 'It is found in arid rocky areas and is a fierce warrior who fights with a bone club.',
    clue3: 'It is a brownish Pokémon with a skull permanently fused to its head and carries a bone weapon.',
    clue4: 'This Pokémon overcame its grief after losing its mother and became incredibly tough and strong!',
    color: '#E0C068',
    moves: ['Earthquake','Bonemerang','RockSlide','Dig'] },
  { id: 106, name: 'Hitmonlee', type: 'Fighting', hp: 50, atk: 120, def: 53, spd: 87,
    clue2: 'It is found in dojos and training grounds where it practices kicking non-stop.',
    clue3: 'It is a brown humanoid Pokémon with no face features, large fists, and powerful spring-like legs.',
    clue4: 'This Pokémon\'s legs stretch like rubber bands so it can kick enemies from much farther away!',
    color: '#C03028',
    moves: ['KarateChop','Submission','HyperBeam','SeismicToss'] },
  { id: 107, name: 'Hitmonchan', type: 'Fighting', hp: 50, atk: 105, def: 79, spd: 76,
    clue2: 'It is found in boxing gyms where it trains its punching for hours every day.',
    clue3: 'It is a humanoid Pokémon that looks like a boxer wearing a tutu-like skirt and boxing gloves.',
    clue4: 'This Pokémon can punch 10 times in just one second — faster than the eye can see!',
    color: '#C03028',
    moves: ['KarateChop','IcePunch','Submission','SeismicToss'] },
  { id: 108, name: 'Lickitung', type: 'Normal', hp: 90, atk: 55, def: 75, spd: 30,
    clue2: 'It is found in forests and wetlands where it uses its huge tongue to explore everything.',
    clue3: 'It is a pink bipedal Pokémon with an enormous tongue that is twice the length of its body.',
    clue4: 'This Pokémon\'s tongue is so long it sometimes trips over it while walking!',
    color: '#A8A878',
    moves: ['Tackle','Slam','BodySlam','Wrap'] },
  { id: 109, name: 'Koffing', type: 'Poison', hp: 40, atk: 65, def: 95, spd: 35,
    clue2: 'It is found floating in polluted air near factories and cities.',
    clue3: 'It is a purple round floating Pokémon covered in yellow spots that ooze toxic gases.',
    clue4: 'This Pokémon floats by filling itself with toxic gases lighter than air — like a poison balloon!',
    color: '#A040A0',
    moves: ['PoisonSting','Sludge','SelfDestruct','Acid'] },
  { id: 110, name: 'Weezing', type: 'Poison', hp: 65, atk: 90, def: 120, spd: 60,
    clue2: 'It is found floating in extremely polluted areas where the air is terrible.',
    clue3: 'It is two connected purple sphere Pokémon joined together with a tiny third head sprouting out.',
    clue4: 'This Pokémon mixes all the worst smelling gases from both its heads to create even more toxic clouds!',
    color: '#A040A0',
    moves: ['Sludge','SludgeBomb','Explosion','Acid'] },
  { id: 111, name: 'Rhyhorn', type: 'Ground', hp: 80, atk: 85, def: 95, spd: 25,
    clue2: 'It is found in rocky savannas and harsh terrain, charging around mindlessly.',
    clue3: 'It is a large grey rhinoceros-like Pokémon with a rock-like hide and a big horn.',
    clue4: 'This Pokémon charges so hard it forgets where it is going halfway through its run!',
    color: '#E0C068',
    moves: ['Tackle','Earthquake','RockSlide','Headbutt'] },
  { id: 112, name: 'Rhydon', type: 'Ground', hp: 105, atk: 130, def: 120, spd: 40,
    clue2: 'It is found in rocky mountains where it drills through boulders with its horn like a drill.',
    clue3: 'It is a large grey bipedal Pokémon with an armored body, big drill-like horn, and thick tail.',
    clue4: 'This Pokémon\'s horn can drill through solid granite and its hide can withstand molten lava!',
    color: '#E0C068',
    moves: ['Earthquake','RockSlide','Dig','HyperBeam'] },
  { id: 113, name: 'Chansey', type: 'Normal', hp: 250, atk: 5, def: 5, spd: 50,
    clue2: 'It is found in hospitals and healing centers where it helps take care of sick Pokémon.',
    clue3: 'It is a round pink Pokémon with stubby arms, a pouch on its belly with an egg inside.',
    clue4: 'This Pokémon\'s egg inside its pouch is so delicious and nutritious that it makes people instantly happy!',
    color: '#A8A878',
    moves: ['Tackle','BodySlam','Slam','Headbutt'] },
  { id: 114, name: 'Tangela', type: 'Grass', hp: 65, atk: 55, def: 115, spd: 60,
    clue2: 'It is found in dense tropical jungles completely hidden by tangled vines.',
    clue3: 'It looks like a mass of squirming blue vines with two beady red eyes and small red feet.',
    clue4: 'The vines covering this Pokémon\'s body always keep growing back even if they get broken off!',
    color: '#78C850',
    moves: ['VineWhip','MegaDrain','SolarBeam','Wrap'] },
  { id: 115, name: 'Kangaskhan', type: 'Normal', hp: 105, atk: 95, def: 80, spd: 90,
    clue2: 'It is found in savanna and grasslands, fiercely protecting the baby in its pouch.',
    clue3: 'It is a large brown dinosaur-like Pokémon with a baby peeking out from the pouch on its belly.',
    clue4: 'This Pokémon will fight to the last breath to protect the baby in its pouch from any danger!',
    color: '#A8A878',
    moves: ['Tackle','BodySlam','HyperBeam','Headbutt'] },
  { id: 116, name: 'Horsea', type: 'Water', hp: 30, atk: 40, def: 70, spd: 60,
    clue2: 'It is found in calm bays and sheltered water near coral reefs.',
    clue3: 'It is a tiny blue seahorse Pokémon with a long spiral snout and curled tail.',
    clue4: 'This Pokémon wraps its tail around seaweed to rest without being swept away by currents!',
    color: '#6890F0',
    moves: ['WaterGun','Bubble','Surf','Tackle'] },
  { id: 117, name: 'Seadra', type: 'Water', hp: 55, atk: 65, def: 95, spd: 85,
    clue2: 'It is found in ocean waters, hiding amongst seaweed and coral to ambush prey.',
    clue3: 'It is a larger blue seahorse Pokémon with lots of sharp spines and a curled tail.',
    clue4: 'This Pokémon\'s spines are so sharp that even experienced fishermen get badly hurt touching it!',
    color: '#6890F0',
    moves: ['WaterGun','Surf','Hydropump','Bubble'] },
  { id: 118, name: 'Goldeen', type: 'Water', hp: 45, atk: 67, def: 60, spd: 63,
    clue2: 'It is found swimming gracefully in rivers and ponds like a princess of the water.',
    clue3: 'It is an orange and white fish Pokémon with a large majestic tail fin and a big pointed horn.',
    clue4: 'This Pokémon is called the Water Queen because of its beautiful flowing fins and elegant swimming!',
    color: '#6890F0',
    moves: ['WaterGun','Peck','Tackle','Surf'] },
  { id: 119, name: 'Seaking', type: 'Water', hp: 80, atk: 92, def: 65, spd: 68,
    clue2: 'It is found in rivers and lakes where it migrates upstream every autumn to lay eggs.',
    clue3: 'It is a large orange and white fish Pokémon with a magnificent golden horn and flowing fins.',
    clue4: 'This Pokémon drills holes in boulders using its horn to build a cozy nest for its eggs!',
    color: '#6890F0',
    moves: ['WaterGun','Surf','Peck','HyperBeam'] },
  { id: 120, name: 'Staryu', type: 'Water', hp: 30, atk: 45, def: 55, spd: 85,
    clue2: 'It is found on beaches and in the ocean, often coming out at night.',
    clue3: 'It looks exactly like a golden-brown star with a red jewel in the center.',
    clue4: 'This Pokémon can regenerate any of its limbs if they are ever broken off in battle!',
    color: '#6890F0',
    moves: ['WaterGun','Tackle','Surf','Hydropump'] },
  { id: 121, name: 'Starmie', type: 'Water', hp: 60, atk: 75, def: 85, spd: 115,
    clue2: 'It is found in the open ocean, glowing beautifully at night in deep blue water.',
    clue3: 'It is a purple double star shape with a rainbow-colored jewel glowing in the center.',
    clue4: 'This Pokémon\'s core glows in seven different rainbow colors and signals to something in space!',
    color: '#6890F0',
    moves: ['Surf','Hydropump','PsychicMove','Confusion'] },
  { id: 122, name: 'Mr. Mime', type: 'Psychic', hp: 40, atk: 45, def: 65, spd: 90,
    clue2: 'It is found in towns and parks where it performs miming shows for audiences.',
    clue3: 'It is a tall humanoid Pokémon that looks like a clown mime with big round hands and feet.',
    clue4: 'This Pokémon\'s pantomime skills are so good that invisible walls it mimes actually become real!',
    color: '#F85888',
    moves: ['Confusion','PsychicMove','Tackle','Amnesia'] },
  { id: 123, name: 'Scyther', type: 'Bug', hp: 70, atk: 110, def: 80, spd: 105,
    clue2: 'It is found in dense jungles where it moves so fast it appears to teleport.',
    clue3: 'It is a large green mantis-like Pokémon with two massive bladed scythes for arms.',
    clue4: 'This Pokémon moves so fast in battle that its opponent can\'t even see it — it\'s like a blur!',
    color: '#A8B820',
    moves: ['XScissor','WingAttack','Gust','BugBite'] },
  { id: 124, name: 'Jynx', type: 'Ice', hp: 65, atk: 50, def: 35, spd: 95,
    clue2: 'It is found in snowy mountain areas, shuffling along in a mysterious dance.',
    clue3: 'It is a humanoid Pokémon with a pale face, long blond hair, a red dress, and purple skin.',
    clue4: 'This Pokémon communicates through a language of its own that sounds eerily like human speech!',
    color: '#98D8D8',
    moves: ['IceBeam','Blizzard','Confusion','IcePunch'] },
  { id: 125, name: 'Electabuzz', type: 'Electric', hp: 65, atk: 83, def: 57, spd: 105,
    clue2: 'It is found near power plants and often causes city-wide blackouts.',
    clue3: 'It is a yellow tiger-striped Pokémon with two antennae and always crackling with electricity.',
    clue4: 'This Pokémon absorbs entire lightning bolts — sometimes it glows so bright it is blinding!',
    color: '#F8D030',
    moves: ['ThunderShock','Thunderbolt','Thunder','QuickAttack'] },
  { id: 126, name: 'Magmar', type: 'Fire', hp: 65, atk: 95, def: 57, spd: 93,
    clue2: 'It is found inside active volcanoes surrounded by blazing hot magma.',
    clue3: 'It is a red duck-like Pokémon with a flame-shaped head, tail of fire, and bumpy fire-covered body.',
    clue4: 'This Pokémon\'s body temperature is so high that anything it touches bursts into flames!',
    color: '#F08030',
    moves: ['Flamethrower','FireBlast','Ember','FireSpin'] },
  { id: 127, name: 'Pinsir', type: 'Bug', hp: 65, atk: 125, def: 100, spd: 85,
    clue2: 'It is found in warm forests and jungles where it tears apart logs looking for food.',
    clue3: 'It is a brown beetle-like Pokémon with two enormous spiked horns on the top of its head.',
    clue4: 'This Pokémon uses its huge horns to grab enemies and squeeze until they give up — it never lets go!',
    color: '#A8B820',
    moves: ['XScissor','BugBite','Submission','HyperBeam'] },
  { id: 128, name: 'Tauros', type: 'Normal', hp: 75, atk: 100, def: 95, spd: 110,
    clue2: 'It is found in vast open plains where it whips itself with its three tails and charges.',
    clue3: 'It is a brown bull Pokémon with three swishing tails, two curved horns, and a muscular body.',
    clue4: 'This Pokémon charges at top speed and slams into opponents with enormous force — nothing stops it!',
    color: '#A8A878',
    moves: ['Tackle','BodySlam','HyperBeam','Headbutt'] },
  { id: 129, name: 'Magikarp', type: 'Water', hp: 20, atk: 10, def: 55, spd: 80,
    clue2: 'It is found in rivers, lakes, and seas all around the world.',
    clue3: 'It looks like a bright orange fish with big scales and white whiskers.',
    clue4: 'This Pokémon is very weak but if it keeps training it evolves into a fearsome dragon!',
    color: '#6890F0',
    moves: ['Tackle','Tackle','WaterGun','Bubble'] },
  { id: 130, name: 'Gyarados', type: 'Water', hp: 95, atk: 125, def: 79, spd: 81,
    clue2: 'It is found in the ocean and large lakes, causing massive storms wherever it appears.',
    clue3: 'It is an enormous serpentine sea dragon with a blue body, yellow underbelly, and fierce red eyes.',
    clue4: 'Once this Pokémon goes on a rampage it doesn\'t calm down for an entire month!',
    color: '#6890F0',
    moves: ['Surf','Hydropump','Bite','HyperBeam'] },
  { id: 131, name: 'Lapras', type: 'Water', hp: 130, atk: 85, def: 80, spd: 60,
    clue2: 'It is found in the ocean and lets people ride on its back across the sea.',
    clue3: 'It is a large gentle Pokémon that looks like a dinosaur with a spiky shell.',
    clue4: 'This Pokémon loves to carry people across the water and communicates through beautiful song!',
    color: '#6890F0',
    moves: ['Surf','IceBeam','WaterGun','AuroraBeam'] },
  { id: 132, name: 'Ditto', type: 'Normal', hp: 48, atk: 48, def: 48, spd: 48,
    clue2: 'It is found almost anywhere and blends into its surroundings by transforming.',
    clue3: 'It is a small purple blob with a simple dot-eyes and wide dot-mouth face.',
    clue4: 'This Pokémon can transform into a perfect copy of any Pokémon or even any object it sees!',
    color: '#A8A878',
    moves: ['Tackle','Slam','Wrap','BodySlam'] },
  { id: 133, name: 'Eevee', type: 'Normal', hp: 55, atk: 55, def: 50, spd: 55,
    clue2: 'It lives near humans in towns and cities and is easy to befriend.',
    clue3: 'It is a small brown fox-like Pokémon with a fluffy white collar around its neck.',
    clue4: 'This Pokémon can evolve into many different Pokémon depending on how it is raised!',
    color: '#A8A878',
    moves: ['Tackle','Scratch','QuickAttack','Bite'] },
  { id: 134, name: 'Vaporeon', type: 'Water', hp: 130, atk: 65, def: 60, spd: 65,
    clue2: 'It is found near bodies of water and can turn itself invisible by merging with water.',
    clue3: 'It is a light blue mermaid-like Pokémon with a fish tail, fins on its head, and frilly collar.',
    clue4: 'This Pokémon\'s cells are so similar to water molecules that it can melt into water and disappear!',
    color: '#6890F0',
    moves: ['Surf','WaterGun','Hydropump','HyperBeam'] },
  { id: 135, name: 'Jolteon', type: 'Electric', hp: 65, atk: 65, def: 60, spd: 130,
    clue2: 'It is found near grassy plains and charges itself by gulping in static-filled air.',
    clue3: 'It is a yellow Pokémon with spiky fur all over its body and big pointed ears.',
    clue4: 'This Pokémon can build up a 10,000-volt charge in its spiky fur and release it all at once!',
    color: '#F8D030',
    moves: ['ThunderShock','Thunderbolt','Thunder','QuickAttack'] },
  { id: 136, name: 'Flareon', type: 'Fire', hp: 65, atk: 130, def: 60, spd: 65,
    clue2: 'It is found near hot volcanic areas where its internal flame-sac stays warm.',
    clue3: 'It is a fluffy orange Pokémon with a large puffy mane, bushy tail, and big ears.',
    clue4: 'This Pokémon has a flame sac inside its body that reaches over 3,000 degrees Fahrenheit!',
    color: '#F08030',
    moves: ['Flamethrower','FireBlast','Ember','HyperBeam'] },
  { id: 137, name: 'Porygon', type: 'Normal', hp: 65, atk: 60, def: 70, spd: 40,
    clue2: 'It is found inside computers and digital networks, moving through data.',
    clue3: 'It is a pink computer-generated Pokémon with geometric blocky shapes and a duck bill.',
    clue4: 'This Pokémon is the world\'s first Pokémon made entirely by programming on a computer!',
    color: '#A8A878',
    moves: ['Tackle','TriAttack','Confusion','HyperBeam'] },
  { id: 138, name: 'Omanyte', type: 'Rock', hp: 35, atk: 40, def: 100, spd: 35,
    clue2: 'It was found preserved in an ancient fossil discovered in rock layers millions of years old.',
    clue3: 'It is a small ancient blue Pokémon with a spiral shell on its back and ten tentacles.',
    clue4: 'This Pokémon was brought back to life from an ancient fossil found in prehistoric rock layers!',
    color: '#B8A038',
    moves: ['WaterGun','RockThrow','Bubble','Tackle'] },
  { id: 139, name: 'Omastar', type: 'Rock', hp: 70, atk: 60, def: 125, spd: 55,
    clue2: 'It lived in ancient seas and became extinct long ago before being revived by scientists.',
    clue3: 'It is a larger ancient Pokémon with a big spiked spiral shell and many long tentacles.',
    clue4: 'This Pokémon used its tentacles to pull shellfish apart for food millions of years ago!',
    color: '#B8A038',
    moves: ['WaterGun','RockSlide','Hydropump','Surf'] },
  { id: 140, name: 'Kabuto', type: 'Rock', hp: 30, atk: 80, def: 90, spd: 55,
    clue2: 'It was revived from an ancient dome fossil discovered by scientists.',
    clue3: 'It is a small horseshoe crab-like Pokémon with a large brown shell and four small legs.',
    clue4: 'This Pokémon\'s shell has barely changed in 300 million years — it is a true living fossil!',
    color: '#B8A038',
    moves: ['Scratch','WaterGun','RockThrow','Tackle'] },
  { id: 141, name: 'Kabutops', type: 'Rock', hp: 60, atk: 115, def: 105, spd: 80,
    clue2: 'It once ruled ancient seas and sliced through prey with its blade-like arms.',
    clue3: 'It is a large prehistoric Pokémon with a flat brown shell and two massive scythe-like arms.',
    clue4: 'This Pokémon was such a ferocious predator in ancient times that it could dominate the entire sea!',
    color: '#B8A038',
    moves: ['RockSlide','Surf','Scratch','HyperBeam'] },
  { id: 142, name: 'Aerodactyl', type: 'Rock', hp: 80, atk: 105, def: 65, spd: 130,
    clue2: 'It once flew through ancient skies and was revived from old amber millions of years old.',
    clue3: 'It is a large grey pterodactyl Pokémon with fierce red eyes, stone-like wings, and a jagged jaw.',
    clue4: 'This Pokémon ruled the skies in prehistoric times and was the most fearsome flying predator!',
    color: '#B8A038',
    moves: ['RockSlide','Fly','Bite','HyperBeam'] },
  { id: 143, name: 'Snorlax', type: 'Normal', hp: 160, atk: 110, def: 65, spd: 30,
    clue2: 'It is found blocking roads and paths, usually fast asleep.',
    clue3: 'It is an enormous blue-grey Pokémon with a huge round belly and a cream-colored face.',
    clue4: 'This Pokémon eats 900 pounds of food a day and then sleeps for the rest of the day!',
    color: '#A8A878',
    moves: ['BodySlam','Headbutt','HyperBeam','Slam'] },
  { id: 144, name: 'Articuno', type: 'Ice', hp: 90, atk: 85, def: 100, spd: 85,
    clue2: 'It is found in snowy mountain peaks and frozen tundras far from humans.',
    clue3: 'It is a majestic blue bird Pokémon with three long flowing blue tail feathers and a pink crest.',
    clue4: 'This Pokémon is said to appear to rescue lost travelers stranded in icy mountains!',
    color: '#98D8D8',
    moves: ['IceBeam','Blizzard','AuroraBeam','Fly'] },
  { id: 145, name: 'Zapdos', type: 'Electric', hp: 90, atk: 90, def: 85, spd: 100,
    clue2: 'It is found in thunderclouds and only appears during electrical storms.',
    clue3: 'It is a large spiky yellow bird Pokémon with jagged lightning-bolt shaped wings.',
    clue4: 'This Pokémon gains power every time it gets struck by lightning — storms make it stronger!',
    color: '#F8D030',
    moves: ['Thunderbolt','Thunder','ThunderShock','Fly'] },
  { id: 146, name: 'Moltres', type: 'Fire', hp: 90, atk: 100, def: 90, spd: 90,
    clue2: 'It is found near volcanoes and hot springs where it bathes in the magma.',
    clue3: 'It is a large orange bird Pokémon with wings and feathers that are all blazing flames.',
    clue4: 'This Pokémon is said to signal the arrival of spring and can heal wounds by touching them with its flame!',
    color: '#F08030',
    moves: ['Flamethrower','FireBlast','Fly','HyperBeam'] },
  { id: 147, name: 'Dratini', type: 'Dragon', hp: 41, atk: 64, def: 45, spd: 50,
    clue2: 'It lives deep in the water near lakes and rivers, rarely seen by humans.',
    clue3: 'It is a tiny blue serpent-like Pokémon with a white orb on its forehead.',
    clue4: 'This Pokémon is called the mirage Pokémon because it\'s so rare many people think it doesn\'t exist!',
    color: '#7038F8',
    moves: ['DragonRage','WaterGun','Wrap','Slam'] },
  { id: 148, name: 'Dragonair', type: 'Dragon', hp: 61, atk: 84, def: 65, spd: 70,
    clue2: 'It is found in lakes and the sea, and its beautiful body is said to change the weather.',
    clue3: 'It is a long elegant serpentine Pokémon with blue scales, white orbs on its neck and tail.',
    clue4: 'This Pokémon can control the weather and make rain, snow, or sunshine appear at will!',
    color: '#7038F8',
    moves: ['DragonRage','DragonClaw','WaterGun','Slam'] },
  { id: 149, name: 'Dragonite', type: 'Dragon', hp: 91, atk: 134, def: 95, spd: 80,
    clue2: 'It is found flying far out at sea and is said to guide ships safely home in storms.',
    clue3: 'It is a large friendly-looking orange dragon Pokémon with small wings and antennae.',
    clue4: 'This Pokémon can fly around the entire world in just 16 hours — that\'s super fast!',
    color: '#7038F8',
    moves: ['DragonClaw','HyperBeam','Fly','DragonRage'] },
  { id: 150, name: 'Mewtwo', type: 'Psychic', hp: 106, atk: 110, def: 90, spd: 130,
    clue2: 'It was created in a secret lab deep in a remote area, never meant to exist.',
    clue3: 'It is a tall grey humanoid Pokémon with a large head, long curving tail, and fierce purple eyes.',
    clue4: 'This Pokémon was created by scientists who wanted to make the most powerful Pokémon ever — and they succeeded!',
    color: '#F85888',
    moves: ['PsychicMove','Amnesia','DreamEater','HyperBeam'] },
  { id: 151, name: 'Mew', type: 'Psychic', hp: 100, atk: 100, def: 100, spd: 100,
    clue2: 'It is said to exist everywhere and nowhere at the same time, hiding from all humans.',
    clue3: 'It is a tiny pink cat-like Pokémon with a long curving tail and big blue eyes.',
    clue4: 'This Pokémon contains the DNA of every Pokémon and is said to be the ancestor of all Pokémon!',
    color: '#F85888',
    moves: ['PsychicMove','HyperBeam','SolarBeam','Confusion'] },
];

// ===== GYM DATA =====
const GYMS = [
  { id: 0, name: 'Boulder Badge', leader: 'Brock',    type: 'Rock',     icon: '⬡', color: '#9E8A6A', spriteId: 74,  rounds: 3, difficulty: 1, img: 'assets/leader-brock.webp', badge: 'assets/badge-boulder.webp' },
  { id: 1, name: 'Cascade Badge', leader: 'Misty',    type: 'Water',    icon: '💧', color: '#6890F0', spriteId: 121, rounds: 3, difficulty: 2, img: 'assets/leader-misty.webp', badge: 'assets/badge-cascade.webp' },
  { id: 2, name: 'Thunder Badge', leader: 'Lt. Surge', type: 'Electric', icon: '⚡', color: '#F8D030', spriteId: 26,  rounds: 4, difficulty: 3, img: 'assets/leader-lt-surge.webp', badge: 'assets/badge-thunder.webp' },
  { id: 3, name: 'Rainbow Badge', leader: 'Erika',    type: 'Grass',    icon: '🌺', color: '#78C850', spriteId: 45,  rounds: 4, difficulty: 4, img: 'assets/leader-erika.webp', badge: 'assets/badge-rainbow.webp' },
  { id: 4, name: 'Soul Badge',    leader: 'Koga',     type: 'Poison',   icon: '💜', color: '#9C59B3', spriteId: 89,  rounds: 4, difficulty: 5, img: 'assets/leader-koga.webp', badge: 'assets/badge-soul.webp' },
  { id: 5, name: 'Marsh Badge',   leader: 'Sabrina',  type: 'Psychic',  icon: '🔮', color: '#E91E8C', spriteId: 65,  rounds: 5, difficulty: 6, img: 'assets/leader-sabrina.webp', badge: 'assets/badge-marsh.webp' },
  { id: 6, name: 'Volcano Badge', leader: 'Blaine',   type: 'Fire',     icon: '🔥', color: '#F08030', spriteId: 59,  rounds: 5, difficulty: 7, img: 'assets/leader-blaine.webp', badge: 'assets/badge-volcano.webp' },
  { id: 7, name: 'Earth Badge',   leader: 'Giovanni', type: 'Ground',   icon: '🌍', color: '#C8A878', spriteId: 112, rounds: 5, difficulty: 8, img: 'assets/leader-giovanni.webp', badge: 'assets/badge-earth.webp' },
];

// ===== TEAM ROCKET DIALOGUES =====
const ROCKET_DIALOGUES = [
  { jessie: "Prepare for trouble!", james: "And make it double! We're stealing all the Pokémon! Solve our puzzle to stop us... if you can!" },
  { jessie: "We've trapped the Pokémon in cages!", james: "Hack our super computer to free them! Muahahaha!" },
  { jessie: "You think you can stop Team Rocket?", james: "Show us how smart you are, little trainer! We challenge you!" },
  { jessie: "Hand over your Pokémon!", james: "Or prove you're clever enough to outsmart us!" },
];

// ===== EDUCATIONAL QUESTIONS =====
function genMathQuestion(difficulty) {
  // difficulty comes from settings level (encounters) or settings level + gym boost (gyms)
  const effectiveLevel = Math.min(Math.max(difficulty || State.settings.level, 1), 5);
  let q, answer, choices;

  if (effectiveLevel <= 1) {
    // Pre-K: Counting & number comparison
    const variant = Math.random();
    if (variant < 0.5) {
      // Counting question: "How many ⭐?"
      const count = Math.floor(Math.random() * 5) + 1;
      const symbols = ['⭐', '🍎', '🐟', '🌸', '⚡'];
      const sym = symbols[Math.floor(Math.random() * symbols.length)];
      q = `How many ${sym}? ${sym.repeat(count)}`;
      answer = count;
    } else {
      // Which number is bigger?
      let a = Math.floor(Math.random() * 9) + 1;
      let b = Math.floor(Math.random() * 9) + 1;
      while (b === a) b = Math.floor(Math.random() * 9) + 1;
      q = `Which number is bigger: ${a} or ${b}?`;
      answer = Math.max(a, b);
    }
  } else if (effectiveLevel <= 2) {
    // Kindergarten: Addition/subtraction within 10
    const a = Math.floor(Math.random() * 8) + 1;
    const b = Math.floor(Math.random() * (10 - a)) + 1;
    const ops = ['+', '-'][Math.floor(Math.random() * 2)];
    if (ops === '+') {
      answer = a + b;
      q = `${a} + ${b} = ?`;
    } else {
      const big = Math.max(a, b), small = Math.min(a, b);
      answer = big - small;
      q = `${big} - ${small} = ?`;
    }
  } else if (effectiveLevel <= 3) {
    // 1st Grade: Addition/subtraction within 20
    const a = Math.floor(Math.random() * 15) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const ops = ['+', '-'][Math.floor(Math.random() * 2)];
    if (ops === '+') {
      answer = a + b;
      q = `${a} + ${b} = ?`;
    } else {
      const big = Math.max(a, b), small = Math.min(a, b);
      answer = big - small;
      q = `${big} - ${small} = ?`;
    }
  } else if (effectiveLevel <= 4) {
    // 2nd-3rd Grade: Multiply tables, simple division, larger add/sub
    const variant = Math.random();
    if (variant < 0.35) {
      // Multiplication up to 12×12
      const a = Math.floor(Math.random() * 11) + 2;
      const b = Math.floor(Math.random() * 11) + 2;
      answer = a * b;
      q = `${a} × ${b} = ?`;
    } else if (variant < 0.55) {
      // Division (clean results)
      const b = Math.floor(Math.random() * 8) + 2;
      const answer_val = Math.floor(Math.random() * 8) + 2;
      const a = b * answer_val;
      answer = answer_val;
      q = `${a} ÷ ${b} = ?`;
    } else if (variant < 0.8) {
      // Add/sub with 2-digit numbers
      const a = Math.floor(Math.random() * 40) + 10;
      const b = Math.floor(Math.random() * 30) + 5;
      const ops = ['+', '-'][Math.floor(Math.random() * 2)];
      if (ops === '+') {
        answer = a + b;
        q = `${a} + ${b} = ?`;
      } else {
        const big = Math.max(a, b), small = Math.min(a, b);
        answer = big - small;
        q = `${big} - ${small} = ?`;
      }
    } else {
      // Mixed operations word-style: "What is 6 groups of 4?"
      const a = Math.floor(Math.random() * 8) + 2;
      const b = Math.floor(Math.random() * 8) + 2;
      answer = a * b;
      q = `What is ${a} groups of ${b}?`;
    }
  } else {
    // 4th-5th Grade: Multi-digit multiply, long division, order of operations, larger numbers
    const variant = Math.random();
    if (variant < 0.25) {
      // Multi-digit multiplication
      const a = Math.floor(Math.random() * 12) + 2;
      const b = [10, 15, 20, 25, 50, 11, 12, 13, 14][Math.floor(Math.random() * 9)];
      answer = a * b;
      q = `${a} × ${b} = ?`;
    } else if (variant < 0.45) {
      // Division with larger dividends
      const b = Math.floor(Math.random() * 10) + 2;
      const answer_val = Math.floor(Math.random() * 15) + 2;
      const a = b * answer_val;
      answer = answer_val;
      q = `${a} ÷ ${b} = ?`;
    } else if (variant < 0.6) {
      // Order of operations (two-step)
      const a = Math.floor(Math.random() * 8) + 2;
      const b = Math.floor(Math.random() * 8) + 2;
      const c = Math.floor(Math.random() * 10) + 1;
      if (Math.random() < 0.5) {
        answer = a * b + c;
        q = `${a} × ${b} + ${c} = ?`;
      } else {
        answer = c + a * b;
        q = `${c} + ${a} × ${b} = ?`;
      }
    } else if (variant < 0.8) {
      // Larger add/sub (3-digit)
      const a = Math.floor(Math.random() * 400) + 100;
      const b = Math.floor(Math.random() * 300) + 50;
      const ops = ['+', '-'][Math.floor(Math.random() * 2)];
      if (ops === '+') {
        answer = a + b;
        q = `${a} + ${b} = ?`;
      } else {
        const big = Math.max(a, b), small = Math.min(a, b);
        answer = big - small;
        q = `${big} - ${small} = ?`;
      }
    } else {
      // Squares and simple powers
      const base = Math.floor(Math.random() * 10) + 2;
      answer = base * base;
      q = `${base}² = ?`;
    }
  }

  // Generate wrong choices scaled to answer size
  const wrong = new Set();
  while (wrong.size < 3) {
    let w;
    if (answer <= 10) {
      w = answer + Math.floor(Math.random() * 6) - 3;
    } else if (answer <= 50) {
      w = answer + Math.floor(Math.random() * 14) - 7;
    } else if (answer <= 200) {
      w = answer + Math.floor(Math.random() * 30) - 15;
    } else {
      w = answer + Math.floor(Math.random() * 60) - 30;
    }
    if (w !== answer && w >= 0) wrong.add(w);
  }
  choices = [...wrong, answer].sort(() => Math.random() - 0.5);
  return { type: 'math', question: q, answer, choices };
}

const READING_QUESTIONS = [
  { question: "The ___ sat on the mat.", answer: "cat", choices: ["cat", "bat", "run", "sun"], hint: "Fill in the blank:" },
  { question: "Which word rhymes with 'ball'?", answer: "tall", choices: ["tall", "run", "big", "pink"], hint: "" },
  { question: "The ___ is very hot.", answer: "sun", choices: ["sun", "ice", "fish", "door"], hint: "Fill in the blank:" },
  { question: "Which word is the OPPOSITE of 'big'?", answer: "tiny", choices: ["tiny", "huge", "great", "bold"], hint: "" },
  { question: "The dog ___ at the mailman.", answer: "barked", choices: ["barked", "danced", "painted", "swam"], hint: "Fill in the blank:" },
  { question: "Which word rhymes with 'rain'?", answer: "train", choices: ["train", "stop", "fish", "cold"], hint: "" },
  { question: "Birds ___ south in winter.", answer: "fly", choices: ["fly", "swim", "dig", "jump"], hint: "Fill in the blank:" },
  { question: "Which word means 'very happy'?", answer: "joyful", choices: ["joyful", "angry", "sleepy", "loud"], hint: "" },
  { question: "The fish lives in the ___.", answer: "ocean", choices: ["ocean", "forest", "desert", "sky"], hint: "Fill in the blank:" },
  { question: "Which word rhymes with 'moon'?", answer: "spoon", choices: ["spoon", "star", "rock", "fire"], hint: "" },
  { question: "I ___ my teeth every morning.", answer: "brush", choices: ["brush", "throw", "paint", "bake"], hint: "Fill in the blank:" },
  { question: "What is a word for a baby dog?", answer: "puppy", choices: ["puppy", "kitten", "duckling", "foal"], hint: "" },
  { question: "Pikachu uses ___ to attack.", answer: "electricity", choices: ["electricity", "water", "fire", "rocks"], hint: "Fill in the blank:" },
  { question: "Which word rhymes with 'fight'?", answer: "knight", choices: ["knight", "king", "queen", "lake"], hint: "" },
  { question: "A Pokémon trainer carries Poké ___.", answer: "Balls", choices: ["Balls", "Bags", "Books", "Boots"], hint: "Fill in the blank:" },
  { question: "Which word means 'to get bigger'?", answer: "grow", choices: ["grow", "shrink", "sleep", "hide"], hint: "" },
  { question: "Charmander has a flame on its ___.", answer: "tail", choices: ["tail", "head", "foot", "hand"], hint: "Fill in the blank:" },
  { question: "Which word is the OPPOSITE of 'fast'?", answer: "slow", choices: ["slow", "quick", "loud", "tall"], hint: "" },
  { question: "Water is super effective against ___ type.", answer: "Fire", choices: ["Fire", "Grass", "Water", "Normal"], hint: "Fill in the blank:" },
  { question: "Which word rhymes with 'cake'?", answer: "lake", choices: ["lake", "dog", "tree", "ball"], hint: "" },
  { question: "A Pokémon ___ when it gets stronger.", answer: "evolves", choices: ["evolves", "melts", "floats", "hides"], hint: "Fill in the blank:" },
  { question: "Which word means 'very strong'?", answer: "powerful", choices: ["powerful", "tiny", "gentle", "quiet"], hint: "" },
  { question: "Squirtle lives near the ___.", answer: "water", choices: ["water", "desert", "volcano", "moon"], hint: "Fill in the blank:" },
  { question: "Which word rhymes with 'night'?", answer: "light", choices: ["light", "dark", "cloud", "rain"], hint: "" },
  { question: "A gym leader gives you a ___ when you win.", answer: "badge", choices: ["badge", "cookie", "hat", "shoe"], hint: "Fill in the blank:" },
  { question: "Which word is the OPPOSITE of 'hot'?", answer: "cold", choices: ["cold", "warm", "bright", "loud"], hint: "" },
  { question: "Bulbasaur has a ___ on its back.", answer: "bulb", choices: ["bulb", "wing", "horn", "shell"], hint: "Fill in the blank:" },
  { question: "Which word means 'to catch'?", answer: "grab", choices: ["grab", "drop", "throw", "kick"], hint: "" },
  { question: "Pokémon live in tall ___.", answer: "grass", choices: ["grass", "buildings", "clouds", "caves"], hint: "Fill in the blank:" },
  { question: "Which word rhymes with 'blue'?", answer: "clue", choices: ["clue", "red", "green", "black"], hint: "" },
  { question: "A Pokémon Center ___ your Pokémon.", answer: "heals", choices: ["heals", "sells", "hides", "paints"], hint: "Fill in the blank:" },
  { question: "Which word means 'a person who trains Pokémon'?", answer: "trainer", choices: ["trainer", "teacher", "doctor", "chef"], hint: "" },
  { question: "Flying-type Pokémon can ___ in the sky.", answer: "soar", choices: ["soar", "swim", "dig", "melt"], hint: "Fill in the blank:" },
  { question: "Which word rhymes with 'star'?", answer: "far", choices: ["far", "sun", "moon", "sky"], hint: "" },
  { question: "Jigglypuff puts people to ___ with its song.", answer: "sleep", choices: ["sleep", "work", "school", "play"], hint: "Fill in the blank:" },
  { question: "Which word is the OPPOSITE of 'weak'?", answer: "strong", choices: ["strong", "small", "soft", "slow"], hint: "" },
  { question: "You use a Pokédex to ___ Pokémon.", answer: "identify", choices: ["identify", "cook", "wash", "build"], hint: "Fill in the blank:" },
  { question: "Which word means 'a fight between Pokémon'?", answer: "battle", choices: ["battle", "party", "snack", "nap"], hint: "" },
  { question: "Grass-type moves are strong against ___ type.", answer: "Water", choices: ["Water", "Fire", "Flying", "Ghost"], hint: "Fill in the blank:" },
  { question: "Which word rhymes with 'dark'?", answer: "park", choices: ["park", "pool", "road", "hill"], hint: "" },
  { question: "Eevee can ___ into many different Pokémon.", answer: "evolve", choices: ["evolve", "melt", "freeze", "paint"], hint: "Fill in the blank:" },
  { question: "Which word means 'very brave'?", answer: "bold", choices: ["bold", "shy", "tired", "quiet"], hint: "" },
  { question: "A Pokémon egg will ___ into a baby Pokémon.", answer: "hatch", choices: ["hatch", "melt", "fly", "cook"], hint: "Fill in the blank:" },
  { question: "Which word rhymes with 'seed'?", answer: "need", choices: ["need", "rock", "leaf", "sand"], hint: "" },
  { question: "Nurse Joy works at the Pokémon ___.", answer: "Center", choices: ["Center", "School", "Store", "Park"], hint: "Fill in the blank:" },
  { question: "Which word is the OPPOSITE of 'dark'?", answer: "bright", choices: ["bright", "dim", "heavy", "rough"], hint: "" },
  { question: "Meowth loves shiny ___ coins.", answer: "gold", choices: ["gold", "paper", "wooden", "glass"], hint: "Fill in the blank:" },
  { question: "Which word means 'to look for something'?", answer: "search", choices: ["search", "forget", "sleep", "eat"], hint: "" },
  { question: "Snorlax likes to ___ all day.", answer: "sleep", choices: ["sleep", "run", "fly", "sing"], hint: "Fill in the blank:" },
  { question: "Which word rhymes with 'tail'?", answer: "trail", choices: ["trail", "head", "arm", "leg"], hint: "" },
];

const SPELLING_WORDS = [
  { word: 'FIRE', scrambled: 'RIFE', hint: 'It is very hot and burns!' },
  { word: 'WATER', scrambled: 'RAWET', hint: 'You drink this every day!' },
  { word: 'GRASS', scrambled: 'SARSG', hint: 'It grows in your garden!' },
  { word: 'STONE', scrambled: 'TOSEN', hint: 'It is a hard rock!' },
  { word: 'BRAVE', scrambled: 'RAVBE', hint: 'A hero is this!' },
  { word: 'CLOUD', scrambled: 'DOLCU', hint: 'Floats in the sky!' },
  { word: 'PLANT', scrambled: 'TNALP', hint: 'It grows with water and sun!' },
  { word: 'FLAME', scrambled: 'FMALE', hint: 'It is like a tongue of fire!' },
  { word: 'STORM', scrambled: 'MORTS', hint: 'Thunder and lightning!' },
  { word: 'MAGIC', scrambled: 'AGCIM', hint: 'Wizards do this!' },
  { word: 'SPEED', scrambled: 'DEPSE', hint: 'Going very fast!' },
  { word: 'POWER', scrambled: 'WERPO', hint: 'Being very strong!' },
  { word: 'EARTH', scrambled: 'HAERT', hint: 'The ground beneath us!' },
  { word: 'LIGHT', scrambled: 'TILGH', hint: 'The sun gives us this!' },
  { word: 'FROST', scrambled: 'TSROF', hint: 'Very cold ice crystals!' },
  { word: 'SWIFT', scrambled: 'WTFIS', hint: 'Moving very quickly!' },
  { word: 'TRAIL', scrambled: 'LRAIT', hint: 'A path through the woods!' },
  { word: 'BADGE', scrambled: 'DAGBE', hint: 'You earn this at a gym!' },
  { word: 'CATCH', scrambled: 'TAHCC', hint: 'Gotta do this to all Pokémon!' },
  { word: 'BRAVE', scrambled: 'RAVEB', hint: 'Not afraid of anything!' },
  { word: 'GHOST', scrambled: 'THGOS', hint: 'A spooky type of Pokémon!' },
  { word: 'SLEEP', scrambled: 'PELSA', hint: 'What Snorlax loves to do!' },
  { word: 'BERRY', scrambled: 'REYBA', hint: 'Pokémon eat these for health!' },
  { word: 'SHINE', scrambled: 'NEISH', hint: 'What rare Pokémon do!' },
  { word: 'CLIMB', scrambled: 'BLIMC', hint: 'Going up a mountain!' },
  { word: 'BLAST', scrambled: 'SLBAT', hint: 'A powerful explosion!' },
  { word: 'OCEAN', scrambled: 'CANOE', hint: 'A big body of water!' },
  { word: 'TRAIN', scrambled: 'NRAIT', hint: 'What you do with your Pokémon!' },
  { word: 'SHELL', scrambled: 'LEHLS', hint: 'Squirtle has one on its back!' },
  { word: 'ROCKY', scrambled: 'YCORK', hint: 'Full of rocks and stones!' },
  { word: 'WINGS', scrambled: 'SGNWI', hint: 'Birds use these to fly!' },
  { word: 'TOXIC', scrambled: 'XITOC', hint: 'A poisonous attack!' },
  { word: 'QUICK', scrambled: 'UCKQI', hint: 'Very fast and speedy!' },
  { word: 'FLAME', scrambled: 'LEMAF', hint: 'A tongue of fire!' },
  { word: 'SPARK', scrambled: 'PRASK', hint: 'A tiny flash of electricity!' },
  { word: 'DREAM', scrambled: 'MAERD', hint: 'What you see when sleeping!' },
  { word: 'STEEL', scrambled: 'LEETS', hint: 'A very strong metal!' },
  { word: 'SWORD', scrambled: 'WRDOS', hint: 'A sharp blade for fighting!' },
  { word: 'VALOR', scrambled: 'LROVA', hint: 'Great courage and bravery!' },
  { word: 'SCOUT', scrambled: 'TUCSO', hint: 'To explore and look around!' },
  { word: 'CREST', scrambled: 'STRCE', hint: 'The top of a wave or hill!' },
  { word: 'FLOCK', scrambled: 'LCKOF', hint: 'A group of flying Pokémon!' },
  { word: 'PEARL', scrambled: 'LRPEA', hint: 'A shiny gem from the sea!' },
  { word: 'BLAZE', scrambled: 'ZABEL', hint: 'A big bright fire!' },
  { word: 'GUARD', scrambled: 'DRAUG', hint: 'To protect and keep safe!' },
  { word: 'MISTY', scrambled: 'YTSIM', hint: 'A famous Water-type gym leader!' },
  { word: 'ARENA', scrambled: 'NAERA', hint: 'A place where battles happen!' },
  { word: 'VENOM', scrambled: 'MOENV', hint: 'Poison from a Pokémon!' },
  { word: 'HAVEN', scrambled: 'VENHA', hint: 'A safe place to rest!' },
  { word: 'FAINT', scrambled: 'TANFI', hint: 'What happens when a Pokémon loses!' },
];

const READING_COMP_PASSAGES = [
  {
    passage: "Pikachu is an Electric-type Pokémon. It has yellow fur and red circles on its cheeks. Those red circles store electricity! When Pikachu gets angry, it releases electricity from its cheeks. Pikachu loves ketchup and is very loyal to its trainer.",
    question: "What does Pikachu store in its red cheek circles?",
    answer: "electricity", choices: ["electricity", "ketchup", "water", "fire"]
  },
  {
    passage: "Pokémon Gyms are special places where trainers go to test their skills. Each gym has a Gym Leader who is a very strong trainer. If you beat the Gym Leader, you earn a badge. You need to collect all 8 badges to enter the Pokémon League!",
    question: "What do you earn when you beat a Gym Leader?",
    answer: "a badge", choices: ["a badge", "a Pokémon", "some money", "a trophy"]
  },
  {
    passage: "Snorlax is one of the biggest Pokémon. It weighs over 1,000 pounds! Snorlax loves to eat and can eat 900 pounds of food every day. After eating, it falls into a deep sleep. Nothing can wake Snorlax except a special Poké Flute song.",
    question: "How much food can Snorlax eat in one day?",
    answer: "900 pounds", choices: ["900 pounds", "100 pounds", "500 pounds", "1 pound"]
  },
  {
    passage: "Magikarp is famous for being the weakest Pokémon. All it can do is splash around in the water. However, if you train Magikarp with lots of patience, something amazing happens. At level 20, Magikarp evolves into the mighty Gyarados!",
    question: "What does Magikarp evolve into?",
    answer: "Gyarados", choices: ["Gyarados", "Dragonite", "Lapras", "Snorlax"]
  },
  {
    passage: "Eevee is a very special Pokémon because it can evolve into many different forms. If you give Eevee a Water Stone, it becomes Vaporeon. A Thunder Stone turns it into Jolteon. A Fire Stone makes it become Flareon!",
    question: "What does Eevee become when you use a Water Stone?",
    answer: "Vaporeon", choices: ["Vaporeon", "Jolteon", "Flareon", "Eevee"]
  },
  {
    passage: "Nurse Joy works at every Pokémon Center. She helps heal sick and tired Pokémon. Trainers can bring their Pokémon to her after a battle. She always has a Chansey to help her do her job.",
    question: "Which Pokémon helps Nurse Joy?",
    answer: "Chansey", choices: ["Chansey", "Pikachu", "Jigglypuff", "Meowth"]
  },
  {
    passage: "Charizard is a Fire and Flying type Pokémon. It can fly very high in the sky. Its tail always has a flame on it. If the flame ever goes out, Charizard is in big trouble!",
    question: "What two types is Charizard?",
    answer: "Fire and Flying", choices: ["Fire and Flying", "Fire and Water", "Fire and Grass", "Fire and Rock"]
  },
  {
    passage: "Ash Ketchum started his Pokémon journey when he was ten years old. He was late to Professor Oak's lab, so he did not get to pick Bulbasaur, Charmander, or Squirtle. Instead, he got a Pikachu! At first, Pikachu did not like Ash at all.",
    question: "Why did Ash get a Pikachu instead of a starter?",
    answer: "He was late", choices: ["He was late", "He chose it", "He found it", "It was a gift"]
  },
  {
    passage: "Geodude is a Rock-type Pokémon that looks like a round boulder with arms. It lives in mountains and caves. Geodude is very strong and can punch with great force. Be careful not to step on one — they look just like regular rocks!",
    question: "Where does Geodude live?",
    answer: "mountains and caves", choices: ["mountains and caves", "lakes and rivers", "forests and meadows", "cities and towns"]
  },
  {
    passage: "The Pokédex is a special tool that every trainer carries. It can tell you information about any Pokémon you see. Professor Oak invented the Pokédex. He gave one to Ash at the start of his journey.",
    question: "Who invented the Pokédex?",
    answer: "Professor Oak", choices: ["Professor Oak", "Nurse Joy", "Ash Ketchum", "Brock"]
  },
  {
    passage: "Jigglypuff loves to sing. When it sings its song, everyone who hears it falls asleep. This makes Jigglypuff very sad because no one stays awake to hear the whole song. When it gets angry, it draws on the faces of sleeping people with a marker!",
    question: "What happens when people hear Jigglypuff sing?",
    answer: "They fall asleep", choices: ["They fall asleep", "They start dancing", "They run away", "They clap"]
  },
  {
    passage: "Bulbasaur has a seed on its back that was planted at birth. As Bulbasaur grows bigger, the seed grows too. The seed uses sunlight to make energy for Bulbasaur. When the seed finally blooms into a flower, Bulbasaur has fully evolved!",
    question: "What does the seed on Bulbasaur's back use to make energy?",
    answer: "sunlight", choices: ["sunlight", "water", "food", "electricity"]
  },
  {
    passage: "There are many different types of Poké Balls. A regular Poké Ball is red and white. A Great Ball is blue and works better than a regular one. The best one is the Master Ball — it can catch any Pokémon without fail!",
    question: "Which Poké Ball can catch any Pokémon?",
    answer: "Master Ball", choices: ["Master Ball", "Great Ball", "Ultra Ball", "Poké Ball"]
  },
  {
    passage: "Slowpoke is one of the slowest Pokémon in the world. It takes five seconds for Slowpoke to feel pain after being bitten. Slowpoke loves to fish with its tail by the river. Sometimes a Shellder bites its tail and it evolves into Slowbro!",
    question: "What bites Slowpoke's tail to make it evolve?",
    answer: "Shellder", choices: ["Shellder", "Magikarp", "Goldeen", "Staryu"]
  },
  {
    passage: "Brock is a Gym Leader who uses Rock-type Pokémon. His gym is in Pewter City. Brock's strongest Pokémon is Onix, a giant rock snake. Water and Grass type moves work best against his team.",
    question: "What type of Pokémon does Brock use?",
    answer: "Rock-type", choices: ["Rock-type", "Fire-type", "Water-type", "Grass-type"]
  },
  {
    passage: "Meowth is a Normal-type Pokémon that loves shiny things, especially coins. It has a gold charm on its forehead. In Team Rocket, there is a Meowth that can actually talk like a human! Most Pokémon can only say their own name.",
    question: "What does Meowth love to collect?",
    answer: "shiny things", choices: ["shiny things", "berries", "leaves", "rocks"]
  },
  {
    passage: "When two trainers make eye contact, they must have a Pokémon battle. That is the rule! Each trainer sends out one Pokémon at a time. The Pokémon take turns using moves. The trainer whose Pokémon faints first loses the battle.",
    question: "What happens when two trainers make eye contact?",
    answer: "They must battle", choices: ["They must battle", "They trade Pokémon", "They run away", "They shake hands"]
  },
  {
    passage: "Lapras is a gentle Water and Ice type Pokémon. It can carry people across the ocean on its back. Lapras can understand human speech. Sadly, Lapras was once hunted so much that very few are left in the wild.",
    question: "What can Lapras carry on its back?",
    answer: "people", choices: ["people", "other Pokémon", "treasure", "food"]
  },
  {
    passage: "Diglett is a tiny Ground-type Pokémon that lives underground. No one has ever seen what Diglett looks like below the ground. It digs tunnels through the earth very quickly. Farmers love Diglett because its tunnels help their crops grow better!",
    question: "Why do farmers love Diglett?",
    answer: "Its tunnels help crops grow", choices: ["Its tunnels help crops grow", "It eats bugs", "It brings rain", "It is cute"]
  },
];

// ===== CVC WORDS + EMOJI =====
const CVC_WORDS = {
  a: [
    { word: 'cat', emoji: '🐱' },
    { word: 'bat', emoji: '🦇' },
    { word: 'hat', emoji: '🎩' },
    { word: 'bag', emoji: '🎒' },
    { word: 'fan', emoji: '🌀' },
    { word: 'map', emoji: '🗺️' },
    { word: 'jam', emoji: '🫙' },
    { word: 'van', emoji: '🚐' },
    { word: 'cap', emoji: '🧢' },
    { word: 'tap', emoji: '🚰' },
  ],
  e: [
    { word: 'bed', emoji: '🛏️' },
    { word: 'egg', emoji: '🥚' },
    { word: 'pen', emoji: '🖊️' },
    { word: 'web', emoji: '🕸️' },
    { word: 'hen', emoji: '🐔' },
    { word: 'net', emoji: '🥅' },
    { word: 'jet', emoji: '✈️' },
    { word: 'leg', emoji: '🦵' },
    { word: 'red', emoji: '🔴' },
    { word: 'vet', emoji: '👨‍⚕️' },
  ],
  i: [
    { word: 'pig', emoji: '🐷' },
    { word: 'wig', emoji: '💇' },
    { word: 'lip', emoji: '👄' },
    { word: 'kid', emoji: '👦' },
    { word: 'fin', emoji: '🦈' },
    { word: 'pin', emoji: '📌' },
    { word: 'zip', emoji: '🤐' },
    { word: 'bib', emoji: '👶' },
    { word: 'dig', emoji: '⛏️' },
    { word: 'hit', emoji: '💥' },
  ],
  o: [
    { word: 'dog', emoji: '🐶' },
    { word: 'log', emoji: '🪵' },
    { word: 'box', emoji: '📦' },
    { word: 'mop', emoji: '🧹' },
    { word: 'pot', emoji: '🍯' },
    { word: 'fox', emoji: '🦊' },
    { word: 'hop', emoji: '🐰' },
    { word: 'cob', emoji: '🌽' },
    { word: 'cot', emoji: '🛏️' },
    { word: 'rod', emoji: '🎣' },
  ],
  u: [
    { word: 'sun', emoji: '☀️' },
    { word: 'cup', emoji: '🥤' },
    { word: 'bug', emoji: '🐛' },
    { word: 'rug', emoji: '🧶' },
    { word: 'bus', emoji: '🚌' },
    { word: 'tub', emoji: '🛁' },
    { word: 'hug', emoji: '🤗' },
    { word: 'gum', emoji: '🫧' },
    { word: 'jug', emoji: '🫗' },
    { word: 'mud', emoji: '🟤' },
  ],
};

const ALL_CVC = Object.values(CVC_WORDS).flat();

function genCvcChallenge() {
  const idx = Math.floor(Math.random() * ALL_CVC.length);
  const correct = ALL_CVC[idx];
  // Pick 3 wrong emojis from other CVC words
  const wrongPool = ALL_CVC.filter(w => w.word !== correct.word);
  const wrongs = [];
  const usedEmoji = new Set([correct.emoji]);
  while (wrongs.length < 3 && wrongPool.length > 0) {
    const ri = Math.floor(Math.random() * wrongPool.length);
    const candidate = wrongPool[ri];
    if (!usedEmoji.has(candidate.emoji)) {
      wrongs.push(candidate.emoji);
      usedEmoji.add(candidate.emoji);
    }
    wrongPool.splice(ri, 1);
  }
  const choices = [...wrongs, correct.emoji].sort(() => Math.random() - 0.5);
  return { type: 'cvc', question: correct.word, answer: correct.emoji, choices, word: correct.word };
}

function getChallenge(type, difficulty) {
  if (typeof ACTIVITY_REGISTRY !== 'undefined' && ACTIVITY_REGISTRY[type]) {
    return ACTIVITY_REGISTRY[type].generator(difficulty);
  }
  if (type === 'cvc') return genCvcChallenge();
  if (type === 'math') return genMathQuestion(difficulty);
  // Legacy reading/spelling/comprehension types — kept as fallback but no longer
  // actively generated (new reading curriculum uses activity generators instead)
  if (type === 'reading') {
    const q = READING_QUESTIONS[Math.floor(Math.random() * READING_QUESTIONS.length)];
    return { type: 'reading', question: q.question, answer: q.answer, choices: [...q.choices].sort(() => Math.random() - 0.5), hint: q.hint || '' };
  }
  if (type === 'spelling') {
    const w = SPELLING_WORDS[Math.floor(Math.random() * SPELLING_WORDS.length)];
    return { type: 'spelling', question: `Unscramble: ${w.scrambled}`, answer: w.word, hint: `Hint: ${w.hint}` };
  }
  if (type === 'comprehension') {
    const p = READING_COMP_PASSAGES[Math.floor(Math.random() * READING_COMP_PASSAGES.length)];
    return { type: 'comprehension', passage: p.passage, question: p.question, answer: p.answer, choices: [...p.choices].sort(() => Math.random() - 0.5) };
  }
  return genMathQuestion(difficulty);
}

