// PrintPals batch 37: every seasonal colouring page becomes a busy scene (owner rule:
// colouring pages are full scenes, never one lonely picture).

// Which world each picture lives in, and the friends who join it.
const SEASON_FAMILIES = {
  halloween: { bg: 'night', keys: ['pumpkin', 'ghost', 'bat', 'treats'], friends: ['pumpkin', 'ghost', 'bat', 'treats', 'owl', 'cat'] },
  harvest: { bg: 'autumn', keys: ['turkey', 'leaves'], friends: ['leaves', 'pumpkin', 'turkey', 'owl', 'snail', 'bunny'] },
  christmas: { bg: 'winter', keys: ['tree', 'snowman', 'stocking', 'gingerbread', 'presents', 'bauble'], friends: ['tree', 'snowman', 'presents', 'gingerbread', 'stocking', 'bauble', 'penguin'] },
  snow: { bg: 'winter', keys: ['penguin'], friends: ['snowman', 'penguin', 'owl', 'bunny', 'dog'] },
  diwali: { bg: 'lights', keys: ['diya', 'lantern'], friends: ['diya', 'lantern', 'presents', 'sunflower', 'owl', 'balloons'] },
  lunar: { bg: 'lights', keys: ['paperlantern'], friends: ['paperlantern', 'lantern', 'presents', 'cat', 'fish', 'balloons'] },
  easter: { bg: 'garden', keys: ['eggs', 'chick', 'basket'], friends: ['eggs', 'chick', 'basket', 'bunny', 'butterfly', 'bee'] },
  love: { bg: 'party', keys: ['hearts', 'teddy'], friends: ['hearts', 'teddy', 'bunny', 'cake', 'balloons', 'butterfly'] },
  tooth: { bg: 'fairy', keys: ['tooth', 'chest'], friends: ['tooth', 'unicorn', 'owl', 'castle', 'bunny', 'butterfly'] },
};
let lastSeasonFamily = '';

function seasonFamily(key) {
  // A pumpkin after a turkey or leaves belongs to harvest time, otherwise to Halloween.
  if (key === 'pumpkin' && lastSeasonFamily === 'harvest') return SEASON_FAMILIES.harvest;
  for (const f of Object.keys(SEASON_FAMILIES)) if (SEASON_FAMILIES[f].keys.includes(key)) { lastSeasonFamily = f; return SEASON_FAMILIES[f]; }
  lastSeasonFamily = '';
  for (const s of CM_ORDER) {
    const S = CM_SCENES[s];
    if (S.main.includes(key) || S.extra.includes(key)) return { bg: s, friends: [...new Set(S.extra.concat(S.main))] };
  }
  return { bg: 'garden', friends: CM_SCENES.garden.extra.concat(CM_SCENES.garden.main) };
}

// A friendly Halloween night: moon, stars, little bats, a web, a fence and tiny pumpkins.
function seasonNight(rand) {
  const H = 240, g = [];
  g.push(`<path d="M150 8 A20 20 0 1 0 170 42 A15 15 0 1 1 150 8 Z" ${LW}/>`);
  [[18, 22, 5], [60, 12, 4], [104, 30, 5], [128, 10, 3.5], [192, 58, 4], [8, 64, 3.5]].forEach(([x, y, r]) => g.push(cStar(x, y, r)));
  [[74, 44], [118, 52], [36, 40]].forEach(([x, y]) => g.push(`<path d="M${x - 9} ${y} q3 -5 6 -2 q1 -4 3 -1 q2 -3 3 1 q3 -3 6 2 q-4 -1 -6 2 q-2 -2 -3 1 q-1 -3 -3 -1 q-2 -3 -6 -2 Z" ${LW}/>`));
  let web = '';
  for (let k = 0; k < 5; k++) { const a = (k / 8) * Math.PI; web += `<path d="M200 0 L${200 - Math.cos(a) * 34} ${Math.sin(a) * 34}" ${LT}/>`; }
  [12, 22, 32].forEach((r) => { let d = ''; for (let k = 0; k < 5; k++) { const a = (k / 8) * Math.PI; d += `${k ? 'L' : 'M'}${200 - Math.cos(a) * r} ${Math.sin(a) * r} `; } web += `<path d="${d}" ${LT}/>`; });
  g.push(web.replace(/M200 0 L200 0/g, ''));
  g.push(`<path d="M0 ${H - 40} Q60 ${H - 58} 120 ${H - 44} T200 ${H - 46}" ${LN}/>`);
  let fence = `<path d="M0 ${H - 24} H200 M0 ${H - 16} H200" ${LT}/>`;
  for (let x = 6; x < 200; x += 14) fence += `<path d="M${x} ${H - 8} V${H - 30} L${x + 4} ${H - 35} L${x + 8} ${H - 30} V${H - 8} Z" ${LW}/>`;
  g.push(fence);
  for (let k = 0; k < 6; k++) g.push(`<circle cx="${20 + rand() * 160}" cy="${18 + rand() * 36}" r="1.4" ${LW}/>`);
  return g.join('');
}

// Festival of lights: a string of lamps, stars and flowers in a row at the bottom.
function seasonLights(rand) {
  const H = 240, g = [];
  let str = `<path d="M0 10 Q100 34 200 10" ${LN}/>`;
  for (let k = 0; k < 8; k++) { const x = 14 + k * 24.5, y = 10 + Math.sin((k + 0.5) / 8 * Math.PI) * 22; str += `<path d="M${x} ${y} V${y + 5}" ${LT}/><path d="M${x - 5} ${y + 5} H${x + 5} L${x + 3} ${y + 15} H${x - 3} Z" ${LW}/><path d="M${x - 4} ${y + 10} H${x + 4}" ${LT}/>`; }
  g.push(str);
  [[30, 52, 4], [100, 48, 5], [172, 52, 4]].forEach(([x, y, r]) => g.push(cStar(x, y, r)));
  g.push(`<path d="M0 ${H - 22} H200" ${LN}/>`);
  [24, 76, 124, 176].forEach((x) => g.push(cmFlower(x, H - 12, 3.2).replace(/V[\d.]+"/, `V${H - 2}"`)));
  for (let k = 0; k < 8; k++) g.push(`<circle cx="${10 + rand() * 180}" cy="${60 + rand() * 12}" r="1.4" ${LW}/>`);
  return g.join('');
}

function seasonBackground(bg, rand) {
  if (bg === 'night') return seasonNight(rand);
  if (bg === 'lights') return seasonLights(rand);
  return cmBackground(bg, rand);
}

// Busy scene: the named picture big in the middle, its friends all around, a whole world behind.
function seasonScene(key, rand) {
  const fam = seasonFamily(key);
  const place = (k, x, y, sz) => `<g transform="translate(${x} ${y}) scale(${(sz / 200).toFixed(4)})">${seasonArt(k)}</g>`;
  let out = seasonBackground(fam.bg, rand);
  const friends = shuffle(fam.friends.filter((k) => k !== key), rand);
  if (fam.bg !== 'night') while (friends.length < 6) friends.push(...shuffle(['owl', 'bunny', 'butterfly', 'snail', 'cat', 'bee'].filter((k) => k !== key && !friends.includes(k)), rand).slice(0, 6 - friends.length));
  const slots = [[4, 58, 58], [138, 58, 58], [6, 150, 48], [146, 150, 48], [0, 108, 40], [160, 108, 40]];
  friends.slice(0, 6).forEach((k, i) => { out += place(k, ...slots[i]); });
  return out + place(key, 42, 76, 116);
}

seasonColour = function (paper, key, name) {
  const art = SEASON_ART[key] || COLOURING[key];
  const pg = new Page(paper, '', { bare: true });
  const top = pg.m + 2;
  const label = name ? `${name} colours the ${art.name.toLowerCase()}` : `Colour the ${art.name.toLowerCase()}`;
  bubbleText(pg, label, pg.w / 2, top + 14, pg.width - 10, 15);
  const boxY = top + 22, boxH = pg.bottom - boxY - 2;
  pg.add(`<rect x="${pg.left}" y="${boxY}" width="${pg.width}" height="${boxH}" rx="8" fill="#fff" stroke="#1f1b2e" stroke-width="1"/>`);
  let h = 7; for (const c of key + (name || '')) h = (h * 31 + c.charCodeAt(0)) % 1000003;
  const s = Math.min((pg.width - 6) / 200, (boxH - 6) / 240);
  pg.add(`<g transform="translate(${pg.left + (pg.width - 200 * s) / 2} ${boxY + (boxH - 240 * s) / 2}) scale(${s.toFixed(4)})">${seasonScene(key, rng(h))}</g>`);
  return pg.svg();
};
