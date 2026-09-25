import 'dart:math';

import 'package:flutter/material.dart';

import '../services/sfx.dart';
import '../services/voice.dart';
import '../state.dart';
import '../theme.dart';
import '../widgets/bibi.dart';
import '../widgets/game_frame.dart';
import '../widgets/ui.dart';

enum Shape { square, triangle, rectangle, circle, star, heart, diamond, oval }

/// One piece of the house, and where it goes.
class _Piece {
  const _Piece(this.shape, this.color, this.rect, this.job);
  final Shape shape;
  final Color color;
  final Rect rect; // in a 100 x 100 picture
  final String job;
}

const _house = [
  _Piece(Shape.square, Color(0xFFFFB26B), Rect.fromLTWH(22, 46, 50, 46), 'the walls'),
  _Piece(Shape.triangle, Color(0xFFFF5C8A), Rect.fromLTWH(16, 18, 62, 30), 'the roof'),
  _Piece(Shape.rectangle, Color(0xFF7D5FD6), Rect.fromLTWH(40, 66, 15, 26), 'the door'),
  _Piece(Shape.circle, Color(0xFFFFD233), Rect.fromLTWH(78, 4, 18, 18), 'the sun'),
  _Piece(Shape.star, Color(0xFFFFD233), Rect.fromLTWH(4, 2, 14, 14), 'a twinkly star'),
];

/// Shape Builder: find the right shape and it flies into a picture.
/// Five shapes build a whole house.
class ShapeBuilder extends StatefulWidget {
  const ShapeBuilder({super.key});

  @override
  State<ShapeBuilder> createState() => _ShapeBuilderState();
}

class _ShapeBuilderState extends State<ShapeBuilder> {
  final _r = Random();
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
    final others = Shape.values.where((s) => s != _piece.shape).toList()..shuffle(_r);
    _choices = [_piece.shape, others[0], others[1]]..shuffle(_r);
    _wrong = null;
    _mood = Mood.happy;
    _line = _round == 0
        ? 'Let\'s build a house! First, find the ${_piece.shape.name} for ${_piece.job}.'
        : 'Now find the ${_piece.shape.name} for ${_piece.job}!';
    setState(() {});
    Voice.say(_line);
  }

  Future<void> _pick(Shape s) async {
    if (_busy) return;
    _busy = true;
    if (s == _piece.shape) {
      Sfx.correct();
      app.learned(Skill.shapes);
      setState(() {
        _mood = Mood.cheer;
        _bounce++;
        _line = '${yayLine(_r)} A ${s.name}!';
        _round++;
      });
      await Voice.say(_line);
      if (!mounted) return;
      if (_round >= _house.length) {
        setState(() => _line = 'Look! We built a whole house together!');
        await Voice.say(_line);
        if (mounted) finishGame(context, Skill.shapes, 'Shape Builder');
      } else {
        _newRound();
      }
    } else {
      Sfx.tryAgain();
      setState(() {
        _wrong = s;
        _mood = Mood.puzzled;
        _wobble++;
        _line = 'That\'s a ${s.name}! Can you find the ${_piece.shape.name}?';
      });
      await Voice.say(_line);
      if (mounted) setState(() => _mood = Mood.happy);
    }
    _busy = false;
  }

  @override
  Widget build(BuildContext context) {
    return GameFrame(
      round: _round,
      total: _house.length,
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
              child: LayoutBuilder(builder: (context, box) {
                final side = min(box.maxWidth, box.maxHeight) * .92;
                final k = side / 100;
                return Center(
                  child: SizedBox(
                    width: side,
                    height: side,
                    child: Stack(
                      children: [
                        for (var i = 0; i < _house.length; i++)
                          if (i < _round)
                            Positioned.fromRect(
                              rect: Rect.fromLTWH(_house[i].rect.left * k, _house[i].rect.top * k, _house[i].rect.width * k, _house[i].rect.height * k),
                              child: TweenAnimationBuilder<double>(
                                tween: Tween(begin: 0, end: 1),
                                duration: const Duration(milliseconds: 800),
                                curve: Curves.elasticOut,
                                builder: (_, v, c) => Transform.scale(scale: v, child: c),
                                child: CustomPaint(painter: ShapePainter(_house[i].shape, _house[i].color)),
                              ),
                            )
                          else if (i == _round)
                            Positioned.fromRect(
                              rect: Rect.fromLTWH(_house[i].rect.left * k, _house[i].rect.top * k, _house[i].rect.width * k, _house[i].rect.height * k),
                              child: _Pulse(child: CustomPaint(painter: ShapePainter(_house[i].shape, C.ink.withValues(alpha: .12), outline: true))),
                            ),
                        // grass line
                        Positioned(
                          left: 0,
                          right: 0,
                          top: 92 * k,
                          child: Container(height: 6 * k, decoration: BoxDecoration(color: C.leaf, borderRadius: BorderRadius.circular(10))),
                        ),
                      ],
                    ),
                  ),
                );
              }),
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
                        child: CustomPaint(painter: ShapePainter(s, s == _piece.shape ? _piece.color : _decoy(s))),
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

  // Decoys are colourful too, so colour never gives the answer away.
  Color _decoy(Shape s) => const [C.aqua, C.lilac, C.peach, C.berry, C.sun, C.leaf, C.sky, C.lilacDeep][s.index];
}

class _Pulse extends StatefulWidget {
  const _Pulse({required this.child});
  final Widget child;

  @override
  State<_Pulse> createState() => _PulseState();
}

class _PulseState extends State<_Pulse> with SingleTickerProviderStateMixin {
  late final _c = AnimationController(vsync: this, duration: const Duration(milliseconds: 1100))..repeat(reverse: true);

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => FadeTransition(opacity: Tween(begin: .4, end: 1.0).animate(_c), child: widget.child);
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
        p.addRRect(RRect.fromRectAndRadius(Rect.fromCenter(center: Offset(w / 2, h / 2), width: side, height: side), Radius.circular(side * .08)));
      case Shape.rectangle:
        final rw = w == h ? w * .56 : w;
        p.addRRect(RRect.fromRectAndRadius(Rect.fromCenter(center: Offset(w / 2, h / 2), width: rw, height: h), Radius.circular(rw * .12)));
      case Shape.triangle:
        p
          ..moveTo(w / 2, 0)
          ..lineTo(w, h)
          ..lineTo(0, h)
          ..close();
      case Shape.circle:
        p.addOval(Rect.fromCircle(center: Offset(w / 2, h / 2), radius: min(w, h) / 2));
      case Shape.oval:
        p.addOval(Rect.fromCenter(center: Offset(w / 2, h / 2), width: w, height: h * .62));
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
          i == 0 ? p.moveTo(cx + cos(a) * rr, cy + sin(a) * rr) : p.lineTo(cx + cos(a) * rr, cy + sin(a) * rr);
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
      c.drawPath(p, Paint()
        ..color = C.ink.withValues(alpha: .35)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 3);
    } else {
      c.drawPath(p.shift(const Offset(0, 4)), Paint()..color = Colors.black.withValues(alpha: .12));
      c.drawPath(p, Paint()..color = color);
      c.drawPath(p, Paint()
        ..color = Colors.white.withValues(alpha: .35)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 3);
    }
  }

  @override
  bool shouldRepaint(ShapePainter old) => old.shape != shape || old.color != color || old.outline != outline;
}
