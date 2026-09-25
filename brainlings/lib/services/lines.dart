import 'dart:math';

/// Picks what to say from a list of lines without repeating: every line is
/// used once before any comes back, and never the same one twice in a row.
class Lines {
  static final _bags = <String, List<String>>{};
  static final _last = <String, String>{};
  static final _r = Random();

  static String pick(String key, List<String> lines) {
    final bag = _bags[key] ??= [];
    if (bag.isEmpty) {
      bag.addAll(List.of(lines)..shuffle(_r));
      // Do not start the new round with the line we just said.
      if (bag.length > 1 && bag.last == _last[key]) {
        bag.insert(0, bag.removeLast());
      }
    }
    final line = bag.removeLast();
    _last[key] = line;
    return line;
  }

  /// Warm praise for a right answer.
  static String praise() => pick('praise', [
        'Woohoo!',
        'Yay!',
        'Hooray!',
        'High five!',
        'Awesome!',
        'So clever!',
        'You rock!',
        'Yippee!',
        "You're a star!",
        "I'm so proud of you!",
        "You're so smart!",
        'Fantastic!',
      ]);

  /// A gentle nudge after a wrong tap. Never "wrong".
  static String oops() => pick('oops', [
        'Oopsie! Try another one!',
        'Nearly! Try again!',
        'Hee hee, not that one!',
        "Not that one. Let's look again together.",
        'Ooh, nearly! Have another look.',
      ]);

  /// Before Bibi kindly shows the answer.
  static String help() => pick('help', [
        'Nearly! Let me help you.',
        'Ooh, so close! Let me help.',
        'Good thinking! Let me show you.',
        "That's okay! Mistakes help us learn.",
      ]);

  /// Loving words for having a go, right or not.
  static String tried() => pick('tried', [
        "Good try! Let's keep going!",
        "You're so brilliant for trying!",
        "Thank you for trying! You're amazing.",
        'What a clever try!',
        "You tried so hard! I'm proud of you.",
      ]);

  /// A full sentence of praise.
  static String yay() => pick('yay', [
        'Yes! Brilliant!',
        'You got it!',
        'Woohoo! Well done!',
        'Super clever!',
        "Yay! That's right!",
      ]);
}
