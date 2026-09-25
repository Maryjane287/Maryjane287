import 'dart:math';

import 'package:flutter/material.dart';

import '../state.dart';

enum Mood {
  happy,
  sleepy,
  letter,
  cheer,
  hungry,
  puzzled,
  wave,
  munch,
  dance,
  think,
  wow,
  hug,
  read,
  laugh,
  sad,
}

/// The picture for a mood. When Bibi is just being itself, it shows how it
/// has grown: star patterns for numbers, a book hat for letters, and a
/// flower crown once it becomes a superstar.
String bibiImage(Mood mood, {bool growth = true}) {
  if (growth && mood == Mood.happy) {
    if (app.stage >= 3) return 'bloom';
    switch (app.look) {
      case GrowthLook.starry:
        return 'starry';
      case GrowthLook.bookish:
        return 'bookish';
      case GrowthLook.balanced:
        return app.points[Skill.numbers]! >= app.points[Skill.letters]!
            ? 'starry'
            : 'bookish';
      case GrowthLook.baby:
        return 'happy';
    }
  }
  return mood.name;
}

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
  late final AnimationController _idle = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 2600),
  )..repeat();
  late final AnimationController _jump = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 650),
  );
  late final AnimationController _shake = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 500),
  );

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
            final rot = _shake.isAnimating
                ? sin(_shake.value * pi * 5) * .09 * (1 - _shake.value)
                : 0.0;
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
                      color: Colors.black.withValues(
                        alpha: .13 * (1 - lift * .5),
                      ),
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
                                  'assets/bibi/${bibiImage(widget.mood, growth: widget.showGrowth)}.webp',
                                  key: ValueKey(
                                    bibiImage(
                                      widget.mood,
                                      growth: widget.showGrowth,
                                    ),
                                  ),
                                  fit: BoxFit.contain,
                                  gaplessPlayback: true,
                                ),
                              ),
                            ),
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
}
