import 'dart:math';

import 'package:flutter/material.dart';

import '../services/music.dart';
import '../friends.dart';
import '../services/sfx.dart';
import '../services/voice.dart';
import '../theme.dart';
import 'art.dart';
import 'bibi.dart';
import 'sky.dart';
import 'ui.dart';

/// Little bursts of joy that make every tap feel alive.
class Juice {
  static final _r = Random();
  static int _streak = 0;

  static const _words = ['YES!', 'WOW!', 'SUPER!', 'YAY!', 'COOL!', 'BRAVO!'];
  static const _cheers = ['Woohoo!', 'Yay!', 'Hooray!', 'You rock!', 'High five!', 'Awesome!', 'Yippee!', 'So clever!'];
  static const _oops = ['Oopsie! Try another one!', 'Hee hee, not that one!', 'Nearly! Try again!'];

  static void resetStreak() => _streak = 0;

  /// A right answer: claps, a big bouncy word, stars from where they tapped.
  /// Returns a short cheer line for Bibi to say.
  static String correct(BuildContext context, {Offset? at}) {
    _streak++;
    Sfx.clap();
    Sfx.sparkle();
    final size = MediaQuery.sizeOf(context);
    final pos = at ?? Offset(size.width / 2, size.height * .45);
    starBurst(context, pos);
    bigWord(context, _words[_r.nextInt(_words.length)]);
    if (_streak > 0 && _streak % 3 == 0) {
      Sfx.applause();
      celebrate(context, count: 50);
      return GameHost.cheer("Three in a row! You're on fire!");
    }
    return GameHost.cheer(_cheers[_r.nextInt(_cheers.length)]);
  }

  /// A wrong answer: a silly boing and a giggly nudge. Never "wrong".
  static String oops() {
    _streak = 0;
    Sfx.boing();
    return GameHost.oops(_oops[_r.nextInt(_oops.length)]);
  }

  /// Stars and sparkles flying out from a point.
  static void starBurst(BuildContext context, Offset at, {int count = 14, List<Color>? colors}) {
    final overlay = Overlay.of(context);
    late OverlayEntry e;
    e = OverlayEntry(builder: (_) => _Burst(at: at, count: count, colors: colors, onDone: () => e.remove()));
    overlay.insert(e);
  }

  /// A giant, wobbly, outlined word in the middle of the screen.
  static void bigWord(BuildContext context, String word) {
    final overlay = Overlay.of(context);
    late OverlayEntry e;
    e = OverlayEntry(builder: (_) => _BigWord(word: word, onDone: () => e.remove()));
    overlay.insert(e);
  }
}

class _Burst extends StatefulWidget {
  const _Burst({required this.at, required this.count, required this.onDone, this.colors});
  final Offset at;
  final int count;
  final VoidCallback onDone;
  final List<Color>? colors;

  @override
  State<_Burst> createState() => _BurstState();
}

class _BurstState extends State<_Burst> with SingleTickerProviderStateMixin {
  late final _c = AnimationController(vsync: this, duration: const Duration(milliseconds: 900))..forward().whenComplete(widget.onDone);
  final _r = Random();
  late final List<Color> _palette = widget.colors ?? const [C.sun, C.berry, C.aqua, C.lilac, C.leaf];
  late final _bits = List.generate(
    widget.count,
    (i) => (
      angle: i * 2 * pi / widget.count + _r.nextDouble() * .4,
      speed: 90 + _r.nextDouble() * 110,
      size: 14 + _r.nextDouble() * 16,
      color: _palette[_r.nextInt(_palette.length)],
      star: _r.nextBool(),
    ),
  );

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => IgnorePointer(
        child: AnimatedBuilder(
          animation: _c,
          builder: (_, _) {
            final t = Curves.easeOutCubic.transform(_c.value);
            return Stack(children: [
              for (final b in _bits)
                Positioned(
                  left: widget.at.dx + cos(b.angle) * b.speed * t - b.size / 2,
                  top: widget.at.dy + sin(b.angle) * b.speed * t - b.size / 2 + 40 * _c.value * _c.value,
                  child: Opacity(
                    opacity: (1 - _c.value).clamp(0.0, 1.0),
                    child: Transform.rotate(
                      angle: _c.value * 4,
                      child: Icon(b.star ? Icons.star_rounded : Icons.circle, size: b.size * (b.star ? 1 : .5), color: b.color),
                    ),
                  ),
                ),
            ]);
          },
        ),
      );
}

class _BigWord extends StatefulWidget {
  const _BigWord({required this.word, required this.onDone});
  final String word;
  final VoidCallback onDone;

  @override
  State<_BigWord> createState() => _BigWordState();
}

class _BigWordState extends State<_BigWord> with SingleTickerProviderStateMixin {
  late final _c = AnimationController(vsync: this, duration: const Duration(milliseconds: 1100))..forward().whenComplete(widget.onDone);
  late final Color _color = const [C.berry, C.sun, C.leaf, C.lilacDeep, C.peach, C.aqua][Random().nextInt(6)];

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => IgnorePointer(
        child: AnimatedBuilder(
          animation: _c,
          builder: (_, _) {
            final v = _c.value;
            final scale = v < .35 ? Curves.elasticOut.transform((v / .35).clamp(0, 1)) * 1.1 : 1.1 + (v - .35) * .3;
            final opacity = v < .75 ? 1.0 : (1 - (v - .75) / .25).clamp(0.0, 1.0);
            return Align(
              alignment: const Alignment(0, -.2),
              child: Opacity(
                opacity: opacity,
                child: Transform.rotate(
                  angle: sin(v * 12) * .06,
                  child: Transform.scale(
                    scale: scale,
                    child: Stack(children: [
                      Text(widget.word,
                          style: T.d(78).copyWith(
                              foreground: Paint()
                                ..style = PaintingStyle.stroke
                                ..strokeWidth = 12
                                ..strokeJoin = StrokeJoin.round
                                ..color = Colors.white)),
                      Text(widget.word, style: T.d(78, color: _color).copyWith(shadows: const [Shadow(color: C.shadow, offset: Offset(0, 6))])),
                    ]),
                  ),
                ),
              ),
            );
          },
        ),
      );
}

/// Halfway through a game: a short burst of silliness. Every tap makes
/// Bibi leap into a new pose, with stars and claps.
Future<void> danceBreak(BuildContext context) =>
    Navigator.of(context).push(PageRouteBuilder(
      opaque: false,
      transitionDuration: const Duration(milliseconds: 300),
      pageBuilder: (_, _, _) => const _DanceBreak(),
      transitionsBuilder: (_, a, _, c) => FadeTransition(opacity: a, child: c),
    ));

class _DanceBreak extends StatefulWidget {
  const _DanceBreak();

  @override
  State<_DanceBreak> createState() => _DanceBreakState();
}

class _DanceBreakState extends State<_DanceBreak> {
  static const _moves = [Mood.dance, Mood.cheer, Mood.laugh, Mood.wow, Mood.wave, Mood.dance];
  int _taps = 0;
  int _bounce = 0;
  bool _done = false;
  String _line = 'Dance break! Tap me to make me dance!';

  @override
  void initState() {
    super.initState();
    Sfx.tada();
    Voice.say(_line);
    Future.delayed(const Duration(seconds: 10), _finish);
  }

  void _tap(TapDownDetails d) {
    if (_done) return;
    setState(() {
      _taps++;
      _bounce++;
    });
    Sfx.play(_taps.isEven ? 'clap' : 'pop');
    Juice.starBurst(context, d.globalPosition, count: 10);
    if (_taps == 4) {
      setState(() => _line = 'Faster! Faster!');
      Voice.say(_line);
    } else if (_taps == 9) {
      setState(() => _line = 'Wheee!');
      Voice.say(_line);
    }
    if (_taps >= 14) _finish();
  }

  Future<void> _finish() async {
    if (_done || !mounted) return;
    _done = true;
    Sfx.applause();
    celebrate(context, count: 60);
    setState(() => _line = "Phew! That was fun! Let's keep going!");
    await Voice.say(_line);
    if (mounted) Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    Music.duck(false);
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: Meadow(
        scene: 'party',
        child: SafeArea(
          child: GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTapDown: _tap,
            child: Column(
              children: [
                const SizedBox(height: 16),
                Padding(padding: const EdgeInsets.symmetric(horizontal: 16), child: Bubble(_line)),
                const Spacer(),
                AnimatedRotation(
                  turns: _taps.isEven ? 0 : (_taps % 4 == 1 ? .03 : -.03),
                  duration: const Duration(milliseconds: 150),
                  child: Bibi(mood: _moves[_taps % _moves.length], size: 300, bounce: _bounce),
                ),
                const Spacer(),
                Text('Tap tap tap!', style: T.d(34, color: Colors.white).copyWith(shadows: const [Shadow(color: C.shadow, offset: Offset(0, 4), blurRadius: 6)])),
                const SizedBox(height: 30),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// A fruit flying in a happy arc from where it was to Bibi's mouth.
class FlyingArt extends StatefulWidget {
  const FlyingArt({super.key, required this.art, required this.from, required this.to, required this.onDone});
  final String art;
  final Rect from;
  final Offset to;
  final VoidCallback onDone;

  static Future<void> go(BuildContext context, String art, Rect from, Offset to) {
    final overlay = Overlay.of(context);
    late OverlayEntry e;
    final done = Future<void>.delayed(const Duration(milliseconds: 520));
    e = OverlayEntry(builder: (_) => FlyingArt(art: art, from: from, to: to, onDone: () => e.remove()));
    overlay.insert(e);
    return done;
  }

  @override
  State<FlyingArt> createState() => _FlyingArtState();
}

class _FlyingArtState extends State<FlyingArt> with SingleTickerProviderStateMixin {
  late final _c = AnimationController(vsync: this, duration: const Duration(milliseconds: 500))..forward().whenComplete(widget.onDone);

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => IgnorePointer(
        child: AnimatedBuilder(
          animation: _c,
          builder: (_, _) {
            final t = Curves.easeIn.transform(_c.value);
            final start = widget.from.center;
            final x = start.dx + (widget.to.dx - start.dx) * t;
            final y = start.dy + (widget.to.dy - start.dy) * t - sin(t * pi) * 120;
            final size = 70 * (1 - t * .55);
            return Stack(children: [
              Positioned(
                left: x - size / 2,
                top: y - size / 2,
                child: Transform.rotate(angle: t * 6, child: Art(widget.art, size: size)),
              ),
            ]);
          },
        ),
      );
}
