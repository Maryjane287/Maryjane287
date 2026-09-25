import 'dart:math';

import 'package:flutter/material.dart';

import '../services/sfx.dart';
import '../services/voice.dart';
import '../state.dart';
import '../theme.dart';
import '../widgets/bibi.dart';
import '../widgets/sky.dart';
import '../widgets/ui.dart';
import 'home.dart';

const creatureNames = ['Bibi', 'Pip', 'Mochi', 'Sunny', 'Bean', 'Coco'];

/// Tap the egg to wake it up. Five taps, and out pops the creature.
class HatchScreen extends StatefulWidget {
  const HatchScreen({super.key});

  @override
  State<HatchScreen> createState() => _HatchScreenState();
}

class _HatchScreenState extends State<HatchScreen> with TickerProviderStateMixin {
  static const tapsNeeded = 5;
  late final _wobble = AnimationController(vsync: this, duration: const Duration(milliseconds: 450));
  late final _idle = AnimationController(vsync: this, duration: const Duration(milliseconds: 1800))..repeat();
  int _taps = 0;
  bool _hatched = false;
  bool _flash = false;
  String _line = 'Hello {name}! Look, a magic egg! Tap it to wake it up.';
  String? _picked;
  int _bounce = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => Voice.say(_line));
  }

  @override
  void dispose() {
    _wobble.dispose();
    _idle.dispose();
    super.dispose();
  }

  Future<void> _tapEgg() async {
    if (_hatched) return;
    _taps++;
    _wobble.forward(from: 0);
    Sfx.crack();
    if (_taps < tapsNeeded) {
      final lines = ['', 'Ooh! It moved!', 'Keep going!', 'I can hear something inside!', 'One more big tap!'];
      setState(() => _line = lines[_taps]);
      Voice.say(_line);
      return;
    }
    setState(() => _flash = true);
    Sfx.hatch();
    await Future.delayed(const Duration(milliseconds: 250));
    if (!mounted) return;
    setState(() {
      _hatched = true;
      _flash = false;
      _bounce++;
      _line = 'Hello! I\'m your very own creature! What should my name be?';
    });
    celebrate(context, count: 110);
    await Voice.say(_line);
  }

  Future<void> _pickName(String n) async {
    setState(() {
      _picked = n;
      _bounce++;
      _line = '$n! I love it! Hello {name}, I\'m $n!';
    });
    Sfx.giggle();
    app.creatureName = n;
    await Voice.say(_line);
  }

  void _done() {
    app.creatureName = _picked ?? 'Bibi';
    app.hatched = true;
    app.save();
    Navigator.of(context).pushReplacement(softRoute(const HomeScreen()));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Meadow(
        child: Stack(
          children: [
            SafeArea(
              child: Center(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      Bubble(_line),
                      const SizedBox(height: 12),
                      if (!_hatched)
                        GestureDetector(
                          onTap: _tapEgg,
                          child: AnimatedBuilder(
                            animation: Listenable.merge([_wobble, _idle]),
                            builder: (_, child) {
                              final w = _wobble.isAnimating ? sin(_wobble.value * pi * 6) * .16 * (1 - _wobble.value) : sin(_idle.value * 2 * pi) * .03 * (_taps + 1);
                              final glow = 10.0 + _taps * 8;
                              return Transform.rotate(
                                angle: w,
                                alignment: Alignment.bottomCenter,
                                child: Container(
                                  decoration: BoxDecoration(shape: BoxShape.circle, boxShadow: [
                                    BoxShadow(color: C.sun.withValues(alpha: .35 + _taps * .1), blurRadius: glow * 2, spreadRadius: glow / 2),
                                  ]),
                                  child: child,
                                ),
                              );
                            },
                            child: SizedBox(
                              width: 250,
                              height: 250,
                              child: Stack(children: [
                                Positioned.fill(child: Image.asset('assets/bibi/egg.webp')),
                                Positioned.fill(child: CustomPaint(painter: _Cracks(_taps))),
                              ]),
                            ),
                          ),
                        )
                      else
                        TweenAnimationBuilder<double>(
                          tween: Tween(begin: 0, end: 1),
                          duration: const Duration(milliseconds: 900),
                          curve: Curves.elasticOut,
                          builder: (_, v, c) => Transform.scale(scale: v, child: c),
                          child: Bibi(mood: Mood.cheer, size: 240, bounce: _bounce, showGrowth: false, onTap: Sfx.giggle),
                        ),
                      const SizedBox(height: 16),
                      if (_hatched) ...[
                        Wrap(
                          alignment: WrapAlignment.center,
                          spacing: 10,
                          runSpacing: 12,
                          children: [
                            for (final n in creatureNames)
                              Chunky(
                                color: _picked == n ? C.sun : C.paper,
                                shadow: _picked == n ? C.sunDeep : C.shadow,
                                onTap: () => _pickName(n),
                                child: Text(n, style: T.d(24)),
                              ),
                          ],
                        ),
                        const SizedBox(height: 18),
                        if (_picked != null)
                          Chunky(
                            color: C.leaf,
                            shadow: C.leafDeep,
                            onTap: _done,
                            child: const Row(mainAxisSize: MainAxisSize.min, children: [
                              Text('Let\'s play!'),
                              SizedBox(width: 8),
                              Icon(Icons.arrow_forward_rounded, color: Colors.white, size: 30),
                            ]),
                          ),
                      ],
                    ],
                  ),
                ),
              ),
            ),
            IgnorePointer(
              child: AnimatedOpacity(
                duration: const Duration(milliseconds: 250),
                opacity: _flash ? 1 : 0,
                child: Container(color: Colors.white),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Cracks extends CustomPainter {
  _Cracks(this.n);
  final int n;

  @override
  void paint(Canvas c, Size s) {
    final p = Paint()
      ..color = const Color(0xFF8E5A2B)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 4
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;
    final w = s.width, h = s.height;
    final cracks = [
      [Offset(w * .42, h * .3), Offset(w * .47, h * .38), Offset(w * .43, h * .44), Offset(w * .49, h * .5)],
      [Offset(w * .62, h * .4), Offset(w * .57, h * .47), Offset(w * .63, h * .53)],
      [Offset(w * .32, h * .55), Offset(w * .38, h * .6), Offset(w * .34, h * .67)],
      [Offset(w * .66, h * .62), Offset(w * .6, h * .68), Offset(w * .66, h * .74), Offset(w * .6, h * .8)],
    ];
    for (var i = 0; i < min(n, cracks.length); i++) {
      final path = Path()..moveTo(cracks[i][0].dx, cracks[i][0].dy);
      for (final o in cracks[i].skip(1)) {
        path.lineTo(o.dx, o.dy);
      }
      c.drawPath(path, p);
    }
  }

  @override
  bool shouldRepaint(_Cracks old) => old.n != n;
}
