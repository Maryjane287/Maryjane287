import 'dart:math';

import 'package:flutter/material.dart';

import '../services/sfx.dart';
import '../services/voice.dart';
import '../state.dart';
import '../theme.dart';
import '../widgets/bibi.dart';
import '../widgets/game_frame.dart';
import '../widgets/star_catch.dart';
import '../widgets/juice.dart';
import '../widgets/ui.dart';
import 'letter_garden.dart';

enum Shape { square, triangle, rectangle, circle, star, heart, diamond, oval }

/// One piece of the house, and where it goes.
class _Piece {
  const _Piece(this.shape, this.color, this.rect, this.job, {this.twin});
  final Shape shape;
  final Color color;
  final Rect rect; // in a 100 x 100 picture
  final String job;
  final Rect? twin; // a second copy, like the robot's other eye

  List<Rect> get rects => [rect, ?twin];
}

const _house = [
  _Piece(
    Shape.square,
    Color(0xFFFFB26B),
    Rect.fromLTWH(22, 46, 50, 46),
    'Find the square for the walls!',
  ),
  _Piece(
    Shape.triangle,
    Color(0xFFFF5C8A),
    Rect.fromLTWH(16, 18, 62, 30),
    'Now find the triangle for the roof!',
  ),
  _Piece(
    Shape.rectangle,
    Color(0xFF7D5FD6),
    Rect.fromLTWH(40, 66, 15, 26),
    'Now find the rectangle for the door!',
  ),
  _Piece(
    Shape.circle,
    Color(0xFFFFD233),
    Rect.fromLTWH(78, 4, 18, 18),
    'Now find the circle for the sun!',
  ),
  _Piece(
    Shape.star,
    Color(0xFFFFD233),
    Rect.fromLTWH(4, 2, 14, 14),
    'Now find the star for the sky!',
  ),
];

const _rocket = [
  _Piece(Shape.rectangle, Color(0xFF9B7BFF), Rect.fromLTWH(38, 32, 24, 44), 'Find the rectangle for the rocket!'),
  _Piece(Shape.triangle, Color(0xFFFF5C8A), Rect.fromLTWH(36, 10, 28, 23), 'Now find the triangle for the nose!'),
  _Piece(Shape.circle, Color(0xFF6FD6F5), Rect.fromLTWH(43, 40, 14, 14), 'Now find the circle for the window!'),
  _Piece(Shape.diamond, Color(0xFFFF9E3D), Rect.fromLTWH(41, 75, 18, 18), 'Now find the diamond for the fire!'),
  _Piece(Shape.star, Color(0xFFFFD233), Rect.fromLTWH(8, 6, 16, 16), 'Now find the star for the sky!'),
];

const _boat = [
  _Piece(Shape.oval, Color(0xFFFF9E5A), Rect.fromLTWH(14, 64, 72, 22), 'Find the oval for the boat!'),
  _Piece(Shape.rectangle, Color(0xFF8A5A3C), Rect.fromLTWH(47, 22, 5, 44), 'Now find the rectangle for the mast!'),
  _Piece(Shape.triangle, Color(0xFFFFF3F7), Rect.fromLTWH(53, 26, 30, 36), 'Now find the triangle for the sail!'),
  _Piece(Shape.heart, Color(0xFFFF4F7B), Rect.fromLTWH(44, 8, 13, 13), 'Now find the heart for the flag!'),
  _Piece(Shape.circle, Color(0xFFFFD233), Rect.fromLTWH(78, 4, 18, 18), 'Now find the circle for the sun!'),
];

const _robot = [
  _Piece(Shape.square, Color(0xFF8FB8DE), Rect.fromLTWH(33, 10, 34, 30), "Find the square for the robot's head!"),
  _Piece(Shape.rectangle, Color(0xFF5FCFB8), Rect.fromLTWH(26, 42, 48, 40), 'Now find the rectangle for the body!'),
  _Piece(Shape.circle, Color(0xFFFFFFFF), Rect.fromLTWH(38, 18, 9, 9), 'Now find the circle for the eyes!', twin: Rect.fromLTWH(53, 18, 9, 9)),
  _Piece(Shape.heart, Color(0xFFFF4F7B), Rect.fromLTWH(43, 54, 14, 14), "Now find the heart for the robot's heart!"),
  _Piece(Shape.star, Color(0xFFFFD233), Rect.fromLTWH(43, 0, 13, 11), 'Now find the star for the antenna!'),
];

const _castle = [
  _Piece(Shape.square, Color(0xFFB9A7E8), Rect.fromLTWH(20, 50, 60, 42), 'Find the square for the castle wall!'),
  _Piece(Shape.rectangle, Color(0xFF9B87D8), Rect.fromLTWH(8, 32, 18, 60), 'Now find the rectangle for the tower!', twin: Rect.fromLTWH(74, 32, 18, 60)),
  _Piece(Shape.triangle, Color(0xFFFF5C8A), Rect.fromLTWH(5, 14, 24, 19), 'Now find the triangle for the tower roof!', twin: Rect.fromLTWH(71, 14, 24, 19)),
  _Piece(Shape.rectangle, Color(0xFF8A5A3C), Rect.fromLTWH(42, 66, 16, 26), 'Now find the rectangle for the door!'),
  _Piece(Shape.heart, Color(0xFFFF4F7B), Rect.fromLTWH(44, 32, 12, 12), 'Now find the heart for the flag!'),
];

const _train = [
  _Piece(Shape.rectangle, Color(0xFFFF6B6B), Rect.fromLTWH(10, 52, 54, 26), 'Find the rectangle for the train!'),
  _Piece(Shape.square, Color(0xFF4DA3FF), Rect.fromLTWH(60, 34, 30, 44), 'Now find the square for the cabin!'),
  _Piece(Shape.circle, Color(0xFF444466), Rect.fromLTWH(16, 74, 18, 18), 'Now find the circle for the wheels!', twin: Rect.fromLTWH(58, 74, 18, 18)),
  _Piece(Shape.diamond, Color(0xFFFFD233), Rect.fromLTWH(1, 56, 11, 13), 'Now find the diamond for the lamp!'),
  _Piece(Shape.star, Color(0xFFFFD233), Rect.fromLTWH(80, 6, 14, 14), 'Now find the star for the sky!'),
];

const _flower = [
  _Piece(Shape.circle, Color(0xFFFFD233), Rect.fromLTWH(40, 23, 20, 20), 'Find the circle for the middle of the flower!'),
  _Piece(Shape.heart, Color(0xFFFF7BB0), Rect.fromLTWH(41, 5, 18, 17), 'Now find the heart for the petals!', twin: Rect.fromLTWH(41, 42, 18, 17)),
  _Piece(Shape.rectangle, Color(0xFF5BC25B), Rect.fromLTWH(48, 58, 4, 34), 'Now find the rectangle for the stem!'),
  _Piece(Shape.oval, Color(0xFF5BC25B), Rect.fromLTWH(52, 66, 20, 10), 'Now find the oval for the leaf!'),
  _Piece(Shape.circle, Color(0xFFFFB84D), Rect.fromLTWH(80, 4, 16, 16), 'Now find the circle for the sun!'),
];

/// One picture per level: house, rocket, boat, robot, castle, train,
/// flower. Then a surprise mix.
const _pictures = [
  (_house, "Let's build a house!", 'Look! We built a whole house together!'),
  (_rocket, "Let's build a rocket!", 'Look! We built a rocket! Three, two, one, blast off!'),
  (_boat, "Let's build a boat!", 'Look! We built a boat! Splish splash!'),
  (_robot, "Let's build a robot!", 'Look! We built a robot! Beep boop!'),
  (_castle, "Let's build a castle!", 'Look! We built a castle! Fit for a king and queen!'),
  (_train, "Let's build a train!", 'Look! We built a train! Choo choo!'),
  (_flower, "Let's build a flower!", 'Look! We built a beautiful flower!'),
];

/// Shape Builder: find the right shape and it flies into a picture.
/// Five shapes build a whole house.
class ShapeBuilder extends StatefulWidget {
  const ShapeBuilder({super.key});

  @override
  State<ShapeBuilder> createState() => _ShapeBuilderState();
}

class _ShapeBuilderState extends State<ShapeBuilder> {
  static const maxLevel = 7;
  final _r = Random();
  final _level = app.levelOf('shapes');
  // Two pictures per game: this level's picture, then a bonus one.
  late final List<(List<_Piece>, String, String)> _pics = () {
    final first = _pictures[levelMode(_level, maxLevel, Random()) - 1];
    final others = _pictures.take(min(_level + 1, _pictures.length)).where((p) => p != first).toList()..shuffle(_r);
    return [first, others.first];
  }();
  int _picIndex = 0;
  (List<_Piece>, String, String) get _pic => _pics[_picIndex];
  List<_Piece> get _house => _pic.$1;
  int get _done => _picIndex == 0 ? _round : _pics[0].$1.length + _round;
  int get _total => _pics[0].$1.length + _pics[1].$1.length;
  int _round = 0;
  late List<Shape> _choices;
  String _line = '';
  Mood _mood = Mood.happy;
  int _bounce = 0, _wobble = 0;
  bool _busy = false;
  Shape? _wrong;

  _Piece get _piece => _house[_round];

  @override
  void initState() {
    super.initState();
    _newRound();
  }

  void _newRound() {
    final others = Shape.values.where((s) => s != _piece.shape).toList()
      ..shuffle(_r);
    _choices = [_piece.shape, others[0], others[1], if (_level >= 3) others[2]]..shuffle(_r);
    _wrong = null;
    _mood = Mood.happy;
    _line = _round == 0 ? '${_picIndex == 0 ? '${levelLine(_level)}|' : ''}${_pic.$2}|${_piece.job}' : _piece.job;
    setState(() {});
    Voice.say(_line);
  }

  Future<void> _pick(Shape s) async {
    if (_busy) return;
    _busy = true;
    if (s == _piece.shape) {
      app.learned(Skill.shapes);
      final cheer = Juice.correct(context);
      Sfx.whoosh();
      setState(() {
        _mood = Mood.dance;
        _bounce++;
        _line = '$cheer|${s == Shape.oval ? 'An' : 'A'} ${s.name}!';
        _round++;
      });
      await Voice.say(_line);
      if (!mounted) return;
      if (_round >= _house.length) {
        Sfx.tada();
        celebrate(context, count: 100);
        setState(() => _line = _pic.$3);
        await Voice.say(_line);
        if (!mounted) return;
        if (_picIndex == 0) {
          // Picture one is done: a dance party, then a bonus picture.
          await danceBreak(context);
          if (!mounted) return;
          setState(() {
            _picIndex = 1;
            _round = 0;
          });
          _newRound();
        } else {
          await starCatch(context);
          if (!mounted) return;
          finishGame(context, Skill.shapes, 'Shape Builder', game: 'shapes', maxLevel: maxLevel);
        }
      } else {
        if (mounted) _newRound();
      }
    } else {
      final oops = Juice.oops();
      setState(() {
        _wrong = s;
        _mood = Mood.laugh;
        _wobble++;
        _line = '${thatsA(s.name)}|$oops';
      });
      await Voice.say(_line);
      if (mounted) setState(() => _mood = Mood.happy);
    }
    _busy = false;
  }

  @override
  Widget build(BuildContext context) {
    return GameFrame(
      host: 'tiko',
      level: _level,
      scene: 'playroom',
      round: _done,
      total: _total,
      line: _line,
      mood: _mood,
      bounce: _bounce,
      wobble: _wobble,
      body: Column(
        children: [
          Expanded(
            child: Container(
              width: double.infinity,
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: .55),
                borderRadius: BorderRadius.circular(28),
                border: Border.all(color: Colors.white, width: 4),
              ),
              child: LayoutBuilder(
                builder: (context, box) {
                  final side = min(box.maxWidth, box.maxHeight) * .92;
                  final k = side / 100;
                  return Center(
                    child: SizedBox(
                      width: side,
                      height: side,
                      child: Stack(
                        children: [
                          ..._pieceWidgets(k),
                          // grass line
                          Positioned(
                            left: 0,
                            right: 0,
                            top: 92 * k,
                            child: Container(
                              height: 6 * k,
                              decoration: BoxDecoration(
                                color: C.leaf,
                                borderRadius: BorderRadius.circular(10),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
          ),
          const SizedBox(height: 16),
          if (_round < _house.length)
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                for (final s in _choices)
                  AnimatedOpacity(
                    duration: const Duration(milliseconds: 250),
                    opacity: _wrong == s ? .45 : 1,
                    child: Chunky(
                      color: C.paper,
                      shadow: C.shadow,
                      radius: 28,
                      padding: const EdgeInsets.all(16),
                      onTap: () => _pick(s),
                      child: SizedBox(
                        width: 64,
                        height: 64,
                        child: CustomPaint(
                          painter: ShapePainter(
                            s,
                            s == _piece.shape ? _piece.color : _decoy(s),
                          ),
                        ),
                      ),
                    ),
                  ),
              ],
            ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }

  List<Widget> _pieceWidgets(double k) => [
        for (var i = 0; i < _house.length; i++)
          for (final r in _house[i].rects)
            if (i <= _round)
              Positioned.fromRect(
                rect: Rect.fromLTWH(r.left * k, r.top * k, r.width * k, r.height * k),
                child: i < _round
                    ? TweenAnimationBuilder<double>(
                        tween: Tween(begin: 0, end: 1),
                        duration: const Duration(milliseconds: 800),
                        curve: Curves.elasticOut,
                        builder: (_, v, c) => Transform.scale(scale: v, child: c),
                        child: CustomPaint(painter: ShapePainter(_house[i].shape, _house[i].color)),
                      )
                    : _Pulse(child: CustomPaint(painter: ShapePainter(_house[i].shape, C.ink.withValues(alpha: .12), outline: true))),
              ),
      ];

  // Decoys are colourful too, so colour never gives the answer away.
  Color _decoy(Shape s) => const [
    C.aqua,
    C.lilac,
    C.peach,
    C.berry,
    C.sun,
    C.leaf,
    C.sky,
    C.lilacDeep,
  ][s.index];
}

class _Pulse extends StatefulWidget {
  const _Pulse({required this.child});
  final Widget child;

  @override
  State<_Pulse> createState() => _PulseState();
}

class _PulseState extends State<_Pulse> with SingleTickerProviderStateMixin {
  late final _c = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 1100),
  )..repeat(reverse: true);

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => FadeTransition(
    opacity: Tween(begin: .4, end: 1.0).animate(_c),
    child: widget.child,
  );
}

class ShapePainter extends CustomPainter {
  ShapePainter(this.shape, this.color, {this.outline = false});

  final Shape shape;
  final Color color;
  final bool outline;

  @override
  void paint(Canvas c, Size s) {
    final w = s.width, h = s.height;
    final p = Path();
    switch (shape) {
      case Shape.square:
        final side = min(w, h);
        p.addRRect(
          RRect.fromRectAndRadius(
            Rect.fromCenter(
              center: Offset(w / 2, h / 2),
              width: side,
              height: side,
            ),
            Radius.circular(side * .08),
          ),
        );
      case Shape.rectangle:
        final rw = w == h ? w * .56 : w;
        p.addRRect(
          RRect.fromRectAndRadius(
            Rect.fromCenter(center: Offset(w / 2, h / 2), width: rw, height: h),
            Radius.circular(rw * .12),
          ),
        );
      case Shape.triangle:
        p
          ..moveTo(w / 2, 0)
          ..lineTo(w, h)
          ..lineTo(0, h)
          ..close();
      case Shape.circle:
        p.addOval(
          Rect.fromCircle(center: Offset(w / 2, h / 2), radius: min(w, h) / 2),
        );
      case Shape.oval:
        p.addOval(
          Rect.fromCenter(
            center: Offset(w / 2, h / 2),
            width: w,
            height: h * .62,
          ),
        );
      case Shape.diamond:
        p
          ..moveTo(w / 2, 0)
          ..lineTo(w * .85, h / 2)
          ..lineTo(w / 2, h)
          ..lineTo(w * .15, h / 2)
          ..close();
      case Shape.star:
        final cx = w / 2, cy = h / 2, r = min(w, h) / 2, ri = r * .45;
        for (var i = 0; i < 10; i++) {
          final a = -pi / 2 + i * pi / 5;
          final rr = i.isEven ? r : ri;
          i == 0
              ? p.moveTo(cx + cos(a) * rr, cy + sin(a) * rr)
              : p.lineTo(cx + cos(a) * rr, cy + sin(a) * rr);
        }
        p.close();
      case Shape.heart:
        p
          ..moveTo(w / 2, h * .92)
          ..cubicTo(-w * .2, h * .45, w * .2, -h * .15, w / 2, h * .25)
          ..cubicTo(w * .8, -h * .15, w * 1.2, h * .45, w / 2, h * .92)
          ..close();
    }
    if (outline) {
      c.drawPath(p, Paint()..color = color);
      c.drawPath(
        p,
        Paint()
          ..color = C.ink.withValues(alpha: .35)
          ..style = PaintingStyle.stroke
          ..strokeWidth = 3,
      );
    } else {
      c.drawPath(
        p.shift(const Offset(0, 4)),
        Paint()..color = Colors.black.withValues(alpha: .12),
      );
      c.drawPath(p, Paint()..color = color);
      c.drawPath(
        p,
        Paint()
          ..color = Colors.white.withValues(alpha: .35)
          ..style = PaintingStyle.stroke
          ..strokeWidth = 3,
      );
    }
  }

  @override
  bool shouldRepaint(ShapePainter old) =>
      old.shape != shape || old.color != color || old.outline != outline;
}
