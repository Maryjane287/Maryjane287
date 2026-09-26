// PrintPals batch 1: routines, money, word problems, times tables,
// telling the time, mazes, crosswords and reward charts.

const EMOJI_FONT = "'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','Twemoji Mozilla',sans-serif";
const PALETTE = ['#ff6b6b', '#ffb938', '#3fbfa8', '#6c8cff', '#b06cff', '#ff7eb6', '#35b5e5', '#8bc34a'];
const TINTS = ['#fff0f0', '#fff6e0', '#e8f8f4', '#eef2ff', '#f5edff', '#fff0f7', '#e6f6fc', '#f1f8e6'];

// Our painted pictures replace the matching emoji everywhere, so sheets look the same on every device.
const EMOJI_ART = {
  '🐜': 'ant', '🍎': 'apple', '🎈': 'balloon', '🍌': 'banana', '🐻': 'bear', '🫐': 'blueberry', '🥣': 'bowl', '🎂': 'cake',
  '🐱': 'cat', '🐈': 'cat', '🐥': 'chick', '🐤': 'chick', '🍪': 'cookie', '🧁': 'cupcake', '🌼': 'daisy', '🐶': 'dog', '🐕': 'dog',
  '🍩': 'donut', '🥚': 'egg', '✉️': 'envelope', '🐟': 'fish', '🐠': 'fish', '🦍': 'gorilla', '🎩': 'hat', '❤️': 'heart', '💖': 'heart',
  '🐞': 'ladybird', '🦁': 'lion', '🍭': 'lolly', '🏅': 'medal', '🐒': 'monkey', '🐵': 'monkey', '🍄': 'mushroom', '🪺': 'nest',
  '🐙': 'octopus', '🍊': 'orange', '🐷': 'pig', '🐖': 'pig', '🎉': 'popper', '🎁': 'present', '🌈': 'rainbow', '🌹': 'rose',
  '⭐': 'star', '🌟': 'star', '🍓': 'strawberry', '☀️': 'sun', '🌞': 'sun', '🌻': 'sunflower', '🌷': 'tulip', '🐢': 'turtle', '🦓': 'zebra',
  '🧸': 'bear',
};
function artFor(ch) { return EMOJI_ART[ch] ? `img/${EMOJI_ART[ch]}.webp` : ''; }

function emoji(ch, x, y, size) {
  const art = artFor(ch);
  if (art) return `<image href="${art}" x="${(x - size * 0.56).toFixed(2)}" y="${(y - size * 0.56).toFixed(2)}" width="${(size * 1.12).toFixed(2)}" height="${(size * 1.12).toFixed(2)}" preserveAspectRatio="xMidYMid meet"/>`;
  return `<text x="${x}" y="${y + size * 0.36}" font-size="${size}" text-anchor="middle" font-family="${EMOJI_FONT}">${ch}</text>`;
}

function wrap(text, maxChars) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = '';
  for (let w of words) {
    // A very long word with no spaces is split so it never runs off the page.
    while (w.length > maxChars) { if (line) { lines.push(line); line = ''; } lines.push(w.slice(0, maxChars)); w = w.slice(maxChars); }
    if ((line + ' ' + w).trim().length > maxChars && line) { lines.push(line); line = w; }
    else line = (line + ' ' + w).trim();
  }
  if (line) lines.push(line);
  return lines;
}

function textLines(pg, lines, x, y, fs, opts = {}) {
  const { weight = 700, colour = INK, anchor = 'start', lh = 1.32, font = FONT } = opts;
  lines.forEach((l, i) => pg.add(`<text x="${x}" y="${y + i * fs * lh}" font-family="${font}" font-weight="${weight}" font-size="${fs}" fill="${colour}" text-anchor="${anchor}">${esc(l)}</text>`));
  return y + lines.length * fs * lh;
}

function possessive(name) {
  const n = (name || '').trim();
  if (!n) return 'My';
  return /s$/i.test(n) ? `${n}'` : `${n}'s`;
}

// ================================================================ routines
const ROUTINES = {
  morning: ['⏰ Wake up', '🚽 Toilet', '🧼 Wash my face', '🪥 Brush my teeth', '👕 Get dressed', '🥣 Eat breakfast', '🎒 Pack my bag', '👟 Put my shoes on'],
  bedtime: ['🍽️ Eat dinner', '🛁 Bath time', '👚 Pyjamas on', '🪥 Brush my teeth', '🚽 Toilet', '📖 Story time', '🤗 Cuddles', '😴 Sleep'],
  school: ['🎒 Unpack my bag', '🧼 Wash my hands', '🍎 Snack', '📝 Homework', '📚 Reading', '🧸 Play time', '🧹 Tidy up'],
  weekend: ['🥞 Breakfast', '🧹 Tidy my room', '🌳 Play outside', '🥪 Lunch', '🎨 Arts and crafts', '📞 Call family', '🛁 Bath time', '📖 Story time'],
};
const ROUTINE_TITLES = { morning: 'Morning Routine', bedtime: 'Bedtime Routine', school: 'After School Routine', weekend: 'Weekend Routine', custom: 'My Routine' };
const KEY_EMOJI = [
  [/teeth|brush/i, '🪥'], [/bath|shower/i, '🛁'], [/dress|clothes/i, '👕'], [/breakfast|cereal/i, '🥣'], [/lunch/i, '🥪'],
  [/dinner|supper|eat/i, '🍽️'], [/snack/i, '🍎'], [/shoe/i, '👟'], [/bag/i, '🎒'], [/toilet|potty|wee/i, '🚽'],
  [/wash|hands|soap/i, '🧼'], [/story|read|book/i, '📚'], [/sleep|bed/i, '😴'], [/wake|alarm/i, '⏰'], [/homework|write/i, '📝'],
  [/play/i, '🧸'], [/tidy|clean/i, '🧹'], [/hair|comb/i, '🪮'], [/pyjama|pajama/i, '👚'], [/water|drink/i, '🥛'],
  [/pray/i, '🙏'], [/hug|cuddle|kiss/i, '🤗'], [/tv|screen|tablet/i, '📺'], [/music|piano/i, '🎹'], [/walk|park|outside/i, '🌳'],
  [/medicine/i, '💊'], [/dog|pet|feed/i, '🐶'], [/car|school|bus/i, '🚌'], [/coat|jacket/i, '🧥'], [/art|draw|colour|color/i, '🎨'],
];

function parseSteps(text) {
  return String(text || '').split('\n').map((l) => l.trim()).filter(Boolean).slice(0, 12).map((l) => {
    const m = /^(\p{Extended_Pictographic}(?:️|‍\p{Extended_Pictographic}|\p{Emoji_Modifier})*)\s*(.*)$/u.exec(l);
    if (m) return { pic: m[1], label: m[2] || '' };
    const hit = KEY_EMOJI.find(([re]) => re.test(l));
    return { pic: hit ? hit[1] : '⭐', label: l };
  });
}

function makeRoutine(o, paper) {
  const steps = parseSteps(o.steps);
  if (!steps.length) steps.push(...parseSteps(ROUTINES.morning.join('\n')));
  const title = `${possessive(o.name)} ${ROUTINE_TITLES[o.routine] || 'Routine'}`;
  const pages = [];
  if (o.layout === 'cards') {
    // Big picture cards to cut out and stick in order.
    const cols = 2;
    let pg = null, cardH = 58;
    steps.forEach((s, i) => {
      const slot = i % 8;
      if (slot === 0) {
        if (pg) pages.push(pg.svg());
        pg = new Page(paper, title, { subtitle: 'Cut out the cards and put them in order on the wall or the fridge.', noName: true });
        cardH = Math.min(58, (pg.room - 3) / 4 - 7);
      }
      const cw = pg.width / cols;
      const x = pg.left + (slot % cols) * cw, y = pg.y + 3 + Math.floor(slot / cols) * (cardH + 7);
      const c = i % PALETTE.length;
      pg.add(`<rect x="${x + 2}" y="${y}" width="${cw - 4}" height="${cardH}" rx="7" fill="${TINTS[c]}" stroke="${PALETTE[c]}" stroke-width="0.9"/>`);
      pg.add(`<rect x="${x - 1}" y="${y - 3}" width="${cw + 2}" height="${cardH + 6}" rx="9" fill="none" stroke="#c9c3e3" stroke-width="0.3" stroke-dasharray="2 1.5"/>`);
      pg.add(`<circle cx="${x + 11}" cy="${y + 10}" r="5.5" fill="${PALETTE[c]}"/><text x="${x + 11}" y="${y + 12.2}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="6" fill="#fff">${i + 1}</text>`);
      pg.add(emoji(s.pic, x + cw / 2, y + cardH * 0.4, cardH * 0.4));
      const lines = wrap(s.label, 22);
      textLines(pg, lines, x + cw / 2, y + cardH - 8 - (lines.length - 1) * 3.6, 6, { anchor: 'middle', weight: 800, font: TITLE_FONT });
    });
    pages.push(pg.svg());
    return pages;
  }
  // A weekly checklist with a tick for every day.
  const pg = new Page(paper, title, { subtitle: 'Tick each step when you have done it. You can do it!', noName: true });
  const days = o.week === 'school' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dayW = 11.5;
  const labelW = pg.width - days.length * dayW;
  const rowH = Math.min(24, (pg.room - 10) / steps.length);
  days.forEach((d, i) => pg.add(`<text x="${pg.left + labelW + i * dayW + dayW / 2}" y="${pg.y + 2}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.6" fill="${SOFT}">${d}</text>`));
  let y = pg.y + 6;
  steps.forEach((s, i) => {
    const c = i % PALETTE.length;
    pg.add(`<rect x="${pg.left}" y="${y}" width="${pg.width}" height="${rowH - 2.5}" rx="5" fill="${TINTS[c]}"/>`);
    pg.add(`<rect x="${pg.left}" y="${y}" width="3" height="${rowH - 2.5}" rx="1.5" fill="${PALETTE[c]}"/>`);
    const cy = y + (rowH - 2.5) / 2;
    pg.add(emoji(s.pic, pg.left + 14, cy, Math.min(13, rowH * 0.6)));
    const fs = Math.min(6.4, rowH * 0.3);
    pg.add(`<text x="${pg.left + 25}" y="${cy + fs * 0.35}" font-family="${TITLE_FONT}" font-weight="800" font-size="${fs}" fill="${INK}">${esc(s.label)}</text>`);
    days.forEach((d, j) => pg.add(`<circle cx="${pg.left + labelW + j * dayW + dayW / 2}" cy="${cy}" r="${Math.min(4.2, rowH * 0.22)}" fill="#fff" stroke="${PALETTE[c]}" stroke-width="0.6"/>`));
    y += rowH;
  });
  pages.push(pg.svg());
  return pages;
}

// ================================================================ money
const CURRENCIES = {
  GBP: { name: 'Pounds', coins: [1, 2, 5, 10, 20, 50, 100, 200], notes: [500, 1000, 2000], fmt: (c) => c < 100 ? `${c}p` : `£${c % 100 ? (c / 100).toFixed(2) : c / 100}` },
  USD: { name: 'US dollars', coins: [1, 5, 10, 25], notes: [100, 500, 1000, 2000], fmt: (c) => c < 100 ? `${c}¢` : `$${c % 100 ? (c / 100).toFixed(2) : c / 100}` },
  EUR: { name: 'Euros', coins: [1, 2, 5, 10, 20, 50, 100, 200], notes: [500, 1000, 2000], fmt: (c) => c < 100 ? `${c}c` : `€${c % 100 ? (c / 100).toFixed(2) : c / 100}` },
  NGN: { name: 'Naira', whole: true, coins: [], notes: [5, 10, 20, 50, 100, 200, 500, 1000], fmt: (c) => `₦${c}` },
  GHS: { name: 'Ghana cedis', coins: [10, 20, 50, 100, 200], notes: [500, 1000, 2000], fmt: (c) => c < 100 ? `${c}p` : `GH₵${c % 100 ? (c / 100).toFixed(2) : c / 100}` },
  KES: { name: 'Kenyan shillings', whole: true, coins: [1, 5, 10, 20], notes: [50, 100, 200, 500, 1000], fmt: (c) => `KSh ${c}` },
  ZAR: { name: 'South African rand', coins: [10, 20, 50, 100, 200, 500], notes: [1000, 2000, 5000], fmt: (c) => c < 100 ? `${c}c` : `R${c % 100 ? (c / 100).toFixed(2) : c / 100}` },
  CAD: { name: 'Canadian dollars', coins: [5, 10, 25, 100, 200], notes: [500, 1000, 2000], fmt: (c) => c < 100 ? `${c}¢` : `$${c % 100 ? (c / 100).toFixed(2) : c / 100}` },
  AUD: { name: 'Australian dollars', coins: [5, 10, 20, 50, 100, 200], notes: [500, 1000, 2000], fmt: (c) => c < 100 ? `${c}c` : `$${c % 100 ? (c / 100).toFixed(2) : c / 100}` },
  INR: { name: 'Indian rupees', whole: true, coins: [1, 2, 5, 10, 20], notes: [10, 20, 50, 100, 200, 500], fmt: (c) => `₹${c}` },
};

function moneyItems(cur, level) {
  // Which coins and notes to use, and the biggest total, for each level.
  if (cur.whole) {
    const all = [...new Set([...cur.coins, ...cur.notes])].sort((a, b) => a - b);
    const cap = { easy: 20, medium: 200, hard: 2000 }[level];
    return { items: all.filter((v) => v <= cap / 2 || v === all[0]), max: cap };
  }
  if (level === 'easy') return { items: cur.coins.filter((c) => c <= 20), max: 99 };
  if (level === 'medium') return { items: cur.coins, max: 500 };
  return { items: [...cur.coins, ...cur.notes].filter((c) => c >= 5 || cur.coins.length < 5), max: 5000 };
}

function drawMoney(pg, cur, v, x, y, scale = 1) {
  // A friendly drawing (not a copy of real money): coins are circles, notes are rectangles.
  const isNote = cur.notes.includes(v) && !(cur.coins.includes(v));
  const label = cur.fmt(v);
  if (isNote) {
    const w = 30 * scale, h = 15 * scale;
    const cols = ['#9fd8b9', '#9cc3ef', '#f4b9a0', '#d7b9f0', '#f6d98a', '#a8e0e0', '#f0a8c8', '#c2d98f'];
    const col = cols[cur.notes.indexOf(v) % cols.length];
    pg.add(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${1.5 * scale}" fill="${col}" stroke="${INK}" stroke-width="0.4"/>`);
    pg.add(`<rect x="${x + 1.5 * scale}" y="${y + 1.5 * scale}" width="${w - 3 * scale}" height="${h - 3 * scale}" rx="${1 * scale}" fill="none" stroke="#fff" stroke-width="0.5"/>`);
    pg.add(`<text x="${x + w / 2}" y="${y + h / 2 + 2.2 * scale}" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="${6.2 * scale}" fill="${INK}">${esc(label)}</text>`);
    return w;
  }
  const rank = cur.coins.indexOf(v);
  const r = (5 + rank * 0.55) * scale;
  const top = cur.coins.slice(-2);
  const fill = top.includes(v) && !cur.whole ? '#f2c94c' : rank <= 1 ? '#e0a36b' : '#d5dae2';
  pg.add(`<circle cx="${x + r}" cy="${y + 7.5 * scale}" r="${r}" fill="${fill}" stroke="${INK}" stroke-width="0.4"/>`);
  pg.add(`<circle cx="${x + r}" cy="${y + 7.5 * scale}" r="${r - 1.1 * scale}" fill="none" stroke="#fff" stroke-opacity="0.8" stroke-width="0.4"/>`);
  const fs = Math.min(4.6, (r * 1.55) / Math.max(2, label.length * 0.62)) ;
  pg.add(`<text x="${x + r}" y="${y + 7.5 * scale + fs * 0.35}" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="${fs}" fill="${INK}">${esc(label)}</text>`);
  return r * 2;
}

function pickMoney(rand, items, count, max) {
  for (let t = 0; t < 200; t++) {
    const set = Array.from({ length: count }, () => items[Math.floor(rand() * items.length)]).sort((a, b) => b - a);
    const sum = set.reduce((a, b) => a + b, 0);
    if (sum <= max) return set;
  }
  return [items[0]];
}

const SHOP = [['🍎', 'apple'], ['🧃', 'juice'], ['🍪', 'cookie'], ['🎈', 'balloon'], ['🧸', 'teddy'], ['🍌', 'banana'], ['✏️', 'pencil'], ['⚽', 'ball'], ['🍦', 'ice cream'], ['📒', 'notebook'], ['🚗', 'toy car'], ['🍭', 'lolly']];

function makeMoney(o, paper) {
  const cur = CURRENCIES[o.currency] || CURRENCIES.GBP;
  const rand = rng(+o.seed || 1);
  const { items, max } = moneyItems(cur, o.level || 'easy');
  const types = o.kind === 'mix' ? ['count', 'buy', 'make'] : [o.kind || 'count'];
  const probs = [];
  for (let i = 0; i < 6; i++) {
    const type = types[i % types.length];
    const set = pickMoney(rand, items, 2 + Math.floor(rand() * (o.level === 'easy' ? 3 : 4)), max);
    const total = set.reduce((a, b) => a + b, 0);
    if (type === 'count') probs.push({ type, set, answer: cur.fmt(total) });
    if (type === 'buy') {
      const [pic, thing] = SHOP[Math.floor(rand() * SHOP.length)];
      const smallest = items[0];
      let price = Math.max(smallest, Math.round((total * (0.6 + rand() * 0.8)) / smallest) * smallest);
      if (price === total) price += smallest;
      probs.push({ type, set, pic, thing, price, answer: total >= price ? 'Yes' : 'No' });
    }
    if (type === 'make') {
      const extra = pickMoney(rand, items, 1 + Math.floor(rand() * 2), max);
      const target = set.length >= 3 ? set.slice(0, -1) : set; // always at least two pieces
      const amount = target.reduce((a, b) => a + b, 0);
      const shown = [...target, ...extra].sort(() => rand() - 0.5);
      probs.push({ type, set: shown, amount, answer: target.map(cur.fmt).join(' + ') });
    }
  }
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const pg = new Page(paper, answers ? 'Money: answers' : `Counting money: ${cur.name}`, { subtitle: answers ? 'Answer key for grown-ups.' : 'Look carefully at each coin and note. Add them up!', noName: answers });
    const bw = pg.width / 2, bh = (pg.room - 4) / 3;
    probs.forEach((p, i) => {
      const x = pg.left + (i % 2) * bw, y = pg.y + Math.floor(i / 2) * bh;
      pg.add(`<rect x="${x + 1.5}" y="${y}" width="${bw - 3}" height="${bh - 4}" rx="6" fill="${TINTS[i % TINTS.length]}"/>`);
      pg.add(`<circle cx="${x + 9}" cy="${y + 8}" r="4.2" fill="${PALETTE[i % PALETTE.length]}"/><text x="${x + 9}" y="${y + 9.8}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="4.8" fill="#fff">${i + 1}</text>`);
      const q = p.type === 'count' ? 'How much money is here?' : p.type === 'buy' ? `Can you buy the ${p.thing}?` : `Circle the money that makes ${cur.fmt(p.amount)}.`;
      pg.add(`<text x="${x + 16}" y="${y + 9.6}" font-family="${FONT}" font-weight="800" font-size="4.3" fill="${INK}">${esc(q)}</text>`);
      // the money: shrink until it fits neatly inside the box
      const areaL = x + 6, areaR = p.type === 'buy' ? x + bw - 32 : x + bw - 6;
      const areaT = y + 15, areaB = y + bh - 17;
      const isNote = (v) => cur.notes.includes(v) && !cur.coins.includes(v);
      const size = (v, sc) => isNote(v) ? [30 * sc * 0.85, 15 * sc * 0.85] : [(5 + cur.coins.indexOf(v) * 0.55) * 2 * sc, (5 + cur.coins.indexOf(v) * 0.55) * 2 * sc];
      let sc = 1.3, spots = [];
      for (; sc > 0.45; sc -= 0.05) {
        spots = [];
        let mx = areaL, my = areaT, rowH = 0, ok = true;
        for (const v of p.set) {
          const [w, h] = size(v, sc);
          if (mx + w > areaR && mx > areaL) { mx = areaL; my += rowH + 2.5; rowH = 0; }
          spots.push([v, mx, my, h]);
          mx += w + 2.5; rowH = Math.max(rowH, h);
          if (my + rowH > areaB) { ok = false; break; }
        }
        if (ok) break;
      }
      for (const [v, mx, my, h] of spots) {
        if (isNote(v)) drawMoney(pg, cur, v, mx, my, sc * 0.85);
        else drawMoney(pg, cur, v, mx, my + h / 2 - 7.5 * sc, sc);
      }
      if (p.type === 'buy') {
        const tx = x + bw - 27, ty = y + 16;
        pg.add(emoji(p.pic, tx + 11, ty + 8, 14));
        pg.add(`<rect x="${tx}" y="${ty + 17}" width="22" height="8" rx="2" fill="#fff" stroke="${INK}" stroke-width="0.4"/><text x="${tx + 11}" y="${ty + 22.6}" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="4.6" fill="${INK}">${esc(cur.fmt(p.price))}</text>`);
      }
      // the answer area
      const ay = y + bh - 11;
      if (p.type === 'buy') {
        pg.add(`<text x="${x + 8}" y="${ay}" font-family="${FONT}" font-weight="800" font-size="4.6" fill="${INK}">Circle:</text>`);
        ['Yes', 'No'].forEach((w, k) => {
          const cx = x + 32 + k * 20;
          const on = answers && p.answer === w;
          pg.add(`<ellipse cx="${cx}" cy="${ay - 1.5}" rx="7.5" ry="4.6" fill="${on ? '#ffe0ea' : '#fff'}" stroke="${on ? '#e0457b' : '#b9b3d6'}" stroke-width="${on ? 0.9 : 0.5}"/><text x="${cx}" y="${ay}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="4.4" fill="${INK}">${w}</text>`);
        });
      } else if (p.type === 'count') {
        pg.add(`<text x="${x + 8}" y="${ay}" font-family="${FONT}" font-weight="800" font-size="4.6" fill="${INK}">Total:</text><rect x="${x + 25}" y="${ay - 6}" width="34" height="9" rx="2" fill="#fff" stroke="#b9b3d6" stroke-width="0.5"/>`);
        if (answers) pg.add(`<text x="${x + 42}" y="${ay}" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="5" fill="#e0457b">${esc(p.answer)}</text>`);
      } else if (answers) {
        pg.add(`<text x="${x + 8}" y="${ay}" font-family="${FONT}" font-weight="800" font-size="4.2" fill="#e0457b">${esc(p.answer)}</text>`);
      }
    });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ word problems
const THEMES = {
  fruit: [['🍎', 'apple', 'apples'], ['🍌', 'banana', 'bananas'], ['🍓', 'strawberry', 'strawberries'], ['🍊', 'orange', 'oranges']],
  toys: [['🚗', 'toy car', 'toy cars'], ['🧸', 'teddy', 'teddies'], ['⚽', 'ball', 'balls'], ['🪀', 'yo-yo', 'yo-yos']],
  treats: [['🍪', 'cookie', 'cookies'], ['🧁', 'cupcake', 'cupcakes'], ['🍬', 'sweet', 'sweets'], ['🍩', 'doughnut', 'doughnuts']],
  nature: [['🌸', 'flower', 'flowers'], ['🐞', 'ladybird', 'ladybirds'], ['🐚', 'shell', 'shells'], ['🍂', 'leaf', 'leaves']],
  school: [['✏️', 'pencil', 'pencils'], ['📚', 'book', 'books'], ['⭐', 'sticker', 'stickers'], ['🖍️', 'crayon', 'crayons']],
};

function wordProblem(rand, names, o) {
  const pick = (a) => a[Math.floor(rand() * a.length)];
  const theme = THEMES[o.theme] || THEMES[pick(Object.keys(THEMES))];
  const [pic, one, many] = pick(theme);
  const A = pick(names);
  let B = pick(names);
  for (let t = 0; t < 5 && B === A && names.length > 1; t++) B = pick(names);
  if (B === A) B = 'a friend';
  const max = +o.within || 10;
  const ops = o.op === 'mix' ? ['add', 'sub', 'more'] : o.op === 'sub' ? ['sub', 'more'] : o.op === 'mult' ? ['mult'] : ['add'];
  const op = pick(ops);
  const r = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
  const n = (k) => (k === 1 ? one : many);
  if (op === 'add') {
    const a = r(1, max - 1), b = r(1, max - a);
    const t = pick([
      `${A} has ${a} ${n(a)}. ${B} gives ${A} ${b} more. How many ${many} does ${A} have now?`,
      `${A} found ${a} ${n(a)} and ${B} found ${b}. How many ${many} did they find altogether?`,
      `There ${a === 1 ? 'is' : 'are'} ${a} ${n(a)} on the table. ${A} puts ${b} more on the table. How many ${many} are there now?`,
    ]);
    return { text: t, pic, a, b, sign: '+', ans: a + b };
  }
  if (op === 'sub') {
    const a = r(2, max), b = r(1, a - 1);
    const t = pick([
      `${A} had ${a} ${n(a)}. ${A} gave ${b} to ${B}. How many ${many} does ${A} have left?`,
      `There were ${a} ${n(a)} in the box. ${A} took ${b} out. How many ${many} are still in the box?`,
    ]);
    return { text: t, pic, a, b, sign: '−', ans: a - b };
  }
  if (op === 'more') {
    const a = r(3, max), b = r(1, a - 1);
    return { text: `${A} has ${a} ${n(a)}. ${B} has ${b} ${n(b)}. How many more ${many} does ${A} have than ${B}?`, pic, a, b, sign: '−', ans: a - b };
  }
  const a = r(2, 5), b = r(2, Math.min(10, Math.max(2, Math.floor(max / a))));
  return { text: `${A} has ${a} bags. There are ${b} ${n(b)} in each bag. How many ${many} does ${A} have in total?`, pic, a, b, sign: '×', ans: a * b, groups: true };
}

function makeWordProblems(o, paper) {
  const names = String(o.names || '').split(/[,\n]/).map((s) => s.trim()).filter(Boolean).slice(0, 12);
  if (!names.length) names.push('Mia', 'Leo');
  const rand = rng(+o.seed || 1);
  const count = +o.count || 6;
  const probs = Array.from({ length: count }, () => wordProblem(rand, names, o));
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    for (let s = 0; s < probs.length; s += 6) {
      const pg = new Page(paper, answers ? 'Story sums: answers' : 'Story sums', { subtitle: answers ? 'Answer key for grown-ups.' : 'Read each story. Draw it if it helps, then write the answer.', noName: answers });
      const chunk = probs.slice(s, s + 6);
      const bh = (pg.room - 2) / 6;
      chunk.forEach((p, i) => {
        const y = pg.y + i * bh;
        pg.add(`<rect x="${pg.left}" y="${y}" width="${pg.width}" height="${bh - 3}" rx="6" fill="${TINTS[(s + i) % TINTS.length]}"/>`);
        pg.add(`<circle cx="${pg.left + 8}" cy="${y + 8}" r="4.2" fill="${PALETTE[(s + i) % PALETTE.length]}"/><text x="${pg.left + 8}" y="${y + 9.8}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="4.8" fill="#fff">${s + i + 1}</text>`);
        const lines = wrap(p.text, 62);
        const after = textLines(pg, lines, pg.left + 16, y + 9, 4.6, { weight: 700 });
        // Pictures help with small numbers
        if (o.pictures !== false && p.a + p.b <= 20 && !p.groups) {
          let px = pg.left + 18;
          const sz = Math.min(6.5, (pg.width * 0.6) / ((p.a + p.b) * 1.35 + 3));
          for (let k = 0; k < p.a; k++) { pg.add(emoji(p.pic, px, after + 3.5, sz)); px += sz * 1.35; }
          pg.add(`<text x="${px + sz * 0.2}" y="${after + 5.3}" font-family="${FONT}" font-weight="900" font-size="6" fill="${SOFT}" text-anchor="middle">${p.sign}</text>`);
          px += sz * 1.6;
          for (let k = 0; k < p.b; k++) { pg.add(emoji(p.pic, px, after + 3.5, sz)); px += sz * 1.35; }
        }
        const ax = pg.right - 58, ay = y + bh - 9;
        pg.add(`<text x="${ax}" y="${ay}" font-family="${FONT}" font-weight="800" font-size="4.4" fill="${INK}">Answer:</text><rect x="${ax + 19}" y="${ay - 6}" width="36" height="9" rx="2" fill="#fff" stroke="#b9b3d6" stroke-width="0.5"/>`);
        if (answers) pg.add(`<text x="${ax + 37}" y="${ay}" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="5" fill="#e0457b">${p.a} ${p.sign} ${p.b} = ${p.ans}</text>`);
      });
      pages.push(pg.svg());
    }
  }
  return pages;
}

// ================================================================ times tables
function certificate(paper, name, title, line) {
  const pg = new Page(paper, '', { noName: true });
  pg.parts = [];
  const W = pg.w, H = pg.h, m = 12;
  pg.add(`<rect x="${m}" y="${m}" width="${W - 2 * m}" height="${H - 2 * m}" rx="10" fill="#fffaf0" stroke="#ffb938" stroke-width="2.2"/>`);
  pg.add(`<rect x="${m + 5}" y="${m + 5}" width="${W - 2 * m - 10}" height="${H - 2 * m - 10}" rx="7" fill="none" stroke="#ff6b6b" stroke-width="0.6" stroke-dasharray="3 2"/>`);
  for (let i = 0; i < 26; i++) {
    const a = (i / 26) * Math.PI * 2;
    pg.add(`<circle cx="${W / 2 + Math.cos(a) * 34}" cy="${H * 0.3 + Math.sin(a) * 34}" r="2" fill="${PALETTE[i % PALETTE.length]}"/>`);
  }
  pg.add(`<circle cx="${W / 2}" cy="${H * 0.3}" r="28" fill="#ffc93c"/><circle cx="${W / 2}" cy="${H * 0.3}" r="23" fill="#ffe08a"/>`);
  pg.add(emoji('⭐', W / 2, H * 0.3, 30));
  pg.add(`<text x="${W / 2}" y="${H * 0.47}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="13" fill="${INK}">${esc(title)}</text>`);
  pg.add(`<text x="${W / 2}" y="${H * 0.53}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="5.5" fill="${SOFT}">This certificate is proudly awarded to</text>`);
  if (name) pg.add(`<text x="${W / 2}" y="${H * 0.61}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${Math.min(16, (W - 50) / (name.length * 0.55)).toFixed(2)}" fill="#ff6b6b">${esc(name)}</text>`);
  pg.add(`<line x1="${W * 0.22}" x2="${W * 0.78}" y1="${H * 0.63}" y2="${H * 0.63}" stroke="#ffb938" stroke-width="0.6"/>`);
  wrap(line, 48).forEach((l, i) => pg.add(`<text x="${W / 2}" y="${H * 0.69 + i * 8}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="6.2" fill="${INK}">${esc(l)}</text>`));
  [['Date', W * 0.3], ['Signed', W * 0.7]].forEach(([t, x]) => {
    pg.add(`<line x1="${x - 30}" x2="${x + 30}" y1="${H * 0.85}" y2="${H * 0.85}" stroke="${INK}" stroke-width="0.4"/><text x="${x}" y="${H * 0.85 + 6}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="4.2" fill="${SOFT}">${t}</text>`);
  });
  pg.footer = () => {};
  return pg.svg();
}

function makeTimesTables(o, paper) {
  const tables = [];
  for (let t = 1; t <= 12; t++) if (o[`t${t}`]) tables.push(t);
  if (!tables.length) tables.push(2, 5, 10);
  const rand = rng(+o.seed || 1);
  const pages = [];
  const tname = tables.length === 1 ? `${tables[0]} times table` : `${tables.slice(0, -1).join(', ')} and ${tables[tables.length - 1]} times tables`;
  let facts;
  if (o.mode === 'practice') {
    facts = tables.flatMap((t) => Array.from({ length: 12 }, (_, i) => ({ a: i + 1, b: t })));
  } else {
    const count = +o.count || 30;
    const seen = new Set();
    facts = [];
    for (let t = 0; facts.length < count && t < 3000; t++) {
      const b = tables[Math.floor(rand() * tables.length)], a = 1 + Math.floor(rand() * 12);
      const key = `${Math.min(a, b)}x${Math.max(a, b)}`;
      if (seen.has(key) && t < 2000) continue;
      seen.add(key);
      const missing = o.missing && rand() < 0.3;
      facts.push(rand() < 0.5 ? { a, b, missing } : { a: b, b: a, missing });
    }
  }
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const perPage = o.mode === 'practice' ? 36 : 40;
    for (let s = 0; s < facts.length; s += perPage) {
      const chunk = facts.slice(s, s + perPage);
      const pg = new Page(paper, answers ? 'Times tables: answers' : (o.mode === 'practice' ? 'Times tables practice' : 'Times tables test'), {
        subtitle: answers ? 'Answer key for grown-ups.' : `The ${tname}.${o.mode === 'practice' ? '' : ' Time: ______ minutes   Score: ______'}`, noName: answers });
      const cols = o.mode === 'practice' ? Math.min(3, tables.length) || 1 : 2;
      const rows = Math.ceil(chunk.length / cols);
      const cw = pg.width / cols, rh = Math.min(16, (pg.room - 2) / rows);
      const fs = Math.min(7, rh * 0.52);
      chunk.forEach((f, i) => {
        const col = o.mode === 'practice' ? Math.floor(i / rows) : i % cols;
        const row = o.mode === 'practice' ? i % rows : Math.floor(i / cols);
        const x = pg.left + col * cw + 6, y = pg.y + row * rh + fs;
        const ans = f.a * f.b;
        const box = (bx) => `<rect x="${bx}" y="${y - fs * 0.95}" width="${fs * 2.2}" height="${fs * 1.3}" rx="1.5" fill="#fff" stroke="#b9b3d6" stroke-width="0.45"/>`;
        const hi = (bx, v) => answers ? `<text x="${bx + fs * 1.1}" y="${y}" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="${fs}" fill="#e0457b">${v}</text>` : '';
        if (f.missing) {
          pg.add(`<text x="${x}" y="${y}" font-family="${FONT}" font-weight="800" font-size="${fs}" fill="${INK}">${f.a} ×</text>`);
          const bx = x + fs * 2.4;
          pg.add(box(bx) + hi(bx, f.b));
          pg.add(`<text x="${bx + fs * 2.5}" y="${y}" font-family="${FONT}" font-weight="800" font-size="${fs}" fill="${INK}">= ${ans}</text>`);
        } else {
          const eq = `${f.a} × ${f.b} =`;
          pg.add(`<text x="${x}" y="${y}" font-family="${FONT}" font-weight="800" font-size="${fs}" fill="${INK}">${eq}</text>`);
          const bx = x + fs * (eq.length * 0.55) + 2;
          pg.add(box(bx) + hi(bx, ans));
        }
      });
      pages.push(pg.svg());
    }
  }
  if (o.certificate) pages.push(certificate(paper, (o.name || '').trim(), 'Times Tables Star', `for brilliant work on the ${tname}!`));
  return pages;
}

// ================================================================ telling the time
function clock(pg, cx, cy, r, h, m, hands) {
  let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="${INK}" stroke-width="0.9"/>`;
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2, big = i % 5 === 0;
    const r1 = r * (big ? 0.84 : 0.9), r2 = r * 0.96;
    s += `<line x1="${cx + Math.sin(a) * r1}" y1="${cy - Math.cos(a) * r1}" x2="${cx + Math.sin(a) * r2}" y2="${cy - Math.cos(a) * r2}" stroke="${big ? INK : '#9a94b8'}" stroke-width="${big ? 0.5 : 0.25}"/>`;
  }
  const fs = r * 0.2;
  for (let i = 1; i <= 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    s += `<text x="${cx + Math.sin(a) * r * 0.69}" y="${cy - Math.cos(a) * r * 0.69 + fs * 0.36}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${fs}" fill="${INK}">${i}</text>`;
  }
  if (hands) {
    const ha = ((h % 12) + m / 60) / 12 * Math.PI * 2, ma = (m / 60) * Math.PI * 2;
    s += `<line x1="${cx}" y1="${cy}" x2="${cx + Math.sin(ha) * r * 0.45}" y2="${cy - Math.cos(ha) * r * 0.45}" stroke="${hands === 'answer' ? '#e0457b' : INK}" stroke-width="${r * 0.07}" stroke-linecap="round"/>`;
    s += `<line x1="${cx}" y1="${cy}" x2="${cx + Math.sin(ma) * r * 0.72}" y2="${cy - Math.cos(ma) * r * 0.72}" stroke="${hands === 'answer' ? '#e0457b' : INK}" stroke-width="${r * 0.045}" stroke-linecap="round"/>`;
  }
  s += `<circle cx="${cx}" cy="${cy}" r="${r * 0.05}" fill="${INK}"/>`;
  pg.add(s);
}

function timeWords(h, m, style) {
  const nh = (h % 12) + 1;
  if (style === 'digital') return `${h}:${String(m).padStart(2, '0')}`;
  if (m === 0) return `${h} o'clock`;
  if (m === 30) return `half past ${h}`;
  if (m === 15) return `quarter past ${h}`;
  if (m === 45) return `quarter to ${nh}`;
  if (m < 30) return `${m} past ${h}`;
  return `${60 - m} to ${nh}`;
}

function makeClocks(o, paper) {
  const rand = rng(+o.seed || 1);
  const step = { oclock: 60, half: 30, quarter: 15, five: 5, minute: 1 }[o.level] || 30;
  const n = 12;
  const items = [];
  const seen = new Set();
  for (let t = 0; items.length < n && t < 500; t++) {
    const h = 1 + Math.floor(rand() * 12);
    const m = step === 60 ? 0 : Math.floor(rand() * (60 / step)) * step;
    const key = `${h}:${m}`;
    if (seen.has(key) && t < 400) continue;
    seen.add(key);
    const mode = o.mode === 'mix' ? (items.length % 2 ? 'draw' : 'read') : (o.mode || 'read');
    items.push({ h, m, mode });
  }
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const pg = new Page(paper, answers ? 'Telling the time: answers' : 'Telling the time', {
      subtitle: answers ? 'Answer key for grown-ups.' : (o.mode === 'draw' ? 'Draw the hands to show the time.' : o.mode === 'mix' ? 'Write the time, or draw the hands.' : 'What time does each clock show?'), noName: answers });
    const cols = 3, rows = 4;
    const cw = pg.width / cols, ch = (pg.room - 2) / rows;
    const r = Math.min(cw * 0.36, ch * 0.34);
    items.forEach((it, i) => {
      const cx = pg.left + (i % cols) * cw + cw / 2, cy = pg.y + Math.floor(i / cols) * ch + r + 2;
      const showHands = it.mode === 'read' ? 'q' : answers ? 'answer' : false;
      clock(pg, cx, cy, r, it.h, it.m, showHands);
      const ty = cy + r + 9;
      const label = timeWords(it.h, it.m, o.style);
      if (it.mode === 'read') {
        pg.add(`<rect x="${cx - cw * 0.38}" y="${ty - 6}" width="${cw * 0.76}" height="9" rx="2" fill="#fff" stroke="#b9b3d6" stroke-width="0.5"/>`);
        if (answers) pg.add(`<text x="${cx}" y="${ty}" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="4.6" fill="#e0457b">${esc(label)}</text>`);
      } else {
        pg.add(`<text x="${cx}" y="${ty}" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="5" fill="${INK}">${esc(label)}</text>`);
      }
    });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ mazes
const MAZE_PAIRS = [['🐭', '🧀'], ['🐰', '🥕'], ['🐝', '🌻'], ['🚀', '🌙'], ['🐶', '🦴'], ['🐵', '🍌'], ['🐢', '🏝️'], ['🧚', '🏰']];

function buildMaze(w, h, rand) {
  const walls = Array.from({ length: h }, () => Array.from({ length: w }, () => ({ n: true, e: true, s: true, w: true, seen: false })));
  const stack = [[0, 0]];
  walls[0][0].seen = true;
  while (stack.length) {
    const [x, y] = stack[stack.length - 1];
    const opts = [[0, -1, 'n', 's'], [1, 0, 'e', 'w'], [0, 1, 's', 'n'], [-1, 0, 'w', 'e']].filter(([dx, dy]) => {
      const nx = x + dx, ny = y + dy;
      return nx >= 0 && ny >= 0 && nx < w && ny < h && !walls[ny][nx].seen;
    });
    if (!opts.length) { stack.pop(); continue; }
    const [dx, dy, a, b] = opts[Math.floor(rand() * opts.length)];
    walls[y][x][a] = false;
    walls[y + dy][x + dx][b] = false;
    walls[y + dy][x + dx].seen = true;
    stack.push([x + dx, y + dy]);
  }
  // The way through, for the answer page
  const prev = {};
  const q = [[0, 0]];
  const seen = new Set(['0,0']);
  while (q.length) {
    const [x, y] = q.shift();
    if (x === w - 1 && y === h - 1) break;
    for (const [dx, dy, k] of [[0, -1, 'n'], [1, 0, 'e'], [0, 1, 's'], [-1, 0, 'w']]) {
      if (walls[y][x][k]) continue;
      const key = `${x + dx},${y + dy}`;
      if (seen.has(key)) continue;
      seen.add(key);
      prev[key] = [x, y];
      q.push([x + dx, y + dy]);
    }
  }
  const path = [[w - 1, h - 1]];
  while (path[0][0] || path[0][1]) path.unshift(prev[`${path[0][0]},${path[0][1]}`]);
  return { walls, path };
}

function drawMaze(pg, mz, x, y, cell, pair, answers) {
  const { walls, path } = mz;
  const h = walls.length, w = walls[0].length;
  const sw = Math.max(0.5, Math.min(1.2, cell * 0.12));
  let d = '';
  walls.forEach((row, j) => row.forEach((c, i) => {
    const X = x + i * cell, Y = y + j * cell;
    if (c.n && !(i === 0 && j === 0)) d += `M${X} ${Y}H${X + cell}`;
    if (c.w) d += `M${X} ${Y}V${Y + cell}`;
    if (j === h - 1 && c.s && !(i === w - 1)) d += `M${X} ${Y + cell}H${X + cell}`;
    if (i === w - 1 && c.e) d += `M${X + cell} ${Y}V${Y + cell}`;
  }));
  // bottom right exit stays open at the bottom
  if (answers) pg.add(`<polyline points="${path.map(([i, j]) => `${x + (i + 0.5) * cell},${y + (j + 0.5) * cell}`).join(' ')} ${x + (w - 0.5) * cell},${y + (h + 0.4) * cell}" fill="none" stroke="#ff6b6b" stroke-width="${cell * 0.28}" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.75"/>`);
  pg.add(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="${sw}" stroke-linecap="round"/>`);
  const es = Math.max(6, Math.min(14, cell * 2.2));
  pg.add(emoji(pair[0], x + cell * 0.5, y - es * 0.55, es));
  pg.add(emoji(pair[1], x + (w - 0.5) * cell, y + h * cell + es * 0.62, es));
}

function makeMazes(o, paper) {
  const rand = rng(+o.seed || 1);
  const per = +o.per || 1;
  const dims = { easy: [8, 10], medium: [13, 16], hard: [20, 25] }[o.level || 'easy'];
  const count = per;
  const mazes = Array.from({ length: count }, (_, i) => ({ mz: buildMaze(dims[0], dims[1], rand), pair: o.theme === 'mix' || !o.theme ? MAZE_PAIRS[Math.floor(rand() * MAZE_PAIRS.length)] : MAZE_PAIRS[+o.theme] }));
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const pg = new Page(paper, answers ? 'Mazes: the way through' : 'Maze time!', { subtitle: answers ? 'Answer key for grown-ups.' : 'Help each friend find the way to the end. Try not to cross a line!', noName: answers });
    const cols = per === 1 ? 1 : 2, rows = per <= 2 ? 1 : 2;
    const boxW = pg.width / cols, boxH = (pg.room - 2) / (per === 2 ? 2 : rows);
    mazes.forEach((mm, i) => {
      const col = per === 2 ? 0 : i % cols, row = per === 2 ? i : Math.floor(i / cols);
      const bw = per === 2 ? pg.width : boxW;
      const cell = Math.min((bw - 12) / dims[0], (boxH - 30) / dims[1]);
      const mw = cell * dims[0], mh = cell * dims[1];
      const x = pg.left + col * bw + (bw - mw) / 2, y = pg.y + row * boxH + (boxH - mh) / 2;
      drawMaze(pg, mm.mz, x, y, cell, mm.pair, answers);
    });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ crosswords
function buildCrossword(entries, rand) {
  let best = null;
  for (let attempt = 0; attempt < 40; attempt++) {
    const order = [...entries].sort((a, b) => b.word.length - a.word.length + (attempt ? (rand() - 0.5) * 6 : 0));
    const grid = new Map();
    const placed = [];
    const at = (x, y) => grid.get(`${x},${y}`);
    const can = (w, x, y, dx, dy) => {
      let hits = 0;
      if (at(x - dx, y - dy) || at(x + dx * w.length, y + dy * w.length)) return -1;
      for (let i = 0; i < w.length; i++) {
        const cx = x + dx * i, cy = y + dy * i;
        const c = at(cx, cy);
        if (c) { if (c !== w[i]) return -1; hits++; continue; }
        if (at(cx + dy, cy + dx) || at(cx - dy, cy - dx)) return -1;
      }
      return hits === w.length ? -1 : hits;
    };
    const put = (e, x, y, dx, dy) => {
      for (let i = 0; i < e.word.length; i++) grid.set(`${x + dx * i},${y + dy * i}`, e.word[i]);
      placed.push({ ...e, x, y, dir: dx ? 'across' : 'down' });
    };
    put(order[0], 0, 0, 1, 0);
    for (const e of order.slice(1)) {
      let opt = null;
      for (const p of placed) {
        for (let i = 0; i < p.word.length; i++) {
          for (let j = 0; j < e.word.length; j++) {
            if (p.word[i] !== e.word[j]) continue;
            const [dx, dy] = p.dir === 'across' ? [0, 1] : [1, 0];
            const px = p.x + (p.dir === 'across' ? i : 0), py = p.y + (p.dir === 'down' ? i : 0);
            const x = px - dx * j, y = py - dy * j;
            const score = can(e.word, x, y, dx, dy);
            if (score > 0 && (!opt || score + rand() * 0.5 > opt.score)) opt = { x, y, dx, dy, score };
          }
        }
      }
      if (opt) put(e, opt.x, opt.y, opt.dx, opt.dy);
    }
    const xs = [...grid.keys()].map((k) => +k.split(',')[0]), ys = [...grid.keys()].map((k) => +k.split(',')[1]);
    const w = Math.max(...xs) - Math.min(...xs) + 1, h = Math.max(...ys) - Math.min(...ys) + 1;
    const score = placed.length * 100 - Math.max(w, h) * 2 - Math.abs(w - h);
    if (!best || score > best.score) best = { grid, placed, minX: Math.min(...xs), minY: Math.min(...ys), w, h, score };
  }
  // number the clues in reading order
  const starts = [...new Set(best.placed.map((p) => `${p.y - best.minY},${p.x - best.minX}`))]
    .map((k) => k.split(',').map(Number)).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const num = new Map(starts.map(([r, c], i) => [`${c},${r}`, i + 1]));
  best.placed.forEach((p) => { p.n = num.get(`${p.x - best.minX},${p.y - best.minY}`); });
  return best;
}

function makeCrossword(o, paper) {
  const entries = String(o.words || '').split('\n').map((l) => {
    const m = /^\s*([^:\-–—=]+?)\s*[:\-–—=]\s*(.+)$/.exec(l);
    const word = (m ? m[1] : l).normalize('NFD').replace(/[^A-Za-z]/g, '').toUpperCase();
    return { word, clue: m ? m[2].trim() : '' };
  }).filter((e) => e.word.length >= 2).slice(0, 20);
  if (entries.length < 2) entries.push({ word: 'CAT', clue: 'A pet that says meow' }, { word: 'TREE', clue: 'It has leaves and branches' });
  const rand = rng(+o.seed || 1);
  const cw = buildCrossword(entries, rand);
  const title = (o.title || 'Crossword').slice(0, 40);
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const pg = new Page(paper, answers ? `${title}: answers` : title, { subtitle: answers ? 'Answer key for grown-ups.' : 'Read each clue and write the answer in the boxes.', noName: answers });
    const across = cw.placed.filter((p) => p.dir === 'across').sort((a, b) => a.n - b.n);
    const down = cw.placed.filter((p) => p.dir === 'down').sort((a, b) => a.n - b.n);
    const colH = (list) => list.reduce((h, p) => h + Math.min(2, wrap(`${p.n}. ${p.clue || '(no clue)'} (${p.word.length})`, 44).length) * 4.6 + 2, 0);
    const gridRoom = pg.room - (Math.max(colH(across), colH(down)) + (o.bank ? 10 : 0) + 20);
    const cell = Math.min(15, pg.width / cw.w, gridRoom / cw.h);
    const gx = pg.left + (pg.width - cell * cw.w) / 2, gy = pg.y;
    const numbers = new Map(cw.placed.map((p) => [`${p.x - cw.minX},${p.y - cw.minY}`, p.n]));
    for (const [k, ch] of cw.grid) {
      const [x, y] = k.split(',').map(Number);
      const cx = gx + (x - cw.minX) * cell, cy = gy + (y - cw.minY) * cell;
      pg.add(`<rect x="${cx}" y="${cy}" width="${cell}" height="${cell}" fill="#fff" stroke="${INK}" stroke-width="0.5"/>`);
      const n = numbers.get(`${x - cw.minX},${y - cw.minY}`);
      if (n) pg.add(`<text x="${cx + 0.8}" y="${cy + cell * 0.3}" font-family="${FONT}" font-weight="800" font-size="${cell * 0.26}" fill="${SOFT}">${n}</text>`);
      if (answers) pg.add(`<text x="${cx + cell / 2}" y="${cy + cell * 0.72}" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="${cell * 0.55}" fill="#e0457b">${ch}</text>`);
    }
    let y = gy + cw.h * cell + 10;
    const colW = pg.width / 2;
    let endY = y;
    [['Across', across, pg.left], ['Down', down, pg.left + colW]].forEach(([head, list, x]) => {
      pg.add(`<text x="${x}" y="${y}" font-family="${TITLE_FONT}" font-weight="800" font-size="6" fill="${PALETTE[head === 'Across' ? 0 : 3]}">${head}</text>`);
      let ly = y + 7;
      list.forEach((p) => {
        const text = `${p.n}. ${p.clue || '(no clue)'} (${p.word.length})`;
        const lines = wrap(text, 44).slice(0, 2);
        lines.forEach((l, k) => pg.add(`<text x="${x + (k ? 3.5 : 0)}" y="${ly + k * 4.6}" font-family="${FONT}" font-weight="700" font-size="4" fill="${INK}">${esc(l)}</text>`));
        ly += lines.length * 4.6 + 2;
      });
      endY = Math.max(endY, ly);
    });
    if (o.bank) {
      const by = endY + 2;
      pg.add(`<text x="${pg.left}" y="${by}" font-family="${FONT}" font-weight="800" font-size="4.2" fill="${SOFT}">Word bank: ${esc(cw.placed.map((p) => p.word).sort().join('   '))}</text>`);
    }
    const missing = entries.length - cw.placed.length;
    if (missing > 0 && !answers) pg.add(`<text x="${pg.left}" y="${pg.bottom - 2}" font-family="${FONT}" font-size="3.2" fill="#c0304f">${missing} word(s) could not cross the others and were left out. Try adding words that share letters.</text>`);
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ reward charts
const REWARD_THEMES = { stars: ['⭐', '#ffb938'], hearts: ['💖', '#ff7eb6'], rockets: ['🚀', '#6c8cff'], flowers: ['🌸', '#ff6b6b'], dinos: ['🦕', '#3fbfa8'], balls: ['⚽', '#35b5e5'] };

function makeReward(o, paper) {
  const [pic, colour] = REWARD_THEMES[o.theme] || REWARD_THEMES.stars;
  const n = Math.max(5, Math.min(40, +o.spaces || 20));
  const title = `${possessive(o.name)} Reward Chart`;
  const pg = new Page(paper, title, { subtitle: 'Colour a space or add a sticker every time. You are doing so well!', noName: true });
  // goal banner
  const goal = (o.goal || 'I can do it!').slice(0, 60);
  pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="20" rx="10" fill="${colour}"/>`);
  pg.add(emoji(pic, pg.left + 12, pg.y + 10, 12));
  pg.add(emoji(pic, pg.right - 12, pg.y + 10, 12));
  pg.add(`<text x="${pg.left + pg.width / 2}" y="${pg.y + 12.8}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${goal.length > 32 ? 6.5 : 8.5}" fill="#fff">${esc(goal)}</text>`);
  pg.y += 30;
  // winding path of spaces
  const cols = n <= 10 ? 5 : n <= 20 ? 5 : 6;
  const rows = Math.ceil(n / cols);
  const rewardH = 34;
  const cellW = pg.width / cols, cellH = Math.min(46, (pg.room - rewardH - 8) / rows);
  const r = Math.min(cellW, cellH) * 0.36;
  const pts = [];
  for (let i = 0; i < n; i++) {
    const row = Math.floor(i / cols), k = i % cols, col = row % 2 ? cols - 1 - k : k;
    pts.push([pg.left + col * cellW + cellW / 2, pg.y + row * cellH + cellH / 2]);
  }
  pg.add(`<polyline points="${pts.map((p) => p.join(',')).join(' ')}" fill="none" stroke="${colour}" stroke-opacity="0.35" stroke-width="${r * 0.9}" stroke-linecap="round" stroke-linejoin="round"/>`);
  pts.forEach(([x, y], i) => {
    const last = i === n - 1;
    pg.add(`<circle cx="${x}" cy="${y}" r="${last ? r * 1.15 : r}" fill="#fff" stroke="${last ? '#ffb938' : PALETTE[i % PALETTE.length]}" stroke-width="${last ? 1.6 : 1}"/>`);
    if (last) pg.add(emoji('🏆', x, y, r * 1.3));
    else pg.add(`<text x="${x}" y="${y + r * 0.2}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${r * 0.6}" fill="#e3def2">${i + 1}</text>`);
  });
  pg.y += rows * cellH + 8;
  // reward box
  pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="${rewardH - 6}" rx="8" fill="#fff8e6" stroke="#ffb938" stroke-width="0.8" stroke-dasharray="3 2"/>`);
  pg.add(emoji('🎁', pg.left + 14, pg.y + (rewardH - 6) / 2, 15));
  pg.add(`<text x="${pg.left + 28}" y="${pg.y + 11}" font-family="${FONT}" font-weight="800" font-size="4.8" fill="${SOFT}">When my chart is full, I get:</text>`);
  if (o.reward) {
    const r = o.reward.slice(0, 50);
    pg.add(`<text x="${pg.left + 28}" y="${pg.y + 21}" font-family="${TITLE_FONT}" font-weight="800" font-size="${Math.min(7, (pg.width - 34) / (r.length * 0.52)).toFixed(2)}" fill="${INK}">${esc(r)}</text>`);
  }
  else pg.add(`<line x1="${pg.left + 28}" x2="${pg.right - 8}" y1="${pg.y + 21}" y2="${pg.y + 21}" stroke="${SOFT}" stroke-width="0.4"/>`);
  return [pg.svg()];
}

Object.assign(MAKERS, {
  routine: makeRoutine, money: makeMoney, wordproblems: makeWordProblems, times: makeTimesTables,
  clocks: makeClocks, mazes: makeMazes, crossword: makeCrossword, reward: makeReward,
});
