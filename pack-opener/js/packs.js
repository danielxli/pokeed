/* Pack generation: rarity pools, odds modes, pull logic. Depends on data/cards.js. */

const SET_ORDER = ['base1', 'base2', 'base3'];

/* Real booster packshots (assets/pack-<set>-<art>.webp); each set shipped with 3 cover artworks.
   `price` is the Poké Coin cost to open a pack from that set. */
const SET_META = {
  base1: { packArts: ['charizard', 'blastoise', 'venusaur'], price: 30 },
  base2: { packArts: ['scyther', 'flareon', 'wigglytuff'], price: 25 },
  base3: { packArts: ['aerodactyl', 'zapdos', 'lapras'], price: 25 }
};

const PACK_PRICE = setId => SET_META[setId].price;

const PACK_ART_URL = (setId, art) => `assets/pack-${setId}-${art}.webp`;

function randomPackArt(setId) {
  const arts = SET_META[setId].packArts;
  return PACK_ART_URL(setId, arts[Math.floor(Math.random() * arts.length)]);
}

// rarity string -> tier key
function tierOf(card) {
  if (card.supertype === 'Energy' && card.rarity === 'Common') return 'energy';
  switch (card.rarity) {
    case 'Rare Holo': return 'holo';
    case 'Rare':      return 'rare';
    case 'Uncommon':  return 'uncommon';
    default:          return 'common';
  }
}

function buildPools(setId) {
  const pools = { common: [], uncommon: [], rare: [], holo: [], energy: [] };
  for (const c of CARD_SETS[setId].cards) pools[tierOf(c)].push(c);
  return pools;
}

/*
  Odds modes.
  Slot codes: c common, u uncommon, r rare (non-holo), e energy,
              R = the rare slot (holo chance applies)
*/
const ODDS_MODES = {
  generous:  { layout: ['c','c','c','c','u','u','u','r','r','R'], holoChance: 0.35 },
  pity:      { layout: ['c','c','c','c','u','u','u','r','r','R'], holoChance: 0.35, pityAt: 5 },
  realistic: { layout: null, holoChance: 1 / 3 } // layout depends on set (energy in Base Set)
};

function realisticLayout(setId) {
  return setId === 'base1'
    ? ['e','e','c','c','c','c','c','u','u','u','R']
    : ['c','c','c','c','c','c','c','u','u','u','R'];
}

function drawFrom(pool, fallback) {
  const src = pool.length ? pool : fallback;
  return src.splice(Math.floor(Math.random() * src.length), 1)[0];
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Generate one pack.
 * @returns {{cards: Array, hasHolo: boolean, pityTriggered: boolean}}
 *   cards are in reveal order: commons first, the rare slot last.
 */
function generatePack(setId, mode, packsSinceHolo) {
  const cfg = ODDS_MODES[mode] || ODDS_MODES.generous;
  const layout = cfg.layout || realisticLayout(setId);
  const pools = buildPools(setId);
  // copies so we sample without replacement (no dupes inside one pack)
  const p = {
    common:   [...pools.common],
    uncommon: [...pools.uncommon],
    rare:     [...pools.rare],
    holo:     [...pools.holo],
    energy:   [...pools.energy]
  };

  const pityTriggered = !!cfg.pityAt && packsSinceHolo >= cfg.pityAt - 1;

  const groups = { lead: [], mid: [], tail: [] };
  let hasHolo = false;

  for (const slot of layout) {
    if (slot === 'c')      groups.lead.push(drawFrom(p.common, p.uncommon));
    else if (slot === 'e') groups.lead.push(drawFrom(p.energy, p.common));
    else if (slot === 'u') groups.mid.push(drawFrom(p.uncommon, p.common));
    else if (slot === 'r') groups.tail.push(drawFrom(p.rare, p.uncommon));
    else { // 'R' — the money slot
      const holo = pityTriggered || Math.random() < cfg.holoChance;
      if (holo) { hasHolo = true; groups.tail.push(drawFrom(p.holo, p.rare)); }
      else groups.tail.push(drawFrom(p.rare, p.holo));
    }
  }

  // Reveal order: shuffled commons, shuffled uncommons, rares (holo always dead last)
  shuffle(groups.lead);
  shuffle(groups.mid);
  groups.tail.sort((a, b) => (tierOf(a) === 'holo') - (tierOf(b) === 'holo'));

  return { cards: [...groups.lead, ...groups.mid, ...groups.tail], hasHolo, pityTriggered };
}
