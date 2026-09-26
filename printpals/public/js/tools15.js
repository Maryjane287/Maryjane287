// PrintPals batch 15: savings jar, packing lists, love coupons, family meal planner, healthy habits posters,
// maths minute and reading comprehension.

// Numbered picture steps, one per row (used by the healthy habits posters).
function stepsPage(paper, title, sub, steps) {
  const pg = new Page(paper, title, { subtitle: sub });
  const rh = (pg.room - 2) / steps.length;
  steps.forEach(([e, t], i) => {
    const y = pg.y + i * rh, c = PALETTE[i % PALETTE.length];
    pg.add(panel(pg.left, y + 1, pg.width, rh - 2, TINTS[i % TINTS.length], c, 8) + `<circle cx="${pg.left + 10}" cy="${y + rh / 2}" r="5.5" fill="${c}"/>` + txt(pg.left + 10, y + rh / 2 + 2.2, i + 1, 6, { colour: '#fff' })
      + emoji(e, pg.left + 30, y + rh / 2, Math.min(18, rh * 0.55)) + txt(pg.left + 46, y + rh / 2 + 2.4, t, fitFont(t, 7, pg.width - 52, 0.5), { anchor: 'start', colour: INK }));
  });
  return pg.svg();
}

// ================================================================ savings jar
function makeSavings(o, paper) {
  const name = nameOf(o.name, '');
  const cur = CURRENCIES[o.currency] || CURRENCIES.GBP;
  const target = Math.max(1, Math.min(100000, Math.round(parseFloat(String(o.target || '').replace(/[^0-9.]/g, '')) || 20)));
  const n = [10, 20, 30].includes(+o.steps) ? +o.steps : 20;
  const goal = String(o.goal || '').trim().slice(0, 30);
  // Amounts in the smallest unit; when the goal does not split evenly, round each coin to a tidy number.
  const total = cur.whole ? target : target * 100, step = total / n;
  const unit = Number.isInteger(step) ? 1 : Math.max(1, Math.pow(10, Math.floor(Math.log10(step)) - (step >= 100 ? 1 : 0)));
  const money = (k) => cur.fmt(k === n ? total : Math.round(step * k / unit) * unit);
  const pages = [];
  const pg = new Page(paper, name ? `${possessive(name)} savings jar` : 'My savings jar', { subtitle: 'Every time you save, colour the next coin. When the jar is full, you have enough!', noName: !!name });
  pg.add(panel(pg.left, pg.y, pg.width, 26, '#fff6e0', '#ffb938', 8) + txt(pg.left + 8, pg.y + 10, 'I am saving for', 5, { anchor: 'start', font: FONT, colour: SOFT }));
  if (goal) pg.add(txt(pg.left + 8, pg.y + 21, goal, fitFont(goal, 9, pg.width - 70, 0.55), { anchor: 'start', colour: '#e08a00' }));
  else pg.add(`<line x1="${pg.left + 8}" x2="${pg.right - 60}" y1="${pg.y + 21}" y2="${pg.y + 21}" stroke="#d9c38f" stroke-width="0.5"/>`);
  pg.add(txt(pg.right - 8, pg.y + 10, 'My goal', 5, { anchor: 'end', font: FONT, colour: SOFT }) + txt(pg.right - 8, pg.y + 21, money(n), 9, { anchor: 'end', colour: '#e0457b' }));
  pg.y += 32;
  // The jar
  const jx = pg.left + 14, jw = pg.width - 28, jy = pg.y + 12, jh = pg.room - 14;
  pg.add(`<rect x="${jx + 18}" y="${pg.y}" width="${jw - 36}" height="10" rx="3" fill="#ffd166" stroke="${INK}" stroke-width="0.7"/>`);
  pg.add(`<path d="M${jx + 14} ${jy} L${jx + jw - 14} ${jy} Q${jx + jw} ${jy + 4} ${jx + jw} ${jy + 22} L${jx + jw} ${jy + jh - 14} Q${jx + jw} ${jy + jh} ${jx + jw - 14} ${jy + jh} L${jx + 14} ${jy + jh} Q${jx} ${jy + jh} ${jx} ${jy + jh - 14} L${jx} ${jy + 22} Q${jx} ${jy + 4} ${jx + 14} ${jy} Z" fill="#f2fbff" stroke="${INK}" stroke-width="0.9"/>`);
  pg.add(`<path d="M${jx + 8} ${jy + 30} Q${jx + 6} ${jy + jh / 2} ${jx + 8} ${jy + jh - 30}" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`);
  const cols = n === 10 ? 2 : n === 20 ? 4 : 5, rows = n / cols;
  const cw = (jw - 24) / cols, ch = (jh - 30) / rows, r = Math.min(cw, ch) * 0.4;
  for (let k = 0; k < n; k++) {
    // Fill from the bottom of the jar up.
    const row = rows - 1 - Math.floor(k / cols), col = k % cols;
    const cx = jx + 12 + col * cw + cw / 2, cy = jy + 22 + row * ch + ch / 2, label = money(k + 1);
    pg.add(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="#e0a800" stroke-width="0.9"/><circle cx="${cx}" cy="${cy}" r="${r * 0.82}" fill="none" stroke="#f3d27a" stroke-width="0.5" stroke-dasharray="1.2 1"/>`);
    pg.add(txt(cx, cy + 1.8, label, fitFont(label, r * 0.62, r * 1.6, 0.55), { colour: '#b07d00' }));
  }
  pages.push(pg.svg());
  if (o.jars !== false) {
    const p2 = new Page(paper, 'Spend, save, share', { subtitle: 'Cut out the labels and stick them on three jars. Share your money out each time you get some.', noName: true });
    const jars = [['Spend', '🛍️', 'For little things I want now', '#6c8cff', '#eef2ff'], ['Save', '🐷', 'For something big I am saving for', '#ffb938', '#fff6e0'], ['Share', '💝', 'To help someone or give a gift', '#ff7eb6', '#fff0f5']];
    const h = (p2.room - 8) / 3;
    jars.forEach(([t, e, s, c, tint], i) => {
      const y = p2.y + i * (h + 4);
      p2.add(`<rect x="${p2.left + 10}" y="${y}" width="${p2.width - 20}" height="${h}" rx="12" fill="${tint}" stroke="${c}" stroke-width="1" stroke-dasharray="3 2"/>`);
      p2.add(emoji(e, p2.left + 40, y + h / 2, h * 0.5) + txt(p2.left + 70, y + h / 2, t, 22, { anchor: 'start', colour: c }) + txt(p2.left + 71, y + h / 2 + 12, s, 5.4, { anchor: 'start', font: FONT, colour: INK }));
    });
    pages.push(p2.svg());
  }
  return pages;
}

// ================================================================ packing lists
const TRIPS = {
  holiday: ['Holiday packing list', [['👕', 'T-shirts and tops'], ['👖', 'Trousers and shorts'], ['🩲', 'Pants and socks'], ['👗', 'Something smart'], ['🩳', 'Pyjamas'], ['👟', 'Comfy shoes'], ['🧥', 'A jumper or coat'], ['🪥', 'Toothbrush and toothpaste'], ['🧸', 'My cuddly toy'], ['📚', 'A book'], ['🎧', 'Something for the journey'], ['💊', 'Any medicine']]],
  beach: ['Beach bag list', [['🩱', 'Swimming costume'], ['🏖️', 'Towel'], ['🧴', 'Sun cream'], ['👒', 'Sun hat'], ['🕶️', 'Sunglasses'], ['🩴', 'Flip flops'], ['🪣', 'Bucket and spade'], ['💧', 'Water bottle'], ['🍎', 'Snacks'], ['👕', 'Dry clothes for later'], ['🛍️', 'A bag for wet things'], ['🐚', 'A pot for shells']]],
  sleepover: ['Sleepover packing list', [['🩳', 'Pyjamas'], ['🪥', 'Toothbrush and toothpaste'], ['🧸', 'My cuddly toy'], ['👕', 'Clothes for tomorrow'], ['🩲', 'Pants and socks'], ['🛏️', 'Sleeping bag or pillow'], ['🔦', 'A torch'], ['📚', 'A bedtime story'], ['🧴', 'Hairbrush'], ['💊', 'Any medicine'], ['💌', 'A thank you card']]],
  camping: ['Camping packing list', [['⛺', 'Tent'], ['🛏️', 'Sleeping bag'], ['🔦', 'Torch'], ['🧥', 'Warm jumper and coat'], ['🥾', 'Wellies or boots'], ['🧦', 'Lots of socks'], ['🩳', 'Pyjamas'], ['🧢', 'Hat'], ['💧', 'Water bottle'], ['🍫', 'Snacks'], ['🔍', 'Magnifying glass'], ['📓', 'Nature notebook']]],
  school: ['School trip list', [['🎒', 'Backpack'], ['🥪', 'Packed lunch'], ['💧', 'Water bottle'], ['🧥', 'Coat'], ['👟', 'Comfy shoes'], ['🧢', 'Hat or sun hat'], ['🧴', 'Sun cream'], ['✏️', 'Pencil'], ['💊', 'Any medicine'], ['📝', 'Signed letter']]],
  grandparents: ['Staying with family', [['👕', 'Clothes for each day'], ['🩲', 'Pants and socks'], ['🩳', 'Pyjamas'], ['🪥', 'Toothbrush and toothpaste'], ['🧸', 'My cuddly toy'], ['📚', 'Books to share'], ['🎲', 'A game to play together'], ['🖍️', 'Colouring and pencils'], ['📷', 'Photos to show'], ['🎁', 'A little gift or drawing'], ['💊', 'Any medicine']]],
};

function makePacking(o, paper) {
  const name = nameOf(o.name, '');
  const [title, base] = TRIPS[o.trip] || TRIPS.holiday;
  const own = listOf(o.extra, 4).map((t) => ['⭐', t.slice(0, 40)]);
  const items = base.concat(own).slice(0, 16);
  return [checklistPage(paper, name ? `${possessive(name)} ${title.charAt(0).toLowerCase() + title.slice(1)}` : title, 'Pack it, then colour the star. Ready for an adventure!', items, name)];
}

// ================================================================ love coupons
const COUPONS = [['🤗', 'One great big hug'], ['🍳', 'Breakfast in bed'], ['🧹', 'I will tidy my room'], ['🛋️', 'A cuddle on the sofa'], ['🥕', 'I will help make dinner'], ['🎵', 'A song just for you'], ['🎬', 'You choose the film'], ['🦶', 'A foot rub'],
  ['😊', 'A whole day with no moaning'], ['🖍️', 'A drawing just for you'], ['😘', 'Ten kisses'], ['🍽️', 'I will set the table'], ['☕', 'I will bring you a drink'], ['🌷', 'A walk together'], ['🤫', 'Ten minutes of peace and quiet'], ['🎲', 'A game of your choice']];

function makeCoupons(o, paper) {
  const rand = rng(+o.seed || 1);
  const name = nameOf(o.name, '');
  const to = String(o.to || '').trim().slice(0, 20);
  const bright = o.style !== 'colour';
  const own = listOf(o.own, 8).map((t) => ['💖', t.slice(0, 40)]);
  const list = own.concat(shuffle(COUPONS, rand)).slice(0, 8);
  const pg = new Page(paper, '', { bare: true });
  const cw = pg.width / 2, ch = (pg.bottom - pg.m) / 4;
  list.forEach(([e, t], i) => {
    const x = pg.left + (i % 2) * cw, y = pg.m + Math.floor(i / 2) * ch, c = PALETTE[i % PALETTE.length];
    pg.add(`<rect x="${x + 2}" y="${y + 2}" width="${cw - 4}" height="${ch - 4}" rx="8" fill="${bright ? TINTS[i % TINTS.length] : '#fff'}" stroke="${bright ? c : INK}" stroke-width="0.9" stroke-dasharray="3 2"/>`);
    pg.add(txt(x + 9, y + 12, 'Love coupon', 6, { anchor: 'start', colour: bright ? c : INK }));
    pg.add(bright ? `<path d="M${x + cw - 14} ${y + 12} c-3 -5 -9 -2 -6 3 l6 5 l6 -5 c3 -5 -3 -8 -6 -3 z" fill="${c}"/>` : `<path d="M${x + cw - 14} ${y + 12} c-3 -5 -9 -2 -6 3 l6 5 l6 -5 c3 -5 -3 -8 -6 -3 z" fill="#fff" stroke="${INK}" stroke-width="0.5"/>`);
    pg.add(emoji(e, x + 20, y + ch / 2 + 1, 15));
    const tl = wrap(t, 15);
    textLines(pg, tl, x + 33, y + ch / 2 + 2 - (tl.length - 1) * 3.4, 5.9, { weight: 800, font: TITLE_FONT, colour: INK, lh: 1.15 });
    const who = `To: ${to || '________'}     From: ${name || '________'}`;
    pg.add(txt(x + 9, y + ch - 9, who, fitFont(who, 4.4, cw - 18, 0.5), { anchor: 'start', font: FONT, colour: SOFT }));
  });
  pg.footer = () => {};
  return [pg.svg()];
}

// ================================================================ family meal planner
function makeMealPlan(o, paper) {
  const name = nameOf(o.name, '');
  const pages = [];
  const pg = new Page(paper, 'Our meals this week', { subtitle: 'Plan together. Each day, a little chef helps choose and cook one meal!', noName: true });
  const meals = [['Breakfast', '🥣'], ['Lunch', '🥪'], ['Dinner', '🍝']];
  const dw = 26, hw = 20, mw = (pg.width - dw - hw) / 3, hh = 12, rh = (pg.room - hh - 2) / 7;
  meals.forEach(([m, e], k) => pg.add(`<rect x="${pg.left + dw + k * mw}" y="${pg.y}" width="${mw}" height="${hh}" fill="${TINTS[k * 2]}" stroke="#c9c3e3" stroke-width="0.4"/>` + emoji(e, pg.left + dw + k * mw + 8, pg.y + hh / 2, 7) + txt(pg.left + dw + k * mw + 14, pg.y + hh / 2 + 1.8, m, 5, { anchor: 'start', colour: PALETTE[k * 2] })));
  pg.add(`<rect x="${pg.right - hw}" y="${pg.y}" width="${hw}" height="${hh}" fill="#fff6e0" stroke="#c9c3e3" stroke-width="0.4"/>` + txt(pg.right - hw / 2, pg.y + hh / 2 + 1.6, 'Chef', 4.4, { colour: '#e08a00' }));
  WEEKDAYS.forEach((d, i) => {
    const y = pg.y + hh + i * rh, c = PALETTE[i % PALETTE.length];
    pg.add(`<rect x="${pg.left}" y="${y}" width="${dw}" height="${rh}" fill="${TINTS[i % TINTS.length]}" stroke="#c9c3e3" stroke-width="0.4"/>` + txt(pg.left + dw / 2, y + rh / 2 + 1.8, d.slice(0, 3), 5.4, { colour: c }));
    for (let k = 0; k < 3; k++) pg.add(`<rect x="${pg.left + dw + k * mw}" y="${y}" width="${mw}" height="${rh}" fill="#fff" stroke="#c9c3e3" stroke-width="0.4"/>`);
    pg.add(`<rect x="${pg.right - hw}" y="${y}" width="${hw}" height="${rh}" fill="#fff" stroke="#c9c3e3" stroke-width="0.4"/><path d="${starPath(pg.right - hw / 2, y + rh / 2, 5, 0.45)}" fill="#fff" stroke="#ffb938" stroke-width="0.7"/>`);
  });
  pages.push(pg.svg());
  if (o.shopping !== false) {
    const p2 = new Page(paper, 'Shopping list', { subtitle: 'Children can tick things off in the shop. Great for reading practice!', noName: true });
    const groups = [['🥕', 'Fruit and vegetables', '#3fbfa8'], ['🍞', 'Bread, rice and pasta', '#ffb938'], ['🥛', 'Milk, cheese and eggs', '#6c8cff'], ['🍗', 'Meat, fish and beans', '#ff6b6b'], ['🥫', 'Cupboard', '#b06cff'], ['🍪', 'Treats and extras', '#ff7eb6']];
    const cw = p2.width / 2, bh = p2.room / 3;
    groups.forEach(([e, t, c], i) => {
      const x = p2.left + (i % 2) * cw, y = p2.y + Math.floor(i / 2) * bh;
      p2.add(panel(x + 1.5, y + 1.5, cw - 3, bh - 3, '#fff', c, 7) + emoji(e, x + 11, y + 10, 8) + txt(x + 18, y + 12, t, fitFont(t, 5.4, cw - 26, 0.5), { anchor: 'start', colour: c }));
      const lines = Math.floor((bh - 22) / 9.5);
      for (let l = 0; l < lines; l++) { const ly = y + 24 + l * 9.5; p2.add(`<rect x="${x + 7}" y="${ly - 4}" width="4.5" height="4.5" rx="1" fill="#fff" stroke="${c}" stroke-width="0.5"/><line x1="${x + 15}" x2="${x + cw - 8}" y1="${ly + 0.5}" y2="${ly + 0.5}" stroke="#d9d4ec" stroke-width="0.45"/>`); }
    });
    pages.push(p2.svg());
  }
  if (o.menu !== false) {
    const p3 = new Page(paper, '', { bare: true, tint: '#fffdf8' });
    p3.add(`<rect x="${p3.left - 3}" y="${p3.m - 3}" width="${p3.width + 6}" height="${p3.bottom - p3.m + 3}" rx="12" fill="#fff" stroke="#e0457b" stroke-width="1.2"/>`);
    p3.add(emoji('👩‍🍳', p3.w / 2, p3.m + 18, 20));
    bubbleText(p3, name ? `Chef ${name}'s menu` : 'Tonight\'s menu', p3.w / 2, p3.m + 46, p3.width - 30, 18);
    const parts = [['Starter', '🥗'], ['Main course', '🍲'], ['Pudding', '🍨']], top = p3.m + 56, h = (p3.bottom - 16 - top) / 3;
    parts.forEach(([t, e], i) => {
      const y = top + i * h, c = PALETTE[(i * 2) % PALETTE.length];
      p3.add(txt(p3.w / 2, y + 10, t, 8, { colour: c }) + emoji(e, p3.w / 2 - t.length * 2.6 - 10, y + 7.5, 8));
      p3.add(`<rect x="${p3.left + 16}" y="${y + 15}" width="${p3.width - 32}" height="${h - 22}" rx="8" fill="#fff" stroke="${c}" stroke-width="0.6" stroke-dasharray="3 2"/>`);
      p3.add(txt(p3.left + 22, y + 22, 'Draw it and write its name', 4, { anchor: 'start', font: FONT, colour: SOFT }));
    });
    p3.add(txt(p3.w / 2, p3.bottom - 6, 'Bon appétit! Enjoy your meal!', 5, { font: FONT, colour: '#e0457b' }));
    p3.footer = () => {};
    pages.push(p3.svg());
  }
  return pages;
}

// ================================================================ healthy habits posters
const HABITS = {
  handwash: ['How to wash my hands', 'Wash before eating, after the toilet and after playing outside.', [['💧', 'Wet your hands with water'], ['🧼', 'Add some soap'], ['👏', 'Rub your palms together'], ['🙌', 'Scrub the backs and between your fingers'], ['👍', 'Wash your thumbs and your nails'], ['🎂', 'Sing Happy Birthday twice'], ['🚰', 'Rinse off all the bubbles'], ['🧻', 'Dry your hands. All clean!']]],
  sneeze: ['Catch that sneeze!', 'Help stop germs from spreading to the people you love.', [['🤧', 'Feel a sneeze or cough coming?'], ['🧻', 'Catch it in a tissue'], ['💪', 'No tissue? Use your elbow'], ['🗑️', 'Put the tissue in the bin'], ['🧼', 'Wash your hands'], ['⭐', 'Germs stopped. Well done!']]],
  dressed: ['I can get dressed!', 'Lay the clothes out in order the night before, then follow the steps.', [['🩲', 'Pants on first'], ['🧦', 'Socks on your feet'], ['👕', 'Top over your head'], ['👖', 'Trousers or skirt'], ['🧥', 'Jumper or cardigan'], ['👟', 'Shoes on the right feet'], ['🪞', 'Check in the mirror. Looking great!']]],
  toilet: ['Toilet time steps', 'For children who are learning to use the toilet by themselves.', [['🚽', 'Pull down your pants'], ['🪑', 'Sit on the toilet'], ['🧻', 'Wipe front to back'], ['👖', 'Pull up your pants'], ['🌊', 'Flush the toilet'], ['🧼', 'Wash your hands with soap'], ['🧻', 'Dry your hands']]],
};

function makeHabits(o, paper) {
  const keys = o.poster === 'all' ? Object.keys(HABITS) : [HABITS[o.poster] ? o.poster : 'handwash'];
  return keys.map((k) => stepsPage(paper, HABITS[k][0], HABITS[k][1], HABITS[k][2]));
}

// ================================================================ maths minute
function mathsMinuteFacts(kind, table, rand) {
  const R = (a, b) => a + Math.floor(rand() * (b - a + 1));
  const make = {
    add10: () => { const a = R(0, 10), b = R(0, 10 - a); return [`${a} + ${b}`, a + b]; },
    sub10: () => { const a = R(1, 10), b = R(0, a); return [`${a} − ${b}`, a - b]; },
    add20: () => { const a = R(2, 18), b = R(1, 20 - a); return [`${a} + ${b}`, a + b]; },
    sub20: () => { const a = R(5, 20), b = R(1, a); return [`${a} − ${b}`, a - b]; },
    doubles: () => { const a = R(1, 12); return rand() < 0.5 ? [`${a} + ${a}`, a * 2] : [`double ${a}`, a * 2]; },
    times: () => { const t = table === 'mix' ? R(2, 10) : +table, a = R(1, 12); return rand() < 0.5 ? [`${a} × ${t}`, a * t] : [`${t} × ${a}`, a * t]; },
  };
  const f = make[kind] || make.add10, out = [], seen = new Set();
  for (let tries = 0; out.length < 30 && tries < 400; tries++) { const p = f(); if (!seen.has(p[0]) || tries > 200) { seen.add(p[0]); out.push(p); } }
  return out;
}

function makeMathsMinute(o, paper) {
  const rand = rng(+o.seed || 1);
  const kind = o.kind || 'add10';
  const table = o.table || '2';
  const facts = mathsMinuteFacts(kind, table, rand);
  const label = { add10: 'Adding to 10', sub10: 'Taking away within 10', add20: 'Adding to 20', sub20: 'Taking away within 20', doubles: 'Doubles', times: table === 'mix' ? 'Mixed times tables' : `The ${table} times table` }[kind] || 'Adding to 10';
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const pg = new Page(paper, answers ? 'Maths minute: answers' : 'Maths minute', { subtitle: answers ? 'Answer key for grown-ups.' : `${label}. How many can you do in one minute? Ready, steady, go!`, noName: answers });
    if (!answers) {
      pg.add(`<circle cx="${pg.right - 14}" cy="${pg.y + 8}" r="9" fill="#fff" stroke="#ff6b6b" stroke-width="1"/><line x1="${pg.right - 14}" y1="${pg.y + 8}" x2="${pg.right - 14}" y2="${pg.y + 2}" stroke="${INK}" stroke-width="0.8" stroke-linecap="round"/><line x1="${pg.right - 14}" y1="${pg.y + 8}" x2="${pg.right - 9.5}" y2="${pg.y + 8}" stroke="${INK}" stroke-width="0.8" stroke-linecap="round"/><rect x="${pg.right - 16}" y="${pg.y - 3.5}" width="4" height="2.5" rx="0.6" fill="#ff6b6b"/>`);
      pg.add(txt(pg.left, pg.y + 10, 'My score:', 7, { anchor: 'start', colour: INK }) + `<rect x="${pg.left + 34}" y="${pg.y + 2}" width="22" height="11" rx="3" fill="#fff" stroke="#b9b3d6" stroke-width="0.5"/>` + txt(pg.left + 60, pg.y + 10, 'out of 30', 5, { anchor: 'start', font: FONT, colour: SOFT }));
      pg.y += 22;
    }
    const cols = 3, rows = 10, cw = pg.width / cols, rh = (pg.room - (answers ? 4 : 44)) / rows;
    facts.forEach(([q, a], i) => {
      const col = Math.floor(i / rows), row = i % rows, x = pg.left + col * cw, y = pg.y + row * rh, c = PALETTE[col * 2];
      pg.add(txt(x + 4, y + rh / 2 + 2, `${i + 1}.`, 3.8, { anchor: 'start', font: FONT, colour: SOFT }) + txt(x + 12, y + rh / 2 + 2.6, `${q} =`, 7, { anchor: 'start', colour: INK }));
      pg.add(`<rect x="${x + cw - 22}" y="${y + rh / 2 - 5}" width="17" height="10" rx="2.5" fill="#fff" stroke="${c}" stroke-width="0.6"/>`);
      if (answers) pg.add(txt(x + cw - 13.5, y + rh / 2 + 2.4, a, 6.4, { colour: '#e0457b' }));
    });
    if (!answers) {
      const ty = pg.y + rows * rh + 6;
      pg.add(panel(pg.left, ty, pg.width, 34, '#fff6e0', '#ffb938', 7) + txt(pg.left + 7, ty + 9, 'Beat your score! Try again each day and write your score here.', 4.8, { anchor: 'start', font: FONT, colour: '#b07d00' }));
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], dw = (pg.width - 14) / 5;
      days.forEach((d, i) => pg.add(txt(pg.left + 7 + i * dw + dw / 2, ty + 18, d, 4.6, { colour: PALETTE[i] }) + `<rect x="${pg.left + 7 + i * dw + dw / 2 - 12}" y="${ty + 20.5}" width="24" height="10" rx="3" fill="#fff" stroke="${PALETTE[i]}" stroke-width="0.6"/>`));
    }
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ reading comprehension
const READING = {
  short: [
    { title: 'The red kite', pic: 'balloon', text: '{name} had a red kite. The wind was strong. The kite flew up high, over the trees. Then it got stuck in a tree! Dad got a long stick and set it free.',
      qs: [['What colour was the kite?', ['red', 'blue', 'green'], 0], ['Where did the kite get stuck?', ['on a roof', 'in a tree', 'in the sea'], 1], ['Who helped?', ['a dog', 'Mum', 'Dad'], 2]], draw: 'Draw the kite flying in the sky.' },
    { title: 'Biscuit the puppy', pic: 'dog', text: '{name} has a little puppy called Biscuit. Biscuit is brown with one white ear. He likes to dig in the garden. Every night, Biscuit sleeps in a basket by the door.',
      qs: [['What is the puppy called?', ['Biscuit', 'Cookie', 'Buddy'], 0], ['What does Biscuit like to do?', ['swim', 'dig', 'sing'], 1], ['Where does Biscuit sleep?', ['in a basket', 'on the bed', 'in the car'], 0]], draw: 'Draw Biscuit with one white ear.' },
    { title: 'Puddle day', pic: 'rainbow', text: 'It was raining. {name} put on yellow boots and a big coat. {name} jumped in every puddle. Splash! Then the sun came out and there was a rainbow. At home, Mum made hot soup.',
      qs: [['What colour were the boots?', ['red', 'yellow', 'blue'], 1], ['What did {name} jump in?', ['leaves', 'sand', 'puddles'], 2], ['What did Mum make?', ['hot soup', 'a cake', 'toast'], 0]], draw: 'Draw {name} jumping in a puddle.' },
  ],
  longer: [
    { title: 'The sunflower seeds', pic: 'sunflower', text: '{name} and Grandpa planted sunflower seeds in May. Every morning, {name} gave them some water. At first nothing happened, and {name} felt a bit sad. But after two weeks, tiny green shoots poked out of the soil. By August, the sunflowers were taller than Grandpa! Bees buzzed around the big yellow flowers. At the end of the summer, {name} saved some seeds in a jar.',
      qs: [['When did they plant the seeds?', ['in May', 'in June', 'in August'], 0], ['How did {name} feel when nothing happened?', ['angry', 'a bit sad', 'sleepy'], 1], ['How tall were the sunflowers by August?', ['as tall as a cat', 'very tiny', 'taller than Grandpa'], 2]],
      write: ['Why do you think {name} saved some seeds?', 'To plant them again next year.'] },
    { title: 'The school trip', pic: 'chalkboard', text: 'On Friday, {name}\'s class went to the museum. The biggest room had a dinosaur skeleton as long as a bus. {friend} thought it looked scary, but {name} said it had been asleep for millions of years. Next they saw a mummy, some very old coins and a golden crown. In the shop, {name} bought a pencil with a little dinosaur on top. It was the best school trip ever.',
      qs: [['When did the class go to the museum?', ['on Monday', 'on Friday', 'on Sunday'], 1], ['How long was the dinosaur skeleton?', ['as long as a bus', 'as long as a pencil', 'as long as a car'], 0], ['What did {name} buy in the shop?', ['a golden crown', 'a book', 'a dinosaur pencil'], 2]],
      write: ['How did {friend} feel about the dinosaur?', '{friend} thought it looked scary.'] },
    { title: 'The lighthouse', pic: 'fish', text: '{name} was staying with Aunt Rose by the sea. From the bedroom window, {name} could see a tall lighthouse with red and white stripes. Every night its bright light turned round and round. "It keeps the ships safe," said Aunt Rose. "It shows them where the rocks are." One stormy night, {name} watched a little boat sail safely past the rocks and into the harbour.',
      qs: [['Who was {name} staying with?', ['Grandma', 'Aunt Rose', 'a friend'], 1], ['What colour were the stripes?', ['red and white', 'blue and yellow', 'green and white'], 0], ['What does the lighthouse do?', ['makes music', 'catches fish', 'keeps ships safe'], 2]],
      write: ['What was the weather like on the night the little boat sailed past?', 'It was stormy.'] },
  ],
};

function makeReading(o, paper) {
  const level = o.level === 'longer' ? 'longer' : 'short';
  const set = READING[level];
  const story = set[Math.max(0, Math.min(set.length - 1, (+o.story || 1) - 1))];
  const name = nameOf(o.name, '') || 'Mia';
  const friend = name.toLowerCase() === 'leo' ? 'Sam' : 'Leo';
  const fill = (t) => t.replace(/\{name\}/g, name).replace(/\{friend\}/g, friend);
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const pg = new Page(paper, answers ? `${story.title}: answers` : story.title, { subtitle: answers ? 'Answer key for grown-ups.' : 'Read the story. Then answer the questions. You can look back at the story!', noName: answers });
    const fs = level === 'short' ? 8 : 6.2, per = level === 'short' ? 36 : 50;
    const lines = wrap(fill(story.text), per), bh = lines.length * fs * 1.45 + 12;
    pg.add(panel(pg.left, pg.y, pg.width, bh, '#fffdf2', '#ffb938', 8) + pic(ART(story.pic), pg.right - 18, pg.y + 16, 22));
    textLines(pg, lines, pg.left + 8, pg.y + 6 + fs, fs, { font: level === 'short' ? TITLE_FONT : FONT, weight: level === 'short' ? 700 : 700, lh: 1.45, colour: INK });
    pg.y += bh + 8;
    story.qs.forEach(([q, opts, ans], i) => {
      const c = PALETTE[i % PALETTE.length];
      pg.add(`<circle cx="${pg.left + 4}" cy="${pg.y - 1.8}" r="3.6" fill="${c}"/>` + txt(pg.left + 4, pg.y, i + 1, 4.2, { colour: '#fff' }) + txt(pg.left + 11, pg.y, fill(q), 6, { anchor: 'start', colour: INK }));
      const ow = (pg.width - 11) / 3;
      opts.forEach((op, k) => {
        const x = pg.left + 11 + k * ow, right = answers && k === ans;
        pg.add(`<rect x="${x}" y="${pg.y + 4}" width="6" height="6" rx="1.4" fill="${right ? c : '#fff'}" stroke="${c}" stroke-width="0.7"/>` + txt(x + 9, pg.y + 9, fill(op), 5.4, { anchor: 'start', font: FONT, weight: right ? 800 : 700, colour: right ? c : INK }));
        if (right) pg.add(`<path d="M${x + 1.3} ${pg.y + 7} l1.6 1.8 l3 -3.4" fill="none" stroke="#fff" stroke-width="0.9" stroke-linecap="round"/>`);
      });
      pg.y += 20;
    });
    if (story.write) {
      const [q, a] = story.write, c = PALETTE[3];
      pg.add(`<circle cx="${pg.left + 4}" cy="${pg.y - 1.8}" r="3.6" fill="${c}"/>` + txt(pg.left + 4, pg.y, 4, 4.2, { colour: '#fff' }) + txt(pg.left + 11, pg.y, fill(q), fitFont(fill(q), 6, pg.width - 12, 0.5), { anchor: 'start', colour: INK }));
      if (answers) pg.add(txt(pg.left + 11, pg.y + 11, fill(a), 5.6, { anchor: 'start', font: FONT, colour: '#e0457b' }));
      for (let l = 1; l <= 2; l++) pg.add(`<line x1="${pg.left + 11}" x2="${pg.right}" y1="${pg.y + l * 12}" y2="${pg.y + l * 12}" stroke="#c9c3e3" stroke-width="0.45"/>`);
      pg.y += 32;
    }
    const drawQ = story.draw ? fill(story.draw) : 'Draw your favourite part of the story.';
    const dh = pg.room - 4;
    if (dh > 30) pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="${dh}" rx="8" fill="#fff" stroke="#b06cff" stroke-width="0.7" stroke-dasharray="3 2"/>` + txt(pg.left + 7, pg.y + 9, drawQ, 5.2, { anchor: 'start', colour: '#8a3fd1' }));
    pages.push(pg.svg());
  }
  return pages;
}

Object.assign(MAKERS, { savings: makeSavings, packing: makePacking, coupons: makeCoupons, mealplan: makeMealPlan, habits: makeHabits, mathsminute: makeMathsMinute, comprehension: makeReading });
