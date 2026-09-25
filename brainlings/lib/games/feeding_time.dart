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
  static const rounds = 8;
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
  List<GlobalKey> _fruitKeys = [];

  static const maxLevel = 7;
  final _level = app.levelOf('feeding');
  int _mode = 1; // 1 feed, 2 more or fewer, 3 adding, 4 taking away
  int _round = 0;
  int _target = 1;
  // plates for modes 2 to 4
  int _a = 0, _b = 0;
  bool _askMore = true;
  bool _plateEaten = false;
  int _gone = 0; // fruit Bibi ate from the plate (mode 4)
  bool _solved = false; // the sum card shows the answer
  bool _explained = false; // Bibi has explained take away and minus
  int _eatenPlate = -1;
  (String, String, String) _fruit = fruits.first;
  List<bool> _eaten = [];
  int _count = 0;
  bool _watchRound = false;
  List<int>? _choices; // numbers to pick from in a watch round
  bool _reveal = false; // show what was eaten after a wrong guess
  String _line = '';
  Mood _mood = Mood.hungry;
  int _bounce = 0, _wobble = 0;
  bool _busy = false;
  int _pop = 0; // makes the big number pop each time

  bool get _big => _level >= 5;
  int get _max => _big ? 10 : (app.age <= 4 ? 5 : (app.age == 5 ? 7 : 10));
  String get _ask => 'Can you give me ${numberWords[_target]} ${_target == 1 ? _fruit.$2 : _fruit.$3}, please?';

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _newRound());
  }

  Future<void> _newRound() async {
    // Levels 5 to 7 use bigger numbers: sums, take away, then a mix.
    _mode = switch (_level) {
      <= 4 => _level,
      5 => 3,
      6 => 4,
      7 => 2 + _r.nextInt(3),
      _ => 1 + _r.nextInt(4),
    };
    _choices = null;
    _reveal = false;
    _solved = false;
    _busy = false;
    _plateEaten = false;
    _eatenPlate = -1;
    _gone = 0;
    _fruit = fruits[_r.nextInt(fruits.length)];
    final intro = _round == 0 ? '${levelLine(_level)}|' : '';
    final top = _big ? 10 : (app.age <= 4 ? 5 : (app.age == 5 ? 7 : 9));
    if (_mode == 2) {
      _a = 1 + _r.nextInt(top);
      do {
        _b = 1 + _r.nextInt(top);
      } while (_b == _a);
      _askMore = _r.nextBool();
      _mood = Mood.think;
      _line = '$intro${_round == 0 ? "Let's look at my plates!|" : ''}${_askMore ? 'Which plate has more?' : 'Which plate has fewer?'}';
      setState(() {});
      Voice.say(_line);
      return;
    }
    if (_mode == 3) {
      _a = (_big ? 2 : 1) + _r.nextInt(max(2, top ~/ 2));
      _b = 1 + _r.nextInt(max(2, top ~/ 2));
      if (_a + _b > 10) _b = 10 - _a;
      _target = _a + _b;
      _choices = _options(_target);
      _mood = Mood.think;
      _line = '$intro${_round == 0 ? 'Sum time!|' : ''}${numberWordsCap[_a]}!|Plus!|${numberWordsCap[_b]}!|How many altogether?';
      setState(() {});
      Voice.say(_line);
      return;
    }
    if (_mode == 4) {
      _a = (_big ? 5 : 3) + _r.nextInt(max(2, top - (_big ? 4 : 2)));
      _gone = 1 + _r.nextInt(_a - 1);
      _target = _a - _gone;
      _busy = true;
      _mood = Mood.hungry;
      _line = '$intro${_round == 0 ? 'Snack time! Watch my plate!|' : ''}Count the fruit on my plate!';
      setState(() {});
      await Voice.say(_line);
      await Future.delayed(const Duration(milliseconds: 1600));
      if (!mounted) return;
      setState(() {
        _line = 'Now I\'ll eat some! Munch munch!';
        _plateEaten = true;
        _mood = Mood.munch;
        _bounce++;
      });
      Sfx.chomp();
      await Voice.say(_line);
      if (!mounted) return;
      setState(() {
        _choices = _options(_target);
        _mood = Mood.think;
        // "Take away" and "minus" mean the same thing. The first time in a
        // game Bibi explains the sign; after that both words are used.
        final word = !_explained || _r.nextBool() ? 'Take away!' : 'Minus!';
        _line = '${numberWordsCap[_a]}!|$word|${numberWordsCap[_gone]}!|'
            '${_explained ? '' : 'Take away means some go away.|This sign means take away. We can also call it minus!|'}How many are left?';
        _explained = true;
        _busy = false;
      });
      Voice.say(_line);
      return;
    }
    _watchRound = _round == 2 || _round == 5 || _round == 7;
    _target = 1 + _r.nextInt(_watchRound ? min(_max, 6) : _max);
    if (_watchRound && _target < 2) _target = 2;
    final shown = min(_target + (_watchRound ? 1 : 3), 10);
    _eaten = List.filled(shown, false);
    _fruitKeys = List.generate(shown, (_) => GlobalKey());
    _count = 0;
    _choices = null;
    _reveal = false;
    _busy = false;
    _mood = Mood.hungry;
    if (!_watchRound) {
      _line = _round == 0 ? '${intro}My tummy is rumbling!|$_ask' : _ask;
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
    setState(() {
      _choices = _options(_target);
      _mood = Mood.think;
      _line = 'How many did I eat?';
      _busy = false;
    });
    Voice.say(_line);
  }

  List<int> _options(int n) {
    final o = <int>{n};
    while (o.length < 3) {
      final d = n + _r.nextInt(5) - 2;
      if (d >= 0 && d <= 10) o.add(d);
    }
    return o.toList()..shuffle(_r);
  }

  final _plateKeys = [GlobalKey(), GlobalKey()];

  /// Mode 2: the child taps the plate with more (or fewer).
  Future<void> _pickPlate(int i, TapDownDetails d) async {
    if (_busy) return;
    final pickedA = i == 0;
    final aMore = _a > _b;
    final right = _askMore ? pickedA == aMore : pickedA != aMore;
    if (right) {
      _busy = true;
      app.learned(Skill.numbers);
      final cheer = Juice.correct(context, at: d.globalPosition);
      final from = _rectOf(_plateKeys[i]);
      final mouth = _rectOf(_mouthKey);
      setState(() {
        _mood = Mood.dance;
        _bounce++;
        _line = '$cheer|${_askMore ? 'Yes! That plate has more!' : 'Yes! That plate has fewer!'}|${numberWordsCap[pickedA ? _a : _b]}!';
      });
      final say = Voice.say(_line);
      if (from != null && mouth != null) {
        for (var k = 0; k < 3 && mounted; k++) {
          Sfx.whoosh();
          await FlyingArt.go(context, _fruit.$1, from, Offset(mouth.center.dx, mouth.top + mouth.height * .45));
          Sfx.chomp();
        }
      }
      setState(() => _eatenPlate = i);
      await say;
      await _next();
    } else {
      setState(() {
        _wobble++;
        _mood = Mood.laugh;
        _line = '${Juice.oops()}|Hmm, count them both. Try again!';
      });
      Voice.say(_line);
    }
  }

  Widget _numberBubbles() => Row(
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
      );

  /// Levels 2 to 4: plates of fruit to compare, add up and take away from.
  Widget _platesBody() {
    final plates = <Widget>[];
    if (_mode == 2) {
      for (var i = 0; i < 2; i++) {
        plates.add(GestureDetector(
          onTapDown: (d) => _pickPlate(i, d),
          child: _Bob(seed: i + 3, child: _Plate(key: _plateKeys[i], count: i == 0 ? _a : _b, art: _fruit.$1, empty: _eatenPlate == i)),
        ));
      }
    } else if (_mode == 3) {
      plates
        ..add(_Plate(count: _a, art: _fruit.$1))
        ..add(Text('+', style: T.l(64, color: Colors.white).copyWith(shadows: const [Shadow(color: C.shadow, blurRadius: 8)])))
        ..add(_Plate(count: _b, art: _fruit.$1));
    } else {
      plates.add(_Plate(count: _a, art: _fruit.$1, gone: _plateEaten ? _gone : 0));
    }
    return Column(
      children: [
        const SizedBox(height: 8),
        Expanded(
          flex: 4,
          child: Center(
            child: Wrap(alignment: WrapAlignment.center, crossAxisAlignment: WrapCrossAlignment.center, spacing: 12, runSpacing: 12, children: plates),
          ),
        ),
        // The sum on a big card: 2 + 1 = ? and 5 - 2 = ?, the answer pops in.
        if (_mode == 3 && _choices != null) _SumCard(a: _a, sign: '+', b: _b, answer: _solved ? _target : null),
        if (_mode == 4 && _plateEaten && _choices != null) _SumCard(a: _a, sign: '-', b: _gone, answer: _solved ? _target : null),
        SizedBox(
          height: 190,
          child: Stack(
            alignment: Alignment.bottomCenter,
            children: [
              Bibi(mood: _mood, size: 180, bounce: _bounce, wobble: _wobble, onTap: () {
                Sfx.giggle();
                Voice.say(_line);
              }),
              Positioned(bottom: 62, child: SizedBox(key: _mouthKey, width: 60, height: 40)),
            ],
          ),
        ),
        if (_choices != null) Padding(padding: const EdgeInsets.only(bottom: 12), child: _numberBubbles()) else const SizedBox(height: 12),
      ],
    );
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
        _solved = true;
        _line = switch (_mode) {
          3 => '$cheer|${numberWordsCap[_a]}!|Plus!|${numberWordsCap[_b]}!|Makes!|${numberWordsCap[_target]}!',
          4 => '$cheer|${numberWordsCap[_target]}!|Yummy in my tummy!',
          _ => '$cheer|${numberWordsCap[_target]}!|Yummy in my tummy!',
        };
      });
      await Voice.say(_line);
      await _next();
    } else {
      final oops = Juice.oops();
      setState(() {
        _reveal = true;
        _wobble++;
        _mood = Mood.laugh;
        _line = switch (_mode) {
          3 => '$oops|Count them all together!',
          4 => '$oops|How many are left?',
          _ => '$oops|How many did I eat?',
        };
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
      if (mounted) finishGame(context, Skill.numbers, 'Feeding Time', game: 'feeding', maxLevel: maxLevel);
      return;
    }
    if (_round == 4) await danceBreak(context);
      if (_round == 6 && mounted) await starCatch(context);
    if (mounted) _newRound();
  }

  @override
  Widget build(BuildContext context) {
    return GameFrame(
      host: 'pip',
      level: _level,
      scene: 'orchard',
      round: _round,
      total: rounds,
      line: _line,
      mood: _mood,
      showBibi: false,
      body: _mode != 1 ? _platesBody() : Column(
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

/// A plate of fruit. Big, round and easy to count.
class _Plate extends StatelessWidget {
  const _Plate({super.key, required this.count, required this.art, this.gone = 0, this.empty = false});
  final int count;
  final String art;
  final int gone;
  final bool empty;

  @override
  Widget build(BuildContext context) {
    final size = count > 6 ? 34.0 : 44.0;
    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      width: 150,
      height: 150,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: const RadialGradient(colors: [Colors.white, Color(0xFFF3ECFF)]),
        border: Border.all(color: Colors.white, width: 6),
        boxShadow: const [BoxShadow(color: C.shadow, offset: Offset(0, 6), blurRadius: 4)],
      ),
      child: Center(
        child: Wrap(
          alignment: WrapAlignment.center,
          runAlignment: WrapAlignment.center,
          spacing: 2,
          runSpacing: 2,
          children: [
            for (var i = 0; i < count; i++)
              AnimatedOpacity(
                duration: Duration(milliseconds: 250 + i * 120),
                opacity: empty || i >= count - gone ? 0 : 1,
                child: AnimatedScale(
                  duration: Duration(milliseconds: 250 + i * 120),
                  scale: empty || i >= count - gone ? 0 : 1,
                  child: Art(art, size: size),
                ),
              ),
          ],
        ),
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


/// A sum written big, like on the classroom board: 5 - 2 = ?
class _SumCard extends StatelessWidget {
  const _SumCard({required this.a, required this.sign, required this.b, this.answer});
  final int a;
  final String sign;
  final int b;
  final int? answer;

  @override
  Widget build(BuildContext context) {
    Widget part(String t, Color c) => Padding(
          padding: const EdgeInsets.symmetric(horizontal: 6),
          child: Text(t, style: T.l(44, color: c)),
        );
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 4),
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 4),
      decoration: BoxDecoration(
        color: const Color(0xFF2F6B4F),
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: const Color(0xFFB98A5A), width: 5),
      ),
      child: Row(mainAxisSize: MainAxisSize.min, children: [
        part('$a', Colors.white),
        part(sign == '+' ? '+' : '\u2212', C.sun),
        part('$b', Colors.white),
        part('=', C.sun),
        AnimatedSwitcher(
          duration: const Duration(milliseconds: 350),
          transitionBuilder: (c, a) => ScaleTransition(scale: CurvedAnimation(parent: a, curve: Curves.elasticOut), child: c),
          child: KeyedSubtree(key: ValueKey(answer), child: part(answer == null ? '?' : '$answer', answer == null ? const Color(0xFFFFB3D1) : C.sun)),
        ),
      ]),
    );
  }
}
