// Generated from the song videos (lyrics timed from the singing). Do not edit by hand.

class SongLine {
  const SongLine(this.startMs, this.text, [this.pics = const []]);
  final int startMs;
  final String text;

  /// Pictures that show what the words mean. A plain name is a painted
  /// picture; '#clap' a dance move; '@Moo!' a big word; '%circle' a shape;
  /// '*red' a colour; '&pip' a friend; '#3' a big number.
  final List<String> pics;
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
    SongLine(0, "Hello, hello, how are you?", ["#wave", "heart"]),
    SongLine(3740, "I'm so happy, I love you too!", ["heart", "star"]),
    SongLine(8119, "Wave your hands and stomp your feet,", ["#wave", "#stomp"]),
    SongLine(11720, "Brainlings friends are fun to meet!", ["&pip", "&momo", "&lulu"]),
  ]),
  Song('apple', "The Apple Song", 'apple', [
    SongLine(0, "Apple, apple, red and round,", ["apple"]),
    SongLine(2220, "Crunchy, munchy, what a sound!", ["apple", "#munch"]),
    SongLine(4620, "Banana yellow, grapes so small,", ["banana", "blueberry"]),
    SongLine(6620, "Yummy fruit, I love them all!", ["strawberry", "orange", "apple"]),
    SongLine(10220, "Clap, clap, jump up high,", ["#clap", "#jump"]),
    SongLine(12520, "Wave your hands up to the sky!", ["#wave", "sun"]),
  ]),
  Song('counting', "Count and Jump", 'star', [
    SongLine(0, "One, two, three, jump with me!", ["#1", "#2", "#3", "#jump"]),
    SongLine(3180, "Four, five, six, touch your knees!", ["#4", "#5", "#6", "#knees"]),
    SongLine(8160, "Seven, eight, nine, spin around!", ["#7", "#8", "#9", "#spin"]),
    SongLine(10800, "Ten! Now sit down on the ground!", ["#10", "#sit"]),
  ]),
  Song('letters', "The Letter Song", 'album', [
    SongLine(0, "Letters, letters, big and small,", ["@A", "@a", "@B", "@b"]),
    SongLine(3200, "A for apple, B for ball,", ["@A", "apple", "@B", "balloon"]),
    SongLine(7860, "C for cat and D for dog,", ["@C", "cat", "@D", "dog"]),
    SongLine(11340, "E for egg and F for frog!", ["@E", "egg", "@F", "&gogo"]),
  ]),
  Song('shapes', "Shape Dance", 'blocks', [
    SongLine(0, "Circle, circle, round like the sun,", ["%circle", "sun"]),
    SongLine(4280, "Triangle, triangle, pointy fun!", ["%triangle"]),
    SongLine(8000, "Square has four sides, one, two, three, four,", ["%square", "#4"]),
    SongLine(11760, "Star in the sky, let's dance some more!", ["star", "#dance"]),
  ]),
  Song('colours', "Rainbow Song", 'rainbow', [
    SongLine(0, "Red like a strawberry, yellow like the sun,", ["*red", "strawberry", "*yellow", "sun"]),
    SongLine(4880, "Green like a leaf, colours are fun!", ["*green", "sunflower"]),
    SongLine(8300, "Blue like the sky, orange so bright,", ["*blue", "*orange", "orange"]),
    SongLine(11620, "Purple and pink, what a sight!", ["*purple", "*pink", "rainbow"]),
  ]),
  Song('animals', "Farm Party", 'pig', [
    SongLine(0, "The cow says moo, the duck says quack,", ["@Moo!", "@Quack!"]),
    SongLine(3760, "The pig says oink, and waddles back!", ["pig", "@Oink!"]),
    SongLine(7900, "The frog says ribbit, jump, jump, jump,", ["&gogo", "#jump"]),
    SongLine(10980, "The lion says roar, and stomp, stomp, stomp!", ["lion", "@Roar!", "#stomp"]),
  ]),
  Song('wiggle', "Wiggle Disco", 'popper', [
    SongLine(0, "Wiggle your arms, wiggle your toes,", ["#wave", "#wiggle"]),
    SongLine(3740, "Wiggle your tummy, wiggle your nose!", ["#wiggle", "#nose"]),
    SongLine(6860, "Jump to the left, jump to the right,", ["#left", "#right"]),
    SongLine(9820, "Shake it, shake it, day and night!", ["#shake", "#dance"]),
  ]),
  Song('happy', "Happy Clap", 'balloon', [
    SongLine(0, "When I'm happy, I clap my hands! Clap clap!", ["#clap", "@Clap clap!"]),
    SongLine(4300, "When I'm happy, I stamp my feet! Stamp stamp!", ["#stomp", "@Stamp!"]),
    SongLine(7600, "When I'm happy, I shout hooray! Hooray!", ["#hooray", "@Hooray!"]),
    SongLine(10400, "Learning with my friends every day!", ["&pip", "&tiko", "heart"]),
  ]),
  Song('goodnight', "Goodnight Song", 'sun', [
    SongLine(0, "Close your eyes, the stars are bright,", ["star", "#moon"]),
    SongLine(3640, "The moon is smiling, say goodnight.", ["#moon", "#sleep"]),
    SongLine(6920, "Snuggle in and hold me tight,", ["heart", "#hug"]),
    SongLine(11100, "Sweet dreams, sweet dreams, goodnight.", ["star", "#sleep"]),
  ]),
];
