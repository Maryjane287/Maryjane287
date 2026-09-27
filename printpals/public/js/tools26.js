// PrintPals batch 26 (Plus): Safari Explorer kit, Detective Academy, All About My Grown-Up gift book, Farm Friends kit.

// A drawing box with question lines under it.
function drawAndTellPage(paper, title, sub, qs, ring, share) {
  const pg = new Page(paper, title, { subtitle: sub });
  const bh = pg.room * (share || 0.6);
  pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="${bh}" rx="12" fill="#fff" stroke="${ring}" stroke-width="1" stroke-dasharray="3 2"/>`);
  pg.y += bh + 8;
  const rh = pg.room / qs.length;
  qs.forEach((q, i) => pg.add(txt(pg.left, pg.y + i * rh + rh * 0.6, q, 6, { anchor: 'start', colour: PALETTE[i % PALETTE.length] }) + `<line x1="${pg.left + q.length * 3 + 6}" x2="${pg.right}" y1="${pg.y + i * rh + rh * 0.62}" y2="${pg.y + i * rh + rh * 0.62}" stroke="#c9c3e3" stroke-width="0.5"/>`));
  return pg.svg();
}

// Fact cards, four to a page: [emoji, name, fact, badge].
function factCardsPage(paper, title, sub, cards, ring, tint) {
  return tagsPage(paper, title, sub, cards.length, 2, (pg, x, y, w, h, i) => {
    const [e, nm, fact, badge] = cards[i], c = PALETTE[i % PALETTE.length];
    pg.add(`<rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="9" fill="#fff" stroke="${c}" stroke-width="1.2"/><rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h * 0.44}" rx="9" fill="${TINTS[i % TINTS.length]}"/>`);
    pg.add(emoji(e, x + w / 2, y + h * 0.26, h * 0.26));
    pg.add(txt(x + w / 2, y + h * 0.56, nm, fitFont(nm, 9, w - 16, 0.55), { colour: c }));
    wrap(fact, 30).slice(0, 3).forEach((l, k) => pg.add(txt(x + w / 2, y + h * 0.56 + 9 + k * 6.4, l, 5.2, { font: FONT, weight: 700, colour: INK })));
    if (badge) pg.add(`<rect x="${x + w / 2 - 30}" y="${y + h - 19}" width="60" height="10" rx="5" fill="${c}"/>` + txt(x + w / 2, y + h - 12.3, badge, fitFont(badge, 4.8, 56, 0.5), { colour: '#fff' }));
  });
}

// ================================================================ Safari Explorer kit (Plus)
const SAFARI = [
  ['🦁', 'Lion', 'A lion\'s roar can be heard 8 kilometres away!', 'King of the grassland', 1.2],
  ['🐘', 'Elephant', 'It uses its trunk to drink, smell and even hug.', 'Biggest land animal', 3.3],
  ['🦒', 'Giraffe', 'Its tongue is so long it can clean its own ears!', 'Tallest animal', 5.5],
  ['🦓', 'Zebra', 'Every zebra has its very own stripe pattern.', 'Stripy and speedy', 1.4],
  ['🦛', 'Hippo', 'Hippos keep cool by staying in the water all day.', 'River giant', 1.5],
  ['🐆', 'Cheetah', 'The fastest runner on land, as fast as a car!', 'Speed champion', 0.9],
  ['🦏', 'Rhino', 'Its horn is made of the same stuff as your nails.', 'Armoured giant', 1.8],
  ['🦍', 'Gorilla', 'Gorillas build a new leafy bed every night.', 'Gentle and strong', 1.7],
];
const SAFARI_RIDDLES = [
  ['I have a long neck and spots. I eat leaves from the tallest trees.', 'giraffe'],
  ['I have black and white stripes and I look like a horse.', 'zebra'],
  ['I have big ears, a long trunk and I never forget!', 'elephant'],
  ['I am a big cat with a fluffy mane. I love to roar.', 'lion'],
  ['I am the fastest runner. I have spots and a long tail.', 'cheetah'],
  ['I spend all day in the river and I have a huge yawn.', 'hippo'],
];

function makeSafari(o, paper) {
  const rand = rng(+o.seed || 1);
  const name = nameOf(o.name, '') || '';
  const ring = '#d9822b', tint = '#fff4e6';
  const pages = [seriesCover(paper, 'SAFARI EXPLORER', name ? `${possessive(name)} safari book` : 'My safari book', 'Grab your binoculars. Let\'s go!', ['🦁', '🐘', '🦒', '🦓', '🔭', '🌳'], ring, tint, 'explorer book', ['8 safari animal cards', 'How tall are they?', 'Who am I? riddles', 'Safari spotter bingo', 'Design an animal', 'Safari Ranger award'])];
  for (let p = 0; p < 8; p += 4) pages.push(factCardsPage(paper, p ? 'Safari animal cards (more)' : 'Safari animal cards', 'Read each card together, then cut them out. Which animal is your favourite?', SAFARI.slice(p, p + 4).map((a) => a.slice(0, 4)), ring, tint));
  // How tall are they?
  {
    const pg = new Page(paper, 'How tall are they?', { subtitle: 'Each line is 1 metre. You are about 1 metre tall! Colour each animal\'s bar and compare.' });
    const list = [['🧒', 'You!', 1.1]].concat(SAFARI.map((a) => [a[0], a[1], a[4]])).sort((a, b) => a[2] - b[2]), max = 6, lh = 18, ch = pg.room - lh - 14, cw = (pg.width - 14) / list.length, s = ch / max;
    for (let m = 0; m <= max; m++) { const y = pg.y + ch - m * s; pg.add(`<line x1="${pg.left + 12}" x2="${pg.right}" y1="${y}" y2="${y}" stroke="${m ? '#e2ddf2' : '#9a93b8'}" stroke-width="0.4"/>` + txt(pg.left + 9, y + 1.6, `${m} m`, 4.4, { anchor: 'end', font: FONT, colour: SOFT })); }
    list.forEach(([e, nm, h], i) => { const x = pg.left + 14 + i * cw, c = nm === 'You!' ? ring : PALETTE[i % PALETTE.length]; pg.add(`<rect x="${x + cw * 0.18}" y="${pg.y + ch - h * s}" width="${cw * 0.64}" height="${h * s}" rx="2" fill="#fff" stroke="${c}" stroke-width="0.9"/>` + emoji(e, x + cw / 2, pg.y + ch - h * s - 6, Math.min(10, cw * 0.6)) + txt(x + cw / 2, pg.y + ch + 7, nm, fitFont(nm, 5, cw - 2, 0.52), { colour: c })); });
    pg.add(txt(pg.left, pg.bottom - 4, 'The tallest animal is the', 6, { anchor: 'start', colour: ring }) + `<line x1="${pg.left + 74}" x2="${pg.right}" y1="${pg.bottom - 3.4}" y2="${pg.bottom - 3.4}" stroke="#c9c3e3" stroke-width="0.5"/>`);
    pages.push(pg.svg());
  }
  // Who am I?
  pages.push(tagsPage(paper, 'Who am I?', 'Read each riddle out loud. Can you guess the animal? Draw it in the box!', 6, 2, (pg, x, y, w, h, i) => {
    const [r] = SAFARI_RIDDLES[i], c = PALETTE[i % PALETTE.length];
    pg.add(`<rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="9" fill="${TINTS[i % TINTS.length]}" stroke="${c}" stroke-width="1"/>` + txt(x + 12, y + 14, `Riddle ${i + 1}`, 6.4, { anchor: 'start', colour: c }));
    wrap(r, 30).forEach((l, k) => pg.add(txt(x + 12, y + 23 + k * 6.6, l, 5.4, { anchor: 'start', font: FONT, weight: 700, colour: INK })));
    pg.add(`<rect x="${x + w - 36}" y="${y + h - 36}" width="26" height="26" rx="5" fill="#fff" stroke="${c}" stroke-width="0.6" stroke-dasharray="2 1.5"/>` + txt(x + 12, y + h - 13, 'I am a', 5.4, { anchor: 'start', font: FONT, colour: SOFT }) + `<line x1="${x + 32}" x2="${x + w - 42}" y1="${y + h - 12.4}" y2="${y + h - 12.4}" stroke="#c9c3e3" stroke-width="0.5"/>`);
  }));
  pages.push(picGridPage(paper, 'Safari spotter bingo', 'Spot these at the zoo, a safari park, in a book or on a wildlife show. Four in a row is BINGO!', [['🦁', 'Lion'], ['🐘', 'Elephant'], ['🦒', 'Giraffe'], ['🦓', 'Zebra'], ['🦛', 'Hippo'], ['🐆', 'Cheetah'], ['🦏', 'Rhino'], ['🦍', 'Gorilla'], ['🐒', 'Monkey'], ['🦩', 'Flamingo'], ['🐊', 'Crocodile'], ['🦅', 'Eagle'], ['🐍', 'Snake'], ['🌳', 'Acacia tree'], ['🐾', 'Paw prints'], ['💧', 'Watering hole']]));
  pages.push(countRowsPage(paper, 'Count the safari animals', ['🦁', '🐘', '🦒', '🦓', '🐒', '🦩'], rand));
  pages.push(drawAndTellPage(paper, 'Design a safari animal', 'Mix two animals together! A lion with a trunk? A zebra with wings? Draw your new animal.', ['My animal is called', 'It is a mix of', 'It eats', 'Its super skill is'], ring));
  pages.push(traceWordsPage(paper, 'Trace the safari words', [['lion', '🦁'], ['zebra', '🦓'], ['roar', '🐾'], ['tree', '🌳']]));
  pages.push(seasonColour(paper, 'elephant', name));
  pages.push(seasonColour(paper, 'giraffe', name));
  pages.push(seriesCert(paper, 'SAFARI EXPLORER', 'Safari Ranger', name, 'for exploring the wild and caring for amazing animals!', 'Next adventure: the Ocean Explorer or Dinosaur Explorer kit!', ring));
  return pages;
}

// ================================================================ Detective Academy (Plus)
const CASES = [
  { title: 'The Case of the Missing Cookie', intro: 'Someone took the last cookie from the jar in the kitchen! Four friends were at home. Read the clues and cross out the suspects one by one.',
    suspects: [['🐱', 'Cat', 'Was in the kitchen. Loves fish. Has big paws.'], ['🐶', 'Dog', 'Was in the garden all day. Loves bones.'], ['🐭', 'Mouse', 'Was in the kitchen. Loves crumbs. Has tiny feet.'], ['🐰', 'Rabbit', 'Was in the kitchen. Loves carrots. Very long ears.']],
    clues: ['The cookie jar is in the kitchen. The thief was in the kitchen.', 'The cookie was taken from a tiny hole in the lid. No long ears fit!', 'There were tiny footprints in the cookie crumbs.'], answer: 'Mouse' },
  { title: 'The Case of the Muddy Footprints', intro: 'Muddy footprints appeared on the clean farmhouse floor! Four farm friends were nearby. Use the clues to find who made them.',
    suspects: [['🐷', 'Pig', 'Was in the farmyard. Loves mud. Has four legs.'], ['🦆', 'Duck', 'Was in the farmyard. Loves the pond. Has two legs.'], ['🐴', 'Horse', 'Was out in the far field. Has four legs.'], ['🐔', 'Hen', 'Was in the farmyard. Loves seeds. Has two legs.']],
    clues: ['The footprints came from the farmyard, not the far field.', 'The footprints were made by an animal with four legs.', 'The mud smelled just like the big muddy puddle.'], answer: 'Pig' },
];

function makeDetective(o, paper) {
  const name = nameOf(o.name, '') || '';
  const ring = '#2f3b8f', tint = '#eef0fb';
  const pages = [seriesCover(paper, 'TOP SECRET: DETECTIVE ACADEMY', name ? `Detective ${name}` : 'Detective Academy', 'Every clue tells a story', ['🔍', '🕵️', '👣', '🗝️', '📓', '🔦'], ring, tint, 'case file', ['Detective ID badge', 'Fingerprint lab', 'Secret codes', 'Two mysteries to solve', 'My case notebook', 'Master Detective award'])];
  // ID badges.
  pages.push(tagsPage(paper, 'My detective ID', 'Fill in your ID, draw your face and cut it out. Every detective needs a badge!', 2, 1, (pg, x, y, w, h, i) => {
    const c = i ? '#b03060' : ring;
    pg.add(`<rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="10" fill="${i ? '#fff0f5' : tint}" stroke="${c}" stroke-width="1.4"/><rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="18" rx="10" fill="${c}"/>`);
    pg.add(txt(x + w / 2, y + 16.4, i ? 'JUNIOR DETECTIVE PASS' : 'OFFICIAL DETECTIVE ID', 8, { colour: '#fff' }).replace('<text ', '<text letter-spacing="2" ') + emoji('🔍', x + w - 18, y + 13, 9));
    pg.add(`<rect x="${x + 14}" y="${y + 30}" width="${h * 0.55}" height="${h * 0.62}" rx="6" fill="#fff" stroke="${c}" stroke-width="0.8" stroke-dasharray="2 1.5"/>` + txt(x + 14 + h * 0.275, y + 30 + h * 0.31, 'Draw your face', 3.8, { font: FONT, colour: SOFT }));
    const fx = x + 22 + h * 0.55;
    [['Name', name], ['Code name', ''], ['Special skill', ''], ['Thumbprint', '']].forEach(([l, v], k) => { const yy = y + 38 + k * (h * 0.62 - 8) / 4; pg.add(txt(fx, yy, l, 5, { anchor: 'start', font: FONT, colour: SOFT }) + (k === 3 ? `<rect x="${fx + 34}" y="${yy - 9}" width="18" height="14" rx="3" fill="#fff" stroke="${c}" stroke-width="0.6"/>` : `<line x1="${fx + l.length * 2.6 + 4}" x2="${x + w - 16}" y1="${yy + 0.8}" y2="${yy + 0.8}" stroke="#c9c3e3" stroke-width="0.5"/>`) + (v ? txt(fx + l.length * 2.6 + 7, yy - 0.4, v, 6.4, { anchor: 'start', colour: c }) : '')); });
  }));
  // Fingerprint lab.
  {
    const pg = new Page(paper, 'Fingerprint lab', { subtitle: 'Rub a pencil on scrap paper, press a finger on it, then press it in a box. Use a magnifying glass. Is it a loop, a whorl or an arch?' });
    const types = [['Loop', (cx, cy, r) => [0.3, 0.55, 0.8, 1].map((f) => `<path d="M${cx - r * f} ${cy + r} V${cy} A${r * f} ${r * f} 0 0 1 ${cx + r * f} ${cy} V${cy + r}"/>`).join('')], ['Whorl', (cx, cy, r) => [0.25, 0.5, 0.75, 1].map((f) => `<ellipse cx="${cx}" cy="${cy}" rx="${r * f}" ry="${r * f * 1.2}"/>`).join('')], ['Arch', (cx, cy, r) => [0.2, 0.45, 0.7, 0.95].map((f) => `<path d="M${cx - r} ${cy + r * (1 - f) + r * 0.3} Q${cx} ${cy - r * f * 1.3} ${cx + r} ${cy + r * (1 - f) + r * 0.3}"/>`).join('')]];
    const tw = pg.width / 3;
    types.forEach(([t, f], i) => { const cx = pg.left + i * tw + tw / 2, cy = pg.y + 22; pg.add(panel(pg.left + i * tw + 3, pg.y, tw - 6, 48, TINTS[i], PALETTE[i], 9) + `<g fill="none" stroke="#1f1b2e" stroke-width="0.7">${f(cx, cy, 13)}</g>` + txt(cx, pg.y + 44, t, 6.6, { colour: PALETTE[i] })); });
    pg.y += 58;
    const fingers = ['Thumb', 'Pointer', 'Middle', 'Ring', 'Little'], cw = pg.width / 5, bh = (pg.room - 14) / 2;
    ['Left hand', 'Right hand'].forEach((hnd, r) => { const y = pg.y + r * (bh + 7); pg.add(txt(pg.left, y + 4, hnd, 6, { anchor: 'start', colour: ring })); fingers.forEach((fn, k) => pg.add(`<rect x="${pg.left + k * cw + 2}" y="${y + 8}" width="${cw - 4}" height="${bh - 18}" rx="7" fill="#fff" stroke="#b9b3d6" stroke-width="0.7"/>` + txt(pg.left + k * cw + cw / 2, y + bh - 3, fn, 5, { font: FONT, colour: SOFT }))); });
    pages.push(pg.svg());
  }
  // Secret codes.
  pages.push(...packRun('secretcode', { code: 'numbers', custom: 'MEET AT THE BIG TREE\nTHE CLUE IS UNDER THE MAT\nWELL DONE DETECTIVE\nLOOK BEHIND THE DOOR' }, paper, +o.seed || 1).sheets);
  // The mysteries.
  CASES.forEach((cs, n) => {
    const pg = new Page(paper, cs.title, { subtitle: `Case ${n + 1}. ${cs.intro}` });
    const cw = pg.width / 4, ch = 70;
    cs.suspects.forEach(([e, nm, d], i) => { const x = pg.left + i * cw, c = PALETTE[i % PALETTE.length]; pg.add(panel(x + 2, pg.y, cw - 4, ch, TINTS[i % TINTS.length], c, 9) + emoji(e, x + cw / 2, pg.y + 14, 16) + txt(x + cw / 2, pg.y + 30, nm, 7.4, { colour: c })); wrap(d, 17).slice(0, 5).forEach((l, k) => pg.add(txt(x + cw / 2, pg.y + 38 + k * 5.6, l, 4.6, { font: FONT, weight: 700, colour: INK }))); });
    pg.y += ch + 10;
    pg.add(txt(pg.left, pg.y, 'THE CLUES', 6.4, { anchor: 'start', font: FONT, colour: SOFT }).replace('<text ', '<text letter-spacing="1.6" '));
    pg.y += 5;
    cs.clues.forEach((cl, i) => { const y = pg.y + i * 20; pg.add(panel(pg.left, y, pg.width, 17, '#fff', ring, 8) + emoji('🔍', pg.left + 9, y + 8.5, 8) + txt(pg.left + 18, y + 10.6, `Clue ${i + 1}: ${cl}`, fitFont(`Clue ${i + 1}: ${cl}`, 6, pg.width - 26, 0.5), { anchor: 'start', colour: INK })); });
    pg.y += cs.clues.length * 20 + 8;
    const bh = Math.max(40, pg.room - 16);
    pg.add(panel(pg.left, pg.y, pg.width, bh, tint, ring, 12) + txt(pg.left + 10, pg.y + 14, 'I solved it! The culprit is', 7.4, { anchor: 'start', colour: ring }) + `<line x1="${pg.left + 100}" x2="${pg.right - 10}" y1="${pg.y + 14.6}" y2="${pg.y + 14.6}" stroke="#b9b3d6" stroke-width="0.6"/>` + txt(pg.left + 10, pg.y + 28, 'I know because', 6, { anchor: 'start', font: FONT, colour: SOFT }) + `<line x1="${pg.left + 52}" x2="${pg.right - 10}" y1="${pg.y + 28.6}" y2="${pg.y + 28.6}" stroke="#b9b3d6" stroke-width="0.5"/>`);
    pg.add(`<text x="${pg.w / 2}" y="${pg.bottom - 1}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="4" fill="#b9b3d6" transform="rotate(180 ${pg.w / 2} ${pg.bottom - 2.4})">Answer for grown-ups: ${esc(cs.answer)}</text>`);
    pages.push(pg.svg());
  });
  pages.push(drawAndTellPage(paper, 'My case notebook', 'Be a real detective at home! Find a mystery (Where did the sock go? Who ate the last grape?) and investigate.', ['The mystery', 'Suspects', 'Clues I found', 'I solved it! It was'], ring, 0.4));
  pages.push(checklistPage(paper, 'Detective training', 'Real detectives practise every day. Colour a star for each skill!', [['👀', 'Spot 5 things that are blue in this room'], ['🧠', 'Look at a tray of 8 things, then say what is missing'], ['👂', 'Close your eyes and name 3 sounds you hear'], ['👣', 'Follow footprints or a trail of clues'], ['🔦', 'Find something hidden in a dark corner'], ['🗝️', 'Crack a secret code'], ['📝', 'Write down everything you see out of a window'], ['🤫', 'Keep a surprise secret for a whole day']], name));
  pages.push(seriesCert(paper, 'DETECTIVE ACADEMY', 'Master Detective', name, 'for sharp eyes, clever thinking and solving every case!', 'Next academy: Superhero Academy or Space Academy!', ring));
  return pages;
}

// ================================================================ All About My Grown-Up gift book (Plus)
function makeGrownUpBook(o, paper) {
  const name = nameOf(o.name, '') || '';
  const who = String(o.who || '').trim().replace(/[<>]/g, '').slice(0, 20) || 'Mum';
  const lk = { rose: { ring: '#e0457b', tint: '#fff0f5' }, sky: { ring: '#3a8fd8', tint: '#eef6ff' }, sunny: { ring: '#e08a00', tint: '#fff6e0' } }[o.look] || { ring: '#e0457b', tint: '#fff0f5' };
  const W = who, my = `My ${who}`;
  const pages = [seriesCover(paper, 'A GIFT MADE WITH LOVE', `All about my ${who}`, name ? `By ${name}` : 'Made by me, with love', ['💝', '🌷', '⭐', '🤗', '🎁', '💌'], lk.ring, lk.tint, 'book', [`This is my ${who}`, 'Favourite things', `${W} always says`, 'Our interview', 'Love coupons', `World's Best ${W}`])];
  // Portrait and fill-ins.
  {
    const pg = new Page(paper, `This is my ${who}`, { subtitle: `Draw a picture of your ${who}, then fill in the blanks. Your guesses are perfect!` });
    const fh = pg.room * 0.5;
    pg.add(`<rect x="${pg.left + pg.width * 0.18}" y="${pg.y}" width="${pg.width * 0.64}" height="${fh}" rx="14" fill="${lk.tint}" stroke="${lk.ring}" stroke-width="2"/><rect x="${pg.left + pg.width * 0.18 + 6}" y="${pg.y + 6}" width="${pg.width * 0.64 - 12}" height="${fh - 12}" rx="10" fill="#fff" stroke="${lk.ring}" stroke-width="0.6" stroke-dasharray="3 2"/>`);
    ['💗', '⭐', '🌷', '✨'].forEach((e, i) => pg.add(emoji(e, pg.left + pg.width * (i % 2 ? 0.86 : 0.14), pg.y + (i < 2 ? 12 : fh - 12), 10)));
    pg.y += fh + 10;
    const qs = [`${my} is`, 'years old.', `${my} is`, 'tall.', `${my}'s hair is`, '', `${my}'s eyes are`, '', `${my}'s job is`, '']; const rh = pg.room / 5;
    for (let i = 0; i < 5; i++) { const y = pg.y + i * rh + rh * 0.6, a = qs[i * 2], b = qs[i * 2 + 1]; pg.add(txt(pg.left, y, a, 6.6, { anchor: 'start', colour: PALETTE[i % PALETTE.length] }) + `<line x1="${pg.left + a.length * 3.3 + 6}" x2="${pg.right - (b ? b.length * 3.3 + 8 : 0)}" y1="${y + 0.6}" y2="${y + 0.6}" stroke="#c9c3e3" stroke-width="0.5"/>` + (b ? txt(pg.right, y, b, 6.6, { anchor: 'end', colour: PALETTE[i % PALETTE.length] }) : '')); }
    pages.push(pg.svg());
  }
  // Favourite things.
  pages.push(tagsPage(paper, `${my}'s favourite things`, 'Write or draw the answer in each box. Then ask to check!', 6, 2, (pg, x, y, w, h, i) => {
    const [e, t] = [['🍽️', 'Favourite food'], ['🎨', 'Favourite colour'], ['🎵', 'Favourite song'], ['🗺️', 'Favourite place'], ['🍰', 'Favourite treat'], ['📺', 'Favourite show']][i], c = PALETTE[i % PALETTE.length];
    pg.add(`<rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="10" fill="${TINTS[i % TINTS.length]}" stroke="${c}" stroke-width="1"/>` + emoji(e, x + 16, y + 16, 10) + txt(x + 26, y + 18, t, 7, { anchor: 'start', colour: c }) + `<rect x="${x + 12}" y="${y + 26}" width="${w - 24}" height="${h - 38}" rx="7" fill="#fff" stroke="${c}" stroke-width="0.4" stroke-dasharray="2 1.6"/>`);
  }));
  // Always says / good at.
  {
    const pg = new Page(paper, `${W} always says...`, { subtitle: 'Write the things you hear all the time! Then finish the other sentences.' });
    const bh = pg.room * 0.4;
    const bx = pg.left + 6, bw = pg.width - 12;
    pg.add(`<path d="M${bx + 12} ${pg.y} H${bx + bw - 12} Q${bx + bw} ${pg.y} ${bx + bw} ${pg.y + 12} V${pg.y + bh - 22} Q${bx + bw} ${pg.y + bh - 10} ${bx + bw - 12} ${pg.y + bh - 10} H${bx + 60} L${bx + 40} ${pg.y + bh + 4} L${bx + 44} ${pg.y + bh - 10} H${bx + 12} Q${bx} ${pg.y + bh - 10} ${bx} ${pg.y + bh - 22} V${pg.y + 12} Q${bx} ${pg.y} ${bx + 12} ${pg.y} Z" fill="${lk.tint}" stroke="${lk.ring}" stroke-width="1.2"/>`);
    for (let l = 1; l <= 4; l++) pg.add(`<line x1="${bx + 12}" x2="${bx + bw - 12}" y1="${pg.y + l * (bh - 16) / 4.6}" y2="${pg.y + l * (bh - 16) / 4.6}" stroke="#d9c8d4" stroke-width="0.45"/>`);
    pg.y += bh + 12;
    const qs = [`${my} is really good at`, `${my} makes me laugh when`, `${my} is the best at helping me`, `When ${W} was little, I think`], rh = pg.room / qs.length;
    qs.forEach((q, i) => { const y = pg.y + i * rh; pg.add(txt(pg.left, y + 8, q, 6.6, { anchor: 'start', colour: PALETTE[i % PALETTE.length] })); for (let l = 1; l <= 2; l++) pg.add(`<line x1="${pg.left}" x2="${pg.right}" y1="${y + 8 + l * (rh - 10) / 2.2}" y2="${y + 8 + l * (rh - 10) / 2.2}" stroke="#c9c3e3" stroke-width="0.45"/>`); });
    pages.push(pg.svg());
  }
  // Interview.
  pages.push(checklistPage(paper, `Interview with my ${who}`, `Ask your ${who} these questions and write or draw the answers on the back. Then swap and let them ask you!`, [['👶', 'What were you like when you were my age?'], ['🧸', 'What was your favourite toy?'], ['🏫', 'What did you love at school?'], ['🍭', 'What was your favourite sweet?'], ['😂', 'What is the funniest thing that ever happened to you?'], ['🌍', 'Where would you love to go one day?'], ['💭', 'What did you want to be when you grew up?'], ['💗', 'What is your favourite thing about me?']], name));
  // Things we love doing together + I love because.
  pages.push(drawAndTellPage(paper, 'Things we love doing together', `Draw you and your ${who} doing your favourite thing together.`, [`I love my ${who} because`, 'The best day we ever had was', 'Next time, let\'s', 'Love from'], lk.ring, 0.55));
  // Love coupons.
  pages.push(tagsPage(paper, 'Love coupons', `Colour these coupons, cut them out and give them to your ${who}. They can use one any time!`, 8, 2, (pg, x, y, w, h, i) => {
    const [e, t] = [['🤗', 'One giant hug'], ['🥞', 'Breakfast in bed'], ['🧹', 'I will tidy up'], ['📖', 'A story read by me'], ['😴', 'A quiet lie-in'], ['🎨', 'A picture just for you'], ['💆', 'A shoulder rub'], ['🌟', 'A wish of your choice']][i], c = PALETTE[i % PALETTE.length];
    pg.add(`<rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="8" fill="#fff" stroke="${c}" stroke-width="1" stroke-dasharray="4 2"/>` + txt(x + w / 2, y + 13, 'LOVE COUPON', 4.8, { font: FONT, colour: SOFT }).replace('<text ', '<text letter-spacing="1.6" ') + emoji(e, x + 18, y + h / 2 + 3, h * 0.28) + txt(x + w / 2 + 12, y + h / 2 + 5, t, fitFont(t, 8, w - 50, 0.55), { colour: c }) + txt(x + w - 10, y + h - 9, `For my ${who}`, 4.4, { anchor: 'end', font: FONT, colour: SOFT }));
  }));
  pages.push(seriesCert(paper, 'A VERY SPECIAL AWARD', `World's Best ${W}`, W, `This award is given with all my love${name ? `, from ${name}` : ''}!`, `Thank you for everything you do. I love you!`, lk.ring));
  return pages;
}

// ================================================================ Farm Friends kit (Plus)
const FARM = [
  ['🐄', 'Cow', 'calf', 'Moo!', 'milk'], ['🐖', 'Pig', 'piglet', 'Oink!', ''], ['🐑', 'Sheep', 'lamb', 'Baa!', 'wool'], ['🐔', 'Hen', 'chick', 'Cluck!', 'eggs'],
  ['🐴', 'Horse', 'foal', 'Neigh!', ''], ['🐐', 'Goat', 'kid', 'Maa!', 'milk'], ['🦆', 'Duck', 'duckling', 'Quack!', 'eggs'], ['🐇', 'Rabbit', 'kit', 'Sniff!', ''],
];
const BABY = { calf: '🐮', piglet: '🐷', lamb: '🐑', chick: '🐥', foal: '🐴', kid: '🐐', duckling: '🐤', kit: '🐰' };

function makeFarm(o, paper) {
  const rand = rng(+o.seed || 1);
  const name = nameOf(o.name, '') || '';
  const ring = '#c0392b', tint = '#fff4ec';
  const pages = [seriesCover(paper, 'FARM FRIENDS', name ? `${possessive(name)} farm book` : 'My farm book', 'Moo, baa, oink! Welcome to the farm', ['🐄', '🐖', '🐑', '🐔', '🚜', '🌾'], ring, tint, 'farm book', ['8 farm animal cards', 'Mummies and babies', 'Who says what?', 'What the farm gives us', 'Farm bingo', 'Little Farmer award'])];
  for (let p = 0; p < 8; p += 4) pages.push(factCardsPage(paper, p ? 'Farm animal cards (more)' : 'Farm animal cards', 'Say each animal and its sound out loud. Cut the cards out and play snap!', FARM.slice(p, p + 4).map(([e, nm, baby, snd]) => [e, nm, `Its baby is called a ${baby}. It says ${snd}`, snd]), ring, tint));
  // Mummies and babies matching.
  {
    const pg = new Page(paper, 'Mummies and babies', { subtitle: 'Draw a line from each grown-up animal to its baby. Say the baby name out loud!' });
    const list = shuffle(FARM.slice(0, 6), rand), babies = shuffle(list, rand), rh = pg.room / list.length;
    list.forEach(([e, nm], i) => { const y = pg.y + i * rh + rh / 2; pg.add(panel(pg.left, y - rh * 0.4, 60, rh * 0.8, TINTS[i % TINTS.length], PALETTE[i % PALETTE.length], 9) + emoji(e, pg.left + 16, y, rh * 0.45) + txt(pg.left + 34, y + 2.2, nm, 6.4, { anchor: 'start', colour: PALETTE[i % PALETTE.length] }) + `<circle cx="${pg.left + 64}" cy="${y}" r="2" fill="${PALETTE[i % PALETTE.length]}"/>`); });
    babies.forEach(([, , baby], i) => { const y = pg.y + i * rh + rh / 2, x = pg.right - 60; pg.add(`<circle cx="${x - 4}" cy="${y}" r="2" fill="#9a93b8"/>` + panel(x, y - rh * 0.4, 60, rh * 0.8, '#fff', '#b9b3d6', 9) + emoji(BABY[baby], x + 14, y, rh * 0.4) + txt(x + 30, y + 2.2, baby, 6.4, { anchor: 'start', colour: INK })); });
    pages.push(pg.svg());
  }
  // Who says what?
  {
    const pg = new Page(paper, 'Who says what?', { subtitle: 'Read each sound in your best animal voice! Then write the animal that makes it.' });
    const list = shuffle(FARM, rand), cw = pg.width / 2, ch = pg.room / 4;
    list.forEach(([e, nm, , snd], i) => { const x = pg.left + (i % 2) * cw, y = pg.y + Math.floor(i / 2) * ch, c = PALETTE[i % PALETTE.length]; pg.add(panel(x + 3, y + 3, cw - 6, ch - 6, TINTS[i % TINTS.length], c, 10)); bubbleText(pg, snd, x + cw / 2, y + ch * 0.42, cw - 30, 18); pg.add(`<line x1="${x + 16}" x2="${x + cw - 16}" y1="${y + ch - 14}" y2="${y + ch - 14}" stroke="${c}" stroke-width="0.6"/>` + txt(x + 16, y + ch - 17, 'It is the', 4.8, { anchor: 'start', font: FONT, colour: SOFT })); });
    pages.push(pg.svg());
  }
  // What the farm gives us.
  {
    const pg = new Page(paper, 'What the farm gives us', { subtitle: 'Farm animals give us lots of things! Draw a line from each animal to what it gives us.' });
    const rows = [['🐄', 'Cow', '🥛', 'Milk'], ['🐔', 'Hen', '🥚', 'Eggs'], ['🐑', 'Sheep', '🧶', 'Wool'], ['🐝', 'Bee', '🍯', 'Honey']], outs = shuffle(rows, rand), rh = (pg.room - 60) / rows.length;
    rows.forEach(([e, nm], i) => { const y = pg.y + i * rh + rh / 2; pg.add(emoji(e, pg.left + 20, y, rh * 0.5) + txt(pg.left + 40, y + 2.4, nm, 8, { anchor: 'start', colour: PALETTE[i] }) + `<circle cx="${pg.left + 72}" cy="${y}" r="2.2" fill="${PALETTE[i]}"/>`); });
    outs.forEach(([, , e, t], i) => { const y = pg.y + i * rh + rh / 2; pg.add(`<circle cx="${pg.right - 76}" cy="${y}" r="2.2" fill="#9a93b8"/>` + emoji(e, pg.right - 56, y, rh * 0.45) + txt(pg.right - 40, y + 2.4, t, 8, { anchor: 'start', colour: INK })); });
    pg.y += rows.length * rh + 6;
    pg.add(panel(pg.left, pg.y, pg.width, pg.room - 2, '#fff', ring, 10) + txt(pg.left + 10, pg.y + 12, 'Which farm food did you eat today? Draw it!', 6.4, { anchor: 'start', colour: ring }));
    pages.push(pg.svg());
  }
  pages.push(countRowsPage(paper, 'Farm counting', ['🐄', '🐖', '🐑', '🐔', '🥚', '🚜'], rand));
  pages.push(picGridPage(paper, 'Farm bingo', 'Visit a farm, read a farm book or sing Old MacDonald. Cross off everything you spot!', [['🐄', 'Cow'], ['🐖', 'Pig'], ['🐑', 'Sheep'], ['🐔', 'Hen'], ['🐴', 'Horse'], ['🐐', 'Goat'], ['🦆', 'Duck'], ['🐇', 'Rabbit'], ['🚜', 'Tractor'], ['🌾', 'Wheat'], ['🥚', 'Eggs'], ['🐶', 'Farm dog'], ['🏠', 'Farmhouse'], ['🌻', 'Sunflower'], ['🐥', 'Chick'], ['👢', 'Wellies']]));
  pages.push(traceWordsPage(paper, 'Trace the farm words', [['cow', '🐄'], ['pig', '🐖'], ['hen', '🐔'], ['farm', '🚜']]));
  pages.push(seasonColour(paper, 'bunny', name));
  pages.push(seasonColour(paper, 'chick', name));
  pages.push(seriesCert(paper, 'FARM FRIENDS', 'Little Farmer', name, 'for looking after the farm animals so well!', 'Next adventure: the Safari Explorer kit!', ring));
  return pages;
}

Object.assign(MAKERS, { safari: makeSafari, detective: makeDetective, grownupbook: makeGrownUpBook, farm: makeFarm });
