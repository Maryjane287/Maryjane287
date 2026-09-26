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
