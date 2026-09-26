// PrintPals handwriting letters.
// Every letter is drawn stroke by stroke, the way a teacher writes it, in the
// order a child should write it. Units: the top line is y=0, the middle
// (dashed) line y=50, the baseline y=100 and the tail line y=150.
// w is the letter width. dots are the dots on i and j.
const GLYPHS = {
  // ---------- capitals ----------
  A: { w: 60, d: ['M30 0 L0 100', 'M30 0 L60 100', 'M12 62 L48 62'] },
  B: { w: 50, d: ['M0 0 L0 100', 'M0 0 L26 0 C38 0 46 10 46 25 C46 40 38 50 26 50 L0 50 M26 50 C40 50 50 60 50 75 C50 90 40 100 26 100 L0 100'] },
  C: { w: 58, d: ['M57 22 A30 50 0 1 0 57 78'] },
  D: { w: 56, d: ['M0 0 L0 100', 'M0 0 L20 0 C42 0 56 22 56 50 C56 78 42 100 20 100 L0 100'] },
  E: { w: 46, d: ['M0 0 L0 100', 'M0 0 L46 0', 'M0 50 L38 50', 'M0 100 L46 100'] },
  F: { w: 46, d: ['M0 0 L0 100', 'M0 0 L46 0', 'M0 50 L38 50'] },
  G: { w: 62, d: ['M58 25 A30 50 0 1 0 62 58 L62 100', 'M62 58 L38 58'] },
  H: { w: 55, d: ['M0 0 L0 100', 'M55 0 L55 100', 'M0 50 L55 50'] },
  I: { w: 30, d: ['M15 0 L15 100', 'M0 0 L30 0', 'M0 100 L30 100'] },
  J: { w: 46, d: ['M46 0 L46 74 A23 26 0 0 1 0 74'] },
  K: { w: 50, d: ['M0 0 L0 100', 'M50 0 L0 58', 'M17 39 L50 100'] },
  L: { w: 44, d: ['M0 0 L0 100 L44 100'] },
  M: { w: 66, d: ['M0 100 L0 0 L33 72 L66 0 L66 100'] },
  N: { w: 56, d: ['M0 100 L0 0 L56 100 L56 0'] },
  O: { w: 64, d: ['M32 0 A32 50 0 1 0 32 100 A32 50 0 1 0 32 0'] },
  P: { w: 50, d: ['M0 0 L0 100', 'M0 0 L26 0 C40 0 50 10 50 26 C50 42 40 52 26 52 L0 52'] },
  Q: { w: 66, d: ['M32 0 A32 50 0 1 0 32 100 A32 50 0 1 0 32 0', 'M40 72 L66 104'] },
  R: { w: 52, d: ['M0 0 L0 100', 'M0 0 L26 0 C40 0 50 10 50 26 C50 42 40 52 26 52 L0 52', 'M24 52 L52 100'] },
  S: { w: 50, d: ['M48 16 C43 5 34 0 25 0 C11 0 3 9 3 24 C3 40 17 45 25 49 C35 53 48 59 48 75 C48 91 38 100 24 100 C12 100 4 94 0 83'] },
  T: { w: 56, d: ['M0 0 L56 0', 'M28 0 L28 100'] },
  U: { w: 56, d: ['M0 0 L0 70 A28 30 0 0 0 56 70 L56 0'] },
  V: { w: 60, d: ['M0 0 L30 100 L60 0'] },
  W: { w: 84, d: ['M0 0 L21 100 L42 28 L63 100 L84 0'] },
  X: { w: 56, d: ['M0 0 L56 100', 'M56 0 L0 100'] },
  Y: { w: 60, d: ['M0 0 L30 50', 'M60 0 L30 50 L30 100'] },
  Z: { w: 52, d: ['M0 0 L52 0 L0 100 L52 100'] },

  // ---------- small letters ----------
  a: { w: 42, d: ['M40 60 A20 25 0 1 0 40 90', 'M40 50 L41 100'] },
  b: { w: 42, d: ['M0 0 L0 100', 'M0 75 A21 25 0 0 1 42 75 A21 25 0 0 1 0 75'] },
  c: { w: 42, d: ['M37 58 A20 25 0 1 0 37 92'] },
  d: { w: 42, d: ['M40 60 A20 25 0 1 0 40 90', 'M40 0 L41 100'] },
  e: { w: 40, d: ['M2 75 L38 75 A19 25 0 1 0 34 92'] },
  f: { w: 34, d: ['M34 6 C29 1 24 0 20 0 C14 0 10 5 10 14 L10 100', 'M0 50 L28 50'] },
  g: { w: 42, d: ['M40 60 A20 25 0 1 0 40 90', 'M40 50 L41 126 C41 142 32 150 21 150 C12 150 5 146 1 139'] },
  h: { w: 40, d: ['M0 0 L0 100', 'M0 72 C3 58 11 50 20 50 C31 50 40 58 40 72 L40 100'] },
  i: { w: 10, d: ['M5 50 L5 100'], dots: [[5, 26]] },
  j: { w: 26, d: ['M24 50 L24 128 C24 143 16 150 8 150 C4 150 1 149 -2 147'], dots: [[24, 26]] },
  k: { w: 38, d: ['M0 0 L0 100', 'M36 50 L0 80', 'M14 69 L38 100'] },
  l: { w: 10, d: ['M5 0 L5 100'] },
  m: { w: 62, d: ['M0 50 L0 100', 'M0 70 C2 57 8 50 16 50 C25 50 31 57 31 70 L31 100', 'M31 70 C33 57 39 50 47 50 C56 50 62 57 62 70 L62 100'] },
  n: { w: 40, d: ['M0 50 L0 100', 'M0 72 C3 58 11 50 20 50 C31 50 40 58 40 72 L40 100'] },
  o: { w: 42, d: ['M21 50 A21 25 0 1 0 21 100 A21 25 0 1 0 21 50'] },
  p: { w: 42, d: ['M0 50 L0 150', 'M0 75 A21 25 0 0 1 42 75 A21 25 0 0 1 0 75'] },
  q: { w: 42, d: ['M40 60 A20 25 0 1 0 40 90', 'M40 50 L41 150'] },
  r: { w: 32, d: ['M0 50 L0 100', 'M0 72 C4 58 13 50 22 50 C26 50 30 51 32 53'] },
  s: { w: 34, d: ['M32 58 C28 52 23 50 17 50 C9 50 3 55 3 62 C3 71 12 73 17 75 C23 77 32 80 32 88 C32 96 26 100 17 100 C9 100 3 97 1 91'] },
  t: { w: 32, d: ['M14 14 L14 90 C14 97 19 100 24 100 C27 100 30 99 32 97', 'M0 50 L30 50'] },
  u: { w: 40, d: ['M0 50 L0 78 C0 92 9 100 20 100 C31 100 40 92 40 78', 'M40 50 L40 100'] },
  v: { w: 42, d: ['M0 50 L21 100 L42 50'] },
  w: { w: 62, d: ['M0 50 L16 100 L31 62 L46 100 L62 50'] },
  x: { w: 40, d: ['M0 50 L40 100', 'M40 50 L0 100'] },
  y: { w: 42, d: ['M0 50 L21 100', 'M42 50 L12 150'] },
  z: { w: 38, d: ['M0 50 L38 50 L0 100 L38 100'] },

  // ---------- numbers ----------
  0: { w: 50, d: ['M25 0 A25 50 0 1 0 25 100 A25 50 0 1 0 25 0'] },
  1: { w: 30, d: ['M4 22 L22 0 L22 100'] },
  2: { w: 48, d: ['M2 22 C4 8 14 0 25 0 C38 0 47 9 47 24 C47 42 30 58 0 100 L48 100'] },
  3: { w: 46, d: ['M3 12 C8 4 16 0 24 0 C36 0 44 8 44 24 C44 38 34 47 20 48 C36 48 46 58 46 74 C46 90 36 100 23 100 C13 100 5 96 1 88'] },
  4: { w: 50, d: ['M36 0 L0 70 L50 70', 'M36 0 L36 100'] },
  5: { w: 46, d: ['M42 0 L6 0 L3 44 C10 40 16 38 23 38 C37 38 46 49 46 68 C46 88 36 100 22 100 C12 100 5 96 1 89', ] },
  6: { w: 46, d: ['M40 6 C34 1 29 0 24 0 C9 0 2 22 2 60 C2 84 11 100 24 100 C37 100 46 90 46 76 C46 62 37 53 24 53 C12 53 3 62 2 72'] },
  7: { w: 48, d: ['M0 0 L48 0 L16 100'] },
  8: { w: 46, d: ['M23 50 C12 50 5 41 5 25 C5 9 12 0 23 0 C34 0 41 9 41 25 C41 41 34 50 23 50 C10 50 1 60 1 75 C1 91 10 100 23 100 C36 100 45 91 45 75 C45 60 36 50 23 50'] },
  9: { w: 46, d: ['M44 24 C44 10 35 0 23 0 C11 0 2 10 2 24 C2 38 11 48 23 48 C35 48 44 38 44 24 L44 100'] },

  // ---------- a few marks for names ----------
  '-': { w: 26, d: ['M0 70 L26 70'] },
  "'": { w: 8, d: ['M4 0 L4 22'] },
  '.': { w: 8, d: [], dots: [[4, 97]] },
  ',': { w: 10, d: ['M6 94 Q6 104 1 112'] },
  '?': { w: 34, d: ['M2 18 C4 7 12 0 19 0 C27 0 33 6 33 16 C33 28 17 34 17 50 L17 66'], dots: [[17, 96]] },
  '!': { w: 10, d: ['M5 0 L5 68'], dots: [[5, 96]] },
  ' ': { w: 34, d: [] },
};

const GAP = 16; // space between letters

/** Makes text safe for the handwriting letters (é becomes e and so on). */
function cleanText(s) {
  return (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').split('').filter((c) => GLYPHS[c]).join('');
}

/** Width of a word in letter units. */
function textWidth(s) {
  const t = cleanText(s);
  let w = 0;
  for (let i = 0; i < t.length; i++) w += GLYPHS[t[i]].w + (i < t.length - 1 ? GAP : 0);
  return w;
}

/**
 * Draws [text] with its top line at [top]. [size] is the height from the top
 * line to the baseline, in page units. style: 'trace' (dotted grey),
 * 'model' (solid dark) or 'ghost' (very light solid). [starts] shows the
 * green start dots with stroke numbers.
 */
function drawText(text, x, top, size, style = 'trace', starts = false) {
  const t = cleanText(text);
  const s = size / 100;
  const colour = style === 'model' ? '#2d2350' : style === 'ghost' ? '#d9d4ec' : '#7d7799';
  // Line thickness in millimetres on paper, then in letter units.
  const width = Math.max(0.5, size * (style === 'model' ? 0.07 : 0.05));
  const sw = width / s;
  const dash = style === 'trace' ? `stroke-dasharray="0 ${(sw * 1.9).toFixed(2)}"` : '';
  let out = '';
  let cx = x;
  for (const c of t) {
    const g = GLYPHS[c];
    let paths = '';
    for (const d of g.d) {
      paths += `<path d="${d}" fill="none" stroke="${colour}" stroke-width="${sw.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" ${dash}/>`;
    }
    for (const [dx, dy] of g.dots || []) {
      paths += `<circle cx="${dx}" cy="${dy}" r="${(width * 0.75) / s}" fill="${colour}"/>`;
    }
    out += `<g transform="translate(${cx.toFixed(2)} ${top.toFixed(2)}) scale(${s.toFixed(4)})">${paths}</g>`;
    if (starts) {
      const placed = [];
      g.d.forEach((d, i) => {
        const m = /M\s*(-?[\d.]+)[ ,]+(-?[\d.]+)/.exec(d);
        if (!m) return;
        const r = Math.max(1.3, size * 0.075);
        let px = cx + parseFloat(m[1]) * s, py = top + parseFloat(m[2]) * s;
        // Two strokes starting at the same spot: put the next number beside it.
        while (placed.some(([qx, qy]) => Math.hypot(qx - px, qy - py) < r * 1.9)) px += r * 2.2;
        placed.push([px, py]);
        out += `<circle cx="${px.toFixed(2)}" cy="${py.toFixed(2)}" r="${r.toFixed(2)}" fill="#3fbf7f"/>`;
        if (g.d.length > 1) {
          out += `<text x="${px.toFixed(2)}" y="${(py + r * 0.36).toFixed(2)}" font-size="${(r * 1.15).toFixed(2)}" text-anchor="middle" font-family="Nunito, Arial, sans-serif" font-weight="800" fill="#fff">${i + 1}</text>`;
        }
      });
    }
    cx += (g.w + GAP) * s;
  }
  return out;
}

;
// PrintPals page engine: real paper sizes in millimetres, ready to print.
const PAPER = {
  a4: { w: 210, h: 297, css: 'A4' },
  letter: { w: 215.9, h: 279.4, css: 'letter' },
};

const INK = '#2d2350';
const SOFT = '#8c86a8';
const FONT = "Nunito, 'Trebuchet MS', Arial, sans-serif";
const TITLE_FONT = "'Baloo 2', Nunito, Arial, sans-serif";

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

class Page {
  constructor(paper, title, opts = {}) {
    this.p = PAPER[paper] || PAPER.a4;
    this.landscape = !!opts.landscape;
    this.w = this.landscape ? this.p.h : this.p.w;
    this.h = this.landscape ? this.p.w : this.p.h;
    this.m = 13; // margin
    this.parts = [];
    this.y = this.m;
    this.left = this.m;
    this.right = this.w - this.m;
    this.bottom = this.h - this.m - 6; // room for the footer
    this.tint = opts.tint || '#fff';
    if (!opts.bare) this.header(title, opts);
  }

  get width() { return this.right - this.left; }
  add(svg) { this.parts.push(svg); }

  header(title, opts) {
    const { subtitle, noName } = opts;
    let y = this.m + 8;
    // Long titles get smaller so they never run into the name line.
    const room = (noName ? this.width : this.width - 96) / (String(title).length * 0.6);
    const tfs = Math.max(5.5, Math.min(8.5, room));
    this.add(`<text x="${this.left}" y="${y}" font-family="${TITLE_FONT}" font-weight="800" font-size="${tfs.toFixed(2)}" fill="${INK}">${esc(title)}</text>`);
    if (!noName) {
      // Name and date lines on the right
      const x = this.right;
      this.add(`<text x="${x - 88}" y="${y - 1}" font-family="${FONT}" font-weight="700" font-size="3.6" fill="${SOFT}">Name</text>`);
      this.add(`<line x1="${x - 76}" x2="${x - 36}" y1="${y}" y2="${y}" stroke="${SOFT}" stroke-width="0.3"/>`);
      this.add(`<text x="${x - 33}" y="${y - 1}" font-family="${FONT}" font-weight="700" font-size="3.6" fill="${SOFT}">Date</text>`);
      this.add(`<line x1="${x - 22}" x2="${x}" y1="${y}" y2="${y}" stroke="${SOFT}" stroke-width="0.3"/>`);
    }
    if (subtitle) {
      y += 6.5;
      // Long subtitles (a long name, say) shrink to stay on the page.
      const sfs = Math.max(2.6, Math.min(4, this.width / (String(subtitle).length * 0.47)));
      this.add(`<text x="${this.left}" y="${y}" font-family="${FONT}" font-weight="600" font-size="${sfs.toFixed(2)}" fill="${SOFT}">${esc(subtitle)}</text>`);
    }
    y += 4;
    // A soft rainbow line under the title
    const cols = ['#ff6b6b', '#ffc93c', '#3fbfa8', '#6c8cff', '#b06cff'];
    const seg = this.width / cols.length;
    cols.forEach((c, i) => this.add(`<rect x="${this.left + i * seg}" y="${y}" width="${seg}" height="1.2" fill="${c}"/>`));
    this.y = y + 7;
  }

  footer() {
    this.add(`<text x="${this.w / 2}" y="${this.h - this.m + 1}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="3" fill="#b8b3cc">Free printable worksheets at printpals.web.app</text>`);
  }

  /** Handwriting guide lines for one row. size = top line to baseline. */
  guides(y, size, x1 = this.left, x2 = this.right, descender = true) {
    const base = y + size;
    let g = `<line x1="${x1}" x2="${x2}" y1="${y}" y2="${y}" stroke="#b9b3d6" stroke-width="0.35"/>`;
    g += `<line x1="${x1}" x2="${x2}" y1="${y + size / 2}" y2="${y + size / 2}" stroke="#c9c3e3" stroke-width="0.3" stroke-dasharray="1.6 1.4"/>`;
    g += `<line x1="${x1}" x2="${x2}" y1="${base}" y2="${base}" stroke="#7f78a8" stroke-width="0.45"/>`;
    if (descender) g += `<line x1="${x1}" x2="${x2}" y1="${base + size / 2}" y2="${base + size / 2}" stroke="#ece9f6" stroke-width="0.3"/>`;
    this.add(g);
  }

  /** Room left on the page. */
  get room() { return this.bottom - this.y; }

  svg() {
    this.footer();
    return `<svg class="sheet" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${this.w} ${this.h}" data-w="${this.w}" data-h="${this.h}" data-orient="${this.landscape ? 'landscape' : 'portrait'}">`
      + `<rect width="${this.w}" height="${this.h}" fill="${this.tint}"/>${this.parts.join('')}</svg>`;
  }
}

/** Height of one handwriting row (with room for tails and a gap). */
function rowHeight(size) { return size * 1.5 + size * 0.42; }

/** How big letters can be so [text] fits in [maxWidth]. */
function fitSize(text, want, maxWidth) {
  const w = textWidth(text);
  if (!w) return want;
  return Math.min(want, (maxWidth / w) * 100);
}

/** Repeats [text] across a row as many times as it fits. */
function fillRow(page, text, y, size, style, starts = false, times = 99) {
  const unit = (textWidth(text) / 100) * size;
  const gap = size * 1.1;
  let x = page.left + size * 0.35;
  let n = 0;
  // Always draw at least once, even if a very long word only just fits.
  while (n < times && (n === 0 || x + unit <= page.right - size * 0.2)) {
    page.add(drawText(text, x, y, size, style, starts && n === 0));
    x += unit + gap;
    n++;
  }
  return n;
}

/** Simple seeded random numbers, so "New set" makes a fresh sheet. */
function rng(seed) {
  let a = seed >>> 0 || 1;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

;
// PrintPals worksheet makers. Each one returns a list of pages (SVG).

const ABC = {
  A: ['Apple', 'img/apple.webp'], B: ['Balloon', 'img/balloon.webp'], C: ['Cat', 'img/cat.webp'],
  D: ['Dog', 'img/dog.webp'], E: ['Egg', 'img/egg.webp'], F: ['Fish', 'img/fish.webp'],
  G: ['Gorilla', 'img/gorilla.webp'], H: ['Hat', 'img/hat.webp'], I: ['Ice cream', '🍦'],
  J: ['Juice', '🧃'], K: ['Kite', '🪁'], L: ['Lion', 'img/lion.webp'], M: ['Monkey', 'img/monkey.webp'],
  N: ['Nest', 'img/nest.webp'], O: ['Octopus', 'img/octopus.webp'], P: ['Pig', 'img/pig.webp'],
  Q: ['Queen', '👸'], R: ['Rainbow', 'img/rainbow.webp'], S: ['Sun', 'img/sun.webp'],
  T: ['Turtle', 'img/turtle.webp'], U: ['Umbrella', '☂️'], V: ['Violin', '🎻'], W: ['Whale', '🐳'],
  X: ['Fox', '🦊'], Y: ['Yo-yo', '🪀'], Z: ['Zebra', 'img/zebra.webp'],
};

const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];

function picture(src, x, y, size) {
  if (src.startsWith('img/')) {
    return `<image href="${src}" x="${x}" y="${y}" width="${size}" height="${size}" preserveAspectRatio="xMidYMid meet"/>`;
  }
  return `<text x="${x + size / 2}" y="${y + size * 0.82}" font-size="${size * 0.85}" text-anchor="middle">${src}</text>`;
}

function applyCase(s, c) {
  if (c === 'upper') return s.toUpperCase();
  if (c === 'lower') return s.toLowerCase();
  if (c === 'title') return s.toLowerCase().replace(/(^|[\s'-])(\S)/g, (m, a, b) => a + b.toUpperCase());
  return s;
}

const SIZES = { large: 20, medium: 15, small: 11 };

// A painted friend in the corner cheers the child on.
const CHEER_FRIENDS = ['star', 'lion', 'turtle', 'monkey', 'octopus', 'bear', 'chick', 'cat', 'dog', 'pig', 'zebra', 'ladybird'];
const CHEER_WORDS = ['Great work!', 'You can do it!', 'Super job!', 'Keep going!', 'Brilliant!', 'Well done!'];
const CHEER_ROOM = 26;
function cheer(pg, k) {
  const friend = CHEER_FRIENDS[Math.abs(k) % CHEER_FRIENDS.length], words = CHEER_WORDS[Math.abs(k) % CHEER_WORDS.length];
  const y = pg.bottom + 2, size = 23;
  pg.add(`<image href="img/${friend}.webp" x="${pg.right - size}" y="${y}" width="${size}" height="${size}" preserveAspectRatio="xMidYMid meet"/>`);
  const bw = words.length * 2.7 + 10, bx = pg.right - size - bw - 3, by = y + 4;
  pg.add(`<rect x="${bx}" y="${by}" width="${bw}" height="11" rx="5.5" fill="#fff6e0" stroke="#ffb938" stroke-width="0.5"/>`);
  pg.add(`<path d="M${bx + bw - 0.4} ${by + 4} L${bx + bw + 3.5} ${by + 6.5} L${bx + bw - 0.4} ${by + 8}" fill="#fff6e0" stroke="#ffb938" stroke-width="0.5" stroke-linejoin="round"/>`);
  pg.add(`<text x="${bx + bw / 2}" y="${by + 7.4}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="5" fill="${INK}">${words}</text>`);
}

// Pictures to count on each number page.
const COUNT_ART = [['apple', 'apples'], ['star', 'stars'], ['balloon', 'balloons'], ['fish', 'fish'], ['strawberry', 'strawberries'], ['cupcake', 'cupcakes'],
  ['ladybird', 'ladybirds'], ['banana', 'bananas'], ['sunflower', 'sunflowers'], ['egg', 'eggs'], ['cookie', 'cookies'], ['chick', 'chicks'],
  ['heart', 'hearts'], ['orange', 'oranges'], ['tulip', 'tulips'], ['turtle', 'turtles'], ['donut', 'doughnuts'], ['blueberry', 'blueberries'],
  ['daisy', 'daisies'], ['mushroom', 'mushrooms']];

// ---------------------------------------------------------------- names
function makeNames(o, paper) {
  const names = (o.names || '').split(/[,\n]/).map((s) => applyCase(s.trim(), o.case)).filter((s) => cleanText(s).trim());
  if (!names.length) names.push('Your Name');
  return names.map((name) => {
    const pg = new Page(paper, 'Trace my name', { subtitle: 'Start at the green dot. Follow the dots, then try on your own!' });
    pg.bottom -= CHEER_ROOM;
    const want = SIZES[o.size] || 20;
    const size = fitSize(name, want, pg.width - want * 0.6);
    const rh = rowHeight(size);
    let row = 0;
    while (pg.room >= rh) {
      pg.guides(pg.y, size);
      const style = row === 0 ? 'model' : 'trace';
      const blanks = o.practice !== false ? 2 : 0;
      const rowsLeft = Math.floor(pg.room / rh);
      if (row === 0 || rowsLeft > blanks) fillRow(pg, name, pg.y, size, style, o.dots !== false && row === 0, row === 0 ? 1 : 99);
      pg.y += rh;
      row++;
    }
    cheer(pg, name.length);
    return pg.svg();
  });
}

// ---------------------------------------------------------------- letters
function letterPage(L, paper, o) {
  const [word, pic] = ABC[L];
  const lower = L.toLowerCase();
  const pg = new Page(paper, `Letter ${L} ${lower}`, { subtitle: `${L} is for ${word}. Start at the green dot and follow the numbers.` });
  // Big letters with stroke order, and the picture
  const big = 36;
  const top = pg.y + 2;
  pg.guides(top, big, pg.left, pg.left + 118);
  pg.add(drawText(L, pg.left + 8, top, big, 'model', true));
  pg.add(drawText(lower, pg.left + 8 + (GLYPHS[L].w / 100) * big + 16, top, big, 'model', true));
  const ps = 44;
  pg.add(`<rect x="${pg.right - ps - 8}" y="${top - 4}" width="${ps + 8}" height="${ps + 12}" rx="6" fill="#fff8e6" stroke="#ffe3a3" stroke-width="0.5"/>`);
  pg.add(picture(pic, pg.right - ps - 4, top - 1, ps));
  pg.add(`<text x="${pg.right - ps / 2 - 4}" y="${top + ps + 5}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="6" fill="${INK}">${esc(word)}</text>`);
  pg.y = top + big * 1.5 + 10;

  const size = SIZES[o.size] || 15;
  const rh = rowHeight(size);
  const rows = [
    [L, 'trace'], [lower, 'trace'], [`${L}${lower}`, 'trace'],
    [applyCase(word, o.wordCase || 'title'), 'trace'], ['', 'blank'], ['', 'blank'],
  ];
  for (const [text, style] of rows) {
    if (pg.room < rh) break;
    pg.guides(pg.y, size);
    if (text) fillRow(pg, text, pg.y, size, style, o.dots !== false);
    pg.y += rh;
  }
  return pg.svg();
}

function makeLetters(o, paper) {
  const which = o.letter === 'all' ? Object.keys(ABC) : [o.letter || 'A'];
  return which.map((L) => letterPage(L, paper, o));
}

// ---------------------------------------------------------------- numbers
function tenFrame(pg, x, y, cell, n, colour) {
  let s = '';
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 5; c++) {
      const i = r * 5 + c;
      s += `<rect x="${x + c * cell}" y="${y + r * cell}" width="${cell}" height="${cell}" fill="#fff" stroke="#b9b3d6" stroke-width="0.45"/>`;
      if (i < n) s += `<circle cx="${x + c * cell + cell / 2}" cy="${y + r * cell + cell / 2}" r="${cell * 0.33}" fill="${colour}"/>`;
    }
  }
  pg.add(s);
}

function numberPage(n, paper, o) {
  const word = NUMBER_WORDS[n];
  const pg = new Page(paper, `Number ${n}`, { subtitle: `This is ${word}. Count, trace and write it.` });
  const big = 40;
  const top = pg.y + 2;
  pg.guides(top, big, pg.left, pg.left + 70, false);
  pg.add(drawText(String(n), pg.left + 8, top, big, 'model', true));
  // Ten frames show how many
  const cell = 9.5;
  const fx = pg.left + 80;
  tenFrame(pg, fx, top, cell, Math.min(n, 10), '#ff6b6b');
  if (n > 10) tenFrame(pg, fx, top + cell * 2 + 4, cell, n - 10, '#6c8cff');
  pg.add(`<text x="${fx + cell * 5 + 6}" y="${top + cell * 1.25}" font-family="${TITLE_FONT}" font-weight="800" font-size="9" fill="${INK}">${n}</text>`);
  pg.add(`<text x="${fx + cell * 5 + 6}" y="${top + cell * 1.25 + 7}" font-family="${FONT}" font-weight="700" font-size="4.5" fill="${SOFT}">${word}</text>`);
  pg.y = top + Math.max(big, n > 10 ? cell * 4 + 4 : cell * 2) + 14;

  const size = SIZES[o.size] || 15;
  const rh = rowHeight(size);
  const rows = [[String(n), 'trace'], [String(n), 'trace'], [word, 'trace'], ['', 'blank']];
  for (const [text, style] of rows) {
    if (pg.room < rh) break;
    pg.guides(pg.y, size, pg.left, pg.right, /[gjpqy]/.test(text));
    if (text) fillRow(pg, text, pg.y, size, style, o.dots !== false);
    pg.y += rh;
  }
  // Count the painted pictures
  if (n > 0) {
    const [art, plural] = COUNT_ART[(n - 1) % COUNT_ART.length];
    const ps = Math.min(15, (pg.width - 4) / 10);
    const rows = Math.ceil(n / 10);
    if (pg.room > rows * ps + 12) {
      pg.add(`<text x="${pg.left}" y="${pg.y + 2}" font-family="${FONT}" font-weight="800" font-size="4.5" fill="${INK}">Count the ${n === 1 ? art : plural}:</text>`);
      for (let i = 0; i < n; i++) {
        const x = pg.left + (i % 10) * ps, y = pg.y + 5 + Math.floor(i / 10) * ps;
        pg.add(`<image href="img/${art}.webp" x="${x + ps * 0.06}" y="${y}" width="${ps * 0.88}" height="${ps * 0.88}" preserveAspectRatio="xMidYMid meet"/>`);
      }
      pg.y += rows * ps + 10;
    }
  }
  // Colour the right amount of stars
  if (pg.room > 24) {
    pg.add(`<text x="${pg.left}" y="${pg.y + 2}" font-family="${FONT}" font-weight="800" font-size="4.5" fill="${INK}">Colour ${n} ${n === 1 ? 'star' : 'stars'}:</text>`);
    const count = Math.min(20, Math.max(n + 3, 10));
    const st = Math.min(14, (pg.width - 4) / Math.min(count, 10));
    for (let i = 0; i < count; i++) {
      const cx = pg.left + (i % 10) * st + st / 2, cy = pg.y + 12 + Math.floor(i / 10) * st;
      pg.add(`<path transform="translate(${cx} ${cy}) scale(${st / 30})" d="M0 -12 L3.5 -4 L12 -3.7 L5.5 2 L7.4 10.5 L0 6 L-7.4 10.5 L-5.5 2 L-12 -3.7 L-3.5 -4 Z" fill="none" stroke="${INK}" stroke-width="1.1" stroke-linejoin="round"/>`);
    }
  }
  return pg.svg();
}

function makeNumbers(o, paper) {
  const from = Math.max(0, Math.min(20, +o.from || 0));
  const to = Math.max(from, Math.min(20, +o.to || from));
  const out = [];
  for (let n = from; n <= to; n++) out.push(numberPage(n, paper, o));
  return out;
}

// ---------------------------------------------------------------- maths
function makeProblems(o, rand) {
  const max = +o.within || 10;
  const count = +o.count || 20;
  const list = [];
  const seen = new Set();
  let tries = 0;
  while (list.length < count && tries++ < 5000) {
    const op = o.op === 'mix' ? (rand() < 0.5 ? '+' : '−') : o.op === 'sub' ? '−' : '+';
    let a, b, ans;
    const zeroOk = rand() < 0.06; // sums with 0 only now and then
    if (op === '+') {
      ans = 2 + Math.floor(rand() * (max - 1));
      a = 1 + Math.floor(rand() * (ans - 1));
      b = ans - a;
      if (zeroOk) { a = ans; b = 0; }
    } else {
      a = 2 + Math.floor(rand() * (max - 1));
      b = 1 + Math.floor(rand() * (a - 1));
      ans = a - b;
      if (zeroOk) { b = rand() < 0.5 ? 0 : a; ans = a - b; }
    }
    const key = `${a}${op}${b}`;
    if (seen.has(key) && tries < 4000) continue;
    seen.add(key);
    list.push({ a, b, op, ans });
  }
  return list;
}

function mathsPages(o, paper, problems, answers) {
  const title = { add: 'Adding', sub: 'Taking away', mix: 'Adding and taking away' }[o.op] || 'Maths';
  const pages = [];
  const perPage = o.layout === 'vertical' ? 20 : 20;
  for (let start = 0; start < problems.length; start += perPage) {
    const pg = new Page(paper, answers ? `${title}: answers` : title, { subtitle: `Numbers up to ${o.within}. ${answers ? 'Answer key for grown-ups.' : 'Take your time and check your work!'}`, noName: answers });
    if (!answers) pg.bottom -= CHEER_ROOM;
    const chunk = problems.slice(start, start + perPage);
    const pics = o.pictures && +o.within <= 10;
    if (o.layout === 'vertical') {
      const cols = 4;
      const rows = Math.ceil(chunk.length / cols);
      const cw = pg.width / cols;
      const rhh = Math.min(48, (pg.room - 4) / rows);
      const fs = Math.min(12, rhh * 0.26);
      chunk.forEach((p, i) => {
        const c = i % cols, r = Math.floor(i / cols);
        const x = pg.left + c * cw + cw * 0.62, y = pg.y + r * rhh + fs;
        pg.add(`<text x="${pg.left + c * cw + 3}" y="${y - fs * 0.6}" font-family="${FONT}" font-weight="700" font-size="3.2" fill="${SOFT}">${start + i + 1}</text>`);
        pg.add(`<text x="${x}" y="${y}" text-anchor="end" font-family="${FONT}" font-weight="800" font-size="${fs}" fill="${INK}">${p.a}</text>`);
        pg.add(`<text x="${x - fs * 1.9}" y="${y + fs * 1.1}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${fs}" fill="${INK}">${p.op}</text>`);
        pg.add(`<text x="${x}" y="${y + fs * 1.1}" text-anchor="end" font-family="${FONT}" font-weight="800" font-size="${fs}" fill="${INK}">${p.b}</text>`);
        pg.add(`<line x1="${x - fs * 2.6}" x2="${x + 2}" y1="${y + fs * 1.45}" y2="${y + fs * 1.45}" stroke="${INK}" stroke-width="0.7"/>`);
        if (answers) pg.add(`<text x="${x}" y="${y + fs * 2.6}" text-anchor="end" font-family="${FONT}" font-weight="800" font-size="${fs}" fill="#e0457b">${p.ans}</text>`);
      });
    } else {
      const cols = 2;
      const rows = Math.ceil(chunk.length / cols);
      const cw = pg.width / cols;
      const rhh = Math.min(pics ? 26 : 22, (pg.room - 2) / rows);
      const fs = Math.min(10, rhh * (pics ? 0.36 : 0.45));
      chunk.forEach((p, i) => {
        const c = i % cols, r = Math.floor(i / cols);
        const x = pg.left + c * cw + 4, y = pg.y + r * rhh + fs;
        const eq = `${p.a} ${p.op} ${p.b} =`;
        pg.add(`<text x="${x}" y="${y}" font-family="${FONT}" font-weight="800" font-size="${fs}" fill="${INK}">${eq}</text>`);
        const ex = x + fs * (eq.length * 0.56) + 3;
        if (answers) pg.add(`<text x="${ex + 2}" y="${y}" font-family="${FONT}" font-weight="800" font-size="${fs}" fill="#e0457b">${p.ans}</text>`);
        else pg.add(`<rect x="${ex}" y="${y - fs * 0.95}" width="${fs * 1.9}" height="${fs * 1.25}" rx="2" fill="none" stroke="#b9b3d6" stroke-width="0.5"/>`);
        if (pics) {
          const d = Math.min(3.2, fs * 0.34);
          let dx = x;
          const dots = (n, col) => { for (let k = 0; k < n; k++) { pg.add(`<circle cx="${dx + d}" cy="${y + fs * 0.75}" r="${d * 0.8}" fill="${col}"/>`); dx += d * 2.1; } };
          dots(p.a, '#ff6b6b');
          dx += d * 1.2;
          dots(p.b, p.op === '+' ? '#6c8cff' : '#d6d1e8');
        }
      });
    }
    if (!answers) cheer(pg, (+o.seed || 0) + start);
    pages.push(pg.svg());
  }
  return pages;
}

function makeMaths(o, paper) {
  const rand = rng(+o.seed || 1);
  const problems = makeProblems(o, rand);
  const pages = mathsPages(o, paper, problems, false);
  if (o.key !== false) pages.push(...mathsPages(o, paper, problems, true));
  return pages;
}

// ---------------------------------------------------------------- word search
function buildSearch(words, size, level, rand) {
  const dirs = [[1, 0], [0, 1]];
  if (level !== 'easy') dirs.push([1, 1], [1, -1]);
  if (level === 'hard') dirs.push([-1, 0], [0, -1], [-1, -1], [-1, 1]);
  for (let attempt = 0; attempt < 60; attempt++) {
    const grid = Array.from({ length: size }, () => Array(size).fill(''));
    const placed = [];
    let ok = true;
    const sorted = [...words].sort((a, b) => b.length - a.length);
    for (const w of sorted) {
      let done = false;
      for (let t = 0; t < 400 && !done; t++) {
        const [dx, dy] = dirs[Math.floor(rand() * dirs.length)];
        const x = Math.floor(rand() * size), y = Math.floor(rand() * size);
        const ex = x + dx * (w.length - 1), ey = y + dy * (w.length - 1);
        if (ex < 0 || ey < 0 || ex >= size || ey >= size) continue;
        let fits = true;
        for (let i = 0; i < w.length; i++) {
          const c = grid[y + dy * i][x + dx * i];
          if (c && c !== w[i]) { fits = false; break; }
        }
        if (!fits) continue;
        for (let i = 0; i < w.length; i++) grid[y + dy * i][x + dx * i] = w[i];
        placed.push({ w, x, y, dx, dy });
        done = true;
      }
      if (!done) { ok = false; break; }
    }
    if (!ok) continue;
    const letters = 'ABCDEFGHIJKLMNOPRSTUVWY';
    for (const row of grid) for (let i = 0; i < size; i++) if (!row[i]) row[i] = letters[Math.floor(rand() * letters.length)];
    return { grid, placed };
  }
  return null;
}

function makeWordSearch(o, paper) {
  const rand = rng(+o.seed || 1);
  const size = Math.max(6, Math.min(16, +o.size || 10));
  const words = [...new Set((o.words || '').split(/[,\n]/).map((w) => w.normalize('NFD').replace(/[^A-Za-z]/g, '').toUpperCase()).filter((w) => w.length >= 2 && w.length <= size))].slice(0, 20);
  if (!words.length) words.push('CAT', 'DOG', 'SUN', 'FISH', 'BIRD', 'TREE');
  const built = buildSearch(words, size, o.level || 'easy', rand);
  const title = (o.title || 'Word Search').slice(0, 40);
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const pg = new Page(paper, answers ? `${title}: answers` : title, { subtitle: answers ? 'Answer key for grown-ups.' : 'Find each word and draw a ring around it. Tick it off when you find it!', noName: answers });
    if (!built) {
      pg.add(`<text x="${pg.left}" y="${pg.y + 10}" font-family="${FONT}" font-size="5" fill="${INK}">Too many long words for this grid. Try a bigger grid or fewer words.</text>`);
      pages.push(pg.svg());
      break;
    }
    if (!answers) pg.bottom -= CHEER_ROOM;
    const listH = Math.ceil(words.length / 3) * 8 + 14;
    const gw = Math.min(pg.width, pg.room - listH);
    const cell = gw / size;
    const gx = pg.left + (pg.width - gw) / 2, gy = pg.y;
    pg.add(`<rect x="${gx - 2}" y="${gy - 2}" width="${gw + 4}" height="${gw + 4}" rx="4" fill="#fbfaff" stroke="#b9b3d6" stroke-width="0.6"/>`);
    if (answers) {
      for (const p of built.placed) {
        const x1 = gx + (p.x + 0.5) * cell, y1 = gy + (p.y + 0.5) * cell;
        const x2 = x1 + p.dx * (p.w.length - 1) * cell, y2 = y1 + p.dy * (p.w.length - 1) * cell;
        pg.add(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#ffc93c" stroke-opacity="0.55" stroke-width="${cell * 0.78}" stroke-linecap="round"/>`);
      }
    }
    built.grid.forEach((row, y) => row.forEach((c, x) => {
      pg.add(`<text x="${gx + (x + 0.5) * cell}" y="${gy + (y + 0.5) * cell + cell * 0.2}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${cell * 0.55}" fill="${INK}">${c}</text>`);
    }));
    // Word list with tick boxes
    let wy = gy + gw + 12;
    const cols = 3, cw = pg.width / cols;
    words.forEach((w, i) => {
      const x = pg.left + (i % cols) * cw + 4, y = wy + Math.floor(i / cols) * 8;
      pg.add(`<rect x="${x}" y="${y - 3.8}" width="4.4" height="4.4" rx="1" fill="none" stroke="${SOFT}" stroke-width="0.45"/>`);
      pg.add(`<text x="${x + 7}" y="${y}" font-family="${FONT}" font-weight="800" font-size="4.8" fill="${INK}">${w}</text>`);
    });
    if (!answers) cheer(pg, (+o.seed || 0) + words.length);
    pages.push(pg.svg());
  }
  return pages;
}

// ---------------------------------------------------------------- spelling
function makeSpelling(o, paper) {
  const words = (o.words || '').split(/[,\n]/).map((w) => applyCase(w.trim(), o.case)).filter((w) => cleanText(w).trim()).slice(0, 40);
  if (!words.length) words.push('cat', 'sun', 'play', 'friend');
  const pages = [];
  const want = { large: 17, medium: 12.5, small: 9.5 }[o.size] || 12.5;
  let pg = null;
  const title = (o.title || 'My spelling words').slice(0, 40);
  for (const w of words) {
    const size = fitSize(w, want, (pg ? pg.width : 180) / 2.4);
    const rh = rowHeight(size);
    const block = rh * 2;
    if (!pg || pg.room < block) {
      if (pg) { cheer(pg, pages.length + 3); pages.push(pg.svg()); }
      pg = new Page(paper, title, { subtitle: 'Look, trace, then write it on your own.' });
      pg.bottom -= CHEER_ROOM;
    }
    pg.guides(pg.y, size);
    const unit = (textWidth(w) / 100) * size;
    let x = pg.left + size * 0.35;
    pg.add(drawText(w, x, pg.y, size, 'model', o.dots !== false));
    x += unit + size * 1.1;
    while (x + unit <= pg.right - size * 0.2) {
      pg.add(drawText(w, x, pg.y, size, 'trace'));
      x += unit + size * 1.1;
    }
    pg.y += rh;
    pg.guides(pg.y, size); // an empty row to write it alone
    pg.y += rh;
  }
  cheer(pg, pages.length + 3);
  pages.push(pg.svg());
  return pages;
}

const MAKERS = { names: makeNames, letters: makeLetters, numbers: makeNumbers, maths: makeMaths, wordsearch: makeWordSearch, spelling: makeSpelling };

;
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
  return `${n}'s`;
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
      let sc = 2.1, spots = [];
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

;
// PrintPals batch 2: photo colouring pages, story sheets, bingo, birthday party pack,
// certificates, dot to dot, picture sudoku and b/d letter mix-ups.

/** A picture centred on (cx, cy): one of our painted pictures or an emoji. */
function pic(src, cx, cy, size) {
  if (src.startsWith('img/')) return `<image href="${src}" x="${(cx - size / 2).toFixed(2)}" y="${(cy - size / 2).toFixed(2)}" width="${size.toFixed(2)}" height="${size.toFixed(2)}" preserveAspectRatio="xMidYMid meet"/>`;
  return emoji(src, cx, cy, size * 0.84);
}

function shuffle(list, rand) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function nameOf(v, fallback) {
  const n = String(v || '').trim().replace(/\s+/g, ' ').slice(0, 24);
  return n ? n[0].toUpperCase() + n.slice(1) : fallback;
}

function listOf(text, max = 30) {
  return String(text || '').split(/[\n,]/).map((s) => s.trim().replace(/\s+/g, ' ')).filter(Boolean).slice(0, max);
}

function starPath(cx, cy, r, inner = 0.45) {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * inner : r;
    d += `${i ? 'L' : 'M'}${(cx + Math.cos(a) * rr).toFixed(2)} ${(cy + Math.sin(a) * rr).toFixed(2)} `;
  }
  return d + 'Z';
}

/** Font size so [text] fits in [width] (rough, for rounded sans fonts). */
function fitFont(text, want, width, k = 0.56) {
  return Math.min(want, width / (Math.max(1, String(text).length) * k));
}

function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function scissors(pg, y) {
  pg.add(`<line x1="${pg.left}" x2="${pg.right}" y1="${y}" y2="${y}" stroke="#b9b3d6" stroke-width="0.35" stroke-dasharray="2.2 1.6"/>`);
  pg.add(emoji('✂️', pg.left + 4, y - 0.2, 5));
}

// ================================================================ pictures
const SETS = {
  animals: [['Cat', 'img/cat.webp'], ['Dog', 'img/dog.webp'], ['Fish', 'img/fish.webp'], ['Gorilla', 'img/gorilla.webp'], ['Lion', 'img/lion.webp'],
    ['Monkey', 'img/monkey.webp'], ['Octopus', 'img/octopus.webp'], ['Pig', 'img/pig.webp'], ['Turtle', 'img/turtle.webp'], ['Zebra', 'img/zebra.webp'],
    ['Rabbit', '🐰'], ['Frog', '🐸'], ['Owl', '🦉'], ['Elephant', '🐘'], ['Giraffe', '🦒'], ['Bee', '🐝'], ['Duck', '🦆'], ['Penguin', '🐧'],
    ['Butterfly', '🦋'], ['Snail', '🐌'], ['Bear', '🐻'], ['Chick', '🐥'], ['Ladybird', '🐞'], ['Ant', '🐜']],
  food: [['Apple', 'img/apple.webp'], ['Egg', 'img/egg.webp'], ['Banana', '🍌'], ['Strawberry', '🍓'], ['Carrot', '🥕'], ['Cake', '🎂'],
    ['Cookie', '🍪'], ['Pizza', '🍕'], ['Ice cream', '🍦'], ['Grapes', '🍇'], ['Pear', '🍐'], ['Cheese', '🧀'], ['Bread', '🍞'],
    ['Watermelon', '🍉'], ['Cupcake', '🧁'], ['Lemon', '🍋'], ['Corn', '🌽'], ['Cherries', '🍒'], ['Orange', '🍊'], ['Blueberries', '🫐'], ['Doughnut', '🍩'], ['Mushroom', '🍄']],
  things: [['Balloon', 'img/balloon.webp'], ['Hat', 'img/hat.webp'], ['Rainbow', 'img/rainbow.webp'], ['Star', 'img/star.webp'], ['Sun', 'img/sun.webp'],
    ['Nest', 'img/nest.webp'], ['Kite', '🪁'], ['Ball', '⚽'], ['Car', '🚗'], ['Rocket', '🚀'], ['Umbrella', '☂️'], ['Book', '📚'], ['Teddy', '🧸'],
    ['Crayon', '🖍️'], ['Bike', '🚲'], ['Boat', '⛵'], ['Moon', '🌙'], ['Tree', '🌳'], ['Sunflower', '🌻'], ['Tulip', '🌷'], ['Drum', '🥁'], ['Blocks', 'img/blocks.webp'], ['Heart', '❤️'], ['Medal', '🏅']],
  party: [['Cake', '🎂'], ['Balloon', 'img/balloon.webp'], ['Present', '🎁'], ['Popper', '🎉'], ['Cupcake', '🧁'], ['Party hat', 'img/hat.webp'],
    ['Sweets', '🍬'], ['Lollipop', '🍭'], ['Star', 'img/star.webp'], ['Crown', '👑'], ['Music', '🎵'], ['Juice', '🧃'], ['Ice cream', '🍦'],
    ['Teddy', '🧸'], ['Confetti', '🎊'], ['Doughnut', '🍩'], ['Rainbow', 'img/rainbow.webp'], ['Games', '🎲']],
};
// Use our painted pictures wherever we have one.
for (const k in SETS) SETS[k] = SETS[k].map(([n, src]) => [n, artFor(src) || src]);
const PAINTED = [...SETS.animals, ...SETS.food, ...SETS.things].filter(([, s]) => s.startsWith('img/'));
const SIGHT_WORDS = ['the', 'and', 'is', 'it', 'in', 'to', 'my', 'you', 'we', 'see', 'look', 'can', 'go', 'said', 'was', 'play', 'like', 'come', 'here', 'big', 'little', 'up', 'down', 'said', 'yes', 'no', 'for', 'at'];

// ================================================================ photo colouring page
const PHOTO = { img: null, demo: false, loading: false, error: false, cache: {} };

function loadPhoto(src, demo) {
  const im = new Image();
  PHOTO.loading = true;
  im.onload = () => { Object.assign(PHOTO, { img: im, demo, loading: false, error: false, cache: {} }); if (window.PrintPals) window.PrintPals.render(); };
  im.onerror = () => { Object.assign(PHOTO, { loading: false, error: true }); if (window.PrintPals) window.PrintPals.render(); };
  im.src = src;
}

(function watchPhotoInput() {
  const input = typeof document !== 'undefined' && document.querySelector('#maker[data-tool=photo] input[type=file]');
  if (!input) return;
  input.addEventListener('change', () => {
    const f = input.files && input.files[0];
    if (!f) return;
    loadPhoto(URL.createObjectURL(f), false); // stays on this device
  });
})();

function boxBlur(src, w, h, r) {
  if (r < 1) return src.slice();
  const tmp = new Float32Array(w * h), out = new Float32Array(w * h), d = 2 * r + 1;
  for (let y = 0; y < h; y++) {
    const row = y * w;
    let acc = 0;
    for (let x = -r; x <= r; x++) acc += src[row + Math.min(w - 1, Math.max(0, x))];
    for (let x = 0; x < w; x++) {
      tmp[row + x] = acc / d;
      acc += src[row + Math.min(w - 1, x + r + 1)] - src[row + Math.max(0, x - r)];
    }
  }
  for (let x = 0; x < w; x++) {
    let acc = 0;
    for (let y = -r; y <= r; y++) acc += tmp[Math.min(h - 1, Math.max(0, y)) * w + x];
    for (let y = 0; y < h; y++) {
      out[y * w + x] = acc / d;
      acc += tmp[Math.min(h - 1, y + r + 1) * w + x] - tmp[Math.max(0, y - r) * w + x];
    }
  }
  return out;
}
const smooth = (a, w, h, r) => boxBlur(boxBlur(a, w, h, r), w, h, r);

/** Turns a photo into clean black line art, all inside the browser. */
function lineArt(img, detail) {
  const set = { simple: { r1: 2, r2: 7, t: 5.5, min: 260 }, medium: { r1: 1, r2: 4, t: 4, min: 120 }, detailed: { r1: 1, r2: 3, t: 3, min: 50 } }[detail] || { r1: 1, r2: 4, t: 4, min: 120 };
  const long = 1400;
  const k = long / Math.max(img.naturalWidth, img.naturalHeight);
  const w = Math.round(img.naturalWidth * k), h = Math.round(img.naturalHeight * k);
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const x = c.getContext('2d');
  x.fillStyle = '#fff'; x.fillRect(0, 0, w, h);
  x.imageSmoothingQuality = 'high';
  x.drawImage(img, 0, 0, w, h);
  const data = x.getImageData(0, 0, w, h);
  const px = data.data;
  // Edges in brightness and in each colour, so an orange mane on a cream face still gets a line.
  const ink = new Float32Array(w * h);
  const mask = new Uint8Array(w * h);
  for (let ch = 0; ch < 4; ch++) {
    const g = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) g[i] = ch < 3 ? px[i * 4 + ch] : px[i * 4] * 0.299 + px[i * 4 + 1] * 0.587 + px[i * 4 + 2] * 0.114;
    const a = smooth(g, w, h, set.r1), b = smooth(g, w, h, set.r2);
    const t = ch < 3 ? set.t * 1.3 : set.t;
    for (let i = 0; i < w * h; i++) {
      const v = Math.max(0, Math.min(1, (b[i] - a[i] - t) / (t * 1.1)));
      if (v > ink[i]) ink[i] = v;
    }
  }
  for (let i = 0; i < w * h; i++) if (ink[i] > 0.2) mask[i] = 1;
  // Tidy away little specks so the page is calm and easy to colour.
  const seen = new Uint8Array(w * h), stack = new Int32Array(w * h);
  const minArea = set.min * (w * h) / (1400 * 1050);
  for (let i = 0; i < w * h; i++) {
    if (!mask[i] || seen[i]) continue;
    let top = 0, n = 0;
    const blob = [];
    stack[top++] = i; seen[i] = 1;
    while (top) {
      const p = stack[--top];
      blob.push(p); n++;
      const py = (p / w) | 0, pxx = p - py * w;
      if (pxx > 0 && mask[p - 1] && !seen[p - 1]) { seen[p - 1] = 1; stack[top++] = p - 1; }
      if (pxx < w - 1 && mask[p + 1] && !seen[p + 1]) { seen[p + 1] = 1; stack[top++] = p + 1; }
      if (py > 0 && mask[p - w] && !seen[p - w]) { seen[p - w] = 1; stack[top++] = p - w; }
      if (py < h - 1 && mask[p + w] && !seen[p + w]) { seen[p + w] = 1; stack[top++] = p + w; }
    }
    if (n < minArea) for (const p of blob) ink[p] = 0;
  }
  // Solid lines: every line pixel becomes full ink (no pale, fading lines), then lines are
  // thickened a little and softened by one pixel so they print smooth and even.
  const solid = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) solid[i] = ink[i] > 0.22 ? 1 : 0;
  const grow = { simple: 3, medium: 2, detailed: 1 }[detail] || 2;
  let thick = solid;
  if (grow > 0) {
    const t = boxBlur(solid, w, h, grow);
    thick = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) thick[i] = t[i] > 0.12 ? 1 : 0;
  }
  const soft = boxBlur(thick, w, h, 1);
  for (let i = 0; i < w * h; i++) {
    const v = 255 - Math.round(Math.min(1, soft[i] * 1.6) * 240);
    px[i * 4] = px[i * 4 + 1] = px[i * 4 + 2] = v; px[i * 4 + 3] = 255;
  }
  x.putImageData(data, 0, 0);
  return { src: c.toDataURL('image/png'), w, h };
}

function makePhoto(o, paper) {
  if (!PHOTO.img && !PHOTO.loading && !PHOTO.error) loadPhoto('img/lion.webp', true);
  const name = String(o.name || '').trim();
  const title = (o.title || '').trim() || (name ? `${possessive(nameOf(name))} Colouring Page` : 'My Colouring Page');
  if (!PHOTO.img) {
    const pg = new Page(paper, title, { subtitle: 'Colour me in!', noName: true });
    pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="${pg.room}" rx="8" fill="#fbfaff" stroke="#d9d4ec" stroke-width="0.6" stroke-dasharray="3 2"/>`);
    pg.add(`<text x="${pg.w / 2}" y="${pg.y + pg.room / 2}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="6" fill="${SOFT}">${PHOTO.error ? 'That photo would not open. Please try another one.' : 'Choose a photo to begin'}</text>`);
    return [pg.svg()];
  }
  const detail = o.detail || 'medium';
  if (!PHOTO.cache[detail]) PHOTO.cache[detail] = lineArt(PHOTO.img, detail);
  const art = PHOTO.cache[detail];
  const landscape = art.w > art.h * 1.15;
  const pg = new Page(paper, title, { subtitle: PHOTO.demo ? 'A sample. Choose your own photo to make yours.' : 'Colour me in!', noName: true, landscape });
  const frame = o.frame !== false;
  const pad = frame ? 7 : 0;
  const bx = pg.left + 4, by = pg.y + 3, bw = pg.width - 8, bh = pg.room - 5;
  if (frame) {
    pg.add(`<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="7" fill="none" stroke="${INK}" stroke-width="1.1"/>`);
    pg.add(`<rect x="${bx + 2.2}" y="${by + 2.2}" width="${bw - 4.4}" height="${bh - 4.4}" rx="5.5" fill="none" stroke="${INK}" stroke-width="0.35"/>`);
    for (const [cx, cy] of [[bx, by], [bx + bw, by], [bx, by + bh], [bx + bw, by + bh]]) {
      pg.add(`<path d="${starPath(cx, cy, 6.5, 0.48)}" fill="#fff" stroke="${INK}" stroke-width="0.8" stroke-linejoin="round"/>`);
    }
  }
  const aw = bw - pad * 2, ah = bh - pad * 2;
  const s = Math.min(aw / art.w, ah / art.h);
  const iw = art.w * s, ih = art.h * s;
  pg.add(`<image href="${art.src}" x="${bx + pad + (aw - iw) / 2}" y="${by + pad + (ah - ih) / 2}" width="${iw}" height="${ih}" preserveAspectRatio="xMidYMid meet"/>`);
  return [pg.svg()];
}

// ================================================================ story sheets
const STORIES = {
  balloon: {
    title: '{name} and the Big Red Balloon', pic: 'img/balloon.webp', words: ['balloon', 'wind', 'tree'],
    text: ['{name} has a big red balloon.', 'Whoosh! The wind blows it away.', '{name} and {friend} run and run.', 'The balloon is stuck in a tall tree.',
      '{friend} climbs up and gets it down.', '{name} gives {friend} a big hug and says, "Thank you!"'],
    q: [['What colour is the balloon?', '🔴 red', '🔵 blue', '🟢 green'], ['Where does the balloon get stuck?', '🌳 in a tree', '🏠 on a roof', '🌊 in the sea'],
      ['What does {name} say?', '"Thank you!"', '"Good night!"', '"Go away!"']],
  },
  kitten: {
    title: '{name} Finds a Kitten', pic: 'img/cat.webp', words: ['kitten', 'lost', 'door'],
    text: ['{name} hears a little sound. Meow!', 'It is a small grey kitten.', 'The kitten is lost and sad.', '{name} and {friend} look for its home.',
      'They find a house with a blue door.', 'A man opens the door and smiles. "My kitten!"', 'The kitten purrs and purrs.'],
    q: [['What animal does {name} find?', '🐱 a kitten', '🐶 a puppy', '🦆 a duck'], ['How does the kitten feel at first?', '😢 sad', '😄 happy', '😴 sleepy'],
      ['What colour is the door?', '🔵 blue', '🔴 red', '🟡 yellow']],
  },
  picnic: {
    title: "{name}'s Picnic in the Park", pic: 'img/apple.webp', words: ['picnic', 'park', 'sandwich'],
    text: ['{name} and {friend} go to the park.', 'They have a picnic on a big rug.', 'They have apples, sandwiches and juice.', 'A cheeky dog runs up to the rug.',
      'Snap! The dog takes a sandwich!', 'Everyone laughs, and the dog wags its tail.'],
    q: [['Where do they have the picnic?', '🌳 at the park', '🏖️ at the beach', '🏫 at school'], ['What does the dog take?', '🥪 a sandwich', '🍎 an apple', '⚽ a ball'],
      ['What does everyone do?', '😄 laugh', '😢 cry', '😴 sleep']],
  },
  rocket: {
    title: '{name} Goes to the Moon', pic: '🚀', words: ['rocket', 'moon', 'jump'],
    text: ['{name} makes a rocket from a big box.', '3, 2, 1, blast off!', 'The rocket zooms up to the moon.', 'The moon is quiet and grey.',
      '{name} can jump very, very high!', 'Then {name} flies home for tea.'],
    q: [['What is the rocket made from?', '📦 a box', '🌳 a tree', '🚗 a car'], ['Where does the rocket go?', '🌙 the moon', '🌊 the sea', '🦁 the zoo'],
      ['What can {name} do on the moon?', '🦘 jump high', '🏊 swim', '🎂 bake a cake']],
  },
  rain: {
    title: '{name} and the Rainy Day', pic: 'img/rainbow.webp', words: ['rain', 'puddle', 'rainbow'],
    text: ['Drip, drop! It is raining.', '{name} puts on boots and a coat.', '{name} and {friend} go outside.', 'They jump in big puddles. Splash!',
      'Then the sun comes out.', 'They see a rainbow in the sky.'],
    q: [['What is the weather at the start?', '🌧️ rainy', '❄️ snowy', '☀️ sunny'], ['What do they jump in?', '💦 puddles', '🍂 leaves', '🏖️ sand'],
      ['What do they see at the end?', '🌈 a rainbow', '✈️ a plane', '🐦 a bird']],
  },
  turtle: {
    title: "{name}'s Turtle Wins the Race", pic: 'img/turtle.webp', words: ['turtle', 'race', 'slow'],
    text: ['{name} has a pet turtle called Speedy.', 'Speedy is very, very slow.', 'One day there is a race in the park.', 'The rabbit runs fast, then stops for a nap.',
      'Speedy keeps going, step by step.', 'Speedy wins the race! {name} and {friend} cheer.'],
    q: [['What is the turtle called?', 'Speedy', 'Sleepy', 'Spot'], ['Who stops for a nap?', '🐰 the rabbit', '🐢 Speedy', '🐶 the dog'],
      ['Who wins the race?', '🐢 Speedy', '🐰 the rabbit', '🦊 the fox']],
  },

  beach: {
    title: '{name} Goes to the Beach', pic: '🏖️', words: ['beach', 'sandcastle', 'wave'],
    text: ['{name} and {friend} go to the beach.', 'The sun is hot and the sea is blue.', 'They build a big sandcastle.', 'A little crab walks past. Snip, snap!', 'Then a wave comes. Splash!', 'The sandcastle is gone, so they build another one.'],
    q: [['Where do they go?', '🏖️ the beach', '🌳 the park', '🏫 school'], ['What do they build?', '🏰 a sandcastle', '🚀 a rocket', '🏠 a house'],
      ['What walks past?', '🦀 a crab', '🐶 a dog', '🐢 a turtle']],
  },
  snowman: {
    title: '{name} Builds a Snowman', pic: '⛄', words: ['snow', 'snowman', 'scarf'],
    text: ['It is snowing!', '{name} puts on a hat and gloves.', '{name} and {friend} roll a big ball of snow.', 'They make a snowman with a carrot nose.', 'The snowman gets a warm scarf.', '"Hello, Mr Snowman!" says {name}.'],
    q: [['What is the weather?', '❄️ snowy', '☀️ sunny', '🌧️ rainy'], ['What is the nose made of?', '🥕 a carrot', '🍎 an apple', '🍌 a banana'],
      ['What does the snowman get?', '🧣 a scarf', '👟 shoes', '🎒 a bag']],
  },
  teddy: {
    title: '{name} and the Lost Teddy', pic: 'img/bear.webp', words: ['teddy', 'under', 'garden'],
    text: ['{name} cannot find Teddy.', '{name} looks under the bed. No Teddy!', '{name} looks in the toy box. No Teddy!', '{friend} looks in the garden.', 'Teddy is sitting under a tree!', '{name} gives Teddy a big squeeze.'],
    q: [['Who is lost?', '🧸 Teddy', '🐱 the cat', '🐶 the dog'], ['Where is Teddy?', '🌳 under a tree', '🛏️ under the bed', '📦 in the toy box'],
      ['What does {name} do at the end?', '🤗 gives Teddy a squeeze', '😴 goes to sleep', '🏃 runs away']],
  },
  baking: {
    title: '{name} Bakes a Cake', pic: 'img/cake.webp', words: ['bake', 'oven', 'share'],
    text: ['{name} wants to bake a cake.', 'In go the eggs, the flour and the sugar.', '{name} and {friend} mix and mix.', 'The cake goes in the hot oven.', 'Ding! The cake is ready.', 'They share it with everyone. Yum!'],
    q: [['What do they make?', '🎂 a cake', '🍕 a pizza', '🥪 a sandwich'], ['Where does the cake go?', '🔥 in the oven', '🧊 in the fridge', '🛁 in the bath'],
      ['What do they do with the cake?', '🤝 share it', '🗑️ throw it away', '🎁 hide it']],
  },
};

function makeStory(o, paper) {
  const rand = rng(+o.seed || 1);
  const name = nameOf(o.name, 'Mia'), friend = nameOf(o.friend, 'Leo');
  const fill = (s) => s.replace(/\{name\}/g, name).replace(/\{friend\}/g, friend);
  const keys = o.story === 'all' ? Object.keys(STORIES) : [STORIES[o.story] ? o.story : 'balloon'];
  const big = o.text !== 'small';
  const pages = [];
  keys.forEach((key, si) => {
    const st = STORIES[key];
    const c = si % PALETTE.length;
    const pg = new Page(paper, fill(st.title), { subtitle: 'Read the story, then answer the questions.', noName: false });
    // Words to know
    let x = pg.left;
    pg.add(`<text x="${x}" y="${pg.y + 4}" font-family="${FONT}" font-weight="800" font-size="4" fill="${SOFT}">Words to know:</text>`);
    x += 33;
    for (const w of st.words) {
      const ww = w.length * 2.6 + 8;
      pg.add(`<rect x="${x}" y="${pg.y - 0.8}" width="${ww}" height="7" rx="3.5" fill="${TINTS[c]}" stroke="${PALETTE[c]}" stroke-width="0.4"/>`);
      pg.add(`<text x="${x + ww / 2}" y="${pg.y + 4}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="4.4" fill="${INK}">${esc(w)}</text>`);
      x += ww + 3;
    }
    pg.y += 13;
    // The story
    const fs = big ? 6.4 : 5.2, lh = 1.62;
    const artW = big ? 44 : 38;
    const perLine = Math.floor((pg.width - artW - 16) / (fs * 0.5));
    const lines = [];
    st.text.map(fill).forEach((sen) => lines.push(...wrap(sen, perLine)));
    const boxH = Math.max(artW + 10, lines.length * fs * lh + 10);
    pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="${boxH}" rx="7" fill="${TINTS[c]}"/>`);
    pg.add(`<rect x="${pg.left}" y="${pg.y}" width="2.4" height="${boxH}" rx="1.2" fill="${PALETTE[c]}"/>`);
    pg.add(pic(st.pic, pg.right - artW / 2 - 4, pg.y + artW / 2 + 5, artW));
    textLines(pg, lines, pg.left + 8, pg.y + 6 + fs, fs, { weight: 700, lh, font: FONT });
    pg.y += boxH + 5;
    pg.add(`<text x="${pg.left}" y="${pg.y + 3}" font-family="${FONT}" font-weight="700" font-size="4" fill="${SOFT}">Read it again and draw a ring around ${esc(name)} every time you see the name!</text>`);
    pg.y += 11;
    // Questions
    pg.add(`<text x="${pg.left}" y="${pg.y}" font-family="${TITLE_FONT}" font-weight="800" font-size="6.5" fill="${INK}">Questions</text>`);
    pg.y += 5;
    const write = o.answers === 'write';
    st.q.forEach(([q, ...opts], i) => {
      const qc = PALETTE[(c + i + 1) % PALETTE.length];
      pg.add(`<circle cx="${pg.left + 4}" cy="${pg.y + 4}" r="4" fill="${qc}"/><text x="${pg.left + 4}" y="${pg.y + 5.6}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="4.4" fill="#fff">${i + 1}</text>`);
      pg.add(`<text x="${pg.left + 11}" y="${pg.y + 5.6}" font-family="${FONT}" font-weight="800" font-size="5" fill="${INK}">${esc(fill(q))}</text>`);
      if (write) {
        pg.add(`<line x1="${pg.left + 11}" x2="${pg.right}" y1="${pg.y + 17}" y2="${pg.y + 17}" stroke="#7f78a8" stroke-width="0.4"/>`);
        pg.y += 23;
      } else {
        const order = shuffle(opts, rand);
        const cw = (pg.width - 11) / 3;
        order.forEach((t, k) => {
          const ox = pg.left + 11 + k * cw;
          pg.add(`<rect x="${ox}" y="${pg.y + 9.5}" width="5.5" height="5.5" rx="1.4" fill="#fff" stroke="${INK}" stroke-width="0.5"/>`);
          pg.add(`<text x="${ox + 8}" y="${pg.y + 14}" font-family="${FONT}" font-weight="700" font-size="4.8" fill="${INK}">${esc(fill(t))}</text>`);
        });
        pg.y += 22;
      }
    });
    // Draw your favourite part
    const dh = pg.bottom - pg.y - 2;
    if (dh > 30) {
      pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="${dh}" rx="6" fill="#fff" stroke="#b9b3d6" stroke-width="0.6" stroke-dasharray="2.5 1.6"/>`);
      pg.add(`<text x="${pg.left + 5}" y="${pg.y + 7}" font-family="${FONT}" font-weight="800" font-size="4.6" fill="${SOFT}">🖍️ Draw your favourite part of the story</text>`);
    }
    pages.push(pg.svg());
  });
  return pages;
}

// ================================================================ bingo
function bingoPool(o) {
  if (o.theme === 'words') {
    const w = [...new Set(listOf(o.words, 40).map((s) => s.slice(0, 14)))];
    for (const s of SIGHT_WORDS) if (w.length < 12 && !w.includes(s)) w.push(s);
    return w.map((s) => [s, '']);
  }
  if (o.theme === 'mix') return [...SETS.animals, ...SETS.food, ...SETS.things];
  return SETS[o.theme] || SETS.animals;
}

function bingoCard(pg, x, y, w, h, n, cells, opts) {
  const c = opts.colour;
  pg.add(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" fill="${TINTS[c]}" stroke="${PALETTE[c]}" stroke-width="0.9"/>`);
  const letters = 'BINGO';
  letters.split('').forEach((L, i) => {
    const cx = x + 12 + i * 13.5, cy = y + 11.5;
    pg.add(`<circle cx="${cx}" cy="${cy}" r="6" fill="${PALETTE[(c + i) % PALETTE.length]}"/>`);
    pg.add(`<text x="${cx}" y="${cy + 2.9}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="8" fill="#fff">${L}</text>`);
  });
  if (opts.name) {
    const fs = fitFont(opts.name, 7.5, w - 90);
    pg.add(`<text x="${x + w - 8}" y="${y + 14}" text-anchor="end" font-family="${TITLE_FONT}" font-weight="800" font-size="${fs}" fill="${INK}">${esc(opts.name)}</text>`);
  } else {
    pg.add(`<text x="${x + 80}" y="${y + 14}" font-family="${FONT}" font-weight="700" font-size="3.8" fill="${SOFT}">Name</text>`);
    pg.add(`<line x1="${x + 92}" x2="${x + w - 8}" y1="${y + 14.5}" y2="${y + 14.5}" stroke="${SOFT}" stroke-width="0.3"/>`);
  }
  const top = y + 23;
  const cell = Math.min((w - 14) / n, (h - 29) / n);
  const gx = x + (w - cell * n) / 2;
  const free = opts.free && n % 2 === 1;
  const mid = Math.floor(n / 2);
  let k = 0;
  for (let r = 0; r < n; r++) {
    for (let q = 0; q < n; q++) {
      const cx = gx + q * cell, cy = top + r * cell;
      pg.add(`<rect x="${cx + 0.7}" y="${cy + 0.7}" width="${cell - 1.4}" height="${cell - 1.4}" rx="2.5" fill="#fff" stroke="${INK}" stroke-width="0.45"/>`);
      if (free && r === mid && q === mid) {
        pg.add(`<path d="${starPath(cx + cell / 2, cy + cell * 0.44, cell * 0.3)}" fill="#ffc93c"/>`);
        pg.add(`<text x="${cx + cell / 2}" y="${cy + cell * 0.88}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${cell * 0.15}" fill="${INK}">FREE</text>`);
        continue;
      }
      const [label, src] = cells[k++];
      if (src) {
        pg.add(pic(src, cx + cell / 2, cy + cell * (opts.words ? 0.42 : 0.5), cell * (opts.words ? 0.56 : 0.68)));
        if (opts.words) {
          const fs = fitFont(label, cell * 0.13, cell * 0.9, 0.55);
          pg.add(`<text x="${cx + cell / 2}" y="${cy + cell * 0.87}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${fs}" fill="${INK}">${esc(label)}</text>`);
        }
      } else {
        const fs = fitFont(label, cell * 0.3, cell * 0.86, 0.56);
        pg.add(`<text x="${cx + cell / 2}" y="${cy + cell / 2 + fs * 0.35}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${fs}" fill="${INK}">${esc(label)}</text>`);
      }
    }
  }
}

function makeBingo(o, paper) {
  const rand = rng(+o.seed || 1);
  const n = o.grid === '4' ? 4 : o.grid === '5' ? 5 : 3;
  const free = o.free !== false && n % 2 === 1;
  const need = n * n - (free ? 1 : 0);
  let pool = bingoPool(o);
  if (pool.length < need + 2) {
    const extra = o.theme === 'words' ? SIGHT_WORDS.map((s) => [s, '']) : [...SETS.animals, ...SETS.food, ...SETS.things];
    const have = new Set(pool.map(([l]) => l.toLowerCase()));
    for (const it of shuffle(extra, rand)) if (pool.length < need + 6 && !have.has(it[0].toLowerCase())) { pool = [...pool, it]; have.add(it[0].toLowerCase()); }
  }
  const names = listOf(o.names, 40).map((s) => nameOf(s, ''));
  const count = names.length || Math.max(1, Math.min(40, +o.cards || 6));
  const seen = new Set(), cards = [];
  for (let i = 0; i < count; i++) {
    let pick;
    for (let t = 0; t < 60; t++) {
      pick = shuffle(pool, rand).slice(0, need);
      const key = pick.map(([l]) => l).sort().join('|');
      if (!seen.has(key)) { seen.add(key); break; }
    }
    cards.push(pick);
  }
  const pages = [];
  const words = o.theme === 'words' ? false : o.labels !== false;
  for (let i = 0; i < cards.length; i += 2) {
    const pg = new Page(paper, '', { bare: true });
    const h = (pg.bottom - pg.m - 10) / 2;
    [0, 1].forEach((j) => {
      if (!cards[i + j]) return;
      bingoCard(pg, pg.left, pg.m + j * (h + 10), pg.width, h, n, cards[i + j], { name: names[i + j] || o.cardName || '', colour: (i + j) % PALETTE.length, free, words });
    });
    if (cards[i + 1]) scissors(pg, pg.m + h + 5);
    pages.push(pg.svg());
  }
  // Calling cards: every picture that is on a card
  const used = [];
  const got = new Set();
  for (const card of cards) for (const it of card) if (!got.has(it[0])) { got.add(it[0]); used.push(it); }
  if (o.caller !== false) {
    const pg = new Page(paper, 'Bingo calling cards', { subtitle: 'Cut out the cards, put them in a bag and pull out one at a time.', noName: true });
    let cols = 4;
    let cw, ch, rows;
    for (;; cols++) { cw = pg.width / cols; ch = cw * 0.86; rows = Math.ceil(used.length / cols); if (rows * ch <= pg.room || cols >= 8) break; }
    used.forEach(([label, src], i) => {
      const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch;
      pg.add(`<rect x="${x + 0.6}" y="${y + 0.6}" width="${cw - 1.2}" height="${ch - 1.2}" rx="3" fill="${TINTS[i % TINTS.length]}" stroke="#c9c3e3" stroke-width="0.35" stroke-dasharray="2 1.4"/>`);
      if (src) {
        pg.add(pic(src, x + cw / 2, y + ch * 0.42, ch * 0.52));
        pg.add(`<text x="${x + cw / 2}" y="${y + ch * 0.86}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${fitFont(label, ch * 0.12, cw * 0.9)}" fill="${INK}">${esc(label)}</text>`);
      } else {
        const fs = fitFont(label, ch * 0.3, cw * 0.86);
        pg.add(`<text x="${x + cw / 2}" y="${y + ch / 2 + fs * 0.35}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${fs}" fill="${INK}">${esc(label)}</text>`);
      }
    });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ birthday party pack
function balloonShape(cx, cy, r, colour) {
  const s = `<path d="M${cx} ${cy + r * 1.18} Q${cx - r * 0.5} ${cy + r * 1.6} ${cx + r * 0.1} ${cy + r * 2.1} T${cx} ${cy + r * 2.9}" fill="none" stroke="#9a93b8" stroke-width="0.45"/>`;
  return s + `<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 1.18}" fill="${colour}"/>`
    + `<path d="M${cx - r * 0.16} ${cy + r * 1.3} L${cx + r * 0.16} ${cy + r * 1.3} L${cx} ${cy + r * 1.12} Z" fill="${colour}"/>`
    + `<ellipse cx="${cx - r * 0.38}" cy="${cy - r * 0.45}" rx="${r * 0.2}" ry="${r * 0.32}" fill="#fff" opacity="0.45" transform="rotate(-25 ${cx - r * 0.38} ${cy - r * 0.45})"/>`;
}

function bunting(pg, y, rand) {
  const x1 = pg.left - 4, x2 = pg.right + 4, sag = 9;
  pg.add(`<path d="M${x1} ${y} Q${(x1 + x2) / 2} ${y + sag * 2} ${x2} ${y}" fill="none" stroke="${INK}" stroke-width="0.4"/>`);
  const n = 13;
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    const x = x1 + (x2 - x1) * t, yy = y + 2 * sag * t * (1 - t) * 2;
    pg.add(`<path d="M${x - 5.5} ${yy} L${x + 5.5} ${yy} L${x} ${yy + 11} Z" fill="${PALETTE[i % PALETTE.length]}"/>`);
  }
}

function partyPoster(o, paper, name, age, rand) {
  const pg = new Page(paper, '', { bare: true });
  bunting(pg, pg.m + 2, rand);
  for (let i = 0; i < 70; i++) {
    const x = pg.left + rand() * pg.width, y = pg.m + 30 + rand() * (pg.h - 60);
    const c = PALETTE[Math.floor(rand() * PALETTE.length)];
    if (x > pg.left + 30 && x < pg.right - 30 && y > pg.m + 45 && y < pg.h - 70) continue;
    pg.add(rand() < 0.5 ? `<circle cx="${x}" cy="${y}" r="${0.8 + rand() * 1.2}" fill="${c}" opacity="0.8"/>` : `<rect x="${x}" y="${y}" width="2.6" height="1.2" rx="0.5" fill="${c}" opacity="0.8" transform="rotate(${Math.floor(rand() * 180)} ${x} ${y})"/>`);
  }
  const cx = pg.w / 2;
  pg.add(`<text x="${cx}" y="${pg.m + 52}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="20" fill="${PALETTE[0]}">Happy</text>`);
  const bd = `${age ? ordinal(age) + ' ' : ''}Birthday`;
  pg.add(`<text x="${cx}" y="${pg.m + 74}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${fitFont(bd, 20, pg.width - 10, 0.5)}" fill="${PALETTE[3]}">${esc(bd)}</text>`);
  // Balloons with the age
  const digits = age ? String(age).split('') : ['★'];
  const r = 17, gap = r * 2.3;
  const start = cx - ((digits.length - 1) * gap) / 2;
  const by = pg.m + 112;
  pg.add(balloonShape(start - gap - 4, by + 12, r * 0.8, PALETTE[4]));
  pg.add(balloonShape(start + (digits.length - 1) * gap + gap + 4, by + 12, r * 0.8, PALETTE[2]));
  digits.forEach((d, i) => {
    const x = start + i * gap;
    pg.add(balloonShape(x, by, r, PALETTE[[0, 1, 3, 5][i % 4]]));
    pg.add(`<text x="${x}" y="${by + r * 0.52}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${r * 1.5}" fill="#fff">${esc(d)}</text>`);
  });
  const nfs = fitFont(name, 24, pg.width - 20, 0.52);
  pg.add(`<text x="${cx}" y="${by + 72}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${nfs}" fill="${INK}">${esc(name)}</text>`);
  pg.add(`<path d="M${cx - 45} ${by + 77} Q${cx} ${by + 85} ${cx + 45} ${by + 77}" fill="none" stroke="${PALETTE[1]}" stroke-width="1.4" stroke-linecap="round"/>`);
  pg.add(`<text x="${cx}" y="${by + 95}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="6" fill="${SOFT}">Today is a very special day!</text>`);
  pg.add(emoji('🎂', cx, by + 124, 34));
  pg.add(emoji('🎁', cx - 42, by + 128, 20));
  pg.add(emoji('🎉', cx + 42, by + 128, 20));
  return pg.svg();
}

function aboutMe(o, paper, name, age) {
  const pg = new Page(paper, `All about me at ${age || 'my birthday'}`, { subtitle: 'Fill it in, draw and keep it to remember this birthday.', noName: true });
  const gap = 4, colW = (pg.width - gap) / 2;
  const box = (x, y, w, h, label, icon, c, fillText) => {
    pg.add(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="${TINTS[c]}" stroke="${PALETTE[c]}" stroke-width="0.6"/>`);
    pg.add(emoji(icon, x + 7, y + 7, 7));
    pg.add(`<text x="${x + 13}" y="${y + 9}" font-family="${FONT}" font-weight="800" font-size="4.6" fill="${INK}">${esc(label)}</text>`);
    if (fillText) pg.add(`<text x="${x + w / 2}" y="${y + h / 2 + 6}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${fitFont(fillText, 11, w - 10, 0.52)}" fill="${PALETTE[c]}">${esc(fillText)}</text>`);
    else pg.add(`<line x1="${x + 6}" x2="${x + w - 6}" y1="${y + h - 7}" y2="${y + h - 7}" stroke="#9a93b8" stroke-width="0.4"/>`);
  };
  let y = pg.y;
  // Draw me + name and age
  const bigH = 88;
  pg.add(`<rect x="${pg.left}" y="${y}" width="${colW}" height="${bigH}" rx="6" fill="#fff" stroke="${PALETTE[0]}" stroke-width="0.8" stroke-dasharray="2.5 1.5"/>`);
  pg.add(`<text x="${pg.left + 5}" y="${y + 8}" font-family="${FONT}" font-weight="800" font-size="4.6" fill="${INK}">🖍️ This is me!</text>`);
  box(pg.left + colW + gap, y, colW, 26, 'My name is', '✏️', 3, name);
  box(pg.left + colW + gap, y + 30, colW, 26, 'I am this many years old', '🎂', 1, age ? String(age) : '');
  // Candles to colour
  const cy = y + 60, cx0 = pg.left + colW + gap;
  pg.add(`<rect x="${cx0}" y="${cy}" width="${colW}" height="28" rx="5" fill="#fff" stroke="${PALETTE[5]}" stroke-width="0.6"/>`);
  pg.add(`<text x="${cx0 + 5}" y="${cy + 7}" font-family="${FONT}" font-weight="800" font-size="4" fill="${INK}">Colour one candle for every year</text>`);
  const nC = Math.max(1, Math.min(12, age || 5));
  const cw = Math.min(7, (colW - 12) / nC);
  for (let i = 0; i < nC; i++) {
    const x = cx0 + (colW - nC * cw) / 2 + i * cw + cw / 2;
    pg.add(`<rect x="${x - cw * 0.22}" y="${cy + 13}" width="${cw * 0.44}" height="11" rx="1" fill="#fff" stroke="${INK}" stroke-width="0.4"/>`);
    pg.add(`<path d="M${x} ${cy + 8.5} Q${x + 1.6} ${cy + 11} ${x} ${cy + 12.6} Q${x - 1.6} ${cy + 11} ${x} ${cy + 8.5} Z" fill="#fff" stroke="${INK}" stroke-width="0.35"/>`);
  }
  y += bigH + gap;
  const items = [['My favourite colour', '🎨'], ['My favourite food', '🍕'], ['My favourite animal', '🐾'], ['My favourite toy', '🧸'],
    ['My best friends', '🤝'], ['I am really good at', '⭐'], ['When I grow up I want to be', '🚀'], ['This year I want to learn', '📚']];
  const rowH = 21;
  items.forEach(([label, icon], i) => {
    const x = pg.left + (i % 2) * (colW + gap), yy = y + Math.floor(i / 2) * (rowH + gap);
    box(x, yy, colW, rowH, label, icon, (i + 2) % PALETTE.length);
  });
  y += Math.ceil(items.length / 2) * (rowH + gap);
  const hh = pg.bottom - y - 1;
  if (hh > 30) {
    pg.add(`<rect x="${pg.left}" y="${y}" width="${colW}" height="${hh}" rx="6" fill="#fff" stroke="${PALETTE[2]}" stroke-width="0.8" stroke-dasharray="2.5 1.5"/>`);
    pg.add(`<text x="${pg.left + 5}" y="${y + 8}" font-family="${FONT}" font-weight="800" font-size="4.6" fill="${INK}">🖐️ My hand print</text>`);
    box(pg.left + colW + gap, y, colW, hh / 2 - 2, 'How tall I am', '📏', 6);
    box(pg.left + colW + gap, y + hh / 2 + 2, colW, hh / 2 - 2, 'The best thing about today', '🎉', 0);
  }
  return pg.svg();
}

function thankYouCards(o, paper, name, guests) {
  const pages = [];
  const list = guests.length ? guests : ['', '', '', ''];
  for (let i = 0; i < list.length; i += 4) {
    const pg = new Page(paper, '', { bare: true });
    const w = pg.width / 2, h = (pg.bottom - pg.m) / 2;
    for (let j = 0; j < 4; j++) {
      const g = list[i + j];
      if (g === undefined) break;
      const x = pg.left + (j % 2) * w, y = pg.m + Math.floor(j / 2) * h;
      const c = (i + j) % PALETTE.length;
      pg.add(`<rect x="${x + 3}" y="${y + 3}" width="${w - 6}" height="${h - 6}" rx="7" fill="${TINTS[c]}" stroke="${PALETTE[c]}" stroke-width="0.9"/>`);
      pg.add(`<rect x="${x + 0.5}" y="${y + 0.5}" width="${w - 1}" height="${h - 1}" rx="8" fill="none" stroke="#c9c3e3" stroke-width="0.3" stroke-dasharray="2 1.5"/>`);
      pg.add(`<text x="${x + w / 2}" y="${y + 28}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="13" fill="${PALETTE[c]}">Thank you</text>`);
      pg.add(`<text x="${x + w / 2}" y="${y + 38}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="4.6" fill="${INK}">for coming to my party!</text>`);
      pg.add(balloonShape(x + w / 2 - 26, y + 55, 6.5, PALETTE[(c + 2) % PALETTE.length]));
      pg.add(balloonShape(x + w / 2 + 26, y + 55, 6.5, PALETTE[(c + 4) % PALETTE.length]));
      pg.add(emoji('🎂', x + w / 2, y + 62, 20));
      const gy = y + h - 36;
      pg.add(`<text x="${x + 12}" y="${gy}" font-family="${FONT}" font-weight="700" font-size="4.4" fill="${SOFT}">Dear</text>`);
      if (g) pg.add(`<text x="${x + 25}" y="${gy}" font-family="${TITLE_FONT}" font-weight="800" font-size="${fitFont(nameOf(g, ''), 6, w - 40)}" fill="${INK}">${esc(nameOf(g, ''))}</text>`);
      else pg.add(`<line x1="${x + 24}" x2="${x + w - 12}" y1="${gy + 0.5}" y2="${gy + 0.5}" stroke="#9a93b8" stroke-width="0.35"/>`);
      pg.add(`<line x1="${x + 12}" x2="${x + w - 12}" y1="${gy + 10}" y2="${gy + 10}" stroke="#d9d4ec" stroke-width="0.35"/>`);
      pg.add(`<text x="${x + 12}" y="${gy + 22}" font-family="${FONT}" font-weight="700" font-size="4.4" fill="${SOFT}">Love from</text>`);
      pg.add(`<text x="${x + 34}" y="${gy + 22}" font-family="${TITLE_FONT}" font-weight="800" font-size="${fitFont(name, 6, w - 49)}" fill="${INK}">${esc(name)}</text>`);
    }
    pages.push(pg.svg());
  }
  return pages;
}

function makeParty(o, paper) {
  const rand = rng(+o.seed || 1);
  const name = nameOf(o.name, 'Emma');
  const age = Math.max(0, Math.min(12, +o.age || 0));
  const guests = listOf(o.guests, 30).map((g) => nameOf(g, ''));
  const pages = [];
  if (o.poster !== false) pages.push(partyPoster(o, paper, name, age, rand));
  if (o.aboutme !== false) pages.push(aboutMe(o, paper, name, age));
  if (o.search !== false) {
    const words = [name, ...guests].map((g) => cleanText(g).toUpperCase()).filter((g) => g.length >= 2 && g.length <= 11);
    for (const w of ['CAKE', 'PARTY', 'GIFT', 'BALLOON', 'CANDLE', 'GAMES', 'FRIENDS', 'HAPPY']) if (words.length < 12 && !words.includes(w)) words.push(w);
    pages.push(...makeWordSearch({ seed: o.seed, words: [...new Set(words)].slice(0, 14).join(','), title: `${possessive(name)} Party Word Search`, size: '12', level: 'easy', key: false }, paper));
  }
  if (o.bingo !== false) pages.push(...makeBingo({ seed: o.seed, theme: 'party', grid: '3', cards: '4', names: guests.join('\n'), free: true, labels: true }, paper));
  if (o.thanks !== false) pages.push(...thankYouCards(o, paper, name, guests));
  if (!pages.length) {
    const pg = new Page(paper, 'Birthday party pack', { subtitle: 'Tick at least one page to include.', noName: true });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ certificates
const AWARDS = {
  star: ['Star of the Week', 'for shining brightly all week long'],
  reading: ['Super Reader', 'for reading every day and loving books'],
  writing: ['Wonderful Writer', 'for beautiful writing and great ideas'],
  maths: ['Maths Whizz', 'for brilliant counting and clever thinking'],
  kindness: ['Kindness Award', 'for always being kind and helpful to others'],
  listening: ['Great Listener', 'for listening so well and trying so hard'],
  brave: ['Bravery Award', 'for being so brave'],
  helper: ['Super Helper', 'for being such a wonderful helper'],
  potty: ['Potty Champion', 'for learning to use the potty like a big kid'],
  sports: ['Sports Star', 'for amazing effort and great teamwork'],
  times: ['Times Tables Champion', 'for learning the times tables'],
  custom: ['Well Done', ''],
};
const CERT_STYLES = {
  rainbow: { a: '#ff6b6b', b: '#6c8cff', bg: '#fffaf3', deco: ['🌈', '⭐', '🎈', '✨'] },
  gold: { a: '#d9a21b', b: '#8a5a00', bg: '#fffdf4', deco: ['⭐', '🏆', '⭐', '✨'] },
  space: { a: '#7b61ff', b: '#35b5e5', bg: '#f6f5ff', deco: ['🚀', '🪐', '⭐', '🌙'] },
  nature: { a: '#2fae94', b: '#8bc34a', bg: '#f4fbf3', deco: ['🌸', '🦋', '🌼', '🐝'] },
};

function rosette(cx, cy, r, st) {
  let s = `<path d="M${cx - r * 0.35} ${cy + r * 0.5} L${cx - r * 0.95} ${cy + r * 2.1} L${cx - r * 0.55} ${cy + r * 1.85} L${cx - r * 0.3} ${cy + r * 2.25} L${cx + r * 0.05} ${cy + r * 0.6} Z" fill="${st.b}"/>`;
  s += `<path d="M${cx + r * 0.35} ${cy + r * 0.5} L${cx + r * 0.95} ${cy + r * 2.1} L${cx + r * 0.55} ${cy + r * 1.85} L${cx + r * 0.3} ${cy + r * 2.25} L${cx - r * 0.05} ${cy + r * 0.6} Z" fill="${st.a}"/>`;
  let d = '';
  for (let i = 0; i < 48; i++) {
    const a = (i * Math.PI) / 24, rr = i % 2 ? r * 0.9 : r;
    d += `${i ? 'L' : 'M'}${(cx + Math.cos(a) * rr).toFixed(2)} ${(cy + Math.sin(a) * rr).toFixed(2)} `;
  }
  s += `<path d="${d}Z" fill="${st.a}"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${r * 0.72}" fill="#fff"/><circle cx="${cx}" cy="${cy}" r="${r * 0.64}" fill="none" stroke="${st.a}" stroke-width="0.5"/>`;
  s += `<path d="${starPath(cx, cy, r * 0.46, 0.46)}" fill="#ffc93c" stroke="${st.b}" stroke-width="0.35"/>`;
  return s;
}

function makeCertificate(o, paper) {
  const [defTitle, defReason] = AWARDS[o.award] || AWARDS.star;
  const title = (o.award === 'custom' && o.title ? o.title : defTitle).slice(0, 36);
  const reason = String(o.reason || '').trim() || defReason;
  const names = listOf(o.names, 40).map((n) => nameOf(n, ''));
  if (!names.length) names.push('');
  const st = CERT_STYLES[o.style] || CERT_STYLES.rainbow;
  const date = String(o.date || '').trim() || new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
  const from = String(o.from || '').trim().slice(0, 40);
  return names.map((name, i) => {
    const pg = new Page(paper, '', { bare: true, landscape: true, tint: st.bg });
    pg.footer = () => {};
    const W = pg.w, H = pg.h, cx = W / 2, id = `g${i}`;
    pg.add(`<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${st.a}"/><stop offset="1" stop-color="${st.b}"/></linearGradient></defs>`);
    pg.add(`<rect x="8" y="8" width="${W - 16}" height="${H - 16}" rx="7" fill="none" stroke="url(#${id})" stroke-width="3.2"/>`);
    pg.add(`<rect x="13" y="13" width="${W - 26}" height="${H - 26}" rx="4" fill="none" stroke="${st.a}" stroke-width="0.4" stroke-dasharray="1.2 1.2"/>`);
    [[24, 25], [W - 24, 25], [24, H - 25], [W - 24, H - 25]].forEach(([x, y], k) => pg.add(emoji(st.deco[k], x, y, 12)));
    const sc = H / 210;
    pg.add(rosette(cx, 32 * sc, 14 * sc, st));
    pg.add(`<text x="${cx}" y="${76 * sc}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="4.6" letter-spacing="2" fill="${SOFT}">CERTIFICATE OF ACHIEVEMENT</text>`);
    pg.add(`<text x="${cx}" y="${96 * sc}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${fitFont(title, 17, W - 80, 0.5)}" fill="url(#${id})">${esc(title)}</text>`);
    pg.add(`<text x="${cx}" y="${108 * sc}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="5" fill="${SOFT}">is proudly awarded to</text>`);
    if (name) pg.add(`<text x="${cx}" y="${130 * sc}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${fitFont(name, 22, W - 90, 0.52)}" fill="${INK}">${esc(name)}</text>`);
    pg.add(`<path d="M${cx - 62} ${136 * sc} Q${cx} ${143 * sc} ${cx + 62} ${136 * sc}" fill="none" stroke="${st.a}" stroke-width="0.9" stroke-linecap="round"/>`);
    wrap(reason, 70).slice(0, 2).forEach((l, k) => pg.add(`<text x="${cx}" y="${(151 + k * 7) * sc}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="5.4" fill="${INK}">${esc(l)}</text>`));
    const ly = 178 * sc;
    pg.add(`<line x1="${W * 0.16}" x2="${W * 0.4}" y1="${ly}" y2="${ly}" stroke="${INK}" stroke-width="0.35"/>`);
    pg.add(`<line x1="${W * 0.6}" x2="${W * 0.84}" y1="${ly}" y2="${ly}" stroke="${INK}" stroke-width="0.35"/>`);
    if (from) pg.add(`<text x="${W * 0.28}" y="${ly - 2.5}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="700" font-size="6" fill="${INK}">${esc(from)}</text>`);
    pg.add(`<text x="${W * 0.72}" y="${ly - 2.5}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="700" font-size="6" fill="${INK}">${esc(date)}</text>`);
    pg.add(`<text x="${W * 0.28}" y="${ly + 5}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="3.6" fill="${SOFT}">From</text>`);
    pg.add(`<text x="${W * 0.72}" y="${ly + 5}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="3.6" fill="${SOFT}">Date</text>`);
    [[W * 0.12, 70], [W * 0.88, 70], [W * 0.1, 120], [W * 0.9, 120], [W * 0.18, 150], [W * 0.82, 150]].forEach(([x, y], k) => {
      pg.add(`<path d="${starPath(x, y * sc, 2.4 + (k % 2), 0.45)}" fill="${k % 2 ? st.a : st.b}" opacity="0.5"/>`);
    });
    return pg.svg();
  });
}

// ================================================================ dot to dot
const DOT_SHAPES = {
  star: { name: 'star', path: 'M50 4 L61 37 L96 37 L68 58 L79 92 L50 71 L21 92 L32 58 L4 37 L39 37 Z' },
  heart: { name: 'heart', path: 'M50 28 C50 8 14 2 7 28 C2 48 24 70 50 92 C76 70 98 48 93 28 C86 2 50 8 50 28 Z' },
  house: { name: 'house', path: 'M18 94 L18 50 L8 50 L50 10 L62 21 L62 10 L73 10 L73 32 L92 50 L82 50 L82 94 Z',
    decor: 'M42 94 L42 70 L58 70 L58 94 M26 58 L37 58 L37 68 L26 68 Z M63 58 L74 58 L74 68 L63 68 Z' },
  fish: { name: 'fish', path: 'M6 50 C22 22 58 20 74 44 L94 24 L90 50 L94 76 L74 56 C58 80 22 78 6 50 Z',
    decor: 'M19 45 A3 3 0 1 0 25 45 A3 3 0 1 0 19 45 M42 36 Q50 50 42 64' },
  rocket: { name: 'rocket', path: 'M50 3 C64 14 70 34 68 60 L82 74 L80 93 L65 82 L35 82 L20 93 L18 74 L32 60 C30 34 36 14 50 3 Z',
    decor: 'M42 36 A8 8 0 1 0 58 36 A8 8 0 1 0 42 36 M40 60 L60 60' },
  apple: { name: 'apple', path: 'M50 28 C36 14 7 18 9 50 C11 80 34 97 50 88 C66 97 89 80 91 50 C93 18 64 14 50 28 Z',
    decor: 'M50 28 Q49 16 54 6 M53 16 Q66 4 76 12 Q64 22 53 16' },
  cat: { name: 'cat', path: 'M14 34 L20 4 L40 22 C46 20 54 20 60 22 L80 4 L86 34 C96 56 88 88 50 92 C12 88 4 56 14 34 Z',
    decor: 'M29 50 A4 4 0 1 0 37 50 A4 4 0 1 0 29 50 M63 50 A4 4 0 1 0 71 50 A4 4 0 1 0 63 50 M46 63 L54 63 L50 68 Z M50 68 Q45 75 39 71 M50 68 Q55 75 61 71 M31 64 L12 60 M31 68 L12 71 M69 64 L88 60 M69 68 L88 71' },
  umbrella: { name: 'umbrella', path: 'M4 52 C10 12 90 12 96 52 Q85 42 73 52 Q62 42 50 52 Q38 42 27 52 Q16 42 4 52 Z',
    decor: 'M50 52 L50 86 Q50 94 42 94 Q35 94 35 87' },
  balloon: { name: 'balloon', path: 'M50 4 C78 4 90 32 82 54 C75 70 60 78 54 80 L57 87 L43 87 L46 80 C40 78 25 70 18 54 C10 32 22 4 50 4 Z',
    decor: 'M50 87 Q44 91 50 95 Q56 99 50 102' },
  tree: { name: 'tree', path: 'M50 4 L80 40 L66 40 L88 66 L70 66 L92 90 L56 90 L56 100 L44 100 L44 90 L8 90 L30 66 L12 66 L34 40 L20 40 Z' },
  duck: { name: 'duck', path: 'M20 62 C20 42 36 32 48 38 C52 22 70 18 78 30 C84 38 80 46 74 50 L92 48 L80 58 C86 62 92 66 94 74 C96 92 72 98 52 98 C32 98 20 86 20 62 Z',
    decor: 'M60 30 A2.5 2.5 0 1 0 65 30 A2.5 2.5 0 1 0 60 30 M40 72 Q54 64 68 72 Q54 84 40 72' },
  mushroom: { name: 'mushroom', path: 'M8 54 C8 18 92 18 92 54 C92 60 88 62 80 62 L64 62 L66 96 L34 96 L36 62 L20 62 C12 62 8 60 8 54 Z',
    decor: 'M26 40 A5 5 0 1 0 36 40 A5 5 0 1 0 26 40 M46 30 A6 6 0 1 0 58 30 A6 6 0 1 0 46 30 M66 42 A5 5 0 1 0 76 42 A5 5 0 1 0 66 42' },
  crown: { name: 'crown', path: 'M10 80 L6 28 L30 52 L50 16 L70 52 L94 28 L90 80 Z',
    decor: 'M9 70 L91 70 M27 75 A3 3 0 1 0 33 75 A3 3 0 1 0 27 75 M47 75 A3 3 0 1 0 53 75 A3 3 0 1 0 47 75 M67 75 A3 3 0 1 0 73 75 A3 3 0 1 0 67 75' },
  moon: { name: 'moon', path: 'M62 4 C30 8 12 32 14 54 C17 80 42 97 70 94 C50 86 36 70 36 50 C36 30 46 14 62 4 Z',
    decor: 'M24 52 A2.5 2.5 0 1 0 29 52 A2.5 2.5 0 1 0 24 52' },
  butterfly: { name: 'butterfly', path: 'M50 34 C44 12 18 4 8 16 C0 28 14 46 42 48 C18 52 8 68 16 82 C26 94 44 82 50 62 C56 82 74 94 84 82 C92 68 82 52 58 48 C86 46 100 28 92 16 C82 4 56 12 50 34 Z',
    decor: 'M50 34 L50 62 M50 34 Q46 20 40 14 M50 34 Q54 20 60 14 M24 26 A4 4 0 1 0 32 26 A4 4 0 1 0 24 26 M68 26 A4 4 0 1 0 76 26 A4 4 0 1 0 68 26' },
};

function flattenPath(d) {
  const tok = d.match(/[MLCQZ]|-?[\d.]+/g);
  const segs = [];
  let i = 0, cur = null, start = null;
  const num = () => parseFloat(tok[i++]);
  const bez = (p0, pts, steps = 40) => {
    const out = [];
    for (let k = 0; k <= steps; k++) {
      const t = k / steps, u = 1 - t;
      if (pts.length === 3) out.push([u * u * u * p0[0] + 3 * u * u * t * pts[0][0] + 3 * u * t * t * pts[1][0] + t * t * t * pts[2][0], u * u * u * p0[1] + 3 * u * u * t * pts[0][1] + 3 * u * t * t * pts[1][1] + t * t * t * pts[2][1]]);
      else out.push([u * u * p0[0] + 2 * u * t * pts[0][0] + t * t * pts[1][0], u * u * p0[1] + 2 * u * t * pts[0][1] + t * t * pts[1][1]]);
    }
    return out;
  };
  while (i < tok.length) {
    const c = tok[i++];
    if (c === 'M') { cur = [num(), num()]; start = cur; }
    else if (c === 'L') { const p = [num(), num()]; segs.push([cur, p]); cur = p; }
    else if (c === 'C') { const pts = [[num(), num()], [num(), num()], [num(), num()]]; segs.push(bez(cur, pts)); cur = pts[2]; }
    else if (c === 'Q') { const pts = [[num(), num()], [num(), num()]]; segs.push(bez(cur, pts)); cur = pts[1]; }
    else if (c === 'Z') { if (Math.hypot(cur[0] - start[0], cur[1] - start[1]) > 0.01) segs.push([cur, start]); cur = start; }
  }
  return segs;
}

function dotPoints(shape, want) {
  let segs;
  if (shape.param) {
    const pts = [];
    for (let k = 0; k <= 600; k++) pts.push(shape.param((k / 600) * Math.PI * 2));
    segs = [pts];
  } else segs = flattenPath(shape.path);
  const lens = segs.map((s) => { let L = 0; for (let k = 1; k < s.length; k++) L += Math.hypot(s[k][0] - s[k - 1][0], s[k][1] - s[k - 1][1]); return L; });
  const N = Math.max(want, segs.length, shape.min || 0);
  const total = lens.reduce((a, b) => a + b, 0);
  const extra = N - segs.length;
  const raw = lens.map((L) => (extra * L) / total);
  const alloc = raw.map(Math.floor);
  let left = extra - alloc.reduce((a, b) => a + b, 0);
  raw.map((r, k) => [r - alloc[k], k]).sort((a, b) => b[0] - a[0]).slice(0, left).forEach(([, k]) => alloc[k]++);
  const out = [];
  segs.forEach((s, si) => {
    out.push(s[0]);
    const L = lens[si], m = alloc[si];
    let acc = 0, k = 1;
    for (let j = 1; j <= m; j++) {
      const target = (L * j) / (m + 1);
      while (k < s.length) {
        const d = Math.hypot(s[k][0] - s[k - 1][0], s[k][1] - s[k - 1][1]);
        if (acc + d >= target) { const t = (target - acc) / d; out.push([s[k - 1][0] + (s[k][0] - s[k - 1][0]) * t, s[k - 1][1] + (s[k][1] - s[k - 1][1]) * t]); break; }
        acc += d; k++;
      }
    }
  });
  return { pts: out, segs };
}

function dotLabel(i, mode) {
  if (mode === 'abc') return String.fromCharCode(65 + (i % 26));
  const step = { '2': 2, '5': 5, '10': 10 }[mode] || 1;
  return String((i + 1) * step);
}

function drawDots(pg, shape, want, mode, x, y, w, h, solved) {
  const n = mode === 'abc' ? Math.min(want, 26) : want;
  const { pts, segs } = dotPoints(shape, n);
  const all = segs.flat();
  // Include the little details (like a balloon string) so nothing hangs outside the box.
  for (const part of (shape.decor || '').match(/[ML][^MLQAZ]*|Q[^MLQAZ]*/g) || []) {
    const nums = part.slice(1).trim().split(/[\s,]+/).map(Number);
    for (let k = 0; k + 1 < nums.length; k += 2) all.push([nums[k], nums[k + 1]]);
  }
  const minX = Math.min(...all.map((p) => p[0])), maxX = Math.max(...all.map((p) => p[0]));
  const minY = Math.min(...all.map((p) => p[1])), maxY = Math.max(...all.map((p) => p[1]));
  const s = Math.min((w - 16) / (maxX - minX), (h - 16) / (maxY - minY));
  const ox = x + (w - (maxX - minX) * s) / 2 - minX * s, oy = y + (h - (maxY - minY) * s) / 2 - minY * s;
  const P = pts.map(([px, py]) => [ox + px * s, oy + py * s]);
  const T = `translate(${ox.toFixed(2)} ${oy.toFixed(2)}) scale(${s.toFixed(4)})`;
  const sw = (mm) => (mm / s).toFixed(3);
  if (solved) {
    const d = 'M' + P.map((p) => p.map((v) => v.toFixed(2)).join(' ')).join(' L') + ' Z';
    pg.add(`<path d="${d}" fill="#fff4d6" stroke="${INK}" stroke-width="0.7" stroke-linejoin="round"/>`);
  }
  if (shape.decor) pg.add(`<path d="${shape.decor}" transform="${T}" fill="none" stroke="${INK}" stroke-width="${sw(0.5)}" stroke-linecap="round" stroke-linejoin="round"/>`);
  if (solved) return;
  const cx = P.reduce((a, p) => a + p[0], 0) / P.length, cy = P.reduce((a, p) => a + p[1], 0) / P.length;
  const fs = Math.max(3.4, Math.min(4.8, w / 38));
  const placed = [];
  P.forEach((p, i) => {
    const prev = P[(i - 1 + P.length) % P.length], next = P[(i + 1) % P.length];
    let nx = -(next[1] - prev[1]), ny = next[0] - prev[0];
    const len = Math.hypot(nx, ny) || 1;
    nx /= len; ny /= len;
    if ((p[0] - cx) * nx + (p[1] - cy) * ny < 0) { nx = -nx; ny = -ny; }
    const label = dotLabel(i, mode);
    const lw = label.length * fs * 0.55;
    let best = null;
    for (const turn of [0, 0.5, -0.5, 1, -1, 1.5, -1.5, Math.PI]) {
      const ax = nx * Math.cos(turn) - ny * Math.sin(turn), ay = nx * Math.sin(turn) + ny * Math.cos(turn);
      const lx = p[0] + ax * (fs * 0.9 + lw * 0.3), ly = p[1] + ay * fs * 0.9;
      const clash = placed.some(([qx, qy, qw]) => Math.abs(qx - lx) < (qw + lw) / 2 + 0.4 && Math.abs(qy - ly) < fs * 0.95)
        || P.some((q) => Math.abs(q[0] - lx) < lw / 2 + 0.9 && Math.abs(q[1] - ly) < fs * 0.55 + 0.9);
      if (!clash) { best = [lx, ly]; break; }
      if (!best) best = [lx, ly];
    }
    placed.push([best[0], best[1], lw]);
    pg.add(`<text x="${best[0].toFixed(2)}" y="${(best[1] + fs * 0.35).toFixed(2)}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${fs.toFixed(2)}" fill="${i === 0 ? '#2e9d63' : '#5b5580'}">${label}</text>`);
  });
  P.forEach((p, i) => pg.add(`<circle cx="${p[0].toFixed(2)}" cy="${p[1].toFixed(2)}" r="${i === 0 ? 1.9 : 1.2}" fill="${i === 0 ? '#3fbf7f' : INK}"/>`));
  const first = P[0];
  pg.add(`<text x="${first[0].toFixed(2)}" y="${(first[1] - 3.2).toFixed(2)}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${(fs * 0.85).toFixed(2)}" fill="#2e9d63">start</text>`);
}

function makeDots(o, paper) {
  const rand = rng(+o.seed || 1);
  const want = Math.max(10, Math.min(60, +o.dots || 20));
  const mode = o.count || '1';
  const howMany = Math.max(1, Math.min(6, +o.puzzles || 1));
  let keys = o.shape && DOT_SHAPES[o.shape] ? [o.shape] : [];
  const pool = shuffle(Object.keys(DOT_SHAPES), rand);
  while (keys.length < howMany) keys.push(pool[keys.length % pool.length]);
  keys = keys.slice(0, howMany);
  const per = o.layout === 'two' ? 2 : 1;
  const sub = { '1': 'Join the dots in order from 1, then colour it in!', '2': 'Count in twos to join the dots: 2, 4, 6...', '5': 'Count in fives to join the dots: 5, 10, 15...', '10': 'Count in tens to join the dots: 10, 20, 30...', abc: 'Join the letters from A to Z, then colour it in!' }[mode];
  const pages = [];
  for (let i = 0; i < keys.length; i += per) {
    const pg = new Page(paper, 'Dot to dot: what will it be?', { subtitle: sub });
    const each = (pg.room - 2) / per;
    for (let j = 0; j < per && keys[i + j]; j++) {
      const y = pg.y + j * each;
      drawDots(pg, DOT_SHAPES[keys[i + j]], want, mode, pg.left, y, pg.width, each - 14, false);
      pg.add(`<text x="${pg.left + 4}" y="${y + each - 6}" font-family="${FONT}" font-weight="800" font-size="4.6" fill="${SOFT}">It is a</text>`);
      pg.add(`<line x1="${pg.left + 21}" x2="${pg.left + 80}" y1="${y + each - 5.5}" y2="${y + each - 5.5}" stroke="#9a93b8" stroke-width="0.4"/>`);
      if (j < per - 1 && keys[i + j + 1]) pg.add(`<line x1="${pg.left}" x2="${pg.right}" y1="${y + each - 1}" y2="${y + each - 1}" stroke="#ece9f6" stroke-width="0.4"/>`);
    }
    pages.push(pg.svg());
  }
  if (o.key !== false) {
    const pg = new Page(paper, 'Dot to dot: answers', { subtitle: 'What each picture turns into.', noName: true });
    const cols = keys.length > 1 ? 2 : 1, rows = Math.ceil(keys.length / cols);
    const cw = pg.width / cols, chh = Math.min(90, (pg.room - 4) / rows);
    keys.forEach((k, i) => {
      const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * chh;
      drawDots(pg, DOT_SHAPES[k], want, mode, x, y, cw, chh - 10, true);
      pg.add(`<text x="${x + cw / 2}" y="${y + chh - 4}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="5" fill="${INK}">a ${DOT_SHAPES[k].name}</text>`);
    });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ picture sudoku
function sudokuCount(g, n, bw, bh, limit) {
  const i = g.indexOf(0);
  if (i < 0) return 1;
  const r = Math.floor(i / n), c = i % n;
  let count = 0;
  for (let v = 1; v <= n && count < limit; v++) {
    if (!sudokuOk(g, n, bw, bh, r, c, v)) continue;
    g[i] = v;
    count += sudokuCount(g, n, bw, bh, limit - count);
    g[i] = 0;
  }
  return count;
}

function sudokuOk(g, n, bw, bh, r, c, v) {
  for (let k = 0; k < n; k++) if (g[r * n + k] === v || g[k * n + c] === v) return false;
  const br = r - (r % bh), bc = c - (c % bw);
  for (let y = br; y < br + bh; y++) for (let x = bc; x < bc + bw; x++) if (g[y * n + x] === v) return false;
  return true;
}

function sudokuFill(g, n, bw, bh, rand) {
  const i = g.indexOf(0);
  if (i < 0) return true;
  const r = Math.floor(i / n), c = i % n;
  for (const v of shuffle([...Array(n)].map((_, k) => k + 1), rand)) {
    if (!sudokuOk(g, n, bw, bh, r, c, v)) continue;
    g[i] = v;
    if (sudokuFill(g, n, bw, bh, rand)) return true;
    g[i] = 0;
  }
  return false;
}

function sudokuPuzzle(n, bw, bh, givens, rand) {
  const full = Array(n * n).fill(0);
  sudokuFill(full, n, bw, bh, rand);
  const puzzle = [...full];
  let filled = n * n;
  for (const i of shuffle([...Array(n * n).keys()], rand)) {
    if (filled <= givens) break;
    const keep = puzzle[i];
    puzzle[i] = 0;
    if (sudokuCount([...puzzle], n, bw, bh, 2) !== 1) puzzle[i] = keep;
    else filled--;
  }
  return { full, puzzle };
}

function drawSudoku(pg, x, y, size, n, bw, bh, grid, symbols, small) {
  const cell = size / n;
  pg.add(`<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="2.5" fill="#fff"/>`);
  for (let k = 1; k < n; k++) {
    const thickV = k % bw === 0, thickH = k % bh === 0;
    pg.add(`<line x1="${x + k * cell}" x2="${x + k * cell}" y1="${y}" y2="${y + size}" stroke="${thickV ? INK : '#b9b3d6'}" stroke-width="${thickV ? 0.9 : 0.35}"/>`);
    pg.add(`<line x1="${x}" x2="${x + size}" y1="${y + k * cell}" y2="${y + k * cell}" stroke="${thickH ? INK : '#b9b3d6'}" stroke-width="${thickH ? 0.9 : 0.35}"/>`);
  }
  pg.add(`<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="2.5" fill="none" stroke="${INK}" stroke-width="1.1"/>`);
  grid.forEach((v, i) => {
    if (!v) return;
    const cx = x + (i % n + 0.5) * cell, cy = y + (Math.floor(i / n) + 0.5) * cell;
    const sym = symbols[v - 1];
    if (sym.src) pg.add(pic(sym.src, cx, cy, cell * 0.74));
    else pg.add(`<text x="${cx}" y="${cy + cell * 0.2}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${cell * 0.56}" fill="${small ? '#e0457b' : INK}">${v}</text>`);
  });
}

function makeSudoku(o, paper) {
  const rand = rng(+o.seed || 1);
  const n = o.size === '6' ? 6 : 4;
  const bw = n === 6 ? 3 : 2, bh = 2;
  const level = o.level || 'easy';
  const givens = n === 4 ? { easy: 10, medium: 8, hard: 6 }[level] : { easy: 24, medium: 20, hard: 16 }[level];
  const perPage = n === 4 ? 4 : 2;
  const count = perPage * Math.max(1, Math.min(4, +o.pages || 1));
  const pictures = o.symbols !== 'numbers';
  const pages = [];
  const puzzles = [];
  for (let p = 0; p < count; p++) {
    const symbols = pictures ? shuffle(PAINTED, rand).slice(0, n).map(([name, src]) => ({ name, src })) : [...Array(n)].map((_, k) => ({ name: String(k + 1) }));
    puzzles.push({ ...sudokuPuzzle(n, bw, bh, givens, rand), symbols });
  }
  const rule = n === 4 ? 'Each row, column and box of 4 has every picture once.' : 'Each row, column and box of 6 has every one once.';
  for (let p = 0; p < puzzles.length; p += perPage) {
    const pg = new Page(paper, n === 4 ? 'Picture sudoku' : 'Sudoku 6 by 6', { subtitle: pictures ? `${rule} Draw it, or write its number.` : rule.replace('picture', 'number') });
    const cols = n === 4 ? 2 : 1;
    const slotW = pg.width / cols, slotH = (pg.room - 2) / (perPage / cols);
    puzzles.slice(p, p + perPage).forEach((pz, k) => {
      const sx = pg.left + (k % cols) * slotW, sy = pg.y + Math.floor(k / cols) * slotH;
      const keyH = pictures ? 20 : 0;
      const size = Math.min(slotW - 12, slotH - keyH - 8);
      const gx = sx + (slotW - size) / 2;
      if (pictures) {
        const kw = Math.min(26, (slotW - 8) / n);
        const kx = sx + (slotW - kw * n) / 2;
        pz.symbols.forEach((sym, j) => {
          pg.add(`<rect x="${kx + j * kw + 1}" y="${sy}" width="${kw - 2}" height="16" rx="3" fill="${TINTS[j % TINTS.length]}"/>`);
          pg.add(pic(sym.src, kx + j * kw + kw / 2 - 3, sy + 8, 11));
          pg.add(`<text x="${kx + j * kw + kw - 5}" y="${sy + 10}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="5.5" fill="${PALETTE[j % PALETTE.length]}">${j + 1}</text>`);
        });
      }
      drawSudoku(pg, gx, sy + keyH, size, n, bw, bh, pz.puzzle, pz.symbols, false);
    });
    pages.push(pg.svg());
  }
  if (o.key !== false) {
    const pg = new Page(paper, 'Sudoku answers', { subtitle: 'Answer key for grown-ups.', noName: true });
    const cols = puzzles.length > 6 ? 3 : 2;
    const rowsK = Math.ceil(puzzles.length / cols);
    const size = Math.min(pg.width / cols - 16, (pg.room - 6) / rowsK - 12, 70);
    puzzles.forEach((pz, k) => {
      const x = pg.left + (k % cols) * (pg.width / cols) + (pg.width / cols - size) / 2, y = pg.y + 6 + Math.floor(k / cols) * (size + 12);
      pg.add(`<text x="${x}" y="${y - 2}" font-family="${FONT}" font-weight="800" font-size="3.6" fill="${SOFT}">Puzzle ${k + 1}</text>`);
      drawSudoku(pg, x, y, size, n, bw, bh, pz.full, pz.symbols, true);
    });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ b d p q letter mix-ups
const MIXUP_WORDS = {
  b: [['balloon', 'img/balloon.webp'], ['ball', '⚽'], ['bee', '🐝'], ['bus', '🚌'], ['book', '📚'], ['banana', '🍌'], ['bear', '🐻'], ['bed', '🛏️'], ['bike', '🚲'], ['boat', '⛵']],
  d: [['dog', 'img/dog.webp'], ['duck', '🦆'], ['drum', '🥁'], ['door', '🚪'], ['dice', '🎲'], ['dinosaur', '🦕'], ['deer', '🦌'], ['dolphin', '🐬']],
  p: [['pig', 'img/pig.webp'], ['pen', '🖊️'], ['pizza', '🍕'], ['pear', '🍐'], ['panda', '🐼'], ['penguin', '🐧'], ['pumpkin', '🎃'], ['parrot', '🦜']],
  q: [['queen', '👸'], ['question', '❓']],
};
const PAPER_TINTS = { white: '#fff', cream: '#fdf6e3', blue: '#eaf3fb', green: '#eef7ea' };

function mixupLearn(pg, pair, top) {
  const [l1, l2] = pair;
  const bd = pair === 'bd';
  let y = top;
  // The tip panel
  const ph = 62;
  pg.add(`<rect x="${pg.left}" y="${y}" width="${pg.width}" height="${ph}" rx="7" fill="#fff" stroke="#d9d4ec" stroke-width="0.6"/>`);
  if (bd) {
    // "bed" with a real little bed drawn on it
    const size = 30, x0 = pg.left + 12, ty = y + 14;
    const w = (textWidth('bed') / 100) * size;
    const bStem = x0, dStem = x0 + ((textWidth('bed') - 42 + 40.5) / 100) * size;
    pg.add(`<rect x="${bStem}" y="${ty + size * 0.5}" width="${dStem - bStem}" height="${size * 0.14}" rx="1.4" fill="#ffd6e4"/>`);
    pg.add(`<ellipse cx="${bStem + 7}" cy="${ty + size * 0.43}" rx="5" ry="2.6" fill="#cfe3ff"/>`);
    pg.add(drawText('bed', x0, ty, size, 'model'));
    pg.add(`<text x="${x0 + w + 12}" y="${y + 16}" font-family="${TITLE_FONT}" font-weight="800" font-size="7" fill="${INK}">The bed trick</text>`);
    textLines(pg, ['Write the word bed. It looks like a bed!', 'b is the headboard at the start,', 'd is the footboard at the end.', 'Thumbs up 👍👍 and make a bed with your hands.'], x0 + w + 12, y + 25, 4.6, { weight: 700, lh: 1.5 });
  } else {
    pg.add(pic('img/pig.webp', pg.left + 22, y + 30, 34));
    pg.add(`<text x="${pg.left + 46}" y="${y + 16}" font-family="${TITLE_FONT}" font-weight="800" font-size="7" fill="${INK}">p and q tips</text>`);
    textLines(pg, ['p is for pig. Its tail goes down on the left side.', 'q almost always has u after it: qu, like queen.', 'Say the sound as you write: p p p, qu qu qu.', 'Trace them slowly with your finger first.'], pg.left + 46, y + 25, 4.6, { weight: 700, lh: 1.5 });
  }
  y += ph + 8;
  // Big letters with a picture
  [l1, l2].forEach((L, i) => {
    const [word, src] = MIXUP_WORDS[L][0];
    const x = pg.left + i * (pg.width / 2);
    const c = [0, 3, 2, 4][i + (bd ? 0 : 2)];
    pg.add(`<rect x="${x + (i ? 2 : 0)}" y="${y}" width="${pg.width / 2 - 2}" height="44" rx="7" fill="${TINTS[c]}"/>`);
    pg.add(drawText(L, x + 12, y + 6, 22, 'model', true));
    pg.add(pic(src, x + 46, y + 22, 28));
    pg.add(`<text x="${x + 63}" y="${y + 20}" font-family="${TITLE_FONT}" font-weight="800" font-size="6" fill="${PALETTE[c]}">${L} is for</text>`);
    pg.add(`<text x="${x + 63}" y="${y + 29}" font-family="${TITLE_FONT}" font-weight="800" font-size="6" fill="${INK}">${word}</text>`);
  });
  y += 52;
  // Trace rows
  const size = 14;
  const rows = bd ? ['b', 'd', 'bdbd', 'bed', 'dad', 'bib', 'bd'] : ['p', 'q', 'pqpq', 'pig', 'queen', 'pup', 'pq'];
  for (const L of rows) {
    if (y + rowHeight(size) > pg.bottom) break;
    pg.guides(y, size);
    fillRow(pg, L, y, size, 'trace', L.length === 1);
    y += rowHeight(size);
  }
  return y;
}

function mixupFind(o, paper, letters, rand, tint) {
  const pg = new Page(paper, `Find and colour: ${letters.join(' ')}`, { subtitle: 'Colour each letter with its own colour. Go slowly and check each one!', tint });
  const cols = ['#ff6b6b', '#6c8cff', '#3fbfa8', '#ffb938'];
  const cname = ['red', 'blue', 'green', 'yellow'];
  let x = pg.left;
  letters.forEach((L, i) => {
    pg.add(`<circle cx="${x + 5}" cy="${pg.y + 3}" r="5" fill="${cols[i]}"/>`);
    pg.add(drawText(L, x + 2.6, pg.y - 0.5, 5.5, 'model'));
    pg.add(`<text x="${x + 13}" y="${pg.y + 5}" font-family="${FONT}" font-weight="800" font-size="4.6" fill="${INK}">${cname[i]}</text>`);
    x += 38;
  });
  pg.y += 16;
  const C = 7, R = 8;
  const cell = Math.min(pg.width / C, (pg.room - 30) / R);
  const gx = pg.left + (pg.width - cell * C) / 2;
  const counts = {};
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
    const L = letters[Math.floor(rand() * letters.length)];
    counts[L] = (counts[L] || 0) + 1;
    const cx = gx + c * cell + cell / 2, cy = pg.y + r * cell + cell / 2;
    pg.add(`<circle cx="${cx}" cy="${cy}" r="${cell * 0.42}" fill="#fff" stroke="#b9b3d6" stroke-width="0.45"/>`);
    const size = cell * 0.36;
    const top = ['p', 'q'].includes(L) ? cy - size * 0.78 : cy - size * 0.55;
    pg.add(drawText(L, cx - (GLYPHS[L].w / 100) * size / 2, top, size, 'model'));
  }
  pg.y += R * cell + 8;
  letters.forEach((L, i) => {
    const bx = pg.left + i * (pg.width / letters.length);
    pg.add(`<text x="${bx}" y="${pg.y + 6}" font-family="${FONT}" font-weight="800" font-size="4.8" fill="${INK}">How many</text>`);
    pg.add(drawText(L, bx + 26.5, pg.y + 1.5, 5, 'model'));
    pg.add(`<text x="${bx + 30.5}" y="${pg.y + 6}" font-family="${FONT}" font-weight="800" font-size="4.8" fill="${INK}">?</text>`);
    pg.add(`<rect x="${bx + 35}" y="${pg.y}" width="10" height="9" rx="2" fill="#fff" stroke="${INK}" stroke-width="0.5"/>`);
  });
  pg.add(`<text x="${pg.right}" y="${pg.bottom - 1}" text-anchor="end" font-family="${FONT}" font-weight="700" font-size="3" fill="#c9c3e3">${letters.map((L) => `${L}: ${counts[L] || 0}`).join('   ')}</text>`);
  return pg.svg();
}

function mixupMissing(o, paper, letters, rand, tint) {
  const pg = new Page(paper, 'Which letter is missing?', { subtitle: `Say the word. Is it ${letters.join(' or ')}? Write the missing letter in the box.`, tint });
  let words = [];
  letters.forEach((L) => words.push(...MIXUP_WORDS[L].map(([w, s]) => ({ w, s, L }))));
  words = shuffle(words, rand).slice(0, 12);
  const cols = 3, rows = Math.ceil(words.length / cols);
  const cw = pg.width / cols, ch = Math.min(58, (pg.room - 2) / rows);
  words.forEach((it, i) => {
    const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch;
    pg.add(`<rect x="${x + 1.5}" y="${y + 1.5}" width="${cw - 3}" height="${ch - 3}" rx="6" fill="#fff" stroke="#d9d4ec" stroke-width="0.5"/>`);
    pg.add(pic(it.s, x + cw / 2, y + ch * 0.34, ch * 0.4));
    const size = Math.min(8, (cw - 22) / ((textWidth(it.w.slice(1)) / 100) + 1.6));
    const rest = (textWidth(it.w.slice(1)) / 100) * size;
    const bw = size * 1.15;
    const total = bw + 2 + rest;
    const sx = x + (cw - total) / 2, ty = y + ch * 0.66;
    pg.add(`<rect x="${sx}" y="${ty - size * 0.1}" width="${bw}" height="${size * 1.25}" rx="1.6" fill="#fff" stroke="${PALETTE[i % PALETTE.length]}" stroke-width="0.7"/>`);
    pg.add(drawText(it.w.slice(1), sx + bw + 2, ty, size, 'model'));
  });
  pg.add(`<text x="${pg.right}" y="${pg.bottom - 1}" text-anchor="end" font-family="${FONT}" font-weight="700" font-size="3" fill="#c9c3e3">Answers: ${words.map((w, i) => `${i + 1} ${w.L}`).join(', ')}</text>`);
  return pg.svg();
}

function makeMixups(o, paper) {
  const rand = rng(+o.seed || 1);
  const tint = PAPER_TINTS[o.tint] || '#fff';
  const pairs = o.letters === 'pq' ? ['pq'] : o.letters === 'all' ? ['bd', 'pq'] : ['bd'];
  const letters = pairs.join('').split('');
  const pages = [];
  for (const pair of pairs) {
    const pg = new Page(paper, `Learning ${pair[0]} and ${pair[1]}`, { subtitle: 'Read the tip, then trace every letter from the green dot.', tint });
    mixupLearn(pg, pair, pg.y);
    pages.push(pg.svg());
  }
  pages.push(mixupFind(o, paper, letters, rand, tint));
  pages.push(mixupMissing(o, paper, letters, rand, tint));
  return pages;
}

Object.assign(MAKERS, { photo: makePhoto, story: makeStory, bingo: makeBingo, party: makeParty, certificate: makeCertificate, dots: makeDots, sudoku: makeSudoku, mixups: makeMixups });

;
// PrintPals batch 3: sight words, CVC phonics, number bonds, flashcards,
// chore charts, feelings charts, scavenger hunts and matching.

const ART = (name) => `img/${name}.webp`;
const P = (ch) => artFor(ch) || ch; // painted picture when we have one

// ================================================================ sight words
const SIGHT_LISTS = {
  'dolch-pre': 'a, and, away, big, blue, can, come, down, find, for, funny, go, help, here, I, in, is, it, jump, little, look, make, me, my, not, one, play, red, run, said, see, the, three, to, two, up, we, where, yellow, you',
  'dolch-primer': 'all, am, are, at, ate, be, black, brown, but, came, did, do, eat, four, get, good, have, he, into, like, must, new, no, now, on, our, out, please, pretty, ran, ride, saw, say, she, so, soon, that, there, they, this, too, under, want, was, well, went, what, white, who, will, with, yes',
  'dolch-first': 'after, again, an, any, as, ask, by, could, every, fly, from, give, going, had, has, her, him, his, how, just, know, let, live, may, of, old, once, open, over, put, round, some, stop, take, thank, them, then, think, walk, were, when',
  'fry-1': 'the, of, and, a, to, in, is, you, that, it, he, was, for, on, are, as, with, his, they, I, at, be, this, have, from, or, one, had, by, words, but, not, what, all, were, we, when, your, can, said, there, use, an, each, which, she, do, how, their, if',
  'fry-2': 'will, up, other, about, out, many, then, them, these, so, some, her, would, make, like, him, into, time, has, look, two, more, write, go, see, number, no, way, could, people, my, than, first, water, been, call, who, oil, its, now, find, long, down, day, did, get, come, made, may, part',
  'uk-y1': 'the, a, do, to, today, of, said, says, are, were, was, is, his, has, I, you, your, they, be, he, me, she, we, no, go, so, by, my, here, there, where, love, come, some, one, once, ask, friend, school, put, push, pull, full, house, our',
};

(function fillSightWords() {
  const form = typeof document !== 'undefined' && document.querySelector('#maker[data-tool=sight]');
  if (!form) return;
  const list = form.querySelector('[name=list]'), words = form.querySelector('[name=words]');
  const fill = () => { if (SIGHT_LISTS[list.value]) words.value = SIGHT_LISTS[list.value]; };
  list.addEventListener('change', fill);
  if (!words.value.trim()) fill();
})();

function makeSight(o, paper) {
  const rand = rng(+o.seed || 1);
  let words = [...new Set(listOf(o.words, 120).map((w) => cleanText(w).trim()).filter(Boolean))];
  if (!words.length) words = SIGHT_LISTS['dolch-pre'].split(', ');
  const how = o.count === 'all' ? words.length : +o.count || 8;
  if (o.order === 'mix') words = shuffle(words, rand);
  const pick = words.slice(0, how);
  const big = o.size !== 'medium';
  const per = big ? 4 : 5;
  const size = big ? 11 : 9.5;
  const pages = [];
  for (let i = 0; i < pick.length; i += per) {
    const pg = new Page(paper, 'Sight words', { subtitle: 'Read it, trace it, write it, then find it!' });
    const blockH = (pg.room - 2) / per;
    pick.slice(i, i + per).forEach((w, j) => {
      const c = (i + j) % PALETTE.length;
      const y = pg.y + j * blockH;
      const tileW = 38;
      pg.add(`<rect x="${pg.left}" y="${y}" width="${tileW}" height="${blockH - 5}" rx="6" fill="${TINTS[c]}" stroke="${PALETTE[c]}" stroke-width="0.7"/>`);
      pg.add(`<text x="${pg.left + tileW / 2}" y="${y + (blockH - 5) / 2 + 3}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${fitFont(w, 13, tileW - 6, 0.5).toFixed(2)}" fill="${INK}">${esc(w)}</text>`);
      pg.add(`<text x="${pg.left + tileW / 2}" y="${y + blockH - 9}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.2" fill="${PALETTE[c]}">READ IT</text>`);
      const x0 = pg.left + tileW + 5;
      const rh = rowHeight(size) * 0.86;
      // Trace it
      pg.guides(y + 1, size, x0, pg.right, false);
      const unit = (textWidth(w) / 100) * size;
      let x = x0 + 3, n = 0;
      while (x + unit < pg.right - 2 && n < 4) { pg.add(drawText(w, x, y + 1, size, 'trace', n === 0 && o.dots !== false)); x += unit + size * 1.2; n++; }
      // Write it
      pg.guides(y + 1 + rh, size, x0, pg.right, false);
      pg.add(`<text x="${pg.right}" y="${y + rh - 0.5}" text-anchor="end" font-family="${FONT}" font-weight="800" font-size="2.8" fill="${SOFT}">TRACE IT</text>`);
      pg.add(`<text x="${pg.right}" y="${y + rh * 2 - 0.5}" text-anchor="end" font-family="${FONT}" font-weight="800" font-size="2.8" fill="${SOFT}">WRITE IT</text>`);
      // Find it
      const others = shuffle(words.filter((v) => v !== w), rand).slice(0, 4);
      const chips = shuffle([w, w, ...others], rand);
      const fy = y + rh * 2 + 3;
      pg.add(`<text x="${x0}" y="${fy + 4.4}" font-family="${FONT}" font-weight="800" font-size="3.6" fill="${SOFT}">Find it:</text>`);
      const cw = (pg.right - x0 - 16) / chips.length;
      chips.forEach((v, k) => {
        pg.add(`<text x="${x0 + 16 + k * cw + cw / 2}" y="${fy + 4.6}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${fitFont(v, 5, cw - 2)}" fill="${INK}">${esc(v)}</text>`);
      });
    });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ CVC words
const CVC = {
  a: [['cat', ART('cat')], ['hat', ART('hat')], ['bat', '🦇'], ['rat', '🐀'], ['van', '🚐'], ['map', '🗺️'], ['cap', '🧢'], ['jam', '🍯']],
  e: [['bed', '🛏️'], ['hen', '🐔'], ['pen', '🖊️'], ['net', '🥅'], ['web', '🕸️'], ['leg', '🦵'], ['ten', '🔟'], ['jet', '✈️']],
  i: [['pig', ART('pig')], ['pin', '📌'], ['lip', '👄'], ['bin', '🗑️'], ['six', '6️⃣'], ['wig', '💇'], ['fig', '🟣'], ['dig', '⛏️']],
  o: [['dog', ART('dog')], ['fox', '🦊'], ['box', '📦'], ['log', '🪵'], ['pot', '🍲'], ['mop', '🧹'], ['cot', '🛌'], ['hop', '🐇']],
  u: [['sun', ART('sun')], ['bus', '🚌'], ['bug', '🐛'], ['cup', '☕'], ['mug', '🍵'], ['nut', '🥜'], ['hut', '🛖'], ['tub', '🛁']],
};
// Pictures that are clear enough for little ones.
const CVC_CLEAR = new Set(['cat', 'hat', 'bat', 'rat', 'van', 'map', 'cap', 'bed', 'hen', 'pen', 'net', 'web', 'leg', 'ten', 'jet', 'pig', 'pin', 'lip', 'bin', 'six',
  'dog', 'fox', 'box', 'log', 'pot', 'mop', 'sun', 'bus', 'bug', 'cup', 'nut', 'hut', 'tub']);

function makeCVC(o, paper) {
  const rand = rng(+o.seed || 1);
  const vowels = o.vowel && CVC[o.vowel] ? [o.vowel] : Object.keys(CVC);
  let items = [];
  vowels.forEach((v) => items.push(...CVC[v].filter(([w]) => CVC_CLEAR.has(w))));
  items = shuffle(items, rand).slice(0, 8);
  const act = o.activity || 'sound';
  const sub = { sound: 'Touch each dot and say the sound, then blend them: c, a, t, cat! Write the word on the line.', middle: 'Which vowel is missing? Say the word slowly and write it in.', first: 'What sound does it start with? Write the first letter.', build: 'Cut out the letters at the bottom and stick them in the boxes.' }[act];
  const pg = new Page(paper, act === 'build' ? 'Build the words' : act === 'sound' ? 'Sound it out' : 'Finish the words', { subtitle: sub });
  const cols = 2, rows = 4;
  const tilesH = act === 'build' ? 36 : 0;
  const cw = pg.width / cols, ch = (pg.room - tilesH - 2) / rows;
  items.forEach(([w, src], i) => {
    const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch;
    const c = i % PALETTE.length;
    pg.add(`<rect x="${x + 1.5}" y="${y + 1.5}" width="${cw - 3}" height="${ch - 3}" rx="6" fill="#fff" stroke="${PALETTE[c]}" stroke-width="0.7"/>`);
    pg.add(pic(src, x + 19, y + ch / 2, Math.min(28, ch - 14)));
    const box = Math.min(17, (cw - 42) / 3.25);
    const bx = x + 36, by = y + ch / 2 - box / 2 - 3;
    w.split('').forEach((L, k) => {
      const lx = bx + k * (box + 3);
      const hidden = (act === 'middle' && k === 1) || (act === 'first' && k === 0) || act === 'build';
      pg.add(`<rect x="${lx}" y="${by}" width="${box}" height="${box}" rx="3" fill="${hidden ? TINTS[c] : '#fff'}" stroke="${INK}" stroke-width="0.5"/>`);
      if (!hidden) {
        // Letters sit on a baseline inside the box; tails (g, p, y) sit a little higher so they fit.
        const size = box * 0.7;
        const base = by + box * (/[gjpqy]/.test(L) ? 0.6 : 0.8);
        pg.add(drawText(L, lx + box / 2 - (GLYPHS[L].w / 200) * size, base - size, size, 'model'));
      }
      pg.add(`<circle cx="${lx + box / 2}" cy="${by + box + 4}" r="1.6" fill="${PALETTE[c]}"/>`);
    });
    if (act === 'middle') pg.add(`<text x="${bx}" y="${y + ch - 5}" font-family="${FONT}" font-weight="800" font-size="3.8" fill="${SOFT}">a  e  i  o  u</text>`);
    else if (act === 'sound') pg.add(`<line x1="${bx}" x2="${bx + 3 * box + 6}" y1="${y + ch - 6}" y2="${y + ch - 6}" stroke="#9a93b8" stroke-width="0.4"/>`);
  });
  if (act === 'build') {
    const letters = shuffle(items.flatMap(([w]) => w.split('')), rand);
    const ty = pg.bottom - tilesH + 4;
    scissors(pg, ty - 2);
    const tw = pg.width / 12;
    letters.forEach((L, k) => {
      const tx = pg.left + (k % 12) * tw, yy = ty + 3 + Math.floor(k / 12) * (tw + 1);
      pg.add(`<rect x="${tx + 0.8}" y="${yy}" width="${tw - 1.6}" height="${tw - 1.6}" rx="2" fill="${TINTS[k % TINTS.length]}" stroke="#b9b3d6" stroke-width="0.35" stroke-dasharray="1.4 1"/>`);
      const size = tw * 0.42;
      pg.add(drawText(L, tx + tw / 2 - (GLYPHS[L].w / 200) * size, yy + tw * 0.2 - (/[gjpqy]/.test(L) ? size * 0.2 : 0), size, 'model'));
    });
  }
  const pages = [pg.svg()];
  if (o.key !== false && act !== 'sound') {
    const k = new Page(paper, 'Answers', { subtitle: 'For grown-ups.', noName: true });
    items.forEach(([w, src], i) => {
      const y = k.y + i * 12;
      k.add(pic(src, k.left + 6, y + 4, 9));
      k.add(`<text x="${k.left + 16}" y="${y + 6}" font-family="${TITLE_FONT}" font-weight="800" font-size="6" fill="${INK}">${w}</text>`);
    });
    pages.push(k.svg());
  }
  return pages;
}

// ================================================================ number bonds
function bondPictures(pg, cx, cy, r, n, src) {
  if (!n) return;
  const cols = Math.ceil(Math.sqrt(n)), rows = Math.ceil(n / cols);
  const s = Math.min((r * 1.35) / cols, (r * 1.35) / rows);
  for (let i = 0; i < n; i++) {
    const x = cx - ((Math.min(cols, n) - 1) * s) / 2 + (i % cols) * s, y = cy - ((rows - 1) * s) / 2 + Math.floor(i / cols) * s;
    pg.add(pic(src, x, y, s * 0.95));
  }
}

function makeBonds(o, paper) {
  const rand = rng(+o.seed || 1);
  const to = { '5': [5], '10': [10], '20': [20], 'upto10': [3, 4, 5, 6, 7, 8, 9, 10] }[o.to] || [10];
  const pics = o.pictures !== false && Math.max(...to) <= 10;
  const items = [];
  for (let i = 0; i < 12; i++) {
    const whole = to[Math.floor(rand() * to.length)];
    const a = Math.floor(rand() * (whole + 1));
    const miss = o.missing === 'whole' ? 0 : o.missing === 'part' ? 1 + Math.floor(rand() * 2) : Math.floor(rand() * 3);
    items.push({ whole, a, b: whole - a, miss });
  }
  const arts = ['apple', 'strawberry', 'star', 'ladybird', 'cupcake', 'orange', 'chick', 'heart', 'cookie', 'fish', 'egg', 'balloon'].map(ART);
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const label = to.length > 1 ? 'up to 10' : `to ${to[0]}`;
    const pg = new Page(paper, answers ? 'Number bonds: answers' : `Number bonds ${label}`, { subtitle: answers ? 'Answer key for grown-ups.' : 'The two small circles make the big one. Fill in the missing number!', noName: answers });
    const cols = 3, rows = 4;
    const cw = pg.width / cols, ch = (pg.room - 2) / rows;
    items.forEach((it, i) => {
      const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch;
      const c = i % PALETTE.length;
      const R = Math.min(11, ch * 0.2), r = R * 0.92;
      const top = [x + cw / 2, y + R + 3], left = [x + cw / 2 - R * 1.35, y + ch - r - 7], right = [x + cw / 2 + R * 1.35, y + ch - r - 7];
      pg.add(`<line x1="${top[0]}" y1="${top[1]}" x2="${left[0]}" y2="${left[1]}" stroke="${INK}" stroke-width="0.6"/><line x1="${top[0]}" y1="${top[1]}" x2="${right[0]}" y2="${right[1]}" stroke="${INK}" stroke-width="0.6"/>`);
      [[top, R, it.whole, 0], [left, r, it.a, 1], [right, r, it.b, 2]].forEach(([[cx, cy], rr, v, k]) => {
        const blank = it.miss === k;
        pg.add(`<circle cx="${cx}" cy="${cy}" r="${rr}" fill="${k === 0 ? TINTS[c] : '#fff'}" stroke="${PALETTE[c]}" stroke-width="${k === 0 ? 1 : 0.7}"/>`);
        if (blank && !answers) return;
        if (pics && k > 0 && !answers && v > 0 && v <= 10) bondPictures(pg, cx, cy, rr, v, arts[i % arts.length]);
        else pg.add(`<text x="${cx}" y="${cy + rr * 0.34}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${rr * 0.95}" fill="${blank ? '#e0457b' : INK}">${v}</text>`);
      });
    });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ flashcards
const FLASH_SETS = {
  animals: () => SETS.animals, food: () => SETS.food, things: () => SETS.things,
  abc: () => Object.entries(ABC).map(([L, [w, src]]) => [`${L} ${L.toLowerCase()}`, src.startsWith('img/') ? src : P(src), w]),
  numbers: () => [...Array(21)].map((_, n) => [String(n), '', NUMBER_WORDS[n]]),
};

function flashItems(o) {
  if (o.set === 'words' || o.set === 'sight') {
    const list = o.set === 'sight' ? SIGHT_LISTS['dolch-pre'] : o.words;
    return listOf(list, 80).map((w) => {
      const hit = [...SETS.animals, ...SETS.food, ...SETS.things].find(([n]) => n.toLowerCase() === w.toLowerCase());
      return [w, hit ? hit[1] : ''];
    });
  }
  return (FLASH_SETS[o.set] || FLASH_SETS.animals)();
}

function flashFace(pg, x, y, w, h, item, side, c, set) {
  const [label, src, extra] = item;
  pg.add(`<rect x="${x + 2}" y="${y + 2}" width="${w - 4}" height="${h - 4}" rx="6" fill="${side === 'back' ? '#fff' : TINTS[c]}" stroke="${PALETTE[c]}" stroke-width="0.8"/>`);
  pg.add(`<rect x="${x + 0.4}" y="${y + 0.4}" width="${w - 0.8}" height="${h - 0.8}" rx="7" fill="none" stroke="#d9d4ec" stroke-width="0.3" stroke-dasharray="2 1.5"/>`);
  const showPic = side !== 'back' && (src || set === 'numbers');
  const showWord = side !== 'front' || (!src && set !== 'numbers');
  if (set === 'numbers' && showPic) {
    const n = +label;
    const rows = Math.max(1, Math.ceil(n / 5));
    const d = Math.min((w - 14) / 5.3, (h * 0.46) / rows, 16);
    pg.add(`<text x="${x + w / 2}" y="${y + h * 0.4 - (rows > 1 ? h * 0.06 : 0)}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${h * (rows > 1 ? 0.26 : 0.32)}" fill="${PALETTE[c]}">${label}</text>`);
    const top = y + h * (rows > 1 ? 0.44 : 0.52) + d / 2;
    for (let k = 0; k < n; k++) pg.add(pic(ART('star'), x + w / 2 - (Math.min(n, 5) - 1) * d / 2 + (k % 5) * d, top + Math.floor(k / 5) * d, d * 0.92));
    if (side === 'both') pg.add(`<text x="${x + w / 2}" y="${y + h - 7}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${Math.min(6, h * 0.08)}" fill="${INK}">${extra}</text>`);
    return;
  }
  if (showPic) pg.add(pic(src, x + w / 2, y + h * (side === 'both' ? 0.42 : 0.5), Math.min(w, h) * (side === 'both' ? 0.55 : 0.68)));
  if (showWord) {
    const text = set === 'abc' && side !== 'both' ? label : set === 'abc' ? `${label}  ${extra}` : set === 'numbers' ? `${label}  ${extra}` : label;
    const alone = !showPic;
    const fs = fitFont(text, alone ? h * 0.26 : h * 0.11, w - 10, 0.55);
    pg.add(`<text x="${x + w / 2}" y="${alone ? y + h / 2 + fs * 0.35 : y + h - 8}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${fs.toFixed(2)}" fill="${INK}">${esc(text)}</text>`);
  }
}

function makeFlashcards(o, paper) {
  const items = flashItems(o);
  if (!items.length) items.push(['cat', ART('cat')]);
  const big = o.cardsize === 'big';
  const cols = 2, rows = big ? 2 : 4, per = cols * rows;
  const double = o.sides === 'double';
  const pages = [];
  for (let i = 0; i < items.length; i += per) {
    const chunk = items.slice(i, i + per);
    for (const side of double ? ['front', 'back'] : ['both']) {
      const pg = new Page(paper, '', { bare: true });
      const w = pg.width / cols, h = (pg.bottom - pg.m) / rows;
      chunk.forEach((it, k) => {
        let col = k % cols;
        if (side === 'back') col = cols - 1 - col; // mirrored so it lines up when printed on both sides
        flashFace(pg, pg.left + col * w, pg.m + Math.floor(k / cols) * h, w, h, it, side, (i + k) % PALETTE.length, o.set);
      });
      pages.push(pg.svg());
    }
  }
  return pages;
}

// ================================================================ chore charts
const CHORES = {
  little: ['🧸 Put my toys away', '🧺 Clothes in the basket', '🍽️ Help set the table', '🌱 Water the plants', '🐶 Feed the pet', '🛏️ Make my bed'],
  middle: ['🛏️ Make my bed', '🧹 Tidy my room', '🍽️ Set the table', '🧺 Sort the washing', '🐶 Feed the pet', '🌱 Water the plants', '📚 Pack my school bag'],
  big: ['🛏️ Make my bed', '🧹 Hoover my room', '🍽️ Clear the table', '🧺 Fold my clothes', '🗑️ Take out the bins', '🐶 Walk the dog', '🧽 Wipe the table', '🌱 Water the garden'],
};

(function fillChores() {
  const form = typeof document !== 'undefined' && document.querySelector('#maker[data-tool=chores]');
  if (!form) return;
  const age = form.querySelector('[name=age]'), box = form.querySelector('[name=chores]');
  const fill = () => { if (CHORES[age.value]) box.value = CHORES[age.value].join('\n'); };
  age.addEventListener('change', fill);
  if (!box.value.trim()) fill();
})();

function makeChores(o, paper) {
  const kids = listOf(o.names, 12).map((n) => nameOf(n, ''));
  if (!kids.length) kids.push('');
  const steps = parseSteps(String(o.chores || '').trim() || (CHORES[o.age] || CHORES.middle).join('\n'));
  const days = o.week === 'school' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const money = o.money === true;
  return kids.map((name, ki) => {
    const pg = new Page(paper, name ? `${possessive(name)} Jobs This Week` : 'My Jobs This Week', { subtitle: 'Do a job, then colour a star. Every job helps the family!', noName: true });
    const payW = money ? 18 : 0;
    const dayW = Math.min(13, (pg.width - 62 - payW) / days.length);
    const labelW = pg.width - dayW * days.length - payW;
    const footer = 34;
    const rowH = Math.min(22, (pg.room - 10 - footer) / steps.length);
    days.forEach((d, i) => pg.add(`<text x="${pg.left + labelW + i * dayW + dayW / 2}" y="${pg.y + 3}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.6" fill="${SOFT}">${d}</text>`));
    if (money) pg.add(`<text x="${pg.right - payW / 2}" y="${pg.y + 3}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.6" fill="${SOFT}">Earns</text>`);
    let y = pg.y + 7;
    steps.forEach((s, i) => {
      const c = (i + ki) % PALETTE.length;
      pg.add(`<rect x="${pg.left}" y="${y}" width="${pg.width}" height="${rowH - 2.5}" rx="5" fill="${TINTS[c]}"/>`);
      pg.add(pic(P(s.pic), pg.left + 10, y + (rowH - 2.5) / 2, Math.min(16, rowH - 5)));
      pg.add(`<text x="${pg.left + 21}" y="${y + (rowH - 2.5) / 2 + 1.8}" font-family="${TITLE_FONT}" font-weight="800" font-size="${fitFont(s.label, 5.2, labelW - 24, 0.5).toFixed(2)}" fill="${INK}">${esc(s.label)}</text>`);
      days.forEach((d, k) => {
        const cx = pg.left + labelW + k * dayW + dayW / 2, cy = y + (rowH - 2.5) / 2;
        pg.add(`<path d="${starPath(cx, cy, Math.min(4.8, dayW * 0.38), 0.48)}" fill="#fff" stroke="${PALETTE[c]}" stroke-width="0.6" stroke-linejoin="round"/>`);
      });
      if (money) pg.add(`<rect x="${pg.right - payW + 2}" y="${y + 3}" width="${payW - 4}" height="${rowH - 8.5}" rx="2" fill="#fff" stroke="${SOFT}" stroke-width="0.4"/>`);
      y += rowH;
    });
    y += 4;
    const bw = (pg.width - 4) / 2;
    [['⭐', 'Stars this week'], ['🎁', money ? 'I have earned' : 'My reward']].forEach(([icon, label], k) => {
      const x = pg.left + k * (bw + 4);
      pg.add(`<rect x="${x}" y="${y}" width="${bw}" height="24" rx="6" fill="#fff" stroke="#ffb938" stroke-width="0.7" stroke-dasharray="2.5 1.5"/>`);
      pg.add(pic(P(icon), x + 11, y + 12, 13));
      pg.add(`<text x="${x + 21}" y="${y + 9}" font-family="${FONT}" font-weight="800" font-size="4" fill="${SOFT}">${label}</text>`);
      pg.add(`<line x1="${x + 21}" x2="${x + bw - 6}" y1="${y + 18}" y2="${y + 18}" stroke="#9a93b8" stroke-width="0.4"/>`);
    });
    return pg.svg();
  });
}

// ================================================================ feelings
const FEELINGS = {
  happy: '#ffd54f', sad: '#90caf9', angry: '#ff8a80', scared: '#ce93d8', excited: '#ffb74d', tired: '#b0bec5',
  worried: '#a5d6a7', calm: '#80deea', silly: '#f8bbd0', proud: '#ffe082', surprised: '#fff59d', lonely: '#b39ddb',
};

function face(cx, cy, r, mood, colour) {
  const fill = colour ? FEELINGS[mood] : '#fff';
  const ink = INK, sw = (r * 0.07).toFixed(2);
  let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${ink}" stroke-width="${(r * 0.06).toFixed(2)}"/>`;
  const ex = r * 0.36, ey = cy - r * 0.14;
  const eye = (x, kind) => {
    if (kind === 'closed') return `<path d="M${x - r * 0.13} ${ey} Q${x} ${ey + r * 0.1} ${x + r * 0.13} ${ey}" fill="none" stroke="${ink}" stroke-width="${sw}" stroke-linecap="round"/>`;
    if (kind === 'happy') return `<path d="M${x - r * 0.13} ${ey + r * 0.04} Q${x} ${ey - r * 0.12} ${x + r * 0.13} ${ey + r * 0.04}" fill="none" stroke="${ink}" stroke-width="${sw}" stroke-linecap="round"/>`;
    if (kind === 'big') return `<circle cx="${x}" cy="${ey}" r="${r * 0.13}" fill="#fff" stroke="${ink}" stroke-width="${sw}"/><circle cx="${x}" cy="${ey}" r="${r * 0.06}" fill="${ink}"/>`;
    return `<circle cx="${x}" cy="${ey}" r="${r * 0.08}" fill="${ink}"/>`;
  };
  const brow = (x, dir) => `<path d="M${x - r * 0.15} ${ey - r * 0.2 + dir * r * 0.06} L${x + r * 0.15} ${ey - r * 0.2 - dir * r * 0.06}" stroke="${ink}" stroke-width="${sw}" stroke-linecap="round"/>`;
  const mouth = (d) => `<path d="${d}" fill="none" stroke="${ink}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const my = cy + r * 0.38, mx = r * 0.32;
  const kinds = { proud: 'happy', tired: 'closed', surprised: 'big', scared: 'big' };
  s += eye(cx - ex, mood === 'silly' ? 'happy' : kinds[mood]) + eye(cx + ex, kinds[mood]);
  if (mood === 'angry') s += brow(cx - ex, -1) + brow(cx + ex, 1);
  if (mood === 'sad' || mood === 'worried' || mood === 'lonely' || mood === 'scared') s += brow(cx - ex, 1) + brow(cx + ex, -1);
  const M = {
    happy: `M${cx - mx} ${my - r * 0.06} Q${cx} ${my + r * 0.3} ${cx + mx} ${my - r * 0.06}`,
    sad: `M${cx - mx} ${my + r * 0.12} Q${cx} ${my - r * 0.18} ${cx + mx} ${my + r * 0.12}`,
    angry: `M${cx - mx} ${my + r * 0.1} Q${cx} ${my - r * 0.1} ${cx + mx} ${my + r * 0.1}`,
    worried: `M${cx - mx} ${my + r * 0.04} q${mx / 3} ${-r * 0.1} ${mx * 2 / 3} 0 t${mx * 2 / 3} 0 t${mx * 2 / 3} 0`,
    calm: `M${cx - mx * 0.8} ${my} Q${cx} ${my + r * 0.14} ${cx + mx * 0.8} ${my}`,
    tired: `M${cx - mx * 0.5} ${my + r * 0.04} L${cx + mx * 0.5} ${my + r * 0.04}`,
    lonely: `M${cx - mx * 0.7} ${my + r * 0.1} Q${cx} ${my - r * 0.06} ${cx + mx * 0.7} ${my + r * 0.1}`,
    proud: `M${cx - mx} ${my - r * 0.06} Q${cx} ${my + r * 0.26} ${cx + mx} ${my - r * 0.06}`,
  };
  if (mood === 'excited' || mood === 'silly') s += `<path d="M${cx - mx} ${my - r * 0.08} Q${cx} ${my + r * 0.42} ${cx + mx} ${my - r * 0.08} Z" fill="#fff" stroke="${ink}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  else if (mood === 'surprised' || mood === 'scared') s += `<ellipse cx="${cx}" cy="${my + r * 0.04}" rx="${r * 0.13}" ry="${r * 0.17}" fill="#fff" stroke="${ink}" stroke-width="${sw}"/>`;
  else s += mouth(M[mood] || M.happy);
  if (mood === 'silly') s += `<path d="M${cx - r * 0.1} ${my + r * 0.12} Q${cx} ${my + r * 0.36} ${cx + r * 0.1} ${my + r * 0.12}" fill="#ff8fab" stroke="${ink}" stroke-width="${(r * 0.05).toFixed(2)}"/>`;
  if (mood === 'tired') s += `<text x="${cx + r * 0.62}" y="${cy - r * 0.55}" font-family="${TITLE_FONT}" font-weight="800" font-size="${r * 0.4}" fill="${ink}">z</text>`;
  if (mood === 'lonely' || mood === 'sad') s += `<path d="M${cx + ex} ${ey + r * 0.14} q${-r * 0.06} ${r * 0.14} 0 ${r * 0.2} q${r * 0.06} ${-r * 0.06} 0 ${-r * 0.2} Z" fill="#6ab7f5"/>`;
  if (['happy', 'excited', 'proud', 'silly'].includes(mood) && colour) s += `<circle cx="${cx - r * 0.55}" cy="${cy + r * 0.2}" r="${r * 0.12}" fill="#ff8fab" opacity="0.6"/><circle cx="${cx + r * 0.55}" cy="${cy + r * 0.2}" r="${r * 0.12}" fill="#ff8fab" opacity="0.6"/>`;
  return s;
}

const CALM_IDEAS = [['🌬️', 'Take 5 big breaths'], ['🔢', 'Count to 10 slowly'], [ART('bear'), 'Hug my teddy'], ['💧', 'Drink some water'], ['🖍️', 'Draw how I feel'],
  ['🗣️', 'Talk to a grown-up'], ['🎵', 'Listen to music'], ['🤸', 'Stretch like a cat'], ['🛋️', 'Go to my quiet spot'], ['🤗', 'Ask for a hug']];

function makeFeelings(o, paper) {
  const name = nameOf(o.name, '');
  const colour = o.faces !== 'colour-in';
  const moods = Object.keys(FEELINGS);
  const pages = [];
  if (o.chart !== false) {
    const pg = new Page(paper, 'How do I feel today?', { subtitle: 'Point to the face that feels like you. All feelings are OK!', noName: !name });
    const cols = 3, rows = 4, cw = pg.width / cols, ch = (pg.room - 2) / rows;
    moods.forEach((m, i) => {
      const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch;
      pg.add(`<rect x="${x + 2}" y="${y + 2}" width="${cw - 4}" height="${ch - 4}" rx="7" fill="${colour ? TINTS[i % TINTS.length] : '#fff'}" stroke="#e3def3" stroke-width="0.5"/>`);
      pg.add(face(x + cw / 2, y + ch * 0.44, Math.min(cw, ch) * 0.28, m, colour));
      pg.add(`<text x="${x + cw / 2}" y="${y + ch - 8}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="6.5" fill="${INK}">${m}</text>`);
    });
    pages.push(pg.svg());
  }
  if (o.week !== false) {
    const pg = new Page(paper, name ? `${possessive(name)} Feelings Week` : 'My Feelings Week', { subtitle: 'Each day, circle the face that shows how you feel, and say why.', noName: true });
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const rowH = (pg.room - 2) / 7;
    const pick = ['happy', 'calm', 'sad', 'angry', 'worried', 'tired'];
    days.forEach((d, i) => {
      const y = pg.y + i * rowH;
      pg.add(`<rect x="${pg.left}" y="${y + 1}" width="${pg.width}" height="${rowH - 3}" rx="6" fill="${TINTS[i]}"/>`);
      pg.add(`<text x="${pg.left + 5}" y="${y + rowH / 2 + 1}" font-family="${TITLE_FONT}" font-weight="800" font-size="5.4" fill="${INK}">${d}</text>`);
      const r = Math.min(5.5, rowH * 0.2);
      pick.forEach((m, k) => pg.add(face(pg.left + 44 + k * (r * 2.5), y + rowH * 0.36, r, m, colour)));
      pg.add(`<text x="${pg.left + 44 + 6 * r * 2.5 + 3}" y="${y + rowH * 0.36 + 1.4}" font-family="${FONT}" font-weight="700" font-size="3.8" fill="${SOFT}">because...</text>`);
      pg.add(`<line x1="${pg.left + 44}" x2="${pg.right - 5}" y1="${y + rowH - 6}" y2="${y + rowH - 6}" stroke="#9a93b8" stroke-width="0.35"/>`);
    });
    pages.push(pg.svg());
  }
  if (o.calm !== false) {
    const pg = new Page(paper, 'When I have big feelings, I can...', { subtitle: 'Try one of these. Colour the ones that help you most.', noName: true });
    const cols = 2, rows = 5, cw = pg.width / cols, ch = (pg.room - 2) / rows;
    CALM_IDEAS.forEach(([src, label], i) => {
      const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch;
      const c = i % PALETTE.length;
      pg.add(`<rect x="${x + 2}" y="${y + 2}" width="${cw - 4}" height="${ch - 4}" rx="8" fill="${TINTS[c]}" stroke="${PALETTE[c]}" stroke-width="0.6"/>`);
      pg.add(pic(P(src), x + 20, y + ch / 2, Math.min(30, ch - 14)));
      textLines(pg, wrap(label, 16), x + 38, y + ch / 2 + 1 - (wrap(label, 16).length - 1) * 3.5, 6, { weight: 800, font: TITLE_FONT, lh: 1.2 });
    });
    pages.push(pg.svg());
  }
  if (!pages.length) pages.push(new Page(paper, 'Feelings', { subtitle: 'Tick at least one page to include.', noName: true }).svg());
  return pages;
}

// ================================================================ scavenger hunts
const HUNTS = {
  home: ['🥄 spoon', '🧦 sock', '📚 book', '☕ cup', `${ART('bear')} teddy`, '🔑 key', '⏰ clock', '🪥 toothbrush', '👟 shoe', '⚽ ball', `${ART('apple')} apple`, `${ART('blocks')} blocks`],
  garden: ['🍃 leaf', `${ART('daisy')} flower`, `${ART('ladybird')} ladybird`, '🪨 stone', '🪵 stick', '🪶 feather', '🐌 snail', `${ART('ant')} ant`, '🐦 bird', '🪱 worm', `${ART('mushroom')} mushroom`, '🦋 butterfly'],
  park: ['🪑 bench', '🌳 tree', `${ART('dog')} dog`, '🦆 duck', '💧 puddle', '🌲 pine cone', '🛝 slide', '🚲 bike', '☁️ cloud', `${ART('sun')} sun`, '🐿️ squirrel', `${ART('tulip')} flower`],
  beach: ['🐚 shell', '🦀 crab', '⛱️ umbrella', '🌊 wave', `${ART('fish')} fish`, '🪣 bucket', '⛵ boat', '🩴 flip-flops', `${ART('star')} starfish`, '🍦 ice cream', `${ART('sun')} sun`, '🪨 rock'],
  shop: [`${ART('apple')} apple`, `${ART('banana')} banana`, `${ART('egg')} eggs`, '🍞 bread', '🥛 milk', '🧀 cheese', `${ART('orange')} orange`, '🥕 carrot', `${ART('strawberry')} strawberry`, '🍝 pasta', '🥫 tin', '🛒 trolley'],
  colours: ['#ff4d4d red', '#ff9f1c orange', '#ffd23f yellow', '#3fbf60 green', '#3a86ff blue', '#9b5de5 purple', '#ff70a6 pink', '#8d5524 brown', '#2d2350 black', '#ffffff white', '#9aa5b1 grey', '#ffd700 gold'],
  shapes: ['circle circle', 'square square', 'triangle triangle', 'rectangle rectangle', 'star star', 'heart heart', 'oval oval', 'diamond diamond'],
};

function shapeIcon(kind, cx, cy, r) {
  const st = `fill="#fff" stroke="${INK}" stroke-width="0.9" stroke-linejoin="round"`;
  switch (kind) {
    case 'circle': return `<circle cx="${cx}" cy="${cy}" r="${r}" ${st}/>`;
    case 'square': return `<rect x="${cx - r}" y="${cy - r}" width="${r * 2}" height="${r * 2}" ${st}/>`;
    case 'triangle': return `<path d="M${cx} ${cy - r} L${cx + r * 1.1} ${cy + r * 0.85} L${cx - r * 1.1} ${cy + r * 0.85} Z" ${st}/>`;
    case 'rectangle': return `<rect x="${cx - r * 1.3}" y="${cy - r * 0.75}" width="${r * 2.6}" height="${r * 1.5}" ${st}/>`;
    case 'star': return `<path d="${starPath(cx, cy, r * 1.1, 0.45)}" ${st}/>`;
    case 'heart': return `<path d="M${cx} ${cy + r} C${cx - r * 1.6} ${cy - r * 0.1} ${cx - r * 0.7} ${cy - r * 1.3} ${cx} ${cy - r * 0.45} C${cx + r * 0.7} ${cy - r * 1.3} ${cx + r * 1.6} ${cy - r * 0.1} ${cx} ${cy + r} Z" ${st}/>`;
    case 'oval': return `<ellipse cx="${cx}" cy="${cy}" rx="${r * 1.3}" ry="${r * 0.8}" ${st}/>`;
    default: return `<path d="M${cx} ${cy - r * 1.1} L${cx + r * 0.85} ${cy} L${cx} ${cy + r * 1.1} L${cx - r * 0.85} ${cy} Z" ${st}/>`;
  }
}

function makeHunt(o, paper) {
  const theme = HUNTS[o.theme] ? o.theme : 'garden';
  const items = HUNTS[theme].map((s) => { const i = s.indexOf(' '); return [s.slice(0, i), s.slice(i + 1)]; });
  const title = { home: 'Indoor treasure hunt', garden: 'Garden scavenger hunt', park: 'Park scavenger hunt', beach: 'Beach scavenger hunt', shop: 'Supermarket hunt', colours: 'Colour hunt', shapes: 'Shape hunt' }[theme];
  const sub = theme === 'colours' ? 'Find something in each colour. Tick it or draw what you found!' : theme === 'shapes' ? 'Find something shaped like each one. Draw what you found!' : 'Can you find them all? Tick each one when you spot it!';
  const pg = new Page(paper, title, { subtitle: sub });
  const cols = 3, rows = Math.ceil(items.length / cols);
  const foot = 24;
  const cw = pg.width / cols, ch = (pg.room - foot - 2) / rows;
  items.forEach(([src, label], i) => {
    const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch;
    const c = i % PALETTE.length;
    pg.add(`<rect x="${x + 1.5}" y="${y + 1.5}" width="${cw - 3}" height="${ch - 3}" rx="7" fill="${TINTS[c]}" stroke="${PALETTE[c]}" stroke-width="0.6"/>`);
    const size = Math.min(cw, ch) * 0.46;
    if (theme === 'colours') {
      pg.add(`<path d="M${x + cw / 2} ${y + ch * 0.42 - size * 0.5} c${size * 0.4} 0 ${size * 0.6} ${size * 0.15} ${size * 0.52} ${size * 0.45} c${size * 0.1} ${size * 0.35} ${-size * 0.2} ${size * 0.55} ${-size * 0.52} ${size * 0.52} c${-size * 0.4} 0 ${-size * 0.62} ${-size * 0.2} ${-size * 0.55} ${-size * 0.5} c0 ${-size * 0.3} ${size * 0.2} ${-size * 0.47} ${size * 0.55} ${-size * 0.47} Z" fill="${src}" stroke="${INK}" stroke-width="0.5"/>`);
    } else if (theme === 'shapes') pg.add(shapeIcon(src, x + cw / 2, y + ch * 0.42, size * 0.42));
    else pg.add(pic(src, x + cw / 2, y + ch * 0.42, size));
    const tw = label.length * 2.95, sx = x + cw / 2 - (tw + 7) / 2;
    pg.add(`<rect x="${sx}" y="${y + ch - 11.2}" width="5" height="5" rx="1.2" fill="#fff" stroke="${INK}" stroke-width="0.5"/>`);
    pg.add(`<text x="${sx + 7}" y="${y + ch - 7}" font-family="${TITLE_FONT}" font-weight="800" font-size="5.6" fill="${INK}">${esc(label)}</text>`);
  });
  const fy = pg.bottom - foot + 3;
  pg.add(`<rect x="${pg.left}" y="${fy}" width="${pg.width}" height="${foot - 4}" rx="7" fill="#fff6e0" stroke="#ffb938" stroke-width="0.6" stroke-dasharray="2.5 1.5"/>`);
  pg.add(pic(ART('medal'), pg.left + 12, fy + (foot - 4) / 2, 15));
  pg.add(`<text x="${pg.left + 24}" y="${fy + 12}" font-family="${TITLE_FONT}" font-weight="800" font-size="6" fill="${INK}">I found</text>`);
  pg.add(`<rect x="${pg.left + 46}" y="${fy + 5}" width="14" height="10" rx="2" fill="#fff" stroke="${INK}" stroke-width="0.5"/>`);
  pg.add(`<text x="${pg.left + 63}" y="${fy + 12}" font-family="${TITLE_FONT}" font-weight="800" font-size="6" fill="${INK}">out of ${items.length}!</text>`);
  return [pg.svg()];
}

// ================================================================ matching
function makeMatching(o, paper) {
  const rand = rng(+o.seed || 1);
  const n = Math.max(4, Math.min(6, +o.pairs || 5));
  const kind = o.kind || 'word';
  const painted = shuffle([...SETS.animals, ...SETS.food, ...SETS.things].filter(([, s]) => s.startsWith('img/')), rand);
  let pairs;
  if (kind === 'case') pairs = shuffle('ABDEFGHLMNQRT'.split(''), rand).slice(0, n).map((L) => [{ t: L }, { t: L.toLowerCase() }]);
  else if (kind === 'count') pairs = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], rand).slice(0, n).map((k, i) => [{ count: k, src: painted[i][1] }, { t: String(k) }]);
  else if (kind === 'shadow') pairs = painted.slice(0, n).map(([, src]) => [{ src }, { src, shadow: true }]);
  else pairs = painted.slice(0, n).map(([name, src]) => [{ src }, { t: name.toLowerCase() }]);
  const order = shuffle([...Array(n).keys()], rand);
  const title = { word: 'Match the picture to the word', case: 'Match the big and little letters', count: 'Count and match', shadow: 'Match the shadow' }[kind] || 'Matching';
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const pg = new Page(paper, answers ? `${title}: answers` : title, { subtitle: answers ? 'Answer key for grown-ups.' : 'Draw a line from each one on the left to its partner on the right.', noName: answers });
    pg.add(`<defs><filter id="shadow"><feColorMatrix type="matrix" values="0 0 0 0 0.24  0 0 0 0 0.2  0 0 0 0 0.36  0 0 0 1 0"/></filter></defs>`);
    const rowH = (pg.room - 4) / n;
    const colW = 62;
    const lx = pg.left + 6, rx = pg.right - colW - 6;
    const cell = (item, x, y, c) => {
      const cx = x + colW / 2, cy = y + rowH / 2;
      pg.add(`<rect x="${x}" y="${y + 3}" width="${colW}" height="${rowH - 6}" rx="7" fill="${TINTS[c]}" stroke="${PALETTE[c]}" stroke-width="0.6"/>`);
      const s = Math.min(colW, rowH) * 0.66;
      if (item.count) {
        const k = item.count, cols = Math.min(5, k), rows = Math.ceil(k / 5), d = Math.min(colW / 5.6, (rowH - 10) / rows);
        for (let i = 0; i < k; i++) pg.add(pic(item.src, cx - ((cols - 1) * d) / 2 + (i % 5) * d, cy - ((rows - 1) * d) / 2 + Math.floor(i / 5) * d, d * 0.92));
      } else if (item.src) {
        const img = pic(item.src, cx, cy, s);
        pg.add(item.shadow ? img.replace('<image ', '<image filter="url(#shadow)" ') : img);
      } else pg.add(`<text x="${cx}" y="${cy + s * 0.2}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${fitFont(item.t, s * 0.62, colW - 8, 0.52).toFixed(2)}" fill="${INK}">${esc(item.t)}</text>`);
    };
    pairs.forEach(([a], i) => cell(a, lx, pg.y + i * rowH, i % PALETTE.length));
    order.forEach((pi, j) => cell(pairs[pi][1], rx, pg.y + j * rowH, (pi + 3) % PALETTE.length));
    for (let i = 0; i < n; i++) {
      const y = pg.y + i * rowH + rowH / 2;
      pg.add(`<circle cx="${lx + colW + 4}" cy="${y}" r="1.6" fill="${INK}"/><circle cx="${rx - 4}" cy="${y}" r="1.6" fill="${INK}"/>`);
    }
    if (answers) pairs.forEach((_, i) => {
      const j = order.indexOf(i);
      pg.add(`<line x1="${lx + colW + 4}" y1="${pg.y + i * rowH + rowH / 2}" x2="${rx - 4}" y2="${pg.y + j * rowH + rowH / 2}" stroke="#e0457b" stroke-width="0.8" stroke-linecap="round"/>`);
    });
    pages.push(pg.svg());
  }
  return pages;
}

Object.assign(MAKERS, { sight: makeSight, cvc: makeCVC, bonds: makeBonds, flashcards: makeFlashcards, chores: makeChores, feelings: makeFeelings, hunt: makeHunt, matching: makeMatching });

;
// PrintPals joined (cursive) handwriting, in the style taught in many UK schools.
// Same units as the print letters: top line y=0, middle y=50, baseline y=100, tail y=150.
// body: the letter in one stroke. in: where the pen arrives. out: where it leaves
// (at the baseline, or at the middle line after o, r, v and w). Letters with out: null
// do not join to the next letter (b, g, j, p, q, s, x, y, z).
const CURVE = 'M38 57 C34 51 28 50 22 50 C10 50 2 62 2 76 C2 92 12 100 21 100 C30 100 36 94 38 86';
// Round letters are joined on their left side (from the baseline) or their top (after o, r, v, w),
// so the joining stroke never cuts through the letter.
const ROUND = { side: [2, 80], top: [22, 50] };
const CURSIVE = {
  a: { w: 47, body: `${CURVE} L38 50 L38 92 Q39 100 47 100`, in: [38, 57], round: ROUND, out: [47, 100] },
  b: { w: 42, body: 'M4 0 L4 100', extra: ['M4 74 C6 58 14 50 22 50 C32 50 40 60 40 75 C40 90 32 100 22 100 C14 100 8 97 4 92'], in: [4, 0], out: null },
  c: { w: 42, body: 'M38 57 C34 51 28 50 22 50 C10 50 2 62 2 76 C2 92 12 100 22 100 C30 100 36 97 42 92', in: [38, 57], round: ROUND, out: [42, 92] },
  d: { w: 47, body: `${CURVE} L38 0 L38 92 Q39 100 47 100`, in: [38, 57], round: ROUND, out: [47, 100] },
  e: { w: 42, body: 'M4 77 C16 79 30 78 38 72 C42 63 34 50 21 50 C8 50 2 63 2 76 C2 92 12 100 22 100 C30 100 36 97 42 92', in: [4, 77], out: [42, 92] },
  f: { w: 36, body: 'M34 6 C29 1 24 0 20 0 C14 0 10 5 10 14 L10 100', extra: ['M0 50 L34 50'], in: [10, 14], out: [34, 50] },
  g: { w: 42, body: `${CURVE} L38 50 L38 126 C38 142 30 150 20 150 C12 150 6 146 2 140`, in: [38, 57], round: ROUND, out: null },
  h: { w: 47, body: 'M4 0 L4 100 L4 74 C6 58 14 50 22 50 C32 50 38 58 38 72 L38 92 Q39 100 47 100', in: [4, 0], out: [47, 100] },
  i: { w: 13, body: 'M4 50 L4 92 Q5 100 13 100', dots: [[4, 28]], in: [4, 50], out: [13, 100] },
  j: { w: 26, body: 'M10 50 L10 128 C10 143 2 150 -6 148', dots: [[10, 28]], in: [10, 50], out: null },
  k: { w: 42, body: 'M4 0 L4 100 L4 78 C12 62 32 54 33 64 C34 74 16 78 4 78 C16 82 30 94 42 100', in: [4, 0], out: [42, 100] },
  l: { w: 13, body: 'M4 0 L4 92 Q5 100 13 100', in: [4, 0], out: [13, 100] },
  m: { w: 65, body: 'M4 50 L4 100 L4 70 C6 56 12 50 18 50 C26 50 30 56 30 70 L30 100 L30 70 C32 56 38 50 44 50 C52 50 56 56 56 70 L56 92 Q57 100 65 100', in: [4, 50], out: [65, 100] },
  n: { w: 47, body: 'M4 50 L4 100 L4 72 C6 58 14 50 22 50 C32 50 38 58 38 72 L38 92 Q39 100 47 100', in: [4, 50], out: [47, 100] },
  o: { w: 48, body: 'M22 50 C10 50 2 62 2 76 C2 92 12 100 22 100 C32 100 40 90 40 75 C40 60 32 50 22 50 L48 50', in: [22, 50], round: ROUND, out: [48, 50] },
  p: { w: 42, body: 'M4 50 L4 150', extra: ['M4 74 C6 58 14 50 22 50 C32 50 40 60 40 75 C40 90 32 100 22 100 C14 100 8 97 4 92'], in: [4, 50], out: null },
  q: { w: 42, body: `${CURVE} L38 50 L38 150`, in: [38, 57], round: ROUND, out: null },
  r: { w: 36, body: 'M4 50 L4 100 L4 72 C8 57 16 50 24 50 C29 50 33 51 36 53', in: [4, 50], out: [36, 53] },
  s: { w: 34, body: 'M31 57 C27 51 22 50 17 50 C10 50 5 54 5 61 C5 70 14 72 18 74 C25 77 32 80 32 88 C32 96 26 100 18 100 C11 100 5 97 2 92', in: [31, 57], round: { side: [5, 64], top: [17, 50] }, out: null },
  t: { w: 36, body: 'M14 12 L14 90 C14 97 19 100 24 100 C28 100 32 99 36 96', extra: ['M2 50 L28 50'], in: [14, 12], out: [36, 96] },
  u: { w: 47, body: 'M4 50 L4 78 C4 92 12 100 21 100 C30 100 38 92 38 78 L38 50 L38 92 Q39 100 47 100', in: [4, 50], out: [47, 100] },
  v: { w: 40, body: 'M2 50 L20 100 L38 50', in: [2, 50], out: [38, 50] },
  w: { w: 58, body: 'M2 50 L15 100 L28 62 L41 100 L54 50', in: [2, 50], out: [54, 50] },
  x: { w: 40, body: 'M2 50 L38 100', extra: ['M38 50 L2 100'], in: [2, 50], out: null },
  y: { w: 42, body: 'M2 50 L20 100', extra: ['M38 50 L10 150'], in: [2, 50], out: null },
  z: { w: 38, body: 'M2 50 L36 50 L2 100 L36 100', in: [2, 50], out: null },
};
const JOIN_GAP = 13; // room between letters for the joining stroke

function cursiveUnits(word) {
  const t = cleanText(word);
  const out = [];
  let x = 0;
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    const g = CURSIVE[ch];
    if (g) { out.push({ ch, g, x, joined: true }); x += g.w + JOIN_GAP; }
    else if (GLYPHS[ch]) { out.push({ ch, g: GLYPHS[ch], x, joined: false }); x += GLYPHS[ch].w + GAP; }
  }
  return { units: out, width: Math.max(0, x - JOIN_GAP) };
}

function cursiveWidth(text) {
  return String(text).split(' ').filter(Boolean).reduce((w, word, i) => w + cursiveUnits(word).width + (i ? 34 : 0), 0);
}

/** Draws joined writing for [text] (words separated by spaces), like drawText. */
function drawCursive(text, x, top, size, style = 'trace', starts = false) {
  const s = size / 100;
  const colour = style === 'model' ? '#2d2350' : style === 'ghost' ? '#d9d4ec' : '#7d7799';
  const width = Math.max(0.5, size * (style === 'model' ? 0.07 : 0.05));
  const sw = width / s;
  const dash = style === 'trace' ? `stroke-dasharray="0 ${(sw * 1.9).toFixed(2)}"` : '';
  const line = (d) => `<path d="${d}" fill="none" stroke="${colour}" stroke-width="${sw.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" ${dash}/>`;
  let out = '';
  let wx = 0;
  const firsts = [];
  String(text).split(' ').filter(Boolean).forEach((word) => {
    const { units, width: ww } = cursiveUnits(word);
    let prevOut = null;
    units.forEach((u) => {
      const g = u.g;
      let paths = '';
      if (u.joined) {
        let [ix, iy] = g.in;
        if (g.round) [ix, iy] = prevOut && prevOut[1] < 70 ? g.round.top : g.round.side;
        const inX = wx + u.x + ix, inY = iy;
        let join;
        if (prevOut) {
          // Joining stroke from the last letter: along the line, then up (or across from the top).
          const [px, py] = prevOut;
          const mx = px + (inX - px) * (py > inY + 20 ? 0.55 : 0.5);
          join = `M${px.toFixed(1)} ${py} Q${mx.toFixed(1)} ${py > inY + 20 ? Math.max(py, 100) : py} ${inX.toFixed(1)} ${inY}`;
        } else {
          // A little lead-in stroke from the baseline to start the word or after a break.
          const sx = inX - (inY < 30 ? 14 : 10);
          join = `M${sx.toFixed(1)} 100 Q${(sx + (inX - sx) * 0.55).toFixed(1)} 100 ${inX.toFixed(1)} ${inY}`;
          firsts.push([sx, 100]);
        }
        paths += line(join);
        paths += `<g transform="translate(${(wx + u.x).toFixed(2)} 0)">${line(g.body)}${(g.extra || []).map(line).join('')}`
          + (g.dots || []).map(([dx, dy]) => `<circle cx="${dx}" cy="${dy}" r="${((width * 0.75) / s).toFixed(2)}" fill="${colour}"/>`).join('') + '</g>';
        prevOut = g.out ? [wx + u.x + g.out[0], g.out[1]] : null;
      } else {
        // Capitals and numbers are written as print and are not joined.
        paths += `<g transform="translate(${(wx + u.x).toFixed(2)} 0)">${g.d.map(line).join('')}`
          + (g.dots || []).map(([dx, dy]) => `<circle cx="${dx}" cy="${dy}" r="${((width * 0.75) / s).toFixed(2)}" fill="${colour}"/>`).join('') + '</g>';
        const m = /M\s*(-?[\d.]+)[ ,]+(-?[\d.]+)/.exec(g.d[0]);
        if (!prevOut && m && u === units[0]) firsts.push([wx + u.x + parseFloat(m[1]), parseFloat(m[2])]);
        prevOut = null;
      }
      out += paths;
    });
    wx += ww + 34;
  });
  let dots = '';
  if (starts) {
    const r = Math.max(1.3, size * 0.075);
    firsts.forEach(([fx, fy]) => { dots += `<circle cx="${(x + fx * s).toFixed(2)}" cy="${(top + fy * s).toFixed(2)}" r="${r.toFixed(2)}" fill="#3fbf7f"/>`; });
  }
  return `<g transform="translate(${x.toFixed(2)} ${top.toFixed(2)}) scale(${s.toFixed(4)})">${out}</g>${dots}`;
}

;
// PrintPals batch 4: joined handwriting, alphabets in other languages, word families,
// rhyming, number lines, fractions, colour by number and spot the difference.

// ================================================================ joined handwriting
const JOINED_PRESETS = {
  joins: 'an in un en on\nat it ut et ot\nch sh th wh\nee oo ll ff\ning ang ong ung\nai ay oi oy\nou ow er ir',
  words: 'door floor because find\nkind mind child children\nclimb most only both\nold cold gold told\nevery great pretty after\nfast last father class\nwater again half money',
  sentences: 'The sun is hot today.\nI like to read books.\nWe went to the park.\nMy cat is soft and fluffy.\nCan you jump up high?\nI love my family!',
};

(function fillJoined() {
  const form = typeof document !== 'undefined' && document.querySelector('#maker[data-tool=joined]');
  if (!form) return;
  const pre = form.querySelector('[name=preset]'), box = form.querySelector('[name=text]');
  const fill = () => { if (JOINED_PRESETS[pre.value]) box.value = JOINED_PRESETS[pre.value]; };
  pre.addEventListener('change', fill);
  if (!box.value.trim()) fill();
})();

function makeJoined(o, paper) {
  const lines = String(o.text || '').split('\n').map((l) => l.trim().replace(/\s+/g, ' ')).filter((l) => cleanText(l).trim()).slice(0, 30);
  if (!lines.length) lines.push(...JOINED_PRESETS.joins.split('\n'));
  const want = { big: 17, medium: 13, small: 10 }[o.size] || 13;
  const pages = [];
  let pg = null;
  const newPage = () => { if (pg) pages.push(pg.svg()); pg = new Page(paper, 'Joined handwriting', { subtitle: 'Start at the green dot. Keep your pencil on the paper as you join the letters.' }); };
  for (const line of lines) {
    const w = cursiveWidth(line);
    const size = Math.max(7, Math.min(want, ((pg ? pg.width : 184) - 8) / (w / 100)));
    const rh = rowHeight(size);
    const rows = o.rows === 'more' ? 4 : 3;
    if (!pg || pg.room < rh * rows) newPage();
    const unit = (w / 100) * size;
    for (let r = 0; r < rows; r++) {
      pg.guides(pg.y, size);
      if (r < rows - 1 || o.blank === false) {
        let x = pg.left + size * 0.5, n = 0;
        while ((n === 0 || x + unit <= pg.right - 2) && n < 6) {
          pg.add(drawCursive(line, x, pg.y, size, r === 0 && n === 0 ? 'model' : 'trace', r === 0 && n === 0 && o.dots !== false));
          x += unit + size * 1.2; n++;
        }
      }
      pg.y += rh;
    }
    pg.y += 2;
  }
  pages.push(pg.svg());
  return pages;
}

// ================================================================ alphabets in other languages
const ALPHABETS = {
  spanish: { name: 'Spanish', native: 'Español', letters: 'A B C D E F G H I J K L M N Ñ O P Q R S T U V W X Y Z', special: 'Ñ' },
  french: { name: 'French', native: 'Français', letters: 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z', extra: 'É È Ê À Â Ç Î Ô Û Ù Ë Ï', special: '' },
  german: { name: 'German', native: 'Deutsch', letters: 'A Ä B C D E F G H I J K L M N O Ö P Q R S ẞ T U Ü V W X Y Z', special: 'Ä Ö Ü ẞ' },
  italian: { name: 'Italian', native: 'Italiano', letters: 'A B C D E F G H I L M N O P Q R S T U V Z', special: '' },
  portuguese: { name: 'Portuguese', native: 'Português', letters: 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z', extra: 'Á Â Ã À Ç É Ê Í Ó Ô Õ Ú', special: '' },
  swahili: { name: 'Swahili', native: 'Kiswahili', letters: 'A B CH D E F G H I J K L M N O P R S T U V W Y Z', extra: 'DH GH KH NG\' NY SH TH', special: 'CH' },
  yoruba: { name: 'Yoruba', native: 'Yorùbá', letters: 'A B D E Ẹ F G GB H I J K L M N O Ọ P R S Ṣ T U W Y', special: 'Ẹ GB Ọ Ṣ' },
  igbo: { name: 'Igbo', native: 'Igbo', letters: 'A B CH D E F G GB GH GW H I Ị J K KP KW L M N Ṅ NW NY O Ọ P R S SH T U Ụ V W Y Z', special: 'CH GB GH GW Ị KP KW Ṅ NW NY Ọ SH Ụ' },
  hausa: { name: 'Hausa', native: 'Hausa', letters: 'A B Ɓ C D Ɗ E F G H I J K Ƙ L M N O R S SH T TS U W Y Ƴ Z', special: 'Ɓ Ɗ Ƙ SH TS Ƴ' },
  twi: { name: 'Twi', native: 'Twi (Akan)', letters: 'A B D E Ɛ F G H I K L M N O Ɔ P R S T U W Y', special: 'Ɛ Ɔ' },
  polish: { name: 'Polish', native: 'Polski', letters: 'A Ą B C Ć D E Ę F G H I J K L Ł M N Ń O Ó P R S Ś T U W Y Z Ź Ż', special: 'Ą Ć Ę Ł Ń Ó Ś Ź Ż' },
  turkish: { name: 'Turkish', native: 'Türkçe', letters: 'A B C Ç D E F G Ğ H I İ J K L M N O Ö P R S Ş T U Ü V Y Z', special: 'Ç Ğ I İ Ö Ş Ü' },
  vietnamese: { name: 'Vietnamese', native: 'Tiếng Việt', letters: 'A Ă Â B C D Đ E Ê G H I K L M N O Ô Ơ P Q R S T U Ư V X Y', extra: 'à á ả ã ạ', extraLabel: 'The five tone marks, shown on a', special: 'Ă Â Đ Ê Ô Ơ Ư' },
  filipino: { name: 'Filipino', native: 'Filipino', letters: 'A B C D E F G H I J K L M N Ñ NG O P Q R S T U V W X Y Z', special: 'Ñ NG' },
  welsh: { name: 'Welsh', native: 'Cymraeg', letters: 'A B C CH D DD E F FF G NG H I J L LL M N O P PH R RH S T TH U W Y', special: 'CH DD FF NG LL PH RH TH' },
};
let LANG_NOW = '';
const LETTER_FONT = "'Baloo 2', Nunito, 'Noto Sans', 'Segoe UI', Arial, sans-serif";

function lowerOf(L) {
  if (L === 'ẞ') return 'ß';
  if (L === 'I' && LANG_NOW === 'turkish') return 'ı';
  if (L === 'İ') return 'i';
  return L.toLowerCase();
}

function makeAlphabets(o, paper) {
  const lang = ALPHABETS[o.language] || ALPHABETS.spanish;
  LANG_NOW = ALPHABETS[o.language] ? o.language : 'spanish';
  const letters = lang.letters.split(' ');
  const special = new Set(lang.special.split(' ').filter(Boolean));
  const pages = [];
  if (o.chart !== false) {
    const pg = new Page(paper, `The ${lang.name} alphabet`, { subtitle: `${lang.native}: ${letters.length} letters.${special.size ? ' The starred letters are not in the English alphabet.' : ''}`, noName: true });
    const extraH = lang.extra ? 24 : 0;
    const cols = letters.length > 30 ? 6 : 5;
    const rows = Math.ceil(letters.length / cols);
    const cw = pg.width / cols, ch = Math.min(40, (pg.room - extraH - 4) / rows);
    letters.forEach((L, i) => {
      const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch;
      const c = i % PALETTE.length;
      const sp = special.has(L);
      pg.add(`<rect x="${x + 1.5}" y="${y + 1.5}" width="${cw - 3}" height="${ch - 3}" rx="6" fill="${sp ? '#fff6e0' : TINTS[c]}" stroke="${sp ? '#ffb938' : PALETTE[c]}" stroke-width="${sp ? 1 : 0.6}"/>`);
      const text = `${L.length > 1 ? L[0] + L.slice(1).toLowerCase() : L} ${lowerOf(L)}`;
      pg.add(`<text x="${x + cw / 2}" y="${y + ch * 0.64}" text-anchor="middle" font-family="${LETTER_FONT}" font-weight="800" font-size="${fitFont(text, ch * 0.42, cw - 8, 0.62).toFixed(2)}" fill="${sp ? '#e07b00' : INK}">${esc(text)}</text>`);
      if (sp) pg.add(`<path d="${starPath(x + cw - 7, y + 7, 3.2, 0.45)}" fill="#ffc93c"/>`);
    });
    if (lang.extra) {
      const y = pg.y + rows * ch + 4;
      pg.add(`<rect x="${pg.left}" y="${y}" width="${pg.width}" height="${extraH - 4}" rx="6" fill="#fff" stroke="#d9d4ec" stroke-width="0.5"/>`);
      pg.add(`<text x="${pg.left + 5}" y="${y + 7}" font-family="${FONT}" font-weight="800" font-size="3.8" fill="${SOFT}">${lang.extraLabel || (lang.name === 'Swahili' ? 'Letter pairs that make one sound' : 'Letters with accents')}</text>`);
      pg.add(`<text x="${pg.left + 5}" y="${y + 16}" font-family="${LETTER_FONT}" font-weight="800" font-size="7" letter-spacing="1.5" fill="${INK}">${esc(lang.extra.split(' ').join('   '))}</text>`);
    }
    pages.push(pg.svg());
  }
  if (o.trace !== false) {
    let pg = null;
    const rowH = 30;
    letters.forEach((L, i) => {
      if (!pg || pg.room < rowH) {
        if (pg) pages.push(pg.svg());
        pg = new Page(paper, `Write the ${lang.name} letters`, { subtitle: 'Trace the letters, then write them on your own.' });
      }
      const y = pg.y;
      const size = 16;
      pg.guides(y + 4, size, pg.left, pg.right, false);
      const base = y + 4 + size;
      const pair = L.length > 1 ? `${L[0]}${L.slice(1).toLowerCase()} ${lowerOf(L)}` : `${L}${lowerOf(L)}`;
      const unit = (pair.length + 0.4) * size * 0.62;
      let x = pg.left + 2, n = 0;
      while (x + unit < pg.right && n < 5) {
        pg.add(`<text x="${x}" y="${base}" font-family="${LETTER_FONT}" font-weight="700" font-size="${size * 1.32}" ${n === 0 ? `fill="${INK}"` : 'fill="none" stroke="#9a93b8" stroke-width="0.35" stroke-dasharray="0.9 0.9"'}>${esc(pair)}</text>`);
        x += unit + 6; n++;
      }
      pg.y += rowH;
    });
    pages.push(pg.svg());
  }
  if (!pages.length) pages.push(new Page(paper, lang.name, { subtitle: 'Tick at least one page.', noName: true }).svg());
  return pages;
}

// ================================================================ word families
const FAMILIES = {
  at: [['cat', 'img/cat.webp'], ['hat', 'img/hat.webp'], ['bat', '🦇'], ['rat', '🐀'], ['mat', ''], ['sat', '']],
  an: [['fan', '🪭'], ['van', '🚐'], ['pan', '🍳'], ['man', '👨'], ['can', '🥫'], ['ran', '']],
  ig: [['pig', 'img/pig.webp'], ['wig', ''], ['dig', '⛏️'], ['big', ''], ['fig', ''], ['jig', '']],
  op: [['mop', '🧹'], ['top', ''], ['hop', '🐇'], ['pop', 'img/popper.webp'], ['shop', '🏪'], ['stop', '🛑']],
  ug: [['bug', '🐛'], ['mug', '☕'], ['rug', ''], ['hug', '🤗'], ['jug', '🏺'], ['slug', '🐌']],
  en: [['hen', '🐔'], ['pen', '🖊️'], ['ten', '🔟'], ['men', ''], ['den', ''], ['Ben', '']],
  ot: [['pot', '🍲'], ['dot', ''], ['hot', '🔥'], ['cot', '🛏️'], ['not', ''], ['lot', '']],
  ing: [['king', '🤴'], ['ring', '💍'], ['sing', '🎤'], ['wing', '🪽'], ['swing', ''], ['thing', '']],
  ake: [['cake', 'img/cake.webp'], ['snake', '🐍'], ['lake', '🏞️'], ['rake', ''], ['bake', ''], ['make', '']],
  ell: [['bell', '🔔'], ['shell', '🐚'], ['well', ''], ['smell', '👃'], ['yell', ''], ['spell', '']],
};

function makeFamilies(o, paper) {
  const rand = rng(+o.seed || 1);
  const keys = o.family === 'all' ? Object.keys(FAMILIES) : [FAMILIES[o.family] ? o.family : 'at'];
  return keys.map((fam, fi) => {
    const words = FAMILIES[fam];
    const c = fi % PALETTE.length;
    const pg = new Page(paper, `The -${fam} family`, { subtitle: `Every word in this house ends with -${fam}. Write the first letter in each box.` });
    // The house
    const hx = pg.left + 10, hw = pg.width - 20, roofH = 34;
    const y0 = pg.y;
    pg.add(`<path d="M${hx - 6} ${y0 + roofH} L${hx + hw / 2} ${y0} L${hx + hw + 6} ${y0 + roofH} Z" fill="${PALETTE[c]}"/>`);
    pg.add(`<text x="${hx + hw / 2}" y="${y0 + roofH - 8}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="16" fill="#fff">-${fam}</text>`);
    const bodyH = 128;
    pg.add(`<rect x="${hx}" y="${y0 + roofH}" width="${hw}" height="${bodyH}" fill="${TINTS[c]}" stroke="${PALETTE[c]}" stroke-width="1"/>`);
    const cols = 2, rows = 3, ww = (hw - 18) / cols, wh = (bodyH - 16) / rows;
    words.forEach(([w, src], i) => {
      const x = hx + 6 + (i % cols) * (ww + 6), y = y0 + roofH + 5 + Math.floor(i / cols) * (wh + 3);
      pg.add(`<rect x="${x}" y="${y}" width="${ww}" height="${wh}" rx="4" fill="#fff" stroke="${INK}" stroke-width="0.5"/>`);
      if (src) pg.add(pic(src, x + 16, y + wh / 2, Math.min(24, wh - 8)));
      else {
        // No picture yet: the child draws one.
        pg.add(`<rect x="${x + 4}" y="${y + 4}" width="24" height="${wh - 8}" rx="3" fill="#fff" stroke="#b9b3d6" stroke-width="0.45" stroke-dasharray="1.6 1.2"/><text x="${x + 16}" y="${y + wh / 2 + 1.4}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.2" fill="${SOFT}">draw it</text>`);
      }
      const size = 11;
      const bx = x + 32;
      const first = w.length - fam.length;
      pg.add(`<rect x="${bx}" y="${y + wh / 2 - size * 0.7}" width="${size * 1.2 * first}" height="${size * 1.25}" rx="2" fill="${TINTS[c]}" stroke="${PALETTE[c]}" stroke-width="0.6"/>`);
      pg.add(drawText(fam, bx + size * 1.2 * first + 3, y + wh / 2 - size * 0.62 - (fam === 'ake' || fam === 'ell' ? 0 : 0), size, 'model'));
    });
    pg.y = y0 + roofH + bodyH + 8;
    // Circle the family words
    const all = Object.entries(FAMILIES).filter(([f]) => f !== fam).flatMap(([, ws]) => ws.map(([w]) => w));
    const mix = shuffle([...shuffle(words.map(([w]) => w), rand).slice(0, 3), ...shuffle(all, rand).slice(0, 5)], rand);
    pg.add(`<text x="${pg.left}" y="${pg.y + 4}" font-family="${FONT}" font-weight="800" font-size="4.6" fill="${INK}">Draw a ring around the -${fam} words:</text>`);
    const cw = pg.width / mix.length;
    mix.forEach((w, i) => pg.add(`<text x="${pg.left + i * cw + cw / 2}" y="${pg.y + 15}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="6.5" fill="${INK}">${w}</text>`));
    pg.y += 24;
    pg.add(`<text x="${pg.left}" y="${pg.y + 4}" font-family="${FONT}" font-weight="800" font-size="4.6" fill="${INK}">Can you think of more -${fam} words? Write them here:</text>`);
    pg.y += 8;
    while (pg.room >= rowHeight(11)) { pg.guides(pg.y, 11, pg.left, pg.right, false); pg.y += rowHeight(11) * 0.9; }
    return pg.svg();
  });
}

// ================================================================ rhyming
const RHYMES = [
  [['cat', 'img/cat.webp'], ['hat', 'img/hat.webp']], [['dog', 'img/dog.webp'], ['log', '🪵']], [['bee', '🐝'], ['tree', '🌳']],
  [['star', 'img/star.webp'], ['car', '🚗']], [['cake', 'img/cake.webp'], ['snake', '🐍']], [['moon', '🌙'], ['spoon', '🥄']],
  [['fish', 'img/fish.webp'], ['dish', '🍽️']], [['goat', '🐐'], ['boat', '⛵']], [['bear', 'img/bear.webp'], ['chair', '🪑']],
  [['mouse', '🐭'], ['house', '🏠']], [['king', '🤴'], ['ring', '💍']], [['sock', '🧦'], ['clock', '⏰']],
  [['pen', '🖊️'], ['hen', '🐔']], [['fox', '🦊'], ['box', '📦']], [['nose', '👃'], ['rose', 'img/rose.webp']],
  [['bell', '🔔'], ['shell', '🐚']], [['whale', '🐋'], ['snail', '🐌']], [['kite', '🪁'], ['light', '💡']],
  [['ball', '⚽'], ['wall', '🧱']], [['tie', '👔'], ['pie', '🥧']],
];

function makeRhyming(o, paper) {
  const rand = rng(+o.seed || 1);
  const pairs = shuffle(RHYMES, rand);
  const kind = o.kind === 'circle' ? 'circle' : 'match';
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const pg = new Page(paper, answers ? 'Rhyming: answers' : kind === 'match' ? 'Match the rhymes' : 'Which one rhymes?', { subtitle: answers ? 'Answer key for grown-ups.' : kind === 'match' ? 'Say each word. Draw a line to the picture that rhymes.' : 'Say the first word, then draw a ring around the picture that rhymes with it.', noName: answers });
    if (kind === 'match') {
      const n = 6, set = pairs.slice(0, n);
      const order = shuffle([...Array(n).keys()], rand);
      const rowH = (pg.room - 4) / n, colW = 64;
      const lx = pg.left + 4, rx = pg.right - colW - 4;
      const cell = ([w, src], x, y, c) => {
        pg.add(`<rect x="${x}" y="${y + 3}" width="${colW}" height="${rowH - 6}" rx="7" fill="${TINTS[c]}" stroke="${PALETTE[c]}" stroke-width="0.6"/>`);
        pg.add(pic(src, x + 18, y + rowH / 2, Math.min(28, rowH - 12)));
        pg.add(`<text x="${x + 36}" y="${y + rowH / 2 + 2.4}" font-family="${TITLE_FONT}" font-weight="800" font-size="7" fill="${INK}">${w}</text>`);
      };
      set.forEach(([a], i) => cell(a, lx, pg.y + i * rowH, i % PALETTE.length));
      order.forEach((pi, j) => cell(set[pi][1], rx, pg.y + j * rowH, (pi + 3) % PALETTE.length));
      for (let i = 0; i < n; i++) pg.add(`<circle cx="${lx + colW + 4}" cy="${pg.y + i * rowH + rowH / 2}" r="1.6" fill="${INK}"/><circle cx="${rx - 4}" cy="${pg.y + i * rowH + rowH / 2}" r="1.6" fill="${INK}"/>`);
      if (answers) set.forEach((_, i) => { const j = order.indexOf(i); pg.add(`<line x1="${lx + colW + 4}" y1="${pg.y + i * rowH + rowH / 2}" x2="${rx - 4}" y2="${pg.y + j * rowH + rowH / 2}" stroke="#e0457b" stroke-width="0.8"/>`); });
    } else {
      const n = 6, rowH = (pg.room - 4) / n;
      pairs.slice(0, n).forEach(([a, b], i) => {
        const y = pg.y + i * rowH, c = i % PALETTE.length;
        const wrong = shuffle(pairs.filter((p) => p[0] !== a).flat().filter(([w]) => w !== b[0]), rand).slice(0, 2);
        const opts = shuffle([b, ...wrong], rand);
        pg.add(`<rect x="${pg.left}" y="${y + 2}" width="${pg.width}" height="${rowH - 4}" rx="7" fill="${TINTS[c]}"/>`);
        pg.add(pic(a[1], pg.left + 18, y + rowH / 2 - 3, Math.min(26, rowH - 16)));
        pg.add(`<text x="${pg.left + 18}" y="${y + rowH - 6}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="5.5" fill="${INK}">${a[0]}</text>`);
        pg.add(`<text x="${pg.left + 40}" y="${y + rowH / 2 + 2}" font-family="${TITLE_FONT}" font-weight="800" font-size="8" fill="${PALETTE[c]}">→</text>`);
        const ow = (pg.width - 56) / 3;
        opts.forEach(([w, src], k) => {
          const cx = pg.left + 54 + k * ow + ow / 2;
          if (answers && w === b[0]) pg.add(`<circle cx="${cx}" cy="${y + rowH / 2 - 2}" r="${Math.min(ow, rowH) * 0.42}" fill="none" stroke="#e0457b" stroke-width="0.9"/>`);
          pg.add(pic(src, cx, y + rowH / 2 - 4, Math.min(24, rowH - 16)));
          pg.add(`<text x="${cx}" y="${y + rowH - 6}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="4.6" fill="${SOFT}">${w}</text>`);
        });
      });
    }
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ number lines
function numberLine(pg, x, y, w, from, to, step, blanks, marks) {
  const n = Math.round((to - from) / step);
  const dx = w / n;
  pg.add(`<line x1="${x - 3}" x2="${x + w + 3}" y1="${y}" y2="${y}" stroke="${INK}" stroke-width="0.7"/>`);
  pg.add(`<path d="M${x + w + 5} ${y} l-3 -1.8 l0 3.6 Z M${x - 5} ${y} l3 -1.8 l0 3.6 Z" fill="${INK}"/>`);
  for (let i = 0; i <= n; i++) {
    const v = from + i * step, tx = x + i * dx;
    pg.add(`<line x1="${tx}" x2="${tx}" y1="${y - 2.2}" y2="${y + 2.2}" stroke="${INK}" stroke-width="0.5"/>`);
    if (blanks.has(v)) pg.add(`<rect x="${tx - 5}" y="${y + 3.6}" width="10" height="7.8" rx="1.6" fill="#fff" stroke="${marks && marks.answers ? '#e0457b' : '#9a93b8'}" stroke-width="0.45"/>` + (marks && marks.answers ? `<text x="${tx}" y="${y + 9.4}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${n > 12 ? 4 : 5}" fill="#e0457b">${v}</text>` : ''));
    else pg.add(`<text x="${tx}" y="${y + 9.4}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${n > 12 ? 4 : 5}" fill="${INK}">${v}</text>`);
  }
  return (v) => x + ((v - from) / step) * dx;
}

function makeNumberLines(o, paper) {
  const rand = rng(+o.seed || 1);
  const kind = o.kind || 'missing';
  const range = +o.range || 10;
  const pages = [];
  const items = [];
  for (let i = 0; i < 8; i++) {
    if (kind === 'missing') {
      const step = range === 100 ? 10 : 1;
      const n = range === 100 ? 10 : range;
      const vals = [...Array(n + 1)].map((_, k) => k * step);
      const blanks = new Set(shuffle(vals, rand).slice(0, Math.max(3, Math.round(n / 3))));
      items.push({ blanks });
    } else {
      const max = range === 100 ? 20 : range;
      let a = 1 + Math.floor(rand() * (max - 2)), b = 1 + Math.floor(rand() * Math.min(6, max - a));
      if (kind === 'sub') { a = 3 + Math.floor(rand() * (max - 3)); b = 1 + Math.floor(rand() * Math.min(6, a - 1)); }
      items.push({ a, b, max });
    }
  }
  const sub = { missing: 'Count along the line and fill in the missing numbers.', add: 'Start on the first number. Jump forward, then write the answer.', sub: 'Start on the first number. Jump back, then write the answer.' }[kind];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const title = { missing: 'Number lines: missing numbers', add: 'Adding on a number line', sub: 'Taking away on a number line' }[kind];
    const pg = new Page(paper, answers ? `${title}: answers` : title, { subtitle: answers ? 'Answer key for grown-ups.' : sub, noName: answers });
    const rowH = (pg.room - 2) / items.length;
    items.forEach((it, i) => {
      const y = pg.y + i * rowH;
      if (kind === 'missing') {
        const step = range === 100 ? 10 : 1;
        numberLine(pg, pg.left + 6, y + rowH * 0.45, pg.width - 12, 0, range, step, it.blanks, { answers });
      } else {
        const eq = `${it.a} ${kind === 'add' ? '+' : '−'} ${it.b} =`;
        const ans = kind === 'add' ? it.a + it.b : it.a - it.b;
        pg.add(`<text x="${pg.left}" y="${y + 7}" font-family="${TITLE_FONT}" font-weight="800" font-size="6.5" fill="${INK}">${eq}</text>`);
        pg.add(`<rect x="${pg.left + eq.length * 3.4 + 2}" y="${y + 1.5}" width="11" height="7.5" rx="1.6" fill="#fff" stroke="${answers ? '#e0457b' : '#9a93b8'}" stroke-width="0.5"/>`);
        if (answers) pg.add(`<text x="${pg.left + eq.length * 3.4 + 7.5}" y="${y + 7}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="6" fill="#e0457b">${ans}</text>`);
        const at = numberLine(pg, pg.left + 6, y + rowH * 0.66, pg.width - 12, 0, it.max, 1, new Set(), null);
        pg.add(`<circle cx="${at(it.a)}" cy="${y + rowH * 0.66}" r="1.6" fill="#3fbf7f"/>`);
        if (answers) {
          const dir = kind === 'add' ? 1 : -1;
          for (let k = 0; k < it.b; k++) {
            const x1 = at(it.a + dir * k), x2 = at(it.a + dir * (k + 1)), yy = y + rowH * 0.66;
            pg.add(`<path d="M${x1} ${yy - 1.5} Q${(x1 + x2) / 2} ${yy - 9} ${x2} ${yy - 1.5}" fill="none" stroke="#e0457b" stroke-width="0.6"/>`);
          }
        }
      }
    });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ fractions
const FRAC_LEVELS = { halves: [[1, 2]], quarters: [[1, 2], [1, 4], [2, 4], [3, 4]], thirds: [[1, 3], [2, 3]], mix: [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 8], [3, 8], [5, 8]] };

function fracText(pg, cx, y, n, d, fs, colour = INK) {
  pg.add(`<text x="${cx}" y="${y}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${fs}" fill="${colour}">${n}</text>`);
  pg.add(`<line x1="${cx - fs * 0.45}" x2="${cx + fs * 0.45}" y1="${y + fs * 0.25}" y2="${y + fs * 0.25}" stroke="${colour}" stroke-width="${fs * 0.08}"/>`);
  pg.add(`<text x="${cx}" y="${y + fs * 1.1}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${fs}" fill="${colour}">${d}</text>`);
}

function fracShape(pg, kind, cx, cy, r, d, shaded, colour, equal = true) {
  let s = '';
  const st = `stroke="${INK}" stroke-width="0.6"`;
  if (kind === 'circle') {
    for (let k = 0; k < d; k++) {
      const a1 = -Math.PI / 2 + (k * 2 * Math.PI) / d, a2 = -Math.PI / 2 + ((k + 1) * 2 * Math.PI) / d;
      const big = a2 - a1 > Math.PI ? 1 : 0;
      s += `<path d="M${cx} ${cy} L${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)} A${r} ${r} 0 ${big} 1 ${cx + r * Math.cos(a2)} ${cy + r * Math.sin(a2)} Z" fill="${shaded.has(k) ? colour : '#fff'}" ${st}/>`;
    }
    if (d === 1) s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${shaded.has(0) ? colour : '#fff'}" ${st}/>`;
  } else {
    const w = kind === 'bar' ? r * 2.6 : r * 1.9, h = kind === 'bar' ? r * 0.9 : r * 1.9;
    const x0 = cx - w / 2, y0 = cy - h / 2;
    // unequal parts for "is it fair?"
    const cuts = [...Array(d + 1)].map((_, k) => (equal ? k / d : Math.min(1, Math.max(0, k / d + (k > 0 && k < d ? (k % 2 ? 0.17 : -0.12) : 0)))));
    for (let k = 0; k < d; k++) s += `<rect x="${x0 + cuts[k] * w}" y="${y0}" width="${(cuts[k + 1] - cuts[k]) * w}" height="${h}" fill="${shaded.has(k) ? colour : '#fff'}" ${st}/>`;
  }
  pg.add(s);
}

function makeFractions(o, paper) {
  const rand = rng(+o.seed || 1);
  const kind = o.kind || 'colour';
  const fr = FRAC_LEVELS[o.level] || FRAC_LEVELS.quarters;
  const items = [];
  for (let i = 0; i < 12; i++) {
    const [n, d] = fr[Math.floor(rand() * fr.length)];
    const shape = ['circle', 'square', 'bar'][Math.floor(rand() * 3)];
    const equal = kind !== 'fair' || rand() < 0.5;
    items.push({ n, d, shape: kind === 'fair' ? (rand() < 0.5 ? 'square' : 'bar') : shape, equal, set: [4, 6, 8, 12].filter((m) => m % d === 0)[Math.floor(rand() * 2)] || d * 2, art: ['apple', 'strawberry', 'star', 'cupcake', 'orange', 'heart', 'chick', 'cookie'][i % 8] });
  }
  const titles = { colour: 'Colour the fraction', name: 'What fraction is shaded?', fair: 'Equal parts or not?', set: 'Fractions of a group' };
  const subs = { colour: 'Colour in the fraction shown under each shape.', name: 'Count the shaded parts and the parts in all. Write the fraction.', fair: 'Is each shape cut into equal parts? Tick yes or no.', set: 'Colour or ring the right number of pictures.' };
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const pg = new Page(paper, answers ? `${titles[kind]}: answers` : titles[kind], { subtitle: answers ? 'Answer key for grown-ups.' : subs[kind], noName: answers });
    const cols = 3, rows = 4, cw = pg.width / cols, ch = (pg.room - 2) / rows;
    items.forEach((it, i) => {
      const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch;
      const c = PALETTE[i % PALETTE.length];
      pg.add(`<rect x="${x + 1.5}" y="${y + 1.5}" width="${cw - 3}" height="${ch - 3}" rx="6" fill="#fff" stroke="#e3def3" stroke-width="0.5"/>`);
      const r = Math.min(cw, ch) * 0.3, cx = x + cw / 2, cy = y + ch * 0.42;
      if (kind === 'set') {
        const m = it.set, want = (m / it.d) * it.n;
        const colsA = Math.min(6, m), rowsA = Math.ceil(m / colsA), s = Math.min((cw - 10) / colsA, (ch * 0.55) / rowsA);
        for (let k = 0; k < m; k++) {
          const px = cx - ((colsA - 1) * s) / 2 + (k % colsA) * s, py = y + 8 + s / 2 + Math.floor(k / colsA) * s;
          if (answers && k < want) pg.add(`<circle cx="${px}" cy="${py}" r="${s * 0.5}" fill="#ffe0ea"/>`);
          pg.add(pic(ART(it.art), px, py, s * 0.86));
        }
        pg.add(`<text x="${cx - 6}" y="${y + ch - 9}" text-anchor="end" font-family="${FONT}" font-weight="800" font-size="4.4" fill="${INK}">Colour</text>`);
        fracText(pg, cx + 2, y + ch - 13, it.n, it.d, 5.2);
        pg.add(`<text x="${cx + 8}" y="${y + ch - 9}" font-family="${FONT}" font-weight="800" font-size="4.4" fill="${INK}">of them</text>`);
        return;
      }
      const shaded = new Set();
      if (kind === 'name' || answers) for (let k = 0; k < it.n; k++) shaded.add(k);
      if (kind === 'fair') shaded.clear();
      fracShape(pg, it.shape, cx, cy, r, it.d, shaded, kind === 'name' ? '#8ecbff' : '#ffc6d9', it.equal);
      if (kind === 'colour') fracText(pg, cx, y + ch - 12, it.n, it.d, 6);
      else if (kind === 'name') {
        if (answers) fracText(pg, cx, y + ch - 12, it.n, it.d, 6, '#e0457b');
        else pg.add(`<rect x="${cx - 6}" y="${y + ch - 20}" width="12" height="16" rx="2" fill="#fff" stroke="#9a93b8" stroke-width="0.5"/><line x1="${cx - 4}" x2="${cx + 4}" y1="${y + ch - 12}" y2="${y + ch - 12}" stroke="#9a93b8" stroke-width="0.5"/>`);
      } else {
        ['yes', 'no'].forEach((t, k) => {
          const bx = cx - 18 + k * 20;
          const tick = answers && ((t === 'yes') === it.equal);
          pg.add(`<rect x="${bx}" y="${y + ch - 13}" width="5" height="5" rx="1" fill="${tick ? '#e0457b' : '#fff'}" stroke="${INK}" stroke-width="0.5"/><text x="${bx + 7}" y="${y + ch - 9}" font-family="${FONT}" font-weight="800" font-size="4.4" fill="${INK}">${t}</text>`);
        });
      }
    });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ colour by number
const PIXEL = {
  heart: { name: 'a heart', colours: { '.': ['light blue', '#cfe8ff'], R: ['red', '#ff4d6d'], P: ['pink', '#ffb3c6'] },
    rows: ['............', '..RR....RR..', '.RPRR..RRRR.', 'RPRRRRRRRRRR', 'RRRRRRRRRRRR', 'RRRRRRRRRRRR', '.RRRRRRRRRR.', '..RRRRRRRR..', '...RRRRRR...', '....RRRR....', '.....RR.....', '............'] },
  apple: { name: 'an apple', colours: { '.': ['yellow', '#fff3b0'], R: ['red', '#ff4d4d'], G: ['green', '#4caf50'], B: ['brown', '#8d5524'], P: ['pink', '#ffb3b3'] },
    rows: ['......B.....', '......BGG...', '.....BGGG...', '..RRRRRRRR..', '.RRRRRRRRRR.', 'RRPRRRRRRRRR', 'RRPRRRRRRRRR', 'RRRRRRRRRRRR', 'RRRRRRRRRRRR', '.RRRRRRRRRR.', '..RRRRRRRR..', '...RR..RR...'] },
  house: { name: 'a house', colours: { '.': ['light blue', '#cfe8ff'], R: ['red', '#ff4d4d'], Y: ['yellow', '#ffd23f'], B: ['brown', '#8d5524'], W: ['blue', '#3a86ff'], G: ['green', '#4caf50'] },
    rows: ['.....RR.....', '....RRRR....', '...RRRRRR...', '..RRRRRRRR..', '.RRRRRRRRRR.', 'RRRRRRRRRRRR', '.YYYYYYYYYY.', '.YWWYYYYWWY.', '.YWWYBBYWWY.', '.YYYYBBYYYY.', '.YYYYBBYYYY.', 'GGGGGGGGGGGG'] },
  fish: { name: 'a fish', colours: { '.': ['blue', '#8ecbff'], O: ['orange', '#ff9f1c'], K: ['black', '#2d2350'], Y: ['yellow', '#ffd23f'] },
    rows: ['............', '............', '...OOOO...O.', '..OOYOOO.OO.', '.OKOYOYOOOO.', 'OOOOYOYOOOO.', 'OOOOYOYOOOO.', '.OOOYOYOOOO.', '..OOYOOO.OO.', '...OOOO...O.', '............', '............'] },
  flower: { name: 'a flower', colours: { '.': ['light blue', '#cfe8ff'], P: ['pink', '#ff70a6'], Y: ['yellow', '#ffd23f'], G: ['green', '#4caf50'] },
    rows: ['....PPPP....', '...PPPPPP...', '..PPPYYPPP..', '..PPYYYYPP..', '..PPYYYYPP..', '..PPPYYPPP..', '...PPPPPP...', '....PPPP....', '.....GG.....', '..GG.GG.....', '...GGGG.GG..', '.....GGGG...'] },
  star: { name: 'a star', colours: { '.': ['dark blue', '#3a3f8f'], Y: ['yellow', '#ffd23f'], O: ['orange', '#ff9f1c'] },
    rows: ['.....YY.....', '.....YY.....', '....YYYY....', '....YOOY....', 'YYYYYOOYYYYY', '.YYYYYYYYYY.', '..YYYYYYYY..', '...YYYYYY...', '..YYYYYYYY..', '..YYY..YYY..', '.YYY....YYY.', '.YY......YY.'] },
  butterfly: { name: 'a butterfly', colours: { '.': ['light blue', '#cfe8ff'], P: ['purple', '#b06cff'], Y: ['yellow', '#ffd23f'], K: ['black', '#2d2350'] },
    rows: ['............', '.PP......PP.', 'PPPP....PPPP', 'PPYPP..PPYPP', 'PPPPPKKPPPPP', '.PPPPKKPPPP.', '..PPPKKPPP..', '.PPPPKKPPPP.', 'PPYPPKKPPYPP', 'PPPP.KK.PPPP', '.PP......PP.', '............'] },
  tree: { name: 'an apple tree', colours: { '.': ['light blue', '#cfe8ff'], G: ['green', '#3fbf60'], R: ['red', '#ff4d4d'], B: ['brown', '#8d5524'], L: ['light green', '#b6e3a8'] },
    rows: ['....GGGG....', '..GGGGGGGG..', '.GGGGRGGGGG.', '.GGGGGGGRGG.', 'GGRGGGGGGGGG', '.GGGGGGGGGG.', '..GGGGRGGG..', '.....BB.....', '.....BB.....', '.....BB.....', '....BBBB....', 'LLLLLLLLLLLL'] },
  rocket: { name: 'a rocket', colours: { '.': ['dark blue', '#3a3f8f'], W: ['white', '#ffffff'], R: ['red', '#ff4d4d'], B: ['light blue', '#8ecbff'], O: ['orange', '#ff9f1c'] },
    rows: ['.....RR.....', '....RWWR....', '....WWWW....', '....WBBW....', '....WBBW....', '....WWWW....', '...RWWWWR...', '..RRWWWWRR..', '..RR.OO.RR..', '.....OO.....', '....O..O....', '............'] },
  duck: { name: 'a duck', colours: { '.': ['light blue', '#cfe8ff'], Y: ['yellow', '#ffd23f'], O: ['orange', '#ff9f1c'], K: ['black', '#2d2350'], B: ['blue', '#3a86ff'] },
    rows: ['............', '...YYY......', '..YYKYY.....', '..YYYYYOO...', '...YYY......', '..YYYYY.....', '.YYYYYYYYYY.', 'YYYYYYYYYYY.', 'YYYYYYYYYY..', '.YYYYYYYY...', 'BBBBBBBBBBBB', 'BBBBBBBBBBBB'] },
  cat: { name: 'a cat', colours: { '.': ['green', '#a5d6a7'], O: ['orange', '#ff9f1c'], K: ['black', '#2d2350'], P: ['pink', '#ff8fab'] },
    rows: ['.O........O.', '.OO......OO.', '.OOOOOOOOOO.', 'OOOOOOOOOOOO', 'OOKKOOOOKKOO', 'OOKKOOOOKKOO', 'OOOOOPPOOOOO', 'OOOOOOOOOOOO', '.OOOKOOKOOO.', '..OOOKKOOO..', '...OOOOOO...', '............'] },
  rainbow: { name: 'a rainbow', colours: { '.': ['light blue', '#cfe8ff'], R: ['red', '#ff4d4d'], O: ['orange', '#ff9f1c'], Y: ['yellow', '#ffd23f'], G: ['green', '#4caf50'], B: ['blue', '#3a86ff'], W: ['white', '#ffffff'] },
    rows: ['............', '...RRRRRR...', '..RROOOORR..', '.RROYYYYORR.', '.ROYGGGGYOR.', 'ROYGBBBBGYOR', 'ROYGB..BGYOR', 'ROYGB..BGYOR', 'WWWGB..BGWWW', 'WWWWW..WWWWW', '............', '............'] },
};

function makeColourByNumber(o, paper) {
  const rand = rng(+o.seed || 1);
  const key = PIXEL[o.picture] ? o.picture : Object.keys(PIXEL)[Math.floor(rand() * Object.keys(PIXEL).length)];
  const art = PIXEL[key];
  const chars = Object.keys(art.colours);
  const num = Object.fromEntries(chars.map((c, i) => [c, i + 1]));
  const mode = o.mode || 'numbers';
  const label = (n) => {
    if (mode === 'add') { const a = Math.floor(rand() * (n + 1)); return `${a}+${n - a}`; }
    if (mode === 'sub') { const b = 1 + Math.floor(rand() * 5); return `${n + b}−${b}`; }
    return String(n);
  };
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const pg = new Page(paper, answers ? 'Colour by number: answer' : mode === 'numbers' ? 'Colour by number' : 'Colour by sums', { subtitle: answers ? `It is ${art.name}!` : mode === 'numbers' ? 'Colour each square with the colour for its number. What picture appears?' : 'Work out each sum. Colour the square with the colour for the answer.', noName: answers });
    // Colour key
    // The key never gets cut off: long lists wrap onto a second row and the words shrink to fit.
    const perRow = chars.length <= 4 ? chars.length : Math.ceil(chars.length / 2), kw = pg.width / perRow;
    chars.forEach((c, i) => {
      const x = pg.left + (i % perRow) * kw, y = pg.y + Math.floor(i / perRow) * 10;
      const t = `${num[c]} = ${art.colours[c][0]}`;
      pg.add(`<rect x="${x}" y="${y}" width="8" height="8" rx="2" fill="${art.colours[c][1]}" stroke="${INK}" stroke-width="0.4"/>`);
      pg.add(`<text x="${x + 10}" y="${y + 5.8}" font-family="${FONT}" font-weight="800" font-size="${fitFont(t, 4.2, kw - 12, 0.52).toFixed(2)}" fill="${INK}">${t}</text>`);
    });
    pg.y += Math.ceil(chars.length / perRow) * 10 + 4;
    const R = art.rows.length, C = art.rows[0].length;
    const cell = Math.min(pg.width / C, (pg.room - 2) / R);
    const gx = pg.left + (pg.width - cell * C) / 2;
    art.rows.forEach((row, r) => row.split('').forEach((ch, q) => {
      const x = gx + q * cell, y = pg.y + r * cell;
      pg.add(`<rect x="${x}" y="${y}" width="${cell}" height="${cell}" fill="${answers ? art.colours[ch][1] : '#fff'}" stroke="#9a93b8" stroke-width="0.35"/>`);
      if (!answers) {
        const t = label(num[ch]);
        pg.add(`<text x="${x + cell / 2}" y="${y + cell / 2 + (t.length > 2 ? 1.3 : 1.8)}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${t.length > 2 ? Math.min(3.8, cell * 0.26) : Math.min(5.5, cell * 0.36)}" fill="${INK}">${t}</text>`);
      }
    }));
    pg.add(`<rect x="${gx}" y="${pg.y}" width="${cell * C}" height="${cell * R}" fill="none" stroke="${INK}" stroke-width="0.8"/>`);
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ spot the difference
function sceneItems(rand) {
  const pool = shuffle(PAINTED.filter(([n]) => !['Rainbow', 'Sun', 'Nest'].includes(n)), rand);
  const slots = [];
  for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) slots.push([0.1 + c * 0.2 + (rand() - 0.5) * 0.06, 0.52 + r * 0.26 + (rand() - 0.5) * 0.05]);
  const mixed = shuffle(slots, rand);
  const items = mixed.slice(0, 7).map(([x, y], i) => ({ x, y, s: 0.14 + rand() * 0.05, src: pool[i][1], flip: false }));
  items.free = mixed.slice(7);
  return items;
}

function drawScene(pg, x, y, w, h, sc, id) {
  pg.add(`<defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6"/></clipPath></defs>`);
  let s = `<g clip-path="url(#${id})"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#dff1ff"/>`;
  s += `<path d="M${x} ${y + h * 0.42} Q${x + w * 0.3} ${y + h * 0.34} ${x + w * 0.6} ${y + h * 0.42} T${x + w} ${y + h * 0.4} L${x + w} ${y + h} L${x} ${y + h} Z" fill="#c8ecb4"/>`;
  if (sc.sun) s += `<image href="img/sun.webp" x="${x + w * 0.8}" y="${y + h * 0.03}" width="${h * 0.24}" height="${h * 0.24}"/>`;
  sc.clouds.forEach(([cx, cy]) => { s += `<g fill="#fff"><ellipse cx="${x + cx * w}" cy="${y + cy * h}" rx="${w * 0.06}" ry="${h * 0.045}"/><ellipse cx="${x + cx * w + w * 0.04}" cy="${y + cy * h - h * 0.03}" rx="${w * 0.045}" ry="${h * 0.045}"/></g>`; });
  if (sc.rainbow) s += `<image href="img/rainbow.webp" x="${x + w * 0.03}" y="${y + h * 0.02}" width="${h * 0.3}" height="${h * 0.3}"/>`;
  sc.items.forEach((it) => {
    const size = it.s * w, ix = x + it.x * w - size / 2, iy = y + it.y * h - size / 2;
    s += it.flip ? `<image href="${it.src}" x="${-(ix + size)}" y="${iy}" width="${size}" height="${size}" transform="scale(-1 1)"/>` : `<image href="${it.src}" x="${ix}" y="${iy}" width="${size}" height="${size}"/>`;
  });
  s += `</g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="none" stroke="${INK}" stroke-width="0.8"/>`;
  pg.add(s);
}

function makeSpotDiff(o, paper) {
  const rand = rng(+o.seed || 1);
  const k = { easy: 3, medium: 5, hard: 7 }[o.level] || 5;
  const a = { items: sceneItems(rand), sun: true, rainbow: rand() < 0.5, clouds: [[0.3, 0.12], [0.55, 0.2]] };
  const free = a.items.free;
  const b = JSON.parse(JSON.stringify(a));
  const spots = [];
  const kinds = shuffle(['remove', 'swap', 'grow', 'add', 'remove', 'swap', 'shrink', 'add'], rand);
  const order = shuffle([...b.items.keys()], rand);
  const unused = shuffle(PAINTED.filter(([, s]) => !a.items.some((it) => it.src === s) && !/sun|rainbow|nest/.test(s)), rand);
  const skyDiffs = shuffle(['sun', 'cloud'], rand);
  for (let i = 0; i < k; i++) {
    if (i >= k - 1 && skyDiffs.length && rand() < 0.6) {
      const d = skyDiffs.pop();
      if (d === 'sun') { b.sun = false; spots.push([0.8 + 0.12 * 0.5, 0.15]); }
      else { b.clouds.pop(); spots.push([0.57, 0.18]); }
      continue;
    }
    const kind = kinds[i];
    if (kind === 'add' && free.length) {
      // Something new appears in an empty spot.
      const [x, y] = free.pop();
      b.items.push({ x, y, s: 0.16, src: unused.pop()[1], flip: false });
      spots.push([x, y]);
      continue;
    }
    const it = b.items[order[i]];
    if (kind === 'remove') it.src = null;
    else if (kind === 'swap' || kind === 'add') it.src = unused.pop()[1];
    else if (kind === 'grow') it.s *= 1.5;
    else it.s *= 0.6;
    spots.push([it.x, it.y]);
  }
  b.items = b.items.filter((it) => it.src);
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const pg = new Page(paper, answers ? 'Spot the difference: answers' : 'Spot the difference', { subtitle: answers ? 'The differences are circled.' : `Can you find all ${k} differences? Circle them on the bottom picture.`, noName: answers });
    const h = (pg.room - 22) / 2, w = pg.width;
    drawScene(pg, pg.left, pg.y, w, h, a, `sa${answers ? 1 : 0}`);
    drawScene(pg, pg.left, pg.y + h + 6, w, h, b, `sb${answers ? 1 : 0}`);
    if (answers) spots.forEach(([sx, sy]) => pg.add(`<circle cx="${pg.left + sx * w}" cy="${pg.y + h + 6 + sy * h}" r="${w * 0.075}" fill="none" stroke="#e0457b" stroke-width="1.6" stroke-dasharray="3 1.2"/>`));
    const fy = pg.y + 2 * h + 12;
    pg.add(`<text x="${pg.left}" y="${fy + 3}" font-family="${FONT}" font-weight="800" font-size="4.8" fill="${INK}">I found:</text>`);
    for (let i = 0; i < k; i++) pg.add(`<path d="${starPath(pg.left + 26 + i * 10, fy + 1.5, 4, 0.46)}" fill="#fff" stroke="#ffb938" stroke-width="0.6" stroke-linejoin="round"/>`);
    pages.push(pg.svg());
  }
  return pages;
}

Object.assign(MAKERS, { joined: makeJoined, alphabets: makeAlphabets, families: makeFamilies, rhyming: makeRhyming, numberlines: makeNumberLines, fractions: makeFractions, colournum: makeColourByNumber, spotdiff: makeSpotDiff });

;
// PrintPals colouring pages: our own black and white pictures, drawn as clean vector lines
// in a 200 by 200 box, so they print crisp at any size.

const LW = 'fill="#fff" stroke="#1f1b2e" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"';
const LN = 'fill="none" stroke="#1f1b2e" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"';
const LT = 'fill="none" stroke="#1f1b2e" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"';
const INKF = 'fill="#1f1b2e"';

function cStar(cx, cy, r, inner = 0.45) { return `<path d="${starPath(cx, cy, r, inner)}" ${LW}/>`; }
function cCloud(cx, cy, s) {
  return `<path d="M${cx - 22 * s} ${cy + 8 * s} C${cx - 34 * s} ${cy + 8 * s} ${cx - 34 * s} ${cy - 8 * s} ${cx - 22 * s} ${cy - 6 * s} C${cx - 20 * s} ${cy - 20 * s} ${cx - 2 * s} ${cy - 22 * s} ${cx + 2 * s} ${cy - 10 * s} C${cx + 8 * s} ${cy - 20 * s} ${cx + 26 * s} ${cy - 16 * s} ${cx + 22 * s} ${cy - 4 * s} C${cx + 34 * s} ${cy - 4 * s} ${cx + 34 * s} ${cy + 8 * s} ${cx + 22 * s} ${cy + 8 * s} Z" ${LW}/>`;
}
function cSun(cx, cy, r) {
  let s = '';
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6, r1 = r + 4, r2 = r + (i % 2 ? 10 : 14);
    s += `<line x1="${cx + Math.cos(a) * r1}" y1="${cy + Math.sin(a) * r1}" x2="${cx + Math.cos(a) * r2}" y2="${cy + Math.sin(a) * r2}" ${LN}/>`;
  }
  return s + `<circle cx="${cx}" cy="${cy}" r="${r}" ${LW}/><circle cx="${cx - r * 0.35}" cy="${cy - r * 0.15}" r="${r * 0.1}" ${INKF}/><circle cx="${cx + r * 0.35}" cy="${cy - r * 0.15}" r="${r * 0.1}" ${INKF}/><path d="M${cx - r * 0.4} ${cy + r * 0.25} Q${cx} ${cy + r * 0.65} ${cx + r * 0.4} ${cy + r * 0.25}" ${LN}/>`;
}
function cFlower(cx, cy, r) {
  let s = `<path d="M${cx} ${cy + r} L${cx} ${cy + r * 3.2}" ${LN}/><path d="M${cx} ${cy + r * 2.4} Q${cx + r * 1.4} ${cy + r * 1.6} ${cx + r * 1.8} ${cy + r * 2.2} Q${cx + r} ${cy + r * 2.8} ${cx} ${cy + r * 2.4} Z" ${LW}/>`;
  for (let i = 0; i < 5; i++) { const a = (i * 2 * Math.PI) / 5 - Math.PI / 2; s += `<circle cx="${cx + Math.cos(a) * r * 0.9}" cy="${cy + Math.sin(a) * r * 0.9}" r="${r * 0.62}" ${LW}/>`; }
  return s + `<circle cx="${cx}" cy="${cy}" r="${r * 0.5}" ${LW}/>`;
}
function cGrass(y) {
  let d = `M0 ${y}`;
  for (let x = 0; x <= 200; x += 10) d += ` Q${x + 5} ${y - 8} ${x + 10} ${y}`;
  return `<path d="${d}" ${LN}/>`;
}
function cTree(cx, cy, r) {
  let d = '';
  for (let i = 0; i <= 9; i++) {
    const a = (i * 2 * Math.PI) / 9, b = ((i + 0.5) * 2 * Math.PI) / 9;
    const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
    d += i ? ` Q${cx + Math.cos(b - Math.PI / 9) * r * 1.28} ${cy + Math.sin(b - Math.PI / 9) * r * 1.28} ${x} ${y}` : `M${x} ${y}`;
  }
  return `<path d="${d} Z" ${LW}/>`;
}
function cSpiral(cx, cy, turns, rMax) {
  let d = '';
  const n = 120;
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * turns * 2 * Math.PI, r = 2 + (rMax - 2) * (i / n);
    d += `${i ? 'L' : 'M'}${(cx + Math.cos(t) * r).toFixed(2)} ${(cy + Math.sin(t) * r).toFixed(2)} `;
  }
  return `<path d="${d}" ${LN}/>`;
}
function eye(cx, cy, r) { return `<circle cx="${cx}" cy="${cy}" r="${r}" ${INKF}/><circle cx="${cx + r * 0.35}" cy="${cy - r * 0.35}" r="${r * 0.35}" fill="#fff"/>`; }

const COLOURING = {
  cat: { name: 'Cat', draw: () => [
    `<path d="M140 178 C184 176 196 128 170 108 C161 102 152 112 160 120 C174 134 168 158 138 160 Z" ${LW}/>`,
    `<ellipse cx="100" cy="150" rx="46" ry="38" ${LW}/>`,
    `<ellipse cx="100" cy="156" rx="22" ry="24" ${LW}/>`,
    `<path d="M64 72 L60 26 L94 50 Z" ${LW}/><path d="M136 72 L140 26 L106 50 Z" ${LW}/>`,
    `<circle cx="100" cy="84" r="42" ${LW}/>`,
    `<path d="M68 60 L66 38 L84 51" ${LT}/><path d="M132 60 L134 38 L116 51" ${LT}/>`,
    `<ellipse cx="84" cy="80" rx="8" ry="10" ${LW}/>${eye(85, 82, 5)}<ellipse cx="116" cy="80" rx="8" ry="10" ${LW}/>${eye(117, 82, 5)}`,
    `<path d="M94 96 L106 96 L100 103 Z" ${LW}/><path d="M100 103 Q94 111 87 106 M100 103 Q106 111 113 106" ${LN}/>`,
    `<path d="M74 98 L48 92 M74 104 L48 108 M126 98 L152 92 M126 104 L152 108" ${LT}/>`,
    `<ellipse cx="80" cy="184" rx="14" ry="9" ${LW}/><ellipse cx="120" cy="184" rx="14" ry="9" ${LW}/>`,
    `<path d="M74 182 L74 188 M80 181 L80 189 M114 182 L114 188 M120 181 L120 189" ${LT}/>`,
  ] },
  owl: { name: 'Owl', draw: () => [
    `<path d="M10 176 Q100 160 192 170 L192 180 Q100 172 10 186 Z" ${LW}/>`,
    `<path d="M160 172 Q176 150 190 152 Q180 168 160 172 Z" ${LW}/><path d="M30 178 Q20 160 8 160 Q14 176 30 178 Z" ${LW}/>`,
    `<path d="M58 66 L52 30 L82 54 Z" ${LW}/><path d="M142 66 L148 30 L118 54 Z" ${LW}/>`,
    `<ellipse cx="100" cy="112" rx="52" ry="60" ${LW}/>`,
    `<path d="M50 110 Q36 150 70 168 Q60 142 62 112 Z" ${LW}/><path d="M150 110 Q164 150 130 168 Q140 142 138 112 Z" ${LW}/>`,
    `<ellipse cx="100" cy="134" rx="30" ry="34" ${LW}/>`,
    `<path d="M84 126 q5 6 10 0 q5 6 10 0 q5 6 10 0 M84 140 q5 6 10 0 q5 6 10 0 q5 6 10 0 M88 154 q5 6 10 0 q5 6 10 0" ${LT}/>`,
    `<circle cx="80" cy="90" r="20" ${LW}/><circle cx="120" cy="90" r="20" ${LW}/>`,
    `<circle cx="80" cy="90" r="10" ${LW}/>${eye(80, 90, 5)}<circle cx="120" cy="90" r="10" ${LW}/>${eye(120, 90, 5)}`,
    `<path d="M93 104 L107 104 L100 118 Z" ${LW}/>`,
    `<path d="M84 170 l-4 8 M90 170 v9 M96 170 l4 8 M104 170 l-4 8 M110 170 v9 M116 170 l4 8" ${LN}/>`,
  ] },
  fish: { name: 'Fish', draw: () => [
    `<path d="M0 186 Q50 176 100 184 T200 182 L200 200 L0 200 Z" ${LW}/>`,
    `<path d="M20 186 C14 160 30 150 22 128 C34 146 24 166 32 186 Z" ${LW}/><path d="M170 184 C166 158 182 150 176 124 C190 146 176 166 184 184 Z" ${LW}/>`,
    `<path d="M146 98 L184 66 L176 98 L184 130 Z" ${LW}/>`,
    `<path d="M76 64 Q102 28 130 66 Z" ${LW}/><path d="M84 132 Q98 152 116 132 Z" ${LW}/>`,
    `<path d="M34 98 C54 50 128 46 150 98 C128 150 54 146 34 98 Z" ${LW}/>`,
    `<path d="M92 58 Q78 98 92 138 M112 56 Q98 98 112 140 M130 66 Q118 98 130 130" ${LT}/>`,
    `<circle cx="64" cy="90" r="11" ${LW}/>${eye(66, 91, 5)}<path d="M38 104 q7 6 14 0" ${LN}/>`,
    `<circle cx="26" cy="72" r="6" ${LW}/><circle cx="18" cy="52" r="8" ${LW}/><circle cx="30" cy="30" r="5" ${LW}/><circle cx="160" cy="36" r="7" ${LW}/><circle cx="176" cy="20" r="4" ${LW}/>`,
  ] },
  house: { name: 'House', draw: () => [
    cSun(34, 34, 14), cCloud(150, 28, 0.9),
    `<path d="M0 176 Q100 166 200 176 L200 200 L0 200 Z" ${LW}/>`,
    `<rect x="126" y="46" width="14" height="30" ${LW}/>`,
    `<rect x="46" y="96" width="96" height="80" ${LW}/>`,
    `<path d="M36 100 L94 52 L152 100 Z" ${LW}/>`,
    `<rect x="82" y="130" width="24" height="46" rx="3" ${LW}/><circle cx="101" cy="154" r="2" ${INKF}/>`,
    `<rect x="54" y="108" width="20" height="20" ${LW}/><path d="M64 108 V128 M54 118 H74" ${LT}/><rect x="114" y="108" width="20" height="20" ${LW}/><path d="M124 108 V128 M114 118 H134" ${LT}/>`,
    `<circle cx="94" cy="80" r="8" ${LW}/><path d="M94 72 V88 M86 80 H102" ${LT}/>`,
    `<path d="M88 176 Q84 188 76 200 M100 176 Q104 188 112 200" ${LN}/>`,
    `<rect x="166" y="132" width="10" height="46" ${LW}/>`, cTree(171, 116, 20), `<path d="M171 132 L164 122 M171 138 L178 128" ${LT}/>`,
    cFlower(22, 158, 6), cFlower(150, 164, 5),
  ] },
  rocket: { name: 'Rocket', draw: () => [
    `<circle cx="36" cy="44" r="18" ${LW}/><ellipse cx="36" cy="44" rx="30" ry="8" ${LN}/>`,
    cStar(166, 30, 9), cStar(150, 150, 7), cStar(28, 150, 8), cStar(176, 96, 5), cStar(20, 96, 5),
    `<path d="M156 60 A16 16 0 1 0 172 82 A12 12 0 1 1 156 60 Z" ${LW}/>`,
    `<path d="M86 150 Q100 196 114 150 Z" ${LW}/><path d="M92 150 Q100 178 108 150 Z" ${LW}/>`,
    `<path d="M76 118 L56 150 L78 146 Z" ${LW}/><path d="M124 118 L144 150 L122 146 Z" ${LW}/>`,
    `<path d="M100 14 C126 38 132 90 124 150 L76 150 C68 90 74 38 100 14 Z" ${LW}/>`,
    `<path d="M88 36 Q100 26 112 36" ${LN}/>`,
    `<circle cx="100" cy="76" r="16" ${LW}/><circle cx="100" cy="76" r="10" ${LW}/>`,
    `<path d="M78 120 H122" ${LN}/><circle cx="92" cy="134" r="3" ${LW}/><circle cx="108" cy="134" r="3" ${LW}/>`,
  ] },
  car: { name: 'Car', draw: () => [
    cSun(170, 30, 12), cCloud(56, 30, 0.8),
    `<path d="M0 170 H200" ${LN}/><path d="M20 186 H50 M80 186 H120 M150 186 H180" ${LN}/>`,
    `<path d="M24 142 Q22 116 44 112 L62 112 L82 78 Q86 72 94 72 L136 72 Q144 72 148 80 L164 112 Q180 114 180 132 L180 142 Q180 150 172 150 L32 150 Q24 150 24 142 Z" ${LW}/>`,
    `<path d="M70 112 L88 82 L112 82 L112 112 Z" ${LW}/><path d="M122 82 L140 82 L154 112 L122 112 Z" ${LW}/>`,
    `<path d="M116 118 V148 M86 124 h12 M128 124 h12" ${LN}/>`,
    `<rect x="170" y="120" width="10" height="8" rx="2" ${LW}/><rect x="24" y="122" width="10" height="8" rx="2" ${LW}/>`,
    `<circle cx="62" cy="152" r="18" ${LW}/><circle cx="62" cy="152" r="8" ${LW}/><circle cx="146" cy="152" r="18" ${LW}/><circle cx="146" cy="152" r="8" ${LW}/>`,
  ] },
  butterfly: { name: 'Butterfly', draw: () => [
    cFlower(30, 160, 9), cFlower(172, 156, 8),
    `<path d="M96 96 C70 40 20 30 22 70 C24 100 60 106 96 104 Z" ${LW}/><path d="M104 96 C130 40 180 30 178 70 C176 100 140 106 104 104 Z" ${LW}/>`,
    `<path d="M96 108 C60 106 34 130 50 150 C64 166 88 142 96 118 Z" ${LW}/><path d="M104 108 C140 106 166 130 150 150 C136 166 112 142 104 118 Z" ${LW}/>`,
    `<circle cx="56" cy="68" r="12" ${LW}/><circle cx="144" cy="68" r="12" ${LW}/><circle cx="72" cy="88" r="6" ${LW}/><circle cx="128" cy="88" r="6" ${LW}/>`,
    `<circle cx="66" cy="136" r="8" ${LW}/><circle cx="134" cy="136" r="8" ${LW}/>`,
    `<ellipse cx="100" cy="112" rx="8" ry="36" ${LW}/><circle cx="100" cy="72" r="10" ${LW}/>`,
    `<path d="M96 64 Q88 44 76 40 M104 64 Q112 44 124 40" ${LN}/><circle cx="76" cy="40" r="3" ${INKF}/><circle cx="124" cy="40" r="3" ${INKF}/>`,
    eye(96, 71, 2), eye(104, 71, 2), `<path d="M96 77 Q100 80 104 77" ${LT}/>`,
  ] },
  sunflower: { name: 'Sunflower', draw: () => {
    const out = [`<path d="M100 110 Q96 150 100 158" ${LN}/>`, `<path d="M100 132 Q128 112 146 124 Q126 140 100 132 Z" ${LW}/><path d="M99 142 Q72 124 54 136 Q74 152 99 142 Z" ${LW}/>`];
    out.push(`<path d="M62 150 L138 150 L128 196 L72 196 Z" ${LW}/><rect x="56" y="144" width="88" height="14" rx="4" ${LW}/>`, `<path d="M86 172 q7 8 14 0 q7 8 14 0" ${LT}/>`);
    for (let i = 0; i < 14; i++) { const a = (i * 2 * Math.PI) / 14; out.push(`<ellipse cx="${100 + Math.cos(a) * 36}" cy="${70 + Math.sin(a) * 36}" rx="16" ry="8" transform="rotate(${(a * 180) / Math.PI} ${100 + Math.cos(a) * 36} ${70 + Math.sin(a) * 36})" ${LW}/>`); }
    out.push(`<circle cx="100" cy="70" r="26" ${LW}/>`);
    for (let r = 0; r < 3; r++) for (let k = 0; k < 6 + r * 4; k++) { const a = (k * 2 * Math.PI) / (6 + r * 4); out.push(`<circle cx="${100 + Math.cos(a) * r * 8}" cy="${70 + Math.sin(a) * r * 8}" r="1.6" ${INKF}/>`); }
    return out;
  } },
  teddy: { name: 'Teddy bear', draw: () => [
    `<circle cx="64" cy="40" r="16" ${LW}/><circle cx="64" cy="40" r="8" ${LW}/><circle cx="136" cy="40" r="16" ${LW}/><circle cx="136" cy="40" r="8" ${LW}/>`,
    `<ellipse cx="54" cy="128" rx="16" ry="26" transform="rotate(30 54 128)" ${LW}/><ellipse cx="146" cy="128" rx="16" ry="26" transform="rotate(-30 146 128)" ${LW}/>`,
    `<ellipse cx="100" cy="140" rx="44" ry="46" ${LW}/><ellipse cx="100" cy="146" rx="26" ry="28" ${LW}/>`,
    `<ellipse cx="66" cy="180" rx="20" ry="16" ${LW}/><ellipse cx="66" cy="180" rx="10" ry="8" ${LW}/><ellipse cx="134" cy="180" rx="20" ry="16" ${LW}/><ellipse cx="134" cy="180" rx="10" ry="8" ${LW}/>`,
    `<circle cx="100" cy="66" r="40" ${LW}/>`,
    `<ellipse cx="100" cy="82" rx="18" ry="14" ${LW}/><ellipse cx="100" cy="76" rx="7" ry="5" ${INKF}/><path d="M100 81 V88 M100 88 Q94 94 88 90 M100 88 Q106 94 112 90" ${LN}/>`,
    eye(84, 58, 5), eye(116, 58, 5),
    `<path d="M100 106 L82 96 L82 116 Z" ${LW}/><path d="M100 106 L118 96 L118 116 Z" ${LW}/><circle cx="100" cy="106" r="5" ${LW}/>`,
  ] },
  icecream: { name: 'Ice cream', draw: () => [
    `<path d="M70 106 L100 196 L130 106 Z" ${LW}/>`,
    (() => {
      // A neat criss-cross pattern on the cone.
      const L = [70, 106], R = [130, 106], B = [100, 196], on = (P, t) => [P[0] + (B[0] - P[0]) * t, P[1] + (B[1] - P[1]) * t];
      let d = '';
      for (let k = 1; k <= 5; k++) {
        const t = k * 0.18;
        const a = on(L, t), b = on(R, Math.max(0, t - 0.36)), c = on(R, t), e = on(L, Math.max(0, t - 0.36));
        d += `M${a[0]} ${a[1]} L${b[0]} ${b[1]} M${c[0]} ${c[1]} L${e[0]} ${e[1]} `;
      }
      return `<path d="${d}" ${LT}/>`;
    })(),
    `<path d="M60 110 Q54 86 76 80 Q80 60 100 62 Q120 60 124 80 Q146 86 140 110 Q134 118 126 110 Q118 120 110 110 Q100 120 92 110 Q82 120 74 110 Q66 118 60 110 Z" ${LW}/>`,
    `<path d="M70 76 Q70 50 92 48 Q100 32 118 44 Q136 46 132 72 Q124 82 112 74 Q100 84 88 74 Q76 84 70 76 Z" ${LW}/>`,
    `<circle cx="104" cy="34" r="10" ${LW}/><path d="M106 24 Q110 12 122 8" ${LN}/>`,
    `<path d="M80 92 l6 -3 M96 96 l4 4 M114 90 l6 2 M124 100 l2 5 M90 60 l5 3 M108 58 l4 -4 M120 66 l5 2" ${LN}/>`,
    cStar(30, 40, 8), cStar(172, 60, 7), cStar(34, 150, 6), cStar(166, 150, 8),
  ] },
  dino: { name: 'Dinosaur', draw: () => [
    `<path d="M0 182 Q100 172 200 182" ${LN}/>`, cSun(170, 28, 11),
    `<path d="M144 132 Q186 128 196 96 Q176 120 140 116 Z" ${LW}/>`,
    `<rect x="62" y="140" width="18" height="38" rx="8" ${LW}/><rect x="118" y="140" width="18" height="38" rx="8" ${LW}/>`,
    `<path d="M60 102 L66 86 L76 98 L84 80 L94 96 L104 78 L112 96 L122 82 L128 100" ${LW}/>`,
    `<ellipse cx="100" cy="128" rx="52" ry="34" ${LW}/>`,
    `<rect x="74" y="148" width="18" height="34" rx="8" ${LW}/><rect x="108" y="148" width="18" height="34" rx="8" ${LW}/>`,
    `<path d="M56 116 Q34 96 36 52 Q36 30 58 28 Q80 28 80 46 Q80 60 62 62 Q58 90 76 108 Z" ${LW}/>`,
    eye(60, 42, 4), `<path d="M66 54 Q72 56 76 50" ${LN}/><circle cx="72" cy="38" r="1.4" ${INKF}/>`,
    `<circle cx="100" cy="122" r="8" ${LW}/><circle cx="124" cy="132" r="6" ${LW}/><circle cx="80" cy="136" r="5" ${LW}/>`,
  ] },
  turtle: { name: 'Turtle', draw: () => [
    cGrass(180), cFlower(24, 150, 7), cFlower(178, 146, 7),
    `<ellipse cx="62" cy="160" rx="12" ry="16" ${LW}/><ellipse cx="138" cy="160" rx="12" ry="16" ${LW}/>`,
    `<path d="M160 136 Q176 134 180 142 Q170 146 156 144 Z" ${LW}/>`,
    `<circle cx="40" cy="116" r="22" ${LW}/>`, eye(34, 110, 4), `<path d="M24 124 Q32 130 40 124" ${LN}/>`,
    `<path d="M50 146 Q46 70 100 64 Q154 70 150 146 Z" ${LW}/>`,
    `<path d="M50 146 H150" ${LN}/><path d="M88 84 L112 84 L122 104 L112 124 L88 124 L78 104 Z" ${LN}/>`,
    `<path d="M88 84 L78 70 M112 84 L122 70 M122 104 L146 104 M78 104 L54 104 M88 124 L80 146 M112 124 L120 146" ${LN}/>`,
  ] },
  cake: { name: 'Birthday cake', draw: () => {
    const out = [`<ellipse cx="100" cy="182" rx="86" ry="12" ${LW}/>`];
    out.push(`<rect x="30" y="126" width="140" height="54" rx="6" ${LW}/>`, `<path d="M30 140 Q40 152 50 140 Q60 152 70 140 Q80 152 90 140 Q100 152 110 140 Q120 152 130 140 Q140 152 150 140 Q160 152 170 140" ${LN}/>`);
    out.push(`<rect x="50" y="84" width="100" height="44" rx="6" ${LW}/>`, `<path d="M50 96 Q60 106 70 96 Q80 106 90 96 Q100 106 110 96 Q120 106 130 96 Q140 106 150 96" ${LN}/>`);
    [66, 100, 134].forEach((x) => out.push(`<rect x="${x - 5}" y="52" width="10" height="32" rx="2" ${LW}/><path d="M${x - 5} 62 L${x + 5} 58 M${x - 5} 72 L${x + 5} 68" ${LT}/><path d="M${x} 50 Q${x - 7} 40 ${x} 30 Q${x + 7} 40 ${x} 50 Z" ${LW}/>`));
    [44, 76, 108, 140, 162].forEach((x) => out.push(`<circle cx="${x}" cy="164" r="5" ${LW}/>`));
    out.push(cStar(22, 40, 9), cStar(180, 36, 8));
    return out;
  } },
  rainbow: { name: 'Rainbow', draw: () => {
    const out = [];
    for (let i = 0; i < 6; i++) { const r = 86 - i * 11; out.push(`<path d="M${100 - r} 150 A${r} ${r} 0 0 1 ${100 + r} 150" ${LN}/>`); }
    out.push(`<path d="M${100 - 31} 150 A31 31 0 0 1 ${100 + 31} 150" ${LN}/>`);
    out.push(cCloud(26, 150, 1.1), cCloud(174, 150, 1.1), cSun(160, 28, 13), cStar(30, 30, 7), cStar(58, 18, 5));
    out.push(`<path d="M0 190 Q100 178 200 190" ${LN}/>`, cFlower(60, 172, 5), cFlower(140, 170, 5), cFlower(100, 176, 5));
    return out;
  } },
  snail: { name: 'Snail', draw: () => [
    cGrass(184), cFlower(170, 140, 8), cSun(30, 40, 14),
    `<path d="M20 176 Q20 150 44 150 L160 150 Q176 150 176 166 Q176 178 164 178 L30 178 Q20 178 20 176 Z" ${LW}/>`,
    `<path d="M40 150 Q30 120 34 100" ${LN}/><path d="M52 150 Q52 120 58 100" ${LN}/><circle cx="34" cy="98" r="5" ${LW}/><circle cx="58" cy="98" r="5" ${LW}/>`,
    `<circle cx="112" cy="116" r="46" ${LW}/>`,
    cSpiral(112, 116, 3.2, 38),
    eye(44, 160, 3), `<path d="M38 168 Q44 172 50 168" ${LN}/>`,
  ] },
  dog: { name: 'Puppy', draw: () => [
    `<path d="M136 164 Q160 154 160 132" ${LN}/><path d="M166 128 l6 -4 M168 138 l7 0" ${LT}/>`,
    `<ellipse cx="100" cy="150" rx="40" ry="34" ${LW}/><ellipse cx="100" cy="156" rx="20" ry="22" ${LW}/>`,
    `<rect x="74" y="156" width="20" height="30" rx="9" ${LW}/><rect x="106" y="156" width="20" height="30" rx="9" ${LW}/><path d="M81 186 v-5 M87 186 v-5 M113 186 v-5 M119 186 v-5" ${LT}/>`,
    `<path d="M66 118 Q100 130 134 118 L132 128 Q100 140 68 128 Z" ${LW}/><circle cx="100" cy="138" r="6" ${LW}/>`,
    `<circle cx="100" cy="80" r="38" ${LW}/>`,
    `<path d="M66 54 C44 54 36 98 52 112 C64 106 68 82 72 66 Z" ${LW}/><path d="M134 54 C156 54 164 98 148 112 C136 106 132 82 128 66 Z" ${LW}/>`,
    `<ellipse cx="116" cy="72" rx="13" ry="11" ${LT}/>`, eye(84, 74, 5), eye(116, 74, 5),
    `<ellipse cx="100" cy="98" rx="20" ry="14" ${LW}/><ellipse cx="100" cy="90" rx="7" ry="5" ${INKF}/>`,
    `<path d="M100 95 V101 M100 101 Q93 108 87 103 M100 101 Q107 108 113 103" ${LN}/><path d="M96 105 Q100 118 104 105 Z" ${LW}/>`,
  ] },
  bunny: { name: 'Bunny', draw: () => [
    cGrass(186),
    `<ellipse cx="82" cy="40" rx="12" ry="34" transform="rotate(-8 82 40)" ${LW}/><ellipse cx="82" cy="42" rx="5" ry="24" transform="rotate(-8 82 42)" ${LW}/>`,
    `<ellipse cx="118" cy="40" rx="12" ry="34" transform="rotate(8 118 40)" ${LW}/><ellipse cx="118" cy="42" rx="5" ry="24" transform="rotate(8 118 42)" ${LW}/>`,
    `<ellipse cx="100" cy="148" rx="38" ry="34" ${LW}/><ellipse cx="100" cy="152" rx="20" ry="22" ${LW}/>`,
    `<ellipse cx="74" cy="180" rx="18" ry="9" ${LW}/><ellipse cx="126" cy="180" rx="18" ry="9" ${LW}/>`,
    `<circle cx="100" cy="94" r="32" ${LW}/>`, eye(88, 88, 4.5), eye(112, 88, 4.5),
    `<path d="M96 100 L104 100 L100 105 Z" ${INKF}/><path d="M100 105 Q95 111 90 108 M100 105 Q105 111 110 108" ${LN}/>`,
    `<path d="M80 102 L62 98 M80 106 L62 110 M120 102 L138 98 M120 106 L138 110" ${LT}/>`,
    `<ellipse cx="84" cy="138" rx="9" ry="7" ${LW}/><ellipse cx="116" cy="138" rx="9" ry="7" ${LW}/>`,
    `<path d="M150 150 L170 184 L178 146 Z" ${LW}/><path d="M160 150 L172 176 M168 148 L175 166" ${LT}/><path d="M164 146 Q158 130 162 124 M168 146 Q172 128 180 126 M172 147 Q182 136 190 138" ${LN}/>`,
  ] },
  elephant: { name: 'Elephant', draw: () => [
    `<path d="M0 182 Q100 174 200 182" ${LN}/>`, cSun(172, 30, 12),
    `<path d="M162 112 Q176 118 172 134" ${LN}/><path d="M168 132 l6 6 M172 131 l2 8" ${LT}/>`,
    `<rect x="70" y="138" width="20" height="42" rx="6" ${LW}/><rect x="132" y="138" width="20" height="42" rx="6" ${LW}/>`,
    `<ellipse cx="116" cy="118" rx="52" ry="38" ${LW}/>`,
    `<rect x="84" y="142" width="20" height="40" rx="6" ${LW}/><rect x="116" y="142" width="20" height="40" rx="6" ${LW}/>`,
    `<circle cx="62" cy="92" r="32" ${LW}/>`,
    `<path d="M36 104 Q20 136 30 154 Q38 164 46 154 Q40 134 52 114 Z" ${LW}/>`,
    `<ellipse cx="80" cy="96" rx="20" ry="26" ${LW}/><ellipse cx="80" cy="96" rx="12" ry="17" ${LT}/>`,
    eye(52, 84, 4.5), `<path d="M52 112 Q58 118 64 112" ${LN}/>`,
    `<circle cx="36" cy="44" r="4" ${LW}/><circle cx="28" cy="30" r="3" ${LW}/><circle cx="40" cy="22" r="3" ${LW}/>`,
  ] },
  whale: { name: 'Whale', draw: () => [
    `<path d="M0 170 Q20 162 40 170 T80 170 T120 170 T160 170 T200 170" ${LN}/><path d="M0 186 Q20 178 40 186 T80 186 T120 186 T160 186 T200 186" ${LN}/>`,
    `<path d="M150 96 Q170 66 188 68 Q178 88 186 108 Q170 104 158 112 Z" ${LW}/>`,
    `<path d="M24 112 C24 70 108 60 152 92 C166 102 170 112 160 122 C138 150 44 152 24 112 Z" ${LW}/>`,
    `<path d="M36 122 C60 134 120 136 150 122" ${LN}/><path d="M60 128 L58 134 M80 131 L79 138 M100 132 L100 139 M120 131 L121 138 M138 127 L140 133" ${LT}/>`,
    eye(52, 100, 5), `<path d="M30 116 Q40 122 50 116" ${LN}/>`,
    `<path d="M76 70 Q72 50 58 44 M76 70 Q80 50 94 44 M76 70 V42" ${LN}/><circle cx="58" cy="44" r="4" ${LW}/><circle cx="94" cy="44" r="4" ${LW}/><circle cx="76" cy="38" r="4" ${LW}/>`,
    cStar(170, 30, 7), cCloud(140, 28, 0.6),
  ] },
  train: { name: 'Train', draw: () => [
    `<circle cx="58" cy="44" r="10" ${LW}/><circle cx="72" cy="30" r="13" ${LW}/><circle cx="92" cy="20" r="11" ${LW}/>`,
    `<path d="M0 176 H200" ${LN}/><path d="M10 176 v8 M30 176 v8 M50 176 v8 M70 176 v8 M90 176 v8 M110 176 v8 M130 176 v8 M150 176 v8 M170 176 v8 M190 176 v8" ${LN}/>`,
    `<path d="M52 96 L46 58 L68 58 L62 96 Z" ${LW}/>`,
    `<rect x="30" y="94" width="92" height="50" rx="6" ${LW}/><path d="M50 94 V144 M74 94 V144 M98 94 V144" ${LT}/>`,
    `<rect x="116" y="62" width="58" height="82" rx="4" ${LW}/><rect x="110" y="54" width="70" height="12" rx="3" ${LW}/><rect x="128" y="76" width="34" height="26" rx="3" ${LW}/>`,
    `<path d="M22 144 L180 144 L180 156 L22 156 Z" ${LW}/><path d="M22 148 L12 158 L22 158" ${LW}/>`,
    `<circle cx="52" cy="160" r="15" ${LW}/><circle cx="52" cy="160" r="5" ${LW}/><circle cx="96" cy="160" r="15" ${LW}/><circle cx="96" cy="160" r="5" ${LW}/><circle cx="148" cy="156" r="20" ${LW}/><circle cx="148" cy="156" r="7" ${LW}/>`,
    `<path d="M52 160 H148" ${LN}/>`,
  ] },
  castle: { name: 'Castle', draw: () => [
    `<path d="M0 186 Q100 176 200 186" ${LN}/>`, cCloud(100, 22, 0.7),
    `<path d="M34 24 V8 L50 14 L34 20" ${LW}/><path d="M166 24 V8 L182 14 L166 20" ${LW}/>`,
    `<path d="M22 60 L38 22 L54 60 Z" ${LW}/><path d="M146 60 L162 22 L178 60 Z" ${LW}/>`,
    `<path d="M56 100 V86 H66 V96 H78 V86 H88 V96 H100 V86 H112 V96 H124 V86 H134 V96 H144 V86 V100" ${LW}/>`,
    `<rect x="56" y="100" width="88" height="82" ${LW}/>`,
    `<rect x="24" y="60" width="28" height="122" ${LW}/><rect x="148" y="60" width="28" height="122" ${LW}/>`,
    `<path d="M84 182 V148 Q100 128 116 148 V182" ${LW}/><path d="M100 136 V182" ${LT}/>`,
    `<path d="M32 90 V80 Q38 72 44 80 V90 Z" ${LW}/><path d="M156 90 V80 Q162 72 168 80 V90 Z" ${LW}/><path d="M32 130 V120 Q38 112 44 120 V130 Z" ${LW}/><path d="M156 130 V120 Q162 112 168 120 V130 Z" ${LW}/>`,
    `<path d="M70 124 V114 Q76 106 82 114 V124 Z" ${LW}/><path d="M118 124 V114 Q124 106 130 114 V124 Z" ${LW}/>`,
    `<path d="M60 112 h10 M130 150 h10 M62 160 h12 M128 170 h12 M28 150 h8 M156 104 h10" ${LT}/>`,
  ] },
  boat: { name: 'Sailing boat', draw: () => [
    cSun(32, 32, 12), `<path d="M140 30 q6 -6 12 0 q6 -6 12 0 M120 50 q5 -5 10 0 q5 -5 10 0" ${LN}/>`,
    `<path d="M100 36 L100 138" ${LN}/><path d="M100 30 L118 36 L100 42 Z" ${LW}/>`,
    `<path d="M104 44 L104 132 L160 132 Z" ${LW}/><path d="M96 56 L96 132 L52 132 Z" ${LW}/>`,
    `<path d="M36 138 L164 138 L148 164 L52 164 Z" ${LW}/><circle cx="76" cy="150" r="5" ${LW}/><circle cx="100" cy="150" r="5" ${LW}/><circle cx="124" cy="150" r="5" ${LW}/>`,
    `<path d="M0 166 Q16 158 32 166 T64 166 T96 166 T128 166 T160 166 T192 166 L200 164 L200 200 L0 200 Z" ${LW}/>`,
    `<path d="M20 182 q8 -6 16 0 M70 188 q8 -6 16 0 M130 182 q8 -6 16 0 M170 190 q8 -6 16 0" ${LN}/>`,
  ] },
  bee: { name: 'Bee', draw: () => [
    cFlower(30, 150, 10), cFlower(170, 150, 10),
    `<path d="M150 40 C180 40 186 70 164 72 C150 74 150 56 166 56" fill="none" stroke="#1f1b2e" stroke-width="1.6" stroke-dasharray="3 3" stroke-linecap="round"/>`,
    `<path d="M140 110 L158 112 L140 118 Z" ${LW}/>`,
    `<ellipse cx="80" cy="66" rx="18" ry="28" transform="rotate(-25 80 66)" ${LW}/><ellipse cx="112" cy="64" rx="18" ry="28" transform="rotate(20 112 64)" ${LW}/>`,
    `<ellipse cx="100" cy="112" rx="42" ry="30" ${LW}/>`,
    `<path d="M92 84 Q84 112 92 140 M112 83 Q104 112 112 141 M130 90 Q124 112 130 134" ${LN}/>`,
    `<circle cx="60" cy="106" r="20" ${LW}/>`, eye(54, 102, 3.5), eye(66, 102, 3.5), `<path d="M52 112 Q60 118 68 112" ${LN}/>`,
    `<path d="M54 88 Q48 70 40 66 M64 87 Q66 70 74 64" ${LN}/><circle cx="40" cy="66" r="3" ${INKF}/><circle cx="74" cy="64" r="3" ${INKF}/>`,
  ] },
  penguin: { name: 'Penguin', draw: () => [
    `<path d="M10 186 Q20 164 60 166 L150 164 Q186 166 192 186 Z" ${LW}/>`,
    cStar(30, 30, 6), cStar(170, 40, 7), cStar(150, 20, 4),
    `<path d="M56 110 Q34 130 44 156 Q56 144 62 124 Z" ${LW}/><path d="M144 110 Q166 130 156 156 Q144 144 138 124 Z" ${LW}/>`,
    `<ellipse cx="100" cy="112" rx="46" ry="60" ${LW}/><ellipse cx="100" cy="126" rx="30" ry="44" ${LW}/>`,
    `<path d="M76 70 Q100 56 124 70 Q116 90 100 86 Q84 90 76 70 Z" ${LW}/>`,
    eye(88, 70, 5), eye(112, 70, 5), `<path d="M92 82 L108 82 L100 94 Z" ${LW}/>`,
    `<circle cx="80" cy="88" r="4" ${LT}/><circle cx="120" cy="88" r="4" ${LT}/>`,
    `<path d="M76 168 Q70 176 82 178 Q92 178 92 170 Z" ${LW}/><path d="M124 168 Q130 176 118 178 Q108 178 108 170 Z" ${LW}/>`,
    `<path d="M70 50 Q100 30 130 50 L126 58 Q100 42 74 58 Z" ${LW}/><circle cx="100" cy="36" r="6" ${LW}/>`,
  ] },
  giraffe: { name: 'Giraffe', draw: () => [
    `<path d="M0 186 Q100 178 200 186" ${LN}/>`, cSun(170, 30, 11), cCloud(40, 26, 0.6),
    `<path d="M156 140 Q170 150 168 166" ${LN}/><path d="M165 164 l4 8 M168 163 l6 6" ${LT}/>`,
    `<rect x="98" y="148" width="12" height="36" rx="4" ${LW}/><rect x="146" y="148" width="12" height="36" rx="4" ${LW}/>`,
    `<ellipse cx="128" cy="138" rx="36" ry="22" ${LW}/>`,
    `<rect x="108" y="150" width="12" height="36" rx="4" ${LW}/><rect x="134" y="150" width="12" height="36" rx="4" ${LW}/>`,
    `<path d="M96 132 L70 62 L86 56 L114 124 Z" ${LW}/>`,
    `<path d="M62 26 L60 12 M76 24 L78 10" ${LN}/><circle cx="60" cy="10" r="3.5" ${LW}/><circle cx="78" cy="8" r="3.5" ${LW}/>`,
    `<path d="M54 30 Q44 26 44 34 Q48 38 56 36 Z" ${LW}/>`,
    `<ellipse cx="70" cy="42" rx="18" ry="16" ${LW}/><ellipse cx="60" cy="54" rx="14" ry="9" ${LW}/>`,
    eye(72, 38, 3.5), `<circle cx="54" cy="54" r="1.4" ${INKF}/><circle cx="62" cy="55" r="1.4" ${INKF}/><path d="M52 60 Q58 64 66 60" ${LT}/>`,
    `<path d="M80 74 l6 -3 l3 5 l-6 3 Z M86 94 l7 -2 l2 6 l-7 2 Z M94 112 l6 -3 l3 6 l-6 2 Z" ${LW}/>`,
    `<circle cx="118" cy="132" r="6" ${LW}/><circle cx="138" cy="144" r="5" ${LW}/><circle cx="148" cy="128" r="5" ${LW}/><circle cx="124" cy="148" r="4" ${LW}/>`,
  ] },
  robot: { name: 'Robot', draw: () => [
    `<path d="M100 22 V34" ${LN}/><circle cx="100" cy="18" r="6" ${LW}/>`,
    `<rect x="62" y="34" width="76" height="50" rx="10" ${LW}/><rect x="56" y="50" width="6" height="18" rx="2" ${LW}/><rect x="138" y="50" width="6" height="18" rx="2" ${LW}/>`,
    `<circle cx="84" cy="56" r="10" ${LW}/><circle cx="84" cy="56" r="4" ${INKF}/><circle cx="116" cy="56" r="10" ${LW}/><circle cx="116" cy="56" r="4" ${INKF}/>`,
    `<rect x="82" y="72" width="36" height="7" rx="2" ${LW}/><path d="M91 72 V79 M100 72 V79 M109 72 V79" ${LT}/>`,
    `<rect x="90" y="84" width="20" height="8" ${LW}/>`,
    `<rect x="36" y="96" width="18" height="44" rx="8" ${LW}/><rect x="146" y="96" width="18" height="44" rx="8" ${LW}/>`,
    `<path d="M38 140 Q32 152 40 156 M52 140 Q58 152 50 156" ${LN}/><path d="M148 140 Q142 152 150 156 M162 140 Q168 152 160 156" ${LN}/>`,
    `<rect x="54" y="92" width="92" height="66" rx="10" ${LW}/>`,
    `<rect x="68" y="104" width="40" height="28" rx="4" ${LW}/><circle cx="124" cy="110" r="6" ${LW}/><circle cx="124" cy="128" r="6" ${LW}/><path d="M74 146 H126" ${LN}/>`,
    `<path d="M76 118 L84 110 L92 124 L100 114 L104 118" ${LT}/>`,
    `<rect x="68" y="158" width="20" height="22" rx="4" ${LW}/><rect x="112" y="158" width="20" height="22" rx="4" ${LW}/><rect x="60" y="178" width="32" height="10" rx="4" ${LW}/><rect x="108" y="178" width="32" height="10" rx="4" ${LW}/>`,
  ] },
  plane: { name: 'Aeroplane', draw: () => [
    cCloud(40, 40, 0.8), cCloud(160, 150, 0.9), cCloud(40, 160, 0.6), cSun(170, 30, 12),
    `<path d="M92 100 L60 148 L80 148 L124 100 Z" ${LW}/>`,
    `<path d="M30 92 Q20 70 34 72 L52 92 Z" ${LW}/>`,
    `<path d="M24 100 Q24 86 44 86 L150 86 Q180 88 184 100 Q180 112 150 114 L44 114 Q24 114 24 100 Z" ${LW}/>`,
    `<path d="M92 100 L64 56 L84 56 L124 100 Z" ${LW}/>`,
    `<path d="M160 90 Q170 92 174 100 L160 100 Z" ${LW}/>`,
    `<circle cx="64" cy="100" r="5" ${LW}/><circle cx="82" cy="100" r="5" ${LW}/><circle cx="100" cy="100" r="5" ${LW}/><circle cx="118" cy="100" r="5" ${LW}/><circle cx="136" cy="100" r="5" ${LW}/>`,
    `<path d="M40 108 H56" ${LN}/>`,
  ] },
  frog: { name: 'Frog', draw: () => [
    `<path d="M0 150 Q25 142 50 150 T100 150 T150 150 T200 150 L200 200 L0 200 Z" ${LW}/>`,
    `<path d="M20 172 q8 -5 16 0 M150 178 q8 -5 16 0 M90 190 q8 -5 16 0" ${LN}/>`,
    `<path d="M30 160 Q30 140 100 138 Q170 140 170 160 Q170 176 100 178 Q30 176 30 160 Z" ${LW}/><path d="M100 158 L150 146" ${LN}/>`,
    `<ellipse cx="100" cy="126" rx="46" ry="32" ${LW}/><ellipse cx="100" cy="132" rx="28" ry="20" ${LW}/>`,
    `<path d="M56 138 Q40 150 56 160 Q66 160 70 150 Z" ${LW}/><path d="M144 138 Q160 150 144 160 Q134 160 130 150 Z" ${LW}/>`,
    `<ellipse cx="100" cy="92" rx="44" ry="28" ${LW}/>`,
    `<circle cx="76" cy="70" r="14" ${LW}/><circle cx="124" cy="70" r="14" ${LW}/>`, eye(76, 70, 6), eye(124, 70, 6),
    `<path d="M74 98 Q100 116 126 98" ${LN}/><circle cx="94" cy="86" r="1.4" ${INKF}/><circle cx="106" cy="86" r="1.4" ${INKF}/>`,
    `<path d="M160 40 C170 30 184 40 176 48 C170 54 162 48 170 44" fill="none" stroke="#1f1b2e" stroke-width="1.6" stroke-dasharray="3 3"/><circle cx="168" cy="36" r="3" ${LW}/>`,
  ] },
  ladybird: { name: 'Ladybird', draw: () => [
    `<path d="M20 170 Q60 100 150 120 Q190 130 190 170 Q120 196 20 170 Z" ${LW}/><path d="M26 168 Q100 150 184 164" ${LN}/><path d="M70 160 L80 146 M110 156 L120 138 M150 160 L158 144" ${LT}/>`,
    `<path d="M86 52 Q76 30 64 28 M114 52 Q124 30 136 28" ${LN}/><circle cx="64" cy="28" r="4" ${LW}/><circle cx="136" cy="28" r="4" ${LW}/>`,
    `<path d="M52 96 L36 90 M50 116 L32 118 M56 134 L42 146 M148 96 L164 90 M150 116 L168 118 M144 134 L158 146" ${LN}/>`,
    `<circle cx="100" cy="112" r="50" ${LW}/>`,
    `<path d="M100 72 V160" ${LN}/>`,
    `<path d="M68 74 A32 30 0 0 1 132 74 Z" ${LW}/>`, eye(88, 62, 4), eye(112, 62, 4), `<path d="M94 68 Q100 72 106 68" ${LT}/>`,
    `<circle cx="76" cy="96" r="9" ${LW}/><circle cx="124" cy="96" r="9" ${LW}/><circle cx="70" cy="126" r="8" ${LW}/><circle cx="130" cy="126" r="8" ${LW}/><circle cx="88" cy="146" r="6" ${LW}/><circle cx="112" cy="146" r="6" ${LW}/>`,
  ] },
  octopus: { name: 'Octopus', draw: () => {
    const out = [`<path d="M0 188 Q50 180 100 188 T200 186" ${LN}/>`, `<circle cx="30" cy="40" r="6" ${LW}/><circle cx="40" cy="22" r="4" ${LW}/><circle cx="170" cy="50" r="7" ${LW}/><circle cx="160" cy="28" r="4" ${LW}/>`];
    const legs = [[64, 118, -1], [76, 124, -0.6], [90, 128, -0.2], [104, 128, 0.2], [118, 124, 0.6], [132, 118, 1]];
    legs.forEach(([x, y, d]) => {
      // Each wiggly leg is a thick outlined curve with a curl at the end.
      const ex = x + d * 44 + (d === 0 ? 0 : 0), ey = 168;
      const curve = `M${x} ${y - 4} C${x + d * 8 - 10} ${y + 22} ${x + d * 30 + 12} ${y + 30} ${ex} ${ey - 8} Q${ex - d * 2 - 8} ${ey + 6} ${ex - 14 * (d >= 0 ? -1 : 1)} ${ey}`;
      out.push(`<path d="${curve}" fill="none" stroke="#1f1b2e" stroke-width="14.8" stroke-linecap="round"/><path d="${curve}" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round"/>`);
    });
    out.push(`<path d="M52 118 C44 58 76 30 100 30 C124 30 156 58 148 118 Z" ${LW}/>`, eye(84, 90, 7), eye(116, 90, 7), `<path d="M88 106 Q100 116 112 106" ${LN}/>`, `<circle cx="72" cy="104" r="5" ${LT}/><circle cx="128" cy="104" r="5" ${LT}/>`);
    out.push(`<path d="M86 50 Q100 42 114 50" ${LT}/>`);
    return out;
  } },
  unicorn: { name: 'Unicorn', draw: () => [
    cStar(30, 36, 8), cStar(170, 40, 8), cStar(26, 150, 6), cStar(176, 150, 6),
    `<circle cx="60" cy="74" r="16" ${LW}/><circle cx="52" cy="98" r="16" ${LW}/><circle cx="54" cy="122" r="16" ${LW}/><circle cx="62" cy="146" r="14" ${LW}/>`,
    `<path d="M70 62 L58 26 L90 52 Z" ${LW}/><path d="M130 62 L142 26 L110 52 Z" ${LW}/><path d="M72 56 L64 36 L84 52" ${LT}/><path d="M128 56 L136 36 L116 52" ${LT}/>`,
    `<ellipse cx="100" cy="108" rx="44" ry="54" ${LW}/>`,
    `<circle cx="84" cy="62" r="12" ${LW}/><circle cx="100" cy="58" r="12" ${LW}/><circle cx="116" cy="62" r="12" ${LW}/>`,
    `<path d="M100 8 L88 54 L112 54 Z" ${LW}/><path d="M92 40 L108 34 M90 48 L110 42 M95 28 L105 24" ${LT}/>`,
    `<ellipse cx="100" cy="142" rx="30" ry="20" ${LW}/><ellipse cx="90" cy="140" rx="3" ry="4" ${INKF}/><ellipse cx="110" cy="140" rx="3" ry="4" ${INKF}/><path d="M90 152 Q100 158 110 152" ${LN}/>`,
    `<path d="M74 104 Q82 112 90 104 M110 104 Q118 112 126 104" ${LN}/><path d="M74 104 l-4 -3 M78 108 l-3 3 M126 104 l4 -3 M122 108 l3 3" ${LT}/>`,
    `<circle cx="70" cy="120" r="6" ${LT}/><circle cx="130" cy="120" r="6" ${LT}/>`,
  ] },
};

function colouringArt(key) {
  const art = COLOURING[key];
  return art.draw().join('');
}

/** Big bubble letters to colour in. */
function bubbleText(pg, text, cx, y, maxW, maxFs) {
  const fs = Math.min(maxFs, maxW / (Math.max(1, text.length) * 0.56));
  pg.add(`<text x="${cx}" y="${y}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${fs.toFixed(2)}" fill="#fff" stroke="#1f1b2e" stroke-width="${(fs * 0.06).toFixed(2)}" stroke-linejoin="round" paint-order="stroke">${esc(text)}</text>`);
  return fs;
}

function colouringPage(paper, key, name) {
  const art = COLOURING[key];
  const pg = new Page(paper, '', { bare: true });
  const top = pg.m + 2;
  const label = name ? `${name} colours the ${art.name.toLowerCase()}` : `Colour the ${art.name.toLowerCase()}`;
  bubbleText(pg, label, pg.w / 2, top + 14, pg.width - 10, 15);
  const boxY = top + 22, boxH = pg.bottom - boxY - 2;
  pg.add(`<rect x="${pg.left}" y="${boxY}" width="${pg.width}" height="${boxH}" rx="8" fill="#fff" stroke="#1f1b2e" stroke-width="1"/>`);
  const size = Math.min(pg.width - 16, boxH - 16);
  const s = size / 200;
  pg.add(`<g transform="translate(${pg.left + (pg.width - size) / 2} ${boxY + (boxH - size) / 2}) scale(${s.toFixed(4)})">${colouringArt(key)}</g>`);
  return pg.svg();
}

function makeColouring(o, paper) {
  const rand = rng(+o.seed || 1);
  const name = nameOf(o.name, '');
  const keys = Object.keys(COLOURING);
  if (o.book === 'book') {
    const pages = [];
    // Cover
    const pg = new Page(paper, '', { bare: true });
    pg.add(`<rect x="${pg.left - 3}" y="${pg.m - 3}" width="${pg.width + 6}" height="${pg.bottom - pg.m + 6}" rx="10" fill="#fff" stroke="#1f1b2e" stroke-width="1.4"/>`);
    const title = name ? `${name}'s` : 'My';
    const fs1 = bubbleText(pg, title, pg.w / 2, pg.m + 34, pg.width - 20, 30);
    bubbleText(pg, 'Colouring Book', pg.w / 2, pg.m + 34 + fs1 * 0.95, pg.width - 20, 26);
    const picks = shuffle(keys, rand).slice(0, 6);
    const cw = (pg.width - 20) / 3, ch = cw;
    picks.forEach((k, i) => {
      const x = pg.left + 10 + (i % 3) * cw, y = pg.m + 90 + Math.floor(i / 3) * (ch + 6);
      pg.add(`<g transform="translate(${x + 4} ${y}) scale(${((cw - 8) / 200).toFixed(4)})">${colouringArt(k)}</g>`);
    });
    pg.add(`<text x="${pg.w / 2}" y="${pg.bottom - 8}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="5" fill="${SOFT}">This book belongs to ${name ? esc(name) : '______________________'}</text>`);
    pages.push(pg.svg());
    keys.forEach((k) => pages.push(colouringPage(paper, k, name)));
    return pages;
  }
  const key = COLOURING[o.picture] ? o.picture : keys[Math.floor(rand() * keys.length)];
  return [colouringPage(paper, key, name)];
}

Object.assign(MAKERS, { colouring: makeColouring });

;
// PrintPals batch 5: place value, shapes and symmetry, measuring, graphs,
// reading log, handwriting paper, story writing and name labels.

// ================================================================ place value
function baseTen(pg, x, y, n, c) {
  // Hundreds flats, tens rods and ones cubes, left to right.
  const h = Math.floor(n / 100), t = Math.floor((n % 100) / 10), o = n % 10;
  let cx = x;
  const cell = (px, py) => `<rect x="${px}" y="${py}" width="${c}" height="${c}" fill="#fff" stroke="#2d2350" stroke-width="0.25"/>`;
  for (let i = 0; i < h; i++) {
    let s = `<rect x="${cx}" y="${y}" width="${c * 10}" height="${c * 10}" fill="#ffe3ec" stroke="#2d2350" stroke-width="0.5"/>`;
    for (let k = 1; k < 10; k++) s += `<line x1="${cx + k * c}" x2="${cx + k * c}" y1="${y}" y2="${y + c * 10}" stroke="#c7b8d8" stroke-width="0.2"/><line x1="${cx}" x2="${cx + c * 10}" y1="${y + k * c}" y2="${y + k * c}" stroke="#c7b8d8" stroke-width="0.2"/>`;
    pg.add(s);
    cx += c * 10 + c * 0.8;
  }
  for (let i = 0; i < t; i++) {
    let s = `<rect x="${cx}" y="${y}" width="${c}" height="${c * 10}" fill="#dfeaff" stroke="#2d2350" stroke-width="0.5"/>`;
    for (let k = 1; k < 10; k++) s += `<line x1="${cx}" x2="${cx + c}" y1="${y + k * c}" y2="${y + k * c}" stroke="#2d2350" stroke-width="0.2"/>`;
    pg.add(s);
    cx += c * 1.5;
  }
  if (o) cx += c * 0.6;
  for (let i = 0; i < o; i++) pg.add(`<rect x="${cx + Math.floor(i / 5) * c * 1.3}" y="${y + c * 10 - (i % 5 + 1) * c * 1.25}" width="${c}" height="${c}" fill="#fff4cc" stroke="#2d2350" stroke-width="0.5"/>`);
  return cx + (o ? Math.ceil(o / 5) * c * 1.3 : 0) - x;
}

function makePlaceValue(o, paper) {
  const rand = rng(+o.seed || 1);
  const range = o.range || 'to99';
  const kind = o.kind || 'count';
  const lo = range === 'to50' ? 11 : range === 'to99' ? 11 : 100, hi = range === 'to50' ? 50 : range === 'to99' ? 99 : kind === 'count' ? 399 : 999;
  const nums = [];
  while (nums.length < 6) { const n = lo + Math.floor(rand() * (hi - lo + 1)); if (!nums.includes(n)) nums.push(n); }
  const big = hi > 99;
  const titles = { count: 'Count the tens and ones', draw: 'Draw the tens and ones', expand: 'Split the number' };
  const subs = { count: big ? 'Count the hundreds, tens and ones. Write the number.' : 'Each stick is 10. Each little cube is 1. How many altogether?', draw: 'Draw sticks for tens and little squares for ones.', expand: 'Split each number into its parts.' };
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const pg = new Page(paper, answers ? `${titles[kind]}: answers` : titles[kind], { subtitle: answers ? 'Answer key for grown-ups.' : subs[kind], noName: answers });
    const cols = 2, rows = 3, cw = pg.width / cols, ch = (pg.room - 2) / rows;
    nums.forEach((n, i) => {
      const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch;
      const c = PALETTE[i % PALETTE.length];
      pg.add(`<rect x="${x + 1.5}" y="${y + 1.5}" width="${cw - 3}" height="${ch - 3}" rx="6" fill="#fff" stroke="${c}" stroke-width="0.7"/>`);
      const h = Math.floor(n / 100), t = Math.floor((n % 100) / 10), on = n % 10;
      const box = (bx, by, v) => `<rect x="${bx}" y="${by}" width="12" height="9" rx="2" fill="#fff" stroke="${answers ? '#e0457b' : '#9a93b8'}" stroke-width="0.5"/>` + (answers ? `<text x="${bx + 6}" y="${by + 6.6}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="5.5" fill="#e0457b">${v}</text>` : '');
      if (kind === 'count') {
        const cube = big ? Math.min(3, (cw - 16) / (h * 10.8 + t * 1.5 + 4), (ch - 42) / 10) : Math.min(5, (cw - 16) / (t * 1.5 + 4.5), (ch - 30) / 10);
        baseTen(pg, x + 7, y + 6, n, cube);
        const ly = y + ch - (big ? 28 : 16);
        let lx = x + 7;
        const parts = big ? [[h, 'hundreds'], [t, 'tens'], [on, 'ones']] : [[t, 'tens'], [on, 'ones']];
        parts.forEach(([v, w]) => { pg.add(box(lx, ly, v)); pg.add(`<text x="${lx + 14}" y="${ly + 6.4}" font-family="${FONT}" font-weight="800" font-size="4" fill="${INK}">${w}</text>`); lx += 14 + w.length * 2.2 + 4; });
        if (big) {
          // The whole number goes on its own line so the row fits.
          pg.add(`<text x="${x + 7}" y="${ly + 18.4}" font-family="${FONT}" font-weight="800" font-size="4" fill="${INK}">The number is</text>`);
          pg.add(box(x + 36, ly + 12, n));
        } else {
          pg.add(`<text x="${lx}" y="${ly + 6.4}" font-family="${FONT}" font-weight="800" font-size="4.6" fill="${INK}">=</text>`);
          pg.add(box(lx + 5, ly, n));
        }
      } else if (kind === 'draw') {
        pg.add(`<text x="${x + 8}" y="${y + 16}" font-family="${TITLE_FONT}" font-weight="800" font-size="14" fill="${INK}">${n}</text>`);
        const cols2 = big ? ['Hundreds', 'Tens', 'Ones'] : ['Tens', 'Ones'];
        const tx = x + 38, tw = cw - 46, colw = tw / cols2.length;
        cols2.forEach((w, k) => {
          pg.add(`<rect x="${tx + k * colw}" y="${y + 6}" width="${colw}" height="${ch - 14}" fill="${TINTS[k]}" stroke="${INK}" stroke-width="0.4"/>`);
          pg.add(`<text x="${tx + k * colw + colw / 2}" y="${y + 11}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.4" fill="${INK}">${w}</text>`);
        });
        if (answers) baseTen(pg, tx + 3, y + 14, n, big ? 1.8 : 2.4);
      } else {
        const fs = 11;
        const parts = big ? [h * 100, t * 10, on] : [t * 10, on];
        let lx = x + 8;
        pg.add(`<text x="${lx}" y="${y + ch / 2 - 4}" font-family="${TITLE_FONT}" font-weight="800" font-size="${fs}" fill="${INK}">${n} =</text>`);
        lx += (String(n).length + 2) * fs * 0.55;
        parts.forEach((v, k) => {
          pg.add(`<rect x="${lx}" y="${y + ch / 2 - 15}" width="16" height="13" rx="2" fill="#fff" stroke="${answers ? '#e0457b' : '#9a93b8'}" stroke-width="0.5"/>`);
          if (answers) pg.add(`<text x="${lx + 8}" y="${y + ch / 2 - 5.5}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="6.5" fill="#e0457b">${v}</text>`);
          if (k < parts.length - 1) pg.add(`<text x="${lx + 19}" y="${y + ch / 2 - 5}" font-family="${TITLE_FONT}" font-weight="800" font-size="8" fill="${INK}">+</text>`);
          lx += 26;
        });
        pg.add(`<text x="${x + 8}" y="${y + ch - 12}" font-family="${FONT}" font-weight="700" font-size="4.2" fill="${SOFT}">${big ? `${n} has ${answers ? h : '__'} hundreds, ${answers ? t : '__'} tens and ${answers ? on : '__'} ones.` : `${n} has ${answers ? t : '__'} tens and ${answers ? on : '__'} ones.`}</text>`);
      }
    });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ shapes and symmetry
const SHAPES2D = [
  ['circle', 0], ['oval', 0], ['square', 4], ['rectangle', 4], ['triangle', 3], ['diamond', 4],
  ['pentagon', 5], ['hexagon', 6], ['octagon', 8], ['star', 10], ['heart', null], ['semicircle', null],
];

function polygonPath(cx, cy, r, n, rot = -Math.PI / 2) {
  let d = '';
  for (let i = 0; i < n; i++) { const a = rot + (i * 2 * Math.PI) / n; d += `${i ? 'L' : 'M'}${(cx + Math.cos(a) * r).toFixed(2)} ${(cy + Math.sin(a) * r).toFixed(2)} `; }
  return d + 'Z';
}

function shape2d(kind, cx, cy, r, style) {
  const st = style || `fill="#fff" stroke="${INK}" stroke-width="0.9" stroke-linejoin="round"`;
  switch (kind) {
    case 'circle': return `<circle cx="${cx}" cy="${cy}" r="${r}" ${st}/>`;
    case 'oval': return `<ellipse cx="${cx}" cy="${cy}" rx="${r * 1.25}" ry="${r * 0.78}" ${st}/>`;
    case 'square': return `<rect x="${cx - r * 0.85}" y="${cy - r * 0.85}" width="${r * 1.7}" height="${r * 1.7}" ${st}/>`;
    case 'rectangle': return `<rect x="${cx - r * 1.3}" y="${cy - r * 0.7}" width="${r * 2.6}" height="${r * 1.4}" ${st}/>`;
    case 'triangle': return `<path d="M${cx} ${cy - r} L${cx + r * 1.05} ${cy + r * 0.8} L${cx - r * 1.05} ${cy + r * 0.8} Z" ${st}/>`;
    case 'diamond': return `<path d="M${cx} ${cy - r * 1.1} L${cx + r * 0.8} ${cy} L${cx} ${cy + r * 1.1} L${cx - r * 0.8} ${cy} Z" ${st}/>`;
    case 'pentagon': return `<path d="${polygonPath(cx, cy + r * 0.05, r, 5)}" ${st}/>`;
    case 'hexagon': return `<path d="${polygonPath(cx, cy, r, 6, 0)}" ${st}/>`;
    case 'octagon': return `<path d="${polygonPath(cx, cy, r, 8, Math.PI / 8)}" ${st}/>`;
    case 'star': return `<path d="${starPath(cx, cy + r * 0.08, r * 1.1, 0.45)}" ${st}/>`;
    case 'heart': return `<path d="M${cx} ${cy + r} C${cx - r * 1.6} ${cy - r * 0.1} ${cx - r * 0.7} ${cy - r * 1.3} ${cx} ${cy - r * 0.45} C${cx + r * 0.7} ${cy - r * 1.3} ${cx + r * 1.6} ${cy - r * 0.1} ${cx} ${cy + r} Z" ${st}/>`;
    default: return `<path d="M${cx - r * 1.15} ${cy + r * 0.5} A${r * 1.15} ${r * 1.15} 0 0 1 ${cx + r * 1.15} ${cy + r * 0.5} Z" ${st}/>`;
  }
}

function makeShapes(o, paper) {
  const rand = rng(+o.seed || 1);
  const kind = o.kind || 'name';
  const pages = [];
  if (kind === 'symmetry') {
    const cols = ['#ff6b6b', '#ffb938', '#3fbfa8', '#6c8cff'];
    const grids = [0, 1].map(() => {
      const g = [];
      for (let r = 0; r < 10; r++) { const row = []; for (let c = 0; c < 5; c++) row.push(rand() < 0.42 ? cols[Math.floor(rand() * cols.length)] : null); g.push(row); }
      return g;
    });
    for (const answers of [false, true]) {
      if (answers && o.key === false) break;
      const pg = new Page(paper, answers ? 'Symmetry: answers' : 'Finish the pattern', { subtitle: answers ? 'Answer key for grown-ups.' : 'The dashed line is a mirror. Colour the other side so both sides match.', noName: answers });
      const each = (pg.room - 6) / 2;
      grids.forEach((g, gi) => {
        const cell = Math.min((pg.width - 20) / 10, (each - 8) / 10);
        const gx = pg.left + (pg.width - cell * 10) / 2, gy = pg.y + gi * (each + 6);
        for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) {
          const src = c < 5 ? g[r][c] : g[r][9 - c];
          const show = c < 5 || answers;
          pg.add(`<rect x="${gx + c * cell}" y="${gy + r * cell}" width="${cell}" height="${cell}" fill="${show && src ? src : '#fff'}" stroke="#b9b3d6" stroke-width="0.3"/>`);
        }
        pg.add(`<rect x="${gx}" y="${gy}" width="${cell * 10}" height="${cell * 10}" fill="none" stroke="${INK}" stroke-width="0.8"/>`);
        pg.add(`<line x1="${gx + cell * 5}" x2="${gx + cell * 5}" y1="${gy - 3}" y2="${gy + cell * 10 + 3}" stroke="#e0457b" stroke-width="1.1" stroke-dasharray="3 2"/>`);
      });
      pages.push(pg.svg());
    }
    return pages;
  }
  const list = shuffle(SHAPES2D, rand);
  for (const answers of [false, true]) {
    if (answers && (o.key === false || kind === 'trace')) break;
    const title = kind === 'trace' ? 'Trace the shapes' : 'Name the shapes';
    const pg = new Page(paper, answers ? `${title}: answers` : title, { subtitle: answers ? 'Answer key for grown-ups.' : kind === 'trace' ? 'Trace each shape and its name, then colour it in.' : 'Write the name of each shape. Count its sides and corners.', noName: answers });
    const cols = 3, rows = 4, cw = pg.width / cols, ch = (pg.room - 2) / rows;
    list.forEach(([name, sides], i) => {
      const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch;
      const c = i % PALETTE.length;
      pg.add(`<rect x="${x + 1.5}" y="${y + 1.5}" width="${cw - 3}" height="${ch - 3}" rx="6" fill="${TINTS[c]}"/>`);
      const r = Math.min(cw, ch) * 0.2;
      if (kind === 'trace') {
        pg.add(shape2d(name, x + cw / 2, y + ch * 0.4, r, `fill="#fff" stroke="#7d7799" stroke-width="0.8" stroke-dasharray="1.4 1.2" stroke-linejoin="round"`));
        const size = Math.min(7, (cw - 10) / (textWidth(name) / 100 + 0.2));
        pg.add(drawText(name, x + cw / 2 - (textWidth(name) / 200) * size, y + ch - 14, size, 'trace', true));
      } else {
        pg.add(shape2d(name, x + cw / 2, y + ch * 0.36, r, `fill="#fff" stroke="${PALETTE[c]}" stroke-width="1" stroke-linejoin="round"`));
        if (answers) pg.add(`<text x="${x + cw / 2}" y="${y + ch * 0.68}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="5.5" fill="#e0457b">${name}</text>`);
        else pg.add(`<line x1="${x + 8}" x2="${x + cw - 8}" y1="${y + ch * 0.7}" y2="${y + ch * 0.7}" stroke="#9a93b8" stroke-width="0.4"/>`);
        if (sides !== null) {
          const ty = y + ch - 7;
          pg.add(`<text x="${x + 6}" y="${ty}" font-family="${FONT}" font-weight="800" font-size="3.4" fill="${INK}">sides</text><rect x="${x + 16}" y="${ty - 4.2}" width="8" height="6" rx="1.2" fill="#fff" stroke="#9a93b8" stroke-width="0.4"/>`);
          pg.add(`<text x="${x + cw / 2 + 1}" y="${ty}" font-family="${FONT}" font-weight="800" font-size="3.4" fill="${INK}">corners</text><rect x="${x + cw / 2 + 15}" y="${ty - 4.2}" width="8" height="6" rx="1.2" fill="#fff" stroke="#9a93b8" stroke-width="0.4"/>`);
          if (answers) pg.add(`<text x="${x + 20}" y="${ty}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.8" fill="#e0457b">${sides}</text><text x="${x + cw / 2 + 19}" y="${ty}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.8" fill="#e0457b">${sides}</text>`);
        }
      }
    });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ measuring
function ruler(pg, x, y, unit, maxLen) {
  const mm = unit === 'inch' ? 25.4 : 10;
  const len = maxLen * mm;
  let s = `<rect x="${x - 3}" y="${y}" width="${len + 6}" height="11" rx="1.5" fill="#fff6d6" stroke="${INK}" stroke-width="0.5"/>`;
  const steps = unit === 'inch' ? maxLen * 4 : maxLen * 10;
  for (let i = 0; i <= steps; i++) {
    const tx = x + (i * len) / steps;
    const major = unit === 'inch' ? i % 4 === 0 : i % 10 === 0;
    const half = unit === 'inch' ? i % 2 === 0 : i % 5 === 0;
    const h = major ? 4.5 : half ? 3 : 1.8;
    s += `<line x1="${tx}" x2="${tx}" y1="${y}" y2="${y + h}" stroke="${INK}" stroke-width="${major ? 0.4 : 0.25}"/>`;
    if (major) s += `<text x="${tx}" y="${y + 9}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.2" fill="${INK}">${unit === 'inch' ? i / 4 : i / 10}</text>`;
  }
  s += `<text x="${x + len + 1}" y="${y + 9}" text-anchor="end" font-family="${FONT}" font-weight="700" font-size="2.4" fill="${SOFT}">${unit === 'inch' ? 'in' : 'cm'}</text>`;
  pg.add(s);
}

function measureObject(kind, x, y, len, h, c) {
  const k = `stroke="${INK}" stroke-width="0.5" stroke-linejoin="round"`;
  if (kind === 'pencil') {
    const tip = Math.min(9, len * 0.18);
    return `<rect x="${x}" y="${y}" width="4" height="${h}" rx="1.4" fill="#ff9fb8" ${k}/><rect x="${x + 4}" y="${y}" width="3" height="${h}" fill="#cfd4dc" ${k}/>`
      + `<rect x="${x + 7}" y="${y}" width="${len - 7 - tip}" height="${h}" fill="${c}" ${k}/><path d="M${x + len - tip} ${y} L${x + len} ${y + h / 2} L${x + len - tip} ${y + h} Z" fill="#f3d5a8" ${k}/>`
      + `<path d="M${x + len - tip * 0.35} ${y + h * 0.33} L${x + len} ${y + h / 2} L${x + len - tip * 0.35} ${y + h * 0.67} Z" fill="${INK}"/>`;
  }
  if (kind === 'crayon') {
    const tip = Math.min(7, len * 0.15);
    return `<rect x="${x}" y="${y}" width="${len - tip}" height="${h}" rx="1.5" fill="${c}" ${k}/><rect x="${x + (len - tip) * 0.2}" y="${y}" width="${(len - tip) * 0.55}" height="${h}" fill="#fff" ${k}/>`
      + `<path d="M${x + len - tip} ${y + 0.8} L${x + len} ${y + h / 2} L${x + len - tip} ${y + h - 0.8} Z" fill="${c}" ${k}/>`;
  }
  if (kind === 'brush') {
    return `<rect x="${x}" y="${y + h * 0.3}" width="${len * 0.62}" height="${h * 0.4}" rx="1.5" fill="${c}" ${k}/><rect x="${x + len * 0.62}" y="${y + h * 0.2}" width="${len * 0.12}" height="${h * 0.6}" fill="#cfd4dc" ${k}/>`
      + `<path d="M${x + len * 0.74} ${y + h * 0.2} Q${x + len * 0.95} ${y + h * 0.2} ${x + len} ${y + h / 2} Q${x + len * 0.95} ${y + h * 0.8} ${x + len * 0.74} ${y + h * 0.8} Z" fill="#8d5524" ${k}/>`;
  }
  // caterpillar
  const n = Math.max(3, Math.round(len / h)), d = len / n;
  let s = '';
  for (let i = 0; i < n; i++) s += `<circle cx="${x + d * (i + 0.5)}" cy="${y + h / 2}" r="${d / 2}" fill="${i === n - 1 ? '#8bc34a' : i % 2 ? '#a5d86b' : '#c5e89b'}" ${k}/>`;
  const hx = x + d * (n - 0.5);
  return s + `<circle cx="${hx + d * 0.15}" cy="${y + h * 0.4}" r="${d * 0.08}" fill="${INK}"/><path d="M${hx} ${y + h / 2 - d / 2} l-1 -3 M${hx + d * 0.2} ${y + h / 2 - d / 2} l1 -3" stroke="${INK}" stroke-width="0.4"/>`;
}

function makeMeasuring(o, paper) {
  const rand = rng(+o.seed || 1);
  const unit = o.unit === 'inch' ? 'inch' : o.unit === 'cubes' ? 'cubes' : 'cm';
  const maxLen = unit === 'inch' ? 5 : 14;
  const kinds = ['pencil', 'crayon', 'brush', 'caterpillar'];
  const items = [];
  for (let i = 0; i < 6; i++) {
    const L = unit === 'inch' ? 2 + Math.floor(rand() * 4) : unit === 'cubes' ? 3 + Math.floor(rand() * 10) : 4 + Math.floor(rand() * 10);
    items.push({ L, kind: kinds[i % kinds.length], c: PALETTE[Math.floor(rand() * PALETTE.length)] });
  }
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const title = unit === 'cubes' ? 'How many cubes long?' : `Measure in ${unit === 'inch' ? 'inches' : 'centimetres'}`;
    const pg = new Page(paper, answers ? `${title}: answers` : title, { subtitle: answers ? 'Answer key for grown-ups.' : unit === 'cubes' ? 'Count the cubes under each picture. How long is it?' : 'Print at actual size (100%). Line the ruler up at 0 and read the length.', noName: answers });
    const rowH = (pg.room - 2) / items.length;
    items.forEach((it, i) => {
      const y = pg.y + i * rowH, x0 = pg.left + 8;
      const mm = unit === 'inch' ? it.L * 25.4 : it.L * 10;
      pg.add(measureObject(it.kind, x0, y + 5, mm, 8, it.c));
      if (unit === 'cubes') {
        for (let k = 0; k < it.L; k++) pg.add(`<rect x="${x0 + k * 10}" y="${y + 15}" width="10" height="10" fill="${TINTS[k % TINTS.length]}" stroke="${INK}" stroke-width="0.4"/>`);
      } else ruler(pg, x0, y + 15, unit, maxLen);
      const bx = pg.right - 30;
      const label = unit === 'cubes' ? 'cubes' : unit === 'inch' ? 'in' : 'cm';
      pg.add(`<rect x="${bx}" y="${y + 6}" width="14" height="10" rx="2" fill="#fff" stroke="${answers ? '#e0457b' : '#9a93b8'}" stroke-width="0.5"/><text x="${bx + 16}" y="${y + 13}" font-family="${FONT}" font-weight="800" font-size="4.4" fill="${INK}">${label}</text>`);
      if (answers) pg.add(`<text x="${bx + 7}" y="${y + 13.4}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="6" fill="#e0457b">${it.L}</text>`);
      if (i < items.length - 1) pg.add(`<line x1="${pg.left}" x2="${pg.right}" y1="${y + rowH - 1}" y2="${y + rowH - 1}" stroke="#ece9f6" stroke-width="0.4"/>`);
    });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ graphs
const GRAPH_SETS = {
  fruit: [['apples', 'apple'], ['bananas', 'banana'], ['strawberries', 'strawberry'], ['oranges', 'orange']],
  animals: [['cats', 'cat'], ['dogs', 'dog'], ['pigs', 'pig'], ['chicks', 'chick']],
  toys: [['balloons', 'balloon'], ['teddies', 'bear'], ['blocks', 'blocks'], ['stars', 'star']],
  treats: [['cupcakes', 'cupcake'], ['doughnuts', 'donut'], ['lollies', 'lolly'], ['cookies', 'cookie']],
};

function makeGraphs(o, paper) {
  const rand = rng(+o.seed || 1);
  const set = GRAPH_SETS[o.theme] || GRAPH_SETS.fruit;
  let counts;
  do { counts = set.map(() => 1 + Math.floor(rand() * 8)); } while (new Set(counts).size < counts.length);
  const kind = o.kind === 'tally' ? 'tally' : 'bar';
  // Scatter the pictures without overlaps.
  const slots = [];
  for (let r = 0; r < 5; r++) for (let c = 0; c < 8; c++) slots.push([c, r]);
  const spots = shuffle(slots, rand);
  const placed = [];
  set.forEach(([, art], k) => { for (let i = 0; i < counts[k]; i++) placed.push({ art, slot: spots[placed.length] }); });
  const most = counts.indexOf(Math.max(...counts)), fewest = counts.indexOf(Math.min(...counts));
  const [a, b] = shuffle([0, 1, 2, 3], rand);
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const pg = new Page(paper, answers ? 'Count and graph: answers' : kind === 'bar' ? 'Count and colour the graph' : 'Count and tally', { subtitle: answers ? 'Answer key for grown-ups.' : kind === 'bar' ? 'Count each picture. Colour one square for each one you count.' : 'Count each picture. Draw a tally mark for each one, then write the total.', noName: answers });
    const sceneH = 62;
    pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="${sceneH}" rx="8" fill="#f4fbf1" stroke="#cfe6c4" stroke-width="0.6"/>`);
    const cw = pg.width / 8, rh = sceneH / 5;
    placed.forEach(({ art, slot: [c, r] }) => pg.add(pic(ART(art), pg.left + cw * (c + 0.5) + (rand() - 0.5) * 3, pg.y + rh * (r + 0.5), rh * 0.95)));
    let y = pg.y + sceneH + 6;
    if (kind === 'bar') {
      const gh = 8, cell = Math.min(11, (pg.room - sceneH - 60) / gh);
      const colW = 26, gx = pg.left + 14;
      for (let r = 0; r < gh; r++) {
        pg.add(`<text x="${gx - 3}" y="${y + (gh - r - 0.5) * cell + 1.5}" text-anchor="end" font-family="${FONT}" font-weight="800" font-size="3.6" fill="${SOFT}">${r + 1}</text>`);
        set.forEach((_, k) => pg.add(`<rect x="${gx + k * colW + 4}" y="${y + (gh - r - 1) * cell}" width="${colW - 8}" height="${cell}" fill="${answers && r < counts[k] ? PALETTE[k * 2 % PALETTE.length] : '#fff'}" stroke="#9a93b8" stroke-width="0.35"/>`));
      }
      set.forEach(([name, art], k) => {
        pg.add(pic(ART(art), gx + k * colW + colW / 2, y + gh * cell + 7, 10));
        pg.add(`<text x="${gx + k * colW + colW / 2}" y="${y + gh * cell + 16}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.4" fill="${INK}">${name}</text>`);
      });
      y += gh * cell + 22;
    } else {
      set.forEach(([name, art], k) => {
        const ry = y + k * 16;
        pg.add(`<rect x="${pg.left}" y="${ry}" width="${pg.width}" height="14" rx="3" fill="${TINTS[k]}"/>`);
        pg.add(pic(ART(art), pg.left + 9, ry + 7, 11));
        pg.add(`<text x="${pg.left + 18}" y="${ry + 8.6}" font-family="${FONT}" font-weight="800" font-size="4.2" fill="${INK}">${name}</text>`);
        pg.add(`<rect x="${pg.right - 18}" y="${ry + 2}" width="14" height="10" rx="2" fill="#fff" stroke="#9a93b8" stroke-width="0.4"/>`);
        if (answers) {
          const n = counts[k];
          for (let i = 0; i < n; i++) {
            const grp = Math.floor(i / 5), inG = i % 5, tx = pg.left + 60 + grp * 16 + inG * 2.6;
            if (inG === 4) pg.add(`<line x1="${tx - 12}" y1="${ry + 10.5}" x2="${tx + 1}" y2="${ry + 3.5}" stroke="#e0457b" stroke-width="0.6"/>`);
            else pg.add(`<line x1="${tx}" y1="${ry + 3}" x2="${tx}" y2="${ry + 11}" stroke="#e0457b" stroke-width="0.6"/>`);
          }
          pg.add(`<text x="${pg.right - 11}" y="${ry + 9}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="6" fill="#e0457b">${n}</text>`);
        }
      });
      y += 4 * 16 + 6;
    }
    const qs = [[`Which is there the most of?`, set[most][0]], [`Which is there the fewest of?`, set[fewest][0]], [`How many ${set[a][0]} and ${set[b][0]} altogether?`, counts[a] + counts[b]]];
    qs.forEach(([q, ans], i) => {
      const qy = y + i * 11;
      if (qy + 8 > pg.bottom) return;
      pg.add(`<text x="${pg.left}" y="${qy + 5}" font-family="${FONT}" font-weight="800" font-size="4.4" fill="${INK}">${i + 1}. ${esc(q)}</text>`);
      if (answers) pg.add(`<text x="${pg.right}" y="${qy + 5}" text-anchor="end" font-family="${TITLE_FONT}" font-weight="800" font-size="5" fill="#e0457b">${ans}</text>`);
      else pg.add(`<line x1="${pg.right - 40}" x2="${pg.right}" y1="${qy + 6}" y2="${qy + 6}" stroke="#9a93b8" stroke-width="0.4"/>`);
    });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ reading log
const READ_CHALLENGES = [['img/dog.webp', 'Read to a pet or a teddy'], ['🏕️', 'Read in a den'], ['🔦', 'Read with a torch'], ['img/star.webp', 'Read a book about space'],
  ['🌳', 'Read outside'], ['😂', 'Read a funny book'], ['👵', 'Read to a grandparent'], ['📜', 'Read a poem'],
  ['img/lion.webp', 'Read about animals'], ['💬', 'Read a comic'], ['🔁', 'Read a book twice'], ['🧁', 'Read a recipe'],
  ['🛏️', 'Read before bed'], ['🤝', 'Read with a friend'], ['🎨', 'Draw your favourite part'], ['📚', 'Choose a new library book']];

function makeReadingLog(o, paper) {
  const name = nameOf(o.name, '');
  const pages = [];
  if (o.log !== false) {
    const pg = new Page(paper, name ? `${possessive(name)} Reading Log` : 'My Reading Log', { subtitle: 'Write down every book you read. Circle how much you liked it!', noName: true });
    const cols = [['Date', 22], ['Book title', 0], ['Minutes', 20], ['Did I like it?', 36], ['Grown-up', 22]];
    const fixed = cols.reduce((s, [, w]) => s + w, 0);
    cols[1][1] = pg.width - fixed;
    let x = pg.left;
    pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="9" rx="3" fill="#6c8cff"/>`);
    cols.forEach(([h, w]) => { pg.add(`<text x="${x + w / 2}" y="${pg.y + 6.2}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.8" fill="#fff">${h}</text>`); x += w; });
    const rows = Math.floor((pg.room - 12) / 13);
    for (let r = 0; r < rows; r++) {
      const y = pg.y + 11 + r * 13;
      pg.add(`<rect x="${pg.left}" y="${y}" width="${pg.width}" height="12" rx="2" fill="${r % 2 ? '#fff' : '#f6f4ff'}" stroke="#e3def3" stroke-width="0.3"/>`);
      let fx = pg.left;
      cols.forEach(([h, w], k) => {
        if (k) pg.add(`<line x1="${fx}" x2="${fx}" y1="${y}" y2="${y + 12}" stroke="#e3def3" stroke-width="0.3"/>`);
        if (h === 'Did I like it?') ['happy', 'calm', 'sad'].forEach((m, j) => pg.add(face(fx + 7 + j * 11, y + 6, 4, m, false)));
        fx += w;
      });
    }
    pages.push(pg.svg());
  }
  if (o.shelf !== false) {
    const pg = new Page(paper, name ? `${possessive(name)} Bookshelf` : 'My Bookshelf', { subtitle: 'Each time you finish a book, write its title on a spine and colour it in.', noName: true });
    const shelves = 4, sh = (pg.room - 30) / shelves;
    const rand = rng(7);
    for (let s = 0; s < shelves; s++) {
      const y = pg.y + s * sh;
      let x = pg.left + 4;
      while (x < pg.right - 14) {
        const w = 11 + rand() * 7, h = sh - 10 - rand() * 12;
        if (x + w > pg.right - 4) break;
        const lean = rand() < 0.1 && x > pg.left + 30;
        pg.add(`<g ${lean ? `transform="rotate(-8 ${x} ${y + sh - 4})"` : ''}><rect x="${x}" y="${y + sh - 4 - h}" width="${w}" height="${h}" rx="1.5" fill="#fff" stroke="${INK}" stroke-width="0.5"/><line x1="${x + 2}" x2="${x + w - 2}" y1="${y + sh - 4 - h + 5}" y2="${y + sh - 4 - h + 5}" stroke="${INK}" stroke-width="0.3"/><line x1="${x + 2}" x2="${x + w - 2}" y1="${y + sh - 10}" y2="${y + sh - 10}" stroke="${INK}" stroke-width="0.3"/></g>`);
        x += w + 1.2;
      }
      pg.add(`<rect x="${pg.left}" y="${y + sh - 4}" width="${pg.width}" height="4" rx="1" fill="#e8c9a0" stroke="${INK}" stroke-width="0.5"/>`);
    }
    const fy = pg.bottom - 24;
    pg.add(`<rect x="${pg.left}" y="${fy}" width="${pg.width}" height="22" rx="6" fill="#fff6e0" stroke="#ffb938" stroke-width="0.6" stroke-dasharray="2.5 1.5"/>`);
    pg.add(pic(ART('present'), pg.left + 12, fy + 11, 14));
    pg.add(`<text x="${pg.left + 24}" y="${fy + 9}" font-family="${FONT}" font-weight="800" font-size="4" fill="${SOFT}">When my shelf is full, I get:</text><line x1="${pg.left + 24}" x2="${pg.right - 6}" y1="${fy + 17}" y2="${fy + 17}" stroke="#9a93b8" stroke-width="0.4"/>`);
    pages.push(pg.svg());
  }
  if (o.challenge !== false) {
    const pg = new Page(paper, 'Reading challenge', { subtitle: 'Tick a box each time you do one. Can you do them all?', noName: !!name });
    const cols = 4, rows = 4, cw = pg.width / cols, ch = (pg.room - 2) / rows;
    READ_CHALLENGES.forEach(([src, label], i) => {
      const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch;
      const c = i % PALETTE.length;
      pg.add(`<rect x="${x + 1.5}" y="${y + 1.5}" width="${cw - 3}" height="${ch - 3}" rx="7" fill="${TINTS[c]}" stroke="${PALETTE[c]}" stroke-width="0.6"/>`);
      pg.add(pic(P(src), x + cw / 2, y + ch * 0.34, Math.min(cw, ch) * 0.36));
      textLines(pg, wrap(label, 15), x + cw / 2, y + ch * 0.66, 4.2, { anchor: 'middle', weight: 800 });
      pg.add(`<rect x="${x + cw - 10}" y="${y + ch - 10}" width="6" height="6" rx="1.4" fill="#fff" stroke="${INK}" stroke-width="0.5"/>`);
    });
    pages.push(pg.svg());
  }
  if (!pages.length) pages.push(new Page(paper, 'Reading log', { subtitle: 'Tick at least one page.', noName: true }).svg());
  return pages;
}

// ================================================================ handwriting paper
function makePaper(o, paper) {
  const size = { big: 18, medium: 13, small: 9 }[o.lines] || 13;
  const style = o.style || 'rainbow';
  const pg = new Page(paper, (o.title || '').trim() || 'My writing', { subtitle: '' });
  if (o.picture === true) {
    const ph = Math.min(100, pg.room * 0.42);
    pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="${ph}" rx="6" fill="#fff" stroke="${INK}" stroke-width="0.7"/>`);
    pg.y += ph + 8;
  }
  const rh = rowHeight(size) * (style === 'plain' ? 0.62 : 0.95);
  while (pg.room >= rh) {
    if (style === 'plain') {
      pg.add(`<line x1="${pg.left}" x2="${pg.right}" y1="${pg.y + rh * 0.9}" y2="${pg.y + rh * 0.9}" stroke="#9a93b8" stroke-width="0.4"/>`);
    } else if (style === 'rainbow') {
      const y = pg.y, base = y + size;
      pg.add(`<line x1="${pg.left}" x2="${pg.right}" y1="${y}" y2="${y}" stroke="#6c8cff" stroke-width="0.5"/>`);
      pg.add(`<line x1="${pg.left}" x2="${pg.right}" y1="${y + size / 2}" y2="${y + size / 2}" stroke="#8bc34a" stroke-width="0.4" stroke-dasharray="1.8 1.4"/>`);
      pg.add(`<line x1="${pg.left}" x2="${pg.right}" y1="${base}" y2="${base}" stroke="#ff6b6b" stroke-width="0.6"/>`);
      pg.add(`<line x1="${pg.left}" x2="${pg.right}" y1="${base + size / 2}" y2="${base + size / 2}" stroke="#e8e4f3" stroke-width="0.35"/>`);
    } else pg.guides(pg.y, size);
    pg.y += rh;
  }
  if (o.border === true) {
    pg.add(`<rect x="${pg.m - 5}" y="${pg.m - 5}" width="${pg.w - 2 * pg.m + 10}" height="${pg.h - 2 * pg.m + 6}" rx="8" fill="none" stroke="#ffb938" stroke-width="1" stroke-dasharray="4 3"/>`);
  }
  return [pg.svg()];
}

// ================================================================ story writing
const STORY_PROMPTS = {
  dragon: { title: 'The Dragon at the Door', pic: '🐉', starter: 'One morning there was a knock at the door. It was a dragon!', words: ['dragon', 'door', 'fire', 'friend', 'fly'] },
  seed: { title: 'The Magic Seed', pic: '🌱', starter: 'I planted a tiny seed, and in the night it grew and grew...', words: ['seed', 'magic', 'tall', 'climb', 'giant'] },
  moon: { title: 'My Trip to the Moon', pic: '🚀', starter: 'I climbed into my rocket and counted: 3, 2, 1, blast off!', words: ['rocket', 'moon', 'stars', 'float', 'planet'] },
  cat: { title: 'The Talking Cat', pic: 'img/cat.webp', starter: 'My cat looked up at me and said...', words: ['cat', 'talk', 'secret', 'whisper', 'surprise'] },
  sea: { title: 'Under the Sea', pic: 'img/octopus.webp', starter: 'I put on my flippers and dived into the blue sea.', words: ['fish', 'shell', 'octopus', 'bubbles', 'swim'] },
  birthday: { title: 'The Best Birthday', pic: 'img/cake.webp', starter: 'When I woke up on my birthday, I could not believe my eyes!', words: ['cake', 'party', 'present', 'balloon', 'friends'] },
  puppy: { title: 'The Lost Puppy', pic: 'img/dog.webp', starter: 'I found a little puppy all alone in the park.', words: ['puppy', 'lost', 'home', 'help', 'happy'] },
  power: { title: 'If I Had a Superpower', pic: '🦸', starter: 'If I could have one superpower, I would choose...', words: ['fly', 'strong', 'invisible', 'fast', 'help'] },
};

function makeStoryWriting(o, paper) {
  const rand = rng(+o.seed || 1);
  const name = nameOf(o.name, '');
  const key = STORY_PROMPTS[o.prompt] ? o.prompt : Object.keys(STORY_PROMPTS)[Math.floor(rand() * Object.keys(STORY_PROMPTS).length)];
  const pr = STORY_PROMPTS[key];
  const size = o.lines === 'small' ? 8 : 10.5;
  const pages = [];
  if (o.layout === 'comic') {
    const pg = new Page(paper, name ? `${possessive(name)} comic: ${pr.title}` : `My comic: ${pr.title}`, { subtitle: 'Draw what happens in each box. Write words in the speech bubbles and on the lines.', noName: !!name });
    const cols = 2, rows = 3, cw = pg.width / cols, ch = (pg.room - 2) / rows;
    for (let i = 0; i < 6; i++) {
      const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch;
      const bh = ch - 16;
      pg.add(`<rect x="${x + 2}" y="${y + 2}" width="${cw - 4}" height="${bh}" rx="3" fill="#fff" stroke="${INK}" stroke-width="0.9"/>`);
      pg.add(`<circle cx="${x + 9}" cy="${y + 9}" r="4" fill="${PALETTE[i]}"/><text x="${x + 9}" y="${y + 10.6}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="4" fill="#fff">${i + 1}</text>`);
      const bx = x + cw - 42, by = y + 7;
      pg.add(`<path d="M${bx} ${by + 7} Q${bx} ${by} ${bx + 18} ${by} Q${bx + 36} ${by} ${bx + 36} ${by + 7} Q${bx + 36} ${by + 14} ${bx + 18} ${by + 14} L${bx + 10} ${by + 20} L${bx + 12} ${by + 14} Q${bx} ${by + 14} ${bx} ${by + 7} Z" fill="#fff" stroke="${INK}" stroke-width="0.6"/>`);
      pg.add(`<line x1="${x + 4}" x2="${x + cw - 4}" y1="${y + bh + 8}" y2="${y + bh + 8}" stroke="#9a93b8" stroke-width="0.4"/>`);
    }
    return [pg.svg()];
  }
  const pg = new Page(paper, pr.title, { subtitle: name ? `A story by ${name}` : 'A story by ____________________', noName: true });
  const topH = 58;
  pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width * 0.58}" height="${topH}" rx="6" fill="#fff" stroke="${INK}" stroke-width="0.7"/>`);
  pg.add(pic(P(pr.pic), pg.left + 18, pg.y + 18, 24));
  pg.add(`<text x="${pg.left + pg.width * 0.29 + 10}" y="${pg.y + topH - 5}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="3.4" fill="${SOFT}">Draw your story here</text>`);
  const wx = pg.left + pg.width * 0.58 + 5, ww = pg.width * 0.42 - 5;
  pg.add(`<rect x="${wx}" y="${pg.y}" width="${ww}" height="${topH}" rx="6" fill="#fff6e0" stroke="#ffb938" stroke-width="0.6"/>`);
  pg.add(`<text x="${wx + 5}" y="${pg.y + 8}" font-family="${FONT}" font-weight="800" font-size="4" fill="${SOFT}">Words to help you</text>`);
  pr.words.forEach((w, i) => pg.add(`<text x="${wx + 8}" y="${pg.y + 17 + i * 8.5}" font-family="${TITLE_FONT}" font-weight="800" font-size="5.5" fill="${INK}">• ${w}</text>`));
  pg.y += topH + 8;
  const lines = wrap(pr.starter, Math.floor((pg.width - 6) / (size * 0.46)));
  pg.add(`<text x="${pg.left}" y="${pg.y + 3}" font-family="${FONT}" font-weight="800" font-size="3.8" fill="${SOFT}">Start like this, then carry on:</text>`);
  pg.y += 7;
  const rh = rowHeight(size) * 0.92;
  let li = 0;
  while (pg.room >= rh) {
    pg.guides(pg.y, size);
    if (li < lines.length) pg.add(`<text x="${pg.left + 2}" y="${pg.y + size - 0.5}" font-family="${FONT}" font-weight="700" font-size="${size * 0.95}" fill="#b0aac8">${esc(lines[li])}</text>`);
    li++;
    pg.y += rh;
  }
  pages.push(pg.svg());
  return pages;
}

// ================================================================ name labels
const ALPHA_LINE = 'Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz';

function makeLabels(o, paper) {
  const names = listOf(o.names, 40).map((n) => nameOf(n, ''));
  if (!names.length) names.push('Mia', 'Leo', 'Emma', 'Sam');
  const arts = ['cat', 'dog', 'lion', 'turtle', 'monkey', 'octopus', 'pig', 'zebra', 'bear', 'chick', 'fish', 'ladybird', 'gorilla', 'star', 'rainbow', 'sunflower'];
  const kind = o.kind || 'desk';
  const pages = [];
  if (kind === 'desk') {
    for (let i = 0; i < names.length; i += 3) {
      const pg = new Page(paper, '', { bare: true });
      const h = (pg.bottom - pg.m) / 3;
      names.slice(i, i + 3).forEach((n, j) => {
        const y = pg.m + j * h, c = (i + j) % PALETTE.length;
        pg.add(`<rect x="${pg.left}" y="${y + 2}" width="${pg.width}" height="${h - 6}" rx="8" fill="${TINTS[c]}" stroke="${PALETTE[c]}" stroke-width="1"/>`);
        pg.add(pic(ART(arts[(i + j) % arts.length]), pg.left + 20, y + 26, 30));
        pg.add(`<text x="${pg.left + 42}" y="${y + 34}" font-family="${TITLE_FONT}" font-weight="800" font-size="${fitFont(n, 22, pg.width - 60, 0.55).toFixed(2)}" fill="${INK}">${esc(n)}</text>`);
        pg.add(`<text x="${pg.w / 2}" y="${y + h - 26}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${Math.min(4.4, (pg.width - 10) / (ALPHA_LINE.length * 0.56)).toFixed(2)}" fill="${INK}">${ALPHA_LINE}</text>`);
        // Number line 0 to 20
        const nx = pg.left + 8, nw = pg.width - 16, ny = y + h - 15;
        pg.add(`<line x1="${nx}" x2="${nx + nw}" y1="${ny}" y2="${ny}" stroke="${INK}" stroke-width="0.5"/>`);
        for (let k = 0; k <= 20; k++) {
          const tx = nx + (k * nw) / 20;
          pg.add(`<line x1="${tx}" x2="${tx}" y1="${ny - 1.6}" y2="${ny + 1.6}" stroke="${INK}" stroke-width="0.4"/><text x="${tx}" y="${ny + 6}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.4" fill="${INK}">${k}</text>`);
        }
      });
      pages.push(pg.svg());
    }
    return pages;
  }
  // Book and peg labels, 12 to a page
  const per = 12;
  for (let i = 0; i < Math.max(names.length, 1); i += per) {
    const pg = new Page(paper, '', { bare: true });
    const cols = 3, rows = 4, cw = pg.width / cols, ch = (pg.bottom - pg.m) / rows;
    const list = names.length >= per || o.repeat === false ? names.slice(i, i + per) : [...Array(per)].map((_, k) => names[k % names.length]);
    list.forEach((n, k) => {
      const x = pg.left + (k % cols) * cw, y = pg.m + Math.floor(k / cols) * ch, c = (i + k) % PALETTE.length;
      pg.add(`<rect x="${x + 2}" y="${y + 2}" width="${cw - 4}" height="${ch - 4}" rx="9" fill="#fff" stroke="${PALETTE[c]}" stroke-width="1"/>`);
      pg.add(`<rect x="${x + 4.5}" y="${y + 4.5}" width="${cw - 9}" height="${ch - 9}" rx="7" fill="${TINTS[c]}"/>`);
      pg.add(pic(ART(arts[(names.indexOf(n) + arts.length) % arts.length]), x + cw / 2, y + ch * 0.38, ch * 0.42));
      pg.add(`<text x="${x + cw / 2}" y="${y + ch * 0.82}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${fitFont(n, 9, cw - 14, 0.55).toFixed(2)}" fill="${INK}">${esc(n)}</text>`);
    });
    pages.push(pg.svg());
  }
  return pages;
}

Object.assign(MAKERS, { placevalue: makePlaceValue, shapes: makeShapes, measuring: makeMeasuring, graphs: makeGraphs, readinglog: makeReadingLog, writingpaper: makePaper, storywriting: makeStoryWriting, labels: makeLabels });

;
// PrintPals batch 6: pre-writing lines, cut and paste, homework planner, crowns and masks,
// weather chart and cards to colour.

// ================================================================ pre-writing lines
const PRE_PAIRS = [['🐝', ART('sunflower')], [ART('dog'), '🦴'], ['🐰', '🥕'], [ART('monkey'), ART('banana')], ['🐭', '🧀'], ['🚗', '🏠'],
  [ART('fish'), '🐚'], [ART('ladybird'), '🍃'], ['🚀', '🌙'], [ART('bear'), '🍯'], [ART('cat'), '🧶'], [ART('chick'), ART('egg')]];
const PRE_TYPES = ['straight', 'bumps', 'wave', 'zigzag', 'castle', 'loops'];

function prePath(type, x0, x1, y, amp) {
  const pts = [];
  const w = x1 - x0;
  const N = 240;
  for (let i = 0; i <= N; i++) {
    const u = i / N, x = x0 + u * w;
    const cycles = Math.max(3, Math.round(w / (amp * 3.2)));
    const ph = u * cycles * 2 * Math.PI;
    let yy = y;
    if (type === 'wave') yy = y - Math.sin(ph) * amp;
    else if (type === 'zigzag') { const f = (u * cycles * 2) % 2; yy = y - (f < 1 ? f : 2 - f) * amp * 2 + amp; }
    else if (type === 'bumps') yy = y - Math.abs(Math.sin(ph / 2)) * amp * 2 + amp;
    else if (type === 'castle') { const f = (u * cycles) % 1; yy = f < 0.5 ? y - amp : y + amp; }
    else if (type === 'loops') {
      const t = u * cycles * 2 * Math.PI;
      pts.push([x0 + (t - 1.9 * Math.sin(t)) * (w / (cycles * 2 * Math.PI)), y + amp - amp * (1 - Math.cos(t))]);
      continue;
    }
    pts.push([x, yy]);
  }
  if (type === 'castle') {
    // Square steps need sharp corners.
    const cycles = Math.max(3, Math.round(w / (amp * 3.2)));
    let d = `M${x0} ${y + amp}`;
    for (let k = 0; k < cycles; k++) {
      const a = x0 + (k * w) / cycles, b = x0 + ((k + 0.5) * w) / cycles, c = x0 + ((k + 1) * w) / cycles;
      d += ` L${a} ${y - amp} L${b} ${y - amp} L${b} ${y + amp} L${c} ${y + amp}`;
    }
    return d;
  }
  return 'M' + pts.map(([px, py]) => `${px.toFixed(2)} ${py.toFixed(2)}`).join(' L');
}

function makePrewriting(o, paper) {
  const rand = rng(+o.seed || 1);
  const pairs = shuffle(PRE_PAIRS, rand);
  const single = PRE_TYPES.includes(o.type);
  const pages = [];
  const rowsPer = 6;
  const pageCount = single ? 1 : 2;
  for (let p = 0; p < pageCount; p++) {
    const pg = new Page(paper, single ? `Trace the ${o.type === 'straight' ? 'lines' : o.type}` : 'Trace the lines', { subtitle: 'Start at the green dot and follow the dots without lifting your pencil.' });
    const rowH = (pg.room - 2) / rowsPer;
    for (let r = 0; r < rowsPer; r++) {
      const type = single ? o.type : PRE_TYPES[(p * rowsPer + r) % PRE_TYPES.length];
      const [a, b] = pairs[(p * rowsPer + r) % pairs.length];
      const y = pg.y + r * rowH + rowH / 2;
      const ps = Math.min(18, rowH * 0.6);
      pg.add(pic(a, pg.left + ps / 2 + 1, y, ps));
      pg.add(pic(b, pg.right - ps / 2 - 1, y, ps));
      const amp = Math.min(rowH * 0.28, single ? 4 + r * 1.1 : 7);
      const x0 = pg.left + ps + 5, x1 = pg.right - ps - 5;
      const d = prePath(type, x0, x1, y, amp);
      const thick = o.guide === 'thick';
      if (thick) pg.add(`<path d="${d}" fill="none" stroke="#efeaf9" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`);
      pg.add(`<path d="${d}" fill="none" stroke="#8d86ad" stroke-width="1.2" stroke-dasharray="0 2.6" stroke-linecap="round" stroke-linejoin="round"/>`);
      const m = /M([\d.]+) ([\d.]+)/.exec(d);
      pg.add(`<circle cx="${m[1]}" cy="${m[2]}" r="2.2" fill="#3fbf7f"/>`);
    }
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ cut and paste
const SORTS = {
  land: { title: 'Land or water?', a: ['Lives on land', '🌳'], b: ['Lives in water', '🌊'],
    itemsA: [['lion', ART('lion')], ['zebra', ART('zebra')], ['dog', ART('dog')], ['cat', ART('cat')], ['monkey', ART('monkey')], ['pig', ART('pig')], ['bear', ART('bear')], ['gorilla', ART('gorilla')]],
    itemsB: [['fish', ART('fish')], ['octopus', ART('octopus')], ['whale', '🐳'], ['crab', '🦀'], ['dolphin', '🐬'], ['shark', '🦈'], ['seal', '🦭'], ['turtle', ART('turtle')]] },
  food: { title: 'Fruit or vegetable?', a: ['Fruit', ART('apple')], b: ['Vegetable', '🥕'],
    itemsA: [['apple', ART('apple')], ['banana', ART('banana')], ['strawberry', ART('strawberry')], ['orange', ART('orange')], ['grapes', '🍇'], ['pear', '🍐'], ['cherries', '🍒'], ['watermelon', '🍉']],
    itemsB: [['carrot', '🥕'], ['broccoli', '🥦'], ['corn', '🌽'], ['cucumber', '🥒'], ['potato', '🥔'], ['pepper', '🫑'], ['onion', '🧅'], ['aubergine', '🍆']] },
  temp: { title: 'Hot or cold?', a: ['Hot', ART('sun')], b: ['Cold', '❄️'],
    itemsA: [['sun', ART('sun')], ['fire', '🔥'], ['hot drink', '☕'], ['soup', '🍲'], ['desert', '🏜️'], ['oven', '🧑‍🍳'], ['beach', '🏖️'], ['chilli', '🌶️']],
    itemsB: [['snow', '❄️'], ['snowman', '⛄'], ['ice', '🧊'], ['ice cream', '🍦'], ['penguin', '🐧'], ['gloves', '🧤'], ['igloo', '🏔️'], ['scarf', '🧣']] },
};
const LETTER_PICS = [['A', 'apple'], ['B', 'balloon'], ['C', 'cat'], ['D', 'dog'], ['E', 'egg'], ['F', 'fish'], ['H', 'hat'], ['L', 'lion'], ['M', 'monkey'], ['O', 'octopus'], ['P', 'pig'], ['S', 'sun'], ['T', 'turtle'], ['Z', 'zebra']];

function cutTile(pg, x, y, s, inner, c) {
  pg.add(`<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="3" fill="${TINTS[c % TINTS.length]}" stroke="#9a93b8" stroke-width="0.45" stroke-dasharray="2 1.4"/>`);
  pg.add(inner);
}

function makeCutPaste(o, paper) {
  const rand = rng(+o.seed || 1);
  const kind = o.kind || 'sort';
  const pages = [];
  let key = [];
  const pg = new Page(paper, 'Cut and stick', { subtitle: 'Cut out the pictures at the bottom and stick each one in the right place.' });
  const tile = 30;
  if (kind === 'sort') {
    const set = SORTS[o.sort] || SORTS.land;
    const A = shuffle(set.itemsA, rand).slice(0, 4), B = shuffle(set.itemsB, rand).slice(0, 4);
    pg.add(`<text x="${pg.w / 2}" y="${pg.y + 4}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="8" fill="${INK}">${set.title}</text>`);
    pg.y += 10;
    const bw = (pg.width - 6) / 2, bh = 2 * tile + 30;
    [[set.a, 0], [set.b, 1]].forEach(([[label, icon], k]) => {
      const x = pg.left + k * (bw + 6);
      pg.add(`<rect x="${x}" y="${pg.y}" width="${bw}" height="${bh}" rx="8" fill="${TINTS[k * 3]}" stroke="${PALETTE[k * 3]}" stroke-width="1"/>`);
      pg.add(pic(icon, x + 12, pg.y + 11, 13));
      pg.add(`<text x="${x + 22}" y="${pg.y + 13}" font-family="${TITLE_FONT}" font-weight="800" font-size="6.5" fill="${INK}">${label}</text>`);
      for (let i = 0; i < 4; i++) pg.add(`<rect x="${x + bw / 2 - tile - 2 + (i % 2) * (tile + 4)}" y="${pg.y + 22 + Math.floor(i / 2) * (tile + 4)}" width="${tile}" height="${tile}" rx="3" fill="#fff" stroke="#c9c3e3" stroke-width="0.4"/>`);
    });
    pg.y += bh + 10;
    const pieces = shuffle([...A, ...B], rand);
    key = [`${set.a[0]}: ${A.map((i) => i[0]).join(', ')}`, `${set.b[0]}: ${B.map((i) => i[0]).join(', ')}`];
    scissors(pg, pg.y);
    pg.y += 6;
    const gap = (pg.width - 4 * tile) / 5;
    pieces.forEach(([name, src], i) => {
      const x = pg.left + gap + (i % 4) * (tile + gap), y = pg.y + Math.floor(i / 4) * (tile + 8);
      cutTile(pg, x, y, tile, pic(src, x + tile / 2, y + tile / 2 - 2, tile * 0.64) + `<text x="${x + tile / 2}" y="${y + tile - 2.5}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.2" fill="${INK}">${name}</text>`, i);
    });
  } else if (kind === 'count') {
    const arts = ['apple', 'star', 'strawberry', 'ladybird', 'cupcake', 'balloon', 'orange', 'chick', 'heart', 'cookie'];
    pg.add(`<text x="${pg.w / 2}" y="${pg.y + 4}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="8" fill="${INK}">Count and stick</text>`);
    pg.y += 10;
    const cw = pg.width / 5;
    for (let n = 1; n <= 10; n++) {
      const x = pg.left + ((n - 1) % 5) * cw, y = pg.y + Math.floor((n - 1) / 5) * (tile + 20);
      pg.add(`<text x="${x + cw / 2}" y="${y + 8}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="9" fill="${PALETTE[(n - 1) % PALETTE.length]}">${n}</text>`);
      pg.add(`<rect x="${x + (cw - tile) / 2}" y="${y + 11}" width="${tile}" height="${tile}" rx="3" fill="#fff" stroke="#c9c3e3" stroke-width="0.4"/>`);
    }
    pg.y += 2 * (tile + 20) + 6;
    scissors(pg, pg.y);
    pg.y += 6;
    const order = shuffle([...Array(10).keys()].map((k) => k + 1), rand);
    const gap = (pg.width - 5 * tile) / 6;
    order.forEach((n, i) => {
      const x = pg.left + gap + (i % 5) * (tile + gap), y = pg.y + Math.floor(i / 5) * (tile + 6);
      const art = ART(arts[n - 1]);
      let inner = '';
      const cols = n > 4 ? Math.ceil(n / 2) > 3 ? 4 : 3 : n, rows = Math.ceil(n / cols), s = Math.min((tile - 4) / cols, (tile - 4) / rows);
      for (let k = 0; k < n; k++) inner += pic(art, x + tile / 2 - ((Math.min(cols, n) - 1) * s) / 2 + (k % cols) * s, y + tile / 2 - ((rows - 1) * s) / 2 + Math.floor(k / cols) * s, s * 0.9);
      cutTile(pg, x, y, tile, inner, i);
    });
    key = ['Each box gets the picture with that many things in it.'];
  } else {
    const picks = shuffle(LETTER_PICS, rand).slice(0, 6);
    pg.add(`<text x="${pg.w / 2}" y="${pg.y + 4}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="8" fill="${INK}">Which letter does it start with?</text>`);
    pg.y += 10;
    const cw = pg.width / 3;
    picks.forEach(([L], i) => {
      const x = pg.left + (i % 3) * cw, y = pg.y + Math.floor(i / 3) * (tile + 22);
      pg.add(`<text x="${x + cw / 2}" y="${y + 9}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="10" fill="${PALETTE[i]}">${L} ${L.toLowerCase()}</text>`);
      pg.add(`<rect x="${x + (cw - tile) / 2}" y="${y + 12}" width="${tile}" height="${tile}" rx="3" fill="#fff" stroke="#c9c3e3" stroke-width="0.4"/>`);
    });
    pg.y += 2 * (tile + 22) + 6;
    scissors(pg, pg.y);
    pg.y += 6;
    const gap = (pg.width - 6 * tile) / 7;
    shuffle(picks, rand).forEach(([L, art], i) => {
      const x = pg.left + gap + i * (tile + gap), y = pg.y;
      cutTile(pg, x, y, tile, pic(ART(art), x + tile / 2, y + tile / 2 - 2, tile * 0.66) + `<text x="${x + tile / 2}" y="${y + tile - 2.5}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.2" fill="${INK}">${art}</text>`, i);
    });
    key = picks.map(([L, art]) => `${L}: ${art}`);
  }
  pg.add(`<text x="${pg.right}" y="${pg.bottom - 1}" text-anchor="end" font-family="${FONT}" font-weight="700" font-size="2.8" fill="#c9c3e3">${esc(key.join('   '))}</text>`);
  pages.push(pg.svg());
  return pages;
}

// ================================================================ homework planner
function makeHomework(o, paper) {
  const name = nameOf(o.name, '');
  const pg = new Page(paper, name ? `${possessive(name)} Homework Planner` : 'My Homework Planner', { subtitle: 'Week of: ______________________', noName: true });
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const rowH = 20;
  pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="8" rx="3" fill="#6c8cff"/>`);
  pg.add(`<text x="${pg.left + 4}" y="${pg.y + 5.6}" font-family="${FONT}" font-weight="800" font-size="3.8" fill="#fff">Day</text><text x="${pg.left + 34}" y="${pg.y + 5.6}" font-family="${FONT}" font-weight="800" font-size="3.8" fill="#fff">My homework</text><text x="${pg.right - 12}" y="${pg.y + 5.6}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.8" fill="#fff">Done</text>`);
  days.forEach((d, i) => {
    const y = pg.y + 10 + i * rowH;
    pg.add(`<rect x="${pg.left}" y="${y}" width="${pg.width}" height="${rowH - 2}" rx="4" fill="${TINTS[i]}"/>`);
    pg.add(`<text x="${pg.left + 4}" y="${y + rowH / 2 + 1}" font-family="${TITLE_FONT}" font-weight="800" font-size="5" fill="${INK}">${d}</text>`);
    pg.add(`<line x1="${pg.left + 34}" x2="${pg.right - 26}" y1="${y + 8}" y2="${y + 8}" stroke="#9a93b8" stroke-width="0.35"/><line x1="${pg.left + 34}" x2="${pg.right - 26}" y1="${y + 15}" y2="${y + 15}" stroke="#9a93b8" stroke-width="0.35"/>`);
    pg.add(`<path d="${starPath(pg.right - 12, y + rowH / 2 - 1, 5.5, 0.47)}" fill="#fff" stroke="${PALETTE[i]}" stroke-width="0.7" stroke-linejoin="round"/>`);
  });
  let y = pg.y + 10 + days.length * rowH + 4;
  const bw = (pg.width - 5) / 2, bh = 66;
  // Spellings
  pg.add(`<rect x="${pg.left}" y="${y}" width="${bw}" height="${bh}" rx="6" fill="#fff" stroke="${PALETTE[0]}" stroke-width="0.7"/>`);
  pg.add(`<text x="${pg.left + 5}" y="${y + 8}" font-family="${TITLE_FONT}" font-weight="800" font-size="5.2" fill="${INK}">✏️ Spellings this week</text>`);
  for (let i = 0; i < 8; i++) pg.add(`<text x="${pg.left + 5}" y="${y + 17 + i * 6.3}" font-family="${FONT}" font-weight="800" font-size="3.4" fill="${SOFT}">${i + 1}.</text><line x1="${pg.left + 11}" x2="${pg.left + bw - 5}" y1="${y + 17.5 + i * 6.3}" y2="${y + 17.5 + i * 6.3}" stroke="#d9d4ec" stroke-width="0.35"/>`);
  // Reading
  const rx = pg.left + bw + 5;
  pg.add(`<rect x="${rx}" y="${y}" width="${bw}" height="${bh}" rx="6" fill="#fff" stroke="${PALETTE[3]}" stroke-width="0.7"/>`);
  pg.add(`<text x="${rx + 5}" y="${y + 8}" font-family="${TITLE_FONT}" font-weight="800" font-size="5.2" fill="${INK}">📚 Reading</text>`);
  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach((d, i) => {
    const yy = y + 16 + i * 7;
    pg.add(`<text x="${rx + 5}" y="${yy + 1.2}" font-family="${FONT}" font-weight="800" font-size="3.6" fill="${INK}">${d}</text><circle cx="${rx + 20}" cy="${yy}" r="2.4" fill="#fff" stroke="${INK}" stroke-width="0.4"/><line x1="${rx + 26}" x2="${rx + bw - 5}" y1="${yy + 1.5}" y2="${yy + 1.5}" stroke="#d9d4ec" stroke-width="0.35"/>`);
  });
  y += bh + 5;
  // Things to bring
  const items = [['👟', 'PE kit'], ['📚', 'Library book'], ['📁', 'Reading folder'], ['💧', 'Water bottle'], ['✏️', 'Homework'], ['🎒', 'School bag']];
  const th = Math.min(34, pg.bottom - y - 30);
  if (th > 22) {
    pg.add(`<rect x="${pg.left}" y="${y}" width="${pg.width}" height="${th}" rx="6" fill="#fff6e0" stroke="#ffb938" stroke-width="0.6"/>`);
    pg.add(`<text x="${pg.left + 5}" y="${y + 8}" font-family="${TITLE_FONT}" font-weight="800" font-size="5.2" fill="${INK}">Remember to bring</text>`);
    const iw = pg.width / 3;
    items.forEach(([ic, label], i) => {
      const x = pg.left + 5 + (i % 3) * iw, yy = y + 16 + Math.floor(i / 3) * 9;
      pg.add(`<rect x="${x}" y="${yy - 3.6}" width="4.4" height="4.4" rx="1" fill="#fff" stroke="${INK}" stroke-width="0.4"/>`);
      pg.add(emoji(ic, x + 9, yy - 1.4, 4.6));
      pg.add(`<text x="${x + 13}" y="${yy}" font-family="${FONT}" font-weight="800" font-size="3.8" fill="${INK}">${label}</text>`);
    });
    y += th + 5;
  }
  const nh = pg.bottom - y - 1;
  if (nh > 14) {
    pg.add(`<rect x="${pg.left}" y="${y}" width="${pg.width}" height="${nh}" rx="6" fill="#fff" stroke="#d9d4ec" stroke-width="0.6"/>`);
    pg.add(`<text x="${pg.left + 5}" y="${y + 7}" font-family="${FONT}" font-weight="800" font-size="4" fill="${SOFT}">Notes for home and school</text>`);
  }
  return [pg.svg()];
}

// ================================================================ crowns and masks
const MASKS = {
  cat: { name: 'cat', draw: () => [
    `<path d="M40 70 L34 12 L86 46 Z" ${LW}/><path d="M160 70 L166 12 L114 46 Z" ${LW}/><path d="M46 60 L42 26 L74 46" ${LT}/><path d="M154 60 L158 26 L126 46" ${LT}/>`,
    `<ellipse cx="100" cy="98" rx="76" ry="62" ${LW}/>`] , nose: 'cat' },
  bear: { name: 'bear', draw: () => [
    `<circle cx="46" cy="44" r="24" ${LW}/><circle cx="46" cy="44" r="12" ${LW}/><circle cx="154" cy="44" r="24" ${LW}/><circle cx="154" cy="44" r="12" ${LW}/>`,
    `<ellipse cx="100" cy="98" rx="76" ry="62" ${LW}/>`, `<ellipse cx="100" cy="128" rx="30" ry="20" ${LW}/>`], nose: 'bear' },
  lion: { name: 'lion', draw: () => {
    let d = '';
    for (let i = 0; i <= 16; i++) { const a = (i * 2 * Math.PI) / 16, b = ((i + 0.5) * 2 * Math.PI) / 16; const x = 100 + Math.cos(a) * 84, y = 96 + Math.sin(a) * 74; d += i ? ` Q${100 + Math.cos(b - Math.PI / 16) * 104} ${96 + Math.sin(b - Math.PI / 16) * 92} ${x} ${y}` : `M${x} ${y}`; }
    return [`<path d="${d} Z" ${LW}/>`, `<circle cx="52" cy="42" r="12" ${LW}/><circle cx="148" cy="42" r="12" ${LW}/>`, `<ellipse cx="100" cy="100" rx="64" ry="56" ${LW}/>`, `<ellipse cx="100" cy="128" rx="26" ry="18" ${LW}/>`];
  }, nose: 'cat' },
  bunny: { name: 'bunny', draw: () => [
    `<ellipse cx="66" cy="34" rx="16" ry="40" transform="rotate(-10 66 34)" ${LW}/><ellipse cx="66" cy="36" rx="7" ry="28" transform="rotate(-10 66 36)" ${LW}/>`,
    `<ellipse cx="134" cy="34" rx="16" ry="40" transform="rotate(10 134 34)" ${LW}/><ellipse cx="134" cy="36" rx="7" ry="28" transform="rotate(10 134 36)" ${LW}/>`,
    `<ellipse cx="100" cy="104" rx="72" ry="58" ${LW}/>`], nose: 'cat' },
  frog: { name: 'frog', draw: () => [
    `<circle cx="62" cy="58" r="30" ${LW}/><circle cx="138" cy="58" r="30" ${LW}/>`,
    `<ellipse cx="100" cy="106" rx="84" ry="54" ${LW}/>`], nose: 'frog' },
};

function maskFace(kind, nose) {
  const holes = `<ellipse cx="68" cy="${kind === 'frog' ? 64 : 88}" rx="15" ry="11" fill="#fff" stroke="#1f1b2e" stroke-width="1.4" stroke-dasharray="3 2"/><ellipse cx="132" cy="${kind === 'frog' ? 64 : 88}" rx="15" ry="11" fill="#fff" stroke="#1f1b2e" stroke-width="1.4" stroke-dasharray="3 2"/>`;
  let face = '';
  if (nose === 'cat') face = `<path d="M92 116 L108 116 L100 124 Z" ${LW}/><path d="M100 124 Q92 134 84 128 M100 124 Q108 134 116 128" ${LN}/><path d="M70 118 L34 110 M70 126 L34 132 M130 118 L166 110 M130 126 L166 132" ${LT}/>`;
  else if (nose === 'bear') face = `<ellipse cx="100" cy="120" rx="10" ry="7" ${INKF}/><path d="M100 127 V134 M100 134 Q92 142 86 136 M100 134 Q108 142 114 136" ${LN}/>`;
  else face = `<path d="M40 112 Q100 160 160 112" ${LN}/><circle cx="88" cy="96" r="2" ${INKF}/><circle cx="112" cy="96" r="2" ${INKF}/><circle cx="46" cy="118" r="7" ${LT}/><circle cx="154" cy="118" r="7" ${LT}/>`;
  const strings = `<circle cx="${kind === 'frog' ? 22 : 30}" cy="100" r="2.6" fill="#fff" stroke="#1f1b2e" stroke-width="1"/><circle cx="${kind === 'frog' ? 178 : 170}" cy="100" r="2.6" fill="#fff" stroke="#1f1b2e" stroke-width="1"/>`;
  return face + holes + strings;
}

function makeCrafts(o, paper) {
  const name = nameOf(o.name, '');
  if (o.kind === 'mask') {
    const keys = MASKS[o.animal] ? [o.animal] : Object.keys(MASKS);
    return keys.map((k) => {
      const m = MASKS[k];
      const pg = new Page(paper, `${m.name[0].toUpperCase()}${m.name.slice(1)} mask`, { subtitle: 'Colour it in. A grown-up cuts it out and the eye holes, then ties string through the little holes.', noName: true });
      const size = Math.min(pg.width, pg.room - 10);
      const s = size / 200;
      pg.add(`<g transform="translate(${pg.left + (pg.width - size) / 2} ${pg.y + 6}) scale(${s.toFixed(4)})">${m.draw().join('')}${maskFace(k, m.nose)}</g>`);
      pg.add(`<text x="${pg.w / 2}" y="${pg.bottom - 3}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="3.6" fill="${SOFT}">✂️ Dashed lines: cut out the eye holes. Little circles: make a hole for the string.</text>`);
      return pg.svg();
    });
  }
  // Crown: two strips on a landscape page, glued into a band.
  const pg = new Page(paper, '', { bare: true, landscape: true });
  const W = pg.w, x0 = 12, bw = W - 24;
  const age = +o.age || 0;
  const text = o.crown === 'star' ? 'Star of the Day' : o.crown === 'name' ? (name || 'Super Star') : `Happy ${age ? ordinal(age) + ' ' : ''}Birthday`;
  // Front strip with points
  const top = 14, bandTop = 58, bandBot = 96;
  let d = `M${x0} ${bandBot} L${x0} ${bandTop}`;
  const pts = 7;
  for (let i = 0; i < pts; i++) {
    const a = x0 + (i * bw) / pts, m = x0 + ((i + 0.5) * bw) / pts, b = x0 + ((i + 1) * bw) / pts;
    d += ` L${a} ${bandTop} L${m} ${top + (i % 2 ? 12 : 0)} L${b} ${bandTop}`;
  }
  d += ` L${x0 + bw} ${bandBot} Z`;
  pg.add(`<path d="${d}" ${LW}/>`);
  for (let i = 0; i < pts; i++) {
    const m = x0 + ((i + 0.5) * bw) / pts;
    pg.add(`<circle cx="${m}" cy="${top + (i % 2 ? 12 : 0) + 12}" r="5" ${LW}/>`);
    pg.add(`<path d="${starPath(m, bandTop - 12, 5, 0.45)}" ${LW}/>`);
  }
  pg.add(`<line x1="${x0}" x2="${x0 + bw}" y1="${bandTop + 4}" y2="${bandTop + 4}" ${LT}/><line x1="${x0}" x2="${x0 + bw}" y1="${bandBot - 4}" y2="${bandBot - 4}" ${LT}/>`);
  const fs = Math.min(22, (bw - 20) / (text.length * 0.56));
  pg.add(`<text x="${W / 2}" y="${(bandTop + bandBot) / 2 + fs * 0.34}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${fs.toFixed(2)}" fill="#fff" stroke="#1f1b2e" stroke-width="${(fs * 0.06).toFixed(2)}" stroke-linejoin="round" paint-order="stroke">${esc(text)}</text>`);
  // Back strip
  const by = 120, bh = 38;
  pg.add(`<rect x="${x0}" y="${by}" width="${bw - 20}" height="${bh}" ${LW}/><rect x="${x0 + bw - 20}" y="${by}" width="20" height="${bh}" fill="#f4f1fb" stroke="#1f1b2e" stroke-width="1" stroke-dasharray="3 2"/>`);
  pg.add(`<text x="${x0 + bw - 10}" y="${by + bh / 2 + 1.5}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="4" fill="${SOFT}">glue</text>`);
  for (let i = 0; i < 8; i++) pg.add(`<path d="${starPath(x0 + 16 + i * ((bw - 40) / 7), by + bh / 2, 7, 0.45)}" ${LW}/>`);
  pg.add(`<text x="${W / 2}" y="${pg.h - 18}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="4" fill="${SOFT}">✂️ Colour both strips, cut them out, then glue the strips together to fit around your head.</text>`);
  pg.footer = () => {};
  return [pg.svg()];
}

// ================================================================ weather chart
function weatherIcon(kind, cx, cy, s) {
  const k = s / 46; // every icon is about 46 units wide at scale 1
  const g = (inner) => `<g transform="translate(${cx} ${cy}) scale(${k.toFixed(4)})">${inner}</g>`;
  const cloud = cCloud(0, 0, 0.62);
  switch (kind) {
    case 'sunny': return g(cSun(0, 0, 9));
    case 'cloudy': return g(cloud);
    case 'rainy': return g(`<path d="M-10 10 l-3 7 M0 10 l-3 7 M10 10 l-3 7" ${LN}/>` + cCloud(0, -4, 0.62));
    case 'windy': return g(`<path d="M-18 -6 H6 Q14 -6 14 -12 Q14 -18 8 -16 M-18 2 H12 Q20 2 20 8 Q20 14 14 12 M-18 10 H0" ${LN}/>`);
    case 'snowy': return g(`<path d="M0 -16 V16 M-14 -8 L14 8 M-14 8 L14 -8 M-4 -13 L0 -9 L4 -13 M-4 13 L0 9 L4 13" ${LN}/>`);
    default: return g(cCloud(0, -6, 0.62) + `<path d="M2 4 L-6 14 L0 14 L-4 22 L8 10 L2 10 Z" ${LW}/>`);
  }
}
const WEATHERS = ['sunny', 'cloudy', 'rainy', 'windy', 'snowy', 'stormy'];

function makeWeather(o, paper) {
  const name = nameOf(o.name, '');
  const pages = [];
  if (o.week !== false) {
    const pg = new Page(paper, name ? `${possessive(name)} Weather Week` : 'My Weather Week', { subtitle: 'Look outside each day. Circle the weather and how it feels.', noName: true });
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const rowH = (pg.room - 12) / days.length;
    const iw = (pg.width - 36 - 42) / WEATHERS.length;
    WEATHERS.forEach((w, i) => pg.add(`<text x="${pg.left + 36 + i * iw + iw / 2}" y="${pg.y + 4}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.4" fill="${SOFT}">${w}</text>`));
    pg.add(`<text x="${pg.right - 21}" y="${pg.y + 4}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.4" fill="${SOFT}">it feels</text>`);
    days.forEach((d, r) => {
      const y = pg.y + 8 + r * rowH;
      pg.add(`<rect x="${pg.left}" y="${y}" width="${pg.width}" height="${rowH - 2}" rx="5" fill="${TINTS[r]}"/>`);
      pg.add(`<text x="${pg.left + 3}" y="${y + rowH / 2 + 1}" font-family="${TITLE_FONT}" font-weight="800" font-size="4.8" fill="${INK}">${d}</text>`);
      WEATHERS.forEach((w, i) => pg.add(weatherIcon(w, pg.left + 36 + i * iw + iw / 2, y + (rowH - 2) / 2, Math.min(iw * 0.86, rowH * 0.9))));
      ['hot', 'warm', 'cold'].forEach((t, k) => pg.add(`<text x="${pg.right - 38 + k * 13}" y="${y + rowH / 2 + 1}" font-family="${FONT}" font-weight="800" font-size="3.6" fill="${INK}">${t}</text>`));
    });
    pages.push(pg.svg());
  }
  if (o.month !== false) {
    const pg = new Page(paper, 'Weather this month', { subtitle: 'Draw the weather in each day\'s box. At the end, count how many of each.', noName: !!name });
    pg.add(`<text x="${pg.left}" y="${pg.y + 4}" font-family="${FONT}" font-weight="800" font-size="4.2" fill="${INK}">Month: ______________________</text>`);
    pg.y += 9;
    const cols = 7, cw = pg.width / cols, ch = 26;
    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach((d, i) => pg.add(`<text x="${pg.left + i * cw + cw / 2}" y="${pg.y + 3}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.6" fill="${SOFT}">${d}</text>`));
    pg.y += 5;
    for (let r = 0; r < 5; r++) for (let c = 0; c < cols; c++) pg.add(`<rect x="${pg.left + c * cw + 0.8}" y="${pg.y + r * ch}" width="${cw - 1.6}" height="${ch - 1.6}" rx="3" fill="#fff" stroke="#c9c3e3" stroke-width="0.4"/><text x="${pg.left + c * cw + 3}" y="${pg.y + r * ch + 5}" font-family="${FONT}" font-weight="700" font-size="2.8" fill="#c9c3e3">__</text>`);
    pg.y += 5 * ch + 6;
    const tw = pg.width / 6;
    WEATHERS.forEach((w, i) => {
      const x = pg.left + i * tw;
      pg.add(`<rect x="${x + 1}" y="${pg.y}" width="${tw - 2}" height="36" rx="5" fill="${TINTS[i]}"/>`);
      pg.add(weatherIcon(w, x + tw / 2, pg.y + 10, 17));
      pg.add(`<text x="${x + tw / 2}" y="${pg.y + 23}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.4" fill="${INK}">${w}</text>`);
      pg.add(`<rect x="${x + tw / 2 - 6}" y="${pg.y + 25}" width="12" height="8" rx="2" fill="#fff" stroke="#9a93b8" stroke-width="0.4"/>`);
    });
    pages.push(pg.svg());
  }
  if (!pages.length) pages.push(new Page(paper, 'Weather', { subtitle: 'Tick at least one page.', noName: true }).svg());
  return pages;
}

// ================================================================ cards to colour
function xmasTree() {
  return [`<rect x="90" y="160" width="20" height="24" ${LW}/>`, `<path d="M100 40 L150 100 L126 100 L162 140 L134 140 L170 166 L30 166 L66 140 L38 140 L74 100 L50 100 Z" ${LW}/>`,
    cStar(100, 34, 14), `<circle cx="84" cy="96" r="6" ${LW}/><circle cx="116" cy="118" r="6" ${LW}/><circle cx="78" cy="140" r="6" ${LW}/><circle cx="124" cy="152" r="6" ${LW}/><circle cx="100" cy="72" r="5" ${LW}/>`,
    `<rect x="40" y="170" width="30" height="24" ${LW}/><path d="M55 170 V194 M40 182 H70" ${LT}/><rect x="132" y="172" width="26" height="22" ${LW}/><path d="M145 172 V194" ${LT}/>`].join('');
}
function eidArt() {
  return '<g transform="translate(100 100) scale(1.25) translate(-100 -100)">' + [`<path d="M86 30 A56 56 0 1 0 150 118 A44 44 0 1 1 86 30 Z" ${LW}/>`, cStar(134, 50, 12), cStar(160, 84, 7), cStar(40, 150, 8),
    `<path d="M126 110 V122" ${LN}/><path d="M112 122 H140 L136 132 H116 Z" ${LW}/><rect x="116" y="132" width="20" height="36" rx="3" ${LW}/><path d="M112 168 H140 L136 178 H116 Z" ${LW}/><path d="M126 138 Q134 150 126 160 Q118 150 126 138 Z" ${LW}/>`].join('') + '</g>';
}
function diyaArt() {
  return [`<path d="M40 130 Q100 200 160 130 Z" ${LW}/><path d="M40 130 Q100 144 160 130" ${LN}/>`, `<path d="M58 150 q8 6 16 0 q8 6 16 0 q8 6 16 0 q8 6 16 0" ${LT}/>`,
    `<path d="M100 128 Q84 104 100 70 Q116 104 100 128 Z" ${LW}/><path d="M100 122 Q92 108 100 90 Q108 108 100 122 Z" ${LW}/>`,
    cStar(40, 50, 9), cStar(160, 44, 10), cStar(150, 90, 6), cStar(52, 94, 6), `<path d="M20 190 H180" ${LN}/>`].join('');
}
const CARDS = {
  mum: { title: "Happy Mother's Day", art: () => colouringArt('sunflower'), msg: 'To the best mum in the world' },
  dad: { title: "Happy Father's Day", art: () => colouringArt('car'), msg: 'To the best dad in the world' },
  birthday: { title: 'Happy Birthday!', art: () => colouringArt('cake'), msg: 'Have the best birthday ever!' },
  thanks: { title: 'Thank You!', art: () => colouringArt('rainbow'), msg: 'Thank you so much for' },
  teacher: { title: 'Thank You, Teacher!', art: () => colouringArt('owl'), msg: 'Thank you for helping me learn' },
  getwell: { title: 'Get Well Soon', art: () => colouringArt('teddy'), msg: 'I hope you feel better very soon' },
  christmas: { title: 'Merry Christmas', art: xmasTree, msg: 'Wishing you a happy Christmas' },
  eid: { title: 'Eid Mubarak', art: eidArt, msg: 'Wishing you a happy Eid' },
  diwali: { title: 'Happy Diwali', art: diyaArt, msg: 'Wishing you a bright and happy Diwali' },
  love: { title: 'You Are Amazing', art: () => colouringArt('unicorn'), msg: 'I just wanted to say' },
};

function makeCards(o, paper) {
  const card = CARDS[o.card] || CARDS.birthday;
  const name = nameOf(o.name, '');
  const to = nameOf(o.to, '');
  const pg = new Page(paper, '', { bare: true });
  const mid = pg.h / 2;
  // Inside (top half, upside down so it reads the right way once folded)
  let inside = '';
  const ix = pg.left + 10, iw = pg.width - 20;
  inside += `<text x="${ix}" y="${pg.m + 26}" font-family="${TITLE_FONT}" font-weight="800" font-size="8" fill="${INK}">To ${to ? esc(to) : '____________________'}</text>`;
  inside += `<text x="${ix}" y="${pg.m + 42}" font-family="${FONT}" font-weight="700" font-size="5.5" fill="${INK}">${esc(card.msg)}</text>`;
  for (let i = 0; i < 4; i++) inside += `<line x1="${ix}" x2="${ix + iw}" y1="${pg.m + 56 + i * 12}" y2="${pg.m + 56 + i * 12}" stroke="#c9c3e3" stroke-width="0.4"/>`;
  inside += `<text x="${ix}" y="${mid - 22}" font-family="${TITLE_FONT}" font-weight="800" font-size="8" fill="${INK}">Love from ${name ? esc(name) : '____________'}</text>`;
  inside += `<path d="${starPath(ix + iw - 10, mid - 25, 7, 0.45)}" ${LW}/>`;
  pg.add(`<g transform="rotate(180 ${pg.w / 2} ${mid / 2 + pg.m / 2})">${inside}</g>`);
  // Fold line
  pg.add(`<line x1="${pg.left - 6}" x2="${pg.right + 6}" y1="${mid}" y2="${mid}" stroke="#b9b3d6" stroke-width="0.5" stroke-dasharray="3 2"/><text x="${pg.right}" y="${mid - 1.5}" text-anchor="end" font-family="${FONT}" font-weight="700" font-size="3" fill="${SOFT}">fold here</text>`);
  // Front (bottom half)
  pg.add(`<rect x="${pg.left}" y="${mid + 6}" width="${pg.width}" height="${pg.bottom - mid - 6}" rx="8" fill="#fff" stroke="#1f1b2e" stroke-width="0.9"/>`);
  const fs = Math.min(15, (pg.width - 20) / (card.title.length * 0.56));
  pg.add(`<text x="${pg.w / 2}" y="${mid + 24}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${fs.toFixed(2)}" fill="#fff" stroke="#1f1b2e" stroke-width="${(fs * 0.06).toFixed(2)}" stroke-linejoin="round" paint-order="stroke">${esc(card.title)}</text>`);
  const size = Math.min(pg.width - 30, pg.bottom - mid - 40);
  pg.add(`<g transform="translate(${pg.left + (pg.width - size) / 2} ${mid + 30}) scale(${(size / 200).toFixed(4)})">${card.art()}</g>`);
  pg.footer = () => {};
  pg.add(`<text x="${pg.w / 2}" y="${pg.h - 6}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="3" fill="#b8b3cc">Colour the front, write inside, then fold along the dashed line.</text>`);
  return [pg.svg()];
}

Object.assign(MAKERS, { prewriting: makePrewriting, cutpaste: makeCutPaste, homework: makeHomework, crafts: makeCrafts, weather: makeWeather, cards: makeCards });

;
// PrintPals batch 7: calendar, number of the day, greater than and less than, phonics sounds,
// opposites, life cycles, family tree and a road trip pack.

// ================================================================ calendar
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTH_ART = ['penguin', 'teddy', 'butterfly', 'rainbow', 'sunflower', 'bee', 'icecream', 'boat', 'owl', 'snail', 'castle', 'rocket'];

function calendarPage(paper, year, m, o, specials) {
  const pg = new Page(paper, '', { bare: true, landscape: true });
  const name = nameOf(o.name, '');
  const title = `${MONTHS[m]} ${year}`;
  pg.add(`<g transform="translate(${pg.left} ${pg.m - 2}) scale(0.19)">${colouringArt(MONTH_ART[m])}</g>`);
  bubbleText(pg, title, pg.w / 2, pg.m + 18, pg.width - 110, 20);
  if (name) pg.add(`<text x="${pg.right}" y="${pg.m + 16}" text-anchor="end" font-family="${TITLE_FONT}" font-weight="800" font-size="6" fill="${SOFT}">${esc(possessive(name))} calendar</text>`);
  const monFirst = o.start !== 'sun';
  const names = monFirst ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const top = pg.m + 42;
  const cw = pg.width / 7;
  names.forEach((d, i) => {
    pg.add(`<rect x="${pg.left + i * cw + 0.6}" y="${top}" width="${cw - 1.2}" height="8" rx="3" fill="${PALETTE[i]}"/>`);
    pg.add(`<text x="${pg.left + i * cw + cw / 2}" y="${top + 5.6}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.8" fill="#fff">${d}</text>`);
  });
  const first = new Date(year, m, 1).getDay();
  const offset = monFirst ? (first + 6) % 7 : first;
  const days = new Date(year, m + 1, 0).getDate();
  const rows = Math.ceil((offset + days) / 7);
  const ch = (pg.bottom - top - 12) / rows;
  for (let i = 0; i < rows * 7; i++) {
    const d = i - offset + 1;
    const x = pg.left + (i % 7) * cw, y = top + 10 + Math.floor(i / 7) * ch;
    const ok = d >= 1 && d <= days;
    pg.add(`<rect x="${x + 0.6}" y="${y + 0.6}" width="${cw - 1.2}" height="${ch - 1.2}" rx="3" fill="${ok ? '#fff' : '#f7f5fc'}" stroke="#c9c3e3" stroke-width="0.4"/>`);
    if (!ok) continue;
    pg.add(`<text x="${x + 3}" y="${y + 6.5}" font-family="${TITLE_FONT}" font-weight="800" font-size="5.5" fill="${INK}">${d}</text>`);
    const sp = specials.filter((s) => s.m === m && s.d === d);
    sp.forEach((s, k) => {
      pg.add(`<path d="${starPath(x + cw - 5, y + 5, 3, 0.45)}" fill="#ffc93c"/>`);
      pg.add(`<text x="${x + cw / 2}" y="${y + ch - 4 - k * 4.5}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${fitFont(s.text, 3.4, cw - 4, 0.52).toFixed(2)}" fill="#e0457b">${esc(s.text)}</text>`);
    });
  }
  pg.footer = () => {};
  return pg.svg();
}

function makeCalendar(o, paper) {
  const now = new Date();
  const year = Math.max(2000, Math.min(2100, parseInt(o.year, 10) || now.getFullYear()));
  // Special days: "12 March Mum's birthday" or "12/3 Mum's birthday"
  const specials = [];
  for (const line of String(o.specials || '').split('\n')) {
    const t = line.trim();
    let m = /^(\d{1,2})\s*[\/.-]\s*(\d{1,2})\s+(.+)$/.exec(t);
    if (m) { specials.push({ d: +m[1], m: +m[2] - 1, text: m[3].slice(0, 26) }); continue; }
    m = /^(\d{1,2})\s+([A-Za-z]+)\s+(.+)$/.exec(t);
    if (m) {
      const mi = MONTHS.findIndex((n) => n.toLowerCase().startsWith(m[2].toLowerCase().slice(0, 3)));
      if (mi >= 0) specials.push({ d: +m[1], m: mi, text: m[3].slice(0, 26) });
    }
  }
  if (o.month === 'all') return MONTHS.map((_, i) => calendarPage(paper, year, i, o, specials));
  const m = o.month === '' || o.month === undefined ? now.getMonth() : Math.max(0, Math.min(11, +o.month));
  return [calendarPage(paper, year, m, o, specials)];
}

// ================================================================ number of the day
function makeNumberDay(o, paper) {
  const rand = rng(+o.seed || 1);
  const max = o.range === '100' ? 100 : 20;
  let nums = [];
  const fixed = parseInt(o.number, 10);
  if (fixed >= 0 && fixed <= 100) nums = [fixed];
  else for (let i = 0; i < (o.week === true ? 5 : 1); i++) nums.push(1 + Math.floor(rand() * max));
  return nums.map((n) => {
    const pg = new Page(paper, 'Number of the day', { subtitle: 'Show the number in lots of different ways!' });
    const cols = 2, rows = 4, cw = pg.width / cols, ch = (pg.room - 30) / rows;
    // Big number badge
    pg.add(`<circle cx="${pg.w / 2}" cy="${pg.y + 11}" r="12" fill="#ffc93c"/><text x="${pg.w / 2}" y="${pg.y + 11 + (n > 99 ? 3.4 : 4.4)}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${n > 99 ? 10 : 13}" fill="${INK}">${n}</text>`);
    pg.y += 28;
    const box = (i, label) => {
      const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch, c = i % PALETTE.length;
      pg.add(`<rect x="${x + 1.5}" y="${y + 1.5}" width="${cw - 3}" height="${ch - 3}" rx="6" fill="${TINTS[c]}" stroke="${PALETTE[c]}" stroke-width="0.6"/>`);
      pg.add(`<text x="${x + 6}" y="${y + 8}" font-family="${TITLE_FONT}" font-weight="800" font-size="4.6" fill="${INK}">${label}</text>`);
      return [x, y];
    };
    let [x, y] = box(0, 'Trace it');
    const s1 = 18;
    pg.add(drawText(String(n), x + 8, y + 13, s1, 'trace', true));
    pg.add(drawText(String(n), x + 12 + (textWidth(String(n)) / 100) * s1 + 8, y + 13, s1, 'trace'));
    [x, y] = box(1, 'In words');
    const word = n <= 20 ? NUMBER_WORDS[n] : numberWord(n);
    const ws = Math.min(16, (cw - 16) / (textWidth(word) / 100 + 0.1), ch - 22);
    pg.add(drawText(word, x + 8, y + 12 + (ch - 12 - ws * 1.4) / 2, ws, 'trace', true));
    [x, y] = box(2, n <= 20 ? 'Colour the ten frames' : 'Tens and ones');
    if (n <= 20) { tenFrame(pg, x + 8, y + 13, 7, 0, '#fff'); tenFrame(pg, x + 8 + 40, y + 13, 7, 0, '#fff'); }
    else pg.add(`<text x="${x + 10}" y="${y + ch - 12}" font-family="${FONT}" font-weight="800" font-size="4.6" fill="${INK}">____ tens and ____ ones</text>`);
    [x, y] = box(3, 'Tally marks');
    [x, y] = box(4, 'One less and one more');
    const bw = 18;
    [[n - 1, false], [n, true], [n + 1, false]].forEach(([v, show], k) => {
      const bx = x + 10 + k * (bw + 8);
      pg.add(`<rect x="${bx}" y="${y + 14}" width="${bw}" height="14" rx="3" fill="${show ? '#ffc93c' : '#fff'}" stroke="${INK}" stroke-width="0.5"/>`);
      if (show) pg.add(`<text x="${bx + bw / 2}" y="${y + 24}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="7" fill="${INK}">${v}</text>`);
    });
    [x, y] = box(5, 'Odd or even?');
    ['odd', 'even'].forEach((w, k) => pg.add(`<text x="${x + 22 + k * 32}" y="${y + ch / 2 + 4}" font-family="${TITLE_FONT}" font-weight="800" font-size="8" fill="${INK}">${w}</text>`));
    [x, y] = box(6, 'Find it on the number line');
    const lo = Math.max(0, n - 5), nx = x + 8, nw = cw - 16, ny = y + ch / 2 + 2;
    pg.add(`<line x1="${nx}" x2="${nx + nw}" y1="${ny}" y2="${ny}" stroke="${INK}" stroke-width="0.5"/>`);
    for (let k = 0; k <= 10; k++) {
      const tx = nx + (k * nw) / 10, v = lo + k;
      pg.add(`<line x1="${tx}" x2="${tx}" y1="${ny - 1.6}" y2="${ny + 1.6}" stroke="${INK}" stroke-width="0.4"/>`);
      if (k % 2 === 0) pg.add(`<text x="${tx}" y="${ny + 6.5}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.4" fill="${INK}">${v}</text>`);
    }
    [x, y] = box(7, n <= 20 ? `Draw ${n} things` : 'Draw a picture of it');
    return pg.svg();
  });
}

function numberWord(n) {
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  if (n === 100) return 'one hundred';
  if (n < 20) return NUMBER_WORDS[n];
  return tens[Math.floor(n / 10)] + (n % 10 ? '-' + NUMBER_WORDS[n % 10] : '');
}

// ================================================================ greater than, less than
function croc(x, y, s, open) {
  // A friendly crocodile head whose mouth opens to the right (towards the bigger number).
  const k = s / 40;
  return `<g transform="translate(${x} ${y}) scale(${open === 'left' ? -k : k} ${k})"><path d="M-18 -4 Q-18 -16 -4 -16 L28 -26 Q34 -24 30 -18 L4 -6 L30 6 Q34 12 28 14 L-4 6 Q-18 6 -18 -4 Z" fill="#8bd17c" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>`
    + `<path d="M6 -9 L10 -12 L13 -10 L17 -14 L20 -12 L24 -16 M6 1 L10 4 L13 2 L17 6 L20 4 L24 8" fill="none" stroke="${INK}" stroke-width="1.2"/><circle cx="-8" cy="-14" r="4" fill="#fff" stroke="${INK}" stroke-width="1.2"/><circle cx="-7" cy="-14" r="1.8" fill="${INK}"/></g>`;
}

function makeCompare(o, paper) {
  const rand = rng(+o.seed || 1);
  const kind = o.kind || 'pictures';
  const max = kind === 'to100' ? 100 : kind === 'to20' ? 20 : 10;
  const items = [];
  for (let i = 0; i < (kind === 'pictures' ? 8 : 16); i++) {
    const a = Math.floor(rand() * (max + 1)), b = rand() < 0.12 ? a : Math.floor(rand() * (max + 1));
    items.push([a, b]);
  }
  const arts = ['apple', 'star', 'strawberry', 'ladybird', 'cupcake', 'balloon', 'orange', 'chick'].map(ART);
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const pg = new Page(paper, answers ? 'Greater or less: answers' : 'Hungry crocodile', { subtitle: answers ? 'Answer key for grown-ups.' : 'The crocodile always eats the bigger number! Write > or < or = in each circle.', noName: answers });
    if (!answers) {
      pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="20" rx="6" fill="#effaf0"/>`);
      pg.add(croc(pg.left + 22, pg.y + 11, 16, 'right'));
      pg.add(`<text x="${pg.left + 42}" y="${pg.y + 8.5}" font-family="${FONT}" font-weight="800" font-size="4" fill="${INK}">&gt; means bigger than: 7 &gt; 3</text><text x="${pg.left + 42}" y="${pg.y + 15}" font-family="${FONT}" font-weight="800" font-size="4" fill="${INK}">&lt; means smaller than: 2 &lt; 5</text>`);
      pg.add(`<text x="${pg.right - 4}" y="${pg.y + 12}" text-anchor="end" font-family="${FONT}" font-weight="800" font-size="4" fill="${INK}">= means the same: 4 = 4</text>`);
      pg.y += 26;
    }
    const cols = kind === 'pictures' ? 1 : 2, rows = Math.ceil(items.length / cols);
    const cw = pg.width / cols, ch = (pg.room - 2) / rows;
    items.forEach(([a, b], i) => {
      const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch, c = i % PALETTE.length;
      pg.add(`<rect x="${x + 1.5}" y="${y + 1.5}" width="${cw - 3}" height="${ch - 3}" rx="6" fill="${TINTS[c]}"/>`);
      const mid = x + cw / 2, cy = y + ch / 2;
      const sign = a > b ? '>' : a < b ? '<' : '=';
      pg.add(`<circle cx="${mid}" cy="${cy}" r="${Math.min(7, ch * 0.3)}" fill="#fff" stroke="${INK}" stroke-width="0.6"/>`);
      if (answers) pg.add(`<text x="${mid}" y="${cy + 3}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="9" fill="#e0457b">${esc(sign)}</text>`);
      if (kind === 'pictures') {
        [[a, x + 6, mid - 12], [b, mid + 12, x + cw - 6]].forEach(([n, l, r], side) => {
          const s = Math.min(9, (r - l) / 5.2);
          for (let k = 0; k < n; k++) pg.add(pic(arts[i % arts.length], l + s / 2 + (k % 5) * s * 1.05, cy - (n > 5 ? s * 0.55 : 0) + Math.floor(k / 5) * s * 1.1, s * 0.95));
          pg.add(`<text x="${(l + r) / 2}" y="${y + ch - 4}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.4" fill="${SOFT}">${answers ? n : ''}</text>`);
        });
      } else {
        const fs = Math.min(12, ch * 0.45);
        pg.add(`<text x="${mid - 12}" y="${cy + fs * 0.35}" text-anchor="end" font-family="${TITLE_FONT}" font-weight="800" font-size="${fs}" fill="${INK}">${a}</text>`);
        pg.add(`<text x="${mid + 12}" y="${cy + fs * 0.35}" font-family="${TITLE_FONT}" font-weight="800" font-size="${fs}" fill="${INK}">${b}</text>`);
      }
    });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ phonics sounds
const SOUNDS = {
  sh: [['ship', '🚢'], ['shell', '🐚'], ['sheep', '🐑'], ['shoe', '👟'], ['shark', '🦈'], ['shirt', '👕']],
  ch: [['chair', '🪑'], ['cheese', '🧀'], ['chick', ART('chick')], ['cherry', '🍒'], ['chips', '🍟'], ['chicken', '🐔']],
  th: [['thumb', '👍'], ['three', '3️⃣'], ['thread', '🧵'], ['thunder', '⛈️']],
  wh: [['whale', '🐋'], ['wheel', '🛞'], ['wheat', '🌾'], ['white', '⚪']],
  ck: [['duck', '🦆'], ['sock', '🧦'], ['clock', '⏰'], ['rock', '🪨'], ['truck', '🚚'], ['backpack', '🎒']],
  ng: [['ring', '💍'], ['king', '🤴'], ['wing', '🪽'], ['swing', '🛝']],
  cr: [['crab', '🦀'], ['crown', '👑'], ['crayon', '🖍️'], ['crocodile', '🐊']],
  st: [['star', ART('star')], ['stop', '🛑'], ['strawberry', ART('strawberry')], ['stamp', '📮']],
  sn: [['snail', '🐌'], ['snake', '🐍'], ['snowman', '⛄'], ['sneeze', '🤧']],
  tr: [['tree', '🌳'], ['train', '🚆'], ['truck', '🚚'], ['trumpet', '🎺']],
  fr: [['frog', '🐸'], ['fries', '🍟'], ['fruit', ART('orange')], ['fridge', '🧊']],
  bl: [['blocks', ART('blocks')], ['blue', '🔵'], ['blanket', '🛏️'], ['blueberry', ART('blueberry')]],
};
const SOUND_SETS = { starts: ['sh', 'ch', 'th', 'wh'], ends: ['ck', 'ng', 'sh'], blends: ['cr', 'st', 'sn', 'tr', 'fr', 'bl'] };

function makeSounds(o, paper) {
  const rand = rng(+o.seed || 1);
  const set = SOUND_SETS[o.set] || SOUND_SETS.starts;
  let items = [];
  set.forEach((snd) => items.push(...SOUNDS[snd].map(([w, src]) => ({ w, src, snd }))));
  items = shuffle(items, rand).slice(0, 9);
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const pg = new Page(paper, answers ? 'Phonics sounds: answers' : `Which sound? ${set.join(' ')}`, { subtitle: answers ? 'Answer key for grown-ups.' : 'Say the word. Which sound do you hear? Ring it, then write it in the gap.', noName: answers });
    const cols = 3, rows = 3, cw = pg.width / cols, ch = (pg.room - 2) / rows;
    items.forEach((it, i) => {
      const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch, c = i % PALETTE.length;
      pg.add(`<rect x="${x + 1.5}" y="${y + 1.5}" width="${cw - 3}" height="${ch - 3}" rx="7" fill="${TINTS[c]}" stroke="${PALETTE[c]}" stroke-width="0.6"/>`);
      pg.add(pic(it.src, x + cw / 2, y + ch * 0.3, Math.min(cw, ch) * 0.36));
      const at = it.w.indexOf(it.snd);
      const word = it.w.slice(0, at) + '__'.repeat(1) + it.w.slice(at + it.snd.length);
      const shown = answers ? it.w : word.replace('__', '___');
      pg.add(`<text x="${x + cw / 2}" y="${y + ch * 0.64}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${fitFont(shown, 7.5, cw - 10, 0.55).toFixed(2)}" fill="${answers ? '#e0457b' : INK}" letter-spacing="0.6">${esc(shown)}</text>`);
      const opts = shuffle([it.snd, ...shuffle(set.filter((s) => s !== it.snd), rand).slice(0, 2)], rand);
      opts.forEach((s, k) => {
        const ox = x + cw / 2 + (k - 1) * 16;
        if (answers && s === it.snd) pg.add(`<circle cx="${ox}" cy="${y + ch * 0.83 - 1.4}" r="5.4" fill="none" stroke="#e0457b" stroke-width="0.8"/>`);
        pg.add(`<text x="${ox}" y="${y + ch * 0.83}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="5" fill="${INK}">${s}</text>`);
      });
    });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ opposites
const OPPOSITES = [[['big', '🐘'], ['small', '🐭']], [['hot', '🔥'], ['cold', '❄️']], [['happy', '😀'], ['sad', '😢']], [['day', ART('sun')], ['night', '🌙']],
  [['fast', '🐇'], ['slow', ART('turtle')]], [['full', '🥛'], ['empty', '🫙']], [['open', '📖'], ['closed', '📕']], [['wet', '☔'], ['dry', '🌵']],
  [['loud', '🥁'], ['quiet', '🤫']], [['tall', '🦒'], ['short', '🐶']], [['up', '🎈'], ['down', '🍂']], [['clean', '🛁'], ['dirty', ART('pig')]]];

function makeOpposites(o, paper) {
  const rand = rng(+o.seed || 1);
  const pairs = shuffle(OPPOSITES, rand).slice(0, 6);
  const kind = o.kind === 'draw' ? 'draw' : 'match';
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && (o.key === false || kind === 'draw')) break;
    const pg = new Page(paper, answers ? 'Opposites: answers' : kind === 'draw' ? 'Draw the opposite' : 'Match the opposites', { subtitle: answers ? 'Answer key for grown-ups.' : kind === 'draw' ? 'Look at each picture. Draw its opposite in the empty box.' : 'Draw a line from each word to its opposite.', noName: answers });
    const n = pairs.length, rowH = (pg.room - 4) / n, colW = 64;
    const lx = pg.left + 4, rx = pg.right - colW - 4;
    const cell = ([w, src], x, y, c) => {
      pg.add(`<rect x="${x}" y="${y + 3}" width="${colW}" height="${rowH - 6}" rx="7" fill="${TINTS[c]}" stroke="${PALETTE[c]}" stroke-width="0.6"/>`);
      pg.add(pic(src, x + 17, y + rowH / 2, Math.min(24, rowH - 12)));
      pg.add(`<text x="${x + 34}" y="${y + rowH / 2 + 2.4}" font-family="${TITLE_FONT}" font-weight="800" font-size="7" fill="${INK}">${w}</text>`);
    };
    if (kind === 'draw') {
      pairs.forEach(([a, b], i) => {
        const y = pg.y + i * rowH;
        cell(a, lx, y, i % PALETTE.length);
        pg.add(`<text x="${pg.w / 2}" y="${y + rowH / 2 + 2}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="4.4" fill="${SOFT}">the opposite is</text>`);
        pg.add(`<rect x="${rx}" y="${y + 3}" width="${colW}" height="${rowH - 6}" rx="7" fill="#fff" stroke="#b9b3d6" stroke-width="0.6" stroke-dasharray="2.5 1.6"/>`);
        pg.add(`<text x="${rx + colW / 2}" y="${y + rowH - 6}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="4" fill="${SOFT}">${b[0]}</text>`);
      });
    } else {
      const order = shuffle([...Array(n).keys()], rand);
      pairs.forEach(([a], i) => cell(a, lx, pg.y + i * rowH, i % PALETTE.length));
      order.forEach((pi, j) => cell(pairs[pi][1], rx, pg.y + j * rowH, (pi + 3) % PALETTE.length));
      for (let i = 0; i < n; i++) pg.add(`<circle cx="${lx + colW + 4}" cy="${pg.y + i * rowH + rowH / 2}" r="1.6" fill="${INK}"/><circle cx="${rx - 4}" cy="${pg.y + i * rowH + rowH / 2}" r="1.6" fill="${INK}"/>`);
      if (answers) pairs.forEach((_, i) => { const j = order.indexOf(i); pg.add(`<line x1="${lx + colW + 4}" y1="${pg.y + i * rowH + rowH / 2}" x2="${rx - 4}" y2="${pg.y + j * rowH + rowH / 2}" stroke="#e0457b" stroke-width="0.8"/>`); });
    }
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ life cycles
const STAGE_ART = {
  eggleaf: () => `<path d="M-36 20 Q-10 -34 40 -20 Q10 34 -36 20 Z" ${LW}/><path d="M-30 16 Q0 -2 34 -16" ${LT}/><circle cx="-4" cy="4" r="5" ${LW}/><circle cx="8" cy="0" r="5" ${LW}/><circle cx="4" cy="11" r="5" ${LW}/>`,
  chrysalis: () => `<path d="M0 -40 V-26" ${LN}/><path d="M-26 -30 H26" ${LN}/><path d="M0 -26 C16 -20 18 10 0 40 C-18 10 -16 -20 0 -26 Z" ${LW}/><path d="M-8 -6 Q0 -2 8 -6 M-10 8 Q0 12 10 8" ${LT}/>`,
  spawn: () => [[-14, -8], [0, -12], [14, -6], [-8, 6], [8, 8], [-20, 12], [20, 14], [0, 20]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" ${LW}/><circle cx="${x}" cy="${y}" r="2.4" ${INKF}/>`).join(''),
  tadpole: () => `<path d="M-6 0 Q14 -14 34 -6 Q24 0 34 6 Q14 14 -6 0 Z" ${LW}/><ellipse cx="-14" cy="0" rx="16" ry="12" ${LW}/><circle cx="-20" cy="-3" r="2.4" ${INKF}/>`,
  froglet: () => `<ellipse cx="-4" cy="0" rx="22" ry="14" ${LW}/><path d="M16 2 Q34 6 40 -2" ${LN}/><circle cx="-14" cy="-12" r="6" ${LW}/><circle cx="2" cy="-12" r="6" ${LW}/><circle cx="-14" cy="-12" r="2.4" ${INKF}/><circle cx="2" cy="-12" r="2.4" ${INKF}/><path d="M-18 12 l-6 8 M8 12 l6 8" ${LN}/>`,
  seed: () => `<ellipse cx="0" cy="4" rx="16" ry="10" ${LW}/><path d="M-12 4 Q0 -2 12 4" ${LT}/><path d="M-40 22 H40" ${LN}/>`,
};
const CYCLES = {
  butterfly: { name: 'a butterfly', stages: [['egg', 'svg:eggleaf'], ['caterpillar', '🐛'], ['chrysalis', 'svg:chrysalis'], ['butterfly', '🦋']] },
  frog: { name: 'a frog', stages: [['frogspawn', 'svg:spawn'], ['tadpole', 'svg:tadpole'], ['froglet', 'svg:froglet'], ['frog', '🐸']] },
  plant: { name: 'a sunflower', stages: [['seed', 'svg:seed'], ['sprout', '🌱'], ['young plant', '🪴'], ['flower', ART('sunflower')]] },
  chicken: { name: 'a chicken', stages: [['egg', ART('egg')], ['hatching', '🐣'], ['chick', ART('chick')], ['hen', '🐔']] },
};

function stagePic(src, cx, cy, size) {
  if (src.startsWith('svg:')) return `<g transform="translate(${cx} ${cy}) scale(${(size / 90).toFixed(4)})">${STAGE_ART[src.slice(4)]()}</g>`;
  return pic(src, cx, cy, size);
}

function makeLifeCycle(o, paper) {
  const rand = rng(+o.seed || 1);
  const cy = CYCLES[o.cycle] || CYCLES.butterfly;
  const kind = o.kind || 'learn';
  const pg = new Page(paper, `The life cycle of ${cy.name}`, { subtitle: kind === 'learn' ? 'Follow the arrows round the circle. Say what happens at each step.' : kind === 'label' ? 'Write the name of each stage. Use the word bank to help.' : 'Cut out the pictures and stick them in the right order, starting at 1.' });
  const R = Math.min(pg.width, pg.room - (kind === 'cut' ? 60 : 30)) * 0.33;
  const cx = pg.w / 2, ccy = pg.y + R + 18;
  pg.add(`<circle cx="${cx}" cy="${ccy}" r="${R}" fill="none" stroke="#d9d4ec" stroke-width="1.2" stroke-dasharray="3 3"/>`);
  const spots = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  // Arrows between stages
  for (let i = 0; i < 4; i++) {
    const a1 = (-90 + i * 90 + 24) * Math.PI / 180, a2 = (-90 + i * 90 + 66) * Math.PI / 180;
    const x1 = cx + Math.cos(a1) * R, y1 = ccy + Math.sin(a1) * R, x2 = cx + Math.cos(a2) * R, y2 = ccy + Math.sin(a2) * R;
    pg.add(`<path d="M${x1} ${y1} A${R} ${R} 0 0 1 ${x2} ${y2}" fill="none" stroke="${PALETTE[i]}" stroke-width="1.6"/>`);
    const ang = a2 + Math.PI / 2;
    pg.add(`<path d="M${x2} ${y2} l${Math.cos(ang - 0.5) * -4} ${Math.sin(ang - 0.5) * -4} M${x2} ${y2} l${Math.cos(ang + 0.5) * -4} ${Math.sin(ang + 0.5) * -4}" stroke="${PALETTE[i]}" stroke-width="1.6" stroke-linecap="round"/>`);
  }
  const box = R * 0.8;
  cy.stages.forEach(([label, src], i) => {
    const [dx, dy] = spots[i];
    const x = cx + dx * R, y = ccy + dy * R;
    pg.add(`<rect x="${x - box / 2}" y="${y - box / 2}" width="${box}" height="${box}" rx="8" fill="#fff" stroke="${PALETTE[i]}" stroke-width="1"/>`);
    pg.add(`<circle cx="${x - box / 2 + 5}" cy="${y - box / 2 + 5}" r="4" fill="${PALETTE[i]}"/><text x="${x - box / 2 + 5}" y="${y - box / 2 + 6.5}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="4" fill="#fff">${i + 1}</text>`);
    if (kind !== 'cut') pg.add(stagePic(src, x, y - 3, box * 0.62));
    if (kind === 'learn') pg.add(`<text x="${x}" y="${y + box / 2 - 3}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="4.6" fill="${INK}">${label}</text>`);
    else if (kind === 'label') pg.add(`<line x1="${x - box / 2 + 5}" x2="${x + box / 2 - 5}" y1="${y + box / 2 - 4}" y2="${y + box / 2 - 4}" stroke="#9a93b8" stroke-width="0.4"/>`);
  });
  const by = ccy + R + box / 2 + 10;
  if (kind === 'label') {
    pg.add(`<rect x="${pg.left}" y="${by}" width="${pg.width}" height="14" rx="5" fill="#fff6e0" stroke="#ffb938" stroke-width="0.5"/>`);
    pg.add(`<text x="${pg.w / 2}" y="${by + 9}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="5.5" fill="${INK}">Word bank:   ${shuffle(cy.stages.map((s) => s[0]), rand).join('     ')}</text>`);
  } else if (kind === 'cut') {
    scissors(pg, by);
    const t = 32, gap = (pg.width - 4 * t) / 5;
    shuffle(cy.stages, rand).forEach(([label, src], i) => {
      const x = pg.left + gap + i * (t + gap), y = by + 6;
      cutTile(pg, x, y, t, stagePic(src, x + t / 2, y + t / 2 - 3, t * 0.62) + `<text x="${x + t / 2}" y="${y + t - 2.5}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.2" fill="${INK}">${label}</text>`, i);
    });
  }
  return [pg.svg()];
}

// ================================================================ family tree
function makeFamily(o, paper) {
  const name = nameOf(o.name, '');
  const kids = Math.max(0, Math.min(3, +o.siblings || 0));
  const pages = [];
  const pg = new Page(paper, name ? `${possessive(name)} Family Tree` : 'My Family Tree', { subtitle: 'Draw each person or stick a photo in the frame, then write their name.', noName: true });
  const cx = pg.w / 2;
  // The tree
  const top = pg.y + 4, bottom = pg.bottom - 4;
  pg.add(`<path d="M${cx - 16} ${bottom} Q${cx - 10} ${bottom - 60} ${cx - 8} ${top + 120} L${cx + 8} ${top + 120} Q${cx + 10} ${bottom - 60} ${cx + 16} ${bottom} Z" fill="#f3e3cf" stroke="${INK}" stroke-width="0.8"/>`);
  let crown = '';
  const r = pg.width * 0.46, ry = (bottom - top) * 0.38, ccy = top + ry + 4;
  for (let i = 0; i <= 14; i++) {
    const a = (i * 2 * Math.PI) / 14, b = ((i + 0.5) * 2 * Math.PI) / 14;
    const x = cx + Math.cos(a) * r, y = ccy + Math.sin(a) * ry;
    crown += i ? ` Q${cx + Math.cos(b - Math.PI / 14) * r * 1.12} ${ccy + Math.sin(b - Math.PI / 14) * ry * 1.12} ${x} ${y}` : `M${x} ${y}`;
  }
  pg.add(`<path d="${crown} Z" fill="#effaf0" stroke="${INK}" stroke-width="0.8"/>`);
  const frame = (x, y, w, label) => {
    pg.add(`<rect x="${x - w / 2}" y="${y}" width="${w}" height="${w * 1.05}" rx="${w * 0.2}" fill="#fff" stroke="${INK}" stroke-width="0.7"/>`);
    pg.add(`<rect x="${x - w / 2 - 2}" y="${y + w * 1.05 + 2}" width="${w + 4}" height="9" rx="3" fill="#fff" stroke="#c9c3e3" stroke-width="0.4"/>`);
    pg.add(`<text x="${x}" y="${y + w * 1.05 + 16}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.2" fill="${SOFT}">${label}</text>`);
  };
  const w = 30;
  // Grandparents
  const gy = top + 12;
  [['Grandma', -64], ['Grandpa', -36], ['Grandma', 36], ['Grandpa', 64]].forEach(([l, dx]) => frame(cx + dx, gy + 6, w * 0.76, l));
  // Parents
  const py = gy + 58;
  [['Mum', -1], ['Dad', 1]].forEach(([l, k]) => frame(cx + k * 34, py, w, l));
  pg.add(`<path d="${starPath(cx, py + 16, 5, 0.45)}" fill="#ffc93c"/>`);
  // Children
  const cyy = py + 62;
  const people = [['Me', 0], ...[...Array(kids)].map((_, i) => ['Brother or sister', i + 1])];
  const span = people.length;
  people.forEach(([l], i) => frame(cx + (i - (span - 1) / 2) * 44, cyy, i === 0 ? w * 1.1 : w, l));
  pages.push(pg.svg());
  if (o.about !== false) {
    const p2 = new Page(paper, name ? `All about ${possessive(name)} family` : 'All about my family', { subtitle: 'Talk about these with your family, then fill them in together.', noName: true });
    const qs = [['👨‍👩‍👧', 'There are ____ people in my family.'], ['🌍', 'My family comes from'], ['🗣️', 'Languages we speak'], ['🍲', 'Our favourite family meal'], ['🎉', 'A special day we celebrate'], ['❤️', 'My favourite thing to do together'], ['👵', 'Something I love about my grandparents'], ['📞', 'Family who live far away']];
    const rowH = (p2.room - 2) / qs.length;
    qs.forEach(([ic, q], i) => {
      const y = p2.y + i * rowH;
      p2.add(`<rect x="${p2.left}" y="${y + 1}" width="${p2.width}" height="${rowH - 3}" rx="6" fill="${TINTS[i % TINTS.length]}"/>`);
      p2.add(emoji(ic, p2.left + 9, y + rowH / 2 - 1, 9));
      p2.add(`<text x="${p2.left + 18}" y="${y + 9}" font-family="${TITLE_FONT}" font-weight="800" font-size="5" fill="${INK}">${esc(q)}</text>`);
      p2.add(`<line x1="${p2.left + 18}" x2="${p2.right - 6}" y1="${y + rowH - 7}" y2="${y + rowH - 7}" stroke="#9a93b8" stroke-width="0.4"/>`);
    });
    pages.push(p2.svg());
  }
  return pages;
}

// ================================================================ road trip pack
const TRIP_ITEMS = [['car', '🚗'], ['bus', '🚌'], ['lorry', '🚚'], ['bike', '🚲'], ['cow', '🐄'], ['sheep', '🐑'], ['horse', '🐎'], ['tractor', '🚜'],
  ['bridge', '🌉'], ['traffic lights', '🚦'], ['petrol station', '⛽'], ['plane', '✈️'], ['train', '🚆'], ['tree', '🌳'], ['dog', ART('dog')], ['motorbike', '🏍️'],
  ['police car', '🚓'], ['ambulance', '🚑'], ['bird', '🐦'], ['river', '🏞️']];

function makeTravel(o, paper) {
  const rand = rng(+o.seed || 1);
  const pages = [];
  if (o.bingo !== false) {
    const pg = new Page(paper, 'Road trip bingo', { subtitle: 'Cross off each thing when you see it. Shout bingo when you get a line!', noName: true });
    const h = (pg.room - 8) / 2;
    [0, 1].forEach((j) => {
      const items = shuffle(TRIP_ITEMS, rand).slice(0, 16);
      const n = 4, cell = Math.min((pg.width - 20) / n, (h - 14) / n), gx = pg.left + (pg.width - cell * n) / 2, gy = pg.y + j * (h + 8) + 10;
      pg.add(`<text x="${pg.left}" y="${gy - 3}" font-family="${TITLE_FONT}" font-weight="800" font-size="5.5" fill="${PALETTE[j * 3]}">Player ${j + 1}: ____________</text>`);
      items.forEach(([label, src], i) => {
        const x = gx + (i % n) * cell, y = gy + Math.floor(i / n) * cell;
        pg.add(`<rect x="${x + 0.6}" y="${y + 0.6}" width="${cell - 1.2}" height="${cell - 1.2}" rx="3" fill="${TINTS[(i + j) % TINTS.length]}" stroke="${INK}" stroke-width="0.4"/>`);
        pg.add(pic(src, x + cell / 2, y + cell * 0.42, cell * 0.5));
        pg.add(`<text x="${x + cell / 2}" y="${y + cell - 3}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${fitFont(label, 3.4, cell - 4, 0.55).toFixed(2)}" fill="${INK}">${label}</text>`);
      });
    });
    pages.push(pg.svg());
  }
  if (o.xo !== false) {
    const pg = new Page(paper, 'Noughts and crosses', { subtitle: 'Take turns to draw an O or an X. Get three in a row to win!', noName: true });
    const cols = 2, rows = 3, cw = pg.width / cols, ch = (pg.room - 2) / rows;
    for (let i = 0; i < 6; i++) {
      const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch, s = Math.min(cw, ch) - 18;
      const gx = x + (cw - s) / 2, gy = y + 6, c = PALETTE[i % PALETTE.length];
      pg.add(`<path d="M${gx + s / 3} ${gy} V${gy + s} M${gx + (2 * s) / 3} ${gy} V${gy + s} M${gx} ${gy + s / 3} H${gx + s} M${gx} ${gy + (2 * s) / 3} H${gx + s}" stroke="${c}" stroke-width="1.6" stroke-linecap="round"/>`);
      pg.add(`<text x="${x + cw / 2}" y="${y + ch - 4}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="3.4" fill="${SOFT}">Winner: ________</text>`);
    }
    pages.push(pg.svg());
  }
  if (o.boxes !== false) {
    const pg = new Page(paper, 'Dots and boxes', { subtitle: 'Take turns to join two dots. Finish a box? Write your initial in it and go again!', noName: true });
    const n = 10, s = Math.min(pg.width, pg.room - 20) / (n - 1) * 0.92;
    const gx = pg.left + (pg.width - s * (n - 1)) / 2, gy = pg.y + 4;
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) pg.add(`<circle cx="${gx + c * s}" cy="${gy + r * s}" r="1.1" fill="${INK}"/>`);
    const sy = gy + (n - 1) * s + 10;
    pg.add(`<text x="${pg.left}" y="${sy}" font-family="${TITLE_FONT}" font-weight="800" font-size="5.5" fill="${PALETTE[0]}">Player 1: ________   Score: ____</text><text x="${pg.right}" y="${sy}" text-anchor="end" font-family="${TITLE_FONT}" font-weight="800" font-size="5.5" fill="${PALETTE[3]}">Player 2: ________   Score: ____</text>`);
    pages.push(pg.svg());
  }
  if (!pages.length) pages.push(new Page(paper, 'Road trip pack', { subtitle: 'Tick at least one page.', noName: true }).svg());
  return pages;
}

Object.assign(MAKERS, { calendar: makeCalendar, numberday: makeNumberDay, compare: makeCompare, sounds: makeSounds, opposites: makeOpposites, lifecycle: makeLifeCycle, family: makeFamily, travel: makeTravel });

;
// PrintPals batch 8: hundred square, alphabet order, colour words, how to draw,
// sentences, bookmarks, clock craft and snakes and ladders.

// ================================================================ hundred square
function makeHundred(o, paper) {
  const rand = rng(+o.seed || 1);
  const kind = o.kind || 'full';
  const pages = [];
  if (kind === 'pieces') {
    for (const answers of [false, true]) {
      if (answers && o.key === false) break;
      const pg = new Page(paper, answers ? 'Hundred square pieces: answers' : 'Hundred square pieces', { subtitle: answers ? 'Answer key for grown-ups.' : 'Each piece comes from a hundred square. Fill in the numbers around the middle one.', noName: answers });
      const cols = 3, rows = 3, cw = pg.width / cols, ch = (pg.room - 2) / rows, cell = Math.min(cw, ch) / 3.6;
      const r2 = rng(+o.seed || 1);
      for (let i = 0; i < 9; i++) {
        let n;
        do { n = 12 + Math.floor(r2() * 78); } while (n % 10 === 0 || n % 10 === 1);
        const x = pg.left + (i % cols) * cw + cw / 2, y = pg.y + Math.floor(i / cols) * ch + ch / 2;
        [[0, 0, n], [-1, 0, n - 1], [1, 0, n + 1], [0, -1, n - 10], [0, 1, n + 10]].forEach(([dx, dy, v]) => {
          const bx = x + dx * cell - cell / 2, by = y + dy * cell - cell / 2, centre = !dx && !dy;
          pg.add(`<rect x="${bx}" y="${by}" width="${cell}" height="${cell}" fill="${centre ? '#ffc93c' : '#fff'}" stroke="${INK}" stroke-width="0.6"/>`);
          if (centre || answers) pg.add(`<text x="${bx + cell / 2}" y="${by + cell / 2 + cell * 0.16}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${cell * 0.44}" fill="${centre ? INK : '#e0457b'}">${v}</text>`);
        });
      }
      pages.push(pg.svg());
    }
    return pages;
  }
  const step = +o.step || 5;
  const blanks = new Set();
  if (kind === 'missing') {
    const count = { easy: 20, medium: 40, hard: 65 }[o.level] || 40;
    shuffle([...Array(100).keys()].map((k) => k + 1), rand).slice(0, count).forEach((v) => blanks.add(v));
  }
  for (const answers of [false, true]) {
    if (answers && (o.key === false || kind === 'full')) break;
    const titles = { full: 'Hundred square', missing: 'Fill in the missing numbers', blank: 'Write the hundred square', pattern: `Counting in ${step}s` };
    const subs = { full: 'Count along the rows. What patterns can you spot?', missing: 'Write the missing numbers in the empty squares.', blank: 'Write the numbers 1 to 100. The first row is done for you.', pattern: `Colour every number you say when you count in ${step}s. What pattern do you see?` };
    const pg = new Page(paper, answers ? `${titles[kind]}: answers` : titles[kind], { subtitle: answers ? 'Answer key for grown-ups.' : subs[kind], noName: answers });
    const cell = Math.min(pg.width / 10, (pg.room - 4) / 10);
    const gx = pg.left + (pg.width - cell * 10) / 2;
    for (let v = 1; v <= 100; v++) {
      const r = Math.floor((v - 1) / 10), c = (v - 1) % 10, x = gx + c * cell, y = pg.y + r * cell;
      const hide = (kind === 'missing' && blanks.has(v)) || (kind === 'blank' && v > 10);
      const colour = kind === 'pattern' && answers && v % step === 0;
      const fill = colour ? '#ffc93c' : kind === 'full' ? TINTS[r % TINTS.length] : hide ? '#fff' : '#fbfaff';
      pg.add(`<rect x="${x}" y="${y}" width="${cell}" height="${cell}" fill="${fill}" stroke="#9a93b8" stroke-width="0.35"/>`);
      if (!hide || answers) pg.add(`<text x="${x + cell / 2}" y="${y + cell / 2 + cell * 0.15}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${cell * 0.4}" fill="${hide ? '#e0457b' : INK}">${v}</text>`);
    }
    pg.add(`<rect x="${gx}" y="${pg.y}" width="${cell * 10}" height="${cell * 10}" fill="none" stroke="${INK}" stroke-width="0.9"/>`);
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ alphabet order
const ABC_WORDS = [['apple', 'img/apple.webp'], ['balloon', 'img/balloon.webp'], ['cat', 'img/cat.webp'], ['dog', 'img/dog.webp'], ['egg', 'img/egg.webp'],
  ['fish', 'img/fish.webp'], ['hat', 'img/hat.webp'], ['lion', 'img/lion.webp'], ['monkey', 'img/monkey.webp'], ['nest', 'img/nest.webp'],
  ['octopus', 'img/octopus.webp'], ['pig', 'img/pig.webp'], ['rainbow', 'img/rainbow.webp'], ['sun', 'img/sun.webp'], ['turtle', 'img/turtle.webp'], ['zebra', 'img/zebra.webp']];

function makeAbcOrder(o, paper) {
  const rand = rng(+o.seed || 1);
  const kind = o.kind || 'missing';
  const upper = o.case === 'upper';
  const L = (i) => { const c = String.fromCharCode(97 + i); return upper ? c.toUpperCase() : c; };
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const titles = { missing: 'Missing letters', between: 'Before and after', words: 'ABC order' };
    const subs = { missing: 'Say the alphabet. Write the missing letters in the boxes.', between: 'Write the letter that comes before and the letter that comes after.', words: 'Which word comes first in the alphabet? Number the pictures 1, 2, 3, 4.' };
    const pg = new Page(paper, answers ? `${titles[kind]}: answers` : titles[kind], { subtitle: answers ? 'Answer key for grown-ups.' : subs[kind], noName: answers });
    const r2 = rng(+o.seed || 1);
    if (kind === 'missing') {
      const rows = 7, rh = (pg.room - 2) / rows, box = Math.min(18, (pg.width - 8) / 9.4);
      for (let r = 0; r < rows; r++) {
        const start = Math.floor(r2() * 18), gaps = new Set(shuffle([1, 2, 3, 4, 5, 6, 7], r2).slice(0, 3));
        for (let k = 0; k < 8; k++) {
          const x = pg.left + 4 + k * (box + 4), y = pg.y + r * rh + (rh - box) / 2, gap = gaps.has(k);
          pg.add(`<rect x="${x}" y="${y}" width="${box}" height="${box}" rx="3" fill="${gap ? '#fff' : TINTS[r % TINTS.length]}" stroke="${gap ? PALETTE[r % PALETTE.length] : '#d9d4ec'}" stroke-width="${gap ? 0.8 : 0.4}"/>`);
          if (!gap || answers) {
            const ch = L(start + k), size = box * 0.5;
            const top = y + box * 0.72 - size - (/[gjpqy]/.test(ch) ? size * 0.25 : 0);
            pg.add(drawText(ch, x + box / 2 - (GLYPHS[ch].w / 200) * size, upper ? y + box * 0.25 : top, size, gap ? 'ghost' : 'model'));
            if (gap) pg.add(`<text x="${x + box / 2}" y="${y + box * 0.72}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${box * 0.55}" fill="#e0457b">${ch}</text>`);
          }
        }
      }
    } else if (kind === 'between') {
      const cols = 2, rows = 7, cw = pg.width / cols, rh = (pg.room - 2) / rows, box = 13;
      for (let i = 0; i < cols * rows; i++) {
        const m = 1 + Math.floor(r2() * 24);
        const x = pg.left + (i % cols) * cw + 6, y = pg.y + Math.floor(i / cols) * rh + (rh - box) / 2;
        [m - 1, m, m + 1].forEach((v, k) => {
          const bx = x + k * (box + 8), mid = k === 1;
          pg.add(`<rect x="${bx}" y="${y}" width="${box}" height="${box}" rx="3" fill="${mid ? '#ffc93c' : '#fff'}" stroke="${INK}" stroke-width="0.5"/>`);
          if (mid || answers) pg.add(`<text x="${bx + box / 2}" y="${y + box * 0.72}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${box * 0.6}" fill="${mid ? INK : '#e0457b'}">${L(v)}</text>`);
        });
      }
    } else {
      const groups = 4, gh = (pg.room - 2) / groups;
      for (let g = 0; g < groups; g++) {
        const words = shuffle(ABC_WORDS, r2).slice(0, 4);
        const order = [...words].sort((a, b) => a[0].localeCompare(b[0]));
        const y = pg.y + g * gh, cw = pg.width / 4;
        pg.add(`<rect x="${pg.left}" y="${y + 1.5}" width="${pg.width}" height="${gh - 4}" rx="7" fill="${TINTS[g]}"/>`);
        words.forEach(([w, src], k) => {
          const cx = pg.left + k * cw + cw / 2;
          pg.add(pic(src, cx, y + gh * 0.34, Math.min(26, gh * 0.4)));
          pg.add(`<text x="${cx}" y="${y + gh * 0.66}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="6" fill="${INK}">${w}</text>`);
          pg.add(`<rect x="${cx - 6}" y="${y + gh * 0.72}" width="12" height="10" rx="2" fill="#fff" stroke="${INK}" stroke-width="0.5"/>`);
          if (answers) pg.add(`<text x="${cx}" y="${y + gh * 0.72 + 7.4}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="6" fill="#e0457b">${order.findIndex((x) => x[0] === w) + 1}</text>`);
        });
      }
    }
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ colour words
const COLOUR_WORDS = [['red', '#ff4d4d'], ['orange', '#ff9f1c'], ['yellow', '#ffd23f'], ['green', '#3fbf60'], ['blue', '#3a86ff'], ['purple', '#9b5de5'],
  ['pink', '#ff70a6'], ['brown', '#8d5524'], ['black', '#2d2350'], ['white', '#ffffff'], ['grey', '#9aa5b1']];

function crayon(x, y, w, h, colour) {
  return `<path d="M${x} ${y} H${x + w - h} L${x + w} ${y + h / 2} L${x + w - h} ${y + h} H${x} Z" fill="${colour}" stroke="${INK}" stroke-width="0.6" stroke-linejoin="round"/>`
    + `<rect x="${x + w * 0.18}" y="${y}" width="${w * 0.5}" height="${h}" fill="#fff" stroke="${INK}" stroke-width="0.6"/>`;
}

function makeColourWords(o, paper) {
  const rand = rng(+o.seed || 1);
  if (o.kind === 'read') {
    const pg = new Page(paper, 'Read and colour', { subtitle: 'Read the colour word under each picture, then colour it in that colour.' });
    const arts = shuffle(['fish', 'butterfly', 'car', 'teddy', 'rocket', 'ladybird', 'owl', 'sunflower', 'frog'], rand).slice(0, 6);
    const cols = shuffle(COLOUR_WORDS.filter(([w]) => w !== 'white' && w !== 'black'), rand);
    const cw = pg.width / 2, ch = (pg.room - 2) / 3;
    arts.forEach((a, i) => {
      const x = pg.left + (i % 2) * cw, y = pg.y + Math.floor(i / 2) * ch, [word, hex] = cols[i];
      pg.add(`<rect x="${x + 2}" y="${y + 2}" width="${cw - 4}" height="${ch - 4}" rx="7" fill="#fff" stroke="#d9d4ec" stroke-width="0.6"/>`);
      const size = ch - 26;
      pg.add(`<g transform="translate(${x + cw / 2 - size / 2} ${y + 5}) scale(${(size / 200).toFixed(4)})">${colouringArt(a)}</g>`);
      pg.add(crayon(x + cw / 2 - 28, y + ch - 16, 18, 7, hex));
      pg.add(`<text x="${x + cw / 2 - 4}" y="${y + ch - 10}" font-family="${TITLE_FONT}" font-weight="800" font-size="8" fill="${INK}">${word}</text>`);
    });
    return [pg.svg()];
  }
  const list = o.colour && o.colour !== 'all' ? COLOUR_WORDS.filter(([w]) => w === o.colour) : COLOUR_WORDS;
  return list.map(([word, hex]) => {
    const pg = new Page(paper, `The colour ${word}`, { subtitle: `Read it, trace it, write it, then colour the shapes ${word}.` });
    pg.add(crayon(pg.left, pg.y + 4, 70, 22, hex));
    bubbleText(pg, word, pg.left + 130, pg.y + 24, 100, 24);
    pg.y += 38;
    const size = 18;
    for (let r = 0; r < 3; r++) {
      pg.guides(pg.y, size, pg.left, pg.right, false);
      if (r < 2) fillRow(pg, word, pg.y, size, r === 0 ? 'model' : 'trace', r === 0, r === 0 ? 1 : 99);
      pg.y += rowHeight(size) * 0.8;
    }
    pg.y += 4;
    const shapes = shuffle(['star', 'heart', 'circle', 'diamond', 'hexagon', 'triangle', 'square', 'oval'], rand).slice(0, 3);
    const cw = pg.width / 3, r = Math.min(cw, pg.room) * 0.28;
    shapes.forEach((kind, i) => pg.add(shape2d(kind, pg.left + cw * (i + 0.5), pg.y + r + 8, r, `fill="#fff" stroke="${INK}" stroke-width="1.2" stroke-linejoin="round"`)));
    return pg.svg();
  });
}

// ================================================================ how to draw
// The order an artist would draw each part: big outline first, then limbs, face, and the scenery last.
const DRAW_ORDER = {
  cat: [4, 1, 3, 0, 2, 5, 6, 7, 8, 9, 10], owl: [2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 1], teddy: [4, 2, 0, 1, 3, 5, 6, 7, 8],
  penguin: [5, 6, 4, 11, 7, 8, 9, 10, 12, 0, 1, 2, 3], robot: [1, 7, 0, 2, 3, 4, 5, 6, 8, 9, 10],
  frog: [5, 3, 6, 4, 7, 8, 9, 2, 10, 0, 1], dog: [4, 1, 5, 2, 3, 6, 7, 8, 9, 10, 0], bunny: [5, 3, 1, 2, 4, 6, 7, 8, 9, 10, 11, 0],
  unicorn: [6, 5, 7, 4, 8, 9, 10, 11, 0, 1, 2, 3], ladybird: [3, 5, 4, 1, 2, 6, 7, 8, 9, 0], fish: [4, 2, 3, 5, 6, 7, 1, 0],
  rocket: [9, 11, 8, 7, 10, 12, 6, 0, 1, 2, 3, 4, 5],
};
const DRAWABLE = ['cat', 'owl', 'teddy', 'penguin', 'robot', 'frog', 'dog', 'bunny', 'unicorn', 'ladybird', 'fish', 'rocket'];

function makeHowToDraw(o, paper) {
  const rand = rng(+o.seed || 1);
  const key = DRAWABLE.includes(o.picture) ? o.picture : DRAWABLE[Math.floor(rand() * DRAWABLE.length)];
  const art = COLOURING[key];
  const raw = art.draw(), order = DRAW_ORDER[key];
  const parts = order && order.length === raw.length ? order.map((i) => raw[i]) : raw;
  const steps = Math.min(6, parts.length);
  const per = Math.ceil(parts.length / steps);
  const nm = art.name.toLowerCase();
  const pg = new Page(paper, `How to draw ${/^[aeiou]/.test(nm) ? 'an' : 'a'} ${nm}`, { subtitle: 'Copy one step at a time. The new lines in each step are dark. Then draw your own below!' });
  const cols = 3, gw = pg.width / cols, gh = (pg.room * 0.55) / 2;
  const grey = (s) => s.replace(/#1f1b2e/g, '#cfcadf');
  for (let st = 0; st < steps; st++) {
    const x = pg.left + (st % cols) * gw, y = pg.y + Math.floor(st / cols) * gh;
    pg.add(`<rect x="${x + 1.5}" y="${y + 1.5}" width="${gw - 3}" height="${gh - 3}" rx="6" fill="#fff" stroke="#d9d4ec" stroke-width="0.6"/>`);
    pg.add(`<circle cx="${x + 8}" cy="${y + 8}" r="4.5" fill="${PALETTE[st % PALETTE.length]}"/><text x="${x + 8}" y="${y + 9.8}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="4.6" fill="#fff">${st + 1}</text>`);
    const shown = parts.slice(0, Math.min(parts.length, (st + 1) * per));
    const old = parts.slice(0, st * per);
    const inner = old.map(grey).join('') + shown.slice(old.length).join('');
    const size = Math.min(gw, gh) - 10;
    pg.add(`<g transform="translate(${x + (gw - size) / 2} ${y + (gh - size) / 2 + 2}) scale(${(size / 200).toFixed(4)})">${inner}</g>`);
  }
  pg.y += gh * 2 + 6;
  const bh = pg.room - 2;
  pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="${bh}" rx="8" fill="#fff" stroke="${INK}" stroke-width="0.8" stroke-dasharray="3 2"/>`);
  pg.add(`<text x="${pg.left + 6}" y="${pg.y + 8}" font-family="${TITLE_FONT}" font-weight="800" font-size="5.5" fill="${SOFT}">✏️ Your turn! Draw it here, then colour it in.</text>`);
  return [pg.svg()];
}

// ================================================================ sentences
const SENTENCES = [['The dog can run.', ART('dog')], ['I like red apples.', ART('apple')], ['We went to the park.', '🌳'], ['My cat is very fast.', ART('cat')],
  ['The sun is hot today.', ART('sun')], ['Sam has a big kite.', '🪁'], ['Mia can see a bird.', '🐦'], ['The fish is in the pond.', ART('fish')],
  ['I love my mum.', ART('heart')], ['Leo got a new bike.', '🚲'], ['The pig is in the mud.', ART('pig')], ['We can bake a cake.', ART('cake')]];

function makeSentences(o, paper) {
  const rand = rng(+o.seed || 1);
  const kind = o.kind || 'fix';
  const items = shuffle(SENTENCES, rand).slice(0, 6);
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && (o.key === false || kind === 'finish')) break;
    const titles = { fix: 'Fix the sentence', unscramble: 'Mixed-up sentences', finish: 'Finish the sentence' };
    const subs = { fix: 'Each sentence needs a capital letter and a full stop. Write it out correctly.', unscramble: 'Put the words in the right order to make a sentence. Write it on the line.', finish: 'Finish each sentence your own way, then draw a picture.' };
    const pg = new Page(paper, answers ? `${titles[kind]}: answers` : titles[kind], { subtitle: answers ? 'Answer key for grown-ups.' : subs[kind], noName: answers });
    const rh = (pg.room - 2) / items.length;
    const r2 = rng(+o.seed || 7);
    items.forEach(([sent, src], i) => {
      const y = pg.y + i * rh, c = i % PALETTE.length;
      pg.add(`<rect x="${pg.left}" y="${y + 1.5}" width="${pg.width}" height="${rh - 4}" rx="6" fill="${TINTS[c]}"/>`);
      pg.add(pic(src, pg.left + 12, y + rh / 2, Math.min(18, rh - 12)));
      const x = pg.left + 26, lineY = y + rh - 9;
      if (kind === 'fix') {
        const wrong = sent.charAt(0).toLowerCase() + sent.slice(1, -1);
        pg.add(`<text x="${x}" y="${y + 11}" font-family="${FONT}" font-weight="800" font-size="5.6" fill="${INK}">${esc(wrong)}</text>`);
      } else if (kind === 'unscramble') {
        const words = sent.slice(0, -1).split(' ');
        let wx = x;
        shuffle(words, r2).forEach((w) => {
          const ww = w.length * 3 + 6;
          pg.add(`<rect x="${wx}" y="${y + 5}" width="${ww}" height="8.5" rx="2" fill="#fff" stroke="${PALETTE[c]}" stroke-width="0.5"/><text x="${wx + ww / 2}" y="${y + 11}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="4.8" fill="${INK}">${esc(w)}</text>`);
          wx += ww + 3;
        });
      } else {
        const start = sent.split(' ').slice(0, 3).join(' ');
        pg.add(`<text x="${x}" y="${y + 11}" font-family="${FONT}" font-weight="800" font-size="5.6" fill="${INK}">${esc(start)} ...</text>`);
      }
      if (answers) pg.add(`<text x="${x}" y="${lineY - 1}" font-family="${FONT}" font-weight="800" font-size="5.2" fill="#e0457b">${esc(sent)}</text>`);
      pg.add(`<line x1="${x}" x2="${pg.right - 6}" y1="${lineY}" y2="${lineY}" stroke="#9a93b8" stroke-width="0.45"/>`);
    });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ bookmarks
const BOOK_QUOTES = ['I love reading!', 'Books are magic', 'Just one more page!', 'Reading is my superpower', 'Keep calm and read on', 'Every book is an adventure'];

function makeBookmarks(o, paper) {
  const rand = rng(+o.seed || 1);
  const names = listOf(o.names, 40).map((n) => nameOf(n, ''));
  const bright = o.style === 'bright';
  const artsLine = ['cat', 'owl', 'unicorn', 'rocket', 'butterfly', 'teddy', 'penguin', 'dog', 'bee', 'frog', 'fish', 'sunflower'];
  const painted = ['lion', 'monkey', 'octopus', 'turtle', 'cat', 'dog', 'pig', 'zebra', 'bear', 'chick', 'rainbow', 'star'];
  const count = Math.max(4, names.length);
  const pages = [];
  for (let p = 0; p < Math.ceil(count / 4); p++) {
    const pg = new Page(paper, '', { bare: true });
    const bw = pg.width / 4, bh = pg.bottom - pg.m;
    for (let k = 0; k < 4; k++) {
      const i = p * 4 + k, x = pg.left + k * bw + 3, w = bw - 6, y = pg.m, c = i % PALETTE.length;
      const name = names.length ? names[i % names.length] : '';
      pg.add(`<rect x="${x}" y="${y}" width="${w}" height="${bh}" rx="6" fill="${bright ? TINTS[c] : '#fff'}" stroke="${bright ? PALETTE[c] : INK}" stroke-width="0.9"/>`);
      pg.add(`<circle cx="${x + w / 2}" cy="${y + 7}" r="2.4" fill="#fff" stroke="${INK}" stroke-width="0.6"/>`);
      const size = w - 6;
      if (bright) pg.add(pic(ART(painted[(i + Math.floor(rand() * 3)) % painted.length]), x + w / 2, y + 12 + size / 2, size));
      else pg.add(`<g transform="translate(${x + 3} ${y + 12}) scale(${(size / 200).toFixed(4)})">${colouringArt(artsLine[(i + Math.floor(rand() * 3)) % artsLine.length])}</g>`);
      const q = BOOK_QUOTES[(i + p) % BOOK_QUOTES.length];
      const lines = wrap(q, 12);
      textLines(pg, lines, x + w / 2, y + size + 24, 5.4, { anchor: 'middle', weight: 800, font: TITLE_FONT, colour: bright ? PALETTE[c] : INK });
      if (name) {
        const fs = Math.min(13, (bh - size - 60) / (name.length * 0.56));
        const cy = y + size + 30 + lines.length * 7 + (bh - size - 40 - lines.length * 7) / 2;
        pg.add(`<text transform="rotate(-90 ${x + w / 2} ${cy})" x="${x + w / 2}" y="${cy + fs * 0.34}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${fs.toFixed(2)}" fill="#fff" stroke="${INK}" stroke-width="${(fs * 0.06).toFixed(2)}" paint-order="stroke">${esc(name)}</text>`);
      } else {
        for (let s = 0; s < 4; s++) pg.add(`<path d="${starPath(x + w / 2 + (s % 2 ? 7 : -7), y + size + 50 + s * 26, 5, 0.45)}" fill="#fff" stroke="${bright ? PALETTE[c] : INK}" stroke-width="0.7" stroke-linejoin="round"/>`);
      }
    }
    pg.footer = () => {};
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ clock craft
function makeClockCraft(o, paper) {
  const pg = new Page(paper, 'Make your own clock', { subtitle: 'Colour it, cut out the clock and the hands, then join them in the middle with a paper fastener.', noName: true });
  const R = Math.min(pg.width / 2 - 6, 72), cx = pg.w / 2, cy = pg.y + R + 6;
  const helpers = o.helpers !== false;
  if (helpers) {
    pg.add(`<path d="M${cx} ${cy - R} A${R} ${R} 0 0 1 ${cx} ${cy + R} Z" fill="#e6f1ff"/><path d="M${cx} ${cy - R} A${R} ${R} 0 0 0 ${cx} ${cy + R} Z" fill="#ffe8ef"/>`);
  }
  pg.add(`<circle cx="${cx}" cy="${cy}" r="${R}" fill="${helpers ? 'none' : '#fff'}" stroke="${INK}" stroke-width="1.4"/>`);
  for (let m = 0; m < 60; m++) {
    const a = (m * Math.PI) / 30, big = m % 5 === 0, r1 = R - (big ? 7 : 4);
    pg.add(`<line x1="${cx + Math.sin(a) * r1}" y1="${cy - Math.cos(a) * r1}" x2="${cx + Math.sin(a) * (R - 1)}" y2="${cy - Math.cos(a) * (R - 1)}" stroke="${INK}" stroke-width="${big ? 0.8 : 0.35}"/>`);
    if (big && o.minutes !== false) pg.add(`<text x="${cx + Math.sin(a) * (R + 5)}" y="${cy - Math.cos(a) * (R + 5) + 1.4}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="3.6" fill="${SOFT}">${m}</text>`);
  }
  for (let h = 1; h <= 12; h++) {
    const a = (h * Math.PI) / 6;
    pg.add(`<text x="${cx + Math.sin(a) * (R - 17)}" y="${cy - Math.cos(a) * (R - 17) + 4.4}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="12" fill="${INK}">${h}</text>`);
  }
  if (helpers) {
    pg.add(`<text x="${cx + R * 0.34}" y="${cy + 3}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="4.6" fill="#3a86ff">past</text><text x="${cx - R * 0.34}" y="${cy + 3}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="4.6" fill="#e0457b">to</text>`);
    pg.add(`<text x="${cx}" y="${cy - R * 0.4}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="4" fill="${SOFT}">o'clock</text><text x="${cx}" y="${cy + R * 0.46}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="4" fill="${SOFT}">half past</text>`);
  }
  pg.add(`<circle cx="${cx}" cy="${cy}" r="2" fill="#fff" stroke="${INK}" stroke-width="0.8"/>`);
  pg.add(`<circle cx="${cx}" cy="${cy}" r="${R + 10}" fill="none" stroke="#b9b3d6" stroke-width="0.5" stroke-dasharray="2.5 1.8"/>`);
  // Hands to cut out
  const hy = cy + R + 22;
  scissors(pg, hy - 6);
  const hand = (x, y, len, w, c, label) => {
    pg.add(`<path d="M${x} ${y - w / 2} H${x + len - w * 1.6} L${x + len - w * 1.6} ${y - w * 1.1} L${x + len} ${y} L${x + len - w * 1.6} ${y + w * 1.1} L${x + len - w * 1.6} ${y + w / 2} H${x} A${w / 2} ${w / 2} 0 0 1 ${x} ${y - w / 2} Z" fill="${c}" stroke="${INK}" stroke-width="0.7" stroke-linejoin="round"/>`);
    pg.add(`<circle cx="${x + 3}" cy="${y}" r="1.6" fill="#fff" stroke="${INK}" stroke-width="0.6"/>`);
    pg.add(`<text x="${x}" y="${y + w + 5}" font-family="${FONT}" font-weight="800" font-size="3.8" fill="${SOFT}">${label}</text>`);
  };
  hand(pg.left + 10, hy + 8, R * 0.62, 6, '#ffd6e4', 'hour hand (short)');
  hand(pg.left + 10, hy + 26, R * 0.9, 5, '#d6e6ff', 'minute hand (long)');
  pg.add(`<text x="${pg.right}" y="${hy + 14}" text-anchor="end" font-family="${FONT}" font-weight="700" font-size="3.8" fill="${SOFT}">Tip: glue the clock onto card</text><text x="${pg.right}" y="${hy + 20}" text-anchor="end" font-family="${FONT}" font-weight="700" font-size="3.8" fill="${SOFT}">so it lasts longer.</text>`);
  return [pg.svg()];
}

// ================================================================ snakes and ladders
function makeSnakes(o, paper) {
  const rand = rng(+o.seed || 1);
  const pages = [];
  const pg = new Page(paper, 'Snakes and ladders', { subtitle: 'Roll the dice and move your counter. Climb up the ladders, slide down the snakes. First to 100 wins!', noName: true });
  const cell = Math.min(pg.width, pg.room - 2) / 10;
  const gx = pg.left + (pg.width - cell * 10) / 2, gy = pg.y;
  const pos = (n) => {
    const r = Math.floor((n - 1) / 10), c = (n - 1) % 10, col = r % 2 === 0 ? c : 9 - c;
    return [gx + col * cell + cell / 2, gy + (9 - r) * cell + cell / 2];
  };
  for (let n = 1; n <= 100; n++) {
    const [x, y] = pos(n);
    const r = Math.floor((n - 1) / 10);
    pg.add(`<rect x="${x - cell / 2}" y="${y - cell / 2}" width="${cell}" height="${cell}" fill="${(n + r) % 2 ? TINTS[r % TINTS.length] : '#fff'}" stroke="#c9c3e3" stroke-width="0.3"/>`);
    pg.add(`<text x="${x - cell / 2 + 1.6}" y="${y - cell / 2 + 4.4}" font-family="${FONT}" font-weight="800" font-size="3.6" fill="${SOFT}">${n}</text>`);
  }
  pg.add(`<text x="${pos(1)[0]}" y="${pos(1)[1] + 3}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="4.4" fill="#2e9d63">START</text>`);
  pg.add(pic(ART('medal'), pos(100)[0], pos(100)[1] + 1, cell * 0.6));
  // Pick ladders and snakes that do not share squares.
  const used = new Set([1, 100]);
  const pick = (lo, hi) => { let n; do { n = lo + Math.floor(rand() * (hi - lo + 1)); } while (used.has(n)); used.add(n); return n; };
  const ladders = [], snakes = [];
  for (let i = 0; i < 5; i++) { const a = pick(2, 70); let b; do { b = pick(Math.min(99, a + 9), Math.min(99, a + 24)); } while (Math.floor((b - 1) / 10) === Math.floor((a - 1) / 10)); ladders.push([a, b]); }
  for (let i = 0; i < 5; i++) { const h = pick(25, 98); let t; do { t = pick(Math.max(2, h - 24), Math.max(2, h - 9)); } while (Math.floor((t - 1) / 10) === Math.floor((h - 1) / 10)); snakes.push([h, t]); }
  ladders.forEach(([a, b]) => {
    const [x1, y1] = pos(a), [x2, y2] = pos(b);
    const len = Math.hypot(x2 - x1, y2 - y1), nx = -(y2 - y1) / len * 2.6, ny = (x2 - x1) / len * 2.6;
    let s = `<line x1="${x1 + nx}" y1="${y1 + ny}" x2="${x2 + nx}" y2="${y2 + ny}" stroke="#8d5524" stroke-width="1.6" stroke-linecap="round"/><line x1="${x1 - nx}" y1="${y1 - ny}" x2="${x2 - nx}" y2="${y2 - ny}" stroke="#8d5524" stroke-width="1.6" stroke-linecap="round"/>`;
    const rungs = Math.floor(len / 5);
    for (let k = 1; k < rungs; k++) { const t = k / rungs, x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t; s += `<line x1="${x + nx}" y1="${y + ny}" x2="${x - nx}" y2="${y - ny}" stroke="#c28a4e" stroke-width="0.9"/>`; }
    pg.add(s);
  });
  snakes.forEach(([h, t], i) => {
    const [x1, y1] = pos(h), [x2, y2] = pos(t);
    const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy), nx = -dy / len, ny = dx / len, wig = Math.min(12, len * 0.18);
    const d = `M${x1} ${y1} C${x1 + dx * 0.3 + nx * wig} ${y1 + dy * 0.3 + ny * wig} ${x1 + dx * 0.7 - nx * wig} ${y1 + dy * 0.7 - ny * wig} ${x2} ${y2}`;
    const col = [PALETTE[0], PALETTE[2], PALETTE[4], PALETTE[5], PALETTE[7]][i];
    pg.add(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="4.4" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="3.2" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#fff" stroke-width="0.6" stroke-dasharray="1 2.4" stroke-linecap="round"/>`);
    pg.add(`<ellipse cx="${x1}" cy="${y1}" rx="3.4" ry="2.8" fill="${col}" stroke="${INK}" stroke-width="0.6"/><circle cx="${x1 - 1.2}" cy="${y1 - 0.8}" r="0.7" fill="${INK}"/><circle cx="${x1 + 1.2}" cy="${y1 - 0.8}" r="0.7" fill="${INK}"/>`);
  });
  pages.push(pg.svg());
  if (o.extras !== false) {
    const p2 = new Page(paper, 'Dice and counters', { subtitle: 'Cut out the dice, fold along the lines and glue the tabs. Cut out a counter for each player.', noName: true });
    const s = 26, ox = p2.left + 20, oy = p2.y + 6;
    const pips = { 1: [[0.5, 0.5]], 2: [[0.28, 0.28], [0.72, 0.72]], 3: [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]], 4: [[0.28, 0.28], [0.72, 0.28], [0.28, 0.72], [0.72, 0.72]], 5: [[0.25, 0.25], [0.75, 0.25], [0.5, 0.5], [0.25, 0.75], [0.75, 0.75]], 6: [[0.28, 0.22], [0.72, 0.22], [0.28, 0.5], [0.72, 0.5], [0.28, 0.78], [0.72, 0.78]] };
    const net = [[1, 0, 1], [0, 1, 2], [1, 1, 3], [2, 1, 5], [3, 1, 4], [1, 2, 6]];
    net.forEach(([c, r, n]) => {
      const x = ox + c * s, y = oy + r * s;
      p2.add(`<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="#fff" stroke="${INK}" stroke-width="0.7"/>`);
      pips[n].forEach(([px, py]) => p2.add(`<circle cx="${x + px * s}" cy="${y + py * s}" r="${s * 0.08}" fill="${INK}"/>`));
    });
    const tab = (x, y, w, h) => p2.add(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#f4f1fb" stroke="${INK}" stroke-width="0.5" stroke-dasharray="2 1.4"/>`);
    tab(ox + s, oy - 8, s, 8); tab(ox - 8, oy + s, 8, s); tab(ox + 4 * s, oy + s, 8, s); tab(ox + s, oy + 3 * s, s, 8); tab(ox, oy + s - 8, s, 8); tab(ox + 2 * s, oy + s - 8, s, 8);
    p2.add(`<text x="${ox + 2 * s + 30}" y="${oy + 8}" font-family="${FONT}" font-weight="700" font-size="4" fill="${SOFT}">Fold on the lines. Glue the grey tabs inside.</text>`);
    const cy2 = oy + 3 * s + 30;
    ['lion', 'monkey', 'pig', 'turtle', 'chick', 'octopus'].forEach((a, i) => {
      const x = p2.left + 18 + i * 30, y = cy2;
      p2.add(`<circle cx="${x}" cy="${y}" r="12" fill="${TINTS[i]}" stroke="${PALETTE[i]}" stroke-width="1"/><circle cx="${x}" cy="${y}" r="13.5" fill="none" stroke="#b9b3d6" stroke-width="0.4" stroke-dasharray="2 1.4"/>`);
      p2.add(pic(ART(a), x, y, 18));
    });
    pages.push(p2.svg());
  }
  return pages;
}

Object.assign(MAKERS, { hundred: makeHundred, abcorder: makeAbcOrder, colourwords: makeColourWords, howtodraw: makeHowToDraw, sentences: makeSentences, bookmarks: makeBookmarks, clockcraft: makeClockCraft, snakes: makeSnakes });

;
// PrintPals batch 9: odd one out, roll and draw, patterns, syllables, door hangers,
// 30 day challenges, doubles and halves, and position words.

const txt = (x, y, s, fs, opts = {}) => {
  const { weight = 800, colour = INK, anchor = 'middle', font = TITLE_FONT } = opts;
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${font}" font-weight="${weight}" font-size="${fs}" fill="${colour}">${esc(s)}</text>`;
};
const panel = (x, y, w, h, fill = '#fff', stroke = '#d9d4ec', rx = 5) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="0.6"/>`;

// ================================================================ odd one out
const ODD_GROUPS = {
  animals: ['cat', 'dog', 'lion', 'monkey', 'pig', 'zebra', 'gorilla', 'bear', 'chick', 'turtle', 'octopus', 'fish'],
  fruit: ['apple', 'banana', 'orange', 'strawberry', 'blueberry'],
  treats: ['cake', 'cupcake', 'cookie', 'donut', 'lolly'],
  flowers: ['daisy', 'rose', 'tulip', 'sunflower', 'bluebell'],
  party: ['balloon', 'present', 'popper'],
  sky: ['sun', 'star', 'rainbow'],
};
// Groups that are too close to mix (a cake is also a party thing, a strawberry is also food).
const ODD_CLASH = { fruit: ['treats'], treats: ['fruit', 'party'], party: ['treats'] };
const ODD_WHY = { animals: 'animals', fruit: 'fruit', treats: 'sweet treats', flowers: 'flowers', party: 'party things', sky: 'things in the sky' };

function makeOddOne(o, paper) {
  const rand = rng(+o.seed || 1);
  const level = o.level || 'medium';
  const per = level === 'hard' ? 5 : 4, rowsN = 6;
  const rows = [];
  const groups = Object.keys(ODD_GROUPS);
  for (let r = 0; r < rowsN; r++) {
    if (level === 'easy') {
      const all = Object.values(ODD_GROUPS).flat();
      const [a, b] = shuffle(all, rand);
      const items = Array(per - 1).fill(a).concat([b]);
      const order = shuffle(items.map((v, i) => [v, i === per - 1]), rand);
      rows.push({ items: order, why: '' });
    } else {
      const pool = level === 'hard' ? groups.filter((g) => ODD_GROUPS[g].length >= per - 1) : groups;
      const g = pool[(r + Math.floor(rand() * pool.length)) % pool.length];
      const others = groups.filter((x) => x !== g && !(ODD_CLASH[g] || []).includes(x));
      const og = others[Math.floor(rand() * others.length)];
      const same = shuffle(ODD_GROUPS[g], rand).slice(0, per - 1);
      const odd = ODD_GROUPS[og][Math.floor(rand() * ODD_GROUPS[og].length)];
      rows.push({ items: shuffle([...same.map((v) => [v, false]), [odd, true]], rand), why: `The others are all ${ODD_WHY[g]}.` });
    }
  }
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const pg = new Page(paper, answers ? 'Odd one out: answers' : 'Odd one out', { subtitle: answers ? 'Answer key for grown-ups.' : level === 'easy' ? 'Look carefully. Circle the picture that is different.' : 'Which one does not belong? Circle it, then say why.', noName: answers });
    const rh = (pg.room - 2) / rowsN, cw = pg.width / per;
    rows.forEach((row, r) => {
      const y = pg.y + r * rh;
      pg.add(panel(pg.left, y + 1.5, pg.width, rh - 3, TINTS[r % TINTS.length], '#e2ddf2', 7));
      pg.add(`<circle cx="${pg.left + 6}" cy="${y + 8}" r="4" fill="${PALETTE[r % PALETTE.length]}"/>` + txt(pg.left + 6, y + 9.6, r + 1, 4.6, { colour: '#fff' }));
      const size = Math.min(cw - 8, rh - (level === 'easy' ? 10 : 16));
      row.items.forEach(([name, odd], i) => {
        const cx = pg.left + cw * (i + 0.5), cy = y + 3 + size / 2 + 2;
        pg.add(`<rect x="${cx - size / 2 - 1}" y="${cy - size / 2 - 1}" width="${size + 2}" height="${size + 2}" rx="5" fill="#fff" stroke="#e2ddf2" stroke-width="0.5"/>`);
        pg.add(pic(ART(name), cx, cy, size * 0.9));
        if (answers && odd) pg.add(`<ellipse cx="${cx}" cy="${cy}" rx="${size / 2 + 3}" ry="${size / 2 + 2}" fill="none" stroke="#e0457b" stroke-width="1.2"/>`);
      });
      if (level !== 'easy') {
        const ly = y + rh - 5.5;
        if (answers) pg.add(txt(pg.left + 14, ly, row.why, 4, { anchor: 'start', colour: '#e0457b', font: FONT }));
        else pg.add(txt(pg.left + 14, ly, 'Why?', 4, { anchor: 'start', colour: SOFT, font: FONT }) + `<line x1="${pg.left + 26}" x2="${pg.right - 6}" y1="${ly}" y2="${ly}" stroke="#b9b3d6" stroke-width="0.35"/>`);
      }
    });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ roll and draw
const RD_S = 'fill="#fff" stroke="#2d2350" stroke-width="0.7" stroke-linejoin="round" stroke-linecap="round"';
const RD_N = 'fill="none" stroke="#2d2350" stroke-width="0.7" stroke-linejoin="round" stroke-linecap="round"';
const RD_F = 'fill="#2d2350"';
const rdEye = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" ${RD_S}/><circle cx="${x + r * 0.2}" cy="${y + r * 0.1}" r="${r * 0.45}" ${RD_F}/>`;
// Each part: [label, [six little drawings (cx, cy, s) => svg]]
const ROLL_THEMES = {
  monster: { title: 'Roll and draw a monster', parts: [
    ['Body', [
      (x, y, s) => `<circle cx="${x}" cy="${y}" r="${s * 0.42}" ${RD_S}/>`,
      (x, y, s) => `<rect x="${x - s * 0.4}" y="${y - s * 0.4}" width="${s * 0.8}" height="${s * 0.8}" rx="${s * 0.14}" ${RD_S}/>`,
      (x, y, s) => `<path d="M${x} ${y - s * 0.45} L${x + s * 0.45} ${y + s * 0.4} L${x - s * 0.45} ${y + s * 0.4} Z" ${RD_S}/>`,
      (x, y, s) => `<ellipse cx="${x}" cy="${y}" rx="${s * 0.3}" ry="${s * 0.45}" ${RD_S}/>`,
      (x, y, s) => `<path d="M${x - s * 0.4} ${y + s * 0.35} Q${x - s * 0.5} ${y - s * 0.2} ${x - s * 0.15} ${y - s * 0.4} Q${x + s * 0.1} ${y - s * 0.5} ${x + s * 0.35} ${y - s * 0.25} Q${x + s * 0.55} ${y + s * 0.05} ${x + s * 0.4} ${y + s * 0.35} Z" ${RD_S}/>`,
      (x, y, s) => `<path d="${starPath(x, y + s * 0.04, s * 0.48, 0.55)}" ${RD_S}/>`,
    ]],
    ['Eyes', [
      (x, y, s) => rdEye(x, y, s * 0.24),
      (x, y, s) => rdEye(x - s * 0.16, y, s * 0.13) + rdEye(x + s * 0.16, y, s * 0.13),
      (x, y, s) => rdEye(x - s * 0.24, y + s * 0.05, s * 0.1) + rdEye(x, y - s * 0.1, s * 0.1) + rdEye(x + s * 0.24, y + s * 0.05, s * 0.1),
      (x, y, s) => `<path d="M${x - s * 0.12} ${y + s * 0.3} L${x - s * 0.2} ${y - s * 0.1} M${x + s * 0.12} ${y + s * 0.3} L${x + s * 0.2} ${y - s * 0.1}" ${RD_N}/>` + rdEye(x - s * 0.2, y - s * 0.2, s * 0.1) + rdEye(x + s * 0.2, y - s * 0.2, s * 0.1),
      (x, y, s) => `<path d="M${x - s * 0.32} ${y} Q${x - s * 0.18} ${y + s * 0.12} ${x - s * 0.04} ${y} M${x + s * 0.04} ${y} Q${x + s * 0.18} ${y + s * 0.12} ${x + s * 0.32} ${y}" ${RD_N}/>`,
      (x, y, s) => [[-0.2, -0.12], [0.2, -0.12], [-0.2, 0.14], [0.2, 0.14]].map(([a, b]) => rdEye(x + a * s, y + b * s, s * 0.08)).join(''),
    ]],
    ['Mouth', [
      (x, y, s) => `<path d="M${x - s * 0.3} ${y - s * 0.08} Q${x} ${y + s * 0.3} ${x + s * 0.3} ${y - s * 0.08}" ${RD_N}/>`,
      (x, y, s) => `<path d="M${x - s * 0.3} ${y - s * 0.1} Q${x} ${y + s * 0.3} ${x + s * 0.3} ${y - s * 0.1} Z" ${RD_S}/><path d="M${x - s * 0.16} ${y - s * 0.02} l${s * 0.05} ${s * 0.12} l${s * 0.05} ${-s * 0.1} M${x + s * 0.06} ${y - s * 0.02} l${s * 0.05} ${s * 0.12} l${s * 0.05} ${-s * 0.11}" ${RD_N}/>`,
      (x, y, s) => `<ellipse cx="${x}" cy="${y}" rx="${s * 0.14}" ry="${s * 0.18}" ${RD_S}/>`,
      (x, y, s) => `<path d="M${x - s * 0.34} ${y} L${x - s * 0.22} ${y - s * 0.1} L${x - s * 0.11} ${y} L${x} ${y - s * 0.1} L${x + s * 0.11} ${y} L${x + s * 0.22} ${y - s * 0.1} L${x + s * 0.34} ${y}" ${RD_N}/>`,
      (x, y, s) => `<path d="M${x - s * 0.3} ${y - s * 0.06} H${x + s * 0.3}" ${RD_N}/><path d="M${x - s * 0.08} ${y - s * 0.06} V${y + s * 0.14} A${s * 0.08} ${s * 0.08} 0 0 0 ${x + s * 0.08} ${y + s * 0.14} V${y - s * 0.06}" ${RD_S}/>`,
      (x, y, s) => `<path d="M${x - s * 0.34} ${y - s * 0.12} Q${x} ${y + s * 0.34} ${x + s * 0.34} ${y - s * 0.12} Z" ${RD_S}/><rect x="${x - s * 0.05}" y="${y - s * 0.07}" width="${s * 0.1}" height="${s * 0.11}" ${RD_S}/>`,
    ]],
    ['Arms', [
      (x, y, s) => `<path d="M${x - s * 0.12} ${y} L${x - s * 0.42} ${y - s * 0.2} M${x + s * 0.12} ${y} L${x + s * 0.42} ${y - s * 0.2}" ${RD_N}/><circle cx="${x - s * 0.42}" cy="${y - s * 0.2}" r="${s * 0.05}" ${RD_S}/><circle cx="${x + s * 0.42}" cy="${y - s * 0.2}" r="${s * 0.05}" ${RD_S}/>`,
      (x, y, s) => `<path d="M${x - s * 0.12} ${y - s * 0.08} L${x - s * 0.42} ${y - s * 0.28} M${x + s * 0.12} ${y - s * 0.08} L${x + s * 0.42} ${y - s * 0.28} M${x - s * 0.12} ${y + s * 0.1} L${x - s * 0.42} ${y + s * 0.26} M${x + s * 0.12} ${y + s * 0.1} L${x + s * 0.42} ${y + s * 0.26}" ${RD_N}/>`,
      (x, y, s) => `<path d="M${x - s * 0.1} ${y} Q${x - s * 0.3} ${y - s * 0.3} ${x - s * 0.42} ${y} T${x - s * 0.4} ${y + s * 0.3} M${x + s * 0.1} ${y} Q${x + s * 0.3} ${y - s * 0.3} ${x + s * 0.42} ${y} T${x + s * 0.4} ${y + s * 0.3}" ${RD_N}/>`,
      (x, y, s) => `<path d="M${x - s * 0.08} ${y} Q${x - s * 0.4} ${y - s * 0.4} ${x - s * 0.46} ${y - s * 0.05} Q${x - s * 0.34} ${y - s * 0.02} ${x - s * 0.36} ${y + s * 0.12} Q${x - s * 0.22} ${y + s * 0.02} ${x - s * 0.08} ${y} Z M${x + s * 0.08} ${y} Q${x + s * 0.4} ${y - s * 0.4} ${x + s * 0.46} ${y - s * 0.05} Q${x + s * 0.34} ${y - s * 0.02} ${x + s * 0.36} ${y + s * 0.12} Q${x + s * 0.22} ${y + s * 0.02} ${x + s * 0.08} ${y} Z" ${RD_S}/>`,
      (x, y, s) => `<path d="M${x - s * 0.1} ${y} L${x - s * 0.36} ${y} M${x - s * 0.36} ${y} l-${s * 0.08} -${s * 0.1} M${x - s * 0.36} ${y} l-${s * 0.1} 0 M${x - s * 0.36} ${y} l-${s * 0.08} ${s * 0.1} M${x + s * 0.1} ${y} L${x + s * 0.36} ${y} M${x + s * 0.36} ${y} l${s * 0.08} -${s * 0.1} M${x + s * 0.36} ${y} l${s * 0.1} 0 M${x + s * 0.36} ${y} l${s * 0.08} ${s * 0.1}" ${RD_N}/>`,
      (x, y, s) => `<path d="M${x - s * 0.1} ${y} Q${x - s * 0.3} ${y + s * 0.02} ${x - s * 0.3} ${y - s * 0.24} M${x + s * 0.1} ${y} Q${x + s * 0.3} ${y + s * 0.02} ${x + s * 0.3} ${y - s * 0.24}" ${RD_N}/><circle cx="${x - s * 0.3}" cy="${y - s * 0.3}" r="${s * 0.08}" ${RD_S}/><circle cx="${x + s * 0.3}" cy="${y - s * 0.3}" r="${s * 0.08}" ${RD_S}/>`,
    ]],
    ['Legs', [
      (x, y, s) => `<path d="M${x - s * 0.12} ${y - s * 0.3} V${y + s * 0.25} M${x + s * 0.12} ${y - s * 0.3} V${y + s * 0.25}" ${RD_N}/><ellipse cx="${x - s * 0.17}" cy="${y + s * 0.28}" rx="${s * 0.1}" ry="${s * 0.05}" ${RD_S}/><ellipse cx="${x + s * 0.17}" cy="${y + s * 0.28}" rx="${s * 0.1}" ry="${s * 0.05}" ${RD_S}/>`,
      (x, y, s) => [-0.3, -0.1, 0.1, 0.3].map((a) => `<path d="M${x + a * s} ${y - s * 0.3} V${y + s * 0.28}" ${RD_N}/>`).join(''),
      (x, y, s) => `<path d="M${x} ${y - s * 0.3} V${y + s * 0.18}" ${RD_N}/><ellipse cx="${x}" cy="${y + s * 0.26}" rx="${s * 0.22}" ry="${s * 0.08}" ${RD_S}/>`,
      (x, y, s) => `<path d="M${x - s * 0.12} ${y - s * 0.3} v${s * 0.08} l${s * 0.08} ${s * 0.06} l-${s * 0.16} ${s * 0.06} l${s * 0.16} ${s * 0.06} l-${s * 0.16} ${s * 0.06} l${s * 0.08} ${s * 0.06} v${s * 0.08} M${x + s * 0.14} ${y - s * 0.3} v${s * 0.08} l${s * 0.08} ${s * 0.06} l-${s * 0.16} ${s * 0.06} l${s * 0.16} ${s * 0.06} l-${s * 0.16} ${s * 0.06} l${s * 0.08} ${s * 0.06} v${s * 0.08}" ${RD_N}/>`,
      (x, y, s) => `<path d="M${x - s * 0.14} ${y - s * 0.3} V${y + s * 0.1} M${x + s * 0.14} ${y - s * 0.3} V${y + s * 0.1}" ${RD_N}/><path d="M${x - s * 0.36} ${y + s * 0.3} Q${x - s * 0.36} ${y + s * 0.08} ${x - s * 0.14} ${y + s * 0.1} Q${x - s * 0.04} ${y + s * 0.2} ${x - s * 0.06} ${y + s * 0.3} Z M${x + s * 0.36} ${y + s * 0.3} Q${x + s * 0.36} ${y + s * 0.08} ${x + s * 0.14} ${y + s * 0.1} Q${x + s * 0.04} ${y + s * 0.2} ${x + s * 0.06} ${y + s * 0.3} Z" ${RD_S}/>`,
      (x, y, s) => `<path d="M${x - s * 0.3} ${y - s * 0.3} Q${x - s * 0.4} ${y} ${x - s * 0.24} ${y + s * 0.3} M${x - s * 0.1} ${y - s * 0.3} Q${x - s * 0.18} ${y} ${x - s * 0.04} ${y + s * 0.3} M${x + s * 0.1} ${y - s * 0.3} Q${x + s * 0.18} ${y} ${x + s * 0.04} ${y + s * 0.3} M${x + s * 0.3} ${y - s * 0.3} Q${x + s * 0.4} ${y} ${x + s * 0.24} ${y + s * 0.3}" ${RD_N}/>`,
    ]],
    ['Extra', [
      (x, y, s) => `<path d="M${x - s * 0.3} ${y + s * 0.2} Q${x - s * 0.4} ${y - s * 0.2} ${x - s * 0.2} ${y - s * 0.36} Q${x - s * 0.22} ${y - s * 0.04} ${x - s * 0.12} ${y + s * 0.2} Z M${x + s * 0.3} ${y + s * 0.2} Q${x + s * 0.4} ${y - s * 0.2} ${x + s * 0.2} ${y - s * 0.36} Q${x + s * 0.22} ${y - s * 0.04} ${x + s * 0.12} ${y + s * 0.2} Z" ${RD_S}/>`,
      (x, y, s) => `<path d="M${x - s * 0.1} ${y + s * 0.3} Q${x - s * 0.14} ${y - s * 0.05} ${x - s * 0.24} ${y - s * 0.22} M${x + s * 0.1} ${y + s * 0.3} Q${x + s * 0.14} ${y - s * 0.05} ${x + s * 0.24} ${y - s * 0.22}" ${RD_N}/><circle cx="${x - s * 0.26}" cy="${y - s * 0.28}" r="${s * 0.07}" ${RD_S}/><circle cx="${x + s * 0.26}" cy="${y - s * 0.28}" r="${s * 0.07}" ${RD_S}/>`,
      (x, y, s) => `<rect x="${x - s * 0.18}" y="${y - s * 0.34}" width="${s * 0.36}" height="${s * 0.44}" ${RD_S}/><rect x="${x - s * 0.34}" y="${y + s * 0.1}" width="${s * 0.68}" height="${s * 0.08}" rx="${s * 0.03}" ${RD_S}/>`,
      (x, y, s) => [[-0.2, -0.14, 0.09], [0.16, -0.2, 0.07], [0.02, 0.06, 0.1], [-0.22, 0.24, 0.06], [0.24, 0.18, 0.08]].map(([a, b, r]) => `<circle cx="${x + a * s}" cy="${y + b * s}" r="${r * s}" ${RD_S}/>`).join(''),
      (x, y, s) => `<path d="M${x - s * 0.3} ${y + s * 0.2} Q${x - s * 0.32} ${y - s * 0.3} ${x - s * 0.1} ${y - s * 0.1} Q${x} ${y - s * 0.44} ${x + s * 0.1} ${y - s * 0.1} Q${x + s * 0.32} ${y - s * 0.3} ${x + s * 0.3} ${y + s * 0.2}" ${RD_N}/>`,
      (x, y, s) => `<path d="M${x} ${y} L${x - s * 0.32} ${y - s * 0.18} L${x - s * 0.32} ${y + s * 0.18} Z M${x} ${y} L${x + s * 0.32} ${y - s * 0.18} L${x + s * 0.32} ${y + s * 0.18} Z" ${RD_S}/><circle cx="${x}" cy="${y}" r="${s * 0.07}" ${RD_S}/>`,
    ]],
  ] },
};
// A robot shares the monster's eyes, mouths and extras, with its own body, arms and legs.
ROLL_THEMES.robot = { title: 'Roll and draw a robot', parts: [
  ['Head', [
    (x, y, s) => `<rect x="${x - s * 0.36}" y="${y - s * 0.3}" width="${s * 0.72}" height="${s * 0.6}" rx="${s * 0.06}" ${RD_S}/>`,
    (x, y, s) => `<circle cx="${x}" cy="${y}" r="${s * 0.36}" ${RD_S}/>`,
    (x, y, s) => `<path d="${polygonPath(x, y, s * 0.4, 6, 0)}" ${RD_S}/>`,
    (x, y, s) => `<path d="M${x - s * 0.36} ${y + s * 0.3} V${y - s * 0.05} A${s * 0.36} ${s * 0.36} 0 0 1 ${x + s * 0.36} ${y - s * 0.05} V${y + s * 0.3} Z" ${RD_S}/>`,
    (x, y, s) => `<path d="M${x - s * 0.24} ${y - s * 0.34} H${x + s * 0.24} L${x + s * 0.36} ${y + s * 0.3} H${x - s * 0.36} Z" ${RD_S}/>`,
    (x, y, s) => `<rect x="${x - s * 0.24}" y="${y - s * 0.4}" width="${s * 0.48}" height="${s * 0.8}" rx="${s * 0.05}" ${RD_S}/>`,
  ]],
  ['Eyes', [
    (x, y, s) => `<rect x="${x - s * 0.3}" y="${y - s * 0.08}" width="${s * 0.6}" height="${s * 0.16}" rx="${s * 0.08}" ${RD_S}/><circle cx="${x}" cy="${y}" r="${s * 0.05}" ${RD_F}/>`,
    ROLL_THEMES.monster.parts[1][1][1], ROLL_THEMES.monster.parts[1][1][0],
    (x, y, s) => `<rect x="${x - s * 0.3}" y="${y - s * 0.1}" width="${s * 0.2}" height="${s * 0.2}" ${RD_S}/><rect x="${x + s * 0.1}" y="${y - s * 0.1}" width="${s * 0.2}" height="${s * 0.2}" ${RD_S}/>`,
    ROLL_THEMES.monster.parts[1][1][2],
    (x, y, s) => `<path d="M${x - s * 0.3} ${y - s * 0.1} l${s * 0.2} ${s * 0.2} M${x - s * 0.1} ${y - s * 0.1} l-${s * 0.2} ${s * 0.2} M${x + s * 0.1} ${y - s * 0.1} l${s * 0.2} ${s * 0.2} M${x + s * 0.3} ${y - s * 0.1} l-${s * 0.2} ${s * 0.2}" ${RD_N}/>`,
  ]],
  ['Body', [
    (x, y, s) => `<rect x="${x - s * 0.34}" y="${y - s * 0.38}" width="${s * 0.68}" height="${s * 0.76}" rx="${s * 0.06}" ${RD_S}/><rect x="${x - s * 0.2}" y="${y - s * 0.22}" width="${s * 0.4}" height="${s * 0.26}" ${RD_S}/>`,
    (x, y, s) => `<rect x="${x - s * 0.42}" y="${y - s * 0.3}" width="${s * 0.84}" height="${s * 0.6}" rx="${s * 0.08}" ${RD_S}/><circle cx="${x - s * 0.18}" cy="${y}" r="${s * 0.08}" ${RD_S}/><circle cx="${x + s * 0.02}" cy="${y}" r="${s * 0.08}" ${RD_S}/><circle cx="${x + s * 0.22}" cy="${y}" r="${s * 0.08}" ${RD_S}/>`,
    (x, y, s) => `<circle cx="${x}" cy="${y}" r="${s * 0.4}" ${RD_S}/><path d="${starPath(x, y, s * 0.16)}" ${RD_S}/>`,
    (x, y, s) => `<path d="M${x - s * 0.24} ${y - s * 0.38} H${x + s * 0.24} L${x + s * 0.38} ${y + s * 0.38} H${x - s * 0.38} Z" ${RD_S}/><path d="M${x - s * 0.14} ${y} H${x + s * 0.14} M${x - s * 0.18} ${y + s * 0.14} H${x + s * 0.18}" ${RD_N}/>`,
    (x, y, s) => `<rect x="${x - s * 0.34}" y="${y - s * 0.38}" width="${s * 0.68}" height="${s * 0.76}" rx="${s * 0.2}" ${RD_S}/><path d="M${x} ${y - s * 0.12} C${x - s * 0.22} ${y - s * 0.3} ${x - s * 0.22} ${y} ${x} ${y + s * 0.14} C${x + s * 0.22} ${y} ${x + s * 0.22} ${y - s * 0.3} ${x} ${y - s * 0.12} Z" ${RD_S}/>`,
    (x, y, s) => `<path d="${polygonPath(x, y, s * 0.42, 8, Math.PI / 8)}" ${RD_S}/><rect x="${x - s * 0.16}" y="${y - s * 0.1}" width="${s * 0.32}" height="${s * 0.2}" ${RD_S}/>`,
  ]],
  ['Arms', [
    (x, y, s) => `<path d="M${x - s * 0.1} ${y} H${x - s * 0.34} V${y - s * 0.2} M${x + s * 0.1} ${y} H${x + s * 0.34} V${y - s * 0.2}" ${RD_N}/><path d="M${x - s * 0.42} ${y - s * 0.3} A${s * 0.08} ${s * 0.08} 0 1 0 ${x - s * 0.26} ${y - s * 0.3}" ${RD_N}/><path d="M${x + s * 0.26} ${y - s * 0.3} A${s * 0.08} ${s * 0.08} 0 1 0 ${x + s * 0.42} ${y - s * 0.3}" ${RD_N}/>`,
    ROLL_THEMES.monster.parts[3][1][4],
    (x, y, s) => `<path d="M${x - s * 0.1} ${y} l-${s * 0.06} -${s * 0.06} l-${s * 0.06} ${s * 0.06} l-${s * 0.06} -${s * 0.06} l-${s * 0.06} ${s * 0.06} l-${s * 0.06} -${s * 0.06} M${x + s * 0.1} ${y} l${s * 0.06} -${s * 0.06} l${s * 0.06} ${s * 0.06} l${s * 0.06} -${s * 0.06} l${s * 0.06} ${s * 0.06} l${s * 0.06} -${s * 0.06}" ${RD_N}/><circle cx="${x - s * 0.44}" cy="${y - s * 0.04}" r="${s * 0.06}" ${RD_S}/><circle cx="${x + s * 0.44}" cy="${y - s * 0.04}" r="${s * 0.06}" ${RD_S}/>`,
    (x, y, s) => `<rect x="${x - s * 0.44}" y="${y - s * 0.07}" width="${s * 0.32}" height="${s * 0.14}" rx="${s * 0.04}" ${RD_S}/><rect x="${x + s * 0.12}" y="${y - s * 0.07}" width="${s * 0.32}" height="${s * 0.14}" rx="${s * 0.04}" ${RD_S}/>`,
    ROLL_THEMES.monster.parts[3][1][0],
    (x, y, s) => `<path d="M${x - s * 0.1} ${y} H${x - s * 0.3}" ${RD_N}/><rect x="${x - s * 0.44}" y="${y - s * 0.1}" width="${s * 0.14}" height="${s * 0.2}" ${RD_S}/><path d="M${x + s * 0.1} ${y} H${x + s * 0.3}" ${RD_N}/><rect x="${x + s * 0.3}" y="${y - s * 0.1}" width="${s * 0.14}" height="${s * 0.2}" ${RD_S}/>`,
  ]],
  ['Legs', [
    (x, y, s) => `<circle cx="${x - s * 0.2}" cy="${y + s * 0.1}" r="${s * 0.16}" ${RD_S}/><circle cx="${x + s * 0.2}" cy="${y + s * 0.1}" r="${s * 0.16}" ${RD_S}/><circle cx="${x - s * 0.2}" cy="${y + s * 0.1}" r="${s * 0.04}" ${RD_F}/><circle cx="${x + s * 0.2}" cy="${y + s * 0.1}" r="${s * 0.04}" ${RD_F}/>`,
    (x, y, s) => `<rect x="${x - s * 0.4}" y="${y - s * 0.04}" width="${s * 0.8}" height="${s * 0.28}" rx="${s * 0.14}" ${RD_S}/>` + [-0.26, -0.09, 0.09, 0.26].map((a) => `<circle cx="${x + a * s}" cy="${y + s * 0.1}" r="${s * 0.06}" ${RD_S}/>`).join(''),
    ROLL_THEMES.monster.parts[4][1][3],
    (x, y, s) => `<rect x="${x - s * 0.22}" y="${y - s * 0.3}" width="${s * 0.12}" height="${s * 0.46}" ${RD_S}/><rect x="${x + s * 0.1}" y="${y - s * 0.3}" width="${s * 0.12}" height="${s * 0.46}" ${RD_S}/><rect x="${x - s * 0.3}" y="${y + s * 0.16}" width="${s * 0.24}" height="${s * 0.1}" ${RD_S}/><rect x="${x + s * 0.06}" y="${y + s * 0.16}" width="${s * 0.24}" height="${s * 0.1}" ${RD_S}/>`,
    (x, y, s) => `<path d="M${x - s * 0.22} ${y - s * 0.2} L${x - s * 0.1} ${y - s * 0.2} L${x - s * 0.08} ${y + s * 0.06} L${x - s * 0.24} ${y + s * 0.06} Z M${x + s * 0.1} ${y - s * 0.2} L${x + s * 0.22} ${y - s * 0.2} L${x + s * 0.24} ${y + s * 0.06} L${x + s * 0.08} ${y + s * 0.06} Z" ${RD_S}/><path d="M${x - s * 0.22} ${y + s * 0.08} Q${x - s * 0.16} ${y + s * 0.4} ${x - s * 0.1} ${y + s * 0.08} M${x + s * 0.1} ${y + s * 0.08} Q${x + s * 0.16} ${y + s * 0.4} ${x + s * 0.22} ${y + s * 0.08}" ${RD_N}/>`,
    (x, y, s) => `<path d="M${x} ${y - s * 0.3} V${y + s * 0.02}" ${RD_N}/><circle cx="${x}" cy="${y + s * 0.18}" r="${s * 0.16}" ${RD_S}/><circle cx="${x}" cy="${y + s * 0.18}" r="${s * 0.05}" ${RD_F}/>`,
  ]],
  ['Extra', [
    ROLL_THEMES.monster.parts[5][1][1],
    (x, y, s) => `<path d="M${x} ${y + s * 0.3} V${y - s * 0.1}" ${RD_N}/><path d="${starPath(x, y - s * 0.22, s * 0.14)}" ${RD_S}/>`,
    (x, y, s) => `<path d="M${x} ${y} C${x - s * 0.1} ${y - s * 0.2} ${x - s * 0.36} ${y - s * 0.1} ${x - s * 0.2} ${y + s * 0.14} L${x} ${y + s * 0.32} L${x + s * 0.2} ${y + s * 0.14} C${x + s * 0.36} ${y - s * 0.1} ${x + s * 0.1} ${y - s * 0.2} ${x} ${y} Z" ${RD_S}/>`,
    (x, y, s) => `<rect x="${x - s * 0.3}" y="${y - s * 0.24}" width="${s * 0.6}" height="${s * 0.48}" rx="${s * 0.04}" ${RD_S}/><path d="M${x - s * 0.22} ${y + s * 0.08} L${x - s * 0.1} ${y - s * 0.06} L${x} ${y + s * 0.1} L${x + s * 0.08} ${y - s * 0.02} L${x + s * 0.2} ${y + s * 0.08}" ${RD_N}/>`,
    (x, y, s) => `<circle cx="${x}" cy="${y}" r="${s * 0.24}" ${RD_S}/><circle cx="${x}" cy="${y}" r="${s * 0.08}" ${RD_S}/>` + [0, 1, 2, 3, 4, 5, 6, 7].map((k) => { const a = k * Math.PI / 4; return `<path d="M${x + Math.cos(a) * s * 0.24} ${y + Math.sin(a) * s * 0.24} L${x + Math.cos(a) * s * 0.34} ${y + Math.sin(a) * s * 0.34}" ${RD_N}/>`; }).join(''),
    ROLL_THEMES.monster.parts[5][1][5],
  ]],
] };

function dieFace(pg, x, y, s, n) {
  const pips = { 1: [[0.5, 0.5]], 2: [[0.28, 0.28], [0.72, 0.72]], 3: [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]], 4: [[0.28, 0.28], [0.72, 0.28], [0.28, 0.72], [0.72, 0.72]], 5: [[0.25, 0.25], [0.75, 0.25], [0.5, 0.5], [0.25, 0.75], [0.75, 0.75]], 6: [[0.28, 0.22], [0.72, 0.22], [0.28, 0.5], [0.72, 0.5], [0.28, 0.78], [0.72, 0.78]] };
  pg.add(`<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${s * 0.18}" fill="#fff" stroke="${INK}" stroke-width="0.6"/>`);
  pips[n].forEach(([a, b]) => pg.add(`<circle cx="${x + a * s}" cy="${y + b * s}" r="${s * 0.09}" fill="${INK}"/>`));
}

function makeRollDraw(o, paper) {
  const theme = ROLL_THEMES[o.theme] || ROLL_THEMES.monster;
  const name = nameOf(o.name, '');
  const pg = new Page(paper, name ? `${possessive(name)} ${theme.title.replace('Roll and draw a ', '')}` : theme.title, { subtitle: 'Roll the dice for each row and circle what you rolled. Then draw your creation in the big box!' });
  const labelW = 22, cw = (pg.width - labelW) / 6, head = 11;
  const rh = Math.min(19, (pg.room * 0.52 - head) / theme.parts.length);
  for (let n = 1; n <= 6; n++) dieFace(pg, pg.left + labelW + cw * (n - 1) + cw / 2 - 4, pg.y, 8, n);
  theme.parts.forEach(([label, draws], r) => {
    const y = pg.y + head + r * rh;
    pg.add(panel(pg.left, y, pg.width, rh - 1.5, TINTS[r % TINTS.length], '#e2ddf2', 4));
    pg.add(txt(pg.left + labelW / 2, y + rh / 2 + 1, label, 4.6, { colour: PALETTE[r % PALETTE.length] }));
    draws.forEach((d, i) => {
      const cx = pg.left + labelW + cw * (i + 0.5);
      pg.add(`<rect x="${cx - cw / 2 + 1}" y="${y + 1}" width="${cw - 2}" height="${rh - 3.5}" rx="3" fill="#fff"/>`);
      pg.add(d(cx, y + (rh - 1.5) / 2, rh - 5));
    });
  });
  pg.y += head + theme.parts.length * rh + 4;
  const boxH = pg.room - 10;
  pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="${boxH}" rx="8" fill="#fff" stroke="${INK}" stroke-width="0.6" stroke-dasharray="3 2"/>`);
  pg.add(txt(pg.left + 5, pg.y + 7, '✏️ Draw it here', 4.4, { anchor: 'start', colour: SOFT, font: FONT }));
  const ly = pg.y + boxH + 7;
  pg.add(txt(pg.left, ly, `My ${o.theme === 'robot' ? 'robot' : 'monster'} is called`, 4.4, { anchor: 'start', font: FONT }) + `<line x1="${pg.left + 46}" x2="${pg.right}" y1="${ly}" y2="${ly}" stroke="#b9b3d6" stroke-width="0.4"/>`);
  return [pg.svg()];
}

// ================================================================ patterns
const PATTERN_RULES = { easy: ['AB'], medium: ['AAB', 'ABB', 'AABB', 'AB'], hard: ['ABC', 'AABC', 'ABCC', 'ABBC'] };
const PATTERN_PICS = ['apple', 'banana', 'strawberry', 'orange', 'star', 'heart', 'sun', 'cat', 'dog', 'fish', 'daisy', 'tulip', 'balloon', 'present', 'cupcake', 'chick', 'ladybird', 'turtle'];
const PATTERN_SHAPES = [['circle', '#ff6b6b'], ['square', '#6c8cff'], ['triangle', '#ffb938'], ['star', '#b06cff'], ['heart', '#ff7eb6'], ['diamond', '#3fbfa8']];

function makePatterns(o, paper) {
  const rand = rng(+o.seed || 1);
  const level = o.level || 'medium', kind = o.kind || 'pictures';
  const rowsN = 7, show = level === 'hard' ? 7 : 6, blanks = 3;
  const rows = [];
  for (let r = 0; r < rowsN; r++) {
    const rule = PATTERN_RULES[level][(r + Math.floor(rand() * 4)) % PATTERN_RULES[level].length];
    const letters = [...new Set(rule)];
    const pool = kind === 'shapes' ? PATTERN_SHAPES.map((_, i) => i) : PATTERN_PICS;
    const chosen = shuffle(pool, rand).slice(0, letters.length);
    const map = Object.fromEntries(letters.map((l, i) => [l, chosen[i]]));
    const seq = [];
    for (let i = 0; i < show + blanks; i++) seq.push(map[rule[i % rule.length]]);
    // Hard level sometimes hides a gap in the middle as well as at the end.
    const gaps = new Set([show, show + 1, show + 2]);
    if (level === 'hard' && r % 2 === 1) { gaps.delete(show + 2); gaps.add(2 + Math.floor(rand() * 3)); }
    rows.push({ seq, gaps });
  }
  const draw = (pg, item, cx, cy, s, colour) => {
    if (kind === 'shapes') {
      const [shape, hex] = PATTERN_SHAPES[item];
      return shape2d(shape, cx, cy, s * 0.34, `fill="${colour ? hex : '#fff'}" stroke="${INK}" stroke-width="0.8" stroke-linejoin="round"`);
    }
    return pic(ART(item), cx, cy, s * 0.86);
  };
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const sub = kind === 'shapes' ? 'What comes next? Draw and colour the missing shapes.' : 'What comes next? Draw the missing pictures in the empty boxes.';
    const pg = new Page(paper, answers ? 'What comes next: answers' : 'What comes next?', { subtitle: answers ? 'Answer key for grown-ups.' : sub, noName: answers });
    const total = show + blanks, rh = (pg.room - 2) / rowsN, cell = Math.min((pg.width - 12) / total, rh - 6);
    rows.forEach(({ seq, gaps }, r) => {
      const y = pg.y + r * rh, cy = y + rh / 2;
      pg.add(panel(pg.left, y + 1.5, pg.width, rh - 3, TINTS[r % TINTS.length], '#e2ddf2', 6));
      pg.add(`<circle cx="${pg.left + 5.5}" cy="${cy}" r="3.6" fill="${PALETTE[r % PALETTE.length]}"/>` + txt(pg.left + 5.5, cy + 1.5, r + 1, 4.2, { colour: '#fff' }));
      const x0 = pg.left + 11 + (pg.width - 12 - cell * total) / 2;
      seq.forEach((item, i) => {
        const cx = x0 + cell * (i + 0.5);
        if (gaps.has(i)) {
          pg.add(`<rect x="${cx - cell / 2 + 1}" y="${cy - cell / 2 + 1}" width="${cell - 2}" height="${cell - 2}" rx="3" fill="#fff" stroke="#9a93b8" stroke-width="0.5" stroke-dasharray="1.6 1.2"/>`);
          if (answers) pg.add(`<g opacity="0.9">${draw(pg, item, cx, cy, cell - 2, true)}</g>`);
        } else pg.add(draw(pg, item, cx, cy, cell - 2, true));
      });
    });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ syllables
const SYLLABLES = [['ant', 'ant'], ['bear', 'bear'], ['cake', 'cake'], ['cat', 'cat'], ['chick', 'chick'], ['dog', 'dog'], ['egg', 'egg'], ['fish', 'fish'],
  ['hat', 'hat'], ['heart', 'heart'], ['nest', 'nest'], ['pig', 'pig'], ['rose', 'rose'], ['star', 'star'], ['sun', 'sun'],
  ['apple', 'ap-ple'], ['balloon', 'bal-loon'], ['cookie', 'cook-ie'], ['cupcake', 'cup-cake'], ['daisy', 'dai-sy'], ['donut', 'do-nut'],
  ['lion', 'li-on'], ['lolly', 'lol-ly'], ['medal', 'med-al'], ['monkey', 'mon-key'], ['mushroom', 'mush-room'], ['orange', 'or-ange'],
  ['present', 'pres-ent'], ['rainbow', 'rain-bow'], ['tulip', 'tu-lip'], ['turtle', 'tur-tle'], ['zebra', 'ze-bra'],
  ['banana', 'ba-na-na'], ['blueberry', 'blue-ber-ry'], ['envelope', 'en-ve-lope'], ['gorilla', 'go-ril-la'], ['ladybird', 'la-dy-bird'],
  ['octopus', 'oc-to-pus'], ['strawberry', 'straw-ber-ry'], ['sunflower', 'sun-flow-er']];

function drum(x, y, s) {
  return `<ellipse cx="${x}" cy="${y - s * 0.3}" rx="${s * 0.5}" ry="${s * 0.16}" fill="#fff" stroke="${INK}" stroke-width="0.5"/>`
    + `<path d="M${x - s * 0.5} ${y - s * 0.3} V${y + s * 0.28} A${s * 0.5} ${s * 0.16} 0 0 0 ${x + s * 0.5} ${y + s * 0.28} V${y - s * 0.3}" fill="#fff" stroke="${INK}" stroke-width="0.5"/>`
    + `<path d="M${x - s * 0.5} ${y - s * 0.12} L${x - s * 0.25} ${y + s * 0.3} L${x} ${y - s * 0.12} L${x + s * 0.25} ${y + s * 0.3} L${x + s * 0.5} ${y - s * 0.12}" fill="none" stroke="#e0457b" stroke-width="0.45"/>`
    + `<path d="M${x - s * 0.1} ${y - s * 0.55} L${x + s * 0.5} ${y - s * 0.95} M${x + s * 0.1} ${y - s * 0.55} L${x - s * 0.5} ${y - s * 0.95}" stroke="#8d5524" stroke-width="0.6" stroke-linecap="round"/>`;
}

function makeSyllables(o, paper) {
  const rand = rng(+o.seed || 1);
  const kind = o.kind || 'count';
  const pages = [];
  if (kind === 'sort') {
    const by = [1, 2, 3].map((n) => shuffle(SYLLABLES.filter(([, s]) => s.split('-').length === n), rand).slice(0, 3));
    const words = shuffle(by.flat(), rand);
    const pg = new Page(paper, 'Clap and sort', { subtitle: 'Say each word and clap the beats. Cut out the pictures and stick them in the right column.' });
    const colW = pg.width / 3, colH = pg.room * 0.56;
    [1, 2, 3].forEach((n, i) => {
      const x = pg.left + colW * i;
      pg.add(panel(x + 2, pg.y, colW - 4, colH, TINTS[i * 2], PALETTE[i * 2], 6));
      for (let d = 0; d < n; d++) pg.add(drum(x + colW / 2 + (d - (n - 1) / 2) * 11, pg.y + 9, 8));
      pg.add(txt(x + colW / 2, pg.y + 22, `${n} clap${n > 1 ? 's' : ''}`, 6, { colour: PALETTE[i * 2] }));
    });
    const ty = pg.y + colH + 12;
    scissors(pg, ty - 5);
    const tile = Math.min(34, (pg.width - 10) / 5.2), gap = (pg.width - tile * 5) / 4;
    words.forEach(([w], i) => {
      const x = pg.left + (i % 5) * (tile + gap), y = ty + Math.floor(i / 5) * (tile + 8);
      cutTile(pg, x, y, tile, pic(ART(w), x + tile / 2, y + tile / 2 - 2.5, tile * 0.7) + txt(x + tile / 2, y + tile - 2.5, w, fitFont(w, 4.4, tile - 4)), i);
    });
    pages.push(pg.svg());
    return pages;
  }
  const count = 8;
  const list = shuffle(SYLLABLES, rand).slice(0, count);
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const split = kind === 'split';
    const pg = new Page(paper, answers ? 'Clap the syllables: answers' : split ? 'Break the word into beats' : 'Clap the syllables', { subtitle: answers ? 'Answer key for grown-ups.' : split ? 'Say the word slowly and clap. Write each beat in its own box.' : 'Say the word and clap the beats. Colour one drum for every clap.', noName: answers });
    const cols = 2, rows = count / cols, cw = pg.width / cols, ch = (pg.room - 2) / rows;
    list.forEach(([w, s], i) => {
      const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch, parts = s.split('-');
      pg.add(panel(x + 2, y + 2, cw - 4, ch - 4, '#fff', '#e2ddf2', 6));
      const size = Math.min(ch - 12, cw * (split ? 0.3 : 0.4));
      pg.add(`<rect x="${x + 6}" y="${y + 6}" width="${size}" height="${size}" rx="5" fill="${TINTS[i % TINTS.length]}"/>`);
      pg.add(pic(ART(w), x + 6 + size / 2, y + 6 + size / 2, size * 0.86));
      const tx = x + size + 12, room = cw - size - 18;
      pg.add(txt(tx + room / 2, y + 14, w, fitFont(w, 8, room), {}));
      if (split) {
        const bw = Math.min((room - 4) / 3, 26);
        for (let b = 0; b < 3; b++) {
          const bx = tx + room / 2 + (b - 1) * (bw + 2) - bw / 2, by = y + ch / 2 + 2;
          pg.add(`<rect x="${bx}" y="${by}" width="${bw}" height="12" rx="2.5" fill="#fff" stroke="#9a93b8" stroke-width="0.5"/>`);
          if (answers && parts[b]) pg.add(txt(bx + bw / 2, by + 8.4, parts[b], fitFont(parts[b], 6, bw - 2), { colour: '#e0457b' }));
        }
      } else {
        for (let d = 0; d < 3; d++) {
          const dx = tx + room / 2 + (d - 1) * Math.min(14, room / 3), dy = y + ch / 2 + 6;
          pg.add(drum(dx, dy, 10));
          if (answers && d < parts.length) pg.add(`<circle cx="${dx}" cy="${dy}" r="7.4" fill="none" stroke="#e0457b" stroke-width="1"/>`);
        }
        if (answers) pg.add(txt(tx + room / 2, y + ch - 7, parts.join(' • '), 4.4, { colour: '#e0457b', font: FONT }));
      }
    });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ door hangers
const HANGER_SETS = {
  sleep: { sides: ['Shh! Sleeping', 'Good morning! Come in'], line: ['owl', 'teddy'], bright: ['star', 'sun'] },
  reading: { sides: ['Do not disturb. I am reading!', 'Come in! Let\'s read together'], line: ['cat', 'bunny'], bright: ['monkey', 'lion'] },
  play: { sides: ['Genius at work', 'Knock knock! Come in'], line: ['robot', 'rocket'], bright: ['popper', 'rainbow'] },
  tidy: { sides: ['Tidying up! Nearly done', 'All tidy! Come and see'], line: ['penguin', 'unicorn'], bright: ['chick', 'present'] },
};

function makeDoorHangers(o, paper) {
  const set = HANGER_SETS[o.set] || HANGER_SETS.sleep;
  const bright = o.style === 'bright';
  const name = nameOf(o.name, '');
  const custom = listOf(o.custom, 2);
  const sides = o.set === 'custom' && custom.length ? [custom[0], custom[1] || custom[0]] : set.sides;
  const pg = new Page(paper, '', { bare: true });
  const w = (pg.width - 8) / 2, h = pg.bottom - pg.m - 8, R = w * 0.2;
  pg.add(txt(pg.w / 2, pg.m + 4, 'Cut out both sides and glue them back to back. Colour, then hang it on your door!', 3.8, { font: FONT, colour: SOFT }));
  for (let k = 0; k < 2; k++) {
    const x = pg.left + k * (w + 8), y = pg.m + 9, c = k ? 2 : 4;
    const hx = x + w / 2, hy = y + R + 8;
    const shape = `M${x + 6} ${y} H${x + w - 6} Q${x + w} ${y} ${x + w} ${y + 6} V${y + h - 8} Q${x + w} ${y + h} ${x + w - 8} ${y + h} H${x + 8} Q${x} ${y + h} ${x} ${y + h - 8} V${y + 6} Q${x} ${y} ${x + 6} ${y} Z`;
    pg.add(`<path d="${shape}" fill="${bright ? TINTS[c] : '#fff'}" stroke="${bright ? PALETTE[c] : INK}" stroke-width="1"/>`);
    // The hole for the door handle, with a slit to slide it on.
    pg.add(`<circle cx="${hx}" cy="${hy}" r="${R}" fill="#fff" stroke="${INK}" stroke-width="0.8" stroke-dasharray="2 1.4"/><path d="M${hx} ${hy - R} V${y}" stroke="${INK}" stroke-width="0.8" stroke-dasharray="2 1.4"/>`);
    let ty = hy + R + 12;
    if (name) {
      const label = `${possessive(name)} room`;
      const fs = Math.min(11, (w - 10) / (label.length * 0.56));
      pg.add(`<text x="${hx}" y="${ty}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${fs.toFixed(2)}" fill="${bright ? PALETTE[c] : '#fff'}" stroke="${bright ? '#fff' : INK}" stroke-width="${(fs * (bright ? 0.12 : 0.07)).toFixed(2)}" paint-order="stroke">${esc(label)}</text>`);
      ty += 6;
    }
    const size = Math.min(w - 10, h * 0.42);
    if (bright) pg.add(pic(ART(set.bright[k]), hx, ty + size / 2, size));
    else pg.add(`<g transform="translate(${hx - size / 2} ${ty}) scale(${(size / 200).toFixed(4)})">${colouringArt(set.line[k])}</g>`);
    const words = wrap(sides[k], 12);
    const fs = Math.min(13, (w - 10) / (Math.max(...words.map((l) => l.length)) * 0.58));
    const lh = fs * 1.12, top = ty + size + 4, room = y + h - 14 - top;
    const by = top + (room - lh * words.length) / 2 + fs * 0.9;
    words.forEach((l, i) => pg.add(`<text x="${hx}" y="${by + i * lh}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${fs.toFixed(2)}" fill="${bright ? PALETTE[c] : '#fff'}" stroke="${INK}" stroke-width="${bright ? 0 : (fs * 0.05).toFixed(2)}" paint-order="stroke">${esc(l)}</text>`));
    for (let s = 0; s < 3; s++) pg.add(`<path d="${starPath(x + 10 + s * (w - 20) / 2, y + h - 8, 3, 0.45)}" fill="${bright ? PALETTE[(c + s) % PALETTE.length] : '#fff'}" stroke="${INK}" stroke-width="0.5" stroke-linejoin="round"/>`);
  }
  pg.footer = () => {};
  return [pg.svg()];
}

// ================================================================ 30 day challenges
const CHALLENGES = {
  kindness: { title: '30 days of kindness', items: ['Give someone a big smile', 'Say thank you to a helper', 'Draw a picture for a friend', 'Help set the table', 'Share a toy', 'Give a hug to someone you love',
    'Tell someone why they are great', 'Tidy up without being asked', 'Make a card for a grandparent', 'Help a friend who is sad', 'Say good morning to a neighbour', 'Feed the birds',
    'Hold the door open', 'Let someone else go first', 'Help make dinner', 'Pick up litter (with a grown-up)', 'Read a story to a toy or a sibling', 'Water a plant',
    'Say sorry and mean it', 'Play with someone new', 'Leave a kind note', 'Help carry the shopping', 'Give 3 compliments today', 'Call someone you miss',
    'Make someone laugh', 'Share your snack', 'Thank your teacher', 'Help fold the washing', 'Be kind to yourself today', 'Plan a surprise for your family'] },
  reading: { title: '30 day reading challenge', items: ['Read in a blanket fort', 'Read to a teddy', 'Read a book about animals', 'Read with a torch', 'Read a funny book', 'Read outside',
    'Read a book with no words', 'Read in a silly voice', 'Read a book about space', 'Read to a grown-up', 'Read a poem', 'Read a recipe and cook it',
    'Read a book from the library', 'Read in the bath (carefully!)', 'Read a book twice', 'Draw your favourite page', 'Read a book about a friend', 'Read a fairy tale',
    'Read a book about the sea', 'Act out a story', 'Read a book about dinosaurs', 'Read under the table', 'Read a comic', 'Read a book about a big feeling',
    'Swap books with a friend', 'Read a book about a job', 'Read in the car', 'Read a book at bedtime', 'Make up your own story', 'Read your favourite book again'] },
  outdoors: { title: '30 days outdoors', items: ['Find 5 different leaves', 'Jump in a puddle', 'Watch the clouds', 'Find a snail or a worm', 'Collect 10 stones', 'Listen for birds',
    'Draw a picture with chalk', 'Look for a rainbow', 'Plant a seed', 'Go on a colour hunt', 'Hug a tree', 'Have a picnic',
    'Make a leaf crown', 'Race a friend', 'Look at the moon', 'Find something round', 'Make a mud pie', 'Count 20 flowers',
    'Blow bubbles', 'Build a stick tower', 'Find a feather', 'Walk like 5 animals', 'Feel the wind', 'Spot a bee or a butterfly',
    'Play hide and seek', 'Make a nature picture', 'Find your shadow', 'Splash some water', 'Look for a nest', 'Watch the sunset'] },
  helper: { title: '30 days of being a helper', items: ['Make my bed', 'Put my clothes away', 'Feed a pet', 'Water the plants', 'Put my shoes away', 'Help unpack the shopping',
    'Wipe the table', 'Sort the socks', 'Tidy my toys', 'Help wash the car', 'Put my plate away', 'Help make a sandwich',
    'Sweep the floor', 'Carry the bags', 'Fold the towels', 'Clean my teeth well', 'Pack my school bag', 'Help with the recycling',
    'Wash some fruit', 'Dust a shelf', 'Tidy the books', 'Help make a cake', 'Line up the shoes', 'Match the lids and boxes',
    'Help plant something', 'Put the washing in', 'Set the table', 'Help a sibling', 'Get ready by myself', 'Tidy the whole room!'] },
};

function makeChallenge(o, paper) {
  const rand = rng(+o.seed || 1);
  const ch = CHALLENGES[o.theme] || CHALLENGES.kindness;
  const days = +o.days === 14 ? 14 : 30;
  const name = nameOf(o.name, '');
  const items = (o.order === 'shuffle' ? shuffle(ch.items, rand) : ch.items).slice(0, days);
  const title = name ? `${possessive(name)} ${ch.title}` : ch.title[0].toUpperCase() + ch.title.slice(1);
  const pg = new Page(paper, title, { subtitle: 'Do one each day, then colour the star. You can do them in any order!', noName: !!name });
  const cols = days === 14 ? 4 : 5, rows = Math.ceil(days / cols);
  const cw = pg.width / cols, chh = (pg.room - 16) / rows;
  items.forEach((t, i) => {
    const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * chh, c = i % PALETTE.length;
    pg.add(panel(x + 1.2, y + 1.2, cw - 2.4, chh - 2.4, TINTS[c], PALETTE[c], 4));
    pg.add(`<circle cx="${x + 6.5}" cy="${y + 6.5}" r="3.8" fill="${PALETTE[c]}"/>` + txt(x + 6.5, y + 8, i + 1, 3.8, { colour: '#fff' }));
    const fs = days === 14 ? 4.6 : 3.7;
    const lines = wrap(t, Math.floor((cw - 6) / (fs * 0.52)));
    const ty = y + 13 + fs;
    textLines(pg, lines, x + cw / 2, ty, fs, { anchor: 'middle', weight: 800 });
    const sr = Math.min(5.5, (y + chh - 3 - (ty + lines.length * fs * 1.32)) / 2.2);
    if (sr > 2) pg.add(`<path d="${starPath(x + cw / 2, y + chh - 3.5 - sr, sr * 1.1, 0.46)}" fill="#fff" stroke="${PALETTE[c]}" stroke-width="0.7" stroke-linejoin="round"/>`);
  });
  const by = pg.bottom - 6;
  pg.add(pic(ART('medal'), pg.left + 6, by - 1, 11));
  pg.add(txt(pg.left + 14, by + 1, `I finished on`, 4.4, { anchor: 'start', font: FONT }) + `<line x1="${pg.left + 40}" x2="${pg.left + 100}" y1="${by + 1}" y2="${by + 1}" stroke="#b9b3d6" stroke-width="0.4"/>`);
  pg.add(txt(pg.right, by + 1, 'Well done, superstar!', 5, { anchor: 'end', colour: '#e0457b' }));
  return [pg.svg()];
}

// ================================================================ doubles and halves
function ladybird(cx, cy, r, spots, rand) {
  let s = `<path d="M${cx - r * 0.12} ${cy - r * 0.98} Q${cx - r * 0.3} ${cy - r * 1.35} ${cx - r * 0.42} ${cy - r * 1.3} M${cx + r * 0.12} ${cy - r * 0.98} Q${cx + r * 0.3} ${cy - r * 1.35} ${cx + r * 0.42} ${cy - r * 1.3}" fill="none" stroke="${INK}" stroke-width="0.6" stroke-linecap="round"/>`;
  s += `<path d="M${cx - r * 0.42} ${cy - r * 0.78} A${r * 0.44} ${r * 0.36} 0 0 1 ${cx + r * 0.42} ${cy - r * 0.78} Z" fill="${INK}"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#ff6b6b" stroke="${INK}" stroke-width="0.8"/><line x1="${cx}" x2="${cx}" y1="${cy - r}" y2="${cy + r}" stroke="${INK}" stroke-width="0.8"/>`;
  const spotsAt = [[-0.5, -0.45], [-0.3, -0.05], [-0.6, 0.2], [-0.35, 0.5], [-0.7, -0.15], [-0.18, 0.72], [-0.16, -0.62], [-0.55, 0.62], [-0.15, 0.3], [-0.75, 0.35]];
  for (let i = 0; i < spots; i++) { const [a, b] = spotsAt[i]; s += `<circle cx="${cx + a * r}" cy="${cy + b * r}" r="${r * 0.12}" fill="${INK}"/>`; }
  return s;
}

function makeDoubles(o, paper) {
  const rand = rng(+o.seed || 1);
  const kind = o.kind || 'ladybird', max = +o.max || 5;
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const r2 = rng(+o.seed || 1);
    const nums = shuffle([...Array(max).keys()].map((k) => k + 1), r2);
    const pick = (i) => nums[i % nums.length];
    if (kind === 'ladybird') {
      const pg = new Page(paper, answers ? 'Ladybird doubles: answers' : 'Ladybird doubles', { subtitle: answers ? 'Answer key for grown-ups.' : 'Draw the same number of spots on the other wing. How many spots now?', noName: answers });
      const cw = pg.width / 2, ch = (pg.room - 2) / 3;
      for (let i = 0; i < 6; i++) {
        const n = Math.min(pick(i), 10), x = pg.left + (i % 2) * cw, y = pg.y + Math.floor(i / 2) * ch;
        pg.add(panel(x + 2, y + 2, cw - 4, ch - 4, TINTS[i % TINTS.length], '#e2ddf2', 6));
        const r = Math.min(cw * 0.26, ch * 0.3);
        pg.add(ladybird(x + cw / 2, y + 12 + r * 1.2, r, n, r2));
        if (answers) pg.add(`<g transform="translate(${2 * (x + cw / 2)} 0) scale(-1 1)" opacity="0.55">${Array.from({ length: n }, (_, k) => { const at = [[-0.5, -0.45], [-0.3, -0.05], [-0.6, 0.2], [-0.35, 0.5], [-0.7, -0.15], [-0.18, 0.72], [-0.16, -0.62], [-0.55, 0.62], [-0.15, 0.3], [-0.75, 0.35]][k]; return `<circle cx="${x + cw / 2 + at[0] * r}" cy="${y + 12 + r * 1.2 + at[1] * r}" r="${r * 0.12}" fill="${INK}"/>`; }).join('')}</g>`);
        const sy = y + ch - 9;
        const sum = `${n} + ${n} = `;
        pg.add(txt(x + cw / 2 - 4, sy, sum, 8, { anchor: 'end' }));
        pg.add(`<rect x="${x + cw / 2 - 2}" y="${sy - 7}" width="16" height="9.5" rx="2.5" fill="#fff" stroke="#9a93b8" stroke-width="0.5"/>`);
        if (answers) pg.add(txt(x + cw / 2 + 6, sy, n * 2, 7, { colour: '#e0457b' }));
      }
      pages.push(pg.svg());
      continue;
    }
    if (kind === 'halves') {
      const pg = new Page(paper, answers ? 'Share it fairly: answers' : 'Share it fairly', { subtitle: answers ? 'Answer key for grown-ups.' : 'Share the treats between the two friends so they get the same. Draw them on the plates.', noName: answers });
      const treats = shuffle(['cookie', 'strawberry', 'cupcake', 'donut', 'apple', 'blueberry', 'orange', 'lolly'], r2);
      const ch = (pg.room - 2) / 4;
      for (let i = 0; i < 4; i++) {
        const half = Math.min(pick(i), 6), n = half * 2, y = pg.y + i * ch, t = treats[i];
        pg.add(panel(pg.left, y + 2, pg.width, ch - 4, TINTS[i % TINTS.length], '#e2ddf2', 6));
        const s = Math.min(11, (pg.width * 0.46) / n);
        for (let k = 0; k < n; k++) pg.add(pic(ART(t), pg.left + 8 + s * (k + 0.5), y + 10 + s / 2, s * 0.95));
        pg.add(txt(pg.left + 8, y + ch - 9, `Share ${n}. Each friend gets`, 5, { anchor: 'start', font: FONT }));
        pg.add(`<rect x="${pg.left + 76}" y="${y + ch - 16}" width="14" height="9.5" rx="2.5" fill="#fff" stroke="#9a93b8" stroke-width="0.5"/>`);
        if (answers) pg.add(txt(pg.left + 83, y + ch - 9, half, 7, { colour: '#e0457b' }));
        ['lion', 'monkey'].forEach((a, j) => {
          const px = pg.left + pg.width * (0.66 + j * 0.2), py = y + ch / 2 + 2, pr = Math.min(pg.width * 0.085, ch * 0.3);
          pg.add(pic(ART(i % 2 ? ['pig', 'zebra'][j] : a), px, y + 9, 12));
          pg.add(`<ellipse cx="${px}" cy="${py + 4}" rx="${pr}" ry="${pr * 0.72}" fill="#fff" stroke="${INK}" stroke-width="0.6"/><ellipse cx="${px}" cy="${py + 4}" rx="${pr * 0.72}" ry="${pr * 0.5}" fill="none" stroke="#e2ddf2" stroke-width="0.5"/>`);
          if (answers) for (let k = 0; k < half; k++) pg.add(pic(ART(t), px + ((k % 3) - 1) * pr * 0.44, py + 4 + (Math.floor(k / 3) - 0.5) * pr * 0.44, pr * 0.42));
        });
      }
      pages.push(pg.svg());
      continue;
    }
    // Double and half number facts
    const pg = new Page(paper, answers ? 'Doubles and halves: answers' : 'Doubles and halves', { subtitle: answers ? 'Answer key for grown-ups.' : 'Double means two lots of the same. Half means share into two equal parts.', noName: answers });
    const cw = pg.width / 2, rows = Math.min(10, max), rh = (pg.room - 16) / Math.max(rows, 7);
    pg.add(panel(pg.left + 1, pg.y, cw - 2, 12, '#ffe8ef', '#ff7eb6', 5) + txt(pg.left + cw / 2, pg.y + 8.2, 'Double it!', 6.4, { colour: '#e0457b' }));
    pg.add(panel(pg.left + cw + 1, pg.y, cw - 2, 12, '#e6f1ff', '#6c8cff', 5) + txt(pg.left + cw * 1.5, pg.y + 8.2, 'Halve it!', 6.4, { colour: '#3a64d8' }));
    const top = max;
    const dbl = shuffle([...Array(top).keys()].map((k) => k + 1), r2).slice(0, rows);
    const hlf = shuffle([...Array(top).keys()].map((k) => (k + 1) * 2), r2).slice(0, rows);
    for (let i = 0; i < rows; i++) {
      const y = pg.y + 18 + i * rh + rh * 0.6;
      pg.add(txt(pg.left + cw / 2 - 2, y, `Double ${dbl[i]} =`, 6, { anchor: 'end', font: FONT }));
      pg.add(`<rect x="${pg.left + cw / 2 + 1}" y="${y - 6.5}" width="16" height="9" rx="2.5" fill="#fff" stroke="#9a93b8" stroke-width="0.5"/>`);
      if (answers) pg.add(txt(pg.left + cw / 2 + 9, y, dbl[i] * 2, 6, { colour: '#e0457b' }));
      pg.add(txt(pg.left + cw * 1.5 - 2, y, `Half of ${hlf[i]} =`, 6, { anchor: 'end', font: FONT }));
      pg.add(`<rect x="${pg.left + cw * 1.5 + 1}" y="${y - 6.5}" width="16" height="9" rx="2.5" fill="#fff" stroke="#9a93b8" stroke-width="0.5"/>`);
      if (answers) pg.add(txt(pg.left + cw * 1.5 + 9, y, hlf[i] / 2, 6, { colour: '#e0457b' }));
    }
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ position words
const POSITIONS = ['in', 'on', 'under', 'next to', 'behind', 'in front of', 'above', 'between'];
const POS_PETS = ['cat', 'dog', 'monkey', 'chick', 'pig', 'bear', 'turtle', 'lion'];

function crate(x, y, w, h, open) {
  const d = w * 0.22;
  let s = `<path d="M${x} ${y} L${x + d} ${y - d * 0.7} H${x + w + d} L${x + w} ${y} Z" fill="${open ? '#8d5524' : '#f4c27a'}" stroke="${INK}" stroke-width="0.6" stroke-linejoin="round"/>`;
  s += `<path d="M${x + w} ${y} L${x + w + d} ${y - d * 0.7} V${y + h - d * 0.7} L${x + w} ${y + h} Z" fill="#d99a4e" stroke="${INK}" stroke-width="0.6" stroke-linejoin="round"/>`;
  return s;
}
const boxFront = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#f0b565" stroke="${INK}" stroke-width="0.6"/><path d="M${x + w * 0.1} ${y + h * 0.3} H${x + w * 0.9}" stroke="#c88a3e" stroke-width="0.6"/>`;

function scene(pos, pet, cx, cy, s) {
  // s is the scene size; the box sits in the middle.
  const bw = s * 0.4, bh = s * 0.3, bx = cx - bw / 2 - s * 0.04, by = cy + s * 0.08, a = s * 0.36;
  const P2 = (x, y, size = a) => pic(ART(pet), x, y, size);
  const ground = `<line x1="${cx - s * 0.46}" x2="${cx + s * 0.46}" y1="${by + bh}" y2="${by + bh}" stroke="#b9b3d6" stroke-width="0.6"/>`;
  const whole = () => crate(bx, by, bw, bh, false) + boxFront(bx, by, bw, bh);
  switch (pos) {
    case 'in': return ground + crate(bx, by, bw, bh, true) + P2(bx + bw * 0.55, by - a * 0.12) + boxFront(bx, by, bw, bh);
    case 'on': return ground + whole() + P2(bx + bw * 0.55, by - a * 0.62);
    case 'under': {
      const tw = s * 0.6, ty = cy - s * 0.12, tx = cx - tw / 2, leg = by + bh - ty;
      return ground + `<rect x="${tx}" y="${ty - 3}" width="${tw}" height="4" rx="1" fill="#c88a3e" stroke="${INK}" stroke-width="0.6"/><rect x="${tx + 3}" y="${ty + 1}" width="3" height="${leg - 1}" fill="#c88a3e" stroke="${INK}" stroke-width="0.5"/><rect x="${tx + tw - 6}" y="${ty + 1}" width="3" height="${leg - 1}" fill="#c88a3e" stroke="${INK}" stroke-width="0.5"/>` + P2(cx, by + bh - a * 0.46);
    }
    case 'next to': return ground + whole() + P2(bx + bw + bw * 0.22 + a * 0.62, by + bh - a * 0.46);
    case 'behind': return ground + P2(bx + bw * 0.9, by - a * 0.14, a * 0.95) + whole();
    case 'in front of': return ground + crate(bx - s * 0.02, by - s * 0.08, bw, bh, false) + boxFront(bx - s * 0.02, by - s * 0.08, bw, bh) + P2(bx + bw * 0.45, by + bh - a * 0.4, a * 1.05);
    case 'above': return ground + whole() + P2(bx + bw * 0.55, by - s * 0.34) + `<path d="M${bx + bw * 0.55 - 5} ${by - s * 0.34 + a * 0.5 + 2} q2 2 4 0 t4 0" fill="none" stroke="${SOFT}" stroke-width="0.4"/>`;
    case 'between': {
      const w2 = bw * 0.62, h2 = bh * 0.8, y2 = by + bh - h2;
      return ground + crate(cx - s * 0.42, y2, w2, h2, false) + boxFront(cx - s * 0.42, y2, w2, h2) + crate(cx + s * 0.42 - w2 - w2 * 0.22, y2, w2, h2, false) + boxFront(cx + s * 0.42 - w2 - w2 * 0.22, y2, w2, h2) + P2(cx - s * 0.02, by + bh - a * 0.46);
    }
    default: return '';
  }
}

function makePosition(o, paper) {
  const rand = rng(+o.seed || 1);
  const kind = o.kind || 'circle';
  const pages = [];
  const list = shuffle(POSITIONS, rand).slice(0, 6).map((p, i) => [p, POS_PETS[(i + Math.floor(rand() * 8)) % POS_PETS.length]]);
  if (kind === 'draw') {
    const pg = new Page(paper, 'Where is it? Draw it!', { subtitle: 'Read each sentence with a grown-up and draw the picture.' });
    const cw = pg.width / 2, ch = (pg.room - 2) / 3;
    const things = ['a ball', 'a star', 'a flower', 'a cake', 'a sun', 'a fish'];
    list.forEach(([p], i) => {
      const x = pg.left + (i % 2) * cw, y = pg.y + Math.floor(i / 2) * ch;
      const thing = things[i], table = p === 'under';
      pg.add(panel(x + 2, y + 2, cw - 4, ch - 4, '#fff', '#e2ddf2', 6));
      const sentence = `Draw ${thing} ${p} the ${p === 'between' ? 'boxes' : table ? 'table' : 'box'}.`;
      pg.add(txt(x + cw / 2, y + 10, sentence, fitFont(sentence, 5, cw - 10, 0.5), { font: FONT }));
      const s = Math.min(cw - 10, ch - 18), cx = x + cw / 2, cy = y + 14 + s / 2;
      const bw = s * 0.36, bh = s * 0.28, bx = cx - bw / 2 - s * 0.03, by = cy + s * 0.08;
      if (table) {
        const tw = s * 0.6, ty = cy - s * 0.12, tx = cx - tw / 2, leg = by + bh - ty;
        pg.add(`<line x1="${cx - s * 0.46}" x2="${cx + s * 0.46}" y1="${by + bh}" y2="${by + bh}" stroke="#b9b3d6" stroke-width="0.6"/><rect x="${tx}" y="${ty - 3}" width="${tw}" height="4" rx="1" fill="#fff" stroke="${INK}" stroke-width="0.6"/><rect x="${tx + 3}" y="${ty + 1}" width="3" height="${leg - 1}" fill="#fff" stroke="${INK}" stroke-width="0.5"/><rect x="${tx + tw - 6}" y="${ty + 1}" width="3" height="${leg - 1}" fill="#fff" stroke="${INK}" stroke-width="0.5"/>`);
      } else if (p === 'between') {
        const w2 = bw * 0.62, h2 = bh * 0.8, y2 = by + bh - h2;
        pg.add(`<line x1="${cx - s * 0.46}" x2="${cx + s * 0.46}" y1="${by + bh}" y2="${by + bh}" stroke="#b9b3d6" stroke-width="0.6"/>` + crate(cx - s * 0.42, y2, w2, h2, false) + boxFront(cx - s * 0.42, y2, w2, h2) + crate(cx + s * 0.42 - w2 - w2 * 0.22, y2, w2, h2, false) + boxFront(cx + s * 0.42 - w2 - w2 * 0.22, y2, w2, h2));
      } else {
        pg.add(`<line x1="${cx - s * 0.46}" x2="${cx + s * 0.46}" y1="${by + bh}" y2="${by + bh}" stroke="#b9b3d6" stroke-width="0.6"/>` + crate(bx, by, bw, bh, p === 'in') + boxFront(bx, by, bw, bh));
      }
    });
    pages.push(pg.svg());
    return pages;
  }
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const pg = new Page(paper, answers ? 'Where is it? Answers' : 'Where is it?', { subtitle: answers ? 'Answer key for grown-ups.' : kind === 'write' ? 'Look at each picture. Write the missing word from the word bank.' : 'Look at each picture. Circle the word that tells you where the animal is.', noName: answers });
    if (kind === 'write') {
      pg.add(panel(pg.left, pg.y, pg.width, 12, '#fff6e0', '#ffb938', 5));
      const bank = shuffle(list.map(([p]) => p), rand);
      bank.forEach((p, i) => pg.add(txt(pg.left + pg.width * (i + 0.5) / bank.length, pg.y + 8.2, p, 5.4, { colour: PALETTE[i % PALETTE.length] })));
      pg.y += 16;
    }
    const cw = pg.width / 2, ch = (pg.room - 2) / 3;
    list.forEach(([p, pet], i) => {
      const x = pg.left + (i % 2) * cw, y = pg.y + Math.floor(i / 2) * ch;
      pg.add(panel(x + 2, y + 2, cw - 4, ch - 4, TINTS[i % TINTS.length], '#e2ddf2', 6));
      const s = Math.min(cw - 8, ch - 16);
      pg.add(scene(p, pet, x + cw / 2, y + 3 + s / 2, s));
      const ay = y + ch - 8;
      if (kind === 'write') {
        const pre = `The ${pet} is`, post = p === 'between' ? 'the boxes.' : p === 'under' ? 'the table.' : 'the box.';
        const fs = 4.8;
        pg.add(txt(x + 7, ay, pre, fs, { anchor: 'start', font: FONT }));
        const lx = x + 7 + pre.length * fs * 0.5 + 2;
        pg.add(`<line x1="${lx}" x2="${lx + 26}" y1="${ay + 0.6}" y2="${ay + 0.6}" stroke="#9a93b8" stroke-width="0.4"/>`);
        if (answers) pg.add(txt(lx + 13, ay - 0.6, p, fs, { colour: '#e0457b' }));
        pg.add(txt(lx + 28, ay, post, fs, { anchor: 'start', font: FONT }));
      } else {
        const opts = shuffle([p, ...shuffle(POSITIONS.filter((q) => q !== p), rand).slice(0, 2)], rand);
        opts.forEach((q, k) => {
          const ox = x + cw * (k + 0.5) / 3;
          pg.add(txt(ox, ay, q, fitFont(q, 5.2, cw / 3 - 4, 0.5), { colour: INK, font: FONT }));
          if (answers && q === p) pg.add(`<ellipse cx="${ox}" cy="${ay - 1.7}" rx="${cw / 6 - 2}" ry="4.4" fill="none" stroke="#e0457b" stroke-width="1"/>`);
        });
      }
    });
    pages.push(pg.svg());
  }
  return pages;
}

Object.assign(MAKERS, { oddone: makeOddOne, rolldraw: makeRollDraw, patterns: makePatterns, syllables: makeSyllables, doorhangers: makeDoorHangers, challenge: makeChallenge, doubles: makeDoubles, position: makePosition });

;
// PrintPals batch 10: secret code, copy the picture, finger puppets, handprint keepsakes,
// height chart, days and months, my body, and domino maths.

const PINK = '#e0457b';
const blankBox = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2.5" fill="#fff" stroke="#9a93b8" stroke-width="0.5"/>`;

// ================================================================ secret code
const CODE_PICS = ['apple', 'balloon', 'banana', 'bear', 'cake', 'cat', 'chick', 'cookie', 'cupcake', 'daisy', 'dog', 'donut', 'egg', 'envelope', 'fish',
  'gorilla', 'hat', 'heart', 'ladybird', 'lion', 'lolly', 'medal', 'monkey', 'mushroom', 'nest', 'octopus', 'orange', 'pig', 'present', 'rainbow',
  'star', 'strawberry', 'sun', 'tulip', 'turtle', 'zebra', 'ant', 'blueberry', 'popper'];
const CODE_MESSAGES = ['YOU ARE AMAZING', 'I LOVE YOU', 'BE KIND TODAY', 'READ A BOOK', 'LETS GO PLAY', 'YOU CAN DO IT', 'GIVE ME A HUG', 'SMILE A LOT',
  'YOU ARE MY STAR', 'TIME FOR A SNACK', 'KEEP TRYING', 'WELL DONE'];
const ALPHA26 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function makeSecretCode(o, paper) {
  const rand = rng(+o.seed || 1);
  const code = o.code || 'pictures';
  const pics = shuffle(CODE_PICS, rand).slice(0, 26);
  const custom = listOf(o.custom, 4).map((m) => m.toUpperCase().replace(/[^A-Z ]/g, '').replace(/\s+/g, ' ').trim()).map((m) => (m.length > 40 ? m.slice(0, 41).replace(/\s+\S*$/, '') || m.slice(0, 40) : m)).filter(Boolean);
  const messages = custom.length ? custom : shuffle(CODE_MESSAGES, rand).slice(0, 4);
  const sym = (ch) => code === 'numbers' ? ALPHA26.indexOf(ch) + 1 : code === 'backwards' ? ALPHA26[25 - ALPHA26.indexOf(ch)] : pics[ALPHA26.indexOf(ch)];
  const drawSym = (pg, ch, cx, cy, s) => {
    const v = sym(ch);
    if (code === 'pictures') pg.add(pic(ART(v), cx, cy, s * 0.9));
    else pg.add(txt(cx, cy + s * 0.2, v, s * 0.56, { colour: code === 'numbers' ? '#3a64d8' : '#8a3fd1' }));
  };
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const pg = new Page(paper, answers ? 'Secret code: answers' : 'Crack the secret code!', { subtitle: answers ? 'Answer key for grown-ups.' : 'Use the code key to find each letter. Write it on the line to read the secret message.', noName: answers });
    // The code key: two rows of 13.
    const kc = pg.width / 13, kh = kc * 1.5;
    pg.add(panel(pg.left - 1, pg.y - 1, pg.width + 2, kh * 2 + 4, '#fff6e0', '#ffb938', 5));
    for (let i = 0; i < 26; i++) {
      const x = pg.left + (i % 13) * kc, y = pg.y + 1 + Math.floor(i / 13) * kh;
      pg.add(`<rect x="${x + 0.6}" y="${y + 0.6}" width="${kc - 1.2}" height="${kh - 1.2}" rx="2" fill="#fff" stroke="#f1d9a0" stroke-width="0.4"/>`);
      pg.add(txt(x + kc / 2, y + 5.2, ALPHA26[i], 4.8, {}));
      drawSym(pg, ALPHA26[i], x + kc / 2, y + kh * 0.62, kc * 0.84);
    }
    pg.y += kh * 2 + 10;
    const maxCells = 16;
    const lines = [];
    messages.forEach((m) => {
      const rows = [];
      let row = '';
      m.split(' ').flatMap((w) => w.match(new RegExp(`.{1,${maxCells}}`, 'g'))).forEach((w) => { if (row && (row + ' ' + w).length > maxCells) { rows.push(row); row = w; } else row = row ? row + ' ' + w : w; });
      if (row) rows.push(row);
      lines.push(rows);
    });
    const total = lines.reduce((a, r) => a + r.length, 0);
    const cell = Math.min(16, (pg.width - 10) / maxCells, (pg.room - 22 - lines.length * 4) / (total * 1.9));
    const rowH = cell * 1.9;
    const gap = Math.max(4, (pg.room - 30 - total * rowH) / Math.max(1, lines.length));
    lines.forEach((rows, mi) => {
      pg.add(`<circle cx="${pg.left + 3}" cy="${pg.y + cell / 2}" r="3.2" fill="${PALETTE[mi % PALETTE.length]}"/>` + txt(pg.left + 3, pg.y + cell / 2 + 1.4, mi + 1, 3.8, { colour: '#fff' }));
      rows.forEach((r) => {
        const x0 = pg.left + 9 + (pg.width - 9 - r.length * cell) / 2;
        [...r].forEach((ch, k) => {
          if (ch === ' ') return;
          const x = x0 + k * cell;
          pg.add(`<rect x="${x + 0.5}" y="${pg.y}" width="${cell - 1}" height="${cell}" rx="2" fill="${TINTS[mi % TINTS.length]}"/>`);
          drawSym(pg, ch, x + cell / 2, pg.y + cell / 2, cell);
          pg.add(`<line x1="${x + 1.5}" x2="${x + cell - 1.5}" y1="${pg.y + cell * 1.72}" y2="${pg.y + cell * 1.72}" stroke="${INK}" stroke-width="0.45"/>`);
          if (answers) pg.add(txt(x + cell / 2, pg.y + cell * 1.6, ch, cell * 0.5, { colour: PINK }));
        });
        pg.y += rowH;
      });
      pg.y += gap;
    });
    const by = pg.bottom - 14;
    pg.add(panel(pg.left, by, pg.width, 13, '#f5edff', '#b06cff', 5));
    pg.add(txt(pg.left + 5, by + 8.2, 'Now write your own secret message in code for someone you love!', 4.4, { anchor: 'start', font: FONT, colour: '#8a3fd1' }));
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ copy the picture (grid drawing)
function makeGridCopy(o, paper) {
  const rand = rng(+o.seed || 1);
  const keys = Object.keys(PIXEL);
  const mirrorOk = (k) => PIXEL[k].rows.every((r) => r === [...r].reverse().join(''));
  const kind = o.kind || 'copy';
  const pool = kind === 'half' ? keys.filter(mirrorOk) : keys;
  const key = pool.includes(o.picture) ? o.picture : pool[Math.floor(rand() * pool.length)];
  const art = PIXEL[key], n = art.rows.length, m = art.rows[0].length;
  const labels = o.labels !== false;
  const colourOf = (ch) => (ch === '.' ? '#fff' : art.colours[ch][1]);
  const pg = new Page(paper, kind === 'half' ? 'Finish the other half' : 'Copy the picture', { subtitle: kind === 'half' ? `Colour the empty squares to match the other side. It makes ${art.name}!` : 'Look at the small picture. Copy it square by square into the big grid.' });
  const grid = (x, y, cell, fill, lab) => {
    for (let r = 0; r < n; r++) for (let c = 0; c < m; c++) {
      const ch = art.rows[r][c];
      pg.add(`<rect x="${x + c * cell}" y="${y + r * cell}" width="${cell}" height="${cell}" fill="${fill(r, c, ch)}" stroke="#b9b3d6" stroke-width="0.3"/>`);
    }
    pg.add(`<rect x="${x}" y="${y}" width="${cell * m}" height="${cell * n}" fill="none" stroke="${INK}" stroke-width="0.8"/>`);
    if (lab) {
      for (let c = 0; c < m; c++) pg.add(txt(x + c * cell + cell / 2, y - 1.6, ALPHA26[c], Math.min(4, cell * 0.45), { colour: SOFT, font: FONT }));
      for (let r = 0; r < n; r++) pg.add(txt(x - 2.4, y + r * cell + cell / 2 + 1.3, r + 1, Math.min(4, cell * 0.45), { colour: SOFT, font: FONT, anchor: 'end' }));
    }
  };
  if (kind === 'half') {
    const cell = Math.min((pg.width - 10) / m, (pg.room - 30) / n);
    const x = pg.left + (pg.width - cell * m) / 2 + 3, y = pg.y + 6;
    grid(x, y, cell, (r, c, ch) => (c < m / 2 ? colourOf(ch) : '#fff'), labels);
    pg.add(`<line x1="${x + cell * m / 2}" x2="${x + cell * m / 2}" y1="${y - 3}" y2="${y + cell * n + 3}" stroke="${PINK}" stroke-width="0.9" stroke-dasharray="2.4 1.6"/>`);
    const ky = y + cell * n + 8;
    Object.entries(art.colours).filter(([ch]) => ch !== '.').forEach(([, [nm, hex]], i) => {
      const kx = pg.left + 4 + i * 36;
      pg.add(`<rect x="${kx}" y="${ky}" width="7" height="7" rx="1.5" fill="${hex}" stroke="${INK}" stroke-width="0.4"/>` + txt(kx + 9, ky + 5.4, nm, 4, { anchor: 'start', font: FONT }));
    });
    return [pg.svg()];
  }
  const small = Math.min(5.2, (pg.width * 0.42) / m);
  const sx = pg.left + 6, sy = pg.y + 5;
  pg.add(panel(pg.left, pg.y, small * m + 12, small * n + 10, '#fff6e0', '#ffb938', 5));
  grid(sx, sy, small, (r, c, ch) => colourOf(ch), false);
  const tx = pg.left + small * m + 18;
  textLines(pg, wrap(`This is ${art.name}. Start at the top left and copy one square at a time. Count the squares to help you.`, 34), tx, pg.y + 9, 4.4, { weight: 700 });
  Object.entries(art.colours).filter(([ch]) => ch !== '.').forEach(([, [nm, hex]], i) => {
    const kx = tx + (i % 2) * 44, ky = pg.y + 30 + Math.floor(i / 2) * 9;
    pg.add(`<rect x="${kx}" y="${ky}" width="7" height="7" rx="1.5" fill="${hex}" stroke="${INK}" stroke-width="0.4"/>` + txt(kx + 9, ky + 5.4, nm, 4, { anchor: 'start', font: FONT }));
  });
  pg.y += small * n + 18;
  const cell = Math.min((pg.width - 10) / m, (pg.room - 4) / n);
  grid(pg.left + (pg.width - cell * m) / 2 + 3, pg.y, cell, () => '#fff', labels);
  return [pg.svg()];
}

// ================================================================ finger puppets
const PUPPET_LINE = ['cat', 'dog', 'bunny', 'owl', 'frog', 'penguin', 'bee', 'ladybird', 'unicorn', 'teddy', 'elephant', 'dino', 'octopus', 'whale', 'turtle', 'snail'];
const PUPPET_BRIGHT = ['lion', 'monkey', 'pig', 'zebra', 'gorilla', 'cat', 'dog', 'chick', 'turtle', 'octopus', 'fish', 'ladybird', 'bear', 'ant'];

function makePuppets(o, paper) {
  const rand = rng(+o.seed || 1);
  const bright = o.style === 'bright';
  const list = shuffle(bright ? PUPPET_BRIGHT : PUPPET_LINE, rand).slice(0, 9);
  const pg = new Page(paper, 'Finger puppets', { subtitle: 'Colour, cut out, then wrap the band around your finger and glue the tab. Put on a puppet show!' });
  const cw = pg.width / 3, ch = (pg.room - 2) / 3;
  list.forEach((a, i) => {
    const x = pg.left + (i % 3) * cw, y = pg.y + Math.floor(i / 3) * ch, cx = x + cw / 2, c = i % PALETTE.length;
    const bandW = Math.min(cw - 6, 54), bandH = 13, size = Math.min(cw - 14, ch - bandH - 12);
    const by = y + 3 + size - 2;
    // Band first so the picture sits on top of it.
    pg.add(`<rect x="${cx - bandW / 2}" y="${by}" width="${bandW}" height="${bandH}" rx="2" fill="${bright ? TINTS[c] : '#fff'}" stroke="${INK}" stroke-width="0.6"/>`);
    pg.add(`<rect x="${cx + bandW / 2 - 9}" y="${by}" width="9" height="${bandH}" fill="#f4f1fb" stroke="${INK}" stroke-width="0.5" stroke-dasharray="1.8 1.2"/>` + txt(cx + bandW / 2 - 4.5, by + bandH / 2 + 1.2, 'glue', 3, { colour: SOFT, font: FONT }));
    pg.add(`<circle cx="${cx}" cy="${y + 3 + size / 2}" r="${size / 2 + 1.5}" fill="${bright ? TINTS[c] : '#fff'}" stroke="#b9b3d6" stroke-width="0.4" stroke-dasharray="2 1.4"/>`);
    if (bright) pg.add(pic(ART(a), cx, y + 3 + size / 2, size * 0.96));
    else pg.add(`<g transform="translate(${cx - size / 2} ${y + 3}) scale(${(size / 200).toFixed(4)})">${colouringArt(a)}</g>`);
    const nm = bright ? a : (COLOURING[a] ? COLOURING[a].name : a);
    pg.add(txt(cx - 4, by + bandH - 3.4, nm, fitFont(nm, 4.8, bandW - 14), { colour: bright ? PALETTE[c] : INK }));
  });
  return [pg.svg()];
}

// ================================================================ handprint keepsakes
function handShape(cx, cy, s, flip, pad, colour) {
  // s = hand height. Palm, four fingers and a thumb, drawn in a 100 x 130 box; pad grows every part.
  const k = s / 130, X = (v) => cx + (flip ? -1 : 1) * (v - 50) * k, Y = (v) => cy + (v - 70) * k;
  const cap = (x1, y1, x2, y2, w) => `<line x1="${X(x1)}" y1="${Y(y1)}" x2="${X(x2)}" y2="${Y(y2)}" stroke="${colour}" stroke-width="${w * k + pad}" stroke-linecap="round"/>`;
  return `<ellipse cx="${X(50)}" cy="${Y(88)}" rx="${30 * k + pad / 2}" ry="${34 * k + pad / 2}" fill="${colour}"/>`
    + cap(28, 70, 22, 22, 15) + cap(43, 64, 41, 10, 15.5) + cap(58, 64, 60, 12, 15) + cap(72, 70, 78, 32, 13.5) + cap(76, 100, 96, 80, 15);
}
function handOutline(cx, cy, s, flip, colour = '#b9b3d6') {
  // The same hand drawn slightly bigger in colour, then in white on top: only the outside edge shows.
  return handShape(cx, cy, s, flip, 1.4, colour) + handShape(cx, cy, s, flip, 0, '#fff');
}
function footOutline(cx, cy, s, flip, colour = '#b9b3d6') {
  const k = s / 120, X = (v) => cx + (flip ? -1 : 1) * (v - 40) * k, Y = (v) => cy + (v - 60) * k;
  const shapes = (f, st) => `<path d="M${X(22)} ${Y(40)} C${X(20)} ${Y(20)} ${X(62)} ${Y(18)} ${X(64)} ${Y(42)} C${X(66)} ${Y(70)} ${X(56)} ${Y(86)} ${X(56)} ${Y(104)} C${X(56)} ${Y(122)} ${X(26)} ${Y(122)} ${X(26)} ${Y(104)} C${X(26)} ${Y(84)} ${X(24)} ${Y(66)} ${X(22)} ${Y(40)} Z" fill="${f}" stroke="${st}" stroke-width="${st === '#fff' ? 0.1 : 2.2}"/>`
    + [[26, 12, 7.5], [38, 7, 6], [48, 8, 5.2], [56, 12, 4.6], [62, 19, 4]].map(([x, y, r]) => `<circle cx="${X(x)}" cy="${Y(y)}" r="${r * k}" fill="${f}" stroke="${st}" stroke-width="${st === '#fff' ? 0.1 : 2.2}"/>`).join('');
  return shapes(colour, colour) + shapes('#fff', '#fff');
}

const KEEPSAKES = {
  hands: { title: 'My little hands', poem: ['Here are my hands, so little and small,', 'they wave and they clap and they catch a ball.', 'Keep this and smile when I am grown up and tall,', 'and remember these hands, the smallest of all.'] },
  flower: { title: 'Watch me grow', poem: ['I planted a flower with my own little hand.', 'It will grow up tall, and so will I!'] },
  feet: { title: 'My tiny feet', poem: ['Look at my feet, so tiny today.', 'Soon they will run and dance and play.', 'Wherever they take me, near or far,', 'they will always come home to where you are.'] },
  heart: { title: 'I love you this much', poem: ['Two little hands to make a heart,', 'full of love from the very start.'] },
};

function makeHandprints(o, paper) {
  const kind = KEEPSAKES[o.kind] ? o.kind : 'hands';
  const ks = KEEPSAKES[kind];
  const name = nameOf(o.name, '');
  const pg = new Page(paper, '', { bare: true });
  const cx = pg.w / 2;
  // A soft frame with painted corners.
  pg.add(`<rect x="${pg.left - 3}" y="${pg.m - 3}" width="${pg.width + 6}" height="${pg.bottom - pg.m + 3}" rx="9" fill="#fffdf8" stroke="#ffb938" stroke-width="1"/>`);
  pg.add(`<rect x="${pg.left}" y="${pg.m}" width="${pg.width}" height="${pg.bottom - pg.m - 3}" rx="7" fill="none" stroke="#ffd98a" stroke-width="0.5" stroke-dasharray="2 1.6"/>`);
  ['star', 'heart', 'heart', 'star'].forEach((a, i) => pg.add(pic(ART(a), i % 2 ? pg.right - 8 : pg.left + 8, i < 2 ? pg.m + 8 : pg.bottom - 11, 11)));
  let y = pg.m + 20;
  pg.add(txt(cx, y, ks.title, 13, { colour: INK }));
  y += 10;
  const fs = 5.2;
  ks.poem.forEach((l, i) => pg.add(txt(cx, y + i * fs * 1.45, l, fs, { font: FONT, weight: 700, colour: '#6a5f9a' })));
  y += ks.poem.length * fs * 1.45 + 6;
  const area = pg.bottom - 40 - y;
  if (kind === 'hands') {
    const s = Math.min(area * 0.92, pg.width * 0.42 * 1.3);
    pg.add(handOutline(cx - pg.width * 0.23, y + area / 2, s, true));
    pg.add(handOutline(cx + pg.width * 0.23, y + area / 2, s, false));
    pg.add(txt(cx, y + area - 2, 'Paint your hands and press them here', 4, { font: FONT, colour: SOFT }));
  } else if (kind === 'feet') {
    const s = Math.min(area * 0.9, pg.width * 0.5);
    pg.add(footOutline(cx - pg.width * 0.17, y + area / 2, s, true));
    pg.add(footOutline(cx + pg.width * 0.17, y + area / 2, s, false));
    pg.add(txt(cx, y + area - 2, 'Paint your feet and press them here', 4, { font: FONT, colour: SOFT }));
  } else if (kind === 'flower') {
    const top = y + area * 0.34, potY = y + area - 40;
    pg.add(`<path d="M${cx} ${top + 30} C${cx - 6} ${top + 70} ${cx + 6} ${potY - 40} ${cx} ${potY}" fill="none" stroke="#3fbf60" stroke-width="3" stroke-linecap="round"/>`);
    pg.add(`<path d="M${cx} ${potY - 40} C${cx - 30} ${potY - 60} ${cx - 42} ${potY - 38} ${cx - 34} ${potY - 30} C${cx - 24} ${potY - 28} ${cx - 10} ${potY - 32} ${cx} ${potY - 40} Z M${cx} ${potY - 64} C${cx + 30} ${potY - 84} ${cx + 42} ${potY - 62} ${cx + 34} ${potY - 54} C${cx + 24} ${potY - 52} ${cx + 10} ${potY - 56} ${cx} ${potY - 64} Z" fill="#8bd48f" stroke="#2e9d63" stroke-width="0.8"/>`);
    pg.add(`<path d="M${cx - 30} ${potY} H${cx + 30} L${cx + 23} ${potY + 38} H${cx - 23} Z" fill="#f0a868" stroke="${INK}" stroke-width="0.8"/><rect x="${cx - 34}" y="${potY - 2}" width="68" height="10" rx="2" fill="#e8925a" stroke="${INK}" stroke-width="0.8"/>`);
    // Upside down hand: the fingers become the petals.
    const hs = Math.min(76, area * 0.46), hk = hs / 130;
    pg.add(handOutline(cx, top + 30 - 48 * hk, hs, false, '#ffb3c6'));
    pg.add(txt(cx, y + 4, 'Press your painted hand at the top of the stem. The fingers are the petals!', 4, { font: FONT, colour: SOFT }));
    if (name) pg.add(txt(cx, potY + 24, name, fitFont(name, 9, 40), { colour: '#fff' }));
  } else {
    const r = Math.min(area * 0.44, pg.width * 0.44);
    const hy = y + area * 0.46;
    pg.add(`<path d="M${cx} ${hy + r * 0.95} C${cx - r * 1.7} ${hy - r * 0.05} ${cx - r * 0.75} ${hy - r * 1.2} ${cx} ${hy - r * 0.42} C${cx + r * 0.75} ${hy - r * 1.2} ${cx + r * 1.7} ${hy - r * 0.05} ${cx} ${hy + r * 0.95} Z" fill="#fff0f5" stroke="#ff7eb6" stroke-width="1.2" stroke-dasharray="3 2"/>`);
    pg.add(`<g transform="rotate(-35 ${cx - r * 0.42} ${hy})">${handOutline(cx - r * 0.42, hy, r * 0.9, true, '#ffb3c6')}</g>`);
    pg.add(`<g transform="rotate(35 ${cx + r * 0.42} ${hy})">${handOutline(cx + r * 0.42, hy, r * 0.9, false, '#ffb3c6')}</g>`);
    pg.add(txt(cx, y + area - 2, 'Press both painted hands to make a heart', 4, { font: FONT, colour: SOFT }));
  }
  // Name, age and date lines.
  const ly = pg.bottom - 22, third = pg.width / 3;
  [['Name', name], ['Age', o.age ? String(o.age).slice(0, 12) : ''], ['Date', '']].forEach(([lab, val], i) => {
    const x = pg.left + 8 + i * third;
    pg.add(txt(x, ly, lab, 4.6, { anchor: 'start', font: FONT, colour: SOFT }));
    pg.add(`<line x1="${x + 12}" x2="${x + third - 12}" y1="${ly + 0.6}" y2="${ly + 0.6}" stroke="#b9b3d6" stroke-width="0.4"/>`);
    if (val) pg.add(txt(x + 12 + (third - 24) / 2, ly - 1, val, fitFont(val, 6, third - 26), { colour: INK }));
  });
  pg.footer = () => {};
  return [pg.svg()];
}

// ================================================================ height chart
function makeHeightChart(o, paper) {
  const inches = o.units === 'in';
  const unit = inches ? 25.4 : 10; // mm per unit
  const per = inches ? 10 : 25; // units per strip
  const start = inches ? 20 : +(o.start || 50);
  const strips = 4;
  const name = nameOf(o.name, '');
  const deco = ['monkey', 'lion', 'zebra', 'turtle', 'octopus', 'chick', 'pig', 'gorilla', 'ladybird', 'star', 'rainbow', 'sun'];
  const pages = [];
  for (let p = 0; p < 1; p++) {
    const pg = new Page(paper, '', { bare: true });
    const len = per * unit, top = pg.m + 8, sw = Math.min(44, pg.width / 4 - 3);
    pg.add(txt(pg.w / 2, pg.m + 2, `Print at 100% (actual size). Stick strip 1 with its bottom ${start} ${inches ? 'inches' : 'cm'} above the floor, then each strip above the last.`, 3.5, { font: FONT, colour: SOFT }));
    for (let k = 0; k < strips; k++) {
      const s = k;
      if (s >= strips) break;
      const lo = start + s * per, hi = lo + per, c = s % PALETTE.length;
      const x = pg.left + k * (pg.width / strips) + (pg.width / strips - sw) / 2, yTop = top, yBot = top + len;
      pg.add(`<rect x="${x}" y="${yTop}" width="${sw}" height="${len}" fill="${TINTS[c]}" stroke="#b9b3d6" stroke-width="0.4" stroke-dasharray="2 1.5"/>`);
      pg.add(`<rect x="${x + sw - 12}" y="${yTop}" width="12" height="${len}" fill="${PALETTE[c]}" opacity="0.35"/>`);
      // Ticks: every mm (or eighth inch), bigger each 5, numbered each whole unit.
      const steps = inches ? per * 8 : per * 10;
      for (let t = 0; t <= steps; t++) {
        const yy = yBot - (t / steps) * len;
        const whole = inches ? t % 8 === 0 : t % 10 === 0, half = inches ? t % 4 === 0 : t % 5 === 0;
        const w = whole ? 12 : half ? 7 : 3.5;
        pg.add(`<line x1="${x}" x2="${x + w}" y1="${yy}" y2="${yy}" stroke="${INK}" stroke-width="${whole ? 0.5 : 0.25}"/>`);
        const v = lo + (inches ? t / 8 : t / 10);
        if (whole && t > 0 && t < steps) pg.add(txt(x + 13.5, yy + 1.5, v, 4.2, { anchor: 'start', colour: INK }));
      }
      pg.add(txt(x + sw / 2 - 5, yBot - 3, `${lo} ${inches ? 'in' : 'cm'}`, 3.6, { colour: SOFT, font: FONT }));
      // Writing lines for "Name, age" beside some marks, and a painted friend.
      if (s < strips - 1) for (let d = 0; d < 3; d++) pg.add(pic(ART(deco[(s * 3 + d) % deco.length]), x + sw - 6, yTop + len * (0.2 + d * 0.3), 12));
      pg.add(`<rect x="${x + 2}" y="${yTop + 2}" width="${sw - 16}" height="11" rx="2" fill="#fff" opacity="0.96"/>`);
      pg.add(txt(x + (sw - 12) / 2 + 1, yTop + 6.6, `Strip ${s + 1} of ${strips}`, 4, { colour: PALETTE[c] }));
      pg.add(txt(x + (sw - 12) / 2 + 1, yTop + 11, `${lo} to ${hi} ${inches ? 'inches' : 'cm'}`, 3.2, { colour: SOFT, font: FONT }));
      if (s === strips - 1) {
        const title = name ? `Watch ${name} grow!` : 'Watch me grow!';
        const tfs = fitFont(title, 8.5, len * 0.7), bx = x + sw - 6;
        pg.add(`<text transform="rotate(-90 ${bx} ${yTop + len * 0.5})" x="${bx}" y="${yTop + len * 0.5 + tfs * 0.34}" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="${tfs.toFixed(2)}" fill="${PALETTE[c]}" stroke="#fff" stroke-width="${(tfs * 0.1).toFixed(2)}" paint-order="stroke">${esc(title)}</text>`);
        pg.add(pic(ART('star'), bx, yTop + 22, 11));
      }
    }
    pg.footer = () => {};
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ days and months
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function dayWeather(kind, cx, cy, s) {
  const st = `stroke="${INK}" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"`;
  const cloud = (dx, dy, k, fill) => `<path d="M${cx + dx - s * 0.36 * k} ${cy + dy + s * 0.14 * k} a${s * 0.16 * k} ${s * 0.16 * k} 0 0 1 ${s * 0.1 * k} ${-s * 0.3 * k} a${s * 0.22 * k} ${s * 0.22 * k} 0 0 1 ${s * 0.4 * k} ${-s * 0.04 * k} a${s * 0.16 * k} ${s * 0.16 * k} 0 0 1 ${s * 0.18 * k} ${s * 0.34 * k} Z" fill="${fill}" ${st}/>`;
  switch (kind) {
    case 'sunny': return `<circle cx="${cx}" cy="${cy}" r="${s * 0.22}" fill="#ffd23f" ${st}/>` + [0, 1, 2, 3, 4, 5, 6, 7].map((k) => { const a = k * Math.PI / 4; return `<line x1="${cx + Math.cos(a) * s * 0.3}" y1="${cy + Math.sin(a) * s * 0.3}" x2="${cx + Math.cos(a) * s * 0.42}" y2="${cy + Math.sin(a) * s * 0.42}" stroke="#ffb938" stroke-width="0.9" stroke-linecap="round"/>`; }).join('');
    case 'cloudy': return cloud(0, 0, 1.1, '#e6eef8');
    case 'rainy': return cloud(0, -s * 0.1, 1, '#cfd8e8') + [-0.16, 0, 0.16].map((a) => `<line x1="${cx + a * s}" y1="${cy + s * 0.14}" x2="${cx + a * s - s * 0.05}" y2="${cy + s * 0.3}" stroke="#3a86ff" stroke-width="0.8" stroke-linecap="round"/>`).join('');
    case 'windy': return `<path d="M${cx - s * 0.36} ${cy - s * 0.12} H${cx + s * 0.16} a${s * 0.1} ${s * 0.1} 0 1 0 ${-s * 0.1} ${-s * 0.1} M${cx - s * 0.36} ${cy + s * 0.04} H${cx + s * 0.26} a${s * 0.1} ${s * 0.1} 0 1 1 ${-s * 0.1} ${s * 0.1} M${cx - s * 0.3} ${cy + s * 0.2} H${cx + s * 0.06}" fill="none" stroke="#35b5e5" stroke-width="0.9" stroke-linecap="round"/>`;
    case 'stormy': return cloud(0, -s * 0.1, 1, '#b8c2d6') + `<path d="M${cx + s * 0.02} ${cy + s * 0.08} L${cx - s * 0.08} ${cy + s * 0.24} H${cx + s * 0.02} L${cx - s * 0.06} ${cy + s * 0.4} L${cx + s * 0.14} ${cy + s * 0.18} H${cx + s * 0.04} L${cx + s * 0.1} ${cy + s * 0.08} Z" fill="#ffd23f" ${st}/>`;
    default: return `<circle cx="${cx}" cy="${cy}" r="${s * 0.22}" fill="#ffd23f" ${st}/>` + cloud(s * 0.1, s * 0.1, 0.9, '#fff');
  }
}

function makeDaysMonths(o, paper) {
  const rand = rng(+o.seed || 1);
  const kind = o.kind || 'week';
  if (kind === 'today') {
    const pg = new Page(paper, 'My day today', { subtitle: 'Fill this in every morning. Circle the answers and write the rest.' });
    const sec = (title, h, c) => { pg.add(panel(pg.left, pg.y, pg.width, h, TINTS[c], PALETTE[c], 6) + txt(pg.left + 5, pg.y + 7.5, title, 5.6, { anchor: 'start', colour: PALETTE[c] })); const y0 = pg.y; pg.y += h + 5; return y0; };
    let y = sec('Today is...', 30, 0);
    DAYS.forEach((d, i) => { const w = pg.width / 7, x = pg.left + w * i; pg.add(`<rect x="${x + 1.5}" y="${y + 12}" width="${w - 3}" height="12" rx="6" fill="#fff" stroke="${PALETTE[i]}" stroke-width="0.7"/>` + txt(x + w / 2, y + 19.6, d, fitFont(d, 4.6, w - 6), { colour: INK })); });
    y = sec('The date', 26, 3);
    [['Day', 30], ['Month', 60], ['Year', 40]].reduce((x, [lab, w]) => { pg.add(txt(x, y + 20, lab, 4.4, { anchor: 'start', font: FONT, colour: SOFT }) + `<line x1="${x + 14}" x2="${x + w + 10}" y1="${y + 20.6}" y2="${y + 20.6}" stroke="#9a93b8" stroke-width="0.4"/>`); return x + w + 20; }, pg.left + 6);
    y = sec('Yesterday and tomorrow', 32, 2);
    pg.add(txt(pg.left + 6, y + 17, 'Yesterday was', 5, { anchor: 'start', font: FONT }) + `<line x1="${pg.left + 42}" x2="${pg.right - 8}" y1="${y + 17.6}" y2="${y + 17.6}" stroke="#9a93b8" stroke-width="0.4"/>`);
    pg.add(txt(pg.left + 6, y + 27, 'Tomorrow will be', 5, { anchor: 'start', font: FONT }) + `<line x1="${pg.left + 48}" x2="${pg.right - 8}" y1="${y + 27.6}" y2="${y + 27.6}" stroke="#9a93b8" stroke-width="0.4"/>`);
    y = sec('The weather today is...', 40, 1);
    ['sunny', 'cloudy', 'rainy', 'windy', 'stormy', 'sunny and cloudy'].forEach((w, i) => { const cw = pg.width / 6, cx = pg.left + cw * (i + 0.5); pg.add(`<rect x="${cx - cw / 2 + 2}" y="${y + 11}" width="${cw - 4}" height="26" rx="5" fill="#fff" stroke="#f1d9a0" stroke-width="0.5"/>` + dayWeather(w === 'sunny and cloudy' ? 'mixed' : w, cx, y + 21, 16) + txt(cx, y + 34, w === 'sunny and cloudy' ? 'sunny spells' : w, 3.6, { font: FONT })); });
    y = sec('Today I feel...', 30, 5);
    ['happy', 'calm', 'tired', 'sad', 'silly', 'proud'].forEach((m, i) => { const cw = pg.width / 6, cx = pg.left + cw * (i + 0.5); pg.add(face(cx, y + 18, 6.5, m, true) + txt(cx, y + 28.6, m, 3.8, { font: FONT })); });
    const h = pg.room - 2;
    y = sec('Something I will do today', h, 4);
    for (let l = 1; l <= 3; l++) if (y + 6 + l * 11 < y + h) pg.add(`<line x1="${pg.left + 6}" x2="${pg.right - 6}" y1="${y + 6 + l * 11}" y2="${y + 6 + l * 11}" stroke="#c9b8ef" stroke-width="0.4"/>`);
    return [pg.svg()];
  }
  const week = kind === 'week';
  const list = week ? DAYS : MONTHS;
  const hide = new Set(shuffle(list.map((_, i) => i), rand).slice(0, week ? 3 : 5));
  const qs = [];
  const idx = shuffle(list.map((_, i) => i), rand);
  for (let i = 0; i < 4; i++) {
    const k = idx[i];
    if (i % 2 === 0) qs.push([`What comes after ${list[k]}?`, list[(k + 1) % list.length]]);
    else qs.push([`What comes before ${list[k]}?`, list[(k + list.length - 1) % list.length]]);
  }
  const pages = [];
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const pg = new Page(paper, answers ? `${week ? 'Days of the week' : 'Months of the year'}: answers` : week ? 'Days of the week' : 'Months of the year', { subtitle: answers ? 'Answer key for grown-ups.' : week ? 'There are 7 days in a week. Write the missing days, then answer the questions.' : 'There are 12 months in a year. Write the missing months, then answer the questions.', noName: answers });
    const cols = week ? 1 : 3, rows = week ? 7 : 4;
    const areaH = week ? 7 * 13 : 4 * 22, cw = pg.width / cols, ch = areaH / rows;
    list.forEach((d, i) => {
      const x = pg.left + (week ? 0 : (i % cols) * cw), y = pg.y + (week ? i : Math.floor(i / cols)) * ch, c = i % PALETTE.length;
      pg.add(panel(x + 1.5, y + 1.2, cw - 3, ch - 2.4, TINTS[c], PALETTE[c], 5));
      pg.add(`<circle cx="${x + 9}" cy="${y + ch / 2}" r="${Math.min(4.5, ch / 2 - 2)}" fill="${PALETTE[c]}"/>` + txt(x + 9, y + ch / 2 + 1.6, i + 1, 4.4, { colour: '#fff' }));
      const tx = x + (week ? 20 : cw / 2 + 4), ty = y + ch / 2 + 2.6;
      const anchor = week ? 'start' : 'middle';
      if (hide.has(i) && !answers) pg.add(`<line x1="${week ? tx : tx - cw * 0.32}" x2="${week ? tx + 70 : tx + cw * 0.32}" y1="${ty + 1}" y2="${ty + 1}" stroke="#9a93b8" stroke-width="0.45"/>`);
      else pg.add(txt(tx, ty, d, week ? 7 : fitFont(d, 6.4, cw * 0.62), { anchor, colour: hide.has(i) ? PINK : INK }));
      if (week && (i >= 5)) pg.add(txt(pg.right - 6, ty, 'weekend', 4, { anchor: 'end', font: FONT, colour: SOFT }));
    });
    pg.y += areaH + 8;
    qs.forEach(([q, a], i) => {
      const y = pg.y + i * 13;
      pg.add(txt(pg.left + 2, y + 6, q, 5, { anchor: 'start', font: FONT }));
      pg.add(`<line x1="${pg.left + 104}" x2="${pg.right - 4}" y1="${y + 6.6}" y2="${y + 6.6}" stroke="#9a93b8" stroke-width="0.45"/>`);
      if (answers) pg.add(txt(pg.left + 108, y + 5.6, a, 5.2, { anchor: 'start', colour: PINK }));
    });
    pg.y += 4 * 13 + 4;
    const last = week ? ['My favourite day is', 'because'] : ['My birthday is in', 'My favourite month is'];
    last.forEach((l, i) => {
      const y = pg.y + i * 13;
      pg.add(txt(pg.left + 2, y + 6, l, 5, { anchor: 'start', font: FONT, colour: '#8a3fd1' }) + `<line x1="${pg.left + 58}" x2="${pg.right - 4}" y1="${y + 6.6}" y2="${y + 6.6}" stroke="#c9b8ef" stroke-width="0.45"/>`);
    });
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ my body
function bodyFigure(ox, oy, k) {
  // A child drawn in a 120 x 225 box. Returns svg.
  const X = (v) => ox + v * k, Y = (v) => oy + v * k, R = (v) => v * k;
  const st = `stroke="${INK}" stroke-width="${R(1.4)}" stroke-linejoin="round" stroke-linecap="round"`;
  const skin = '#ffe3cf', shirt = '#bfe3ff', shorts = '#ffd0e0';
  const P = (d, fill) => `<path d="${d.replace(/(-?\d+\.?\d*) (-?\d+\.?\d*)/g, (m, a, b) => `${X(+a).toFixed(2)} ${Y(+b).toFixed(2)}`)}" fill="${fill}" ${st}/>`;
  let s = '';
  // Legs and feet
  s += P('M44 146 L44 202 L58 202 L58 146 Z', skin) + P('M62 146 L62 202 L76 202 L76 146 Z', skin);
  s += P('M40 202 Q36 214 50 214 L60 214 Q62 206 58 202 Z', skin) + P('M80 202 Q84 214 70 214 L60 214 Q58 206 62 202 Z', skin);
  [[42, 210], [46, 212.5], [50.5, 213.4], [78, 210], [74, 212.5], [69.5, 213.4]].forEach(([a, b]) => { s += `<circle cx="${X(a)}" cy="${Y(b)}" r="${R(1.5)}" fill="${skin}" stroke="${INK}" stroke-width="${R(0.8)}"/>`; });
  s += `<path d="M${X(46)} ${Y(174)} q${R(5)} ${R(-3)} ${R(10)} 0 M${X(64)} ${Y(174)} q${R(5)} ${R(-3)} ${R(10)} 0" fill="none" stroke="${INK}" stroke-width="${R(0.9)}" stroke-linecap="round"/>`;
  // Arms
  s += P('M34 76 Q20 90 18 110 L16 132 L25 133 L28 112 Q30 98 38 90 Z', skin) + P('M86 76 Q100 90 102 110 L104 132 L95 133 L92 112 Q90 98 82 90 Z', skin);
  s += `<circle cx="${X(20.5)}" cy="${Y(137)}" r="${R(6.5)}" fill="${skin}" stroke="${INK}" stroke-width="${R(1.4)}"/><circle cx="${X(99.5)}" cy="${Y(137)}" r="${R(6.5)}" fill="${skin}" stroke="${INK}" stroke-width="${R(1.4)}"/>`;
  // Shorts and T-shirt
  s += P('M40 124 L80 124 L82 150 L62 150 L60 138 L58 150 L38 150 Z', shorts);
  s += P('M48 66 L72 66 L90 76 L96 94 L84 98 L80 88 L80 128 L40 128 L40 88 L36 98 L24 94 L30 76 Z', shirt);
  s += `<circle cx="${X(60)}" cy="${Y(106)}" r="${R(1.3)}" fill="${INK}"/>`;
  // Neck, ears, head, hair, face
  s += P('M54 56 L66 56 L66 68 L54 68 Z', skin);
  s += `<circle cx="${X(38)}" cy="${Y(38)}" r="${R(6)}" fill="${skin}" ${st}/><circle cx="${X(82)}" cy="${Y(38)}" r="${R(6)}" fill="${skin}" ${st}/>`;
  s += `<circle cx="${X(60)}" cy="${Y(36)}" r="${R(23)}" fill="${skin}" ${st}/>`;
  s += P('M37 34 Q36 10 60 11 Q84 10 83 34 Q78 22 66 22 Q62 28 52 24 Q42 24 37 34 Z', '#8d5524');
  s += `<circle cx="${X(51)}" cy="${Y(37)}" r="${R(2.4)}" fill="${INK}"/><circle cx="${X(69)}" cy="${Y(37)}" r="${R(2.4)}" fill="${INK}"/>`;
  s += `<path d="M${X(47)} ${Y(31)} q${R(4)} ${R(-2.5)} ${R(8)} 0 M${X(65)} ${Y(31)} q${R(4)} ${R(-2.5)} ${R(8)} 0" fill="none" stroke="${INK}" stroke-width="${R(1)}" stroke-linecap="round"/>`;
  s += `<path d="M${X(60)} ${Y(40)} q${R(-2)} ${R(4)} ${R(1)} ${R(5)}" fill="none" stroke="${INK}" stroke-width="${R(1)}" stroke-linecap="round"/>`;
  s += `<path d="M${X(53)} ${Y(49)} Q${X(60)} ${Y(55)} ${X(67)} ${Y(49)}" fill="#fff" stroke="${INK}" stroke-width="${R(1.1)}" stroke-linecap="round"/>`;
  s += `<circle cx="${X(46)}" cy="${Y(45)}" r="${R(3)}" fill="#ffb3c6" opacity="0.7"/><circle cx="${X(74)}" cy="${Y(45)}" r="${R(3)}" fill="#ffb3c6" opacity="0.7"/>`;
  return s;
}
const BODY_PARTS = { hair: [60, 14], eye: [51, 37], ear: [82, 38], nose: [60, 43], mouth: [60, 51], neck: [60, 62], shoulder: [32, 78], elbow: [96, 104], hand: [20, 138], tummy: [60, 108], knee: [69, 174], foot: [48, 208], arm: [22, 112], leg: [51, 186], head: [72, 22] };
const FACE_PARTS = { hair: [60, 14], eyebrow: [69, 31], eye: [51, 37], ear: [38, 40], nose: [60, 43], mouth: [60, 51], cheek: [74, 45], chin: [60, 58] };

function makeMyBody(o, paper) {
  const rand = rng(+o.seed || 1);
  const kind = o.kind || 'body';
  const pages = [];
  if (kind === 'senses') {
    const senses = [['see', 'eyes', 'rainbow'], ['hear', 'ears', 'popper'], ['smell', 'nose', 'rose'], ['taste', 'tongue', 'strawberry'], ['touch', 'hands', 'bear']];
    const order = shuffle(senses.map((_, i) => i), rand);
    for (const answers of [false, true]) {
      if (answers && o.key === false) break;
      const pg = new Page(paper, answers ? 'My five senses: answers' : 'My five senses', { subtitle: answers ? 'Answer key for grown-ups.' : 'Read each sentence. Draw a line to the picture that matches.', noName: answers });
      const rh = (pg.room - 2) / 5;
      senses.forEach(([verb, part], i) => {
        const y = pg.y + i * rh, cy = y + rh / 2;
        pg.add(panel(pg.left, y + 2, pg.width * 0.62, rh - 4, TINTS[i], PALETTE[i], 6));
        pg.add(txt(pg.left + 6, cy - 2, `I ${verb}`, 7, { anchor: 'start', colour: PALETTE[i] }));
        pg.add(txt(pg.left + 6, cy + 7, `with my ${part}.`, 5, { anchor: 'start', font: FONT }));
        pg.add(`<circle cx="${pg.left + pg.width * 0.62 - 4}" cy="${cy}" r="2" fill="${INK}"/>`);
        const j = order[i], py = pg.y + j * rh + rh / 2, px = pg.right - rh / 2 + 2;
        pg.add(`<rect x="${px - rh / 2 + 3}" y="${pg.y + j * rh + 3}" width="${rh - 6}" height="${rh - 6}" rx="6" fill="#fff" stroke="#e2ddf2" stroke-width="0.6"/>`);
        pg.add(pic(ART(senses[i][2]), px, py, rh - 12));
        pg.add(`<circle cx="${px - rh / 2 + 1}" cy="${py}" r="2" fill="${INK}"/>`);
        if (answers) pg.add(`<line x1="${pg.left + pg.width * 0.62 - 4}" y1="${cy}" x2="${px - rh / 2 + 1}" y2="${py}" stroke="${PINK}" stroke-width="0.9"/>`);
      });
      pages.push(pg.svg());
    }
    return pages;
  }
  const face = kind === 'face';
  const table = face ? FACE_PARTS : BODY_PARTS;
  const names = face ? Object.keys(FACE_PARTS) : shuffle(Object.keys(BODY_PARTS), rand).slice(0, 12);
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const pg = new Page(paper, answers ? `${face ? 'My face' : 'My body'}: answers` : face ? 'Label my face' : 'Label my body', { subtitle: answers ? 'Answer key for grown-ups.' : 'Use the words in the box to label the picture.', noName: answers });
    // Word bank
    const bank = shuffle(names, rand);
    const perRow = bank.length > 8 ? Math.ceil(bank.length / 2) : bank.length, bRows = Math.ceil(bank.length / perRow);
    pg.add(panel(pg.left, pg.y, pg.width, 6 + bRows * 8, '#fff6e0', '#ffb938', 5));
    bank.forEach((w, i) => pg.add(txt(pg.left + pg.width * ((i % perRow) + 0.5) / perRow, pg.y + 9 + Math.floor(i / perRow) * 8, w, fitFont(w, 5, pg.width / perRow - 3, 0.5), { colour: PALETTE[i % PALETTE.length] })));
    pg.y += 12 + bRows * 8;
    const area = pg.room - 2;
    const fw = face ? 120 : 120, fh = face ? 70 : 225;
    const k = face ? Math.min((pg.width * 0.5) / 60, area / fh) : Math.min(area / fh, (pg.width * 0.46) / fw);
    // For the face we zoom into the head (x 30..90, y 5..65).
    const ox = face ? pg.w / 2 - 60 * k : pg.w / 2 - 60 * k, oy = face ? pg.y - 4 * k + (area - 60 * k) / 2 : pg.y + (area - fh * k) / 2;
    if (face) pg.add(`<defs><clipPath id="faceclip"><rect x="${ox + 24 * k}" y="${oy + 4 * k}" width="${72 * k}" height="${60 * k}"/></clipPath></defs><g clip-path="url(#faceclip)">${bodyFigure(ox, oy, k)}</g>`);
    else pg.add(bodyFigure(ox, oy, k));
    const pts = names.map((n) => [n, ox + table[n][0] * k, oy + table[n][1] * k]);
    const left = pts.filter((p) => p[1] < pg.w / 2 || (p[1] === pg.w / 2 && p[0].length % 2)).sort((a, b) => a[2] - b[2]);
    const right = pts.filter((p) => !left.includes(p)).sort((a, b) => a[2] - b[2]);
    const place = (list, side) => {
      const top = pg.y + 6, span = area - 12;
      list.forEach(([n, px, py], i) => {
        const by = list.length === 1 ? py : top + span * (i + 0.5) / list.length;
        const bw = 38, bx = side < 0 ? pg.left + 2 : pg.right - bw - 2;
        const ex = side < 0 ? bx + bw : bx;
        pg.add(`<line x1="${ex}" y1="${by}" x2="${px}" y2="${py}" stroke="#9a93b8" stroke-width="0.45"/><circle cx="${px}" cy="${py}" r="1.1" fill="${PINK}"/>`);
        pg.add(`<rect x="${bx}" y="${by - 5}" width="${bw}" height="10" rx="3" fill="#fff" stroke="#9a93b8" stroke-width="0.5"/>`);
        if (answers) pg.add(txt(bx + bw / 2, by + 1.8, n, 5, { colour: PINK }));
      });
    };
    place(left, -1); place(right, 1);
    pages.push(pg.svg());
  }
  return pages;
}

// ================================================================ domino maths
const PIPS = { 0: [], 1: [[0.5, 0.5]], 2: [[0.28, 0.28], [0.72, 0.72]], 3: [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]], 4: [[0.28, 0.28], [0.72, 0.28], [0.28, 0.72], [0.72, 0.72]], 5: [[0.25, 0.25], [0.75, 0.25], [0.5, 0.5], [0.25, 0.75], [0.75, 0.75]], 6: [[0.28, 0.22], [0.72, 0.22], [0.28, 0.5], [0.72, 0.5], [0.28, 0.78], [0.72, 0.78]] };
function domino(x, y, s, a, b, opts = {}) {
  const { fill = '#fff', pip = INK, hideB = false, ghost = false } = opts;
  let out = `<rect x="${x}" y="${y}" width="${s * 2}" height="${s}" rx="${s * 0.16}" fill="${fill}" stroke="${INK}" stroke-width="0.8"/><line x1="${x + s}" x2="${x + s}" y1="${y + s * 0.12}" y2="${y + s * 0.88}" stroke="${INK}" stroke-width="0.6"/>`;
  PIPS[a].forEach(([u, v]) => { out += `<circle cx="${x + u * s}" cy="${y + v * s}" r="${s * 0.085}" fill="${pip}"/>`; });
  if (!hideB || ghost) PIPS[b].forEach(([u, v]) => { out += `<circle cx="${x + s + u * s}" cy="${y + v * s}" r="${s * 0.085}" fill="${ghost ? PINK : pip}" opacity="${ghost ? 0.8 : 1}"/>`; });
  return out;
}

function makeDominoes(o, paper) {
  const rand = rng(+o.seed || 1);
  const kind = o.kind || 'add';
  const pages = [];
  if (kind === 'set') {
    const pg = new Page(paper, 'Domino set', { subtitle: 'A full double six set of 28 dominoes. Colour the backs, cut them out and play!', noName: true });
    const cols = 4, rows = 7, cw = pg.width / cols, ch = (pg.room - 2) / rows, s = Math.min(cw / 2.3, ch * 0.8);
    let i = 0;
    for (let a = 0; a <= 6; a++) for (let b = a; b <= 6; b++) {
      const x = pg.left + (i % cols) * cw + (cw - 2 * s) / 2, y = pg.y + Math.floor(i / cols) * ch + (ch - s) / 2;
      pg.add(`<rect x="${x - 1.5}" y="${y - 1.5}" width="${2 * s + 3}" height="${s + 3}" rx="${s * 0.2}" fill="none" stroke="#b9b3d6" stroke-width="0.4" stroke-dasharray="2 1.4"/>`);
      pg.add(domino(x, y, s, a, b, { fill: TINTS[i % TINTS.length] }));
      i++;
    }
    pages.push(pg.svg());
    return pages;
  }
  const max = +o.max === 9 ? 9 : 6;
  const items = [];
  for (let i = 0; i < 10; i++) {
    const a = Math.floor(rand() * (Math.min(max, 6) + 1)), b = Math.floor(rand() * (Math.min(max, 6) + 1));
    items.push(kind === 'missing' ? [a, Math.max(1, b)] : [a, b]);
  }
  for (const answers of [false, true]) {
    if (answers && o.key === false) break;
    const miss = kind === 'missing';
    const pg = new Page(paper, answers ? `Domino ${miss ? 'dots' : 'sums'}: answers` : miss ? 'Draw the missing dots' : 'Domino sums', { subtitle: answers ? 'Answer key for grown-ups.' : miss ? 'Each domino must add up to the number. Draw the missing dots on the empty side.' : 'Count the dots on each side. Write the sum and the answer.', noName: answers });
    const cols = 2, rows = 5, cw = pg.width / cols, ch = (pg.room - 2) / rows, s = Math.min(cw * 0.3, ch * 0.5);
    items.forEach(([a, b], i) => {
      const x = pg.left + (i % cols) * cw, y = pg.y + Math.floor(i / cols) * ch;
      pg.add(panel(x + 2, y + 2, cw - 4, ch - 4, TINTS[i % TINTS.length], '#e2ddf2', 6));
      const dx = x + 8, dy = y + (ch - s) / 2 - (miss ? 0 : 5);
      pg.add(domino(dx, dy, s, a, b, { hideB: miss, ghost: miss && answers }));
      if (miss) {
        pg.add(txt(x + 8 + 2 * s + 8, y + ch / 2 + 2, '=', 9, { anchor: 'start' }));
        pg.add(`<circle cx="${x + 8 + 2 * s + 26}" cy="${y + ch / 2}" r="8" fill="#fff" stroke="${PALETTE[i % PALETTE.length]}" stroke-width="1"/>` + txt(x + 8 + 2 * s + 26, y + ch / 2 + 3.2, a + b, 9, { colour: PALETTE[i % PALETTE.length] }));
      } else {
        const sy = y + ch - 8, bw = 11;
        let sx = x + 8;
        const put = (v) => { pg.add(blankBox(sx, sy - 7, bw, 9)); if (answers) pg.add(txt(sx + bw / 2, sy, v, 6, { colour: PINK })); sx += bw + 2; };
        put(a); pg.add(txt(sx + 2, sy, '+', 6)); sx += 6; put(b); pg.add(txt(sx + 2, sy, '=', 6)); sx += 6; put(a + b);
      }
    });
    pages.push(pg.svg());
  }
  return pages;
}

Object.assign(MAKERS, { secretcode: makeSecretCode, gridcopy: makeGridCopy, puppets: makePuppets, handprints: makeHandprints, heightchart: makeHeightChart, daysmonths: makeDaysMonths, mybody: makeMyBody, dominoes: makeDominoes });

;
// PrintPals packs: a personalised learning week, quick packs for busy moments,
// and a pack that keeps children close to family far away. Built from the other makers.

const PACK_THEMES = {
  animals: { label: 'Animals', line: ['elephant', 'giraffe', 'cat', 'owl', 'bunny', 'penguin', 'dog', 'frog'], draw: ['cat', 'owl', 'dog', 'bunny', 'frog', 'penguin'], words: ['LION', 'ZEBRA', 'TIGER', 'MONKEY', 'PANDA', 'HIPPO', 'CAMEL', 'SNAKE'] },
  space: { label: 'Space', line: ['rocket', 'robot', 'plane', 'rocket', 'robot'], draw: ['rocket', 'robot'], words: ['MOON', 'STAR', 'ROCKET', 'PLANET', 'COMET', 'SUN', 'ALIEN', 'ORBIT'] },
  sea: { label: 'Under the sea', line: ['whale', 'fish', 'octopus', 'turtle', 'boat'], draw: ['fish', 'penguin', 'frog'], words: ['FISH', 'CRAB', 'WHALE', 'SHELL', 'WAVE', 'BOAT', 'SHARK', 'SAND'] },
  go: { label: 'Things that go', line: ['train', 'car', 'plane', 'boat', 'rocket'], draw: ['rocket', 'robot'], words: ['CAR', 'BUS', 'TRAIN', 'PLANE', 'BOAT', 'BIKE', 'TRUCK', 'ROCKET'] },
  magic: { label: 'Magic and unicorns', line: ['unicorn', 'castle', 'butterfly', 'rainbow', 'icecream'], draw: ['unicorn', 'ladybird', 'bunny'], words: ['MAGIC', 'WAND', 'FAIRY', 'CASTLE', 'CROWN', 'STAR', 'WISH', 'DRAGON'] },
  garden: { label: 'Bugs and gardens', line: ['ladybird', 'bee', 'snail', 'butterfly', 'sunflower'], draw: ['ladybird', 'frog', 'owl'], words: ['BEE', 'ANT', 'SNAIL', 'WORM', 'LEAF', 'FLOWER', 'SEED', 'SLUG'] },
};
const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const RAINBOW_COLOURS = ['red', 'blue', 'yellow', 'green', 'orange', 'purple', 'pink'];

/** The age group a child's age falls into. */
function ageGroup(age) {
  const a = +age || 4;
  return a <= 3 ? 3 : a >= 6 ? 6 : a;
}

// Each activity: (ctx) => [maker id, options, short title, tip for grown-ups]
const CURRICULUM = {
  3: {
    words: [
      (c) => ['prewriting', { guide: 'thick', type: ['straight', 'wave', 'bumps', 'zigzag', 'loops'][c.day % 5] }, 'Pencil paths', 'Go along the first path with your finger together before using a pencil. Wobbly lines are perfect: this builds the hand control for writing.'],
      (c) => c.name ? ['names', { names: c.name, case: 'title', size: 'large' }, `Writing ${c.name}`, 'Say each letter as they trace it. Their own name is the most exciting word in the world to them.'] : ['letters', { letter: 'ABCDE'[c.day % 5], size: 'large' }, `Letter ${'ABCDE'[c.day % 5]}`, 'Say the sound the letter makes, not just its name.'],
      (c) => ['letters', { letter: c.letter(c.day), size: 'large' }, `Letter ${c.letter(c.day)}`, 'Say the letter sound together, then hunt for 3 things at home that start with it.'],
      (c) => ['colourwords', { kind: 'learn', colour: RAINBOW_COLOURS[c.day % 7] }, `The colour ${RAINBOW_COLOURS[c.day % 7]}`, 'Find things around the room in this colour. Point and say the word together.'],
      (c) => ['matching', { kind: 'shadow', pairs: '4' }, 'Match the shadow', 'Ask "which shadow is the same shape?" before they draw the line. Looking closely is an early reading skill.'],
    ],
    numbers: [
      (c) => ['numbers', { from: String(1 + (c.day % 5)), to: String(1 + (c.day % 5)), size: 'large' }, `Number ${1 + (c.day % 5)}`, 'Count real things too: spoons, toys or claps. Touch each one as you count.'],
      (c) => ['patterns', { kind: 'pictures', level: 'easy' }, 'What comes next?', 'Say the pattern out loud together, like a song: "apple, banana, apple, banana..."'],
      (c) => ['compare', { kind: 'pictures' }, 'Which has more?', 'Let them count both sides. The crocodile always eats the bigger number!'],
      (c) => ['shapes', { kind: 'trace' }, 'Shapes', 'Look for circles, squares and triangles around the house after the page is done.'],
      (c) => ['matching', { kind: 'count', pairs: '4' }, 'Count and match', 'Touch each picture as you count. Saying the last number tells you how many.'],
    ],
    fun: [
      (c) => ['colouring', { book: 'one', picture: c.pic(c.day), name: c.name }, 'Colouring', 'Ask them to tell you a story about their picture while they colour.'],
      (c) => ['mazes', { level: 'easy', per: '1', theme: 'mix' }, 'Maze', 'Let them trace the way with a finger first, then with a crayon.'],
      (c) => ['dots', { dots: '10', count: '1', puzzles: '1', layout: 'one' }, 'Dot to dot', 'Say each number out loud as they join the dots.'],
      (c) => ['oddone', { level: 'easy' }, 'Odd one out', 'Ask "why is that one different?" and let them explain in their own words.'],
      (c) => ['hunt', { theme: 'home' }, 'Treasure hunt', 'A reason to get moving! Tick things off together as you find them.'],
    ],
  },
  4: {
    words: [
      (c) => c.name ? ['names', { names: c.name, case: 'title', size: 'medium' }, `Writing ${c.name}`, 'Start at the green dot each time. Praise the tries, not only the neat ones.'] : ['letters', { letter: c.letter(c.day), size: 'large' }, `Letter ${c.letter(c.day)}`, 'Say the sound, then find it in a book.'],
      (c) => ['letters', { letter: c.letter(c.day), size: 'medium' }, `Letter ${c.letter(c.day)}`, 'Say the letter sound and hunt for things that start with it.'],
      (c) => ['cvc', { vowel: 'aeiou'[c.day % 5], activity: 'sound' }, 'Sound it out', 'Touch each dot and say the sounds slowly, then say them fast to hear the word pop out.'],
      (c) => ['rhyming', { kind: 'match' }, 'Rhyme time', 'Rhyming words sound the same at the end. Make up silly ones together: cat, hat, splat!'],
      (c) => ['syllables', { kind: 'count' }, 'Clap the beats', 'Clap each word together. Stamping or jumping the beats works too.'],
      (c) => ['abcorder', { kind: 'missing', case: 'lower' }, 'Missing letters', 'Sing the alphabet song slowly to find each missing letter.'],
    ],
    numbers: [
      (c) => ['numbers', { from: String(5 + (c.day % 6)), to: String(5 + (c.day % 6)), size: 'medium' }, `Number ${5 + (c.day % 6)}`, 'Count out that many real things: pasta, buttons or toy cars.'],
      (c) => ['patterns', { kind: 'pictures', level: 'medium' }, 'What comes next?', 'Say the pattern like a chant. The answer usually jumps out.'],
      (c) => ['bonds', { to: '5', missing: 'part', pictures: true }, 'Number bonds to 5', 'Use 5 real objects in two hands: "3 here, so how many there?"'],
      (c) => ['doubles', { kind: 'ladybird', max: '5' }, 'Ladybird doubles', 'Doubles are the same on both sides, like our two hands.'],
      (c) => ['dominoes', { kind: 'add' }, 'Domino sums', 'Count one side, then keep counting on from that number.'],
    ],
    fun: [
      (c) => ['colouring', { book: 'one', picture: c.pic(c.day), name: c.name }, 'Colouring', 'Colouring inside shapes builds strong fingers for writing.'],
      (c) => ['howtodraw', { picture: c.draw(c.day) }, 'How to draw', 'Do it side by side: you draw one too. Children love a grown-up who has a go.'],
      (c) => ['spotdiff', { level: 'easy' }, 'Spot the difference', 'Look at one part of the picture at a time, top to bottom.'],
      (c) => ['dots', { dots: '20', count: '1', puzzles: '1', layout: 'one' }, 'Dot to dot', 'Say each number as they join it. Guess the picture before it is finished!'],
      (c) => ['oddone', { level: 'medium' }, 'Odd one out', 'The best part is "why". Let them explain their thinking.'],
      (c) => ['rolldraw', { theme: 'monster', name: c.name }, 'Roll and draw', 'Play too! Roll the same and compare your silly monsters.'],
    ],
  },
  5: {
    words: [
      (c) => ['sight', { list: 'dolch-primer', count: '8', order: 'mix', size: 'big' }, 'Sight words', 'These words appear in every book. Spot them together at bedtime story time.'],
      (c) => ['cvc', { vowel: 'mix', activity: ['build', 'middle', 'first'][c.day % 3] }, 'Build the word', 'Say the word slowly and stretch it like chewing gum: c-a-t.'],
      (c) => ['families', { family: ['at', 'an', 'ig', 'op', 'ug', 'en'][c.day % 6] }, 'Word families', 'Change the first letter and read the new word. It feels like magic!'],
      (c) => ['sentences', { kind: 'fix' }, 'Fix the sentence', 'Every sentence starts with a capital letter and ends with a full stop.'],
      (c) => ['syllables', { kind: 'split' }, 'Break it into beats', 'Clap the word first, then write one beat in each box.'],
      (c) => ['position', { kind: 'circle' }, 'Where is it?', 'Play it for real afterwards: hide a teddy under, on and behind things.'],
    ],
    numbers: [
      (c) => ['maths', { op: 'add', within: '10', count: '10', layout: 'horizontal', pictures: true }, 'Adding to 10', 'Use fingers or small toys. Counting on from the bigger number is quicker.'],
      (c) => ['bonds', { to: '10', missing: 'part', pictures: true }, 'Number bonds to 10', 'Pairs that make 10 are a maths superpower. Try them with 10 fingers.'],
      (c) => ['clocks', { level: 'oclock', mode: 'read', style: 'words' }, 'O\'clock', 'Look at a real clock together at each o\'clock today.'],
      (c) => ['hundred', { kind: 'missing', level: 'easy' }, 'Hundred square', 'Numbers going down go up by 10 each time. Can they spot it?'],
      (c) => ['doubles', { kind: 'facts', max: '5' }, 'Doubles and halves', 'Halving is sharing fairly between two. Use snacks to check!'],
      (c) => ['numberlines', { kind: 'missing', range: '20' }, 'Number lines', 'Hop along the line with a finger, saying each number.'],
    ],
    fun: [
      (c) => ['wordsearch', { size: '8', level: 'easy', words: c.words.join('\n'), title: `${c.themeLabel} word search` }, 'Word search', 'Find the first letter of each word, then look around it.'],
      (c) => ['secretcode', { code: 'pictures' }, 'Secret code', 'Write them a secret coded note back afterwards. They will love it.'],
      (c) => ['sudoku', { size: '4', symbols: 'pictures', level: 'easy', pages: '1' }, 'Picture sudoku', 'Each row and column has every picture once. Start with the row missing just one.'],
      (c) => ['colournum', { mode: 'add' }, 'Colour by sums', 'Work out each sum first, then colour. A picture appears!'],
      (c) => ['howtodraw', { picture: c.draw(c.day) }, 'How to draw', 'Draw side by side. Talk about the shapes you use: circle, oval, triangle.'],
      (c) => ['gridcopy', { kind: 'half' }, 'Finish the half', 'Count the squares across from the middle line to find each one.'],
    ],
  },
  6: {
    words: [
      (c) => ['sight', { list: 'dolch-first', count: '12', order: 'mix', size: 'medium' }, 'Sight words', 'Read the words, then use each one in a silly sentence out loud.'],
      (c) => ['sentences', { kind: 'unscramble' }, 'Mixed up sentences', 'Find the word with the capital letter first: that one starts the sentence.'],
      (c) => ['storywriting', { layout: 'story', lines: 'big', prompt: ['dragon', 'seed', 'moon', 'cat', 'sea', 'puppy'][c.day % 6], name: c.name }, 'Story writing', 'Let them tell the story out loud first, then write. Spelling can wait: ideas come first.'],
      (c) => ['story', { text: 'small', answers: 'write', story: ['balloon', 'kitten', 'picnic', 'rocket', 'turtle', 'beach'][c.day % 6], name: c.name }, 'Read and answer', 'Take turns reading a line each. Point to the words as you read.'],
      (c) => ['sounds', { set: 'blends' }, 'Blends', 'Two letters, two sounds squished together: s-t, st!'],
      (c) => ['spelling', { words: c.words.slice(0, 6).join('\n').toLowerCase(), size: 'medium', title: `${c.themeLabel} words` }, 'Spelling', 'Look, say, cover, write, check. Then use the word in a sentence.'],
    ],
    numbers: [
      (c) => ['maths', { op: 'mix', within: '20', count: '20', layout: 'horizontal', pictures: false }, 'Adding and taking away', 'For take away, start at the big number and count back.'],
      (c) => ['wordproblems', { op: 'add', within: '20', count: '6', theme: 'mix', pictures: true, names: c.name }, 'Story sums', 'Read the story, then draw it. A quick picture makes the answer easy to see.'],
      (c) => ['times', { mode: 'practice', count: '20', t1: false, t2: true, t3: false, t4: false, t5: true, t6: false, t7: false, t8: false, t9: false, t10: true, t11: false, t12: false, missing: false, certificate: false, name: c.name }, 'Times tables', 'Count in 2s, 5s and 10s out loud while jumping or clapping.'],
      (c) => ['clocks', { level: 'half', mode: 'mix', style: 'words' }, 'Half past', 'Half past means the big hand points down to the 6.'],
      (c) => ['placevalue', { kind: 'count', range: 'to50' }, 'Tens and ones', 'Bundle real straws or pasta into tens to see it for real.'],
      (c) => ['fractions', { kind: 'colour', level: 'halves' }, 'Fractions', 'Cut a real sandwich or pizza into halves and quarters at lunch.'],
    ],
    fun: [
      (c) => ['wordsearch', { size: '10', level: 'medium', words: c.words.join('\n'), title: `${c.themeLabel} word search` }, 'Word search', 'Words can go across and down. Look for unusual letters first.'],
      (c) => ['secretcode', { code: 'numbers' }, 'Number code', 'A is 1, B is 2... Crack the message, then write one back.'],
      (c) => ['sudoku', { size: '4', symbols: 'numbers', level: 'medium', pages: '1' }, 'Sudoku', 'Every row, column and box needs 1, 2, 3 and 4.'],
      (c) => ['mazes', { level: 'hard', per: '1', theme: 'mix' }, 'Maze', 'Hard mazes: it is fine to start from the end and work backwards!'],
      (c) => ['gridcopy', { kind: 'copy' }, 'Copy the picture', 'Use the letters and numbers like a map to find each square.'],
      (c) => ['rolldraw', { theme: 'robot', name: c.name }, 'Roll and draw', 'Everyone rolls and draws, then give your robots names!'],
    ],
  },
};

/** Runs another maker and returns its first worksheet (portrait) and its answer page. */
function packRun(id, opts, paper, seed, all) {
  if (!MAKERS[id]) return { sheets: [], key: null };
  let pages = [];
  try { pages = MAKERS[id]({ seed, ...opts }, paper) || []; } catch (e) { return { sheets: [], key: null }; }
  const isKey = (s) => /Answer key for grown-ups|: answers?<\/text>/.test(s);
  const ok = pages.filter((s) => !isKey(s) && !/data-orient="landscape"/.test(s));
  return { sheets: all ? ok : ok.slice(0, 1), key: pages.find(isKey) || null };
}

/** Adds a small coloured label in the top corner of a finished page. */
function packBadge(svg, label, colour) {
  const w = +(/data-w="([\d.]+)"/.exec(svg) || [0, 210])[1];
  const bw = Math.max(20, label.length * 2.2 + 8);
  const g = `<g><rect x="${w - 13 - bw}" y="3.2" width="${bw}" height="6.6" rx="3.3" fill="${colour}"/><text x="${w - 13 - bw / 2}" y="7.8" text-anchor="middle" font-family="${TITLE_FONT}" font-weight="800" font-size="3.8" fill="#fff">${esc(label)}</text></g>`;
  return svg.replace(/<\/svg>$/, `${g}</svg>`);
}

function packCover(paper, title, sub, lineArt, extra, tint) {
  const pg = new Page(paper, '', { bare: true, tint: tint || '#fffdf8' });
  const cx = pg.w / 2;
  pg.add(`<rect x="${pg.left - 3}" y="${pg.m - 3}" width="${pg.width + 6}" height="${pg.bottom - pg.m + 3}" rx="10" fill="#fff" stroke="#ffb938" stroke-width="1.2"/>`);
  pg.add(`<rect x="${pg.left}" y="${pg.m}" width="${pg.width}" height="${pg.bottom - pg.m - 3}" rx="8" fill="none" stroke="#ffd98a" stroke-width="0.5" stroke-dasharray="2 1.6"/>`);
  ['star', 'heart', 'rainbow', 'sun'].forEach((a, i) => pg.add(pic(ART(a), i % 2 ? pg.right - 10 : pg.left + 10, i < 2 ? pg.m + 10 : pg.bottom - 13, 14)));
  const lines = wrap(title, 16);
  let y = pg.m + 34;
  lines.forEach((l) => { bubbleText(pg, l, cx, y, pg.width - 30, 20); y += 20; });
  pg.add(txt(cx, y + 2, sub, 6, { colour: '#8a3fd1' }));
  const size = Math.min(pg.width - 40, pg.bottom - y - 70);
  pg.add(`<g transform="translate(${cx - size / 2} ${y + 10}) scale(${(size / 200).toFixed(4)})">${colouringArt(lineArt)}</g>`);
  const ly = pg.bottom - 38;
  (extra || []).forEach((l, i) => pg.add(txt(cx, ly + i * 7, l, 4.6, { font: FONT, colour: SOFT })));
  pg.add(txt(pg.left + 12, pg.bottom - 16, 'This pack belongs to', 4.6, { anchor: 'start', font: FONT }) + `<line x1="${pg.left + 56}" x2="${pg.right - 12}" y1="${pg.bottom - 15.4}" y2="${pg.bottom - 15.4}" stroke="#b9b3d6" stroke-width="0.4"/>`);
  pg.footer = () => {};
  return pg.svg();
}

function packTracker(paper, name, days, titles) {
  const pg = new Page(paper, name ? `${possessive(name)} star chart` : 'My star chart', { subtitle: 'Colour a star every time you finish a page. Fill every star to earn your certificate!' });
  const rh = Math.min(34, (pg.room - 30) / days.length);
  days.forEach((d, i) => {
    const y = pg.y + i * rh, c = i % PALETTE.length;
    pg.add(panel(pg.left, y + 1.5, pg.width, rh - 3, TINTS[c], PALETTE[c], 6));
    pg.add(txt(pg.left + 6, y + rh / 2 + 2, d, 6, { anchor: 'start', colour: PALETTE[c] }));
    const items = titles[i], cw = (pg.width - 46) / Math.max(1, items.length);
    items.forEach((t, k) => {
      const cx = pg.left + 44 + cw * (k + 0.5);
      pg.add(`<path d="${starPath(cx, y + rh / 2 - 3, Math.min(8, rh * 0.26), 0.46)}" fill="#fff" stroke="${PALETTE[c]}" stroke-width="0.8" stroke-linejoin="round"/>`);
      pg.add(txt(cx, y + rh - 5, t, fitFont(t, 3.6, cw - 4, 0.5), { font: FONT, colour: INK }));
    });
  });
  const by = pg.bottom - 22;
  pg.add(panel(pg.left, by, pg.width, 20, '#fff6e0', '#ffb938', 6) + pic(ART('present'), pg.left + 12, by + 10, 14));
  pg.add(txt(pg.left + 24, by + 12, 'When my stars are full, my treat is', 5, { anchor: 'start', font: FONT }) + `<line x1="${pg.left + 110}" x2="${pg.right - 8}" y1="${by + 12.6}" y2="${by + 12.6}" stroke="#b9b3d6" stroke-width="0.4"/>`);
  return pg.svg();
}

function packGuide(paper, name, ageText, plan) {
  const pg = new Page(paper, 'Grown-up guide', { subtitle: `A plan for ${name || 'your child'} (${ageText}). About 10 to 15 minutes a day is plenty.`, noName: true });
  const intro = ['Little and often beats long sessions. Stop while it is still fun.', 'Sit beside them, talk out loud, and praise effort: "you kept trying!"', 'Too hard? Do it together. Too easy? Every sheet has a Harder button at printpals.web.app.'];
  intro.forEach((l, i) => pg.add(pic(ART(['heart', 'star', 'sun'][i]), pg.left + 3, pg.y + i * 6.4 - 1.3, 5) + txt(pg.left + 8, pg.y + i * 6.4, l, 4, { anchor: 'start', font: FONT, weight: 700 })));
  pg.y += 3 * 6.4 + 3;
  // Each page: its name in bold on one line, the tip below. The size shrinks only if a long pack needs it.
  const room = pg.room - 4;
  const fit = (fs) => plan.reduce((h, d) => h + fs * 1.6 + 2 + d.items.reduce((a, it) => a + fs * 1.35 + wrap(it.tip, Math.floor((pg.width - 8) / (fs * 0.5))).length * fs * 1.3 + 1.2, 0) + 2, 0);
  let fs = 4.6;
  while (fs > 2.8 && fit(fs) > room) fs -= 0.1;
  plan.forEach((d, i) => {
    const c = PALETTE[i % PALETTE.length];
    pg.add(`<rect x="${pg.left}" y="${pg.y}" width="${pg.width}" height="${fs * 1.6}" rx="${fs * 0.8}" fill="${TINTS[i % TINTS.length]}"/>` + txt(pg.left + 4, pg.y + fs * 1.15, d.day, fs * 1.1, { anchor: 'start', colour: c }));
    pg.y += fs * 1.6 + 2;
    d.items.forEach((it) => {
      pg.add(txt(pg.left + 4, pg.y + fs, it.title, fs, { anchor: 'start', colour: INK }));
      pg.y += fs * 1.35;
      const lines = wrap(it.tip, Math.floor((pg.width - 8) / (fs * 0.5)));
      lines.forEach((l, k) => pg.add(txt(pg.left + 4, pg.y + fs * 0.95 + k * fs * 1.3, l, fs, { anchor: 'start', font: FONT, weight: 600, colour: '#5d5680' })));
      pg.y += lines.length * fs * 1.3 + 1.2;
    });
    pg.y += 2;
  });
  return pg.svg();
}

function packCertificate(paper, name, line) {
  const pg = new Page(paper, '', { bare: true, tint: '#fffaf0' });
  const cx = pg.w / 2;
  pg.add(`<rect x="${pg.left}" y="${pg.m}" width="${pg.width}" height="${pg.bottom - pg.m}" rx="10" fill="#fff" stroke="#ffb938" stroke-width="2"/>`);
  pg.add(`<rect x="${pg.left + 5}" y="${pg.m + 5}" width="${pg.width - 10}" height="${pg.bottom - pg.m - 10}" rx="7" fill="none" stroke="#ff7eb6" stroke-width="0.6" stroke-dasharray="2.4 1.6"/>`);
  for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2; pg.add(`<path d="${starPath(cx + Math.cos(a) * 62, pg.m + 78 + Math.sin(a) * 50, 3.2, 0.45)}" fill="${PALETTE[i % PALETTE.length]}"/>`); }
  pg.add(pic(ART('medal'), cx, pg.m + 76, 60));
  pg.add(txt(cx, pg.m + 146, 'Well done,', 12, { colour: '#8a3fd1' }));
  bubbleText(pg, name || 'Superstar', cx, pg.m + 172, pg.width - 40, 26);
  wrap(line, 34).forEach((l, i) => pg.add(txt(cx, pg.m + 196 + i * 9, l, 7, { colour: INK })));
  const ly = pg.bottom - 26;
  pg.add(txt(pg.left + 20, ly, 'Signed', 4.6, { anchor: 'start', font: FONT, colour: SOFT }) + `<line x1="${pg.left + 38}" x2="${cx - 8}" y1="${ly + 0.6}" y2="${ly + 0.6}" stroke="#b9b3d6" stroke-width="0.4"/>`);
  pg.add(txt(cx + 8, ly, 'Date', 4.6, { anchor: 'start', font: FONT, colour: SOFT }) + `<line x1="${cx + 22}" x2="${pg.right - 20}" y1="${ly + 0.6}" y2="${ly + 0.6}" stroke="#b9b3d6" stroke-width="0.4"/>`);
  pg.footer = () => {};
  return pg.svg();
}

/** Reads "Leo 6" style lines into children. */
function packChildren(o) {
  const kids = [{ name: nameOf(o.name, ''), age: +o.age || 4 }];
  listOf(o.siblings, 3).forEach((l) => {
    const m = /^(.*?)[\s,:.-]*(\d{1,2})\s*$/.exec(l);
    if (m && m[1].trim()) kids.push({ name: nameOf(m[1], ''), age: +m[2] });
    else if (l.trim()) kids.push({ name: nameOf(l, ''), age: kids[0].age });
  });
  return kids;
}

function packCtx(child, theme, day, rand) {
  const letters = (child.name ? child.name.toUpperCase().replace(/[^A-Z]/g, '') : '') + 'SATPIN';
  const uniq = [...new Set(letters)];
  return {
    name: child.name, day, themeLabel: theme.label, words: theme.words,
    letter: (d) => uniq[d % uniq.length],
    pic: (d) => theme.line[d % theme.line.length],
    draw: (d) => theme.draw[d % theme.draw.length],
    rand,
  };
}

function makePack(o, paper) {
  const rand = rng(+o.seed || 1);
  const theme = PACK_THEMES[o.theme] || PACK_THEMES.animals;
  const days = Math.max(1, Math.min(5, +o.days || 5));
  const per = Math.max(1, Math.min(3, +o.per || 2));
  const pages = [];
  packChildren(o).forEach((child, ci) => {
    const group = ageGroup(child.age), cur = CURRICULUM[group];
    const areas = ['words', 'numbers', 'fun'].slice(0, per === 1 ? 3 : 3);
    const titles = [], plan = [], keys = [], sheets = [];
    const dayNames = [];
    const offset = Math.floor(rand() * 6);
    for (let d = 0; d < days; d++) {
      const ctx = packCtx(child, theme, d + offset, rand);
      const dayLabel = `Day ${d + 1}`;
      dayNames.push(dayLabel);
      const today = [], tips = [];
      // One page from each area, rotating which areas come first so every day feels different.
      const order = per === 3 ? areas : per === 2 ? (d % 3 === 0 ? ['words', 'numbers'] : d % 3 === 1 ? ['numbers', 'fun'] : ['words', 'fun']) : [areas[d % 3]];
      order.forEach((area, k) => {
        const list = cur[area];
        const [id, opts, title, tip] = list[(d + offset + k * 2) % list.length](ctx);
        const res = packRun(id, { key: true, ...opts }, paper, (+o.seed || 1) + d * 97 + k * 13 + ci * 1009);
        if (!res.sheets.length) return;
        sheets.push(packBadge(res.sheets[0], child.name ? `${child.name}, ${dayLabel}` : dayLabel, PALETTE[d % PALETTE.length]));
        if (res.key) keys.push(packBadge(res.key, `Answers: ${dayLabel}`, SOFT));
        today.push(title); tips.push({ title, tip });
      });
      titles.push(today); plan.push({ day: dayLabel, items: tips });
    }
    const ageText = group === 3 ? 'ages 3 to 4' : group === 6 ? 'ages 6 to 8' : `ages ${group} to ${group + 1}`;
    const who = child.name ? `${possessive(child.name)}` : 'My';
    if (o.cover !== false) pages.push(packCover(paper, `${who} learning week`, `${theme.label}, ${ageText}`, theme.line[(offset + ci) % theme.line.length], ['One day at a time. Colour a star for every page you finish!', 'Made free at printpals.web.app'], TINTS[ci % TINTS.length]));
    if (o.stars !== false) pages.push(packTracker(paper, child.name, dayNames, titles));
    pages.push(...sheets);
    if (o.certificate !== false) pages.push(packCertificate(paper, child.name, `You finished your whole learning week! We are so proud of you.`));
    if (o.guide !== false) pages.push(packGuide(paper, child.name, ageText, plan));
    if (o.key !== false) pages.push(...keys);
  });
  return pages;
}

// ================================================================ quick packs for busy moments
const QUICK = {
  waiting: { title: 'Busy quiet pack', sub: 'For restaurants, waiting rooms and quiet times', art: 'owl',
    list: (g) => [['mazes', { level: g <= 4 ? 'easy' : 'medium', per: g <= 4 ? '1' : '2', theme: 'mix' }], ['dots', { dots: g <= 3 ? '10' : g <= 5 ? '20' : '30', count: '1', puzzles: '1', layout: 'one' }], g <= 4 ? ['matching', { kind: 'shadow', pairs: '4' }] : ['secretcode', { code: g <= 5 ? 'pictures' : 'numbers' }], ['oddone', { level: g <= 3 ? 'easy' : g <= 5 ? 'medium' : 'hard' }], ['spotdiff', { level: g <= 4 ? 'easy' : 'medium' }], ['colouring', { book: 'one', picture: 'owl' }]] },
  rainy: { title: 'Rainy day pack', sub: 'Crafts and games for a day indoors', art: 'snail',
    list: (g) => [['puppets', { style: 'colour' }], ['rolldraw', { theme: g <= 4 ? 'monster' : 'robot' }], ['howtodraw', { picture: 'frog' }], ['snakes', { extras: true }, true], ['hunt', { theme: 'home' }], ['doorhangers', { set: 'play', style: 'colour' }]] },
  sick: { title: 'Cosy sick day pack', sub: 'Gentle, calm things to do in bed', art: 'teddy',
    list: (g) => [['colouring', { book: 'one', picture: 'teddy' }], ['dots', { dots: g <= 3 ? '10' : '20', count: '1', puzzles: '1', layout: 'one' }], ['story', { text: g <= 4 ? 'big' : 'small', answers: 'tick', story: 'teddy' }], ['gridcopy', { kind: 'half' }], ['spotdiff', { level: 'easy' }], ['feelings', { faces: 'colour', chart: true, week: false, calm: true }]] },
  bedtime: { title: 'Calm before bed pack', sub: 'Slow, soothing pages to wind down', art: 'owl',
    list: (g) => [['colouring', { book: 'one', picture: 'owl' }], ['prewriting', { guide: 'dots', type: 'loops' }], ['gridcopy', { kind: 'half' }], ['feelings', { faces: 'colour-in', chart: true, week: false, calm: true }], ['routine', { routine: 'bedtime', layout: 'cards' }]] },
  outside: { title: 'Outdoor adventure pack', sub: 'Get outside and explore', art: 'butterfly',
    list: (g) => [['hunt', { theme: 'park' }], ['hunt', { theme: 'colours' }], ['weather', { week: true, month: false }], ['lifecycle', { cycle: 'plant', kind: 'learn' }], ['challenge', { theme: 'outdoors', days: '14' }]] },
};

function makeQuickPack(o, paper) {
  const q = QUICK[o.occasion] || QUICK.waiting;
  const name = nameOf(o.name, '');
  const g = ageGroup(o.age);
  const pages = [];
  if (o.cover !== false) pages.push(packCover(paper, name ? `${possessive(name)} ${q.title.toLowerCase()}` : q.title, q.sub, q.art, ['Pick any page you like. There is no wrong order!', 'Made free at printpals.web.app']));
  const keys = [];
  q.list(g).forEach(([id, opts, all], i) => {
    const res = packRun(id, { key: true, name, ...opts }, paper, (+o.seed || 1) + i * 131, all);
    res.sheets.forEach((s) => pages.push(packBadge(s, `${i + 1}`, PALETTE[i % PALETTE.length])));
    if (res.key) keys.push(res.key);
  });
  if (o.key !== false) pages.push(...keys);
  return pages;
}

// ================================================================ family far away
const CALL_BINGO = [['👋', 'Someone waves'], ['❤️', 'Someone says "I love you"'], ['😂', 'Someone laughs'], ['🐶', 'You see a pet'], ['🎩', 'Someone wears a hat'], ['🍰', 'Someone eats or drinks'],
  ['🎨', 'You show a drawing'], ['🎵', 'Someone sings'], ['😘', 'Someone blows a kiss'], ['🌻', 'You see a plant'], ['🧸', 'Someone shows a toy'], ['☀️', 'You talk about the weather'],
  ['📚', 'Someone asks about school'], ['🤪', 'Someone pulls a funny face'], ['👕', 'Someone wears blue'], ['🌙', 'You say goodnight or good morning']];
const INTERVIEW = ['What was your favourite toy when you were little?', 'What games did you play with your friends?', 'What food do you love the most?', 'What made you laugh when you were my age?',
  'What was your school like?', 'What is your favourite song? Can you sing it?', 'What is one thing you love about me?', 'If you could go anywhere with me, where would we go?'];

function makeFarAway(o, paper) {
  const rand = rng(+o.seed || 1);
  const kind = o.kind || 'all';
  const who = String(o.family || '').trim().slice(0, 24) || 'Grandma';
  const name = nameOf(o.name, '');
  const me = name || 'me';
  const pages = [];
  const want = (k) => kind === 'all' || kind === k;

  if (want('postcards')) {
    const pg = new Page(paper, `Postcards for ${who}`, { subtitle: `Draw on the front and write on the back. Take a photo and send it to ${who}, or post it!`, noName: true });
    const h = (pg.room - 10) / 2;
    [0, 1].forEach((k) => {
      const y = pg.y + k * (h + 10);
      // Front
      const fw = pg.width / 2 - 3;
      pg.add(`<rect x="${pg.left}" y="${y}" width="${fw}" height="${h}" rx="4" fill="#fff" stroke="${INK}" stroke-width="0.6"/>`);
      pg.add(txt(pg.left + fw / 2, y + 12, k ? `I miss you, ${who}!` : `Hello from ${name || 'me'}!`, fitFont(k ? `I miss you, ${who}!` : `Hello from ${name || 'me'}!`, 7, fw - 10), { colour: PALETTE[k * 4] }));
      pg.add(`<rect x="${pg.left + 6}" y="${y + 17}" width="${fw - 12}" height="${h - 24}" rx="3" fill="${TINTS[k * 4]}" stroke="#d9d4ec" stroke-width="0.5" stroke-dasharray="2 1.4"/>`);
      pg.add(txt(pg.left + fw / 2, y + h / 2 + 6, 'Draw something for them here', 4, { font: FONT, colour: SOFT }));
      pg.add(pic(ART(k ? 'heart' : 'sun'), pg.left + fw - 12, y + h - 13, 12));
      // Back
      const bx = pg.left + fw + 6;
      pg.add(`<rect x="${bx}" y="${y}" width="${fw}" height="${h}" rx="4" fill="#fff" stroke="${INK}" stroke-width="0.6"/>`);
      pg.add(`<rect x="${bx + fw - 26}" y="${y + 6}" width="20" height="24" rx="1.5" fill="#fff" stroke="${PALETTE[k * 3 + 1]}" stroke-width="0.7" stroke-dasharray="1.4 1"/>` + txt(bx + fw - 16, y + 20, 'stamp', 3.4, { font: FONT, colour: SOFT }));
      pg.add(txt(bx + 6, y + 14, `Dear ${who},`, 6, { anchor: 'start', colour: INK }));
      for (let l = 0; l < 6; l++) pg.add(`<line x1="${bx + 6}" x2="${bx + fw - (l < 1 ? 30 : 6)}" y1="${y + 26 + l * ((h - 44) / 5)}" y2="${y + 26 + l * ((h - 44) / 5)}" stroke="#c9c3e3" stroke-width="0.4"/>`);
      pg.add(txt(bx + 6, y + h - 7, `Love from ${me} ❤`, 5, { anchor: 'start', colour: '#e0457b' }));
    });
    pg.add(`<line x1="${pg.left}" x2="${pg.right}" y1="${pg.y + h + 5}" y2="${pg.y + h + 5}" stroke="#b9b3d6" stroke-width="0.35" stroke-dasharray="2.2 1.6"/>`);
    pages.push(pg.svg());
  }

  if (want('bingo')) {
    const pg = new Page(paper, 'Video call bingo', { subtitle: `Play while you talk to ${who}! Cross off each thing when it happens. Shout BINGO for a whole line.` });
    const items = shuffle(CALL_BINGO, rand).slice(0, 9);
    const size = Math.min(pg.width, pg.room - 30), cell = size / 3, gx = pg.left + (pg.width - size) / 2;
    items.forEach(([e, t], i) => {
      const x = gx + (i % 3) * cell, y = pg.y + Math.floor(i / 3) * cell;
      pg.add(`<rect x="${x + 1.5}" y="${y + 1.5}" width="${cell - 3}" height="${cell - 3}" rx="6" fill="${TINTS[i % TINTS.length]}" stroke="${PALETTE[i % PALETTE.length]}" stroke-width="0.8"/>`);
      pg.add(emoji(e, x + cell / 2, y + cell * 0.4, cell * 0.36));
      wrap(t, 16).forEach((l, k) => pg.add(txt(x + cell / 2, y + cell * 0.74 + k * 5.4, l, 4.4, { font: FONT, colour: INK })));
    });
    const by = pg.y + size + 8;
    pg.add(panel(pg.left, by, pg.width, 16, '#fff0f5', '#ff7eb6', 6) + txt(pg.w / 2, by + 10, `Something I want to tell ${who} today:`, 5, { font: FONT, colour: '#e0457b' }));
    pages.push(pg.svg());
  }

  if (want('interview')) {
    const pg = new Page(paper, `Interview ${who}`, { subtitle: `Ask ${who} these questions on your next call. Write or draw the answers.` });
    const qs = shuffle(INTERVIEW, rand).slice(0, 6);
    const rh = (pg.room - 44) / qs.length;
    qs.forEach((q, i) => {
      const y = pg.y + i * rh;
      pg.add(`<circle cx="${pg.left + 4}" cy="${y + 4}" r="3.6" fill="${PALETTE[i % PALETTE.length]}"/>` + txt(pg.left + 4, y + 5.5, i + 1, 4, { colour: '#fff' }));
      pg.add(txt(pg.left + 11, y + 5.6, q, fitFont(q, 5, pg.width - 14, 0.5), { anchor: 'start', font: FONT, colour: INK }));
      for (let l = 1; l <= 2; l++) pg.add(`<line x1="${pg.left + 11}" x2="${pg.right}" y1="${y + 6 + l * (rh - 9) / 2}" y2="${y + 6 + l * (rh - 9) / 2}" stroke="#c9c3e3" stroke-width="0.4"/>`);
    });
    const by = pg.y + qs.length * rh + 2;
    pg.add(`<rect x="${pg.left}" y="${by}" width="${pg.width}" height="40" rx="6" fill="#fffdf5" stroke="#ffb938" stroke-width="0.7" stroke-dasharray="2.4 1.6"/>` + txt(pg.left + 5, by + 7, `Draw ${who} here`, 4.6, { anchor: 'start', font: FONT, colour: SOFT }));
    pages.push(pg.svg());
  }

  if (want('news')) {
    const pg = new Page(paper, `${name ? possessive(name) : 'My'} news for ${who}`, { subtitle: `Fill it in, then take a photo and send it to ${who}. They will love it!`, noName: true });
    const boxes = [['This week I...', '#ff6b6b'], ['My favourite thing was...', '#ffb938'], ['I learned how to...', '#3fbfa8'], ['Next week I can\'t wait to...', '#6c8cff']];
    const cw = pg.width / 2, bh = (pg.room - 70) / 2;
    boxes.forEach(([t, c], i) => {
      const x = pg.left + (i % 2) * cw, y = pg.y + Math.floor(i / 2) * bh;
      pg.add(panel(x + 1.5, y + 1.5, cw - 3, bh - 3, TINTS[i * 2 % TINTS.length], c, 6) + txt(x + 7, y + 10, t, 5, { anchor: 'start', colour: c }));
      for (let l = 1; l <= 4; l++) { const ly = y + 10 + l * (bh - 16) / 4.4; if (ly < y + bh - 5) pg.add(`<line x1="${x + 7}" x2="${x + cw - 7}" y1="${ly}" y2="${ly}" stroke="#c9c3e3" stroke-width="0.4"/>`); }
    });
    const py = pg.y + 2 * bh + 3;
    pg.add(`<rect x="${pg.left}" y="${py}" width="${pg.width}" height="${pg.bottom - py - 12}" rx="6" fill="#fff" stroke="${INK}" stroke-width="0.6" stroke-dasharray="3 2"/>` + txt(pg.left + 5, py + 7, 'A picture of my week', 4.6, { anchor: 'start', font: FONT, colour: SOFT }));
    pg.add(txt(pg.right, pg.bottom - 4, `Love from ${me} ❤`, 6, { anchor: 'end', colour: '#e0457b' }));
    pages.push(pg.svg());
  }

  if (want('countdown')) {
    const n = Math.max(3, Math.min(30, +o.days || 14));
    const pg = new Page(paper, `Days until I see ${who}!`, { subtitle: 'Colour one circle every night before bed. When you reach the heart, it is time for a big hug!' });
    const cols = n <= 10 ? 5 : n <= 21 ? 6 : 7;
    const rows = Math.ceil((n + 1) / cols);
    const cell = Math.min(pg.width / cols, (pg.room - 30) / rows);
    const gx = pg.left + (pg.width - cell * cols) / 2;
    const pos = (i) => { const r = Math.floor(i / cols), c = r % 2 ? cols - 1 - (i % cols) : i % cols; return [gx + c * cell + cell / 2, pg.y + r * cell + cell / 2]; };
    for (let i = 0; i < n; i++) {
      const [x1, y1] = pos(i), [x2, y2] = pos(i + 1);
      pg.add(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#e2ddf2" stroke-width="2.4" stroke-linecap="round"/>`);
    }
    for (let i = 0; i < n; i++) {
      const [x, y] = pos(i);
      pg.add(`<circle cx="${x}" cy="${y}" r="${cell * 0.36}" fill="#fff" stroke="${PALETTE[i % PALETTE.length]}" stroke-width="1"/>` + txt(x, y + cell * 0.12, n - i, cell * 0.32, { colour: PALETTE[i % PALETTE.length] }));
    }
    const [hx, hy] = pos(n);
    pg.add(pic(ART('heart'), hx, hy, cell * 0.9));
    const by = pg.y + rows * cell + 6;
    pg.add(txt(pg.w / 2, by + 6, `When I see ${who}, the first thing I will do is`, 5, { font: FONT }) + `<line x1="${pg.left + 20}" x2="${pg.right - 20}" y1="${by + 18}" y2="${by + 18}" stroke="#b9b3d6" stroke-width="0.4"/>`);
    pages.push(pg.svg());
  }
  return pages;
}

Object.assign(MAKERS, { pack: makePack, quickpack: makeQuickPack, faraway: makeFarAway });

;
// PrintPals: connects a tool page's form to its worksheet maker.
(function () {
  const form = document.getElementById('maker');
  if (!form) return;
  const tool = form.dataset.tool;
  const preview = document.getElementById('preview');
  const count = document.getElementById('pageCount');
  let seed = Math.floor(Math.random() * 1e9);

  function paper() {
    const saved = (() => { try { return localStorage.getItem('pp-paper'); } catch { return null; } })();
    const sel = form.querySelector('[name=paper]');
    if (sel && !sel.dataset.ready) {
      sel.dataset.ready = '1';
      if (saved) sel.value = saved;
      else if (/^en-(US|CA)|es-(US|MX)/.test(navigator.language)) sel.value = 'letter';
    }
    return sel ? sel.value : 'a4';
  }

  function values() {
    const o = { seed };
    for (const el of form.elements) {
      if (!el.name || el.name === 'paper') continue;
      if (el.type === 'checkbox') o[el.name] = el.checked;
      else if (el.type === 'radio') { if (el.checked) o[el.name] = el.value; }
      else o[el.name] = el.value;
    }
    return o;
  }

  const store = { get: (k) => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch {} } };

  // Ink saver: white backgrounds and grey pictures, for black and white printers and pricey ink.
  const inkBox = form.querySelector('[name=inksaver]');
  if (inkBox) { inkBox.checked = store.get('pp-ink') === '1'; inkBox.addEventListener('change', () => store.set('pp-ink', inkBox.checked ? '1' : '0')); }
  function lum(hex) {
    const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex || '');
    if (!m) return null;
    let h = m[1]; if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  const INK_FILTER = '<defs><filter id="pp-ink"><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="linear" slope="0.6" intercept="0.4"/><feFuncG type="linear" slope="0.6" intercept="0.4"/><feFuncB type="linear" slope="0.6" intercept="0.4"/></feComponentTransfer></filter></defs>';
  function inkSave(svg) {
    svg.querySelectorAll('rect[fill], circle[fill], ellipse[fill], path[fill], polygon[fill]').forEach((el) => {
      const L = lum(el.getAttribute('fill'));
      if (L !== null && L > 0.8 && L < 1) el.setAttribute('fill', '#fff');
    });
    svg.insertAdjacentHTML('afterbegin', INK_FILTER);
    svg.querySelectorAll('image').forEach((im) => im.setAttribute('filter', 'url(#pp-ink)'));
    svg.querySelectorAll('text').forEach((t) => { if (/Emoji/.test(t.getAttribute('font-family') || '')) t.setAttribute('filter', 'url(#pp-ink)'); });
  }

  // Remember my child: the name is kept on this device only, so every sheet is ready personalised.
  const nameBox = form.querySelector('input[name=name]');
  const namesBox = form.querySelector('textarea[name=names]');
  const kept = store.get('pp-child') || '';
  // Only replaces an empty box or our example name, never something a grown-up typed.
  const untouched = (el) => !el.value.trim() || el.value === el.defaultValue;
  if (kept && nameBox && untouched(nameBox)) nameBox.value = kept;
  if (kept && namesBox && tool === 'names' && untouched(namesBox)) namesBox.value = kept;
  const remember = document.getElementById('remember');
  const showRemember = () => { if (remember) remember.hidden = !store.get('pp-child'); };
  if (nameBox) nameBox.addEventListener('change', () => { const v = nameBox.value.trim(); if (v) store.set('pp-child', v); showRemember(); });
  document.querySelectorAll('[data-action=forget]').forEach((b) => b.addEventListener('click', () => { store.set('pp-child', null); if (nameBox) nameBox.value = ''; showRemember(); soon(); }));
  showRemember();

  // Easier and harder: step the tool's level up or down.
  const levelName = form.dataset.level;
  const levelRadios = levelName ? [...form.querySelectorAll(`input[type=radio][name="${levelName}"]`)] : [];
  function syncLevel() {
    const i = levelRadios.findIndex((r) => r.checked);
    document.querySelectorAll('[data-action=easier]').forEach((b) => { b.disabled = i <= 0; });
    document.querySelectorAll('[data-action=harder]').forEach((b) => { b.disabled = i < 0 || i >= levelRadios.length - 1; });
  }
  function step(d) {
    const i = levelRadios.findIndex((r) => r.checked), j = Math.max(0, Math.min(levelRadios.length - 1, i + d));
    if (j !== i && levelRadios[j]) { levelRadios[j].checked = true; render(); syncLevel(); }
  }
  document.querySelectorAll('[data-action=easier]').forEach((b) => b.addEventListener('click', () => step(-1)));
  document.querySelectorAll('[data-action=harder]').forEach((b) => b.addEventListener('click', () => step(1)));
  form.addEventListener('change', syncLevel);
  syncLevel();

  let timer = null;
  const soon = () => { clearTimeout(timer); timer = setTimeout(render, 180); };
  function render() {
    const p = paper();
    try { localStorage.setItem('pp-paper', p); } catch {}
    const pages = MAKERS[tool](values(), p);
    preview.innerHTML = pages.map((svg) => `<div class="sheet-wrap">${svg}</div>`).join('');
    const saving = inkBox && inkBox.checked;
    for (const s of preview.querySelectorAll('svg.sheet')) {
      if (saving) inkSave(s);
      // A hair smaller than the paper, so a page never spills onto an extra blank one.
      s.setAttribute('width', `${(s.dataset.w - 1).toFixed(1)}mm`);
      s.setAttribute('height', `${(s.dataset.h - 1.4).toFixed(1)}mm`);
    }
    if (count) count.textContent = pages.length === 1 ? '1 page' : `${pages.length} pages`;
    const first = preview.querySelector('svg.sheet');
    const orient = first && first.dataset.orient === 'landscape' ? 'landscape' : 'portrait';
    document.getElementById('pageStyle').textContent = `@page { size: ${PAPER[p].css} ${orient}; margin: 0; }`;
    preview.classList.toggle('landscape', orient === 'landscape');
  }

  // Routine charts: choosing a routine fills in its steps (still editable).
  const routine = form.querySelector('[name=routine]');
  const steps = form.querySelector('[name=steps]');
  if (routine && steps && typeof ROUTINES !== 'undefined') {
    const fill = () => { if (ROUTINES[routine.value]) steps.value = ROUTINES[routine.value].join('\n'); else if (routine.value === 'custom') steps.value = ''; };
    routine.addEventListener('change', fill);
    if (!steps.value.trim()) fill();
  }

  form.addEventListener('input', soon);
  form.addEventListener('change', soon);
  form.addEventListener('submit', (e) => e.preventDefault());
  // Wait until every picture on the sheet has loaded, so nothing prints blank.
  function picturesReady() {
    const srcs = [...new Set([...preview.querySelectorAll('image')].map((i) => i.getAttribute('href')).filter(Boolean))];
    const one = (src) => new Promise((done) => { const im = new Image(); im.onload = im.onerror = done; im.src = src; });
    return Promise.race([Promise.all(srcs.map(one)), new Promise((done) => setTimeout(done, 4000))]);
  }
  document.querySelectorAll('[data-action=print]').forEach((b) => b.addEventListener('click', () => { render(); picturesReady().then(() => setTimeout(() => window.print(), 80)); }));
  window.PrintPals = { render: () => render() };
  // "Make a new set" always gives a different sheet (a random pick can land on the same one by chance).
  document.querySelectorAll('[data-action=shuffle]').forEach((b) => b.addEventListener('click', () => {
    const before = preview.innerHTML;
    for (let i = 0; i < 6; i++) { seed = Math.floor(Math.random() * 1e9); render(); if (preview.innerHTML !== before) break; }
  }));

  // Pictures and fonts can arrive after the first drawing: draw again then.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(render);
  render();
})();
