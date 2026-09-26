# PrintPals

Free printable worksheets for children: https://printpals.web.app

A static website (no server, no build tools). Everything is made in the visitor's
browser, so nothing typed is ever sent or stored.

## Worksheet makers
- Name tracing (one page per name, class lists), alphabet A to Z (picture words, stroke order),
  numbers 0 to 20 (ten frames, number words, stars to colour), addition and subtraction
  (answer key, new set each click), word search maker (answer key), spelling practice.
- Batch 1 (2026-09-26): visual routine charts (weekly tick chart or picture cards to cut out),
  money in 10 currencies (count, buy, make the amount), story sums starring the child,
  times tables (practice, test, missing numbers, certificate), telling the time (read or draw),
  maze maker (1, 2 or 4 per page, solution), crossword maker (your own words and clues),
  reward and sticker charts. Homepage is grouped: writing, maths, puzzles, charts.

## How it works
- `public/js/glyphs.js`: hand-drawn single-stroke handwriting letters (A-Z, a-z, 0-9) with
  stroke order; `drawText()` draws model, dotted trace or ghost letters with green start dots.
- `public/js/sheet.js`: page engine in millimetres (A4 / US Letter), header, guide lines, footer.
- `public/js/tools.js`: the first six makers (`MAKERS`), each returns SVG pages.
- `public/js/tools2.js`: batch 1 makers, added to `MAKERS`. Thumbnails are `public/img/thumb-<id>.webp`
  (480 px wide screenshots of the preview).
- `public/js/app.js`: form to preview, print (exact paper size via @page), "New set".
- `build.py`: generates index.html, the tool pages (SEO titles, FAQ, JSON-LD), sitemap, robots.
  Edit texts there, then run `python3 printpals/build.py`.

## Publish
Hosted on Firebase Hosting, site `printpals` inside the Firebase project `brainlings-6b9cf`
(same Google account, separate website). From this folder:
`firebase deploy --only hosting:printpals --project brainlings-6b9cf`

## Quality
Test every change by printing to PDF (Playwright page.pdf) and looking at the pages before publishing.

## Money later
Free tools bring visitors; then premium worksheet packs ($1.99 to $3.99), a Pro option
($1.99 a month or $9.99 a year), ads once there is traffic (needs a custom domain, about $10 a year).
