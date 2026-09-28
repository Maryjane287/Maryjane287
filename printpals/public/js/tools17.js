// PrintPals batch 17 (Plus): Halloween pack, Christmas pack with a 24 day Advent activity book, and My Name Book.

// ================================================================ seasonal line art (200 by 200 box, like the colouring library)
const SEASON_ART = {
  pumpkin: { name: 'Pumpkin', draw: () => [
    `<path d="M20 186 Q100 176 180 186" ${LN}/>`,
    `<path d="M100 52 Q96 34 108 22" ${LN}/><path d="M104 36 Q124 24 136 36 Q122 44 104 36 Z" ${LW}/>`,
    `<ellipse cx="62" cy="118" rx="42" ry="58" ${LW}/><ellipse cx="138" cy="118" rx="42" ry="58" ${LW}/><ellipse cx="100" cy="118" rx="40" ry="62" ${LW}/>`,
    `<path d="M76 100 L88 84 L100 100 Z" ${LW}/><path d="M112 100 L124 84 L136 100 Z" ${LW}/>`,
    `<path d="M70 128 Q100 168 136 128 L124 136 L114 128 L104 138 L94 128 L84 138 Z" ${LW}/>`,
    cStar(26, 40, 9), cStar(172, 56, 7),
  ].join('') },
  ghost: { name: 'Friendly ghost', draw: () => [
    `<path d="M50 176 L50 90 Q50 30 100 30 Q150 30 150 90 L150 176 Q138 164 126 176 Q114 188 100 176 Q88 164 76 176 Q62 188 50 176 Z" ${LW}/>`,
    `<ellipse cx="82" cy="88" rx="8" ry="11" ${INKF}/><ellipse cx="118" cy="88" rx="8" ry="11" ${INKF}/><circle cx="85" cy="84" r="3" fill="#fff"/><circle cx="121" cy="84" r="3" fill="#fff"/>`,
    `<path d="M88 112 Q100 124 112 112" ${LN}/><ellipse cx="70" cy="108" rx="7" ry="4" ${LT}/><ellipse cx="130" cy="108" rx="7" ry="4" ${LT}/>`,
    `<path d="M50 110 Q28 104 22 86" ${LN}/><path d="M150 110 Q172 104 178 86" ${LN}/>`,
    cCloud(160, 30, 0.6), cStar(30, 40, 8),
  ].join('') },
  bat: { name: 'Bat', draw: () => [
    `<circle cx="150" cy="50" r="26" ${LW}/>`,
    `<path d="M100 96 Q70 60 20 70 Q40 84 34 100 Q52 92 58 108 Q72 96 84 112 Z" ${LW}/><path d="M100 96 Q130 60 180 70 Q160 84 166 100 Q148 92 142 108 Q128 96 116 112 Z" ${LW}/>`,
    `<ellipse cx="100" cy="110" rx="22" ry="28" ${LW}/><path d="M84 88 L80 70 L92 84 Z M116 88 L120 70 L108 84 Z" ${LW}/>`,
    `<circle cx="92" cy="104" r="4" ${INKF}/><circle cx="108" cy="104" r="4" ${INKF}/><path d="M94 118 Q100 124 106 118" ${LN}/><path d="M96 120 l2 4 l2 -4" ${LT}/>`,
    cStar(40, 150, 8), cStar(160, 160, 6), cStar(100, 172, 5),
  ].join('') },
  treats: { name: 'Treats', draw: () => [
    `<path d="M40 70 Q100 56 160 70 L150 180 Q100 192 50 180 Z" ${LW}/><path d="M40 70 Q100 84 160 70" ${LN}/>`,
    `<path d="M70 72 Q60 40 84 40 Q108 40 100 72" ${LN}/>`,
    `<ellipse cx="100" cy="130" rx="26" ry="22" ${LW}/><path d="M86 124 L92 118 L98 124 Z M102 124 L108 118 L114 124 Z" ${LW}/><path d="M88 136 Q100 146 112 136" ${LN}/>`,
    `<path d="M150 40 l12 -8 l10 10 l-8 12 z" ${LW}/><path d="M150 40 l-10 -2 l2 -10 z M172 42 l2 10 l10 -2 z" ${LW}/>`,
    `<circle cx="36" cy="40" r="12" ${LW}/><path d="M36 52 V80" ${LN}/><path d="M30 34 Q36 46 42 34" ${LT}/>`,
  ].join('') },
  tree: { name: 'Christmas tree', draw: xmasTree },
  snowman: { name: 'Snowman', draw: () => [
    `<path d="M10 186 Q100 170 190 186 L190 200 L10 200 Z" ${LW}/>`,
    `<circle cx="100" cy="148" r="40" ${LW}/><circle cx="100" cy="84" r="30" ${LW}/>`,
    `<rect x="74" y="36" width="52" height="10" rx="3" ${LW}/><rect x="82" y="10" width="36" height="28" rx="4" ${LW}/>`,
    `<circle cx="90" cy="78" r="4" ${INKF}/><circle cx="110" cy="78" r="4" ${INKF}/><path d="M100 86 L124 92 L100 94 Z" ${LW}/><path d="M88 100 q12 8 24 0" ${LN}/>`,
    `<path d="M72 106 Q100 120 128 106 L130 116 Q100 130 70 116 Z" ${LW}/><path d="M118 114 L126 146 L136 142 L128 112" ${LW}/>`,
    `<circle cx="100" cy="136" r="4" ${INKF}/><circle cx="100" cy="152" r="4" ${INKF}/><circle cx="100" cy="168" r="4" ${INKF}/>`,
    `<path d="M62 140 L28 116 M40 124 L30 108 M140 140 L174 116 M162 124 L172 108" ${LN}/>`,
    cStar(30, 40, 7), cStar(170, 34, 8), cStar(160, 70, 5),
  ].join('') },
  stocking: { name: 'Stocking', draw: () => [
    `<path d="M78 20 Q60 50 54 60" ${LN}/>`,
    `<rect x="70" y="28" width="70" height="26" rx="8" ${LW}/>`,
    `<path d="M76 54 L134 54 L134 120 Q134 150 116 164 L78 186 Q52 196 44 176 Q38 158 60 148 L80 138 Z" ${LW}/>`,
    `<path d="M80 80 L132 80 M80 104 L134 104" ${LT}/><path d="M60 148 Q70 170 94 172" ${LN}/>`,
    cStar(106, 128, 10), `<circle cx="150" cy="30" r="6" ${LW}/><circle cx="160" cy="56" r="5" ${LW}/>`,
  ].join('') },
  gingerbread: { name: 'Gingerbread friend', draw: () => [
    `<path d="M100 22 Q128 22 128 50 Q128 64 118 72 L150 80 Q168 86 160 104 Q154 114 130 106 L126 130 L144 172 Q148 190 130 188 Q120 186 112 164 L100 146 L88 164 Q80 186 70 188 Q52 190 56 172 L74 130 L70 106 Q46 114 40 104 Q32 86 50 80 L82 72 Q72 64 72 50 Q72 22 100 22 Z" ${LW}/>`,
    `<circle cx="90" cy="46" r="4" ${INKF}/><circle cx="110" cy="46" r="4" ${INKF}/><path d="M90 58 Q100 66 110 58" ${LN}/>`,
    `<circle cx="100" cy="90" r="4" ${LW}/><circle cx="100" cy="106" r="4" ${LW}/><circle cx="100" cy="122" r="4" ${LW}/>`,
    `<path d="M48 90 q4 -4 8 0 q4 4 8 0 M136 90 q4 -4 8 0 q4 4 8 0 M62 176 q4 -4 8 0 M130 176 q4 -4 8 0" ${LT}/>`,
    `<path d="M88 76 L100 84 L112 76 L112 86 L100 80 L88 86 Z" ${LW}/>`,
  ].join('') },
  presents: { name: 'Presents', draw: () => [
    `<rect x="24" y="100" width="80" height="80" rx="4" ${LW}/><path d="M64 100 V180 M24 138 H104" ${LN}/><path d="M64 100 Q40 76 50 70 Q60 66 64 100 Q68 66 78 70 Q88 76 64 100 Z" ${LW}/>`,
    `<rect x="112" y="124" width="64" height="56" rx="4" ${LW}/><path d="M144 124 V180" ${LN}/><path d="M144 124 Q128 104 136 100 Q144 98 144 124 Q144 98 152 100 Q160 104 144 124 Z" ${LW}/>`,
    `<rect x="120" y="60" width="44" height="44" rx="4" ${LW}/><path d="M120 82 H164" ${LN}/><circle cx="130" cy="72" r="3" ${INKF}/><circle cx="154" cy="94" r="3" ${INKF}/>`,
    cStar(40, 40, 10), cStar(90, 30, 6), `<path d="M10 186 H190" ${LN}/>`,
  ].join('') },
  bauble: { name: 'Bauble', draw: () => [
    `<path d="M100 8 V30" ${LN}/><path d="M100 8 Q86 0 82 10 Q92 16 100 8 Q108 16 118 10 Q114 0 100 8 Z" ${LW}/>`,
    `<rect x="86" y="30" width="28" height="16" rx="3" ${LW}/>`,
    `<circle cx="100" cy="116" r="72" ${LW}/>`,
    `<path d="M30 100 Q100 124 170 100 M30 134 Q100 158 170 134" ${LN}/>`,
    cStar(100, 80, 12), cStar(64, 118, 7), cStar(136, 118, 7), `<circle cx="80" cy="162" r="6" ${LW}/><circle cx="120" cy="162" r="6" ${LW}/><circle cx="100" cy="170" r="5" ${LW}/>`,
  ].join('') },
};

function seasonArt(key) { return SEASON_ART[key] ? SEASON_ART[key].draw() : colouringArt(key); }

// A portrait award with a seasonal picture.
function seasonCert(paper, title, name, line, key, colour) {
  const pg = new Page(paper, '', { bare: true, tint: '#fffaf0' });
  const cx = pg.w / 2;
  pg.add(`<rect x="${pg.left}" y="${pg.m}" width="${pg.width}" height="${pg.bottom - pg.m}" rx="10" fill="#fff" stroke="${colour}" stroke-width="2"/>`);
  pg.add(`<rect x="${pg.left + 5}" y="${pg.m + 5}" width="${pg.width - 10}" height="${pg.bottom - pg.m - 10}" rx="7" fill="none" stroke="#ffb938" stroke-width="0.6" stroke-dasharray="2.4 1.6"/>`);
  pg.add(txt(cx, pg.m + 22, 'CERTIFICATE', 5, { font: FONT, colour: SOFT }).replace('<text ', '<text letter-spacing="2" '));
  bubbleText(pg, title, cx, pg.m + 42, pg.width - 30, 18);
  pg.add(`<g transform="translate(${cx - 45} ${pg.m + 52}) scale(0.45)">${seasonArt(key)}</g>`);
  pg.add(txt(cx, pg.m + 160, 'is proudly awarded to', 6, { font: FONT, colour: SOFT }));
  if (name) bubbleText(pg, name, cx, pg.m + 184, pg.width - 40, 24);
  else pg.add(`<line x1="${cx - 60}" x2="${cx + 60}" y1="${pg.m + 184}" y2="${pg.m + 184}" stroke="#b9b3d6" stroke-width="0.5"/>`);
  wrap(line, 36).forEach((l, i) => pg.add(txt(cx, pg.m + 200 + i * 9, l, 6.6, { colour: INK })));
  const ly = pg.bottom - 22;
  pg.add(txt(pg.left + 20, ly, 'Signed', 4.6, { anchor: 'start', font: FONT, colour: SOFT }) + `<line x1="${pg.left + 38}" x2="${cx - 8}" y1="${ly + 0.6}" y2="${ly + 0.6}" stroke="#b9b3d6" stroke-width="0.4"/>`);
  pg.add(txt(cx + 8, ly, 'Date', 4.6, { anchor: 'start', font: FONT, colour: SOFT }) + `<line x1="${cx + 22}" x2="${pg.right - 20}" y1="${ly + 0.6}" y2="${ly + 0.6}" stroke="#b9b3d6" stroke-width="0.4"/>`);
  pg.footer = () => {};
  return pg.svg();
}

function seasonColour(paper, key, name) {
  const art = SEASON_ART[key] || COLOURING[key];
  const pg = new Page(paper, '', { bare: true });
  const top = pg.m + 2;
  const label = name ? `${name} colours the ${art.name.toLowerCase()}` : `Colour the ${art.name.toLowerCase()}`;
  bubbleText(pg, label, pg.w / 2, top + 14, pg.width - 10, 15);
  const boxY = top + 22, boxH = pg.bottom - boxY - 2;
  pg.add(`<rect x="${pg.left}" y="${boxY}" width="${pg.width}" height="${boxH}" rx="8" fill="#fff" stroke="#1f1b2e" stroke-width="1"/>`);
  const size = Math.min(pg.width - 16, boxH - 16);
  pg.add(`<g transform="translate(${pg.left + (pg.width - size) / 2} ${boxY + (boxH - size) / 2}) scale(${(size / 200).toFixed(4)})">${seasonArt(key)}</g>`);
  return pg.svg();
}

function seasonCover(paper, title, sub, key, tint, ring, corners, owner) {
  const pg = new Page(paper, '', { bare: true, tint });
  const cx = pg.w / 2;
  pg.add(`<rect x="${pg.left - 3}" y="${pg.m - 3}" width="${pg.width + 6}" height="${pg.bottom - pg.m + 3}" rx="12" fill="#fff" stroke="${ring}" stroke-width="1.6"/>`);
  pg.add(`<rect x="${pg.left}" y="${pg.m}" width="${pg.width}" height="${pg.bottom - pg.m - 3}" rx="9" fill="none" stroke="${ring}" stroke-width="0.5" stroke-dasharray="2 1.6"/>`);
  corners.forEach((e, i) => pg.add(emoji(e, i % 2 ? pg.right - 11 : pg.left + 11, i < 2 ? pg.m + 11 : pg.bottom - 13, 13)));
  let y = pg.m + 36;
  wrap(title, 15).forEach((l) => { bubbleText(pg, l, cx, y, pg.width - 34, 21); y += 21; });
  pg.add(txt(cx, y + 2, sub, fitFont(sub, 6.4, pg.width - 40, 0.5), { colour: ring }));
  const size = Math.min(pg.width - 40, pg.bottom - y - 44);
  pg.add(`<g transform="translate(${cx - size / 2} ${y + 10}) scale(${(size / 200).toFixed(4)})">${seasonArt(key)}</g>`);
  pg.add(txt(pg.left + 24, pg.bottom - 16, `This ${owner} belongs to`, 4.8, { anchor: 'start', font: FONT }) + `<line x1="${pg.left + 70}" x2="${pg.right - 24}" y1="${pg.bottom - 15.4}" y2="${pg.bottom - 15.4}" stroke="#b9b3d6" stroke-width="0.4"/>`);
  pg.footer = () => {};
  return pg.svg();
}

// A page of cut out tags or notes: n per page, each with a small picture and a line of text.
function tagsPage(paper, title, sub, n, cols, draw) {
  const pg = new Page(paper, title, { subtitle: sub, noName: true });
  const rows = Math.ceil(n / cols), cw = pg.width / cols, ch = pg.room / rows;
  for (let i = 0; i < n; i++) {
    const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch;
    pg.add(`<rect x="${x + 2}" y="${y + 2}" width="${cw - 4}" height="${ch - 4}" rx="6" fill="#fff" stroke="#1f1b2e" stroke-width="0.6" stroke-dasharray="2.5 1.8"/>`);
    draw(pg, x + 2, y + 2, cw - 4, ch - 4, i);
  }
  return pg.svg();
}

// Letters to colour and hang on string, two flags per row.
function buntingPages(paper, text, colours) {
  const letters = [...text.toUpperCase()].filter((c) => c !== ' ');
  const pages = [];
  for (let s = 0; s < letters.length; s += 6) {
    const pg = new Page(paper, s ? 'Bunting (more letters)' : 'Colour your bunting', { subtitle: 'Colour each flag, cut it out and fold the top strip over a string. Hang them in order!', noName: true });
    const cw = pg.width / 2, ch = pg.room / 3;
    const chunk = letters.slice(s, s + 6);
    while (chunk.length < 6) chunk.push('★');
    chunk.forEach((l, i) => {
      const x = pg.left + (i % 2) * cw + 6, y = pg.y + Math.floor(i / 2) * ch + 4, w = cw - 12, h = ch - 10;
      pg.add(`<rect x="${x}" y="${y}" width="${w}" height="10" fill="#f4f1fb" stroke="#1f1b2e" stroke-width="0.5" stroke-dasharray="2 1.4"/>`);
      pg.add(`<path d="M${x} ${y + 10} L${x + w} ${y + 10} L${x + w / 2} ${y + h} Z" fill="#fff" stroke="#1f1b2e" stroke-width="0.9" stroke-linejoin="round"/>`);
      if (l === '★') { pg.add(`<path d="${starPath(x + w / 2, y + 10 + (h - 10) * 0.32, Math.min(16, h * 0.18), 0.45)}" fill="#fff" stroke="${colours[(s + i) % colours.length]}" stroke-width="1.2" stroke-linejoin="round"/>`); return; }
      pg.add(`<text x="${x + w / 2}" y="${y + 10 + (h - 10) * 0.45}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${Math.min(40, h * 0.42)}" fill="#fff" stroke="${colours[(s + i) % colours.length]}" stroke-width="1.4" paint-order="stroke">${esc(l)}</text>`);
    });
    pages.push(pg.svg());
  }
  return pages;
}

// "How many?" counting rows with a box to write the answer.
function countRowsPage(paper, title, items, rand) {
  const pg = new Page(paper, title, { subtitle: 'Count each picture and write how many in the box.' });
  const rh = pg.room / items.length;
  items.forEach((e, i) => {
    const n = 2 + Math.floor(rand() * 8), y = pg.y + i * rh, c = PALETTE[i % PALETTE.length];
    pg.add(panel(pg.left, y + 1.5, pg.width, rh - 3, TINTS[i % TINTS.length], c, 7));
    const per = Math.min(n, 5), es = Math.min(12, (rh - 8) / 2.2);
    for (let k = 0; k < n; k++) pg.add(emoji(e, pg.left + 12 + (k % per) * (es + 3), y + rh / 2 + (n > 5 ? (k < 5 ? -es * 0.6 : es * 0.6) : 0), es));
    pg.add(`<rect x="${pg.right - 30}" y="${y + rh / 2 - 9}" width="22" height="18" rx="4" fill="#fff" stroke="${c}" stroke-width="0.9"/>`);
  });
  return pg.svg();
}

// A page of big dotted words to trace.
function traceWordsPage(paper, title, words) {
  const pg = new Page(paper, title, { subtitle: 'Start at the green dot and trace each word. Then colour the picture!' });
  const rh = pg.room / words.length;
  words.forEach(([w, e], i) => {
    const y = pg.y + i * rh, size = Math.min(rh * 0.62, (pg.width - 40) / (textWidth(w) / 100 + 0.2));
    pg.add(emoji(e, pg.left + 12, y + rh / 2, Math.min(18, rh * 0.5)));
    pg.add(`<line x1="${pg.left + 28}" x2="${pg.right}" y1="${y + rh * 0.2 + size}" y2="${y + rh * 0.2 + size}" stroke="#c9c3e3" stroke-width="0.4"/>`);
    pg.add(drawText(w, pg.left + 30, y + rh * 0.2, size, 'trace', true));
  });
  return pg.svg();
}

// Each premium pack comes in several looks: colours, cover picture and decorations.
const LOOKS = {
  halloween: {
    pumpkin: { name: 'Pumpkin Patch', ring: '#ff8a3d', tint: '#fff6ec', art: 'pumpkin', corners: ['🎃', '🦇', '🍬', '👻'], cols: ['#ff8a3d', '#8a3fd1', '#3fbfa8'] },
    moon: { name: 'Moonlight', ring: '#8a3fd1', tint: '#f5edff', art: 'ghost', corners: ['🌙', '⭐', '🦉', '👻'], cols: ['#8a3fd1', '#3a64d8', '#ffb938'] },
    candy: { name: 'Candy', ring: '#ff5f9e', tint: '#fff0f5', art: 'treats', corners: ['🍭', '🍬', '🧁', '🎃'], cols: ['#ff5f9e', '#ff8a3d', '#b06cff'] },
  },
  christmas: {
    classic: { name: 'Classic', ring: '#e0453b', tint: '#f2fbf5', art: 'tree', corners: ['🎄', '⭐', '🎁', '❄️'], cols: ['#e0453b', '#2e9d62', '#ffb938', '#6c8cff'] },
    snowy: { name: 'Snowy', ring: '#3a8fd8', tint: '#eef6ff', art: 'snowman', corners: ['❄️', '⛄', '⭐', '🌨️'], cols: ['#3a8fd8', '#6c8cff', '#3fbfa8', '#b06cff'] },
    ginger: { name: 'Gingerbread', ring: '#c0662b', tint: '#fff6ec', art: 'gingerbread', corners: ['🍪', '🎄', '🍬', '⭐'], cols: ['#c0662b', '#e0453b', '#2e9d62', '#ffb938'] },
  },
  namebook: {
    rainbow: { name: 'Rainbow', ring: '#e0457b', tint: '#fff0f5', art: 'rainbow', corners: ['⭐', '❤️', '🌈', '☀️'] },
    ocean: { name: 'Ocean', ring: '#3a8fd8', tint: '#eef6ff', art: 'whale', corners: ['🐳', '🐠', '🐚', '⭐'] },
    garden: { name: 'Garden', ring: '#2e9d62', tint: '#f1f8e6', art: 'sunflower', corners: ['🌻', '🦋', '🐞', '🌷'] },
    space: { name: 'Space', ring: '#6c3fd1', tint: '#f5edff', art: 'rocket', corners: ['🚀', '⭐', '🪐', '🌙'] },
  },
};
const lookOf = (pack, key) => LOOKS[pack][key] || Object.values(LOOKS[pack])[0];

// ================================================================ Halloween pack (Plus)
function makeHalloween(o, paper) {
  const rand = rng(+o.seed || 1);
  const name = nameOf(o.name, '');
  const age = +o.age || 5;
  const lvl = age <= 4 ? 'easy' : age <= 6 ? 'medium' : 'hard';
  const pages = [];
  const lk = lookOf('halloween', o.look);
  pages.push(seasonCover(paper, name ? `${possessive(name)} Halloween fun pack` : 'My Halloween fun pack', 'Friendly, not frightening!', lk.art, lk.tint, lk.ring, lk.corners, 'pack'));
  ['pumpkin', 'ghost', 'bat', 'treats'].forEach((k) => pages.push(seasonColour(paper, k, name)));
  pages.push(countRowsPage(paper, 'Count the Halloween things', ['🎃', '👻', '🦇', '🍬', '🕷️', '🌙'], rand));
  pages.push(traceWordsPage(paper, 'Trace the Halloween words', [['pumpkin', '🎃'], ['ghost', '👻'], ['bat', '🦇'], ['moon', '🌙']]));
  const ws = packRun('wordsearch', { title: 'Halloween word search', words: age <= 4 ? 'BAT, CAT, OWL, MOON, BOO, WEB' : 'PUMPKIN, GHOST, BAT, MOON, OWL, CANDY, COSTUME, SPIDER, TREAT, WITCH', size: age <= 4 ? '8' : age <= 6 ? '10' : '12', level: lvl }, paper, +o.seed || 1);
  pages.push(...ws.sheets);
  pages.push(...packRun('mazes', { level: lvl }, paper, (+o.seed || 1) + 3).sheets);
  // Design your own pumpkin faces.
  {
    const pg = new Page(paper, 'Design a pumpkin face', { subtitle: 'Happy, silly, surprised or sleepy? Draw a different face on each pumpkin.' });
    const cw = pg.width / 2, ch = pg.room / 2, faces = ['Happy', 'Silly', 'Surprised', 'Sleepy'];
    faces.forEach((f, i) => {
      const x = pg.left + (i % 2) * cw, y = pg.y + Math.floor(i / 2) * ch, s = Math.min(cw, ch - 14) - 6;
      pg.add(`<g transform="translate(${x + (cw - s) / 2} ${y + 2}) scale(${(s / 200).toFixed(4)})"><path d="M20 186 Q100 176 180 186" ${LN}/><path d="M100 52 Q96 34 108 22" ${LN}/><ellipse cx="62" cy="118" rx="42" ry="58" ${LW}/><ellipse cx="138" cy="118" rx="42" ry="58" ${LW}/><ellipse cx="100" cy="118" rx="40" ry="62" ${LW}/></g>`);
      pg.add(txt(x + cw / 2, y + ch - 6, f, 6.4, { colour: PALETTE[i] }));
    });
    pages.push(pg.svg());
  }
  pages.push(...packRun('rolldraw', {}, paper, +o.seed || 1).sheets);
  pages.push(tagsPage(paper, 'Treat bag labels', 'Colour, cut out and stick on treat bags for friends. Write their names in!', 8, 2, (pg, x, y, w, h, i) => {
    pg.add(emoji(['🎃', '👻', '🦇', '🍬'][i % 4], x + 16, y + h / 2, Math.min(22, h * 0.5)));
    pg.add(txt(x + 32, y + h * 0.38, 'Happy Halloween!', fitFont('Happy Halloween!', 7, w - 38, 0.52), { anchor: 'start', colour: PALETTE[i % PALETTE.length] }));
    pg.add(txt(x + 32, y + h * 0.62, `To ____________`, 4.6, { anchor: 'start', font: FONT }) + txt(x + 32, y + h * 0.8, name ? `From ${name}` : 'From ____________', 4.6, { anchor: 'start', font: FONT }));
  }));
  pages.push(...buntingPages(paper, 'Happy Halloween', lk.cols));
  pages.push(seasonCert(paper, 'Best Costume Award', name, 'for the most amazing Halloween costume!', lk.art, lk.ring));
  return pages;
}

// ================================================================ Christmas pack with Advent activity book (Plus)
const ADVENT = [
  ['Make a paper snowflake', 'draw', 'Draw the snowflake you made'], ['Sing your favourite Christmas song', 'colour', 'tree'], ['Write a card for a neighbour', 'trace', 'card'], ['Count the lights on a tree', 'count', '💡'],
  ['Make a paper chain', 'colour', 'presents'], ['Read a Christmas story together', 'draw', 'Draw your favourite part of the story'], ['Call someone you love', 'trace', 'love'], ['Give a toy to someone who needs it', 'colour', 'gingerbread'],
  ['Make hot chocolate together', 'count', '☕'], ['Go on a walk to spot Christmas lights', 'draw', 'Draw the best lights you saw'], ['Help wrap a present', 'colour', 'presents'], ['Make a thank you card for a helper', 'trace', 'thank you'],
  ['Have a Christmas dance party', 'count', '⭐'], ['Bake something yummy', 'draw', 'Draw what you baked'], ['Say three things you love about your family', 'colour', 'bauble'], ['Build a blanket fort and read', 'trace', 'snow'],
  ['Make a Christmas decoration', 'count', '🎄'], ['Watch a cosy film together', 'colour', 'stocking'], ['Draw your dream present', 'draw', 'Draw your dream present'], ['Do something kind for someone', 'trace', 'kind'],
  ['Leave a kind note for someone to find', 'count', '🎁'], ['Make a card for Grandma or Grandpa', 'colour', 'snowman'], ['Look at the stars with a grown-up', 'trace', 'star'], ['Christmas Eve: get ready for the big day!', 'colour', 'tree'],
];

function makeChristmas(o, paper) {
  const rand = rng(+o.seed || 1);
  const name = nameOf(o.name, '');
  const age = +o.age || 5;
  const lvl = age <= 4 ? 'easy' : age <= 6 ? 'medium' : 'hard';
  const santa = o.santa === 'fc' ? 'Father Christmas' : 'Santa';
  const want = (k) => o[k] !== false;
  const pages = [];
  const lk = lookOf('christmas', o.look), CC = lk.cols;
  pages.push(seasonCover(paper, name ? `${possessive(name)} Christmas activity book` : 'My Christmas activity book', '24 days of Christmas fun', lk.art, lk.tint, lk.ring, lk.corners, 'book'));
  if (want('advent')) {
    // Advent calendar overview: colour a door each day.
    const pg = new Page(paper, 'My Advent calendar', { subtitle: 'Each day in December, do that day\'s page, then colour its door. 24 days to Christmas!' });
    const cols = 4, rows = 6, cw = pg.width / cols, ch = pg.room / rows, order = shuffle([...Array(24).keys()], rand);
    order.forEach((d, i) => {
      const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch, c = CC[d % 4];
      pg.add(`<rect x="${x + 2}" y="${y + 2}" width="${cw - 4}" height="${ch - 4}" rx="5" fill="#fff" stroke="${c}" stroke-width="1"/><path d="M${x + cw / 2} ${y + 4} V${y + ch - 4}" stroke="${c}" stroke-width="0.4" stroke-dasharray="1.5 1.2"/>`);
      pg.add(`<circle cx="${x + cw / 2 - 3}" cy="${y + ch / 2}" r="1" fill="${c}"/><circle cx="${x + cw / 2 + 3}" cy="${y + ch / 2}" r="1" fill="${c}"/>`);
      pg.add(txt(x + cw / 2, y + ch / 2 - 4, d + 1, Math.min(14, ch * 0.34), { colour: c }));
      pg.add(emoji([...lk.corners, '🔔', '🦌'][d % 6], x + cw / 2, y + ch - 9, 6));
    });
    pages.push(pg.svg());
    // One page for each day.
    ADVENT.forEach(([idea, kind, arg], d) => {
      const c = CC[d % 4];
      const p = new Page(paper, `Day ${d + 1}`, { subtitle: `${24 - d - 1 ? `${24 - d - 1} more sleeps` : 'Tomorrow is Christmas Day'}! Colour the star when you have done today's page.` });
      p.add(`<path d="${starPath(p.right - 10, p.y - 18, 8, 0.45)}" fill="#fff" stroke="${c}" stroke-width="0.9"/>`);
      p.add(panel(p.left, p.y, p.width, 26, '#fff6e0', '#ffb938', 8) + txt(p.left + 8, p.y + 10, 'Today\'s family moment', 5, { anchor: 'start', font: FONT, colour: '#b07d00' }) + emoji('🎄', p.right - 12, p.y + 13, 12));
      p.add(txt(p.left + 8, p.y + 20, idea, fitFont(idea, 7.4, p.width - 34, 0.52), { anchor: 'start', colour: INK }));
      p.y += 32;
      const top = p.y, h = p.room - 4;
      if (kind === 'colour') {
        const s = Math.min(p.width - 20, h - 12);
        p.add(txt(p.w / 2, top + 6, `Colour the ${SEASON_ART[arg].name.toLowerCase()}`, 6.4, { colour: c }));
        p.add(`<g transform="translate(${p.w / 2 - s / 2} ${top + 10}) scale(${(s / 200).toFixed(4)})">${seasonArt(arg)}</g>`);
      } else if (kind === 'draw') {
        p.add(`<rect x="${p.left}" y="${top}" width="${p.width}" height="${h}" rx="10" fill="#fff" stroke="${c}" stroke-width="0.8" stroke-dasharray="3 2"/>` + txt(p.left + 8, top + 10, arg, 6, { anchor: 'start', colour: c }));
      } else if (kind === 'count') {
        const n = 3 + Math.floor(rand() * (age <= 4 ? 5 : 10)), per = 5, es = 18;
        p.add(txt(p.w / 2, top + 6, 'How many can you count?', 6.4, { colour: c }));
        for (let k = 0; k < n; k++) p.add(emoji(arg, p.w / 2 - (per - 1) * (es + 6) / 2 + (k % per) * (es + 6), top + 26 + Math.floor(k / per) * (es + 8), es));
        p.add(txt(p.w / 2 - 10, top + h * 0.47, 'I counted', 7, { anchor: 'end' }) + `<rect x="${p.w / 2 - 4}" y="${top + h * 0.47 - 13}" width="28" height="20" rx="4" fill="#fff" stroke="${c}" stroke-width="0.9"/>`);
        p.add(`<rect x="${p.left}" y="${top + h * 0.58}" width="${p.width}" height="${h * 0.3}" rx="8" fill="#fff" stroke="#d9d4ec" stroke-width="0.6" stroke-dasharray="3 2"/>` + txt(p.left + 6, top + h * 0.58 + 8, 'Now draw that many of your own!', 4.8, { anchor: 'start', font: FONT, colour: SOFT }));
      } else {
        const size = Math.min(40, (p.width - 20) / (textWidth(arg) / 100 + 0.2));
        p.add(txt(p.w / 2, top + 6, 'Trace the word, then write it yourself', 6.4, { colour: c }));
        for (let r = 0; r < 3; r++) {
          const y = top + 16 + r * (size * 1.5);
          p.add(`<line x1="${p.left}" x2="${p.right}" y1="${y + size}" y2="${y + size}" stroke="#c9c3e3" stroke-width="0.4"/>`);
          if (r < 2) p.add(drawText(arg, p.left + 6, y, size, 'trace', r === 0));
        }
        const dy = top + 16 + 3 * size * 1.5;
        if (h - (dy - top) > 30) p.add(`<rect x="${p.left}" y="${dy}" width="${p.width}" height="${top + h - dy}" rx="8" fill="#fff" stroke="#d9d4ec" stroke-width="0.6" stroke-dasharray="3 2"/>` + txt(p.left + 6, dy + 8, 'Draw a picture to go with it', 4.8, { anchor: 'start', font: FONT, colour: SOFT }));
      }
      pages.push(p.svg());
    });
  }
  if (want('letter')) {
    const pg = new Page(paper, '', { bare: true, tint: '#fffdf8' });
    pg.add(`<rect x="${pg.left - 3}" y="${pg.m - 3}" width="${pg.width + 6}" height="${pg.bottom - pg.m + 3}" rx="12" fill="#fff" stroke="${lk.ring}" stroke-width="1.4"/>`);
    [...lk.corners, '🦌', '🔔'].forEach((e, i) => pg.add(emoji(e, pg.left + 12 + i * (pg.width - 24) / 5, pg.m + 11, 11)));
    bubbleText(pg, `Dear ${santa},`, pg.w / 2, pg.m + 36, pg.width - 30, 18);
    const lines = [['My name is', name], ['I am', age ? `${age} years old` : ''], ['This year I was kind when', ''], ['', ''], ['I am proud that I learned', ''], ['', ''], ['For Christmas I would love', ''], ['', ''], ['I will leave out for you', '']];
    let y = pg.m + 52;
    lines.forEach(([l, v]) => {
      if (l) pg.add(txt(pg.left + 10, y, l, 6, { anchor: 'start', colour: INK }));
      const x1 = l ? pg.left + 14 + l.length * 3.2 : pg.left + 10;
      pg.add(`<line x1="${x1}" x2="${pg.right - 10}" y1="${y + 0.8}" y2="${y + 0.8}" stroke="#c9c3e3" stroke-width="0.45"/>`);
      if (v) pg.add(txt(x1 + 3, y - 0.6, v, 6.4, { anchor: 'start', colour: lk.ring }));
      y += 16;
    });
    pg.add(txt(pg.right - 12, pg.bottom - 26, name ? `Love from ${name}` : 'Love from', 8, { anchor: 'end', colour: lk.ring }));
    pg.add(`<rect x="${pg.left + 10}" y="${y + 2}" width="${pg.width * 0.5}" height="${pg.bottom - y - 34}" rx="8" fill="#fff" stroke="${lk.ring}" stroke-width="0.6" stroke-dasharray="3 2"/>` + txt(pg.left + 16, y + 10, 'Draw your wish here', 4.6, { anchor: 'start', font: FONT, colour: SOFT }));
    pg.footer = () => {};
    pages.push(pg.svg());
    pages.push(seasonCert(paper, 'Official Nice List', name, `for being kind, helpful and wonderful all year. Love from ${santa}`, 'stocking', lk.ring));
  }
  if (want('colouring')) ['tree', 'snowman', 'stocking', 'gingerbread', 'presents', 'bauble'].forEach((k) => pages.push(seasonColour(paper, k, name)));
  if (want('puzzles')) {
    pages.push(...packRun('wordsearch', { title: 'Christmas word search', words: age <= 4 ? 'STAR, TREE, SNOW, GIFT, ELF, BELL' : 'SNOWMAN, REINDEER, PRESENT, STAR, TREE, STOCKING, SLEIGH, ANGEL, BELLS, CANDLE', size: age <= 4 ? '8' : age <= 6 ? '10' : '12', level: lvl }, paper, +o.seed || 1).sheets);
    pages.push(countRowsPage(paper, 'Count the Christmas things', ['🎄', '⭐', '🎁', '🔔', '❄️', '🦌'], rand));
    pages.push(...packRun('mazes', { level: lvl }, paper, (+o.seed || 1) + 5).sheets);
  }
  if (want('crafts')) {
    pages.push(tagsPage(paper, 'Gift tags', 'Colour, cut out and punch a hole. Tie them onto your presents!', 12, 3, (pg, x, y, w, h, i) => {
      pg.add(`<circle cx="${x + w / 2}" cy="${y + 6}" r="2" fill="#fff" stroke="#1f1b2e" stroke-width="0.5"/>`);
      pg.add(emoji(['🎄', '⭐', '🎁', '❄️', '🔔', '🦌'][i % 6], x + w / 2, y + h * 0.36, Math.min(16, h * 0.3)));
      pg.add(txt(x + 6, y + h * 0.66, 'To', 4.6, { anchor: 'start', font: FONT }) + `<line x1="${x + 14}" x2="${x + w - 6}" y1="${y + h * 0.66 + 0.6}" y2="${y + h * 0.66 + 0.6}" stroke="#c9c3e3" stroke-width="0.4"/>`);
      pg.add(txt(x + 6, y + h * 0.86, name ? `From ${name}` : 'From', 4.6, { anchor: 'start', font: FONT, colour: name ? lk.ring : INK }) + (name ? '' : `<line x1="${x + 18}" x2="${x + w - 6}" y1="${y + h * 0.86 + 0.6}" y2="${y + h * 0.86 + 0.6}" stroke="#c9c3e3" stroke-width="0.4"/>`));
    }));
    pages.push(...buntingPages(paper, 'Merry Christmas', CC));
    pages.push(tagsPage(paper, 'Thank you notes', 'After Christmas, write a little note to say thank you for a present.', 4, 2, (pg, x, y, w, h, i) => {
      pg.add(emoji(['🎁', '⭐', '❄️', '🎄'][i], x + w - 12, y + 12, 12) + txt(x + 8, y + 14, 'Thank you!', 9, { anchor: 'start', colour: lk.ring }));
      pg.add(txt(x + 8, y + 28, 'Dear', 5, { anchor: 'start', font: FONT }));
      for (let l = 0; l < 4; l++) pg.add(`<line x1="${x + 8}" x2="${x + w - 8}" y1="${y + 40 + l * 12}" y2="${y + 40 + l * 12}" stroke="#c9c3e3" stroke-width="0.45"/>`);
      pg.add(txt(x + w - 8, y + h - 10, name ? `Love from ${name}` : 'Love from', 5.4, { anchor: 'end', colour: lk.ring }));
    }));
  }
  return pages;
}

// ================================================================ My Name Book (Plus)
const NAME_BOOK = {
  A: ['apple', 'Amazing'], B: ['bear', 'Brave'], C: ['cat', 'Clever'], D: ['dog', 'Delightful'], E: ['egg', 'Excellent'], F: ['fish', 'Funny'], G: ['gorilla', 'Generous'],
  H: ['hat', 'Helpful'], I: ['🍦 ice cream', 'Imaginative'], J: ['🪼 jellyfish', 'Joyful'], K: ['🪁 kite', 'Kind'], L: ['lion', 'Loving'], M: ['monkey', 'Marvellous'], N: ['nest', 'Nice'],
  O: ['octopus', 'Outstanding'], P: ['pig', 'Patient'], Q: ['👑 queen', 'Quick-thinking'], R: ['rainbow', 'Remarkable'], S: ['sun', 'Super'], T: ['turtle', 'Thoughtful'],
  U: ['☂️ umbrella', 'Unique'], V: ['🎻 violin', 'Vibrant'], W: ['🐳 whale', 'Wonderful'], X: ['🦊 fox', 'eXtra special'], Y: ['🪀 yo-yo', 'Yes-I-can'], Z: ['zebra', 'Zooming ahead'],
};
// A second special word, so a letter that appears twice in a name gets a new word.
const NAME_WORD2 = { A: 'Adventurous', B: 'Bright', C: 'Caring', D: 'Daring', E: 'Energetic', F: 'Friendly', G: 'Gentle', H: 'Happy', I: 'Incredible', J: 'Jolly', K: 'Keen', L: 'Lovely', M: 'Magical',
  N: 'Noble', O: 'Original', P: 'Playful', Q: 'Quirky', R: 'Radiant', S: 'Smart', T: 'Terrific', U: 'Unstoppable', V: 'Valued', W: 'Wise', X: 'eXciting', Y: 'Youthful', Z: 'Zippy' };

function makeNameBook(o, paper) {
  const name = nameOf(o.name, '') || 'Mia';
  const letters = [...name.toUpperCase()].filter((c) => NAME_BOOK[c]).slice(0, 12);
  const words = letters.map((L, i) => (letters.slice(0, i).includes(L) ? NAME_WORD2[L] : NAME_BOOK[L][1]));
  const pages = [];
  const lk = lookOf('namebook', o.look);
  pages.push(seasonCover(paper, `${possessive(name)} Name Book`, 'Every letter of my name is special', lk.art, lk.tint, lk.ring, lk.corners, 'book'));
  letters.forEach((L, i) => {
    const thing = NAME_BOOK[L][0], word = words[i];
    const isEmoji = /^\S+ /.test(thing) && !ALL_PICS.includes(thing), label = isEmoji ? thing.split(' ').slice(1).join(' ') : thing;
    const c = PALETTE[i % PALETTE.length];
    const pg = new Page(paper, `${L} is for ${label}`, { subtitle: `Letter ${i + 1} of ${name}. Trace the letters, colour the picture and say the special word out loud!`, noName: true });
    const bw = pg.width * 0.46, bh = 76;
    pg.add(panel(pg.left, pg.y, bw, bh, TINTS[i % TINTS.length], c, 10));
    const ls = bh - 20;
    pg.add(drawText(L, pg.left + bw / 2 - (textWidth(L) / 100) * ls * 0.5 - (textWidth(L.toLowerCase()) / 100) * ls * 0.5 - 3, pg.y + 8, ls, 'trace', true));
    pg.add(drawText(L.toLowerCase(), pg.left + bw / 2 + 3, pg.y + 8, ls, 'trace', true));
    const px = pg.left + bw + 6, pw = pg.width - bw - 6;
    pg.add(panel(px, pg.y, pw, bh, '#fff', '#e2ddf2', 10));
    pg.add(isEmoji ? emoji(thing.split(' ')[0], px + pw / 2, pg.y + bh / 2 - 4, bh * 0.56) : pic(ART(thing), px + pw / 2, pg.y + bh / 2 - 4, bh * 0.7));
    pg.add(txt(px + pw / 2, pg.y + bh - 6, label, 6, { colour: c }));
    pg.y += bh + 8;
    pg.add(panel(pg.left, pg.y, pg.width, 36, '#fff6e0', '#ffb938', 10));
    pg.add(txt(pg.w / 2, pg.y + 12, `${L} is for`, 6, { font: FONT, colour: '#b07d00' }));
    bubbleText(pg, word, pg.w / 2, pg.y + 30, pg.width - 30, 16);
    pg.y += 44;
    const size = Math.min(22, (pg.width - 12) / (textWidth(`${L}${L.toLowerCase()}  ${L}${L.toLowerCase()}  ${L}${L.toLowerCase()}`) / 100 + 0.1));
    for (let r = 0; r < 3 && pg.room > size * 1.6; r++) {
      pg.add(`<line x1="${pg.left}" x2="${pg.right}" y1="${pg.y + size}" y2="${pg.y + size}" stroke="#c9c3e3" stroke-width="0.4"/>`);
      if (r < 2) pg.add(drawText(`${L}${L.toLowerCase()}  ${L}${L.toLowerCase()}  ${L}${L.toLowerCase()}`, pg.left + 2, pg.y, size, 'trace', r === 0));
      pg.y += size * 1.55;
    }
    pages.push(pg.svg());
  });
  // The last page: a poster of the whole name and its special words.
  const pg = new Page(paper, '', { bare: true, tint: '#fffdf8' });
  pg.add(`<rect x="${pg.left - 3}" y="${pg.m - 3}" width="${pg.width + 6}" height="${pg.bottom - pg.m + 3}" rx="12" fill="#fff" stroke="${lk.ring}" stroke-width="1.4"/>`);
  pg.add(txt(pg.w / 2, pg.m + 20, 'My name is', 8, { font: FONT, colour: SOFT }));
  const ns = Math.min(42, (pg.width - 30) / (textWidth(name) / 100 + 0.1));
  pg.add(drawText(name, pg.w / 2 - (textWidth(name) / 100) * ns / 2, pg.m + 26, ns, 'trace', true));
  const rh = Math.min(30, (pg.bottom - 40 - (pg.m + 36 + ns)) / letters.length);
  let y = pg.m + 36 + ns + Math.max(0, (pg.bottom - 40 - (pg.m + 36 + ns) - rh * letters.length) / 2);
  letters.forEach((L, i) => {
    const c = PALETTE[i % PALETTE.length];
    pg.add(`<circle cx="${pg.left + 26}" cy="${y + rh / 2}" r="${rh * 0.38}" fill="${c}"/>` + txt(pg.left + 26, y + rh / 2 + rh * 0.18, L, rh * 0.5, { colour: '#fff' }));
    pg.add(txt(pg.left + 30 + rh * 0.5, y + rh / 2 + rh * 0.17, `is for ${words[i]}`, Math.min(12, rh * 0.48), { anchor: 'start', colour: c }));
    y += rh;
  });
  pg.add(txt(pg.w / 2, pg.bottom - 12, `${name}, you are wonderful, just the way you are.`, fitFont(`${name}, you are wonderful, just the way you are.`, 6, pg.width - 30, 0.5), { colour: lk.ring }));
  pg.footer = () => {};
  pages.push(pg.svg());
  return pages;
}

Object.assign(MAKERS, { halloween: makeHalloween, christmas: makeChristmas, namebook: makeNameBook });
