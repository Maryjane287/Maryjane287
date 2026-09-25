import 'dart:math';

import 'package:flutter/material.dart';

import '../state.dart';

enum Mood { happy, sleepy, letter, cheer, hungry, puzzled }

/// The child's creature. Always alive: it bobs, breathes, bounces when
/// something good happens and wobbles when it is confused.
///
/// Change [bounce] or [wobble] to any new number to trigger that move.
class Bibi extends StatefulWidget {
  const Bibi({
    super.key,
    this.mood = Mood.happy,
    this.size = 260,
    this.bounce = 0,
    this.wobble = 0,
    this.onTap,
    this.showGrowth = true,
  });

  final Mood mood;
  final double size;
  final int bounce;
  final int wobble;
  final VoidCallback? onTap;
  final bool showGrowth;

  @override
  State<Bibi> createState() => _BibiState();
}

class _BibiState extends State<Bibi> with TickerProviderStateMixin {
  late final AnimationController _idle = AnimationController(vsync: this, duration: const Duration(milliseconds: 2600))..repeat();
  late final AnimationController _jump = AnimationController(vsync: this, duration: const Duration(milliseconds: 650));
  late final AnimationController _shake = AnimationController(vsync: this, duration: const Duration(milliseconds: 500));

  @override
  void didUpdateWidget(Bibi old) {
    super.didUpdateWidget(old);
    if (old.bounce != widget.bounce) _jump.forward(from: 0);
    if (old.wobble != widget.wobble) _shake.forward(from: 0);
    final slow = widget.mood == Mood.sleepy;
    final d = Duration(milliseconds: slow ? 4200 : 2600);
    if (_idle.duration != d) {
      _idle.duration = d;
      _idle.repeat();
    }
  }

  @override
  void dispose() {
    _idle.dispose();
    _jump.dispose();
    _shake.dispose();
    super.dispose();
  }

  void _tap() {
    _jump.forward(from: 0);
    widget.onTap?.call();
  }

  @override
  Widget build(BuildContext context) {
    final growth = widget.showGrowth ? (.84 + app.stage * .055) : 1.0;
    final size = widget.size * growth;
    return GestureDetector(
      onTap: widget.onTap == null ? null : _tap,
      behavior: HitTestBehavior.opaque,
      child: SizedBox(
        width: widget.size * 1.15,
        height: widget.size * 1.12,
        child: AnimatedBuilder(
          animation: Listenable.merge([_idle, _jump, _shake]),
          builder: (context, _) {
            final i = _idle.value * 2 * pi;
            var dy = sin(i) * size * .022;
            var sx = 1 + sin(i) * .015;
            var sy = 1 - sin(i) * .015;
            // Squash, leap and land
            final j = _jump.value;
            if (_jump.isAnimating) {
              if (j < .25) {
                final k = j / .25;
                sx += .14 * k;
                sy -= .14 * k;
              } else if (j < .7) {
                final k = (j - .25) / .45;
                dy -= sin(k * pi) * size * .18;
                sx -= .06 * sin(k * pi);
                sy += .08 * sin(k * pi);
              } else {
                final k = (j - .7) / .3;
                sx += .08 * sin(k * pi);
                sy -= .08 * sin(k * pi);
              }
            }
            final rot = _shake.isAnimating ? sin(_shake.value * pi * 5) * .09 * (1 - _shake.value) : 0.0;
            final lift = (-dy / (size * .2)).clamp(0.0, 1.0);
            return Stack(
              alignment: Alignment.bottomCenter,
              clipBehavior: Clip.none,
              children: [
                // Soft shadow on the grass
                Positioned(
                  bottom: size * .03,
                  child: Container(
                    width: size * .55 * (1 - lift * .35),
                    height: size * .07,
                    decoration: BoxDecoration(
                      color: Colors.black.withValues(alpha: .13 * (1 - lift * .5)),
                      borderRadius: BorderRadius.circular(size),
                    ),
                  ),
                ),
                Positioned(
                  bottom: size * .02 - dy,
                  child: Transform.rotate(
                    angle: rot,
                    alignment: Alignment.bottomCenter,
                    child: Transform(
                      alignment: Alignment.bottomCenter,
                      transform: Matrix4.diagonal3Values(sx, sy, 1),
                      child: SizedBox(
                        width: size,
                        height: size,
                        child: Stack(
                          clipBehavior: Clip.none,
                          children: [
                            Positioned.fill(
                              child: AnimatedSwitcher(
                                duration: const Duration(milliseconds: 260),
                                transitionBuilder: (c, a) => ScaleTransition(
                                  scale: Tween(begin: .92, end: 1.0).animate(a),
                                  child: FadeTransition(opacity: a, child: c),
                                ),
                                child: Image.asset(
                                  'assets/bibi/${widget.mood.name}.webp',
                                  key: ValueKey(widget.mood),
                                  fit: BoxFit.contain,
                                  gaplessPlayback: true,
                                ),
                              ),
                            ),
                            if (widget.showGrowth) ..._growth(size),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  /// Bibi grows in the direction of what the child learns most.
  List<Widget> _growth(double size) {
    final look = app.look;
    final out = <Widget>[];
    if (look == GrowthLook.starry || look == GrowthLook.balanced) {
      final n = look == GrowthLook.starry ? 3 + app.stage : 2;
      for (var k = 0; k < n; k++) {
        final a = _idle.value * 2 * pi + k * 2 * pi / n;
        out.add(Positioned(
          left: size * .5 + cos(a) * size * .5 - 11,
          top: size * .5 + sin(a) * size * .18 - 11,
          child: Opacity(
            opacity: sin(a) > -.2 ? 1 : .55,
            child: CustomPaint(size: const Size(22, 22), painter: _StarPainter()),
          ),
        ));
      }
    }
    if (look == GrowthLook.bookish || look == GrowthLook.balanced) {
      out.add(Positioned(
        left: size * .2,
        top: size * .1,
        child: Transform.rotate(
          angle: -.35,
          child: CustomPaint(size: Size(size * .26, size * .16), painter: _BookHatPainter()),
        ),
      ));
    }
    return out;
  }
}

class _StarPainter extends CustomPainter {
  @override
  void paint(Canvas c, Size s) {
    final p = Path();
    final cx = s.width / 2, cy = s.height / 2, r = s.width / 2, ri = r * .45;
    for (var i = 0; i < 10; i++) {
      final a = -pi / 2 + i * pi / 5;
      final rr = i.isEven ? r : ri;
      final pt = Offset(cx + cos(a) * rr, cy + sin(a) * rr);
      i == 0 ? p.moveTo(pt.dx, pt.dy) : p.lineTo(pt.dx, pt.dy);
    }
    p.close();
    c.drawPath(p, Paint()..color = const Color(0xFFFFD233));
    c.drawPath(p, Paint()
      ..color = const Color(0xFFE0A800)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5
      ..strokeJoin = StrokeJoin.round);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

/// A little open storybook perched on Bibi's head like a hat.
class _BookHatPainter extends CustomPainter {
  @override
  void paint(Canvas c, Size s) {
    final w = s.width, h = s.height;
    final cover = Paint()..color = const Color(0xFF7D5FD6);
    final page = Paint()..color = const Color(0xFFFFFBF0);
    final line = Paint()
      ..color = const Color(0xFFCFC6E8)
      ..strokeWidth = 1.4;
    final spine = Offset(w / 2, h * .95);
    // cover
    c.drawPath(
        Path()
          ..moveTo(spine.dx, spine.dy)
          ..quadraticBezierTo(w * .25, h * .75, 0, h * .9)
          ..lineTo(0, h * .25)
          ..quadraticBezierTo(w * .25, h * .1, spine.dx, h * .3)
          ..quadraticBezierTo(w * .75, h * .1, w, h * .25)
          ..lineTo(w, h * .9)
          ..quadraticBezierTo(w * .75, h * .75, spine.dx, spine.dy)
          ..close(),
        cover);
    // pages
    for (final left in [true, false]) {
      final sgn = left ? -1 : 1;
      final pth = Path()
        ..moveTo(spine.dx, h * .82)
        ..quadraticBezierTo(spine.dx + sgn * w * .22, h * .64, spine.dx + sgn * w * .45, h * .76)
        ..lineTo(spine.dx + sgn * w * .45, h * .16)
        ..quadraticBezierTo(spine.dx + sgn * w * .22, h * .02, spine.dx, h * .22)
        ..close();
      c.drawPath(pth, page);
      for (var k = 0; k < 3; k++) {
        final y = h * (.3 + k * .14);
        c.drawLine(Offset(spine.dx + sgn * w * .08, y), Offset(spine.dx + sgn * w * .37, y - h * .02), line);
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
