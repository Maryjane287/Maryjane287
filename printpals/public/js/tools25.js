// PrintPals batch 25 (Plus): Ocean Explorer kit, Little Gardener kit, Love and Kindness pack, Lunar New Year pack.

// ================================================================ more line art
Object.assign(SEASON_ART, {
  paperlantern: { name: 'Lantern', draw: () => [
    `<path d="M100 8 V26" ${LN}/><rect x="78" y="26" width="44" height="14" rx="3" ${LW}/>`,
    `<ellipse cx="100" cy="92" rx="62" ry="54" ${LW}/>`,
    `<path d="M100 40 V144 M72 44 Q52 92 72 140 M128 44 Q148 92 128 140 M52 60 Q40 92 52 124 M148 60 Q160 92 148 124" ${LT}/>`,
    `<rect x="78" y="144" width="44" height="14" rx="3" ${LW}/><path d="M86 158 V192 M100 158 V196 M114 158 V192" ${LN}/>`,
    cStar(30, 40, 8), cStar(172, 36, 9), cStar(170, 160, 6), cStar(28, 150, 7),
  ].join('') },
  hearts: { name: 'Hearts', draw: () => {
    const h = (x, y, s) => `<path d="M${x} ${y + s * 0.9} C${x - s * 1.4} ${y} ${x - s * 0.8} ${y - s * 0.9} ${x} ${y - s * 0.3} C${x + s * 0.8} ${y - s * 0.9} ${x + s * 1.4} ${y} ${x} ${y + s * 0.9} Z" ${LW}/>`;
    return [h(100, 96, 58), h(40, 40, 18), h(160, 44, 22), h(42, 160, 16), h(160, 164, 18), `<path d="M78 84 Q86 72 96 80" ${LT}/>`, cStar(100, 180, 8), cStar(24, 100, 6), cStar(178, 104, 7)].join('');
  } },
});

// ================================================================ Ocean Explorer kit (Plus)
const SEA_CREATURES = [
  ['🐳', 'Blue whale', 'The biggest animal that has ever lived!', 'Sunlight zone'], ['🐙', 'Octopus', 'It has 3 hearts and 8 clever arms.', 'Sunlight zone'],
  ['🐢', 'Sea turtle', 'It can swim thousands of miles to lay its eggs.', 'Sunlight zone'], ['🐬', 'Dolphin', 'Dolphins call each other by special whistles.', 'Sunlight zone'],
  ['🦈', 'Shark', 'Sharks have lived in the sea for longer than dinosaurs.', 'Twilight zone'], ['🪼', 'Jellyfish', 'It has no brain and no bones!', 'Twilight zone'],
  ['🦑', 'Giant squid', 'Its eyes are as big as dinner plates.', 'Midnight zone'], ['🐡', 'Anglerfish', 'It has its own glowing light to find food.', 'Midnight zone'],
];

function makeOceanKit(o, paper) {
  const rand = rng(+o.seed || 1);
  const name = nameOf(o.name, '') || '';
  const ring = '#1f8ac0', tint = '#e9f6fc';
  const pages = [seriesCover(paper, 'OCEAN EXPLORER', name ? `${possessive(name)} ocean book` : 'My ocean book', 'Dive into the deep blue sea!', ['🐳', '🐙', '🐢', '🐚', '🦀', '🐠'], ring, tint, 'explorer book', ['8 sea creature cards', 'Down to the deep', 'Rock pool bingo', 'Design a sea creature', 'Ocean promise', 'Ocean Explorer award'])];
  for (let p = 0; p < 8; p += 4) pages.push(tagsPage(paper, p ? 'Sea creature cards (more)' : 'Sea creature cards', 'Read each card together, then cut them out and sort them by how deep they live!', 4, 2, (pg, x, y, w, h, i) => {
    const [e, nm, fact, zone] = SEA_CREATURES[p + i], zc = zone[0] === 'S' ? '#5ec5f0' : zone[0] === 'T' ? '#2f78b8' : '#1c2a5e';
    pg.add(`<rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="9" fill="#fff" stroke="${zc}" stroke-width="1.2"/><rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h * 0.44}" rx="9" fill="${zc}" opacity="0.18"/>`);
    pg.add(emoji(e, x + w / 2, y + h * 0.26, h * 0.26));
    pg.add(txt(x + w / 2, y + h * 0.56, nm, fitFont(nm, 9, w - 16, 0.55), { colour: ring }));
    wrap(fact, 30).forEach((l, k) => pg.add(txt(x + w / 2, y + h * 0.56 + 9 + k * 6.4, l, 5.2, { font: FONT, weight: 700, colour: INK })));
    pg.add(`<rect x="${x + w / 2 - 26}" y="${y + h - 19}" width="52" height="10" rx="5" fill="${zc}"/>` + txt(x + w / 2, y + h - 12.3, zone, 4.8, { colour: '#fff' }));
  }));
  // Down to the deep.
  {
    const pg = new Page(paper, 'Down to the deep', { subtitle: 'The sea gets darker and colder the deeper you go. Draw a creature in each zone!' });
    const zones = [['Sunlight zone', 'Warm and bright. Most sea life lives here.', '#bfe9fb', INK, '☀️'], ['Twilight zone', 'Dim and cool. Only a little light reaches here.', '#6fb0dc', INK, '🦈'], ['Midnight zone', 'Pitch black. Some animals make their own light!', '#2b4f8c', '#fff', '🐡'], ['The abyss', 'Freezing and dark, near the sea floor.', '#1b2550', '#fff', '🦑']];
    const zh = pg.room / zones.length;
    zones.forEach(([nm, d, col, tc, e], i) => {
      const y = pg.y + i * zh;
      pg.add(`<rect x="${pg.left}" y="${y}" width="${pg.width}" height="${zh}" fill="${col}"${i === 0 ? ' rx="10"' : ''}/>`);
      pg.add(txt(pg.left + 8, y + 11, nm, 8, { anchor: 'start', colour: tc }) + wrap(d, 26).map((l, k) => txt(pg.left + 8, y + 19 + k * 6.4, l, 5.2, { anchor: 'start', font: FONT, colour: tc })).join('') + emoji(e, pg.left + 16, y + zh * 0.72, zh * 0.24));
      pg.add(`<rect x="${pg.left + pg.width * 0.42}" y="${y + 6}" width="${pg.width * 0.55}" height="${zh - 12}" rx="8" fill="#fff" opacity="0.92" stroke="${tc}" stroke-width="0.4" stroke-dasharray="3 2"/>`);
    });
    pg.add(`<path d="M${pg.left + 6} ${pg.bottom - 2} Q${pg.left + 40} ${pg.bottom - 12} ${pg.left + 80} ${pg.bottom - 4} T${pg.left + 150} ${pg.bottom - 6}" fill="none" stroke="#c9a96a" stroke-width="1"/>`);
    pages.push(pg.svg());
  }
  pages.push(countRowsPage(paper, 'Count the sea creatures', ['🐠', '🦀', '🐚', '⭐', '🐙', '🐢'], rand));
  pages.push(picGridPage(paper, 'Rock pool and beach bingo', 'Next time you are at the seaside, cross off everything you find. Look, but leave them where they live!', [['🦀', 'Crab'], ['🐚', 'Shell'], ['⭐', 'Starfish'], ['🌊', 'Big wave'], ['🪨', 'Smooth pebble'], ['🌿', 'Seaweed'], ['🐟', 'Tiny fish'], ['🐦', 'Seagull'], ['⛵', 'Boat'], ['🏖️', 'Sandcastle'], ['🦪', 'Mussels'], ['🪸', 'Something pink'], ['🦶', 'Footprints'], ['🐌', 'Sea snail'], ['🌅', 'Sunset'], ['💧', 'Rock pool']]));
  {
    const pg = new Page(paper, 'Design a sea creature', { subtitle: 'Invent a creature nobody has ever discovered! Does it glow? Does it have fins, tentacles or spikes?' });
    const bh = pg.room * 0.62;
    pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="${bh}" rx="12" fill="#f3fbff" stroke="${ring}" stroke-width="1" stroke-dasharray="3 2"/>`);
    pg.y += bh + 8;
    const qs = ['My creature is called', 'It lives in the', 'It eats', 'Its special trick is'], rh = pg.room / qs.length;
    qs.forEach((q, i) => pg.add(txt(pg.left, pg.y + i * rh + rh * 0.6, q, 6, { anchor: 'start', colour: PALETTE[i % PALETTE.length] }) + `<line x1="${pg.left + q.length * 3 + 6}" x2="${pg.right}" y1="${pg.y + i * rh + rh * 0.62}" y2="${pg.y + i * rh + rh * 0.62}" stroke="#c9c3e3" stroke-width="0.5"/>`));
    pages.push(pg.svg());
  }
  pages.push(checklistPage(paper, 'My ocean promise', 'The ocean needs our help! Colour a star for each promise you keep.', [['🧴', 'I will use a refillable water bottle'], ['🛍️', 'I will say no to plastic bags'], ['🗑️', 'I will always put rubbish in the bin'], ['🏖️', 'I will pick up litter at the beach'], ['🦀', 'I will leave sea creatures in their homes'], ['🚰', 'I will turn off the tap while I brush my teeth'], ['♻️', 'I will help to recycle at home'], ['📚', 'I will tell my friends about the ocean']], name));
  pages.push(traceWordsPage(paper, 'Trace the ocean words', [['ocean', '🌊'], ['whale', '🐳'], ['shell', '🐚'], ['fish', '🐠']]));
  pages.push(seasonColour(paper, 'whale', name));
  pages.push(seasonColour(paper, 'octopus', name));
  pages.push(seriesCert(paper, 'OCEAN EXPLORER', 'Ocean Explorer', name, 'for diving deep and caring for our ocean!', 'Next adventure: Dinosaur Explorer or Space Academy!', ring));
  return pages;
}

// ================================================================ Little Gardener kit (Plus)
function plantDiagram(pg, cx, top, h, c) {
  const s = h / 200, X = (v) => cx + (v - 100) * s, Y = (v) => top + v * s;
  let out = `<path d="M${X(20)} ${Y(128)} H${X(180)}" stroke="#8a6a4a" stroke-width="1.2"/><rect x="${X(20)}" y="${Y(128)}" width="${180 * s - 20 * s}" height="${60 * s}" fill="#f4ece2"/>`;
  out += `<path d="M${X(100)} ${Y(128)} V${Y(52)}" stroke="#2e9d62" stroke-width="${3 * s * 2}"/>`;
  out += `<path d="M${X(100)} ${Y(96)} C${X(70)} ${Y(80)} ${X(56)} ${Y(92)} ${X(52)} ${Y(104)} C${X(70)} ${Y(108)} ${X(88)} ${Y(104)} ${X(100)} ${Y(96)} Z" fill="#7fd18f" stroke="#1f1b2e" stroke-width="0.6"/>`;
  out += `<path d="M${X(100)} ${Y(82)} C${X(130)} ${Y(66)} ${X(144)} ${Y(78)} ${X(148)} ${Y(90)} C${X(130)} ${Y(94)} ${X(112)} ${Y(90)} ${X(100)} ${Y(82)} Z" fill="#7fd18f" stroke="#1f1b2e" stroke-width="0.6"/>`;
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; out += `<ellipse cx="${X(100) + Math.cos(a) * 16 * s}" cy="${Y(40) + Math.sin(a) * 16 * s}" rx="${10 * s}" ry="${6 * s}" fill="${c}" stroke="#1f1b2e" stroke-width="0.5" transform="rotate(${(a * 180) / Math.PI} ${X(100) + Math.cos(a) * 16 * s} ${Y(40) + Math.sin(a) * 16 * s})"/>`; }
  out += `<circle cx="${X(100)}" cy="${Y(40)}" r="${9 * s}" fill="#ffc83d" stroke="#1f1b2e" stroke-width="0.5"/>`;
  out += `<path d="M${X(100)} ${Y(128)} L${X(84)} ${Y(160)} M${X(100)} ${Y(128)} L${X(100)} ${Y(176)} M${X(100)} ${Y(128)} L${X(118)} ${Y(164)} M${X(90)} ${Y(148)} L${X(76)} ${Y(150)} M${X(110)} ${Y(148)} L${X(126)} ${Y(146)}" stroke="#8a6a4a" stroke-width="${1.6 * s * 2}" stroke-linecap="round"/>`;
  return out;
}

function makeGarden(o, paper) {
  const name = nameOf(o.name, '') || '';
  const plant = String(o.plant || '').trim().slice(0, 18) || 'bean';
  const ring = '#2e9d62', tint = '#f1f8e6';
  const pages = [seriesCover(paper, 'LITTLE GARDENER', name ? `${possessive(name)} garden book` : 'My garden book', 'Plant it, water it, watch it grow!', ['🌱', '🌻', '🐝', '🐛', '🌷', '💧'], ring, tint, 'garden book', [`My ${plant} diary`, 'Growth chart', 'Parts of a plant', 'What plants need', 'Garden bug hunt', 'Green Fingers award'])];
  // Seed diary.
  {
    const pg = new Page(paper, `My ${plant} diary`, { subtitle: 'Look at your plant every few days. Draw what you see and write one word about it.' });
    const days = ['Day 1: I planted it!', 'Day 3', 'Day 5', 'Day 7', 'Day 10', 'Day 14'], cw = pg.width / 2, ch = pg.room / 3;
    days.forEach((d, i) => { const x = pg.left + (i % 2) * cw, y = pg.y + Math.floor(i / 2) * ch, c = PALETTE[i % PALETTE.length]; pg.add(panel(x + 2, y + 2, cw - 4, ch - 4, '#fff', c, 10) + txt(x + 10, y + 12, d, 6.4, { anchor: 'start', colour: c }) + `<rect x="${x + 10}" y="${y + 17}" width="${cw - 24}" height="${ch - 38}" rx="6" fill="${TINTS[i % TINTS.length]}" stroke="${c}" stroke-width="0.4" stroke-dasharray="2 1.6"/>` + txt(x + 10, y + ch - 10, 'One word:', 5, { anchor: 'start', font: FONT, colour: SOFT }) + `<line x1="${x + 34}" x2="${x + cw - 12}" y1="${y + ch - 9.4}" y2="${y + ch - 9.4}" stroke="#c9c3e3" stroke-width="0.5"/>`); });
    pages.push(pg.svg());
  }
  // Growth chart.
  {
    const pg = new Page(paper, 'How tall did it grow?', { subtitle: `Measure your ${plant} with a ruler and colour the bar up to its height. Watch it climb!` });
    const cols = 8, rows = 15, lw = 14, bh = pg.room - 22, cw = (pg.width - lw) / cols, rh = bh / rows;
    for (let r = 0; r <= rows; r++) { const y = pg.y + r * rh; pg.add(`<line x1="${pg.left + lw}" x2="${pg.right}" y1="${y}" y2="${y}" stroke="${r % 5 ? '#e2ddf2' : '#b9b3d6'}" stroke-width="0.4"/>`); if ((rows - r) % 5 === 0) pg.add(txt(pg.left + lw - 3, y + 1.6, `${rows - r} cm`, 4.4, { anchor: 'end', font: FONT, colour: SOFT })); }
    for (let k = 0; k < cols; k++) { const x = pg.left + lw + k * cw; pg.add(`<rect x="${x + cw * 0.18}" y="${pg.y}" width="${cw * 0.64}" height="${bh}" fill="none" stroke="#d9d4ec" stroke-width="0.4"/>` + txt(x + cw / 2, pg.y + bh + 7, `Week ${k + 1}`, 4.6, { colour: PALETTE[k % PALETTE.length] }) + emoji('🌱', x + cw / 2, pg.y + bh + 15, 6)); }
    pages.push(pg.svg());
  }
  // Parts of a plant.
  {
    const pg = new Page(paper, 'Parts of a plant', { subtitle: 'Write the right word in each box. Then colour the plant!' });
    const h = pg.room - 36, cx = pg.left + pg.width * 0.44;
    pg.add(plantDiagram(pg, cx, pg.y, h, '#ff9ec7'));
    const s = h / 200, labels = [[40, 'flower'], [86, 'leaf'], [66, 'stem'], [160, 'roots']];
    labels.forEach(([yy, w], i) => { const y = pg.y + yy * s, bx = pg.right - 52; pg.add(`<line x1="${cx + (i === 3 ? 18 : i === 2 ? 2 : i === 1 ? 44 : 26) * s}" y1="${y}" x2="${bx}" y2="${y}" stroke="${PALETTE[i]}" stroke-width="0.6"/><rect x="${bx}" y="${y - 7}" width="50" height="14" rx="4" fill="#fff" stroke="${PALETTE[i]}" stroke-width="0.9"/>`); });
    const wb = pg.y + h + 8;
    pg.add(txt(pg.left, wb + 4, 'Word bank:', 6, { anchor: 'start', colour: ring }));
    ['flower', 'leaf', 'stem', 'roots'].forEach((w, i) => pg.add(`<rect x="${pg.left + 36 + i * 36}" y="${wb - 4}" width="32" height="12" rx="6" fill="${TINTS[i]}" stroke="${PALETTE[i]}" stroke-width="0.6"/>` + txt(pg.left + 52 + i * 36, wb + 4, w, 6, { colour: INK })));
    pages.push(pg.svg());
  }
  // What plants need.
  pages.push(tagsPage(paper, 'What plants need', 'Every plant needs these four things to grow. Colour them, cut them out and stick them by your plant!', 4, 2, (pg, x, y, w, h, i) => {
    const [e, t, d] = [['☀️', 'Sunlight', 'Plants make their food from light.'], ['💧', 'Water', 'A little drink, not too much!'], ['🟫', 'Soil', 'Roots hold on and find food here.'], ['🌬️', 'Air', 'Leaves breathe in the air.']][i], c = PALETTE[i];
    pg.add(`<rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="10" fill="${TINTS[i]}" stroke="${c}" stroke-width="1.1"/>` + emoji(e, x + w / 2, y + h * 0.36, h * 0.3) + txt(x + w / 2, y + h * 0.7, t, 11, { colour: c }) + txt(x + w / 2, y + h * 0.7 + 10, d, fitFont(d, 5.4, w - 16, 0.5), { font: FONT, weight: 700, colour: INK }));
  }));
  pages.push(picGridPage(paper, 'Garden bug hunt', 'Tiptoe round the garden or park. Cross off each little creature you find, then let it go!', [['🐞', 'Ladybird'], ['🐝', 'Bee'], ['🦋', 'Butterfly'], ['🐛', 'Caterpillar'], ['🐌', 'Snail'], ['🐜', 'Ant'], ['🕷️', 'Spider'], ['🪱', 'Worm'], ['🦗', 'Grasshopper'], ['🪲', 'Beetle'], ['🐦', 'Bird'], ['🕸️', 'Web'], ['🪰', 'Fly'], ['🌸', 'Flower visitor'], ['🍃', 'Nibbled leaf'], ['🦔', 'Hedgehog signs']]));
  pages.push(checklistPage(paper, 'Little gardener jobs', 'Real gardeners do these jobs. Colour a star each time you help!', [['💧', 'Water the plants'], ['🌱', 'Plant a seed'], ['🍂', 'Sweep up leaves'], ['🪱', 'Find a worm and put it back'], ['🌼', 'Pick a flower for someone (ask first!)'], ['🥕', 'Help to pick something to eat'], ['🐦', 'Fill the bird feeder'], ['🧤', 'Pull out weeds with a grown-up']], name));
  pages.push(traceWordsPage(paper, 'Trace the garden words', [['seed', '🌱'], ['root', '🥕'], ['leaf', '🍃'], ['grow', '🌻']]));
  pages.push(seasonColour(paper, 'sunflower', name));
  pages.push(seasonColour(paper, 'butterfly', name));
  pages.push(seriesCert(paper, 'LITTLE GARDENER', 'Green Fingers Award', name, `for growing a ${plant} and caring for living things!`, 'Next: plant something new each season!', ring));
  return pages;
}

// ================================================================ Love and Kindness pack (Plus)
const KIND_ACTS = ['Give someone a big hug', 'Say thank you to your teacher', 'Draw a picture for a friend', 'Help to set the table', 'Share a toy', 'Tell someone why you love them', 'Make someone laugh', 'Tidy up without being asked',
  'Hold the door open', 'Smile at everyone you meet', 'Call a grandparent', 'Help a friend who is sad', 'Give a compliment', 'Water a plant', 'Leave a kind note', 'Let someone else go first',
  'Say sorry and mean it', 'Read to a younger child', 'Help to carry the shopping', 'Make a card for a neighbour', 'Feed the birds', 'Play with someone new', 'Say three kind things about yourself', 'Help with the washing up',
  'Give someone a high five', 'Write a thank you note', 'Share your snack', 'Be kind to yourself today'];
const KIND_NOTES = ['You make me smile!', 'I love you to the moon and back', 'You are my sunshine', 'You are one of a kind', 'Thank you for being you', 'You give the best hugs', 'You make every day better', 'You are my favourite!'];

function makeKindness(o, paper) {
  const rand = rng(+o.seed || 1);
  const name = nameOf(o.name, '') || '';
  const lk = { pink: { ring: '#e0457b', tint: '#fff0f5' }, rainbow: { ring: '#8a3fd1', tint: '#f5edff' } }[o.look] || { ring: '#e0457b', tint: '#fff0f5' };
  const pages = [seriesCover(paper, 'LOVE AND KINDNESS', name ? `${possessive(name)} kindness book` : 'My kindness book', 'Spread a little love every day', ['💗', '🤗', '🌈', '💌', '😊', '🌷'], lk.ring, lk.tint, 'book', ['28 day kindness calendar', 'Love notes to give', 'I love you because', 'Compliment cards', 'Kindness bingo', 'Kindness Champion award'])];
  // 28 day calendar.
  {
    const pg = new Page(paper, '28 days of kindness', { subtitle: 'One little act of kindness each day. Colour the heart when you have done it!' });
    const cols = 4, rows = 7, cw = pg.width / cols, ch = pg.room / rows;
    KIND_ACTS.forEach((a, i) => { const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch, c = PALETTE[i % PALETTE.length]; pg.add(panel(x + 1.5, y + 1.5, cw - 3, ch - 3, TINTS[i % TINTS.length], c, 7) + txt(x + 7, y + 9, `${i + 1}`, 7, { anchor: 'start', colour: c })); const hx = x + cw - 10, hy = y + 8, s = 4.6; pg.add(`<path d="M${hx} ${hy + s * 0.9} C${hx - s * 1.4} ${hy} ${hx - s * 0.8} ${hy - s * 0.9} ${hx} ${hy - s * 0.3} C${hx + s * 0.8} ${hy - s * 0.9} ${hx + s * 1.4} ${hy} ${hx} ${hy + s * 0.9} Z" fill="#fff" stroke="${c}" stroke-width="0.7"/>`); wrap(a, 18).slice(0, 3).forEach((l, k) => pg.add(txt(x + cw / 2, y + ch * 0.5 + k * 5.6, l, 4.8, { font: FONT, weight: 700, colour: INK }))); });
    pages.push(pg.svg());
  }
  pages.push(tagsPage(paper, 'Love notes to give', 'Colour, cut out and hide these notes in lunch boxes, pockets and under pillows!', 8, 2, (pg, x, y, w, h, i) => {
    const c = PALETTE[i % PALETTE.length], t = KIND_NOTES[i];
    pg.add(`<rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="8" fill="${TINTS[i % TINTS.length]}" stroke="${c}" stroke-width="0.9"/>` + emoji(['💗', '🌙', '☀️', '⭐', '🌷', '🤗', '🌈', '🏆'][i], x + 16, y + h / 2, h * 0.3));
    wrap(t, 20).forEach((l, k, all) => pg.add(txt(x + w / 2 + 10, y + h / 2 + 2 - (all.length - 1) * 4.4 + k * 8.8, l, fitFont(l, 7.4, w - 44, 0.55), { colour: c })));
    pg.add(txt(x + w - 12, y + h - 9, 'Love from ________', 4.4, { anchor: 'end', font: FONT, colour: SOFT }));
  }));
  // I love you because.
  {
    const pg = new Page(paper, 'I love you because...', { subtitle: 'Think of the people you love. Draw them and finish each sentence. Then give this page to one of them!' });
    const who = [0, 1, 2, 3], bh = pg.room / 4;
    who.forEach((w, i) => { const y = pg.y + i * bh, c = PALETTE[i % PALETTE.length]; pg.add(panel(pg.left, y + 2, pg.width, bh - 5, '#fff', c, 10) + `<rect x="${pg.left + 6}" y="${y + 7}" width="${bh - 15}" height="${bh - 15}" rx="8" fill="${TINTS[i]}" stroke="${c}" stroke-width="0.5" stroke-dasharray="2 1.6"/>` + txt(pg.left + bh, y + 16, 'I love ______________ because', 6.6, { anchor: 'start', colour: c })); for (let l = 1; l <= 2; l++) pg.add(`<line x1="${pg.left + bh}" x2="${pg.right - 8}" y1="${y + 16 + l * (bh - 22) / 2.3}" y2="${y + 16 + l * (bh - 22) / 2.3}" stroke="#c9c3e3" stroke-width="0.45"/>`); });
    pages.push(pg.svg());
  }
  pages.push(tagsPage(paper, 'Compliment cards', 'Kind words are like little gifts. Give these to people who make your world brighter!', 6, 2, (pg, x, y, w, h, i) => {
    const t = ['You are a super friend', 'You are so brave', 'You are really clever', 'You are brilliant at helping', 'You have a kind heart', 'You make the best jokes'][i], c = PALETTE[(i + 2) % PALETTE.length];
    pg.add(`<rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="10" fill="#fff" stroke="${c}" stroke-width="1"/>` + txt(x + w / 2, y + 16, 'A COMPLIMENT FOR YOU', 4.4, { font: FONT, colour: SOFT }).replace('<text ', '<text letter-spacing="0.8" ') + emoji('✨', x + w / 2, y + 28, 9));
    wrap(t, 18).forEach((l, k, all) => pg.add(txt(x + w / 2, y + h / 2 + 8 - (all.length - 1) * 5 + k * 10, l, fitFont(l, 9, w - 24, 0.56), { colour: c })));
    pg.add(txt(x + w / 2, y + h - 12, 'From ______________', 5, { font: FONT, colour: SOFT }));
  }));
  pages.push(picGridPage(paper, 'Kindness bingo', 'Cross off each kind thing you do. Can you get four in a row?', [['🤗', 'Give a hug'], ['😊', 'Smile at someone'], ['🧸', 'Share a toy'], ['🙏', 'Say thank you'], ['📞', 'Call family'], ['🍪', 'Share a snack'], ['🧹', 'Help tidy'], ['💌', 'Write a note'], ['🌷', 'Give a flower'], ['🎨', 'Draw for someone'], ['👋', 'Say hello'], ['🐦', 'Feed the birds'], ['😂', 'Make someone laugh'], ['🙋', 'Offer help'], ['📖', 'Read together'], ['💗', 'Be kind to you']]));
  pages.push(countRowsPage(paper, 'Count the love', ['💗', '🌷', '💌', '🧸', '🌈', '😊'], rand));
  pages.push(traceWordsPage(paper, 'Trace the kind words', [['love', '💗'], ['kind', '🌈'], ['hug', '🤗'], ['care', '🌷']]));
  pages.push(seasonColour(paper, 'hearts', name));
  pages.push(seasonColour(paper, 'teddy', name));
  pages.push(seriesCert(paper, 'LOVE AND KINDNESS', 'Kindness Champion', name, 'for filling the world with love, hugs and kind words!', 'Keep going: one kind act every single day!', lk.ring));
  return pages;
}

// ================================================================ Lunar New Year pack (Plus)
const ZODIAC = [
  ['🐭', 'Rat', 'clever and quick'], ['🐮', 'Ox', 'strong and hard working'], ['🐯', 'Tiger', 'brave and bold'], ['🐰', 'Rabbit', 'gentle and kind'],
  ['🐲', 'Dragon', 'powerful and lucky'], ['🐍', 'Snake', 'wise and calm'], ['🐴', 'Horse', 'full of energy'], ['🐐', 'Goat', 'caring and creative'],
  ['🐵', 'Monkey', 'playful and funny'], ['🐔', 'Rooster', 'honest and an early riser'], ['🐶', 'Dog', 'loyal and friendly'], ['🐷', 'Pig', 'generous and cheerful'],
];
const zodiacOf = (y) => ZODIAC[(((y - 2020) % 12) + 12) % 12];

function makeLunar(o, paper) {
  const rand = rng(+o.seed || 1);
  const name = nameOf(o.name, '') || '';
  const now = new Date(), yr = now.getMonth() >= 2 ? now.getFullYear() + 1 : now.getFullYear(), [ye, yn] = zodiacOf(yr);
  const ring = '#d62f2f', tint = '#fff3e6';
  const pages = [seriesCover(paper, 'HAPPY LUNAR NEW YEAR', name ? `${possessive(name)} Lunar New Year` : 'My Lunar New Year', `The Year of the ${yn}, ${yr}`, ['🏮', ye, '🧧', '🍊', '🥟', '🎆'], ring, tint, 'book', ['The Great Race', 'Find my animal', 'Red envelope to fold', 'Paper lantern craft', 'New year wishes', 'Lucky counting'])];
  // The Great Race: 12 animal cards.
  for (let p = 0; p < 12; p += 6) pages.push(tagsPage(paper, p ? 'The Great Race (part 2)' : 'The Great Race', p ? 'Keep going! Can you remember who came first?' : 'Long ago, twelve animals raced across a river. The order they finished gave each year its animal! Read the cards in order.', 6, 2, (pg, x, y, w, h, i) => {
    const [e, nm, trait] = ZODIAC[p + i];
    pg.add(`<rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="9" fill="${tint}" stroke="${ring}" stroke-width="1"/><circle cx="${x + 16}" cy="${y + 16}" r="7" fill="${ring}"/>` + txt(x + 16, y + 18.6, `${p + i + 1}`, 7, { colour: '#fff' }));
    pg.add(emoji(e, x + w * 0.25, y + h * 0.58, Math.min(h * 0.4, w * 0.34)) + txt(x + w * 0.48, y + h * 0.5, nm, fitFont(nm, 11, w * 0.46, 0.58), { anchor: 'start', colour: ring }));
    wrap(trait, 14).forEach((l, k) => pg.add(txt(x + w * 0.48, y + h * 0.5 + 8 + k * 6, l, 5.2, { anchor: 'start', font: FONT, weight: 700, colour: INK })));
  }));
  // Find my animal.
  {
    const pg = new Page(paper, 'Find my animal', { subtitle: 'Find the year you were born. That is your animal! Born in January or early February? Ask a grown-up, you might be the animal before.' });
    const years = []; for (let y = yr - 13; y <= yr; y++) years.push(y);
    const cols = 2, rows = Math.ceil(years.length / cols), cw = pg.width / cols, rh = Math.min(20, (pg.room - 70) / rows);
    years.forEach((y, i) => { const x = pg.left + Math.floor(i / rows) * cw, yy = pg.y + (i % rows) * rh, [e, nm] = zodiacOf(y), c = PALETTE[i % PALETTE.length]; pg.add(panel(x + 2, yy + 1, cw - 4, rh - 2, y === yr ? '#ffe0e0' : TINTS[i % TINTS.length], y === yr ? ring : c, 6) + txt(x + 10, yy + rh / 2 + 2.4, `${y}`, 7, { anchor: 'start', colour: c }) + emoji(e, x + cw * 0.45, yy + rh / 2, rh * 0.6) + txt(x + cw * 0.55, yy + rh / 2 + 2.4, nm, 7, { anchor: 'start', colour: INK })); });
    pg.y += rows * rh + 8;
    const bh = pg.room - 2;
    pg.add(panel(pg.left, pg.y, pg.width, bh, '#fff', ring, 12) + txt(pg.left + 10, pg.y + 13, name ? `${name} is a` : 'My animal is the', 7, { anchor: 'start', colour: ring }) + `<line x1="${pg.left + 64}" x2="${pg.left + pg.width * 0.55}" y1="${pg.y + 13.6}" y2="${pg.y + 13.6}" stroke="#c9c3e3" stroke-width="0.5"/>` + txt(pg.left + 10, pg.y + 26, 'Draw your animal here!', 5.4, { anchor: 'start', font: FONT, colour: SOFT }));
    pages.push(pg.svg());
  }
  // Red envelope.
  {
    const pg = new Page(paper, 'Make a red envelope', { subtitle: 'Colour it red and gold, cut along the outside, fold the side flaps in, then the bottom flap up, and glue. Pop a wish inside!', noName: true });
    const w = 80, h = 128, cx = pg.w / 2, y = pg.y + 32, x = cx - w / 2, f = 28;
    pg.add(`<path d="M${x} ${y} H${x + w} L${x + w + f} ${y + 10} V${y + h - 10} L${x + w} ${y + h} L${x + w - 6} ${y + h + f * 1.6} H${x + 6} L${x} ${y + h} L${x - f} ${y + h - 10} V${y + 10} Z M${x} ${y} L${x + 8} ${y - f} H${x + w - 8} L${x + w} ${y}" fill="#fff" stroke="#1f1b2e" stroke-width="0.9" stroke-linejoin="round"/>`);
    pg.add(`<path d="M${x} ${y} V${y + h} H${x + w} V${y}" fill="none" stroke="#9a93b8" stroke-width="0.6" stroke-dasharray="3 2"/><line x1="${x}" y1="${y}" x2="${x + w}" y2="${y}" stroke="#9a93b8" stroke-width="0.6" stroke-dasharray="3 2"/>`);
    pg.add(`<circle cx="${cx}" cy="${y + h * 0.4}" r="16" fill="none" stroke="#1f1b2e" stroke-width="0.8"/>` + emoji(ye, cx, y + h * 0.4, 18) + txt(cx, y + h * 0.72, 'Happy New Year!', 6.6, { colour: ring }));
    pg.add(txt(pg.left, pg.bottom - 3, 'Fold on the dotted lines', 5.2, { anchor: 'start', font: FONT, colour: SOFT }) + txt(pg.right, pg.bottom - 3, 'Cut on the solid line', 5.2, { anchor: 'end', font: FONT, colour: SOFT }));
    pages.push(pg.svg());
  }
  // Paper lantern craft.
  {
    const pg = new Page(paper, 'Make a paper lantern', { subtitle: 'Colour the big sheet. Fold it in half along the long dotted line, cut the short lines, open it, roll it into a tube and glue. Add the handle!', noName: true });
    const w = pg.width, h = 110, x = pg.left, y = pg.y + 4;
    pg.add(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="#fff" stroke="#1f1b2e" stroke-width="0.9"/><line x1="${x}" x2="${x + w}" y1="${y + h / 2}" y2="${y + h / 2}" stroke="#9a93b8" stroke-width="0.6" stroke-dasharray="4 2"/>`);
    pg.add(`<rect x="${x}" y="${y}" width="${w}" height="12" fill="${tint}" stroke="#1f1b2e" stroke-width="0.5"/><rect x="${x}" y="${y + h - 12}" width="${w}" height="12" fill="${tint}" stroke="#1f1b2e" stroke-width="0.5"/>`);
    for (let k = 1; k < 16; k++) { const lx = x + (k * w) / 16; pg.add(`<line x1="${lx}" x2="${lx}" y1="${y + 16}" y2="${y + h / 2}" stroke="#1f1b2e" stroke-width="0.7"/>`); }
    for (let k = 0; k < 8; k++) pg.add(emoji(['🏮', '🌸', '🍊', '✨'][k % 4], x + 14 + k * (w - 28) / 7, y + h * 0.78, 9));
    pg.y = y + h + 14;
    pg.add(txt(pg.left, pg.y, 'Handle', 5.4, { anchor: 'start', font: FONT, colour: SOFT }) + `<rect x="${pg.left}" y="${pg.y + 4}" width="${w}" height="12" rx="2" fill="#fff" stroke="#1f1b2e" stroke-width="0.8"/>`);
    pg.y += 28;
    pg.add(txt(pg.left, pg.y, 'Tassel strips', 5.4, { anchor: 'start', font: FONT, colour: SOFT }));
    for (let k = 0; k < 6; k++) pg.add(`<rect x="${pg.left + k * (w / 6) + 4}" y="${pg.y + 4}" width="${w / 6 - 8}" height="${Math.max(20, pg.room - 10)}" rx="2" fill="#fff" stroke="#1f1b2e" stroke-width="0.6"/>`);
    pages.push(pg.svg());
  }
  // New year wishes.
  {
    const pg = new Page(paper, `My wishes for ${yr}`, { subtitle: 'Lunar New Year is a time for fresh starts and good wishes. Write or draw a wish in each lantern!' });
    const n = 6, cw = pg.width / 3, ch = pg.room / 2;
    for (let i = 0; i < n; i++) { const x = pg.left + (i % 3) * cw + cw / 2, y = pg.y + Math.floor(i / 3) * ch, c = i % 2 ? '#e8a317' : ring; pg.add(`<line x1="${x}" x2="${x}" y1="${y}" y2="${y + 8}" stroke="#1f1b2e" stroke-width="0.6"/><rect x="${x - 10}" y="${y + 8}" width="20" height="6" rx="1.5" fill="${c}"/><ellipse cx="${x}" cy="${y + ch * 0.46}" rx="${cw * 0.44}" ry="${ch * 0.34}" fill="#fff" stroke="${c}" stroke-width="1.2"/><rect x="${x - 10}" y="${y + ch * 0.8}" width="20" height="6" rx="1.5" fill="${c}"/><path d="M${x - 4} ${y + ch * 0.8 + 6} V${y + ch * 0.95} M${x} ${y + ch * 0.8 + 6} V${y + ch * 0.97} M${x + 4} ${y + ch * 0.8 + 6} V${y + ch * 0.95}" stroke="${c}" stroke-width="0.8"/>`); for (let l = 0; l < 3; l++) pg.add(`<line x1="${x - cw * 0.3}" x2="${x + cw * 0.3}" y1="${y + ch * (0.36 + l * 0.1)}" y2="${y + ch * (0.36 + l * 0.1)}" stroke="#e6d6c9" stroke-width="0.45"/>`); }
    pages.push(pg.svg());
  }
  pages.push(countRowsPage(paper, 'Lucky counting', ['🏮', '🍊', '🥟', '🧧', '🎆', '🐉'], rand));
  pages.push(traceWordsPage(paper, 'Trace the new year words', [['lantern', '🏮'], ['dragon', '🐉'], ['family', '🤗'], ['lucky', '🍊']]));
  pages.push(seasonColour(paper, 'paperlantern', name));
  pages.push(seasonCert(paper, 'Happy Lunar New Year!', name, `for celebrating the Year of the ${yn} with joy and kindness!`, 'paperlantern', ring));
  return pages;
}

Object.assign(MAKERS, { oceankit: makeOceanKit, garden: makeGarden, kindness: makeKindness, lunar: makeLunar });
