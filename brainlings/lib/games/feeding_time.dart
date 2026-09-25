import 'dart:math';

import 'package:flutter/material.dart';

import '../services/sfx.dart';
import '../services/voice.dart';
import '../state.dart';
import '../theme.dart';
import '../widgets/bibi.dart';
import '../widgets/game_frame.dart';
import '../widgets/ui.dart';

/// Feeding Time: pick exactly the right number of fruits for a hungry creature.
class FeedingTime extends StatefulWidget {
  const FeedingTime({super.key});

  @override
  State<FeedingTime> createState() => _FeedingTimeState();
}

class _FeedingTimeState extends State<FeedingTime> {
  static const rounds = 5;
  static const fruits = [
    ('🍎', 'apple', 'apples'),
    ('🍓', 'strawberry', 'strawberries'),
    ('🍌', 'banana', 'bananas'),
    ('🫐', 'blueberry', 'blueberries'),
    ('🍪', 'cookie', 'cookies'),
    ('🍊', 'orange', 'oranges'),
  ];
  final _r = Random();
  int _round = 0;
  late int _target;
  late (String, String, String) _fruit;
  late List<bool> _inBowl;
  String _line = '';
  Mood _mood = Mood.hungry;
  int _bounce = 0, _wobble = 0;
  bool _busy = false;

  int get _max => app.age <= 4 ? 5 : (app.age == 5 ? 7 : 10);
  int get _count => _inBowl.where((b) => b).length;

  @override
  void initState() {
    super.initState();
    _newRound();
  }

  void _newRound() {
    _target = 1 + _r.nextInt(_max);
    _fruit = fruits[_r.nextInt(fruits.length)];
    _inBowl = List.filled(min(_target + 3, 10), false);
    _mood = Mood.hungry;
    final word = _target == 1 ? _fruit.$2 : _fruit.$3;
    _line = _round == 0
        ? 'My tummy is rumbling! Can you give me ${numberWords[_target]} $word, please?'
        : 'Yum! Now can I have ${numberWords[_target]} $word?';
    setState(() {});
    Voice.say(_line);
  }

  void _toggle(int i) {
    if (_busy) return;
    setState(() => _inBowl[i] = !_inBowl[i]);
    Sfx.pop();
    Voice.say(_count == 0 ? 'zero' : numberWords[_count]);
  }

  Future<void> _feed() async {
    if (_busy) return;
    _busy = true;
    if (_count == _target) {
      Sfx.chomp();
      setState(() {
        _mood = Mood.cheer;
        _bounce++;
        _line = '${yayLine(_r)} ${_cap(numberWords[_target])}! Nom nom nom!';
        for (var i = 0; i < _inBowl.length; i++) {
          _inBowl[i] = false;
        }
      });
      app.learned(Skill.numbers);
      await Future.delayed(const Duration(milliseconds: 400));
      Sfx.correct();
      await Voice.say(_line);
      _round++;
      if (!mounted) return;
      if (_round >= rounds) {
        finishGame(context, Skill.numbers, 'Feeding Time');
      } else {
        _newRound();
      }
    } else {
      Sfx.tryAgain();
      final tooMany = _count > _target;
      setState(() {
        _mood = Mood.puzzled;
        _wobble++;
        _line = tooMany
            ? 'Whoa, that\'s ${numberWords[_count]}! My tummy only wants ${numberWords[_target]}.'
            : _count == 0
                ? 'My bowl is empty! Can you find ${numberWords[_target]}?'
                : 'Hmm, I see ${numberWords[_count]}. I need ${numberWords[_target]}. Let\'s count again!';
      });
      await Voice.say(_line);
      if (mounted) setState(() => _mood = Mood.hungry);
    }
    _busy = false;
  }

  String _cap(String s) => s[0].toUpperCase() + s.substring(1);

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
          const SizedBox(height: 4),
          // The fruit tree
          Expanded(
            flex: 5,
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                gradient: const RadialGradient(center: Alignment(-.4, -.6), radius: 1.2, colors: [Color(0xFF9BE36A), C.leaf]),
                borderRadius: const BorderRadius.vertical(top: Radius.elliptical(200, 90), bottom: Radius.circular(28)),
                boxShadow: const [BoxShadow(color: C.leafDeep, offset: Offset(0, 6))],
              ),
              child: Center(
                child: Wrap(
                  alignment: WrapAlignment.center,
                  spacing: 6,
                  runSpacing: 6,
                  children: [
                    for (var i = 0; i < _inBowl.length; i++)
                      AnimatedScale(
                        duration: const Duration(milliseconds: 200),
                        scale: _inBowl[i] ? 0 : 1,
                        child: _FruitButton(emoji: _fruit.$1, onTap: _inBowl[i] ? null : () => _toggle(i)),
                      ),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(height: 16),
          // The bowl and the counter
          Row(
            children: [
              Expanded(
                child: Container(
                  constraints: const BoxConstraints(minHeight: 84),
                  padding: const EdgeInsets.fromLTRB(12, 10, 12, 22),
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter, colors: [Color(0xFFD99A5B), Color(0xFFB8773D)]),
                    borderRadius: BorderRadius.vertical(top: Radius.circular(14), bottom: Radius.circular(70)),
                    boxShadow: [BoxShadow(color: Color(0xFF8E5A2B), offset: Offset(0, 6))],
                  ),
                  child: Wrap(
                    alignment: WrapAlignment.center,
                    children: [
                      for (var i = 0; i < _inBowl.length; i++)
                        if (_inBowl[i])
                          TweenAnimationBuilder<double>(
                            key: ValueKey('b$i'),
                            tween: Tween(begin: 0, end: 1),
                            duration: const Duration(milliseconds: 350),
                            curve: Curves.elasticOut,
                            builder: (_, v, c) => Transform.scale(scale: v, child: c),
                            child: _FruitButton(emoji: _fruit.$1, size: 40, onTap: () => _toggle(i)),
                          ),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 12),
              AnimatedSwitcher(
                duration: const Duration(milliseconds: 250),
                transitionBuilder: (c, a) => ScaleTransition(scale: a, child: c),
                child: Container(
                  key: ValueKey(_count),
                  width: 78,
                  height: 78,
                  alignment: Alignment.center,
                  decoration: const BoxDecoration(color: C.paper, shape: BoxShape.circle, boxShadow: [BoxShadow(color: C.shadow, offset: Offset(0, 5))]),
                  child: Text('$_count', style: T.l(44)),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Chunky(
            color: C.berry,
            shadow: C.berryDeep,
            onTap: _feed,
            child: const Row(mainAxisSize: MainAxisSize.min, children: [
              Text('😋', style: TextStyle(fontSize: 28)),
              SizedBox(width: 10),
              Text('Feed me!'),
            ]),
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}

class _FruitButton extends StatelessWidget {
  const _FruitButton({required this.emoji, required this.onTap, this.size = 50});

  final String emoji;
  final VoidCallback? onTap;
  final double size;

  @override
  Widget build(BuildContext context) => GestureDetector(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(2),
          child: Text(emoji, style: TextStyle(fontSize: size, height: 1.1)),
        ),
      );
}
