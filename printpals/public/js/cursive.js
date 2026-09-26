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
