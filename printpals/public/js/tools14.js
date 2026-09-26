// PrintPals batch 14: party invitations, countdown calendar, tooth brushing chart, family rules poster,
// babysitter info sheet, kitchen science and a letter writing kit. Two more Plus storybooks.

// ================================================================ party invitations
function makeInvites(o, paper) {
  const name = nameOf(o.name, '');
  const age = parseInt(o.age, 10);
  const bright = o.style !== 'colour';
  const theme = { balloons: ['balloon', 'present', 'cake', 'popper'], animals: ['lion', 'monkey', 'zebra', 'pig'], sweet: ['cupcake', 'donut', 'lolly', 'cookie'] }[o.theme] || ['balloon', 'present', 'cake', 'popper'];
  const lineArt = { balloons: ['cake', 'cake', 'cake', 'cake'], animals: ['elephant', 'giraffe', 'dog', 'cat'], sweet: ['icecream', 'cake', 'icecream', 'cake'] }[o.theme] || ['cake', 'cake', 'cake', 'cake'];
  const rows = [['Date', o.date], ['Time', o.time], ['Where', o.place], ['Please reply to', o.rsvp]];
  const pg = new Page(paper, '', { bare: true });
  const cw = pg.width / 2, ch = (pg.bottom - pg.m) / 2;
  for (let i = 0; i < 4; i++) {
    const x = pg.left + (i % 2) * cw, y = pg.m + Math.floor(i / 2) * ch, c = PALETTE[(i * 2) % PALETTE.length], cx = x + cw / 2;
    pg.add(`<rect x="${x + 2}" y="${y + 2}" width="${cw - 4}" height="${ch - 4}" rx="10" fill="${bright ? TINTS[(i * 2) % TINTS.length] : '#fff'}" stroke="${bright ? c : INK}" stroke-width="1" stroke-dasharray="3 2"/>`);
    for (let s = 0; s < 7; s++) pg.add(`<path d="${starPath(x + 12 + s * (cw - 24) / 6, y + 9, 2.2, 0.45)}" fill="${bright ? PALETTE[s % PALETTE.length] : '#fff'}" stroke="${bright ? 'none' : INK}" stroke-width="0.4"/>`);
    if (bright) pg.add(pic(ART(theme[i]), cx, y + 30, 30));
    else pg.add(`<g transform="translate(${cx - 16} ${y + 14}) scale(0.16)">${colouringArt(lineArt[i])}</g>`);
    pg.add(txt(cx, y + 56, 'You\'re invited!', 9, { colour: bright ? c : INK }));
    const sub = name ? `to ${possessive(name)} ${age > 0 && age < 20 ? ordinal(age) + ' ' : ''}birthday party` : `to a birthday party`;
    pg.add(txt(cx, y + 64, sub, fitFont(sub, 5, cw - 14, 0.5), { font: FONT, colour: INK }));
    rows.forEach(([lab, val], k) => {
      const ry = y + 74 + k * 11, v = String(val || '').trim().slice(0, 34);
      pg.add(txt(x + 9, ry, lab, 3.8, { anchor: 'start', font: FONT, colour: SOFT }));
      pg.add(`<line x1="${x + 9 + lab.length * 2.2 + 3}" x2="${x + cw - 9}" y1="${ry + 0.6}" y2="${ry + 0.6}" stroke="#c9c3e3" stroke-width="0.4"/>`);
      if (v) pg.add(txt(x + 9 + lab.length * 2.2 + 5, ry - 0.6, v, fitFont(v, 4.4, cw - 30 - lab.length * 2.2, 0.5), { anchor: 'start', colour: INK }));
    });
  }
  pg.footer = () => {};
  return [pg.svg()];
}

// ================================================================ countdown calendar
const COUNT_OCCASIONS = { christmas: ['Christmas', '🎄'], eid: ['Eid', '🌙'], diwali: ['Diwali', '🪔'], birthday: ['my birthday', '🎂'], holiday: ['our holiday', '🏖️'], newyear: ['New Year', '🎆'] };
const COUNT_IDEAS = ['Make a card for someone special', 'Sing a song together', 'Read a story by torchlight', 'Do something kind for a neighbour', 'Draw a picture of the big day', 'Make paper decorations',
  'Have a dance party', 'Call someone you love', 'Write a thank you note', 'Build a blanket fort', 'Look at old family photos', 'Play a board game', 'Make a paper crown', 'Go for a walk and spot lights',
  'Help cook dinner', 'Give a toy to someone who needs it', 'Tell each other jokes', 'Play I spy', 'Make a gift for someone', 'Tidy a room as a surprise', 'Have a cosy film night', 'Bake something yummy',
  'Share three things you are thankful for', 'Get a big family hug'];

function makeCountdown(o, paper) {
  const rand = rng(+o.seed || 1);
  const custom = String(o.custom || '').trim().slice(0, 24);
  const [occ, e] = o.occasion === 'custom' && custom ? [custom, '⭐'] : (COUNT_OCCASIONS[o.occasion] || COUNT_OCCASIONS.christmas);
  const n = [7, 12, 24].includes(+o.days) ? +o.days : 24;
  const ideas = o.ideas !== false ? shuffle(COUNT_IDEAS, rand).slice(0, n) : [];
  const pg = new Page(paper, `Counting down to ${occ}!`, { subtitle: ideas.length ? 'Each day, do the little activity together, then colour the box.' : 'Colour a box every day. When they are all coloured, the big day is here!' });
  const cols = n === 7 ? 2 : n === 12 ? 3 : 4, rows = Math.ceil(n / cols);
  const cw = pg.width / cols, ch = (pg.room - 2) / rows, fs = n === 24 ? 4.2 : n === 12 ? 5.4 : 6.6;
  const order = shuffle([...Array(n).keys()], rand);
  order.forEach((d, i) => {
    const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch, c = PALETTE[d % PALETTE.length];
    pg.add(`<rect x="${x + 2}" y="${y + 2}" width="${cw - 4}" height="${ch - 4}" rx="6" fill="${TINTS[d % TINTS.length]}" stroke="${c}" stroke-width="0.9"/>`);
    pg.add(txt(x + 9, y + 12, d + 1, 9, { anchor: 'start', colour: c }));
    if (d === n - 1) pg.add(emoji(e, x + cw / 2, y + ch / 2 + 2, Math.min(cw, ch) * 0.4));
    else if (ideas.length) textLines(pg, wrap(ideas[d], Math.floor((cw - 10) / (fs * 0.55))), x + cw / 2, y + ch * 0.46, fs, { anchor: 'middle', font: FONT, weight: 700 });
    else pg.add(`<path d="${starPath(x + cw / 2, y + ch / 2 + 2, Math.min(cw, ch) * 0.22, 0.45)}" fill="#fff" stroke="${c}" stroke-width="0.8"/>`);
  });
  return [pg.svg()];
}

// ================================================================ tooth brushing chart
function makeTeeth(o, paper) {
  const name = nameOf(o.name, '');
  const pages = [];
  const pg = new Page(paper, name ? `${possessive(name)} tooth brushing chart` : 'My tooth brushing chart', { subtitle: 'Brush for two minutes every morning and every night. Colour a tooth each time!', noName: !!name });
  const cols = 4, rows = 8, cw = pg.width / cols;
  for (let c = 0; c < cols; c++) [['☀️', 0], ['🌙', 1]].forEach(([em, k]) => pg.add(emoji(em, pg.left + c * cw + 22 + k * (cw - 28) / 2 + (cw - 28) / 4, pg.y + 5, 7)));
  pg.y += 11;
  const ch = (pg.room - 2) / rows;
  for (let d = 0; d < 31; d++) {
    const x = pg.left + (d % cols) * cw, y = pg.y + Math.floor(d / cols) * ch, c = PALETTE[d % PALETTE.length];
    pg.add(`<rect x="${x + 1.5}" y="${y + 1.5}" width="${cw - 3}" height="${ch - 3}" rx="5" fill="${TINTS[d % TINTS.length]}"/>` + txt(x + 7, y + ch / 2 + 2, d + 1, 5.4, { colour: c }));
    [0, 1].forEach((k) => {
      const tx = x + 22 + k * (cw - 28) / 2 + (cw - 28) / 4;
      pg.add(`<path d="M${tx - 5} ${y + ch / 2 - 5} Q${tx - 6} ${y + ch / 2 - 9} ${tx - 2} ${y + ch / 2 - 8} Q${tx} ${y + ch / 2 - 7} ${tx + 2} ${y + ch / 2 - 8} Q${tx + 6} ${y + ch / 2 - 9} ${tx + 5} ${y + ch / 2 - 5} Q${tx + 4} ${y + ch / 2 + 2} ${tx + 3} ${y + ch / 2 + 7} Q${tx + 1} ${y + ch / 2 + 8} ${tx} ${y + ch / 2 + 2} Q${tx - 1} ${y + ch / 2 + 8} ${tx - 3} ${y + ch / 2 + 7} Q${tx - 4} ${y + ch / 2 + 2} ${tx - 5} ${y + ch / 2 - 5} Z" fill="#fff" stroke="${c}" stroke-width="0.7"/>`);
    });
  }
  const bx = pg.left + 3 * cw, by = pg.y + 7 * ch;
  pg.add(pic(ART('medal'), bx + cw / 2, by + ch / 2, ch * 0.8));
  pages.push(pg.svg());
  if (o.guide !== false) {
    const p2 = new Page(paper, 'How to brush my teeth', { subtitle: 'Sing a song or count slowly while you brush. Two minutes makes a super smile!' });
    const steps = [['🪥', 'A pea sized blob of toothpaste'], ['⬆️', 'Brush the top teeth in little circles'], ['⬇️', 'Brush the bottom teeth in little circles'], ['😁', 'Brush the fronts, the backs and the chewing tops'], ['👅', 'Give your tongue a gentle brush'], ['💦', 'Spit out the toothpaste. Do not rinse!'], ['⭐', 'Colour your chart. Super smile!']];
    const rh = (p2.room - 2) / steps.length;
    steps.forEach(([e2, t], i) => { const y = p2.y + i * rh, c = PALETTE[i % PALETTE.length]; p2.add(panel(p2.left, y + 1, p2.width, rh - 2, TINTS[i % TINTS.length], c, 8) + `<circle cx="${p2.left + 10}" cy="${y + rh / 2}" r="5.5" fill="${c}"/>` + txt(p2.left + 10, y + rh / 2 + 2.2, i + 1, 6, { colour: '#fff' }) + emoji(e2, p2.left + 30, y + rh / 2, rh * 0.55) + txt(p2.left + 46, y + rh / 2 + 2.4, t, fitFont(t, 7, p2.width - 52, 0.5), { anchor: 'start', colour: INK })); });
    pages.push(p2.svg());
  }
  return pages;
}

// ================================================================ family rules poster
const FAMILY_RULES = ['We say please and thank you', 'We use kind words', 'We tell the truth', 'We help each other', 'We say sorry and forgive', 'We try new things', 'We share and take turns', 'We laugh a lot', 'We hug often', 'We love each other, always'];

function makeFamilyRules(o, paper) {
  const fam = String(o.family || '').trim().slice(0, 24);
  const rules = (listOf(o.rules, 12).length ? listOf(o.rules, 12) : FAMILY_RULES).map((r) => r.slice(0, 44));
  const bright = o.style !== 'colour';
  const pg = new Page(paper, '', { bare: true, tint: bright ? '#fffdf8' : '#fff' });
  pg.add(`<rect x="${pg.left - 3}" y="${pg.m - 3}" width="${pg.width + 6}" height="${pg.bottom - pg.m + 3}" rx="14" fill="none" stroke="${bright ? '#ff7eb6' : INK}" stroke-width="1.4"/>`);
  ['heart', 'star', 'star', 'heart'].forEach((a, i) => pg.add(bright ? pic(ART(a), i % 2 ? pg.right - 9 : pg.left + 9, i < 2 ? pg.m + 9 : pg.bottom - 11, 13) : `<path d="${starPath(i % 2 ? pg.right - 9 : pg.left + 9, i < 2 ? pg.m + 9 : pg.bottom - 11, 5, 0.45)}" fill="#fff" stroke="${INK}" stroke-width="0.6"/>`));
  pg.add(txt(pg.w / 2, pg.m + 24, fam ? `The ${fam} family` : 'In our family', 11, { colour: bright ? '#8a3fd1' : INK }));
  bubbleText(pg, fam ? 'Rules' : 'We...', pg.w / 2, pg.m + 50, pg.width - 60, 26);
  const top = pg.m + 62, rh = Math.min(22, (pg.bottom - 18 - top) / rules.length);
  rules.forEach((r, i) => {
    const y = top + i * rh, c = PALETTE[i % PALETTE.length];
    pg.add(bright ? `<path d="${starPath(pg.left + 18, y + rh / 2, 4.2, 0.45)}" fill="${c}"/>` : `<path d="${starPath(pg.left + 18, y + rh / 2, 4.2, 0.45)}" fill="#fff" stroke="${INK}" stroke-width="0.6"/>`);
    pg.add(txt(pg.left + 28, y + rh / 2 + 2.4, r, fitFont(r, 8, pg.width - 40, 0.5), { anchor: 'start', colour: bright ? c : INK }));
  });
  pg.footer = () => {};
  return [pg.svg()];
}

// ================================================================ babysitter and grandparent info sheet
function makeSitter(o, paper) {
  const name = nameOf(o.name, '');
  const v = (k) => String(o[k] || '').trim().slice(0, 60);
  const pg = new Page(paper, name ? `Looking after ${name}` : 'Looking after our child', { subtitle: 'Everything a babysitter, grandparent or friend needs to know. Keep it on the fridge.', noName: true });
  const blocks = [
    ['Allergies and medicines', v('allergies'), '#ff6b6b', 2], ['Bedtime and naps', v('bedtime'), '#6c8cff', 2], ['Food they love (and will not eat)', v('food'), '#ffb938', 2],
    ['What calms them when they are upset', v('calm'), '#3fbfa8', 2], ['Favourite games, toys and shows', v('fun'), '#b06cff', 2], ['House rules', v('rules'), '#ff7eb6', 2],
  ];
  const cw = pg.width / 2, bh = (pg.room - 70) / 3;
  blocks.forEach(([t, val, c, n], i) => {
    const x = pg.left + (i % 2) * cw, y = pg.y + Math.floor(i / 2) * bh;
    pg.add(panel(x + 1.5, y + 1.5, cw - 3, bh - 3, '#fff', c, 7) + txt(x + 7, y + 10, t, fitFont(t, 5, cw - 14, 0.5), { anchor: 'start', colour: c }));
    if (val) textLines(pg, wrap(val, 30), x + 7, y + 20, 5, { weight: 700 });
    else for (let l = 1; l <= 3; l++) pg.add(`<line x1="${x + 7}" x2="${x + cw - 7}" y1="${y + 12 + l * (bh - 18) / 3.4}" y2="${y + 12 + l * (bh - 18) / 3.4}" stroke="#c9c3e3" stroke-width="0.4"/>`);
  });
  const ey = pg.y + 3 * bh + 2;
  pg.add(panel(pg.left, ey, pg.width, pg.bottom - ey - 2, '#fff0f0', '#ff4d4d', 8) + txt(pg.left + 7, ey + 10, 'In an emergency', 6.4, { anchor: 'start', colour: '#e03c3c' }) + emoji('📞', pg.right - 12, ey + 9, 9));
  [['Parent', 'Phone'], ['Second contact', 'Phone'], ['Doctor', 'Phone'], ['Our address', '']].forEach(([a, b], i) => {
    const y = ey + 22 + i * 11;
    pg.add(txt(pg.left + 7, y, a, 4.6, { anchor: 'start', font: FONT, colour: SOFT }) + `<line x1="${pg.left + 38}" x2="${b ? pg.left + pg.width * 0.58 : pg.right - 7}" y1="${y + 0.6}" y2="${y + 0.6}" stroke="#b9b3d6" stroke-width="0.4"/>`);
    if (b) pg.add(txt(pg.left + pg.width * 0.61, y, b, 4.6, { anchor: 'start', font: FONT, colour: SOFT }) + `<line x1="${pg.left + pg.width * 0.61 + 13}" x2="${pg.right - 7}" y1="${y + 0.6}" y2="${y + 0.6}" stroke="#b9b3d6" stroke-width="0.4"/>`);
  });
  return [pg.svg()];
}

// ================================================================ kitchen science
const SCIENCE = {
  float: { title: 'Sink or float?', need: [['🥣', 'A big bowl of water'], ['🍎', 'An apple'], ['🥄', 'A spoon'], ['🍃', 'A leaf'], ['🪙', 'A coin'], ['🧸', 'A small toy']], steps: ['Fill the bowl with water.', 'Before each one, guess: will it sink or float?', 'Gently put it in the water and watch.', 'Tick what really happened.'], why: 'Heavy things for their size sink. Things with lots of air inside, like an apple, float.', table: ['An apple', 'A spoon', 'A leaf', 'A coin', 'A small toy', 'Something you choose'] },
  raisins: { title: 'Dancing raisins', need: [['🥛', 'A clear glass'], ['🫧', 'Fizzy water'], ['🍇', 'A few raisins']], steps: ['Fill the glass with fizzy water.', 'Drop in six raisins.', 'Watch closely for one minute.', 'Count how many raisins dance up and down!'], why: 'Bubbles stick to the wrinkly raisins and lift them up. At the top the bubbles pop, and the raisins sink again.' },
  walking: { title: 'Walking water', need: [['🥛', 'Three clear cups'], ['💧', 'Water'], ['🎨', 'Red and blue food colouring'], ['🧻', 'Kitchen roll']], steps: ['Put the cups in a row. Half fill the two end cups with water.', 'Add red colouring to one end cup and blue to the other.', 'Fold two strips of kitchen roll. Make bridges from each end cup to the middle cup.', 'Wait and watch. Check again after an hour!'], why: 'Water climbs up the tiny gaps in the paper. The colours meet in the middle cup and mix to make purple.' },
  volcano: { title: 'Fizzing volcano', need: [['🥛', 'A cup on a tray'], ['🧂', '2 spoons of bicarbonate of soda'], ['🍶', 'Some vinegar'], ['🧴', 'A squirt of washing up liquid'], ['🎨', 'Red food colouring']], steps: ['Put the cup on a tray. A grown-up helps with this one!', 'Add the bicarbonate of soda, washing up liquid and colouring.', 'Pour in the vinegar.', 'Stand back and watch it fizz!'], why: 'Vinegar and bicarbonate of soda make a gas called carbon dioxide. The bubbles push the foam up and over, like a volcano.' },
  pepper: { title: 'Magic pepper', need: [['🍽️', 'A plate'], ['💧', 'Water'], ['🧂', 'Ground pepper'], ['🧼', 'A little soap or washing up liquid']], steps: ['Pour a little water onto the plate.', 'Sprinkle pepper all over the water.', 'Put a dot of soap on your fingertip.', 'Touch the middle of the water and watch!'], why: 'Soap breaks the stretchy skin on top of the water, so the pepper rushes away to the edges.' },
  ice: { title: 'Ice melting race', need: [['🧊', 'Three ice cubes'], ['🍽️', 'Three plates'], ['🧂', 'Salt'], ['🍬', 'Sugar']], steps: ['Put one ice cube on each plate.', 'Sprinkle salt on one, sugar on another, and nothing on the third.', 'Guess which will melt first.', 'Check every five minutes. Which one won?'], why: 'Salt makes ice melt faster. That is why salt is put on icy roads in winter.' },
};

function makeScience(o, paper) {
  const ex = SCIENCE[o.experiment] || SCIENCE.float;
  const pg = new Page(paper, ex.title, { subtitle: 'A kitchen science experiment. Always do it with a grown-up!' });
  const cw = pg.width * 0.42;
  pg.add(panel(pg.left, pg.y, cw, ex.need.length * 11 + 14, '#fff6e0', '#ffb938', 7) + txt(pg.left + 6, pg.y + 9, 'You will need', 5.6, { anchor: 'start', colour: '#e08a00' }));
  ex.need.forEach(([e, t], i) => pg.add(emoji(e, pg.left + 11, pg.y + 18 + i * 11, 7) + txt(pg.left + 19, pg.y + 19.6 + i * 11, t, fitFont(t, 4.4, cw - 24, 0.5), { anchor: 'start', font: FONT })));
  const sx = pg.left + cw + 6, sw = pg.width - cw - 6;
  pg.add(txt(sx, pg.y + 9, 'What to do', 5.6, { anchor: 'start', colour: '#3a64d8' }));
  let sy = pg.y + 17;
  ex.steps.forEach((s, i) => {
    pg.add(`<circle cx="${sx + 3.5}" cy="${sy - 1.5}" r="3.2" fill="${PALETTE[i % PALETTE.length]}"/>` + txt(sx + 3.5, sy, i + 1, 3.8, { colour: '#fff' }));
    sy = textLines(pg, wrap(s, Math.floor((sw - 10) / 2.25)), sx + 9, sy, 4.4, { font: FONT, weight: 700 }) + 2;
  });
  pg.y = Math.max(pg.y + ex.need.length * 11 + 20, sy + 4);
  if (ex.table) {
    const rh = 10, cols = [0.46, 0.27, 0.27];
    [['Object', 'I think', 'It did']].concat(ex.table.map((t) => [t, 'sink / float', 'sink / float'])).forEach((row, r) => {
      let x = pg.left;
      row.forEach((cell, k) => { const w = pg.width * cols[k]; pg.add(`<rect x="${x}" y="${pg.y + r * rh}" width="${w}" height="${rh}" fill="${r ? '#fff' : '#eef2ff'}" stroke="#c9c3e3" stroke-width="0.4"/>` + txt(x + (k ? w / 2 : 4), pg.y + r * rh + 6.6, cell, 4.2, { anchor: k ? 'middle' : 'start', font: FONT, weight: r ? 700 : 800, colour: r && k ? SOFT : INK })); x += w; });
    });
    pg.y += (ex.table.length + 1) * rh + 6;
  } else {
    pg.add(panel(pg.left, pg.y, pg.width, 30, '#e8f8f4', '#3fbfa8', 7) + txt(pg.left + 6, pg.y + 9, 'I think this will happen', 5.4, { anchor: 'start', colour: '#2e9d85' }));
    for (let l = 1; l <= 2; l++) pg.add(`<line x1="${pg.left + 6}" x2="${pg.right - 6}" y1="${pg.y + 9 + l * 9}" y2="${pg.y + 9 + l * 9}" stroke="#c9c3e3" stroke-width="0.4"/>`);
    pg.y += 36;
  }
  const bh = pg.room - 26;
  pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="${bh}" rx="7" fill="#fff" stroke="#b06cff" stroke-width="0.7" stroke-dasharray="3 2"/>` + txt(pg.left + 6, pg.y + 8, 'What happened? Draw it!', 5.2, { anchor: 'start', colour: '#8a3fd1' }));
  pg.y += bh + 4;
  textLines(pg, wrap(`For grown-ups: ${ex.why}`, 96), pg.left, pg.y + 4, 3.8, { font: FONT, weight: 600, colour: SOFT });
  return [pg.svg()];
}

// ================================================================ letter writing kit
function makeLetterKit(o, paper) {
  const name = nameOf(o.name, '');
  const to = String(o.to || '').trim().slice(0, 24);
  const art = ['sun', 'rainbow', 'heart', 'star', 'balloon', 'tulip'];
  const pages = [];
  const pg = new Page(paper, '', { bare: true, tint: '#fffdf8' });
  pg.add(`<rect x="${pg.left - 3}" y="${pg.m - 3}" width="${pg.width + 6}" height="${pg.bottom - pg.m + 3}" rx="12" fill="#fff" stroke="#ffb938" stroke-width="1"/>`);
  art.forEach((a, i) => pg.add(pic(ART(a), pg.left + 12 + i * (pg.width - 24) / 5, pg.m + 11, 13)));
  pg.add(txt(pg.left + 8, pg.m + 34, to ? `Dear ${to},` : 'Dear', 9, { anchor: 'start', colour: '#e0457b' }));
  if (!to) pg.add(`<line x1="${pg.left + 32}" x2="${pg.left + 110}" y1="${pg.m + 34.6}" y2="${pg.m + 34.6}" stroke="#b9b3d6" stroke-width="0.5"/>`);
  const ly0 = pg.m + 48, lh = 12, n = Math.floor((pg.bottom - 40 - ly0) / lh);
  for (let l = 0; l < n; l++) pg.add(`<line x1="${pg.left + 8}" x2="${pg.right - 8}" y1="${ly0 + l * lh}" y2="${ly0 + l * lh}" stroke="#d9d4ec" stroke-width="0.45"/>`);
  pg.add(txt(pg.right - 10, pg.bottom - 22, name ? `Love from ${name}` : 'Love from', 8, { anchor: 'end', colour: '#e0457b' }));
  if (!name) pg.add(`<line x1="${pg.right - 70}" x2="${pg.right - 10}" y1="${pg.bottom - 10}" y2="${pg.bottom - 10}" stroke="#b9b3d6" stroke-width="0.5"/>`);
  pg.footer = () => {};
  pages.push(pg.svg());
  if (o.envelope !== false) {
    const p2 = new Page(paper, 'Fold your own envelope', { subtitle: 'Cut around the outside. Fold the side flaps in, then the bottom up, and glue. Fold the top down to close it.', noName: true });
    const W = 120, H = 80, cx = p2.w / 2, top = p2.y + 42, x0 = cx - W / 2;
    const d = `M${x0} ${top} L${cx} ${top - 38} L${x0 + W} ${top} L${x0 + W + 30} ${top + 10} L${x0 + W + 30} ${top + H - 10} L${x0 + W} ${top + H} L${cx + 48} ${top + H + 42} L${cx - 48} ${top + H + 42} L${x0} ${top + H} L${x0 - 30} ${top + H - 10} L${x0 - 30} ${top + 10} Z`;
    p2.add(`<path d="${d}" fill="#fff6e0" stroke="${INK}" stroke-width="0.7" stroke-dasharray="2.5 1.6"/>`);
    p2.add(`<rect x="${x0}" y="${top}" width="${W}" height="${H}" fill="#fff" stroke="#b9b3d6" stroke-width="0.5"/>`);
    p2.add(`<rect x="${x0 + W - 24}" y="${top + 5}" width="19" height="23" rx="1.5" fill="#fff" stroke="#ff7eb6" stroke-width="0.7" stroke-dasharray="1.4 1"/>` + txt(x0 + W - 14.5, top + 18, 'stamp', 3.4, { font: FONT, colour: SOFT }));
    p2.add(txt(x0 + 8, top + 40, 'To:', 5, { anchor: 'start', colour: INK }));
    for (let l = 0; l < 3; l++) p2.add(`<line x1="${x0 + 18}" x2="${x0 + W - 10}" y1="${top + 40 + l * 11}" y2="${top + 40 + l * 11}" stroke="#c9c3e3" stroke-width="0.45"/>`);
    if (to) p2.add(txt(x0 + 20, top + 39, to, 6, { anchor: 'start', colour: '#e0457b' }));
    p2.add(txt(cx, top - 14, 'top flap', 3.6, { font: FONT, colour: SOFT }) + txt(cx, top + H + 26, 'bottom flap (glue)', 3.6, { font: FONT, colour: SOFT }) + txt(x0 - 15, top + H / 2, 'glue', 3.6, { font: FONT, colour: SOFT }) + txt(x0 + W + 15, top + H / 2, 'glue', 3.6, { font: FONT, colour: SOFT }));
    const gy = top + H + 50;
    p2.add(panel(p2.left, gy, p2.width, p2.bottom - gy - 2, '#eef2ff', '#6c8cff', 8) + txt(p2.left + 7, gy + 10, 'How to write a letter', 6, { anchor: 'start', colour: '#3a64d8' }));
    ['Start with "Dear" and their name.', 'Say hello and ask how they are.', 'Tell them your news: something fun you did.', 'Ask them a question about their day.', 'Finish with "Love from" and your name. Add a drawing!'].forEach((t, i) => p2.add(`<circle cx="${p2.left + 10}" cy="${gy + 19 + i * 8.5}" r="3" fill="${PALETTE[i]}"/>` + txt(p2.left + 10, gy + 20.4 + i * 8.5, i + 1, 3.6, { colour: '#fff' }) + txt(p2.left + 17, gy + 20.6 + i * 8.5, t, 4.6, { anchor: 'start', font: FONT })));
    pages.push(p2.svg());
  }
  return pages;
}

// ================================================================ two more Plus storybooks
Object.assign(STORYBOOKS, {
  dino: { title: '{name} and the Dinosaur Who Could Not Sleep', pages: [
    ['dino', 'Deep in the forest lived a little dinosaur called Dot, who could not fall asleep.'],
    ['owl', 'Owl sang a gentle lullaby. Hoo, hoo. But Dot was still wide awake.'],
    ['bunny', 'Bunny brought a soft blanket. Dot snuggled in, but still could not sleep.'],
    ['teddy', '{name} came along with a favourite teddy. "When I cannot sleep, I count the stars," said {name}.'],
    ['snail', 'They counted one star, two stars, three stars. Snail counted too, very, very slowly.'],
    ['elephant', 'Elephant gave a great big yawn. Yaaawn! Soon everybody was yawning.'],
    ['turtle', 'Dot\'s eyes grew heavy. "Thank you, {name}," Dot whispered.'],
    ['house', 'The little dinosaur fell fast asleep and dreamed happy dreams. Goodnight, Dot. Goodnight, {name}.']] },
  garden: { title: '{name}\'s Magic Garden', pages: [
    ['sunflower', '{name} planted a tiny seed and gave it a drink of water every single day.'],
    ['rainbow', 'The sun shone, the rain fell, and a rainbow smiled over the garden.'],
    ['ladybird', 'One morning, a ladybird landed on a little green shoot. Something was growing!'],
    ['bee', 'Buzz! A busy bee came to say hello to the growing plant.'],
    ['butterfly', 'A butterfly danced around it, fluttering beautiful wings.'],
    ['snail', 'A snail slid by, leaving a shiny silver trail.'],
    ['frog', 'Frog hopped up to see what everyone was looking at. Ribbit!'],
    ['sunflower', 'There it was: the tallest, brightest sunflower, reaching up to the sky. And {name} had grown it all by themselves!']] },
});

Object.assign(MAKERS, { invites: makeInvites, countdown: makeCountdown, teeth: makeTeeth, familyrules: makeFamilyRules, sitter: makeSitter, science: makeScience, letterkit: makeLetterKit });
