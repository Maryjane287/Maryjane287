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
