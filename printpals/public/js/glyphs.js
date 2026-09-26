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
