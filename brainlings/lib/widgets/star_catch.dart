import 'dart:math';

import 'package:flutter/material.dart';

import '../services/sfx.dart';
import '../services/voice.dart';
import '../state.dart';
import '../theme.dart';
import 'art.dart';
import 'bibi.dart';
import 'game_frame.dart';
import 'juice.dart';
import 'ui.dart';

/// A bonus round near the end of every game: golden stars rain down and
/// the child taps to catch them while Bibi counts out loud.
Future<void> starCatch(BuildContext context) async {
  await Voice.stop();
  if (!context.mounted) return;
  await Navigator.of(context).push(softRoute(const StarCatch()));
}

class StarCatch extends StatefulWidget {
  const StarCatch({super.key});

  @override
  State<StarCatch> createState() => _StarCatchState();
}

class _Star {
  _Star(this.id, this.x, this.born, this.fall, this.size, this.phase);
  final int id;
  final double x; // 0..1 across the screen
  final int born; // ms after the start
  final int fall; // ms to fall all the way down
  final double size;
  final double phase;
  bool caught = false;
}

class _StarCatchState extends State<StarCatch> with SingleTickerProviderStateMixin {
  static const _playMs = 11000;
  final _r = Random();
  late final AnimationController _t = AnimationController(vsync: this, duration: const Duration(milliseconds: _playMs + 5000));
  final _stars = <_Star>[];
  int _caught = 0;
  int _bounce = 0;
  bool _started = false;
  bool _done = false;

  @override
  void initState() {
    super.initState();
    // Stars keep coming, a little faster as the round goes on.
    var at = 0;
    for (var i = 0; at < _playMs; i++) {
      _stars.add(_Star(i, .08 + _r.nextDouble() * .84, at, 3600 - min(1400, i * 70), 74 + _r.nextDouble() * 26, _r.nextDouble() * pi * 2));
      at += 520 + _r.nextInt(260);
    }
    _t.addListener(_frame);
    WidgetsBinding.instance.addPostFrameCallback((_) => _intro());
  }

  Future<void> _intro() async {
    await Voice.say('Bonus time! Catch the falling stars!');
    if (!mounted) return;
    setState(() => _started = true);
    _t.forward();
  }

  void _frame() {
    if (_done) return;
    final ms = _t.value * _t.duration!.inMilliseconds;
    final last = _stars.map((s) => s.born + s.fall).reduce(max);
    if (ms > last) _end();
    setState(() {});
  }

  void _catch(_Star s, TapDownDetails d) {
    if (s.caught || _done) return;
    s.caught = true;
    _caught++;
    _bounce++;
    Sfx.sparkle();
    Juice.starBurst(context, d.globalPosition, count: 12, colors: const [C.sun, Colors.white, Color(0xFFFFE08A)]);
    if (_caught <= 10) Voice.say('${numberWordsCap[_caught]}!');
  }

  Future<void> _end() async {
    if (_done) return;
    _done = true;
    _t.stop();
    Sfx.applause();
    celebrate(context, count: 70);
    if (_caught > 0) app.addStars(1);
    await Voice.stop();
    await Voice.say(_caught >= 3 ? 'Wow! You caught so many stars!' : 'Woohoo! Well done!');
    await Future.delayed(const Duration(milliseconds: 400));
    if (mounted) Navigator.of(context).pop();
  }

  @override
  void dispose() {
    _t.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final ms = _t.value * _t.duration!.inMilliseconds;
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter, colors: [Color(0xFF241A5C), Color(0xFF5B3A9E), Color(0xFFE58AB8)]),
        ),
        child: LayoutBuilder(builder: (context, box) {
          final w = box.maxWidth, h = box.maxHeight;
          return Stack(children: [
            // Falling stars
            for (final s in _stars)
              if (_started && !s.caught && ms >= s.born && ms <= s.born + s.fall)
                Builder(builder: (_) {
                  final p = (ms - s.born) / s.fall;
                  return Positioned(
                    left: s.x * (w - s.size) + sin(p * pi * 3 + s.phase) * 24,
                    top: -s.size + p * (h + s.size),
                    child: GestureDetector(
                      behavior: HitTestBehavior.opaque,
                      onTapDown: (d) => _catch(s, d),
                      child: Padding(
                        padding: const EdgeInsets.all(8), // easy for small fingers
                        child: Transform.rotate(angle: sin(p * pi * 4 + s.phase) * .4, child: Art('star', size: s.size)),
                      ),
                    ),
                  );
                }),
            // The count, big at the top
            Positioned(
              top: MediaQuery.paddingOf(context).top + 14,
              left: 0,
              right: 0,
              child: IgnorePointer(
                child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                  const Art('star', size: 54),
                  const SizedBox(width: 8),
                  AnimatedSwitcher(
                    duration: const Duration(milliseconds: 300),
                    transitionBuilder: (c, a) => ScaleTransition(scale: CurvedAnimation(parent: a, curve: Curves.elasticOut), child: c),
                    child: Text('$_caught', key: ValueKey(_caught), style: T.l(58, color: C.sun).copyWith(shadows: const [Shadow(color: Colors.black38, blurRadius: 10)])),
                  ),
                ]),
              ),
            ),
            // Bibi cheering at the bottom
            Positioned(
              bottom: 12,
              left: 0,
              right: 0,
              child: IgnorePointer(
                child: Center(child: Bibi(mood: _done ? Mood.cheer : (_caught.isEven ? Mood.dance : Mood.wow), size: 150, bounce: _bounce)),
              ),
            ),
          ]);
        }),
      ),
    );
  }
}
