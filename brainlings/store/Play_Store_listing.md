# Brainlings: Play Store listing kit

Everything here is ready to copy and paste into Google Play Console
(Grow users → Store presence → Main store listing).

## App name (max 30 characters)

Brainlings: Learn, Sing, Grow

## Short description (max 80 characters)

Fun learning for ages 4 to 7: counting, phonics, songs and a friend who listens.

## Full description (max 4000 characters)

Meet Bibi, the cuddly learning buddy who grows every time your child learns!

Brainlings turns counting, letters, shapes and words into games, songs and giggles. Bibi talks, sings, dances and even listens, so little ones who cannot read yet can play and learn all by themselves.

🌱 HATCH YOUR OWN BIBI
Your child taps a magic egg, names their very own creature and watches it grow. Bibi grows in the direction your child learns most: counting gives Bibi shining stars, letters give Bibi a storybook hat.

🔢 COUNTING AND EARLY MATHS
Feed hungry Bibi, count along, compare plates, add up and take away, all with pictures, so every sum makes sense.

🔤 PHONICS AND FIRST WORDS
Pop bubbles that start with the right sound, find big and little letters, and spell first words like cat, dog and sun.

🔷 SHAPES AND PATTERNS
Build a house, a rocket, a castle and a train from shapes. Finish patterns and count in twos at a colourful party.

🎓 YOUR CHILD BECOMES THE TEACHER
Silly Bibi makes mistakes, and your child corrects them. Teaching is the best way to learn!

🎤 BIBI LISTENS AND TALKS BACK
Say It! asks your child to name pictures, make sentences, find rhymes and answer questions out loud. Bibi hears the answer, helps gently when needed and cheers every try. On the Talk screen Bibi copies your child in a funny voice.

🎵 SING AND DANCE
Original Brainlings songs, sung by Bibi and friends, with the words lighting up as they are sung and pictures that show what they mean. Dance parties pop up in every game.

⭐ 7 LEVELS IN EVERY GAME
Every game grows with your child, from first steps to real challenges, with stars, stickers and big celebrations along the way.

💌 LOVE FROM FAMILY
Record a loving voice message in the grown-up area and Bibi delivers it to your child in a special envelope. Your child can send a hug back, and you can see how many times they listened.

🌙 HEALTHY PLAY
You choose how long your child can play each day, from 30 minutes up to 5 hours, or no limit. When time is up, Bibi yawns, says "See you tomorrow!" and goes to sleep. No battles, no tears.

🔒 SAFE FOR CHILDREN
• No ads, ever
• No chat with strangers or other children
• Grown-up area protected by a parent lock
• We keep only a first name and an age. Voice recordings stay on your phone.

No ads. No chat. Just learning, songs and lots of love.

## Promo video

Upload `Brainlings_trailer_youtube_1920x1080.mp4` to YouTube (Public or Unlisted, turn OFF ads on the video,
set "Made for kids: Yes"), then paste the YouTube link into the "Video" box of the store listing.

## Graphics (all in this folder)

| Play Console box | File |
|---|---|
| App icon (512 × 512) | `app_icon_512.png` |
| Feature graphic (1024 × 500) | `feature_graphic_1024x500.png` |
| Phone screenshots (upload in this order) | `screenshot_1_home.png` to `screenshot_8_letter.png` |

## Privacy policy (required)

Paste this link in App content → Privacy policy:
https://github.com/Maryjane287/Maryjane287/blob/claude/keen-ritchie-was4uj/brainlings/store/privacy_policy.md
(First replace SUPPORT_EMAIL in `privacy_policy.md` with the support email you want parents to use.)

## Settings to choose in Play Console

- **Category:** Education (also tick "Tags": Educational, Kids, Learning).
- **Target audience:** Ages 5 and under, and Ages 6 to 8.
- **Ads:** No, my app does not contain ads.
- **Content rating questionnaire:** answer No to violence, fear, gambling, user interaction and sharing location.
  Expect a rating of "Everyone" / PEGI 3.
- **Data safety:** "Does your app collect or share user data?" answer **No**: everything stays on the phone
  (Google only counts data that leaves the device). Mention in the privacy policy (done) that Say It! uses the phone's
  own speech recognition. "Is all data encrypted in transit?" not applicable. "Can users request deletion?" Yes, Start again.
  (This changes when family messages go online with Firebase; we will update it then.)
- **Upload:** Production (or Internal testing first) → Create new release → upload `Brainlings-1.6.3.aab`.
  Choose "Use Google-generated app signing key" (Play App Signing). Keep `brainlings-upload.jks` and its password safe:
  every future update must be signed with it.
- **Teacher Approved:** once live, you can apply. The app already follows the rules (no ads, age appropriate, grown-up gate).
- **Price (first release):** Free, no in-app purchases yet. The 7-day free trial subscription comes in the next update:
  Google only lets you create a subscription after an app has been uploaded, then we add the paywall to the app.

## Social posts (to drive traffic)

Use `Brainlings_trailer_vertical_1080x1920.mp4` for WhatsApp Status, TikTok, Instagram Reels and YouTube Shorts.

Caption idea:

> Meet Bibi! 🌱 A learning buddy who sings, dances and listens to your little one.
> Counting, phonics, songs and giggles, made for ages 4 to 7. No ads, ever.
> Get Brainlings on Google Play. 💛
> #Brainlings #KidsLearning #Phonics #EarlyMaths #LearningThroughPlay #KidsSongs #Parenting
