import 'dart:math';

import 'package:flutter/material.dart';

import '../services/sfx.dart';
import 'art.dart';
import 'juice.dart';

/// Something that drifts across the meadow on its own: a balloon, a present,
/// a butterfly, a soap bubble. Tap it to pop it. It floats away if nobody does.
class Floater extends StatefulWidget {
  const Floater({
    super.key,
    this.art,
    required this.startX,
    this.size = 70,
    this.seconds = 9,
    this.sideways = false,
    required this.onPop,
    required this.onGone,
  });

  /// Art name, or null for a shiny soap bubble.
  final String? art;

  /// 0..1 across the screen where it starts.
  final double startX;
  final double size;
  final int seconds;

  /// Drifts left to right instead of rising.
  final bool sideways;
  final VoidCallback onPop;
  final VoidCallback onGone;

  @override
  State<Floater> createState() => _FloaterState();
}

class _FloaterState extends State<Floater> with TickerProviderStateMixin {
  late final _move = AnimationController(vsync: this, duration: Duration(seconds: widget.seconds))
    ..forward().whenComplete(() {
      if (!_popped) widget.onGone();
    });
  late final _pop = AnimationController(vsync: this, duration: const Duration(milliseconds: 260));
  final _phase = Random().nextDouble() * pi * 2;
  bool _popped = false;

  @override
  void dispose() {
    _move.dispose();
    _pop.dispose();
    super.dispose();
  }

  void _tap(TapDownDetails d) {
    if (_popped) return;
    _popped = true;
    Sfx.pop();
    Juice.starBurst(context, d.globalPosition, count: 12);
    widget.onPop();
    _pop.forward().whenComplete(widget.onGone);
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(builder: (context, box) {
      return AnimatedBuilder(
        animation: Listenable.merge([_move, _pop]),
        builder: (_, _) {
          final t = _move.value;
          final sway = sin(t * pi * 4 + _phase);
          final double x, y;
          if (widget.sideways) {
            x = -widget.size + t * (box.maxWidth + widget.size * 2);
            y = box.maxHeight * (.25 + widget.startX * .4) + sway * 26;
          } else {
            x = widget.startX * (box.maxWidth - widget.size) + sway * 22;
            y = box.maxHeight - t * (box.maxHeight + widget.size * 1.6);
          }
          final s = 1 + _pop.value * .6;
          return Stack(children: [
            Positioned(
              left: x,
              top: y,
              child: Opacity(
                opacity: 1 - _pop.value,
                child: Transform.scale(
                  scale: s,
                  child: Transform.rotate(
                    angle: sway * .12,
                    child: GestureDetector(
                      onTapDown: _tap,
                      child: widget.art == null
                          ? _SoapBubble(size: widget.size)
                          : Art(widget.art!, size: widget.size),
                    ),
                  ),
                ),
              ),
            ),
          ]);
        },
      );
    });
  }
}

class _SoapBubble extends StatelessWidget {
  const _SoapBubble({required this.size});
  final double size;

  @override
  Widget build(BuildContext context) => Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          gradient: RadialGradient(
            center: const Alignment(-.35, -.4),
            radius: .9,
            colors: [Colors.white.withValues(alpha: .85), const Color(0x66B8F0FF), const Color(0x55E7B8FF), const Color(0x88FFFFFF)],
            stops: const [0, .45, .8, 1],
          ),
          border: Border.all(color: Colors.white.withValues(alpha: .8), width: 2),
        ),
      );
}
