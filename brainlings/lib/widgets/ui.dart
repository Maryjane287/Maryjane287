import 'dart:math';

import 'package:flutter/material.dart';

import '../services/sfx.dart';
import '../services/voice.dart';
import '../theme.dart';

/// A big, squishy, toy-like button that sinks when pressed.
class Chunky extends StatefulWidget {
  const Chunky({
    super.key,
    required this.child,
    required this.onTap,
    this.color = C.sun,
    this.shadow = C.sunDeep,
    this.radius = 999,
    this.padding = const EdgeInsets.symmetric(horizontal: 26, vertical: 14),
    this.depth = 6,
    this.silent = false,
  });

  final Widget child;
  final VoidCallback? onTap;
  final Color color;
  final Color shadow;
  final double radius;
  final EdgeInsets padding;
  final double depth;
  final bool silent;

  @override
  State<Chunky> createState() => _ChunkyState();
}

class _ChunkyState extends State<Chunky> {
  bool _down = false;

  @override
  Widget build(BuildContext context) {
    final off = _down ? widget.depth - 2 : 0.0;
    final enabled = widget.onTap != null;
    return Semantics(
      button: true,
      enabled: enabled,
      child: GestureDetector(
        onTapDown: enabled ? (_) => setState(() => _down = true) : null,
        onTapCancel: () => setState(() => _down = false),
        onTapUp: enabled
            ? (_) {
                setState(() => _down = false);
                if (!widget.silent) Sfx.tap();
                widget.onTap!();
              }
            : null,
        child: Opacity(
          opacity: enabled ? 1 : .55,
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 70),
            margin: EdgeInsets.only(top: off, bottom: widget.depth - off),
            padding: widget.padding,
            constraints: const BoxConstraints(minHeight: 56, minWidth: 56),
            decoration: BoxDecoration(
              color: widget.color,
              borderRadius: BorderRadius.circular(widget.radius),
              boxShadow: [BoxShadow(color: widget.shadow, offset: Offset(0, widget.depth - off))],
            ),
            child: DefaultTextStyle(
              style: T.d(22, color: widget.color.computeLuminance() > .5 ? C.ink : Colors.white),
              textAlign: TextAlign.center,
              child: Center(widthFactor: 1, heightFactor: 1, child: widget.child),
            ),
          ),
        ),
      ),
    );
  }
}

/// White speech bubble. Tapping it says the line again.
class Bubble extends StatelessWidget {
  const Bubble(this.text, {super.key, this.size = 22, this.speakable = true});

  final String text;
  final double size;
  final bool speakable;

  @override
  Widget build(BuildContext context) {
    if (text.isEmpty) return const SizedBox(height: 56);
    return GestureDetector(
      onTap: speakable ? () => Voice.say(text) : null,
      child: AnimatedSwitcher(
        duration: const Duration(milliseconds: 250),
        transitionBuilder: (c, a) => ScaleTransition(scale: CurvedAnimation(parent: a, curve: Curves.easeOutBack), child: c),
        child: Container(
          key: ValueKey(text),
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
          decoration: BoxDecoration(
            color: C.paper,
            borderRadius: BorderRadius.circular(24),
            boxShadow: const [BoxShadow(color: C.shadow, offset: Offset(0, 4))],
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Flexible(child: Text(Voice.show(text), textAlign: TextAlign.center, style: T.d(size))),
              if (speakable) ...[
                const SizedBox(width: 8),
                const Icon(Icons.volume_up_rounded, color: C.lilacDeep, size: 22),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

/// Round white icon button (back, settings).
class RoundIcon extends StatelessWidget {
  const RoundIcon({super.key, required this.icon, required this.onTap, this.label});

  final IconData icon;
  final VoidCallback onTap;
  final String? label;

  @override
  Widget build(BuildContext context) => Semantics(
        label: label,
        child: Chunky(
          onTap: onTap,
          color: C.paper,
          shadow: C.shadow,
          padding: const EdgeInsets.all(10),
          depth: 4,
          child: Icon(icon, color: C.ink, size: 28),
        ),
      );
}

/// Rainbow confetti that rains down over the whole screen.
void celebrate(BuildContext context, {int count = 70, bool hearts = false}) {
  final overlay = Overlay.of(context);
  late OverlayEntry entry;
  entry = OverlayEntry(builder: (_) => _Confetti(count: count, hearts: hearts, onDone: () => entry.remove()));
  overlay.insert(entry);
}

class _Confetti extends StatefulWidget {
  const _Confetti({required this.count, required this.hearts, required this.onDone});

  final int count;
  final bool hearts;
  final VoidCallback onDone;

  @override
  State<_Confetti> createState() => _ConfettiState();
}

class _ConfettiState extends State<_Confetti> with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(vsync: this, duration: const Duration(milliseconds: 2400))
    ..forward().whenComplete(widget.onDone);
  final _r = Random();
  late final _bits = List.generate(
    widget.count,
    (_) => (
      x: _r.nextDouble(),
      delay: _r.nextDouble() * .35,
      spin: (_r.nextDouble() - .5) * 12,
      drift: (_r.nextDouble() - .5) * .25,
      color: [C.berry, C.sun, C.leaf, C.sky, C.lilac, C.peach, C.aqua][_r.nextInt(7)],
      size: 8 + _r.nextDouble() * 10,
    ),
  );

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final s = MediaQuery.sizeOf(context);
    return IgnorePointer(
      child: AnimatedBuilder(
        animation: _c,
        builder: (_, _) => Stack(
          children: [
            for (final b in _bits)
              if (_c.value > b.delay)
                Builder(builder: (_) {
                  final t = ((_c.value - b.delay) / (1 - b.delay)).clamp(0.0, 1.0);
                  final y = widget.hearts ? s.height * (1 - t) : -30 + t * (s.height + 60);
                  final x = (b.x + sin(t * 6 + b.spin) * .03 + b.drift * t) * s.width;
                  return Positioned(
                    left: x,
                    top: y,
                    child: Opacity(
                      opacity: widget.hearts ? (1 - t) : 1,
                      child: widget.hearts
                          ? Icon(Icons.favorite_rounded, color: b.color, size: b.size * 2.4)
                          : Transform.rotate(
                              angle: t * b.spin,
                              child: Container(
                                width: b.size,
                                height: b.size * 1.4,
                                decoration: BoxDecoration(color: b.color, borderRadius: BorderRadius.circular(3)),
                              ),
                            ),
                    ),
                  );
                }),
          ],
        ),
      ),
    );
  }
}

/// Five round dots showing progress through a game.
class RoundDots extends StatelessWidget {
  const RoundDots({super.key, required this.total, required this.done});

  final int total;
  final int done;

  @override
  Widget build(BuildContext context) => Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          for (var i = 0; i < total; i++)
            AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              margin: const EdgeInsets.symmetric(horizontal: 3),
              width: i == done ? 18 : 13,
              height: i == done ? 18 : 13,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: i < done ? C.leaf : (i == done ? C.sun : Colors.white.withValues(alpha: .7)),
                border: i == done ? Border.all(color: Colors.white, width: 3) : null,
              ),
            ),
        ],
      );
}

/// Gentle fade + rise page transition.
Route<R> softRoute<R>(Widget page) => PageRouteBuilder<R>(
      transitionDuration: const Duration(milliseconds: 420),
      reverseTransitionDuration: const Duration(milliseconds: 300),
      pageBuilder: (_, _, _) => page,
      transitionsBuilder: (_, a, _, child) => FadeTransition(
        opacity: a,
        child: SlideTransition(
          position: Tween(begin: const Offset(0, .04), end: Offset.zero).animate(CurvedAnimation(parent: a, curve: Curves.easeOut)),
          child: child,
        ),
      ),
    );

/// A white card for grown-up screens.
class GrownCard extends StatelessWidget {
  const GrownCard({super.key, required this.children});

  final List<Widget> children;

  @override
  Widget build(BuildContext context) => Container(
        width: double.infinity,
        padding: const EdgeInsets.all(22),
        margin: const EdgeInsets.only(bottom: 16),
        decoration: BoxDecoration(
          color: C.paper,
          borderRadius: BorderRadius.circular(28),
          boxShadow: const [BoxShadow(color: C.shadow, offset: Offset(0, 8))],
        ),
        child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: children),
      );
}

class Eyebrow extends StatelessWidget {
  const Eyebrow(this.text, {super.key});
  final String text;

  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.only(bottom: 6),
        child: Text(text.toUpperCase(), style: T.b(12, color: C.berryDeep, w: FontWeight.w800).copyWith(letterSpacing: 1.4)),
      );
}
