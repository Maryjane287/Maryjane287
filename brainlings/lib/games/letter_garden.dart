import 'dart:math';

import 'package:flutter/material.dart';

import '../services/sfx.dart';
import '../services/voice.dart';
import '../state.dart';
import '../theme.dart';
import '../widgets/bibi.dart';
import '../widgets/game_frame.dart';
import '../widgets/ui.dart';

/// One letter, the sound it makes, and a picture that starts with it.
class Phonic {
  const Phonic(this.letter, this.sound, this.emoji, this.word);
  final String letter;
  final String sound;
  final String emoji;
  final String word;
}

const phonics = [
  Phonic('a', 'ah', '🐜', 'ant'),
  Phonic('b', 'buh', '🐻', 'bear'),
  Phonic('c', 'kuh', '🐱', 'cat'),
  Phonic('d', 'duh', '🐶', 'dog'),
  Phonic('e', 'eh', '🥚', 'egg'),
  Phonic('f', 'fff', '🐟', 'fish'),
  Phonic('g', 'guh', '🦍', 'gorilla'),
  Phonic('h', 'huh', '🎩', 'hat'),
  Phonic('l', 'lll', '🦁', 'lion'),
  Phonic('m', 'mmm', '🐒', 'monkey'),
  Phonic('n', 'nnn', '🪺', 'nest'),
  Phonic('o', 'oh', '🐙', 'octopus'),
  Phonic('p', 'puh', '🐷', 'pig'),
  Phonic('r', 'rrr', '🌈', 'rainbow'),
  Phonic('s', 'sss', '☀️', 'sun'),
  Phonic('t', 'tuh', '🐢', 'turtle'),
  Phonic('z', 'zzz', '🦓', 'zebra'),
];

/// Letter Garden: match a letter's sound to a picture and a flower blooms.
class LetterGarden extends StatefulWidget {
  const LetterGarden({super.key});

  @override
  State<LetterGarden> createState() => _LetterGardenState();
}

class _LetterGardenState extends State<LetterGarden> {
  static const rounds = 5;
  final _r = Random();
  int _round = 0;
  late Phonic _target;
  late List<Phonic> _choices;
  final _used = <String>{};
  String _line = '';
  Mood _mood = Mood.happy;
  int _bounce = 0, _wobble = 0;
  String? _wrong;
  bool _busy = false;

  @override
  void initState() {
    super.initState();
    _newRound();
  }

  void _newRound() {
    final pool = phonics.where((p) => !_used.contains(p.letter)).toList()..shuffle(_r);
    _target = pool.first;
    _used.add(_target.letter);
    final others = phonics.where((p) => p.letter != _target.letter).toList()..shuffle(_r);
    _choices = [_target, others[0], others[1]]..shuffle(_r);
    _wrong = null;
    _mood = Mood.happy;
    _line = 'This is ${_target.letter.toUpperCase()}. It says ${_target.sound}. Which picture starts with ${_target.sound}?';
    setState(() {});
    Voice.say(_line);
  }

  Future<void> _pick(Phonic p) async {
    if (_busy) return;
    _busy = true;
    if (p.letter == _target.letter) {
      Sfx.correct();
      app.learned(Skill.letters);
      setState(() {
        _mood = Mood.cheer;
        _bounce++;
        _round++;
        _line = '${yayLine(_r)} ${_target.sound}, ${_target.sound}, ${_target.word}!';
      });
      await Voice.say(_line);
      if (!mounted) return;
      if (_round >= rounds) {
        finishGame(context, Skill.letters, 'Letter Garden');
      } else {
        _newRound();
      }
    } else {
      Sfx.tryAgain();
      setState(() {
        _wrong = p.letter;
        _mood = Mood.puzzled;
        _wobble++;
        _line = 'That\'s ${'aeiou'.contains(p.word[0]) ? 'an' : 'a'} ${p.word}. ${p.word} starts with ${p.sound}. Listen: ${_target.sound}. Try again!';
      });
      await Voice.say(_line);
      if (mounted) setState(() => _mood = Mood.happy);
    }
    _busy = false;
  }

  @override
  Widget build(BuildContext context) {
    return GameFrame(
      round: _round,
      total: rounds,
      line: _line,
      mood: _mood,
      bounce: _bounce,
      wobble: _wobble,
      body: Column(
        children: [
          // The big letter, tap to hear it
          GestureDetector(
            onTap: () => Voice.say('${_target.letter.toUpperCase()}. ${_target.sound}. ${_target.sound}.'),
            child: TweenAnimationBuilder<double>(
              key: ValueKey(_target.letter),
              tween: Tween(begin: 0, end: 1),
              duration: const Duration(milliseconds: 700),
              curve: Curves.elasticOut,
              builder: (_, v, c) => Transform.scale(scale: v, child: c),
              child: Container(
                width: 124,
                height: 124,
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: C.paper,
                  borderRadius: BorderRadius.circular(34),
                  border: Border.all(color: C.lilac, width: 5),
                  boxShadow: const [BoxShadow(color: C.shadow, offset: Offset(0, 6))],
                ),
                child: Text('${_target.letter.toUpperCase()}${_target.letter}', style: T.l(64, color: C.lilacDeep)),
              ),
            ),
          ),
          const Spacer(),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              for (final p in _choices)
                AnimatedOpacity(
                  duration: const Duration(milliseconds: 250),
                  opacity: _wrong == p.letter ? .45 : 1,
                  child: Chunky(
                    color: C.paper,
                    shadow: C.shadow,
                    radius: 28,
                    padding: const EdgeInsets.all(14),
                    onTap: () => _pick(p),
                    child: Text(p.emoji, style: const TextStyle(fontSize: 58)),
                  ),
                ),
            ],
          ),
          const Spacer(),
          // The garden: one flower blooms for each right answer
          Container(
            height: 110,
            padding: const EdgeInsets.symmetric(horizontal: 8),
            decoration: const BoxDecoration(
              color: Color(0xFF9A6A43),
              borderRadius: BorderRadius.vertical(top: Radius.circular(40), bottom: Radius.circular(24)),
              boxShadow: [BoxShadow(color: Color(0xFF6E4A2D), offset: Offset(0, 6))],
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                for (var i = 0; i < rounds; i++)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 16),
                    child: i < _round
                        ? TweenAnimationBuilder<double>(
                            tween: Tween(begin: 0, end: 1),
                            duration: const Duration(milliseconds: 900),
                            curve: Curves.elasticOut,
                            builder: (_, v, c) => Transform.scale(scale: v, alignment: Alignment.bottomCenter, child: c),
                            child: Text(const ['🌷', '🌻', '🌸', '🌼', '🌺'][i], style: const TextStyle(fontSize: 48)),
                          )
                        : Container(
                            width: 22,
                            height: 12,
                            decoration: BoxDecoration(color: const Color(0xFF6E4A2D), borderRadius: BorderRadius.circular(10)),
                          ),
                  ),
              ],
            ),
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}
