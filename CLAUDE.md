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

### Build status (updated 2026-09-25, v1.3.0)
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
- Voice (v1.2): owner hated the slow seed_audio voice. Bibi is now ElevenLabs (Higgsfield text2speech_v2,
  variant elevenlabs, preset "Zoe" d0374db1-44b9-4f05-939e-0a9ae9dbbe6a), pitched up into a cute creature voice
  offline with ffmpeg `aresample=44100,asetrate=53802,aresample=44100,atempo=0.93` then silence-trimmed.
  478 lines in `assets/voice/bNNN.mp3`; friend lines in `assets/voice/f_<friend>_<n>.mp3`.
  `lib/services/voice_clips.dart` maps normalised line text to clip. Code joins recorded pieces with `|`
  and `{name}` (parent's recording of the child's name, trimmed by amplitude, else phone TTS). Unknown text falls back to TTS.
  Voices are preloaded for gapless playback and the music ducks while anyone talks.
  To add a line: record it with the same voice + pitch, add a clip, regenerate voice_clips.dart, add it to test/voice_lines_test.dart.
- Friends (the Brainlings gang, `lib/friends.dart`, art in `assets/friends/<id>_{happy,cheer,laugh}.webp`):
  Pip (bunny, counting, voice 1fb253b8), Momo (owl, letters, 5c615d8a), Tiko (dino, building, Benji e6f9b893),
  Lulu (fluffy, party, 0178ef57), Gogo (frog, talking, Dylan b847bc29). Each hosts a game, sits by the round dots,
  jumps and adds its own cheer on right answers. First friend arrives after the first game, then one new friend per play day
  with a big arrival party. Friends live on the home meadow and chat when tapped.
- Living home (owner: "we shouldn't wait for the child to tap"): a director timer runs a surprise every ~6 to 9 quiet seconds:
  balloons to pop, soap bubbles, a present (gives a star), critters flying past, peekaboo, dance party with friends,
  Bibi calling the child, friends chatting. Games also nudge after 9s of quiet.
- Talking Bibi (`lib/screens/talk.dart`, big Talk! mic on home): repeats the child in a squeaky voice (Talking Tom style),
  poke head/feet/tummy, hug, tickle, snack tray. Say It! game uses speech recognition. Nothing is saved.
- Music: procedural loops in `assets/music/` (play, games, lullaby), toggle in the grown-up area.
- LEVELS (v1.3, owner: "each block keeps repeating the same thing"): every game has 4 levels, then a "super level" mix.
  `app.levels[gameId]`, `levelMode()`, `levelLine()`, star badge on tiles and in games, "You unlocked a new level!".
  Feeding: feed / which plate has more or fewer / sums with plates (2 + 1 = ?) / take away.
  Letters: sound bubbles / letter hunt / big and little letters / spell cat, dog, hat, pig, sun, ant, egg.
  Shapes: build a house / rocket / boat / robot. Patterns: simple / tricky / what's missing / counting star patterns.
  Teach: counting+letters / shapes / big numbers / mix. Say It: naming+spelling / sentences / animal sounds and colours / opposites.
- SONGS (v1.3): 10 ORIGINAL sung songs (no copyright: a famous-song prompt was blocked as IP) made as Seedance 2.0 mini
  15s 480p music videos with Bibi and friends dancing (7.5 credits each). `assets/songs/<id>.mp4`, lyrics + timings in
  `lib/songs.dart` (timed with faster-whisper word timestamps). Songs screen (Sing! button on home), karaoke words,
  the gang dances along. Game dance breaks, the home dance event and bedtime (Goodnight Song) all use the real songs.
- Say It really listens (speech_to_text dictation with contextual phrases, stops as soon as it hears the answer):
  asks the child's name first, "Did you say that? Maybe I got you wrong", teaches the word, "Do I have to teach you everything?",
  asks for a sentence, spells words with tap tiles and letter names. Quiet child: hello prompts and jokes.
- Talk screen: adaptive noise floor (soft voices count), autoGain + noise suppression, loudness booster on the copy voice,
  hello/joke when the child is quiet, Bibi answers back.
- Friends never talk over Bibi (`Voice.speaking`), 12 lines each, no repeats until all are used.
- APK size: send limit is 30 MB. Keep assets small: fonts subset to Latin (pyftsubset), voices 24 kbps 22 kHz mono
  with loudnorm, songs 320p crf 34, build with `--obfuscate --split-debug-info`. armeabi-v7a APK was 28.8 MB.
- Art (all Higgsfield gpt_image_2_5, soft 3D clay style): 18 Bibi poses incl. grown-up looks
  (starry = numbers, bookish = letters, bloom = superstar) in `assets/bibi/`; 48 objects/animals/flowers in
  `assets/art/` (also used as album stickers); 9 painted scenes in `assets/bg/` (day, dusk, night meadow,
  orchard, garden, playroom, party, classroom, bedroom) with animated sun/clouds/butterflies/stars/fireflies on top.
- Videos (Kling 3.0 std, 5s, 9:16, compressed to 540p ~0.4MB each) in `assets/video/`: hatch (cut scene),
  dance (reward), letter (envelope arrives), bed (bedtime), grow (new stage celebration), wave (welcome).
Next up: Firebase (family web link page, real letters, push), trial and billing, storybooks, decorating Bibi's home,
seasonal days and birthday, Guess What Mummy Picked, report before trial ends, Play Store listing.
Build: `flutter build apk --release` works in the container (Android SDK at /opt/android-sdk, Flutter at /opt/flutter,
both installed per session). Maven Central sometimes rate-limits (429): retry. GitHub Actions workflow
`.github/workflows/brainlings-apk.yml` also builds the APK as a downloadable artifact.
Higgsfield credits: check `balance` (about 130 left after the v1.3 songs and 280 new voice lines).

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
