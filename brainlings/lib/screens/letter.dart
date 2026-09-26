import 'dart:io';

import 'package:flutter/material.dart';

import '../services/family_link.dart';
import '../services/sfx.dart';
import '../services/voice.dart';
import '../state.dart';
import '../theme.dart';
import '../widgets/art.dart';
import '../widgets/bibi.dart';
import '../widgets/sky.dart';
import '../widgets/ui.dart';

enum _Stage { ask, listening, after, hugged }

/// A letter from home arrives. The creature brings the envelope, asks if the
/// child wants to hear it, plays it, then offers to send a hug back.
class LetterScreen extends StatefulWidget {
  const LetterScreen({super.key, required this.letter, this.ask = true});

  final Letter letter;

  /// True when the envelope has just arrived. False when opened from the letterbox.
  final bool ask;

  @override
  State<LetterScreen> createState() => _LetterScreenState();
}

class _LetterScreenState extends State<LetterScreen>
    with SingleTickerProviderStateMixin {
  late _Stage _stage = widget.ask ? _Stage.ask : _Stage.listening;
  late final _float = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 1800),
  )..repeat(reverse: true);
  String _line = '';
  int _bounce = 0;

  Letter get l => widget.letter;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      if (widget.ask) {
        Sfx.letter();
        await Future.delayed(const Duration(milliseconds: 500));
        _say(
          '{name}!|${Voice.pick('You got a message from ${l.from}! Would you like to hear what ${l.from} has to say?', 'You got a message!|Would you like to hear it?')}',
        );
      } else {
        _listen();
      }
    });
  }

  @override
  void dispose() {
    _float.dispose();
    Voice.stop();
    super.dispose();
  }

  void _say(String s) {
    setState(() => _line = s);
    Voice.say(s);
  }

  Future<void> _listen() async {
    setState(() {
      _stage = _Stage.listening;
      _line = 'Here is ${l.from}!';
    });
    l.opened = true;
    l.plays++;
    app.save();
    FamilyLink.instance.report(l);
    await Voice.say('Here is ${l.from}!');
    if (!mounted) return;
    final audio = l.audioPath;
    if (audio != null && File(audio).existsSync()) {
      await Voice.playFile(audio);
    } else if (l.text.isNotEmpty) {
      await Voice.say(l.text);
    }
    if (!mounted) return;
    setState(() {
      _stage = l.hugSent ? _Stage.hugged : _Stage.after;
      _bounce++;
    });
    _say(
      l.hugSent
          ? 'Wasn\'t that lovely?'
          : Voice.pick('Would you like to send ${l.from} a big hug back?', 'Would you like to send a big hug back?'),
    );
  }

  Future<void> _hug() async {
    l.hugSent = true;
    app.save();
    FamilyLink.instance.report(l);
    Sfx.hug();
    celebrate(context, count: 26, hearts: true);
    setState(() {
      _stage = _Stage.hugged;
      _bounce++;
    });
    _say(Voice.pick('Whoosh! Your hug is flying to ${l.from}!', 'Whoosh! Your hug is on its way!'));
  }

  @override
  Widget build(BuildContext context) {
    final mood = switch (_stage) {
      _Stage.ask => Mood.letter,
      _Stage.listening => Mood.read,
      _Stage.after => Mood.happy,
      _Stage.hugged => Mood.hug,
    };
    return Scaffold(
      body: Meadow(
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                Align(
                  alignment: Alignment.centerLeft,
                  child: RoundIcon(
                    icon: Icons.arrow_back_rounded,
                    label: 'Back',
                    onTap: () => Navigator.of(context).pop(),
                  ),
                ),
                const Spacer(),
                Bubble(_line),
                const SizedBox(height: 10),
                Stack(
                  alignment: Alignment.center,
                  clipBehavior: Clip.none,
                  children: [
                    if (_stage == _Stage.ask)
                      SizedBox(
                        height: 330,
                        child: Scene(
                          'letter',
                          loop: true,
                          placeholder: Bibi(mood: mood, size: 220),
                        ),
                      )
                    else
                      Bibi(
                        mood: mood,
                        size: 250,
                        bounce: _bounce,
                        onTap: Sfx.giggle,
                      ),
                    if (_stage == _Stage.listening)
                      Positioned(
                        top: 0,
                        right: 0,
                        child: AnimatedBuilder(
                          animation: _float,
                          builder: (_, c) => Transform.translate(
                            offset: Offset(0, -_float.value * 12),
                            child: c,
                          ),
                          child: const Text(
                            '🎵',
                            style: TextStyle(fontSize: 44),
                          ),
                        ),
                      ),
                  ],
                ),
                const Spacer(),
                ..._buttons(),
                const SizedBox(height: 12),
              ],
            ),
          ),
        ),
      ),
    );
  }

  List<Widget> _buttons() {
    switch (_stage) {
      case _Stage.ask:
        return [
          Chunky(
            color: C.leaf,
            shadow: C.leafDeep,
            onTap: _listen,
            child: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Art('envelope_open', size: 36),
                SizedBox(width: 10),
                Text('Yes please!'),
              ],
            ),
          ),
          const SizedBox(height: 14),
          Chunky(
            color: C.paper,
            shadow: C.shadow,
            onTap: () {
              Voice.say('Okay! I\'ll keep it safe in your letterbox.');
              Navigator.of(context).pop();
            },
            child: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Art('letterbox', size: 34),
                SizedBox(width: 10),
                Text('Save it for later'),
              ],
            ),
          ),
        ];
      case _Stage.listening:
        return [const SizedBox(height: 70)];
      case _Stage.after:
        return [
          Chunky(
            color: C.berry,
            shadow: C.berryDeep,
            onTap: _hug,
            child: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Art('heart', size: 36),
                SizedBox(width: 10),
                Text('Send a hug!'),
              ],
            ),
          ),
          const SizedBox(height: 14),
          _again(),
        ];
      case _Stage.hugged:
        return [
          _again(),
          const SizedBox(height: 14),
          Chunky(
            color: C.leaf,
            shadow: C.leafDeep,
            onTap: () => Navigator.of(context).pop(),
            child: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.home_rounded, color: Colors.white, size: 30),
                SizedBox(width: 8),
                Text('Back home'),
              ],
            ),
          ),
        ];
    }
  }

  Widget _again() => Chunky(
    color: C.paper,
    shadow: C.shadow,
    onTap: _listen,
    child: const Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(Icons.replay_rounded, size: 30, color: C.ink),
        SizedBox(width: 8),
        Text('Hear it again'),
      ],
    ),
  );
}

/// All letters, newest first. Unopened ones glow.
class LetterboxScreen extends StatelessWidget {
  const LetterboxScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Meadow(
        child: SafeArea(
          child: ListenableBuilder(
            listenable: app,
            builder: (context, _) {
              final list = app.letters
                  .where((l) => !l.bedtime || l.opened)
                  .toList()
                  .reversed
                  .toList();
              return Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    Row(
                      children: [
                        RoundIcon(
                          icon: Icons.arrow_back_rounded,
                          label: 'Back',
                          onTap: () => Navigator.of(context).pop(),
                        ),
                        const SizedBox(width: 12),
                        const Art('letterbox', size: 44),
                        const SizedBox(width: 6),
                        Text('Letterbox', style: T.d(30)),
                      ],
                    ),
                    const SizedBox(height: 16),
                    if (list.isEmpty)
                      Expanded(
                        child: Center(
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Bubble(
                                'No letters yet. When someone who loves you sends one, I will bring it straight to you!',
                              ),
                              const SizedBox(height: 12),
                              Bibi(
                                mood: Mood.hug,
                                size: 200,
                                onTap: Sfx.giggle,
                              ),
                            ],
                          ),
                        ),
                      )
                    else
                      Expanded(
                        child: GridView.count(
                          crossAxisCount: 2,
                          mainAxisSpacing: 14,
                          crossAxisSpacing: 14,
                          childAspectRatio: 1.05,
                          children: [
                            for (final l in list)
                              Chunky(
                                color: l.opened
                                    ? C.paper
                                    : const Color(0xFFFFE9EE),
                                shadow: l.opened
                                    ? C.shadow
                                    : const Color(0xFFF3B3C3),
                                radius: 26,
                                padding: const EdgeInsets.all(10),
                                onTap: () => Navigator.of(context).push(
                                  softRoute(
                                    LetterScreen(letter: l, ask: false),
                                  ),
                                ),
                                child: Stack(
                                  clipBehavior: Clip.none,
                                  children: [
                                    Column(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        Art(
                                          l.opened
                                              ? 'envelope_open'
                                              : 'envelope',
                                          size: 72,
                                        ),
                                        Text(l.from, style: T.d(20)),
                                        if (l.hugSent)
                                          const Art('heart', size: 24),
                                      ],
                                    ),
                                    if (!l.opened)
                                      const Positioned(
                                        right: -4,
                                        top: -4,
                                        child: GlowDot(),
                                      ),
                                  ],
                                ),
                              ),
                          ],
                        ),
                      ),
                  ],
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}

/// A softly pulsing dot that says "something new is waiting".
class GlowDot extends StatefulWidget {
  const GlowDot({super.key, this.size = 18});
  final double size;

  @override
  State<GlowDot> createState() => _GlowDotState();
}

class _GlowDotState extends State<GlowDot> with SingleTickerProviderStateMixin {
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
  Widget build(BuildContext context) => AnimatedBuilder(
    animation: _c,
    builder: (_, _) => Container(
      width: widget.size,
      height: widget.size,
      decoration: BoxDecoration(
        color: C.berry,
        shape: BoxShape.circle,
        border: Border.all(color: Colors.white, width: 3),
        boxShadow: [
          BoxShadow(
            color: C.berry.withValues(alpha: .6),
            blurRadius: 6 + _c.value * 12,
            spreadRadius: _c.value * 4,
          ),
        ],
      ),
    ),
  );
}
