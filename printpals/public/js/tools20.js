// PrintPals batch 20 (Plus stage 4): Little Learner Levels, monthly letters from Poppy, and three teacher tools:
// a whole class seasonal set, an end of year memory book for every child, and classroom displays.

const POPPY = 'img/logo.svg';

// ================================================================ Little Learner Levels (Plus)
const LEVELS_PATH = [
  ['Pencil Pal', '✏️', '#ff6b6b', ['Trace three wiggly lines', 'Colour a picture carefully', 'Cut along a straight line', 'Hold my pencil like a pro', 'Trace my name']],
  ['Shape Spotter', '🔺', '#ffb938', ['Name a circle, a square and a triangle', 'Find five circles at home', 'Draw a house using shapes', 'Copy a pattern', 'Sort my toys by shape']],
  ['Letter Lion', '🦁', '#e08a00', ['Say the sounds s, a, t and p', 'Trace every letter of my name', 'Find things that start with my letter', 'Sing the alphabet song', 'Write my first letter by myself']],
  ['Number Hero', '🦸', '#3fbfa8', ['Count to 20', 'Write the numbers 1 to 10', 'Count ten things around me', 'Spot numbers around the house', 'Show five on my fingers']],
  ['Word Builder', '🧱', '#6c8cff', ['Read three short words like cat', 'Build cat, dog and sun', 'Find five sight words', 'Say a word that rhymes with cat', 'Write a word all by myself']],
  ['Story Star', '⭐', '#b06cff', ['Listen to a whole story', 'Retell a story: start, middle, end', 'Draw my favourite character', 'Make up a new ending', 'Read a book to someone I love']],
  ['Maths Magician', '🎩', '#ff7eb6', ['Add two numbers up to 10', 'Take away within 10', 'Double the numbers up to 5', 'Count in twos to 20', 'Solve a story sum']],
  ['Time Traveller', '⏰', '#1f9fa8', ['Say the days of the week', 'Tell the time: o\'clock', 'Tell the time: half past', 'Name the months of the year', 'Make my own daily routine']],
  ['Super Writer', '📝', '#2e9d62', ['Write a sentence with a capital letter', 'Remember my full stop', 'Write about my weekend', 'Write a letter to someone', 'Spell five words by myself']],
  ['PrintPals Legend', '🏆', '#8a3fd1', ['Finish a whole activity book', 'Teach someone something I learned', 'Read a book by myself', 'Solve a really tricky puzzle', 'Feel proud of how much I have learned']],
];

function makeLearnerLevels(o, paper) {
  const name = nameOf(o.name, '');
  const lv = Math.max(1, Math.min(10, parseInt(o.level, 10) || 1));
  const [title, e, c, tasks] = LEVELS_PATH[lv - 1];
  const pages = [];
  if (o.map !== false) {
    // The whole journey: ten stepping stones to colour.
    const pg = new Page(paper, name ? `${possessive(name)} learning journey` : 'My learning journey', { subtitle: 'Ten levels to explore. Colour each stone when you finish its level!', noName: !!name });
    const pts = [...Array(10).keys()].map((i) => { const row = Math.floor(i / 2), left = (row % 2 === 0) === (i % 2 === 0); return [pg.left + (left ? pg.width * 0.25 : pg.width * 0.75), pg.y + 14 + row * (pg.room - 30) / 4.4]; });
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < 10; i++) d += ` Q${(pts[i - 1][0] + pts[i][0]) / 2} ${pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * (i % 2 ? -0.4 : 1.4)} ${pts[i][0]} ${pts[i][1]}`;
    pg.add(`<path d="${d}" fill="none" stroke="#e2ddf2" stroke-width="7" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="3 3"/>`);
    LEVELS_PATH.forEach(([t, em, col], i) => {
      const [x, y] = pts[i], here = i + 1 === lv;
      pg.add(`<circle cx="${x}" cy="${y}" r="15" fill="#fff" stroke="${col}" stroke-width="${here ? 2.4 : 1.2}"/>` + emoji(em, x, y - 2, 12) + `<circle cx="${x + 12}" cy="${y - 11}" r="5" fill="${col}"/>` + txt(x + 12, y - 9.2, i + 1, 5, { colour: '#fff' }));
      pg.add(txt(x, y + 22, t, 5.6, { colour: col }));
      if (here) pg.add(txt(x, y + 29, 'You are here!', 4.4, { font: FONT, colour: SOFT }));
    });
    pages.push(pg.svg());
  }
  // The level card: five challenges to tick off.
  {
    const pg = new Page(paper, `Level ${lv}: ${title}`, { subtitle: 'Do each challenge with a grown-up. Colour the star when you can do it!' });
    pg.add(panel(pg.left, pg.y, pg.width, 46, TINTS[(lv - 1) % TINTS.length], c, 12) + emoji(e, pg.left + 26, pg.y + 23, 30));
    pg.add(txt(pg.left + 50, pg.y + 18, name ? `${name} is working towards` : 'I am working towards', 5.4, { anchor: 'start', font: FONT, colour: SOFT }));
    bubbleText(pg, `${title} badge`, pg.left + 50 + (pg.width - 56) / 2, pg.y + 36, pg.width - 60, 15);
    pg.y += 54;
    const rh = (pg.room - 30) / 5;
    tasks.forEach((t, i) => {
      const y = pg.y + i * rh;
      pg.add(panel(pg.left, y + 2, pg.width, rh - 4, '#fff', c, 9) + `<circle cx="${pg.left + 13}" cy="${y + rh / 2}" r="7" fill="${c}"/>` + txt(pg.left + 13, y + rh / 2 + 2.6, i + 1, 7, { colour: '#fff' }));
      pg.add(txt(pg.left + 26, y + rh / 2 + 2.4, t, fitFont(t, 7, pg.width - 60, 0.5), { anchor: 'start', colour: INK }));
      pg.add(`<path d="${starPath(pg.right - 16, y + rh / 2, 9, 0.46)}" fill="#fff" stroke="${c}" stroke-width="1.1" stroke-linejoin="round"/>`);
    });
    pg.add(txt(pg.w / 2, pg.bottom - 10, lv < 10 ? `Next: Level ${lv + 1}, ${LEVELS_PATH[lv][0]} ${LEVELS_PATH[lv][1]}` : 'This is the very top level. Wow!', 6, { colour: c }));
    pages.push(pg.svg());
  }
  // Badges to colour, cut out and wear.
  pages.push(tagsPage(paper, `${title} badges`, 'Colour the badges, cut them out and stick one on your top. Give the spares to someone who helped you!', 6, 2, (pg, x, y, w, h) => {
    const cx = x + w / 2, cy = y + h / 2 - 4, r = Math.min(w, h) * 0.36;
    let d = '';
    for (let k = 0; k <= 24; k++) { const a = (k / 24) * Math.PI * 2, rr = k % 2 ? r * 1.08 : r; d += `${k ? 'L' : 'M'}${cx + Math.cos(a) * rr} ${cy + Math.sin(a) * rr} `; }
    pg.add(`<path d="${d}Z" fill="#fff" stroke="${c}" stroke-width="1"/><circle cx="${cx}" cy="${cy}" r="${r * 0.78}" fill="none" stroke="${c}" stroke-width="0.6" stroke-dasharray="1.5 1.2"/>`);
    pg.add(emoji(e, cx, cy - r * 0.18, r * 0.62) + txt(cx, cy + r * 0.52, title, fitFont(title, 5, r * 1.4, 0.5), { colour: c }));
    pg.add(`<path d="M${cx - r * 0.5} ${cy + r * 0.95} L${cx - r * 0.6} ${cy + r * 1.5} L${cx - r * 0.35} ${cy + r * 1.35} L${cx - r * 0.2} ${cy + r * 1.6} L${cx - r * 0.1} ${cy + r * 1.0} Z M${cx + r * 0.5} ${cy + r * 0.95} L${cx + r * 0.6} ${cy + r * 1.5} L${cx + r * 0.35} ${cy + r * 1.35} L${cx + r * 0.2} ${cy + r * 1.6} L${cx + r * 0.1} ${cy + r * 1.0} Z" fill="#fff" stroke="${c}" stroke-width="0.8"/>`);
  }));
  // The certificate, pointing to the next level.
  {
    const pg = new Page(paper, '', { bare: true, tint: '#fffaf0' });
    const cx = pg.w / 2;
    pg.add(`<rect x="${pg.left}" y="${pg.m}" width="${pg.width}" height="${pg.bottom - pg.m}" rx="10" fill="#fff" stroke="${c}" stroke-width="2"/><rect x="${pg.left + 5}" y="${pg.m + 5}" width="${pg.width - 10}" height="${pg.bottom - pg.m - 10}" rx="7" fill="none" stroke="#ffb938" stroke-width="0.6" stroke-dasharray="2.4 1.6"/>`);
    pg.add(txt(cx, pg.m + 22, `LEVEL ${lv} COMPLETE`, 6, { font: FONT, colour: SOFT }).replace('<text ', '<text letter-spacing="2" '));
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; pg.add(`<path d="${starPath(cx + Math.cos(a) * 44, pg.m + 70 + Math.sin(a) * 36, 3, 0.45)}" fill="${PALETTE[i % PALETTE.length]}"/>`); }
    pg.add(emoji(e, cx, pg.m + 70, 44));
    bubbleText(pg, title, cx, pg.m + 132, pg.width - 40, 24);
    pg.add(txt(cx, pg.m + 150, 'is proudly awarded to', 6, { font: FONT, colour: SOFT }));
    if (name) bubbleText(pg, name, cx, pg.m + 176, pg.width - 40, 24); else pg.add(`<line x1="${cx - 60}" x2="${cx + 60}" y1="${pg.m + 176}" y2="${pg.m + 176}" stroke="#b9b3d6" stroke-width="0.5"/>`);
    pg.add(txt(cx, pg.m + 194, 'for finishing all five challenges!', 7, { colour: INK }));
    if (lv < 10) pg.add(panel(pg.left + 24, pg.m + 204, pg.width - 48, 26, TINTS[lv % TINTS.length], LEVELS_PATH[lv][2], 8) + txt(cx, pg.m + 220, `Next adventure: Level ${lv + 1}, ${LEVELS_PATH[lv][0]} ${LEVELS_PATH[lv][1]}`, 6.4, { colour: LEVELS_PATH[lv][2] }));
    const ly = pg.bottom - 20;
    pg.add(txt(pg.left + 20, ly, 'Signed', 4.6, { anchor: 'start', font: FONT, colour: SOFT }) + `<line x1="${pg.left + 38}" x2="${cx - 8}" y1="${ly + 0.6}" y2="${ly + 0.6}" stroke="#b9b3d6" stroke-width="0.4"/>` + txt(cx + 8, ly, 'Date', 4.6, { anchor: 'start', font: FONT, colour: SOFT }) + `<line x1="${cx + 22}" x2="${pg.right - 20}" y1="${ly + 0.6}" y2="${ly + 0.6}" stroke="#b9b3d6" stroke-width="0.4"/>`);
    pg.footer = () => {};
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ Letters from Poppy, one for every month (Plus)
const POPPY_LETTERS = [
  ['A brand new year!', 'A new year is like a fresh, clean page. I wonder what you will learn, make and discover this year?', 'Draw three things you want to learn this year.', 'draw'],
  ['The month of kindness', 'Kindness is like glitter: once you share it, it gets everywhere! This month, let\'s fill the world with it.', 'Do five kind things and tick each one off.', 'list'],
  ['Spring is waking up', 'Can you feel it? The days are getting longer and tiny shoots are pushing out of the ground.', 'Plant a seed and draw it every week to see it grow.', 'grow'],
  ['Puddles and rainbows', 'April brings showers, and showers bring puddles! Pull on your boots, it is time to splash.', 'Go on a puddle walk. Draw the biggest puddle you found.', 'draw'],
  ['Tiny creatures', 'The garden is full of busy little friends: ladybirds, snails, worms and bees.', 'Find five minibeasts and tick them off.', 'list'],
  ['Sunshine days', 'The sun is shining and picnics are calling! Let\'s eat outside and look up at the clouds.', 'Have a picnic. Draw what you ate and the shapes in the clouds.', 'draw'],
  ['Summer adventures', 'Every summer day can be an adventure, even at home. Are you ready, explorer?', 'Make a treasure map of your home or garden.', 'draw'],
  ['Watching the moon', 'Did you know the moon looks a little different every night? Let\'s be moon scientists!', 'Look at the moon for a week and draw its shape each night.', 'week'],
  ['New beginnings', 'A new school year is here! New friends, new things to learn, and maybe new shoes too.', 'Draw your classroom and write your teacher\'s name.', 'draw'],
  ['Autumn treasures', 'The leaves are turning red, orange and gold. It is the best time for crunchy walks!', 'Collect five different leaves and draw them.', 'list'],
  ['The thank you month', 'Saying thank you makes two people happy: the one who hears it, and the one who says it.', 'Say thank you to five people and write their names.', 'list'],
  ['Winter wonder', 'The nights are long and cosy. It is time for twinkly lights, warm drinks and making things for people we love.', 'Make a paper snowflake and a card for someone special.', 'draw'],
];

function makePoppyLetters(o, paper) {
  const name = nameOf(o.name, '') || '';
  const m = o.month === 'all' ? null : (o.month === undefined || o.month === '' ? new Date().getMonth() : Math.max(0, Math.min(11, +o.month)));
  const months = m === null ? [...Array(12).keys()] : [m];
  const pages = [];
  months.forEach((mi) => {
    const [head, msg, task, kind] = POPPY_LETTERS[mi], c = PALETTE[mi % PALETTE.length];
    // The letter from Poppy.
    const pg = new Page(paper, '', { bare: true, tint: '#fffdf8' });
    pg.add(`<rect x="${pg.left - 3}" y="${pg.m - 3}" width="${pg.width + 6}" height="${pg.bottom - pg.m + 3}" rx="12" fill="#fff" stroke="${c}" stroke-width="1.4"/>`);
    pg.add(`<path d="M${pg.left - 3} ${pg.m + 30} H${pg.right + 3}" stroke="${c}" stroke-width="0.5" stroke-dasharray="2 1.6"/>`);
    pg.add(pic(POPPY, pg.left + 18, pg.m + 13, 20) + txt(pg.left + 32, pg.m + 12, 'A letter from Poppy', 8, { anchor: 'start', colour: c }) + txt(pg.left + 32, pg.m + 20, `${MONTHS[mi]} post`, 5, { anchor: 'start', font: FONT, colour: SOFT }));
    pg.add(emoji('💌', pg.right - 14, pg.m + 14, 14));
    pg.add(txt(pg.left + 10, pg.m + 48, name ? `Dear ${name},` : 'Dear friend,', 10, { anchor: 'start', colour: INK }));
    bubbleText(pg, head, pg.w / 2, pg.m + 68, pg.width - 30, 15);
    let y = textLines(pg, wrap(msg, 44), pg.left + 12, pg.m + 86, 7, { font: TITLE_FONT, weight: 700, lh: 1.5 });
    y += 6;
    pg.add(panel(pg.left + 8, y, pg.width - 16, 40, TINTS[mi % TINTS.length], c, 10) + txt(pg.left + 16, y + 11, 'Your challenge this month', 5.4, { anchor: 'start', font: FONT, colour: c }));
    textLines(pg, wrap(task, 42), pg.left + 16, y + 23, 7, { font: TITLE_FONT, weight: 800, lh: 1.35 });
    y += 50;
    textLines(pg, wrap('Turn the page to do your challenge, then write back and tell me all about it. I can\'t wait to hear from you!', 52), pg.left + 12, y + 6, 6, { weight: 700, lh: 1.5 });
    pg.add(txt(pg.right - 14, pg.bottom - 28, 'Love from', 7, { anchor: 'end', colour: c }) + txt(pg.right - 14, pg.bottom - 16, 'Poppy x', 11, { anchor: 'end', colour: c }) + pic(POPPY, pg.right - 70, pg.bottom - 22, 22));
    pg.footer = () => {};
    pages.push(pg.svg());
    // The challenge page.
    const ch = new Page(paper, `Poppy's ${MONTHS[mi]} challenge`, { subtitle: task });
    if (kind === 'list') {
      const rh = (ch.room - 40) / 5;
      for (let i = 0; i < 5; i++) { const yy = ch.y + i * rh; ch.add(panel(ch.left, yy + 2, ch.width, rh - 4, TINTS[i % TINTS.length], PALETTE[i % PALETTE.length], 8) + `<rect x="${ch.left + 8}" y="${yy + rh / 2 - 6}" width="12" height="12" rx="3" fill="#fff" stroke="${PALETTE[i % PALETTE.length]}" stroke-width="1"/>` + `<line x1="${ch.left + 28}" x2="${ch.right - 50}" y1="${yy + rh / 2 + 4}" y2="${yy + rh / 2 + 4}" stroke="#c9c3e3" stroke-width="0.5"/>` + `<rect x="${ch.right - 44}" y="${yy + 5}" width="38" height="${rh - 10}" rx="5" fill="#fff" stroke="#e2ddf2" stroke-width="0.5" stroke-dasharray="2 1.5"/>`); }
      ch.y += 5 * rh;
    } else if (kind === 'week' || kind === 'grow') {
      const n = kind === 'week' ? 7 : 6, cols = kind === 'week' ? 4 : 3, cw = ch.width / cols, rh = (ch.room - 40) / Math.ceil(n / cols);
      for (let i = 0; i < n; i++) { const x = ch.left + (i % cols) * cw, yy = ch.y + Math.floor(i / cols) * rh; ch.add(panel(x + 2, yy + 2, cw - 4, rh - 4, '#fff', PALETTE[i % PALETTE.length], 8) + txt(x + cw / 2, yy + 10, kind === 'week' ? `Night ${i + 1}` : `Week ${i + 1}`, 5.4, { colour: PALETTE[i % PALETTE.length] })); }
      ch.y += Math.ceil(n / cols) * rh;
    } else {
      const bh = ch.room - 40;
      ch.add(`<rect x="${ch.left}" y="${ch.y}" width="${ch.width}" height="${bh}" rx="12" fill="#fff" stroke="${c}" stroke-width="0.8" stroke-dasharray="3 2"/>`);
      ch.y += bh;
    }
    ch.add(panel(ch.left, ch.y + 6, ch.width, 28, '#fff6e0', '#ffb938', 8) + pic(POPPY, ch.left + 14, ch.y + 20, 16) + txt(ch.left + 26, ch.y + 23, 'Challenge complete! Colour the star:', 6.4, { anchor: 'start', colour: '#b07d00' }) + `<path d="${starPath(ch.right - 16, ch.y + 20, 9, 0.46)}" fill="#fff" stroke="#ffb938" stroke-width="1.1"/>`);
    pages.push(ch.svg());
    // Writing back.
    const rp = new Page(paper, '', { bare: true, tint: '#fffdf8' });
    rp.add(`<rect x="${rp.left - 3}" y="${rp.m - 3}" width="${rp.width + 6}" height="${rp.bottom - rp.m + 3}" rx="12" fill="#fff" stroke="${c}" stroke-width="1.4"/>` + pic(POPPY, rp.right - 18, rp.m + 16, 20));
    rp.add(txt(rp.left + 10, rp.m + 20, 'Dear Poppy,', 11, { anchor: 'start', colour: c }));
    const prompts = ['This month my challenge was', 'The best part was', 'Something new I learned', 'Next month I would love to'];
    let yy = rp.m + 34;
    prompts.forEach((p) => { rp.add(txt(rp.left + 10, yy + 8, p, 6, { anchor: 'start', colour: INK })); for (let l = 1; l <= 2; l++) rp.add(`<line x1="${rp.left + 10}" x2="${rp.right - 10}" y1="${yy + 8 + l * 12}" y2="${yy + 8 + l * 12}" stroke="#d9d4ec" stroke-width="0.45"/>`); yy += 40; });
    rp.add(`<rect x="${rp.left + 10}" y="${yy + 2}" width="${rp.width - 20}" height="${rp.bottom - yy - 30}" rx="8" fill="#fff" stroke="#e2ddf2" stroke-width="0.6" stroke-dasharray="3 2"/>` + txt(rp.left + 16, yy + 10, 'Draw Poppy a picture!', 5, { anchor: 'start', font: FONT, colour: SOFT }));
    rp.add(txt(rp.right - 12, rp.bottom - 12, name ? `Love from ${name}` : 'Love from', 8, { anchor: 'end', colour: c }));
    rp.footer = () => {};
    pages.push(rp.svg());
  });
  return pages;
}

// ================================================================ teacher: whole class seasonal set
function makeClassSeason(o, paper) {
  const names = listOf(o.names, 40).map((n) => nameOf(n, '')).filter(Boolean);
  const list = names.length ? names : ['Mia', 'Leo', 'Emma', 'Sam'];
  const occ = { christmas: ['Christmas', 'tree', ['snowman', 'presents'], ['🎄', '⭐', '🎁', '❄️'], '#e0453b', '#f2fbf5', 'Nice List Superstar', 'for being kind, helpful and wonderful this term!'],
    halloween: ['Halloween', 'pumpkin', ['ghost', 'bat'], ['🎃', '🦇', '🍬', '👻'], '#ff8a3d', '#fff6ec', 'Best Costume Award', 'for the most amazing Halloween costume!'],
    easter: ['Easter', 'eggs', ['chick', 'basket'], ['🐣', '🌷', '🥚', '🐰'], '#b06cff', '#f5edff', 'Egg Hunt Champion', 'for a wonderful spring of learning!'],
    diwali: ['Diwali', 'diya', ['lantern', 'diya'], ['🪔', '✨', '🌼', '🪔'], '#ff8a3d', '#fff6ec', 'Little Light Award', 'for spreading light and kindness in our class!'],
    spring: ['Spring', 'sunflower', ['butterfly', 'bee'], ['🌷', '🦋', '🐝', '🌼'], '#2e9d62', '#f1f8e6', 'Spring Superstar', 'for growing and learning so much this spring!'] }[o.occasion] || null;
  const [word, art, colours, corners, ring, tint, award, line] = occ || ['Christmas', 'tree', ['snowman', 'presents'], ['🎄', '⭐', '🎁', '❄️'], '#e0453b', '#f2fbf5', 'Nice List Superstar', 'for being kind, helpful and wonderful this term!'];
  const cls = String(o.cls || '').trim().slice(0, 24);
  const pages = [];
  list.forEach((n) => {
    pages.push(seasonCover(paper, `${possessive(n)} ${word} book`, cls ? `Made in ${cls}` : `A ${word.toLowerCase()} book of my own`, art, tint, ring, corners, 'book'));
    if (o.colouring !== false) colours.forEach((k) => pages.push(seasonColour(paper, k, n)));
    if (o.certificate !== false) pages.push(seasonCert(paper, award, n, line, art, ring));
  });
  return pages;
}

// ================================================================ teacher: end of year memory book for every child
function makeYearbook(o, paper) {
  const names = listOf(o.names, 40).map((n) => nameOf(n, '')).filter(Boolean);
  const list = names.length ? names : ['Mia', 'Leo', 'Emma', 'Sam'];
  const cls = String(o.cls || '').trim().slice(0, 24) || 'my class';
  const teacher = String(o.teacher || '').trim().slice(0, 30);
  const msg = String(o.message || '').trim().slice(0, 300);
  const year = String(o.year || '').trim().slice(0, 12) || String(new Date().getFullYear());
  const lk = lookOf('namebook', o.look);
  const pages = [];
  list.forEach((n) => {
    pages.push(seasonCover(paper, `${possessive(n)} year in ${cls}`, `My memory book, ${year}`, lk.art, lk.tint, lk.ring, lk.corners, 'book'));
    // My teacher
    {
      const pg = new Page(paper, 'My teacher', { subtitle: 'Draw your teacher, then read the message they wrote just for you.', noName: true });
      const fh = pg.room * 0.48;
      pg.add(`<rect x="${pg.left + 20}" y="${pg.y}" width="${pg.width - 40}" height="${fh}" rx="12" fill="#fff" stroke="${lk.ring}" stroke-width="1"/>` + txt(pg.w / 2, pg.y + fh - 6, teacher ? teacher : 'My teacher is ____________', 7, { colour: lk.ring }));
      pg.y += fh + 8;
      pg.add(panel(pg.left, pg.y, pg.width, pg.room - 4, lk.tint, lk.ring, 10) + txt(pg.left + 8, pg.y + 11, 'A message for you', 6, { anchor: 'start', colour: lk.ring }));
      if (msg) textLines(pg, [`Dear ${n},`, ...wrap(msg, 56)], pg.left + 10, pg.y + 24, 6, { weight: 700, lh: 1.5 });
      else for (let l = 1; l <= 6; l++) pg.add(`<line x1="${pg.left + 8}" x2="${pg.right - 8}" y1="${pg.y + 14 + l * 12}" y2="${pg.y + 14 + l * 12}" stroke="#d9d4ec" stroke-width="0.45"/>`);
      pages.push(pg.svg());
    }
    // My friends: signatures and kind words
    pages.push(tagsPage(paper, 'My friends', 'Ask your friends to sign their name and write or draw something kind for you.', 8, 2, (pg, x, y, w, h, i) => {
      pg.add(emoji(['⭐', '❤️', '🌈', '😊', '🎈', '🌻', '🚀', '🦋'][i], x + w - 10, y + 10, 9) + txt(x + 6, y + 11, 'Name', 4.6, { anchor: 'start', font: FONT, colour: SOFT }) + `<line x1="${x + 20}" x2="${x + w - 20}" y1="${y + 11.6}" y2="${y + 11.6}" stroke="#c9c3e3" stroke-width="0.45"/>`);
    }));
    // What I learned
    {
      const pg = new Page(paper, `My year in ${cls}`, { subtitle: 'Remember the best bits of this year.', noName: true });
      const bh = pg.room / 4, items = [['This year I learned', '#3fbfa8'], ['My favourite day was', '#ffb938'], ['I am proud that', '#e0457b'], ['Next year I am excited about', '#6c8cff']];
      items.forEach(([t, c], i) => { pg.add(panel(pg.left, pg.y + i * bh + 1.5, pg.width, bh - 4, '#fff', c, 10) + txt(pg.left + 8, pg.y + i * bh + 11, t, 6.4, { anchor: 'start', colour: c })); for (let l = 1; l <= 3; l++) pg.add(`<line x1="${pg.left + 8}" x2="${pg.right - 8}" y1="${pg.y + i * bh + 12 + l * (bh - 18) / 3.3}" y2="${pg.y + i * bh + 12 + l * (bh - 18) / 3.3}" stroke="#d9d4ec" stroke-width="0.45"/>`); });
      pages.push(pg.svg());
    }
    // Me then and now
    {
      const pg = new Page(paper, 'Me at the start, me now', { subtitle: 'Draw yourself at the start of the year and now. How have you changed?', noName: true });
      const cw = pg.width / 2, fh = pg.room - 30;
      ['At the start of the year', 'At the end of the year'].forEach((t, i) => pg.add(`<rect x="${pg.left + i * cw + 3}" y="${pg.y}" width="${cw - 6}" height="${fh}" rx="12" fill="#fff" stroke="${i ? lk.ring : '#b9b3d6'}" stroke-width="1"/>` + txt(pg.left + i * cw + cw / 2, pg.y + fh + 12, t, 6, { colour: i ? lk.ring : SOFT })));
      pages.push(pg.svg());
    }
    pages.push(seasonCert(paper, `Well done, ${cls}!`, n, 'for a brilliant year of learning, growing and being you!', lk.art, lk.ring));
  });
  return pages;
}

// ================================================================ teacher: classroom displays
function makeDisplays(o, paper) {
  const raw = listOf(o.names, 40);
  const people = raw.map((l) => { const m = /^(.+?)\s+(\d{1,2})\s*([A-Za-z]+)?/.exec(l.trim()); if (!m) return { n: nameOf(l, ''), d: 0, mi: -1 }; const mi = m[3] ? MONTHS.findIndex((x) => x.toLowerCase().startsWith(m[3].toLowerCase().slice(0, 3))) : -1; return { n: nameOf(m[1], ''), d: +m[2], mi }; }).filter((p) => p.n);
  const list = people.length ? people : [{ n: 'Mia', d: 12, mi: 2 }, { n: 'Leo', d: 4, mi: 6 }, { n: 'Emma', d: 21, mi: 10 }, { n: 'Sam', d: 9, mi: 0 }];
  const cls = String(o.cls || '').trim().slice(0, 24);
  const pages = [];
  if (o.birthdays !== false) {
    const pg = new Page(paper, cls ? `${cls} birthdays` : 'Our birthdays', { subtitle: 'Add names and dates like "Mia 12 March". Anyone without a date gets a blank line to fill in.', noName: true });
    const cols = 3, cw = pg.width / cols, ch = pg.room / 4;
    MONTHS.forEach((mn, i) => {
      const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch, c = PALETTE[i % PALETTE.length];
      pg.add(panel(x + 1.5, y + 1.5, cw - 3, ch - 3, TINTS[i % TINTS.length], c, 8) + emoji(['❄️', '💝', '🌷', '🐣', '🌼', '☀️', '🏖️', '🍦', '🍎', '🍂', '🎆', '🎄'][i], x + cw - 10, y + 10, 8) + txt(x + 7, y + 12, mn, 6.4, { anchor: 'start', colour: c }));
      list.filter((p) => p.mi === i).sort((a, b) => a.d - b.d).slice(0, 6).forEach((p, k) => pg.add(`<circle cx="${x + 9}" cy="${y + 20 + k * 7.2}" r="1.4" fill="${c}"/>` + txt(x + 13, y + 21.4 + k * 7.2, `${p.n}, ${ordinal(p.d)}`, 4.6, { anchor: 'start', font: FONT })));
    });
    pages.push(pg.svg());
  }
  if (o.jobcards !== false) {
    const jobs = listOf(typeof o.jobs === 'string' ? o.jobs : '', 12).length ? listOf(o.jobs, 12) : ['Line leader', 'Door holder', 'Plant waterer', 'Book helper', 'Tidy captain', 'Pencil monitor', 'Lunch helper', 'Kindness keeper'];
    const icons = ['🚶', '🚪', '🪴', '📚', '🧹', '✏️', '🍎', '💛', '🌟', '🎨', '📋', '🔔'];
    pages.push(tagsPage(paper, cls ? `${cls} class jobs` : 'Our class jobs', 'Cut out the cards. Each week, clip a name peg or sticky note onto each job.', Math.min(12, jobs.length) + (jobs.length % 2), 2, (pg, x, y, w, h, i) => {
      if (i >= jobs.length) return;
      pg.add(`<rect x="${x + 3}" y="${y + 3}" width="${w - 6}" height="${h - 6}" rx="5" fill="${TINTS[i % TINTS.length]}"/>` + emoji(icons[i % icons.length], x + 18, y + h / 2, Math.min(18, h * 0.45)) + txt(x + 32, y + h / 2 + 2.6, jobs[i].slice(0, 22), fitFont(jobs[i].slice(0, 22), 8, w - 40, 0.52), { anchor: 'start', colour: PALETTE[i % PALETTE.length] }));
      pg.add(`<rect x="${x + w - 42}" y="${y + h - 14}" width="34" height="8" rx="4" fill="#fff" stroke="#c9c3e3" stroke-width="0.5"/>`);
    }));
  }
  if (o.welcome !== false) {
    // A welcome flag for every child, two per row.
    for (let s = 0; s < list.length; s += 6) {
      const pg = new Page(paper, s ? 'Welcome bunting (more)' : 'Welcome bunting', { subtitle: 'Every child colours their own flag. String them all together across the classroom!', noName: true });
      const cw = pg.width / 2, ch = pg.room / 3;
      list.slice(s, s + 6).forEach((p, i) => {
        const x = pg.left + (i % 2) * cw + 6, y = pg.y + Math.floor(i / 2) * ch + 4, w = cw - 12, h = ch - 10, c = PALETTE[(s + i) % PALETTE.length];
        pg.add(`<rect x="${x}" y="${y}" width="${w}" height="10" fill="#f4f1fb" stroke="#1f1b2e" stroke-width="0.5" stroke-dasharray="2 1.4"/><path d="M${x} ${y + 10} L${x + w} ${y + 10} L${x + w / 2} ${y + h} Z" fill="#fff" stroke="#1f1b2e" stroke-width="0.9" stroke-linejoin="round"/>`);
        pg.add(`<path d="${starPath(x + w / 2, y + 18, 4, 0.45)}" fill="#fff" stroke="${c}" stroke-width="0.8"/>`);
        bubbleText(pg, p.n, x + w / 2, y + 10 + (h - 10) * 0.5, w * 0.56, 13);
      });
      pages.push(pg.svg());
    }
  }
  if (!pages.length) pages.push(new Page(paper, 'Classroom displays', { subtitle: 'Tick at least one display.', noName: true }).svg());
  return pages;
}

Object.assign(MAKERS, { levels: makeLearnerLevels, poppy: makePoppyLetters, classseason: makeClassSeason, yearbook: makeYearbook, displays: makeDisplays });
