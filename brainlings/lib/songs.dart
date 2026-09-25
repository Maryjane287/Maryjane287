// Generated from the song videos (lyrics timed from the singing). Do not edit by hand.

class SongLine {
  const SongLine(this.startMs, this.text);
  final int startMs;
  final String text;
}

class Song {
  const Song(this.id, this.title, this.art, this.lines);
  final String id;
  final String title;
  final String art;
  final List<SongLine> lines;
}

const songs = <Song>[
  Song('hello', "Hello Friends", 'heart', [
    SongLine(0, "Hello, hello, how are you?"),
    SongLine(3740, "I'm so happy, I love you too!"),
    SongLine(8119, "Wave your hands and stomp your feet,"),
    SongLine(11720, "Brainlings friends are fun to meet!"),
  ]),
  Song('apple', "The Apple Song", 'apple', [
    SongLine(0, "Apple, apple, red and round,"),
    SongLine(2220, "Crunchy, munchy, what a sound!"),
    SongLine(4620, "Banana yellow, grapes so small,"),
    SongLine(6620, "Yummy fruit, I love them all!"),
    SongLine(10220, "Clap, clap, jump up high,"),
    SongLine(12520, "Wave your hands up to the sky!"),
  ]),
  Song('counting', "Count and Jump", 'star', [
    SongLine(0, "One, two, three, jump with me!"),
    SongLine(3180, "Four, five, six, touch your knees!"),
    SongLine(8160, "Seven, eight, nine, spin around!"),
    SongLine(10800, "Ten! Now sit down on the ground!"),
  ]),
  Song('letters', "The Letter Song", 'album', [
    SongLine(0, "Letters, letters, big and small,"),
    SongLine(3200, "A for apple, B for ball,"),
    SongLine(7860, "C for cat and D for dog,"),
    SongLine(11340, "E for egg and F for frog!"),
  ]),
  Song('shapes', "Shape Dance", 'blocks', [
    SongLine(0, "Circle, circle, round like the sun,"),
    SongLine(4280, "Triangle, triangle, pointy fun!"),
    SongLine(8000, "Square has four sides, one, two, three, four,"),
    SongLine(11760, "Star in the sky, let's dance some more!"),
  ]),
  Song('colours', "Rainbow Song", 'rainbow', [
    SongLine(0, "Red like a strawberry, yellow like the sun,"),
    SongLine(4880, "Green like a leaf, colours are fun!"),
    SongLine(8300, "Blue like the sky, orange so bright,"),
    SongLine(11620, "Purple and pink, what a sight!"),
  ]),
  Song('animals', "Farm Party", 'pig', [
    SongLine(0, "The cow says moo, the duck says quack,"),
    SongLine(3760, "The pig says oink, and waddles back!"),
    SongLine(7900, "The frog says ribbit, jump, jump, jump,"),
    SongLine(10980, "The lion says roar, and stomp, stomp, stomp!"),
  ]),
  Song('wiggle', "Wiggle Disco", 'popper', [
    SongLine(0, "Wiggle your arms, wiggle your toes,"),
    SongLine(3740, "Wiggle your tummy, wiggle your nose!"),
    SongLine(6860, "Jump to the left, jump to the right,"),
    SongLine(9820, "Shake it, shake it, day and night!"),
  ]),
  Song('happy', "Happy Clap", 'balloon', [
    SongLine(0, "When I'm happy, I clap my hands! Clap clap!"),
    SongLine(4300, "When I'm happy, I stamp my feet! Stamp stamp!"),
    SongLine(7600, "When I'm happy, I shout hooray! Hooray!"),
    SongLine(10400, "Learning with my friends every day!"),
  ]),
  Song('goodnight', "Goodnight Song", 'sun', [
    SongLine(0, "Close your eyes, the stars are bright,"),
    SongLine(3640, "The moon is smiling, say goodnight."),
    SongLine(6920, "Snuggle in and hold me tight,"),
    SongLine(11100, "Sweet dreams, sweet dreams, goodnight."),
  ]),
];
