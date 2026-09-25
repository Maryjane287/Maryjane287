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

/// Feeding Time.
/// Feed rounds: tap fruit and it flies into Bibi's mouth, counted out loud,
/// until Bibi has exactly the number asked for.
/// Watch rounds: Bibi gobbles some fruit and the child says how many.
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
  static const _munch = ['Mmm!', 'Yum!', 'Crunchy!', 'Delicious!'];

  final _r = Random();
  final _mouthKey = GlobalKey();
  late List<GlobalKey> _fruitKeys;

  int _round = 0;
  late int _target;
  late (String, String, String) _fruit;
  late List<bool> _eaten;
  int _count = 0;
  bool _watchRound = false;
  List<int>? _choices; // numbers to pick from in a watch round
  bool _reveal = false; // show what was eaten after a wrong guess
  String _line = '';
  Mood _mood = Mood.hungry;
  int _bounce = 0, _wobble = 0;
  bool _busy = false;
  int _pop = 0; // makes the big number pop each time

  int get _max => app.age <= 4 ? 5 : (app.age == 5 ? 7 : 10);
  String get _ask => 'Can you give me ${numberWords[_target]} ${_target == 1 ? _fruit.$2 : _fruit.$3}, please?';

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _newRound());
  }

  Future<void> _newRound() async {
    _watchRound = _round == 2 || _round == 4;
    _target = 1 + _r.nextInt(_watchRound ? min(_max, 6) : _max);
    if (_watchRound && _target < 2) _target = 2;
    _fruit = fruits[_r.nextInt(fruits.length)];
    final shown = min(_target + (_watchRound ? 1 : 3), 10);
    _eaten = List.filled(shown, false);
    _fruitKeys = List.generate(shown, (_) => GlobalKey());
    _count = 0;
    _choices = null;
    _reveal = false;
    _busy = false;
    _mood = Mood.hungry;
    if (!_watchRound) {
      _line = _round == 0 ? 'My tummy is rumbling!|$_ask' : _ask;
      setState(() {});
      Voice.say(_line);
      return;
    }
    // Watch round: Bibi eats, the child counts.
    _busy = true;
    _line = 'Watch me eat! Count with me!';
    setState(() {});
    await Voice.say(_line);
    await Future.delayed(const Duration(milliseconds: 300));
    for (var i = 0; i < _target && mounted; i++) {
      await _fly(i, auto: true);
      await Future.delayed(const Duration(milliseconds: 650));
    }
    if (!mounted) return;
    final opts = {_target, _target + 1, max(1, _target - 1)}.toList()..shuffle(_r);
    if (opts.length < 3) opts.add(_target + 2);
    setState(() {
      _choices = opts;
      _mood = Mood.think;
      _line = 'How many did I eat?';
      _busy = false;
    });
    Voice.say(_line);
  }

  /// Sends fruit [i] flying in an arc into Bibi's mouth.
  Future<void> _fly(int i, {bool auto = false}) async {
    if (_eaten[i]) return;
    final from = _rectOf(_fruitKeys[i]);
    final mouth = _rectOf(_mouthKey);
    setState(() => _eaten[i] = true);
    Sfx.whoosh();
    if (from != null && mouth != null) {
      final target = Offset(mouth.center.dx, mouth.top + mouth.height * .45);
      await FlyingArt.go(context, _fruit.$1, from, target);
    }
    if (!mounted) return;
    Sfx.chomp();
    final mouthRect = _rectOf(_mouthKey);
    if (mouthRect != null) {
      Juice.starBurst(context, Offset(mouthRect.center.dx, mouthRect.top + mouthRect.height * .4), count: 8, colors: const [Color(0xFFFFD27A), Color(0xFFE8A55B), Colors.white]);
    }
    setState(() {
      _mood = Mood.munch;
      _bounce++;
    });
    if (!auto) {
      _count++;
      _pop++;
      Voice.say('${numberWordsCap[_count]}!');
      if (_count == _target) {
        _busy = true;
        await Future.delayed(const Duration(milliseconds: 500));
        await _win();
      } else {
        Future.delayed(const Duration(milliseconds: 500), () {
          if (mounted && !_busy) setState(() => _mood = Mood.hungry);
        });
      }
    } else {
      Voice.say(_munch[_r.nextInt(_munch.length)]);
    }
  }

  Rect? _rectOf(GlobalKey k) {
    final box = k.currentContext?.findRenderObject() as RenderBox?;
    if (box == null || !box.hasSize) return null;
    return box.localToGlobal(Offset.zero) & box.size;
  }

  Future<void> _win() async {
    app.learned(Skill.numbers);
    final cheer = Juice.correct(context, at: _rectOf(_mouthKey)?.center);
    setState(() {
      _mood = Mood.dance;
      _bounce++;
      _line = '$cheer|${numberWordsCap[_target]}!|Yummy in my tummy!';
    });
    await Voice.say(_line);
    await _next();
  }

  Future<void> _pick(int n, TapDownDetails d) async {
    if (_busy) return;
    if (n == _target) {
      _busy = true;
      app.learned(Skill.numbers);
      final cheer = Juice.correct(context, at: d.globalPosition);
      setState(() {
        _mood = Mood.dance;
        _bounce++;
        _reveal = true;
        _line = '$cheer|${numberWordsCap[_target]}!|Yummy in my tummy!';
      });
      await Voice.say(_line);
      await _next();
    } else {
      final oops = Juice.oops();
      setState(() {
        _reveal = true;
        _wobble++;
        _mood = Mood.laugh;
        _line = '$oops|How many did I eat?';
      });
      Voice.say(_line);
    }
  }

  Future<void> _next() async {
    _round++;
    if (!mounted) return;
    if (_round >= rounds) {
      setState(() {
        _mood = Mood.laugh;
        _line = 'Buuurp! Oops, excuse me!';
      });
      await Voice.say(_line);
      if (mounted) finishGame(context, Skill.numbers, 'Feeding Time');
      return;
    }
    if (_round == 3) await danceBreak(context);
    if (mounted) _newRound();
  }

  @override
  Widget build(BuildContext context) {
    return GameFrame(
      host: 'pip',
      scene: 'orchard',
      round: _round,
      total: rounds,
      line: _line,
      mood: _mood,
      showBibi: false,
      body: Column(
        children: [
          // The fruit, bobbing in the tree
          Expanded(
            flex: 4,
            child: Center(
              child: Wrap(
                alignment: WrapAlignment.center,
                spacing: 10,
                runSpacing: 10,
                children: [
                  for (var i = 0; i < _eaten.length; i++)
                    AnimatedOpacity(
                      duration: const Duration(milliseconds: 120),
                      opacity: _eaten[i] ? 0 : 1,
                      child: GestureDetector(
                        key: _fruitKeys[i],
                        onTap: (_eaten[i] || _busy || _watchRound) ? null : () => _fly(i),
                        child: _Bob(seed: i, child: Art(_fruit.$1, size: 70)),
                      ),
                    ),
                ],
              ),
            ),
          ),
          // Progress: little plates that fill up, and a big popping number
          if (!_watchRound)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 6),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Flexible(
                    child: Wrap(
                      alignment: WrapAlignment.center,
                      spacing: 4,
                      runSpacing: 4,
                      children: [
                        for (var i = 0; i < _target; i++)
                          AnimatedContainer(
                            duration: const Duration(milliseconds: 250),
                            width: 34,
                            height: 34,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: i < _count ? C.sun : Colors.white.withValues(alpha: .7),
                              border: Border.all(color: Colors.white, width: 3),
                            ),
                            child: i < _count ? const Icon(Icons.check_rounded, color: Colors.white, size: 22) : null,
                          ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 10),
                  TweenAnimationBuilder<double>(
                    key: ValueKey(_pop),
                    tween: Tween(begin: 1.8, end: 1),
                    duration: const Duration(milliseconds: 450),
                    curve: Curves.elasticOut,
                    builder: (_, v, c) => Transform.scale(scale: v, child: c),
                    child: Container(
                      width: 70,
                      height: 70,
                      alignment: Alignment.center,
                      decoration: const BoxDecoration(color: C.paper, shape: BoxShape.circle, boxShadow: [BoxShadow(color: C.shadow, offset: Offset(0, 5))]),
                      child: Text('$_count', style: T.l(42)),
                    ),
                  ),
                ],
              ),
            )
          else if (_reveal)
            Wrap(children: [for (var i = 0; i < _target; i++) Art(_fruit.$1, size: 34)]),
          // Big hungry Bibi, mouth wide open
          SizedBox(
            height: 220,
            child: Stack(
              alignment: Alignment.bottomCenter,
              children: [
                Bibi(mood: _mood, size: 210, bounce: _bounce, wobble: _wobble, onTap: () {
                  Sfx.giggle();
                  Voice.say(_line);
                }),
                // Where the fruit lands: Bibi's mouth
                Positioned(bottom: 72, child: SizedBox(key: _mouthKey, width: 60, height: 40)),
              ],
            ),
          ),
          // Watch round: pick how many
          if (_choices != null)
            Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  for (final n in _choices!)
                    GestureDetector(
                      onTapDown: (d) => _pick(n, d),
                      child: _Bob(
                        seed: n,
                        child: Container(
                          width: 84,
                          height: 84,
                          alignment: Alignment.center,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: const [C.berry, C.sun, C.aqua, C.lilac][n % 4],
                            border: Border.all(color: Colors.white, width: 5),
                            boxShadow: const [BoxShadow(color: C.shadow, offset: Offset(0, 6))],
                          ),
                          child: Text('$n', style: T.l(46, color: Colors.white)),
                        ),
                      ),
                    ),
                ],
              ),
            )
          else
            const SizedBox(height: 12),
        ],
      ),
    );
  }
}

/// Gentle bobbing, like fruit hanging in a breeze.
class _Bob extends StatefulWidget {
  const _Bob({required this.seed, required this.child});
  final int seed;
  final Widget child;

  @override
  State<_Bob> createState() => _BobState();
}

class _BobState extends State<_Bob> with SingleTickerProviderStateMixin {
  late final _c = AnimationController(vsync: this, duration: Duration(milliseconds: 1300 + widget.seed * 170))..repeat(reverse: true);

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
        animation: _c,
        builder: (_, c) => Transform.translate(
          offset: Offset(0, (_c.value - .5) * 10),
          child: Transform.rotate(angle: (_c.value - .5) * .2, child: c),
        ),
        child: widget.child,
      );
}

