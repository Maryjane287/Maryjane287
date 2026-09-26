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
Batch 2 is live (22 tools). Owner asked for it to feel more premium. Brainlings art must NOT be copied into
PrintPals (keep them separate); PrintPals has its own 18 painted pictures in public/img plus emoji and SVG art.
Higgsfield credits are nearly gone (0.66), so new art needs the owner's say.

## Other projects (paused)
- `samesies/`: daily crowd-guessing web game prototype (owner found it boring; paused).
- "Nearly" (working name): app for long-distance couples/families (photo drops on home screen,
  thinking-of-you tap, same sky, open-when letters, memory book, printed books). Second app, later.
- Domain playsamesies.com was left in the Namecheap cart, not bought.
