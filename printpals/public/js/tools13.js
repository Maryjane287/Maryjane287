// PrintPals batch 13: big feelings toolkit, sleep pack, food explorer, social stories,
// personalised storybook (Plus), conversation cards, gratitude journal and potty training pack.

const cardGrid = (pg, n, cols) => { const rows = Math.ceil(n / cols); return { cw: pg.width / cols, ch: (pg.room - 2) / rows }; };

// ================================================================ big feelings toolkit
const CALM_CHOICES = [['🌬️', 'Take 5 slow breaths'], ['🤗', 'Ask for a hug'], ['🔢', 'Count to 10'], ['💧', 'Drink some water'], ['🖍️', 'Draw how I feel'], ['🎵', 'Listen to music'],
  ['🦘', 'Jump 10 times'], ['📚', 'Read a book'], ['🧸', 'Cuddle a teddy'], ['🛋️', 'Squeeze a cushion'], ['🏠', 'Go to my calm spot'], ['🗣️', 'Talk to a grown-up']];

function breathingPanel(pg, kind, x, y, w, h, c) {
  const cx = x + w / 2, cy = y + h * 0.46, r = Math.min(w, h) * 0.3;
  const st = `fill="none" stroke="${c}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"`;
  const titles = { star: ['Star breathing', 'Trace up a point as you breathe in. Trace down as you breathe out.'], rainbow: ['Rainbow breathing', 'Breathe in as you trace up the rainbow. Breathe out as you trace down.'],
    balloon: ['Balloon breathing', 'Breathe in and make your tummy big like a balloon. Breathe out slowly: pssss.'], flower: ['Smell and blow', 'Smell the flower (breathe in). Blow out the candle (breathe out).'],
    bunny: ['Bunny breaths', 'Three quick sniffs through your nose, then one long breath out.'], hug: ['Butterfly hug', 'Cross your arms, tap your shoulders slowly, and count to 10.'] };
  const [t, d] = titles[kind];
  pg.add(panel(x + 2, y + 2, w - 4, h - 4, '#fff', c, 7) + txt(cx, y + 11, t, 6, { colour: c }));
  if (kind === 'star') { pg.add(`<path d="${starPath(cx, cy, r, 0.45)}" ${st}/>`); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; pg.add(`<circle cx="${cx + Math.cos(a) * rr}" cy="${cy + Math.sin(a) * rr}" r="1.2" fill="${c}"/>`); } }
  else if (kind === 'rainbow') { [1, 0.78, 0.56].forEach((k, i) => pg.add(`<path d="M${cx - r * 1.3 * k} ${cy + r * 0.5} A${r * 1.3 * k} ${r * 1.3 * k} 0 0 1 ${cx + r * 1.3 * k} ${cy + r * 0.5}" fill="none" stroke="${PALETTE[i * 2]}" stroke-width="2.2" stroke-linecap="round"/>`)); pg.add(txt(cx - r * 1.3, cy + r * 0.5 + 6, 'in', 4, { font: FONT, colour: SOFT }) + txt(cx + r * 1.3, cy + r * 0.5 + 6, 'out', 4, { font: FONT, colour: SOFT })); }
  else if (kind === 'balloon') { pg.add(pic(ART('balloon'), cx - r * 0.7, cy + r * 0.2, r * 0.8) + pic(ART('balloon'), cx + r * 0.5, cy, r * 1.5) + txt(cx - r * 0.7, cy + r * 0.9, 'out', 4, { font: FONT, colour: SOFT }) + txt(cx + r * 0.5, cy + r * 1.05, 'in', 4, { font: FONT, colour: SOFT })); }
  else if (kind === 'flower') { pg.add(emoji('🌷', cx - r * 0.7, cy, r * 1.1) + emoji('🕯️', cx + r * 0.7, cy, r * 1.1)); }
  else if (kind === 'bunny') { pg.add(emoji('🐰', cx, cy, r * 1.5)); }
  else pg.add(emoji('🦋', cx, cy, r * 1.5));
  textLines(pg, wrap(d, Math.floor((w - 12) / 2.5)), cx, y + h - 17, 4.2, { anchor: 'middle', font: FONT, weight: 700, colour: INK });
}

function makeCalmKit(o, paper) {
  const want = (k) => o[k] !== false;
  const pages = [];
  if (want('breathing')) {
    const pg = new Page(paper, 'Calm breathing', { subtitle: 'When big feelings come, try a breathing game. Practise when you feel calm, so it is easy when you need it.' });
    const { cw, ch } = cardGrid(pg, 6, 2);
    ['star', 'rainbow', 'balloon', 'flower', 'bunny', 'hug'].forEach((k, i) => breathingPanel(pg, k, pg.left + (i % 2) * cw, pg.y + Math.floor(i / 2) * ch, cw, ch, PALETTE[i]));
    pages.push(pg.svg());
  }
  if (want('choices')) {
    const pg = new Page(paper, 'My calm down choices', { subtitle: 'Cut out the cards. When you feel upset, pick one to help your body feel calm again.' });
    const { cw, ch } = cardGrid(pg, 12, 3);
    CALM_CHOICES.forEach(([e, t], i) => {
      const x = pg.left + (i % 3) * cw, y = pg.y + Math.floor(i / 3) * ch;
      pg.add(`<rect x="${x + 2}" y="${y + 2}" width="${cw - 4}" height="${ch - 4}" rx="7" fill="${TINTS[i % TINTS.length]}" stroke="#b9b3d6" stroke-width="0.4" stroke-dasharray="2 1.5"/>`);
      pg.add(emoji(e, x + cw / 2, y + ch * 0.4, ch * 0.34) + txt(x + cw / 2, y + ch - 10, t, fitFont(t, 5.2, cw - 8, 0.5), { colour: PALETTE[i % PALETTE.length] }));
    });
    pages.push(pg.svg());
  }
  if (want('thermometer')) {
    const pg = new Page(paper, 'My feelings thermometer', { subtitle: 'Point to how big your feeling is. Then try something that helps.' });
    const levels = [['5', 'About to explode', '#ff4d4d', 'Stop. Breathe. Find a grown-up.'], ['4', 'Very upset', '#ff8a4d', 'Go to my calm spot'], ['3', 'Worried or cross', '#ffc93c', 'Take 5 slow breaths'], ['2', 'A bit wobbly', '#9ad86b', 'Get a drink or a hug'], ['1', 'Calm and happy', '#3fbf60', 'Keep going!']];
    const tx = pg.left + 20, top = pg.y + 6, lh = (pg.room - 30) / 5;
    pg.add(`<rect x="${tx - 9}" y="${top}" width="18" height="${lh * 5}" rx="9" fill="#fff" stroke="${INK}" stroke-width="0.8"/><circle cx="${tx}" cy="${top + lh * 5 + 10}" r="13" fill="#3fbf60" stroke="${INK}" stroke-width="0.8"/>`);
    levels.forEach(([n, t, c, help], i) => {
      const y = top + i * lh;
      pg.add(`<rect x="${tx - 6}" y="${y + 3}" width="12" height="${lh - 4}" rx="4" fill="${c}"/>`);
      pg.add(panel(tx + 18, y + 2, pg.right - tx - 18, lh - 4, '#fff', c, 7));
      pg.add(face(tx + 32, y + lh / 2, Math.min(10, lh * 0.3), ['angry', 'sad', 'worried', 'calm', 'happy'][i], true));
      pg.add(txt(tx + 48, y + lh / 2 - 2, `${n}. ${t}`, 6.4, { anchor: 'start', colour: INK }) + txt(tx + 48, y + lh / 2 + 7, `What helps: ${help}`, 4.6, { anchor: 'start', font: FONT, colour: SOFT }));
    });
    pages.push(pg.svg());
  }
  if (want('worry')) {
    const pg = new Page(paper, 'My worry jar', { subtitle: 'Write or draw a worry on a slip, fold it and pop it in the jar. A grown-up will read it with you later.' });
    const jx = pg.left + 8, jy = pg.y + 4, jw = 76, jh = 110;
    pg.add(`<path d="M${jx + 14} ${jy + 10} H${jx + jw - 14} V${jy + 18} Q${jx + jw} ${jy + 26} ${jx + jw} ${jy + 44} V${jy + jh - 10} Q${jx + jw} ${jy + jh} ${jx + jw - 10} ${jy + jh} H${jx + 10} Q${jx} ${jy + jh} ${jx} ${jy + jh - 10} V${jy + 44} Q${jx} ${jy + 26} ${jx + 14} ${jy + 18} Z" fill="#eaf6ff" stroke="${INK}" stroke-width="0.9"/><rect x="${jx + 12}" y="${jy}" width="${jw - 24}" height="11" rx="2" fill="#ffd6e4" stroke="${INK}" stroke-width="0.8"/>`);
    pg.add(txt(jx + jw / 2, jy + 66, 'Worries', 8, { colour: '#6c8cff' }) + pic(ART('heart'), jx + jw / 2, jy + 84, 14));
    const bx = jx + jw + 12;
    textLines(pg, wrap('Everyone has worries sometimes. Sharing a worry makes it smaller. Once a day, open the jar together, read the worries, and talk about them. Throw away the ones that are gone!', 40), bx, jy + 12, 4.6, { font: FONT, weight: 700, colour: '#5d5680' });
    const sy = jy + jh + 12;
    scissors(pg, sy - 5);
    const sw = pg.width / 2, sh = (pg.bottom - sy) / 4;
    for (let i = 0; i < 8; i++) {
      const x = pg.left + (i % 2) * sw, y = sy + Math.floor(i / 2) * sh;
      pg.add(`<rect x="${x + 2}" y="${y + 1.5}" width="${sw - 4}" height="${sh - 3}" rx="5" fill="#fff" stroke="#b9b3d6" stroke-width="0.4" stroke-dasharray="2 1.5"/>` + txt(x + 7, y + 9, 'My worry is...', 4.4, { anchor: 'start', font: FONT, colour: PALETTE[i % PALETTE.length] }));
      pg.add(`<line x1="${x + 7}" x2="${x + sw - 8}" y1="${y + sh - 7}" y2="${y + sh - 7}" stroke="#c9c3e3" stroke-width="0.4"/>`);
    }
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ sleep pack
function makeSleep(o, paper) {
  const name = nameOf(o.name, '');
  const want = (k) => o[k] !== false;
  const pages = [];
  if (want('ok')) {
    const pg = new Page(paper, '', { bare: true });
    const h = (pg.bottom - pg.m - 8) / 2;
    [['night', 'Still sleepy time', 'Stay in bed and rest. The sun is not up yet.', '#2d2350', '#ffd23f', '🌙'], ['day', 'Good morning!', 'The sun is up. You can get up now!', '#fff6e0', '#ff9f1c', '☀️']].forEach(([k, t, sub, bg, fg, e], i) => {
      const y = pg.m + i * (h + 8);
      pg.add(`<rect x="${pg.left}" y="${y}" width="${pg.width}" height="${h}" rx="14" fill="${bg}" stroke="${fg}" stroke-width="1.4"/>`);
      pg.add(emoji(e, pg.w / 2, y + h * 0.36, h * 0.36));
      pg.add(txt(pg.w / 2, y + h * 0.72, t, 13, { colour: fg }));
      pg.add(txt(pg.w / 2, y + h * 0.72 + 10, sub, 5.2, { font: FONT, colour: k === 'night' ? '#d8d3ee' : INK }));
      pg.add(txt(pg.w / 2, y + h - 8, k === 'night' ? `Wake up time: ______` : (name ? `Well done for staying in bed, ${name}!` : 'Well done for staying in bed!'), 4.6, { font: FONT, colour: k === 'night' ? '#d8d3ee' : SOFT }));
    });
    pg.add(txt(pg.w / 2, pg.m + h + 5.5, 'Cut along the middle and glue back to back. Turn it round at wake up time.', 3.4, { font: FONT, colour: SOFT }));
    pg.footer = () => {};
    pages.push(pg.svg());
  }
  if (want('pass')) {
    const pg = new Page(paper, 'Bedtime passes', { subtitle: 'Give one pass each night. It can be swapped for one quick thing after lights out. Then it is time to stay in bed!', noName: true });
    const { cw, ch } = cardGrid(pg, 4, 2);
    for (let i = 0; i < 4; i++) {
      const x = pg.left + (i % 2) * cw, y = pg.y + Math.floor(i / 2) * ch, c = PALETTE[(i + 3) % PALETTE.length];
      pg.add(`<rect x="${x + 3}" y="${y + 3}" width="${cw - 6}" height="${ch - 6}" rx="10" fill="#f5f2ff" stroke="${c}" stroke-width="1" stroke-dasharray="3 2"/>`);
      pg.add(emoji('🌙', x + cw / 2, y + 26, 24) + txt(x + cw / 2, y + 52, 'Bedtime pass', 9, { colour: c }));
      if (name) pg.add(txt(x + cw / 2, y + 62, `for ${name}`, 5.4, { font: FONT, colour: SOFT }));
      textLines(pg, wrap('Swap me for one: a drink, a hug, or a trip to the toilet.', 26), x + cw / 2, y + ch - 30, 4.8, { anchor: 'middle', font: FONT, weight: 700 });
    }
    pages.push(pg.svg());
  }
  if (want('chart')) {
    const pg = new Page(paper, name ? `${possessive(name)} stay in bed chart` : 'My stay in bed chart', { subtitle: 'Colour a moon every morning after a night of staying in bed. 14 moons earns a special treat!', noName: !!name });
    const { cw, ch } = cardGrid({ width: pg.width, room: pg.room - 30 }, 14, 4);
    for (let i = 0; i < 14; i++) {
      const x = pg.left + (i % 4) * cw, y = pg.y + Math.floor(i / 4) * ch, r = Math.min(cw, ch) * 0.32;
      pg.add(`<path d="M${x + cw / 2 + r * 0.3} ${y + ch / 2 - r} A${r} ${r} 0 1 0 ${x + cw / 2 + r * 0.3} ${y + ch / 2 + r} A${r * 0.78} ${r * 0.78} 0 1 1 ${x + cw / 2 + r * 0.3} ${y + ch / 2 - r} Z" fill="#fff8d6" stroke="${PALETTE[i % PALETTE.length]}" stroke-width="1.2"/>` + txt(x + cw / 2 - r * 0.1, y + ch / 2 + 2, i + 1, 5.4, { colour: PALETTE[i % PALETTE.length] }));
    }
    const by = pg.bottom - 22;
    pg.add(panel(pg.left, by, pg.width, 20, '#fff6e0', '#ffb938', 6) + pic(ART('present'), pg.left + 12, by + 10, 14) + txt(pg.left + 24, by + 12, 'My special treat will be', 5, { anchor: 'start', font: FONT }) + `<line x1="${pg.left + 82}" x2="${pg.right - 8}" y1="${by + 12.6}" y2="${by + 12.6}" stroke="#b9b3d6" stroke-width="0.4"/>`);
    pages.push(pg.svg());
  }
  if (want('routine')) {
    const r = packRun('routine', { routine: 'bedtime', layout: 'cards', name }, paper, +o.seed || 1);
    pages.push(...r.sheets);
  }
  return pages;
}

// ================================================================ food explorer
function makeFoods(o, paper) {
  const name = nameOf(o.name, '');
  const want = (k) => o[k] !== false;
  const pages = [];
  if (want('passport')) {
    const pg = new Page(paper, name ? `${possessive(name)} food explorer passport` : 'Food explorer passport', { subtitle: 'Brave explorers try new foods! Draw or write each food, then circle a face. Just one tiny taste counts.', noName: !!name });
    const { cw, ch } = cardGrid(pg, 12, 3);
    for (let i = 0; i < 12; i++) {
      const x = pg.left + (i % 3) * cw, y = pg.y + Math.floor(i / 3) * ch, c = PALETTE[i % PALETTE.length];
      pg.add(panel(x + 2, y + 2, cw - 4, ch - 4, '#fff', c, 7));
      pg.add(`<rect x="${x + 7}" y="${y + 7}" width="${cw - 14}" height="${ch * 0.5}" rx="5" fill="${TINTS[i % TINTS.length]}"/>` + txt(x + cw / 2, y + 7 + ch * 0.28, 'I tried', 4.4, { font: FONT, colour: SOFT }));
      pg.add(`<line x1="${x + 8}" x2="${x + cw - 8}" y1="${y + ch * 0.5 + 16}" y2="${y + ch * 0.5 + 16}" stroke="#c9c3e3" stroke-width="0.4"/>`);
      ['sad', 'calm', 'happy'].forEach((m, k) => pg.add(face(x + cw * (k + 1) / 4, y + ch - 11, 5, m, false)));
    }
    pages.push(pg.svg());
  }
  if (want('rainbow')) {
    const pg = new Page(paper, 'Eat the rainbow', { subtitle: 'Colour a box each time you eat a fruit or vegetable of that colour. Can you eat every colour this week?' });
    const rows = [['Red', '#ff4d4d', '🍓'], ['Orange', '#ff9f1c', '🥕'], ['Yellow', '#ffd23f', '🍌'], ['Green', '#3fbf60', '🥦'], ['Blue and purple', '#9b5de5', '🍇'], ['White and brown', '#b08968', '🍄']];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], lw = 48, cw = (pg.width - lw) / 7, rh = Math.min(30, (pg.room - 16) / rows.length);
    days.forEach((d, i) => pg.add(txt(pg.left + lw + cw * (i + 0.5), pg.y + 5, d, 4.6, { colour: SOFT })));
    rows.forEach(([nm, c, e], r) => {
      const y = pg.y + 9 + r * rh;
      pg.add(`<rect x="${pg.left}" y="${y + 1}" width="${lw - 3}" height="${rh - 2}" rx="5" fill="${c}"/>` + emoji(e, pg.left + 9, y + rh / 2, rh * 0.42) + txt(pg.left + 17, y + rh / 2 + 1.6, nm, fitFont(nm, 4.6, lw - 20, 0.5), { anchor: 'start', colour: '#fff' }));
      days.forEach((d, i) => pg.add(`<rect x="${pg.left + lw + cw * i + 1.5}" y="${y + 2}" width="${cw - 3}" height="${rh - 4}" rx="4" fill="#fff" stroke="${c}" stroke-width="0.8"/>`));
    });
    pages.push(pg.svg());
  }
  if (want('plate')) {
    const pg = new Page(paper, 'My favourite plate', { subtitle: 'Draw a meal you love. Try to include something from every part of the plate!' });
    const cx = pg.w / 2 - 6, cy = pg.y + 92, R = 72;
    pg.add(`<circle cx="${cx}" cy="${cy}" r="${R + 8}" fill="#fff" stroke="${INK}" stroke-width="0.9"/><circle cx="${cx}" cy="${cy}" r="${R}" fill="#fff" stroke="#d9d4ec" stroke-width="0.6"/>`);
    [['Fruit and veg', '#3fbf60', -150, 30], ['Grains', '#ffb938', 30, 120], ['Protein', '#ff6b6b', 120, 210]].forEach(([t, c, a0, a1]) => {
      const r0 = (a0 * Math.PI) / 180, r1 = (a1 * Math.PI) / 180, mid = (r0 + r1) / 2;
      pg.add(`<path d="M${cx} ${cy} L${cx + Math.cos(r0) * R} ${cy + Math.sin(r0) * R} A${R} ${R} 0 0 1 ${cx + Math.cos(r1) * R} ${cy + Math.sin(r1) * R} Z" fill="none" stroke="${c}" stroke-width="0.8"/>`);
      pg.add(txt(cx + Math.cos(mid) * R * 0.72, cy + Math.sin(mid) * R * 0.72 + 2, t, 5, { colour: c }));
    });
    pg.add(emoji('🥛', cx + R + 16, cy - R + 14, 16));
    const ly = cy + R + 20;
    pg.add(txt(pg.left, ly, 'My meal is called', 5, { anchor: 'start', font: FONT }) + `<line x1="${pg.left + 48}" x2="${pg.right}" y1="${ly + 0.6}" y2="${ly + 0.6}" stroke="#b9b3d6" stroke-width="0.4"/>`);
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ social stories
const SOCIAL = {
  dentist: { title: 'Going to the dentist', pages: [['🦷', 'My name is {name}. Soon I am going to the dentist. A dentist is a friendly helper who looks after teeth.'], ['🚗', '{who} will come with me. We might wait in the waiting room for a little while. I can read a book while I wait.'], ['💺', 'When it is my turn, I sit in a big chair. The chair can go up and down and lean back. That is okay.'], ['💡', 'The dentist might shine a bright light. I open my mouth wide, like a lion!'], ['🪥', 'The dentist uses a little mirror to count my teeth. It might tickle. I can keep my hands still and breathe slowly.'], ['🌟', 'When it is finished, the dentist says well done. I did it! My teeth are strong and healthy.']] },
  doctor: { title: 'Going to the doctor', pages: [['🩺', 'My name is {name}. Soon I am going to see the doctor. Doctors help us stay well.'], ['⏳', '{who} will be with me. We might wait for a while, so I can bring a toy.'], ['👂', 'The doctor might look in my ears and my mouth with a little light. I say aaah!'], ['💓', 'The doctor might listen to my heart. The stethoscope feels cold, but it does not hurt.'], ['🤝', 'If I feel worried, I can hold a hand and say how I feel. Doctors are used to helping children.'], ['🌟', 'When it is finished, I can feel proud. I was brave today!']] },
  haircut: { title: 'Having a haircut', pages: [['✂️', 'My name is {name}. Today I am having a haircut. Hair grows all the time, so everyone needs a haircut sometimes.'], ['💺', 'I sit in a special chair. It might go up high so the hairdresser can reach. I might wear a cape.'], ['💦', 'The hairdresser might spray some water on my hair. It feels cool and a bit tickly.'], ['🔊', 'The scissors go snip, snip. Clippers might buzz. The sounds can be loud, but cutting hair does not hurt.'], ['🧸', 'I try to keep my head still. I can hold a toy or count slowly while I wait.'], ['🪞', 'When it is finished, I look in the mirror. I look great! I did it!']] },
  baby: { title: 'A new baby is coming', pages: [['👶', 'My name is {name}. Soon a new baby is coming to our family.'], ['😴', 'New babies sleep a lot and cry a lot. Crying is how babies talk. It does not mean they are cross with me.'], ['🍼', 'Grown-ups spend lots of time feeding and changing the baby. Sometimes I will need to wait.'], ['🤗', 'Even when the grown-ups are busy with the baby, they still love me just as much as before.'], ['🧸', 'I can be a great helper. I can pass a nappy, sing a song or show the baby my toys.'], ['💛', 'When I feel left out, I can say: I need a cuddle too. Our family is growing, and there is lots of love for everyone.']] },
  moving: { title: 'Moving to a new home', pages: [['🏠', 'My name is {name}. Soon my family is moving to a new home.'], ['📦', 'We will pack our things in boxes. My toys will come with us to the new home.'], ['🚚', 'On moving day, a big van will carry our boxes. It might be a busy, noisy day.'], ['🛏️', 'In the new home, I will have a place to sleep. It might feel strange at first, and that is okay.'], ['🗺️', 'We can explore the new place together and find new parks and new friends.'], ['💛', 'Home is wherever our family is. Soon the new house will feel like home.']] },
  flying: { title: 'Going on an aeroplane', pages: [['✈️', 'My name is {name}. Soon I am going on an aeroplane!'], ['🧳', 'At the airport, we give our big bags to the airport helpers. We keep a small bag with snacks and toys.'], ['🚶', 'We walk through a special gate. Helpers check our bags to keep everyone safe.'], ['💺', 'On the plane, I sit in my seat and wear a seat belt. It clicks when it is closed.'], ['☁️', 'The plane goes fast and then up into the sky. My ears might feel funny. Chewing or drinking can help.'], ['🌍', 'Soon we land somewhere new. I did it! Flying is an adventure.']] },
  sleepover: { title: 'My first sleepover', pages: [['🌙', 'My name is {name}. Soon I am having a sleepover.'], ['🎒', 'I will pack my pyjamas, my toothbrush and my favourite teddy.'], ['🍕', 'We might play games, eat dinner and watch a film. It will be fun!'], ['🛏️', 'At bedtime, I will sleep in a different bed. It might feel strange, and that is okay.'], ['📞', 'If I feel worried or miss home, I can tell a grown-up. They will help me feel better.'], ['🌟', 'In the morning, I can feel proud. I did a sleepover!']] },
};

function makeSocialStory(o, paper) {
  const st = SOCIAL[o.topic] || SOCIAL.dentist;
  const name = nameOf(o.name, '') || 'Mia';
  const who = String(o.who || '').trim().slice(0, 20) || 'My grown-up';
  const fill = (t) => t.replace(/\{name\}/g, name).replace(/\{who\}/g, who);
  const panels = [...st.pages.map(([e, t]) => ({ e, t: fill(t) })), { e: 'draw', t: 'Draw me doing it! How did I feel?' }];
  const pages = [];
  for (let p0 = 0; p0 < panels.length; p0 += 2) {
    const pg = new Page(paper, p0 ? '' : `${st.title}`, { bare: !!p0, subtitle: p0 ? '' : `A story for ${name}. Read it together a few times before the day.`, noName: true });
    const top = p0 ? pg.m : pg.y, h = (pg.bottom - top - 4) / 2;
    panels.slice(p0, p0 + 2).forEach((pn, k) => {
      const y = top + k * (h + 4), i = p0 + k, c = PALETTE[i % PALETTE.length];
      pg.add(panel(pg.left, y, pg.width, h, TINTS[i % TINTS.length], c, 10));
      if (pn.e === 'draw') {
        pg.add(`<rect x="${pg.left + 8}" y="${y + 8}" width="${pg.width - 16}" height="${h - 42}" rx="6" fill="#fff" stroke="${c}" stroke-width="0.6" stroke-dasharray="3 2"/>`);
        pg.add(txt(pg.w / 2, y + h - 26, pn.t, 7, { colour: c }));
        ['happy', 'proud', 'worried', 'calm'].forEach((m, q) => pg.add(face(pg.left + pg.width * (q + 1) / 5, y + h - 12, 6, m, false)));
      } else {
        pg.add(emoji(pn.e, pg.w / 2, y + h * 0.36, h * 0.38));
        textLines(pg, wrap(pn.t, 34), pg.w / 2, y + h * 0.68, 7.4, { anchor: 'middle', weight: 800, font: TITLE_FONT, colour: INK, lh: 1.35 });
        pg.add(txt(pg.right - 8, y + h - 5, i + 1, 4.4, { anchor: 'end', colour: c }));
      }
    });
    if (p0) pg.footer = () => {};
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ personalised storybook (Plus)
const STORYBOOKS = {
  star: { title: '{name} and the Lost Star', pages: [
    ['house', 'One night, {name} looked out of the window and saw a little star falling from the sky.'],
    ['owl', '"Hoo!" said a wise old owl. "That star is lost. Will you help it get home?"'],
    ['rocket', '{name} built a shiny rocket from boxes and paint. 3, 2, 1... Blast off!'],
    ['whale', 'They zoomed past the clouds and waved to a sleepy whale in the sea far below.'],
    ['robot', 'On the moon, a friendly robot pointed the way. "Beep boop! The star went that way!"'],
    ['unicorn', 'A sparkly unicorn gave {name} a ride all the way to the end of the rainbow.'],
    ['rainbow', 'There was the little star, crying. "I cannot find my way home!" {name} held it gently and flew up, up, up.'],
    ['teddy', 'Back in bed, {name} snuggled up with Teddy. Outside, a little star twinkled: "Thank you, {name}!"']] },
  party: { title: '{name}\'s Big Animal Party', pages: [
    ['cake', 'It was {name}\'s birthday, and {name} had a big idea: an animal party!'],
    ['elephant', 'Elephant came first, with a trunk full of balloons. Toot toot!'],
    ['giraffe', 'Giraffe hung the bunting up high, where nobody else could reach.'],
    ['penguin', 'Penguin brought ice cream and slid all the way across the floor. Wheee!'],
    ['frog', 'Frog jumped so high in the dancing game that everybody laughed.'],
    ['bee', 'Bee buzzed "Happy Birthday", and everyone joined in.'],
    ['turtle', 'Turtle arrived last, very slowly, with the best present of all: a card that said "You are the kindest friend".'],
    ['dog', '{name} gave everyone a great big hug. It was the best party ever!']] },
  sea: { title: '{name} Under the Sea', pages: [
    ['boat', '{name} sailed a little boat out onto the big blue sea.'],
    ['fish', 'Splash! A stripy fish popped up. "Come and see our secret garden!"'],
    ['octopus', '{name} put on a diving mask and met Octopus, who was juggling shells with eight arms.'],
    ['turtle', 'Old Turtle gave {name} a ride past waving seaweed and bright coral.'],
    ['whale', 'Then everything went dark. It was a giant whale, and she wanted to sing!'],
    ['penguin', 'The song was so beautiful that a penguin swam all the way from the ice to listen.'],
    ['rainbow', 'When it was time to go, the sun painted a rainbow over the water, and all the sea friends waved goodbye.'],
    ['house', 'That night, {name} fell asleep and dreamed of the sea. Swish, swash, goodnight.']] },
};

function makeStorybook(o, paper) {
  const bk = STORYBOOKS[o.story] || STORYBOOKS.star;
  const name = nameOf(o.name, '') || 'Mia';
  const from = String(o.from || '').trim().slice(0, 30);
  const fill = (t) => t.replace(/\{name\}/g, name);
  const title = fill(bk.title);
  const pages = [];
  // Cover
  const cv = new Page(paper, '', { bare: true, tint: '#fffdf8' });
  cv.add(`<rect x="${cv.left - 3}" y="${cv.m - 3}" width="${cv.width + 6}" height="${cv.bottom - cv.m + 3}" rx="12" fill="#fff" stroke="#b06cff" stroke-width="1.4"/>`);
  let y = cv.m + 32;
  wrap(title, 18).forEach((l) => { bubbleText(cv, l, cv.w / 2, y, cv.width - 24, 20); y += 20; });
  const s = Math.min(cv.width - 30, cv.bottom - y - 34);
  cv.add(`<g transform="translate(${cv.w / 2 - s / 2} ${y + 4}) scale(${(s / 200).toFixed(4)})">${colouringArt(bk.pages[0][0])}</g>`);
  cv.add(txt(cv.w / 2, cv.bottom - 14, `A story starring ${name}`, 6, { colour: '#8a3fd1' }));
  cv.footer = () => {};
  pages.push(cv.svg());
  // Dedication
  const dd = new Page(paper, '', { bare: true, tint: '#fffdf8' });
  dd.add(pic(ART('heart'), dd.w / 2, dd.m + 80, 40));
  dd.add(txt(dd.w / 2, dd.m + 120, `This book was made for ${name}`, 9, { colour: INK }));
  if (from) dd.add(txt(dd.w / 2, dd.m + 134, `with love from ${from}`, 7, { colour: '#e0457b' }));
  else dd.add(txt(dd.w / 2, dd.m + 134, 'with love from', 7, { colour: '#e0457b' }) + `<line x1="${dd.w / 2 - 40}" x2="${dd.w / 2 + 40}" y1="${dd.m + 150}" y2="${dd.m + 150}" stroke="#b9b3d6" stroke-width="0.5"/>`);
  dd.add(txt(dd.w / 2, dd.bottom - 20, 'Colour the pictures as you read the story together.', 4.6, { font: FONT, colour: SOFT }));
  dd.footer = () => {};
  pages.push(dd.svg());
  bk.pages.forEach(([art, text], i) => {
    const pg = new Page(paper, '', { bare: true });
    const s2 = Math.min(pg.width - 20, (pg.bottom - pg.m) * 0.6);
    pg.add(`<rect x="${pg.left}" y="${pg.m}" width="${pg.width}" height="${s2 + 10}" rx="10" fill="#fff" stroke="#e2ddf2" stroke-width="0.6"/>`);
    pg.add(`<g transform="translate(${pg.w / 2 - s2 / 2} ${pg.m + 5}) scale(${(s2 / 200).toFixed(4)})">${colouringArt(art)}</g>`);
    const lines = wrap(fill(text), 30), fs = 8.4;
    const ty = pg.m + s2 + 16 + Math.max(0, (pg.bottom - pg.m - s2 - 30 - lines.length * fs * 1.4) / 2) + fs;
    textLines(pg, lines, pg.w / 2, ty, fs, { anchor: 'middle', weight: 800, font: TITLE_FONT, colour: INK, lh: 1.4 });
    pg.add(txt(pg.w / 2, pg.bottom + 1, i + 1, 4.6, { colour: '#b8b3cc' }));
    pg.footer = () => {};
    pages.push(pg.svg());
  });
  // The end
  const end = new Page(paper, '', { bare: true, tint: '#fffdf8' });
  bubbleText(end, 'The End', end.w / 2, end.m + 34, end.width - 40, 24);
  end.add(`<rect x="${end.left + 6}" y="${end.m + 48}" width="${end.width - 12}" height="${end.bottom - end.m - 70}" rx="10" fill="#fff" stroke="#b06cff" stroke-width="0.7" stroke-dasharray="3 2"/>` + txt(end.w / 2, end.m + 58, 'Draw your favourite part of the story', 5.4, { font: FONT, colour: SOFT }));
  end.add(txt(end.w / 2, end.bottom - 8, 'Made at printpals.web.app', 4, { font: FONT, colour: '#b8b3cc' }));
  end.footer = () => {};
  pages.push(end.svg());
  return pages;
}

// ================================================================ conversation cards
const TALK = {
  dinner: ['If you could have any superpower, what would it be?', 'What made you laugh today?', 'If animals could talk, which one would be the funniest?', 'What was the best thing that happened today?', 'If you could eat only one food forever, what would it be?', 'Who was kind to you today?',
    'What would you do if you were invisible for a day?', 'If you had a magic wand, what would you change?', 'What is something new you learned today?', 'Where in the world would you like to visit?', 'What would you name a brand new colour?', 'Which animal would you invite to dinner?'],
  car: ['I spy with my little eye... you choose!', 'Would you rather fly like a bird or swim like a fish?', 'Make up a song about where we are going.', 'Name 5 things that are red.', 'Would you rather have wheels or wings?', 'Which animal would be the silliest driver?',
    'Count all the blue cars you can see.', 'If this car could talk, what would it say?', 'What would you build with a million blocks?', 'Tell a story that starts: One day a giant...', 'Would you rather live in a treehouse or a castle?', 'What is your favourite sound?'],
  bedtime: ['What was the best part of your day?', 'What was a tricky part of your day?', 'What are you looking forward to tomorrow?', 'Who made you smile today?', 'What is one thing you are proud of?', 'If you could dream about anything, what would it be?',
    'What was the kindest thing you saw today?', 'When did you feel brave today?', 'What is something you want to learn?', 'What would you like to say thank you for?', 'What is your favourite thing about our family?', 'What should we do together this weekend?'],
  grandparents: ['What games did you play when you were little?', 'What was your favourite food as a child?', 'What was your home like when you were my age?', 'Who was your best friend?', 'What is the funniest thing that ever happened to you?', 'What songs did you sing when you were little?',
    'What was your first job?', 'What is your favourite memory of my mum or dad?', 'What did you want to be when you grew up?', 'What is the best advice anyone gave you?', 'What was school like for you?', 'What do you love doing with me?'],
};
const TALK_NAMES = { dinner: 'Dinner table questions', car: 'Car journey games', bedtime: 'Bedtime chats', grandparents: 'Questions for grandparents' };

function makeTalkCards(o, paper) {
  const sets = o.set === 'all' ? Object.keys(TALK) : [TALK[o.set] ? o.set : 'dinner'];
  return sets.map((k, si) => {
    const pg = new Page(paper, TALK_NAMES[k], { subtitle: 'Cut out the cards and keep them in a jar. Pick one and everyone answers!', noName: true });
    const { cw, ch } = cardGrid(pg, 12, 3);
    TALK[k].forEach((q, i) => {
      const x = pg.left + (i % 3) * cw, y = pg.y + Math.floor(i / 3) * ch, c = PALETTE[(i + si) % PALETTE.length];
      pg.add(`<rect x="${x + 2}" y="${y + 2}" width="${cw - 4}" height="${ch - 4}" rx="7" fill="${TINTS[(i + si) % TINTS.length]}" stroke="#b9b3d6" stroke-width="0.4" stroke-dasharray="2 1.5"/>`);
      pg.add(`<circle cx="${x + cw / 2}" cy="${y + 12}" r="5" fill="${c}"/>` + txt(x + cw / 2, y + 14, '?', 6, { colour: '#fff' }));
      textLines(pg, wrap(q, 20), x + cw / 2, y + 26, 4.8, { anchor: 'middle', weight: 800, font: TITLE_FONT, colour: INK });
    });
    return pg.svg();
  });
}

// ================================================================ gratitude journal
function makeGratitude(o, paper) {
  const name = nameOf(o.name, '');
  const days = o.kind === 'week' ? 0 : 7;
  const pages = [];
  if (o.kind === 'week') {
    const pg = new Page(paper, name ? `${possessive(name)} thankful week` : 'My thankful week', { subtitle: 'Every day, write or draw one thing you are thankful for.', noName: !!name });
    const rh = (pg.room - 2) / 7;
    WEEKDAYS.forEach((d, i) => {
      const y = pg.y + i * rh, c = PALETTE[i % PALETTE.length];
      pg.add(panel(pg.left, y + 1, pg.width, rh - 2, TINTS[i % TINTS.length], c, 6) + txt(pg.left + 6, y + rh / 2 + 2, d, 6, { anchor: 'start', colour: c }));
      pg.add(`<rect x="${pg.left + 42}" y="${y + 4}" width="${rh - 8}" height="${rh - 8}" rx="4" fill="#fff" stroke="#d9d4ec" stroke-width="0.5"/>`);
      pg.add(`<line x1="${pg.left + 38 + rh}" x2="${pg.right - 6}" y1="${y + rh * 0.62}" y2="${y + rh * 0.62}" stroke="#c9c3e3" stroke-width="0.4"/>`);
    });
    pages.push(pg.svg());
    return pages;
  }
  for (let d = 0; d < days; d++) {
    const pg = new Page(paper, name ? `${possessive(name)} happy journal` : 'My happy journal', { subtitle: `Day ${d + 1}. Date: ____________`, noName: !!name });
    const blocks = [['Three good things about today', 3, '#ff6b6b'], ['Today I was kind when', 2, '#3fbfa8'], ['Today I am proud that', 2, '#6c8cff']];
    let y = pg.y;
    blocks.forEach(([t, n, c], k) => {
      const h = 12 + n * 11;
      pg.add(panel(pg.left, y, pg.width, h, TINTS[k * 2], c, 7) + txt(pg.left + 6, y + 9, t, 5.6, { anchor: 'start', colour: c }));
      for (let l = 1; l <= n; l++) pg.add((n === 3 ? txt(pg.left + 7, y + 8 + l * 11, `${l}.`, 4.6, { anchor: 'start', colour: c }) : '') + `<line x1="${pg.left + 13}" x2="${pg.right - 6}" y1="${y + 9 + l * 11}" y2="${y + 9 + l * 11}" stroke="#c9c3e3" stroke-width="0.4"/>`);
      y += h + 5;
    });
    pg.add(txt(pg.left, y + 5, 'Today I felt', 5, { anchor: 'start', font: FONT }));
    ['happy', 'calm', 'proud', 'tired', 'sad', 'silly'].forEach((m, q) => pg.add(face(pg.left + 44 + q * 23, y + 3, 7, m, false)));
    y += 16;
    pg.add(`<rect x="${pg.left}" y="${y}" width="${pg.width}" height="${pg.bottom - y - 2}" rx="7" fill="#fff" stroke="#b06cff" stroke-width="0.6" stroke-dasharray="3 2"/>` + txt(pg.left + 5, y + 7, 'Draw the best part of your day', 4.4, { anchor: 'start', font: FONT, colour: SOFT }));
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ potty training pack
const POTTY_STEPS = [['🩲', 'Pull down'], ['🚽', 'Sit on the potty'], ['💧', 'Wee or poo'], ['🧻', 'Wipe'], ['👖', 'Pull up'], ['🌊', 'Flush'], ['🧼', 'Wash my hands']];

function makePotty(o, paper) {
  const name = nameOf(o.name, '');
  const want = (k) => o[k] !== false;
  const pages = [];
  if (want('steps')) {
    const pg = new Page(paper, 'Using the potty', { subtitle: 'Follow the pictures, one step at a time. Point to each one as you go!', noName: true });
    const rh = (pg.room - 2) / POTTY_STEPS.length;
    POTTY_STEPS.forEach(([e, t], i) => {
      const y = pg.y + i * rh, c = PALETTE[i % PALETTE.length];
      pg.add(panel(pg.left, y + 1, pg.width, rh - 2, TINTS[i % TINTS.length], c, 8));
      pg.add(`<circle cx="${pg.left + 10}" cy="${y + rh / 2}" r="5.5" fill="${c}"/>` + txt(pg.left + 10, y + rh / 2 + 2.2, i + 1, 6, { colour: '#fff' }));
      pg.add(emoji(e, pg.left + 32, y + rh / 2, rh * 0.62) + txt(pg.left + 50, y + rh / 2 + 3, t, 9, { anchor: 'start', colour: INK }));
    });
    pages.push(pg.svg());
  }
  if (want('chart')) {
    const r = packRun('reward', { name, goal: 'I used the potty!', theme: o.theme || 'stars', spaces: '20', reward: '' }, paper, +o.seed || 1);
    pages.push(...r.sheets);
  }
  if (want('certificate')) pages.push(packCertificate(paper, name, 'You used the potty all by yourself! You are growing up so fast.'));
  return pages;
}

Object.assign(MAKERS, { calmkit: makeCalmKit, sleep: makeSleep, foods: makeFoods, socialstory: makeSocialStory, storybook: makeStorybook, talkcards: makeTalkCards, gratitude: makeGratitude, potty: makePotty });
