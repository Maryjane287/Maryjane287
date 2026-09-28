// PrintPals batch 34 (Teacher toolkit 3): Class Birthday Kit, Class Reward System, Moving Up Kit, Class Special Person Cards.

// A crown band to cut out and tape into a ring: two strips per page.
function crownStrip(pg, x, y, w, h, name, colour, tint, deco) {
  let d = `M${x} ${y + h}`;
  const pts = 7;
  for (let k = 0; k <= pts; k++) { const px = x + (k / pts) * w; d += ` L${px} ${y + h * 0.42}`; if (k < pts) d += ` L${px + w / pts / 2} ${y}`; }
  d += ` L${x + w} ${y + h} Z`;
  pg.add(`<path d="${d}" fill="${tint}" stroke="${colour}" stroke-width="1.2" stroke-linejoin="round"/>`);
  for (let k = 0; k < pts; k++) pg.add(`<circle cx="${x + (k + 0.5) * w / pts}" cy="${y + h * 0.1}" r="2.4" fill="#fff" stroke="${colour}" stroke-width="0.7"/>`);
  bubbleText(pg, name, x + w / 2, y + h * 0.84, w * 0.6, h * 0.4);
  if (deco) pg.add(emoji(deco, x + 16, y + h * 0.72, h * 0.3) + emoji(deco, x + w - 16, y + h * 0.72, h * 0.3));
}

// ================================================================ Class Birthday Kit (teachers)
function makeClassBirthday(o, paper) {
  const kids = classNames(o), lk = edLook(o.look), { cls, teacher } = teacherBits(o);
  const pages = [seriesCover(paper, 'PRINTPALS PLUS FOR TEACHERS', cls ? `${cls} Birthdays` : 'Class Birthday Kit', 'Every birthday celebrated', ['🎂', '👑', '🎈', lk.corner, '🎉', '🎁'], lk.ring, lk.tint, 'birthday kit', ['A crown for every child', 'A card from the class', 'Birthday certificates', 'Birthday display', 'Birthday star badges', `${kids.length} children, all named`])];
  // Crowns: two per page.
  for (let s = 0; s < kids.length; s += 2) {
    const pg = new Page(paper, s ? 'Birthday crowns (more)' : 'Birthday crowns', { subtitle: 'Colour, cut out and tape the ends together to fit their head. Add a strip of paper if it needs to be bigger!', noName: true });
    const h = (pg.room - 10) / 2;
    [0, 1].forEach((k) => { const n = kids[s + k]; if (!n) return; crownStrip(pg, pg.left, pg.y + k * (h + 10), pg.width, h * 0.8, n, PALETTE[(s + k) % PALETTE.length], TINTS[(s + k) % TINTS.length], '🎂'); pg.add(txt(pg.left, pg.y + k * (h + 10) + h * 0.8 + 6, 'Happy Birthday! ✂ cut along the outline', 5, { anchor: 'start', font: FONT, colour: SOFT })); });
    pages.push(pg.svg());
  }
  // Card from the class.
  kids.forEach((n, i) => pages.push(...foldedCard(paper, (pg, x, y, w, h) => {
    pg.add(`<rect x="${x + 8}" y="${y + 4}" width="${w - 12}" height="${h - 8}" rx="10" fill="#fff" stroke="${PALETTE[i % PALETTE.length]}" stroke-width="1.6"/>`);
    bubbleText(pg, 'Happy Birthday', x + w / 2 + 2, y + 26, w - 30, 18);
    bubbleText(pg, n, x + w / 2 + 2, y + 48, w - 40, 18);
    const s = Math.min(w - 40, h - 74);
    pg.add(`<g transform="translate(${x + w / 2 + 2 - s / 2} ${y + 58}) scale(${(s / 200).toFixed(4)})">${seasonArt('cake')}</g>`);
  }, (pg, x, y, w, h) => {
    pg.add(txt(x + w / 2, y + 22, `Dear ${n},`, 9, { colour: lk.ring }));
    wrap('Happy birthday from everyone in our class! We hope you have the most wonderful day.', 34).forEach((l, k) => pg.add(txt(x + w / 2, y + 36 + k * 10, l, 7.4, { colour: INK })));
    pg.add(txt(x + w / 2, y + 72, 'Sign your name, friends!', 5.6, { font: FONT, colour: SOFT }));
    for (let k = 0; k < 6; k++) pg.add(`<line x1="${x + 16}" x2="${x + w - 8}" y1="${y + 84 + k * 11}" y2="${y + 84 + k * 11}" stroke="#d9d4ec" stroke-width="0.5"/>`);
    const lf = teacher ? `Love from ${teacher} and ${cls || 'your class'}` : `Love from ${cls || 'your class'}`; pg.add(txt(x + w / 2, y + h - 10, lf, fitFont(lf, 7, w - 20, 0.55), { colour: lk.ring }));
    pg.add(`<rect x="${pg.m + 16}" y="${y + 16}" width="${w - 32}" height="${h - 40}" rx="10" fill="#fff" stroke="${lk.ring}" stroke-width="0.8" stroke-dasharray="3 2"/>` + txt(pg.m + w / 2, y + h - 12, 'Friends can draw pictures here too!', 6, { font: FONT, colour: SOFT }));
  }, cls || 'From your class', '🎂')));
  kids.forEach((n, i) => pages.push(awardPage(paper, ['🎂', 'Happy Birthday!', 'to a very special member of our class. Have a wonderful day!'], n, cls, teacher, PALETTE[i % PALETTE.length], TINTS[i % TINTS.length])));
  // Birthday display: a balloon per month with names to fill.
  {
    const pg = new Page(paper, `${cls || 'Our'} birthday balloons`, { subtitle: 'Pin up for the whole year. Write each child\'s name and date in their month\'s balloon.', noName: true });
    const cw = pg.width / 4, ch = pg.room / 3;
    MONTHS.forEach((m, k) => { const cx = pg.left + (k % 4) * cw + cw / 2, cy = pg.y + Math.floor(k / 4) * ch + ch * 0.42, c = PALETTE[k % PALETTE.length], rx = cw * 0.42, ry = ch * 0.38; pg.add(`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${TINTS[k % TINTS.length]}" stroke="${c}" stroke-width="1.2"/><path d="M${cx - 3} ${cy + ry} l3 4 l3 -4 Z" fill="${c}"/><path d="M${cx} ${cy + ry + 4} q4 8 -2 16" fill="none" stroke="${c}" stroke-width="0.6"/>` + txt(cx, cy - ry + 12, m, 7, { colour: c })); for (let l = 0; l < 3; l++) pg.add(`<line x1="${cx - rx * 0.7}" x2="${cx + rx * 0.7}" y1="${cy - ry + 20 + l * 9}" y2="${cy - ry + 20 + l * 9}" stroke="#d9d4ec" stroke-width="0.45"/>`); });
    pages.push(pg.svg());
  }
  pages.push(tagsPage(paper, 'Birthday star badges', 'Pin one on the birthday child for the whole day!', 6, 3, (pg, x, y, w, h, i) => { const cx = x + w / 2, cy = y + h / 2, r = Math.min(w, h) * 0.42; pg.add(`<path d="${starPath(cx, cy, r, 0.55)}" fill="${TINTS[i]}" stroke="${PALETTE[i]}" stroke-width="1.4"/>` + txt(cx, cy - 1, "It's my", 6, { colour: INK }) + txt(cx, cy + 8, 'birthday!', 7.4, { colour: PALETTE[i] })); }));
  return pages;
}

// ================================================================ Class Reward System (teachers)
function makeClassRewards(o, paper) {
  const kids = classNames(o), lk = edLook(o.look), { cls, teacher } = teacherBits(o);
  const goal = String(o.goal || '').trim().slice(0, 40) || 'Fill 20 stars to earn a prize!';
  const teams = ['Lions', 'Dolphins', 'Owls', 'Tigers'], temoji = ['🦁', '🐬', '🦉', '🐯'];
  const pages = [seriesCover(paper, 'PRINTPALS PLUS FOR TEACHERS', cls ? `${cls} Rewards` : 'Class Reward System', 'Catch them being brilliant', ['⭐', '🏆', '🎟️', lk.corner, '🦁', '😊'], lk.ring, lk.tint, 'reward system', ['A sticker chart per child', 'Four class teams', 'Team points chart', 'Reward coupons', 'Golden time tracker', 'Star of the Week display'])];
  kids.forEach((n, i) => {
    const pg = new Page(paper, `${possessive(n)} star chart`, { subtitle: goal, noName: true });
    const c = PALETTE[i % PALETTE.length], team = teams[i % 4];
    pg.add(panel(pg.left, pg.y, pg.width, 26, TINTS[i % TINTS.length], c, 12) + emoji(T_EMOJI[i % T_EMOJI.length], pg.left + 16, pg.y + 13, 16) + txt(pg.left + 30, pg.y + 16, n, 11, { anchor: 'start', colour: c }) + emoji(temoji[i % 4], pg.right - 40, pg.y + 13, 12) + txt(pg.right - 30, pg.y + 16, `Team ${team}`, 6.4, { anchor: 'start', colour: INK }));
    pg.y += 32;
    const cols = 5, rows = 4, cw = pg.width / cols, ch = Math.min(40, (pg.room - 40) / rows);
    for (let k = 0; k < 20; k++) { const x = pg.left + (k % cols) * cw, y = pg.y + Math.floor(k / cols) * ch; pg.add(`<circle cx="${x + cw / 2}" cy="${y + ch / 2}" r="${Math.min(cw, ch) * 0.4}" fill="#fff" stroke="${PALETTE[k % PALETTE.length]}" stroke-width="1" stroke-dasharray="${k % 5 === 4 ? '' : '2 1.5'}"/>` + (k % 5 === 4 ? emoji('🎁', x + cw / 2, y + ch / 2, ch * 0.4) : txt(x + cw / 2, y + ch / 2 + 3, `${k + 1}`, 9, { colour: '#d9d4ec' }))); }
    pg.y += rows * ch + 8;
    pg.add(panel(pg.left, pg.y, pg.width, Math.min(30, pg.room - 2), lk.tint, lk.ring, 10) + txt(pg.left + 10, pg.y + 12, 'Every 5 stars: a little prize 🎁   20 stars: a big reward!', 6.4, { anchor: 'start', colour: lk.ring }) + txt(pg.left + 10, pg.y + 23, 'My big reward will be: ______________________________', 6, { anchor: 'start', font: FONT, colour: INK }));
    pages.push(pg.svg());
  });
  // Team points.
  {
    const pg = new Page(paper, `${cls || 'Class'} team points`, { subtitle: 'Colour a star for a team when they work together brilliantly. The winning team each Friday chooses the class reward!', noName: true });
    const cw = pg.width / 4, hh = 40;
    teams.forEach((t, k) => { const x = pg.left + k * cw, c = PALETTE[k]; pg.add(panel(x + 2, pg.y, cw - 4, hh, TINTS[k], c, 10) + emoji(temoji[k], x + cw / 2, pg.y + 16, 18) + txt(x + cw / 2, pg.y + 34, t, 8, { colour: c })); const members = kids.filter((_, j) => j % 4 === k); members.slice(0, 10).forEach((m, j) => pg.add(txt(x + cw / 2, pg.y + hh + 8 + j * 6, m, fitFont(m, 5, cw - 8, 0.55), { font: FONT, weight: 700, colour: INK }))); const sy = pg.y + hh + 72; for (let s = 0; s < 30; s++) pg.add(`<path d="${starPath(x + 10 + (s % 3) * (cw - 12) / 3 + 4, sy + Math.floor(s / 3) * ((pg.bottom - sy - 6) / 10), 4.4, 0.45)}" fill="#fff" stroke="${c}" stroke-width="0.8"/>`); });
    pages.push(pg.svg());
  }
  pages.push(tagsPage(paper, 'Reward coupons', 'Hand them out for super effort. Children cash them in whenever you choose!', 10, 2, (pg, x, y, w, h, i) => { const [e, t] = [['👟', 'Line leader for the day'], ['🪑', 'Sit in the teacher\'s chair'], ['🎨', '10 minutes of free drawing'], ['📚', 'Choose the class story'], ['🎵', 'Choose a song to dance to'], ['🧸', 'Bring a toy to show'], ['⭐', 'Sit with a friend all day'], ['🖍️', 'Use the special pens'], ['🎲', 'Choose a class game'], ['👑', 'Wear the class crown']][i], c = PALETTE[i % PALETTE.length]; pg.add(`<rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="8" fill="#fff" stroke="${c}" stroke-width="1" stroke-dasharray="4 2"/>` + txt(x + 14, y + 14, 'REWARD COUPON', 4.6, { anchor: 'start', font: FONT, colour: SOFT }).replace('<text ', '<text letter-spacing="1.4" ') + emoji(e, x + 20, y + h / 2 + 3, h * 0.34) + txt(x + 36, y + h / 2 + 5, t, fitFont(t, 7.4, w - 46, 0.55), { anchor: 'start', colour: c }) + txt(x + w - 10, y + h - 9, `Awarded to ________`, 4.6, { anchor: 'end', font: FONT, colour: SOFT })); }));
  pages.push(...classGrid(paper, 'Golden time tracker', 'Everyone starts with 20 golden minutes each week. Write the minutes kept each Friday.', kids, ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'], lk));
  {
    const pg = new Page(paper, '', { bare: true });
    pg.add(`<rect x="${pg.left}" y="${pg.m}" width="${pg.width}" height="${pg.bottom - pg.m}" rx="16" fill="${lk.tint}" stroke="${lk.ring}" stroke-width="2.4"/>`);
    bubbleText(pg, 'Star of the Week', pg.w / 2, pg.m + 40, pg.width - 30, 28);
    pg.add(`<rect x="${pg.left + 30}" y="${pg.m + 56}" width="${pg.width - 60}" height="${pg.width - 60}" rx="12" fill="#fff" stroke="${lk.ring}" stroke-width="1.2" stroke-dasharray="4 2"/>` + txt(pg.w / 2, pg.m + 60 + (pg.width - 60) / 2, 'Photo or drawing here', 8, { font: FONT, colour: SOFT }));
    pg.add(txt(pg.w / 2, pg.bottom - 40, 'This week our star is', 9, { colour: INK }) + `<line x1="${pg.left + 40}" x2="${pg.right - 40}" y1="${pg.bottom - 22}" y2="${pg.bottom - 22}" stroke="${lk.ring}" stroke-width="0.8"/>` + txt(pg.w / 2, pg.bottom - 10, 'because ___________________________________', 7, { colour: SOFT }));
    for (let k = 0; k < 10; k++) { const a = (k / 10) * Math.PI * 2; pg.add(`<path d="${starPath(pg.w / 2 + Math.cos(a) * (pg.width / 2 - 14), pg.m + 56 + (pg.width - 60) / 2 + Math.sin(a) * (pg.width / 2 - 14), 4, 0.45)}" fill="${PALETTE[k % PALETTE.length]}"/>`); }
    pg.footer = () => {}; pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ Moving Up Kit (teachers)
function makeMovingUp(o, paper) {
  const kids = classNames(o), lk = edLook(o.look), { cls, teacher } = teacherBits(o);
  const next = String(o.next || '').trim().slice(0, 24);
  const pages = [seriesCover(paper, 'PRINTPALS PLUS FOR TEACHERS', cls ? `${cls}: Moving Up` : 'Moving Up Kit', next ? `Getting ready for ${next}` : 'Ready for the next class', ['🎒', '🚪', '👋', lk.corner, '⭐', '💛'], lk.ring, lk.tint, 'transition kit', ['All about me for my new teacher', 'Handover notes per child', 'Class summary for next year', 'Worries and wishes', 'Moving up certificates', 'Welcome letter'])];
  kids.forEach((n, i) => {
    const pg = new Page(paper, `Hello new teacher! I am ${n}`, { subtitle: 'Fill this in to help your new teacher get to know you. Draw yourself in the frame!', noName: true });
    const c = PALETTE[i % PALETTE.length], fh = 70;
    pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${fh * 0.8}" height="${fh}" rx="10" fill="${TINTS[i % TINTS.length]}" stroke="${c}" stroke-width="1.4"/>` + emoji(T_EMOJI[i % T_EMOJI.length], pg.left + 8, pg.y + 8, 10));
    const bx = pg.left + fh * 0.8 + 6, bw = pg.width - fh * 0.8 - 6;
    [['🎂', 'I am ___ years old'], ['🏠', 'I live with'], ['🐾', 'My pets'], ['🎨', 'My favourite thing at school']].forEach(([e, t], k) => pg.add(emoji(e, bx + 5, pg.y + 8 + k * 17, 7) + txt(bx + 12, pg.y + 10 + k * 17, t, 6, { anchor: 'start', colour: PALETTE[k] }) + `<line x1="${bx + 12}" x2="${bx + bw}" y1="${pg.y + 17 + k * 17}" y2="${pg.y + 17 + k * 17}" stroke="#d9d4ec" stroke-width="0.5"/>`));
    pg.y += fh + 8;
    const qs = [['😊', 'I am really good at'], ['🌧️', 'Something I find tricky'], ['💛', 'It helps me when'], ['🤔', 'I am a bit worried about'], ['🌟', 'I am excited about']], bh = (pg.room - 2) / qs.length;
    qs.forEach(([e, t], k) => linedBox(pg, pg.left, pg.y + k * bh, pg.width, bh - 4, t, PALETTE[(k + 2) % PALETTE.length], e));
    pages.push(pg.svg());
  });
  kids.forEach((n, i) => {
    const pg = new Page(paper, `Handover notes: ${n}`, { subtitle: `Teacher copy for ${next || 'the next teacher'}. Confidential. Keep it kind, useful and brief.`, noName: true });
    const boxes = [['📖', 'Reading level and notes'], ['🔢', 'Maths'], ['✏️', 'Writing'], ['🏥', 'Medical, allergies, needs'], ['🤝', 'Friendships (sit well with, apart from)'], ['💛', 'What helps them thrive'], ['🏠', 'Family notes'], ['🌟', 'Something wonderful about them']], bw = pg.width / 2, bh = pg.room / 4;
    boxes.forEach(([e, t], k) => linedBox(pg, pg.left + (k % 2) * bw + 1.5, pg.y + Math.floor(k / 2) * bh + 1.5, bw - 3, bh - 4, t, PALETTE[k % PALETTE.length], e));
    pages.push(pg.svg());
  });
  pages.push(...classGrid(paper, `${cls || 'Class'} summary for next year`, 'A one page picture of the class. R, W, M = reading, writing, maths: B below, E expected, G greater depth.', kids, ['R', 'W', 'M', 'SEN', 'EAL', 'Medical', 'Pupil premium', 'Notes'], lk));
  pages.push(tagsPage(paper, 'Worries and wishes', 'Each child writes or draws one worry and one wish about moving up. Pop them in a box for the new teacher!', 6, 2, (pg, x, y, w, h, i) => { pg.add(`<rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="9" fill="#fff" stroke="${PALETTE[i]}" stroke-width="1"/>` + txt(x + 12, y + 15, 'Name:', 6, { anchor: 'start', colour: PALETTE[i] }) + emoji('☁️', x + 16, y + 30, 9) + txt(x + 26, y + 32, 'My worry', 6, { anchor: 'start', colour: INK }) + emoji('🌈', x + 16, y + h / 2 + 18, 9) + txt(x + 26, y + h / 2 + 20, 'My wish', 6, { anchor: 'start', colour: INK })); }));
  {
    const pg = new Page(paper, next ? `Welcome to ${next}!` : 'Welcome to your new class!', { subtitle: 'A letter from your new teacher, to read over the summer.', noName: true });
    const lines = ['Dear friend,', '', `I am so excited to welcome you to ${next || 'our class'}. We are going to have a brilliant year together, full of stories, discoveries, games and learning.`, '', 'Over the summer, why not draw me a picture of your favourite holiday moment? I cannot wait to see it.', '', 'If you feel a little nervous, that is completely okay. Lots of people do. I will be there to help you every step of the way.', '', 'See you soon!', '', 'From your new teacher, _______________'];
    pg.add(panel(pg.left, pg.y, pg.width, pg.room - 4, lk.tint, lk.ring, 12));
    let y = pg.y + 16; lines.forEach((l) => { if (!l) { y += 5; return; } wrap(l, 50).forEach((ll) => { pg.add(txt(pg.left + 12, y, ll, 7, { anchor: 'start', colour: INK })); y += 9; }); });
    pages.push(pg.svg());
  }
  kids.forEach((n, i) => pages.push(awardPage(paper, ['🎒', 'Ready to Move Up!', `for a brilliant year${cls ? ' in ' + cls : ''}. ${next ? next + ' is lucky to have you!' : 'Your next class is lucky to have you!'}`], n, cls, teacher, PALETTE[i % PALETTE.length], TINTS[i % TINTS.length])));
  return pages;
}

// ================================================================ Class Special Person Cards (teachers)
function makeClassSpecial(o, paper) {
  const kids = classNames(o), lk = edLook(o.look), { cls } = teacherBits(o);
  const who = String(o.who || '').trim().replace(/[<>]/g, '').slice(0, 20) || 'Mum';
  const pages = [seriesCover(paper, 'PRINTPALS PLUS FOR TEACHERS', `Cards for ${who}`, cls || 'A gift from every child', ['💐', '💌', '🌷', '💛', '🎁', '⭐'], lk.ring, lk.tint, 'card set', ['A card from every child', 'Signed with their name', '4 page mini book', `All about my ${who}`, 'Class checklist', 'Kind for every family'])];
  kids.forEach((n, i) => {
    const c = PALETTE[i % PALETTE.length];
    pages.push(...foldedCard(paper, (pg, x, y, w, h) => {
      pg.add(`<rect x="${x + 8}" y="${y + 4}" width="${w - 12}" height="${h - 8}" rx="10" fill="#fff" stroke="${c}" stroke-width="1.6"/>`);
      bubbleText(pg, `For my ${who}`, x + w / 2 + 2, y + 26, w - 30, 18);
      const s = Math.min(w - 40, h - 56);
      pg.add(`<g transform="translate(${x + w / 2 + 2 - s / 2} ${y + 38}) scale(${(s / 200).toFixed(4)})">${seasonArt(i % 2 ? 'hearts' : 'sunflower')}</g>`);
    }, (pg, x, y, w, h) => {
      pg.add(txt(x + w / 2, y + 22, `Dear ${who},`, 9, { colour: c }));
      ['I love you because', 'My favourite thing we do together is', 'You are the best at'].forEach((q, k) => { pg.add(txt(x + 16, y + 40 + k * 26, q, 6.4, { anchor: 'start', colour: INK })); pg.add(`<line x1="${x + 16}" x2="${x + w - 8}" y1="${y + 50 + k * 26}" y2="${y + 50 + k * 26}" stroke="#d9d4ec" stroke-width="0.5"/><line x1="${x + 16}" x2="${x + w - 8}" y1="${y + 58 + k * 26}" y2="${y + 58 + k * 26}" stroke="#d9d4ec" stroke-width="0.5"/>`); });
      pg.add(txt(x + w / 2, y + h - 28, 'Love from', 8, { colour: c }));
      bubbleText(pg, n, x + w / 2, y + h - 8, w - 40, 16);
      pg.add(`<rect x="${pg.m + 16}" y="${y + 16}" width="${w - 32}" height="${h - 40}" rx="10" fill="#fff" stroke="${c}" stroke-width="0.8" stroke-dasharray="3 2"/>` + txt(pg.m + w / 2, y + h - 12, `Draw you and your ${who} here`, 6, { font: FONT, colour: SOFT }));
    }, `Made with love by ${n}`, '💐'));
  });
  // Mini gift book: one page per child (4 panels to cut and staple).
  kids.forEach((n, i) => pages.push(tagsPage(paper, `${possessive(n)} mini book for ${who}`, 'Cut out the four pages, put them in order and staple along the left edge.', 4, 2, (pg, x, y, w, h, k) => {
    const c = PALETTE[(i + k) % PALETTE.length], t = [`All about my ${who}`, `My ${who} always says`, `My ${who} is the best at`, `I love my ${who} because`][k];
    pg.add(`<rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="8" fill="#fff" stroke="${c}" stroke-width="1"/>`);
    if (!k) { bubbleText(pg, t, x + w / 2, y + h * 0.35, w - 20, 14); pg.add(emoji('💝', x + w / 2, y + h * 0.58, h * 0.24) + txt(x + w / 2, y + h - 14, `by ${n}`, 8, { colour: c })); }
    else { pg.add(txt(x + w / 2, y + 16, t, fitFont(t, 7.4, w - 20, 0.55), { colour: c }) + `<rect x="${x + 12}" y="${y + 22}" width="${w - 24}" height="${h * 0.45}" rx="6" fill="${TINTS[k]}" stroke="${c}" stroke-width="0.4" stroke-dasharray="2 1.5"/>`); for (let l = 0; l < 3; l++) pg.add(`<line x1="${x + 12}" x2="${x + w - 12}" y1="${y + 30 + h * 0.45 + l * 9}" y2="${y + 30 + h * 0.45 + l * 9}" stroke="#d9d4ec" stroke-width="0.5"/>`); }
  })));
  pages.push(...classGrid(paper, `${cls || 'Class'} card checklist`, 'Tick as each child finishes, so every family gets their gift.', kids, ['Card front', 'Card inside', 'Mini book', 'Wrapped', 'Sent home'], lk));
  return pages;
}

Object.assign(MAKERS, { classbirthday: makeClassBirthday, classrewards: makeClassRewards, movingup: makeMovingUp, classspecial: makeClassSpecial });
