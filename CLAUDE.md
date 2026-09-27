# Project notes for Claude (read this first)

Owner: Chioma (Director of GRACE AND LOANNES LTD, UK company SC899696, lives in Nigeria).
She trusts Claude to make design and build decisions without asking for approval.
Work on branch `claude/uk-bank-company-account-fw7kdp`.

## How to write (important to the owner)
- Warm, human, emotional. Never robotic.
- NO em dashes or AI-style hyphen breaks in app copy or in chat. Use full stops, commas, colons.
- No Nigerian names in the app or examples (use Chris, Mia, Leo, Emma, Sam).
- Questions and jokes should feel global, not local.
- She hated the first Samesies prototype: "too plain, boring, not funny". Everything must look
  beautiful and feel alive (animation, colour, character), matching how it was described.

## Current focus: BRAINLINGS (first app, Android first, then iPhone)
Kids learning app, ages 4 to 7. Mascot creature: **Bibi** (each child names their own creature).
Tagline idea: "Learn, grow, and hear from the people who love you."

### Core (child side)
- Hatch a unique creature; it grows only when the child learns.
- Games: Feeding Time (counting), Letter Garden (phonics), Shape Builder, Pattern Party,
  Teach Your Creature (child corrects the creature's mistakes).
- Creature grows in a direction matching what the child learns most (numbers = star patterns, letters = book hat).
- Decorate Bibi's home with stars earned; sticker album; storybooks where the child is the hero
  (words highlight as read aloud); seasonal days; birthday party; sing to Bibi (stays on device).
- Real day/night, feelings check-in, surprise moments, dream postcards.
- Bedtime: creature gets sleepy after the parent's time limit and says "See you tomorrow!"
- Everything spoken aloud (pre-readers). Big picture buttons.

### Family connection (the big differentiator)
Family members do NOT need the app: they get a link (WhatsApp/email) to a small web page.
- Letters from home: family records voice note; creature brings an envelope:
  "Chris! You got a message from Mummy! Would you like to hear what Mummy has to say?"
  Buttons: "Yes please!" / "Save it for later" (goes to a letterbox with a glowing dot).
  After listening: offer to send a hug back. If no hug sent, ONE gentle reminder later (end of play or bedtime).
  Parent is told "Chris listened to your message (played it 3 times)".
- Postcards from the creature to the parent with one-tap replies (heart, sticker, voice).
- Missions from Mum (real-life tasks, parent confirms remotely).
- Bedtime messages/stories played when the creature sleeps.
- Later: Guess What Mummy Picked, live hearts ("Mummy is watching!"), growth videos, grandparents/aunties.
- Letters can come from anyone the parent invites. No strangers ever. No child-to-child chat.
- Setup (behind grown-ups gate): child's first name or nickname, age, family circle.
  Parent records the child's name once in their own voice (explained warmly; optional;
  fallback "little friend"). Collect as little data as possible (Families policy, COPPA, UK Children's Code).

### Business
- One-month free trial, clear price up front, reminder 3 days before the trial ends, easy cancel.
- Special moments spread across the month; big "look how much Chris learned" report before trial ends.
- No ads.
- Google Play developer account (organisation, Grace and Loannes Ltd) is paid and identity verified;
  phone numbers still to verify. Apple enrollment submitted but $99 not paid (later).
- Payouts need a proper company bank account (Wise was rejected by KDP; unresolved).

### Tech plan
- Flutter (Android first). Firebase for accounts, storage, messages, push.
  Build APKs via GitHub Actions if the container cannot download the Android SDK.
- `app/` holds an early web prototype shell (page + meadow style) from before the Flutter decision.

### Higgsfield (images, voice, music)
- Budget: ~500 credits total and NO more money. Manage carefully, no approval needed.
- Costs checked: gpt_image_2_5 low 0.25, medium 0.5, high 1.5 credits per image; recraft vector 2.5.
- First Bibi designs (medium, transparent), job ids:
  eaeef090-c16f-4501-b4a0-3dc86e77b30b, dbaa2fdc-0168-48c9-82cc-3ffdf35b093c
  (coral-peach round creature, cream belly, green leaf sprout, big sparkly eyes, soft 3D clay style).
- Images are hosted on d8j0ntlcm91z4.cloudfront.net. The network allowlist was being updated
  so a new session can download them.

## PrintPals (branch claude/printpals, folder printpals/)
OWNER RULE (2026-09-27): every new batch from now on is for PrintPals PLUS (the monthly subscription). Plus must be the best out there,
worth far more than the price, premium in design and features, blue ocean (things others overlook), and must keep parents AND teachers
glued: several designs per product, series and volumes to collect, seasonal drops, things that bring families back every month.
Free printable worksheet website, live at https://printpals.web.app. Kept separate from Brainlings on its own
branch (owner asked). See printpals/README.md. Owner wants quality: test every change by printing to PDF
(Playwright page.pdf) and looking at the pages before publishing.
Batch 1 of the owner's 50 ideas is live (14 tools, 2026-09-26). Money worksheets let parents pick the currency
children count in; it has nothing to do with how the owner is paid (she wants payment in dollars).
Batch 2 is live (22 tools). Owner asked for it to feel more premium. On 2026-09-26 the owner said PrintPals SHOULD
use the 48 Brainlings painted pictures (copied into public/img). `EMOJI_ART` in tools2.js swaps matching emoji
for painted pictures on every sheet.
Owner review 2026-09-26: she wants everything premium and full of content; colouring pages are our own vector drawings
(colouring.js), no fading lines anywhere. 39 tools now. Batch 4 is live (38 tools, 2026-09-26): joined handwriting, world alphabets, word families, rhyming, number lines,
fractions, colour by number, spot the difference. PLUS EDITIONS 3 (VERSION 49, 180 tools, tools29.js): Times Tables Club (card and badges, one table a
week: learn with number line, fill gaps, mixed, story sums, Friday speed test; levels start/next/master; answers), Time Month
(clock() from tools2: read, draw the hands, my day, Friday check, clock craft, answers; easy/harder), Phonics Month (s a t p,
i n m d, g o c k, e u r h from PHONICS_BOOKS pictures, circle hunt, first sound, Friday blending words and a sentence), Tiny
Hands Month (ages 2 to 3: follow the path, dot and dab shapes, snip strips, find the same, busy cmScene colouring). Friday
weekBadge is skipped where it would overlap the day strip. 159 pins waiting. PLUS EDITIONS 2 (VERSION 48, 176 tools, tools28.js): Colouring Month (OWNER RULE: colouring pages
must be busy full scenes, never one lonely picture; 40 scenes in 8 worlds via cmScene: background + big main art + 6 friends,
a challenge on every page, 40 star plan, draw your own scene, gallery; ~45 pages), Puzzle Month (20 daily packRun puzzles with
packBadge day labels, passport, answer keys; easy/medium/hard), Writing Month (16 prompts with word banks, sentence starters,
draw first box, 4 Friday best story pages; starter/writer), Morning Work Month (teacher: 20 daily sheets with word, 4 sums,
read and circle, draw; class tracker, answer key, a certificate per child; levels r/y1/y2). 147 pins waiting. PLUS EDITIONS (owner idea 2026-09-27: grow favourite free tools into premium month versions
that clearly beat the free ones; VERSION 47, 172 tools, tools27.js): Handwriting Month (20 daily pages: warm-up, letter or word
of the day, name daily; levels starter/steady/confident), Maths a Day (20 days, warm-up, sums growing daily, story problem with
the name, Friday checks, answer key; levels counting/adding/bigger), Reading Month (16 sight words in 4 weeks, Friday stories,
word wall; sets 1 and 2), Family Month Organiser (up to 3 children: calendar, routines, chore charts, star charts, Sunday
check-ins; this or next month). All four: looks meadow/ocean/candy/space, month plan with 20 stars, day strip, Friday badges.
build.py EDITIONS maps free tools to their edition; free tool pages show a 'Want a whole month of this?' link above the preview.
Ideas for more editions: colouring month, puzzles month, a teacher class edition. Their 12 pins are at the FRONT of the file 3
queue (135 waiting). PLUS STAGE 10 (VERSION 46, 168 tools, tools26.js): Safari Explorer kit (explorer series 4: 8 cards,
height chart vs child, who am I riddles, zoo bingo), Detective Academy (academy series with Superhero and Space: ID, fingerprint lab,
secret codes via packRun secretcode custom, two logic mysteries CASES with upside down answers, case notebook, training),
All About My Special Person (id grownupbook, gift book for any grown-up typed in 'who': portrait, favourites, always says,
interview, love coupons, World's Best award; looks rose/sky/sunny; renamed from Grown-Up to avoid a hyphen break on pins),
Farm Friends kit (ages 2 to 6: cards with baby names and sounds, mummies and babies, who says what, what the farm gives us).
Helpers drawAndTellPage, factCardsPage. Home age buttons fixed (owner said they did nothing): picking an age now keeps sections collapsed,
puts the closest matches first (narrowest age range), updates the section counts and shows 'Showing N printables for age X' with
a Show all ages button. 123 pins waiting (file 3 takes 100). PLUS STAGE 9 (VERSION 45, 164 tools, tools25.js): Ocean Explorer kit (explorer series with dino and
space: 8 creature cards by zone, down to the deep, bingo, design, ocean promise), Little Gardener kit (optional plant name: seed diary,
growth chart in cm, parts of a plant with word bank, what plants need, bug hunt, jobs), Love and Kindness pack (Feb drop, looks
pink/rainbow: 28 day kindness calendar, love notes KIND_NOTES, I love you because, compliment cards, bingo), Lunar New Year pack
(12 Great Race cards, find my animal chart for 14 years, red envelope and paper lantern crafts, wishes; year auto: next festival).
New SEASON_ART paperlantern and hearts. Pins: 111 waiting; winter, lunar and kindness pins held before Easter at the end, so file 3
takes the first 100 and the rest roll into file 4. PLUS STAGE 8 (VERSION 44, 160 tools, tools24.js): My Sight Word Readers 1 to 4 (5 words each: trace,
write, colour the bubbles, then a 4 scene story starring the child with the words in colour; Easier/Harder = book), Dinosaur Explorer
kit (8 dino cards with say-it names, how long was it chart, dig counting, design a dino, words, colouring, maze), Space Academy
(8 planet cards, planet order rhyme, countdown tracing, join the stars: Plough, Cassiopeia, Orion; astronaut training), Winter
Wonderland pack (seasonal drop for Jan/Feb: counting, words, finish the snowflake, roll a snowman, bingo, bucket list, goals for
the year; looks snowy/frosty; in the Seasons shelf group). Helpers picGridPage, colourSentence. 99 pins wait for file 3 (winter
and Easter pins held at the end). PLUS STAGE 7 (VERSION 43, 156 tools, tools23.js): My Handwriting Books 1 to 4 (pencil power: prewriting
lines, zigzag, castle, loops and shapes; a to m; n to z with a picture, trace/fade/write rows and a word per letter; capitals, my name,
first sentences; Easier/Harder = book; seriesCover helper with an "Inside this book" list), Superhero Academy (hero ID card, design
your hero, 20 kindness missions, training week, mask and badges; looks red/blue/purple), Flying Adventure kit (name, destination,
who we visit; boarding passes, travel passport stamps, airport bingo, window and flight log, hand luggage, plane colouring, maze,
Brave Flyer award), My Feelings Book (10 feelings pages, body clues, things that help, weekly check-in). Renamed handLetterPage
(letterPage exists in tools.js). 87 pins now wait for file 3. PLUS STAGE 6 (VERSION 42, 152 tools, tools22.js): My Maths Books 1 to 4 (counting to 10, adding and taking away,
numbers to 20 and doubles, times tables; Easier/Harder = book; seriesCert helper), Outdoor Adventure Passport (24 missions to stamp,
season spotter sheets, bug hunt, nature bingo, sky and leaf lab), Family Fun Night kit (month plan, cinema tickets, snack bar, 24 charades,
family quiz, bucket list, awards), Little Chef Cookbook (8 recipes, sweet/savoury filter, own recipe, shopping list). Names renamed to avoid
clashes: mathsNumberPage, FAMILY_BUCKET. 75 pins now wait for file 3. PLUS STAGE 5 (VERSION 41, 148 tools, tools21.js): Tooth Fairy kit (letter, Brave Tooth award, 20 tooth tracker,
envelopes; looks sparkle/rainbow/starry), Big Sibling kit (sister/brother/sibling, baby name), Treasure Hunt (indoor or garden clues,
pirate/birthday/fairy, map, award), My Phonics Books 1 to 4 (s a t p i n; m d g o c k; e u r h b f l; sh ch th ng ck qu; sound pages,
sound-button reading, certificate to next book; Easier/Harder = book), Boredom Buster jar (48 sticks in 4 colours, named label).
Shelf now has Phonics Books and a Keepsakes and kits group. 15 new pins added to next-file-start.json (63 waiting for file 3).
PINTEREST FILES (owner rule): files of 100 pins, named PrintPals-pins-<n>-UPLOAD-ON-<date>.csv (max 100 scheduled, 14 days ahead,
8 pins a day). File 1 = 55 pins (only 55 slots free), upload 4 Oct 2026, pins 12 to 18 Oct. File 2 = 100, upload 19 Oct, pins 20 Oct to 1 Nov.
File 3 upload 2 Nov: first 100 of 159 waiting pins in printpals/pinterest/next-file-start.json (Easter held for spring), add 50 new ones.
Style B pins: pins/b-<key>.jpg made by pinterest/pinB.js from jobsB.json. PLUS STAGE 4 (VERSION 40, 143 tools, tools20.js): Little Learner Levels (10 levels, journey map, 5 challenges,
badge sheet, certificate pointing to the next level; Easier/Harder steps levels), Letters from Poppy (the logo character; letter, challenge page,
write back page for each month), TEACHER PLAN tools ('teacher': True gates to the teacher plan): class seasonal books (Christmas/Halloween/
Diwali/Easter/Spring, a named book for every child), end of year memory books (teacher message, friends page, then and now), classroom
displays (birthday chart from 'Mia 12 March', job cards (checkbox is 'jobcards', textarea 'jobs'), welcome bunting with names).
/my-shelf page: app.js records every print in localStorage pp-made {id, v}; shelf shows collected vs to collect; toast after Plus prints.
Test scripts must skip my-shelf.html. Full fuzz can run out of memory on class tools: run with SKIP=... and test those with fz2.
Pins file PrintPals-pins-new-5.csv (2 to 10 Oct, 11:30). PLUS STAGE 3 (VERSION 38, 138 tools, tools19.js): Easter and spring pack (egg hunt guide + 12 rhyming clue cards,
decorate the eggs, colouring, puzzles; looks pastel/meadow/sunny), My Journal series (Volumes 1 to 4, 10 prompts each, completion page
points to the next volume), storybook cover looks (rainbow/ocean/garden/space). Home plus-band changes title and pack links by month
(script after the band). Journal pin CSV. Easter pin should be scheduled in February 2027 (Easter is 28 March 2027). PLUS STAGE 2 (VERSION 37, 136 tools, tools18.js): birthday time capsule (9 pages, looks confetti/balloons/stars,
yearly collectible), Diwali pack (rangoliArt makes a new symmetrical pattern each time; finish the rangoli; looks marigold/jewel/peacock),
Thankful pack (Thanksgiving or Harvest; thankful turkey with numbered lines, gratitude leaves, place cards; looks autumn/cosy/pumpkin),
storybooks now 8 (snow, jungle, kind added; colouringArt falls back to SEASON_ART). Plus page has an 'Everything in Plus' library grid;
home plus-band is 'New in Plus'. Seasonal pins file 2 (diwali, timecapsule, thankful). NEXT: Easter/spring, storybook volumes with cover looks,
monthly Plus drop, journals series. PLUS STAGE 1 (VERSION 36, 133 tools, tools17.js): Halloween pack (16 pages, looks pumpkin/moon/candy),
Christmas activity book (cover, Advent calendar, 24 day pages with a family moment + colour/count/trace/draw, letter to Santa or Father Christmas,
Nice List, colouring, puzzles, gift tags, bunting, thank you notes; looks classic/snowy/ginger), My Name Book (page per letter with picture,
tracing and an affirmation; repeated letters get NAME_WORD2; poster; looks rainbow/ocean/garden/space). Owner wants every premium product in
several designs, series/volumes with new designs, and 'glue' that brings families back monthly. Plus invitation in app.js after the 3rd free
print (every 5 days, never for Plus): Sep/Oct Halloween, Nov/Dec Christmas, else monthly plan. Seasonal pins CSV (board 'Holiday Printables for Kids').
NEXT: birthday time capsule, Diwali, Thanksgiving, Easter, storybook volumes, monthly Plus drop, Plus library page. PINTEREST (VERSION 35): 130 pins 1000x1500 at public/pins/<id>.jpg (made by printpals/pinterest/pin.js from
sheet screenshots via pinsrc.js; run from scratchpad pp2 layout). Bulk upload CSVs (max 200, Publish date must be within 14 days) in
printpals/pinterest/: part 1 = 65 pins 29 Sep to 11 Oct 2026, part 2 = 65 pins 12 to 24 Oct (upload on or after 10 Oct). makecsv.py <start> <1|2> <out>.
8 boards must exist with exact names (see makecsv.py BOARDS). Plus tools never say free: 'Try 7 days free'. Tool pages have a Save to Pinterest
button. PINTEREST_VERIFY in build.py takes the p:domain_verify code once the owner sends it. Full site review live (VERSION 34, 130 tools = 120 makers + 10 packs): home shows 6 cards per
section (4 on phones) with Show all, search/age/jump/hash open everything; phone cards are compact (picture left); feature boxes swipe on phones;
New/Plus badges sit in the card corner; footer shows 6 per category + See all; Print button pinned in the panel. Sheet fixes: pack covers
(name line clear of rainbow), family tree labels above frames, crocodile rows never empty, story dice fit, sibling rows taller, crown stars.
Count tools with len(TOOLS), never by hand. Batch 16 live (VERSION 33, 130 tools, tools16.js): paper games (noughts and crosses, dots and boxes,
word guess with a monster instead of hangman, squiggles), scissor skills (5 levels), ten frames, story sequencing (6 stories, cut and glue),
screen-free coding (BFS always solvable, answers), animal fact files (8 animals + own topic), pet care chart (6 pets), holiday diary.
NOTE tools.js already has tenFrame(); batch 16 uses drawTenFrame. Always grep new helper names across all js files. Batch 15 live (VERSION 32, 123 tools, tools15.js): reading comprehension (6 stories starring the child, answers),
maths minute (30 facts, score tracker), savings jar (any currency, spend/save/share labels), love coupons, packing lists (6 trips),
family meal planner (week plan, shopping list, chef menu), healthy habits posters (handwash, sneeze, dressed, toilet). Batch 14 live (VERSION 31, 116 tools, tools14.js): party invitations (4 per page), countdown calendar
(any occasion, 24/12/7 days with family activities), tooth brushing chart, family rules poster, babysitter info sheet (phone numbers only by hand),
kitchen science (6 experiments), letter writing kit (paper, envelope net, guide); storybook now has 5 stories (dino, garden added). Batch 13 live (VERSION 30, 112 tools, tools13.js): big feelings toolkit, sleep pack, food explorer, social stories,
personalised storybook (Plus, 3 stories), conversation cards, gratitude journal, potty training pack. Batch 12 live (VERSION 29, 104 tools, tools12.js): home language flashcards (6 languages + type your own), story dice,
milestone signs, screen time tickets, sibling peace pack, lunchbox notes, ready for school pack (free), holiday learning plan (Plus).
#plusbox is hidden in print. PAYMENTS LIVE (VERSION 28, Stripe account acct_1UJzb8BlA0P4Xlju, Grace and Loannes Ltd): public/js/plus.js holds the 3 Stripe
payment links (monthly $4.99, yearly $39, teacher $59, all live, USD, tax inclusive) and the customer portal link. Plus tools
(monthplan, activitybook = any plan; classpack = teacher) get 7 free days per device (pp-plus-trial), then print is locked and the
plans show. Stripe redirects to /plus?plan=..&session_id=cs_live_.. which saves pp-plus on that device; other devices unlock with the
receipt number (format check only). No server yet: renewals/cancellations are not checked (next step: Firebase function with the
Stripe secret key, needs Blaze). Terms page at /terms. PAYMENT PLAN + batch 11 live (92 tools, VERSION 27): free forever core; PrintPals Plus $4.99/month or $39/year with 7 day
trial (monthly learning plan, personalised activity book up to 40 pages); Teacher $59/year (class packs). All Plus features are
'free while we launch' (tools have 'plus': True, /plus pricing page) until the owner sets up a payment provider (recommended a
merchant of record such as Lemon Squeezy or Paddle: handles global VAT; licence keys can unlock Plus without a server). Also new:
learning passport (free), easy-read letters toggle (Andika) on every sheet. Activity book = also a product to sell on KDP/Etsy
(untick 'Show printpals.web.app'). BLUE OCEAN update live (88 tools, VERSION 26, see printpals/BLUE_OCEAN.md): owner asked to solve problems competitors ignore.
New 'Packs' section first: weekly learning pack (pack.js makePack: CURRICULUM by age group 3/4/5/6 reusing other makers,
cover, star chart, day badges, certificate, grown-up guide, answers; siblings textarea "Leo 6"), quick packs (restaurant, rainy,
sick, bedtime, outdoors), family far away (postcards, video call bingo, interview, news, countdown). app.js: Ink saver (white
fills, grey pictures and emoji), remember child's name on device (pp-child, replaces untouched example names), Easier/Harder
buttons (LEVELS in build.py). Site: AGES per tool + age filter on home, About, Privacy, 404, breadcrumbs, per-tool share images
(img/og/*.jpg made by pp2/og.js), app icons + manifest, one script bundle js/pp.js (JS_FILES), fonts self-hosted in /fonts.
Batch 10 live (85 tools, tools11.js, VERSION 25): secret code, copy the picture, finger puppets, handprint
keepsakes, height chart (real size, 4 strips), days and months, my body (drawn child), domino maths. Batch 9 live (77 tools, tools10.js, VERSION 24): odd one out, roll and draw (monster/robot),
patterns, syllables, door hangers, 30 day challenges, doubles and halves, position words. Batch 8 live (69 tools, tools9.js, VERSION 23): hundred square, alphabet order,
colour words, how to draw (step by step from the colouring pictures, DRAW_ORDER = artist order), fix the sentence, bookmarks, paper clock craft,
snakes and ladders. Batch 7 live (61 tools): calendar, number of the day, greater/less than, phonics sounds, opposites, life cycles,
family tree, road trip pack. Batch 6 live (53 tools): pre-writing lines, cut and paste, homework planner, crowns and masks, weather chart, cards to
colour; 15 alphabet languages; 31 colouring pictures. The owner's list of 50 is done. Batch 5 live (47 tools): place value, shapes, measuring, graphs, reading log, handwriting paper, story writing,
name labels. Still to do: cut and paste, homework planner, more languages and more colouring pictures.
Higgsfield credits are nearly gone (0.66), so new art needs the owner's say.

## Other projects (paused)
- `samesies/`: daily crowd-guessing web game prototype (owner found it boring; paused).
- "Nearly" (working name): app for long-distance couples/families (photo drops on home screen,
  thinking-of-you tap, same sky, open-when letters, memory book, printed books). Second app, later.
- Domain playsamesies.com was left in the Namecheap cart, not bought.
