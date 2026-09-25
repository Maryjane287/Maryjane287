import 'dart:math';

import 'package:flutter/material.dart';

enum SkyTime { day, dusk, night }

SkyTime skyNow([DateTime? t]) {
  final h = (t ?? DateTime.now()).hour;
  if (h >= 7 && h < 17) return SkyTime.day;
  if ((h >= 17 && h < 19) || h == 6) return SkyTime.dusk;
  return SkyTime.night;
}

/// The meadow world behind everything. The sky follows the real clock:
/// drifting clouds and a smiling sun by day, a peachy sunset at dusk,
/// twinkling stars and a sleepy moon at night.
class Meadow extends StatefulWidget {
  const Meadow({super.key, required this.child, this.forceTime});

  final Widget child;
  final SkyTime? forceTime;

  @override
  State<Meadow> createState() => _MeadowState();
}

class _MeadowState extends State<Meadow> with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(vsync: this, duration: const Duration(seconds: 40))..repeat();

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final time = widget.forceTime ?? skyNow();
    return Stack(
      fit: StackFit.expand,
      children: [
        RepaintBoundary(
          child: AnimatedBuilder(
            animation: _c,
            builder: (_, _) => CustomPaint(painter: _SkyPainter(_c.value, time)),
          ),
        ),
        widget.child,
      ],
    );
  }
}

class _SkyPainter extends CustomPainter {
  _SkyPainter(this.t, this.time);

  final double t;
  final SkyTime time;
  static final _rand = Random(7);
  static final _stars = List.generate(40, (_) => Offset(_rand.nextDouble(), _rand.nextDouble() * .55));
  static final _flowers = List.generate(22, (_) => [_rand.nextDouble(), _rand.nextDouble(), _rand.nextDouble()]);

  @override
  void paint(Canvas canvas, Size s) {
    final (top, bottom, hillA, hillB) = switch (time) {
      SkyTime.day => (const Color(0xFF7CC8FF), const Color(0xFFD7F1FF), const Color(0xFF8ED67C), const Color(0xFF6CC062)),
      SkyTime.dusk => (const Color(0xFFFF8E7A), const Color(0xFFFFD9A0), const Color(0xFF7AAE68), const Color(0xFF5E9E62)),
      SkyTime.night => (const Color(0xFF1C1840), const Color(0xFF3B2F6B), const Color(0xFF3B6B55), const Color(0xFF2F5A48)),
    };
    final rect = Offset.zero & s;
    canvas.drawRect(rect, Paint()..shader = LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter, colors: [top, bottom]).createShader(rect));

    if (time == SkyTime.night) {
      for (var i = 0; i < _stars.length; i++) {
        final tw = .4 + .6 * (sin((t * 2 * pi * 6) + i * 1.7) * .5 + .5);
        canvas.drawCircle(
          Offset(_stars[i].dx * s.width, _stars[i].dy * s.height),
          1.2 + (i % 3) * .7,
          Paint()..color = Colors.white.withValues(alpha: tw),
        );
      }
      _moon(canvas, Offset(s.width * .8, s.height * .12), 34);
    } else {
      _sun(canvas, Offset(s.width * .84, s.height * .1), time == SkyTime.dusk ? 38 : 34, time == SkyTime.dusk);
      final cloud = Paint()..color = Colors.white.withValues(alpha: time == SkyTime.dusk ? .75 : .92);
      for (var i = 0; i < 3; i++) {
        final speed = .5 + i * .25;
        final x = ((t * speed + i * .37) % 1.3 - .15) * s.width;
        final y = s.height * (.08 + i * .1);
        _cloud(canvas, Offset(x, y), 26.0 + i * 6, cloud);
      }
    }

    // Rolling hills
    final back = Path()
      ..moveTo(0, s.height * .72)
      ..quadraticBezierTo(s.width * .3, s.height * .62, s.width * .62, s.height * .7)
      ..quadraticBezierTo(s.width * .85, s.height * .76, s.width, s.height * .66)
      ..lineTo(s.width, s.height)
      ..lineTo(0, s.height)
      ..close();
    canvas.drawPath(back, Paint()..color = hillA);
    final front = Path()
      ..moveTo(0, s.height * .8)
      ..quadraticBezierTo(s.width * .45, s.height * .7, s.width, s.height * .8)
      ..lineTo(s.width, s.height)
      ..lineTo(0, s.height)
      ..close();
    canvas.drawPath(front, Paint()..color = hillB);

    // Swaying flowers
    if (time != SkyTime.night) {
      const petals = [Color(0xFFFF7FA8), Color(0xFFFFD84D), Colors.white, Color(0xFFB69CFF)];
      for (var i = 0; i < _flowers.length; i++) {
        final f = _flowers[i];
        final base = Offset(f[0] * s.width, s.height * (.8 + f[1] * .18));
        final sway = sin(t * 2 * pi * 4 + i) * 3;
        final head = base + Offset(sway, -12 - f[2] * 6);
        canvas.drawLine(base, head, Paint()
          ..color = const Color(0xFF3E8A3D)
          ..strokeWidth = 2);
        final pc = Paint()..color = petals[i % petals.length];
        for (var k = 0; k < 5; k++) {
          final a = k * 2 * pi / 5 + t * 2;
          canvas.drawCircle(head + Offset(cos(a) * 4, sin(a) * 4), 3.2, pc);
        }
        canvas.drawCircle(head, 2.6, Paint()..color = const Color(0xFFFFB800));
      }
    } else {
      // Fireflies
      for (var i = 0; i < 10; i++) {
        final x = (f(i, 1) + sin(t * 2 * pi * 2 + i) * .03) * s.width;
        final y = s.height * (.7 + f(i, 2) * .25) + cos(t * 2 * pi * 3 + i) * 8;
        final glow = .5 + .5 * sin(t * 2 * pi * 8 + i * 2);
        canvas.drawCircle(Offset(x, y), 7, Paint()..color = const Color(0xFFFFF3A0).withValues(alpha: .18 * glow));
        canvas.drawCircle(Offset(x, y), 2.4, Paint()..color = const Color(0xFFFFF3A0).withValues(alpha: .9 * glow));
      }
    }
  }

  double f(int i, int k) => ((sin(i * 12.9898 + k * 78.233) * 43758.5453) % 1).abs();

  void _sun(Canvas c, Offset o, double r, bool dusk) {
    final rays = Paint()
      ..color = (dusk ? const Color(0xFFFFB36B) : const Color(0xFFFFE27A)).withValues(alpha: .7)
      ..strokeWidth = 5
      ..strokeCap = StrokeCap.round;
    for (var i = 0; i < 10; i++) {
      final a = i * 2 * pi / 10 + t * 2 * pi;
      c.drawLine(o + Offset(cos(a), sin(a)) * (r + 8), o + Offset(cos(a), sin(a)) * (r + 20), rays);
    }
    c.drawCircle(o, r, Paint()..color = dusk ? const Color(0xFFFFA24D) : const Color(0xFFFFD233));
    final face = Paint()..color = const Color(0xFF8A5A00);
    c.drawCircle(o + Offset(-r * .32, -r * .1), 3.2, face);
    c.drawCircle(o + Offset(r * .32, -r * .1), 3.2, face);
    c.drawArc(Rect.fromCircle(center: o + Offset(0, r * .12), radius: r * .32), .3, pi - .6, false,
        Paint()
          ..color = const Color(0xFF8A5A00)
          ..style = PaintingStyle.stroke
          ..strokeWidth = 3
          ..strokeCap = StrokeCap.round);
    c.drawCircle(o + Offset(-r * .55, r * .2), 5, Paint()..color = const Color(0x55FF5C8A));
    c.drawCircle(o + Offset(r * .55, r * .2), 5, Paint()..color = const Color(0x55FF5C8A));
  }

  void _moon(Canvas c, Offset o, double r) {
    c.drawCircle(o, r + 16, Paint()..color = const Color(0x22FFF6C8));
    final crescent = Path.combine(
      PathOperation.difference,
      Path()..addOval(Rect.fromCircle(center: o, radius: r)),
      Path()..addOval(Rect.fromCircle(center: o + Offset(r * .45, -r * .2), radius: r * .85)),
    );
    c.drawPath(crescent, Paint()..color = const Color(0xFFFFF3C4));
    final eye = Paint()
      ..color = const Color(0xFF8A7A40)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.5
      ..strokeCap = StrokeCap.round;
    c.drawArc(Rect.fromCircle(center: o + Offset(-r * .55, -r * .05), radius: 5), .2, pi - .4, false, eye);
  }

  void _cloud(Canvas c, Offset o, double r, Paint p) {
    c.drawCircle(o, r, p);
    c.drawCircle(o + Offset(r * .9, r * .2), r * .8, p);
    c.drawCircle(o + Offset(-r * .9, r * .25), r * .7, p);
    c.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(o.dx - r * 1.5, o.dy, r * 3.1, r * .9), Radius.circular(r)), p);
  }

  @override
  bool shouldRepaint(_SkyPainter old) => old.t != t || old.time != time;
}
