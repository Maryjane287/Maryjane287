import 'dart:math';

import 'package:flutter/material.dart';

import '../services/sfx.dart';
import '../services/voice.dart';
import '../state.dart';
import '../theme.dart';
import '../widgets/art.dart';
import '../widgets/bibi.dart';
import '../widgets/game_frame.dart';
import '../widgets/juice.dart';

/// One letter, the sound it makes, and a picture that starts with it.
class Phonic {
  const Phonic(this.letter, this.sound, this.art, this.word);
  final String letter;
  final String sound;
  final String art;
  final String word;
}

const phonics = [
  Phonic('a', 'ah', 'ant', 'ant'),
  Phonic('b', 'buh', 'bear', 'bear'),
  Phonic('c', 'kuh', 'cat', 'cat'),
  Phonic('d', 'duh', 'dog', 'dog'),
  Phonic('e', 'eh', 'egg', 'egg'),
  Phonic('f', 'ffff', 'fish', 'fish'),
  Phonic('g', 'guh', 'gorilla', 'gorilla'),
  Phonic('h', 'huh', 'hat', 'hat'),
  Phonic('l', 'llll', 'lion', 'lion'),
  Phonic('m', 'mmmm', 'monkey', 'monkey'),
  Phonic('n', 'nnnn', 'nest', 'nest'),
  Phonic('o', 'oh', 'octopus', 'octopus'),
  Phonic('p', 'puh', 'pig', 'pig'),
  Phonic('r', 'rrrr', 'rainbow', 'rainbow'),
  Phonic('s', 'ssss', 'sun', 'sun'),
  Phonic('t', 'tuh', 'turtle', 'turtle'),
  Phonic('z', 'zzzz', 'zebra', 'zebra'),
];

/// "That's a bear!", "That's an ant!", "That's the sun!"
String thatsA(String word) {
  if (word == 'sun') return "That's the sun!";
  return "That's ${'aeiou'.contains(word[0]) ? 'an' : 'a'} $word!";
}

extension PhonicLines on Phonic {
  String get intro => 'This is ${letter.toUpperCase()}. It says $sound.';
  String get question => 'Pop the bubble that starts with $sound!';
  String get chant => '$sound, $sound, $word!';
}

/// Letter Garden: picture bubbles float up through the garden. Pop the one
/// that starts with the letter's sound and a flower bursts into bloom.
class LetterGarden extends StatefulWidget {
  const LetterGarden({super.key});

  @override
  State<LetterGarden> createState() => _LetterGardenState();
}

class _LetterGardenState extends State<LetterGarden> with SingleTickerProviderStateMixin {
  static const rounds = 5;
  static const _flowers = ['tulip', 'sunflower', 'daisy', 'bluebell', 'rose'];
  final _r = Random();
  late final _float = AnimationController(vsync: this, duration: const Duration(seconds: 11))..repeat();
  int _round = 0;
  late Phonic _target;
  late List<Phonic> _choices;
  late List<double> _phase;
  final _popped = <String>{};
  final _wobbles = <String, int>{};
  final _used = <String>{};
  String _line = '';
  Mood _mood = Mood.happy;
  int _bounce = 0, _wobble = 0;
  bool _busy = false;
  int _letterPop = 0;

  @override
  void initState() {
    super.initState();
    _newRound();
  }

  @override
  void dispose() {
    _float.dispose();
    super.dispose();
  }

  void _newRound() {
    final pool = phonics.where((p) => !_used.contains(p.letter)).toList()..shuffle(_r);
    _target = pool.first;
    _used.add(_target.letter);
    final others = phonics.where((p) => p.letter != _target.letter).toList()..shuffle(_r);
    _choices = [_target, others[0], others[1], others[2]]..shuffle(_r);
    _phase = [0.0, .25, .5, .75]..shuffle(_r);
    _popped.clear();
    _busy = false;
    _mood = Mood.happy;
    _letterPop++;
    _line = '${_target.intro}|${_target.question}';
    setState(() {});
    Sfx.zip();
    Voice.say(_line);
  }

  Future<void> _tapBubble(Phonic p, Offset at) async {
    if (_busy || _popped.contains(p.letter)) return;
    if (p.letter == _target.letter) {
      _busy = true;
      Sfx.pop();
      setState(() => _popped.add(p.letter));
      Juice.starBurst(context, at, count: 18, colors: const [Colors.white, C.sky, C.lilac, C.sun]);
      app.learned(Skill.letters);
      final cheer = Juice.correct(context, at: at);
      setState(() {
        _mood = Mood.dance;
        _bounce++;
        _round++;
        _line = '$cheer|${_target.chant}';
      });
      await Voice.say(_line);
      if (!mounted) return;
      if (_round >= rounds) {
        setState(() => _line = "Look! It's growing!|Ta-da!");
        Sfx.tada();
        await Voice.say(_line);
        if (mounted) finishGame(context, Skill.letters, 'Letter Garden');
        return;
      }
      if (_round == 3) await danceBreak(context);
      if (mounted) _newRound();
    } else {
      final oops = Juice.oops();
      setState(() {
        _wobbles[p.letter] = (_wobbles[p.letter] ?? 0) + 1;
        _mood = Mood.laugh;
        _wobble++;
        _line = '${thatsA(p.word)}|$oops';
      });
      await Voice.say(_line);
      if (mounted && !_busy) setState(() => _mood = Mood.happy);
    }
  }

  @override
  Widget build(BuildContext context) {
    return GameFrame(
      host: 'momo',
      scene: 'garden',
      round: _round,
      total: rounds,
      line: _line,
      mood: _mood,
      bounce: _bounce,
      wobble: _wobble,
      onIdle: () => Voice.say(_target.question),
      body: Column(
        children: [
          // The big letter, like a sun. Tap to hear it again.
          GestureDetector(
            onTap: () {
              Sfx.sparkle();
              setState(() => _letterPop++);
              Voice.say(_target.intro);
            },
            child: TweenAnimationBuilder<double>(
              key: ValueKey(_letterPop),
              tween: Tween(begin: 0, end: 1),
              duration: const Duration(milliseconds: 800),
              curve: Curves.elasticOut,
              builder: (_, v, c) => Transform.scale(scale: .4 + v * .6, child: c),
              child: Container(
                width: 116,
                height: 116,
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  gradient: const RadialGradient(colors: [Color(0xFFFFF3B0), C.sun]),
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white, width: 6),
                  boxShadow: [BoxShadow(color: C.sun.withValues(alpha: .6), blurRadius: 24, spreadRadius: 4)],
                ),
                child: Text('${_target.letter.toUpperCase()}${_target.letter}', style: T.l(52, color: C.ink)),
              ),
            ),
          ),
          // Floating bubbles
          Expanded(
            child: LayoutBuilder(builder: (context, box) {
              const size = 108.0;
              return AnimatedBuilder(
                animation: _float,
                builder: (_, _) => Stack(
                  children: [
                    for (var i = 0; i < _choices.length; i++)
                      if (!_popped.contains(_choices[i].letter))
                        Builder(builder: (_) {
                          final p = _choices[i];
                          final t = (_float.value + _phase[i]) % 1;
                          final lane = (i + .5) / _choices.length;
                          final x = lane * box.maxWidth - size / 2 + sin((t * 2 + i) * pi * 2) * 14;
                          final y = box.maxHeight - t * (box.maxHeight + size) ;
                          return Positioned(
                            left: x.clamp(0, box.maxWidth - size),
                            top: y,
                            child: GestureDetector(
                              onTapDown: (d) => _tapBubble(p, d.globalPosition),
                              child: TweenAnimationBuilder<double>(
                                key: ValueKey('w${p.letter}${_wobbles[p.letter] ?? 0}'),
                                tween: Tween(begin: 1, end: 0),
                                duration: const Duration(milliseconds: 500),
                                builder: (_, v, c) => Transform.rotate(angle: sin(v * pi * 6) * .25 * v, child: c),
                                child: _Bubble(art: p.art, size: size),
                              ),
                            ),
                          );
                        }),
                  ],
                ),
              );
            }),
          ),
          // The garden: one flower bursts up for each right answer
          SizedBox(
            height: 96,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                for (var i = 0; i < rounds; i++)
                  i < _round
                      ? TweenAnimationBuilder<double>(
                          tween: Tween(begin: 0, end: 1),
                          duration: const Duration(milliseconds: 1000),
                          curve: Curves.elasticOut,
                          builder: (_, v, c) => Transform.scale(scale: v, alignment: Alignment.bottomCenter, child: c),
                          child: _Sway(seed: i, child: Art(_flowers[i], size: 78)),
                        )
                      : Container(
                          width: 26,
                          height: 12,
                          margin: const EdgeInsets.only(bottom: 10),
                          decoration: BoxDecoration(color: const Color(0xFF6E4A2D), borderRadius: BorderRadius.circular(10)),
                        ),
              ],
            ),
          ),
          const SizedBox(height: 8),
        ],
      ),
    );
  }
}

class _Bubble extends StatelessWidget {
  const _Bubble({required this.art, required this.size});
  final String art;
  final double size;

  @override
  Widget build(BuildContext context) => Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          gradient: RadialGradient(
            center: const Alignment(-.35, -.4),
            colors: [Colors.white.withValues(alpha: .95), const Color(0xFFBFE7FF).withValues(alpha: .55), const Color(0xFFB69CFF).withValues(alpha: .45)],
            stops: const [0, .55, 1],
          ),
          border: Border.all(color: Colors.white.withValues(alpha: .9), width: 3),
          boxShadow: [BoxShadow(color: const Color(0xFF7D5FD6).withValues(alpha: .25), blurRadius: 12, offset: const Offset(0, 6))],
        ),
        child: Stack(children: [
          Center(child: Art(art, size: size * .68)),
          Positioned(left: size * .2, top: size * .14, child: Container(width: size * .2, height: size * .12, decoration: BoxDecoration(color: Colors.white.withValues(alpha: .8), borderRadius: BorderRadius.circular(20)))),
        ]),
      );
}

class _Sway extends StatefulWidget {
  const _Sway({required this.seed, required this.child});
  final int seed;
  final Widget child;

  @override
  State<_Sway> createState() => _SwayState();
}

class _SwayState extends State<_Sway> with SingleTickerProviderStateMixin {
  late final _c = AnimationController(vsync: this, duration: Duration(milliseconds: 1400 + widget.seed * 200))..repeat(reverse: true);

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
        animation: _c,
        builder: (_, c) => Transform.rotate(angle: (_c.value - .5) * .25, alignment: Alignment.bottomCenter, child: c),
        child: widget.child,
      );
}
