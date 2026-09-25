import 'dart:math';

import 'package:flutter/material.dart';

enum SkyTime { day, dusk, night }

SkyTime skyNow([DateTime? t]) {
  final h = (t ?? DateTime.now()).hour;
  if (h >= 7 && h < 17) return SkyTime.day;
  if ((h >= 17 && h < 19) || h == 6) return SkyTime.dusk;
  return SkyTime.night;
}

/// The world behind everything. A painted scene fills the screen and a
/// living layer moves on top: by day a smiling sun and drifting clouds,
/// at dusk a warm glow, at night twinkling stars, a sleepy moon and
/// fireflies. Game screens pass a [scene] such as 'orchard' or 'party'.
class Meadow extends StatefulWidget {
  const Meadow({super.key, required this.child, this.forceTime, this.scene});

  final Widget child;
  final SkyTime? forceTime;
  final String? scene;

  @override
  State<Meadow> createState() => _MeadowState();
}

class _MeadowState extends State<Meadow> with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(
    vsync: this,
    duration: const Duration(seconds: 40),
  )..repeat();

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final time = widget.forceTime ?? skyNow();
    final outdoor = widget.scene == null;
    final bg = widget.scene ?? time.name;
    return Stack(
      fit: StackFit.expand,
      children: [
        Image.asset(
          'assets/bg/$bg.webp',
          fit: BoxFit.cover,
          alignment: Alignment.bottomCenter,
          gaplessPlayback: true,
        ),
        RepaintBoundary(
          child: AnimatedBuilder(
            animation: _c,
            builder: (_, _) => CustomPaint(
              painter: _SkyPainter(_c.value, time, outdoor: outdoor),
            ),
          ),
        ),
        widget.child,
      ],
    );
  }
}

class _SkyPainter extends CustomPainter {
  _SkyPainter(this.t, this.time, {this.outdoor = true});

  final double t;
  final SkyTime time;
  final bool outdoor;
  static final _rand = Random(7);
  static final _stars = List.generate(
    40,
    (_) => Offset(_rand.nextDouble(), _rand.nextDouble() * .55),
  );

  @override
  void paint(Canvas canvas, Size s) {
    if (!outdoor) {
      // Indoors: soft floating sparkles, like dust in sunlight.
      for (var i = 0; i < 14; i++) {
        final x = (f(i, 1) + sin(t * 2 * pi * 2 + i) * .02) * s.width;
        final y = ((f(i, 2) - t * (0.6 + f(i, 3))) % 1) * s.height;
        final glow = .5 + .5 * sin(t * 2 * pi * 6 + i * 2);
        canvas.drawCircle(
          Offset(x, y),
          2 + f(i, 4) * 2,
          Paint()..color = Colors.white.withValues(alpha: .35 * glow),
        );
      }
      return;
    }
    if (time == SkyTime.night) {
      for (var i = 0; i < _stars.length; i++) {
        final tw = .4 + .6 * (sin((t * 2 * pi * 6) + i * 1.7) * .5 + .5);
        canvas.drawCircle(
          Offset(_stars[i].dx * s.width, _stars[i].dy * s.height * .8),
          1.2 + (i % 3) * .7,
          Paint()..color = Colors.white.withValues(alpha: tw),
        );
      }
      _moon(canvas, Offset(s.width * .8, s.height * .12), 34);
      for (var i = 0; i < 12; i++) {
        final x = (f(i, 1) + sin(t * 2 * pi * 2 + i) * .03) * s.width;
        final y = s.height * (.6 + f(i, 2) * .35) + cos(t * 2 * pi * 3 + i) * 8;
        final glow = .5 + .5 * sin(t * 2 * pi * 8 + i * 2);
        canvas.drawCircle(
          Offset(x, y),
          7,
          Paint()
            ..color = const Color(0xFFFFF3A0).withValues(alpha: .18 * glow),
        );
        canvas.drawCircle(
          Offset(x, y),
          2.4,
          Paint()..color = const Color(0xFFFFF3A0).withValues(alpha: .9 * glow),
        );
      }
      return;
    }
    _sun(
      canvas,
      Offset(s.width * .84, s.height * .09),
      time == SkyTime.dusk ? 38 : 34,
      time == SkyTime.dusk,
    );
    final cloud = Paint()
      ..color = Colors.white.withValues(alpha: time == SkyTime.dusk ? .7 : .9);
    for (var i = 0; i < 3; i++) {
      final speed = .5 + i * .25;
      final x = ((t * speed + i * .37) % 1.3 - .15) * s.width;
      final y = s.height * (.06 + i * .08);
      _cloud(canvas, Offset(x, y), 22.0 + i * 6, cloud);
    }
    // Butterflies flutter over the meadow by day
    if (time == SkyTime.day) {
      for (var i = 0; i < 3; i++) {
        final bx = ((t * (0.7 + i * .2) + i * .33) % 1) * s.width;
        final by = s.height * (.55 + i * .08) + sin(t * 2 * pi * 5 + i) * 18;
        final flap = (sin(t * 2 * pi * 60 + i) * .5 + .5) * 7 + 3;
        final col = [
          const Color(0xFFFF7FA8),
          const Color(0xFFFFD84D),
          const Color(0xFFB69CFF),
        ][i];
        final p = Paint()..color = col;
        canvas.drawOval(
          Rect.fromCenter(center: Offset(bx - 4, by), width: flap, height: 11),
          p,
        );
        canvas.drawOval(
          Rect.fromCenter(center: Offset(bx + 4, by), width: flap, height: 11),
          p,
        );
        canvas.drawLine(
          Offset(bx, by - 5),
          Offset(bx, by + 5),
          Paint()
            ..color = const Color(0xFF5C5480)
            ..strokeWidth = 2,
        );
      }
    }
  }

  double f(int i, int k) =>
      ((sin(i * 12.9898 + k * 78.233) * 43758.5453) % 1).abs();

  void _sun(Canvas c, Offset o, double r, bool dusk) {
    final rays = Paint()
      ..color = (dusk ? const Color(0xFFFFB36B) : const Color(0xFFFFE27A))
          .withValues(alpha: .7)
      ..strokeWidth = 5
      ..strokeCap = StrokeCap.round;
    for (var i = 0; i < 10; i++) {
      final a = i * 2 * pi / 10 + t * 2 * pi;
      c.drawLine(
        o + Offset(cos(a), sin(a)) * (r + 8),
        o + Offset(cos(a), sin(a)) * (r + 20),
        rays,
      );
    }
    c.drawCircle(
      o,
      r,
      Paint()..color = dusk ? const Color(0xFFFFA24D) : const Color(0xFFFFD233),
    );
    final face = Paint()..color = const Color(0xFF8A5A00);
    c.drawCircle(o + Offset(-r * .32, -r * .1), 3.2, face);
    c.drawCircle(o + Offset(r * .32, -r * .1), 3.2, face);
    c.drawArc(
      Rect.fromCircle(center: o + Offset(0, r * .12), radius: r * .32),
      .3,
      pi - .6,
      false,
      Paint()
        ..color = const Color(0xFF8A5A00)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 3
        ..strokeCap = StrokeCap.round,
    );
    c.drawCircle(
      o + Offset(-r * .55, r * .2),
      5,
      Paint()..color = const Color(0x55FF5C8A),
    );
    c.drawCircle(
      o + Offset(r * .55, r * .2),
      5,
      Paint()..color = const Color(0x55FF5C8A),
    );
  }

  void _moon(Canvas c, Offset o, double r) {
    c.drawCircle(o, r + 16, Paint()..color = const Color(0x22FFF6C8));
    final crescent = Path.combine(
      PathOperation.difference,
      Path()..addOval(Rect.fromCircle(center: o, radius: r)),
      Path()..addOval(
        Rect.fromCircle(center: o + Offset(r * .45, -r * .2), radius: r * .85),
      ),
    );
    c.drawPath(crescent, Paint()..color = const Color(0xFFFFF3C4));
    final eye = Paint()
      ..color = const Color(0xFF8A7A40)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.5
      ..strokeCap = StrokeCap.round;
    c.drawArc(
      Rect.fromCircle(center: o + Offset(-r * .55, -r * .05), radius: 5),
      .2,
      pi - .4,
      false,
      eye,
    );
  }

  void _cloud(Canvas c, Offset o, double r, Paint p) {
    c.drawCircle(o, r, p);
    c.drawCircle(o + Offset(r * .9, r * .2), r * .8, p);
    c.drawCircle(o + Offset(-r * .9, r * .25), r * .7, p);
    c.drawRRect(
      RRect.fromRectAndRadius(
        Rect.fromLTWH(o.dx - r * 1.5, o.dy, r * 3.1, r * .9),
        Radius.circular(r),
      ),
      p,
    );
  }

  @override
  bool shouldRepaint(_SkyPainter old) =>
      old.t != t || old.time != time || old.outdoor != outdoor;
}
