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
- Batch 2 (2026-09-26, `public/js/tools3.js`): photo to colouring page (line art made in the browser,
  photo never uploaded), story sheets starring the child, picture or word bingo (unique cards, class sets,
  calling cards), birthday party pack (poster, All About Me, word search, bingo, thank-you cards),
  certificates (landscape, 4 designs), dot to dot (count in 1s, 2s, 5s, 10s or A to Z), picture sudoku
  (4x4 and 6x6, one answer checked), b/d and p/q mix-ups on tinted paper. Pages can be landscape
  (`landscape`), header-free (`bare`) or tinted (`tint`); Print waits for pictures to load.
- Batch 3 (2026-09-26, `public/js/tools4.js`): sight words (Dolch, Fry, UK Year 1), CVC words with pictures,
  number bonds (part-whole), flashcards (double-sided option, backs mirrored), chore charts per child,
  feelings chart (12 drawn faces, weekly check-in, calm down ideas), scavenger hunts, matching (incl. shadows).
- Batch 4 (2026-09-26, `public/js/cursive.js`, `public/js/tools5.js`): joined handwriting (UK style: joins from the
  baseline or the top after o r v w; b g j p q s x y z do not join; round letters joined on their left side),
  world alphabets (Spanish, French, German, Italian, Portuguese, Swahili, Yoruba, Igbo, Hausa, Twi), word families,
  rhyming, number lines, fractions, colour by number (pixel pictures, sums option), spot the difference.
- Review (2026-09-26): hand-drawn colouring pages (`public/js/colouring.js`, 23 vector pictures, bubble-letter names,
  personalised colouring book); photo line art now solid (binarised, thickened); more stories (10), colour by number
  pictures (12), dot to dot shapes (15), beach and supermarket hunts; bigger coins, dots, fractions and number lines;
  homepage search box and a category menu on phones.
- Batch 5 (`public/js/tools6.js`): place value (base ten blocks), shapes and symmetry, measuring (real-size rulers,
  print at 100%), graphs and tallies, reading log (log, bookshelf, challenge), handwriting paper, story writing
  (starters and comic strips), name labels (desk strips with alphabet and 0 to 20, book and peg labels).
- Batch 6 (`public/js/tools7.js`): pre-writing lines, cut and paste, homework planner, crowns and masks, weather
  chart, cards to colour (inside printed upside down for folding). Alphabets now 15 languages; colouring 31 pictures.
- Batch 7 (`public/js/tools8.js`): calendar maker (special days parsed from 'day month text' lines), number of the day,
  greater than and less than (crocodile), phonics digraphs and blends, opposites, life cycles, family tree, road trip pack.
- Batch 8 (`public/js/tools9.js`): hundred square (fill in, patterns, jigsaw pieces), alphabet order, colour words,
  how to draw (6 steps built from a colouring picture; `DRAW_ORDER` lists parts in the order an artist draws them),
  fix the sentence, bookmarks, paper clock craft, snakes and ladders with dice net and counters.
- Batch 9 (`public/js/tools10.js`): odd one out (painted pictures in groups, ODD_CLASH keeps close groups apart),
  roll and draw (ROLL_THEMES: six drawn options per part), patterns (AB to ABC, gaps), syllables (count, sort, split),
  door hangers (two sides, name, own words), 30 day challenges (4 themes, 14 or 30 days), doubles and halves
  (ladybirds, fair sharing, facts), position words (box and table scenes; circle, write or draw).
- Batch 10 (`public/js/tools11.js`): secret code (picture, number, backwards; own messages), grid copy and finish
  the half (PIXEL designs), finger puppets, handprint keepsakes (handOutline/footOutline), real size height chart,
  days and months plus 'my day today', my body (bodyFigure, face zoom via clip-path, five senses), domino maths and set.
- Arrangement: `ARRANGE` in build.py sets the 7 homepage sections and their learning order (every tool in exactly
  one; the build fails otherwise). Tool pages show 'More in <section>'; the footer is grouped by section.
- Checks: `pp2/fuzz.js` (every option), `pp2/func.js` (new set, paper sizes, print button), a link checker.
- Testing: `pp2/fuzz.js` in the scratchpad tries every option on every tool and flags errors, NaN and anything
  off the page. Run it before every publish.

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
