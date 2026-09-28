// PrintPals batch 18 (Plus stage 2): birthday time capsule, Diwali pack, thankful pack, and three more storybooks.

// ================================================================ more seasonal line art
Object.assign(SEASON_ART, {
  diya: { name: 'Diya lamp', draw: diyaArt },
  lantern: { name: 'Lantern', draw: () => [
    `<path d="M100 10 V30" ${LN}/><path d="M90 30 H110 L116 42 H84 Z" ${LW}/>`,
    `<path d="M84 42 L50 90 L100 160 L150 90 L116 42 Z" ${LW}/><path d="M50 90 H150 M84 42 L100 160 L116 42" ${LT}/>`,
    `<path d="M60 150 L64 186 M80 164 L82 192 M100 160 V194 M120 164 L118 192 M140 150 L136 186" ${LN}/>`,
    cStar(100, 86, 12), cStar(30, 40, 8), cStar(170, 44, 9), cStar(166, 130, 6), cStar(34, 128, 6),
  ].join('') },
  turkey: { name: 'Turkey', draw: () => [
    `<path d="M20 186 H180" ${LN}/>`,
    ...[-70, -45, -20, 0, 20, 45, 70].map((a) => `<ellipse cx="100" cy="68" rx="16" ry="50" transform="rotate(${a} 100 118)" ${LW}/>`),
    `<ellipse cx="100" cy="128" rx="44" ry="42" ${LW}/><circle cx="100" cy="88" r="24" ${LW}/>`,
    `<circle cx="92" cy="82" r="4" ${INKF}/><circle cx="108" cy="82" r="4" ${INKF}/><path d="M94 92 L106 92 L100 102 Z" ${LW}/><path d="M104 98 Q112 108 104 116" ${LW}/>`,
    `<path d="M84 168 L80 184 M76 184 H86 M116 168 L120 184 M114 184 H124" ${LN}/>`,
  ].join('') },
  leaves: { name: 'Autumn leaves', draw: () => [
    `<path d="M60 40 Q20 70 40 120 Q80 110 90 70 Q86 44 60 40 Z" ${LW}/><path d="M42 118 L78 58 M54 96 L70 98 M62 80 L78 80" ${LT}/>`,
    `<path d="M140 30 L150 58 L178 52 L160 76 L186 94 L156 98 L162 128 L140 108 L118 128 L124 98 L94 94 L120 76 L102 52 L130 58 Z" ${LW}/><path d="M140 108 L140 60" ${LT}/>`,
    `<path d="M70 150 Q100 120 140 150 Q110 190 70 150 Z" ${LW}/><path d="M70 150 L140 150" ${LT}/>`,
    `<circle cx="160" cy="170" r="12" ${LW}/><path d="M160 158 Q162 148 170 146" ${LN}/><circle cx="36" cy="170" r="10" ${LW}/>`,
  ].join('') },
  balloons: { name: 'Balloons', draw: () => [
    `<ellipse cx="70" cy="70" rx="30" ry="36" ${LW}/><ellipse cx="130" cy="62" rx="30" ry="36" ${LW}/><ellipse cx="100" cy="100" rx="30" ry="36" ${LW}/>`,
    `<path d="M66 104 l4 6 l4 -6 z M126 96 l4 6 l4 -6 z M96 134 l4 6 l4 -6 z" ${LW}/>`,
    `<path d="M70 110 Q80 150 100 190 M130 102 Q124 150 100 190 M100 140 Q96 166 100 190" ${LN}/>`,
    `<path d="M56 56 Q60 46 68 44 M116 48 Q120 38 128 36 M86 86 Q90 76 98 74" ${LT}/>`, cStar(30, 150, 8), cStar(170, 140, 9),
  ].join('') },
});

// Colouring pictures can come from the seasonal library too (used by the storybooks).
const plainColouringArt = colouringArt;
colouringArt = function (key) { return COLOURING[key] ? plainColouringArt(key) : SEASON_ART[key].draw(); };

// ================================================================ rangoli: a new symmetrical pattern every time
function rangoliArt(rand) {
  const pick = (arr) => arr[Math.floor(rand() * arr.length)];
  const n = pick([6, 8, 8, 10, 12]), out = [];
  const around = (k, off, f) => { for (let i = 0; i < k; i++) out.push(`<g transform="rotate(${(i / k) * 360 + off} 100 100)">${f()}</g>`); };
  // Outer border: scallops, points or a double ring.
  const border = pick(['scallop', 'points', 'double']), m = n * 2;
  if (border === 'double') out.push(`<circle cx="100" cy="100" r="94" ${LW}/><circle cx="100" cy="100" r="86" ${LN}/>`);
  else {
    let d = '';
    for (let i = 0; i <= m; i++) {
      const a = (i / m) * 2 * Math.PI, h = a - Math.PI / m, x = 100 + 84 * Math.cos(a), y = 100 + 84 * Math.sin(a);
      d += i ? (border === 'scallop' ? ` Q${100 + 100 * Math.cos(h)} ${100 + 100 * Math.sin(h)} ${x} ${y}` : ` L${100 + 97 * Math.cos(h)} ${100 + 97 * Math.sin(h)} L${x} ${y}`) : `M${x} ${y}`;
    }
    out.push(`<path d="${d} Z" ${LW}/>`);
  }
  // Outer ring decoration.
  const dots = pick(['dots', 'drops', 'hearts']);
  around(m, 0, () => dots === 'dots' ? `<circle cx="100" cy="24" r="4" ${LW}/>` : dots === 'drops' ? `<path d="M100 18 Q106 26 100 32 Q94 26 100 18 Z" ${LW}/>` : `<path d="M100 32 C92 26 94 18 100 22 C106 18 108 26 100 32 Z" ${LW}/>`);
  // Big petals: round, pointed or leaf shaped.
  const petal = pick(['round', 'pointed', 'leaf']), len = 24 + rand() * 12, wid = 8 + rand() * 6, base = 100 - 30;
  around(n, 0, () => petal === 'round' ? `<ellipse cx="100" cy="${base - len / 2}" rx="${wid}" ry="${len / 2}" ${LW}/>`
    : petal === 'pointed' ? `<path d="M100 ${base} Q${100 + wid * 1.4} ${base - len * 0.5} 100 ${base - len} Q${100 - wid * 1.4} ${base - len * 0.5} 100 ${base} Z" ${LW}/><path d="M100 ${base - 4} V${base - len + 6}" ${LT}/>`
    : `<path d="M100 ${base} C${100 + wid * 1.6} ${base - len * 0.2} ${100 + wid} ${base - len * 0.9} 100 ${base - len} C${100 - wid} ${base - len * 0.9} ${100 - wid * 1.6} ${base - len * 0.2} 100 ${base} Z" ${LW}/>`);
  // Small petals between the big ones.
  if (rand() < 0.7) around(n, 180 / n, () => `<path d="M100 ${base + 2} L${104} ${base - 10} L100 ${base - 20} L96 ${base - 10} Z" ${LW}/>`);
  // Inner ring and centre.
  const inner = pick(['flower', 'star', 'rings']);
  out.push(`<circle cx="100" cy="100" r="26" ${LW}/>`);
  if (inner === 'flower') around(n, 0, () => `<ellipse cx="100" cy="86" rx="4.5" ry="9" ${LW}/>`);
  if (inner === 'rings') out.push(`<circle cx="100" cy="100" r="18" ${LN}/>`);
  out.push(inner === 'star' ? cStar(100, 100, 18, 0.5) : `<circle cx="100" cy="100" r="7" ${LW}/>`);
  return out.join('');
}

// ================================================================ Diwali pack (Plus)
function makeDiwali(o, paper) {
  const rand = rng(+o.seed || 1);
  const name = nameOf(o.name, '');
  const age = +o.age || 5;
  const lvl = age <= 4 ? 'easy' : age <= 6 ? 'medium' : 'hard';
  const lk = { marigold: { ring: '#ff8a3d', tint: '#fff6ec', corners: ['🪔', '🌼', '✨', '🪔'], cols: ['#ff8a3d', '#e0457b', '#ffb938'] },
    jewel: { ring: '#8a3fd1', tint: '#f5edff', corners: ['🪔', '💜', '✨', '🎆'], cols: ['#8a3fd1', '#3fbfa8', '#e0457b'] },
    peacock: { ring: '#1f9fa8', tint: '#e8f8f4', corners: ['🦚', '🪔', '✨', '🌸'], cols: ['#1f9fa8', '#3a64d8', '#2e9d62'] } }[o.look] || { ring: '#ff8a3d', tint: '#fff6ec', corners: ['🪔', '🌼', '✨', '🪔'], cols: ['#ff8a3d', '#e0457b', '#ffb938'] };
  const pages = [];
  pages.push(seasonCover(paper, name ? `${possessive(name)} Diwali activity pack` : 'My Diwali activity pack', 'The festival of lights', 'diya', lk.tint, lk.ring, lk.corners, 'pack'));
  for (let i = 0; i < 3; i++) {
    const pg = new Page(paper, '', { bare: true });
    bubbleText(pg, i ? 'Colour another rangoli' : (name ? `${name} colours a rangoli` : 'Colour the rangoli'), pg.w / 2, pg.m + 16, pg.width - 10, 15);
    const s = Math.min(pg.width - 8, pg.bottom - pg.m - 34);
    pg.add(`<g transform="translate(${pg.w / 2 - s / 2} ${pg.m + 26}) scale(${(s / 200).toFixed(4)})">${rangoliArt(rand)}</g>`);
    pages.push(pg.svg());
  }
  ['diya', 'lantern'].forEach((k) => pages.push(seasonColour(paper, k, name)));
  // Finish the rangoli: draw the other half.
  {
    const pg = new Page(paper, 'Finish the rangoli', { subtitle: 'Rangoli patterns are the same on both sides. Copy the left half onto the right half, then colour it in!' });
    const s = Math.min(pg.width, pg.room - 4);
    pg.add(`<defs><clipPath id="half"><rect x="0" y="0" width="100" height="200"/></clipPath></defs>`);
    pg.add(`<g transform="translate(${pg.w / 2 - s / 2} ${pg.y}) scale(${(s / 200).toFixed(4)})"><g clip-path="url(#half)">${rangoliArt(rand)}</g><path d="M100 0 V200" stroke="#b9b3d6" stroke-width="0.8" stroke-dasharray="3 3"/>${[...Array(9).keys()].map((k) => [...Array(9).keys()].map((j) => `<circle cx="${104 + j * 11}" cy="${12 + k * 22}" r="0.9" fill="#c9c3e3"/>`).join('')).join('')}</g>`);
    pages.push(pg.svg());
  }
  pages.push(countRowsPage(paper, 'Count the Diwali lights', ['🪔', '✨', '🌼', '🎆', '🍬', '⭐'], rand));
  pages.push(traceWordsPage(paper, 'Trace the Diwali words', [['light', '🪔'], ['family', '👨‍👩‍👧'], ['sweets', '🍬'], ['happy', '😊']]));
  pages.push(...packRun('wordsearch', { title: 'Diwali word search', words: age <= 4 ? 'DIYA, LAMP, LIGHT, JOY, STAR, GIFT' : 'DIWALI, DIYA, RANGOLI, LIGHTS, SWEETS, FAMILY, LANTERN, CANDLE, FIREWORKS, FLOWERS', size: age <= 4 ? '8' : age <= 6 ? '10' : '12', level: lvl }, paper, +o.seed || 1).sheets);
  pages.push(tagsPage(paper, 'Diwali sweet box labels', 'Colour and cut out. Stick them on boxes of sweets for family and friends!', 8, 2, (pg, x, y, w, h, i) => {
    pg.add(emoji(['🪔', '🌼', '✨', '🎆'][i % 4], x + 16, y + h / 2, Math.min(22, h * 0.5)));
    pg.add(txt(x + 32, y + h * 0.38, 'Happy Diwali!', 8, { anchor: 'start', colour: lk.cols[i % 3] }));
    pg.add(txt(x + 32, y + h * 0.62, 'To ____________', 4.6, { anchor: 'start', font: FONT }) + txt(x + 32, y + h * 0.8, name ? `From ${name}` : 'From ____________', 4.6, { anchor: 'start', font: FONT }));
  }));
  pages.push(...packRun('cards', { card: 'diwali', name, to: '' }, paper, 1).sheets);
  pages.push(...buntingPages(paper, 'Happy Diwali', lk.cols));
  pages.push(seasonCert(paper, 'Little Light Award', name, 'for spreading light, kindness and joy this Diwali!', 'diya', lk.ring));
  return pages;
}

// ================================================================ Thankful pack (Thanksgiving and harvest) (Plus)
function makeThankful(o, paper) {
  const rand = rng(+o.seed || 1);
  const name = nameOf(o.name, '');
  const age = +o.age || 5;
  const lvl = age <= 4 ? 'easy' : age <= 6 ? 'medium' : 'hard';
  const thanks = o.occasion === 'harvest' ? 'Harvest' : 'Thanksgiving';
  const lk = { autumn: { ring: '#c0662b', tint: '#fff6ec', art: 'turkey', corners: ['🍂', '🦃', '🍁', '🥧'], cols: ['#c0662b', '#e0453b', '#ffb938'] },
    cosy: { ring: '#8a3fd1', tint: '#f5edff', art: 'leaves', corners: ['🍂', '☕', '🧣', '🍁'], cols: ['#8a3fd1', '#c0662b', '#2e9d62'] },
    pumpkin: { ring: '#ff8a3d', tint: '#fff6e0', art: 'pumpkin', corners: ['🎃', '🍎', '🌽', '🍂'], cols: ['#ff8a3d', '#2e9d62', '#e0453b'] } }[o.look] || { ring: '#c0662b', tint: '#fff6ec', art: 'turkey', corners: ['🍂', '🦃', '🍁', '🥧'], cols: ['#c0662b', '#e0453b', '#ffb938'] };
  const pages = [];
  pages.push(seasonCover(paper, name ? `${possessive(name)} thankful pack` : 'My thankful pack', `A ${thanks.toLowerCase()} of kindness`, lk.art, lk.tint, lk.ring, lk.corners, 'pack'));
  // Thankful turkey: write on each feather.
  {
    const pg = new Page(paper, 'My thankful turkey', { subtitle: 'Write or draw one thing you are thankful for on each feather, then colour it in!' });
    const s = Math.min(pg.width * 0.72, pg.room - 4), cx = pg.w / 2, top = pg.y + 6, k = s / 200;
    const feathers = [-72, -48, -24, 0, 24, 48, 72];
    pg.add(`<g transform="translate(${cx - s / 2} ${top}) scale(${k.toFixed(4)})">${feathers.map((a) => `<ellipse cx="100" cy="60" rx="17" ry="56" transform="rotate(${a} 100 128)" ${LW}/>`).join('')}<ellipse cx="100" cy="140" rx="42" ry="40" ${LW}/><circle cx="100" cy="100" r="24" ${LW}/><circle cx="92" cy="94" r="4" ${INKF}/><circle cx="108" cy="94" r="4" ${INKF}/><path d="M94 104 L106 104 L100 114 Z" ${LW}/><path d="M104 110 Q112 120 104 128" ${LW}/><path d="M86 178 L82 194 M114 178 L118 194" ${LN}/></g>`);
    pg.add(txt(cx, top + 150 * k, name ? `${name} is thankful!` : 'I am thankful!', 5.4 * k * 1.4, { colour: lk.ring }));
    feathers.forEach((a2, i) => { const r = (a2 * Math.PI) / 180; pg.add(txt(cx + Math.sin(r) * 96 * k, top + (128 - Math.cos(r) * 96) * k, i + 1, 5, { colour: lk.cols[i % 3] })); });
    const ly = top + s + 6, lh = Math.min(11, (pg.bottom - ly - 4) / 7);
    for (let i = 0; i < 7; i++) pg.add(txt(pg.left + 4, ly + i * lh + lh * 0.6, `${i + 1}.`, 5, { anchor: 'start', colour: lk.cols[i % 3] }) + `<line x1="${pg.left + 12}" x2="${pg.right}" y1="${ly + i * lh + lh * 0.7}" y2="${ly + i * lh + lh * 0.7}" stroke="#c9c3e3" stroke-width="0.45"/>`);
    pages.push(pg.svg());
  }
  // Thankful leaves to cut out for a thankful tree.
  pages.push(tagsPage(paper, 'Thankful leaves', 'Cut out the leaves. Each day, write one thing you are thankful for and stick it on a paper tree or the fridge.', 9, 3, (pg, x, y, w, h, i) => {
    const cx = x + w / 2, cy = y + h / 2, s = Math.min(w * 0.62, h * 0.44);
    pg.add(`<path d="M${cx} ${cy - s} Q${cx + s * 1.5} ${cy - s * 0.1} ${cx} ${cy + s} Q${cx - s * 1.5} ${cy - s * 0.1} ${cx} ${cy - s} Z" fill="${TINTS[i % TINTS.length]}" stroke="${lk.cols[i % 3]}" stroke-width="0.8"/><path d="M${cx} ${cy - s * 0.8} V${cy + s * 0.9}" stroke="${lk.cols[i % 3]}" stroke-width="0.4"/>`);
    pg.add(txt(cx, cy - s * 0.3, 'I am thankful for', 3.8, { font: FONT, colour: SOFT }).replace('<text ', '<text paint-order="stroke" stroke="#fff" stroke-width="1.2" '));
    for (let l = 0; l < 2; l++) pg.add(`<line x1="${cx - s * 0.55}" x2="${cx + s * 0.55}" y1="${cy + l * 8}" y2="${cy + l * 8}" stroke="#c9c3e3" stroke-width="0.4"/>`);
  }));
  ['turkey', 'leaves', 'pumpkin'].forEach((k) => pages.push(seasonColour(paper, k, name)));
  pages.push(countRowsPage(paper, `Count the ${thanks.toLowerCase()} things`, ['🍂', '🍎', '🌽', '🥧', '🦃', '🍁'], rand));
  pages.push(...packRun('wordsearch', { title: `${thanks} word search`, words: age <= 4 ? 'LEAF, PIE, CORN, HUG, FOOD, JOY' : 'THANKFUL, FAMILY, HARVEST, AUTUMN, LEAVES, PUMPKIN, TURKEY, FRIENDS, KINDNESS, FEAST', size: age <= 4 ? '8' : age <= 6 ? '10' : '12', level: lvl }, paper, +o.seed || 1).sheets);
  // Place cards for the family table.
  pages.push(tagsPage(paper, 'Place cards for the table', 'Fold each card in half along the dotted line, write a name on the front and a kind message inside.', 6, 2, (pg, x, y, w, h, i) => {
    pg.add(`<line x1="${x + 4}" x2="${x + w - 4}" y1="${y + h / 2}" y2="${y + h / 2}" stroke="#b9b3d6" stroke-width="0.5" stroke-dasharray="2 1.5"/>`);
    pg.add(txt(x + w / 2, y + h * 0.28, 'I am thankful for you because', 4, { font: FONT, colour: SOFT }).replace('<text ', `<text transform="rotate(180 ${x + w / 2} ${y + h * 0.24})" `));
    pg.add(emoji(lk.corners[i % 4], x + 12, y + h * 0.75, 10) + `<line x1="${x + 24}" x2="${x + w - 8}" y1="${y + h * 0.8}" y2="${y + h * 0.8}" stroke="#c9c3e3" stroke-width="0.45"/>`);
  }));
  pages.push(...buntingPages(paper, thanks === 'Harvest' ? 'Happy Harvest' : 'Give Thanks', lk.cols));
  pages.push(seasonCert(paper, 'Kind Heart Award', name, 'for being thankful, kind and helpful to others!', lk.art, lk.ring));
  return pages;
}

// ================================================================ Birthday time capsule (Plus)
function makeTimeCapsule(o, paper) {
  const name = nameOf(o.name, '') || '';
  const age = Math.max(1, Math.min(12, parseInt(o.age, 10) || 5));
  const year = new Date().getFullYear();
  const lk = { confetti: { ring: '#e0457b', tint: '#fff0f5', art: 'cake', corners: ['🎉', '🎂', '🎈', '⭐'] },
    balloons: { ring: '#3a8fd8', tint: '#eef6ff', art: 'balloons', corners: ['🎈', '⭐', '🎁', '🎈'] },
    stars: { ring: '#8a3fd1', tint: '#f5edff', art: 'rocket', corners: ['⭐', '🌙', '🚀', '✨'] } }[o.look] || { ring: '#e0457b', tint: '#fff0f5', art: 'cake', corners: ['🎉', '🎂', '🎈', '⭐'] };
  const who = name || 'me';
  const pages = [];
  pages.push(seasonCover(paper, name ? `${name} at ${age}` : `Me at ${age}`, `My birthday time capsule, ${year}`, lk.art, lk.tint, lk.ring, lk.corners, 'time capsule'));
  const linesBox = (pg, x, y, w, h, title, c, n) => {
    pg.add(panel(x, y, w, h, '#fff', c, 8) + txt(x + 6, y + 9, title, fitFont(title, 5.4, w - 12, 0.5), { anchor: 'start', colour: c }));
    const k = n || Math.max(1, Math.floor((h - 14) / 10));
    for (let l = 1; l <= k; l++) pg.add(`<line x1="${x + 6}" x2="${x + w - 6}" y1="${y + 10 + l * (h - 14) / (k + 0.4)}" y2="${y + 10 + l * (h - 14) / (k + 0.4)}" stroke="#d9d4ec" stroke-width="0.45"/>`);
  };
  // All about me
  {
    const pg = new Page(paper, `All about ${who}`, { subtitle: `Fill this in together on ${name ? possessive(name) : 'my'} ${ordinal(age)} birthday.`, noName: true });
    const facts = [['My name is', name], ['I am', `${age} years old`], ['My birthday is on', ''], ['I live in', ''], ['The people in my family are', ''], ['My best friend is', '']];
    facts.forEach(([l, v], i) => {
      const y = pg.y + 6 + i * 13;
      pg.add(txt(pg.left, y, l, 6, { anchor: 'start' }) + `<line x1="${pg.left + l.length * 3.1 + 4}" x2="${pg.right}" y1="${y + 0.8}" y2="${y + 0.8}" stroke="#c9c3e3" stroke-width="0.45"/>`);
      if (v) pg.add(txt(pg.left + l.length * 3.1 + 7, y - 0.4, v, 6.4, { anchor: 'start', colour: lk.ring }));
    });
    pg.y += 6 * 13 + 8;
    pg.add(txt(pg.left, pg.y, 'My favourite things', 7, { anchor: 'start', colour: lk.ring }));
    pg.y += 5;
    const favs = [['🎨', 'Colour'], ['🍕', 'Food'], ['🐾', 'Animal'], ['🧸', 'Toy'], ['📚', 'Book'], ['🎵', 'Song'], ['📺', 'Show'], ['🎲', 'Game']];
    const cw = pg.width / 2, rh = pg.room / 4;
    favs.forEach(([e, t], i) => {
      const x = pg.left + (i % 2) * cw, y = pg.y + Math.floor(i / 2) * rh;
      pg.add(panel(x + 1.5, y + 1.5, cw - 3, rh - 3, TINTS[i % TINTS.length], PALETTE[i % PALETTE.length], 7) + emoji(e, x + 12, y + rh / 2, Math.min(12, rh * 0.4)) + txt(x + 22, y + 11, t, 5.4, { anchor: 'start', colour: PALETTE[i % PALETTE.length] }) + `<line x1="${x + 22}" x2="${x + cw - 8}" y1="${y + rh - 8}" y2="${y + rh - 8}" stroke="#c9c3e3" stroke-width="0.45"/>`);
    });
    pages.push(pg.svg());
  }
  // How big I am
  {
    const pg = new Page(paper, `How big ${name ? name + ' is' : 'I am'}`, { subtitle: 'Measure together and trace around a hand. Next year, compare how much you have grown!', noName: true });
    const cw = pg.width / 3;
    [['📏', 'Height', 'cm'], ['⚖️', 'Weight', 'kg'], ['👟', 'Shoe size', '']].forEach(([e, t, u], i) => {
      const x = pg.left + i * cw;
      pg.add(panel(x + 1.5, pg.y, cw - 3, 34, TINTS[i * 2], PALETTE[i * 2], 8) + emoji(e, x + 11, pg.y + 11, 10) + txt(x + 20, pg.y + 13, t, 5.4, { anchor: 'start', colour: PALETTE[i * 2] }) + `<line x1="${x + 8}" x2="${x + cw - 16}" y1="${pg.y + 27}" y2="${pg.y + 27}" stroke="#c9c3e3" stroke-width="0.45"/>` + txt(x + cw - 8, pg.y + 27, u, 4.6, { anchor: 'end', font: FONT, colour: SOFT }));
    });
    pg.y += 40;
    pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="${pg.room - 4}" rx="12" fill="#fff" stroke="${lk.ring}" stroke-width="0.8" stroke-dasharray="3 2"/>` + txt(pg.left + 8, pg.y + 10, `Trace around ${name ? possessive(name) : 'my'} hand here`, 6, { anchor: 'start', colour: lk.ring }) + emoji('✋', pg.right - 14, pg.y + 12, 12));
    pages.push(pg.svg());
  }
  // Self portrait
  {
    const pg = new Page(paper, `This is ${who} at ${age}`, { subtitle: 'Draw yourself, or stick in a photo from your birthday.', noName: true });
    const fh = pg.room - 44;
    pg.add(`<rect x="${pg.left + 10}" y="${pg.y}" width="${pg.width - 20}" height="${fh}" rx="14" fill="#fff" stroke="${lk.ring}" stroke-width="1.6"/><rect x="${pg.left + 15}" y="${pg.y + 5}" width="${pg.width - 30}" height="${fh - 10}" rx="10" fill="none" stroke="${lk.ring}" stroke-width="0.5" stroke-dasharray="2 1.6"/>`);
    lk.corners.forEach((e, i) => pg.add(emoji(e, i % 2 ? pg.right - 14 : pg.left + 14, i < 2 ? pg.y + 4 : pg.y + fh - 4, 11)));
    pg.y += fh + 8;
    [['My hair is', 'My eyes are'], ['I am good at', 'I love to']].forEach((row, r) => row.forEach((l, k) => { const x = pg.left + k * pg.width / 2, y = pg.y + 6 + r * 14; pg.add(txt(x, y, l, 5.6, { anchor: 'start' }) + `<line x1="${x + l.length * 2.9 + 4}" x2="${x + pg.width / 2 - 6}" y1="${y + 0.8}" y2="${y + 0.8}" stroke="#c9c3e3" stroke-width="0.45"/>`); }));
    pages.push(pg.svg());
  }
  // Birthday interview
  {
    const pg = new Page(paper, 'My birthday interview', { subtitle: 'A grown-up asks each question and writes the answer exactly as it is said. The funny answers are the best ones!', noName: true });
    const qs = ['What makes you really happy?', 'What is the best thing about being ' + age + '?', 'What are you really good at?', 'What do you want to be when you grow up?', 'Who makes you laugh the most?', 'If you had one wish, what would it be?', 'What will you be like when you are ' + (age + 10) + '?'];
    const rh = pg.room / qs.length;
    qs.forEach((q, i) => linesBox(pg, pg.left, pg.y + i * rh + 1, pg.width, rh - 3, q, PALETTE[i % PALETTE.length], 2));
    pages.push(pg.svg());
  }
  // My year
  {
    const pg = new Page(paper, `My year at ${age}`, { subtitle: 'Remember the best bits of this year together.', noName: true });
    const bh = pg.room / 3;
    [['This year I learned to', '#3fbfa8'], ['The best day this year was', '#ffb938'], ['I am really proud that', '#e0457b']].forEach(([t, c], i) => {
      pg.add(panel(pg.left, pg.y + i * bh + 1.5, pg.width, bh - 4, '#fff', c, 10) + txt(pg.left + 8, pg.y + i * bh + 11, t, 6.4, { anchor: 'start', colour: c }));
      pg.add(`<rect x="${pg.right - pg.width * 0.38}" y="${pg.y + i * bh + 16}" width="${pg.width * 0.38 - 6}" height="${bh - 26}" rx="6" fill="#fff" stroke="#e2ddf2" stroke-width="0.5" stroke-dasharray="2.5 1.8"/>`);
      for (let l = 1; l <= 3; l++) pg.add(`<line x1="${pg.left + 8}" x2="${pg.right - pg.width * 0.38 - 6}" y1="${pg.y + i * bh + 14 + l * (bh - 22) / 3.4}" y2="${pg.y + i * bh + 14 + l * (bh - 22) / 3.4}" stroke="#d9d4ec" stroke-width="0.45"/>`);
    });
    pages.push(pg.svg());
  }
  // Predictions
  {
    const pg = new Page(paper, `When I am ${age + 1}...`, { subtitle: 'Make your guesses now. Open this page on your next birthday and see if you were right!', noName: true });
    const ps = [['📏', 'I think I will be', 'cm tall'], ['🍕', 'My favourite food will be', ''], ['🎮', 'My favourite game will be', ''], ['🏫', 'At school I will learn', ''], ['🌍', 'A place I want to visit is', ''], ['🎁', 'For my next birthday I would love', '']];
    const rh = pg.room / ps.length;
    ps.forEach(([e, l, u], i) => {
      const y = pg.y + i * rh, c = PALETTE[i % PALETTE.length];
      pg.add(panel(pg.left, y + 1.5, pg.width, rh - 3, TINTS[i % TINTS.length], c, 8) + emoji(e, pg.left + 11, y + rh / 2, Math.min(12, rh * 0.45)) + txt(pg.left + 22, y + rh * 0.4, l, 5.6, { anchor: 'start', colour: c }));
      pg.add(`<line x1="${pg.left + 22}" x2="${pg.right - 10 - u.length * 2.4}" y1="${y + rh * 0.75}" y2="${y + rh * 0.75}" stroke="#c9c3e3" stroke-width="0.45"/>` + (u ? txt(pg.right - 8, y + rh * 0.75, u, 4.6, { anchor: 'end', font: FONT, colour: SOFT }) : ''));
    });
    pages.push(pg.svg());
  }
  // A letter from a grown-up
  {
    const pg = new Page(paper, '', { bare: true, tint: '#fffdf8' });
    pg.add(`<rect x="${pg.left - 3}" y="${pg.m - 3}" width="${pg.width + 6}" height="${pg.bottom - pg.m + 3}" rx="12" fill="#fff" stroke="${lk.ring}" stroke-width="1.4"/>`);
    pg.add(txt(pg.w / 2, pg.m + 16, 'A letter for you, to read when you are grown up', 5.4, { font: FONT, colour: SOFT }));
    pg.add(txt(pg.left + 10, pg.m + 34, name ? `Dear ${name},` : 'Dear', 10, { anchor: 'start', colour: lk.ring }));
    const n = Math.floor((pg.bottom - 40 - (pg.m + 48)) / 12);
    for (let l = 0; l < n; l++) pg.add(`<line x1="${pg.left + 10}" x2="${pg.right - 10}" y1="${pg.m + 48 + l * 12}" y2="${pg.m + 48 + l * 12}" stroke="#d9d4ec" stroke-width="0.45"/>`);
    pg.add(txt(pg.right - 12, pg.bottom - 22, 'With all my love,', 7, { anchor: 'end', colour: lk.ring }) + `<line x1="${pg.right - 70}" x2="${pg.right - 12}" y1="${pg.bottom - 10}" y2="${pg.bottom - 10}" stroke="#b9b3d6" stroke-width="0.5"/>`);
    pg.footer = () => {};
    pages.push(pg.svg());
  }
  // Seal it
  {
    const pg = new Page(paper, '', { bare: true, tint: lk.tint });
    const cx = pg.w / 2, top = pg.m + 40, W = pg.width - 30, H = 120;
    pg.add(`<rect x="${cx - W / 2}" y="${top}" width="${W}" height="${H}" rx="6" fill="#fff" stroke="${lk.ring}" stroke-width="1.2"/><path d="M${cx - W / 2} ${top} L${cx} ${top + H * 0.6} L${cx + W / 2} ${top}" fill="none" stroke="${lk.ring}" stroke-width="1.2"/>`);
    pg.add(`<circle cx="${cx}" cy="${top + H * 0.6}" r="14" fill="${lk.ring}"/>` + emoji('❤️', cx, top + H * 0.6, 12));
    bubbleText(pg, 'Time capsule', cx, top - 12, pg.width - 40, 20);
    pg.add(txt(cx, top + H + 20, `Sealed on ${name ? possessive(name) : 'my'} ${ordinal(age)} birthday, ${year}`, 7, { colour: lk.ring }));
    pg.add(txt(cx, top + H + 34, `Open again on ${name ? possessive(name) : 'my'} ${ordinal(age + 1)} birthday!`, 8, { colour: INK }));
    pg.add(txt(cx, pg.bottom - 20, 'Keep every year\'s capsule together. One day it will be a treasure.', 5, { font: FONT, colour: SOFT }));
    pg.footer = () => {};
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ three more storybooks
Object.assign(STORYBOOKS, {
  snow: { title: '{name} and the Snowy Surprise', pages: [
    ['snowman', 'One morning, {name} woke up and the whole world was white. Snow!'],
    ['bunny', 'Bunny was cold and shivering. {name} made her a warm little nest of scarves.'],
    ['penguin', 'A penguin slid down the hill. Wheee! "Come and play, {name}!"'],
    ['snowman', 'Together they rolled a big snowman, with a carrot nose and a happy smile.'],
    ['owl', '"Hoo! Where are the birds going to find food in all this snow?" asked Owl.'],
    ['gingerbread', '{name} baked crumbly treats and shared them with every hungry bird.'],
    ['presents', 'That night, a little parcel sat by the door. Inside was a note: "Thank you for being so kind."'],
    ['house', '{name} snuggled up by the window and watched the snow fall. What a wonderful day.']] },
  jungle: { title: '{name} and the Jungle Band', pages: [
    ['giraffe', 'Deep in the jungle, the animals wanted to make music, but nobody knew how.'],
    ['elephant', 'Elephant could toot his trunk: TOOT! But it sounded lonely on its own.'],
    ['frog', 'Frog could croak: RIBBIT! But it sounded lonely too.'],
    ['bee', '{name} arrived with a drum. "Let\'s play together!" Boom, boom, boom!'],
    ['snail', 'Snail was shy and very slow. "I can only go shhh," she whispered.'],
    ['snail', '"Shhh is perfect," said {name}. "Every band needs a quiet part."'],
    ['octopus', 'The band played so beautifully that even a crocodile came up from the river to dance.'],
    ['rainbow', 'And every evening after that, the jungle band played, with {name} on the drum.']] },
  kind: { title: '{name}\'s Kind Heart Day', pages: [
    ['house', 'When {name} woke up, {name} had an idea: "Today I will be kind to everyone I meet."'],
    ['dog', 'First, {name} gave Puppy fresh water and a big cuddle. Wag, wag!'],
    ['teddy', 'At breakfast, {name} shared the last pancake. Sharing felt warm inside.'],
    ['car', 'On the way to the park, {name} helped a friend who had dropped her toys.'],
    ['turtle', 'At the park, {name} waited patiently for slow Turtle to have a turn on the slide.'],
    ['sunflower', '{name} picked up litter, so the flowers could grow in a clean park.'],
    ['cake', 'At home, {name} helped make a cake for Grandma, just because.'],
    ['rainbow', 'At bedtime, {name} smiled. Being kind had made it the happiest day of all.']] },
});

Object.assign(MAKERS, { diwali: makeDiwali, thankful: makeThankful, timecapsule: makeTimeCapsule });
