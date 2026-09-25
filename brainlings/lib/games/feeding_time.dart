import 'dart:math';

import 'package:flutter/material.dart';

import '../services/sfx.dart';
import '../services/voice.dart';
import '../state.dart';
import '../theme.dart';
import '../widgets/art.dart';
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
    ('apple', 'apple', 'apples'),
    ('strawberry', 'strawberry', 'strawberries'),
    ('banana', 'banana', 'bananas'),
    ('blueberry', 'blueberry', 'blueberries'),
    ('cookie', 'cookie', 'cookies'),
    ('orange', 'orange', 'oranges'),
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
  String get _ask =>
      'Can you give me ${numberWords[_target]} ${_target == 1 ? _fruit.$2 : _fruit.$3}, please?';

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
    _line = _round == 0 ? 'My tummy is rumbling!|$_ask' : _ask;
    setState(() {});
    Voice.say(_line);
  }

  void _toggle(int i) {
    if (_busy) return;
    setState(() => _inBowl[i] = !_inBowl[i]);
    Sfx.pop();
    Voice.say('${numberWordsCap[_count]}!');
  }

  Future<void> _feed() async {
    if (_busy) return;
    _busy = true;
    if (_count == _target) {
      Sfx.chomp();
      setState(() {
        _mood = Mood.munch;
        _bounce++;
        _line = '${yayLine(_r)}|${numberWordsCap[_target]}!|Nom nom nom!';
        for (var i = 0; i < _inBowl.length; i++) {
          _inBowl[i] = false;
        }
      });
      app.learned(Skill.numbers);
      await Future.delayed(const Duration(milliseconds: 400));
      Sfx.correct();
      await Voice.say(_line);
      if (!mounted) return;
      setState(() => _mood = Mood.cheer);
      await Future.delayed(const Duration(milliseconds: 500));
      _round++;
      if (!mounted) return;
      if (_round >= rounds) {
        finishGame(context, Skill.numbers, 'Feeding Time');
      } else {
        _newRound();
      }
    } else {
      Sfx.tryAgain();
      final oops = _count > _target
          ? 'Whoa! That\'s too many for my little tummy!'
          : _count == 0
          ? 'My bowl is empty! Tap the fruit to fill it up.'
          : 'Hmm, I\'m still hungry. I need a few more!';
      setState(() {
        _mood = _count > _target ? Mood.wow : Mood.think;
        _wobble++;
        _line = '$oops|$_ask';
      });
      await Voice.say(_line);
      if (mounted) setState(() => _mood = Mood.hungry);
    }
    _busy = false;
  }

  @override
  Widget build(BuildContext context) {
    return GameFrame(
      scene: 'orchard',
      round: _round,
      total: rounds,
      line: _line,
      mood: _mood,
      bounce: _bounce,
      wobble: _wobble,
      body: Column(
        children: [
          const SizedBox(height: 4),
          // The fruit to pick from
          Expanded(
            flex: 5,
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: .55),
                borderRadius: BorderRadius.circular(32),
                border: Border.all(color: Colors.white, width: 4),
              ),
              child: Center(
                child: Wrap(
                  alignment: WrapAlignment.center,
                  spacing: 6,
                  runSpacing: 6,
                  children: [
                    for (var i = 0; i < _inBowl.length; i++)
                      AnimatedScale(
                        duration: const Duration(milliseconds: 220),
                        curve: Curves.easeOutBack,
                        scale: _inBowl[i] ? 0 : 1,
                        child: GestureDetector(
                          onTap: _inBowl[i] ? null : () => _toggle(i),
                          child: _Bobbing(
                            seed: i,
                            child: Art(_fruit.$1, size: 58),
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(height: 10),
          // The bowl and the counter
          SizedBox(
            height: 130,
            child: Row(
              children: [
                Expanded(
                  child: Stack(
                    alignment: Alignment.bottomCenter,
                    children: [
                      const Positioned.fill(child: Art('bowl', size: 200)),
                      Positioned(
                        left: 30,
                        right: 30,
                        bottom: 52,
                        child: Wrap(
                          alignment: WrapAlignment.center,
                          spacing: -10,
                          runSpacing: -18,
                          children: [
                            for (var i = 0; i < _inBowl.length; i++)
                              if (_inBowl[i])
                                TweenAnimationBuilder<double>(
                                  key: ValueKey('b$i'),
                                  tween: Tween(begin: 0, end: 1),
                                  duration: const Duration(milliseconds: 420),
                                  curve: Curves.elasticOut,
                                  builder: (_, v, c) => Transform.translate(
                                    offset: Offset(0, (1 - v) * -80),
                                    child: Transform.scale(
                                      scale: .5 + v * .5,
                                      child: c,
                                    ),
                                  ),
                                  child: GestureDetector(
                                    onTap: () => _toggle(i),
                                    child: Art(_fruit.$1, size: 40),
                                  ),
                                ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                AnimatedSwitcher(
                  duration: const Duration(milliseconds: 250),
                  transitionBuilder: (c, a) =>
                      ScaleTransition(scale: a, child: c),
                  child: Container(
                    key: ValueKey(_count),
                    width: 78,
                    height: 78,
                    alignment: Alignment.center,
                    decoration: const BoxDecoration(
                      color: C.paper,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(color: C.shadow, offset: Offset(0, 5)),
                      ],
                    ),
                    child: Text('$_count', style: T.l(44)),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 10),
          Chunky(
            color: C.berry,
            shadow: C.berryDeep,
            onTap: _feed,
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Art(_fruit.$1, size: 34),
                const SizedBox(width: 10),
                const Text('Feed me!'),
              ],
            ),
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}

/// Fruit gently bobbing, as if hanging from a branch in the breeze.
class _Bobbing extends StatefulWidget {
  const _Bobbing({required this.seed, required this.child});
  final int seed;
  final Widget child;

  @override
  State<_Bobbing> createState() => _BobbingState();
}

class _BobbingState extends State<_Bobbing>
    with SingleTickerProviderStateMixin {
  late final _c = AnimationController(
    vsync: this,
    duration: Duration(milliseconds: 1600 + widget.seed * 130),
  )..repeat(reverse: true);

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
    animation: _c,
    builder: (_, c) => Transform.rotate(angle: (_c.value - .5) * .16, child: c),
    child: widget.child,
  );
}
