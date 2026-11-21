// Builds the whole shop into dist/ as plain HTML. No dependencies: run `npm run build`.
// Every page is real HTML so Pinterest can read titles, prices and images (rich pins).
import { readFile, writeFile, mkdir, rm, cp, readdir } from 'node:fs/promises';
import { loadMags } from './mags.mjs';
import { renderCover, renderPages, renderFullMagazine, esc, DESIGNS, designExamples, designsFor, baseDesign } from './covers.js';

const root = new URL('..', import.meta.url);
const dist = new URL('dist/', root);
const read = async p => readFile(new URL(p, root), 'utf8');
const site = JSON.parse(await read('data/site.json'));
// Hidden magazines (made for one person, like the birthday love magazine) skip the
// shop pages, sitemap and feeds; only the maker and their private page know them.
const allMags = await loadMags(root);
const mags = allMags.filter(m => !m.hidden);
const ideas = await loadIdeas();
const abs = p => site.url.replace(/\/$/, '') + p;
// The first design of each magazine is its main product and keeps the plain URLs.
const isBase = (mag, design) => !design || design === baseDesign(mag);
const pinSrc = (mag, ex, design) => `/pins/${mag.slug}-${isBase(mag, design) ? '' : design + '-'}${ex.id}.jpg`;
const magPath = (mag, design) => `/${mag.slug}/${isBase(mag, design) ? '' : design + '/'}`;
// Tiers marked "soon" (printed copies) stay hidden until printing is set up.
const tiers = site.tiers.filter(t => !t.soon);
const from = tiers[0];

// ---------- helpers ----------

const money = n => (Number.isInteger(n) ? String(n) : n.toFixed(2));
const price = t => `<span class="price" data-gbp="£${money(t.gbp)}" data-usd="$${money(t.usd)}">$${money(t.usd)}</span>`;
const fromPrice = `<span class="price" data-gbp="£${from.gbp}" data-usd="$${from.usd}">$${from.usd}</span>`;

function saveImg(src, alt, desc, cls = '') {
  return `<img class="${cls}" src="${src}" alt="${esc(alt)}" loading="lazy" width="1000" height="1500" data-pin-description="${esc(desc)}" data-pin-media="${abs(src)}">`;
}

// Sample photos for the example magazines (made in Google Flow). Missing spread photos reuse the cover photo.
const samplePhotos = (ex = {}) => { const s = ex.photos; if (!s || !s.photo1) return {}; return { photo1: s.photo1, photo2: s.photo2 || s.photo1, photo3: s.photo3 || s.photo2 || s.photo1 }; };

function coverFor(mag, ex, design = baseDesign(mag)) {
  return renderCover(mag, ex.values, { palette: ex.palette, portraitOpts: ex.portrait, photos: samplePhotos(ex), design });
}

// Social links show in the footer only once they are filled in data/site.json.
const SOCIAL = [['tiktok', 'TikTok'], ['instagram', 'Instagram'], ['pinterest', 'Pinterest'], ['facebook', 'Facebook'], ['youtube', 'YouTube']];
const socialLinks = SOCIAL.filter(([k]) => site.social?.[k]).map(([k, label]) => `<a href="${esc(site.social[k])}" rel="me noopener" target="_blank">${label}</a>`).join('');

function layout({ title, description, path, body, og = {}, jsonld, bodyClass = '', scripts = '', noindex = false }) {
  const fullTitle = path === '/' ? `${site.name}: ${site.tagline}` : `${title} | ${site.name}`;
  const image = og.image || abs('/pins/birthday-magazine-mia.jpg');
  const ogTags = {
    'og:site_name': site.name,
    'og:title': title,
    'og:description': description,
    'og:url': abs(path),
    'og:image': image,
    'og:type': og.type || 'website',
    ...og.extra,
  };
  const nav = mags.slice(0, 4).map(m => `<a href="/${m.slug}/">${esc(m.occasion.split(' ')[0])}</a>`).join('') + '<a href="/#magazines">More</a>';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#fae3e9">
<meta name="p:domain_verify" content="c34b640fddc5572ca6d8e32b76436aef">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex, nofollow">\n' : ''}<link rel="canonical" href="${abs(path)}">
${Object.entries(ogTags).map(([k, v]) => `<meta property="${k}" content="${esc(v)}">`).join('\n')}
<meta name="twitter:card" content="summary_large_image">
${site.pinterestDomainVerify ? `<meta name="p:domain_verify" content="${esc(site.pinterestDomainVerify)}">` : ''}
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ''}
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/assets/fonts/Outfit-700.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/fonts.css">
<link rel="stylesheet" href="/assets/covers.css">
<link rel="stylesheet" href="/assets/style.css">
</head>
<body class="${bodyClass}">
<a class="skip" href="#main">Skip to content</a>
${site.christmasOrderBy ? `<p class="promo-bar"><span aria-hidden="true">&#127873;</span> Order printed copies by <b>${esc(site.christmasOrderBy)}</b> for Christmas delivery. PDFs arrive in minutes, right up to Christmas Day.</p>` : ''}
<header class="top">
  <a class="logo" href="/" aria-label="${esc(site.name)} home"><span class="logo-mag" aria-hidden="true"></span>${esc(site.name)}</a>
  <nav class="nav">${nav}<a href="/ideas/">Ideas</a></nav>
  <a class="btn btn-small" href="/make/">Make yours</a>
  <details class="menu"><summary aria-label="Menu"><span></span><span></span><span></span></summary><nav class="menu-panel">${mags.map(m => `<a href="/${m.slug}/">${esc(m.title)}</a>`).join('')}<a href="/ideas/">Gift ideas</a><a href="/help/">Delivery and FAQ</a><a href="/contact/">Contact us</a></nav></details>
</header>
<main id="main">
${body}
</main>
<footer class="foot">
  <form class="news" name="newsletter" method="POST" action="/" data-netlify="true" netlify-honeypot="company">
    <input type="hidden" name="form-name" value="newsletter">
    <p class="hp"><label>Leave this empty <input name="company"></label></p>
    <div class="news-text"><h3>Never miss a big day</h3><p>Gentle reminders before Mother's Day, Father's Day, Valentine's and Christmas, plus new magazines first. About one email a month, and you can leave any time.</p></div>
    <div class="news-form"><label class="sr-only" for="news-email">Your email</label><input id="news-email" type="email" name="email" required autocomplete="email" placeholder="you@example.com"><button class="btn" type="submit">Remind me</button></div>
    <p class="news-done" hidden role="status">Lovely, you are on the list. We will see you before the next big day.</p>
  </form>
  <div class="foot-grid">
    <div>
      <a class="logo" href="/"><span class="logo-mag" aria-hidden="true"></span>${esc(site.name)}</a>
      <p>Personalised magazines for the people you love. Made in minutes, kept forever.</p>
      <p class="currency">Prices in <button type="button" data-cur="gbp">£ GBP</button> <button type="button" data-cur="usd">$ USD</button></p>
    </div>
    <div class="foot-mags"><h4>Magazines</h4><div class="foot-mag-list">${mags.map(m => `<a href="/${m.slug}/">${esc(m.title)}</a>`).join('')}</div></div>
    <div><h4>Help</h4><a href="/help/">Delivery and FAQ</a><a href="/ideas/">Gift ideas</a><a href="/about/">About us</a><a href="/contact/">Contact us</a><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></div>
    <div><h4>The small print</h4><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><a href="/refunds/">Refunds</a>${socialLinks ? `<h4 class="foot-follow">Follow us</h4>${socialLinks}` : ''}</div>
  </div>
  <p class="legal">&copy; ${new Date().getFullYear()} ${esc(site.name)} is a trading name of ${esc(site.company)}, a company registered in the United Kingdom, number ${esc(site.companyNumber)}.</p>
</footer>
<script src="/assets/site.js" type="module"></script>
${scripts}
<script async defer src="https://assets.pinterest.com/js/pinit.js" data-pin-hover="true" data-pin-tall="true"></script>
${site.pinterestTagId ? `<script>window.PIN_TAG_ID=${JSON.stringify(site.pinterestTagId)}</script>` : ''}
</body>
</html>
`;
}

async function page(path, html) {
  const file = new URL('.' + (path.endsWith('/') ? path + 'index.html' : path), dist);
  await mkdir(new URL('.', file), { recursive: true });
  await writeFile(file, html);
}

async function loadIdeas() {
  const dir = new URL('ideas/', root);
  const out = [];
  for (const f of (await readdir(dir)).filter(f => f.endsWith('.html')).sort()) {
    const raw = await readFile(new URL(f, dir), 'utf8');
    const [, head, body] = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    const meta = Object.fromEntries(head.split('\n').map(l => [l.slice(0, l.indexOf(':')).trim(), l.slice(l.indexOf(':') + 1).trim()]));
    out.push({ ...meta, slug: f.replace(/^\d+-/, '').replace(/\.html$/, ''), body });
  }
  return out;
}

const tierCards = (magSlug = '') => `
  <div class="tiers">
    ${tiers.map(t => `
    <div class="tier${t.popular ? ' tier-pop' : ''}">
      ${t.popular ? '<span class="tier-badge">Most loved</span>' : ''}
      <h3>${esc(t.label)}</h3>
      <p class="tier-price">${price(t)}</p>
      <p>${esc(t.blurb)}</p>
      <a class="btn ${t.popular ? '' : 'btn-ghost'}" href="/make/${magSlug ? `?m=${magSlug}&amp;t=${t.id}` : `?t=${t.id}`}">Choose</a>
    </div>`).join('')}
  </div>
  ${site.tiers.some(t => t.soon && t.id === 'print') ? '<p class="tiers-soon">Printed, posted copies are coming soon.</p>' : ''}
  ${trustStrip}`;

// Simple line icons drawn to match the site (no emojis).
const ICONS = {
  heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.3a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"/>',
  lock: '<rect x="5" y="10.5" width="14" height="9.5" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/><path d="M12 14.5v2"/>',
  spark: '<path d="M12 3.5l1.9 5.2 5.4 1.3-4.3 3.4.9 5.6L12 16.2 8.1 19l.9-5.6-4.3-3.4 5.4-1.3z"/>',
  globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5c2.8 3 2.8 14 0 17M12 3.5c-2.8 3-2.8 14 0 17"/>',
  pencil: '<path d="M5 19l1-4.2L15.8 5a2 2 0 0 1 2.9 0l.3.3a2 2 0 0 1 0 2.9L9.2 18 5 19z"/><path d="M14 7l3 3"/>',
  camera: '<rect x="3.5" y="7" width="17" height="12.5" rx="2.5"/><circle cx="12" cy="13.2" r="3.4"/><path d="M8.5 7l1.4-2.5h4.2L15.5 7"/>',
  gift: '<rect x="4" y="10.5" width="16" height="9.5" rx="1.5"/><rect x="3" y="7" width="18" height="3.5" rx="1"/><path d="M12 7v13"/><path d="M12 7C10.5 3.5 6.5 4 7.5 6.3 8 7 12 7 12 7zM12 7c1.5-3.5 5.5-3 4.5-.7C16 7 12 7 12 7z"/>',
  calendar: '<rect x="4" y="5.5" width="16" height="14.5" rx="2.5"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>',
};
const icon = name => `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;

// The promises every premium gift shop makes, shown under the prices and at checkout.
const trustStrip = `
  <ul class="trust">
    <li>${icon('heart')}<div><b>Love it or we make it right</b> <small>Spotted a typo or a printing fault? We fix it free.</small></div></li>
    <li>${icon('lock')}<div><b>Safe, secure checkout</b> <small>Pay by card or PayPal. We never see your card details.</small></div></li>
    <li>${icon('spark')}<div><b>Ready in minutes</b> <small>Download straight after paying, and a copy by email.</small></div></li>
    <li>${icon('globe')}<div><b>Sent anywhere in the world</b> <small>By email in seconds, or printed near them and posted.</small></div></li>
  </ul>`;

// The name on the gift tag: a first name, or the whole name when it starts with The, Mr, Mrs and so on.
const firstName = v => { const n = String(v || '').trim(); const w = n.split(/\s/)[0]; return /^(the|mr|mrs|ms|miss|dr)\.?$/i.test(w) ? n : w; };

// Real photos of finished magazines at home (our own sample covers), used on the home page.
const PRODUCT_PHOTOS = {
  'birthday-magazine': ['flatlay', 'Mia\'s birthday magazine, ready to wrap'],
  'pet-magazine': ['hardcover', 'Biscuit\'s hardcover keepsake'],
  'anniversary-magazine': ['bed', 'Chris and Emma\'s anniversary issue'],
};
const productImg = (k, alt, cls = '') => `<img class="real-photo${cls}" src="/assets/products/${k}.jpg" alt="${esc(alt)}" width="896" height="1200" loading="lazy" decoding="async">`;
const realPhotos = () => `
<section class="section real real-photos">
  <div class="section-head"><p class="kicker">See it for real</p><h2>Made to be held, shared and kept</h2><p>Thick, glossy pages they will keep on the coffee table for years. Or a PDF on their phone in minutes, wherever they are in the world.</p></div>
  <div class="real-grid">
    <figure class="real-scene">${productImg('flatlay', 'A printed birthday magazine with a smiling woman on the cover, on a linen cloth with coffee, ribbon and dried flowers')}<figcaption><b>Printed and posted</b>A4 magazine, glossy or matte, printed near them.</figcaption></figure>
    <figure class="real-scene">${productImg('hardcover', 'A hardcover keepsake book with a golden retriever on the cover, on an oak table beside a gift box and tea')}<figcaption><b>Hardcover keepsake</b>A thick, lasting edition for the shelf.</figcaption></figure>
    <figure class="real-scene">${productImg('bed', 'A printed anniversary magazine with a hugging couple on the cover, on a knit blanket with cake and rose petals')}<figcaption><b>A morning they will never forget</b>Left on the bed with cake and a card.</figcaption></figure>
  </div>
</section>`;

// "See it for real": the buyer's actual design shown as a printed magazine,
// an open spread and on a phone, all drawn from the same pages as the PDF.
const realLife = (mag, pages, name) => {
  const gentle = !!mag.gentle || mag.slug === 'pet-memorial-magazine';
  const [say, reply] = gentle ? ['Made this for you. Thinking of you.', 'Oh, this is so beautiful. Thank you.'] : ["You're on the cover!", 'WHAT?! I love it so much'];
  return `
<section class="section real">
  <div class="section-head"><p class="kicker">See it for real</p><h2>Made to be held, shared and kept</h2><p>This is exactly what they get: their own magazine, as a glossy printed copy or on their phone in seconds.</p></div>
  <div class="real-grid">
    <figure class="real-scene real-print">
      <div class="real-stage">${PRODUCT_PHOTOS[mag.slug] ? productImg(PRODUCT_PHOTOS[mag.slug][0], PRODUCT_PHOTOS[mag.slug][1], ' real-fill') : `<div class="mock-mag"><div class="mock-pages"></div><div class="mock-cover">${pages[0]}</div></div><div class="mock-tag">${gentle ? 'Forever loved' : `For you, ${esc(name)}`}</div>`}</div>
      <figcaption><b>Printed and posted</b>A4 glossy or matte, printed near them.</figcaption>
    </figure>
    <figure class="real-scene real-open">
      <div class="real-stage"><div class="mock-spread"><div class="mock-left">${pages[9]}</div><div class="mock-right">${pages[10]}</div></div></div>
      <figcaption><b>24 pages all about them</b>A cover story, full page photos, your letter and more.</figcaption>
    </figure>
    <figure class="real-scene real-phone">
      <div class="real-stage"><div class="mock-phone"><div class="mock-screen"><p class="mock-bubble">${say}</p><div class="mock-file">${pages[0]}</div><p class="mock-bubble mock-reply">${reply}</p></div></div></div>
      <figcaption><b>Sent in seconds</b>By email or message, anywhere in the world.</figcaption>
    </figure>
  </div>
</section>`;
};

// Real buyers' reviews, filled in by /assets/reviews.js. The section stays
// hidden until the first real review arrives (we never invent reviews).
const reviewsSection = (magSlug = '', tint = false) => `
<section class="section${tint ? ' section-tint' : ''} reviews-sec" data-reviews="${magSlug}" hidden>
  <div class="section-head"><p class="kicker">Real buyers, real reactions</p><h2>What people are saying</h2><p class="rev-summary" hidden></p></div>
  <div class="rev-list" hidden></div>
</section>`;

const steps = `
  <ol class="steps">
    <li><span class="step-ico">${icon('pencil')}</span><h3>Answer a few fun questions</h3><p>Their nickname, their secret talent, the moment you will never forget. Every question comes with an example, so nobody gets stuck.</p></li>
    <li><span class="step-ico">${icon('camera')}</span><h3>Add your favourite photos</h3><p>Three photos is all it takes. Watch the cover come alive as you type.</p></li>
    <li><span class="step-ico">${icon('gift')}</span><h3>Give the best gift of the year</h3><p>Their 24 page magazine lands in your inbox, ready to send by message, share on screen or print at home, anywhere in the world.</p></li>
  </ol>`;

const faq = [
  ['How long does it take?', 'About five minutes to fill in. Your finished 24 page magazine is ready to download as soon as you have paid, and we email it to you too.'],
  ['What is the hardcover keepsake book like?', 'It is the same 24 pages as the magazine, bound as a thick A4 hardcover book with a square spine, printed on thick, premium paper. It stands on a shelf like a real book, so it is perfect for grandparents, weddings, new babies and memories you want to keep forever. It is printed near them and posted, with shipping added at checkout.'],
  ['Can you send it straight to them as a surprise?', 'Yes. Tick "It\'s a gift, send it to them for me" when you order, add their name and email, and pick the day. We email the finished magazine to them with your name on it, and you get your own copy first so you can see it. For a printed copy, just type their address at the printer\'s checkout.'],
  ['Where do you deliver?', 'Everywhere. Your magazine arrives by email, so you can send it to anyone in the world in seconds. Want it printed? Choose a printed magazine and it is printed near them and posted to their door, with shipping added at checkout.'],
  ['Can I see it before I pay?', 'Yes. You see a live preview of the cover and pages while you fill in the form.'],
  ['What happens to my photos?', 'They are used only to make your magazine and are deleted 30 days after your order (or 30 days after your gift is delivered). We never share or post them anywhere.'],
  ['What if something is wrong?', 'If anything in your magazine is not right, email us and we will fix it for free.'],
];
const faqHtml = `<div class="faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>`;
const faqLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };

const ticker = [
  'BREAKING: Chris still cannot fold a fitted sheet',
  'EXCLUSIVE: Mia turns 30, remains iconic',
  'Grandma voted Best Pancakes for 12th year running',
  'Leo, 6, now world\'s leading dinosaur expert',
  'Emma and Sam: 25 years, one umbrella',
  'Scientists confirm: Nana\'s biscuits are the best',
  'Sam finally explains the Great Sofa Incident',
];
const tickerHtml = `<div class="ticker" aria-hidden="true"><div class="ticker-track">${[...ticker, ...ticker].map(t => `<span>${esc(t)}</span>`).join('')}</div></div>`;

// ---------- pages ----------

async function home() {
  const [b, a, n, k] = mags;
  const heroCovers = [
    [a, a.examples[0]], [b, b.examples[0]], [k, k.examples[0]],
  ].map(([m, ex], i) => `<a class="hero-cover hc-${i}" href="/${m.slug}/" aria-label="${esc(m.title)}">${coverFor(m, ex)}</a>`).join('');
  const FILTERS = [
    ['birthday', 'Birthdays', /birthday|kids/],
    ['love', 'Love and weddings', /anniversary|wedding|engagement|valentines|boyfriend|girlfriend|husband|wife|marry|bridesmaid|christmas-together|long-distance|love-story|hundred-reasons|first-date|forever|still-falling|adventures-with|letters-to/],
    ['family', 'Family and baby', /grandparents|like-father|generations|reunion|heritage|aunt|uncle|grandma|baby|mothers|mum-|fathers|daddys|sister|brother-mag|sibling|family|matriarch|pregnancy|kids|year-in-review|twelve-months|first-day-school|cake-smash|twins|little-explorer|junior-sports|little-princess|little-hero|childhood|chosen-with|christening|new-parents|tiny-steps/],
    ['christmas', 'Christmas', /christmas|year-in-review/],
    ['thanks', 'Friends and big moments', /best-friend|girls-club|brotherhood|friend-group|maid-of-honour|friends-on-tour|unfiltered|bridesmaids|teacher|thank-you|retirement|graduation|new-job|new-home|travel|leaving/],
    ['memory', 'Pets and memories', /pet|memorial/],
  ];
  const tagsFor = m => FILTERS.filter(([, , re]) => re.test(m.slug)).map(([id]) => id).join(' ');
  const filterBar = `<div class="mag-filters" role="group" aria-label="Filter by occasion"><button type="button" class="chip on" data-f="all" aria-pressed="true">All ${mags.length}</button>${FILTERS.map(([id, label]) => `<button type="button" class="chip" data-f="${id}" aria-pressed="false">${label}</button>`).join('')}</div>`;
  const cards = mags.map(m => `
    <a class="mag-card" href="/${m.slug}/" data-tags="${tagsFor(m)}">
      <div class="mag-card-cover">${coverFor(m, [m.examples[1], ...m.examples].find(e => e && e.photos) || m.examples[1] || m.examples[0])}</div>
      <div class="mag-card-body">
        <p class="kicker">${esc(m.occasion)}</p>
        <h3>${esc(m.title)}</h3>
        <p>${esc(m.short)}</p>
        <p class="from">From ${fromPrice} &middot; ${designsFor(m).length} designs</p>
      </div>
    </a>`).join('');
  const wall = mags.flatMap(m => m.examples.map(ex => ({ m, ex })));
  // interleave magazines so the wall feels mixed
  wall.sort((x, y) => x.m.examples.indexOf(x.ex) - y.m.examples.indexOf(y.ex));
  const wallHtml = wall.map(({ m, ex }) => `<a class="wall-item" href="/${m.slug}/">${saveImg(pinSrc(m, ex), `${m.title} example cover`, `${m.pinTitle}: ${m.short} Made in 5 minutes. #${m.keywords[0].replace(/\s+/g, '')}`)}</a>`).join('');
  const body = `
<section class="hero">
  <div class="confetti" aria-hidden="true">${Array.from({ length: 18 }, (_, i) => `<i style="--i:${i}"></i>`).join('')}</div>
  <div class="hero-text">
    <p class="kicker">Personalised keepsake magazines</p>
    <h1>Make them the <span class="hl">cover story.</span></h1>
    <p class="lead">Answer a few fun questions, add your photos, and we turn them into a beautiful magazine all about the person you love. 24 glossy pages about them, ready to send in minutes or printed and posted as a keepsake they will never throw away.</p>
    <div class="hero-cta"><a class="btn btn-big" href="/make/">Make a magazine</a><a class="btn btn-ghost" href="#magazines">See the magazines</a></div>
    <p class="hero-note">Ready in 5 minutes &middot; From ${fromPrice} &middot; No design skills needed</p>
  </div>
  <div class="hero-covers">${heroCovers}</div>
</section>
${tickerHtml}
<section class="section" id="magazines">
  <div class="section-head"><p class="kicker">Pick a magazine</p><h2>Which story are you telling?</h2></div>
  ${filterBar}
  <div class="mag-grid">${cards}</div>
</section>
<section class="section section-tint">
  <div class="section-head"><p class="kicker">How it works</p><h2>A gift that feels handmade, without the hours</h2></div>
  ${steps}
  <p class="center"><a class="btn btn-big" href="/make/">Start yours now</a></p>
</section>
<section class="section why" id="why">
  <div class="section-head"><p class="kicker">Why Cover Story</p><h2>Other magazine makers hand you a template. We hand you a finished gift.</h2><p>Most personalised magazines are a blank editor and an evening of work. We do the writing, the design and the hard part, so you get the fun part: watching their face.</p></div>
  <div class="why-table">
    <div class="why-head" aria-hidden="true"><span></span><span>The usual way</span><span>With Cover Story</span></div>
    <ul><li><span class="why-what">Time it takes</span><span class="why-them">Hours of dragging text boxes and photos around</span><span class="why-us">About five minutes of fun questions</span></li><li><span class="why-what">The words</span><span class="why-them">You write every page yourself</span><span class="why-us">We write all 24 pages for you, warm and funny, from your answers</span></li><li><span class="why-what">Friends and family</span><span class="why-them">Chase everyone for messages, then copy them in</span><span class="why-us">Send one link. Everyone adds a note, and they never find out</span></li><li><span class="why-what">Left it late?</span><span class="why-them">Wait days for a proof or a parcel</span><span class="why-us">Your PDF arrives in minutes, even on Christmas morning</span></li><li><span class="why-what">Far away</span><span class="why-them">Often posted from abroad, slow and costly</span><span class="why-us">Printed near them anywhere in the world, or sent by email in seconds</span></li><li><span class="why-what">Before you pay</span><span class="why-them">Pay first and hope it looks right</span><span class="why-us">See the cover and every page while you fill it in</span></li><li><span class="why-what">If something is wrong</span><span class="why-them">Your typo, your problem</span><span class="why-us">Spot a mistake? We fix it free</span></li></ul>
  </div>
  <p class="center"><a class="btn btn-big" href="/make/">See yours take shape</a></p>
</section>
<section class="section">
  <div class="section-head"><p class="kicker">Real magazines, made up names</p><h2>Save your favourites for later</h2><p>Tap Save on any cover to keep it on your Pinterest board.</p></div>
  <div class="wall wall-short">${wallHtml}</div>
  <p class="center"><button type="button" class="btn btn-ghost wall-more" aria-expanded="false">Show ${wall.length - 8} more covers</button></p>
</section>
<section class="section section-tint" id="prices">
  <div class="section-head"><p class="kicker">Simple prices</p><h2>Choose how you give it</h2></div>
  ${tierCards()}
</section>
${realPhotos()}
${reviewsSection('', true)}
<section class="section">
  <div class="section-head"><p class="kicker">Questions</p><h2>Good to know</h2></div>
  ${faqHtml}
</section>
<section class="cta-band">
  <h2>Somebody deserves to be on the front page.</h2>
  <a class="btn btn-big btn-light" href="/make/">Make their magazine</a>
</section>`;
  await page('/', layout({
    title: site.tagline, description: site.description, path: '/', body,
    jsonld: [{ '@context': 'https://schema.org', '@type': 'Organization', name: site.name, legalName: site.company, url: site.url, email: site.email }, faqLd],
    scripts: `<script type="module" src="/assets/reviews.js"></script><script type="module">
      const more = document.querySelector('.wall-more');
      more?.addEventListener('click', () => { document.querySelector('.wall').classList.remove('wall-short'); more.remove(); });
    </script>`,
  }));
}

async function magazinePage(mag, design = baseDesign(mag)) {
  const base = isBase(mag, design);
  const designIds = designsFor(mag);
  const path = magPath(mag, design);
  const exs = designExamples(mag, design);
  const main = exs[0];
  const dLabel = DESIGNS[design].label;
  const name = base ? mag.searchTitle : `${mag.searchTitle}, ${dLabel} Design`;
  const pin = ex => pinSrc(mag, ex, design);
  const cover = ex => coverFor(mag, ex, design);
  const makeUrl = `/make/?m=${mag.slug}${base ? '' : '&amp;d=' + design}`;
  const designCards = designIds.map(d => {
    const ex = designExamples(mag, d)[0];
    return `<a class="design-card${d === design ? ' is-on' : ''}" href="${magPath(mag, d)}"${d === design ? ' aria-current="page"' : ''}>${coverFor(mag, ex, d)}<span>${esc(DESIGNS[d].label)}</span></a>`;
  }).join('');
  const lowest = Math.min(...tiers.map(t => t.gbp));
  const highest = Math.max(...tiers.map(t => t.gbp));
  const inside = renderFullMagazine(mag, main.values, { palette: main.palette, portraitOpts: main.portrait, photos: samplePhotos(main), design });
  const desc = `${name}: ${mag.short} Made in 5 minutes from your answers and photos. A 24 page magazine sent as an instant PDF, anywhere in the world.`;
  const body = `
<nav class="crumbs"><a href="/">Home</a> <span>/</span> ${base ? esc(mag.occasion) : `<a href="${magPath(mag)}">${esc(mag.occasion)}</a> <span>/</span> ${esc(dLabel)}`}</nav>
<section class="mag-hero">
  <div class="mag-gallery">
    <div class="mag-main">${saveImg(pin(main), `${mag.title} example: ${Object.values(main.values)[0]}`, `${mag.pinTitle}${base ? '' : ', ' + dLabel + ' design'}. ${mag.short} Personalise it in 5 minutes.`, 'mag-main-img')}</div>
    <div class="mag-thumbs">${exs.map((ex, i) => `<button type="button" class="mag-thumb${i ? '' : ' is-on'}" data-src="${pin(ex)}" aria-label="Show example ${i + 1}">${cover(ex)}</button>`).join('')}</div>
  </div>
  <div class="mag-info">
    <p class="kicker">${esc(mag.occasion)}</p>
    <h1>${esc(name)}</h1>
    <ul class="badges"><li><b>24</b> pages</li><li><b>${designIds.length}</b> designs</li><li>PDF in <b>minutes</b></li><li>Printed and <b>posted</b></li></ul>
    <p class="lead">${esc(mag.description)}</p>
    <p class="mag-price">From ${fromPrice}</p>
    <a class="btn btn-big" href="${makeUrl}">Make yours in 5 minutes</a>
    <a class="pin-btn" href="https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(abs(path))}&amp;media=${encodeURIComponent(abs(pin(main)))}&amp;description=${encodeURIComponent(mag.pinTitle + '. ' + mag.short)}" data-pin-do="none" target="_blank" rel="noopener">Save to Pinterest</a>
    <h2 class="h-small">What's inside</h2>
    <ul class="ticks">${mag.inside.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
    <p class="chips">${mag.keywords.map(k => `<span>${esc(k)}</span>`).join('')}</p>
  </div>
</section>
${mag.heart ? `<section class="section glance-sec">
  <div class="section-head"><p class="kicker">Inside this issue</p><h2>Written about them, page by page</h2><p>Not a template you fill in. Every page below is built from your answers, so it sounds like you and looks like them.</p></div>
  <div class="glance">${[[2, 'Your letter', 'Your own words, with your favourite photo'], [5, 'Ten things you love', 'Picked by you, in seconds'], [9, 'Front page news', 'Their big day makes the headlines'], [3, 'Their story', 'Your memories, with photos if you like'], [11, 'Their field guide', 'Funny, true and all about them'], [22, 'Now showing: the movie', 'Their photo, on the big screen']].map(([i, t, d]) => inside[i] ? `<figure><div class="glance-pg">${inside[i]}</div><figcaption><b>${t}</b>${d}</figcaption></figure>` : '').join('')}</div>
</section>
` : ''}<section class="section">
  <div class="section-head"><p class="kicker">${designIds.length} designs</p><h2>Pick the look they will love</h2><p>Same questions, same price. Every design is made from your answers and photos.</p></div>
  <div class="design-grid">${designCards}</div>
</section>
<section class="section section-tint">
  <div class="section-head"><p class="kicker">Flip through all ${inside.length} pages</p><h2>Every page is about them</h2><p>${mag.heart ? "A cover story written about them, full page photos, your letter, voices from the people who love them, a pull out poster and a closing note from us." : "A contents page, the big interview, a pull out poster, a quiz and puzzle made from your answers, an official certificate and more."} Swipe to see it all.</p></div>
  <div class="flip">${inside.map((p, i) => `<div><div class="flip-page">${p}</div><span class="flip-n">${i ? `Page ${i + 1}` : 'Cover'}</span></div>`).join('')}</div>
</section>
${realLife(mag, inside, firstName(Object.values(main.values)[0]))}
<section class="section">
  <div class="section-head"><p class="kicker">Prices</p><h2>Choose how you give it</h2></div>
  ${tierCards(mag.slug)}
</section>
${reviewsSection(mag.slug, true)}
<section class="section">
  <div class="section-head"><p class="kicker">How it works</p><h2>Five minutes, one very happy person</h2></div>
  ${steps}
</section>
<section class="section section-tint">${faqHtml}</section>
<section class="cta-band"><h2>Ready to put them on the cover?</h2><a class="btn btn-big btn-light" href="${makeUrl}">Start now</a></section>`;
  const jsonld = [{
    '@context': 'https://schema.org', '@type': 'Product',
    name, description: mag.description,
    image: exs.map(ex => abs(pin(ex))),
    brand: { '@type': 'Brand', name: site.name },
    offers: { '@type': 'AggregateOffer', priceCurrency: 'GBP', lowPrice: lowest.toFixed(2), highPrice: highest.toFixed(2), offerCount: tiers.length, availability: 'https://schema.org/InStock', url: abs(path) },
  }, faqLd];
  await page(path, layout({
    title: name, description: desc, path, body, jsonld,
    og: {
      type: 'product', image: abs(pin(main)),
      extra: { 'product:price:amount': lowest.toFixed(2), 'product:price:currency': 'GBP', 'og:price:amount': lowest.toFixed(2), 'og:price:currency': 'GBP', 'product:availability': 'in stock', 'og:availability': 'instock', 'product:brand': site.name },
    },
    scripts: `<script type="module" src="/assets/reviews.js"></script><script type="module">
      document.querySelectorAll('.mag-thumb').forEach(b => b.addEventListener('click', () => {
        document.querySelectorAll('.mag-thumb').forEach(x => x.classList.toggle('is-on', x === b));
        const img = document.querySelector('.mag-main-img'); img.src = b.dataset.src; img.dataset.pinMedia = new URL(b.dataset.src, location.href).href;
      }));
    </script>`,
  }));
}

async function makerPage() {
  // Tiers marked "soon" are in the page but hidden; /make/?print=1 reveals them for testing.
  const tierOpts = site.tiers.map((t, i) => `
    <label class="tier-opt"${t.soon ? ` data-soon="${t.id}" hidden` : ''}><input type="radio" name="tier" value="${t.id}"${t.popular ? ' checked' : ''}><span><b>${esc(t.label)}</b> ${price(t)}<small>${esc(t.blurb)}</small></span></label>`).join('');
  const countries = ['United Kingdom', 'United States', 'Canada', 'Australia', 'Ireland', 'New Zealand', 'Germany', 'France', 'Netherlands', 'Spain', 'Italy', 'Sweden', 'South Africa', 'United Arab Emirates', 'Nigeria', 'Ghana', 'Kenya', 'India', 'Singapore', 'Other'];
  const body = `
<section class="maker">
  <div class="maker-form">
    <p class="kicker">The magazine maker</p>
    <h1>Let's make <span class="hl" id="who">their</span> magazine</h1>
    <p class="maker-label">Magazine <small>(swipe to see all ${mags.length})</small></p>
    <div class="pick" role="radiogroup" aria-label="Choose a magazine">
      ${mags.map(m => `<button type="button" class="pick-btn" data-m="${m.slug}" role="radio">${coverFor(m, m.examples[0])}<span>${esc(m.title)}</span></button>`).join('')}
    </div>
    <p class="maker-label">Design</p>
    <div class="designs" role="radiogroup" aria-label="Choose a design"></div>
    <div class="palette" aria-label="Choose a colour"></div>
    <form id="order" name="order" method="POST" action="/thanks/" data-netlify="true" netlify-honeypot="company" enctype="multipart/form-data">
      <input type="hidden" name="form-name" value="order">
      <input type="hidden" name="magazine"><input type="hidden" name="design"><input type="hidden" name="palette"><input type="hidden" name="answers"><input type="hidden" name="order-id"><input type="hidden" name="pdf"><input type="hidden" name="cards">
      <p class="hp"><label>Leave this empty <input name="company"></label></p>
      <div id="fields"></div>
      <p class="photo-note">Your photos stay on your device while you design. They are only sent when you place your order.</p>
      <fieldset class="checkout">
        <legend>Love it? Choose your edition</legend>
        ${tierOpts}
        <div class="finish" hidden><p class="maker-label">Cover finish</p><label class="finish-opt"><input type="radio" name="finish" value="glossy" checked><span><b>Glossy</b><small>Shiny, bright, like a newsstand magazine</small></span></label><label class="finish-opt"><input type="radio" name="finish" value="matte"><span><b>Matte</b><small>Soft touch and elegant</small></span></label></div>
        <label class="field"><span>Your email (we send the magazine here)</span><input type="email" name="email" required autocomplete="email" placeholder="you@example.com"></label>
        <fieldset class="gift">
          <label class="gift-toggle"><input type="checkbox" name="gift" value="yes"> <span><b>It's a gift, send it to them for me</b><small>We email the finished magazine straight to them, with your name on it, on the day you choose.</small></span></label>
          <div class="gift-fields" hidden>
            <label class="field"><span>Their name</span><input type="text" name="gift_name" maxlength="60" placeholder="Mia"></label>
            <label class="field"><span>Their email</span><input type="email" name="gift_email" placeholder="mia@example.com"></label>
            <div class="field wide"><span>When should we send it?</span>
              <div class="when">
                <label class="when-opt"><input type="radio" name="gift_when" value="now" checked><span><b>Right away</b><small>As soon as you have paid</small></span></label>
                <label class="when-opt"><input type="radio" name="gift_when" value="later"><span><b>On a day I choose</b><small>It arrives at 8am that morning</small></span></label>
              </div>
            </div>
            <label class="field wide gift-day" hidden><span>Which day?</span><span class="date-wrap">${icon('calendar')}<input type="date" name="gift_date"></span></label>
            <label class="field wide"><span>A little note for them <small>(optional, it goes in the email above your name)</small></span><textarea name="gift_note" maxlength="300" rows="3" placeholder="Happy birthday, Mia! I could not wait for you to see this. Every page made me smile."></textarea></label>
            <label class="field wide"><span>From <small>(how your name appears)</small></span><input type="text" name="gift_from" maxlength="60" placeholder="Love, Chris"></label>
            <p class="small">You get your own copy too, so you can see it first.</p>
          </div>
          <p class="small gift-print" hidden>Printed gifts go straight to them: just type their address at the printer's checkout.</p>
        </fieldset>
        <label class="field"><span>Where is it going?</span><select name="country" required>${countries.map(c => `<option>${c}</option>`).join('')}</select></label>
        <label class="consent"><input type="checkbox" name="consent" required> <span>I agree to the <a href="/terms/" target="_blank">terms</a> and <a href="/privacy/" target="_blank">privacy policy</a>, and have permission to use these photos.</span></label>
        <button class="btn btn-big" type="submit">Place my order</button>
        <p class="small" id="pay-note">Next, you pay securely. Your magazine is ready to download the moment you have paid, and we email it to you too.</p>
        <p class="small order-progress" id="order-progress" hidden></p>
        ${trustStrip.replace('class="trust"', 'class="trust trust-mini"')}
      </fieldset>
    </form>
  </div>
  <a class="btn btn-small peek" href="#preview-top">See my magazine</a>
  <aside class="maker-preview" id="preview-top" aria-label="Live preview">
    <div class="preview-tabs" role="tablist"></div>
    <div class="preview-stage"><div id="preview"></div><span class="watermark" aria-hidden="true">Preview</span></div>
    <button type="button" class="btn see-all" id="see-all">Flip through all 24 pages</button>
    <p class="small center">This updates as you type. See every page of their magazine, with your answers, before you pay.</p>
  </aside>
  <dialog class="all-pages" id="all-pages" aria-label="All pages of your magazine"><div class="all-head"><h2>Their magazine, page by page</h2><button type="button" class="btn btn-small" data-close>Back to editing</button></div><div class="all-grid"></div></dialog>
</section>
<script type="application/json" id="mags">${JSON.stringify(allMags).replace(/</g, '\\u003c')}</script>
<script type="application/json" id="site-checkout">${JSON.stringify(site.checkout)}</script>
<script type="application/json" id="gift-expires">${JSON.stringify(site.giftExpires || '')}</script>`;
  await page('/make/', layout({
    title: 'Make your magazine', description: 'Answer a few fun questions, add photos and watch your personalised magazine come to life.', path: '/make/', body, bodyClass: 'is-maker',
    scripts: '<script type="module" src="/assets/maker.js"></script>',
  }));
}

async function ideasPages() {
  const cards = ideas.map(i => `
    <a class="idea-card" href="/ideas/${i.slug}/"><img src="${i.image}" alt="" loading="lazy" width="1000" height="1500"><div><p class="kicker">${esc(i.kicker)}</p><h3>${esc(i.title)}</h3><p>${esc(i.description)}</p></div></a>`).join('');
  await page('/ideas/', layout({
    title: 'Gift ideas', description: 'Thoughtful, personal gift ideas for birthdays, anniversaries and family far away.', path: '/ideas/',
    body: `<section class="section"><div class="section-head"><p class="kicker">Ideas</p><h1>Little ideas for big feelings</h1></div><div class="idea-grid">${cards}</div></section>`,
  }));
  for (const i of ideas) {
    const path = `/ideas/${i.slug}/`;
    await page(path, layout({
      title: i.title, description: i.description, path,
      og: { type: 'article', image: abs(i.image) },
      jsonld: { '@context': 'https://schema.org', '@type': 'Article', headline: i.title, description: i.description, image: abs(i.image), datePublished: i.date, publisher: { '@type': 'Organization', name: site.name } },
      body: `<article class="article">
        <nav class="crumbs"><a href="/">Home</a> <span>/</span> <a href="/ideas/">Ideas</a></nav>
        <p class="kicker">${esc(i.kicker)}</p><h1>${esc(i.title)}</h1><p class="lead">${esc(i.description)}</p>
        <figure class="article-pin">${saveImg(i.image, i.title, `${i.title}. ${i.description}`)}</figure>
        ${i.body}
        <div class="article-cta"><h2>Turn it into a magazine</h2><p>Answer a few questions and we will make it look gorgeous.</p><a class="btn btn-big" href="${i.cta || '/make/'}">Make yours</a></div>
      </article>`,
    }));
  }
}

async function simplePages() {
  const wrap = (kicker, title, inner) => `<article class="article prose"><p class="kicker">${kicker}</p><h1>${title}</h1>${inner}</article>`;
  await page('/help/', layout({
    title: 'Delivery and FAQ', description: 'Delivery times, worldwide shipping, photos, reprints and everything else you might wonder about.', path: '/help/', jsonld: faqLd,
    body: wrap('Help', 'Delivery and questions', `
      <h2>How it works</h2>
      <ol class="how-steps">
        <li><b>Pick their magazine.</b> Birthday, anniversary, new baby, a beloved pet and many more, each with its own designs and colours.</li>
        <li><b>Answer a few fun questions and add photos.</b> You see every page change as you type, so there are no surprises. It takes about five minutes.</li>
        <li><b>Choose how to give it.</b> A PDF ready in minutes to email, message or print, or a printed magazine or hardcover book posted to their door.</li>
      </ol>
      <h2>When will it arrive?</h2>
      <ul class="when-list">
        <li><b>PDF magazine:</b> in your inbox within minutes of paying. Perfect for last minute gifts, even on the day.</li>
        <li><b>Printed magazine or hardcover:</b> about 4 to 5 working days to print, plus postage. Please order at least 10 days before the big day.</li>
        ${site.christmasOrderBy ? `<li><b>Christmas:</b> order printed copies by ${esc(site.christmasOrderBy)}. PDFs can be ordered right up to Christmas Day.</li>` : ''}
      </ul>
      <h2>Delivery</h2>
      <p>Your finished 24 page magazine is ready to download as a PDF the moment you have paid, and we email it to you too. You can send it to anyone, anywhere, by email or message, or print it at home or at any print shop.</p>
      <p>Printed magazines are printed on glossy or matte paper, and hardcover keepsake books on thick, premium paper, by our print partner near the lucky person, then posted. Printing takes about 4 to 5 working days, plus a few days for the post. Every printed copy comes with the PDF too, ready to download as soon as you have paid. Shipping is worked out for their country and added at checkout.</p>
      <h2>Questions</h2>${faqHtml}
      <h2>Still stuck?</h2><p>Email <a href="mailto:${esc(site.email)}">${esc(site.email)}</a> and a real person will help.</p>`),
  }));
  await page('/about/', layout({
    title: 'About us', description: `The story behind ${site.name}, and the promise we make with every magazine.`, path: '/about/',
    body: wrap('About', 'Everybody deserves a front page', `
      <p>The best gifts say <em>I really know you</em>. Not a gift card, not another candle, but something that could only ever be for them.</p>
      <p>${esc(site.name)} began with a feeling many of us know. The people we love most are often far away, busy lives get in the way, and when a birthday or an anniversary comes round we want to give something that shows how much they mean to us. The shops are full of templates you have to design yourself, late at night, hoping it looks all right.</p>
      <p>So we built the opposite. You answer a few fun questions and add your favourite photos, and we do the rest: a real, glossy magazine all about them, with their own cover, a cover story written about them, full page photos, and notes from the people who love them. It is ready in minutes and can reach them anywhere in the world.</p>
      <h2>Our promise</h2>
      <ul class="ticks">
        <li>Every magazine is made for one person only. No two are ever the same.</li>
        <li>If something is not right, we put it right, free.</li>
        <li>Your photos are used only for your magazine and are deleted after 30 days.</li>
        <li>No ads, no selling your details, ever.</li>
        <li>Real reviews only. We will never make one up.</li>
      </ul>
      <h2>Talk to us</h2>
      <p>We are a small team and we read every message. Email <a href="mailto:${esc(site.email)}">${esc(site.email)}</a> and we usually reply within a day.</p>
      <p class="small">${esc(site.name)} is a trading name of ${esc(site.company)}, a company registered in the United Kingdom (company number ${esc(site.companyNumber)}).</p>`),
  }));
  await page('/privacy/', layout({
    title: 'Privacy policy', description: 'How we look after your answers, photos and details.', path: '/privacy/',
    body: wrap('The small print', 'Privacy policy', `
      <p>This policy explains how ${esc(site.company)} (trading as ${esc(site.name)}) uses your information. We collect as little as we can, and only to make and deliver your magazine.</p>
      <h2>What we collect</h2><ul><li>Your answers and photos for the magazine</li><li>Notes, photos and voice notes that family and friends add through your private link, and any voice note you record yourself</li><li>Your email address, and the delivery address for printed copies</li><li>Payment details, which are handled by our payment provider. We never see your card number.</li></ul>
      <h2>How we use it</h2><p>Only to design, print, deliver and support your order. We never sell your information or post your photos anywhere.</p><p>If you join our reminder list, we use your email only to send occasional reminders and news, about one email a month. Every email has a way to leave, or just email us and we will remove you.</p>
      <h2>How long we keep it</h2><p>Photos and answers are deleted 30 days after your order, or 30 days after a gift is delivered. If you send your magazine as a gift, we use the email address you give only to deliver it. Order records are kept as long as the law requires for tax and accounting.</p><p>Family notes and their photos are deleted 60 days after they are written. Voice notes are kept so the code printed in the magazine keeps working for years. Only someone with the code can play one, and we delete any voice note as soon as you or the person who recorded it asks.</p>
      <h2>Who helps us</h2><p>Our website host (which receives your order form), our payment provider, and our print partner (for printed copies only). Each one only receives what it needs.</p>
      <h2>Cookies</h2><p>We do not use advertising cookies unless you say yes. If we add Pinterest measurement, you will be asked first.</p>
      <h2>Your rights</h2><p>You can ask to see, correct or delete your information at any time by emailing <a href="mailto:${esc(site.email)}">${esc(site.email)}</a>. You can also complain to the UK Information Commissioner's Office.</p>`),
  }));
  await page('/terms/', layout({
    title: 'Terms', description: 'The terms for ordering a personalised magazine.', path: '/terms/',
    body: wrap('The small print', 'Terms of sale', `
      <p>These terms apply when you order from ${esc(site.name)}, a trading name of ${esc(site.company)}, company number ${esc(site.companyNumber)}.</p>
      <h2>Your magazine</h2><p>Each magazine is made just for you from your answers and photos, so please check spelling in your preview and proof. You confirm you have permission to use the photos you upload.</p>
      <h2>Prices and payment</h2><p>Prices are shown before you pay. For printed copies, shipping is worked out for the delivery country and shown at our print partner's checkout before you pay. You may see prices in your own currency.</p>
      <h2>Cancellations and refunds</h2><p>Because every magazine is personalised, we cannot accept returns for a change of mind once your magazine has been made. If there is a mistake we can fix, a printing fault, or your magazine arrives damaged, we will put it right free, by fixing it, reprinting it or refunding you. This does not affect your legal rights.</p>
      <h2>PDF magazines</h2><p>Your PDF is for personal use. You are welcome to print as many copies as you like for family and friends.</p>
      <h2>Contact</h2><p><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></p>`),
  }));
  await page('/contact/', layout({
    title: 'Contact us', description: `Questions about your magazine or an order? Talk to the ${site.name} team.`, path: '/contact/',
    body: wrap('We are here to help', 'Contact us', `
      <p>We are a small team and we read every message ourselves. Whether you have a question before you order, want to change something, or something is not quite right, we would love to hear from you.</p>
      <h2>Email us</h2><p><a class="btn" href="mailto:${esc(site.email)}">${esc(site.email)}</a></p><p>We usually reply within one working day. If your message is about an order, please include the email address you ordered with.</p>
      <h2>Quick answers</h2><ul class="ticks"><li><a href="/help/">Delivery times and questions</a></li><li><a href="/refunds/">Refunds and reprints</a></li><li><a href="/privacy/">How we look after your photos</a></li></ul>
      <p class="small">${esc(site.name)} is a trading name of ${esc(site.company)}, a company registered in the United Kingdom (company number ${esc(site.companyNumber)}).</p>`),
  }));
  await page('/refunds/', layout({
    title: 'Refunds and reprints', description: 'Our promise if anything is wrong with your magazine: we fix it, reprint it or refund you.', path: '/refunds/',
    body: wrap('Our promise', 'Refunds and reprints', `
      <p>Every magazine is made for one person, from your own words and photos. We want you to love it. If you do not, tell us and we will put it right.</p>
      <h2>If something is wrong</h2><ul class="ticks"><li><b>A typo or mistake we can fix:</b> we correct it and send your new magazine free.</li><li><b>A printing fault or damage in the post:</b> we reprint it free, or refund you in full.</li><li><b>It never arrived:</b> we reprint and resend it, or refund you.</li></ul>
      <p>Just email <a href="mailto:${esc(site.email)}">${esc(site.email)}</a> as soon as you can, with your order email and a photo if something is damaged.</p>
      <h2>Changing your mind</h2><p>Because each magazine is personalised, we cannot refund a change of mind once it has been made.</p>
      <h2>How refunds are paid</h2><p>Refunds go back to the card or PayPal account you paid with.</p>
      <p class="small">This does not affect your legal rights. See our <a href="/terms/">terms of sale</a>.</p>`),
  }));
  await page('/download/', layout({
    title: 'Your magazine is ready', description: 'Download your finished magazine.', path: '/download/',
    body: `<section class="thanks download"><div class="confetti" aria-hidden="true">${Array.from({ length: 18 }, (_, i) => `<i style="--i:${i}"></i>`).join('')}</div><p class="kicker">Hot off the press</p><h1 id="dl-title">Just a moment, we're fetching your magazine.</h1><p class="lead" id="dl-lead">This usually takes a few seconds after payment.</p><div class="dl-btns" id="dl-btns" hidden></div><p class="small" id="dl-note">We email your magazine to you as well, so it is always safe in your inbox.</p><a class="btn btn-ghost" href="/">Back to the front page</a></section>`,
    scripts: '<script type="module" src="/assets/download.js"></script>',
  }));
  await page('/review/', layout({
    title: 'Leave a review', description: 'Tell us how your magazine went.', path: '/review/',
    body: `<section class="section review-page"><div class="section-head"><p class="kicker">Your review</p><h1>How did it go?</h1><p class="lead" id="rev-intro">Just a moment...</p></div>
      <form id="review-form" class="review-form" hidden>
        <input type="hidden" name="rating" value="0">
        <div class="rev-stars" role="group" aria-label="Your rating">${[1, 2, 3, 4, 5].map(n => `<button type="button" class="rev-star" aria-label="${n} star${n > 1 ? 's' : ''}" aria-pressed="false">&#9733;</button>`).join('')}</div>
        <p class="rev-star-label" id="rev-star-label">Tap the stars</p>
        <label class="field"><span>Tell us about it</span><textarea name="text" rows="5" maxlength="600" required placeholder="Her face when she saw herself on the cover! She read every page twice."></textarea></label>
        <div class="rev-row"><label class="field"><span>Your first name</span><input name="name" maxlength="40" required autocomplete="given-name" placeholder="Emma"></label>
        <label class="field"><span>Where you are <small>(optional)</small></span><input name="place" maxlength="40" placeholder="Leeds, UK"></label></div>
        <label class="field rev-photo"><span>Add a photo <small>(optional: the magazine, or the moment they opened it)</small></span><input type="file" name="photo" accept="image/*"></label>
        <img id="rev-preview" class="rev-preview" alt="" hidden>
        <p class="small">Your review, first name and photo will be shown on our website. Please only share photos of people who are happy to appear.</p>
        <p class="rev-msg" id="rev-msg" hidden></p>
        <button class="btn btn-big" type="submit">Share my review</button>
      </form>
      <div id="rev-done" class="thanks" hidden><p class="kicker">Thank you</p><h2>You have made our day.</h2><p class="lead">Your review is now on our website, helping someone else find the perfect gift.</p><a class="btn" href="/">Back to the front page</a></div>
    </section>`,
    scripts: '<script type="module" src="/assets/review.js"></script>',
  }));
  await page('/note/', layout({
    title: 'Write a little note', description: 'Add your own note to a magazine made for someone you love.', path: '/note/',
    body: `<section class="section note-page"><div class="section-head"><p class="kicker">A little note from you</p><h1 id="note-title">Someone special is getting a magazine</h1><p class="lead" id="note-intro">And it would not be complete without a few words from you. Your note is printed inside, signed with your name.</p></div>
      <form id="note-form" class="note-card">
        <label class="field"><span>Your name, as you would sign a card</span><input name="from" maxlength="30" required autocomplete="given-name" placeholder="Grandma"></label>
        <label class="field"><span>Your note</span><textarea name="msg" maxlength="110" required placeholder="You light up every room you walk into. Love you always."></textarea></label>
        <small class="note-count" id="note-count">0 / 110</small>
        <div class="note-extras">
          <label class="photo-drop photo-mini note-photo"><span><b>+</b>Add a photo of you two <small>(optional)</small></span><input type="file" name="photo" accept="image/*"></label>
          <div class="note-voice"><p class="note-voice-head"><b>Say it out loud too</b> <small>(optional)</small></p><p class="small">Record a voice note. A code printed beside your note lets them scan it and hear you, for years to come.</p><div id="note-rec"></div></div>
        </div>
        <p class="small">How it will look in the magazine:</p>
        <p class="note-preview" id="note-preview">You light up every room you walk into. Love you always.<b>Grandma</b></p>
        <p class="rev-msg" id="note-msg" hidden></p>
        <button class="btn btn-big" type="submit">Add my note</button>
        <p class="small">Only the person making the magazine sees your note and photo, and they are printed in their magazine. We delete them after 60 days. A voice note is kept so the printed code keeps working, and we delete it whenever you ask.</p>
      </form>
      <div id="note-done" class="thanks" hidden><p class="kicker">Thank you</p><h2>Your note is in.</h2><p class="lead" id="note-done-lead">It will be printed in the magazine, signed with your name.</p><p class="small">Want to make one for someone you love?</p><a class="btn" href="/">See the magazines</a></div>
    </section>`,
    scripts: '<script type="module" src="/assets/note.js"></script>',
  }));
  // Where the codes printed in a magazine lead: a voice note, played in one tap.
  await page('/listen/', layout({
    title: 'A voice note for you', description: 'A voice note from the pages of your Cover Story magazine.', path: '/listen/', noindex: true,
    body: `<section class="section listen-page"><div class="listen-card"><p class="kicker" id="listen-kicker">From the pages of your magazine</p><h1 id="listen-title">Someone recorded this, just for you</h1><button type="button" class="listen-play" id="listen-play" aria-label="Play the voice note"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></button><div class="listen-bar" aria-hidden="true"><i id="listen-fill"></i></div><audio id="listen-audio" preload="metadata"></audio><p class="small" id="listen-msg">Tap to listen. Turn your sound up.</p><p class="small listen-foot">Made with love, and <a href="/">Cover Story</a>.</p></div></section>`,
    scripts: '<script type="module" src="/assets/listen.js"></script>',
  }));
  // A private gift page: the birthday love magazine in every design, each opening
  // the maker with the gift code filled in. Not linked anywhere, not indexed.
  const giftMags = ['birthday-love-magazine'].map(s => allMags.find(m => m.slug === s)).filter(Boolean);
  const giftLink = (m, d) => `/make/?m=${m.slug}&d=${d}&t=cards${site.giftCode ? `&code=${encodeURIComponent(site.giftCode)}` : ''}`;
  await page('/gift/her-birthday/', layout({
    title: 'A birthday gift for her', description: 'Make a beautiful birthday magazine for the love of your life.', path: '/gift/her-birthday/', noindex: true,
    body: `<section class="section gift-page" data-expires="${esc(site.giftExpires || '')}"><div class="gift-expired" hidden><p class="kicker">Sorry</p><h1>This gift link has expired</h1><p class="lead">It was a private link, open for a short time only. You can still make a magazine for someone you love.</p><a class="btn" href="/">See the magazines</a></div><div class="gift-live"><div class="section-head"><p class="kicker">A gift, just for you</p><h1>Make her birthday unforgettable</h1><p class="lead">Choose the design you love. Answer five quick questions, add three photos, and we fill all 24 pages for her. It is completely free.</p></div>
      <ol class="gift-steps"><li><b>Pick a design</b>Tap any cover below. You can flip through all 24 pages before you finish.</li><li><b>Answer a few questions</b>Her name, her age, what you call her, a short letter and three photos. Everything else is optional.</li><li><b>Choose her day</b>Tick "It's a gift" and pick the date. You get your own copy straight away to check, and she gets hers on her day.</li></ol>
      ${giftMags.map((m, i) => `<div class="gift-mag"><div class="gift-mag-head"><h2>${esc(m.title)}</h2>${i === 0 ? '<span class="gift-tag">Made for her</span>' : ''}<p>${esc(m.short)}</p></div><div class="gift-designs">${designsFor(m).map(d => `<a class="gift-design" href="${giftLink(m, d)}">${renderCover(m, designExamples(m, d)[0].values, { palette: designExamples(m, d)[0].palette, portraitOpts: designExamples(m, d)[0].portrait, photos: samplePhotos(designExamples(m, d)[0]), design: d })}<span>${esc(DESIGNS[d].label)}</span></a>`).join('')}</div></div>`).join('')}
    </div></section>
    <script>(function(){var g=document.querySelector('.gift-page'),e=Date.parse(g.dataset.expires);if(e&&Date.now()>e){g.querySelector('.gift-live').hidden=true;g.querySelector('.gift-expired').hidden=false;}})();</script>`,
  }));
  await page('/thanks/', layout({
    title: 'Thank you', description: 'Your magazine is on its way.', path: '/thanks/',
    body: `<section class="thanks"><div class="confetti" aria-hidden="true">${Array.from({ length: 18 }, (_, i) => `<i style="--i:${i}"></i>`).join('')}</div><p class="kicker">Order received</p><h1>Stop the press! Your magazine is in the works.</h1><p class="lead" id="thanks-lead">Digital magazines are ready to download straight after payment, and we email them to you too. Printed copies are printed near the lucky person and posted, and our print partner emails you when it ships.</p><div class="thanks-pdf" id="thanks-pdf" hidden><p><b>Your PDF copy is ready now.</b> Send it on the day while the printed copy is in the post, or keep it safe on your phone.</p><a class="btn btn-big" id="thanks-pdf-link" href="#">Download the PDF</a><small>Please save it. For your privacy the link is removed after 30 days.</small></div><a class="btn btn-ghost" href="/">Back to the front page</a></section>
    <script>(function(){var q=new URLSearchParams(location.search),id=q.get('id');if(q.get('printed')!=='1'||!/^[A-Za-z0-9_-]{6,80}$/.test(id||''))return;document.getElementById('thanks-lead').textContent='Thank you! Your copy is being printed near the lucky person and posted. Our print partner emails you when it ships.';document.getElementById('thanks-pdf-link').href='/api/order/file?id='+encodeURIComponent(id)+'&f=pdf&dl=1';document.getElementById('thanks-pdf').hidden=false;})();</script>`,
  }));
  await page('/404.html', layout({
    title: 'Page not found', description: 'This page has gone to print somewhere else.', path: '/404.html',
    body: `<section class="thanks"><p class="kicker">Error 404</p><h1>This page has gone missing, sources say.</h1><a class="btn" href="/">Back to the front page</a></section>`,
  }));
}

async function feeds() {
  const urls = ['/', ...mags.flatMap(m => designsFor(m).map(d => magPath(m, d))), '/make/', '/ideas/', ...ideas.map(i => `/ideas/${i.slug}/`), '/help/', '/about/', '/contact/', '/refunds/', '/privacy/', '/terms/'];
  await page('/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${abs(u)}</loc></url>`).join('\n')}\n</urlset>\n`);
  await page('/robots.txt', `User-agent: *\nAllow: /\nDisallow: /note/\nDisallow: /listen/\nDisallow: /gift/\nSitemap: ${abs('/sitemap.xml')}\n`);
  // Pinterest catalog feed: one row per magazine and edition, so each shows up as a shoppable product.
  const csvCell = s => `"${String(s).replace(/"/g, '""')}"`;
  const rows = [['id', 'title', 'description', 'link', 'image_link', 'additional_image_link', 'price', 'availability', 'condition', 'brand', 'item_group_id', 'google_product_category', 'product_type']];
  for (const m of mags) for (const d of designsFor(m)) for (const t of tiers) {
    const exs = designExamples(m, d);
    const sig = isBase(m, d);
    rows.push([sig ? `${m.slug}-${t.id}` : `${m.slug}-${d}-${t.id}`, `${m.searchTitle}${sig ? '' : `, ${DESIGNS[d].label} Design`} (${t.label})`, `${m.description} ${t.blurb}.`, abs(magPath(m, d)), abs(pinSrc(m, exs[0], d)), exs.slice(1).map(ex => abs(pinSrc(m, ex, d))).join(','), `${t.gbp.toFixed(2)} GBP`, 'in stock', 'new', site.name, m.slug, 'Media > Magazines & Newspapers', `Personalised gifts > ${m.occasion}`]);
  }
  await page('/feed/pinterest-catalog.csv', rows.map(r => r.map(csvCell).join(',')).join('\n') + '\n');
}

// ---------- run ----------

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(new URL('assets/', root), new URL('assets/', dist), { recursive: true });
await cp(new URL('pins/', root), new URL('pins/', dist), { recursive: true });
await cp(new URL('src/covers.js', root), new URL('assets/covers.js', dist));
await cp(new URL('src/love.js', root), new URL('assets/love.js', dist));
await cp(new URL('src/heart.js', root), new URL('assets/heart.js', dist));
await cp(new URL('src/concepts.js', root), new URL('assets/concepts.js', dist));
await cp(new URL('src/qr.js', root), new URL('assets/qr.js', dist));
await home();
for (const m of mags) for (const d of designsFor(m)) await magazinePage(m, d);
await makerPage();
await ideasPages();
await simplePages();
await feeds();
await oldPhones();
await fingerprint();
console.log(`Built ${site.name} into dist/`);

// Older phones (and the browser inside some chat apps) run older browsers.
// Scripts are rewritten into older JavaScript, and cover sizes use
// calc(N * var(--cq)) so site.js can size covers where cqw units don't exist.
async function oldPhones() {
  const { transform } = await import('esbuild');
  const dir = new URL('assets/', dist);
  for (const f of (await readdir(dir)).filter(f => f.endsWith('.js'))) {
    const file = new URL(f, dir);
    const { code } = await transform(await readFile(file, 'utf8'), { loader: 'js', format: 'esm', target: ['chrome64', 'safari12', 'firefox67'], supported: { 'dynamic-import': true } });
    await writeFile(file, code);
  }
  const css = new URL('covers.css', dir);
  await writeFile(css, (await readFile(css, 'utf8')).replace(/(--cq:\s*)?(-?\d*\.?\d+)cqw\b/g, (m, own, n) => (own ? m : `calc(${n} * var(--cq))`)));
}

// Browsers keep /assets/ files for a week, so every link to a script or
// stylesheet gets ?v=<content hash>. A changed file then gets a new address
// and nobody is left with an old copy after an update.
async function fingerprint() {
  const { createHash } = await import('node:crypto');
  const dir = new URL('assets/', dist);
  const names = (await readdir(dir)).filter(f => /\.(js|css)$/.test(f));
  const hash = {};
  for (const f of names) hash[f] = createHash('sha1').update(await readFile(new URL(f, dir))).digest('hex').slice(0, 10);
  // Scripts import each other ('./covers.js'), so rewrite those first, then hash again.
  // A few passes so a change deep down (covers.js) reaches every file that imports it.
  for (let pass = 0; pass < 4; pass++) {
    for (const f of names.filter(f => f.endsWith('.js'))) {
      const file = new URL(f, dir);
      const src = await readFile(file, 'utf8');
      const out = src.replace(/(from\s+|import\()(['"])\.\/([\w-]+\.js)(?:\?v=[0-9a-f]+)?\2/g, (m, a, q, n) => (hash[n] ? `${a}${q}./${n}?v=${hash[n]}${q}` : m));
      if (out !== src) { await writeFile(file, out); hash[f] = createHash('sha1').update(out).digest('hex').slice(0, 10); }
    }
  }
  const pages = [];
  const walk = async d => { for (const e of await readdir(d, { withFileTypes: true })) { const u = new URL(e.name + (e.isDirectory() ? '/' : ''), d); if (e.isDirectory()) { if (e.name !== 'pins') await walk(u); } else if (e.name.endsWith('.html')) pages.push(u); } };
  await walk(dist);
  for (const u of pages) {
    const html = await readFile(u, 'utf8');
    await writeFile(u, html.replace(/(["'])\/assets\/([\w-]+\.(?:js|css))\1/g, (m, q, n) => (hash[n] ? `${q}/assets/${n}?v=${hash[n]}${q}` : m)));
  }
}
