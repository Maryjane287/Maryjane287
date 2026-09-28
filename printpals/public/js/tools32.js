// PrintPals batch 32 (Teacher toolkit 2): Class Reading Records, Phonics Check Kit, Parents' Evening Kit, Report Writing Helper.

const teacherBits = (o) => ({ cls: String(o.cls || '').trim().slice(0, 24), teacher: String(o.teacher || '').trim().slice(0, 30) });

// A class grid: names down the side, columns across, with a header row.
function classGrid(paper, title, sub, names, cols, lk, colW) {
  const pages = [];
  for (let s = 0; s < names.length; s += 25) {
    const part = names.slice(s, s + 25), pg = new Page(paper, s ? `${title} (continued)` : title, { subtitle: sub, noName: true });
    const lw = 50, cw = colW || (pg.width - lw) / cols.length, hh = 32, rh = Math.min(12, (pg.room - hh) / Math.max(part.length, 18));
    cols.forEach((c, k) => { const x = pg.left + lw + k * cw; pg.add(`<rect x="${x}" y="${pg.y}" width="${cw}" height="${hh}" fill="${TINTS[k % TINTS.length]}" stroke="#d9d4ec" stroke-width="0.3"/>` + `<text transform="translate(${x + cw / 2 + 1.6} ${pg.y + hh - 3}) rotate(-90)" font-family="${TITLE_FONT}" font-weight="800" font-size="${Math.min(5, cw * 0.62, (hh - 5) / (c.length * 0.56))}" fill="${PALETTE[k % PALETTE.length]}">${esc(c)}</text>`); });
    part.forEach((n, j) => { const y = pg.y + hh + j * rh; pg.add(`<rect x="${pg.left}" y="${y}" width="${lw}" height="${rh}" fill="${j % 2 ? '#fff' : '#faf8ff'}" stroke="#d9d4ec" stroke-width="0.3"/>` + (n ? txt(pg.left + 3, y + rh * 0.68, n, fitFont(n, 5.6, lw - 6, 0.55), { anchor: 'start', colour: INK }) : '')); cols.forEach((c, k) => pg.add(`<rect x="${pg.left + lw + k * cw}" y="${y}" width="${cw}" height="${rh}" fill="#fff" stroke="#d9d4ec" stroke-width="0.3"/>`)); });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ Class Reading Records (teachers)
function makeReadingRecords(o, paper) {
  const kids = classNames(o), lk = edLook(o.look), { cls, teacher } = teacherBits(o);
  const pages = [seriesCover(paper, 'PRINTPALS PLUS FOR TEACHERS', cls ? `${cls} Reading Records` : 'Class Reading Records', 'A reading record for every child', ['📖', '📚', '🦉', lk.corner, '⭐', '🏆'], lk.ring, lk.tint, 'class set', ['A record book per child', '8 weeks of reading', 'Class reading tracker', 'Milestone awards', 'Note for parents', `${kids.length} children, all named`])];
  kids.forEach((n, i) => {
    // Cover + 2 record pages per child (8 weeks).
    const c = PALETTE[i % PALETTE.length];
    { const pg = new Page(paper, '', { bare: true, tint: TINTS[i % TINTS.length] });
      pg.add(`<rect x="${pg.left}" y="${pg.m}" width="${pg.width}" height="${pg.bottom - pg.m}" rx="14" fill="#fff" stroke="${c}" stroke-width="2"/>` + txt(pg.w / 2, pg.m + 24, (cls || 'MY READING RECORD').toUpperCase(), 6, { font: FONT, colour: SOFT }).replace('<text ', '<text letter-spacing="2" '));
      bubbleText(pg, `${possessive(n)} Reading Record`, pg.w / 2, pg.m + 52, pg.width - 30, 22);
      pg.add(`<circle cx="${pg.w / 2}" cy="${pg.m + 110}" r="36" fill="${TINTS[i % TINTS.length]}" stroke="${c}" stroke-width="1.4"/>` + emoji(T_EMOJI[i % T_EMOJI.length], pg.w / 2, pg.m + 110, 44));
      [['Reading level or colour band', 170], ['Teacher', 186], ['Started', 202]].forEach(([l, y]) => pg.add(txt(pg.left + 24, pg.m + y, l + ':', 6.4, { anchor: 'start', colour: c }) + (l === 'Teacher' && teacher ? txt(pg.left + 60, pg.m + y, teacher, 6.4, { anchor: 'start', colour: INK }) : `<line x1="${pg.left + 24 + l.length * 3.1 + 6}" x2="${pg.right - 24}" y1="${pg.m + y + 0.6}" y2="${pg.m + y + 0.6}" stroke="#b9b3d6" stroke-width="0.5"/>`)));
      pg.add(txt(pg.w / 2, pg.bottom - 18, 'Please read together every day and write a little note. Thank you!', 5.6, { font: FONT, colour: SOFT }));
      pg.footer = () => {}; pages.push(pg.svg()); }
    for (let p = 0; p < 2; p++) {
      const pg = new Page(paper, `${possessive(n)} reading: weeks ${p * 4 + 1} to ${p * 4 + 4}`, { subtitle: 'Book title, pages read and a comment from whoever listened. Colour a star each time!', noName: true });
      const cols = [['Date', 0.13], ['Book title', 0.32], ['Pages', 0.1], ['Comment', 0.35], ['⭐', 0.1]], hh = 11, rh = (pg.room - hh) / 20;
      let x = pg.left; cols.forEach(([t, f], k) => { pg.add(`<rect x="${x}" y="${pg.y}" width="${pg.width * f}" height="${hh}" fill="${TINTS[k]}" stroke="#d9d4ec" stroke-width="0.4"/>` + txt(x + pg.width * f / 2, pg.y + 7.6, t, 5.6, { colour: PALETTE[k] })); x += pg.width * f; });
      for (let r = 0; r < 20; r++) { let xx = pg.left; const y = pg.y + hh + r * rh; cols.forEach(([t, f], k) => { pg.add(`<rect x="${xx}" y="${y}" width="${pg.width * f}" height="${rh}" fill="${Math.floor(r / 5) % 2 ? '#fff' : '#fcfbff'}" stroke="#d9d4ec" stroke-width="0.3"/>` + (k === 4 ? `<path d="${starPath(xx + pg.width * f / 2, y + rh / 2, rh * 0.32, 0.45)}" fill="#fff" stroke="${c}" stroke-width="0.6"/>` : '')); xx += pg.width * f; }); if (r % 5 === 0) pg.add(txt(pg.left - 1, y + rh * 0.66, `W${p * 4 + r / 5 + 1}`, 3.6, { anchor: 'end', font: FONT, colour: SOFT })); }
      pages.push(pg.svg());
    }
  });
  pages.push(...classGrid(paper, `${cls || 'Class'} reading tracker`, 'Tick each day a child reads at home. Count the ticks each Friday!', kids, Array.from({ length: 20 }, (_, k) => `Wk${Math.floor(k / 5) + 1} ${['M', 'T', 'W', 'T', 'F'][k % 5]}`), lk));
  // Milestone awards.
  [['📚', '25 Nights of Reading', 'for reading at home 25 times!'], ['🌟', '50 Nights of Reading', 'for reading at home 50 times!'], ['🏆', '100 Nights of Reading', 'for reading at home 100 times! Amazing!']].forEach((a) => pages.push(awardPage(paper, a, '', cls, teacher, lk.ring, lk.tint)));
  {
    const pg = new Page(paper, 'Reading at home: a note for families', { subtitle: 'Send this home with the reading record.', noName: true });
    const lines = ['Dear families,', '', 'Your child is bringing home a reading record. Please read together for 10 minutes every day and write the book, the pages and a short comment.', '', 'Reading is not a test. Snuggle up, talk about the pictures, ask what might happen next and have fun!', '', 'We celebrate 25, 50 and 100 nights of reading with a special award.', '', teacher ? `Thank you, ${teacher}` : 'Thank you, your child\'s teacher'];
    pg.add(panel(pg.left, pg.y, pg.width, pg.room - 4, lk.tint, lk.ring, 12));
    let y = pg.y + 16; lines.forEach((l) => { if (!l) { y += 5; return; } wrap(l, 50).forEach((ll) => { pg.add(txt(pg.left + 12, y, ll, 7, { anchor: 'start', colour: INK })); y += 9; }); });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ Phonics Check Kit (teachers)
const PC_SETS = { p2: { title: 'Phase 2 sounds', sounds: 's a t p i n m d g o c k ck e u r h b f l ff ll ss', tricky: 'is I the put pull full as and has his her go no to into she push he of we me be' }, p3: { title: 'Phase 3 sounds', sounds: 'j v w x y z zz qu ch sh th ng nk ai ee igh oa oo ar or ur ow oi ear air er', tricky: 'was you they my by all are sure pure said have like so do some come love were there little one when out what says here today' } };

function makePhonicsCheck(o, paper) {
  const kids = classNames(o), lk = edLook(o.look), { cls, teacher } = teacherBits(o), set = PC_SETS[o.level] || PC_SETS.p2;
  const sounds = set.sounds.split(' '), tricky = set.tricky.split(' ');
  const pages = [seriesCover(paper, 'PRINTPALS PLUS FOR TEACHERS', cls ? `${cls} Phonics Check` : 'Phonics Check Kit', set.title, sounds.slice(0, 6), lk.ring, lk.tint, 'assessment kit', ['Child sound card', 'Record sheet per child', 'Tricky word check', 'Class results grid', 'Sounds I know award', 'Check 3 times a year'])];
  // Child-facing sound card (big).
  const card = (title, list, fs) => { const pg = new Page(paper, title, { subtitle: 'The child reads from this card. Point to each one. Laminate it and use it all year!', noName: true }); const cols = 5, cw = pg.width / cols, rows = Math.ceil(list.length / cols), ch = Math.min(34, pg.room / rows); list.forEach((s, k) => { const x = pg.left + (k % cols) * cw, y = pg.y + Math.floor(k / cols) * ch; pg.add(panel(x + 2, y + 2, cw - 4, ch - 4, '#fff', PALETTE[k % PALETTE.length], 8) + txt(x + cw / 2, y + ch * 0.64, s, fitFont(s, fs, cw - 10, 0.56), { colour: INK })); }); return pg.svg(); };
  pages.push(card(`Sound card: ${set.title}`, sounds, 16), card('Tricky word card', tricky, 10));
  kids.forEach((n, i) => {
    const pg = new Page(paper, `${possessive(n)} phonics check`, { subtitle: 'Tick the sounds and words read correctly. Use a different colour pen for each term.', noName: true });
    pg.add(txt(pg.left, pg.y + 4, 'Term:', 5.6, { anchor: 'start', colour: lk.ring }) + ['Autumn', 'Spring', 'Summer'].map((t, k) => `<rect x="${pg.left + 20 + k * 36}" y="${pg.y - 2}" width="8" height="8" rx="2" fill="#fff" stroke="${PALETTE[k]}" stroke-width="0.8"/>` + txt(pg.left + 31 + k * 36, pg.y + 4, t, 5.4, { anchor: 'start', font: FONT, colour: INK })).join('') + txt(pg.right, pg.y + 4, 'Date: ____________', 5.4, { anchor: 'end', font: FONT, colour: SOFT }));
    pg.y += 12;
    const grid = (list, label, cols) => { pg.add(txt(pg.left, pg.y + 4, label, 6.4, { anchor: 'start', colour: lk.ring })); pg.y += 8; const cw = pg.width / cols, ch = 13; list.forEach((s, k) => { const x = pg.left + (k % cols) * cw, y = pg.y + Math.floor(k / cols) * ch; pg.add(`<rect x="${x + 1}" y="${y + 1}" width="${cw - 2}" height="${ch - 2}" rx="3" fill="#fff" stroke="#d9d4ec" stroke-width="0.5"/>` + txt(x + 4, y + ch * 0.66, s, fitFont(s, 7, cw - 18, 0.56), { anchor: 'start', colour: INK }) + `<rect x="${x + cw - 11}" y="${y + ch / 2 - 3.5}" width="7" height="7" rx="1.5" fill="#fff" stroke="${PALETTE[k % PALETTE.length]}" stroke-width="0.6"/>`); }); pg.y += Math.ceil(list.length / cols) * ch + 8; };
    grid(sounds, `Sounds (${sounds.length})`, 6); grid(tricky, `Tricky words (${tricky.length})`, 5);
    const bh = pg.bottom - 4 - pg.y;
    if (bh > 20) { pg.add(panel(pg.left, pg.y, pg.width, bh, lk.tint, lk.ring, 9) + txt(pg.left + 8, pg.y + 10, 'Score:     sounds _____ / ' + sounds.length + '      tricky words _____ / ' + tricky.length, 6, { anchor: 'start', colour: INK }) + txt(pg.left + 8, pg.y + 20, 'Next steps:', 6, { anchor: 'start', colour: lk.ring })); }
    pages.push(pg.svg());
  });
  pages.push(...classGrid(paper, `${cls || 'Class'} phonics results`, 'Write each child\'s score each term. Highlight anyone who needs a little extra help.', kids, ['Aut sounds', 'Aut tricky', 'Spr sounds', 'Spr tricky', 'Sum sounds', 'Sum tricky', 'Group', 'Notes'], lk));
  kids.forEach((n, i) => pages.push(awardPage(paper, ['🔤', 'Sounds Superstar', `for learning so many ${set.title.toLowerCase()}!`], n, cls, teacher, PALETTE[i % PALETTE.length], TINTS[i % TINTS.length])));
  return pages;
}

// ================================================================ Parents' Evening Kit (teachers)
function makeParentsEvening(o, paper) {
  const kids = classNames(o), lk = edLook(o.look), { cls, teacher } = teacherBits(o);
  const pages = [seriesCover(paper, 'PRINTPALS PLUS FOR TEACHERS', cls ? `${cls} Parents' Evening` : "Parents' Evening Kit", 'Calm, organised, personal', ['🗓️', '☕', '💬', lk.corner, '⭐', '🤝'], lk.ring, lk.tint, 'meeting kit', ['Invitation letter', 'Booking slots', 'Questions from families', 'A meeting sheet per child', 'Next steps slips', 'Door sign'])];
  {
    const pg = new Page(paper, "You're invited to parents' evening!", { subtitle: 'Send one home with every child.', noName: true });
    const lines = ['Dear families,', '', `We would love to see you at parents' evening to talk about how your child is getting on${cls ? ' in ' + cls : ''}.`, '', 'Date: ____________________     Times: ____________________', '', 'Please choose a time on the booking sheet or write your preferred time below, and fill in the questions page if there is anything you would like to talk about.', '', 'Preferred time: ______________________________', '', 'Child\'s name: _______________________________', '', teacher ? `See you soon! ${teacher}` : 'See you soon!'];
    pg.add(panel(pg.left, pg.y, pg.width, pg.room - 4, lk.tint, lk.ring, 12));
    let y = pg.y + 16; lines.forEach((l) => { if (!l) { y += 5; return; } wrap(l, 52).forEach((ll) => { pg.add(txt(pg.left + 12, y, ll, 7, { anchor: 'start', colour: INK })); y += 9; }); });
    pages.push(pg.svg());
  }
  {
    const pg = new Page(paper, 'Booking slots', { subtitle: 'Write the times down the side. Families write their child\'s name in a free slot.', noName: true });
    const rows = 20, rh = pg.room / rows;
    for (let r = 0; r < rows; r++) { const y = pg.y + r * rh; pg.add(`<rect x="${pg.left}" y="${y}" width="36" height="${rh}" fill="${TINTS[r % 2]}" stroke="#d9d4ec" stroke-width="0.4"/><rect x="${pg.left + 36}" y="${y}" width="${pg.width - 36}" height="${rh}" fill="#fff" stroke="#d9d4ec" stroke-width="0.4"/>` + txt(pg.left + 18, y + rh * 0.66, '__:__', 6, { colour: SOFT })); }
    pages.push(pg.svg());
  }
  {
    const pg = new Page(paper, 'Before we meet: questions from home', { subtitle: 'Please fill this in and send it back. It helps us make the most of our time together.', noName: true });
    const qs = [['😊', 'What does your child enjoy about school?'], ['🌧️', 'Is anything worrying your child or you?'], ['🏠', 'What is your child proud of at home?'], ['❓', 'Questions you would like to ask']], bh = (pg.room - 16) / 4;
    pg.add(txt(pg.left, pg.y + 6, "Child's name: ____________________________", 6.6, { anchor: 'start', colour: lk.ring })); pg.y += 14;
    qs.forEach(([e, t], k) => linedBox(pg, pg.left, pg.y + k * bh, pg.width, bh - 4, t, PALETTE[k], e));
    pages.push(pg.svg());
  }
  kids.forEach((n, i) => {
    const pg = new Page(paper, `Meeting notes: ${n}`, { subtitle: 'Teacher copy. Start with a strength, share one next step, and end with something to celebrate.', noName: true });
    const boxes = [['🌟', 'Strengths and lovely moments'], ['📚', 'Reading'], ['🔢', 'Maths'], ['✏️', 'Writing'], ['💛', 'Friendships and wellbeing'], ['🎯', 'Next steps'], ['🏠', 'How families can help'], ['💬', 'Family comments']], bw = pg.width / 2, bh = pg.room / 4;
    boxes.forEach(([e, t], k) => linedBox(pg, pg.left + (k % 2) * bw + 1.5, pg.y + Math.floor(k / 2) * bh + 1.5, bw - 3, bh - 4, t, PALETTE[k % PALETTE.length], e));
    pages.push(pg.svg());
  });
  pages.push(tagsPage(paper, 'Next steps slips', 'Fill one in for each family to take home. Short, clear and kind.', 6, 2, (pg, x, y, w, h, i) => { pg.add(`<rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="9" fill="#fff" stroke="${PALETTE[i]}" stroke-width="1"/>` + txt(x + 12, y + 16, 'Name:', 6, { anchor: 'start', colour: PALETTE[i] }) + txt(x + 12, y + 30, '⭐ We are proud of:', 5.8, { anchor: 'start', colour: INK }) + txt(x + 12, y + 50, '🎯 Next step:', 5.8, { anchor: 'start', colour: INK }) + txt(x + 12, y + 70, '🏠 At home you could:', 5.8, { anchor: 'start', colour: INK })); [16, 36, 56, 76].forEach((yy) => pg.add(`<line x1="${x + 12}" x2="${x + w - 12}" y1="${y + yy + 5}" y2="${y + yy + 5}" stroke="#d9d4ec" stroke-width="0.45"/>`)); }));
  {
    const pg = new Page(paper, '', { bare: true });
    pg.add(`<rect x="${pg.left}" y="${pg.m}" width="${pg.width}" height="${pg.bottom - pg.m}" rx="16" fill="${lk.tint}" stroke="${lk.ring}" stroke-width="2.4"/>` + emoji('☕', pg.w / 2, pg.m + 60, 50));
    bubbleText(pg, 'Welcome!', pg.w / 2, pg.m + 130, pg.width - 40, 34);
    pg.add(txt(pg.w / 2, pg.m + 156, "Parents' evening", 12, { colour: lk.ring }) + txt(pg.w / 2, pg.m + 174, cls || 'Our class', 10, { colour: INK }) + (teacher ? txt(pg.w / 2, pg.m + 190, teacher, 9, { colour: SOFT }) : '') + txt(pg.w / 2, pg.bottom - 30, 'Please take a seat. We will be with you soon', 8, { colour: INK }));
    pg.footer = () => {}; pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ Report Writing Helper (teachers)
const REPORT_BANK = {
  'Attitude and effort': ['{n} is a kind and thoughtful member of our class.', '{n} works hard and always tries their best.', '{n} is enthusiastic and brings great energy to our lessons.', '{n} is growing in confidence every week.', '{n} listens carefully and follows instructions well.', '{n} keeps trying, even when things are tricky.'],
  'Reading': ['{n} reads with growing fluency and expression.', '{n} loves sharing books and talking about stories.', '{n} uses phonics well to work out new words.', '{n} would benefit from reading aloud at home every day.', '{n} can answer questions about what they have read.'],
  'Writing': ['{n} writes with imagination and interesting ideas.', '{n} is using capital letters and full stops more consistently.', '{n} forms letters carefully and neatly.', '{n} is beginning to use describing words to add detail.', '{n} could now focus on writing longer sentences.'],
  'Maths': ['{n} is confident with numbers and counting.', '{n} enjoys solving problems and explaining their thinking.', '{n} is becoming quicker at adding and taking away.', '{n} would benefit from practising number bonds at home.', '{n} uses practical equipment well to help them.'],
  'Friendships': ['{n} is a caring friend and plays well with others.', '{n} includes others in games and is a great team player.', '{n} is learning to share and take turns.', '{n} is always ready to help a friend.'],
  'Next steps': ['Next, {n} will work on reading longer books with confidence.', 'Next, {n} will practise writing sentences independently.', 'Next, {n} will learn number bonds to 10 by heart.', 'Next, {n} will build confidence in sharing ideas with the class.', 'Next, {n} will focus on presenting work neatly.'],
};

function makeReportHelper(o, paper) {
  const kids = classNames(o), lk = edLook(o.look), { cls, teacher } = teacherBits(o);
  const pages = [seriesCover(paper, 'PRINTPALS PLUS FOR TEACHERS', cls ? `${cls} Reports` : 'Report Writing Helper', 'Warm, personal reports, faster', ['📋', '✍️', '💬', lk.corner, '⭐', '🌈'], lk.ring, lk.tint, 'report kit', ['Comment bank by subject', 'A report page per child', 'Pupil voice page', 'Class progress overview', 'Warm, positive wording', 'Easy to copy onto forms'])];
  // Comment bank (with the placeholder shown as "Name").
  {
    const entries = Object.entries(REPORT_BANK);
    for (let p = 0; p < entries.length; p += 3) {
      const pg = new Page(paper, p ? 'Comment bank (continued)' : 'Comment bank', { subtitle: 'Tick the comments that fit, then personalise. Always start and end with something positive!', noName: true });
      entries.slice(p, p + 3).forEach(([subj, list], k) => { const c = PALETTE[(p + k) % PALETTE.length]; pg.add(txt(pg.left, pg.y + 6, subj, 7.4, { anchor: 'start', colour: c })); pg.y += 15; list.forEach((l) => { const t = l.replace(/\{n\}/g, 'Name'); pg.add(`<rect x="${pg.left}" y="${pg.y - 4.4}" width="5" height="5" rx="1" fill="#fff" stroke="${c}" stroke-width="0.6"/>` + txt(pg.left + 8, pg.y, t, fitFont(t, 6, pg.width - 10, 0.5), { anchor: 'start', font: FONT, weight: 700, colour: INK })); pg.y += 8.2; }); pg.y += 6; });
      pages.push(pg.svg());
    }
  }
  kids.forEach((n, i) => {
    const pg = new Page(paper, `Report notes: ${n}`, { subtitle: `${cls ? cls + '. ' : ''}Circle a level for each area, then write your comment. Suggested openings are filled in for you.`, noName: true });
    const areas = ['Attitude and effort', 'Reading', 'Writing', 'Maths', 'Friendships'], bh = (pg.room - 44) / areas.length;
    areas.forEach((a, k) => { const y = pg.y + k * bh, c = PALETTE[k], opener = REPORT_BANK[a][i % REPORT_BANK[a].length].replace(/\{n\}/g, n); pg.add(panel(pg.left, y + 1.5, pg.width, bh - 3, '#fff', c, 8) + txt(pg.left + 7, y + 10, a, 6.4, { anchor: 'start', colour: c }) + ['Towards', 'Expected', 'Greater depth'].map((l, j) => txt(pg.right - 104 + j * 32, y + 10, l, 4.8, { anchor: 'start', font: FONT, colour: SOFT }) + `<circle cx="${pg.right - 107 + j * 32}" cy="${y + 8.4}" r="2" fill="#fff" stroke="${c}" stroke-width="0.6"/>`).join('') + txt(pg.left + 7, y + 19, opener, fitFont(opener, 5.8, pg.width - 14, 0.5), { anchor: 'start', font: FONT, weight: 700, colour: '#6b6590' })); for (let ly = y + 26; ly < y + bh - 4; ly += 8) pg.add(`<line x1="${pg.left + 7}" x2="${pg.right - 7}" y1="${ly}" y2="${ly}" stroke="#e2ddf2" stroke-width="0.45"/>`); });
    pg.y += areas.length * bh + 4;
    const ns = REPORT_BANK['Next steps'][i % REPORT_BANK['Next steps'].length].replace(/\{n\}/g, n);
    pg.add(panel(pg.left, pg.y, pg.width, 38, lk.tint, lk.ring, 9) + txt(pg.left + 7, pg.y + 10, '🎯 Next steps', 6.4, { anchor: 'start', colour: lk.ring }) + txt(pg.left + 7, pg.y + 19, ns, fitFont(ns, 5.8, pg.width - 14, 0.5), { anchor: 'start', font: FONT, weight: 700, colour: '#6b6590' }) + `<line x1="${pg.left + 7}" x2="${pg.right - 7}" y1="${pg.y + 28}" y2="${pg.y + 28}" stroke="#d9d4ec" stroke-width="0.45"/>`);
    pages.push(pg.svg());
  });
  // Pupil voice, one per child.
  kids.forEach((n, i) => {
    const pg = new Page(paper, `${possessive(n)} year so far`, { subtitle: 'Your ideas matter! Draw and write about your learning. Your teacher will read every word.', noName: true });
    const qs = [['😊', 'I am proud of'], ['🎨', 'My favourite thing we did'], ['🧠', 'I got better at'], ['🎯', 'Next I want to learn'], ['🤝', 'A friend who helped me']], bh = pg.room * 0.72 / qs.length;
    qs.forEach(([e, t], k) => linedBox(pg, pg.left, pg.y + k * bh, pg.width, bh - 4, t, PALETTE[k], e));
    pg.y += qs.length * bh + 2;
    pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="${pg.room - 4}" rx="10" fill="#fff" stroke="${PALETTE[5]}" stroke-width="0.8" stroke-dasharray="3 2"/>` + txt(pg.left + 8, pg.y + 10, 'Draw yourself learning!', 6, { anchor: 'start', colour: PALETTE[5] }));
    pages.push(pg.svg());
  });
  pages.push(...classGrid(paper, `${cls || 'Class'} progress overview`, 'W = working towards, E = expected, G = greater depth. A quick picture of the whole class.', kids, ['Reading', 'Writing', 'Maths', 'Phonics', 'Science', 'PE', 'Art', 'Effort', 'Notes'], lk));
  return pages;
}

Object.assign(MAKERS, { readingrecords: makeReadingRecords, phonicscheck: makePhonicsCheck, parentsevening: makeParentsEvening, reporthelper: makeReportHelper });
