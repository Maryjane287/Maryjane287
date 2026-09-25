import 'dart:math';

import 'package:flutter/material.dart';

import '../services/sfx.dart';
import '../services/voice.dart';
import '../state.dart';
import '../theme.dart';
import '../widgets/art.dart';
import '../widgets/bibi.dart';
import '../widgets/game_frame.dart';
import '../widgets/star_catch.dart';
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

/// Words to spell in level four, with the sound of each letter.
const spellWords = [
  ('cat', 'cat', ['Kuh', 'Ah', 'Tuh']),
  ('dog', 'dog', ['Duh', 'Oh', 'Guh']),
  ('hat', 'hat', ['Huh', 'Ah', 'Tuh']),
  ('pig', 'pig', ['Puh', 'Ih', 'Guh']),
  ('sun', 'sun', ['Ssss', 'Uh', 'Nnnn']),
  ('ant', 'ant', ['Ah', 'Nnnn', 'Tuh']),
  ('egg', 'egg', ['Eh', 'Guh', 'Guh']),
];

class _LetterGardenState extends State<LetterGarden> with SingleTickerProviderStateMixin {
  static const rounds = 8;
  static const maxLevel = 7;
  bool get _hard => _level >= 5;
  final _level = app.levelOf('letters');
  int _mode = 1; // 1 sounds, 2 letter hunt, 3 big and little, 4 spelling
  // spelling
  late (String, String, List<String>) _word;
  int _spelled = 0;
  List<String> _tiles = [];
  static const _flowers = ['tulip', 'sunflower', 'daisy', 'bluebell', 'rose'];
  final _r = Random();
  late final _float = AnimationController(vsync: this, duration: Duration(seconds: app.levelOf('letters') >= 5 ? 8 : 11))..repeat();
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
    // 5: letter hunt with small letters, 6: harder spelling, 7: a mix.
    _mode = switch (_level) {
      <= 4 => _level,
      5 => 2,
      6 => 4,
      _ => 1 + _r.nextInt(4),
    };
    final intro = _round == 0 ? '${levelLine(_level)}|' : '';
    if (_mode == 4) {
      var left = spellWords.where((w) => !_used.contains(w.$1)).toList();
      if (left.isEmpty) left = [...spellWords];
      left.shuffle(_r);
      _word = left.first;
      _used.add(_word.$1);
      _spelled = 0;
      final extra = 'bdfmrs'.split('')..shuffle(_r);
      final decoys = extra.where((x) => !_word.$1.contains(x)).take(_hard ? 2 : 1);
      _tiles = [..._word.$1.split(''), ...decoys]..shuffle(_r);
      _busy = false;
      _mood = Mood.read;
      _letterPop++;
      _line = "$intro${_round == 0 ? "Let's spell words!|" : ''}Let's spell ${_word.$1}!|Tap the letters in order!";
      setState(() {});
      Sfx.zip();
      Voice.say(_line);
      return;
    }
    var pool = phonics.where((p) => !_used.contains(p.letter)).toList();
    if (pool.isEmpty) pool = [...phonics];
    pool.shuffle(_r);
    _target = pool.first;
    _used.add(_target.letter);
    final others = phonics.where((p) => p.letter != _target.letter).toList()..shuffle(_r);
    _choices = [_target, others[0], others[1], others[2], if (_hard) others[3]]..shuffle(_r);
    _phase = [for (var i = 0; i < _choices.length; i++) i / _choices.length]..shuffle(_r);
    _popped.clear();
    _busy = false;
    _mood = Mood.happy;
    _letterPop++;
    _line = switch (_mode) {
      2 => '$intro${_round == 0 ? 'Letter hunt!|' : ''}Pop the letter ${_target.letter.toUpperCase()}!',
      3 => '$intro${_round == 0 ? 'Big letters and little letters!|' : ''}Find the little letter that matches!',
      _ => '$intro${_target.intro}|${_target.question}',
    };
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
        _line = _mode == 1 ? '$cheer|${_target.chant}' : '$cheer|${_target.intro}';
      });
      await Voice.say(_line);
      if (!mounted) return;
      if (_round >= rounds) {
        setState(() => _line = "Look! It's growing!|Ta-da!");
        Sfx.tada();
        await Voice.say(_line);
        if (mounted) finishGame(context, Skill.letters, 'Letter Garden', game: 'letters', maxLevel: maxLevel);
        return;
      }
      if (_round == 4) await danceBreak(context);
      if (_round == 6 && mounted) await starCatch(context);
      if (mounted) _newRound();
    } else {
      final oops = Juice.oops();
      setState(() {
        _wobbles[p.letter] = (_wobbles[p.letter] ?? 0) + 1;
        _mood = Mood.laugh;
        _wobble++;
        _line = _mode == 1 ? '${thatsA(p.word)}|$oops' : '$oops|${_question()}';
      });
      await Voice.say(_line);
      if (mounted && !_busy) setState(() => _mood = Mood.happy);
    }
  }

  String _question() => switch (_mode) {
        2 => 'Pop the letter ${_target.letter.toUpperCase()}!',
        3 => 'Find the little letter that matches!',
        4 => 'Which sound comes next?|${_word.$3[_spelled]}!',
        _ => _target.question,
      };

  /// Level four: tap the letters of the word in order.
  Future<void> _tapTile(int i, Offset at) async {
    if (_busy || _spelled >= _word.$1.length) return;
    final want = _word.$1[_spelled];
    if (_tiles[i] == want) {
      Sfx.pop();
      Juice.starBurst(context, at, count: 10);
      setState(() {
        _tiles[i] = '';
        _spelled++;
        _bounce++;
      });
      if (_spelled < _word.$1.length) {
        Voice.say('${_word.$3[_spelled - 1]}!');
        return;
      }
      _busy = true;
      app.learned(Skill.letters, pts: 2);
      final cheer = Juice.correct(context, at: at);
      setState(() {
        _mood = Mood.dance;
        _round++;
        _line = '$cheer|You spelled it!|${_word.$3[0]}, ${_word.$3[1].toLowerCase()}, ${_word.$3[2].toLowerCase()}. ${_word.$1[0].toUpperCase()}${_word.$1.substring(1)}!';
      });
      await Voice.say(_line);
      if (!mounted) return;
      if (_round >= rounds) {
        setState(() => _line = "Look! It's growing!|Ta-da!");
        Sfx.tada();
        await Voice.say(_line);
        if (mounted) finishGame(context, Skill.letters, 'Letter Garden', game: 'letters', maxLevel: maxLevel);
        return;
      }
      if (_round == 4) await danceBreak(context);
      if (_round == 6 && mounted) await starCatch(context);
      if (mounted) _newRound();
    } else {
      final oops = Juice.oops();
      setState(() {
        _wobble++;
        _mood = Mood.laugh;
        _line = '$oops|Which sound comes next?|${_word.$3[_spelled]}!';
      });
      Voice.say(_line);
    }
  }

  Widget _spellBody() => Column(
        children: [
          const SizedBox(height: 6),
          TweenAnimationBuilder<double>(
            key: ValueKey(_letterPop),
            tween: Tween(begin: 0, end: 1),
            duration: const Duration(milliseconds: 800),
            curve: Curves.elasticOut,
            builder: (_, v, c) => Transform.scale(scale: .4 + v * .6, child: c),
            child: GestureDetector(
              onTap: () => Voice.say("Let's spell ${_word.$1}!"),
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(color: Colors.white.withValues(alpha: .85), borderRadius: BorderRadius.circular(30), border: Border.all(color: C.sun, width: 5)),
                child: Art(_word.$2, size: 120),
              ),
            ),
          ),
          const SizedBox(height: 14),
          // The word, filling in letter by letter
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              for (var k = 0; k < _word.$1.length; k++)
                AnimatedContainer(
                  duration: const Duration(milliseconds: 250),
                  width: 70,
                  height: 80,
                  margin: const EdgeInsets.symmetric(horizontal: 5),
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: k < _spelled ? C.sun : Colors.white.withValues(alpha: .7),
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: Colors.white, width: 4),
                  ),
                  child: Text(k < _spelled ? _word.$1[k] : '', style: T.l(52, color: C.ink)),
                ),
            ],
          ),
          const Spacer(),
          Wrap(
            alignment: WrapAlignment.center,
            spacing: 12,
            runSpacing: 12,
            children: [
              for (var i = 0; i < _tiles.length; i++)
                _tiles[i].isEmpty
                    ? const SizedBox(width: 84, height: 84)
                    : GestureDetector(
                        onTapDown: (d) => _tapTile(i, d.globalPosition),
                        child: TweenAnimationBuilder<double>(
                          key: ValueKey('t$_round$i${_wobbles['t$i'] ?? 0}'),
                          tween: Tween(begin: 0, end: 1),
                          duration: Duration(milliseconds: 500 + i * 120),
                          curve: Curves.elasticOut,
                          builder: (_, v, c) => Transform.scale(scale: v, child: c),
                          child: Container(
                            width: 84,
                            height: 84,
                            alignment: Alignment.center,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: const [C.berry, C.aqua, C.lilac, C.peach][i % 4],
                              border: Border.all(color: Colors.white, width: 5),
                              boxShadow: const [BoxShadow(color: C.shadow, offset: Offset(0, 6))],
                            ),
                            child: Text(_tiles[i], style: T.l(48, color: Colors.white)),
                          ),
                        ),
                      ),
            ],
          ),
          const SizedBox(height: 24),
        ],
      );

  @override
  Widget build(BuildContext context) {
    return GameFrame(
      host: 'momo',
      level: _level,
      scene: 'garden',
      round: _round,
      total: rounds,
      line: _line,
      mood: _mood,
      bounce: _bounce,
      wobble: _wobble,
      onIdle: () => Voice.say(_question()),
      body: _mode == 4 ? _spellBody() : Column(
        children: [
          // The big letter, like a sun. Tap to hear it again.
          GestureDetector(
            onTap: () {
              Sfx.sparkle();
              setState(() => _letterPop++);
              Voice.say(_mode == 1 ? _target.intro : _question());
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
                child: _mode == 2
                    ? const Icon(Icons.volume_up_rounded, size: 56, color: C.ink)
                    : Text(_mode == 3 ? _target.letter.toUpperCase() : '${_target.letter.toUpperCase()}${_target.letter}', style: T.l(_mode == 3 ? 70 : 52, color: C.ink)),
              ),
            ),
          ),
          // Floating bubbles
          Expanded(
            child: LayoutBuilder(builder: (context, box) {
              final size = _choices.length > 4 ? 88.0 : 108.0;
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
                                child: _Bubble(art: p.art, size: size, letter: switch (_mode) {
                                  2 => _hard ? p.letter : p.letter.toUpperCase(),
                                  3 => p.letter,
                                  _ => null,
                                }),
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
                          child: _Sway(seed: i, child: Art(_flowers[i % _flowers.length], size: 46)),
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
  const _Bubble({required this.art, required this.size, this.letter});
  final String art;
  final double size;
  final String? letter;

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
          Center(child: letter != null ? Text(letter!, style: T.l(size * .5, color: const Color(0xFF5B3FC4))) : Art(art, size: size * .68)),
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
