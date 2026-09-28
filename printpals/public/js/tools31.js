// PrintPals batch 31 (Teacher toolkit): Class Welcome Kit, Class Awards Pack, Homework Month, Cover Teacher Kit.

const classNames = (o, fallback) => { const n = listOf(o.names, 40).map((x) => nameOf(x, '')).filter(Boolean); return n.length ? n : (fallback === false ? [] : ['Mia', 'Leo', 'Emma', 'Sam', 'Chris', 'Ava']); };
const T_EMOJI = ['🦊', '🐼', '🦁', '🐸', '🐙', '🦄', '🐝', '🐢', '🦋', '🐳', '🦉', '🐯', '🐰', '🐬', '🦒', '🐞', '🐧', '🐨', '🦜', '🐠'];

// ================================================================ Class Welcome Kit (teachers)
const CLASS_JOBS = [['📚', 'Book monitor'], ['🌱', 'Plant waterer'], ['💡', 'Lights helper'], ['🚪', 'Door holder'], ['📝', 'Paper helper'], ['🧹', 'Tidy captain'], ['📅', 'Date and weather'], ['🍎', 'Snack helper'], ['🚶', 'Line leader'], ['⭐', 'Star helper'], ['🔔', 'Messenger'], ['🖍️', 'Pencil pot checker']];

function makeClassWelcome(o, paper) {
  const kids = classNames(o), lk = edLook(o.look);
  const cls = String(o.cls || '').trim().slice(0, 24) || 'Our class', teacher = String(o.teacher || '').trim().slice(0, 30);
  const pages = [seriesCover(paper, 'PRINTPALS PLUS FOR TEACHERS', `Welcome to ${cls}!`, teacher ? `With ${teacher}` : 'A brand new year together', ['🏫', '🎒', '✏️', lk.corner, '🌟', '🍎'], lk.ring, lk.tint, 'welcome kit', ['Desk name tags', 'Peg and drawer labels', 'Birthday chart', 'Class jobs chart', 'All about me pages', `${kids.length} children, all named`])];
  // Desk name tags: 4 per page, with a little alphabet and number line helper.
  for (let s = 0; s < kids.length; s += 4) pages.push(tagsPage(paper, s ? 'Desk name tags (more)' : 'Desk name tags', 'Cut out and stick one on each table. The alphabet and numbers help with writing and counting!', 4, 1, (pg, x, y, w, h, i) => {
    const n = kids[s + i]; if (!n) return;
    const c = PALETTE[(s + i) % PALETTE.length], e = T_EMOJI[(s + i) % T_EMOJI.length];
    pg.add(`<rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="10" fill="${TINTS[(s + i) % TINTS.length]}" stroke="${c}" stroke-width="1.2"/>` + emoji(e, x + 20, y + h * 0.4, h * 0.36));
    bubbleText(pg, n, x + w * 0.52, y + h * 0.48, w * 0.6, Math.min(26, h * 0.4));
    const abc = 'abcdefghijklmnopqrstuvwxyz', lw = (w - 24) / 26;
    [...abc].forEach((ch, k) => pg.add(txt(x + 12 + k * lw + lw / 2, y + h - 18, ch, 4.6, { font: FONT, colour: INK })));
    for (let k = 0; k <= 20; k++) pg.add(txt(x + 12 + k * (w - 24) / 20, y + h - 10, `${k}`, 3.8, { font: FONT, colour: SOFT }));
  }));
  // Peg and drawer labels: 12 per page.
  for (let s = 0; s < kids.length; s += 12) pages.push(tagsPage(paper, s ? 'Peg and drawer labels (more)' : 'Peg and drawer labels', 'One for each child\'s peg, drawer or book box. Each child has their own animal!', 12, 3, (pg, x, y, w, h, i) => {
    const n = kids[s + i]; if (!n) return;
    const c = PALETTE[(s + i) % PALETTE.length];
    pg.add(`<rect x="${x + 3}" y="${y + 3}" width="${w - 6}" height="${h - 6}" rx="8" fill="#fff" stroke="${c}" stroke-width="1"/>` + emoji(T_EMOJI[(s + i) % T_EMOJI.length], x + w / 2, y + h * 0.36, h * 0.34) + txt(x + w / 2, y + h * 0.8, n, fitFont(n, 10, w - 12, 0.58), { colour: c }));
  }));
  // Birthday chart.
  {
    const pg = new Page(paper, `${cls} birthdays`, { subtitle: 'Write each child\'s name and birthday in their month. Celebrate every single one!', noName: true });
    const cw = pg.width / 3, ch = pg.room / 4;
    MONTHS.forEach((m, k) => { const x = pg.left + (k % 3) * cw, y = pg.y + Math.floor(k / 3) * ch, c = PALETTE[k % PALETTE.length]; pg.add(panel(x + 2, y + 2, cw - 4, ch - 4, TINTS[k % TINTS.length], c, 10) + emoji(['❄️', '💗', '🌷', '🐣', '🌼', '☀️', '🍦', '🏖️', '🍎', '🎃', '🍂', '🎄'][k], x + 12, y + 12, 9) + txt(x + 22, y + 14, m, 7, { anchor: 'start', colour: c })); for (let l = 0; l < 4; l++) pg.add(`<line x1="${x + 8}" x2="${x + cw - 8}" y1="${y + 24 + l * (ch - 30) / 4}" y2="${y + 24 + l * (ch - 30) / 4}" stroke="#d9d4ec" stroke-width="0.45"/>`); });
    pages.push(pg.svg());
  }
  // Class jobs chart + name cards to move each week.
  {
    const pg = new Page(paper, `${cls} class jobs`, { subtitle: 'Pin this up and move the name cards each week. Everyone gets a turn!', noName: true });
    const cw = pg.width / 3, ch = pg.room / 4;
    CLASS_JOBS.forEach(([e, t], k) => { const x = pg.left + (k % 3) * cw, y = pg.y + Math.floor(k / 3) * ch, c = PALETTE[k % PALETTE.length]; pg.add(panel(x + 2, y + 2, cw - 4, ch - 4, '#fff', c, 10) + emoji(e, x + cw / 2, y + ch * 0.3, ch * 0.28) + txt(x + cw / 2, y + ch * 0.58, t, fitFont(t, 7, cw - 10, 0.55), { colour: c }) + `<rect x="${x + 10}" y="${y + ch * 0.66}" width="${cw - 20}" height="${ch * 0.24}" rx="5" fill="${TINTS[k % TINTS.length]}" stroke="${c}" stroke-width="0.5" stroke-dasharray="2 1.5"/>`); });
    pages.push(pg.svg());
  }
  for (let s = 0; s < kids.length; s += 24) pages.push(tagsPage(paper, 'Name cards for the jobs chart', 'Cut these out and slip them into the job pockets.', 24, 4, (pg, x, y, w, h, i) => { const n = kids[s + i]; if (!n) return; pg.add(`<rect x="${x + 3}" y="${y + 3}" width="${w - 6}" height="${h - 6}" rx="6" fill="${TINTS[(s + i) % TINTS.length]}" stroke="${PALETTE[(s + i) % PALETTE.length]}" stroke-width="0.8"/>` + emoji(T_EMOJI[(s + i) % T_EMOJI.length], x + 12, y + h / 2, h * 0.4) + txt(x + w / 2 + 8, y + h / 2 + 3, n, fitFont(n, 9, w - 30, 0.58), { colour: INK })); }));
  // All about me, one per child.
  kids.forEach((n, i) => {
    const pg = new Page(paper, `All about ${n}`, { subtitle: 'Draw yourself and fill in the boxes. We can\'t wait to get to know you!', noName: true });
    const c = PALETTE[i % PALETTE.length], ph = pg.room * 0.42;
    pg.add(`<rect x="${pg.left + pg.width * 0.2}" y="${pg.y}" width="${pg.width * 0.6}" height="${ph}" rx="14" fill="${TINTS[i % TINTS.length]}" stroke="${c}" stroke-width="1.6"/><rect x="${pg.left + pg.width * 0.2 + 6}" y="${pg.y + 6}" width="${pg.width * 0.6 - 12}" height="${ph - 12}" rx="10" fill="#fff" stroke="${c}" stroke-width="0.5" stroke-dasharray="3 2"/>` + emoji(T_EMOJI[i % T_EMOJI.length], pg.left + pg.width * 0.12, pg.y + 16, 14));
    pg.y += ph + 8;
    const qs = [['🎂', 'I am ___ years old'], ['🎨', 'My favourite colour'], ['🍕', 'My favourite food'], ['🐾', 'My favourite animal'], ['🏠', 'I live with'], ['🌟', 'This year I want to learn']], bh = pg.room / 3, bw = pg.width / 2;
    qs.forEach(([e, t], k) => { const x = pg.left + (k % 2) * bw, y = pg.y + Math.floor(k / 2) * bh; pg.add(panel(x + 2, y + 2, bw - 4, bh - 4, '#fff', PALETTE[k % PALETTE.length], 9) + emoji(e, x + 11, y + 11, 8) + txt(x + 20, y + 13, t, 6, { anchor: 'start', colour: PALETTE[k % PALETTE.length] }) + `<line x1="${x + 8}" x2="${x + bw - 8}" y1="${y + bh - 9}" y2="${y + bh - 9}" stroke="#d9d4ec" stroke-width="0.5"/>`); });
    pages.push(pg.svg());
  });
  return pages;
}

// ================================================================ Class Awards Pack (teachers)
const CLASS_AWARDS = [
  ['💛', 'Kindest Friend', 'for always being kind and caring to everyone'], ['📚', 'Super Reader', 'for loving books and reading so beautifully'], ['🔢', 'Maths Wizard', 'for brilliant number thinking'], ['✏️', 'Wonderful Writer', 'for amazing stories and careful writing'],
  ['🎨', 'Amazing Artist', 'for creative, colourful and brave artwork'], ['🧪', 'Super Scientist', 'for asking great questions and exploring'], ['😂', 'Sunshine Smile', 'for making our class brighter every day'], ['🤝', 'Team Player', 'for helping others and working together'],
  ['🎵', 'Music Star', 'for singing and making music with joy'], ['⚽', 'Sports Star', 'for energy, effort and great sportsmanship'], ['🧩', 'Puzzle Solver', 'for never giving up on tricky problems'], ['🌱', 'Growing Mindset', 'for trying again and getting better every day'],
  ['🗣️', 'Brilliant Speaker', 'for sharing ideas clearly and confidently'], ['👂', 'Super Listener', 'for listening carefully to everyone'], ['🧹', 'Tidy Champion', 'for keeping our classroom beautiful'], ['🦁', 'Brave Heart', 'for being brave and trying new things'],
  ['💡', 'Bright Ideas', 'for amazing ideas and imagination'], ['🌍', 'Planet Protector', 'for caring about our world'], ['🙋', 'Question Champion', 'for curious questions that help us all learn'], ['🏗️', 'Brilliant Builder', 'for fantastic building and making'],
  ['🌈', 'Rainbow Heart', 'for including everyone'], ['⏰', 'Always Ready', 'for being ready to learn every day'], ['🎭', 'Drama Star', 'for bringing stories to life'], ['🐢', 'Steady and Strong', 'for patient, careful, steady work'],
  ['🔍', 'Super Detective', 'for noticing tiny details'], ['📏', 'Neat and Careful', 'for beautifully presented work'], ['🤗', 'Great Helper', 'for always offering a helping hand'], ['⭐', 'Shining Star', 'for shining brightly in everything'],
  ['🚀', 'Rocket Learner', 'for zooming ahead in learning'], ['🦉', 'Wise Owl', 'for thoughtful and wise ideas'], ['😊', 'Positive Power', 'for a happy, positive attitude'], ['🎤', 'Confident Performer', 'for sharing with the class'],
  ['🌻', 'Kind Words', 'for always choosing kind words'], ['🧠', 'Deep Thinker', 'for thinking hard about big ideas'], ['📖', 'Story Teller', 'for wonderful stories and imagination'], ['💪', 'Never Give Up', 'for amazing effort and determination'],
  ['🎯', 'Goal Getter', 'for working hard to reach goals'], ['🕊️', 'Peacemaker', 'for helping friends solve problems'], ['🌟', 'Most Improved', 'for growing so much this year'], ['🏆', 'Class Champion', 'for being a wonderful member of our class'],
];

function awardPage(paper, a, n, cls, teacher, colour, tint) {
  const [e, title, line] = a;
  const pg = new Page(paper, '', { bare: true, tint: '#fffaf0' });
  const cx = pg.w / 2;
  pg.add(`<rect x="${pg.left}" y="${pg.m}" width="${pg.width}" height="${pg.bottom - pg.m}" rx="12" fill="#fff" stroke="${colour}" stroke-width="2.4"/><rect x="${pg.left + 6}" y="${pg.m + 6}" width="${pg.width - 12}" height="${pg.bottom - pg.m - 12}" rx="8" fill="none" stroke="#ffb938" stroke-width="0.6" stroke-dasharray="2.4 1.6"/>`);
  for (let k = 0; k < 14; k++) { const a2 = (k / 14) * Math.PI * 2; pg.add(`<path d="${starPath(cx + Math.cos(a2) * 56, pg.m + 96 + Math.sin(a2) * 34, 3.2, 0.45)}" fill="${PALETTE[k % PALETTE.length]}"/>`); }
  pg.add(txt(cx, pg.m + 24, (cls || 'CLASS AWARD').toUpperCase(), 6, { font: FONT, colour: SOFT }).replace('<text ', '<text letter-spacing="2" '));
  bubbleText(pg, title, cx, pg.m + 50, pg.width - 40, 24);
  pg.add(`<circle cx="${cx}" cy="${pg.m + 96}" r="26" fill="${tint}" stroke="${colour}" stroke-width="1.4"/>` + emoji(e, cx, pg.m + 96, 30));
  pg.add(txt(cx, pg.m + 142, 'is proudly awarded to', 6, { font: FONT, colour: SOFT }));
  if (n) bubbleText(pg, n, cx, pg.m + 168, pg.width - 40, 28); else pg.add(`<line x1="${cx - 60}" x2="${cx + 60}" y1="${pg.m + 168}" y2="${pg.m + 168}" stroke="#b9b3d6" stroke-width="0.5"/>`);
  wrap(line, 40).forEach((l, i) => pg.add(txt(cx, pg.m + 188 + i * 9, l, 7.2, { colour: INK })));
  const ly = pg.bottom - 22;
  pg.add(txt(pg.left + 22, ly, teacher ? `From ${teacher}` : 'Signed', 5.2, { anchor: 'start', font: FONT, colour: SOFT }) + `<line x1="${pg.left + 22}" x2="${cx - 8}" y1="${ly + 6}" y2="${ly + 6}" stroke="#b9b3d6" stroke-width="0.4"/>` + txt(cx + 8, ly, 'Date', 5.2, { anchor: 'start', font: FONT, colour: SOFT }) + `<line x1="${cx + 8}" x2="${pg.right - 22}" y1="${ly + 6}" y2="${ly + 6}" stroke="#b9b3d6" stroke-width="0.4"/>`);
  pg.footer = () => {};
  return pg.svg();
}

function makeClassAwards(o, paper) {
  const rand = rng(+o.seed || 1);
  const kids = classNames(o), lk = edLook(o.look);
  const cls = String(o.cls || '').trim().slice(0, 24), teacher = String(o.teacher || '').trim().slice(0, 30);
  const awards = shuffle(CLASS_AWARDS, rand);
  const pages = [seriesCover(paper, 'PRINTPALS PLUS FOR TEACHERS', cls ? `${cls} Awards` : 'Class Awards', 'A different award for every child', awards.slice(0, 6).map((a) => a[0]), lk.ring, lk.tint, 'award set', ['40 different awards', 'Every child named', 'Never the same twice', 'Ceremony plan list', 'Star of the Week', 'Shuffle until perfect'])];
  // Overview for the teacher: who gets which award.
  {
    const pg = new Page(paper, `${cls || 'Class'} awards list`, { subtitle: 'Every child has their own award. Press Make a new set to shuffle them, or keep this list to plan the ceremony!', noName: true });
    const cols = 2, rh = Math.min(12, pg.room / Math.ceil(kids.length / cols)), cw = pg.width / cols;
    kids.forEach((n, i) => { const x = pg.left + Math.floor(i / Math.ceil(kids.length / cols)) * cw, y = pg.y + (i % Math.ceil(kids.length / cols)) * rh, a = awards[i % awards.length]; pg.add(emoji(a[0], x + 6, y + rh / 2, rh * 0.6) + txt(x + 14, y + rh * 0.66, n, fitFont(n, 6, 40, 0.56), { anchor: 'start', colour: INK }) + txt(x + 58, y + rh * 0.66, a[1], fitFont(a[1], 5.6, cw - 62, 0.52), { anchor: 'start', colour: PALETTE[i % PALETTE.length] })); });
    pages.push(pg.svg());
  }
  kids.forEach((n, i) => pages.push(awardPage(paper, awards[i % awards.length], n, cls, teacher, PALETTE[i % PALETTE.length], TINTS[i % TINTS.length])));
  // Star of the week: blank name, one for each week of term.
  pages.push(awardPage(paper, ['🌟', 'Star of the Week', 'for being a superstar in our class this week'], '', cls, teacher, lk.ring, lk.tint));
  return pages;
}

// ================================================================ Homework Month (teachers)
const HW_WORDS = { y1: [['cat', 'dog', 'sun', 'hat', 'pig'], ['ship', 'shop', 'fish', 'wish', 'shed'], ['chip', 'much', 'chin', 'rich', 'chop'], ['moon', 'food', 'book', 'look', 'soon']], y2: [['rain', 'train', 'paint', 'snail', 'wait'], ['play', 'day', 'stay', 'tray', 'away'], ['night', 'light', 'right', 'bright', 'might'], ['coat', 'boat', 'road', 'soap', 'toast']], y3: [['happy', 'funny', 'sunny', 'puppy', 'silly'], ['jumped', 'played', 'helped', 'looked', 'called'], ['careful', 'helpful', 'playful', 'thankful', 'hopeful'], ['kindness', 'sadness', 'darkness', 'goodness', 'fitness']] };
const HW_FUN = ['Help cook a meal and count the ingredients', 'Find 5 shapes in your home and draw them', 'Tell a grown-up a story, then draw the best part', 'Go on a walk and collect 3 different leaves', 'Measure 3 things with your hand spans', 'Build a tower and count the blocks', 'Teach someone at home something you learned', 'Draw a map of your bedroom'];

function makeHomeworkMonth(o, paper) {
  const rand = rng(+o.seed || 1);
  const lk = edLook(o.look), level = HW_WORDS[o.level] ? o.level : 'y1';
  const kids = classNames(o, false), cls = String(o.cls || '').trim().slice(0, 24), teacher = String(o.teacher || '').trim().slice(0, 30);
  const mlev = level === 'y1' ? 'counting' : level === 'y2' ? 'adding' : 'bigger';
  const pages = [seriesCover(paper, 'PRINTPALS PLUS FOR TEACHERS', cls ? `${cls}: Homework Month` : 'Homework Month', `${{ y1: 'Year 1 / Grade 1', y2: 'Year 2 / Grade 2', y3: 'Year 3 / Grade 3' }[level]}: 4 weekly sheets`, ['📝', '🔢', '📚', lk.corner, '🏠', '⭐'], lk.ring, lk.tint, 'homework set', ['4 weekly sheets', 'Maths, spelling, reading', 'A fun family task', 'Parent comment box', 'Class tracker', 'Answers for teachers'])];
  const answers = [];
  for (let w = 1; w <= 4; w++) {
    const pg = new Page(paper, `Homework: week ${w}`, { subtitle: `Please return by: ____________   ${teacher ? 'From ' + teacher + '.' : ''} About 20 minutes across the week.` });
    const words = HW_WORDS[level][w - 1];
    const h1 = 58;
    // Maths.
    pg.add(panel(pg.left, pg.y, pg.width / 2 - 3, h1, '#fff', PALETTE[0], 9) + emoji('🔢', pg.left + 9, pg.y + 9, 8) + txt(pg.left + 18, pg.y + 11, 'Maths', 6.4, { anchor: 'start', colour: PALETTE[0] }));
    const a = [];
    for (let k = 0; k < 6; k++) { const [q, ans] = mathsDayProblem(mlev === 'counting' ? 'adding' : mlev, 3, rand), cw2 = (pg.width / 2 - 14) / 2, x = pg.left + 7 + (k % 2) * cw2, y = pg.y + 25 + Math.floor(k / 2) * 11; pg.add(txt(x, y, q, 6.4, { anchor: 'start', colour: INK }) + `<rect x="${x + cw2 - 17}" y="${y - 6.6}" width="14" height="8.6" rx="2" fill="#fff" stroke="${PALETTE[0]}" stroke-width="0.6"/>`); a.push(ans); }
    answers.push(a);
    // Spelling.
    const sx = pg.left + pg.width / 2 + 3, sw = pg.width / 2 - 3;
    pg.add(panel(sx, pg.y, sw, h1, '#fff', PALETTE[1], 9) + emoji('🔠', sx + 9, pg.y + 9, 8) + txt(sx + 18, pg.y + 11, 'Spellings to practise', 6.4, { anchor: 'start', colour: PALETTE[1] }));
    words.forEach((wd, k) => pg.add(txt(sx + 8, pg.y + 22 + k * 7, wd, 6.4, { anchor: 'start', colour: INK }) + `<line x1="${sx + 36}" x2="${sx + sw - 8}" y1="${pg.y + 22.6 + k * 7}" y2="${pg.y + 22.6 + k * 7}" stroke="#d9d4ec" stroke-width="0.45"/>`));
    pg.y += h1 + 6;
    // Reading log.
    const rh2 = 34;
    pg.add(panel(pg.left, pg.y, pg.width, rh2, '#fff', PALETTE[2], 9) + emoji('📚', pg.left + 9, pg.y + 9, 8) + txt(pg.left + 18, pg.y + 11, 'Reading: read together and colour a book each day', 6.4, { anchor: 'start', colour: PALETTE[2] }));
    WEEKDAYS.forEach((d, k) => { const x = pg.left + 8 + k * (pg.width - 16) / 7; pg.add(txt(x + 10, pg.y + 20, d.slice(0, 3), 5.2, { colour: INK }) + emoji('📖', x + 10, pg.y + 27, 7)); });
    pg.y += rh2 + 6;
    // Fun task.
    const fun = HW_FUN[(w - 1 + (+o.seed || 1)) % HW_FUN.length], fh = pg.room - 70;
    pg.add(panel(pg.left, pg.y, pg.width, fh, '#fff', PALETTE[3], 9) + emoji('🏠', pg.left + 9, pg.y + 9, 8) + txt(pg.left + 18, pg.y + 11, `Family task: ${fun}`, fitFont(`Family task: ${fun}`, 6.4, pg.width - 26, 0.5), { anchor: 'start', colour: PALETTE[3] }) + `<rect x="${pg.left + 8}" y="${pg.y + 16}" width="${pg.width - 16}" height="${fh - 22}" rx="6" fill="${TINTS[3]}" stroke="${PALETTE[3]}" stroke-width="0.4" stroke-dasharray="3 2"/>`);
    pg.y += fh + 6;
    // Parent box.
    pg.add(panel(pg.left, pg.y, pg.width, 58, lk.tint, lk.ring, 10) + txt(pg.left + 8, pg.y + 10, 'Grown-up comment', 6.4, { anchor: 'start', colour: lk.ring }) + txt(pg.left + 8, pg.y + 17, 'How did it go? Anything the teacher should know?', 5, { anchor: 'start', font: FONT, colour: SOFT }));
    for (let l = 0; l < 3; l++) pg.add(`<line x1="${pg.left + 8}" x2="${pg.right - 8}" y1="${pg.y + 27 + l * 9}" y2="${pg.y + 27 + l * 9}" stroke="#c9c3e3" stroke-width="0.45"/>`);
    pg.add(txt(pg.left + 8, pg.y + 54, 'Signed:', 5.6, { anchor: 'start', font: FONT, colour: SOFT }) + `<line x1="${pg.left + 30}" x2="${pg.left + pg.width / 2}" y1="${pg.y + 54.6}" y2="${pg.y + 54.6}" stroke="#b9b3d6" stroke-width="0.5"/>` + ['😊', '🙂', '😐'].map((f, k) => `<circle cx="${pg.right - 40 + k * 14}" cy="${pg.y + 52}" r="5" fill="#fff" stroke="${lk.ring}" stroke-width="0.5"/>` + emoji(f, pg.right - 40 + k * 14, pg.y + 52, 7)).join(''));
    pages.push(pg.svg());
  }
  // Note to families.
  {
    const pg = new Page(paper, 'A note for families', { subtitle: 'Send this home with the first homework sheet.', noName: true });
    const lines = ['Dear families,', '', 'Each week your child will bring home a homework sheet with a little maths, spellings to practise, a reading log and a fun family task.', '', 'It should take about 20 minutes across the whole week. Little and often is best!', '', 'Please read with your child every day, even for five minutes, and colour a book on the reading log.', '', 'Use the grown-up comment box to tell us how it went. We love hearing from you.', '', 'Thank you for all your support.', '', teacher ? `With warm wishes, ${teacher}` : 'With warm wishes, your child\'s teacher'];
    pg.add(panel(pg.left, pg.y, pg.width, pg.room - 4, lk.tint, lk.ring, 12));
    let y = pg.y + 16;
    lines.forEach((l) => { if (!l) { y += 5; return; } wrap(l, 50).forEach((ll) => { pg.add(txt(pg.left + 12, y, ll, 7, { anchor: 'start', colour: INK })); y += 9; }); });
    pages.push(pg.svg());
  }
  // Class tracker.
  const roster = kids.length ? kids : Array(24).fill('');
  for (let s = 0; s < roster.length; s += 24) {
    const part = roster.slice(s, s + 24), pg = new Page(paper, `${cls || 'Class'} homework tracker`, { subtitle: 'Tick when homework comes back. Add a star for a family task done!', noName: true });
    const lw = 56, cw = (pg.width - lw) / 8, hh = 12, rh = Math.min(11, (pg.room - hh) / Math.max(part.length, 16));
    for (let k = 0; k < 8; k++) pg.add(`<rect x="${pg.left + lw + k * cw}" y="${pg.y}" width="${cw}" height="${hh}" fill="${TINTS[Math.floor(k / 2)]}" stroke="#d9d4ec" stroke-width="0.3"/>` + txt(pg.left + lw + k * cw + cw / 2, pg.y + 8, k % 2 ? `W${Math.floor(k / 2) + 1} ⭐` : `W${Math.floor(k / 2) + 1} ✓`, 5, { colour: PALETTE[Math.floor(k / 2)] }));
    part.forEach((n, j) => { const y = pg.y + hh + j * rh; pg.add(`<rect x="${pg.left}" y="${y}" width="${lw}" height="${rh}" fill="${j % 2 ? '#fff' : '#faf8ff'}" stroke="#d9d4ec" stroke-width="0.3"/>` + (n ? txt(pg.left + 3, y + rh * 0.68, n, fitFont(n, 5.6, lw - 6, 0.55), { anchor: 'start', colour: INK }) : '')); for (let k = 0; k < 8; k++) pg.add(`<rect x="${pg.left + lw + k * cw}" y="${y}" width="${cw}" height="${rh}" fill="#fff" stroke="#d9d4ec" stroke-width="0.3"/>`); });
    pages.push(pg.svg());
  }
  {
    const pg = new Page(paper, 'Homework Month: maths answers', { subtitle: 'Answer key for teachers.', noName: true });
    answers.forEach((a, i) => pg.add(txt(pg.left, pg.y + 10 + i * 12, `Week ${i + 1}`, 7, { anchor: 'start', colour: lk.ring }) + txt(pg.left + 30, pg.y + 10 + i * 12, a.join(',   '), 7, { anchor: 'start', font: FONT, colour: INK })));
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ Cover Teacher Kit (teachers)
const COVER_GAMES = [['🙊', 'Silent ball: pass a soft ball in silence. Talk or drop it and you sit down.'], ['🗣️', 'Simon says, with a twist: act like animals.'], ['🔤', 'Alphabet hunt: name something in the room for each letter.'], ['🧠', 'Kim\'s game: 10 things on a tray, cover them, remove one.'], ['🎨', 'Draw and guess: one child draws, the class guesses.'], ['🔢', 'Buzz: count round the class, say buzz on every 5.'], ['🦘', 'Heads down thumbs up.'], ['📖', 'Story chain: each child adds one sentence.'], ['🎵', 'Freeze dance: freeze when the music stops.'], ['❓', 'Twenty questions: guess what the teacher is thinking of.']];

function makeCoverKit(o, paper) {
  const rand = rng(+o.seed || 1);
  const lk = edLook(o.look), older = o.level === 'older';
  const kids = classNames(o, false), cls = String(o.cls || '').trim().slice(0, 24), teacher = String(o.teacher || '').trim().slice(0, 30);
  const pages = [seriesCover(paper, 'PRINTPALS PLUS FOR TEACHERS', cls ? `${cls}: Cover Day` : 'Cover Teacher Kit', older ? 'A ready day for ages 7 to 9' : 'A ready day for ages 5 to 7', ['🧑‍🏫', '📋', '🔢', lk.corner, '📚', '⭐'], lk.ring, lk.tint, 'cover kit', ['Class notes to fill in', 'Timetable for the day', 'Seating plan', 'Ready activities', 'Games, no kit needed', 'How did it go? note'])];
  // Class notes.
  {
    const pg = new Page(paper, `Welcome to ${cls || 'our class'}!`, { subtitle: `${teacher ? teacher + ' says: t' : 'T'}hank you for looking after my class today. Everything you need is in this folder.`, noName: true });
    const boxes = [['🏥', 'Allergies and medical needs'], ['💛', 'Children who may need extra support'], ['🙋', 'Brilliant helpers you can ask'], ['🔔', 'Register, break, lunch and home times'], ['⭐', 'Our reward and behaviour system'], ['📞', 'Who to ask for help']], bh = pg.room / 3, bw = pg.width / 2;
    boxes.forEach(([e, t], k) => linedBox(pg, pg.left + (k % 2) * bw + 2, pg.y + Math.floor(k / 2) * bh + 2, bw - 4, bh - 6, t, PALETTE[k], e));
    pages.push(pg.svg());
  }
  // Timetable.
  {
    const pg = new Page(paper, 'Plan for the day', { subtitle: 'Fill in times and where things are. The activities in this pack are ready to use in any slot!', noName: true });
    const rows = [['Morning', 'Register and morning work'], ['Session 1', 'Maths sheet (in this pack)'], ['Break', ''], ['Session 2', 'Writing prompt (in this pack)'], ['Lunch', ''], ['Session 3', 'Colouring scene or puzzle (in this pack)'], ['Session 4', 'Games from the games page'], ['End of day', 'Story and home time']], rh = pg.room / rows.length, c1 = 30, c2 = pg.width * 0.36;
    rows.forEach(([t, what], k) => { const y = pg.y + k * rh; pg.add(`<rect x="${pg.left}" y="${y}" width="${c1}" height="${rh}" fill="${TINTS[k % TINTS.length]}" stroke="#d9d4ec" stroke-width="0.4"/>` + txt(pg.left + c1 / 2, y + rh / 2 + 2, t, fitFont(t, 5.6, c1 - 4, 0.55), { colour: PALETTE[k % PALETTE.length] }) + `<rect x="${pg.left + c1}" y="${y}" width="${c2}" height="${rh}" fill="#fff" stroke="#d9d4ec" stroke-width="0.4"/>` + txt(pg.left + c1 + 4, y + 8, 'Time:', 5, { anchor: 'start', font: FONT, colour: SOFT }) + (what ? txt(pg.left + c1 + 4, y + rh - 5, what, fitFont(what, 5.6, c2 - 8, 0.5), { anchor: 'start', colour: INK }) : '') + `<rect x="${pg.left + c1 + c2}" y="${y}" width="${pg.width - c1 - c2}" height="${rh}" fill="#fff" stroke="#d9d4ec" stroke-width="0.4"/>` + txt(pg.left + c1 + c2 + 4, y + 8, 'Notes and where to find things:', 5, { anchor: 'start', font: FONT, colour: SOFT })); });
    pages.push(pg.svg());
  }
  // Seating plan.
  {
    const pg = new Page(paper, 'Seating plan', { subtitle: 'Where everyone sits. Write names in the desks if they are blank.', noName: true });
    pg.add(`<rect x="${pg.left + pg.width * 0.3}" y="${pg.y}" width="${pg.width * 0.4}" height="12" rx="3" fill="${lk.tint}" stroke="${lk.ring}" stroke-width="0.7"/>` + txt(pg.w / 2, pg.y + 8, 'Board and teacher', 5.6, { colour: lk.ring }));
    const tables = 6, perT = 6, tw = pg.width / 3, th = (pg.room - 20) / 2;
    let idx = 0;
    for (let t = 0; t < tables; t++) { const x = pg.left + (t % 3) * tw, y = pg.y + 20 + Math.floor(t / 3) * th; pg.add(`<rect x="${x + tw * 0.22}" y="${y + th * 0.24}" width="${tw * 0.56}" height="${th * 0.52}" rx="6" fill="${TINTS[t]}" stroke="${PALETTE[t]}" stroke-width="0.8"/>` + txt(x + tw / 2, y + th / 2 + 2, `Table ${t + 1}`, 5.6, { colour: PALETTE[t] })); for (let s = 0; s < perT; s++) { const sx = x + tw * (s % 3 === 0 ? 0.2 : s % 3 === 1 ? 0.5 : 0.8), sy = y + (s < 3 ? th * 0.12 : th * 0.88), n = kids[idx++] || ''; pg.add(`<rect x="${sx - tw * 0.14}" y="${sy - 5}" width="${tw * 0.28}" height="10" rx="3" fill="#fff" stroke="#b9b3d6" stroke-width="0.5"/>` + (n ? txt(sx, sy + 2, n, fitFont(n, 5, tw * 0.26, 0.55), { colour: INK }) : '')); } }
    pages.push(pg.svg());
  }
  // Ready activities.
  const add = (id, opts, label) => { const r = packRun(id, opts, paper, (+o.seed || 1) * 7 + id.length); if (r.sheets[0]) pages.push(packBadge(r.sheets[0], label, lk.ring)); };
  add('maths', { op: older ? 'mix' : 'add', within: older ? '100' : '10', count: '20' }, 'Cover day: maths');
  add('storywriting', {}, 'Cover day: writing');
  add('wordsearch', { words: older ? 'SCHOOL, FRIEND, PENCIL, TEACHER, BOOKS, LEARN, CLASS, READING' : 'CAT, DOG, SUN, BOOK, PEN, HAT, BUS, TREE', size: older ? '10' : '8', level: 'easy', title: 'Class word search' }, 'Cover day: puzzle');
  {
    const pg = new Page(paper, 'Colour the busy picture', { subtitle: 'A calm activity for after lunch. Colour carefully and add something of your own!' });
    const sn = cmScene(CM_ORDER[Math.floor(rand() * CM_ORDER.length)], rand), boxH = pg.room - 4, s2 = Math.min((pg.width - 6) / 200, (boxH - 6) / 240);
    pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="${boxH}" rx="8" fill="#fff" stroke="#1f1b2e" stroke-width="1"/><g transform="translate(${pg.left + (pg.width - 200 * s2) / 2} ${pg.y + (boxH - 240 * s2) / 2}) scale(${s2.toFixed(4)})">${sn.svg}</g>`);
    pages.push(packBadge(pg.svg(), 'Cover day: calm time', lk.ring));
  }
  pages.push(checklistPage(paper, 'Games with no equipment', 'Perfect for the last ten minutes, wet play or a wobbly moment. Tick the ones you played!', COVER_GAMES, ''));
  {
    const pg = new Page(paper, 'Fast finishers', { subtitle: 'Finished already? Choose a challenge!', noName: false });
    const ch = [['✏️', 'Write 10 words that rhyme with cat'], ['🔢', 'Write the numbers to 50 in your best writing'], ['🎨', 'Design a new school uniform'], ['🦸', 'Invent a superhero for our class'], ['📝', 'Write a thank you note to someone'], ['🗺️', 'Draw a map of the school']], bh = pg.room / 3, bw = pg.width / 2;
    ch.forEach(([e, t], k) => linedBox(pg, pg.left + (k % 2) * bw + 2, pg.y + Math.floor(k / 2) * bh + 2, bw - 4, bh - 6, t, PALETTE[k], e));
    pages.push(pg.svg());
  }
  // How did it go.
  {
    const pg = new Page(paper, 'How did it go?', { subtitle: `A quick note for ${teacher || 'the class teacher'}. Thank you so much for today!`, noName: true });
    const boxes = [['📋', 'What we did'], ['⭐', 'Stars of the day'], ['💭', 'Anything to follow up'], ['📦', 'Work left on the desk']], bh = (pg.room - 30) / 4;
    boxes.forEach(([e, t], k) => linedBox(pg, pg.left, pg.y + k * bh, pg.width, bh - 4, t, PALETTE[k], e));
    pg.y += 4 * bh + 4;
    pg.add(txt(pg.left, pg.y + 8, 'Cover teacher:', 6.4, { anchor: 'start', colour: lk.ring }) + `<line x1="${pg.left + 46}" x2="${pg.left + pg.width * 0.6}" y1="${pg.y + 8.6}" y2="${pg.y + 8.6}" stroke="#b9b3d6" stroke-width="0.5"/>` + txt(pg.left + pg.width * 0.64, pg.y + 8, 'Date:', 6.4, { anchor: 'start', colour: lk.ring }) + `<line x1="${pg.left + pg.width * 0.64 + 20}" x2="${pg.right}" y1="${pg.y + 8.6}" y2="${pg.y + 8.6}" stroke="#b9b3d6" stroke-width="0.5"/>`);
    pages.push(pg.svg());
  }
  return pages;
}

Object.assign(MAKERS, { classwelcome: makeClassWelcome, classawards: makeClassAwards, homeworkmonth: makeHomeworkMonth, coverkit: makeCoverKit });
