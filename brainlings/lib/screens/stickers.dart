import 'package:flutter/material.dart';

import '../services/sfx.dart';
import '../services/voice.dart';
import '../state.dart';
import '../theme.dart';
import '../widgets/sky.dart';
import '../widgets/ui.dart';

/// Every finished game adds a sticker. Tap one to make it wiggle.
class StickerAlbum extends StatelessWidget {
  const StickerAlbum({super.key});

  static const slots = 20;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Meadow(
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                Row(children: [
                  RoundIcon(icon: Icons.arrow_back_rounded, label: 'Back', onTap: () => Navigator.of(context).pop()),
                  const SizedBox(width: 12),
                  Text('📒 My stickers', style: T.d(30)),
                ]),
                const SizedBox(height: 16),
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFFF6D6),
                      borderRadius: BorderRadius.circular(28),
                      border: Border.all(color: Colors.white, width: 5),
                      boxShadow: const [BoxShadow(color: C.shadow, offset: Offset(0, 8))],
                    ),
                    child: GridView.count(
                      crossAxisCount: 4,
                      mainAxisSpacing: 10,
                      crossAxisSpacing: 10,
                      children: [
                        for (var i = 0; i < slots; i++)
                          i < app.stickers.length ? _Sticker(app.stickers[i]) : _Empty(),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                Bubble(app.stickers.isEmpty ? 'Play a game to win your very first sticker!' : 'You have ${app.stickers.length} stickers! Wow!'),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _Empty extends StatelessWidget {
  @override
  Widget build(BuildContext context) => Container(
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(color: const Color(0xFFF1DE9A), width: 3),
        ),
        child: const Center(child: Text('?', style: TextStyle(fontSize: 26, color: Color(0xFFE4C875), fontWeight: FontWeight.w800))),
      );
}

class _Sticker extends StatefulWidget {
  const _Sticker(this.emoji);
  final String emoji;

  @override
  State<_Sticker> createState() => _StickerState();
}

class _StickerState extends State<_Sticker> with SingleTickerProviderStateMixin {
  late final _c = AnimationController(vsync: this, duration: const Duration(milliseconds: 600));

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => GestureDetector(
        onTap: () {
          Sfx.pop();
          _c.forward(from: 0);
          Voice.say(const ['Ooh, shiny!', 'I love that one!', 'So cool!', 'Wiggle wiggle!'][widget.emoji.codeUnitAt(0) % 4]);
        },
        child: AnimatedBuilder(
          animation: _c,
          builder: (_, c) => Transform.rotate(angle: (1 - _c.value) * _c.value * 2.4 * (_c.value < .5 ? 1 : -1), child: Transform.scale(scale: 1 + (1 - _c.value) * _c.value * 1.2, child: c)),
          child: Container(
            decoration: BoxDecoration(
              color: Colors.white,
              shape: BoxShape.circle,
              boxShadow: const [BoxShadow(color: C.shadow, offset: Offset(0, 4))],
              border: Border.all(color: C.sun, width: 3),
            ),
            child: Center(child: Text(widget.emoji, style: const TextStyle(fontSize: 36))),
          ),
        ),
      );
}
