// PrintPals batch 33 (Teacher Christmas): Class Christmas Cards, Class Calendar Gift, Christmas Show Kit, Class Advent Countdown.

const XMAS = { red: { ring: '#d62f2f', tint: '#fff0f0', accent: '#2e9d62' }, green: { ring: '#2e9d62', tint: '#f1f8e6', accent: '#d62f2f' }, frosty: { ring: '#3a8fd8', tint: '#eef6ff', accent: '#8a3fd1' } };
const xLook = (k) => XMAS[k] || XMAS.red;
const XART = ['tree', 'snowman', 'stocking', 'gingerbread', 'presents', 'bauble'];

// A folded card: landscape page split in half. Left half is the back, right half is the front.
function foldedCard(paper, front, inside, backNote) {
  const pg = new Page(paper, '', { bare: true, landscape: true });
  const mid = pg.w / 2;
  pg.add(`<line x1="${mid}" x2="${mid}" y1="${pg.m}" y2="${pg.h - pg.m}" stroke="#b9b3d6" stroke-width="0.5" stroke-dasharray="3 2"/>` + txt(mid, pg.m - 2, 'fold', 4.4, { font: FONT, colour: SOFT }));
  pg.add(txt(mid / 2, pg.h - pg.m - 10, backNote || 'Made with love at school', 5.4, { font: FONT, colour: SOFT }) + emoji('🎄', mid / 2, pg.h - pg.m - 24, 12));
  front(pg, mid, pg.m, pg.w - mid - pg.m, pg.h - pg.m * 2);
  pg.footer = () => {};
  const pages = [pg.svg()];
  if (inside) { const p2 = new Page(paper, '', { bare: true, landscape: true }); p2.add(`<line x1="${p2.w / 2}" x2="${p2.w / 2}" y1="${p2.m}" y2="${p2.h - p2.m}" stroke="#e2ddf2" stroke-width="0.4" stroke-dasharray="3 2"/>` + txt(p2.w / 2, p2.m - 2, 'print on the back, then fold', 4.4, { font: FONT, colour: SOFT })); inside(p2, p2.w / 2, p2.m, p2.w / 2 - p2.m, p2.h - p2.m * 2); p2.footer = () => {}; pages.push(p2.svg()); }
  return pages;
}

// ================================================================ Class Christmas Cards (teachers)
function makeXmasCards(o, paper) {
  const kids = classNames(o), lk = xLook(o.look), { cls, teacher } = teacherBits(o);
  const pages = [];
  kids.forEach((n, i) => {
    const art = XART[i % XART.length], c = i % 2 ? lk.ring : lk.accent;
    // Card from the teacher (colour-in front, message inside).
    pages.push(...foldedCard(paper, (pg, x, y, w, h) => {
      pg.add(`<rect x="${x + 8}" y="${y + 4}" width="${w - 12}" height="${h - 8}" rx="10" fill="#fff" stroke="${c}" stroke-width="1.6"/>`);
      bubbleText(pg, 'Merry Christmas', x + w / 2 + 2, y + 26, w - 30, 18);
      bubbleText(pg, n, x + w / 2 + 2, y + 46, w - 40, 16);
      const s = Math.min(w - 40, h - 70);
      pg.add(`<g transform="translate(${x + w / 2 + 2 - s / 2} ${y + 54}) scale(${(s / 200).toFixed(4)})">${seasonArt(art)}</g>`);
    }, (pg, x, y, w, h) => {
      const msg = [`Dear ${n},`, '', 'Thank you for a wonderful term. You have worked so hard and made our class a happier place.', '', 'Have a magical Christmas and a very happy new year!', '', teacher ? `Love from ${teacher}` : 'Love from your teacher'];
      let yy = y + 30;
      msg.forEach((l) => { if (!l) { yy += 5; return; } wrap(l, 36).forEach((ll) => { pg.add(txt(x + w / 2, yy, ll, 8, { colour: INK })); yy += 11; }); });
      pg.add(emoji('⭐', x + w / 2, yy + 14, 16));
      pg.add(`<rect x="${pg.m + 16}" y="${y + 16}" width="${w - 32}" height="${h - 40}" rx="10" fill="#fff" stroke="${lk.ring}" stroke-width="0.8" stroke-dasharray="3 2"/>` + txt(pg.m + w / 2, y + h - 12, 'A photo or drawing of our class', 6, { font: FONT, colour: SOFT }));
    }, cls ? `${cls}, Christmas ${new Date().getFullYear()}` : 'Made with love at school'));
  });
  // Card each child makes for their family.
  kids.forEach((n, i) => {
    pages.push(...foldedCard(paper, (pg, x, y, w, h) => {
      pg.add(`<rect x="${x + 8}" y="${y + 4}" width="${w - 12}" height="${h - 8}" rx="10" fill="#fff" stroke="#1f1b2e" stroke-width="1.2"/>`);
      bubbleText(pg, 'Happy Christmas!', x + w / 2 + 2, y + 26, w - 30, 16);
      pg.add(`<rect x="${x + 22}" y="${y + 38}" width="${w - 40}" height="${h - 62}" rx="8" fill="#fff" stroke="#b9b3d6" stroke-width="0.6" stroke-dasharray="3 2"/>` + txt(x + w / 2 + 2, y + 50, 'Draw your Christmas picture here', 5.4, { font: FONT, colour: SOFT }));
    }, (pg, x, y, w, h) => {
      pg.add(txt(x + w / 2, y + 26, 'To', 9, { colour: lk.ring }) + `<line x1="${x + 30}" x2="${x + w - 20}" y1="${y + 40}" y2="${y + 40}" stroke="#b9b3d6" stroke-width="0.6"/>`);
      for (let l = 0; l < 4; l++) pg.add(`<line x1="${x + 20}" x2="${x + w - 10}" y1="${y + 62 + l * 14}" y2="${y + 62 + l * 14}" stroke="#d9d4ec" stroke-width="0.5"/>`);
      pg.add(txt(x + w / 2, y + h - 30, 'Love from', 8, { colour: lk.ring }));
      bubbleText(pg, n, x + w / 2, y + h - 10, w - 40, 16);
    }, `Made by ${n}`));
  });
  // Gift tags for the class.
  for (let s = 0; s < kids.length; s += 12) pages.push(tagsPage(paper, 'Christmas gift tags', 'Colour, cut out and tie on gifts. Each has a name already!', 12, 3, (pg, x, y, w, h, i) => { const n = kids[s + i]; if (!n) return; pg.add(`<path d="M${x + 14} ${y + 4} H${x + w - 4} V${y + h - 4} H${x + 14} L${x + 4} ${y + h / 2} Z" fill="#fff" stroke="${i % 2 ? lk.ring : lk.accent}" stroke-width="1"/><circle cx="${x + 14}" cy="${y + h / 2}" r="2.4" fill="#fff" stroke="#1f1b2e" stroke-width="0.6"/>` + emoji(['🎄', '⭐', '🎁', '⛄'][i % 4], x + w * 0.4, y + h / 2, h * 0.34) + txt(x + w * 0.72, y + h * 0.42, 'From', 5, { font: FONT, colour: SOFT }) + txt(x + w * 0.72, y + h * 0.66, n, fitFont(n, 8, w * 0.44, 0.58), { colour: INK })); }));
  return pages;
}

// ================================================================ Class Calendar Gift (teachers)
function makeClassCalendar(o, paper) {
  const kids = classNames(o), lk = xLook(o.look), { cls } = teacherBits(o);
  const now = new Date(), yr = now.getMonth() >= 6 ? now.getFullYear() + 1 : now.getFullYear();
  const pages = [];
  const monthGrid = (pg, x, y, w, h, mi, c) => {
    const first = (new Date(yr, mi, 1).getDay() + 6) % 7, dim = new Date(yr, mi + 1, 0).getDate(), cw = w / 7, rows = Math.ceil((first + dim) / 7), rh = Math.min(16, (h - 10) / rows);
    ['M', 'T', 'W', 'T', 'F', 'S', 'S'].forEach((d, k) => pg.add(`<rect x="${x + k * cw}" y="${y}" width="${cw}" height="9" fill="${c}"/>` + txt(x + k * cw + cw / 2, y + 6.6, d, 5.4, { colour: '#fff' })));
    for (let k = 0; k < rows * 7; k++) { const d = k - first + 1, xx = x + (k % 7) * cw, yy = y + 9 + Math.floor(k / 7) * rh; pg.add(`<rect x="${xx}" y="${yy}" width="${cw}" height="${rh}" fill="#fff" stroke="#d9d4ec" stroke-width="0.4"/>` + (d >= 1 && d <= dim ? txt(xx + 3, yy + 6, `${d}`, 5, { anchor: 'start', colour: k % 7 >= 5 ? c : INK }) : '')); }
  };
  // Teacher planning page.
  {
    const pg = new Page(paper, `Class calendar gift ${yr}`, { subtitle: 'How to use: each child gets a cover and 12 month pages. They draw a picture in each box (one a day in December!). Staple at the top and punch a hole to hang.', noName: true });
    const ideas = ['January: me in the snow', 'February: someone I love', 'March: spring flowers', 'April: my favourite animal', 'May: playing outside', 'June: a sunny day', 'July: summer fun', 'August: the seaside', 'September: my school', 'October: autumn leaves', 'November: fireworks and stars', 'December: Christmas'];
    ideas.forEach((l, k) => pg.add(`<circle cx="${pg.left + 6}" cy="${pg.y + 8 + k * 12}" r="3" fill="${PALETTE[k % PALETTE.length]}"/>` + txt(pg.left + 14, pg.y + 10 + k * 12, l, 7, { anchor: 'start', colour: INK })));
    pages.push(pg.svg());
  }
  kids.forEach((n, i) => {
    const c = i % 2 ? lk.ring : lk.accent;
    { const pg = new Page(paper, '', { bare: true, tint: lk.tint });
      pg.add(`<rect x="${pg.left}" y="${pg.m}" width="${pg.width}" height="${pg.bottom - pg.m}" rx="14" fill="#fff" stroke="${c}" stroke-width="2"/>`);
      bubbleText(pg, `${yr}`, pg.w / 2, pg.m + 44, pg.width - 40, 36);
      pg.add(txt(pg.w / 2, pg.m + 62, 'A calendar made just for you by', 7, { font: FONT, colour: SOFT }));
      bubbleText(pg, n, pg.w / 2, pg.m + 88, pg.width - 40, 26);
      pg.add(`<rect x="${pg.left + 20}" y="${pg.m + 100}" width="${pg.width - 40}" height="${pg.bottom - pg.m - 130}" rx="10" fill="#fff" stroke="#b9b3d6" stroke-width="0.6" stroke-dasharray="3 2"/>` + txt(pg.w / 2, pg.m + 112, 'Draw a picture of your family here', 6, { font: FONT, colour: SOFT }) + txt(pg.w / 2, pg.bottom - 14, cls || '', 6, { colour: c }));
      pg.footer = () => {}; pages.push(pg.svg()); }
    for (let m = 0; m < 12; m += 2) {
      const pg = new Page(paper, '', { bare: true });
      const hh = (pg.bottom - pg.m) / 2;
      [m, m + 1].forEach((mi, k) => { const y = pg.m + k * hh, col = PALETTE[mi % PALETTE.length]; pg.add(txt(pg.left, y + 10, MONTHS[mi], 11, { anchor: 'start', colour: col }) + txt(pg.right, y + 10, `${n}, ${yr}`, 5.4, { anchor: 'end', font: FONT, colour: SOFT }) + `<rect x="${pg.left}" y="${y + 14}" width="${pg.width * 0.46}" height="${hh - 22}" rx="8" fill="#fff" stroke="${col}" stroke-width="0.8" stroke-dasharray="3 2"/>`); monthGrid(pg, pg.left + pg.width * 0.5, y + 14, pg.width * 0.5, hh - 22, mi, col); });
      pg.footer = () => {}; pages.push(pg.svg());
    }
  });
  return pages;
}

// ================================================================ Christmas Show Kit (teachers)
const SHOW_ROLES = { nativity: ['Mary', 'Joseph', 'Angel Gabriel', 'Innkeeper', 'Shepherd', 'Shepherd', 'Wise King', 'Wise King', 'Wise King', 'Star', 'Angel', 'Angel', 'Donkey', 'Sheep', 'Sheep', 'Narrator', 'Narrator', 'Cow', 'Camel', 'Angel'], winter: ['Narrator', 'Snow Queen', 'Snowman', 'Reindeer', 'Reindeer', 'Robin', 'Elf', 'Elf', 'Elf', 'Penguin', 'Penguin', 'Polar Bear', 'Snowflake', 'Snowflake', 'Snowflake', 'Star', 'Toy Maker', 'Gingerbread Friend', 'Owl', 'Narrator'] };
const ROLE_EMOJI = { Mary: '👩', Joseph: '👨', 'Angel Gabriel': '👼', Innkeeper: '🏠', Shepherd: '🐑', 'Wise King': '👑', Star: '⭐', Angel: '👼', Donkey: '🫏', Sheep: '🐑', Narrator: '📖', Cow: '🐄', Camel: '🐪', 'Snow Queen': '👸', Snowman: '⛄', Reindeer: '🦌', Robin: '🐦', Elf: '🧝', Penguin: '🐧', 'Polar Bear': '🐻‍❄️', Snowflake: '❄️', 'Toy Maker': '🧸', 'Gingerbread Friend': '🍪', Owl: '🦉' };

function makeXmasShow(o, paper) {
  const kids = classNames(o), lk = xLook(o.look), { cls, teacher } = teacherBits(o);
  const kind = o.kind === 'winter' ? 'winter' : 'nativity', show = String(o.show || '').trim().slice(0, 30) || (kind === 'winter' ? 'Our Winter Show' : 'Our Nativity');
  const roles = kids.map((n, i) => [n, SHOW_ROLES[kind][i % SHOW_ROLES[kind].length]]);
  const pages = [seriesCover(paper, 'PRINTPALS PLUS FOR TEACHERS', show, cls || 'Christmas show kit', ['🎭', '⭐', '🎄', '🎟️', '🎶', '👏'], lk.ring, lk.tint, 'show kit', ['Cast list', 'A role card per child', 'Tickets and programme', 'Posters', 'Rehearsal tracker', 'Star Performer certificates'])];
  // Cast list.
  {
    const pg = new Page(paper, `${show}: cast list`, { subtitle: 'Roles are shared round the class list. Swap any names before you print! Send a copy home.', noName: true });
    const cols = 2, per = Math.ceil(roles.length / cols), rh = Math.min(12, pg.room / per), cw = pg.width / cols;
    roles.forEach(([n, r], k) => { const x = pg.left + Math.floor(k / per) * cw, y = pg.y + (k % per) * rh; pg.add(emoji(ROLE_EMOJI[r] || '⭐', x + 6, y + rh / 2, rh * 0.6) + txt(x + 14, y + rh * 0.68, r, fitFont(r, 6.4, cw * 0.45, 0.56), { anchor: 'start', colour: PALETTE[k % PALETTE.length] }) + txt(x + cw * 0.55, y + rh * 0.68, n, fitFont(n, 6.4, cw * 0.42, 0.56), { anchor: 'start', colour: INK })); });
    pages.push(pg.svg());
  }
  // Role cards.
  for (let s = 0; s < roles.length; s += 6) pages.push(tagsPage(paper, 'Role cards', 'Give each child their card. Costume ideas are on the back of the programme!', 6, 2, (pg, x, y, w, h, i) => { const r = roles[s + i]; if (!r) return; const c = PALETTE[(s + i) % PALETTE.length]; pg.add(`<rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="10" fill="${TINTS[(s + i) % TINTS.length]}" stroke="${c}" stroke-width="1.2"/>` + txt(x + w / 2, y + 14, show.toUpperCase(), fitFont(show, 5, w - 30, 0.8), { font: FONT, colour: SOFT }).replace('<text ', '<text letter-spacing="1.4" ') + emoji(ROLE_EMOJI[r[1]] || '⭐', x + w / 2, y + h * 0.42, h * 0.32) + txt(x + w / 2, y + h * 0.72, r[0], fitFont(r[0], 11, w - 20, 0.58), { colour: INK }) + txt(x + w / 2, y + h * 0.86, `is playing ${r[1]}`, 7, { colour: c })); }));
  // Tickets.
  pages.push(tagsPage(paper, 'Tickets', 'Children colour a ticket for each grown-up coming to watch.', 8, 2, (pg, x, y, w, h, i) => { const c = i % 2 ? lk.ring : lk.accent; pg.add(`<rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="6" fill="#fff" stroke="${c}" stroke-width="1"/><line x1="${x + w * 0.72}" x2="${x + w * 0.72}" y1="${y + 6}" y2="${y + h - 6}" stroke="${c}" stroke-width="0.5" stroke-dasharray="2 1.5"/>` + txt(x + 12, y + 16, 'ADMIT ONE', 5, { anchor: 'start', font: FONT, colour: SOFT }).replace('<text ', '<text letter-spacing="1.6" ') + txt(x + 12, y + 28, show, fitFont(show, 8, w * 0.6, 0.56), { anchor: 'start', colour: c }) + txt(x + 12, y + 38, `${cls || ''} ${teacher ? '· ' + teacher : ''}`, 5, { anchor: 'start', font: FONT, colour: INK }) + txt(x + 12, y + h - 12, 'Date: ________  Time: ______', 4.8, { anchor: 'start', font: FONT, colour: SOFT }) + emoji(['🎄', '⭐', '🎁', '🔔'][i % 4], x + w * 0.86, y + h / 2, h * 0.34)); }));
  // Programme.
  {
    const pg = new Page(paper, `Programme: ${show}`, { subtitle: 'Fold in half or hand out as it is. Thank you for coming!', noName: true });
    pg.add(panel(pg.left, pg.y, pg.width, 40, lk.tint, lk.ring, 12));
    bubbleText(pg, show, pg.w / 2, pg.y + 22, pg.width - 40, 18);
    pg.add(txt(pg.w / 2, pg.y + 34, `Performed by ${cls || 'our class'}${teacher ? ' with ' + teacher : ''}`, 6.4, { colour: lk.ring }));
    pg.y += 48;
    pg.add(txt(pg.left, pg.y + 4, 'Songs', 7.4, { anchor: 'start', colour: lk.accent })); for (let k = 0; k < 5; k++) pg.add(txt(pg.left + 4, pg.y + 16 + k * 10, `${k + 1}.`, 6.4, { anchor: 'start', colour: INK }) + `<line x1="${pg.left + 14}" x2="${pg.left + pg.width * 0.45}" y1="${pg.y + 16.6 + k * 10}" y2="${pg.y + 16.6 + k * 10}" stroke="#d9d4ec" stroke-width="0.5"/>`);
    const cx = pg.left + pg.width * 0.52;
    pg.add(txt(cx, pg.y + 4, 'Our cast', 7.4, { anchor: 'start', colour: lk.accent }));
    const rh = Math.min(7.6, (pg.room - 12) / roles.length);
    roles.forEach(([n, r], k) => pg.add(txt(cx, pg.y + 14 + k * rh, `${r}:`, Math.min(5.4, rh * 0.8), { anchor: 'start', colour: PALETTE[k % PALETTE.length] }) + txt(cx + 42, pg.y + 14 + k * rh, n, Math.min(5.4, rh * 0.8, fitFont(n, 5.4, pg.right - cx - 44, 0.55)), { anchor: 'start', font: FONT, weight: 700, colour: INK })));
    pg.add(txt(pg.left, pg.bottom - 8, 'Please enjoy the show and remember to clap loudly!', 6, { anchor: 'start', font: FONT, colour: SOFT }));
    pages.push(pg.svg());
  }
  // Poster.
  {
    const pg = new Page(paper, '', { bare: true });
    pg.add(`<rect x="${pg.left}" y="${pg.m}" width="${pg.width}" height="${pg.bottom - pg.m}" rx="14" fill="#fff" stroke="${lk.ring}" stroke-width="2.4"/>` + txt(pg.w / 2, pg.m + 24, 'YOU ARE INVITED TO', 7, { font: FONT, colour: SOFT }).replace('<text ', '<text letter-spacing="2" '));
    bubbleText(pg, show, pg.w / 2, pg.m + 56, pg.width - 30, 26);
    pg.add(`<g transform="translate(${pg.w / 2 - 55} ${pg.m + 70}) scale(0.55)">${seasonArt('tree')}</g>`);
    ['Date: ____________________', 'Time: ____________________', 'Where: ___________________'].forEach((l, k) => pg.add(txt(pg.w / 2, pg.m + 200 + k * 14, l, 10, { colour: INK })));
    pg.add(txt(pg.w / 2, pg.bottom - 14, `Performed by ${cls || 'our class'}. Colour me in!`, 7, { colour: lk.ring }));
    pg.footer = () => {}; pages.push(pg.svg());
  }
  pages.push(...classGrid(paper, 'Rehearsal tracker', 'Tick when each child knows their lines, songs and costume. Nearly show time!', roles.map((r) => r[0]), ['Role given', 'Knows lines', 'Knows songs', 'Costume note sent', 'Costume in', 'Dress rehearsal'], lk));
  roles.forEach(([n, r], i) => pages.push(awardPage(paper, ['🌟', 'Star Performer', `for a brilliant performance as ${r} in ${show}!`], n, cls, teacher, i % 2 ? lk.ring : lk.accent, lk.tint)));
  return pages;
}

// ================================================================ Class Advent Countdown (teachers)
const ADVENT_ACTS = ['Sing a Christmas song together', 'Write a kind note to someone in another class', 'Christmas jumper day!', 'Make paper snowflakes', 'Share a Christmas joke', 'Read a winter story', 'Draw your dream present', 'Make a paper chain with the whole class', 'Freeze dance to Christmas music', 'Write to someone who lives alone', 'Count down in 10s from 100', 'Christmas word search', 'Guess the number of sweets in the jar', 'Make a card for the school staff', 'Build a snowman out of paper', 'Christmas drawing competition', 'Act out a winter story', 'Tidy the classroom for the holidays', 'Class hot chocolate and a film clip', 'Share what you love about winter', 'Make a gift tag for someone special', 'Christmas quiz!', 'Wear something sparkly', 'Say thank you to someone who helps us'];

function makeClassAdvent(o, paper) {
  const rand = rng(+o.seed || 1);
  const kids = classNames(o), lk = xLook(o.look), { cls, teacher } = teacherBits(o);
  const helpers = shuffle(kids, rand);
  const pages = [seriesCover(paper, 'PRINTPALS PLUS FOR TEACHERS', cls ? `${cls} Advent Countdown` : 'Class Advent Countdown', '24 days of classroom Christmas joy', ['🎄', '🎁', '⭐', '⛄', '🔔', '🍪'], lk.ring, lk.tint, 'advent kit', ['24 activity cards', 'Big countdown chart', 'A daily class helper', 'Christmas certificates', 'All named from your list', 'Five minutes a day'])];
  // Countdown chart.
  {
    const pg = new Page(paper, `${cls || 'Our'} Christmas countdown`, { subtitle: 'Colour a number each day. The helper of the day opens the card and reads it to the class!', noName: true });
    const cols = 4, cw = pg.width / cols, ch = pg.room / 6;
    for (let d = 0; d < 24; d++) { const x = pg.left + (d % cols) * cw, y = pg.y + Math.floor(d / cols) * ch, c = d % 2 ? lk.ring : lk.accent; pg.add(panel(x + 2, y + 2, cw - 4, ch - 4, TINTS[d % TINTS.length], c, 10) + txt(x + cw / 2, y + ch * 0.46, `${d + 1}`, 16, { colour: c }) + txt(x + cw / 2, y + ch - 8, helpers[d % helpers.length], fitFont(helpers[d % helpers.length], 5.4, cw - 10, 0.55), { font: FONT, weight: 700, colour: INK }) + emoji(['🎄', '⭐', '🎁', '⛄'][d % 4], x + cw - 12, y + 12, 8)); }
    pages.push(pg.svg());
  }
  // Activity cards.
  for (let s = 0; s < 24; s += 8) pages.push(tagsPage(paper, `Advent cards ${s + 1} to ${s + 8}`, 'Cut out, fold and pop them in envelopes, or peg them on a string!', 8, 2, (pg, x, y, w, h, i) => { const d = s + i, c = d % 2 ? lk.ring : lk.accent; pg.add(`<rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="9" fill="#fff" stroke="${c}" stroke-width="1"/><circle cx="${x + 18}" cy="${y + h / 2}" r="11" fill="${TINTS[d % TINTS.length]}" stroke="${c}" stroke-width="1"/>` + txt(x + 18, y + h / 2 + 3.4, `${d + 1}`, 10, { colour: c })); wrap(ADVENT_ACTS[d], 20).forEach((l, k, a) => pg.add(txt(x + 34, y + h / 2 + 1 - (a.length - 1) * 3.6 + k * 7.2, l, fitFont(l, 6, w - 42, 0.54), { anchor: 'start', colour: INK }))); pg.add(txt(x + w - 10, y + h - 9, `Helper: ${helpers[d % helpers.length]}`, 4.6, { anchor: 'end', font: FONT, colour: SOFT })); }));
  // Helper badges.
  pages.push(tagsPage(paper, 'Helper of the day badges', 'Pin a badge on the helper of the day!', 6, 3, (pg, x, y, w, h, i) => { const cx = x + w / 2, cy = y + h / 2, r = Math.min(w, h) * 0.4; pg.add(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${TINTS[i]}" stroke="${i % 2 ? lk.ring : lk.accent}" stroke-width="1.4"/>` + emoji(['🎄', '⭐', '🎁', '⛄', '🔔', '🦌'][i], cx, cy - r * 0.3, r * 0.6) + txt(cx, cy + r * 0.24, 'Christmas', 6, { colour: INK }) + txt(cx, cy + r * 0.62, 'Helper!', 7.4, { colour: i % 2 ? lk.ring : lk.accent })); }));
  kids.forEach((n, i) => pages.push(awardPage(paper, ['🎄', 'Christmas Star', 'for spreading kindness and Christmas cheer in our class!'], n, cls, teacher, i % 2 ? lk.ring : lk.accent, lk.tint)));
  return pages;
}

Object.assign(MAKERS, { xmascards: makeXmasCards, classcalendar: makeClassCalendar, xmasshow: makeXmasShow, classadvent: makeClassAdvent });
