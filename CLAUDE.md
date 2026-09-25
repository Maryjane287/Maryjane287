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
- 7-DAY free trial (owner changed this from one month on 2026-09-25), clear price up front, reminder before the trial ends, easy cancel.
- Special moments spread across the 7 trial days; big "look how much Chris learned" report before the trial ends.
- No ads.
- Google Play developer account (organisation, Grace and Loannes Ltd) is paid and identity verified;
  phone numbers still to verify. Apple enrollment submitted but $99 not paid (later).
- Payouts need a proper company bank account (Wise was rejected by KDP; unresolved).

### Build status (updated 2026-09-25, v1.6.0)
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
- v1.6.2 Say It (owner: Bibi made the child repeat up to 10 times): wrong or no answer is now corrected at once:
  "Nearly! Let me help you. The answer is: X", spells it (names, colours, opposites), "Your turn! Say it once!",
  ONE listen, then "I heard you! Brilliant!" or "Good try! Let's keep going!" and move on. Sentences the same way.
  A quiet child gets one nudge, not three. Never add repeat-again loops.
- v1.6 (owner: songs stopped, then waited silently for the progress bar; old songs dull, short and laggy):
  ONE video per song. Old songs re-encoded 1.2x faster (atempo, pitch kept) at 24 fps, 12.5 s + 0.7 s quiet pause
  at the end (owner wanted a little breath before a song repeats; `Song.pauseMs`, also after Z in the Letter Song). In the pause Bibi shouts
  "Again!" / "One more time!" / "Let's go again!" (SongLoop breathAtMs/onBreath, not on the last round).
  Goodnight Song: owner loves it as it is. Never change it (no pause, no shout, same pace).
  New songs are one 60 s file (verse A, chorus, verse B, chorus). `Song.timeline` has all words timed in the file,
  `Song.plan(target)` picks passes + stop point at a verse end. `lib/services/song_loop.dart` SongLoop: setLooping(true),
  counts passes by position wrap, stops with a quick fade at the verse end, watchdog restarts a stalled player (only when
  the app is open), clock backstop. Used by SongPlayer (list ~2 min, game party ~30 s) and Music.song (home dance ~25 s,
  bedtime 1 pass). No silent waiting anywhere. Song screen only rebuilds dancers/lights on the beat (ValueNotifier).
  Letter Song now goes A to Z: one 42.5 s file (A to F sped up, then "Goat goes G" chant G to P, then Q to Z).
  G to P was blocked twice as IP ("G for goat..." style), the chant version passed. Songs now crf 39, aac 48k (APK 29.7 MB).
  Feeding take away: sum card "5 − 2 = ?" on a chalkboard, first time Bibi explains "Take away means some go away.
  This sign means take away. We can also call it minus!", then says Take away or Minus. New bonus round in every game
  (`lib/widgets/star_catch.dart`, after round 6; Shape Builder before the reward): catch falling stars, Bibi counts.
- v1.5 (owner: name said too often and sounds lower with a pause, songs too slow/short/dull, lessons too short):
  Name only at big moments (welcome, level-up reward, letters, hatch, bedtime, Say It hello); never between song rounds.
  Name clip plays via just_audio: clipped tight (-80 ms), pitch 1.15, loudness boost; recorder uses autoGain.
  No more speed-up or "Faster! Faster!". 3 NEW long lively songs at 123 BPM (party, rocket, abc), each verse A + chorus
  + verse B + chorus (Seedance mini, 9 clips, ~68 credits); song list plays verse after verse ~1.5 to 2 min (one-verse
  songs ~1 min), Stop button, progress bar, Yes / New song at the end. `Song.more` = extra `Verse`s.
  Game dance parties ~30 s and prefer the lively songs. Lessons 8 rounds (dance party after round 4); Shape Builder
  builds two pictures. Play time choices 30 min / 1 h / 2 h / 3 h / 5 h / no limit (default 1 h). Grown-ups gate is
  now an easy addition. Say It: stale "done" status no longer ends listening early.
  Song videos 272p 20fps crf 37, webp images re-saved at quality 74 to keep the APK under 30 MB (29.3 MB).
- v1.4 (owner found bugs, wanted 7 levels and longer, livelier songs):
  Fixed: song "Again" replayed the ending line (end detected before the seek finished); game dance parties could hang
  forever (video never reports its exact end on some phones) so now isCompleted OR paused-near-end OR a safety timer,
  plus an X button; Teach double tap skipped rounds (now awaits _next); Say It mic tap started a second conversation;
  friends nudged during dance parties and while Say It listened (GameFrame `quiet` + only when its route is on top);
  Feeding first frame used late fields; TTS and video loading now always time out.
  Songs: 4 rounds (about a minute), each round faster (playback speed 1.08 to 1.29, pitch kept), Bibi shouts the
  child's name between rounds ("{name}! Faster! Faster!"), disco lights, pictures for every lyric line (`SongLine.pics`),
  Yes / New song at the end. Game dance parties 2 rounds, home dance parties 2 rounds.
  LEVELS now 1 to 7, then a Super level. 5 to 7 per game: Feeding big sums / big take away / mix; Letters small-letter
  hunt (5 faster bubbles) / spelling with 2 decoys / mix; Shapes castle / train / flower; Patterns harder missing /
  counting in twos / mix; Teach Bibi's wrong sums / mix / everything; Say It rhyme time / counting out loud / mix.
  Idea for later (costs credits, ask first): second verses for favourite songs (7.5 credits per 15 s).
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
Higgsfield credits: about 4.4 left on 2026-09-25 after the Letter Song verses (ip_detected jobs are refunded). Check `balance`.

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
