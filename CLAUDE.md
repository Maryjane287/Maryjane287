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
fractions, colour by number, spot the difference. BLUE OCEAN update live (88 tools, VERSION 26, see printpals/BLUE_OCEAN.md): owner asked to solve problems competitors ignore.
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
