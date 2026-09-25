# Project notes for Claude (read this first)

Owner: Chioma (Director of GRACE AND LOANNES LTD, UK company SC899696, lives in Nigeria).
She trusts Claude to make design and build decisions without asking for approval.
Work on whatever branch the session names (latest: `claude/keen-ritchie-was4uj`; earlier: `claude/uk-bank-company-account-fw7kdp`).

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

### Build status (updated 2026-09-25)
Flutter app lives in `brainlings/` (Android + iOS). Everything runs offline on the device for now.
Done and working:
- First-run grown-up setup: name/nickname, age, family circle, optional name recording, bedtime minutes, privacy promise.
- Hatch: tap the egg 5 times, cracks, flash, confetti, child picks a name (Bibi, Pip, Mochi, Sunny, Bean, Coco).
- Home: living meadow sky that follows the real clock (sun, clouds, flowers / dusk / moon, stars, fireflies),
  Bibi bobs and bounces, tap for jokes and rare surprise stars, morning dream postcards, daily feelings check-in,
  growth bar, stars, letterbox with glowing dot, sticker album, grown-ups lock.
- Games (5 rounds each, then stars + a sticker): Feeding Time, Letter Garden, Shape Builder (builds a house),
  Pattern Party, Teach Bibi (Bibi makes silly mistakes, child corrects).
- Growth direction: numbers = orbiting stars, letters = storybook hat, both = balanced.
- Letters from home: envelope arrives, "Yes please!" / "Save it for later", plays voice or reads text, hug back,
  ONE gentle hug reminder (after a game or at bedtime). Grown-up sees "Chris listened (played it 3 times)" and hugs.
  For now letters are recorded in the grown-up area on the same phone (stand-in for the family web link).
- Bedtime: after the daily limit Bibi yawns, plays any bedtime message, "See you tomorrow!", locked until a grown-up wakes it.
- Voice: flutter_tts speaks everything; `{name}` in a line uses the parent's recorded clip of the child's name.
- Art: 6 Bibi poses + egg in `brainlings/assets/bibi/` (webp). Sounds are generated chimes in `assets/sfx/`.
Next up: Firebase (family web link page, real letters, push), trial and billing, storybooks, decorating Bibi's home,
seasonal days and birthday, Guess What Mummy Picked, report before trial ends, Play Store listing.
Build: `flutter build apk --release` works in the container (Android SDK at /opt/android-sdk, Flutter at /opt/flutter,
both installed per session). Maven Central sometimes rate-limits (429): retry. GitHub Actions workflow
`.github/workflows/brainlings-apk.yml` also builds the APK as a downloadable artifact.
Higgsfield credits used so far: about 3.5 (poses at medium quality, 0.5 each). Balance ~497.

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

## Other projects (paused)
- `samesies/`: daily crowd-guessing web game prototype (owner found it boring; paused).
- "Nearly" (working name): app for long-distance couples/families (photo drops on home screen,
  thinking-of-you tap, same sky, open-when letters, memory book, printed books). Second app, later.
- Domain playsamesies.com was left in the Namecheap cart, not bought.
