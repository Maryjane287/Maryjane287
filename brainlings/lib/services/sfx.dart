import 'package:audioplayers/audioplayers.dart';

/// Little sound effects. Several players so sounds can overlap.
class Sfx {
  static final _pool = List.generate(
    4,
    (_) => AudioPlayer()..setReleaseMode(ReleaseMode.stop),
  );
  static int _next = 0;

  static Future<void> play(String name, {double volume = .8}) async {
    final p = _pool[_next];
    _next = (_next + 1) % _pool.length;
    try {
      await p.stop();
      await p.play(AssetSource('sfx/$name.wav'), volume: volume);
    } catch (_) {}
  }

  static void tap() => play('tap', volume: .5);
  static void pop() => play('pop');
  static void correct() => play('correct');
  static void tryAgain() => play('tryagain', volume: .6);
  static void star() => play('star');
  static void chomp() => play('chomp');
  static void letter() => play('letter');
  static void crack() => play('crack');
  static void hatch() => play('hatch');
  static void hug() => play('hug');
  static void giggle() => play('giggle');
  static void yawn() => play('yawn');
}
